void MarkStart("Session")
const Session = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Session",

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
        onChatCall = (call, args, objects, msg) => { 	// eslint-disable-line no-unused-vars
            const charObjs = Listener.GetObjects(objects, "character")
            switch (call) {
                case "start": case "end": case "toggle": {
                    if (isSessionActive())
                        endSession(msg)
                    else
                        startSession()
                    break
                }
                case "add": {
                    switch (D.LCase(call = args.shift())) {
                        case "scene": {
                            addCharToScene(charObjs)
                            break
                        }
                        case "mode": {
                            const [mode, modeSrc] = [args.shift(), args.shift()]
                            if (VAL({string: [mode, modeSrc]}, "!sess add mode", true) && D.IsIn(modeSrc, STATEREF.SessionModes)) {
                                addMode(mode, modeSrc)
                                D.Alert(`Session Mode '${mode}' Added.<br>Current Modes: ${D.JS(STATEREF.SessionModes)}`, "!sess add mode")
                            }
                            break
                        }
                    // no default
                    }
                    break
                }
                case "set": {
                    switch(D.LCase(call = args.shift())) {
                        case "mode": {
                            STATEREF.Mode = D.IsIn(args.shift(), STATEREF.SessionModes) || STATEREF.Mode
                            D.Alert(`Current Session Mode:<br><h3>${STATEREF.Mode}</h3>`, "!sess set mode")
                            break
                        }
                        case "loc": case "location": {
                            setLocation(parseLocationString(args.join(" ")))
                            break
                        }
                        case "scene": {
                            setSceneFocus(args.snift())
                            break
                        }
                        case "date": {
                            STATEREF.dateRecord = null
                            break
                        }
                        default: {
                            setSessionNum(D.Int(call) || STATEREF.SessionNum)
                            break
                        }
                    }
                    break
                }
                case "delete": case "del": {
                    switch (D.LCase(call = args.shift())) {
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
                case "spotlight": {
                    if (args.shift() === "end" || !charObjs || !charObjs.length) 
                        toggleSpotlight()
                    else
                        toggleSpotlight(charObjs.shift())
                    break
                }
                case "daylighters": {
                    STATEREF.Mode = STATEREF.Mode === "Daylighter" ? "Active" : "Daylighter"
                    D.Alert(`Session Mode Set To: ${STATEREF.Mode}`, "Session Set Mode")
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

        MODEFUNCTIONS = {
            enterMode: {
                Active: () => {},
                Inactive: () => {
                    for (const playlist of Media.ActivePlaylists)
                        Media.StopPlaylist(playlist)
                    Media.StartPlaylist("SplashScreen")
                },
                Downtime: () => {},
                Daylighter: () => {},
                Spotlight: () => {},
                Complications: () => {}
            },
            leaveMode: {
                Active: () => {},
                Inactive: () => {
                    for (const playlist of Media.ActivePlaylists)
                        Media.StopPlaylist(playlist)
                    Media.StartPlaylist("MainScore")
                },
                Downtime: () => {},
                Daylighter: () => {},
                Spotlight: () => {
                    for (const charData of D.GetChars("registered").map(x => D.GetCharData(x))) {
                        Char.SetNPC(charData.id, "base")
                        Char.TogglePC(charData.quadrant, true)
                    }
                },
                Complications: () => {}
            }
        },
    // #region Getting & Setting Session Data
        isSessionActive = () => STATEREF.Mode !== "Inactive",
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
            sendChat("Session Start", C.CHATHTML.Block([
                C.CHATHTML.Title("VAMPIRE: TORONTO by NIGHT", {fontSize: "28px"}),
                C.CHATHTML.Body("Initializing Session...", {margin: "0px 0px 10px 0px"}),
                C.CHATHTML.Header(`Welcome to Session ${D.NumToText(STATEREF.SessionNum, true)}!`),
                C.CHATHTML.Body("Clock Running.<br>Animations Online.<br>Roller Ready.", {margin: "10px 0px 10px 0px"}),
                C.CHATHTML.Header(`Session Scribe: ${sessionScribe}`),
                C.CHATHTML.Body("Thank you for your service!")
            ]))
            changeMode("Active")
            for (const quadrant of _.keys(Char.REGISTRY)) {
                const {tokenName} = Char.REGISTRY[quadrant]
                Media.SetImg(tokenName, STATEREF.tokenRecord[tokenName] || "base")
            }
            Char.SendBack()
            TimeTracker.StopCountdown()
            TimeTracker.StartClock()
            Char.RefreshDisplays()
            TimeTracker.Fix()
        },
        endSession = () => {
            if (remorseCheck()) {
                sendChat("Session End", C.CHATHTML.Block([
                    C.CHATHTML.Title("VAMPIRE: TORONTO by NIGHT", {fontSize: "28px"}),
                    C.CHATHTML.Header(`Concluding Session ${D.NumToText(STATEREF.SessionNum, true)}`),
                    C.CHATHTML.Body("Clock Stopped.<br>Animations Offline.<br>Session Experience Awarded.", {margin: "10px 0px 10px 0px"}),
                    C.CHATHTML.Title("See you next week!", {fontSize: "32px"}),
                ]))
                Char.SendHome()
                changeMode("Inactive")
                STATEREF.tokenRecord = {}
                if (!STATEREF.isTestingActive) {
                    STATEREF.dateRecord = null
                    for (const char of D.GetChars("registered"))
                        Char.AwardXP(char, 2, "Session XP award.")
                } else if (STATEREF.dateRecord) {
                    TimeTracker.CurrentDate = STATEREF.dateRecord
                    TimeTracker.Fix()
                }
                for (const charData of D.GetChars("registered").map(x => D.GetCharData(x)))                  
                    Char.SetNPC(charData.id, "base")
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
        addMode = (mode, modeSrc) => {
            if (VAL({string: [mode, modeSrc]}, "addMode", true)) {
                if (!Session.Modes.includes(mode)) {
                    Session.Modes.push(mode)
                    STATEREF.locationRecord[mode] = D.Clone(BLANKLOCRECORD)
                }
                for (const imgKey of _.keys(Media.IMAGES))
                    Media.IMAGES[imgKey].modes[mode] = D.Clone(Media.IMAGES[imgKey].modes[modeSrc])
                for (const textKey of _.keys(Media.TEXT))
                    Media.TEXT[textKey].modes[mode] = D.Clone(Media.TEXT[textKey].modes[modeSrc])            
            }
        },
        enterMode = mode => {

        },
        leaveMode = mode => {

        },
        changeMode = mode => {
            if (VAL({string: mode}, "changeMode") && STATEREF.SessionModes.map(x => x.toLowerCase()).includes(mode.toLowerCase())) {
                const [lastMode, curMode] = [
                    `${STATEREF.Mode}`,
                    D.Capitalize(mode.toLowerCase())
                ]
                if (MODEFUNCTIONS.leaveMode[lastMode])
                    MODEFUNCTIONS.leaveMode[lastMode]()
                STATEREF.Mode = curMode
                STATEREF.LastMode = lastMode
                // D.Alert(`Modes Set: ${STATEREF.Mode}, Last: ${STATEREF.LastMode}`)
                Roller.Clean()
                Media.SwitchMode()
                setModeLocations(curMode)
                if (MODEFUNCTIONS.enterMode[curMode])
                    MODEFUNCTIONS.enterMode[curMode]()
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
            changeMode(STATEREF.Mode === "Downtime" ? "Active" : "Downtime")
            if (STATEREF.Mode === "Downtime") {
                setLocation(BLANKLOCRECORD)
                TimeTracker.StopClock()
                Char.SendHome()
                sendChat("Session Downtime", C.CHATHTML.Block([
                    C.CHATHTML.Title("Session Downtime"),
                    C.CHATHTML.Header("Session Status: Downtime"),
                    C.CHATHTML.Body("Clock Stopped.")
                ]))
            } else {
                TimeTracker.StartClock()
                Char.SendBack()
                sendChat("Session Downtime", C.CHATHTML.Block([
                    C.CHATHTML.Title("Session Downtime"),
                    C.CHATHTML.Header("Session Status: Regular Time"),
                    C.CHATHTML.Body("Clock Started.")
                ]))
            }
            Char.RefreshDisplays()
            TimeTracker.Fix()
        },
        toggleSpotlight = (charRef) => {
            const charObj = D.GetChar(charRef)
            if (VAL({pc: charObj})) {
                const charData = D.GetCharData(charObj),
                    quad = charData.quadrant,
                    spotlightOn = Media.GetImgData("Spotlight").curSrc,
                    otherCharData = D.GetChars("registered").filter(x => x.id !== charData.id).map(x => D.GetCharData(x))
                if (STATEREF.Mode !== "Spotlight" || spotlightOn !== quad) {
                    changeMode("Spotlight")
                    setLocation(BLANKLOCRECORD)
                    Char.SendHome()
                    for (const otherData of otherCharData) {
                        Char.TogglePC(otherData.quadrant, false)
                        Char.SetNPC(otherData.id, "base")
                    }
                    Char.TogglePC(quad, true)
                    Char.SetNPC(charData.id, "base")
                    Media.SetImg("Spotlight", quad, true)
                    sendChat("Spotlight", C.CHATHTML.Block([
                        C.CHATHTML.Title("Spotlight:"),
                        C.CHATHTML.Header(charData.name)
                    ]))
                }
            } else {
                changeMode(STATEREF.LastMode === "Spotlight" && "Active" || STATEREF.LastMode)
                Char.SendBack()
                Media.SetImg("Spotlight", "blank")
                sendChat("Spotlight", C.CHATHTML.Block([
                    C.CHATHTML.Title("Spotlight"),
                    C.CHATHTML.Header("Spotlight Session Closed.")
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
        getActiveLocations = (sideFocus) => {
            const activeLocs = _.keys(STATEREF.curLocation).filter(x => STATEREF.curLocation[x] !== "blank")
            switch({c: "Center", l: "Left", r: "Right", a: "All"}[(sideFocus || STATEREF.sceneFocus || "a").toLowerCase().charAt(0)]) {
                case "Center":
                    return activeLocs.filter(x => x.endsWith("Center"))
                case "Left":
                    return activeLocs.filter(x => !x.endsWith("Right"))                 
                case "Right":
                    return activeLocs.filter(x => !x.endsWith("Left"))   
                // no default
            }
            return activeLocs
        },
        getActiveSceneLocations = () => getActiveLocations(STATEREF.sceneFocus),
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
            setSceneFocus(STATEREF.sceneFocus)
        },
        setModeLocations = (mode) => { setLocation(STATEREF.locationRecord[mode]) },
        getCharsInLocation = (locPos) => {
            const charObjs = []
            for (const loc of getActiveLocations(locPos))
                charObjs.push(...Media.GetContainedChars(loc, {padding: 50}))
            return _.uniq(charObjs)
        },
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
                ">[${D.GetName(charObjRow[0])}](!roll quick remorse ${D.GetName(charObjRow[0])})${charObjRow[1] ? ` [${D.GetName(charObjRow[1])}](!roll quick remorse ${D.GetName(charObjRow[1])})` : ""}</span>`)
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
        setSceneFocus = (locPos) => {
            STATEREF.sceneFocus = locPos
            const sceneLocs = getActiveSceneLocations()
            for (const loc of getActiveLocations())
                if (sceneLocs.includes(loc)) 
                    Media.SetImgTemp(loc, {tint_color: "transparent"})
                else
                    Media.SetImgTemp(loc, {tint_color: "#000000"})
        },
        endScene = () => {
            for (const charID of STATEREF.sceneChars)
                D.SetStat(charID, "willpower_social_toggle", "go")
            STATEREF.sceneChars = []
            setSceneFocus(null)
            D.Alert("Social Willpower Damage partially refunded.", "Scene Ended")
        }
    // #endregion

    return {
        CheckInstall: checkInstall,
        OnChatCall: onChatCall,

        ToggleTesting: toggleTesting,
        AddSceneChar: addCharToScene,
        ChangeMode: changeMode,
        CharsIn: getCharsInLocation,
        get SceneChars() { return getCharsInLocation(STATEREF.sceneFocus) },
        get SceneFocus() { return STATEREF.sceneFocus },
        Locations: (locRef) => {
            return D.KeyMapObject(getActiveLocations(locRef), (k, v) => v, v => STATEREF.curLocation[v]) },

        get SessionNum() { return STATEREF.SessionNum },
        get IsSessionActive() { return isSessionActive() },
        get Modes() { return STATEREF.SessionModes },
        get IsTesting() { return STATEREF.isTestingActive },
        get Mode() { return STATEREF.Mode },
        get LastMode() { return STATEREF.LastMode },
        get Location() { return STATEREF.locationRecord },
        
    }
})()

on("ready", () => {
    Session.CheckInstall()
    D.Log("Session Ready!")
})
void MarkStop("Session")