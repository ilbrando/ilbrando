import ilbrandoPlugin from "@ilbrando/eslint-plugin";

export default [
  ...ilbrandoPlugin.configs.react,
  {
    files: ["src/**/*.ts", "src/**/*.tsx"]
  },
  {
    ignores: ["**/*.js"]
  }
];
