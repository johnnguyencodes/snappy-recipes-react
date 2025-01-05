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
  { label: string; icon: ReactElement }
> = {
  [DietaryRestriction.Vegan]: {
    label: "Vegan",
    icon: (
      <Leaf className="h-5 w-5 text-lightmode-green dark:text-darkmode-green" />
    ),
  },
  [DietaryRestriction.Vegetarian]: {
    label: "Vegetarian",
    icon: (
      <Sprout className="h-5 w-5 text-lightmode-green dark:text-darkmode-green" />
    ),
  },
  [DietaryRestriction.LactoVegetarian]: {
    label: "Lacto-Vegetarian",
    icon: (
      <Milk className="h-5 w-5 text-lightmode-dimmed3 dark:text-darkmode-dimmed3" />
    ),
  },
  [DietaryRestriction.OvoVegetarian]: {
    label: "Ovo-Vegetarian",
    icon: (
      <Egg className="h-5 w-5 text-lightmode-yellow dark:text-darkmode-yellow" />
    ),
  },
  [DietaryRestriction.Pescetarian]: {
    label: "Pescetarian",
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
  { label: string; icon: ReactElement }
> = {
  [FoodIntolerance.Dairy]: {
    label: "Dairy",
    icon: (
      <Milk className="h-5 w-5 text-lightmode-dimmed3 dark:text-darkmode-dimmed3" />
    ),
  },
  [FoodIntolerance.Egg]: {
    label: "Egg",
    icon: (
      <Egg className="h-5 w-5 text-lightmode-yellow dark:text-darkmode-yellow" />
    ),
  },
  [FoodIntolerance.Gluten]: {
    label: "Gluten",
    icon: (
      <Wheat className="h-5 w-5 text-lightmode-orange dark:text-darkmode-orange" />
    ),
  },
  [FoodIntolerance.Peanut]: {
    label: "Peanut",
    icon: (
      <Bean className="h-5 w-5 text-lightmode-yellow dark:text-darkmode-yellow" />
    ),
  },
  [FoodIntolerance.Seafood]: {
    label: "Seafood",
    icon: (
      <Fish className="h-5 w-5 text-lightmode-blue dark:text-darkmode-blue" />
    ),
  },
  [FoodIntolerance.Sesame]: {
    label: "Sesame",
    icon: (
      <Bean className="h-5 w-5 text-lightmode-orange dark:text-darkmode-orange" />
    ),
  },
  [FoodIntolerance.Shellfish]: {
    label: "Shellfish",
    icon: (
      <Shell className="h-5 w-5 text-lightmode-red dark:text-darkmode-red" />
    ),
  },
  [FoodIntolerance.Soy]: {
    label: "Soy",
    icon: (
      <Bean className="h-5 w-5 text-lightmode-green dark:text-darkmode-green" />
    ),
  },
  [FoodIntolerance.Sulfite]: {
    label: "Sulfite",
    icon: (
      <FlaskConical className="h-5 w-5 text-lightmode-text dark:text-darkmode-text" />
    ),
  },
  [FoodIntolerance.TreeNut]: {
    label: "Tree Nut",
    icon: (
      <Nut className="h-5 w-5 text-lightmode-yellow dark:text-darkmode-yellow" />
    ),
  },
  [FoodIntolerance.Wheat]: {
    label: "Wheat",
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
