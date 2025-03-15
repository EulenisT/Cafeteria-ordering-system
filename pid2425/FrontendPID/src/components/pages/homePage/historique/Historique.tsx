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
import { CommandeResponse, UserResponse } from "../../../../types";
import { getCommandes } from "../../../../api/commandeApi";
import { getUserInfo } from "../../../../api/userApi";
import {addPersonalizedSandwich} from "../../../../store/expense/expense-slice";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../../loadingSpinner/LoadingSpinner.tsx";

export function Historique() {
  const [commandes, setCommandes] = useState<CommandeResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCommandes, setSelectedCommandes] = useState<number[]>([]);
  const dispatch = useDispatch();

  //  Informations de l’utilisateur
  const { data: userInfo, isLoading: userLoading } = useQuery<UserResponse>({
    queryKey: ["userInfo"],
    queryFn: getUserInfo,
  });

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const data = await getCommandes();
        setCommandes(data);
      } catch (err) {
        setError("Erreur lors du chargement de l’historique des commandes");
      } finally {
        setLoading(false);
      }
    };
    fetchCommandes();
  }, []);

  if (loading || userLoading) {
    return <LoadingSpinner/>;
  }
  if (error) {
    return <Typography color="error">Erreur lors du chargement : {error}</Typography>;
  }
  if (commandes.length === 0) {
    return (
        <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "30vh",
            }}
        >
          <Typography variant="h6" sx={{ color: "grey.500", textAlign: "center" }}>
            Aucune historique n'a été trouvée pour l'utilisateur
          </Typography>
        </Box>
    );
  }

  // Filtrer les commandes
  const currentUser = userInfo?.username;
  const userCommandes = commandes.filter((c) => c.username === currentUser);

  // Trier les commandes des plus récentes aux plus anciennes
  const sortedCommandes = [...userCommandes].sort((a, b) => {
    const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
    return dateDiff === 0 ? b.num - a.num : dateDiff;
  });

  // Prendre seulement les trois dernières commandes
  const lastThree = sortedCommandes.slice(0, 3);

  const toggleSelection = (commandeNum: number) => {
    setSelectedCommandes((prevSelected) =>
        prevSelected.includes(commandeNum)
            ? prevSelected.filter((n) => n !== commandeNum)
            : [...prevSelected, commandeNum],
    );
  };

  const handleAddSelectedToCart = () => {
    lastThree.forEach((commande) => {
      if (selectedCommandes.includes(commande.num)) {
        commande.lignes.forEach((ligne) => {
          dispatch(
              addPersonalizedSandwich({
                sandwichName: ligne.nomSandwich,
                sandwichPrice: ligne.prix,
                garnitures: [],
                sauces: [],
              }),
          );
        });
      }
    });
    setSelectedCommandes([]);
  };

  return (
      <Box sx={{ marginBottom: "100px" }}>
        <Container sx={{ marginTop: 6 }}>
          <Typography variant="h6" gutterBottom>
            Historique des trois dernières commandes
          </Typography>
          {lastThree.map((commande) => {
            const totalPrice = commande.lignes.reduce(
                (acc, ligne) => acc + ligne.prix,
                0,
            );
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
                      subheader={`Fecha: ${new Date(
                          commande.date,
                      ).toLocaleDateString()} - Session: ${
                          commande.sessionNom || "N/A"
                      }`}
                  />
                  <CardContent>
                    <List>
                      {commande.lignes.map((ligne) => (
                          <ListItem key={ligne.num}>
                            <ListItemText
                                primary={ligne.nomSandwich}
                                secondary={
                                  <>
                                    <Typography variant="body2" component="span">
                                      Description:{" "}
                                      {ligne.description || "Sans description"}
                                    </Typography>
                                    <br />
                                    <Typography variant="body2" component="span">
                                      Total: {ligne.prix.toFixed(2)} €
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
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
                variant="contained"
                sx={{ backgroundColor: "#E1B0AC", color: "white" }}
                onClick={handleAddSelectedToCart}
                disabled={selectedCommandes.length === 0}
            >
              Ajouter au panier
            </Button>
          </Box>
        </Container>
      </Box>
  );
}
