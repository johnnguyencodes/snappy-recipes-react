import { showError, clearErrorMessage } from "../../lib/formUtils.ts";
import { describe, it, expect, vi } from "vitest";

describe("showError", () => {
  const errorCases = [
    {
      errorType: "errorRefreshToken",
      expected: "Error refreshing Imgur accessToken.",
    },
    {
      errorType: "errorPostImageData",
      expected: "Missing formData or accessToken for posting image",
    },
    {
      errorType: "errorPostImageResponse",
      expected: "Error with POST image response.",
    },
    { errorType: "errorPostImage", expected: "Error with posting image" },
    {
      errorType: "errorGooglePostResponse",
      expected: "Error with Google POST response",
    },
    {
      errorType: "errorMalformedGoogleResponse",
      expected: "Recieved empty or malformed response from Google API",
    },
    {
      errorType: "errorPostImageUrlToGoogle",
      expected: "Error with POSTing image url to Google",
    },
    {
      errorType: "errorNoLabelAnnotations",
      expected: "Error, no label annotations found",
    },
    {
      errorType: "errorSearchTooLong",
      expected: "Search queries should be less than 50 characters",
    },
    {
      errorType: "errorSearchInvalidCharacters",
      expected:
        "Search queries should not contain numbers or special characters",
    },
    {
      errorType: "errorSameImage",
      expected: "The same image was selected. Please choose a different image.",
    },
    {
      errorType: "errorFileExceedsSize",
      expected: "File size exceeds the allowed limit.",
    },
    {
      errorType: "errorIncorrectFile",
      expected: "Invalid file type. Please upload a jpg, gif, or png file.",
    },
    {
      errorType: "unknownErrorType",
      expected: "An unknown error occurred.",
    },
    {
      errorType: "noError",
      expected: "",
    },
    {
      errorType: "",
      expected: "An unknown error occurred.",
    },
    {
      errorType: "a".repeat(1000),
      expected: "An unknown error occurred.",
    },
  ];

  errorCases.forEach(({ errorType, expected }) => {
    it(`should set the correct error message for \`${errorType}\``, () => {
      const mockSetErrorMessage = vi.fn();
      showError(errorType, mockSetErrorMessage, null);
      expect(mockSetErrorMessage).toHaveBeenCalledWith(expected);
    });
  });

  it("should include the query in the error message for `errorSpoonacularGetRequest`", () => {
    const mockSetErrorMessage = vi.fn();
    const query = "pasta";

    showError("errorSpoonacularGetRequest", mockSetErrorMessage, query);

    expect(mockSetErrorMessage).toHaveBeenCalledWith(
      "Error with Spoonacular GET fetch request with query pasta"
    );
  });

  it("should not include the query in the error message for `errorSpoonacularGetRequest` if query is null", () => {
    const mockSetErrorMessage = vi.fn();

    showError("errorSpoonacularGetRequest", mockSetErrorMessage, null);

    expect(mockSetErrorMessage).toHaveBeenCalledWith(
      "Error with Spoonacular GET fetch request"
    );
  });
});

describe("clearErrorMessage", () => {
  it("should clear the error message", () => {
    const mockSetErrorMessage = vi.fn();
    clearErrorMessage(mockSetErrorMessage);
    expect(mockSetErrorMessage).toHaveBeenCalledWith("");
  });

  it("should set and then clear an error message", () => {
    const mockSetErrorMessage = vi.fn();

    showError("errorNoFile", mockSetErrorMessage, null);
    expect(mockSetErrorMessage).toHaveBeenCalledWith(
      "No file selected. Please select a file."
    );

    clearErrorMessage(mockSetErrorMessage);
    expect(mockSetErrorMessage).toHaveBeenCalledWith("");
  });
});
