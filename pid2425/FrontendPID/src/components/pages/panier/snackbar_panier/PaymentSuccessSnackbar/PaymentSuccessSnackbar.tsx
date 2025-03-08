//Y este componente no se usa asi que puedes eliminarlo si quieres

import React from "react";
import {
  Snackbar,
  Slide,
  SlideProps,
  SnackbarCloseReason,
} from "@mui/material";

const SlideTransition = (props: SlideProps) => (
  <Slide {...props} direction="up" />
);

interface PaymentSuccessProps {
  open: boolean;
  message: string;
  onClose: (
    event: React.SyntheticEvent | Event,
    reason: SnackbarCloseReason,
  ) => void;
}

const PaymentSuccessSnackbar: React.FC<PaymentSuccessProps> = ({
  open,
  message,
  onClose,
}) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      open={open}
      onClose={onClose}
      autoHideDuration={3000}
      TransitionComponent={SlideTransition}
      message={message}
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
