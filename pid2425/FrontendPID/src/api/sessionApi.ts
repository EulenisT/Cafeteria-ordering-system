import axios from "axios";
import keycloak from "../keycloak/keycloak";
import { SessionResponse } from "../types";

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
