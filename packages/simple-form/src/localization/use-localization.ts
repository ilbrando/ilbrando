import { isNumber } from "@ilbrando/utils";
import { createContext, useContext } from "react";

import { localeTexts } from "./locales";
import { defaultLocale, Formatter, LocalizationContextValue, UseLocalization } from "./localization-types";

const defaultContextValue: LocalizationContextValue = { locale: defaultLocale };

export const LocalizationContext = createContext<LocalizationContextValue | undefined>(undefined);

const defaultFormatter: Formatter = value => {
  if (value instanceof Date) return value.toLocaleDateString();
  if (isNumber(value)) return value.toString();
  return value.toString();
};

export const useLocalization = (): UseLocalization => {
  const context = useContext(LocalizationContext) ?? defaultContextValue;

  const format = context.format ?? defaultFormatter;

  const texts = { ...localeTexts[defaultLocale](format), ...localeTexts[context.locale](format), ...context.overrides?.(format) };

  return { locale: context.locale, texts };
};
