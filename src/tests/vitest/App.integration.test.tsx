import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../../App.tsx";
import { vi, describe, it, expect } from "vitest";
import {
  uploadFileToImgur,
  analyzeImage,
  callSpoonacularAPI,
} from "../../lib/appUtils";
import { IRecipe } from "types/AppTypes";

vi.mock("../../lib/appUtils", () => ({
  ...vi.importActual("../../lib/appUtils"),
  uploadFileToImgur: vi.fn(),
  analyzeImage: vi.fn(),
  callSpoonacularAPI: vi.fn(),
}));

describe("Searching for a recipe by uploading an image file", () => {
  it("should display recipes after uploading an image and completing the search flow", async () => {
    const mockFile = new File(["dummy content"], "test.jpg", {
      type: "image/jpeg",
    });

    // Cast the mocked functions explicitly to avoid type issues
    const mockUploadFileToImgur = vi.mocked(uploadFileToImgur);
    const mockAnalyzeImage = vi.mocked(analyzeImage);
    const mockCallSpoonacularAPI = vi.mocked(callSpoonacularAPI);

    mockUploadFileToImgur.mockResolvedValue("https://example.com/image.jpg");
    mockAnalyzeImage.mockResolvedValue("pasta");
    mockCallSpoonacularAPI.mockImplementation(
      async (
        query: string,
        setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>,
        setStatusMessage: React.Dispatch<React.SetStateAction<string | null>>,
        setRecipeArray: React.Dispatch<React.SetStateAction<IRecipe[] | null>>,
        restrictionsArray: string[] | null,
        intolerancesArray: string[] | null
      ): Promise<void> => {
        if (query === "") {
          setErrorMessage("Query cannot be empty");
        }

        const combinedFilters = [
          ...(restrictionsArray || []),
          ...(intolerancesArray || []),
        ];
        console.log(combinedFilters);
        setRecipeArray([
          {
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
          },
        ]);
        setStatusMessage(`1 recipe found that contains ${query}`);
      }
    );

    render(<App />);

    //  Simulate file upload
    const uploadButton = screen.getByText("upload");
    fireEvent.click(uploadButton);

    const fileInput = screen.getByPlaceholderText(
      "Search by entering your ingredient or upload an image"
    );
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    // Wait for the status message and recipes to appear
    await waitFor(() => {
      expect(
        screen.getByText("1 recipes found that contains pasta")
      ).toBeInTheDocument();
      expect(screen.getByText("Mock Recipe")).toBeInTheDocument();
    });
  });
});
