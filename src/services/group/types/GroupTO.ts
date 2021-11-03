import GroupMembershipTO from "@/services/group/types/GroupMembershipTO";
import { ProductTO } from "@/services/product/types/ProductTO";
import GroupMembership from "@/stores/models/groups/GroupMembership";
import PaymentTO from '@/services/payments/types/PaymentTO';

export default interface GroupTO {
  id?:string;
  title?: string;
  description?: string;
  groupMemberships?: GroupMembershipTO[];
  products?: ProductTO[];
  payments?:PaymentTO[];
  userMembership?: GroupMembership;
  imageUrl?: string;
}
