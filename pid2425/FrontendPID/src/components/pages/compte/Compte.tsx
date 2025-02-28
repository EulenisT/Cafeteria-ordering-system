import { useEffect, useState } from "react";
import { getUserInfo } from "../../../api/userApi.ts";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

function Compte() {
  const [user, setUser] = useState<{
    username: string;
    email: string;
    solde: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userData = await getUserInfo();
        setUser(userData);
      } catch (err) {
        setError("Error...");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!user) return <p>Not information about the user</p>;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      marginTop="130px"
    >
      <Card
        sx={{
          maxWidth: 400,
          width: "100%",
          boxShadow: 3,
          backgroundColor: "#f8f8f8",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            textAlign="center"
            sx={{
              fontFamily: "Cursive, sans-serif",
              fontWeight: "bold",
            }}
          >
            Mon profil
          </Typography>
          <Typography
            variant="body1"
            marginBottom={2}
            sx={{
              fontFamily: "Cursive, sans-serif",
            }}
          >
            <strong>Nom d'utilisateur:</strong> {user.username}
          </Typography>
          <Typography
            variant="body1"
            marginBottom={2}
            sx={{
              fontFamily: "Cursive, sans-serif",
            }}
          >
            <strong>Email:</strong> {user.email}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "Cursive, sans-serif",
            }}
          >
            <strong>Saldo:</strong> {user.solde}€
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Compte;
