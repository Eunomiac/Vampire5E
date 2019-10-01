void MarkStart("Listener")
const Listener = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Listener",
        CHATCOMMAND = null,
        GMONLY = false,
        SCRIPTCALLS = {
            MESSAGE: {
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
                "!mvc": {script: Player, gmOnly: false, singleCall: false},
                "!sense": {script: Player, gmOnly: false, singleCall: false},
                "!awe": {script: Player, gmOnly: false, singleCall: false},
                "!hide": {script: Player, gmOnly: false, singleCall: false},
                "!roll": {script: Roller, gmOnly: false, singleCall: true},
                "!sess": {script: Session, gmOnly: true, singleCall: true},
                "!test": {script: Tester, gmOnly: true, singleCall: true},
                "!time": {script: TimeTracker, gmOnly: true, singleCall: true}
            },
            CHANGEATTR: {},
            ADDATTR: {},
            ADDGRAPHIC: {},
            MOVEGRAPHIC: {}
        },

    // #region COMMON INITIALIZATION
        STATEREF = C.ROOT[SCRIPTNAME],	// eslint-disable-line no-unused-vars
        VAL = (varList, funcName, isArray = false) => D.Validate(varList, funcName, SCRIPTNAME, isArray), // eslint-disable-line no-unused-vars
        DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        LOG = (msg, funcName) => D.Log(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        THROW = (msg, funcName, errObj) => D.ThrowError(msg, funcName, SCRIPTNAME, errObj), // eslint-disable-line no-unused-vars

        checkInstall = () => {
            C.ROOT[SCRIPTNAME] = C.ROOT[SCRIPTNAME] || {}
            initialize()
        },
        regHandlers = () => {
            on("chat:message", msg => {
                const args = msg.content.split(/\s+/u)
                if (msg.type === "api") {
                    let call = args.shift().toLowerCase()
                    const scriptData = SCRIPTCALLS.MESSAGE[call]
                    msg.who = msg.who || "API"
                    if (scriptData) {
                        call = scriptData.singleCall && args.shift() || call
                        scriptData.script.HandleInput(call, args, msg)
                    }
                }
            })
        },
             /*           const fullArgs = [call, ...args],
                            selected = D.GetSelected(msg).map(x => D.GetChar(x) || x),
                            objects = {
                                character: [],
                                graphic: [],
                                text: [],
                                other: []
                            }
                        // --> Search each argument. 
                        // If ANY found, put an array of all of them in the right property IN ORDER of argument.
                        // Index of each property should correspond to argument position in the chat call string.
                        // Then remove that argument from the args passed to the actual script.
                        // Make sure arguments that are easily confused (i.e. characters referenced by initial) are ONLY applied if no other objects in that set.
                        // Retain unfiltered args in "fullArgs" variable.
                        for (const objType of _.keys(objects))
                            [objects[objType], args] = getObjsFromArgs(objType, args, msg)
                                // getObjsFromArgs = (type, args, prioritySelect) --> returns [objects, args] OR "false" if none found.
                                // If "prioritySelect" contains a message object, will ONLY parse "easily confused" args into objects if they're the only representation of that object in the set.
                        // "Selected" contains all selected objects, regardless of type.
                        // If "selected" contains objects whose MAIN properties are empty, move them from selected into that property.
                        
                    }
                }
            })
        }, */
    // #endregion

    // #region LOCAL INITIALIZATION
        initialize = () => { // eslint-disable-line no-empty-function
        },
    // #endregion	

        parseParams = (args, delim = " ") => _.object(
            (VAL({array: args}) ? args.join(" ") : args).
                split(new RegExp(`,?${delim}+`, "gu")).
                filter(x => x.includes(":")).
                map(x => x.trim().split(":"))
        ),
        parseCharSelect = (call, args) => {                
            let charObjs, charIDString
            if (["registered", "sandbox", "pcs", "npcs"].includes(call.toLowerCase())) {
                charObjs = D.GetChars(call)
                charIDString = call.toLowerCase()
            } else {
                charObjs = _.compact(call.split(",").map(x => getObj("character", x.trim())))     
                charIDString = call
            }  
            if (VAL({charObj: charObjs}, null, true)) {
                // D.Alert("Characters Found!")
                call = args[0] ? args.shift() : call
            } else {
                charObjs = undefined
                charIDString = ""
            }
            // D.Alert(`${(charObjs || []).length} Characters Retrieved: ${(charObjs || []).map(x => D.GetName(x)).join("<br>")}<br>Call: ${call}<br>Args: ${args.join(" ")}`)
            return [charObjs, charIDString, call, args]
        },
        getObjsFromArgs = (type, args, msg) => { // returns [objects, args] OR "false" if none found.
            const objects = []
            // First, only parse out arguments that aren't easily confused with other things.

            // Now, add selected objects of that type IF no other types of that object found.
            if (!objects.length && VAL({selection: msg}))
                objects.push(...D.GetSelected(msg).
                    map(x => type === "character" && D.GetChar(x) || x).
                    filter(x => type === "other" && !["character", "graphic", "text"].includes(x.get("type")) || x.get("type") === type)
                )
            if (!objects.length) {
                // NOW parse "easily-confused" argument types.
            }
            return [objects, args]            
        }

    return {
        RegisterEventHandlers: regHandlers,
        CheckInstall: checkInstall
    }
} )()

on("ready", () => {
    Listener.RegisterEventHandlers()
    Listener.CheckInstall()
    D.Log("Listener Ready!")
} )
void MarkStop("Listener")