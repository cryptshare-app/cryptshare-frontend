import {GroupRole} from "src/stores/models/groups/GroupRole";
import {GroupMembershipStatus} from "src/stores/models/groups/GroupMembershipStatus";

export default interface GroupMembershipTO{
    groupTitle?:string;
    userName?:string;
    userRole?:GroupRole;
    invitationStatus?:GroupMembershipStatus;
    autoPay?:boolean;
    id?:number;

}