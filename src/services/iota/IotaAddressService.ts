import {HTTP} from "@/axios";

export default class IotaAddressService {

    async getAllAddresses() {
        return await HTTP().get("iota/getAllAddresses");
    }

  async deposit() {
    return await HTTP().get("iota/deposit");
  }

}