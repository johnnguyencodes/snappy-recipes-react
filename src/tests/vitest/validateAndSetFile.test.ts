import { describe, it, expect, vi, afterEach } from "vitest";
import { ChangeEvent } from "react";

// Mock the module at the very top
vi.mock("../../lib/appUtils", async () => {
  const actual = await vi.importActual<unknown>("../../lib/appUtils");
  return {
    ...(actual as Record<string, unknown>),
    showError: vi.fn(),
    clearErrorMessage: vi.fn(),
  };
});

// Now import everything after we've mocked
import { validateAndSetFile } from "../../lib/appUtils";
import { clearErrorMessage as mockClearErrorMessage } from "../../lib/formUtils";

describe("validateAndSetFile", () => {
  afterEach(() => {
    vi.clearAllMocks();
    global.URL.createObjectURL = vi.fn(); // Reset URL mock
  });

  it("should return null if fileValidation fails", () => {
    const mockFileValidation = vi.fn().mockReturnValue(false);
    const mockSetImageFile = vi.fn();
    const mockSetSelectedImagePreviewUrl = vi.fn();
    const mockSetErrorMessage = vi.fn();

    function createMockEvent(file: File): ChangeEvent<HTMLInputElement> {
      const fileList = {
        0: file,
        length: 1,
        item: (index: number) => (index === 0 ? file : null),
      };

      const event = {
        target: { files: fileList },
      };

      return event as unknown as ChangeEvent<HTMLInputElement>;
    }

    // Now you can do:
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
    // Mock dependencies
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
          // Simulate a successful validation by calling setImageFileCallback
          setImageFileCallback(event.target.files[0]);
          return true;
        }
      );

    const mockSetImageFile = vi.fn();
    const mockSetSelectedImagePreviewUrl = vi.fn();
    const mockSetErrorMessage = vi.fn();

    const mockFile = new File(["test content"], "test.jpg");

    const fileList = {
      0: mockFile,
      length: 1,
      item(index: number): File | null {
        return index === 0 ? mockFile : null;
      },
    } as unknown as FileList;

    const event = {
      target: {
        files: fileList,
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    // Mock URL.createObjectURL
    const mockObjectUrl = "mock-url";
    global.URL.createObjectURL = vi.fn().mockReturnValue(mockObjectUrl);

    // Call the function
    const result = validateAndSetFile(
      event,
      mockFileValidation,
      mockSetImageFile,
      mockSetSelectedImagePreviewUrl,
      mockSetErrorMessage,
      mockClearErrorMessage
    );

    // Assertions
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
    const mockSetErrorMessage = vi.fn();

    const event = { target: { files: [new File([], "invalid.jpg")] } } as any;

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
