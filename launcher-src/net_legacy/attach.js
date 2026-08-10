var attach = {};
var Module = {};
if (window["Module"]) {
  var Module = window["Module"];
}

class SRB2WebNet {
  static InitNetwork() {
    if (attach.oninit) {
      attach.oninit();
    }
    return 0;
  }

  static ConnectTo(address, port) {
    if (attach.onconnect) {
      attach.onconnect(address, port);
    }
    return 0;
  }

  static SendPacket(node_id, data_ptr, length) {
    if (attach.onpacket) {
      var data = new Uint8Array(Module.HEAPU8.buffer, data_ptr, length);
      attach.onpacket(data, node_id);
    }
    return 0;
  }

  static ListenOn(port) {
    if (attach.onlisten) {
      attach.onlisten(port);
    }
    return 0;
  }

  static CloseSocket() {
    if (attach.onclose) {
      attach.onclose();
    }
    return 0;
  }
}
window.SRB2WebNet = SRB2WebNet;

// Pre-allocate these outside the function to avoid GC hits
var SRB2_Receive = null;
var receiveBufferPtr = null; 
attach.emitPacket = function (data, id, ip) {
  if (!SRB2_Receive) {
    SRB2_Receive = Module.cwrap("SRB2_NetworkReceive", "void", ["number", "number", "number", "string"]);
  }
  if (!receiveBufferPtr) {
    receiveBufferPtr = Module._malloc(2048);
  }
  Module.HEAPU8.set(data, receiveBufferPtr);
  SRB2_Receive(receiveBufferPtr, data.length, +id || 0, ip);
};

attach.emitClose = function (id) {
  try {
    Module.ccall("SRB2_NetworkClosed", "null", ["number"], [id || 0]);
  } catch (e) {}
};

attach.logInSRB2 = function (msg) {
  try {
    if (!Module.ccall) {
      return;
    }
    Module.ccall("SRB2_LOG", "void", ["string"], [msg + "\n"]);
  } catch (e) {}
};

var pendingServerInfoResponses = [];

window.SRB2_ServerInfoResponse = function (info) {
  for (var func of pendingServerInfoResponses) {
    func(info);
  }
};

attach.getServerInfo = function () {
  return new Promise((resolve, reject) => {
    pendingServerInfoResponses.push(resolve);
    try {
      Module.ccall("SRB2_GetServerInfo", "void", [], []);
    } catch (e) {}
  });
};

module.exports = attach;
