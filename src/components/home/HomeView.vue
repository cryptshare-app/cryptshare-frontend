<template>
    <div>
        <HomeViewNavbar/>
        <router-view/>
        <HomeViewFooter/>
    </div>
</template>

<script lang="ts">


    import HomeViewNavbar from './HomeViewNavbar.vue';
    import HomeViewFooter from './HomeViewFooter.vue';

    import Component from "vue-class-component";
    import Vue from 'vue';

    @Component({
        components: {HomeViewNavbar, HomeViewFooter},
    })
    export default class HomeView extends Vue {

    }
</script>

<style>

</style>
