/**
 * Delivery to Orla's push door: `POST /api/integration/transactions` with the
 * source's key as a bearer token.
 *
 * Resending is safe by construction: every row carries its own id and the door
 * files a row it has seen before as a duplicate, not a second row. So a
 * network failure is retried, and a run that died halfway is simply run again.
 *
 * Two things this file refuses on purpose:
 *
 * - **A plain-http address**, except on this machine. The body is a person's
 *   bank statement and the header is a key that can write into their books.
 * - **A redirect.** A redirect is where a key ends up at a host nobody named.
 *   The door does not redirect, so one arriving means the address is wrong.
 */

import type { PushBalance, PushRow } from "./map.js";

//: `MAX_ROWS_PER_CALL` on the Orla side. More in one call is refused whole.
export const ROWS_PER_CALL = 500;

const ATTEMPTS = 3;

export interface PushTotals {
  booked: number;
  duplicates: number;
  skipped_closed: number;
  accounts_created: string[];
  rejected: Array<Record<string, string>>;
  /** balances Orla took; 0 from a door that does not take them yet */
  balances_set: number;
}

export type PushFailure = "key" | "contract" | "limit" | "unreachable" | "refused";

export class PushError extends Error {
  constructor(
    readonly kind: PushFailure,
    message: string,
  ) {
    super(message);
    this.name = "PushError";
  }
}

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

/** The door's full address from the base a person configured. */
export function doorUrl(base: string): string {
  let url: URL;
  try {
    url = new URL(base);
  } catch {
    throw new PushError("refused", `"${base}" is not an address`);
  }
  if (url.protocol !== "https:" && !(url.protocol === "http:" && LOCAL_HOSTS.has(url.hostname))) {
    throw new PushError("refused", `refusing to send bank rows over ${url.protocol}//${url.host}: use https`);
  }
  return `${url.origin}/api/integration/transactions`;
}

function detailOf(body: unknown): string {
  if (body && typeof body === "object") {
    const { error, detail } = body as { error?: unknown; detail?: unknown };
    if (typeof detail === "string") return typeof error === "string" ? `${detail} (${error})` : detail;
    if (Array.isArray(detail)) {
      return detail
        .map((d: { loc?: unknown[]; msg?: string }) => `${(d.loc ?? []).join(".")}: ${d.msg ?? "invalid"}`)
        .join("; ");
    }
  }
  return "";
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export interface PushOptions {
  fetch?: typeof fetch;
  sleep?: (ms: number) => Promise<void>;
}

const pause = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const NONE: PushTotals = { booked: 0, duplicates: 0, skipped_closed: 0, accounts_created: [], rejected: [], balances_set: 0 };

async function sendChunk(
  url: string,
  token: string,
  rows: PushRow[],
  options: PushOptions,
  balances: PushBalance[] = [],
): Promise<PushTotals> {
  const doFetch = options.fetch ?? fetch;
  const sleep = options.sleep ?? pause;
  let lastProblem = "";
  for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
    let response: Response;
    try {
      response = await doFetch(url, {
        method: "POST",
        redirect: "error",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(balances.length ? { rows, balances } : { rows }),
      });
    } catch (error) {
      lastProblem = error instanceof Error ? error.message : String(error);
      if (attempt < ATTEMPTS) await sleep(2000 * 2 ** (attempt - 1));
      continue;
    }
    const body = await readJson(response);
    if (response.ok) {
      const out = body as Partial<PushTotals> | null;
      return {
        booked: out?.booked ?? 0,
        duplicates: out?.duplicates ?? 0,
        skipped_closed: out?.skipped_closed ?? 0,
        accounts_created: out?.accounts_created ?? [],
        rejected: out?.rejected ?? [],
        balances_set: out?.balances_set ?? 0,
      };
    }
    const detail = detailOf(body);
    const code = body && typeof body === "object" && typeof (body as { error?: unknown }).error === "string"
      ? (body as { error: string }).error
      : "";
    if (!rows.length && code === "push_source.no_rows") {
      // Balances alone, to a door from before it took them: it read an empty
      // delivery. Nothing is lost, the balance comes with the next release of
      // Orla, and rows are never held back for it.
      return { ...NONE, accounts_created: [], rejected: [] };
    }
    if (response.status === 401) {
      throw new PushError(
        "key",
        `Orla refused the key${detail ? ` (${detail})` : ""}. It may have expired or been revoked: issue a new one in Orla under Integrations, Israeli banks, then run setup again and choose 1 to put it in.`,
      );
    }
    if (response.status === 403) {
      throw new PushError(
        "key",
        `This key cannot write transactions${detail ? ` (${detail})` : ""}. Use the key issued on the Israeli banks card in Orla, not a general API key.`,
      );
    }
    if (response.status === 422) {
      throw new PushError("contract", `Orla refused the delivery: ${detail || "invalid rows"}`);
    }
    if (response.status === 429) {
      throw new PushError("limit", `Orla's limit for this space is reached${detail ? `: ${detail}` : ""}`);
    }
    if (response.status >= 500) {
      lastProblem = `HTTP ${response.status}`;
      if (attempt < ATTEMPTS) await sleep(2000 * 2 ** (attempt - 1));
      continue;
    }
    throw new PushError("refused", `Orla answered ${response.status}${detail ? `: ${detail}` : ""}`);
  }
  throw new PushError("unreachable", `Orla could not be reached after ${ATTEMPTS} attempts (${lastProblem})`);
}

