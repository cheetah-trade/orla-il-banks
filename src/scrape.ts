/**
 * The one file that talks to banks: a thin wrapper over israeli-bank-scrapers.
 *
 * Options that matter, and why they are set the way they are:
 *
 * - `enableTransactionsFilterByDate: false`. The card scrapers fetch whole
 *   billing months and then drop rows older than the start date. A billing
 *   cycle summed over what is left comes out short, and a short cycle row is
 *   filed once and never corrected (its id does not change). Unfiltered, every
 *   fetched month is whole. Older rows that come along are filed once and
 *   recognised as duplicates after that.
 * - `combineInstallments: false`. Each installment is its own charge (`map.ts`).
 * - No failure screenshots. A screenshot of a bank page is a statement on
 *   disk, and in GitHub Actions it would be one upload away from a log.
 *
 * The process clock must be on Israel time before this module loads: the
 * library parses the bank's dates in the local zone. `cli.ts` sets it.
 */

import { createScraper, type ScraperCredentials } from "israeli-bank-scrapers";

import { browserArgs } from "./browser.js";
import { COMPANIES } from "./companies.js";
import type { AccountConfig } from "./config.js";
import type { ScrapedAccount } from "./map.js";

export type ScrapeOutcome =
  | { company: AccountConfig["company"]; ok: true; accounts: ScrapedAccount[] }
  | { company: AccountConfig["company"]; ok: false; error: string };

export interface ScrapeOptions {
  startDate: Date;
  showBrowser: boolean;
  /** asks the person at the terminal; used for One Zero's login code */
  ask: (question: string) => Promise<string>;
  env: NodeJS.ProcessEnv;
  /** a kept browser profile (`profile.ts`), for a bank that must know the device */
  profileDir?: string;
}

export { browserArgs };

/**
 * Start the browser on an empty page and close it: the one check of a machine
 * that needs no bank. The first thing to break on a new server or container is
 * the browser, and finding that out through a bank login costs a failed login
 * attempt on a real account.
 */
export async function checkBrowser(env: NodeJS.ProcessEnv): Promise<string> {
  const { default: puppeteer } = await import("puppeteer");
  const executablePath = env["PUPPETEER_EXECUTABLE_PATH"];
  const browser = await puppeteer.launch({
    headless: true,
    args: browserArgs(env),
    ...(executablePath ? { executablePath } : {}),
  });
  try {
    const page = await browser.newPage();
    await page.setContent("<p>ready</p>");
    const text = await page.$eval("p", (p) => p.textContent);
    if (text !== "ready") throw new Error("the page did not render");
    return await browser.version();
  } finally {
    await browser.close();
  }
}

export async function scrape(account: AccountConfig, options: ScrapeOptions): Promise<ScrapeOutcome> {
  const { company } = account;
  const credentials: Record<string, unknown> = { ...account.credentials };
  if ("otp" in COMPANIES[company]) {
    credentials["otpCodeRetriever"] = () =>
      options.ask(`${COMPANIES[company].name} sent a code to ${account.credentials["phoneNumber"] ?? "your phone"}. Code: `);
  }
  const executablePath = options.env["PUPPETEER_EXECUTABLE_PATH"];
  // A bank that must know the device gets a browser we start ourselves on its
  // kept profile; the library takes it as an external browser. Everything else
  // gets the library's own fresh browser, and no bank session stays on disk.
  let own: import("puppeteer").Browser | undefined;
  try {
    if (options.profileDir) {
      const { default: puppeteer } = await import("puppeteer");
      own = await puppeteer.launch({
        headless: !options.showBrowser,
        userDataDir: options.profileDir,
        args: browserArgs(options.env),
        ...(executablePath ? { executablePath } : {}),
      });
    }
    const common = {
      companyId: company as never,
      startDate: options.startDate,
      combineInstallments: false,
      outputData: { enableTransactionsFilterByDate: false },
    };
    const scraper = createScraper(
      own
        ? { ...common, browser: own, skipCloseBrowser: true }
        : {
            ...common,
            showBrowser: options.showBrowser,
            args: browserArgs(options.env),
            ...(executablePath ? { executablePath } : {}),
          },
    );
    const result = await scraper.scrape(credentials as unknown as ScraperCredentials);
    if (!result.success) {
      return { company, ok: false, error: `${result.errorType ?? "error"}: ${result.errorMessage ?? "no message"}` };
    }
    return { company, ok: true, accounts: (result.accounts ?? []) as unknown as ScrapedAccount[] };
  } catch (error) {
    return { company, ok: false, error: error instanceof Error ? error.message : String(error) };
  } finally {
    // closed here and not by the library, so the profile is flushed to disk
    // whether the scrape went through or not
    if (own?.connected) await own.close();
  }
}
