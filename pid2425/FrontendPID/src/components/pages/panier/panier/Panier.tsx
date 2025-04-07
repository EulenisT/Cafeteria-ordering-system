import { useEffect } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Button,
  IconButton,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getUserInfo, updateUserSolde } from "../../../../api/userApi";
import { postCommande } from "../../../../api/commandeApi";
import keycloak from "../../../../keycloak/keycloak";
import {
  clearCart,
  removeFromCart,
  setBalanceUser,
  setCurrentUser,
} from "../../../../store/expense/expense-slice";
import { RootState } from "../../../../store/store";
import { getActiveSession } from "../../../../api/sessionApi";
import { SessionResponse } from "../../../../types";
import { useSnackbar } from "notistack";
import CloseIcon from "@mui/icons-material/Close";

export function Panier() {
  const dispatch = useDispatch();
  // Utilisation de notistack pour afficher des notifications (snackbars)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  // Récupère l'utilisateur courant, le panier et le solde depuis le store Redux
  const { currentUser, carts, balanceUser } = useSelector(
    (state: RootState) => state.EXPENSE,
  );
  // Récupère les sandwichs du panier de l'utilisateur courant
  const personalizedSandwiches =
    currentUser && carts[currentUser]
      ? carts[currentUser].personalizedSandwiches
      : [];

  // Récupère les informations utilisateur via React Query
  const { data: userProfile, isSuccess } = useQuery({
    queryKey: ["userInfo"],
    queryFn: getUserInfo,
    initialData: {
      username: keycloak.tokenParsed?.preferred_username || "",
      email: "",
      solde: 0,
    },
    staleTime: 60000,
  });

  // Détermine le nom d'utilisateur à utiliser
  const username =
    userProfile?.username || keycloak.tokenParsed?.preferred_username || "";

  // Met à jour le store Redux avec les informations utilisateur récupérées
  useEffect(() => {
    if (isSuccess && userProfile) {
      dispatch(setCurrentUser(userProfile.username));
      dispatch(setBalanceUser(userProfile.solde));
    }
  }, [isSuccess, userProfile, dispatch]);

  // Récupère les sessions actives via React Query, avec une actualisation toutes les 60 secondes
  const { data: activeSessions } = useQuery<SessionResponse[]>({
    queryKey: ["activeSession"],
    queryFn: getActiveSession,
    refetchInterval: 60000,
  });

  // Sélectionne la première session active ou null s'il n'y en a pas
  const activeSession =
    activeSessions && activeSessions.length > 0 ? activeSessions[0] : null;
  // État pour contrôler l'affichage d'une Snackbar d'erreur de paiement
  // const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);

  // Calcule le total des sandwichs personnalisés du panier
  const totalPersonalized = personalizedSandwiches.reduce(
    (acc, item) => acc + (Number(item.sandwichPrice) || 0),
    0,
  );
  const total = totalPersonalized;

  // Fonction pour gérer le paiement
  const handlePayment = async () => {
    // Arrondir le solde et le total à deux décimales
    const roundedSaldo = Math.round(balanceUser * 100) / 100;
    const roundedTotal = Math.round(total * 100) / 100;

    // Vérifie si le solde est insuffisant
    if (roundedSaldo < roundedTotal) {
      enqueueSnackbar("Solde insuffisant", {
        variant: "error",
        autoHideDuration: 4000,
      });
      return;
    }

    // Vérifie qu'une session active est disponible
    if (!activeSession) {
      enqueueSnackbar("Aucune session active. Veuillez réessayer plus tard.", {
        variant: "warning",
        autoHideDuration: 4000,
        anchorOrigin: { vertical: "top", horizontal: "center" },
        style: {
          top: "50%",
          transform: "translateY(-50%)",
          backgroundColor: "#f6edba",
          color: "#856404",
          border: "1px solid #ffeeba",
        },
        action: (key) => (
          <IconButton
            aria-label="close"
            onClick={() => closeSnackbar(key)}
            sx={{ color: "#856404" }}
          >
            <CloseIcon />
          </IconButton>
        ),
      });
      return;
    }

    try {
      // Prépare la charge utile (payload) pour la commande à envoyer
      const commandePayload = {
        lignesCmd: personalizedSandwiches.map((item) => ({
          articleCode: item.code,
          description: `Garnitures: ${item.garnitures.join(", ")}; Sauces: ${item.sauces.join(", ")}`,
          prix: item.sandwichPrice,
        })),
      };

      // Envoie la commande via l'API
      await postCommande(commandePayload);
      // Met à jour le solde utilisateur via l'API
      const newSolde = await updateUserSolde(username, total);
      dispatch(setBalanceUser(newSolde));
      // Vide le panier dans le store Redux
      dispatch(clearCart());

      // Prépare un message de confirmation en fonction de la session active
      let message = "";
      switch (activeSession.nom) {
        case "MATIN":
          message = "Commande réalisée pour la session du matin.";
          break;
        case "APM":
          message = "Commande réalisée pour la session de l'après-midi.";
          break;
        case "SOIR":
          message = "Commande réalisée pour la session du soir.";
          break;
        default:
          message = "Commande réalisée avec succès.";
      }
      // Affiche une notification de succès
      enqueueSnackbar(message, { variant: "success" });
    } catch (error: any) {
      // Gère l'erreur et affiche une notification adaptée
      const errorMessage =
        (error.response && error.response.data) ||
        error.message ||
        "Erreur lors du paiement";
      if (errorMessage.includes("nombre maximum de commandes")) {
        enqueueSnackbar(errorMessage, {
          variant: "warning",
          autoHideDuration: 6000,
        });
      } else {
        enqueueSnackbar("Erreur lors du paiement", { variant: "error" });
      }
    }
  };

  // Fonction pour retirer un élément du panier
  const handleRemoveItem = (id?: number) => {
    dispatch(removeFromCart({ id }));
  };

  return (
    <Box sx={{ width: "100%", mt: 4, px: { xs: 2, md: 4 }, mb: "80px" }}>
      <Typography
        variant="h4"
        sx={{
          mb: 2,
          fontWeight: "bold",
          textAlign: "center",
          color: "#555555",
        }}
      >
        Panier
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          mb: 2,
        }}
      >
        {/* Affiche la session active ou un message indiquant qu'aucune session n'est active */}
        <Typography
          variant="h6"
          sx={{
            color: "#E1B0AC",
            fontWeight: "bold",
            fontFamily: "Cursive",
            fontSize: "1.5rem",
          }}
        >
          Session :{" "}
          {activeSession ? activeSession.nom : "Aucune session active"}
        </Typography>
      </Box>

      {/* Liste des sandwichs dans le panier */}
      <List>
        {personalizedSandwiches.length > 0 ? (
          <>
            <Typography
              variant="h6"
              sx={{ mt: 2, fontWeight: "bold", mb: 1, color: "#555555" }}
            >
              Sandwichs :
            </Typography>
            {personalizedSandwiches.map((item) => (
              <ListItem
                key={`pers-${item.id}`}
                divider
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 2,
                }}
              >
                {/* Affiche le nom et les détails du sandwich */}
                <ListItemText
                  primary={item.sandwichName}
                  secondary={
                    <>
                      <Typography variant="body2" component="span">
                        Garnitures: {item.garnitures.join(", ")}
                      </Typography>
                      <br />
                      <Typography variant="body2" component="span">
                        Sauces: {item.sauces.join(", ")}
                      </Typography>
                      <br />
                      <Typography variant="body2" component="span">
                        Prix: {Number(item.sandwichPrice).toFixed(2)} €
                      </Typography>
                    </>
                  }
                />
                {/* Bouton pour retirer le sandwich du panier */}
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: "#E1B0AC",
                    color: "#E1B0AC",
                    backgroundColor: "#FCE4EC",
                    "&:hover": { backgroundColor: "#E1B0AC", color: "white" },
                  }}
                  onClick={() => handleRemoveItem(item.id)}
                >
                  Retirer du panier
                </Button>
              </ListItem>
            ))}
            <Divider sx={{ my: 2 }} />
          </>
        ) : (
          <Typography variant="body2" color="textSecondary">
            Aucun achat disponible.
          </Typography>
        )}
      </List>

      {/* Affiche le total à payer */}
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

      {/* Bouton pour effectuer le paiement */}
      <Button
        variant="contained"
        sx={{
          mt: 1,
          borderColor: "#E1B0AC",
          color: "white",
          backgroundColor: "#E1B0AC",
        }}
        onClick={handlePayment}
        disabled={total === 0 || !activeSession}
      >
        Payer
      </Button>

      {/*  /!* Composant Snackbar pour afficher une erreur de paiement *!/*/}
      {/*<PaymentErrorSnackbar*/}
      {/*  open={errorSnackbarOpen}*/}
      {/*  onClose={() => setErrorSnackbarOpen(false)}*/}
      {/*/>*/}
    </Box>
  );
}
