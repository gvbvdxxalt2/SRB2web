var elements = require("../gp2/elements.js");
var dedicatedServerLogs = elements.getGPId("dedicatedServerLogs");
var dedicatedServerLogInput = elements.getGPId("dedicatedServerLogInput");

const MAX_LOG_LINES = 1000;

function scrollToBottom() {
  if (
    dedicatedServerLogs.scrollTop + dedicatedServerLogs.offsetHeight + 2 >=
    dedicatedServerLogs.scrollHeight
  ) {
    dedicatedServerLogs.scrollTo(0, dedicatedServerLogs.scrollHeight);
  }
}

function addLine(txt) {
  var curSpan = document.createElement("span");
  var text = "";
  for (var i = 0; i < txt.length; i++) {
    if (txt[i] == "\n") {
      curSpan.textContent = text;
      dedicatedServerLogs.appendChild(curSpan);
      dedicatedServerLogs.appendChild(document.createElement("br"));
      scrollToBottom();
      text = "";
      curSpan = document.createElement("span");
    } else {
      text += txt[i];
    }
  }
  curSpan.textContent = text;
  dedicatedServerLogs.appendChild(curSpan);
}

class DedicatedServerLogs {
  static show() {
    dedicatedServerLogs.hidden = false;
  }
  static hide() {
    dedicatedServerLogs.hidden = true;
  }

  static print(...msgs) {
    addLine(msgs.join(""));
  }
  static printErrr(...msgs) {
    addLine(msgs.join(""));
  }
}

module.exports = DedicatedServerLogs;
