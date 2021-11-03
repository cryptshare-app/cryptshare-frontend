<template>
    <div class="box group-item">
        <article class="media">
            <div class="media-left">
                <figure class="image is-64x64">
                    <img class="is-rounded" src="https://bulma.io/images/placeholders/128x128.png">
                </figure>
            </div>
            <div class="media-content">
                <br>
                <span class="has-text-weight-bold" style="margin-right: 5px">{{membership.userName}}</span>
                <span v-if="isCurrentUser" class="tag is-success" style="margin-right: 5px">it's you</span>
                <span class="tag has-background-primary">{{membership.userRole}}</span>
                <span v-if="membership.invitationStatus === PENDING" style="margin-left:5px;"
                      class="tag is-warning">{{membership.invitationStatus}}</span>
            </div>
        </article>


    </div>
</template>

<script lang="ts">
    import Component from "vue-class-component";
    import Vue from "vue";
    import {Prop} from "vue-property-decorator";

    import GroupMembership from "../../../../../stores/models/groups/GroupMembership";
    import {GroupMembershipStatus} from "@/stores/models/groups/GroupMembershipStatus";

    @Component({})
    export default class GroupMembershipItem extends Vue {

        private PENDING = GroupMembershipStatus.PENDING;

        get isCurrentUser() {
            return this.userMembership.userName == this.membership.userName;
        }

        @Prop(GroupMembership)
        private readonly membership!: GroupMembership;

        @Prop(GroupMembership)
        private userMembership!: GroupMembership;

        created() {
        }
    }
</script>

<style scoped lang="scss">
    .group-item {
        margin-bottom: 15px;
    }
</style>
