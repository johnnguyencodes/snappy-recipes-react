import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import Recipes from "../../components/app/Recipes";
import { IRecipe } from "types/AppTypes";
import * as appUtils from "../../lib/appUtils";

describe("Recipes Component", () => {
  let mockToggleFavorite: ReturnType<typeof vi.fn>;

  /**
   * Creates a mock for `setIsFetching` that fully implements
   * React.Dispatch<React.SetStateAction<boolean>>. That means
   * it can accept either a boolean or a callback function.
   */
  function createSetIsFetchingMock(initialValue: boolean) {
    let current = initialValue;

    // This is the real setter signature: (value: boolean | (prev: boolean) => boolean) => void
    const setIsFetchingImpl: React.Dispatch<React.SetStateAction<boolean>> = (
      action
    ) => {
      if (typeof action === "function") {
        current = action(current);
      } else {
        current = action;
      }
    };

    // Wrap it in a Vitest mock so we can do .toHaveBeenCalledWith(...)
    // and also track how many times it's called.
    const setIsFetchingMock = vi.fn(setIsFetchingImpl);

    return {
      setIsFetchingMock,
      get isFetching() {
        return current;
      },
    };
  }

  const mockRecipe: IRecipe = {
    id: 1,
    title: "Mock Recipe",
    image: "mock-image.jpg",
    readyInMinutes: 45,
    servings: 2,
    diets: ["vegan"],
    summary: "Mock summary",
    nutrition: {
      nutrients: [
        {
          name: "Calories",
          amount: 594.1,
          unit: "kcal",
          percentOfDailyNeeds: 29.7,
        },
        {
          name: "Fat",
          amount: 23.79,
          unit: "g",
          percentOfDailyNeeds: 36.59,
        },
        {
          name: "Saturated Fat",
          amount: 9.04,
          unit: "g",
          percentOfDailyNeeds: 56.52,
        },
        {
          name: "Carbohydrates",
          amount: 68.04,
          unit: "g",
          percentOfDailyNeeds: 22.68,
        },
        {
          name: "Net Carbohydrates",
          amount: 50.31,
          unit: "g",
          percentOfDailyNeeds: 18.29,
        },
        {
          name: "Sugar",
          amount: 14.56,
          unit: "g",
          percentOfDailyNeeds: 16.18,
        },
        {
          name: "Cholesterol",
          amount: 62.32,
          unit: "mg",
          percentOfDailyNeeds: 20.77,
        },
        {
          name: "Sodium",
          amount: 1709.61,
          unit: "mg",
          percentOfDailyNeeds: 74.33,
        },
        {
          name: "Alcohol",
          amount: 0,
          unit: "g",
          percentOfDailyNeeds: 100,
        },
        {
          name: "Alcohol %",
          amount: 0,
          unit: "%",
          percentOfDailyNeeds: 100,
        },
        {
          name: "Protein",
          amount: 34.23,
          unit: "g",
          percentOfDailyNeeds: 68.46,
        },
      ],
      ingredients: [{ id: 1, name: "Mock Ingredient", amount: 2, unit: "pcs" }],
    },
    sourceUrl: "http://example.com",
  };

  // Mocking validateImageUrl so we don't rely on real network calls
  vi.mock("@/lib/appUtils", async () => {
    const actual =
      await vi.importActual<typeof import("@/lib/appUtils")>("@/lib/appUtils");
    return {
      ...actual,
      validateImageUrl: vi.fn(),
    };
  });

  beforeEach(() => {
    // Fresh copy for each test
    mockToggleFavorite = vi.fn();
  });

  afterEach(() => {
    // Ensure DOM is wiped clean and all mocks are cleared
    cleanup();
    vi.clearAllMocks();
  });

  it("renders no recipes message when no recipes are available", async () => {
    const { setIsFetchingMock } = createSetIsFetchingMock(false);

    render(
      <Recipes
        recipes={[]}
        favoritesArray={[]}
        toggleFavorite={vi.fn()}
        isFavoritesVisible={false}
        isFetching={false}
        setIsFetching={setIsFetchingMock}
      />
    );

    // Check text is actually in the document
    expect(
      await screen.findByText(
        "No recipes found. Try a different query, or use different filters in your settings."
      )
    ).toBeInTheDocument();
  });

  it("validates each recipe's image and then renders the validated recipe cards", async () => {
    // Set up your mock to resolve with a "validated" image
    const validateImageUrlMock = vi.mocked(appUtils.validateImageUrl);
    validateImageUrlMock.mockResolvedValue("validated-image.jpg");

    const { setIsFetchingMock, isFetching } = createSetIsFetchingMock(true);

    // Render the component with the relevant props
    render(
      <Recipes
        recipes={[mockRecipe]}
        favoritesArray={[]}
        toggleFavorite={vi.fn()}
        isFavoritesVisible={false}
        isFetching={isFetching}
        setIsFetching={setIsFetchingMock}
      />
    );

    // Wait for the validated recipe to appear
    //    This confirms the effect finished, validateImageUrl was called,
    //    and setValidatedRecipes triggered a re-render.
    expect(await screen.findByText("Mock Recipe")).toBeInTheDocument();

    // Confirm validateImageUrl was called
    expect(validateImageUrlMock).toHaveBeenCalledTimes(1);
    expect(validateImageUrlMock).toHaveBeenCalledWith(
      "mock-image.jpg",
      "https://placehold.co/312x231"
    );

    // Confirm that setIsFetching was called with false in the end
    expect(setIsFetchingMock).toHaveBeenCalledWith(false);
  });

  it("renders the favorites section when isFavoritesVisible is true", async () => {
    const { setIsFetchingMock, isFetching } = createSetIsFetchingMock(true);
    // Suppose if we pass `recipes={[]}` but `favoritesArray={[mockRecipe]}`,
    // the component will show our mock recipe in the favorites section.
    render(
      <Recipes
        recipes={[]}
        favoritesArray={[mockRecipe]}
        toggleFavorite={mockToggleFavorite}
        isFavoritesVisible={true}
        isFetching={isFetching}
        setIsFetching={setIsFetchingMock}
      />
    );

    expect(screen.getByText("Mock Recipe")).toBeInTheDocument();
  });
});
