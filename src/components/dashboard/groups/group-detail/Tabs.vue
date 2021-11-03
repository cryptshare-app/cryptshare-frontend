<template>
    <div>
        <div class="tabs">
            <ul>
                <li v-for="tab in tabs" :class="{'is-active': tab.isActive}">
                    <a @click="routeTo(tab)">{{tab.tabName}}</a>
                </li>
            </ul>
        </div>
        <slot></slot>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import Tab from "./Tab.vue";
    import Component from "vue-class-component";
    import {Prop} from "vue-property-decorator";
    import Group from "@/stores/models/groups/Group";

    @Component({
        components: {Tab},
        name: "tabs"
    })
    export default class Tabs extends Vue {
        private tabs: Tab[] = [];


        @Prop(Group)
        public currentGroup!: Group;

        mounted() {
            this.tabs = this.$children as Tab[];
            this.routeTo(this.tabs[0]);
        }

        routeTo(tab: Tab) {
            this.switchTab(tab);
            this.$router.push({
                name: tab.to.toString()
            });
        }

        switchTab(tab: Tab) {
            this.tabs.map(it => (it.isActive = it.tabName === tab.tabName));
        }
    }
</script>

<style scoped lang="scss">
</style>