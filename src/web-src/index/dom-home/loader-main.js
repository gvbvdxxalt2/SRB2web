module.exports = [
  {
    element: "div",
    className: "loaderMain",
    gid: "loaderMain",
    children: [
      ////////////////////////////////////////

      ...require("./loading-logo.js"),

      ////////////////////////////////////////

      {
        element: "div",
        className: "dontSellText",
        textContent: "THIS GAME SHOULD NOT BE SOLD!",
      },

      ////////////////////////////////////////

      {
        element: "div",
        gid: "loadProgressMain",
        className: "loadProgressMain",
        children: [
          {
            element: "div",
            gid: "loadProgressCurrent",
            className: "loadProgressCurrent"
          },
          {
            element: "span",
            gid: "loadProgressCurrentText",
            className: "loadProgressCurrentText",
          }
        ]
      },

      {
        element: "div",
        gid: "loaderContent",
        textContent: "Loading...",
        style: {
          textAlign: "center",
          fontSize: "20px",
          color: "#ffffff",
        },
      },

      {
        element: "div",
        gid: "loaderCacheWarning",
        hidden: true,
        textContent: "It seems like your cache is having trouble storing the game data. This game may take long to load next time.",
        style: {
          textAlign: "center",
          fontSize: "15px",
          color: "#e3d400",
        },
      },

      ////////////////////////////////////////
    ],
  },
];
