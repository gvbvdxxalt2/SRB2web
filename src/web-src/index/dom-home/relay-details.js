module.exports = [
  {
    element: "div",
    style: {
      lineHeight: "1.6", // Increased slightly for better readability
    },
    children: [
      /////////////////////////////////////////////////////////

      {
        element: "h2",
        textContent: "What is a Relay Server?",
      },
      "Relay servers act as a bridge between players, simulating port-forwarding so you can host and join games without modifying your router settings. This bypasses the need for complex network configurations.",
      {
        element: "br",
      },
      "Performance is determined by the connection protocol (WebRTC or WebSocket), the host's game stability, and your overall internet speed.",

      /////////////////////////////////////////////////////////

      {
        element: "h2",
        textContent: "Connection Troubleshooting",
      },
      'To begin, click "Use this server" next to an active relay. If you experience issues connecting, use the "Add default servers" button to refresh the available list.',
      {
        element: "br",
      },
      'Note: Our default relays are hosted on free-tier services. They may take 15–30 seconds to "spin up" if they haven\'t been used recently.',
      {
        element: "br",
      },
      "Pro Tip: Enabling WebRTC in the settings offers significantly lower latency. This is a host-side setting; clients will automatically switch to WebRTC if the host supports it.",

      /////////////////////////////////////////////////////////

      {
        element: "h2",
        textContent: "Project Source Code",
      },

      {
        element: "a",
        href: "https://github.com/gvbvdxxalt2/SRB2Web-Relay/",
        target: "_blank",
        textContent: "SRB2web Relay Server Source",
      },
      {
        element: "br",
      },
      {
        element: "a",
        href: "https://github.com/gvbvdxxalt2/SRB2web/",
        target: "_blank",
        textContent: "SRB2web Main Repository",
      },
      {
        element: "br",
      },

      /////////////////////////////////////////////////////////

      ...require("./relay-status-details.js"),
    ],
  },
];
