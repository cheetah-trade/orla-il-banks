#!/usr/bin/env node
/**
 * orla-il-banks: read Israeli bank and card accounts on this machine and file
 * the rows into Orla through the push door.
 *
 * The order of a run is the order of trust: everything that can be checked
 * without a bank is checked first (config, file permissions, the repository
 * being private), then the banks are read one by one, then the rows are sent.
 * A bank that fails does not stop the others, and nothing is sent for it.
 */

import { chmodSync, readFileSync, writeFileSync } from "node:fs";
import { createInterface } from "node:readline/promises";

import { optional, parse, RUN_FLAGS, TRUST_FLAGS } from "./args.js";
import { COMPANIES, type CompanyId, isCompany, LEFT_OUT } from "./companies.js";
import { ConfigError, guardActions, loadConfig, redact, secretsOf, type Config } from "./config.js";
import { israelDay, mapAccount, type PushRow, type ScrapedAccount } from "./map.js";
import { defaultProfileBase, profileDir } from "./profile.js";
import { push, PushError } from "./push.js";
import { needsTrustHint, trustDevice } from "./trust.js";

// The library reads the banks' dates in the process's zone. Pinned before any
// bank is read, so a run on a UTC server books the same days as one in Haifa.
process.env["TZ"] = "Asia/Jerusalem";

const EXIT = { ok: 0, failure: 1, usage: 2 } as const;

//: Every password and key of this run, once the config is read, so that even
//: an error nobody expected is printed without them.
let SECRETS: string[] = [];

const VERSION: string = (JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as { version: string })
  .version;

const HELP = `orla-il-banks ${VERSION}

Reads Israeli bank and card accounts on this machine and files the rows into
Orla. Your bank passwords stay here; Orla only receives the rows.

Usage:
  orla-il-banks run [--config <file>] [--days <n>] [--dry-run] [--only <ids>]
  orla-il-banks companies
  orla-il-banks check-browser
  orla-il-banks trust <company> [--config <file>]

run:
  --config <file>     JSON with orla.url, orla.token, days and accounts.
                      Must be readable by you only (chmod 600).
                      Without it: ORLA_TOKEN, ORLA_IL_ACCOUNTS, ORLA_URL, ORLA_IL_DAYS.
  --days <n>          how far back to read, 1 to 730 (default 90)
  --dry-run           read the banks and show what would be sent; send nothing
  --only <ids>        only these companies, comma separated (e.g. isracard,max)
  --save-json <file>  also save what the banks returned (readable by you only)
  --from-json <file>  send a saved file instead of reading the banks
  --show-browser      show the browser while it logs in, for debugging
  --profile-dir <dir> where kept browser profiles live (default ~/.orla-il-banks/profiles)

check-browser starts the browser on an empty page and closes it. Run it
first on a new machine, container or CI runner: it touches no bank.

trust opens a bank's own login page on the browser profile later runs use.
Log in there yourself, with the code the bank sends; the window closes when
the bank shows your accounts. Needed once per computer for Bank Hapoalim,
which asks for a code whenever a login comes from a device it does not know.

Exit status: 0 everything went through, 1 a bank or the delivery failed,
2 the command line or the config is wrong.
`;

interface Saved {
  company: string;
  accounts: ScrapedAccount[];
}

function fail(message: string, code: number): never {
  process.stderr.write(`orla-il-banks: ${message}\n`);
  process.exit(code);
}

function companiesText(): string {
  const lines = Object.entries(COMPANIES).map(([id, spec]) => {
    const note =
      "otp" in spec
        ? "  (asks for a code at every login: run it from a terminal)"
        : "trustedDevice" in spec
          ? `  (once per computer: orla-il-banks trust ${id})`
          : "";
    return `  ${id.padEnd(18)} ${spec.name.padEnd(20)} ${spec.fields.join(", ")}${note}`;
  });
  const out = Object.entries(LEFT_OUT).map(([id, why]) => `  ${id.padEnd(18)} not supported: ${why}`);
  return `Company id          Name                 Config fields\n${lines.join("\n")}\n\n${out.join("\n")}\n`;
}

