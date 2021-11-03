<template>
    <section class="hero is-medium has-background-dark-blue" style="background-image: url(https://github.com/images/modules/site/heroes/simple-codelines.svg);">
        <div class="hero-body">
            <div class="container">
                <div class="columns is-centered">
                    <div class="column is-4 ">
                        <div class="box">
                            <div class="content has-text-centered">
                                <h2 class="title">Login</h2>
                                <p class="subtitle">Sign in to CryptShare</p>
                            </div>
                            <div class="field">
                                <label class="label">Username</label>
                                <div class="control has-icons-left">
                                    <input
                                            v-validate="{required:true, regex:'^[a-zA-Z0-9_]+$'}"
                                            v-model="userName"
                                            name="Username"
                                            type="text"
                                            class="input is-medium"
                                            placeholder="Username or E-Mail"
                                            @keyup.enter="login()">
                                    <span class="icon is-small is-left">
                                    <i class="fas fa-user"/>
                                </span>
                                </div>
                                <p v-show="submitted && errors.has('Username')"
                                   class="content has-text-danger">{{ errors.first('Username') }}
                                </p>
                            </div>
                            <div class="field">
                                <label class="label">Password</label>
                                <div class="control has-icons-left">
                                    <input
                                            v-validate="'required|min:5'"
                                            v-model="password"
                                            name="Password"
                                            type="password"
                                            class="input is-medium"
                                            placeholder="Password"
                                            @keyup.enter="login()">
                                    <span class="icon is-small is-left">
                                    <i class="fas fa-lock"/>
                                </span>
                                </div>
                                <p v-if="submitted && errors.has('Password')"
                                   class="content has-text-danger">{{ errors.first('Password') }}
                                </p>
                            </div>
                            <div class="field">
                                <div class="control">
                                    <button class="button is-primary is-fullwidth is-large"
                                            @click="login()">
                                        Sign in
                                    </button>
                                </div>
                            </div>
                            <p>No account yet?
                                <router-link to="/register">Create one</router-link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import Component from "vue-class-component";
    import Vue from "vue";
    import {Action} from "vuex-class";
    import {ErrorService} from "@/services/errors/ErrorService";

    @Component({})
    export default class LoginView extends Vue {

        @Action("login")
        private performLogin;

        userName: string = "";
        password: string = "";
        submitted: boolean = false;


        login() {
            this.submitted = true;
            this.$validator.validate().then((valid: boolean) => {
                if (valid) {
                    this.performLogin({
                        "userName": this.userName,
                        "password": this.password
                    }).then(() => {
                        this.$router.push({path: "/dashboard"});
                    }).catch((error) => {
                        this.$notify({
                            group: 'global',
                            type: 'error',
                            title: 'Login failed',
                            text: ErrorService.buildMessage(error)
                        });
                    });
                }
            });
        }

    }
</script>

<style scoped lang="scss">

</style>
