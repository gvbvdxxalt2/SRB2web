var editSpacing = {element: "div",className: "touchControlsEditButtonsSpacing"};

////////////////////////////////////////////////////////////////////////////////

var content = [
    ///////////////////////////////////////
    //Title and tips.
    {
        element: "span",
        className: "touchControlsDialogTitle",
        textContent: "Customize Touch Controls",
    },
    {
        element: "span",
        className: "touchControlsDialogTip",
        textContent: "You can't move touch controls without a touch screen, sorry!",
    },
    {
        element: "span",
        className: "touchControlsDialogTip2",
        textContent: "To move a control, just drag and drop it anywhere on the screen. To edit or delete a control, just tap on it.",
    },

    ///////////////////////////////////////
    //Buttons to customize touch controls.
    {
        element: "div",
        className: "touchControlDialogEditButtons",
        children: [
            ////////////////////
            //Close button.
            //Needs to be clickable on non-touch devices so you don't get softlocked on to this screen.
            {
                element: "div",
                className: "touchControlsDialogButton touchControlsDialogRedButton",
                textContent: "Close",
                gid: "touchControlsClose",
            },editSpacing,
            ////////////////////
            //Add button and dropdown.
            {
                element: "div",
                className: "touchControlsAddDropdownContainer",
                children: [
                    {
                        element: "div",
                        className: "touchControlsAddDropdown",
                        gid: "touchControlsAddDropdown",
                        hidden: true,
                    },
                ]
            },
            {
                element: "div",
                className: "touchControlsDialogButton",
                gid: "touchControlsAdd",
                children: [
                    {
                        element: "span",
                        textContent: "Add control"
                    }
                ]
            },editSpacing,
            ////////////////////
            //Reset button.
            {
                element: "div",
                className: "touchControlsDialogButton touchControlsDialogRedButton",
                textContent: "Reset",
                gid: "touchControlsReset"
            },editSpacing,
            ////////////////////
            //Save button.
            {
                element: "div",
                className: "touchControlsDialogButton",
                textContent: "Save",
                gid: "touchControlsSave"
            },editSpacing,
            ////////////////////
        ]
    },

    ///////////////////////////////////////
];

module.exports = [
    {
        element: "div",
        className: "touchControlsContent",
        children: content,
    }
];