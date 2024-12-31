import { getRecipes } from "../../lib/apiUtils.ts";
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
} from "vitest";

describe("getRecipes (mocked  environments)", () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeAll(() => {
    // Save the original process.env
    originalEnv = { ...process.env };
  });

  afterAll(() => {
    // Restore process.env after all tests
    process.env = originalEnv;
  });

  describe("getRecipes (development mode)", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "development";
      vi.resetAllMocks();
    });

    afterEach(() => {
      vi.restoreAllMocks(); // Restore original mocks after each test
    });

    it("should return cached data from the local JSON file when fetch is successful", async () => {
      const cachedData = { recipes: ["Cached Recipe1", "Cached Recipe2"] };

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => cachedData,
      });

      const mockShowError = vi.fn();
      const mockSetErrorMessage = vi.fn();

      const result = await getRecipes(
        "pasta",
        "",
        "",
        mockShowError,
        mockSetErrorMessage
      );

      expect(result).toEqual(cachedData);
      expect(fetch).toHaveBeenCalledWith("/spoonacularCache.json");
      expect(mockShowError).not.toHaveBeenCalled();
    });

    it("should log an error if the local JSON fetch fails", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Mock the local JSON fetch to fail with a network error
      global.fetch = vi.fn().mockImplementationOnce(() => {
        return Promise.reject(new Error("Network Error"));
      });

      const mockShowError = vi.fn();
      const mockSetErrorMessage = vi.fn();

      const result = await getRecipes(
        "pasta",
        "",
        "",
        mockShowError,
        mockSetErrorMessage
      );

      // Assertions
      expect(result).toBeUndefined();
      expect(fetch).toHaveBeenCalledWith("/spoonacularCache.json");
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error reading local dev JSON spoonacularCache:",
        expect.any(Error)
      );
      expect(mockShowError).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("in production mode", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "production";
      vi.restoreAllMocks();
    });
    it("should make a GET request to the Spoonacular API and return the data on success", async () => {
      const mockResponse = { recipes: ["Recipe1", "Recipe2"] };
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const mockShowError = vi.fn();
      const mockSetErrorMessage = vi.fn();
      const intolerancesString = "lacto-vegetarian";
      const restrictionsString = "egg,peanut";
      const result = await getRecipes(
        "pasta",
        intolerancesString,
        restrictionsString,
        mockShowError,
        mockSetErrorMessage
      );
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

      const mockShowError = vi.fn();
      const mockSetErrorMessage = vi.fn();
      const intolerancesString = "lacto-vegetarian";
      const restrictionsString = "egg,peanut";

      await expect(
        getRecipes(
          "pasta",
          intolerancesString,
          restrictionsString,
          mockShowError,
          mockSetErrorMessage
        )
      ).rejects.toThrow("Error with GET fetch request with query pasta");
    });

    it("should throw an error if there is a network error", async () => {
      global.fetch = vi
        .fn()
        .mockRejectedValueOnce(
          new Error("Error with fetching recipes with query pasta")
        );

      const mockShowError = vi.fn();
      const mockSetErrorMessage = vi.fn();
      const intolerancesString = "lacto-vegetarian";
      const restrictionsString = "egg,peanut";

      await expect(
        getRecipes(
          "pasta",
          intolerancesString,
          restrictionsString,
          mockShowError,
          mockSetErrorMessage
        )
      ).rejects.toThrow("Error with fetching recipes with query pasta");
    });

    it("should construct the URL with the correct query string", async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const mockShowError = vi.fn();
      const mockSetErrorMessage = vi.fn();
      const intolerancesString = "lacto-vegetarian";
      const restrictionsString = "egg,peanut";

      await getRecipes(
        "pasta",
        intolerancesString,
        restrictionsString,
        mockShowError,
        mockSetErrorMessage
      );
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

      const mockShowError = vi.fn();
      const mockSetErrorMessage = vi.fn();
      const intolerancesString = "lacto-vegetarian";
      const restrictionsString = "egg,peanut";

      await getRecipes(
        "pasta",
        intolerancesString,
        restrictionsString,
        mockShowError,
        mockSetErrorMessage
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            "Content-Type": "application/json",
          },
        })
      );
    });

    it("should handle empty intolerances and restrictions gracefully", async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const mockShowError = vi.fn();
      const mockSetErrorMessage = vi.fn();

      await getRecipes("pasta", "", "", mockShowError, mockSetErrorMessage);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("&query=pasta&intolerances=&diet="),
        expect.any(Object)
      );
    });

    it("should throw an error if the API response contains invalid JSON", async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new SyntaxError("Unexpected token < in JSON");
        },
      });

      const mockShowError = vi.fn();
      const mockSetErrorMessage = vi.fn();

      await expect(
        getRecipes("pasta", "", "", mockShowError, mockSetErrorMessage)
      ).rejects.toThrow("Malformed JSON response");

      expect(mockShowError).toHaveBeenCalledWith(
        "errorMalformedSpoonacularResponse",
        mockSetErrorMessage,
        "pasta"
      );
    });

    it("should throw an error if the headers are missing or malformed", async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({}),
      });

      const mockShowError = vi.fn();
      const mockSetErrorMessage = vi.fn();

      await expect(
        getRecipes("pasta", "", "", mockShowError, mockSetErrorMessage)
      ).rejects.toThrow("Error with GET fetch request with query pasta");
    });
  });
});
