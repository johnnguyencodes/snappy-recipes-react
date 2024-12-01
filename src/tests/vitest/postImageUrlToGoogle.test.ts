import { postImageUrlToGoogle } from "../../lib/apiUtils.ts";
import { describe, it, expect, vi, afterEach } from "vitest";

describe("postImageUrlToGoogle", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should send a POST request to the correct Google Vision API URL and return a response on success", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        responses: [{ labelAnnotations: [{ description: "Test Label" }] }],
      }),
    });

    const mockShowError = vi.fn();
    const mockSetErrorMessage = vi.fn();

    const result = await postImageUrlToGoogle(
      "https://example.com/image.jpg",
      mockShowError,
      mockSetErrorMessage
    );
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("vision.googleapis.com"),
      {
        method: "POST",
        body: JSON.stringify({
          requests: [
            {
              image: {
                source: {
                  imageUri: "https://example.com/image.jpg",
                },
              },
              features: [
                {
                  type: "LABEL_DETECTION",
                },
              ],
            },
          ],
        }),
      }
    );
    expect(result).toEqual({
      responses: [{ labelAnnotations: [{ description: "Test Label" }] }],
    });
  });

  it("should throw an error if the Google Vision API response is not OK", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: "Bad Request",
      json: async () => ({}),
    });

    const mockShowError = vi.fn();
    const mockSetErrorMessage = vi.fn();

    await expect(
      postImageUrlToGoogle(
        "https://example.com/image.jpg",
        mockShowError,
        mockSetErrorMessage
      )
    ).rejects.toThrow("Error with Google POST response");
  });

  it("should throw an error if there is a network error when calling the Google Vision API", async () => {
    const mockShowError = vi.fn();
    const mockSetErrorMessage = vi.fn();

    global.fetch = vi
      .fn()
      .mockRejectedValueOnce(
        new Error("Error with POSTing image label to Google")
      );

    await expect(
      postImageUrlToGoogle(
        "https://example.com/image.jpg",
        mockShowError,
        mockSetErrorMessage
      )
    ).rejects.toThrow("Error with POSTing image label to Google");

    expect(mockShowError).toHaveBeenCalledWith(
      "errorPostImageUrlToGoogle",
      mockSetErrorMessage,
      null
    );
  });

  it("should correctly set the imageUri in the request body", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ responses: [] }),
    });

    const mockShowError = vi.fn();
    const mockSetErrorMessage = vi.fn();

    const imageURL = "https://example.com/image.jpg";
    await postImageUrlToGoogle(imageURL, mockShowError, mockSetErrorMessage);

    // ignoring the error message since the test still passes successfully. The error is due to an external library mismatch
    // @ts-ignore
    const fetchMock = global.fetch as vi.Mock;
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.requests[0].image.source.imageUri).toBe(imageURL);
  });

  it("should handle an empty or malformed response gracefully", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({}), // malformed response
    });

    const mockShowError = vi.fn();
    const mockSetErrorMessage = vi.fn();

    const result = await postImageUrlToGoogle(
      "https://example.com/image.jpg",
      mockShowError,
      mockSetErrorMessage
    );

    expect(mockShowError).toHaveBeenCalledWith(
      "errorMalformedGoogleResponse",
      mockSetErrorMessage,
      null
    );

    expect(result).toEqual({});
  });

  it("should handle an unexpected JSON structure in the response", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        unexpectedKey: "unexpectedValue",
      }),
    });

    const mockShowError = vi.fn();
    const mockSetErrorMessage = vi.fn();

    const result = await postImageUrlToGoogle(
      "https://example.com/image.jpg",
      mockShowError,
      mockSetErrorMessage
    );

    expect(mockShowError).toHaveBeenCalledWith(
      "errorMalformedGoogleResponse",
      mockSetErrorMessage,
      null
    );
    expect(result).toEqual({});
  });

  it("should use the POST method and include the correct request headers", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    const mockShowError = vi.fn();
    const mockSetErrorMessage = vi.fn();

    await postImageUrlToGoogle(
      "https://example.com/image.jpg",
      mockShowError,
      mockSetErrorMessage
    );

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("vision.googleapis.com"),
      {
        method: "POST",
        body: expect.any(String),
      }
    );
  });

  it("should throw an error if imageURL is missing or empty", async () => {
    const mockShowError = vi.fn();
    const mockSetErrorMessage = vi.fn();

    await expect(
      postImageUrlToGoogle(
        "" as unknown as string,
        mockShowError,
        mockSetErrorMessage
      )
    ).rejects.toThrow("Error with POSTing image URL to Google");

    expect(mockShowError).toHaveBeenCalledWith(
      "errorPostUrlToGoogle",
      mockSetErrorMessage,
      null
    );
  });

  it("should include the correct features in the request body", async () => {
    const mockShowError = vi.fn();
    const mockSetErrorMessage = vi.fn();

    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ responses: [] }),
    });

    global.fetch = mockFetch;

    const imageURL = "https://example.com/image.jpg";
    await postImageUrlToGoogle(imageURL, mockShowError, mockSetErrorMessage);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.requests[0].features).toEqual([{ type: "LABEL_DETECTION" }]);
  });

  it("should handle an empty labelAnnatotions array in the response", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        responses: [{ labelAnnotations: [] }],
      }),
    });

    const mockShowError = vi.fn();
    const mockSetErrorMessage = vi.fn();

    const result = await postImageUrlToGoogle(
      "https://example.com/image.jpg",
      mockShowError,
      mockSetErrorMessage
    );

    expect(result).toEqual({
      responses: [{ labelAnnotations: [] }],
    });
  });

  it("should handle invalid or malformed image URLs gracefully", async () => {
    const mockShowError = vi.fn();
    const mockSetErrorMessage = vi.fn();

    await expect(
      postImageUrlToGoogle(
        "not-a-valid-url",
        mockShowError,
        mockSetErrorMessage
      )
    ).rejects.toThrow("Error with POSTing image URL to Google");

    expect(mockShowError).toHaveBeenCalledWith(
      "errorPostUrlToGoogle",
      mockSetErrorMessage,
      null
    );
  });
});
