import React from "react";
import { Snackbar, Alert, SnackbarCloseReason } from "@mui/material";

// Interface définissant les propriétés attendues pour le composant
interface MySingleSauceNotificationProps {
  open: boolean; // Indique si le Snackbar est ouvert ou non
  onClose: (
    event: React.SyntheticEvent<any, Event> | Event,
    reason: SnackbarCloseReason,
  ) => void; // Fonction appelée pour fermer le Snackbar
}

// Composant de notification pour signaler qu'un maximum de sandwichs est atteint
const MaxSandwichNotification: React.FC<MySingleSauceNotificationProps> = ({
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
        On ne peut demander qu’un maximum de cinq sandwichs
      </Alert>
    </Snackbar>
  );
};

export default MaxSandwichNotification;
