import { getEditor } from "@ilbrando/simple-form";
import { OmitSafe, PropKeysOf } from "@ilbrando/utils";
import { Switch, SwitchProps, Typography } from "@mui/joy";
import { FormControlWrapper } from "src/components";

import { FormFieldBaseProps } from "../types";

type FormValue = boolean;

export type FormSwitchProps<TFields, TFieldName extends PropKeysOf<TFields, FormValue>> = OmitSafe<SwitchProps, "checked" | "required" | "onChange"> &
  FormFieldBaseProps<TFields, FormValue, TFieldName> & {
    label?: string;
    labelPlacement?: "start" | "end";
  };

export const FormSwitch = function <TFields, TFieldName extends PropKeysOf<TFields, FormValue>>(props: FormSwitchProps<TFields, TFieldName>) {
  const { formManager, fieldName, disabled, label, labelPlacement = "end", size, reserveSpaceForValidationMessage, sxFormControl, sx, ...rest } = props;

  const editor = getEditor<TFields, FormValue>(formManager, fieldName, disabled);

  const Editor = (
    <Switch checked={editor.value ?? false} sx={{ ...sx, ml: labelPlacement === "start" ? 1 : undefined, mr: labelPlacement === "end" ? 1 : undefined }} onChange={e => editor.setFieldValue(e.target.checked)} {...rest} />
  );

  return (
    <FormControlWrapper
      errorMessage={editor.errorMessage}
      reserveSpaceForValidationMessage={reserveSpaceForValidationMessage}
      size={size}
      sxFormControl={sxFormControl}
      isDisabled={editor.isDisabled}
      isRequired={editor.isRequired}
    >
      <Typography component="label" endDecorator={labelPlacement === "start" && Editor} startDecorator={labelPlacement === "end" && Editor}>
        {label}
      </Typography>
    </FormControlWrapper>
  );
};
