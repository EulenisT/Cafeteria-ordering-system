import { useState, useEffect } from "react";
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
import PaymentErrorSnackbar from "../snackbar_panier/PaymentErrorSnackbar/PaymentErrorSnackbar";
import { RootState } from "../../../../store/store";
import { getActiveSession } from "../../../../api/sessionApi";
import { SessionResponse } from "../../../../types";
import { useSnackbar } from "notistack";
import CloseIcon from "@mui/icons-material/Close";

export function Panier() {
  const dispatch = useDispatch();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const { currentUser, carts, balanceUser } = useSelector(
    (state: RootState) => state.EXPENSE,
  );
  const personalizedSandwiches =
    currentUser && carts[currentUser]
      ? carts[currentUser].personalizedSandwiches
      : [];

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

  const username =
    userProfile?.username || keycloak.tokenParsed?.preferred_username || "";

  useEffect(() => {
    if (isSuccess && userProfile) {
      dispatch(setCurrentUser(userProfile.username));
      dispatch(setBalanceUser(userProfile.solde));
    }
  }, [isSuccess, userProfile, dispatch]);

  const { data: activeSessions } = useQuery<SessionResponse[]>({
    queryKey: ["activeSession"],
    queryFn: getActiveSession,
    refetchInterval: 60000,
  });

  const activeSession =
    activeSessions && activeSessions.length > 0 ? activeSessions[0] : null;
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);

  const totalPersonalized = personalizedSandwiches.reduce(
    (acc, item) => acc + (Number(item.sandwichPrice) || 0),
    0,
  );
  const total = totalPersonalized;

  const handlePayment = async () => {
    const roundedSaldo = Math.round(balanceUser * 100) / 100;
    const roundedTotal = Math.round(total * 100) / 100;

    if (roundedSaldo < roundedTotal) {
      enqueueSnackbar("Solde insuffisant", {
        variant: "error",
        autoHideDuration: 4000,
      });
      return;
    }

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
      const commandePayload = {
        lignes: personalizedSandwiches.map((item) => ({
          nomSandwich: item.sandwichName,
          description: `Garnitures: ${item.garnitures.join(", ")}; Sauces: ${item.sauces.join(", ")}`,
          prix: item.sandwichPrice,
        })),
      };

      await postCommande(commandePayload);
      const newSolde = await updateUserSolde(username, total);
      dispatch(setBalanceUser(newSolde));
      dispatch(clearCart());

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
      enqueueSnackbar(message, { variant: "success" });
    } catch (error: any) {
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

      <PaymentErrorSnackbar
        open={errorSnackbarOpen}
        onClose={() => setErrorSnackbarOpen(false)}
      />
    </Box>
  );
}
