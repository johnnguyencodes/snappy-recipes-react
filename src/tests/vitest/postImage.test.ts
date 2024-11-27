import { postImage } from "../../lib/apiUtils.ts";
import { describe, it, expect, vi } from "vitest";

const IMGUR_BASE_URL = "https://api.imgur.com/3/image";

describe("postImage", () => {
  it("should make a POST request to Imgur and return the response JSON on success", async () => {
    const mockFormData = new FormData();
    const mockAccessToken = "mocked_access_token";

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { link: "https://mocked.url" } }),
    });

    const response = await postImage(mockFormData, mockAccessToken);

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

  it("should throw an error if the response is not OK", async () => {
    const mockFormData = new FormData();
    const mockAccessToken = "mocked_access_token";

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Something went wrong test message" }),
    });

    await expect(postImage(mockFormData, mockAccessToken)).rejects.toThrow(
      "Error with imgur POST response"
    );
  });

  it("should throw an error if the fetch call fails", async () => {
    const mockFormData = new FormData();
    const mockAccessToken = "mocked_access_token";

    global.fetch = vi
      .fn()
      .mockRejectedValueOnce(new Error("Error with POSTing imgur file"));

    await expect(postImage(mockFormData, mockAccessToken)).rejects.toThrow(
      "Error with POSTing imgur file"
    );
  });

  it("should handle missing formData or accessToken gracefully", async () => {
    await expect(
      postImage(null as unknown as FormData, "mocked_access_token")
    ).rejects.toThrow("Error refreshing Imgur accessToken");

    await expect(
      postImage(new FormData(), null as unknown as string)
    ).rejects.toThrow("Error refreshing Imgur accessToken");
  });

  it("should include correct headers and form data in the request", async () => {
    const mockFormData = new FormData();
    const mockAccessToken = "mocked_access_token";

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    await postImage(mockFormData, mockAccessToken);

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
    const consoleSpy = vi.spyOn(console, "error");

    global.fetch = vi.fn().mockRejectedValueOnce(new Error("Network Error"));

    await expect(postImage(mockFormData, mockAccessToken)).rejects.toThrow();

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error with POSTing imgur file:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});
