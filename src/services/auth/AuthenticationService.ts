


import {AxiosResponse} from "axios";
import {HTTP} from "@/axios";
import JWTokenTO from "@/services/auth/types/JWTokenTO";
import {JWToken} from "@/stores/models/JWToken";

/**
 * static http service for auth related logic.
 */
export default class AuthenticationService {
    /**
     *  Signs in with a given username and password.
     *
     * @param {*} userName
     * @param {*} password
     * @memberof UserService
     */
    static async login(userName: string, password: string): Promise<JWToken> {
        let response: AxiosResponse<JWTokenTO> = await HTTP().post("authentication/login", {
            userName: userName,
            password: password
        });
        return JWToken.fromTO(response.data);
    }

    /**
     *  Registers a new user with the given parameters.
     *
     * @param {*} userName
     * @param {*} email
     * @param {*} password
     * @memberof UserService
     */
    static async register(userName: string, email: string, password: string): Promise<JWToken> {
        let response = await HTTP().post("authentication/register", {
            userName: userName,
            email: email,
            password: password
        });
        return JWToken.fromTO(response.data);
    }

    /**
     * NON http helper methods for handling jwt in local storage
     * @returns {boolean}
     */
    static hasJWTokens(): boolean {
        let accessToken = localStorage.getItem('accessToken');
        let refreshToken = localStorage.getItem('refreshToken');

        return !!(accessToken && refreshToken);
    }

    /**
     * NON http helper methods for handling jwt in local storage
     * @returns {boolean}
     */
    static getJWTokens() {
        let accessToken = localStorage.getItem('accessToken');
        let refreshToken = localStorage.getItem('refreshToken');
        const tokens = new JWToken();
        tokens.accessToken = accessToken || "";
        tokens.refreshToken = refreshToken || "";
        return tokens;
    }
}
