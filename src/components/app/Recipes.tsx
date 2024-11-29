import { useState, useEffect } from "react";
import { IRecipe } from "../../../types/APIResponseTypes";
import RecipeCard from "./RecipeCard";
import { validateImageUrl } from "@/lib/appUtils";

const Recipes: React.FC<{ recipes: IRecipe[] | null }> = ({ recipes }) => {
  const [validatedRecipes, setValidatedRecipes] = useState<IRecipe[] | null>(
    null
  );

  useEffect(() => {
    const validateRecipes = async () => {
      if (recipes) {
        const fallbackImage = "https://placehold.co/312x231";
        const updatedRecipes = await Promise.all(
          recipes.map(async (recipe) => ({
            ...recipe,
            image: await validateImageUrl(recipe.image, fallbackImage),
          }))
        );
        setValidatedRecipes(updatedRecipes);
      }
    };
    validateRecipes();
  }, [recipes]);

  if (!validatedRecipes || validatedRecipes.length === 0) {
    // todo: if searching, don't show anything
    // todo: if not searching and no recipes, then show no recipes found
    return <div></div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {validatedRecipes.map((recipe) => (
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
