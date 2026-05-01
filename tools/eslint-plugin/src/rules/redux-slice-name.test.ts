import { RuleTester } from "@typescript-eslint/rule-tester";
import { afterAll, describe, it } from "vitest";

import { reduxSliceName, ruleName } from "./redux-slice-name";

RuleTester.afterAll = afterAll;
RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const ruleTester = new RuleTester();

describe(ruleName, () => {
  ruleTester.run(ruleName, reduxSliceName, {
    valid: [
      {
        filename: "/project/src/features/counter-store.ts",
        options: [{ rootPath: "/src" }],
        code: 'const slice = createSlice({name:"features:counter"})'
      },
      {
        filename: "/project/src/features/counter-store.ts",
        options: [{ rootPath: "/src", reduxNamePrefix: "PREFIX@:" }],
        code: 'const slice = createSlice({name:"PREFIX@:features:counter"})'
      }
    ],
    invalid: [
      {
        filename: "/project/src/features/counter-store.ts",
        options: [{ rootPath: "/src" }],
        code: "const slice = createSlice({name:'counter'})",
        errors: [{ messageId: "invalidName", data: { expectedValue: "features:counter" } }],
        output: 'const slice = createSlice({name:"features:counter"})'
      }
    ]
  });
});
