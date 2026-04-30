import { getEditor } from "@ilbrando/simple-form";
import { assertNever, hasValue, hasValueAndNotEmptyString, OmitSafe, PropKeysOf } from "@ilbrando/utils";
import { TextField, TextFieldProps } from "@mui/material";
import { useMuiFormUtils } from "src/utils";

import { FormFieldBaseProps } from "../types";

type FormValue = string;

export type FormTextProps<TFields, TFieldName extends PropKeysOf<TFields, FormValue>> = OmitSafe<TextFieldProps, "value" | "error" | "required" | "helperText" | "onChange"> &
  FormFieldBaseProps<TFields, FormValue, TFieldName> & {
    textTransform?: "lower-case" | "upper-case";
  };

export const FormText = function <TFields, TFieldName extends PropKeysOf<TFields, FormValue>>(props: FormTextProps<TFields, TFieldName>) {
  const { formManager, fieldName, textTransform, disabled, reserveSpaceForValidationMessage, ...rest } = props;

  const { effectiveReserveSpaceForValidationMessage } = useMuiFormUtils(reserveSpaceForValidationMessage);

  const editor = getEditor<TFields, FormValue>(formManager, fieldName, disabled);

  const parseValue = (value: string) => {
    if (!hasValueAndNotEmptyString(value)) return null;
    if (!hasValue(textTransform)) return value;
    switch (textTransform) {
      case "lower-case":
        return value.toLocaleLowerCase();
      case "upper-case":
        return value.toLocaleUpperCase();
      default:
        assertNever(textTransform);
    }
  };

  return (
    <TextField
      value={editor.value ?? ""}
      helperText={editor.errorMessage ?? (effectiveReserveSpaceForValidationMessage ? " " : undefined)}
      disabled={editor.isDisabled}
      error={hasValue(editor.errorMessage)}
      required={editor.isRequired}
      onChange={e => editor.setFieldValue(parseValue(e.target.value))}
      {...rest}
    />
  );
};
