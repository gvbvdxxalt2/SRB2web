var audioContext = null;

function newContext() {
    if (audioContext) {
        try{audioContext.close();}catch(e){}
    }
    audioContext = new AudioContext();
}

function tryStartup() {
    newContext();
    if (audioContext.state !== "running") {
        setTimeout(tryStartup,100);
    } else {
        //window.alert("Now running");
    }
}

tryStartup();

function newContextIfNotRunning() {
    if (audioContext.state !== "running") {
        newContext();
    }
}

class AudioAnalyser {
    constructor (stream) {
        newContextIfNotRunning();

        var source = audioContext.createMediaStreamSource(stream);

        var analyser = audioContext.createAnalyser();
        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;
        source.connect(analyser);

        var array = new Float32Array(analyser.fftSize);
        this.array = array;
        this.stream = stream;

        this.source = source;
        this.analyser = analyser;
        this.audioContext = audioContext;
    }

    getSamples() {
        if (!this.analyser) {
            return;
        }
        try{
            this.analyser.getFloatTimeDomainData(this.array);
        }catch(e){
            console.error(e);
        }
        return this.array;
    }

    dispose() {
        if (!this.source) {
            return;
        }
        this.source.disconnect();
        this.analyser.disconnect();
        this.source = null;
        this.analyser = null;
        this.stream = null;
    }
}

function getAnalyser(stream) {
    return new AudioAnalyser(stream);
}

function removeAnalyser(analyserobj) {
    analyserobj.dispose();
}

module.exports = {
    getAnalyser,
    removeAnalyser,
};