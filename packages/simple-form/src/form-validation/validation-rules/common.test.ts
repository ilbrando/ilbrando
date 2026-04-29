import { renderHook } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { useCommonValidationRules } from "./common";
import { assertValidationResult, genericErrorMessage } from "./validation-test-utils";

describe("common", () => {
  test("alwaysValid", () => {
    // Arrange
    const anyValue = 42;
    const { result } = renderHook(() => useCommonValidationRules());

    // Act
    const actual = result.current.alwaysValid(anyValue);

    // Assert
    expect(actual).toBeUndefined();
  });

  test.each`
    value        | expected
    ${1}         | ${undefined}
    ${""}        | ${undefined}
    ${{ a: 2 }}  | ${undefined}
    ${undefined} | ${genericErrorMessage}
    ${null}      | ${genericErrorMessage}
  `("required($value) => $expected", ({ value, expected }) => {
    // Arrange
    const { result } = renderHook(() => useCommonValidationRules());

    // Act
    const actual = result.current.required()(value);

    // Assert
    assertValidationResult(expected, actual);
  });

  test.each`
    value    | parameter | expected
    ${1}     | ${2}      | ${genericErrorMessage}
    ${"foo"} | ${"bar"}  | ${genericErrorMessage}
    ${true}  | ${false}  | ${genericErrorMessage}
    ${1}     | ${1}      | ${undefined}
    ${"foo"} | ${"foo"}  | ${undefined}
    ${true}  | ${true}   | ${undefined}
    ${false} | ${false}  | ${undefined}
  `("equal($parameter)($value) => $expected", ({ value, parameter, expected }) => {
    // Arrange
    const { result } = renderHook(() => useCommonValidationRules());

    // Act
    const actual = result.current.equal(parameter)(value);

    // Assert
    assertValidationResult(expected, actual);
  });

  test.each`
    value    | parameter | expected
    ${1}     | ${2}      | ${undefined}
    ${"foo"} | ${"bar"}  | ${undefined}
    ${true}  | ${false}  | ${undefined}
    ${1}     | ${1}      | ${genericErrorMessage}
    ${"foo"} | ${"foo"}  | ${genericErrorMessage}
    ${true}  | ${true}   | ${genericErrorMessage}
    ${false} | ${false}  | ${genericErrorMessage}
  `("notEqual($parameter)($value) => $expected", ({ value, parameter, expected }) => {
    // Arrange
    const { result } = renderHook(() => useCommonValidationRules());

    // Act
    const actual = result.current.notEqual(parameter)(value);

    // Assert
    assertValidationResult(expected, actual);
  });

  test.each`
    value  | parameter | expected
    ${4}   | ${2}      | ${undefined}
    ${"b"} | ${"a"}    | ${undefined}
    ${2}   | ${2}      | ${genericErrorMessage}
    ${1}   | ${2}      | ${genericErrorMessage}
    ${"a"} | ${"b"}    | ${genericErrorMessage}
  `("greaterThan($parameter)($value) => $expected", ({ value, parameter, expected }) => {
    // Arrange
    const { result } = renderHook(() => useCommonValidationRules());

    // Act
    const actual = result.current.greaterThan(parameter)(value);

    // Assert
    assertValidationResult(expected, actual);
  });

  test.each`
    value  | parameter | expected
    ${4}   | ${2}      | ${genericErrorMessage}
    ${"b"} | ${"a"}    | ${genericErrorMessage}
    ${2}   | ${2}      | ${genericErrorMessage}
    ${1}   | ${2}      | ${undefined}
    ${"a"} | ${"b"}    | ${undefined}
  `("grealessThanterThan($parameter)($value) => $expected", ({ value, parameter, expected }) => {
    // Arrange
    const { result } = renderHook(() => useCommonValidationRules());

    // Act
    const actual = result.current.lessThan(parameter)(value);

    // Assert
    assertValidationResult(expected, actual);
  });
});
