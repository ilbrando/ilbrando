import { Box, Stack, Typography } from "@mui/joy";
import { ReactNode } from "react";

export type GroupBoxProps = {
  children: ReactNode;
  title?: string;
  footer?: string;
  fullHeight?: boolean;
};

export const GroupBox = (props: GroupBoxProps) => {
  const { title, footer, children, fullHeight = false } = props;

  return (
    <Box bgcolor={t => t.palette.neutral["100"]} borderRadius={theme => `${theme.radius}px`} height={fullHeight ? 1 : undefined} p={1}>
      <Stack gap={0}>
        {title && <Typography level="title-md">{title}</Typography>}
        <Stack>{children}</Stack>
        {footer && (
          <Typography fontStyle="italic" textColor="info.main">
            {footer}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};
