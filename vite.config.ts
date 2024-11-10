import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

export default defineConfig(({ command, mode }) => {
  // Load .env file for the current mode (development, production, etc.)
  dotenv.config();

  // Load Vite-specific environment variables
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        // $lib: path.resolve(__dirname, "./src/lib"),
        // $components: path.resolve(__dirname, "./src/components"),
      },
    },
    define: {
      // Merge the environment variables with Vite’s define option
      "process.env": { ...process.env, ...env },
    },
  };
});
