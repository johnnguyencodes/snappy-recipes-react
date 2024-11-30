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
    properties?: Array<{
      name: string;
      amount: number;
      unit: string;
    }>;
    caloricBreakdown?: {
      percentProtein: number;
      percentFat: number;
      percentCarbs: number;
    };
    weightPerServing?: {
      amount: number;
      unit: string;
    };
    ingredients: {
      id: number;
      name: string;
      amount: number;
      unit: string;
      nutrients: {
        name: string;
        amount: number;
        unit: string;
        percentOfDailyNeeds?: number;
      }[];
    }[];
  };
  sourceUrl: string;
  analyzedInstructions: Array<{
    name: string;
    steps: Array<{
      number: number;
      step: string;
      ingredients: Array<{
        id: number;
        name: string;
        amount: number;
        unit: string;
      }>;
      equipment: Array<{
        id: number;
        name: string;
      }>;
    }>;
  }>;
  diets: string[];
  summary: string;
}

export interface IRecipeCardProps extends IRecipe {
  onCardClick: (recipe: IRecipe) => void;
}

export interface IRecipeModalProps {
  image: string;
  summary: string;
  analyzedInstructions: Array<{
    name: string;
    steps: Array<{
      number: number;
      step: string;
      ingredients: Array<{
        id: number;
        name: string;
        amount: number;
        unit: string;
      }>;
      equipment: Array<{
        id: number;
        name: string;
      }>;
    }>;
  }>;
}

export interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  image?: string;
  children: ReactElement;
}
