import { useKeycloak } from "@react-keycloak/web";
import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

// Interface pour les propriétés du bouton de déconnexion
interface LogoutButtonProps {
  sx?: object; // Propriétés de style optionnelles pour le bouton
}

// Composant de bouton de déconnexion
const LogoutButton = ({ sx }: LogoutButtonProps) => {
  // Récupère l'objet keycloak via le hook useKeycloak
  const { keycloak } = useKeycloak();

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    keycloak.logout({
      redirectUri: window.location.origin, // Redirige vers la page d'accueil après déconnexion
    });
  };

  // Affiche un bouton avec l'icône de déconnexion et applique les styles (sx) si fournis
  return <Button onClick={handleLogout} sx={sx} startIcon={<LogoutIcon />} />;
};

export default LogoutButton;
