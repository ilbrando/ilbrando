import ilbrandoPlugin from "@ilbrando/eslint-plugin";

export default [
  {
    ...ilbrandoPlugin.configs.recommended,
    files: ["src/**/*.ts", "src/**/*.tsx"]
  },
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    languageOptions: {
      globals: {
        process: "readonly"
      }
    },
    rules: {
      "no-console": "off"
    }
  },
  {
    ignores: ["**/*.js"]
  }
];
