<template>
    <section>
        <div class="hero has-background-dark-blue is-bold has-tech-image">
            <div class="hero-body min-background">
                <div class="container">
                    <!--<i class="fas fa-layer-group fa-6x "/>-->
                    <h1 class="title has-text-white-ter">Groups</h1>
                    <h2 class="subtitle has-text-white-ter">Manage or create new Groups</h2>

                    <router-link
                            :to="{ name: 'GroupCreationView'}"
                            class="button is-outlined is-inverted is-darker-blue">
                        New Group
                    </router-link>
                </div>
            </div>
        </div>
        <div class="section">
            <div class="container">
                <!-- HEADING WITH GROUPS AND FILTER BY NAME OR SORTING BY LAST UPDATED-->
                <div class="columns">
                    <!-- FIRST COLUMN YOUR GROUPS WITH NUMBER OF GROUPS-->
                    <div class="column">
                        <div class="content">
                            <h4 class="subtitle">
                                Your Groups
                                <span
                                        class="tag is-rounded is-primary has-background-background"
                                >{{this.groups.length}}</span>
                            </h4>
                        </div>
                    </div>
                    <div class="column"></div>
                    <!-- SECOND COLUMN WITH SEARCH INPUT AND SORTING OPTION-->
                    <div class="column">
                        <div class="field is-grouped-right">
                            <div class="control has-icons-left">
                                <input v-model="filter" type="text" class="input" placeholder="Filter by name...">
                                <span class="icon is-small is-left">
                                    <i class="fas fa-search" aria-hidden="true"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <ul v-if="this.groups.length>0">
                    <li v-for="group in filteredGroups">
                        <group-item
                                @success-delete="removeGroupItem"
                                @reject-invitation="removeGroupItem"
                                @accept-invitation="updateGroupItem"
                                @on-leave="leaveGroup"
                                :group="group"
                        ></group-item>
                    </li>
                </ul>

                <div v-else>You have not joined any Groups so far</div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import Component from "vue-class-component";
    import Vue from "vue";
    import GroupItem from "./GroupItem.vue";
    import {Action} from "vuex-class";
    import Group from "../../../stores/models/groups/Group";

    @Component({
        components: {
            GroupItem
        }
    })
    export default class GroupView extends Vue {
        private groups: Group[] = [];
        private filter: string = "";
        private subscription;

        /**
         * get indicate computed properties
         * @returns {Group[]}
         */
        get filteredGroups() {
            return this.groups.filter((it: Group) => {
                return it.title.startsWith(this.filter);
            });
        }

        @Action("getGroupsForUser")
        private getGroupsForUser!: Function;

        /**
         *
         */
        async created() {
            try {
                this.groups = await this.getGroupsForUser();
            } catch (err) {
                // TODO Notify error
            }

          this.subscription = this.$store.subscribe((mutation, state) => {
            if (mutation.type == "newGroupInvitation") {
              this.getGroupsForUser().then((val)=>{
                this.groups = val;
              });
            }
          });
        }

      beforeDestroy() {
        this.subscription(); //unsubscripes
      }

        removeGroupItem(title: string) {
            this.groups = this.groups.filter((it: Group) => {
                return it.title != title;
            });
        }

        /**
         * Update the group and also update new user information
         */
        updateGroupItem(data: Group) {
            this.groups = this.groups.map(it => {
                if (it.title === data.title) {
                    it = data;
                }
                return it;
            });
        }

        leaveGroup(title: string) {
            this.removeGroupItem(title);
        }
    }
</script>

<style lang="scss">
</style>