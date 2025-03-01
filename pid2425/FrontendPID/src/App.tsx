import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./components/navBar/NavBar.tsx";
import Footer from "./components/footer/Footer.tsx";
import HomePage from "./components/pages/homePage/HomePage.tsx";
import Menu from "./components/pages/menu/Menu.tsx";
import Compte from "./components/pages/compte/Compte.tsx";
import Historique from "./components/pages/historique/Historique.tsx";
import Personnaliser from "./components/pages/personnaliser/Personnaliser.tsx";
import Panier from "./components/pages/panier/Panier.tsx";
import PageNotFound from "./components/pages/pageNotFound/PageNotFound.tsx";
import keycloak from "./keycloak/keycloak.ts";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";

const queryClient = new QueryClient();

export default function App() {
  return (
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
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
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
                <NavBar />
                <Box sx={{ flexGrow: 1 }}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="menu" element={<Menu />} />
                    <Route path="compte" element={<Compte />} />
                    <Route path="historique" element={<Historique />} />
                    <Route path="panier" element={<Panier />} />
                    <Route path="personnaliser" element={<Personnaliser />} />
                    <Route path="*" element={<PageNotFound />} />
                  </Routes>
                </Box>
                <Footer />
              </Box>
            </Container>
          </React.Fragment>
        </BrowserRouter>
      </QueryClientProvider>
    </ReactKeycloakProvider>
  );
}
