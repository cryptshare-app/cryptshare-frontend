<template>
  <div>
    <DashboardViewNavbar :userInformation="userInformation"></DashboardViewNavbar>
    <router-view/>
  </div>
</template>
<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
import DashboardViewNavbar from "./DashboardViewNavbar.vue";
import { Action } from "vuex-class";
import UserInformation from "@/stores/models/UserInformation";
import ExchangeService from "../../services/ExchangeService";

@Component({
  components: {
    DashboardViewNavbar
  }
})
export default class DashboardView extends Vue {
  @Action("getUserInformation")
  private getUserInformation;

  private subscription;

  private userInformation: UserInformation = UserInformation.fromTemplate();

  beforeDestroy() {
    this.subscription(); //unsubscribe
  }

  buildIotaString(amountIota:number){
    return ExchangeService.iotaToString(amountIota);
  }

  async created() {
    this.userInformation = await this.getUserInformation();

    this.subscription = this.$store.subscribe((mutation, state) => {
      if (mutation.type == "heartbeat") {
        // this.$notify({
        //   group: "global",
        //   type: "info",
        //   title: "Heartbeat",
        //   text: state.globalEventStore.heartbeatEvent
        // });
      } else if (mutation.type == "transactionPending") {
        this.$notify({
          group: "global",
          type: "info",
          title: "Recognized Deposit",
          text: "Waiting now for confirmation"
        });
      } else if (mutation.type == "transactionConfirmed") {
        if(!state.globalEventStore.transactionConfirmedEvent.remainder){
          this.$notify({
            group: "global",
            type: "success",
            title: "Confirmed Transaction",
            text: "Your transaction over "+this.buildIotaString(state.globalEventStore.transactionConfirmedEvent.balance)+" got confirmed"
          });
        }
      } else if (mutation.type == "orderComplete") {
        // this.$notify({
        //   group: "global",
        //   type: "success",
        //   title: "Completed Order",
        //   text: state.globalEventStore.orderCompletedEvent
        // });
      } else if (mutation.type == "receivedPendingPayment") {
        this.$notify({
          group: "global",
          type: "success",
          title: "Received Payment",
          text:
            "From " +
            state.globalEventStore.receivedPendingPaymentEvent.transaction.senderName +
            ", Amount: " +
            this.buildIotaString(state.globalEventStore.receivedPendingPaymentEvent.transaction.amount)
        });
      }
    });
  }


}
</script>

<style lang="scss">
</style>

