<template>
    <section class="section">
        <div class="container">
            <div class="columns">
                <div class="column">
                    <h3 class="title">Dashboard</h3>
                </div>
            </div>

            <div class="columns is-multiline">
                <div class="column">
                    <div class="box">
                        <div class="columns">
                            <div class="column">
                                <div class="heading">Current Balance</div>
                                <div class="title">{{buildIotaString(this.currentBalance)}}</div>
                                <div v-if="this.iotaToEuro(this.currentBalance) >= 0" class="subtitle">{{this.iotaToEuro(this.currentBalance)+"€"}}</div>
                            </div>
                            <div class="column">
                                <div class="field is-pulled-right">
                                    <input class="is-checkradio"
                                           id="checkradio1"
                                           type="radio" name="timeSpanBalanceChart"
                                           v-on:change="updateBalanceChart('day')">
                                    <label for="checkradio1">Month</label>

                                    <input class="is-checkradio" type="radio" name="timeSpanBalanceChart" checked
                                           id="checkradio2"
                                           v-on:change="updateBalanceChart('hour')">
                                    <label for="checkradio2">Day</label>

                                    <input class="is-checkradio" type="radio" name="timeSpanBalanceChart"
                                           id="checkradio3"
                                           v-on:change="updateBalanceChart('minute')">
                                    <label for="checkradio3">Hour</label>
                                </div>
                            </div>
                        </div>


                        <canvas id="balanceChart"></canvas>

                    </div>
                </div>

            </div>

            <div class="columns is-multiline">
                <div class="column is-6">
                    <div class="panel">
                        <p class="panel-heading has-text-white has-background-dark">
                            Groups
                        </p>
                        <div class="panel-block" v-if="this.groupsActions.length == 0">
                            <span>Currently no actions</span>
                        </div>
                        <div v-for="action in this.groupsActions">
                            <router-link :to="{path: action.linkTo}" class="panel-block" style="display: block;">
                                <span class="panel-icon">
                                             <i class="fas fa-cash-register"></i>
                                        </span>

                                <span>{{action.message}}</span>
                                <span class ="is-pulled-right" style="font-size: 12px; font-style: italic;">{{parseCreatedAt(action.createdAt)}}</span>
                            </router-link>
                        </div>
                    </div>
                </div>
                <div class="column is-6">
                    <div class="panel">
                        <p class="panel-heading has-text-white has-background-dark">
                            Payments
                        </p>
                        <div class="panel-block" v-if="this.paymentsActions.length == 0">
                            <span>Currently no actions</span>
                        </div>
                        <div v-for="action in this.paymentsActions">
                            <router-link :to="{path: action.linkTo}" class="panel-block" style="display: block;">
                                <span class="panel-icon">
                                             <i class="fas fa-cash-register"></i>
                                        </span>

                                <span>{{action.message}}</span>
                                <span class ="is-pulled-right" style="font-size: 12px; font-style: italic;">{{parseCreatedAt(action.createdAt)}}</span>
                            </router-link>
                        </div>
                    </div>
                </div>
                <div class="column is-6">
                    <div class="panel">
                        <p class="panel-heading has-text-white has-background-dark">
                            Revenues
                        </p>
                        <div class="panel-block" v-if="this.revenuesActions.length == 0">
                            <span>Currently no actions</span>
                        </div>
                        <div v-for="action in this.revenuesActions">
                            <router-link :to="{path: action.linkTo}" class="panel-block" style="display: block;">
                                <span class="panel-icon">
                                  <i class="fas fa-hand-holding-usd"></i>
                                </span>
                                <span>{{"You received "+buildIotaString(action.message.split(';')[1]).replace(' ','')+" from "+action.message.split(';')[0]}}</span>
                                <span class ="is-pulled-right" style="font-size: 12px; font-style: italic;">{{parseCreatedAt(action.createdAt)}}</span>
                            </router-link>
                        </div>
                    </div>
                </div>
                <div class="column is-6">
                    <div class="panel">
                        <p class="panel-heading has-text-white has-background-dark">
                            Expenses
                        </p>
                        <div class="panel-block" v-if="this.expensesActions.length == 0">
                            <span>Currently no actions</span>
                        </div>
                        <div v-for="action in this.expensesActions">
                            <router-link :to="{path: action.linkTo}" class="panel-block" style="display: block;">
                                <span class="panel-icon">
                                             <i class="fas fa-cash-register"></i>
                                        </span>

                                <span>{{"You send "+buildIotaString(action.message.split(';')[1]).replace(' ','')+" to "+action.message.split(';')[0]}}</span>
                                <span class ="is-pulled-right" style="font-size: 12px; font-style: italic;">{{parseCreatedAt(action.createdAt)}}</span>
                            </router-link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>
</template>

