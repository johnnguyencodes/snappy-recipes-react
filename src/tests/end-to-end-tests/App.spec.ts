import { test, expect } from "@playwright/test";
import path from "path";

test.describe("Testing App functionality", () => {
  // ensure app is running at 192.168.1.22:5173 before running tests

  test("searches for 'pizza' and sees results", async ({ page }) => {
    // Go to homepage
    await page.goto("/"); // uses baseURL in config

    // Locate the input
    const searchInput = page.getByTestId("text-input");

    // Type in "pizza" and click the submit button
    await searchInput.fill("pizza");

    const submitButton = page.getByTestId("submit");
    await submitButton.click();

    // Wait and assert that results for "pizza" appear
    await expect(
      page.getByText("recipes found that contains pizza")
    ).toBeVisible();
  });

  test("searches for 'pizza' and presses enter to see results", async ({
    page,
  }) => {
    await page.goto("/"); // uses baseURL in config
    await page.getByTestId("text-input").click();
    await page.getByTestId("text-input").fill("pizza");
    await page.getByTestId("text-input").press("Enter");
    await expect(
      page.getByText("recipes found that contains pizza")
    ).toBeVisible();
  });

  test("User can view a random recipe’s details, favorite it, then view and unfavorite it in the favorites list, ensuring the list is empty afterward.", async ({
    page,
  }) => {
    await page.goto("/"); // uses baseURL in config
    await expect(page.getByText("random recipes found.")).toBeVisible();
    await expect(page.getByText("Asparagus and Pea Soup: Real")).toBeVisible();
    await page
      .getByRole("img", { name: "Asparagus and Pea Soup: Real" })
      .click();
    await expect(
      page.getByRole("heading", { name: "Asparagus and Pea Soup: Real" })
    ).toBeVisible();
    await page.getByRole("button", { name: "Favorite" }).click();
    await expect(
      page.getByRole("button", { name: "Unfavorite" })
    ).toBeVisible();
    await page.getByTestId("close-recipe-modal").click();
    await page.getByTestId("openFavorites").click();
    await expect(page.getByText("Asparagus and Pea Soup: Real")).toBeVisible();
    await page.getByTestId("recipe-card-716406").locator("div").first().click();
    await expect(
      page.getByRole("heading", { name: "Asparagus and Pea Soup: Real" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Unfavorite" })
    ).toBeVisible();
    await page.getByRole("button", { name: "Unfavorite" }).click();
    await page.getByTestId("close-recipe-modal").click();
    await expect(page.getByText("Your favorite recipes will")).toBeVisible();
  });

  test("User can search for a recipe using a file upload.", async ({
    page,
    browserName,
  }) => {
    /*
     * This test is skipped for WebKit and Chromium browsers due to network issues with the Imgur API.
     * Specifically, during the image upload process, the Imgur access token refresh fails,
     * causing the API requests to be rejected. These issues do not occur in Firefox,
     * where the test completes successfully. Manual testing in Chromium and Safari browsers
     * also works without issue, suggesting that the problem is specific to Playwright's handling
     * of network requests in WebKit and Chromium during automated tests.
     */
    test.skip(
      browserName === "webkit" || browserName === "chromium",
      "This test is only supported in Firefox due to network issues with Imgur API in other browsers."
    );

    await page.goto("/");
    await expect(page.getByText("random recipes found.")).toBeVisible();
    await page.getByTestId("upload-button").click();
    const fileUrl2 = new URL(
      "../fixtures/CavendishBanana.jpg",
      import.meta.url
    );
    const filePath2 = path.normalize(fileUrl2.pathname);
    await page.getByTestId("file-input").setInputFiles(filePath2);
    await expect(
      page.getByText("recipes found that contains Fruit.")
    ).toBeVisible();
    await page.getByTestId("upload-button").click();
    const fileUrl1 = new URL("../fixtures/RedApple.jpg", import.meta.url);
    const filePath1 = path.normalize(fileUrl1.pathname);
    await page.getByTestId("file-input").setInputFiles(filePath1);
    await expect(
      page.getByText("recipes found that contains Food.")
    ).toBeVisible();
  });
});
