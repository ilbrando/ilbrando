import { hasValue } from "@ilbrando/utils";
import { AST_NODE_TYPES, parse, type TSESTree } from "@typescript-eslint/typescript-estree";

import type { TranslationTree } from "./types.js";

const translationsVariableName = "translations";
const localizationTypeName = "Localization";

const formatLocation = (filePath: string, node: TSESTree.Node) => `${filePath}:${node.loc.start.line}:${node.loc.start.column + 1}`;

const translationError = (filePath: string, node: TSESTree.Node, message: string) => new Error(`${message} (${formatLocation(filePath, node)})`);

const getTopLevelVariableDeclarators = (program: TSESTree.Program) =>
  program.body.flatMap(statement => {
    if (statement.type === AST_NODE_TYPES.VariableDeclaration) return statement.declarations;
    if (statement.type === AST_NODE_TYPES.ExportNamedDeclaration && statement.declaration?.type === AST_NODE_TYPES.VariableDeclaration) return statement.declaration.declarations;
    return [];
  });

/** Matches `const translations: Localization<...> = ...` */
const isTranslationsDeclarator = (declarator: TSESTree.VariableDeclarator) => {
  if (declarator.id.type !== AST_NODE_TYPES.Identifier || declarator.id.name !== translationsVariableName) return false;
  const typeNode = declarator.id.typeAnnotation?.typeAnnotation;
  return hasValue(typeNode) && typeNode.type === AST_NODE_TYPES.TSTypeReference && typeNode.typeName.type === AST_NODE_TYPES.Identifier && typeNode.typeName.name === localizationTypeName;
};

const getPropertyName = (filePath: string, property: TSESTree.Property) => {
  if (property.computed) throw translationError(filePath, property, "Computed property names are not supported.");
  if (property.key.type === AST_NODE_TYPES.Identifier) return property.key.name;
  if (property.key.type === AST_NODE_TYPES.Literal && typeof property.key.value === "string") return property.key.value;
  throw translationError(filePath, property, "Expected an identifier or a string as property name.");
};

const getProperties = (filePath: string, objectExpression: TSESTree.ObjectExpression) =>
  objectExpression.properties.map(property => {
    if (property.type !== AST_NODE_TYPES.Property) throw translationError(filePath, property, "Spread is not supported in translations.");
    return { name: getPropertyName(filePath, property), value: property.value, node: property };
  });

const getText = (filePath: string, node: TSESTree.Node) => {
  if (node.type === AST_NODE_TYPES.Literal && typeof node.value === "string") return node.value;
  if (node.type === AST_NODE_TYPES.TemplateLiteral && node.expressions.length === 0) return node.quasis.map(quasi => quasi.value.cooked).join("");
  throw translationError(filePath, node, "Expected a string literal or a template literal without substitutions.");
};

const getTexts = (filePath: string, objectExpression: TSESTree.ObjectExpression): TranslationTree =>
  Object.fromEntries(getProperties(filePath, objectExpression).map(({ name, value }) => [name, getText(filePath, value)]));

/**
 * Finds the top level `translations` variable typed as `Localization<...>` in the source code
 * and returns its texts for each language. Returns `undefined` if the file has no translations.
 */
export const parseTranslations = (code: string, filePath: string, languages: string[]): Record<string, TranslationTree> | undefined => {
  const program = parse(code, { filePath, loc: true });
  const declarator = getTopLevelVariableDeclarators(program).find(isTranslationsDeclarator);
  if (!hasValue(declarator)) return undefined;

  const init = declarator.init;
  if (!hasValue(init) || init.type !== AST_NODE_TYPES.ObjectExpression) throw translationError(filePath, declarator, `Expected '${translationsVariableName}' to be initialized with an object.`);

  return Object.fromEntries(
    getProperties(filePath, init).map(({ name, value, node }) => {
      if (!languages.includes(name)) throw translationError(filePath, node, `Unknown language '${name}'. Expected one of: ${languages.join(", ")}.`);
      if (value.type !== AST_NODE_TYPES.ObjectExpression) throw translationError(filePath, node, `Expected language '${name}' to be an object.`);
      return [name, getTexts(filePath, value)];
    })
  );
};
