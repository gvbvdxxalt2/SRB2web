const dialog = require("../dialog");

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

function isErrno44(err) {
  return !!err && Number(err.errno) === 44;
}

function safeSymlink(targetPath, linkPath) {
  try {
    if (!FS.analyzePath(linkPath).exists) {
      FS.symlink(targetPath, linkPath);
    }
  } catch (err) {
    // If another flow already created the link, we can safely continue.
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

async function loadFilesystem() {
  Module.noInitialRun = true;
  Module.canvas = document.createElement("canvas");

  await loadScript();
  FS = Module.FS;

  // Ensure Module.HEAP8 exists temporarily so write checks don't throw ReferenceError
  if (typeof HEAP8 === 'undefined' && typeof Module !== 'undefined') {
      if (Module.wasmMemory && Module.wasmMemory.buffer) {
          window.HEAP8 = new Int8Array(Module.wasmMemory.buffer);
          Module.HEAP8 = window.HEAP8;
      } else {
          // Fallback stub if wasmMemory isn't bound yet (prevents buffer comparison crash)
          window.HEAP8 = { buffer: new ArrayBuffer(0) };
          Module.HEAP8 = window.HEAP8;
      }
  }

  ensureUserDataTree();
  FS.mount(IDBFS, {}, "/home/web_user");

  // 2. Sync from IndexedDB to MEMFS
  await new Promise((resolve,reject) => {
    FS.syncfs(true, (err) => {
      if (err) {
        if (isErrno44(err)) {
          // Missing path during hydration can happen after interrupted game startup.
          // Recreate expected paths and continue instead of wiping IndexedDB.
          console.warn("Recoverable SyncFS hydration error:", err);
          try {
            ensureUserDataTree();
            resolve();
            return;
          } catch (recoverErr) {
            console.error("Recovery after SyncFS errno 44 failed:", recoverErr);
          }
        }
        reject();
        console.error("Sync Error:", err);
        (async function() {
          var error = ""+err;
          try{
            error = JSON.stringify(err);
          }catch(e){}
          await dialog.alert(
            "The data seems corrupted!\n"+
            "You have probably exceeded your web browsers storage limit.\n"+
            "If you continue your data will be erased to store new data on top of.\n"+
            error
          );

          const deleteReq = window.indexedDB.deleteDatabase("/home/web_user");

          deleteReq.onsuccess = function () {
              console.log("Corrupted database wiped successfully.");
              window.location.reload();
            };
            deleteReq.onupgradeneeded = () => {
              window.location.reload();
            };

            deleteReq.onerror = async function (dbErr) {
                console.error("Failed to delete the corrupted IndexedDB database.", dbErr);
                await dialog.alert("Unable to automatically erase IndexedDB database. Reload to try again.");
                window.location.reload();
              };

              setTimeout(() => {
                window.location.reload();
              },1000);
        })();
        return;
      }

      // --- SETUP START (Inside callback to ensure persistence awareness) ---

      ensureUserDataTree();

      // --- SETUP END ---
      resolve();
    });
  });

  console.log("Filesystem ready. Default path: /addons/userdata");
}

module.exports = { loadFilesystem };
