import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { Historique } from "./historique/Historique.tsx";

export default function HomePage() {
  return (
    <>
      {/* Conteneur principal pour centrer le bouton sur la page */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: { xs: "40px", sm: "60px", md: "80px", lg: "100px" },
        }}
      >
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={12} sm={8} md={6}>
            <Link to="/menu" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  padding: "30px",
                  fontSize: { xs: "14px", sm: "16px", md: "18px" },
                  backgroundColor: "white",
                  border: "2px solid #E1B0AC",
                  color: "#E1B0AC",
                  fontFamily: "cursive",
                  "&:hover": {
                    backgroundColor: "#E1B0AC",
                    color: "white",
                  },
                }}
              >
                Choisir mon sandwich
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Box>
      {/* Inclusion du composant Historique qui affiche l'historique des commandes */}
      <Historique />
    </>
  );
}
