<template>
    <div class="box group-item">
        <article class="media">
            <figure class="media-left">
                <p class="image is-64x64">
                    <img class="is-rounded" src="https://bulma.io/images/placeholders/64x64.png">
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <p>
                        <strong class="subtitle">
                            <a class="has-text-dark" @click="linkToDetailView()">{{group.title}}</a>
                            <span v-if="!isPending" class="tag is-primary" style="margin-left: 1em">{{this.group.userMembership.userRole}}</span>
                            <span
                                    v-else
                                    class="tag has-background-warning"
                                    style="margin-left: 1em"
                            >{{this.group.userMembership.invitationStatus}}</span>
                        </strong>
                        <br>
                        {{group.description}}
                        <br>
                        <span class="icon">
                <i class="fas fa-user"></i>
              </span>
                        <span>{{group.groupMemberships.filter(it=>!it.PENDING).length}}</span>
                    </p>
                </div>
                <!--
                <nav class="level is-mobile">
                  <div class="level-left">
                    <div class="level-item">
                      <span class="icon">
                        <i class="fas fa-user"></i>
                      </span>
                      <span>{{group.groupMemberships.length}}</span>
                    </div>
                  </div>
                </nav>-->

            </div>
            <div v-if="isOwner" class="media-right">
                <a class="delete is-medium" @click="toggleDeletionModal()"></a>
            </div>
            <div v-if="isAcceptedMember" class="media-right">
                <a class="button is-danger" @click="showLeaveGroupModal">Leave Group</a>
            </div>
            <div v-if="isPending" class="media-right">
                <div class="field is-grouped">
                    <div class="control">
                        <button @click="acceptInvitation()" class="button is-primary">Accept</button>
                    </div>
                    <div class="control">
                        <button @click="declineInvitation()" class="button">Decline</button>
                    </div>
                </div>
            </div>
        </article>
        <leave-group-modal
                v-if="leaveGroupModalIsActive"
                @close="closeLeaveGroupModal"
                @leave="leaveGroup"
        ></leave-group-modal>
        <div class="modal" v-bind:class="{ 'is-active': isActive }">
            <div class="modal-background" @click="toggleDeletionModal()"></div>
            <div class="modal-content">
                <!-- Any other Bulma elements you want -->
                <div class="box">
                    <div class="hero">
                        <div class="hero-body">
                            <p class="subtitle">Do you really want to delete this group?</p>
                        </div>
                    </div>
                    <div class="columns">
                        <div class="column">
                            <div class="field is-grouped is-pulled-right">
                                <div class="control">
                                    <button class="button is-primary is-outlined" @click="deleteGroup()">Delete</button>
                                </div>
                                <div class="control">
                                    <button class="button" @click="toggleDeletionModal()">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button class="modal-close is-large" aria-label="close" @click="toggleDeletionModal()"></button>
        </div>
    </div>
</template>

<script lang="ts">
    import Component from "vue-class-component";
    import Vue from "vue";
    import {Emit, Prop} from "vue-property-decorator";
    import {Action} from "vuex-class";
    import {GroupRole} from "@/stores/models/groups/GroupRole";
    import {GroupMembershipStatus} from "@/stores/models/groups/GroupMembershipStatus";
    import Group from "../../../stores/models/groups/Group";
    import LeaveGroupModal from "./LeaveGroupModal.vue";
    import {ErrorService} from "@/services/errors/ErrorService";

    @Component({
        name: "group-item",
        components: {LeaveGroupModal}
    })
    export default class GroupItem extends Vue {
        /** control variable to keep track of whether the modal is active or not.*/
        private isActive: boolean = false;
        private leaveGroupModalIsActive: boolean = false;

        @Prop(Group)
        private group!: Group;

        /**
         * Computed property that return true if the current user is owner of this group
         * @returns {boolean}
         */
        get isOwner() {
            return this.group.userMembership.userRole === GroupRole.OWNER;
        }

        /**
         * Computed property that returns true if the current user is an accepted member of this group
         * @returns {boolean}
         */
        get isAcceptedMember() {
            return (
                this.group.userMembership.userRole === GroupRole.MEMBER &&
                this.group.userMembership.invitationStatus ===
                GroupMembershipStatus.ACCEPTED
            );
        }

        /**
         * Computed property to check the current invitation status
         */
        get isPending() {
            return (
                this.group.userMembership.invitationStatus ===
                GroupMembershipStatus.PENDING
            );
        }

        @Action("performDeleteGroup")
        private performDeleteGroup!: Function;

        @Action("performAcceptInvitation")
        private performAcceptInvitation!: Function;

        @Action("performRejectInvitation")
        private performRejectInvitation!: Function;

        @Action("performLeaveGroup")
        private performLeaveGroup!: Function;

        // Store action
        @Action("performGetGroupForUserByTitle")
        performGetGroupForUserByTitle!: Function;

        @Emit("success-delete")
        private successDelete() {
            return this.group.title;
        }

        @Emit("error-delete")
        private errorDelete(err) {
            return err;
        }

        @Emit("accept-invitation")
        private emitAcceptInvitation(group: Group): Group {
            return group;
        }

        @Emit("reject-invitation")
        private emitRejectInvitation(groupTitle: string): string {
            return groupTitle;
        }

        @Emit("on-leave")
        private emitLeaveGroup(groupTitle: string): string {
            return groupTitle;
        }

        toggleDeletionModal() {
            this.isActive = !this.isActive;
        }

        showLeaveGroupModal() {
            this.leaveGroupModalIsActive = true;
        }

        closeLeaveGroupModal() {
            this.leaveGroupModalIsActive = false;
        }

        /**
         * Delete a Group
         * @returns {Promise<void>}
         */
        async deleteGroup() {
            this.toggleDeletionModal();
            try {
                await this.performDeleteGroup(this.group.title);
                this.successDelete();
            } catch (err) {
                this.errorDelete(err);
            }
        }

        async leaveGroup() {
            try {
                await this.performLeaveGroup(this.group.title);
                this.emitLeaveGroup(this.group.title);
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
         * Accept a invitation
         * @returns {Promise<void>}
         */
        async acceptInvitation() {
            try {
                const group = await this.performAcceptInvitation(this.group.title);
                this.emitAcceptInvitation(group);
            } catch (err) {
                console.error(err);
            }
        }

        /**
         * Decline a invitation
         * @returns {Promise<void>}
         */
        async declineInvitation() {
            try {
                const group = await this.performRejectInvitation(this.group.title);
                this.emitRejectInvitation(this.group.title);
            } catch (err) {
                this.$notify({
                    group: "global",
                    type: "error",
                    title: "Action failed",
                    text: err.errorMessage
                });
            }
        }

        /**
         * Link to the detail view
         */
        async linkToDetailView() {
            if (
                this.group.userMembership.invitationStatus ===
                GroupMembershipStatus.ACCEPTED
            ) {
                await this.performGetGroupForUserByTitle(this.group.title);
                this.$router.push({
                    name: "GroupDetailDefaultView",
                    params: {groupTitle: this.group.title}
                });
            } else {
                this.$notify({
                    group: "global",
                    type: "error",
                    title: "Not allowed",
                    text: "You must be a accepted member of this group"
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .group-item {
        margin-bottom: 15px;
    }
</style>
