import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the dependent modules first
vi.mock("../../lib/apiUtils", async () => {
  const actual =
    await vi.importActual<Record<string, any>>("../../lib/apiUtils");
  return {
    ...actual,
    postImageUrlToGoogle: vi.fn(),
  };
});

vi.mock("../../lib/formUtils", () => ({
  showError: vi.fn(),
  clearErrorMessage: vi.fn(),
  searchValidation: vi.fn(),
}));

// Now import analyzeImage and the mocked functions
import { analyzeImage } from "../../lib/appUtils";
import { postImageUrlToGoogle } from "../../lib/apiUtils";
import { showError } from "../../lib/formUtils";

const mockPostImageUrlToGoogle = vi.mocked(postImageUrlToGoogle);
const mockShowError = vi.mocked(showError);

describe("analyzeImage", () => {
  let mockSetErrorMessage: (message: string | null) => void;
  const mockImageURL = "https://example.com/image.jpg";

  beforeEach(() => {
    mockSetErrorMessage = vi.fn();
    vi.clearAllMocks();
  });

  it("returns the first label annotation's description when successful", async () => {
    mockPostImageUrlToGoogle.mockResolvedValue({
      responses: [
        {
          labelAnnotations: [{ description: "Delicious Pasta", score: 0.95 }],
        },
      ],
    });

    const result = await analyzeImage(mockImageURL, mockSetErrorMessage);

    expect(mockPostImageUrlToGoogle).toHaveBeenCalledWith(
      mockImageURL,
      expect.any(Function),
      mockSetErrorMessage
    );
    expect(result).toBe("Delicious Pasta");
    expect(mockShowError).not.toHaveBeenCalled();
    expect(mockSetErrorMessage).not.toHaveBeenCalled();
  });

  it("shows error and returns null if no labelAnnotations are found", async () => {
    mockPostImageUrlToGoogle.mockResolvedValue({
      responses: [
        {
          labelAnnotations: [],
        },
      ],
    });

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await analyzeImage(mockImageURL, mockSetErrorMessage);

    expect(mockPostImageUrlToGoogle).toHaveBeenCalledWith(
      mockImageURL,
      expect.any(Function),
      mockSetErrorMessage
    );
    expect(mockShowError).toHaveBeenCalledWith(
      "errorNoLabelAnnotations",
      mockSetErrorMessage,
      null
    );
    expect(result).toBeNull();

    consoleSpy.mockRestore();
  });

  it("shows error and returns null if labelAnnotations are missing entirely", async () => {
    mockPostImageUrlToGoogle.mockResolvedValue({
      responses: [{}], // no labelAnnotations property
    });

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await analyzeImage(mockImageURL, mockSetErrorMessage);

    expect(mockPostImageUrlToGoogle).toHaveBeenCalledWith(
      mockImageURL,
      expect.any(Function),
      mockSetErrorMessage
    );
    expect(mockShowError).toHaveBeenCalledWith(
      "errorNoLabelAnnotations",
      mockSetErrorMessage,
      null
    );
    expect(result).toBeNull();

    consoleSpy.mockRestore();
  });

  it("logs an error and returns null if postImageUrlToGoogle rejects", async () => {
    const mockError = new Error("Network failure");
    mockPostImageUrlToGoogle.mockRejectedValue(mockError);

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await analyzeImage(mockImageURL, mockSetErrorMessage);

    expect(mockPostImageUrlToGoogle).toHaveBeenCalledWith(
      mockImageURL,
      expect.any(Function),
      mockSetErrorMessage
    );
    expect(mockShowError).not.toHaveBeenCalled();
    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching data from Google Vision API:",
      mockError
    );

    consoleSpy.mockRestore();
  });
});
