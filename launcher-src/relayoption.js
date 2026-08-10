var elements = require("./gp2/elements.js");
var dialog = require("./dialog.js");
var SRB2WebRelayProtocol = require("./net/version.js");

class RelayOption {
  static FETCHING_IMG = "images/loading.gif";
  static FETCHING_TEXT = "Loading...";

  static ONLINE_IMG = "images/green.png";
  static ONLINE_TEXT = "Online!";

  static OFFLINE_IMG = "images/red.png";
  static OFFLINE_TEXT = "Offline.";

  static OUTDATED_IMG = "images/outdatedrelay.png";
  static OUTDATED_TEXT = "Outdated version.";

  static async relayAddDialog() {
    var nameInput = null;
    var hostInput = null;
    var editDiv = elements.createElementsFromJSON([
      {
        element: "div",
        children: [
          {
            element: "span",
            style: { fontWeight: "bold" },
            textContent: "Placeholder name: ",
          },
          {
            element: "input",
            GPWhenCreated: (elm) => (nameInput = elm),
            placeholder: "Relay server",
          },
          {
            element: "br",
          },
          {
            element: "span",
            style: { fontWeight: "bold" },
            textContent: "Host: ",
          },
          {
            element: "input",
            GPWhenCreated: (elm) => (hostInput = elm),
            placeholder: "example-relay.com",
          },
        ],
      },
    ])[0];

    await dialog.alertWithElement(editDiv); //Wait for close.
    var returned = {
      name: nameInput.value || "Relay server",
      host: (""+hostInput.value).trim(),
    };
    var err = RelayOption.confirmRelayStuff(returned);
    if (err) {
      dialog.alert(err);
      return;
    }
    return returned;
  }

  static confirmRelayStuff({ name, host }) {
    if (typeof name !== "string") {
      return "Name is not string.";
    }
    if (typeof host !== "string") {
      return "Host is not string.";
    }

    var allowedURLChars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890.-:";

    for (var char of host) {
      if (allowedURLChars.indexOf(char) == -1) {
        return `Character "${char}" is not allowed in host.`;
      }
    }

    if (name.length > 150) {
      return `Name is too long!`;
    }
    if (name.length < 1) {
      return `Name is empty`;
    }

    if (host.length > 200) {
      return `Host is too long!`;
    }
    if (host.length < 1) {
      return `Host is empty`;
    }

    return null; //Nothing means its valid.
  }

  constructor(relay, requestSave, requestSetUsed, requestDelete) {
    this.relay = relay;
    this.requestSave = requestSave;
    this.requestSetUsed = requestSetUsed;
    this.requestDelete = requestDelete;
    this.firstFetch = true;
    this.isOutdated = false;
    this.loadOption();
    this.createElements();
    this.updateContents();
    this.fetchStatus();
  }

  async relayEditButtonClicked() {
    var nameInput = null;
    var hostInput = null;
    var editDiv = elements.createElementsFromJSON([
      {
        element: "div",
        children: [
          {
            element: "span",
            style: { fontWeight: "bold" },
            textContent: "Placeholder name: ",
          },
          {
            element: "input",
            GPWhenCreated: (elm) => (nameInput = elm),
            value: this.relay.name,
          },
          {
            element: "br",
          },
          {
            element: "span",
            style: { fontWeight: "bold" },
            textContent: "Host: ",
          },
          {
            element: "input",
            GPWhenCreated: (elm) => (hostInput = elm),
            value: this.relay.host,
          },
        ],
      },
    ])[0];

    await dialog.alertWithElement(editDiv); //Wait for close.

    var err = RelayOption.confirmRelayStuff({
      name: nameInput.value,
      host: hostInput.value,
    });
    if (err) {
      dialog.alert(err);
      return;
    }

    this.relay.name = nameInput.value;
    this.relay.host = (""+hostInput.value).trim();
    this.loadOption();
    this.updateContents();
    this.fetchStatus();
    this.requestSave();
  }

