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
 * What the profile holds is a logged-in bank session. It is kept like the
 * config: readable by its owner only, refused when anyone else can read it, and
 * never used in GitHub Actions, where it would have to live in a cache.
 */

import { createHash } from "node:crypto";
import { chmodSync, existsSync, mkdirSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

import { COMPANIES, type CompanyId } from "./companies.js";
import { ConfigError } from "./config.js";

export function defaultProfileBase(env: NodeJS.ProcessEnv): string {
  return env["ORLA_IL_PROFILE_DIR"] || join(homedir(), ".orla-il-banks", "profiles");
}

/** One profile per login, named by a hash: the login itself does not appear
 *  in a folder name that shows up in listings, backups and error messages. */
export function profileName(company: CompanyId, credentials: Record<string, string>): string {
  const identity = credentials[COMPANIES[company].fields[0] as string] ?? "";
  return `${company}-${createHash("sha256").update(`${company}:${identity}`).digest("hex").slice(0, 12)}`;
}

function ensurePrivateDir(path: string, platform: NodeJS.Platform): void {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true, mode: 0o700 });
    if (platform !== "win32") chmodSync(path, 0o700);
    return;
  }
  if (platform === "win32") return;
  const mode = statSync(path).mode & 0o777;
  if (mode & 0o077) {
    throw new ConfigError(
      `${path} can be read by other users (mode ${mode.toString(8)}). It holds bank sessions: run \`chmod 700 ${path}\` and try again.`,
    );
  }
}

/** The profile folder for this login, created readable by its owner only. */
export function profileDir(
  base: string,
  company: CompanyId,
  credentials: Record<string, string>,
  platform: NodeJS.Platform = process.platform,
): string {
  ensurePrivateDir(base, platform);
  const dir = join(base, profileName(company, credentials));
  ensurePrivateDir(dir, platform);
  return dir;
}
