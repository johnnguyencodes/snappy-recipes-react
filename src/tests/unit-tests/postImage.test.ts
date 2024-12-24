import { postImage } from "../../lib/apiUtils.ts";
import { describe, it, expect, vi, afterEach } from "vitest";

const IMGUR_BASE_URL = "https://api.imgur.com/3/image";

describe("postImage", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });
  it("should make a POST request to Imgur and return the response JSON on success", async () => {
    const mockFormData = new FormData();
    const mockAccessToken = "mocked_access_token";
    const mockShowError = vi.fn();
    const mockSetErrorMessage = vi.fn();

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { link: "https://mocked.url" } }),
    });

    const response = await postImage(
      mockFormData,
      mockAccessToken,
      mockShowError,
      mockSetErrorMessage
    );

    expect(fetch).toHaveBeenCalledWith(IMGUR_BASE_URL, {
      method: "POST",
      body: mockFormData,
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${mockAccessToken}`,
      },
    });
    expect(response).toEqual({ data: { link: "https://mocked.url" } });
  });

  it("should throw an error if the fetch call fails", async () => {
    const mockFormData = new FormData();
    const mockAccessToken = "mocked_access_token";
    const mockShowError = vi.fn();
    const mockSetErrorMessage = vi.fn();

    global.fetch = vi
      .fn()
      .mockRejectedValueOnce(new Error("Error with POSTing imgur file"));

    await expect(
      postImage(
        mockFormData,
        mockAccessToken,
        mockShowError,
        mockSetErrorMessage
      )
    ).rejects.toThrow("Error with POSTing imgur file");
  });

  it("should handle missing formData or accessToken gracefully", async () => {
    const mockShowError = vi.fn();
    const mockSetErrorMessage = vi.fn();

    await expect(
      postImage(
        null as unknown as FormData,
        "mocked_access_token",
        mockShowError,
        mockSetErrorMessage
      )
    ).rejects.toThrow("Missing formData or accessToken for posting image");

    await expect(
      postImage(
        new FormData(),
        null as unknown as string,
        mockShowError,
        mockSetErrorMessage
      )
    ).rejects.toThrow("Missing formData or accessToken for posting image");

    expect(mockShowError).toHaveBeenCalledWith(
      "errorPostImageData",
      mockSetErrorMessage,
      null
    );
  });

  it("should include correct headers and even if the formData is empty", async () => {
    const mockFormData = new FormData();
    const mockAccessToken = "mocked_access_token";
    const mockShowError = vi.fn();
    const mockSetErrorMessage = vi.fn();

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    await postImage(
      mockFormData,
      mockAccessToken,
      mockShowError,
      mockSetErrorMessage
    );

    expect(fetch).toHaveBeenCalledWith(IMGUR_BASE_URL, {
      method: "POST",
      body: mockFormData,
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${mockAccessToken}`,
      },
    });
  });

  it("should log an error to the console when fetch fails", async () => {
    const mockFormData = new FormData();
    const mockAccessToken = "mocked_access_token";
    const mockShowError = vi.fn();
    const mockSetErrorMessage = vi.fn();
    const consoleSpy = vi.spyOn(console, "error");

    global.fetch = vi
      .fn()
      .mockRejectedValueOnce(new Error("Unexpected Network Error"));

    await expect(
      postImage(
        mockFormData,
        mockAccessToken,
        mockShowError,
        mockSetErrorMessage
      )
    ).rejects.toThrow("Unexpected Network Error");

    expect(mockShowError).toHaveBeenCalledWith(
      "errorPostImage",
      mockSetErrorMessage,
      null
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error with POSTing imgur file:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});
