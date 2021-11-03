import Vue from "vue";
import Vuex from "vuex";
import {UserStore} from "./modules/UserStore";
import {CryptoStore} from "./modules/CryptoStore";
import {GroupStore} from "@/stores/modules/GroupStore";
import {CryptoGraphDataStore} from "@/stores/modules/CryptoGraphDataStore";
import {GlobalEventStore} from "@/stores/modules/GlobalEventStore";
import { ActionsStore } from "@/stores/modules/ActionsStore";


Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        userStore: UserStore,
        cryptoStore: CryptoStore,
        cyrptoGraphDataStore: CryptoGraphDataStore,
        groupStore: GroupStore,
        globalEventStore: GlobalEventStore,
        actionsStore: ActionsStore
    }
});