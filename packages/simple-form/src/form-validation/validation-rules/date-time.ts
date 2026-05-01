import { hasValue } from "@ilbrando/utils";
import { Time, ZonedDateTime } from "@internationalized/date";
import { useLocalization } from "src/localization";

import { Validator } from "../validation-types";

export const useDateTimeValidationRules = () => {
  const { texts } = useLocalization();

  return {
    timeWholeHour:
      (errorMessage?: string): Validator<Date> =>
      value =>
        hasValue(value) && value.getMinutes() !== 0 ? (errorMessage ?? texts.timeWholeHour) : undefined,

    timeWholeHourZoned:
      (errorMessage?: string): Validator<ZonedDateTime> =>
      value =>
        hasValue(value) && value.minute !== 0 ? (errorMessage ?? texts.timeWholeHour) : undefined,

    timeWholeMinute:
      (minute: number, errorMessage?: string): Validator<Date> =>
      value =>
        hasValue(value) && value.getMinutes() % minute !== 0 ? (errorMessage ?? texts.timeWholeMinute(minute)) : undefined,

    timeWholeMinuteZoned:
      (minute: number, errorMessage?: string): Validator<ZonedDateTime> =>
      value =>
        hasValue(value) && value.minute % minute !== 0 ? (errorMessage ?? texts.timeWholeMinute(minute)) : undefined,

    minDate:
      (min: Date, errorMessage?: string): Validator<Date> =>
      value =>
        hasValue(value) && value < min ? (errorMessage ?? texts.minDate(min)) : undefined,

    minDateZoned:
      (min: ZonedDateTime, errorMessage?: string): Validator<ZonedDateTime> =>
      value =>
        hasValue(value) && value < min ? (errorMessage ?? texts.minDate(min.toDate())) : undefined,

    maxDate:
      (max: Date, errorMessage?: string): Validator<Date> =>
      value =>
        hasValue(value) && value > max ? (errorMessage ?? texts.maxDate(max)) : undefined,

    maxDateZoned:
      (max: ZonedDateTime, errorMessage?: string): Validator<ZonedDateTime> =>
      value =>
        hasValue(value) && value > max ? (errorMessage ?? texts.maxDate(max.toDate())) : undefined,

    minTime:
      (min: Time, errorMessage?: string): Validator<Time> =>
      value =>
        hasValue(value) && value < min ? (errorMessage ?? texts.minTime(min)) : undefined,

    maxTime:
      (max: Time, errorMessage?: string): Validator<Time> =>
      value =>
        hasValue(value) && value > max ? (errorMessage ?? texts.maxTime(max)) : undefined
  };
};
