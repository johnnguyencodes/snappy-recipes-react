import { ChangeEvent } from "react";

enum FileType {
  Jpeg = "image/jpeg",
  Jpg = "image/jpg",
  Png = "image/png",
  Gif = "image/gif",
}

const MAX_FILE_SIZE = 10485760; // 10MB

const fileValidation = (
  event: ChangeEvent<HTMLInputElement>,
  showError: (
    errorType: string,
    setErrorMessage: (message: string) => void,
    query: string | null
  ) => void,
  setImageFile: (file: File) => void,
  setErrorMessage: (message: string) => void,
  clearErrorMessage: (setErrorMessage: (message: string) => void) => void
): boolean => {
  const files = event.target.files;
  if (files && files.length > 0) {
    const file: File = files[0];

    // The order of validation checks matters to ensure correct and meaningful error handling.
    // Checking file size first ensures large files are always rejected before evaluating other conditions.
    // This prevents misleading errors (e.g., "incorrect file type" for oversized files) and provides a better user experience.

    // Check for file size first
    if (file.size > MAX_FILE_SIZE) {
      showError("errorFileExceedsSize", setErrorMessage, null);
      return false;
    }

    // Check for file type second
    if (!Object.values(FileType).includes(file.type as FileType)) {
      showError("errorIncorrectFile", setErrorMessage, null);
      return false;
    }

    setImageFile(file);
    clearErrorMessage(setErrorMessage);
    return true;
  }
  showError("errorNoFile", setErrorMessage, null);
  return false;
};

const searchValidation = (
  query: string,
  showError: (
    errorType: string,
    setErrorMessage: (message: string) => void,
    query: string | null
  ) => void,
  setErrorMessage: (message: string) => void,
  clearErrorMessage: (setErrorMessage: (message: string) => void) => void
): boolean => {
  if (!query) {
    clearErrorMessage(setErrorMessage);
    return true;
  }

  if (query.length > 50) {
    showError("errorSearchTooLong", setErrorMessage, null);
    return false;
  }

  // Checking if the query includes numbers or special characters
  if (/\d/.test(query) || /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(query)) {
    showError("errorSearchInvalidCharacters", setErrorMessage, null);
    return false;
  }

  clearErrorMessage(setErrorMessage);
  return true;
};

const showError = (
  errorType: string,
  setErrorMessage: (message: string) => void,
  query: string | null
) => {
  let message = "";
  switch (errorType) {
    case "errorNoFile":
      message = "No file selected. Please select a file.";
      break;
    case "errorIncorrectFile":
      message = "Invalid file type. Please upload a jpg, gif, or png file.";
      break;
    case "errorFileExceedsSize":
      message = "File size exceeds the allowed limit.";
      break;
    case "errorRefreshToken":
      message = "Error refreshing Imgur accessToken.";
      break;
    case "errorPostImageData":
      message = "Missing formData or accessToken for posting image";
      break;
    case "errorPostImageResponse":
      message = "Error with POST image response.";
      break;
    case "errorPostImage":
      message = "Error with posting image";
      break;
    case "errorGooglePostResponse":
      message = "Error with Google POST response";
      break;
    case "errorMalformedGoogleResponse":
      message = "Recieved empty or malformed response from Google API";
      break;
    case "errorPostImageUrlToGoogle":
      message = "Error with POSTing image url to Google";
      break;
    case "errorNoLabelAnnotations":
      message = "Error, no label annotations found";
      break;
    case "errorSpoonacularGetRequest":
      message = query
        ? `Error with Spoonacular GET fetch request with query ${query}`
        : "Error with Spoonacular GET fetch request";
      break;
    case "errorSearchTooLong":
      message = "Search queries should be less than 50 characters";
      break;
    case "errorSearchInvalidCharacters":
      message =
        "Search queries should not contain numbers or special characters";
      break;
    case "errorSameImage":
      message = "The same image was selected. Please choose a different image.";
      break;
    case "noError":
      message = "";
      break;
    default:
      message = "An unknown error occurred.";
  }
  setErrorMessage(message);
};

const clearErrorMessage = (setErrorMessage: (message: string) => void) => {
  setErrorMessage("");
};

export {
  fileValidation,
  searchValidation,
  showError,
  clearErrorMessage,
  FileType,
  MAX_FILE_SIZE,
};
