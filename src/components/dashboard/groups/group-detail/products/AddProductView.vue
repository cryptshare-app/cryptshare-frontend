<template>
    <!-- CONTAINER FOR ADD_PRODUCT_VIEW-->
    <div class="container">
        <div class="columns">
            <!-- FIRST HALF CONSISTS OF FROM WHICH IS USED FOR SETTING DEFAULT VARIABLES FOR A NEW PRODUCT-->
            <div class="column is-half">
                <div class="box">
                    <form>

                        <!-- FIELD FOR PRODUCT NAME-->
                        <div class="field">
                            <label class="label">Product name</label>
                            <div class="control has-icons-left">
                                <input v-model="newProduct.productName"
                                       v-validate="{required:true}"
                                       name="Name"
                                       class="input"
                                       placeholder="Product Name">
                                <span class="icon is-small is-left">
                                    <i class="fas fa-heading"></i>
                                </span>
                            </div>
                        </div>
                        <!-- ERROR CAONTAINER FOR PRODUCT NAME-->
                        <p v-show="errors.has('Name')"
                           class="content has-text-danger">
                            {{ errors.first("Name") }}
                        </p>
                        <!-- FIELD FOR PRODUCT DESCRIPTION -->
                        <div class="field">
                            <label class="label">Product description</label>
                            <div class="control has-icons-left">
                                <textarea v-model="newProduct.productDescription" type="text"
                                          class="textarea"></textarea>
                            </div>
                        </div>

                        <!-- FIELD FOR PRODUCT PRICE -->
                        <label class="label">Price of your product</label>
                        <div class="field has-addons">
                            <div class="control has-icons-left is-expanded">
                                <input @input="convertPriceToIota"
                                       :disabled="distributeCostsEnabled"
                                       v-model="priceInEuro"
                                       v-validate="{ required: true,decimal:5,isNot:0}"
                                       class="input"
                                       name="Price"
                                       placeholder="Price of your product">
                                <span class="icon is-small is-left">
                                    <i class="fas fa-euro-sign"></i>
                                </span>
                            </div>
                            <div class="control">
                                <a class="button is-static">{{buildIotaString(product.price)}}</a>
                            </div>
                        </div>
                        <!-- ERROR CONTAINER FOR PRODUCT PRICE-->
                        <p v-show="errors.has('Price')"
                           class="content has-text-danger">{{ errors.first("Price") }}
                        </p>

                        <!-- CHECKRADIO FOR ENABLING COST DISTRIBUTION-->
                        <div class="columns">
                            <div class="column">
                                <div class="field">
                                    <input class="is-checkradio"
                                           id="exampleCheckbox"
                                           type="checkbox"
                                           name="exampleCheckbox"
                                           checked="checked"
                                           :disabled="group.groupMemberships.length===1"
                                           v-model="distributeCostsEnabled">
                                    <label class="label has-margin-0" for="exampleCheckbox">Distribute costs</label>
                                </div>
                            </div>
                        </div>

                        <!-- BUTTONS -->
                        <div class="columns">
                            <div class="column">
                                <div class="field is-grouped is-pulled-right">
                                    <div class="control">
                                        <a class="button is-warning" @click="$router.go(-1)">
                                            <span>Back</span>
                                        </a>
                                    </div>
                                    <div class="control">
                                        <a class="button is-primary" @click="addProduct">
                                    <span class="icon">
                                        <i class="fas fa-check"></i>
                                    </span>
                                            <span>Add product</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <transition name="slide-fade">
                            <div v-show="(distributionValueSum < 99.99999 || distributionValueSum > 100.00001) && distributeCostsEnabled"
                                 class="columns">
                                <div class="column">
                                    <div class="notification is-danger">
                                        The distribution sums up to {{this.distributionValueSum}}%, please make it 100%
                                    </div>
                                </div>
                            </div>
                        </transition>
                    </form>
                </div>
            </div>
            <!-- SECOND HALF -> IS VISIBLE WHEN DISTRIBUTE_COSTS IS ENABLED-->
            <transition name="slide-fade">

                <div v-if="distributeCostsEnabled && group.groupMemberships.length >1" class="column">
                    <!-- DISTRIBUTE COSTS VIEW FOR DISTRIBUTING THE PRODUCT PRICE BETWEEN GROUP MEMBERS-->
                    <DistributeCostsComponent
                            ref="distributeCostsView"
                            :group-memberships="group.groupMemberships"
                            :new-product="newProduct"
                            :price-in-euro="parseFloat(priceInEuro)"
                            @on-distribution-value-changed="onDistributionValueChanged"
                            @on-distribution="updateProductFromDistribution">
                    </DistributeCostsComponent>
                </div>
            </transition>
        </div>
    </div>
</template>


