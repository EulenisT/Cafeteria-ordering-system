import React from "react";
import { Snackbar, Alert, SnackbarCloseReason } from "@mui/material";

interface MySingleSauceNotificationProps {
  open: boolean;
  onClose: (
    event: React.SyntheticEvent<any, Event> | Event,
    reason: SnackbarCloseReason,
  ) => void;
}

const MaxSandwichNotification: React.FC<MySingleSauceNotificationProps> = ({
  open,
  onClose,
}) => {
  const handleAlertClose = (event: React.SyntheticEvent<Element, Event>) => {
    onClose(event, "timeout");
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={handleAlertClose}
        severity="warning"
        sx={{ width: "100%" }}
      >
        On ne peut demander qu’un maximum de cinq sandwichs
      </Alert>
    </Snackbar>
  );
};

export default MaxSandwichNotification;
