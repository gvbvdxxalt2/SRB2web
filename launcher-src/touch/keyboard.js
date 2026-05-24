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


var lastReadIndex = 1; 

input.addEventListener("input", function (e) {
    if (!Module.ccall || !keyboardActive) {
        return;
    }

    e.preventDefault();
    e.stopPropagation();

    var currentValue = input.value;
    var type = e.inputType;

    var isDelete = (
        type === "deleteContentBackward" || 
        currentValue.length === 0 || 
        currentValue.charAt(0) !== "\u200b" || 
        currentValue.length < lastReadIndex
    );

    if (isDelete) {
        try {
            // Your custom C++ backspace injection logic (keydown then keyup)
            Module.ccall('inject_keycode', null, ['int', 'int'], [8, false]);
            Module.ccall('inject_keycode', null, ['int', 'int'], [8, true]);
        } catch (err) {
            console.error("Failed to inject backspace:", err);
        }
        
        // Fully restore the anchor and reset tracking indices safely
        input.value = "\u200b";
        lastReadIndex = 1;
        return; // Exit early since we handled the deletion
    }

    // 2. Expand matching to include composition events used by Samsung/Gboard
    var isInsert = (
        type === "insertText" || 
        type === "insertFromPaste" || 
        type === "insertReplacementText" ||
        type === "insertCompositionText" ||
        currentValue.length > lastReadIndex // Fallback if inputType is missing but text grew
    );

    if (isInsert) {
        // Extract only the fresh characters typed since our last execution loop
        var textToInject = currentValue.substring(lastReadIndex);

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

        // Lock in our new reading position
        lastReadIndex = currentValue.length;
    }

    if (currentValue.length > 30) {
        var keepLength = 10; 
        var preservedText = currentValue.substring(currentValue.length - keepLength);
        
        input.value = "\u200b" + preservedText;
        lastReadIndex = input.value.length;
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
