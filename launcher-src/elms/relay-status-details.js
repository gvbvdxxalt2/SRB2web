var RelayOption = require("../relayoption.js");

module.exports = [
  {
    element: "h2",
    textContent: "Status details",
  },

  {
    element: "li",
    children: [
      {
        element: "img",
        className: "relayStatusImg",
        src: RelayOption.FETCHING_IMG,
      },
      {
        element: "span",
        textContent: " - Fetching: Attempting to connect to the server.",
      },
    ],
  },
  {
    element: "li",
    children: [
      {
        element: "img",
        className: "relayStatusImg",
        src: RelayOption.ONLINE_IMG,
      },
      {
        element: "span",
        textContent: " - Online: The server is active and ready to go!",
      },
    ],
  },
  {
    element: "li",
    children: [
      {
        element: "img",
        className: "relayStatusImg",
        src: RelayOption.OFFLINE_IMG,
      },
      {
        element: "span",
        textContent:
          " - Offline: The server is offline, unreachable, or blocked.",
      },
    ],
  },
  {
    element: "li",
    children: [
      {
        element: "img",
        className: "relayStatusImg",
        src: RelayOption.OUTDATED_IMG,
      },
      {
        element: "span",
        textContent:
          " - Outdated: The relay server is running an older version protocol. It may not be compatible with the current launcher.",
      },
    ],
  },
];
