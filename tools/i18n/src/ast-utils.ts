import { ObjectLiteralExpression, SourceFile, SyntaxKind } from "ts-morph";
import { hasValue } from "@ilbrando/utils";

const TRANSLATIONS_VAR = "translations";
const LOCALIZATION_TYPE = "Localization";

export const findTranslationsObject = (sourceFile: SourceFile): ObjectLiteralExpression | undefined => {
  const decl = sourceFile.getVariableDeclaration(TRANSLATIONS_VAR);
  if (!hasValue(decl)) return undefined;
  if (decl.getTypeNode()?.getText() !== LOCALIZATION_TYPE) return undefined;
  return decl.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
};

export const getLanguageObject = (obj: ObjectLiteralExpression, language: string): ObjectLiteralExpression | undefined =>
  obj.getProperty(language)?.asKind(SyntaxKind.PropertyAssignment)?.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);

export const getKeyValues = (obj: ObjectLiteralExpression): { key: string; value: string }[] =>
  obj
    .getProperties()
    .filter(p => p.isKind(SyntaxKind.PropertyAssignment))
    .map(p => ({
      key: p.getName(),
      value: p.getInitializerIfKindOrThrow(SyntaxKind.StringLiteral).getLiteralValue()
    }));
