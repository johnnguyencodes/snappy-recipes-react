import { useState, useEffect, useRef, ChangeEvent, KeyboardEvent } from "react";
import Form from "@/components/app/Form";
import Recipes from "@/components/app/Recipes";
import SettingsContent from "@/components/app/SettingsContent";
import { saveToLocalStorage, loadFromLocalStorage } from "@/lib/appUtils";
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
import { IRecipe } from "../types/AppTypes";
import Modal from "./components/app/Modal";

function App() {
  const [imgurAccessToken, setImgurAccessToken] = useState("");
  const [restrictionsArray, setRestrictionsArray] = useState<string[] | null>(
    loadFromLocalStorage("restrictionsArray") || []
  );
  const [intolerancesArray, setIntolerancesArray] = useState<string[] | null>(
    loadFromLocalStorage("intolerancesArray") || []
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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
    callSpoonacularAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const validateFile = ({
    file,
    previousFile,
    showError,
    setErrorMessage,
  }: {
    file: File;
    previousFile: File | null;
    showError: Function;
    setErrorMessage: Function;
  }): boolean => {
    if (
      previousFile &&
      file.name === previousFile.name &&
      file.size === previousFile.size &&
      file.lastModified === previousFile.lastModified
    ) {
      console.warn("The same image file was selected again.");
      showError("errorSameImage", setErrorMessage, null);
      return false;
    }
    return true;
  };

  const handleFileUpload = async ({
    file,
    imgurAccessToken,
    showError,
    setErrorMessage,
  }: {
    file: File;
    imgurAccessToken: string;
    showError: Function;
    setErrorMessage: Function;
  }) => {
    const formData = appendImgurFormData(file);

    try {
      const imgurJson = await postImage(
        formData,
        imgurAccessToken,
        showError,
        setErrorMessage
      );
      return imgurJson.data.link;
    } catch (error) {
      console.error("Error uploading image to Imgur:", error);
      throw error;
    }
  };

  const callGoogleVisionAPI = async ({
    imageURL,
    showError,
    setErrorMessage,
  }: {
    imageURL: string;
    showError: Function;
    setErrorMessage: Function;
  }) => {
    try {
      const googleJson = await postImageUrlToGoogle(
        imageURL,
        showError,
        setErrorMessage
      );
      const labelAnnotations = googleJson.responses[0]?.labelAnnotations;

      if (!labelAnnotations || labelAnnotations.length === 0) {
        showError("errorNoLabelAnnotations", setErrorMessage, null);
        throw new Error("No label annotations found in Google API response");
      }

      return labelAnnotations[0].description;
    } catch (error) {
      console.error("Error fetching data from Google Vision API:", error);
      throw error;
    }
  };

  const updatePreviewUrl = ({
    file,
    setSelectedImagePreviewUrl,
  }: {
    file: File;
    setSelectedImagePreviewUrl: Function;
  }) => {
    const previewUrl = URL.createObjectURL(file);
    setSelectedImagePreviewUrl(previewUrl);
    return previewUrl;
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setImageFile(null);
    setQuery("");
    setErrorMessage("");

    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }

    const files = event.target.files;
    if (!files || files.length === 0) {
      console.error("No file selected");
      return;
    }

    const file = files[0];

    const isValidFile = validateFile({
      file,
      previousFile,
      showError,
      setErrorMessage,
    });

    if (!isValidFile) return;

    setPreviousFile(file);

    updatePreviewUrl({
      file,
      setSelectedImagePreviewUrl,
    });

    try {
      const imageURL = await handleFileUpload({
        file,
        imgurAccessToken,
        showError,
        setErrorMessage,
      });

      const imageTitle = await callGoogleVisionAPI({
        imageURL,
        showError,
        setErrorMessage,
      });

      setQuery(imageTitle);
      callSpoonacularAPI();
    } catch (error) {
      setStatusMessage("");
      console.error("Unexpected error during API calls:", error);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
  //   setImageFile(null);
  //   setQuery("");
  //   setErrorMessage("");
  //   if (searchInputRef.current) {
  //     searchInputRef.current.value = "";
  //   }

  //   let currentFile: File | null = null;
  //   const files = event.target.files;
  //   if (files && files.length > 0) {
  //     currentFile = files[0];

  //     // Check if the same file is selected
  //     if (
  //       previousFile &&
  //       currentFile &&
  //       currentFile.name === previousFile.name &&
  //       currentFile.size === previousFile.size &&
  //       currentFile.lastModified === previousFile.lastModified
  //     ) {
  //       console.warn("The same image file was selected again.");
  //       showError("errorSameImage", setErrorMessage, null);
  //       return;
  //     }

  //     // Update the previously selected file
  //     setPreviousFile(currentFile);

  //     let selectedFile: File | null = null;
  //     // Validate file input
  //     const isValid = fileValidation(
  //       event,
  //       showError,
  //       (currentFile) => {
  //         setImageFile(currentFile); // Update State
  //         setSelectedImagePreviewUrl(URL.createObjectURL(currentFile)); // Create a temporary URL for preview
  //         selectedFile = currentFile; // Immediate access to file
  //       },
  //       setErrorMessage,
  //       clearErrorMessage
  //     );
  //     if (isValid && selectedFile) {
  //       setRecipeArray(null);
  //       setStatusMessage("Analyzing image");
  //       // Prepare form data for Imgur upload
  //       const formData = appendImgurFormData(selectedFile); // Call the utility function to handle form data and image upload

  //       try {
  //         // Call the Imgur API
  //         let imgurJson;
  //         try {
  //           imgurJson = await postImage(
  //             formData,
  //             imgurAccessToken,
  //             showError,
  //             setErrorMessage
  //           );
  //         } catch (error) {
  //           console.error("Error uploading image to Imgur:", error);
  //           setStatusMessage("");
  //           return;
  //         }

  //         const imageURL = imgurJson.data.link;

  //         // Call Google Vision API
  //         let googleJson;
  //         try {
  //           googleJson = await postImageUrlToGoogle(
  //             imageURL,
  //             showError,
  //             setErrorMessage
  //           );
  //         } catch (error) {
  //           console.error("Error fetching data from Google Vision API:", error);
  //           setStatusMessage("");
  //           return;
  //         }

  //         const labelAnnotations = googleJson.responses[0]?.labelAnnotations;
  //         if (!labelAnnotations || labelAnnotations.length === 0) {
  //           showError("errorNoLabelAnnotations", setErrorMessage, null);
  //           throw new Error(
  //             "No label annotations found in Google API response"
  //           );
  //         }

  //         const [firstAnnotation] = labelAnnotations;
  //         // eslint-disable-next-line
  //         const { description: imageTitle, score: _score } = firstAnnotation;
  //         setQuery(imageTitle);
  //         callSpoonacularAPI();
  //       } catch (error) {
  //         setStatusMessage("");
  //         console.error("Unexpected error during API calls:", error);
  //       }
  //     } else {
  //       setStatusMessage("");
  //       setSelectedImagePreviewUrl(null); // Clear preview if validation fails
  //       console.error("No valid file selected");
  //     }
  //   }

  //   // Clear the file input's value to allow reselecting the same file
  //   if (fileInputRef.current) {
  //     fileInputRef.current.value = "";
  //   }
  // };

  const handleSearch = async (query: string) => {
    setImageFile(null);
    setErrorMessage("");
    setRecipeArray(null);
    if (selectedImagePreviewUrl) {
      URL.revokeObjectURL(selectedImagePreviewUrl); // Free memory by revoking the URL
      setSelectedImagePreviewUrl(null);
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
    const restrictionsString = (restrictionsArray ?? []).toString();
    const intolerancesString = (intolerancesArray ?? []).toString();
    try {
      setStatusMessage(`Searching for recipes with ${query}`);
      const spoonacularJson = await getRecipes(
        query,
        restrictionsString,
        intolerancesString,
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

  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
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

  return (
    <div className="m-10">
      <Form
        query={query}
        errorMessage={errorMessage}
        selectedImagePreviewUrl={selectedImagePreviewUrl}
        statusMessage={statusMessage}
        handleQueryChange={handleQueryChange}
        handleKeyDown={handleKeyDown}
        handleUploadButtonClick={handleUploadButtonClick}
        handleFileChange={handleFileChange}
        handleSearch={handleSearch}
        handleSettingsClick={handleSettingsClick}
      />
      <Recipes
        favoritesArray={favoritesArray}
        toggleFavorite={toggleFavorite}
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
