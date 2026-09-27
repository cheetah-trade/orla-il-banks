# Releasing

## One-time setup (done 24-27.09.2026)

1. The repository is public: the Orla app links here.
2. 0.1.0 was published by hand, from a machine logged into npm with a
   security key (npm 11 in a real terminal: npm 10 and a terminal-less npm 11
   cannot pass a security key on publish).
3. Trusted publishing is set on npmjs.com for `orla-il-banks`: repository
   `cheetah-trade/orla-il-banks`, workflow `release.yml`, with **Allow npm
   publish** on. That is the owner's call of 27.09.2026, against npm's own
   advice to leave it off: a `v*` tag publishes straight away, and publishing
   is held by access to this repository and its CI, not by a person with a
   second factor. To go back to staged releases (CI prepares with
   `npm stage publish`, a person promotes it), untick it on npmjs.com and
   change the publish step in `release.yml`.
4. Private vulnerability reporting is on, so `SECURITY.md` points somewhere
   that works.

## Cutting a release

```bash
npm version patch          # or minor
git push --follow-tags
```

The tag publishes to npm with provenance and pushes the Docker image to
`ghcr.io/cheetah-trade/orla-il-banks:<version>`. Then raise the version in
`templates/github-actions/orla-il-banks.yml` and in the README, and in the
Orla app (`RUNNER_VERSION` in `IsraeliBanksSetup.tsx`), which shows the
commands people copy.

## npm 12

npm 12 (npm's `latest` since September 2026) changed three things this package
depends on, and 0.1.1 is the version that found out: its tag never reached npm.

- It refuses `npm ci` when the lock file is `npm-shrinkwrap.json`. The release
  job pins npm 11 (trusted publishing needs 11.5.1 or later); raise the pin
  only after `npm ci` passes on the new one.
- It ignores the shrinkwrap inside a published package, so a person's `npx`
  resolved the ranges afresh (4 of 101 packages differed on the day). The tree
  now travels in the tarball, as `bundleDependencies`, and CI checks it is
  there.
- It runs no dependency's install script unless the person approves it, so
  puppeteer no longer fetches Chrome on install. The runner downloads it
  itself (`setup`, `check-browser --install`), and CI installs with
  `--ignore-scripts` to go the same way.

## Raising israeli-bank-scrapers

Banks change their sites and the library follows, so this is the usual reason
for a release. Before raising the pin:

1. Read the library's diff since the pinned version, in full for
   `src/scrapers/` and `src/helpers/`. The rule: it talks to bank domains and
   nothing else. `grep -rhoE "https?://[a-zA-Z0-9.-]+" node_modules/israeli-bank-scrapers/lib`
   lists every host it names.
2. Check that no install script appeared in it (`npm view israeli-bank-scrapers@<v> scripts`).
3. `npm install israeli-bank-scrapers@<v> --save-exact --ignore-scripts`, keep
   `puppeteer` and `@puppeteer/browsers` equal to the versions it resolves,
   `npm shrinkwrap`, and run the tests.
