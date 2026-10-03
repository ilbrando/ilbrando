import path from "node:path";

import { hasValue } from "@ilbrando/utils";
import { afterEach, describe, expect, test } from "vitest";

import { combineTranslations } from "./combine-translations.js";
import { createTempFiles } from "./test-utils.js";

const languages = ["da", "en"];

const translationsFile = (da: string, en?: string) => `export const translations: Localization<K> = { da: ${da}${hasValue(en) ? `, en: ${en}` : ""} };`;

let cleanup: () => Promise<void> = async () => {};

afterEach(() => cleanup());

const setup = async (files: Record<string, string>) => {
  const temp = await createTempFiles(files);
  cleanup = temp.cleanup;
  return temp.rootPath;
};

describe("combineTranslations", () => {
  test("nests translations by folder and file name", async () => {
    const rootPath = await setup({
      "app-i18n.ts": translationsFile(`{ title: "Titel" }`, `{ title: "Title" }`),
      "core/user/user-i18n.tsx": translationsFile(`{ name: "Navn" }`),
      "core/no-translations.ts": "export const foo = 42;"
    });

    const result = await combineTranslations(rootPath, languages);

    expect(result.translations).toEqual({
      da: { "app-i18n": { title: "Titel" }, core: { user: { "user-i18n": { name: "Navn" } } } },
      en: { "app-i18n": { title: "Title" } }
    });
  });

  test("returns all examined files so they can be watched", async () => {
    const rootPath = await setup({
      "a.ts": translationsFile(`{ a: "a" }`),
      "sub/b.ts": "export const b = 1;",
      "types.d.ts": "declare const x: number;",
      "readme.md": "# Readme"
    });

    const result = await combineTranslations(rootPath, languages);

    expect(result.files.toSorted()).toEqual([path.join(rootPath, "a.ts"), path.join(rootPath, "sub", "b.ts")]);
  });

  test("always includes every language", async () => {
    const rootPath = await setup({ "empty.ts": "export const foo = 42;" });

    const result = await combineTranslations(rootPath, languages);

    expect(result.translations).toEqual({ da: {}, en: {} });
  });

  test("merges a file and a folder with the same name", async () => {
    const rootPath = await setup({
      "user.ts": translationsFile(`{ name: "Navn" }`),
      "user/address.ts": translationsFile(`{ street: "Gade" }`)
    });

    const result = await combineTranslations(rootPath, languages);

    expect(result.translations.da).toEqual({ user: { name: "Navn", address: { street: "Gade" } } });
  });

  test("throws on duplicate keys", async () => {
    const rootPath = await setup({
      "user.ts": translationsFile(`{ name: "Navn" }`),
      "user.tsx": translationsFile(`{ name: "Andet navn" }`)
    });

    await expect(combineTranslations(rootPath, languages)).rejects.toThrow("Duplicate translation key 'user.name'.");
  });

  test("includes the file path in parse errors", async () => {
    const rootPath = await setup({ "broken.ts": translationsFile(`{ name: 42 }`) });

    await expect(combineTranslations(rootPath, languages)).rejects.toThrow(path.join(rootPath, "broken.ts"));
  });
});
