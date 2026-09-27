/**
 * A run every day, by the computer's own scheduler, as the person and not as
 * a service: launchd on a Mac, Task Scheduler on Windows. Linux gets the cron
 * line to add; a server there is the person's own business.
 *
 * What the scheduled job runs is `npx orla-il-banks@<version> run --scheduled`,
 * pinned to the version that set it up, never `latest`: the job holds the same
 * bank passwords the person's own run does, and a new version reaches them
 * only when the person runs a newer `setup`, which sets the job up again.
 *
 * On Windows the task runs only while the person is logged on. The other
 * choice, "whether logged on or not", makes Windows keep the person's Windows
 * password; a program that already holds bank passwords does not ask for one
 * more. A run missed while the computer slept or was off runs when it is back
 * (StartWhenAvailable; launchd does the same for sleep on its own).
 */

import { execFile } from "node:child_process";
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join, posix, win32 } from "node:path";

export const LAUNCHD_LABEL = "finance.orla.il-banks";
export const TASK_NAME = "Orla Israeli banks";

export interface At {
  hour: number;
  minute: number;
}

export const DEFAULT_AT: At = { hour: 7, minute: 0 };

/** "7", "07:00", "7:30", "19:05". Null for anything else. */
export function parseAt(text: string): At | null {
  const m = /^\s*(\d{1,2})(?::(\d{2}))?\s*$/.exec(text);
  if (!m) return null;
  const hour = Number(m[1]);
  const minute = Number(m[2] ?? "0");
  if (hour > 23 || minute > 59) return null;
  return { hour, minute };
}

export function formatAt(at: At): string {
  return `${String(at.hour).padStart(2, "0")}:${String(at.minute).padStart(2, "0")}`;
}

export interface Target {
  platform: NodeJS.Platform;
  home: string;
  /** the folder the running node lives in; npx is next to it */
  nodeDir: string;
  version: string;
  configPath: string;
  at: At;
}

export function logDir(home: string): string {
  return join(home, ".orla-il-banks", "logs");
}

//: the target's own path rules, not this process's: a Windows task is built
//: and tested on a Mac too
function npxPath(target: Target): string {
  return target.platform === "win32" ? win32.join(target.nodeDir, "npx.cmd") : posix.join(target.nodeDir, "npx");
}

export function runArgs(target: Target): string[] {
  return ["--yes", `orla-il-banks@${target.version}`, "run", "--scheduled", "--config", target.configPath];
}

function xml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

//: Mac paths in Mac form, whatever runs this: the job is tested on Windows too
export function launchdPath(home: string): string {
  return posix.join(home, "Library", "LaunchAgents", `${LAUNCHD_LABEL}.plist`);
}

