import { expect, test } from "@playwright/experimental-ct-react";
import { alwaysErrorValidatorMessage } from "src/test-components/use-test-form";

import { FormTextTestComponent } from "./form-text-test-component";

test("updates form state when receiving input", async ({ mount }) => {
  // Arrange
  let stringValue: string | null = null;
  const expected = "abc";

  // Act
  const component = await mount(
    <FormTextTestComponent
      onChange={{
        stringField: v => {
          stringValue = v;
        }
      }}
    />
  );

  const textBox = component.getByRole("textbox");
  await textBox.fill(expected);

  // Assert
  expect(stringValue).toBe(expected);
});

test("performs text transform lower case", async ({ mount }) => {
  // Arrange
  let stringValue: string | null = null;
  const entered = "aBc";
  const expected = entered.toLowerCase();

  // Act
  const component = await mount(
    <FormTextTestComponent
      formTextProps={{ textTransform: "lower-case" }}
      onChange={{
        stringField: v => {
          stringValue = v;
        }
      }}
    />
  );

  const textBox = component.getByRole("textbox");
  await textBox.fill(entered);

  // Assert
  expect(stringValue).toBe(expected);
});

test("performs text transform upper case", async ({ mount }) => {
  // Arrange
  let stringValue: string | null = null;
  const entered = "aBc";
  const expected = entered.toUpperCase();

  // Act
  const component = await mount(
    <FormTextTestComponent
      formTextProps={{ textTransform: "upper-case" }}
      onChange={{
        stringField: v => {
          stringValue = v;
        }
      }}
    />
  );

  const textBox = component.getByRole("textbox");
  await textBox.fill(entered);

  // Assert
  expect(stringValue).toBe(expected);
});

test("renders label", async ({ mount }) => {
  // Arrange
  const expected = "Label here";

  // Act
  const component = await mount(<FormTextTestComponent formTextProps={{ label: expected }} />);

  // Assert
  await expect(component).toContainText(expected);
});

test("renders error message", async ({ mount }) => {
  // Act
  const component = await mount(<FormTextTestComponent formOptions={{ stringField: { useAlwaysErrorValidator: true } }} />);

  // touch text box
  const textBox = component.getByRole("textbox");
  await textBox.fill("not expected");

  // Assert
  await expect(component).toContainText(alwaysErrorValidatorMessage);
});
