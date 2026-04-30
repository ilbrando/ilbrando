import { hasValue } from "@ilbrando/utils";
import { ObjectLiteralExpression, SourceFile, SyntaxKind } from "ts-morph";

const TRANSLATIONS_VAR = "translations";
const LOCALIZATION_TYPE = "Localization";

export const findTranslationsObject = (sourceFile: SourceFile): ObjectLiteralExpression | undefined => {
  const decl = sourceFile.getVariableDeclaration(TRANSLATIONS_VAR);
  if (!hasValue(decl)) return undefined;
  if (!decl.getTypeNode()?.getText().startsWith(LOCALIZATION_TYPE)) return undefined;
  return decl.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
};

export const getLanguageObject = (obj: ObjectLiteralExpression, language: string): ObjectLiteralExpression | undefined =>
  obj.getProperty(language)?.asKind(SyntaxKind.PropertyAssignment)?.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);

export const getKeyValues = (obj: ObjectLiteralExpression): { key: string; value: string }[] =>
  obj
    .getProperties()
    .filter(p => p.isKind(SyntaxKind.PropertyAssignment))
    .map(p => {
      const init = p.getInitializer();
      const stringLiteral = init?.asKind(SyntaxKind.StringLiteral);
      const templateLiteral = init?.asKind(SyntaxKind.NoSubstitutionTemplateLiteral);
      const literal = stringLiteral ?? templateLiteral;
      if (!hasValue(literal)) throw new Error(`Property "${p.getName()}" must be a string literal or template literal`);
      return { key: p.getName(), value: literal.getLiteralValue() };
    });
