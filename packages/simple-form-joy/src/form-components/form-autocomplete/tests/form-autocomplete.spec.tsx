import { expect, test } from "@playwright/experimental-ct-react";
import { alwaysErrorValidatorMessage } from "src/test-components/use-test-form";

import { FormAutocompleteTestComponent } from "./form-autocomplete-test-component";
import { options } from "./test-data";

test("updates form state when receiving input", async ({ mount }) => {
  // Arrange
  let stringValue: string | null = null;
  const optionsIndex = 1;
  const expected = options[optionsIndex].value;

  // Act
  const component = await mount(
    <FormAutocompleteTestComponent
      onChange={{
        stringField: v => {
          stringValue = v;
        }
      }}
    />
  );

  const combobox = component.getByRole("combobox");
  await combobox.focus();
  await component.page().keyboard.press("ArrowDown");
  await component.page().keyboard.press("ArrowDown");
  await component.page().keyboard.press("ArrowDown");
  await component.page().keyboard.press("Enter");

  // Assert
  expect(stringValue).toBe(expected);
});

test("renders label", async ({ mount }) => {
  // Arrange
  const expected = "Label here";

  // Act
  const component = await mount(<FormAutocompleteTestComponent formAutocompleteProps={{ label: expected }} />);

  // Assert
  await expect(component).toContainText(expected);
});

test("renders error message", async ({ mount }) => {
  // Act
  const component = await mount(<FormAutocompleteTestComponent formOptions={{ stringField: { useAlwaysErrorValidator: true } }} />);

  // touch text box
  const combobox = component.getByRole("combobox");
  await combobox.focus();
  await component.page().keyboard.press("ArrowDown");
  await component.page().keyboard.press("ArrowDown");
  await component.page().keyboard.press("ArrowDown");
  await component.page().keyboard.press("Enter");
  await combobox.clear();

  // Assert
  await expect(component).toContainText(alwaysErrorValidatorMessage);
});
