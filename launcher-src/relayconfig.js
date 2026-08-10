var elements = require("./gp2/elements.js");
var dialog = require("./dialog.js");
var relayConfig = elements.getGPId("relayConfig");
var relayServerCheckbox = elements.getGPId("relayServerCheckbox");
var webrtcHostCheckbox = elements.getGPId("webrtcHostCheckbox");
var lstorageName = "SRB2WebRelayConfig";
var RelayOption = require("./relayoption.js");
var net = require("./net");

var browsePublicGames = elements.getGPId("browsePublicGames");
var browseNetgamesLargeButton = elements.getGPId("browseNetgamesLargeButton");
var publicNetgameBrowserContainer = elements.getGPId(
  "publicNetgameBrowserContainer",
);
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
  ];
}

var defaultRelays = getPublicHosts();

async function setBrowsePublicGamesText(count) {
  if (count == 0) {
    browsePublicGames.textContent =
      "Join/host a public netgame (none active yet)";
    return;
  }
  browsePublicGames.textContent = `Join/host a public netgame (${count} netgames active)`;
}
async function updatePublicNetgameCount() {
  try {
    var games = await net.listPublicGames();
    setBrowsePublicGamesText(games.length);
  } catch (e) {
    setBrowsePublicGamesText(0);
  }
}

setInterval(updatePublicNetgameCount, 1000 * 60 * 1);

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
  usedRelay = relays.length - 1;
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
  usedRelay = relays.length - 1;
  reloadRelayConfig();
  saveRelays();
};

addDefaultServers.onclick = async function () {
  var defaults = getPublicHosts();
  if (defaults.length > 0) {
    for (var relay of defaults) {
      addRelayIfNotExist(relay);
    }
    usedRelay = relays.length - defaults.length;
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

setInterval(
  () => {
    relayOpts.forEach((r) => {
      r.fetchStatus();
    });
  },
  1000 * 60 * 1,
);

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
    onclick: closePublicList,
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
        style: {
          display: "flex",
          fontSize: "32px",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px"
        },
        children: [
          {
            element: "img",
            src: "images/wifi.svg",
            className: "refreshIcon",
          },
          "Host public netgame",
        ],
      },
    ],
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
        style: {
          display: "flex",
          fontSize: "32px",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px"
        },
        children: [
          {
            element: "img",
            src: "images/refresh.svg",
            className: "refreshIcon",
          },
          "Refresh",
        ],
      },
    ],
  };
}

function gameToButton(game, selectedURL, onClick) {
  return {
    element: "div",
    className: "publicNetgameItem",
    eventListeners: [{ event: "click", func: onClick }],
    children: [
      {
        element: "div",
        style: {
          display: "flex",
          alignItems: "center",
          gap: "2px",
        },
        children: [
          /*{
            element: "img",
            className: "netgameCommunicationType",
            src: game.usesWebRTC ? "images/webrtc.svg" : "images/websocket.svg",
          },*/
          {
            element: "span",
            className: "netgameServerName",
            textContent: game.name,
          },
        ],
      },
      {
        element: "span",
        className: "netgameServerURL",
        textContent: game.url,
      },
    ],
  };
}

var { getDisplayOptions } = require("./display-settings.js");
var { startGame } = require("./game.js");

async function launchToNetgame(game) {
  var confirmed = await dialog.confirm(`Launch game to join "${game.name}"?`);
  if (!confirmed) return;

  closePublicList();
  startGame({
    ...getDisplayOptions(),
    joinURL: game.url,
  });
}

async function launchToHost() {
  var confirmed = await dialog.confirm(`Launch game to host public netgame?`);
  if (!confirmed) return;

  closePublicList();
  net.enablePublic();
  startGame({
    ...getDisplayOptions(),
    host: true,
  });
}

