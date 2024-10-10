import { test, expect } from "@playwright/test";

test.describe("Recipe Search Input", () => {
  test("calls the fetch function when Enter is pressed and when clicking the submit button", async ({
    page,
  }) => {
    test.setTimeout(5000); // 5 seconds

    // Go to the app's url
    await page.goto("http://localhost:5173");

    // Mock the fetch API Call
    await page.route("**/recipes/complexSearch?*", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ results: [{ id: 1, name: "Sample recipe" }] }),
      });
    });

    // Type into the input field
    const input = page.locator("input");
    await input.fill("pizza");

    // Press the Enter key to trigger the fetch
    await input.press("Enter");

    // Wait for the fetch call and verify the response after pressing Enter
    const [enterResponse] = await Promise.all([
      page.waitForResponse("**/recipes/complexSearch?*"),
    ]);

    // Verify the response for Enter press is successful
    expect(enterResponse.ok()).toBeTruthy();
    const enterJsonResponse = await enterResponse.json();
    expect(enterJsonResponse.results[0].name).toBe("Sample recipe");

    // Now test the submit button click
    const submitButton = page.locator("button:has-text('Submit')");
    await submitButton.click();

    // Wait for the fetch call and verify the response after clicking Submit
    const [buttonResponse] = await Promise.all([
      page.waitForResponse("**/recipes/complexSearch?*"),
    ]);

    // Verify the response is successful
    expect(buttonResponse.ok()).toBeTruthy();
    const buttonJsonResponse = await buttonResponse.json();
    expect(buttonJsonResponse.results[0].name).toBe("Sample recipe");
  });
});
