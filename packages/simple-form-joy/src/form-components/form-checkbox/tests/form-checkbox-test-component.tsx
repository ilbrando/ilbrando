import { DeepPartial, OmitSafe } from "@ilbrando/utils";

import { TestWrapper } from "../../../test-components/test-wrapper";
import { TestFormFields, useTestForm, UseTestFormOptions } from "../../../test-components/use-test-form";
import { FormCheckbox, FormCheckboxProps } from "../form-checkbox";

type FormCheckboxTestComponentProps = Partial<Pick<ReturnType<typeof useTestForm>["fm"], "onChange">> & {
  formOptions?: DeepPartial<UseTestFormOptions>;
  isSubmitting?: boolean;
  formCheckboxProps?: OmitSafe<FormCheckboxProps<TestFormFields, "booleanField">, "formManager" | "fieldName">;
};

export const FormCheckboxTestComponent = (props: FormCheckboxTestComponentProps) => {
  const { onChange, formOptions, isSubmitting, formCheckboxProps } = props;

  const { fm } = useTestForm(formOptions, isSubmitting);

  Object.assign(fm.onChange, onChange);

  return (
    <TestWrapper>
      <FormCheckbox formManager={fm} fieldName="booleanField" {...formCheckboxProps} />
    </TestWrapper>
  );
};
