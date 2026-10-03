import path from "node:path";

import { type Plugin as RollupPlugin, rollup } from "rollup";
import { build, type Plugin as VitePlugin } from "vite";
import { afterEach, describe, expect, test } from "vitest";

import combineTranslations, { type CombinedTranslations } from "./index.js";
import { createTempFiles } from "./test-utils.js";

// The plugin must be assignable to both the Rollup and the Vite plugin types.
const rollupPlugin: RollupPlugin = combineTranslations();
const vitePlugin: VitePlugin = combineTranslations();

const files = {
  "main.js": `export { default } from "./i18n.trans";`,
  "i18n.trans": "export default { da: {}, en: {} };",
  "core/user-i18n.ts": `export const translations: Localization<K> = { da: { name: "Navn \\"citat\\"" }, en: { name: \`Name
new line\` } };`
};

const expected: CombinedTranslations = {
  da: { core: { "user-i18n": { name: 'Navn "citat"' } } },
  en: { core: { "user-i18n": { name: "Name\nnew line" } } }
};

const importModule = async (code: string): Promise<unknown> => {
  const module: { default: unknown } = await import(`data:text/javascript,${encodeURIComponent(code)}`);
  return module.default;
};

let cleanup: () => Promise<void> = async () => {};

afterEach(() => cleanup());

const setup = async () => {
  const temp = await createTempFiles(files);
  cleanup = temp.cleanup;
  return temp.rootPath;
};

describe("combineTranslationsPlugin", () => {
  test("resolves .trans imports relative to the importer", () => {
    expect(combineTranslations().resolveId("./i18n.trans", "/project/src/main.ts")).toBe(path.resolve("/project/src/i18n.trans"));
    expect(combineTranslations().resolveId("./main.ts", "/project/src/index.ts")).toBeNull();
  });

  test("supports a custom extension", () => {
    expect(combineTranslations({ extension: ".i18n" }).resolveId("./all.i18n", "/project/src/main.ts")).toBe(path.resolve("/project/src/all.i18n"));
  });

  test("works with Rollup", async () => {
    const rootPath = await setup();

    const bundle = await rollup({ input: path.join(rootPath, "main.js"), plugins: [rollupPlugin] });
    const { output } = await bundle.generate({ format: "es" });
    await bundle.close();

    expect(await importModule(output[0].code)).toEqual(expected);
  });

  test("works with Vite", async () => {
    const rootPath = await setup();

    const result = await build({
      root: rootPath,
      configFile: false,
      logLevel: "silent",
      plugins: [vitePlugin],
      build: { write: false, minify: false, lib: { entry: path.join(rootPath, "main.js"), formats: ["es"] } }
    });

    const outputs = Array.isArray(result) ? result : [result];
    const chunk = outputs.flatMap(o => ("output" in o ? o.output : [])).find(o => o.type === "chunk");
    expect(chunk).toBeDefined();
    expect(await importModule(chunk?.type === "chunk" ? chunk.code : "")).toEqual(expected);
  });
});
