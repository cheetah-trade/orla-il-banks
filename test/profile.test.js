/**
 * The kept browser profile: named without the login, private to its owner,
 * refused when anyone else can read it. On Windows "anyone else" is read from
 * the folder's ACL, not from a mode, which means nothing there.
 */
import { deepStrictEqual, doesNotThrow, match, notStrictEqual, ok, strictEqual, throws } from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, mkdtempSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { defaultProfileBase, profileDir, profileName } from "../dist/profile.js";
import { othersAllowed, windowsAcl } from "../dist/winacl.js";

const creds = { userCode: "AB1234", password: "s3cret-pass" };

test("a profile is named by a hash of the login, never by the login", () => {
  const name = profileName("hapoalim", creds);
  match(name, /^hapoalim-[0-9a-f]{12}$/);
  ok(!name.includes("AB1234"));
  strictEqual(profileName("hapoalim", { ...creds, password: "changed" }), name, "a new password is the same login");
  notStrictEqual(profileName("hapoalim", { ...creds, userCode: "ZZ9999" }), name);
});

test("the folders are created readable by their owner only", { skip: process.platform === "win32" && "file modes are POSIX" }, () => {
  const base = join(mkdtempSync(join(tmpdir(), "orla-il-base-")), "profiles");
  const dir = profileDir(base, "hapoalim", creds);
  strictEqual(statSync(base).mode & 0o777, 0o700);
  strictEqual(statSync(dir).mode & 0o777, 0o700);
  strictEqual(profileDir(base, "hapoalim", creds), dir, "the same login finds the same profile");
});

test("a profile folder others can read is refused, with the fix", { skip: process.platform === "win32" && "file modes are POSIX" }, () => {
  const base = mkdtempSync(join(tmpdir(), "orla-il-open-"));
  chmodSync(base, 0o755);
  throws(() => profileDir(base, "hapoalim", creds), /chmod 700/);
  const inner = mkdtempSync(join(tmpdir(), "orla-il-inner-"));
  chmodSync(inner, 0o700);
  mkdirSync(join(inner, profileName("hapoalim", creds)), { mode: 0o755 });
  chmodSync(join(inner, profileName("hapoalim", creds)), 0o755);
  throws(() => profileDir(inner, "hapoalim", creds), /chmod 700/);
});

const ME = "S-1-5-21-1-2-3-1001";
const PRIVATE = `D:AI(A;OICIID;FA;;;SY)(A;OICIID;FA;;;BA)(A;OICIID;FA;;;${ME})`;
const OPEN = `D:AI(A;OICIID;FA;;;SY)(A;OICIIOID;SDGXGWGR;;;AU)(A;OICIID;FA;;;${ME})`;

/** A stand-in for icacls: what each folder's ACL says, and which folders it closed. */
function fakeAcl(sddlOf) {
  const restricted = [];
  return {
    restricted,
    user: () => ME,
    read: (path) => (restricted.includes(path) ? `D:PAI(A;OICI;FA;;;${ME})` : sddlOf(path)),
    restrict: (path, user) => {
      strictEqual(user, ME);
      restricted.push(path);
    },
  };
}

test("on Windows the mode is not read: a folder with a private ACL is used whatever its mode", () => {
  const base = mkdtempSync(join(tmpdir(), "orla-il-win-"));
  chmodSync(base, 0o755);
  mkdirSync(join(base, profileName("hapoalim", creds)), { mode: 0o755 });
  doesNotThrow(() => profileDir(base, "hapoalim", creds, "win32", fakeAcl(() => PRIVATE)));
});

test("on Windows a folder others can open is refused, by name and with the fix", () => {
  const base = mkdtempSync(join(tmpdir(), "orla-il-win-open-"));
  throws(
    () => profileDir(base, "hapoalim", creds, "win32", fakeAcl(() => OPEN)),
    (error) =>
      error.name === "ConfigError" &&
      error.message.includes("Authenticated Users") &&
      error.message.includes(`icacls "${base}" /inheritance:r /grant:r "*${ME}:(OI)(CI)F"`),
  );
  // the base is fine, the profile inside it is not
  mkdirSync(join(base, profileName("hapoalim", creds)));
  const dir = join(base, profileName("hapoalim", creds));
  throws(() => profileDir(base, "hapoalim", creds, "win32", fakeAcl((p) => (p === dir ? OPEN : PRIVATE))), /other accounts/);
});

test("on Windows new folders are closed to everyone but this account before use", () => {
  const base = join(mkdtempSync(join(tmpdir(), "orla-il-win-new-")), "profiles");
  const acl = fakeAcl(() => OPEN);
  const dir = profileDir(base, "hapoalim", creds, "win32", acl);
  deepStrictEqual(acl.restricted, [base, dir]);
  ok(existsSync(dir));
});

test("on Windows an ACL that cannot be read is not taken for private", () => {
  const base = mkdtempSync(join(tmpdir(), "orla-il-win-unread-"));
  const acl = {
    user: () => ME,
    read: () => {
      throw new Error("icacls exited 5");
    },
    restrict: () => {},
  };
  throws(() => profileDir(base, "hapoalim", creds, "win32", acl), /Could not read who can open .*icacls exited 5/);
});

const onWindows = { skip: process.platform !== "win32" && "the real ACL is Windows only" };

test("Windows, for real: the folders created are open to this account alone", onWindows, () => {
  const base = join(mkdtempSync(join(tmpdir(), "orla-il-real-")), "profiles");
  const dir = profileDir(base, "hapoalim", creds);
  const me = windowsAcl.user();
  for (const path of [base, dir]) {
    const sddl = windowsAcl.read(path);
    deepStrictEqual(othersAllowed(sddl, me), [], sddl);
    match(sddl, /^D:P/, `inheritance is cut: ${sddl}`);
  }
  strictEqual(profileDir(base, "hapoalim", creds), dir, "the same login finds the same profile");
});

test("Windows, for real: a folder in the user's own profile is used as it is", onWindows, () => {
  // where 0.3.x left ~/.orla-il-banks/profiles: inheriting from the user folder
  const base = mkdtempSync(join(tmpdir(), "orla-il-real-kept-"));
  doesNotThrow(() => profileDir(base, "hapoalim", creds));
});

test("Windows, for real: a folder Everyone can read is refused", onWindows, () => {
  const base = mkdtempSync(join(tmpdir(), "orla-il-real-open-"));
  const icacls = join(process.env.SystemRoot || "C:\\Windows", "System32", "icacls.exe");
  execFileSync(icacls, [base, "/grant", "*S-1-1-0:(OI)(CI)R", "/q"], { stdio: "ignore" });
  throws(() => profileDir(base, "hapoalim", creds), /Everyone/);
});

test("the base can be moved by the environment", () => {
  strictEqual(defaultProfileBase({ ORLA_IL_PROFILE_DIR: "/somewhere" }), "/somewhere");
  match(defaultProfileBase({}), /\.orla-il-banks[\\/]profiles$/);
});
