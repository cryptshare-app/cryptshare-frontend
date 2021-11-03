<template>
    <nav class="navbar is-darker-blue">
        <div class="container">
            <!-- NAVBAR BRAND -->
            <div class="navbar-brand">
                <div class="navbar-item">
                    <router-link to="/dashboard" class="title">
                        <strong class="has-text-white">CryptShare</strong>
                    </router-link>
                </div>
                <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false"
                   data-target="homeViewNavbar"
                   v-bind:class="{'is-active':toggleMenu}"
                   @click="onOpenBurgerMenu">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <!-- NAVBAR MENU-->
            <div class="navbar-menu" v-bind:class="{'is-active':toggleMenu}">
                <div class="navbar-start">
                    <router-link to="/dashboard" class="navbar-item">Dashboard</router-link>
                    <router-link to="/dashboard/crypto" class="navbar-item">Wallet</router-link>
                    <!-- TODO Show also tag here maybe-->
                    <router-link to="/dashboard/groups" class="navbar-item">Groups</router-link>
                </div>
                <div class="navbar-end">
                <div class="navbar-item">
                    <span style="padding-right: 5px;">{{"Node Status:"}}</span>
                    <span class="icon" v-if="this.serverStatus == 'up'">
                        <i class="fas fa-wifi" style="color:lawngreen"></i>
                    </span>
                    <span class="icon" v-if="this.serverStatus == 'down'">
                        <i class="fas fa-wifi" style="color:red"></i>
                    </span>
                </div>

                <span @click="changeIotaStringGui"
                      v-if="priceSet"
                      class="navbar-item"
                      style="margin-right: 20px; cursor: pointer;;">{{"Balance: "+this.availableBalanceString}}
                </span>
                    <span v-if="priceSet"
                          class="navbar-item"
                          style="margin-right: 40px;">{{"MIOTA: "+this.currentPrice+"€"}}
                </span>
                    <a class="navbar-item has-dropdown is-hoverable">
                        <a class="navbar-link">
                            <i class="fas fa-user is-medium"></i>
                        </a>

                        <div class="navbar-dropdown is-hidden-touch">
                            <a class="navbar-item">
                                <span>{{userInformation.userName}}</span>
                            </a>

                            <hr class="navbar-divider">
                            <a class="navbar-item" @click="logout()">
                                <span class="icon">
                                    <i class="fas fa-sign-out-alt"></i>
                                </span>
                                <span>Log out</span>
                            </a>
                        </div>
                    </a>
                </div>
            </div>

        </div>
    </nav>
</template>

<script lang="ts">
  import Component from "vue-class-component";
  import Vue from "vue";
  import { Action } from "vuex-class";
  import UserInformation from "../../stores/models/UserInformation";
  import ExchangeService from "../../services/ExchangeService";

  @Component({
    props: {
      userInformation: UserInformation
    }
  })
  export default class DashboardViewNavbar extends Vue {
    @Action("logout")
    private removeTokens;

    @Action("updateExchangeRate")
    private performUpdateExchangeRate;

    @Action("getAvailableBalance")
    private performGetAvailableBalance;

    subscription;
    currentPrice: string = "";
    serverStatus: string = "";
    priceSet = false;
    availableBalance = 0;
    availableBalanceString = "";
    shortenIotaString = true;

    private toggleMenu: boolean = false;

    private onOpenBurgerMenu() {
      this.toggleMenu = !this.toggleMenu;
    }

    async created() {
      this.performGetAvailableBalance().then((val) => {
        this.availableBalance = val.data;
        this.updateAvailableBalanceString();
      });

      this.currentPrice = (
        this.$store.state.globalEventStore.latestPrice /
        this.$store.state.globalEventStore.exchangeRateUSDEUR
      ).toFixed(5);
      this.subscription = this.$store.subscribe((mutation, state) => {
        if (mutation.type == "updateServerStatus") {
          this.serverStatus = state.globalEventStore.serverStatus;
          console.log(state.globalEventStore.serverStatus)
        } else if (mutation.type == "priceUpdate") {
          this.currentPrice = (
            state.globalEventStore.latestPrice /
            state.globalEventStore.exchangeRateUSDEUR
          ).toFixed(5);
          this.priceSet = true;
        } else if (mutation.type == "updateAvailableBalance") {
          this.availableBalance = state.globalEventStore.availableBalance;
          this.updateAvailableBalanceString();
        }
      });
      //TODO move to better place
      const resp = await this.performUpdateExchangeRate();
      this.$store.dispatch("exchangeRateUpdate", resp.data.rates.USD);
    }

    beforeDestroy() {
      this.subscription(); //unsubscripes
    }

    logout() {
      this.removeTokens().then(() => {
        this.$router.push({ path: "/" });
      });
    }

    changeIotaStringGui() {
      this.shortenIotaString = !this.shortenIotaString;
      this.updateAvailableBalanceString();
    }

    buildIotaString(amountIota: number) {
      return ExchangeService.iotaToString(amountIota);
    }

    updateAvailableBalanceString() {
      if (this.shortenIotaString) {
        this.availableBalanceString = this.buildIotaString(this.availableBalance);
      } else {
        this.availableBalanceString = this.availableBalance + " i";
      }

    }


  }
</script>

<style scoped lang="scss">
</style>
