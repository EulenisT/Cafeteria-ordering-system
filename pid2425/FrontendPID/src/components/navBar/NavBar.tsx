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
import { menuButtons } from "./MenuButtons.ts";
import LogoutButton from "./logout.tsx";
import { getUserInfo } from "../../api/userApi.ts";

const NavBar = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const toggleDrawer = (open: boolean) => setOpenDrawer(open);
  const isLargeScreen = useMediaQuery("(min-width:1024px)");

  useEffect(() => {
    if (isLargeScreen) {
      setOpenDrawer(false);
    }
  }, [isLargeScreen]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userData = await getUserInfo();
        setUserBalance(userData.solde);
      } catch (error) {
        console.error("Error...", error);
      }
    };
    fetchUserInfo();
  }, []);

  return (
    <Box sx={{ width: "100%", marginBottom: "35px" }}>
      <Box
        sx={{
          padding: "70px 0",
          marginTop: "0",
        }}
      ></Box>
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
              color: "#7D7D7D",
              fontFamily: "cursive, sans-serif",
              fontWeight: "bold",
              textDecoration: "none",
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
            <span
              style={{
                paddingRight: "8px",
                fontFamily: "cursive",
                fontWeight: "bold",
              }}
            >
              Saldo:
            </span>{" "}
            <span style={{ color: "white", fontWeight: "bold" }}>
              {userBalance !== null ? `${userBalance} €` : " "}
            </span>
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
                sx={{
                  color: "#7D7D7D",
                  fontFamily: "cursive, sans-serif",
                  fontWeight: "bold",
                  margin: "0 10px",
                }}
              >
                {item.text}
              </Button>
            ))}
            <LogoutButton
              sx={{
                color: "#7D7D7D",
                fontFamily: "cursive, sans-serif",
                fontWeight: "bold",
                margin: "0 10px",
              }}
            />
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
                  <ListItemText
                    primary={item.text}
                    sx={{
                      color: "#7D7D7D",
                      fontFamily: "cursive, sans-serif",
                      fontWeight: "bold",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => toggleDrawer(false)}>
              <LogoutButton
                sx={{
                  color: "#7D7D7D",
                  fontFamily: "cursive, sans-serif",
                  fontWeight: "bold",
                }}
              />
            </ListItemButton>
          </ListItem>
        </Box>
      </Drawer>
    </Box>
  );
};

export default NavBar;