function readSaved(path: string): Saved[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(path, "utf8"));
  } catch {
    throw new ConfigError(`${path} is not a file saved by --save-json`);
  }
  if (!Array.isArray(parsed)) throw new ConfigError(`${path} is not a file saved by --save-json`);
  return parsed as Saved[];
}

function onlyList(raw: string | undefined): Set<string> | null {
  if (!raw) return null;
  const ids = raw.split(",").map((id) => id.trim()).filter(Boolean);
  for (const id of ids) {
    if (!isCompany(id)) throw new ConfigError(`--only: unknown company "${id}"`);
  }
  return new Set(ids);
}

async function ask(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stderr });
  try {
    return (await rl.question(question)).trim();
  } finally {
    rl.close();
  }
}

async function readBanks(
  config: Config,
  only: Set<string> | null,
  showBrowser: boolean,
  secrets: string[],
  profileBase: string,
) {
  const { scrape } = await import("./scrape.js");
  const startDate = new Date(Date.now() - config.days * 24 * 3600 * 1000);
  const read: Saved[] = [];
  let failed = 0;
  for (const account of config.accounts) {
    if (only && !only.has(account.company)) continue;
    const spec = COMPANIES[account.company];
    const name = spec.name;
    if ("otp" in spec && !process.stdin.isTTY) {
      process.stderr.write(`${name}: skipped. It asks for a code at every login, so it only runs from a terminal.\n`);
      failed += 1;
      continue;
    }
    let kept: string | undefined;
    if ("trustedDevice" in spec) {
      if (process.env["GITHUB_ACTIONS"] === "true" || process.env["ORLA_IL_EPHEMERAL"] === "1") {
        // A runner or a container is a new device every time, and keeping the
        // profile there would mean a bank session in a cache or an image.
        const where = process.env["GITHUB_ACTIONS"] === "true" ? "a GitHub runner" : "this container";
        process.stderr.write(
          `${name}: skipped. It asks for a code whenever a login comes from a device it does not know, and ${where} is new every time. Run it from your own computer.\n`,
        );
        failed += 1;
        continue;
      }
      try {
        kept = profileDir(profileBase, account.company, account.credentials);
      } catch (error) {
        if (!(error instanceof ConfigError)) throw error;
        process.stderr.write(`${name}: skipped. ${error.message}\n`);
        failed += 1;
        continue;
      }
    }
    process.stdout.write(`${name}: logging in\n`);
    const outcome = await scrape(account, { startDate, showBrowser, ask, env: process.env, profileDir: kept });
    if (!outcome.ok) {
      process.stderr.write(`${name}: failed. ${redact(outcome.error, secrets)}\n`);
      if (needsTrustHint(account.company, outcome.error)) {
        process.stderr.write(
          `${name}: if the bank asked for a code, this computer is new to it. Run \`orla-il-banks trust ${account.company}\` once, log in on the bank's page, then run again.\n`,
        );
      }
      failed += 1;
      continue;
    }
    read.push({ company: account.company, accounts: outcome.accounts });
  }
  return { read, failed };
}

