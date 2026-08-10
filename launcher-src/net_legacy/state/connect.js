var { getWebsocketURL, PLACEHOLDER_IP } = require("./util.js");
var ErrorCodes = require("./errors.js");
var attachSRB2 = require("../attach.js");
var peer = require("simple-peer");
var rtcConfig = require("../rtc-config.js");

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
    this.isReady = false;
    this.initialQueue = [];
    this.webrtc = false;
    this.initWebsocket();
  }

  initWebsocket() {
    var { wsHost, address, port } = this;
    var connectURL = ConnectState.createConnectURL(wsHost, { address, port });
    this.url = connectURL;
    var socket = new WebSocket(connectURL);
    var _this = this;
    this.isOpen = false;
    this.isReady = false;
    socket.onclose = function (event) {
      _this.isOpen = false;
      var code = event.code;
      if (code == ErrorCodes.NETGAME_NOT_FOUND) {
        console.warn(`[Relay Connection]: Connection not found, not retrying.`);
        return;
      }
      if (!_this.webrtc) {
        console.warn(
          `[Relay Connection]: Disconnected unexpectedly, reconnecting...`,
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

  handleOpen() {
    var _this = this;
    var { socket } = this;
    this.isOpen = true;
    this.isReady = false;
    socket.onmessage = function (event) {
      if (event.data instanceof ArrayBuffer) {
        var uint8array = new Uint8Array(event.data);
      } else {
        try {
          var json = JSON.parse(event.data);
          if (json.ready) {
            _this.isReady = true;
            for (var msg of _this.initialQueue) {
              socket.send(msg);
            }
            _this.initialQueue = [];
            return;
          }
          if (json.webrtc && !_this.webrtc) {
            _this.webrtc = true;
            _this.initWebrtc();
            return;
          }
          if (_this.webrtc && json.signal) {
            _this.peer.signal(json.signal);
            return;
          }
        } catch (e) {
          var uint8array = new Uint8Array(event.data);
        }
      }

      if (uint8array && typeof uint8array.length !== "undefined") {
        try {
          attachSRB2.emitPacket(uint8array, 0, PLACEHOLDER_IP);
        } catch (e) {}
      }
    };

    attachSRB2.onpacket = this.handleSRB2Packet.bind(this);
  }

  initWebrtc() {
    this.peer = new peer({
      initiator: false,
      trickle: false,
      config: rtcConfig,
      channelConfig: {
        ordered: false,          // Do NOT wait for missing packets
        maxRetransmits: 0,       // Do NOT try to resend lost packets
        priority: 'high'         // Hints to the browser to prioritize this traffic
      }
    });
    var _this = this;

    this.peer.on("error", (err) => {
      //Shut up about your close locally errors.
    });
    this.peer.on("signal", function (data) {
      _this.socket.send(JSON.stringify({ signal: data }));
    });

    this.peer.on("connect", function () {
      _this.isReady = true;
      _this.initialQueue = [];
    });

    this.peer.on("close", () => {});

    this.peer.on("data", (data) => {
      attachSRB2.emitPacket(data, 0, PLACEHOLDER_IP);
    });

    this.socket.send(JSON.stringify({ rtcReady: true }));
  }

  handleSRB2Packet(data) {
    var { socket } = this;
    // WebRTC checks
    if (this.webrtc && this.isReady) {
      try {
        this.peer.send(data);
      } catch (e) {}
      return;
    }

    // Standard WebSocket checks
    if (!socket) {
      this.initialQueue.push(data);
      return;
    }
    // If we aren't using WebRTC, we must rely on the socket being open
    if (!this.isOpen) {
      this.initialQueue.push(data);
      return;
    }
    if (!this.isReady) {
      this.initialQueue.push(data);
      return;
    }

    // Fallback to WebSocket send
    socket.send(data);
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
  }
}

module.exports = ConnectState;
