import { deepStrictEqual, strictEqual } from "node:assert/strict";
import { test } from "node:test";

import { nodeTooOld, parse } from "../dist/args.js";

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

test("a Node older than the runner's is named before anything runs", () => {
  strictEqual(nodeTooOld("v18.20.4"), true);
  strictEqual(nodeTooOld("v20.19.0"), true);
  strictEqual(nodeTooOld("v22.22.2"), false);
  strictEqual(nodeTooOld("v24.9.0"), false);
  strictEqual(nodeTooOld("v26.0.0"), false);
});
