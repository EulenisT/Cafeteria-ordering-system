import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSandwiches } from "../../../api/sandwichsApi.ts";
import { getGarniture } from "../../../api/garnitureApi.ts";
import { getSauces } from "../../../api/saucesApi.ts";
import {
  SandwichesResponse,
  GarnitureResponse,
  SaucesResponse,
} from "../../../types.ts";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { addPersonalizedSandwich } from "../../../store/expense/expense-slice.ts";

import {
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  Checkbox,
  ListItemText,
  ListItemButton,
} from "@mui/material";

import pouletCurry from "../../../assets/images/pouletCurry.png";
import boulette from "../../../assets/images/boulette.png";
import fromage from "../../../assets/images/fromage.png";
import jambonFromage from "../../../assets/images/jambonFromage.png";
import AddSandwichNotification from "../../snackbar/AddSandwichNotification.tsx";
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner.tsx";
import MySingleSauceNotification from "../../snackbar/MySingleSauceNotification.tsx";
import MaxSandwichNotification from "../../snackbar/MaxSandwichNotification.tsx";

// Mappe les noms de sandwich aux images correspondantes
const imageMap: { [key: string]: string } = {
  "Poulet Curry": pouletCurry,
  Boulette: boulette,
  Fromage: fromage,
  "Jambon Fromage": jambonFromage,
};

