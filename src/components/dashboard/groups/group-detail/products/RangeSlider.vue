<template>
    <div>
        <div>
            <label class="label" for="rangeInputSlider" ref="rangeValueLabel">
                <slot></slot>
            </label>
            <input type="range"
                   id="rangeInputSlider"
                   ref="rangeInputSlider"
                   class="range"
                   name="RangeInput"
                   v-model.number="rangeValue"
                   :min="0"
                   :step="5"
                   :max="100"
                   :disabled="isDisabled"
                   @input="changeSlider">

            <span class="range-label" ref="rangeValueLabel">
            <div class="field has-addons">
                <div class="control percentage-label">
                    <input v-model.number="rangeValue" class="input" type="text" @input="changeSlider"
                           :disabled="isDisabled">
                </div>
                <div class="control iota-label">
                    <a class="button is-static">{{buildIotaString}}</a>
                </div>
            </div>
        </span>
            <span class="content has-text-danger">{{ errors.first("RangeInput") }}</span>
        </div>
        <div v-show="isDisabled" class="disabled-slider"></div>
    </div>
</template>

<script lang="ts">

    import Component from "vue-class-component";
    import Vue from "vue";
    import {Emit, Prop} from "vue-property-decorator";
    import ExchangeService from "@/services/ExchangeService";
    import {Getter} from "vuex-class";

    /**
     * Component that represents a slider with certain addons
     * TODO generify if needed.
     */
    @Component({
        name: "RangeSlider"
    })
    export default class RangeSlider extends Vue {
        public rangeValue: number = 0;
        public isDisabled: boolean = false;

        //computed property to continuously map the input to iota.
        get buildIotaString() {
            // calculate percentage of products prize in euro
            const percentageInEuro = this.priceInEuro * this.rangeValue / 100.0;
            const priceInIota = ExchangeService.eurToIota(
                this.latestPrice,
                this.exchangeRate,
                percentageInEuro.toString()
            );
            return ExchangeService.iotaToString(parseInt(priceInIota));
        }

        // property to set the max value of the input slider
        @Prop(Number)
        private priceInEuro: number;

        @Prop(String)
        private userName:string;


        //event that is emitted when the slider is changed
        @Emit("on-range-change")
        onRangeChange(value: number) {
            return value;
        }

        // getter for iota exchange rate
        @Getter("getExchangeRate")
        private exchangeRate;

        // getter for latest price
        @Getter("getLatestPrice")
        private latestPrice;

        /**
         * Method that emits if the slider was changed
         */
        public changeSlider() {
            this.onRangeChange(this.rangeValue)
        }

        public lockSlider() {
            this.isDisabled = true;
        }

        public unlockSlider() {
            this.isDisabled = false;
        }

        public getUserName(){
          return this.userName;
        }
    }

</script>

<style scoped lang="scss">

    .disabled-slider {
        width: 100%;
        height: 100%;
        background-color: darkgrey;
        left: 0;
        top: 0;
        position: absolute;
        opacity: 0.3;
        transition: opacity 0.5s;
        border-radius: 6px;
    }

    .percentage-label {
        width: 40%;
    }

    .iota-label {
        width: 60%;
    }

    .range-label {
        width: 40%;
        display: inline-block !important;
        margin-left: 1em;
    }

    .rangeValue {
        position: relative;
        display: inline-block;
        padding: 5px 10px;
        width: 60px;
        margin-left: 10px;
        line-height: 20px;
        box-sizing: border-box;
        background-color: $primary;
        text-align: center;
        border-radius: 4px;

        &:after {
            position: absolute;
            top: 8px;
            left: -7px;

            height: 0;
            border-top: 7px solid transparent;
            border-bottom: 7px solid transparent;
            content: '';
        }
    }


    .range {
        height: 10px;
        width: 55%;
        background-color: #d7dcdf;
        -webkit-appearance: none;
        -moz-appearance: none;
        outline: none;
        padding: 0;
        margin: 0;
        border-radius: 5px;
        vertical-align: text-bottom;

    }

    .range::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 4px;
        background: $dark;
        cursor: pointer;
        border: 0;
        -webkit-transition: background .15s ease-in-out;

        &:hover {
            background: $primary;
        }

        &:active {
            background: $primary;
        }
    }

    .range::-moz-range-thumb {
        -moz-appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: $dark;
        cursor: pointer;
        border: 0;
        -moz-transition: background .15s ease-in-out;

        &:hover {
            background: $primary;

        }

        &:active {
            background: $primary;
        }
    }

    input[type=range]::-moz-focus-outer {
        border: 0
    }

</style>