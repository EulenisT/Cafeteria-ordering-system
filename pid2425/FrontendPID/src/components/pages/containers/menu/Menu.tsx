import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";
import { IconButton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getSandwiches } from "../../../../api/sandwichsApi.ts";
import { SandwichesResponse } from "../../../../types.ts";

import pouletCurry from "../../../../assets/images/pouletCurry.png";
import boulette from "../../../../assets/images/boulette.png";
import fromage from "../../../../assets/images/fromage.png";
import jambonFromage from "../../../../assets/images/jambonFromage.png";
import CircularProgress from "@mui/material/CircularProgress";
import {
  addSandwich,
  removeSandwich,
} from "../../../../store/expense/expense-slice.ts";
import { useDispatch } from "react-redux";
import { useState } from "react";

const imageMap: { [key: string]: string } = {
  "Poulet Curry": pouletCurry,
  Boulette: boulette,
  Fromage: fromage,
  "Jambon Fromage": jambonFromage,
};

export default function Menu() {
  const { data, error, isSuccess } = useQuery({
    queryKey: ["sandwichs"],
    queryFn: getSandwiches,
  });

  // Estado para el sandwich seleccionado
  const [selectedSandwiches, setSelectedSandwiches] = useState<string[]>([]);

  if (!isSuccess) {
    return (
      <Grid
        container
        spacing={4}
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: "50vh" }}
      >
        <Grid item>
          <CircularProgress sx={{ color: "#FFB6C1" }} />
        </Grid>
      </Grid>
    );
  } else if (error) {
    return <span>Erreur...</span>;
  }

  //aca REDUX
  const dispatch = useDispatch();

  const handleAddClick = (sandwich: SandwichesResponse) => {
    if (selectedSandwiches.includes(sandwich.code)) {
      dispatch(removeSandwich({ name: sandwich.nom, price: sandwich.prix }));
    } else {
      dispatch(addSandwich({ name: sandwich.nom, price: sandwich.prix }));
    }
    setSelectedSandwiches((prevSelected) =>
      prevSelected.includes(sandwich.code)
        ? prevSelected.filter((code) => code !== sandwich.code)
        : [...prevSelected, sandwich.code],
    );
  };

  return (
    <Grid container spacing={4} justifyContent="center" alignItems="center">
      {data?.map((sandwich: SandwichesResponse) => (
        <Grid
          key={sandwich.code}
          item
          xs={12}
          sm={6}
          md={3}
          display="flex"
          justifyContent="center"
        >
          <Card
            sx={{
              maxWidth: 345,
              border: selectedSandwiches.includes(sandwich.code)
                ? "2px solid #E1B0AC"
                : "none",
              backgroundColor: selectedSandwiches.includes(sandwich.code)
                ? " #F2D4D6"
                : "transparent",
            }}
          >
            {/* CardActionArea para permitir hacer clic en la carta */}
            <CardActionArea onClick={() => handleAddClick(sandwich)}>
              <CardMedia
                component="img"
                height="140"
                image={imageMap[sandwich.nom] || pouletCurry}
                alt={sandwich.nom}
              />
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  sx={{ fontFamily: "cursive" }}
                >
                  {sandwich.nom}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontFamily: "cursive" }}
                >
                  {sandwich.disponible ? "Disponible" : "No disponible"} -{" "}
                  {sandwich.prix}€
                </Typography>
              </CardContent>
            </CardActionArea>
            <IconButton
              sx={{ marginBottom: 1, marginLeft: 1, color: "black" }}
              onClick={() => handleAddClick(sandwich)}
            >
              <AddIcon />
            </IconButton>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
