/** Imports ofr Plugins and Styles/Icons etc. */
import Vue from "vue";
import App from "./App.vue";

import store from "./stores";
import VeeValidate from "vee-validate";
import Notifications from "vue-notification";
import {router} from "./router";
import VueProgressBar from 'vue-progressbar'

/**Tell Vue what Plugins to use. */
Vue.use(VeeValidate);
Vue.use(Notifications);
const options = {
    color: '#66b5bf',
    failedColor: '#874b4b',
    thickness: '2px',
    transition: {
        speed: '0.2s',
        opacity: '0.6s',
        termination: 300
    },
    autoRevert: true,
    location: 'top',
    inverse: false,
    autoFinish: true
};

Vue.use(VueProgressBar, options);

Vue.config.productionTip = false;

/**Setup the vue app. */
export const vueSocket = new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
