import { ReactElement } from "react";
import {
  Leaf,
  Sprout,
  Milk,
  Egg,
  Fish,
  Wheat,
  Nut,
  Shell,
  Bean,
  FlaskConical,
} from "lucide-react";

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

export interface IRecipesProps {
  recipes: IRecipe[] | null;
  favoritesArray: IRecipe[];
  toggleFavorite: (recipe: IRecipe) => void;
  isFavoritesVisible: boolean;
  isFetching: boolean;
  setIsFetching: React.Dispatch<React.SetStateAction<boolean>>;
  errorMessage: string | null;
}

export interface IRecipeCardProps {
  recipe: IRecipe;
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
  onCardClick: (recipe: IRecipe) => void;
  favoritesArray: IRecipe[];
  toggleFavorite: (recipe: IRecipe) => void;
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

export const DietaryRestrictionDetails: Record<
  DietaryRestriction,
  { label: string; value: string; icon: ReactElement }
> = {
  [DietaryRestriction.Vegan]: {
    label: "Vegan",
    value: "vegan",
    icon: (
      <Leaf className="h-5 w-5 text-lightmode-green dark:text-darkmode-green" />
    ),
  },
  [DietaryRestriction.Vegetarian]: {
    label: "Vegetarian",
    value: "vegerarian",
    icon: (
      <Sprout className="h-5 w-5 text-lightmode-green dark:text-darkmode-green" />
    ),
  },
  [DietaryRestriction.LactoVegetarian]: {
    label: "Lacto-Vegetarian",
    value: "lacto-vegerarian",
    icon: (
      <Milk className="h-5 w-5 text-lightmode-dimmed3 dark:text-darkmode-dimmed1" />
    ),
  },
  [DietaryRestriction.OvoVegetarian]: {
    label: "Ovo-Vegetarian",
    value: "ovo-vegetarian",
    icon: (
      <Egg className="h-5 w-5 text-lightmode-yellow dark:text-darkmode-yellow" />
    ),
  },
  [DietaryRestriction.Pescetarian]: {
    label: "Pescetarian",
    value: "pescetarian",
    icon: (
      <Fish className="h-5 w-5 text-lightmode-blue dark:text-darkmode-blue" />
    ),
  },
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

export const FoodIntoleranceDetails: Record<
  FoodIntolerance,
  { label: string; value: string; icon: ReactElement }
> = {
  [FoodIntolerance.Dairy]: {
    label: "Dairy",
    value: "dairy",
    icon: (
      <Milk className="h-5 w-5 text-lightmode-dimmed3 dark:text-darkmode-dimmed1" />
    ),
  },
  [FoodIntolerance.Egg]: {
    label: "Egg",
    value: "egg",
    icon: (
      <Egg className="h-5 w-5 text-lightmode-yellow dark:text-darkmode-yellow" />
    ),
  },
  [FoodIntolerance.Gluten]: {
    label: "Gluten",
    value: "gluten",
    icon: (
      <Wheat className="h-5 w-5 text-lightmode-orange dark:text-darkmode-orange" />
    ),
  },
  [FoodIntolerance.Peanut]: {
    label: "Peanut",
    value: "peanut",
    icon: (
      <Bean className="h-5 w-5 text-lightmode-yellow dark:text-darkmode-yellow" />
    ),
  },
  [FoodIntolerance.Seafood]: {
    label: "Seafood",
    value: "seafood",
    icon: (
      <Fish className="h-5 w-5 text-lightmode-blue dark:text-darkmode-blue" />
    ),
  },
  [FoodIntolerance.Sesame]: {
    label: "Sesame",
    value: "sesame",
    icon: (
      <Bean className="h-5 w-5 text-lightmode-orange dark:text-darkmode-orange" />
    ),
  },
  [FoodIntolerance.Shellfish]: {
    label: "Shellfish",
    value: "shellfish",
    icon: (
      <Shell className="h-5 w-5 text-lightmode-red dark:text-darkmode-red" />
    ),
  },
  [FoodIntolerance.Soy]: {
    label: "Soy",
    value: "soy",
    icon: (
      <Bean className="h-5 w-5 text-lightmode-green dark:text-darkmode-green" />
    ),
  },
  [FoodIntolerance.Sulfite]: {
    label: "Sulfite",
    value: "sulfite",
    icon: (
      <FlaskConical className="h-5 w-5 text-lightmode-text dark:text-darkmode-text" />
    ),
  },
  [FoodIntolerance.TreeNut]: {
    label: "Tree Nut",
    value: "tree-nut",
    icon: (
      <Nut className="h-5 w-5 text-lightmode-yellow dark:text-darkmode-yellow" />
    ),
  },
  [FoodIntolerance.Wheat]: {
    label: "Wheat",
    value: "wheat",
    icon: (
      <Wheat className="h-5 w-5 text-lightmode-orange dark:text-darkmode-orange" />
    ),
  },
};

export interface ISettingsContentProps {
  restrictionsArray: string[] | null;
  intolerancesArray: string[] | null;
  handleRestrictionClick: (restriction: string) => void;
  handleIntoleranceClick: (intolerance: string) => void;
}
