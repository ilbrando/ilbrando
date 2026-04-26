import ilbrandoPlugin from "@ilbrando/eslint-plugin";

export default [
  {
    ...ilbrandoPlugin.configs.recommended,
    files: ["src/**/*.ts", "src/**/*.tsx"]
  },
  {
    ignores: ["**/*.js"]
  }
];
