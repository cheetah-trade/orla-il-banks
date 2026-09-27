/**
 * `orla-il-banks setup`: everything a person would otherwise do by hand, as
 * questions, in the order they need answering.
 *
 * 1. The Orla key, read with the echo off, and checked with Orla before it is
 *    kept: a key pasted short is found now and not by tomorrow's run.
 * 2. Which banks and cards, from the list by number.
 * 3. The login of each, with the password read with the echo off.
 * 4. The config written readable by its owner only, where `run` finds it
 *    without being told.
 * 5. The browser, downloaded when this computer does not have the one the
 *    runner needs, after asking.
 * 6. Bank Hapoalim introduced to this computer (`trust`), when it is chosen.
 * 7. An offer to run it every day by itself (launchd, Task Scheduler), and
 *    to run now.
 *
 * Run again on a computer set up already, it asks first what for: a new Orla
 * key with the logins kept (a key runs out), a bank added or a login changed
 * (a new password; the login typed again replaces the saved one, never sits
 * next to it), or starting over.
 *
 * The questions and the checks are injected, so the tests drive the whole
 * wizard with scripted answers and no network, bank or browser.
 */

import { COMPANIES, type CompanyId, isCompany } from "./companies.js";
import { type ConfigFile, readConfigFile, saveConfig } from "./config.js";
import { confirm, type Io } from "./prompt.js";
import { type At, DEFAULT_AT, formatAt, parseAt } from "./schedule.js";
import type { KeyCheck } from "./push.js";

//: What each login field is called when asked, in the words the banks use.
export const FIELD_LABELS: Readonly<Record<string, string>> = {
  userCode: "User code (קוד משתמש)",
  username: "Username",
  password: "Password",
  id: "ID number (Teudat Zehut)",
  nationalID: "ID number (Teudat Zehut)",
  num: "Identification code (the extra code the bank gave you)",
  card6Digits: "First 6 digits of your card",
  email: "Email",
  phoneNumber: "Phone number with the country code (+972...)",
};

const SECRET_FIELDS = new Set(["password"]);

export interface SetupDeps {
  configPath: string;
  version: string;
  checkKey: (token: string) => Promise<{ result: KeyCheck; detail: string }>;
  ensureBrowser: (io: Io) => Promise<boolean>;
  trust: (company: CompanyId, credentials: Record<string, string>) => Promise<boolean>;
  /** sets the daily run up; absent where this computer has no scheduler we know */
  schedule?: (at: At) => Promise<{ ok: boolean; message: string }>;
}

export interface SetupOutcome {
  saved: boolean;
  runNow: boolean;
}

const KEY_MESSAGES: Readonly<Record<KeyCheck, string>> = {
  ok: "Orla accepted the key.",
  "door-off":
    "Orla knows the key, but Israeli banks are not switched on for your space yet. Ask the Orla team to switch them on; you can finish here meanwhile.",
  revoked: "This key belongs to a source that was revoked in Orla. Issue a new key on the Israeli banks card.",
  rejected:
    "Orla did not accept this key. Check you pasted all of it (it starts with oit_). If it is complete, it may have expired or been revoked, or Israeli banks may be switched off for your space: issue a new key on the Israeli banks card.",
  "wrong-scope": "This is not an Israeli banks key. Issue one on the Israeli banks card in Orla, under Integrations.",
  unreachable: "Could not reach Orla to check the key",
};

async function askKey(io: Io, deps: SetupDeps): Promise<string | null> {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const key = await io.askSecret("Paste the key from Orla (Integrations, Israeli banks), then press Enter: ");
    if (!/^oit_[A-Za-z0-9_-]{8,}$/.test(key)) {
      io.say("That does not look like an Orla key: it starts with oit_ and has no spaces. Try again.");
      continue;
    }
    const { result, detail } = await deps.checkKey(key);
    if (result === "ok" || result === "door-off") {
      io.say(KEY_MESSAGES[result]);
      return key;
    }
    if (result === "unreachable") {
      io.say(`${KEY_MESSAGES.unreachable} (${detail}). Keeping it; the first run will tell.`);
      return key;
    }
    io.say(KEY_MESSAGES[result]);
  }
  return null;
}

