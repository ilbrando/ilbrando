import { rules } from "./rules/index.js";
import type { FlatConfig } from "@typescript-eslint/utils/ts-eslint";
import eslintJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import perfectionistPlugin from "eslint-plugin-perfectionist";
import pkg from "../package.json" with { type: "json" };
import { defineConfig } from "eslint/config";

const base = defineConfig([
  { ignores: ["**/dist/**"] },
  eslintJs.configs.recommended,
  tseslint.configs.strict,
  eslintConfigPrettier,
  {
    plugins: {
      "simple-import-sort": simpleImportSort
    },
    rules: {
      "array-callback-return": "error",
      "no-console": "error",
      "no-duplicate-imports": "error",
      "no-promise-executor-return": "error",
      "no-self-compare": "error",
      "no-template-curly-in-string": "error",
      "no-use-before-define": "error",

      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", { varsIgnorePattern: "^_", argsIgnorePattern: "^_" }],

      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error"
    }
  }
]);

const react = defineConfig([
  ...base,
  reactHooksPlugin.configs["recommended-latest"],
  {
    plugins: {
      perfectionist: perfectionistPlugin
    },
    rules: {
      "react-hooks/exhaustive-deps": "error",
      "perfectionist/sort-jsx-props": [
        "error",
        {
          type: "alphabetical",
          order: "asc",
          ignoreCase: true,
          groups: ["reserved", "unknown", "multiline", "shorthand", "callback"],
          customGroups: {
            reserved: "^(key|ref)$",
            callback: "^on[A-Z]"
          }
        }
      ]
    }
  }
]);

const configs = { base, react };

const plugin: FlatConfig.Plugin & { configs: typeof configs } = {
  meta: {
    name: pkg.name,
    version: pkg.version
  },
  rules,
  configs
};

export default plugin;
