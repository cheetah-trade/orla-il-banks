/**
 * Where the bank logins come from, and the checks that keep them where they are.
 *
 * Two sources, for the two ways this runs. On a person's machine: a JSON file
 * only they can read. In their own GitHub repository: two secrets, read from
 * the environment. Each value is taken from the file when the file has it,
 * otherwise from the environment.
 *
 * Everything that can be wrong with a config is found here, before a browser
 * opens: a login sent to a bank with a field misspelled is a failed login the
 * bank counts, and enough of those lock the account.
 */

import { readFileSync, statSync } from "node:fs";

import { COMPANIES, type CompanyId, isCompany, LEFT_OUT } from "./companies.js";

export const DEFAULT_URL = "https://app.orla.finance";
export const DEFAULT_DAYS = 90;
const MAX_DAYS = 730;

export interface AccountConfig {
  company: CompanyId;
  credentials: Record<string, string>;
}

export interface Config {
  url: string;
  /** empty only when the run was asked not to send anything */
  token: string;
  days: number;
  accounts: AccountConfig[];
}

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}

interface FileShape {
  orla?: { url?: unknown; token?: unknown };
  days?: unknown;
  accounts?: unknown;
}

/** Refuse a file that anyone but its owner can read, the way ssh refuses a key. */
export function checkPrivate(path: string, platform: NodeJS.Platform = process.platform): void {
  if (platform === "win32") return;
  const mode = statSync(path).mode & 0o777;
  if (mode & 0o077) {
    throw new ConfigError(
      `${path} can be read by other users (mode ${mode.toString(8)}). It holds bank passwords: run \`chmod 600 ${path}\` and try again.`,
    );
  }
}

function readFile(path: string): FileShape {
  checkPrivate(path);
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    // The parser's message quotes the text around the error, and that text
    // may be a password. Say where, not what.
    const where = error instanceof SyntaxError ? error.message.match(/position \d+/)?.[0] : undefined;
    throw new ConfigError(`${path} is not valid JSON${where ? ` (at ${where})` : ""}`);
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new ConfigError(`${path} must hold a JSON object`);
  }
  return parsed as FileShape;
}

function parseAccounts(raw: unknown, source: string): AccountConfig[] {
  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw);
    } catch {
      throw new ConfigError(`${source} is not valid JSON`);
    }
  }
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new ConfigError(`${source} must be a non-empty list of accounts`);
  }
  return raw.map((entry, index) => parseAccount(entry, `${source}[${index}]`));
}

function parseAccount(entry: unknown, where: string): AccountConfig {
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
    throw new ConfigError(`${where} must be an object`);
  }
  const { company, ...rest } = entry as Record<string, unknown>;
  if (typeof company !== "string") {
    throw new ConfigError(`${where} has no "company"`);
  }
  if (Object.hasOwn(LEFT_OUT, company)) {
    throw new ConfigError(`${where}: ${company} is not supported here: ${LEFT_OUT[company]}`);
  }
  if (!isCompany(company)) {
    throw new ConfigError(`${where}: unknown company "${company}". Run \`orla-il-banks companies\` for the list.`);
  }
  const fields = COMPANIES[company].fields as readonly string[];
  const credentials: Record<string, string> = {};
  for (const field of fields) {
    const value = rest[field];
    if (typeof value !== "string" || !value.trim()) {
      throw new ConfigError(`${where} (${company}) needs "${field}"`);
    }
    credentials[field] = value;
  }
  // A misspelled field is a login with an empty value, which the bank counts
  // as a failed attempt. Name the stray key, never its value.
  const stray = Object.keys(rest).filter((key) => !fields.includes(key));
  if (stray.length) {
    throw new ConfigError(`${where} (${company}) has fields it does not use: ${stray.join(", ")}. It takes: ${fields.join(", ")}`);
  }
  return { company, credentials };
}

