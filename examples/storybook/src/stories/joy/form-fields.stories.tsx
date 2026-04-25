import type { Meta, StoryObj } from "@storybook/react";
import { useFormDefinition, getFormManager, useValidationRules } from "@ilbrando/simple-form";
import {
  AutocompleteOption,
  FormAutocomplete,
  FormAutocompleteMultiple,
  FormCheckbox,
  FormNumber,
  FormRadioGroup,
  FormRangeSlider,
  FormRangeSliderValue,
  FormSwitch,
  FormText,
  RadioGroupOption
} from "@ilbrando/simple-form-joy";
import { Box, Button, ThemeProvider, extendTheme } from "@mui/joy";

declare module "@mui/joy/styles" {
  // eslint-disable-next-line @ilbrando/prefer-type
  interface Theme {
    simpleForm?: {
      reserveSpaceForValidationMessage?: boolean;
    };
  }

  // eslint-disable-next-line @ilbrando/prefer-type
  interface CssVarsThemeOptions {
    simpleForm?: {
      reserveSpaceForValidationMessage?: boolean;
    };
  }
}

type FormFields = {
  textField: string;
  numberField: number;
  autocompleteField: string;
  autocompleteMultipleField: string[];
  radiogroupField: string;
  rangeField: FormRangeSliderValue;
  switchField: boolean;
  checkboxField: boolean;
};

const optionValues = new Array(10).fill(0).map((_, index) => ({
  value: index.toString(),
  label: `Option number ${index}`
}));

const autocompleteOptions: AutocompleteOption<string>[] = optionValues;

const radioGroupOptions: RadioGroupOption<string>[] = optionValues;

type FormStoryProps = {
  isDisabled: boolean;
  isRequired: boolean;
  isReadOnly: boolean;
  size: "sm" | "md" | "lg";
  reserveSpaceForValidationMessage: boolean;
};

const FormStory = (props: FormStoryProps) => {
  const { isDisabled, isRequired, isReadOnly, size, reserveSpaceForValidationMessage } = props;

  const { required, minCount, equal } = useValidationRules();

  const fd = useFormDefinition<FormFields>({
    fields: {
      textField: {
        validators: isRequired ? [required()] : [],
        initialIsDisabled: isDisabled,
        initialValue: "abc"
      },
      numberField: {
        validators: isRequired ? [required()] : [],
        initialIsDisabled: isDisabled,
        initialValue: 123
      },
      autocompleteField: {
        validators: isRequired ? [required()] : [],
        initialIsDisabled: isDisabled
      },
      autocompleteMultipleField: {
        validators: isRequired ? [required(), minCount(1)] : [],
        initialIsDisabled: isDisabled
      },
      radiogroupField: {
        validators: isRequired ? [required()] : [],
        initialIsDisabled: isDisabled
      },
      rangeField: {
        validators: isRequired ? [required()] : [],
        initialIsDisabled: isDisabled
      },
      switchField: {
        validators: isRequired ? [required(), equal(true)] : [],
        initialIsDisabled: isDisabled
      },
      checkboxField: {
        validators: isRequired ? [required("You must check this box."), equal(true, "You must check this box.")] : [],
        initialIsDisabled: isDisabled
      }
    },
    reCreateDependencies: [isDisabled, isRequired]
  });

  const fm = getFormManager(fd, false);

  const handleSubmit = () => {
    if (fm.validateForm()) {
      // perform submit action
    }
  };

  const theme = extendTheme({
    simpleForm: {
      reserveSpaceForValidationMessage
    },
    // If you think form component takes up too much space then with reserveSpaceForValidationMessage you can decrease
    // the margin between the helper text (error message) and the input.
    components: reserveSpaceForValidationMessage
      ? {
          JoyFormHelperText: {
            styleOverrides: {
              root: {
                marginTop: "2px"
              }
            }
          }
        }
      : undefined
  });

  return (
    <ThemeProvider theme={theme}>
      <Box display="grid" gridTemplateColumns="400px auto" gap={2}>
        <Box gridColumn="1" display="flex" flexDirection="column" gap={reserveSpaceForValidationMessage ? 0 : 1}>
          <FormText formManager={fm} fieldName="textField" label="Text Field" readOnly={isReadOnly} size={size} />
          <FormNumber formManager={fm} fieldName="numberField" label="Number Field" readOnly={isReadOnly} size={size} />
          <FormAutocomplete formManager={fm} fieldName="autocompleteField" label="Autocomplete Field" options={autocompleteOptions} size={size} />
          <FormAutocompleteMultiple formManager={fm} fieldName="autocompleteMultipleField" label="Autocomplete Field (multiple)" options={autocompleteOptions} size={size} />
          <FormRadioGroup formManager={fm} fieldName="radiogroupField" label="Radiogroup Field" options={radioGroupOptions} size={size} />
          <FormRangeSlider formManager={fm} fieldName="rangeField" label="Range Slider" min={1} max={10} />
          <FormSwitch formManager={fm} fieldName="switchField" label="Switch Field" size={size} />
          <FormCheckbox formManager={fm} fieldName="checkboxField" label="Checkbox Field" size={size} />
        </Box>
        <Box gridColumn="2">
          <Button onClick={handleSubmit} size={size}>
            SUBMIT
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

const meta = {
  title: "Joy/Form Fields",
  component: FormStory,
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"]
    }
  },
  args: {
    isDisabled: false,
    isRequired: false,
    isReadOnly: false,
    size: "md",
    reserveSpaceForValidationMessage: false
  }
} satisfies Meta<typeof FormStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FormFields: Story = {};
