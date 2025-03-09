import { useState, useEffect, useRef, ChangeEvent, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MoonStar,
  Sun,
  ImageUp,
  Search,
  CircleAlert,
  Heart,
  Info,
} from "lucide-react";
import Recipes from "@/components/app/Recipes";
import DropdownCheckboxMenu from "@/components/app/DropdownCheckboxMenu";
import {
  DietaryRestrictionDetails,
  FoodIntoleranceDetails,
} from "../types/AppTypes";
import appleImage from "@/tests/fixtures/RedApple.jpg";
import bananaImage from "@/tests/fixtures/CavendishBanana.jpg";

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

  const uploadPreselectedImage = async (preselectedImageFile: string) => {
    try {
      const response = await fetch(preselectedImageFile);
      const blob = await response.blob();

      // Create a File object
      const file = new File([blob], "preselectedImage.jpg", {
        type: blob.type,
      });

      // Creata a synthetic FileList
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const fileList = dataTransfer.files;

      // Create a synthetic event to pass into handleFileChange
      const syntheticEvent = {
        target: { files: fileList },
      } as ChangeEvent<HTMLInputElement>;

      // Call handleFileChange with the synthetic event
      handleFileChange(syntheticEvent);
    } catch (error) {
      console.error("Error fetching the preselected image:", error);
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
    <div className="flex min-h-screen items-center justify-center bg-lightmode-dark1 p-0 duration-300 dark:bg-darkmode-dark1 sm:p-6 md:p-7 lg:p-8 xl:p-10">
      <div className="border-1 w-full max-w-[1540px] rounded-none border-lightmode-dimmed5 bg-lightmode-background text-lightmode-text shadow-lg duration-300 dark:border-darkmode-dark2 dark:bg-darkmode-background dark:text-darkmode-text xs:min-h-screen sm:min-h-[calc(100svh-5rem)] sm:rounded-3xl">
        <div className="m-4 sm:m-6 md:m-7 lg:m-8 xl:m-10">
          <div>
            <header className="mb-5 grid grid-cols-[1fr,3fr] items-start lg:grid-cols-[3fr,4fr,3fr]">
              <div className="my-auto flex-grow">
                <h1 className="px-1 py-0 text-[clamp(1.125rem,5vw,1.875rem)] font-extrabold text-lightmode-red duration-300 dark:text-darkmode-yellow">
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
                      placeholder="Search by ingredient or upload/snap a photo."
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
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      {selectedImagePreviewUrl ? (
                        <Button
                          onClick={handleUploadButtonClick}
                          className="border-1 relative ml-2 h-full rounded-md border border-lightmode-dimmed5 bg-cover bg-center object-cover duration-300 dark:border-darkmode-dark2 xs:w-full xs:max-w-[100px] sm:w-[100px]"
                          style={{
                            backgroundImage: `url(${selectedImagePreviewUrl})`,
                          }}
                          aria-label="Uploaded image preview button"
                          data-testid="upload-button"
                          disabled={isFetching}
                          variant="primary"
                        >
                          <span className="sr-only">Upload image</span>
                          <div className="absolute right-0 top-0 rounded bg-lightmode-red text-lightmode-background transition duration-300 dark:bg-darkmode-yellow dark:text-darkmode-background">
                            <ImageUp className="p-0.5" />
                          </div>
                        </Button>
                      ) : (
                        <Button
                          onClick={handleUploadButtonClick}
                          className="border-1 relative ml-2 h-full rounded-md border border-lightmode-dimmed5 bg-cover bg-center object-cover duration-300 dark:border-darkmode-dark2 xs:w-full xs:max-w-[100px] sm:w-[100px]"
                          aria-label="Image upload button"
                          data-testid="upload-button"
                          disabled={isFetching}
                          variant="primary"
                        >
                          <ImageUp />
                        </Button>
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        For best results, take or upload a clear, focused photo
                        of a single food item.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  data-testid="file-input"
                  disabled={isFetching}
                />
                <div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          onClick={() => uploadPreselectedImage(appleImage)}
                          className="mb-2 ml-2 h-10 w-10 border border-lightmode-dimmed3 bg-white bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${appleImage})`,
                          }}
                          data-testid="themeToggle"
                          disabled={isFetching}
                          variant="default"
                        >
                          <input
                            type="file"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                            data-testid="file-input"
                            disabled={isFetching}
                          />
                          <div className="absolute right-0 top-0 rounded bg-lightmode-red text-lightmode-background transition duration-300 dark:bg-darkmode-yellow dark:text-darkmode-background">
                            <Info className="h-3.5 w-3.5 p-0" />
                          </div>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Click to upload this image to search for recipes.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          onClick={() => uploadPreselectedImage(bananaImage)}
                          className="ml-2 h-10 w-10 border border-lightmode-dimmed3 bg-cover bg-center bg-no-repeat"
                          style={{
                            backgroundImage: `url(${bananaImage})`,
                          }}
                          data-testid="themeToggle"
                          disabled={isFetching}
                          variant="default"
                        >
                          <input
                            type="file"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                            data-testid="file-input"
                            disabled={isFetching}
                          />
                          <div className="absolute right-0 top-0 rounded bg-lightmode-red text-lightmode-background transition duration-300 dark:bg-darkmode-yellow dark:text-darkmode-background">
                            <Info className="h-3.5 w-3.5 p-0" />
                          </div>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Click to upload this image to search for recipes.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <div className="hidden flex-grow justify-end lg:flex">
                <Button
                  className="group"
                  onClick={handleShowFavoritesClick}
                  data-testid="desktopToggleFavorites"
                  disabled={isFetching}
                  variant="default"
                >
                  {isFavoritesVisible ? (
                    <Heart className="ring-offset ring-offset-10 h-4 w-4 fill-lightmode-text stroke-lightmode-text transition duration-300 hover:fill-lightmode-dimmed3/80 focus:outline-none focus:ring-2 focus:ring-lightmode-red focus-visible:outline-none focus-visible:ring focus-visible:ring-lightmode-red dark:fill-darkmode-text dark:stroke-darkmode-text dark:ring-offset-transparent dark:hover:bg-lightmode-dimmed4/80 dark:focus:ring-darkmode-yellow dark:focus-visible:ring-darkmode-yellow" />
                  ) : (
                    <Heart className="ring-offset ring-offset-10 h-4 w-4 stroke-lightmode-text transition duration-300 focus:outline-none focus:ring-2 focus:ring-lightmode-red focus-visible:outline-none focus-visible:ring focus-visible:ring-lightmode-red dark:stroke-darkmode-text dark:ring-offset-transparent dark:focus:ring-darkmode-yellow dark:focus-visible:ring-darkmode-yellow" />
                  )}
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
            <div className="row mb-5 flex content-between items-center">
              <div>
                {!isFavoritesVisible && statusMessage && (
                  <div className="rounded-md bg-lightmode-purple p-2 text-lightmode-background duration-300 dark:bg-darkmode-green dark:text-darkmode-background">
                    {statusMessage}
                  </div>
                )}
                {isFavoritesVisible && (
                  <div className="rounded-md bg-lightmode-purple p-2 text-lightmode-background duration-300 dark:bg-darkmode-green dark:text-darkmode-background">
                    Displaying {favoritesArray.length} favorite{" "}
                    {favoritesArray.length === 1 ? "recipe" : "recipes"}
                  </div>
                )}
              </div>
              <div className="flex flex-grow justify-end lg:hidden">
                <Button
                  className=""
                  onClick={handleShowFavoritesClick}
                  data-testid="mobileToggleFavorites"
                  disabled={isFetching}
                  variant="default"
                >
                  {isFavoritesVisible ? (
                    <Heart className="ring-offset ring-offset-10 h-4 w-4 fill-lightmode-text stroke-lightmode-text transition duration-300 hover:fill-lightmode-dimmed3/80 focus:outline-none focus:ring-2 focus:ring-lightmode-red focus-visible:outline-none focus-visible:ring focus-visible:ring-lightmode-red dark:fill-darkmode-text dark:stroke-darkmode-text dark:ring-offset-transparent dark:hover:bg-lightmode-dimmed4/80 dark:focus:ring-darkmode-yellow dark:focus-visible:ring-darkmode-yellow" />
                  ) : (
                    <Heart className="ring-offset ring-offset-10 h-4 w-4 stroke-lightmode-text transition duration-300 focus:outline-none focus:ring-2 focus:ring-lightmode-red focus-visible:outline-none focus-visible:ring focus-visible:ring-lightmode-red dark:stroke-darkmode-text dark:ring-offset-transparent dark:focus:ring-darkmode-yellow dark:focus-visible:ring-darkmode-yellow" />
                  )}
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
