import { describe, it, expect, vi, afterEach } from "vitest";
import { ChangeEvent } from "react";

// First, mock formUtils
vi.mock("../../lib/formUtils", () => ({
  showError: vi.fn(),
  clearErrorMessage: vi.fn(),
  searchValidation: vi.fn(),
}));

// Then mock appUtils
vi.mock("../../lib/appUtils", async () => {
  const actual =
    await vi.importActual<Record<string, unknown>>("../../lib/appUtils");
  return {
    ...actual,
    showError: vi.fn(),
    clearErrorMessage: vi.fn(),
  };
});

import { validateAndSetFile } from "../../lib/appUtils";
import { clearErrorMessage as mockClearErrorMessage } from "../../lib/formUtils";

describe("validateAndSetFile", () => {
  afterEach(() => {
    vi.clearAllMocks();
    global.URL.createObjectURL = vi.fn(); // Reset the URL mock between tests
  });

  it("should return null if fileValidation fails", () => {
    // fileValidation returns false, meaning no validation success
    const mockFileValidation = vi.fn().mockReturnValue(false);
    const mockSetImageFile = vi.fn();
    const mockSetSelectedImagePreviewUrl = vi.fn();
    // Cast the mock to match React state setter type
    const mockSetErrorMessage = vi.fn() as unknown as React.Dispatch<
      React.SetStateAction<string | null>
    >;

    function createMockEvent(file: File): ChangeEvent<HTMLInputElement> {
      const fileList = {
        0: file,
        length: 1,
        item: (index: number) => (index === 0 ? file : null),
      };

      const event = { target: { files: fileList } };
      return event as unknown as ChangeEvent<HTMLInputElement>;
    }

    const event = createMockEvent(new File([], "test.jpg"));

    const result = validateAndSetFile(
      event,
      mockFileValidation,
      mockSetImageFile,
      mockSetSelectedImagePreviewUrl,
      mockSetErrorMessage,
      mockClearErrorMessage
    );

    expect(mockFileValidation).toHaveBeenCalledWith(
      event,
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
    expect(mockSetSelectedImagePreviewUrl).toHaveBeenCalledWith(null);
    expect(result).toBe(null);
    expect(mockSetImageFile).not.toHaveBeenCalled();
  });

  it("should set image file and preview URL if fileValidation succeeds", () => {
    // In the successful scenario, we must provide all arguments
    const mockFileValidation = vi
      .fn()
      .mockImplementation(
        (
          event,
          showError,
          setImageFileCallback,
          setErrorMessage,
          clearErrorMessage
        ) => {
          // Simulate successful validation by calling setImageFileCallback
          setImageFileCallback(event.target.files[0]);
          return true;
        }
      );

    const mockSetImageFile = vi.fn();
    const mockSetSelectedImagePreviewUrl = vi.fn();
    const mockSetErrorMessage = vi.fn() as unknown as React.Dispatch<
      React.SetStateAction<string | null>
    >;

    const mockFile = new File(["test content"], "test.jpg");
    const fileList = {
      0: mockFile,
      length: 1,
      item(index: number): File | null {
        return index === 0 ? mockFile : null;
      },
    } as unknown as FileList;

    const event = {
      target: { files: fileList },
    } as unknown as ChangeEvent<HTMLInputElement>;

    const mockObjectUrl = "mock-url";
    global.URL.createObjectURL = vi.fn().mockReturnValue(mockObjectUrl);

    const result = validateAndSetFile(
      event,
      mockFileValidation,
      mockSetImageFile,
      mockSetSelectedImagePreviewUrl,
      mockSetErrorMessage,
      mockClearErrorMessage
    );

    expect(mockFileValidation).toHaveBeenCalledWith(
      event,
      expect.any(Function), // showError
      expect.any(Function), // setImageFileCallback
      expect.any(Function), // setErrorMessage
      expect.any(Function) // clearErrorMessage
    );
    expect(mockSetImageFile).toHaveBeenCalledWith(mockFile);
    expect(mockSetSelectedImagePreviewUrl).toHaveBeenCalledWith(mockObjectUrl);
    expect(result).toBe(mockFile);
  });

  it("should clear the preview URL if validation fails", () => {
    const mockFileValidation = vi.fn().mockReturnValue(false);
    const mockSetImageFile = vi.fn();
    const mockSetSelectedImagePreviewUrl = vi.fn();
    const mockSetErrorMessage = vi.fn() as unknown as React.Dispatch<
      React.SetStateAction<string | null>
    >;

    function createMockEvent(file: File): ChangeEvent<HTMLInputElement> {
      const fileList = {
        0: file,
        length: 1,
        item: (index: number) => (index === 0 ? file : null),
      };

      const event = { target: { files: fileList } };
      return event as unknown as ChangeEvent<HTMLInputElement>;
    }

    const event = createMockEvent(new File([], "test.jpg"));

    const result = validateAndSetFile(
      event,
      mockFileValidation,
      mockSetImageFile,
      mockSetSelectedImagePreviewUrl,
      mockSetErrorMessage,
      mockClearErrorMessage
    );

    expect(mockFileValidation).toHaveBeenCalledWith(
      event,
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
    expect(mockSetSelectedImagePreviewUrl).toHaveBeenCalledWith(null);
    expect(mockSetImageFile).not.toHaveBeenCalled();
    expect(result).toBe(null);
  });
});
