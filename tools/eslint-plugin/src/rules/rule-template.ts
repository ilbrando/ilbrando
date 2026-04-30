import type { TSESTree } from "@typescript-eslint/utils";
import { RuleCreator } from "@typescript-eslint/utils/eslint-utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Options = [
  {
    // Add your configurable options here.
    allowedNames?: string[];
  }
];

type MessageIds = "forbidden";

// ─── Rule ─────────────────────────────────────────────────────────────────────

// Replace the URL factory with your own docs URL pattern.
const createRule = RuleCreator(name => `https://github.com/ilbrando/ilbrando/blob/main/tools/eslint-plugin/docs/${name}.md`);

export const ruleTemplate = createRule<Options, MessageIds>({
  name: "rule-template",
  meta: {
    // "problem" | "suggestion" | "layout"
    type: "problem",
    docs: {
      description: "Describe what this rule enforces.",
    },
    messages: {
      forbidden: "Use of '{{name}}' is forbidden.",
    },
    schema: [
      {
        type: "object",
        properties: {
          allowedNames: {
            type: "array",
            items: { type: "string" },
          },
        },
        additionalProperties: false,
      },
    ],
    // Remove this line if the rule has no auto-fix.
    fixable: "code",
  },
  defaultOptions: [{}],
  create(context, [options]) {
    const allowedNames = options.allowedNames ?? [];

    return {
      // Replace this visitor with whichever AST node type(s) you need.
      // Full node type list: https://github.com/nicolo-ribaudo/tc39-proposal-optional-chaining/blob/main/README.md
      // or browse via @typescript-eslint/types TSESTree namespace.
      Identifier(node: TSESTree.Identifier) {
        if (allowedNames.includes(node.name)) return;

        // Replace this condition with your actual detection logic.
        if (node.name === "EXAMPLE_FORBIDDEN_NAME") {
          context.report({
            node,
            messageId: "forbidden",
            data: { name: node.name },
            // Remove fix() if the rule is not auto-fixable.
            fix(fixer) {
              return fixer.replaceText(node, "REPLACEMENT");
            },
          });
        }
      },
    };
  },
});
