void MarkStart("Listener")
const Listener = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Listener",
        SCRIPTCALLS = {},
        CHARCALLS = [
            "registered",
            "active",
            "all",
            "npcs",
            "sandbox"
        ],

    // #region COMMON INITIALIZATION
        STATE = {get REF() { return C.RO.OT[SCRIPTNAME] }},	// eslint-disable-line no-unused-vars
        VAL = (varList, funcName, isArray = false) => D.Validate(varList, funcName, SCRIPTNAME, isArray), // eslint-disable-line no-unused-vars
        DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        LOG = (msg, funcName) => D.Log(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        THROW = (msg, funcName, errObj) => D.ThrowError(msg, funcName, SCRIPTNAME, errObj), // eslint-disable-line no-unused-vars

        checkInstall = () => {
            C.RO.OT[SCRIPTNAME] = C.RO.OT[SCRIPTNAME] || {}
            initialize()
        },
        regHandlers = () => {
            on("chat:message", msg => {
                if (STATE.REF.isLocked)
                    return false
                const args = msg.content.split(/\s+/u)
                if (msg.type === "api") {
                    let call = args.shift().toLowerCase()
                    const scriptData = SCRIPTCALLS.MESSAGE[call]
                    msg.who = msg.who || "API"
                    if (scriptData && scriptData.script && VAL({function: scriptData.script.OnChatCall}) && (!scriptData.gmOnly || playerIsGM(msg.playerid) || msg.playerid === "API") ) {
                        const [objects, returnArgs] = parseMessage(args, msg)
                        call = scriptData.singleCall && returnArgs.shift() || call
                        if (D.IsReportingListener)
                            D.Poke([
                                `<b>${msg.content}</b>`,
                                `CALL: ${call}`,
                                `ARGS: ${returnArgs.join(" ")}`,
                                `OBJECTS: ${D.JS(objects)}`
                            ].join("<br>"), "LISTENER RESULTS")
                        scriptData.script.OnChatCall(call, returnArgs, objects, msg)
                    }
                }
                return true
            })
            on("change:attribute:current", (attrObj, prevData) => {
                if (attrObj.get("current") !== prevData.current) {
                    const call = attrObj.get("name").toLowerCase().replace(/^repeating_.*?_.*?_/gu, "")
                    for (const [attrKeys, scriptData] of SCRIPTCALLS.ATTRCHANGE)
                        for (const attrKey of attrKeys)
                            if (call.includes(attrKey))
                                return scriptData.script.OnAttrChange(call, attrObj)
                }
                return false
            })
            on("add:attribute", attrObj => {
                const call = attrObj.get("name").toLowerCase().replace(/^repeating_.*?_.*?_/gu, "")
                for (const [attrKeys, scriptData] of SCRIPTCALLS.ATTRADD)
                    for (const attrKey of attrKeys)
                        if (call.includes(attrKey))
                            return scriptData.script.OnAttrAdd(call, attrObj)
                return false
            })
            on("add:graphic", imgObj => {
                for (const scriptData of SCRIPTCALLS.IMGADD)
                    return scriptData.script.OnGraphicAdd(imgObj)
                return false
            })
            on("change:graphic", imgObj => {
                for (const scriptData of SCRIPTCALLS.IMGCHANGE)
                    return scriptData.script.OnGraphicChange(imgObj)
                return false
            })
        },
    // #endregion

    // #region LOCAL INITIALIZATION
        initialize = () => { // eslint-disable-line no-empty-function
            STATE.REF.isLocked = STATE.REF.isLocked || false
            SCRIPTCALLS.MESSAGE = _.omit({
                "!char": {script: Char, gmOnly: true, singleCall: true},
                "!data": {script: D, gmOnly: true, singleCall: false},
                "!reply": {script: D, gmOnly: true, singleCall: false},
                "!dpad": {script: DragPads, gmOnly: true, singleCall: true},
                "!fuzzy": {script: Fuzzy, gmOnly: true, singleCall: true},
                "!handouts": {script: Handouts, gmOnly: true, singleCall: true},
                "!get": {script: Chat, gmOnly: true, singleCall: false},
                "!set": {script: Chat, gmOnly: true, singleCall: false},
                "!clear": {script: Chat, gmOnly: true, singleCall: false},
                "!find": {script: Chat, gmOnly: true, singleCall: false},
                "!comp": {script: Complications, gmOnly: true, singleCall: true},
                "!media": {script: Media, gmOnly: true, singleCall: false},
                "!area": {script: Media, gmOnly: true, singleCall: false},
                "!img": {script: Media, gmOnly: true, singleCall: false},
                "!text": {script: Media, gmOnly: true, singleCall: false},
                "!anim": {script: Media, gmOnly: true, singleCall: false},
                "!sound": {script: Media, gmOnly: true, singleCall: false},
                "!mvc": {script: Player, gmOnly: false, singleCall: false},
                "!sense": {script: Player, gmOnly: false, singleCall: false},
                "!awe": {script: Player, gmOnly: false, singleCall: false},
                "!hide": {script: Player, gmOnly: false, singleCall: false},
                "!roll": {script: Roller, gmOnly: false, singleCall: true},
                "!sess": {script: Session, gmOnly: true, singleCall: true},
                "!test": {script: Tester, gmOnly: true, singleCall: true},
                "!time": {script: TimeTracker, gmOnly: true, singleCall: true}
            }, v => v.script === {})
            SCRIPTCALLS.ATTRCHANGE = _.reject([
                [ ["hunger", "desire", "projectstake", "triggertimelinesort"], {script: Char} ]
            ], v => v[1].script === {})
            SCRIPTCALLS.ATTRADD = _.reject([
                [ ["desire", "projectstake", "triggertimelinesort"], {script: Char} ]
            ], v => v[1].script === {})
            SCRIPTCALLS.IMGCHANGE = _.reject([
                {script: DragPads}
            ], v => v.script === {})
            SCRIPTCALLS.IMGADD = _.reject([
                {script: Media}
            ], v => v.script === {})
        },
    // #endregion

        getAllObjs = (objects, type) => {
            type = D.IsIn(type, ["character", "graphic", "text"])
            return _.uniq(_.flatten(_.compact([...objects[type] || [], ...objects.selected && objects.selected[type] || []])))
        },
        parseParams = (args, delim = " ") => _.object(
            (VAL({array: args}) ? args.join(" ") : args).
                split(new RegExp(`,?${delim}+`, "gu")).
                filter(x => x.includes(":")).
                map(x => x.trim().split(":").map(xx => VAL({number: xx}) ? D.Int(xx) : xx))
        ),
        parseArg = {
            character: (arg, isFuzzy = false) => {
                const charObjs = []
                // 1) Check if this could be an ID string:
                if (arg.length === 20) {
                    const obj = getObj("character", arg)
                    if (obj)
                        charObjs.push(obj)
                // 2) Check if this is a valid character selection string ("registered", "active", etc.)
                } else if (CHARCALLS.includes(arg)) {
                    charObjs.push(...D.GetChars(arg))
                } else {
                    // 3) Check if it is a character registry key:
                    const regKey = _.keys(Char.REGISTRY).find(x => x.toLowerCase() === arg.toLowerCase())
                    if (regKey)
                        charObjs.push(getObj("character", Char.REGISTRY[regKey].id))
                }
                // *** FUZZY BREAK: Only Continue if Fuzzy-Matching (and no chars found yet) ***
                if (!charObjs.length && isFuzzy) {
                    // 4) Check if D.GetChars returns a value:
                    const objs = D.GetChars(arg, true)
                    if (objs.length)
                        charObjs.push(...objs)
                }
                DB(`Returning CHARACTERS: ${D.JSL(charObjs)}`, "parseArg")
                return charObjs
            },
            graphic: (arg, isFuzzy = false) => {
                const graphicObjs = []
                // 1) Check if this could be an ID string:
                if (arg.length === 20) {
                    const obj = getObj("graphic", arg)
                    if (obj)
                        graphicObjs.push(obj)
                } else {
                    // 2) Check if it is a registered graphic object:
                    const regKey = _.keys(Media.IMAGES).find(x => x.toLowerCase() === arg.toLowerCase() || x.toLowerCase() === arg.toLowerCase().replace(/_\d+$/gu, ""))
                    if (regKey)
                        graphicObjs.push(Media.GetImg(regKey))
                }
                // *** FUZZY BREAK: Only Continue if Fuzzy-Matching (and no graphics found yet) ***
                if (!graphicObjs.length && isFuzzy) {
                    // 4) Check if Media.GetImg returns a value:
                    const obj = Media.GetImg(arg, true)
                    if (obj)
                        graphicObjs.push(obj)
                }
                return graphicObjs
            },
            text: (arg, isFuzzy = false) => {
                const textObjs = []
                // 1) Check if this could be an ID string:
                if (arg.length === 20) {
                    const obj = getObj("text", arg)
                    if (obj)
                        textObjs.push(obj)
                } else {
                    // 2) Check if it is a registered text object:
                    const regKey = _.keys(Media.TEXT).find(x => x.toLowerCase() === arg.toLowerCase())
                    if (regKey)
                        textObjs.push(Media.GetText(regKey))
                }
                // *** FUZZY BREAK: Only Continue if Fuzzy-Matching (and no text objects found yet) ***
                if (!textObjs.length && isFuzzy) {
                    // 4) Check if Media.GetText returns a value:
                    const obj = Media.GetText(arg, true)
                    if (obj)
                        textObjs.push(obj)
                }
                return textObjs
            }
        },
        getObjsFromArgs = (args) => { // returns [objects, args]
            const objects = {},
                returnArgs = []
            if (VAL({array: args}, "getObjsFromArgs") && args.length) {
                // First, grab characters from initial character string
                const initialCharObjs = _.uniq(_.flatten(_.compact((args[0] || "").split(",").map(x => parseArg.character(x.trim(), false)))))
                if (initialCharObjs.length) {
                    objects.character = [...initialCharObjs]
                    args.shift()
                }
                DB(`Objects: ${D.JSL(objects)}, Args: ${D.JSL(args)}, <br>LENGTHS: ${D.JSL(D.KeyMapObj(objects, null, v => v.length))}`, "getObjsFromArgs")
                for (const arg of args) {
                    const [theseObjs, theseReturnArgs] = [{}, []]
                    // Split the arg as if comma-delimited:
                    for (const thisArg of arg.split(",")) {
                        const prevObjCount = _.flatten(_.values(theseObjs)).length
                        // Check for non-fuzzy references:
                        for (const type of ["character", "graphic", "text"]) {
                            const objs = _.compact(parseArg[type](thisArg, false))
                            if (objs.length) {
                                theseObjs[type] = theseObjs[type] || []
                                theseObjs[type].push(...objs)
                                DB(`Strict Objs Found: ${D.JSL(theseObjs)}`, "getObjsFromArgs")
                            }
                        }
                        // If no objs found, try again with fuzzy references:
                        if (_.flatten(_.values(theseObjs)).length === prevObjCount)
                            for (const type of ["character", "graphic", "text"]) {
                                const objs = _.compact(parseArg[type](thisArg, true))
                                if (objs.length) {
                                    theseObjs[type] = theseObjs[type] || []
                                    theseObjs[type].push(...objs)
                                    DB(`Fuzzy Objs Found: ${D.JSL(theseObjs)}`, "getObjsFromArgs")
                                }
                            }
                        // If no objs found, add arg to theseReturnArgs for further processing by HandleInput
                        if (_.flatten(_.values(theseObjs)).length === prevObjCount)
                            theseReturnArgs.push(thisArg)
                    }
                    // Add found objects and any return args to main variables:
                    _.each(theseObjs, (objs, type) => { if (_.flatten(objs).length) {
                        DB(`... OBJECTS: ${D.JSL(objects)}<br>LENGTHS: ${D.JSL(D.KeyMapObj(objects, null, v => v.length))}`, "getObjsFromArgs")
                        objects[type] = objects[type] || []
                        objects[type].push(objs) 
                        DB(`... type (${type}), length (${objs.length}), adding: ${D.JSL(objs)}<br>OBJECTS: ${D.JSL(objects)}`, "getObjsFromArgs")
                    }})
                    returnArgs.push(theseReturnArgs.join(","))
                    DB(`Objects: ${D.JSL(objects)}`, "getObjsFromArgs")
                }
                // Finally, do one last check for a character match with the last two, and then the last three arguments joined:
                if (returnArgs.length > 1) {
                    let charNameTest = [returnArgs.pop(), returnArgs.pop()].reverse().join(" "),
                        charObjTest = D.GetChar(charNameTest)
                    if (charObjTest) {
                        objects.character.push([charObjTest])
                    } else if (returnArgs.length) {
                        charNameTest = `${returnArgs.pop()} ${charNameTest}`
                        charObjTest = D.GetChar(charNameTest)
                        if (charObjTest)
                            objects.character.push([charObjTest])
                    }
                    if (!charObjTest)
                        returnArgs.push(...charNameTest.split(" "))
                }
            }
            DB(`Returning:<br>OBJECTS: ${D.JSL(objects)}`, "getObjsFromArgs")
            return [objects, _.compact(returnArgs)]
        },
        parseMessage = (args, msg) => {
            const [objects, returnArgs] = getObjsFromArgs(args)
            // For each type, if no objects found in args, check selection:
            if (VAL({selection: msg}))
                for (const type of ["character", "graphic", "text"]) {
                    const selObjs = D.GetSelected(msg, type)
                    if (selObjs.length) {
                        if (!objects[type] || !objects[type].length) {
                            objects[type] = objects[type] || []
                            objects[type].push(selObjs)
                        }
                        objects.selected = objects.selected || {}
                        objects.selected[type] = objects.selected[type] || []
                        objects.selected[type].push(selObjs)
                    }
                }
            return [objects, returnArgs]
        },
        lockListener = () => { STATE.REF.isLocked = true },
        unlockListener = () => { STATE.REF.isLocked = false }

    return {
        RegisterEventHandlers: regHandlers,
        CheckInstall: checkInstall,

        ParseParams: parseParams,
        GetObjects: getAllObjs,
        Lock: lockListener,
        Unlock: unlockListener
    }
} )()

on("ready", () => {
    Listener.RegisterEventHandlers()
    Listener.CheckInstall()
    D.Log("Listener Ready!")
} )
void MarkStop("Listener")