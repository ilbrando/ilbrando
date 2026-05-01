import { expect, test } from "@playwright/experimental-ct-react";
import { alwaysErrorValidatorMessage } from "src/test-components/use-test-form";

import { FormSwitchTestComponent } from "./form-switch-test-component";

test("updates form state when receiving input", async ({ mount }) => {
  // Arrange
  let booleanValue: boolean | null = null;
  const expected = true;

  // Act
  const component = await mount(
    <FormSwitchTestComponent
      onChange={{
        booleanField: v => {
          booleanValue = v;
        }
      }}
    />
  );

  const switchControl = component.getByRole("switch");
  await switchControl.click();

  // Assert
  expect(booleanValue).toBe(expected);
});

test("renders label", async ({ mount }) => {
  // Arrange
  const expected = "Label here";

  // Act
  const component = await mount(<FormSwitchTestComponent formCheckboxProps={{ label: expected }} />);

  // Assert
  await expect(component).toContainText(expected);
});

test("renders error message", async ({ mount }) => {
  // Act
  const component = await mount(<FormSwitchTestComponent formOptions={{ booleanField: { useAlwaysErrorValidator: true } }} />);

  // touch switch
  const switchControl = component.getByRole("switch");
  await switchControl.click();
  await switchControl.click();

  // Assert
  await expect(component).toContainText(alwaysErrorValidatorMessage);
});
