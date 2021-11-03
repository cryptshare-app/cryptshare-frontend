<template>
    <div>
        <section class="hero is-medium has-background-dark-blue" style="background-image: url(https://github.com/images/modules/site/heroes/simple-codelines.svg);">
            <div class="hero-body">
                <div class="container has-text-centered">
                    <h1 class="title has-text-white-ter">
                        Get ready to track and pay your shared bills with IOTA
                    </h1>
                    <h2 class="subtitle has-text-white-ter">
                        CryptShare offers a way to pay with the cryptocurrency IOTA which is build on a Directed Acyclic Graph (DAG)
                        to offer faster confirmation times and far better scalability than traditional blockchains.
                        Additionally you do not have to pay any fees for this service since all members participate in making IOTA reliable and stable which
                        makes it perfectly suitable for automatic payment of even small amounts.
                    </h2>
                </div>
            </div>
        </section>
        <section class="section container">
            <div class="columns">
                <div class="column is-4">
                    <div class="subtitle has-text-centered">
                        <i class="fas fa-wallet fa-6x has-text-background"/>
                    </div>
                    <div class="content">
                        <div class="has-text-centered">
                            <h4>IOTA Wallet</h4>
                        </div>
                        <p>Once you created an account we will provide you with your own IOTA Wallet. It is a place
                        where all your revenues come in and expenses go out from. We abstracted the cryptographic complexities behind the DAG for your convenience
                        so you can simply just get right to using it.</p>
                        <p><a href="#">Learn more</a></p>
                    </div>


                </div>
                <div class="column is-4">
                    <div class="subtitle has-text-centered">
                        <i class="fas fa-chart-line fa-6x has-text-background"/>
                    </div>

                    <div class="content">
                        <div class="has-text-centered">
                            <h4>Manage Transactions</h4>
                        </div>

                        <p>You will be able to see the whole history of every transaction you have ever made including the receiver, amount and many more
                        info that will help you manage your transactions correctly. Also we have included some graphical assistance to better track your
                        activities over different intervals.</p>
                        <p><a href="#">Learn more</a></p>

                    </div>
                </div>
                <div class="column is-4">
                    <div class="subtitle has-text-centered">
                        <i class="fas fa-layer-group fa-6x has-text-background"/>
                    </div>

                    <div class="content">
                        <div class="has-text-centered">
                            <h4>Create Groups</h4>
                        </div>

                        <p>The other main concept behind CryptShare revolves around groups. They offer a way to interact with other users of this platform.
                        Once created, you as an admin will be able to invite new members, create products, view and manage your payments or even change settings so you will
                        automatically pay in a specific group.</p>
                        <p><a href="#">Learn more</a></p>
                    </div>

                </div>
            </div>
        </section>
    </div>

</template>

<script lang="ts">

    import Component from "vue-class-component";
    import Vue from "vue";

    @Component({})
    export default class HomeContentView extends Vue {


    }
</script>

<style></style>
