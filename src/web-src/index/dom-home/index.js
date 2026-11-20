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
    element: "div",
    className: "gameCanvasContainer",
    gid: "gameCanvasContainer",
    children: [
      {
        element: "canvas",
        className: "gameCanvas",
        gid: "gameCanvasSoftware",
        tabindex: "0",
      },
      {
        element: "canvas",
        className: "gameCanvas",
        gid: "gameCanvasGL",
        tabindex: "0",
      },
    ]
  },
  ...require("./touch-controls.js"),

  ...require("./netgame-browser.js"),
];
