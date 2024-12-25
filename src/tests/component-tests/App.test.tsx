import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, vi, expect, afterEach } from "vitest";
import App from "../../App";

describe("App Component", () => {
  const mockResponse = {
    results: [{ id: 1, name: "Pizza" }],
    totalResults: 1,
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("enters a search query by pressing enter", async () => {
    global.fetch = vi.fn(
      async (
        input: RequestInfo | URL,
        _init?: RequestInit
      ): Promise<Response> => {
        const url = typeof input === "string" ? input : input.toString();

        if (url.includes("imgur")) {
          return new Response(JSON.stringify({}), {
            status: 200,
            statusText: "OK",
          });
        } else if (url.includes("spoonacular")) {
          return new Response(
            JSON.stringify({
              ok: true,
              ...mockResponse,
            }),
            { status: 200, statusText: "OK" }
          );
        }
        return Promise.reject(new Error("Unexpected API call: " + url));
      }
    ) as typeof fetch; // Tells TS this mock is the same type as fetch

    render(<App />);

    const input = screen.getByTestId("text-input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "pizza" } });

    // Ensure the input value is updated before pressing Enter
    await waitFor(() => {
      expect(input.value).toBe("pizza");
    });

    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(3);

      expect(global.fetch).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining("https://api.imgur.com/oauth2/token"),
        expect.objectContaining({
          method: "POST",
        })
      );

      expect(global.fetch).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining("query=&"),
        expect.any(Object)
      );

      expect(global.fetch).toHaveBeenNthCalledWith(
        3,
        expect.stringContaining("query=pizza"),
        expect.any(Object)
      );
    });
  });

  it("enters a search query by clicking the submit button", async () => {
    // Mock fetch calls
    global.fetch = vi.fn(
      async (
        input: RequestInfo | URL,
        _init?: RequestInit
      ): Promise<Response> => {
        const url = typeof input === "string" ? input : input.toString();

        if (url.includes("imgur")) {
          return new Response(JSON.stringify({}), {
            status: 200,
            statusText: "OK",
          });
        } else if (url.includes("spoonacular")) {
          return new Response(
            JSON.stringify({
              ok: true,
              ...mockResponse,
            }),
            { status: 200, statusText: "OK" }
          );
        }
        return Promise.reject(new Error("Unexpected API call: " + url));
      }
    ) as typeof fetch; // Tells TS this mock is the same type as fetch

    render(<App />);

    const input = screen.getByTestId("text-input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "pizza" } });

    // Ensure the input value is updated before pressing Enter
    await waitFor(() => {
      expect(input.value).toBe("pizza");
    });

    const submitButton = screen.getByTestId("submit");
    fireEvent.click(submitButton);

    // 5) Assert the 3rd fetch call is made with query=pizza
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(3);

      expect(global.fetch).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining("https://api.imgur.com/oauth2/token"),
        expect.objectContaining({
          method: "POST",
        })
      );

      expect(global.fetch).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining("query=&"),
        expect.any(Object)
      );

      expect(global.fetch).toHaveBeenNthCalledWith(
        3,
        expect.stringContaining("query=pizza"),
        expect.any(Object)
      );
    });
  });
});
