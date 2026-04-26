import { describe, expect, test } from "vitest";

import { resolveKeys } from "./import-texts.js";
import type { JsonKeyEntry } from "./types.js";

const makeKey = (key: string, da: string, extra: Record<string, string | null>): JsonKeyEntry => ({ key, da, ...extra });

describe("resolveKeys", () => {
  test("returns keys that have a translation for the given language", () => {
    const keys = [makeKey("greeting", "Hej", { en: "Hello" }), makeKey("farewell", "Farvel", { en: "Goodbye" })];

    const result = resolveKeys(keys, "en");

    expect(result).toEqual([
      { key: "greeting", translation: "Hello" },
      { key: "farewell", translation: "Goodbye" }
    ]);
  });

  test("excludes keys where the translation is null", () => {
    const keys = [makeKey("greeting", "Hej", { en: "Hello" }), makeKey("farewell", "Farvel", { en: null })];

    const result = resolveKeys(keys, "en");

    expect(result).toEqual([{ key: "greeting", translation: "Hello" }]);
  });

  test("excludes keys where the language property is missing", () => {
    const keys = [makeKey("greeting", "Hej", { no: "Hei" })];

    const result = resolveKeys(keys, "en");

    expect(result).toEqual([]);
  });

  test("returns empty array when all translations are null", () => {
    const keys = [makeKey("greeting", "Hej", { en: null }), makeKey("farewell", "Farvel", { en: null })];

    expect(resolveKeys(keys, "en")).toEqual([]);
  });
});
