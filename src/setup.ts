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
 * 7. An offer to run now.
 *
 * The questions and the checks are injected, so the tests drive the whole
 * wizard with scripted answers and no network, bank or browser.
 */

import { COMPANIES, type CompanyId, isCompany } from "./companies.js";
import { type ConfigFile, readConfigFile, saveConfig } from "./config.js";
import { confirm, type Io } from "./prompt.js";
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

export async function runSetup(io: Io, deps: SetupDeps): Promise<SetupOutcome> {
  io.say(
    "This sets up orla-il-banks on this computer. Your bank logins stay in a file on this computer that only you can read; Orla receives only the transactions.\n",
  );
  const key = await askKey(io, deps);
  if (!key) {
    io.say("No working key, so nothing was saved. Issue a key in Orla and run setup again.");
    return { saved: false, runNow: false };
  }
  const banks = await askBanks(io);
  if (!banks) {
    io.say("No banks chosen, so nothing was saved.");
    return { saved: false, runNow: false };
  }
  const accounts: Array<Record<string, string>> = [];
  for (const company of banks) accounts.push(await askLogin(io, company));

  const existing = readConfigFile(deps.configPath);
  let file: ConfigFile = { orla: { token: key }, accounts };
  if (existing?.accounts.length) {
    const keep = await confirm(
      io,
      `\nThere is already a setup here with ${existing.accounts.length} login(s). Keep them and add these?`,
    );
    if (keep) file = { ...existing, orla: { ...existing.orla, token: key }, accounts: [...existing.accounts, ...accounts] };
  }
  saveConfig(deps.configPath, file);
  io.say(`\nSaved to ${deps.configPath}, readable by you only.`);

  const browserReady = await deps.ensureBrowser(io);

  if (browserReady) {
    for (const account of accounts) {
      const company = account["company"] as CompanyId;
      if (!("trustedDevice" in COMPANIES[company])) continue;
      const go = await confirm(
        io,
        `\n${COMPANIES[company].name} asks for a code when it sees a new computer. A window will open on the bank's own login page: log in there with the code the bank sends. Do it now?`,
      );
      const credentials = Object.fromEntries(Object.entries(account).filter(([k]) => k !== "company"));
      if (go && (await deps.trust(company, credentials))) io.say(`${COMPANIES[company].name} knows this computer now.`);
      else io.say(`Later: npx orla-il-banks@${deps.version} trust ${company}`);
    }
  }

  io.say(
    `\nAll set. To read your banks and send the transactions to Orla, run:\n  npx orla-il-banks@${deps.version} run\nRun it again whenever you want fresh transactions.`,
  );
  const runNow = browserReady && (await confirm(io, "Run it now?"));
  return { saved: true, runNow };
}
