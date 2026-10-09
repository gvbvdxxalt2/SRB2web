module.exports = [
  {
    element: "button",
    className: "button voiceButton",
    children: [
      {
        element: "img",
        src: "images/microphone.svg",
        style: {
          height: "32px",
        },
      },
      {
        element: "span",
        textContent: "Voice chat settings",
      },
    ],
    gid: "voiceConfigButton",
  },
];
