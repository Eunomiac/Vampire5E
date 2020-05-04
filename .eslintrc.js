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
        "class-methods-use-this": "warn",
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
        "lines-between-class-members": 0,
        "max-classes-per-file": 0,
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
        "no-useless-constructor": "warn",
        "no-useless-escape": 0,
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
            "always",
            { "omitLastInOneLineBlock": true }
        ]
    },
    "globals": {
        "START": "readonly",
        "SCRIPTS": "readonly",
        "C": "readonly",
        "D": "readonly",
        "Listener": "readonly",
        "Char": "readonly",
        "Chat": "readonly",
        "Assets": "readonly",
        "Media": "readonly",
        "DragPads": "readonly",
        "Handouts": "readonly",
        "Roller": "readonly",
        "Complications": "readonly",
        "Session": "readonly",
        "Player": "readonly",
        "Fuzzy": "readonly",
        "Tester": "readonly",
        "TimeTracker": "readonly",
        "Soundscape": "readonly",
        "InitCommands": "readonly",
        "_": "readonly",
        "state": "writable",
        "getAttrs": "readonly",
        "setAttrs": "readonly",
        "getSectionIDs": "readonly",
        "getObj": "readonly",
        "findObjs": "readonly",
        "filterObjs": "readonly",
        "getAllObjs": "readonly",
        "getAttrByName": "readonly",
        "removeRepeatingRow": "readonly",
        "Campaign": "readonly",
        "playerIsGM": "readonly",
        "on": "readonly",
        "log": "readonly",
        "createObj": "readonly",
        "console": "readonly",
        "spawnFxWithDefinition": "readonly",
        "sendChat": "readonly",
        "toBack": "readonly",
        "toFront": "readonly",
        "randomInteger": "readonly",
        "setInterval": "readonly",
        "clearInterval": "readonly",
        "getGMID": "readonly",
        "sendChatMessage": "readonly",
        "processStack": "readonly",
        "arguments": "writable",
        "generateRowID": "readonly",
        "MarkStart": "readonly",
        "MarkStop": "readonly"
    },
    "plugins": [
        "babel"
      ]
};