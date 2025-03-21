import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
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
import {
  CommandeResponse,
  SessionResponse,
  UserResponse,
} from "../../../../types";
import { getCommandes, deleteCommande } from "../../../../api/commandeApi";
import { getUserInfo } from "../../../../api/userApi";
import {
  addPersonalizedSandwich,
  setBalanceUser,
} from "../../../../store/expense/expense-slice";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../../loadingSpinner/LoadingSpinner.tsx";
import { getSessions } from "../../../../api/sessionApi.ts";

export function Historique() {
  const [commandes, setCommandes] = useState<CommandeResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCommandes, setSelectedCommandes] = useState<number[]>([]);
  const dispatch = useDispatch();

  // Informations de l'utilisateur
  const { data: userInfo, isLoading: userLoading } = useQuery<UserResponse>({
    queryKey: ["userInfo"],
    queryFn: getUserInfo,
  });

  // Informations de session
  const { data: sessions } = useQuery<SessionResponse[]>({
    queryKey: ["sessions"],
    queryFn: getSessions,
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
    return <LoadingSpinner />;
  }
  if (error) {
    return (
      <Typography color="error">Erreur lors du chargement : {error}</Typography>
    );
  }

  const currentUser = userInfo?.username;
  const userCommandes = commandes.filter((c) => c.username === currentUser);

  if (userCommandes.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "30vh",
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: "grey.500", textAlign: "center" }}
        >
          Aucune historique n'a été trouvée pour l'utilisateur
        </Typography>
      </Box>
    );
  }

  const sortedCommandes = [...userCommandes].sort((a, b) => {
    const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
    return dateDiff === 0 ? b.num - a.num : dateDiff;
  });
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

  // Annuler une commande
  const handleDelete = async (commandeNum: number) => {
    try {
      await deleteCommande(commandeNum);
      setCommandes((prev) => prev.filter((c) => c.num !== commandeNum));
      const userData = await getUserInfo();
      dispatch(setBalanceUser(userData.solde));
    } catch (error) {
      console.error("Erreur lors de la suppression de la commande:", error);
    }
  };

  return (
    <Box sx={{ marginBottom: "100px" }}>
      <Container sx={{ marginTop: 6 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            color: "#E1B0AC",
            fontWeight: "bold",
            fontFamily: "cursive",
            fontSize: "1.4rem",
            textAlign: "center",
          }}
        >
          Historique des dernières commandes
        </Typography>
        {lastThree.map((commande) => {
          console.log("Commande:", commande);

          const totalPrice = commande.lignes.reduce(
            (acc, ligne) => acc + ligne.prix,
            0,
          );
          const isSelected = selectedCommandes.includes(commande.num);

          // Session correspondant à la commande en comparant le nom
          const session = sessions?.find(
            (s) => s.nom.toUpperCase() === commande.sessionNom.toUpperCase(),
          );
          //  Vérifie si la commande est d’aujourd’hui
          const isTodayCommande =
            new Date(commande.date).toLocaleDateString() ===
            new Date().toLocaleDateString();
          // Le bouton est désactivé si la session existe et son état n’est pas "OUVERTE"
          const disabledButton = session
            ? session.etat.toUpperCase() !== "OUVERTE" || !isTodayCommande
            : false;

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
                <Typography
                  variant="subtitle1"
                  align="right"
                  sx={{
                    fontWeight: "bold",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "1.2rem",
                  }}
                >
                  Total: {totalPrice.toFixed(2)} €
                </Typography>
              </CardContent>
              <CardActions
                sx={{ justifyContent: "center", marginBottom: "10px" }}
              >
                <Button
                  variant="contained"
                  disabled={disabledButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(commande.num);
                  }}
                  sx={{
                    backgroundColor: "#E1B0AC",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#d89aa0",
                    },
                    "&.Mui-disabled": {
                      backgroundColor: "lightgray",
                      color: "white",
                    },
                  }}
                >
                  Annuler
                </Button>
              </CardActions>
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
