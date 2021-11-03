import Vue from "vue";
import Vuex, {Commit} from "vuex";
import {TYPES} from "@/stores/models/types";
import JWTService from "../../services/auth/JWTService";

import {BusinessError} from "@/stores/models/BusinessError";
import AuthenticationService from "@/services/auth/AuthenticationService";
import {JWToken} from "@/stores/models/JWToken";

import UserService from "@/services/user/UserService";
import UserInformation from "@/stores/models/UserInformation";
import WebsocketService from "@/services/WebsocketService";
import WebsocketServicePrice from "@/services/WebsocketServicePrice";
import SearchUserNames from "@/services/user/types/SearchUserNames";

Vue.use(Vuex);

/**
 * Userstore to handle Vuex logic related to user authentication.
 * Stores state: {
 *     status,
 *     tokens
 * }
 */
export const UserStore = {
    state: {
        status: "",
        tokens: {
            accessToken: localStorage.getItem("accessToken") || "",
            refreshToken: localStorage.getItem("refreshToken") || ""
        } as JWToken,
        userProfile: UserInformation.fromTemplate()
    },
    mutations: {
        auth_request(state: any) {
            state.status = TYPES.LOADING;
        },
        auth_success(state: any, tokens: JWToken) {
            state.status = TYPES.AUTHENTICATED;
            state.tokens = tokens;
        },
        auth_error(state: any) {
            state.status = TYPES.ERROR;
        },
        get_user(state: any, user: UserInformation) {
            state.userProfile = user;
        },
        auth_logout(state: any) {
            state.status = "";
            state.tokens = {
                accessToken: "",
                refreshToken: ""
            };
            state.userProfile = UserInformation.fromTemplate();
        }
    },
    actions: {
        /**
         * Action "Login" to perform an authentication request named login.
         * @param commit the mutation to be called.
         * @param getters the getters, to have access to the user stores' getters.
         * @param userName the name of the user.
         * @param password the password of the user.
         * @param rememberMe true if checkbox remember me is active.
         * @returns {Promise}
         */
        login({commit}, {userName, password}: any) {
            return new Promise((resolve, reject) => {
                commit("auth_request");
                AuthenticationService.login(userName, password)
                    .then(tokens => {
                        localStorage.setItem("accessToken", tokens.accessToken || "");
                        localStorage.setItem("refreshToken", tokens.refreshToken || "");

                        commit("auth_success", tokens);
                        resolve(tokens);
                    })
                    .catch(error => {
                        commit("auth_error");
                        localStorage.removeItem("accessToken");
                        localStorage.removeItem("refreshToken");
                        reject(BusinessError.fromResponse(error));
                    });
            });
        },
        /**
         * Performs logout of the current user
         * @param {any} commit
         * @returns {Promise}
         */
        logout({commit}) {
            return new Promise((resolve, reject) => {
                WebsocketService.close();
                WebsocketServicePrice.close();
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                commit("auth_logout");
                resolve();
            });
        },
        /**
         * Get current user's information
         * @param {any} commit
         * @returns {Promise}
         */
        getUserInformation({commit}) {
            return new Promise((resolve, reject) => {
                UserService.getUserInformation()
                    .then((user: UserInformation) => {
                        commit("get_user", user);
                        //tell the websocket endpoint the users name to allow mapping of user and websocket session
                        WebsocketService.init(user.id);
                        WebsocketServicePrice.init();
                        resolve(user);
                    })
                    .catch(error => {
                        reject(BusinessError.fromResponse(error));
                    });
            });
        },
        /**
         * Get  user's information by the user's internal id
         * @param {any} commit
         * @returns {Promise}
         */
        performGetUserInformationById({commit}, userId: number) {
            return new Promise((resolve, reject) => {
                UserService.getUserInformationById(userId)
                    .then((user: UserInformation) => {
                        resolve(user);
                    })
                    .catch(error => {
                        reject(BusinessError.fromResponse(error));
                    });
            });
        },
        /**
         * Registers a user by the given username, email and password
         * @param {any} commit
         * @param {any} userName the name of the user
         * @param {any} email the email of the user
         * @param {any} password the password of the user
         * @returns {Promise}
         */
        register({commit}, {userName, email, password}: any) {
            return new Promise((resolve, reject) => {
                commit("auth_request");
                AuthenticationService.register(userName, email, password)
                    .then((tokens: JWToken) => {
                        localStorage.setItem("accessToken", tokens.accessToken || "");
                        localStorage.setItem("refreshToken", tokens.refreshToken || "");

                        commit("auth_success", tokens);
                        resolve(tokens);
                    })
                    .catch(error => {
                        commit("auth_error");

                        localStorage.removeItem("accessToken");
                        localStorage.removeItem("refreshToken");
                        reject(BusinessError.fromResponse(error));
                    });
            });
        },
        /**
         * Refresh the access and refresh token of the current user.
         * Will be called automatically in axios interceptors if the response contains information "access_token_invalid"
         * @param {any} commit
         * @param {any} state
         * @returns {Promise}
         */
        refreshTokens({commit, state}) {
            return new Promise((resolve, reject) => {
                JWTService.refreshToken(state.tokens)
                    .then((tokens: JWToken) => {
                        localStorage.setItem("accessToken", tokens.accessToken || "");
                        localStorage.setItem("refreshToken", tokens.refreshToken || "");
                        commit("auth_success", tokens);
                        resolve(tokens);
                    })
                    .catch(error => {
                        commit("auth_error");
                        localStorage.removeItem("accessToken");
                        localStorage.removeItem("refreshToken");
                        reject(BusinessError.fromResponse(error));
                    });
            });
        },
        performFetchUserNames({commit}) {
            return new Promise((resolve, reject) => {
                UserService.fetchUserNames()
                    .then((names: SearchUserNames) => {
                        resolve(names.userNames);
                    })
                    .catch(error => {
                        reject(BusinessError.fromResponse(error));
                    });
            });
        }


    },
    getters: {
        getAccessToken: (state: any) => {
            return state.tokens.accessToken;
        },
        getRefreshToken: (state: any) => {
            return state.tokens.refreshToken;
        },
        isAuthenticated: (state: any): boolean => {
            return state.tokens.accessToken && state.status === TYPES.AUTHENTICATED;
        },
        getCurrentUser: (state: any) => {
            return state.userProfile;
        }
    }
};
