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
import {
  Droplets,
  Drumstick,
  Heart,
  Timer,
  Utensils,
  Bone,
  Calendar,
  MilkOff,
  Wheat,
  WheatOff,
  Fish,
  Leaf,
  Sliders,
  Beef,
  Sprout,
  Flame,
} from "lucide-react";

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

  const getDietIcon = (diet: string) => {
    const lowerDiet = diet.toLowerCase();

    switch (lowerDiet) {
      case "gluten free":
        return (
          <WheatOff className="mr-0.5 h-5 w-5 text-lightmode-orange dark:text-darkmode-orange" />
        );
      case "dairy free":
        return (
          <MilkOff className="mr-0.5 h-5 w-5 text-lightmode-dimmed3 dark:text-darkmode-dimmed3" />
        );
      case "paleolithic":
        return (
          <Bone className="mr-0.5 h-5 w-5 text-lightmode-dimmed3 dark:text-darkmode-dimmed3" />
        );
      case "lacto ovo vegetarian":
        return (
          <Sprout className="mr-0.5 h-5 w-5 text-lightmode-green dark:text-darkmode-green" />
        );
      case "primal":
        return (
          <Drumstick className="mr-0.5 h-5 w-5 text-lightmode-red dark:text-darkmode-red" />
        );
      case "vegan":
        return (
          <Leaf className="mr-0.5 h-5 w-5 text-lightmode-green dark:text-darkmode-green" />
        );
      case "pescatarian":
        return (
          <Fish className="mr-0.5 h-5 w-5 text-lightmode-blue dark:text-darkmode-blue" />
        );
      case "ketogenic":
        return (
          <Droplets className="mr-0.5 h-5 w-5 text-lightmode-yellow dark:text-darkmode-yellow" />
        );
      case "whole 30":
        return (
          <Calendar className="mr-0.5 h-5 w-5 text-lightmode-purple dark:text-darkmode-purple" />
        );
      case "fodmap friendly":
        return (
          <Sliders className="mr-0.5 h-5 w-5 text-lightmode-purple dark:text-darkmode-purple" />
        );
      default:
        // In case you get something unexpected
        return null;
    }
  };

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
          <p className="text-sm/6">
            <span className="mr-3">
              <Timer className="mr-1 inline-flex h-5 w-5 translate-y-[-2px] align-middle" />
              {readyInMinutes} minutes
            </span>
            <span>
              <Utensils className="mr-1 inline-flex h-5 w-5 translate-y-[-2px] items-center" />
              {servings} servings
            </span>
          </p>
        </div>
        <div className="mb-3">
          <h3 className="text-xl font-semibold">Dietary Information</h3>
          <p>
            {diets.map((diet: string) => {
              const icon = getDietIcon(diet);
              return (
                <span
                  key={diet}
                  className="mr-2 inline-flex items-center text-sm/6"
                >
                  {icon}
                  <span>{diet}</span>
                </span>
              );
            })}
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Macro-Nutrients</h3>
          <p className="flex flex-wrap gap-1 text-sm/6">
            <span className="mr-2">
              <Flame className="mr-0.5 inline-flex h-5 w-5 translate-y-[-1px] align-middle text-lightmode-red dark:text-darkmode-red" />{" "}
              {caloriesAmount} calories{" "}
            </span>
            <span className="mr-2">
              <Wheat className="mr-0.5 inline-flex h-5 w-5 translate-y-[-1px] align-middle text-lightmode-yellow dark:text-darkmode-yellow" />
              {carbsAmount}g carbs{" "}
            </span>
            <span className="mr-2">
              <Droplets className="mr-0.5 inline-flex h-5 w-5 translate-y-[-1px] align-middle text-lightmode-yellow dark:text-darkmode-yellow" />{" "}
              {fatAmount}g total fat{" "}
            </span>
            <span className="mr-2">
              <Beef className="mr-1 inline-flex h-5 w-5 translate-y-[-1px] align-middle text-lightmode-red dark:text-darkmode-red" />{" "}
              {proteinAmount}g protein{" "}
            </span>
          </p>
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default RecipeCard;
