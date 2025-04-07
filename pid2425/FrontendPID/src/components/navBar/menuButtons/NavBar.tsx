import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Typography,
  Stack,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { navBarButtons } from "./navBarButtons.ts";
import LogoutButton from "../logOut/Logout.tsx";
import { getUserInfo } from "../../../api/userApi.ts";
import { RootState } from "../../../store/store.ts";
import { setBalanceUser } from "../../../store/expense/expense-slice.ts";

// Styles pour les boutons de la barre de navigation
const commonStyles = {
  color: "#7D7D7D",
  fontFamily: "cursive, sans-serif",
  fontWeight: "bold",
  margin: "0 10px",
};

// Styles pour le texte dans le Drawer (menu latéral)
const commonDrawerTextStyles = {
  color: "#7D7D7D",
  fontFamily: "cursive, sans-serif",
  fontWeight: "bold",
};

const NavBar = () => {
  const dispatch = useDispatch();
  // Récupère le solde de l'utilisateur depuis le store Redux
  const balanceUser = useSelector(
    (state: RootState) => state.EXPENSE.balanceUser,
  );
  // État pour contrôler l'ouverture du Drawer (menu mobile)
  const [openDrawer, setOpenDrawer] = useState(false);
  const toggleDrawer = (open: boolean) => setOpenDrawer(open);
  // Vérifie si l'écran est grand (largeur minimale)
  const isLargeScreen = useMediaQuery("(min-width:1024px)");

  // Ferme le Drawer automatiquement sur les grands écrans
  useEffect(() => {
    if (isLargeScreen) {
      setOpenDrawer(false);
    }
  }, [isLargeScreen]);

  // Récupère les informations de l'utilisateur et met à jour le solde dans Redux
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userData = await getUserInfo();
        dispatch(setBalanceUser(userData.solde)); // Mise à jour du solde dans le store
      } catch (error) {
        console.error(
          "Erreur lors de l’obtention du solde de l’utilisateur : ",
          error,
        );
      }
    };
    fetchUserInfo();
  }, [dispatch]);

  return (
    <Box sx={{ width: "100%", marginBottom: "35px" }}>
      <Box sx={{ padding: "70px 0", marginTop: "0" }}></Box>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#F2D4D6",
          zIndex: 1,
          width: "100%",
          top: 0,
          left: 0,
          padding: "15px",
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              ...commonStyles,
            }}
          >
            Cafet
          </Typography>
          <Typography
            sx={{
              color: "white",
              fontFamily: "cursive, sans-serif",
              fontWeight: "bold",
              margin: "0 10px",
              display: "flex",
              alignItems: "center",
              backgroundColor: "#E1B0AC",
              borderRadius: "5px",
              padding: "5px 15px",
              fontSize: "18px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              marginLeft: "auto",
            }}
          >
            {balanceUser.toFixed(2)} €
          </Typography>
          {/* Bouton pour ouvrir le Drawer (menu mobile) */}
          <IconButton
            sx={{ display: { xs: "block", md: "none" }, ml: "auto" }}
            onClick={() => toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>

          {/* Menu de navigation pour grands écrans */}
          <Stack
            direction="row"
            spacing={2}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            {navBarButtons.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                sx={{ ...commonStyles }}
              >
                {item.text}
              </Button>
            ))}
            {/* Bouton de déconnexion */}
            <LogoutButton sx={{ ...commonStyles }} />
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Drawer  (menu latéral pour petits écrans) */}
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => toggleDrawer(false)}
      >
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {navBarButtons.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={() => toggleDrawer(false)}
                >
                  <ListItemText
                    primary={item.text}
                    sx={{ ...commonDrawerTextStyles }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          {/* Bouton de déconnexion dans le Drawer */}
          <ListItem disablePadding>
            <LogoutButton sx={{ ...commonDrawerTextStyles }} />
          </ListItem>
        </Box>
      </Drawer>
    </Box>
  );
};

export default NavBar;
