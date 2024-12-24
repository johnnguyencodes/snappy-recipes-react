import { useState, useEffect, useRef, ChangeEvent, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings } from "lucide-react";
import Recipes from "@/components/app/Recipes";
import SettingsContent from "@/components/app/SettingsContent";

import {
  saveToLocalStorage,
  loadFromLocalStorage,
  validateAndSetFile,
  isDuplicateFile,
  validateSearchInput,
  uploadFileToImgur,
  analyzeImage,
  callSpoonacularAPI,
} from "@/lib/appUtils";
import { fileValidation, showError, clearErrorMessage } from "./lib/formUtils";
import { refreshAccessToken } from "./lib/apiUtils";
import { IRecipe } from "../types/AppTypes";
import Modal from "./components/app/Modal";
import DOMPurify from "dompurify";

function App() {
  const [imgurAccessToken, setImgurAccessToken] = useState("");
  const [restrictionsArray, setRestrictionsArray] = useState<string[] | null>(
    loadFromLocalStorage("restrictionsArray") || []
  );
  const [intolerancesArray, setIntolerancesArray] = useState<string[] | null>(
    loadFromLocalStorage("intolerancesArray") || []
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFavoritesVisible, setIsFavoritesVisible] = useState(false);
  const [previousFile, setPreviousFile] = useState<File | null>(null);
  const [, setImageFile] = useState<File | null>(null);
  const [query, setQuery] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recipeArray, setRecipeArray] = useState<IRecipe[] | null>(null);
  const [favoritesArray, setFavoritesArray] = useState<IRecipe[]>(
    loadFromLocalStorage("favoritesArray") || []
  );
  const [selectedImagePreviewUrl, setSelectedImagePreviewUrl] = useState<
    string | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

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
      if (selectedImagePreviewUrl) {
        URL.revokeObjectURL(selectedImagePreviewUrl); // Free memory by revoking the URL
      }
    };
  }, [selectedImagePreviewUrl]);

  useEffect(() => {
    // Get random recipes on page load
    callSpoonacularAPI(
      "",
      setErrorMessage,
      setStatusMessage,
      setRecipeArray,
      restrictionsArray,
      intolerancesArray
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // app UI handler functions
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

  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
  };

  const handleShowFavoritesClick = () => {
    setIsFavoritesVisible(!isFavoritesVisible);
  };

  const closeSettingsModal = () => {
    setIsSettingsOpen(false);
  };

  const handleRestrictionClick = (restriction: string) => {
    const tempArray = [...(restrictionsArray || [])];
    const index = tempArray.indexOf(restriction);
    if (index > -1) {
      tempArray.splice(index, 1);
    } else {
      tempArray.push(restriction);
    }
    setRestrictionsArray(tempArray);
    saveToLocalStorage("restrictionsArray", tempArray);
  };

  const handleIntoleranceClick = (intolerance: string) => {
    const tempArray = [...(intolerancesArray || [])];
    const index = tempArray.indexOf(intolerance);
    if (index > -1) {
      tempArray.splice(index, 1);
    } else {
      tempArray.push(intolerance);
    }
    setIntolerancesArray(tempArray);
    saveToLocalStorage("intolerancesArray", tempArray);
  };

  const toggleFavorite = (recipe: IRecipe) => {
    const isAlreadyFavorite = favoritesArray.some(
      (favorite) => favorite.id === recipe.id
    );

    let updatedFavorites;
    if (isAlreadyFavorite) {
      // Remove from favorites
      updatedFavorites = favoritesArray.filter(
        (favorite) => favorite.id !== recipe.id
      );
    } else {
      // Add to favorites
      updatedFavorites = [...favoritesArray, recipe];
    }
    setFavoritesArray(updatedFavorites);
    saveToLocalStorage("favoritesArray", updatedFavorites);
  };

  // helper functions for image and text search flows
  const resetStateAndInputs = (
    setRecipeArray: React.Dispatch<React.SetStateAction<IRecipe[] | null>>,
    setStatusMessage: React.Dispatch<React.SetStateAction<string | null>>,
    setImageFile: React.Dispatch<React.SetStateAction<File | null>>,
    setQuery: React.Dispatch<React.SetStateAction<string>>,
    setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>,
    searchInputRef: React.RefObject<HTMLInputElement>,
    setSelectedImagePreviewUrl?: React.Dispatch<
      React.SetStateAction<string | null>
    >,
    setPreviousFile?: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    setRecipeArray(null);
    setStatusMessage("");
    setImageFile(null);
    setQuery("");
    setErrorMessage("");
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
    if (setSelectedImagePreviewUrl) {
      setSelectedImagePreviewUrl(null);
    }
    if (setPreviousFile) {
      setPreviousFile(null);
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    resetStateAndInputs(
      setRecipeArray,
      setStatusMessage,
      setImageFile,
      setQuery,
      setErrorMessage,
      searchInputRef
    );

    let currentFile: File | null = null;
    const files = event.target.files;

    if (files && files.length > 0) {
      currentFile = files[0];

      if (isDuplicateFile(previousFile, currentFile)) {
        console.warn("The same image file was selected again.");
        showError("errorSameImage", setErrorMessage, null);
        return;
      }

      setPreviousFile(currentFile);

      const selectedFile = validateAndSetFile(
        event,
        fileValidation,
        setImageFile,
        setSelectedImagePreviewUrl,
        setErrorMessage,
        clearErrorMessage
      );

      if (!selectedFile) return;

      setStatusMessage("Analyzing image");

      const imageURL = await uploadFileToImgur(
        selectedFile,
        imgurAccessToken,
        setErrorMessage
      );
      if (!imageURL) {
        setStatusMessage("");
        return;
      }

      const analyzedQuery = await analyzeImage(imageURL, setErrorMessage);
      if (!analyzedQuery) {
        setStatusMessage("");
        return;
      }

      setQuery(analyzedQuery);
      callSpoonacularAPI(
        analyzedQuery,
        setErrorMessage,
        setStatusMessage,
        setRecipeArray,
        restrictionsArray,
        intolerancesArray
      );
    }
  };

  const handleSearch = async (query: string) => {
    resetStateAndInputs(
      setRecipeArray,
      setStatusMessage,
      setImageFile,
      setQuery,
      setErrorMessage,
      searchInputRef,
      setSelectedImagePreviewUrl,
      setPreviousFile
    );

    setPreviousFile(null);

    // Validate search input
    if (validateSearchInput(query, setErrorMessage)) {
      callSpoonacularAPI(
        query,
        setErrorMessage,
        setStatusMessage,
        setRecipeArray,
        restrictionsArray,
        intolerancesArray
      );
    } else {
      console.error("Not a valid search query:", query);
    }
  };

  return (
    <div className="m-10">
      <div>
        <header className="row mb-0 flex items-center justify-between">
          <h1 className="mb-0 pb-0 text-2xl font-extrabold">Snappy Recipes</h1>
          {statusMessage && (
            <div className="mb-4 rounded bg-green-100 p-2 text-green-600">
              {statusMessage}
            </div>
          )}
          <div className="flex">
            <Button
              className="border border-black bg-white font-bold text-black"
              onClick={handleShowFavoritesClick}
              data-testid="openFavorites"
            >
              Show Favorites
            </Button>
            <Button
              onClick={handleSettingsClick}
              className="ml-2 border border-black bg-white font-bold text-black"
              data-testid="openSettings"
            >
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
              data-testid="upload-button"
            >
              Upload
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
              data-testid="file-input"
            />
            <Input
              id="input"
              ref={searchInputRef}
              placeholder="Search by entering your ingredient or upload an image"
              onChange={(event) => handleQueryChange(event)}
              onKeyDown={(event) => handleKeyDown(event)}
              className="rounded-br-none rounded-tr-none"
              name=""
              data-testid="text-input"
            />
            <Button
              onClick={() => handleSearch(query)}
              className="rounded-bl-none rounded-tl-none"
              data-testid="submit"
            >
              Submit
            </Button>
          </div>
          {errorMessage && (
            <div
              className="mb-4 rounded bg-red-100 p-2 text-red-600"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(errorMessage),
              }}
            ></div>
          )}
          {selectedImagePreviewUrl && (
            <div>
              <img
                src={selectedImagePreviewUrl}
                alt="recipe preview"
                width="200px"
                height="100%"
              />
            </div>
          )}
        </div>
      </div>
      <Recipes
        favoritesArray={favoritesArray}
        toggleFavorite={toggleFavorite}
        isFavoritesVisible={isFavoritesVisible}
        recipes={recipeArray}
      />
      {isSettingsOpen && (
        <Modal
          isOpen={isSettingsOpen}
          onClose={closeSettingsModal}
          title="Settings"
          description="Modify your recipe search by selecting the options below."
        >
          <SettingsContent
            restrictionsArray={restrictionsArray}
            intolerancesArray={intolerancesArray}
            handleRestrictionClick={handleRestrictionClick}
            handleIntoleranceClick={handleIntoleranceClick}
          />
        </Modal>
      )}
    </div>
  );
}

export default App;
