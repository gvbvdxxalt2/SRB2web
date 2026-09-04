var { KeyNum, KeyName } = require("./keydef.js");
var { sendInput, sendJoystick, keyboardIsActive } = require("./handler.js");

var elements = require("../gp2/elements.js");

class TouchControlButton {
    static calculatePercentSize(x,y, cx = window.innerWidth, cy = window.innerHeight) {
        var percentX = (x/cx)*100;
        var percentY = (y/cy)*100;
        return {percentX, percentY};
    }

    static fromSavedData(data) {
        var button = new TouchControlButton(
            data.id,
            data.side,
            data.xPos,
            data.yPos,
            data.width,
            data.height
        );
        return button;
    }

    static createEmptyButtonData(id) {
        var button = new TouchControlButton(
            id,
            "left",
            0,
            0
        );
        button.width = 10;
        button.height = 10;
        var data = button.save();
        button.destroy();
        return data;
    }

    constructor(id, side, xPos, yPos, width, height) {
        this.destroyed = false;
        this.side = side || "left";
        this.xPos = +xPos || 0;
        this.yPos = +yPos || 0;
        this.width = +width || 0;
        this.height = +height || 0;
        this.id = id;
        this.randomId = Date.now()+"_"+(Math.random()*100000); //Random ID to identify this button in edit mode, since the id can be duplicated.
        this.editMode = false;
        this.isJoystick = (KeyNum[this.id] == KeyNum.UI_JOYSTICK);
        this.joystickX = 0;
        this.joystickY = 0;
        this.touch = null;

        this.setInfo(this.id);
        this._justPressed = false;
        this.tapLength = 0;
    }

    isCollide(position, elm) {
        var aRect = position;
        var bRect = elm.getBoundingClientRect();

        return !(
        aRect.top + aRect.height < bRect.top ||
        aRect.top > bRect.top + bRect.height ||
        aRect.left + aRect.width < bRect.left ||
        aRect.left > bRect.left + bRect.width
        );
    }
    
    isTouchingOneOf(touchPositions, elm = this.elm) {
        for (var position of touchPositions) {
            if (this.isCollide(position, elm)) {
                return true;
            }
        }
        return false;
    }

    isTouchingFirst(touchPositions, elm = this.elm) {
        if (touchPositions.length == 0) return false;
        return this.isCollide(touchPositions[0], elm);
    }

    generateJoystickContent() {
        var elm = this.elm;
        var joystickMain = null;
        var joystickCircle = null;
        elements.setInnerJSON(elm, [
            {
                element: "div",
                className: "touchControlsJoystick",
                GPWhenCreated: (e) => {joystickMain = e;},
                children: [
                    {
                        element: "div",
                        className: "touchControlsJoystickCircle",
                        GPWhenCreated: (e) => {joystickCircle = e;},
                    }
                ]
            },
        ]);

        this.joystickMain = joystickMain;
        this.joystickCircle = joystickCircle;
    }

    resizeJoystick() {
        if (!this.isJoystick) return;

        var elm = this.elm;
        var joystickMain = this.joystickMain;
        var joystickCircle = this.joystickCircle;
        var bounding = elm.getBoundingClientRect();
        var scale = Math.min(bounding.width, bounding.height) / 100;
        joystickMain.style.width = (100*scale) + "px";
        joystickMain.style.height = (100*scale) + "px";
    }

