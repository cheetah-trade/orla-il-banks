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
export const RUN_FLAGS = new Set(["config", "days", "dry-run", "only", "from-json", "save-json", "show-browser"]);
