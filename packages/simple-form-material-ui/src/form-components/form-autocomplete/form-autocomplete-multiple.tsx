import { getEditor } from "@ilbrando/simple-form";
import { hasValue, OmitSafe, PropKeysOf, single } from "@ilbrando/utils";
import { Autocomplete, AutocompleteProps, Box, TextField } from "@mui/material";
import { useMemo } from "react";
import { useMuiFormUtils } from "src/utils";

import { FormFieldBaseArrayProps } from "../types";
import { AutocompleteOption } from "./form-autocomplete-types";

type FormValue = string | number;

export type FormAutocompleteMultipleProps<TFields, TFormValue extends FormValue, TFieldName extends PropKeysOf<TFields, TFormValue[]>> = OmitSafe<
  AutocompleteProps<TFormValue, true, undefined, undefined>,
  "value" | "onChange" | "options" | "renderOption" | "renderInput" | "multiple"
> &
  FormFieldBaseArrayProps<TFields, TFormValue, TFieldName> & {
    label?: string;
    placeholder?: string;
    options: AutocompleteOption<TFormValue>[];
  };

export const FormAutocompleteMultiple = function <TFields, TFormValue extends FormValue, TFieldName extends PropKeysOf<TFields, TFormValue[]>>(props: FormAutocompleteMultipleProps<TFields, TFormValue, TFieldName>) {
  const { formManager, fieldName, disabled, options, label, placeholder, reserveSpaceForValidationMessage, ...rest } = props;

  const { effectiveReserveSpaceForValidationMessage } = useMuiFormUtils(reserveSpaceForValidationMessage);

  const editor = getEditor<TFields, TFormValue[]>(formManager, fieldName, disabled);

  const optionValues = useMemo(() => options.map(x => x.value), [options]);

  return (
    <Autocomplete
      value={editor.value ?? []}
      getOptionLabel={optionValue => single(options, x => x.value === optionValue).label}
      options={optionValues}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          helperText={editor.errorMessage ?? (effectiveReserveSpaceForValidationMessage ? " " : undefined)}
          placeholder={placeholder}
          inputProps={{
            ...params.inputProps,
            autoComplete: "new-password" // disable autocomplete and autofill
          }}
          disabled={editor.isDisabled}
          error={hasValue(editor.errorMessage)}
          required={editor.isRequired}
        />
      )}
      renderOption={(rp, option) => (
        <Box component="li" {...rp}>
          {single(options, x => x.value === option).label}
        </Box>
      )}
      disabled={editor.isDisabled}
      multiple
      onChange={(_, v, reason) => {
        switch (reason) {
          case "clear":
            editor.setFieldValue(null);
            break;
          case "selectOption":
            editor.setFieldValue(v);
            break;
          case "removeOption":
            editor.setFieldValue(v);
            break;
        }
      }}
      {...rest}
    />
  );
};
