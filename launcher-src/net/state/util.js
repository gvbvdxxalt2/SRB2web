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

function getHttpURL(wsHost) {
  var url = "";
  if (window.location.protocol.startsWith("https")) {
    url += "https://";
  } else {
    url += "http://";
  }
  url += wsHost;
  if (!url.endsWith("/")) {
    url += "/";
  }
  return url;
}

var PLACEHOLDER_IP = "0.0.0.0";

module.exports = { getWebsocketURL, getHttpURL, PLACEHOLDER_IP };
