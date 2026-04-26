import { glob } from "node:fs/promises";
import path from "node:path";
import { assertNever, hasValue } from "@ilbrando/utils";
import { Project } from "ts-morph";
import { findTranslationsObject, getKeyValues, getLanguageObject } from "./ast_utils.js";
import type { FileTranslations, JsonFileTranslations, KeyEntry } from "./types.js";

const toRelativePosix = (rootPath: string, filePath: string) => path.relative(rootPath, filePath).replaceAll(path.sep, "/");

const formatOutput = (results: FileTranslations[], language: string, rootPath: string, showAll: boolean) => {
  const pad = Math.max("da".length, language.length);
  for (const r of results) {
    console.log(`File: \x1b[32m${toRelativePosix(rootPath, r.filePath)}\x1b[0m`);
    for (const k of r.keys) {
      console.log(`  key${" ".repeat(pad)} : ${k.key}`);
      console.log(`     da${" ".repeat(Math.max(0, pad - "da".length))} : ${k.da}`);
      if (showAll || hasValue(k.translation)) {
        console.log(`     ${language}${" ".repeat(Math.max(0, pad - language.length))} : ${k.translation ?? ""}`);
      }
    }
  }
};

const toJson = (results: FileTranslations[], language: string, rootPath: string): JsonFileTranslations[] =>
  results.map(r => ({
    filePath: toRelativePosix(rootPath, r.filePath),
    keys: r.keys.map(k => ({ key: k.key, da: k.da, [language]: k.translation })),
  }));

export const report = async (language: string, rootPath: string, showAll: boolean, outputFormat: "json" | "text") => {
  const sourcePath = path.join(rootPath, "src");
  console.log(`Examining language \x1b[36m${language}\x1b[0m in ${sourcePath}.`);

  const allFiles = await Array.fromAsync(glob("src/**/*.{ts,tsx}", { cwd: rootPath }));
  const tsFiles = allFiles.filter(f => !f.endsWith(".d.ts")).map(f => path.join(rootPath, f));

  const project = new Project({ skipAddingFilesFromTsConfig: true });
  const results: FileTranslations[] = [];

  for (const filePath of tsFiles) {
    const sourceFile = project.addSourceFileAtPath(filePath);
    const translationsObj = findTranslationsObject(sourceFile);
    if (!hasValue(translationsObj)) continue;

    const daObj = getLanguageObject(translationsObj, "da");
    if (!hasValue(daObj)) throw new Error(`Expected 'da' language property in ${filePath}`);
    const daKeys = getKeyValues(daObj);

    const langObj = getLanguageObject(translationsObj, language);
    const langKeys = hasValue(langObj) ? getKeyValues(langObj) : [];

    const keys: KeyEntry[] = daKeys.map(da => ({
      key: da.key,
      da: da.value,
      translation: langKeys.find(l => l.key === da.key)?.value ?? null,
    }));

    results.push({ filePath, keys });
  }

  const displayed = showAll
    ? results
    : results.map(r => ({ ...r, keys: r.keys.filter(k => !hasValue(k.translation)) })).filter(r => r.keys.length > 0);

  switch (outputFormat) {
    case "json":
      console.log(JSON.stringify(toJson(displayed, language, rootPath), undefined, 2));
      break;
    case "text":
      formatOutput(displayed, language, rootPath, showAll);
      break;
    default:
      assertNever(outputFormat);
  }
};
