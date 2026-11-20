module.exports = [
  {
    element: "div",
    gid: "publicNetgameBrowserContainer",
    className: "publicNetgameBrowserContainer",
    hidden: true,

    children: [
      {
        element: "div",
        gid: "netgameLoadingListsContainer",
        className: "netgameLoadingListsContainer",
        children: [
          {
            element: "img",
            src: "images/loading.gif",
            className: "netgameLoadingListsImg",
          },
          "Loading...",
        ],
      },

      {
        element: "div",
        gid: "publicNetgameBrowser",
        className: "publicNetgameBrowserDialog",
        hidden: true,
        children: [
          {
            element: "div",
            gid: "publicNetgameBrowserLeft",
            className: "publicNetgameBrowserLeft",
          },
          {
            element: "div",
            gid: "publicNetgameBrowserRight",
            className: "publicNetgameBrowserRight",
          },
        ],
      },
    ],
  },
];
