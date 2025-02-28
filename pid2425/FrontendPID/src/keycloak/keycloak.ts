import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8084/",
  realm: "CAFET",
  clientId: "CAFET",
});

export default keycloak;
