import { IRecipe, IRecipeCardProps } from "../../../types/AppTypes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { Heart, Timer, Utensils } from "lucide-react";

const RecipeCard: React.FC<IRecipeCardProps> = ({
  recipe,
  id,
  image,
  title,
  readyInMinutes,
  servings,
  nutrition,
  sourceUrl,
  diets,
  summary,
  onCardClick,
  favoritesArray,
  toggleFavorite,
}) => {
  const caloriesAmount = Math.round(nutrition.nutrients[0].amount);
  const proteinAmount = Math.round(nutrition.nutrients[8].amount);
  const fatAmount = Math.round(nutrition.nutrients[1].amount);
  const carbsAmount = Math.round(nutrition.nutrients[3].amount);

  return (
    <Card
      id={`${id}`}
      data-testid={`recipe-card-${id}`}
      onClick={() =>
        onCardClick({
          id,
          image,
          title,
          readyInMinutes,
          servings,
          nutrition,
          sourceUrl,
          diets,
          summary,
        })
      }
      tabIndex={0}
    >
      <CardHeader className="image-container relative">
        <img
          className="mb-3 rounded-md"
          src={image}
          alt={title}
          onError={(error) => {
            (error.target as HTMLImageElement).src =
              "https://placehold.co/312x231";
          }}
        />
        <Button
          className="group absolute right-10 top-8 h-8 w-8 p-0"
          onClick={(event) => {
            event.stopPropagation();
            toggleFavorite(recipe);
          }}
          data-testid={`favorite-button-${id}`}
          variant="primary"
        >
          {favoritesArray.some((favorite: IRecipe) => favorite.id === id) ? (
            <Heart className="ring-offset ring-offset-10 h-4 w-4 fill-lightmode-background stroke-lightmode-background transition duration-300 focus:outline-none focus:ring-2 focus:ring-lightmode-red focus-visible:outline-none focus-visible:ring focus-visible:ring-lightmode-red dark:fill-darkmode-background dark:stroke-darkmode-background dark:ring-offset-transparent dark:focus:ring-darkmode-yellow dark:focus-visible:ring-darkmode-yellow" />
          ) : (
            <Heart className="ring-offset ring-offset-10 h-4 w-4 fill-lightmode-red stroke-lightmode-background transition duration-300 focus:outline-none focus:ring-2 focus:ring-lightmode-red focus-visible:outline-none focus-visible:ring focus-visible:ring-lightmode-red group-hover:fill-lightmode-purple dark:fill-darkmode-yellow dark:stroke-darkmode-background dark:ring-offset-transparent dark:focus:ring-darkmode-yellow dark:focus-visible:ring-darkmode-yellow dark:group-hover:fill-darkmode-green" />
          )}
        </Button>
        <CardTitle className="text-lightmode-red dark:text-darkmode-yellow">
          {title}
        </CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="text-lightmode-text dark:text-darkmode-text">
        <div className="mb-3">
          <h3 className="text-xl font-semibold">Cooking Details</h3>
          <p>
            <span className="mr-3">
              <Timer
                className="mr-1 inline-flex translate-y-[-1px] align-middle"
                size="18"
              />
              {readyInMinutes} minutes
            </span>
            <span>
              <Utensils
                className="mr-1 inline-flex translate-y-[-1px] align-middle"
                size="18"
              />
              {servings} servings
            </span>
          </p>
        </div>
        <div className="mb-3">
          <h3 className="text-xl font-semibold">Dietary Information</h3>
          <p>
            {diets.map((diet: string) => (
              <span key={diet}>{diet} </span>
            ))}
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Macro-Nutrient Values</h3>
          <p>
            <span>{caloriesAmount} calories </span>
            <span>{carbsAmount}g carbs </span>
            <span>{fatAmount}g total fat </span>
            <span>{proteinAmount}g protein </span>
          </p>
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default RecipeCard;