export function bankMenu(): string[] {
  return Object.entries(COMPANIES).map(([id, spec], i) => {
    const note =
      "otp" in spec ? "  (asks for a code at every login)" : "trustedDevice" in spec ? "  (needs this computer once)" : "";
    return `${String(i + 1).padStart(3)}. ${spec.name}${note}  [${id}]`;
  });
}

/** Numbers or ids, separated by commas or spaces. Null when anything is off. */
export function parseBankChoice(answer: string): CompanyId[] | null {
  const ids = Object.keys(COMPANIES) as CompanyId[];
  const picked: CompanyId[] = [];
  for (const word of answer.split(/[\s,]+/).filter(Boolean)) {
    const n = Number(word);
    const id = Number.isInteger(n) ? ids[n - 1] : isCompany(word) ? word : undefined;
    if (!id) return null;
    if (!picked.includes(id)) picked.push(id);
  }
  return picked.length ? picked : null;
}

async function askBanks(io: Io): Promise<CompanyId[] | null> {
  io.say("\nWhich banks and cards do you use?");
  for (const line of bankMenu()) io.say(line);
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const choice = parseBankChoice(await io.ask("Type their numbers, separated by commas (for example 1,13): "));
    if (choice) return choice;
    io.say("Only numbers from the list, please.");
  }
  return null;
}

async function askLogin(io: Io, company: CompanyId): Promise<Record<string, string>> {
  const spec = COMPANIES[company];
  io.say(`\n${spec.name}: the login you use on the bank's website.`);
  if ("otp" in spec) io.say("It sends a code at every login, so it will ask you for the code each time you run it.");
  const account: Record<string, string> = { company };
  for (const field of spec.fields) {
    const label = `${FIELD_LABELS[field] ?? field}: `;
    let value = "";
    while (!value) value = SECRET_FIELDS.has(field) ? await io.askSecret(label) : await io.ask(label);
    account[field] = value;
  }
  return account;
}

/** The field that tells two logins at one bank apart: the first one that is
 *  not a password (user code, username, ID number). */
export function identityOf(account: Record<string, string>): string {
  const company = account["company"];
  if (!company || !isCompany(company)) return "";
  const field = COMPANIES[company].fields.find((f) => !SECRET_FIELDS.has(f));
  return field ? (account[field] ?? "") : "";
}

function sameLogin(a: Record<string, string>, b: Record<string, string>): boolean {
  return a["company"] === b["company"] && identityOf(a) === identityOf(b);
}

/** "Max (…ser1)": enough for the person to recognise a login, on their own screen. */
export function loginLabel(account: Record<string, string>): string {
  const company = account["company"];
  const name = company && isCompany(company) ? COMPANIES[company].name : String(company);
  const who = identityOf(account);
  return who ? `${name} (…${who.slice(-4)})` : name;
}

/** A login typed again replaces the saved one (a new password, most often);
 *  any other is added. Two entries for one login would log in twice per run,
 *  once with the old password, and banks lock a login after a few failures. */
export function mergeLogins(
  saved: Array<Record<string, string>>,
  typed: Array<Record<string, string>>,
): { accounts: Array<Record<string, string>>; replaced: Array<Record<string, string>> } {
  const accounts = [...saved];
  const replaced: Array<Record<string, string>> = [];
  for (const login of typed) {
    const at = accounts.findIndex((old) => sameLogin(old, login));
    if (at >= 0) {
      accounts[at] = login;
      replaced.push(login);
    } else {
      accounts.push(login);
    }
  }
  return { accounts, replaced };
}

type Mode = "new" | "key" | "logins";

async function askMode(io: Io, existing: ConfigFile): Promise<Mode | null> {
  io.say(`There is a setup on this computer already, with ${existing.accounts.map(loginLabel).join(", ")}.`);
  io.say("  1. Put in a new Orla key and keep these logins");
  io.say("  2. Add a bank, or change a login (a new password included)");
  io.say("  3. Start over");
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const answer = (await io.ask("Type 1, 2 or 3: ")).trim();
    if (answer === "1") return "key";
    if (answer === "2") return "logins";
    if (answer === "3") return "new";
    io.say("Only 1, 2 or 3, please.");
  }
  return null;
}

