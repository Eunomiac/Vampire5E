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
                        const [objects, returnArgs] = parseMessage(args, msg, SCRIPTCALLS.MESSAGE[call].needsObjects !== false)
                        call = scriptData.singleCall && returnArgs.shift() || call
                        if (D.WatchList.includes("Listen"))
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
                DB({
                    ["CHANGE:ATTR:CURRENT"]: Object.assign({}, attrObj),
                    ["... from"]: prevData,
                    ["Was Real Change?"]: attrObj.get("current") !== prevData.current,
                    [">> Name"]: attrObj.get("name").toLowerCase().replace(/^(.*_){3}/gu, "")
                }, "Listen")
                if (attrObj.get("current") !== prevData.current) {
                    const call = attrObj.get("name").toLowerCase().replace(/^(.*_){3}/gu, "")
                    for (const [attrKeys, scriptData] of SCRIPTCALLS.ATTRCHANGE)
                        for (const attrKey of attrKeys)
                            if (call.includes(attrKey))
                                return scriptData.script.OnAttrChange(call, attrObj)
                }
                return false
            })
            on("add:attribute", attrObj => {
                DB({["ADD:ATTR"]: Object.assign({}, attrObj)}, "Listen")
                const call = attrObj.get("name").toLowerCase().replace(/^(.*_){3}/gu, "")
                for (const [attrKeys, scriptData] of SCRIPTCALLS.ATTRADD)
                    for (const attrKey of attrKeys)
                        if (call.includes(attrKey))
                            return scriptData.script.OnAttrAdd(call, attrObj)
                return false
            })
            on("destroy:attribute", attrObj => {
                DB({["DESTROY:ATTR"]: Object.assign({}, attrObj)}, "Listen")
                const call = attrObj.get("name").toLowerCase().replace(/^(.*_){3}/gu, "")
                for (const [attrKeys, scriptData] of SCRIPTCALLS.ATTRDESTROY)
                    for (const attrKey of attrKeys)
                        if (call.includes(attrKey))
                            return scriptData.script.OnAttrDestroy(call, attrObj)
                return false
            })
            on("add:graphic", imgObj => {
                for (const scriptData of SCRIPTCALLS.IMGADD)
                    return scriptData.script.OnGraphicAdd(imgObj)
                return false
            })
            on("change:graphic", (imgObj, prevData) => {
                for (const scriptData of SCRIPTCALLS.IMGCHANGE)
                    return scriptData.script.OnGraphicChange(imgObj, prevData)
                return false
            })
        },
    // #endregion

    // #region LOCAL INITIALIZATION
        initialize = () => { // eslint-disable-line no-empty-function
            STATE.REF.isLocked = STATE.REF.isLocked || false
            STATE.REF.objectLog = STATE.REF.objectLog || []
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
                "!snd": {script: Media, gmOnly: true, singleCall: false},
                // "!sound": {script: SoundScape, gmOnly: true, singleCall: true, needsObjects: false},
                "!pcom": {script: Player, gmOnly: false, singleCall: false, needsObjects: false},
                "!mvc": {script: Player, gmOnly: false, singleCall: false, needsObjects: false},
                "!token": {script: Player, gmOnly: false, singleCall: false},
                "!links": {script: Player, gmOnly: false, singleCall: false, needsObjects: false},
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
            SCRIPTCALLS.ATTRDESTROY = _.reject([
                [ ["desire"], {script: Char} ]
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
            const returnObjs = _.uniq(_.flatten(_.compact([...objects[type] || [], ...objects.selected && objects.selected[type] || []])))
            DB({objects, type, returnObjs}, "getAllObjs")
            if (returnObjs.length) {
                STATE.REF.objectLog[type] = returnObjs.map(x => x.id).join(",")
                DB({objectLog: returnObjs.map(x => x.id).join(","), stateRef: STATE.REF.objectLog}, "getAllObjs")
                return returnObjs
            }
            return STATE.REF.objectLog[type] && STATE.REF.objectLog[type].split(",").map(x => getObj(type, x)) || []            
        },
        parseParams = (args, delim = " ") => {
            const params = {}
            if (VAL({array: args}))
                args.join(" ")
            if (VAL({string: args})) 
                Object.apply(params, args.
                    split(new RegExp(`,?${delim.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}+`, "gu")).
                    filter(x => x.includes(":")).
                    map(x => x.trim().split(":").
                        map(xx => VAL({number: xx}) ? D.Float(xx,2) : xx))
                )
            
            return _.object(
                (VAL({array: args}) ? args.join(" ") : args).
                    split(new RegExp(`,?${delim.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}+`, "gu")).
                    filter(x => x.includes(":")).
                    map(x => x.trim().split(":").map(xx => VAL({number: xx}) ? D.Float(xx,2) : xx))
            )
        },
        parseArg = {
            character: (arg, isFuzzy = false) => {
                DB(`Seeking CHARACTER for arg ${D.JSL(arg)}`, "parseArg")
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
        getObjsFromArgs = (args) => {
            const objects = {},
                ids = [],
                objRefsFound = [],
                allObjs = [...findObjs({}), ...findObjs({
                    _type: "character"
                })]
            if (VAL({array: args}, "getObjsFromArgs") && args.length) {
                // STEP 1: For each argument, check if it is a string of object IDs.  If so, add those objects and strip out that argument.
                for (let i = 0; i < args.length; i++)
                    if (args[i] && _.all(args[i].split(/,\s*/gu), x => x.match(/^-[-_a-zA-Z0-9]{19}$/gu))) {
                        ids.push(...args[i].split(/,\s*/gu))
                        args[i] = "#OMIT#"
                    }
                args = args.filter(x => x !== "#OMIT#")
                if (ids.length)
                    for (const obj of allObjs.filter(x => ids.includes(x.id))) {
                        objects[obj.get("type")] = objects[obj.get("type")] || []
                        objects[obj.get("type")].push(obj)                        
                    }
                // STEP 2: Extract all arguments with the object prefix '@', and grab their objects.
                // - for each argument, if nothing is found, ALSO try appending the next one then two args in sequence
                for (const objRef of args.filter(x => x.startsWith("@")).map(x => x.slice(1))) {
                    const argsIndex = args.findIndex(x => x === `@${objRef}`),
                        combinedArgs = _.uniq([`${objRef} ${args[argsIndex+1] || ""}`, `${objRef} ${args[argsIndex+1] || ""} ${args[argsIndex+2] || ""}`].map(y => y.trim().replace(/^@/gu, "")).filter(x => x !== objRef))
                    for (const objType of ["character", "graphic", "text"]) {
                        const objs = parseArg[objType](objRef)
                        if (objs.length) {
                            objects[objType] = objects[objType] || []
                            objects[objType].push(...objs)
                            objRefsFound.push(objRef)
                        }
                    }
                    if (objRefsFound.includes(objRef))
                        continue

                    // STEP 2B: Now check the combined arguments (i.e. the argument, plus the next one or two arguments, separated by spaces)
                    for (const combinedArg of combinedArgs)
                        for (const objType of ["character", "graphic", "text"]) {
                            const objs = parseArg[objType](combinedArg)
                            if (objs.length) {
                                objects[objType] = objects[objType] || []
                                objects[objType].push(...objs)
                                objRefsFound.push(...combinedArg.split(/\s/gu))
                            }
                        }
                    if (objRefsFound.includes(objRef))
                        continue
                    
                    // STEP 2C: Repeat above for each argument for which nothing was found, except with fuzzy matching.
                   
                    for (const objType of ["character", "graphic", "text"]) {
                        const objs = parseArg[objType](objRef, true)
                        if (objs.length) {
                            objects[objType] = objects[objType] || []
                            objects[objType].push(...objs)
                            objRefsFound.push(objRef)
                        }
                    } 
                    if (objRefsFound.includes(objRef))
                        continue

                    for (const combinedArg of combinedArgs)
                        for (const objType of ["character", "graphic", "text"]) {
                            const objs = parseArg[objType](combinedArg, true)
                            if (objs.length) {
                                objects[objType] = objects[objType] || []
                                objects[objType].push(...objs)
                                objRefsFound.push(...combinedArg.split(/\s/gu))
                            }
                        }
                }         
                args = args.filter(x => !x.startsWith("@") && !objRefsFound.includes(x))
            }
            return [objects, _.compact(args)]
        },
        parseMessage = (args, msg, needsObjects) => {
            const [objects, returnArgs] = needsObjects ? getObjsFromArgs(args) : [{}, args]
            // For each type, if no objects found in args, check selection:
            if (needsObjects && VAL({selection: msg}))
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