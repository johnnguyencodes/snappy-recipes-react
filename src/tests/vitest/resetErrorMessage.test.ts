import { clearErrorMessage } from "../../lib/formUtils.ts";
import { describe, it, expect, vi } from "vitest";

describe("clearErrorMessage", () => {
  it("should call setErrorMessage with an empty string", () => {
    const mockSetErrorMessage = vi.fn();
    clearErrorMessage(mockSetErrorMessage);
    expect(mockSetErrorMessage).toHaveBeenCalledWith("");
  });

  it("should call setErrorMessage exactly once", () => {
    const mockSetErrorMessage = vi.fn();
    clearErrorMessage(mockSetErrorMessage);
    expect(mockSetErrorMessage).toHaveBeenCalledOnce();
  });
});
