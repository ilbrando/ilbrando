import { DeepPartial, OmitSafe } from "@ilbrando/utils";

import { TestWrapper } from "../../../test-components/test-wrapper";
import { TestFormFields, useTestForm, UseTestFormOptions } from "../../../test-components/use-test-form";
import { FormAutocomplete, FormAutocompleteProps } from "../form-autocomplete";
import { options } from "./test-data";

type FormAutocompleteTestComponentProps = Partial<Pick<ReturnType<typeof useTestForm>["fm"], "onChange">> & {
  formOptions?: DeepPartial<UseTestFormOptions>;
  isSubmitting?: boolean;
  formAutocompleteProps?: OmitSafe<FormAutocompleteProps<TestFormFields, string, "stringField">, "formManager" | "fieldName" | "options">;
};

export const FormAutocompleteTestComponent = (props: FormAutocompleteTestComponentProps) => {
  const { onChange, formOptions, isSubmitting, formAutocompleteProps } = props;

  const { fm } = useTestForm(formOptions, isSubmitting);

  Object.assign(fm.onChange, onChange);

  return (
    <TestWrapper>
      <FormAutocomplete formManager={fm} fieldName="stringField" options={options} {...formAutocompleteProps} />
    </TestWrapper>
  );
};
