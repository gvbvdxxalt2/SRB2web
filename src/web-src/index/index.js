var elements = require("../gp2/elements.js");
elements.appendElementsFromJSON(document.body, require("./dom-home"));

var gameCanvasContainer = elements.getGPId("gameCanvasContainer");
var launcherMain = elements.getGPId("launcherMain");
var loaderMain = elements.getGPId("loaderMain");

gameCanvasContainer.hidden = true;
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
require("./frameworker.js");