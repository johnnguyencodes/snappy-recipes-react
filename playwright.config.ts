import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig, devices } from "@playwright/test";

// Define __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDevelopment = process.env.NODE_ENV === "development";
const devURL = "http://192.168.1.22:5173"; // Replace this with your local IP address when running live server.  Imgur's access token will not refresh if you are running the app locally on local host.
const prodURL = "https://johnnguyencodes.github.io/snappy-recipes-react";

const reportDir = path.resolve(__dirname, "playwright-report");

console.log("Base URL:", isDevelopment ? devURL : prodURL);

// Ensure the report directory exists
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

export default defineConfig({
  testDir: "./src/tests/end-to-end-tests/", // Adjust to your tests folder
  testMatch: "**/end-to-end-tests/*.spec.ts",
  timeout: 15 * 1000,
  expect: {
    // maximum time expect() should wait for the condition to be met
    timeout: 45000,
  },
  // Run tests in files in parallel
  fullyParallel: false,
  // Fail the build on CI if you accidentally left test only in the source code
  forbidOnly: !!process.env.CI,
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  use: {
    // Maximum time each action such as click() can take. Defaults to 0 (no limit)
    actionTimeout: 0,
    baseURL: isDevelopment ? devURL : prodURL,
    // Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer
    trace: "on-first-retry",
    headless: true, // You can toggle this
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    launchOptions: {
      args:
        process.env.BROWSER_NAME === "webkit" ? [] : ["--disable-web-security"], // Only use this argument for Chromium and Firefox
    },
  },
  webServer: {
    command: isDevelopment
      ? "NODE_ENV=test npm run dev"
      : "NODE_ENV=test npm run preview",
    port: isDevelopment ? 5173 : 4173,
    timeout: 120 * 1000,
    reuseExistingServer: isDevelopment,
  },
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ], // Output options
  // Compile ts using ts-node
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: { args: ["--disable-web-security"] },
      },
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        launchOptions: { args: ["--disable-web-security"] },
      },
    },
    ...(process.env.CI
      ? [] // Skip WebKit in CI
      : [
          {
            name: "webkit",
            use: { ...devices["Desktop Safari"], launchOptions: { args: [] } },
          },
        ]),
    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { channel: 'chrome' },
    // },
  ],
});
