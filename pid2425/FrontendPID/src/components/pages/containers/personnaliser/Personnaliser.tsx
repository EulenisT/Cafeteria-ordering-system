import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGarniture } from "../../../../api/garnitureApi";
import { getSauces } from "../../../../api/saucesApi";
import { GarnitureResponse, SaucesResponse } from "../../../../types";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Divider,
  IconButton,
  Box,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch } from "react-redux";
import { addPersonalizedSandwich } from "../../../../store/expense/expense-slice";
import { SnackbarCloseReason } from "@mui/material";
import AddSandwichNotification from "../../panier/snackbar_creerSandwich/AddSandwichNotification.tsx";

export default function Personnaliser() {
  const [selectedGarnitures, setSelectedGarnitures] = useState<string[]>([]);
  const [selectedSauces, setSelectedSauces] = useState<string[]>([]);
  const [hoveredGarnitureIndex, setHoveredGarnitureIndex] = useState<
    number | null
  >(null);
  const [hoveredSauceIndex, setHoveredSauceIndex] = useState<number | null>(
    null,
  );
  const [notificationOpen, setNotificationOpen] = useState<boolean>(false);

  const { data: garnitureData, isLoading: garnitureLoading } = useQuery({
    queryKey: ["garniture"],
    queryFn: getGarniture,
  });

  const { data: saucesData, isLoading: saucesLoading } = useQuery({
    queryKey: ["sauces"],
    queryFn: getSauces,
  });

  if (garnitureLoading || saucesLoading) {
    return (
      <Typography variant="h6" gutterBottom sx={{ textAlign: "center" }}>
        Loading garniture or sauces...
      </Typography>
    );
  }

  const dispatch = useDispatch();

  // seleccionar/deseleccionar una garniture
  const handleAddClickGarniture = (garniture: GarnitureResponse) => {
    setSelectedGarnitures((prevSelected) =>
      prevSelected.includes(garniture.nom)
        ? prevSelected.filter((name) => name !== garniture.nom)
        : [...prevSelected, garniture.nom],
    );
  };

  // seleccionar/deseleccionar una sauce
  const handleAddClickSauces = (sauces: SaucesResponse) => {
    setSelectedSauces((prevSelected) =>
      prevSelected.includes(sauces.nom)
        ? prevSelected.filter((name) => name !== sauces.nom)
        : [...prevSelected, sauces.nom],
    );
  };

  // Precio del pan (esto pienso puedes eliminarlo, porque ya esta en panier)
  const panPrice = 1.0;

  // Función que agrupa los ingredientes en un objeto sandwich y lo envía al panier
  const handleAddSandwich = () => {
    const sandwich = {
      sandwichName: "Pan1", // Esto tienes que editarlo o eliminarlo
      sandwichPrice: panPrice,
      garnitures: selectedGarnitures,
      sauces: selectedSauces,
    };

    // Despachamos la acción para agregar el sandwich personalizado
    dispatch(addPersonalizedSandwich(sandwich));

    // Limpiamos las selecciones después de enviar el sandwich
    setSelectedGarnitures([]);
    setSelectedSauces([]);

    // Activa la notificación
    setNotificationOpen(true);
  };

  const handleNotificationClose = (
    _event: React.SyntheticEvent | Event,
    reason: SnackbarCloseReason,
  ): void => {
    if (reason === "clickaway") return;
    setNotificationOpen(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {/* Garnitures */}
      <Typography
        variant="subtitle1"
        sx={{
          mb: 1,
          fontFamily: "cursive",
          fontWeight: "bold",
        }}
      >
        Garnitures:
      </Typography>
      <Box sx={{ paddingBottom: "25px" }}>
        <List>
          {garnitureData?.map(
            (itemGarniture: GarnitureResponse, index: number) => (
              <React.Fragment key={itemGarniture.nom}>
                <ListItem
                  alignItems="flex-start"
                  style={{
                    position: "relative",
                    backgroundColor: selectedGarnitures.includes(
                      itemGarniture.nom,
                    )
                      ? "#F2D4D6"
                      : hoveredGarnitureIndex === index &&
                          itemGarniture.disponible
                        ? "#f9e1e6"
                        : "transparent",
                    transition: "background-color 0.3s ease",
                    cursor: itemGarniture.disponible ? "pointer" : "default",
                  }}
                  onMouseEnter={() =>
                    itemGarniture.disponible && setHoveredGarnitureIndex(index)
                  }
                  onMouseLeave={() =>
                    itemGarniture.disponible && setHoveredGarnitureIndex(null)
                  }
                  onClick={() =>
                    itemGarniture.disponible &&
                    handleAddClickGarniture(itemGarniture)
                  }
                >
                  <ListItemAvatar>
                    <Avatar
                      alt={itemGarniture.nom}
                      src="https://via.placeholder.com/40"
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="h6" component="span">
                        {itemGarniture.nom} - ${itemGarniture.prix.toFixed(2)}
                      </Typography>
                    }
                    secondary={`Disponibilidad: ${itemGarniture.disponible ? "Disponible" : "Non disponible"}`}
                  />
                  <IconButton
                    onClick={() =>
                      itemGarniture.disponible &&
                      handleAddClickGarniture(itemGarniture)
                    }
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      backgroundColor: "#fff",
                      "&:hover": {
                        backgroundColor: "#f0f0f0",
                      },
                    }}
                    disabled={!itemGarniture.disponible}
                  >
                    <AddIcon />
                  </IconButton>
                </ListItem>
                {index < garnitureData.length - 1 && <Divider />}
              </React.Fragment>
            ),
          )}
        </List>
      </Box>

      {/* Sauces */}
      <Typography
        variant="subtitle1"
        sx={{
          mb: 1,
          fontFamily: "cursive",
          fontWeight: "bold",
        }}
      >
        Sauces:
      </Typography>
      <Box sx={{ paddingBottom: "100px" }}>
        <List>
          {saucesData?.map((itemSauces: SaucesResponse, index: number) => (
            <React.Fragment key={itemSauces.nom}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  position: "relative",
                  backgroundColor: selectedSauces.includes(itemSauces.nom)
                    ? "#F2D4D6"
                    : hoveredSauceIndex === index && itemSauces.disponible
                      ? "#f9e1e6"
                      : "transparent",
                  transition: "background-color 0.3s ease",
                  cursor: itemSauces.disponible ? "pointer" : "default",
                }}
                onMouseEnter={() =>
                  itemSauces.disponible && setHoveredSauceIndex(index)
                }
                onMouseLeave={() =>
                  itemSauces.disponible && setHoveredSauceIndex(null)
                }
                onClick={() =>
                  itemSauces.disponible && handleAddClickSauces(itemSauces)
                }
              >
                <ListItemAvatar>
                  <Avatar
                    alt={itemSauces.nom}
                    src="https://via.placeholder.com/40"
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="h6" component="span">
                      {itemSauces.nom} - ${itemSauces.prix.toFixed(2)}
                    </Typography>
                  }
                  secondary={`Disponibilidad: ${itemSauces.disponible ? "Disponible" : "Non disponible"}`}
                />
                <IconButton
                  onClick={() =>
                    itemSauces.disponible && handleAddClickSauces(itemSauces)
                  }
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    backgroundColor: "#fff",
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                  disabled={!itemSauces.disponible}
                >
                  <AddIcon />
                </IconButton>
              </ListItem>
              {index < saucesData.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
        <Button
          variant="outlined"
          sx={{
            mt: 1,
            color: "grey",
            borderColor: "#E1B0AC",
            "&:hover": {
              backgroundColor: "#F2D4D6",
              borderColor: "#E1B0AC",
            },
            "&:active": {
              backgroundColor: "#F2D4D6",
            },
            "&.Mui-focusVisible": {
              backgroundColor: "#F2D4D6",
            },
          }}
          onClick={handleAddSandwich}
        >
          Ajouter sandwich au panier
        </Button>
      </Box>

      {/* Notificación */}
      <AddSandwichNotification
        open={notificationOpen}
        onClose={handleNotificationClose}
      />
    </Box>
  );
}
