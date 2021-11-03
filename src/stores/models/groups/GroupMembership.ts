import GroupMembershipTO from "src/services/group/types/GroupMembershipTO";
import {GroupMembershipStatus} from "src/stores/models/groups/GroupMembershipStatus";
import {GroupRole} from "src/stores/models/groups/GroupRole";

export default class GroupMembership implements GroupMembershipTO {
    groupTitle?: string;
    userName?: string;
    userRole?: GroupRole;
    invitationStatus?: GroupMembershipStatus;
    id?:number;
    autoPay?:boolean;

    static fromTO(to?: GroupMembershipTO): GroupMembershipTO {
        const target = new GroupMembership();
        Object.assign(target, to);
        return target;
    }

    static fromTOList(data?: GroupMembershipTO[]): GroupMembership[] {
        if (data != undefined) {
            return data.map(it => GroupMembership.fromTO(it));
        }
        return [];
    }
}