import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        marginTop: { xs: "40px", sm: "60px", md: "80px", lg: "100px" },
      }}
    >
      <Grid container spacing={4} justifyContent="center" alignItems="center">
        {/* premier bouton */}
        <Grid item xs={12} sm={6} md={3} component="div">
          <Link to="/menu">
            <Button
              variant="contained"
              size="large"
              sx={{
                width: "100%",
                padding: "30px",
                fontSize: { xs: "14px", sm: "16px", md: "18px" },
                backgroundColor: "#ecbf36",
                color: "white",
                "&:hover": {
                  backgroundColor: "#cca1d6",
                },
              }}
            >
              Menu
            </Button>
          </Link>
        </Grid>

        {/* deuxième bouton  */}
        <Grid item xs={12} sm={6} md={3} component="div">
          <Link to="/personnaliser">
            <Button
              variant="contained"
              size="large"
              sx={{
                width: "100%",
                padding: "30px",
                fontSize: { xs: "14px", sm: "16px", md: "18px" },
                backgroundColor: "#ecbf36",
                color: "white",
                "&:hover": {
                  backgroundColor: "#cca1d6",
                },
              }}
            >
              Personnaliser
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
}
