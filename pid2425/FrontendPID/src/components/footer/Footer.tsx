import { Box, Typography } from "@mui/material";

function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: "rgba(255,213,0,0.43)",
        padding: "10px",
        display: "flex",
        justifyContent: { xs: "center", md: "flex-end" },
        alignItems: "center",
        marginTop: "25px",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          textAlign: { xs: "center", md: "right" },
          width: "100%",
          marginRight: { md: "20px" },
          fontSize: { xs: "12px", md: "15px" },
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        ISFCE 2025
      </Typography>
    </Box>
  );
}

export default Footer;
