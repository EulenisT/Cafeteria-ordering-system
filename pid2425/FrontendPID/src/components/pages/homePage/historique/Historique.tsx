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
  // État pour stocker la liste des commandes
  const [commandes, setCommandes] = useState<CommandeResponse[]>([]);
  // État pour indiquer le chargement des données
  const [loading, setLoading] = useState<boolean>(true);
  // État pour stocker un message d'erreur
  const [error, setError] = useState<string | null>(null);
  // État pour stocker les numéros de commandes sélectionnées
  const [selectedCommandes, setSelectedCommandes] = useState<number[]>([]);
  const dispatch = useDispatch();

  // Récupération des informations utilisateur via React Query
  const { data: userInfo, isLoading: userLoading } = useQuery<UserResponse>({
    queryKey: ["userInfo"],
    queryFn: getUserInfo,
  });

  // Récupération des sessions via React Query
  const { data: sessions } = useQuery<SessionResponse[]>({
    queryKey: ["sessions"],
    queryFn: getSessions,
  });

  // Utilisation de useEffect pour charger l'historique des commandes au montage du composant
  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const data = await getCommandes();
        setCommandes(data);
      } catch (err) {
        setError("Erreur lors du chargement de l’historique des commandes");
      } finally {
        setLoading(false); // Fin du chargement, réussi ou non
      }
    };
    fetchCommandes();
  }, []);

  // Affiche un spinner de chargement si les données sont en cours de chargement
  if (loading || userLoading) {
    return <LoadingSpinner />;
  }
  // Affiche un message d'erreur en cas de problème
  if (error) {
    return (
      <Typography color="error">Erreur lors du chargement : {error}</Typography>
    );
  }

  // Filtre les commandes pour l'utilisateur courant
  const currentUser = userInfo?.username;
  const userCommandes = commandes.filter(
    (c) => c.user?.username === currentUser,
  );

  // Affiche un message si aucune commande n'est trouvée pour l'utilisateur
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

  // Trie les commandes par date décroissante et par numéro si les dates sont identiques
  const sortedCommandes = [...userCommandes].sort((a, b) => {
    const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
    return dateDiff === 0 ? b.num - a.num : dateDiff;
  });
  // Récupère les trois dernières commandes
  const lastThree = sortedCommandes.slice(0, 3);

  // Fonction pour sélectionner/désélectionner une commande
  // Si la commande est sélectionnée, elle la désélectionne, et si elle ne l'est pas, elle l'ajoute à la liste des éléments sélectionnés.
  const toggleSelection = (commandeNum: number) => {
    setSelectedCommandes((prevSelected) =>
      prevSelected.includes(commandeNum)
        ? prevSelected.filter((n) => n !== commandeNum)
        : [...prevSelected, commandeNum],
    );
  };

  // Ajoute les commandes sélectionnées au panier
  const handleAddSelectedToCart = () => {
    lastThree.forEach((commande) => {
      if (selectedCommandes.includes(commande.num)) {
        commande.lignes.forEach((ligne) => {
          dispatch(
            addPersonalizedSandwich({
              code: ligne.article ? ligne.article.code : ligne.nomSandwich,
              sandwichName: ligne.nomSandwich,
              sandwichPrice: ligne.prix,
              garnitures: [],
              sauces: [],
            }),
          );
        });
      }
    });
    // Réinitialise la sélection des commandes
    setSelectedCommandes([]);
  };

  // Supprime une commande et met à jour le solde utilisateur
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
          // Calcul du prix total de la commande
          const totalPrice = (commande.lignes ?? []).reduce(
            (acc, ligne) => acc + ligne.prix,
            0,
          );
          // Vérifie si la commande est sélectionnée
          const isSelected = selectedCommandes.includes(commande.num);

          // Recherche la session associée à la commande (comparaison du nom)
          const session = sessions?.find(
            (s) => s.nom.toUpperCase() === commande.sessionNom.toUpperCase(),
          );
          //  Vérifie si la commande est d’aujourd’hui
          const isTodayCommande =
            new Date(commande.date).toLocaleDateString() ===
            new Date().toLocaleDateString();
          // Désactive le bouton si la session existe et n'est pas ouverte ou si la commande n'est pas d'aujourd'hui
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
              {/* Affiche la date et la session de la commande */}
              <CardHeader
                subheader={`Fecha: ${new Date(
                  commande.date,
                ).toLocaleDateString()} - Session: ${
                  commande.sessionNom || "N/A"
                }`}
              />
              <CardContent>
                <List>
                  {/* Liste des lignes de la commande */}
                  {(commande.lignes ?? []).map((ligne) => (
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
                {/* Affiche le prix total de la commande */}
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
                {/* Bouton pour annuler (supprimer) la commande */}
                <Button
                  variant="contained"
                  disabled={disabledButton}
                  onClick={(e) => {
                    e.stopPropagation(); // Empêche la propagation pour ne pas déclencher la sélection
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
        {/* Bouton pour ajouter les commandes sélectionnées au panier */}
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
