import { getEditor } from "@ilbrando/simple-form";
import { OmitSafe, PropKeysOf } from "@ilbrando/utils";
import { Checkbox, CheckboxProps } from "@mui/joy";
import { FormControlWrapper } from "src/components";

import { FormFieldBaseProps } from "../types";

type FormValue = boolean;

export type FormCheckboxProps<TFields, TFieldName extends PropKeysOf<TFields, FormValue>> = OmitSafe<CheckboxProps, "checked" | "value" | "required" | "onChange"> & FormFieldBaseProps<TFields, FormValue, TFieldName>;

export const FormCheckbox = function <TFields, TFieldName extends PropKeysOf<TFields, FormValue>>(props: FormCheckboxProps<TFields, TFieldName>) {
  const { formManager, fieldName, disabled, label, size, reserveSpaceForValidationMessage, sxFormControl, ...rest } = props;

  const editor = getEditor<TFields, FormValue>(formManager, fieldName, disabled);

  return (
    <FormControlWrapper
      errorMessage={editor.errorMessage}
      reserveSpaceForValidationMessage={reserveSpaceForValidationMessage}
      size={size}
      sxFormControl={sxFormControl}
      isDisabled={editor.isDisabled}
      isRequired={editor.isRequired}
    >
      <Checkbox checked={editor.value ?? false} label={label} onChange={e => editor.setFieldValue(e.target.checked)} {...rest} />
    </FormControlWrapper>
  );
};
