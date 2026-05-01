import { getEditor } from "@ilbrando/simple-form";
import { assertNever, hasValue, hasValueAndNotEmptyString, OmitSafe, PropKeysOf } from "@ilbrando/utils";
import { Input, InputProps } from "@mui/joy";
import { FormControlWrapper } from "src/components";

import { FormFieldBaseProps } from "../types";

type FormValue = string;

export type FormTextProps<TFields, TFieldName extends PropKeysOf<TFields, FormValue>> = OmitSafe<InputProps, "value" | "error" | "required" | "onChange"> &
  FormFieldBaseProps<TFields, FormValue, TFieldName> & {
    textTransform?: "lower-case" | "upper-case";
  };

export const FormText = function <TFields, TFieldName extends PropKeysOf<TFields, FormValue>>(props: FormTextProps<TFields, TFieldName>) {
  const { formManager, fieldName, textTransform, disabled, readOnly, label, size, reserveSpaceForValidationMessage, sxFormControl, ...rest } = props;

  const editor = getEditor<TFields, FormValue>(formManager, fieldName, disabled);

  const isDisabled = !(readOnly ?? false) && editor.isDisabled; // If readonly is true we don't disable the input because then the user can't copy the value

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
    <FormControlWrapper
      label={label}
      errorMessage={editor.errorMessage}
      reserveSpaceForValidationMessage={reserveSpaceForValidationMessage}
      size={size}
      sxFormControl={sxFormControl}
      isDisabled={isDisabled}
      isRequired={editor.isRequired}
    >
      <Input value={editor.value ?? ""} readOnly={readOnly} onChange={e => editor.setFieldValue(parseValue(e.target.value))} {...rest} />
    </FormControlWrapper>
  );
};
