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
                if (msg.type === "api" && (!GMONLY || playerIsGM(msg.playerid) || msg.playerid === "API") && (!CHATCOMMAND || args.shift() === CHATCOMMAND)) {
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
        STATEREF.sceneChars = STATEREF.sceneChars || []
        STATEREF.locationRecord = STATEREF.locationRecord || {DistrictCenter: "blank"}
        STATEREF.tokenRecord = STATEREF.tokenRecord || {}
    }
    // #endregion

    // #region EVENT HANDLERS: (HANDLEINPUT)
    const handleInput = (msg, who, call, args) => { 	// eslint-disable-line no-unused-vars
        //D.Alert(`Received Call: ${call}<br>MSG: ${D.JS(msg)}`)
        let [token, famToken] = []
        switch (call) {
            case "start": case "end": case "toggle":
                if (STATEREF.isSessionActive)
                    endSession(msg)
                else
                    startSession()
                break
            case "set": case "num": case "setnum":
                setSessionNum(parseInt(args.shift()) || STATEREF.SessionNum)
                break
            case "scene":
                endScene()
                break
            case "test":
                STATEREF.isTestingActive = !STATEREF.isTestingActive
                Media.SetText("testSessionNotice", STATEREF.isTestingActive ? "TEST SESSION ACTIVE" : " ")
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

    // #region Starting/Ending Sessions
    const startSession = () => {
            const sessionScribe = STATEREF.SessionScribes.pop()
            STATEREF.isSessionActive = true
            if (STATEREF.SessionScribes.length === 0) {
                DB(`Scribe: ${sessionScribe}, SessionScribes: ${D.JS(STATEREF.SessionScribes)}
                    PICK: ${D.JS(_.pick(Char.REGISTRY, v => v.playerName !== sessionScribe))}
                    PLUCK: ${D.JS(_.pluck(_.pick(Char.REGISTRY, v => v.playerName !== sessionScribe), "playerName"))}
                    WITHOUT: ${D.JS(_.without(_.pluck(_.pick(Char.REGISTRY, v => v.playerName !== sessionScribe), "playerName"), "Storyteller"))}`, "startSession")
                const otherScribes = _.shuffle(_.without(_.pluck(_.pick(Char.REGISTRY, v => v.playerName !== sessionScribe), "playerName"), "Storyteller"))
                STATEREF.SessionScribes.push(otherScribes.pop(), ..._.shuffle([...otherScribes, sessionScribe]))
            }
            sendChat("Session Start", C.CHATHTML.colorBlock([
                C.CHATHTML.colorTitle("VAMPIRE: TORONTO by NIGHT", {fontSize: 28}),
                C.CHATHTML.colorBody("Initializing Session...", {margin: "0px 0px 10px 0px"}),
                C.CHATHTML.colorHeader(`Welcome to Session ${D.NumToText(STATEREF.SessionNum + 1, true)}!`),
                C.CHATHTML.colorBody("Clock Running.<br>Animations Online.<br>Roller Ready.", {margin: "0px 0px 10px 0px"}),
                C.CHATHTML.colorHeader(`Session Scribe: ${sessionScribe}`),
                C.CHATHTML.colorBody("Thank you for your service!")
            ]))
            if (!STATEREF.isTestingActive)
                STATEREF.SessionNum++
            Roller.Clean()
            for (const textKey of [..._.map(D.GetCharVals("registered", "shortName"), v => `${v}Desire`), "TimeTracker", "tempF", "tempC", "weather", "stakedAdvantages", "weeklyResources"])
                Media.SetText(textKey, {color: Media.GetTextData(textKey).color} )
            for (const tokenName of _.values(D.GetCharVals("registered", "tokenName")))
                Media.Set(tokenName, STATEREF.tokenRecord[tokenName] || "base") 
            Media.SetLocation(STATEREF.locationRecord)
            TimeTracker.StartClock()
            //TimeTracker.StartLights()
            Char.RefreshDisplays()
        },
        setSessionNum = sNum => {
            STATEREF.SessionNum = sNum
            D.Alert(`Session Number <b>${D.NumToText(STATEREF.SessionNum)}</b> SET.`)
        },
        endSession = (selection) => {
            sendChat("Session End", C.CHATHTML.colorBlock([
                C.CHATHTML.colorTitle("VAMPIRE: TORONTO by NIGHT", {fontSize: 28}),
                C.CHATHTML.colorHeader(`Concluding Session ${D.NumToText(STATEREF.SessionNum, true)}`),
                C.CHATHTML.colorBody("Clock Stopped.<br>Animations Offline.<br>Session Experience Awarded.", {margin: "0px 0px 10px 0px"}),
                C.CHATHTML.colorTitle("See you next week!", {fontSize: 32}),
            ]))
            STATEREF.isSessionActive = false
            STATEREF.locationRecord = _.clone(Media.LOCATION)
            STATEREF.tokenRecord = {}
            Media.SetLocation({DistrictCenter: "blank"})
            if (!STATEREF.isTestingActive)
                for (const char of D.GetChars(D.GetSelected(selection) ? selection : "registered"))
                    Char.AwardXP(char, 2, "Session XP award.")
            for (const textKey of [..._.map(D.GetCharVals("registered", "shortName"), v => `${v}Desire`), "TimeTracker", "tempF", "tempC", "weather", "stakedAdvantages", "weeklyResources"])
                Media.SetText(textKey, {color: C.COLORS.darkgrey}, true )
            for (const tokenName of _.values(D.GetCharVals("registered", "tokenName"))) {
                STATEREF.tokenRecord[tokenName] = Media.GetData(tokenName).curSrc
                Media.Set(tokenName, "blank")
            }
            TimeTracker.StopClock()
            TimeTracker.StopLights()
        }
    // #endregion

    // #region Waking Up 

    // #endregion

    // #region Starting & Ending Scenes, Logging Characters to Scene
    const addCharToScene = (charRef) => {
            const charObj = D.GetChar(charRef)
            if (VAL({charObj: charObj}, "addCharToScene") && !STATEREF.sceneChars.includes(charObj.id))
                STATEREF.sceneChars.push(charObj.id)
        },
        endScene = () => {
            for (const charID of STATEREF.sceneChars)
                D.SetStat(charID, "willpower_social_toggle", "go")
            STATEREF.sceneChars = []
        }
    // #endregion

    return {
        RegisterEventHandlers: regHandlers,
        CheckInstall: checkInstall,

        AddSceneChar: addCharToScene,

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