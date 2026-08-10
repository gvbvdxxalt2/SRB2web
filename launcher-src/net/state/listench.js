var { getWebsocketURL, PLACEHOLDER_IP } = require("./util.js");
var ErrorCodes = require("./errors.js");
var attachSRB2 = require("../attach.js");
var SimplePeer = require("simple-peer");

class ListenChannel {
  constructor(parent, id, ip, rtcConfig, rtcId) {
    this.parent = parent;
    this.id = id;
    this.ip = ip;
    this.rid = rtcId;
    this.rtcConfig = rtcConfig;

    this.isOpen = false;
    this.socketOpen = true;
    this.peer = null;

    this.init();
  }

  wsclosed() {
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
      id: this.id
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
      id: this.id
    }));
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
      initiator: true,
      trickle: false,
      config: this.parent.rtcConfig,
      channelConfig: {
        ordered: false,          // Do NOT wait for missing packets
        maxRetransmits: 0,       // Do NOT try to resend lost packets
        priority: 'high'         // Hints to the browser to prioritize this traffic
      }
    });

    this.peer.on("error", (err) => {});

    this.peer.on("connect", () => {
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
