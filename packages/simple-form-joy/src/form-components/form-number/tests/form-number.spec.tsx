import { expect, test } from "@playwright/experimental-ct-react";
import { alwaysErrorValidatorMessage } from "src/test-components/use-test-form";

import { FormNumberTestComponent } from "./form-number-test-component";

test("updates form state when receiving input", async ({ mount }) => {
  // Arrange
  let numberValue: number | null = null;
  const expected = 123;

  // Act
  const component = await mount(
    <FormNumberTestComponent
      onChange={{
        numberField: v => {
          numberValue = v;
        }
      }}
    />
  );

  const textBox = component.getByRole("textbox");
  await textBox.fill(expected.toString());

  // Assert
  expect(numberValue).toBe(expected);
});

test("renders label", async ({ mount }) => {
  // Arrange
  const expected = "Label here";

  // Act
  const component = await mount(<FormNumberTestComponent formNumberProps={{ label: expected }} />);

  // Assert
  await expect(component).toContainText(expected);
});

test("renders invalid value message", async ({ mount }) => {
  // Arrange
  const expected = "Invalid value";

  // Act
  const component = await mount(<FormNumberTestComponent />);

  const textBox = component.getByRole("textbox");
  await textBox.fill("not a number");

  // Assert
  await expect(component).toContainText(expected);
});

test("renders error message for invalid value", async ({ mount }) => {
  // Act
  const component = await mount(<FormNumberTestComponent />);

  // touch text box
  const textBox = component.getByRole("textbox");
  await textBox.fill("not expected");

  // Assert
  await expect(component).toContainText("Invalid value");
});

test("renders error message for validation error", async ({ mount }) => {
  // Act
  const component = await mount(<FormNumberTestComponent formOptions={{ numberField: { useAlwaysErrorValidator: true } }} />);

  // touch text box
  const textBox = component.getByRole("textbox");
  await textBox.fill("1");
  await textBox.fill("");

  // Assert
  await expect(component).toContainText(alwaysErrorValidatorMessage);
});
