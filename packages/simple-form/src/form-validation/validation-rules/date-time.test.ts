import { parseTime, parseZonedDateTime, Time, ZonedDateTime } from "@internationalized/date";
import { renderHook } from "@testing-library/react";
import { describe, test } from "vitest";

import { useDateTimeValidationRules } from "./date-time";
import { assertValidationResult, genericErrorMessage } from "./validation-test-utils";

describe("date-time", () => {
  test.each`
    value                            | expected
    ${new Date(2024, 11, 24, 1, 0)}  | ${undefined}
    ${new Date(2024, 11, 24, 1, 30)} | ${genericErrorMessage}
  `("timeWholeHour($value) => $expected", ({ value, expected }: { value: Date; expected: string | undefined }) => {
    // Arrange
    const { result } = renderHook(() => useDateTimeValidationRules());

    // Act
    const actual = result.current.timeWholeHour()(value);

    // Assert
    assertValidationResult(expected, actual);
  });

  test.each`
    value                                                        | expected
    ${parseZonedDateTime("2024-12-24T01:00[Europe/Copenhagen]")} | ${undefined}
    ${parseZonedDateTime("2024-12-24T01:30[Europe/Copenhagen]")} | ${genericErrorMessage}
  `("timeWholeHourZoned($value) => $expected", ({ value, expected }: { value: ZonedDateTime; expected: string | undefined }) => {
    // Arrange
    const { result } = renderHook(() => useDateTimeValidationRules());

    // Act
    const actual = result.current.timeWholeHourZoned()(value);

    // Assert
    assertValidationResult(expected, actual);
  });

  test.each`
    value                            | parameter | expected
    ${new Date(2024, 11, 24, 1, 0)}  | ${15}     | ${undefined}
    ${new Date(2024, 11, 24, 1, 15)} | ${15}     | ${undefined}
    ${new Date(2024, 11, 24, 1, 30)} | ${15}     | ${undefined}
    ${new Date(2024, 11, 24, 1, 45)} | ${15}     | ${undefined}
    ${new Date(2024, 11, 24, 1, 16)} | ${15}     | ${genericErrorMessage}
  `("timeWholeHour($value) => $expected", ({ value, parameter, expected }: { value: Date; parameter: number; expected: string | undefined }) => {
    // Arrange
    const { result } = renderHook(() => useDateTimeValidationRules());

    // Act
    const actual = result.current.timeWholeMinute(parameter)(value);

    // Assert
    assertValidationResult(expected, actual);
  });

  test.each`
    value                                                        | parameter | expected
    ${parseZonedDateTime("2024-12-24T01:00[Europe/Copenhagen]")} | ${15}     | ${undefined}
    ${parseZonedDateTime("2024-12-24T01:15[Europe/Copenhagen]")} | ${15}     | ${undefined}
    ${parseZonedDateTime("2024-12-24T01:30[Europe/Copenhagen]")} | ${15}     | ${undefined}
    ${parseZonedDateTime("2024-12-24T01:45[Europe/Copenhagen]")} | ${15}     | ${undefined}
    ${parseZonedDateTime("2024-12-24T01:16[Europe/Copenhagen]")} | ${15}     | ${genericErrorMessage}
  `("timeWholeHour($value) => $expected", ({ value, parameter, expected }: { value: ZonedDateTime; parameter: number; expected: string | undefined }) => {
    // Arrange
    const { result } = renderHook(() => useDateTimeValidationRules());

    // Act
    const actual = result.current.timeWholeMinuteZoned(parameter)(value);

    // Assert
    assertValidationResult(expected, actual);
  });

  test.each`
    value                     | parameter                 | expected
    ${new Date(2024, 11, 24)} | ${new Date(2024, 11, 24)} | ${undefined}
    ${new Date(2024, 11, 24)} | ${new Date(2024, 11, 25)} | ${genericErrorMessage}
  `("minDate($value) => $expected", ({ value, parameter, expected }: { value: Date; parameter: Date; expected: string | undefined }) => {
    // Arrange
    const { result } = renderHook(() => useDateTimeValidationRules());

    // Act
    const actual = result.current.minDate(parameter)(value);

    // Assert
    assertValidationResult(expected, actual);
  });

  test.each`
    value                                                        | parameter                                                    | expected
    ${parseZonedDateTime("2024-12-24T00:00[Europe/Copenhagen]")} | ${parseZonedDateTime("2024-12-24T00:00[Europe/Copenhagen]")} | ${undefined}
    ${parseZonedDateTime("2024-12-24T00:00[Europe/Copenhagen]")} | ${parseZonedDateTime("2024-12-25T00:00[Europe/Copenhagen]")} | ${genericErrorMessage}
  `("minDate($value) => $expected", ({ value, parameter, expected }: { value: ZonedDateTime; parameter: ZonedDateTime; expected: string | undefined }) => {
    // Arrange
    const { result } = renderHook(() => useDateTimeValidationRules());

    // Act
    const actual = result.current.minDateZoned(parameter)(value);

    // Assert
    assertValidationResult(expected, actual);
  });

  test.each`
    value                     | parameter                 | expected
    ${new Date(2024, 11, 24)} | ${new Date(2024, 11, 24)} | ${undefined}
    ${new Date(2024, 11, 24)} | ${new Date(2024, 11, 23)} | ${genericErrorMessage}
  `("maxDate($value) => $expected", ({ value, parameter, expected }: { value: Date; parameter: Date; expected: string | undefined }) => {
    // Arrange
    const { result } = renderHook(() => useDateTimeValidationRules());

    // Act
    const actual = result.current.maxDate(parameter)(value);

    // Assert
    assertValidationResult(expected, actual);
  });

  test.each`
    value                                                        | parameter                                                    | expected
    ${parseZonedDateTime("2024-12-24T00:00[Europe/Copenhagen]")} | ${parseZonedDateTime("2024-12-24T00:00[Europe/Copenhagen]")} | ${undefined}
    ${parseZonedDateTime("2024-12-24T00:00[Europe/Copenhagen]")} | ${parseZonedDateTime("2024-12-23T00:00[Europe/Copenhagen]")} | ${genericErrorMessage}
  `("maxDate($value) => $expected", ({ value, parameter, expected }: { value: ZonedDateTime; parameter: ZonedDateTime; expected: string | undefined }) => {
    // Arrange
    const { result } = renderHook(() => useDateTimeValidationRules());

    // Act
    const actual = result.current.maxDateZoned(parameter)(value);

    // Assert
    assertValidationResult(expected, actual);
  });

  test.each`
    value                 | parameter             | expected
    ${parseTime("14:15")} | ${parseTime("14:00")} | ${undefined}
    ${parseTime("14:15")} | ${parseTime("14:15")} | ${undefined}
    ${parseTime("14:15")} | ${parseTime("15:00")} | ${genericErrorMessage}
  `("minTime($value) => $expected", ({ value, parameter, expected }: { value: Time; parameter: Time; expected: string | undefined }) => {
    // Arrange
    const { result } = renderHook(() => useDateTimeValidationRules());

    // Act
    const actual = result.current.minTime(parameter)(value);

    // Assert
    assertValidationResult(expected, actual);
  });

  test.each`
    value                 | parameter             | expected
    ${parseTime("14:15")} | ${parseTime("15:00")} | ${undefined}
    ${parseTime("14:15")} | ${parseTime("14:15")} | ${undefined}
    ${parseTime("14:15")} | ${parseTime("14:00")} | ${genericErrorMessage}
  `("maxTime($value) => $expected", ({ value, parameter, expected }: { value: Time; parameter: Time; expected: string | undefined }) => {
    // Arrange
    const { result } = renderHook(() => useDateTimeValidationRules());

    // Act
    const actual = result.current.maxTime(parameter)(value);

    // Assert
    assertValidationResult(expected, actual);
  });
});
