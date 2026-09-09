var elements = require("./gp2/elements.js");
if (window["Module"]) {
  var Module = window["Module"];
}
var dialog = require("./dialog.js");
var IDBFS = null;
var gameCanvas = elements.getGPId("gameCanvas");
var didStart = false;
var loaderContent = elements.getGPId("loaderContent");
var serverOpts = null;
var launcherMain = elements.getGPId("launcherMain");
var loaderMain = elements.getGPId("loaderMain");
var resolutionChangeMethod = "safe";

var loadProgressMain = elements.getGPId("loadProgressMain");
var loadProgressCurrent = elements.getGPId("loadProgressCurrent");
var loadProgressCurrentText = elements.getGPId("loadProgressCurrentText");
loadProgressMain.hidden = true;

const {ASSET_LIST, CACHE_NAME} = require("./assets.js");

var gameResolutionWidth = 0;
var gameResolutionHeight = 0;

var connectAddr = null;

var Touch = require("./touch");
var touchState = Touch.state;
var {startupTouchControls} = Touch;

function isErrno44(err) {
  return !!err && Number(err.errno) === 44;
}

function safeSymlink(targetPath, linkPath) {
  try {
    if (!FS.analyzePath(linkPath).exists) {
      FS.symlink(targetPath, linkPath);
    }
  } catch (err) {
    if (!FS.analyzePath(linkPath).exists) {
      console.warn("Symlink setup failed:", linkPath, err);
    }
  }
}

function ensureUserDataTree() {
  FS.mkdirTree("/home/web_user/.srb2/addons");
  FS.mkdirTree("/home/web_user/.srb2/logs");
  FS.mkdirTree("/addons");
  safeSymlink("/home/web_user/.srb2", "/addons/.srb2");
  safeSymlink("/home/web_user/.srb2", "/addons/userdata");
}

async function keepAlive() {
  if (navigator.requestWakeLock) {
    await navigator.requestWakeLock("screen");
  }

  if (navigator.locks) {
    navigator.locks.request(
      "srb2_game_running",
      { mode: "exclusive" },
      async () => {
        return await new Promise((resolve) => {});
      },
    );
  }
}

function enableStartServer(dedicated = false) {
  serverOpts = {
    dedicated: !!dedicated,
  };
}

function disableStartServer() {
  serverOpts = null;
}

function loadScript() {
  return new Promise((resolve, reject) => {
    loaderContent.textContent = "Loading game script...";
    var script = document.createElement("script");
    script.src = "srb2.js?n=1&v=" + Date.now();
    script.onload = resolve;
    script.onerror = reject;
    document.body.append(script);
  });
}

async function downloadAndSaveAssets() {
  var cache = await caches.open(CACHE_NAME);
  var assetCount = 0;
  var assetLength = ASSET_LIST.length;

  for (var asset of ASSET_LIST) {

    //Why not show the user how many resources are needed and currently finished?
    loaderContent.textContent = `[${assetCount+1}/${assetLength} resources]`;

    var response = await cache.match(asset.url);
    var didCache = false;

    if (response) {
      didCache = true;
    } else {
      try {
        const request = new Request(asset.url);
        loadProgressMain.hidden = false;
        loadProgressCurrentText.textContent = "Requesting resource...";
        loadProgressCurrent.style.width = "0%";
        const networkResponse = await fetch(request);

        if (!networkResponse.ok) {
          throw new Error(
            `Server returned ${networkResponse.status} ${networkResponse.statusText} for file: ${asset.url}`,
          );
        }

        response = networkResponse;

      } catch (err) {
        console.error(`FATAL ERROR: Could not load ${asset.url}`);
        loaderContent.textContent = `ERROR: ${err.message}`;
        loadProgressMain.hidden = true;
        throw err;
      }
    }

    var buffer = null;
    if (!didCache) {
      var contentLength = response.headers.get('content-length');
      var total = contentLength ? parseInt(contentLength, 10) : 0;
      var reader = response.body.getReader();
      var loaded = 0;

      if (total == 0) {
        loadProgressMain.hidden = true;
      }

      function updatePercent() {
        var percent = total ? (loaded / total) * 100 : 0;
        if (percent < 0) {
          percent = 0; //Somehow going to negatives? Just cap it anyways.
        }
        if (percent > 100) {
          percent = 100; //Why are we going past 100%? Just cap it anyways.
        }
        loadProgressCurrent.style.width = percent + "%";
        loadProgressCurrentText.textContent = `Downloading "${asset.filename}"... (${Math.round(percent)}%)`;
      }

      updatePercent();

      var stream = new ReadableStream({
        async start(controller) {
          while (true) {

            updatePercent();

            const { done, value } = await reader.read();

            if (done) {
              controller.close();
              break;
            }

            loaded += value.byteLength;
            updatePercent();

            controller.enqueue(value);
          }
        }
      });

      var trackedResponse = new Response(stream, {
        headers: response.headers,
        status: response.status,
        statusText: response.statusText
      });

      var cachePromise = cache.put(asset.url, trackedResponse.clone()).catch((e) => {
        console.warn(`Unable to put in cache: ${e}`);
      });

      buffer = await trackedResponse.arrayBuffer();

      loadProgressCurrentText.textContent = `Waiting for "${asset.filename}" cache...`;
      
      try{
      await cachePromise;
      }catch(e){}
    } else {
      loadProgressCurrentText.textContent = `Pulling "${asset.filename}" from cache...`;
      buffer = await response.arrayBuffer();
    }
    var data = new Uint8Array(buffer);

    //This is probably sync so it won't display but whatever.
    loadProgressCurrentText.textContent = `Attaching resource "${asset.filename}"...`;
    FS.writeFile(asset.filename, data);
    
    loadProgressMain.hidden = true;

    assetCount += 1;
  }
}

