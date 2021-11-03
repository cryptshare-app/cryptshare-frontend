import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const GlobalEventStore = {

  state: {
    heartbeatEvent: {},
    transactionPendingEvent: {},
    transactionConfirmedEvent: {},
    orderCompletedEvent: {},
    receivedPendingPaymentEvent: {},
    latestPrice: 0,
    exchangeRateUSDEUR: 0,
    availableBalance: 0,
    serverStatus: "",
    groupChangedId: "",
    newGroupInvitationTitle:""
  },
  mutations: {
    heartbeat(state, payload) {
      state.heartbeatEvent = payload;
    },
    transactionPending(state, payload) {
      state.transactionPendingEvent = payload;
    },
    transactionConfirmed(state, payload) {
      state.transactionConfirmedEvent = payload;
    },
    orderComplete(state, payload) {
      state.orderCompletedEvent = payload;
    },
    receivedPendingPayment(state, payload) {
      state.receivedPendingPaymentEvent = payload;
    },
    priceUpdate(state, payload) {
      state.latestPrice = payload;
    },
    exchangeRateUpdate(state, payload) {
      state.exchangeRateUSDEUR = payload;
    },
    updateAvailableBalance(state, payload) {
      state.availableBalance = payload;
    },
    updateServerStatus(state, payload) {
      state.serverStatus = payload;
    },
    groupChanged(state, payload) {
      state.groupChangedId = payload;
    },
    newGroupInvitation(state, payload) {
      state.newGroupInvitationTitle = payload;
    }
  },
  actions: {

    heartbeat({ commit }, payload) {
      commit("heartbeat", payload);
    },
    transactionPending({ commit }, payload) {
      commit("transactionPending", payload);
    },
    transactionConfirmed({ commit }, payload) {
      commit("transactionConfirmed", payload);
    },
    orderComplete({ commit }, payload) {
      commit("orderComplete", payload);
    },
    receivedPendingPayment({ commit }, payload) {
      commit("receivedPendingPayment", payload);
    },
    priceUpdate({ commit }, payload) {
      commit("priceUpdate", payload);
    },
    exchangeRateUpdate({ commit }, payload) {
      commit("exchangeRateUpdate", payload);
    },
    updateAvailableBalance({ commit }, payload) {
      commit("updateAvailableBalance", payload);
    },
    updateServerStatus({ commit }, payload) {
      commit("updateServerStatus", payload);
    },
    groupChanged({ commit }, payload) {
      commit("groupChanged", payload);
    },
    newGroupInvitation({ commit }, payload) {
      commit("newGroupInvitation", payload);
    }

  },
  getters: {
    getExchangeRate: (state) => {
      return state.exchangeRateUSDEUR;
    },
    getLatestPrice: (state) => {
      return state.latestPrice;
    }
  }
};
