var configstuff = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:vpn.mikedev101.cc:3478" },
    {
      urls: "turn:vpn.mikedev101.cc:3478",
      username: "free",
      credential: "free",
    },
    { urls: "stun:freeturn.net:3478" },
    { urls: "stun:freeturn.net:5349" },
    { urls: "turn:freeturn.net:3478", username: "free", credential: "free" },
    { urls: "turn:freeturn.net:5349", username: "free", credential: "free" },
    {
      urls: "turn:numb.viagenie.ca",
      credential: "muazkh",
      username: "webrtc@live.com",
    },
    {
      urls: "turn:turn.bistri.com:80",
      credential: "homeo",
      username: "homeo",
    },
    {
      urls: "turn:turn.anyfirewall.com:443?transport=tcp",
      credential: "webrtc",
      username: "webrtc",
    },
  ],
  iceTransportPolicy: "all",
};


module.exports = window.SRB2WEB_RTC_CONFIG || configstuff;
