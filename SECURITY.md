# Security

## Reporting

Report privately through **GitHub private vulnerability reporting** on this
repository (Security tab, "Report a vulnerability"). If that is not available
to you, write to [support@orla.finance](mailto:support@orla.finance) with
`security` in the subject.

Please do not open a public issue for a suspected vulnerability.

## What this package holds, and what it does with it

It holds your bank logins for as long as a run lasts, and passes them to
[israeli-bank-scrapers](https://github.com/eshaham/israeli-bank-scrapers),
which types them into your bank's website in a local browser.

- The logins go to the bank's own site and nowhere else. The only other
  address this package talks to is the Orla address in your config, and only
  over https (plain http is allowed for `localhost` alone). A redirect from it
  is refused, so the key cannot be carried to a host you did not name.
- Orla receives transaction rows: date, amount, currency, description, a hashed
  account key and the account's last four digits. Never a login, never a full
  account number.
- A config file anyone but you can read is refused. A saved scrape
  (`--save-json`) is written readable by you only.
- In GitHub Actions a public repository is refused, and every password is
  masked in the log one by one.
- No failure screenshots are taken: a screenshot of a bank page is a statement.
- For a bank that checks devices (Bank Hapoalim), a browser profile is kept on
  this computer, one per login, in a folder readable by you only; a folder
  anyone else can read is refused. It holds a logged-in bank session. It is
  never kept in GitHub Actions or Docker, and deleting it forgets the device.
  `trust` opens the bank's own page for you to log in: the password and the
  code are typed there, not into this program.
- Every message that reaches a log has your passwords and key replaced with
  `***`, including errors nobody expected.

## Supply chain

This package ships `npm-shrinkwrap.json`: `npx orla-il-banks@<version>` installs
the exact dependency tree that was tested for that version, not the newest
versions its ranges allow. The code that sees your password is this package,
israeli-bank-scrapers, and puppeteer with the browser it drives; we read the
first two in full at each upgrade of the library.

## What the key can do

The Orla key adds transactions to one source in one space, and nothing else.
It cannot read your books, cannot pay anybody, and expires on the date you
chose when issuing it. If it leaks, revoke it in Orla under Integrations,
Israeli banks, and undo any delivery you do not recognise from the same panel.
