import { renderHook } from "@testing-library/react";
import { describe, test } from "vitest";

import { useArrayValidationRules } from "./array";
import { assertValidationResult, genericErrorMessage } from "./validation-test-utils";

describe("array", () => {
  test.each`
    value     | parameter | expected
    ${[1, 2]} | ${1}      | ${genericErrorMessage}
    ${[1, 2]} | ${3}      | ${genericErrorMessage}
    ${[1, 2]} | ${2}      | ${undefined}
    ${[]}     | ${0}      | ${undefined}
  `("count($parameter)($value) => $expected", ({ value, parameter, expected }) => {
    // Arrange
    const { result } = renderHook(() => useArrayValidationRules());

    // Act
    const actual = result.current.count(parameter)(value);

    // Assert
    assertValidationResult(expected, actual);
  });

  test.each`
    value     | parameter | expected
    ${[1, 2]} | ${1}      | ${genericErrorMessage}
    ${[1, 2]} | ${3}      | ${undefined}
    ${[1, 2]} | ${2}      | ${undefined}
    ${[]}     | ${0}      | ${undefined}
  `("maxCount($parameter)($value) => $expected", ({ value, parameter, expected }) => {
    // Arrange
    const { result } = renderHook(() => useArrayValidationRules());

    // Act
    const actual = result.current.maxCount(parameter)(value);

    // Assert
    assertValidationResult(expected, actual);
  });

  test.each`
    value     | parameter | expected
    ${[1, 2]} | ${1}      | ${undefined}
    ${[1, 2]} | ${3}      | ${genericErrorMessage}
    ${[1, 2]} | ${2}      | ${undefined}
    ${[]}     | ${0}      | ${undefined}
  `("minCount($parameter)($value) => $expected", ({ value, parameter, expected }) => {
    // Arrange
    const { result } = renderHook(() => useArrayValidationRules());

    // Act
    const actual = result.current.minCount(parameter)(value);

    // Assert
    assertValidationResult(expected, actual);
  });
});
