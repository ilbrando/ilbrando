import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

/** Creates a temporary folder with the files (relative path => content) and returns its path and a function to remove it. */
export const createTempFiles = async (files: Record<string, string>) => {
  const rootPath = await mkdtemp(path.join(tmpdir(), "combine-translations-"));
  await Promise.all(
    Object.entries(files).map(async ([relativePath, content]) => {
      const filePath = path.join(rootPath, relativePath);
      await mkdir(path.dirname(filePath), { recursive: true });
      await writeFile(filePath, content);
    })
  );
  return { rootPath, cleanup: () => rm(rootPath, { recursive: true, force: true }) };
};
