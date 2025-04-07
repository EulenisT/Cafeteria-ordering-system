import React from "react";
import {
  Snackbar,
  Slide,
  SlideProps,
  SnackbarCloseReason,
} from "@mui/material";

// Composant de transition pour le Snackbar, qui utilise une animation "slide" vers le haut
const SlideTransition = (props: SlideProps) => {
  return <Slide {...props} direction="up" />;
};

interface PaymentErrorProps {
  open: boolean;
  onClose: (
    event: React.SyntheticEvent | Event,
    reason: SnackbarCloseReason,
  ) => void;
}

// Composant qui affiche un Snackbar d'erreur pour les paiements
const PaymentErrorSnackbar: React.FC<PaymentErrorProps> = ({
  open,
  onClose,
}) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      open={open}
      onClose={onClose}
      autoHideDuration={3000}
      TransitionComponent={SlideTransition}
      message="Solde insuffisant pour payer"
      sx={{
        "& .MuiSnackbarContent-root": {
          backgroundColor: "#D32F2F",
          color: "#fff",
        },
      }}
    />
  );
};

export default PaymentErrorSnackbar;
