function getWebsocketURL(wsHost) {
  var url = "";
  if (window.location.protocol.startsWith("https")) {
    url += "wss://";
  } else {
    url += "ws://";
  }
  url += wsHost;
  if (!url.endsWith("/")) {
    url += "/";
  }
  return url;
}

var PLACEHOLDER_IP = "0.0.0.0";

module.exports = { getWebsocketURL, PLACEHOLDER_IP };
