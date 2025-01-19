import { test, expect } from "@playwright/test";
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe("Testing App functionality with mocked Spoonacular API", () => {
  // ensure app is running at 192.168.1.22:5173 before running tests if running locally.
  const spoonacularCache = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, "../../../public/spoonacularCache.json"),
      "utf-8"
    )
  );

  test.beforeEach(async ({ page }) => {
    // Intercept API requests to the correct Spoonacular route
    await page.route(
      "https://api.spoonacular.com/recipes/complexSearch**",
      (route) => {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(spoonacularCache),
        });
      }
    );
  });

  test("searches for 'pizza' and sees results", async ({ page }) => {
    // Go to homepage
    await page.goto(""); // uses baseURL in config

    // Locate the input
    const searchInput = page.getByTestId("text-input");
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
    await page.goto(""); // uses baseURL in config

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
    // We originally tried locating the dialog by its accessible name:
    //   const recipeModal = page.getByRole("dialog", { name: /Asparagus and Pea Soup: Real/ })
    // but it kept timing out because the final accessible name was different (or missing).
    //
    // Ultimately, we decided to grab the first open dialog:
    //   .first()
    // because we only ever have one dialog open at a time.
    // This bypasses the need for a matching dialog name in the accessibility tree.

    const recipeModal = page.getByRole("dialog").first();

    // We also had trouble with “pointer-events: none” on the <body>
    // blocking clicks. Removing that style or forcing the click didn’t fully solve it
    // until we confirmed the correct overlay (dialog) was actually targeted.

    // Once we found the correct dialog, we locate the heart button
    // by searching for any <button> that has an <svg> with the “lucide-heart” class/icon.
    // (No accessible name or data-testid had worked reliably in the final HTML.)
    const heartButton = recipeModal.locator("button:has(svg.lucide-heart)");

    // 1. Navigate to the home page (baseURL is set in config)
    await page.goto("");

    // 2. Wait for initial random recipes
    // We found that random recipes were loaded on the homepage,
    // so we wait for the text about “random recipes found.”
    await expect(page.getByText("random recipes found.")).toBeVisible();
    await expect(page.getByText("Asparagus and Pea Soup: Real")).toBeVisible();

    // 3. Open the Favorites list
    await page.getByTestId("openFavorites").click();

    // 4. Verify no favorite recipes are listed
    await expect(page.getByText("Your favorite recipes will")).toBeVisible();

    // 5. Close the Favorites list
    await page.getByTestId("openFavorites").click();

    // 6. Open the recipe details modal
    // We locate the recipe card (by its image’s alt text),
    // which triggers the dialog to appear when clicked.
    await page
      .getByRole("img", { name: "Asparagus and Pea Soup: Real" })
      .click();

    // 7. Wait for the modal content to appear (unique to the modal)
    // Checking for the heading ensures the dialog is rendered
    await expect(
      page.getByRole("heading", { name: "Asparagus and Pea Soup: Real" })
    ).toBeVisible();

    // 8. Add recipe to Favorites
    // We can finally click the heart button now that we have the correct dialog reference
    await heartButton.click();

    // 9. Close the recipe details modal
    await page.getByTestId("closeModal").click();

    // 10. Open the Favorites list
    await page.getByTestId("openFavorites").click();

    // 11. Verify the recipe is now in Favorites
    await expect(page.getByText("Asparagus and Pea Soup: Real")).toBeVisible();

    // 12. Open the recipe details modal from Favorites
    await page
      .getByRole("img", { name: "Asparagus and Pea Soup: Real" })
      .click();

    // 13. Wait for the modal content to appear (unique to the modal)
    await expect(
      page.getByRole("heading", { name: "Asparagus and Pea Soup: Real" })
    ).toBeVisible();

    // 14. Click to remove the recipe from the Favorites list
    // Because the same heart button is used to “toggle” favorites,
    // we just click it again to unfavorite.
    await heartButton.click();

    // 15. Close the modal and confirm Favorites is now empty
    await page.getByTestId("closeModal").click();
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

    await page.goto("");

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
