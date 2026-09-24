/**
 * The mapping, rule by rule. Every case here is a way the books go quietly
 * wrong: nothing fails, a number is just off.
 */
import { deepStrictEqual, match, notStrictEqual, ok, strictEqual, throws } from "node:assert/strict";
import { test } from "node:test";

import { accountIdentity, currencyCode, formatCents, israelDay, mapAccount, toCents } from "../dist/map.js";

const TODAY = "2026-09-24";

function txn(overrides = {}) {
  return {
    type: "normal",
    date: "2026-09-01T09:00:00.000Z",
    processedDate: "2026-09-10T00:00:00.000Z",
    originalAmount: -100,
    originalCurrency: "ILS",
    chargedAmount: -100,
    chargedCurrency: "ILS",
    description: "SUPER-PHARM TEL AVIV",
    status: "completed",
    ...overrides,
  };
}

function account(txns, accountNumber = "1234") {
  return { accountNumber, txns };
}

test("a day is the Israeli day, not the UTC one", () => {
  // 00:30 in Tel Aviv on the 24th (summer, UTC+3) is still the 23rd in UTC.
  strictEqual(israelDay("2026-09-23T21:30:00.000Z"), "2026-09-24");
  // winter, UTC+2
  strictEqual(israelDay("2026-01-10T22:30:00.000Z"), "2026-01-11");
  strictEqual(israelDay("2026-01-10T21:59:00.000Z"), "2026-01-10");
  // a bare date is already a day
  strictEqual(israelDay("2026-09-10"), "2026-09-10");
  throws(() => israelDay("not a date"));
});

test("amounts are summed in agorot, never on floats", () => {
  strictEqual(toCents(-45.9), -4590);
  strictEqual(toCents(0.1) + toCents(0.2), 30);
  strictEqual(formatCents(-4590), "-45.90");
  strictEqual(formatCents(5), "0.05");
  strictEqual(formatCents(-5), "-0.05");
  strictEqual(formatCents(123456), "1234.56");
});

test("a currency is read from what the bank prints, and an unknown one is not guessed", () => {
  strictEqual(currencyCode("₪"), "ILS");
  strictEqual(currencyCode('ש"ח'), "ILS");
  strictEqual(currencyCode("NIS"), "ILS");
  strictEqual(currencyCode("$"), "USD");
  strictEqual(currencyCode("usd"), "USD");
  strictEqual(currencyCode(" EUR "), "EUR");
  strictEqual(currencyCode("dollars"), null);
  strictEqual(currencyCode(""), null);
  strictEqual(currencyCode(undefined), null);
});

test("a pending row is left out and counted", () => {
  const out = mapAccount("hapoalim", account([txn({ status: "pending" }), txn()]), TODAY);
  strictEqual(out.rows.length, 1);
  strictEqual(out.skipped.pending, 1);
});

test("a row that moved nothing is left out", () => {
  const out = mapAccount("hapoalim", account([txn({ chargedAmount: 0 })]), TODAY);
  deepStrictEqual(out.rows, []);
  strictEqual(out.skipped.zero, 1);
});

test("a purchase books on the day it was made, with the charged amount", () => {
  const [row] = mapAccount("isracard", account([txn({ chargedAmount: -45.9 })]), TODAY).rows;
  strictEqual(row.occurred_on, "2026-09-01");
  strictEqual(row.amount, "-45.90");
  strictEqual(row.currency, "ILS");
  strictEqual(row.payee, "SUPER-PHARM TEL AVIV");
  strictEqual(row.account_kind, "card");
});

test("an installment books on the day it was charged, and says which one it is", () => {
  const [row] = mapAccount(
    "isracard",
    account([
      txn({
        type: "installments",
        date: "2026-09-05T09:00:00.000Z",
        processedDate: "2026-10-10T00:00:00.000Z",
        originalAmount: -1200,
        chargedAmount: -100,
        installments: { number: 3, total: 12 },
      }),
    ]),
    TODAY,
  ).rows;
  strictEqual(row.occurred_on, "2026-10-10");
  strictEqual(row.amount, "-100.00");
  strictEqual(row.note, "Installment 3 of 12, purchase total 1200.00 ILS");
});

test("a purchase abroad keeps its original amount in the note", () => {
  const [row] = mapAccount(
    "max",
    account([txn({ originalAmount: -45.99, originalCurrency: "USD", chargedAmount: -171.4, memo: "  AMAZON   MKTPLACE " })]),
    TODAY,
  ).rows;
  strictEqual(row.currency, "ILS");
  strictEqual(row.amount, "-171.40");
  strictEqual(row.note, "Original amount 45.99 USD. AMAZON MKTPLACE");
});

test("the charged currency falls back to the account's, then to shekels, and an unreadable one is left out", () => {
  const usd = mapAccount("leumi", { accountNumber: "9", currency: "$", txns: [txn({ chargedCurrency: undefined })] }, TODAY);
  strictEqual(usd.rows[0].currency, "USD");
  const ils = mapAccount("leumi", account([txn({ chargedCurrency: undefined })]), TODAY);
  strictEqual(ils.rows[0].currency, "ILS");
  const odd = mapAccount("leumi", account([txn({ chargedCurrency: "points" })]), TODAY);
  deepStrictEqual(odd.rows, []);
  strictEqual(odd.skipped.currency, 1);
});

