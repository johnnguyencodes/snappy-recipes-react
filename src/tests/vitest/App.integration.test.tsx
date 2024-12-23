import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event"; // More accurate user interactions
import "@testing-library/jest-dom";
import { vi, describe, it, expect, afterEach } from "vitest";
import App from "../../App.tsx";
import * as appUtils from "../../lib/appUtils"; // Import all as namespace
import { IRecipe } from "types/AppTypes";
import { searchValidation } from "@/lib/formUtils.ts";

// Mock global URL.createObjectURL and URL.revokeObjectURL to prevent errors during image preview
global.URL.createObjectURL = vi.fn(() => "mock-url");
global.URL.revokeObjectURL = vi.fn();

// Mock appUtils with actual implementation except specific functions
vi.mock("../../lib/appUtils", () => ({
  ...vi.importActual("../../lib/appUtils"),
  uploadFileToImgur: vi.fn(),
  analyzeImage: vi.fn(),
  callSpoonacularAPI: vi.fn(),
  isDuplicateFile: vi.fn(),
  validateAndSetFile: vi.fn(),
  validateSearchInput: vi.fn(),
  validateImageUrl: vi.fn().mockResolvedValue("mock-image.jpg"),
  loadFromLocalStorage: vi.fn(),
  saveToLocalStorage: vi.fn(),
}));

// Define a mock recipe to be returned by callSpoonacularAPI
const mockRecipe: IRecipe = {
  id: 1,
  title: "Mock Recipe",
  image: "mock-image.jpg",
  readyInMinutes: 45,
  servings: 10,
  diets: ["gluten free"],
  sourceUrl: "https://example.com",
  summary: "Summary",
  nutrition: {
    nutrients: [
      {
        name: "mock Calories",
        amount: 90.93,
        unit: "kcal",
        percentOfDailyNeeds: 4.55,
      },
    ],
    ingredients: [
      {
        id: 1,
        name: "mock ingredient",
        amount: 1,
        unit: "mock unit",
      },
    ],
  },
};

// Mock RecipeCard component to simplify the DOM structure
vi.mock("../../components/app/RecipeCard", () => ({
  __esmodule: true,
  default: vi.fn(({ recipe, toggleFavorite, favoritesArray }) => {
    return (
      <div id={`recipe-${recipe.id}`}>
        <h3>{recipe.title}</h3>
        <button
          data-testid={`favorite-button-${recipe.id}`}
          onClick={(event) => {
            event.stopPropagation();
            toggleFavorite(recipe);
          }}
        >
          {favoritesArray.some((favorite: IRecipe) => favorite.id === recipe.id)
            ? "Unfavorite"
            : "Favorite"}
        </button>
      </div>
    );
  }),
}));

