if (window["Module"]) {
  var Module = window["Module"];
}

var LZString = require("../lzstring.js");

function logInSRB2(msg) {
  try {
    Module.ccall("SRB2_LOG", "void", ["string"], [msg + "\n"]);
  } catch (e) {}
}

class SRB2Relay {
  constructor(url) {
    this.url = url;
    this.isOpen = false;
    this.hasActiveNetgame = false;
    this.currentConnection = null;
    this.ipCache = {};

    // Performance: Reusable TextDecoder if supported (Modern Browsers)
    // Falls back to manual loop if not available.
    if (typeof TextDecoder !== "undefined") {
      this.decoder = new TextDecoder("iso-8859-1");
    }

    this.attemptConnection();
    this.addListeners();
  }

  attemptConnection() {
    this.myIP = "0.0.0.0";
    this.ws = new WebSocket(this.url);
    // Optimization: Use binaryType if you eventually switch to binary frames
    // this.ws.binaryType = 'arraybuffer';

    var _this = this;
    this.ws.onopen = (event) => {
      _this.isOpen = true;
      console.log("Relay connected!");
    };
    this.ws.onmessage = this.onRelayMessage.bind(this);
    this.ws.onclose = () => {
      _this.isOpen = false;
      if (_this.pingInterval) clearInterval(_this.pingInterval);
      console.log("Relay disconnected, attempting reconnect...");
      // 1s is reasonable, but you can lower to 500ms for more aggressive reconnects
      setTimeout(() => _this.attemptConnection(), 1000);
    };
    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  startNetgame() {
    this.hasActiveNetgame = true;
    if (this.isOpen) {
      this.ws.send(JSON.stringify({ method: "listen" }));
    }
  }

  endNetgame() {
    this.hasActiveNetgame = false;
    if (this.isOpen) {
      this.ws.send(JSON.stringify({ method: "close" }));
    }
  }

  onRelayMessage(event) {
    // Optimization: Try/Catch parsing to prevent crashes on bad packets
    try {
      var json = JSON.parse(event.data);
    } catch (e) {
      console.log("RELAY: Received invalid JSON packet. ", e);
      return;
    }

    if (json.method == "data") {
      // 1. Decompress
      var binaryString = LZString.decompress(json.data);
      if (!binaryString) return;

      var len = binaryString.length;

      // 2. OPTIMIZATION: Allocating size once is much faster than pushing to array
      var uint8array = new Uint8Array(len);
      for (var i = 0; i < len; i++) {
        uint8array[i] = binaryString.charCodeAt(i);
      }

      // 3. Pass to Module
      var dataPtr = Module._malloc(len);
      Module.HEAPU8.set(uint8array, dataPtr);
      Module.ccall(
        "SRB2_NetworkReceive",
        "void",
        ["number", "number", "number", "string"],
        [dataPtr, len, json.id || 0, json.ip],
      );
      Module._free(dataPtr);

      return;
    }

    // Handle other low-frequency messages
    if (json.method == "ready") {
      this.myIP = json.ip;
      if (this.hasActiveNetgame) {
        this.ws.send(JSON.stringify({ method: "listen" }));
      } else if (this.currentConnection) {
        this.ws.send(
          JSON.stringify({
            method: "connect",
            id: this.currentConnection,
          }),
        );
      }
    } else if (json.method == "listening") {
      logInSRB2("RELAY: Relayed netgame available on " + json.listening);
    } else if (json.method == "join") {
      /*Module.ccall('SRB2_RegisterWebClient', 'number', ['number'], [json.id]);
      var rId = json.id || 0;
      var rIp = "" + (json.ip || "0.0.0.0");
      Module.ccall(
              "SRB2_SetClientIP",
              null,
              ["number", "string", "number"],
              [rId, rIp, "" + (json.port || 0)]
            );*/
    } else if (json.method == "leave") {
      Module.ccall("SRB2_NetworkClosed", "null", ["number"], [json.id]);
    }
  }

  closeRelay() {
    if (this.ws) {
      this.ws.close();
    }
    window.SRB2WebNet = null;
  }

  addListeners() {
    var _this = this;
    window.SRB2WebNet = {
      InitNetwork: function () {
        return 0;
      },
      ConnectTo: function (address, port) {
        if (!_this.isOpen || _this.hasActiveNetgame) return 0;
        var id = address;
        if (port) {
          id += ":" + port;
        } else {
          id += ":5029";
        }
        _this.currentConnection = id;
        _this.ws.send(JSON.stringify({ method: "connect", id: id }));
        return 0;
      },
      SendPacket: function (node_id, data_ptr, length) {
        if (!_this.isOpen) return 0;

        var data = new Uint8Array(Module.HEAPU8.buffer, data_ptr, length);
        var stringData = "";

        // OPTIMIZATION: Chunked conversion
        // String.fromCharCode.apply fails on large packets (stack overflow).
        // Processing in chunks of 4096 is safe and fast.
        var chunk = 4096;
        for (var i = 0; i < length; i += chunk) {
          var end = Math.min(i + chunk, length);
          stringData += String.fromCharCode.apply(null, data.subarray(i, end));
        }

        _this.ws.send(
          JSON.stringify({
            method: "data",
            id: node_id,
            data: LZString.compress(stringData),
          }),
        );
        return 0;
      },
      ListenOn: function (port) {
        _this.currentConnection = null;
        _this.startNetgame();
        return 0;
      },
      CloseSocket: function () {
        _this.currentConnection = null;
        _this.endNetgame();
        return 0;
      },
      GetPort: function () {
        return 5029;
      },
    };
  }
}

module.exports = { SRB2Relay };
