module.exports = [
  {
    element: "div",
    gid: "voiceSettings",
    className: "publicNetgameBrowserContainer",
    hidden: true,

    children: [

      {
        element: "div",
        className: "voiceSettingsDialog",
        children: [

            ...require("./voice-settings-top.js"),
            ...require("./voice-settings-content.js"),

        ],
      },

    ],
  },
];
