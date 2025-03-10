import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Container,
  Box,
  Button,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { CommandeResponse } from "../../../../types";
import { getCommandes } from "../../../../api/commandeApi";
import {
  addSandwich,
  addPersonalizedSandwich,
} from "../../../../store/expense/expense-slice";

export function Historique() {
  const [commandes, setCommandes] = useState<CommandeResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCommandes, setSelectedCommandes] = useState<number[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const data = await getCommandes();
        console.log("Respuesta de la API:", data);
        setCommandes(data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar el histórico de commandes.");
      } finally {
        setLoading(false);
      }
    };

    fetchCommandes();
  }, []);

  if (loading) {
    return <Typography>Cargando histórico...</Typography>;
  }
  if (error) {
    return <Typography color="error">{error}</Typography>;
  }
  if (commandes.length === 0) {
    return <Typography>No se encontraron commandes.</Typography>;
  }

  const sortedCommandes = [...commandes].sort((a, b) => {
    const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateDiff === 0) {
      return b.num - a.num;
    }
    return dateDiff;
  });

  // Tomar solo las 3 más recientes
  const lastThree = sortedCommandes.slice(0, 3);
  console.log("Últimas 3 commandes:", lastThree);

  const toggleSelection = (commandeNum: number) => {
    setSelectedCommandes((prevSelected) =>
        prevSelected.includes(commandeNum)
            ? prevSelected.filter((n) => n !== commandeNum)
            : [...prevSelected, commandeNum]
    );
  };

  // Enviar las commandes seleccionadas al carrito
  const handleAddSelectedToCart = () => {
    lastThree.forEach((commande) => {
      if (selectedCommandes.includes(commande.num)) {
        commande.lignes.forEach((ligne) => {
          if (ligne.type === "PRÉPARÉ") {
            dispatch(
                addSandwich({
                  name: ligne.nomSandwich,
                  price: ligne.prix,
                })
            );
          } else if (ligne.type === "PERSONNALISÉ") {
            dispatch(
                addPersonalizedSandwich({
                  sandwichName: ligne.nomSandwich,
                  sandwichPrice: ligne.prix,
                  garnitures: [],
                  sauces: [],
                })
            );
          }
        });
      }
    });
    setSelectedCommandes([]);
  };

  return (
      <Box sx={{ marginBottom: "100px" }}>
        <Container sx={{ marginTop: 6 }}>
          <Typography variant="h6" gutterBottom>
            Histórico de las 3 últimas Commandes
          </Typography>
          {lastThree.map((commande) => {
            // Calcular el total de la commande
            const totalPrice = commande.lignes.reduce(
                (acc, ligne) => acc + ligne.prix,
                0
            );
            // Determinar si la commande está seleccionada
            const isSelected = selectedCommandes.includes(commande.num);

            return (
                <Card
                    key={commande.num}
                    variant="outlined"
                    onClick={() => toggleSelection(commande.num)}
                    sx={{
                      marginBottom: 2,
                      border: isSelected ? "2px solid #E1B0AC" : "1px solid #ccc",
                      cursor: "pointer",
                    }}
                >
                  <CardHeader
                      title={`Commande #${commande.num}`}
                      subheader={`Fecha: ${new Date(
                          commande.date
                      ).toLocaleDateString()} - Session: ${
                          commande.sessionNom || "N/A"
                      }`}
                  />
                  <CardContent>
                    <List>
                      {commande.lignes.map((ligne) => (
                          <ListItem key={ligne.num}>
                            <ListItemText
                                primary={
                                  <>
                                    {ligne.nomSandwich}{" "}
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        sx={{ fontWeight: "bold", color: "#E1B0AC" }}
                                    >
                                      {ligne.type}
                                    </Typography>
                                  </>
                                }
                                secondary={
                                  <>
                                    <Typography variant="body2" component="span">
                                      Descripción:{" "}
                                      {ligne.description || "Sin descripción"}
                                    </Typography>
                                    <br />
                                    <Typography variant="body2" component="span">
                                      Precio: {ligne.prix.toFixed(2)} €
                                    </Typography>
                                  </>
                                }
                            />
                          </ListItem>
                      ))}
                    </List>
                    <Divider sx={{ marginY: 1 }} />
                    <Typography variant="subtitle1" align="right">
                      Total: {totalPrice.toFixed(2)} €
                    </Typography>
                  </CardContent>
                </Card>
            );
          })}
          {/* Botón para agregar al carrito las commandes seleccionadas */}
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
                variant="contained"
                sx={{ backgroundColor: "#E1B0AC", color: "white" }}
                onClick={handleAddSelectedToCart}
                disabled={selectedCommandes.length === 0}
            >
              Agregar seleccionadas al carrito
            </Button>
          </Box>
        </Container>
      </Box>
  );
}
