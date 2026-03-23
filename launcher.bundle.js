/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 288
(module, __unused_webpack_exports, __webpack_require__) {

var RelayOption = __webpack_require__(9153);

module.exports = [
  {
    element: "style",
    textContent: __webpack_require__(3448),
  },
  {
    element: "style",
    textContent: "[hidden] { display: none !important; }",
  },
  {
    element: "div",
    className: "srb2BG",
  },
  {
    element: "div",
    className: "launcherMain",
    gid: "launcherMain",
    children: [
      {
        element: "img",
        style: {
          width: "100%",
          height: "200px",
          objectFit: "contain",
        },
        src: "images/srb2logo.png",
      },
      {
        element: "button",
        className: "button playButton",
        children: [
          {
            element: "img",
            src: "images/play.svg",
            style: {
              height: "32px",
            },
          },
          {
            element: "span",
            textContent: "Play",
          },
        ],
        gid: "playButton",
      },
      {
        element: "a",
        className: "button fsButton",
        href: "file.html",
        target: "_blank",
        children: [
          {
            element: "img",
            src: "images/folder.svg",
            style: {
              height: "32px",
            },
          },
          {
            element: "span",
            textContent: "Manage files & addons",
          },
        ],
        gid: "fsButton",
      },
      { element: "div", className: "sep" },
      {
        element: "span",
        className: "sectionHeader",
        textContent: "Relay server configuration:",
      },
      {
        element: "div",
        style: {
          display: "flex",
        },
        children: [
          {
            element: "span",
            style: { fontWeight: "bold" },
            textContent: "Enable relay server:",
          },
          {
            element: "input",
            type: "checkbox",
            gid: "relayServerCheckbox",
          },
        ],
      },
      {
        element: "div",
        style: {
          display: "flex",
        },
        children: [
          {
            element: "span",
            style: { fontWeight: "bold" },
            textContent: "Enable WebRTC hosting (faster connection):",
          },
          {
            element: "input",
            type: "checkbox",
            gid: "webrtcHostCheckbox",
          },
        ],
      },
      {
        element: "button",
        className: "button",
        gid: "addRelayButton",
        textContent: "Add relay server",
      },
      {
        element: "button",
        className: "button",
        gid: "browsePublicGames",
        textContent: "Browse public netgames",
      },
      {
        element: "div",
        gid: "relayConfig",
        className: "relayConfig",
      },
      {
        element: "button",
        className: "button",
        gid: "addDefaultServers",
        textContent: "Add default servers",
      },
      {
        element: "div",
        style: {
          lineHeight: "20px"
        },
        children: [
          "Relay servers make it easy to host and join netgames without needing to set up port forwarding.",
          {
            element: "br",
          },
          "Keep in mind that connection speeds depend on both the relay server and the host's hardware.",
          {
            element: "br",
          },
          "To get started, click \"Use this server\" next to your preferred relay. If you run into connection issues, click the \"Add default servers\" button above to refresh the list.",
          {
            element: "br",
          },
          "Our default servers are hosted on free tiers, so they may take a moment to \"wake up\" if they have been inactive for a while.",
          {
            element: "br"
          },
          "Enabling WebRTC provides a much faster connection. This setting only applies if you are the host (clients will automatically use WebRTC if the host has it enabled).",
          {
            element: "br"
          },
          {
            element: "a",
            href: "https://github.com/gvbvdxxalt2/SRB2Web-Relay/",
            target: "_blank",
            textContent: "Source code for Relay Server.",
          },
          {
            element: "br",
          },
          
          {
            element: "h2",
            textContent: "Status details"
          },
          
          {
            element: "li",
            children: [
              {
                element: "img",
                className: "relayStatusImg",
                src: RelayOption.FETCHING_IMG
              },
              {
                element: "span",
                textContent: " - Fetching: Attempting to connect to the server."
              }
            ]
          },
          {
            element: "li",
            children: [
              {
                element: "img",
                className: "relayStatusImg",
                src: RelayOption.ONLINE_IMG
              },
              {
                element: "span",
                textContent: " - Online: The server is active and ready to go!"
              }
            ]
          },
          {
            element: "li",
            children: [
              {
                element: "img",
                className: "relayStatusImg",
                src: RelayOption.OFFLINE_IMG
              },
              {
                element: "span",
                textContent: " - Offline: The server is offline, unreachable, or blocked."
              }
            ]
          },
        ],
      },
      { element: "div", className: "sep" },
      {
        element: "div",
        children: [
          "Sonic Robo Blast 2 is a 3D Sonic the Hedgehog fangame built on a heavily modified Doom Legacy engine.",
          {
            element: "br",
          },
          " Visit ",
          {
            element: "a",
            href: "https://www.srb2.org/",
            target: "_blank",
            textContent: "srb2.org",
          },
          " for more information.",
          {
            element: "br",
          },
          "SRB2Web is developed by ",
          {
            element: "a",
            href: "https://github.com/gvbvdxxalt2",
            target: "_blank",
            textContent: "Gvbvdxx",
          },
          ", with the help of Google Gemini and other AI tools.",
          {
            element: "br",
          },
          {
            element: "a",
            href: "https://github.com/gvbvdxxalt2/SRB2web",
            target: "_blank",
            textContent: "Click here to view the source code on GitHub.",
          },
          {
            element: "br",
          },
          "Sonic Robo Blast 2, its name, characters, and all related elements are trademarks of their respective owners. This fangame is not affiliated with or endorsed by SEGA Corporation.",
        ],
        style: {
          marginTop: "20px",
          fontSize: "14px",
          color: "#ffffff",
        },
        gid: "launcherInfo",
      },
    ],
  },
  {
    element: "div",
    className: "loaderMain",
    gid: "loaderMain",
    children: [
      {
        element: "img",
        style: {
          width: "300px",
          height: "160px",
          objectFit: "contain",
        },
        src: "images/srb2logo.png",
      },
      {
        element: "div",
        gid: "loaderContent",
        textContent: "Loading...",
        style: {
          textAlign: "center",
          fontWeight: "bold",
          color: "#ffffff",
        },
      },
    ],
  },
  {
    element: "div",
    className: "logsContainer",
    gid: "dedicatedServerLogs",
    hidden: true,
  },
  {
    element: "canvas",
    className: "gameCanvas",
    gid: "gameCanvas",
    tabindex: "0",
  },

  {
    element: "div",
    gid: "publicNetgameBrowserContainer",
    className: "publicNetgameBrowserContainer",
    hidden: true,

    children: [
      {
        element: "div",
        gid: "netgameLoadingListsContainer",
        className: "netgameLoadingListsContainer",
        children: [
          {
            element: "img",
            src: "images/loading.gif",
            className: "netgameLoadingListsImg"
          },
          "Loading..."
        ]
      },
      
      {
        element: "div",
        gid: "publicNetgameBrowser",
        className: "publicNetgameBrowserDialog",
        hidden: true,
        children: [
          {
            element: "div",
            gid: "publicNetgameBrowserLeft",
            className: "publicNetgameBrowserLeft"
          },
          {
            element: "div",
            gid: "publicNetgameBrowserRight",
            className: "publicNetgameBrowserRight",
          }
        ]
      }
    ]
  }
];


/***/ },

/***/ 1053
(module) {

var configstuff = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:vpn.mikedev101.cc:3478" },
    {
      urls: "turn:vpn.mikedev101.cc:3478",
      username: "free",
      credential: "free",
    },
    { urls: "stun:freeturn.net:3478" },
    { urls: "stun:freeturn.net:5349" },
    { urls: "turn:freeturn.net:3478", username: "free", credential: "free" },
    { urls: "turn:freeturn.net:5349", username: "free", credential: "free" },
    {
      urls: "turn:numb.viagenie.ca",
      credential: "muazkh",
      username: "webrtc@live.com",
    },
    {
      urls: "turn:turn.bistri.com:80",
      credential: "homeo",
      username: "homeo",
    },
    {
      urls: "turn:turn.anyfirewall.com:443?transport=tcp",
      credential: "webrtc",
      username: "webrtc",
    },
  ],
  iceTransportPolicy: "all",
};

module.exports = window.SRB2WEB_RTC_CONFIG || configstuff;


/***/ },

