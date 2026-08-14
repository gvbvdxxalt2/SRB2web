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

  FS.mkdirTree("/addons");
  FS.symlink("/home/web_user/.srb2", "/addons/.srb2");
  FS.symlink("/home/web_user/.srb2", "/addons/userdata");
  FS.mount(IDBFS, {}, "/home/web_user");

  // 2. Sync from IndexedDB to MEMFS
  await new Promise((resolve,reject) => {
    FS.syncfs(true, (err) => {
      if (err) {
        reject();
        console.error("Sync Error:", err);
        (async function() {
          await dialog.alert(
            "The data seems corrupted!\n"+
            "You have probably exceeded your web browsers storage limit.\n"+
            "If you continue your data will be erased to store new data on top of."
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
