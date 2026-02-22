import js from "@eslint/js";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      "no-unused-vars": "off",
    },
  },

  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: { globals: globals.browser },
  },

  // TypeScript
  {
    files: ["**/*.{ts,tsx}"],
    ...tseslint.configs.recommended[0],
    rules: {
      "@typescript-eslint/no-unused-vars": ["error"],
    },
  },

  // React
  { settings: { react: { version: "detect" } } },
  {
    files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
    ...reactPlugin.configs.flat.recommended,
    ...reactHooks.configs.flat["recommended-latest"],
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
