import { DeepPartial, OmitSafe } from "@ilbrando/utils";

import { TestWrapper } from "../../../test-components/test-wrapper";
import { TestFormFields, useTestForm, UseTestFormOptions } from "../../../test-components/use-test-form";
import { FormAutocompleteMultiple, FormAutocompleteMultipleProps } from "../form-autocomplete-multiple";
import { options } from "./test-data";

type FormAutocompleteMultipleTestComponentProps = Partial<Pick<ReturnType<typeof useTestForm>["fm"], "onChange">> & {
  formOptions?: DeepPartial<UseTestFormOptions>;
  isSubmitting?: boolean;
  formAutocompleteProps?: OmitSafe<FormAutocompleteMultipleProps<TestFormFields, string, "stringArrayField">, "formManager" | "fieldName" | "options">;
};

export const FormAutocompleteMultipleTestComponent = (props: FormAutocompleteMultipleTestComponentProps) => {
  const { onChange, formOptions, isSubmitting, formAutocompleteProps } = props;

  const { fm } = useTestForm(formOptions, isSubmitting);

  Object.assign(fm.onChange, onChange);

  return (
    <TestWrapper>
      <FormAutocompleteMultiple formManager={fm} fieldName="stringArrayField" options={options} {...formAutocompleteProps} />
    </TestWrapper>
  );
};
