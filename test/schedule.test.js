/**
 * The daily run: what each computer's scheduler is handed, and what is asked
 * of it, without touching the scheduler of the computer running the tests.
 */
import { deepStrictEqual, match, ok, strictEqual } from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import {
  cronLine,
  install,
  launchdPath,
  launchdPlist,
  notificationCommand,
  parseAt,
  runArgs,
  taskXml,
  TASK_NAME,
  uninstall,
  utf16,
} from "../dist/schedule.js";

function target(over = {}) {
  return {
    platform: "darwin",
    home: "/Users/anna",
    nodeDir: "/usr/local/bin",
    version: "9.9.9",
    configPath: "/Users/anna/.orla-il-banks.json",
    at: { hour: 7, minute: 5 },
    ...over,
  };
}

test("a time of day is read the ways people type it", () => {
  deepStrictEqual(parseAt("7"), { hour: 7, minute: 0 });
  deepStrictEqual(parseAt("07:00"), { hour: 7, minute: 0 });
  deepStrictEqual(parseAt(" 19:30 "), { hour: 19, minute: 30 });
  strictEqual(parseAt("24:00"), null);
  strictEqual(parseAt("7:60"), null);
  strictEqual(parseAt("seven"), null);
  strictEqual(parseAt("7pm"), null);
});

test("the job runs this version, pinned, on the config setup wrote", () => {
  deepStrictEqual(runArgs(target()), [
    "--yes",
    "orla-il-banks@9.9.9",
    "run",
    "--scheduled",
    "--config",
    "/Users/anna/.orla-il-banks.json",
  ]);
});

test("the Mac job: npx next to this node, the hour and minute, logs in the runner's folder", () => {
  const plist = launchdPlist(target());
  match(plist, /<string>finance\.orla\.il-banks<\/string>/);
  match(plist, /<string>\/usr\/local\/bin\/npx<\/string>\s*<string>--yes<\/string>\s*<string>orla-il-banks@9\.9\.9<\/string>/);
  match(plist, /<key>Hour<\/key>\s*<integer>7<\/integer>\s*<key>Minute<\/key>\s*<integer>5<\/integer>/);
  match(plist, /<key>RunAtLoad<\/key>\s*<false\/>/);
  match(plist, /\/Users\/anna\/\.orla-il-banks\/logs\/launchd\.log/);
  strictEqual(launchdPath("/Users/anna"), "/Users/anna/Library/LaunchAgents/finance.orla.il-banks.plist");
  if (process.platform === "darwin") {
    // the Mac's own reader of property lists, on the text the scheduler gets
    const dir = mkdtempSync(join(tmpdir(), "orla-il-plist-"));
    const file = join(dir, "job.plist");
    writeFileSync(file, launchdPlist(target({ configPath: "/Users/anna & co/<odd>.json" })));
    execFileSync("plutil", ["-lint", file]);
  }
});

test("the Windows task: daily, missed starts caught up, no window, no stored password", () => {
  const xml = taskXml(
    target({ platform: "win32", home: "C:\\Users\\Anna Levi", nodeDir: "C:\\Program Files\\nodejs", configPath: "C:\\Users\\Anna Levi\\.orla-il-banks.json" }),
  );
  match(xml, /<StartBoundary>2026-01-01T07:05:00<\/StartBoundary>/);
  match(xml, /<DaysInterval>1<\/DaysInterval>/);
  match(xml, /<StartWhenAvailable>true<\/StartWhenAvailable>/);
  match(xml, /<LogonType>InteractiveToken<\/LogonType>/);
  match(xml, /<Command>conhost\.exe<\/Command>/);
  // paths with spaces stay whole inside cmd's own quoting
  match(
    xml,
    /--headless cmd\.exe \/d \/c &quot;&quot;C:\\Program Files\\nodejs\\npx\.cmd&quot; --yes orla-il-banks@9\.9\.9 run --scheduled --config &quot;C:\\Users\\Anna Levi\\\.orla-il-banks\.json&quot;&quot;/,
  );
  const bytes = utf16(xml);
  deepStrictEqual([...bytes.subarray(0, 2)], [0xff, 0xfe]);
  strictEqual(bytes.subarray(2).toString("utf16le"), xml);
});

test("Linux gets the cron line instead of a job it cannot see", async () => {
  const home = mkdtempSync(join(tmpdir(), "orla-il-home-"));
  const calls = [];
  const out = await install(target({ platform: "linux", home, nodeDir: "/opt/node/bin" }), async (...a) => (calls.push(a), { code: 0, stdout: "", stderr: "" }));
  strictEqual(out.ok, false);
  strictEqual(calls.length, 0);
  match(out.message, /^.*crontab -e/m);
  strictEqual(cronLine(target({ platform: "linux", nodeDir: "/opt/node/bin" })).split(" ").slice(0, 5).join(" "), "5 7 * * *");
});

test("installing on a Mac replaces the old job, then loads the new one", async () => {
  const home = mkdtempSync(join(tmpdir(), "orla-il-home-"));
  const calls = [];
  const exec = async (command, args) => (calls.push([command, ...args].join(" ")), { code: 0, stdout: "", stderr: "" });
  const out = await install(target({ home }), exec);
  strictEqual(out.ok, true);
  match(out.message, /every day at 07:05/);
  ok(existsSync(launchdPath(home)));
  match(calls[0], /^launchctl bootout gui\/\d+\/finance\.orla\.il-banks$/);
  match(calls[1], /^launchctl bootstrap gui\/\d+ .*finance\.orla\.il-banks\.plist$/);
  ok(existsSync(join(home, ".orla-il-banks", "logs")));

  const gone = await uninstall("darwin", home, exec);
  ok(!existsSync(launchdPath(home)));
  strictEqual(gone.message, "The daily run is removed.");
});

test("installing on Windows hands schtasks the XML, and a refusal is said", async () => {
  const home = mkdtempSync(join(tmpdir(), "orla-il-home-"));
  const calls = [];
  const exec = async (command, args) => (calls.push([command, ...args]), { code: 0, stdout: "SUCCESS", stderr: "" });
  const out = await install(target({ platform: "win32", home }), exec);
  strictEqual(out.ok, true);
  deepStrictEqual(calls[0].slice(0, 5), ["schtasks", "/Create", "/TN", TASK_NAME, "/XML"]);
  deepStrictEqual([...readFileSync(calls[0][5]).subarray(0, 2)], [0xff, 0xfe]);

  const refused = await install(target({ platform: "win32", home }), async () => ({ code: 1, stdout: "", stderr: "ERROR: Access is denied." }));
  strictEqual(refused.ok, false);
  match(refused.message, /Access is denied/);
});

test("a notification quotes the text the platform's way", () => {
  const [mac, macArgs] = notificationCommand("darwin", "Orla", 'Max: failed. "invalidPassword"');
  strictEqual(mac, "osascript");
  strictEqual(macArgs[1], 'display notification "Max: failed. \\"invalidPassword\\"" with title "Orla"');
  const [win, winArgs] = notificationCommand("win32", "Orla", "it's broken");
  strictEqual(win, "powershell.exe");
  match(winArgs.at(-1), /ShowBalloonTip\(15000, 'Orla', 'it''s broken', 'Warning'\)/);
  strictEqual(notificationCommand("linux", "Orla", "x"), null);
});
