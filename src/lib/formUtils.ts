import { ChangeEvent } from "react";

enum FileType {
  Jpeg = "image/jpeg",
  Png = "image/png",
  Gif = "image/gif",
}

const MAX_FILE_SIZE = 10485760; // 10MB

const fileValidation = (
  event: ChangeEvent<HTMLInputElement>,
  showError: (
    errorType: string,
    setErrorMessage: (message: string) => void
  ) => void,
  setImageFile: (file: File) => void,
  setErrorMessage: (message: string) => void,
  clearErrorMessage: (setErrorMessage: (message: string) => void) => void
): boolean => {
  const files = event.target.files;
  if (files && files.length > 0) {
    const file: File = files[0];

    if (!file) {
      showError("errorNoFile", setErrorMessage);
      return false;
    }

    // The order of validation checks matters to ensure correct and meaningful error handling.
    // Checking file size first ensures large files are always rejected before evaluating other conditions.
    // This prevents misleading errors (e.g., "incorrect file type" for oversized files) and provides a better user experience.

    // Check for file size first
    if (file.size > MAX_FILE_SIZE) {
      showError("errorFileExceedsSize", setErrorMessage);
      return false;
    }

    // Check for file type second
    if (!Object.values(FileType).includes(file.type as FileType)) {
      showError("errorIncorrectFile", setErrorMessage);
      return false;
    }

    setImageFile(file);
    clearErrorMessage(setErrorMessage);
    return true;
  }
  showError("errorNoFile", setErrorMessage);
  return false;
};

const showError = (
  errorType: string,
  setErrorMessage: (message: string) => void
) => {
  let message = "";
  switch (errorType) {
    case "errorNoFile":
      message = "No file selected. Please select a file.";
      break;
    case "errorIncorrectFile":
      message = "Invalid file type. Please upload an image file.";
      break;
    case "errorFileExceedsSize":
      message = "File size exceeds the allowed limit.";
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

export { fileValidation, showError, clearErrorMessage, FileType };
