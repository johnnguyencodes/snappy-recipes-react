import { fileValidation } from "../../lib/formUtils.ts";
import { describe, it, expect, vi } from "vitest";

describe("fileValidation", () => {
  it("should call showError with `errorNoFile` if no files are provided", () => {
    const mockEvent = { target: { files: null } } as any;
    const mockShowError = vi.fn();
    const mockSetImageFile = vi.fn();
    const result = fileValidation(mockEvent, mockShowError, mockSetImageFile);
    expect(result).toBe(false);
    expect(mockShowError).toHaveBeenCalledWith("errorNoFile");
    expect(mockSetImageFile).not.toHaveBeenCalled();
  });

  it("should call showError `errorFileExceedsSize` for a file that is too large", () => {
    const mockEvent = { target: { files: [{ size: 99999999999 }] } } as any;
    const mockShowError = vi.fn();
    const mockSetImageFile = vi.fn();
    const result = fileValidation(mockEvent, mockShowError, mockSetImageFile);
    expect(result).toBe(false);
    expect(mockShowError).toHaveBeenCalledWith("errorFileExceedsSize");
    expect(mockSetImageFile).not.toHaveBeenCalled();
  });

  it("should call showError with `errorIncorrectFile` for an invalid file type", () => {
    const mockEvent = { target: { files: [{ type: "text/plain" }] } } as any;
    const mockShowError = vi.fn();
    const mockSetImageFile = vi.fn();
    const result = fileValidation(mockEvent, mockShowError, mockSetImageFile);
    expect(result).toBe(false);
    expect(mockShowError).toHaveBeenCalledWith("errorIncorrectFile");
    expect(mockSetImageFile).not.toHaveBeenCalled();
  });

  it("should call setImageFile if the file type and size are valid", () => {
    const mockEvent = {
      target: { files: [{ type: "image/jpeg", size: 1 }] },
    } as any;
    const mockShowError = vi.fn();
    const mockSetImageFile = vi.fn();
    const result = fileValidation(mockEvent, mockShowError, mockSetImageFile);
    expect(result).toBe(true);
    expect(mockShowError).not.toHaveBeenCalled();
    expect(mockSetImageFile).toHaveBeenCalledWith({
      type: "image/jpeg",
      size: 1,
    });
  });
});
