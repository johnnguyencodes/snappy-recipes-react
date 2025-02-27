import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

export default defineConfig(({ mode }) => {
  // Load .env file for the current mode (development, production, etc.)
  dotenv.config();

  // Load Vite-specific environment variables
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    base: mode === "production" ? "/snappy-recipes-react/" : "",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      // Merge the environment variables with Vite’s define option
      "process.env": { ...process.env, ...env },
    },
  };
});
