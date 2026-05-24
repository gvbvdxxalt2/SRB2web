/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 53
(module, __unused_webpack_exports, __webpack_require__) {

module.exports = [
  {
    element: "div",
    className: "launcherMain",
    gid: "launcherMain",
    children: [
      ////////////////////////////////////////////

      ...__webpack_require__(6439),

      ////////////////////////////////////////////

      ...__webpack_require__(9766),
      ...__webpack_require__(7496),

      ////////////////////////////////////////////

      { element: "div", className: "sep" },

      ...__webpack_require__(3022),

      ////////////////////////////////////////////

      { element: "div", className: "sep" },

      {
        element: "div",
        children: __webpack_require__(1713),
      },

      ////////////////////////////////////////////

      { element: "div", className: "sep" },

      {
        element: "div",
        children: __webpack_require__(8752),
        style: {
          marginTop: "20px",
          fontSize: "14px",
          color: "#ffffff",
        },
        gid: "launcherInfo",
      },

      ////////////////////////////////////////////
    ],
  },
];


/***/ },

/***/ 101
(module, __unused_webpack_exports, __webpack_require__) {

var { TouchControlButton } = __webpack_require__(7841);
var { KeyName, KeyNum, getButtonLabels } = __webpack_require__(627);
var { showKeyboard, hideKeyboard, toggleKeyboard, keyboardIsActive } = __webpack_require__(5000);
var dialog = __webpack_require__(5925);
var elements = __webpack_require__(5100);
var processRate = 1000/60;
var processInterval = null;
var inEditMode = false;
var buttons = [];

var defaultPreset = __webpack_require__(7819);

var touchControlsDialogDiv = elements.getGPId("touchControlsDialog");
var touchControlsContainer = elements.getGPId("touchControlsContainer");

function destroyButtons () {
    buttons.forEach((button) => {button.destroy();});
    buttons = [];
}

function createButton(data) {
    var button = data ? (TouchControlButton.fromSavedData(data)) : (new TouchControlButton());
    button.editMode = inEditMode;
    button.append(touchControlsContainer);
    return button;
}

function saveButtons() {
    var data = buttons.map((button) => {return button.save();});
    localStorage.setItem("touchControls", JSON.stringify(data));
    dialog.alert("Touch controls saved.");
}

function loadButtonsData(data) {
    var buttonsArray = [];
    if (typeof data == "string") {
        try{
            buttonsArray = JSON.parse(data);
        }catch(e){
            dialog.alert("Invalid data. "+e);
        }
    } else {
        buttonsArray = data;
    }

    if (!Array.isArray(buttonsArray)) {
        buttonsArray = [];
        dialog.alert("Invalid data, button data should be an array.");
    }

    destroyButtons();
    buttons = buttonsArray.map(buttonData => createButton(buttonData));
}
function loadButtons() {
    var data = localStorage.getItem("touchControls");
    if (!data) {
        loadButtonsData(defaultPreset);
    } else {
        loadButtonsData(data);
    }
}

var touchPositions = [];
var touches = [];
var active = false;
var processState = {};
function generateTouchRandomId() {
    return Date.now()+"_"+(Math.random()*100000);
}
touchControlsContainer.addEventListener("touchstart", function (e) {
    if (!active) {
        return;
    }
    for (var touch of e.changedTouches) {
        if (!touches.find(t => t.id == touch.identifier)) {
            touches.push({
                id: touch.identifier,
                rid: generateTouchRandomId(),
                clientX: touch.clientX,
                clientY: touch.clientY,
                radiusX: touch.radiusX,
                radiusY: touch.radiusY,
                top: touch.clientY,
                left: touch.clientX,
                width: touch.radiusX < 2 ? 2 : touch.radiusX,
                height: touch.radiusY < 2 ? 2 : touch.radiusY,
                touching: true
            });
        }
    }
    if (processState.disableDefault) {
        e.preventDefault();
        e.stopPropagation();
    }
}, { passive: false });
touchControlsContainer.addEventListener("touchmove", function (e) {
    if (!active) {
        return;
    }
    for (var touch of e.changedTouches) {
        var t = touches.find(t => t.id == touch.identifier);
        if (t) {
            t.clientX = touch.clientX;
            t.clientY = touch.clientY;
            t.radiusX = touch.radiusX;
            t.radiusY = touch.radiusY;
            t.left = touch.clientX;
            t.top = touch.clientY;
            t.width = touch.radiusX < 2 ? 2 : touch.radiusX;
            t.height = touch.radiusY < 2 ? 2 : touch.radiusY;
        }
    }
    if (processState.disableDefault) {
        e.preventDefault();
        e.stopPropagation();
    }
}, { passive: false });
touchControlsContainer.addEventListener("touchend", function (e) {
    if (!active) {
        return;
    }
    for (var touch of e.changedTouches) {
        var t = touches.find(t => t.id == touch.identifier);
        if (t) {
            t.touching = false;
            touches = touches.filter(t => t.id !== touch.identifier);
        }
    }
    if (processState.disableDefault) {
        e.preventDefault();
        e.stopPropagation();
    }
}, { passive: false });

function updateTouchPositions() {
    touchPositions = touches;
}

function startInputProcessor(editMode) {
    stopInputProcessor();
    active = true;
    inEditMode = !!editMode;

    if (editMode) {
        touchControlsDialogDiv.hidden = false;
    }
    touchControlsContainer.hidden = false;

    processInterval = setInterval(() => {
        updateTouchPositions();
        Array.from(buttons).reverse().forEach(button => {
            if (button.destroyed) {
                buttons = buttons.filter(b => b.randomId !== button.randomId);
            } else {
                button.process(touchPositions, processState);
            }
        });
    },processRate);

    loadButtons();
}

function stopInputProcessor() {
    active = false;
    clearInterval(processInterval);
    inEditMode = false;
    touchControlsDialogDiv.hidden = true;
    touchControlsContainer.hidden = true;
    processState = {};
    destroyButtons();
}

elements.getGPId("touchControlsClose").addEventListener("click", async function () {
    var promise = dialog.confirm("Are you sure you want to exit? Unsaved changes will be lost.");
    promise.then((result) => {
        if (result) {
            stopInputProcessor();
        }
    });
});

var touchControlsAddDropdown = elements.getGPId("touchControlsAddDropdown");
var touchControlsAdd = elements.getGPId("touchControlsAdd");
function closeAddDropdown() {
    touchControlsAddDropdown.hidden = true;
    elements.removeAllChildren(touchControlsAddDropdown);
}
touchControlsAdd.addEventListener("click", function (e) {
    e.stopPropagation();
    if (touchControlsAddDropdown.hidden) {
        touchControlsAddDropdown.hidden = false;
        elements.removeAllChildren(touchControlsAddDropdown);
        function clickHandler(event, keyid) {
            var button = createButton(TouchControlButton.createEmptyButtonData(keyid));
            buttons.push(button);
            closeAddDropdown();
            event.stopPropagation();
        }
        elements.setInnerJSON(
            touchControlsAddDropdown,
            getButtonLabels().map((key) => {
                if (!key.label) {
                    return;
                }
                return {
                    element: "div",
                    className: "option",
                    textContent: key.label,
                    eventListeners: [
                        {
                            event: "click",
                            func: (e) => {clickHandler(e, key.id)}
                        }
                    ]
                };
            })
        );
    } else {
        closeAddDropdown();
    }
});
document.addEventListener("click", function () { //Allow the user to tap off.
    closeAddDropdown();
});

var touchControlsReset = elements.getGPId("touchControlsReset");
touchControlsReset.addEventListener("click", function () {
    if (!active) {
        return;
    }
    var promise = dialog.confirm("Are you sure you want to reset? This cannot be undone.");
    promise.then((result) => {
        if (result) {
            loadButtonsData(defaultPreset);
        }
    });
});

var touchControlsSave = elements.getGPId("touchControlsSave");
touchControlsSave.addEventListener("click", function (event) {
    if (!active) {
        return;
    }
    if (event.shiftKey) {
        var data = buttons.map(button => button.save());
        dialog.alert(JSON.stringify(data));
    } else {
        saveButtons();
    }
});

module.exports = {
    startInputProcessor,
    stopInputProcessor
};

/***/ },

