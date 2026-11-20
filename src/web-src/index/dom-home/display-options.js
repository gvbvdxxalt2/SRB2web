module.exports = [
    {
        element: "div",
        children: [
            /////////////////////////////////////
            
            {
                element: "span",
                className: "sectionHeader",
                textContent: "Display options:",
            },

            /////////////////////////////////////

            /*{
                element: "span",
                textContent: "If your game is crashing, try changing these options:"
            },/*

            /////////////////////////////////////
            
            /*{
                element: "div",
                className: "displayOption",
                children: [
                    {
                        element: "span",
                        textContent: "Resolution change mode:"
                    },
                    {
                        element: "select",
                        className: "selectOptions",
                        gid: "resizeModeSelect",
                        title: "Choose resizing mode",
                        children: [
                            {
                                element: "option",
                                textContent: "Virtual window resizing (Safest - Less crashing)",
                                value: "safe",
                                selected: true
                            },
                            {
                                element: "option",
                                textContent: "Entire game resolution changes (Overrides in-game resolution - likely to crash)",
                                value: "force"
                            }
                        ]
                    }
                ]
            },*/

            /////////////////////////////////////
            //Button to open touch controls to move and customize them.

            {
                element: "button",
                className: "button",
                gid: "configureTouchControlsButton",
                textContent: "Customize touch controls",
            },

            /////////////////////////////////////
        ]
    }
];