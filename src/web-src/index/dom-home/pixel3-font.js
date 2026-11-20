var FONT_DATA_URL = require("./pixel3.ttf");
FONT_DATA_URL = FONT_DATA_URL.default ? FONT_DATA_URL.default : FONT_DATA_URL;

module.exports = [
    {
        element: "style",
        textContent: `@font-face { src: url(${FONT_DATA_URL}); font-family: PixelFont; font-size: 20px; }`
    }
];