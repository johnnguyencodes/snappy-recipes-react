import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock apiUtils and formUtils before importing callSpoonacularAPI
vi.mock("../../lib/apiUtils", async () => {
  const actual =
    await vi.importActual<Record<string, any>>("../../lib/apiUtils");
  return {
    ...actual,
    getRecipes: vi.fn(),
  };
});

vi.mock("../../lib/formUtils", () => ({
  showError: vi.fn(),
  clearErrorMessage: vi.fn(),
  searchValidation: vi.fn(),
}));

import { callSpoonacularAPI } from "../../lib/appUtils";
import { getRecipes } from "../../lib/apiUtils";
import { showError } from "../../lib/formUtils";

const mockGetRecipes = vi.mocked(getRecipes);
const mockShowError = vi.mocked(showError);

describe("callSpoonacularAPI", () => {
  let mockSetErrorMessage: (msg: string | null) => void;
  let mockSetStatusMessage: (msg: string | null) => void;
  let mockSetRecipeArray: (recipes: any[] | null) => void;

  beforeEach(() => {
    mockSetErrorMessage = vi.fn();
    mockSetStatusMessage = vi.fn();
    mockSetRecipeArray = vi.fn();
    vi.clearAllMocks();
  });

  it("should search for recipes that contain a given query", async () => {
    const query = "pasta";
    const restrictionsArray = ["vegan"];
    const intolerancesArray = ["gluten"];

    const mockResponse = {
      results: [{ title: "Vegan Gluten-Free Pasta" }],
      number: 1,
    };
    mockGetRecipes.mockResolvedValue(mockResponse);

    await callSpoonacularAPI(
      query,
      mockSetErrorMessage,
      mockSetStatusMessage,
      mockSetRecipeArray,
      restrictionsArray,
      intolerancesArray
    );

    // Initial status message
    expect(mockSetStatusMessage).toHaveBeenCalledWith(
      "searching for recipes that contain pasta"
    );

    // Verify getRecipes was called with correct parameters
    expect(mockGetRecipes).toHaveBeenCalledWith(
      query,
      "vegan", // restrictionsArray.join(',')
      "gluten", // intolerancesArray.join(',')
      expect.any(Function), // showError
      mockSetErrorMessage
    );

    // After success
    expect(mockSetRecipeArray).toHaveBeenCalledWith(mockResponse.results);
    expect(mockSetStatusMessage).toHaveBeenCalledWith(
      "1 recipes found that contains pasta"
    );
    expect(mockShowError).not.toHaveBeenCalled();
  });

  it("should search for random recipes if no query is provided", async () => {
    const query = "";
    const mockResponse = {
      results: [{ title: "Random Recipe 1" }, { title: "Random Recipe 2" }],
      number: 2,
    };

    mockGetRecipes.mockResolvedValue(mockResponse);

    await callSpoonacularAPI(
      query,
      mockSetErrorMessage,
      mockSetStatusMessage,
      mockSetRecipeArray,
      null,
      null
    );

    // Initial status message for no query
    expect(mockSetStatusMessage).toHaveBeenCalledWith(
      "searching for random recipes"
    );

    // getRecipes called with empty strings for restrictions and intolerances
    expect(mockGetRecipes).toHaveBeenCalledWith(
      "",
      "",
      "",
      expect.any(Function),
      mockSetErrorMessage
    );

    expect(mockSetRecipeArray).toHaveBeenCalledWith(mockResponse.results);
    expect(mockSetStatusMessage).toHaveBeenCalledWith(
      "2 random recipes found."
    );
  });

  it("should handle an API error gracefully", async () => {
    const query = "chicken";
    const mockError = new Error("Network Error");
    mockGetRecipes.mockRejectedValue(mockError);

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await callSpoonacularAPI(
      query,
      mockSetErrorMessage,
      mockSetStatusMessage,
      mockSetRecipeArray,
      null,
      null
    );

    // Initial status message
    expect(mockSetStatusMessage).toHaveBeenCalledWith(
      "searching for recipes that contain chicken"
    );

    // After failure
    expect(mockSetStatusMessage).toHaveBeenLastCalledWith("");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching data from Spoonacular API:",
      mockError
    );
    expect(mockSetRecipeArray).not.toHaveBeenCalled();
    expect(mockShowError).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("should handle the case when getRecipes returns null or undefined", async () => {
    const query = "pizza";
    mockGetRecipes.mockResolvedValue(null);

    await callSpoonacularAPI(
      query,
      mockSetErrorMessage,
      mockSetStatusMessage,
      mockSetRecipeArray,
      null,
      null
    );

    // Initial status message
    expect(mockSetStatusMessage).toHaveBeenCalledWith(
      "searching for recipes that contain pizza"
    );

    // If spoonacularJson is falsy, we don't update setRecipeArray or final status message
    expect(mockSetRecipeArray).not.toHaveBeenCalled();
    expect(mockSetStatusMessage).toHaveBeenCalledTimes(1); // Only initial call
  });

  it("should correctly convert restrictionsArray and intolerancesArray to strings", async () => {
    const query = "salad";
    const restrictionsArray = ["vegetarian", "low-carb"];
    const intolerancesArray = ["dairy", "nuts"];

    const mockResponse = {
      results: [{ title: "Vegetarian Salad" }],
      number: 1,
    };
    mockGetRecipes.mockResolvedValue(mockResponse);

    await callSpoonacularAPI(
      query,
      mockSetErrorMessage,
      mockSetStatusMessage,
      mockSetRecipeArray,
      restrictionsArray,
      intolerancesArray
    );

    expect(mockGetRecipes).toHaveBeenCalledWith(
      "salad",
      "vegetarian,low-carb",
      "dairy,nuts",
      expect.any(Function),
      mockSetErrorMessage
    );
  });
});
