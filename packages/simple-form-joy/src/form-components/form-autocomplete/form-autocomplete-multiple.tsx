import { getEditor } from "@ilbrando/simple-form";
import { OmitSafe, PropKeysOf, single } from "@ilbrando/utils";
import { Autocomplete, AutocompleteProps } from "@mui/joy";
import { useMemo } from "react";
import { FormControlWrapper } from "src/components";

import { FormFieldBaseArrayProps } from "../types";
import { AutocompleteOption } from "./form-autocomplete-types";

type FormValue = string | number;

export type FormAutocompleteMultipleProps<TFields, TFormValue extends FormValue, TFieldName extends PropKeysOf<TFields, TFormValue[]>> = OmitSafe<
  AutocompleteProps<TFormValue, undefined, undefined, undefined>,
  "value" | "defaultValue" | "onChange" | "options" | "getOptionLabel" | "renderOption" | "multiple" | "renderTags"
> &
  FormFieldBaseArrayProps<TFields, TFormValue, TFieldName> & {
    options: AutocompleteOption<TFormValue>[];
  };

export const FormAutocompleteMultiple = function <TFields, TFormValue extends FormValue, TFieldName extends PropKeysOf<TFields, TFormValue[]>>(props: FormAutocompleteMultipleProps<TFields, TFormValue, TFieldName>) {
  const { formManager, fieldName, disabled, options, label, size, reserveSpaceForValidationMessage, sxFormControl, ...rest } = props;

  const editor = getEditor<TFields, TFormValue[]>(formManager, fieldName, disabled);

  const optionValues = useMemo(() => options.map(x => x.value), [options]);

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
      <Autocomplete
        value={editor.value ?? []}
        getOptionLabel={optionValue => single(options, x => x.value === optionValue).label}
        multiple={true}
        options={optionValues}
        onChange={(_, v, reason) => {
          switch (reason) {
            case "clear":
              editor.setFieldValue(null);
              break;
            case "selectOption":
            case "removeOption":
              editor.setFieldValue(v);
              break;
            default:
          }
        }}
        {...rest}
      />
    </FormControlWrapper>
  );
};
