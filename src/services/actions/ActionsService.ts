import {HTTP} from "@/axios";

export default class ActionsService {

  async getAllActions() {
    return await HTTP().get("actions/getAllActions");
  }


}