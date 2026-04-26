#!/usr/bin/env node
import { parseArgs } from "node:util";
import { report } from "./report.js";
import { importTexts } from "./import_texts.js";

const { values } = parseArgs({
  options: {
    language: { type: "string", short: "l" },
    all: { type: "boolean", short: "a", default: false },
    json: { type: "boolean", short: "j", default: false },
    import: { type: "string", short: "i" },
  },
  strict: true,
});

if (!values.language) {
  console.error("\x1b[31mError: -l <language> is required\x1b[0m");
  process.exit(1);
}

const language = values.language;
const rootPath = process.cwd();

if (values.import) {
  await importTexts(language, rootPath, values.import);
} else {
  await report(language, rootPath, values.all ?? false, values.json ?? false);
}