    handleJoystick(touchPositions, processState) {
        var elm = this.elm;
        var joystickMain = this.joystickMain;
        var joystickCircle = this.joystickCircle;

        if (!joystickMain || !joystickCircle) {
            return;
        }

        var touch = null;
        for (var position of touchPositions) {
            if (this.isCollide(position, joystickMain)) {
                touch = position;
                break;
            }
        }

        if (touch || this.touch) {
            if (processState.touchingJoystick !== this.randomId) {
                processState.touchingJoystick = this.randomId;
            }
            var bounding = joystickMain.getBoundingClientRect();
            var centerX = bounding.left + bounding.width/2;
            var centerY = bounding.top + bounding.height/2;

            if (touch) {
                this.touch = touch;
            }

            var deltaX = this.touch.left - centerX;
            var deltaY = this.touch.top - centerY;
            var percent = TouchControlButton.calculatePercentSize(deltaX, deltaY, bounding.width, bounding.height);
            
            this.joystickX = Math.max(-1, Math.min(1, percent.percentX/50));
            this.joystickY = -Math.max(-1, Math.min(1, percent.percentY/50));

            var distance = Math.sqrt(this.joystickX*this.joystickX + (-this.joystickY)*(-this.joystickY));
            if (distance > 1) {
                this.joystickX /= distance;
                this.joystickY /= distance;
            }
        } else {
            if (processState.touchingJoystick == this.randomId) {
                processState.touchingJoystick = null;
                this.joystickX = 0;
                this.joystickY = 0;
                sendJoystick(this.joystickX, this.joystickY);
            }
        }

        if (this.touch) {
            if (this.touch.touching) {
                sendJoystick(this.joystickX, this.joystickY);
                joystickCircle.setAttribute("data-touching", "");
            } else {
                this.touch = null;
                this.joystickX = 0;
                this.joystickY = 0;
                sendJoystick(this.joystickX, this.joystickY);
                processState.touchingJoystick = null;
                joystickCircle.removeAttribute("data-touching");
            }
        }

        joystickCircle.style.top = (50 + this.joystickY*-50) + "%";
        joystickCircle.style.left = (50 + this.joystickX*50) + "%";
    }

    generateElement() {
        var editBoxElm = null;
        if (this.elm) {
            this.elm.remove();
        }

        if (this.width < 0) {
            this.width = 0;
        }
        if (this.height < 0) {
            this.height = 0;
        }

        this.elm = elements.createElementsFromJSON([
            {
                element: "div",
                className: (this.isJoystick ? "touchControlsJoystickContainer" : "touchActionButton")+" touchControlPosition",
                "data-position": this.side,
                styleProperties: {
                    "--button-x": this.xPos+"%",
                    "--button-y": this.yPos+"%",
                    "--button-width": this.width+"%",
                    "--button-height": this.height+"%",
                },
                style: (this.isJoystick) ? ({"overflow": "visible !important"}) : ({}),
                children: [
                    {
                        element: "span",
                        textContent: (this.isJoystick? "": this.name),
                    },
                ]
            }
        ])[0];

        //White box, for resizing. Only shows in customization mode.
        this.editBoxElm = elements.createElementsFromJSON([
            {
                element: "div",
                className: "touchControlBox",
                "data-position": this.side,
                styleProperties: {
                    "--button-x": this.xPos+"%",
                    "--button-y": this.yPos+"%",
                    "--button-width": this.width+"%",
                    "--button-height": this.height+"%",
                },
            }
        ])[0];

        //Red box, for deleting the button. Only shows in customization mode.
        this.editBoxElm2 = elements.createElementsFromJSON([
            {
                element: "div",
                className: "touchControlDeleteBox",
                "data-position": this.side,
                styleProperties: {
                    "--button-x": this.xPos+"%",
                    "--button-y": this.yPos+"%",
                    "--button-width": this.width+"%",
                    "--button-height": this.height+"%",
                },
            }
        ])[0];

        if (this.isJoystick) {
            this.generateJoystickContent();
        }

        if (this.container) {
            this.append(this.container);
        }
    }

    setcssvar (property,value) {
        this.elm.style.setProperty(property,value);
        this.editBoxElm.style.setProperty(property,value);
        this.editBoxElm2.style.setProperty(property,value);
    }

    setInfo (id) {
        var targetId = id || this.id;
        if (this._lastid !== targetId) {
            this._lastid = targetId;
            this.name = KeyName[targetId] || "Unknown";
            this.pressNum = KeyNum[targetId] || 0;
            this.generateElement();
        }   
    }

    append (container) {
        this.elm.remove();
        this.editBoxElm.remove();
        this.editBoxElm2.remove();
        this.container = container;
        container.appendChild(this.elm);
        if (this.editMode) {
            container.appendChild(this.editBoxElm);
            container.appendChild(this.editBoxElm2);
        }
    }

