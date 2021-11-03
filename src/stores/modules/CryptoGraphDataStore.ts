import Vue from "vue";
import Vuex from "vuex";
import { BusinessError } from "@/stores/models/BusinessError";
import IotaGraphDataService from "@/services/iota/IotaGraphDataService";

Vue.use(Vuex);

const iotaGraphDataService = new IotaGraphDataService();
export const CryptoGraphDataStore = {
  actions: {
    getDayRevenuesAndExpenses(){
      return new Promise((resolve, reject) => {
        iotaGraphDataService.getDayRevenuesAndExpenses()
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(BusinessError.fromResponse(error));
          });
      });
    },
    getHourRevenuesAndExpenses(){
      return new Promise((resolve, reject) => {
        iotaGraphDataService.getHourRevenuesAndExpenses()
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(BusinessError.fromResponse(error));
          });
      });
    },
    getMinuteRevenuesAndExpenses(){
      return new Promise((resolve, reject) => {
        iotaGraphDataService.getMinuteRevenuesAndExpenses()
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(BusinessError.fromResponse(error));
          });
      });
    },

    getDayRevenues(){
      return new Promise((resolve, reject) => {
        iotaGraphDataService.getDayRevenues()
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(BusinessError.fromResponse(error));
          });
      });
    },
    getHourRevenues(){
      return new Promise((resolve, reject) => {
        iotaGraphDataService.getHourRevenues()
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(BusinessError.fromResponse(error));
          });
      });
    },
    getMinuteRevenues(){
      return new Promise((resolve, reject) => {
        iotaGraphDataService.getMinuteRevenues()
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(BusinessError.fromResponse(error));
          });
      });
    },
    getDayExpenses(){
      return new Promise((resolve, reject) => {
        iotaGraphDataService.getDayExpenses()
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(BusinessError.fromResponse(error));
          });
      });
    },
    getHourExpenses(){
      return new Promise((resolve, reject) => {
        iotaGraphDataService.getHourExpenses()
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(BusinessError.fromResponse(error));
          });
      });
    },
    getMinuteExpenses(){
      return new Promise((resolve, reject) => {
        iotaGraphDataService.getMinuteExpenses()
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(BusinessError.fromResponse(error));
          });
      });
    },
    getDayBalances(){
      return new Promise((resolve, reject) => {
        iotaGraphDataService.getDayBalances()
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(BusinessError.fromResponse(error));
          });
      });
    },
    getHourBalances(){
      return new Promise((resolve, reject) => {
        iotaGraphDataService.getHourBalances()
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(BusinessError.fromResponse(error));
          });
      });
    },
    getMinuteBalances(){
      return new Promise((resolve, reject) => {
        iotaGraphDataService.getMinuteBalances()
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(BusinessError.fromResponse(error));
          });
      });
    },
  }
};
