import path from "node:path";

import { hasValue } from "@ilbrando/utils";

import { combineTranslations } from "./combine-translations.js";
import type { CombineTranslationsOptions } from "./types.js";

export type { CombinedTranslations, CombineTranslationsOptions, TranslationTree } from "./types.js";

type PluginContext = {
  addWatchFile: (id: string) => void;
};

/** The plugin is described structurally, so it can be used with Rollup, Rolldown and Vite without depending on their types. */
export type CombineTranslationsPlugin = {
  name: string;
  resolveId: (source: string, importer: string | undefined) => string | null;
  load: (this: PluginContext, id: string) => Promise<{ code: string; moduleType: "js" } | null>;
};

/**
 * Rollup/Vite plugin that replaces an import of a `.trans` file with the combined translations
 * of all the `translations` objects in the folder of the `.trans` file and its sub folders.
 *
 * @example
 * // vite.config.ts
 * plugins: [combineTranslations()]
 *
 * // src/i18n.ts
 * import translations from "./i18n.trans"; // => { da: { ... }, en: { ... } }
 */
export const combineTranslationsPlugin = (options: CombineTranslationsOptions = {}): CombineTranslationsPlugin => {
  const languages = options.languages ?? ["da", "en"];
  const extension = options.extension ?? ".trans";

  return {
    name: "combine-translations",
    resolveId(source, importer) {
      if (!source.endsWith(extension)) return null;
      // The file doesn't have to exist, so resolve it ourselves instead of letting other plugins try.
      return hasValue(importer) ? path.resolve(path.dirname(importer), source) : path.resolve(source);
    },
    async load(id) {
      if (!id.endsWith(extension)) return null;
      const { translations, files } = await combineTranslations(path.dirname(id), languages);
      files.forEach(file => this.addWatchFile(file));
      return { code: `export default ${JSON.stringify(translations, null, 2)};`, moduleType: "js" };
    }
  };
};

export default combineTranslationsPlugin;
