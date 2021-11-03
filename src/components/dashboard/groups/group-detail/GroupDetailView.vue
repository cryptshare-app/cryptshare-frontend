<template>
    <div>
        <GroupNotFoundView v-if="groupNotFound"></GroupNotFoundView>
        <div v-else>
            <div v-if="group" class="hero has-background-dark-blue has-tech-image is-bold has-shadow">
                <div class="hero-body min-background has-shadow">
                    <div class="container">
                        <div class="media">
                            <figure class="media-left">
                                <p class="image is-256x256">
                                    <img class="is-rounded" v-bind:src="group.imageUrl">
                                </p>
                            </figure>
                            <div class="media-content">
                                <h1 class="title has-text-white-ter">{{group.title}}</h1>
                                <h2 class="subtitle has-text-white-ter">{{group.description}}</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style="margin-top: 30px;">
                <div class="container">
                    <tabs>
                        <tab tabName="General" :isSelected="true" to="GroupDetailDefaultView"></tab>
                        <tab tabName="Payments" to="GroupDetailPaymentView"></tab>
                        <tab tabName="Products" to="GroupDetailProductView"></tab>
                        <tab tabName="Members" to="GroupDetailMemberView"></tab>
                    </tabs>
                </div>
            </div>


            <transition name="component-fade" mode="out-in">
                <router-view v-if="group" :currentGroup="group" @add-product="onAddProduct"></router-view>
            </transition>
        </div>
    </div>
</template>

<script lang="ts">
  import Component from "vue-class-component";
  import Vue from "vue";
  import GroupNotFoundView from "./GroupNotFoundView.vue";
  import GroupDetailDefaultView from "./general/GroupDetailDefaultView.vue";
  import GroupDetailMemberView from "./members/GroupDetailMemberView.vue";
  import GroupDetailPaymentView from "./payments/GroupDetailPaymentView.vue";
  import GroupDetailProductView from "./products/GroupDetailProductView.vue";
  import Tabs from "./Tabs.vue";
  import Tab from "./Tab.vue";

  import { Prop } from "vue-property-decorator";
  import { Action, Getter } from "vuex-class";

  import Group from "../../../../stores/models/groups/Group";
  import Product from "../../../../stores/models/Product";
  import { ErrorService } from "@/services/errors/ErrorService";

  @Component({
    components: {
      GroupNotFoundView,
      GroupDetailDefaultView,
      GroupDetailMemberView,
      GroupDetailPaymentView,
      GroupDetailProductView,
      Tabs,
      Tab
    }
  })
  export default class GroupDetailView extends Vue {
    /**Normal properties needed for this component */
    private group: Group = null;
    private subscription;
    private groupNotFound: boolean = false;
    /**Properties */
    @Prop(String)
    private readonly groupTitle!: string;


    /**Store method */
    @Action("performGetGroupForUserByTitle")
    performGetGroupForUserByTitle!: Function;

    /**Store getter */
    @Getter("getCurrentGroup")
    getCurrentGroup!: Group;

    /**
     * Created hook. Performs API-Operation to fetch the group specified by its title for the
     * current user. Notifies an error if the group does not exist.
     */
    async created() {
      try {
        // Get the group its title and store it in GroupStore
        await this.performGetGroupForUserByTitle(this.groupTitle);
        // Set the active Group of this component to the currentGroup in the GroupStore
        this.group = this.getCurrentGroup;
      } catch (err) {
        this.groupNotFound = true;
        this.$notify({
          group: "global",
          title: "Error!",
          type: "error",
          text: ErrorService.buildMessage(err)
        });
      }

      this.subscription = this.$store.subscribe((mutation, state) => {
        if (mutation.type == "groupChanged") {
          console.log(state.globalEventStore.groupChangedId);
          // Get the group its title and store it in GroupStore
          this.performGetGroupForUserByTitle(this.groupTitle).then(() => {
            // Set the active Group of this component to the currentGroup in the GroupStore
            this.group = this.getCurrentGroup;
            console.log("Group updated")
          });
        }
      });
    }


    beforeDestroy() {
      console.log("Group sub unsubscribe")
      this.subscription(); //unsubscripes
    }

    /**Event function that is called when the child component triggers add product */
    onAddProduct(product: Product) {
      if (this.group.products !== undefined) {
        this.group.products.push(product);
      }
    }
  }
</script>

<style scoped lang="scss">
    .component-fade-enter-active,
    .component-fade-leave-active {
        transition: opacity 0.2s ease;
    }

    .component-fade-enter, .component-fade-leave-to
        /* .component-fade-leave-active below version 2.1.8 */
    {
        opacity: 0;
    }
</style>