  async relayDeleteButtonClicked() {
    var msg = `Remove relay server "${this.relay.host}"?\nYou might not be able to get it back once its removed.`;
    if (await dialog.confirm(msg)) {
      this.requestDelete();
    }
  }

  setUsed(u) {
    var { relayUseButton } = this;
    if (u) {
      this.div.setAttribute("used", "");
      relayUseButton.textContent = "Using this server";
    } else {
      this.div.removeAttribute("used");
      relayUseButton.textContent = "Use this server";
    }
  }
  dispose() {
    this.relay = null;
    this.div.remove();
  }
  loadOption() {
    this.name = this.relay.name ? this.relay.name : "";
    this.host = this.relay.host;
  }
  createElements() {
    var _this = this;
    this.div = elements.createElementsFromJSON([
      {
        element: "div",
        className: "configuredRelay",
        children: [
          //Name and stuff.
          {
            element: "div",
            style: {
              display: "flex",
              alignItems: "center",
              gap: "10px",
            },
            children: [
              {
                element: "div",
                className: "relayStatus",
                children: [
                  {
                    element: "img",
                    src: RelayOption.FETCHING_IMG,
                    className: "relayStatusImg",
                    GPWhenCreated: (elm) => (_this.statusImg = elm),
                  },
                  {
                    element: "span",
                    className: "relayStatusText",
                    GPWhenCreated: (elm) => (_this.statusText = elm),
                  },
                ],
              },
              {
                element: "span",
                className: "relayName",
                GPWhenCreated: (elm) => (_this.relayNameSpan = elm),
              },
              {
                element: "span",
                className: "relayHost relayHostClickable",
                GPWhenCreated: (elm) => (_this.relayHostSpan = elm),
              },
            ],
          },
          //Description
          {
            element: "span",
            className: "relayDescription",
            GPWhenCreated: (elm) => (_this.relayDescriptionSpan = elm),
          },
          //Public count
          {
            element: "span",
            className: "relayPublicCount",
            GPWhenCreated: (elm) => (_this.relayPublicCountSpan = elm),
          },
          //Buttons
          {
            element: "div",
            className: "relayButtons",
            children: [
              {
                element: "button",
                className: "button",
                textContent: "Use this server",
                GPWhenCreated: (elm) => (_this.relayUseButton = elm),
              },
              {
                element: "button",
                className: "button",
                textContent: "Edit",
                GPWhenCreated: (elm) => (_this.relayEditButton = elm),
              },
              {
                element: "button",
                className: "button",
                textContent: "Remove",
                GPWhenCreated: (elm) => (_this.relayDeleteButton = elm),
              },
            ],
          },
        ],
      },
    ])[0];

    function copyHostText() {
      var elm = this;
      var previous = elm.textContent;
      elm.textContent = "Copied!";
      setTimeout(() => {
        elm.textContent = previous;
        elm.onclick = copyHostText;
      }, 1000);
      try {
        navigator.clipboard.writeText(previous);
      } catch (e) {}
      elm.onclick = function () {};
    }

    this.relayHostSpan.onclick = copyHostText;
    this.relayUseButton.onclick = this.requestSetUsed;
    this.relayEditButton.onclick = this.relayEditButtonClicked.bind(this);
    this.relayDeleteButton.onclick = this.relayDeleteButtonClicked.bind(this);
  }

  updateContents() {
    var { relayNameSpan, relayHostSpan, relay, relayDescriptionSpan } = this;
    relayNameSpan.textContent = relay.name;
    relayHostSpan.textContent = relay.host;
    relayDescriptionSpan.textContent = "";
  }
  save() {
    return {
      host: this.relay.host,
      name: this.relay.name,
    };
  }
  getFetchURL() {
    var url = "";
    if (window.location.protocol.startsWith("https")) {
      url += "https://";
    } else {
      url += "http://";
    }
    url += this.host;
    if (!url.endsWith("/")) {
      url += "/";
    }
    return url;
  }

