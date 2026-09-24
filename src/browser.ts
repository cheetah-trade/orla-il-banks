/**
 * Browser flags shared by the scrape and the trust flow, on their own so that
 * neither the command line nor the trust flow loads the scraping library to get
 * them.
 */

export function browserArgs(env: NodeJS.ProcessEnv): string[] {
  // Chromium's sandbox needs kernel features a container or a hardened CI
  // runner often lacks. Turned off only when asked, and the Docker image asks.
  return env["ORLA_IL_NO_SANDBOX"] === "1" ? ["--no-sandbox", "--disable-setuid-sandbox"] : [];
}
