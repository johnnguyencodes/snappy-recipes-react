import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./src/tests", // Adjust to your tests folder
  use: {
    baseURL: "http://localhost:5173",
    browserName: "chromium",
    headless: true, // You can toggle this
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  reporter: [["list"], ["html"]], // Output options
  // Compile ts using ts-node
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
