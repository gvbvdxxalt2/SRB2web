(function () {

    function fallbackOverride() {
        window.requestAnimationFrame = (c) => {
            return setTimeout(c,1);
        };
        window.cancelAnimationFrame = clearTimeout;
    }

    if (!window.Worker) {
        fallbackOverride();
        return;
    }

    var workerCode = `
    var started = false;
    self.onmessage = function(e) {
        if (e.data === 'start') {
            if (started) { return; }
            started = true;
            setInterval(() => {
                self.postMessage('tick');
            },1);
        }
    };
    `;

    try{
        //Thing so that it isn't extremely laggy when switching tabs and running netgames.

        var blob = new Blob([workerCode], { type: 'application/javascript' });
        var workerUrl = URL.createObjectURL(blob);
        var worker = new Worker(workerUrl);

        var requestFrames = {};

        worker.onmessage = (e) => {
        if (e.data == "tick") {
            for (var key of Object.keys(requestFrames)) {
                requestFrames[key]();
                delete requestFrames[key];
            }
        }
        };
        worker.postMessage('start');

        window.requestAnimationFrame = (callback = () => {}) => {
            var f = function () {
                callback();
            };
            var id = 1;
            while (requestFrames[id]) {
                id += 1;
            }
            requestFrames[id] = f;
            return id;
        };

        window.cancelAnimationFrame = (id) => {
            if (typeof id !== "number") {
                return;
            }
            delete requestFrames[id];
        };

    }catch(e){
        fallbackOverride();
        return;
    }

    setTimeout(() => {
        URL.revokeObjectURL(workerUrl);
    },10);
})();