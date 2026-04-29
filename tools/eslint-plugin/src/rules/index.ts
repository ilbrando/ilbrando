import { Linter } from "@typescript-eslint/utils/ts-eslint";
import { exportOrderRule } from "./export-order.js";
import { importOrderRule } from "./import-order.js";
import { importPathRule } from "./import-path.js";
import { jsxStringAttributeRule } from "./jsx-string-attribute.js";
import { noPartialSpreadRule } from "./no-partial-spread.js";
export const rules = {
  "export-order": exportOrderRule,
  "import-order": importOrderRule,
  "import-path": importPathRule,
  "jsx-string-attribute": jsxStringAttributeRule,
  "no-partial-spread": noPartialSpreadRule
} satisfies Linter.PluginRules;
