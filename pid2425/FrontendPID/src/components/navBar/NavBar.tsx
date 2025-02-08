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
} from "@mui/material";
import { Link } from "react-router-dom";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { menuButtons } from "./MenuButtons.ts";

const NavBar = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const toggleDrawer = (open: boolean) => setOpenDrawer(open);

  return (
    <Box sx={{ width: "100%", marginBottom: "35px" }}>
      {/* Banner */}
      <Box
        sx={{
          backgroundColor: "#EFB9C0",
          padding: "110px 0",
          textAlign: "center",
        }}
      ></Box>

      {/* barre de navigation*/}
      <AppBar
        position="static"
        sx={{ backgroundColor: "rgba(239,239,239,0.83)" }}
      >
        <Toolbar>
          <IconButton
            sx={{ display: { xs: "block", md: "block" } }}
            component={Link}
            to="/"
          >
            <LocalCafeIcon />
          </IconButton>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              color: "#171717",
              fontFamily: "'Roboto', sans-serif",
              textDecoration: "none",
            }}
          >
            CafeIsfce
          </Typography>

          {/* Menu Hamburger sur mobile */}
          <IconButton
            sx={{ display: { xs: "block", md: "none" }, ml: "auto" }}
            onClick={() => toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>

          {/*  Boutons de navigation sur les grands écrans */}
          <Stack
            direction="row"
            spacing={2}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            {menuButtons.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                sx={{ color: "black", margin: "0 10px" }}
              >
                {item.text}
              </Button>
            ))}
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Drawer (Menu Hamburger) */}
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => toggleDrawer(false)}
      >
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {menuButtons.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={() => toggleDrawer(false)}
                >
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default NavBar;
