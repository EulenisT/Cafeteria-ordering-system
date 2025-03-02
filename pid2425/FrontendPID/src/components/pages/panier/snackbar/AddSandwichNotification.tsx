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

interface SandwichNotificationProps {
  open: boolean;
  onClose: (
    event: React.SyntheticEvent | Event,
    reason: SnackbarCloseReason,
  ) => void;
}

const AddSandwichNotification: React.FC<SandwichNotificationProps> = ({
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
      message="Sandwich ajouté au panier"
      sx={{
        "& .MuiSnackbarContent-root": {
          backgroundColor: "grey",
          color: "#fff",
        },
      }}
    />
  );
};

export default AddSandwichNotification;
