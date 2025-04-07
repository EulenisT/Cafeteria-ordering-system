import axios from "axios";
import keycloak from "../keycloak/keycloak";
import { SessionResponse } from "../types";

/**
 * Récupère la liste des sessions actives depuis l'API.
 * Vérifie que le token Keycloak est présent pour autoriser la requête.
 */
export const getActiveSession = async (): Promise<SessionResponse[]> => {
  if (!keycloak.token) {
    throw new Error("Token non disponible");
  }
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/sessions/active`,
    {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
    },
  );
  return response.data;
};

/**
 * Récupère la liste complète des sessions depuis l'API.
 * Nécessite un token valide pour accéder aux informations des sessions.
 */
export const getSessions = async (): Promise<SessionResponse[]> => {
  if (!keycloak.token) {
    throw new Error("Token non disponible");
  }
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/sessions`,
    {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
    },
  );
  return response.data;
};
