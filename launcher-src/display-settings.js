var elements = require("./gp2/elements.js");

//var resizeModeSelect = elements.getGPId("resizeModeSelect");
//var resizeModes = ["safe", "force"];

function getSafeValue(elm,safeValues) {
    var val = ""+elm.value;
    if (safeValues.indexOf(val) == -1) {
        return safeValues[0];
    }
    return val;
}

function getDisplayOptions() {
    return {
        //resolutionChangeMethod: getSafeValue(resizeModeSelect, resizeModes)
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

//addLocalStorageHandler(resizeModeSelect, "srb2web-resize-mode-select");

module.exports = {
    getDisplayOptions
};