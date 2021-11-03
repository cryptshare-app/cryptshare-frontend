import Vue from "vue";
import Vuex from "vuex";
import { BusinessError } from "@/stores/models/BusinessError";
import ActionsService from "@/services/actions/ActionsService";

Vue.use(Vuex);

const actionsService = new ActionsService();
export const ActionsStore = {
  actions: {
    getAllActions() {
      return new Promise((resolve, reject) => {
        actionsService.getAllActions()
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(BusinessError.fromResponse(error));
          });
      });
    }
  }
};
