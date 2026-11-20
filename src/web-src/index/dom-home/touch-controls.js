module.exports = [
    ////////////////////////////////////////////
    //The dialog used to customize touch controls.

    {
        element: "div",
        gid: "touchControlsDialog",
        hidden: true,
        children: [
            {
                element: "div",
                className: "blackDialogBG",
            },
            {
                element: "div",
                className: "touchControlsDialog",
                children: [
                    ...require("./touch-controls-dialog.js")
                ]
            }
        ]
    },

    ////////////////////////////////////////////
    // JavaScript would fill this in with the touch controls.

    {
        element: "div",
        gid: "touchControlsContainer",
        className: "touchControlsContainer",
        hidden: true,
    },

    ////////////////////////////////////////////
];