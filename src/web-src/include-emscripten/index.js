//WEB_CONSTANTS is defined in webpack.config.js

var Module = {};
window.Module = Module;

function loadEmscripten() {
  return new Promise((resolve, reject) => {
    var script = document.createElement("script");
    script.src = WEB_CONSTANTS.PATH + WEB_CONSTANTS.JS_PATH + "?n=1&v=" + Date.now();
    script.onload = resolve;
    script.onerror = reject;
    document.body.append(script);
  });
}

function getFS() {
  return Module.FS;
}

function getIDBFS() {
  return Module.IDBFS;
}

module.exports = {
    Module,
    getFS,
    getIDBFS,
    loadEmscripten
};
