import { TSESLint, TSESTree } from "@typescript-eslint/utils";
import { createRule, hasValue } from "src/utils/index.js";

export type Messages = "importOrder";
export type Options = [];

// Groups:
//   package   : "react", "redux"
//   project   : special case af package, der starter med "src"
//   parent    : "../foo"
//   sibling   : "./foo"

const packageRegEx = /^@*\w+/;
const projectRegEx = /^src/;
const parentRegEx = /^\.\.\//;
const siblingRegEx = /^.\//;

const calcGroup = (name: string) => {
  if (projectRegEx.test(name)) return "project";
  if (packageRegEx.test(name)) return "package";
  if (parentRegEx.test(name)) return "parent";
  if (siblingRegEx.test(name)) return "sibling";
  return undefined;
};

type ImportGroup = ReturnType<typeof calcGroup>;

type Import = {
  name: string;
  node: TSESTree.ImportDeclaration;
  group: ImportGroup;
};

const registerImport = (name: string, node: TSESTree.ImportDeclaration, imported: Import[]) => {
  const group = calcGroup(name);
  if (!group) return;
  imported.push({ name, node, group });
};

const getImportsForGroup = (imported: Import[], group: ImportGroup) => imported.filter(i => i.group === group);

const getCountOf = (source: string, search: string) => source.split(search).length - 1;

const compareString = (s1: string, s2: string) => {
  if (s1.length === 0 || s2.length === 0) return 0;
  // we prefer @ last
  if (s1[0] === "@" && s2[0] !== "@") return 1;
  if (s2[0] === "@" && s1[0] !== "@") return -1;
  if (s1 < s2) return -1;
  if (s1 > s2) return 1;
  return 0;
};

const compareDepth = (item1: Import, item2: Import) => {
  const depth = getCountOf(item1.name, "/") - getCountOf(item2.name, "/");
  if (depth !== 0) return depth;
  return compareString(item1.name, item2.name);
};

const calcOrder = (imported: Import[]) => {
  const packageImports = getImportsForGroup(imported, "package").sort(compareDepth);
  const projectImports = getImportsForGroup(imported, "project").sort(compareDepth);
  const parentImports = getImportsForGroup(imported, "parent").sort(compareDepth);
  const siblingImports = getImportsForGroup(imported, "sibling").sort(compareDepth);
  return [...packageImports, ...projectImports, ...parentImports, ...siblingImports];
};

const getNumberOfEmptyLinesBetweenImports = (context: TSESLint.RuleContext<Messages, Options>, curImport: Import, prevImport: Import) => {
  const linesBetweenImports = context.sourceCode.lines.slice(prevImport.node.loc.end.line, curImport.node.loc.start.line - 1);
  return linesBetweenImports.filter((line: string) => !line.trim().length).length;
};

const findFirstError = (context: TSESLint.RuleContext<Messages, Options>, imported: Import[], calculatedOrder: Import[]) => {
  // check import order
  for (let i = 0; i < imported.length; i++) {
    if (imported[i].name !== calculatedOrder[i].name) return imported[i];
  }
  // check blank lines
  if (imported.length > 0) {
    let prevImport = imported[0];
    for (let i = 1; i < imported.length; i++) {
      const curImport = imported[i];
      const emptyLinesCount = getNumberOfEmptyLinesBetweenImports(context, curImport, prevImport);
      if (curImport.group !== prevImport.group && emptyLinesCount !== 1) return curImport;
      if (curImport.group === prevImport.group && emptyLinesCount !== 0) return curImport;
      prevImport = curImport;
    }
  }
  return undefined;
};

export const importOrderRule = createRule<Options, Messages>({
  name: "import-order",
  meta: {
    type: "suggestion",
    docs: {
      description: "Reorders import statements."
    },
    schema: [],
    fixable: "code",
    messages: { importOrder: "Please order imports." }
  },
  defaultOptions: [],
  create: context => {
    let imported: Import[] = [];
    return {
      ImportDeclaration: node => {
        if (node.source.type === "Literal" && typeof node.source.value === "string") {
          registerImport(node.source.value, node, imported);
        }
      },
      "Program:exit": () => {
        const calculatedOrder = calcOrder(imported);
        const firstError = findFirstError(context, imported, calculatedOrder);
        if (hasValue(firstError)) {
          context.report({
            node: firstError.node,
            messageId: "importOrder",
            fix: fixer => {
              const sourceCode = context.sourceCode.getText();
              const codeStart = imported[0].node.range[0];
              const codeEnd = imported[imported.length - 1].node.range[1];
              let newCode = "";
              if (calculatedOrder.length > 0) {
                let prevImport = calculatedOrder[0];
                for (let i = 0; i < calculatedOrder.length; i++) {
                  const curImport = calculatedOrder[i];
                  const node = calculatedOrder[i].node;
                  if (curImport.group !== prevImport.group) newCode += "\n";
                  newCode += sourceCode.substring(node.range[0], node.range[1]);
                  if (i < calculatedOrder.length - 1) newCode += "\n";
                  prevImport = curImport;
                }
              }
              return fixer.replaceTextRange([codeStart, codeEnd], newCode);
            }
          });
        }
        imported = [];
      }
    };
  }
});
