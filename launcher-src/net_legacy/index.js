var { ConnectState, ListenState } = require("./state");
var attachSRB2 = require("./attach.js");
var dialog = require("../dialog.js");

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
    return [];
  }
  if (!host) {
    throw new Error(`No host provided`);
    return [];
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
        return [];
      }
    } catch (e) {
      throw e;
      return [];
    }
  }
  var publicNetgames = await response.json();

  return publicNetgames;
}

var isAlerting = false;
document.addEventListener("visibilitychange", (e) => {
  if (document.visibilityState == "hidden") {
    if (!curState) {
      return;
    }

    if (isAlerting) { //Don't stack multiple alerts if the user keeps switching back and forth.
      return;
    }
    if (curState.listen) {
      var promise = dialog.alert("Warning: Switching off this page can cause connection problems on other players, to avoid this, please move the tab onto a portion of your desktop thats always visible.");
      isAlerting = true;
      promise.then(() => {
        isAlerting = false;
      });
    }
    if (curState.connect) {
      var promise = dialog.alert("Warning: Switching off this page can cause connection problems, to avoid this, please move the tab onto a portion of your desktop thats always visible.");
      isAlerting = true;
      promise.then(() => {
        isAlerting = false;
      });
    }
  }
});

module.exports = {
  enable,
  disable,
  enablePublic,
  disablePublic,
  enableServerWebRTC,
  disableServerWebRTC,
  listPublicGames,
};
