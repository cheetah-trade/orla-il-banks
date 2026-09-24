/**
 * The command end to end, against a local stand-in for Orla's door: what a
 * run prints, what it sends, and what it refuses to start.
 */
import { deepStrictEqual, match, ok, strictEqual } from "node:assert/strict";
import { spawn } from "node:child_process";
import { chmodSync, mkdtempSync, statSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";

const CLI = new URL("../dist/cli.js", import.meta.url).pathname;
const dir = mkdtempSync(join(tmpdir(), "orla-il-cli-"));

let server;
let base;
let received = [];

before(async () => {
  server = createServer((req, res) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      received.push({ url: req.url, auth: req.headers.authorization, body: JSON.parse(body) });
      const rows = received.at(-1).body.rows;
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ booked: rows.length, duplicates: 0, batch_id: "b", accounts_created: [], skipped_closed: 0, rejected: [] }));
    });
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

function write(name, content, mode = 0o600) {
  const path = join(dir, name);
  writeFileSync(path, JSON.stringify(content));
  chmodSync(path, mode);
  return path;
}

function run(args, env = {}) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [CLI, ...args], {
      env: { PATH: process.env.PATH, ...env },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => (stdout += d));
    child.stderr.on("data", (d) => (stderr += d));
    child.on("close", (code) => resolve({ code, stdout, stderr }));
  });
}

const SAVED = [
  {
    company: "isracard",
    accounts: [
      {
        accountNumber: "4580",
        txns: [
          {
            type: "normal",
            date: "2026-08-20T08:00:00.000Z",
            processedDate: "2026-09-02T00:00:00.000Z",
            originalAmount: -120,
            originalCurrency: "ILS",
            chargedAmount: -120,
            chargedCurrency: "ILS",
            description: "RAMI LEVY",
            status: "completed",
          },
          {
            type: "normal",
            date: "2026-08-21T08:00:00.000Z",
            processedDate: "2026-09-02T00:00:00.000Z",
            originalAmount: -30,
            originalCurrency: "ILS",
            chargedAmount: -30,
            description: "AROMA",
            status: "pending",
          },
        ],
      },
    ],
  },
  {
    company: "hapoalim",
    accounts: [
      {
        accountNumber: "12-600-123456",
        txns: [
          {
            type: "normal",
            date: "2026-09-02T00:00:00.000Z",
            processedDate: "2026-09-02T00:00:00.000Z",
            originalAmount: -120,
            originalCurrency: "ILS",
            chargedAmount: -120,
            description: "ישראכרט",
            status: "completed",
          },
        ],
      },
    ],
  },
];

test("a saved scrape is sent: purchases, the card's cycle row and the bank's line", async () => {
  received = [];
  const config = write("config.json", { orla: { url: base, token: "tok_test_1" } });
  const saved = write("saved.json", SAVED);
  const { code, stdout, stderr } = await run(["run", "--config", config, "--from-json", saved]);
  strictEqual(code, 0, stderr);
  strictEqual(received.length, 1);
  strictEqual(received[0].url, "/api/integration/transactions");
  strictEqual(received[0].auth, "Bearer tok_test_1");
  const rows = received[0].body.rows;
  deepStrictEqual(
    rows.map((r) => `${r.account_name}|${r.occurred_on}|${r.amount}|${r.payee}`),
    [
      "Isracard ••4580|2026-08-20|-120.00|RAMI LEVY",
      "Isracard ••4580|2026-09-02|120.00|Billing cycle payment",
      "Bank Hapoalim ••3456|2026-09-02|-120.00|ישראכרט",
    ],
  );
  match(stdout, /Isracard ••4580: 1 rows, 1 billing cycles \(left out: 1 pending\)/);
  match(stdout, /Orla: 3 new, 0 already there/);
});

test("a dry run reads and counts, and sends nothing", async () => {
  received = [];
  const saved = write("saved2.json", SAVED);
  const { code, stdout } = await run(["run", "--from-json", saved, "--dry-run"], { ORLA_URL: base });
  strictEqual(code, 0);
  strictEqual(received.length, 0);
  match(stdout, /dry run: 3 rows ready, nothing sent/);
});

test("a config others can read stops the run before anything happens", async () => {
  received = [];
  const config = write("open.json", { orla: { url: base, token: "t" } }, 0o644);
  const saved = write("saved3.json", SAVED);
  const { code, stderr } = await run(["run", "--config", config, "--from-json", saved]);
  strictEqual(code, 2);
  match(stderr, /chmod 600/);
  strictEqual(received.length, 0);
});

test("a public repository in GitHub Actions stops the run, and the passwords are masked first", async () => {
  received = [];
  const event = write("event.json", { repository: { private: false } });
  const accounts = JSON.stringify([{ company: "max", username: "user1", password: "pa55word" }]);
  const { code, stdout, stderr } = await run(["run", "--dry-run"], {
    GITHUB_ACTIONS: "true",
    GITHUB_EVENT_PATH: event,
    ORLA_IL_ACCOUNTS: accounts,
  });
  strictEqual(code, 2);
  match(stderr, /repository is public/);
  ok(stdout.includes("::add-mask::pa55word"));
  strictEqual(received.length, 0);
});

test("a mistyped flag is refused rather than ignored", async () => {
  const { code, stderr } = await run(["run", "--dryrun"]);
  strictEqual(code, 2);
  match(stderr, /unknown flag --dryrun/);
});

test("One Zero outside a terminal is skipped and the run says so", async () => {
  received = [];
  const accounts = JSON.stringify([{ company: "oneZero", email: "a@b.c", password: "pw123", phoneNumber: "+972500000000" }]);
  const { code, stderr } = await run(["run", "--dry-run"], { ORLA_IL_ACCOUNTS: accounts });
  strictEqual(code, 1);
  match(stderr, /only runs from a terminal/);
});

test("a saved scrape is written readable by its owner only", async () => {
  const path = join(dir, "out.json");
  writeFileSync(path, "old");
  chmodSync(path, 0o644);
  // no accounts to read: the file is still written, and narrowed first
  const { code } = await run(["run", "--dry-run", "--save-json", path, "--only", "max"], {
    ORLA_IL_ACCOUNTS: JSON.stringify([{ company: "hapoalim", userCode: "u", password: "p" }]),
  });
  strictEqual(code, 0);
  strictEqual(statSync(path).mode & 0o777, 0o600);
});
