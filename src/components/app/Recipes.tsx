import { useState, useEffect } from "react";
import { IRecipe, IRecipesProps } from "../../../types/AppTypes";
import RecipeCard from "./RecipeCard";
import Modal from "./Modal";
import { validateImageUrl } from "@/lib/appUtils";
import { Button } from "../ui/button";
import { ExternalLink } from "lucide-react";
import DOMPurify from "dompurify";

const createMarkup = (html: string) => {
  return { __html: DOMPurify.sanitize(html) };
};

const Recipes: React.FC<IRecipesProps> = ({
  recipes,
  favoritesArray,
  toggleFavorite,
  isFavoritesVisible,
  isFetching,
  setIsFetching,
}) => {
  const [validatedRecipes, setValidatedRecipes] = useState<IRecipe[] | null>(
    null
  );
  const [selectedRecipe, setSelectedRecipe] = useState<IRecipe | null>(null);

  useEffect(() => {
    // Clear validated recipes when a new search starts
    setValidatedRecipes(null);

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
        setIsFetching(false);
      }
    };
    validateRecipes();
  }, [recipes]);

  const handleCardClick = (recipe: IRecipe) => {
    setSelectedRecipe(recipe);
  };

  const closeRecipeModal = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {isFavoritesVisible ? (
        !favoritesArray || favoritesArray.length === 0 ? (
          <div>
            <p>Your favorite recipes will appear here.</p>
          </div>
        ) : (
          favoritesArray.map((recipe) => (
            <RecipeCard
              recipe={recipe}
              id={recipe.id}
              key={recipe.id}
              image={recipe.image}
              title={recipe.title}
              readyInMinutes={recipe.readyInMinutes}
              servings={recipe.servings}
              nutrition={recipe.nutrition}
              sourceUrl={recipe.sourceUrl}
              diets={recipe.diets}
              summary={recipe.summary}
              onCardClick={() => handleCardClick(recipe)}
              favoritesArray={favoritesArray}
              toggleFavorite={toggleFavorite}
            />
          ))
        )
      ) : (!isFetching && !validatedRecipes) ||
        (!isFetching && validatedRecipes?.length === 0) ? (
        // todo: if searching, don't show anything
        // todo: if not searching and no recipes, then show no recipes found
        <div>
          <p>
            No recipes found. Try a different query, or use different filters in
            your settings.
          </p>
        </div>
      ) : (
        validatedRecipes?.map((recipe) => (
          <RecipeCard
            recipe={recipe}
            id={recipe.id}
            key={recipe.id}
            image={recipe.image}
            title={recipe.title}
            readyInMinutes={recipe.readyInMinutes}
            servings={recipe.servings}
            nutrition={recipe.nutrition}
            sourceUrl={recipe.sourceUrl}
            diets={recipe.diets}
            summary={recipe.summary}
            onCardClick={() => handleCardClick(recipe)}
            favoritesArray={favoritesArray}
            toggleFavorite={toggleFavorite}
          />
        ))
      )}
      {selectedRecipe && (
        <Modal
          isOpen={!!selectedRecipe}
          onClose={closeRecipeModal}
          title={selectedRecipe.title}
          description={`Ready in ${selectedRecipe.readyInMinutes} minutes. Serves ${selectedRecipe.servings}`}
        >
          <div>
            <img
              className="w-100 mx-auto mb-4"
              src={selectedRecipe.image}
              alt={selectedRecipe.title}
            />
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
            <Button
              onClick={(event) => {
                event.stopPropagation();
                toggleFavorite(selectedRecipe);
              }}
            >
              {favoritesArray.some(
                (favorite) => favorite.id === selectedRecipe.id
              )
                ? "Unfavorite"
                : "Favorite"}
            </Button>
            <Button
              onClick={closeRecipeModal}
              className="mt-4"
              data-testid="close-recipe-modal"
            >
              Close
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Recipes;
