import axios from "axios";
import keycloak from "../keycloak/keycloak";
import { CommandeResponse } from "../types";

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
  return response.data;
};

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
