/**
 * The terminal reader behind setup: answers that arrive ahead of their
 * question, a secret that never reaches the screen, and the keys a person
 * presses by mistake.
 */
import { deepStrictEqual, ok, rejects, strictEqual } from "node:assert/strict";
import { PassThrough } from "node:stream";
import { test } from "node:test";

import { Cancelled, terminalIo } from "../dist/prompt.js";

function keyboard() {
  const input = new PassThrough();
  input.isRaw = false;
  const modes = [];
  input.setRawMode = (mode) => {
    input.isRaw = mode;
    modes.push(mode);
  };
  let screen = "";
  const output = { write: (text) => (screen += text) };
  return { input, modes, output, screen: () => screen, io: terminalIo(input, output) };
}

test("a paste of every answer at once fills the questions in order", async () => {
  const k = keyboard();
  k.input.write("oit_key12345678\r15\r\nuser-max\rsuper-secret-pw\rn\r");
  const key = await k.io.askSecret("Key: ");
  const banks = await k.io.ask("Banks: ");
  const user = await k.io.ask("Username: ");
  const password = await k.io.askSecret("Password: ");
  const run = await k.io.ask("Run? ");
  deepStrictEqual([key, banks, user, password, run], ["oit_key12345678", "15", "user-max", "super-secret-pw", "n"]);
  ok(!k.screen().includes("super-secret-pw"), "the password was drawn on the screen");
  ok(!k.screen().includes("oit_key"), "the key was drawn on the screen");
  ok(k.screen().includes("user-max"), "a plain answer is echoed");
});

test("answers typed one at a time, split across chunks", async () => {
  const k = keyboard();
  const answer = k.io.ask("Banks: ");
  k.input.write("1,");
  k.input.write("13");
  k.input.write("\r");
  strictEqual(await answer, "1,13");
  // the \n of a \r\n split across chunks is not read as an empty answer
  const next = k.io.ask("Username: ");
  k.input.write("\nmax-user\r");
  strictEqual(await next, "max-user");
});

test("backspace, arrow keys and control characters stay out of the answer", async () => {
  const k = keyboard();
  k.input.write("pass\u007fs\u001b[Dw\to\u0007rd\r");
  strictEqual(await k.io.askSecret("Password: "), "password");
  ok(!k.screen().includes("\b"), "a secret's erase is not drawn either");
});

test("a Hebrew answer and one outside the basic plane come through whole", async () => {
  const k = keyboard();
  k.input.write("שלום 😀\r");
  strictEqual(await k.io.ask("Name: "), "שלום 😀");
});

test("Ctrl-C at a question cancels and gives the terminal back", async () => {
  const k = keyboard();
  k.input.write("half\u0003");
  await rejects(k.io.askSecret("Password: "), Cancelled);
  strictEqual(k.input.isRaw, false);
  deepStrictEqual(k.modes, [true, false]);
});

test("raw mode is on only while a question waits", async () => {
  const k = keyboard();
  const answer = k.io.ask("Q: ");
  strictEqual(k.input.isRaw, true);
  k.input.write("a\r");
  await answer;
  strictEqual(k.input.isRaw, false);
});
