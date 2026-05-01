import { DeepPartial, OmitSafe } from "@ilbrando/utils";

import { TestWrapper } from "../../../test-components/test-wrapper";
import { TestFormFields, useTestForm, UseTestFormOptions } from "../../../test-components/use-test-form";
import { FormNumber, FormNumberProps } from "../form-number";

type FormNumberTestComponentProps = Partial<Pick<ReturnType<typeof useTestForm>["fm"], "onChange">> & {
  formOptions?: DeepPartial<UseTestFormOptions>;
  isSubmitting?: boolean;
  formNumberProps?: OmitSafe<FormNumberProps<TestFormFields, "numberField">, "formManager" | "fieldName">;
};

export const FormNumberTestComponent = (props: FormNumberTestComponentProps) => {
  const { onChange, formOptions, isSubmitting, formNumberProps } = props;

  const { fm } = useTestForm(formOptions, isSubmitting);

  Object.assign(fm.onChange, onChange);

  return (
    <TestWrapper>
      <FormNumber formManager={fm} fieldName="numberField" {...formNumberProps} />
    </TestWrapper>
  );
};
