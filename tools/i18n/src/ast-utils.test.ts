import { ensureValue } from "@ilbrando/utils";
import { Project } from "ts-morph";
import { describe, expect, test } from "vitest";

import { findTranslationsObject, getKeyValues, getLanguageObject } from "./ast-utils.js";

const makeSourceFile = (code: string) => {
  const project = new Project({ useInMemoryFileSystem: true, skipAddingFilesFromTsConfig: true });
  return project.createSourceFile("test.ts", code);
};

describe("findTranslationsObject", () => {
  test("returns the object when translations: Localization exists", () => {
    const sourceFile = makeSourceFile(`
      const translations: Localization = { da: { key1: "Dansk" } };
    `);
    const result = findTranslationsObject(sourceFile);
    expect(result).toBeDefined();
  });

  test("returns undefined when no variable named translations exists", () => {
    const sourceFile = makeSourceFile(`
      const foo: Localization = { da: { key1: "Dansk" } };
    `);
    expect(findTranslationsObject(sourceFile)).toBeUndefined();
  });

  test("returns undefined when translations has wrong type annotation", () => {
    const sourceFile = makeSourceFile(`
      const translations: SomeOtherType = { da: { key1: "Dansk" } };
    `);
    expect(findTranslationsObject(sourceFile)).toBeUndefined();
  });

  test("returns undefined when translations has no type annotation", () => {
    const sourceFile = makeSourceFile(`
      const translations = { da: { key1: "Dansk" } };
    `);
    expect(findTranslationsObject(sourceFile)).toBeUndefined();
  });
});

describe("getLanguageObject", () => {
  const sourceFile = makeSourceFile(`
    const translations: Localization = {
      da: { key1: "Dansk", key2: "Mere dansk" },
      en: { key1: "English" }
    };
  `);
  const translationsObj = findTranslationsObject(sourceFile);
  expect(translationsObj).not.toBeNull();

  test("returns the object for an existing language", () => {
    const result = getLanguageObject(ensureValue(translationsObj), "da");
    expect(result).toBeDefined();
  });

  test("returns undefined for a missing language", () => {
    const result = getLanguageObject(ensureValue(translationsObj), "no");
    expect(result).toBeUndefined();
  });
});

describe("getKeyValues", () => {
  test("returns all key-value pairs", () => {
    const sourceFile = makeSourceFile(`
      const translations: Localization = {
        da: { greeting: "Hej", farewell: "Farvel" }
      };
    `);
    const translationsObj = findTranslationsObject(sourceFile);
    expect(translationsObj).not.toBeNull();
    const daObj = getLanguageObject(ensureValue(translationsObj), "da");
    expect(daObj).not.toBeNull();

    const result = getKeyValues(ensureValue(daObj));

    expect(result).toEqual([
      { key: "greeting", value: "Hej" },
      { key: "farewell", value: "Farvel" }
    ]);
  });

  test("returns empty array for empty language object", () => {
    const sourceFile = makeSourceFile(`
      const translations: Localization = { da: {} };
    `);
    const translationsObj = findTranslationsObject(sourceFile);
    expect(translationsObj).not.toBeNull();
    const daObj = getLanguageObject(ensureValue(translationsObj), "da");
    expect(daObj).not.toBeNull();

    expect(getKeyValues(ensureValue(daObj))).toEqual([]);
  });
});
