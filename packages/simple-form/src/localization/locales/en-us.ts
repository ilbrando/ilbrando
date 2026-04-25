import { Maybe } from "@ilbrando/utils";
import { Time } from "@internationalized/date";

import { Formatter, LocalizationTexts } from "../localization-types";

export const enUS = (format: Formatter): LocalizationTexts => ({
  invalidValue: "Invalid value.",
  minCount: minValue => `Must contain at least ${format(minValue)} elements.`,
  maxCount: maxValue => `Can at most contain ${format(maxValue)} elements.`,
  count: (arrayCount: number) => `Must contain exactly ${format(arrayCount)} elements.`,
  required: "Is required.",
  equal: <T>(compareValue: Maybe<T>) => `Must be equal to ${format(compareValue)}.`,
  notEqual: <T>(compareValue: Maybe<T>) => `Must be different from ${format(compareValue)}.`,
  greaterThan: <T>(compareValue: Maybe<T>) => `Must be greater than ${format(compareValue)}.`,
  lessThan: <T>(compareValue: Maybe<T>) => `Must be less than ${format(compareValue)}.`,
  timeWholeHour: "The time must be whole hour (minutes equal to 00).",
  timeWholeMinute: (minute: number) => `The time must be a whole ${format(minute)} minute.`,
  minDate: (minValue: Date) => `Must be greater than or equal to ${format(minValue)}.`,
  maxDate: (maxValue: Date) => `Must be less than or equal to ${format(maxValue)}.`,
  minTime: (minValue: Time) => `Must be greater than or equal to ${format(minValue)}.`,
  maxTime: (maxValue: Time) => `Must be less than or equal to ${format(maxValue)}.`,
  email: "Invalid email address.",
  min: (minValue: number) => `Must be at least ${format(minValue)}.`,
  max: (maxValue: number) => `Can at most be ${format(maxValue)}.`,
  dividableBy: (dividable: number) => `The value must be dividable with ${format(dividable)}.`,
  minLength: (minValue: number) => `Must contain at least ${format(minValue)} characters.`,
  maxLength: (maxValue: number) => `Can at most contain ${format(maxValue)} characters.`,
  length: (stringLength: number) => `Must contain exactly ${format(stringLength)} characters.`,
  uri: "The address is not valid."
});
