import { deepStrictEqual } from "node:assert/strict";
import { test } from "node:test";

import { parse } from "../dist/args.js";

test("a flag followed by another flag is a boolean, not a value", () => {
  // `--dry-run --only max` must not read "--only" as the value of --dry-run.
  deepStrictEqual(parse(["run", "--dry-run", "--only", "max"]), {
    words: ["run"],
    flags: { "dry-run": true, only: "max" },
  });
});

test("a trailing flag is a boolean", () => {
  deepStrictEqual(parse(["run", "--show-browser"]).flags, { "show-browser": true });
});
