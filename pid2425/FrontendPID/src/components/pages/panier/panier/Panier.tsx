import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { useQuery } from "@tanstack/react-query";
import { getSauces } from "../../../../api/saucesApi.ts";
import { getGarniture } from "../../../../api/garnitureApi.ts";

export function Panier() {
  // Obtención de sandwiches preparados y personalizados desde el store
  const preparedSandwiches = useSelector(
    (store: RootState) => store.EXPENSE.expenseList,
  );
  const personalizedSandwiches = useSelector(
    (store: RootState) => store.EXPENSE.personalizedSandwiches,
  );

  // Consultas para obtener datos de ingredientes
  const { data: garnitureData } = useQuery({
    queryKey: ["garniture"],
    queryFn: getGarniture,
  });
  const { data: saucesData } = useQuery({
    queryKey: ["sauces"],
    queryFn: getSauces,
  });

  // Precio fijo del pan
  const panPrice = 1.0;

  // Función para calcular el precio real de un sandwich personalizado
  const computePersonalizedPrice = (item: {
    garnitures: string[];
    sauces: string[];
  }) => {
    let total = panPrice;
    if (garnitureData) {
      item.garnitures.forEach((garnitureName) => {
        const found = garnitureData.find((g: any) => g.nom === garnitureName);
        if (found) total += found.prix;
      });
    }
    if (saucesData) {
      item.sauces.forEach((sauceName) => {
        const found = saucesData.find((s: any) => s.nom === sauceName);
        if (found) total += found.prix;
      });
    }
    return total;
  };

  // Calcula el total de los sandwiches preparados usando el precio almacenado
  const totalPrepared = preparedSandwiches.reduce(
    (acc, item) => acc + item.price,
    0,
  );
  // Calcula el total de los sandwiches personalizados usando el precio recalculado
  const totalPersonalized = personalizedSandwiches.reduce(
    (acc, item) => acc + computePersonalizedPrice(item),
    0,
  );
  const total = totalPrepared + totalPersonalized;

  return (
    <Box
      sx={{
        width: "100%",
        mt: 4,
        px: { xs: 2, md: 4 },
        mb: "80px",
      }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}
      >
        Panier
      </Typography>
      <List>
        {/* Sandwiches preparados */}
        {preparedSandwiches.length > 0 && (
          <>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              Sandwiches preparados:
            </Typography>
            {preparedSandwiches.map((item, index) => (
              <ListItem
                key={`prep-${index}`}
                divider
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <ListItemText
                  primary={item.name || "Nombre no disponible"}
                  secondary={`${item.price.toFixed(2)} €`}
                />
              </ListItem>
            ))}
            <Divider sx={{ my: 2 }} />
          </>
        )}

        {/* Sandwiches personalizados */}
        {personalizedSandwiches.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold", mb: 1 }}>
              Sandwiches personalizados:
            </Typography>
            {personalizedSandwiches.map((item) => (
              <ListItem
                key={`pers-${item.id}`}
                divider
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  py: 2,
                }}
              >
                <ListItemText
                  primary={`ID: ${item.id} - ${item.sandwichName || "Nombre no disponible"}`}
                  secondary={
                    <>
                      <Typography variant="body2" component="span">
                        Precio base (pan): {panPrice.toFixed(2)} €
                      </Typography>
                      <br />
                      <Typography variant="body2" component="span">
                        Garnitures: {item.garnitures.join(", ")}
                      </Typography>
                      <br />
                      <Typography variant="body2" component="span">
                        Sauces: {item.sauces.join(", ")}
                      </Typography>
                      <br />
                      <Typography variant="body2" component="span">
                        Total personalizado:{" "}
                        {computePersonalizedPrice(item).toFixed(2)} €
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
            <Divider sx={{ my: 2 }} />
          </>
        )}

        {/* Mensaje cuando no hay sandwiches */}
        {preparedSandwiches.length === 0 &&
          personalizedSandwiches.length === 0 && (
            <Typography variant="body2" color="textSecondary">
              Aucun achât disponible.
            </Typography>
          )}
      </List>
      {/* Total a pagar */}
      <Box
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "flex-end",
          px: { xs: 2, md: 4 },
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Total à payer: {total.toFixed(2)} €
        </Typography>
      </Box>
    </Box>
  );
}
