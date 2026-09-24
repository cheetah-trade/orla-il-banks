/**
 * Trusting a computer: the hint, the bank's pages, and the one mechanism the
 * whole thing rests on, a browser profile that remembers across launches what
 * the bank left in it.
 */
import { match, ok, strictEqual } from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";

import { needsTrustHint, TRUST_PAGES, trustDevice } from "../dist/trust.js";
import { COMPANIES } from "../dist/companies.js";

test("the hint goes to a bank that checks devices, and not for a wrong password", () => {
  ok(needsTrustHint("hapoalim", "generic: Login failed with UNKNOWN_ERROR error"));
  ok(needsTrustHint("hapoalim", "timeout: waiting for redirect"));
  ok(!needsTrustHint("hapoalim", "invalidPassword: Login failed with INVALID_PASSWORD error"));
  ok(!needsTrustHint("hapoalim", "changePassword: CHANGE_PASSWORD"));
  ok(!needsTrustHint("leumi", "generic: Login failed with UNKNOWN_ERROR error"));
});

test("every bank that needs a trusted computer has its pages, and only those", () => {
  const trusted = Object.entries(COMPANIES).filter(([, spec]) => "trustedDevice" in spec).map(([id]) => id);
  strictEqual(trusted.join(","), Object.keys(TRUST_PAGES).join(","));
});

test("the Hapoalim pages are the ones the library itself logs in on and lands on", () => {
  // The library knows where a successful Hapoalim login lands; if it learns a
  // new home page and this table does not, trust would wait for ten minutes on
  // a login that already went through.
  const require = createRequire(import.meta.url);
  const lib = dirname(require.resolve("israeli-bank-scrapers"));
  const source = readFileSync(join(lib, "scrapers", "hapoalim.js"), "utf8");
  const page = TRUST_PAGES.hapoalim;
  ok(source.includes("/cgi-bin/poalwwwc?reqName=getLogonPage"));
  ok(page.login.endsWith("/cgi-bin/poalwwwc?reqName=getLogonPage"));
  for (const path of ["/portalserver/HomePage", "/ng-portals-bt/rb/he/homepage", "/ng-portals/rb/he/homepage"]) {
    ok(source.includes(path), `${path} is gone from the library`);
    ok(page.home.test(`https://login.bankhapoalim.co.il${path}`), `${path} is not treated as home`);
  }
  ok(!page.home.test("https://login.bankhapoalim.co.il/AUTHENTICATE/LOGON?flow=AUTHENTICATE&state=LOGON&errorcode=1.6"));
  ok(!page.home.test("https://evil.example/portalserver/HomePage"));
});

// Needs a browser: the one puppeteer downloads (CI) or PUPPETEER_EXECUTABLE_PATH.
test("a trusted profile keeps what the bank left in it for the next launch", async (t) => {
  let sawDevice = false;
  const server = createServer((req, res) => {
    if (req.url === "/login") {
      // the stand-in bank: remember the device, then land on its home page
      res.writeHead(200, {
        "Content-Type": "text/html",
        "Set-Cookie": "device=known; Max-Age=86400; Path=/",
      });
      res.end("<script>setTimeout(() => location.href = '/home', 300)</script>");
      return;
    }
    if (req.url === "/check") sawDevice = /device=known/.test(req.headers.cookie ?? "");
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<p>home</p>");
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const profile = mkdtempSync(join(tmpdir(), "orla-il-profile-"));
  const page = { login: `${base}/login`, home: new RegExp(`^${base.replace(/\./g, "\\.")}/home`) };
  try {
    let outcome;
    try {
      outcome = await trustDevice("hapoalim", { profileDir: profile, env: process.env, page, headless: true, waitMs: 20000 });
    } catch (error) {
      if (/Could not find|Browser was not found|Failed to launch/i.test(String(error))) {
        t.skip("no browser on this machine");
        return;
      }
      throw error;
    }
    strictEqual(outcome, "trusted");

    // a new launch on the same profile, the way `run` starts it
    const { default: puppeteer } = await import("puppeteer");
    const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
    const browser = await puppeteer.launch({ headless: true, userDataDir: profile, ...(executablePath ? { executablePath } : {}) });
    try {
      const tab = await browser.newPage();
      await tab.goto(`${base}/check`);
    } finally {
      await browser.close();
    }
    ok(sawDevice, "the second launch did not carry the device cookie");
  } finally {
    server.close();
  }
});

test("a login that never reaches the home page times out rather than hanging", async (t) => {
  const server = createServer((_req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<p>enter the code the bank sent</p>");
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const profile = mkdtempSync(join(tmpdir(), "orla-il-profile-"));
  try {
    let outcome;
    try {
      outcome = await trustDevice("hapoalim", {
        profileDir: profile,
        env: process.env,
        page: { login: `${base}/login`, home: /never/ },
        headless: true,
        waitMs: 1500,
      });
    } catch (error) {
      if (/Could not find|Browser was not found|Failed to launch/i.test(String(error))) {
        t.skip("no browser on this machine");
        return;
      }
      throw error;
    }
    match(outcome, /^timeout$/);
  } finally {
    server.close();
  }
});
