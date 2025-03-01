import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGarniture } from "../../../api/garnitureApi.ts";
import { getSauces } from "../../../api/saucesApi.ts";
import { GarnitureResponse, SaucesResponse } from "../../../types.ts";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch } from "react-redux";
import {
  addGarniture,
  addSauces,
} from "../../../store/expense/expense-slice.ts";

export default function Personnaliser() {
  const [hoveredGarnitureIndex, setHoveredGarnitureIndex] = useState<
    number | null
  >(null);
  const [hoveredSauceIndex, setHoveredSauceIndex] = useState<number | null>(
    null,
  );

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

  //aca REDUX
  const dispatch = useDispatch();
  // Función que se ejecuta cuando se hace click en el icono o en la carta
  const handleAddClickGarniture = (garniture: GarnitureResponse) => {
    const garnitureName = garniture.nom;
    const garniturePrice = garniture.prix;
    dispatch(addGarniture({ garnitureName, garniturePrice }));
  };
  // Función que se ejecuta cuando se hace click en el icono o en la carta
  const handleAddClickSauces = (sauces: SaucesResponse) => {
    const saucesName = sauces.nom;
    const saucesPrice = sauces.prix;
    dispatch(addSauces({ saucesName, saucesPrice }));
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
                    backgroundColor:
                      hoveredGarnitureIndex === index &&
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
                  onClick={() => handleAddClickGarniture(itemGarniture)}
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
                    secondary={`Disponibilité : ${itemGarniture.disponible ? "Disponible" : "Non disponible"}`}
                  />
                  <IconButton
                    onClick={() => handleAddClickGarniture(itemGarniture)}
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
      <Box sx={{ paddingBottom: "70px" }}>
        <List>
          {saucesData?.map((itemSauces: SaucesResponse, index: number) => (
            <React.Fragment key={itemSauces.nom}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  position: "relative",
                  backgroundColor:
                    hoveredSauceIndex === index && itemSauces.disponible
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
                onClick={() => handleAddClickSauces(itemSauces)}
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
                  secondary={`Disponibilité: ${itemSauces.disponible ? "Disponible" : "Non disponible"}`}
                />
                <IconButton
                  onClick={() => handleAddClickSauces(itemSauces)}
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
      </Box>
    </Box>
  );
}
