import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef, ChangeEvent, KeyboardEvent } from "react";
import { Settings, Upload } from "lucide-react";
import {
  fileValidation,
  searchValidation,
  showError,
  clearErrorMessage,
} from "./lib/formUtils";
import {
  refreshAccessToken,
  appendImgurFormData,
  postImage,
  postImageUrlToGoogle,
  getRecipes,
} from "./lib/apiUtils";

function App() {
  const [query, setQuery] = useState("");
  const [_imageFile, setImageFile] = useState<File | null>(null);
  const [imgurAccessToken, setImgurAccessToken] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchAccessToken = async () => {
      const token = await refreshAccessToken(showError, setErrorMessage);
      if (token) {
        setImgurAccessToken(token);
      }
    };
    fetchAccessToken();
  }, []);

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    setQuery(target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch(query);
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    let selectedFile: File | null = null;
    // Validate file input
    const isValid = fileValidation(
      event,
      showError,
      (file) => {
        setImageFile(file); // Update State
        selectedFile = file; // Immediate access to file
      },
      setErrorMessage,
      clearErrorMessage
    );
    if (isValid && selectedFile) {
      setStatusMessage("Analyzing image");
      // Prepare form data for Imgur upload
      const formData = appendImgurFormData(selectedFile); // Call the utility function to handle form data and image upload

      try {
        // Call the Imgur API
        let imgurJson;
        try {
          imgurJson = await postImage(
            formData,
            imgurAccessToken,
            showError,
            setErrorMessage
          );
        } catch (error) {
          console.error("Error uploading image to Imgur:", error);
          return;
        }

        const imageURL = imgurJson.data.link;

        // Call Google Vision API
        let googleJson;
        try {
          googleJson = await postImageUrlToGoogle(
            imageURL,
            showError,
            setErrorMessage
          );
        } catch (error) {
          console.error("Error fetching data from Google Vision API:", error);
          return;
        }

        const labelAnnotations = googleJson.responses[0]?.labelAnnotations;
        if (!labelAnnotations || labelAnnotations.length === 0) {
          showError("errorNoLabelAnnotations", setErrorMessage, null);
          throw new Error("No label annotations found in Google API response");
        }

        const [firstAnnotation] = labelAnnotations;
        // @ts-ignore
        const { description: imageTitle, score } = firstAnnotation;
        setQuery(imageTitle);

        // Call Spoonacular API
        try {
          setStatusMessage(`Searching for recipes with ${query}`);
          const spoonacularJson = await getRecipes(
            imageTitle,
            showError,
            setErrorMessage
          );
          console.log("Spoonacular API response:", spoonacularJson);
          setStatusMessage("");
        } catch (error) {
          console.error("Error fetching data from Spoonacular API:", error);
        }
      } catch (error) {
        console.error("Unexpected error during API calls:", error);
      }
    } else {
      console.error("No valid file selected");
    }
  };

  const handleSearch = async (query: string) => {
    // Validate search input
    const isValid = searchValidation(
      query,
      showError,
      setErrorMessage,
      clearErrorMessage
    );
    if (isValid) {
      // Call Spoonacular API
      try {
        setStatusMessage(`Searching for recipes with ${query}`);
        const spoonacularJson = await getRecipes(
          query,
          showError,
          setErrorMessage
        );
        setStatusMessage("");
        console.log("Spoonacular API response:", spoonacularJson);
      } catch (error) {
        console.error("Error fetching data from Spoonacular API:", error);
      }
    } else {
      console.error("Not a valid search query");
    }
  };

  return (
    <div className="m-10">
      <header className="row mb-0 flex items-center justify-between">
        <h1 className="mb-0 pb-0 text-2xl font-extrabold">Snappy Recipes</h1>
        {statusMessage && (
          <div className="error-message mb-4 rounded bg-green-100 p-2 text-green-600">
            {statusMessage}
          </div>
        )}
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
            onChange={handleFileChange}
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
            onClick={() => handleSearch(query)}
            className="rounded-bl-none rounded-tl-none"
          >
            Submit
          </Button>
        </div>
        {errorMessage && (
          <div className="error-message mb-4 rounded bg-red-100 p-2 text-red-600">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
