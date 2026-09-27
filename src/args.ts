/**
 * The grammar, on its own so a test can read it back. Two commands and a
 * handful of flags; what breaks here is the quiet case, a flag that takes a
 * value swallowing the next flag as that value.
 */

export type Flags = Record<string, string | boolean>;

export function parse(argv: string[]): { words: string[]; flags: Flags } {
  const words: string[] = [];
  const flags: Flags = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i] as string;
    if (!arg.startsWith("--")) {
      words.push(arg);
      continue;
    }
    const name = arg.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) {
      flags[name] = true;
    } else {
      flags[name] = next;
      i += 1;
    }
  }
  return { words, flags };
}

export function optional(flags: Flags, name: string): string | undefined {
  const value = flags[name];
  return typeof value === "string" ? value : undefined;
}

//: Every flag `run` understands. Anything else is a typo, and a typo in
//: `--dry-run` would otherwise send the rows the person meant to preview.
export const RUN_FLAGS = new Set([
  "config",
  "days",
  "dry-run",
  "only",
  "from-json",
  "save-json",
  "show-browser",
  "profile-dir",
  "scheduled",
]);

//: What `trust` understands. It reads the config only to name the profile.
export const TRUST_FLAGS = new Set(["config", "profile-dir"]);

//: What `setup` understands: where to write the config, and the profiles.
export const SETUP_FLAGS = new Set(["config", "profile-dir"]);

//: What `schedule` understands: when, and which config the daily run reads.
export const SCHEDULE_FLAGS = new Set(["at", "config"]);

//: The oldest Node the runner is built and tested on (package.json `engines`).
//: npm only warns about `engines`, so an older Node would run it anyway and
//: fail somewhere deep with a message about something else.
export const NODE_MIN_MAJOR = 22;

export function nodeTooOld(version: string): boolean {
  const major = Number(/^v?(\d+)/.exec(version)?.[1] ?? 0);
  return major < NODE_MIN_MAJOR;
}