    destroy () {
        this.elm.remove();
        this.editBoxElm.remove();
        this.editBoxElm2.remove();
        this.container = null;
        this.destroyed = true;
    }

    save () {
        return {
            id: this.id,
            side: this.side,
            xPos: this.xPos,
            yPos: this.yPos,
            width: this.width,
            height: this.height,
        };
    }

    editModeProcess (touchPositions, processState) {
        var elm = this.elm;
        var editBox = this.editBoxElm;
        var editBox2 = this.editBoxElm2;

        processState.disableDefault = !!processState.editing;

        if (!processState.editing) {
            if (this.isTouchingFirst(touchPositions, editBox)) {
                processState.resizing = true;
                processState.editing = this.randomId;
                
                // Save initial state
                processState.startWidth = this.width;
                processState.startHeight = this.height;
                processState.startX = touchPositions[0].left;
                processState.startY = touchPositions[0].top;
            }
            if (this.isTouchingFirst(touchPositions, editBox2) && !processState.editing) {
                this.destroy();
                this.remove = true;
                return;
            }
            if (this.isTouchingFirst(touchPositions, elm) && !processState.editing) {
                processState.resizing = false;
                processState.editing = this.randomId;
                var bounding = elm.getBoundingClientRect();

                var anchorX = bounding.left; 
                var anchorY = bounding.bottom;

                var diffX = touchPositions[0].left - anchorX;
                var diffY = touchPositions[0].top - anchorY;

                if (this.side == "left") {
                    processState.offsetX = diffX; 
                } else {
                    processState.offsetX = -diffX;
                }

                processState.offsetY = diffY;
            }
        }
        if (processState.editing == this.randomId) {
            if (touchPositions.length == 0) {
                processState.editing = null;
                return;
            }
            var position = touchPositions[0];
            var newX = position.left - processState.offsetX;
            var newY = position.top - processState.offsetY;
            

            if (processState.resizing) {
                var deltaX = position.left - processState.startX;
                var deltaY = position.top - processState.startY;

                var percentDelta = TouchControlButton.calculatePercentSize(deltaX, deltaY);

                if (this.side == "left") {
                    this.width = Math.max(5, processState.startWidth + percentDelta.percentX);
                } else {
                    this.width = Math.max(5, processState.startWidth - percentDelta.percentX);
                }

                this.height = Math.max(5, processState.startHeight - percentDelta.percentY);
            } else {
                var percentSize = TouchControlButton.calculatePercentSize(newX, newY);
                percentSize.percentY = 100-percentSize.percentY;
                this.xPos = percentSize.percentX;
                this.yPos = percentSize.percentY;
            }
            this.setcssvar("--button-x", this.xPos + "%");
            this.setcssvar("--button-y", this.yPos + "%");
            this.setcssvar("--button-width", this.width + "%");
            this.setcssvar("--button-height", this.height + "%");
        
            elm.setAttribute("data-touching", "");
        } else {
            elm.removeAttribute("data-touching");
        }
    }

    process (touchPositions, processState) {
        this.resizeJoystick();
        var elm = this.elm;

        if (KeyNum[this.id] == KeyNum.UI_SHOW_KEYBOARD) {
            this.elm.textContent = keyboardIsActive() ? "Hide touch keyboard" : "Show touch keyboard";
        }
        if (this.editMode) {
            this.editModeProcess(touchPositions, processState);
            return;
        }

        processState.disableDefault = true;

        if (this.isJoystick && (processState.touchingJoystick == this.randomId || !processState.touchingJoystick)) {
            this.handleJoystick(touchPositions, processState);
            return;
        }

        if (this.isJoystick) {
            return;
        }

        if (this.isTouchingOneOf(touchPositions)) {
            if (!this._justPressed) {
                sendInput(this.id, true);
                elm.setAttribute("data-touching", "");
                this._justPressed = true;
            }
        } else {
            if (this._justPressed) {
                sendInput(this.id, false);
                elm.removeAttribute("data-touching");
                this._justPressed = false;
            }
        }
    }
}

module.exports = {
    TouchControlButton
};
