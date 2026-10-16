import { Maybe } from "@ilbrando/utils";
import { Time } from "@internationalized/date";

import { Formatter, LocalizationTexts } from "../localization-types";

export const enUS = (format: Formatter): LocalizationTexts => ({
  invalidValue: "Invalid value.",
  minCount: minValue => `Must contain at least ${format(minValue)} elements.`,
  maxCount: maxValue => `Must contain at most ${format(maxValue)} elements.`,
  count: (arrayCount: number) => `Must contain exactly ${format(arrayCount)} elements.`,
  required: "Is required.",
  equal: <T>(compareValue: Maybe<T>) => `Must be equal to ${format(compareValue)}.`,
  notEqual: <T>(compareValue: Maybe<T>) => `Must be different from ${format(compareValue)}.`,
  greaterThan: <T>(compareValue: Maybe<T>) => `Must be greater than ${format(compareValue)}.`,
  lessThan: <T>(compareValue: Maybe<T>) => `Must be less than ${format(compareValue)}.`,
  timeWholeHour: "The time must be a whole hour (minutes 00).",
  timeWholeMinute: (minute: number) => `The minutes must be a multiple of ${format(minute)}.`,
  minDate: (minValue: Date) => `Must not be earlier than ${format(minValue)}.`,
  maxDate: (maxValue: Date) => `Must not be later than ${format(maxValue)}.`,
  minTime: (minValue: Time) => `Must not be earlier than ${format(minValue)}.`,
  maxTime: (maxValue: Time) => `Must not be later than ${format(maxValue)}.`,
  email: "Invalid email address.",
  min: (minValue: number) => `Must be at least ${format(minValue)}.`,
  max: (maxValue: number) => `Must be at most ${format(maxValue)}.`,
  dividableBy: (dividable: number) => `Must be divisible by ${format(dividable)}.`,
  minLength: (minValue: number) => `Must be at least ${format(minValue)} characters.`,
  maxLength: (maxValue: number) => `Must be at most ${format(maxValue)} characters.`,
  length: (stringLength: number) => `Must be exactly ${format(stringLength)} characters.`,
  uri: "Invalid address."
});
