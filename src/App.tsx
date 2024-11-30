import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef, ChangeEvent, KeyboardEvent } from "react";
import { Settings, Upload } from "lucide-react";
import Recipes from "@/components/app/Recipes";
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
import { IRecipe } from "../types/APIResponseTypes";
import Modal from "./components/app/Modal";

function App() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [imgurAccessToken, setImgurAccessToken] = useState("");
  const [previousFile, setPreviousFile] = useState<File | null>(null);
  const [_imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [recipeArray, setRecipeArray] = useState<IRecipe[] | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const fetchAccessToken = async () => {
      const token = await refreshAccessToken(showError, setErrorMessage);
      if (token) {
        setImgurAccessToken(token);
      }
    };
    fetchAccessToken();
  }, []);

  useEffect(() => {
    // Cleanup the preview URL when the component unmounts or the file changes
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl); // Free memory by revoking the URL
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    // Get random recipes on page load
    callSpoonacularAPI();
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
    setImageFile(null);
    setQuery("");
    setErrorMessage("");
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }

    let currentFile: File | null = null;
    const files = event.target.files;
    if (files && files.length > 0) {
      currentFile = files[0];

      // Check if the same file is selected
      if (
        previousFile &&
        currentFile &&
        currentFile.name === previousFile.name &&
        currentFile.size === previousFile.size &&
        currentFile.lastModified === previousFile.lastModified
      ) {
        console.warn("The same image file was selected again.");
        showError("errorSameImage", setErrorMessage, null);
        return;
      }

      // Update the previously selected file
      setPreviousFile(currentFile);

      let selectedFile: File | null = null;
      // Validate file input
      const isValid = fileValidation(
        event,
        showError,
        (currentFile) => {
          setImageFile(currentFile); // Update State
          setPreviewUrl(URL.createObjectURL(currentFile)); // Create a temporary URL for preview
          selectedFile = currentFile; // Immediate access to file
        },
        setErrorMessage,
        clearErrorMessage
      );
      if (isValid && selectedFile) {
        setRecipeArray(null);
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
            setStatusMessage("");
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
            setStatusMessage("");
            return;
          }

          const labelAnnotations = googleJson.responses[0]?.labelAnnotations;
          if (!labelAnnotations || labelAnnotations.length === 0) {
            showError("errorNoLabelAnnotations", setErrorMessage, null);
            throw new Error(
              "No label annotations found in Google API response"
            );
          }

          const [firstAnnotation] = labelAnnotations;
          // @ts-ignore
          const { description: imageTitle, score } = firstAnnotation;
          setQuery(imageTitle);
          callSpoonacularAPI();
        } catch (error) {
          setStatusMessage("");
          console.error("Unexpected error during API calls:", error);
        }
      } else {
        setStatusMessage("");
        setPreviewUrl(null); // Clear preview if validation fails
        console.error("No valid file selected");
      }
    }

    // Clear the file input's value to allow reselecting the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSearch = async (query: string) => {
    setImageFile(null);
    setErrorMessage("");
    setRecipeArray(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl); // Free memory by revoking the URL
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setPreviousFile(null);

    // Validate search input
    const isValid = searchValidation(
      query,
      showError,
      setErrorMessage,
      clearErrorMessage
    );
    if (isValid) {
      callSpoonacularAPI();
    } else {
      console.error("Not a valid search query");
      setStatusMessage("");
    }
  };

  const callSpoonacularAPI = async () => {
    try {
      setStatusMessage(`Searching for recipes with ${query}`);
      const spoonacularJson = await getRecipes(
        query,
        showError,
        setErrorMessage
      );
      if (spoonacularJson) {
        setRecipeArray(spoonacularJson.results);
      }
      setStatusMessage("");
    } catch (error) {
      setStatusMessage("");
      console.error("Error fetching data from Spoonacular API:", error);
    }
  };

  const closeModal = () => {
    setIsSettingsOpen(false);
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
            ref={searchInputRef}
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
        {previewUrl && (
          <div>
            <img
              src={previewUrl}
              alt="Selected image preview"
              width="200px"
              height="100%"
            />
          </div>
        )}
        <Recipes recipes={recipeArray} />
      </div>
      {isSettingsOpen && (
        <Modal
          isOpen={isSettingsOpen}
          onClose={closeModal}
          title="Settings"
          description="Modify your search."
        >
          <div></div>
        </Modal>
      )}
    </div>
  );
}

export default App;
