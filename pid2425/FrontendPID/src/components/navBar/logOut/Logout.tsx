import { useKeycloak } from "@react-keycloak/web";
import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

interface LogoutButtonProps {
  sx?: object;
}

const LogoutButton = ({ sx }: LogoutButtonProps) => {
  const { keycloak } = useKeycloak();

  const handleLogout = () => {
    keycloak.logout({
      redirectUri: window.location.origin,
    });
  };

  return <Button onClick={handleLogout} sx={sx} startIcon={<LogoutIcon />} />;
};

export default LogoutButton;
