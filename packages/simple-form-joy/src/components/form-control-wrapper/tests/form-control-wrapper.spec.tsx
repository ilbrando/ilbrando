import { expect, test } from "@playwright/experimental-ct-react";

import { TestWrapper } from "../../../test-components/test-wrapper";
import { FormControlWrapper } from "../form-control-wrapper";

test.describe("form-control-wrapper", () => {
  test("renders content", async ({ mount }) => {
    // Arrange
    const expectedValue = "CONTENT";

    // Act
    const component = await mount(
      <TestWrapper>
        <FormControlWrapper isDisabled={false} isRequired={false}>
          {expectedValue}
        </FormControlWrapper>
      </TestWrapper>
    );

    // Assert
    await expect(component).toContainText(expectedValue);
  });

  test("renders label", async ({ mount }) => {
    // Arrange
    const expectedValue = "LABEL";

    // Act
    const component = await mount(
      <TestWrapper>
        <FormControlWrapper label={expectedValue} isDisabled={false} isRequired={false}>
          CONTENT
        </FormControlWrapper>
      </TestWrapper>
    );

    // Assert
    await expect(component).toContainText(expectedValue);
  });

  test("renders error message", async ({ mount }) => {
    // Arrange
    const expectedValue = "ERROR MESSAGE";

    // Act
    const component = await mount(
      <TestWrapper>
        <FormControlWrapper errorMessage={expectedValue} isDisabled={false} isRequired={false}>
          CONTENT
        </FormControlWrapper>
      </TestWrapper>
    );

    // Assert
    await expect(component).toContainText(expectedValue);
  });
});
