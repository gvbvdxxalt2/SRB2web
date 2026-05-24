if (window["Module"]) {
  var Module = window["Module"];
}

var input = document.createElement("input");
input.type = "text";
input.className = "touchControlsInput";
input.value = " "; //Intentionally have a space to detect deletion.
document.body.appendChild(input);

input.addEventListener("input", function (e) {
    input.value = " ";
    var data = e.data;
    var type = e.inputType;

    if (!Module.ccall) {
        return;
    }
    if (!keyboardActive) {
        return;
    }
    e.preventDefault();
    e.stopPropagation();

    var isInsert = (
        type === "insertText" || 
        type === "insertFromPaste" || 
        type === "insertReplacementText" ||
        type === "insertCompositionText"
    );

    try {
        if (isInsert && typeof data === "string" && data.length > 0) {
            Module.ccall(
                'inject_text',
                'void',
                ['string'],
                [data]
            );
        }

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
    } catch (err) {
        console.error("touch keyboard input failed", err);
    }
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
