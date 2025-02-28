import { SandwichesResponse } from "../types.ts";
import axios from "axios";
import keycloak from "../keycloak/keycloak.ts";

export const getSandwiches = async (): Promise<SandwichesResponse[]> => {
  if (!keycloak.token) {
    throw new Error("Not token");
  }

  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/sandwichs?all=true`,
    {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
    },
  );
  return response.data;
};
