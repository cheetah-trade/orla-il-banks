/**
 * The browser the runner drives: its flags, where it is, and how it gets onto
 * a computer that does not have it yet.
 *
 * On its own so that the command line and the trust flow do not load the
 * scraping library to get at it.
 *
 * Why the runner installs the browser itself rather than leaving it to npm:
 * puppeteer used to fetch Chrome in its install script, and npm 12 (September
 * 2026) no longer runs dependencies' install scripts unless the person approves
 * them. A runner installed with npm 12 had no browser and could not say why.
 * Now `setup` asks and downloads the exact Chrome build this puppeteer is made
 * for, into puppeteer's own cache, where every later run finds it.
 */

import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export function browserArgs(env: NodeJS.ProcessEnv): string[] {
  // Chromium's sandbox needs kernel features a container or a hardened CI
  // runner often lacks. Turned off only when asked, and the Docker image asks.
  return env["ORLA_IL_NO_SANDBOX"] === "1" ? ["--no-sandbox", "--disable-setuid-sandbox"] : [];
}

export interface MissingBrowser {
  buildId: string;
  cacheDir: string;
}

export type BrowserLookup = { path: string } | { missing: MissingBrowser };

//: A variable, not a literal, so the compiler does not try to resolve an
//: internal path of puppeteer-core's; the module is there at run time.
const REVISIONS = "puppeteer-core/internal/revisions.js";

async function chromeBuild(): Promise<string> {
  const { PUPPETEER_REVISIONS } = (await import(REVISIONS)) as { PUPPETEER_REVISIONS: { chrome: string } };
  return PUPPETEER_REVISIONS.chrome;
}

export function puppeteerCacheDir(env: NodeJS.ProcessEnv): string {
  return env["PUPPETEER_CACHE_DIR"] || join(homedir(), ".cache", "puppeteer");
}

/** Where the Chrome build this puppeteer expects lives in its cache, whether
 *  or not it is there yet. */
export async function expectedChrome(env: NodeJS.ProcessEnv): Promise<{ path: string } & MissingBrowser> {
  const { Browser, computeExecutablePath, detectBrowserPlatform } = await import("@puppeteer/browsers");
  const buildId = await chromeBuild();
  const cacheDir = puppeteerCacheDir(env);
  const platform = detectBrowserPlatform();
  if (!platform) throw new Error("this operating system has no Chrome build the runner can use");
  return { path: computeExecutablePath({ browser: Browser.CHROME, buildId, cacheDir, platform }), buildId, cacheDir };
}

/** The browser a run will use: the one the person named, or the Chrome build
 *  this puppeteer expects, if it is in the cache. */
export async function findBrowser(env: NodeJS.ProcessEnv): Promise<BrowserLookup> {
  const named = env["PUPPETEER_EXECUTABLE_PATH"];
  if (named) return { path: named };
  const { path, buildId, cacheDir } = await expectedChrome(env);
  return existsSync(path) ? { path } : { missing: { buildId, cacheDir } };
}

/** Download that Chrome build into puppeteer's cache and return its path. */
export async function installBrowser(
  missing: MissingBrowser,
  onProgress: (done: number, total: number) => void,
): Promise<string> {
  const { Browser, install } = await import("@puppeteer/browsers");
  const installed = await install({
    browser: Browser.CHROME,
    buildId: missing.buildId,
    cacheDir: missing.cacheDir,
    downloadProgressCallback: onProgress,
  });
  return installed.executablePath;
}