export function launchdPlist(target: Target): string {
  const args = [npxPath(target), ...runArgs(target)].map((a) => `    <string>${xml(a)}</string>`).join("\n");
  const log = posix.join(target.home, ".orla-il-banks", "logs", "launchd.log");
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>${LAUNCHD_LABEL}</string>
  <key>ProgramArguments</key>
  <array>
${args}
  </array>
  <key>EnvironmentVariables</key>
  <dict>
    <key>PATH</key>
    <string>${xml(`${target.nodeDir}:/usr/bin:/bin:/usr/sbin:/sbin`)}</string>
    <key>HOME</key>
    <string>${xml(target.home)}</string>
  </dict>
  <key>StartCalendarInterval</key>
  <dict>
    <key>Hour</key>
    <integer>${target.at.hour}</integer>
    <key>Minute</key>
    <integer>${target.at.minute}</integer>
  </dict>
  <key>RunAtLoad</key>
  <false/>
  <key>ProcessType</key>
  <string>Background</string>
  <key>StandardOutPath</key>
  <string>${xml(log)}</string>
  <key>StandardErrorPath</key>
  <string>${xml(log)}</string>
</dict>
</plist>
`;
}

/** Task Scheduler's own format, which is the only way to say "run a missed
 *  start when the computer is back"; `schtasks /Create` flags cannot. The
 *  window is kept off the screen with `conhost --headless` (Windows 10 1809
 *  and later): a console popping up at seven in the morning with bank names in
 *  it is not a thing to do to somebody. */
export function taskXml(target: Target): string {
  // cmd /c strips the outer pair of quotes when the command starts with one
  const line = `""${npxPath(target)}" ${runArgs(target)
    .map((a) => (/[\s"]/.test(a) ? `"${a}"` : a))
    .join(" ")}"`;
  return `<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.2" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <RegistrationInfo>
    <Description>Reads your Israeli banks and files the transactions into Orla. Set up by orla-il-banks ${xml(target.version)}; remove with: npx orla-il-banks@${xml(target.version)} unschedule</Description>
  </RegistrationInfo>
  <Triggers>
    <CalendarTrigger>
      <StartBoundary>2026-01-01T${formatAt(target.at)}:00</StartBoundary>
      <Enabled>true</Enabled>
      <ScheduleByDay>
        <DaysInterval>1</DaysInterval>
      </ScheduleByDay>
    </CalendarTrigger>
  </Triggers>
  <Principals>
    <Principal id="Author">
      <LogonType>InteractiveToken</LogonType>
      <RunLevel>LeastPrivilege</RunLevel>
    </Principal>
  </Principals>
  <Settings>
    <MultipleInstancesPolicy>IgnoreNew</MultipleInstancesPolicy>
    <DisallowStartIfOnBatteries>false</DisallowStartIfOnBatteries>
    <StopIfGoingOnBatteries>false</StopIfGoingOnBatteries>
    <StartWhenAvailable>true</StartWhenAvailable>
    <RunOnlyIfNetworkAvailable>true</RunOnlyIfNetworkAvailable>
    <ExecutionTimeLimit>PT1H</ExecutionTimeLimit>
    <Enabled>true</Enabled>
  </Settings>
  <Actions Context="Author">
    <Exec>
      <Command>conhost.exe</Command>
      <Arguments>${xml(`--headless cmd.exe /d /c ${line}`)}</Arguments>
    </Exec>
  </Actions>
</Task>
`;
}

export function taskXmlPath(home: string): string {
  return join(home, ".orla-il-banks", "schedule.xml");
}

/** Task Scheduler reads its XML as UTF-16 with a byte order mark. */
export function utf16(text: string): Buffer {
  return Buffer.concat([Buffer.from([0xff, 0xfe]), Buffer.from(text, "utf16le")]);
}

export function cronLine(target: Target): string {
  const args = [npxPath(target), ...runArgs(target)].map((a) => (/\s/.test(a) ? `'${a}'` : a)).join(" ");
  return `${target.at.minute} ${target.at.hour} * * * PATH=${target.nodeDir}:/usr/bin:/bin ${args}`;
}

export interface Exec {
  (command: string, args: string[]): Promise<{ code: number; stdout: string; stderr: string }>;
}

export const realExec: Exec = (command, args) =>
  new Promise((resolve) => {
    execFile(command, args, { windowsHide: true }, (error, stdout, stderr) => {
      const code = error ? (typeof error.code === "number" ? error.code : 1) : 0;
      resolve({ code, stdout: String(stdout), stderr: String(stderr) });
    });
  });

export interface Outcome {
  ok: boolean;
  /** what to tell the person, one or two sentences */
  message: string;
}

function uid(): number {
  return typeof process.getuid === "function" ? process.getuid() : 501;
}

export async function install(target: Target, exec: Exec = realExec): Promise<Outcome> {
  mkdirSync(logDir(target.home), { recursive: true, mode: 0o700 });
  const when = formatAt(target.at);
  if (target.platform === "darwin") {
    const path = launchdPath(target.home);
    mkdirSync(dirname(path), { recursive: true });
    // replaced whole: an older job of an older version must not stay behind
    await exec("launchctl", ["bootout", `gui/${uid()}/${LAUNCHD_LABEL}`]);
    writeFileSync(path, launchdPlist(target), { mode: 0o644 });
    const loaded = await exec("launchctl", ["bootstrap", `gui/${uid()}`, path]);
    if (loaded.code !== 0) {
      return { ok: false, message: `The Mac did not take the daily job (${loaded.stderr.trim() || `code ${loaded.code}`}).` };
    }
    return { ok: true, message: `It runs every day at ${when}, and at wake-up when the Mac slept through it.` };
  }
  if (target.platform === "win32") {
    const path = taskXmlPath(target.home);
    writeFileSync(path, utf16(taskXml(target)));
    const made = await exec("schtasks", ["/Create", "/TN", TASK_NAME, "/XML", path, "/F"]);
    if (made.code !== 0) {
      return { ok: false, message: `Windows did not take the daily task (${made.stderr.trim() || made.stdout.trim() || `code ${made.code}`}).` };
    }
    return {
      ok: true,
      message: `It runs every day at ${when} while you are logged on, and as soon as the computer is back when it was off at that time.`,
    };
  }
  return {
    ok: false,
    message: `This computer has no scheduler this program knows. To run it daily with cron, add this line (crontab -e):\n  ${cronLine(target)}`,
  };
}

export async function uninstall(platform: NodeJS.Platform, home: string, exec: Exec = realExec): Promise<Outcome> {
  if (platform === "darwin") {
    await exec("launchctl", ["bootout", `gui/${uid()}/${LAUNCHD_LABEL}`]);
    const path = launchdPath(home);
    const had = existsSync(path);
    if (had) unlinkSync(path);
    return { ok: true, message: had ? "The daily run is removed." : "There was no daily run to remove." };
  }
  if (platform === "win32") {
    const gone = await exec("schtasks", ["/Delete", "/TN", TASK_NAME, "/F"]);
    return {
      ok: true,
      message: gone.code === 0 ? "The daily run is removed." : "There was no daily run to remove.",
    };
  }
  return { ok: true, message: "Remove the orla-il-banks line from your crontab (crontab -e), if you added one." };
}

/** The command that shows a notification, or null where there is none. */
export function notificationCommand(platform: NodeJS.Platform, title: string, text: string): [string, string[]] | null {
  if (platform === "darwin") {
    const q = (s: string) => `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
    return ["osascript", ["-e", `display notification ${q(text)} with title ${q(title)}`]];
  }
  if (platform === "win32") {
    const q = (s: string) => `'${s.replace(/'/g, "''")}'`;
    const script = [
      "Add-Type -AssemblyName System.Windows.Forms",
      "Add-Type -AssemblyName System.Drawing",
      "$n = New-Object System.Windows.Forms.NotifyIcon",
      "$n.Icon = [System.Drawing.SystemIcons]::Warning",
      "$n.Visible = $true",
      `$n.ShowBalloonTip(15000, ${q(title)}, ${q(text)}, 'Warning')`,
      "Start-Sleep -Seconds 16",
      "$n.Dispose()",
    ].join("; ");
    return ["powershell.exe", ["-NoProfile", "-NonInteractive", "-WindowStyle", "Hidden", "-Command", script]];
  }
  return null;
}
