import {HTTP} from "@/axios";
import {AxiosResponse} from "axios";
import GroupMembershipTO from "@/services/group/types/GroupMembershipTO";
import GroupMembership from "@/stores/models/groups/GroupMembership";

import {GroupRole} from "@/stores/models/groups/GroupRole";
import Group from "@/stores/models/groups/Group";

/**
 * static http service for group membership related logic
 */
export default class GroupMembershipService {


    /**
     *
     *
     */

    static async update(groupMembership: GroupMembership) {
        const response: AxiosResponse<GroupMembershipTO> = await HTTP().post(
            "groups/membership/update",
            groupMembership
        );
        return GroupMembership.fromTO(response.data);
    }

    /**
     * Get all group memberships for a group and the current user. Will not work if the user does not participate
     * in this group
     * @param {string} groupTitle
     * @returns {Promise<Array<GroupMembership>>}
     */
    static async getAllGroupMembershipsForGroup(
        groupTitle: string
    ): Promise<Array<GroupMembership>> {
        const response: AxiosResponse<Array<GroupMembershipTO>> = await HTTP().get(
            "groups/util/members",
            {
                params: {
                    groupTitle
                }
            }
        );

        return GroupMembership.fromTOList(response.data);
    }

    /**
     * Current user invites other user to a group identified by its title.
     * @param {string} group
     * @param {string} user
     * @param {GroupRole} role
     * @returns {Promise<GroupInformation>}
     */
    static async inviteUserToGroup(
        group: string,
        user: string,
        role: GroupRole
    ): Promise<GroupMembership> {
        const response: AxiosResponse<GroupMembership> = await HTTP().get(
            "groups/membership/invite",
            {
                params: {
                    group: group,
                    user: user,
                    role: role
                }
            }
        );
        return GroupMembership.fromTO(response.data);
    }

    /**
     * Current user accepts the invitation to a group identified by its title.
     * @param {string} group
     * @returns {Promise<GroupInformation>}
     */
    static async acceptInvitation(group: string): Promise<Group> {
        const response = await HTTP().get("groups/membership/accept", {
            params: {
                group
            }
        });
        return Group.fromTO(response.data);
    }

    static async rejectInvitation(groupTitle: string) {
        const response = await HTTP().post("groups/membership/reject", null, {
            params: {groupTitle: groupTitle}
        });
        return response;
    }

    static async leaveGroup(groupTitle: string): Promise<void> {
        await HTTP().delete("groups/membership/leave", {
            params: {
                groupTitle
            }
        });
        return;
    }
}
