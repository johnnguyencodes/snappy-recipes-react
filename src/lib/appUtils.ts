import { searchValidation, showError, clearErrorMessage } from "./formUtils";
import {
  appendImgurFormData,
  postImage,
  postImageUrlToGoogle,
  getRecipes,
} from "./apiUtils";
import { ChangeEvent } from "react";
import { IRecipe } from "types/AppTypes";
import commonIngredientsArray from "../data/commonIngredients.json";

const validateImageUrl = (url: string, fallback: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(url); // If the image loads, return the original url
    img.onerror = () => resolve(fallback); // If the image load fails, return the fallback URL
    img.src = url;
  });
};

const saveToLocalStorage = (key: string, value: string | object) => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.warn(`Unable to save to localStorage for key: ${key}`, error);
  }
};

const loadFromLocalStorage = (key: string) => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : null;
    }
  } catch (error) {
    console.warn(`Unable to access localStorage for key: ${key}`, error);
    return null;
  }
};

// search validator helper functions
// file search validator functions
const validateAndSetFile = (
  event: ChangeEvent<HTMLInputElement>,
  fileValidation: (
    event: ChangeEvent<HTMLInputElement>,
    showError: (
      errorType: string,
      setaErrorMessage: (message: string) => void,
      query: string | null
    ) => void,
    setImageFile: (file: File) => void,
    setErrorMessage: (message: string) => void,
    clearErrorMessage: (setErrorMessage: (message: string) => void) => void
  ) => boolean,
  setImageFile: React.Dispatch<React.SetStateAction<File | null>>,
  setSelectedImagePreviewUrl: React.Dispatch<
    React.SetStateAction<string | null>
  >,
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>,
  clearErrorMessage: (setErrorMessage: (message: string) => void) => void
): File | null => {
  let selectedFile: File | null = null;

  const isValid = fileValidation(
    event,
    showError,
    (file) => {
      setImageFile(file);
      setSelectedImagePreviewUrl(URL.createObjectURL(file));
      selectedFile = file;
    },
    setErrorMessage,
    clearErrorMessage
  );

  if (!isValid) {
    setSelectedImagePreviewUrl(null);
    return null;
  }

  return selectedFile;
};

const isDuplicateFile = (
  previousFile: File | null,
  currentFile: File | null
): boolean => {
  if (!previousFile || !currentFile) {
    return false;
  }

  return (
    previousFile &&
    currentFile &&
    previousFile.name === currentFile.name &&
    previousFile.size === currentFile.size &&
    previousFile.lastModified === currentFile.lastModified
  );
};

// text search validator function
const validateSearchInput = (
  query: string,
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>
): boolean => {
  return searchValidation(query, showError, setErrorMessage, clearErrorMessage);
};

// helper functions to prepare API calls
const uploadFileToImgur = async (
  selectedFile: File,
  imgurAccessToken: string,
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>
): Promise<string | null> => {
  const formData = appendImgurFormData(selectedFile);

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
    return null;
  }
};

const analyzeImage = async (
  imageURL: string,
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>
): Promise<string | null> => {
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

    return analyzeGoogleLabelAnnotations(labelAnnotations);
  } catch (error) {
    console.error("Error fetching data from Google Vision API:", error);
    return null;
  }
};

const analyzeGoogleLabelAnnotations = (labelAnnotations): string | null => {
  const [firstAnnotation] = labelAnnotations;
  // eslint-disable-next-line
  const { description: imageTitle, score: _score } = firstAnnotation;

  console.log(labelAnnotations);
  console.log(commonIngredientsArray);
  return "food";
};

// interface LabelAnnotation {
//   description: string;
//   score?: number;
// }

// interface ImageRecognitionResponse {
//   responses: {
//     labelAnnotations?: LabelAnnotation[];
//   }[];
// }

// const onImageRecognitionSuccess = (
//   data: ImageRecognitionResponse,
//   showError: (
//     errorType: string,
//     setErrorMessage: (message: string) => void,
//     query: string | null
//   ) => void,
//   setErrorMessage: (message: string) => void
// ) => {
//   const labelAnnotations = data.responses[0]?.labelAnnotations;
//   // if (!labelAnnotations) {
//   //   this.showRecognitionFailure();
//   //   return;
//   // }

//   if (!labelAnnotations || labelAnnotations.length === 0) {
//     showError("errorNoLabelAnnotions", setErrorMessage, null);
//     console.error("No label annotations found.");
//     return;
//   }

//   const [firstAnnotation] = labelAnnotations;
//   // Score will be a variable I will use in the future, ignoring for now
//   // @ts-ignore
//   const { description: imageTitle, score } = firstAnnotation;

//   // // Get recipes based on title
//   // getRecipes(imageTitle, showError, setErrorMessage);
// };

// const onImageRecognitionError = (error) => {
//   console.error("Image recognition error:", error);
//   // Add error UI handling here
// };

const callSpoonacularAPI = async (
  query: string,
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>,
  setStatusMessage: React.Dispatch<React.SetStateAction<string | null>>,
  setRecipeArray: React.Dispatch<React.SetStateAction<IRecipe[] | null>>,
  restrictionsArray: string[] | null,
  intolerancesArray: string[] | null
) => {
  const restrictionsString = (restrictionsArray ?? []).toString();
  const intolerancesString = (intolerancesArray ?? []).toString();
  try {
    setStatusMessage(
      query.length
        ? `searching for recipes that contain ${query}`
        : `searching for random recipes`
    );
    const spoonacularJson = await getRecipes(
      query,
      restrictionsString,
      intolerancesString,
      showError,
      setErrorMessage
    );
    if (spoonacularJson) {
      setRecipeArray(spoonacularJson.results);
      setStatusMessage(
        query.length
          ? spoonacularJson.totalResults > 100
            ? `Over 100 recipes with ${query}`
            : `${spoonacularJson.totalResults} recipes with ${query}`
          : spoonacularJson.totalResults > 100
            ? `Over 100 random recipes`
            : `${spoonacularJson.totalResults} random recipes`
      );
    }
  } catch (error) {
    setStatusMessage("");
    console.error("Error fetching data from Spoonacular API:", error);
  }
};

export {
  validateImageUrl,
  saveToLocalStorage,
  loadFromLocalStorage,
  validateAndSetFile,
  isDuplicateFile,
  validateSearchInput,
  uploadFileToImgur,
  analyzeImage,
  callSpoonacularAPI,
};
