import { Maybe } from "@ilbrando/utils";
import { Time } from "@internationalized/date";

import { Formatter, LocalizationTexts } from "../localization-types";

export const daDK = (format: Formatter): Partial<LocalizationTexts> => ({
  invalidValue: "Ugyldig værdi.",
  minCount: minValue => `Skal indeholde mindst ${format(minValue)} elementer.`,
  maxCount: maxValue => `Må højst indeholde ${format(maxValue)} elementer.`,
  count: (arrayCount: number) => `Skal indeholde præcis ${format(arrayCount)} elementer.`,
  required: "Skal angives.",
  equal: <T>(compareValue: Maybe<T>) => `Skal være lig med ${format(compareValue)}.`,
  notEqual: <T>(compareValue: Maybe<T>) => `Skal være forskellig fra ${format(compareValue)}.`,
  greaterThan: <T>(compareValue: Maybe<T>) => `Skal være større end ${format(compareValue)}.`,
  lessThan: <T>(compareValue: Maybe<T>) => `Skal være mindre end ${format(compareValue)}.`,
  timeWholeHour: "Klokkeslættet skal være en hel time (minutter 00).",
  timeWholeMinute: (minute: number) => `Klokkeslættet skal ligge på hvert ${format(minute)}. minut.`,
  minDate: (minValue: Date) => `Må tidligst være ${format(minValue)}.`,
  maxDate: (maxValue: Date) => `Må senest være ${format(maxValue)}.`,
  minTime: (minValue: Time) => `Må tidligst være ${format(minValue)}.`,
  maxTime: (maxValue: Time) => `Må senest være ${format(maxValue)}.`,
  email: "Ugyldig mailadresse.",
  min: (minValue: number) => `Skal være mindst ${format(minValue)}.`,
  max: (maxValue: number) => `Må højst være ${format(maxValue)}.`,
  dividableBy: (dividable: number) => `Skal være delelig med ${format(dividable)}.`,
  minLength: (minValue: number) => `Skal være mindst ${format(minValue)} tegn.`,
  maxLength: (maxValue: number) => `Må højst være ${format(maxValue)} tegn.`,
  length: (stringLength: number) => `Skal være præcis ${format(stringLength)} tegn.`,
  uri: "Ugyldig adresse."
});
