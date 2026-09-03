var { getWebsocketURL, getHttpURL, PLACEHOLDER_IP } = require("./util.js");
var ErrorCodes = require("./errors.js");
var attachSRB2 = require("../attach.js");
var ListenChannel = require("./listench.js");
var version = require("../version.js");

class ListenState {
  static getChannelURL(wsHost, code) {
    return getWebsocketURL(wsHost) + "listench/" + code;
  }

  constructor(wsHost, isPublic = true) {
    this.listen = true;
    this.wsHost = wsHost;
    this.isOpen = false;
    this.connections = {};
    this.address = PLACEHOLDER_IP + ":5029";
    this.isPublic = isPublic;
    this.disposed = false;
    this.rtcConfig = null;
    this.wsConnections = {};
    this.pingPongInterval = null;
    console.log(`[Relay ListenState]: Starting ListenState with wsHost: ${wsHost}, ${isPublic ? "with public listing enabled" : "with public listing disabled"}.`);
    this.prepareSocket();
    this.setUpdateInterval();
  }

  setPingPongInterval() {
    clearInterval(this.pingPongInterval);
    var _this = this;
    this.pingPongInterval = setInterval(() => {
      if (!_this.isOpen) {
        return;
      }
      if (!_this.socket) {
        return;
      }
      _this.socket.send(JSON.stringify({
        ping: true
      }));
    }, 5000);
  }

  clearPingPongInterval() {
    clearInterval(this.pingPongInterval);
    this.pingPongInterval = null;
  }

  attachConnection(wsId, ip) {
    if (this.wsConnections[wsId]) {
      this.wsConnections[wsId].requestDispose();
      delete this.wsConnections[wsId];
    }
    var id = 1;
    while (this.connections[id]) {
      id += 1;
    }
    var ch = new ListenChannel(
      this,
      id,
      ip,
      this.rtcConfig,
      wsId
    );
    //window.alert("Connection request: "+id);
    this.wsConnections[wsId] = ch;
    this.connections[id] = ch;
    var _this = this;

    ch.requestDispose = () => {
      ch.dispose();
      delete _this.connections[id];
      delete this.wsConnections[wsId];
      attachSRB2.emitClose(id);
    };

    ch.removeWsConnection = () => {
      delete this.wsConnections[wsId];
    };

    ch.ondata = (data) => {
      attachSRB2.emitPacket(new Uint8Array(data), id, ip);
    };
  }

  disconnectAll() {
    for (var id of Object.keys(this.connections)) {
      this.connections[id].requestDispose();
    }
  }

  prepareSocket() {
    var _this = this;
    var host = this.wsHost;
    var iceconfigURL = getHttpURL(host)+"iceconfig";

    fetch(iceconfigURL).then((response) => {
      if (!response.ok) {
        attachSRB2.logInSRB2("[RELAY FAIL!]: Unable to get WebRTC configuration from server. Check your browser's developer tools for more details.");
        console.error("Response not OK: ",response);
        return;
      }
      response.json().then((json) => {
        if (!Array.isArray(json.iceServers)) {
          attachSRB2.logInSRB2("[RELAY FAIL!]: Unable to get WebRTC configuration from server. Check your browser's developer tools for more details.");
          console.error("IceServers aren't provided in the configuration: ", json);
          return;
        }
        _this.rtcConfig = json;
        _this.openSocket();
      }).catch((e) => {
        console.error("Unable to parse json: ",e);
        attachSRB2.logInSRB2("[RELAY FAIL!]: Unable to get WebRTC configuration from server. Check your browser's developer tools for more details.");
      });
    }).catch((e) => {
      attachSRB2.logInSRB2("[RELAY FAIL!]: Unable to get WebRTC configuration from server. Check your browser's developer tools for more details.");
      console.error("Unable to fetch webrtc configuration: ",e);
    });
  }

  openSocket() {
    var _this = this;
    var { wsHost, isPublic } = this;
    this.socket = new WebSocket(
      getWebsocketURL(wsHost) + (isPublic ? "host/public" : "host"),
    );
    this.isOpen = false;
    this._lastServerInfo = {};

    this.socket.onclose = function () {
      _this._lastServerInfo = {};
      _this.clearPingPongInterval();
      _this.isOpen = false;
      console.warn(
        `[Relay Connection]: Lost connection, connection might become unstable temporarily. Reconnecting...`,
      );
      attachSRB2.logInSRB2("[RELAY CONNECTION]: Lost connection to relay server, attempting to reconnect...");
      setTimeout(() => {
        if (_this.disposed) {
          return;
        }
        attachSRB2.logInSRB2("[RELAY CONNECTION]: Contacting relay server...");
        _this.openSocket();
      }, 500);
    };
    this.socket.onmessage = function (event) {
      var json = JSON.parse(event.data);

      if (json.method == "listening") {
        _this.address = json.url;
        if (!_this.isPublic) {
          setTimeout(() => {
            attachSRB2.logInSRB2("[NOTICE]: This is a private netgame session. Enter the following netgame IP in the multiplayer menu to connect: " + json.url);
          }, 200); //Short delay to put in front of the logs in srb2 when starting.
        } else {
          setTimeout(() => {
            attachSRB2.logInSRB2("[RELAY CONNECTION]: Now active on: " + json.url);
          }, 200); //Short delay to put in front of the logs in srb2 when starting.
        }
      }

      if (json.method == "connection") {
        _this.attachConnection(json.id, json.ip);
      }

      if (json.method == "disconnect") {
        var ch = _this.wsConnections[json.id];
        if (!ch) {
          return;
        }
        ch.wsclosed();
      }

      if (json.method == "message") {
        var ch = _this.wsConnections[json.id]; 
        if (!ch) {
          return;
        }
        ch.onwsmsg(json.data);
      }
    };
    this.setPingPongInterval();
    this.socket.onopen = function () {
      _this.isOpen = true;
      _this._lastServerInfo = {};
      attachSRB2.onpacket = _this.handleSRB2Send.bind(_this);
    };
  }

  handleSRB2Send(data, rid) {
    var ch = this.connections[rid];
    if (!ch) {
      return;
    }
    ch.send(data);
  }

  async handleUpdateInterval() {
    var { socket } = this;
    if (!this.isPublic) {
      return;
    }

    var info = await attachSRB2.getServerInfo();

    info.usesWebRTC = this.useRTC; //Completley separate property from the actual game server info.
    info.gameName = version.GAME_NAME;
    info.gameID = version.GAME_ID;

    if (!info) {
      this._lastServerInfo = {};
      return;
    }
    if (!this.isOpen) {
      this._lastServerInfo = {};
      return;
    }
    var toUpdate = {};
    var needsUpdate = false;
    for (var key of Object.keys(info)) {
      if (this._lastServerInfo[key] !== info[key]) {
        needsUpdate = true;
        this._lastServerInfo[key] = info[key];
        toUpdate[key] = info[key];
      }
    }

    if (needsUpdate) {
      socket.send(JSON.stringify({
        update: true,
        ...toUpdate
      }));
    }
  }

  setUpdateInterval() {
    this._lastServerInfo = {};
    this.updateInterval = setInterval(
      this.handleUpdateInterval.bind(this),
      1000,
    );
  }

  dispose() {
    this.clearPingPongInterval();
    if (this.socket) {
      this.socket.onclose = () => {};
      this.socket.close();
    }
    this.socket = null;
    this.disposed = true;
    this.disconnectAll();
    clearInterval(this.updateInterval);
    attachSRB2.onpacket = null;
    console.log(`[Relay ListenState]: State disposed & going offline.`);
  }
}

module.exports = ListenState;
