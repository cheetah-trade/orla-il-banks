# Live check: one bank, one real run

The tests cover what the rows mean against the library's data shapes. They do
not show that a bank's site lets the runner in today, or that what lands in
Orla matches what the bank shows. Only a person with their own login can check
that. This page is for that person: what to run, what to look at, and what to
send back, in about 20 minutes per bank.

Nobody needs your password, your Orla key or the code the bank texts you.
They go into setup on your computer and into the bank's own page, nowhere else.

## Before you start

- A Mac or a Windows computer with Node.js 22 or newer (`node --version`).
- An Orla account, and a key issued on Integrations, **Israeli banks**.
- The login you use on the bank's website, and access to that website in a
  browser, to compare.

## Run it

1. Follow [Set up on your computer](../README.md#set-up-on-your-computer-about-5-minutes)
   in the README. Note how long it took and anything that made you stop and
   think: that is part of the check.
2. Read the bank without sending anything:

   ```bash
   npx orla-il-banks@0.3.2 run --dry-run --only <id>
   ```

   `<id>` is the bank's id from the [Supported](../README.md#supported) table,
   for example `leumi`. It prints one line per account (`Bank Leumi ••1234: 57
   rows`) and ends with `dry run: N rows and M balances ready, nothing sent`.
3. Send it:

   ```bash
   npx orla-il-banks@0.3.2 run --only <id>
   ```

   It ends with `Orla: N new, 0 already there`.
4. Run the same command again. It should say `0 new, N already there`.

Copy what the terminal printed after steps 2 to 4. Read it through first: it
prints no passwords and no full account numbers, but check.

## Look in Orla

Open the bank's website next to Orla and answer each with yes, no, or not
applicable:

1. **Accounts.** Every account the bank shows is in Orla, named like
   `Bank Leumi ••1234`. A card that bills in dollars or euros also has
   `(USD)` or `(EUR)` accounts.
2. **Balance.** The balance in Orla equals the one the bank shows today. For a
   card: what is owed.
3. **Three rows.** Pick three completed rows on the bank's site, one of them a
   few weeks old. Each is in Orla on the same day, for the same amount, in the
   same direction.
4. **Cards only: installments.** A purchase in installments shows the month's
   charge, with `Installment 3 of 12, purchase total ...` in the note.
5. **Cards only: billing cycle.** On the last billing day the card has a
   `Billing cycle payment` row equal to what the card charged, and Orla
   suggests linking it with the bank's line.
6. **Pending rows.** Rows the bank still shows as pending are not in Orla.

If you said yes to the daily run, check the next morning that a file for that
day is in `~/.orla-il-banks/logs` and the new rows are in Orla.

## Send back

To whoever asked you to run it, or to
[support@orla.finance](mailto:support@orla.finance):

```text
Date:
Version: 0.3.2
Computer: Mac / Windows, version
Node: (node --version)
Bank or card id:
Where it ran: my computer / GitHub Actions / Docker
Setup took (minutes), and where I got stuck:
Checks 1-6: yes / no / n.a. each; for a no, what differed (no full account numbers)
What the terminal printed (steps 2 to 4):
```

**Do not send:** the config file `~/.orla-il-banks.json`, the folder
`~/.orla-il-banks`, a file written by `--save-json` (it is a bank statement),
screenshots of the bank's site, your Orla key, a password or a bank code.

## If it fails

The README's [When something fails](../README.md#when-something-fails) table
covers the usual messages. A `<bank>: failed. ...` line you cannot clear from
there is the result: send it as it is. Do not try the login again and again,
since banks lock a login after a few failures.

## Results

Updated from the reports. A bank counts as live-checked when steps 2 to 4 went
through and checks 1 to 3 are yes.

| Id | Institution | Live-checked (date, version, where) | Notes |
|---|---|---|---|
| `hapoalim` | Bank Hapoalim | not yet | after `trust` |
| `leumi` | Bank Leumi | not yet | |
| `mizrahi` | Mizrahi Tefahot | not yet | |
| `discount` | Discount Bank | not yet | |
| `mercantile` | Mercantile Bank | not yet | |
| `otsarHahayal` | Bank Otsar Hahayal | not yet | |
| `union` | Union Bank | not yet | |
| `beinleumi` | First International (Beinleumi) | not yet | |
| `massad` | Bank Massad | not yet | |
| `yahav` | Bank Yahav | not yet | |
| `pagi` | Bank Pagi | not yet | |
| `oneZero` | One Zero | not yet | from a terminal only |
| `isracard` | Isracard | not yet | |
| `amex` | American Express Israel | not yet | |
| `max` | Max | not yet | |
| `visaCal` | Visa Cal | not yet | |
| `beyahadBishvilha` | Beyahad Bishvilha | not yet | |
