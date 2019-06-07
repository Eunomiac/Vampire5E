module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2017,
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "never"
        ],
		"no-mixed-spaces-and-tabs": [
			"error",
			"smart-tabs"
		]
    },
    "globals": {
        "START": true,
        "D": true,
        "Char": true,
        "Player": true,
        "Session": true,
        "Images": true,
        "DragPads": true,
        "Chat": true,
        "Roller": true,
        "TimeTracker": true,
        "_": false,
        "state": true,
        "getAttrs": false,
        "setAttrs": false,
        "getSectionIDs": false,
        "getObj": false,
        "findObjs": false,
        "filterObjs": false,
        "getAllObjs": false,
        "getAttrByName": false,
        "removeRepeatingRow": false,
        "Campaign": false,
        "playerIsGM": false,
        "on": false,
        "log": false,
        "createObj": false,
        "console": false,
        "spawnFxWithDefinition": false,
        "sendChat": false,
        "toBack": false,
        "toFront": false,
        "randomInteger": false,
        "setInterval": false,
        "clearInterval": false,
        "getGMID": false,
        "sendChatMessage": false,
        "arguments": true,
        "generateRowID": false,
        "MarkStart": true,
        "MarkStop": true
    }
};