import { rules } from "./rules/index.js";
import type { FlatConfig } from "@typescript-eslint/utils/ts-eslint";
import eslintJs from "@eslint/js";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import eslintConfigPrettier from "eslint-config-prettier";
import reactPlugin from "eslint-plugin-react";
import pkg from "../package.json" with { type: "json" };
import { defineConfig } from "eslint/config";

const base = defineConfig([
  eslintJs.configs.recommended,
  tseslint.configs.strict,
  eslintConfigPrettier,
  importPlugin.flatConfigs.recommended,
  {
    rules: {
      "array-callback-return": "warn",
      "no-console": "warn",
      "no-duplicate-imports": "warn",
      "no-promise-executor-return": "warn",
      "no-self-compare": "warn",
      "no-template-curly-in-string": "warn",
      "no-use-before-define": "warn",
      "sort-imports": [
        "warn",
        {
          ignoreCase: true
        }
      ],

      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "error"
    }
  }
]);

const react = defineConfig([...base, reactPlugin.configs.flat.recommended]);

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
