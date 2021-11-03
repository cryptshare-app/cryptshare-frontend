import { HTTP, HTTPWithoutBaseURL } from "@/axios";
import PaymentTO from "@/services/payments/types/PaymentTO";
import { AxiosResponse } from "axios";
import Payment from "@/stores/models/Payment";

export default class IotaPaymentService {

  async updateExchangeRate() {
    return await HTTPWithoutBaseURL().get("https://api.exchangeratesapi.io/latest");
  }

  async confirmPayment(paymentTo:PaymentTO) {

    const resp:AxiosResponse<PaymentTO> = await HTTP().post("iota/confirmPayment", paymentTo);
    return Payment.fromTO(resp.data);
  }

  async sendToUser(_senderName, _receiverName, _amount) {
    return await HTTP().post("iota/sendInternTransaction", null, {
      params: {
        senderName: _senderName,
        receiverName: _receiverName,
        amount: _amount,
        groupTitle: ""
      }
    });
  }

  async withdraw(_address, _amount) {
    return await HTTP().post("iota/sendExternTransaction", null, {
      params: {
        receiverAddress: _address,
        amount: _amount
      }
    });
  }

  async getAvailableBalance() {
    return await HTTP().get("iota/getAvailableBalance");
  }

  async getHourBalances() {
    return await HTTP().get("iota/getHourBalances");
  }

  async getMinuteBalances() {
    return await HTTP().get("iota/getMinuteBalances");
  }

  async getDayBalances() {
    return await HTTP().get("iota/getDayBalances");
  }

  async getHourExpenses() {
    return await HTTP().get("iota/getHourExpenses");
  }

  async getMinuteExpenses() {
    return await HTTP().get("iota/getMinuteExpenses");
  }

  async getDayExpenses() {
    return await HTTP().get("iota/getDayExpenses");
  }

  async getHourRevenues() {
    return await HTTP().get("iota/getHourRevenues");
  }

  async getMinuteRevenues() {
    return await HTTP().get("iota/getMinuteRevenues");
  }

  async getDayRevenues() {
    return await HTTP().get("iota/getDayRevenues");
  }
}