test("two identical rows are two rows, and get the same two ids on every run", () => {
  const coffee = () => txn({ chargedAmount: -14, description: "AROMA" });
  const first = mapAccount("hapoalim", account([coffee(), coffee()]), TODAY).rows;
  const again = mapAccount("hapoalim", account([coffee(), coffee()]), TODAY).rows;
  strictEqual(first.length, 2);
  notStrictEqual(first[0].external_id, first[1].external_id);
  deepStrictEqual(
    first.map((r) => r.external_id),
    again.map((r) => r.external_id),
  );
  match(first[0].external_id, /^il:hapoalim:[0-9a-f]{24}:0$/);
  match(first[1].external_id, /:1$/);
});

test("a repeated bank reference does not make two different rows one", () => {
  // Several banks reuse the reference number (asmachta). If the id were the
  // reference alone, the second row would be filed as a duplicate and lost.
  const rows = mapAccount(
    "discount",
    account([txn({ identifier: 777, chargedAmount: -50 }), txn({ identifier: 777, chargedAmount: -80 })]),
    TODAY,
  ).rows;
  notStrictEqual(rows[0].external_id, rows[1].external_id);
});

test("the id does not move when the process runs in another zone", () => {
  // The same purchase as a UTC server and an Israeli laptop would print it.
  const utc = mapAccount("max", account([txn({ date: "2026-09-01T00:00:00.000Z" })]), TODAY).rows[0];
  const israel = mapAccount("max", account([txn({ date: "2026-08-31T21:00:00.000Z" })]), TODAY).rows[0];
  strictEqual(utc.occurred_on, israel.occurred_on);
  strictEqual(utc.external_id, israel.external_id);
});

test("the account number does not travel: a hash for the key, four digits for the name", () => {
  const { key, name } = accountIdentity("hapoalim", "12-345-678901");
  match(key, /^il:hapoalim:[0-9a-f]{16}$/);
  ok(!key.includes("678901"));
  strictEqual(name, "Bank Hapoalim ••8901");
  strictEqual(accountIdentity("hapoalim", "12-345-678901").key, key);
  notStrictEqual(accountIdentity("leumi", "12-345-678901").key, key);
  strictEqual(accountIdentity("max", "").name, "Max");
  const [row] = mapAccount("hapoalim", account([txn()], "12-345-678901"), TODAY).rows;
  ok(!JSON.stringify(row).includes("345-678901"));
});

test("a card the bank pays off gets one money-in row per billing day", () => {
  const out = mapAccount(
    "isracard",
    account([
      txn({ chargedAmount: -100 }),
      txn({ chargedAmount: -50.5, description: "SHUFERSAL" }),
      txn({ chargedAmount: 20, description: "REFUND" }),
      txn({
        type: "installments",
        date: "2026-09-05T09:00:00.000Z",
        chargedAmount: -0.1,
        originalAmount: -1.2,
        installments: { number: 1, total: 12 },
      }),
    ]),
    TODAY,
  );
  strictEqual(out.cycles, 1);
  const cycle = out.rows.find((r) => r.payee === "Billing cycle payment");
  ok(cycle);
  strictEqual(cycle.amount, "130.60");
  strictEqual(cycle.occurred_on, "2026-09-10");
  strictEqual(cycle.currency, "ILS");
  strictEqual(cycle.account_kind, "card");
  match(cycle.external_id, /^il:isracard:cycle:[0-9a-f]{16}:2026-09-10:ILS$/);
  match(cycle.note, /4 rows/);
});

test("a billing day still ahead gets no cycle row yet, while its purchases are sent", () => {
  // Sent now, a cycle row would carry a partial sum under an id that never
  // changes, and the full sum arriving later would be filed as a duplicate.
  const out = mapAccount("visaCal", account([txn({ processedDate: "2026-10-10T00:00:00.000Z" })]), TODAY);
  strictEqual(out.cycles, 0);
  strictEqual(out.rows.length, 1);
});

test("the billing day itself counts as come", () => {
  const out = mapAccount("amex", account([txn({ processedDate: "2026-09-23T21:00:00.000Z" })]), TODAY);
  strictEqual(out.cycles, 1);
});

test("banks and prepaid cards get no cycle row: no bank pays them off", () => {
  strictEqual(mapAccount("hapoalim", account([txn()]), TODAY).cycles, 0);
  strictEqual(mapAccount("beyahadBishvilha", account([txn()]), TODAY).cycles, 0);
});

test("a cycle that nets to zero is not a payment", () => {
  const out = mapAccount("max", account([txn({ chargedAmount: -30 }), txn({ chargedAmount: 30, description: "REFUND" })]), TODAY);
  strictEqual(out.cycles, 0);
});

test("a cycle is summed per currency", () => {
  const out = mapAccount(
    "isracard",
    account([txn({ chargedAmount: -10 }), txn({ chargedAmount: -3, chargedCurrency: "USD", description: "APPLE" })]),
    TODAY,
  );
  const cycles = out.rows.filter((r) => r.payee === "Billing cycle payment");
  deepStrictEqual(cycles.map((r) => `${r.amount} ${r.currency}`).sort(), ["10.00 ILS", "3.00 USD"]);
});

test("pending rows are not in the cycle", () => {
  const out = mapAccount("max", account([txn({ chargedAmount: -10 }), txn({ status: "pending", chargedAmount: -99 })]), TODAY);
  strictEqual(out.rows.find((r) => r.payee === "Billing cycle payment").amount, "10.00");
});

test("long text is cut to what the door takes, not refused", () => {
  const [row] = mapAccount("leumi", account([txn({ description: "x".repeat(500), memo: "y".repeat(5000) })]), TODAY).rows;
  strictEqual(row.payee.length, 200);
  strictEqual(row.note.length, 2000);
  ok(row.external_id.length <= 120);
});
