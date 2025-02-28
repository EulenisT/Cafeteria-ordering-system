import { SaucesResponse } from "../types.ts";
import axios from "axios";
import keycloak from "../keycloak/keycloak.ts";

export const getSauces = async (): Promise<SaucesResponse[]> => {
  if (!keycloak.token) {
    throw new Error("Not token");
  }

  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/sauces?all`,
    {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
    },
  );
  return response.data;
};
