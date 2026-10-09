
var active = false;
var audioStream = null;
var devices = [];
var STORAGE_KEY = "voice_device";
var deviceID = localStorage.getItem(STORAGE_KEY) || null;
var opts = {
    echoCancellation: false,
    noiseSuppression: false,
};

async function startStream() {
    if (audioStream) {
        try{
            audioStream.getTracks().forEach(track => track.stop());
        }catch(e){}
        audioStream = null;
    }
    try{        
        audioStream = await navigator.mediaDevices.getUserMedia({
            audio: deviceID ? ({
                deviceId: { exact: deviceID },
                ...opts
            }) : opts
        });
    }catch(e){
        console.error("Failed to start microphone: "+e);
        return;
    }
    active = true;
}

async function getStream() {
    return audioStream;
}

async function stopStream() {
    if (audioStream) {
        try{
            audioStream.getTracks().forEach(track => track.stop());
        }catch(e){}
    }
    audioStream = null;
    active = false;
}

async function getDevices() {

    if (!active) {
        await startStream();
    }

    try{
        devices = await navigator.mediaDevices.enumerateDevices();
    }catch(e){
        console.error("Failed to find devices: "+e);
        devices = [];
    }

    devices = devices.filter((device) => device.kind == "audioinput");

    return devices;
}

async function setDeviceID(id) {
    deviceID = id;
    localStorage.setItem(STORAGE_KEY, deviceID);
}

async function getDeviceID() {
    return deviceID;
}

module.exports = {
    startStream,
    stopStream,
    getDevices,
    setDeviceID,
    getDeviceID,
    getStream,
};