


import {AxiosResponse} from "axios";

import {HTTP} from "@/axios";
import JWTokenTO from "@/services/auth/types/JWTokenTO";
import {JWToken} from "@/stores/models/JWToken";

/**
 * Static http service for jwt related logic.
 */
export default class JWTService {

    /**
     * refreshs access and refresh token for the currently logged in user.
     * @param {JWToken} tokens
     * @returns {Promise<JWToken>}
     */
    static async refreshToken(tokens: JWToken): Promise<JWToken> {
        let response: AxiosResponse<JWTokenTO> = await HTTP().post("authentication/refresh", {
            "accessToken": tokens.accessToken,
            "refreshToken": tokens.refreshToken
        });
        return JWToken.fromTO(response.data);
    }


}

