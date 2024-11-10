import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { expect, it, test, vi } from "vitest";
import React from "react";
import App from "../../App";

test("calls fetch when Enter is pressed", async () => {
  const mockResponse = {
    results: [{ id: 1, name: "Pizza" }],
  };

  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => mockResponse,
  });

  render(<App />);

  const input = screen.getByPlaceholderText(
    "Drag an ingredient here or type to search"
  );
  fireEvent.change(input, { target: { value: "pizza" } });

  fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("query=pizza"),
      expect.any(Object)
    );
  });
});

test("calls fetch when Submit button is clicked", async () => {
  const mockResponse = {
    results: [{ id: 1, name: "Pizza" }],
  };

  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => mockResponse,
  });

  render(<App />);

  const input = screen.getByPlaceholderText(
    "Drag an ingredient here or type to search"
  );
  fireEvent.change(input, { target: { value: "pizza" } });

  const button = screen.getByText("Submit");
  fireEvent.click(button);

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("query=pizza"),
      expect.any(Object)
    );
  });
});

// simple test
const add = (a: number, b: number) => a + b;
it("should add two numbers", () => {
  expect(add(2, 4)).toBe(6);
});
