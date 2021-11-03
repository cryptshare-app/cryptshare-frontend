<template>
    <div>
        <div class="box">
            <canvas id="distributeCosts"></canvas>
        </div>
        <div class="box wrapper" v-for="(membership,index) in groupMemberships" v-bind:key="index">
            <RangeSlider :priceInEuro="priceInEuro" @on-range-change="onChangeSlider($event,index,membership)" :userName="membership.userName"
                         ref="sliders">
                <div class="columns is-vcentered">
                    <div class="column"><p>{{membership.userName}} </p>
                        <div class="tags">
                            <span v-if="isCurrentUser(membership.userName)"
                                  class="tag is-primary ">It's you
                            </span>
                            <span class="tag">{{membership.userRole}}</span>
                        </div>
                    </div>
                    <div class="column ">
                        <div class="control is-pulled-right">
                             <span class="icon">
                                <i :class="[getLockClass(index) ? 'fas fa-lock':'fas fa-lock-open','range-slider-lock']"
                                   @click="toggleSlider($event,index)"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </RangeSlider>
        </div>
    </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import { Component, Emit, Prop, Watch } from "vue-property-decorator";
  import Product from "@/stores/models/Product";
  import { Getter } from "vuex-class";
  import UserInformation from "@/stores/models/UserInformation";
  import RangeSlider from "@/components/dashboard/groups/group-detail/products/RangeSlider.vue";

  // @ts-ignore
  import Chart from "chart.js";
  import GroupMembership from "@/stores/models/groups/GroupMembership";
  import Payment from "@/stores/models/Payment";
  import ExchangeService from "@/services/ExchangeService";

  @Component({
    name: "DistributeCostsComponent",
    components: { RangeSlider }
  })
  export default class DistributeCostsView extends Vue {
    /**
     * Properties
     */
    @Prop(Array)
    private groupMemberships: GroupMembership[];
    @Prop(Product)
    private newProduct: Product;
    @Prop(Number)
    private priceInEuro: number;
    @Getter("getExchangeRate")
    private exchangeRate;

    @Getter("getLatestPrice")
    private latestPrice;

    private isLocked: Boolean[] = [];

    get computedIsLocked() {
      return this.isLocked;
    }


    // data for chart
    private data = {
      labels: this.groupMemberships.map(it => it.userName),
      datasets: [{
        data: this.groupMemberships.map(it => 0),
        backgroundColor: [
          "#1fc8db",
          "#fce473",
          "#42afe3"
        ]
      }]
    };
    // options for the chart
    private options = {
      responsive: true,
      maintainAspectRatio: false,
      segmentShowStroke: false,
      aspectRatio: 1.5
    };

    private sliders: RangeSlider[] = [];
    private payments: Payment[] = [];
    private updatedProduct: Product;
    private distributeCostsChart;
    private MAX_PERCENTAGE: number = 100;


    /**
     * Getter for accessing the state
     */
    @Getter("getCurrentUser")
    private getUser!: UserInformation;

    /**
     * Emit the current value of the distribution slider
     */
    @Emit("on-distribution-value-changed")
    private onDistributionValueChanged(val: boolean) {
      return val;
    }

    @Emit("on-distribution")
    private onDistribution(updatedProduct: Product) {
      return updatedProduct;
    }


    /**
     * created lifecycle hook
     */
    private created() {
      this.payments = this.groupMemberships.filter((it: GroupMembership) => it.userName !== this.getUser.userName)
        .map(it => {
          let payment = Payment.fromTemplate();
          payment.receiverUserName = this.getUser.userName;
          payment.senderUserName = it.userName;
          return payment;
        });
    }

    /**
     * mounted lifecycle hook
     */
    private mounted() {
      this.sliders = this.$refs.sliders as RangeSlider[];
      this.isLocked = this.sliders.map(it => false);
      this.distributeCostsChart = new Chart(
        document.getElementById("distributeCosts"), {
          type: "pie",
          data: this.data,
          options: this.options
        });
    }

    /**
     * Check if the current user is also the user of the request.
     */
    private isCurrentUser(userName: string): boolean {
      return this.getUser.userName == userName;
    }

    get sumOfSliders() {
      return this.sliders.map((slider: RangeSlider) => slider.rangeValue).reduce((prev, next) => (prev) + (next));
    }

    /**
     * Change event emitted from rangesliders. Used in order to keep track of the sum of all sliders and to update the chart
     */
    private onChangeSlider(value: number, index: number, membership: GroupMembership) {

      //update sliders that are not locked
      const numberOfUnLockedSliders = this.sliders.filter((slider: RangeSlider) => !slider.isDisabled).length;
      this.sliders.map((slider: RangeSlider, currentSliderIndex: number) => {
        if (!slider.isDisabled) {
          // calculate percentage difference
          if (currentSliderIndex !== index) {
            let restPercentage = 100 - value;
            restPercentage = restPercentage / (numberOfUnLockedSliders - 1);
            slider.rangeValue = restPercentage;
          }
        }
      });

      // notifiy parent view to display an error if below or over 100 reached
      this.onDistributionValueChanged(this.sumOfSliders);

      //update all parts of the chart.

      this.distributeCostsChart.data.datasets.map((it) => {
        it.data = it.data.map((d, dataIndex) => {
          // update the other data from the other sliders
          if (dataIndex !== index) {
            if (this.sliders[dataIndex].isDisabled) {
              return d;
            }
            let restPercentage = 100 - value;
            restPercentage = restPercentage / (numberOfUnLockedSliders - 1);
            d = restPercentage;
          } else {
            // set data to the slider value because in this case the slider is the one that is dragged
            d = value;
          }

          return d;
        });
      });
      this.distributeCostsChart.update();

      //update all payments independently of the slider that was changed
    this.sliders.forEach((slider,currentSliderIndex)=>{
      let userName = slider.getUserName();
      this.payments.forEach(payment => {
        if (payment.senderUserName === userName) {
          payment.amount = parseInt(ExchangeService.eurToIota(
            this.latestPrice,
            this.exchangeRate,
            ((this.priceInEuro * this.sliders[currentSliderIndex].rangeValue) / 100).toString()
          ));
          // console.log("Amount="+payment.amount+" Username="+payment.senderUserName+" index="+index)
        }
      });
    });




      this.updatedProduct = this.newProduct;
      this.updatedProduct.payments = this.payments;
      this.onDistribution(this.updatedProduct);

    }

    /**
     * Check if the distribution is correctly and executes the callback with this function
     * @param call
     */
    public validate(call: Function) {
      call(Math.abs(this.MAX_PERCENTAGE-this.sumOfSliders) < 0.0001, this.sumOfSliders, this.priceInEuro);
    }

    /**
     * Lock the current slider
     */
    private lockSlider(event, index) {
      this.sliders[index].lockSlider();
      this.$set(this.isLocked, index, true);
    }

    unlockSlider(event, index) {
      this.sliders[index].unlockSlider();
      this.$set(this.isLocked, index, false);
    }


    toggleSlider(event, index) {
      if (this.computedIsLocked[index]) {
        this.unlockSlider(event, index);
      } else {
        this.lockSlider(event, index);
      }
    }

    getLockClass(index) {
      return this.computedIsLocked[index];
    }


  }
</script>

<style lang="scss">
    .wrapper {
        position: relative;
    }

    .range-slider-lock {
        z-index: 1001;
    }


</style>