import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, useRef, ChangeEvent, KeyboardEvent } from "react";
import { useForm } from "react-hook-form";
import { Settings, Upload } from "lucide-react";
import dotenv from "dotenv";

const SPOONACULAR_API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const ALBUM_ID = import.meta.env.VITE_IMGUR_ALBUM_ID;
const SPOONACULAR_BASE_URL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${SPOONACULAR_API_KEY}&addRecipeNutrition=true&size=636x393`;
const spoonacularFetchConfig = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

enum FileType {
  Jpeg = "image/jpeg",
  Png = "image/png",
  Gif = "image/gif",
}

function App() {
  const [query, setQuery] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { register } = useForm();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      getRecipes();
    }
  };

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getRecipes = async () => {
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

  const showError = (errorType: string) => {
    console.log("error:", errorType);
    // this.resetErrorMessages();
    // form.errorContainer.classList.remove("d-none");
    // form.errorContainer.classList.add("col-12", "mt-2w");
    // form[errorType].classList.remove("d-none");
    // form[errorType].classList.add("text-danger", "text-center");
    // form.fileInputForm.value = "";
    // this.disableInputs(false);
  };

  const fileValidation = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file: File = files[0];

      if (!file) {
        showError("errorNoFile");
        return;
      }

      if (!Object.values(FileType).includes(file.type as FileType)) {
        showError("errorIncorrectFile");
        return;
      }

      if (file.size > 10485760) {
        // 10MB limit
        showError("errorFileExceedsSize");
        return;
      }

      // disableInputs(true);
      // resetUIBeforeUpload();

      setImageFile(file);
      appendImgurFormData(file);
    }
  };

  const appendImgurFormData = (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("album", ALBUM_ID);
    formData.append("privacy", "public");
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
          <Button
            onClick={handleUploadButtonClick}
            className="rounded-br-none rounded-tr-none"
          >
            <Upload />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={fileValidation}
          />
          <Input
            id="input"
            placeholder="Search by entering your ingredient or upload an image"
            onChange={(event) => handleQueryChange(event)}
            onKeyDown={(event) => handleKeyDown(event)}
            className="rounded-br-none rounded-tr-none"
            name=""
          />
          <Button
            onClick={() => getRecipes()}
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
