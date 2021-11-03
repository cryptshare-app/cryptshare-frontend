<template>
    <nav class="navbar is-darker-blue">
        <div class="container">
            <div class="navbar-brand">
                <div class="navbar-item">
                    <router-link
                            to="/"
                            class="title">
                        <strong class="has-text-white">CryptShare</strong>
                    </router-link>
                </div>
                <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false"
                   data-target="homeViewNavbar"
                   v-bind:class="{'is-active':toggleMenu}"
                   @click="onOpenBurgerMenu">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>


            <div id="homeViewNavbar" class="navbar-menu" v-bind:class="{'is-active':toggleMenu}">

                <div class="navbar-end">
                    <div class="navbar-item">
                        <div class="field is-grouped">
                            <div class="control">
                                <router-link to="/login" class="button is-darker-blue"
                                             tag="button">
                                    Log in
                                </router-link>
                            </div>
                            <div class="control">
                                <router-link to="/register" tag="button"
                                             class="button is-outlined is-inverted is-darker-blue">
                                    Sign up
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    </nav>
</template>

<script lang="ts">
    import Vue from "vue";
    import Component from "vue-class-component";


    @Component({})
    export default class HomeViewNavbar extends Vue {

        private toggleMenu: boolean = false;

        private onOpenBurgerMenu() {
            this.toggleMenu = !this.toggleMenu;
        }


    }
</script>

<style scoped lang="scss">
    @media screen and (max-width: 1087px) {

        .navbar-menu {
            background-color: $darker-blue !important;
        }
    }

    .fade-enter, fade-leave-to {
        opacity: 0;
    }


    .fade-enter-active, fade-leave-active {
        transition: opacity 200ms ease-out;
    }
</style>