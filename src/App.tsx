import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, ChangeEvent } from "react";

function App() {
  const [query, setQuery] = useState("");

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
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
        <Button onClick={() => console.log(query)}>Submit</Button>
      </div>
    </>
  );
}

export default App;
