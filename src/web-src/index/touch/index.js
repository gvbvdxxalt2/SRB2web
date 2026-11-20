var { KeyNum, KeyName } = require("./keydef.js");
var { TouchControlButton } = require("./button.js");
var { startInputProcessor, stopInputProcessor } = require("./processor.js");
var { showKeyboard, hideKeyboard, toggleKeyboard, keyboardIsActive, activateKeyboardChecks, deactivateKeyboardChecks } = require("./keyboard.js");

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