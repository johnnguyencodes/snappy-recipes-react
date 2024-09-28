import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "@typescript-eslint/eslint-plugin"; // Correct import
import tsParser from "@typescript-eslint/parser"; // Add parser for TypeScript

export default {
  ignores: ["dist"],
  extends: [
    js.configs.recommended, // Base JS recommended rules
    tseslint.configs.recommended, // TypeScript recommended rules
    "eslint:recommended", // From your .eslintrc.json
    "plugin:import/errors", // Import plugin for managing imports
    "plugin:react/recommended", // React recommended rules
    "plugin:jsx-a11y/recommended", // Accessibility plugin for JSX
    "plugin:react-hooks/recommended", // React hooks recommended rules
    "prettier", // Prettier integration for code formatting
    "next/core-web-vitals", // Next.js core vitals for performance checks
  ],
  files: ["**/*.{ts,tsx,js,jsx}"],
  languageOptions: {
    ecmaVersion: 2022, // Aligns with your .eslintrc.json
    sourceType: "module", // ECMAScript modules
    globals: {
      ...globals.browser, // Browser environment
      React: "writable", // React as a global variable (from .eslintrc.json)
    },
    ecmaFeatures: {
      jsx: true, // Enable JSX parsing
    },
    parser: tsParser, // Use TypeScript parser
  },
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  plugins: {
    "react-hooks": reactHooks, // React hooks plugin
    "react-refresh": reactRefresh, // React refresh for hot reloading
    react: "eslint-plugin-react", // React plugin from your .eslintrc.json
    import: "eslint-plugin-import", // Import plugin from your .eslintrc.json
    "jsx-a11y": "eslint-plugin-jsx-a11y", // Accessibility plugin from .eslintrc.json
  },
  rules: {
    // React-specific rules
    "react/prop-types": "off", // Disable prop-types rule (from .eslintrc.json)
    "react/jsx-uses-react": "off", // Disable react import requirement in JSX (for React 17+)
    "react/react-in-jsx-scope": "off", // Disable React import in scope rule for React 17+

    // React hooks
    ...reactHooks.configs.recommended.rules, // React hooks recommended rules
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],

    // Additional rules from .eslintrc.json
    // Add more custom rules here as necessary
  },
  settings: {
    react: {
      version: "detect", // Automatically detect the React version
    },
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"], // Resolve these file extensions
      },
    },
  },
};
