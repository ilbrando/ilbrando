import { getEditor } from "@ilbrando/simple-form";
import { hasValue, OmitSafe, PropKeysOf } from "@ilbrando/utils";
import { FormControl, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup, RadioGroupProps, useTheme } from "@mui/material";
import { useMuiFormUtils } from "src/utils";

import { FormFieldBaseProps } from "../types";

type FormValue = string | number;

export type RadioGroupOption<T> = {
  value: T;
  label: string;
};

export type FormRadioGroupProps<TFields, TFormValue extends FormValue, TFieldName extends PropKeysOf<TFields, TFormValue>> = OmitSafe<RadioGroupProps, "value" | "onChange"> &
  FormFieldBaseProps<TFields, TFormValue, TFieldName> & {
    options: RadioGroupOption<TFormValue>[];
    label?: string;
    disabled?: boolean;
  };

export const FormRadioGroup = function <TFields, TFormValue extends FormValue, TFieldName extends PropKeysOf<TFields, TFormValue>>(props: FormRadioGroupProps<TFields, TFormValue, TFieldName>) {
  const { formManager, fieldName, disabled = false, label, options, reserveSpaceForValidationMessage, ...rest } = props;

  const theme = useTheme();

  const { effectiveReserveSpaceForValidationMessage } = useMuiFormUtils(reserveSpaceForValidationMessage);

  const editor = getEditor<TFields, TFormValue>(formManager, fieldName, disabled);

  const isValueString = options.length > 0 && typeof options[0].value === "string";

  return (
    <FormControl disabled={editor.isDisabled} error={hasValue(editor.errorMessage)} required={editor.isRequired}>
      <FormLabel component="label">{label}</FormLabel>
      <RadioGroup value={editor.value ?? ""} onChange={(_, v) => editor.setFieldValue((isValueString ? v : parseInt(v)) as TFormValue)} {...rest}>
        {options.map(item => (
          <FormControlLabel
            key={item.value}
            value={item.value}
            label={item.label}
            control={<Radio color="primary" sx={{ paddingTop: theme.spacing(0.5), paddingBottom: theme.spacing(0.5) }} disabled={editor.isDisabled} />}
          />
        ))}
      </RadioGroup>
      <FormHelperText>{editor.errorMessage ?? (effectiveReserveSpaceForValidationMessage ? " " : null)}</FormHelperText>
    </FormControl>
  );
};
