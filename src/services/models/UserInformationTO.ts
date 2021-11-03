import GroupMembershipTO from "../group/types/GroupMembershipTO";
import PaymentTO from "../payments/types/PaymentTO";

export default interface UserInformationTO {
  userName?: string;
  email?: string;
  id?: number;
  groupMemberships?: GroupMembershipTO[];
  senderPayments?: PaymentTO[];
  receiverPayments?: PaymentTO[];
}