/** One delivery: the rows in calls of `ROWS_PER_CALL`, the balances with the
 *  first of them (or alone, when a login brought balances and no new rows). */
export async function push(
  base: string,
  token: string,
  rows: PushRow[],
  options: PushOptions = {},
  balances: PushBalance[] = [],
): Promise<PushTotals> {
  const url = doorUrl(base);
  const totals: PushTotals = { ...NONE, accounts_created: [], rejected: [] };
  const calls = Math.max(1, Math.ceil(rows.length / ROWS_PER_CALL));
  if (!rows.length && !balances.length) return totals;
  for (let call = 0; call < calls; call += 1) {
    const chunk = rows.slice(call * ROWS_PER_CALL, (call + 1) * ROWS_PER_CALL);
    const out = await sendChunk(url, token, chunk, options, call === 0 ? balances : []);
    totals.booked += out.booked;
    totals.duplicates += out.duplicates;
    totals.skipped_closed += out.skipped_closed;
    totals.accounts_created.push(...out.accounts_created);
    totals.rejected.push(...out.rejected);
    totals.balances_set += out.balances_set;
  }
  return totals;
}

export type KeyCheck = "ok" | "door-off" | "revoked" | "rejected" | "wrong-scope" | "unreachable";

/**
 * Whether Orla takes this key, asked with an empty delivery. The door refuses
 * an empty delivery only after it has let the key in and checked that it is
 * switched on for the space, and before it writes anything, so the refusal it
 * gives says which of those failed. A key Orla does not know, one that ran out
 * and one whose space the push rollout does not cover all come back as the
 * same 401: the key is refused before the door is asked, and the message has
 * to name all three.
 */
export async function checkKey(
  base: string,
  token: string,
  options: PushOptions = {},
): Promise<{ result: KeyCheck; detail: string }> {
  const doFetch = options.fetch ?? fetch;
  let response: Response;
  try {
    response = await doFetch(doorUrl(base), {
      method: "POST",
      redirect: "error",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ rows: [] }),
    });
  } catch (error) {
    if (error instanceof PushError) throw error;
    return { result: "unreachable", detail: error instanceof Error ? error.message : String(error) };
  }
  const body = (await readJson(response)) as { error?: unknown } | null;
  const code = typeof body?.error === "string" ? body.error : "";
  const detail = detailOf(body);
  if (response.status === 401) return { result: "rejected", detail };
  if (response.status === 403) return { result: "wrong-scope", detail };
  if (code === "push_source.no_rows") return { result: "ok", detail };
  if (code === "push_source.disabled") return { result: "door-off", detail };
  if (code === "push_source.revoked" || code === "push_source.unbound") return { result: "revoked", detail };
  return { result: "unreachable", detail: `HTTP ${response.status}${detail ? `: ${detail}` : ""}` };
}
