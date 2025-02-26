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
      height="100vh"
      bgcolor="#f4f4f4"
    >
      <Card sx={{ maxWidth: 400, width: "100%", boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom textAlign="center">
            Mon profil
          </Typography>
          <Typography variant="body1" marginBottom={2}>
            <strong>Nom d'utilisateur:</strong> {user.username}
          </Typography>
          <Typography variant="body1" marginBottom={2}>
            <strong>Email:</strong> {user.email}
          </Typography>
          <Typography variant="body1">
            <strong>Saldo:</strong> {user.solde}€
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Compte;
