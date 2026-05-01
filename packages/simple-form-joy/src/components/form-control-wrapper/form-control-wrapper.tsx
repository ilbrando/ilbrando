import { hasValue } from "@ilbrando/utils";
import { FormControl, FormHelperText, FormLabel } from "@mui/joy";
import { ReactNode } from "react";
import { FormFieldBaseSharedProps } from "src/form-components/types";
import { useJoyFormUtils } from "src/utils";

export type FormControlWrapperProps = FormFieldBaseSharedProps & {
  isRequired: boolean;
  isDisabled: boolean;
  errorMessage?: string;
  children: ReactNode;
};

export const FormControlWrapper = (props: FormControlWrapperProps) => {
  const { isRequired, isDisabled, size, label, errorMessage, reserveSpaceForValidationMessage, sxFormControl, children } = props;

  const { effectiveReserveSpaceForValidationMessage } = useJoyFormUtils(reserveSpaceForValidationMessage);

  const showErrorMessage = hasValue(errorMessage) || effectiveReserveSpaceForValidationMessage;

  return (
    <FormControl size={size} sx={sxFormControl} disabled={isDisabled} error={hasValue(errorMessage)} required={isRequired}>
      {hasValue(label) && <FormLabel>{label}</FormLabel>}
      {children}
      {showErrorMessage && <FormHelperText>{errorMessage ?? (effectiveReserveSpaceForValidationMessage ? <>{"\u00A0"}</> : null)}</FormHelperText>}
    </FormControl>
  );
};