/***/ 492
(module) {

module.exports = "body {\n  background: #000000;\n  font-family: PixelFont, Arial, sans-serif;\n  letter-spacing: 1px;\n  margin: 0;\n  padding: 0;\n  height: 100dvh;\n  width: 100dvw;\n  overflow-x: auto;\n  overflow-y: auto;\n}\n\n.sep {\n  width: 100%;\n  height: 10px;\n  margin-bottom: 10px;\n  border-bottom-style: solid;\n  border-bottom-width: 2px;\n  border-bottom-color: rgb(0, 110, 255);\n}\n\na {\n  all: unset;\n  color: #00ffff;\n  text-decoration: none;\n}\na:hover {\n  text-decoration: underline;\n  cursor: pointer;\n}\n\n.srb2BG {\n  position: fixed;\n  top: 0px;\n  left: 0px;\n  width: 100%;\n  height: 100%;\n  background: url(\"images/title-bg.png\") center/cover no-repeat;\n  pointer-events: none;\n  image-rendering: pixelated;\n  filter: brightness(0.6);\n}\n\n.launcherMain {\n  min-width: 600px;\n  width: calc(100vw - 400px);\n  height: calc(100dvh - 0px);\n  padding: 10px 10px;\n  box-sizing: border-box;\n\n  position: absolute;\n  left: 50%;\n  top: 0px;\n  transform: translate(-50%, 0px);\n\n  background: rgba(0, 0, 0, 0.619);\n  color: #ffffff;\n  border-radius: 1px;\n  overflow: auto;\n}\n\n.button {\n  all: unset;\n  padding: 5px 5px;\n  background: rgba(0, 0, 0, 0.5);\n  color: #ffffff;\n  border-radius: 3px;\n}\n\n.button:hover {\n  background: rgba(117, 117, 117, 0.5);\n  cursor: pointer;\n}\n\n.playButton {\n  font-size: 30px;\n  background: rgba(9, 255, 0, 0.5);\n  width: 100%;\n  text-align: center;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n\n  gap: 10;\n}\n\n.playButton:hover {\n  background: rgba(9, 255, 0, 0.7);\n}\n\n.fsButton {\n  font-size: 30px;\n  background: rgba(255, 157, 0, 0.5);\n  width: 100%;\n  text-align: center;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  gap: 10;\n}\n\n.fsButton:hover {\n  background: rgba(255, 157, 0, 0.7);\n}\n\n.gameCanvas {\n  background: black;\n  width: 100dvw;\n  height: 100dvh;\n  position: fixed;\n  top: 0;\n  left: 0;\n  image-rendering: pixelated;\n  object-fit: fill;\n}\n\n.sectionHeader {\n  display: block;\n  font-size: 30px;\n  margin-bottom: 10px;\n}\n\n.loaderMain {\n  position: fixed;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column;\n}\n\n.relayConfig {\n  width: calc(100% - 0px);\n  height: fit-content;\n  max-height: 200px;\n  min-height: 100px;\n  box-sizing: border-box;\n  padding: 2px;\n  color: #ffffff;\n  border-radius: 0px;\n  border-style: solid;\n  border-width: 2px;\n  border-color: rgba(0, 38, 255, 0.747);\n  overflow: auto;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n\n.noRelayContainer {\n}\n\n.noRelayText {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-direction: row;\n\n  color: rgba(255, 255, 255, 1);\n}\n\n.configuredRelay {\n  width: 100%;\n  min-height: 100px;\n  box-sizing: border-box;\n  color: #ffffff;\n  background: rgba(255, 255, 255, 0.2);\n  border-radius: 3px;\n  display: flex;\n  flex-direction: column;\n  padding: 5px;\n  flex-shrink: 0;\n  overflow: wrap;\n  text-wrap: wrap;\n}\n\n.configuredRelay[used] {\n  background: rgba(255, 255, 255, 0.4);\n}\n\n.relayName {\n  font-size: 20px;\n  overflow: wrap;\n  text-wrap: wrap;\n}\n\n.relayHost {\n  margin-left: auto;\n  font-size: 10px;\n  font-style: italic;\n  color: rgb(0, 110, 255);\n  user-select: none;\n}\n\n.relayHostClickable:hover {\n  cursor: pointer;\n  text-decoration: underline;\n}\n\n.relayStatus {\n  display: flex;\n  gap: 3px;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  width: 50px;\n  height: 50px;\n}\n\n.relayStatusText {\n  color: rgb(255, 255, 255);\n  font-size: 10px;\n  text-align: center;\n}\n.relayStatusText[state=\"offline\"] {\n  color: rgb(255, 0, 0);\n}\n.relayStatusText[state=\"online\"] {\n  color: rgb(0, 255, 0);\n}\n\n.relayStatusImg {\n  width: 28px;\n  height: 28px;\n  image-rendering: pixelated;\n}\n\n.relayDescription {\n  font-size: 10px;\n  white-space: pre;\n  padding-left: 5px;\n  overflow: wrap;\n  text-wrap: wrap;\n}\n\n.relayPublicCount {\n  font-size: 14px;\n  white-space: pre;\n  padding-left: 5px;\n  overflow: wrap;\n  text-wrap: wrap;\n}\n\n.relayButtons {\n  margin-top: 2px;\n  display: block;\n}\n\n.relayButtons > .button {\n  margin: 1px 1px;\n}\n\n:root {\n  --popup-dialog-font: Arial, sans-serif;\n  --popup-dialog-background: #fff;\n  --popup-dialog-border-radius: 10px;\n  --popup-dialog-text-color: #000;\n  --popup-dialog-button-background: #5985ff;\n  --popup-dialog-button-hover-background: #4275ff;\n  --popup-dialog-button-text-color: #fff;\n  --popup-dialog-button-radius: 5px;\n  --popup-dialog-input-background: #fff;\n  --popup-dialog-input-border-width: 1.5px;\n  --popup-dialog-input-border-color: #bababa;\n  --popup-dialog-input-text-color: #000;\n  --popup-dialog-message-size: 16px;\n}\n\n.windowDialogContainer {\n  font-family: var(--popup-dialog-font);\n  z-index: 99999999;\n}\n\n.windowDialogBackground {\n  background-color: black;\n  backdrop-filter: blur(2px);\n}\n\n.windowDialogBox {\n  background: var(--popup-dialog-background);\n  border-radius: var(--popup-dialog-border-radius);\n  color: var(--popup-dialog-text-color);\n}\n\n.windowDialogButton {\n  background: var(--popup-dialog-button-background);\n  color: var(--popup-dialog-button-text-color);\n  border-radius: var(--popup-dialog-button-radius);\n  padding: 4px 8px;\n  border: none;\n  cursor: pointer;\n}\n\n.windowDialogButton:hover {\n  background: var(--popup-dialog-button-hover-background);\n}\n\n.windowDialogInput {\n  background: var(--popup-dialog-input-background);\n  border: var(--popup-dialog-input-border-width) solid\n    var(--popup-dialog-input-border-color);\n  color: var(--popup-dialog-input-text-color);\n  outline: none;\n  border-radius: 4px;\n  padding: 4px;\n}\n\n.windowDialogHeader {\n  font-weight: bold;\n  font-size: var(--popup-dialog-message-size);\n}\n\n.logsContainer {\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100dvh;\n    background: hsl(0, 0%, 13%);\n    color: #adadad;\n    font-family: monospace;\n    font-size: 14px;\n    overflow: auto;\n    box-sizing: border-box;\n    padding: 2px;\n    z-index: 1500;\n}\n\n.publicNetgameBrowserContainer {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100dvh;\n  background: rgba(0,0,0,0.5);\n}\n\n.publicNetgameBrowserDialog {\n  position: fixed;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  width: calc(100% - 150px);\n  height: calc(100dvh - 150px);\n  min-width: 640px;\n  min-height: 360px;\n  border-radius: 3px;\n  background: rgba(255,255,255,1);\n  display: flex;\n  flex-direction: row;\n}\n\n.publicNetgameBrowserLeft {\n  display: flex;\n  flex-direction: column;\n  min-width: 200px;\n  width: calc(100% - 450px);\n  max-width: 300px;\n  border-right: 2px solid rgba(0,0,0,0.3);\n  box-sizing: border-box;\n  flex-shrink: 0;\n  flex-grow: 0;\n  gap: 3px;\n  overflow: auto;\n}\n\n.publicNetgameItem {\n  width: 100%;\n  box-sizing: border-box;\n  height: fit-content;\n  min-height: 50px;\n  padding: 5px 5px;\n  background: rgba(0,0,0,0.5);\n  color: rgba(255,255,255,1);\n  border-radius: 4px;\n  flex-shrink: 0;\n}\n\n.publicNetgameItem:hover {\n  background: rgba(0,0,0,0.7);\n  text-decoration: underline;\n  cursor: pointer;\n}\n\n.publicNetgameItem[viewing] {\n  text-decoration: underline;\n  cursor: unset;\n}\n\n.publicGameSeparator {\n  width: 100%;\n  height: 0px;\n  margin-top: 3px;\n  margin-bottom: 3px;\n  border-bottom-color: black;\n  border-bottom-style: dashed;\n  border-bottom-width: 2px;\n  box-sizing: border-box;\n}\n\n.publicNetgameBrowserRight {\n  display: block;\n  flex-grow: 1;\n  position: relative;\n}\n\n.publicNetgameBrowserCloseButton {\n  position: absolute;\n  top: 0;\n  right: 0;\n  font-size: 30px;\n}\n\n.viewPublicNetgameDetails {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  background: rgba(0,0,0,0.5);\n  color: rgba(255,255,255,1);\n  padding: 5px 5px;\n  border-radius: 3px;\n}\n\n.publicNetgameDetails {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  width: 100%;\n  height: 100%;\n  padding: 10px 10px;\n  box-sizing: border-box;\n}\n\n.refreshIcon {\n  width: 32px;\n  height: 32px;\n}\n\n.netgameServerName {\n  font-size: 30px;\n}\n\n.netgameServerURL {\n  font-size: 16px;\n  margin-left: 5px;\n  font-family: arial;\n}\n\n.netgameCommunicationType {\n  width: 25px;\n  height: 25px;\n  object-fit: contain;\n  padding: 5px 5px;\n  border-radius: 3px;\n  background: rgba(255,255,255,0.4);\n}\n\n.netgameLoadingListsContainer {\n  position: fixed;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%,-50%);\n  width: fit-content;\n  height: fit-content;\n  box-sizing: border-box;\n  padding: 4px 4px;\n  background: rgba(255,255,255,0.5);\n  color: rgba(0,0,0,1);\n  border-radius: 4px;\n  font-size: 20px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-direction: row;\n  gap: 8px;\n}\n\n.netgameLoadingListsImg {\n  width: 30px;\n  height: 30px;\n}\n\n\n.dontSellText {\n  color: rgb(196, 0, 0);\n  font-size: 35px;\n}\n\n.displayOption {\n  display: flex;\n  align-items: center;\n  gap: 2px;\n}\n\n.selectOptions {\n  all: unset;\n  display: block;\n  box-sizing: border-box;\n  padding: 4px 4px;\n  color: black;\n  background: rgba(255,255,255,0.7);\n  appearance: auto;\n  border-radius: 5px;\n}\n\n.touchControlPosition[data-position=\"left\"] {\n  position: fixed;\n  left: var(--button-x);\n  bottom: var(--button-y);\n  will-change: left, right, bottom;\n  contain: layout paint; \n  user-select: none;\n  -webkit-user-select: none;\n}\n\n.touchControlPosition[data-position=\"right\"] {\n  position: fixed;\n  right: var(--button-x);\n  bottom: var(--button-y);\n  will-change: left, right, bottom;\n  contain: layout paint; \n  user-select: none;\n  -webkit-user-select: none;\n}\n\n.touchControlBox {\n  background: rgba(255,255,255,1);\n  border-radius: 0px;\n  border-width: 0.5vmin;\n  border-color: rgba(0,0,0,1);\n  border-style: solid;\n  width: 2vmin;\n  height: 2vmin;\n  transform: translate(-50%, 50%);\n}\n.touchControlBox[data-position=\"left\"]  {\n  position: fixed;\n  bottom: var(--button-y);\n  left: calc(calc(var(--button-x) + var(--button-width)));\n}\n\n.touchControlDeleteBox {\n  background: rgb(255, 0, 0);\n  border-radius: 0px;\n  border-width: 0.5vmin;\n  border-color: rgba(0,0,0,1);\n  border-style: solid;\n  width: 2vmin;\n  height: 2vmin;\n  transform: translate(-50%, 50%);\n}\n.touchControlDeleteBox[data-position=\"left\"]  {\n  position: fixed;\n  bottom: calc(var(--button-y));\n  left: var(--button-x);\n}\n\n.touchActionButton {\n  all: unset;\n  position: absolute;\n  width: var(--button-width);\n  height: var(--button-height);\n  background: rgba(255,255,255,0.5);\n  color: rgba(0,0,0,0.6);\n  border-radius: 0.5vmin;\n  cursor: not-allowed;\n  font-size: 4vmin;\n  box-sizing: border-box;\n  padding: 3vmin 3vmin;\n  /* The actual touch events are handled by the JavaScript collision tests */\n  overflow: hidden;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  user-select: none;\n}\n.touchActionButton[data-touching] {\n  background: rgba(255,255,255,0.8);\n}\n\n.blackDialogBG {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100dvh;\n  background: rgba(0,0,0,0.8);\n}\n\n.whiteDialogBox {\n  position: fixed;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  background: rgba(255,255,255,1);\n  color: rgba(0,0,0,1);\n  padding: 10px 10px;\n  box-sizing: border-box;\n  border-radius: 5px;\n}\n\n.touchControlsDialog {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100dvh;\n}\n.touchControlsDialogTitle {\n  font-size: 7vmin;\n  color: rgba(255,255,255,1);\n}\n\n.touchControlsDialogButton {\n  all: unset;\n  background: rgba(255,255,255,0.8);\n  color: rgba(0,0,0,0.6);\n  border-radius: 0.5vmin;\n  font-size: 4vmin;\n  width: fit-content;\n  height: fit-content;\n  box-sizing: border-box;\n  padding: 1vmin 1vmin;\n}\n\n.touchControlsDialogButton:hover {\n  text-decoration: underline;\n  cursor: pointer;\n}\n\n.touchControlsDialogRedButton {\n  background: rgba(255,50,0,0.8);\n}\n.touchControlsDialogGreenButton {\n  background: rgba(4, 255, 0, 0.8);\n}\n\n.touchControlDialogEditButtons {\n  position: relative;\n  display: flex;\n  flex-direction: row;\n}\n\n.touchControlsDialogTip {\n  color: rgb(255, 0, 0);\n  font-size: 4vmin;\n  user-select: none;\n  pointer-events: none;\n}\n\n.touchControlsDialogTip2 {\n  color: rgba(255,255,255,1);\n  font-size: 3.5vmin;\n  user-select: none;\n  pointer-events: none;\n}\n\n.touchControlsContainer {\n  position: fixed;\n  top: 0;\n  left: 0;\n  /*width: 100%;\n  height: 100dvh;*/\n  overflow: visible;\n  user-select: none;\n}\n\n.touchControlsAddDropdownContainer {\n  position: relative;\n  width: 0px;\n  height: 0px;\n}\n.touchControlsAddDropdown {\n  text-decoration: unset;\n  position: absolute;\n  top: 0;\n  left: 0;\n  transform: translate(0, 6vmin);\n  width: 50vmin;\n  max-height: 40vmin;\n  z-index: 99999;\n  background: rgba(255,255,255,0.9);\n  border-radius: 0.5vmin;\n  display: flex;\n  flex-direction: column;\n  gap: 0.2vmin;\n  padding: 0.2vmin 0.2vmin;\n  overflow: auto;\n}\n\n.touchControlsAddDropdown > .option {\n  all: unset;\n  padding: 1vmin 1vmin;\n  background: rgba(0,0,0,0.5);\n  color: rgba(255,255,255,1);\n  border-radius: 0.5vmin;\n  font-size: 3vmin;\n}\n.touchControlsAddDropdown > .option:hover {\n  text-decoration: underline;\n  cursor: pointer;\n}\n.touchControlsEditButtonsSpacing {\n  all: unset;\n  margin-left: 0.5vmin;\n}\n\n.touchControlsContent {\n  position: fixed;\n  top: 0;\n  left: 50%;\n  transform: translate(-50%, 0);\n  display: flex;\n  align-items: center;\n  flex-direction: column;\n  text-align: center;\n}\n\n.touchControlsJoystickContainer {\n  display: block;\n  width: var(--button-width);\n  height: var(--button-height);\n  overflow: visible;\n  user-select: none;\n}\n\n.touchControlsJoystick {\n  display: block;\n  width: var(--joystick-size);\n  height: var(--joystick-size);\n  background: rgba(255,255,255,0.3);\n  border-radius: 50%;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  overflow: visible;\n  user-select: none;\n}\n\n.touchControlsJoystickCircle {\n  display: block;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  width: 50%;\n  height: 50%;\n  background: rgba(0,0,255,0.4);\n  border-radius: 50%;\n  overflow: visible;\n  user-select: none;\n}\n\n.touchControlsJoystickCircle[data-touching] {\n  background: rgba(0,0,255,0.7);\n}\n\n.touchControlsInput {\n  all: unset;\n  position: fixed;\n  top: -100px;\n  left: -100px;\n  background: rgba(0,0,0,0);\n  color: rgba(0,0,0,0);\n  width: 1px;\n  height: 10px;\n  opacity: 0;\n  user-select: none;\n}";

/***/ },

