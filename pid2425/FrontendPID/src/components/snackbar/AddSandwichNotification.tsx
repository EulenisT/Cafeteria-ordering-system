import React from "react";
import {
  Snackbar,
  Slide,
  SlideProps,
  SnackbarCloseReason,
} from "@mui/material";

// Transition personnalisée pour le Snackbar avec un effet de glissement vers le haut
const SlideTransition = (props: SlideProps) => {
  return <Slide {...props} direction="up" />;
};

// Interface définissant les propriétés attendues par le composant
interface SandwichNotificationProps {
  open: boolean;
  onClose: (
    event: React.SyntheticEvent | Event,
    reason: SnackbarCloseReason,
  ) => void;
}

// Composant de notification pour indiquer qu'un sandwich a été ajouté au panier
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
