/**
 * The setup wizard, driven by scripted answers: what it asks, what it keeps,
 * and what never reaches the screen.
 */
import { deepStrictEqual, match, ok, strictEqual } from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, statSync, writeFileSync, chmodSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { bankMenu, parseBankChoice, runSetup } from "../dist/setup.js";

const POSIX = process.platform !== "win32";

function scripted(answers, secrets) {
  const said = [];
  const asked = [];
  return {
    said,
    asked,
    io: {
      say: (line) => said.push(line),
      ask: async (q) => {
        asked.push(q);
        if (!answers.length) throw new Error(`no scripted answer for: ${q}`);
        return answers.shift();
      },
      askSecret: async (q) => {
        asked.push(`[secret] ${q}`);
        if (!secrets.length) throw new Error(`no scripted secret for: ${q}`);
        return secrets.shift();
      },
    },
  };
}

function deps(configPath, over = {}) {
  const calls = { trust: [], checkKey: [] };
  return {
    calls,
    value: {
      configPath,
      version: "9.9.9",
      checkKey: async (token) => {
        calls.checkKey.push(token);
        return { result: "ok", detail: "" };
      },
      ensureBrowser: async () => true,
      trust: async (company, credentials) => {
        calls.trust.push([company, credentials]);
        return true;
      },
      ...over,
    },
  };
}

const KEY = "oit_abcdefghijklmnop";

test("the bank list is numbered in the table's order, and a choice is read by number or id", () => {
  const menu = bankMenu();
  match(menu[0], /^ {2}1\. Bank Hapoalim .*\[hapoalim\]/);
  ok(menu.some((line) => /13\. Isracard/.test(line)));
  deepStrictEqual(parseBankChoice("1, 13"), ["hapoalim", "isracard"]);
  deepStrictEqual(parseBankChoice("hapoalim max 1"), ["hapoalim", "max"]);
  strictEqual(parseBankChoice("99"), null);
  strictEqual(parseBankChoice("hapoalim, nope"), null);
  strictEqual(parseBankChoice("  "), null);
});

test("a full setup: key checked, logins asked, file written for its owner, Hapoalim trusted", async () => {
  const dir = mkdtempSync(join(tmpdir(), "orla-il-setup-"));
  const path = join(dir, "config.json");
  // answers: banks, hapoalim userCode, isracard id, card6Digits, trust now, run now
  const { io, said, asked } = scripted(["1,13", "AB1234", "012345678", "458012", "", "n"], [
    "not-a-key",
    KEY,
    "hapoalim-secret-pw",
    "isracard-secret-pw",
  ]);
  const d = deps(path);
  const outcome = await runSetup(io, d.value);
  deepStrictEqual(outcome, { saved: true, runNow: false });
  deepStrictEqual(d.calls.checkKey, [KEY], "a malformed key is not even sent to Orla");
  const file = JSON.parse(readFileSync(path, "utf8"));
  strictEqual(file.orla.token, KEY);
  deepStrictEqual(file.accounts, [
    { company: "hapoalim", userCode: "AB1234", password: "hapoalim-secret-pw" },
    { company: "isracard", id: "012345678", card6Digits: "458012", password: "isracard-secret-pw" },
  ]);
  if (POSIX) strictEqual(statSync(path).mode & 0o777, 0o600);
  deepStrictEqual(d.calls.trust, [["hapoalim", { userCode: "AB1234", password: "hapoalim-secret-pw" }]]);
  // passwords and the key are asked with the echo off, and never said back
  ok(asked.filter((q) => q.startsWith("[secret]")).length === 4);
  const screen = said.join("\n");
  for (const secret of [KEY, "hapoalim-secret-pw", "isracard-secret-pw"]) ok(!screen.includes(secret), secret);
  match(screen, /npx orla-il-banks@9\.9\.9 run/);
});

test("a key Orla refuses three times saves nothing", async () => {
  const dir = mkdtempSync(join(tmpdir(), "orla-il-setup-"));
  const path = join(dir, "config.json");
  const { io, said } = scripted([], [KEY, KEY, KEY]);
  const d = deps(path, { checkKey: async () => ({ result: "rejected", detail: "" }) });
  deepStrictEqual(await runSetup(io, d.value), { saved: false, runNow: false });
  ok(!existsSync(path));
  match(said.join("\n"), /did not accept this key/);
});

test("a space where the door is off still gets set up, with the reason said", async () => {
  const dir = mkdtempSync(join(tmpdir(), "orla-il-setup-"));
  const path = join(dir, "config.json");
  const { io, said } = scripted(["15", "user1", "n"], [KEY, "pw"]);
  const d = deps(path, { checkKey: async () => ({ result: "door-off", detail: "" }) });
  strictEqual((await runSetup(io, d.value)).saved, true);
  match(said.join("\n"), /not switched on for your space yet/);
});

test("an existing setup is kept and added to when the person says so", async () => {
  const dir = mkdtempSync(join(tmpdir(), "orla-il-setup-"));
  const path = join(dir, "config.json");
  writeFileSync(path, JSON.stringify({ orla: { token: "oit_old_key_1234567" }, accounts: [{ company: "leumi", username: "u", password: "p" }] }));
  if (POSIX) chmodSync(path, 0o600);
  const { io } = scripted(["15", "user1", "", "n"], [KEY, "pw"]);
  await runSetup(io, deps(path).value);
  const file = JSON.parse(readFileSync(path, "utf8"));
  strictEqual(file.orla.token, KEY, "the new key replaces the old one");
  deepStrictEqual(file.accounts.map((a) => a.company), ["leumi", "max"]);
});

test("no browser means no trust and no offer to run now", async () => {
  const dir = mkdtempSync(join(tmpdir(), "orla-il-setup-"));
  const path = join(dir, "config.json");
  const { io, said } = scripted(["1", "AB1234"], [KEY, "pw"]);
  const d = deps(path, { ensureBrowser: async () => false });
  deepStrictEqual(await runSetup(io, d.value), { saved: true, runNow: false });
  deepStrictEqual(d.calls.trust, []);
  ok(!said.join("\n").includes("knows this computer"));
});
