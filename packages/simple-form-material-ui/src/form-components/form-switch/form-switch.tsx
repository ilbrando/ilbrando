import { getEditor } from "@ilbrando/simple-form";
import { hasValue, OmitSafe, PropKeysOf } from "@ilbrando/utils";
import { FormControl, FormControlLabel, FormHelperText, Switch, SwitchProps } from "@mui/material";
import { useMuiFormUtils } from "src/utils";

import { FormFieldBaseProps } from "../types";

type FormValue = boolean;

export type FormSwitchProps<TFields, TFieldName extends PropKeysOf<TFields, FormValue>> = OmitSafe<SwitchProps, "checked" | "value" | "required" | "onChange"> &
  FormFieldBaseProps<TFields, FormValue, TFieldName> & {
    label?: string;
  };

export const FormSwitch = function <TFields, TFieldName extends PropKeysOf<TFields, FormValue>>(props: FormSwitchProps<TFields, TFieldName>) {
  const { formManager, fieldName, disabled, label, reserveSpaceForValidationMessage, ...rest } = props;

  const { effectiveReserveSpaceForValidationMessage } = useMuiFormUtils(reserveSpaceForValidationMessage);

  const editor = getEditor<TFields, FormValue>(formManager, fieldName, disabled);

  return (
    <FormControl disabled={editor.isDisabled} error={hasValue(editor.errorMessage)} required={editor.isRequired}>
      <FormControlLabel
        label={`${label}${editor.isRequired ? " *" : ""}`}
        control={<Switch checked={editor.value ?? false} disabled={editor.isDisabled} required={editor.isRequired} onChange={e => editor.setFieldValue(e.target.checked)} {...rest} />}
        labelPlacement="end"
      />
      <FormHelperText>{editor.errorMessage ?? (effectiveReserveSpaceForValidationMessage ? " " : null)}</FormHelperText>
    </FormControl>
  );
};
