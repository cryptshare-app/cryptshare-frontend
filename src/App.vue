<template>
    <div id="app">
        <router-view/>
        <notifications group="global" classes="own_notification"/>
        <vue-progress-bar></vue-progress-bar>
    </div>

</template>


<script lang="ts">

    import Vue from "vue";
    import {Component} from "vue-property-decorator";

    @Component({})
    export default class App extends Vue {


        mounted() {
            this.$Progress.finish()
        }

        created() {
            console.log(this.$Progress);
            this.$Progress.start();
            //  hook the progress bar to start before we move router-view
            this.$router.beforeEach((to, from, next) => {
                //  does the page we want to go to have a meta.progress object
                if (to.meta.progress !== undefined) {
                    let meta = to.meta.progress
                    // parse meta tags
                    this.$Progress.parseMeta(meta)
                }
                //  start the progress bar
                this.$Progress.start()
                //  continue to next page
                next()
            });
            //  hook the progress bar to finish after we've finished moving router-view
            this.$router.afterEach((to, from) => {
                //  finish the progress bar
                this.$Progress.finish()
            })
        }
    }

</script>

<style lang="scss">
    @import url('https://use.fontawesome.com/releases/v5.7.2/css/all.css');

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
    }

    #nav {
        padding: 30px;

        a {
            font-weight: bold;
            color: #2c3e50;

            &.router-link-exact-active {
                color: #42b983;
            }
        }
    }
</style>
