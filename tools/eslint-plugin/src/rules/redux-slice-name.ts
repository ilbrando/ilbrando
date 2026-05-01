import { JSONSchema, TSESTree } from "@typescript-eslint/utils";
import { createRule } from "src/create-rule";
import { hasValue } from "src/utils/object-utils";
import path from "path";

export type Options = [
  {
    rootPath?: string;
    reduxNamePrefix?: string;
  }
];

const schema: JSONSchema.JSONSchema4 = {
  type: "object",
  properties: {
    rootPath: { type: "string" },
    reduxNamePrefix: { type: "string" }
  },
  required: ["rootPath"]
};

export const ruleName = "redux-slice-name";
const reduxCreateSliceFunctionName = "createSlice";
const reduxNamePropertyName = "name";

type MessageIds = "invalidName";

const createValue = (localFileName: string, reduxNamePrefix: string | undefined) => {
  const filenameParts = localFileName.split(path.sep);
  if (filenameParts[filenameParts.length - 1].toLowerCase().endsWith("-store")) {
    filenameParts[filenameParts.length - 1] = filenameParts[filenameParts.length - 1].slice(0, filenameParts[filenameParts.length - 1].length - "-store".length);
  }
  return `${reduxNamePrefix ?? ""}${filenameParts.reduce((a, c) => a + ":" + c)}`;
};

export const reduxSliceName = createRule<Options, MessageIds>({
  name: ruleName,
  meta: {
    type: "problem",
    docs: {
      description: "Ensures the name of a redux slice matches the file path."
    },
    messages: {
      invalidName: "Slice name value must be {{expectedValue}}."
    },
    schema: [schema],
    fixable: "code"
  },
  defaultOptions: [{}],
  create(context, [options]) {
    const rootPath = options.rootPath;
    if (!hasValue(rootPath)) throw Error(`${ruleName}: rootPath missing in options.`);
    const reduxNamePrefix = options.reduxNamePrefix;

    const filenameRegExp = new RegExp(`^.*${rootPath}.(.*)\.tsx?$`);

    return {
      CallExpression: node => {
        const filenameMatch = filenameRegExp.exec(context.filename);
        if (!hasValue(filenameMatch)) return;
        const localFileName = filenameMatch[1];

        if (node.callee.type !== TSESTree.AST_NODE_TYPES.Identifier) return;
        if (node.callee.name !== reduxCreateSliceFunctionName) return;
        if (node.arguments.length !== 1) return;
        if (node.arguments[0].type !== TSESTree.AST_NODE_TYPES.ObjectExpression) return;
        const objectExpression = node.arguments[0];
        const nameProperty = objectExpression.properties.find(x => x.type === TSESTree.AST_NODE_TYPES.Property && x.key.type === TSESTree.AST_NODE_TYPES.Identifier && x.key.name === reduxNamePropertyName);
        if (!hasValue(nameProperty)) return;
        if (nameProperty.type !== TSESTree.AST_NODE_TYPES.Property) return; // this will never happen, just making typescript happy

        const valueNode = nameProperty.value;
        const value = valueNode.type === TSESTree.AST_NODE_TYPES.Literal ? valueNode.value : undefined;
        const expectedValue = createValue(localFileName, reduxNamePrefix);

        if (value !== expectedValue) {
          context.report({
            node,
            messageId: "invalidName",
            data: { expectedValue },
            fix: hasValue(nameProperty)
              ? fixer => {
                  return fixer.replaceTextRange(valueNode.range, '"' + expectedValue + '"');
                }
              : undefined
          });
        }
      }
    };
  }
});
