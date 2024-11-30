import { ReactElement } from "react";

export interface IRecipe {
  id: number;
  image: string;
  title: string;
  readyInMinutes: number;
  servings: number;
  nutrition: {
    nutrients: Array<{
      name: string;
      amount: number;
      unit: string;
      percentOfDailyNeeds: number;
    }>;
    ingredients: {
      id: number;
      name: string;
      amount: number;
      unit: string;
    }[];
  };
  sourceUrl: string;
  diets: string[];
  summary: string;
}

export interface IRecipeCardProps extends IRecipe {
  onCardClick: (recipe: IRecipe) => void;
}

export interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactElement;
}

export enum DietaryRestriction {
  Vegan = "vegan",
  Vegetarian = "vegetarian",
  LactoVegetarian = "lacto-vegetarian",
  OvoVegetarian = "ovo-vegetarian",
  Pescetarian = "pescetarian",
}

export const DietaryRestrictionLabels: Record<DietaryRestriction, string> = {
  [DietaryRestriction.Vegan]: "Vegan",
  [DietaryRestriction.Vegetarian]: "Vegetarian",
  [DietaryRestriction.LactoVegetarian]: "Lacto-Vegetarian",
  [DietaryRestriction.OvoVegetarian]: "Ovo-Vegetarian",
  [DietaryRestriction.Pescetarian]: "Pescetarian",
};

export enum FoodIntolerance {
  Dairy = "dairy",
  Egg = "egg",
  Gluten = "gluten",
  Peanut = "peanut",
  Seafood = "seafood",
  Sesame = "sesame",
  Shellfish = "shellfish",
  Soy = "soy",
  Sulfite = "sulfite",
  TreeNut = "tree-nut",
  Wheat = "wheat",
}

export const FoodIntoleranceLabels: Record<FoodIntolerance, string> = {
  [FoodIntolerance.Dairy]: "Dairy",
  [FoodIntolerance.Egg]: "Egg",
  [FoodIntolerance.Gluten]: "Gluten",
  [FoodIntolerance.Peanut]: "Peanut",
  [FoodIntolerance.Seafood]: "Seafood",
  [FoodIntolerance.Sesame]: "Sesame",
  [FoodIntolerance.Shellfish]: "Shellfish",
  [FoodIntolerance.Soy]: "Soy",
  [FoodIntolerance.Sulfite]: "Sulfite",
  [FoodIntolerance.TreeNut]: "Tree Nut",
  [FoodIntolerance.Wheat]: "Wheat",
};
