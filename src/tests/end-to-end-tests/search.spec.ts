import { test, expect } from "@playwright/test";

test.describe("Search functionality", () => {
  // ensure app is running at 192.168.1.22:5173 before running tests

  test("searches for 'pizza' and sees results", async ({ page }) => {
    // Go to homepage
    await page.goto("/"); // uses baseURL in config

    // Locate the input
    const searchInput = page.getByTestId("text-input");

    await page.waitForTimeout(1000);

    // Type in "pizza" and click the submit button
    await searchInput.fill("fruit");

    await page.waitForTimeout(1000);

    const submitButton = page.getByTestId("submit");
    await submitButton.click();

    // Wait and assert that results for "pizza" appear
    await expect(
      page.getByText("recipes found that contains fruit")
    ).toBeVisible();
  });
});
