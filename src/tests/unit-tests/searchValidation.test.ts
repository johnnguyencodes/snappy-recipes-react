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

  it("should return true if the query is exactly 50 characters long", () => {
    const mockShowError = vi.fn();
    const mockSetErrorMessage = vi.fn();
    const mockClearErrorMessage = vi.fn();

    const validQuery = "a".repeat(50);
    const result = searchValidation(
      validQuery,
      mockShowError,
      mockSetErrorMessage,
      mockClearErrorMessage
    );

    expect(result).toBe(true);
    expect(mockShowError).not.toHaveBeenCalled();
    expect(mockClearErrorMessage).toHaveBeenCalledWith(mockSetErrorMessage);
  });

  it("should return true if the query is exactly 1 character long", () => {
    const mockShowError = vi.fn();
    const mockSetErrorMessage = vi.fn();
    const mockClearErrorMessage = vi.fn();

    const validQuery = "a";
    const result = searchValidation(
      validQuery,
      mockShowError,
      mockSetErrorMessage,
      mockClearErrorMessage
    );

    expect(result).toBe(true);
    expect(mockShowError).not.toHaveBeenCalled();
    expect(mockClearErrorMessage).toHaveBeenCalledWith(mockSetErrorMessage);
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

  it("should return false and call showError for a query with mixed valid and invalid characters", () => {
    const mockShowError = vi.fn();
    const mockSetErrorMessage = vi.fn();
    const mockClearErrorMessage = vi.fn();

    const invalidQuery = "recipe123@home";
    const result = searchValidation(
      invalidQuery,
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

  it("should return false and cleare the error message for a whitespace-only query", () => {
    const mockShowError = vi.fn();
    const mockSetErrorMessage = vi.fn();
    const mockClearErrorMessage = vi.fn();

    const whitespaceQuery = "   ";
    const result = searchValidation(
      whitespaceQuery.trim(),
      mockShowError,
      mockSetErrorMessage,
      mockClearErrorMessage
    );

    expect(result).toBe(true);
    expect(mockShowError).not.toHaveBeenCalled();
    expect(mockClearErrorMessage).toHaveBeenCalledWith(mockSetErrorMessage);
  });

  it("should return true for a valid query containing spaces", () => {
    const mockShowError = vi.fn();
    const mockSetErrorMessage = vi.fn();
    const mockClearErrorMessage = vi.fn();

    const validQuery = "delicious recipe";
    const result = searchValidation(
      validQuery,
      mockShowError,
      mockSetErrorMessage,
      mockClearErrorMessage
    );

    expect(result).toBe(true);
    expect(mockShowError).not.toHaveBeenCalled();
    expect(mockClearErrorMessage).toHaveBeenCalledWith(mockSetErrorMessage);
  });
});
