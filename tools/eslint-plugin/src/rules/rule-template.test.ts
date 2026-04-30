import { RuleTester } from "@typescript-eslint/rule-tester";
import { afterAll, describe, it } from "vitest";

import { ruleTemplate } from "./rule-template";

RuleTester.afterAll = afterAll;
RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

// For rules that require type information, configure the parser:
//   import tsParser from "@typescript-eslint/parser";
//   const ruleTester = new RuleTester({ languageOptions: { parser: tsParser } });
const ruleTester = new RuleTester();

describe("rule-template", () => {
  ruleTester.run("rule-template", ruleTemplate, {
    valid: [
      { code: "const x = 1;" },
      {
        code: "const EXAMPLE_FORBIDDEN_NAME = 1;",
        options: [{ allowedNames: ["EXAMPLE_FORBIDDEN_NAME"] }]
      }
    ],
    invalid: [
      {
        code: "const EXAMPLE_FORBIDDEN_NAME = 1;",
        errors: [{ messageId: "forbidden", data: { name: "EXAMPLE_FORBIDDEN_NAME" } }],
        output: "const REPLACEMENT = 1;"
      }
    ]
  });
});
