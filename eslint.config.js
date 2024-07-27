import globals from "globals"
import eslint from "@eslint/js"
import tseslint from "typescript-eslint"
import pluginAstro from "eslint-plugin-astro"
import pluginReact from "eslint-plugin-react"
import prettier from "eslint-plugin-prettier/recommended"
import { includeIgnoreFile } from "@eslint/compat"
import path from "node:path"
import { fileURLToPath } from "node:url"

import tsParser from "@typescript-eslint/parser"
import tsPlugin from "@typescript-eslint/eslint-plugin"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.resolve(__dirname, ".gitignore")

export default [
  includeIgnoreFile(gitignorePath),
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  prettier,
  {
    rules: {
      "no-console": "error",
      "no-undef": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
    },
  },
  {
    files: ["*.tsx", "*.ts"],
    ...tseslint.configs.strictTypeChecked,
    plugins: {
      react: pluginReact,
      "@typescript-eslint": tsPlugin,
    },
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigDirName: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
      parser: tsParser,
    },
    rules: {
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
      "react/react-in-jsx-scope": "off",
    },
  },
  {
    files: ["*.astro"],
    ...pluginAstro.configs.recommended,
  },
]
