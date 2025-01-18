import { useState, useEffect } from "react";
import { IRecipe, IRecipesProps } from "../../../types/AppTypes";
import RecipeCard from "./RecipeCard";
import Modal from "./Modal";
import { validateImageUrl } from "@/lib/appUtils";
import { Button } from "../ui/button";
import { ExternalLink, Heart } from "lucide-react";
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
  errorMessage,
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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {isFavoritesVisible ? (
        !favoritesArray || favoritesArray.length === 0 ? (
          <div>
            <h2>Favorite recipes</h2>
            <div>
              <p>Your favorite recipes will appear here.</p>
            </div>
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
      ) : (!isFetching && !validatedRecipes && !errorMessage) ||
        (!isFetching && validatedRecipes?.length === 0 && !errorMessage) ? (
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
              className="w-100 mx-auto mb-4 h-full w-full rounded-md"
              src={selectedRecipe.image}
              alt={selectedRecipe.title}
            />
            <div className="align-center mt-5 flex justify-between">
              <Button asChild className="mb-4" variant="default">
                <a
                  href={selectedRecipe.sourceUrl}
                  className="flex items-center space-x-1 text-lightmode-text underline hover:text-lightmode-text dark:text-darkmode-text dark:hover:text-darkmode-text"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Full Recipe
                  <ExternalLink className="ml-1 h-5 w-5" />
                </a>
              </Button>
              <Button
                onClick={(event) => {
                  event.stopPropagation();
                  toggleFavorite(selectedRecipe);
                }}
                variant="primary"
              >
                {favoritesArray.some(
                  (favorite: IRecipe) => favorite.id === selectedRecipe.id
                ) ? (
                  <Heart className="ring-offset ring-offset-10 h-4 w-4 fill-lightmode-background stroke-lightmode-background transition duration-300 focus:outline-none focus:ring-2 focus:ring-lightmode-red focus-visible:outline-none focus-visible:ring focus-visible:ring-lightmode-red dark:fill-darkmode-background dark:stroke-darkmode-background dark:ring-offset-transparent dark:focus:ring-darkmode-yellow dark:focus-visible:ring-darkmode-yellow" />
                ) : (
                  <Heart className="ring-offset ring-offset-10 h-4 w-4 fill-lightmode-red stroke-lightmode-background transition duration-300 focus:outline-none focus:ring-2 focus:ring-lightmode-red focus-visible:outline-none focus-visible:ring focus-visible:ring-lightmode-red group-hover:fill-lightmode-purple dark:fill-darkmode-yellow dark:stroke-darkmode-background dark:ring-offset-transparent dark:focus:ring-darkmode-yellow dark:focus-visible:ring-darkmode-yellow dark:group-hover:fill-darkmode-green" />
                )}
              </Button>
            </div>
            <p
              className="recipe-summary mb-4"
              dangerouslySetInnerHTML={createMarkup(selectedRecipe.summary)}
            ></p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Recipes;
