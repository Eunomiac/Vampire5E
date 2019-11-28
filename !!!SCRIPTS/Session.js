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
            // delete STATE.REF.tokenRecord
            STATE.REF.isTestingActive = STATE.REF.isTestingActive || false
            STATE.REF.sceneChars = STATE.REF.sceneChars || []
            STATE.REF.tokenRecord = STATE.REF.tokenRecord || {Active: {}, Inactive: {}, Daylighter: {}, Downtime: {}, Complications: {}, Spotlight: {}}
            STATE.REF.ActiveTokens = STATE.REF.ActiveTokens || []
            STATE.REF.SessionScribes = STATE.REF.SessionScribes || []
            STATE.REF.SessionModes = STATE.REF.SessionModes || ["Active", "Inactive", "Daylighter", "Downtime", "Complications", "Spotlight"]
            STATE.REF.Mode = STATE.REF.Mode || "Inactive"
            STATE.REF.LastMode = STATE.REF.LastMode || "Inactive"
            STATE.REF.SessionMonologues = STATE.REF.SessionMonologues || []
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
            STATE.REF.locationDetails = STATE.REF.locationDetails || {}
            STATE.REF.locationPointer = STATE.REF.locationPointer || {}
            STATE.REF.FavoriteSites = STATE.REF.FavoriteSites || []
            
            // delete STATE.REF.locationRecord
            
            if (!STATE.REF.locationRecord) {
                STATE.REF.locationRecord = {}
                for (const mode of Session.Modes)
                    STATE.REF.locationRecord[mode] = D.Clone(STATE.REF.curLocation)
            }

        },
    // #endregion

    // #region EVENT HANDLERS: (HANDLEINPUT)
        onChatCall = (call, args, objects, msg) => { 	// eslint-disable-line no-unused-vars
            const charObjs = Listener.GetObjects(objects, "character")
            switch (call) {
                case "start": case "end": case "toggle": {
                    if (isSessionActive())
                        endSession()
                    else
                        startSession()
                    break
                }
                case "next": {
                    sessionMonologue()
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
                        case "macro": {
                            const [charObj] = charObjs,
                                [macroName, macroAction] = args.join(" ").split("!").map(x => x.trim())
                            setMacro(charObj, macroName, `!${macroAction}`)
                            break
                        }
                        case "favsite": {
                            STATE.REF.FavoriteSites.push(args.shift())
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
                        case "pointer": {
                            const pointerObj = Media.GetImg("MapIndicator")
                            if (pointerObj.get("layer") === "objects") {
                                pointerObj.set("layer", "map")
                                Media.GetImg("MapIndicator_Base_1").set("layer", "map")
                            } else if (pointerObj.get("layer") === "map") {                                
                                pointerObj.set("layer", "objects")
                                Media.GetImg("MapIndicator_Base_1").set("layer", "objects")
                            }
                            break
                        }
                        // no default
                    }
                    break
                }
                case "loc": {
                    STATE.REF.pendingLocCommand = {}
                    promptForDistrict(args)
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
                            STATE.REF.pendingLocCommand = Object.assign(STATE.REF.pendingLocCommand, parseLocationString(args.join(" ")))
                            const curCommand = STATE.REF.pendingLocCommand,
                                sceneFocus = curCommand.DistrictCenter && "c" || "l"
                            let isCommandComplete = true
                            if (curCommand.DistrictLeft && !curCommand.DistrictRight || curCommand.DistrictRight && !curCommand.DistrictLeft)
                                break
                            // DistrictCenter, SiteCenter
                            // DistrictLeft, SiteLeft, DistrictRight, SiteRight
                            for (const pos of ["Center", "Left", "Right"])
                                if (curCommand[`District${pos}`] && !curCommand[`Site${pos}`]) {
                                    isCommandComplete = false
                                    if (_.any(_.keys(curCommand), x => x.startsWith("Site")))
                                        break
                                    promptForSite(curCommand)
                                    break
                                }
                            if (isCommandComplete) {
                                setLocation(curCommand, sceneFocus)
                                STATE.REF.pendingLocCommand = {}
                                setTimeout(Media.UpdateSoundscape, 1000)
                            }
                            break
                        }
                        case "pointer": {
                            const siteName = Session.Site,
                                pointerObj = Media.GetImg("MapIndicator"),
                                pointerPos = {left: pointerObj.get("left"), top: pointerObj.get("top")}
                            STATE.REF.locationPointer[siteName] = STATE.REF.locationPointer[siteName] || {}
                            STATE.REF.locationPointer[siteName].pointerPos = pointerPos
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
                        case "favsite": {
                            STATE.REF.FavoriteSites = _.without(STATE.REF.FavoriteSites, args.shift())
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
                Active: () => {                            
                    Char.RefreshDisplays()
                    if (!STATE.REF.isTestingActive)
                        TimeTracker.ToggleClock(true)
                },
                Inactive: () => {
                    Media.ToggleTokens(null, false)
                    TimeTracker.ToggleClock(false)
                    TimeTracker.ToggleCountdown(true)
                },
                Downtime: () => {                    
                    setLocation(BLANKLOCRECORD)
                    TimeTracker.ToggleClock(false)
                    Char.SendHome()
                    if (STATE.REF.LastMode !== "Complications")
                        D.Chat("all", C.HTML.Block([
                            C.HTML.Title("Session Downtime"),
                            C.HTML.Header("Session Status: Downtime"),
                            C.HTML.Body("Clock Stopped.")
                        ]), null, D.RandomString(3))
                },
                Daylighter: () => {},
                Spotlight: (charRef) => {
                    const charObj = D.GetChar(charRef)
                    Char.SendHome()
                    if (VAL({pc: charObj})) {
                        const charData = D.GetCharData(charObj),
                            quad = charData.quadrant,
                            otherCharData = D.GetChars("registered").filter(x => x.id !== charData.id).map(x => D.GetCharData(x))                
                        for (const otherData of otherCharData) {
                            Char.TogglePC(otherData.quadrant, false)
                            Char.SetNPC(otherData.id, "base")
                        }
                        Char.TogglePC(quad, true)
                        Char.SetNPC(charData.id, "base")
                        Media.SetImg("Spotlight", quad, true)
                        D.Chat("all", C.HTML.Block([
                            C.HTML.Title("Spotlight:"),
                            C.HTML.Header(charData.name)
                        ]), null, D.RandomString(3))
                    }
                    setLocation(BLANKLOCRECORD)
                    Char.RefreshDisplays()
                },
                Complications: () => {
                    Media.ToggleTokens(null, false)
                    TimeTracker.ToggleClock(false)
                },
                Testing: () => {
                    STATE.REF.isTestingActive = true
                    Media.ToggleText("testSessionNotice", true)
                    D.Alert("Test Session <b>ACTIVE</b>.", "!sess test")
                }
            },
            leaveMode: {
                Active: () => {},
                Inactive: () => {                    
                    TimeTracker.ToggleClock(true)
                    TimeTracker.ToggleCountdown(false)
                },
                Downtime: () => {
                    D.Chat("all", C.HTML.Block([
                        C.HTML.Title("Session Downtime"),
                        C.HTML.Header("Session Status: Regular Time"),
                        C.HTML.Body("Clock Started.")
                    ]), null, D.RandomString(3))
                },
                Daylighter: () => {},
                Spotlight: () => {
                    for (const charData of D.GetChars("registered").map(x => D.GetCharData(x))) {
                        Char.SetNPC(charData.id, "base")
                        Char.TogglePC(charData.quadrant, true)
                    }
                    // Media.SetImg("Spotlight", "blank")
                    D.Chat("all", C.HTML.Block([
                        C.HTML.Title("Spotlight"),
                        C.HTML.Header("Spotlight Session Closed.")
                    ]), null, D.RandomString(3))
                },
                Complications: () => {
                    TimeTracker.ToggleClock(true)
                },
                Testing: () => {
                    STATE.REF.isTestingActive = false
                    Media.ToggleText("testSessionNotice", false)
                    D.Alert("Test Session <b>DISABLED</b>.", "!sess test")
                }
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
            STATE.REF.SessionMonologues = _.shuffle(D.GetChars("registered").map(x => D.GetCharData(x).name))
            D.Chat("all", C.HTML.Block([
                C.HTML.Title("VAMPIRE: TORONTO by NIGHT", {fontSize: "28px"}),
                C.HTML.Body("Initializing Session...", {margin: "0px 0px 10px 0px"}),
                C.HTML.Header(`Welcome to Session ${D.NumToText(STATE.REF.SessionNum, true)}!`),
                C.HTML.Body("Clock Running.<br>Animations Online.<br>Roller Ready.", {margin: "10px 0px 10px 0px"}),
                C.HTML.Header(`Session Scribe: ${sessionScribe || "(None Set)"}`),
                C.HTML.Body("(Click <a style = \"color: white; font-weight: normal; background-color: rgba(255,0,0,0.5);\" href=\"https://docs.google.com/document/d/1GsGGDdYTVeHVHgGe9zrztEIN4Qmtpb2xZA8I-_WBnDM/edit?usp=sharing\" target=\"_blank\">&nbsp;here&nbsp;</a> to open the template in a new tab,<br>then create a copy to use for this session.)", {fontSize: "14px", lineHeight: "14px"}),
                C.HTML.Body("Thank you for your service!")
            ]), null, D.RandomString(3))
            changeMode("Active", true)
            // Media.ToggleImg("MapIndicator_Base_1", true)
            // Media.ToggleAnim("MapIndicator", true)


        },
        endSession = () => {
            if (STATE.REF.isTestingActive || sessionMonologue() && remorseCheck()) {
                D.Chat("all", C.HTML.Block([
                    C.HTML.Title("VAMPIRE: TORONTO by NIGHT", {fontSize: "28px"}),
                    C.HTML.Header(`Concluding Session ${D.NumToText(STATE.REF.SessionNum, true)}`),
                    C.HTML.Body("Clock Stopped.<br>Animations Offline.<br>Session Experience Awarded.", {margin: "10px 0px 10px 0px"}),
                    C.HTML.Title("See you next week!", {fontSize: "32px"}),
                ]), null, D.RandomString(3))
                // Char.SendHome()
                changeMode("Inactive", true)
                if (!STATE.REF.isTestingActive) {
                    STATE.REF.dateRecord = null
                    STATE.REF.SessionNum++
                    for (const char of D.GetChars("registered"))
                        Char.AwardXP(char, 2, "Session XP award.")
                } else if (STATE.REF.dateRecord) {
                    TimeTracker.CurrentDate = STATE.REF.dateRecord
                }                    
            }
        },
        sessionMonologue = () => {
            if (STATE.REF.SessionMonologues.length) {
                const thisCharName = STATE.REF.SessionMonologues.pop()
                D.Chat("all", C.HTML.Block([
                    C.HTML.Title("VAMPIRE: TORONTO by NIGHT", {fontSize: "28px"}),
                    C.HTML.Title("Session Monologues", {fontSize: "28px", margin: "-10px 0px 0px 0px"}),
                    C.HTML.Header(thisCharName),
                    C.HTML.Body("The spotlight is yours!")
                ]), null, D.RandomString(3))
                return false
            }
            return true
        },
        logTokens = (mode) => {
            const tokenObjs = findObjs({
                _pageid: D.PAGEID,
                _type: "graphic",
                _subtype: "token"
            }).filter(x => x.get("represents"))
            STATE.REF.tokenRecord[mode] = {}
            for (const tokenObj of tokenObjs)
                STATE.REF.tokenRecord[mode][tokenObj.id] = {
                    charID: tokenObj.get("represents"),
                    left: tokenObj.get("left"),
                    top: tokenObj.get("top"),
                    layer: tokenObj.get("layer"),
                    src: (Media.TOKENS[D.GetName(tokenObj.get("represents"))] || {curSrc: "base"}).curSrc || "base"
                }            
        },
        restoreTokens = (mode) => {
            for (const [tokenID, tokenData] of Object.entries(STATE.REF.tokenRecord[mode])) {
                Media.ToggleToken(tokenData.charID, true)
                Media.SetToken(tokenData.charID, tokenData.src)
                Media.SetImgTemp(tokenID, _.omit(tokenData, "src"))
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
        changeMode = (mode, args) => {
            if (D.Capitalize(D.LCase(mode)) === Session.Mode)
                return null
            if (VAL({string: mode}, "changeMode") && STATE.REF.SessionModes.map(x => x.toLowerCase()).includes(mode.toLowerCase())) {
                const [lastMode, curMode] = [
                    `${STATE.REF.Mode}`,
                    D.Capitalize(mode.toLowerCase())
                ]

                D.Queue(D.Chat, ["Storyteller", `Leaving <b>${lastMode}</b>...`, "none"], "ModeSwitch", 0.1)
                D.Queue(logTokens, [lastMode], "ModeSwitch", 0.1)
                D.Queue(MODEFUNCTIONS.leaveMode[lastMode], [args], "ModeSwitch", 1)
                D.Queue(() => { STATE.REF.Mode = curMode; STATE.REF.LastMode = lastMode }, [], "ModeSwitch", 0.1)
                D.Queue(D.Chat, ["Storyteller", "Configuring Mode Assets...", "none"], "ModeSwitch", 0.1)
                D.Queue(Roller.Clean, [], "ModeSwitch", 1)
                D.Queue(Media.SwitchMode, [], "ModeSwitch", 2)
                D.Queue(setModeLocations, [curMode], "ModeSwitch", 1)
                D.Queue(Media.UpdateSoundscape, [], "ModeSwitch", 1)
                D.Queue(D.Chat, ["Storyteller", `Entering <b>${curMode}</b>...`, "none"], "ModeSwitch", 0.1)
                D.Queue(restoreTokens, [curMode], "ModeSwitch", 0.1)
                D.Queue(MODEFUNCTIONS.enterMode[curMode], [args], "ModeSwitch", 1)
                D.Queue(TimeTracker.Fix, [], "ModeSwitch", 0.1)
                D.Queue(D.Chat, ["Storyteller", "Mode Change Complete!", "none"], "ModeSwitch", 0.1)
                D.Run("ModeSwitch")
            }
            return true
        },
        toggleTesting = (isTesting) => {
            if (isTesting === true)
                MODEFUNCTIONS.enterMode.Testing()
            else if (isTesting === false)
                MODEFUNCTIONS.leaveMode.Testing()
            else if (STATE.REF.isTestingActive)
                MODEFUNCTIONS.leaveMode.Testing()
            else
                MODEFUNCTIONS.enterMode.Testing()
        },
        toggleDowntime = () => {
            if (STATE.REF.Mode === "Downtime")
                changeMode(STATE.REF.LastMode)
            else
                changeMode("Downtime")
        },
        toggleSpotlight = (charRef) => {
            if (STATE.REF.Mode === "Spotlight")
                changeMode(STATE.REF.LastMode)
            else             
                changeMode("Spotlight", charRef)
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
            locString = locString.replace(/@\|@/gu, ":").replace(/name:(.*?);/gu, x => x.replace(/\s/gu, "@_@").replace(/:/gu, "@C@").replace(/\|/gu, "@P@").replace(/name@C@/gu, "name:"))
            const locCommands = locString.split(/\s/gu).map(x => x.replace(/@_@/gu, " ")),
                locParams = {}
            for (const locCommand of locCommands) {
                const commands = locCommand.replace(/:name/gu, "").replace(/;$/gu, "").split(/[:|]/gu).map(x => x.replace(/@C@/gu, ":").replace(/@P@/gu, "|"))
                locParams[commands.shift()] = commands
            }
            DB({locString, locParams}, "parseLocationString")
            const siteCenterKey = locParams.SiteCenter && locParams.SiteCenter[0] || STATE.REF.curLocation.SiteCenter[0] !== "blank" && STATE.REF.curLocation.SiteCenter[0]
            if (siteCenterKey && (!locParams.SubLocs || _.any(locParams.SubLocs, v => v === false)) && STATE.REF.locationDetails[siteCenterKey] && STATE.REF.locationDetails[siteCenterKey].subLocs)
                locParams.SubLocs = Object.assign({}, BLANKLOCRECORD.SubLocs, STATE.REF.locationDetails[siteCenterKey].subLocs, _.omit(locParams.SubLocs, v => v === false))
            if (siteCenterKey && locParams.SubLocs) {                
                STATE.REF.locationDetails[siteCenterKey] = STATE.REF.locationDetails[siteCenterKey] || {}
                STATE.REF.locationDetails[siteCenterKey].subLocs = Object.assign({}, BLANKLOCRECORD.SubLocs, STATE.REF.locationDetails[siteCenterKey].subLocs || {}, _.omit(locParams.SubLocs, v => v === false))
            }
            for (const [locPos, locDetails] of Object.entries(locParams).filter(x => x[0].includes("Site")))
                if (locDetails[1] && locDetails[1] === " ") {
                    STATE.REF.locationDetails[locDetails[0]] = STATE.REF.locationDetails[locDetails[0]] || {}
                    delete STATE.REF.locationDetails[locDetails[0]].siteName
                    locParams[locPos] = locParams[locPos].slice(0, 1)
                } else if (STATE.REF.locationDetails[locDetails[0]] && STATE.REF.locationDetails[locDetails[0]].siteName && !locDetails[1]) {
                    locParams[locPos][1] = STATE.REF.locationDetails[locDetails[0]].siteName
                } else {
                    STATE.REF.locationDetails[locDetails[0]] = STATE.REF.locationDetails[locDetails[0]] || {};
                    [, STATE.REF.locationDetails[locDetails[0]].siteName] = locDetails
                }
            return _.omit(locParams, (v, k) => k.replace(/[^A-Za-z]/gu, "") === "")
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
            if (_.keys(locParams).find(x => x.includes("Center"))) {
                newLocData.DistrictLeft = ["blank"]
                newLocData.DistrictRight = ["blank"]
                newLocData.SiteLeft = ["blank"]
                newLocData.SiteRight = ["blank"]
            } else if (_.keys(locParams).find(x => x.includes("Right") || x.includes("Left"))) {
                newLocData.DistrictCenter = ["blank"]
                newLocData.SiteCenter = ["blank"]                
            }
            for (const [locPos, locData] of Object.entries(newLocData))
                if (locPos === "SubLocs") {
                    continue
                } else if (locData[0] === "same") {
                    newLocData[locPos] = getParentLocData(locPos)
                    if (locData[1] && newLocData[locPos])
                        [,newLocData[locPos][1]] = locData
                    if (locPos === "SiteCenter") 
                        newLocData.SubLocs = D.Clone(!_.keys(locParams).includes("SubLocs") && STATE.REF.locationDetails[newLocData.SiteCenter[0]] && STATE.REF.locationDetails[newLocData.SiteCenter[0]].subLocs || curLocData.SubLocs)
                } else if (locData[0] === "blank") {
                    newLocData[locPos] = ["blank"]
                }
            if (newLocData.SiteCenter[0] === "blank")
                newLocData.SubLocs = _.clone(BLANKLOCRECORD.SubLocs)
            STATE.REF.curLocation = D.Clone(newLocData)
            STATE.REF.locationRecord[Session.Mode] = D.Clone(newLocData)        
            if (newLocData.DistrictLeft[0] !== "blank" && _.isEqual(newLocData.DistrictLeft, newLocData.DistrictRight)) {
                newLocData.DistrictCenter = [..._.flatten([newLocData.DistrictLeft])]
                newLocData.DistrictLeft = ["blank"]
                newLocData.DistrictRight = ["blank"]
            }
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
        promptForDistrict = (locPoss) => {
            locPoss = VAL({string:locPoss}) ? locPoss.split(/\s/gu) : locPoss
            const menuSections = [],
                distNames = _.keys(C.DISTRICTS)
            for (const locPos of locPoss)
                menuSections.push(...[
                    {type:"Header", contents: locPos},
                    ...distNames.length ? _.values(_.groupBy(distNames.map(x => ({name: x, command: `!sess set loc District${locPos}@|@${x}`, styles: {width: "30%", fontSize: "12px", bgColor: C.COLORS.purple, buttonTransform: "none"}})), (x, i) => Math.floor(i / 3))).map(x => ({type: "ButtonLine", contents: x})) : []
                ])
            if (_.compact(menuSections).length)
                D.CommandMenu({title: "Districts", rows: _.compact(menuSections)})
            /* MENU DATA:
                {
                    title: <string>
                    rows: [
                        Each element represents a full-width horizontal <div> block, contained with "block".
                        Elements should be of the form:
                            {
                                type: <string: "Title", "Header", "Body", "ButtonLine", "ButtonSubheader">
                                contents: <
                                    for TITLE, HEADLINE, TEXT: <string>
                                    for BUTTONS: <array: each element represents a line of buttons, of form:
                                                    for BUTTONS: <list: {name, command, [styles]}>
                                                    for SPACERS: <number: percentage of width, or 0 for equal spacing > 
                                [buttonStyles]: <list of styles to apply to ALL of the buttons in a ButtonLine
                                [styles]: <list of styles for the div, to override the defaults, where keys are style tags and values are the settings>
                            } 
                    ]
                    [blockStyles:] <override C.HTML.Block 'options' parameter.
                }
                */           
        },
        promptForSite = (locParams) => {
            const locPoss = _.uniq(_.keys(locParams).filter(x => x.startsWith("District") && !locParams[x.replace(/District/gu, "Site")]).map(x => x.replace(/District/gu, ""))),
                menuSections = []
            for (const locPos of locPoss) {
                const [distName] = locParams[`District${locPos}`],
                    favSites = STATE.REF.FavoriteSites.filter(x => C.SITES[x].district === null || C.SITES[x].district.includes(distName)),
                    distSites = _.keys(C.SITES).filter(x => C.SITES[x].district && C.SITES[x].district.includes(distName)),
                    anySites = _.keys(C.SITES).filter(x => C.SITES[x].district === null)
                menuSections.push(...[
                    {type:"Header", contents: C.DISTRICTS[distName].fullName},
                    ...favSites.length ? _.values(_.groupBy(favSites.map(x => ({name: x, command: `!sess set loc Site${locPos}@|@${x}`, styles: {width: "30%", fontSize: "12px", bgColor: C.COLORS.purple, buttonTransform: "none"}})), (x, i) => Math.floor(i / 3))).map(x => ({type: "ButtonLine", contents: x})) : [],
                    ...distSites.length ? _.values(_.groupBy(distSites.map(x => ({name: x, command: `!sess set loc Site${locPos}@|@${x}`, styles: {width: "30%", fontSize: "12px", bgColor: C.COLORS.red, buttonTransform: "none"}})), (x, i) => Math.floor(i / 3))).map(x => ({type: "ButtonLine", contents: x})) : [],
                    ...anySites.length ? _.values(_.groupBy(anySites.map(x => ({name: x, command: `!sess set loc Site${locPos}@|@${x}`, styles: {width: "30%", fontSize: "12px", bgColor: C.COLORS.blue, buttonTransform: "none"}})), (x, i) => Math.floor(i / 3))).map(x => ({type: "ButtonLine", contents: x})) : []
                ])
            }
            if (_.compact(menuSections).length)
                D.CommandMenu({title: "Sites", rows: _.compact(menuSections)})
            /* MENU DATA:
                {
                    title: <string>
                    rows: [
                        Each element represents a full-width horizontal <div> block, contained with "block".
                        Elements should be of the form:
                            {
                                type: <string: "Title", "Header", "Body", "ButtonLine", "ButtonSubheader">
                                contents: <
                                    for TITLE, HEADLINE, TEXT: <string>
                                    for BUTTONS: <array: each element represents a line of buttons, of form:
                                                    for BUTTONS: <list: {name, command, [styles]}>
                                                    for SPACERS: <number: percentage of width, or 0 for equal spacing > 
                                [buttonStyles]: <list of styles to apply to ALL of the buttons in a ButtonLine
                                [styles]: <list of styles for the div, to override the defaults, where keys are style tags and values are the settings>
                            } 
                    ]
                    [blockStyles:] <override C.HTML.Block 'options' parameter.
                }
                */           
        },
        setModeLocations = (mode, isForcing = false) => { setLocation(STATE.REF.locationRecord[mode], null, isForcing) },
        getCharsInLocation = (locPos) => {
            const charObjs = []
            for (const loc of getActiveLocations(locPos))
                charObjs.push(...Media.GetContainedChars(loc, {padding: 50}))
            return _.uniq(charObjs)
        },

        // subLocList = ["blank", ..._.uniq(_.keys(Media.IMAGES.SubLocTopLeft_1.srcs)).map(x => `${`(${(x.match(/^[^_]*?([A-Z])[^_]*?([A-Z])[^_]*?_/u) || ["", ""]).slice(1).join("")}) `.replace("() ", "")}${x.replace(/.*?_/gu, "")}`)],
    // #endregion

    // #region Macros
        setMacro = (playerRef, macroName, macroAction, isActivating = false) => {
            const playerID = D.GetPlayerID(playerRef)
            if (playerID) {
                getObj("player", playerID).set({showmacrobar: true})
                let [macroObj] = (findObjs({_type: "macro", _playerid: playerID}) || []).filter(x => D.LCase(x.get("name")) === D.LCase(macroName))
                if (macroObj)
                    macroObj.set("action", macroAction)
                    // D.Alert(`Macro Set: ${JSON.stringify(macroObj)}`)
                else
                    macroObj = createObj("macro", {name: macroName, action: macroAction, visibleto: playerID, playerid: D.GMID()})
                    // D.Alert(`Macro Created: ${JSON.stringify(macroObj)}`)
                if (isActivating)
                    sendChat("Storyteller", `#${macroName}`)
            } else { 
                D.Alert(`Invalid played ID (${D.JS(playerID)}) from playerRef '${D.JS(playerRef)}'`)
            }
        },
        resetLocationMacros = () => {
            const distList = ["same", "blank", ..._.uniq(_.keys(Media.IMAGES.DistrictCenter_1.srcs)).sort()],
                siteList = ["same", "blank", ..._.uniq(_.keys(Media.IMAGES.SiteCenter_1.srcs)).sort()],
                macros = {
                    "LOC-Center": `!sess set loc DistrictCenter:?{Select District|${distList.join("|")}}`,
                    "LOC-Center-Rename": `!sess set loc DistrictCenter:?{Select District|${distList.join("|")}} SiteCenter:?{Select Site|${siteList.join("|")}}:name:?{Custom Name?}; Center`,
                    "LOC-Sides": `!sess set loc DistrictLeft:?{Select District (Left)|${distList.join("|")}} SiteLeft:?{Select Site (Left)|${siteList.join("|")}} DistrictRight:?{Select District (Right)|${distList.join("|")}} SiteRight:?{Select Site (Right)|${siteList.join("|")}} ?{Initial Focus?|Left|Right}`,
                    "LOC-Sides-Rename": `!sess set loc DistrictLeft:?{Select District (Left)|${distList.join("|")}} SiteLeft:?{Select Site (Left)|${siteList.join("|")}}:name:?{Custom Name?}; DistrictRight:?{Select District (Right)|${distList.join("|")}} SiteRight:?{Select Site (Right)|${siteList.join("|")}}:name:?{Custom Name?}; ?{Initial Focus?|Left|Right}`
                }
            // D.Alert(`Macro Text:<br><br>${D.JS(_.values(D.KeyMapObj(macros, null, (v,k) => `<b>${k}</b>: ${v}`)).join("<br>"))}`)
            for (const [macroName, macroAction] of Object.entries(macros))
                setMacro(D.GMID(), macroName, macroAction)
        },
        setSubLocMacro = () => {
            const subLocList = ["blank", ...[..._.uniq(_.keys(Media.IMAGES.SubLocTopLeft_1.srcs)).filter(x => x.startsWith(`${getActiveSite()}_`)).sort(), ..._.uniq(_.keys(Media.IMAGES.SubLocTopLeft_1.srcs)).filter(x => !x.includes("_")).sort()].map(x => `${`(${(x.match(/^[^_]*?([A-Z])[^_]*?([A-Z])[^_]*?_/u) || ["", ""]).slice(1).join("")}) `.replace("() ", "")}${x.replace(/.*?_/gu, "")},${x}`)],
                macros = {
                    "LOC-SubLocations": `!sess set loc SubLocs:?{Top Left|${subLocList.join("|")}}|?{Left|${subLocList.join("|")}}|?{Bottom Left|${subLocList.join("|")}}|?{Top Right|${subLocList.join("|")}}|?{Right|${subLocList.join("|")}}|?{Bottom Right|${subLocList.join("|")}} Center`
                }
            // D.Poke(`Registry: ${D.JSL(_.keys(Media.IMAGES.DistrictCenter_1.srcs))}<br><br>Keys: ${D.JS(_.uniq(_.keys(Media.IMAGES.SubLocTopLeft_1.srcs)).join(", "))}<br><br>Filter: ${D.JS(_.uniq(_.keys(Media.IMAGES.SubLocTopLeft_1.srcs)).filter(x => !x.includes("_") || x.startsWith(`${getActiveSite()}_`)))}`, "Testing")          
            for (const [macroName, macroAction] of Object.entries(macros))
                setMacro(D.GMID(), macroName, macroAction)            
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
                ">[${D.GetName(charObjRow[0])}](!roll quick remorse @${D.GetName(charObjRow[0])})${charObjRow[1] ? ` [${D.GetName(charObjRow[1])}](!roll quick remorse @${D.GetName(charObjRow[1])})` : ""}</span>`)
            D.Chat("Storyteller", `<div style='
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
        '><br>ROLL REMORSE FOR...</span><br>${chatLines.join("<br>")}<br></div>`, undefined, D.RandomString(3))  
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
            if (STATE.REF.locationPointer[Session.Site] && STATE.REF.locationPointer[Session.Site].pointerPos) {
                Media.SetImgData("MapIndicator_Base_1", {left: STATE.REF.locationPointer[Session.Site].pointerPos.left, top: STATE.REF.locationPointer[Session.Site].pointerPos.top}, true)
                Media.GetImg("MapIndicator").set({left: STATE.REF.locationPointer[Session.Site].pointerPos.left, top: STATE.REF.locationPointer[Session.Site].pointerPos.top})
            }
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
        get LastMode() { return STATE.REF.LastMode },
        
        SetMacro: setMacro
    }
})()

on("ready", () => {
    Session.CheckInstall()
    D.Log("Session Ready!")
})
void MarkStop("Session")