const RUNNING_CHECK_NAME = "srb2web_running_check";

async function initGame() {
  IDBFS = FS.filesystems.IDBFS;

  await downloadAndSaveAssets();

  loaderContent.textContent = "SRB2 is starting...";

  keepAlive(); // Try to keep the screen awake while playing

  ensureUserDataTree();
  FS.mount(IDBFS, {}, "/home/web_user");
  FS.syncfs(true, (err) => {
    if (err) {
      if (isErrno44(err)) {
        console.warn("Recoverable SyncFS hydration error:", err);
        try {
          ensureUserDataTree();
        } catch (recoverErr) {
          console.error("Failed to recover filesystem paths:", recoverErr);
        }
      } else {
        console.error("SyncFS hydration failed:", err);
      }
    }

    console.log("SyncFS done", err);

    //Give some breathing room for the sync to complete before starting the game, seems to help with stability on some browsers.
    setTimeout(() => {
      Module.callMain(["-home", "/home/web_user"].concat(Module.arguments));
    },500);
  });
}

var GetViewportWidth = () => {
  return Math.round(document.documentElement.clientWidth);
};

var GetViewportHeight = () => {
  return Math.round(document.documentElement.clientHeight);
};

function getTargetSize(x, y) {
  // Use devicePixelRatio to fix the "tiny box in the corner" issue
  const dpr = window.devicePixelRatio || 1;
  const targetX = Math.floor((x || GetViewportWidth()) * dpr);
  const targetY = Math.floor((y || GetViewportHeight()) * dpr);

  gameCanvas.width = targetX;
  gameCanvas.height = targetY;

  // Match the CSS size to the viewport size
  gameCanvas.style.width = targetX / dpr + "px";
  gameCanvas.style.height = targetY / dpr + "px";

  return { targetX, targetY };
}

window.ChangeResolution = (x, y) => {
  if (didStart) {
    if (typeof x === "undefined") x = GetViewportWidth();
    if (typeof y === "undefined") y = GetViewportHeight();
    gameCanvas.width = x;
    gameCanvas.height = y;
    gameCanvas.style.width = x + "px";
    gameCanvas.style.height = y + "px";
    Module.ccall("change_resolution_"+resolutionChangeMethod, "number", ["number", "number"], [x, y]);
  }
};

async function startGame(options = {}) {
  loaderMain.hidden = false;
  launcherMain.hidden = true;
  var { targetX, targetY } = getTargetSize();

  Module.arguments = [];
  if (serverOpts) {
    Module.arguments.push("-server");
    if (serverOpts.dedicated) {
      Module.arguments.push("-dedicated");
    }
  }
  if (options) {
    if (options.host) {
      Module.arguments.push("-server");
    }
    if (options.joinURL) {
      connectAddr = options.joinURL;
    }
    if (options.resolutionChangeMethod) {
      resolutionChangeMethod = options.resolutionChangeMethod;
    }
  }

  Module.noInitialRun = true;
  Module.print = () => {};
  Module.printErrr = console.error;
  Module.canvas = gameCanvas;
  Module.onRuntimeInitialized = initGame;
  Module.pauseOnVisibilityChange = false;
  Module.onExit = function () {
    window.location.reload();
  };

  try {
    await loadScript();
  } catch (e) {
    dialog.alert(
      "Error loading the game, look in the console for full error. \n" + e,
    );
    console.error("SRB2 Load error: ", e);
    return;
  }
}

