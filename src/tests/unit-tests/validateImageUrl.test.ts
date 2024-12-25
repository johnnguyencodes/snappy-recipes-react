import { validateImageUrl } from "../../lib/appUtils.ts";
import { describe, it, expect, vi, afterEach } from "vitest";

describe("validateImageUrl", () => {
  afterEach(() => {
    global.Image = window.Image;
  });

  it("should return the original URL if the image loads successfully", async () => {
    const validUrl = "https://example.com/valid-image.jpg";
    const fallbackUrl = "https://example.com/fallback-image.jpg";

    global.Image = class {
      onload!: () => void;
      src!: string;
      constructor() {
        setTimeout(() => this.onload(), 10); // Simulate successful image loading
      }
    } as unknown as typeof Image;

    const result = await validateImageUrl(validUrl, fallbackUrl);
    expect(result).toBe(validUrl);
  });

  it("should return the fallback URL if the image files to load", async () => {
    const invalidUrl = "https://example.com/invalid-image.jpg";
    const fallbackUrl = "https://example.com/fallback-image.jpg";

    global.Image = class {
      onerror!: () => void;
      src!: string;
      constructor() {
        setTimeout(() => this.onerror(), 10); // Simulate image load failure
      }
    } as unknown as typeof Image;

    const result = await validateImageUrl(invalidUrl, fallbackUrl);
    expect(result).toBe(fallbackUrl);
  });

  it("should return the fallback URL if the provided URL is empty", async () => {
    const emptyUrl = "";
    const fallbackUrl = "https://example.com/fallback-image.jpg";

    const result = await validateImageUrl(emptyUrl, fallbackUrl);
    expect(result).toBe(fallbackUrl);
  });

  it("should set the Image.src property to the provided URL", async () => {
    const testUrl = "https://example.com/test-image.jpg";
    const fallbackUrl = "https://example.com/fallback-image.jpg";

    const mockSetSrc = vi.fn();

    global.Image = class {
      set src(value: string) {
        mockSetSrc(value);
      }
      onload!: () => void;
      constructor() {
        setTimeout(() => this.onload(), 10); // Simulate successful image loading
      }
    } as unknown as typeof Image;

    await validateImageUrl(testUrl, fallbackUrl);
    expect(mockSetSrc).toHaveBeenCalledWith(testUrl);
  });

  it("should handle delayed image loading correctly", async () => {
    const validUrl = "https://example.com/valid-image.jpg";
    const fallbackUrl = "https://example.com/fallback-image.jpg";

    global.Image = class {
      onload!: () => void;
      src!: string;
      constructor() {
        setTimeout(() => this.onload(), 500); // Simulate delayed successful image loading
      }
    } as unknown as typeof Image;

    const result = await validateImageUrl(validUrl, fallbackUrl);
    expect(result).toBe(validUrl);
  });
});
