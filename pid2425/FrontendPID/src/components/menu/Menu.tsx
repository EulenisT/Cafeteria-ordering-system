import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";
import { IconButton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getSandwiches } from "../../api/sandwichsapi.ts";
import { SandwichesResponse } from "../../types.ts";

import pouletCurry from "../../assets/images/pouletCurry.png";
import boulette from "../../assets/images/boulette.png";
import fromage from "../../assets/images/fromage.png";
import jambonFromage from "../../assets/images/jambonFromage.png";

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

  if (!isSuccess) {
    return <span>Loading...</span>;
  } else if (error) {
    return <span>Erreur...</span>;
  }

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
          <Card sx={{ maxWidth: 345 }}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                image={imageMap[sandwich.nom] || pouletCurry}
                alt={sandwich.nom}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {sandwich.nom}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {sandwich.disponible ? "Disponible" : "No disponible"} -{" "}
                  {sandwich.prix}€
                </Typography>
              </CardContent>
            </CardActionArea>
            <IconButton sx={{ marginBottom: 1, marginLeft: 1, color: "black" }}>
              <AddIcon />
            </IconButton>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
