/**
 * Who can open a folder on Windows, read without a native module.
 *
 * File modes do not exist there: Node's chmod only flips the read-only bit,
 * and stat reports 0o666 or 0o777 whatever the folder's ACL says, so the
 * POSIX check in profile.ts has nothing to read. What decides is the folder's
 * ACL. It is read with the system's own icacls, saved as SDDL: accounts are
 * written as SIDs and two-letter aliases there, the same on every language of
 * Windows, where the names icacls prints otherwise are translated.
 *
 * A folder counts as private when every allow entry in its ACL names this
 * account, the system or the Administrators group (they can open anything on
 * the machine anyway, as root can on a Mac), including entries that only pass
 * down to what is created inside: that is where the bank session is written.
 * Deny entries only take away, so they are not read.
 */

import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export interface WindowsAcl {
  /** The SID of the account this runs as. */
  user(): string;
  /** The folder's ACL as SDDL. */
  read(path: string): string;
  /** Leave the folder open to `user` alone, with nothing inherited from above. */
  restrict(path: string, user: string): void;
}

/** SYSTEM, Administrators, CREATOR OWNER, OWNER RIGHTS: aliases and SIDs. */
const MACHINE = new Set(["SY", "S-1-5-18", "BA", "S-1-5-32-544", "CO", "S-1-3-0", "OW", "S-1-3-4"]);

/**
 * The names SDDL may give this account. Two accounts of the machine have an
 * alias instead of their SID: the built-in Administrator (RID 500, "LA", what
 * a CI runner on Windows is) and the built-in Guest (RID 501, "LG").
 */
function namesOf(user: string): Set<string> {
  const names = new Set([user]);
  const rid = /^S-1-5-21-\d+-\d+-\d+-(\d+)$/.exec(user)?.[1];
  if (rid === "500") names.add("LA");
  if (rid === "501") names.add("LG");
  return names;
}

/** Allow entries in SDDL: plain, object, callback and callback-object. */
const ALLOW = new Set(["A", "OA", "XA", "ZA"]);

/**
 * The accounts besides `user` and the machine that the ACL lets in, in the
 * order they appear. Empty means private. A folder without access control at
 * all lets everyone in.
 */
export function othersAllowed(sddl: string, user: string): string[] {
  const dacl = /D:([A-Z_]*)((?:\([^)]*\))*)/.exec(sddl);
  if (!dacl) return ["everyone (no ACL)"];
  if ((dacl[1] ?? "").includes("NO_ACCESS_CONTROL")) return ["everyone (no access control)"];
  const me = namesOf(user);
  const others: string[] = [];
  for (const ace of (dacl[2] ?? "").matchAll(/\(([^)]*)\)/g)) {
    const fields = (ace[1] ?? "").split(";");
    const type = fields[0] ?? "";
    const sid = fields[5] ?? "";
    if (!ALLOW.has(type)) continue;
    if (me.has(sid) || MACHINE.has(sid)) continue;
    if (!others.includes(sid)) others.push(sid);
  }
  return others;
}

/** Well-known groups by the SDDL alias or SID a person would see, for the message. */
const KNOWN: Record<string, string> = {
  WD: "Everyone",
  "S-1-1-0": "Everyone",
  AU: "Authenticated Users",
  "S-1-5-11": "Authenticated Users",
  BU: "Users",
  "S-1-5-32-545": "Users",
  BG: "Guests",
  "S-1-5-32-546": "Guests",
  IU: "Interactive",
  "S-1-5-4": "Interactive",
  AN: "Anonymous",
  "S-1-5-7": "Anonymous",
};

export function describe(sids: string[]): string {
  return sids.map((sid) => KNOWN[sid] ?? sid).join(", ");
}

/** The SID in `whoami /user /fo csv /nh`: "machine\name","S-1-5-21-…". */
export function sidFromWhoami(output: string): string {
  const sid = /"(S-1-[0-9-]+)"\s*$/m.exec(output)?.[1];
  if (!sid) throw new Error("whoami did not name this account's SID");
  return sid;
}

/**
 * What `icacls <folder> /save` writes: the folder's name on one line, its ACL
 * as SDDL on the next, in UTF-16 (plain text is read too). A name cannot start
 * with "D:" on Windows, so the first line that does is the ACL.
 */
export function sddlFromSave(saved: Buffer): string {
  const utf16 = saved.length > 1 && (saved[1] === 0 || (saved[0] === 0xff && saved[1] === 0xfe));
  const text = saved.toString(utf16 ? "utf16le" : "utf8").replace(/^﻿/, "");
  const line = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .find((l) => /^(?:O:|G:|D:)/.test(l));
  if (line === undefined) throw new Error("icacls saved no ACL");
  return line;
}

function system32(name: string): string {
  // Not whatever comes first on PATH: the answer decides whether a bank
  // session is written here.
  return join(process.env["SystemRoot"] || "C:\\Windows", "System32", name);
}

let userSid: string | undefined;

export const windowsAcl: WindowsAcl = {
  user() {
    userSid ??= sidFromWhoami(
      execFileSync(system32("whoami.exe"), ["/user", "/fo", "csv", "/nh"], { encoding: "utf8", windowsHide: true }),
    );
    return userSid;
  },
  read(path) {
    const scratch = mkdtempSync(join(tmpdir(), "orla-il-acl-"));
    try {
      const file = join(scratch, "acl");
      execFileSync(system32("icacls.exe"), [path, "/save", file, "/q"], { stdio: "ignore", windowsHide: true });
      return sddlFromSave(readFileSync(file));
    } finally {
      rmSync(scratch, { recursive: true, force: true });
    }
  },
  restrict(path, user) {
    execFileSync(system32("icacls.exe"), [path, "/inheritance:r", "/grant:r", `*${user}:(OI)(CI)F`, "/q"], {
      stdio: "ignore",
      windowsHide: true,
    });
  },
};
