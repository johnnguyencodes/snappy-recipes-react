import { appendImgurFormData } from "../../lib/apiUtils.ts";
import { describe, it, expect } from "vitest";

describe("appendImgurFormData", () => {
  it("should correctly append file data to FormData", () => {
    const mockFile = new File(["dummy content"], "test.jpg", {
      type: "image/jpeg",
    });
    const formData = appendImgurFormData(mockFile);

    expect(formData.has("image")).toBe(true);
    expect(formData.get("image")).toBe(mockFile);
    expect(formData.get("album")).toBe(import.meta.env.VITE_IMGUR_ALBUM_ID);
    expect(formData.get("privacy")).toBe("public");
  });
});
