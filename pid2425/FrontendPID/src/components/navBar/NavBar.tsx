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
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import MenuIcon from "@mui/icons-material/Menu";
import { useEffect, useState } from "react";
import { menuButtons } from "./MenuButtons.ts";
import LogoutButton from "./logout.tsx";

const NavBar = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const toggleDrawer = (open: boolean) => setOpenDrawer(open);

  const isLargeScreen = useMediaQuery("(min-width:1024px)");

  useEffect(() => {
    if (isLargeScreen) {
      setOpenDrawer(false);
    }
  }, [isLargeScreen]);

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
            Cafe
          </Typography>

          <IconButton
            sx={{ display: { xs: "block", md: "none" }, ml: "auto" }}
            onClick={() => toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>

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
                sx={{  color: "#171717", fontFamily: "'Roboto', sans-serif", margin: "0 10px" }}
              >
                {item.text}
              </Button>
            ))}
            <LogoutButton sx={{  color: "#171717", fontFamily: "'Roboto', sans-serif", margin: "0 10px" }} />
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
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
          <ListItem disablePadding>
            <ListItemButton onClick={() => toggleDrawer(false)}>
              <LogoutButton sx={{ color: "grey" }} />
            </ListItemButton>
          </ListItem>
        </Box>
      </Drawer>
    </Box>
  );
};

export default NavBar;
