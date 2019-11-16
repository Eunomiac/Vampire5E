void MarkStart("Session")
const Session = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Session",

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
    // #endregion

    // #region LOCAL INITIALIZATION
        initialize = () => { // eslint-disable-line no-empty-function
            // delete STATE.REF.curLocation
            // delete STATE.REF.locationRecord
            STATE.REF.isTestingActive = STATE.REF.isTestingActive || false
            STATE.REF.sceneChars = STATE.REF.sceneChars || []
            STATE.REF.tokenRecord = STATE.REF.tokenRecord || {}
            STATE.REF.SessionScribes = STATE.REF.SessionScribes || []
            STATE.REF.SessionModes = STATE.REF.SessionModes || ["Active", "Inactive", "Daylighter", "Downtime", "Complications", "Spotlight"]
            STATE.REF.Mode = STATE.REF.Mode || "Inactive"
            STATE.REF.LastMode = STATE.REF.LastMode || "Inactive"
            STATE.REF.curLocation = STATE.REF.curLocation || {
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
            STATE.REF.locationRecord = STATE.REF.locationRecord || null
            
            // delete STATE.REF.locationRecord
            
            if (!STATE.REF.locationRecord) {
                STATE.REF.locationRecord = {}
                for (const mode of Session.Modes)
                    STATE.REF.locationRecord[mode] = D.Clone(STATE.REF.curLocation)
            }

            STATE.REF.locationRecord.Inactive = _.clone(BLANKLOCRECORD)
                
                                 
        // STATE.REF.SessionScribes = [ "Thaumaterge", "Ava Wong", "banzai", "PixelPuzzler" ]
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
                            if (VAL({string: [mode, modeSrc]}, "!sess add mode", true) && D.IsIn(modeSrc, STATE.REF.SessionModes)) {
                                addMode(mode, modeSrc)
                                D.Alert(`Session Mode '${mode}' Added.<br>Current Modes: ${D.JS(STATE.REF.SessionModes)}`, "!sess add mode")
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
                            STATE.REF.Mode = D.IsIn(args.shift(), STATE.REF.SessionModes) || STATE.REF.Mode
                            D.Alert(`Current Session Mode:<br><h3>${STATE.REF.Mode}</h3>`, "!sess set mode")
                            break
                        }
                        case "loc": case "location": {
                            let sceneFocus = args[args.length - 1]
                            if (["center", "left", "right", "all"].includes(D.LCase(sceneFocus)))
                                args.pop()
                            else
                                sceneFocus = undefined
                            setLocation(parseLocationString(args.join(" ")), sceneFocus)
                            setTimeout(Media.UpdateSoundscape, 1000)
                            break
                        }
                        case "scene": {
                            setSceneFocus(args.shift())
                            break
                        }
                        case "date": {
                            STATE.REF.dateRecord = null
                            break
                        }
                        case "macros": {
                            resetLocationMacros()
                            break
                        }
                        default: {
                            setSessionNum(D.Int(call) || STATE.REF.SessionNum)
                            break
                        }
                    }
                    break
                }
                case "delete": case "del": {
                    switch (D.LCase(call = args.shift())) {
                        case "mode": {
                            const mode = args.shift()
                            if (VAL({string: mode}, "!sess add mode") && D.IsIn(mode, STATE.REF.SessionModes)) {
                                STATE.REF.SessionModes = _.without(STATE.REF.SessionModes, D.IsIn(mode, STATE.REF.SessionModes))
                                D.Alert(`Session Mode '${mode}' Removed.<br>Current Modes: ${D.JS(STATE.REF.SessionModes)}`, "!sess del mode")
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
                    STATE.REF.Mode = STATE.REF.Mode === "Daylighter" ? "Active" : "Daylighter"
                    D.Alert(`Session Mode Set To: ${STATE.REF.Mode}`, "Session Set Mode")
                    DragPads.Toggle("signalLight", STATE.REF.Mode !== "Daylighter")
                    TimeTracker.Fix()
                    for (const charData of _.values(Char.REGISTRY).slice(0, 4)) {
                        const [token] = findObjs({
                            _pageid: D.PAGEID,
                            _type: "graphic",
                            _subtype: "token",
                            represents: charData.id
                        })
                        if (STATE.REF.Mode === "Daylighter") {
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
                                    D.Alert(D.JS(STATE.REF.curLocation), "Testing STATE.curLocation")
                                    break
                                }
                                case "locrecord": {
                                    D.Alert(D.JS(STATE.REF.locationRecord), "Testing STATE.locationRecord")
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
        isSessionActive = () => STATE.REF.Mode !== "Inactive",
        setSessionNum = sNum => {
            STATE.REF.SessionNum = sNum
            D.Alert(`Session Number <b>${D.NumToText(STATE.REF.SessionNum)}</b> SET.`)
        },
    // #endregion

    // #region Starting/Ending Sessions
        startSession = () => {
            const sessionScribe = STATE.REF.isTestingActive ? STATE.REF.SessionScribes[0] : STATE.REF.SessionScribes.shift()
            if (STATE.REF.isTestingActive)
                STATE.REF.dateRecord = TimeTracker.CurrentDate.getTime()
            else
                STATE.REF.dateRecord = null
            if (STATE.REF.SessionScribes.length === 0) {
                DB(`Scribe: ${sessionScribe}, SessionScribes: ${D.JSL(STATE.REF.SessionScribes)}
                    PICK: ${D.JS(_.pick(Char.REGISTRY, v => v.playerName !== sessionScribe))}
                    PLUCK: ${D.JS(_.pluck(_.pick(Char.REGISTRY, v => v.playerName !== sessionScribe), "playerName"))}
                    WITHOUT: ${D.JS(_.without(_.pluck(_.pick(Char.REGISTRY, v => v.playerName !== sessionScribe), "playerName"), "Storyteller"))}`, "startSession")
                const otherScribes = _.shuffle(_.without(_.pluck(_.pick(Char.REGISTRY, v => v.playerName !== sessionScribe), "playerName"), "Storyteller"))
                STATE.REF.SessionScribes.push(otherScribes.pop(), ..._.shuffle([...otherScribes, sessionScribe]))
            }
            D.Chat("all", C.CHATHTML.Block([
                C.CHATHTML.Title("VAMPIRE: TORONTO by NIGHT", {fontSize: "28px"}),
                C.CHATHTML.Body("Initializing Session...", {margin: "0px 0px 10px 0px"}),
                C.CHATHTML.Header(`Welcome to Session ${D.NumToText(STATE.REF.SessionNum, true)}!`),
                C.CHATHTML.Body("Clock Running.<br>Animations Online.<br>Roller Ready.", {margin: "10px 0px 10px 0px"}),
                C.CHATHTML.Header(`Session Scribe: ${sessionScribe || "(None Set)"}`),
                C.CHATHTML.Body("Thank you for your service!")
            ]), null, D.RandomString(10))
            changeMode("Active", true)
            for (const quadrant of _.keys(Char.REGISTRY)) {
                const {tokenName} = Char.REGISTRY[quadrant]
                Media.SetImg(tokenName, STATE.REF.tokenRecord[tokenName] || "base")
            }
            Char.SendBack()
            TimeTracker.StopCountdown()
            TimeTracker.StartClock()
            Char.RefreshDisplays()
            TimeTracker.Fix()
        },
        endSession = () => {
            if (remorseCheck()) {
                D.Chat("all", C.CHATHTML.Block([
                    C.CHATHTML.Title("VAMPIRE: TORONTO by NIGHT", {fontSize: "28px"}),
                    C.CHATHTML.Header(`Concluding Session ${D.NumToText(STATE.REF.SessionNum, true)}`),
                    C.CHATHTML.Body("Clock Stopped.<br>Animations Offline.<br>Session Experience Awarded.", {margin: "10px 0px 10px 0px"}),
                    C.CHATHTML.Title("See you next week!", {fontSize: "32px"}),
                ]), null, D.RandomString(10))
                // Char.SendHome()
                changeMode("Inactive", true)
                STATE.REF.tokenRecord = {}
                if (!STATE.REF.isTestingActive) {
                    STATE.REF.dateRecord = null
                    for (const char of D.GetChars("registered"))
                        Char.AwardXP(char, 2, "Session XP award.")
                } else if (STATE.REF.dateRecord) {
                    TimeTracker.CurrentDate = STATE.REF.dateRecord
                    TimeTracker.Fix()
                }
                for (const charData of D.GetChars("registered").map(x => D.GetCharData(x)))                  
                    Char.SetNPC(charData.id, "base")
                TimeTracker.StopClock()
                TimeTracker.StopLights()
                TimeTracker.StartCountdown()
                TimeTracker.Fix()
                if (!STATE.REF.isTestingActive)
                    STATE.REF.SessionNum++
            }
        },
    // #endregion

    // #region Toggling Session Modes
        addMode = (mode, modeSrc) => {
            if (VAL({string: [mode, modeSrc]}, "addMode", true)) {
                if (!Session.Modes.includes(mode)) {
                    Session.Modes.push(mode)
                    STATE.REF.locationRecord[mode] = D.Clone(BLANKLOCRECORD)
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
        changeMode = (mode, isUpdatingMedia = true) => {
            if (D.Capitalize(D.LCase(mode)) === Session.Mode)
                return null
            if (VAL({string: mode}, "changeMode") && STATE.REF.SessionModes.map(x => x.toLowerCase()).includes(mode.toLowerCase())) {
                const [lastMode, curMode] = [
                    `${STATE.REF.Mode}`,
                    D.Capitalize(mode.toLowerCase())
                ]
                if (MODEFUNCTIONS.leaveMode[lastMode])
                    MODEFUNCTIONS.leaveMode[lastMode]()
                STATE.REF.Mode = curMode
                STATE.REF.LastMode = lastMode
                // D.Alert(`Modes Set: ${STATE.REF.Mode}, Last: ${STATE.REF.LastMode}`)
                if (isUpdatingMedia) {
                    Roller.Clean()
                    Media.SwitchMode()
                    setModeLocations(curMode)
                    if (MODEFUNCTIONS.enterMode[curMode])
                        MODEFUNCTIONS.enterMode[curMode]()
                    Media.UpdateSoundscape()
                }
            }
            return true
        },
        toggleTesting = (isTesting) => {
            if (isTesting === false || isTesting === true) {
                if (isTesting === STATE.REF.isTestingActive)
                    return
                STATE.REF.isTestingActive = isTesting
            } else {
                STATE.REF.isTestingActive = !STATE.REF.isTestingActive
            }
            Media.ToggleText("testSessionNotice", STATE.REF.isTestingActive)
            D.Alert(`Testing Set to ${STATE.REF.isTestingActive}`, "!sess test")
        },
        toggleDowntime = () => {
            changeMode(STATE.REF.Mode === "Downtime" ? "Active" : "Downtime")
            if (STATE.REF.Mode === "Downtime") {
                setLocation(BLANKLOCRECORD)
                TimeTracker.StopClock()
                Char.SendHome()
                D.Chat("all", C.CHATHTML.Block([
                    C.CHATHTML.Title("Session Downtime"),
                    C.CHATHTML.Header("Session Status: Downtime"),
                    C.CHATHTML.Body("Clock Stopped.")
                ]), null, D.RandomString(10))
            } else {
                TimeTracker.StartClock()
                Char.SendBack()
                D.Chat("all", C.CHATHTML.Block([
                    C.CHATHTML.Title("Session Downtime"),
                    C.CHATHTML.Header("Session Status: Regular Time"),
                    C.CHATHTML.Body("Clock Started.")
                ]), null, D.RandomString(10))
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
                if (STATE.REF.Mode !== "Spotlight" || spotlightOn !== quad) {
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
                    D.Chat("all", C.CHATHTML.Block([
                        C.CHATHTML.Title("Spotlight:"),
                        C.CHATHTML.Header(charData.name)
                    ]), null, D.RandomString(10))
                }
            } else {
                changeMode(STATE.REF.LastMode === "Spotlight" && "Active" || STATE.REF.LastMode)
                Char.SendBack()
                Media.SetImg("Spotlight", "blank")
                D.Chat("all", C.CHATHTML.Block([
                    C.CHATHTML.Title("Spotlight"),
                    C.CHATHTML.Header("Spotlight Session Closed.")
                ]), null, D.RandomString(10))
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
        isLocCentered = () => {
            const activeLocs = _.keys(STATE.REF.curLocation).filter(x => x !== "SubLocs" && STATE.REF.curLocation[x][0] !== "blank")
            if (activeLocs.includes("DistrictCenter") && !activeLocs.includes("SiteLeft") && !activeLocs.includes("SiteRight"))
                return true
            if (activeLocs.includes("DistrictLeft") || activeLocs.includes("DistrictRight") || activeLocs.includes("SiteLeft") || activeLocs.includes("SiteRight"))
                return false
            return null
        },
        getActiveLocations = (sideFocus) => {
            const activeLocs = _.keys(STATE.REF.curLocation).filter(x => x !== "SubLocs" && STATE.REF.curLocation[x][0] !== "blank")
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
        getActiveSceneLocations = () => getActiveLocations(STATE.REF.sceneFocus), // [ "DistrictCenter", "SiteCenter" ]
        getActiveDistrict = () => {
            const [activePos] = getActiveSceneLocations().filter(x => x.includes("District"))
            return activePos && STATE.REF.curLocation[activePos] && STATE.REF.curLocation[activePos][0] || false
        },
        getActiveSite = () => {
            const [activePos] = getActiveSceneLocations().filter(x => x.startsWith("Site"))
            return activePos && STATE.REF.curLocation[activePos] && STATE.REF.curLocation[activePos][0] || false
        },
        getSubLocs = () => {


        },
        isOutside = () => {
            const sceneLocs = _.compact(getActiveSceneLocations().map(x => STATE.REF.curLocation[x][0]))
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
            const locData = _.omit(STATE.REF.curLocation, (v, k) => k !== "SubLocs" && v[0] === "blank"),
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
        setLocation = (locParams, sceneFocus, isForcing = false) => {
            const newLocData = Object.assign(_.clone(BLANKLOCRECORD), locParams, _.omit(STATE.REF.curLocation, (v,k) => k === "SubLocs" || _.keys(locParams).includes(k))),
                curLocData = JSON.parse(JSON.stringify(STATE.REF.curLocation)),
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
            STATE.REF.curLocation = D.Clone(newLocData)
            STATE.REF.locationRecord[Session.Mode] = D.Clone(newLocData) 
            const locDataDelta = _.pick(newLocData, _.keys(newLocData).filter(x => x !== "SubLocs" && (isForcing || !_.isEqual(newLocData[x], curLocData[x]))))
            for (const [subLocPos, subLocName] of Object.entries(newLocData.SubLocs || {}))
                if (isForcing || curLocData.SubLocs[subLocPos] !== subLocName)
                    locDataDelta[`SubLoc${subLocPos}`] = subLocName
            reportStrings.push(`Loc Data Delta: ${D.JS(locDataDelta)}`)
            reportStrings.push(`New STATE.REF Record: ${D.JS(STATE.REF.locationRecord[Session.Mode])}`)
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
            setSceneFocus(sceneFocus || STATE.REF.sceneFocus)
        },
        setModeLocations = (mode, isForcing = false) => { setLocation(STATE.REF.locationRecord[mode], null, isForcing) },
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
                    if (STATE.REF.sceneChars.includes(charObj.id))
                        continue
                    STATE.REF.sceneChars.push(charObj.id)
                }
                D.Alert(`Scene Now Includes:<br><ul>${D.JS(STATE.REF.sceneChars.map(x => `<li><b>${D.GetName(x)}</b>`).join(""))}</ul>`, "Scene Characters")
            }
        },
        setSceneFocus = (locPos) => {
            locPos = locPos || isLocCentered() === true && "Center" || isLocCentered() === false && "Left" || STATE.REF.sceneFocus 
            STATE.REF.sceneFocus = D.LCase(locPos).charAt(0)
            const sceneLocs = getActiveSceneLocations()
            for (const loc of getActiveLocations())
                if (sceneLocs.includes(loc)) 
                    Media.SetImgTemp(loc, {tint_color: "transparent"})
                else
                    Media.SetImgTemp(loc, {tint_color: "#000000"})            
            if (STATE.REF.sceneFocus === "c")
                setSubLocMacro()    
        },
        endScene = () => {
            for (const charID of STATE.REF.sceneChars)
                D.SetStat(charID, "willpower_social_toggle", "go")
            STATE.REF.sceneChars = []
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
        ResetLocations: setModeLocations,
        get SceneChars() { return getCharsInLocation(STATE.REF.sceneFocus) },
        get SceneFocus() { return STATE.REF.sceneFocus },
        Locations: () => D.KeyMapObj(getActiveSceneLocations(), (k, v) => v, v => STATE.REF.curLocation[v][0] !== "blank" && STATE.REF.curLocation[v][0]),
        get Location() { return STATE.REF.locationRecord },
        get District() { return getActiveDistrict() },
        get Site() { return getActiveSite() },
        get IsOutside() { return isOutside() },

        get SessionNum() { return STATE.REF.SessionNum },
        get IsSessionActive() { return isSessionActive() },
        get IsTesting() { return STATE.REF.isTestingActive },

        get Mode() { return STATE.REF.Mode },
        get Modes() { return STATE.REF.SessionModes },
        LastMode: STATE.REF.LastMode        
    }
})()

on("ready", () => {
    Session.CheckInstall()
    D.Log("Session Ready!")
})
void MarkStop("Session")