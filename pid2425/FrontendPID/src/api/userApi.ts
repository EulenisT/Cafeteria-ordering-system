import axios from "axios";
import keycloak from "../keycloak/keycloak";
import { UserResponse } from "../types";

/**
 * Récupère les informations du profil utilisateur depuis l'API.
 * Vérifie que le token Keycloak est disponible et récupère le nom d'utilisateur.
 */

export const getUserInfo = async (): Promise<UserResponse> => {
  if (!keycloak.token) {
    throw new Error("Token non disponible");
  }
  const username = keycloak.tokenParsed?.preferred_username;
  if (!username) {
    throw new Error("Pas d'utilisateur");
  }
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/user/profile/${username}`,
    {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
    },
  );
  return response.data;
};

/**
 * Met à jour le solde de l'utilisateur en envoyant le montant à modifier.
 * Utilise une requête POST avec des paramètres pour identifier l'utilisateur et le montant.
 */
export const updateUserSolde = async (
  username: string,
  montant: number,
): Promise<number> => {
  if (!keycloak.token) {
    throw new Error("Token non disponible");
  }
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/user/updatesolde`,
    null,
    {
      params: { username, montant }, // Passe les paramètres dans l'URL
      headers: {
        Authorization: `Bearer ${keycloak.token}`, // Utilise le token pour l'authentification
      },
    },
  );
  return response.data; // Retourne le nouveau solde de l'utilisateur
};