/***/ 1133
(module, __unused_webpack_exports, __webpack_require__) {

var { getWebsocketURL, PLACEHOLDER_IP } = __webpack_require__(3615);
var ErrorCodes = __webpack_require__(4888);
var attachSRB2 = __webpack_require__(2052);
var peer = __webpack_require__(1770);
var rtcConfig = __webpack_require__(1053);

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
        _this.initWebsocket();
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

      if (uint8array && typeof uint8array.length !== 'undefined') {
        try{
          attachSRB2.emitPacket(uint8array, 0, PLACEHOLDER_IP);
        }catch(e){}
      }
    };

    attachSRB2.onpacket = this.handleSRB2Packet.bind(this);
  }

  initWebrtc() {
    this.peer = new peer({
      initiator: false,
      config: rtcConfig,
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


/***/ },

/***/ 1509
(module, __unused_webpack_exports, __webpack_require__) {

var { ConnectState, ListenState } = __webpack_require__(9391);
var attachSRB2 = __webpack_require__(2052);

var enabled = false;
var publicEnabled = false;
var host = "";
var curState = null;
var serverRTCEnabled = true;

attachSRB2.onconnect = function (address, port) {
  if (!enabled) {
    return;
  }
  if (curState) {
    curState.dispose();
  }
  curState = new ConnectState(host, { address, port });
};

attachSRB2.onlisten = function () {
  if (!enabled) {
    return;
  }
  if (curState) {
    curState.dispose();
  }
  curState = new ListenState(host, publicEnabled, serverRTCEnabled);
};

attachSRB2.onclose = function () {
  if (curState) {
    curState.dispose();
  }
  curState = null;
};

function enable(h) {
  if (curState) {
    curState.dispose();
    curState = null;
  }
  enabled = true;
  host = h;
}

function enablePublic() {
  publicEnabled = true;
}

function disable() {
  if (curState) {
    curState.dispose();
    curState = null;
  }
  enabled = false;
  host = null;
}

function disablePublic() {
  publicEnabled = false;
}

function enableServerWebRTC() {
  serverRTCEnabled = true;
}

function disableServerWebRTC() {
  serverRTCEnabled = false;
}

async function listPublicGames() {
  if (!enabled) {
    throw new Error(`Relay server is disabled`);
    // removed by dead control flow

  }
  if (!host) {
    throw new Error(`No host provided`);
    // removed by dead control flow

  }
  try {
    var response = await fetch(`https://${host}/public`);
    if (!response.ok) {
      throw new Error(`Got Non-OK response: ${response.status}`);
    }
  } catch (e) {
    console.warn(
      "Failed to fetch public games through https, trying http. Error message:",
      e,
    );
    try {
      var response = await fetch(`http://${host}/public`);
      if (!response.ok) {
        console.warn(
          "Failed to fetch public games, response not ok. Status:",
          response.status,
        );
        throw new Error(`Got Non-OK response: ${response.status}`);
        // removed by dead control flow

      }
    } catch (e) {
      throw e;
      // removed by dead control flow

    }
  }
  var publicNetgames = await response.json();

  return publicNetgames;
}

module.exports = {
  enable,
  disable,
  enablePublic,
  disablePublic,
  enableServerWebRTC,
  disableServerWebRTC,
  listPublicGames,
};


/***/ },

/***/ 1618
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var elements = __webpack_require__(5100);
var dialog = __webpack_require__(5925);
var relayConfig = elements.getGPId("relayConfig");
var relayServerCheckbox = elements.getGPId("relayServerCheckbox");
var webrtcHostCheckbox = elements.getGPId("webrtcHostCheckbox");
var lstorageName = "SRB2WebRelayConfig";
var RelayOption = __webpack_require__(9153);
var net = __webpack_require__(1509);

var browsePublicGames = elements.getGPId("browsePublicGames");
var publicNetgameBrowserContainer = elements.getGPId("publicNetgameBrowserContainer");
var publicNetgameBrowser = elements.getGPId("publicNetgameBrowser");
var publicNetgameBrowserLeft = elements.getGPId("publicNetgameBrowserLeft");
var publicNetgameBrowserRight = elements.getGPId("publicNetgameBrowserRight");

var relays = [];
var relayOpts = [];

var usedRelay = 0;
var relayEnabled = true;
var webrtcHostEnabled = true;

function getPublicHosts() {
	return [
		{
      host: "srb2web-lan.onrender.com",
      name: "Public server 1",
		},
	  	{
			  host: "srb2web-lan2.onrender.com",
			  name: "Public server 2",
		  },	
	    /*
		Seems like render.com doesn't allow UDP connections.
		{
	      host: "srb2web-udp-relay.onrender.com",
	      name: "SRB2 UDP to SRB2web Relay (Experimental)",
	    }*/
	];
}

var defaultRelays = getPublicHosts();


async function setBrowsePublicGamesText(count) {
  if (count == 0) {
    browsePublicGames.textContent = "Join/host a public netgame (none active yet)";
    return;
  }
  browsePublicGames.textContent = `Join/host a public netgame (${count} netgames active)`;
}
async function updatePublicNetgameCount() {
  try{
    var games = await net.listPublicGames();
    setBrowsePublicGamesText(games.length);
  }catch(e){
    setBrowsePublicGamesText(0);
  }
}

setInterval(updatePublicNetgameCount,1000*60*1);

function saveRelays() {
  relays = relayOpts.map((r) => r.save());
  localStorage.setItem(
    lstorageName,
    JSON.stringify({
      relays,
      used: usedRelay,
      enabled: relayEnabled,
      webrtc: webrtcHostEnabled,
    }),
  );
}

var currentRelayName = null;
var currentHost = null;

function updateRelayUsed() {
  relayOpts.forEach((r, i) => {
    r.setUsed(usedRelay == i);
    if (usedRelay == i) {
      currentHost = r.relay.host;
      currentRelayName = r.relay.name;
    }
  });
  if (relayEnabled) {
    net.disable();
    net.enable(currentHost);
  } else {
    net.disable();
  }
  if (webrtcHostEnabled) {
    net.enableServerWebRTC();
  } else {
    net.disableServerWebRTC();
  }

  setBrowsePublicGamesText(0);
  updatePublicNetgameCount();
}

var addRelayButton = elements.getGPId("addRelayButton");
var addDefaultServers = elements.getGPId("addDefaultServers");

function addRelayIfNotExist(relay, useThisOne) {
  if (!relay) {
    return false;
  }
  if (relays.find((r) => r.host == relay.host)) {
    return false;
  }
  relays.push(relay);
  usedRelay = relays.length-1;
  reloadRelayConfig();
  saveRelays();
  return true;
}

addRelayButton.onclick = async function () {
  var relay = await RelayOption.relayAddDialog();
  if (!relay) {
    return;
  }
  if (relays.find((r) => r.host == relay.host)) {
    dialog.alert("This relay server was already added!");
    return;
  }
  relays.push(relay);
  usedRelay = relays.length-1;
  reloadRelayConfig();
  saveRelays();
};

addDefaultServers.onclick = async function () {
  var defaults = getPublicHosts();
  if (defaults.length > 0) {
    for (var relay of defaults) {
      addRelayIfNotExist(relay);
    }
    usedRelay = relays.length-defaults.length;
    reloadRelayConfig();
    saveRelays();
  }
};

function reloadRelayConfig() {
  elements.setInnerJSON(relayConfig, []);
  relayOpts.forEach((r) => {
    r.dispose();
  });
  relayOpts = [];
  relays.forEach((relay, i) => {
    var opt = new RelayOption(
      relay,
      saveRelays,
      () => {
        //Use button clicked.
        usedRelay = i;
        updateRelayUsed();
        saveRelays();
      },
      () => {
        //Remove accepted.
        relayOpts = relayOpts.filter((r) => r.relay.host !== relay.host);
        opt.dispose();
        saveRelays();
        reloadRelayConfig();
      },
    );
    relayConfig.append(opt.div);
    relayOpts.push(opt);
  });
  updateRelayUsed();
  if (usedRelay > relayOpts.length - 1) {
    usedRelay = relayOpts.length - 1;
    updateRelayUsed();
    saveRelays();
  }

  relayServerCheckbox.checked = relayEnabled;
  webrtcHostCheckbox.checked = webrtcHostEnabled;

  if (relayOpts.length == 0) {
    elements.setInnerJSON(relayConfig, [
      {
        element: "div",
        className: "noRelayContainer",
        children: [
          {
            element: "div",
            className: "noRelayText",
            textContent: "No relay servers!",
          },
        ],
      },
    ]);
  }
}

relayServerCheckbox.onchange = function () {
  relayEnabled = relayServerCheckbox.checked;
  saveRelays();
  reloadRelayConfig();
};

webrtcHostCheckbox.onchange = async function () {
  if (!webrtcHostCheckbox.checked) {
    var confirm = await dialog.confirm(
      "Disabling WebRTC hosting will cause your hosted games to have slower connections and more input lag. Are you sure you want to disable it?",
    );
    if (!confirm) {
      webrtcHostCheckbox.checked = true;
      return;
    }
  }
  webrtcHostEnabled = webrtcHostCheckbox.checked;
  saveRelays();
  reloadRelayConfig();
};

setInterval(() => {
  relayOpts.forEach((r) => {
    r.fetchStatus();
  });
}, 1000*60*1);

var storedConfig = localStorage.getItem(lstorageName);
if (storedConfig) {
  try {
    var json = JSON.parse(storedConfig);
    usedRelay = json.used;
    relays = json.relays;
    relayEnabled = json.enabled;
    webrtcHostEnabled = json.webrtc;
  } catch (e) {
    relays = Array.from(defaultRelays);
    dialog.alert(
      `Unable to load your relay configuration, it may have been corrupted.`,
    );
    console.error(e);
  }
} else {
  relays = Array.from(defaultRelays);
}

reloadRelayConfig();
net.disablePublic();


//Browser for public games.

function closePublicList() {
  publicNetgameBrowserContainer.hidden = true;
}

function getCloseButton() {
  return {
    element: "div",
    className: "button publicNetgameBrowserCloseButton",
    textContent: "Close",
    onclick: closePublicList
  };
}

function getHostButton(hostClicked) {
  return {
      element: "div",
      className: "publicNetgameItem",
      onclick: hostClicked,
      children: [
        {
          element: "div",
          style: {display: "flex", fontSize: "32px", alignItems: "center", justifyContent: "center"},
          children: [
            {
              element: "img",
              src: "images/host.svg",
              className: "refreshIcon"
            },
            "Host public netgame"
          ]
        }
      ]
    };
}

function getReloadButton(reload) {
  return {
      element: "div",
      className: "publicNetgameItem",
      onclick: reload,
      children: [
        {
          element: "div",
          style: {display: "flex", fontSize: "32px", alignItems: "center", justifyContent: "center"},
          children: [
            {
              element: "img",
              src: "images/refresh.svg",
              className: "refreshIcon"
            },
            "Refresh"
          ]
        }
      ]
    };
}

function gameToButton(game, selectedURL, onClick) {
  return {
    element: "div",
    className: "publicNetgameItem",
    eventListeners: [{event: "click", func: onClick}],
    children: [
      {
        element: "div",
        style: {
          display: "flex",
          alignItems: "center",
          gap: "2px"
        },
        children: [
          {
            element: "img",
            className: "netgameCommunicationType",
            src: game.usesWebRTC ? "images/webrtc.svg" : "images/websocket.svg"
          },
          {
            element: "span",
            className: "netgameServerName",
            textContent: game.name
          },
        ]
      },
      {
        element: "span",
        className: "netgameServerURL",
        textContent: game.url
      },
    ]
  };
}

var { startGame } = __webpack_require__(7063);

async function launchToNetgame(game) {
  var confirmed = await dialog.confirm(`Launch game to join ${game.name}?`);
  if (!confirmed) return;

  closePublicList();
  startGame({
    joinURL: game.url
  });
}

async function launchToHost() {
  var confirmed = await dialog.confirm(`Launch game to host publicly?`);
  if (!confirmed) return;

  var autoStart = await dialog.confirm(`Skip multiplayer menu?`);

  closePublicList();
  net.enablePublic();
  if (autoStart) {
    startGame({
      host: true
    });
  } else {
    startGame();
  }
}

function displayPublicGames(games, selectedURL){
  setBrowsePublicGamesText(games.length);
  publicNetgameBrowser.hidden = false;
  elements.setInnerJSON(publicNetgameBrowserLeft, [
    {
      element: "span",
      style: {
        fontWeight: "bold"
      },
      children: [
        "Now viewing on server: ",
        {
          element: "br"
        },
        {
          element: "span",
          className: "relayHost",
          textContent: currentHost,
          style: {
            fontSize: "20px"
          }
        }
      ]
    },
    {
      element: "div",
      className: "publicGameSeparator",
    },
    getReloadButton(loadPublicList),
    getHostButton(launchToHost),
    {
      element: "div",
      className: "publicGameSeparator",
    }
  ].concat(games.map((game) => {
    return gameToButton(game, selectedURL, () => {
      displayPublicGames(games, game.url);
    });
  })));


  var game = games.find((g) => selectedURL == g.url);
  
  if (!game) {
    elements.setInnerJSON(publicNetgameBrowserRight, [
      {
        element: "span",
        className: "viewPublicNetgameDetails",
        textContent: "Click on a netgame to view it's details"
      },
      getCloseButton()
    ]);

    return;
  }

  elements.setInnerJSON(publicNetgameBrowserRight, [
    {
      element: "div",
      className: "publicNetgameDetails",
      children: [
        {
          element: "span",
          className: "netgameServerName",
          textContent: game.name
        },
        {
          element: "br"
        },
        {
          element: "span",
          className: "netgameServerURL",
          textContent: game.url
        },
        {
          element: "div",
          className: "publicGameSeparator"
        },

        {
          element: "button",
          className: "button",
          children: [
            {
              element: "div",
              style: {
                display: "flex",
                alignItems: "center",
                gap: "2px"
              },
              onclick: () => {launchToNetgame(game)},
              children: [
                {
                  element: "img",
                  style: {
                    width: "32px",
                    height: "32px",
                    objectFit: "contain"
                  },
                  src: "images/wifi.svg"
                },
                {
                  element: "span",
                  textContent: "Connect/Join"
                },
              ]
            },
          ]
        },

        {
          element: "div",
          className: "publicGameSeparator"
        },
        {
          element: "br"
        },
        {
          element: "li",
          children: [
            {
              element: "ri",
              textContent: game.mapTitle ? "Map Title: "+game.mapTitle : "(No map title)"
            },
          ]
        },
        {
          element: "li",
          children: [
            {
              element: "ri",
              textContent: game.map ? "Map: "+game.map : "(No map)"
            },
          ]
        },

        {
          element: "br"
        },
        {
          element: "div",
          className: "publicGameSeparator"
        },
        {
          element: "span",
          textContent: `Players: ${game.ingamePlayers} / ${game.maxPlayers || "(Unknown)"}`
        },
      ].concat(game.playerNames.map((name) => {
          return {
            element: "li",
            textContent: name
          };
        }))
    },
    getCloseButton(),
  ]);

}

async function loadPublicList() {
  publicNetgameBrowserContainer.hidden = false;
  publicNetgameBrowser.hidden = true;
  try{
    var games = await net.listPublicGames();
  }catch(e){
    dialog.alert("Failed to fetch public hosted games. Make sure your selected relay server is working and try again.\nError: "+e);
    console.error(e);
    publicNetgameBrowserContainer.hidden = true;
    return;
  }

  displayPublicGames(games);
}

browsePublicGames.addEventListener("click", async () => {
  if (!relayEnabled) {
    dialog.alert("You don't have the relay server enabled!");
    return;
  }
  if (usedRelay < 0) {
    dialog.alert("You don't have a relay server selected");
    return;
  }

  loadPublicList();
});


/***/ },

/***/ 2052
(module) {

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

attach.emitPacket = function (data, id, ip) {
  var dataPtr = Module._malloc(data.length);
  Module.HEAPU8.set(data, dataPtr);
  Module.ccall(
    "SRB2_NetworkReceive",
    "void",
    ["number", "number", "number", "string"],
    [dataPtr, data.length, +id || 0, ip],
  );
  Module._free(dataPtr);
};

attach.emitClose = function (id) {
  try {
    Module.ccall("SRB2_NetworkClosed", "null", ["number"], [id || 0]);
  } catch (e) {}
};

attach.logInSRB2 = function (msg) {
  try {
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


/***/ },

/***/ 3052
(module, __unused_webpack_exports, __webpack_require__) {

var { getWebsocketURL, PLACEHOLDER_IP } = __webpack_require__(3615);
var ErrorCodes = __webpack_require__(4888);
var attachSRB2 = __webpack_require__(2052);
var ListenChannel = __webpack_require__(6091);

class ListenState {
  static getChannelURL(wsHost, code) {
    return getWebsocketURL(wsHost) + "listench/" + code;
  }

  constructor(wsHost, isPublic = true, useRTC = false) {
    this.wsHost = wsHost;
    this.isOpen = false;
    this.connections = {};
    this.address = PLACEHOLDER_IP + ":5029";
    this.isPublic = isPublic;
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
      _this.openSocket();
    };
    this.socket.onmessage = function (event) {
      var json = JSON.parse(event.data);

      if (json.method == "listening") {
        _this.address = json.url;
        attachSRB2.logInSRB2("[RELAY CONNECTION]: Now active on: " + json.url);
      }

      if (json.method == "incoming") {
        _this.attachConnection(json.channel, json.ip);
      }
    };
    this.socket.onopen = function () {
      _this.isOpen = true;
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
    this.disconnectAll();
    clearInterval(this.updateInterval);
    attachSRB2.onpacket = null;
  }
}

module.exports = ListenState;


/***/ },

/***/ 3448
(module) {

module.exports = "@font-face {\n  src: url(\"pixel3.ttf\");\n  font-family: PixelFont;\n  font-size: 20px;\n}\n\nbody {\n  background: #000000;\n  font-weight: bold;\n  font-family: PixelFont, Arial, sans-serif;\n  letter-spacing: 1px;\n  margin: 0;\n  padding: 0;\n  /* Use dynamic viewport height for iOS Safari compatibility */\n  height: 100dvh;\n  height: 100vh;\n  width: 100vw;\n  overflow-x: auto;\n  overflow-y: auto;\n}\n\n.sep {\n  width: 100%;\n  height: 10px;\n  margin-bottom: 10px;\n  border-bottom-style: solid;\n  border-bottom-width: 2px;\n  border-bottom-color: rgb(0, 110, 255);\n}\n\na {\n  all: unset;\n  color: #00ffff;\n  text-decoration: none;\n}\na:hover {\n  text-decoration: underline;\n  cursor: pointer;\n}\n\n.srb2BG {\n  position: fixed;\n  top: 0px;\n  left: 0px;\n  width: 100%;\n  height: 100%;\n  background: url(\"images/title-bg.png\") center/cover no-repeat;\n  pointer-events: none;\n  image-rendering: pixelated;\n  filter: brightness(0.6);\n}\n\n.launcherMain {\n  min-width: 600px;\n  width: calc(100vw - 400px);\n  height: calc(100svh - 0px);\n  padding: 10px 10px;\n  box-sizing: border-box;\n\n  position: absolute;\n  left: 50%;\n  top: 0px;\n  transform: translate(-50%, 0px);\n\n  background: rgba(0, 0, 0, 0.619);\n  color: #ffffff;\n  border-radius: 1px;\n  overflow: auto;\n}\n\n.button {\n  all: unset;\n  padding: 5px 5px;\n  background: rgba(0, 0, 0, 0.5);\n  color: #ffffff;\n  border-radius: 3px;\n}\n\n.button:hover {\n  background: rgba(117, 117, 117, 0.5);\n  cursor: pointer;\n}\n\n.playButton {\n  font-size: 30px;\n  font-weight: bold;\n  background: rgba(9, 255, 0, 0.5);\n  width: 100%;\n  text-align: center;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n\n  gap: 10;\n}\n\n.playButton:hover {\n  background: rgba(9, 255, 0, 0.7);\n}\n\n.fsButton {\n  font-size: 30px;\n  font-weight: bold;\n  background: rgba(255, 157, 0, 0.5);\n  width: 100%;\n  text-align: center;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  gap: 10;\n}\n\n.fsButton:hover {\n  background: rgba(255, 157, 0, 0.7);\n}\n\n.gameCanvas {\n  background: black;\n  width: 100%;\n  height: 100%;\n  position: fixed;\n  top: 0;\n  left: 0;\n  image-rendering: pixelated;\n  object-fit: fill;\n  z-index: 9999;\n}\n\n.sectionHeader {\n  display: block;\n  font-weight: bold;\n  font-size: 30px;\n  margin-bottom: 10px;\n}\n\n.loaderMain {\n  position: fixed;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n}\n\n.relayConfig {\n  width: calc(100% - 0px);\n  height: fit-content;\n  max-height: 200px;\n  min-height: 100px;\n  box-sizing: border-box;\n  padding: 2px;\n  color: #ffffff;\n  border-radius: 0px;\n  border-style: solid;\n  border-width: 2px;\n  border-color: rgba(0, 38, 255, 0.747);\n  overflow: auto;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n\n.noRelayContainer {\n}\n\n.noRelayText {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-direction: row;\n\n  color: rgba(255, 255, 255, 1);\n}\n\n.configuredRelay {\n  width: 100%;\n  min-height: 100px;\n  box-sizing: border-box;\n  color: #ffffff;\n  background: rgba(255, 255, 255, 0.2);\n  border-radius: 3px;\n  display: flex;\n  flex-direction: column;\n  padding: 5px;\n  flex-shrink: 0;\n  overflow: wrap;\n  text-wrap: wrap;\n}\n\n.configuredRelay[used] {\n  background: rgba(255, 255, 255, 0.4);\n}\n\n.relayName {\n  font-size: 20px;\n  font-weight: bold;\n  overflow: wrap;\n  text-wrap: wrap;\n}\n\n.relayHost {\n  margin-left: auto;\n  font-size: 10px;\n  font-style: italic;\n  color: rgb(0, 110, 255);\n  user-select: none;\n  font-weight: bold;\n}\n\n.relayHostClickable:hover {\n  cursor: pointer;\n  text-decoration: underline;\n}\n\n.relayStatus {\n  display: flex;\n  gap: 3px;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  width: 50px;\n  height: 50px;\n}\n\n.relayStatusText {\n  color: rgb(255, 255, 255);\n  font-weight: bold;\n  font-size: 10px;\n  text-align: center;\n}\n.relayStatusText[state=\"offline\"] {\n  color: rgb(255, 0, 0);\n}\n.relayStatusText[state=\"online\"] {\n  color: rgb(0, 255, 0);\n}\n\n.relayStatusImg {\n  width: 28px;\n  height: 28px;\n  image-rendering: pixelated;\n}\n\n.relayDescription {\n  font-size: 10px;\n  white-space: pre;\n  padding-left: 5px;\n  overflow: wrap;\n  text-wrap: wrap;\n}\n\n.relayPublicCount {\n  font-size: 14px;\n  white-space: pre;\n  padding-left: 5px;\n  overflow: wrap;\n  text-wrap: wrap;\n  font-weight: bold;\n}\n\n.relayButtons {\n  margin-top: 2px;\n  display: block;\n}\n\n.relayButtons > .button {\n  margin: 1px 1px;\n}\n\n:root {\n  --popup-dialog-font: Arial, sans-serif;\n  --popup-dialog-background: #fff;\n  --popup-dialog-border-radius: 10px;\n  --popup-dialog-text-color: #000;\n  --popup-dialog-button-background: #5985ff;\n  --popup-dialog-button-hover-background: #4275ff;\n  --popup-dialog-button-text-color: #fff;\n  --popup-dialog-button-radius: 5px;\n  --popup-dialog-input-background: #fff;\n  --popup-dialog-input-border-width: 1.5px;\n  --popup-dialog-input-border-color: #bababa;\n  --popup-dialog-input-text-color: #000;\n  --popup-dialog-message-size: 16px;\n}\n\n.windowDialogContainer {\n  font-family: var(--popup-dialog-font);\n}\n\n.windowDialogBackground {\n  background-color: black;\n  backdrop-filter: blur(2px);\n}\n\n.windowDialogBox {\n  background: var(--popup-dialog-background);\n  border-radius: var(--popup-dialog-border-radius);\n  color: var(--popup-dialog-text-color);\n}\n\n.windowDialogButton {\n  background: var(--popup-dialog-button-background);\n  color: var(--popup-dialog-button-text-color);\n  border-radius: var(--popup-dialog-button-radius);\n  padding: 4px 8px;\n  border: none;\n  cursor: pointer;\n}\n\n.windowDialogButton:hover {\n  background: var(--popup-dialog-button-hover-background);\n}\n\n.windowDialogInput {\n  background: var(--popup-dialog-input-background);\n  border: var(--popup-dialog-input-border-width) solid\n    var(--popup-dialog-input-border-color);\n  color: var(--popup-dialog-input-text-color);\n  outline: none;\n  border-radius: 4px;\n  padding: 4px;\n}\n\n.windowDialogHeader {\n  font-weight: bold;\n  font-size: var(--popup-dialog-message-size);\n}\n\n.logsContainer {\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100svh;\n    background: hsl(0, 0%, 13%);\n    color: #adadad;\n    font-family: monospace;\n    font-size: 14px;\n    overflow: auto;\n    box-sizing: border-box;\n    padding: 2px;\n    z-index: 1500;\n}\n\n.publicNetgameBrowserContainer {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100svh;\n  background: rgba(0,0,0,0.5);\n}\n\n.publicNetgameBrowserDialog {\n  position: fixed;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  width: calc(100% - 150px);\n  height: calc(100svh - 150px);\n  min-width: 640px;\n  min-height: 360px;\n  border-radius: 3px;\n  background: rgba(255,255,255,1);\n  display: flex;\n  flex-direction: row;\n}\n\n.publicNetgameBrowserLeft {\n  display: flex;\n  flex-direction: column;\n  min-width: 200px;\n  width: calc(100% - 450px);\n  max-width: 300px;\n  border-right: 2px solid rgba(0,0,0,0.3);\n  box-sizing: border-box;\n  flex-shrink: 0;\n  flex-grow: 0;\n  gap: 3px;\n  overflow: auto;\n}\n\n.publicNetgameItem {\n  width: 100%;\n  box-sizing: border-box;\n  height: fit-content;\n  min-height: 50px;\n  padding: 5px 5px;\n  background: rgba(0,0,0,0.5);\n  color: rgba(255,255,255,1);\n  border-radius: 4px;\n  flex-shrink: 0;\n}\n\n.publicNetgameItem:hover {\n  background: rgba(0,0,0,0.7);\n  text-decoration: underline;\n  cursor: pointer;\n}\n\n.publicNetgameItem[viewing] {\n  text-decoration: underline;\n  cursor: unset;\n}\n\n.publicGameSeparator {\n  width: 100%;\n  height: 0px;\n  margin-top: 3px;\n  margin-bottom: 3px;\n  border-bottom-color: black;\n  border-bottom-style: dashed;\n  border-bottom-width: 2px;\n  box-sizing: border-box;\n}\n\n.publicNetgameBrowserRight {\n  display: block;\n  flex-grow: 1;\n  position: relative;\n}\n\n.publicNetgameBrowserCloseButton {\n  position: absolute;\n  top: 0;\n  right: 0;\n  font-size: 30px;\n}\n\n.viewPublicNetgameDetails {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  font-weight: bold;\n  background: rgba(0,0,0,0.5);\n  color: rgba(255,255,255,1);\n  padding: 5px 5px;\n  border-radius: 3px;\n}\n\n.publicNetgameDetails {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  width: 100%;\n  height: 100%;\n  padding: 10px 10px;\n  box-sizing: border-box;\n}\n\n.refreshIcon {\n  width: 32px;\n  height: 32px;\n}\n\n.netgameServerName {\n  font-size: 30px;\n}\n\n.netgameServerURL {\n  font-size: 16px;\n  margin-left: 5px;\n  font-family: arial;\n}\n\n.netgameCommunicationType {\n  width: 25px;\n  height: 25px;\n  object-fit: contain;\n  padding: 5px 5px;\n  border-radius: 3px;\n  background: rgba(255,255,255,0.4);\n}\n\n.netgameLoadingListsContainer {\n  position: fixed;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%,-50%);\n  width: fit-content;\n  height: fit-content;\n  box-sizing: border-box;\n  padding: 4px 4px;\n  background: rgba(255,255,255,0.5);\n  color: rgba(0,0,0,1);\n  border-radius: 4px;\n  font-size: 20px;\n  font-weight: bold;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-direction: row;\n  gap: 8px;\n}\n\n.netgameLoadingListsImg {\n  width: 30px;\n  height: 30px;\n}\n";

/***/ },

/***/ 3615
(module) {

function getWebsocketURL(wsHost) {
  var url = "";
  if (window.location.protocol.startsWith("https")) {
    url += "wss://";
  } else {
    url += "ws://";
  }
  url += wsHost;
  if (!url.endsWith("/")) {
    url += "/";
  }
  return url;
}

var PLACEHOLDER_IP = "0.0.0.0";

module.exports = { getWebsocketURL, PLACEHOLDER_IP };


/***/ },

/***/ 4888
(module) {

class WSErrorCodes {
  //(4000-4999)
  static BAD_PATH = 4000;
  static DATA_CHANNEL_INVALID = 4001;
  static HOST_CONNECT_TIMEOUT = 4002;
  static NETGAME_NOT_FOUND = 4003;
}

module.exports = WSErrorCodes;


/***/ },

/***/ 5100
(module) {

//Webpack compatible version of elements module from gvbvdxx-pack-2
//With some new updates as well.
var __GP_elements = {};
function isDOM(Obj) {
  return Obj instanceof Element;
}
var elements = {
  appendElements: function (elm, appendArray) {
    for (var appendElm of appendArray) {
      elm.append(appendElm);
    }
  },
  getStylelessAJSON(props = {}) {
    return {
      element: "a",
      style: {
        all: "unset",
      },
      ...props,
    };
  },
  removeAllChildren: function (elm) {
    Array.from(elm.children).forEach((elm) => elm.remove());
  },
  appendElementsFromJSON: function (elm, appendJSONArray) {
    var elms = elements.createElementsFromJSON(appendJSONArray);
    elements.appendElements(elm, elms);
    return elms;
  },
  setInnerJSON: function (elm, appendJSONArray) {
    elements.removeAllChildren(elm);
    var elms = elements.createElementsFromJSON(appendJSONArray);
    elements.appendElements(elm, elms);
    return elms;
  },
  createElementsFromJSON: function (jsonelmArray) {
    //converts an array of json's with element properties to a element list.
    function runElements(arry) {
      var myRealElms = [];
      for (var elm of arry) {
        if (!isDOM(elm)) {
          if (typeof elm == "object") {
            var realElm = document.createElement(elm.element);
            for (var attriName of Object.keys(elm)) {
              if (!(attriName == "element" || attriName == "children")) {
                var attributeValue = elm[attriName];
                var setattri = true;
                if (attriName == "gid") {
                  __GP_elements[attributeValue] = realElm;
                  setattri = false;
                }
                if (attriName == "style") {
                  for (var styleName of Object.keys(attributeValue)) {
                    var styleValue = attributeValue[styleName];
                    realElm.style[styleName] = styleValue;
                  }
                  setattri = false;
                }
                if (attriName == "styleProperties") {
                  for (var styleName of Object.keys(attributeValue)) {
                    var styleValue = attributeValue[styleName];
                    realElm.style.setProperty(styleName, styleValue);
                  }
                  setattri = false;
                }
                if (attriName == "dangerouslySetInnerHTML") {
                  realElm.innerHTML = attributeValue;
                  setattri = false;
                } else if (attriName == "innerHTML") {
                  console.trace(
                    'Warning: The "innerHTML" property is deprecated. ' +
                      'Please use "dangerouslySetInnerHTML" instead.',
                  );
                  realElm.innerHTML = attributeValue;
                  setattri = false;
                }
                if (attriName == "textContent") {
                  realElm.textContent = attributeValue;
                  setattri = false;
                }
                if (attriName == "src") {
                  realElm.src = attributeValue;
                  setattri = false;
                }
                if (attriName == "srcObject") {
                  realElm.srcObject = attributeValue;
                  setattri = false;
                }
                if (attriName == "value") {
                  realElm.value = attributeValue;
                  setattri = false;
                }
                if (attriName == "min") {
                  realElm.min = attributeValue;
                  setattri = false;
                }
                if (attriName == "max") {
                  realElm.max = attributeValue;
                  setattri = false;
                }
                if (attriName == "width") {
                  realElm.width = attributeValue;
                  setattri = false;
                }
                if (attriName == "height") {
                  realElm.height = attributeValue;
                  setattri = false;
                }
                if (attriName == "className") {
                  realElm.className = attributeValue;
                  setattri = false;
                }
                if (attriName == "hidden") {
                  if (attributeValue) {
                    realElm.hidden = true;
                  }
                  setattri = false;
                }
                if (attriName == "selected") {
                  if (attributeValue) {
                    realElm.selected = true;
                  }
                  setattri = false;
                }
                if (attriName == "eventListeners") {
                  if (Array.isArray(attributeValue)) {
                    for (var event of attributeValue) {
                      realElm.addEventListener(event.event, event.func);
                    }
                  }
                  setattri = false;
                }
                if (attriName == "GPWhenCreated") {
                  attributeValue.bind(realElm)(realElm); //This seems weird, but first realElm is the "this" value refrence, then the second realElm is for the function value, as well as calling the new binded function.
                  setattri = false;
                }
                if (setattri) {
                  if (typeof realElm[attriName] !== "undefined") {
                    realElm[attriName] = attributeValue;
                    setattri = false;
                  }
                }
                if (setattri) {
                  realElm.setAttribute(attriName, attributeValue);
                }
              }
            }

            if (elm.children) {
              var elmsToAppend = runElements(elm.children);
              for (var elmAppend of elmsToAppend) {
                realElm.append(elmAppend);
              }
            }
            myRealElms.push(realElm);
          } else {
            myRealElms.push(elm);
          }
        } else {
          if (elm) {
            myRealElms.push(elm);
          }
        }
      }
      return myRealElms;
    }
    return runElements(jsonelmArray);
  },
  getById: function (id) {
    return document.getElementById(id);
  },
  setGPId: function (el, id) {
    __GP_elements[id] = el;
    return el;
  },
  disposeGPId: function (id) {
    __GP_elements[id] = undefined;
  },
  getGPId: function (id) {
    if (__GP_elements[id]) {
      return __GP_elements[id];
    }
    return null;
  },
  body: document.body,
  __GP_elements: __GP_elements,
};
module.exports = elements;


/***/ },

/***/ 5187
() {

/* (ignored) */

/***/ },

/***/ 5925
(module) {

var dialog = {
  styles: {
    //Container (Holds both background and dialog box)
    containerClassName: "windowDialogContainer",
    //Background
    backgroundClassName: "windowDialogBackground",
    //Dialog
    dialogClassName: "windowDialogBox",
    //Button
    buttonClassName: "windowDialogButton",
    //Header
    headerClassName: "windowDialogHeader",
    //Input (Where you type text)
    inputClassName: "windowDialogInput",
  },
  texts: {
    ok: "OK",
    cancel: "Cancel",
  },
  _createDialogBase() {
    var background = document.createElement("div");
    background.style.position = "fixed";
    background.style.top = "0";
    background.style.left = "0";
    background.style.width = "100vw";
    background.style.height = "100vh";
    background.style.opacity = "0.5";
    background.className = this.styles.backgroundClassName;

    var dialogBox = document.createElement("div");
    dialogBox.style.position = "fixed";
    dialogBox.style.top = "50%";
    dialogBox.style.left = "50%";
    dialogBox.style.transform = "translate(-50%, -50%)";
    dialogBox.style.width = "fit-content";
    dialogBox.style.height = "fit-content";
    dialogBox.style.padding = "20px";
    dialogBox.style.maxWidth = "500px";
    dialogBox.style.maxHeight = "300px";
    dialogBox.style.minWidth = "100px";
    dialogBox.style.minHeight = "100px";
    dialogBox.style.overflow = "auto";
    dialogBox.className = this.styles.dialogClassName;

    var dialogContainer = document.createElement("div");
    dialogContainer.style.zIndex = "100";
    dialogContainer.className = this.styles.containerClassName;
    dialogContainer.append(background);
    dialogContainer.append(dialogBox);

    return { background, dialogBox, dialogContainer };
  },
  _createButtonBase() {
    var button = document.createElement("div");
    button.className = this.styles.buttonClassName;
    button.style.width = "fit-content";
    button.style.height = "fit-content";
    button.style.minWidth = "30px";
    button.style.minHeight = "20px";
    button.style.padding = "4px";
    button.style.cursor = "pointer";
    button.style.display = "inline-block";
    button.style.margin = "2px 2px";
    button.style.fontWeight = "bold";

    return button;
  },
  _createHeaderBase() {
    var span = document.createElement("span");
    span.className = this.styles.headerClassName;

    return span;
  },
  _createColorInputBase() {
    var input = document.createElement("input");
    input.type = "color";

    return input;
  },
  _createBreakBase() {
    var br = document.createElement("br");
    return br;
  },
  _createTextInputBase() {
    var input = document.createElement("input");
    input.type = "text";
    input.className = this.styles.inputClassName;

    return input;
  },
  _appendHeaders(message, dialogBox) {
    var m = message.toString();
    for (var m of m.split("\n")) {
      var header = this._createHeaderBase();
      header.textContent = m;
      dialogBox.append(header);
      dialogBox.append(this._createBreakBase());
    }
  },
  displayButtonChooser: function (message, buttonTexts) {
    var { dialogBox, background, dialogContainer } = this._createDialogBase();

    dialogBox.focus();

    this._appendHeaders(message, dialogBox);

    document.body.append(dialogContainer);

    return new Promise((accept) => {
      buttonTexts.forEach((buttonText, index) => {
        var button = this._createButtonBase();
        button.textContent = buttonText;
        button.onclick = function () {
          dialogContainer.remove();
          accept(index);
        };
        dialogBox.append(button);
      });
    });
  },
  alertWithElement: function (element) {
    var { dialogBox, background, dialogContainer } = this._createDialogBase();

    dialogBox.focus();

    document.body.append(dialogContainer);

    dialogBox.append(element);

    var acceptButton = this._createButtonBase();
    acceptButton.textContent = this.texts.ok;
    dialogBox.append(acceptButton);

    return new Promise((accept) => {
      acceptButton.onclick = function () {
        accept();
        dialogContainer.remove();
      };
    });
  },
  alert: function (message) {
    var { dialogBox, background, dialogContainer } = this._createDialogBase();

    dialogBox.focus();

    document.body.append(dialogContainer);

    this._appendHeaders(message, dialogBox);

    var acceptButton = this._createButtonBase();
    acceptButton.textContent = this.texts.ok;
    dialogBox.append(acceptButton);

    return new Promise((accept) => {
      acceptButton.onclick = function () {
        accept();
        dialogContainer.remove();
      };
    });
  },
  prompt: function (message) {
    var { dialogBox, background, dialogContainer } = this._createDialogBase();

    dialogBox.focus();

    document.body.append(dialogContainer);

    this._appendHeaders(message, dialogBox);

    var input = this._createTextInputBase();
    dialogBox.append(input);

    dialogBox.append(this._createBreakBase());

    var acceptButton = this._createButtonBase();
    acceptButton.textContent = this.texts.ok;
    dialogBox.append(acceptButton);

    var cancelButton = this._createButtonBase();
    cancelButton.textContent = this.texts.cancel;
    dialogBox.append(cancelButton);

    return new Promise((accept) => {
      input.onkeydown = function (e) {
        if (e.key == "Enter") {
          e.preventDefault();
          acceptButton.click();
        }
      };
      acceptButton.onclick = function () {
        if (input.value.length < 1) {
          accept(undefined);
        } else {
          accept(input.value);
        }
        dialogContainer.remove();
      };
      cancelButton.onclick = function () {
        accept();
        dialogContainer.remove();
      };
    });
  },
  confirm: function (message) {
    var { dialogBox, background, dialogContainer } = this._createDialogBase();

    dialogBox.focus();

    document.body.append(dialogContainer);

    this._appendHeaders(message, dialogBox);

    var acceptButton = this._createButtonBase();
    acceptButton.textContent = this.texts.ok;
    dialogBox.append(acceptButton);

    var cancelButton = this._createButtonBase();
    cancelButton.textContent = this.texts.cancel;
    dialogBox.append(cancelButton);

    return new Promise((accept) => {
      acceptButton.onclick = function () {
        accept(true);
        dialogContainer.remove();
      };
      cancelButton.onclick = function () {
        accept(false);
        dialogContainer.remove();
      };
    });
  },
  colorPrompt: function (message) {
    var { dialogBox, background, dialogContainer } = this._createDialogBase();

    dialogBox.focus();

    document.body.append(dialogContainer);

    this._appendHeaders(message, dialogBox);

    var colorInput = this._createColorInputBase();
    dialogBox.append(colorInput);

    dialogBox.append(this._createBreakBase());

    var acceptButton = this._createButtonBase();
    acceptButton.textContent = this.texts.ok;
    dialogBox.append(acceptButton);

    var cancelButton = this._createButtonBase();
    cancelButton.textContent = this.texts.cancel;
    dialogBox.append(cancelButton);

    return new Promise((accept) => {
      acceptButton.onclick = function () {
        accept(colorInput.value);
        dialogContainer.remove();
      };
      cancelButton.onclick = function () {
        accept();
        dialogContainer.remove();
      };
    });
  },
  passwordPrompt: function (message) {
    var { dialogBox, background, dialogContainer } = this._createDialogBase();

    dialogBox.focus();

    document.body.append(dialogContainer);

    this._appendHeaders(message, dialogBox);

    var input = this._createTextInputBase();
    input.type = "password";
    dialogBox.append(input);

    dialogBox.append(this._createBreakBase());

    var acceptButton = this._createButtonBase();
    acceptButton.textContent = this.texts.ok;
    dialogBox.append(acceptButton);

    var cancelButton = this._createButtonBase();
    cancelButton.textContent = this.texts.cancel;
    dialogBox.append(cancelButton);

    return new Promise((accept) => {
      input.onkeydown = function (e) {
        if (e.key == "Enter") {
          e.preventDefault();
          acceptButton.click();
        }
      };
      acceptButton.onclick = function () {
        if (input.value.length < 1) {
          accept(undefined);
        } else {
          accept(input.value);
        }
        dialogContainer.remove();
      };
      cancelButton.onclick = function () {
        accept();
        dialogContainer.remove();
      };
    });
  },
};

module.exports = dialog;


/***/ },

/***/ 6091
(module, __unused_webpack_exports, __webpack_require__) {

var { getWebsocketURL, PLACEHOLDER_IP } = __webpack_require__(3615);
var ErrorCodes = __webpack_require__(4888);
var attachSRB2 = __webpack_require__(2052);
var peer = __webpack_require__(1770);
var rtcConfig = __webpack_require__(1053);

class ListenChannel {
  constructor(url, id, ip, useRTC) {
    this.url = url;
    this.id = id;
    this.ip = ip;
    this.useRTC = useRTC;
    this.socket = new WebSocket(url);
    this.socket.binaryType = "arraybuffer";
    this.socket.onopen = this.handleOpen.bind(this);
    this.socket.onmessage = this.handleMessage.bind(this);
    this.socket.onclose = this.handleClose.bind(this);

    this.isOpen = false;
    this.rtcOpen = false;
  }

  handleOpen() {
    var { socket } = this;
    this.isOpen = true;
    if (this.useRTC) {
      socket.send(JSON.stringify({ webrtc: true }));
    }
  }

  handleMessage(event) {
    var { socket } = this;
    if (event.data instanceof ArrayBuffer) {
      if (this.ondata && !this.useRTC) {
        this.ondata(event.data);
      }
    } else {
      var json = JSON.parse(event.data);

      if (json.signal && this.peer) {
        this.peer.signal(json.signal);
        return;
      }

      if (json.rtcReady) {
        var _this = this;
        this.peer = new peer({
          initiator: true,
          config: rtcConfig,
        });

        this.peer.on("error", (err) => {});

        this.peer.on("signal", (data) => {
          _this.socket.send(JSON.stringify({ signal: data }));
        });

        this.peer.on("connect", () => {
          _this.rtcOpen = true;
        });

        this.peer.on("close", () => {
          _this.rtcOpen = false;
          _this.handleClose();
        });

        this.peer.on("data", (data) => {
          if (_this.ondata) {
            _this.ondata(data);
          }
          if (_this.socket) {
            _this.rtcOpen = true;
            _this.socket.onclose = () => {};
            _this.socket.close(); //Won't be needing this anymore.
            _this.socket = null;
          }
        });
      }
    }
  }

  handleClose() {
    var { socket } = this;
    if (this.useRTC && !this.rtcOpen) {
      if (this.peer) {
        try {
          this.peer.destroy();
        } catch (e) {}
        this.peer = null;
      }

      this.isOpen = false;
      this.rtcOpen = false;
      if (this.requestDispose) {
        this.requestDispose();
      }

      return;
    } else {
      if (this.useRTC) {
        return;
      }
    }

    this.isOpen = false;
    if (this.requestDispose) {
      this.requestDispose();
    }
  }

  dispose() {
    if (this.isOpen && this.socket) {
      this.socket.onclose = () => {};
      this.isOpen = false;
      this.socket.close();
    }
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
    this.socket = null;
    this.requestDispose = null;
  }

  send(data) {
    var { socket } = this;
    if (!this.isOpen) {
      return;
    }
    if (this.useRTC && this.peer) {
      try {
        this.peer.send(data);
      } catch (e) {}
      return;
    }
    if (this.useRTC) {
      return;
    }
    if (!socket) {
      return;
    }
    socket.send(data);
  }
}

module.exports = ListenChannel;


/***/ },

/***/ 7063
(module, __unused_webpack_exports, __webpack_require__) {

var elements = __webpack_require__(5100);
if (window["Module"]) {
  var Module = window["Module"];
}
var dialog = __webpack_require__(5925);
var IDBFS = null;
var gameCanvas = elements.getGPId("gameCanvas");
var didStart = false;
var loaderContent = elements.getGPId("loaderContent");
var serverOpts = null;
var launcherMain = elements.getGPId("launcherMain");
var loaderMain = elements.getGPId("loaderMain");

async function keepAlive() {
  if (navigator.requestWakeLock) {
    await navigator.requestWakeLock('screen');
  }
  
  if (navigator.locks) {
    navigator.locks.request('srb2_game_running', { mode: 'exclusive' }, async () => {
      await new Promise(resolve => {}); 
    });
  }

  startAudioKeepAlive();
}

function startAudioKeepAlive() {
  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  gain.gain.value = 0.0001; // Inaudible
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
}

function enableStartServer(dedicated = false) {
  serverOpts = {
    dedicated: !!dedicated,
  };
}

function disableStartServer() {
  serverOpts = null;
}

function loadScript() {
  return new Promise((resolve, reject) => {
    loaderContent.textContent = "Loading game script...";
    var script = document.createElement("script");
    script.src = "srb2.js";
    script.onload = resolve;
    script.onerror = reject;
    document.body.append(script);
  });
}

var CACHE_NAME = "srb2-assets-v1";
async function downloadAndSaveAssets() {
  const assetList = [
    { url: "assets/characters.pk3", filename: "characters.pk3" },
    { url: "assets/music.pk3", filename: "music.pk3" },
    { url: "assets/srb2.pk3", filename: "srb2.pk3" },
    { url: "assets/zones.pk3", filename: "zones.pk3" }, // If you have it
  ];
  // 1. Open the browser's cache storage
  const cache = await caches.open(CACHE_NAME);

  for (const asset of assetList) {
    //console.log(`Checking storage for ${asset.filename}...`);

    // 2. Check if we already have the file in cache
    let response = await cache.match(asset.url);

    if (response) {
      // HIT: We found it!
      //console.log(`[CACHE HIT] Loading ${asset.filename} from disk.`);
      loaderContent.textContent = `Loading ${asset.filename} from cache...`;
    } else {
      // MISS: We need to download it
      //console.log(
      //  `[CACHE MISS] Downloading ${asset.filename} from internet...`,
      //);
      loaderContent.textContent = `Downloading ${asset.filename}...`;

      try {
        // --- NEW CODE START ---

        // 1. Manually fetch the file first to check for errors
        //console.log(`[NETWORK] Fetching ${asset.url}...`);
        const request = new Request(asset.url);
        const networkResponse = await fetch(request);

        // 2. Check for 404s or Server Errors
        if (!networkResponse.ok) {
          throw new Error(
            `Server returned ${networkResponse.status} ${networkResponse.statusText} for file: ${asset.url}`,
          );
        }

        // 3. Put the successful response into the cache
        // We must clone() it because the response body can only be read once
        await cache.put(request, networkResponse.clone());

        // 4. Use the network response immediately so we don't have to look it up again
        response = networkResponse;

        // --- NEW CODE END ---
      } catch (err) {
        console.error(`FATAL ERROR: Could not load ${asset.url}`);
        // Update the loading screen so you can see it without opening console
        loaderContent.textContent = `ERROR: ${err.message}`;
        throw err;
      }
    }

    // 3. Read the file from cache into a buffer
    const buffer = await response.arrayBuffer();
    const data = new Uint8Array(buffer);

    // 4. Write to the Game's Virtual RAM (MEMFS)
    // This is fast because we are reading from disk, not network
    FS.writeFile(asset.filename, data);
  }
}

const RUNNING_CHECK_NAME = "srb2web_running_check";

async function initGame() {
  IDBFS = FS.filesystems.IDBFS;

  await downloadAndSaveAssets();

  loaderContent.textContent = "SRB2 is starting...";

  keepAlive(); // Try to keep the screen awake while playing

  FS.mkdirTree("/addons");
  FS.symlink("/home/web_user/.srb2", "/addons/.srb2");
  FS.symlink("/home/web_user/.srb2", "/addons/userdata");
  FS.mount(IDBFS, {}, "/home/web_user");
  FS.syncfs(true, (err) => {
    //console.log("SyncFS done");
    //console.log(err);
    Module.callMain(["-home", "/home/web_user"].concat(Module.arguments));
  });
  var isSyncing = false;
  setInterval(() => {
    if (!isSyncing) {
      isSyncing = true;
      FS.syncfs(false, (err) => {
        isSyncing = false;
      });
    }
    localStorage.setItem(RUNNING_CHECK_NAME, Date.now());
  }, 100);
}

var GetViewportWidth = () => {
  return Math.round(document.documentElement.clientWidth);
};

var GetViewportHeight = () => {
  return Math.round(document.documentElement.clientHeight);
};

window.ChangeResolution = (x, y) => {
  if (didStart) {
    // Use devicePixelRatio to fix the "tiny box in the corner" issue
    const dpr = window.devicePixelRatio || 1;
    const targetX = Math.floor((x || GetViewportWidth()) * dpr);
    const targetY = Math.floor((y || GetViewportHeight()) * dpr);

    gameCanvas.width = targetX;
    gameCanvas.height = targetY;
    
    // Match the CSS size to the viewport size
    gameCanvas.style.width = (targetX / dpr) + "px";
    gameCanvas.style.height = (targetY / dpr) + "px";

    setTimeout(() => {
      Module.ccall("change_resolution", "number", ["number", "number"], [targetX, targetY]);
    }, 100);
  }
};

async function startGame(options = {}) {
  loaderMain.hidden = false;
  launcherMain.hidden = true;

  Module.arguments = [];
  if (serverOpts) {
    Module.arguments.push("-server");
    if (serverOpts.dedicated) {
      Module.arguments.push("-dedicated");
    }
  }
  if (options) {
    if (options.host) {
      Module.arguments.push("-server");
    }
    if (options.joinURL) {
      Module.arguments.push("-connect");
      Module.arguments.push(options.joinURL);
    }
  }
  /*Module.arguments.push("-mb");
  Module.arguments.push("250");
  Module.arguments.push("+drawdist");
  Module.arguments.push("2048");
  Module.arguments.push("+addons_option");
  Module.arguments.push("CUSTOM");*/

  Module.noInitialRun = true;
  Module.print = () => {};
  Module.printErrr = console.error;
  Module.canvas = gameCanvas;
  Module.onRuntimeInitialized = initGame;
  Module.pauseOnVisibilityChange = false;
  Module.onExit = function () {
    window.location.reload();
  };

  try {
    await loadScript();
  } catch (e) {
    dialog.alert(
      "Error loading the game, look in the console for full error. \n" + e,
    );
    console.error("SRB2 Load error: ", e);
    return;
  }
}

window.StartedMainLoopCallback = function () {
  didStart = true;
  gameCanvas.hidden = false;
  setTimeout(() => {
    window.ChangeResolution();
  }, 10);

  // Add click listener after canvas is shown
  gameCanvas.addEventListener("click", () => {
    //console.log("Canvas clicked, locking mouse");
    window.LockMouse();
  });

  // Add mousemove listener for manual mouse delta handling
  document.addEventListener("mousemove", (e) => {
    if (document.pointerLockElement === gameCanvas) {
      Module.ccall(
        "SRB2_AddMouseDelta",
        "void",
        ["number", "number"],
        [Math.round(e.movementX), Math.round(e.movementY)],
      );
    }
  });

  function resumeAudio() {
    // SDL2 creates an AudioContext on the Module
    if (Module.SDL2 && Module.SDL2.audioContext) {
      if (Module.SDL2.audioContext.state === "suspended") {
        Module.SDL2.audioContext.resume().then(() => {
          //console.log("AudioContext resumed!");
        });
      }
    }

    // Also try the standard web audio context just in case
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      // If there's a global context hidden somewhere
    }
  }

  // Try to resume immediately (will likely fail, but worth a shot)
  resumeAudio();
};

window.addEventListener("resize", () => {
  window.ChangeResolution();
});
// SRB2 Gametype Constants
const GT_COOP = 0;
const GT_COMPETITION = 1;
const GT_RACE = 2;
const GT_MATCH = 3;
const GT_TAG = 4;
const GT_CTF = 5;

// Mock Server Fetch
async function fetchMS() {
  return [
    {
      ip: "152.26.89.206:5029",
      name: "Classic Co-op Adventure",
      version: "2.2.13",
      players: 2,
      max_players: 8,
      gametype: GT_COOP,
    },
  ];
}

// ----------------------------------------------------
// THE CRITICAL FUNCTION CALLED BY C
// ----------------------------------------------------
window.SRB2RequestServerList = function () {
  //dialog.alert("JS: C code requested server list...");

  // 1. Clear the old list in C
  try {
    Module.ccall("SRB2_ClearServerList", "void", [], []);
  } catch (e) {
    console.error("Could not clear list:", e);
  }

  // 2. Fetch and Populate
  fetchMS()
    .then((data) => {
      data.forEach((server) => {
        Module.ccall(
          "SRB2_AddServerToList",
          "void",
          [
            "string",
            "string",
            "string",
            "number",
            "number",
            "number",
            "number",
          ],
          [
            server.ip,
            server.name,
            server.version,
            server.players,
            server.max_players,
            100,
            server.gametype,
          ],
        );
      });

      // 3. Tell C we are done
      Module.ccall("SRB2_FinishServerList", "void", [], []);
    })
    .catch((err) => {
      console.error("JS: Error fetching servers:", err);
    });
};

var LockMouse = () => {
  if (didStart) {
    Module.ccall("lock_mouse", null, [], []);
    gameCanvas.focus();
    if (gameCanvas.requestPointerLock) {
      try {
        gameCanvas.requestPointerLock().catch((e) => {});
      } catch (e) {
        console.warn("Mouse lock request failed: ", e);
      }
    }
  }
};
window.LockMouse = LockMouse;

var UnlockMouse = (force = false) => {
  if (didStart) {
    if (force && document.pointerLockElement)
      document.exitPointerLock(); // this method should fire again, so don't unlock_mouse right now
    else if (!document.pointerLockElement)
      Module.ccall("unlock_mouse", null, [], []);
  }
};
window.UnlockMouse = UnlockMouse;

var CaptureFullscreenKey = (e) => {
  // Let F11 do fullscreen
  if (e instanceof KeyboardEvent && e.key === "F11") e.stopPropagation();
};

window.addEventListener("mousedown", LockMouse, false);
document.addEventListener("pointerlockchange", (_) => UnlockMouse(), false);
document.addEventListener(
  "mousedown",
  (e) => {
    if (document.pointerLockElement === gameCanvas) {
      Module.ccall("mouse_button_down", "void", ["number"], [e.button]);
      e.preventDefault();
    }
  },
  true,
);
document.addEventListener(
  "mouseup",
  (e) => {
    if (document.pointerLockElement === gameCanvas) {
      Module.ccall("mouse_button_up", "void", ["number"], [e.button]);
      e.preventDefault();
    }
  },
  true,
);
document.addEventListener(
  "wheel",
  (e) => {
    if (document.pointerLockElement === gameCanvas) {
      Module.ccall(
        "mouse_wheel_xy",
        "void",
        ["number", "number"],
        [Math.round(e.deltaX), Math.round(e.deltaY)],
      );
      e.preventDefault();
    }
  },
  true,
);
var mouseMoveX = 0;
var mouseMoveY = 0;
setInterval(() => {
  if (didStart) {
    Module.ccall(
      "SRB2_AddMouseDelta",
      "void",
      ["number", "number"],
      [mouseMoveX, mouseMoveY],
    );
    mouseMoveX = 0;
    mouseMoveY = 0;
  }
}, 1000 / 55);
gameCanvas.addEventListener(
  "mousemove",
  (e) => {
    if (document.pointerLockElement === gameCanvas) {
      mouseMoveX += e.movementX;
      mouseMoveY += e.movementY;
      e.preventDefault();
    }
  },
  true,
);
window.addEventListener(
  "load",
  (_) => {
    document.addEventListener("keydown", CaptureFullscreenKey, true);
    document.addEventListener("keyup", CaptureFullscreenKey, true);
    document.addEventListener("keypress", CaptureFullscreenKey, true);
  },
  { once: true },
);

const wakeupWorker = new Worker(URL.createObjectURL(new Blob([`
  setInterval(() => {
    self.postMessage('ping');
  }, 15); // Send a message every 15ms
`], {type: 'text/javascript'})));

wakeupWorker.onmessage = () => {
  //Empty so it keeps tab alive.
};

//Intentional debug logic, keep the if so it can be turned on and off.
if (false) // removed by dead control flow
{}

module.exports = { startGame, enableStartServer, disableStartServer };


/***/ },

/***/ 7919
() {

/* (ignored) */

/***/ },

/***/ 8769
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var elements = __webpack_require__(5100);
elements.appendElementsFromJSON(document.body, __webpack_require__(288));

var gameCanvas = elements.getGPId("gameCanvas");
var launcherMain = elements.getGPId("launcherMain");
var loaderMain = elements.getGPId("loaderMain");

gameCanvas.hidden = true;
loaderMain.hidden = true;
launcherMain.hidden = false;

var playButton = elements.getGPId("playButton");
var { startGame } = __webpack_require__(7063);

playButton.addEventListener("click", function () {
  startGame();
});

__webpack_require__(1618);

window.requestAnimationFrame = function (r) {
  return setTimeout(r, 1000 / 60);
};

window.cancelAnimationFrame = function (r) {
  return clearTimeout(r);
};

//var relay = require("./oldnet");
//var relayURL = "wss://rczylh-3000.csb.app/";
//var relayConnect = new relay.SRB2Relay(relayURL);


/***/ },

/***/ 9153
(module, __unused_webpack_exports, __webpack_require__) {

var elements = __webpack_require__(5100);
var dialog = __webpack_require__(5925);

class RelayOption {
  static FETCHING_IMG = "images/loading.gif";
  static FETCHING_TEXT = "Loading...";

  static ONLINE_IMG = "images/green.png";
  static ONLINE_TEXT = "Online!";

  static OFFLINE_IMG = "images/red.png";
  static OFFLINE_TEXT = "Offline.";

  static async relayAddDialog() {
    var nameInput = null;
    var hostInput = null;
    var editDiv = elements.createElementsFromJSON([
      {
        element: "div",
        children: [
          {
            element: "span",
            style: { fontWeight: "bold" },
            textContent: "Placeholder name: ",
          },
          {
            element: "input",
            GPWhenCreated: (elm) => (nameInput = elm),
            placeholder: "Relay server",
          },
          {
            element: "br",
          },
          {
            element: "span",
            style: { fontWeight: "bold" },
            textContent: "Host: ",
          },
          {
            element: "input",
            GPWhenCreated: (elm) => (hostInput = elm),
            placeholder: "example-relay.com",
          },
        ],
      },
    ])[0];

    await dialog.alertWithElement(editDiv); //Wait for close.
    var returned = {
      name: nameInput.value || "Relay server",
      host: hostInput.value,
    };
    var err = RelayOption.confirmRelayStuff(returned);
    if (err) {
      dialog.alert(err);
      return;
    }
    return returned;
  }

  static confirmRelayStuff({ name, host }) {
    if (typeof name !== "string") {
      return "Name is not string.";
    }
    if (typeof host !== "string") {
      return "Host is not string.";
    }

    var allowedURLChars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890.-:";

    for (var char of host) {
      if (allowedURLChars.indexOf(char) == -1) {
        return `Character "${char}" is not allowed in host.`;
      }
    }

    if (name.length > 150) {
      return `Name is too long!`;
    }
    if (name.length < 1) {
      return `Name is empty`;
    }

    if (host.length > 200) {
      return `Host is too long!`;
    }
    if (host.length < 1) {
      return `Host is empty`;
    }

    return null; //Nothing means its valid.
  }

  constructor(relay, requestSave, requestSetUsed, requestDelete) {
    this.relay = relay;
    this.requestSave = requestSave;
    this.requestSetUsed = requestSetUsed;
    this.requestDelete = requestDelete;
    this.firstFetch = true;
    this.loadOption();
    this.createElements();
    this.updateContents();
    this.fetchStatus();
  }

  async relayEditButtonClicked() {
    var nameInput = null;
    var hostInput = null;
    var editDiv = elements.createElementsFromJSON([
      {
        element: "div",
        children: [
          {
            element: "span",
            style: { fontWeight: "bold" },
            textContent: "Placeholder name: ",
          },
          {
            element: "input",
            GPWhenCreated: (elm) => (nameInput = elm),
            value: this.relay.name,
          },
          {
            element: "br",
          },
          {
            element: "span",
            style: { fontWeight: "bold" },
            textContent: "Host: ",
          },
          {
            element: "input",
            GPWhenCreated: (elm) => (hostInput = elm),
            value: this.relay.host,
          },
        ],
      },
    ])[0];

    await dialog.alertWithElement(editDiv); //Wait for close.

    var err = RelayOption.confirmRelayStuff({
      name: nameInput.value,
      host: hostInput.value,
    });
    if (err) {
      dialog.alert(err);
      return;
    }

    this.relay.name = nameInput.value;
    this.relay.host = hostInput.value;
    this.updateContents();
    this.fetchStatus();
    this.requestSave();
  }

  async relayDeleteButtonClicked() {
    var msg = `Remove relay server "${this.relay.host}"?\nYou might not be able to get it back once its removed.`;
    if (await dialog.confirm(msg)) {
      this.requestDelete();
    }
  }

  setUsed(u) {
    var { relayUseButton } = this;
    if (u) {
      this.div.setAttribute("used", "");
      relayUseButton.textContent = "Using this server";
    } else {
      this.div.removeAttribute("used");
      relayUseButton.textContent = "Use this server";
    }
  }
  dispose() {
    this.relay = null;
    this.div.remove();
  }
  loadOption() {
    this.name = this.relay.name ? this.relay.name : "";
    this.host = this.relay.host;
  }
  createElements() {
    var _this = this;
    this.div = elements.createElementsFromJSON([
      {
        element: "div",
        className: "configuredRelay",
        children: [
          //Name and stuff.
          {
            element: "div",
            style: {
              display: "flex",
              alignItems: "center",
              gap: "10px",
            },
            children: [
              {
                element: "div",
                className: "relayStatus",
                children: [
                  {
                    element: "img",
                    src: RelayOption.FETCHING_IMG,
                    className: "relayStatusImg",
                    GPWhenCreated: (elm) => (_this.statusImg = elm),
                  },
                  {
                    element: "span",
                    className: "relayStatusText",
                    GPWhenCreated: (elm) => (_this.statusText = elm),
                  },
                ],
              },
              {
                element: "span",
                className: "relayName",
                GPWhenCreated: (elm) => (_this.relayNameSpan = elm),
              },
              {
                element: "span",
                className: "relayHost relayHostClickable",
                GPWhenCreated: (elm) => (_this.relayHostSpan = elm),
              },
            ],
          },
          //Description
          {
            element: "span",
            className: "relayDescription",
            GPWhenCreated: (elm) => (_this.relayDescriptionSpan = elm),
          },
          //Public count
          {
            element: "span",
            className: "relayPublicCount",
            GPWhenCreated: (elm) => (_this.relayPublicCountSpan = elm),
          },
          //Buttons
          {
            element: "div",
            className: "relayButtons",
            children: [
              {
                element: "button",
                className: "button",
                textContent: "Use this server",
                GPWhenCreated: (elm) => (_this.relayUseButton = elm),
              },
              {
                element: "button",
                className: "button",
                textContent: "Edit",
                GPWhenCreated: (elm) => (_this.relayEditButton = elm),
              },
              {
                element: "button",
                className: "button",
                textContent: "Remove",
                GPWhenCreated: (elm) => (_this.relayDeleteButton = elm),
              },
            ],
          },
        ],
      },
    ])[0];

    function copyHostText() {
      var elm = this;
      var previous = elm.textContent;
      elm.textContent = "Copied!";
      setTimeout(() => {
        elm.textContent = previous;
        elm.onclick = copyHostText;
      }, 1000);
      try {
        navigator.clipboard.writeText(previous);
      } catch (e) {}
      elm.onclick = function () {};
    }

    this.relayHostSpan.onclick = copyHostText;
    this.relayUseButton.onclick = this.requestSetUsed;
    this.relayEditButton.onclick = this.relayEditButtonClicked.bind(this);
    this.relayDeleteButton.onclick = this.relayDeleteButtonClicked.bind(this);
  }

  updateContents() {
    var { relayNameSpan, relayHostSpan, relay, relayDescriptionSpan } = this;
    relayNameSpan.textContent = relay.name;
    relayHostSpan.textContent = relay.host;
    relayDescriptionSpan.textContent = "";
  }
  save() {
    return {
      host: this.relay.host,
      name: this.relay.name,
    };
  }
  getFetchURL() {
    var url = "";
    if (window.location.protocol.startsWith("https")) {
      url += "https://";
    } else {
      url += "http://";
    }
    url += this.host;
    if (!url.endsWith("/")) {
      url += "/";
    }
    return url;
  }

  setPublicCount(count) {
    var {relayPublicCountSpan} = this;
    if (count == "requesting") {
      relayPublicCountSpan.textContent = "Loading public netgames...";
      return;
    }
    if (count == "error") {
      relayPublicCountSpan.textContent = "Error loading public netgames";
      return;
    }
    if (!count) {
      relayPublicCountSpan.textContent = "No public netgames available";
      return;
    }
    relayPublicCountSpan.textContent = `${count} public netgames available`;
  }

  async fetchPublicCount() {
    var url = this.getFetchURL();
    this.setPublicCount("loading");
    try{
      var response = await fetch(url + "public");
      if (response.ok) {
        var json = await response.json();
        this.setPublicCount(json.length);
      } else {
        this.setPublicCount("error");
      }
    }catch(e){
      this.setPublicCount("error");
    }
  }
  async fetchStatus() {
    var { relayNameSpan, relayDescriptionSpan, statusImg, statusText } = this;
    if (this.firstFetch) {
      statusImg.src = RelayOption.FETCHING_IMG;
      statusText.textContent = RelayOption.FETCHING_TEXT;
      relayDescriptionSpan.textContent = "";
      statusText.setAttribute("state", "fetch");
      this.firstFetch = false;
      this.setPublicCount("loading");
    }
    var online = false;
    var url = this.getFetchURL();
    try {
      var response = await fetch(url + "status");
      if (response.ok) {
        var json = await response.json();
        if (json.status == "online") {
          relayNameSpan.innerHTML = "";
          elements.setInnerJSON(relayNameSpan, [
            {
              element: "span",
              textContent: json.name,
            },
            {
              element: "br",
            },
            {
              element: "span",
              style: {
                fontSize: "12px",
                marginLeft: "8px",
              },
              textContent: this.relay.name,
            },
          ]);

          relayDescriptionSpan.textContent = `${json.description}`;
          online = true;
          this.fetchPublicCount();
        }
      }
    } catch (e) {
      console.error(e);
      online = false;
    }
    if (!online) {
      statusImg.src = RelayOption.OFFLINE_IMG;
      statusText.textContent = RelayOption.OFFLINE_TEXT;
      statusText.setAttribute("state", "offline");
      this.setPublicCount("error");
      return;
    }
    statusImg.src = RelayOption.ONLINE_IMG;
    statusText.textContent = RelayOption.ONLINE_TEXT;
    statusText.setAttribute("state", "online");
  }
}

function preloadImage(h) {
  var link = document.createElement("link");
  link.rel = "preload";
  link.href = h;
  link.as = "image";
  document.head.append(link);
}

preloadImage(RelayOption.FETCHING_IMG);
preloadImage(RelayOption.OFFLINE_IMG);
preloadImage(RelayOption.ONLINE_IMG);

module.exports = RelayOption;


/***/ },

/***/ 9391
(module, __unused_webpack_exports, __webpack_require__) {

module.exports = {
  ConnectState: __webpack_require__(1133),
  ListenState: __webpack_require__(3052),
};


/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			155: 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunksrb2_web"] = self["webpackChunksrb2_web"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, [804], () => (__webpack_require__(8769)))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;