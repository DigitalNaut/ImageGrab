import globals from "globals";
import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";

import typescriptParser from "@typescript-eslint/parser";
import viteReact from "@vitejs/plugin-react-swc";
import typescript from "@typescript-eslint/eslint-plugin";
import reactRecommended from "eslint-plugin-react";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";

import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat();

export default [
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    ignores: ["watch.js", "dist/"],
    plugins: {},
    rules: {
      "no-use-before-define": "error",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.webextensions,
        ...globals.browser,
        JSX: "readonly",
        MutationCallback: "readonly",
        MutationObserverInit: "readonly",
      },
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    files: ["src/**/*.ts", "src/**/*.tsx"],
    plugins: {
      viteReact: viteReact(),
      typescript,
      reactRecommended,
      importPlugin,
      prettier,
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "tailwindcss/no-custom-classname": "error",
      "no-use-before-define": "error",
      "array-callback-return": "warn",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
  eslint.configs.recommended,
  eslintConfigPrettier,
  ...compat.config({
    extends: [
      "plugin:react-hooks/recommended",
      "plugin:tailwindcss/recommended",
    ],
    rules: {},
  }),
  eslint.configs.recommended,
  eslintConfigPrettier,
];
