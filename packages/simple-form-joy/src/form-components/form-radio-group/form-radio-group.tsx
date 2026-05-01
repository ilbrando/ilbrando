import { getEditor } from "@ilbrando/simple-form";
import { OmitSafe, PropKeysOf } from "@ilbrando/utils";
import { Radio, RadioGroup, RadioGroupProps } from "@mui/joy";
import { FormControlWrapper } from "src/components";

import { FormFieldBaseProps } from "../types";

type FormValue = string | number;

export type RadioGroupOption<T> = {
  value: T;
  label: string;
};

export type FormRadioGroupProps<TFields, TFormValue extends FormValue, TFieldName extends PropKeysOf<TFields, TFormValue>> = OmitSafe<RadioGroupProps, "value" | "onChange"> &
  FormFieldBaseProps<TFields, TFormValue, TFieldName> & {
    options: RadioGroupOption<TFormValue>[];
    disabled?: boolean;
  };

export const FormRadioGroup = function <TFields, TFormValue extends FormValue, TFieldName extends PropKeysOf<TFields, TFormValue>>(props: FormRadioGroupProps<TFields, TFormValue, TFieldName>) {
  const { formManager, fieldName, disabled = false, label, size, options, reserveSpaceForValidationMessage, sxFormControl, ...rest } = props;

  const editor = getEditor<TFields, TFormValue>(formManager, fieldName, disabled);

  const isValueString = options.length > 0 && typeof options[0].value === "string";

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
      <RadioGroup value={editor.value ?? ""} onChange={e => editor.setFieldValue((isValueString ? e.target.value : parseInt(e.target.value)) as TFormValue)} {...rest}>
        {options.map(item => (
          <Radio key={item.value} value={item.value} label={item.label} disabled={editor.isDisabled} />
        ))}
      </RadioGroup>
    </FormControlWrapper>
  );
};
