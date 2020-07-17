void MarkStart("Listener");
const Listener = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Listener";
    const SCRIPTCALLS = {};
    const OBJECTS = {graphic: [], text: [], character: []};

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
    const TRACEON = (funcName, funcParams = [], msg = "") => D.TraceStart(funcName, funcParams, SCRIPTNAME, msg);
    const TRACEOFF = (funcID, returnVal) => D.TraceStop(funcID, returnVal);

    const checkInstall = () => {
        C.RO.OT[SCRIPTNAME] = C.RO.OT[SCRIPTNAME] || {};
        initialize();
    };
    const handleMessage = (msg, isRaw = false) => {
        if (!msg.content.includes("DB LISTENER: ListenFull"))
            DB({msg}, "ListenFull");
        if (msg.content.match(/^!?!playerspoof/gu)) {
            const [, charRef] = msg.content.split(" ");
            let playerid, who;
            if (charRef)
                [playerid, who] = [D.GetPlayerID(charRef.replace(/^@/gu, "")), D.GetName(charRef.replace(/^@/gu, ""))];
            if (playerid) {
                Media.ToggleText("PlayerSpoofNotice", true);
                Media.ToggleText("PlayerSpoofNoticeSplash", true);
                Media.SetText("PlayerSpoofNotice", `Spoofing: ${who}`);
                Media.SetText("PlayerSpoofNoticeSplash", `Spoofing: ${who}`);
                STATE.REF.GMPlayerSpoof = {playerid, who};
                D.Alert(`Now spoofing ${who}`, "Listener Player Spoofing");
            } else {
                Media.ToggleText("PlayerSpoofNotice", false);
                Media.ToggleText("PlayerSpoofNoticeSplash", false);
                STATE.REF.GMPlayerSpoof = false;
                D.Alert("Player Spoofing DISABLED", "Listener Player Spoofing");
            }
            return true;
        } else {
            if (STATE.REF.isLocked || msg.type !== "api")
                return false;
            msg.who = msg.who || "API";
            if (!isRaw && !msg.content.startsWith("!!") && STATE.REF.GMPlayerSpoof && playerIsGM(msg.playerid)) {
                msg.playerid = STATE.REF.GMPlayerSpoof.playerid;
                msg.who = D.LCase(msg.who) === "api" ? msg.who : STATE.REF.GMPlayerSpoof.who;
            }
            msg.content = msg.content.replace(/^!!/gu, "!");
            let [call, args] = parseArgString(msg.content); // Splits by space unless surrounded by quotes; removes whitespace and comma separators
            if (call in SCRIPTCALLS.MESSAGE) {
                const scriptData = SCRIPTCALLS.MESSAGE[call];
                if (scriptData
                    && scriptData.script
                    && VAL({function: scriptData.script.OnChatCall})
                    && (!scriptData.gmOnly || playerIsGM(msg.playerid) || msg.playerid === "API")
                ) {
                    const traceID = TRACEON("onChat:message", [msg]);
                    if (scriptData.isAlertingOnCall && VAL({function: scriptData.script.OnChatCallAlert}))
                        scriptData.script.OnChatCallAlert([call, ...args], msg.playerid);
                    const [objects, returnArgs] = parseMessage(args, msg, SCRIPTCALLS.MESSAGE[call].needsObjects !== false);
                    DB({call, args, objects, returnArgs}, "regHandlers");
                    call = (scriptData.singleCall && returnArgs.shift()) || call;
                    if (D.WatchList.includes("Listen"))
                        D.Poke(
                            [
                                `<b>${msg.content}</b>`,
                                `CALL: ${call}`,
                                `ARGS: ${returnArgs.join(" | ")}`,
                                `OBJECTS: ${D.JS(objects)}`,
                                " ",
                                `FULL MESSAGE: ${D.JS(msg)}`
                            ].join("<br>"),
                            "LISTENER RESULTS"
                        );
                    scriptData.script.OnChatCall(call, returnArgs, objects, msg);
                    TRACEOFF(traceID);
                }
                return true;
            }
            return false;
        }
    };
    const regHandlers = () => {
        on("chat:message", handleMessage);
        on("change:attribute:current", (attrObj, prevData) => {
            let wasScriptFound = false;
            /* DB({
                    ["CHANGE:ATTR:CURRENT"]: Object.assign({}, attrObj),
                    ["... from"]: prevData,
                    ["Was Real Change?"]: attrObj.get("current") !== prevData.current,
                    [">> Name"]: attrObj.get("name").toLowerCase().replace(/^(.*_){3}/gu, "")
                }, "Listen") */
            if (attrObj.get("current") !== prevData.current) {
                const call = attrObj
                    .get("name")
                    .toLowerCase()
                    .replace(/^(.*_){3}/gu, "");
                for (const [attrKeys, scriptData] of SCRIPTCALLS.ATTRCHANGE)
                    for (const attrKey of attrKeys)
                        if (call.includes(attrKey)) {
                            scriptData.script.OnAttrChange(call, attrObj, prevData.current);
                            wasScriptFound = true;
                        }
            }
            return wasScriptFound;
        });
        on("add:attribute", (attrObj) => {
            let wasScriptFound = false;
            // DB({["ADD:ATTR"]: Object.assign({}, attrObj)}, "Listen")
            const call = attrObj
                .get("name")
                .toLowerCase()
                .replace(/^(.*_){3}/gu, "");
            for (const [attrKeys, scriptData] of SCRIPTCALLS.ATTRADD)
                for (const attrKey of attrKeys)
                    if (call.includes(attrKey)) {
                        scriptData.script.OnAttrAdd(call, attrObj);
                        wasScriptFound = true;
                    }
            return wasScriptFound;
        });
        on("destroy:attribute", (attrObj) => {
            let wasScriptFound = false;
            // DB({["DESTROY:ATTR"]: Object.assign({}, attrObj)}, "Listen")
            const call = attrObj
                .get("name")
                .toLowerCase()
                .replace(/^(.*_){3}/gu, "");
            for (const [attrKeys, scriptData] of SCRIPTCALLS.ATTRDESTROY)
                for (const attrKey of attrKeys)
                    if (call.includes(attrKey)) {
                        scriptData.script.OnAttrDestroy(call, attrObj);
                        wasScriptFound = true;
                    }
            return wasScriptFound;
        });
        on("add:graphic", (imgObj) => {
            let wasScriptFound = false;
            for (const scriptData of SCRIPTCALLS.IMGADD) {
                scriptData.script.OnGraphicAdd(imgObj);
                wasScriptFound = true;
            }
            return wasScriptFound;
        });
        on("change:graphic", (imgObj, prevData) => {
            let wasScriptFound = false;
            for (const scriptData of SCRIPTCALLS.IMGCHANGE) {
                scriptData.script.OnGraphicChange(imgObj, prevData);
                wasScriptFound = true;
            }
            return wasScriptFound;
        });
        on("change:campaign:playerpageid", () => {
            let wasScriptFound = false;
            for (const scriptData of SCRIPTCALLS.PAGECHANGE) {
                scriptData.script.OnPageChange();
                wasScriptFound = true;
            }
            return wasScriptFound;
        });
        on("change:jukeboxtrack", (trackObj, prevData) => {
            let wasScriptFound = false;
            DB({trackObj, prevData}, "OnTrackChange");
            for (const scriptData of SCRIPTCALLS.TRACKCHANGE) {
                scriptData.script.OnTrackChange(trackObj, prevData);
                wasScriptFound = true;
            }
            return wasScriptFound;
        });
        on("add:character", (charObj) => {
            let wasScriptFound = false;
            DB({charObj}, "OnCharAdd");
            for (const scriptData of SCRIPTCALLS.CHARADD) {
                scriptData.script.OnCharAdd(charObj);
                wasScriptFound = true;
            }
            return wasScriptFound;
        });
    };
    // #endregion

    // #region LOCAL INITIALIZATION
    const initialize = () => {
        STATE.REF.isLocked = STATE.REF.isLocked || false;
        STATE.REF.objectLog = STATE.REF.objectLog || [];
        SCRIPTCALLS.MESSAGE = _.omit(
            {
                "!char": {script: Char, gmOnly: true, singleCall: true},
                "!data": {script: D, gmOnly: true, singleCall: false},
                "!reply": {script: D, gmOnly: true, singleCall: false},
                "!dpad": {script: DragPads, gmOnly: true, singleCall: true},
                "!fuzzy": {script: Fuzzy, gmOnly: true, singleCall: true},
                "!handouts": {script: Handouts, gmOnly: true, singleCall: true},
                "!state": {script: Chat, gmOnly: true, singleCall: false},
                "!get": {script: Chat, gmOnly: true, singleCall: false, needsObjects: false},
                "!set": {script: Chat, gmOnly: true, singleCall: false},
                "!clear": {script: Chat, gmOnly: true, singleCall: false},
                "!find": {script: Chat, gmOnly: true, singleCall: false},
                "!comp": {script: Complications, gmOnly: true, singleCall: true},
                "!loc": {script: Locations, gmOnly: true, singleCall: true},
                "!media": {script: Media, gmOnly: true, singleCall: false},
                "!area": {script: Media, gmOnly: true, singleCall: false},
                "!img": {script: Media, gmOnly: true, singleCall: false},
                "!text": {script: Media, gmOnly: true, singleCall: false},
                "!anim": {script: Media, gmOnly: true, singleCall: false},
                "!snd": {script: Media, gmOnly: true, singleCall: false},
                "!sound": {script: Soundscape, gmOnly: true, singleCall: true, needsObjects: false},
                "!pcom": {script: Player, gmOnly: false, singleCall: false, needsObjects: false},
                "!mvc": {script: Player, gmOnly: false, singleCall: false, needsObjects: false},
                "!endmonologue": {script: Player, gmOnly: false, singleCall: false, needsObjects: false},
                "!gmcommand": {script: Player, gmOnly: false, singleCall: false, needsObject: false},
                "!token": {script: Player, gmOnly: false, singleCall: false},
                "!links": {script: Player, gmOnly: false, singleCall: false, needsObjects: false},
                "!prompt": {script: Player, gmOnly: false, singleCall: false},
                "!roll": {script: Roller, isAlertingOnCall: true, gmOnly: false, singleCall: true},
                "!sess": {script: Session, gmOnly: true, singleCall: true},
                "!test": {script: Tester, gmOnly: true, singleCall: true},
                "!time": {script: TimeTracker, gmOnly: true, singleCall: true, needsObjects: false}
            },
            (v) => v.script === {}
        );
        SCRIPTCALLS.ATTRCHANGE = _.reject(
            [
                [
                    [
                        "hunger",
                        "desire",
                        "projectstake",
                        "triggertimelinesort",
                        "health_impair_toggle",
                        "willpower_impair_toggle",
                        "humanity_impair_toggle",
                        "stains"
                    ],
                    {script: Char}
                ]
            ],
            (v) => v[1].script === {}
        );
        SCRIPTCALLS.ATTRADD = _.reject([[["desire", "projectstake", "triggertimelinesort"], {script: Char}]], (v) => v[1].script === {});
        SCRIPTCALLS.ATTRDESTROY = _.reject([[["desire"], {script: Char}]], (v) => v[1].script === {});
        SCRIPTCALLS.IMGCHANGE = _.reject(
            [
                {script: DragPads},
                {script: Media}
            ], (v) => v.script === {}
        );
        SCRIPTCALLS.IMGADD = _.reject([{script: Media}], (v) => v.script === {});
        SCRIPTCALLS.PAGECHANGE = _.reject([{script: Session}], (v) => v.script === {});
        SCRIPTCALLS.TRACKCHANGE = _.reject([{script: Soundscape}], (v) => v.script === {});
        SCRIPTCALLS.CHARADD = _.reject([{script: Char}], (v) => v.script === {});
        refreshObjects(true);
    };
    // #endregion

    const parseArgString = (argString) => {
        // Splits argument string by space, unless spaces are contained within quotes.
        // Strips quotes used to isolate arguments
        // Removes leading/trailing whitespace
        // Removes commas between arguments
        const [call, ...args] = _.compact(
            (argString.match(/!\S*|\s@"[^"]*"|\s@[^\s]*|\s"[^"]*"|\s[^\s]*/gu) || []).map((x) => x.replace(/^\s*(@)?"?|"?"?\s*$/gu, "$1"))
        );
        return [call, args];
    };
    const parseMessage = (args, msg, needsObjects) => {
        const isReturningSelected = args.every((x) => !x.startsWith("@"));
        const [objects, returnArgs] = needsObjects ? getObjsFromArgs(args) : [{}, args];
        // For each type, if no objects found in args AND no objects called for with '@', check selection:
        if (needsObjects && isReturningSelected && VAL({selection: msg}))
            for (const type of ["character", "graphic", "text"]) {
                const selObjs = D.GetSelected(msg, type);
                if (selObjs.length) {
                    if (!objects[type] || !objects[type].length) {
                        objects[type] = objects[type] || [];
                        objects[type].push(...selObjs);
                    }
                    objects.selected = objects.selected || {};
                    objects.selected[type] = objects.selected[type] || [];
                    objects.selected[type].push(...selObjs);
                }
            }
        DB({args, needsObjects, objects, returnArgs}, "parseMessage");
        return [objects, returnArgs];
    };
    const getObjsFromArgs = (args = []) => {
        const objects = {};
        const argParser = (argString) => {
            if (
                argString.startsWith("@")
                || argString
                    .split(",")
                    .map((x) => x.trim())
                    .some(D.IsID)
            ) {
                const objsFound = parseArgument(argString.replace(/^@/gu, ""));
                DB({argString, args, objsFound}, "getObjsFromArgs");
                for (const objType of Object.keys(objsFound))
                    objects[objType] = _.compact(_.uniq([...(objects[objType] || []), ...objsFound[objType]]));
                if (Object.values(objsFound).some((x) => x.length))
                    D.PullOut(args, (v) => v === argString);
            }
        };
        for (const arg of D.Clone(args))
            argParser(arg);
        DB({args, objects}, "getObjsFromArgs");
        return [objects, _.compact(args)];
    };
    const parseArgument = (argString, typeLock = null, isFuzzy = false) => {
        const returnObjs = {};
        const dbLines = {initialArgString: argString, typeLock, isFuzzy};
        const argCommaSplit = _.compact(argString.split(/,/gu).map((x) => x.trim()));
        const returnIDs = [];

        // 1) Check if this could be an ID string OR a comma-delimited list of ID strings:
        for (const arg of D.Clone(argCommaSplit))
            if (D.IsID(arg.trim())) {
                returnIDs.push(arg.trim());
                D.PullOut(argCommaSplit, (v) => v === arg);
            }
        argString = argCommaSplit.join(",");
        dbLines.postIDArgString = argString;
        dbLines.returnIDs = returnIDs;

        // 2) Send through to type-specific functions.
        const objTypes = (typeLock && [typeLock]) || ["character", "graphic", "text"];
        for (const objType of objTypes)
            returnObjs[objType] = _.compact(parseArgByType[objType](argString, returnIDs, isFuzzy));
        dbLines.returnObjs = D.Clone(returnObjs);
        DB(dbLines, "parseArgument");
        return returnObjs;
    };
    const parseArgByType = {
        character: (argString, ids = [], isFuzzy = false) => {
            const charObjs = [];
            for (const charID of ids)
                charObjs.push(getObj("character", charID) || null);
            return _.compact([...charObjs, ...((argString && D.GetChars(argString, null, isFuzzy)) || [])]);
        },
        graphic: (argString, ids = []) => {
            DB({type: "graphic", argString, ids}, "parseArgByType");
            const graphicObjs = [];
            for (const graphicID of ids)
                graphicObjs.push(getObj("graphic", graphicID) || null);
            DB({type: "graphic", argString, ids, idObjs: graphicObjs, argObjs: Media.GetImgs(argString)}, "parseArgByType");
            return _.compact([...graphicObjs, ...((argString && Media.GetImgs(argString)) || [])]);
        },
        text: (argString, ids = []) => {
            const textObjs = [];
            for (const textID of ids)
                textObjs.push(getObj("text", textID) || null);
            return _.compact([...textObjs, ...((argString && Media.GetTexts(argString)) || [])]);
        }
    };
    const refreshObjects = () => {
        const allObjects = findObjs({});
        OBJECTS.graphic = allObjects.filter((x) => x.get("_type") === "graphic");
        OBJECTS.text = allObjects.filter((x) => x.get("_type") === "text");
        OBJECTS.character = allObjects.filter((x) => x.get("_type") === "character");
        DB({graphics: OBJECTS.graphic.length, text: OBJECTS.text.length, chars: OBJECTS.character.length}, "refreshObjects");
    };
    const getAllObjs = (objects, type) => {
        type = D.IsIn(type, ["character", "graphic", "text"]);
        const returnObjs = _.uniq(_.flatten(_.compact([...(objects[type] || []), ...((objects.selected && objects.selected[type]) || [])])));
        DB({objects, type, returnObjs}, "getAllObjs");
        if (returnObjs.length) {
            STATE.REF.objectLog[type] = returnObjs.map((x) => x.id).join(",");
            DB({objectLog: returnObjs.map((x) => x.id).join(","), stateRef: STATE.REF.objectLog}, "getAllObjs");
            return returnObjs;
        }
        return (STATE.REF.objectLog[type] && STATE.REF.objectLog[type].split(",").map((x) => getObj(type, x))) || [];
    };
    const parseParams = (args, delim = " ") => {
        args = VAL({array: args}) ? args.join(" ") : args;
        if (VAL({string: args}))
            return _.object(
                args
                    .split(new RegExp(`,?${delim.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}+`, "gu"))
                    .filter((x) => x.includes(":"))
                    .map((x) => x
                        .trim()
                        .split(":")
                        .map((xx) => (VAL({number: xx}) ? D.Float(xx, 2) : xx)))
            );
        return {};
    };
    const lockListener = () => {
        STATE.REF.isLocked = true;
    };
    const unlockListener = () => {
        STATE.REF.isLocked = false;
    };

    return {
        RegisterEventHandlers: regHandlers,
        CheckInstall: checkInstall,

        ParseParams: parseParams,
        GetObjects: getAllObjs,
        Lock: lockListener,
        Unlock: unlockListener,
        Refresh: refreshObjects,

        SendRawCall: (msg) => handleMessage(msg, true)
    };
})();

on("ready", () => {
    Listener.RegisterEventHandlers();
    Listener.CheckInstall();
    D.Log("Listener Ready!");
});
void MarkStop("Listener");
