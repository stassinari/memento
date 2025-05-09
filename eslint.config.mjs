import js from "@eslint/js";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import reactPlugin from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
  },

  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: { globals: globals.browser },
  },

  // TypeScript
  {
    files: ["**/*.{ts,tsx}"],
    ...tseslint.configs.recommended[0],
  },

  // React
  { settings: { react: { version: "detect" } } },
  {
    files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
    ...reactPlugin.configs.flat.recommended,
    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
      globals: { ...globals.serviceworker, ...globals.browser },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
    },
  },

  // JSON
  {
    plugins: {
      json,
    },
    files: ["**/*.json"],
    language: "json/json",
    ...json.configs["recommended"],
  },

  // Markdown
  {
    files: ["**/*.md"],
    plugins: { markdown },
    language: "markdown/gfm",
    rules: { "markdown/no-html": "error" },
  },
]);