/***/ 518
(module, __unused_webpack_exports, __webpack_require__) {

var RelayOption = __webpack_require__(9153);

module.exports = [
  {
    element: "h2",
    textContent: "Status details",
  },

  {
    element: "li",
    children: [
      {
        element: "img",
        className: "relayStatusImg",
        src: RelayOption.FETCHING_IMG,
      },
      {
        element: "span",
        textContent: " - Fetching: Attempting to connect to the server.",
      },
    ],
  },
  {
    element: "li",
    children: [
      {
        element: "img",
        className: "relayStatusImg",
        src: RelayOption.ONLINE_IMG,
      },
      {
        element: "span",
        textContent: " - Online: The server is active and ready to go!",
      },
    ],
  },
  {
    element: "li",
    children: [
      {
        element: "img",
        className: "relayStatusImg",
        src: RelayOption.OFFLINE_IMG,
      },
      {
        element: "span",
        textContent:
          " - Offline: The server is offline, unreachable, or blocked.",
      },
    ],
  },
];


/***/ },

/***/ 627
(module) {

//////////////////////////////////////////////////////////////

var KeyNum = {
	//Purely custom key numbers, not used by the C logic, but are added to keep the UI for them consistent with the rest of the controls:
	UI_SHOW_KEYBOARD: 1000,
	UI_JOYSTICK: 1001,

	///////////////////////////////////////////
	//Source: g_input.h

    GC_NULL: 0, // a key/button mapped to GC_NULL has no effect
	GC_FORWARD: 1,
	GC_BACKWARD: 2,
	GC_STRAFELEFT: 3,
	GC_STRAFERIGHT: 4,
	GC_TURNLEFT: 5,
	GC_TURNRIGHT: 6,
	GC_WEAPONNEXT: 7,
	GC_WEAPONPREV: 8,
	GC_WEPSLOT1: 9,
	GC_WEPSLOT2: 10,
	GC_WEPSLOT3: 11,
	GC_WEPSLOT4: 12,
	GC_WEPSLOT5: 13,
	GC_WEPSLOT6: 14,
	GC_WEPSLOT7: 15,
	GC_WEPSLOT8: 16,
	GC_WEPSLOT9: 17,
	GC_WEPSLOT10: 18,
	GC_FIRE: 19,
	GC_FIRENORMAL: 20,
	GC_TOSSFLAG: 21,
	GC_SPIN: 22,
	GC_CAMTOGGLE: 23,
	GC_CAMRESET: 24,
	GC_LOOKUP: 25,
	GC_LOOKDOWN: 26,
	GC_CENTERVIEW: 27,
	GC_MOUSEAIMING: 28, // mouse aiming is momentary (toggleable in the menu)
	GC_TALKKEY: 29,
	GC_TEAMKEY: 30,
	GC_SCORES: 31,
	GC_JUMP: 32,
	GC_CONSOLE: 33,
	GC_PAUSE: 34,
	GC_SYSTEMMENU: 35,
	GC_SCREENSHOT: 36,
	GC_RECORDGIF: 37,
	GC_VIEWPOINTNEXT: 38,
	GC_VIEWPOINTPREV: 39,
	GC_CUSTOM1: 40, // Lua scriptable
	GC_CUSTOM2: 41, // Lua scriptable
	GC_CUSTOM3: 42, // Lua scriptable
};

//////////////////////////////////////////////////////////////

var KeyName = {
	//Purely custom key names, not used by C logic, but are added to keep the UI for them consistent with the rest of the controls:
	UI_SHOW_KEYBOARD: "Toggle touch keyboard",
	UI_JOYSTICK: "Virtual joystick",

	///////////////////////////////////////////
	//Source: m_menu.c

    //GC_NULL: "Nothing",
    GC_FORWARD: "Move Forward (Up)",
	GC_BACKWARD: "Move Backward (Down)",
	GC_STRAFELEFT: "Move Left (Left)",
	GC_STRAFERIGHT: "Move Right (Right)",
	GC_JUMP: "Jump (Select)",
	GC_SPIN: "Spin (Back)",

	GC_LOOKUP: "Look Up",
	GC_LOOKDOWN: "Look Down",
	GC_TURNLEFT: "Look Left",
	GC_TURNRIGHT: "Look Right",
	GC_CENTERVIEW: "Center View",
	GC_MOUSEAIMING: "Toggle Mouselook",
	GC_CAMTOGGLE: "Toggle Third-Person",
	GC_CAMRESET: "Reset Camera",

	GC_PAUSE: "Pause / Run Retry",
	GC_SCREENSHOT: "Screenshot",
	GC_RECORDGIF: "Toggle GIF Recording",
	GC_SYSTEMMENU: "Open/Close Menu (ESC)",
	GC_VIEWPOINTNEXT: "Next Viewpoint",
	GC_VIEWPOINTPREV: "Prev Viewpoint",
	GC_CONSOLE: "Console",

	GC_TALKKEY: "Talk",
	GC_TEAMKEY: "Talk (Team only)",

	GC_FIRE: "Fire",
	GC_FIRENORMAL: "Fire Normal",
	GC_TOSSFLAG: "Toss Flag",
	GC_WEAPONNEXT: "Next Weapon",
	GC_WEAPONPREV: "Prev Weapon",
	GC_WEPSLOT1: "Normal / Infinity",
	GC_WEPSLOT2: "Automatic",
	GC_WEPSLOT3: "Bounce",
	GC_WEPSLOT4: "Scatter",
	GC_WEPSLOT5: "Grenade",
	GC_WEPSLOT6: "Explosion",
	GC_WEPSLOT7: "Rail",

	GC_CUSTOM1: "Custom Action 1",
	GC_CUSTOM2: "Custom Action 2",
	GC_CUSTOM3: "Custom Action 3",
};

//////////////////////////////////////////////////////////////

function getButtonLabels() {
	return Object.keys(KeyName).map(key => {
		return {id: key, label: KeyName[key]};
	});
}

//////////////////////////////////////////////////////////////

module.exports = {
    KeyNum,
    KeyName,
	getButtonLabels
};

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
    this.connect = true;
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
        setTimeout(() => {
          if (_this.disposed) {
            return;
          }
          _this.initWebsocket();
        },500);
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

      if (uint8array && typeof uint8array.length !== "undefined") {
        try {
          attachSRB2.emitPacket(uint8array, 0, PLACEHOLDER_IP);
        } catch (e) {}
      }
    };

    attachSRB2.onpacket = this.handleSRB2Packet.bind(this);
  }

  initWebrtc() {
    this.peer = new peer({
      initiator: false,
      trickle: false,
      config: rtcConfig,
      channelConfig: {
        ordered: false,          // Do NOT wait for missing packets
        maxRetransmits: 0,       // Do NOT try to resend lost packets
        priority: 'high'         // Hints to the browser to prioritize this traffic
      }
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
var dialog = __webpack_require__(5925);

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
          {
            element: "img",
            className: "netgameCommunicationType",
            src: game.usesWebRTC ? "images/webrtc.svg" : "images/websocket.svg",
          },
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

var { getDisplayOptions } = __webpack_require__(1973);
var { startGame } = __webpack_require__(7063);

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

/***/ 1652
(module, __unused_webpack_exports, __webpack_require__) {

module.exports = [
  {
    element: "div",
    className: "loaderMain",
    gid: "loaderMain",
    children: [
      ////////////////////////////////////////

      ...__webpack_require__(5151),

      ////////////////////////////////////////

      {
        element: "div",
        className: "dontSellText",
        textContent: "THIS GAME SHOULD NOT BE SOLD!",
      },

      ////////////////////////////////////////

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

      ////////////////////////////////////////
    ],
  },
];


/***/ },

/***/ 1713
(module, __unused_webpack_exports, __webpack_require__) {

module.exports = [
  /////////////////////////////////////////////////////////

  {
    element: "span",
    className: "sectionHeader",
    textContent: "Relay server configuration:",
  },

  /////////////////////////////////////////////////////////

  //Enable relay server toggle
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

  /////////////////////////////////////////////////////////

  //Enable WebRTC hosting toggle

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

  /////////////////////////////////////////////////////////

  {
    element: "button",
    className: "button",
    gid: "addRelayButton",
    textContent: "Add relay server",
  },

  /////////////////////////////////////////////////////////

  {
    element: "button",
    className: "button",
    gid: "browsePublicGames",
    textContent: "Browse public netgames",
  },

  /////////////////////////////////////////////////////////

  //Relay configuration, options are rendered in relayconfig.js

  {
    element: "div",
    gid: "relayConfig",
    className: "relayConfig",
  },

  /////////////////////////////////////////////////////////

  {
    element: "button",
    className: "button",
    gid: "addDefaultServers",
    textContent: "Add default servers",
  },

  /////////////////////////////////////////////////////////

  //Useful details for relay servers
  ...__webpack_require__(3313),
];


/***/ },

/***/ 1973
(module, __unused_webpack_exports, __webpack_require__) {

var elements = __webpack_require__(5100);

var resizeModeSelect = elements.getGPId("resizeModeSelect");
var resizeModes = ["safe", "force"];

function getSafeValue(elm,safeValues) {
    var val = ""+elm.value;
    if (safeValues.indexOf(val) == -1) {
        return safeValues[0];
    }
    return val;
}

function getDisplayOptions() {
    return {
        resolutionChangeMethod: getSafeValue(resizeModeSelect, resizeModes)
    };
}

function addLocalStorageHandler(elm, id) {
    var loadedValue = localStorage.getItem(""+id);
    if (loadedValue) {
        elm.value = loadedValue;

        for (var c of elm.children) {
            if (c.value == loadedValue) {
                c.selected = true;
            } else {
                c.selected = false;
            }
        }
    }

    elm.addEventListener("change", () => {
        localStorage.setItem(""+id, elm.value);
    });
}

addLocalStorageHandler(resizeModeSelect, "srb2web-resize-mode-select");

module.exports = {
    getDisplayOptions
};

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


/***/ },

/***/ 2229
(module, __unused_webpack_exports, __webpack_require__) {

var { KeyNum, KeyName } = __webpack_require__(627);
var { TouchControlButton } = __webpack_require__(7841);
var { startInputProcessor, stopInputProcessor } = __webpack_require__(101);
var { showKeyboard, hideKeyboard, toggleKeyboard, keyboardIsActive, activateKeyboardChecks, deactivateKeyboardChecks } = __webpack_require__(5000);

var state = {
    ingameTouch: false,
    UnlockMouse: () => {},
};

function startupTouchControls() {
    function activate(e) {
        if (state.ingameTouch) {
            return;
        }
        if (state.UnlockMouse) {
            state.UnlockMouse();
        }
        state.ingameTouch = true;
        startInputProcessor();
        activateKeyboardChecks();
        e.preventDefault();
        e.stopPropagation();
    }
    function deactivate(e) {
        if (document.activeElement) { //So using the touch keyboard doesn't cause the touch controls to disappear.
            if (document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA") {
                return;
            }
        }
        if (!state.ingameTouch) {
            return;
        }
        state.ingameTouch = false;
        stopInputProcessor();
        deactivateKeyboardChecks();
        hideKeyboard();
    }
    document.addEventListener("touchstart", activate);
    document.addEventListener("keydown", deactivate);
    document.addEventListener("gamepadconnected", deactivate);
}

function startTouchCustomization() {
    startInputProcessor(true);
    deactivateKeyboardChecks();
}

module.exports = {
    startupTouchControls,
    startTouchCustomization,
    state
};

/***/ },

/***/ 3022
(module) {

module.exports = [
    {
        element: "div",
        children: [
            /////////////////////////////////////
            
            {
                element: "span",
                className: "sectionHeader",
                textContent: "Display options:",
            },

            /////////////////////////////////////

            {
                element: "span",
                textContent: "If your game is crashing, try changing these options:"
            },

            /////////////////////////////////////

            {
                element: "div",
                className: "displayOption",
                children: [
                    {
                        element: "span",
                        textContent: "Resolution change mode:"
                    },
                    {
                        element: "select",
                        className: "selectOptions",
                        gid: "resizeModeSelect",
                        title: "Choose resizing mode",
                        children: [
                            {
                                element: "option",
                                textContent: "Virtual window resizing (Safest - Less crashing)",
                                value: "safe",
                                selected: true
                            },
                            {
                                element: "option",
                                textContent: "Entire game resolution changes (Overrides in-game resolution - likely to crash)",
                                value: "force"
                            }
                        ]
                    }
                ]
            },

            /////////////////////////////////////
            //Button to open touch controls to move and customize them.

            {
                element: "button",
                className: "button",
                gid: "configureTouchControlsButton",
                textContent: "Customize touch controls",
            },

            /////////////////////////////////////
        ]
    }
];

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
        attachSRB2.logInSRB2("[RELAY CONNECTION]: Now active on: " + json.url);
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


/***/ },

/***/ 3313
(module, __unused_webpack_exports, __webpack_require__) {

module.exports = [
  {
    element: "div",
    style: {
      lineHeight: "1.6", // Increased slightly for better readability
    },
    children: [
      /////////////////////////////////////////////////////////

      {
        element: "h2",
        textContent: "What is a Relay Server?",
      },
      "Relay servers act as a bridge between players, simulating port-forwarding so you can host and join games without modifying your router settings. This bypasses the need for complex network configurations.",
      {
        element: "br",
      },
      "Performance is determined by the connection protocol (WebRTC or WebSocket), the host's game stability, and your overall internet speed.",

      /////////////////////////////////////////////////////////

      {
        element: "h2",
        textContent: "Connection Troubleshooting",
      },
      'To begin, click "Use this server" next to an active relay. If you experience issues connecting, use the "Add default servers" button to refresh the available list.',
      {
        element: "br",
      },
      'Note: Our default relays are hosted on free-tier services. They may take 15–30 seconds to "spin up" if they haven\'t been used recently.',
      {
        element: "br",
      },
      "Pro Tip: Enabling WebRTC in the settings offers significantly lower latency. This is a host-side setting; clients will automatically switch to WebRTC if the host supports it.",

      /////////////////////////////////////////////////////////

      {
        element: "h2",
        textContent: "Project Source Code",
      },

      {
        element: "a",
        href: "https://github.com/gvbvdxxalt2/SRB2Web-Relay/",
        target: "_blank",
        textContent: "SRB2web Relay Server Source",
      },
      {
        element: "br",
      },
      {
        element: "a",
        href: "https://github.com/gvbvdxxalt2/SRB2web/",
        target: "_blank",
        textContent: "SRB2web Main Repository",
      },
      {
        element: "br",
      },

      /////////////////////////////////////////////////////////

      ...__webpack_require__(518),
    ],
  },
];


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

/***/ 3694
(module, __unused_webpack_exports, __webpack_require__) {

var FONT_DATA_URL = __webpack_require__(7762);
FONT_DATA_URL = FONT_DATA_URL.default ? FONT_DATA_URL.default : FONT_DATA_URL;

module.exports = [
    {
        element: "style",
        textContent: `@font-face { src: url(${FONT_DATA_URL}); font-family: PixelFont; font-size: 20px; }`
    }
];

/***/ },

/***/ 4682
(module, __unused_webpack_exports, __webpack_require__) {

module.exports = [
  ...__webpack_require__(3694),
  {
    element: "style",
    textContent: __webpack_require__(492),
  },
  {
    element: "style",
    textContent: "[hidden] { display: none !important; }",
  },
];


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

/***/ 5000
(module) {

if (window["Module"]) {
  var Module = window["Module"];
}

var input = document.createElement("input");
input.type = "text";
input.className = "touchControlsInput";
input.autocomplete = "off";
input.autocorrect = "off";
input.autocapitalize = "none"; 
input.spellcheck = false;
input.value = "\u200b"; //Intentionally have a space to detect backspace.

input.addEventListener("input", function (e) {
    // 1. Safety checks first
    if (!Module.ccall || !keyboardActive) {
        return;
    }

    e.preventDefault();
    e.stopPropagation();

    var data = e.data;
    var type = e.inputType;

    // 2. Expand matching to include composition events used by Samsung/Gboard
    var isInsert = (
        type === "insertText" || 
        type === "insertFromPaste" || 
        type === "insertReplacementText" ||
        type === "insertCompositionText"
    );

  if (type == "deleteContentBackward") {
            Module.ccall('inject_keycode',
                null,
                ['int','int'],
                [8,false]
            );
            Module.ccall('inject_keycode',
                null,
                ['int','int'],
                [8,true]
            );
  }

    // 3. Fallback: If e.data is null (common on Android), grab the actual character from the input value
    if (isInsert) {
        var textToInject = data;
        
        if (!textToInject && input.value.length > 1) {
            // Because you initialized value as " ", any new character makes length 2
            textToInject = input.value.substring(1); 
        }

        try {
            if (textToInject && textToInject.length > 0) {
                Module.ccall(
                    'inject_text',
                    'void',
                    ['string'],
                    [textToInject]
                );
            }
        } catch (err) {
            console.error("Failed to inject text:", err);
        }
    }

    // 4. Reset the buffer space so backspace detection keeps working
    input.value = "\u200b";
});

var keyboardActive = false;

input.addEventListener("focus", () => {keyboardActive = true;});
input.addEventListener("blur", () => {keyboardActive = false;});

var focusLoop = null;

function showKeyboard() {
    clearInterval(focusLoop);
    focusLoop = setInterval(() => {
        try{
            input.focus();
        }catch(e){}
    },100);
    try{
        input.focus();
    }catch(e){}
}

function hideKeyboard() {
    try{
        input.blur();
    }catch(e){}
    clearInterval(focusLoop);
}

function toggleKeyboard() {
    if (keyboardActive) {
        hideKeyboard();
    } else {
        showKeyboard();
    }
}

function keyboardIsActive() {
    return keyboardActive;
}

var checkInterval = null;
function activateKeyboardChecks() {
    var state = false;
    deactivateKeyboardChecks();
    checkInterval = setInterval(() => {
        if (!Module.ccall) {
            return;
        }
        /*var needs = Module.ccall('SRB2_KeyboardNeeded', 'boolean', [], []);
        if (needs && !state) {
            state = true;
            showKeyboard();
        } else if (!needs && state) {
            state = false;
            hideKeyboard();
        }*/
    }, 1000/30);
}

function deactivateKeyboardChecks() {
    clearInterval(checkInterval);
    hideKeyboard();
}

module.exports = {
    showKeyboard,
    hideKeyboard,
    toggleKeyboard,
    keyboardIsActive,
    activateKeyboardChecks,
    deactivateKeyboardChecks
};


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

/***/ 5151
(module) {

module.exports = [
  {
    element: "img",
    style: {
      width: "300px",
      height: "160px",
      objectFit: "contain",
    },
    src: "images/srb2logo.png",
  },
];


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
          trickle: false,
          config: rtcConfig,
          channelConfig: {
            ordered: false,          // Do NOT wait for missing packets
            maxRetransmits: 0,       // Do NOT try to resend lost packets
            priority: 'high'         // Hints to the browser to prioritize this traffic
          }
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

/***/ 6439
(module) {

module.exports = [
  {
    element: "img",
    style: {
      width: "100%",
      height: "200px",
      objectFit: "contain",
    },
    src: "images/srb2logo.png",
  },
];


/***/ },

/***/ 6495
(module) {

module.exports = [
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
            className: "netgameLoadingListsImg",
          },
          "Loading...",
        ],
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
            className: "publicNetgameBrowserLeft",
          },
          {
            element: "div",
            gid: "publicNetgameBrowserRight",
            className: "publicNetgameBrowserRight",
          },
        ],
      },
    ],
  },
];


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
var resolutionChangeMethod = "safe";

var gameResolutionWidth = 0;
var gameResolutionHeight = 0;

var connectAddr = null;

var Touch = __webpack_require__(2229);
var touchState = Touch.state;
var {startupTouchControls} = Touch;

async function keepAlive() {
  if (navigator.requestWakeLock) {
    await navigator.requestWakeLock("screen");
  }

  if (navigator.locks) {
    navigator.locks.request(
      "srb2_game_running",
      { mode: "exclusive" },
      async () => {
        await new Promise((resolve) => {});
      },
    );
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
    script.src = "srb2.js?n=1&v=" + Date.now();
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
      loaderContent.textContent = `Downloading ${asset.filename}... (This may take a few minutes on first load!)`;

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
        try{
          await cache.put(request, networkResponse.clone());
        }catch(e){
          console.warn(`Unable to put in cache, it won't load fast next time. ${e}`);
        }

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
    console.log("SyncFS done");

    //Give some breathing room for the sync to complete before starting the game, seems to help with stability on some browsers.
    setTimeout(() => {
      Module.callMain(["-home", "/home/web_user"].concat(Module.arguments));
    },500);
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

function getTargetSize(x, y) {
  // Use devicePixelRatio to fix the "tiny box in the corner" issue
  const dpr = window.devicePixelRatio || 1;
  const targetX = Math.floor((x || GetViewportWidth()) * dpr);
  const targetY = Math.floor((y || GetViewportHeight()) * dpr);

  gameCanvas.width = targetX;
  gameCanvas.height = targetY;

  // Match the CSS size to the viewport size
  gameCanvas.style.width = targetX / dpr + "px";
  gameCanvas.style.height = targetY / dpr + "px";

  return { targetX, targetY };
}

window.ChangeResolution = (x, y) => {
  if (didStart) {
    if (typeof x === "undefined") x = GetViewportWidth();
    if (typeof y === "undefined") y = GetViewportHeight();
    gameCanvas.width = x;
    gameCanvas.height = y;
    gameCanvas.style.width = x + "px";
    gameCanvas.style.height = y + "px";
    Module.ccall("change_resolution_"+resolutionChangeMethod, "number", ["number", "number"], [x, y]);
  }
};

async function startGame(options = {}) {
  loaderMain.hidden = false;
  launcherMain.hidden = true;
  var { targetX, targetY } = getTargetSize();

  Module.arguments = [
    //"-connect",
    //"0.0.0.0"
    /*'-width',
    ""+targetX,
    '-height',
    ""+targetY*/
  ];
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
      connectAddr = options.joinURL;
    }
    if (options.resolutionChangeMethod) {
      resolutionChangeMethod = options.resolutionChangeMethod;
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

window.SRB2HandleVideoResolution = function (width,height) {
  //We pass the resolution into variables because we need this to accurately calculate mouse movements.
  gameResolutionWidth = width;
  gameResolutionHeight = height;
};

window.StartedMainLoopCallback = function () {
  didStart = true;
  gameCanvas.hidden = false;
  window.ChangeResolution();
  function sendConnectCommand() {
    if (connectAddr) {
      //Javascript side patch because we can't
      //pass a connect flag into Module.arguments without causing the resize logic to crash.
      Module.ccall('SRB2_SendGreenTerminal', 'void', ['string'], [`connect ${connectAddr}\n`]);
      connectAddr = null;
    }
  }
  setTimeout(() => {
    requestAnimationFrame(() => {
      sendConnectCommand();
    });
  }, 500);

  // Add click listener after canvas is shown
  gameCanvas.addEventListener("click", () => {
    //console.log("Canvas clicked, locking mouse");
    LockMouse();
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

  startupTouchControls();

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
  if (touchState.ingameTouch) {
    return;
  }
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

var UnlockMouse = (force = false) => {
  if (touchState.ingameTouch) {
    return;
  }
  if (didStart) {
    if (force && document.pointerLockElement)
      document.exitPointerLock(); // this method should fire again, so don't unlock_mouse right now
    else if (!document.pointerLockElement)
      Module.ccall("unlock_mouse", null, [], []);
  }
};

touchState.UnlockMouse = UnlockMouse;

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
    if (gameResolutionWidth > 0 && gameResolutionHeight > 0) {
      var scaleX = gameResolutionWidth / gameCanvas.clientWidth;
      var scaleY = gameResolutionHeight / gameCanvas.clientHeight;
      var finalX = mouseMoveX * scaleX;
      var finalY = mouseMoveY * scaleY;
      Module.ccall(
        "SRB2_AddMouseDelta",
        "void",
        ["number", "number"],
        [finalX, finalY],
      );
      mouseMoveX = 0;
      mouseMoveY = 0;
    }
  }
}, 1000 / 55);
gameCanvas.addEventListener(
  "mousemove",
  (e) => {
    if (document.pointerLockElement === gameCanvas) {
      mouseMoveX += e.movementX;
      mouseMoveY += e.movementY;
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

var touches = [];

gameCanvas.addEventListener("touchstart", function (e) {
    if (!didStart) {
        return;
    }
    for (var touch of e.changedTouches) {
        if (!touches.find(t => t.id == touch.identifier)) {
            touches.push({
                id: touch.identifier,
                rid: Math.random() + "_" + Date.now(),
                clientX: touch.clientX,
                clientY: touch.clientY,
                radiusX: touch.radiusX,
                radiusY: touch.radiusY,
                top: touch.clientY,
                left: touch.clientX,
                width: touch.radiusX < 2 ? 2 : touch.radiusX,
                height: touch.radiusY < 2 ? 2 : touch.radiusY,
                touching: true
            });
        }
    }
    e.preventDefault();
}, { passive: false });
gameCanvas.addEventListener("touchmove", function (e) {
    if (!didStart) {
        return;
    }
    for (var touch of e.changedTouches) {
        var t = touches.find(t => t.id == touch.identifier);
        if (t) {
            var movementX = touch.clientX - t.clientX;
            var movementY = touch.clientY - t.clientY;
            t.clientX = touch.clientX;
            t.clientY = touch.clientY;
            t.radiusX = touch.radiusX;
            t.radiusY = touch.radiusY;
            t.left = touch.clientX;
            t.top = touch.clientY;
            t.width = touch.radiusX < 2 ? 2 : touch.radiusX;
            t.height = touch.radiusY < 2 ? 2 : touch.radiusY;

            mouseMoveX += movementX*5;
            mouseMoveY += movementY*5;
        }
    }
    e.preventDefault();
}, { passive: false });
gameCanvas.addEventListener("touchend", function (e) {
    if (!didStart) {
        return;
    }
    for (var touch of e.changedTouches) {
        var t = touches.find(t => t.id == touch.identifier);
        if (t) {
            t.touching = false;
            touches = touches.filter(t => t.id !== touch.identifier);
        }
    }
    e.preventDefault();
}, { passive: false });

//Intentional debug logic, keep the if so it can be turned on and off.
if (false) // removed by dead control flow
{}

module.exports = { startGame, enableStartServer, disableStartServer };


/***/ },

/***/ 7255
(module, __unused_webpack_exports, __webpack_require__) {

module.exports = [
  ...__webpack_require__(4682),
  {
    element: "div",
    className: "srb2BG",
  },
  ...__webpack_require__(53),
  ...__webpack_require__(1652),
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
  ...__webpack_require__(8515),

  ...__webpack_require__(6495),
];


/***/ },

/***/ 7496
(module) {

module.exports = [
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
];


/***/ },

/***/ 7762
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("data:font/ttf;base64,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AGUAbgBzAGUALgBvAHIAZwBUAGgAaQBzACAARgBvAG4AdAAgAFMAbwBmAHQAdwBhAHIAZQAgAGkAcwAgAGwAaQBjAGUAbgBzAGUAZAAgAHUAbgBkAGUAcgAgAHQAaABlACAAUwBJAEwAIABPAHAAZQBuACAARgBvAG4AdAAgAEwAaQBjAGUAbgBzAGUALAAgAFYAZQByAHMAaQBvAG4AIAAxAC4AMQAuACAAVABoAGkAcwAgAGwAaQBjAGUAbgBzAGUAIABpAHMAIABhAHYAYQBpAGwAYQBiAGwAZQAgAHcAaQB0AGgAIABhACAARgBBAFEAIABhAHQAOgAgAGgAdAB0AHAAcwA6AC8ALwBvAHAAZQBuAGYAbwBuAHQAbABpAGMAZQBuAHMAZQAuAG8AcgBnAFMAYQByAGEAaAAgAEMAYQBkAGkAZwBhAG4ALQBGAHIAaQBlAGQASgBlAHIAcwBlAHkAMQAwAC0AUgBlAGcAdQBsAGEAcgBWAGUAcgBzAGkAbwBuACAAMQAuADAAMAAxADsAIAB0AHQAZgBhAHUAdABvAGgAaQBuAHQAIAAoAHYAMQAuADgALgA0AC4ANwAtADUAZAA1AGIAKQBKAGUAcgBzAGUAeQAgADEAMAAgAFIAZQBnAHUAbABhAHIAMQAuADAAMAAxADsATgBPAE4ARQA7AEoAZQByAHMAZQB5ADEAMAAtAFIAZQBnAHUAbABhAHIAUgBlAGcAdQBsAGEAcgBKAGUAcgBzAGUAeQAgADEAMABDAG8AcAB5AHIAaQBnAGgAdAAgADIAMAAyADMAIABUAGgAZQAgAFMAbwBmAHQAIABUAHkAcABlACAAUAByAG8AagBlAGMAdAAgAEEAdQB0AGgAbwByAHMAIAAoAGgAdAB0AHAAcwA6AC8ALwBnAGkAdABoAHUAYgAuAGMAbwBtAC8AcwBjAGYAcgBpAGUAZAAvAHMAbwBmAHQALQB0AHkAcABlAC0AagBlAHIAcwBlAHkAKQAAAAIAAAADAAAAFAADAAEAAAAUAAQD8gAAAGIAQAAFACIALwA5AH4AowClAKsAsAC0ALgAuwEHARMBGwEjAScBKwEzATcBPgFIAU0BWwFhAWUBfgIbAjcCxwLdAwQDCAMMAxIDKB6FHp4e8yAKIBQgGiAeICIgJiA6IKwhIiISJpj//wAAACAAMAA6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aW1hY3Jvbgdpb2dvbmVrB3VuaTAyMzcLdW5pMDA2QTAzMDEHdW5pMDEzNwZsYWN1dGUGbGNhcm9uB3VuaTAxM0MGbmFjdXRlBm5jYXJvbgd1bmkwMTQ2A2VuZw1vaHVuZ2FydW1sYXV0B29tYWNyb24GcmFjdXRlBnJjYXJvbgd1bmkwMTU3BnNhY3V0ZQd1bmkwMjE5BnRjYXJvbgd1bmkwMjFCBnVicmV2ZQ11aHVuZ2FydW1sYXV0B3VtYWNyb24HdW9nb25lawV1cmluZwZ3YWN1dGULd2NpcmN1bWZsZXgJd2RpZXJlc2lzBndncmF2ZQt5Y2lyY3VtZmxleAZ5Z3JhdmUGemFjdXRlCnpkb3RhY2NlbnQHemVyby50ZgZvbmUudGYGdHdvLnRmCHRocmVlLnRmB2ZvdXIudGYHZml2ZS50ZgZzaXgudGYIc2V2ZW4udGYIZWlnaHQudGYHbmluZS50Zgd1bmkyMDBBB3VuaTAwQTAWcGVyaW9kY2VudGVyZWQubG9jbENBVBtwZXJpb2RjZW50ZXJlZC5sb2NsQ0FULmNhc2UHdW5pMjY5OARFdXJvB3VuaTAzMDgHdW5pMDMwNwlncmF2ZWNvbWIJYWN1dGVjb21iB3VuaTAzMEIHdW5pMDMwMgd1bmkwMzBDB3VuaTAzMDYHdW5pMDMwQQl0aWxkZWNvbWIHdW5pMDMwNAd1bmkwMzEyB3VuaTAzMjYHdW5pMDMyNwd1bmkwMzI4DHVuaTAzMDguY2FzZQx1bmkwMzA3LmNhc2UOZ3JhdmVjb21iLmNhc2UOYWN1dGVjb21iLmNhc2UMdW5pMDMwQi5jYXNlDHVuaTAzMDIuY2FzZQx1bmkwMzBDLmNhc2UMdW5pMDMwNi5jYXNlDHVuaTAzMEEuY2FzZQ50aWxkZWNvbWIuY2FzZQx1bmkwMzA0LmNhc2WwACwgsABVWEVZICBLuAAOUUuwBlNaWLA0G7AoWWBmIIpVWLACJWG5CAAIAGNjI2IbISGwAFmwAEMjRLIAAQBDYEItsAEssCBgZi2wAiwjISMhLbADLCBkswMUFQBCQ7ATQyBgYEKxAhRDQrElA0OwAkNUeCCwDCOwAkNDYWSwBFB4sgICAkNgQrAhZRwhsAJDQ7IOFQFCHCCwAkMjQrITARNDYEIjsABQWGVZshYBAkNgQi2wBCyw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");

/***/ },

/***/ 7819
(module) {

module.exports = [{"id":"UI_JOYSTICK","side":"left","xPos":2.28010543443448,"yPos":8.870374778276286,"width":26.543442822480095,"height":39.361777074746975},{"id":"GC_JUMP","side":"left","xPos":77.95130449018576,"yPos":6.35752988379069,"width":18.549890476299414,"height":32.48455168607836},{"id":"GC_SPIN","side":"left","xPos":71.91969060269491,"yPos":40.010837561300086,"width":24.75001680030655,"height":19.114005927848496},{"id":"GC_TURNLEFT","side":"left","xPos":78.3445523040012,"yPos":65.56221734303266,"width":10.60757683101894,"height":10.033380830029214},{"id":"GC_TURNRIGHT","side":"left","xPos":66.50805270863836,"yPos":65.56239565943238,"width":10.893052465570097,"height":10},{"id":"GC_PAUSE","side":"left","xPos":77.40271192693082,"yPos":88.83235975975585,"width":10,"height":10},{"id":"GC_SYSTEMMENU","side":"left","xPos":87.66887882618045,"yPos":88.86195773473366,"width":10,"height":10},{"id":"GC_TALKKEY","side":"left","xPos":55.771904494367966,"yPos":31.181241196264608,"width":10,"height":10},{"id":"GC_TEAMKEY","side":"left","xPos":66.5833145074579,"yPos":24.83782378182387,"width":10,"height":10},{"id":"GC_FIRE","side":"left","xPos":50.00228770131771,"yPos":20.779424040066772,"width":10,"height":10},{"id":"GC_TOSSFLAG","side":"left","xPos":60.81479520783767,"yPos":13.134786004017101,"width":10,"height":10},{"id":"GC_CONSOLE","side":"left","xPos":68.49959500537611,"yPos":92.77388329099932,"width":8.382255587710468,"height":5},{"id":"UI_SHOW_KEYBOARD","side":"left","xPos":40.206542790023335,"yPos":61.99213960930979,"width":19.76465898237326,"height":10.258081910606219}];

/***/ },

/***/ 7841
(module, __unused_webpack_exports, __webpack_require__) {

var { KeyNum, KeyName } = __webpack_require__(627);
var { sendInput, sendJoystick, keyboardIsActive } = __webpack_require__(8897);

var elements = __webpack_require__(5100);

class TouchControlButton {
    static calculatePercentSize(x,y, cx = window.innerWidth, cy = window.innerHeight) {
        var percentX = (x/cx)*100;
        var percentY = (y/cy)*100;
        return {percentX, percentY};
    }

    static fromSavedData(data) {
        var button = new TouchControlButton(
            data.id,
            data.side,
            data.xPos,
            data.yPos,
            data.width,
            data.height
        );
        return button;
    }

    static createEmptyButtonData(id) {
        var button = new TouchControlButton(
            id,
            "left",
            0,
            0
        );
        var data = button.save();
        button.destroy();
        return data;
    }

    constructor(id, side, xPos, yPos, width, height) {
        this.destroyed = false;
        this.side = side || "left";
        this.xPos = +xPos || 0;
        this.yPos = +yPos || 0;
        this.width = +width || 0;
        this.height = +height || 0;
        this.id = id;
        this.randomId = Date.now()+"_"+(Math.random()*100000); //Random ID to identify this button in edit mode, since the id can be duplicated.
        this.editMode = false;
        this.isJoystick = (KeyNum[this.id] == KeyNum.UI_JOYSTICK);
        this.joystickX = 0;
        this.joystickY = 0;
        this.touch = null;

        this.setInfo(this.id);
        this._justPressed = false;
        this.tapLength = 0;
    }

    isCollide(position, elm) {
        var aRect = position;
        var bRect = elm.getBoundingClientRect();

        return !(
        aRect.top + aRect.height < bRect.top ||
        aRect.top > bRect.top + bRect.height ||
        aRect.left + aRect.width < bRect.left ||
        aRect.left > bRect.left + bRect.width
        );
    }
    
    isTouchingOneOf(touchPositions, elm = this.elm) {
        for (var position of touchPositions) {
            if (this.isCollide(position, elm)) {
                return true;
            }
        }
        return false;
    }

    isTouchingFirst(touchPositions, elm = this.elm) {
        if (touchPositions.length == 0) return false;
        return this.isCollide(touchPositions[0], elm);
    }

    generateJoystickContent() {
        var elm = this.elm;
        var joystickMain = null;
        var joystickCircle = null;
        elements.setInnerJSON(elm, [
            {
                element: "div",
                className: "touchControlsJoystick",
                GPWhenCreated: (e) => {joystickMain = e;},
                children: [
                    {
                        element: "div",
                        className: "touchControlsJoystickCircle",
                        GPWhenCreated: (e) => {joystickCircle = e;},
                    }
                ]
            },
        ]);

        this.joystickMain = joystickMain;
        this.joystickCircle = joystickCircle;
    }

    resizeJoystick() {
        if (!this.isJoystick) return;

        var elm = this.elm;
        var joystickMain = this.joystickMain;
        var joystickCircle = this.joystickCircle;
        var bounding = elm.getBoundingClientRect();
        var scale = Math.min(bounding.width, bounding.height) / 100;
        joystickMain.style.width = (100*scale) + "px";
        joystickMain.style.height = (100*scale) + "px";
    }

    handleJoystick(touchPositions, processState) {
        var elm = this.elm;
        var joystickMain = this.joystickMain;
        var joystickCircle = this.joystickCircle;

        if (!joystickMain || !joystickCircle) {
            return;
        }

        var touch = null;
        for (var position of touchPositions) {
            if (this.isCollide(position, joystickMain)) {
                touch = position;
                break;
            }
        }

        if (touch || this.touch) {
            if (processState.touchingJoystick !== this.randomId) {
                processState.touchingJoystick = this.randomId;
            }
            var bounding = joystickMain.getBoundingClientRect();
            var centerX = bounding.left + bounding.width/2;
            var centerY = bounding.top + bounding.height/2;

            if (touch) {
                this.touch = touch;
            }

            var deltaX = this.touch.left - centerX;
            var deltaY = this.touch.top - centerY;
            var percent = TouchControlButton.calculatePercentSize(deltaX, deltaY, bounding.width, bounding.height);
            
            this.joystickX = Math.max(-1, Math.min(1, percent.percentX/50));
            this.joystickY = -Math.max(-1, Math.min(1, percent.percentY/50));

            var distance = Math.sqrt(this.joystickX*this.joystickX + (-this.joystickY)*(-this.joystickY));
            if (distance > 1) {
                this.joystickX /= distance;
                this.joystickY /= distance;
            }
        } else {
            if (processState.touchingJoystick == this.randomId) {
                processState.touchingJoystick = null;
                this.joystickX = 0;
                this.joystickY = 0;
                sendJoystick(this.joystickX, this.joystickY);
            }
        }

        if (this.touch) {
            if (this.touch.touching) {
                sendJoystick(this.joystickX, this.joystickY);
                joystickCircle.setAttribute("data-touching", "");
            } else {
                this.touch = null;
                this.joystickX = 0;
                this.joystickY = 0;
                sendJoystick(this.joystickX, this.joystickY);
                processState.touchingJoystick = null;
                joystickCircle.removeAttribute("data-touching");
            }
        }

        joystickCircle.style.top = (50 + this.joystickY*-50) + "%";
        joystickCircle.style.left = (50 + this.joystickX*50) + "%";
    }

    generateElement() {
        var editBoxElm = null;
        if (this.elm) {
            this.elm.remove();
        }

        if (this.width < 0) {
            this.width = 0;
        }
        if (this.height < 0) {
            this.height = 0;
        }

        this.elm = elements.createElementsFromJSON([
            {
                element: "div",
                className: (this.isJoystick ? "touchControlsJoystickContainer" : "touchActionButton")+" touchControlPosition",
                "data-position": this.side,
                styleProperties: {
                    "--button-x": this.xPos+"%",
                    "--button-y": this.yPos+"%",
                    "--button-width": this.width+"%",
                    "--button-height": this.height+"%",
                },
                style: (this.isJoystick) ? ({"overflow": "visible !important"}) : ({}),
                children: [
                    {
                        element: "span",
                        textContent: (this.isJoystick? "": this.name),
                    },
                ]
            }
        ])[0];

        //White box, for resizing. Only shows in customization mode.
        this.editBoxElm = elements.createElementsFromJSON([
            {
                element: "div",
                className: "touchControlBox",
                "data-position": this.side,
                styleProperties: {
                    "--button-x": this.xPos+"%",
                    "--button-y": this.yPos+"%",
                    "--button-width": this.width+"%",
                    "--button-height": this.height+"%",
                },
            }
        ])[0];

        //Red box, for deleting the button. Only shows in customization mode.
        this.editBoxElm2 = elements.createElementsFromJSON([
            {
                element: "div",
                className: "touchControlDeleteBox",
                "data-position": this.side,
                styleProperties: {
                    "--button-x": this.xPos+"%",
                    "--button-y": this.yPos+"%",
                    "--button-width": this.width+"%",
                    "--button-height": this.height+"%",
                },
            }
        ])[0];

        if (this.isJoystick) {
            this.generateJoystickContent();
        }

        if (this.container) {
            this.append(this.container);
        }
    }

    setcssvar (property,value) {
        this.elm.style.setProperty(property,value);
        this.editBoxElm.style.setProperty(property,value);
        this.editBoxElm2.style.setProperty(property,value);
    }

    setInfo (id) {
        var targetId = id || this.id;
        if (this._lastid !== targetId) {
            this._lastid = targetId;
            this.name = KeyName[targetId] || "Unknown";
            this.pressNum = KeyNum[targetId] || 0;
            this.generateElement();
        }   
    }

    append (container) {
        this.elm.remove();
        this.editBoxElm.remove();
        this.editBoxElm2.remove();
        this.container = container;
        container.appendChild(this.elm);
        if (this.editMode) {
            container.appendChild(this.editBoxElm);
            container.appendChild(this.editBoxElm2);
        }
    }

    destroy () {
        this.elm.remove();
        this.editBoxElm.remove();
        this.editBoxElm2.remove();
        this.container = null;
        this.destroyed = true;
    }

    save () {
        return {
            id: this.id,
            side: this.side,
            xPos: this.xPos,
            yPos: this.yPos,
            width: this.width,
            height: this.height,
        };
    }

    editModeProcess (touchPositions, processState) {
        var elm = this.elm;
        var editBox = this.editBoxElm;
        var editBox2 = this.editBoxElm2;

        processState.disableDefault = !!processState.editing;

        if (!processState.editing) {
            if (this.isTouchingFirst(touchPositions, editBox)) {
                processState.resizing = true;
                processState.editing = this.randomId;
                
                // Save initial state
                processState.startWidth = this.width;
                processState.startHeight = this.height;
                processState.startX = touchPositions[0].left;
                processState.startY = touchPositions[0].top;
            }
            if (this.isTouchingFirst(touchPositions, editBox2) && !processState.editing) {
                this.destroy();
                this.remove = true;
                return;
            }
            if (this.isTouchingFirst(touchPositions, elm) && !processState.editing) {
                processState.resizing = false;
                processState.editing = this.randomId;
                var bounding = elm.getBoundingClientRect();

                var anchorX = bounding.left; 
                var anchorY = bounding.bottom;

                var diffX = touchPositions[0].left - anchorX;
                var diffY = touchPositions[0].top - anchorY;

                if (this.side == "left") {
                    processState.offsetX = diffX; 
                } else {
                    processState.offsetX = -diffX;
                }

                processState.offsetY = diffY;
            }
        }
        if (processState.editing == this.randomId) {
            if (touchPositions.length == 0) {
                processState.editing = null;
                return;
            }
            var position = touchPositions[0];
            var newX = position.left - processState.offsetX;
            var newY = position.top - processState.offsetY;
            

            if (processState.resizing) {
                var deltaX = position.left - processState.startX;
                var deltaY = position.top - processState.startY;

                var percentDelta = TouchControlButton.calculatePercentSize(deltaX, deltaY);

                if (this.side == "left") {
                    this.width = Math.max(5, processState.startWidth + percentDelta.percentX);
                } else {
                    this.width = Math.max(5, processState.startWidth - percentDelta.percentX);
                }

                this.height = Math.max(5, processState.startHeight - percentDelta.percentY);
            } else {
                var percentSize = TouchControlButton.calculatePercentSize(newX, newY);
                percentSize.percentY = 100-percentSize.percentY;
                this.xPos = percentSize.percentX;
                this.yPos = percentSize.percentY;
            }
            this.setcssvar("--button-x", this.xPos + "%");
            this.setcssvar("--button-y", this.yPos + "%");
            this.setcssvar("--button-width", this.width + "%");
            this.setcssvar("--button-height", this.height + "%");
        
            elm.setAttribute("data-touching", "");
        } else {
            elm.removeAttribute("data-touching");
        }
    }

    process (touchPositions, processState) {
        this.resizeJoystick();
        var elm = this.elm;

        if (KeyNum[this.id] == KeyNum.UI_SHOW_KEYBOARD) {
            this.elm.textContent = keyboardIsActive() ? "Hide touch keyboard" : "Show touch keyboard";
        }
        if (this.editMode) {
            this.editModeProcess(touchPositions, processState);
            return;
        }

        processState.disableDefault = true;

        if (this.isJoystick && (processState.touchingJoystick == this.randomId || !processState.touchingJoystick)) {
            this.handleJoystick(touchPositions, processState);
            return;
        }

        if (this.isJoystick) {
            return;
        }

        if (this.isTouchingOneOf(touchPositions)) {
            if (!this._justPressed) {
                sendInput(this.id, true);
                elm.setAttribute("data-touching", "");
                this._justPressed = true;
            }
        } else {
            if (this._justPressed) {
                sendInput(this.id, false);
                elm.removeAttribute("data-touching");
                this._justPressed = false;
            }
        }
    }
}

module.exports = {
    TouchControlButton
};

/***/ },

/***/ 7919
() {

/* (ignored) */

/***/ },

/***/ 8364
(module) {

var editSpacing = {element: "div",className: "touchControlsEditButtonsSpacing"};

////////////////////////////////////////////////////////////////////////////////

var content = [
    ///////////////////////////////////////
    //Title and tips.
    {
        element: "span",
        className: "touchControlsDialogTitle",
        textContent: "Customize Touch Controls",
    },
    {
        element: "span",
        className: "touchControlsDialogTip",
        textContent: "You can't move touch controls without a touch screen, sorry!",
    },
    {
        element: "span",
        className: "touchControlsDialogTip2",
        textContent: "To move a control, just drag and drop it anywhere on the screen. To edit or delete a control, just tap on it.",
    },

    ///////////////////////////////////////
    //Buttons to customize touch controls.
    {
        element: "div",
        className: "touchControlDialogEditButtons",
        children: [
            ////////////////////
            //Close button.
            //Needs to be clickable on non-touch devices so you don't get softlocked on to this screen.
            {
                element: "div",
                className: "touchControlsDialogButton touchControlsDialogRedButton",
                textContent: "Close",
                gid: "touchControlsClose",
            },editSpacing,
            ////////////////////
            //Add button and dropdown.
            {
                element: "div",
                className: "touchControlsAddDropdownContainer",
                children: [
                    {
                        element: "div",
                        className: "touchControlsAddDropdown",
                        gid: "touchControlsAddDropdown",
                        hidden: true,
                    },
                ]
            },
            {
                element: "div",
                className: "touchControlsDialogButton",
                gid: "touchControlsAdd",
                children: [
                    {
                        element: "span",
                        textContent: "Add control"
                    }
                ]
            },editSpacing,
            ////////////////////
            //Reset button.
            {
                element: "div",
                className: "touchControlsDialogButton touchControlsDialogRedButton",
                textContent: "Reset",
                gid: "touchControlsReset"
            },editSpacing,
            ////////////////////
            //Save button.
            {
                element: "div",
                className: "touchControlsDialogButton",
                textContent: "Save",
                gid: "touchControlsSave"
            },editSpacing,
            ////////////////////
        ]
    },

    ///////////////////////////////////////
];

module.exports = [
    {
        element: "div",
        className: "touchControlsContent",
        children: content,
    }
];

/***/ },

/***/ 8515
(module, __unused_webpack_exports, __webpack_require__) {

module.exports = [
    ////////////////////////////////////////////
    //The dialog used to customize touch controls.

    {
        element: "div",
        gid: "touchControlsDialog",
        hidden: true,
        children: [
            {
                element: "div",
                className: "blackDialogBG",
            },
            {
                element: "div",
                className: "touchControlsDialog",
                children: [
                    ...__webpack_require__(8364)
                ]
            }
        ]
    },

    ////////////////////////////////////////////
    // JavaScript would fill this in with the touch controls.

    {
        element: "div",
        gid: "touchControlsContainer",
        className: "touchControlsContainer",
        hidden: true,
    },

    ////////////////////////////////////////////
];

/***/ },

/***/ 8752
(module) {

module.exports = [
  /////////////////////////////////////////////////////////

  {
    element: "h2",
    textContent: "Experience SRB2 Anywhere",
  },

  "SRB2web is an advanced, browser-based launcher for Sonic Robo Blast 2—the premier fan-made 3D Sonic the Hedgehog experience. Built on the Doom Legacy engine, this port allows you to jump into high-speed platforming and full online multiplayer directly in your browser, no installation required.",

  /////////////////////////////////////////////////////////

  {
    element: "h2",
    textContent: "Development & Credits",
  },

  "This project is developed and maintained by ",
  {
    element: "a",
    href: "https://github.com/gvbvdxxalt2",
    target: "_blank",
    textContent: "Gvbvdxx",
  },
  ". The realization of this port was made possible through the power of Emscripten and the collaborative assistance of Google Gemini and other generative AI tools.",

  {
    element: "br",
  },

  "It stands as a testament to modern web technology, bringing classic fangame heritage to the modern web platform.",

  /////////////////////////////////////////////////////////

  {
    element: "h2",
    textContent: "Found a Bug?",
  },

  "As this is an experimental web port, you may encounter technical issues or performance bugs. If the game crashes, please check your browser's developer console (F12) for error logs and report them on our ",
  {
    element: "a",
    href: "https://github.com/gvbvdxxalt2/SRB2web/issues",
    target: "_blank",
    textContent: "GitHub Issues page",
  },
  ". Your feedback helps improve the experience for everyone!",

  /////////////////////////////////////////////////////////

  {
    element: "h2",
    textContent: "Legal & Disclaimers",
  },

  "Sonic Robo Blast 2, including its name, characters, and related themes, are trademarks and copyrights of their respective owners. This project is a non-profit, fan-made initiative and is not affiliated with, endorsed by, or representative of SEGA Corporation or Sonic Team.",

  {
    element: "br",
  },

  "This project is strictly for personal, non-commercial use and must not be sold or redistributed for profit. All rights to the original game assets belong to the SRB2 Community and their respective creators.",

  {
    element: "br",
  },

  "By using this launcher, you acknowledge that the developers are not liable for any issues arising from the use of this software and that you are using this fan-port for personal enjoyment only.",

  /////////////////////////////////////////////////////////
];


/***/ },

/***/ 8769
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

if (!window["Module"]) {
  window["Module"] = {};
}

var elements = __webpack_require__(5100);
elements.appendElementsFromJSON(document.body, __webpack_require__(7255));

var gameCanvas = elements.getGPId("gameCanvas");
var launcherMain = elements.getGPId("launcherMain");
var loaderMain = elements.getGPId("loaderMain");

gameCanvas.hidden = true;
loaderMain.hidden = true;
launcherMain.hidden = false;

var playButton = elements.getGPId("playButton");
var touchConfigureButton = elements.getGPId("configureTouchControlsButton");
var { startTouchCustomization } = __webpack_require__(2229);
var { startGame } = __webpack_require__(7063);

var { getDisplayOptions } = __webpack_require__(1973);

playButton.addEventListener("click", function () {
  startGame(getDisplayOptions());
});
touchConfigureButton.addEventListener("click", function () {
  startTouchCustomization();
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

/***/ 8897
(module, __unused_webpack_exports, __webpack_require__) {

var { KeyNum, KeyName } = __webpack_require__(627);
var { showKeyboard, hideKeyboard, toggleKeyboard, keyboardIsActive } = __webpack_require__(5000);
var keyState = {};

if (window["Module"]) {
  var Module = window["Module"];
}

function sendInput(nameid, down) {
    var number = KeyNum[nameid];

    if (number == KeyNum.UI_SHOW_KEYBOARD) {
        if (down) {
            toggleKeyboard();
        }
        return;
    }
    if (number == KeyNum.UI_JOYSTICK) {
        //Won't do anything because it's not a button.
        return;
    }

    var downNumber = down ? 1 : 0;
    var downBool = !!down;

    if (!Module.ccall) {
        return;
    }
    if (!!keyState[number] == !!downBool) {
        return;
    }
    Module.ccall(
        'SRB2_SetDirectAction',
        'void',
        ['number','number'],
        [number, downNumber]
    );

    if (downBool) {
        keyState[number] = downBool; 
    } else {
        delete keyState[number];
    }
    //window.alert("sent direct action: "+nameid+","+down);
}

function sendJoystick(x,y) {
    if (!Module.ccall) {
        return;
    }
    var range = 0.7;
    sendInput("GC_FORWARD", y > range);
    sendInput("GC_BACKWARD", y < -range);
    sendInput("GC_STRAFELEFT", x < -range);
    sendInput("GC_STRAFERIGHT", x > range);
}

module.exports = {
    sendInput,
    sendJoystick,
    keyboardIsActive
}

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
    var { relayPublicCountSpan } = this;
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
    try {
      var response = await fetch(url + "public");
      if (response.ok) {
        var json = await response.json();
        this.setPublicCount(json.length);
      } else {
        this.setPublicCount("error");
      }
    } catch (e) {
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


/***/ },

/***/ 9766
(module) {

module.exports = [
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
];


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
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
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
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
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