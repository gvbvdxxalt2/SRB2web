var elements = require("../gp2/elements.js");
var {Module, loadEmscripten, getFS, getIDBFS} = require("../include-emscripten/");
var dialog = require("../dialog.js");
var IDBFS = null;
var gameCanvasContainer = elements.getGPId("gameCanvasContainer");
var gameCanvasSoftware = elements.getGPId("gameCanvasSoftware");
var gameCanvasGL = elements.getGPId("gameCanvasGL");
gameCanvasSoftware.id = "canvasSoftware";
gameCanvasGL.id = "canvasGL";
var didStart = false;
var loaderContent = elements.getGPId("loaderContent");
var serverOpts = null;
var assetMode = "original";
var launcherMain = elements.getGPId("launcherMain");
var loaderMain = elements.getGPId("loaderMain");
var resolutionChangeMethod = "safe";

var loadProgressMain = elements.getGPId("loadProgressMain");
var loadProgressCurrent = elements.getGPId("loadProgressCurrent");
var loadProgressCurrentText = elements.getGPId("loadProgressCurrentText");
var loaderCacheWarning = elements.getGPId("loaderCacheWarning");
loadProgressMain.hidden = true;
loaderCacheWarning.hidden = true;

const {ASSET_TYPES, CACHE_NAME} = require("./assets.js");

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
  var FS = getFS();
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
  var FS = getFS();
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

async function downloadAndSaveAssets() {
  var FS = getFS();
  var assetList = ASSET_TYPES[assetMode] || ASSET_TYPES.normal;
  var cache = await caches.open(CACHE_NAME);
  var assetCount = 0;
  var assetLength = assetList.length;

  for (var asset of assetList) {

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
        loaderCacheWarning.hidden = false;
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
  IDBFS = getIDBFS();
  var FS = getFS();

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

  gameCanvasSoftware.width = gameResolutionWidth;
  gameCanvasSoftware.height = gameResolutionHeight;
  gameCanvasGL.width = gameResolutionWidth;
  gameCanvasGL.height = gameResolutionHeight;

  // Match the CSS size to the viewport size
  gameCanvasSoftware.style.width = targetX / dpr + "px";
  gameCanvasSoftware.style.height = targetY / dpr + "px";
  gameCanvasGL.style.width = targetX / dpr + "px";
  gameCanvasGL.style.height = targetY / dpr + "px";

  if (Module.ccall) {
    Module.ccall("change_resolution_"+resolutionChangeMethod, "number", ["number", "number"], [gameResolutionWidth, gameResolutionHeight]);
  }
  return { targetX, targetY };
}

window.ChangeResolution = (x, y) => {
  if (didStart) {
    if (typeof x === "undefined") x = GetViewportWidth();
    if (typeof y === "undefined") y = GetViewportHeight();

    gameCanvasSoftware.style.width = x + "px";
    gameCanvasSoftware.style.height = y + "px";
    gameCanvasGL.style.width = x + "px";
    gameCanvasGL.style.height = y + "px";

    getTargetSize();
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
  Module.canvas = gameCanvasSoftware;
  Module.onRuntimeInitialized = initGame;
  Module.pauseOnVisibilityChange = false;
  Module.onExit = function () {
    window.location.reload();
  };

  loaderContent.textContent = "Loading game script...";
  try {
    await loadEmscripten();
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
  if (gameResolutionWidth !== width || gameResolutionHeight !== height) {
    setTimeout(() => window.ChangeResolution(), 10);
  }
};

window.StartedMainLoopCallback = function () {
  var FS = getFS();
  didStart = true;
  gameCanvasContainer.hidden = false;
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
  gameCanvasContainer.addEventListener("click", () => {
    //console.log("Canvas clicked, locking mouse");
    LockMouse();
  });

  // Add mousemove listener for manual mouse delta handling
  document.addEventListener("mousemove", (e) => {
    if (document.pointerLockElement === gameCanvasContainer) {
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

var LockMouse = () => {
  if (touchState.ingameTouch) {
    return;
  }
  if (didStart) {
    Module.ccall("lock_mouse", null, [], []);
    gameCanvasContainer.focus();
    if (gameCanvasContainer.requestPointerLock) {
      try {
        gameCanvasContainer.requestPointerLock().catch((e) => {});
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
    if (document.pointerLockElement === gameCanvasContainer) {
      Module.ccall("mouse_button_down", "void", ["number"], [e.button]);
      e.preventDefault();
    }
  },
  true,
);
document.addEventListener(
  "mouseup",
  (e) => {
    if (document.pointerLockElement === gameCanvasContainer) {
      Module.ccall("mouse_button_up", "void", ["number"], [e.button]);
      e.preventDefault();
    }
  },
  true,
);
document.addEventListener(
  "wheel",
  (e) => {
    if (document.pointerLockElement === gameCanvasContainer) {
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
      var scaleX = gameResolutionWidth / gameCanvasContainer.clientWidth;
      var scaleY = gameResolutionHeight / gameCanvasContainer.clientHeight;
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

gameCanvasContainer.addEventListener("touchstart", function (e) {
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
gameCanvasContainer.addEventListener("touchmove", function (e) {
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
gameCanvasContainer.addEventListener("touchend", function (e) {
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

Module.selectRenderCanvas = function (useWebGL, width, height) {
  var activeCanvas = useWebGL ? gameCanvasGL : gameCanvasSoftware;
  var inactiveCanvas = useWebGL ? gameCanvasSoftware : gameCanvasGL;

  console.log(useWebGL);

  inactiveCanvas.hidden = true;
  activeCanvas.hidden = false;
  Module.canvas = activeCanvas;

  window.ChangeResolution();
  getTargetSize();
  setTimeout(() => {
    window.ChangeResolution();
    getTargetSize();
  },1000/30);

  return "#"+activeCanvas.id;
};

module.exports = { startGame, enableStartServer, disableStartServer };
