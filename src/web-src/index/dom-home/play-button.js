module.exports = [
  {
    element: "button",
    className: "button playButton",
    children: [
      {
        element: "img",
        src: "images/play.svg",
        style: {
          height: "32px",
        },
      },
      {
        element: "span",
        textContent: "Play",
      },
    ],
    gid: "playButton",
  },
];
