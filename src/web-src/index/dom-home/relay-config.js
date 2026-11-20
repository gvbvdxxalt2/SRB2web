module.exports = [
  /////////////////////////////////////////////////////////

  {
    element: "span",
    className: "sectionHeader",
    textContent: "Relay server configuration:",
  },

  /////////////////////////////////////////////////////////

  //Enable relay server toggle
  {
    element: "div",
    style: {
      display: "flex",
    },
    children: [
      {
        element: "span",
        style: { fontWeight: "bold" },
        textContent: "Enable relay server:",
      },
      {
        element: "input",
        type: "checkbox",
        gid: "relayServerCheckbox",
      },
    ],
  },

  /////////////////////////////////////////////////////////

  {
    element: "button",
    className: "button",
    gid: "addRelayButton",
    textContent: "Add relay server",
  },

  /////////////////////////////////////////////////////////

  {
    element: "button",
    className: "button",
    gid: "browsePublicGames",
    textContent: "Browse public netgames",
  },

  /////////////////////////////////////////////////////////

  //Relay configuration, options are rendered in relayconfig.js

  {
    element: "div",
    gid: "relayConfig",
    className: "relayConfig",
  },

  /////////////////////////////////////////////////////////

  {
    element: "button",
    className: "button",
    gid: "addDefaultServers",
    textContent: "Add default servers",
  },

  /////////////////////////////////////////////////////////

  //Useful details for relay servers
  ...require("./relay-details.js"),
];
