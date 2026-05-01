import { RuleTester } from "@typescript-eslint/rule-tester";
import { afterAll, describe, it } from "vitest";

import { reduxSliceName } from "./redux-slice-name";

RuleTester.afterAll = afterAll;
RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

// For rules that require type information, configure the parser:
//   import tsParser from "@typescript-eslint/parser";
//   const ruleTester = new RuleTester({ languageOptions: { parser: tsParser } });
const ruleTester = new RuleTester();

describe("rule-template", () => {
  ruleTester.run("rule-template", reduxSliceName, {
    valid: [
      {
        filename: "/project/src/features/counter-store.ts",
        options: [{ rootPath: ".src" }],
        code: 'const slice = createSlice({name:"features:counter"})'
      },
      {
        filename: "/project/src/features/counter-store.ts",
        options: [{ rootPath: ".src", reduxNamePrefix: "PREFIX@:" }],
        code: 'const slice = createSlice({name:"PREFIX@:features:counter"})'
      }
    ],
    invalid: [
      {
        filename: "/project/src/features/counter-store.ts",
        options: [{ rootPath: ".src" }],
        code: "const slice = createSlice({name:'counter'})",
        errors: [{ messageId: "invalidName", data: { expectedValue: "features:counter" } }],
        output: 'const slice = createSlice({name:"features:counter"})'
      }
    ]
  });
});
