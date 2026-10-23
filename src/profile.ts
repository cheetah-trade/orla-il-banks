/**
 * Where a browser profile lives for a bank that has to know this computer.
 *
 * Some banks ask for a one-time code whenever a login comes from a device they
 * have not seen (Bank Hapoalim since March 2026). A browser started fresh is a
 * new device every time, so such a bank would ask on every run and a scheduled
 * run could never finish. A profile kept on disk carries what the bank uses to
 * recognise the device, and after one login by the person (`orla-il-banks
 * trust`) later runs are recognised.
 *
 * What the profile holds is a logged-in bank session. It is kept readable by
 * its owner only, refused when anyone else can read it, and never used in
 * GitHub Actions, where it would have to live in a cache. On a Mac and Linux
 * that is the folder's mode; on Windows, where a mode means nothing, it is the
 * folder's ACL (winacl.ts), checked on every run the scheduler starts too.
 */

import { createHash } from "node:crypto";
import { chmodSync, existsSync, mkdirSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

import { COMPANIES, type CompanyId } from "./companies.js";
import { ConfigError } from "./config.js";
import { describe, othersAllowed, type WindowsAcl, windowsAcl } from "./winacl.js";

export function defaultProfileBase(env: NodeJS.ProcessEnv): string {
  return env["ORLA_IL_PROFILE_DIR"] || join(homedir(), ".orla-il-banks", "profiles");
}

/** One profile per login, named by a hash: the login itself does not appear
 *  in a folder name that shows up in listings, backups and error messages. */
export function profileName(company: CompanyId, credentials: Record<string, string>): string {
  const identity = credentials[COMPANIES[company].fields[0] as string] ?? "";
  return `${company}-${createHash("sha256").update(`${company}:${identity}`).digest("hex").slice(0, 12)}`;
}

function ensurePrivateDir(path: string, platform: NodeJS.Platform, acl: WindowsAcl): void {
  if (platform === "win32") return ensurePrivateWindowsDir(path, acl);
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true, mode: 0o700 });
    chmodSync(path, 0o700);
    return;
  }
  const mode = statSync(path).mode & 0o777;
  if (mode & 0o077) {
    throw new ConfigError(
      `${path} can be read by other users (mode ${mode.toString(8)}). It holds bank sessions: run \`chmod 700 ${path}\` and try again.`,
    );
  }
}

/** The same on Windows, by the ACL: a new folder is closed to all but this
 *  account, an existing one is read, and either way what is there is checked. */
function ensurePrivateWindowsDir(path: string, acl: WindowsAcl): void {
  let user: string;
  let sddl: string;
  try {
    user = acl.user();
    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true });
      acl.restrict(path, user);
    }
    sddl = acl.read(path);
  } catch (error) {
    if (error instanceof ConfigError) throw error;
    // Not knowing who can open it is not the same as private.
    throw new ConfigError(
      `Could not read who can open ${path} (${error instanceof Error ? error.message : String(error)}). It holds bank sessions, so it is not used.`,
    );
  }
  const others = othersAllowed(sddl, user);
  if (others.length > 0) {
    throw new ConfigError(
      `${path} can be opened by other accounts on this computer (${describe(others)}). It holds bank sessions: run \`icacls "${path}" /inheritance:r /grant:r "*${user}:(OI)(CI)F"\` and try again.`,
    );
  }
}

/** The profile folder for this login, created readable by its owner only. */
export function profileDir(
  base: string,
  company: CompanyId,
  credentials: Record<string, string>,
  platform: NodeJS.Platform = process.platform,
  acl: WindowsAcl = windowsAcl,
): string {
  ensurePrivateDir(base, platform, acl);
  const dir = join(base, profileName(company, credentials));
  ensurePrivateDir(dir, platform, acl);
  return dir;
}
