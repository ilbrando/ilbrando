import { RuleCreator } from "@typescript-eslint/utils/eslint-utils";

export const createRule = RuleCreator(name => `https://github.com/ilbrando/ilbrando/tree/main/tools/eslint-plugin/docs/${name}.md`);