async function run(flags: Record<string, string | boolean>): Promise<number> {
  const unknown = Object.keys(flags).filter((flag) => !RUN_FLAGS.has(flag));
  if (unknown.length) fail(`unknown flag ${unknown.map((f) => `--${f}`).join(", ")}. See --help.`, EXIT.usage);

  const dryRun = flags["dry-run"] === true;
  const fromJson = optional(flags, "from-json");
  const saveJson = optional(flags, "save-json");
  let config: Config;
  let only: Set<string> | null;
  try {
    config = loadConfig({
      file: optional(flags, "config"),
      env: process.env,
      needToken: !dryRun,
      needAccounts: !fromJson,
      days: optional(flags, "days"),
    });
    only = onlyList(optional(flags, "only"));
    guardActions(config, process.env, (line) => process.stdout.write(`${line}\n`));
  } catch (error) {
    if (error instanceof ConfigError) fail(error.message, EXIT.usage);
    throw error;
  }
  const secrets = secretsOf(config);
  SECRETS = secrets;

  let read: Saved[];
  let failed = 0;
  if (fromJson) {
    try {
      read = readSaved(fromJson).filter((saved) => !only || only.has(saved.company));
    } catch (error) {
      if (error instanceof ConfigError) fail(error.message, EXIT.usage);
      throw error;
    }
  } else {
    const profileBase = optional(flags, "profile-dir") ?? defaultProfileBase(process.env);
    ({ read, failed } = await readBanks(config, only, flags["show-browser"] === true, secrets, profileBase));
  }

  if (saveJson && !fromJson) {
    // A bank statement on disk: readable by this user only, like the config.
    // `mode` applies only to a file being created, so an existing one is
    // narrowed before it is written.
    writeFileSync(saveJson, "", { mode: 0o600 });
    chmodSync(saveJson, 0o600);
    writeFileSync(saveJson, `${JSON.stringify(read, null, 2)}\n`);
    process.stdout.write(`saved what the banks returned to ${saveJson}\n`);
  }

  const today = israelDay(new Date());
  //: One delivery per login, never one for everything. Orla links two rows of
  //: one delivery as a transfer by itself (same day, same amount, one each
  //: way), a rule written for one login at one institution. Across
  //: institutions it would take a card refund and an unrelated bank debit of
  //: the same amount for a transfer and hide the expense. Per login, the card's
  //: cycle row and the bank's line meet as a suggestion instead: one click.
  const deliveries: { name: string; rows: PushRow[] }[] = [];
  for (const saved of read) {
    if (!isCompany(saved.company)) {
      process.stderr.write(`${saved.company}: not a company this runner knows, left out\n`);
      failed += 1;
      continue;
    }
    const company: CompanyId = saved.company;
    const rows: PushRow[] = [];
    deliveries.push({ name: COMPANIES[company].name, rows });
    for (const account of saved.accounts) {
      const mapped = mapAccount(company, account, today);
      rows.push(...mapped.rows);
      const name = mapped.rows[0]?.account_name ?? COMPANIES[company].name;
      const left = Object.entries(mapped.skipped)
        .filter(([, count]) => count > 0)
        .map(([why, count]) => `${count} ${why}`);
      const cycles = mapped.cycles ? `, ${mapped.cycles} billing cycles` : "";
      process.stdout.write(
        `${name}: ${mapped.rows.length - mapped.cycles} rows${cycles}${left.length ? ` (left out: ${left.join(", ")})` : ""}\n`,
      );
    }
  }

  const count = deliveries.reduce((sum, d) => sum + d.rows.length, 0);
  if (dryRun) {
    process.stdout.write(`dry run: ${count} rows ready, nothing sent\n`);
    return failed ? EXIT.failure : EXIT.ok;
  }
  if (!count) {
    process.stdout.write("nothing to send\n");
    return failed ? EXIT.failure : EXIT.ok;
  }

  try {
    const totals = { booked: 0, duplicates: 0, skipped_closed: 0, rejected: [] as Array<Record<string, string>> };
    for (const delivery of deliveries) {
      if (!delivery.rows.length) continue;
      const out = await push(config.url, config.token, delivery.rows);
      totals.booked += out.booked;
      totals.duplicates += out.duplicates;
      totals.skipped_closed += out.skipped_closed;
      totals.rejected.push(...out.rejected);
    }
    process.stdout.write(
      `Orla: ${totals.booked} new, ${totals.duplicates} already there` +
        (totals.skipped_closed ? `, ${totals.skipped_closed} in closed months` : "") +
        (totals.rejected.length ? `, ${totals.rejected.length} refused` : "") +
        "\n",
    );
    for (const refusal of totals.rejected) {
      process.stderr.write(`refused ${refusal["external_id"] ?? "a row"}: ${refusal["reason"] ?? JSON.stringify(refusal)}\n`);
    }
    if (totals.rejected.length) failed += 1;
  } catch (error) {
    if (error instanceof PushError) {
      process.stderr.write(`orla-il-banks: ${redact(error.message, secrets)}\n`);
      return EXIT.failure;
    }
    throw error;
  }
  return failed ? EXIT.failure : EXIT.ok;
}

