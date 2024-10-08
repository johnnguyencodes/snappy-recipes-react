import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, ChangeEvent } from "react";

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
    <>
      <h1>Recipe Search</h1>
      <div>
        <Input
          id="input"
          placeholder="placeholder"
          onChange={(event) => handleQueryChange(event)}
        />
        <Button onClick={() => getRecipes(query)}>Submit</Button>
      </div>
    </>
  );
}

export default App;
