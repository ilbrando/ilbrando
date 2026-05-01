import { getEditor } from "@ilbrando/simple-form";
import { hasValue, OmitSafe, PropKeysOf } from "@ilbrando/utils";
import { Box, Slider, SliderProps } from "@mui/joy";
import { FormControlWrapper } from "src/components";

import { FormFieldBaseProps } from "../types";

export type FormRangeSliderValue = {
  from: number;
  to: number;
};

export type FormRangeSliderProps<TFields, TFieldName extends PropKeysOf<TFields, FormRangeSliderValue>> = OmitSafe<SliderProps, "value" | "onChange"> & FormFieldBaseProps<TFields, FormRangeSliderValue, TFieldName>;

export const FormRangeSlider = function <TFields, TFieldName extends PropKeysOf<TFields, FormRangeSliderValue>>(props: FormRangeSliderProps<TFields, TFieldName>) {
  const { formManager, fieldName, label, size, disabled, reserveSpaceForValidationMessage, sxFormControl, ...rest } = props;

  const editor = getEditor<TFields, FormRangeSliderValue>(formManager, fieldName, disabled);

  const handleOnChange = (_: unknown, v: number | number[]) => {
    if (!Array.isArray(v)) throw Error("FormRangeSlider value should be an array of two numbers.");
    if (v.length !== 2) throw Error("FormRangeSlider value should be an array of two numbers.");

    const [from, to] = v;
    const newValue: FormRangeSliderValue = { from, to };

    editor.setFieldValue(newValue);
  };

  return (
    <FormControlWrapper
      label={label}
      errorMessage={editor.errorMessage}
      reserveSpaceForValidationMessage={reserveSpaceForValidationMessage}
      size={size}
      sxFormControl={sxFormControl}
      isDisabled={editor.isDisabled}
      isRequired={editor.isRequired}
    >
      <Box px={1}>
        <Slider value={hasValue(editor.value) ? [editor.value.from, editor.value.to] : [0, 0]} disabled={editor.isDisabled} onChange={handleOnChange} {...rest} />
      </Box>
    </FormControlWrapper>
  );
};
