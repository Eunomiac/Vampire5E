module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "parser": "babel-eslint",
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
        ]
    },
    "globals": {
        "START": true,
        "D": true,
        "Chars": true,
        "Images": true,
        "DragPads": true,
        "ChatFuncs": true,
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
        "arguments": true
    }
};