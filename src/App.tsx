import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, ChangeEvent, KeyboardEvent } from "react";
import { Settings } from "lucide-react";

const spoonacularApiKey = import.meta.env.VITE_SPOONACULAR_API_KEY;
const SPOONACULAR_BASE_URL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${spoonacularApiKey}&addRecipeNutrition=true&size=636x393`;
const spoonacularFetchConfig = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

function App() {
  const [query, setQuery] = useState("");

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      getRecipes(query);
    }
  };

  const getRecipes = async (query: string) => {
    try {
      const response = await fetch(
        `${SPOONACULAR_BASE_URL}&number=100&query=${query}`,
        spoonacularFetchConfig
      );
      if (!response.ok) {
        throw new Error(`Error with get fetch request with query ${query}`);
      }
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error(`Error with fetching recipes with query ${query}`);
    }
  };

  return (
    <div className="m-10">
      <header className="row mb-0 flex items-center justify-between">
        <h1 className="mb-0 pb-0 text-2xl font-extrabold">Snappy Recipes</h1>
        <div className="flex">
          <Button className="border border-black bg-white font-bold text-black">
            Show Favorites
          </Button>
          <Button className="ml-2 border border-black bg-white font-bold text-black">
            <Settings className="h-4 w-4"></Settings>
          </Button>
        </div>
      </header>
      <div className="mt-3">
        <label htmlFor="input" className="text-sm font-semibold">
          Search Recipes
        </label>
        <div className="row flex">
          <Input
            id="input"
            placeholder="Drag an ingredient here or type to search"
            onChange={(event) => handleQueryChange(event)}
            onKeyDown={(event) => handleKeyDown(event)}
            className="rounded-br-none rounded-tr-none"
          />
          <Button
            onClick={() => getRecipes(query)}
            className="rounded-bl-none rounded-tl-none"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
