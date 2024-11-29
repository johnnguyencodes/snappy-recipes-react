import { useState, useEffect } from "react";
import { IRecipe } from "../../../types/APIResponseTypes";
import RecipeCard from "./RecipeCard";

const Recipes: React.FC<{ recipes: IRecipe[] | null }> = ({ recipes }) => {
  const [validatedRecipes, setValidRecipes] = useState<IRecipe[] | null>(null);

  useEffect(() => {});
  if (!recipes || recipes.length === 0) {
    return <p>No recipes found.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <RecipeCard
          id={recipe.id}
          key={recipe.id}
          image={recipe.image}
          title={recipe.title}
          readyInMinutes={recipe.readyInMinutes}
          servings={recipe.servings}
          nutrition={recipe.nutrition}
          sourceUrl={recipe.sourceUrl}
          analyzedInstructions={recipe.analyzedInstructions}
          diets={recipe.diets}
          summary={recipe.summary}
        />
      ))}
    </div>
  );
};

export default Recipes;
