import { expect, test } from "@playwright/experimental-ct-react";

import { FormRangeSliderValue } from "../form-range-slider";
import { FormRangeSliderTestComponent } from "./form-range-slider-test-component";

test("updates form state when receiving input", async ({ mount }) => {
  // Arrange
  const initialValue: FormRangeSliderValue | null = {
    from: 10,
    to: 50
  };

  let rangeValue: FormRangeSliderValue | null = null;

  // Act
  const component = await mount(
    <FormRangeSliderTestComponent
      formOptions={{
        rangeField: {
          initialValue
        }
      }}
      onChange={{
        rangeField: v => {
          rangeValue = v;
        }
      }}
    />
  );

  await component.locator(".MuiSlider-thumb").first().hover();
  await component.page().mouse.down();
  await component.page().keyboard.press("ArrowRight");

  // Assert
  expect(rangeValue).not.toBeNull();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  expect(rangeValue!.from).toBeGreaterThan(initialValue.from);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  expect(rangeValue!.to).toBe(initialValue.to);
});

test("renders label", async ({ mount }) => {
  // Arrange
  const expected = "Label here";

  // Act
  const component = await mount(<FormRangeSliderTestComponent formRangeSliderProps={{ label: expected }} />);

  // Assert
  await expect(component).toContainText(expected);
});
