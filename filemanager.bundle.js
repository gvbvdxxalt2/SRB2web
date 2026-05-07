/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 892
(module) {

function makePathEasyToProcess(path) {
  var a = path.replaceAll("\\", "/");
  if (a[0] == "." && a[1] == "/") {
    var i = 2;
    var parsedPath = "";
    while (i < a.length) {
      parsedPath += a[i];
      i += 1;
    }
  } else {
    var i = 0;
    var parsedPath = "";
    while (i < a.length) {
      parsedPath += a[i];
      i += 1;
    }
  }
  return parsedPath;
}

function parsePathArray(path) {
  var text = makePathEasyToProcess(path);
  var array = text.split("/");
  var fixedArray = []; //Cuts out empty "parts" of the array.
  for (var part of array) {
    if (part.length > 0) {
      fixedArray.push(part);
    }
  }
  return fixedArray;
}

function parsePath(p) {
  return parsePathArray(p).join("/");
}

function joinPaths(...paths) {
  var outArray = [];
  for (var path of paths) {
    var array = parsePathArray(path);

    for (var part of array) {
      outArray.push(part);
      if (part == "..") {
        //Doing this twice because it pushed it to the end.
        outArray.pop();
        outArray.pop();
      }
      if (part == ".") {
        outArray.pop();
      }
    }
  }
  return parsePath(outArray.join("/"));
}

module.exports = {
  makePathEasyToProcess,
  parsePathArray,
  parsePath,
  joinPaths,
};


/***/ },

/***/ 2167
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

if (!window["Module"]) {
  window["Module"] = {};
}

var elements = __webpack_require__(5100);
elements.appendElementsFromJSON(document.body, __webpack_require__(7826));
var { loadFilesystem } = __webpack_require__(3687);
var { joinPaths } = __webpack_require__(892);
var dialog = __webpack_require__(5925);
if (window["Module"]) {
  var Module = window["Module"];
}
var jszip = __webpack_require__(1710);
var loadingScreen = elements.getGPId("loadingScreen");