describe("Searching for a recipe, favoriting it, and viewing favorites", () => {
  afterEach(() => {
    vi.clearAllMocks(); // Clear mocks after each test
  });

  it("calls callSpoonacularAPI twice and shows '1 recipes found that contains pasta' after a valid file upload", async () => {
    // Create a mock file
    const mockFile = new File(["dummy content"], "test.jpg", {
      type: "image/jpeg",
    });

    // Access the mocked functions via appUtils
    const mockUploadFileToImgur = vi.mocked(appUtils.uploadFileToImgur);
    const mockAnalyzeImage = vi.mocked(appUtils.analyzeImage);
    const mockCallSpoonacularAPI = vi.mocked(appUtils.callSpoonacularAPI);
    const mockIsDuplicateFile = vi.mocked(appUtils.isDuplicateFile);
    const mockValidateAndSetFile = vi.mocked(appUtils.validateAndSetFile);

    // Set up mock implementations with console.logs

    // Mock isDuplicateFile to always return false and log its call
    mockIsDuplicateFile.mockImplementation((previousFile, currentFile) => {
      console.log("isDuplicateFile called with:", {
        previousFile,
        currentFile,
      });
      return false; // Always false to allow upload flow
    });

    // Mock validateAndSetFile to return the file and log its call
    mockValidateAndSetFile.mockImplementation(
      (
        event,
        fileValidation,
        setImageFile,
        setSelectedImagePreviewUrl,
        setErrorMessage,
        clearErrorMessage
      ) => {
        console.log("validateAndSetFile called");
        const file = event.target.files?.[0];
        if (
          file &&
          fileValidation(
            event,
            vi.fn(),
            setImageFile,
            setErrorMessage,
            clearErrorMessage
          )
        ) {
          console.log("File validated and set");
          setImageFile(file);
          setSelectedImagePreviewUrl("mock-preview-url");
          return file;
        }
        console.log("File validation failed");
        return null;
      }
    );

    // Mock uploadFileToImgur with console log
    mockUploadFileToImgur.mockImplementation(
      async (selectedFile, imgurAccessToken, _setErrorMessage) => {
        console.log("uploadFileToImgur called with:", {
          selectedFile,
          imgurAccessToken,
        });
        return "https://example.com/image.jpg"; // Mocked URL
      }
    );

    // Mock analyzeImage with console log
    mockAnalyzeImage.mockImplementation(async (imageURL, _setErrorMessage) => {
      console.log("analyzeImage called with:", { imageURL });
      return "pasta"; // Mocked analysis
    });

    // Mock callSpoonacularAPI with console log
    mockCallSpoonacularAPI.mockImplementation(
      async (
        query: string,
        _setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>,
        setStatusMessage: React.Dispatch<React.SetStateAction<string | null>>,
        setRecipeArray: React.Dispatch<React.SetStateAction<IRecipe[] | null>>,
        _restrictionsArray: string[] | null,
        _intolerancesArray: string[] | null
      ) => {
        console.log("callSpoonacularAPI called with:", { query });
        if (!query) {
          // Initial load: no recipes, no message
          setRecipeArray([mockRecipe]);
          setStatusMessage("1 random recipes found.");
        } else if (query === "pasta") {
          // After analysis: return mock recipe and message
          setRecipeArray([mockRecipe]);
          setStatusMessage("1 recipes found that contains pasta");
        }
      }
    );

    // Render the App
    console.log("Rendering App...");
    render(<App />);

    // Verify initial callSpoonacularAPI("") was called
    expect(mockCallSpoonacularAPI).toHaveBeenCalledWith(
      "",
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
      expect.anything(),
      expect.anything()
    );

    // Initial state checks
    console.log("Initial state checked: no final message or recipe present.");
    expect(
      screen.queryByText("1 recipes found that contains pasta")
    ).toBeNull();
    expect(screen.queryByText("Mock Recipe")).toBeNull();

    // Simulate clicking the upload button
    console.log("Clicking upload button...");
    const uploadButton = screen.getByTestId("upload-button");
    await userEvent.click(uploadButton);

    // Simulate file upload using userEvent.upload
    console.log("Uploading a valid jpg file to trigger upload flow...");
    const fileInput = screen.getByTestId("file-input") as HTMLInputElement;

    await userEvent.upload(fileInput, mockFile);

    // Verify that the file was uploaded
    expect(fileInput.files?.[0]).toBe(mockFile);
    expect(fileInput.files).toHaveLength(1);

    // Wait for the status message and recipes to appear
    console.log(
      "Waiting for '1 recipes found that contains pasta' to appear..."
    );
    const statusMessage = await screen.findByText(
      "1 recipes found that contains pasta"
    );
    console.log("Found status message in DOM!");

    // Assert that the status message and mock recipe are present
    expect(statusMessage).toBeInTheDocument();
    expect(screen.getByText("Mock Recipe")).toBeInTheDocument();

    // Check that callSpoonacularAPI was called twice
    expect(mockCallSpoonacularAPI).toHaveBeenCalledTimes(2);
    expect(mockCallSpoonacularAPI).toHaveBeenCalledWith(
      "pasta",
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
      expect.anything(),
      expect.anything()
    );
  });

  it("calls callSpoonacularAPI twice and shows '1 recipes found that contains pizza' after entering a valid query", async () => {
    // create a mock search query
    const mockQuery = "pizza";

    // Access the mocked functions via appUtils
    const mockValidateSearchInput = vi.mocked(appUtils.validateSearchInput);
    const mockCallSpoonacularAPI = vi.mocked(appUtils.callSpoonacularAPI);

    // Mock validateSearchInput
    mockValidateSearchInput.mockImplementation(
      (
        query: string,
        setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>
      ): boolean => {
        console.log("validateSearchInput called with:", { query });
        if (searchValidation(query, vi.fn(), setErrorMessage, vi.fn())) {
          console.log("Search validated");
          return true;
        } else {
          return false;
        }
      }
    );

    // Mock callSpoonacularAPI with console log
    mockCallSpoonacularAPI.mockImplementation(
      async (
        query: string,
        _setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>,
        setStatusMessage: React.Dispatch<React.SetStateAction<string | null>>,
        setRecipeArray: React.Dispatch<React.SetStateAction<IRecipe[] | null>>,
        _restrictionsArray: string[] | null,
        _intolerancesArray: string[] | null
      ) => {
        console.log("callSpoonacularAPI called with:", { query });
        if (!query) {
          // Initial load: no recipes, no message
          setRecipeArray([mockRecipe]);
          setStatusMessage("1 random recipes found.");
        } else if (query === "pizza") {
          // After analysis: return mock recipe and message
          setRecipeArray([mockRecipe]);
          setStatusMessage("1 recipes found that contains pizza");
        }
      }
    );

    // Render the App
    console.log("Rendering App...");
    render(<App />);

    // Verify initial callSpoonacularAPI("") was called
    expect(mockCallSpoonacularAPI).toHaveBeenCalledWith(
      "",
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
      expect.anything(),
      expect.anything()
    );

    // Initial state checks
    console.log("Initial state checked: no final message or recipe present.");
    expect(
      screen.queryByText("1 recipes found that contains pizza")
    ).toBeNull();
    expect(screen.queryByText("Mock Recipe")).toBeNull();

    // Simulate entering a query
    console.log("Entering query");
    const textInput = screen.getByTestId("text-input");
    await userEvent.type(textInput, mockQuery);

    const submitButton = screen.getByTestId("submit");
    await userEvent.click(submitButton);

    // Wait for the status message and recipes to appear
    console.log(
      "Waiting for '1 recipes found that contains pizza' to appear..."
    );
    const statusMessage = await screen.findByText(
      "1 recipes found that contains pizza"
    );
    console.log("Found status message in DOM!");

    // Assert that the status message and mock recipe are present
    expect(statusMessage).toBeInTheDocument();
    expect(screen.getByText("Mock Recipe")).toBeInTheDocument();

    // Check that callSpoonacularAPI was called twice
    expect(mockCallSpoonacularAPI).toHaveBeenCalledTimes(2);
    expect(mockCallSpoonacularAPI).toHaveBeenCalledWith(
      "pizza",
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
      expect.anything(),
      expect.anything()
    );
  });

  it("should diplay a favorited recipe in the favorites section", async () => {
    // Create a mock file
    const mockFile = new File(["dummy content"], "test.jpg", {
      type: "image/jpeg",
    });

    // Access the mocked functions via appUtils
    const mockUploadFileToImgur = vi.mocked(appUtils.uploadFileToImgur);
    const mockAnalyzeImage = vi.mocked(appUtils.analyzeImage);
    const mockCallSpoonacularAPI = vi.mocked(appUtils.callSpoonacularAPI);

    // Mock implementations
    mockUploadFileToImgur.mockResolvedValue("https://example.com/image.jpg");
    mockAnalyzeImage.mockResolvedValue("pasta");
    mockCallSpoonacularAPI.mockImplementation(
      async (
        query: string,
        _setErrorMessage,
        setStatusMessage,
        setRecipeArray
      ) => {
        if (query === "pasta") {
          setRecipeArray([mockRecipe]);
          setStatusMessage("1 recipes found that contains pasta");
        }
      }
    );

    render(<App />);

    // Simulate file upload
    const uploadButton = screen.getByTestId("upload-button");
    await userEvent.click(uploadButton);

    const fileInput = screen.getByTestId("file-input");
    await userEvent.upload(fileInput, mockFile);

    // Wait for the recipe to be displayed
    const recipeTitle = await screen.findByText("Mock Recipe");
    expect(recipeTitle).toBeInTheDocument();

    // Favorite the recipe
    const favoriteButton = screen.getByTestId(
      `favorite-button-${mockRecipe.id}`
    );
    expect(favoriteButton).toHaveTextContent("Favorite");
    await userEvent.click(favoriteButton);
    expect(favoriteButton).toHaveTextContent("Unfavorite");

    // Navigate to the Favorites section
    const favoritesButton = screen.getByTestId("viewFavorites");
    await userEvent.click(favoritesButton);

    // Verify the favorited recipe is displayed in Favorites
    const favoriteRecipeTitle = await screen.findByText("Mock Recipe");
    expect(favoriteRecipeTitle).toBeInTheDocument();
  });

  it("should display favorited recipes in the Favorites section and allow removing a recipe from Favorites", async () => {
    // Access the mocked functions via appUtils
    const mockLoadFromLocalStorage = vi.mocked(appUtils.loadFromLocalStorage);
    mockLoadFromLocalStorage.mockReturnValue([mockRecipe]);

    // Render the App
    render(<App />);

    // Navigate to the Favorites section
    const favoritesButton = screen.getByTestId("viewFavorites");
    await userEvent.click(favoritesButton);

    // Verify the "Unfavorite" button is present and has the correct text
    const unfavoriteButton = screen.getByTestId(
      `favorite-button-${mockRecipe.id}`
    );
    expect(unfavoriteButton).toHaveTextContent("Unfavorite");

    // Simulate unfavoriting the recipe
    await userEvent.click(unfavoriteButton);

    // Verify the recipe is removed from the Favorites section
    const favoriteRecipeTitle = screen.queryByText("Mock Recipe");
    expect(favoriteRecipeTitle).not.toBeInTheDocument();

    // Wait for the recipe to be removed and the favorites section to be empty
    const emptyFavoritesMessage = await screen.findByText(
      "Your favorite recipes will appear here."
    );
    expect(emptyFavoritesMessage).toBeInTheDocument();
  });
});
