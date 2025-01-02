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
    >
      <CardHeader className="image-container">
        <img
          className="mb-3 rounded-md"
          src={image}
          alt={title}
          onError={(error) => {
            (error.target as HTMLImageElement).src =
              "https://placehold.co/312x231";
          }}
        />
        <CardTitle className="text-lightmode-red dark:text-darkmode-yellow">
          {title}
        </CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="text-lightmode-text dark:text-darkmode-text">
        <h3>Cooking Details</h3>
        <p>
          <span>{readyInMinutes} minutes </span>
          <span>{servings} servings </span>
        </p>
        <h3>Dietary Information</h3>
        <p>
          {diets.map((diet: string) => (
            <span key={diet}>{diet} </span>
          ))}
        </p>
        <h3>Macro-Nutrient Values</h3>
        <p>
          <span>{caloriesAmount} calories </span>
          <span>{carbsAmount}g carbs </span>
          <span>{fatAmount}g total fat </span>
          <span>{proteinAmount}g protein </span>
        </p>
        <Button
          onClick={(event) => {
            event.stopPropagation();
            toggleFavorite(recipe);
          }}
          data-testid={`favorite-button-${id}`}
        >
          {favoritesArray.some((favorite: IRecipe) => favorite.id === id)
            ? "Unfavorite"
            : "Favorite"}
        </Button>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default RecipeCard;
