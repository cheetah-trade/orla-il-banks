/**
 * Questions at the terminal, for `setup`. Kept behind a small interface so the
 * wizard can be driven by a script in the tests.
 *
 * Every answer is read by one reader, character by character in raw mode, from
 * one buffer that lives as long as the wizard. Two things follow:
 *
 * - A password or a key is read with the echo off: nothing typed appears on
 *   the screen or in the terminal's scrollback.
 * - Whatever arrives ahead of its question (typed ahead, or pasted together
 *   with the answers after it, since a paste arrives as one chunk) waits in the
 *   buffer for the question it belongs to. A reader per question, which is what
 *   node's readline gives, drops the rest of a chunk when it closes.
 *
 * Written by hand rather than taken from a package: this is the one place a
 * bank password passes through, and the package list next to it is kept short
 * on purpose.
 */

export interface Io {
  say(line: string): void;
  ask(question: string): Promise<string>;
  askSecret(question: string): Promise<string>;
}

export class Cancelled extends Error {
  constructor() {
    super("cancelled");
    this.name = "Cancelled";
  }
}

//: The part of a terminal stream the reader uses: a TTY in real life, a
//: PassThrough with a raw-mode switch in the tests.
export interface KeyboardInput extends NodeJS.EventEmitter {
  isRaw?: boolean;
  setRawMode(mode: boolean): unknown;
  setEncoding(encoding: BufferEncoding): unknown;
  resume(): unknown;
  pause(): unknown;
}

export interface ScreenOutput {
  write(text: string): unknown;
}

const ENTER = new Set(["\r", "\n"]);
const CANCEL = new Set(["\u0003", "\u0004"]); // Ctrl-C, Ctrl-D
const ERASE = new Set(["\u007f", "\b"]);

export class KeyboardLines {
  private buffer = "";
  //: A \r ends a line; a \n right after it is the same Enter (a paste from
  //: Windows, or a terminal that sends both), not an empty answer.
  private afterCr = false;

  constructor(
    private readonly input: KeyboardInput,
    private readonly output: ScreenOutput,
  ) {}

  read(question: string, echo: boolean): Promise<string> {
    this.output.write(question);
    return new Promise<string>((resolve, reject) => {
      const chars: string[] = [];
      const wasRaw = this.input.isRaw ?? false;

      // Takes characters off the buffer until the line ends. Null while it
      // has not.
      const consume = (): "line" | "cancel" | null => {
        while (this.buffer) {
          const ch = String.fromCodePoint(this.buffer.codePointAt(0)!);
          this.buffer = this.buffer.slice(ch.length);
          if (this.afterCr && ch === "\n") {
            this.afterCr = false;
            continue;
          }
          this.afterCr = ch === "\r";
          if (ENTER.has(ch)) return "line";
          if (CANCEL.has(ch)) return "cancel";
          if (ch === "\u001b") {
            this.dropEscape();
            continue;
          }
          if (ERASE.has(ch)) {
            if (chars.pop() !== undefined && echo) this.output.write("\b \b");
            continue;
          }
          if (ch < " ") continue;
          chars.push(ch);
          if (echo) this.output.write(ch);
        }
        return null;
      };

      const finish = (outcome: "line" | "cancel") => {
        this.input.off("data", onData);
        this.input.setRawMode(wasRaw);
        this.input.pause();
        this.output.write("\n");
        if (outcome === "cancel") reject(new Cancelled());
        else resolve(chars.join("").trim());
      };

      const onData = (chunk: string | Buffer) => {
        this.buffer += chunk.toString();
        const outcome = consume();
        if (outcome) finish(outcome);
      };

      this.input.setRawMode(true);
      this.input.setEncoding("utf8");
      const early = consume();
      if (early) return finish(early);
      this.input.on("data", onData);
      this.input.resume();
    });
  }

  //: An arrow key or another key with an escape sequence: ESC, then [ or O,
  //: parameters, and a final letter. Dropped whole, so it does not land in an
  //: answer as "[A".
  private dropEscape(): void {
    const sequence = /^[[O][0-9;?]*[\x40-\x7e]?/.exec(this.buffer);
    if (sequence) this.buffer = this.buffer.slice(sequence[0].length);
  }
}

export function terminalIo(
  input: KeyboardInput = process.stdin,
  output: ScreenOutput = process.stdout,
): Io {
  const lines = new KeyboardLines(input, output);
  return {
    say(line) {
      output.write(`${line}\n`);
    },
    ask: (question) => lines.read(question, true),
    askSecret: (question) => lines.read(question, false),
  };
}

/** Yes or no, with a default the Enter key takes. */
export async function confirm(io: Io, question: string, yes = true): Promise<boolean> {
  const answer = (await io.ask(`${question} ${yes ? "[Y/n]" : "[y/N]"} `)).toLowerCase();
  if (!answer) return yes;
  return answer.startsWith("y");
}
