import { renderHook } from "@testing-library/react";
import { describe, test } from "vitest";

import { useEmailValidationRules } from "./email";
import { assertValidationResult, genericErrorMessage } from "./validation-test-utils";

describe("email", () => {
  test.each`
    value            | expected
    ${"foo@bar.baz"} | ${undefined}
    ${"f44@b44.baz"} | ${undefined}
    ${"foo"}         | ${genericErrorMessage}
    ${""}            | ${genericErrorMessage}
  `("email($value) => $expected", ({ value, expected }) => {
    // Arrange
    const { result } = renderHook(() => useEmailValidationRules());

    // Act
    const actual = result.current.email()(value);

    // Assert
    assertValidationResult(expected, actual);
  });
});
