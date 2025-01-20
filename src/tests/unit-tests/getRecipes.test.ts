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

    it("should proceed with the actual API call if the local JSON recipe fetch fails", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Mock the local JSON fetch to fail with a network error
      global.fetch = vi
        .fn()
        .mockImplementationOnce(() =>
          Promise.reject(new Error("Network Error"))
        )
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            recipes: ["Actual Recipe1", "Actual Recipe2"],
          }),
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
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenNthCalledWith(1, "/spoonacularCache.json");
      expect(fetch).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining("&query=pasta"),
        expect.objectContaining({
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
      );
      expect(result).toEqual({ recipes: ["Actual Recipe1", "Actual Recipe2"] });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error reading local dev JSON spoonacularCache, proceeding with actual Spoonacular API call",
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe("in production mode", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "production";
      vi.restoreAllMocks();
      localStorage.clear();
    });

    it("should skip the API call and return cached data when localStorage values and query are empty", async () => {
      const cachedData = { recipes: ["Cached Recipe1", "Cached Recipe2"] };
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => cachedData,
      });

      const mockShowError = vi.fn();
      const mockSetErrorMessage = vi.fn();

      const result = await getRecipes(
        "",
        "",
        "",
        mockShowError,
        mockSetErrorMessage
      );

      expect(fetch).toHaveBeenCalledWith("/spoonacularCache.json");
      expect(result).toEqual(cachedData);
      expect(mockShowError).not.toHaveBeenCalled();
    });

    it("should make a GET request to the Spoonacular API when localStorage has restrictions or intolerances or a valid query", async () => {
      // Mock localStorage values
      localStorage.setItem("restrictionsArray", JSON.stringify(["vegetarian"]));
      localStorage.setItem("intolerancesArray", JSON.stringify(["gluten"]));

      const mockResponse = { recipes: ["Recipe1", "Recipe2"] };
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const mockShowError = vi.fn();
      const mockSetErrorMessage = vi.fn();

      const result = await getRecipes(
        "pasta",
        "gluten",
        "vegetarian",
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
      expect(mockShowError).not.toHaveBeenCalled();
    });

    it("should fallback to the Spoonacular API if localStorage fetch fails", async () => {
      // Mock localStorage to simulate no saved values
      localStorage.setItem("restrictionsArray", JSON.stringify([]));
      localStorage.setItem("intolerancesArray", JSON.stringify([]));

      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Simulate failure for the local cache fetch
      global.fetch = vi
        .fn()
        .mockImplementationOnce(() =>
          Promise.reject(new Error("Local cache fetch failed"))
        )
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            recipes: ["Fallback Recipe1", "Fallback Recipe2"],
          }),
        });

      const mockShowError = vi.fn();
      const mockSetErrorMessage = vi.fn();

      const result = await getRecipes(
        "",
        "",
        "",
        mockShowError,
        mockSetErrorMessage
      );

      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenNthCalledWith(1, "/spoonacularCache.json");
      expect(fetch).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining("spoonacular.com"),
        expect.objectContaining({
          method: "GET",
        })
      );
      expect(result).toEqual({
        recipes: ["Fallback Recipe1", "Fallback Recipe2"],
      });
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error reading local dev JSON spoonacularCache, proceeding with actual Spoonacular API call",
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
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

    it("should fallback to the local cache when Spoonacular API limit is reached (status 402)", async () => {
      const mockCacheData = {
        recipes: ["Fallback Recipe1", "fallback Recipe2"],
      };

      global.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: false,
          status: 402,
          statusText: "Payment Required",
        }) // API limit reached
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockCacheData,
        }); // Succussful fallback to cache

      const mockShowError = vi.fn();
      const mockSetErrorMessage = vi.fn();

      const result = await getRecipes(
        "pasta",
        "gluten",
        "vegetarian",
        mockShowError,
        mockSetErrorMessage
      );

      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining("spoonacular.com"),
        expect.any(Object)
      );
      expect(fetch).toHaveBeenNthCalledWith(2, "/spoonacularCache.json");
      expect(result).toEqual(mockCacheData);
      expect(mockShowError).not.toHaveBeenCalled();
    });

    it("chould show an error if both Spoonacular API limit is exceeded and local cache fetch fails", async () => {
      global.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: false,
          status: 402,
          statusText: "Payment Required",
        }) // API limit reached
        .mockRejectedValueOnce(new Error("Local cache fetch failed")); // Cache fetch fails

      const mockShowError = vi.fn();
      const mockSetErrorMessage = vi.fn();

      const result = await getRecipes(
        "pasta",
        "gluten",
        "vegetarian",
        mockShowError,
        mockSetErrorMessage
      );

      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining("spoonacular.com"),
        expect.any(Object)
      );
      expect(fetch).toHaveBeenNthCalledWith(2, "/spoonacularCache.json");
      expect(result).toBeUndefined();
      expect(mockShowError).toHaveBeenCalledWith(
        "errorSpoonacularLimitReached",
        mockSetErrorMessage,
        null
      );
    });

    it("chould show an error if both Spoonacular API limit is exceeded and local cache fetch fails", async () => {
      global.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: false,
          status: 402,
          statusText: "Payment Required",
        }) // API limit reached
        .mockRejectedValueOnce(new Error("Local cache fetch failed")); // Cache fetch fails

      const mockShowError = vi.fn();
      const mockSetErrorMessage = vi.fn();

      const result = await getRecipes(
        "pasta",
        "gluten",
        "vegetarian",
        mockShowError,
        mockSetErrorMessage
      );

      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining("spoonacular.com"),
        expect.any(Object)
      );
      expect(fetch).toHaveBeenNthCalledWith(2, "/spoonacularCache.json");
      expect(result).toBeUndefined();
      expect(mockShowError).toHaveBeenCalledWith(
        "errorSpoonacularLimitReached",
        mockSetErrorMessage,
        null
      );
    });

    it("should handle malformed JSON response from local cache gracefully", async () => {
      global.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: false,
          status: 402,
          statusText: "Payment Required",
        }) // API limit reached
        .mockResolvedValueOnce({
          ok: true,
          json: async () => {
            throw new SyntaxError("Unexpected token in JSON");
          },
        }); // Malformed JSON in cache

      const mockShowError = vi.fn();
      const mockSetErrorMessage = vi.fn();

      await expect(
        getRecipes(
          "pasta",
          "gluten",
          "vegetarian",
          mockShowError,
          mockSetErrorMessage
        )
      ).resolves.toBeUndefined();

      expect(fetch).toHaveBeenCalledTimes(2);
      expect(mockShowError).toHaveBeenCalledWith(
        "errorSpoonacularLimitReached",
        mockSetErrorMessage,
        null
      );
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
