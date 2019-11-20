module.exports = {
    "parser": "babel-eslint",
    "env": {
      "es6": true,
      "browser": true,
      "commonjs": true,
      "jest": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "eslint-config-prettier",
        "airbnb",
        "prettier"
      ],
      "parserOptions": {
        "ecmaVersion": 2017,
        "sourceType": "module",
        "allowImportExportEverywhere": false,
        "codeFrame": false,
        "ecmaFeatures": {
            "jsx": false,
            "impliedStrict": true
        }
      },
    "rules": {
        "dot-location": ["error", "object"],
        "accessor-pairs": ["error"],
        "array-callback-return": "error",
        "babel/no-invalid-this": 1,
        "babel/no-unused-expressions": 1,  
        "babel/object-curly-spacing": 1,
        "babel/quotes": 1,
        "block-scoped-var": "error",
        "class-methods-use-this": "error",
        "consistent-return": "error",
        "curly": ["error", "multi", "consistent"],
        "default-case": "error",
        "dot-notation": ["error", { "allowKeywords": false }],
        "eqeqeq": ["error", "always"],
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
        "linebreak-style": [
            "error",
            "windows"
        ],
        "no-console": 0,
        "no-continue": 0,
        "no-debugger": "warn",
        "no-else-return": "off",
        "no-empty-function": "warn",
        "no-eq-null": "error",
        "no-eval": "error",
        "no-extra-bind": "warn",
        "no-extra-parens": ["error", "all", { "conditionalAssign": false }],
        "no-floating-decimal": "error",
        "no-implicit-coercion": "error",
        "no-implicit-globals": "error",
        "no-implied-eval": "error",
        "no-invalid-this": "error",
        "no-iterator": "error",
        "no-labels": "error",
        "no-lone-blocks": "warn",
        "no-lonely-if": 0,
        "no-loop-func": "error",        
		"no-mixed-spaces-and-tabs": [
			"error",
			"smart-tabs"
		],
        "no-multi-spaces": "error",
        "no-multi-str": "error",
        "no-new": "error",
        "no-param-reassign": 0,
        "no-plusplus": 0,
        "no-restricted-syntax": 0,
        "no-restricted-globals": 0,
        "no-template-curly-in-string": "warn",
        "no-underscore-dangle": 0,
        "no-unreachable": 0,
        "no-unused-vars": "warn",
        "no-use-before-define": 0,
        "no-useless-computed-key": 0,
        //"no-magic-numbers": ["warn", { "ignoreArrayIndexes": true, "ignore": [0, 1], "enforceConst": true } ],
        "no-void": 0,
        "one-var": ["error", "consecutive"],
        "prefer-const": ["error", {"destructuring": "all"}],
        "prefer-object-spread": 0,
        "quotes": [
            "error",
            "double"
        ],
        "radix": 0,
        "semi": [
            "error",
            "never",
            { "beforeStatementContinuationChars": "never" }
        ]
    },
    "globals": {
        "START": true,
        "C": true,
        "D": true,
        "Listener": true,
        "Char": true,
        "Chat": true,
        "Media": true,
        "DragPads": true,
        "Handouts": true,
        "Roller": true,
        "Complications": true,
        "Session": true,
        "Player": true,
        "Fuzzy": true,
        "Tester": true,
        "TimeTracker": true,
        "Roll20AM": true,
        "InitCommands": true,
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
    },
    "plugins": [
        "babel"
      ]
};