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
import axios from "axios";
import { getSauces } from "../../../../api/saucesApi";
import { getGarniture } from "../../../../api/garnitureApi";
import { getUserInfo } from "../../../../api/userApi";
import keycloak from "../../../../keycloak/keycloak";
import {
  clearCart,
  removeFromCart,
  setSaldoUser,
} from "../../../../store/expense/expense-slice";
import PaymentErrorSnackbar from "../snackbar_panier/PaymentErrorSnackbar/PaymentErrorSnackbar";
import { RootState } from "../../../../store/store";
import { getActiveSession } from "../../../../api/sessionApi";
import { SessionResponse } from "../../../../types.ts";
import { useSnackbar } from "notistack";
import CloseIcon from "@mui/icons-material/Close";

export function Panier() {
  const dispatch = useDispatch();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const preparedSandwiches = useSelector(
    (store: RootState) => store.EXPENSE.expenseList,
  );
  const personalizedSandwiches = useSelector(
    (store: RootState) => store.EXPENSE.personalizedSandwiches,
  );
  const saldoUser = useSelector((store: RootState) => store.EXPENSE.saldoUser);

  const {
    data: userProfile,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserInfo,
    initialData: {
      username: keycloak.tokenParsed?.preferred_username || "",
      email: "",
      solde: saldoUser,
    },
    staleTime: 60000,
  });

  const username =
    userProfile?.username || keycloak.tokenParsed?.preferred_username || "";

  useEffect(() => {
    if (isSuccess && userProfile) {
      dispatch(setSaldoUser(userProfile.solde));
    }
  }, [isSuccess, userProfile, dispatch]);

  const { data: garnitureData } = useQuery({
    queryKey: ["garniture"],
    queryFn: getGarniture,
  });
  const { data: saucesData } = useQuery({
    queryKey: ["sauces"],
    queryFn: getSauces,
  });

  const { data: activeSessions } = useQuery<SessionResponse[]>({
    queryKey: ["activeSession"],
    queryFn: getActiveSession,
    refetchInterval: 60000,
  });

  const activeSession =
    activeSessions && activeSessions.length > 0 ? activeSessions[0] : null;
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);

  const computePersonalizedPrice = (item: {
    garnitures: string[];
    sauces: string[];
  }): number => {
    let total = 0;
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

  const totalPrepared = preparedSandwiches.reduce(
    (acc, item) => acc + item.price,
    0,
  );
  const totalPersonalized = personalizedSandwiches.reduce(
    (acc, item) => acc + (item.sandwichPrice + computePersonalizedPrice(item)),
    0,
  );
  const total = totalPrepared + totalPersonalized;

  const handlePayment = async () => {
    const roundedSaldo = Math.round(saldoUser * 100) / 100;
    const roundedTotal = Math.round(total * 100) / 100;

    if (roundedSaldo < roundedTotal) {
      enqueueSnackbar("  Solde insuffisant", {
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
        lignes: [
          ...preparedSandwiches.map((item) => ({
            type: "PRÉPARÉ",
            nomSandwich: item.name,
            prix: item.price,
            qt: 1,
          })),
          ...personalizedSandwiches.map((item) => ({
            type: "PERSONNALISÉ",
            nomSandwich: item.sandwichName,
            description: `Garnitures: ${item.garnitures.join(", ")}; Sauces: ${item.sauces.join(", ")}`,
            prix: item.sandwichPrice + computePersonalizedPrice(item),
            qt: 1,
          })),
        ],
      };

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/commandes`,
        commandePayload,
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        },
      );

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/updatesolde`,
        null,
        {
          params: { username, montant: total },
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        },
      );
      dispatch(setSaldoUser(response.data));
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
    } catch (error) {
      console.error("Erreur lors du paiement et de la commande", error);
      enqueueSnackbar("Erreur lors du paiement", { variant: "error" });
    }
  };

  const handleRemoveItem = (id?: number, name?: string) => {
    dispatch(removeFromCart({ id, name }));
  };

  return (
    <Box sx={{ width: "100%", mt: 4, px: { xs: 2, md: 4 }, mb: "80px" }}>
      <Typography
        variant="h4"
        sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}
      >
        Panier
      </Typography>

      {/* Información sobre la sesión activa */}
      <Box sx={{ textAlign: "center", mb: 2 }}>
        {activeSession ? (
          <Typography variant="h6">Session : {activeSession.nom}</Typography>
        ) : (
          <Typography variant="h6">Aucune session active</Typography>
        )}
      </Box>

      <Box sx={{ textAlign: "center", mb: 2 }}>
        {isLoading ? (
          <Typography variant="h6">Cargando saldo...</Typography>
        ) : (
          <Typography variant="h6">Saldo: {saldoUser.toFixed(2)} €</Typography>
        )}
      </Box>

      {/* Listado del carrito */}
      <List>
        {preparedSandwiches.length > 0 && (
          <>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              Sandwichs préparés:
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
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: "#E1B0AC",
                    color: "#E1B0AC",
                    backgroundColor: "#FCE4EC",
                    "&:hover": { backgroundColor: "#E1B0AC", color: "white" },
                  }}
                  onClick={() => handleRemoveItem(undefined, item.name)}
                >
                  Retirer du panier
                </Button>
              </ListItem>
            ))}
            <Divider sx={{ my: 2 }} />
          </>
        )}

        {personalizedSandwiches.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold", mb: 1 }}>
              Sandwichs personnalisés:
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
                  primary="Sandwich au choix :"
                  secondary={
                    <>
                      <Typography variant="body2">
                        Garnitures: {item.garnitures.join(", ")}
                      </Typography>
                      <Typography variant="body2">
                        Sauces: {item.sauces.join(", ")}
                      </Typography>
                      <Typography variant="body2">
                        Total personnalisé:{" "}
                        {(
                          item.sandwichPrice + computePersonalizedPrice(item)
                        ).toFixed(2)}{" "}
                        €
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
        )}

        {preparedSandwiches.length === 0 &&
          personalizedSandwiches.length === 0 && (
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
        disabled={total === 0}
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
