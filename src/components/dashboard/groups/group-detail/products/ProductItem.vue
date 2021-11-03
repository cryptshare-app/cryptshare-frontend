<template>
    <div class="box product-item">
        <article class="media">
            <figure class="media-left">
                <p class="image is-64x64">
                    <img :src="product.imageUrl">
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <div class="columns is-vcentered">
                        <div class="column is-4">
                            <p>
                                <strong>{{product.productName}}</strong>
                                <small>@{{productCreator.userName}}</small>
                            </p>
                            <p>{{product.productDescription}}</p>
                            <nav class="level is-mobile">
                                <div class="level-left">
                                    <div class="level-item has-text-centered">
                                        <div>
                                            <p class="title">{{this.buildIotaString(product.price)}}</p>
                                        </div>
                                    </div>
                                </div>
                            </nav>
                        </div>
                        <div class="column is-6">
                            <div class="has-text-centered tooltip" :data-tooltip="getMissingUsers">
                                <small>{{closedPayments.length+1}}/{{payments.length+1}} Paid</small>
                            </div>
                            <progress
                                    class="progress is-primary"
                                    :value="closedPayments.length+1"
                                    :max="payments.length+1"
                            ></progress>
                        </div>
                        <div class="column is-2"></div>
                    </div>
                </div>
            </div>
        </article>
    </div>
</template>


<script lang="ts">
    import Component from "vue-class-component";
    import Vue from "vue";
    import {Emit, Prop} from "vue-property-decorator";
    import Product from "../../../../../stores/models/Product";
    import UserInformation from "../../../../../stores/models/UserInformation";
    import {Action, Getter} from "vuex-class";
    import ExchangeService from "../../../../../services/ExchangeService";
    import {ErrorService} from "@/services/errors/ErrorService";

    @Component({})
    export default class ProductItem extends Vue {
        private productCreator: UserInformation = UserInformation.fromTemplate();
        private listOfMissingUsers: string = "";

        get user() {
            return this.currentUser;
        }

        get isOwner() {
            return this.user.id === this.productCreator.id;
        }

        get closedPayments() {
            return this.product.payments.filter(it => it.status === "CLOSED");
        }

        get payments() {
            return this.product.payments;
        }

        get getMissingUsers() {
          this.listOfMissingUsers = "";
            this.payments.forEach(payment => {
                if (payment.status === "OPEN") {
                    this.listOfMissingUsers += payment.senderUserName + " is missing \n";
                }
            });
            if(this.listOfMissingUsers.length == 0){
              return null;
            }
            return this.listOfMissingUsers
        }


        @Prop(Product)
        private product!: Product;


        @Action("performGetUserInformationById")
        private performGetUserInformationById!: Function;

        @Action("performDeleteProduct")
        private performDeleteProduct!: Function;

        @Action("performRemoveProductsInGroup")
        private performRemoveProductsInGroup!: Function;

        @Getter("getCurrentUser")
        private currentUser!: UserInformation;

        async created() {
            try {
                this.productCreator = await this.performGetUserInformationById(this.product.creatorId);

            } catch (err) {
                this.$notify({
                    group: "global",
                    type: "error",
                    title: "Action failed",
                    text: ErrorService.buildMessage(err)
                });
            }
        }

        buildIotaString(amountIota: number) {
            return ExchangeService.iotaToString(amountIota);
        }

    }
</script>

<style scoped lang="scss">
    .product-item {
        margin-top: 15px;
    }
</style>

