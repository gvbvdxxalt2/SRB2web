
var IMAGES = require("../filemanager/images.js");

module.exports = [
    {
                    element: "div",
                    className: "voiceSettingsDialogTop",
                    children: [
                        {
                            element: "span",
                            className: "voiceSettingsDialogTitle",
                            textContent: "Voice chat settings"
                        },
                        {
                            element: "div",
                            style: {marginRight: "auto"}
                        },
                        {
                            element: "div",
                            className: "voiceSettingsDialogExit",
                            gid: "voiceSettingsExitButton",
                            children: [
                                {
                                    element: "img",
                                    src: IMAGES.X
                                }
                            ]
                        }
                    ]
                },
];