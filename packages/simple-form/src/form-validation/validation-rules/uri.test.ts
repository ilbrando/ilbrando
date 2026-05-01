import { renderHook } from "@testing-library/react";
import { describe, test } from "vitest";

import { useUriValidationRules } from "./uri";
import { assertValidationResult, genericErrorMessage } from "./validation-test-utils";

describe("email", () => {
  test.each`
    value                    | expected
    ${"http://foo.bar"}      | ${undefined}
    ${"https://foo.bar"}     | ${undefined}
    ${"https://foo.bar.baz"} | ${undefined}
    ${"foo"}                 | ${genericErrorMessage}
    ${"f00@bar.b44"}         | ${genericErrorMessage}
    ${""}                    | ${genericErrorMessage}
  `("uri($value) => $expected", ({ value, expected }) => {
    // Arrange
    const { result } = renderHook(() => useUriValidationRules());

    // Act
    const actual = result.current.uri()(value);

    // Assert
    assertValidationResult(expected, actual);
  });
});
