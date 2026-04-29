import { DefaultLocale, Formatter, LocalizationTexts, OtherLocales } from "../localization-types";
import { daDK } from "./da-dk";
import { deDE } from "./de-de";
import { enUS } from "./en-us";

export const localeTexts: Record<DefaultLocale, (format: Formatter) => LocalizationTexts> & Record<OtherLocales, (format: Formatter) => Partial<LocalizationTexts>> = {
  enUS,
  daDK,
  deDE
};
