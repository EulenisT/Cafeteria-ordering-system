import { useQuery } from "@tanstack/react-query";
import { getGarniture } from "../../../api/garnitureApi.ts";
import { getSauces } from "../../../api/saucesApi.ts";
import { GarnitureResponse, SaucesResponse } from "../../../types.ts";
import {
  Grid,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useState } from "react";

export default function Personnaliser() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

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
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ minHeight: "50vh" }}
      >
        <CircularProgress sx={{ color: "#FFB6C1" }} />
      </Grid>
    );
  }

  const handleToggle = (nom: string) => {
    setSelectedItems((prev) =>
      prev.includes(nom) ? prev.filter((item) => item !== nom) : [...prev, nom],
    );
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontFamily: "cursive",
          fontWeight: "bold",
        }}
      >
        Sélectionnez vos ingrédients et sauces
      </Typography>

      {/* Garnitures */}
      <Typography
        variant="subtitle1"
        sx={{
          mb: 1,
          fontFamily: "cursive",
          fontWeight: "bold",
        }}
      >
        🥗 Garnitures:
      </Typography>
      <Grid container spacing={1}>
        {garnitureData?.map((item: GarnitureResponse) => (
          <Grid item key={item.nom}>
            <Button
              variant={
                selectedItems.includes(item.nom) ? "contained" : "outlined"
              }
              sx={{
                backgroundColor: selectedItems.includes(item.nom)
                  ? "#7D7D7D"
                  : "transparent",
                color: selectedItems.includes(item.nom) ? "white" : "#7D7D7D",
                borderColor: selectedItems.includes(item.nom)
                  ? "#7D7D7D"
                  : "#7D7D7D",
                fontFamily: "cursive",
              }}
              onClick={() => handleToggle(item.nom)}
              disabled={!item.disponible}
            >
              {item.nom}
            </Button>
          </Grid>
        ))}
      </Grid>

      {/* Separador */}
      <Divider sx={{ my: 2 }} />

      {/* Sauces */}
      <Typography
        variant="subtitle1"
        sx={{
          mb: 1,
          fontFamily: "cursive",
          fontWeight: "bold",
        }}
      >
        🥫 Sauces:
      </Typography>
      <Grid container spacing={1}>
        {saucesData?.map((item: SaucesResponse) => (
          <Grid item key={item.nom}>
            <Button
              variant={
                selectedItems.includes(item.nom) ? "contained" : "outlined"
              }
              sx={{
                backgroundColor: selectedItems.includes(item.nom)
                  ? "#7D7D7D"
                  : "transparent",
                color: selectedItems.includes(item.nom) ? "white" : "#7D7D7D",
                borderColor: selectedItems.includes(item.nom)
                  ? "#7D7D7D"
                  : "#7D7D7D",
                fontFamily: "cursive",
              }}
              onClick={() => handleToggle(item.nom)}
              disabled={!item.disponible}
            >
              {item.nom}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