<script lang="ts">
  import Component from "vue-class-component";
  import Vue from "vue";
  import Chart from "chart.js";
  import TimeAgo from "javascript-time-ago";
  import en from "javascript-time-ago/locale/en";

  import { Action, Getter } from "vuex-class";
  import ExchangeService from "../../services/ExchangeService";

  @Component({
    name: "DashboardWelcomeView"
  })
  export default class DashboardWelcomeView extends Vue {

    @Action("getHourBalances")
    private performGetHourBalances;

    @Action("getMinuteBalances")
    private performGetMinuteBalances;

    @Action("getDayBalances")
    private performGetDayBalances;

    @Action("getAllActions")
    private performGetAllActions;

    @Action("getCurrentPrices")
    private performGetCurrentPrices;

    @Getter("getExchangeRate")
    private exchangeRate;

    @Getter("getLatestPrice")
    private latestPrice;

    balanceGraphLabels = [];
    balanceGraphData = [];

    currentBalance = "";
    chart;

    subscription;
    lastUpdateBalanceChartFilter = "hour";

    groupsActions = [];
    paymentsActions = [];
    revenuesActions = [];
    expensesActions = [];
    otherActios = [];

    timeAgo;

    beforeDestroy() {
      this.subscription(); //unsubscripes
    }

    mounted() {

      this.chart = new Chart(document.getElementById("balanceChart"), {
        // type: "LineWithLine",
        type: "line",
        data: this.balanceData,
        options: this.options
      });

      this.updateBalanceChart("hour");

    }

    created() {
      TimeAgo.addLocale(en);
      this.timeAgo = new TimeAgo("en-US");
      this.getAllActions();

      this.subscription = this.$store.subscribe((mutation, state) => {
        if (mutation.type == "transactionConfirmed") {
          this.updateBalanceChart(this.lastUpdateBalanceChartFilter);
        }
      });
    }

    buildIotaString(amountIota:number){
      return ExchangeService.iotaToString(amountIota);
    }

    iotaToEuro(amountIota:number){
      return ExchangeService.iotaToEur(this.latestPrice, this.exchangeRate, amountIota);
    }

    getAllActions() {
      let maxActionsPerCategory = 6;
      this.performGetAllActions().then(resp => {
        let allActions = resp.data;
        allActions.sort((a, b) => {
          return this.sortActions(a, b);
        });
        resp.data.forEach(action => {
          switch (action.category) {
            case "Group": {
              if(this.groupsActions.length < maxActionsPerCategory){
                this.groupsActions.push(action);
              }
              break;
            }
            case "Payments": {
              if(this.paymentsActions.length < maxActionsPerCategory){
                this.paymentsActions.push(action);
              }
              break;
            }
            case "Revenues": {
              if(this.revenuesActions.length < maxActionsPerCategory){
                this.revenuesActions.push(action);
              }
              break;
            }
            case "Expenses": {
              if(this.expensesActions.length < maxActionsPerCategory){
                this.expensesActions.push(action);
              }
              break;
            }
            case "Other": {
              if(this.otherActios.length < maxActionsPerCategory){
                this.otherActios.push(action);
              }
              break;
            }
          }
        });
      });
    }

    parseCreatedAt(dateTime) {

      let date = new Date(dateTime);
      return this.timeAgo.format(date);
    }

    updateBalanceChart(timeSpan) {
      this.lastUpdateBalanceChartFilter = timeSpan;

      if (timeSpan == "hour") {
        this.performGetHourBalances().then(resp => {
          while (this.balanceGraphLabels.length > 0) {
            this.balanceGraphLabels.pop();
          }
          while (this.balanceGraphData.length > 0) {
            this.balanceGraphData.pop();
          }
          for (let entry of resp.data) {
            this.balanceGraphData.push(entry.balance);
            this.balanceGraphLabels.push(entry.timestamp);
          }
          this.chart.options.scales.xAxes[0].scaleLabel.labelString = "hours ago";
          this.currentBalance = this.balanceGraphData[this.balanceGraphData.length - 1];
          this.chart.reset();
          this.chart.update();
        });
      } else if (timeSpan == "minute") {

        this.performGetMinuteBalances().then(resp => {
          while (this.balanceGraphLabels.length > 0) {
            this.balanceGraphLabels.pop();
          }
          while (this.balanceGraphData.length > 0) {
            this.balanceGraphData.pop();
          }
          for (let entry of resp.data) {
            this.balanceGraphData.push(entry.balance);
            this.balanceGraphLabels.push(entry.timestamp);
          }
          this.chart.options.scales.xAxes[0].scaleLabel.labelString = "minutes ago";
          this.currentBalance = this.balanceGraphData[this.balanceGraphData.length - 1];
          this.chart.reset();
          this.chart.update();
        });
      } else if (timeSpan == "day") {
        this.performGetDayBalances().then(resp => {
          while (this.balanceGraphLabels.length > 0) {
            this.balanceGraphLabels.pop();
          }
          while (this.balanceGraphData.length > 0) {
            this.balanceGraphData.pop();
          }
          for (let entry of resp.data) {
            this.balanceGraphData.push(entry.balance);
            this.balanceGraphLabels.push(entry.timestamp);
          }
          this.chart.options.scales.xAxes[0].scaleLabel.labelString = "days ago";
          this.currentBalance = this.balanceGraphData[this.balanceGraphData.length - 1];
          this.chart.reset();
          this.chart.update();
        });
      }
    }

    sortActions(a, b) {
      if (a.createdAt > b.createdAt) {
        return -1;
      }

      if (a.createdAt < b.createdAt) {
        return 1;
      }

      return 0;
    }


    balanceData: any = {
      labels: this.balanceGraphLabels,
      datasets: [{
        label: "IOTA",
        data: this.balanceGraphData,
        backgroundColor: "rgb(255,56,96)",
        borderColor: [
          "#f44336"
        ],
        pointHoverBackgroundColor: [
          "#f44336"
        ],
        pointHoverBorderColor: [
          "#f44336"
        ],
        pointStyle: "circle",
        lineTension: 0,
        pointRadius: 0,
        fill: false
      }]
    };

    options: any = {
      responsive: true,
      fill: false,
      legend: {
        display: false
      },
      aspectRatio: 5,
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: "IOTA"
          },
          ticks: {
            beginAtZero: true
          }
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: ""
          }
        }]
      }
    };

  }
</script>

<style lang="scss">
    canvas.chartjs {
        width: 100%;
    }

</style>