/** The daily run, offered once everything else is in place. */
async function offerSchedule(io: Io, deps: SetupDeps, all: Array<Record<string, string>>): Promise<void> {
  if (!deps.schedule) return;
  const daily = await confirm(io, "\nRun it every day by itself, so Orla stays up to date without you?");
  if (!daily) {
    io.say(`Later: npx orla-il-banks@${deps.version} schedule`);
    return;
  }
  let at: At | null = null;
  for (let attempt = 1; attempt <= 3 && !at; attempt += 1) {
    const answer = await io.ask(`At what time? (for example 07:00; Enter for ${formatAt(DEFAULT_AT)}) `);
    at = answer.trim() ? parseAt(answer) : DEFAULT_AT;
    if (!at) io.say("A time of day, please, like 07:00 or 19:30.");
  }
  const outcome = await deps.schedule(at ?? DEFAULT_AT);
  io.say(outcome.message);
  if (!outcome.ok) return;
  io.say(`If a run fails, this computer shows a notification. To stop the daily run: npx orla-il-banks@${deps.version} unschedule`);
  if (all.some((a) => a["company"] === "oneZero")) {
    io.say("One Zero is not in the daily run: it asks for a code at every login, so run it yourself when you want it.");
  }
}

async function finish(
  io: Io,
  deps: SetupDeps,
  typed: Array<Record<string, string>>,
  all: Array<Record<string, string>>,
): Promise<SetupOutcome> {
  const browserReady = await deps.ensureBrowser(io);

  if (browserReady) {
    for (const account of typed) {
      const company = account["company"] as CompanyId;
      if (!("trustedDevice" in COMPANIES[company])) continue;
      const go = await confirm(
        io,
        `\n${COMPANIES[company].name} asks for a code when it sees a new computer. A window will open on the bank's own login page: log in there with the code the bank sends. (The window says Chrome is controlled by automated software: that is this program, waiting for you to log in.) Do it now?`,
      );
      const credentials = Object.fromEntries(Object.entries(account).filter(([k]) => k !== "company"));
      if (go && (await deps.trust(company, credentials))) io.say(`${COMPANIES[company].name} knows this computer now.`);
      else io.say(`Later: npx orla-il-banks@${deps.version} trust ${company}`);
    }
  }

  io.say(
    `\nAll set. To read your banks and send the transactions to Orla, run:\n  npx orla-il-banks@${deps.version} run\nTo change a password or the Orla key later, run setup again.`,
  );
  if (browserReady) await offerSchedule(io, deps, all);
  const runNow = browserReady && (await confirm(io, "Run it now?"));
  return { saved: true, runNow };
}

export async function runSetup(io: Io, deps: SetupDeps): Promise<SetupOutcome> {
  io.say(
    "This sets up orla-il-banks on this computer. Your bank logins stay in a file on this computer that only you can read; Orla receives only the transactions.\n",
  );
  const existing = readConfigFile(deps.configPath);
  let mode: Mode = "new";
  if (existing?.accounts.length) {
    const chosen = await askMode(io, existing);
    if (!chosen) {
      io.say("Nothing was changed.");
      return { saved: false, runNow: false };
    }
    mode = chosen;
  }

  // Changing a login keeps the key that works; every other path asks for one.
  const kept = mode === "logins" ? existing?.orla.token : undefined;
  const key = kept || (await askKey(io, deps));
  if (!key) {
    io.say("No working key, so nothing was changed. Issue a key in Orla and run setup again.");
    return { saved: false, runNow: false };
  }

  if (mode === "key" && existing) {
    saveConfig(deps.configPath, { ...existing, orla: { ...existing.orla, token: key } });
    io.say(`\nThe new key is saved. Your ${existing.accounts.length} login(s) are kept.`);
    return finish(io, deps, [], existing.accounts);
  }

  const banks = await askBanks(io);
  if (!banks) {
    io.say("No banks chosen, so nothing was changed.");
    return { saved: false, runNow: false };
  }
  const typed: Array<Record<string, string>> = [];
  for (const company of banks) typed.push(await askLogin(io, company));

  let file: ConfigFile = { orla: { token: key }, accounts: typed };
  if (mode === "logins" && existing) {
    const { accounts, replaced } = mergeLogins(existing.accounts, typed);
    file = { ...existing, orla: { ...existing.orla, token: key }, accounts };
    for (const login of replaced) io.say(`${loginLabel(login)}: the saved login is replaced with the one you typed.`);
  }
  saveConfig(deps.configPath, file);
  io.say(`\nSaved to ${deps.configPath}, readable by you only.`);
  return finish(io, deps, typed, file.accounts);
}
