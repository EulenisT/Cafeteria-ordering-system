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

interface PaymentErrorProps {
  open: boolean;
  onClose: (
    event: React.SyntheticEvent | Event,
    reason: SnackbarCloseReason,
  ) => void;
}

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
