module.exports = [
  ...require("./style-elms.js"),
  {
    element: "div",
    className: "srb2BG",
  },
  ...require("./launcher-main.js"),
  ...require("./loader-main.js"),
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
  ...require("./touch-controls.js"),
  ...require("./voice-chat.js"),
  ...require("./voice-settings.js"),

  ...require("./netgame-browser.js"),
];
