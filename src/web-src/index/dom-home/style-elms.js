var cssStyles = require("./styles.css");

module.exports = [
  ...require("./pixel3-font.js"),
  {
    element: "style",
    textContent: cssStyles
  },
  {
    element: "style",
    textContent: "[hidden] { display: none !important; }",
  },
];
