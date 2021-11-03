<template>
    <div class="container">
        <div class="panel">
            <div class="panel-heading">
                <div class="columns is-vcentered">
                    <div class="column">
                        Products
                        <span class="tag is-primary">{{group.products.length}}</span>
                    </div>
                    <div class="column">
                        <div class="field is-grouped is-pulled-right">
                            <div class="control">
                                <button class="button is-primar"
                                        @click="routeToAddProductView()">Add product
                                </button>
                            </div>
                            <div class="control">
                                <div class="select">
                                    <select @change="onChangeProductStatus">
                                        <option>{{ALL}}</option>
                                        <option>{{NOT_PAID}}</option>
                                        <option>{{PAID}}</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <ul>
            <!-- ProductListItem-->
            <transition-group name="fade" tag="div">
                <li v-for="(product, index) in filteredProducts" v-bind:key="index">
                    <ProductItem :product="product"></ProductItem>
                </li>
            </transition-group>
        </ul>
    </div>
</template>

<script lang="ts">
    import Component from "vue-class-component";
    import Vue from "vue";
    import Chart from "vue-bulma-chartjs";
    import {Action, Getter} from "vuex-class";
    import Group from "../../../../../stores/models/groups/Group";
    import Product from "../../../../../stores/models/Product";
    import ProductItem from "./ProductItem.vue";


    @Component({
        components: {Chart, ProductItem}
    })
    export default class GroupDetailProductView extends Vue {

        private PAID = "PAID";
        private NOT_PAID = "NOT PAID";
        private ALL = "ALL";
        private productStatus: string = this.ALL;


        get group() {
            return this.getGroup;
        }

        get filteredProducts() {
            const products = this.group.products;
            if (this.productStatus === this.ALL){
              return products;
            }else if(this.productStatus === this.PAID) {
                return products.filter(it => this.isFullyPaid(it));
            } else {
                return products.filter(it => !this.isFullyPaid(it));
            }

        }

        @Getter("getCurrentGroup")
        private getGroup!: Group;

        private getClosedPayments(product: Product) {
            return product.payments.filter(it => it.status === "CLOSED").length;
        }

        private isFullyPaid(product: Product) {
            return this.getClosedPayments(product) === product.payments.length;
        }


        private onChangeProductStatus(val) {
            this.productStatus = val.target.value;
        }

        routeToAddProductView() {
            this.$router.push({name: "AddProductView"})
        }
    }
</script>

<style scoped lang="scss">
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.5s;
    }

    .fade-enter,
    .fade-leave-to {
        opacity: 0;
    }
</style>
