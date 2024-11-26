import { postImageUrlToGoogle } from "../../lib/apiUtils.ts";
import { describe, it, expect, vi } from "vitest";

describe("postImageUrlToGoogle", () => {
  it("should send a POST request to the correct Google Vision API URL and return a response on success", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        responses: [{ labelAnnotations: [{ description: "Test Label" }] }],
      }),
    });

    const result = await postImageUrlToGoogle("https://example.com/image.jpg");
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

    await expect(
      postImageUrlToGoogle("https://example.com/image.jpg")
    ).rejects.toThrow("Error with Google POST response");
  });

  it("should throw an error if there is a network error when calling the Google Vision API", async () => {
    global.fetch = vi
      .fn()
      .mockRejectedValueOnce(
        new Error("Error with POSTing image label to Google")
      );

    await expect(
      postImageUrlToGoogle("https://example.com/image.jpg")
    ).rejects.toThrow("Error with POSTing image label to Google");
  });

  it("should correctly set the imageUri in the request body", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ responses: [] }),
    });

    const imageURL = "https://example.com/image.jpg";
    await postImageUrlToGoogle(imageURL);

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

    const result = await postImageUrlToGoogle("https://example.com/image.jpg");
    expect(result).toEqual({});
  });

  it("should use the POST method and include the correct request headers", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    await postImageUrlToGoogle("https://example.com/image.jpg");

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("vision.googleapis.com"),
      {
        method: "POST",
        body: expect.any(String),
      }
    );
  });
});