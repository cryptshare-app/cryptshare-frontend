<template>
    <div class="container">
        <div class="columns">

            <input type="checkbox"
                   id="automaticPay"
                   class="is-checkradio"
                   checked="checked"
                   v-model="getCurrentGroup.userMembership.autoPay"
                   @change="setAutoPay($event)">
            <label for="automaticPay" class="container columns is-2" style="margin-bottom: 1.5em;">Pay automatically in
                this group
            </label>
        </div>

        <!--<button @click="print">asfdffdas</button>-->
        <div class="columns box is-multiline">
            <div class="column is-12">
                <h4 class="title is-4 has-text-centered">Statistics for group</h4>
            </div>

            <div class="column is-4">
                <h1 class="subtitle has-text-centered">IOTA</h1>
                <h3 v-if="amountPaidIota == 0 && amountUnpaidIota == 0" class="subtitle has-text-centered">No data
                    yet</h3>
                <canvas id="chartPaidIota" v-show="amountPaidIota != 0 || amountUnpaidIota != 0"></canvas>
            </div>
            <div class="column is-4">
                <h1 class="subtitle has-text-centered">Payments</h1>
                <h3 v-if="amountPaidPayments == 0 && amountUnpaidPayments == 0" class="subtitle has-text-centered">No
                    data yet</h3>
                <canvas id="chartPaidPayments" v-show="amountPaidPayments != 0 || amountUnpaidPayments != 0"></canvas>
            </div>
            <div class="column is-4">
                <h1 class="subtitle has-text-centered">Products</h1>
                <h3 v-if="amountPaidProducts == 0 && amountUnpaidProducts == 0" class="subtitle has-text-centered">No
                    data yet</h3>
                <canvas id="chartPaidProducts" v-show="amountPaidProducts != 0 || amountUnpaidProducts != 0"></canvas>
            </div>
        </div>

        <div class="columns box is-multiline" style="margin-top: 2em;">
            <div class="column is-12">
                <h4 class="title is-4 has-text-centered">Statistics for you</h4>
            </div>

            <div class="column is-4">
                <h1 class="subtitle has-text-centered">IOTA</h1>
                <h3 v-if="amountPaidIotaYou == 0 && amountUnpaidIotaYou == 0" class="subtitle has-text-centered">No data
                    yet</h3>
                <canvas id="chartPaidIotaYou" v-show="amountPaidIotaYou != 0 || amountUnpaidIotaYou != 0"></canvas>
            </div>
            <div class="column is-4">
                <h1 class="subtitle has-text-centered">Payments</h1>
                <h3 v-if="amountPaidPaymentsYou == 0 && amountUnpaidPaymentsYou == 0"
                    class="subtitle has-text-centered">No data yet</h3>
                <canvas id="chartPaidPaymentsYou"
                        v-show="amountPaidPaymentsYou != 0 || amountUnpaidPaymentsYou != 0"></canvas>
            </div>
            <div class="column is-4">
                <h1 class="subtitle has-text-centered">Products</h1>
                <h3 v-if="amountPaidProductsYou == 0 && amountUnpaidProductsYou == 0"
                    class="subtitle has-text-centered">No data yet</h3>
                <canvas id="chartPaidProductsYou"
                        v-show="amountPaidProductsYou != 0 || amountUnpaidProductsYou != 0"></canvas>
            </div>
        </div>

    </div>

</template>

