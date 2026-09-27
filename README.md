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
> yours misbehaves, tell us what the run printed (it prints no
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
| `hapoalim` | Bank Hapoalim | bank, **from your own computer**, after `trust` once (see below) |
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

### Bank Hapoalim and a new computer

Since March 2026 Bank Hapoalim sends an SMS code when a login comes from a
device it has not seen, and the scraping library has no way through that page
(upstream [#1077](https://github.com/eshaham/israeli-bank-scrapers/issues/1077)).
A browser started fresh is a new device every time, so the runner keeps one
browser profile per Hapoalim login on your computer, and you introduce it to
the bank once. Setup offers to do it right away; later, or again:

```bash
npx orla-il-banks@0.2.0 trust hapoalim
```

A browser window opens on the bank's own login page. Log in there, with the
code the bank sends; the window closes by itself when the bank shows your
accounts. Your password and the code go into the bank's page, not into this
program. From then on `run` logs in from that profile.

- The profile lives in `~/.orla-il-banks/profiles` (move it with
  `--profile-dir` or `ORLA_IL_PROFILE_DIR`), readable by you only. It holds a
  bank session: delete the folder to make this computer a stranger again.
- Not in GitHub Actions and not in Docker: a runner is a new device on every
  run, and keeping the profile there would put a bank session in a cache. The
  runner skips Hapoalim there and says so.
- Whether the bank keeps recognising the profile, and for how long, is the
  bank's call. If a run fails with a hint to trust again, do.

Not supported: **Behatsdaa**. It is the order history of a benefits shop, and
each order there was paid with a card; with that card connected too, every
order would count twice.

## Set up on your computer (about 5 minutes)

You need a Mac or a Windows computer, an Orla account, and the login you use on
your bank's website.

1. **Install Node.js**, once. Download the LTS installer from
   [nodejs.org](https://nodejs.org/en/download) (version 22 or newer: the
   `.pkg` on a Mac, the `.msi` on Windows) and click through it with the
   defaults.
2. **Issue a key in Orla.** Open Integrations, then **Israeli banks**, and
   issue a key. Copy it: it is shown once. It can only add transactions to this
   one source, and it expires (you choose when, up to a year).
3. **Open a terminal.** On a Mac: **Terminal** (press Cmd+Space, type
   `Terminal`, press Enter). On Windows: **Command Prompt** (press the Windows
   key, type `cmd`, press Enter).
4. **Run setup** and answer its questions:

   ```bash
   npx orla-il-banks@0.2.0 setup
   ```

   The first time, npx asks `Ok to proceed? (y)`: press Enter. Then setup
   asks for the key from Orla (paste it: nothing appears on the screen while
   you paste, on purpose), which banks and cards you use, and the login of
   each. It saves them in a file only you can read, downloads the browser the
   runner drives (about 170 MB, once), and for Bank Hapoalim opens the bank's
   own login page so you can introduce this computer (see below). At the end it
   offers to run.
5. **Whenever you want fresh transactions**, open the terminal again and run:

   ```bash
   npx orla-il-banks@0.2.0 run
   ```

   The first run brings 90 days; `--days 365` brings a year. `--dry-run` logs
   into the banks and prints what it would send, without sending.

**Running setup again** asks what for: a new Orla key with your logins kept
(a key runs out; issue a new one on the card), a bank added or a login changed
(a new password: type the login again and it replaces the saved one), or
starting over. To run it every day by itself, use cron or launchd on a Mac,
Task Scheduler on Windows, or a private GitHub repository (below).

**On Windows, in PowerShell** rather than Command Prompt, `npx` may stop with
*running scripts is disabled on this system*. Type `npx.cmd` instead of `npx`,
or use Command Prompt.

### By hand, without setup

Setup writes `~/.orla-il-banks.json`. You can write it yourself instead, from
[`examples/orla-il-banks.example.json`](examples/orla-il-banks.example.json),
readable by you only: the runner refuses a file anyone else can read.

```bash
cp examples/orla-il-banks.example.json ~/.orla-il-banks.json
chmod 600 ~/.orla-il-banks.json
# edit it: your Orla key, then one entry per bank or card
npx orla-il-banks@0.2.0 check-browser --install
npx orla-il-banks@0.2.0 run --dry-run
```

`check-browser` starts the browser on an empty page and closes it; it touches
no bank. With `--install` it first downloads the browser if it is missing.
`--config <file>` points `run` at a config somewhere else.

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

Bank Hapoalim does not run here (see above): the runner skips it with the
reason. The runner checks that the repository is private and stops if it is not:
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
  original amount in the note. A card that bills some purchases in dollars or
  euros gets a second account for them, named with the currency
  (`Max ••1234 (USD)`): an account in Orla holds one currency.
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
- **One delivery per login.** Orla links a move between two accounts of the same
  login as a transfer by itself, the way it does for a bank it connects. Across
  banks and cards it only suggests: a card refund and an unrelated bank payment
  of the same amount on the same day must never be glued into a transfer. It
  also means Orla's Connections page lists each bank's run on its own, and you
  can undo one without the others.

Every row has its own id, so running twice, or re-running after a failure,
files nothing twice. For the same reason **undoing a delivery in Orla is final
for its rows**: later runs recognise them and do not file them again.

## When something fails

| It says | Do |
|---|---|
| `the browser the runner needs is not on this computer yet` | Run `check-browser --install`. |
| `the browser did not start` | Run `check-browser`. On Ubuntu 24.04, see the `sysctl` line in the template. |
| `Bank Hapoalim: ... this computer is new to it` | Run `orla-il-banks trust hapoalim` once and log in on the bank's page. |
| `Orla refused the key` | The key expired or was revoked. Issue a new one on the Israeli banks card, then run `setup` and choose 1. |
| `<bank>: failed. invalidPassword` | Log in on the bank's site by hand once; banks lock after a few failures. |
| `<bank>: failed. changePassword` | The bank wants a new password. Change it on the bank's site, then run `setup` and choose 2. |
| `N refused` | Orla named the reason for each refused row. Send it to us (below). |

Exit status: `0` everything went through, `1` a bank or the delivery failed,
`2` the command line or the config is wrong, `130` setup was stopped with Ctrl-C.

Reporting a problem: send what the run printed to
[support@orla.finance](mailto:support@orla.finance), or open an issue here. It
prints no passwords and no full account numbers, but issues here are public, so
read it through before posting.

## Removing it

1. In Orla, on the Israeli banks card: undo its deliveries first if you want
   the rows gone too, then revoke the source. The key stops working at once.
2. On the computer, delete `~/.orla-il-banks.json` (your logins), the folder
   `~/.orla-il-banks` (browser profiles, one per Hapoalim login), and
   `~/.cache/puppeteer` (the browser, unless something else of yours uses it).
   On Windows `~` is your user folder, `C:\Users\<you>`.

## Updating

Banks change their sites, and israeli-bank-scrapers follows. Each release of
this package pins one version of it, and one exact set of everything beneath
it. Raise the version in your workflow on purpose, after reading the release
notes, not by pointing it at `latest`.

## License

MIT. See [SECURITY.md](SECURITY.md) to report a vulnerability.
