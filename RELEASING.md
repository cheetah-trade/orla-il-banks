# Releasing

## One-time setup

1. **Make the repository public** once the owner has read it: the Orla app
   links here, and a private repository is a 404 to everyone else.
2. **Claim the npm name.** The first publish cannot come from CI, because a
   trusted publisher can only be set on a package that exists. From a machine
   logged into npm with 2FA on: `npm publish --access public`.
3. **Configure trusted publishing** on npmjs.com for `orla-il-banks`:
   repository `cheetah-trade/orla-il-banks`, workflow `release.yml`.
4. **Turn on private vulnerability reporting** in the repository's Security
   settings, so `SECURITY.md` points somewhere that works.

## Cutting a release

```bash
npm version patch          # or minor
git push --follow-tags
```

The tag publishes to npm with provenance and pushes the Docker image to
`ghcr.io/cheetah-trade/orla-il-banks:<version>`. Then raise the version in
`templates/github-actions/orla-il-banks.yml` and in the README.

## Raising israeli-bank-scrapers

Banks change their sites and the library follows, so this is the usual reason
for a release. Before raising the pin:

1. Read the library's diff since the pinned version, in full for
   `src/scrapers/` and `src/helpers/`. The rule: it talks to bank domains and
   nothing else. `grep -rhoE "https?://[a-zA-Z0-9.-]+" node_modules/israeli-bank-scrapers/lib`
   lists every host it names.
2. Check that no install script appeared in it (`npm view israeli-bank-scrapers@<v> scripts`).
3. `npm install israeli-bank-scrapers@<v> --save-exact`, keep `puppeteer` equal
   to the version it resolves, `npm shrinkwrap`, and run the tests.
