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
}

export function browserArgs(env: NodeJS.ProcessEnv): string[] {
  // Chromium's sandbox needs kernel features a container or a hardened CI
  // runner often lacks. Turned off only when asked, and the Docker image asks.
  return env["ORLA_IL_NO_SANDBOX"] === "1" ? ["--no-sandbox", "--disable-setuid-sandbox"] : [];
}

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
  try {
    const scraper = createScraper({
      companyId: company as never,
      startDate: options.startDate,
      combineInstallments: false,
      showBrowser: options.showBrowser,
      args: browserArgs(options.env),
      ...(executablePath ? { executablePath } : {}),
      outputData: { enableTransactionsFilterByDate: false },
    });
    const result = await scraper.scrape(credentials as unknown as ScraperCredentials);
    if (!result.success) {
      return { company, ok: false, error: `${result.errorType ?? "error"}: ${result.errorMessage ?? "no message"}` };
    }
    return { company, ok: true, accounts: (result.accounts ?? []) as unknown as ScrapedAccount[] };
  } catch (error) {
    return { company, ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}