var FS = null;
var filePathInput = elements.getGPId("filePathInput");
var fileListContainer = elements.getGPId("fileListContainer");
var clickDropdownMenu = elements.getGPId("clickDropdownMenu");
var currentPath = "/addons/userdata";
clickDropdownMenu.hidden = true;
async function syncFs() {
  return new Promise((resolve, reject) => {
    FS.syncfs(false, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
function getPathIsDirectory(fullPath) {
  return FS.isDir(FS.stat(fullPath).mode);
}
function refreshFileList() {
  var files = FS.readdir(currentPath).slice(2);
  elements.setInnerJSON(
    fileListContainer,
    [
      {
        element: "div",
        className: "fileListItem",
        children: [
          {
            element: "img",
            src: "images/back.svg",
            style: {
              width: "16px",
              height: "16px",
            },
          },
          {
            element: "span",
            textContent: "UP...",
          },
        ],
        onclick: function () {
          if (currentPath != "/") {
            currentPath = "/" + joinPaths(currentPath, "..");
            refreshFileList();
          }
        },
      },
    ]
      .concat(
        files
          .sort((fileName) => {
            return getPathIsDirectory(joinPaths(currentPath, fileName))
              ? -1
              : 1;
          })
          .map((fileName) => {
            var fullPath = joinPaths(currentPath, fileName);
            var isDir = getPathIsDirectory(fullPath);
            return {
              element: "div",
              className: "fileListItem",
              children: [
                {
                  element: "img",
                  src: isDir ? "images/folder.svg" : "images/file.svg",
                  style: {
                    width: "16px",
                    height: "16px",
                  },
                },
                {
                  element: "span",
                  textContent: isDir ? fileName + "/" : fileName,
                },
              ],
              oncontextmenu: function (e) {
                e.preventDefault();
                clickDropdownMenu.style.opacity = 0;
                setTimeout(() => {
                  clickDropdownMenu.style.opacity = 1;
                  showFileDropdownMenu(e, fullPath, isDir, fileName);
                }, 1);
                return false;
              },
              onclick: function (e) {
                if (isDir) {
                  var previous = currentPath;
                  try {
                    currentPath = "/" + joinPaths(currentPath, fileName);
                    refreshFileList();
                  } catch (e) {
                    currentPath = previous;
                    refreshFileList();
                  }
                } else {
                  setTimeout(() => {
                    showFileDropdownMenu(e, fullPath, isDir, fileName);
                  }, 1);
                  e.preventDefault();
                  return false;
                }
              },
            };
          }),
      )
      .concat([
        {
          element: "div",
          className: "bottomFileMarker",
        },
      ]),
  );
  filePathInput.value = currentPath;
}
window.addEventListener("click", function () {
  clickDropdownMenu.hidden = true;
});
function showDropdownMenu(e) {
  clickDropdownMenu.style.top = e.clientY + "px";
  clickDropdownMenu.style.left = e.clientX + "px";
  clickDropdownMenu.hidden = false;
  elements.setInnerJSON(clickDropdownMenu, [
    {
      element: "div",
      className: "dropdownItem",
      textContent: "Refresh",
      onclick: function () {
        FS.syncfs(false, (err) => {
          refreshFileList();
        });
      },
    },
    {
      element: "div",
      className: "dropdownItem",
      textContent: "Create folder",
      onclick: function () {
        dialog
          .prompt("Enter a name for the new folder:", "New Folder")
          .then(async (folderName) => {
            if (folderName) {
              loadingScreen.hidden = false;
              loadingScreen.textContent =
                'Creating folder "' + folderName + '"...';
              try {
                var fullPath = joinPaths(currentPath, folderName);
                FS.mkdir(fullPath);
                refreshFileList();
                await syncFs();
              } catch (e) {
                dialog.alert("Failed to create folder: " + e);
              }
              loadingScreen.hidden = true;
            }
          });
      },
    },
    {
      element: "div",
      className: "dropdownItem",
      textContent: "Upload file(s)",
      onclick: function () {
        var fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.multiple = true;
        fileInput.onchange = function () {
          var files = fileInput.files;
          if (!files[0]) {
            return;
          }
          function loadFile(index) {
            var file = files[index];
            var fullPath = joinPaths(currentPath, file.name);
            loadingScreen.hidden = false;
            loadingScreen.textContent =
              'Uploading "' + file.name + '" to this folder...';
            var reader = new FileReader();
            reader.onload = async function () {
              var arrayBuffer = reader.result;
              var uint8Array = new Uint8Array(arrayBuffer);
              FS.writeFile(fullPath, uint8Array);
              refreshFileList();
              await syncFs();
              if (index + 1 < files.length) {
                loadFile(index + 1);
              } else {
                loadingScreen.hidden = true;
              }
            };
            reader.readAsArrayBuffer(file);
          }
          loadFile(0);
        };
        fileInput.click();
      },
    },
  ]);
}

function showFileDropdownMenu(e, fullPath, isDir, fileName) {
  clickDropdownMenu.style.top = e.clientY + "px";
  clickDropdownMenu.style.left = e.clientX + "px";
  clickDropdownMenu.hidden = false;
  elements.setInnerJSON(clickDropdownMenu, [
    {
      element: "div",
      className: "dropdownItem",
      textContent: "Delete",
      onclick: function () {
        dialog
          .confirm('Are you sure you want to delete "' + fileName + '"?')
          .then(async (confirmed) => {
            if (confirmed) {
              loadingScreen.hidden = false;
              loadingScreen.textContent = 'Deleting "' + fileName + '"...';
              try {
                if (isDir) {
                  function removeDirContents(path) {
                    var items = FS.readdir(path).slice(2);
                    for (var i = 0; i < items.length; i++) {
                      var itemPath = joinPaths(path, items[i]);
                      var stat = FS.stat(itemPath);
                      if (FS.isDir(stat.mode)) {
                        removeDirContents(itemPath);
                        FS.rmdir(itemPath);
                      } else {
                        FS.unlink(itemPath);
                      }
                    }
                  }
                  removeDirContents(fullPath);
                  FS.rmdir(fullPath);
                } else {
                  FS.unlink(fullPath);
                }
                refreshFileList();
                await syncFs();
              } catch (e) {
                dialog.alert("Failed to delete file/folder: " + e);
              }
              loadingScreen.hidden = true;
            }
          });
      },
    },
    {
      element: "div",
      className: "dropdownItem",
      textContent: "Replace file",
      hidden: isDir,
      onclick: function () {
        var fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.onchange = function () {
          var file = fileInput.files[0];
          if (!file) {
            return;
          }
          loadingScreen.hidden = false;
          loadingScreen.textContent =
            'Uploading "' + fileName + '" and replacing file...';
          var reader = new FileReader();
          reader.onload = async function () {
            try {
              var arrayBuffer = reader.result;
              var uint8Array = new Uint8Array(arrayBuffer);
              FS.writeFile(fullPath, uint8Array);
              refreshFileList();
              await syncFs();
            } catch (e) {
              dialog.alert("Failed to replace file: " + e);
            }
            loadingScreen.hidden = true;
          };
          reader.readAsArrayBuffer(file);
        };
        fileInput.click();
      },
    },
    {
      element: "div",
      className: "dropdownItem",
      textContent: "Rename",
      hidden: isDir,
      onclick: function () {
        dialog
          .prompt('Enter a new name for "' + fileName + '":', fileName)
          .then(async (newName) => {
            if (newName && newName != fileName) {
              loadingScreen.hidden = false;
              try {
                loadingScreen.textContent =
                  'Renaming "' + fileName + '" to "' + newName + '"...';
                var newFullPath = joinPaths(currentPath, newName);
                FS.rename(fullPath, newFullPath);
                refreshFileList();
                await syncFs();
              } catch (e) {
                dialog.alert("Failed to rename file: " + e);
              }
              loadingScreen.hidden = true;
            }
          });
      },
    },
    {
      element: "div",
      className: "dropdownItem",
      textContent: "Download",
      hidden: isDir,
      onclick: function () {
        loadingScreen.hidden = false;
        loadingScreen.textContent =
          'Preparing download for "' + fileName + '"...';
        try {
          var fileData = FS.readFile(fullPath);
          var blob = new Blob([fileData], { type: "application/octet-stream" });
          var a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = fileName;
          document.body.append(a);
          a.click();
          a.remove();
        } catch (e) {
          dialog.alert("Failed to download file: " + e);
        }
        loadingScreen.hidden = true;
      },
    },
    {
      element: "div",
      className: "dropdownItem",
      textContent: "Download (save to zip)",
      hidden: !isDir,
      onclick: function () {
        try {
          loadingScreen.hidden = false;
          loadingScreen.textContent =
            'Preparing download for "' + fileName + '"...';
          var zip = new jszip();
          function addFolderToZip(zipFolder, path) {
            var items = FS.readdir(path).slice(2);
            for (var i = 0; i < items.length; i++) {
              var itemPath = joinPaths(path, items[i]);
              var stat = FS.stat(itemPath);
              if (FS.isDir(stat.mode)) {
                var newZipFolder = zipFolder.folder(items[i]);
                addFolderToZip(newZipFolder, itemPath);
              } else {
                var fileData = FS.readFile(itemPath);
                zipFolder.file(items[i], fileData);
              }
            }
          }
          addFolderToZip(zip.folder(fileName), fullPath);
          zip.generateAsync({ type: "blob" }).then(function (content) {
            var a = document.createElement("a");
            a.href = URL.createObjectURL(content);
            a.download = fileName + ".zip";
            document.body.append(a);
            a.click();
            a.remove();
            loadingScreen.hidden = true;
          });
        } catch (e) {
          dialog.alert("Failed to download folder: " + e);
          loadingScreen.hidden = true;
        }
      },
    },
  ]);
}

fileListContainer.addEventListener("contextmenu", function (e) {
  e.preventDefault();
  showDropdownMenu(e);
  return false;
});

filePathInput.addEventListener("change", function () {
  var newPath = filePathInput.value;
  try {
    var stat = FS.stat(newPath);
    if (FS.isDir(stat.mode)) {
      currentPath = newPath;
      refreshFileList();
    } else {
      filePathInput.value = currentPath;
    }
  } catch (e) {
    filePathInput.value = currentPath;
  }
});

(async function () {
  try {
    // 1. Wait for everything to be created and synced
    await loadFilesystem();
    loadingScreen.hidden = true;

    // 2. Set the global FS reference from the Module
    FS = Module.FS;

    // 3. Set the starting path for your file manager
    // We use /addons/userdata because that's the symlink we created
    currentPath = "/addons/userdata";

    // 4. Small delay to ensure Emscripten's internal C structures are ready
    setTimeout(() => {
      try {
        refreshFileList();
        console.log("File list loaded successfully at " + currentPath);
        dialog.alert("Welcome to the file manager!\nRight click on empty space to create folders and upload files.\nRight click on files/folders for more options.\nHere is where you can add addons to your SRB2 Web experience, just like you would with a normal SRB2 installation!");
      } catch (e) {
        console.error("Refresh failed:", e);
        // Fallback to root if the symlink is being stubborn
        currentPath = "/";
        refreshFileList();
        dialog.alert("Navigation failed. Resetting to root directory.");
      }
    }, 100);
  } catch (e) {
    console.error("FS Load Error:", e);
    dialog.alert("Failed to load filesystem: " + e + "\nReload to try again.");
    // window.location.reload(); // Optional: only reload if it's a fatal error
  }
})();

const RUNNING_CHECK_NAME = "srb2web_running_check";
var previousRunCheck = localStorage.getItem(RUNNING_CHECK_NAME);

var checkInterval = setInterval(() => {
  var current = localStorage.getItem(RUNNING_CHECK_NAME);
  if (current !== previousRunCheck) {
    previousRunCheck = current;
    clearInterval(checkInterval);
    (async function () {
      await dialog.alert(
        "Another instance of SRB2 Web is running. \n" +
          "Please close other instances and press OK to reload.",
      );
      window.location.reload();
    })();
  }
}, 100);


/***/ },

/***/ 3687
(module) {

var Module = window["Module"] || {};

function loadScript() {
  return new Promise((resolve, reject) => {
    var script = document.createElement("script");
    script.src = "srb2.js";
    script.onload = resolve;
    script.onerror = reject;
    document.body.append(script);
  });
}

var FS = null;

async function loadFilesystem() {
  Module.noInitialRun = true;
  Module.canvas = document.createElement("canvas");

  await loadScript();
  FS = Module.FS;

  // 1. Prepare the mount point
  FS.mkdirTree("/home/web_user");
  FS.mount(FS.filesystems.IDBFS, {}, "/home/web_user");

  // 2. Sync from IndexedDB to MEMFS
  await new Promise((resolve) => {
    FS.syncfs(true, (err) => {
      if (err) console.error("Sync Error:", err);

      // --- SETUP START (Inside callback to ensure persistence awareness) ---

      // Create the internal game folder
      if (!FS.analyzePath("/home/web_user/.srb2").exists) {
        FS.mkdir("/home/web_user/.srb2");
      }

      // Create the default subfolders
      const subFolders = [
        "/home/web_user/.srb2/addons",
        "/home/web_user/.srb2/logs",
      ];
      subFolders.forEach((path) => {
        if (!FS.analyzePath(path).exists) FS.mkdir(path);
      });

      // 3. Setup the /addons/userdata symlink
      // We do NOT mkdir /addons/userdata; we link the name directly to the target.
      if (!FS.analyzePath("/addons").exists) FS.mkdir("/addons");

      try {
        if (!FS.analyzePath("/addons/userdata").exists) {
          FS.symlink("/home/web_user/.srb2", "/addons/userdata");
        }
      } catch (e) {
        console.warn("Symlink issue:", e);
      }

      // --- SETUP END ---
      resolve();
    });
  });

  console.log("Filesystem ready. Default path: /addons/userdata");
}

module.exports = { loadFilesystem };


/***/ },

/***/ 5100
(module) {

//Webpack compatible version of elements module from gvbvdxx-pack-2
//With some new updates as well.
var __GP_elements = {};
function isDOM(Obj) {
  return Obj instanceof Element;
}
var elements = {
  appendElements: function (elm, appendArray) {
    for (var appendElm of appendArray) {
      elm.append(appendElm);
    }
  },
  getStylelessAJSON(props = {}) {
    return {
      element: "a",
      style: {
        all: "unset",
      },
      ...props,
    };
  },
  removeAllChildren: function (elm) {
    Array.from(elm.children).forEach((elm) => elm.remove());
  },
  appendElementsFromJSON: function (elm, appendJSONArray) {
    var elms = elements.createElementsFromJSON(appendJSONArray);
    elements.appendElements(elm, elms);
    return elms;
  },
  setInnerJSON: function (elm, appendJSONArray) {
    elements.removeAllChildren(elm);
    var elms = elements.createElementsFromJSON(appendJSONArray);
    elements.appendElements(elm, elms);
    return elms;
  },
  createElementsFromJSON: function (jsonelmArray) {
    //converts an array of json's with element properties to a element list.
    function runElements(arry) {
      var myRealElms = [];
      for (var elm of arry) {
        if (!isDOM(elm)) {
          if (typeof elm == "object") {
            var realElm = document.createElement(elm.element);
            for (var attriName of Object.keys(elm)) {
              if (!(attriName == "element" || attriName == "children")) {
                var attributeValue = elm[attriName];
                var setattri = true;
                if (attriName == "gid") {
                  __GP_elements[attributeValue] = realElm;
                  setattri = false;
                }
                if (attriName == "style") {
                  for (var styleName of Object.keys(attributeValue)) {
                    var styleValue = attributeValue[styleName];
                    realElm.style[styleName] = styleValue;
                  }
                  setattri = false;
                }
                if (attriName == "styleProperties") {
                  for (var styleName of Object.keys(attributeValue)) {
                    var styleValue = attributeValue[styleName];
                    realElm.style.setProperty(styleName, styleValue);
                  }
                  setattri = false;
                }
                if (attriName == "dangerouslySetInnerHTML") {
                  realElm.innerHTML = attributeValue;
                  setattri = false;
                } else if (attriName == "innerHTML") {
                  console.trace(
                    'Warning: The "innerHTML" property is deprecated. ' +
                      'Please use "dangerouslySetInnerHTML" instead.',
                  );
                  realElm.innerHTML = attributeValue;
                  setattri = false;
                }
                if (attriName == "textContent") {
                  realElm.textContent = attributeValue;
                  setattri = false;
                }
                if (attriName == "src") {
                  realElm.src = attributeValue;
                  setattri = false;
                }
                if (attriName == "srcObject") {
                  realElm.srcObject = attributeValue;
                  setattri = false;
                }
                if (attriName == "value") {
                  realElm.value = attributeValue;
                  setattri = false;
                }
                if (attriName == "min") {
                  realElm.min = attributeValue;
                  setattri = false;
                }
                if (attriName == "max") {
                  realElm.max = attributeValue;
                  setattri = false;
                }
                if (attriName == "width") {
                  realElm.width = attributeValue;
                  setattri = false;
                }
                if (attriName == "height") {
                  realElm.height = attributeValue;
                  setattri = false;
                }
                if (attriName == "className") {
                  realElm.className = attributeValue;
                  setattri = false;
                }
                if (attriName == "hidden") {
                  if (attributeValue) {
                    realElm.hidden = true;
                  }
                  setattri = false;
                }
                if (attriName == "selected") {
                  if (attributeValue) {
                    realElm.selected = true;
                  }
                  setattri = false;
                }
                if (attriName == "eventListeners") {
                  if (Array.isArray(attributeValue)) {
                    for (var event of attributeValue) {
                      realElm.addEventListener(event.event, event.func);
                    }
                  }
                  setattri = false;
                }
                if (attriName == "GPWhenCreated") {
                  attributeValue.bind(realElm)(realElm); //This seems weird, but first realElm is the "this" value refrence, then the second realElm is for the function value, as well as calling the new binded function.
                  setattri = false;
                }
                if (setattri) {
                  if (typeof realElm[attriName] !== "undefined") {
                    realElm[attriName] = attributeValue;
                    setattri = false;
                  }
                }
                if (setattri) {
                  realElm.setAttribute(attriName, attributeValue);
                }
              }
            }

            if (elm.children) {
              var elmsToAppend = runElements(elm.children);
              for (var elmAppend of elmsToAppend) {
                realElm.append(elmAppend);
              }
            }
            myRealElms.push(realElm);
          } else {
            myRealElms.push(elm);
          }
        } else {
          if (elm) {
            myRealElms.push(elm);
          }
        }
      }
      return myRealElms;
    }
    return runElements(jsonelmArray);
  },
  getById: function (id) {
    return document.getElementById(id);
  },
  setGPId: function (el, id) {
    __GP_elements[id] = el;
    return el;
  },
  disposeGPId: function (id) {
    __GP_elements[id] = undefined;
  },
  getGPId: function (id) {
    if (__GP_elements[id]) {
      return __GP_elements[id];
    }
    return null;
  },
  body: document.body,
  __GP_elements: __GP_elements,
};
module.exports = elements;


/***/ },

/***/ 5925
(module) {

var dialog = {
  styles: {
    //Container (Holds both background and dialog box)
    containerClassName: "windowDialogContainer",
    //Background
    backgroundClassName: "windowDialogBackground",
    //Dialog
    dialogClassName: "windowDialogBox",
    //Button
    buttonClassName: "windowDialogButton",
    //Header
    headerClassName: "windowDialogHeader",
    //Input (Where you type text)
    inputClassName: "windowDialogInput",
  },
  texts: {
    ok: "OK",
    cancel: "Cancel",
  },
  _createDialogBase() {
    var background = document.createElement("div");
    background.style.position = "fixed";
    background.style.top = "0";
    background.style.left = "0";
    background.style.width = "100vw";
    background.style.height = "100vh";
    background.style.opacity = "0.5";
    background.className = this.styles.backgroundClassName;

    var dialogBox = document.createElement("div");
    dialogBox.style.position = "fixed";
    dialogBox.style.top = "50%";
    dialogBox.style.left = "50%";
    dialogBox.style.transform = "translate(-50%, -50%)";
    dialogBox.style.width = "fit-content";
    dialogBox.style.height = "fit-content";
    dialogBox.style.padding = "20px";
    dialogBox.style.maxWidth = "500px";
    dialogBox.style.maxHeight = "300px";
    dialogBox.style.minWidth = "100px";
    dialogBox.style.minHeight = "100px";
    dialogBox.style.overflow = "auto";
    dialogBox.className = this.styles.dialogClassName;

    var dialogContainer = document.createElement("div");
    dialogContainer.style.zIndex = "100";
    dialogContainer.className = this.styles.containerClassName;
    dialogContainer.append(background);
    dialogContainer.append(dialogBox);

    return { background, dialogBox, dialogContainer };
  },
  _createButtonBase() {
    var button = document.createElement("div");
    button.className = this.styles.buttonClassName;
    button.style.width = "fit-content";
    button.style.height = "fit-content";
    button.style.minWidth = "30px";
    button.style.minHeight = "20px";
    button.style.padding = "4px";
    button.style.cursor = "pointer";
    button.style.display = "inline-block";
    button.style.margin = "2px 2px";
    button.style.fontWeight = "bold";

    return button;
  },
  _createHeaderBase() {
    var span = document.createElement("span");
    span.className = this.styles.headerClassName;

    return span;
  },
  _createColorInputBase() {
    var input = document.createElement("input");
    input.type = "color";

    return input;
  },
  _createBreakBase() {
    var br = document.createElement("br");
    return br;
  },
  _createTextInputBase() {
    var input = document.createElement("input");
    input.type = "text";
    input.className = this.styles.inputClassName;

    return input;
  },
  _appendHeaders(message, dialogBox) {
    var m = message.toString();
    for (var m of m.split("\n")) {
      var header = this._createHeaderBase();
      header.textContent = m;
      dialogBox.append(header);
      dialogBox.append(this._createBreakBase());
    }
  },
  displayButtonChooser: function (message, buttonTexts) {
    var { dialogBox, background, dialogContainer } = this._createDialogBase();

    dialogBox.focus();

    this._appendHeaders(message, dialogBox);

    document.body.append(dialogContainer);

    return new Promise((accept) => {
      buttonTexts.forEach((buttonText, index) => {
        var button = this._createButtonBase();
        button.textContent = buttonText;
        button.onclick = function () {
          dialogContainer.remove();
          accept(index);
        };
        dialogBox.append(button);
      });
    });
  },
  alertWithElement: function (element) {
    var { dialogBox, background, dialogContainer } = this._createDialogBase();

    dialogBox.focus();

    document.body.append(dialogContainer);

    dialogBox.append(element);

    var acceptButton = this._createButtonBase();
    acceptButton.textContent = this.texts.ok;
    dialogBox.append(acceptButton);

    return new Promise((accept) => {
      acceptButton.onclick = function () {
        accept();
        dialogContainer.remove();
      };
    });
  },
  alert: function (message) {
    var { dialogBox, background, dialogContainer } = this._createDialogBase();

    dialogBox.focus();

    document.body.append(dialogContainer);

    this._appendHeaders(message, dialogBox);

    var acceptButton = this._createButtonBase();
    acceptButton.textContent = this.texts.ok;
    dialogBox.append(acceptButton);

    return new Promise((accept) => {
      acceptButton.onclick = function () {
        accept();
        dialogContainer.remove();
      };
    });
  },
  prompt: function (message) {
    var { dialogBox, background, dialogContainer } = this._createDialogBase();

    dialogBox.focus();

    document.body.append(dialogContainer);

    this._appendHeaders(message, dialogBox);

    var input = this._createTextInputBase();
    dialogBox.append(input);

    dialogBox.append(this._createBreakBase());

    var acceptButton = this._createButtonBase();
    acceptButton.textContent = this.texts.ok;
    dialogBox.append(acceptButton);

    var cancelButton = this._createButtonBase();
    cancelButton.textContent = this.texts.cancel;
    dialogBox.append(cancelButton);

    return new Promise((accept) => {
      input.onkeydown = function (e) {
        if (e.key == "Enter") {
          e.preventDefault();
          acceptButton.click();
        }
      };
      acceptButton.onclick = function () {
        if (input.value.length < 1) {
          accept(undefined);
        } else {
          accept(input.value);
        }
        dialogContainer.remove();
      };
      cancelButton.onclick = function () {
        accept();
        dialogContainer.remove();
      };
    });
  },
  confirm: function (message) {
    var { dialogBox, background, dialogContainer } = this._createDialogBase();

    dialogBox.focus();

    document.body.append(dialogContainer);

    this._appendHeaders(message, dialogBox);

    var acceptButton = this._createButtonBase();
    acceptButton.textContent = this.texts.ok;
    dialogBox.append(acceptButton);

    var cancelButton = this._createButtonBase();
    cancelButton.textContent = this.texts.cancel;
    dialogBox.append(cancelButton);

    return new Promise((accept) => {
      acceptButton.onclick = function () {
        accept(true);
        dialogContainer.remove();
      };
      cancelButton.onclick = function () {
        accept(false);
        dialogContainer.remove();
      };
    });
  },
  colorPrompt: function (message) {
    var { dialogBox, background, dialogContainer } = this._createDialogBase();

    dialogBox.focus();

    document.body.append(dialogContainer);

    this._appendHeaders(message, dialogBox);

    var colorInput = this._createColorInputBase();
    dialogBox.append(colorInput);

    dialogBox.append(this._createBreakBase());

    var acceptButton = this._createButtonBase();
    acceptButton.textContent = this.texts.ok;
    dialogBox.append(acceptButton);

    var cancelButton = this._createButtonBase();
    cancelButton.textContent = this.texts.cancel;
    dialogBox.append(cancelButton);

    return new Promise((accept) => {
      acceptButton.onclick = function () {
        accept(colorInput.value);
        dialogContainer.remove();
      };
      cancelButton.onclick = function () {
        accept();
        dialogContainer.remove();
      };
    });
  },
  passwordPrompt: function (message) {
    var { dialogBox, background, dialogContainer } = this._createDialogBase();

    dialogBox.focus();

    document.body.append(dialogContainer);

    this._appendHeaders(message, dialogBox);

    var input = this._createTextInputBase();
    input.type = "password";
    dialogBox.append(input);

    dialogBox.append(this._createBreakBase());

    var acceptButton = this._createButtonBase();
    acceptButton.textContent = this.texts.ok;
    dialogBox.append(acceptButton);

    var cancelButton = this._createButtonBase();
    cancelButton.textContent = this.texts.cancel;
    dialogBox.append(cancelButton);

    return new Promise((accept) => {
      input.onkeydown = function (e) {
        if (e.key == "Enter") {
          e.preventDefault();
          acceptButton.click();
        }
      };
      acceptButton.onclick = function () {
        if (input.value.length < 1) {
          accept(undefined);
        } else {
          accept(input.value);
        }
        dialogContainer.remove();
      };
      cancelButton.onclick = function () {
        accept();
        dialogContainer.remove();
      };
    });
  },
};

module.exports = dialog;


/***/ },

/***/ 7826
(module, __unused_webpack_exports, __webpack_require__) {

module.exports = [
  {
    element: "style",
    textContent: __webpack_require__(8922),
  },
  {
    element: "style",
    textContent: "[hidden] { display: none; }",
  },
  {
    element: "div",
    className: "loadingScreen",
    gid: "loadingScreen",
    textContent: "File system is loading...",
  },
  {
    element: "div",
    className: "fileManagerMenuBar",
    children: [
      {
        element: "input",
        type: "text",
        gid: "filePathInput",
        className: "fileManagerPathBar",
      },
    ],
  },
  {
    element: "div",
    className: "fileList",
    gid: "fileListContainer",
  },
  {
    element: "div",
    className: "clickDropdownMenu",
    gid: "clickDropdownMenu",
  },
];


/***/ },

/***/ 8922
(module) {

module.exports = "body {\n    background: #696969;\n    font-weight: bold;\n    font-family: Arial, sans-serif;\n    margin: 0;\n    padding: 0;\n    /* Use dynamic viewport height for iOS Safari compatibility */\n    height: 100dvh;\n    width: 100dvw;\n    overflow-x: auto;\n    overflow-y: auto;\n}\n\n.fileManagerMenuBar {\n    position: fixed;\n    top: 0px;\n    left: 0px;\n    width: 100%;\n    height: 40px;\n    background: #333333;\n    color: #ffffff;\n    display: flex;\n    align-items: center;\n    padding: 0 10px;\n    box-sizing: border-box;\n    z-index: 1000;\n}\n\n.fileManagerPathBar {\n    all: unset;\n    color: #ffffff;\n    width: calc(100% - 100px);\n    height: 100%;\n}\n\n.loadingScreen {\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    background: rgba(0, 0, 0, 0.8);\n    color: #ffffff;\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: center;\n    z-index: 2000;\n    text-align: center;\n    font-size: 20px;\n    font-weight: bold;\n}\n\n.fileList {\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: calc(100% - 100px);\n    height: 100%;\n    background: #444444;\n    display: flex;\n    flex-direction: column;\n    padding-top: 40px;\n    overflow: auto;\n    gap: 2px;\n}\n.fileListItem {\n    padding: 10px;\n    border-bottom: 1px solid #555555;\n    cursor: pointer;\n    color: #ffffff;\n    display: flex;\n    align-items: center;\n    gap: 8px;\n}\n\n.fileListItem:hover {\n    text-decoration: underline;\n    background-color: #555555;\n}\n\n.clickDropdownMenu {\n    position: fixed;\n    top: 0;\n    left: 0;\n    display: flex;\n    align-items: center;\n    flex-direction: column;\n    background: #333333;\n    border-radius: 3px;\n    box-sizing: border-box;\n}\n\n.dropdownItem {\n    padding: 10px;\n    border-bottom: 1px solid #555555;\n    cursor: pointer;\n    color: #ffffff;\n    display: flex;\n    align-items: center;\n    gap: 8px;\n    border-radius: 3px;\n    box-sizing: border-box;\n}\n\n.dropdownItem:hover {\n    text-decoration: underline;\n    background-color: #555555;\n}\n\n:root {\n  --popup-dialog-font: Arial, sans-serif;\n  --popup-dialog-background: #fff;\n  --popup-dialog-border-radius: 10px;\n  --popup-dialog-text-color: #000;\n  --popup-dialog-button-background: #5985ff;\n  --popup-dialog-button-hover-background: #4275ff;\n  --popup-dialog-button-text-color: #fff;\n  --popup-dialog-button-radius: 5px;\n  --popup-dialog-input-background: #fff;\n  --popup-dialog-input-border-width: 1.5px;\n  --popup-dialog-input-border-color: #bababa;\n  --popup-dialog-input-text-color: #000;\n  --popup-dialog-message-size: 16px;\n}\n\n.windowDialogContainer {\n  font-family: var(--popup-dialog-font);\n}\n\n.windowDialogBackground {\n  background-color: black;\n  backdrop-filter: blur(2px);\n}\n\n.windowDialogBox {\n  background: var(--popup-dialog-background);\n  border-radius: var(--popup-dialog-border-radius);\n  color: var(--popup-dialog-text-color);\n}\n\n.windowDialogButton {\n  background: var(--popup-dialog-button-background);\n  color: var(--popup-dialog-button-text-color);\n  border-radius: var(--popup-dialog-button-radius);\n  padding: 4px 8px;\n  border: none;\n  cursor: pointer;\n}\n\n.windowDialogButton:hover {\n  background: var(--popup-dialog-button-hover-background);\n}\n\n.windowDialogInput {\n  background: var(--popup-dialog-input-background);\n  border: var(--popup-dialog-input-border-width) solid\n    var(--popup-dialog-input-border-color);\n  color: var(--popup-dialog-input-text-color);\n  outline: none;\n  border-radius: 4px;\n  padding: 4px;\n}\n\n.windowDialogHeader {\n  font-weight: bold;\n  font-size: var(--popup-dialog-message-size);\n}\n\n.bottomFileMarker {\n    height: calc(100% - 40px);\n    width: 100%;\n    flex-shrink: 0;\n}\n";

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			734: 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunksrb2_web"] = self["webpackChunksrb2_web"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, [804], () => (__webpack_require__(2167)))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;