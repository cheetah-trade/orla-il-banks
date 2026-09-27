/**
 * The setup wizard, driven by scripted answers: what it asks, what it keeps,
 * and what never reaches the screen.
 */
import assert, { deepStrictEqual, match, ok, strictEqual } from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, statSync, writeFileSync, chmodSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { bankMenu, identityOf, loginLabel, mergeLogins, parseBankChoice, runSetup } from "../dist/setup.js";

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

function existingSetup(accounts, token = "oit_old_key_1234567") {
  const dir = mkdtempSync(join(tmpdir(), "orla-il-setup-"));
  const path = join(dir, "config.json");
  writeFileSync(path, JSON.stringify({ orla: { token }, accounts }));
  if (POSIX) chmodSync(path, 0o600);
  return path;
}

test("run again, 1: a new key goes in and every login stays", async () => {
  const path = existingSetup([{ company: "leumi", username: "u", password: "p" }]);
  const { io, said } = scripted(["1", "n"], [KEY]);
  const d = deps(path);
  deepStrictEqual(await runSetup(io, d.value), { saved: true, runNow: false });
  const file = JSON.parse(readFileSync(path, "utf8"));
  strictEqual(file.orla.token, KEY);
  deepStrictEqual(file.accounts, [{ company: "leumi", username: "u", password: "p" }]);
  deepStrictEqual(d.calls.checkKey, [KEY]);
  match(said.join("\n"), /Bank Leumi \(…u\)/);
});

test("run again, 2: a bank is added under the key that works, without asking for it", async () => {
  const path = existingSetup([{ company: "leumi", username: "u", password: "p" }]);
  const { io } = scripted(["2", "15", "user1", "n"], ["pw"]);
  const d = deps(path);
  await runSetup(io, d.value);
  const file = JSON.parse(readFileSync(path, "utf8"));
  strictEqual(file.orla.token, "oit_old_key_1234567");
  deepStrictEqual(d.calls.checkKey, [], "the kept key is not asked for again");
  deepStrictEqual(file.accounts.map((a) => a.company), ["leumi", "max"]);
});

test("run again, 2: a login typed again replaces the saved one, never sits beside it", async () => {
  // two entries for one login would log in twice a run, once with the old
  // password, and a bank locks a login after a few failures
  const path = existingSetup([
    { company: "max", username: "user1", password: "old-pw" },
    { company: "max", username: "user2", password: "other-pw" },
  ]);
  const { io, said } = scripted(["2", "15", "user1", "n"], ["new-pw"]);
  await runSetup(io, deps(path).value);
  const file = JSON.parse(readFileSync(path, "utf8"));
  deepStrictEqual(file.accounts, [
    { company: "max", username: "user1", password: "new-pw" },
    { company: "max", username: "user2", password: "other-pw" },
  ]);
  match(said.join("\n"), /Max \(…ser1\): the saved login is replaced/);
  ok(!said.join("\n").includes("new-pw"));
});

test("run again, 3: starting over keeps nothing of the old setup", async () => {
  const path = existingSetup([{ company: "leumi", username: "u", password: "p" }]);
  const { io } = scripted(["3", "15", "user2", "n"], [KEY, "pw"]);
  await runSetup(io, deps(path).value);
  const file = JSON.parse(readFileSync(path, "utf8"));
  strictEqual(file.orla.token, KEY);
  deepStrictEqual(file.accounts, [{ company: "max", username: "user2", password: "pw" }]);
});

test("run again with no clear answer changes nothing", async () => {
  const path = existingSetup([{ company: "leumi", username: "u", password: "p" }]);
  const before = readFileSync(path, "utf8");
  const { io } = scripted(["x", "", "4"], []);
  deepStrictEqual(await runSetup(io, deps(path).value), { saved: false, runNow: false });
  strictEqual(readFileSync(path, "utf8"), before);
});

test("mergeLogins tells logins apart by the field that is not a password", () => {
  const { accounts, replaced } = mergeLogins(
    [{ company: "isracard", id: "111", card6Digits: "458012", password: "a" }],
    [
      { company: "isracard", id: "111", card6Digits: "458012", password: "b" },
      { company: "isracard", id: "222", card6Digits: "458012", password: "c" },
    ],
  );
  deepStrictEqual(accounts.map((a) => `${a.id}:${a.password}`), ["111:b", "222:c"]);
  deepStrictEqual(replaced.map((a) => a.id), ["111"]);
  strictEqual(identityOf({ company: "hapoalim", userCode: "AB12", password: "x" }), "AB12");
  strictEqual(loginLabel({ company: "discount", id: "012345678", password: "x", num: "1" }), "Discount Bank (…5678)");
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

test("setup offers the daily run and sets it at the time typed", async () => {
  const dir = mkdtempSync(join(tmpdir(), "orla-il-setup-"));
  const path = join(dir, "config.json");
  const asked = [];
  // banks, login, daily yes, a bad time, a good one, run now no
  const { io, said } = scripted(["15", "user1", "", "7pm", "19:30", "n"], [KEY, "pw"]);
  const d = deps(path, {
    schedule: async (at) => (asked.push(at), { ok: true, message: "It runs every day at 19:30." }),
  });
  await runSetup(io, d.value);
  deepStrictEqual(asked, [{ hour: 19, minute: 30 }]);
  const screen = said.join("\n");
  match(screen, /A time of day, please/);
  match(screen, /It runs every day at 19:30\./);
  match(screen, /npx orla-il-banks@9\.9\.9 unschedule/);
  ok(!screen.includes("One Zero is not in the daily run"));
});

test("Enter takes 07:00; One Zero is said to stay out of the daily run", async () => {
  const dir = mkdtempSync(join(tmpdir(), "orla-il-setup-"));
  const path = join(dir, "config.json");
  const asked = [];
  // banks 12 (One Zero): email, phone; daily yes, Enter for the time, run now no
  const { io, said } = scripted(["12", "a@b.c", "+972500000000", "", "", "n"], [KEY, "pw"]);
  await runSetup(io, deps(path, { schedule: async (at) => (asked.push(at), { ok: true, message: "ok" }) }).value);
  deepStrictEqual(asked, [{ hour: 7, minute: 0 }]);
  match(said.join("\n"), /One Zero is not in the daily run/);
});

test("declining the daily run says how to set it later, and a computer without a scheduler is not asked", async () => {
  const dir = mkdtempSync(join(tmpdir(), "orla-il-setup-"));
  const path = join(dir, "config.json");
  const { io, said } = scripted(["15", "user1", "n", "n"], [KEY, "pw"]);
  await runSetup(io, deps(path, { schedule: async () => assert.fail("not asked for") }).value);
  match(said.join("\n"), /Later: npx orla-il-banks@9\.9\.9 schedule/);

  const path2 = join(dir, "config2.json");
  const plain = scripted(["15", "user1", "n"], [KEY, "pw"]);
  await runSetup(plain.io, deps(path2).value);
  ok(!plain.asked.some((q) => /every day/.test(q)));
});
