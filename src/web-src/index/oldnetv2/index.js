var Module = {};
if (window["Module"]) {
  var Module = window["Module"];
}

window.SRB2WebNet = {};
var SRB2WebNet = window.SRB2WebNet;
var dialog = require("../dialog.js");
var net = {};
var socket = null;
var resumeID = ""; //Intentionally a empty string.
var enabled = false;
var open = false;
var isListening = false; //Tell game if we're listening.
var isClosed = true;
var LZString = require("../lzstring.js");
var NetBin = require("../netbin/");
const { zlibSync, unzlibSync } = require("fflate");
var openIDs = {};

net.getSocket = function () {
  return socket;
};

function logInSRB2(msg) {
  try {
    Module.ccall("SRB2_LOG", "void", ["string"], [msg + "\n"]);
  } catch (e) {}
}

function messageHandler(e) {
  try {
    var decoded = NetBin.decode(new Uint8Array(e.data));
  } catch (e) {
    //dialog.alert(e);
    console.error("JSON parse error for websocket: ", e);
    return;
  }
  //dialog.alert(JSON.stringify(decoded.items));

  if (decoded.items[0] == "resumable") {
    resumeID = decoded.items[1];
  }
  if (decoded.items[0] == "joined") {
    var relayID = decoded.items[1];
    var ip = decoded.items[2];
    openIDs[relayID] = { ip: ip };
  }
  if (decoded.items[0] == "leave") {
    var relayID = decoded.items[1];
    openIDs[relayID] = 0;
    delete openIDs[relayID];

    Module.ccall("SRB2_NetworkClosed", "null", ["number"], [relayID || 0]);
  }
  if (decoded.items[0] == "data") {
    var relayID = decoded.items[1];
    var addr = openIDs[relayID];

    var data = unzlibSync(decoded.bin);

    var len = data.length;

    var uint8array = data;

    var ip = "0.0.0.0";
    if (addr) {
      ip = addr.ip;
    }

    var dataPtr = Module._malloc(len);
    Module.HEAPU8.set(uint8array, dataPtr);
    Module.ccall(
      "SRB2_NetworkReceive",
      "void",
      ["number", "number", "number", "string"],
      [dataPtr, len, relayID || 0, ip],
    );
    Module._free(dataPtr);

    return;
  }
  if (decoded.items[0] == "listening") {
    logInSRB2("[RELAY SERVER]: Now active on: " + decoded.items[1]);
  }
}

SRB2WebNet.SendPacket = function (relay_id, data_ptr, length) {
  if (!open) {
    return;
  }
  var data = new Uint8Array(Module.HEAPU8.buffer, data_ptr, length);
  socket.send(NetBin.encode(["data", relay_id], zlibSync(data, { level: 2 })));
  return 0;
};

SRB2WebNet.ConnectTo = function (address, port) {
  var url = address;
  if (port) {
    url += ":" + port;
  } else {
    url += ":5029";
  }
  if (!open) {
    return 0;
  }
  socket.send(NetBin.encode(["connect", url]));
  isListening = false;
  isClosed = false;
  return 0;
};

SRB2WebNet.ListenOn = function () {
  isListening = true;
  isClosed = false;
  if (!open) {
    return 0;
  }
  socket.send(NetBin.encode(["listen"]));
  return 0;
};

SRB2WebNet.CloseSocket = function () {
  isListening = false;
  isClosed = true;
  if (!open) {
    return 0;
  }
  socket.send(NetBin.encode(["close"]));
  return 0;
};

function openHandler() {
  if (isListening) {
    socket.send(NetBin.encode(["listen"]));
  }
  if (isClosed) {
    socket.send(NetBin.encode(["close"]));
  }
}

function connectLoop() {
  try {
    var url = "";
    if (window.location.protocol.startsWith("https")) {
      url += "wss://";
    } else {
      url += "ws://";
    }
    url += host;
    if (!url.endsWith("/")) {
      url += "/";
    }
    url += resumeID; //Allows resuming from the websocket connection.
    socket = new WebSocket(url);
    socket.binaryType = "arraybuffer";
    socket.onerror = function () {
      console.error("Failed to connect to relay.");
    };
    socket.onopen = function () {
      open = true;
      openHandler();
    };
    socket.onclose = function () {
      open = false;
      connectLoop();
    };
    socket.onmessage = messageHandler;
  } catch (e) {
    dialog.alert(`Failed to connect to relay server [${host}]: ${e}`);
    console.error(e);
    socket = null;
    enabled = false;
    open = false;
    isListening = false;
    isClosed = true;
    resumeID = "";
    return;
  }
}
function stopConnectLoop() {
  if (socket) {
    socket.onclose = function () {};
    socket.onmessage = function () {};
    socket.close();
  }
  socket = null;
  resumeID = "";
  open = false;
  isListening = false;
  isClosed = true;
}

net.enable = function (h) {
  if (!h) {
    return;
  }
  net.disable();
  enabled = true;
  host = h;
  if (!host.endsWith("/")) {
    host += "/";
  }
  connectLoop();
};
net.disable = function () {
  enabled = false;
  stopConnectLoop();
};

module.exports = net;
