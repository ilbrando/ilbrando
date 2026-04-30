import { Box, DialogActions } from "@mui/joy";

import { CancelButton, OkButton } from "./buttons";

export type DialogActionsOkCancelProps = {
  disabled: boolean;
  submitDisabled?: boolean;
  onSubmit: () => void;
  onCancel: () => void;
};

export const DialogActionsOkCancel = (props: DialogActionsOkCancelProps) => {
  const { disabled, submitDisabled = false, onSubmit, onCancel } = props;

  return (
    <DialogActions>
      <Box display="grid" gap={2} gridTemplateColumns="1fr 1fr">
        <OkButton disabled={disabled || submitDisabled} onClick={onSubmit} />
        <CancelButton disabled={disabled} onClick={onCancel} />
      </Box>
    </DialogActions>
  );
};
