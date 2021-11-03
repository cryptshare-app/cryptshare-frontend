import {HTTP} from "@/axios";

export default class IotaGraphDataService {

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

  async getHourRevenuesAndExpenses() {
    return await HTTP().get("iota/getHourRevenuesAndExpenses");
  }

  async getMinuteRevenuesAndExpenses() {
    return await HTTP().get("iota/getMinuteRevenuesAndExpenses");
  }

  async getDayRevenuesAndExpenses() {
    return await HTTP().get("iota/getDayRevenuesAndExpenses");
  }
}