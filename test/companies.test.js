/**
 * Our table against the library's. A scraper added, renamed or asking for a
 * new login field upstream must be a decision here, not a silent gap.
 */
import { deepStrictEqual, ok, strictEqual } from "node:assert/strict";
import { test } from "node:test";

import { SCRAPERS } from "israeli-bank-scrapers";

import { COMPANIES, LEFT_OUT } from "../dist/companies.js";

//: What the library lists as login fields but a person does not type: the
//: code callback is ours, and a long-term token is only got with a MITM proxy,
//: which this runner does not ask anybody to set up.
const NOT_TYPED = new Set(["otpCodeRetriever", "otpLongTermToken"]);

test("every scraper in the library is either supported or left out on purpose", () => {
  for (const id of Object.keys(SCRAPERS)) {
    ok(Object.hasOwn(COMPANIES, id) || Object.hasOwn(LEFT_OUT, id), `${id} is in the library and in neither table`);
  }
  for (const id of Object.keys(COMPANIES)) {
    ok(Object.hasOwn(SCRAPERS, id), `${id} is not in the library any more`);
  }
});

test("names and login fields match the library's", () => {
  for (const [id, spec] of Object.entries(COMPANIES)) {
    strictEqual(spec.name, SCRAPERS[id].name, id);
    deepStrictEqual(
      [...spec.fields].sort(),
      SCRAPERS[id].loginFields.filter((field) => !NOT_TYPED.has(field)).sort(),
      id,
    );
  }
});

test("only credit cards are paid off by a bank", () => {
  const billed = Object.entries(COMPANIES)
    .filter(([, spec]) => spec.billedByBank)
    .map(([id]) => id)
    .sort();
  deepStrictEqual(billed, ["amex", "isracard", "max", "visaCal"]);
  for (const id of billed) strictEqual(COMPANIES[id].kind, "card");
});
