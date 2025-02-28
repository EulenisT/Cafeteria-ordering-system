import { Box, Typography } from "@mui/material";

function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: "#F2D4D6",
        padding: "15px",
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        display: "flex",
        justifyContent: { xs: "center", md: "flex-end" },
        alignItems: "center",
        zIndex: 1,
      }}
    >
      <Typography
        sx={{
          textAlign: { xs: "center", md: "right" },
          fontSize: { xs: "12px", md: "15px" },
          fontFamily: "cursive, sans-serif",
          color: "white",
          fontWeight: "bold",
          backgroundColor: "#E1B0AC",
          borderRadius: "5px",
          padding: "5px 15px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          marginLeft: "auto",
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        ISFCE 2025
      </Typography>
    </Box>
  );
}

export default Footer;
