import store from "../stores";
import EnvService from "./EnvService";

export default class WebsocketService {
  static wsConnection;
  static alreadyConnected: boolean = false;

  static sendMsgToEndpoint(msg) {
    WebsocketService.wsConnection.send(msg);
  }

  static close() {
    if (this.wsConnection != null) {
      this.wsConnection.close();
      this.alreadyConnected = false;
    }
  }

  static init(_userId) {
    if (this.alreadyConnected) {
      return;
    }
    const URL = EnvService.getEnv("VUE_APP_WEBSOCKET_URL");
    WebsocketService.wsConnection = new WebSocket(URL + _userId);
    WebsocketService.wsConnection.onopen = function() {
      WebsocketService.alreadyConnected = true;
    };
    WebsocketService.wsConnection.onmessage = function(websocketMsg) {
      let msg = JSON.parse(websocketMsg.data);
      switch (msg.key) {
        case "HEARTBEAT": {
          console.log("HERATBEAT: "+msg.content);
          store.dispatch("heartbeat", msg.content);
          break;
        }
        case "TRANSACTION_PENDING": {
          store.dispatch("transactionPending", msg.content);
          break;
        }
        case "TRANSACTION_CONFIRMED": {
          store.dispatch("transactionConfirmed", msg.content);
          break;
        }
        case "ORDER_COMPLETE": {
          store.dispatch("orderComplete", msg.content);
          break;
        }
        case "RECEIVED_PENDING_PAYMENT": {
          store.dispatch("receivedPendingPayment", msg.content);
          break;
        }
        case "UPDATE_AVAILABLE_BALANCE": {
          store.dispatch("updateAvailableBalance", msg.content);
          break;
        }
        case "UPDATE_SERVER_STATUS": {
          store.dispatch("updateServerStatus", msg.content);
          break;
        }
        case "GROUP_CHANGED": {
          store.dispatch("groupChanged", msg.content);
          break;
        }
        case "NEW_GROUP_INVITATION": {
          store.dispatch("newGroupInvitation", msg.content);
          break;
        }
      }
    };
  }
}
