<template>
    <div class="box payment-item">
        <article class="media">
            <div class="media-left">
                <p class="title">{{this.buildIotaString(payment.amount)}}</p>
                <small>{{this.formatDate(payment.updatedAt)}}</small>
            </div>
            <div class="media-content">
                <div class="content">
                    <p>
                        There is an open payment of
                        <strong>{{this.buildIotaString(payment.amount)}}</strong>
                        for you. Do you want to pay?
                    </p>
                    By confirming with the pay button you will transfer {{this.buildIotaString(payment.amount)}} to
                    {{payment.receiverUserName}}
                </div>
            </div>
            <!-- Pay button-->
            <div class="media-right">
                <a
                        v-if="!isPaid"
                        class="button is-danger"
                        :class="{'is-loading':isLoading}"
                        @click="confirmPayment"
                        :disabled="isLoading"
                >Pay now</a>
                <a v-if="isPaid" class="button is-success own-button-disabled">
                    <span class="icon is-small">
                        <i class="fas fa-check"></i>
                    </span>
                    <span>Paid</span>
                </a>
            </div>
        </article>
    </div>
</template>

<script lang="ts">
  import Component from "vue-class-component";
  import { Prop, Emit, Watch } from "vue-property-decorator";
  import Vue from "vue";
  import { Action, Getter } from "vuex-class";
  import Group from "../../../../../stores/models/groups/Group";
  import Payment from "../../../../../stores/models/Payment";
  import ExchangeService from "../../../../../services/ExchangeService";
  import TimeAgo from "javascript-time-ago";
  import en from "javascript-time-ago/locale/en";

  @Component({
    name: "payment-item"
  })
  export default class PaymentItem extends Vue {
    private isLoading: boolean = false;
    private timeAgo;

    get group() {
      return this.getGroup;
    }


    @Prop(Payment)
    private payment!: Payment;


    get currentPayment() {
      return this.payment;
    }

    @Getter("getCurrentGroup")
    private getGroup!: Group;


    @Emit("on-payment-confirm")
    private onPaymentConfirm(payment: Payment) {
      return payment;
    }

    get isPaid() {
      return this.payment.status == "CLOSED";
    }


    private created() {
      TimeAgo.addLocale(en);
      // Create relative date/time formatter.
      this.timeAgo = new TimeAgo("en-US");
    }

    public async confirmPayment() {
      this.isLoading = true;
      await this.onPaymentConfirm(this.payment);
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);


    }

    public buildIotaString(amountIota: number) {
      return ExchangeService.iotaToString(amountIota);
    }

    public formatDate(date: string) {
      return this.timeAgo.format(new Date(date));
    }
  }
</script>

<style scoped lang="scss">
    .payment-item {
        margin-top: 15px;
    }

    .own-button-disabled {
        cursor: default;
    }

    .own-button-disabled:hover {
        background-color: #23d160 !important;
    }

    .own-button-disabled:active {
        background-color: #23d160 !important;
    }
</style>