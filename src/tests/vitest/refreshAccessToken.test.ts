import { refreshAccessToken } from "../../lib/apiUtils.ts";
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("refreshAccessToken", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return the access token on a successful response", async () => {
    const mockShowError = vi.fn();
    const mockSetErrorMessage = vi.fn();

    // Mock a successful fetch response
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: "mocked_access_token" }),
    });

    const result = await refreshAccessToken(mockShowError, mockSetErrorMessage);
    expect(result).toBe("mocked_access_token");
    expect(fetch).toHaveBeenCalledWith("https://api.imgur.com/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: expect.any(URLSearchParams),
    });
  });

  it("should return null on a failed response", async () => {
    const mockShowError = vi.fn();
    const mockSetErrorMessage = vi.fn();

    // Mock a failed fetch response
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Some error occurred" }),
    });

    const result = await refreshAccessToken(mockShowError, mockSetErrorMessage);
    expect(result).toBeNull();
    expect(fetch).toHaveBeenCalled();
  });

  it("should return null and log an error if fetch throws an error", async () => {
    const mockShowError = vi.fn();
    const mockSetErrorMessage = vi.fn();

    // Mock a network error
    global.fetch = vi.fn().mockRejectedValueOnce(new Error("Network error"));

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const result = await refreshAccessToken(mockShowError, mockSetErrorMessage);
    expect(result).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error refreshing token:",
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore(); // Restore original console.error
  });
});
