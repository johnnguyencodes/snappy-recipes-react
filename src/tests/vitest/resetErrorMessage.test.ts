import { resetErrorMessage } from "../../lib/formUtils.ts";
import { describe, it, expect, vi } from "vitest";

describe("resetErrorMessage", () => {
  it("should call setErrorMessage with an empty string", () => {
    const mockSetErrorMessage = vi.fn();
    resetErrorMessage(mockSetErrorMessage);
    expect(mockSetErrorMessage).toHaveBeenCalledWith("");
  });

  it("should call setErrorMessage exactly once", () => {
    const mockSetErrorMessage = vi.fn();
    resetErrorMessage(mockSetErrorMessage);
    expect(mockSetErrorMessage).toHaveBeenCalledOnce();
  });
});
