if (!window["Module"]) {
  window["Module"] = {};
}

var elements = require("./gp2/elements.js");
elements.appendElementsFromJSON(document.body, require("./elms"));

var gameCanvas = elements.getGPId("gameCanvas");
var launcherMain = elements.getGPId("launcherMain");
var loaderMain = elements.getGPId("loaderMain");

gameCanvas.hidden = true;
loaderMain.hidden = true;
launcherMain.hidden = false;

var playButton = elements.getGPId("playButton");
var touchConfigureButton = elements.getGPId("configureTouchControlsButton");
var { startTouchCustomization } = require("./touch");
var { startGame } = require("./game.js");

var { getDisplayOptions } = require("./display-settings.js");

playButton.addEventListener("click", function () {
  startGame(getDisplayOptions());
});
touchConfigureButton.addEventListener("click", function () {
  startTouchCustomization();
});

require("./relayconfig.js");

window.requestAnimationFrame = function (r) {
  return setTimeout(r, 1);
};

window.cancelAnimationFrame = function (r) {
  return clearTimeout(r);
};

//var relay = require("./oldnet");
//var relayURL = "wss://rczylh-3000.csb.app/";
//var relayConnect = new relay.SRB2Relay(relayURL);
