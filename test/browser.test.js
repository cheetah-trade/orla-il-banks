/**
 * The browser: where the runner looks for it, and that it looks where
 * puppeteer itself would launch from.
 */
import { deepStrictEqual, ok, strictEqual } from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { expectedChrome, findBrowser } from "../dist/browser.js";

test("a browser the person named is used as it is", async () => {
  deepStrictEqual(await findBrowser({ PUPPETEER_EXECUTABLE_PATH: "/x/chrome" }), { path: "/x/chrome" });
});

test("an empty cache is a missing browser, with the build this puppeteer expects", async () => {
  const cache = mkdtempSync(join(tmpdir(), "orla-il-cache-"));
  const out = await findBrowser({ PUPPETEER_CACHE_DIR: cache });
  ok("missing" in out);
  strictEqual(out.missing.cacheDir, cache);
  const { PUPPETEER_REVISIONS } = await import("puppeteer-core/internal/revisions.js");
  strictEqual(out.missing.buildId, PUPPETEER_REVISIONS.chrome);
});

test("the path the runner expects is the one puppeteer launches by default", { skip: !!process.env.PUPPETEER_EXECUTABLE_PATH && "a browser is named in this environment" }, async () => {
  // If these part, setup downloads Chrome into one place and every run looks
  // for it in another.
  const { default: puppeteer } = await import("puppeteer");
  const expected = await expectedChrome({});
  strictEqual(expected.path, puppeteer.executablePath());
});
