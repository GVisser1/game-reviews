import { defineConfig, devices } from "@playwright/test";
import { minutes, seconds } from "./src/lib/timeUtil";

const baseURL = process.env.E2E_BASE_URL || "http://localhost:5173";
const usesLocalDevServer = new URL(baseURL).hostname === "localhost";
const isCI = process.env.CI != null;

export default defineConfig({
  forbidOnly: isCI,
  fullyParallel: true,
  globalTimeout: minutes(10),
  outputDir: "e2e-tests/test-results",
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  reporter: isCI
    ? [["html", { outputFolder: "e2e-tests/test-reports", open: "never" }], ["github"], ["list"]]
    : [["html", { outputFolder: "e2e-tests/test-reports" }]],
  retries: isCI ? 1 : 0,
  testDir: "e2e-tests/tests",
  timeout: seconds(15),
  use: { baseURL, trace: "on-first-retry" },
  webServer: usesLocalDevServer
    ? {
        // On CI, test the production build instead of the dev server.
        command: isCI ? "pnpm preview" : "pnpm dev",
        url: baseURL,
        reuseExistingServer: !isCI,
        timeout: minutes(2),
        gracefulShutdown: { signal: "SIGTERM", timeout: seconds(10) },
      }
    : undefined,
  workers: isCI ? 2 : undefined,
});
