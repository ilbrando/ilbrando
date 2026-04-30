import ilbrandoPlugin from "@ilbrando/eslint-plugin";

export default [
  ...ilbrandoPlugin.configs.base,
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    rules: {
      "no-console": "off"
    }
  },
  {
    ignores: ["**/*.js"]
  }
];
