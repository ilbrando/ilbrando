import { JSONSchema, TSESTree } from "@typescript-eslint/utils";
import { createRule } from "src/create-rule";
import { hasValue } from "src/utils/object-utils";
import path from "path";

export type Options = [
  {
    rootPath?: string;
  }
];

const schema: JSONSchema.JSONSchema4 = {
  type: "object",
  properties: {
    rootPath: { type: "string" }
  },
  required: ["rootPath"]
};

export const ruleName = "i18n-key-name";
const translationVariableName = "k";

type MessageIds = "invalidKey";

const createValue = (identifierName: string, filename: string, filenameRegExp: RegExp) => {
  const filenameMatch = filenameRegExp.exec(filename);
  if (filenameMatch === null) throw Error(`filenameMatch is null, filename = ${filename}`);
  const localFileName = filenameMatch[1];
  const filenameParts = localFileName.split(path.sep);
  return `${filenameParts.reduce((a, c) => a + "." + c)}.${identifierName}`;
};

export const i18nKeyName = createRule<Options, MessageIds>({
  name: ruleName,
  meta: {
    type: "problem",
    docs: {
      description: "Ensures the name of a i18n keys matches the file path."
    },
    messages: {
      invalidKey: "i18n Key must be {{expectedValue}}."
    },
    schema: [schema],
    fixable: "code"
  },
  defaultOptions: [{}],
  create(context, [options]) {
    const rootPath = options.rootPath;
    if (!hasValue(rootPath)) throw Error(`${ruleName}: rootPath missing in options.`);

    const filenameRegExp = new RegExp(`^.*${rootPath}.(.*)\.tsx?$`);

    return {
      VariableDeclaration: node => {
        if (node.declarations.length <= 0) return;
        const declaration = node.declarations[0];
        if (declaration.id.type !== TSESTree.AST_NODE_TYPES.Identifier) return;
        if (declaration.id.name !== translationVariableName) return;
        if (!hasValue(declaration.init)) return;
        if (declaration.init.type !== TSESTree.AST_NODE_TYPES.ObjectExpression) return;
        const properties = declaration.init.properties;
        for (let i = 0; i < properties.length; i++) {
          const property = properties[i];
          if (property.type !== TSESTree.AST_NODE_TYPES.Property) {
            context.report({
              node,
              messageId: "invalidKey"
            });
            return;
          }
          const valueNode = property.value;
          if (valueNode.type !== TSESTree.AST_NODE_TYPES.Literal) {
            context.report({
              node,
              messageId: "invalidKey"
            });
            return;
          }
          if (typeof valueNode.value !== "string") {
            context.report({
              node,
              messageId: "invalidKey"
            });
            return;
          }
          if (property.key.type !== TSESTree.AST_NODE_TYPES.Identifier) {
            context.report({
              node,
              messageId: "invalidKey"
            });
            return;
          }
          const identifierName = property.key.name;
          const value = valueNode.value;
          const expectedValue = createValue(identifierName, context.filename, filenameRegExp);
          if (expectedValue !== value) {
            context.report({
              node: valueNode,
              messageId: "invalidKey",
              data: {
                expectedValue
              },
              fix: fixer => fixer.replaceTextRange(valueNode.range, '"' + expectedValue + '"')
            });
          }
        }
      }
    };
  }
});
