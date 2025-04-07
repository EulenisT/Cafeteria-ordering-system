// Importation de la bibliothèque Keycloak pour gérer l'authentification
import Keycloak from "keycloak-js";

// Création d'une instance de Keycloak avec la configuration spécifique
const keycloak = new Keycloak({
  url: "http://localhost:8084/", // URL du serveur Keycloak
  realm: "CAFET", // Nom du realm utilisé pour l'authentification
  clientId: "CAFET", // Identifiant du client dans Keycloak
});

export default keycloak;
