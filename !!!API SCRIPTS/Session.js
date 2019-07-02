/* SETTING UP TEMPLATE:
    1) Replace "Session" with name of script (e.g. "Char")
    2) Replace "SCRIPTCOMMAND" with api chat command trigger (e.g. "!char")
    3) Delete these instructions, so "void MarkStart()" is the very first line.
*/
void MarkStart("Session")
const Session = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Session",
        CHATCOMMAND = null,
        GMONLY = true

    // #region COMMON INITIALIZATION
    const STATEREF = state[D.GAMENAME][SCRIPTNAME]	// eslint-disable-line no-unused-vars
    const VAL = (varList, funcName) => D.Validate(varList, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        LOG = (msg, funcName) => D.Log(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        THROW = (msg, funcName, errObj) => D.ThrowError(msg, funcName, SCRIPTNAME, errObj) // eslint-disable-line no-unused-vars

    const checkInstall = () => {
            state[D.GAMENAME] = state[D.GAMENAME] || {}
            state[D.GAMENAME][SCRIPTNAME] = state[D.GAMENAME][SCRIPTNAME] || {}
            initialize()
        },
        regHandlers = () => {
            on("chat:message", msg => {
                if (msg.type !== "api" ||
                    GMONLY && !playerIsGM(msg.playerid) ||
                    CHATCOMMAND && args.shift() !== CHATCOMMAND)
                    return
                const who = D.GetPlayerName(msg) || "API",
                    args = msg.content.split(/\s+/u),
                    call = args.shift()
                handleInput(msg, who, call, args)
            })
        }
    // #endregion

    // #region LOCAL INITIALIZATION
    const initialize = () => {
    }
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    // #region Starting/Ending Sessions & Waking Up
    const startSession = () => {
            STATEREF.SessionNum++
            D.Alert(`Beginning Session ${D.SESSIONNUMS[STATEREF.SessionNum]}`)
            TimeTracker.StartClock()
        //TimeTracker.StartLights()
        },
        setSessionNum = sNum => {
            STATEREF.SessionNum = sNum
            D.Alert(`Session Number <b>${D.SESSIONNUMS[STATEREF.SessionNum]}</b> SET.`)
        },
        endSession = () => {
            D.Alert(`Concluding Session ${D.SESSIONNUMS[STATEREF.SessionNum]}`)
            for (const char of D.GetChars("registered")) 
                Char.XP(char, 2, D.SESSIONNUMS[STATEREF.SessionNum], "Session XP award.")
            
            TimeTracker.StopClock()
            TimeTracker.StopLights()
        },
        daysleep = () => {
            for (const char of D.GetChars("registered")) {
                const healWP = Math.max(parseInt(getAttrByName(char.id, "composure")), parseInt(getAttrByName(char.id, "resolve")))
                Char.Damage(char, "willpower", "superficial+", -1 * healWP)
            }
        }
    // #endregion


    // #region EVENT HANDLERS: (HANDLEINPUT)
    const handleInput = (msg, who, call, args) => { 	// eslint-disable-line no-unused-vars
        let [token, famToken] = new Array(2)
        switch (call) {
            case "!daylighters":
                STATEREF.isDaylighterSession = !STATEREF.isDaylighterSession
                D.Alert(`Daylighter Session Set To: ${STATEREF.isDaylighterSession}`)
                DragPads.Toggle("signalLight", !STATEREF.isDaylighterSession)
                TimeTracker.Fix()
                for (const charData of _.values(Char.REGISTRY).slice(0, 4)) {
                    [token] = findObjs({
                        _pageid: D.PAGEID(),
                        _type: "graphic",
                        _subtype: "token",
                        represents: charData.id
                    })
                    if (STATEREF.isDaylighterSession) {
                        Images.SetData(token, { isDaylighter: true, unObfSrc: "base" })
                        Images.ToggleToken(token, "baseDL")
                        if (charData.famulusTokenID) {
                            famToken = Images.GetObj(charData.famulusTokenID)
                            Images.Toggle(famToken, false)
                        }
                    } else {
                        Images.SetData(token, { isDaylighter: false, unObfSrc: "base" })
                        Images.ToggleToken(token, "base")
                    }
                }
                break
            case "!startsession": startSession(); break
            case "!setsessionnum": setSessionNum(args.shift()); break
            case "!endsession": endSession(); break
            case "!daysleep": daysleep(); break
            default: break
        }
    }

    return {
        RegisterEventHandlers: regHandlers,
        CheckInstall: checkInstall,
        IsDaylighterSession: () => STATEREF.isDaylighterSession
    }
})()

on("ready", () => {
    Session.RegisterEventHandlers()
    Session.CheckInstall()
    D.Log("Ready!", "Session")
})
void MarkStop("Session")