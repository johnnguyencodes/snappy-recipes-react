import { ChangeEvent } from "react";

enum FileType {
  Jpeg = "image/jpeg",
  Png = "image/png",
  Gif = "image/gif",
}

const MAX_FILE_SIZE = 10485760; // 10MB

const fileValidation = (
  event: ChangeEvent<HTMLInputElement>,
  showError: (errorType: string) => void
): File | null => {
  const files = event.target.files;
  if (!files || files.length === 0) {
    showError("errorNoFile");
    return null;
  }

  const file = files[0];
  if (!file) {
    showError("errorNoFile");
    return null;
  }

  // The order of validation checks matters to ensure correct and meaningful error handling.
  // Checking file size first ensures large files are always rejected before evaluating other conditions.
  // This prevents misleading errors (e.g., "incorrect file type" for oversized files) and provides a better user experience.

  // Check for file size first
  if (file.size > MAX_FILE_SIZE) {
    showError("errorFileExceedsSize");
    return null;
  }

  // Check for file type second
  if (!Object.values(FileType).includes(file.type as FileType)) {
    showError("errorIncorrectFile");
    return null;
  }

  return file;
};

const showError = (errorType: string) => {
  console.log("error:", errorType);
};

export { fileValidation, showError, FileType };
