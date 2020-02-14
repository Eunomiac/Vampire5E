void MarkStart("Session")
const Session = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    let PENDINGLOCCOMMAND
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
            
            // STATE.REF.SessionScribes = ["PixelPuzzler"]

            /*
            STATE.REF.customLocs = {
                ["Site: Orchid"]: {
                    district: "YongeStreet",
                    site: "SiteLotus",
                    siteName: "Site: Orchid",
                    subLocs: {
                        TopLeft: "SiteLotus_LockeQuarters",
                        Left: "Security",
                        BotLeft: "SiteLotus_RoyQuarters",
                        TopRight: "SiteLotus_NapierQuarters",
                        Right: "Laboratory",
                        BotRight: "SiteLotus_AvaQuarters"
                    },
                    pointerPos: {left: 1001, top: 1995}
                },
                ["Locke's BMW"]: {
                    district: "CityStreets",
                    site: "Vehicle5",
                    siteName: "Locke's BMW"
                },
                ["Bookies' Booty"]: {
                    district: "HarbordVillage",
                    site: "StripClub",
                    siteName: "Bookies' Booty",
                    pointerPos: {left: 588, top: 2145}
                },
                ["The Cat & Adder"]: {
                    district: "Wychwood",
                    site: "WychwoodPub",
                    siteName: "The Cat & Adder",
                    pointerPos: {left: 233, top: 1534}
                },
                SiteLotus: {
                    district: "YongeStreet",
                    site: "SiteLotus",
                    subLocs: {
                        TopLeft: "SiteLotus_LockeQuarters",
                        Left: "Security",
                        BotLeft: "SiteLotus_RoyQuarters",
                        TopRight: "SiteLotus_NapierQuarters",
                        Right: "Laboratory",
                        BotRight: "SiteLotus_AvaQuarters"
                    },
                    pointerPos: {left: 1001, top: 1995} 
                }
            } */
            delete STATE.REF.locationPointer.Vehicle5

            PENDINGLOCCOMMAND = D.Clone(BLANKPENDINGLOCCOMMAND)
            STATE.REF.isTestingActive = STATE.REF.isTestingActive || false
            STATE.REF.sceneChars = STATE.REF.sceneChars || []
            STATE.REF.tokenRecord = STATE.REF.tokenRecord || {Active: {}, Inactive: {}, Daylighter: {}, Downtime: {}, Complications: {}, Spotlight: {}}
            STATE.REF.sceneTokenRecord = STATE.REF.sceneTokenRecord || {Active: {}, Inactive: {}, Daylighter: {}, Downtime: {}, Complications: {}, Spotlight: {}}
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
                subLocs: {
                    TopLeft: "blank",
                    Left: "blank",
                    BotLeft: "blank",
                    TopRight: "blank",
                    Right: "blank",
                    BotRight: "blank"
                }
            }
            STATE.REF.curAct = STATE.REF.curAct || 1
            STATE.REF.locationRecord = STATE.REF.locationRecord || null
            STATE.REF.customLocs = STATE.REF.customLocs || {}
            STATE.REF.locationPointer = STATE.REF.locationPointer || {}
            STATE.REF.FavoriteSites = STATE.REF.FavoriteSites || []
            STATE.REF.FavoriteDistricts = STATE.REF.FavoriteDistricts || []
            
            // delete STATE.REF.locationRecord
            
            if (!STATE.REF.locationRecord) {
                STATE.REF.locationRecord = {}
                for (const mode of Session.Modes)
                    STATE.REF.locationRecord[mode] = D.Clone(STATE.REF.curLocation)
            }

            verifyStateIntegrity() 

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
                case "backup": {
                    delete STATE.REF.backupData
                    const backupData = JSON.stringify(STATE.REF)
                    STATE.REF.backupData = backupData
                    D.Alert(D.JS(JSON.parse(backupData)))
                    break
                }
                case "restore": {
                    const {backupData} = STATE.REF
                    D.Alert(D.JS(JSON.parse(backupData)))
                    state[C.GAMENAME][SCRIPTNAME] = JSON.parse(backupData)
                    break
                }
                case "add": {
                    switch (D.LCase(call = args.shift())) {
                        case "favsite": {
                            STATE.REF.FavoriteSites.push(args.join(" "))
                            break
                        }
                        case "favdist": {
                            STATE.REF.FavoriteDistricts.push(args.join(" "))
                            break
                        }
                        case "scene": {
                            addCharToScene(charObjs)
                            break
                        }
                        case "macro": {
                            const [charObj] = charObjs,
                                [macroName, macroAction] = args.join(" ").split("!").map(x => x.trim())
                            setMacro(charObj, macroName, `!${macroAction}`)
                            break
                        }
                    // no default
                    }
                    break
                }
                case "get": {
                    switch (D.LCase(call = args.shift())) {
                        case "scenechars": {
                            D.Alert(`Scene Focus: ${Session.SceneFocus}<br>Scene Chars: ${D.JS(Session.SceneChars)}`, "Scene Chars")
                            break
                        }
                        case "locations": case "location": case "loc": {
                            D.Alert(D.JS(getAllLocations()), "Current Location Data")
                            break
                        }
                        case "activelocs": {
                            D.Alert(D.JS(getActivePositions()), "All Active Locations")
                            break
                        }
                        case "scenelocs": {
                            D.Alert(D.JS(getActivePositions()), "Active Scene Locations")
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
                    distCommandMenu()
                    break
                }
                case "focus": {
                    switch (D.LCase(call = args.shift())) {
                        case "c":
                        case "l":
                        case "r": {
                            setSceneFocus(D.LCase(call))
                            break
                        }
                        case "toggle": {
                            switch (STATE.REF.sceneFocus) {
                                case "l": setSceneFocus("r"); break
                                case "r": setSceneFocus("l"); break
                                default: sceneFocusCommandMenu(); break
                            }
                            break
                        }
                        default: {
                            sceneFocusCommandMenu()
                            break
                        }
                    }
                    break
                }
                case "set": {
                    switch(D.LCase(call = args.shift())) {
                        case "act": {
                            STATE.REF.curAct = D.Int(args[0]) || STATE.REF.curAct
                            break
                        }
                        case "mode": {
                            STATE.REF.Mode = D.IsIn(args.shift(), STATE.REF.SessionModes) || STATE.REF.Mode
                            D.Alert(`Current Session Mode:<br><h3>${STATE.REF.Mode}</h3>`, "!sess set mode")
                            break
                        }
                        case "pointer": {
                            const pointerObj = Media.GetImg("MapIndicator"),
                                [siteRef, siteName] = getActiveSite(true)
                            if (ISSETTINGPOINTER) {
                                const pointerPos = {left: pointerObj.get("left"), top: pointerObj.get("top")}
                                if (siteName in STATE.REF.customLocs) {
                                    STATE.REF.customLocs[siteName].pointerPos = pointerPos
                                } else {
                                    STATE.REF.locationPointer[siteRef] = STATE.REF.locationPointer[siteRef] || {}
                                    STATE.REF.locationPointer[siteRef].pointerPos = pointerPos
                                }
                                pointerObj.set({layer: "map"})
                                D.Alert(`Map Position for site "${siteName || siteRef}" set to: ${D.JSL(pointerPos)}`, "!sess set pointer")
                                ISSETTINGPOINTER = false
                                setSceneFocus()
                            } else {
                                pointerObj.set({layer: "objects"})
                                ISSETTINGPOINTER = true
                                D.Alert(`Setting pointer position for <b>"${siteName || siteRef}"</b><br><br>Move the map indicator to the desired position, then type "!sess set pointer" again.`, "!sess set pointer")
                            }
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
                        case "customsitedist": {
                            const [siteRef, siteName] = getActiveSite(true),
                                customLocRef = siteName in STATE.REF.customLocs && STATE.REF.customLocs[siteName] ||
                                               siteRef in STATE.REF.customLocs && STATE.REF.customLocs[siteRef] ||
                                               false
                            if (customLocRef) 
                                if (args.length) {
                                    if (args.join(" ") in C.DISTRICTS)
                                        customLocRef.district = args.join(" ")
                                    else
                                        D.Alert(`No such district: ${D.JS(args.join(" "))}`, "!sess set customsitedist")
                                } else {
                                    delete customLocRef.district
                                }
                            else 
                                D.Alert(`No custom site registered for ${siteName || siteRef}`, "!sess set customsitedist")                            
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
                        case "favsite": {
                            STATE.REF.FavoriteSites = _.without(STATE.REF.FavoriteSites, args.join(" "))
                            break
                        }
                        case "favdist": {
                            STATE.REF.FavoriteDistricts = _.without(STATE.REF.FavoriteDistricts, args.join(" "))
                            break
                        }
                        case "customsite": {
                            delete STATE.REF.customLocs[args.join(" ")]
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
                            _pageid: D.MAINPAGEID,
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
                                    D.Alert(D.JS(getActivePositions(args[0])), `Testing getActiveLocations(${args[0] || ""})`)
                                    break
                                }
                                case "activescenelocs": {
                                    D.Alert(D.JS(getActivePositions()), "Testing getActiveSceneLocations()")
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
                case "reset": {
                    switch(D.LCase(call = args.shift())) {
                        case "loc": case "location": {
                            STATE.REF.curLocation = D.Clone(BLANKLOCRECORD)
                            break
                        }
                        // no default
                    }
                    break
                }
            // no default
            }
        }
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************
    
    // #region Configuration
    let ISSETTINGPOINTER = false
    const MODEFUNCTIONS = {            
            outroMode: {
                Active: () => {},
                Inactive: () => {},
                Downtime: () => {
                    D.Chat("all", C.HTML.Block([
                        C.HTML.Title("Leaving Session Downtime"),
                        C.HTML.Header("Loading Status: Regular Time"),
                        C.HTML.Body("Starting Clock.")
                    ]))
                },
                Daylighter: () => {},
                Spotlight: () => {
                    D.Chat("all", C.HTML.Block([
                        C.HTML.Title("Spotlight"),
                        C.HTML.Header("Closing Spotlight Session.")
                    ]))
                    STATE.REF.spotlightChar = null
                },
                Complications: () => { },
                Testing: () => {}
            },            
            leaveMode: {
                Active: () => {},
                Inactive: () => {
                    if (!STATE.REF.isTestingActive)      
                        Campaign().set({playerpageid: D.GetPageID("GAME")})            
                    TimeTracker.ToggleClock(true)
                    // TimeTracker.ToggleCountdown(false)
                },
                Downtime: () => {},
                Daylighter: () => {},
                Spotlight: () => {
                    for (const charData of D.GetChars("registered").map(x => D.GetCharData(x))) {
                        // Char.SetNPC(charData.id, "base")
                        Media.ToggleToken(charData.id, true) // Char.TogglePC(charData.quadrant, true)
                        Media.ToggleText(`${charData.name}Desire`, true)
                        Char.SetNPC(charData.id, "base")
                    }
                    Media.ToggleImg("Spotlight", false)                    
                },
                Complications: () => {},
                Testing: () => {
                    STATE.REF.isTestingActive = false
                    Media.ToggleText("testSessionNotice", false)
                    Media.ToggleText("testSessionNoticeSplash", false)
                }
            },
            enterMode: {
                Active: () => {                            
                    Char.RefreshDisplays()
                    if (!STATE.REF.isTestingActive)
                        TimeTracker.ToggleClock(true)
                },
                Inactive: () => {
                    Campaign().set({playerpageid: D.GetPageID("SplashPage")})
                    Media.ToggleTokens(null, false)
                    TimeTracker.ToggleClock(false)
                    TimeTracker.ToggleCountdown(true)
                },
                Downtime: () => {                    
                    setLocation(BLANKLOCRECORD)
                    TimeTracker.ToggleClock(false)
                    Char.SendHome()
                },
                Daylighter: () => {},
                Spotlight: () => {
                    setLocation(BLANKLOCRECORD)
                    TimeTracker.ToggleClock(false)                       
                    Char.RefreshDisplays()
                },
                Complications: () => {
                    Media.ToggleTokens(null, false)
                    TimeTracker.ToggleClock(false)
                },
                Testing: () => {
                    STATE.REF.isTestingActive = true
                    Media.ToggleText("testSessionNotice", true)
                    Media.ToggleText("testSessionNoticeSplash", true)
                }
            },
            introMode: {
                Active: () => {
                    Media.ToggleTokens("registered", true)
                    Media.ToggleTokens("disabled", false)
                },
                Inactive: () => {
                },
                Downtime: () => {
                    if (STATE.REF.LastMode !== "Complications")
                        D.Chat("all", C.HTML.Block([
                            C.HTML.Title("Session Downtime"),
                            C.HTML.Header("Session Status: Downtime"),
                            C.HTML.Body("Clock Stopped.")
                        ]), null, D.RandomString(3))
                },
                Daylighter: () => {},
                Spotlight: (charRef, messageText) => {
                    setSpotlightChar(charRef, messageText)
                },
                Complications: () => {},
                Testing: () => {}
            },
        },
        MODEDATA = {
            Active: {},
            Inactive: {},
            Downtime: {},
            Daylighter: {},
            Spotlight: {},
            Complications: {
                isIgnoringSounds: true
            },
            Testing: {}
        },
        BLANKLOCRECORD = {
            DistrictCenter: ["blank"],
            DistrictLeft: ["blank"],
            DistrictRight: ["blank"],
            SiteCenter: ["blank"],
            SiteLeft: ["blank"],
            SiteRight: ["blank"],
            subLocs: {
                TopLeft: "blank",
                Left: "blank",
                BotLeft: "blank",
                TopRight: "blank",
                Right: "blank",
                BotRight: "blank"
            }
        },
        verifyStateIntegrity = () => { // A series of simple validations of registry data.
            const [siteNames, /* distNames, */ posNames, /* subPosNames */] = [
                Object.keys(C.SITES),
                /* Object.keys(C.DISTRICTS), */
                ["DistrictCenter", "DistrictRight", "DistrictLeft", "SiteCenter", "SiteRight", "SiteLeft", "subLocs"],
                /* ["TopLeft", "Left", "BotLeft", "TopRight", "Right", "BotRight"] */
            ]
            STATE.REF.FavoriteSites = _.reject(STATE.REF.FavoriteSites, x => !siteNames.includes(x))

            for (const [modeName] of Object.entries(STATE.REF.locationRecord))
                STATE.REF.locationRecord[modeName] = _.omit(STATE.REF.locationRecord[modeName], (v, k) => !posNames.includes(k))            
            
            STATE.REF.curLocation = _.omit(STATE.REF.curLocation, (v, k) => !posNames.includes(k))
        },
    // #endregion

    // #region Getting & Setting Session Data
        isSessionActive = () => STATE.REF.Mode !== "Inactive",
        setSessionNum = sNum => {
            sNum = sNum || ++STATE.REF.SessionNum
            STATE.REF.SessionNum = sNum
            Media.SetText("NextSession", D.Romanize(STATE.REF.SessionNum, false).split("").join("   "))     
            D.Flag(`Session Set to ${D.UCase(D.NumToText(STATE.REF.SessionNum))}`)
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
            D.Chat()
            changeMode("Active", true, [
                [D.Chat, ["all", C.HTML.Block([
                    C.HTML.Title("VAMPIRE: TORONTO by NIGHT", {fontSize: "28px"}),
                    C.HTML.Body("Initializing Session...", {margin: "0px 0px 10px 0px"}),
                    C.HTML.Header(`Welcome to Session ${D.NumToText(STATE.REF.SessionNum, true)}!`),
                    C.HTML.Body("Clock Running.<br>Animations Online.<br>Roller Ready.", {margin: "10px 0px 10px 0px"}),
                    C.HTML.Header(`Session Scribe: ${sessionScribe || "(None Set)"}`),
                    C.HTML.Body("(Click <a style = \"color: white; font-weight: normal; background-color: rgba(255,0,0,0.5);\" href=\"https://docs.google.com/document/d/1GsGGDdYTVeHVHgGe9zrztEIN4Qmtpb2xZA8I-_WBnDM/edit?usp=sharing\" target=\"_blank\">&nbsp;here&nbsp;</a> to open the template in a new tab,<br>then create a copy to use for this session.)", {fontSize: "14px", lineHeight: "14px"}),
                    C.HTML.Body("Thank you for your service!")
                ])]]
            ])
            // Media.ToggleImg("MapIndicator_Base_1", true)
            // Media.ToggleAnim("MapIndicator", true)


        },
        endSession = () => {
            if (STATE.REF.isTestingActive || sessionMonologue() && remorseCheck()) {
                // Char.SendHome()
                changeMode("Inactive", true, [
                    [D.Chat, ["all", C.HTML.Block([
                        C.HTML.Title("VAMPIRE: TORONTO by NIGHT", {fontSize: "28px"}),
                        C.HTML.Header(`Concluding Session ${D.NumToText(STATE.REF.SessionNum, true)}`),
                        C.HTML.Body("Clock Stopped.<br>Animations Offline.<br>Session Experience Awarded.", {margin: "10px 0px 10px 0px"}),
                        C.HTML.Title("See you next week!", {fontSize: "32px"}),
                    ])]]
                ])
                if (!STATE.REF.isTestingActive) {
                    STATE.REF.dateRecord = null
                    for (const char of D.GetChars("registered"))
                        Char.AwardXP(char, 2, "Session XP award.")
                    STATE.REF.SessionNum++
                } else if (STATE.REF.dateRecord) {
                    TimeTracker.CurrentDate = STATE.REF.dateRecord
                }
                Media.SetText("NextSession", D.Romanize(STATE.REF.SessionNum, false).split("").join("   "))       
            }
        },
        sessionMonologue = () => {
            if (STATE.REF.Mode === "Spotlight" && STATE.REF.spotlightChar && D.GetStatVal(STATE.REF.spotlightChar, "stains")) {
                D.Call(`!roll quick remorse ${STATE.REF.spotlightChar}`)
                return false
            } else if (STATE.REF.SessionMonologues.length) {
                const thisCharName = STATE.REF.SessionMonologues.pop()
                setSpotlightChar(thisCharName, C.HTML.Block([
                    C.HTML.Title("VAMPIRE: TORONTO by NIGHT", {fontSize: "28px"}),
                    C.HTML.Title("Session Monologues", {fontSize: "28px", margin: "-10px 0px 0px 0px"}),
                    C.HTML.Header(thisCharName),
                    C.HTML.Body("The spotlight is yours!")
                ]))
                return false
            }
            return true
        },
        logTokens = (mode) => {
            const tokenObjs = findObjs({
                _pageid: D.MAINPAGEID,
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
        changeMode = (mode, args, endFuncs = []) => {
            if (D.Capitalize(D.LCase(mode)) === Session.Mode)
                return null
            if (VAL({string: mode}, "changeMode") && STATE.REF.SessionModes.map(x => x.toLowerCase()).includes(mode.toLowerCase())) {
                const [lastMode, curMode] = [
                    `${STATE.REF.Mode}`,
                    D.Capitalize(mode.toLowerCase())
                ]             
                D.Queue(MODEFUNCTIONS.outroMode[lastMode], [args], "ModeSwitch", 0.1)
                D.Queue(Media.ToggleLoadingScreen, [curMode === "Inactive" && "concluding" || "loading", `Changing Modes: ${D.UCase(lastMode)} ► ${D.UCase(curMode)}`, {duration: 15, numTicks: 30, callback: () => { MODEFUNCTIONS.introMode[curMode](args)}}], "ModeSwitch", 3)
                D.Queue(Media.SetLoadingMessage, ["Logging Game State..."], "ModeSwitch", 0.1)
                D.Queue(logTokens, [lastMode], "ModeSwitch", 0.1)
                D.Queue(MODEFUNCTIONS.leaveMode[lastMode], [args], "ModeSwitch", 1)
                D.Queue(() => { STATE.REF.Mode = curMode; STATE.REF.LastMode = lastMode }, [], "ModeSwitch", 0.1)
                D.Queue(Media.SetLoadingMessage, [`Clearing ${D.UCase(lastMode)} Assets...`], "ModeSwitch", 0.1)
                D.Queue(Roller.Clean, [], "ModeSwitch", 1)
                D.Queue(Media.ModeUpdate, [], "ModeSwitch", 2)
                D.Queue(setModeLocations, [curMode], "ModeSwitch", 1)
                if (!(MODEDATA[curMode].isIgnoringSounds || MODEDATA[lastMode].isIgnoringSounds))
                    D.Queue(Media.UpdateSoundscape, [], "ModeSwitch", 1)
                D.Queue(Media.SetLoadingMessage, [`Deploying ${D.UCase(curMode)} Assets ...`], "ModeSwitch", 0.1)
                D.Queue(MODEFUNCTIONS.enterMode[curMode], [args], "ModeSwitch", 1)
                D.Queue(restoreTokens, [curMode], "ModeSwitch", 0.1)
                D.Queue(TimeTracker.Fix, [], "ModeSwitch", 0.1)
                D.Queue(Media.SetLoadingMessage, ["Cleaning Up ..."], "ModeSwitch", 1)
                // D.Queue(Media.ToggleLoadingScreen, [false], "ModeSwitch", 0.1)
                D.Queue(MODEFUNCTIONS.introMode[curMode], [args], "ModeSwitch", 0.1)
                for (const endFunc of endFuncs)
                    D.Queue(endFunc[0], endFunc[1], "ModeSwitch", endFunc[2] || 0.1)
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
        toggleSpotlight = (charRef, messageText) => {
            if (STATE.REF.Mode === "Spotlight") 
                if (!charRef)
                    changeMode(STATE.REF.LastMode)
                else
                    setSpotlightChar(charRef, messageText)
            else             
                changeMode("Spotlight", [charRef, messageText])
            
        },
        setSpotlightChar = (charRef, messageText) => {
            if (STATE.REF.Mode !== "Spotlight") {
                changeMode("Spotlight", [charRef, messageText])
            } else {
                const charObj = D.GetChar(charRef)
                if (VAL({pc: charObj}) && STATE.REF.spotlightChar !== charObj.id) {
                    Char.SendHome()
                    STATE.REF.spotlightChar = charObj.id
                    const charData = D.GetCharData(charObj),
                        quad = charData.quadrant,
                        otherCharData = D.GetChars("registered").filter(x => x.id !== charData.id).map(x => D.GetCharData(x))                
                    for (const otherData of otherCharData) {
                        Media.ToggleToken(otherData.id, false) // Char.TogglePC(otherData.quadrant, false)
                        Char.SetNPC(otherData.id, "base")
                        Media.ToggleText(`${otherData.shortName}Desire`, false)
                    }
                    
                    Media.ToggleToken(charData.id, true) // Char.TogglePC(quad, true)
                    Media.ToggleText(`${charData.shortName}Desire`, true)
                    Char.SetNPC(charData.id, "base")
                    Media.SetImg("Spotlight", quad)
                    Media.ToggleImg("Spotlight", true)
                    D.Chat("all", messageText || C.HTML.Block([
                        C.HTML.Title("Spotlight:"),
                        C.HTML.Header(charData.name)
                    ]))
                }  
            }          
        },
    // #endregion

    // #region Location Handling
        BLANKPENDINGLOCCOMMAND = {
            workingIndex: 0,
            Districts: [],
            Sites: []
        },
        isLocCentered = () => {
            const activeLocs = Object.keys(STATE.REF.curLocation).filter(x => x !== "subLocs" && STATE.REF.curLocation[x][0] !== "blank")
            if (activeLocs.includes("DistrictCenter") && !activeLocs.includes("SiteLeft") && !activeLocs.includes("SiteRight"))
                return true
            if (activeLocs.includes("DistrictLeft") || activeLocs.includes("DistrictRight") || activeLocs.includes("SiteLeft") || activeLocs.includes("SiteRight"))
                return false
            return null
        },
        getAllLocations = (isIncludingSubLocs = true) => D.KeyMapObj(_.omit(D.Clone(STATE.REF.curLocation), (v, k) => k === "subLocs" && (!isIncludingSubLocs || _.all(_.values(v), x => x === "blank")) || v[0] === "blank"), undefined, (v, k) => k === "subLocs" && _.reject(v, "blank") || _.flatten([v]).shift()),
        getActiveLocations = (focusOverride, isIncludingSubLocs = true) => {
            const activeLocs = getAllLocations(isIncludingSubLocs)
            focusOverride = focusOverride || STATE.REF.sceneFocus
            if (VAL({string: focusOverride}))
                switch({c: "Center", l: "Left", r: "Right", a: "All"}[focusOverride.toLowerCase().charAt(0)]) {
                    case "Center": {
                        if (Object.keys(activeLocs).some(x => x.endsWith("Center")))
                            return _.omit(activeLocs, (v, k) => !k.endsWith("Center"))
                    }
                    // falls through
                    case "Left":
                        return _.omit(activeLocs, (v, k) => k.endsWith("Right"))                 
                    case "Right":
                        return _.omit(activeLocs, (v, k) => k.endsWith("Left"))
                    default:
                        return activeLocs
                }
            return {}
        },
        getActivePositions = (focusOverride) => Object.keys(getActiveLocations(focusOverride, false)),
        getActiveDistrict = () => {
            const [activePos] = getActivePositions().filter(x => x.includes("District"))
            return activePos && STATE.REF.curLocation[activePos] && STATE.REF.curLocation[activePos][0] || false
        },
        getActiveSite = (isReturningSiteName = false) => {
            const [activePos] = getActivePositions().filter(x => x.startsWith("Site"))
            return activePos && STATE.REF.curLocation[activePos] && (isReturningSiteName && STATE.REF.curLocation[activePos] || STATE.REF.curLocation[activePos][0]) || false
        },
        getPosOfLocation = (locRef) => _.findKey(getAllLocations(false), v => v && locRef && D.LCase(v) === D.LCase(locRef)),
        getSubLocs = () => {


        },
        isOutside = () => {
            const sceneLocs = _.compact(getActivePositions().map(x => STATE.REF.curLocation[x][0]))
            // D.Poke(D.JS(sceneLocs))
            return sceneLocs.filter(x => !C.LOCATIONS[x].outside).length === 0
        },
        setDistrictImg = (locRef, distRef) => {
            const locKey = D.LCase(locRef).charAt(0),
                locPos = {c: "DistrictCenter", l: "DistrictLeft", r: "DistrictRight"}[locKey]
            DB({locRef, distRef, locKey, locPos}, "setDistrictImg")
            if (!distRef || distRef === "blank") {
                Media.ToggleImg(locPos, false)
            } else {
                Media.ToggleImg(locPos, true)
                Media.SetImg(locPos, distRef)
            }
        },
        setSiteImg = (locRef, siteRef, siteName) => {
            const locKey = D.LCase(locRef).charAt(0),
                locPos = {c: "SiteCenter", l: "SiteLeft", r: "SiteRight"}[locKey]
            DB({locRef, siteRef, siteName, locKey, locPos}, "setSiteImg")
            if (!siteRef || siteRef === "blank") {
                Media.ToggleImg(locPos, false)
                Media.ToggleImg(`SiteBar${locPos.replace(/Site/gu, "")}`, false)
                Media.ToggleText(`SiteName${locPos.replace(/Site/gu, "")}`, false)
            } else {
                Media.ToggleImg(locPos, true)
                Media.SetImg(locPos, siteRef)
                setSiteName(locKey, siteRef, siteName)
            }
        },
        setSiteName = (locRef, siteRef, siteName) => {
            siteName = siteName === "same" && siteRef in STATE.REF.locationDetails ? STATE.REF.locationDetails[siteRef].siteName : siteName
            const locKey = D.LCase(locRef).charAt(0),
                locPos = {c: "Center", l: "Left", r: "Right"}[locKey]
            DB({locRef, siteRef, siteName, locKey, locPos}, "setSiteName")
            if (VAL({string: siteName})) {
                Media.ToggleImg(`SiteBar${locPos}`, true)
                Media.ToggleText(`SiteName${locPos}`, true)
                Media.SetText(`SiteName${locPos}`, siteName)
            } else {
                Media.ToggleImg(`SiteBar${locPos}`, false)
                Media.ToggleText(`SiteName${locPos}`, false)
            }
        },
        setSubLocImg = (locRef, subLocRef) => {
            if (locRef in BLANKLOCRECORD.subLocs)
                if (!subLocRef || subLocRef === "blank") {
                    Media.ToggleImg(`SubLoc${locRef}`, false)
                } else {
                    Media.ToggleImg(`SubLoc${locRef}`, true)
                    Media.SetImg(`SubLoc${locRef}`, subLocRef)
                }
        },
        setLocation = (locParams, sceneFocus, isForcing = false) => {
            const newLocData = Object.assign({}, _.omit(BLANKLOCRECORD, "subLocs"), locParams, _.omit(STATE.REF.curLocation, (v,k) => ["subLocs", "pointerPos", ...Object.keys(locParams)].includes(k))),
                curLocData = Object.assign({}, BLANKLOCRECORD, STATE.REF.curLocation),
                reportStrings = [
                    `Loc Params: ${D.JS(locParams)}`,
                    `New Loc Data: ${D.JS(newLocData)}`,
                    `Cur Loc Data: ${D.JS(curLocData)}`
                ]
            // FIRST: Convert curLocData to what is actually shown in the sandbox --- i.e. if Left & Right districts are the same, it's actually DistrictCenter that is displayed.
            if (curLocData.DistrictLeft[0] !== "blank" && curLocData.DistrictLeft[0] === curLocData.DistrictRight[0]) {
                curLocData.DistrictCenter = [...curLocData.DistrictLeft]
                curLocData.DistrictLeft = ["blank"]
                curLocData.DistrictRight = ["blank"]
            }

            // SECOND: Set sides OR center to blank, depending on which district(s) are being set. 
            if ("DistrictCenter" in locParams && !locParams.DistrictCenter.includes("blank")) {
                newLocData.DistrictLeft = ["blank"]
                newLocData.DistrictRight = ["blank"]
                newLocData.SiteLeft = ["blank"]
                newLocData.SiteRight = ["blank"]
            } else if ("DistrictLeft" in locParams && !locParams.DistrictLeft.includes("blank") || "DistrictRight" in locParams && !locParams.DistrictRight.includes("blank")) {
                newLocData.DistrictCenter = ["blank"]
                newLocData.SiteCenter = ["blank"]                
            }

            // THIRD: If SiteCenter is blank, then blank all of the sub-locations.
            if (newLocData.SiteCenter[0] === "blank")
                newLocData.subLocs = _.clone(BLANKLOCRECORD.subLocs)

            // FOURTH: Check site settings against custom locations to fill in any blanks, then set any necessary data in custom locations.
            reportStrings.push(`Filtered Site List: ${D.JS(_.omit(newLocData, (v, k) => k === "subLocs" || k.includes("District") || v && v[0] === "blank"))}`)
            for (const [sitePos, siteData] of Object.entries(_.omit(newLocData, (v, k) => k === "subLocs" || k.includes("District") || v && v[0] === "blank"))) { // Only interested in non-blank sites; We'll deal with sub-locations afterwards.
                const [siteRef, siteName] = siteData,
                    customLocRef = siteName in STATE.REF.customLocs && STATE.REF.customLocs[siteName] ||
                                   siteRef in STATE.REF.customLocs && STATE.REF.customLocs[siteRef] ||
                                   false
                if (sitePos === "SiteCenter")
                    newLocData.subLocs = Object.assign({}, BLANKLOCRECORD.subLocs, customLocRef && customLocRef.subLocs || {}, newLocData.subLocs || {})
                else
                    newLocData.subLocs = Object.assign({}, BLANKLOCRECORD.subLocs)
                reportStrings.push(`... SitePos: ${sitePos}, SiteData: ${D.JS(siteData)}, SubLocs: ${D.JS(newLocData.subLocs)}`)

                if (siteName) {
                    STATE.REF.customLocs[siteName] = STATE.REF.customLocs[siteName] || {}
                    STATE.REF.customLocs[siteName].district = STATE.REF.customLocs[siteName].district || newLocData[sitePos.replace(/Site/gu, "District")][0]
                    STATE.REF.customLocs[siteName].site = siteRef
                    STATE.REF.customLocs[siteName].siteName = siteName
                }
                if (sitePos === "SiteCenter" && Object.values(newLocData.subLocs || {}).some(x => x !== "blank"))
                    if (customLocRef)
                        customLocRef.subLocs = D.Clone(newLocData.subLocs)
                    else if (siteName)
                        STATE.REF.customLocs[siteName].subLocs = D.Clone(newLocData.subLocs)
                    else
                        STATE.REF.customLocs[siteRef] = {
                            district: newLocData[sitePos.replace(/Site/gu, "District")],
                            site: siteRef,
                            subLocs: D.Clone(newLocData.subLocs)
                        }            
            }
            
            // FINALLY: Set the current location in STATE to the new location record, and record it in the location record for the active Mode.
            STATE.REF.curLocation = D.Clone(newLocData)
            STATE.REF.locationRecord[Session.Mode] = D.Clone(newLocData)

            // NOW MOVING ON TO SIMPLY DISPLAYING THE CORRECT CARDS:
            
            // FIRST, if left & right districts are equal, display that district in the center frame:
            if (newLocData.DistrictLeft[0] !== "blank" && _.isEqual(newLocData.DistrictLeft, newLocData.DistrictRight)) {
                newLocData.DistrictCenter = [..._.flatten([newLocData.DistrictLeft])]
                newLocData.DistrictLeft = ["blank"]
                newLocData.DistrictRight = ["blank"]
            }

            // SECOND, extract only the changing cards to be displayed:
            const locDataDelta = _.pick(newLocData, Object.keys(newLocData).filter(x => x !== "subLocs" && (isForcing || !_.isEqual(newLocData[x], curLocData[x]))))
            for (const [subLocPos, subLocName] of Object.entries(newLocData.subLocs || {}))
                if (isForcing || !curLocData.subLocs || curLocData.subLocs[subLocPos] !== subLocName)
                    locDataDelta[`SubLoc${subLocPos}`] = subLocName
            reportStrings.push(`Loc Data Delta: ${D.JS(locDataDelta)}`)
            reportStrings.push(`New STATE.REF Record: ${D.JS(STATE.REF.locationRecord[Session.Mode])}`)
            DB(`<h3>Set Location Processing:</h3>${D.JS(reportStrings.join("<br>"))}`, "setLocation")
            for (const [locPos, locData] of Object.entries(locDataDelta)) {
                const locSrc = VAL({string: locData}) ? locData : locData[0]
                if (locPos.includes("Site"))
                    setSiteImg(locPos.replace(/Site/gu, ""), locSrc, locData[1] || false)
                else if (locPos.includes("District"))
                    setDistrictImg(locPos.replace(/District/gu, ""), locSrc)
                else if (locPos.includes("SubLoc"))
                    setSubLocImg(locPos.replace(/SubLoc/gu, ""), locSrc)
            }
            // cleanLocationRegistry()
            setSceneFocus(STATE.REF.sceneFocus)
        },
        distCommandMenu = () => {
            DB({["Into District PENDINGLOCCOMMAND:"]: PENDINGLOCCOMMAND}, "distCommandMenu")
            PENDINGLOCCOMMAND.workingIndex = PENDINGLOCCOMMAND.Districts.length
            const genericButtons = ["blank", "same", "reset"],
                favDistricts = STATE.REF.FavoriteDistricts,
                distNames = Object.keys(C.DISTRICTS)
            D.CommandMenu(
                {  
                    title: PENDINGLOCCOMMAND.workingIndex === 1 && "District RIGHT" || "District",
                    rows: [
                        ..._.chain(genericButtons).
                            map(x => ({name: x, command: `!reply ${x}`})).
                            groupBy((x, i) => Math.floor(i / 3)).
                            map(x => ({type: "ButtonLine", contents: x, buttonStyles: {width: "30%", fontSize: "12px", bgColor: C.COLORS.midgold, buttonTransform: "none"}})).
                            value(),
                        ..._.chain(favDistricts).
                            map(x => ({name: x, command: `!reply ${x}`})).
                            groupBy((x, i) => Math.floor(i / 3)).
                            map(x => ({type: "ButtonLine", contents: x, buttonStyles: {width: "30%", fontSize: "12px", bgColor: C.COLORS.purple, buttonTransform: "none"}})).
                            value(),
                        ..._.chain(distNames).
                            map(x => ({name: x, command: `!reply ${x}`})).
                            groupBy((x, i) => Math.floor(i / 3)).
                            map(x => ({type: "ButtonLine", contents: x, buttonStyles: {width: "30%", fontSize: "12px", bgColor: C.COLORS.darkgreen, buttonTransform: "none"}})).
                            value()
                    ]
                },
                (commandString) => {
                    const cmdIndex = PENDINGLOCCOMMAND.workingIndex
                    switch (commandString) {
                        case "reset": {
                            PENDINGLOCCOMMAND = D.Clone(BLANKPENDINGLOCCOMMAND)
                            Media.Notify("panel", "● Resetting pending location data.")
                            distCommandMenu()
                            break
                        }
                        case "same": {
                            commandString = getActiveDistrict()
                            Media.Notify("panel", `● Setting District${cmdIndex === 1 ? " RIGHT" : " (First)"} to Active District: "${getActiveDistrict()}"`)
                        }
                        // falls through
                        default: {
                            PENDINGLOCCOMMAND.Districts[cmdIndex] = [commandString]
                            Media.Notify("panel", `● District${cmdIndex === 1 ? " RIGHT" : " (First)"} set: "${D.UCase(commandString)}"`)
                            siteCommandMenu()
                            break
                        }
                    }
                }
            )
        },
        siteCommandMenu = () => {
            DB({["Into Site PENDINGLOCCOMMAND"]: PENDINGLOCCOMMAND}, "siteCommandMenu")
            const [distName] = PENDINGLOCCOMMAND.Districts[PENDINGLOCCOMMAND.workingIndex],
                genericSites = ["blank", "same"],
                favSites = STATE.REF.FavoriteSites.filter(x => (C.SITES[x] || STATE.REF.customLocs[x]).district === null || (C.SITES[x] || STATE.REF.customLocs[x]).district.includes(distName)),
                distSites = Object.keys(C.SITES).filter(x => C.SITES[x].district && C.SITES[x].district.includes(distName)),
                anySites = Object.keys(C.SITES).filter(x => C.SITES[x].district === null),
                namedSites = Object.keys(STATE.REF.customLocs).filter(x => !STATE.REF.customLocs[x].district || STATE.REF.customLocs[x].district === distName)
            D.CommandMenu(
                {
                    title: PENDINGLOCCOMMAND.workingIndex === 1 && `Site RIGHT (${distName})` || `Site (${distName})`,
                    rows: _.compact([
                        ..._.chain(genericSites).
                            map(x => ({name: x, command: `!reply site@${x}`})).
                            groupBy((x, i) => Math.floor(i / 3)).
                            map(x => ({type: "ButtonLine", contents: x, buttonStyles: {width: "30%", fontSize: "12px", bgColor: C.COLORS.midgold, buttonTransform: "none"}})).
                            value(),
                        ..._.chain(favSites).
                            map(x => ({name: x, command: `!reply site@${x}`})).
                            groupBy((x, i) => Math.floor(i / 3)).
                            map(x => ({type: "ButtonLine", contents: x, buttonStyles: {width: "30%", fontSize: "12px", bgColor: C.COLORS.purple, buttonTransform: "none"}})).
                            value(),
                        ..._.chain(namedSites).
                            map(x => ({name: x, command: `!reply site@${x}`})).
                            groupBy((x, i) => Math.floor(i / 2)).
                            map(x => ({type: "ButtonLine", contents: x, buttonStyles: {width: "45%", fontSize: "12px", color: C.COLORS.black, bgColor: C.COLORS.brightgold, buttonTransform: "none"}})).
                            value(),
                        ..._.chain(distSites).
                            map(x => ({name: x, command: `!reply site@${x}`})).
                            groupBy((x, i) => Math.floor(i / 3)).
                            map(x => ({type: "ButtonLine", contents: x, buttonStyles: {width: "30%", fontSize: "12px", color: C.COLORS.black, bgColor: C.COLORS.brightblue, buttonTransform: "none"}})).
                            value(),
                        ..._.chain(anySites).
                            map(x => ({name: x, command: `!reply site@${x}`})).
                            groupBy((x, i) => Math.floor(i / 3)).
                            map(x => ({type: "ButtonLine", contents: x, buttonStyles: {width: "30%", fontSize: "12px", bgColor: C.COLORS.blue, buttonTransform: "none"}})).
                            value(),
                        ..._.chain(PENDINGLOCCOMMAND.workingIndex === 1 ? {
                            ["<<< Left"]: ["!reply focus@left", {width: "30%", bgColor: STATE.REF.sceneFocus === "l" && C.COLORS.gold || C.COLORS.grey}],
                            [">> Both <<"]: ["!reply focus@center", {width: "30%", bgColor: STATE.REF.sceneFocus === "c" && C.COLORS.gold || C.COLORS.grey}],
                            ["Right >>>"]: ["!reply focus@right", {width: "30%", bgColor: STATE.REF.sceneFocus === "r" && C.COLORS.gold || C.COLORS.grey}]
                        } : {
                            ["<<< subLocs"]: ["!reply call@sublocs", {}],
                            ["Loc #2 >>>"]: ["!reply call@district", {}]
                        }).
                            mapObject((v, k) => v ? {name: k, command: v[0], styles: v[1]} : 0).
                            values().
                            groupBy((x, i) => Math.floor(i / 3)).
                            map(x => ({type: "ButtonLine", contents: x, buttonStyles: {width: "40%", fontSize: "12px", bgColor: C.COLORS.palepurple, color: C.COLORS.black, fontWeight: "bold"}})).
                            value(),
                        ..._.chain({
                            ["RENAME"]: ["!reply name@?{Site Name}", {}],
                        }).
                            mapObject((v, k) => v ? {name: k, command: v[0], styles: v[1]} : 0).
                            values().
                            groupBy((x, i) => Math.floor(i / 3)).
                            map(x => ({type: "ButtonLine", contents: x, buttonStyles: {width: "60%", fontSize: "12px", bgColor: C.COLORS.brightbrightgrey, color: C.COLORS.black, fontWeight: "bold"}})).
                            value(),
                        ..._.chain({
                            ["FINISHED!"]: ["!reply done", {}],
                            ["RESET"]: ["!reply reset", {bgColor: C.COLORS.brightred, color: C.COLORS.white}]
                        }).
                            mapObject((v, k) => v ? {name: k, command: v[0], styles: v[1]} : 0).
                            values().
                            groupBy((x, i) => Math.floor(i / 3)).
                            map(x => ({type: "ButtonLine", contents: x, buttonStyles: {width: "47%", buttonHeight: "18px", fontSize: "14px", fontWeight: "bold", color: C.COLORS.black, bgColor: C.COLORS.puregreen}})).
                            value()
                    ])
                },
                (commandString) => {
                    const params = D.ParseToObj(commandString, "|", "@"),
                        cmdIndex = PENDINGLOCCOMMAND.workingIndex
                    for (const [command, value] of Object.entries(params))
                        switch (command) {
                            case "reset": {
                                PENDINGLOCCOMMAND = D.Clone(BLANKPENDINGLOCCOMMAND)
                                Media.Notify("panel", "● Resetting pending location data.")
                                distCommandMenu()
                                return false
                            }
                            case "done": {
                                processPendingLocCommand()  
                                Media.Notify("panel", "● FINISHED! Setting Location Cards...")
                                return false
                            }
                            case "name": {
                                if (VAL({array: PENDINGLOCCOMMAND.Sites[cmdIndex]})) {
                                    PENDINGLOCCOMMAND.Sites[cmdIndex][1] = value
                                    Media.Notify("panel", `● Site${cmdIndex === 1 ? " RIGHT" : " (First)"} Renamed to: "${value}"`)
                                } else {
                                    Media.Notify("panel", "● Choose a Site before renaming!")
                                }
                                break
                            }
                            case "focus": {
                                STATE.REF.sceneFocus = D.LCase(value.charAt(0))
                                Media.Notify("panel", `● Scene Focus switched to: ${D.Capitalize(value)}`)
                                break
                            }
                            case "site": {
                                switch (value) {
                                    case "blank": {
                                        PENDINGLOCCOMMAND.Sites[cmdIndex] = ["blank"]
                                        Media.Notify("panel", `● Blanking Site${cmdIndex === 1 ? " RIGHT" : " (First)"}.`)
                                        break
                                    }
                                    case "same": {                                    
                                        params.site = getActiveSite(true)
                                        Media.Notify("panel", `● Setting Site${cmdIndex === 1 ? " RIGHT" : " (First)"} to Active Site: "${params.site[1] || params.site[0]}"`)
                                    }
                                    // falls through
                                    default: {
                                        DB({params, isString: VAL({string: params.site}),
                                            ["Test One"]: !(params.site in C.SITES) && params.site in STATE.REF.customLocs,
                                            ["Test Two"]: params.site in STATE.REF.customLocs && STATE.REF.customLocs[params.site].siteName,
                                            ["Test Three"]: params.site in C.SITES
                                        }, "siteCommandMenu")
                                        if (VAL({string: params.site}))
                                            if (!(params.site in C.SITES) && params.site in STATE.REF.customLocs)
                                                params.site = [STATE.REF.customLocs[params.site].site, params.site]
                                            else if (params.site in STATE.REF.customLocs && STATE.REF.customLocs[params.site].siteName)
                                                params.site = [params.site, STATE.REF.customLocs[params.site].siteName]
                                            else
                                                params.site = [params.site]
                                        PENDINGLOCCOMMAND.Sites[cmdIndex] = params.site
                                        Media.Notify("panel", `● Site${cmdIndex === 1 ? " RIGHT" : " (First)"} set: "${D.UCase(params.site[1] || params.site[0])}"`)
                                        break
                                    }
                                }
                                break
                            }
                            case "call": {
                                switch (params.call) {
                                    case "district": distCommandMenu(); break
                                    case "site": siteCommandMenu(); break
                                    case "sublocs": subLocCommandMenu(); break
                                    // no default
                                }
                                return false
                            }
                            // no default
                        }
                    DB({[`PENDINGLOCCOMMAND After "!reply ${D.JSL(commandString)}":`]: PENDINGLOCCOMMAND}, "siteCommandMenu")
                    return C.REPLY.KEEPOPEN
                })
        },
        subLocCommandMenu = () => {
            const [siteName] = PENDINGLOCCOMMAND.Sites[PENDINGLOCCOMMAND.workingIndex],
                genericSubLocs = ["blank"],
                siteSubLocs = Object.keys(Media.IMAGES.SubLocTopLeft_1.srcs).filter(x => x.startsWith(siteName)).sort(),
                anySubLocs = Object.keys(Media.IMAGES.SubLocTopLeft_1.srcs).filter(x => !x.includes("_")).sort(),
                subLocPanels = {}
            for (const subLocRef of Object.keys(BLANKLOCRECORD.subLocs)) 
                subLocPanels[subLocRef] = {
                    rows: [
                        {type: "Header", contents: subLocRef},
                        ..._.compact([
                            ..._.chain(genericSubLocs).
                                map(x => ({name: x, command: `!reply ${subLocRef}@${x}`})).
                                groupBy((x, i) => Math.floor(i / 2)).
                                map(x => ({type: "ButtonLine", contents: x, buttonStyles: {width: "49%", fontSize: "10px", bgColor: C.COLORS.midgold, buttonTransform: "none"}})).
                                value(),
                            ..._.chain(siteSubLocs).
                                map(x => ({name: x.replace(/[^_]+_/gu, ""), command: `!reply ${subLocRef}@${x}`})).
                                groupBy((x, i) => Math.floor(i / 2)).
                                map(x => ({type: "ButtonLine", contents: x, buttonStyles: {width: "49%", fontSize: "10px", bgColor: C.COLORS.purple, buttonTransform: "none"}})).
                                value(),
                            ..._.chain(anySubLocs).
                                map(x => ({name: x, command: `!reply ${subLocRef}@${x}`})).
                                groupBy((x, i) => Math.floor(i / 2)).
                                map(x => ({type: "ButtonLine", contents: x, buttonStyles: {width: "49%", fontSize: "10px", color: C.COLORS.black, bgColor: C.COLORS.brightblue, buttonTransform: "none"}})).
                                value()
                        ])
                    ]}
            
            D.CommandMenu(
                {
                    title: `SubLocations for ${siteName || "?"}`,
                    rows: [
                        {type: "Column", contents: [
                            subLocPanels.TopLeft,
                            subLocPanels.TopRight
                        ], style: {width: "47%", margin: "0px 1% 0% 1%"}},
                        {type: "Column", contents: [
                            subLocPanels.Left,
                            subLocPanels.Right
                        ], style: {width: "47%", margin: "0px 1% 0% 1%"}},
                        {type: "Column", contents: [
                            subLocPanels.BotLeft,
                            subLocPanels.BotRight
                        ], style: {width: "47%", margin: "0px 1% 0% 1%"}},
                        ..._.chain({
                            ["FINISHED!"]: ["!reply done", {}],
                            ["RESET"]: ["!reply reset", {bgColor: C.COLORS.brightred, color: C.COLORS.white}]
                        }).
                            mapObject((v, k) => v ? {name: k, command: v[0], styles: v[1]} : 0).
                            values().
                            groupBy((x, i) => Math.floor(i / 3)).
                            map(x => ({type: "ButtonLine", contents: x, buttonStyles: {width: "47%", buttonHeight: "18px", fontSize: "14px", fontWeight: "bold", color: C.COLORS.black, bgColor: C.COLORS.puregreen}})).
                            value()
                    ]
                },
                (commandString) => {
                    const params = D.ParseToObj(commandString, "|", "@")  
                    DB({params}, "subLocCommandMenu")              
                    if (commandString.includes("reset")) {
                        PENDINGLOCCOMMAND = D.Clone(BLANKPENDINGLOCCOMMAND)
                        Media.Notify("panel", "● Resetting pending location data.")
                        distCommandMenu()
                        return false
                    }
                    PENDINGLOCCOMMAND.subLocs = PENDINGLOCCOMMAND.subLocs || {}
                    if ("done" in params) {
                        processPendingLocCommand()
                        Media.Notify("panel", "● FINISHED! Setting Location Cards...")   
                        return false
                    } else {
                        for (const [locRef, subLocRef] of Object.entries(params))
                            if (locRef in BLANKLOCRECORD.subLocs) {
                                PENDINGLOCCOMMAND.subLocs[locRef] = subLocRef                                
                                Media.Notify("panel", `● Sub-Location ${locRef} at ${PENDINGLOCCOMMAND.Sites[PENDINGLOCCOMMAND.workingIndex][0]} set: "${subLocRef}"`)
                            }
                        return C.REPLY.KEEPOPEN
                    }
                })  
        },
        processPendingLocCommand = () => {
            const locParams = {}
            switch (PENDINGLOCCOMMAND.workingIndex) {
                case 0: {
                    [locParams.DistrictCenter] = PENDINGLOCCOMMAND.Districts;
                    [locParams.SiteCenter] = PENDINGLOCCOMMAND.Sites
                    if ("subLocs" in PENDINGLOCCOMMAND)
                        locParams.subLocs = D.Clone(PENDINGLOCCOMMAND.subLocs)
                    break
                }
                case 1: {
                    [locParams.DistrictLeft, locParams.DistrictRight] = PENDINGLOCCOMMAND.Districts;
                    [locParams.SiteLeft, locParams.SiteRight] = PENDINGLOCCOMMAND.Sites
                    break
                }
                // no default
            }
            setLocation(locParams)
            PENDINGLOCCOMMAND = D.Clone(BLANKPENDINGLOCCOMMAND)    
        },
        sceneFocusCommandMenu = () => {
            D.CommandMenu(
                {
                    rows: _.compact([
                        {type: "Header", contents: `Current Focus: ${{c: "Center", l: "Left", r: "Right"}[STATE.REF.sceneFocus]}`},                    
                        ..._.chain({
                            ["<<< Left"]: ["!reply focus@left", {bgColor: STATE.REF.sceneFocus === "l" && C.COLORS.gold || C.COLORS.grey}],
                            [">> Both <<"]: ["!reply focus@center", {bgColor: STATE.REF.sceneFocus === "c" && C.COLORS.gold || C.COLORS.grey}],
                            ["Right >>>"]: ["!reply focus@right", {bgColor: STATE.REF.sceneFocus === "r" && C.COLORS.gold || C.COLORS.grey}]
                        }).
                            mapObject((v, k) => v ? {name: k, command: v[0], styles: v[1]} : 0).
                            values().
                            groupBy((x, i) => Math.floor(i / 3)).
                            map(x => ({type: "ButtonLine", contents: x, buttonStyles: {width: "30%", fontSize: "12px", bgColor: C.COLORS.palepurple, color: C.COLORS.black, fontWeight: "bold"}})).
                            value()
                    ])
                },
                (commandString) => {
                    const params = D.ParseToObj(commandString, "|", "@")
                    if ("focus" in params)
                        setSceneFocus(params.focus)
                })

        },
        setModeLocations = (mode, isForcing = false) => { setLocation(STATE.REF.locationRecord[mode], null, isForcing) },
        getCharsInLocation = (locPos) => {
            const charObjs = []
            for (const loc of getActivePositions(locPos))
                charObjs.push(...Media.GetContainedChars(loc, {padding: 50}))
            return _.uniq(charObjs)
        },
        isInScene = (charRef) => {
            const activeLocs = getActivePositions(),
                [charToken] = Media.GetTokens(charRef),
                dbObj = {activeLocs, charToken, checks: {}}
            for (const loc of activeLocs) {
                dbObj.checks[loc] = Media.IsInside(loc, charToken, 0)
                if (Media.IsInside(loc, charToken, 0)) {
                    dbObj.returning = true
                    DB(dbObj, "isInScene")
                    return true
                }
            }
            dbObj.returning = false
            DB(dbObj, "isInScene")
            return false
        },
        isInLocation = (charRef, locRef) => {
            const posRef = getPosOfLocation(locRef),
                [charToken] = Media.GetTokens(charRef)
            if (VAL({string: posRef, token: charToken})) {
                if (Media.IsInside(posRef, charToken, 0))
                    return true
                if (posRef.startsWith("Site"))
                    return Media.IsInside(posRef.replace(/Site/gu, "District"), charToken, 0)
            }
            return false
        },

        // subLocList = ["blank", ..._.uniq(Object.keys(Media.IMAGES.SubLocTopLeft_1.srcs)).map(x => `${`(${(x.match(/^[^_]*?([A-Z])[^_]*?([A-Z])[^_]*?_/u) || ["", ""]).slice(1).join("")}) `.replace("() ", "")}${x.replace(/.*?_/gu, "")}`)],
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
            const distList = ["same", "blank", ..._.uniq(Object.keys(Media.IMAGES.DistrictCenter_1.srcs)).sort()],
                siteList = ["same", "blank", ..._.uniq(Object.keys(Media.IMAGES.SiteCenter_1.srcs)).sort()],
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
    // #endregion

    // #region Waking Up 

    // #endregion

    // #region Automatic Remorse Rolls
        remorseCheck = () => promptRemorseCheck(D.GetChars("registered").filter(x => D.GetStatVal(x, "stains"))),
        promptRemorseCheck = (charObjs) => {
            if (!charObjs || !charObjs.length)
                return true
            const buttons = []
            for (const charObj of charObjs)
                buttons.push({name: D.GetName(charObj, true), command: `!roll quick remorse ${charObj.id}`})            
            D.CommandMenu({
                title: "Remorse Checks",
                rows: Object.values(_.groupBy(buttons, (v, i) => i % 2)).map(x => ({type: "ButtonLine", contents: x}))
            })
            return false
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
            locPos = isLocCentered() === true && "c" ||
                VAL({string: locPos}) && D.LCase(locPos).charAt(0) ||
                isLocCentered() === false && ["r", "l", "c"].includes(STATE.REF.sceneFocus) && STATE.REF.sceneFocus ||
                "c"
            STATE.REF.sceneFocus = locPos
            DB({locPos, ["state Scene Focus"]: STATE.REF.sceneFocus, activeLocs: getActivePositions()}, "setSceneFocus")
            const allLocations = getAllLocations(), 
                activePositions = getActivePositions(),
                inactivePositions = Object.keys(getAllLocations(false)).filter(x => !activePositions.includes(x)),
                tokenObjs = Media.GetTokens()
                
            if (activePositions.includes("DistrictCenter") || locPos === "c") {
                Media.ToggleImg("DisableLocLeft", false)
                Media.ToggleImg("DisableLocRight", false)
                Media.ToggleImg("DisableSiteLeft", false)
                Media.ToggleImg("DisableSiteRight", false)
                for (const tokenObj of tokenObjs) {
                    Media.ToggleToken(tokenObj, true)
                    if (tokenObj.get("layer") !== "objects")
                        tokenObj.set({layer: "objects"})
                }
            } else if (allLocations.DistrictLeft && allLocations.DistrictLeft === allLocations.DistrictRight) {
                Media.ToggleImg("DisableLocLeft", false)
                Media.ToggleImg("DisableLocRight", false)
                Media.ToggleImg("DisableSiteLeft", locPos === "r")
                Media.ToggleImg("DisableSiteRight", locPos === "l")
                for (const tokenObj of tokenObjs) {
                    Media.ToggleToken(tokenObj, true)
                    if (tokenObj.get("layer") !== "objects")
                        tokenObj.set({layer: "objects"})
                }
            } else {      
                Media.ToggleImg("DisableSiteLeft", false)
                Media.ToggleImg("DisableSiteRight", false)              
                Media.ToggleImg("DisableLocLeft", locPos === "r")
                Media.ToggleImg("DisableLocRight", locPos === "l")
                for (const tokenObj of _.compact(_.flatten(activePositions.map(x => Media.GetContents(x, {padding: 25}, {layer: "walls", _subtype: "token"})))))
                    Media.ToggleToken(tokenObj, true)
                for (const tokenObj of _.compact(_.flatten(inactivePositions.map(x => Media.GetContents(x, {padding: 25}, {layer: "objects", _subtype: "token"})))))
                    Media.ToggleToken(tokenObj, false)
            }
            const [sitePos] = activePositions.filter(x => x.startsWith("Site")),
                siteName = sitePos in STATE.REF.curLocation && STATE.REF.curLocation[sitePos][1],
                pointerPos = siteName && siteName in STATE.REF.customLocs && STATE.REF.customLocs[siteName].pointerPos ||
                             Session.Site in STATE.REF.customLocs && STATE.REF.customLocs[Session.Site].pointerPos ||
                             Session.Site in STATE.REF.locationPointer && STATE.REF.locationPointer[Session.Site].pointerPos ||
                             false                               
            if (VAL({list: pointerPos})) {
                Media.ToggleImg("MapIndicator_Base_1", true)
                Media.ToggleAnim("MapIndicator", true)
                Media.SetImgData("MapIndicator_Base_1", {left: pointerPos.left, top: pointerPos.top}, true)
                Media.GetImg("MapIndicator").set({left: pointerPos.left, top: pointerPos.top})
            } else {                
                Media.ToggleImg("MapIndicator_Base_1", false)
                Media.ToggleAnim("MapIndicator", false)
            }
            Media.UpdateSoundscape()
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
        Start: startSession, End: endSession,

        AddSceneChar: addCharToScene,
        ChangeMode: changeMode,
        CharsIn: getCharsInLocation,
        ResetLocations: setModeLocations,
        IsInScene: (charRef) => isInScene(charRef),
        IsInLocation: (charRef, locRef) => isInLocation(charRef, locRef),
        get SceneChars() { return getCharsInLocation(STATE.REF.sceneFocus) }, // ARRAY: [charObj, charObj, ...]
        get SceneFocus() { return STATE.REF.sceneFocus }, // STRING: "r", "l", "c"

        get Locations() { return getAllLocations() }, // LIST: { DistrictCenter: "YongeStreet", SiteCenter: "SiteLotus", SubLocs: {TopRight: "Laboratory", TopLeft: "Security"} }
        get ActiveLocations() { return getActiveLocations() },
        get ActivePositions() { return getActivePositions() },
        get InactiveLocations() { return _.omit(getAllLocations(false), (v, k) => getActivePositions().includes(k)) },

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