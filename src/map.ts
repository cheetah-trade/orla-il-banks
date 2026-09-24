/**
 * What a scrape means in the books: the library's accounts and rows become the
 * rows Orla's push door takes.
 *
 * Pure on purpose: no browser, no network, and no clock except the `today` it
 * is handed. Every rule here is read back by a test, because a mistake in this
 * file does not fail loudly. A wrong date books a purchase in the wrong month,
 * a colliding id files a real purchase as a duplicate of another, and nothing
 * anywhere turns red.
 *
 * The rules, and why:
 *
 * - **Pending rows are not sent.** They carry no stable id and come back as
 *   completed rows later, often with another description. Sending both books
 *   the purchase twice.
 * - **A purchase books on the day it was made, an installment on the day it
 *   was charged.** An installment is a charge, not a purchase: booking it on
 *   its charge day is what makes it add up with the card's billing total and
 *   with the bank's line for that total.
 * - **Amounts are what was charged**, in the currency it was charged in. A
 *   purchase abroad keeps its original amount in the note.
 * - **Days are Israeli days.** The library hands out ISO instants; the day of
 *   an instant depends on the zone it is read in, and a purchase at 01:00 in
 *   Tel Aviv is still the previous day in UTC.
 * - **A card the bank pays off gets one row per billing cycle** on the card
 *   account: money in, equal to what the card charged that day. The bank's
 *   statement has the same total as one line going out, and Orla offers to link
 *   the two as a transfer. Without this row every shekel spent on a card is
 *   counted twice: once as the purchase and once as the bank's payment.
 */

import { createHash } from "node:crypto";

import { COMPANIES, type CompanyId, type Kind } from "./companies.js";

/** The parts of the library's `Transaction` this file reads. Declared here so
 *  the mapping can be tested without loading the library and puppeteer. */
export interface ScrapedTxn {
  type: string;
  identifier?: string | number;
  date: string;
  processedDate: string;
  originalAmount: number;
  originalCurrency: string;
  chargedAmount: number;
  chargedCurrency?: string;
  description: string;
  memo?: string;
  status: string;
  installments?: { number: number; total: number };
}

export interface ScrapedAccount {
  accountNumber: string;
  currency?: string;
  txns: ScrapedTxn[];
}

/** One row of the push door's contract (`PushRowIn` on the Orla side). */
export interface PushRow {
  external_id: string;
  account_key: string;
  account_name: string;
  account_kind: Kind;
  currency: string;
  occurred_on: string;
  amount: string;
  payee: string;
  note: string;
}

export interface Mapped {
  rows: PushRow[];
  /** how many of `rows` are billing-cycle rows */
  cycles: number;
  skipped: { pending: number; zero: number; currency: number };
}

//: The door's own limits (`PushRowIn`). Cut here, so a long bank memo costs
//: its tail and not the whole row.
const PAYEE_MAX = 200;
const NOTE_MAX = 2000;
const NAME_MAX = 120;

const JERUSALEM = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Jerusalem",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** The Israeli calendar day of an instant, as YYYY-MM-DD. */
export function israelDay(value: string | Date): string {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    // A bare date is already a day. Read as an instant it would be UTC
    // midnight, which is the same day in Israel, but only by luck of the offset.
    return value;
  }
  const at = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(at.getTime())) {
    throw new Error(`not a date: ${String(value)}`);
  }
  const parts = Object.fromEntries(JERUSALEM.formatToParts(at).map((p) => [p.type, p.value]));
  return `${parts["year"]}-${parts["month"]}-${parts["day"]}`;
}

/** Agorot, as an integer. Sums are taken here, never on floats. */
export function toCents(amount: number): number {
  return Math.round(amount * 100);
}

export function formatCents(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  return `${sign}${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, "0")}`;
}

const CURRENCY_WORDS: Readonly<Record<string, string>> = {
  "₪": "ILS",
  NIS: "ILS",
  'ש"ח': "ILS",
  "ש״ח": "ILS",
  $: "USD",
  "€": "EUR",
  "£": "GBP",
};

/** An ISO code from what a bank prints, or null when it is not one we can
 *  name. Null is not guessed into shekels: a row in an unknown currency is
 *  left out and counted, rather than booked at the wrong value. */
export function currencyCode(raw: string | undefined): string | null {
  if (raw === undefined) return null;
  const word = raw.trim();
  if (!word) return null;
  const known = CURRENCY_WORDS[word] ?? CURRENCY_WORDS[word.toUpperCase()];
  if (known) return known;
  return /^[A-Za-z]{3}$/.test(word) ? word.toUpperCase() : null;
}

function sha(text: string, length: number): string {
  return createHash("sha256").update(text).digest("hex").slice(0, length);
}

function squeeze(text: string | undefined): string {
  return (text ?? "").replace(/\s+/g, " ").trim();
}

function cut(text: string, max: number): string {
  return text.length <= max ? text : text.slice(0, max);
}

/**
 * The account's key and name in Orla. The number itself does not travel: the
 * key is a hash of it, and the name shows the last four digits, which is what
 * a person needs to tell two accounts apart and all a statement header shows.
 */