  setPublicCount(count) {
    var { relayPublicCountSpan } = this;
    if (count == "requesting") {
      relayPublicCountSpan.textContent = "Loading public netgames...";
      return;
    }
    if (count == "error") {
      relayPublicCountSpan.textContent = "Error loading public netgames";
      return;
    }
    if (!count) {
      relayPublicCountSpan.textContent = "No public netgames available";
      return;
    }
    relayPublicCountSpan.textContent = `${count} public netgames available`;
  }

  async fetchPublicCount() {
    var url = this.getFetchURL();
    this.setPublicCount("loading");
    try {
      var response = await fetch(url + "countpublic");
      if (response.ok) {
        var json = await response.json();
        this.setPublicCount(json.count);
      } else if (response.status == 404) {
        var response2 = await fetch(url + "public");
        if (response2.ok) {
          var json2 = await response2.json();
          this.setPublicCount(json2.length);
        } else {
          this.setPublicCount("error");
        }
      } else {
        this.setPublicCount("error");
      }
    } catch (e) {
      this.setPublicCount("error");
    }
  }
  async fetchStatus() {
    var { relayNameSpan, relayDescriptionSpan, statusImg, statusText } = this;
    if (this.firstFetch) {
      statusImg.src = RelayOption.FETCHING_IMG;
      statusText.textContent = RelayOption.FETCHING_TEXT;
      relayDescriptionSpan.textContent = "";
      statusText.setAttribute("state", "fetch");
      this.firstFetch = false;
      this.setPublicCount("loading");
    }
    var online = false;
    var outdated = false;
    var url = this.getFetchURL();
    try{
      var response = await fetch(url + "version");
      if (response.ok) {
        try{
          var json = await response.json();
        }catch(e){
          console.error(e);
          online = false;
        }

        //outdated = true; //for testing

        if (json.protocol !== SRB2WebRelayProtocol.RELAY_PROTOCOL) {
          outdated = true;
        }
      } else if (response.status == 404) {
        outdated = true;
      } else {
        console.error("Non OK status from '"+url+"version': "+response.ok);
        online = false;
      }
    }catch(e){
      console.error(e);
      online = false;
    }

    this.isOutdated = false;
    if (outdated) {
      this.isOutdated = true;
      statusImg.src = RelayOption.OUTDATED_IMG;
      statusText.textContent = RelayOption.OUTDATED_TEXT;
      statusText.setAttribute("state", "error");
      this.setPublicCount("error");
      return;
    }

    try {
      var response = await fetch(url + "status");
      if (response.ok) {
        var json = await response.json();
        if (json.status == "online") {
          relayNameSpan.innerHTML = "";
          elements.setInnerJSON(relayNameSpan, [
            {
              element: "span",
              textContent: json.name,
            },
            {
              element: "br",
            },
            {
              element: "span",
              style: {
                fontSize: "12px",
                marginLeft: "8px",
              },
              textContent: this.relay.name,
            },
          ]);

          relayDescriptionSpan.textContent = `${json.description}`;
          online = true;
          this.fetchPublicCount();
        }
      }
    } catch (e) {
      console.error(e);
      online = false;
    }
    if (!online) {
      statusImg.src = RelayOption.OFFLINE_IMG;
      statusText.textContent = RelayOption.OFFLINE_TEXT;
      statusText.setAttribute("state", "offline");
      this.setPublicCount("error");
      return;
    }
    statusImg.src = RelayOption.ONLINE_IMG;
    statusText.textContent = RelayOption.ONLINE_TEXT;
    statusText.setAttribute("state", "online");
  }
}

function preloadImage(h) {
  var link = document.createElement("link");
  link.rel = "preload";
  link.href = h;
  link.as = "image";
  document.head.append(link);
}

preloadImage(RelayOption.FETCHING_IMG);
preloadImage(RelayOption.OFFLINE_IMG);
preloadImage(RelayOption.ONLINE_IMG);

module.exports = RelayOption;
