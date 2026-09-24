/**
 * The institutions this runner reads, and the two facts about each one that
 * the library does not say and the books need.
 *
 * `kind` is what the account IS in Orla. A card account that arrived as a
 * bank account is wrong in every report that splits by kind, and nothing in
 * the rows would ever reveal it.
 *
 * `billedByBank` marks the credit cards whose month of purchases a bank pays
 * off in one line. Only those get a billing-cycle row (see `map.ts`). A
 * prepaid card is also a card, but no bank pays it off, and a cycle row there
 * would be income that never happened.
 *
 * Names and login fields are copied from the library's `SCRAPERS` rather than
 * imported, so that the mapping and its tests do not load puppeteer. A test
 * reads the library's table and fails when the two drift apart.
 */

export type Kind = "bank" | "card";

export interface Company {
  /** the library's own name, used for the account in Orla */
  name: string;
  kind: Kind;
  billedByBank: boolean;
  /** what a person puts in the config, in the library's words */
  fields: readonly string[];
  /** asks for a one-time code at every login, so it cannot run unattended */
  otp?: true;
}

export const COMPANIES = {
  hapoalim: { name: "Bank Hapoalim", kind: "bank", billedByBank: false, fields: ["userCode", "password"] },
  leumi: { name: "Bank Leumi", kind: "bank", billedByBank: false, fields: ["username", "password"] },
  mizrahi: { name: "Mizrahi Bank", kind: "bank", billedByBank: false, fields: ["username", "password"] },
  discount: { name: "Discount Bank", kind: "bank", billedByBank: false, fields: ["id", "password", "num"] },
  mercantile: { name: "Mercantile Bank", kind: "bank", billedByBank: false, fields: ["id", "password", "num"] },
  otsarHahayal: { name: "Bank Otsar Hahayal", kind: "bank", billedByBank: false, fields: ["username", "password"] },
  union: { name: "Union", kind: "bank", billedByBank: false, fields: ["username", "password"] },
  beinleumi: { name: "Beinleumi", kind: "bank", billedByBank: false, fields: ["username", "password"] },
  massad: { name: "Massad", kind: "bank", billedByBank: false, fields: ["username", "password"] },
  yahav: { name: "Bank Yahav", kind: "bank", billedByBank: false, fields: ["username", "nationalID", "password"] },
  pagi: { name: "Pagi", kind: "bank", billedByBank: false, fields: ["username", "password"] },
  oneZero: {
    name: "One Zero",
    kind: "bank",
    billedByBank: false,
    fields: ["email", "password", "phoneNumber"],
    otp: true,
  },
  isracard: { name: "Isracard", kind: "card", billedByBank: true, fields: ["id", "card6Digits", "password"] },
  amex: { name: "Amex", kind: "card", billedByBank: true, fields: ["id", "card6Digits", "password"] },
  max: { name: "Max", kind: "card", billedByBank: true, fields: ["username", "password"] },
  visaCal: { name: "Visa Cal", kind: "card", billedByBank: true, fields: ["username", "password"] },
  beyahadBishvilha: { name: "Beyahad Bishvilha", kind: "card", billedByBank: false, fields: ["id", "password"] },
} as const satisfies Record<string, Company>;

export type CompanyId = keyof typeof COMPANIES;

/**
 * In the library and deliberately not here. Behatsdaa is the order history of
 * a benefits shop, not an account money sits in: every order there was paid
 * with a card, and a person who connects that card too would see each order
 * twice in the books. The test that compares this table with the library
 * requires every id to be either above or in this list, so a scraper added
 * upstream is a decision, not a silent gap.
 */
export const LEFT_OUT: Readonly<Record<string, string>> = {
  behatsdaa: "an order history paid by a card, which would count each order twice",
};

export function isCompany(id: string): id is CompanyId {
  return Object.hasOwn(COMPANIES, id);
}
