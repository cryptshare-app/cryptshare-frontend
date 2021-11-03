import axios from "axios";
import EnvService from "../services/EnvService";
import { requestConfig, requestError, responseError } from "./interceptors/interceptors";

const BASE_API_URL = EnvService.getEnv("VUE_APP_BASE_API_URL");

/**
 * Export a base HTTP module based on axios.
 * Also setup up interceptor methods.
 * @returns {AxiosInstance}
 * @constructor
 */
export const HTTP = () => {
  let axiosInstance = axios.create({
    baseURL: BASE_API_URL

  });

  axiosInstance.interceptors.request.use(
    config => {
      return requestConfig(config);
    },
    error => requestError(error)
  );

  axiosInstance.interceptors.response.use(config => {
    return config;
  }, error => {
    return responseError(error, axiosInstance);
  });

  return axiosInstance;
};

export const HTTPWithoutBaseURL = () => {
  let axiosInstance = axios.create({});
  return axiosInstance;
};