import { useEffect, useState } from "react";
import { getUserInfo } from "../../../api/userApi.ts";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner.tsx";

function Compte() {
  // État pour stocker les informations de l'utilisateur
  const [user, setUser] = useState<{
    username: string;
    email: string;
    solde: number;
  } | null>(null);
  // État pour stocker un message d'erreur en cas de problème lors de la récupération des données
  const [error, setError] = useState<string | null>(null);
  // État pour indiquer si le chargement est en cours
  const [loading, setLoading] = useState<boolean>(true);

  // Récupérer les informations de l'utilisateur au montage du composant
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Appel à l'API pour obtenir les informations de l'utilisateur
        const userData = await getUserInfo();
        setUser(userData);
      } catch (err) {
        // En cas d'erreur, met à jour l'état d'erreur
        setError("Erreur lors de l’obtention des informations utilisateur. ");
      } finally {
        // Indique que le chargement est terminé, qu'il y ait eu une erreur ou non
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, []);

  // Si le chargement est en cours, affiche un spinner
  if (loading) return <LoadingSpinner />;
  // Si une erreur est survenue, affiche un message d'erreur
  if (error)
    return (
      <p>Erreur lors de l’obtention des informations utilisateur : {error}</p>
    );
  // Si aucune donnée utilisateur n'est disponible, affiche un message approprié
  if (!user) return <p>Aucune information sur l’utilisateur</p>;

  // Affiche les informations du profil utilisateur dans une carte
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
            <strong>Mon prenom:</strong> {user.username}
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
            <strong>Solde:</strong> {user.solde.toFixed(2)}€
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Compte;
