import { defineConfig } from "vitest/config";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  test: {
    environment: "jsdom", // Set the test environment to jsdom
    globals: true, // Enable global variables like 'describe', 'test', etc.
    env: {
      VITE_SPOONACULAR_API_KEY:
        process.env.VITE_SPOONACULAR_API_KEY ||
        "mock-spoonacular-api-key-nfor-tests",
      VITE_IMGUR_CLIENT_ID:
        process.env.VITE_IMGUR_CLIENT_ID || "mock-imgur-client-id-for-tests",
      VITE_IMGUR_CLIENT_SECRET:
        process.env.VITE_IMGUR_CLIENT_SECRET ||
        "mock-imgur-client-secret-for-tests",
      VITE_IMGUR_ALBUM_ID:
        process.env.VITE_IMGUR_ALBUM_ID || "mock-imgur-album-id-for-tests",
      VITE_IMGUR_AUTHORIZATION_CODE:
        process.env.VITE_IMGUR_AUTHORIZATION_CODE ||
        "mock-imgur-authorization-code-for-tests",
      VITE_IMGUR_REFRESH_TOKEN:
        process.env.VITE_IMGUR_REFRESH_TOKEN ||
        "mock-imgur-refresh-token-for-tests",
      VITE_GOOGLE_API_KEY:
        process.env.VITE_GOOGLE_API_KEY || "mock-google-api-key-for-tests",
    },

    exclude: ["**/node_modules/**", "**/dist/**"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
