import type { FlatConfig } from "@typescript-eslint/utils/ts-eslint";
import eslintJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import stylisticPlugin from "@stylistic/eslint-plugin";
import perfectionistPlugin from "eslint-plugin-perfectionist";
import pkg from "../package.json" with { type: "json" };
import { defineConfig } from "eslint/config";
import { reduxSliceName, ruleName as reduxSliceNameRuleName } from "./rules/redux-slice-name";
import { ruleName as i18nKeyNameRuleName, i18nKeyName } from "./rules/i18n-key-name";

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

      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
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
      perfectionist: perfectionistPlugin,
      "@stylistic": stylisticPlugin
    },
    rules: {
      "react-hooks/exhaustive-deps": "error",
      "@stylistic/jsx-curly-brace-presence": ["error", { props: "never", children: "never" }],
      "perfectionist/sort-jsx-props": [
        "error",
        {
          type: "alphabetical",
          order: "asc",
          ignoreCase: true,
          groups: ["reserved", "className", "formManager", "formFieldName", "formValue", "formLabel", "formPlaceholder", "formErrorMessage", "unknown", "multiline", "boolean", "shorthand", "callback"],
          customGroups: {
            reserved: "^(key|ref)$",
            className: "^(className[s]?)$",
            formManager: "^(formManager)$",
            formFieldName: "^(fieldName)$",
            formValue: "^(value|checked)$",
            formLabel: "^(label)$",
            formPlaceholder: "^(label)$",
            formErrorMessage: "^(errorMessage)$",
            boolean: "^(is[A-Z]|disabled|required|readonly|error)",
            callback: "^on[A-Z]"
          }
        }
      ]
    }
  }
]);

const rules = {
  [reduxSliceNameRuleName]: reduxSliceName,
  [i18nKeyNameRuleName]: i18nKeyName
};

const configs = { base, react };

const plugin: FlatConfig.Plugin & { configs: typeof configs; rules: typeof rules } = {
  meta: {
    name: pkg.name,
    version: pkg.version
  },
  rules,
  configs
};

export default plugin;
