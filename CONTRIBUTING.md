# Contributing

Pull requests are welcome. This package is small on purpose, and it holds
people's bank passwords, so it helps to know what belongs in it first.

## What belongs here

- Fixes to what a bank's rows mean in the books (`src/map.ts`), with a test
  that fails without the fix.
- A bank or card the library supports and this table does not
  (`src/companies.ts`). The test in `test/companies.test.js` fails until it is
  either added or listed as left out, with the reason.
- Error messages that say what to do next.

## What does not

- **Scraping fixes.** Logging into a bank and reading its pages is
  [israeli-bank-scrapers](https://github.com/eshaham/israeli-bank-scrapers)'
  job. Fix it there; we raise the pinned version here.
- **New runtime dependencies.** Every package in the tree runs next to a
  password. A PR that adds one needs to argue for it first.
- **Any other destination for the rows or the logins.** This package sends
  rows to the Orla address in the config and logins to the bank. A third
  destination, telemetry included, will not be merged.

## Sign your commits

This project uses the [Developer Certificate of Origin](https://developercertificate.org/):

```bash
git commit -s
```

## Before you open the PR

```bash
npm ci
npm run check
npm test
```
