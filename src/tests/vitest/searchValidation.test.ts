import { searchValidation } from "../../lib/formUtils.ts";
import { describe, it, expect, vi } from "vitest";

describe("searchValidation", () => {
  it("should return true and clear the error message if the query is empty", () => {
    const mockShowError = vi.fn();
    const mockSetErrorMessage = vi.fn();
    const mockClearErrorMessage = vi.fn();
    const result = searchValidation(
      "",
      mockShowError,
      mockSetErrorMessage,
      mockClearErrorMessage
    );
    expect(result).toBe(true);
    expect(mockShowError).not.toHaveBeenCalled();
    expect(mockClearErrorMessage).toHaveBeenCalledWith(mockSetErrorMessage);
  });

  it("should return false and call showError if the query is longer than 50 characters", () => {
    const mockShowError = vi.fn();
    const mockSetErrorMessage = vi.fn();
    const mockClearErrorMessage = vi.fn();

    const longQuery = "a".repeat(51);
    const result = searchValidation(
      longQuery,
      mockShowError,
      mockSetErrorMessage,
      mockClearErrorMessage
    );

    expect(result).toBe(false);
    expect(mockShowError).toHaveBeenCalledWith(
      "errorSearchTooLong",
      mockSetErrorMessage,
      null
    );
    expect(mockClearErrorMessage).not.toHaveBeenCalled();
  });

  it("should return false and call showError if the query contains numbers", () => {
    const mockShowError = vi.fn();
    const mockSetErrorMessage = vi.fn();
    const mockClearErrorMessage = vi.fn();

    const queryWithNumbers = "recipe123";
    const result = searchValidation(
      queryWithNumbers,
      mockShowError,
      mockSetErrorMessage,
      mockClearErrorMessage
    );

    expect(result).toBe(false);
    expect(mockShowError).toHaveBeenCalledWith(
      "errorSearchInvalidCharacters",
      mockSetErrorMessage,
      null
    );
    expect(mockClearErrorMessage).not.toHaveBeenCalled();
  });

  it("should return false and call showError if the query contains special characters", () => {
    const mockShowError = vi.fn();
    const mockSetErrorMessage = vi.fn();
    const mockClearErrorMessage = vi.fn();

    const queryWithSpecialCharacters = "recipe@home";
    const result = searchValidation(
      queryWithSpecialCharacters,
      mockShowError,
      mockSetErrorMessage,
      mockClearErrorMessage
    );
    expect(result).toBe(false);
    expect(mockShowError).toHaveBeenCalledWith(
      "errorSearchInvalidCharacters",
      mockSetErrorMessage,
      null
    );
    expect(mockClearErrorMessage).not.toHaveBeenCalled();
  });
});
