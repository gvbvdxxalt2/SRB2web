module.exports = [
  {
    element: "div",
    className: "launcherMain",
    gid: "launcherMain",
    children: [
      ////////////////////////////////////////////

      ...require("./normal-logo-elm.js"),

      ////////////////////////////////////////////

      ...require("./play-button.js"),
      ...require("./browse-netgames-button.js"),
      ...require("./file-manager-button.js"),
      ...require("./switch-game-button.js"),

      ////////////////////////////////////////////

      { element: "div", className: "sep" },

      ...require("./display-options.js"),

      ////////////////////////////////////////////

      { element: "div", className: "sep" },

      {
        element: "div",
        children: require("./relay-config.js"),
      },

      ////////////////////////////////////////////

      { element: "div", className: "sep" },

      {
        element: "div",
        children: require("./launcher-details.js"),
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