window.SRB2HandleVideoResolution = function (width,height) {
  //We pass the resolution into variables because we need this to accurately calculate mouse movements.
  gameResolutionWidth = width;
  gameResolutionHeight = height;
};

window.StartedMainLoopCallback = function () {
  didStart = true;
  gameCanvas.hidden = false;
  window.ChangeResolution();
  function sendConnectCommand() {
    if (connectAddr) {
      //Javascript side patch because we can't
      //pass a connect flag into Module.arguments without causing the resize logic to crash.
      Module.ccall('SRB2_SendGreenTerminal', 'void', ['string'], [`connect ${connectAddr}\n`]);
      connectAddr = null;
    }
  }
  setTimeout(() => {
    requestAnimationFrame(() => {
      sendConnectCommand();
    });
  }, 500);

  // Add click listener after canvas is shown
  gameCanvas.addEventListener("click", () => {
    //console.log("Canvas clicked, locking mouse");
    LockMouse();
  });

  // Add mousemove listener for manual mouse delta handling
  document.addEventListener("mousemove", (e) => {
    if (document.pointerLockElement === gameCanvas) {
      Module.ccall("SRB2_AddMouseDelta", "void", ["number", "number"], [
        Math.round(e.movementX),
        Math.round(e.movementY),
      ]);
    }
  });

  startupTouchControls();

  var isSyncing = false;
  setInterval(() => {
    if (!isSyncing) {
      isSyncing = true;
      FS.syncfs(false, (err) => {
        if (err) {
          if (isErrno44(err)) {
            try {
              ensureUserDataTree();
            } catch (recoverErr) {
              console.error("Failed to recover filesystem paths:", recoverErr);
            }
          } else {
            console.warn("Background SyncFS error:", err);
          }
        }
        isSyncing = false;
      });
    }
    localStorage.setItem(RUNNING_CHECK_NAME, Date.now());
  }, 600);
};

window.addEventListener("resize", () => {
  window.ChangeResolution();
});
// SRB2 Gametype Constants
const GT_COOP = 0;
const GT_COMPETITION = 1;
const GT_RACE = 2;
const GT_MATCH = 3;
const GT_TAG = 4;
const GT_CTF = 5;

// Mock Server Fetch
async function fetchMS() {
  return [
    {
      ip: "152.26.89.206:5029",
      name: "Classic Co-op Adventure",
      version: "2.2.13",
      players: 2,
      max_players: 8,
      gametype: GT_COOP,
    },
  ];
}

// ----------------------------------------------------
// THE CRITICAL FUNCTION CALLED BY C
// ----------------------------------------------------
window.SRB2RequestServerList = function () {
  //dialog.alert("JS: C code requested server list...");

  // 1. Clear the old list in C
  try {
    Module.ccall("SRB2_ClearServerList", "void", [], []);
  } catch (e) {
    console.error("Could not clear list:", e);
  }

  // 2. Fetch and Populate
  fetchMS()
    .then((data) => {
      data.forEach((server) => {
        Module.ccall(
          "SRB2_AddServerToList",
          "void",
          [
            "string",
            "string",
            "string",
            "number",
            "number",
            "number",
            "number",
          ],
          [
            server.ip,
            server.name,
            server.version,
            server.players,
            server.max_players,
            100,
            server.gametype,
          ],
        );
      });

      // 3. Tell C we are done
      Module.ccall("SRB2_FinishServerList", "void", [], []);
    })
    .catch((err) => {
      console.error("JS: Error fetching servers:", err);
    });
};

var LockMouse = () => {
  if (touchState.ingameTouch) {
    return;
  }
  if (didStart) {
    Module.ccall("lock_mouse", null, [], []);
    gameCanvas.focus();
    if (gameCanvas.requestPointerLock) {
      try {
        gameCanvas.requestPointerLock().catch((e) => {});
      } catch (e) {
        console.warn("Mouse lock request failed: ", e);
      }
    }
  }
};

var UnlockMouse = (force = false) => {
  if (touchState.ingameTouch) {
    return;
  }
  if (didStart) {
    if (force && document.pointerLockElement)
      document.exitPointerLock(); // this method should fire again, so don't unlock_mouse right now
    else if (!document.pointerLockElement)
      Module.ccall("unlock_mouse", null, [], []);
  }
};

touchState.UnlockMouse = UnlockMouse;

var CaptureFullscreenKey = (e) => {
  // Let F11 do fullscreen
  if (e instanceof KeyboardEvent && e.key === "F11") e.stopPropagation();
};

