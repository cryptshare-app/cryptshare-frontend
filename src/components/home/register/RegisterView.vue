<template>
    <section class="hero is-medium is-dark-blue"
             style="background-image: url(https://github.com/images/modules/site/heroes/simple-codelines.svg);">
        <div class="hero-body">
            <div class="container">
                <div class="columns is-centered">
                    <div class="column"/>
                    <div class="column is-4 ">
                        <h1 class="title has-text-white-ter">
                            You are just on step away from being part of CryptShare!
                        </h1>
                        <h2 class="subtitle has-text-white-ter	">
                            Profit of the decentralized, scalable, fast and reliable service for your payments without even paying fees.
                        </h2>
                    </div>
                    <div class="column"/>
                    <div class="column is-4">
                        <div class="box">
                            <div class="field">
                                <label class="label">Username</label>
                                <div class="control has-icons-left">
                                    <input v-validate="{required:true, regex:'^[a-zA-Z0-9_]+$'}"
                                           v-model="userName"
                                           name="Username"
                                           maxlength="30"
                                           type="text"
                                           class="input is-medium"
                                           placeholder="Username"
                                           @keyup.enter="registerUser()">
                                    <span class="icon is-small is-left">
                                    <i class="fas fa-user"/></span>
                                </div>
                                <p v-if="submitted && errors.has('Username')"
                                   class="content has-text-danger">{{ errors.first("Username") }}
                                </p>
                            </div>
                            <div class="field">
                                <label class="label">E-Mail</label>
                                <div class="control has-icons-left">
                                    <input v-validate="'required|email'" v-model="email"
                                           name="Email"
                                           type="email"
                                           class="input is-medium"
                                           placeholder="E-Mail"
                                           @keyup.enter="registerUser()">
                                    <span class="icon is-small is-left">
                                 <i class="fas fa-envelope"/>
                                </span>
                                </div>
                                <p v-if="submitted && errors.has('Email')"
                                   class="content has-text-danger">{{ errors.first("Email") }}
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
                                            @keyup.enter="registerUser()">
                                    <span class="icon is-small is-left">
                                 <i class="fas fa-lock"/></span>
                                </div>
                                <p v-if="submitted && errors.has('Password')"
                                   class="content has-text-danger">{{ errors.first("Password") }}
                                </p>
                            </div>

                            <div class="field">
                                <div class="control">
                                    <button :class="{'is-loading':isLoading}"
                                            class="button is-fullwidth is-primary is-large" @click="registerUser()">
                                        Register
                                    </button>
                                </div>
                            </div>
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

    @Component
    export default class RegisterView extends Vue {


        @Action("register") private performRegister;

        userName: string = "";
        email: string = "";
        password: string = "";
        submitted: boolean = false;
        isLoading: boolean = false;


        registerUser() {
            this.submitted = true;
            this.$validator.validate().then(valid => {
                if (valid) {
                    this.isLoading = true;
                    this.performRegister({
                        "userName": this.userName,
                        "email": this.email,
                        "password": this.password
                    }).then(() => {
                        this.$router.push({path: "/dashboard"});
                    }).catch((error) => {
                        this.$notify({
                            group: "global",
                            type: "error",
                            title: "An error occurred during your Registration",
                            text: ErrorService.buildMessage(error)
                        });
                        this.isLoading = false;
                    });
                }
            });
        }
    }
</script>

<style lang="scss">

</style>
