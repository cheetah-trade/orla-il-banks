/**
 * The config: every mistake found before a browser opens, and no password in
 * any message about it.
 */
import { deepStrictEqual, doesNotThrow, match, ok, strictEqual, throws } from "node:assert/strict";
import { chmodSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { checkPrivate, ConfigError, guardActions, loadConfig, redact, secretsOf } from "../dist/config.js";

const dir = mkdtempSync(join(tmpdir(), "orla-il-config-"));

function file(name, content, mode = 0o600) {
  const path = join(dir, name);
  writeFileSync(path, typeof content === "string" ? content : JSON.stringify(content));
  chmodSync(path, mode);
  return path;
}

const HAPOALIM = { company: "hapoalim", userCode: "AB1234", password: "s3cret-pass" };

test("a config others can read is refused, with the fix", () => {
  const path = file("open.json", { accounts: [HAPOALIM] }, 0o644);
  throws(() => checkPrivate(path), /chmod 600/);
  throws(() => loadConfig({ file: path, env: {}, needToken: false }), ConfigError);
  doesNotThrow(() => checkPrivate(path, "win32"));
  doesNotThrow(() => checkPrivate(file("closed.json", {}, 0o600)));
});

test("broken JSON is reported by position, never by the text around it", () => {
  const path = file("broken.json", '{"accounts":[{"company":"hapoalim","password":"hunter2-secret" "userCode":"x"}]}');
  throws(
    () => loadConfig({ file: path, env: {}, needToken: false }),
    (error) => {
      match(error.message, /not valid JSON/);
      ok(!error.message.includes("hunter2"));
      return true;
    },
  );
});

test("a missing field, a stray field and an unknown company are named before any login", () => {
  const load = (accounts) => () => loadConfig({ env: { ORLA_IL_ACCOUNTS: JSON.stringify(accounts) }, needToken: false });
  throws(load([{ company: "hapoalim", password: "x" }]), /needs "userCode"/);
  throws(load([{ ...HAPOALIM, username: "AB1234" }]), (error) => {
    match(error.message, /fields it does not use: username/);
    ok(!error.message.includes("AB1234"));
    return true;
  });
  throws(load([{ company: "bank-of-nowhere" }]), /unknown company/);
  throws(load([{ company: "behatsdaa", id: "1", password: "2" }]), /not supported here/);
  throws(load([]), /non-empty list/);
  throws(() => loadConfig({ env: { ORLA_IL_ACCOUNTS: "{nope" }, needToken: false }), /not valid JSON/);
});

test("a run that sends needs a key; a dry run and a saved file need less", () => {
  const env = { ORLA_IL_ACCOUNTS: JSON.stringify([HAPOALIM]) };
  throws(() => loadConfig({ env, needToken: true }), /no Orla key/);
  strictEqual(loadConfig({ env, needToken: false }).token, "");
  deepStrictEqual(loadConfig({ env: { ORLA_TOKEN: "t" }, needToken: true, needAccounts: false }).accounts, []);
  throws(() => loadConfig({ env: { ORLA_TOKEN: "t" }, needToken: true }), /no accounts/);
});

test("the file wins over the environment, and the address loses its trailing slash", () => {
  const path = file("full.json", { orla: { url: "https://staging.example/", token: "from-file" }, days: 30, accounts: [HAPOALIM] });
  const config = loadConfig({ file: path, env: { ORLA_TOKEN: "from-env", ORLA_URL: "https://other" }, needToken: true });
  strictEqual(config.url, "https://staging.example");
  strictEqual(config.token, "from-file");
  strictEqual(config.days, 30);
  deepStrictEqual(config.accounts[0], { company: "hapoalim", credentials: { userCode: "AB1234", password: "s3cret-pass" } });
});

test("days are a whole number in range", () => {
  const env = { ORLA_IL_ACCOUNTS: JSON.stringify([HAPOALIM]) };
  strictEqual(loadConfig({ env, needToken: false }).days, 90);
  strictEqual(loadConfig({ env, needToken: false, days: "365" }).days, 365);
  throws(() => loadConfig({ env, needToken: false, days: "0" }), /1 to 730/);
  throws(() => loadConfig({ env, needToken: false, days: "12.5" }), /1 to 730/);
  throws(() => loadConfig({ env, needToken: false, days: "9999" }), /1 to 730/);
});

test("every secret is redacted from a message, the longest first", () => {
  const config = loadConfig({ env: { ORLA_IL_ACCOUNTS: JSON.stringify([HAPOALIM]), ORLA_TOKEN: "tok_abc" }, needToken: true });
  const secrets = secretsOf(config);
  deepStrictEqual(secrets.sort(), ["AB1234", "s3cret-pass", "tok_abc"].sort());
  strictEqual(redact("typed s3cret-pass for AB1234 with tok_abc", secrets), "typed *** for *** with ***");
});

test("in GitHub Actions a public repository is refused and every password is masked", () => {
  const config = loadConfig({ env: { ORLA_IL_ACCOUNTS: JSON.stringify([HAPOALIM]), ORLA_TOKEN: "tok_abc" }, needToken: true });
  const lines = [];
  const write = (line) => lines.push(line);

  guardActions(config, {}, write);
  deepStrictEqual(lines, []);

  const env = { GITHUB_ACTIONS: "true", GITHUB_EVENT_PATH: "/event.json" };
  guardActions(config, env, write, () => JSON.stringify({ repository: { private: true } }));
  deepStrictEqual(lines.sort(), ["::add-mask::AB1234", "::add-mask::s3cret-pass", "::add-mask::tok_abc"].sort());

  throws(
    () => guardActions(config, env, () => {}, () => JSON.stringify({ repository: { private: false } })),
    /repository is public/,
  );

  const unsure = [];
  guardActions(config, { GITHUB_ACTIONS: "true" }, (line) => unsure.push(line));
  ok(unsure.some((line) => line.startsWith("::warning::")));
});
