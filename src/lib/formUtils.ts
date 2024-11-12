import { ChangeEvent } from "react";

enum FileType {
  Jpeg = "image/jpeg",
  Png = "image/png",
  Gif = "image/gif",
}

const MAX_FILE_SIZE = 10485760; // 10MB

const fileValidation = (
  event: ChangeEvent<HTMLInputElement>,
  showError: (errorType: string) => void,
  setImageFile: (file: File) => void
): boolean => {
  const files = event.target.files;
  if (files && files.length > 0) {
    const file: File = files[0];

    if (!file) {
      showError("errorNoFile");
      return false;
    }

    if (!Object.values(FileType).includes(file.type as FileType)) {
      showError("errorIncorrectFile");
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      showError("errorFileExceedsSize");
      return false;
    }

    setImageFile(file);
    return true;
  }
  return false;
};

const showError = (errorType: string) => {
  console.log("error:", errorType);
};

export { fileValidation, showError, FileType };
