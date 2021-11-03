import store from "../../stores";
import {router} from "@/router";
import {TYPES} from "@/stores/models/types";
import AuthenticationService from "@/services/auth/AuthenticationService";
import {JWToken} from "@/stores/models/JWToken";

/**
 * Interceptor method that is called before axios performs an request.
 * @param config the config of the request. For example status
 * @returns {*}
 */
export function requestConfig(config: any) {
    if (!store.getters.getAccessToken || !store.getters.getRefreshToken || !AuthenticationService.hasJWTokens()) {
        return config;
    }
    config.headers.authorization = "Bearer " + store.getters.getAccessToken;
    return config;

}

/**
 * Interceptor method that is called when axios request cannot be performed.
 * @param error
 * @returns {Promise}
 */
export function requestError(error: any) {
    return Promise.reject(error);
}

/**
 * Interceptor method that is called after receiving an response.
 * @param error The error why the request could not be performed. Normally due to status unauthorized.
 * @param axios The axios instance to perform the original request.
 * @returns {*}
 */
export function responseError(error: any, axios: any) {
    /** if the access token is invalid then use the refresh token to issue new jwtokens */

    if (error.response.status === 401 && error.response.data.errorMessage === TYPES.ACCESS_TOKEN_INVALID) {
        const originalRequest = error.config;
        return store.dispatch("refreshTokens")
            .then((tokens: JWToken) => {
                originalRequest.config.headers.Authorization = 'Bearer ' + tokens.accessToken;
                return axios.request(originalRequest);
            }).catch(err => {
            });
    }
    /** if the refresh token is also invalid then route to login*/
    if (error.response.status === 401 && error.response.data.error === TYPES.REFRESH_TOKEN_INVALID) {
        if (!store.getters.getAccessToken || !store.getters.getRefreshToken) {
            return Promise.reject(error);
        }
        router.push({
            path: "/login"
        });
    }
    return Promise.reject(error);
}