<script lang="ts">
    import Component from "vue-class-component";
    import Vue from "vue";
    import Chart from "chart.js";
    import Group from "../../../../../stores/models/groups/Group";
    import {Action, Getter} from "vuex-class";

    @Component({
        components: {Chart}
    })
    export default class GroupDetailDefaultView extends Vue {

        @Action("updateGroupMembership")
        private performUpdateGroupMembership;

        /**Store getter */
        @Getter("getCurrentGroup")
        getCurrentGroup!: Group;


        amountPaidIota: number = 0;
        amountUnpaidIota: number = 0;

        amountPaidPayments: number = 0;
        amountUnpaidPayments: number = 0;

        amountPaidProducts: number = 0;
        amountUnpaidProducts: number = 0;


        amountPaidIotaYou: number = 0;
        amountUnpaidIotaYou: number = 0;

        amountPaidPaymentsYou: number = 0;
        amountUnpaidPaymentsYou: number = 0;

        amountPaidProductsYou: number = 0;
        amountUnpaidProductsYou: number = 0;

        chartPaidIota;
        chartPaidPayments;
        chartPaidProducts;
        chartPaidIotaYou;
        chartPaidPaymentsYou;
        chartPaidProductsYou;

        async setAutoPay(event) {
            this.getCurrentGroup.userMembership.autoPay = event.target.checked;
            this.performUpdateGroupMembership(this.getCurrentGroup.userMembership).then((resp) => {
                this.$notify({
                    group: "global",
                    type: "success",
                    title: "Changed payment settings",
                    text: event.target.checked ? "Payments is done automatically" : "Payments must be confirmed by you"
                });
            });
        }


        async mounted() {
            this.chartPaidIota = new Chart(
                document.getElementById("chartPaidIota"), {
                    type: "doughnut",
                    data: this.chartPaidIotaData,
                    options: this.chartPaidIotaOptions
                });
            this.chartPaidPayments = new Chart(
                document.getElementById("chartPaidPayments"), {
                    type: "doughnut",
                    data: this.chartPaidPaymentsData,
                    options: this.chartPaidPaymentsOptions
                });
            this.chartPaidProducts = new Chart(
                document.getElementById("chartPaidProducts"), {
                    type: "doughnut",
                    data: this.chartPaidProductsData,
                    options: this.chartPaidProductsOptions
                });

            this.chartPaidIotaYou = new Chart(
                document.getElementById("chartPaidIotaYou"), {
                    type: "doughnut",
                    data: this.chartPaidIotaDataYou,
                    options: this.chartPaidIotaOptionsYou
                });
            this.chartPaidPaymentsYou = new Chart(
                document.getElementById("chartPaidPaymentsYou"), {
                    type: "doughnut",
                    data: this.chartPaidPaymentsDataYou,
                    options: this.chartPaidPaymentsOptionsYou
                });
            this.chartPaidProductsYou = new Chart(
                document.getElementById("chartPaidProductsYou"), {
                    type: "doughnut",
                    data: this.chartPaidProductsDataYou,
                    options: this.chartPaidProductsOptionsYou
                });

            this.retrievePaymentStats();
            this.retrieveProductStats();

            this.chartPaidIotaData.datasets[0].data = [this.amountUnpaidIota, this.amountPaidIota];
            this.chartPaidPaymentsData.datasets[0].data = [this.amountUnpaidPayments, this.amountPaidPayments];
            this.chartPaidProductsData.datasets[0].data = [this.amountUnpaidProducts, this.amountPaidProducts];

            this.chartPaidIotaDataYou.datasets[0].data = [this.amountUnpaidIotaYou, this.amountPaidIotaYou];
            this.chartPaidPaymentsDataYou.datasets[0].data = [this.amountUnpaidPaymentsYou, this.amountPaidPaymentsYou];
            this.chartPaidProductsDataYou.datasets[0].data = [this.amountUnpaidProductsYou, this.amountPaidProductsYou];


            this.chartPaidIota.reset();
            this.chartPaidIota.update();
            this.chartPaidPayments.reset();
            this.chartPaidPayments.update();
            this.chartPaidProducts.reset();
            this.chartPaidProducts.update();

            this.chartPaidIotaYou.reset();
            this.chartPaidIotaYou.update();
            this.chartPaidPaymentsYou.reset();
            this.chartPaidPaymentsYou.update();
            this.chartPaidProductsYou.reset();
            this.chartPaidProductsYou.update();
        }

        retrievePaymentStats() {
            let ownUserName = this.getCurrentGroup.userMembership.userName;
            let amountPaidIota = 0;
            let amountUnpaidIota = 0;
            let amountPaidPayments = 0;
            let amountUnpaidPayments = 0;

            let amountPaidIotaYou = 0;
            let amountUnpaidIotaYou = 0;
            let amountPaidPaymentsYou = 0;
            let amountUnpaidPaymentsYou = 0;

            this.getCurrentGroup.payments.forEach(payment => {
                if (payment.status == "CLOSED") {
                    amountPaidPayments++;
                    amountPaidIota += payment.amount;
                    if (payment.senderUserName == ownUserName) {
                        amountPaidPaymentsYou++;
                        amountPaidIotaYou += payment.amount;
                    }
                } else {
                    amountUnpaidPayments++;
                    amountUnpaidIota += payment.amount;
                    if (payment.senderUserName == ownUserName) {
                        amountUnpaidPaymentsYou++;
                        amountUnpaidIotaYou += payment.amount;
                    }
                }
            });
            this.amountPaidIota = amountPaidIota;
            this.amountUnpaidIota = amountUnpaidIota;
            this.amountPaidPayments = amountPaidPayments;
            this.amountUnpaidPayments = amountUnpaidPayments;

            this.amountPaidIotaYou = amountPaidIotaYou;
            this.amountUnpaidIotaYou = amountUnpaidIotaYou;
            this.amountPaidPaymentsYou = amountPaidPaymentsYou;
            this.amountUnpaidPaymentsYou = amountUnpaidPaymentsYou;
        }

        retrieveProductStats() {
            let ownUserName = this.getCurrentGroup.userMembership.userName;
            let amountPaidProducts = 0;
            let amountUnpaidProducts = 0;

            let amountPaidProductsYou = 0;
            let amountUnpaidProductsYou = 0;

            let group = this.getCurrentGroup;

            for (let i = 0; i < group.products.length; i++) {
                let allPaymentsClosedForProduct = true;
                let allPaymentsClosedForProductYou = true;
                for (let j = 0; j < group.products[i].payments.length; j++) {
                    if (group.products[i].payments[j].status != "CLOSED") {
                        allPaymentsClosedForProduct = false;
                        if (group.products[i].payments[j].senderUserName == ownUserName) {
                            allPaymentsClosedForProductYou = false;
                        }
                    }
                }

                if (allPaymentsClosedForProduct) {
                    amountPaidProducts++;

                } else {
                    amountUnpaidProducts++;
                }

                if (allPaymentsClosedForProductYou) {
                    amountPaidProductsYou++;

                } else {
                    amountUnpaidProductsYou++;
                }
            }

            this.amountPaidProducts = amountPaidProducts;
            this.amountUnpaidProducts = amountUnpaidProducts;

            this.amountPaidProductsYou = amountPaidProductsYou;
            this.amountUnpaidProductsYou = amountUnpaidProductsYou;
        }


        //GROUP
        chartPaidIotaOptions: any = {
            aspectRatio: 1.5
        };
        chartPaidIotaData = {
            labels: ["Pending", "Paid"],
            datasets: [
                {
                    data: [],
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.5)",
                        "rgba(75, 192, 192, 0.2)"
                    ]
                }
            ]
        };

        chartPaidPaymentsOptions: any = {
            aspectRatio: 1.5
        };
        chartPaidPaymentsData = {
            labels: ["Pending", "Fulfilled"],
            datasets: [
                {
                    data: [],
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.5)",
                        "rgba(75, 192, 192, 0.2)"
                    ]
                }
            ]
        };

        chartPaidProductsOptions: any = {
            aspectRatio: 1.5
        };
        chartPaidProductsData = {
            labels: ["Open", "Paid"],
            datasets: [
                {
                    data: [],
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.5)",
                        "rgba(75, 192, 192, 0.2)"
                    ]
                }
            ]
        };


        //YOU
        chartPaidIotaOptionsYou: any = {
            aspectRatio: 1.5
        };
        chartPaidIotaDataYou = {
            labels: ["Pending", "Paid"],
            datasets: [
                {
                    data: [],
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.5)",
                        "rgba(75, 192, 192, 0.2)"
                    ]
                }
            ]
        };

        chartPaidPaymentsOptionsYou: any = {
            aspectRatio: 1.5
        };
        chartPaidPaymentsDataYou = {
            labels: ["Pending", "Fulfilled"],
            datasets: [
                {
                    data: [],
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.5)",
                        "rgba(75, 192, 192, 0.2)"
                    ]
                }
            ]
        };

        chartPaidProductsOptionsYou: any = {
            aspectRatio: 1.5
        };
        chartPaidProductsDataYou = {
            labels: ["Open", "Paid"],
            datasets: [
                {
                    data: [],
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.5)",
                        "rgba(75, 192, 192, 0.2)"
                    ]
                }
            ]
        };
    }
</script>

<style scoped lang="scss">
    /* Customize the label (the container) */
    .container {
        display: block;
        position: relative;
        padding-left: 35px;
        margin-bottom: 12px;
        cursor: pointer;
        font-size: 22px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    /* Hide the browser's default checkbox */
    .container input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
    }

    /* Create a custom checkbox */
    .checkmark {
        position: absolute;
        top: 3px;
        left: 0;
        height: 25px;
        width: 25px;
        background-color: hsl(0, 0%, 86%);
    }

    /* When the checkbox is checked, add a blue background */
    .container input:checked ~ .checkmark {
        background-color: hsl(204, 86%, 53%);
    }

    /* Create the checkmark/indicator (hidden when not checked) */
    .checkmark:after {
        content: "";
        position: absolute;
        display: none;
    }

    /* Show the checkmark when checked */
    .container input:checked ~ .checkmark:after {
        display: block;
    }

    /* Style the checkmark/indicator */
    .container .checkmark:after {
        left: 9px;
        top: 2px;
        width: 8px;
        height: 17px;
        border: solid white;
        border-width: 0 3px 3px 0;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
    }
</style>