function displayPublicGames(games, selectedURL) {
  setBrowsePublicGamesText(games.length);
  publicNetgameBrowser.hidden = false;
  var gameslist = games.map((game) => {
        return gameToButton(game, selectedURL, () => {
          displayPublicGames(games, game.url);
        });
      });
  elements.setInnerJSON(
    publicNetgameBrowserLeft,
    [
      {
        element: "span",
        style: {
          fontWeight: "bold",
        },
        children: [
          "Now viewing on server: ",
          {
            element: "br",
          },
          {
            element: "span",
            className: "relayHost",
            textContent: currentHost,
            style: {
              fontSize: "20px",
            },
          },
        ],
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
      },
    ].concat(
      gameslist.length > 0 ? gameslist : [
        {
          element: "span",
          textContent: "No active public netgames found.",
        },
        {
          element: "br"
        },
        {
          element: "span",
          textContent: "Click \"Host public netgame\" to host one yourself! It's simple as one click!"
        }
      ],
    ),
  );

  var game = games.find((g) => selectedURL == g.url);

  if (!game) {
    elements.setInnerJSON(publicNetgameBrowserRight, [
      {
        element: "span",
        className: "viewPublicNetgameDetails",
        children: [
          {
            element: "span",
            textContent: "Select a public netgame on the left to view its details and connect to it!",
          },
          { element: "br" },
          {
            element: "span",
            textContent: "Host your own by clicking the \"Host public netgame\" button above! It's simple as one click!",
          }
        ]
      },
      getCloseButton(),
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
          textContent: game.name,
        },
        {
          element: "br",
        },
        {
          element: "span",
          className: "netgameServerURL",
          textContent: game.url,
        },
        {
          element: "div",
          className: "publicGameSeparator",
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
                gap: "2px",
              },
              onclick: () => {
                launchToNetgame(game);
              },
              children: [
                {
                  element: "img",
                  style: {
                    width: "32px",
                    height: "32px",
                    objectFit: "contain",
                  },
                  src: "images/wifi.svg",
                },
                {
                  element: "span",
                  textContent: "Connect/Join",
                },
              ],
            },
          ],
        },

        {
          element: "div",
          className: "publicGameSeparator",
        },
        {
          element: "br",
        },
        {
          element: "li",
          children: [
            {
              element: "ri",
              textContent: game.mapTitle
                ? "Map Title: " + game.mapTitle
                : "(No map title)",
            },
          ],
        },
        {
          element: "li",
          children: [
            {
              element: "ri",
              textContent: game.map ? "Map: " + game.map : "(No map)",
            },
          ],
        },

        {
          element: "br",
        },
        {
          element: "div",
          className: "publicGameSeparator",
        },
        {
          element: "span",
          textContent: `Players: ${game.ingamePlayers} / ${game.maxPlayers || "(Unknown)"}`,
        },
      ].concat(
        game.playerNames.map((name) => {
          return {
            element: "li",
            textContent: name,
          };
        }),
      ),
    },
    getCloseButton(),
  ]);
}

async function loadPublicList() {
  publicNetgameBrowserContainer.hidden = false;
  publicNetgameBrowser.hidden = true;
  try {
    var games = await net.listPublicGames();
  } catch (e) {
    dialog.alert(
      "Failed to fetch public hosted games. Make sure your selected relay server is working and try again.\nError: " +
        e,
    );
    console.error(e);
    publicNetgameBrowserContainer.hidden = true;
    return;
  }

  displayPublicGames(games);
}

async function handleBrowseButtonClick () {
  if (!relayEnabled) {
    dialog.alert("You don't have the relay server enabled!");
    return;
  }
  if (usedRelay < 0) {
    dialog.alert("You don't have a relay server selected");
    return;
  }

  if (relayOpts[usedRelay].isOutdated) {
    var accepted = await dialog.confirm("This relay server is (probably) outdated or uses an different protocol!\nYou may need to ask the owner of the relay server to update to the latest version of the relay server.\nContinue anyways?");
    if (!accepted) {
      return;
    }
  }

  loadPublicList();
}

browsePublicGames.addEventListener("click", handleBrowseButtonClick);
browseNetgamesLargeButton.addEventListener("click", handleBrowseButtonClick);