window.addEventListener("mousedown", LockMouse, false);
document.addEventListener("pointerlockchange", (_) => UnlockMouse(), false);
document.addEventListener(
  "mousedown",
  (e) => {
    if (document.pointerLockElement === gameCanvas) {
      Module.ccall("mouse_button_down", "void", ["number"], [e.button]);
      e.preventDefault();
    }
  },
  true,
);
document.addEventListener(
  "mouseup",
  (e) => {
    if (document.pointerLockElement === gameCanvas) {
      Module.ccall("mouse_button_up", "void", ["number"], [e.button]);
      e.preventDefault();
    }
  },
  true,
);
document.addEventListener(
  "wheel",
  (e) => {
    if (document.pointerLockElement === gameCanvas) {
      Module.ccall(
        "mouse_wheel_xy",
        "void",
        ["number", "number"],
        [Math.round(e.deltaX), Math.round(e.deltaY)],
      );
      e.preventDefault();
    }
  },
  true,
);
var mouseMoveX = 0;
var mouseMoveY = 0;
setInterval(() => {
  if (didStart) {
    if (gameResolutionWidth > 0 && gameResolutionHeight > 0) {
      var scaleX = gameResolutionWidth / gameCanvas.clientWidth;
      var scaleY = gameResolutionHeight / gameCanvas.clientHeight;
      var finalX = mouseMoveX * scaleX;
      var finalY = mouseMoveY * scaleY;
      Module.ccall(
        "SRB2_AddMouseDelta",
        "void",
        ["number", "number"],
        [finalX, finalY],
      );
      mouseMoveX = 0;
      mouseMoveY = 0;
    }
  }
}, 1000 / 55);
window.addEventListener(
  "load",
  (_) => {
    document.addEventListener("keydown", CaptureFullscreenKey, true);
    document.addEventListener("keyup", CaptureFullscreenKey, true);
    document.addEventListener("keypress", CaptureFullscreenKey, true);
  },
  { once: true },
);

var touches = [];

gameCanvas.addEventListener("touchstart", function (e) {
    if (!didStart) {
        return;
    }
    for (var touch of e.changedTouches) {
        if (!touches.find(t => t.id == touch.identifier)) {
            touches.push({
                id: touch.identifier,
                rid: Math.random() + "_" + Date.now(),
                clientX: touch.clientX,
                clientY: touch.clientY,
                radiusX: touch.radiusX,
                radiusY: touch.radiusY,
                top: touch.clientY,
                left: touch.clientX,
                width: touch.radiusX < 2 ? 2 : touch.radiusX,
                height: touch.radiusY < 2 ? 2 : touch.radiusY,
                touching: true
            });
        }
    }
    e.preventDefault();
}, { passive: false });
gameCanvas.addEventListener("touchmove", function (e) {
    if (!didStart) {
        return;
    }
    for (var touch of e.changedTouches) {
        var t = touches.find(t => t.id == touch.identifier);
        if (t) {
            var movementX = touch.clientX - t.clientX;
            var movementY = touch.clientY - t.clientY;
            t.clientX = touch.clientX;
            t.clientY = touch.clientY;
            t.radiusX = touch.radiusX;
            t.radiusY = touch.radiusY;
            t.left = touch.clientX;
            t.top = touch.clientY;
            t.width = touch.radiusX < 2 ? 2 : touch.radiusX;
            t.height = touch.radiusY < 2 ? 2 : touch.radiusY;

            mouseMoveX += movementX*5;
            mouseMoveY += movementY*5;
        }
    }
    e.preventDefault();
}, { passive: false });
gameCanvas.addEventListener("touchend", function (e) {
    if (!didStart) {
        return;
    }
    for (var touch of e.changedTouches) {
        var t = touches.find(t => t.id == touch.identifier);
        if (t) {
            t.touching = false;
            touches = touches.filter(t => t.id !== touch.identifier);
        }
    }
    e.preventDefault();
}, { passive: false });

//Debug handling
window.addEventListener('error', (event) => {
  // Check if it's a resource loading error (like a failed <img> or <script>)
  if (event.target && (event.target.tagName === 'IMG' || event.target.tagName === 'SCRIPT')) {
    console.error('Resource failed to load:', event.target);
    return;
  }

  // Extract the full stack trace if available
  const errorObj = event.error;
  const stackTrace = errorObj && errorObj.stack ? errorObj.stack : null;

  const errorData = {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    stack: stackTrace
  };

  // Log the complete error object with stack trace to console
  console.error('Captured JS Error:', errorData);

  // Example alert incorporating the stack trace (or first few lines)
  dialog.alert(`Uncaught JS Error: ${event.message}\n\nStack Trace:\n${stackTrace || 'No stack available'}`);
}, true);

module.exports = { startGame, enableStartServer, disableStartServer };
