import { UserResponse } from "../types.ts";
import axios from "axios";
import keycloak from "../keycloak/keycloak.ts";

export const getUserInfo = async (): Promise<UserResponse> => {
    if (!keycloak.token) {
        throw new Error("No token");
    }

    const username = keycloak.tokenParsed?.preferred_username;

    if (!username) {
        throw new Error("Not user");
    }

    const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/profile/${username}`,
        {
            headers: {
                Authorization: `Bearer ${keycloak.token}`,
            },
        }
    );

    return response.data;
};
