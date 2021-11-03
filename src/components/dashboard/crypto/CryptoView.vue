<template>
    <section>

        <div class="hero has-background-dark-blue is-bold has-tech-image2">
            <div class="hero-body min-background ">
                <div class="container">
                    <!--<i class="fas fa-layer-group fa-6x "/>-->
                    <div class="columns">
                        <div class="column">
                            <h1 class="title has-text-white-ter">Wallet</h1>
                            <h2 class="subtitle has-text-white-ter">Send and deposit your IOTA</h2>
                            <div class="column" v-if="this.neverUsedIota == 2">
                                <button @click="wantsToSendToUser = !wantsToSendToUser; wantsToWithdraw = false;"
                                        style="margin-right:1em;"
                                        class="button is-outlined is-inverted is-darker-blue"
                                >Send
                                </button>
                                <button @click="deposit(); wantsToSendToUser = false; wantsToWithdraw = false;"
                                        class="button is-outlined is-inverted is-darker-blue"
                                        style="margin-right:1em;">Deposit
                                </button>
                                <button @click="wantsToWithdraw = !wantsToWithdraw; wantsToSendToUser = false;"
                                        class="button is-outlined is-inverted is-darker-blue">Withdraw
                                </button>

                            </div>


                        </div>
                        <!-- View if never used iota to tell to transfert IOTA to the provided address -->
                        <div class="column is-8" v-if="this.neverUsedIota == 1">
                            <div class="box has-background-primary has-text-centered has-text-weight-semibold">

                                <h4 class="title is-4">To get started, please transfer your IOTA to this
                                    address</h4>

                                <p @click="copyAddress(transactions[0].receiverAddress)"
                                   style="cursor: pointer;"> {{chunk(transactions[0].receiverAddress,3)}}</p>
                            </div>
                        </div>

                        <!-- View that shows the address for the deposit if any-->
                        <div class="column is-8" v-if="openDepositsPresent && !wantsToWithdraw && ! wantsToSendToUser">
                            <div class="box has-background-primary has-text-centered has-text-weight-semibold">
                                <h4 class="title is-4">You can deposit your IOTA to this address</h4>
                                <p @click="copyAddress(openDepositsAddress)"
                                   style="cursor: pointer;"> {{chunk(openDepositsAddress,3)}}</p>
                            </div>
                        </div>


                        <!-- WITHDRAW -->
                        <div class="column is-8" v-show="wantsToWithdraw">
                            <div class="box has-text-centered has-shadow"
                                 style="background-color: #32383e; /*clip-path: polygon(100% 0, 100% 100%, 77% 100%, 69% 70%, 0 70%, 0 0);*/">

                                <h4 class="title has-text-weight-normal is-size-5 has-text-white">Please enter an
                                    address and amount for withdrawing</h4>

                                <div class="field">
                                    <div class="columns">
                                        <div class=" column is-8">
                                            <input class="input"
                                                   type="text"
                                                   placeholder="Address"
                                                   v-model="withdrawAddress"
                                                   data-vv-scope="withdraw"
                                                   v-validate="'required|regex:[A-Z9]{90}'"
                                                   name="address">
                                            <span class="has-text-danger is-size-6">{{ errors.first("withdraw.address") }}</span>
                                        </div>

                                        <div class=" column is-4">
                                            <input class="input"
                                                   type="number"
                                                   placeholder="Amount"
                                                   v-model="withdrawAmount"
                                                   data-vv-scope="withdraw"
                                                   v-validate="'required|min_value:1'"
                                                   name="amount">
                                            <span class="has-text-danger is-size-6">{{ errors.first("withdraw.amount") }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="columns">
                                    <div class="column">
                                        <div class="field is-grouped is-pulled-right">
                                            <div class="control">
                                                <button @click="wantsToWithdraw = false"
                                                        class="button is-danger is-outlined">
                                                    Cancel
                                                </button>
                                            </div>
                                            <div class="control">
                                                <button @click="doWithdraw()" class="button is-primary is-outlined">
                                                    Send
                                                </button>
                                            </div>


                                        </div>
                                    </div>

                                </div>


                            </div>

                        </div>

                        <!-- SEND TO USER -->
                        <div class="column is-8" v-show="wantsToSendToUser">
                            <div class="box has-text-centered has-shadow"
                                 style="background-color: #32383e; /*clip-path: polygon(100% 0, 100% 100%, 77% 100%, 69% 70%, 0 70%, 0 0);*/">

                                <h4 class="title has-text-weight-normal is-size-5 has-text-white">Please enter a
                                    username and amount for sending to a user</h4>

                                <div class="field">
                                    <div class="columns">
                                        <div class="column is-8">

                                            <UserSearchInput ref="userSearchInput"
                                                             :validation="true"
                                                             :scope="'sendToUser'"
                                                             :name="'username'"
                                                             :placeholder="'Username'"
                                                             @update="onSelectionChanged"></UserSearchInput>
                                            <span class="has-text-danger is-size-6">{{ errors.first("sendToUser.username") }}</span>
                                        </div>
                                        <div class="column is-4">
                                            <input
                                                    class="input"
                                                    type="number"
                                                    placeholder="Amount"
                                                    v-model="sendToUserAmount"
                                                    name="amount"
                                                    data-vv-scope="sendToUser"
                                                    v-validate="'required|min_value:1'"
                                            >
                                            <span class="has-text-danger is-size-6">{{ errors.first("sendToUser.amount") }}</span>
                                        </div>
                                    </div>
                                </div>


                                <div class="columns">
                                    <div class="column">
                                        <div class="field is-grouped is-pulled-right">
                                            <div class="control">
                                                <button
                                                        @click="wantsToSendToUser = false"
                                                        class="button is-danger is-outlined "

                                                >Cancel
                                                </button>
                                            </div>
                                            <div class="control">
                                                <button @click="doSendToUser()" class="button is-primary is-outlined">
                                                    Send
                                                </button>
                                            </div>


                                        </div>
                                    </div>

                                </div>


                            </div>

                        </div>


                    </div>

                    <!-- AREA FOR SEND TO USER AND WITHDRAW -->

                    <div class="columns">
                        <div class="column is-4"></div>

                    </div>

                </div>
            </div>
        </div>

        <div class="container" style="padding-top: 3em !important;">

            <!-- Headlines Revenues and Expenses-->
            <div class="columns">
                <div class="column">
                    <div class="box">
                        <div class="columns">
                            <div class="column">
                                <h4 class="title">Revenues And Expenses</h4>
                            </div>
                            <div class="column ">
                                <div class="field is-pulled-right">
                                    <input id="chartDay" class="is-checkradio" type="radio" name="timeSpanBalanceChart"
                                           v-on:change="updateRevenuesAndExpensesChart('day')">
                                    <label for="chartDay">Month</label>
                                    <input id="chartHour" class="is-checkradio" type="radio" name="timeSpanBalanceChart"
                                           checked
                                           v-on:change="updateRevenuesAndExpensesChart('hour')">
                                    <label for="chartHour">Day</label>
                                    <input id="chartMinute" class="is-checkradio" type="radio"
                                           name="timeSpanBalanceChart"
                                           v-on:change="updateRevenuesAndExpensesChart('minute')">
                                    <label for="chartMinute">Hour</label>
                                </div>
                            </div>
                        </div>
                        <canvas id="revenuesAndExpensesChart"></canvas>
                    </div>
                </div>
            </div>

            <!-- Addresses and Transactions Cards-->
            <div class="columns">
                <div class="column has-text-centered">
                    <div class="box">
                        <h4 class="title">Addresses</h4>
                        <div class="field">
                            <input
                                    id="addressFilter1"
                                    class="is-checkradio"
                                    type="radio"
                                    name="filterAddr"
                                    checked
                                    v-on:change="filterAddressesChanged('all')"
                            >
                            <label for="addressFilter1">All</label>
                            <input
                                    id="addressFilter2"
                                    class="is-checkradio"
                                    type="radio"
                                    name="filterAddr"
                                    v-on:change="filterAddressesChanged('balance')"
                            >
                            <label for="addressFilter2">With Balance</label>
                        </div>

                        <table class="table is-narrow is-fullwidth is-hoverable is-striped">
                            <thead>
                            <tr>
                                <th class="has-text-centered">Index</th>
                                <th class="has-text-centered">Address</th>
                                <th class="has-text-centered">Balance</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="addr in addresses">
                                <th class="has-text-centered" v-if="!addr.filtered">{{addr.index}}</th>
                                <th
                                        class="has-text-justified"
                                        v-if="!addr.filtered"
                                        @click="copyAddress(addr.address)"
                                        style="cursor: pointer;"
                                >{{addr.address}}
                                </th>
                                <th class="has-text-centered" v-if="!addr.filtered">{{addr.balance}}</th>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="column has-text-centered">
                    <div class="box">
                        <h4 class="title">Transactions</h4>

                        <div class="field">
                            <input
                                    id="transactionFilter1"
                                    class="is-checkradio"
                                    type="radio"
                                    name="filterTx"
                                    checked
                                    v-on:change="filterTransactionsChanged('all')"
                            >
                            <label for="transactionFilter1">All</label>
                            <input
                                    id="transactionFilter7"
                                    class="is-checkradio"
                                    type="radio"
                                    name="filterTx"
                                    v-on:change="filterTransactionsChanged('receiver')"
                            >
                            <label for="transactionFilter7">In</label>
                            <input
                                    id="transactionFilter8"
                                    class="is-checkradio"
                                    type="radio"
                                    name="filterTx"
                                    v-on:change="filterTransactionsChanged('sender')"
                            >
                            <label for="transactionFilter8">Out</label>
                            <!--<input id="transactionFilter2" class="is-checkradio" type="radio" name="filterTx" v-on:change="filterTransactionsChanged('intern')">
                                          <label for="transactionFilter2">Intern</label>
                                          <input id="transactionFilter3" class="is-checkradio" type="radio" name="filterTx" v-on:change="filterTransactionsChanged('extern')">
                            <label for="transactionFilter3">Extern</label>-->
                            <input
                                    id="transactionFilter4"
                                    class="is-checkradio"
                                    type="radio"
                                    name="filterTx"
                                    v-on:change="filterTransactionsChanged('confirmed')"
                            >
                            <label for="transactionFilter4">Confirmed</label>
                            <input
                                    id="transactionFilter5"
                                    class="is-checkradio"
                                    type="radio"
                                    name="filterTx"
                                    v-on:change="filterTransactionsChanged('pending')"
                            >
                            <label for="transactionFilter5">Pending</label>
                            <input
                                    id="transactionFilter6"
                                    class="is-checkradio"
                                    type="radio"
                                    name="filterTx"
                                    v-on:change="filterTransactionsChanged('waiting')"
                            >
                            <label for="transactionFilter6">Waiting</label>
                        </div>

                        <table class="table is-narrow is-fullwidth is-hoverable is-striped">
                            <thead>
                            <tr>
                                <th class="has-text-centered">Status</th>
                                <th class="has-text-centered">Amount</th>
                                <th class="has-text-centered">Sender</th>
                                <th class="has-text-centered">Receiver</th>
                                <th class="has-text-centered">Group</th>
                                <th class="has-text-centered">Address Index</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="transaction in transactions">
                                <th
                                        class="has-text-centered"
                                        v-if="transaction.status == 0 && !transaction.filtered"
                                >
                                    <i class="far fa-clock" style="font-size: 22px;"></i>
                                </th>
                                <th
                                        class="has-text-centered"
                                        v-if="transaction.status == 1 && !transaction.filtered"
                                >
                                    <i class="fas fa-check-circle" style="font-size: 22px;"></i>
                                </th>
                                <th
                                        class="has-text-centered"
                                        v-if="transaction.status == 2 && !transaction.filtered"
                                >
                                    <i class="far fa-hourglass" style="font-size: 22px;"></i>
                                </th>
                                <th class="has-text-centered" v-if="!transaction.filtered">{{transaction.amount}}</th>
                                <th
                                        class="has-text-centered"
                                        v-if="!transaction.filtered"
                                >{{transaction.senderName}}
                                </th>
                                <th
                                        class="has-text-centered"
                                        v-if="!transaction.filtered"
                                >{{transaction.receiverName}}
                                </th>
                                <th
                                        class="has-text-centered"
                                        v-if="!transaction.filtered"
                                >{{transaction.groupTitle}}
                                </th>
                                <th
                                        v-if="transaction.index >= 0 && !transaction.filtered && transaction.receiverName == userInformation.userName"
                                        class="has-text-centered"
                                >{{transaction.index}}
                                </th>
                                <th
                                        v-if="!transaction.filtered && (transaction.index === -1 || transaction.receiverName != userInformation.userName)"
                                        class="has-text-centered"
                                >/
                                </th>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
  import Component from "vue-class-component";
  import Vue from "vue";
  import { Action, Getter } from "vuex-class";
  import Chart from "chart.js";
  import UserInformation from "../../../stores/models/UserInformation";
  import { ErrorService } from "@/services/errors/ErrorService";
  import UserSearchInput from "@/components/dashboard/groups/group-detail/members/UserSearchInput.vue";

  @Component({
    components: { UserSearchInput }
  })
  export default class CryptoView extends Vue {
    addresses: Array<any> = [];
    transactions: Array<any> = [];
    neverUsedIota: number = 0; //0 indicates not loaded yet, 1 is true and 2 false
    openDepositsPresent: boolean = false;
    openDepositsAddress: string = "";
    wantsToWithdraw: boolean = false;
    wantsToSendToUser: boolean = false;
    sendToUserAmount: number = 0;
    sendToUserName: string = "";
    withdrawAddress: string = "";
    withdrawAmount: number = 0;
    latestAddressFilter: string = "all";
    latestTransactionsFilter: string = "all";

    revenuesAndExpensesChart;
    lastUpdateChartFilter = "hour";

    revenuesAndExpensesGraphLabels = [];
    revenuesAndExpensesGraphData = { expenses: [], revenues: [] };

    subscription: any;

    @Action("getAllAddresses")
    private performGetAllAddresses;

    @Action("getAllTransactions")
    private performGetAllTransactions;

    @Action("deposit")
    private performDeposit;

    @Action("withdraw")
    private performWithdraw;

    @Action("sendToUser")
    private performSendToUser;

    @Getter("getConfirmedEvents")
    private performGetConfirmedEvents;

    @Action("getMinuteRevenuesAndExpenses")
    private performGetMinuteRevenuesAndExpenses;

    @Action("getHourRevenuesAndExpenses")
    private performGetHourRevenuesAndExpenses;

    @Action("getDayRevenuesAndExpenses")
    private performGetDayRevenuesAndExpenses;

    @Action("getUserInformation")
    private performGetUserInformation;

    private userInformation: UserInformation = UserInformation.fromTemplate();

    beforeDestroy() {
      this.subscription(); //unsubscripes
    }

    mounted() {
      this.revenuesAndExpensesChart = new Chart(
        document.getElementById("revenuesAndExpensesChart"),
        {
          type: "bar",
          data: this.revenuesAndExpensesData,
          options: this.options
        }
      );
      this.updateRevenuesAndExpensesChart("hour");
    }


    onSelectionChanged(val: string) {
      this.sendToUserName = val;
    }

    async created() {
      this.userInformation = await this.performGetUserInformation();
      this.getAllAddresses();
      this.getAllTransactions();
      this.subscription = this.$store.subscribe((mutation, state) => {
        if (mutation.type == "transactionPending") {
          for (let tx of this.transactions) {
            if (
              tx.receiverAddress == state.globalEventStore.transactionPendingEvent
            ) {
              tx.status = 0; //pending
              this.checkAndHandleOpenDeposits();
              this.$forceUpdate();
            }
          }
        } else if (mutation.type == "transactionConfirmed") {
          for (let tx of this.transactions) {
            if (
              tx.receiverAddress ==
              state.globalEventStore.transactionConfirmedEvent.address
            ) {
              tx.status = 1; //confirmed
              tx.amount =
                state.globalEventStore.transactionConfirmedEvent.balance;
              for (let addr of this.addresses) {
                if (
                  addr.address.replace(/\s/g, "") ==
                  state.globalEventStore.transactionConfirmedEvent.address
                ) {
                  addr.balance =
                    state.globalEventStore.transactionConfirmedEvent.balance;
                }
              }
              this.checkAndHandleOpenDeposits();
              this.updateRevenuesAndExpensesChart(this.lastUpdateChartFilter);
              this.$forceUpdate();
            }
          }
        }
      });
    }

    copyAddress(addr) {
      let item = addr.replace(/\s/g, "");
      document.addEventListener("copy", (e: ClipboardEvent) => {
        e.clipboardData.setData("text/plain", item);
        e.preventDefault();
        document.removeEventListener("copy", null);
      });
      document.execCommand("copy");
      this.$notify({
        group: "global",
        type: "success",
        title: "Copied",
        text: "Copied the address to clipboard"
      });
    }

    getAllAddresses() {
      this.performGetAllAddresses()
        .then(addresses => {
          this.addresses = addresses.data;
          this.addresses.sort((a, b) => {
            return this.sortAddresses(a, b);
          });
          this.addresses.forEach(address => {
            address.address = this.chunk(address.address, 3);
          });
        })
        .catch(error => {
          this.$notify({
            group: "global",
            type: "error",
            title: "An error occurred during address retrieval",
            text: ErrorService.buildMessage(error)
          })
          ;
        });
    }

    getAllTransactions() {
      this.performGetAllTransactions()
        .then(transactions => {
          this.transactions = transactions.data;
          this.checkAndHandleOpenDeposits();

          this.transactions.sort((a, b) => {
            return this.sortTransactions(a, b);
          });
        })
        .catch(error => {
          this.$notify({
            group: "global",
            type: "error",
            title: "An error occurred during transactions retrieval",
            text: ErrorService.buildMessage(error)
          });
        });
    }

    doWithdraw() {
      this.$validator.validateAll("withdraw").then((valid: boolean) => {
        if (valid) {
          this.wantsToWithdraw = false;
          this.performWithdraw({
            address: this.withdrawAddress,
            amount: this.withdrawAmount
          })
            .then(withdrawTO => {
              this.$notify({
                group: "global",
                type: "success",
                title: "Order sent",
                text: "Your order has been committed!"
              });
              for (
                let i = 0;
                i < withdrawTO.data.createdTransactions.length;
                i++
              ) {
                this.transactions.push(withdrawTO.data.createdTransactions[i]);
                //if remainder then also create address
                if (withdrawTO.data.createdTransactions[i].remainder) {
                  this.addresses.push({
                    index: withdrawTO.data.createdTransactions[i].index,
                    address: this.chunk(
                      withdrawTO.data.createdTransactions[i].receiverAddress,
                      3
                    ),
                    balance: 0
                  });
                  this.addresses.sort((a, b) => {
                    return this.sortAddresses(a, b);
                  });
                }
              }
              this.transactions.sort((a, b) => {
                return this.sortTransactions(a, b);
              });

              for (let i = 0; i < withdrawTO.data.usedAddresses.length; i++) {
                for (let addr of this.addresses) {
                  if (addr.index == withdrawTO.data.usedAddresses[i].index) {
                    addr.balance = 0;
                  }
                }
              }

              this.filterAddressesChanged(this.latestAddressFilter);
              this.filterTransactionsChanged(this.latestTransactionsFilter);
            })
            .catch(error => {
              this.$notify({
                group: "global",
                type: "error",
                title: "Not enough balance",
                text: ErrorService.buildMessage(error)
              });
            });
        } else {
          console.log(valid);
        }
      });
    }

    doSendToUser() {
      this.$validator.validateAll("sendToUser").then((valid: boolean) => {
        if (valid) {
          this.wantsToSendToUser = false;
          this.performSendToUser({
            senderName: this.userInformation.userName,
            receiverName: this.sendToUserName,
            amount: this.sendToUserAmount
          })
            .then(withdrawTO => {
              this.$notify({
                group: "global",
                type: "success",
                title: "Order sent",
                text: "Your order has been committed!"
              });
              for (let i = 0; i < withdrawTO.data.createdTransactions.length; i++) {
                this.transactions.push(withdrawTO.data.createdTransactions[i]);
                //if remainder then also create address
                if (withdrawTO.data.createdTransactions[i].remainder) {
                  this.addresses.push({
                    index: withdrawTO.data.createdTransactions[i].index,
                    address: this.chunk(
                      withdrawTO.data.createdTransactions[i].receiverAddress,
                      3
                    ),
                    balance: 0
                  });
                  this.addresses.sort((a, b) => {
                    return this.sortAddresses(a, b);
                  });
                }
              }
              this.transactions.sort((a, b) => {
                return this.sortTransactions(a, b);
              });

              for (let i = 0; i < withdrawTO.data.usedAddresses.length; i++) {
                for (let addr of this.addresses) {
                  if (addr.index == withdrawTO.data.usedAddresses[i].index) {
                    addr.balance = 0;
                  }
                }
              }
              this.filterAddressesChanged(this.latestAddressFilter);
              this.filterTransactionsChanged(this.latestTransactionsFilter);
            })
            .catch(error => {
              this.$notify({
                group: "global",
                type: "error",
                title: "Failed sending to user",
                text: ErrorService.buildMessage(error)
              });
            });
        } else {
          console.log(valid);
        }
      });
    }

    deposit() {
      if (this.openDepositsPresent) {
        this.$notify({
          group: "global",
          type: "info",
          title: "Already deposit open",
          text: "It is only allowed to have one open deposit at a time"
        });
      } else {
        this.performDeposit()
          .then(transaction => {
            this.transactions.push(transaction.data);

            this.addresses.push({
              index: transaction.data.index,
              address: this.chunk(transaction.data.receiverAddress, 3),
              balance: 0
            });
            this.transactions.sort((a, b) => {
              return this.sortTransactions(a, b);
            });
            this.addresses.sort((a, b) => {
              return this.sortAddresses(a, b);
            });
            this.checkAndHandleOpenDeposits();
          })
          .catch(error => {
            this.$notify({
              group: "global",
              type: "error",
              title: "An error occurred during deposit creation",
              text: ErrorService.buildMessage(error)
            });
          });
      }
    }

    checkAndHandleOpenDeposits() {
      this.filterAddressesChanged(this.latestAddressFilter);
      this.filterTransactionsChanged(this.latestTransactionsFilter);
      for (let i = 0; i < this.transactions.length; i++) {
        this.neverUsedIota = 2;
        //Check for never used iota and get receiver name
        if (this.transactions[i].index == 0 && this.transactions[i].status == 2) {
          this.neverUsedIota = 1;
        }
        if (this.transactions[i].status == 2 && this.transactions[i].index > 0) {
          this.openDepositsAddress = this.transactions[i].receiverAddress;
          this.openDepositsPresent = true;
          return;
        }
      }
      this.openDepositsPresent = false;
    }

    chunk(s, n) {
      var space = [];
      for (var i = 0, len = s.length; i < len; i += n) {
        space.push(s.substr(i, n));
      }
      return space.join(" ");
    }

    filterAddressesChanged(filterCriteria) {
      this.latestAddressFilter = filterCriteria;
      if (filterCriteria == "all") {
        this.addresses.forEach(address => {
          address.filtered = false;
          this.$forceUpdate();
        });
      } else if (filterCriteria == "balance") {
        this.addresses.forEach(address => {
          address.filtered = address.balance == 0;
          this.$forceUpdate();
        });
      }
    }

    filterTransactionsChanged(filterCriteria) {
      this.latestTransactionsFilter = filterCriteria;
      if (filterCriteria == "all") {
        this.transactions.forEach(transaction => {
          transaction.filtered = false;
          this.$forceUpdate();
        });
      } else if (filterCriteria == "waiting") {
        this.transactions.forEach(transaction => {
          transaction.filtered = transaction.status != 2;
          this.$forceUpdate();
        });
      } else if (filterCriteria == "pending") {
        this.transactions.forEach(transaction => {
          transaction.filtered = transaction.status != 0;
          this.$forceUpdate();
        });
      } else if (filterCriteria == "confirmed") {
        this.transactions.forEach(transaction => {
          transaction.filtered = transaction.status != 1;
          this.$forceUpdate();
        });
      } else if (filterCriteria == "intern") {
        this.transactions.forEach(transaction => {
          transaction.filtered =
            transaction.senderName == "/" || transaction.receiverName == "/";
          this.$forceUpdate();
        });
      } else if (filterCriteria == "extern") {
        this.transactions.forEach(transaction => {
          transaction.filtered = !(
            transaction.senderName == "/" || transaction.receiverName == "/"
          );
          this.$forceUpdate();
        });
      } else if (filterCriteria == "receiver") {
        this.transactions.forEach(transaction => {
          transaction.filtered =
            transaction.receiverName != this.userInformation.userName;
          this.$forceUpdate();
        });
      } else if (filterCriteria == "sender") {
        this.transactions.forEach(transaction => {
          transaction.filtered =
            transaction.senderName != this.userInformation.userName;
          this.$forceUpdate();
        });
      }
    }

    sortAddresses(a, b) {
      if (a.index > b.index) {
        return -1;
      }

      if (a.index < b.index) {
        return 1;
      }

      return 0;
    }

    sortTransactions(a, b) {
      if (a.createdAt > b.createdAt) {
        return -1;
      }

      if (a.createdAt < b.createdAt) {
        return 1;
      }

      return 0;
    }

    updateRevenuesAndExpensesChart(timeSpan) {
      this.lastUpdateChartFilter = timeSpan;
      if (timeSpan == "hour") {
        this.performGetHourRevenuesAndExpenses().then(resp => {
          while (this.revenuesAndExpensesGraphLabels.length > 0) {
            this.revenuesAndExpensesGraphLabels.pop();
          }
          while (this.revenuesAndExpensesGraphData.revenues.length > 0) {
            this.revenuesAndExpensesGraphData.revenues.pop();
          }
          while (this.revenuesAndExpensesGraphData.expenses.length > 0) {
            this.revenuesAndExpensesGraphData.expenses.pop();
          }
          for (let revenue of resp.data.revenues) {
            this.revenuesAndExpensesGraphData.revenues.push(revenue.balance);
            this.revenuesAndExpensesGraphLabels.push(revenue.timestamp);
          }
          for (let expense of resp.data.expenses) {
            this.revenuesAndExpensesGraphData.expenses.push(expense.balance);
          }

          this.revenuesAndExpensesChart.options.scales.xAxes[0].scaleLabel.labelString =
            "hours ago";
          this.revenuesAndExpensesChart.reset();
          this.revenuesAndExpensesChart.update();
        });
      } else if (timeSpan == "minute") {
        this.performGetMinuteRevenuesAndExpenses().then(resp => {
          while (this.revenuesAndExpensesGraphLabels.length > 0) {
            this.revenuesAndExpensesGraphLabels.pop();
          }
          while (this.revenuesAndExpensesGraphData.revenues.length > 0) {
            this.revenuesAndExpensesGraphData.revenues.pop();
          }
          while (this.revenuesAndExpensesGraphData.expenses.length > 0) {
            this.revenuesAndExpensesGraphData.expenses.pop();
          }
          for (let revenue of resp.data.revenues) {
            this.revenuesAndExpensesGraphData.revenues.push(revenue.balance);
            this.revenuesAndExpensesGraphLabels.push(revenue.timestamp);
          }
          for (let expense of resp.data.expenses) {
            this.revenuesAndExpensesGraphData.expenses.push(expense.balance);
          }

          this.revenuesAndExpensesChart.options.scales.xAxes[0].scaleLabel.labelString =
            "minutes ago";
          this.revenuesAndExpensesChart.reset();
          this.revenuesAndExpensesChart.update();
        });
      } else if (timeSpan == "day") {
        this.performGetDayRevenuesAndExpenses().then(resp => {
          while (this.revenuesAndExpensesGraphLabels.length > 0) {
            this.revenuesAndExpensesGraphLabels.pop();
          }
          while (this.revenuesAndExpensesGraphData.revenues.length > 0) {
            this.revenuesAndExpensesGraphData.revenues.pop();
          }
          while (this.revenuesAndExpensesGraphData.expenses.length > 0) {
            this.revenuesAndExpensesGraphData.expenses.pop();
          }
          for (let revenue of resp.data.revenues) {
            this.revenuesAndExpensesGraphData.revenues.push(revenue.balance);
            this.revenuesAndExpensesGraphLabels.push(revenue.timestamp);
          }
          for (let expense of resp.data.expenses) {
            this.revenuesAndExpensesGraphData.expenses.push(expense.balance);
          }

          this.revenuesAndExpensesChart.options.scales.xAxes[0].scaleLabel.labelString =
            "days ago";
          this.revenuesAndExpensesChart.reset();
          this.revenuesAndExpensesChart.update();
        });
      }
    }

    options: any = {
      responsive: true,
      fill: false,
      legend: {
        display: true
      },
      aspectRatio: 4,
      scales: {
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "IOTA"
            },
            ticks: {
              beginAtZero: true
            }
          }
        ],
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: ""
            }
          }
        ]
      }
    };

    revenuesAndExpensesData: any = {
      labels: this.revenuesAndExpensesGraphLabels,
      datasets: [
        {
          label: "Revenues",
          data: this.revenuesAndExpensesGraphData.revenues,
          backgroundColor: "rgb(35,209,96)"
        },
        {
          label: "Expenses",
          data: this.revenuesAndExpensesGraphData.expenses,
          backgroundColor: "rgb(255,56,96)"
        }
      ]
    };
  }
</script>

<style>
</style>
