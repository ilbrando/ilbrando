# @ilbrando/rollup-plugin-combine-translations

A Rollup/Vite plugin that lets you keep [i18next](https://www.i18next.com/) translations next to the code that uses them and combines them into one resource object at build time.

## Installation

```bash
npm install --save-dev @ilbrando/rollup-plugin-combine-translations
```

## Usage

Add the plugin:

```ts
// vite.config.ts
import combineTranslations from "@ilbrando/rollup-plugin-combine-translations";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [combineTranslations()]
});
```

Declare translations in any `.ts`/`.tsx` file as a top level variable named `translations` typed as `Localization<...>`:

```ts
// src/core/user/user-i18n.ts
const k = {
  name: "core.user.user-i18n.name"
};

export const translations: Localization<typeof k> = {
  da: { name: "Navn" },
  en: { name: "Name" }
};
```

Import a `.trans` file. It is replaced by the translations from all files in its folder and sub folders, nested by folder and file name:

```ts
// src/i18n.ts
import translations from "./i18n.trans";
// => { da: { core: { user: { "user-i18n": { name: "Navn" } } } }, en: { ... } }

export const resources = {
  da: { translation: translations.da },
  en: { translation: translations.en }
};
```

The `.trans` file doesn't have to exist, but you need to tell TypeScript about the module:

```ts
// globals.d.ts
declare module "*.trans" {
  const content: import("@ilbrando/rollup-plugin-combine-translations").CombinedTranslations;
  export default content;
}
```

The [i18n tool](../i18n) works with the same `translations` objects.

## Options

| Option      | Default        | Description                                                                                                  |
| ----------- | -------------- | ------------------------------------------------------------------------------------------------------------ |
| `languages` | `["da", "en"]` | The languages allowed in `translations` objects. Every language is always present in the combined result.     |
| `extension` | `".trans"`     | Imports ending with this extension are replaced by the combined translations.                                |

## Rules

- Texts must be string literals or template literals without substitutions.
- Two files must not produce the same key (e.g. `user.ts` and `user.tsx` both defining `name`).
- Errors include the file and position of the problem.
