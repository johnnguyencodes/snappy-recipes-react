import { useState, useEffect, useRef, ChangeEvent, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoonStar, Sun, ImageUp, Search, CircleAlert } from "lucide-react";
import Recipes from "@/components/app/Recipes";
import DropdownCheckboxMenu from "@/components/app/DropdownCheckboxMenu";
import {
  DietaryRestrictionDetails,
  FoodIntoleranceDetails,
} from "../types/AppTypes.tsx";

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
import DOMPurify from "dompurify";

const App = () => {
  const [imgurAccessToken, setImgurAccessToken] = useState("");
  const [restrictionsArray, setRestrictionsArray] = useState<string[] | null>(
    loadFromLocalStorage("restrictionsArray") || []
  );
  const [intolerancesArray, setIntolerancesArray] = useState<string[] | null>(
    loadFromLocalStorage("intolerancesArray") || []
  );
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
  const [isFetching, setIsFetching] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Load theme from localStorage or fallback to system preferences
    const savedTheme = loadFromLocalStorage("theme");
    if (savedTheme) return savedTheme === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Apply the current theme to the document
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    saveToLocalStorage("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    // refreching Imgur Access Token
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

  const isTest = process.env.NODE_ENV === "test";

  useEffect(() => {
    // Fetching random recipes on page load
    const getRandomRecipes = async () => {
      setIsFetching(true);
      try {
        await callSpoonacularAPI(
          "",
          setErrorMessage,
          setStatusMessage,
          setRecipeArray,
          restrictionsArray,
          intolerancesArray
        );
      } catch (error) {
        console.error("Error fetching random recipes:", error);
      } finally {
        // only calling the following setState in vitests to satisfy test requirements, this is not necessary in production
        if (isTest) {
          setIsFetching(false);
        }
      }
    };

    getRandomRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      const root = document.documentElement;
      if (newMode) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
      return newMode;
    });
  };

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

  const handleShowFavoritesClick = () => {
    setIsFavoritesVisible(!isFavoritesVisible);
  };

  const handleRestrictionClick = (restriction: string) => {
    const tempArray = [...(restrictionsArray || [])];
    const index = tempArray.indexOf(restriction.toLowerCase());
    if (index > -1) {
      tempArray.splice(index, 1);
    } else {
      tempArray.push(restriction.toLowerCase());
    }
    setRestrictionsArray(tempArray);
    saveToLocalStorage("restrictionsArray", tempArray);
  };

  const handleIntoleranceClick = (intolerance: string) => {
    const tempArray = [...(intolerancesArray || [])];
    const index = tempArray.indexOf(intolerance.toLowerCase());
    if (index > -1) {
      tempArray.splice(index, 1);
    } else {
      tempArray.push(intolerance.toLowerCase());
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
    setIsFetching(true);
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

    try {
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

        if (!selectedFile) {
          setIsFetching(false);
          return;
        }

        setStatusMessage("Analyzing image");

        const imageURL = await uploadFileToImgur(
          selectedFile,
          imgurAccessToken,
          setErrorMessage
        );
        if (!imageURL) {
          setStatusMessage("");
          setIsFetching(false);
          return;
        }

        const analyzedQuery = await analyzeImage(imageURL, setErrorMessage);
        if (!analyzedQuery) {
          setStatusMessage("");
          setIsFetching(false);
          return;
        }

        setQuery(analyzedQuery);
        await callSpoonacularAPI(
          analyzedQuery,
          setErrorMessage,
          setStatusMessage,
          setRecipeArray,
          restrictionsArray,
          intolerancesArray
        );
      }
    } catch (error) {
      console.error("Error handling file upload:", error);
    }
  };

  const handleSearch = async (query: string) => {
    setIsFetching(true);

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
      try {
        await callSpoonacularAPI(
          query,
          setErrorMessage,
          setStatusMessage,
          setRecipeArray,
          restrictionsArray,
          intolerancesArray
        );
      } catch (error) {
        console.error("Error in handleSearch:", error);
      }
    } else {
      setIsFetching(false);
      console.error("Not a valid search query:", query);
    }
  };

  return (
    <div className="flex items-center justify-center bg-lightmode-dark1 p-10 duration-300 dark:bg-darkmode-dark1">
      <div className="max-w-screen-3xl border-1 min-h-[calc(100svh-5rem)] w-full rounded-3xl border-lightmode-dimmed5 bg-lightmode-background p-4 text-lightmode-text shadow-lg duration-300 dark:border-darkmode-dark2 dark:bg-darkmode-background dark:text-darkmode-text">
        <div className="m-10">
          <div>
            <header className="mb-5 grid grid-cols-[2fr,3fr,2fr] items-start">
              <div className="flex-grow">
                <h1 className="mb-0 pb-0 text-3xl font-extrabold text-lightmode-red duration-300 dark:text-darkmode-yellow">
                  Snappy Recipes
                </h1>
              </div>
              <div className="flex">
                <div className="flex flex-1 flex-col justify-center space-y-2">
                  <div className="flex items-center">
                    <Input
                      type="text"
                      id="input"
                      ref={searchInputRef}
                      placeholder="Search by entering your ingredient or uploading an image"
                      onChange={(event) => handleQueryChange(event)}
                      onKeyDown={(event) => handleKeyDown(event)}
                      className="rounded-br-none rounded-tr-none"
                      name=""
                      data-testid="text-input"
                      disabled={isFetching}
                    />
                    <Button
                      onClick={() => handleSearch(query)}
                      className="rounded-bl-none rounded-tl-none"
                      data-testid="submit"
                      disabled={isFetching}
                      variant="primary"
                    >
                      <Search />
                    </Button>
                  </div>
                  <div className="row flex space-x-2">
                    <DropdownCheckboxMenu
                      keyword="restriction"
                      filterArray={
                        restrictionsArray
                          ? restrictionsArray.map((value) => ({ value }))
                          : []
                      }
                      handleFilterClick={handleRestrictionClick}
                      filterDetails={DietaryRestrictionDetails}
                      disabled={isFetching}
                      dataTestid="dropdownRestrictions"
                    />
                    <DropdownCheckboxMenu
                      keyword="intolerance"
                      filterArray={
                        intolerancesArray
                          ? intolerancesArray.map((value) => ({ value }))
                          : []
                      }
                      handleFilterClick={handleIntoleranceClick}
                      filterDetails={FoodIntoleranceDetails}
                      disabled={isFetching}
                      dataTestid="dropdownIntolerances"
                    />
                  </div>
                </div>
                {selectedImagePreviewUrl ? (
                  <Button
                    onClick={handleUploadButtonClick}
                    className={`border-1 relative ml-2 h-auto w-[100px] rounded-md border border-lightmode-dimmed5 bg-cover bg-center object-cover duration-300 dark:border-darkmode-dark2`}
                    style={{
                      backgroundImage: `url(${selectedImagePreviewUrl})`,
                    }}
                    aria-label="Uploaded image preview button"
                    data-testid="upload-button"
                    disabled={isFetching}
                    variant="primary"
                  >
                    <span className="sr-only">Upload image</span>
                    <div className="absolute right-0 top-0 rounded bg-lightmode-red text-lightmode-background dark:bg-darkmode-yellow dark:text-darkmode-background">
                      <ImageUp className="p-0.5" />
                    </div>
                  </Button>
                ) : (
                  <Button
                    onClick={handleUploadButtonClick}
                    className="border-1 ml-2 h-auto w-[100px] rounded-md border border-lightmode-dimmed5 object-cover duration-300 dark:border-darkmode-dark2"
                    aria-label="Uploaad button"
                    data-testid="upload-button"
                    disabled={isFetching}
                    variant="primary"
                  >
                    <ImageUp />
                  </Button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  data-testid="file-input"
                  disabled={isFetching}
                />
              </div>
              <div className="flex flex-grow justify-end">
                <Button
                  className=""
                  onClick={handleShowFavoritesClick}
                  data-testid="openFavorites"
                  disabled={isFetching}
                  variant="default"
                >
                  {isFavoritesVisible ? "Hide Favorites" : "Show Favorites"}
                </Button>
                <Button
                  onClick={toggleDarkMode}
                  className="ml-2"
                  data-testid="themeToggle"
                  disabled={isFetching}
                  variant="default"
                >
                  {isDarkMode ? (
                    <Sun className="h-4 w-4"></Sun>
                  ) : (
                    <MoonStar className="h-4 w-4"></MoonStar>
                  )}
                </Button>
              </div>
            </header>
            <div className="row mb-5 flex items-center">
              <div>
                {statusMessage && (
                  <div className="rounded-md bg-lightmode-purple p-2 text-lightmode-background duration-300 dark:bg-darkmode-green dark:text-darkmode-background">
                    {statusMessage}
                  </div>
                )}
              </div>
            </div>
            {errorMessage && (
              <div className="row mx-auto mb-5 flex w-fit items-center justify-center rounded-md bg-red-100 p-2 text-red-600 duration-300">
                <span className="mr-2">
                  <CircleAlert />
                </span>
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(errorMessage || ""),
                  }}
                ></div>
              </div>
            )}
          </div>
          <Recipes
            favoritesArray={favoritesArray}
            toggleFavorite={toggleFavorite}
            isFavoritesVisible={isFavoritesVisible}
            recipes={recipeArray}
            isFetching={isFetching}
            setIsFetching={setIsFetching}
            errorMessage={errorMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
