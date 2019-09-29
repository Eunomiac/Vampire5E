void MarkStart("Listener")
const Listener = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Listener",
        CHATCOMMAND = null,
        GMONLY = false,
        SCRIPTCALLS = {
            MESSAGE: {
                "!char": {script: Char, gmOnly: true, singleCall: false},
                "!data": {script: D, gmOnly: true, singleCall: false},
                "!reply": {script: D, gmOnly: true, singleCall: false},
                "!dpad": {script: DragPads, gmOnly: true, singleCall: false},
                "!fuzzy": {script: Fuzzy, gmOnly: true, singleCall: false},
                "!handouts": {script: Handouts, gmOnly: true, singleCall: false},
                "!get": {script: Chat, gmOnly: true, singleCall: false},
                "!set": {script: Chat, gmOnly: true, singleCall: false},
                "!clear": {script: Chat, gmOnly: true, singleCall: false},
                "!find": {script: Chat, gmOnly: true, singleCall: false},
                "!comp": {script: Complications, gmOnly: true, singleCall: false},
                "!media": {script: Media, gmOnly: true, singleCall: false},
                "!area": {script: Media, gmOnly: true, singleCall: false},
                "!img": {script: Media, gmOnly: true, singleCall: false},
                "!text": {script: Media, gmOnly: true, singleCall: false},
                "!anim": {script: Media, gmOnly: true, singleCall: false},
                "!mvc": {script: Player, gmOnly: true, singleCall: false},
                "!sense": {script: Player, gmOnly: true, singleCall: false},
                "!awe": {script: Player, gmOnly: true, singleCall: false},
                "!hide": {script: Player, gmOnly: true, singleCall: false},
                "!roll": {script: Roller, gmOnly: true, singleCall: false},
                "!frenzyinitroll": {script: Roller, gmOnly: true, singleCall: false},            
                "!frenzyroll": {script: Roller, gmOnly: true, singleCall: false},
                "!discroll": {script: Roller, gmOnly: true, singleCall: false},
                "!traitroll": {script: Roller, gmOnly: true, singleCall: false},
                "!rouseroll": {script: Roller, gmOnly: true, singleCall: false},
                "!rouserollobv": {script: Roller, gmOnly: true, singleCall: false},
                "!rouse2roll": {script: Roller, gmOnly: true, singleCall: false},
                "!rouse2rollobv": {script: Roller, gmOnly: true, singleCall: false},
                "!checkroll": {script: Roller, gmOnly: true, singleCall: false},
                "!willpowerroll": {script: Roller, gmOnly: true, singleCall: false},
                "!humanityroll": {script: Roller, gmOnly: true, singleCall: false},
                "!remorseroll": {script: Roller, gmOnly: true, singleCall: false},
                "!projectroll": {script: Roller, gmOnly: true, singleCall: false},
                // LOTS of Roller.js rolls to convert to !roll <call> standard.
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
                    const who = msg.who || "API",
                        call = args.shift().toLowerCase()
                    if (SCRIPTCALLS.MESSAGE[call.toLowerCase()]) {
                        const fullArgs = [...args],
                            objects = {character: [[], []/* ... */], graphic: [], text: [], other: [], selected: []} // --> Search each argument. 
                                                                                                         // If ANY found, put an array of all of them in the right property IN ORDER of argument.
                                                                                                         // Index of each property should correspond to argument position in the chat call string.
                                                                                                         // Then remove that argument from the args passed to the actual script.
                                                                                                         // "Selected" contains all selected objects, regardless of type.
                                                                                                         // If "selected" contains objects whose properties are empty, move them from selected into that property.
                                                                                                         // Make sure arguments that are easily confused (i.e. characters referenced by initial) are ONLY applied if no other objects in that set.
                                                                                                         // Retain unfiltered args in "fullArgs" variable.
                        SCRIPTCALLS.MESSAGE[call.toLowerCase()].script.HandleInput(msg, who, call, args, objects, fullArgs)
                    }
                }
            })
        },
    // #endregion

    // #region LOCAL INITIALIZATION
        initialize = () => { // eslint-disable-line no-empty-function
        },
    // #endregion	

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