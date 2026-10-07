import { realpath, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { type Plugin as RollupPlugin, rollup } from "rollup";
import { build, createServer, type Plugin as VitePlugin, type ViteDevServer } from "vite";
import { afterEach, describe, expect, test, vi } from "vitest";

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

describe("combineTranslationsPlugin with the Vite dev server", () => {
  // Like an app: the entry imports the translations, and a component (self-accepting) imports its i18n file.
  const userI18n = (name: string, code = "") => `export const translations: Localization<K> = { da: { name: "${name}" } };${code}`;
  const devFiles = {
    "main.ts": `import translations from "./i18n.trans";\nimport "./core/user.ts";\nexport default translations;`,
    "core/user.ts": `import { translations } from "./user-i18n.ts";\nexport const user = translations;\nimport.meta.hot.accept();`,
    "core/user-i18n.ts": userI18n("Navn")
  };

  let server: ViteDevServer | undefined;

  afterEach(() => server?.close());

  const startServer = async () => {
    const temp = await createTempFiles(devFiles);
    cleanup = temp.cleanup;
    const rootPath = await realpath(temp.rootPath);
    server = await createServer({ root: rootPath, configFile: false, logLevel: "silent", plugins: [combineTranslations()], server: { ws: false, watch: null } });
    const client = server.environments.client;
    // In order, like a browser, so each URL is known from its importer.
    await ["/main.ts", "/i18n.trans", "/core/user.ts", "/core/user-i18n.ts"].reduce((previous, url) => previous.then(() => client.transformRequest(url)), Promise.resolve<unknown>(undefined));
    const send = vi.spyOn(client.hot, "send");
    return { rootPath, watcher: server.watcher, send };
  };

  test("reloads the page when translations change", async () => {
    const { rootPath, watcher, send } = await startServer();
    const file = path.join(rootPath, "core/user-i18n.ts");

    await writeFile(file, userI18n("Fornavn"));
    watcher.emit("change", file);

    await vi.waitFor(() => expect(send).toHaveBeenCalledWith(expect.objectContaining({ type: "full-reload" })));
  });

  test("updates without reloading when only the code changes", async () => {
    const { rootPath, watcher, send } = await startServer();
    const file = path.join(rootPath, "core/user-i18n.ts");

    await writeFile(file, userI18n("Navn", "\nexport const x = 1;"));
    watcher.emit("change", file);

    await vi.waitFor(() => expect(send).toHaveBeenCalledWith(expect.objectContaining({ type: "update" })));
    expect(send).not.toHaveBeenCalledWith(expect.objectContaining({ type: "full-reload" }));
  });

  test("reloads the page when a file with translations is added", async () => {
    const { rootPath, watcher, send } = await startServer();
    const file = path.join(rootPath, "core/new-i18n.ts");

    await writeFile(file, userI18n("Ny"));
    watcher.emit("add", file);

    await vi.waitFor(() => expect(send).toHaveBeenCalledWith(expect.objectContaining({ type: "full-reload" })));
  });

  test("reloads the page when a file with translations is removed", async () => {
    const { rootPath, watcher, send } = await startServer();
    const file = path.join(rootPath, "core/user-i18n.ts");

    await rm(file);
    watcher.emit("unlink", file);

    await vi.waitFor(() => expect(send).toHaveBeenCalledWith(expect.objectContaining({ type: "full-reload" })));
  });
});
