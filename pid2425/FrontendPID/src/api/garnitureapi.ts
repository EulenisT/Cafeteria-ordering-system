import {GarnitureResponse} from "../types.ts";
import axios from "axios";


export const getGarniture = async (): Promise<GarnitureResponse[]> => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/garniture?all=true`);
    return  response.data;
}