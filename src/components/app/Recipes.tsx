import { useState, useEffect } from "react";
import { IRecipe } from "../../../types/APIResponseTypes";
import RecipeCard from "./RecipeCard";
import Modal from "./Modal";
import { validateImageUrl } from "@/lib/appUtils";
import { Button } from "../ui/button";
import { ExternalLink } from "lucide-react";
import DOMPurify from "dompurify";

const createMarkup = (html: string) => {
  return { __html: DOMPurify.sanitize(html) };
};

const Recipes: React.FC<{
  recipes: IRecipe[] | null;
}> = ({ recipes }) => {
  const [validatedRecipes, setValidatedRecipes] = useState<IRecipe[] | null>(
    null
  );
  const [selectedRecipe, setSelectedRecipe] = useState<IRecipe | null>(null);

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

  const handleCardClick = (recipe: IRecipe) => {
    setSelectedRecipe(recipe);
  };

  const closeModal = () => {
    setSelectedRecipe(null);
  };

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
          onCardClick={() => handleCardClick(recipe)}
        />
      ))}
      {selectedRecipe && (
        <Modal
          isOpen={!!selectedRecipe}
          onClose={closeModal}
          title={selectedRecipe.title}
          image={selectedRecipe.image}
          description={`Ready in ${selectedRecipe.readyInMinutes} minutes. Serves ${selectedRecipe.servings}`}
        >
          <div>
            <Button className="mb-4">
              <a
                href={selectedRecipe.sourceUrl}
                className="flex items-center space-x-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Recipe Page</span>
                <ExternalLink />
              </a>
            </Button>
            <p>
              <strong>Summary:</strong>
            </p>
            <p
              className="mb-4"
              dangerouslySetInnerHTML={createMarkup(selectedRecipe.summary)}
            ></p>
            <div>
              <p>
                <strong>Ingredients</strong>
              </p>
              <ul className="mb-1">
                {selectedRecipe.nutrition.ingredients.map((ingredient) => (
                  <li key={ingredient.id}>
                    {ingredient.amount} {ingredient.unit} {ingredient.name}
                  </li>
                ))}
              </ul>
            </div>
            <Button onClick={closeModal} className="mt-4">
              Close
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Recipes;