async function trust(company: string | undefined, flags: Record<string, string | boolean>): Promise<number> {
  const unknown = Object.keys(flags).filter((flag) => !TRUST_FLAGS.has(flag));
  if (unknown.length) fail(`unknown flag ${unknown.map((f) => `--${f}`).join(", ")}. See --help.`, EXIT.usage);
  if (!company || !isCompany(company)) fail(`trust needs a company id. See \`orla-il-banks companies\`.`, EXIT.usage);
  const spec = COMPANIES[company];
  if (!("trustedDevice" in spec)) {
    fail(`${spec.name} does not need a trusted computer; \`orla-il-banks run\` logs in on its own.`, EXIT.usage);
  }
  if (process.env["GITHUB_ACTIONS"] === "true") {
    fail("trust needs a person at a screen and a browser profile kept on this computer; it does not run in GitHub Actions.", EXIT.usage);
  }
  let config: Config;
  let dirs: string[];
  try {
    // the config only names the profile: one per login, as `run` will use it
    config = loadConfig({ file: optional(flags, "config"), env: process.env, needToken: false });
    const base = optional(flags, "profile-dir") ?? defaultProfileBase(process.env);
    dirs = config.accounts
      .filter((account) => account.company === company)
      .map((account) => profileDir(base, company, account.credentials));
  } catch (error) {
    if (error instanceof ConfigError) fail(error.message, EXIT.usage);
    throw error;
  }
  SECRETS = secretsOf(config);
  if (!dirs.length) fail(`no ${spec.name} login in the config: add it first, then run trust.`, EXIT.usage);
  let failed = 0;
  for (const [index, dir] of dirs.entries()) {
    const which = dirs.length > 1 ? ` (login ${index + 1} of ${dirs.length})` : "";
    process.stdout.write(
      `${spec.name}${which}: a browser window opens on the bank's own login page. Log in there with the code the bank sends. The window closes by itself when the bank shows your accounts; you have 10 minutes.\n`,
    );
    const outcome = await trustDevice(company, { profileDir: dir, env: process.env });
    if (outcome === "trusted") {
      process.stdout.write(`${spec.name}${which}: this computer is known to the bank now. \`orla-il-banks run\` logs in from it.\n`);
    } else {
      process.stderr.write(
        `${spec.name}${which}: ${outcome === "closed" ? "the window was closed before the bank showed your accounts" : "no login within 10 minutes"}. Run trust again when ready.\n`,
      );
      failed += 1;
    }
  }
  return failed ? EXIT.failure : EXIT.ok;
}

async function main(argv: string[]): Promise<number> {
  const { words, flags } = parse(argv);
  if (flags["version"]) {
    process.stdout.write(`${VERSION}\n`);
    return EXIT.ok;
  }
  const command = words[0];
  if (!command || flags["help"] || command === "help") {
    process.stdout.write(HELP);
    return command || flags["help"] ? EXIT.ok : EXIT.usage;
  }
  if (command === "companies") {
    process.stdout.write(companiesText());
    return EXIT.ok;
  }
  if (command === "check-browser") {
    const { checkBrowser } = await import("./scrape.js");
    try {
      process.stdout.write(`browser ok: ${await checkBrowser(process.env)}\n`);
      return EXIT.ok;
    } catch (error) {
      fail(`the browser did not start: ${error instanceof Error ? error.message : String(error)}`, EXIT.failure);
    }
  }
  if (command === "run") return run(flags);
  if (command === "trust") return trust(words[1], flags);
  fail(`unknown command "${command}". See --help.`, EXIT.usage);
}

main(process.argv.slice(2)).then(
  (code) => process.exit(code),
  (error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`orla-il-banks: ${redact(message, SECRETS)}\n`);
    process.exit(EXIT.failure);
  },
);
