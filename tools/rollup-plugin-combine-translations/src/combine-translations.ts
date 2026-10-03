import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { hasValue } from "@ilbrando/utils";

import { parseTranslations } from "./parse-translations.js";
import type { CombinedTranslations, TranslationTree } from "./types.js";

type Collected = {
  translations: CombinedTranslations;
  /** All the source files that were examined. Changes to these can change the result. */
  files: string[];
};

const emptyCollected: Collected = { translations: {}, files: [] };

const isSourceFile = (fileName: string) => (fileName.endsWith(".ts") || fileName.endsWith(".tsx")) && !fileName.endsWith(".d.ts");

const isEmpty = (tree: TranslationTree) => Object.keys(tree).length === 0;

const mergeTrees = (tree1: TranslationTree, tree2: TranslationTree, keyPath: string[]): TranslationTree =>
  Object.entries(tree2).reduce<TranslationTree>((result, [key, value]) => {
    const existing = result[key];
    if (!hasValue(existing)) return { ...result, [key]: value };
    if (typeof existing !== "string" && typeof value !== "string") return { ...result, [key]: mergeTrees(existing, value, [...keyPath, key]) };
    throw new Error(`Duplicate translation key '${[...keyPath, key].join(".")}'.`);
  }, tree1);

/** Places the translations of a file or folder under `name` in the result for each language. */
const addNamed = (result: CombinedTranslations, name: string, translations: CombinedTranslations, keyPath: string[]): CombinedTranslations =>
  Object.entries(translations)
    .filter(([, tree]) => !isEmpty(tree))
    .reduce<CombinedTranslations>((acc, [language, tree]) => ({ ...acc, [language]: mergeTrees(acc[language] ?? {}, { [name]: tree }, keyPath) }), result);

const collectFile = async (filePath: string, languages: string[]): Promise<Collected> => {
  const code = await readFile(filePath, "utf8");
  return { translations: parseTranslations(code, filePath, languages) ?? {}, files: [filePath] };
};

const collectDirectory = async (dirPath: string, languages: string[], keyPath: string[]): Promise<Collected> => {
  const entries = (await readdir(dirPath, { withFileTypes: true })).toSorted((a, b) => a.name.localeCompare(b.name));

  const children = await Promise.all(
    entries.map(async entry => {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) return { name: entry.name, collected: await collectDirectory(fullPath, languages, [...keyPath, entry.name]) };
      if (entry.isFile() && isSourceFile(entry.name)) return { name: path.parse(entry.name).name, collected: await collectFile(fullPath, languages) };
      return undefined;
    })
  );

  return children.filter(hasValue).reduce<Collected>(
    (acc, { name, collected }) => ({
      translations: addNamed(acc.translations, name, collected.translations, keyPath),
      files: [...acc.files, ...collected.files]
    }),
    emptyCollected
  );
};

/**
 * Finds all `translations` objects in the TypeScript files in {@param rootPath} and its sub folders
 * and combines them into one tree per language. The texts are placed under the path of their file
 * (folder names and the file name without extension), so `src/core/user-i18n.ts` with the key `name`
 * becomes `core.user-i18n.name`.
 */
export const combineTranslations = async (rootPath: string, languages: string[]): Promise<Collected> => {
  const collected = await collectDirectory(rootPath, languages, []);
  return {
    translations: Object.fromEntries(languages.map(language => [language, collected.translations[language] ?? {}])),
    files: collected.files
  };
};