export default function Sandwichs() {
  // Récupère la liste des sandwichs via React Query
  const { data, error, isSuccess } = useQuery({
    queryKey: ["sandwichs"],
    queryFn: getSandwiches,
  });
  const dispatch = useDispatch();

  // États locaux pour la gestion de la fenêtre modale et des sélections
  const [modalOpen, setModalOpen] = useState(false);
  const [currentSandwich, setCurrentSandwich] =
    useState<SandwichesResponse | null>(null);
  const [selectedGarnitures, setSelectedGarnitures] = useState<string[]>([]);
  const [selectedSauces, setSelectedSauces] = useState<string[]>([]);
  const [addSandwichNotificationOpen, setAddSandwichNotificationOpen] =
    useState(false);
  const [singleSauceNotificationOpen, setSingleSauceNotificationOpen] =
    useState(false);
  const [maxSandwichNotificationOpen, setMaxSandwichNotificationOpen] =
    useState(false);

  // Récupère l'utilisateur courant depuis Redux
  const { currentUser, carts } = useSelector(
    (state: RootState) => state.EXPENSE,
  );
  // Obtient les sandwichs de l'utilisateur courant
  const personalizedSandwiches =
    currentUser && carts[currentUser]
      ? carts[currentUser].personalizedSandwiches
      : [];

  // Requête pour récupérer les garnitures, activée uniquement quand la modale est ouverte
  const { data: garnitureData, isLoading: garnitureLoading } = useQuery({
    queryKey: ["garniture"],
    queryFn: getGarniture,
    enabled: modalOpen,
  });

  // Requête pour récupérer les sauces, activée uniquement quand la modale est ouverte
  const { data: saucesData, isLoading: saucesLoading } = useQuery({
    queryKey: ["sauces"],
    queryFn: getSauces,
    enabled: modalOpen,
  });

  // Affiche un spinner de chargement ou un message d'erreur si nécessaire
  if (!isSuccess) {
    return <LoadingSpinner />;
  } else if (error) {
    return <span>Erreur...</span>;
  }

  // Ouvre la modale en sélectionnant un sandwich
  const handleCardClick = (sandwich: SandwichesResponse) => {
    setCurrentSandwich(sandwich);
    setSelectedGarnitures([]); // Réinitialise les garnitures sélectionnées
    setSelectedSauces([]); // Réinitialise les sauces sélectionnées
    setModalOpen(true);
  };

  // Fonction pour ajouter ou retirer une garniture de la sélection
  const toggleGarniture = (garniture: GarnitureResponse) => {
    if (!garniture.disponible) return; // Ne rien faire si la garniture n'est pas disponible
    setSelectedGarnitures((prev) =>
      prev.includes(garniture.nom)
        ? prev.filter((name) => name !== garniture.nom)
        : [...prev, garniture.nom],
    );
  };

  // Fonction pour ajouter ou retirer une sauce de la sélection
  const toggleSauces = (sauce: SaucesResponse) => {
    if (!sauce.disponible) return; // Ne rien faire si la sauce n'est pas disponible

    if (selectedSauces.includes(sauce.nom)) {
      // Si déjà sélectionnée, la retirer
      setSelectedSauces((prev) => prev.filter((name) => name !== sauce.nom));
    } else {
      // Si une sauce est déjà sélectionnée, afficher une notification d'erreur
      if (selectedSauces.length >= 1) {
        setSingleSauceNotificationOpen(true);
        return;
      }
      // Sinon, ajouter la sauce à la sélection
      setSelectedSauces((prev) => [...prev, sauce.nom]);
    }
  };

  // Fonction appelée lors de la validation dans la modale
  const handleModalSave = () => {
    // Vérifier si le panier contient déjà 5 sandwichs
    if (personalizedSandwiches.length >= 5) {
      setMaxSandwichNotificationOpen(true);
      return;
    }

    if (currentSandwich) {
      // Envoie l'action pour ajouter le sandwich personnalisé au panier via Redux
      dispatch(
        addPersonalizedSandwich({
          code: currentSandwich.code,
          sandwichName: currentSandwich.nom,
          sandwichPrice: currentSandwich.prix,
          garnitures: selectedGarnitures,
          sauces: selectedSauces,
        }),
      );
    }
    // Ferme la modale et réinitialise les sélections
    setModalOpen(false);
    setCurrentSandwich(null);
    setSelectedGarnitures([]);
    setSelectedSauces([]);
    // Affiche une notification de succès
    setAddSandwichNotificationOpen(true);
  };

  // Contenu affiché dans la fenêtre modale pour personnaliser le sandwich
  const renderModalContent = () => (
    <>
      <DialogTitle sx={{ mt: 1, fontFamily: "cursive", fontWeight: "bold" }}>
        Type de sandwich : {currentSandwich?.nom}
      </DialogTitle>
      <DialogContent dividers>
        <Typography
          variant="subtitle1"
          sx={{ mt: 1, fontFamily: "cursive", fontWeight: "bold" }}
        >
          Garnitures:
        </Typography>
        {garnitureLoading ? (
          <CircularProgress size={20} />
        ) : (
          <List>
            {garnitureData?.map((item: GarnitureResponse) => (
              <ListItem key={item.nom} component="li" disablePadding>
                <ListItemButton
                  onClick={() => toggleGarniture(item)}
                  disabled={!item.disponible}
                  sx={{
                    backgroundColor: "transparent",
                    "&:hover": { backgroundColor: "#FCE4EC" },
                  }}
                >
                  <Checkbox
                    sx={{
                      color: "#E1B0AC",
                      "&.Mui-checked": { color: "#E1B0AC" },
                    }}
                    checked={selectedGarnitures.includes(item.nom)}
                    disabled={!item.disponible}
                  />
                  <ListItemText
                    primary={item.nom}
                    secondary={
                      item.disponible ? "Disponible" : "Non disponible"
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
        <Typography
          variant="subtitle1"
          sx={{ mt: 2, fontFamily: "cursive", fontWeight: "bold" }}
        >
          Sauces:
        </Typography>
        {saucesLoading ? (
          <CircularProgress size={20} />
        ) : (
          <List>
            {saucesData?.map((item: SaucesResponse) => (
              <ListItem key={item.nom} component="li" disablePadding>
                <ListItemButton
                  onClick={() => toggleSauces(item)}
                  disabled={!item.disponible}
                  sx={{
                    backgroundColor: "transparent",
                    "&:hover": { backgroundColor: "#FCE4EC" },
                  }}
                >
                  <Checkbox
                    sx={{
                      color: "#E1B0AC",
                      "&.Mui-checked": { color: "#E1B0AC" },
                    }}
                    checked={selectedSauces.includes(item.nom)}
                    disabled={!item.disponible}
                  />
                  <ListItemText
                    primary={item.nom}
                    secondary={
                      item.disponible ? "Disponible" : "Non disponible"
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setModalOpen(false)}
          variant="outlined"
          sx={{
            color: "#E1B0AC",
            borderColor: "#E1B0AC",
            "&:hover": { backgroundColor: "#FCE4EC" },
          }}
        >
          Annuler
        </Button>
        <Button
          onClick={handleModalSave}
          variant="contained"
          sx={{
            backgroundColor: "#E1B0AC",
            "&:hover": { backgroundColor: "#E1B0AC" },
          }}
        >
          Envoyer au panier
        </Button>
      </DialogActions>
    </>
  );

  return (
    <>
      {/* Affiche la grille de cartes pour chaque sandwich */}
      <Grid container spacing={4} justifyContent="center" alignItems="center" sx={{ mb: 10 }} >
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
                border: "none",
                backgroundColor: "transparent",
                transition: "background-color 0.3s ease",
                "&:hover": {
                  backgroundColor: sandwich.disponible
                    ? "#F8E7E3"
                    : "transparent",
                },
                opacity: sandwich.disponible ? 1 : 0.5,
                pointerEvents: sandwich.disponible ? "auto" : "none",
              }}
            >
              <CardActionArea onClick={() => handleCardClick(sandwich)}>
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
                    {sandwich.disponible ? "Disponible" : "Non disponible"} -{" "}
                    {sandwich.prix} €
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Fenêtre modale pour personnaliser le sandwich */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        {renderModalContent()}
      </Dialog>

      {/* Notifications pour diverses actions */}
      <AddSandwichNotification
        open={addSandwichNotificationOpen}
        onClose={(_: any, reason: string) => {
          if (reason !== "clickaway") setAddSandwichNotificationOpen(false);
        }}
      />
      <MySingleSauceNotification
        open={singleSauceNotificationOpen}
        onClose={(_: any, reason?: string) => {
          if (reason !== "clickaway") setSingleSauceNotificationOpen(false);
        }}
      />
      <MaxSandwichNotification
        open={maxSandwichNotificationOpen}
        onClose={(_: any, reason?: string) => {
          if (reason !== "clickaway") setMaxSandwichNotificationOpen(false);
        }}
      />
    </>
  );
}
