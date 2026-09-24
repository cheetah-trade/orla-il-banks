/**
 * The kept browser profile: named without the login, private to its owner,
 * refused when anyone else can read it.
 */
import { doesNotThrow, match, notStrictEqual, ok, strictEqual, throws } from "node:assert/strict";
import { chmodSync, mkdirSync, mkdtempSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { defaultProfileBase, profileDir, profileName } from "../dist/profile.js";

const creds = { userCode: "AB1234", password: "s3cret-pass" };

test("a profile is named by a hash of the login, never by the login", () => {
  const name = profileName("hapoalim", creds);
  match(name, /^hapoalim-[0-9a-f]{12}$/);
  ok(!name.includes("AB1234"));
  strictEqual(profileName("hapoalim", { ...creds, password: "changed" }), name, "a new password is the same login");
  notStrictEqual(profileName("hapoalim", { ...creds, userCode: "ZZ9999" }), name);
});

test("the folders are created readable by their owner only", () => {
  const base = join(mkdtempSync(join(tmpdir(), "orla-il-base-")), "profiles");
  const dir = profileDir(base, "hapoalim", creds);
  strictEqual(statSync(base).mode & 0o777, 0o700);
  strictEqual(statSync(dir).mode & 0o777, 0o700);
  strictEqual(profileDir(base, "hapoalim", creds), dir, "the same login finds the same profile");
});

test("a profile folder others can read is refused, with the fix", () => {
  const base = mkdtempSync(join(tmpdir(), "orla-il-open-"));
  chmodSync(base, 0o755);
  throws(() => profileDir(base, "hapoalim", creds), /chmod 700/);
  const inner = mkdtempSync(join(tmpdir(), "orla-il-inner-"));
  chmodSync(inner, 0o700);
  mkdirSync(join(inner, profileName("hapoalim", creds)), { mode: 0o755 });
  chmodSync(join(inner, profileName("hapoalim", creds)), 0o755);
  throws(() => profileDir(inner, "hapoalim", creds), /chmod 700/);
  doesNotThrow(() => profileDir(base, "hapoalim", creds, "win32"));
});

test("the base can be moved by the environment", () => {
  strictEqual(defaultProfileBase({ ORLA_IL_PROFILE_DIR: "/somewhere" }), "/somewhere");
  match(defaultProfileBase({}), /\.orla-il-banks[\\/]profiles$/);
});
