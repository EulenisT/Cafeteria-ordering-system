import React from "react";
import {
  Snackbar,
  Slide,
  SlideProps,
  SnackbarCloseReason,
} from "@mui/material";

const SlideTransition = (props: SlideProps) => {
  return <Slide {...props} direction="up" />;
};

interface PaymentSuccessProps {
  open: boolean;
  onClose: (
    event: React.SyntheticEvent | Event,
    reason: SnackbarCloseReason,
  ) => void;
}

const PaymentSuccessSnackbar: React.FC<PaymentSuccessProps> = ({
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
      message="Paiement réussi !"
      sx={{
        "& .MuiSnackbarContent-root": {
          backgroundColor: "#4CAF50",
          color: "#fff",
        },
      }}
    />
  );
};

export default PaymentSuccessSnackbar;
