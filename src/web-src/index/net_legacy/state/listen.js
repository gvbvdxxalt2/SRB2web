var { getWebsocketURL, PLACEHOLDER_IP } = require("./util.js");
var ErrorCodes = require("./errors.js");
var attachSRB2 = require("../attach.js");
var ListenChannel = require("./listench.js");

class ListenState {
  static getChannelURL(wsHost, code) {
    return getWebsocketURL(wsHost) + "listench/" + code;
  }

  constructor(wsHost, isPublic = true, useRTC = false) {
    this.listen = true;
    this.wsHost = wsHost;
    this.isOpen = false;
    this.connections = {};
    this.address = PLACEHOLDER_IP + ":5029";
    this.isPublic = isPublic;
    this.disposed = false;
    this.useRTC = !!useRTC;
    this.openSocket();
    this.setUpdateInterval();
  }

  attachConnection(code, ip) {
    var id = 1;
    while (this.connections[id]) {
      id += 1;
    }
    var ch = new ListenChannel(
      ListenState.getChannelURL(this.wsHost, code),
      id,
      ip,
      this.useRTC,
    );
    this.connections[id] = ch;
    var _this = this;

    ch.requestDispose = () => {
      ch.dispose();
      delete _this.connections[id];
      attachSRB2.emitClose(id);
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
      _this.isOpen = false;
      console.warn(
        `[Relay Connection]: Lost connection, connection might become unstable temporarily. Reconnecting...`,
      );
      attachSRB2.logInSRB2("[RELAY CONNECTION]: Lost connection to relay server, attempting to reconnect...");
      setTimeout(() => {
        if (_this.disposed) {
          return;
        }
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
          }, 100); //Short delay to put in front of the logs in srb2 when starting.
        } else {
          setTimeout(() => {
            attachSRB2.logInSRB2("[RELAY CONNECTION]: Now active on: " + json.url);
          }, 100); //Short delay to put in front of the logs in srb2 when starting.
        }
      }

      if (json.method == "incoming") {
        _this.attachConnection(json.channel, json.ip);
      }
    };
    this.socket.onopen = function () {
      _this.isOpen = true;
      _this._lastServerInfo = {};
      attachSRB2.onpacket = _this.handleSRB2Send.bind(_this);
    };
  }

  handleSRB2Send(data, id) {
    var ch = this.connections[id];
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
      socket.send(JSON.stringify(toUpdate));
    }
  }

  setUpdateInterval() {
    this._lastServerInfo = {};
    this.updateInterval = setInterval(
      this.handleUpdateInterval.bind(this),
      100,
    );
  }

  dispose() {
    if (this.socket) {
      this.socket.onclose = () => {};
      this.socket.close();
    }
    this.socket = null;
    this.disposed = true;
    this.disconnectAll();
    clearInterval(this.updateInterval);
    attachSRB2.onpacket = null;
  }
}

module.exports = ListenState;
