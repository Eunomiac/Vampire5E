﻿void MarkStart("D");
/* DATA.js, "D".  Exposed as "D" in the API sandbox.
   >>> DATA is both a library of handy resources for other scripts to use, and a master configuration file for your
   game.  You can find a list of all of the available methods at the end of the script.  Configuration is a bit
   trickier, but is contained in the CONFIGURATION and DECLARATIONS #regions. */

const D = (() => {
    // #region ▒░▒░▒░▒[FRONT] Boilerplate Namespacing & Initialization ▒░▒░▒░▒ ~
    const SCRIPTNAME = "D";

    // #region COMMON INITIALIZATION
    const STATE = {
        get REF() {
            return C.RO.OT[SCRIPTNAME];
        }
    };
    const VAL = (varList, funcName, isArray = false) => D.Validate(varList, funcName, SCRIPTNAME, isArray);
    const DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME);
    const LOG = (msg, funcName) => D.Log(msg, funcName, SCRIPTNAME);
    const THROW = (msg, funcName, errObj) => D.ThrowError(msg, funcName, SCRIPTNAME, errObj);

    const checkInstall = () => {
        C.RO.OT[SCRIPTNAME] = C.RO.OT[SCRIPTNAME] || {};
        initialize();
    };
    // #endregion

    // #region LOCAL INITIALIZATION
    const initialize = () => {
        STATE.REF.isFullDebug = false;
        STATE.REF.isThrottlingStackLog = false;
        STATE.REF.RULESREFERENCE = STATE.REF.RULESREFERENCE || {};
        STATE.REF.WATCHLIST = STATE.REF.WATCHLIST || [];
        STATE.REF.BLACKLIST = STATE.REF.BLACKLIST || [];
        STATE.REF.CHARWIDTH = STATE.REF.CHARWIDTH || {};
        STATE.REF.AlertLineLength = STATE.REF.AlertLineLength || 50;
        STATE.REF.DEBUGLOG = STATE.REF.DEBUGLOG || [];
        STATE.REF.ALERTTHROTTLE = [];
        STATE.REF.flexSpace = STATE.REF.flexSpace || 10.0;
        STATE.REF.isReportingListener = STATE.REF.isReportingListener || false;
        STATE.REF.FuncQueueName = STATE.REF.FuncQueueName || [];
        STATE.REF.MissingTextChars = STATE.REF.MissingTextChars || [];
        STATE.REF.TRACELOG = [];
        STATE.REF.TRACENESTCOUNTER = 0;
        STATE.REF.TRACESTARTTIME = 0;
        STATE.REF.TRACELOGSTOPS = {};
        STATE.REF.ISFORCINGDEBUGGING = STATE.REF.ISFORCINGDEBUGGING === true;
        STATE.REF.TRACELASTTIME = 0;
        STATE.REF.SessionNotes = STATE.REF.SessionNotes || [];

        // Initialize STATSDICT Fuzzy Dictionary
        try {
            STATE.REF.STATSDICT = Fuzzy.Fix();
            for (const str of [
                ..._.flatten(_.values(C.ATTRIBUTES)),
                ..._.flatten(_.values(C.SKILLS)),
                ...Object.keys(C.DISCIPLINES),
                ...C.TRACKERS,
                ...C.MISCATTRS
            ])
                STATE.REF.STATSDICT.add(str);

            // Initialize PCDICT Fuzzy Dictionary and PCLIST Strict Lookup
            STATE.REF.PCDICT = Fuzzy.Fix();
            STATE.REF.PCLIST = [];
            for (const name of _.values(Char.REGISTRY).map((x) => x.name)) {
                STATE.REF.PCDICT.add(name);
                STATE.REF.PCLIST.push(name);
            }

            // Initialize NPCDICT Fuzzy Dictionary
            STATE.REF.NPCDICT = Fuzzy.Fix();
            STATE.REF.NPCLIST = [];
            for (const name of getChars("all")
                .map((x) => x.get("name"))
                .filter(
                    (x) => !_.values(Char.REGISTRY)
                        .map((xx) => xx.name)
                        .includes(x)
                )) {
                STATE.REF.NPCDICT.add(name);
                STATE.REF.NPCLIST.push(name);
            }
        } catch (errObj) {
            THROW("Initialization Error", "Initialize", errObj);
        }

        if (STATE.REF.MissingTextChars.length)
            D.Alert(`Missing Character Widths for: '<b>${D.JSL(STATE.REF.MissingTextChars.join(""))}</b>'`, "DATA: Text Widths");
    };
    // #endregion

    // #region EVENT HANDLERS: (HANDLEINPUT)
    const onChatCall = (call, args, objects, msg) => {
        switch (call) {
            case "!note": {
                if (args.length) {
                    const [noteCategory, noteString] = (msg.content.match(/^!note *(?:!([^ ]*))? *(.*)$/u) || []).slice(1);
                    STATE.REF.SessionNotes.push({
                        category: noteCategory || "general",
                        time: TimeTracker.GetRealDate().getTime(),
                        content: _.escape(noteString)
                    });
                } else {
                    D.Alert([
                        "<h3>Note-Taking Syntax</h3>",
                        "<b>!note &lt;text&gt;</b> --- Simple note, general category",
                        "<b>!note !&lt;category&gt; &lt;text&gt;</b> --- Add '!category' to categorize"
                    ].join("<br>"), "!note");
                }
                break;
            }
            case "!data": {
                switch (D.LCase((call = args.shift()))) {
                    case "add":
                    case "set": {
                        switch (D.LCase((call = args.shift()))) {
                            case "blacklist":
                                setBlackList(args);
                                break;
                            case "watch":
                            case "dbwatch":
                            case "watchlist":
                                setWatchList(args);
                                break;
                            case "flex":
                                STATE.REF.flexSpace = D.Float(args.shift(), 2);
                                break;
                            case "linewidth":
                                STATE.REF.AlertLineLength = D.Int(args.pop());
                                break;
                            case "fulldebug":
                                if (args[0] === "true") {
                                    STATE.REF.isThrottlingStackLog = false;
                                    Handouts.RemoveAll("Stack Log", "stack");
                                    Handouts.RemoveAll("... Stack", "stack");
                                    STACKLOG.length = 0;
                                } else {
                                    getStackRecord("... Stack");
                                }
                                STATE.REF.isFullDebug = args[0] === "true";
                                break;
                            // no default
                        }
                        break;
                    }
                    case "get": {
                        switch (D.LCase((call = args.shift()))) {
                            case "traitlookup": {
                                D.Show(C.TRAITLOOKUP);
                                break;
                            }
                            case "notes": {
                                printSessionNotes();
                                break;
                            }
                            case "sites": {
                                sendToGM(jStr(C.SITES));
                                break;
                            }
                            case "stacklog": {
                                sendToGM(jStrH(STACKLOG.join("")), "STACKLOG");
                                break;
                            }
                            case "blacklist":
                                sendToGM(getBlackList(), "DEBUG BLACKLIST");
                                break;
                            case "watch":
                            case "dbwatch":
                            case "watchlist":
                                sendToGM(getWatchList(), "DEBUG SETTINGS");
                                break;
                            case "debug":
                            case "log":
                            case "dblog":
                                getDebugRecord();
                                break;
                            // no default
                        }
                        break;
                    }
                    case "clear":
                    case "reset": {
                        switch (D.LCase((call = args.shift()))) {
                            case "notes": {
                                const sessNum = D.Int(args[0] || STATE.REF.SessionNotesIndex);
                                printSessionNotes(sessNum);
                                delete STATE.REF.SessionNotes[sessNum];
                                break;
                            }
                            case "watch":
                            case "dbwatch":
                            case "watchlist":
                                setWatchList("clear");
                                break;
                            case "blacklist":
                                setBlackList("clear");
                                break;
                            case "debug":
                            case "log":
                            case "dblog":
                                Handouts.RemoveAll("Debug Log", "debug");
                                Handouts.RemoveAll("... DBLog", "debug");
                                STATE.REF.DEBUGLOG = STATE.REF.DEBUGLOG || [];
                                break;
                            case "stack":
                            case "stacklog": {
                                Handouts.RemoveAll("Stack Log", "stack");
                                Handouts.RemoveAll("... Stack", "stack");
                                STACKLOG.length = 0;
                            }
                            // no default
                        }
                        break;
                    }
                    case "refresh": {
                        switch (D.LCase((call = args.shift()))) {
                            case "shortnames": {
                                refreshShortNames();
                                break;
                            }
                            case "tokensrcs": {
                                refreshShortNames();
                                const srcData = {};
                                for (const charObj of D.GetChars("all")) {
                                    const nameKey = getName(charObj, true);
                                    charObj.get("_defaulttoken", (defToken) => {
                                        const imgMatch = D.JS(defToken).match(/imgsrc:(.*?),/u);
                                        if (imgMatch && imgMatch.length)
                                            srcData[nameKey] = imgMatch[1].replace(/med\.png/gu, "thumb.png");
                                    });
                                }
                                setTimeout(() => {
                                    state[C.GAMENAME].Media.TokenSrcs = {};
                                    for (const srcRef of Object.keys(srcData))
                                        state[C.GAMENAME].Media.TokenSrcs[srcRef] = srcData[srcRef];
                                    D.Alert(
                                        `Finished! Media Token Sources updated to:<br><br>${D.JS(state[C.GAMENAME].Media.TokenSrcs)}`,
                                        "!data refresh tokensrcs"
                                    );
                                }, 2000);
                                break;
                            }
                            // no default
                        }
                        break;
                    }
                    case "toggle": {
                        switch (D.LCase((call = args.shift()))) {
                            case "debug": {
                                STATE.REF.ISFORCINGDEBUGGING = !STATE.REF.ISFORCINGDEBUGGING;
                                D.Flag(`Debugging is ${STATE.REF.ISFORCINGDEBUGGING ? "ON" : "OFF"}`);
                                Media.ToggleText("testSessionNotice", STATE.REF.ISFORCINGDEBUGGING);
                                Media.SetText("testSessionNotice", STATE.REF.ISFORCINGDEBUGGING ? "Debugging Forced ON" : `TESTING (${Session.Mode})`);
                                break;
                            }
                            case "trace": {
                                toggleTracing();
                                D.Flag(`Tracing is ${ISTRACING ? "ON" : "OFF"}; Debugging is ${(STATE.REF.ISFORCINGDEBUGGING || !TimeTracker.IsInBlackout()) ? "ON" : "OFF"}`);
                                break;
                            }
                            case "report": {
                                switch (D.LCase((call = args.shift()))) {
                                    case "listen":
                                    case "listener": {
                                        STATE.REF.isReportingListener = !STATE.REF.isReportingListener;
                                        D.Alert(
                                            (STATE.REF.isReportingListener && "Now reporting Listener events.")
                                                || "No longer reporting Listener events.",
                                            "!data toggle report listener"
                                        );
                                        break;
                                    }
                                    // no default
                                }
                                break;
                            }
                            // no default
                        }
                        break;
                    }
                    // no default
                }
                break;
            }
            case "!reply": {
                if (args.length)
                    receivePrompt(args.join(" "), objects);
                else
                    receivePrompt("", objects);
                break;
            }
            // no default
        }
    };
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    let PROMPTFUNC, ISTRACING, TEMPWATCHLIST = [];
    const STACKLOG = [];
    const FUNCSONSTACK = [];
    // #region DECLARATIONS: Reference Variables, Temporary Storage Variables
    const VALS = {
        PAGEID: (pageRef) => {
            // DB({pageRef}, "VALS")
            if (pageRef) {
                if (isID(pageRef))
                    return (getObj("page", pageRef) || {id: false}).id;
                if (_.isString(pageRef)) {
                    if (pageRef in C.PAGES)
                        return C.PAGES[pageRef];
                    const pageObj = (findObjs({_type: "page"}).find((x) => x.get("name") === pageRef) || {id: false}).id;
                    // DB({page: findObjs({_type: "page"}).find(x => x.get("name") === pageRef)}, "VALS")
                    if (pageObj && pageObj.id)
                        return pageObj.id;
                }
                // const object = getChar(pageRef) || Media.GetImg(pageRef) || Media.GetTokens(pageRef).pop() || Media.GetAnim(pageRef) || Media.GetText(pageRef)
                if (VAL({object: pageRef}))
                    return pageRef.get("_pageid");
            }
            return getObj("page", D.GetPlayer(D.GMID()).get("_lastpage")).id;
        },
        CELLSIZE: (pageRef) => C.PIXELSPERSQUARE * (getObj("page", VALS.PAGEID(pageRef)) || {get: () => 70}).get("snapping_increment")
    };
    const FunctionQueue = {};
    const ISRUNNINGQUEUE = {};
    const WAITINGQUEUES = [];
    // #endregion

    // #region DECLARATIONS: Dependent Variables
    const ALLSTATS = [..._.flatten(_.values(C.ATTRIBUTES)), ..._.flatten(_.values(C.SKILLS)), ...Object.keys(C.DISCIPLINES), ...C.TRACKERS];
    // #endregion

    // #region CLASS DEFINITIONS
    class Button {
        constructor(name, command, styles = {}) {
            this.name = name;
            this.command = command;
            this.styles = styles;
        }

        get name() {
            return this._name;
        }

        set name(v) {
            if (VAL({string: v}))
                this._name = v;
            else
                this._name = this._name || _.escape("<BTN>");
        }

        get command() {
            return this._command;
        }

        set command(v) {
            if (VAL({string: v}))
                this._command = v;
            else
                this._command = this._command || _.escape(`[Button '${this.name}'] Invalid Command`);
        }

        get styles() {
            return this._styles;
        }

        set styles(v) {
            if (VAL({list: v}))
                this._styles = v;
            else
                this._styles = this._styles || {};
        }

        get HTML() {
            return C.HTML.Button(this.name, this.command, this.styles);
        }
    }
    // #endregion

    // #region ASYNC FUNCTION HANDLING: Function Queing, Running & Interval Functions
    const isFuncQueueClear = (queueName) => {
        if (!FunctionQueue[queueName])
            FunctionQueue[queueName] = [];
        return !ISRUNNINGQUEUE[queueName] && FunctionQueue[queueName].length === 0;
    };
    const queueFunc = (func, args = [], queueName = "main", waitAfterSecs = 2) => {
        if (ISRUNNINGQUEUE[queueName]) {
            DB(`Attempt to add <b>${func.name}</b> to running <b>${queueName}</b>`, "queueFunc");
            return false;
        }
        try {
            if (VAL({function: func, array: args})) {
                const funcWrapper = (cback) => {
                    func(...args);
                    setTimeout(cback, waitAfterSecs * 1000);
                };
                FunctionQueue[queueName] = FunctionQueue[queueName] || [];
                FunctionQueue[queueName].push([funcWrapper, func.name]);
                DB(`QueFunc: ${D.JSL(func)}, ${D.JSL(queueName)}, ${D.JSL(args)}<br><br>${D.JSL(FunctionQueue)}`, "queueFunc");
            } else {
                return THROW(`Invalid function (${D.JSL(func)}) OR Invalid args array (${D.JSL(args)})`, "queueFunc");
            }
        } catch (errObj) {
            return THROW("Error queing function.", "queueFunc", errObj);
        }
        return true;
    };
    const $runFuncQueue = (cback) => {
        const queueName = STATE.REF.FuncQueueName.pop();
        if (!queueName)
            return THROW("Attempt to run function queue without any queue names.", "runFuncQueue");
        DB(`Beginning Function Queue ${queueName}`, "runFuncQueue");
        ISRUNNINGQUEUE[queueName] = true;
        let current = 0;
        const done = (empty, ...args) => {
            const end = () => {
                const newArgs = args ? [].concat(empty, args) : [empty];
                if ([...TEMPWATCHLIST, ...STATE.REF.WATCHLIST].includes("runFuncQueue"))
                    D.Chat(
                        "Storyteller",
                        C.HTML.Block(
                            C.HTML.Header(`Done <b>${queueName}</b>!`, {
                                lineHeight: "30px",
                                height: "30px",
                                margin: "0px",
                                fontFamily: "Candal",
                                fontSize: "10px",
                                fontWeight: "normal"
                            })
                        )
                    );
                ISRUNNINGQUEUE[queueName] = false;
                FunctionQueue[queueName] = [];
                if (cback)
                    cback(...newArgs);
                if (WAITINGQUEUES.length) {
                    const [nextQueueName, nextQueueCBack] = WAITINGQUEUES.shift();
                    runFuncQueue(nextQueueName, nextQueueCBack);
                }
            };
            end();
        };
        const each = (empty, ...args) => {
            if (++current >= FunctionQueue[queueName].length || empty) {
                done(empty, args);
            } else {
                if ([...TEMPWATCHLIST, ...STATE.REF.WATCHLIST].includes("runFuncQueue"))
                    D.Chat(
                        "Storyteller",
                        C.HTML.Block(
                            C.HTML.Body(
                                `<b>${FunctionQueue[queueName][current][1]}</b> (${queueName} ${current + 1} / ${FunctionQueue[queueName].length})`,
                                {
                                    lineHeight: "30px",
                                    height: "30px",
                                    margin: "0px",
                                    fontFamily: "Candal",
                                    fontSize: "10px",
                                    fontWeight: "normal"
                                }
                            )
                        )
                    );
                FunctionQueue[queueName][current][0].apply(undefined, [].concat(args, each));
            }
        };
        if (FunctionQueue[queueName].length)
            FunctionQueue[queueName][0][0](each);
        else
            done(null);
        return true;
    };
    const runFuncQueue = (queueName = "main", cback) => {
        const runningQueues = Object.keys(ISRUNNINGQUEUE).filter((x) => ISRUNNINGQUEUE[x] === true);
        if (ISRUNNINGQUEUE[queueName]) {
            D.Alert(`Attempting to run <b>${queueName}</b>, but it's already running!`, "ERROR: Function Queue");
            return false;
        } else if (runningQueues.length) {
            WAITINGQUEUES.push([queueName, cback]);
            D.Flag(`Delaying ${queueName} for: ${D.JS(runningQueues)}`);
            return false;
        } else {
            STATE.REF.FuncQueueName.push(queueName);
            $runFuncQueue(cback);
            return true;
        }
    };
    const runOnInterval = (func, initArgs = []) => {

    };
    // #endregion

    // #region PARSING & STRING MANIPULATION: Converting data types to strings, formatting strings, converting strings into objects.

    const jsRaw = (data) => _.escape(JSON.stringify(data, undefined, 4)); // Returns stringified, escaped code without other changes.
    const jStrTest = (data, isVerbose = false, isAlwaysBreakingLines = false) => {
        const colorRef = {
            REGIMG: C.COLORS.palegreen,
            DRAGPAD: C.COLORS.palepalegreen,
            REGTEXT: C.COLORS.paleblue,
            TEXTSHADOW: C.COLORS.palepaleblue,
            REGTOKEN: C.COLORS.paleorange,
            REGANIM: C.COLORS.palered,
            UNREGIMG: C.COLORS.darkgreen,
            UNREGTEXT: C.COLORS.darkblue,
            UNREGTOKEN: C.COLORS.orange,
            UNREGANIM: C.COLORS.red,
            CHAR: C.COLORS.brightgold,
            PLAYER: C.COLORS.midgold,
            DATE: C.COLORS.palecyan,
            TRACK: C.COLORS.palemagenta,
            other: C.COLORS.grey
        };
        const objectParser = (obj) => {
            if (isVerbose) // If so, return simple stringified version of any Roll20 object.
                return JSON.stringify(obj, null, 4);
            else // If NOT, return color-coded tag for the object.
                switch (obj.get("type")) {
                    case "graphic": {
                        const name = obj.get("name") || "Unnamed";
                        if (name in Media.IMAGES)
                            return `@@REGIMG-${name}-@@`;
                        else if (name in Media.ANIM)
                            return `@@REGANIM-${name}-@@`;
                        else if (obj.get("represents"))
                            if (name in Media.TOKENS)
                                return `@@REGTOKEN-${name}-@@`;
                            else
                                return `@@UNREGTOKEN-${obj.id}-@@`;
                        const masterImage = getObj("graphic", (_.findWhere(Media.GRAPHICS, {padID: obj.id}) || _.findWhere(Media.GRAPHICS, {partnerID: obj.id}) || {id: false}).id);
                        if (masterImage)
                            return objectParser(masterImage).replace(/^@@.*?-(.*)-@@$/gu, "@@DRAGPAD-$1-@@");
                        return `@@UNREG${obj.get("imgsrc").includes(".webm") ? "ANIM" : "IMG"}-##LINK:"${obj.get("imgsrc")}"${obj.get("left")}, ${obj.get("top")} (${obj.get("width")} x ${obj.get("height")}: ${obj.get("layer")}##-@@`;
                    }
                    case "text": {
                        if (obj.id in Media.TEXTIDS)
                            return `@@REGTEXT-${Media.TEXTIDS[obj.id]}-@@`;
                        const masterText = getObj("text", (_.findWhere(Media.TEXT, {shadowID: obj.id}) || {id: false}).id);
                        if (masterText)
                            return objectParser(masterText).replace(/^@@.*?-(.*)-@@$/gu, "@@TEXTSHADOW-$1-@@");
                        return `@@UNREGTEXT-[${obj.get("layer")}] '${ellipsisText(obj.get("text"), 50)}'-@@`;
                    }
                    case "character": {
                        return `@@CHAR-${name}-@@`;
                    }
                    case "player": {
                        return `@@PLAYER-${obj.get("displayname")}-@@`;
                    }
                    case "jukeboxtrack": {
                        return `@@TRACK-${obj.get("title")}-@@`;
                    }
                    default: {
                        return `@@OTHER-${obj.get("name") || obj.id}-@@`;
                    }
                }
        };
        const replacer = (k, v) => {
            /* REPLACER FUNCTION:
                - Takes (key, val), where 'val' is the value being stringified.
                    - the object in which the key is found becomes the 'this' parameter.
                    - initially, replacer called with empty string as 'key' value.

                - Should return value to be added to JSON string, as follows:
                    - If you return a Number, String, Boolean, or null, the stringified version of that value is used as the property's value.
                    - If you return a Function, Symbol, or undefined, the property is not included in the output.
                    - If you return any other object, the object is recursively stringified, calling the replacer function on each property.
            */
            let returnVal = v;
            // CHECK ONE: ROLL20 OBJECT.
            if (typeof v === "object" && "get" in v && v.get("_type")) {
                return objectParser(v);
            } else if (v instanceof Date) {
                return `@@DATE-${TimeTracker.FormatDate(new Date(v), true, true)}-@@`;
                // } else if (!isVerbose && (k.slice(0, 3).toLowerCase() === "obj" || (v && (v.get || v._type)))) {
                // const type = (v.get && v.get("_type")) || v._type || "O";
                // let name = (v.get && v.get("name")) || v.name || "(Unnamed)";
                // if (name === "(Unnamed)" && type === "text") {
                //     const textString = v.get && v.get("text");
                //     if (textString.length > 15)
                //         name = `${textString.slice(0, 15)}...`;
                //     else if (textString)
                //         name = textString;
                // }
                // returnVal = `@@NAMESTART${typeColor(type)}@@${name}@@NAMEEND@@`;
            } else if (_.isUndefined(v)) {
                returnVal = "<b>&lt;UNDEFINED&gt;</b>";
            } else if (_.isNull(v)) {
                returnVal = "<b>NULL</b>";
            } else if (_.isNaN(v)) {
                returnVal = "<b>&lt;NaN&gt;</b>";
            } else if (_.isFunction(v)) {
                returnVal = "<b>&lt;FUNCTION&gt;</b>";
            } else if (_.isArray(v)) {
                if (!isAlwaysBreakingLines && v.map((x) => replacer(k, x)).join(",&nbsp;").length < 150) {
                    returnVal = `<b>[</b> ${v.map((x) => replacer(k, x)).join(",&nbsp;")} <b>]</b>`.replace(/\[\s+\]/gu, "<b>[]</b>");
                } else {
                    const arrayDelver = (array) => {
                        const returns = [];
                        for (const val of array)
                            returns.push(`<div style="display: block; margin-left: 7px;">${replacer(k, val)},</div>`);
                        return `<b>[</b><div style="display: block; margin-left: 7px;">${returns.join("").slice(0, -7)}</div></div><b>]</b>`;
                    };
                    returnVal = arrayDelver(v);
                }
            } else if (_.isObject(v)) {
                const stringifyTest = `<b>{</b> ${Object.values(kvpMap(v, null, (val, key) => `${key}: ${replacer(k, val)}`)).join(
                    ", "
                )} <b>}</b>`.replace(/\{\s+\}/gu, "<b>{}</b>");
                if (!isAlwaysBreakingLines && stringifyTest.length < 150) {
                    returnVal = stringifyTest;
                } else {
                    const listDelver = (list) => {
                        const returns = [];
                        for (const key of Object.keys(list))
                            returns.push(`<div style="display: block; margin-left: 7px;">${key}: ${replacer(key, list[key])},</div>`);
                        return `<b>{</b><div style="display: block; margin-left: 7px;">${returns.join("").slice(0, -7)}</div></div><b>}</b>`;
                    };
                    returnVal = listDelver(v);
                }
            } else if (_.isNumber(v)) {
                returnVal = v.toString();
            } else if (_.isString(v)) {
                returnVal = `ϙQϙ${v}ϙQϙ`;
            }
            if (_.isString(returnVal))
                returnVal = `${returnVal}`
                    .replace(/[\n\r]/gu, "ϙNϙ")
                    .replace(/<(.*?)>/gu, (x) => x
                        .replace(/"/gu, "ϙHϙ")
                        .replace(/ϙNϙ/gu, "\n")
                        .replace(/\s\s+/gu, " ")) // Hides HTML-code quotes so they aren't replaced AND strips line breaks from inside HTML tags.
                    .replace(/"/gu, "") // Removes all double-quotes.
                    // replace(/[\t\n\r]/gu, "").
                    // replace(/\\/gu, ""). // Strips tabs and escape slashes.
                    .replace(/\n/gu, "<br/>") // Converts line breaks into HTML breaks.
                    .replace(/(\s)\s+/gu, "$1") // Removes excess whitespace.
                    .replace(/\\t/gu, "")
                    .replace(/\\n/gu, "");
            return returnVal;
        };
    };
    const jStr = (data, isVerbose = false, isAlwaysBreakingLines = false) => {
        /* Parses a value of any type via JSON.stringify, and then further styles it for display either
                in Roll20 chat, in the API console log, or both. */
        try {
            const typeColor = (type) => {
                switch (pLowerCase(type)) {
                    case "character":
                        return C.COLORS.brightgold;
                    case "graphic":
                        return C.COLORS.palegreen;
                    case "text":
                        return C.COLORS.paleblue;
                    case "player":
                        return C.COLORS.palepurple;
                    case "date":
                        return C.COLORS.palered;
                    default:
                        return C.COLORS.palegrey;
                }
            };
            const replacer = (k, v) => {
                /* THE REPLACER FUNCTION:
                    The replacer parameter can be either a function or an array.

                    As a function, it takes two parameters: the key and the value being stringified.
                    The object in which the key was found is provided as the replacer's this parameter.

                    Initially, the replacer function is called with an empty string as key representing the object being stringified.
                    It is then called for each property on the object or array being stringified.

                    It should return the value that should be added to the JSON string, as follows:

                        If you return a Number, String, Boolean, or null, the stringified version of that value is used as the property's value.
                        If you return a Function, Symbol, or undefined, the property is not included in the output.
                        If you return any other object, the object is recursively stringified, calling the replacer function on each property.
                */
                let returnVal = v;
                if (v instanceof Date) {
                    returnVal = `@@NAMESTART${typeColor("date")}@@${TimeTracker.FormatDate(new Date(v), true, true)}@@NAMEEND@@`;
                } else if (!isVerbose && (k.slice(0, 3).toLowerCase() === "obj" || (v && (v.get || v._type)))) {
                    const type = (v.get && v.get("_type")) || v._type || "O";
                    let name = (v.get && (v.get("name") || v.get("_displayname"))) || v.name || "(Unnamed)";
                    if (name === "(Unnamed)" && type === "text") {
                        const textString = v.get && v.get("text");
                        if (textString.length > 15)
                            name = `${textString.slice(0, 15)}...`;
                        else if (textString)
                            name = textString;
                    }
                    returnVal = `@@NAMESTART${typeColor(type)}@@${name}@@NAMEEND@@`;
                } else if (v === true) {
                    returnVal = "<span style='display: inline-block; color: darkgreen; padding: 0 5px; background-color: rgba(0, 255, 0, 0.3); font-weight: bold; '>true</span>";
                } else if (v === false) {
                    returnVal = "<span style='display: inline-block; color: red; padding: 0 5px; background-color: rgba(255, 0, 0, 0.3); font-weight: bold; '>false</span>";
                } else if (_.isUndefined(v)) {
                    returnVal = "<b>&lt;UNDEFINED&gt;</b>";
                } else if (_.isNull(v)) {
                    returnVal = "<b>NULL</b>";
                } else if (_.isNaN(v)) {
                    returnVal = "<b>&lt;NaN&gt;</b>";
                } else if (_.isFunction(v)) {
                    returnVal = "<b>&lt;FUNCTION&gt;</b>";
                } else if (_.isArray(v)) {
                    if (!isAlwaysBreakingLines && v.map((x) => replacer(k, x)).join(",&nbsp;").length < 150) {
                        returnVal = `<b>[</b> ${v.map((x) => replacer(k, x)).join(",&nbsp;")} <b>]</b>`.replace(/\[\s+\]/gu, "<b>[]</b>");
                    } else {
                        const arrayDelver = (array) => {
                            const returns = [];
                            for (const val of array)
                                returns.push(`<div style="display: block; margin-left: 7px;">${replacer(k, val)},</div>`);
                            return `<b>[</b><div style="display: block; margin-left: 7px;">${returns.join("").slice(0, -7)}</div></div><b>]</b>`;
                        };
                        returnVal = arrayDelver(v);
                    }
                } else if (_.isObject(v)) {
                    const stringifyTest = `<b>{</b> ${Object.values(kvpMap(v, null, (val, key) => `${key}: ${replacer(k, val)}`)).join(
                        ", "
                    )} <b>}</b>`.replace(/\{\s+\}/gu, "<b>{}</b>");
                    if (!isAlwaysBreakingLines && stringifyTest.length < 150) {
                        returnVal = stringifyTest;
                    } else {
                        const listDelver = (list) => {
                            const returns = [];
                            for (const key of Object.keys(list))
                                returns.push(`<div style="display: block; margin-left: 7px;">${key}: ${replacer(key, list[key])},</div>`);
                            return `<b>{</b><div style="display: block; margin-left: 7px;">${returns.join("").slice(0, -7)}</div></div><b>}</b>`;
                        };
                        returnVal = listDelver(v);
                    }
                } else if (_.isNumber(v)) {
                    returnVal = v.toString();
                } else if (_.isString(v)) {
                    returnVal = `ϙQϙ${v}ϙQϙ`;
                }
                if (_.isString(returnVal))
                    returnVal = `${returnVal}`
                        .replace(/[\n\r]/gu, "ϙNϙ")
                        .replace(/<(.*?)>/gu, (x) => x
                            .replace(/"/gu, "ϙHϙ")
                            .replace(/ϙNϙ/gu, "\n")
                            .replace(/\s\s+/gu, " ")) // Hides HTML-code quotes so they aren't replaced AND strips line breaks from inside HTML tags.
                        .replace(/"/gu, "") // Removes all double-quotes.
                        // replace(/[\t\n\r]/gu, "").
                        // replace(/\\/gu, ""). // Strips tabs and escape slashes.
                        .replace(/\n/gu, "<br/>") // Converts line breaks into HTML breaks.
                        .replace(/(\s)\s+/gu, "$1") // Removes excess whitespace.
                        .replace(/\\t/gu, "")
                        .replace(/\\n/gu, "");
                return returnVal;
            };

            let finalString = JSON.stringify(data, replacer, 4)
                .replace(/ (?= )/gu, "&nbsp;") // Replaces any length of whitespace with one '&nbsp;'
                .replace(/@T@/gu, "&nbsp;&nbsp;&nbsp;&nbsp;") // Converts custom '@T@' tab character to four spaces
                // replace(/\\"/gu, "\""). // Escapes quote marks
                // replace(/(^"*|"*$)/gu, ""). // Removes quote marks from the beginning and end of the string
                // replace(/>&quot;/gu, ">").replace(/&quot;</gu, "<"). // Removes quotes from within entire HTML tags.
                // replace(/&amp;quot;/gu, "\"").
                .replace(/ϙ[A-Z]ϙ\/w/gu, "/w") // Fix whisper.
                .replace(/@@NAMESTART(.*?)@@/gu, "<span style=\"background-color: $1;\"><b>&lt;</b>")
                .replace(/@@NAMEEND@@/gu, "<b>&gt;</b></span>")
                .replace(/ϙHϙ/gu, "\"") // Restores deliberate quotes to HTML code.
                .replace(/ϙQϙ/gu, "&quot;") // Restores quotes everywhere else
                .replace(/ϙNϙ/gu, "\\n") // Restores deliberate line breaks.
                .replace(/$(\n|\s|\t|"|&quot;)*?/gu, "") // Restores deliberate line breaks.
                .replace(/(\n|\s|\t|"|&quot;)*?^/gu, "") // Removes lines that are JUST white space and quotes.
                .replace(/\n/gu, "<br>"); // Replaces line breaks with <br>.
            if (finalString.slice(0, 7) === "\"&quot;")
                finalString = finalString.slice(7);
            if (finalString.slice(-7) === "&quot;\"")
                finalString = finalString.slice(0, -7);
            return finalString;
        } catch (errObj) {
            return `ERROR: ${JSON.stringify(errObj)}`;
        }
    };
    const jStrH = (data) => {
        /* Parses data as above, but removes raw line breaks instead of converting them to <br>.
                Line breaks must be specified in the code with '<br>' to be parsed as such.  */
        if (_.isUndefined(data))
            return _.escape("<UNDEFINED>");
        /* if (VAL({ string: data }))
                data = data.replace(/(\r\n|\n|\r)/gu, " ") */
        return jStr(_.isString(data) ? `${data}`.replace(/<br\/?>/gu, "<br>") : data)
            .replace(/<br\/>/gu, "")
            .replace(/<br>/gu, "<br/>");
    };
    const jStrL = (data) => {
        /* Parses data in a way that is appropriate to the console log, removing line breaks and redundant characters. */
        if (_.isUndefined(data))
            return "<UNDEFINED>";

        return (
            jStrH(data)
                .replace(/(\r\n|\n|\r|<br\/?>)/gu, " ") // Removes all line breaks
                .replace(/(&nbsp;)+/gu, " ") // Converts &nbsp; back to whitespace
                .replace(/(&amp;nbsp;)+/gu, " ") // Converts escaped &nbsp; to whitespace
                .replace(/&quot;/gu, "'") // Converts escaped double-quotes to single-quotes
                .replace(/\\"\\"/gu, "'") // Converts escaped double-quotes to single-quotes
                // replace(/(<b>|<\/b>)/gu, ""). // Removes bold tagging
                .replace(/(<script(\s|\S)*?<\/script>)|(<style(\s|\S)*?<\/style>)|(<!--(\s|\S)*?-->)|(<\/?(\s|\S)*?>)/g, "") // Strips all HTML tags.
                .replace(/&gt;/gu, ">")
                .replace(/&lt;/gu, "<") // Converts < and > back to symbols
                .replace(/"/gu, "")
        ); // Removes all remaining double-quotes
    };
    const jStrC = (data, isShortForm = false, properties = []) => {
        /* Parses data to show all HTML code raw, rather than parsing it for formatting.
				Can override this for specific tags by double-bracketing them (e.g. "<<b>>") */
        if (_.isUndefined(data))
            return _.escape("<UNDEFINED>");

        return `<pre>${_.escape(jStr(data, isShortForm, properties))
            .replace(/&gt;&gt;/gu, ">") // Restores doubled right brackets to code.
            .replace(/&lt;&lt;/gu, "<")}</pre>`; // Restores doubled left brackets to code.
    };
    const jStrX = (data) => {
        const replacer = (match) => {
            const checkReplace = match.replace(/\s+/gu, " ");
            if (checkReplace.length <= STATE.REF.AlertLineLength)
                return checkReplace;
            return match;
        };
        return (
            (JSON.stringify(data, null, "^@") || "")
                .replace(/"(?=.*:)/gu, "")
                .replace(/(\r\n|\n|\r)/gu, "")
                .replace(/((?:\^@)+)/gu, "\n$1")
                .replace(/([^@])\}/gu, "$1\n}")
                .replace(/\^@/gu, "  ")
                // .replace(/(?:\n)\s*([^ \}]{0,5}),?(?=\n)/gu, "$1")
                .replace(/(?:\[(?:[^\[\{\}\]]|\n)*\])|(?:\{(?:[^\[\{\}\]]|\n)*\})/gu, replacer)
                .replace(/\n([^:\n]*:)/gu, "\n<b>$1</b>")
                .replace(/\n/gu, "<br>")
                .replace(/ /gu, "&nbsp;")
        );
    };
    const makeHTMLElement = (element, baseStyles = {}, content, customStyles = {}) => {
        const styles = {...baseStyles, ...customStyles};
        const styleString = `style="${Object.entries(styles).map(([prop, val]) => `${prop}: ${val};`).join(" ")}"`;
        return `<${element} ${styleString}>${content}</${element}>`;
    };
    const pTimeInMS = (timeRef, minForSecs = 60) => { // Converts timeRef to number, multiplies by 1000 if less than minForSecs
        timeRef = D.Float(timeRef, 3);
        return timeRef * (timeRef <= minForSecs ? 1000 : 1);
    };
    const parseArray = (arrayString) => (arrayString ? arrayString.replace(/[\[\]]/gu, "").split(",").map((elem) => (elem.trim ? elem.trim() : elem)) : []);
    const parseParams = (args = "", delim = " ") => {
        const returnVal = _.object(
            (VAL({array: args}) ? args.join(" ") : args)
                .split(new RegExp(`,?${delim}+`, "gu"))
                .filter((x) => x.includes(":"))
                .map((x) => x.trim().split(":").map((xx) => (isNaN(xx) && `${xx}`.trim())
                                                         || (/\./gu.test(xx) ? D.Float(xx) : D.Int(xx))))
        );
        DB(`Args: ${D.JS(args)}<br>Delim: '${D.JS(delim)}'<br>Return: ${D.JS(returnVal)}`, "parseParams");
        return returnVal;
    };
    const parseCharSelect = (call, args) => {
        let charObjs, charIDString;
        if (["registered", "sandbox", "pcs", "npcs"].includes(call.toLowerCase())) {
            charObjs = getChars(call);
            charIDString = call.toLowerCase();
        } else {
            charObjs = _.compact(call.split(",").map((x) => getObj("character", x.trim())));
            charIDString = call;
        }
        if (VAL({charObj: charObjs}, null, true)) {
            // D.Alert("Characters Found!")
            call = args[0] ? args.shift() : call;
        } else {
            charObjs = undefined;
            charIDString = "";
        }
        // D.Alert(`${(charObjs || []).length} Characters Retrieved: ${(charObjs || []).map(x => D.GetName(x)).join("<br>")}<br>Call: ${call}<br>Args: ${args.join(" ")}`)
        return [charObjs, charIDString, call, args];
    };
    const randomString = (length = 10) => {
        const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        return _.sample(characters.split(""), D.Int(length)).join("");
    };
    const summarizeHTML = (htmlString = "") => ((htmlString.match(/.*?>([^<>]+)<.*?/g) || [""]).pop().match(/.*?>([^<>]+)<.*?/) || [""]).pop();
    const pInt = (strRef, isRounding = false) => parseInt(isRounding ? Math.round(parseFloat(strRef) || 0) : strRef) || 0;
    const pFloat = (strRef, sigDigits = false) => (VAL({number: sigDigits}) ? roundSig(parseFloat(strRef) || 0, sigDigits) : parseFloat(strRef))
                                                  || 0;
    const roundSig = (num, digits, isReturningPaddedString = false) => {
        if (VAL({number: digits}) && D.Int(digits) > 0) {
            const returnNum = Math.round(num * 10 ** D.Int(digits)/*  + Number.EPSILON */) / 10 ** D.Int(digits);
            if (isReturningPaddedString)
                if (!`${returnNum}`.includes(".")) {
                    return `${returnNum}.${"0".repeat(digits)}`;
                } else {
                    const decSide = `${returnNum}`.split(".").pop();
                    return `${Math.floor(returnNum)}.${decSide}${"0".repeat(digits - `${decSide}`.length)}`;
                }
            return returnNum;
        }
        return D.Int(num, true);
    };
    const boundNum = (num, minVal, maxVal) => Math.max(Math.min(num, maxVal), minVal);
    const cycleNum = (num, minVal, maxVal) => {
        while (num > maxVal)
            num -= maxVal - minVal;
        while (num < minVal)
            num += maxVal - minVal;
        return num;
    };
    const randInt = (minVal, maxVal = 0) => Math.round(Math.random() * (Math.max(maxVal, minVal) - Math.min(maxVal, minVal)) + Math.min(maxVal, minVal));
    const padNum = (num, numDigitsLeft, numDigitsRight) => {
        let [leftDigits, rightDigits] = `${num}`.split(".");
        leftDigits = `${"0".repeat(Math.max(0, numDigitsLeft - leftDigits.length))}${leftDigits}`;
        rightDigits = VAL({number: rightDigits}) ? rightDigits : "";
        if (VAL({number: numDigitsRight}))
            rightDigits = `.${rightDigits}${"0".repeat(Math.max(0, numDigitsRight - rightDigits.length))}`;
        return `${leftDigits}${rightDigits}`;
    };
    const signNum = (num, delim = "") => `${D.Float(num) < 0 ? "-" : "+"}${delim}${Math.abs(D.Float(num))}`;
    const pLowerCase = (ref) => (VAL({array: ref}) ? ref.map((x) => `${x || ""}`.toLowerCase()) : `${ref || ""}`.toLowerCase());
    const pUpperCase = (ref) => (VAL({array: ref}) ? ref.map((x) => `${x || ""}`.toUpperCase()) : `${ref || ""}`.toUpperCase());
    const numToText = (num, isTitleCase = false) => {
        const numString = `${num}`;
        const parseThreeDigits = (v) => {
            const digits = _.map(v.toString().split(""), (vv) => parseInt(vv));
            let result = "";
            if (digits.length === 3) {
                const hundreds = digits.shift();
                result += hundreds > 0 ? `${C.NUMBERWORDS.low[hundreds]} hundred` : "";
                if (digits[0] + digits[1] > 0)
                    result += " and ";
                else
                    return result.toLowerCase();
            }
            if (parseInt(digits.join("")) <= C.NUMBERWORDS.low.length)
                result += C.NUMBERWORDS.low[parseInt(digits.join(""))];
            else
                result += C.NUMBERWORDS.tens[parseInt(digits.shift())] + (parseInt(digits[0]) > 0 ? `-${C.NUMBERWORDS.low[parseInt(digits[0])]}` : "");
            return result.toLowerCase();
        };
        const isNegative = numString.charAt(0) === "-";
        const [integers, decimals] = numString.replace(/[,|\s|-]/gu, "").split(".");
        const intArray = _.map(
            integers
                .split("")
                .reverse()
                .join("")
                .match(/.{1,3}/g),
            (v) => v
                .split("")
                .reverse()
                .join("")
        ).reverse();
        const [intStrings, decStrings] = [[], []];
        while (intArray.length)
            intStrings.push(`${parseThreeDigits(intArray.shift())} ${C.NUMBERWORDS.tiers[intArray.length]}`.toLowerCase().trim());
        if (VAL({number: decimals})) {
            decStrings.push(" point");
            for (const digit of decimals.split(""))
                decStrings.push(C.NUMBERWORDS.low[parseInt(digit)]);
        }
        return capitalize((isNegative ? "negative " : "") + intStrings.join(", ") + decStrings.join(" "), isTitleCase);
    };
    const textToNum = (num) => {
        const [tenText, oneText] = num.split("-");
        if (VAL({string: tenText}, "textToNum"))
            return Math.max(
                0,
                _.indexOf(
                    _.map(C.NUMBERWORDS.tens, (v) => v.toLowerCase()),
                    tenText.toLowerCase()
                ) * 10,
                _.indexOf(
                    _.map(C.NUMBERWORDS.low, (v) => v.toLowerCase()),
                    tenText.toLowerCase()
                )
            ) + VAL({string: oneText})
                ? Math.max(
                    0,
                    _.indexOf(
                        _.map(C.NUMBERWORDS.low, (v) => v.toLowerCase()),
                        oneText.toLowerCase()
                    )
                )
                : 0;
        return 0;
    };
    const ellipsisText = (text, maxLength) => {
        if (`${text}`.length > maxLength)
            return `${text.slice(0, maxLength - 3)}…`;
        return text;
    };
    const numToRomanNum = (num, isGroupingSymbols = true) => {
        if (isNaN(num))
            return NaN;
        const digits = String(D.Int(num)).split("");
        const key = (isGroupingSymbols && [
            // Ⅰ Ⅱ Ⅲ Ⅳ Ⅴ Ⅵ Ⅶ Ⅷ Ⅸ Ⅹ Ⅺ Ⅻ Ⅼ Ⅽ Ⅾ Ⅿ
            "",
            "Ⅽ",
            "ⅭⅭ",
            "ⅭⅭⅭ",
            "ⅭⅮ",
            "Ⅾ",
            "ⅮⅭ",
            "ⅮⅭⅭ",
            "ⅮⅭⅭⅭ",
            "ⅭⅯ",
            "",
            "Ⅹ",
            "ⅩⅩ",
            "ⅩⅩⅩ",
            "ⅩⅬ",
            "Ⅼ",
            "ⅬⅩ",
            "ⅬⅩⅩ",
            "ⅬⅩⅩⅩ",
            "ⅩⅭ",
            "",
            "Ⅰ",
            "Ⅱ",
            "Ⅲ",
            "Ⅳ",
            "Ⅴ",
            "Ⅵ",
            "Ⅶ",
            "Ⅷ",
            "Ⅸ"
        ]) || [
            // Ⅰ Ⅴ Ⅹ Ⅼ Ⅽ Ⅾ Ⅿ
            "",
            "Ⅽ",
            "ⅭⅭ",
            "ⅭⅭⅭ",
            "ⅭⅮ",
            "Ⅾ",
            "ⅮⅭ",
            "ⅮⅭⅭ",
            "ⅮⅭⅭⅭ",
            "ⅭⅯ",
            "",
            "Ⅹ",
            "ⅩⅩ",
            "ⅩⅩⅩ",
            "ⅩⅬ",
            "Ⅼ",
            "ⅬⅩ",
            "ⅬⅩⅩ",
            "ⅬⅩⅩⅩ",
            "ⅩⅭ",
            "",
            "Ⅰ",
            "ⅠⅠ",
            "ⅠⅠⅠ",
            "ⅠⅤ",
            "Ⅴ",
            "ⅤⅠ",
            "ⅤⅠⅠ",
            "ⅤⅠⅠⅠ",
            "ⅠⅩ"
        ];
        let roman = "",
            i = 3;
        while (i--)
            roman = (key[D.Int(digits.pop()) + i * 10] || "") + roman;
        return isGroupingSymbols
            ? (Array(D.Int(digits.join("")) + 1).join("M") + roman).replace(/ⅩⅠ/gu, "Ⅺ").replace(/ⅩⅡ/gu, "Ⅻ")
            : Array(D.Int(digits.join("")) + 1).join("M") + roman;
    };
    const ordinal = (num, isFullText = false) => {
        /* Converts any number by adding its appropriate ordinal ("2nd", "3rd", etc.) */
        if (isFullText) {
            const [numText, suffix] = numToText(num).match(/.*?[-|\s](\w*?)$/u);
            return numText.replace(new RegExp(`${suffix}$`, "u"), "") + C.ORDINALSUFFIX[suffix] || `${suffix}th`;
        }
        const tNum = parseInt(num) - 100 * Math.floor(parseInt(num) / 100);
        if ([11, 12, 13].includes(tNum))
            return `${num}th`;

        return `${num}${["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][num % 10]}`;
    };
    const capitalize = (str, isTitleCase = false) => {
        if (VAL({string: str}, "capitalize"))
            if (isTitleCase)
                return _.map(
                    _.map(str.split(" "), (v) => v.slice(0, 1).toUpperCase() + v.slice(1))
                        .join(" ")
                        .split("-"),
                    (v) => v.slice(0, 1).toUpperCase() + v.slice(1)
                )
                    .join("-")
                    .replace(/And/gu, "and");
            else
                return str.slice(0, 1).toUpperCase() + str.slice(1);
        THROW(`Attempt to capitalize non-string '${jStrL(str)}'`, "capitalize");
        return str;
    };
    const clone = (obj) => {
        if (_.isObject(obj) && Object.keys(obj).length) {
            const objToString = JSON.stringify(obj);
            if (_.isString(objToString))
                return JSON.parse(objToString);
        }
        return {};
    };
    const merge = (target, source, areNewPropsOK = true, isWritingToTarget = false) => {
        if (_.isUndefined(source))
            return target;
        if (typeof target !== "function" && _.isObject(target)) {
            const thisTarget = Array.isArray(target) ? [...target] : Object.assign({}, target);
            if (typeof source !== "function" && _.isObject(source)) {
                for (const [key, val] of Object.entries(areNewPropsOK ? source : _.pick(source, Object.keys(thisTarget))))
                    thisTarget[key] = merge(thisTarget[key], val, areNewPropsOK, isWritingToTarget);
                if (isWritingToTarget)
                    Object.assign(target, thisTarget);
                return thisTarget;
            }
        }
        return source;
    };
    const filterForObjAttrs = (obj, deltas) => {
        const filteredDeltas = _.pick(deltas, (deltaVal, deltaKey) => deltaKey in obj.attributes);
        ["left", "top", "height", "width"].forEach((x) => {
            if (x in filteredDeltas && !VAL({number: filteredDeltas[x]}))
                delete filteredDeltas[x];
            else if (x in filteredDeltas)
                filteredDeltas[x] = D.Int(filteredDeltas[x], true);
        });
        return filteredDeltas;
    };
    const filterForChanges = (target, source) => {
        if (_.isUndefined(source))
            return undefined;
        if (typeof source !== "function" && _.isObject(source)) {
            const thisSource = Array.isArray(source) ? [] : {};
            if (typeof target !== "function" && _.isObject(target)) {
                for (const [key, val] of Object.entries(source)) {
                    const changes = filterForChanges(target[key], val);
                    if (changes !== undefined)
                        thisSource[key] = changes;
                }
                return thisSource;
            }
            return source;
        } else if (source === target) {
            return undefined;
        } else {
            return source;
        }
    };
    const rbgToHex = (rgb = [0, 0, 0]) => `#${rgb
        .slice(0, 3)
        .map((x) => x.toString(16))
        .join("")}`;
    const colorGradient = (startColor, endColor, percent) => `rgba(${startColor
        .replace(/[^\d\s,]*/gu, "")
        .split(",")
        .map((x, i) => D[i === 3 ? "Round" : "Int"](x, 2))
        .map((x, i) => D[i === 3 ? "Round" : "Int"](
            x
                        + ((endColor
                            .replace(/[^\d\s,]*/gu, "")
                            .split(",")
                            .map((xx, ii) => D[ii === 3 ? "Round" : "Int"](xx, 2))[i]
                            - x) * percent),
            2
        ))
        .join(", ")})`;
    const parseStack = (stackObj) => {
        const stackData = processStack(stackObj);
        const reportLines = stackData.filteredStackLines.map((x) => x
            .replace(/ *\[ *as[^\]]*\] */gu, " ")
            .replace(/^.*?at /gu, "")
            .replace(/\(([^:]*:[^:]*):\d+\)/gu, "($1)")); // .join("◄")
        reportLines[0] = `<b>${reportLines[0].split(" ")[0]}</b> ${reportLines[0].split(" ")[1]}`;
        return reportLines;
    };
    /*
            REGEXP FOR WRAPPING FUNCTIONS:
            [^(( +)(const )? *[^ \r\n\=]* *=.*?=> *\{)] >> [$1\r\n$2    const funcID = ONSTACK\(\)] (RegExp Replace)
            [ return ] >> [ return OFFSTACK(funcID) && ] (Normal Replace)
        */
    const dampenStackVal = (code) => code
        .replace(/<\/?b>/gu, "")
        .replace(/\(([A-Z])[a-z]*?([A-Z])?[a-z]*?([A-Z])?[a-z]*?([A-Z])?[a-z]*:(\d+)\)/gu, "<span style=\"font-size: 10px;\"> ($1$2$3$4:$5)</span>")
        .replace(
            /^ *([a-z_]) *[ a-z._]*?([A-Z._])? *([a-z._]{0,3})[ a-z._]*([A-Z])?[ a-z._]*([A-Z])?[ a-z._]*([A-Z])?[ a-z._]*/gu,
            "<span style=\"background-color: rgba(0,0,0,0.3);\">$1$2$3$4$5$6</span>"
        );
    const putOnStack = (excludeFunc, isThrottlingStackLog = false) => {
        if (!STATE.REF.isFullDebug || STATE.REF.isThrottlingStackLog)
            return true;
        const obj = {};
        let funcID = D.RandomString(20);
        const filterFunc = (fID) => (x) => x[0] === fID;
        while (FUNCSONSTACK.filter(filterFunc(funcID)).length)
            funcID = D.RandomString(20);
        Error.captureStackTrace(obj, excludeFunc);
        if (FUNCSONSTACK.length) {
            if (STACKLOG.length > 450)
                getStackRecord("... Stack");
            logStackAlert(
                `<span style="background-color: rgba(0,0,0,0.${STACKLOG.length
                    % 2}); width: 1550px; display: block; font-family: 'Carrois Gothic SC'; font-size: 12px;"> ${"> ".repeat(
                    FUNCSONSTACK.length - 1
                )}${FUNCSONSTACK.slice(1)
                    .map((x) => dampenStackVal(x[1]))
                    .join(" > ")} ► ${D.ParseStack(obj).shift()}</span>`
            );
        } else {
            logStackAlert(
                `<span style="background-color: rgba(0,0,0,0.8); color: ${
                    C.COLORS.white
                }; border-top: 1px solid black; margin-top: 5px; width: 1550px; display: block; line-height: 10px; padding: 3px 0px; font-variant: small-caps;">&nbsp;&nbsp;&nbsp;${D.ParseStack(
                    obj
                ).shift()}</span>`
            );
        }
        FUNCSONSTACK.push([funcID, D.ParseStack(obj).shift()]);
        if (isThrottlingStackLog)
            STATE.REF.isThrottlingStackLog = funcID;
        return funcID;
    };
    const pullOffStack = (funcID) => {
        if (STATE.REF.isTHrottlingStackLog === funcID)
            STATE.REF.isThrottlingStackLog = false;
        if (!STATE.REF.isFullDebug || STATE.REF.isThrottlingStackLog)
            return true;
        const remFunc = D.PullOut(FUNCSONSTACK, (v) => v[0] === funcID);
        if (remFunc)
            if (FUNCSONSTACK.length > 1)
                if (STACKLOG[STACKLOG.length - 1].endsWith(`${remFunc[1]}</span>`))
                    STACKLOG[STACKLOG.length - 1] = `${STACKLOG[STACKLOG.length - 1].replace(/<\/span>$/gu, " ◄</span>")}`;
                else
                    logStackAlert(
                        `<span style="background-color: rgba(0,0,0,0.${STACKLOG.length
                            % 2}); width: 1550px; display: block; font-family: 'Carrois Gothic SC'; font-size: 12px;"> ${" <".repeat(
                            FUNCSONSTACK.length
                        )}${D.Clone(FUNCSONSTACK)
                            .slice(1)
                            .map((x) => dampenStackVal(x[1]))
                            .join(" > ")} > ${remFunc[1]} ◄</span>`
                    );
            else if (FUNCSONSTACK.length === 1)
                STACKLOG[STACKLOG.length - 1] = `${STACKLOG[STACKLOG.length - 1].replace(/<\/span>$/gu, " ◄</span>")}`;
        return true;
    };
    // #endregion

    // #region MESSAGES: Formatting and sending chat messages and report handouts to players & Storyteller
    const formatTitle = (funcName, scriptName, prefix = "") => `[${prefix}${VAL({string: funcName}) || VAL({string: scriptName}) ? " " : ""}${
        VAL({string: scriptName}) ? `${scriptName.toUpperCase()}` : ""
    }${VAL({string: [scriptName, funcName]}, null, true) ? ": " : ""}${funcName || ""}]`;
    const formatLogLine = (msg, funcName, scriptName, prefix = "") => `${formatTitle(funcName, scriptName, prefix)} ${formatMsgContents(msg, false)}`;
    const formatMsgContents = (msg, isHTMLOk = true, isStrippingHTML = false) => {
        if (typeof msg === "object" && !Array.isArray(msg))
            if (isHTMLOk) {
                if (isStrippingHTML)
                    msg = Object.values(kvpMap(msg, null, (v, k) => `<b>${jStrL(k)}:</b> ${jStrL(v)}`)).join("<br>");
                else
                    msg = Object.values(kvpMap(msg, null, (v, k) => `<b>${jStr(k)}:</b> ${jStr(v)}`)).join("<br>");
            } else {
                msg = Object.values(kvpMap(msg, null, (v, k) => `${jStrL(k)}: ${jStrL(v)}`)).join(" ");
            }
        else if (Array.isArray(msg) || typeof msg === "string")
            if (isHTMLOk) {
                if (isStrippingHTML)
                    msg = _.flatten([msg], true)
                        .map((x) => jStr(x))
                        .join("");
                else
                    msg = _.flatten([msg], true)
                        .map((x) => jStrL(x))
                        .join("");
            } else {
                msg = _.flatten([msg], true)
                    .map((x) => jStrL(x))
                    .join(" ");
            }
        else if (isHTMLOk && !isStrippingHTML)
            msg = jStr(msg);
        else
            msg = jStrL(msg);

        if (!isHTMLOk)
            msg = msg.replace(/<[a-z/\s]*>/gu, " ").replace(/\s\s+/gu, " ");

        return msg;
    };
    const sendAPICommand = (command) => {
        sendChat(getName(getGMID()), command);
    };
    const sendChatMessage = (who, message, title, isPureCode = false, isPublicDuringTesting = false) => {
        /* Whispers chat message to player given: display name OR player ID.
                If no Title, message is sent without formatting.
                If no Message, title is sent alone as a flag. */
        const player = getPlayer(who) || who;
        let html;
        if (isPureCode)
            html = C.HTML.Block([
                C.HTML.Title(title, {height: "auto",
                                     lineHeight: "30px",
                                     color: C.COLORS.white,
                                     fontFamily: "Voltaire",
                                     fontSize: "16px",
                                     bgColor: C.COLORS.darkgrey}),
                C.HTML.Body(message, {lineHeight: "10px",
                                      margin: "0px",
                                      padding: "5px",
                                      color: C.COLORS.black,
                                      fontSize: "8px",
                                      fontFamily: "'Fira Code'",
                                      textAlign: "left",
                                      fontWeight: "normal",
                                      textShadow: "none"}) // custom: "white-space: nowrap;"
            ], {width: "auto",
                bgColor: C.COLORS.white,
                border: `2px solid ${C.COLORS.black}`,
                custom: "overflow-x: scroll;"});
        else if (title)
            html = C.HTML.Block([
                C.HTML.Header(title, {
                    height: "auto",
                    width: "auto",
                    lineHeight: "30px",
                    padding: "0px 5px",
                    margin: "0px",
                    fontFamily: "Oswald",
                    fontWeight: "normal",
                    bgColor: C.COLORS.darkgrey,
                    color: C.COLORS.white,
                    border: "none",
                    textAlign: "left"
                }),
                C.HTML.Body(message, {
                    padding: "5px",
                    fontFamily: "input, verdana, sans-serif",
                    fontSize: "10px",
                    bgColor: C.COLORS.white,
                    border: "none",
                    lineHeight: "14px",
                    fontWeight: "normal",
                    color: C.COLORS.black,
                    margin: "0px",
                    textShadow: "none",
                    textAlign: "left"
                })
            ], {width: "auto", border: `2px solid ${C.COLORS.black}`});
        else
            html = message;

        // sendChat(from, `/direct <pre>${JSON.stringify(html)}</pre>`)
        if (who === "all" || player === "all" || !player) {
            if (!isPublicDuringTesting && Session.IsTesting && !Session.IsFullTest)
                sendChat(
                    randomString(3),
                    `/w Storyteller ${html}<div style="display: block;height: 10px;max-height: 10px;position: relative;z-index: 999;text-align: right;width: 100%;margin-top: -10px;margin-bottom: -7px;background-color: transparent;padding: 0px;font-size: 0px;"><span style="font-size: 10px; display:inline-block; line-height: 10px; background-color: darkgreen;color: white;max-height: 10px;width: auto;">(TO ALL)</span></div>`
                );
            else
                sendChat(randomString(3), html);
        } else {
            sendChat(randomString(3), `/w "${player.get("_displayname")}" ${html}`);
            if (!playerIsGM(player.id))
                sendChat(
                    randomString(3),
                    `/w Storyteller ${html}<div style="display: block;height: 10px;max-height: 10px;position: relative;z-index: 999;text-align: right;width: 100%;margin-top: -10px;margin-bottom: -7px;background-color: transparent;padding: 0px;font-size: 0px;"><span style="font-size: 10px; display:inline-block; line-height: 10px; background-color: blue;color: white;max-height: 10px;width: auto;">(TO: ${player
                        .get("_displayname")
                        .slice(0, 5)}...)</span></div>`
                );
        }
    };
    const sendToGM = (msg, title = "[ALERT]", throttle = 0, isPureCode = false) => {
        if (STATE.REF.ALERTTHROTTLE.includes(title)) {
            return;
        } else if (throttle > 0) {
            STATE.REF.ALERTTHROTTLE.push(title);
            setTimeout(() => {
                STATE.REF.ALERTTHROTTLE = _.without(STATE.REF.ALERTTHROTTLE, title);
            }, throttle);
        }
        sendChatMessage(getGMID(), msg, title, isPureCode);
    };
    const printSessionNotes = () => {
        const buildNoteTableRows = (date, notes) => [
            `<tr><td colspan="2" style="
                padding: 10px 3px 3px 3px;
                font-family: 'Oswald';
                font-size: 16px;
                border: none;
                border-bottom: 2px solid black;
                line-height: 16px;
            ">${date}</td></tr>`,
            ...notes.map((x, i) => `<tr style="
                background-color: ${i % 2 ? "#DDD" : "#EEE"};
            "><td style="
                    padding: 5px;
                    border: none;
                    line-height: 14px;
                ">${x.content}</td><td style="
                width: 50px;
                padding: 0px;
                border: none;
                text-align: right;
                font-family: Economica;
            ">${TimeTracker.FormatTime(x.time, false)}</td></tr>`)
        ].join("");
        const groupedNotes = _.groupBy(_.sortBy(STATE.REF.SessionNotes, "time"), "category");
        for (const [category, notes] of Object.entries(groupedNotes))
            groupedNotes[category] = _.groupBy(notes, (x) => TimeTracker.FormatDate(x.time));
        const handoutStrings = [];
        for (const category of ["general", ..._.without(Object.keys(groupedNotes), "general")]) {
            handoutStrings.push(`<h3>${D.UCase(category)}</h3><table style="font-family: Voltaire; font-size: 12px; border: none;"><tbody>`);
            const notesByDate = groupedNotes[category];
            for (const [date, notes] of Object.entries(notesByDate))
                handoutStrings.push(buildNoteTableRows(date, notes));
            handoutStrings.push("</tbody></table>");
        }
        Handouts.Make("Session Notes", null, handoutStrings.join(""), false, false, true);
    };
    // #endregion

    // #region COMMAND MENU: Prompting GM, Sending Command Menu
    const promptGM = (menuHTML, replyFunc) => {
        if (VAL({string: menuHTML}, "promptGM")) {
            if (VAL({func: replyFunc})) {
                TimeTracker.Pause();
                // Roller.Lock(true);
                PROMPTFUNC = replyFunc;
            }
            sendChatMessage(getGMID(), menuHTML);
        }
    };
    const receivePrompt = (replyString, objects) => {
        if (VAL({string: replyString, function: PROMPTFUNC}, "receivePrompt")) {
            replyString = replyString.replace(/_colon_/gu, ":");
            const func = PROMPTFUNC;
            PROMPTFUNC = null;
            if (func(replyString, objects) === C.REPLY.KEEPOPEN)
            // DB("Received 'TRUE' from reply function: RESTORING.", "receivePrompt")
                PROMPTFUNC = func;
            // DB("Did NOT receive 'TRUE' from reply function: CLEARING.", "receivePrompt")
            // Roller.Lock(false);
            if (STATE.REF.PROMPTCLOCK) {
                TimeTracker.ToggleClock(true);
                STATE.REF.PROMPTCLOCK = false;
            }
        }
    };
    const memoMenu = (menuData) => {
        if (VAL({string: menuData}))
            return menuData;
        const menuString = _.escape(JSON.stringify(menuData));
        // if (!(menuString in STATE.REF.COMMANDMENUS))
        //     STATE.REF.COMMANDMENUS[menuString] = getCommandMenuHTML(menuData)
        return getCommandMenuHTML(menuData);
    };
    const getCommandMenuHTML = (menuData = {}) => {
        const htmlRows = [];
        const customStyles = {
            Title: {
                fontSize: "20px",
                lineHeight: "28px",
                height: "26px",
                bgColor: C.COLORS.brightred,
                color: C.COLORS.black,
                fontFamily: "Voltaire",
                border: `none; border-bottom: 4px outset ${C.COLORS.crimson}`,
                margin: "0px 0px 0px 0px"
            },
            Header: {
                color: C.COLORS.brightgold,
                bgColor: C.COLORS.darkred,
                border: `1px outset ${C.COLORS.crimson}`,
                fontFamily: "Carrois Gothic SC",
                lineHeight: "22px"
            },
            Body: {
                color: C.COLORS.brightbrightgrey,
                lineHeight: "1.25em",
                fontFamily: "goodfish",
                fontSize: "1em",
                margin: "7px 0px 7px 0px"
            }
        };
        if (VAL({string: menuData}))
            DB({menuString: menuData}, "getCommandMenuHTML");
        else
            DB({menuTitle: D.JS(menuData.title)}, "getCommandMenuHTML");
        // DB({menuData}, "getCommandMenuHTML")
        const dbData = {rows: []};
        const parseSection = (sectionData) => {
            const sectionHTML = [];
            if (VAL({list: sectionData})) {
                const parseRow = (rowData) => {
                    if (VAL({string: rowData})) {
                        sectionHTML.push(rowData);
                        DB({rowDataIsString: rowData, sectionHTML}, "getCommandMenuHTML");
                    } else if (["Title", "Header", "Body", "ClearBody"].includes(rowData.type)) {
                        sectionHTML.push(
                            C.HTML[rowData.type](rowData.contents, Object.assign({}, customStyles[rowData.type] || {}, rowData.styles || {}))
                        );
                    } else if (rowData.type === "ButtonLine") {
                        try {
                            const buttonsCode = [];
                            const totalFlexEntities = rowData.contents.filter(
                                (x) => (VAL({list: x}) && (!x.styles || !x.styles.width)) || (VAL({number: x}) && x === 0)
                            ).length;
                            const strictSpacerTotWidth
                                = rowData.contents
                                    .map((x) => (VAL({list: x}) && "text" in x
                                        ? D.Int(
                                            Object.assign({width: "40px"}, customStyles.ButtonSubheader || {}, x.styles || {}).width.replace(
                                                /%|(px)/gu,
                                                ""
                                            )
                                        )
                                        : x))
                                    .filter((x) => VAL({number: x}))
                                    .reduce((tot, x) => tot + x + 2, 0) || 0;
                            // strictSpacerTotWidth = Math.floor(C.CHATWIDTH * (strictSpacerTotPercentWidth / 100)),
                            const totFlexSpacing = C.CHATWIDTH - strictSpacerTotWidth;
                            const flexEntityWidth = Math.floor(totFlexSpacing / totalFlexEntities);
                            DB({rowDataContents: D.JS(rowData.contents)}, "getCommandMenuHTML");
                            // DB({totalFlexEntities, strictSpacerTotWidth, totFlexSpacing, flexEntityWidth}, "getCommandMenuHTML")
                            rowData.contents = rowData.contents.map((x) => (VAL({number: x}) && x === 0 && flexEntityWidth) || x);
                            dbData.rows.push({strictSpacerTotWidth, totFlexSpacing, flexEntityWidth, rowData, entities: []});
                            for (const entity of rowData.contents)
                                if (VAL({number: entity}))
                                    buttonsCode.push(C.HTML.ButtonSpacer(`${D.Int(entity)}px`));
                                else if (VAL({list: entity}))
                                    if ("text" in entity) {
                                        buttonsCode.push(C.HTML.ButtonSubheader(entity.text, entity.styles));
                                    } else {
                                        if (entity.name.length > 12)
                                            entity.name = entity.name.replace(/([\w\d ]{10})[\w\d ]*?(\d?\d?)$/gu, "$1...$2");
                                        entity.command = entity.command.replace(/:/gu, "_colon_");
                                        const button = new Button(
                                            entity.name,
                                            entity.command,
                                            Object.assign(
                                                {},
                                                {width: `${flexEntityWidth - 4}px`},
                                                customStyles.Button || {},
                                                rowData.buttonStyles || {},
                                                entity.styles || {}
                                            )
                                        );
                                        buttonsCode.push(button.HTML);
                                    }
                            sectionHTML.push(C.HTML.ButtonLine(buttonsCode, rowData.styles || {}));
                        } catch (errObj) {
                            DB({["ERROR'ING ROWDATA"]: rowData, errObj}, "getCommandMenuHTML");
                        }
                    } else if (rowData.type === "Column") {
                        const numColumns = rowData.contents.length;
                        const colWidth = `${Math.floor(C.CHATWIDTH / numColumns)}px`;
                        const colHTML = [];
                        for (const colData of rowData.contents)
                            colHTML.push(C.HTML.Column(parseSection(colData), Object.assign({width: colWidth}, rowData.style)));
                        sectionHTML.push(C.HTML.SubBlock(colHTML.join("")));
                    }
                };
                if ("rows" in sectionData)
                    sectionData.rows.forEach((x) => parseRow(x));
                else
                    parseRow(sectionData);
            } else {
                sectionHTML.push(sectionData);
                DB({sectionDataIsString: sectionData, sectionHTML}, "getCommandMenuHTML");
            }
            return sectionHTML.join("");
        };
        htmlRows.push(parseSection(menuData));
        if (!("rows" in menuData))
            return htmlRows.join("");
        if ("title" in menuData)
            htmlRows.unshift(C.HTML.Title(menuData.title, Object.assign({}, customStyles.Title)));
        // DB(dbData, "commandMenu")
        return C.HTML.Block(htmlRows.join(""), menuData.blockParams || {});
    };
    const commandMenu = (menuData = {}, replyFunc = null) => {
        // "menu" snippet for detailed instructions
        const menuHTML = memoMenu(menuData);
        promptGM(menuHTML, replyFunc);
    };
    // #endregion

    // #region CHAT DISPLAYS: Displaying reference images in chat.

    // #endregion

    // #region OBJECT MANIPULATION: Manipulating arrays, mapping objects
    const kvpMap = (obj, kFunc, vFunc) => {
        const newObj = {};
        _.each(obj, (v, k) => {
            newObj[kFunc ? kFunc(k, v) : k] = vFunc ? vFunc(v, k) : v;
        });
        return newObj;
    };
    const removeFirst = (array, element) => array.splice(array.findIndex((v) => v === element));
    const pullElement = (array, checkFunc = (_v = true, _i = 0, _a = []) => { checkFunc(_v, _i, _a) }) => {
        const index = array.findIndex((v, i, a) => checkFunc(v, i, a));
        return index !== -1 && array.splice(index, 1).pop();
    };
    const pullIndex = (array, index) => pullElement(array, (v, i) => i === index);
    const parseToObj = (val, delim = ",", keyValDelim = ":") => {
        /* Converts an array or comma-delimited string of parameters ("key:val, key:val, key:val") into an object. */
        const [obj, args] = [{}, []];
        if (VAL({string: val}))
            args.push(...val.split(delim));
        else if (VAL({array: val}))
            args.push(...val);
        else
            return THROW(`Cannot parse value '${jStrC(val)}' to object.`, "parseToObj");
        for (const kvp of _.map(args, (v) => v.split(new RegExp(`\\s*${keyValDelim}\\s*(?!\\/)`, "u"))))
            obj[kvp[0].toString().trim()] = parseInt(kvp[1]) || kvp[1];
        return obj;
    };
    const classToObject = (classRef, {
        pick = undefined,
        omit = [],
        excludeUndefined = true,
        excludeFunctions = true
    } = {}) => {
        const originalClass = classRef || {};
        const keys = Object.getOwnPropertyNames(Object.getPrototypeOf(originalClass));
        return keys.reduce((classAsObj, key) => {
            if ((!excludeUndefined || originalClass[key] !== undefined)
             && (!excludeFunctions || typeof originalClass[key] !== "function")
             && (pick === undefined || [pick].flat().includes(key))
             && (!omit.includes(key)))
                classAsObj[key] = originalClass[key];
            return classAsObj;
        }, {});
    };
    const getLast = (array) => (array.length ? array[array.length - 1] : null);
    // #endregion

    // #region SEARCH & VALIDATION: Match checking, Set membership checking, type validation.
    const looseMatch = (first, second) => {
        if (VAL({string: [first, second]}, "looseMatch", true))
            return first.toLowerCase() === second.toLowerCase();
        return false;
    };
    const fuzzyMatch = (first, second) => {
        if (VAL({string: [first, second]}, "fuzzyMatch", true))
            return (
                first
                    .toLowerCase()
                    .replace(/\W+/gu, "")
                    .includes(second.toLowerCase().replace(/\W+/gu, ""))
                || second
                    .toLowerCase()
                    .replace(/\W+/gu, "")
                    .includes(first.toLowerCase().replace(/\W+/gu, ""))
            );
        return false;
    };
    const isInExact = (needle, haystack = ALLSTATS) => {
        // D.Alert(JSON.stringify(haystack))
        // Looks for needle in haystack using fuzzy matching, then returns value as it appears in haystack.
        try {
            // STEP ZERO: VALIDATE NEEDLE & HAYSTACK
            // NEEDLE --> Must be STRING
            // HAYSTACK --> Can be ARRAY, LIST or STRING
            if (VAL({string: needle}) || VAL({number: needle})) {
                // STEP ONE: BUILD HAYSTACK.
                // HAYSTACK = ARRAY? --> HAY = ARRAY
                // HAYSTACK = LIST? ---> HAY = ARRAY (Object.keys(H))
                // HAYSTACK = STRING? -> HAY = H

                if (haystack && haystack.gramSizeLower)
                    return isIn(needle, haystack);
                const hayType = (VAL({array: haystack}) && "array") || (VAL({list: haystack}) && "list") || (VAL({string: haystack}) && "string");
                let ndl = needle.toString(),
                    hay,
                    match;
                switch (hayType) {
                    case "array":
                        hay = [...haystack];
                        break;
                    case "list":
                        hay = Object.keys(haystack);
                        break;
                    case "string":
                        hay = haystack;
                        break;
                    default:
                        return THROW(`Haystack must be a string, a list or an array (${typeof haystack}): ${JSON.stringify(haystack)}`, "IsIn");
                }
                // STEP TWO: SEARCH HAY FOR NEEDLE USING PROGRESSIVELY MORE FUZZY MATCHING. SKIP "*" STEPS IF ISFUZZYMATCHING IS FALSE.
                // STRICT: Search for exact match, case sensitive.
                // LOOSE: Search for exact match, case insensitive.
                // *START: Search for match with start of haystack strings, case insensitive.
                // *END: Search for match with end of haystack strings, case insensitive.
                // *INCLUDE: Search for match of needle anywhere in haystack strings, case insensitive.
                // *REVERSE INCLUDE: Search for match of HAYSTACK strings inside needle, case insensitive.
                // FUZZY: Start again after stripping all non-word characters.
                if (hayType === "array" || hayType === "list") {
                    for (let i = 0; i <= 1; i++) {
                        let thisNeedle = ndl,
                            thisHay = hay;
                        match = _.findIndex(thisHay, (v) => thisNeedle === v) + 1; // Adding 1 means "!match" passes on failure return of -1.
                        if (match)
                            break;
                        thisHay = _.map(
                            thisHay,
                            (v) => ((v || v === 0) && (VAL({string: v}) || VAL({number: v}) ? v.toString().toLowerCase() : v)) || "§¥£"
                        );
                        thisNeedle = thisNeedle.toString().toLowerCase();
                        match = _.findIndex(thisHay, (v) => thisNeedle === v) + 1;
                        if (match)
                            break;
                        // Now strip all non-word characters and try again from the top.
                        ndl = ndl.replace(/\W+/gu, "");
                        hay = _.map(hay, (v) => (VAL({string: v}) || VAL({number: v}) ? v.toString().replace(/\W+/gu, "") : v));
                    }
                    return match && hayType === "array" ? haystack[match - 1] : haystack[Object.keys(haystack)[match - 1]];
                } else {
                    for (let i = 0; i <= 1; i++) {
                        match = hay === ndl && ["", hay];
                        if (match)
                            break;
                        const thisNeedleRegExp = new RegExp(`^(${ndl})$`, "iu");
                        match = hay.match(thisNeedleRegExp);
                        if (match)
                            break;
                        // Now strip all non-word characters and try again from the top.
                        ndl = ndl.replace(/\W+/gu, "");
                        hay = hay.replace(/\W+/gu, "");
                    }
                    return match && match[1];
                }
            }
            return THROW(`Needle must be a string: ${D.JSL(needle)}`, "isIn");
        } catch (errObj) {
            return THROW(`Error locating '${D.JSL(needle)}' in ${D.JSL(haystack)}'`, "isIn", errObj);
        }
    };
    const isIn = (needle, haystack, isExact = false) => {
        let dict;
        if (isExact)
            return isInExact(needle, haystack);
        if (!haystack) {
            dict = STATE.REF.STATSDICT;
        } else if (haystack.add) {
            dict = haystack;
        } else {
            dict = Fuzzy.Fix();
            for (const str of haystack)
                dict.add(str);
        }
        const result = dict.get(needle);
        return result && result[0][1];
    };
    const isID = (testStr) => typeof testStr === "string" && testStr.length === 20 && testStr.charAt(0) === "-";
    /* isntIn = (needle, haystack = ALLSTATS, isFuzzyMatching = true) => {
            // Looks for needle in haystack using fuzzy matching, then returns value as it appears in haystack.
            try {
                // STEP ZERO: VALIDATE NEEDLE & HAYSTACK
                      // NEEDLE --> Must be STRING
                      // HAYSTACK --> Can be ARRAY, LIST or STRING
                if (VAL({string: needle}) || VAL({number: needle})) {
                    // STEP ONE: BUILD HAYSTACK.
                        // HAYSTACK = ARRAY? --> HAY = ARRAY
                        // HAYSTACK = LIST? ---> HAY = ARRAY (Object.keys(H))
                        // HAYSTACK = STRING? -> HAY = H
                    const hayType = VAL({array: haystack}) && "array" ||
                                    VAL({list: haystack}) && "list" ||
                                    VAL({string: haystack}) && "string"
                    let ndl = needle.toString(),
                        hay, match
                    switch (hayType) {
                        case "array":
                            hay = [...haystack]
                            break
                        case "list":
                            hay = Object.keys(haystack)
                            break
                        case "string":
                            hay = haystack
                            break
                        default:
                            return THROW(`Haystack must be a string, a list or an array: ${D.JSL(haystack)}`, "IsIn")
                    }
                    // STEP TWO: SEARCH HAY FOR NEEDLE USING PROGRESSIVELY MORE FUZZY MATCHING. SKIP "*" STEPS IF ISFUZZYMATCHING IS FALSE.
                            // STRICT: Search for exact match, case sensitive.
                            // LOOSE: Search for exact match, case insensitive.
                            // *START: Search for match with start of haystack strings, case insensitive.
                            // *END: Search for match with end of haystack strings, case insensitive.
                            // *INCLUDE: Search for match of needle anywhere in haystack strings, case insensitive.
                            // *REVERSE INCLUDE: Search for match of HAYSTACK strings inside needle, case insensitive.
                            // FUZZY: Start again after stripping all non-word characters.
                    if (hayType === "array" || hayType === "list") {
                        for (let i = 0; i <= 1; i++) {
                            let thisNeedle = ndl,
                                thisHay = hay
                            match = _.findIndex(thisHay, v => thisNeedle === v) + 1 // Adding 1 means "!match" passes on failure return of -1.
                            if (match) break
                            thisHay = _.map(thisHay, v => (v || v === 0) && (VAL({string: v}) || VAL({number: v}) ? v.toString().toLowerCase() : v) || "§¥£")
                            thisNeedle = thisNeedle.toString().toLowerCase()
                            match = _.findIndex(thisHay, v => thisNeedle === v) + 1
                            if (match) break
                            if (isFuzzyMatching)
                                match = _.findIndex(thisHay, v => v.startsWith(thisNeedle)) + 1
                            if (match) break
                            if (isFuzzyMatching)
                                match = _.findIndex(thisHay, v => v.endsWith(thisNeedle)) + 1
                            if (match) break
                            if (isFuzzyMatching)
                                match = _.findIndex(thisHay, v => v.includes(thisNeedle)) + 1
                            if (match) break
                            if (isFuzzyMatching)
                                match = _.findIndex(thisHay, v => thisNeedle.includes(v)) + 1
                            if (match) break
                            // Now strip all non-word characters and try again from the top.
                            ndl = ndl.replace(/\W+/gu, "")
                            hay = _.map(hay, v => VAL({string: v}) || VAL({number: v}) ? v.toString().replace(/\W+/gu, "") : v)
                        }
                        return match && hayType === "array" ? haystack[match - 1] : haystack[Object.keys(haystack)[match - 1]]
                    } else {
                        for (let i = 0; i <= 1; i++) {
                            match = hay === ndl && ["", hay]
                            if (match) break
                            let thisNeedleRegExp = new RegExp(`^(${ndl})$`, "iu")
                            match = hay.match(thisNeedleRegExp)
                            if (match) break
                            if (isFuzzyMatching) {
                                thisNeedleRegExp = new RegExp(`^(${ndl})`, "iu")
                                match = hay.match(thisNeedleRegExp)
                            }
                            if (match) break
                            if (isFuzzyMatching) {
                                thisNeedleRegExp = new RegExp(`(${ndl})$`, "iu")
                                match = hay.match(thisNeedleRegExp)
                            }
                            if (match) break
                            if (isFuzzyMatching) {
                                thisNeedleRegExp = new RegExp(`(${ndl})`, "iu")
                                match = hay.match(thisNeedleRegExp)
                            }
                            if (match) break
                            if (isFuzzyMatching) {
                                let thisHayRegExp = new RegExp(`(${hay})`, "iu")
                                match = ndl.match(thisHayRegExp)
                            }
                            if (match) break
                            // Now strip all non-word characters and try again from the top.
                            ndl = ndl.replace(/\W+/gu, "")
                            hay = hay.replace(/\W+/gu, "")
                        }
                        return match && match[1]
                    }
                }
                return THROW(`Needle must be a string: ${D.JSL(needle)}`, "isIn")
            } catch (errObj) {
                return THROW(`Error locating '${D.JSL(needle)}' in ${D.JSL(haystack)}'`, "isIn", errObj)
            }
        }, */
    const validate = (varList, funcName, scriptName, isArray = false) => {
        // NOTE: To avoid accidental recursion, DO NOT use validate to confirm a type within the getter of that type.
        //       (E.g do not use VAL{char} inside any of the getChar() functions.)
        const [errorLines, valArray, charArray] = [[], [], []];
        let detailsMsg;
        if (_.isArray(funcName))
            [funcName, detailsMsg] = funcName;
        _.each(varList, (val, cat) => {
            valArray.length = 0;
            valArray.push(...(isArray ? val : [val]));
            if (isArray && valArray.length === 0)
                errorLines.push("No values to check in array.");
            else
                _.each(valArray, (v) => {
                    let errorCheck = null;
                    switch (cat.toLowerCase()) {
                        case "id":
                            if (!_.isString(v) || v.length !== 20 || v.charAt(0) !== "-")
                                errorLines.push(`Invalid ID: ${jStrL(v)}`);
                            break;
                        case "jsobject": case "jsobj":
                            if (v === null
                                || !((typeof v === "function") || (typeof v === "object")))
                                errorLines.push(`Invalid JavaScript object (=${v === null ? "NULL" : typeof v}): ${jStrL(v)}`);
                            break;
                        case "object":
                        case "obj": // If v has a "get" and an "id" property.
                            if (!(v && v.get && v.id))
                                errorLines.push(`Invalid object: ${jStrL((v && v.get && v.get("name")) || (v && v.id) || v, true)}`);
                            break;
                        case "number": // If v starts with digits (returns true even if it's a string)
                            if (_.isNaN(parseInt(v)))
                                errorLines.push(`Invalid number: ${jStrL(v)}`);
                            break;
                        case "int": case "integer":
                            if (!Number.isInteger(parseFloat(v)))
                                errorLines.push(`Invalid integer: ${jStrL(v)}`);
                            break;
                        case "string": // If v is a string OR a number
                            if (!_.isString(v) && !_.isNumber(v))
                                errorLines.push(`Invalid string: ${jStrL(v)}`);
                            break;
                        case "func":
                        case "function":
                            if (!_.isFunction(v))
                                errorLines.push("Invalid function.");
                            break;
                        case "bool":
                        case "boolean":
                            if (v !== true && v !== false)
                                errorLines.push(`Invalid boolean: ${jStrL(v)}`);
                            break;
                        case "array":
                            if (!_.isArray(v))
                                errorLines.push(`Invalid array: ${jStrL(v)}`);
                            break;
                        case "list":
                            if (!_.isObject(v) || _.isFunction(v) || _.isArray(v) || (v && v.get && v.get("_type")))
                                errorLines.push(`Invalid list object: ${jStrL((v && v.get && v.get("name")) || (v && v.id) || v)}`);
                            break;
                        case "date":
                            if (_.isNaN((TimeTracker.GetDate(v) || {getTime: () => false}).getTime()))
                                errorLines.push(`Invalid date reference: ${jStrL((v && v.get && v.get("name")) || (v && v.id) || v)}`);
                            break;
                        case "dateobj":
                            if (!(v instanceof Date))
                                errorLines.push(`Invalid date object: ${jStrL((v && v.get && v.get("name")) || (v && v.id) || v)}`);
                            break;
                        case "msg":
                        case "selection":
                        case "selected":
                            if (!v || !v.selected || !v.selected[0])
                                errorLines.push("Invalid selection: Select objects first!");
                            break;
                        case "char":
                        case "charref":
                            if (!getChar(v, true))
                                errorLines.push(`Invalid character reference: ${jStrL((v && v.get && v.get("name")) || (v && v.id) || v, true)}`);
                            else
                                charArray.push(getChar(v, true));
                            break;
                        case "charobj":
                            if (!v || !v.get || v.get("_type") !== "character")
                                errorLines.push(`Invalid character object: ${jStrL((v && v.get && v.get("name")) || (v && v.id) || v, true)}`);
                            else
                                charArray.push(v);
                            break;
                        case "playerchar":
                        case "playercharref":
                        case "pcref":
                        case "pc":
                            if (!getChar(v, true))
                                errorLines.push(`Invalid character reference: ${jStrL((v && v.get && v.get("name")) || (v && v.id) || v, true)}`);
                            else if (
                                !_.values(Char.REGISTRY)
                                    .map((x) => x.id)
                                    .includes(getChar(v, true).id)
                            )
                                errorLines.push(
                                    `Character reference is not a player character: ${jStrL((v && v.get && v.get("name")) || (v && v.id) || v, true)}`
                                );
                            break;
                        case "npc":
                        case "npcref":
                        case "spc":
                        case "spcref":
                            if (!getChar(v, true))
                                errorLines.push(`Invalid character reference: ${jStrL((v && v.get && v.get("name")) || (v && v.id) || v, true)}`);
                            else if (
                                _.values(Char.REGISTRY)
                                    .map((x) => x.id)
                                    .includes(getChar(v, true).id)
                            )
                                errorLines.push(
                                    `Character reference is not a non-player character: ${jStrL(
                                        (v && v.get && v.get("name")) || (v && v.id) || v,
                                        true
                                    )}`
                                );
                            break;
                        case "player":
                        case "playerref":
                            if (!getPlayer(v, true))
                                errorLines.push(`Invalid player reference: ${jStrL((v && v.get && v.get("name")) || (v && v.id) || v)}`);
                            break;
                        case "playerobj":
                            if (!v || !v.get || v.get("_type") !== "player")
                                errorLines.push(`Invalid player object: ${jStrL((v && v.get && v.get("name")) || (v && v.id) || v, true)}`);
                            break;
                        case "text":
                        case "textref": /*
                                if (!Media.GetTextObj(v))
                                    errorLines.push(`Invalid text reference: ${jStrL(v && v.get && v.get("name") || v && v.id || v)}`)
                                break       */
                        // fall through
                        case "textobj":
                            if (!v || !v.get || v.get("_type") !== "text")
                                errorLines.push(`Invalid text object: ${jStrL((v && v.get && v.get("name")) || (v && v.id) || v)}`);
                            break;
                        case "graphic":
                        case "graphicref":
                        case "image":
                        case "imageref": /*
                                break       */
                        // fall through
                        case "graphicobj":
                        case "imageobj":
                        case "imgobj":
                            if (!v || !v.get || v.get("_type") !== "graphic")
                                errorLines.push(`Invalid graphic object: ${jStrL((v && v.get && v.get("name")) || (v && v.id) || v)}`);
                            break;
                        case "attribute":
                        case "attr":
                        case "attributeobj":
                        case "attrobj":
                            if (!v || !v.get || v.get("_type") !== "attribute")
                                errorLines.push(`Invalid attribute object: ${jStrL((v && v.get && v.get("name")) || (v && v.id) || v)}`);
                            break;
                        case "token":
                        case "tokenobj":
                            if (!v || !v.get || v.get("_subtype") !== "token" || v.get("represents") === "")
                                errorLines.push(
                                    `Invalid token object (not a token, or doesn't represent a character): ${jStrL(
                                        (v && v.get && v.get("name")) || (v && v.id) || v
                                    )}`
                                );
                            break;
                        case "trait":
                            if (charArray.length) {
                                errorCheck = [];
                                _.each(charArray, (charObj) => {
                                    if (!getStat(charObj, v))
                                        errorCheck.push(charObj.get("name"));
                                });
                                if (errorCheck.length)
                                    errorLines.push(
                                        `Invalid trait: ${jStrL((v && v.get && v.get("name")) || (v && v.id) || v)} ON ${errorCheck.length}/${
                                            ((varList && varList["char"]) || []).length
                                        } character references:<br>${jStrL(errorCheck)}`
                                    );
                            } else {
                                errorLines.push(`Must validate at least one character before validating traits: ${jStrL(varList[cat])}.`);
                            }
                            break;
                        case "reptrait":
                            if (charArray.length) {
                                errorCheck = [];
                                let [section, rowID, statName] = [];
                                if (_.isString(v) && v.match("^repeating_[^_]*?_[^_]*?_.+"))
                                    [section, rowID, statName] = parseRepStat(v);
                                else
                                    [section, statName] = _.isString(v) ? v.split(":") : [];
                                if (statName) {
                                    _.each(charArray, (charObj) => {
                                        if (!getRepStat(charObj, section, rowID, statName, true))
                                            errorCheck.push(charObj.get("name"));
                                    });
                                    if (errorCheck.length)
                                        errorLines.push(
                                            `Invalid repeating trait: ${jStrL((v && v.get && v.get("name")) || (v && v.id) || v)} ON ${
                                                errorCheck.length
                                            }/${varList["char"].length} character references:<br>${jStrL(errorCheck)}`
                                        );
                                } else {
                                    errorLines.push(
                                        `Bad form for repeating trait name: ${jStrL(
                                            v
                                        )}. Must supply full name, or string in the form "section:statname".`
                                    );
                                }
                            } else {
                                errorLines.push(`Must validate at least one character before validating repeating traits: ${jStrL(val)}.`);
                            }
                            break;
                        case "repname":
                            if (!(_.isString(v) && v.match("^repeating_[^_]*?_(.*?)_")))
                                errorLines.push(`Invalid repeating attribute name: ${jStrL(v)}`);
                            break;
                        // no default
                    }
                });
        });
        if (errorLines.length) {
            if (!funcName || !scriptName)
                return false;
            if (detailsMsg)
                return THROW(
                    `[From ${D.JSL(scriptName).toUpperCase()}:${D.JSL(funcName)}]<br><b>MSG</b>: ${detailsMsg}<br>... ${errorLines.join("<br>... ")}`,
                    "validate"
                );
            return THROW(`[From ${D.JSL(scriptName).toUpperCase()}:${D.JSL(funcName)}]<br>... ${errorLines.join("<br>... ")}`, "validate");
        }
        return true;
    };
    // #endregion

    // #region DEBUGGING & ERROR MANAGEMENT
    const setWatchList = (keywords, isSilent = false) => {
        if (keywords === "clear") {
            STATE.REF.WATCHLIST.length = 0;
            TEMPWATCHLIST.length = 0;
        } else {
            const watchwords = _.flatten([keywords]);
            _.each(watchwords, (v) => {
                if (v.startsWith("!"))
                    STATE.REF.WATCHLIST = _.without(STATE.REF.WATCHLIST, v.slice(1));
                else
                    STATE.REF.WATCHLIST = _.uniq([...STATE.REF.WATCHLIST, v]);
            });
        }
        if (!isSilent)
            sendToGM(
                `Currently displaying debug information tagged with:<br><br>${jStr(STATE.REF.WATCHLIST.join("<br>"))}`,
                formatTitle("setWatchList", SCRIPTNAME)
            );
    };
    const setTempWatchList = (keywords, delay = 2000) => {
        for (const watchWord of _.flatten([keywords]))
            if (watchWord.startsWith("!")) {
                TEMPWATCHLIST = _.without(TEMPWATCHLIST, watchWord.slice(1));
            } else {
                TEMPWATCHLIST = _.uniq([...TEMPWATCHLIST, watchWord]);
                setTimeout(() => setTempWatchList([`!${watchWord}`]), delay);
            }
    };
    const getWatchList = (isSilent = false) => {
        sendToGM(`${jStr(STATE.REF.WATCHLIST)}`, "DEBUG WATCH LIST");
        return STATE.REF.WATCHLIST;
    };
    const setBlackList = (keywords) => {
        if (keywords === "clear") {
            STATE.REF.BLACKLIST = [];
        } else {
            const watchwords = _.flatten([keywords]);
            _.each(watchwords, (v) => {
                if (v.startsWith("!"))
                    STATE.REF.BLACKLIST = _.without(STATE.REF.BLACKLIST, v.slice(1));
                else
                    STATE.REF.BLACKLIST = _.uniq([...STATE.REF.BLACKLIST, v]);
            });
        }
        sendToGM(
            `Currently NOT logging debug information tagged with:<br><br>${jStr(STATE.REF.BLACKLIST.join("<br>"))}`,
            formatTitle("setBlackList", SCRIPTNAME)
        );
    };
    const getBlackList = () => sendToGM(`${jStr(STATE.REF.BLACKLIST)}`, "DEBUG BLACKLIST");
    const logDebugAlert = (msg, funcName, scriptName, prefix = "DB") => {
        msg = formatMsgContents(msg, false);
        // if (funcName) {
        //     STATE.REF.DEBUGLOG.push({
        //         timeStamp: new Date().getTime(),
        //         title: formatTitle(funcName, scriptName, prefix),
        //         contents: msg
        //     });
        //     if (STATE.REF.DEBUGLOG.length > 100)
        //         getDebugRecord("... DBLog");
        // }
        log(formatLogLine(msg, funcName, scriptName, prefix));
    };
    const logStackAlert = (rawCode) => {
        if (_.isUndefined(Session) || Session.IsTesting || !Session.IsSessionActive) {
            if (STACKLOG.length > 500)
                if (Handouts.Count("stack") > 20) {
                    D.Alert("Out of space to log more stack trace!", "logStackAlert");
                    return;
                } else {
                    getStackRecord("... Stack");
                }
            STACKLOG.push(rawCode.replace(/ *\[as/gu, "").replace(/Object\./gu, ""));
        }
    };
    const throwError = (msg, funcName, scriptName, errObj) => sendDebugAlert(
        `${formatMsgContents(msg, false)}${errObj ? `${errObj.name}<br>${errObj.message}<br><br>${errObj.stack}` : ""}`,
        funcName,
        scriptName,
        "ERROR"
    );
    const sendDebugAlert = (msg, funcName, scriptName, prefix = "DB") => {
        funcName = funcName || "";
        scriptName = scriptName || "";
        if (
            (STATE.REF.WATCHLIST.includes(funcName))
            || (STATE.REF.WATCHLIST.includes(scriptName) && !STATE.REF.BLACKLIST.includes(funcName))
            || (!STATE.REF.BLACKLIST.includes(funcName) && !STATE.REF.BLACKLIST.includes(scriptName) && (
                STATE.REF.ISFORCINGDEBUGGING
                || !TimeTracker.IsInBlackout()
            ))
        ) {
            logDebugAlert(msg, funcName, scriptName, prefix);
            if (
                (funcName && [...TEMPWATCHLIST, ...STATE.REF.WATCHLIST].includes(funcName))
                || (scriptName && funcName && [...TEMPWATCHLIST, ...STATE.REF.WATCHLIST].includes(scriptName) && !STATE.REF.BLACKLIST.includes(funcName))
            )
                sendToGM(formatMsgContents(msg, true, false), formatTitle(funcName, scriptName, prefix));
        }
    };
    /* )
        if (
            (!Session.IsSessionActive || Session.IsTesting)
            && ([...TEMPWATCHLIST, ...STATE.REF.WATCHLIST].includes(funcName) || !STATE.REF.BLACKLIST.includes(funcName))
            && ([...TEMPWATCHLIST, ...STATE.REF.WATCHLIST].includes(funcName) || [...TEMPWATCHLIST, ...STATE.REF.WATCHLIST].includes(scriptName) || !STATE.REF.BLACKLIST.includes(scriptName))
        ) {
            logDebugAlert(msg, funcName, scriptName, prefix);
            if (
                (funcName && [...TEMPWATCHLIST, ...STATE.REF.WATCHLIST].includes(funcName))
                || (scriptName && [...TEMPWATCHLIST, ...STATE.REF.WATCHLIST].includes(scriptName))
                || (!funcName && !scriptName)
            )
                sendToGM(formatMsgContents(msg, true, false), formatTitle(funcName, scriptName, prefix));
        }
    }; */
    const getDebugRecord = (title = "Debug Log") => {
        const logLines = [];
        let lastTimeStamp, lastTitle;
        for (const logData of STATE.REF.DEBUGLOG) {
            if (lastTimeStamp && logData.timeStamp - lastTimeStamp > 7200000) {
                logLines.length = 0;
                Handouts.RemoveAll("Debug Log", "debug");
                Handouts.RemoveAll("... DBLog", "debug");
            }
            if (!lastTimeStamp || logData.timeStamp - lastTimeStamp > 1000) {
                const logDate = new Date(logData.timeStamp);
                let ampm = "A.M.";
                logDate.setUTCHours(logDate.getUTCHours() - 4);
                if (logDate.getUTCHours() >= 12) {
                    ampm = "P.M.";
                    if (logDate.getUTCHours() > 12)
                        logDate.setUTCHours(logDate.getUTCHours() - 12);
                }
                logLines.push(
                    "</div>",
                    C.HANDOUTHTML.main(C.HANDOUTHTML.title(new Date(logDate).toUTCString().replace("GMT", ampm))).replace("</div>", "")
                );
            }
            if (lastTitle === logData.title)
                logLines.push(C.HANDOUTHTML.bodyParagraph(jStr(logData.contents), {"border-top": `1px solid ${C.COLORS.black}`}));
            else
                logLines.push(C.HANDOUTHTML.bodyParagraph(C.HANDOUTHTML.subTitle(logData.title.replace("DB ", "")) + jStr(logData.contents)));
            lastTimeStamp = logData.timeStamp;
            lastTitle = logData.title;
        }
        logLines.push("</div>");
        Handouts.Make(title, "debug", logLines.join(""));
        STATE.REF.DEBUGLOG.length = 0;
    };
    const getStackRecord = (title = "Stack Log") => {
        Handouts.Make(title, "stack", STACKLOG.join(""));
        STACKLOG.length = 0;
    };
    const toggleTracing = () => {
        if (ISTRACING) {
            const traceLogLines = [];
            ISTRACING = false;
            Handouts.RemoveAll("Trace Report");
            for (const trace of STATE.REF.TRACELOG)
                if (!_.isNaN(STATE.REF.TRACELOGSTOPS[trace[0]] - trace[4]))
                    traceLogLines.push(
                        `${trace[4] - STATE.REF.TRACESTARTTIME},${trace[3]},${trace[1]},${trace[2]},${STATE.REF.TRACELOGSTOPS[trace[0]] - trace[4]}`
                    );
            Handouts.Report("Trace Report", traceLogLines.join("<br>"));
            TimeTracker.Fix();
        } else {
            ISTRACING = true;
            TimeTracker.StopAllTimers();
        }
        STATE.REF.TRACELOG = [];
        STATE.REF.TRACENESTCOUNTER = 0;
        STATE.REF.TRACESTARTTIME = 0;
        STATE.REF.TRACELOGSTOPS = {};
        STATE.REF.TRACELASTTIME = 0;
    };
    const randomChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const traceFuncStart = (funcName, funcParams, scriptName, message) => {
        if (ISTRACING) {
            funcParams = funcParams.length === 0 ? ["none"] : funcParams;
            if (STATE.REF.TRACESTARTTIME === 0)
                STATE.REF.TRACESTARTTIME = Date.now();
            // if (Date.now() - STATE.REF.TRACELASTTIME <= 5) {
            //    STATE.REF.TRACELASTTIME = Date.now()
            //    return false
            // }
            const funcID = _.sample(randomChars.split(""), 10).join("");
            STATE.REF.TRACELOG.push([
                funcID,
                `${scriptName.toUpperCase()}.${funcName}`,
                funcParams
                    .map((x) => `'${JSON.stringify(x)}'`)
                    .join("▐ ")
                    .replace(/,/gu, "¸"),
                STATE.REF.TRACENESTCOUNTER,
                Date.now()
            ]);
            // STATE.REF.TRACELASTTIME = Date.now()
            STATE.REF.TRACENESTCOUNTER++;
            // DB({time: Date.now(), traceFuncStart: STATE.REF.TRACELOG, traceStopLog: STATE.REF.TRACELOGSTOPS}, "traceFuncStart")
            return funcID;
        }
        return false;
    };
    const traceFuncStop = (funcID, returnVal) => {
        if (ISTRACING && funcID) {
            STATE.REF.TRACELOGSTOPS[funcID] = Date.now();
            STATE.REF.TRACENESTCOUNTER--;
            // DB({time: Date.now(), traceFuncStop: STATE.REF.TRACELOG, traceStopLog: STATE.REF.TRACELOGSTOPS}, "traceFuncStop")
        }
        return returnVal;
    };
    // #endregion

    // #region GETTERS: Object, Character and Player Data
    const getGMID = () => {
        /* Finds the first player who is GM. */
        const gmObj = _.find(findObjs({_type: "player"}), (v) => playerIsGM(v.id));
        return gmObj ? gmObj.id : THROW("No GM found.", "getGMID");
    };
    const getSelected = (msg, typeFilter = []) => {
        /* When given a message object, will return selected objects or false.
                Can set one or more types.  In addition to standard types, can include "token" and "character"
                    "token" --> Will only return selected graphic objects that represent a character.
                    "character" --> Will return character objects associated with selected tokens. */
        const selObjs = new Set();
        const types = _.flatten([typeFilter]);
        if (VAL({selection: msg}))
            _.each(_.compact(msg.selected), (v) => {
                if (types.length === 0 || types.includes(v._type))
                    selObjs.add(getObj(v._type, v._id));
                else if (v._type === "graphic" && VAL({token: getObj("graphic", v._id)}))
                    if (types.includes("token"))
                        selObjs.add(getObj("graphic", v.id));
                    else if ((types.includes("char") || types.includes("character")) && VAL({char: getObj("graphic", v._id)}))
                        selObjs.add(getObj("character", getObj("graphic", v._id).get("represents")));
            });
        if (selObjs.size === 0)
            THROW(`None of the selected objects are of type(s) '${jStrL(types)}'`, "getSelected");
        return [...selObjs];
    };
    const refreshShortNames = () => {
        STATE.REF.shortNames = [];
        for (const charObj of getChars("all"))
            STATE.REF.shortNames.push(getName(charObj, true));
    };
    const getName = (value, isShort = false) => {
        // Returns the NAME of the Graphic, Character or Player (DISPLAYNAME) given: object or ID.
        const obj = (VAL({object: value}) && value)
            || (VAL({char: value}) && getChar(value))
            || (VAL({player: value}) && getPlayer(value))
            || (VAL({string: value}) && getObj("graphic", value));
        const name = (VAL({player: obj}) && obj.get("_displayname")) || (VAL({object: obj}, "getName") && obj.get("name"));
        if (VAL({object: obj, string: name}, "getName")) {
            if (isShort) {
                if (_.find(_.values(Char.REGISTRY), (v) => v.name === name))
                    // If this is a registered character, return its short name.
                    return _.find(_.values(Char.REGISTRY), (v) => v.name === name).shortName;
                if (name.includes("\""))
                    // If name contains quotes, remove everything except the quoted portion of the name.
                    return name.replace(/.*?["]/iu, "").replace(/["].*/iu, "");
                return name
                    .split(/\s+/gu)
                    .pop()
                    .replace(/_/gu, " "); // Otherwise, return the last word in the name only, replacing underscores with spaces.
            }
            return name.replace(/_/gu, " ");
        }
        return "(UNNAMED)";
    };
    const getChars = (charRef, funcName = false, isFuzzyMatching = false) => {
        /* Returns an ARRAY OF CHARACTERS given: "all", "registered", a character ID, a registered player ID, a character Name,
				a token object, a message with selected tokens, OR an array of such parameters. */
        const charObjs = new Set();
        let [searchParams, dbstring] = [[], ""];
        try {
            if (charRef.who) {
                _.each(getSelected(charRef, "character"), (charObj) => {
                    charObjs.add(charObj);
                });
                dbstring += `REF: Msg.  RETURNING: ${jStrL(...charObjs)}`;
                if (charObjs.size > 0)
                    return [...(charObjs || [])];
                return (VAL({string: funcName}) && THROW("Must Select a Token!", `${D.JSL(funcName)} > getChars`)) || [];
            } else if (VAL({array: charRef})) {
                searchParams = charRef;
                dbstring += `REF: [${jStrL(...searchParams)}] `;
            } else if (VAL({string: charRef}) || VAL({object: charRef}) || VAL({number: charRef})) {
                searchParams.push(charRef);
                dbstring += `REF: ${capitalize(jStrL(typeof charRef), true)} `;
            } else {
                return (VAL({string: funcName}) && THROW(`Invalid character reference: ${jStrL(charRef)}`, `${D.JSL(funcName)} > getChars`)) || [];
            }
        } catch (errObj) {
            return (VAL({string: funcName}) && THROW("", `${D.JSL(funcName)} > getChars`, errObj)) || [];
        }
        _.each(searchParams, (v) => {
            if (searchParams.length > 1)
                dbstring += "<br>";
            // If parameter is a digit corresponding to a REGISTERED CHARACTER:
            if (VAL({string: v}) && ["TopLeft", "BotLeft", "TopRight", "BotRight"].includes(v) && Char.REGISTRY[v] && Char.REGISTRY[v].id) {
                charObjs.add(getObj("character", Char.REGISTRY[v].id));
                dbstring += " ... Registry #: ";
                // If parameter is a CHARACTER OBJECT already: */
            } else if (VAL({charObj: v})) {
                charObjs.add(v);
                dbstring += " ... CharObj ";
                // If parameter is a CHARACTER ID:
            } else if (VAL({string: v}) && getObj("character", v)) {
                charObjs.add(getObj("character", v));
                dbstring += " ... CharID: ";
                // If parameter is a (NON-GM) PLAYER OBJECT:
            } else if (VAL({object: v}) && v.id !== getGMID() && _.findKey(Char.REGISTRY, (vv) => vv.playerID === v.id)) {
                charObjs.add(getObj("character", Char.REGISTRY[_.findKey(Char.REGISTRY, (vv) => vv.playerID === v)].id));
                dbstring += " ... CharID: ";
                // If parameters is a REGISTERED PLAYER ID:
            } else if (VAL({string: v}) && v !== getGMID() && _.findKey(Char.REGISTRY, (vv) => vv.playerID === v)) {
                charObjs.add(getObj("character", Char.REGISTRY[_.findKey(Char.REGISTRY, (vv) => vv.playerID === v)].id));
                dbstring += " ... CharID: ";
                // If parameters is a TOKEN OBJECT:
            } else if (VAL({token: v}) && getObj("character", v.get("represents"))) {
                charObjs.add(getObj("character", v.get("represents")));
                dbstring += " ... Token: ";
            } else if (VAL({string: v})) {
                // If parameter is "all":
                if (v.toLowerCase() === "all") {
                    _.each(findObjs({_type: "character"}), (char) => charObjs.add(char));
                    dbstring += ` ... "${jStrL(v)}": `;
                    // If parameter calls for REGISTERED CHARACTERS or PC CHARACTERS:
                } else if (["registered", "pc", "pcs"].includes(v.toLowerCase())) {
                    for (const [, charData] of Object.entries(Char.REGISTRY))
                        if (charData.isActive)
                            charObjs.add(getObj("character", charData.id));
                    dbstring += ` ... "${jStrL(v)}": `;
                } else if (v.toLowerCase() === "disabled") {
                    for (const [, charData] of Object.entries(Char.REGISTRY))
                        if (!charData.isActive)
                            charObjs.add(getObj("character", charData.id));
                    dbstring += ` ... "${jStrL(v)}": `;
                } else if (["allregistered", "allreg", "allpcs"].includes(v.toLowerCase())) {
                    for (const [, charData] of Object.entries(Char.REGISTRY))
                        charObjs.add(getObj("character", charData.id));
                    dbstring += ` ... "${jStrL(v)}": `;
                } else if (["npc", "npcs"].includes(v.toLowerCase())) {
                    _.each(
                        findObjs({_type: "character"}).filter(
                            (x) => !Object.values(Char.REGISTRY)
                                .map((xx) => xx.id)
                                .includes(x.id)
                        ),
                        (charObj) => charObjs.add(charObj)
                    );
                    dbstring += ` ... "${jStrL(v)}": `;
                    // If parameter is "sandbox", calls for all characters with tokens in the sandbox (do player characters first)
                } else if (v.toLowerCase() === "sandbox") {
                    _.each(Media.GetContainedChars("Horizon", {padding: 50}), (vv) => charObjs.add(vv));
                    dbstring += ` ... "${jStrL(v)}": `;
                    // If parameter is "scene", it calls for all characters with tokens on or in the focused location card(s).
                } else if (v.toLowerCase() === "scene") {
                    _.each(Session.SceneChars, (vv) => charObjs.add(vv));
                    dbstring += ` ... "${jStrL(v)}": `;
                    // If parameter is a SINGLE LETTER, assume it is an INITIAL and search the registry for it.
                } else if (v.length === 1 && _.find(Char.REGISTRY, (data) => data.initial.toLowerCase() === v.toLowerCase())) {
                    const charData = _.find(Char.REGISTRY, (data) => data.initial.toLowerCase() === v.toLowerCase());
                    if (charData)
                        charObjs.add(getObj("character", charData.id));
                    dbstring += ` ... "${jStrL(v)}": `;
                    // If parameter is a STRING, assume it is a character name to fuzzy-match UNLESS isStrict is true.
                } else {
                    const charName = isFuzzyMatching
                        ? D.IsIn(v, STATE.REF.PCLIST, true) || D.IsIn(v, STATE.REF.NPCDICT, false)
                        : D.IsIn(v, STATE.REF.PCLIST, true) || D.IsIn(v, STATE.REF.NPCLIST, true);
                    const charObj = charName && (findObjs({_type: "character", name: charName}) || [])[0];
                    if (charObj)
                        charObjs.add(charObj);
                    dbstring += " ... String: ";
                }
            }
            dbstring += `${charObjs.size} Characters Found.`;
        });
        if (!STATE.REF.BLACKLIST.includes("getChars"))
            DB(dbstring, "getChars");
        if (charObjs.size === 0)
            return (
                (VAL({string: funcName})
                    && THROW(
                        `No Characters Found using Search Parameters:<br>${jStrL(searchParams)} in Character Reference<br>${jStrL(charRef)}`,
                        `${D.JSL(funcName)} > getChars`
                    ))
                || []
            );
        return _.compact([...(charObjs || [])]);
    };
    const getChar = (charRef, funcName = false) => Char.SelectedChar || (getChars(charRef, funcName) || [false])[0];
    const getCharData = (charRef) => {
        const charObj = getChar(charRef);
        if (VAL({playerchar: charObj}, "getCharData"))
            return _.find(_.values(Char.REGISTRY), (v) => v.id === charObj.id);
        else if (VAL({npc: charObj}, "getCharData"))
            return {
                id: charObj.id,
                name: charObj.get("name"),
                playerID: getGMID(),
                playerName: "Storyteller",
                tokenName: null,
                shortName: charObj.get("name"),
                initial: null,
                quadrant: null
            };
        return false;
    };
    const getCharsProps = (charRefs, property, funcName = false) => {
        const charObjs = getChars(charRefs, funcName);
        const propData = {};
        for (const char of charObjs)
            propData[char.id] = getCharData(char, funcName)[property];
        return propData;
    };
    const getStat = (charRef, statName, repRowStatName = false) => {
        // repRowStatName is the value of the name attribute on the repeating section row that you want to retrieve statName from.
        //    E.g. statName = "advantage_type", repRowStatName = "Status (Anarchs)"
        const charObj = getChar(charRef);
        const isGettingMax = statName.endsWith("_max");
        const stat = D.LCase(statName.replace(/_max$/gu, ""));
        let attrValueObj = null,
            attrValue = null;
        if (VAL({charObj, string: stat})) {
            const attrObjs = _.filter(
                findObjs({_type: "attribute", _characterid: charObj.id}),
                (v) => !v.get("name").includes("repeating") || stat.includes("repeating")
            ); // UNLESS "statName" includes "repeating_", don't return repeating fieldset attributes.
            // IF REPROWSTATNAME GIVEN, SEEK A REPEATING STAT THAT MATCHES
            if (repRowStatName) {
                const repStatData = getRepStats(charObj, null, {name: repRowStatName}, null, "rowID");
                if (repStatData)
                    attrValueObj = ((Object.values(repStatData)[0] || []).find((x) => x.name && D.LCase(x.name) === stat) || {obj: false}).obj;
                // DB({repStatData: Object.values(repStatData), find: (Object.values(repStatData) || [])[0].find((x) => x.name && D.LCase(x.name) === stat), stat, attrValueObj}, "getStat");
            }
            // STEP ONE: LOOK THROUGH NON-REPEATING ATTRIBUTES, IF NO REPROWSTATNAME GIVEN:
            attrValueObj = _.find(attrObjs, (v) => D.LCase(v.get("name")) === stat);
            DB({step: "STEP ONE: LOOK THROUGH NON-REPEATING ATTRIBUTES, IF NO REPROWSTATNAME GIVEN.", attrValueObj}, "getStat");
            // STEP TWO: LOOK THROUGH NON-REPEATING ATTRIBUTES FOR NAME/VAL PAIRS (e.g. "disc1_name, disc1")
            if (!attrValueObj) {
                const attrNameObj = _.find(
                    attrObjs,
                    (v) => D.LCase(v.get("name")).endsWith("_name") && D.LCase(v.get("current")) === stat
                );
                if (attrNameObj)
                    attrValueObj = _.find(attrObjs, (v) => D.LCase(v.get("name")) === D.LCase(attrNameObj.get("name")).slice(0, -5));
                DB({step: "STEP TWO: LOOK THROUGH NON-REPEATING ATTRIBUTES FOR NAME/VAL PAIRS (e.g. \"disc1_name, disc1\")", attrNameObj, attrValueObj}, "getStat");
            }

            // STEP THREE: LOOK THROUGH REPEATING ATTRIBUTES IN C.TRAITREPSECS = ["advantage", "negadvantage", "discleft", "discmid", "discright"]
            if (!attrValueObj) {
                for (const repSec of C.TRAITREPSECS) {
                    const repValData = getRepStats(charObj, repSec, null, stat);
                    attrValueObj = repValData && repValData[0] && repValData[0].obj && (D.LCase(repValData[0].name).endsWith(stat) || D.LCase(repValData[0].obj.get("name")).endsWith(stat)) && repValData[0].obj;
                    /* const boolChecks = {repValData: Boolean(repValData)};
                    if (boolChecks.repValData)
                        boolChecks["repValData[0]"] = Boolean(repValData[0]);
                    if (boolChecks["repValData[0]"])
                        boolChecks["repValData[0].obj"] = Boolean(repValData[0].obj);
                    if (boolChecks["repValData[0].obj"])
                        boolChecks.objName = Boolean(D.LCase(repValData[0].obj.get("name")));
                    if (boolChecks.objName)
                        boolChecks.stat = Boolean(stat);
                    if (boolChecks.stat)
                        boolChecks["objName.endsWith(stat)?"] = Boolean(D.LCase(repValData[0].obj.get("name")).endsWith(stat));
                    if (boolChecks["objName.endsWith(stat)?"])
                        boolChecks.finalObject = repValData[0].obj;
                    DB({
                        repValData,
                        boolChecks,
                        attrValueObj
                    }, "getStat"); */
                    if (attrValueObj)
                        break;
                }
                DB({step: "LOOK THROUGH REPEATING ATTRIBUTES IN C.TRAITREPSECS = [\"advantage\", \"negadvantage\", \"discleft\", \"discmid\", \"discright\"]", attrValueObj}, "getStat");
            }
            if (attrValueObj) {
                attrValue = attrValueObj.get(isGettingMax ? "max" : "current");
                if (!_.isNaN(parseInt(attrValue)))
                    attrValue = parseInt(attrValue);
            }
            DB(
                `StatName: ${D.JSL(stat)}
                AttrValueObj: ${D.JSL(attrValueObj, true)}
                Boolean: ${Boolean(attrValueObj)}
                Current: ${D.JSL(attrValueObj && attrValueObj.get(isGettingMax ? "max" : "current"))}
                So, returning: ${D.JSL(attrValueObj ? [attrValueObj.get(isGettingMax ? "max" : "current"), attrValueObj] : null, true)}`,
                "getStat"
            );
        }
        return attrValueObj ? [attrValue, attrValueObj] : null;
    };
    const getStatVal = (charRef, statName, repRowStatName = false) => (getStat(charRef, statName, repRowStatName) || [false])[0];
    const getRepIDs = (charRef, section, rowFilter, funcName = false) => {
        // rowRef: rowID (string), stat:value (list, with special "name" entry for shortname), array of either (array), or null (all)
        DB(`GetRepIDs(${jStrL(charRef, true)}, ${section}, ${jStrL(rowFilter)})`, "getRepIDs");
        const charObj = getChar(charRef, funcName);
        const getUniqIDs = (attrObjs) => _.uniq(_.map(attrObjs, (v) => v.get("name").match("repeating_[^_]*?_(.*?)_")[1]));
        let validRowIDs = [],
            dbstring = "";
        if (VAL({char: charObj, string: section}, "getRepIDs")) {
            const attrObjs = _.filter(findObjs({_type: "attribute", _characterid: charObj.id}), (v) => v
                .get("name")
                .toLowerCase()
                .startsWith(section === "*" ? "repeating_" : `repeating_${section.toLowerCase()}_`));
            // D.Alert(`attrObjs: ${D.JS(_.map(attrObjs, v => v.get("name")))}`)
            DB({
                attrObjs,
                attrObjIDs: attrObjs.map((x) => x.id),
                nameVals: attrObjs.map((x) => [parseRepStat(x.get("name"))[2], x.get("current")])
            }, "getRepIDs");
            const rowIDs = getUniqIDs(attrObjs);
            DB(
                `attrObjsInSection: ${jStrL(_.map(attrObjs, (v) => parseRepStat(v.get("name"))[2]))}<br><br>rowIDsInSection: ${jStrL(rowIDs)}`,
                "getRepIDs"
            );
            if (VAL({string: rowFilter})) {
                // RowRef is a string. Check to see if it's a flag ("top"); if not, assume it's a rowid.
                if (rowFilter === "top")
                    return [
                        _.find(
                            rowIDs,
                            (v) => v.toLowerCase() === (getStatVal(charObj, `_reporder_repeating_${section}`) || "").split(",")[0].toLowerCase()
                        )
                    ];
                DB(
                    `RowRef: STRING (${rowFilter}).  Valid Row IDs: ${jStrL(_.find(rowIDs, (v) => v.toLowerCase() === rowFilter.toLowerCase()))}`,
                    "getRepIDs"
                );
                return [_.find(rowIDs, (v) => v.toLowerCase() === rowFilter.toLowerCase())];
            } else if (VAL({list: rowFilter})) {
                // RowRef is a key/value list of stat name and value to filter by. Only row IDs referring to ALL matching key/value pairs will be returned.
                // If value === "*", any value is accepted (only checks for presence of stat name)
                validRowIDs = [...rowIDs];
                DB(`RowRef: LIST:<br><br>${jStrL(rowFilter)}`, "getRepIDs");
                for (const rowData of _.pairs(rowFilter)) {
                    const [key, val] = rowData;
                    DB(`RowData: ${key}, ${val}`, "getRepIDs");
                    // Check each row against this filter element: Must satisfy, or remove from validRowIDs
                    for (const rowID of [...validRowIDs]) {
                        const attrObjsInRow = _.filter(attrObjs, (v) => v
                            .get("name")
                            .toLowerCase()
                            .includes(rowID.toLowerCase()));
                        dbstring += `RowID: ${rowID}`;
                        if (
                            !_.find(
                                attrObjsInRow,
                                (v) => fuzzyMatch(v.get("name"), key) && (val === "*" || looseMatch(v.get("current").toString(), val.toString()))
                            )
                        ) {
                            // If no direct match is found, check if the row contains a "_name" attribute that matches the key.
                            const nameAttrObj = _.find(
                                attrObjsInRow,
                                (v) => v.get("name").endsWith("_name") && looseMatch(v.get("current").toString(), key.toString())
                            );
                            dbstring += " -- No Direct Match.";
                            // If _name attribute exists, now find corresponding non-name attribute and compare its value to val.
                            if (nameAttrObj) {
                                dbstring += `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${parseRepStat(nameAttrObj.get("name"))[2]} -- <b><u>EXISTS!</u></b>`;
                                if (
                                    !_.find(
                                        attrObjsInRow,
                                        (v) => looseMatch(v.get("name"), nameAttrObj.get("name").slice(0, -5))
                                            && (val === "*" || looseMatch(v.get("current").toString(), val.toString()))
                                    )
                                ) {
                                    // If neither of these tests pass, remove the rowID from the list of valid row IDs.
                                    dbstring += ". . .  But Doesn't Match Value";
                                    validRowIDs = _.without(validRowIDs, rowID);
                                } else {
                                    const obj = _.find(
                                        attrObjsInRow,
                                        (v) => looseMatch(v.get("name"), nameAttrObj.get("name").slice(0, -5))
                                            && (val === "*" || looseMatch(v.get("current").toString(), val.toString()))
                                    );
                                    dbstring += `. . .  NAME+VALUE MATCH: VAL[${val}] = ${obj.get("current")}, VALNAME[${
                                        parseRepStat(obj.get("name"))[2]
                                    }], NAMEOBJ[${parseRepStat(nameAttrObj.get("name"))[2]}]`;
                                }
                            } else {
                                dbstring += " No Name Attribute.";
                                validRowIDs = _.without(validRowIDs, rowID);
                            }
                        } else {
                            const matchedAttr = _.find(
                                attrObjsInRow,
                                (v) => fuzzyMatch(v.get("name"), key) && (val === "*" || looseMatch(v.get("current").toString(), val.toString()))
                            );
                            dbstring += ` -- DIRECT MATCH! ${matchedAttr.get("name")}: ${matchedAttr.get("current")}`;
                        }
                        dbstring += "<br>";
                    }
                    DB(dbstring, "getRepIDs");
                }
            } else if (VAL({array: rowFilter})) {
                // RowRef is an array of nested rowrefs, requiring recursion.
                for (const ref of rowFilter)
                    validRowIDs.push(...getRepIDs(charRef, section, ref, funcName));
            } else if (!rowFilter) {
                // No rowRef means the IDs of all section rows are returned.
                validRowIDs.push(...rowIDs);
            }
            DB(`Valid Row IDs: ${jStrL(validRowIDs)}`, "getRepIDs");
        }
        return _.uniq(validRowIDs);
    };
    const getRepStats = (charRef, section, rowFilter = {}, statNames, groupBy, pickProperty, funcName = false) => {
        const charObj = getChar(charRef);

        section = D.LCase(section || "*");
        statNames = _.compact(_.flatten([statNames])).map((x) => D.LCase(x));
        // D.Alert(`CharRef: ${D.JS(charRef)}, CharObj: ${D.JS(charObj)}`)
        DB(`getRepStats(${jStrL([charObj.get("name"), section, rowFilter, statNames, groupBy, pickProperty])})`, "getRepStats");
        let finalRepData = [];
        if (VAL({charObj}, "getRepStats")) {
            // STEP ONE: USE THE ROW FILTER TO GET VALID ROW IDS TO SEARCH
            const filter = (statNames.length === 1 && VAL({list: rowFilter})) ? Object.assign({[statNames[0]]: "*"}, rowFilter) : rowFilter;
            const rowIDs = _.compact(getRepIDs(charObj, section, filter, funcName));
            const attrObjs = [];
            if (filter === "top" && !rowIDs.length)
                rowIDs.push(..._.compact(getRepIDs(charObj, section, null, funcName)));
            attrObjs.push(
                ..._.filter(
                    findObjs({_type: "attribute", _characterid: charObj.id}),
                    (v) => v.get("name").match(`repeating_${section === "*" ? ".*?" : section}_(.*?)_`)
                        && rowIDs.includes(v.get("name").match(`repeating_${section === "*" ? ".*?" : section}_(.*?)_`)[1])
                )
            );
            // STEP TWO: ITERATE THROUGH EACH ROW TO LOOK FOR REQUESTED STAT(S)
            for (const rowID of rowIDs) {
                const rowAttrObjs = _.filter(attrObjs, (v) => v
                    .get("name")
                    .toLowerCase()
                    .includes(rowID.toLowerCase())); // Select the attribute objects from this row.
                const attrNameObjs = _.filter(rowAttrObjs, (v) => v
                    .get("name")
                    .toLowerCase()
                    .endsWith("_name")); // Select ALL row attribute objects that end with "_name"
                const attrNameData = _.compact(
                    _.map(attrNameObjs, (v) => {
                        // ... and compile their data by linking them to their value objects.
                        const data = {
                            charID: charObj.id,
                            rowID,
                            name: v.get("current"),
                            section: parseRepStat(v.get("name"))[0],
                            fullName: v.get("name").replace(/_name$/gu, ""),
                            obj: _.find(
                                rowAttrObjs,
                                (vv) => vv.get("name").toLowerCase()
                                    === v
                                        .get("name")
                                        .toLowerCase()
                                        .slice(0, -5)
                            )
                        };
                        if (data.obj) {
                            data.val = data.obj.get("current");
                            [, , data.attrName] = parseRepStat(data.obj.get("name"));
                            // DB(`NameData --> ValObject: NAME: ${data.name}, VAL: ${data.val}, OBJ: ${jStrL(data.obj)}`, "getRepStats");
                            return data;
                        } else {
                            return false;
                        }
                    })
                );
                // IF STATNAMES have been specified...
                if (statNames.length) {
                    for (const statName of statNames) {
                        const foundStat = _.find(attrNameData, (v) => looseMatch(parseRepStat(v.fullName)[2], statName.replace(/_name$/gu, ""))) // FIRST match it against an EXACT ATTRIBUTE NAME already found above.
                                       || _.find(attrNameData, (v) => looseMatch(parseRepStat(v.name)[2], statName)) // SECOND try to match with the EXACT "FOUND" NAME of a NAME/VALUE link.
                                       || _.find(rowAttrObjs, (v) => looseMatch(parseRepStat(v.get("name"))[2], statName)) // NEXT, check to see if it EXACTLY matches any of the rowAttrObjs.
                                       || _.find(attrNameData, (v) => parseRepStat(v.fullName)[2].startsWith(statName.replace(/_name$/gu, "")))
                                       || _.find(attrNameData, (v) => parseRepStat(v.name)[2].startsWith(statName))
                                       || _.find(rowAttrObjs, (v) => parseRepStat(v.get("name"))[2].startsWith(statName));
                            /* || _.find(attrNameData, (v) => fuzzyMatch(parseRepStat(v.fullName)[2], statName.replace(/_name$/gu, ""))) // FINALLY repeat the above but with fuzzy matching. match it against an EXACT ATTRIBUTE NAME already found above.
                            || _.find(attrNameData, (v) => fuzzyMatch(parseRepStat(v.name)[2], statName))
                            || _.find(rowAttrObjs, (v) => fuzzyMatch(parseRepStat(v.get("name"))[2], statName)) */
                        if (foundStat) {
                        // If a stat was found, change it to a data set if it isn't one already
                            finalRepData.push(
                                foundStat.fullName
                                    ? foundStat
                                    : {
                                        charID: charObj.id,
                                        rowID,
                                        name: parseRepStat(foundStat.get("name"))[2],
                                        section: parseRepStat(foundStat.get("name"))[0],
                                        attrName: parseRepStat(foundStat.get("name"))[2],
                                        fullName: foundStat.get("name"),
                                        obj: foundStat,
                                        val: foundStat.get("current")
                                    }
                            );
                            DB(`'${statName}' FOUND - FinalRepData: ${D.JSL(finalRepData, true)}`, "getRepStats");
                        }
                    }
                    // IF a STATEMENT has NOT been specified, return ALL the row attribute objects (after parsing them into data sets)
                } else {
                    finalRepData.push(...attrNameData);
                    finalRepData.push(
                        ..._.map(rowAttrObjs, (v) => ({
                            charID: charObj.id,
                            rowID,
                            name: parseRepStat(v.get("name"))[2],
                            section: parseRepStat(v.get("name"))[0],
                            attrName: parseRepStat(v.get("name"))[2],
                            fullName: v.get("name"),
                            obj: v,
                            val: v.get("current")
                        }))
                    );
                }
            }
            // Compactify the data to remove false values:
            finalRepData = _.compact(finalRepData);
            DB(`COMPACTED - FinalRepData: ${D.JSL(finalRepData, true)}`, "getRepStats");
            if (finalRepData.length)
                // Check for grouping and property-picking, and transform the data accordingly:
                if (VAL({string: groupBy}) && Object.keys(finalRepData[0]).includes(groupBy)) {
                    finalRepData = _.groupBy(finalRepData, (v) => v[groupBy]);
                    if (VAL({string: pickProperty}) && ["fullName", "attrName", "name", "obj", "val"].includes(pickProperty)) {
                        const pickData = {};
                        _.each(finalRepData, (v, k) => {
                            pickData[k] = _.map(v, (vv) => vv[pickProperty]);
                        });
                        finalRepData = pickData;
                    }
                } else if (VAL({string: pickProperty}) && Object.keys(finalRepData[0]).includes(pickProperty)) {
                    finalRepData = _.map(finalRepData, (v) => v[pickProperty]);
                }
        }
        DB(`RETURNING FOUND STAT: ${D.JSL(finalRepData, true)}`, "getRepStats");
        return finalRepData;
    };
    const getRepStat = (charRef, section, rowFilter, statName, funcName = false) => getRepStats(charRef, section, rowFilter, statName, null, null, funcName)[0];
    const getPlayerID = (playerRef, funcName = false) => {
        // Returns a PLAYER ID given: display name, token object, character reference.
        let playerID = null;
        try {
            if (VAL({object: playerRef}) && playerRef.get("_type") === "player") {
                DB(`PlayerRef identified as Player Object: ${D.JSL(playerRef, true)}<br><br>... returning ID: ${playerRef.id}`, "getPlayerID");
                return playerRef.id;
            }
            if (VAL({string: playerRef})) {
                DB(`PlayerRef identified as String: ${D.JSL(playerRef)}`, "getPlayerID");
                if (getObj("player", playerRef)) {
                    DB(`... String is Player ID. Returning ${D.JSL(getObj("player", playerRef).id)}`, "getPlayerID");
                    return getObj("player", playerRef).id;
                } else if (
                    findObjs(
                        {
                            _type: "player",
                            _displayname: playerRef
                        },
                        {caseInsensitive: true}
                    ).length > 0
                ) {
                    DB(
                        `... String is DISPLAY NAME. Found ${
                            findObjs(
                                {
                                    _type: "player",
                                    _displayname: playerRef
                                },
                                {caseInsensitive: true}
                            ).length
                        } Players.`,
                        "getPlayerID"
                    );
                    return findObjs(
                        {
                            _type: "player",
                            _displayname: playerRef
                        },
                        {caseInsensitive: true}
                    )[0].id;
                } else if (
                    findObjs(
                        {
                            _type: "player",
                            speakingas: playerRef
                        },
                        {caseInsensitive: true}
                    ).length > 0
                ) {
                    DB(
                        `... String is SPEAKING AS. Found ${
                            findObjs(
                                {
                                    _type: "player",
                                    speakingas: playerRef
                                },
                                {caseInsensitive: true}
                            ).length
                        } Players.`,
                        "getPlayerID"
                    );
                    return findObjs(
                        {
                            _type: "player",
                            speakingas: playerRef
                        },
                        {caseInsensitive: true}
                    )[0].id;
                } else if (
                    findObjs(
                        {
                            _type: "player",
                            _d20userid: playerRef
                        },
                        {caseInsensitive: true}
                    ).length > 0
                ) {
                    DB(
                        `... String is _d20userid. Found ${
                            findObjs(
                                {
                                    _type: "player",
                                    _d20userid: playerRef
                                },
                                {caseInsensitive: true}
                            ).length
                        } Players.`,
                        "getPlayerID"
                    );
                    return findObjs(
                        {
                            _type: "player",
                            _d20userid: playerRef
                        },
                        {caseInsensitive: true}
                    )[0].id;
                }
            }
            if (VAL({char: playerRef})) {
                let charObj = getChar(playerRef, true);
                for (const charData of _.values(Char.REGISTRY))
                    if (charData.isNPC === charObj.id) {
                        charObj = getChar(charData.id);
                        break;
                    }
                [playerID] = charObj
                    .get("controlledby")
                    .split(",")
                    .filter((x) => !["all", "", getGMID()].includes(x));
                DB(`PlayerRef identified as Character Object: ${D.JSL(charObj.get("name"))}... "controlledby": ${D.JSL(playerID)}`, "getPlayerID");
                return playerID || getGMID();
            }
            return (
                VAL({string: funcName})
                && THROW(`Unable to find player connected to reference '${jStrL(playerRef)}'`, `${D.JSL(funcName)} > getPlayerID`)
            );
        } catch (errObj) {
            return (
                VAL({string: funcName})
                && THROW(
                    `Unable to find player connected to reference '${jStrL(playerRef)}'.<br><br>${jStrL(errObj)}`,
                    `${D.JSL(funcName)} > getPlayerID`
                )
            );
        }
    };
    const getPlayer = (playerRef, funcName = false) => {
        const playerID = getPlayerID(playerRef, true);
        if (VAL({string: playerID}) && VAL({object: getObj("player", playerID)}))
            return getObj("player", playerID);
        else
            DB(
                `Searching for Player with Player Ref: ${playerRef}
                ... playerID: ${jStrL(playerID)}
                .. String? ${VAL({string: playerID})}
                .. Player Object? ${jStrL(getObj("player", playerID))}`,
                "getPlayer"
            );

        return (
            VAL({string: funcName}) && THROW(`Unable to find a player object for reference '${jStrL(playerRef)}`, `${D.JSL(funcName)} > getPlayer`)
        );
    };
    const isPlayerOnline = (playerRef) => (getPlayer(playerRef) || {get: () => false}).get("online");
    // #endregion

    // #region SETTERS: Attributes
    const setStats = (charRef, statList) => {
        const charObj = getChar(charRef);
        if (VAL({charObj, list: statList}, "setStats"))
            setAttrs(charObj.id, statList);
    };
    const setStat = (charRef, statName, statValue) => setStats(charRef, {[statName]: statValue});
    const setRepStats = (charRef, section, rowID, statList, funcName = false) => {
        const charObj = getChar(charRef, funcName);
        DB({charObj, section, rowID, statList}, "setRepStats");
        if (VAL({char: [charObj], string: [section], list: [statList]}, "setRepAttrs", true)) {
            const attrList = {};
            _.each(statList, (value, statName) => {
                if (["val", "value"].includes(statName))
                    statName = section.replace(/(left|mid|right)$/u, "");
                attrList[`repeating_${section}_${rowID}_${statName}`] = value;
            });
            DB({attrList}, "setRepStats");
            setAttrs(charObj.id, attrList);
        }
    };
    const setRepStat = (charRef, section, rowID, statName, statValue, funcName = false) => setRepStats(charRef, section, rowID, {[statName]: statValue}, funcName);
    const setCharData = (charRef, key, val) => {
        const {quadrant} = getCharData(charRef);
        state.VAMPIRE.Char.registry[quadrant][key] = val;
    };
    // #endregion

    // #region Repeating Section Manipulation
    const parseRepStat = (repRef) => {
        const repStatName = VAL({object: repRef}) ? repRef.get("name") : repRef;
        if (VAL({repname: repStatName})) {
            const nameParts = repStatName.split("_");
            nameParts.shift();
            return [nameParts.shift(), nameParts.shift(), nameParts.join("_")];
        }
        return [repStatName, repStatName, repStatName];
    };
    const makeRepRow = (charRef, secName, attrs) => {
        DB(`CharRef: ${D.JSL(charRef)}, secName: ${secName}, Attrs: ${D.JSL(attrs, true)}`, "makeRepRow");
        const IDa = 0;
        const IDb = [];
        const charID = D.GetChar(charRef).id;
        const characters = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
        const generateUUID = (() => () => {
            let IDc = new Date().getTime() + 0,
                IDf = 7;
            const IDd = IDc === IDa;
            const IDe = new Array(8);
            for (IDf; IDf >= 0; IDf--) {
                IDe[IDf] = characters.charAt(IDc % 64);
                IDc = Math.floor(IDc / 64);
            }
            IDc = IDe.join("");
            if (IDd) {
                for (IDf = 11; IDf >= 0 && IDb[IDf] === 63; IDf--)
                    IDb[IDf] = 0;
                IDb[IDf]++;
            } else {
                for (IDf = 0; IDf < 12; IDf++)
                    IDb[IDf] = Math.floor(64 * Math.random());
            }
            for (IDf = 0; IDf < 12; IDf++)
                IDc += characters.charAt(IDb[IDf]);

            return IDc;
        })();
        const makeRowID = () => generateUUID().replace(/_/gu, "Z");
        const rowID = makeRowID();
        const prefix = `repeating_${secName}_${rowID}_`;

        _.each(attrs, (v, k) => {
            if (_.isString(prefix + k) && (prefix + k).length > 12) {
                DB(`Making Row Object: Name: ${prefix + k}, CharID: ${charID}`, "makeRepRow");
                createObj("attribute", {
                    name: prefix + k,
                    max: "",
                    _characterid: charID,
                    current: v
                });
            } else {
                THROW(
                    `Failure at makeRepRow(charRef, ${D.JSL(secName)}, ${D.JSL(attrs)})<br>...Prefix (${D.JSL(prefix)}) + K (${D.JSL(
                        k
                    )}) is NOT A STRING)`,
                    "makeRepRow"
                );
            }
        });
        // DB(`Setting Attributes: ${D.JSL(attrList, true)}`, "makeRepRow")
        // setAttrs(charID, attrList)

        return rowID;
    };
    const deleteRepRow = (charRef, secName, rowID) => {
        if (VAL({char: [charRef], string: [secName, rowID]}, "deleteRepRow", true)) {
            const attrObjs = getRepStats(charRef, secName, rowID, null, null, "obj");
            DB(`AttrObjs to Delete: ${jStrL(attrObjs, true)}`, "deleteRepRow");
            if (attrObjs.length === 0)
                return THROW(`No row "repeating_${secName}_${rowID}" to delete for ${D.GetName(charRef)}.`, "deleteRepRow");
            _.each(attrObjs, (v) => v.remove());
            return true;
        }
        return false;
    };
    const copyToRepSec = (charRef, sourceSec, sourceRowID, targetSec) => {
        const attrList = kvpMap(
            getRepStats(charRef, sourceSec, sourceRowID),
            (k, v) => v.name,
            (v) => v.val
        );
        DB(
            `CharRef: ${D.JSL(charRef)}, SourceSec: ${sourceSec}, RowID: ${sourceRowID}, TargetSec: ${targetSec}<br>... AttrList: ${D.JSL(
                attrList,
                true
            )}`,
            "copyToRepSec"
        );
        makeRepRow(charRef, targetSec, attrList);
        deleteRepRow(charRef, sourceSec, sourceRowID);
    };
    const sortRepSec = (charRef, secName, sortTrait, isDescending = false, transformFunc = (v) => v) => {
        const rowIDs = getRepIDs(charRef, secName);
        const rowData = [];
        // let dbString = ""
        for (const rowID of rowIDs) {
            // dbString += `<br><br><b>${rowID}</b><br>`
            const rowAttrData = getRepStats(charRef, secName, rowID);
            const theseVals = {rowID};
            for (const statData of rowAttrData)
                theseVals[statData.attrName] = statData.val;
            // dbString += `... ${D.JS(statData.attrName, true)}: ${D.JS(theseVals[statData.attrName])}<br>`
            theseVals.SORTER = transformFunc(theseVals[sortTrait]);
            // dbString += `... SORTER: ${D.JS(theseVals.SORTER)}<br>`
            rowData.push(theseVals);
        }
        for (const rowID of rowIDs)
            deleteRepRow(charRef, secName, rowID);
        // D.Alert(dbString, "sortRepSec")
        // D.Alert(D.JS(rowData, true), "sortRepSec")
        const sortedData = _.sortBy(rowData, "SORTER");
        if (isDescending)
            sortedData.reverse();
        // D.Alert(D.JS(sortedData, true), "sortRepSec")
        for (let i = 0; i < sortedData.length; i++) {
            const attrList = _.omit(sortedData[i], "SORTER", "rowID");
            makeRepRow(charRef, secName, attrList);
        }
    };
    const splitRepSec = (charRef, sourceSec, targetSec, sortFunc, mode = "split") => {
        /* Will combine values from both source and target sections, sort them, then evenly split
              them between the two sections.  Split modes include:
                  "split" (default) — the bottom half of results will be moved to targetSec
                  "even" — even-numbered rows will be moved to targetSec
              Sortfunc must have parameters (charRef, secName, rowID1, rowID2) and return
              POSITIVE INTEGER if row1 should be ABOVE row2.  */
        // D.Alert(`splitRepSec(charRef, ${D.JS(sourceSec)}, ${D.JS(targetSec)}, sortFunc, ${D.JS(mode)})`, "DATA:SplitRepSec")

        // D.Alert("@@@ STARTING _.EACH COPYTOREPSEC @@@", "DATA:SplitRepSec")
        _.each(getRepIDs(charRef, targetSec), (id) => {
            copyToRepSec(charRef, targetSec, id, sourceSec);
        });
        const sortedIDs = sortRepSec(charRef, sourceSec, sortFunc);
        // D.Alert(`@@@ FINISHED _.EACH COPYTOREPSEC @@@<br><br><b>sortedIDs:</b><br>${D.JS(sortedIDs)}`, "DATA:SplitRepSec")
        switch (mode) {
            case "split":
                sortedIDs.splice(0, Math.ceil(sortedIDs.length / 2));
                // D.Alert(`@@@ SPLIT: STARTING SPLIT. @@@<br><br><b>sortedIDs (NEW):</b><br>${D.JS(sortedIDs)}`, "DATA:SplitRepSec")
                while (sortedIDs.length)
                    copyToRepSec(charRef, sourceSec, sortedIDs.shift(), targetSec);
                // D.Alert("@@@ SPLIT: FINISHED SPLIT.", "DATA:SplitRepSec")
                break;
            case "even":
                // D.Alert("@@@ EVEN: STARTING EVEN.", "DATA:SplitRepSec")
                for (let i = 0; i < sortedIDs.length; i++)
                    if (i % 2)
                        copyToRepSec(charRef, sourceSec, sortedIDs[i], targetSec);

                // D.Alert("@@@ EVEN: FINISHED EVEN.", "DATA:SplitRepSec")
                break;
            // no default
        }
    };
    // #endregion

    // #region SPECIAL FX
    const runFX = (name, pos) => {
        // Runs one of the special effects defined above.
        spawnFxWithDefinition(pos.left, pos.top, C.FX[name]);
    };
    // #endregion

    return {
        CheckInstall: checkInstall,
        OnChatCall: onChatCall,

        FUNCSONSTACK,

        get STACKLOG() {
            return STATE.REF.stackLog;
        },

        get STATSDICT() {
            return STATE.REF.STATSDICT;
        },
        get PCDICT() {
            return STATE.REF.PCDICT;
        },
        get NPCDICT() {
            return STATE.REF.NPCDICT;
        },
        get CHARWIDTH() {
            return STATE.REF.CHARWIDTH;
        },
        get MissingTextChars() {
            return STATE.REF.MissingTextChars;
        },
        set MissingTextChars(char) {
            if (char.length > 1 && char.startsWith("!"))
                STATE.REF.MissingTextChars = _.without([...STATE.REF.MissingTextChars], char.charAt(1));
            else if (char.length === 1)
                STATE.REF.MissingTextChars = _.uniq([...STATE.REF.MissingTextChars, char]);
        },

        GetPageID: (pageRef) => VALS.PAGEID(pageRef),
        get MAINPAGEID() {
            return VALS.PAGEID("GAME");
        },
        get THISPAGEID() {
            return VALS.PAGEID();
        },
        get CELLSIZE() {
            return VALS.CELLSIZE();
        },
        GetCellSize: (pageRef) => VALS.CELLSIZE(pageRef),

        get IsReportingListener() {
            return STATE.REF.isReportingListener;
        },
        get IsForcingDebug() {
            return STATE.REF.ISFORCINGDEBUGGING;
        },

        Queue: queueFunc,
        Run: runFuncQueue,
        IsFuncQueueClear: isFuncQueueClear,
        JSRaw: jsRaw,
        JS: jStr,
        JSL: jStrL,
        JSH: jStrH,
        JSC: jStrC,
        JSX: jStrX,
        HTML: makeHTMLElement,
        ParseArray: parseArray,
        ParseParams: parseParams,
        ParseCharSelection: parseCharSelect,
        RandomString: randomString,
        SumHTML: summarizeHTML,
        TruncText: ellipsisText,
        Int: pInt,
        Float: pFloat,
        TimeMS: pTimeInMS,
        LCase: pLowerCase,
        UCase: pUpperCase,
        Round: roundSig,
        Bound: boundNum,
        Cycle: cycleNum,
        RandInt: randInt,
        Pad: padNum,
        Sign: signNum,
        NumToText: numToText,
        TextToNum: textToNum,
        Ordinal: ordinal,
        Romanize: numToRomanNum,
        Capitalize: capitalize,
        Clone: clone,
        Merge: merge,
        FilterForObjAttrs: filterForObjAttrs,
        FilterForChanges: filterForChanges,
        Gradient: colorGradient,
        RGBtoHEX: rbgToHex,
        ParseStack: parseStack,
        ONSTACK: putOnStack,
        OFFSTACK: pullOffStack,

        Call: sendAPICommand,
        Chat: sendChatMessage,
        Alert: sendToGM,
        Show: (object) => sendToGM(jStrX(object), "Showing Object", 0, true),
        Flag: (msg) => sendToGM(null, msg),
        Poke: (msg, title = "[ALERT]") => {
            if (Session.IsTesting)
                sendToGM(msg, title);
        },
        Prompt: promptGM,
        CommandMenu: commandMenu,
        CommandMenuHTML: getCommandMenuHTML,

        RemoveFirst: removeFirst,
        PullIndex: pullIndex,
        PullOut: pullElement,
        Last: getLast,
        KeyMapObj: kvpMap,
        ParseToObj: parseToObj,
        ClassToObj: classToObject,

        LooseMatch: looseMatch, // more strict than fuzzyMatch: case-insensitive matching but everything else is still required
        FuzzyMatch: fuzzyMatch,
        IsIn: isIn,
        Validate: validate,
        IsID: isID,

        SetDebugWatchList: setWatchList,
        GetDebugWatchList: getWatchList,
        SetTempDebugWatch: setTempWatchList,
        get WatchList() {
            return STATE.REF.WATCHLIST;
        },
        get BlackList() {
            return STATE.REF.BLACKLIST;
        },
        Log: logDebugAlert,
        ThrowError: throwError,
        DBAlert: sendDebugAlert,
        GetDebugRecord: getDebugRecord,
        TraceStart: traceFuncStart,
        TraceStop: traceFuncStop,

        GMID: getGMID,
        IsOnline: isPlayerOnline,
        get GMOnline() { return isPlayerOnline(getGMID()) },
        GetSelected: getSelected,
        GetName: getName,
        GetChars: getChars,
        GetChar: getChar,
        GetCharData: getCharData,
        GetCharVals: getCharsProps,
        GetStat: getStat,
        GetStatVal: getStatVal,
        GetRepIDs: getRepIDs,
        GetRepStats: getRepStats,
        GetRepStat: getRepStat,
        GetPlayerID: getPlayerID,
        GetPlayer: getPlayer,

        SetCharData: setCharData,
        SetStat: setStat,
        SetStats: setStats,
        SetRepStats: setRepStats,
        SetRepStat: setRepStat,

        ParseRepStat: parseRepStat,
        CopyToSec: copyToRepSec,
        SortRepSec: sortRepSec,
        SplitRepSec: splitRepSec,
        MakeRow: makeRepRow,
        DeleteRow: deleteRepRow,

        RunFX: runFX
    };
})();

on("ready", () => {
    D.CheckInstall();
    D.Log("DATA Ready!");
});
void MarkStop("D");
