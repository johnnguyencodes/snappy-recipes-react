import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import RecipeCard from "../../components/app/RecipeCard";
import { IRecipe } from "types/AppTypes";
import { describe, it, expect, vi } from "vitest";

describe("RecipeCard Component", () => {
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

  const mockFavorites: IRecipe[] = [];
  const mockToggleFavorite = vi.fn();
  const mockOnCardClick = vi.fn();

  it("renders the RecipeCard with the correct details", () => {
    render(
      <RecipeCard
        recipe={mockRecipe}
        id={mockRecipe.id}
        image={mockRecipe.image}
        title={mockRecipe.title}
        readyInMinutes={mockRecipe.readyInMinutes}
        servings={mockRecipe.servings}
        nutrition={mockRecipe.nutrition}
        diets={mockRecipe.diets}
        summary={mockRecipe.summary}
        sourceUrl={mockRecipe.sourceUrl}
        onCardClick={mockOnCardClick}
        favoritesArray={mockFavorites}
        toggleFavorite={mockToggleFavorite}
      />
    );

    expect(screen.getByText("Mock Recipe")).toBeInTheDocument();
    expect(screen.getByText("45 minutes")).toBeInTheDocument();
    expect(screen.getByText("2 servings")).toBeInTheDocument();
  });

  it("calls onCardClick when the card is clicked", () => {
    render(
      <RecipeCard
        recipe={mockRecipe}
        id={mockRecipe.id}
        image={mockRecipe.image}
        title={mockRecipe.title}
        readyInMinutes={mockRecipe.readyInMinutes}
        servings={mockRecipe.servings}
        nutrition={mockRecipe.nutrition}
        diets={mockRecipe.diets}
        summary={mockRecipe.summary}
        sourceUrl={mockRecipe.sourceUrl}
        onCardClick={mockOnCardClick}
        favoritesArray={mockFavorites}
        toggleFavorite={mockToggleFavorite}
      />
    );

    const card = screen.getByTestId(`recipe-card-${mockRecipe.id}`);
    fireEvent.click(card);

    expect(mockOnCardClick).toHaveBeenCalledWith(mockRecipe);
  });

  it("calls toggleFavorite when the favorite button is clicked", () => {
    render(
      <RecipeCard
        recipe={mockRecipe}
        id={mockRecipe.id}
        image={mockRecipe.image}
        title={mockRecipe.title}
        readyInMinutes={mockRecipe.readyInMinutes}
        servings={mockRecipe.servings}
        nutrition={mockRecipe.nutrition}
        diets={mockRecipe.diets}
        summary={mockRecipe.summary}
        sourceUrl={mockRecipe.sourceUrl}
        onCardClick={mockOnCardClick}
        favoritesArray={mockFavorites}
        toggleFavorite={mockToggleFavorite}
      />
    );

    const favoriteButton = screen.getByTestId(
      `favorite-button-${mockRecipe.id}`
    );
    fireEvent.click(favoriteButton);

    expect(mockToggleFavorite).toHaveBeenCalledWith(mockRecipe);
  });
});
