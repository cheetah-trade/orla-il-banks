/**
 * Teaching a bank to know this computer, once, with the person at the keyboard.
 *
 * The library cannot get past a bank's one-time code on its own: after the
 * login button it waits for the first redirect and compares the address with
 * the outcomes it knows, and the code page is not one of them, so the login
 * ends as an unknown error while the bank waits for a code. So the runner does
 * not try. `orla-il-banks trust <bank>` opens the bank's own login page in a
 * visible browser on the profile later runs will use, the person logs in there
 * (password and code typed into the bank's page, not into this program), and
 * the runner waits for the bank's home page and closes the window. The bank has
 * now seen this profile log in, and the scheduled runs log in from it.
 *
 * The same shape ZenMoney's Hapoalim plugin moved to in May 2026: the official
 * web login, then the session it leaves.
 */

import { browserArgs } from "./browser.js";

export interface TrustPage {
  /** where the person logs in */
  login: string;
  /** the addresses the bank lands on after a login that went through */
  home: RegExp;
}

//: Keyed by company id. The login page and the home pages are the ones
//: israeli-bank-scrapers itself uses for this bank (`getPossibleLoginResults`
//: in its hapoalim scraper); a test reads the library and fails when they part.
export const TRUST_PAGES: Readonly<Record<string, TrustPage>> = {
  hapoalim: {
    login: "https://login.bankhapoalim.co.il/cgi-bin/poalwwwc?reqName=getLogonPage",
    home: /^https:\/\/login\.bankhapoalim\.co\.il\/(portalserver\/HomePage|ng-portals-bt\/rb\/he\/homepage|ng-portals\/rb\/he\/homepage)/i,
  },
};

/**
 * Whether a failed login of this bank is worth the "trust this computer" hint.
 * A wrong or expired password is the bank saying something else, and pointing
 * a person at a device check then would send them the wrong way.
 */
export function needsTrustHint(company: string, error: string): boolean {
  if (!Object.hasOwn(TRUST_PAGES, company)) return false;
  return !/INVALID_PASSWORD|CHANGE_PASSWORD|ACCOUNT_BLOCKED/i.test(error);
}

export interface TrustOptions {
  profileDir: string;
  env: NodeJS.ProcessEnv;
  /** how long the person has to log in, code included */
  waitMs?: number;
  /** tests only: a stand-in bank, and no window */
  page?: TrustPage;
  headless?: boolean;
}

export type TrustOutcome = "trusted" | "closed" | "timeout";

export async function trustDevice(company: string, options: TrustOptions): Promise<TrustOutcome> {
  const page = options.page ?? TRUST_PAGES[company];
  if (!page) throw new Error(`${company} does not need this`);
  const { default: puppeteer } = await import("puppeteer");
  const executablePath = options.env["PUPPETEER_EXECUTABLE_PATH"];
  const browser = await puppeteer.launch({
    headless: options.headless ?? false,
    userDataDir: options.profileDir,
    args: browserArgs(options.env),
    defaultViewport: null,
    ...(executablePath ? { executablePath } : {}),
  });
  const deadline = Date.now() + (options.waitMs ?? 10 * 60 * 1000);
  try {
    const [first] = await browser.pages();
    const tab = first ?? (await browser.newPage());
    await tab.goto(page.login, { waitUntil: "domcontentloaded" });
    while (Date.now() < deadline) {
      if (!browser.connected) return "closed";
      const urls = (await browser.pages()).map((p) => p.url());
      if (urls.some((url) => page.home.test(url))) return "trusted";
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    return "timeout";
  } catch (error) {
    // The person closing the window mid-navigation lands here as well.
    if (!browser.connected) return "closed";
    throw error;
  } finally {
    if (browser.connected) await browser.close();
  }
}
