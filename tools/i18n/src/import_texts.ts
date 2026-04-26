import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { hasValue } from "@ilbrando/utils";
import { Project, SyntaxKind } from "ts-morph";
import { findTranslationsObject, getKeyValues, getLanguageObject } from "./ast_utils.js";
import type { JsonFileTranslations } from "./types.js";

type ResolvedKey = { key: string; translation: string };

const resolveKeys = (keys: JsonFileTranslations["keys"], language: string): ResolvedKey[] =>
  keys
    .map(k => {
      const translation = k[language];
      if (!hasValue(translation)) return null;
      return { key: k.key, translation };
    })
    .filter((k): k is ResolvedKey => hasValue(k));

export const importTexts = async (language: string, rootPath: string, importFile: string) => {
  const importFilePath = path.resolve(rootPath, importFile);
  console.log(`Importing \x1b[36m${language}\x1b[0m texts from ${importFilePath}`);

  const content = await readFile(importFilePath, "utf-8");
  const importData: JsonFileTranslations[] = JSON.parse(content);

  const project = new Project({ skipAddingFilesFromTsConfig: true });
  let updatedFiles = 0;

  for (const file of importData) {
    const filePath = path.resolve(rootPath, file.filePath);

    try {
      await access(filePath);
    } catch {
      console.error(`\x1b[31mFile ${filePath} not found - skipping.\x1b[0m`);
      continue;
    }

    const resolvedKeys = resolveKeys(file.keys, language);
    if (resolvedKeys.length === 0) continue;

    const sourceFile = project.addSourceFileAtPath(filePath);
    const translationsObj = findTranslationsObject(sourceFile);
    if (!hasValue(translationsObj)) continue;

    const langObj = getLanguageObject(translationsObj, language);

    if (hasValue(langObj)) {
      const currentKeys = getKeyValues(langObj);
      for (const { key, translation } of resolvedKeys) {
        if (currentKeys.some(k => k.key === key)) {
          langObj
            .getPropertyOrThrow(key)
            .asKindOrThrow(SyntaxKind.PropertyAssignment)
            .getInitializerIfKindOrThrow(SyntaxKind.StringLiteral)
            .setLiteralValue(translation);
        } else {
          langObj.addPropertyAssignment({ name: key, initializer: `"${translation}"` });
        }
      }
    } else {
      translationsObj.addPropertyAssignment({
        name: language,
        initializer: `{\n${resolvedKeys.map(({ key, translation }) => `    ${key}: "${translation}"`).join(",\n")}\n  }`,
      });
    }

    await sourceFile.save();
    console.log(`Processed ${file.filePath}, ${resolvedKeys.length} modifications`);
    updatedFiles++;
  }

  if (updatedFiles === 0) {
    console.log("No changes made.");
  } else {
    console.log(`${updatedFiles} file(s) changed - \x1b[32mREMEMBER TO RUN PRETTIER ON THE FILES\x1b[0m`);
  }
};
