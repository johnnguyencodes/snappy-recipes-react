import { IRecipe } from "../../../types/APIResponseTypes";
import { IRecipeModalProps } from "../../../types/APIResponseTypes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import Modal from "./Modal";

const RecipeCard: React.FC<IRecipeModalProps> = ({
  id,
  image,
  title,
  readyInMinutes,
  servings,
  nutrition,
  // sourceUrl,
  // analyzedInstructions,
  diets,
  // summary,
  setShowModal,
  showModal,
}) => {
  const caloriesAmount = Math.round(nutrition.nutrients[0].amount);
  const proteinAmount = Math.round(nutrition.nutrients[8].amount);
  const fatAmount = Math.round(nutrition.nutrients[1].amount);
  const carbsAmount = Math.round(nutrition.nutrients[3].amount);

  return (
    <>
      <Card id={id.toString()} onClick={() => setShowModal(true)}>
        <CardHeader className="image-container">
          <img
            src={image}
            alt={title}
            onError={(error) => {
              (error.target as HTMLImageElement).src =
                "https://placehold.co/312x231";
            }}
          />
          <CardTitle>{title}</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <p>{readyInMinutes} minutes</p>
          <p>{servings} servings</p>
          {diets.map((diet: string) => (
            <p key={diet}>{diet}</p>
          ))}
          <p>{caloriesAmount} calories</p>
          <p>{carbsAmount}g carbs</p>
          <p>{fatAmount}g total fat</p>
          <p>{proteinAmount}g protein</p>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
      {showModal ? (
        <Modal>
          <div>
            <h3>{title}</h3>
          </div>
        </Modal>
      ) : null}
    </>
  );
};

export default RecipeCard;
