import { getEditor, useLocalization } from "@ilbrando/simple-form";
import { hasValue, hasValueAndNotEmptyString, OmitSafe, PropKeysOf } from "@ilbrando/utils";
import { Input, InputProps } from "@mui/joy";
import { useEffect, useState } from "react";
import { FormControlWrapper } from "src/components";

import { FormFieldBaseProps } from "../types";

type FormValue = number;

export type FormNumberProps<TFields, TFieldName extends PropKeysOf<TFields, FormValue>> = OmitSafe<InputProps, "value" | "error" | "required" | "onChange"> & FormFieldBaseProps<TFields, FormValue, TFieldName>;

const isValidValue = (value: string) => /^[-]?(\d+)$/.test(value);

export const FormNumber = function <TFields, TFieldName extends PropKeysOf<TFields, FormValue>>(props: FormNumberProps<TFields, TFieldName>) {
  const { formManager, fieldName, disabled, readOnly, label, size, reserveSpaceForValidationMessage, sxFormControl, ...rest } = props;

  const { texts } = useLocalization();

  const editor = getEditor<TFields, FormValue>(formManager, fieldName, disabled);

  const isDisabled = !(readOnly ?? false) && editor.isDisabled; // If readonly is true we don't disable the input because then the user can't copy the value

  const [textBoxValue, setTextBoxValue] = useState<string>(hasValue(editor.value) ? editor.value.toString() : "");

  useEffect(() => {
    setTextBoxValue(hasValue(editor.value) ? editor.value.toString() : "");
  }, [editor.value]);

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
      <Input
        value={textBoxValue}
        readOnly={readOnly}
        onChange={e => {
          if (!hasValueAndNotEmptyString(e.target.value)) {
            setTextBoxValue("");
            editor.setFieldValue(null);
            return;
          }
          if (isValidValue(e.target.value)) {
            const parsedValue = parseInt(e.target.value);
            setTextBoxValue(e.target.value);
            editor.setFieldValue(parsedValue);
            return;
          }
          setTextBoxValue(e.target.value);
          editor.setFieldValue(editor.value, texts.invalidValue);
        }}
        {...rest}
      />
    </FormControlWrapper>
  );
};
