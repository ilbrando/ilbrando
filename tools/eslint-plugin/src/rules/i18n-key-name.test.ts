import { RuleTester } from "@typescript-eslint/rule-tester";
import { afterAll, describe, it } from "vitest";

import { i18nKeyName, ruleName } from "./i18n-key-name";

RuleTester.afterAll = afterAll;
RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const ruleTester = new RuleTester();

describe(ruleName, () => {
  ruleTester.run(ruleName, i18nKeyName, {
    valid: [
      {
        filename: "/project/src/features/counter-i18n.ts",
        options: [{ rootPath: "/src" }],
        code: `
        const k = {
          key1: "features.counter-i18n.key1",
          key2: "features.counter-i18n.key2",
        };`
      }
    ],
    invalid: [
      {
        filename: "/project/src/features/counter-i18n.ts",
        options: [{ rootPath: "/src" }],
        code: `
        const k = {
          key1: "features.counter-i18n.key1",
          key2: "features.counter-i18n.key3",
        };`,
        errors: [{ messageId: "invalidKey", data: { expectedValue: "features.counter-i18n.key2" } }],
        output: `
        const k = {
          key1: "features.counter-i18n.key1",
          key2: "features.counter-i18n.key2",
        };`
      }
    ]
  });
});
