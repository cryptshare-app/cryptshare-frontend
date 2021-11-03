export default interface PaymentTO {
  id?: number;
  amount?: number;
  senderId?: number;
  senderUserName?: string;
  receiverId?: number;
  receiverUserName?: string;
  groupId?: number;
  groupTitle?: string;
  createdAt?:string;
  updatedAt?:string;
  productId?:number;
  status?:string;
}
