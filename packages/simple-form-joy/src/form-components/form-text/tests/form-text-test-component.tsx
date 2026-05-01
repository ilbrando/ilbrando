import { DeepPartial, OmitSafe } from "@ilbrando/utils";

import { TestWrapper } from "../../../test-components/test-wrapper";
import { TestFormFields, useTestForm, UseTestFormOptions } from "../../../test-components/use-test-form";
import { FormText, FormTextProps } from "../form-text";

type FormTextTestComponentProps = Partial<Pick<ReturnType<typeof useTestForm>["fm"], "onChange">> & {
  formOptions?: DeepPartial<UseTestFormOptions>;
  isSubmitting?: boolean;
  formTextProps?: OmitSafe<FormTextProps<TestFormFields, "stringField">, "formManager" | "fieldName">;
};

export const FormTextTestComponent = (props: FormTextTestComponentProps) => {
  const { onChange, formOptions, isSubmitting, formTextProps } = props;

  const { fm } = useTestForm(formOptions, isSubmitting);

  Object.assign(fm.onChange, onChange);

  return (
    <TestWrapper>
      <FormText formManager={fm} fieldName="stringField" {...formTextProps} />
    </TestWrapper>
  );
};
