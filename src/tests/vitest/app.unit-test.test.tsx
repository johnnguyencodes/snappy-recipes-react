import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { expect, it, test, vi } from "vitest";
import React from "react";
import App from "../../App";

// simple test
const add = (a: number, b: number) => a + b;
it("should add two numbers", () => {
  expect(add(2, 4)).toBe(6);
});
