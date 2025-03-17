import axios from "axios";
import keycloak from "../keycloak/keycloak";
import { UserResponse } from "../types";

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
      params: { username, montant },
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
    },
  );
  return response.data;
};
