void MarkStart("Session")
const Session = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Session",
        CHATCOMMAND = "!sess",
        GMONLY = true,

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
                if (msg.type === "api" && (!GMONLY || playerIsGM(msg.playerid) || msg.playerid === "API") && (!CHATCOMMAND || args.shift() === CHATCOMMAND)) {
                    const who = msg.who || "API",
                        call = args.shift()
                    log(`SESSION CALL: handleInput(${D.JSL(msg)}, ${D.JSL(who)}, ${D.JSL(call)}, ${D.JSL(args)})`)
                    handleInput(msg, who, call, args)
                }
            })
        },
    // #endregion

    // #region LOCAL INITIALIZATION
        initialize = () => { // eslint-disable-line no-empty-function
            STATEREF.isTestingActive = STATEREF.isTestingActive || false
            STATEREF.sceneChars = STATEREF.sceneChars || []
            STATEREF.tokenRecord = STATEREF.tokenRecord || {}
            STATEREF.SessionScribes = STATEREF.SessionScribes || []
            STATEREF.SessionModes = STATEREF.SessionModes || ["Active", "Inactive", "Daylighter", "Downtime", "Complications"]
            STATEREF.Mode = STATEREF.Mode || "Inactive"
            STATEREF.LastMode = STATEREF.LastMode || "Inactive"
            STATEREF.curLocation = STATEREF.curLocation || {
                DistrictCenter: "blank",
                DistrictLeft: "blank",
                DistrictRight: "blank",
                SiteCenter: "blank",
                SiteLeft: "blank",
                SiteRight: "blank"
            }
            STATEREF.locationRecord = STATEREF.locationRecord || null
            
            // delete STATEREF.locationRecord
            
            if (!STATEREF.locationRecord) {
                STATEREF.locationRecord = {}
                for (const mode of Session.Modes)
                    STATEREF.locationRecord[mode] = D.Clone(STATEREF.curLocation)
            }
                
                                 
        // STATEREF.SessionScribes = [ "Thaumaterge", "Ava Wong", "banzai", "PixelPuzzler" ]
        },
    // #endregion

    // #region EVENT HANDLERS: (HANDLEINPUT)
        handleInput = (msg, who, call, args) => { 	// eslint-disable-line no-unused-vars
        // D.Alert(`Received Call: ${call}<br>MSG: ${D.JS(msg)}`)
            let charObjs, charIDString
            [charObjs, charIDString, call, args] = D.ParseCharSelection(call, args)
        // D.Alert(`Updated Call: ${call}<br>MSG: ${D.JS(msg)}`)
            switch (call) {
                case "start": case "end": case "toggle": {
                    log(`... HANDLE INPUT. isSessionActive() = ${D.JSL(isSessionActive())}`)
                    if (isSessionActive())
                        endSession(msg)
                    else
                        startSession()
                    break
                }
                case "add": {
                    switch (args.shift().toLowerCase()) {
                        case "scene": {
                            charObjs = charObjs || D.GetChar(msg) || D.GetChar(args.shift())
                            addCharToScene(charObjs)
                            break
                        }
                        case "mode": {
                            const mode = args.shift()
                            if (VAL({string: mode}, "!sess add mode") && !D.IsIn(mode, STATEREF.SessionModes)) {
                                STATEREF.SessionModes.push(args.shift())
                                D.Alert(`Session Mode '${mode}' Added.<br>Current Modes: ${D.JS(STATEREF.SessionModes)}`, "!sess add mode")
                            }
                            break
                        }
                    // no default
                    }
                    break
                }
                case "set": {
                    switch((args[0] || "").toLowerCase()) {
                        default: {
                            setSessionNum(parseInt(args.shift()) || STATEREF.SessionNum)
                            break
                        }
                        case "mode": {
                            args.shift()
                            STATEREF.Mode = D.IsIn(args.shift(), STATEREF.SessionModes) || STATEREF.Mode
                            D.Alert(`Current Session Mode:<br><h3>${STATEREF.Mode}</h3>`, "!sess set mode")
                            break
                        }
                        case "loc": case "location": {     
                            // args: DistrictLeft:same|blank|Annex SiteLeft:same|blank|AnarchBar:name:<customName>; DistrictLeft:same|blank|Annex SiteLeft:same|blank|AnarchBar:name:<customName>;                            
                            setLocation(parseLocationString(args.join(" ")))
                            break
                        }
                    }
                    break
                }
                case "delete": case "del": {
                    switch ((args.shift() || "").toLowerCase()) {
                        case "mode": {
                            const mode = args.shift()
                            if (VAL({string: mode}, "!sess add mode") && D.IsIn(mode, STATEREF.SessionModes)) {
                                STATEREF.SessionModes = _.without(STATEREF.SessionModes, D.IsIn(mode, STATEREF.SessionModes))
                                D.Alert(`Session Mode '${mode}' Removed.<br>Current Modes: ${D.JS(STATEREF.SessionModes)}`, "!sess del mode")
                            }
                            break
                        }
                    // no default
                    }
                    break
                }
                case "scene": {
                    endScene()
                    break
                }
                case "test": {
                    toggleTesting()
                    break
                }
                case "downtime": {
                    toggleDowntime()
                    break
                }
                case "daylighters": {
                    STATEREF.Mode = STATEREF.Mode === "Daylighter" ? "Active" : "Daylighter"
                    D.Alert(`Session Mode Set To: ${STATEREF.Mode}`)
                    DragPads.Toggle("signalLight", STATEREF.Mode !== "Daylighter")
                    TimeTracker.Fix()
                    for (const charData of _.values(Char.REGISTRY).slice(0, 4)) {
                        const [token] = findObjs({
                            _pageid: D.PAGEID,
                            _type: "graphic",
                            _subtype: "token",
                            represents: charData.id
                        })

                        if (STATEREF.Mode === "Daylighter") {
                            Media.SetImgData(token, {isDaylighter: true, unObfSrc: "base"})
                            Media.SetImg(token, "baseDL")
                            if (charData.famulusTokenID) {
                                const famToken = Media.GetImg(charData.famulusTokenID)
                                Media.ToggleImg(famToken, false)
                            }
                        } else {
                            Media.SetImgData(token, {isDaylighter: false, unObfSrc: "base"})
                            Media.SetImg(token, "base")
                        }
                    }
                    break
                }
            // no default
            }
        },
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    // #region Getting & Setting Session Data
        isSessionActive = () => ["Active", "Downtime", "Complications", "Daylighter"].includes(STATEREF.Mode),
        setSessionNum = sNum => {
            STATEREF.SessionNum = sNum
            D.Alert(`Session Number <b>${D.NumToText(STATEREF.SessionNum)}</b> SET.`)
        },
    // #endregion

    // #region Starting/Ending Sessions
        startSession = () => {
            const sessionScribe = STATEREF.isTestingActive ? STATEREF.SessionScribes[0] : STATEREF.SessionScribes.shift()
            if (STATEREF.isTestingActive)
                STATEREF.dateRecord = TimeTracker.CurrentDate.getTime()
            else
                STATEREF.dateRecord = null
            if (STATEREF.SessionScribes.length === 0) {
                DB(`Scribe: ${sessionScribe}, SessionScribes: ${D.JS(STATEREF.SessionScribes)}
                    PICK: ${D.JS(_.pick(Char.REGISTRY, v => v.playerName !== sessionScribe))}
                    PLUCK: ${D.JS(_.pluck(_.pick(Char.REGISTRY, v => v.playerName !== sessionScribe), "playerName"))}
                    WITHOUT: ${D.JS(_.without(_.pluck(_.pick(Char.REGISTRY, v => v.playerName !== sessionScribe), "playerName"), "Storyteller"))}`, "startSession")
                const otherScribes = _.shuffle(_.without(_.pluck(_.pick(Char.REGISTRY, v => v.playerName !== sessionScribe), "playerName"), "Storyteller"))
                STATEREF.SessionScribes.push(otherScribes.pop(), ..._.shuffle([...otherScribes, sessionScribe]))
            } 
            sendChat("Session Start", C.CHATHTML.colorBlock([
                C.CHATHTML.colorTitle("VAMPIRE: TORONTO by NIGHT", {fontSize: "28px"}),
                C.CHATHTML.colorBody("Initializing Session...", {margin: "0px 0px 10px 0px"}),
                C.CHATHTML.colorHeader(`Welcome to Session ${D.NumToText(STATEREF.SessionNum, true)}!`),
                C.CHATHTML.colorBody("Clock Running.<br>Animations Online.<br>Roller Ready.", {margin: "10px 0px 10px 0px"}),
                C.CHATHTML.colorHeader(`Session Scribe: ${sessionScribe}`),
                C.CHATHTML.colorBody("Thank you for your service!")
            ]))
            changeMode("Active")
            for (const quadrant of _.keys(Char.REGISTRY)) {
                const {tokenName} = Char.REGISTRY[quadrant]
                Media.SetImg(tokenName, STATEREF.tokenRecord[tokenName] || "base")
                Media.SetArea(tokenName, `${quadrant}Token`)
            }
            TimeTracker.StopCountdown()
            TimeTracker.StartClock()
            Char.RefreshDisplays()
            TimeTracker.Fix()
        },
        endSession = () => {
            if (remorseCheck()) {
                sendChat("Session End", C.CHATHTML.colorBlock([
                    C.CHATHTML.colorTitle("VAMPIRE: TORONTO by NIGHT", {fontSize: "28px"}),
                    C.CHATHTML.colorHeader(`Concluding Session ${D.NumToText(STATEREF.SessionNum, true)}`),
                    C.CHATHTML.colorBody("Clock Stopped.<br>Animations Offline.<br>Session Experience Awarded.", {margin: "10px 0px 10px 0px"}),
                    C.CHATHTML.colorTitle("See you next week!", {fontSize: "32px"}),
                ]))
                changeMode("Inactive")
                STATEREF.tokenRecord = {}
                if (!STATEREF.isTestingActive) {
                    STATEREF.dateRecord = null
                    for (const char of D.GetChars("registered"))
                        Char.AwardXP(char, 2, "Session XP award.")
                } else {
                    TimeTracker.CurrentDate = STATEREF.dateRecord
                    TimeTracker.Fix()
                }
                TimeTracker.StopClock()
                TimeTracker.StopLights()
                TimeTracker.StartCountdown()
                TimeTracker.UpdateWeather()
                if (!STATEREF.isTestingActive)
                    STATEREF.SessionNum++
            }
        },
    // #endregion

    // #region Toggling Session Modes
        changeMode = mode => {
            if (VAL({string: mode}, "changeMode") && STATEREF.SessionModes.map(x => x.toLowerCase()).includes(mode.toLowerCase())) {
                const [lastMode, curMode] = [
                    D.Clone(STATEREF.Mode),
                    D.Capitalize(mode.toLowerCase())
                ]
                STATEREF.Mode = curMode
                STATEREF.LastMode = lastMode
                Roller.Clean()
                Media.SwitchMode()
                setModeLocations(curMode)
            }
        },
        toggleTesting = (isTesting) => {
            if (isTesting === false || isTesting === true) {
                if (isTesting === STATEREF.isTestingActive)
                    return
                STATEREF.isTestingActive = isTesting
            } else {
                STATEREF.isTestingActive = !STATEREF.isTestingActive
            }
            Media.ToggleText("testSessionNotice", STATEREF.isTestingActive)
            D.Alert(`Testing Set to ${STATEREF.isTestingActive}`, "!sess test")
        },
        toggleDowntime = () => {
            changeMode(STATEREF.Mode === "Downtime" ? STATEREF.LastMode : "Downtime")
            if (STATEREF.Mode === "Downtime") {
                setLocation(BLANKLOCRECORD)
                TimeTracker.StopClock()
                Char.SendHome()
                sendChat("Session Downtime", C.CHATHTML.colorBlock([
                    C.CHATHTML.colorTitle("Session Downtime"),
                    C.CHATHTML.colorHeader("Session Status: Downtime"),
                    C.CHATHTML.colorBody("Clock Stopped.")
                ]))
            } else {
                TimeTracker.StartClock()
                Char.SendBack()
                sendChat("Session Downtime", C.CHATHTML.colorBlock([
                    C.CHATHTML.colorTitle("Session Downtime"),
                    C.CHATHTML.colorHeader("Session Status: Regular Time"),
                    C.CHATHTML.colorBody("Clock Started.")
                ]))
            }
            Char.RefreshDisplays()
            TimeTracker.Fix()
        },

    // #endregion

    // #region Location Handling
        BLANKLOCRECORD = {
            DistrictCenter: "blank",
            DistrictLeft: "blank",
            DistrictRight: "blank",
            SiteCenter: "blank",
            SiteLeft: "blank",
            SiteRight: "blank"
        },
        parseLocationString = (locString) => {
            const locParams = [
                ...(locString.match(/([^:;\s]*):([^:;\s]*):name:(.*?);/gu) || []).map(x => x.match(/([^:;\s]*):([^:;\s]*):name:(.*?);/u).slice(1)),
                ...locString.split(" ").filter(x => !x.includes(":name") && x.includes(":")).map(x => x.split(":"))
            ]
            return D.KeyMapObj(locParams, (k, v) => v[0], (v) => _.compact(v.slice(1)))
        },
        getParentLocData = locPos => {
            const locData = _.omit(STATEREF.curLocation, v => v === "blank"),
                locType = locPos.replace(/(Right|Left|Center|)/gu, "")
            switch (locPos.replace(/(District|Site)/gu, "")) {
                case "Center": 
                    return locData[`${locType}Center`] || locData[`${locType}Left`] || locData[`${locType}Right`]
                case "Left": 
                    return locData[`${locType}Left`] || locData[`${locType}Center`] || locData[`${locType}Right`]
                case "Right": 
                    return locData[`${locType}Right`] || locData[`${locType}Center`] || locData[`${locType}Left`]
                // no default
            }
            return undefined
        },
        setLocation = (locParams) => {
            const newLocData = Object.assign(_.clone(BLANKLOCRECORD), locParams),
                curLocData = JSON.parse(JSON.stringify(STATEREF.curLocation)),
                reportStrings = [
                    `Loc Params: ${D.JS(locParams)}`,
                    `New Loc Data: ${D.JS(newLocData)}`,
                    `Cur Loc Data: ${D.JS(curLocData)}`
                ]
            for (const locPos of _.keys(newLocData)) {
                const locData = _.clone(newLocData[locPos])
                if (locData[0] === "same") {
                    newLocData[locPos] = getParentLocData(locPos)
                    if (locData[1] && newLocData[locPos] !== "blank")
                        [,newLocData[locPos][1]] = locData
                } else if (locData[0] === "blank") {
                    newLocData[locPos] = "blank"
                }
            }
            if (_.isEqual(newLocData.DistrictLeft, newLocData.DistrictRight) && newLocData.DistrictLeft !== "blank") {
                newLocData.DistrictCenter = [..._.flatten([newLocData.DistrictLeft])]
                newLocData.DistrictLeft = "blank"
                newLocData.DistrictRight = "blank"
            }
            STATEREF.curLocation = D.Clone(newLocData)
            STATEREF.locationRecord[Session.Mode] = D.Clone(newLocData)    
            const locDataDelta = _.pick(newLocData, _.keys(newLocData).filter(x => !_.isEqual(newLocData[x], curLocData[x])))
            reportStrings.push(`Loc Data Delta: ${D.JS(locDataDelta)}`)
            reportStrings.push(`New STATEREF Record: ${D.JS(STATEREF.locationRecord[Session.Mode])}`)
            // D.Alert(`<h3>Set Location Processing:</h3>${D.JS(reportStrings.join("<br>"))}`)
            for (const locPos of _.keys(locDataDelta)) {
                const locData = locDataDelta[locPos]
                if (!locData || locData === "blank") {
                    Media.ToggleImg(locPos, false)
                    if (locPos.includes("Site")) {
                        Media.ToggleImg(`SiteBar${locPos.replace(/Site/gu, "")}`, false)
                        Media.ToggleText(`SiteName${locPos.replace(/Site/gu, "")}`, false)
                    }
                } else {
                    Media.SetImg(locPos, locData[0], true)
                    if (locPos.includes("Site") && locData[1]) {
                        Media.ToggleImg(`SiteBar${locPos.replace(/Site/gu, "")}`, true)
                        Media.SetText(`SiteName${locPos.replace(/Site/gu, "")}`, locData[1], true)
                    } else {
                        Media.ToggleImg(`SiteBar${locPos.replace(/Site/gu, "")}`, false)
                        Media.ToggleText(`SiteName${locPos.replace(/Site/gu, "")}`, false)
                    }
                }
            }
        },
        setModeLocations = (mode) => { setLocation(STATEREF.locationRecord[mode]) },
    // #endregion

    // #region Waking Up 

    // #endregion

    // #region Automatic Remorse Rolls
        remorseCheck = () => {
            const charObjs = D.GetChars("registered"),
                stainedCharObjs = []
            for (const charObj of charObjs)
                if (D.GetStatVal(charObj, "stains"))
                    stainedCharObjs.push(charObj)
            if (stainedCharObjs.length) {
                promptRemorseCheck(stainedCharObjs)
                return false
            }
            return true      
        },
        promptRemorseCheck = (charObjs) => {
            const charObjRows = [],
                chatLines = []
            while (charObjs.length)
                charObjRows.push(_.compact([charObjs.shift(), charObjs.shift()]))
            for (const charObjRow of charObjRows)
                chatLines.push(`<span style="                    
                    display: block;
                    font-size: 10px;
                    text-align: center;
                    width: 100%;
                ">[${D.GetName(charObjRow[0])}](!roll pcroll remorse ${D.GetName(charObjRow[0])})${charObjRow[1] ? ` [${D.GetName(charObjRow[1])}](!roll pcroll remorse ${D.GetName(charObjRow[1])})` : ""}</span>`)
            sendChat("REMORSE CHECKS", D.JSH(`/w Storyteller <div style='
                display: block;
                background: url(https://i.imgur.com/kBl8aTO.jpg);
                text-align: center;
                border: 4px ${C.COLORS.crimson} outset;
                box-sizing: border-box;
                margin-left: -42px;
                width: 275px;
            '><div style="display: inline-block; width: 49%; font-size: 0px;"><span style='
            display: block;
            font-size: 16px;
            text-align: center;
            width: 100%;
            font-family: Voltaire;
            color: ${C.COLORS.brightred};
            font-weight: bold;
        '><br>ROLL REMORSE FOR...</span><br>${chatLines.join("<br>")}<br></div>`))    
        },
    // #endregion

    // #region Starting & Ending Scenes, Logging Characters to Scene
        addCharToScene = (charRef) => {
            const charObjs = D.GetChars(charRef)
            if (VAL({charObj: charObjs}, "addCharToScene", true)) {
                for (const charObj of charObjs) {
                    if (STATEREF.sceneChars.includes(charObj.id))
                        continue
                    STATEREF.sceneChars.push(charObj.id)
                }
                D.Alert(`Scene Now Includes:<br><ul>${D.JS(STATEREF.sceneChars.map(x => `<li><b>${D.GetName(x)}</b>`).join(""))}</ul>`, "Scene Characters")
            }
        },
        endScene = () => {
            for (const charID of STATEREF.sceneChars)
                D.SetStat(charID, "willpower_social_toggle", "go")
            STATEREF.sceneChars = []
            D.Alert("Social Willpower Damage partially refunded.", "Scene Ended")
        }
    // #endregion

    return {
        RegisterEventHandlers: regHandlers,
        CheckInstall: checkInstall,
        ToggleTesting: toggleTesting,

        AddSceneChar: addCharToScene,
        ChangeMode: changeMode,

        get SessionNum() { return STATEREF.SessionNum },
        get IsSessionActive() { return isSessionActive() },
        get Modes() { return STATEREF.SessionModes },
        get IsTesting() { return STATEREF.isTestingActive },
        get Mode() { return STATEREF.Mode },
        get LastMode() { return STATEREF.LastMode },
        get Location() { return STATEREF.locationRecord }
    }
})()

on("ready", () => {
    Session.RegisterEventHandlers()
    Session.CheckInstall()
    D.Log("Session Ready!")
})
void MarkStop("Session")