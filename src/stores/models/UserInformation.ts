import UserInformationTO from "@/services/models/UserInformationTO";
import GroupMembership from "./groups/GroupMembership";
import Payment from "./Payment";

export default class UserInformation implements UserInformationTO {
  userName?: string;
  email?: string;
  id?: number;
  groupMemberships?: GroupMembership[];
  senderPayments?: Payment[];
  receiverPayments?: Payment[];

  static fromTO(user: UserInformationTO): UserInformation {
    const result = new UserInformation();
    Object.assign(result, user);

    result.groupMemberships = GroupMembership.fromTOList(user.groupMemberships);
    result.senderPayments = Payment.fromTOList(user.senderPayments);
    result.receiverPayments = Payment.fromTOList(user.receiverPayments);
    return result;
  }

  static fromTemplate(): UserInformation {
    return new UserInformation();
  }
}
