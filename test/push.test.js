/**
 * Delivery: where it goes, what it refuses, and how it says what went wrong.
 */
import { deepStrictEqual, match, ok, rejects, strictEqual, throws } from "node:assert/strict";
import { test } from "node:test";

import { doorUrl, push, PushError, ROWS_PER_CALL } from "../dist/push.js";

function row(i) {
  return {
    external_id: `il:max:${i}:0`,
    account_key: "il:max:abc",
    account_name: "Max ••1234",
    account_kind: "card",
    currency: "ILS",
    occurred_on: "2026-09-01",
    amount: "-1.00",
    payee: "",
    note: "",
  };
}

function reply(status, body) {
  return new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

test("the door's address is built from the base, and plain http is refused off this machine", () => {
  strictEqual(doorUrl("https://app.orla.finance"), "https://app.orla.finance/api/integration/transactions");
  strictEqual(doorUrl("https://app.orla.finance/some/path/"), "https://app.orla.finance/api/integration/transactions");
  strictEqual(doorUrl("http://localhost:8000"), "http://localhost:8000/api/integration/transactions");
  strictEqual(doorUrl("http://127.0.0.1:8000"), "http://127.0.0.1:8000/api/integration/transactions");
  throws(() => doorUrl("http://app.orla.finance"), /use https/);
  throws(() => doorUrl("ftp://x"), /use https/);
  throws(() => doorUrl("not a url"), /not an address/);
});

test("rows go in calls of at most 500, with the key as a bearer and redirects refused", async () => {
  const calls = [];
  const fetch = async (url, init) => {
    calls.push({ url, init, rows: JSON.parse(init.body).rows.length });
    return reply(200, { booked: 2, duplicates: 1, batch_id: "b", accounts_created: ["il:max:abc"], skipped_closed: 0, rejected: [] });
  };
  const totals = await push("https://app.orla.finance", "tok", Array.from({ length: 1201 }, (_, i) => row(i)), { fetch });
  deepStrictEqual(
    calls.map((c) => c.rows),
    [ROWS_PER_CALL, ROWS_PER_CALL, 201],
  );
  strictEqual(calls[0].url, "https://app.orla.finance/api/integration/transactions");
  strictEqual(calls[0].init.headers.Authorization, "Bearer tok");
  strictEqual(calls[0].init.redirect, "error");
  strictEqual(calls[0].init.method, "POST");
  strictEqual(totals.booked, 6);
  strictEqual(totals.duplicates, 3);
  strictEqual(totals.accounts_created.length, 3);
});

test("an expired or revoked key says where to get a new one", async () => {
  const fetch = async () => reply(401, { error: "authentication_error", detail: "Token expired" });
  await rejects(push("https://x.test", "tok", [row(1)], { fetch }), (error) => {
    ok(error instanceof PushError);
    strictEqual(error.kind, "key");
    match(error.message, /Token expired/);
    match(error.message, /Integrations, Israeli banks/);
    return true;
  });
});

test("a key without the transactions scope is told apart from an expired one", async () => {
  const fetch = async () => reply(403, { error: "authorization_error", detail: "scope" });
  await rejects(push("https://x.test", "tok", [row(1)], { fetch }), /cannot write transactions/);
});

test("a refused contract names the field", async () => {
  const fetch = async () => reply(422, { detail: [{ loc: ["body", "rows", 0, "currency"], msg: "too short" }] });
  await rejects(push("https://x.test", "tok", [row(1)], { fetch }), (error) => {
    strictEqual(error.kind, "contract");
    match(error.message, /body\.rows\.0\.currency: too short/);
    return true;
  });
});

test("a server error is retried with growing pauses, and a success after it counts", async () => {
  const pauses = [];
  let n = 0;
  const fetch = async () => {
    n += 1;
    return n < 3 ? reply(503) : reply(200, { booked: 1, duplicates: 0, batch_id: "b" });
  };
  const totals = await push("https://x.test", "tok", [row(1)], { fetch, sleep: async (ms) => pauses.push(ms) });
  strictEqual(totals.booked, 1);
  deepStrictEqual(pauses, [2000, 4000]);
});

test("an unreachable Orla is reported after three attempts", async () => {
  let n = 0;
  const fetch = async () => {
    n += 1;
    throw new TypeError("fetch failed");
  };
  await rejects(push("https://x.test", "tok", [row(1)], { fetch, sleep: async () => {} }), (error) => {
    strictEqual(error.kind, "unreachable");
    return true;
  });
  strictEqual(n, 3);
});

test("the space's limit stops the delivery with the server's words", async () => {
  const fetch = async () => reply(429, { error: "push_source.quota", detail: "20000 rows this month" });
  await rejects(push("https://x.test", "tok", [row(1)], { fetch }), /20000 rows this month/);
});
