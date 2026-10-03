import { describe, expect, test } from "vitest";

import { parseTranslations } from "./parse-translations.js";

const languages = ["da", "en"];

const parse = (code: string) => parseTranslations(code, "test-i18n.ts", languages);

describe("parseTranslations", () => {
  test("returns the texts for each language", () => {
    const code = `
      const k = { key1: "key1", key2: "key2" };
      export const translations: Localization<typeof k> = {
        da: { key1: "DA 1", key2: "DA 2" },
        en: { key1: "EN 1" }
      };`;
    expect(parse(code)).toEqual({ da: { key1: "DA 1", key2: "DA 2" }, en: { key1: "EN 1" } });
  });

  test("supports non exported declarations, quoted keys and template literals", () => {
    const code = `
      const translations: Localization<K> = {
        da: { "quoted-key": "a \\"quoted\\" text", multi: \`line 1
line 2\` }
      };`;
    expect(parse(code)).toEqual({ da: { "quoted-key": 'a "quoted" text', multi: "line 1\nline 2" } });
  });

  test("supports tsx files", () => {
    const code = `
      export const translations: Localization<K> = { da: { title: "Titel" } };
      export const Component = () => <div>{translations.da.title}</div>;`;
    expect(parseTranslations(code, "component.tsx", languages)).toEqual({ da: { title: "Titel" } });
  });

  test("supports type assertions in ts files", () => {
    const code = `
      const value = <string>someValue;
      export const translations: Localization<K> = { da: { title: "Titel" } };`;
    expect(parse(code)).toEqual({ da: { title: "Titel" } });
  });

  test("returns undefined when there are no translations", () => {
    expect(parse(`export const foo = 42;`)).toBeUndefined();
  });

  test("ignores translations not typed as Localization", () => {
    expect(parse(`export const translations = { da: { key: "text" } };`)).toBeUndefined();
  });

  test("ignores translations that are not declared at the top level", () => {
    expect(parse(`const f = () => { const translations: Localization<K> = { da: { key: "text" } }; };`)).toBeUndefined();
  });

  test("throws on template literals with substitutions", () => {
    // eslint-disable-next-line no-template-curly-in-string -- the code being parsed contains a template literal
    expect(() => parse("export const translations: Localization<K> = { da: { key: `a ${b}` } };")).toThrow(/template literal without substitutions.*test-i18n\.ts:1:/);
  });

  test("throws on values that are not strings", () => {
    expect(() => parse(`export const translations: Localization<K> = { da: { key: 42 } };`)).toThrow(/Expected a string literal/);
  });

  test("throws on unknown languages", () => {
    expect(() => parse(`export const translations: Localization<K> = { de: { key: "text" } };`)).toThrow(/Unknown language 'de'/);
  });

  test("throws when a language is not an object", () => {
    expect(() => parse(`export const translations: Localization<K> = { da: texts };`)).toThrow(/Expected language 'da' to be an object/);
  });

  test("throws on spread", () => {
    expect(() => parse(`export const translations: Localization<K> = { da: { ...other } };`)).toThrow(/Spread is not supported/);
  });
});
