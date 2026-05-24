if (window["Module"]) {
  var Module = window["Module"];
}

var input = document.createElement("input");
input.type = "text";
input.className = "touchControlsInput";
input.value = " "; //Intentionally have a space to detect backspace.

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
    input.value = " "; 
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
