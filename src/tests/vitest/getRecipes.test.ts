import { getRecipes } from "../../lib/apiUtils.ts";
import { describe, it, expect, vi } from "vitest";

describe("getRecipes", () => {
  it("should make a GET request to the Spoonacular API and return the data on success", async () => {
    const mockResponse = { recipes: ["Recipe1", "Recipe2"] };
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await getRecipes("pasta");
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("spoonacular.com"),
      expect.objectContaining({
        method: "GET",
      })
    );
    expect(result).toEqual(mockResponse);
  });

  it("should throw an error if the API response is not OK", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: "Bad Request",
    });

    await expect(getRecipes("pasta")).rejects.toThrow(
      "Error with GET fetch request with query pasta"
    );
  });

  it("should throw an error if there is a network error", async () => {
    global.fetch = vi
      .fn()
      .mockRejectedValueOnce(
        new Error("Error with fetching recipes with query pasta")
      );

    await expect(getRecipes("pasta")).rejects.toThrow(
      "Error with fetching recipes with query pasta"
    );
  });

  it("should construct the URL with the correct query string", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    await getRecipes("pasta");
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("&query=pasta"),
      expect.any(Object)
    );
  });

  it("should include the correct headers in the API request", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    await getRecipes("pasta");
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: {
          "Content-Type": "application/json",
        },
      })
    );
  });
});
