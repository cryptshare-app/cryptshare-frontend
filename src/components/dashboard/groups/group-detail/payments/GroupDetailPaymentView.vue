<template>
    <div class="container">
        <nav class="panel">
            <div class="panel-heading">
                <div class="columns is-vcentered">
                    <div class="column">
                        Payments
                        <span class="tag is-primary">{{filteredPayments.length}}</span>
                    </div>
                    <div class="column"></div>
                    <div class="column ">
                        <div class="field is-pulled-right">
                            <div class="control">
                                <div class="select ">

                                    <select @change="onChangePaymentStatus">
                                        <option>{{ALL_PAYMENTS}}</option>
                                        <option>{{PAYMENT_STATUS_CLOSED}}</option>
                                        <option>{{PAYMENT_STATUS_OPEN}}</option>

                                    </select>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </nav>
        <ul>
            <li v-for="(payment, index) in filteredPayments" v-bind:key="index">
                <payment-item :payment="payment"
                              @on-payment-confirm="confirmPayment"></payment-item>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
    import Component from "vue-class-component";
    import Vue from "vue";

    import {Prop} from "vue-property-decorator";
    import Product from "../../../../../stores/models/Product";
    import ProductItem from "../products/ProductItem.vue";
    import {Action, Getter} from "vuex-class";
    import Group from "../../../../../stores/models/groups/Group";
    import UserInformationTO from "../../../../../services/models/UserInformationTO";
    import UserInformation from "@/stores/models/UserInformation";
    import Payment from "../../../../../stores/models/Payment";
    import PaymentItem from "./PaymentItem.vue";
    import PaymentTO from "../../../../../services/payments/types/PaymentTO";
    import {BusinessError} from "@/stores/models/BusinessError";
    import {ErrorService} from "@/services/errors/ErrorService";

    @Component({
        components: {PaymentItem}
    })
    export default class GroupDetailPaymentView extends Vue {

        private PAYMENT_STATUS_OPEN = "OPEN";
        private PAYMENT_STATUS_CLOSED = "CLOSED";
        private ALL_PAYMENTS = "ALL";
        private filterStatus = "ALL";

        @Getter("getCurrentGroup")
        private getGroup!: Group;

        @Getter("getCurrentUser")
        private getUser!: UserInformation;

        @Action("getUserInformation")
        private getUserInformation;

        @Action("performUpdatePaymentInGroup")
        private performUpdatePaymentInGroup!: Function;

        @Action("performConfirmPayment")
        private performConfirmPayment;

        get user() {
            return this.getUser;
        }

        get group() {
            return this.getGroup;
        }

        get filteredPayments(){
          if (this.filterStatus === this.ALL_PAYMENTS) {
              return this.group.payments.filter(it => this.user.id === it.senderId);
          } else {
            return this.group.payments.filter(it => {
                  return (this.user.id === it.senderId) && (it.status === this.filterStatus)
              });
          }
        }

        async mounted() {
            await this.getUserInformation();

        }

        get filterPayments() {
            return this.group.payments.filter(it => this.user.id === it.senderId);
        }

        async confirmPayment(paymentToConfirm: Payment) {
            try {
                await this.performConfirmPayment(paymentToConfirm);
            } catch (err) {
                this.$notify({
                    group: "global",
                    type: "error",
                    title: "Action failed",
                    text: ErrorService.buildMessage(err)
                });
            }

        }

        onChangePaymentStatus(val) {
          this.filterStatus = val.target.value;
        }
    }
</script>

<style scoped lang="scss">
</style>
