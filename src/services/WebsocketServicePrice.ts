import store from "../stores";

export default class WebsocketServicePrice {
  static wsConnection;
  static alreadyConnected: boolean = false;

  static close() {
    if (this.wsConnection != null) {
      this.wsConnection.close();
      this.alreadyConnected = false;
    }
  }

  static init() {
    if (this.alreadyConnected) {
      return;
    }
    WebsocketServicePrice.wsConnection = new WebSocket("wss://ws.coincap.io/prices?assets=iota");
    WebsocketServicePrice.wsConnection.onopen = function() {
      WebsocketServicePrice.alreadyConnected = true;
    };
    WebsocketServicePrice.wsConnection.onmessage = function(websocketMsg) {
      let msg = JSON.parse(websocketMsg.data);
      store.dispatch("priceUpdate", msg.iota);
    };
  }


}