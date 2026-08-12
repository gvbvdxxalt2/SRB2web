var { getWebsocketURL, PLACEHOLDER_IP } = require("./util.js");
var ErrorCodes = require("./errors.js");
var attachSRB2 = require("../attach.js");
var SimplePeer = require("simple-peer");

class ListenChannel {
  constructor(parent, id, ip, rtcConfig, wsId) {
    this.parent = parent;
    this.id = id;
    this.ip = ip;
    this.rtcConfig = rtcConfig;
    this.wsId = wsId;

    this.isOpen = false;
    this.socketOpen = true;
    this.peer = null;
    this.removeWsConnection = () => {}; //Added in by listen.js

    this.init();

    console.log(`[Relay ListenChannel]: Handling connection IP: ${ip} ID: ${id} Websocket ID: ${wsId}`);
  }

  wsclosed() {
    if (this.socketOpen) {
      console.log(`[Relay ListenChannel]: Websocket connection closed IP: ${this.ip} ID: ${this.id} Websocket ID: ${this.wsId}`);
    }
    this.socketOpen = false;
    this.removeWsConnection();
    if (!this.isOpen) {
      this.requestDispose();
    }
  }

  wssend(data) { //the host socket share both the status updates and the connection process now.
    if (!this.parent.socket) {
      return;
    }
    this.parent.socket.send(JSON.stringify({
      data,
      id: this.wsId
    }));
  }

  closews() {
    if (!this.parent.socket) {
      return;
    }
    if (!this.socketOpen) {
      return;
    }
    this.socketOpen = false;
    this.parent.socket.send(JSON.stringify({
      disconnect: true,
      id: this.wsId
    }));
    this.removeWsConnection();
  }

  onwsmsg(data) { //message handler.
    try{
      var json = JSON.parse(data);
    }catch(e){}
    if (json.signal) {
      this.peer.signal(json.signal);
    }
  }

  init() {
    var _this = this;
    this.isOpen = true;
    
    this.wssend(JSON.stringify({ rtcConfig: this.rtcConfig }));

    this.peer = new SimplePeer({
      initiator: false,
      trickle: true,
      config: this.parent.rtcConfig,
      channelConfig: {
        ordered: false,          // Do NOT wait for missing packets
        maxRetransmits: 0,       // Do NOT try to resend lost packets
        priority: 'high'         // Hints to the browser to prioritize this traffic
      }
    });

    this.peer.on("error", (err) => {});

    this.peer.on("connect", () => {
      console.log(`[Relay ListenChannel]: Peer connection established IP: ${_this.ip} ID: ${_this.id} Websocket ID: ${_this.wsId}`);
      _this.isOpen = true;
      _this.closews(); //close once the handshake is finished.
    });

    this.peer.on("signal", (data) => {
      if (!_this.isOpen) {
        return;
      }
      _this.wssend(JSON.stringify({ signal: data }));
    });

    this.peer.on("close", () => {
      console.log(`[Relay ListenChannel]: Peer connection closed IP: ${_this.ip} ID: ${_this.id} Websocket ID: ${_this.wsId}`);
      _this.closews();
      _this.handleClose();
      _this.isOpen = false;
    });

    this.peer.on("data", (data) => {
      if (_this.ondata) { //this is added by listen.js
        _this.ondata(data);
      }
    });
  }

  handleClose() {
    if (this.peer) {
      try {
        this.peer.destroy();
      } catch (e) {}
      this.peer = null;
    }
    this.closews();
    this.isOpen = false;
    if (this.requestDispose) {
      this.requestDispose();
    }
  }

  dispose() {
    this.isOpen = false;
    if (this.peer) {
      try{
      this.peer.destroy();
      }catch(e){}
      this.peer = null;
    }
    this.closews();
    this.requestDispose = null;
    if (!this.disposed) {
      this.disposed = true;
      console.log(`[Relay ListenChannel]: Channel closed IP: ${this.ip} ID: ${this.id} Websocket ID: ${this.wsId}`);
    }
  }

  send(data) { //recieving message from srb2.
    if (this.isOpen && this.peer) {
      try {
        this.peer.send(data);
      } catch (e) {}
      return;
    }
  }
}

module.exports = ListenChannel;
