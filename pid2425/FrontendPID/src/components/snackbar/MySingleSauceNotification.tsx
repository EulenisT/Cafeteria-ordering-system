import React from "react";
import { Snackbar, Alert, SnackbarCloseReason } from "@mui/material";

// Interface définissant les propriétés pour le composant
interface MySingleSauceNotificationProps {
  open: boolean; // Indique si le Snackbar est ouvert ou fermé
  onClose: (
    event: React.SyntheticEvent<any, Event> | Event,
    reason: SnackbarCloseReason,
  ) => void;
}

// Composant de notification pour signaler qu'une seule sauce peut être sélectionnée
const MySingleSauceNotification: React.FC<MySingleSauceNotificationProps> = ({
  open,
  onClose,
}) => {
  // Gère la fermeture de l'alerte en cas de timeout
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
        Une seule sauce peut être sélectionnée
      </Alert>
    </Snackbar>
  );
};

export default MySingleSauceNotification;
