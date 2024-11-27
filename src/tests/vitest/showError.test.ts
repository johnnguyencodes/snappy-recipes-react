import { showError } from "../../lib/formUtils.ts";
import { describe, it, expect, vi } from "vitest";

describe("showError", () => {
  it("should set the correct error message for `errorNoFile`", () => {
    const mockSetErrorMessage = vi.fn();
    showError("errorNoFile", mockSetErrorMessage, null);
    expect(mockSetErrorMessage).toHaveBeenCalledWith(
      "No file selected. Please select a file."
    );
  });

  it("should set the corret error message for `errorIncorrectFile`", () => {
    const mockSetErrorMessage = vi.fn();
    showError("errorIncorrectFile", mockSetErrorMessage, null);
    expect(mockSetErrorMessage).toHaveBeenCalledWith(
      "Invalid file type. Please upload an image file."
    );
  });

  it("should set the correct error message for `errorFileExceedsSize`", () => {
    const mockSetErrorMessage = vi.fn();
    showError("errorFileExceedsSize", mockSetErrorMessage, null);
    expect(mockSetErrorMessage).toHaveBeenCalledWith(
      "File size exceeds the allowed limit."
    );
  });

  it("should set an empty message for `noError`", () => {
    const mockSetErrorMessage = vi.fn();
    showError("noError", mockSetErrorMessage, null);
    expect(mockSetErrorMessage).toHaveBeenCalledWith("");
  });

  it("should set a default error message for unknown error types", () => {
    const mockSetErrorMessage = vi.fn();
    showError("unknownErrorType", mockSetErrorMessage, null);
    expect(mockSetErrorMessage).toHaveBeenCalledWith(
      "An unknown error occurred."
    );
  });
});
