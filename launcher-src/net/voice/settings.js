var elements = require("../../gp2/elements.js");

var VoiceDevice = require("./device.js");
var VoiceAnalyser = require("./analyser.js");

var voiceSettings = elements.getGPId("voiceSettings");
var voiceSettingsExitButton = elements.getGPId("voiceSettingsExitButton");
var ingameMenu = false;
var testStream = null;
voiceSettings.hidden = true;

var voiceDeviceOption = elements.getGPId("voiceDeviceOption");
var canvas = elements.getGPId("voiceTestCanvas");
canvas.width = 480;
canvas.height = 100;
var ctx = canvas.getContext("2d");

var analyser = null;

setInterval(() => {
    ctx.fillStyle = "rgb(100,100,100)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = "rgb(250,250,250)";
    if (analyser) {
        var samples = analyser.getSamples();
        var i = 0;
        var width = canvas.width;
        var height = canvas.height;
        for (var sample of samples) {
            ctx.fillRect(Math.round((i/samples.length)*width),Math.round((sample*(height/2))+(height/2)),1,1);
            i += 1;
        }
    } else {
        ctx.fillRect(0,canvas.height/2,canvas.width,1);
    }
},1000/30);

function closeVoiceChatSettings() {
    voiceSettings.hidden = true;
    stopTestStream();
    if (!ingameMenu) {
        VoiceDevice.stopStream();
    }
}

async function startTestStream() {
    await VoiceDevice.startStream();
    testStream = await VoiceDevice.getStream();
    if (analyser) {
        VoiceAnalyser.removeAnalyser(analyser);
    }

    if (!testStream) {
        return;
    }
    analyser = VoiceAnalyser.getAnalyser(testStream);
}

async function stopTestStream() {
    //Don't use VoiceDevice.stopStream since we're
    // probably going to be in game.
    if (analyser) {
        VoiceAnalyser.removeAnalyser(analyser);
        analyser = null;
    }
}

async function retrieveDeviceInfo() {
    elements.setInnerJSON(voiceDeviceOption, [
        {
            element: "option",
            textContent: "Getting devices...",
            value: "_"
        }
    ]);
    voiceDeviceOption.value = "_";
    await startTestStream();
    var devices = await VoiceDevice.getDevices();
    var selectedDevice = await VoiceDevice.getDeviceID();
    elements.setInnerJSON(
        voiceDeviceOption,
        devices.map((device) =>
            ({
                element: "option",
                textContent: device.label,
                value: device.id,
                //default: selectedDevice == device.id
            })
        )
    );
    if (selectedDevice) {
        voiceDeviceOption.value = selectedDevice;
    }
    if (devices.length < 1) {
        elements.setInnerJSON(
            voiceDeviceOption,
            [
                {
                    element: "option",
                    textContent: "No devices found or permission denied",
                    value: "_"
                }
            ]
        );
        voiceDeviceOption.value = "_";
    }
}

function openVoiceChatSettings(isIngame) {
    if (isIngame) {
        ingameMenu = true;
    } else {
        ingameMenu = false;
    }
    voiceSettings.hidden = false;
    retrieveDeviceInfo();
}

voiceDeviceOption.addEventListener("change", function () {

});

voiceSettingsExitButton.addEventListener("click", closeVoiceChatSettings);

module.exports = {
    openVoiceChatSettings,
    closeVoiceChatSettings
};