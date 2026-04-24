import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { useFormDefinition, getFormManager, useValidationRules } from "@ilbrando/simple-form";
import { FormNumber, FormText } from "@ilbrando/simple-form-material-ui";
import { Box, Button } from "@mui/material";
import { useState } from "react";
import { MakeNullable } from "@ilbrando/utils";

type FormFields = {
  name: string;
  age: number;
};

const FormStory = ({ onSubmit }: { onSubmit?: (values: Partial<MakeNullable<FormFields>>) => void }) => {
  const { required, maxLength, min } = useValidationRules();

  const [isSubmitting, setIsSubmitting] = useState(false); // story book simulate submitting

  const fd = useFormDefinition<FormFields>({
    fields: {
      name: {
        validators: [required(), maxLength(20)]
      },
      age: {
        validators: [required(), min(3)]
      }
    }
  });

  const fm = getFormManager(fd, isSubmitting);

  const handleSubmit = async () => {
    if (fm.validateForm()) {
      onSubmit?.(fm.values);
      // simulate calling backend
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 5000));
      setIsSubmitting(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <FormText formManager={fm} fieldName="name" label="Name" />
      <FormNumber formManager={fm} fieldName="age" label="Age" />
      <Button disabled={isSubmitting} onClick={handleSubmit}>
        Submit
      </Button>
    </Box>
  );
};

const meta = {
  title: "Material UI/Validation",
  component: FormStory,
  args: {
    onSubmit: fn()
  }
} satisfies Meta<typeof FormStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Validation: Story = {};
