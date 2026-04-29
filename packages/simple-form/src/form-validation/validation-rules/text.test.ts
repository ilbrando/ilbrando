import { renderHook } from "@testing-library/react";
import { describe, test } from "vitest";

import { useTextValidationRules } from "./text";
import { assertValidationResult, genericErrorMessage } from "./validation-test-utils";

describe("text", () => {
  test.each`
    value    | parameter | expected
    ${"foo"} | ${2}      | ${undefined}
    ${"foo"} | ${3}      | ${undefined}
    ${"foo"} | ${4}      | ${genericErrorMessage}
  `("minLength($parameter)($value) => $expected", ({ value, parameter, expected }) => {
    // Arrange
    const { result } = renderHook(() => useTextValidationRules());

    // Act
    const actual = result.current.minLength(parameter)(value);

    // Assert
    assertValidationResult(expected, actual);
  });

  test.each`
    value    | parameter | expected
    ${"foo"} | ${3}      | ${undefined}
    ${"foo"} | ${4}      | ${undefined}
    ${"foo"} | ${2}      | ${genericErrorMessage}
  `("maxLength($parameter)($value) => $expected", ({ value, parameter, expected }) => {
    // Arrange
    const { result } = renderHook(() => useTextValidationRules());

    // Act
    const actual = result.current.maxLength(parameter)(value);

    // Assert
    assertValidationResult(expected, actual);
  });

  test.each`
    value    | parameter | expected
    ${"foo"} | ${3}      | ${undefined}
    ${"foo"} | ${4}      | ${genericErrorMessage}
    ${"foo"} | ${2}      | ${genericErrorMessage}
  `("length($parameter)($value) => $expected", ({ value, parameter, expected }) => {
    // Arrange
    const { result } = renderHook(() => useTextValidationRules());

    // Act
    const actual = result.current.length(parameter)(value);

    // Assert
    assertValidationResult(expected, actual);
  });
});
