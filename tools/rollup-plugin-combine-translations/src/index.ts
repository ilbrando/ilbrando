import path from "node:path";

import { hasValue } from "@ilbrando/utils";

import { combineTranslations, isSourceFile, readTranslations } from "./combine-translations.js";
import type { CombineTranslationsOptions } from "./types.js";

export type { CombinedTranslations, CombineTranslationsOptions, TranslationTree } from "./types.js";

type PluginContext = {
  addWatchFile: (id: string) => void;
};

type HotUpdateContext<TModule> = {
  environment: { moduleGraph: { getModuleById: (id: string) => TModule | undefined } };
};

type HotUpdateOptions<TModule> = {
  type: "create" | "update" | "delete";
  file: string;
  modules: TModule[];
};

/** The plugin is described structurally, so it can be used with Rollup, Rolldown and Vite without depending on their types. */
export type CombineTranslationsPlugin = {
  name: string;
  configResolved: (config: { command: "build" | "serve" }) => void;
  resolveId: (source: string, importer: string | undefined) => string | null;
  load: (this: PluginContext, id: string) => Promise<{ code: string; moduleType: "js" } | null>;
  hotUpdate: <TModule>(this: HotUpdateContext<TModule>, options: HotUpdateOptions<TModule>) => Promise<TModule[] | undefined>;
};

const emptyJson = JSON.stringify({});

const isInFolder = (folder: string, file: string) => {
  const relativePath = path.relative(folder, file);
  return relativePath !== "" && !relativePath.startsWith("..") && !path.isAbsolute(relativePath);
};

/** The translations of a file as JSON, or `undefined` if they can't be read (e.g. a syntax error while typing). */
const readTranslationsJson = async (file: string, languages: string[]) => {
  try {
    return JSON.stringify(await readTranslations(file, languages));
  } catch {
    return undefined;
  }
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

  let isViteDevServer = false;
  /** The Vite dev server's `.trans` modules and the translations of each of their files (as JSON) when they were loaded. */
  const loadedFiles = new Map<string, Record<string, string>>();

  return {
    name: "combine-translations",
    configResolved(config) {
      isViteDevServer = config.command === "serve";
    },
    resolveId(source, importer) {
      if (!source.endsWith(extension)) return null;
      // The file doesn't have to exist, so resolve it ourselves instead of letting other plugins try.
      return hasValue(importer) ? path.resolve(path.dirname(importer), source) : path.resolve(source);
    },
    async load(id) {
      if (!id.endsWith(extension)) return null;
      const { translations, files } = await combineTranslations(path.dirname(id), languages);
      if (isViteDevServer) {
        // The Vite dev server makes a watched file an import of this module. The app's entry would then be in an import cycle
        // with this module, and Vite neither updates nor reloads anything when a file changes. `hotUpdate` handles changes instead.
        loadedFiles.set(id, Object.fromEntries(Object.entries(files).map(([file, fileTranslations]) => [file, JSON.stringify(fileTranslations)])));
      } else {
        Object.keys(files).forEach(file => this.addWatchFile(file));
      }
      return { code: `export default ${JSON.stringify(translations, null, 2)};`, moduleType: "js" };
    },
    async hotUpdate({ type, file, modules }) {
      const filePath = path.normalize(file);
      if (!isSourceFile(filePath)) return undefined;
      const ids = [...loadedFiles.keys()].filter(id => isInFolder(path.dirname(id), filePath));
      if (ids.length === 0) return undefined;

      // A file that can't be parsed counts as changed, so loading the `.trans` module shows the error.
      const json = type === "delete" ? emptyJson : await readTranslationsJson(filePath, languages);
      const changedIds = ids.filter(id => !hasValue(json) || json !== (loadedFiles.get(id)?.[filePath] ?? emptyJson));
      const transModules = changedIds.map(id => this.environment.moduleGraph.getModuleById(id)).filter(hasValue);
      // Vite propagates the update from the `.trans` module to its importers, which normally ends in a page reload.
      return transModules.length === 0 ? undefined : [...modules, ...transModules];
    }
  };
};

export default combineTranslationsPlugin;