function parseDays(raw: unknown): number {
  if (raw === undefined || raw === "") return DEFAULT_DAYS;
  const days = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isInteger(days) || days < 1 || days > MAX_DAYS) {
    throw new ConfigError(`days must be a whole number from 1 to ${MAX_DAYS}`);
  }
  return days;
}

export interface LoadOptions {
  file?: string;
  env: NodeJS.ProcessEnv;
  /** a dry run sends nothing and needs no key */
  needToken: boolean;
  /** a run from a saved file reads no bank and needs no logins */
  needAccounts?: boolean;
  days?: string;
}

export function loadConfig({ file, env, needToken, needAccounts = true, days }: LoadOptions): Config {
  const fromFile: FileShape = file ? readFile(file) : {};
  const url = (typeof fromFile.orla?.url === "string" && fromFile.orla.url) || env["ORLA_URL"] || DEFAULT_URL;
  const token = (typeof fromFile.orla?.token === "string" && fromFile.orla.token) || env["ORLA_TOKEN"] || "";
  if (needToken && !token) {
    throw new ConfigError(
      "no Orla key: set ORLA_TOKEN, or orla.token in the config file. Issue one in Orla under Integrations, Israeli banks.",
    );
  }
  const rawAccounts = fromFile.accounts ?? env["ORLA_IL_ACCOUNTS"];
  if (rawAccounts === undefined && needAccounts) {
    throw new ConfigError("no accounts: pass --config <file>, or set ORLA_IL_ACCOUNTS");
  }
  const accounts =
    rawAccounts === undefined
      ? []
      : parseAccounts(rawAccounts, fromFile.accounts !== undefined ? "accounts" : "ORLA_IL_ACCOUNTS");
  return {
    url: url.replace(/\/+$/, ""),
    token,
    days: parseDays(days ?? fromFile.days ?? env["ORLA_IL_DAYS"]),
    accounts,
  };
}

/** Every secret value in the config, for masking in logs. */
export function secretsOf(config: Config): string[] {
  const values = config.accounts.flatMap((account) => Object.values(account.credentials));
  if (config.token) values.push(config.token);
  return [...new Set(values)].filter((value) => value.length >= 3);
}

/** Replace every secret in a message the library or the browser produced. */
export function redact(message: string, secrets: readonly string[]): string {
  let out = message;
  for (const secret of [...secrets].sort((a, b) => b.length - a.length)) {
    out = out.split(secret).join("***");
  }
  return out;
}

/**
 * Inside GitHub Actions: refuse a public repository, and mask every password.
 *
 * A public repository's run logs are public. They carry account names and row
 * counts at best, and whatever a bank's error page said at worst. The event
 * payload says whether the repository is private, so this is checked, not
 * trusted to the README.
 *
 * GitHub masks a secret's whole value in logs, not the pieces of it. The
 * accounts arrive as one JSON secret, so a password inside it would print in
 * clear. `::add-mask::` registers each one on its own.
 */
export function guardActions(
  config: Config,
  env: NodeJS.ProcessEnv,
  write: (line: string) => void,
  readEvent: (path: string) => string = (path) => readFileSync(path, "utf8"),
): void {
  if (env["GITHUB_ACTIONS"] !== "true") return;
  for (const secret of secretsOf(config)) {
    write(`::add-mask::${secret}`);
  }
  const eventPath = env["GITHUB_EVENT_PATH"];
  let isPrivate: unknown;
  if (eventPath) {
    try {
      isPrivate = (JSON.parse(readEvent(eventPath)) as { repository?: { private?: unknown } }).repository?.private;
    } catch {
      isPrivate = undefined;
    }
  }
  if (isPrivate === false) {
    throw new ConfigError(
      "this repository is public, so its run logs are public too. Make it private (Settings, General, Danger Zone) before running bank logins here.",
    );
  }
  if (isPrivate !== true) {
    write("::warning::could not tell whether this repository is private. Its run logs must not be public.");
  }
}
