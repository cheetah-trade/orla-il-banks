# orla-il-banks

Israeli bank and card transactions into your [Orla](https://orla.finance) books.
It runs on your machine, or in a private GitHub repository of your own. Your
bank passwords stay there: Orla only receives the rows.

It is a thin layer over [israeli-bank-scrapers](https://github.com/eshaham/israeli-bank-scrapers),
which logs into the bank's website the way you would, with a real browser. What
this package adds is the part that decides what the rows mean in your books,
and the delivery to Orla.

> **Status: early.** The mapping is covered by tests against the library's data
> shapes. The maintainers have not yet run it live against every bank below. If
> yours misbehaves, open an issue with what the run printed (it prints no
> passwords and no account numbers).

## Why it works this way

Orla does not connect Israeli banks itself, and will not ask for your bank
password: a password to online banking can do everything you can do there,
including sending money, and no service should hold that for thousands of
people. This runner keeps the password with you and sends Orla only what a
statement would show.

## Supported

| Id | Institution | Kind in Orla |
|---|---|---|
| `hapoalim` | Bank Hapoalim | bank |
| `leumi` | Bank Leumi | bank |
| `mizrahi` | Mizrahi Tefahot | bank |
| `discount` | Discount Bank | bank |
| `mercantile` | Mercantile Bank | bank |
| `otsarHahayal` | Bank Otsar Hahayal | bank |
| `union` | Union Bank | bank |
| `beinleumi` | First International (Beinleumi) | bank |
| `massad` | Bank Massad | bank |
| `yahav` | Bank Yahav | bank |
| `pagi` | Bank Pagi | bank |
| `oneZero` | One Zero | bank, **from a terminal only**: it asks for a code at every login |
| `isracard` | Isracard | card |
| `amex` | American Express Israel | card |
| `max` | Max | card |
| `visaCal` | Visa Cal | card |
| `beyahadBishvilha` | Beyahad Bishvilha | card (prepaid) |

`orla-il-banks companies` prints the fields each one needs.

Not supported: **Behatsdaa**. It is the order history of a benefits shop, and
each order there was paid with a card; with that card connected too, every
order would count twice.

## Set up

1. **In Orla**, open Integrations, then **Israeli banks**, and issue a key. It
   is shown once. It can only add transactions to this one source, and it
   expires (you choose when, up to a year).
2. **Check the browser** on the machine that will run this:

   ```bash
   npx orla-il-banks@0.1.0 check-browser
   ```

   It starts the browser on an empty page and closes it. It touches no bank.

3. Pick one of the three ways to run it below.

### On your computer

Write a config file and make it readable by you only; the runner refuses a file
anyone else can read.

```bash
cp examples/orla-il-banks.example.json ~/.orla-il-banks.json
chmod 600 ~/.orla-il-banks.json
# edit it: your Orla key, then one entry per bank or card
npx orla-il-banks@0.1.0 run --config ~/.orla-il-banks.json --dry-run
npx orla-il-banks@0.1.0 run --config ~/.orla-il-banks.json
```

`--dry-run` logs into the banks and prints what it would send, without
sending. Run it daily with cron or launchd. The first time, `--days 365` brings
a year of history.

### In a private GitHub repository

The machine does not have to be on. Create a **private** repository, copy
[`templates/github-actions/orla-il-banks.yml`](templates/github-actions/orla-il-banks.yml)
to `.github/workflows/` in it, and add two secrets:

- `ORLA_TOKEN`: the key from Orla.
- `ORLA_IL_ACCOUNTS`: your logins, as one JSON list:

  ```json
  [{"company": "hapoalim", "userCode": "AB12345", "password": "..."},
   {"company": "max", "username": "...", "password": "..."}]
  ```

The runner checks that the repository is private and stops if it is not:
public repositories have public run logs. It also masks every password in the
log one by one, since GitHub masks the whole secret but not the values inside
it.

Your passwords then live in GitHub's secret store and the logins come from
GitHub's servers, outside Israel. We have not measured whether any bank treats
that differently; if yours starts asking for extra verification, run it from
your own computer instead.

### In Docker

```bash
docker build -t orla-il-banks .
docker run --rm orla-il-banks check-browser
docker run --rm --env-file ~/.orla-il-banks.env orla-il-banks run
```

with `ORLA_TOKEN=...` and `ORLA_IL_ACCOUNTS=[...]` in the env file (`chmod 600`
it). The image runs Debian's Chromium as a non-root user, with the browser's
sandbox off: containers usually lack what the sandbox needs.

## What lands in your books

- **Completed rows only.** A pending row has no stable id and comes back as a
  completed one later; sending both would book it twice.
- **A purchase on the day it was made, an installment on the day it was
  charged**, for the amount charged that month. The note says
  `Installment 3 of 12, purchase total 1200.00 ILS`.
- **The amount charged**, in the currency charged. A purchase abroad keeps its
  original amount in the note.
- **Israeli days.** A purchase at 00:30 in Tel Aviv books on that day, wherever
  the runner runs.
- **One money-in row per billing cycle on each credit card.** Your bank pays
  the card's month in one line, and the card lists the same purchases one by
  one. Without a counterpart both would count as spending. So on each billing
  day the card account gets `Billing cycle payment`, equal to what the card
  charged. Orla then suggests linking it with the bank's line for that day as
  a transfer: one click per card per month. If the two amounts differ (a fee,
  a card billed in two currencies), there is no suggestion and you link them
  by hand. A cycle row is sent only once its billing day has come.
- **Account numbers do not travel.** Orla gets a hash to recognise the account
  and a name like `Bank Hapoalim ••8901`.

Every row has its own id, so running twice, or re-running after a failure,
files nothing twice.

## When something fails

| It says | Do |
|---|---|
| `the browser did not start` | Run `check-browser`. On Ubuntu 24.04, see the `sysctl` line in the template. |
| `Orla refused the key` | The key expired or was revoked. Issue a new one on the Israeli banks card. |
| `<bank>: failed. invalidPassword` | Log in on the bank's site by hand once; banks lock after a few failures. |
| `<bank>: failed. changePassword` | The bank wants a new password. Change it on the site, then in your config. |
| `N refused` | Orla named the field for each refused row. Open an issue with the message. |

Exit status: `0` everything went through, `1` a bank or the delivery failed,
`2` the command line or the config is wrong.

## Updating

Banks change their sites, and israeli-bank-scrapers follows. Each release of
this package pins one version of it, and one exact set of everything beneath
it. Raise the version in your workflow on purpose, after reading the release
notes, not by pointing it at `latest`.

## License

MIT. See [SECURITY.md](SECURITY.md) to report a vulnerability.
