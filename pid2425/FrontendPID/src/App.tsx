import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./components/navBar/NavBar.tsx";
import Footer from "./components/footer/Footer.tsx";
import HomePage from "./components/homePage/HomePage.tsx";
import Menu from "./components/menu/Menu.tsx";
import Compte from "./components/compte/Compte.tsx";
import Historique from "./components/historique/Historique.tsx";
import Personnaliser from "./components/personnaliser/Personnaliser.tsx";
import Panier from "./components/panier/Panier.tsx";
import PageNotFound from "./components/pageNotFound/PageNotFound.tsx";

const queryClient = new QueryClient();

export default function App() {
  return (
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
  );
}
