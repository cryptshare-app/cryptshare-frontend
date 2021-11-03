/**Imports related to Routing logic */
import Vue from "vue";
import Router, {Route} from "vue-router";
import HomeView from "../components/home/HomeView.vue";
import LoginView from '../components/home/login/LoginView.vue';
import HomeContentView from '../components/home/content/HomeContentView.vue';
import RegisterView from '../components/home/register/RegisterView.vue';
import DashboardView from '../components/dashboard/DashboardView.vue';
import DashboardWelcomeView from '../components/dashboard/DashboardWelcomeView.vue';
import CryptoView from '../components/dashboard/crypto/CryptoView.vue';
import SettingsView from '../components/dashboard/settings/SettingsView.vue';
import GroupView from '../components/dashboard/groups/GroupView.vue';
import GroupDetailView from '../components/dashboard/groups/group-detail/GroupDetailView.vue';
import GroupCreationView from '../components/dashboard/groups/group-creation/GroupCreationView.vue';
import store from "@/stores";
import AuthenticationService from "@/services/auth/AuthenticationService";
import GroupDetailMemberView from '../components/dashboard/groups/group-detail/members/GroupDetailMemberView.vue';
import GroupDetailDefaultView from '../components/dashboard/groups/group-detail/general/GroupDetailDefaultView.vue';
import GroupDetailPaymentView from '../components/dashboard/groups/group-detail/payments/GroupDetailPaymentView.vue';
import GroupDetailProductView from '../components/dashboard/groups/group-detail/products/GroupDetailProductView.vue';
import AddProductView from "@/components/dashboard/groups/group-detail/products/AddProductView.vue";

/**Tell Vue to use the Router Plugin, needed for export new Router. */
Vue.use(Router);


function requireAuth(to: Route, from: Route, next: Function) {
    if (!store.getters.isAuthenticated) {
        next({
            path: '/login',
            query: {redirect: to.fullPath}
        })
    } else {
        next();
    }
}


/**New Router for handling all router in Share. */

export const router = new Router({
    mode: "history",
    routes: [
        {
            path: "/",
            component: HomeView,
            children: [
                {
                    path: "",
                    component: HomeContentView
                },
                {
                    path: "login",
                    component: LoginView
                },
                {
                    path: "register",
                    component: RegisterView
                }
            ]
        },
        {
            path: "/dashboard",
            beforeEnter: requireAuth,
            component: DashboardView,
            children: [
                {
                    path: "",
                    name: "DashboardWelcomeView",
                    component: DashboardWelcomeView
                },
                {
                    path: "crypto",
                    name: "CryptoView",
                    component: CryptoView
                },
                {
                    path: "settings",
                    name: "SettingsView",
                    component: SettingsView
                },
                {
                    path: "groups",
                    name: "GroupView",
                    component: GroupView,
                },
                {
                    path: "groups/:groupTitle",
                    component: GroupDetailView,
                    props: true,
                    children: [
                        {
                            path: "",
                            name: "GroupDetailDefaultView",
                            component: GroupDetailDefaultView
                        },
                        {
                            path: "members",
                            name: "GroupDetailMemberView",
                            component: GroupDetailMemberView
                        },

                        {
                            path: "payments",
                            name: "GroupDetailPaymentView",
                            component: GroupDetailPaymentView
                        },
                        {
                            path: "products",
                            name: "GroupDetailProductView",
                            component: GroupDetailProductView
                        },
                        {
                            path: "add_product",
                            name: "AddProductView",
                            component: AddProductView
                        }
                    ]
                },
                {
                    path: "group/new",
                    name: "GroupCreationView",
                    component: GroupCreationView,
                }

            ]
        },
        // {path: "*", redirect: "/"},
    ],
});


router.beforeEach((to, from, next) => {
    if (AuthenticationService.hasJWTokens() && !store.getters.isAuthenticated) {
        store.commit("auth_success", AuthenticationService.getJWTokens());
    }
    next();
});




