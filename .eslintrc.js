module.exports = {
    "env": {
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 6,
        "ecmaFeatures": {
            "impliedStrict": true
        }
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
    },
    "rules": {
        "no-sparse-arrays": "off",
        "no-console": "off",
        "no-async-promise-executor": "error",
        "no-await-in-loop": "error",
        "no-extra-parens": ["error", "all", {
            "nestedBinaryExpressions": false
        }],
        "no-misleading-character-class": "error",
        "no-prototype-builtins": "error",
        "no-template-curly-in-string": "error",
        "require-atomic-updates": "error",
        "valid-jsdoc": "error",

        "accessor-pairs": "error",
        "array-callback-return": "error",
        "block-scoped-var": "error",
        "class-methods-use-this": "error",
        //"complexity": ["warn", 20],
        "consistent-return": "error",
        "curly": ["error", "multi-or-nest", "consistent"],
        "default-case": ["error", {
            "commentPattern": "^skip\\sdefault"
        }],
        "dot-location": ["error", "property"],
        "dot-notation": "error",
        "eqeqeq": "error",
        //"guard-for-in": "warn",
        "no-alert": "warn",
        "no-caller": "error",
        "no-div-regex": "error",
        "no-else-return": "error",
        "no-empty-function": "error",
        "no-eq-null": "error",
        "no-eval": "error",
        "no-extend-native": "error",
        "no-extra-bind": "error",
        "no-extra-label": "error",
        "no-floating-decimal": "error",
        "no-implicit-coercion": "error",
        "no-implicit-globals": "off",
        "no-implied-eval": "error",
        "no-invalid-this": "error",
        "no-iterator": "error",
        "no-labels": "error",
        "no-lone-blocks": "error",
        "no-loop-func": "error",
        //"no-magic-numbers": ["warn", { "ignoreArrayIndexes": true, "ignore": [-5, -2, -1, 0, 0.5, 1, 2, 5, 10, 100, 1000] }],
        "no-multi-spaces": ["error", {
            "ignoreEOLComments": true,
        }],
        "no-multi-str": "error",
        "no-new": "error",
        "no-new-func": "error",
        "no-new-wrappers": "error",
        "no-octal-escape": "error",
        "no-param-reassign": "error",
        "no-proto": "error",
        "no-return-assign": "error",
        "no-return-await": "error",
        "no-script-url": "error",
        "no-self-compare": "error",
        "no-sequences": "error",
        "no-throw-literal": "error",
        "no-unmodified-loop-condition": "error",
        //"no-unused-expressions": ["error", {"allowShortCircuit": true, "allowTernary": true, "allowTaggedTemplates": true}],
        "no-unused-vars": "warn",
        "no-useless-call": "error",
        "no-useless-concat": "error",
        "no-useless-return": "error",
        "no-void": "error",
        "no-warning-comments": "error",
        "prefer-promise-reject-errors": "error",
        "radix": ["error", "as-needed"],
        "require-await": "error",
        "require-unicode-regexp": "error",
        "vars-on-top": "warn",
        "wrap-iife": ["error", "inside"],
        "yoda": "error",
        "strict": "error",
        "init-declarations": ["error", "always"],
        "no-label-var": "error",
        "no-shadow": "error",
        "no-undef-init": "error",
        "no-use-before-define": "error",
        "callback-return": "error",
        "handle-callback-err": "error",
        "no-buffer-constructor": "error",
        "no-mixed-requires": "error",
        "no-new-require": "error",
        "no-path-concat": "error",
        "no-process-env": "error",
        "no-process-exit": "error",
        "no-sync": "error",

        "array-bracket-newline": ["error", "consistent"],
        "array-bracket-spacing": ["error", "never"],
        "array-element-newline": ["error", "consistent"],
        "block-spacing": ["error", "always"],
        "brace-style": ["error", "1tbs", {
            "allowSingleLine": true
        }],
        "camelcase": "off",
        //"camelcase": ["error", {"properties": "never", "ignoreDestructuring": true}],
        //"capitalized-comments": ["error", "always", {"ignoreConsecutiveComments": true}],
        "comma-dangle": ["error", "only-multiline"],
        "comma-spacing": ["error", {
            "before": false,
            "after": true
        }],
        "comma-style": ["error", "last"],
        "computed-property-spacing": ["error", "never"],
        "consistent-this": ["error", "that"],
        "eol-last": ["error", "never"],
        "func-call-spacing": ["error", "never"],
        "func-name-matching": "error",
        "func-names": ["error", "as-needed"],
        "func-style": ["error", "expression", {
            "allowArrowFunctions": true
        }],
        "function-paren-newline": ["error", "consistent"],
        "id-blacklist": ["error", "data", "err", "e", "cb", "callback"],
        "id-length": ["error", {
            "min": 3,
            "max": 14,
            "properties": "never",
            "exceptions": ["v", "v1", "v2", "k", "kv", "i", "j", "gN", "p", "pI", "pV", "pR", "D", "FX", "a", "b", "id"]
        }],
        "implicit-arrow-linebreak": ["error", "beside"],
        "indent": ["warn", "tab"],
        "key-spacing": ["error", {
            "beforeColon": false
        }],
        "keyword-spacing": ["error", {
            "before": true,
            "after": true
        }],
        "linebreak-style": ["error", "windows"],
        "lines-around-comment": ["error", {
            "beforeBlockComment": true,
            "allowBlockStart": true
        }],
        "max-len": ["error", {
            "code": 120,
            "ignoreUrls": true,
            "ignoreStrings": true,
            "ignoreTemplateLiterals": true,
            "ignoreRegExpLiterals": true,
            "ignorePattern": "^.*?D\.(Alert|ThrowError|Log|DB)"
        }],
        "max-statements-per-line": ["error", {
            "max": 3
        }],
        "multiline-comment-style": ["error", "bare-block"],
        "multiline-ternary": ["error", "always-multiline"],
        //No idea how to get the regex to match.
        //"new-cap": ["warn", {"newIsCap": true, "capIsNewExceptions": ["Campaign"], "capIsNewExceptionPattern": "\bD\.[A-Z]", "properties": "never" }],
        //"D\.[A-Z][^\\s\\d]*?(\\../g" }],
        //("D\.[A-Z].*?\(\gu)") }],
        "no-mixed-spaces-and-tabs": ["error", "smart-tabs"],
        "no-multi-assign": "error",
        "no-multiple-empty-lines": ["error", {
            "max": 2
        }],
        "no-negated-condition": "error",
        "no-new-object": "error",
        "no-trailing-spaces": "error",
        "no-unneeded-ternary": "error",
        "no-whitespace-before-property": "error",
        //"nonblock-statement-body-position": ["error", "beside", { "overrides": { "while": "below", "for": "below", "do": "below" } }],
        "nonblock-statement-body-position": ["error", "below"],
        "new-parens": "error",
        "newline-per-chained-call": ["error", {
            "ignoreChainWithDepth": 3
        }],
        "no-array-constructor": "error",
        "no-bitwise": "error",
        "no-continue": "error",
        "no-lonely-if": "error",
        "object-curly-newline": ["error", {
            "consistent": true
        }],
        "object-curly-spacing": ["error", "never", {
            "objectsInObjects": true
        }],
        "one-var": ["error", "always"],
        "one-var-declaration-per-line": ["error", "initializations"],
        "operator-assignment": ["error", "always"],
        "operator-linebreak": ["error", "after"],
        "padded-blocks": ["error", "never"],
        "padding-line-between-statements": ["error", {
            blankLine: "always",
            prev: "*",
            next: "return"
        }],
        "prefer-object-spread": "error",
        "quote-props": ["error", "consistent-as-needed"],
        "quotes": ["error", "double", {
            "avoidEscape": false
        }],
        "semi": ["error", "never"],
        "semi-spacing": ["error", {
            "before": false,
            "after": true
        }],
        "semi-style": ["error", "last"],
        "space-before-blocks": ["error", {
            "functions": "always",
            "keywords": "always",
            "classes": "always"
        }],
        "space-before-function-paren": "error",
        "space-in-parens": ["error", "never", {
            "exceptions": ["{}", "[]"]
        }],
        "space-infix-ops": "error",
        "space-unary-ops": ["error", {
            "words": true,
            "nonwords": false
        }],
        "spaced-comment": ["error", "always"],
        "switch-colon-spacing": ["error", {
            "after": true,
            "before": false
        }],
        "template-tag-spacing": ["error", "never"],
        "wrap-regex": "error",

        "arrow-body-style": ["error", "as-needed"],
        "arrow-parens": ["error", "as-needed"],
        "arrow-spacing": ["error", {
            "before": true,
            "after": true
        }],
        "generator-star-spacing": ["error", {
            "before": true,
            "after": false
        }],
        //"no-confusing-arrow": ["error", {"allowParens": true}],
        "no-useless-computed-key": "error",
        "no-useless-constructor": "error",
        "no-useless-rename": "error",
        "no-var": "error",
        "object-shorthand": "error",
        "prefer-const": "error",
        "prefer-destructuring": ["error", {
            "array": true,
            "object": true
        }],
        "prefer-numeric-literals": "error",
        "prefer-rest-params": "error",
        "prefer-spread": "error",
        "prefer-template": "error",
        "rest-spread-spacing": ["error", "never"],
        "symbol-description": "error",
        "template-curly-spacing": ["error", "never"],
        "yield-star-spacing": ["error", {
            "before": true,
            "after": false
        }]
    }
};