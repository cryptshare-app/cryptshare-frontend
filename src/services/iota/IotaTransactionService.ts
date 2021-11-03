import {HTTP} from "@/axios";

export default class IotaTransactionService {

    async getAllTransactions() {
        return await HTTP().get("iota/getAllTransactions");
    }

}