module.exports = [
    {
        element: "div",
        className: "voiceSettingsDialogContent",
        children: [

            {
                element: "canvas",
                gid: "voiceTestCanvas",
                className: "voiceTestCanvas"
            },

            {
                element: "div",
                style: {
                    display: "flex",
                },
                children: [
                    {
                        element: "span",
                        textContent: "Voice device: "
                    },
                    {
                        element: "select",
                        className: "selectOptions",
                        gid: "voiceDeviceOption"
                    },
                    {
                        element: "div",
                        className: "blueButton",
                        textContent: "Apply"
                    }
                ],
            },


        ]
    }
];