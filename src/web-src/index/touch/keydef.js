//////////////////////////////////////////////////////////////

var KeyNum = {
	//Purely custom key numbers, not used by the C logic, but are added to keep the UI for them consistent with the rest of the controls:
	UI_SHOW_KEYBOARD: 1000,
	UI_JOYSTICK: 1001,

	///////////////////////////////////////////
	//Source: g_input.h

    GC_NULL: 0, // a key/button mapped to GC_NULL has no effect
	GC_FORWARD: 1,
	GC_BACKWARD: 2,
	GC_STRAFELEFT: 3,
	GC_STRAFERIGHT: 4,
	GC_TURNLEFT: 5,
	GC_TURNRIGHT: 6,
	GC_WEAPONNEXT: 7,
	GC_WEAPONPREV: 8,
	GC_WEPSLOT1: 9,
	GC_WEPSLOT2: 10,
	GC_WEPSLOT3: 11,
	GC_WEPSLOT4: 12,
	GC_WEPSLOT5: 13,
	GC_WEPSLOT6: 14,
	GC_WEPSLOT7: 15,
	GC_WEPSLOT8: 16,
	GC_WEPSLOT9: 17,
	GC_WEPSLOT10: 18,
	GC_FIRE: 19,
	GC_FIRENORMAL: 20,
	GC_TOSSFLAG: 21,
	GC_SPIN: 22,
	GC_CAMTOGGLE: 23,
	GC_CAMRESET: 24,
	GC_LOOKUP: 25,
	GC_LOOKDOWN: 26,
	GC_CENTERVIEW: 27,
	GC_MOUSEAIMING: 28, // mouse aiming is momentary (toggleable in the menu)
	GC_TALKKEY: 29,
	GC_TEAMKEY: 30,
	GC_SCORES: 31,
	GC_JUMP: 32,
	GC_CONSOLE: 33,
	GC_PAUSE: 34,
	GC_SYSTEMMENU: 35,
	GC_SCREENSHOT: 36,
	GC_RECORDGIF: 37,
	GC_VIEWPOINTNEXT: 38,
	GC_VIEWPOINTPREV: 39,
	GC_CUSTOM1: 40, // Lua scriptable
	GC_CUSTOM2: 41, // Lua scriptable
	GC_CUSTOM3: 42, // Lua scriptable
};

//////////////////////////////////////////////////////////////

var KeyName = {
	//Purely custom key names, not used by C logic, but are added to keep the UI for them consistent with the rest of the controls:
	UI_SHOW_KEYBOARD: "Toggle touch keyboard",
	UI_JOYSTICK: "Virtual joystick",

	///////////////////////////////////////////
	//Source: m_menu.c

    //GC_NULL: "Nothing",
    GC_FORWARD: "Move Forward (Up)",
	GC_BACKWARD: "Move Backward (Down)",
	GC_STRAFELEFT: "Move Left (Left)",
	GC_STRAFERIGHT: "Move Right (Right)",
	GC_JUMP: "Jump (Select)",
	GC_SPIN: "Spin (Back)",

	GC_LOOKUP: "Look Up",
	GC_LOOKDOWN: "Look Down",
	GC_TURNLEFT: "Look Left",
	GC_TURNRIGHT: "Look Right",
	GC_CENTERVIEW: "Center View",
	GC_MOUSEAIMING: "Toggle Mouselook",
	GC_CAMTOGGLE: "Toggle Third-Person",
	GC_CAMRESET: "Reset Camera",

	GC_PAUSE: "Pause / Run Retry",
	GC_SCREENSHOT: "Screenshot",
	GC_RECORDGIF: "Toggle GIF Recording",
	GC_SYSTEMMENU: "Open/Close Menu (ESC)",
	GC_VIEWPOINTNEXT: "Next Viewpoint",
	GC_VIEWPOINTPREV: "Prev Viewpoint",
	GC_CONSOLE: "Console",

	GC_TALKKEY: "Talk",
	GC_TEAMKEY: "Talk (Team only)",

	GC_FIRE: "Fire",
	GC_FIRENORMAL: "Fire Normal",
	GC_TOSSFLAG: "Toss Flag",
	GC_WEAPONNEXT: "Next Weapon",
	GC_WEAPONPREV: "Prev Weapon",
	GC_WEPSLOT1: "Normal / Infinity",
	GC_WEPSLOT2: "Automatic",
	GC_WEPSLOT3: "Bounce",
	GC_WEPSLOT4: "Scatter",
	GC_WEPSLOT5: "Grenade",
	GC_WEPSLOT6: "Explosion",
	GC_WEPSLOT7: "Rail",

	GC_CUSTOM1: "Custom Action 1",
	GC_CUSTOM2: "Custom Action 2",
	GC_CUSTOM3: "Custom Action 3",
};

//////////////////////////////////////////////////////////////

function getButtonLabels() {
	return Object.keys(KeyName).map(key => {
		return {id: key, label: KeyName[key]};
	});
}

//////////////////////////////////////////////////////////////

module.exports = {
    KeyNum,
    KeyName,
	getButtonLabels
};