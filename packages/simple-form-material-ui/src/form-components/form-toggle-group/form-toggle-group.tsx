import { getEditor } from "@ilbrando/simple-form";
import { hasValue, OmitSafe, PropKeysOf } from "@ilbrando/utils";
import { FormControl, FormHelperText, FormLabel, ToggleButton, ToggleButtonGroup, ToggleButtonGroupProps } from "@mui/material";
import { ReactNode } from "react";
import { useMuiFormUtils } from "src/utils";

import { FormFieldBaseArrayProps } from "../types";

type FormValue = string | number;

export type ToggleGroupOption<T extends FormValue> = {
  key: string | number;
  value: T;
  content: ReactNode;
};

export type FormToggleGroupProps<TFields, TFormValue extends FormValue, TFieldName extends PropKeysOf<TFields, TFormValue[]>> = OmitSafe<ToggleButtonGroupProps, "value" | "onChange" | "children"> &
  FormFieldBaseArrayProps<TFields, TFormValue, TFieldName> & {
    options: ToggleGroupOption<TFormValue>[];
    label?: string;
    disabled?: boolean;
  };

export const FormToggleGroup = function <TFields, TFormValue extends FormValue, TFieldName extends PropKeysOf<TFields, TFormValue[]>>(props: FormToggleGroupProps<TFields, TFormValue, TFieldName>) {
  const { formManager, fieldName, disabled = false, label, options, reserveSpaceForValidationMessage, ...rest } = props;

  const { effectiveReserveSpaceForValidationMessage } = useMuiFormUtils(reserveSpaceForValidationMessage);

  const editor = getEditor<TFields, TFormValue>(formManager, fieldName, disabled);

  return (
    <FormControl disabled={editor.isDisabled} error={hasValue(editor.errorMessage)} required={editor.isRequired}>
      <FormLabel component="label">{label}</FormLabel>
      <ToggleButtonGroup value={editor.value} onChange={(_, v) => editor.setFieldValue(v)} {...rest}>
        {options.map(item => (
          <ToggleButton key={item.key} value={item.value} sx={{ border: 0 }}>
            {item.content}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <FormHelperText>{editor.errorMessage ?? (effectiveReserveSpaceForValidationMessage ? " " : null)}</FormHelperText>
    </FormControl>
  );
};
