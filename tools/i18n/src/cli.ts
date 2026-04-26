#!/usr/bin/env node
import { parseArgs } from "node:util";
import { hasValue } from "@ilbrando/utils";

import { importTexts } from "./import-texts.js";
import { report } from "./report.js";

const printHelp = () => {
  console.log("Usage: i18n -l <lang> [-a] [-j] [-i <filename>]");
  console.log("");
  console.log("Options:");
  console.log("  -l, --language <lang>        Language code to examine (required)");
  console.log("  -a, --all                    Show all keys, not just missing ones");
  console.log("  -j, --json                   Output as JSON instead of formatted text");
  console.log("  -i, --import <filename>      Import translations from JSON file");
  console.log("  -h, --help                   Show this help message");
  console.log("");
  console.log("Examples:");
  console.log("  i18n -l en                   Report missing English translations");
  console.log("  i18n -l en --json            Report missing English translations as JSON");
  console.log("  i18n -l en -i modified.json  Import translations from modified.json");
};

const { values } = parseArgs({
  options: {
    language: { type: "string", short: "l" },
    all: { type: "boolean", short: "a", default: false },
    json: { type: "boolean", short: "j", default: false },
    import: { type: "string", short: "i" },
    help: { type: "boolean", short: "h", default: false }
  },
  strict: true
});

if (values.help) {
  printHelp();
  process.exit(0);
}

if (!hasValue(values.language)) {
  console.error("\x1b[31mError: -l <language> is required\x1b[0m");
  console.error("Run 'i18n --help' for usage information.");
  process.exit(1);
}

const rootPath = process.cwd();

if (hasValue(values.import)) {
  await importTexts(values.language, rootPath, values.import);
} else {
  await report(values.language, rootPath, values.all ?? false, values.json ? "json" : "text");
}
