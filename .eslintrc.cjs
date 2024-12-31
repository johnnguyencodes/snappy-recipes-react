const globals = require("globals");

module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022, // Aligns with your .eslintrc.json
    sourceType: "module", // ECMAScript modules
    ecmaFeatures: {
      jsx: true, // Enable JSX parsing
    },
  },
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  globals: {
    ...globals.browser, // Browser environment
    React: "writable", // React as a global variable
  },
  plugins: [
    "@typescript-eslint",
    "react-refresh",
    "react",
    "import",
    "jsx-a11y",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended", // TypeScript recommended rules
    "plugin:import/errors", // Import plugin rules
    "plugin:react/recommended", // React recommended rules
    "plugin:jsx-a11y/recommended", // Accessibility plugin rules
    "next/core-web-vitals", // Next.js core web vitals
    "prettier", // Prettier integration for code formatting
  ],
  ignorePatterns: ["dist/", ".eslintrc.cjs"], // Use 'ignorePatterns' instead of 'ignores'
  rules: {
    // React-specific rules
    "react/prop-types": "off", // Disable prop-types rule
    "react/jsx-uses-react": "off", // Disable react import requirement in JSX
    "react/react-in-jsx-scope": "off", // Disable React in scope rule

    // React Refresh
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],

    // Additional custom rules can be added here
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",    // Ignore unused function arguments starting with _
        "varsIgnorePattern": "^_",    // Ignore unused variables starting with _
      }
    ]
  },
  settings: {
    react: {
      version: "detect", // Automatically detect React version
    },
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"], // Resolve these file extensions
      },
    },
  },
};
