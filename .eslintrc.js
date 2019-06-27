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
        "complexity": ["warn", 50],
        "indent": [
            "error",
            4,
            { 
                "SwitchCase": 1,
                "VariableDeclarator": 1,
                "outerIIFEBody": 1,
                "MemberExpression": 1,
                "ObjectExpression": "first",
                "FunctionDeclaration": { parameters: "first", body: 1 },
                "CallExpression": { arguments: "first" },
                "ArrayExpression": "first",
                "ignoreComments": true/*,
                "flatTernaryExpression": false*/
            }
        ],
        "dot-location": ["error", "object"],
        "dot-notation": ["error", { "allowKeywords": false }],
        "no-extra-parens": "error",
        "no-template-curly-in-string": "warn",
        "accessor-pairs": ["error", { "getWithoutSet": true }],
        "array-callback-return": "error",
        "block-scoped-var": "error",
        "class-methods-use-this": "error",
        "consistent-return": "error",
        "curly": ["error", "multi", "consistent"],
        "default-case": "error",
        "eqeqeq": ["error", "always"],
        "no-else-return": "off",
        "no-empty-function": "warn",
        "no-eq-null": "error",
        "no-eval": "error",
        "no-extra-bind": "warn",
        "no-floating-decimal": "error",
        "no-implicit-coercion": "error",
        "no-unused-vars": "warn",
        "no-implicit-globals": "error",
        "no-implied-eval": "error",
        "no-invalid-this": "error",
        "no-iterator": "error",
        "no-labels": "error",
        "no-lone-blocks": "warn",
        "no-loop-func": "error",
        "no-magic-numbers": ["warn", { "ignoreArrayIndexes": true, "ignore": [0, 1], "enforceConst": true } ],
        "no-multi-spaces": "error",
        "no-multi-str": "error",
        "no-new": "error",
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
            "never",
            { "beforeStatementContinuationChars": "never" }
        ],
		"no-mixed-spaces-and-tabs": [
			"error",
			"smart-tabs"
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