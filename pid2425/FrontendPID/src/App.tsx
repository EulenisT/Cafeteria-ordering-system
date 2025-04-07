import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./components/navBar/menuButtons/NavBar.tsx";
import Footer from "./components/footer/Footer.tsx";
import HomePage from "./components/pages/homePage/HomePage.tsx";
import Sandwichs from "./components/pages/sandwichs/Sandwichs.tsx";
import Compte from "./components/pages/compte/Compte.tsx";
import { Panier } from "./components/pages/panier/panier/Panier.tsx";
import PageNotFound from "./components/pages/pageNotFound/PageNotFound.tsx";
import keycloak from "./keycloak/keycloak.ts";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import { SnackbarProvider } from "notistack";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

// Création du client de requête pour React Query
const queryClient = new QueryClient();

export default function App() {
  return (
    // Fournisseur Keycloak pour gérer l'authentification
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        onLoad: "login-required",
      }}
      LoadingComponent={
        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="center"
          style={{ minHeight: "100vh" }}
        >
          <Grid item>
            <CircularProgress sx={{ color: "#E1B0AC" }} />
          </Grid>
        </Grid>
      }
    >
      {/* Fournisseur pour React Query */}
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {/* Fournisseur de notifications (snackbars) avec Notistack */}
          <SnackbarProvider
            maxSnack={3}
            iconVariant={{
              warning: (
                <WarningAmberIcon sx={{ color: "#856404", marginRight: 2 }} />
              ),
            }}
          >
            <React.Fragment>
              <CssBaseline />
              <Container maxWidth="xl">
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh",
                    backgroundColor: "white",
                  }}
                >
                  {/* Barre de navigation */}
                  <NavBar />
                  <Box sx={{ flexGrow: 1 }}>
                    <Routes>
                      {/* Définition des routes de l'application */}
                      <Route path="/" element={<HomePage />} />
                      <Route path="menu" element={<Sandwichs />} />
                      <Route path="compte" element={<Compte />} />
                      <Route path="panier" element={<Panier />} />
                      <Route path="*" element={<PageNotFound />} />
                    </Routes>
                  </Box>
                  {/* Pied de page */}
                  <Footer />
                </Box>
              </Container>
            </React.Fragment>
          </SnackbarProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ReactKeycloakProvider>
  );
}