<script lang="ts">
  import Component from "vue-class-component";
  import Vue from "vue";
  import { Emit } from "vue-property-decorator";
  import Product from "../../../../../stores/models/Product";
  import { Action, Getter } from "vuex-class";
  import ExchangeService from "../../../../../services/ExchangeService";
  import Group from "@/stores/models/groups/Group";
  import RangeSlider from "@/components/dashboard/groups/group-detail/products/RangeSlider.vue";
  import UserInformation from "@/stores/models/UserInformation";
  import DistributeCostsComponent from "@/components/dashboard/groups/group-detail/products/DistributeCostsView.vue";
  // @ts-ignore
  import Chart from "vue-bulma-chartjs";
  import { ErrorService } from "@/services/errors/ErrorService";
  import { Validator } from "vee-validate";

  /**
   * Component for handling new products.
   */
  @Component({
    components: { DistributeCostsComponent, RangeSlider, Chart }
  })
  export default class AddProductView extends Vue {

    private newProduct: Product = new Product();
    private priceInEuro: number = 0;
    private distributeCostsEnabled: boolean = false;
    private distributionValueSum: number = 100;

    // getter for the property 'newProduct' --> reactivity
    get product() {
      return this.newProduct;
    }


    get currentUser() {
      return this.getUser;
    }

    get group() {
      return this.getGroup;
    }


    // store action
    @Action("performAddProductInGroup")
    private performAddProductInGroup!: Function;

    /**
     *  store getter. see [[UserStore]]
     */
    @Getter("getCurrentUser")
    private getUser!: UserInformation;

    @Getter("getCurrentGroup")
    private getGroup!: Group;

    @Getter("getExchangeRate")
    private exchangeRate;

    @Getter("getLatestPrice")
    private latestPrice;

    // emit event add product
    @Emit("add")
    private onAddProduct(product: Product) {
      return product;
    }


    /**
     * Created lifecycle hook
     * Set new product default values like group title
     */
    created() {

      Validator.extend("isNot", (value, other) => {
        return value != other;
      });
      this.newProduct.groupName = this.group.title;
      this.newProduct.price = 0;
    }

    /**
     * Add a new product. This will check if all variables needed for product creation are valid.
     * For example the product name and the price.
     * Additionally when distribute costs is set to true, it will check if the distribution is set correctly
     */
    async addProduct() {

      try {
        let distributedCorrectly: boolean = true;
        if (this.distributeCostsEnabled) {
          let distributeCostsView = this.$refs.distributeCostsView as DistributeCostsComponent;
          distributeCostsView.validate((isValid, percentage, price) => {
            if (!isValid) {
              this.$notify({
                group: "global",
                type: "error",
                title: "Action failed",
                text: "Your distribution sums up to " + percentage + "%, please make it 100%."
              });
              distributedCorrectly = false;
            } else {
              distributedCorrectly = true;
            }
          });
        }
        if (!distributedCorrectly) {
          return;
        }
        const isValid = await this.$validator.validate();

        // include validation if price is distributed correctly if distribution is enabled
        if (isValid && this.priceInEuro > 0) {
          this.newProduct.payments = this.newProduct.payments.filter(payment => {
            return payment.amount > 0;
          });

          await this.performAddProductInGroup(this.newProduct);
          this.$router.go(-1);
        } else {
          this.$notify({
            group: "global",
            type: "error",
            title: "Action failed",
            text: "Provided parameters are not valid"
          });
        }

      } catch (err) {
        this.$notify({
          group: "global",
          type: "error",
          title: "Action failed",
          text: ErrorService.buildMessage(err)
        });
      }
    }

    /**
     * Convert the price in euro to iota.
     * @param inputEvt
     */
    private convertPriceToIota(inputEvt) {
      this.newProduct.price = parseInt(ExchangeService.eurToIota(
        this.latestPrice,
        this.exchangeRate,
        this.priceInEuro.toString()
      ));
    }

    /**
     * Build a declarative string from the iota value
     * @param amountIota
     */
    private buildIotaString(amountIota: number) {
      return ExchangeService.iotaToString(amountIota);
    }


    /**
     * Call back that is triggered when the distribute changes
     * @param val
     */
    private onDistributionValueChanged(val: number) {
      this.distributionValueSum = val;
    }

    /**
     * Call back that is triggered when a range slider is moved --> Will update the product such that the payments will set in the parameter
     * @param updatedProduct updated product that consists of the distributed payments
     */
    private updateProductFromDistribution(updatedProduct: Product) {
      this.newProduct = updatedProduct;
    }
  }
</script>

<style scoped lang="scss">

    .product-item {
        margin-top: 15px;
    }

    /* Enter and leave animations can use different */
    /* durations and timing functions.              */
    .slide-fade-enter-active {
        transition: all .3s ease;
    }

    .slide-fade-leave-active {
        transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }

    .slide-fade-enter, .slide-fade-leave-to
        /* .slide-fade-leave-active below version 2.1.8 */
    {
        transform: translate(0, 150px);
        opacity: 0;
    }

</style>

