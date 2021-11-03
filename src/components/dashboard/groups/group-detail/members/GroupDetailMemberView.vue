<template>
    <div class="container">
        <div v-show="isOwner">
            <article v-if="isNewGroup" class="message is-info">
                <div class="message-header">
                    <p>Info</p>
                    <button class="delete" aria-label="delete" @click="hideInfo()"></button>
                </div>
                <div class="message-body">
                    In this section you can invite new members to your group. When you have already
                    added a new product then inviting new members will split up your initial costs.
                </div>
            </article>
            <div class="content">
                <h3 class="title">Group members</h3>
                <h6 class="subtitle">You can invite new members to {{group.title}}</h6>
            </div>
            <div class="box">
                <div class="columns">
                    <div class="column">
                        <div class="field">
                            <label class="label">Select members to invite</label>
                            <UserSearchInput ref="userSearchInput" :validation="false" :placeholder="'Username'" :scope="''" name="''" @update="onSelectionChanged"></UserSearchInput>
                        </div>
                        <div class="field">
                            <label class="label">Choose a role permission</label>
                            <div class="control">
                                <div class="select">
                                    <select v-model="selectedRole">
                                        <option>{{memberRole}}</option>
                                        <option>{{adminRole}}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <br>
                        <button @click="inviteUserToGroup()" class="button is-primary">Add to group</button>
                    </div>
                    <div class="column"></div>
                    <div class="column"></div>
                </div>
            </div>
        </div>
        <br>

        <nav class="panel">
            <div class="panel-heading">
                <div class="columns is-vcentered">
                    <div class="column">
                        Members of
                        <span class="subtitle has-text-grey-light">{{group.title}}</span>
                    </div>
                </div>
            </div>
        </nav>

        <ul>
            <li v-for="(membership,index) in group.groupMemberships" v-bind:key="index">
                <GroupMembershipItem
                        :membership="membership"
                        :userMembership="group.userMembership"
                ></GroupMembershipItem>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
    import Component from "vue-class-component";
    import Vue from "vue";
    import GroupMembershipItem from "./GroupMembershipItem.vue";
    import {Action, Getter} from "vuex-class";
    import {BusinessError} from "@/stores/models/BusinessError";
    import {GroupRole} from "@/stores/models/groups/GroupRole";
    import Group from "../../../../../stores/models/groups/Group";
    import {ErrorService} from "@/services/errors/ErrorService";
    import GroupMembership from "@/stores/models/groups/GroupMembership";
    import UserSearchInput from "@/components/dashboard/groups/group-detail/members/UserSearchInput.vue";

    @Component({
        components: {UserSearchInput, GroupMembershipItem}
    })
    export default class GroupDetailMemberView extends Vue {
        /*Data properties of this component*/
        private userSearch: string = "";
        private memberRole: GroupRole = GroupRole.MEMBER;
        private adminRole: GroupRole = GroupRole.ADMIN;
        private selectedRole: GroupRole = GroupRole.MEMBER;
        private users: string[] = [];

        private infoIsVisible: boolean = true;

        get group() {
            return this.getGroup;
        }

        get filteredUsers() {
            return this.users.filter(it => it.startsWith(this.userSearch));
        }

        /**
         * Computed property that checks if the the current user is owner of the current group
         */
        get isOwner() {
            if (this.group.userMembership !== undefined) {
                return this.group.userMembership.userRole === GroupRole.OWNER;
            }
        }

        /**
         * computed property for handling the info field
         * */
        get isNewGroup(): boolean {
            return this.group.groupMemberships.length === 1 && this.infoIsVisible;
        }

        @Getter("getCurrentGroup")
        private getGroup!: Group;

        // store action
        @Action("performGetAllGroupMembershipsByTitle")
        private performGetAllGroupMembershipsByTitle!: Function;

        // store action
        @Action("performInviteUserToGroup")
        private performInviteUserToGroup!: Function;


        onSelectionChanged(value) {
            this.userSearch = value
        }

        /**
         * Invites a user from a text input into the current group identified by its title.
         * Notifies if invitation was successfully sent or invitation failed
         */
        inviteUserToGroup() {
            this.performInviteUserToGroup({
                otherUsername: this.userSearch,
                groupTitle: this.group.title,
                role: this.selectedRole
            }).then((groupMembership: GroupMembership) => {
                // Notify success invitation
                this.$notify({
                    group: "global",
                    type: "success",
                    title: "Invitation successful",
                    text: `User ${this.userSearch} was invited to group ${
                        this.group.title
                        }`
                });
                this.$refs.userSearchInput.setUserSearch("");

            }).catch((error: BusinessError) => {
                this.$notify({
                    group: "global",
                    type: "error",
                    title: "Invitation failed",
                    text: ErrorService.buildMessage(error)
                });
            });
        }

        private hideInfo() {
            this.infoIsVisible = false;
        }
    }
</script>

<style scoped lang="scss">
    .user-search-wrapper {
        position: relative;
    }

    .user-search-text-field {
        z-index: 1001;
        position: absolute;
        margin-top: 1px;
        width: 100%;
        background-color: $darker-blue;
        border-radius: 6px 6px 6px 6px;
    }

    .user-search-item {
        padding: 12px;
        cursor: pointer;
        color: $light;

        &:hover {
            background-color: $dark;
            color: $light;
        }

        &:last-of-type {
            border-radius: 0 0 6px 6px;
        }


        &:first-of-type {
            border-radius: 6px 6px 0 0;
        }

        &.is-active {
            background-color: $primary;
            color: $dark;

            &:only-of-type {
                border-radius: 6px 6px 6px 6px;
            }
        }

    }


    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.3s
    }

    .fade-enter,
    .fade-leave-to {
        opacity: 0
    }
</style>
