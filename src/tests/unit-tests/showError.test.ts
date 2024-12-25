import { showError, clearErrorMessage } from "../../lib/formUtils.ts";
import { describe, it, expect, vi } from "vitest";

describe("showError", () => {
  const errorCases = [
    {
      errorType: "errorRefreshToken",
      expected:
        'There was an issue refreshing the Imgur access token. Please try again later. If the problem persists, <a style="color: rgb(220 38 38); text-decoration: underline; font-weight: 400;" href="https://github.com/johnnguyencodes/snappy-recipes-react/issues/new" target="_blank" rel="noopener noreferrer">report the issue here</a>.',
    },
    {
      errorType: "errorPostImageData",
      expected:
        "Unable to upload the image due to a network error. Please check your connection and try again.",
    },
    {
      errorType: "errorPostImageResponse",
      expected:
        "An error occurred while processing the image upload. Please check your internet connection and try again.",
    },
    {
      errorType: "errorPostImage",
      expected:
        "An issue occurred while uploading the image. Please check your network and try again.",
    },
    {
      errorType: "errorGooglePostResponse",
      expected:
        "We encountered a problem connecting to the Google API. Please ensure you have an active internet connection and try again.",
    },
    {
      errorType: "errorMalformedGoogleResponse",
      expected:
        "We received an unexpected response from Google. Please refresh the page and try again.",
    },
    {
      errorType: "errorPostImageUrlToGoogle",
      expected:
        "There was an issue analyzing the image. Please check your network connection and try again.",
    },
    {
      errorType: "errorNoLabelAnnotations",
      expected:
        "We couldn't identify any objects in the image. Please upload a clearer or different image.",
    },
    {
      errorType: "errorSearchTooLong",
      expected:
        "Your search query is too long. Please limit it to 50 characters or fewer.",
    },
    {
      errorType: "errorSearchInvalidCharacters",
      expected:
        "Invalid search query. Please use only letters (e.g., 'pasta').",
    },
    {
      errorType: "errorSameImage",
      expected:
        "You selected the same image. Please choose a new image to continue.",
    },
    {
      errorType: "errorFileExceedsSize",
      expected:
        "The selected file is too large. Please choose an image smaller than 10MB.",
    },
    {
      errorType: "errorIncorrectFile",
      expected:
        "Unsupported file type. Please upload an image in JPG, PNG, or GIF format.",
    },
    {
      errorType: "unknownErrorType",
      expected:
        "An unexpected error occurred. Please try again. If the issue persists, contact support or <a style='color: rgb(220 38 38); text-decoration: underline;' href='https://github.com/johnnguyencodes/snappy-recipes-react/issues/new' target='_blank' rel='noopener noreferrer'>report it here</a>.",
    },
    {
      errorType: "noError",
      expected: "",
    },
    {
      errorType: "",
      expected:
        "An unexpected error occurred. Please try again. If the issue persists, contact support or <a style='color: rgb(220 38 38); text-decoration: underline;' href='https://github.com/johnnguyencodes/snappy-recipes-react/issues/new' target='_blank' rel='noopener noreferrer'>report it here</a>.",
    },
    {
      errorType: "a".repeat(1000),
      expected:
        "An unexpected error occurred. Please try again. If the issue persists, contact support or <a style='color: rgb(220 38 38); text-decoration: underline;' href='https://github.com/johnnguyencodes/snappy-recipes-react/issues/new' target='_blank' rel='noopener noreferrer'>report it here</a>.",
    },
    {
      errorType: "errorSpoonacularLimitReached",
      expected: "Spoonacular API limit reached. Please try again in 24 hours.",
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
      'Error retrieving recipes for "pasta". Please check your network connection and try again.'
    );
  });

  it("should not include the query in the error message for `errorSpoonacularGetRequest` if query is null", () => {
    const mockSetErrorMessage = vi.fn();

    showError("errorSpoonacularGetRequest", mockSetErrorMessage, null);

    expect(mockSetErrorMessage).toHaveBeenCalledWith(
      "An issue occurred while fetching recipes. Please check your internet connection and try again."
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
      "No file selected. Click the upload button and choose a file to proceed."
    );

    clearErrorMessage(mockSetErrorMessage);
    expect(mockSetErrorMessage).toHaveBeenCalledWith("");
  });
});
