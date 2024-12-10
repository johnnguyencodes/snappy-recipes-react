import { describe, it, expect, vi, beforeEach } from "vitest";
import { IRecipe } from "../../../types/AppTypes.ts";
import { callSpoonacularAPI } from "../../lib/appUtils";
import { getRecipes } from "../../lib/apiUtils";
import { showError } from "../../lib/formUtils";

// Mock apiUtils and formUtils before importing callSpoonacularAPI
vi.mock("../../lib/apiUtils", async () => {
  const actual = await vi.importActual<unknown>("../../lib/apiUtils");
  return {
    ...(actual as Record<string, unknown>),
    getRecipes: vi.fn(),
  };
});

vi.mock("../../lib/formUtils", () => ({
  showError: vi.fn(),
  clearErrorMessage: vi.fn(),
  searchValidation: vi.fn(),
}));

const mockGetRecipes = vi.mocked(getRecipes);
const mockShowError = vi.mocked(showError);

describe("callSpoonacularAPI", () => {
  let mockSetErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
  let mockSetStatusMessage: React.Dispatch<React.SetStateAction<string | null>>;
  let mockSetRecipeArray: React.Dispatch<
    React.SetStateAction<IRecipe[] | null>
  >;

  beforeEach(() => {
    mockSetErrorMessage = vi.fn() as React.Dispatch<
      React.SetStateAction<string | null>
    >;
    mockSetStatusMessage = vi.fn() as React.Dispatch<
      React.SetStateAction<string | null>
    >;
    mockSetRecipeArray = vi.fn() as React.Dispatch<
      React.SetStateAction<IRecipe[] | null>
    >;
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

    // Assertions
    expect(mockSetStatusMessage).toHaveBeenCalledWith(
      "searching for recipes that contain pasta"
    );
    expect(mockGetRecipes).toHaveBeenCalledWith(
      query,
      "vegan",
      "gluten",
      expect.any(Function),
      mockSetErrorMessage
    );
    expect(mockSetRecipeArray).toHaveBeenCalledWith(mockResponse.results);
    expect(mockSetStatusMessage).toHaveBeenCalledWith(
      "1 recipes found that contains pasta"
    );
    expect(mockShowError).not.toHaveBeenCalled();
  });

  // Other tests remain unchanged
});
