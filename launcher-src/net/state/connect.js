var { getWebsocketURL, getHttpURL, PLACEHOLDER_IP } = require("./util.js");
var ErrorCodes = require("./errors.js");
var attachSRB2 = require("../attach.js");
var peer = require("simple-peer");

class ConnectState {
  static createConnectURL(wsHost, { address, port }) {
    var connectURL = address;
    if (port) {
      connectURL += ":" + port;
    } else {
      connectURL += ":5029";
    }

    return `${getWebsocketURL(wsHost)}connect/${connectURL.trim()}`;
  }

  constructor(wsHost, { address, port }) {
    this.connect = true;
    this.address = address;
    this.port = port;

    this.wsHost = wsHost;
    this.disposed = false;
    this.isOpen = false;
    this.socketOpen = false;
    this.peer = null;
    this.socket = null;
    this.rtcConfig = null;
    this.initWebsocket();
  }

  initWebsocket() {
    var { wsHost, address, port } = this;
    var _this = this;
    var connectURL = ConnectState.createConnectURL(wsHost, { address, port });
    this.url = connectURL;
    console.log(`[Relay ConnectState]: Attempting to connect to ${connectURL}`);

    if (this.peer) {
      try{
        this.peer.destroy();
      }catch(e){}
      this.peer = null;
    }
    this.isOpen = false;
    this.socketOpen = false;
    this.initialQueue = [];

    var socket = new WebSocket(connectURL);

    socket.onclose = function (event) {
      _this.socketOpen = false;
      var code = event.code;
      if (code == ErrorCodes.NETGAME_NOT_FOUND) {
        console.warn(`[Relay ConnectState]: Connection not found, not retrying.`);
        return;
      }
      if (!_this.isOpen) {
        console.warn(
          `[Relay ConnectState]: Disconnected unexpectedly, reconnecting...`,
        );
        socket.onmessage = () => {};
        setTimeout(() => {
          if (_this.disposed) {
            return;
          }
          _this.initWebsocket();
        },500);
      }
    };
    socket.binaryType = "arraybuffer";
    socket.onopen = this.handleOpen.bind(this);
    this.socket = socket;
  }

  peerSetup(rtcConfig) {
    var _this = this;
    this.rtcConfig = rtcConfig;
    this.peer = new peer({
      initiator: true,
      trickle: true,
      config: this.rtcConfig,
      channelConfig: {
        ordered: false,          // Do NOT wait for missing packets
        maxRetransmits: 0,       // Do NOT try to resend lost packets
        priority: 'high'         // Hints to the browser to prioritize this traffic
      }
    });
    this.peer.on("error", () => {});
    this.peer.on("signal", (data) => {
      if (!_this.socketOpen) {
        return;
      }
      _this.socket.send(JSON.stringify({
        signal: data
      }));
    });
    this.peer.on("connect", () => {
      _this.isOpen = true;
      _this.socket.close();
      for (var msg of _this.initialQueue) {
        _this.peer.send(msg);
      }
      _this.initialQueue = [];
      console.log(`[Relay ConnectState]: Peer connection established.`);
    });
    this.peer.on("close", () => {
      if (!_this.isOpen) {
        _this.isOpen = false;
        console.warn(
          `[Relay ConnectState]: Peer connection closed without completing handshake, retrying handshake...`,
        );
        if (_this.socket) {
          _this.socket.onmessage = () => {};
          _this.socket.onclose = () => {};
          try{
            _this.socket.close();
          } catch (e) {}
        }
        setTimeout(() => {
          if (_this.disposed) {
            return;
          }
          _this.initWebsocket();
        },500);
        return;
      }
      _this.isOpen = false;
      console.log(`[Relay ConnectState]: Peer connection closed.`);
    });
    this.peer.on("data", (data) => { //send straight to SRB2.
      attachSRB2.emitPacket(data, 0, PLACEHOLDER_IP);
    });
  }

  handleOpen() {
    var _this = this;
    var { socket } = this;
    this.isOpen = false;
    this.socketOpen = true;
    console.log(
      `[Relay ConnectState]: Websocket connection established. Waiting for WebRTC handshake to complete...`,
    );
    socket.onmessage = function (event) {
      if (event.data instanceof ArrayBuffer) {
        try{
          socket.close();
        }catch(e){}
        return;
      } else {

        var json = JSON.parse(event.data);
        if (json.rtcConfig) {
          _this.peerSetup(json.rtcConfig);
        }
        if (json.signal && _this.peer) {
          _this.peer.signal(json.signal);
        }

      }
    };

    attachSRB2.onpacket = this.handleSRB2Packet.bind(this);
  }

  handleSRB2Packet(data) {
    if (this.isOpen) {
      try {
        this.peer.send(data);
      } catch (e) {}
      return;
    } else {
      this.initialQueue.push(data);
    }
  }

  dispose() {
    if (!this.disposed) {
      this.disposed = true;
      if (this.socket) {
        this.socket.onclose = () => {};
        this.socket.close();
      }
      if (this.peer) {
        this.peer.destroy();
        this.peer = null;
      }
      this.socket = null;
      this.initWebsocket = () => {};
      this.initialQueue = null;
    }
    attachSRB2.onpacket = null;
    console.log(`[Relay ConnectState]: State disposed & going offline.`);
  }
}

module.exports = ConnectState;
