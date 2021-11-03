<template>
    <div>
        <slot></slot>
    </div>
</template>

<script lang="ts">
    import Component from "vue-class-component";
    import {Prop} from "vue-property-decorator";
    import Vue from "vue";
    import Group from "@/stores/models/groups/Group";

    @Component({
        name: "tab"
    })
    export default class Tab extends Vue {
        public isActive: boolean = false;

        @Prop(String)
        public tabName!: String;

        @Prop(String)
        public to!: String;

        @Prop(Boolean)
        public isSelected!: boolean;


        mounted() {
            this.isActive = this.isSelected;
        }
    }
</script>

<style scoped lang="scss">
</style>