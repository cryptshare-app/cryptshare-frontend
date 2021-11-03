import Vue from "vue";
import Vuex from "vuex";
import IotaAddressService from "../../services/iota/IotaAddressService";
import IotaTransactionService from "../../services/iota/IotaTransactionService";
import IotaPaymentService from "../../services/iota/IotaPaymentService";
import { BusinessError } from "@/stores/models/BusinessError";
import PaymentTO from "@/services/payments/types/PaymentTO";

Vue.use(Vuex);

//const iotaSeedService = new IotaSeedService();
const iotaAddressService = new IotaAddressService();
const iotaTransactionService = new IotaTransactionService();
const iotaPaymentService = new IotaPaymentService();
export const CryptoStore = {

  actions: {
    updateExchangeRate() {
      return new Promise((resolve, reject) => {
        iotaPaymentService.updateExchangeRate()
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(BusinessError.fromResponse(error));
          });
      });
    },

    sendToUser({ commit }, { senderName, receiverName, amount }) {
      return new Promise((resolve, reject) => {
        iotaPaymentService.sendToUser(senderName, receiverName, amount)
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(BusinessError.fromResponse(error));
          });
      });
    },
    withdraw({ commit }, { address, amount }) {
      return new Promise((resolve, reject) => {
        iotaPaymentService.withdraw(address, amount)
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(BusinessError.fromResponse(error));
          });
      });
    },

    deposit() {
      return new Promise((resolve, reject) => {
        iotaAddressService.deposit()
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(BusinessError.fromResponse(error));
          });
      });
    },

    getAllAddresses() {
      return new Promise((resolve, reject) => {
        iotaAddressService.getAllAddresses()
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(BusinessError.fromResponse(error));
          });
      });
    },

    getAllTransactions() {
      return new Promise((resolve, reject) => {
        iotaTransactionService.getAllTransactions()
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(BusinessError.fromResponse(error));
          });
      });
    },
    getAvailableBalance() {
      return new Promise((resolve, reject) => {
        iotaPaymentService.getAvailableBalance()
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(BusinessError.fromResponse(error));
          });
      });
    }


    /*generateNewSeed() {
      return new Promise((resolve, reject) => {
        iotaSeedService.generateNewSeed()
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(BusinessError.fromResponse(error));
          });
      });
    },
    getCurrentSeed() {
      return new Promise((resolve, reject) => {
        iotaSeedService.getCurrentSeed()
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(BusinessError.fromResponse(error));
          });
      });
    },
    setCurrentSeed({ commit }, _seed) {
      return new Promise((resolve, reject) => {
        iotaSeedService.setCurrentSeed(_seed)
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(BusinessError.fromResponse(error));
          });
      });
    },
    getArchiveSeeds() {
      return new Promise((resolve, reject) => {
        iotaSeedService.getArchiveSeeds()
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(BusinessError.fromResponse(error));
          });
      });
    }*/
  }

};
