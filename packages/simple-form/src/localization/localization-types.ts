import { Maybe } from "@ilbrando/utils";
import { Time } from "@internationalized/date";
import { ReactNode } from "react";

export const defaultLocale = "enUS";

export type DefaultLocale = typeof defaultLocale;

export type OtherLocales = "daDK" | "deDE";

export type Locale = DefaultLocale | OtherLocales;

export type LocalizationTexts = {
  invalidValue: string;
  minCount: (minValue: number) => string;
  maxCount: (maxValue: number) => string;
  count: (arrayCount: number) => string;
  required: string;
  equal: <T>(compareValue: Maybe<T>) => string;
  notEqual: <T>(compareValue: Maybe<T>) => string;
  greaterThan: <T>(compareValue: Maybe<T>) => string;
  lessThan: <T>(compareValue: Maybe<T>) => string;
  timeWholeHour: string;
  timeWholeMinute: (minute: number) => string;
  minDate: (minValue: Date) => string;
  maxDate: (maxValue: Date) => string;
  minTime: (minValue: Time) => string;
  maxTime: (maxValue: Time) => string;
  email: string;
  min: (minValue: number) => string;
  max: (maxValue: number) => string;
  dividableBy: (dividable: number) => string;
  minLength: (minValue: number) => string;
  maxLength: (maxValue: number) => string;
  length: (stringLength: number) => string;
  uri: string;
};

// We can't use unknown, because then we can't call toString() on it.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Formatter = (value: any) => string;

export type LocalizationContextValue = {
  locale: Locale;
  format?: Formatter;
  overrides?: (format: Formatter) => Partial<LocalizationTexts>;
};

export type LocalizationProviderProps = {
  children?: ReactNode;
  value: LocalizationContextValue;
};

export type UseLocalization = Pick<LocalizationContextValue, "locale"> & {
  texts: LocalizationTexts;
};
