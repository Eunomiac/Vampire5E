void MarkStart("Session")
const Session = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Session",
        CHATCOMMAND = "!sess",
        GMONLY = true

    // #region COMMON INITIALIZATION
    const STATEREF = C.ROOT[SCRIPTNAME]	// eslint-disable-line no-unused-vars
    const VAL = (varList, funcName, isArray = false) => D.Validate(varList, funcName, SCRIPTNAME, isArray), // eslint-disable-line no-unused-vars
        DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        LOG = (msg, funcName) => D.Log(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        THROW = (msg, funcName, errObj) => D.ThrowError(msg, funcName, SCRIPTNAME, errObj) // eslint-disable-line no-unused-vars

    const checkInstall = () => {
            C.ROOT[SCRIPTNAME] = C.ROOT[SCRIPTNAME] || {}
            initialize()
        },
        regHandlers = () => {
            on("chat:message", msg => {
                const args = msg.content.split(/\s+/u)
                if (msg.type === "api" && (!GMONLY || playerIsGM(msg.playerid)) && (!CHATCOMMAND || args.shift() === CHATCOMMAND)) {
                    const who = msg.who || "API",
                        call = args.shift()
                    handleInput(msg, who, call, args)
                }
            })
        }
    // #endregion

    // #region LOCAL INITIALIZATION
    const initialize = () => { // eslint-disable-line no-empty-function
        STATEREF.isSessionActive = STATEREF.isSessionActive || false
        STATEREF.isTestingActive = STATEREF.isTestingActive || false
    }
    // #endregion

    // #region EVENT HANDLERS: (HANDLEINPUT)
    const handleInput = (msg, who, call, args) => { 	// eslint-disable-line no-unused-vars
        //D.Alert(`Received Call: ${call}<br>MSG: ${D.JS(msg)}`)
        let [token, famToken] = []
        switch (call) {
            case "start":
                startSession()
                break
            case "set": case "num": case "setnum":
                setSessionNum(args.shift())
                break
            case "end":
                endSession(msg)
                break
            case "test":
                STATEREF.isTestingActive = !STATEREF.isTestingActive
                D.Alert(`Testing Set to ${STATEREF.isTestingActive}`, "!sess test")
                break
            case "daylighters":
                STATEREF.isDaylighterSession = !STATEREF.isDaylighterSession
                D.Alert(`Daylighter Session Set To: ${STATEREF.isDaylighterSession}`)
                DragPads.Toggle("signalLight", !STATEREF.isDaylighterSession)
                TimeTracker.Fix()
                for (const charData of _.values(Char.REGISTRY).slice(0, 4)) {
                    [token] = findObjs({
                        _pageid: D.PAGEID,
                        _type: "graphic",
                        _subtype: "token",
                        represents: charData.id
                    })

                    if (STATEREF.isDaylighterSession) {
                        Media.SetData(token, { isDaylighter: true, unObfSrc: "base" })
                        Media.ToggleToken(token, "baseDL")
                        if (charData.famulusTokenID) {
                            famToken = Media.GetObj(charData.famulusTokenID)
                            Media.Toggle(famToken, false)
                        }
                    } else {
                        Media.SetData(token, { isDaylighter: false, unObfSrc: "base" })
                        Media.ToggleToken(token, "base")
                    }
                }
                break
            case "":

                break
            default: break
        }
    }
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    // #region Starting/Ending Sessions & Waking Up,
    const startSession = () => {
            const sessionScribe = STATEREF.SessionScribes.pop()
            STATEREF.isSessionActive = true
            if (STATEREF.SessionScribes.length === 0) {
                const otherScribes = _.shuffle(_.without(_.pluck(_.pick(Char.REGISTRY, v => v.playerName !== sessionScribe), "playerName"), "Storyteller"))
                STATEREF.SessionScribes.push(otherScribes.pop(), ..._.shuffle([...otherScribes, sessionScribe]))
            }
            sendChat("Session Start", C.CHATHTML.colorBlock([
                C.CHATHTML.colorTitle("VAMPIRE: TORONTO by NIGHT", 28),
                C.CHATHTML.colorBody("Initializing Session...", 10),
                C.CHATHTML.colorHeader(`Welcome to Session ${D.NumToText(STATEREF.SessionNum + 1, true)}!`),
                C.CHATHTML.colorBody("Clock Running.<br>Animations Online.<br>Roller Ready.", 10),
                C.CHATHTML.colorHeader(`Session Scribe: ${sessionScribe}`),
                C.CHATHTML.colorBody("Thank you for your service!")
            ]))
            if (STATEREF.isTestingActive)            
                D.Alert(`Keeping Session Number at ${D.NumToText(STATEREF.SessionNum, true)}: Test Session Active<br><br>Type <b>!sess test</b> to disable,<br>then <b>!sess num ${STATEREF.SessionNum + 1}</b> to set session number.`, "startSession")
            else
                STATEREF.SessionNum++
            Roller.Clean()
            Media.SetText("TimeTracker", {color: C.COLORS.brightred})
            TimeTracker.StartClock()
            TimeTracker.StartLights()

        },
        setSessionNum = sNum => {
            STATEREF.SessionNum = sNum
            D.Alert(`Session Number <b>${D.NumToText(STATEREF.SessionNum)}</b> SET.`)
        },
        endSession = (selection) => {
            sendChat("Session End", C.CHATHTML.colorBlock([
                C.CHATHTML.colorTitle("VAMPIRE: TORONTO by NIGHT", 28),
                C.CHATHTML.colorHeader(`Concluding Session ${D.NumToText(STATEREF.SessionNum, true)}`),
                C.CHATHTML.colorBody("Clock Stopped.<br>Animations Offline.<br>Session Experience Awarded.", 10),
                C.CHATHTML.colorTitle("See you next week!", 28),
            ]))
            STATEREF.isSessionActive = false
            if (STATEREF.isTestingActive)
                D.Alert("Skipping XP awards: Test Session Active<br>(Toggle off with '!sess test', then Stop the session again to reward XP.)", "awardXP")
            else
                for (const char of D.GetChars(D.GetSelected(selection) ? selection : "registered"))
                    Char.AwardXP(char, 2, "Session XP award.")
            Media.SetText("TimeTracker", {color: C.COLORS.darkgrey})
            TimeTracker.StopClock()
            TimeTracker.StopLights()
        }

    return {
        RegisterEventHandlers: regHandlers,
        CheckInstall: checkInstall,

        get SessionNum() { return STATEREF.SessionNum },
        get IsSessionActive() { return STATEREF.isSessionActive },
        get IsDaylighterSession() { return STATEREF.isDaylighterSession },
        get IsTesting() { return STATEREF.isTestingActive }
    }
})()

on("ready", () => {
    Session.RegisterEventHandlers()
    Session.CheckInstall()
    D.Log("Session Ready!")
})
void MarkStop("Session")