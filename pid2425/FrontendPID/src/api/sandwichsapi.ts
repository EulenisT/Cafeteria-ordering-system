import { SandwichesResponse } from "../types.ts";
import axios from "axios";

export const getSandwiches = async (): Promise<SandwichesResponse[]> => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/sandwichs?all=true`,
  );
  return response.data;
};