export function accountIdentity(company: CompanyId, accountNumber: string): { key: string; name: string } {
  const key = `il:${company}:${sha(`${company}:${accountNumber}`, 16)}`;
  const tail = accountNumber.replace(/\D/g, "").slice(-4);
  const name = cut(tail ? `${COMPANIES[company].name} ••${tail}` : COMPANIES[company].name, NAME_MAX);
  return { key, name };
}

function isPending(txn: ScrapedTxn): boolean {
  return txn.status !== "completed";
}

function isInstallment(txn: ScrapedTxn): boolean {
  return txn.type === "installments" && txn.installments !== undefined;
}

function noteFor(txn: ScrapedTxn, currency: string): string {
  const parts: string[] = [];
  const original = currencyCode(txn.originalCurrency);
  const originalCents = Math.abs(toCents(txn.originalAmount));
  if (isInstallment(txn) && txn.installments) {
    const total = original && originalCents ? `, purchase total ${formatCents(originalCents)} ${original}` : "";
    parts.push(`Installment ${txn.installments.number} of ${txn.installments.total}${total}`);
  } else if (original && original !== currency && originalCents) {
    parts.push(`Original amount ${formatCents(originalCents)} ${original}`);
  }
  const memo = squeeze(txn.memo);
  if (memo) parts.push(memo);
  return cut(parts.join(". "), NOTE_MAX);
}

/**
 * The row's id in Orla, which is how a second delivery of the same row is
 * recognised and filed once.
 *
 * Not the bank's reference number alone: several banks repeat it, and two
 * rows sharing an id is the worst failure this file has, because the second
 * one is taken for a duplicate and never booked, silently. So the id is a hash
 * of everything that tells rows apart, and two rows identical in all of it
 * (two coffees, same shop, same day, same price) are numbered in the order
 * the bank listed them. Both always fall inside the same scrape, since they
 * share a day, so the numbering is the same on every run.
 */
function fingerprint(company: CompanyId, accountKey: string, txn: ScrapedTxn): string {
  return sha(
    [
      company,
      accountKey,
      israelDay(txn.date),
      israelDay(txn.processedDate),
      String(toCents(txn.chargedAmount)),
      String(toCents(txn.originalAmount)),
      txn.originalCurrency ?? "",
      squeeze(txn.description),
      String(txn.identifier ?? ""),
      txn.installments ? `${txn.installments.number}/${txn.installments.total}` : "",
    ].join("\u001f"),
    24,
  );
}

export function mapAccount(company: CompanyId, account: ScrapedAccount, today: string): Mapped {
  const spec = COMPANIES[company];
  const { key, name } = accountIdentity(company, account.accountNumber);
  const fallbackCurrency = currencyCode(account.currency) ?? "ILS";
  const rows: PushRow[] = [];
  const skipped = { pending: 0, zero: 0, currency: 0 };
  const seen = new Map<string, number>();
  //: per billing day and currency: the cents charged and how many rows made them
  const cycles = new Map<string, { day: string; currency: string; cents: number; count: number }>();

  for (const txn of account.txns) {
    if (isPending(txn)) {
      skipped.pending += 1;
      continue;
    }
    const cents = toCents(txn.chargedAmount);
    if (cents === 0) {
      skipped.zero += 1;
      continue;
    }
    // A charged currency the bank named and we cannot read is not shekels.
    const currency =
      txn.chargedCurrency !== undefined && txn.chargedCurrency !== ""
        ? currencyCode(txn.chargedCurrency)
        : fallbackCurrency;
    if (currency === null) {
      skipped.currency += 1;
      continue;
    }
    const charged = israelDay(txn.processedDate);
    const occurredOn = isInstallment(txn) ? charged : israelDay(txn.date);

    const fp = fingerprint(company, key, txn);
    const ordinal = seen.get(fp) ?? 0;
    seen.set(fp, ordinal + 1);

    rows.push({
      external_id: `il:${company}:${fp}:${ordinal}`,
      account_key: key,
      account_name: name,
      account_kind: spec.kind,
      currency,
      occurred_on: occurredOn,
      amount: formatCents(cents),
      payee: cut(squeeze(txn.description), PAYEE_MAX),
      note: noteFor(txn, currency),
    });

    if (spec.billedByBank && charged <= today) {
      const slot = `${charged}|${currency}`;
      const cycle = cycles.get(slot) ?? { day: charged, currency, cents: 0, count: 0 };
      cycle.cents += cents;
      cycle.count += 1;
      cycles.set(slot, cycle);
    }
  }

  let cycleRows = 0;
  for (const cycle of cycles.values()) {
    // Refunds equal to the purchases: the bank charged nothing that day.
    if (cycle.cents === 0) continue;
    cycleRows += 1;
    rows.push({
      external_id: `il:${company}:cycle:${key.split(":")[2]}:${cycle.day}:${cycle.currency}`,
      account_key: key,
      account_name: name,
      account_kind: spec.kind,
      currency: cycle.currency,
      occurred_on: cycle.day,
      // The card charged -X; the bank paid +X into it.
      amount: formatCents(-cycle.cents),
      payee: "Billing cycle payment",
      note: `The card's charges for ${cycle.day}, ${cycle.count} rows. Link it to the bank's line for the same day.`,
    });
  }

  return { rows, cycles: cycleRows, skipped };
}
