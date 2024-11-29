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

export interface IRecipesProps extends IRecipe {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IRecipeModalProps extends IRecipe {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}
