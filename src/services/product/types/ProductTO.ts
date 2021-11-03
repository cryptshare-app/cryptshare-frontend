import PaymentTO from "@/services/payments/types/PaymentTO";

export interface ProductTO {
  id?: number;
  imageUrl?: string;
  productName?: string;
  productDescription?: string;
  creatorId?: number;
  groupId?: number;
  groupName?: string;
  price?: number;
  payments?: PaymentTO[];
}
