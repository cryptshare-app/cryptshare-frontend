import PaymentTO from "@/services/payments/types/PaymentTO";

export default class Payment implements PaymentTO {
  id?: number;
  amount?: number;
  senderId?: number;
  senderUserName?: string;
  receiverId?: number;
  receiverUserName?: string;
  groupId?: number;
  groupTitle?: string;
  createdAt?: string;
  updatedAt?: string;
  productId?: number;
  status?: string;

  static fromTO(source: PaymentTO): Payment {
    let result = new Payment();
    Object.assign(result, source);
    return result;
  }

  static fromTOList(source?: PaymentTO[]): Payment[] {
    if (source != undefined) {
      return source.map(it => Payment.fromTO(it));
    } else {
      return [];
    }
  }

  static fromTemplate(): Payment {
    return new Payment();
  }
}
