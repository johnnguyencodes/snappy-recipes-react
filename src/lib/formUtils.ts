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
      message =
        "No file selected. Click the upload button and choose a file to proceed.";
      break;
    case "errorIncorrectFile":
      message =
        "Unsupported file type. Please upload an image in JPG, PNG, or GIF format smaller than 10MB.";
      break;
    case "errorFileExceedsSize":
      message =
        "The selected file is too large. Please choose an image in JPG, PNG, or GIF format smaller than 10MB.";
      break;
    case "errorRefreshToken":
      message =
        'There was an issue refreshing the Imgur access token. Please try again later. If the problem persists, <a style="color: rgb(220 38 38); text-decoration: underline; font-weight: 400;" href="https://github.com/johnnguyencodes/snappy-recipes-react/issues/new" target="_blank" rel="noopener noreferrer">report the issue here</a>.';
      break;
    case "errorPostImageData":
      message =
        "Unable to upload the image due to a network error. Please check your connection and try again.";
      break;
    case "errorPostImageResponse":
      message =
        "An error occurred while processing the image upload. Please check your internet connection and try again.";
      break;
    case "errorPostImage":
      message =
        "An issue occurred while uploading the image. Please check your network and try again.";
      break;
    case "errorGooglePostResponse":
      message =
        "We encountered a problem connecting to the Google API. Please ensure you have an active internet connection and try again.";
      break;
    case "errorMalformedGoogleResponse":
      message =
        "We received an unexpected response from Google. Please refresh the page and try again.";
      break;
    case "errorPostImageUrlToGoogle":
      message =
        "There was an issue analyzing the image. Please check your network connection and try again.";
      break;
    case "errorNoLabelAnnotations":
      message =
        "We couldn't identify any objects in the image. Please upload a clearer or different image.";
      break;
    case "errorSpoonacularGetRequest":
      message = query
        ? `Error retrieving recipes for "${query}". Please check your network connection and try again.`
        : "An issue occurred while fetching recipes. Please check your internet connection and try again.";
      break;
    case "errorSearchTooLong":
      message =
        "Your search query is too long. Please limit it to 50 characters or fewer.";
      break;
    case "errorSearchInvalidCharacters":
      message =
        "Invalid search query. Please use only letters (e.g., 'pasta').";
      break;
    case "errorSameImage":
      message =
        "You selected the same image. Please choose a new image to continue.";
      break;
    case "errorSpoonacularLimitReached":
      message = "Spoonacular API limit reached. Please try again in 24 hours.";
      break;
    case "noError":
      message = "";
      break;
    case "triggerError":
      message = "This is an error message";
      break;
    default:
      message =
        "An unexpected error occurred. Please try again. If the issue persists, contact support or <a style='color: rgb(220 38 38); text-decoration: underline;' href='https://github.com/johnnguyencodes/snappy-recipes-react/issues/new' target='_blank' rel='noopener noreferrer'>report it here</a>.";
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
