import axios from "axios";
import keycloak from "../keycloak/keycloak";
import { CommandeResponse } from "../types";

/**
 * Récupère la liste des commandes depuis l'API.
 * Vérifie si le token Keycloak est disponible avant de faire la requête.
 */

export const getCommandes = async (): Promise<CommandeResponse[]> => {
  if (!keycloak.token) {
    throw new Error("Token non disponible");
  }
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/commandes`,
    {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
    },
  );
  return response.data;
};

/**
 * Envoie une nouvelle commande à l'API.
 * Vérifie que le token Keycloak est présent et envoie la charge utile de la commande.
 */
export const postCommande = async (commandePayload: any): Promise<any> => {
  if (!keycloak.token) {
    throw new Error("Token non disponible");
  }
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/commandes`,
    commandePayload,
    {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
    },
  );
  return response.data; // Retourne la réponse de l'API
};

/**
 * Supprime une commande spécifique via l'API.
 * Nécessite un token valide pour autoriser la suppression.
 */
export const deleteCommande = async (id: number): Promise<void> => {
  if (!keycloak.token) {
    throw new Error("Token non disponible");
  }
  await axios.delete(`${import.meta.env.VITE_API_URL}/api/commandes/${id}`, {
    headers: {
      Authorization: `Bearer ${keycloak.token}`,
    },
  });
};
