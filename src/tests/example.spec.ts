import { test, expect } from "@playwright/test";

test("homepage has title", async ({ page }) => {
  await page.goto("/");
  expect(await page.title()).toBe("Vite + React + TS");
});
