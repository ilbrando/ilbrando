import { expect, test } from "@playwright/experimental-ct-react";
import { alwaysErrorValidatorMessage } from "src/test-components/use-test-form";

import { FormCheckboxTestComponent } from "./form-checkbox-test-component";

test("updates form state when receiving input", async ({ mount }) => {
  // Arrange
  let booleanValue: boolean | null = null;
  const expected = true;

  // Act
  const component = await mount(
    <FormCheckboxTestComponent
      onChange={{
        booleanField: v => {
          booleanValue = v;
        }
      }}
    />
  );

  const checkbox = component.getByRole("checkbox");
  await checkbox.click();

  // Assert
  expect(booleanValue).toBe(expected);
});

test("renders label", async ({ mount }) => {
  // Arrange
  const expected = "Label here";

  // Act
  const component = await mount(<FormCheckboxTestComponent formCheckboxProps={{ label: expected }} />);

  // Assert
  await expect(component).toContainText(expected);
});

test("renders error message", async ({ mount }) => {
  // Act
  const component = await mount(<FormCheckboxTestComponent formOptions={{ booleanField: { useAlwaysErrorValidator: true } }} />);

  // touch checkbox
  const checkbox = component.getByRole("checkbox");
  await checkbox.click();
  await checkbox.click();

  // Assert
  await expect(component).toContainText(alwaysErrorValidatorMessage);
});
