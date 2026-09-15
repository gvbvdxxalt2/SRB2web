function retSwitchGameButton(name, icon, link) {
  return {
    element: "a",
    className: "button switchGameButton",
    href: link,
    target: "_blank",
    children: [
      {
        element: "img",
        src: icon,
        style: {
          height: "32px",
        },
      },
      {
        element: "span",
        textContent: `Switch to ${name}`,
      },
    ],
  };
}

module.exports = [
  //Comment the current port out, keep the others uncommented.
  //Allows for quick switching between ports (nobody wants to dig through links).

  //retSwitchGameButton("SRB2 Web", "images/ports/srb2web.png", "https://srb2web.gvbvdxx.me"),
  retSwitchGameButton("SRB2Kart Web", "images/ports/kartweb.png", "https://kartweb.gvbvdxx.me"),
  retSwitchGameButton("SRB2Legacy Web", "images/ports/legacyweb.png", "https://legacyweb.gvbvdxx.me"),
];
