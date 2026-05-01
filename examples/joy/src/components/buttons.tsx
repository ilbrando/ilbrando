import { hasValue, OmitSafe } from "@ilbrando/utils";
import CancelIcon from "@mui/icons-material/Cancel";
import { Button, ButtonProps } from "@mui/joy";

export const OkButton = ({ children, ...rest }: OmitSafe<ButtonProps, "color" | "variant">) => {
  return (
    <Button color="primary" {...rest}>
      {hasValue(children) ? children : "OK"}
    </Button>
  );
};

export const CancelButton = ({ children, ...rest }: OmitSafe<ButtonProps, "startDecorator">) => {
  return (
    <Button startDecorator={<CancelIcon />} variant="soft" {...rest}>
      {hasValue(children) ? children : "Cancel"}
    </Button>
  );
};
