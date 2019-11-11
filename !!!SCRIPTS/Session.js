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
            // delete STATEREF.curLocation
            // delete STATEREF.locationRecord
            STATEREF.isTestingActive = STATEREF.isTestingActive || false
            STATEREF.sceneChars = STATEREF.sceneChars || []
            STATEREF.tokenRecord = STATEREF.tokenRecord || {}
            STATEREF.SessionScribes = STATEREF.SessionScribes || []
            STATEREF.SessionModes = STATEREF.SessionModes || ["Active", "Inactive", "Daylighter", "Downtime", "Complications", "Spotlight"]
            STATEREF.Mode = STATEREF.Mode || "Inactive"
            STATEREF.LastMode = STATEREF.LastMode || "Inactive"
            STATEREF.curLocation = STATEREF.curLocation || {
                DistrictCenter: ["blank"],
                DistrictLeft: ["blank"],
                DistrictRight: ["blank"],
                SiteCenter: ["blank"],
                SiteLeft: ["blank"],
                SiteRight: ["blank"],
                SubLocs: {
                    TopLeft: "blank",
                    Left: "blank",
                    BotLeft: "blank",
                    TopRight: "blank",
                    Right: "blank",
                    BotRight: "blank"
                }
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
                case "get": {
                    switch (D.LCase(call = args.shift())) {
                        case "locations": case "location": case "loc": {
                            D.Alert(D.JS(Session.Locations()), "Current Location Data")
                            break
                        }
                        case "activelocs": {
                            D.Alert(D.JS(getActiveLocations()), "All Active Locations")
                            break
                        }
                        case "scenelocs": {
                            D.Alert(D.JS(getActiveSceneLocations()), "Active Scene Locations")
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
                            const sceneFocus = args.pop()
                            setLocation(parseLocationString(args.join(" ")))
                            setSceneFocus(sceneFocus)
                            break
                        }
                        case "scene": {
                            setSceneFocus(args.shift())
                            break
                        }
                        case "date": {
                            STATEREF.dateRecord = null
                            break
                        }
                        case "macros": {
                            resetLocationMacros()
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
                case "test": {
                    switch (D.LCase(call = args.shift())) {
                        case "location": case "loc": {
                            switch (D.LCase(call = args.shift())) {
                                case "activelocs": {
                                    D.Alert(D.JS(getActiveLocations(args[0])), `Testing getActiveLocations(${args[0] || ""})`)
                                    break
                                }
                                case "activescenelocs": {
                                    D.Alert(D.JS(getActiveSceneLocations()), "Testing getActiveSceneLocations()")
                                    break
                                }
                                case "activedistrict": {
                                    D.Alert(D.JS(getActiveDistrict()), "Testing getActiveDistrict()")
                                    break
                                }
                                case "activesite": {
                                    D.Alert(D.JS(getActiveSite()), "Testing getActiveSite()")
                                    break
                                }
                                case "sublocs": {
                                    D.Alert(D.JS(getSubLocs()), "Testing getSubLocs()")
                                    break
                                }
                                case "isoutside": {
                                    D.Alert(D.JS(isOutside()), "Testing isOutside()")
                                    break
                                }
                                case "curloc": {
                                    D.Alert(D.JS(STATEREF.curLocation), "Testing STATE.curLocation")
                                    break
                                }
                                case "locrecord": {
                                    D.Alert(D.JS(STATEREF.locationRecord), "Testing STATE.locationRecord")
                                    break
                                }
                                case "parseloc": {
                                    D.Alert(D.JS(parseLocationString(args.join(" "))), `Testing parseLocationString(${args.join(" ")})`)
                                    break
                                }
                                case "parentloc": {
                                    D.Alert(D.JS(getParentLocData(args[0])), `Testing getParentLocData(${args[0] || ""})`)
                                    break
                                }
                                case "locchars": {
                                    D.Alert(D.JS(getCharsInLocation(args[0])), `Testing getCharsInLocation(${args[0] || ""})`)
                                    break
                                }
                                // no default
                            }
                            break
                        }
                        default: {
                            toggleTesting()
                            break
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
                Inactive: () => {},
                Downtime: () => {},
                Daylighter: () => {},
                Spotlight: () => {},
                Complications: () => {}
            },
            leaveMode: {
                Active: () => {},
                Inactive: () => {},
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
                DB(`Scribe: ${sessionScribe}, SessionScribes: ${D.JSL(STATEREF.SessionScribes)}
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
                // Char.SendHome()
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
                TimeTracker.Fix()
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
        enterMode = mode => { // eslint-disable-line no-unused-vars

        },
        leaveMode = mode => { // eslint-disable-line no-unused-vars

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
                Media.UpdateSoundscape()
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
            DistrictCenter: ["blank"],
            DistrictLeft: ["blank"],
            DistrictRight: ["blank"],
            SiteCenter: ["blank"],
            SiteLeft: ["blank"],
            SiteRight: ["blank"],
            SubLocs: {
                TopLeft: "blank",
                Left: "blank",
                BotLeft: "blank",
                TopRight: "blank",
                Right: "blank",
                BotRight: "blank"
            }
        },
        getActiveLocations = (sideFocus) => {
            const activeLocs = _.keys(STATEREF.curLocation).filter(x => x !== "SubLocs" && STATEREF.curLocation[x][0] !== "blank")
            switch({c: "Center", l: "Left", r: "Right", a: "All"}[(sideFocus || "a").toLowerCase().charAt(0)]) {
                case "Center":
                    return activeLocs.filter(x => x.endsWith("Center"))
                case "Left":
                    return activeLocs.filter(x => !x.endsWith("Right"))                 
                case "Right":
                    return activeLocs.filter(x => !x.endsWith("Left"))   
                // no default
            }
            return activeLocs // [ "DistrictCenter", "DistrictLeft", "DistrictRight", "SiteCenter", "SiteLeft", "SiteRight" ]
        },
        getActiveSceneLocations = () => getActiveLocations(STATEREF.sceneFocus), // [ "DistrictCenter", "SiteCenter" ]
        getActiveDistrict = () => {
            const [activePos] = getActiveSceneLocations().filter(x => x.includes("District"))
            return activePos && STATEREF.curLocation[activePos] && STATEREF.curLocation[activePos][0] || false
        },
        getActiveSite = () => {
            const [activePos] = getActiveSceneLocations().filter(x => x.startsWith("Site"))
            return activePos && STATEREF.curLocation[activePos] && STATEREF.curLocation[activePos][0] || false
        },
        getSubLocs = () => {


        },
        isOutside = () => {
            const sceneLocs = _.compact(getActiveSceneLocations().map(x => STATEREF.curLocation[x][0]))
            // D.Poke(D.JS(sceneLocs))
            return sceneLocs.filter(x => !C.LOCATIONS[x].outside).length === 0
        },
        parseLocationString = (locString) => {
            const locParams = [
                ...(locString.match(/([^:;\s]*):([^:;\s]*):name:(.*?);/gu) || []).map(x => x.match(/([^:;\s]*):([^:;\s]*):name:(.*?);/u).slice(1)),
                ...locString.split(" ").filter(x => !x.includes(":name") && x.includes(":") && !x.includes("SubLocs")).map(x => x.split(":")),
                _.compact((locString.split(" ").filter(x => x.startsWith("SubLocs"))[0] || "").split(/[:|]/gu))
            ].filter(x => x.length)
            // D.Poke(`locString: ${D.JS(locString)}<br>.split(): ${D.JS(locString.split(" "))}<br>.filter(): ${D.JS(locString.split(" ").filter(x => x.startsWith("SubLocs")))}<br>[0].split(): ${D.JS(locString.split(" ").filter(x => x.startsWith("SubLocs"))[0].split(/[:|]/gu))}`)
            // D.Poke(D.JS(locParams), "Final Loc Params")
            return D.KeyMapObj(locParams, (k, v) => v[0], (v) => {
                if (v[0] === "SubLocs")
                    if (v.length === 7)
                        return {
                            TopLeft: v[1],
                            Left: v[2],
                            BotLeft: v[3],
                            TopRight: v[4],
                            Right: v[5],
                            BotRight: v[6]
                        }
                    else
                        return false
                else
                    return _.compact(v.slice(1))
            })
        },
        getParentLocData = locPos => {
            const locData = _.omit(STATEREF.curLocation, (v, k) => k !== "SubLocs" && v[0] === "blank"),
                locType = locPos.replace(/(Right|Left|Center)/gu, "")
            switch (locPos.replace(/(District|Site)/gu, "") || [""]) {
                case "Center":
                    return locData[`${locType}Center`] || locData[`${locType}Left`] || locData[`${locType}Right`]
                case "Left": 
                    return locData[`${locType}Left`] || locData[`${locType}Center`] || locData[`${locType}Right`]
                case "Right": 
                    return locData[`${locType}Right`] || locData[`${locType}Center`] || locData[`${locType}Left`]
                case "SubLocs":
                    return locData.SubLocs
                // no default
            }
            return false
        },
        setLocation = (locParams) => {
            const newLocData = Object.assign(_.clone(BLANKLOCRECORD), locParams, _.omit(STATEREF.curLocation, (v,k) => k === "SubLocs" || _.keys(locParams).includes(k))),
                curLocData = JSON.parse(JSON.stringify(STATEREF.curLocation)),
                reportStrings = [
                    `Loc Params: ${D.JS(locParams)}`,
                    `New Loc Data: ${D.JS(newLocData)}`,
                    `Cur Loc Data: ${D.JS(curLocData)}`
                ]
            if(_.keys(locParams).includes("DistrictCenter")) {
                newLocData.DistrictLeft = ["blank"]
                newLocData.DistrictRight = ["blank"]
                newLocData.SiteLeft = ["blank"]
                newLocData.SiteRight = ["blank"]
            } else if (_.keys(locParams).includes("DistrictRight")) {
                newLocData.DistrictCenter = ["blank"]
                newLocData.SiteCenter = ["blank"]
                newLocData.SubLocs = _.clone(BLANKLOCRECORD.SubLocs)
            }
            for (const [locPos, locData] of Object.entries(newLocData))
                if (locPos === "SubLocs") {
                    continue
                } else if (locData[0] === "same") {
                    newLocData[locPos] = getParentLocData(locPos)
                    if (locData[1] && newLocData[locPos])
                        [,newLocData[locPos][1]] = locData
                    if (locPos === "SiteCenter")
                        newLocData.SubLocs = D.Clone(curLocData.SubLocs)
                } else if (locData[0] === "blank") {
                    newLocData[locPos] = ["blank"]
                }
            if (_.isEqual(newLocData.DistrictLeft, newLocData.DistrictRight) && newLocData.DistrictLeft[0] !== "blank") {
                newLocData.DistrictCenter = [..._.flatten([newLocData.DistrictLeft])]
                newLocData.DistrictLeft = ["blank"]
                newLocData.DistrictRight = ["blank"]
            }
            if (!newLocData.SiteCenter || newLocData.SiteCenter[0] === "blank")
                newLocData.SubLocs = {TopLeft: "blank", Left: "blank", BotLeft: "blank", TopRight: "blank", Right: "blank", BotRight: "blank"}
            STATEREF.curLocation = D.Clone(newLocData)
            STATEREF.locationRecord[Session.Mode] = D.Clone(newLocData) 
            const locDataDelta = _.pick(newLocData, _.keys(newLocData).filter(x => x !== "SubLocs" && !_.isEqual(newLocData[x], curLocData[x])))
            for (const [subLocPos, subLocName] of Object.entries(newLocData.SubLocs || {}))
                if (curLocData.SubLocs[subLocPos] !== subLocName)
                    locDataDelta[`SubLoc${subLocPos}`] = subLocName
            reportStrings.push(`Loc Data Delta: ${D.JS(locDataDelta)}`)
            reportStrings.push(`New STATEREF Record: ${D.JS(STATEREF.locationRecord[Session.Mode])}`)
            DB(`<h3>Set Location Processing:</h3>${D.JS(reportStrings.join("<br>"))}`, "setLocation")
            for (const [locPos, locData] of Object.entries(locDataDelta)) {
                const locSrc = VAL({string: locData}) ? locData : locData[0]
                if (locSrc === "blank") {
                    Media.ToggleImg(locPos, false)
                    if (locPos.includes("Site")) {
                        Media.ToggleImg(`SiteBar${locPos.replace(/Site/gu, "")}`, false)
                        Media.ToggleText(`SiteName${locPos.replace(/Site/gu, "")}`, false)
                    }
                } else {
                    Media.SetImg(locPos, locSrc, true)
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
        resetLocationMacros = () => {
            const distList = ["same", "blank", ..._.uniq(_.keys(Media.IMAGES.DistrictCenter_1.srcs))],
                siteList = ["same", "blank", ..._.uniq(_.keys(Media.IMAGES.SiteCenter_1.srcs))],
                macros = {
                    "LOC-Center": `!sess set loc DistrictCenter:?{Select District|${distList.join("|")}} SiteCenter:?{Select Site|${siteList.join("|")}} Center`,
                    "LOC-Center-Rename": `!sess set loc DistrictCenter:?{Select District|${distList.join("|")}} SiteCenter:?{Select Site|${siteList.join("|")}}:name:?{Custom Name?}; Center`,
                    "LOC-Sides": `!sess set loc DistrictLeft:?{Select District (Left)|${distList.join("|")}} SiteLeft:?{Select Site (Left)|${siteList.join("|")}} DistrictRight:?{Select District (Right)|${distList.join("|")}} SiteRight:?{Select Site (Right)|${siteList.join("|")}} ?{Initial Focus?|Left|Right}`,
                    "LOC-Sides-Rename": `!sess set loc DistrictLeft:?{Select District (Left)|${distList.join("|")}} SiteLeft:?{Select Site (Left)|${siteList.join("|")}}:name:?{Custom Name?}; DistrictRight:?{Select District (Right)|${distList.join("|")}} SiteRight:?{Select Site (Right)|${siteList.join("|")}}:name:?{Custom Name?}; ?{Initial Focus?|Left|Right}`
                }
            D.Alert(`Macro Text:<br><br>${D.JS(_.values(D.KeyMapObj(macros, null, (v,k) => `<b>${k}</b>: ${v}`)).join("<br>"))}`)
            for (const [macroName, macroAction] of Object.entries(macros)) {
                const [macroObj] = (findObjs({_type: "macro", _playerid: D.GMID()}) || []).filter(x => x.get("name") === macroName)
                if (macroObj)
                    macroObj.set("action", macroAction)
            }
        },
        setSubLocMacro = () => {
            const subLocList = ["blank", ...[..._.uniq(_.keys(Media.IMAGES.SubLocTopLeft_1.srcs)).filter(x => x.startsWith(`${getActiveSite()}_`)).sort(), ..._.uniq(_.keys(Media.IMAGES.SubLocTopLeft_1.srcs)).filter(x => !x.includes("_")).sort()].map(x => `${`(${(x.match(/^[^_]*?([A-Z])[^_]*?([A-Z])[^_]*?_/u) || ["", ""]).slice(1).join("")}) `.replace("() ", "")}${x.replace(/.*?_/gu, "")},${x}`)],
                macros = {
                    "LOC-SubLocations": `!sess set loc SubLocs:?{Top Left|${subLocList.join("|")}}|?{Left|${subLocList.join("|")}}|?{Bottom Left|${subLocList.join("|")}}|?{Top Right|${subLocList.join("|")}}|?{Right|${subLocList.join("|")}}|?{Bottom Right|${subLocList.join("|")}} Center`
                }
            // D.Poke(`Registry: ${D.JSL(_.keys(Media.IMAGES.DistrictCenter_1.srcs))}<br><br>Keys: ${D.JS(_.uniq(_.keys(Media.IMAGES.SubLocTopLeft_1.srcs)).join(", "))}<br><br>Filter: ${D.JS(_.uniq(_.keys(Media.IMAGES.SubLocTopLeft_1.srcs)).filter(x => !x.includes("_") || x.startsWith(`${getActiveSite()}_`)))}`, "Testing")          
            for (const [macroName, macroAction] of Object.entries(macros)) {
                const [macroObj] = (findObjs({_type: "macro", _playerid: D.GMID()}) || []).filter(x => x.get("name") === macroName)
                if (macroObj)
                    macroObj.set("action", macroAction)
            }
        },

        // subLocList = ["blank", ..._.uniq(_.keys(Media.IMAGES.SubLocTopLeft_1.srcs)).map(x => `${`(${(x.match(/^[^_]*?([A-Z])[^_]*?([A-Z])[^_]*?_/u) || ["", ""]).slice(1).join("")}) `.replace("() ", "")}${x.replace(/.*?_/gu, "")}`)],
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
            STATEREF.sceneFocus = D.LCase(locPos).charAt(0)
            const sceneLocs = getActiveSceneLocations()
            for (const loc of getActiveLocations())
                if (sceneLocs.includes(loc)) 
                    Media.SetImgTemp(loc, {tint_color: "transparent"})
                else
                    Media.SetImgTemp(loc, {tint_color: "#000000"})            
            Media.UpdateSoundscape()
            if (STATEREF.sceneFocus === "c")
                setSubLocMacro()
            setTimeout(Media.UpdateSoundscape, 1000)
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
        Locations: () => D.KeyMapObj(getActiveSceneLocations(), (k, v) => v, v => STATEREF.curLocation[v][0] !== "blank" && STATEREF.curLocation[v][0]),
        get Location() { return STATEREF.locationRecord },
        get District() { return getActiveDistrict() },
        get Site() { return getActiveSite() },
        get IsOutside() { return isOutside() },

        get SessionNum() { return STATEREF.SessionNum },
        get IsSessionActive() { return isSessionActive() },
        get IsTesting() { return STATEREF.isTestingActive },

        get Mode() { return STATEREF.Mode },
        get Modes() { return STATEREF.SessionModes },
        get LastMode() { return STATEREF.LastMode }        
    }
})()

on("ready", () => {
    Session.CheckInstall()
    D.Log("Session Ready!")
})
void MarkStop("Session")