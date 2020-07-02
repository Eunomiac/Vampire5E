void MarkStart("Session");
const Session = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    let PENDINGLOCCOMMAND;
    const SCRIPTNAME = "Session";

    // #region COMMON INITIALIZATION
    const STATE = {
        get REF() {
            return C.RO.OT[SCRIPTNAME];
        }
    };
    const VAL = (varList, funcName, isArray = false) => D.Validate(varList, funcName, SCRIPTNAME, isArray);
    const DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME);
    const LOG = (msg, funcName) => D.Log(msg, funcName, SCRIPTNAME);
    const THROW = (msg, funcName, errObj) => D.ThrowError(msg, funcName, SCRIPTNAME, errObj);

    const checkInstall = () => {
        C.RO.OT[SCRIPTNAME] = C.RO.OT[SCRIPTNAME] || {};
        initialize();
    };
    // #endregion

    // #region LOCAL INITIALIZATION
    const initialize = () => {
        // delete STATE.REF.curLocation
        // delete STATE.REF.locationRecord
        // delete STATE.REF.sceneFocusRecord;
        // delete STATE.REF.tokenRecord
        // delete STATE.REF.SceneAlarms
        // STATE.REF.SceneAlarms = []
        // delete STATE.REF.SpotlightPrompts;
        // setMacro(D.GetChar("A"), "Review-Prompts", "!prompt review");
        // setMacro(D.GetChar("N"), "Review-Prompts", "!prompt review");
        // setMacro(D.GetChar("R"), "Review-Prompts", "!prompt review");
        // setMacro(D.GetChar("L"), "Review-Prompts", "!prompt review");
        // setMacro(D.GetChar("B"), "Review-Prompts", "!prompt review");

        // STATE.REF.SessionScribes = ["TeatimeRationale", "Thaumaterge", "PixelPuzzler", "banzai", "Hastur"]
        // STATE.REF.customLocs["Queen's Landing Hallway"].district = "Cabbagetown"
        // STATE.REF.customLocs["Queen's Landing Lobby"].district = "Cabbagetown"
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

        PENDINGLOCCOMMAND = D.Clone(BLANKPENDINGLOCCOMMAND);
        STATE.REF.isTestingActive = STATE.REF.isTestingActive || false;
        STATE.REF.isFullTest = STATE.REF.isFullTest || false;
        STATE.REF.sceneChars = STATE.REF.sceneChars || [];
        STATE.REF.tokenRecord = STATE.REF.tokenRecord || {
            Active: {},
            Inactive: {},
            Daylighter: {},
            Downtime: {},
            Complications: {},
            Spotlight: {}
        };
        STATE.REF.sceneTokenRecord = STATE.REF.sceneTokenRecord || {
            Active: {},
            Inactive: {},
            Daylighter: {},
            Downtime: {},
            Complications: {},
            Spotlight: {}
        };
        STATE.REF.ActiveTokens = STATE.REF.ActiveTokens || [];
        STATE.REF.SessionScribes = STATE.REF.SessionScribes || _.shuffle(Object.values(Char.REGISTRY).map(x => x.playerName));
        STATE.REF.SessionModes = STATE.REF.SessionModes || ["Active", "Inactive", "Daylighter", "Downtime", "Complications", "Spotlight"];
        STATE.REF.Mode = STATE.REF.Mode || "Inactive";
        STATE.REF.LastMode = STATE.REF.LastMode || "Inactive";
        STATE.REF.SessionMonologues = STATE.REF.SessionMonologues || [];
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
        };
        STATE.REF.curAct = STATE.REF.curAct || 1;
        STATE.REF.locationRecord = STATE.REF.locationRecord || null;
        STATE.REF.sceneFocusRecord = STATE.REF.sceneFocusRecord || null;
        STATE.REF.customLocs = STATE.REF.customLocs || {};
        STATE.REF.locationPointer = STATE.REF.locationPointer || {};
        STATE.REF.FavoriteSites = STATE.REF.FavoriteSites || [];
        STATE.REF.FavoriteDistricts = STATE.REF.FavoriteDistricts || [];
        STATE.REF.SpotlightPrompts =
            STATE.REF.SpotlightPrompts ||
            D.KeyMapObj(
                D.Clone(Char.REGISTRY),
                (k, v) => v.initial,
                () => []
            );
        STATE.REF.PromptAuthors = [];
        STATE.REF.isPromptingGeneric = false;

        STATE.REF.SceneAlarms = STATE.REF.SceneAlarms || [];

        if (!STATE.REF.locationRecord) {
            STATE.REF.locationRecord = {};
            for (const mode of STATE.REF.SessionModes) STATE.REF.locationRecord[mode] = D.Clone(STATE.REF.curLocation);
        }
        if (!STATE.REF.sceneFocusRecord) {
            STATE.REF.sceneFocusRecord = {};
            for (const mode of STATE.REF.SessionModes) {
                const locData = _.pick(
                    STATE.REF.locationRecord[mode],
                    (v, k) => (k.startsWith("District") || k.startsWith("Site")) && Array.isArray(v) && v[0] !== "blank"
                );
                DB({mode, allLocData: STATE.REF.locationRecord[mode], locData}, "SceneFocusRecord");
                STATE.REF.sceneFocusRecord[mode] = "DistrictLeft" in locData ? "l" : "c";
            }
        }
        setPlayerPage();
        verifyStateIntegrity();
        buildLocationMenus();
    };
    // #endregion

    // #region EVENT HANDLERS: (HANDLEINPUT)
    const onChatCall = (call, args, objects, msg) => {
        const charObjs = Listener.GetObjects(objects, "character");
        switch (call) {
            case "lock": {
                switch (D.LCase((call = args.shift()))) {
                    case "date":
                        STATE.REF.dateRecord = null;
                        break;
                    case "loc":
                    case "location": {
                        switch (D.LCase((call = args.shift()))) {
                            case "blank": {
                                STATE.REF.locationRecord.Active = D.Clone(BLANKLOCRECORD);
                                STATE.REF.sceneFocusRecord.Active = "c";
                                break;
                            }
                            default: {
                                STATE.REF.locationRecord.Active = D.Clone(STATE.REF.curLocation);
                                STATE.REF.locationRecord.Active = STATE.REF.sceneFocus;
                                break;
                            }
                        }
                        break;
                    }
                    case "tokens":
                        logTokens("Active");
                        break;
                    case "all": {
                        STATE.REF.dateRecord = null;
                        STATE.REF.locationRecord.Active = D.Clone(STATE.REF.curLocation);
                        STATE.REF.locationRecord.Active = STATE.REF.sceneFocus;
                        logTokens("Active");
                        break;
                    }
                    // no default
                }
                break;
            }
            case "start":
            case "end":
            case "toggle": {
                if (isSessionActive()) endSession(args[0] !== "skip");
                else startSession();
                break;
            }
            case "next":
                startSessionMonologue();
                break;
            case "backup": {
                delete STATE.REF.backupData;
                const backupData = JSON.stringify(STATE.REF);
                STATE.REF.backupData = backupData;
                D.Alert(D.JS(JSON.parse(backupData)));
                break;
            }
            case "restore": {
                const {backupData} = STATE.REF;
                D.Alert(D.JS(JSON.parse(backupData)));
                state[C.GAMENAME][SCRIPTNAME] = JSON.parse(backupData);
                break;
            }
            case "add": {
                switch (D.LCase((call = args.shift()))) {
                    case "favsite":
                        STATE.REF.FavoriteSites.push(args.join(" "));
                        break;
                    case "favdist":
                        STATE.REF.FavoriteDistricts.push(args.join(" "));
                        break;
                    case "macro": {
                        const [charObj] = charObjs;
                        const [macroName, macroAction] = args
                            .join(" ")
                            .split(/\|?!/gu)
                            .map(x => x.trim());
                        D.Alert(D.JS({macroName: `'${macroName}'`, macroAction: `'${macroAction}'`}));
                        setMacro(charObj, macroName, `!${macroAction}`);
                        break;
                    }
                    // no default
                }
                break;
            }
            case "get": {
                switch (D.LCase((call = args.shift()))) {
                    case "macros": {
                        const macroObjs = findObjs({_type: "macro"});
                        const macroData = macroObjs.map(x => {
                            const visibleTo = x
                                .get("visibleto")
                                .split(",")
                                .map(xx => (D.LCase(xx) === "all" ? "ALL" : D.GetName(xx)));
                            return {
                                createdBy: D.GetName(x.get("_playerid")),
                                name: x.get("name"),
                                action: x.get("action"),
                                visibleTo: visibleTo.includes("ALL") ? ["ALL"] : visibleTo
                            };
                        });
                        Handouts.Report("Macros", D.JS(macroData));
                        // macroObjs.filter(x => !x.get("visibleto").includes("Storyteller")).forEach(x => x.set({name: x.get("name").replace(/\|$/gu, "")}));
                        break;
                    }
                    case "scenechars":
                        D.Alert(`Scene Focus: ${Session.SceneFocus}<br>Scene Chars: ${D.JS(Session.SceneChars)}`, "Scene Chars");
                        break;
                    case "locations":
                    case "location":
                    case "loc":
                        D.Alert(D.JS(getAllLocations()), "Current Location Data");
                        break;
                    case "activelocs":
                        D.Alert(D.JS(getActivePositions()), "All Active Locations");
                        break;
                    case "scenelocs":
                        D.Alert(D.JS(getActivePositions()), "Active Scene Locations");
                        break;
                    case "pointer": {
                        const pointerObj = Media.GetImg("MapIndicator");
                        if (pointerObj.get("layer") === "objects") {
                            pointerObj.set("layer", "map");
                            Media.GetImg("MapIndicator_Base_1").set("layer", "map");
                        } else if (pointerObj.get("layer") === "map") {
                            pointerObj.set("layer", "objects");
                            Media.GetImg("MapIndicator_Base_1").set("layer", "objects");
                        }
                        break;
                    }
                    // no default
                }
                break;
            }
            case "loc":
                distCommandMenu();
                break;
            case "focus": {
                switch (D.LCase((call = args.shift()))) {
                    case "c":
                    case "l":
                    case "r":
                        setSceneFocus(D.LCase(call));
                        break;
                    case "toggle": {
                        switch (STATE.REF.sceneFocus) {
                            case "l":
                                setSceneFocus("r");
                                break;
                            case "r":
                                setSceneFocus("l");
                                break;
                            default:
                                sceneFocusCommandMenu();
                                break;
                        }
                        break;
                    }
                    default:
                        sceneFocusCommandMenu();
                        break;
                }
                break;
            }
            case "set": {
                switch (D.LCase((call = args.shift()))) {
                    case "menu":
                    case "menus":
                        buildLocationMenus();
                        break;
                    case "act":
                        STATE.REF.curAct = D.Int(args[0]) || STATE.REF.curAct;
                        break;
                    case "generic": {
                        if (!args.length) {
                            D.Alert(
                                "Syntax: <b>!sess set generic choleric+|When the Levee Breaks|Any length of aspect text as long as it doesn't contain a pipe.</b>"
                            );
                        } else {
                            const [siteRes, siteSong, siteAspect] = args.join(" ").split("|");
                            setGenericSiteDetails(siteRes, siteSong, siteAspect);
                        }
                        break;
                    }
                    case "pointer": {
                        const pointerObj = Media.GetImg("MapIndicator_Base");
                        const [siteRef, siteName] = getActiveSite(true);
                        if (ISSETTINGPOINTER) {
                            const pointerPos = {left: pointerObj.get("left"), top: pointerObj.get("top")};
                            if (siteName in STATE.REF.customLocs) {
                                STATE.REF.customLocs[siteName].pointerPos = pointerPos;
                            } else {
                                STATE.REF.locationPointer[siteRef] = STATE.REF.locationPointer[siteRef] || {};
                                STATE.REF.locationPointer[siteRef].pointerPos = pointerPos;
                            }
                            pointerObj.set({layer: "map"});
                            D.Alert(`Map Position for site "${siteName || siteRef}" set to: ${D.JSL(pointerPos)}`, "!sess set pointer");
                            ISSETTINGPOINTER = false;
                            setSceneFocus();
                        } else {
                            pointerObj.set({layer: "objects"});
                            ISSETTINGPOINTER = true;
                            D.Alert(
                                `Setting pointer position for <b>"${siteName ||
                                    siteRef}"</b><br><br>Move the map indicator to the desired position, then type "!sess set pointer" again.`,
                                "!sess set pointer"
                            );
                        }
                        break;
                    }
                    case "scene":
                        setSceneFocus(args.shift());
                        break;
                    case "customsitedist": {
                        const [siteRef, siteName] = getActiveSite(true);
                        const customLocRef =
                            (siteName in STATE.REF.customLocs && STATE.REF.customLocs[siteName]) ||
                            (siteRef in STATE.REF.customLocs && STATE.REF.customLocs[siteRef]) ||
                            false;
                        if (customLocRef)
                            if (args.length) {
                                if (args.join(" ") in C.DISTRICTS) customLocRef.district = args.join(" ");
                                else D.Alert(`No such district: ${D.JS(args.join(" "))}`, "!sess set customsitedist");
                            } else {
                                delete customLocRef.district;
                            }
                        else D.Alert(`No custom site registered for ${siteName || siteRef}`, "!sess set customsitedist");
                        break;
                    }
                    default: {
                        setSessionNum(D.Int(call) || STATE.REF.SessionNum);
                        break;
                    }
                }
                break;
            }
            case "delete":
            case "del": {
                switch (D.LCase((call = args.shift()))) {
                    case "favsite": {
                        STATE.REF.FavoriteSites = _.without(STATE.REF.FavoriteSites, args.join(" "));
                        break;
                    }
                    case "favdist": {
                        STATE.REF.FavoriteDistricts = _.without(STATE.REF.FavoriteDistricts, args.join(" "));
                        break;
                    }
                    case "customsite": {
                        delete STATE.REF.customLocs[args.join(" ")];
                        break;
                    }
                    // no default
                }
                break;
            }
            case "scene":
                endScene();
                break;
            case "downtime":
                toggleDowntime();
                break;
            case "spotlight": {
                if (args.shift() === "end" || !charObjs || !charObjs.length) toggleSpotlight();
                else toggleSpotlight(charObjs.shift());
                break;
            }
            case "daylighters": {
                STATE.REF.Mode = STATE.REF.Mode === "Daylighter" ? "Active" : "Daylighter";
                D.Alert(`Session Mode Set To: ${STATE.REF.Mode}`, "Session Set Mode");
                DragPads.Toggle("signalLight", STATE.REF.Mode !== "Daylighter");
                TimeTracker.Fix();
                for (const charData of _.values(Char.REGISTRY).slice(0, 4)) {
                    const [token] = findObjs({
                        _pageid: D.MAINPAGEID,
                        _type: "graphic",
                        _subtype: "token",
                        represents: charData.id
                    });
                    if (STATE.REF.Mode === "Daylighter") {
                        Media.SetImgData(token, {isDaylighter: true, unObfSrc: "base"});
                        Media.SetImg(token, "baseDL");
                        if (charData.famulusTokenID) {
                            const famToken = Media.GetImg(charData.famulusTokenID);
                            Media.ToggleImg(famToken, false);
                        }
                    } else {
                        Media.SetImgData(token, {isDaylighter: false, unObfSrc: "base"});
                        Media.SetImg(token, "base");
                    }
                }
                break;
            }
            case "test": {
                switch (D.LCase((call = args.shift()))) {
                    case "location":
                    case "loc": {
                        switch (D.LCase((call = args.shift()))) {
                            case "active":
                                D.Alert(D.JS(getActiveLocations()));
                                break;
                            case "activelocs":
                                D.Alert(D.JS(getActivePositions(args[0])), `Testing getActiveLocations(${args[0] || ""})`);
                                break;
                            case "activescenelocs":
                                D.Alert(D.JS(getActivePositions()), "Testing getActiveSceneLocations()");
                                break;
                            case "activedistrict":
                                D.Alert(D.JS(getActiveDistrict()), "Testing getActiveDistrict()");
                                break;
                            case "activesite":
                                D.Alert(D.JS(getActiveSite()), "Testing getActiveSite()");
                                break;
                            case "sublocs":
                                D.Alert(D.JS(getSubLocs()), "Testing getSubLocs()");
                                break;
                            case "isoutside":
                                D.Alert(D.JS(isOutside()), "Testing isOutside()");
                                break;
                            case "curloc":
                                D.Alert(D.JS(STATE.REF.curLocation), "Testing STATE.curLocation");
                                break;
                            case "locrecord":
                                D.Alert(D.JS(STATE.REF.locationRecord), "Testing STATE.locationRecord");
                                break;
                            case "locchars":
                                D.Alert(D.JS(getCharsInLocation(args[0])), `Testing getCharsInLocation(${args[0] || ""})`);
                                break;
                            // no default
                        }
                        break;
                    }
                    case "full":
                        toggleFullTest();
                        break;
                    default:
                        toggleTesting();
                        break;
                }
                break;
            }
            case "reset": {
                switch (D.LCase((call = args.shift()))) {
                    case "loc":
                    case "location":
                        STATE.REF.curLocation = D.Clone(BLANKLOCRECORD);
                        break;
                    // no default
                }
                break;
            }
            // no default
        }
    };
    const onPageChange = () => {
        if (Campaign().get("playerpageid") === C.PAGES.GAME && Session.IsTesting) Media.ToggleText("playerPageAlertMessage", true);
        else Media.ToggleText("playerPageAlertMessage", false);
    };
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    // #region Configuration
    let ISSETTINGPOINTER = false;
    const MODEFUNCTIONS = {
        outroMode: {
            Active: () => {},
            Inactive: () => {
                if (!STATE.REF.isTestingActive || STATE.REF.isFullTest) setPlayerPage("GAME");
            },
            Downtime: () => {
                D.Chat(
                    "all",
                    C.HTML.Block([
                        C.HTML.Title("Leaving Session Downtime"),
                        C.HTML.Header("Loading Status: Regular Time"),
                        C.HTML.Body("Starting Clock.")
                    ])
                );
            },
            Daylighter: () => {},
            Spotlight: () => {
                D.Chat("all", C.HTML.Block([C.HTML.Title("Spotlight"), C.HTML.Header("Closing Spotlight Session.")]));
                STATE.REF.spotlightChar = null;
            },
            Complications: () => {},
            Testing: () => {}
        },
        leaveMode: {
            Active: () => {},
            Inactive: () => {
                TimeTracker.ToggleClock(true);
            },
            Downtime: () => {},
            Daylighter: () => {},
            Spotlight: () => {
                for (const charData of D.GetChars("registered").map(x => D.GetCharData(x))) {
                    // Char.SetNPC(charData.id, "base")
                    Media.ToggleToken(charData.id, true); // Char.TogglePC(charData.quadrant, true)
                    Media.ToggleText(`${charData.name}Desire`, true);
                    Char.SetNPC(charData.id, "base");
                }
                Media.ToggleImg("Spotlight", false);
            },
            Complications: () => {},
            Testing: () => {
                STATE.REF.isTestingActive = false;
                toggleFullTest(false);
                Media.ToggleText("testSessionNotice", false);
                Media.ToggleText("testSessionNoticeSplash", false);
                Media.ToggleText("playerPageAlertMessage", false);
            }
        },
        enterMode: {
            Active: () => {
                Char.RefreshDisplays();
                if (!STATE.REF.isTestingActive || STATE.REF.isFullTest) TimeTracker.ToggleClock(true);
            },
            Inactive: () => {
                setPlayerPage("SplashPage");
                Media.ToggleTokens(null, false);
                TimeTracker.ToggleClock(false);
            },
            Downtime: () => {
                setLocation(BLANKLOCRECORD);
                TimeTracker.ToggleClock(false);
                Char.SendHome();
            },
            Daylighter: () => {},
            Spotlight: () => {
                setLocation(BLANKLOCRECORD);
                TimeTracker.ToggleClock(false);
                Char.RefreshDisplays();
            },
            Complications: () => {
                Media.ToggleTokens(null, false);
                TimeTracker.ToggleClock(false);
            },
            Testing: () => {
                STATE.REF.isTestingActive = true;
                Media.ToggleText("testSessionNotice", true);
                Media.ToggleText("testSessionNoticeSplash", true);
                Media.SetText("testSessionNotice", `TESTING (${Session.Mode})`);
                Media.SetText("testSessionNoticeSplash", `TESTING (${Session.Mode})`);
                setPlayerPage();
            }
        },
        introMode: {
            Active: () => {
                // Media.ToggleTokens("registered", true);
                Media.ToggleTokens("disabled", false);
            },
            Inactive: () => {},
            Downtime: () => {
                if (STATE.REF.LastMode !== "Complications")
                    D.Chat(
                        "all",
                        C.HTML.Block([C.HTML.Title("Session Downtime"), C.HTML.Header("Session Status: Downtime"), C.HTML.Body("Clock Stopped.")]),
                        null,
                        D.RandomString(3)
                    );
            },
            Daylighter: () => {},
            Spotlight: (charRef, messageText) => {
                DB({charRef, messageText}, "introMode");
                setSpotlightChar(charRef, messageText);
            },
            Complications: () => {},
            Testing: () => {}
        }
    };
    const MODEDATA = {
        Active: {},
        Inactive: {},
        Downtime: {},
        Daylighter: {},
        Spotlight: {},
        Complications: {
            isIgnoringSounds: true
        },
        Testing: {}
    };
    const BLANKLOCRECORD = {
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
    };
    const verifyStateIntegrity = () => {
        // A series of simple validations of registry data.
        const [siteNames, /* distNames, */ posNames /* subPosNames */] = [
            Object.keys(C.SITES),
            /* Object.keys(C.DISTRICTS), */
            ["DistrictCenter", "DistrictRight", "DistrictLeft", "SiteCenter", "SiteRight", "SiteLeft", "subLocs"]
            /* ["TopLeft", "Left", "BotLeft", "TopRight", "Right", "BotRight"] */
        ];
        STATE.REF.FavoriteSites = _.reject(STATE.REF.FavoriteSites, x => !siteNames.includes(x));

        for (const [modeName] of Object.entries(STATE.REF.locationRecord))
            STATE.REF.locationRecord[modeName] = _.omit(STATE.REF.locationRecord[modeName], (v, k) => !posNames.includes(k));

        STATE.REF.curLocation = _.omit(STATE.REF.curLocation, (v, k) => !posNames.includes(k));
    };
    const MENUHTML = {};
    // #endregion

    // #region Getting & Setting Session Data
    const isSessionActive = () => STATE.REF.Mode !== "Inactive";
    const setSessionNum = sNum => {
        sNum = sNum || ++STATE.REF.SessionNum;
        STATE.REF.SessionNum = sNum;
        Media.SetText(
            "NextSession",
            D.Romanize(STATE.REF.SessionNum, false)
                .split("")
                .join("   ")
        );
        D.Flag(`Session Set to ${D.UCase(D.NumToText(STATE.REF.SessionNum))}`);
    };
    // #endregion

    // #region Starting/Ending Sessions
    const startSession = () => {
        const sessionScribe = STATE.REF.isTestingActive && !STATE.REF.isFullTest ? STATE.REF.SessionScribes[0] : STATE.REF.SessionScribes.shift();
        if (STATE.REF.isTestingActive && !STATE.REF.isFullTest) STATE.REF.dateRecord = TimeTracker.CurrentDate.getTime();
        else STATE.REF.dateRecord = null;
        if (STATE.REF.SessionScribes.length === 0) {
            DB(
                `Scribe: ${sessionScribe}, SessionScribes: ${D.JSL(STATE.REF.SessionScribes)}
                    PICK: ${D.JS(_.pick(Char.REGISTRY, v => v.playerName !== sessionScribe))}
                    PLUCK: ${D.JS(
                        _.pluck(
                            _.pick(Char.REGISTRY, v => v.playerName !== sessionScribe),
                            "playerName"
                        )
                    )}
                    WITHOUT: ${D.JS(
                        _.without(
                            _.pluck(
                                _.pick(Char.REGISTRY, v => v.playerName !== sessionScribe),
                                "playerName"
                            ),
                            "Storyteller"
                        )
                    )}`,
                "startSession"
            );
            const otherScribes = _.shuffle(
                _.without(
                    _.pluck(
                        _.pick(Char.REGISTRY, v => v.playerName !== sessionScribe),
                        "playerName"
                    ),
                    "Storyteller"
                )
            );
            STATE.REF.SessionScribes.push(otherScribes.pop(), ..._.shuffle([...otherScribes, sessionScribe]));
        }
        STATE.REF.SessionMonologues = _.shuffle(D.GetChars("registered").map(x => D.GetCharData(x).name));
        STATE.REF.spotlightChar = false;
        STATE.REF.PromptAuthors = [];
        for (const quad of Object.keys(Char.REGISTRY)) Char.REGISTRY[quad].spotlightPrompt = false;
        changeMode("Active", true, [
            [
                D.Chat,
                [
                    "all",
                    C.HTML.Block([
                        C.HTML.Title("VAMPIRE: TORONTO by NIGHT", {fontSize: "28px"}),
                        C.HTML.Body("Initializing Session...", {margin: "0px 0px 10px 0px"}),
                        C.HTML.Header(`Welcome to Session ${D.NumToText(STATE.REF.SessionNum, true)}!`),
                        C.HTML.Body("Clock Running.<br>Animations Online.<br>Roller Ready.", {margin: "10px 0px 10px 0px"}),
                        C.HTML.Header(`Session Scribe: ${sessionScribe || "(None Set)"}`),
                        C.HTML.Body(
                            '(Click <a style = "color: white; font-weight: normal; background-color: rgba(255,0,0,0.5);" href="https://docs.google.com/document/d/1GsGGDdYTVeHVHgGe9zrztEIN4Qmtpb2xZA8I-_WBnDM/edit?usp=sharing" target="_blank">&nbsp;here&nbsp;</a> to open the template in a new tab,<br>then create a copy to use for this session.)',
                            {fontSize: "14px", lineHeight: "14px"}
                        ),
                        C.HTML.Body("Thank you for your service!")
                    ])
                ]
            ]
        ]);
    };
    const endSession = (isDoingMonologues = true) => {
        DB({mode: Session.Mode, spotlightChar: STATE.REF.spotlightChar, monologues: D.JS(STATE.REF.SessionMonologues)}, "endSession");
        if (
            (STATE.REF.isTestingActive && !STATE.REF.isFullTest) ||
            (isDoingMonologues && startSessionMonologue()) ||
            (!isDoingMonologues && remorseCheck())
        ) {
            changeMode("Inactive", true, [
                [
                    D.Chat,
                    [
                        "all",
                        C.HTML.Block([
                            C.HTML.Title("VAMPIRE: TORONTO by NIGHT", {fontSize: "28px"}),
                            C.HTML.Header(`Concluding Session ${D.NumToText(STATE.REF.SessionNum, true)}`),
                            C.HTML.Body("Clock Stopped.<br>Animations Offline.<br>Session Experience Awarded.", {
                                margin: "10px 0px 10px 0px"
                            }),
                            C.HTML.Title("See you next week!", {fontSize: "32px"})
                        ])
                    ]
                ]
            ]);
            if (!STATE.REF.isTestingActive || STATE.REF.isFullTest) {
                STATE.REF.dateRecord = null;
                for (const char of D.GetChars("registered"))
                    if (STATE.REF.isTestingActive) D.Alert(`Would award 1 XP to ${D.JS(char)} if session active.`, "Full Test: Session.endSession()");
                    else Char.AwardXP(char, 1, "Session XP award.");
                STATE.REF.SessionNum++;
            } else if (STATE.REF.dateRecord) {
                TimeTracker.CurrentDate = STATE.REF.dateRecord;
            }
            Media.SetText(
                "NextSession",
                D.Romanize(STATE.REF.SessionNum, false)
                    .split("")
                    .join("   ")
            );
        }
    };
    const logTokens = mode => {
        const tokenObjs = findObjs({
            _pageid: D.MAINPAGEID,
            _type: "graphic",
            _subtype: "token"
        }).filter(x => x.get("represents"));
        STATE.REF.tokenRecord[mode] = {};
        for (const tokenObj of tokenObjs)
            STATE.REF.tokenRecord[mode][tokenObj.id] = {
                charID: tokenObj.get("represents"),
                left: tokenObj.get("left"),
                top: tokenObj.get("top"),
                layer: tokenObj.get("layer"),
                src: (Media.TOKENS[D.GetName(tokenObj.get("represents"))] || {curSrc: "base"}).curSrc || "base"
            };
    };
    const restoreTokens = mode => {
        for (const [tokenID, tokenData] of Object.entries(STATE.REF.tokenRecord[mode])) {
            Media.SetToken(tokenData.charID, tokenData.src);
            Media.SetImgTemp(tokenID, _.omit(tokenData, "src"));
            Media.ToggleToken(tokenData.charID, tokenData.layer === "objects");
        }
    };
    // #endregion

    // #region Toggling Session Modes
    const changeMode = (mode, args, endFuncs = []) => {
        args = _.flatten([args]);
        DB({mode, args}, "changeMode");
        if (D.Capitalize(D.LCase(mode)) === Session.Mode) return null;
        if (VAL({string: mode}, "changeMode") && STATE.REF.SessionModes.map(x => x.toLowerCase()).includes(mode.toLowerCase())) {
            const [lastMode, curMode] = [`${STATE.REF.Mode}`, D.Capitalize(mode.toLowerCase())];
            if (lastMode === "Inactive" && curMode === "Active") {
                D.Queue(
                    Media.ToggleLoadingScreen,
                    [
                        "initializing",
                        `Initializing Session ${D.NumToText(STATE.REF.SessionNum, true)}`,
                        {
                            duration: 15,
                            numTicks: 30,
                            callback: () => {
                                MODEFUNCTIONS.introMode[curMode](...args);
                            }
                        }
                    ],
                    "ModeSwitch",
                    1
                );
                D.Queue(MODEFUNCTIONS.outroMode[lastMode], args, "ModeSwitch", 3);
                D.Queue(Media.SetLoadingMessage, ["Preparing Sandbox..."], "ModeSwitch", 0.1);
                D.Queue(logTokens, [lastMode], "ModeSwitch", 0.1);
                D.Queue(MODEFUNCTIONS.leaveMode[lastMode], args, "ModeSwitch", 1);
                D.Queue(
                    () => {
                        STATE.REF.Mode = curMode;
                        STATE.REF.LastMode = lastMode;
                    },
                    [],
                    "ModeSwitch",
                    0.1
                );
                D.Queue(Media.SetLoadingMessage, ["Adding Characters..."], "ModeSwitch", 0.1);
                D.Queue(Roller.Clean, [], "ModeSwitch", 1);
                D.Queue(Media.ModeUpdate, [], "ModeSwitch", 2);
                D.Queue(setModeLocations, [curMode], "ModeSwitch", 1);
                if (!(MODEDATA[curMode].isIgnoringSounds || MODEDATA[lastMode].isIgnoringSounds)) D.Queue(Soundscape.Sync, [true], "ModeSwitch", 1);
                D.Queue(Media.SetLoadingMessage, ["Setting Time, Location & Weather..."], "ModeSwitch", 0.1);
                D.Queue(MODEFUNCTIONS.enterMode[curMode], args, "ModeSwitch", 1);
                D.Queue(restoreTokens, [curMode], "ModeSwitch", 0.1);
                D.Queue(TimeTracker.Fix, [], "ModeSwitch", 0.1);
                D.Queue(Media.SetLoadingMessage, ["Synchronizing Display Data..."], "ModeSwitch", 1);
            } else {
                D.Queue(MODEFUNCTIONS.outroMode[lastMode], args, "ModeSwitch", 0.1);
                D.Queue(
                    Media.ToggleLoadingScreen,
                    [
                        (curMode === "Inactive" && "concluding") || "loading",
                        `Changing Modes: ${D.UCase(lastMode)} ► ${D.UCase(curMode)}`,
                        {
                            duration: 15,
                            numTicks: 30,
                            callback: () => {
                                MODEFUNCTIONS.introMode[curMode](...args);
                            }
                        }
                    ],
                    "ModeSwitch",
                    3
                );
                D.Queue(Media.SetLoadingMessage, ["Logging Game State..."], "ModeSwitch", 0.1);
                D.Queue(logTokens, [lastMode], "ModeSwitch", 0.1);
                D.Queue(MODEFUNCTIONS.leaveMode[lastMode], args, "ModeSwitch", 1);
                D.Queue(
                    () => {
                        STATE.REF.Mode = curMode;
                        STATE.REF.LastMode = lastMode;
                    },
                    [],
                    "ModeSwitch",
                    0.1
                );
                D.Queue(Media.SetLoadingMessage, [`Clearing ${D.UCase(lastMode)} Assets...`], "ModeSwitch", 0.1);
                D.Queue(Roller.Clean, [], "ModeSwitch", 1);
                D.Queue(Media.ModeUpdate, [], "ModeSwitch", 2);
                D.Queue(setModeLocations, [curMode], "ModeSwitch", 1);
                if (!(MODEDATA[curMode].isIgnoringSounds || MODEDATA[lastMode].isIgnoringSounds)) D.Queue(Soundscape.Sync, [true], "ModeSwitch", 1);
                D.Queue(Media.SetLoadingMessage, [`Deploying ${D.UCase(curMode)} Assets ...`], "ModeSwitch", 0.1);
                D.Queue(MODEFUNCTIONS.enterMode[curMode], args, "ModeSwitch", 1);
                D.Queue(restoreTokens, [curMode], "ModeSwitch", 0.1);
                D.Queue(TimeTracker.Fix, [], "ModeSwitch", 0.1);
                D.Queue(Media.SetLoadingMessage, ["Cleaning Up ..."], "ModeSwitch", 1);
            }
            // D.Queue(Media.ToggleLoadingScreen, [false], "ModeSwitch", 0.1)
            D.Queue(MODEFUNCTIONS.introMode[curMode], args, "ModeSwitch", 0.1);
            for (const endFunc of endFuncs) D.Queue(endFunc[0], endFunc[1], "ModeSwitch", endFunc[2] || 0.1);
            // D.Queue(setSceneFocus, [])
            D.Run("ModeSwitch");
            Media.SetText("testSessionNotice", `TESTING (${curMode})`);
            Media.SetText("testSessionNoticeSplash", `TESTING (${curMode})`);
        }
        return true;
    };
    const toggleFullTest = isFullTesting => {
        isFullTesting = VAL({bool: isFullTesting}) ? isFullTesting : !STATE.REF.isFullTest;
        STATE.REF.isFullTest = isFullTesting;
        Media.SetTextData("testSessionNotice", {color: (isFullTesting && C.COLORS.brightred) || C.COLORS.puregreen});
        Media.SetTextData("testSessionNoticeSplash", {color: (isFullTesting && C.COLORS.brightred) || C.COLORS.puregreen});
        if (isFullTesting) {
            STATE.REF.fullTestRecord = STATE.REF.fullTestRecord || {};
            STATE.REF.fullTestRecord.SessionScribes = D.Clone(STATE.REF.SessionScribes);
            STATE.REF.fullTestRecord.dateRecord = STATE.REF.dateRecord;
            STATE.REF.fullTestRecord.SessionNum = STATE.REF.SessionNum;
        } else {
            setPlayerPage("SplashPage");
            if ("SessionScribes" in STATE.REF.fullTestRecord) {
                STATE.REF.SessionScribes = D.Clone(STATE.REF.fullTestRecord.SessionScribes);
                STATE.REF.dateRecord = STATE.REF.fullTestRecord.dateRecord;
                STATE.REF.SessionNum = STATE.REF.fullTestRecord.SessionNum;
            }
            STATE.REF.fullTestRecord = {};
        }
    };
    const toggleTesting = isTesting => {
        if (VAL({bool: isTesting})) {
            if (isTesting !== STATE.REF.isTestingActive) MODEFUNCTIONS[isTesting ? "enterMode" : "leaveMode"].Testing();
        } else {
            MODEFUNCTIONS[STATE.REF.isTestingActive ? "leaveMode" : "enterMode"].Testing();
        }
    };
    const toggleDowntime = () => changeMode(STATE.REF.Mode === "Downtime" ? STATE.REF.LastMode : "Downtime");
    const toggleSpotlight = (charRef, messageText) => {
        DB({charRef, messageText}, "toggleSpotlight");
        if (STATE.REF.Mode === "Spotlight")
            if (charRef) setSpotlightChar(charRef, messageText);
            else changeMode(STATE.REF.LastMode);
        else changeMode("Spotlight", [charRef, messageText]);
    };
    const setSpotlightChar = (charRef, messageText) => {
        // DB({charRef, messageText}, "setSpotlightChar");
        if (STATE.REF.Mode !== "Spotlight") {
            changeMode("Spotlight", [charRef, messageText]);
        } else {
            const charObj = D.GetChar(charRef);
            if (VAL({pc: charObj}) && STATE.REF.spotlightChar !== charObj.id) {
                Char.SendHome();
                STATE.REF.spotlightChar = charObj.id;
                const charData = D.GetCharData(charObj);
                const quad = charData.quadrant;
                const otherCharData = D.GetChars("registered")
                    .filter(x => x.id !== charData.id)
                    .map(x => D.GetCharData(x));
                for (const otherData of otherCharData) {
                    Media.ToggleToken(otherData.id, false); // Char.TogglePC(otherData.quadrant, false)
                    Char.SetNPC(otherData.id, "base");
                    Media.ToggleText(`${otherData.shortName}Desire`, false);
                }
                Media.ToggleToken(charData.id, true); // Char.TogglePC(quad, true)
                Media.ToggleText(`${charData.shortName}Desire`, true);
                Char.SetNPC(charData.id, "base");
                Media.SetImg("Spotlight", quad);
                Media.ToggleImg("Spotlight", true);
                D.Chat("all", messageText || C.HTML.Block([C.HTML.Title("Spotlight:"), C.HTML.Header(charData.name)]));
            }
        }
    };
    const setPlayerPage = pageRef => {
        pageRef = pageRef || getObj("page", Campaign().get("playerpageid")).get("name");
        if (pageRef === "GAME" && STATE.REF.isTestingActive) Media.ToggleText("playerPageAlertMessage", true);
        else Media.ToggleText("playerPageAlertMessage", false);
        Campaign().set({playerpageid: D.GetPageID(pageRef)});
    };
    // #endregion

    // #region Location Handling
    const BLANKPENDINGLOCCOMMAND = {
        workingIndex: 0,
        Districts: [],
        Sites: []
    };
    const buildLocationMenus = () => {
        const districtMenuData = {
            rows: [
                ..._.chain(["blank", "match", "reset"])
                    .map(x => ({
                        name: D.UCase(x),
                        command: `!reply ${x}`,
                        styles: {
                            bgColor: C.COLORS[{blank: "grey", match: "purple", reset: "brightred"}[x]],
                            color: C.COLORS[{blank: "white", match: "white", reset: "black"}[x]]
                        }
                    }))
                    .groupBy((x, i) => Math.floor(i / 3))
                    .map(x => ({
                        type: "ButtonLine",
                        contents: x,
                        buttonStyles: {
                            width: `${Math.floor(C.CHATWIDTH * 0.33) - 3}px`,
                            fontSize: "12px",
                            bgColor: C.COLORS.midgold,
                            buttonTransform: "none"
                        }
                    }))
                    .value(),
                ..._.chain(["left", "center", "right"])
                    .map(x => ({name: D.UCase(x), command: `!reply ${x}`}))
                    .groupBy((x, i) => Math.floor(i / 3))
                    .map(x => ({
                        type: "ButtonLine",
                        contents: [{text: "SAME AS:", styles: {color: C.COLORS.white}}, ...x],
                        buttonStyles: {
                            color: C.COLORS.black,
                            width: `${Math.floor(C.CHATWIDTH * 0.25) - 3}px`,
                            fontSize: "12px",
                            bgColor: C.COLORS.brightgold,
                            buttonTransform: "none"
                        }
                    }))
                    .value(),
                ..._.chain(STATE.REF.FavoriteDistricts)
                    .map(x => ({name: x, command: `!reply ${x}`}))
                    .groupBy((x, i) => Math.floor(i / 3))
                    .map(x => ({
                        type: "ButtonLine",
                        contents: x,
                        buttonStyles: {
                            width: `${Math.floor(C.CHATWIDTH * 0.33) - 3}px`,
                            fontSize: "12px",
                            bgColor: C.COLORS.purple,
                            buttonTransform: "none"
                        }
                    }))
                    .value(),
                ..._.chain(Object.keys(C.DISTRICTS))
                    .map(x => ({name: x, command: `!reply ${x}`}))
                    .groupBy((x, i) => Math.floor(i / 3))
                    .map(x => ({
                        type: "ButtonLine",
                        contents: x,
                        buttonStyles: {
                            width: `${Math.floor(C.CHATWIDTH * 0.33) - 3}px`,
                            fontSize: "12px",
                            bgColor: C.COLORS.darkgreen,
                            buttonTransform: "none"
                        }
                    }))
                    .value()
            ]
        };
        const siteMenuFirstRows = _.compact([
            ..._.chain(["blank"])
                .map(x => ({name: D.UCase(x), command: `!reply site@${x}`}))
                .groupBy((x, i) => Math.floor(i / 3))
                .map(x => ({
                    type: "ButtonLine",
                    contents: [...x, 0, 0],
                    buttonStyles: {
                        width: `${Math.floor(C.CHATWIDTH * 0.33) - 3}px`,
                        fontSize: "12px",
                        bgColor: C.COLORS.grey,
                        buttonTransform: "none"
                    }
                }))
                .value(),
            ..._.chain(["left", "center", "right"])
                .map(x => ({name: D.UCase(x), command: `!reply site@${x}`}))
                .groupBy((x, i) => Math.floor(i / 3))
                .map(x => ({
                    type: "ButtonLine",
                    contents: [{text: "SAME AS:", styles: {color: C.COLORS.white}}, ...x],
                    buttonStyles: {
                        color: C.COLORS.black,
                        width: `${Math.floor(C.CHATWIDTH * 0.25) - 3}px`,
                        fontSize: "12px",
                        bgColor: C.COLORS.brightgold,
                        buttonTransform: "none"
                    }
                }))
                .value(),
            "~~~favsitescode~~~",
            "~~~namedsitescode~~~",
            "~~~distsitescode~~~",
            ..._.chain(Object.keys(C.SITES).filter(x => C.SITES[x].district === null))
                .map(x => ({name: x, command: `!reply site@${x}`}))
                .groupBy((x, i) => Math.floor(i / 3))
                .map(x => ({
                    type: "ButtonLine",
                    contents: x,
                    buttonStyles: {
                        width: `${Math.floor(C.CHATWIDTH * 0.33) - 3}px`,
                        fontSize: "12px",
                        bgColor: C.COLORS.blue,
                        buttonTransform: "none"
                    }
                }))
                .value()
        ]);
        const siteMenuFinalRows = [
            ..._.chain({
                ["RENAME"]: ["!reply name@?{Site Name}", {}]
            })
                .mapObject((v, k) => (v ? {name: k, command: v[0], styles: v[1]} : 0))
                .values()
                .groupBy((x, i) => Math.floor(i / 3))
                .map(x => ({
                    type: "ButtonLine",
                    contents: x,
                    buttonStyles: {
                        width: `${Math.floor(C.CHATWIDTH * 0.66) - 3}px`,
                        fontSize: "12px",
                        bgColor: C.COLORS.brightbrightgrey,
                        color: C.COLORS.black,
                        fontWeight: "bold"
                    }
                }))
                .value(),
            ..._.chain({
                ["FINISHED!"]: ["!reply done", {}],
                ["RESET"]: ["!reply reset", {bgColor: C.COLORS.brightred, color: C.COLORS.white}]
            })
                .mapObject((v, k) => (v ? {name: k, command: v[0], styles: v[1]} : 0))
                .values()
                .groupBy((x, i) => Math.floor(i / 3))
                .map(x => ({
                    type: "ButtonLine",
                    contents: x,
                    buttonStyles: {
                        width: `${Math.floor(C.CHATWIDTH * 0.5) - 10}px`,
                        buttonHeight: "18px",
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: C.COLORS.black,
                        bgColor: C.COLORS.puregreen
                    }
                }))
                .value()
        ];
        MENUHTML.DistrictMenuFirst = D.CommandMenuHTML(Object.assign({}, districtMenuData, {title: "District"}));
        MENUHTML.DistrictMenuSecond = D.CommandMenuHTML(Object.assign({}, districtMenuData, {title: "District RIGHT"}));
        MENUHTML.SiteMenuFirst = D.CommandMenuHTML({
            title: "Site (~~~districtname~~~)",
            rows: [
                ...siteMenuFirstRows,
                ..._.chain({
                    ["<<< subLocs"]: ["!reply call@sublocs", {}],
                    ["Loc #2 >>>"]: ["!reply call@district", {}]
                })
                    .mapObject((v, k) => (v ? {name: k, command: v[0], styles: v[1]} : 0))
                    .values()
                    .groupBy((x, i) => Math.floor(i / 3))
                    .map(x => ({
                        type: "ButtonLine",
                        contents: x,
                        buttonStyles: {
                            width: `${Math.floor(C.CHATWIDTH * 0.4) - 3}px`,
                            fontSize: "12px",
                            bgColor: C.COLORS.palepurple,
                            color: C.COLORS.black,
                            fontWeight: "bold"
                        }
                    }))
                    .value(),
                ...siteMenuFinalRows
            ]
        });
        MENUHTML.SiteMenuSecond = D.CommandMenuHTML({
            title: "Site RIGHT (~~~districtname~~~)",
            rows: [
                ...siteMenuFirstRows,
                ..._.chain({
                    ["<<< Left"]: ["!reply focus@left", {width: "30%", bgColor: (STATE.REF.sceneFocus === "l" && C.COLORS.gold) || C.COLORS.grey}],
                    [">> Both <<"]: [
                        "!reply focus@center",
                        {width: "30%", bgColor: (STATE.REF.sceneFocus === "c" && C.COLORS.gold) || C.COLORS.grey}
                    ],
                    ["Right >>>"]: ["!reply focus@right", {width: "30%", bgColor: (STATE.REF.sceneFocus === "r" && C.COLORS.gold) || C.COLORS.grey}]
                })
                    .mapObject((v, k) => (v ? {name: k, command: v[0], styles: v[1]} : 0))
                    .values()
                    .groupBy((x, i) => Math.floor(i / 3))
                    .map(x => ({
                        type: "ButtonLine",
                        contents: x,
                        buttonStyles: {
                            width: `${Math.floor(C.CHATWIDTH * 0.4) - 3}px`,
                            fontSize: "12px",
                            bgColor: C.COLORS.palepurple,
                            color: C.COLORS.black,
                            fontWeight: "bold"
                        }
                    }))
                    .value(),
                ...siteMenuFinalRows
            ]
        });
    };
    const getSiteMenuCode = (districtName, isSecondSite = false) => {
        districtName = VAL({array: districtName}) ? districtName[0] : districtName;
        DB({districtName}, "getSiteMenuCode");
        const favSites = STATE.REF.FavoriteSites.filter(
            x => (C.SITES[x] || STATE.REF.customLocs[x]).district === null || (C.SITES[x] || STATE.REF.customLocs[x]).district.includes(districtName)
        );
        const distSites = Object.keys(C.SITES).filter(x => C.SITES[x].district && C.SITES[x].district.includes(districtName));
        const namedSites = Object.keys(STATE.REF.customLocs).filter(
            x => !STATE.REF.customLocs[x].district || STATE.REF.customLocs[x].district === districtName
        );
        DB({favSites, distSites, namedSites}, "getSiteMenuCode");
        const favSitesCode = _.chain(favSites)
            .map(x => ({name: x, command: `!reply site@${x}`}))
            .groupBy((x, i) => Math.floor(i / 3))
            .map(x =>
                D.CommandMenuHTML({
                    type: "ButtonLine",
                    contents: x,
                    buttonStyles: {width: "30%", fontSize: "12px", bgColor: C.COLORS.purple, buttonTransform: "none"}
                })
            )
            .value()
            .join("");
        const distSitesCode = _.chain(distSites)
            .map(x => ({name: x, command: `!reply site@${x}`}))
            .groupBy((x, i) => Math.floor(i / 3))
            .map(x =>
                D.CommandMenuHTML({
                    type: "ButtonLine",
                    contents: x,
                    buttonStyles: {
                        width: "30%",
                        fontSize: "12px",
                        color: C.COLORS.black,
                        bgColor: C.COLORS.brightblue,
                        buttonTransform: "none"
                    }
                })
            )
            .value()
            .join("");
        const namedSitesCode = _.chain(namedSites)
            .map(x => ({name: STATE.REF.customLocs[x].shortName || x, command: `!reply site@${x}`}))
            .groupBy((x, i) => Math.floor(i / 2))
            .map(x =>
                D.CommandMenuHTML({
                    type: "ButtonLine",
                    contents: x,
                    buttonStyles: {
                        width: "45%",
                        fontSize: "12px",
                        color: C.COLORS.black,
                        bgColor: C.COLORS.brightgold,
                        buttonTransform: "none"
                    }
                })
            )
            .value()
            .join("");
        // DB({distSitesCode: JSON.stringify(_.escape(distSitesCode))}, "getSiteMenuCode")
        return (isSecondSite ? MENUHTML.SiteMenuSecond : MENUHTML.SiteMenuFirst)
            .replace(new RegExp("~~~districtname~~~", "gui"), districtName)
            .replace(new RegExp("~~~favsitescode~~~", "gui"), favSitesCode)
            .replace(new RegExp("~~~namedsitescode~~~", "gui"), namedSitesCode)
            .replace(new RegExp("~~~distsitescode~~~", "gui"), distSitesCode);
    };
    const isLocCentered = () => {
        const activeLocs = Object.keys(STATE.REF.curLocation).filter(x => x !== "subLocs" && STATE.REF.curLocation[x][0] !== "blank");
        if (activeLocs.includes("DistrictCenter") && !activeLocs.includes("SiteLeft") && !activeLocs.includes("SiteRight")) return true;
        if (
            activeLocs.includes("DistrictLeft") ||
            activeLocs.includes("DistrictRight") ||
            activeLocs.includes("SiteLeft") ||
            activeLocs.includes("SiteRight")
        )
            return false;
        return null;
    };
    const getAllLocations = (isIncludingSubLocs = true) =>
        D.KeyMapObj(
            _.omit(
                D.Clone(STATE.REF.curLocation),
                (v, k) => (k === "subLocs" && (!isIncludingSubLocs || _.all(_.values(v), x => x === "blank"))) || v[0] === "blank"
            ),
            undefined,
            (v, k) => (k === "subLocs" && _.reject(v, "blank")) || _.flatten([v]).shift()
        );
    const getActiveLocations = (focusOverride, isIncludingSubLocs = true) => {
        const activeLocs = getAllLocations(isIncludingSubLocs);
        focusOverride = focusOverride || STATE.REF.sceneFocus;
        if (VAL({string: focusOverride}))
            switch ({c: "Center", l: "Left", r: "Right", a: "All"}[focusOverride.toLowerCase().charAt(0)]) {
                case "Center": {
                    return _.pick(activeLocs, (v, k) => k.endsWith("Center"));
                    // if (Object.keys(activeLocs).some(x => x.endsWith("Center")))
                    // return _.omit(activeLocs, (v, k) => !k.endsWith("Center"));
                }
                // falls through
                case "Left":
                    return _.omit(activeLocs, (v, k) => k.endsWith("Right"));
                case "Right":
                    return _.omit(activeLocs, (v, k) => k.endsWith("Left"));
                default:
                    return activeLocs;
            }
        return {};
    };
    const getActivePositions = focusOverride => Object.keys(getActiveLocations(focusOverride, false));
    const getActiveDistrict = () => {
        const [activePos] = getActivePositions().filter(x => x.includes("District"));
        return (activePos && STATE.REF.curLocation[activePos] && STATE.REF.curLocation[activePos][0]) || false;
    };
    const getActiveSite = (isReturningSiteName = false) => {
        const [activePos] = getActivePositions().filter(x => x.startsWith("Site"));
        return (
            (activePos &&
                STATE.REF.curLocation[activePos] &&
                ((isReturningSiteName && STATE.REF.curLocation[activePos]) || STATE.REF.curLocation[activePos][0])) ||
            false
        );
    };
    const getPosOfLocation = locRef => _.findKey(getAllLocations(false), v => v && locRef && D.LCase(v) === D.LCase(locRef));
    const getSubLocs = () => {};
    const isOutside = () => {
        const sceneLocs = _.compact(getActivePositions().map(x => STATE.REF.curLocation[x][0]));
        // D.Poke(D.JS(sceneLocs))
        return sceneLocs.filter(x => !C.LOCATIONS[x].outside).length === 0;
    };
    const setDistrictImg = (locRef, distRef) => {
        const locKey = D.LCase(locRef).charAt(0);
        const locPos = {c: "DistrictCenter", l: "DistrictLeft", r: "DistrictRight"}[locKey];
        DB({locRef, distRef, locKey, locPos}, "setDistrictImg");
        if (!distRef || distRef === "blank") {
            Media.ToggleImg(locPos, false);
        } else {
            Media.ToggleImg(locPos, true);
            Media.SetImg(locPos, distRef);
        }
    };
    const setSiteImg = (locRef, siteRef, siteName) => {
        const locKey = D.LCase(locRef).charAt(0);
        const locPos = {c: "SiteCenter", l: "SiteLeft", r: "SiteRight"}[locKey];
        DB({locRef, siteRef, siteName, locKey, locPos}, "setSiteImg");
        Media.ToggleText(`SiteGeneric${locPos.replace(/Site/gu, "")}Song`, false);
        Media.ToggleText(`SiteGeneric${locPos.replace(/Site/gu, "")}Res`, false);
        Media.ToggleText(`SiteGeneric${locPos.replace(/Site/gu, "")}Aspect`, false);
        if (!siteRef || siteRef === "blank") {
            Media.ToggleImg(locPos, false);
            Media.ToggleImg(`SiteBar${locPos.replace(/Site/gu, "")}`, false);
            Media.ToggleText(`SiteName${locPos.replace(/Site/gu, "")}`, false);
            Media.ToggleText(`SiteGeneric${locPos.replace(/Site/gu, "")}Res`, false);
            Media.ToggleText(`SiteGeneric${locPos.replace(/Site/gu, "")}Song`, false);
            Media.ToggleText(`SiteGeneric${locPos.replace(/Site/gu, "")}Aspect`, false);
        } else {
            Media.ToggleImg(locPos, true);
            Media.SetImg(locPos, siteRef);
            setSiteName(locKey, siteRef, siteName);
        }
    };
    const setSiteName = (locRef, siteRef, siteName) => {
        siteName = siteName === "same" && siteRef in STATE.REF.locationDetails ? STATE.REF.locationDetails[siteRef].siteName : siteName;
        const locKey = D.LCase(locRef).charAt(0);
        const locPos = {c: "Center", l: "Left", r: "Right"}[locKey];
        DB({locRef, siteRef, siteName, locKey, locPos}, "setSiteName");
        if (VAL({string: siteName})) {
            Media.ToggleImg(`SiteBar${locPos}`, true);
            Media.ToggleText(`SiteName${locPos}`, true);
            Media.SetText(`SiteName${locPos}`, siteName);
            if (siteRef === "GENERIC") {
                const siteData = STATE.REF.customLocs[siteName];
                if (siteData) {
                    if (siteData.res) {
                        Media.ToggleText(`SiteGeneric${locPos}Res`, true);
                        Media.SetText(`SiteGeneric${locPos}Res`, siteData.res);
                    } else {
                        Media.ToggleText(`SiteGeneric${locPos}Res`, false);
                    }
                    if (siteData.song) {
                        Media.ToggleText(`SiteGeneric${locPos}Song`, true);
                        Media.SetText(`SiteGeneric${locPos}Song`, siteData.song);
                    } else {
                        Media.ToggleText(`SiteGeneric${locPos}Song`, false);
                    }
                    if (siteData.aspect) {
                        Media.ToggleText(`SiteGeneric${locPos}Aspect`, true);
                        Media.SetText(`SiteGeneric${locPos}Aspect`, siteData.aspect);
                    } else {
                        Media.ToggleText(`SiteGeneric${locPos}Aspect`, false);
                    }
                }
            } else {
                Media.ToggleText(`SiteGeneric${locPos}Res`, false);
                Media.ToggleText(`SiteGeneric${locPos}Song`, false);
                Media.ToggleText(`SiteGeneric${locPos}Aspect`, false);
            }
        } else {
            Media.ToggleImg(`SiteBar${locPos}`, false);
            Media.ToggleText(`SiteName${locPos}`, false);
            Media.ToggleText(`SiteGeneric${locPos}Res`, false);
            Media.ToggleText(`SiteGeneric${locPos}Song`, false);
            Media.ToggleText(`SiteGeneric${locPos}Aspect`, false);
        }
    };
    const setGenericSiteDetails = (siteRes, siteSong, siteAspect) => {
        const [siteRef, siteName] = getActiveSite(true);
        const [locRef] = getActivePositions()
            .filter(x => x.includes("Site"))
            .map(x => x.replace(/Site/gu, ""));
        const siteData = STATE.REF.customLocs[siteName];
        DB({siteData, activePositions: getActivePositions(), locRef, siteRef, siteName}, "setGenericSiteDetails");
        if (
            !siteData ||
            getActivePositions().length !== 2 ||
            !locRef ||
            !siteRef ||
            !siteName ||
            siteRef !== "GENERIC" ||
            !["Left", "Right", "Center"].includes(locRef)
        ) {
            D.Alert("The ACTIVE Site must be GENERIC with a CUSTOM NAME set and STORED in STATE.REF.customLocs.", "setGenericSiteDetails");
        } else {
            STATE.REF.customLocs[siteName].res = siteRes ? D.Capitalize(siteRes).replace(/([+-])$/gu, " $1") : siteData.res;
            STATE.REF.customLocs[siteName].song = siteSong ? D.Capitalize(siteSong, true) : siteData.song;
            STATE.REF.customLocs[siteName].aspect = siteAspect || siteData.aspect;
            setSiteName(locRef, "GENERIC", siteName);
        }
    };
    const setSubLocImg = (locRef, subLocRef) => {
        if (locRef in BLANKLOCRECORD.subLocs)
            if (!subLocRef || subLocRef === "blank") {
                Media.ToggleImg(`SubLoc${locRef}`, false);
            } else {
                Media.ToggleImg(`SubLoc${locRef}`, true);
                Media.SetImg(`SubLoc${locRef}`, subLocRef);
            }
    };
    const setLocation = (locParams, sceneFocus, isForcing = false) => {
        const newLocData = Object.assign(
            {},
            _.omit(BLANKLOCRECORD, "subLocs"),
            locParams,
            _.omit(STATE.REF.curLocation, (v, k) => ["subLocs", "pointerPos", ...Object.keys(locParams)].includes(k))
        );
        const curLocData = Object.assign({}, BLANKLOCRECORD, STATE.REF.curLocation);
        const reportStrings = [`Loc Params: ${D.JS(locParams)}`, `New Loc Data: ${D.JS(newLocData)}`, `Cur Loc Data: ${D.JS(curLocData)}`];
        // FIRST: Convert curLocData to what is actually shown in the sandbox --- i.e. if Left & Right districts are the same, it's actually DistrictCenter that is displayed.
        if (curLocData.DistrictLeft[0] !== "blank" && curLocData.DistrictLeft[0] === curLocData.DistrictRight[0]) {
            curLocData.DistrictCenter = [...curLocData.DistrictLeft];
            curLocData.DistrictLeft = ["blank"];
            curLocData.DistrictRight = ["blank"];
        }

        // SECOND: Set sides OR center to blank, depending on which district(s) are being set.
        if ("DistrictCenter" in locParams && !locParams.DistrictCenter.includes("blank")) {
            newLocData.DistrictLeft = ["blank"];
            newLocData.DistrictRight = ["blank"];
            newLocData.SiteLeft = ["blank"];
            newLocData.SiteRight = ["blank"];
            sceneFocus = "c";
        } else if (
            ("DistrictLeft" in locParams && !locParams.DistrictLeft.includes("blank")) ||
            ("DistrictRight" in locParams && !locParams.DistrictRight.includes("blank"))
        ) {
            newLocData.DistrictCenter = ["blank"];
            newLocData.SiteCenter = ["blank"];
            sceneFocus = sceneFocus || "l";
        }

        // THIRD: If SiteCenter is blank, then blank all of the sub-locations.
        if (newLocData.SiteCenter[0] === "blank") newLocData.subLocs = _.clone(BLANKLOCRECORD.subLocs);

        // FOURTH: Check site settings against custom locations to fill in any blanks, then set any necessary data in custom locations.
        reportStrings.push(
            `Filtered Site List: ${D.JS(_.omit(newLocData, (v, k) => k === "subLocs" || k.includes("District") || (v && v[0] === "blank")))}`
        );
        for (const [sitePos, siteData] of Object.entries(
            _.omit(newLocData, (v, k) => k === "subLocs" || k.includes("District") || (v && v[0] === "blank"))
        )) {
            // Only interested in non-blank sites; We'll deal with sub-locations afterwards.
            const [siteRef, siteName] = siteData;
            const customLocRef =
                (siteName in STATE.REF.customLocs && STATE.REF.customLocs[siteName]) ||
                (siteRef in STATE.REF.customLocs && STATE.REF.customLocs[siteRef]) ||
                false;
            if (sitePos === "SiteCenter")
                newLocData.subLocs = Object.assign(
                    {},
                    BLANKLOCRECORD.subLocs,
                    (customLocRef && customLocRef.subLocs) || {},
                    newLocData.subLocs || {}
                );
            else newLocData.subLocs = Object.assign({}, BLANKLOCRECORD.subLocs);
            reportStrings.push(`... SitePos: ${sitePos}, SiteData: ${D.JS(siteData)}, SubLocs: ${D.JS(newLocData.subLocs)}`);

            if (siteName) {
                STATE.REF.customLocs[siteName] = STATE.REF.customLocs[siteName] || {};
                STATE.REF.customLocs[siteName].district =
                    STATE.REF.customLocs[siteName].district || newLocData[sitePos.replace(/Site/gu, "District")][0];
                STATE.REF.customLocs[siteName].site = siteRef;
                STATE.REF.customLocs[siteName].siteName = siteName;
            }
            if (sitePos === "SiteCenter" && Object.values(newLocData.subLocs || {}).some(x => x !== "blank"))
                if (customLocRef) customLocRef.subLocs = D.Clone(newLocData.subLocs);
                else if (siteName) STATE.REF.customLocs[siteName].subLocs = D.Clone(newLocData.subLocs);
                else
                    STATE.REF.customLocs[siteRef] = {
                        district: newLocData[sitePos.replace(/Site/gu, "District")],
                        site: siteRef,
                        subLocs: D.Clone(newLocData.subLocs)
                    };
        }

        // FINALLY: Set the current location in STATE to the new location record, and record it in the location record for the active Mode.
        STATE.REF.curLocation = D.Clone(newLocData);
        STATE.REF.locationRecord[Session.Mode] = D.Clone(newLocData);

        // NOW MOVING ON TO SIMPLY DISPLAYING THE CORRECT CARDS:

        // FIRST, if left & right districts are equal, display that district in the center frame:
        if (newLocData.DistrictLeft[0] !== "blank" && _.isEqual(newLocData.DistrictLeft, newLocData.DistrictRight)) {
            newLocData.DistrictCenter = [..._.flatten([newLocData.DistrictLeft])];
            newLocData.DistrictLeft = ["blank"];
            newLocData.DistrictRight = ["blank"];
        }

        // SECOND, extract only the changing cards to be displayed:
        const locDataDelta = _.pick(
            newLocData,
            Object.keys(newLocData).filter(x => x !== "subLocs" && (isForcing || !_.isEqual(newLocData[x], curLocData[x])))
        );
        for (const [subLocPos, subLocName] of Object.entries(newLocData.subLocs || {}))
            if (isForcing || !curLocData.subLocs || curLocData.subLocs[subLocPos] !== subLocName) locDataDelta[`SubLoc${subLocPos}`] = subLocName;
        reportStrings.push(`Loc Data Delta: ${D.JS(locDataDelta)}`);
        reportStrings.push(`New STATE.REF Record: ${D.JS(STATE.REF.locationRecord[Session.Mode])}`);
        DB(`<h3>Set Location Processing:</h3>${D.JS(reportStrings.join("<br>"))}`, "setLocation");
        for (const [locPos, locData] of Object.entries(locDataDelta)) {
            const locSrc = VAL({string: locData}) ? locData : locData[0];
            if (locPos.includes("Site")) setSiteImg(locPos.replace(/Site/gu, ""), locSrc, locData[1] || false);
            else if (locPos.includes("District")) setDistrictImg(locPos.replace(/District/gu, ""), locSrc);
            else if (locPos.includes("SubLoc")) setSubLocImg(locPos.replace(/SubLoc/gu, ""), locSrc);
        }
        // cleanLocationRegistry()
        setSceneFocus(sceneFocus);
    };
    const distCommandMenu = () => {
        DB({["Into District PENDINGLOCCOMMAND:"]: PENDINGLOCCOMMAND}, "distCommandMenu");
        PENDINGLOCCOMMAND.workingIndex = PENDINGLOCCOMMAND.Districts.length;
        D.CommandMenu((PENDINGLOCCOMMAND.workingIndex === 1 && MENUHTML.DistrictMenuSecond) || MENUHTML.DistrictMenuFirst, commandString => {
            if (commandString === "reset") {
                PENDINGLOCCOMMAND = D.Clone(BLANKPENDINGLOCCOMMAND);
                Media.Notify("panel", "● Resetting pending location data.");
                distCommandMenu();
            } else {
                const cmdIndex = PENDINGLOCCOMMAND.workingIndex;
                const curLocations = getAllLocations();
                switch (commandString) {
                    case "match": {
                        if (cmdIndex === 1) {
                            commandString = PENDINGLOCCOMMAND.Districts[0][0];
                            Media.Notify("panel", `● Setting District RIGHT to MATCH: "${commandString}"`);
                            break;
                        }
                        Media.Notify("panel", "● No District to Match (Assuming 'CENTER')...");
                    }
                    // falls through
                    case "center": {
                        commandString = curLocations.DistrictCenter || curLocations.DistrictLeft || curLocations.DistrictRight;
                        Media.Notify("panel", `● Setting District${cmdIndex === 1 ? " RIGHT" : " (First)"} to "SAME CENTER": "${commandString}"`);
                        break;
                    }
                    case "left": {
                        commandString = curLocations.DistrictLeft || curLocations.DistrictCenter || curLocations.DistrictRight;
                        Media.Notify("panel", `● Setting District${cmdIndex === 1 ? " RIGHT" : " (First)"} to "SAME LEFT": "${commandString}"`);
                        break;
                    }
                    case "right": {
                        commandString = curLocations.DistrictRight || curLocations.DistrictCenter || curLocations.DistrictLeft;
                        Media.Notify("panel", `● Setting District${cmdIndex === 1 ? " RIGHT" : " (First)"} to "SAME RIGHT": "${commandString}"`);
                        break;
                    }
                    // no default
                }
                PENDINGLOCCOMMAND.Districts[cmdIndex] = [commandString];
                Media.Notify("panel", `● District${cmdIndex === 1 ? " RIGHT" : " (First)"} set: "${D.UCase(commandString)}"`);
                if (commandString === "blank") {
                    PENDINGLOCCOMMAND.Sites[cmdIndex] = ["blank"];
                    if (cmdIndex === 0) {
                        PENDINGLOCCOMMAND.Districts[1] = ["blank"];
                        PENDINGLOCCOMMAND.Sites[1] = ["blank"];
                    }
                    processPendingLocCommand();
                    Media.Notify("panel", "● FINISHED! Setting Location Cards...");
                } else {
                    siteCommandMenu();
                }
            }
        });
    };
    const siteCommandMenu = () => {
        DB({["Into Site PENDINGLOCCOMMAND"]: PENDINGLOCCOMMAND}, "siteCommandMenu");
        const siteMenuCode = getSiteMenuCode(PENDINGLOCCOMMAND.Districts[PENDINGLOCCOMMAND.workingIndex], PENDINGLOCCOMMAND.workingIndex === 1);
        DB({siteMenuCode: JSON.stringify(siteMenuCode)}, "siteCommandMenu");
        D.CommandMenu(siteMenuCode, commandString => {
            const params = D.ParseToObj(commandString, "|", "@");
            const cmdIndex = PENDINGLOCCOMMAND.workingIndex;
            for (const [command, value] of Object.entries(params))
                switch (command) {
                    case "reset": {
                        PENDINGLOCCOMMAND = D.Clone(BLANKPENDINGLOCCOMMAND);
                        Media.Notify("panel", "● Resetting pending location data.");
                        distCommandMenu();
                        return false;
                    }
                    case "done": {
                        processPendingLocCommand();
                        Media.Notify("panel", "● FINISHED! Setting Location Cards...");
                        return false;
                    }
                    case "name": {
                        if (VAL({array: PENDINGLOCCOMMAND.Sites[cmdIndex]})) {
                            PENDINGLOCCOMMAND.Sites[cmdIndex][1] = value;
                            Media.Notify("panel", `● Site${cmdIndex === 1 ? " RIGHT" : " (First)"} Renamed to: "${value}"`);
                        } else {
                            Media.Notify("panel", "● Choose a Site before renaming!");
                        }
                        break;
                    }
                    case "focus": {
                        STATE.REF.sceneFocus = D.LCase(value.charAt(0));
                        Media.Notify("panel", `● Scene Focus switched to: ${D.Capitalize(value)}`);
                        break;
                    }
                    case "site": {
                        const curLocations = _.pick(STATE.REF.curLocation, (v, k) => k.startsWith("Site") && v[0] !== "blank");
                        switch (value) {
                            case "blank": {
                                PENDINGLOCCOMMAND.Sites[cmdIndex] = ["blank"];
                                Media.Notify("panel", `● Blanking Site${cmdIndex === 1 ? " RIGHT" : " (First)"}.`);
                                break;
                            }
                            case "center": {
                                PENDINGLOCCOMMAND.Sites[cmdIndex] = curLocations.SiteCenter || curLocations.SiteLeft || curLocations.SiteRight;
                                Media.Notify(
                                    "panel",
                                    `● Setting Site${cmdIndex === 1 ? " RIGHT" : " (First)"} to "SAME CENTER": "${PENDINGLOCCOMMAND.Sites[cmdIndex]}"`
                                );
                                break;
                            }
                            case "left": {
                                PENDINGLOCCOMMAND.Sites[cmdIndex] = curLocations.SiteLeft || curLocations.SiteCenter || curLocations.SiteRight;
                                Media.Notify(
                                    "panel",
                                    `● Setting Site${cmdIndex === 1 ? " RIGHT" : " (First)"} to "SAME LEFT": "${PENDINGLOCCOMMAND.Sites[cmdIndex]}"`
                                );
                                break;
                            }
                            case "right": {
                                PENDINGLOCCOMMAND.Sites[cmdIndex] = curLocations.SiteRight || curLocations.SiteCenter || curLocations.SiteLeft;
                                Media.Notify(
                                    "panel",
                                    `● Setting Site${cmdIndex === 1 ? " RIGHT" : " (First)"} to "SAME RIGHT": "${PENDINGLOCCOMMAND.Sites[cmdIndex]}"`
                                );
                                break;
                            }
                            default: {
                                DB(
                                    {
                                        params,
                                        isString: VAL({string: params.site}),
                                        ["Test One"]: !(params.site in C.SITES) && params.site in STATE.REF.customLocs,
                                        ["Test Two"]: params.site in STATE.REF.customLocs && STATE.REF.customLocs[params.site].siteName,
                                        ["Test Three"]: params.site in C.SITES
                                    },
                                    "siteCommandMenu"
                                );
                                if (VAL({string: params.site}))
                                    if (!(params.site in C.SITES) && params.site in STATE.REF.customLocs)
                                        params.site = [STATE.REF.customLocs[params.site].site, params.site];
                                    else if (params.site in STATE.REF.customLocs && STATE.REF.customLocs[params.site].siteName)
                                        params.site = [params.site, STATE.REF.customLocs[params.site].siteName];
                                    else params.site = [params.site];
                                PENDINGLOCCOMMAND.Sites[cmdIndex] = params.site;
                                Media.Notify(
                                    "panel",
                                    `● Site${cmdIndex === 1 ? " RIGHT" : " (First)"} set: "${D.UCase(params.site[1] || params.site[0])}"`
                                );
                                break;
                            }
                        }
                        break;
                    }
                    case "call": {
                        switch (params.call) {
                            case "district":
                                distCommandMenu();
                                break;
                            case "site":
                                siteCommandMenu();
                                break;
                            case "sublocs":
                                subLocCommandMenu();
                                break;
                            // no default
                        }
                        return false;
                    }
                    // no default
                }
            DB({[`PENDINGLOCCOMMAND After "!reply ${D.JSL(commandString)}":`]: PENDINGLOCCOMMAND}, "siteCommandMenu");
            return C.REPLY.KEEPOPEN;
        });
    };
    const subLocCommandMenu = () => {
        const [siteName] = PENDINGLOCCOMMAND.Sites[PENDINGLOCCOMMAND.workingIndex];
        const genericSubLocs = ["blank"];
        const siteSubLocs = Object.keys(Media.IMAGES.SubLocTopLeft_1.srcs)
            .filter(x => x.startsWith(siteName))
            .sort();
        const anySubLocs = Object.keys(Media.IMAGES.SubLocTopLeft_1.srcs)
            .filter(x => !x.includes("_"))
            .sort();
        const subLocPanels = {};
        for (const subLocRef of Object.keys(BLANKLOCRECORD.subLocs))
            subLocPanels[subLocRef] = {
                rows: [
                    {type: "Header", contents: subLocRef},
                    ..._.compact([
                        ..._.chain(genericSubLocs)
                            .map(x => ({name: x, command: `!reply ${subLocRef}@${x}`}))
                            .groupBy((x, i) => Math.floor(i / 2))
                            .map(x => ({
                                type: "ButtonLine",
                                contents: x,
                                buttonStyles: {width: "49%", fontSize: "10px", bgColor: C.COLORS.midgold, buttonTransform: "none"}
                            }))
                            .value(),
                        ..._.chain(siteSubLocs)
                            .map(x => ({name: x.replace(/[^_]+_/gu, ""), command: `!reply ${subLocRef}@${x}`}))
                            .groupBy((x, i) => Math.floor(i / 2))
                            .map(x => ({
                                type: "ButtonLine",
                                contents: x,
                                buttonStyles: {width: "49%", fontSize: "10px", bgColor: C.COLORS.purple, buttonTransform: "none"}
                            }))
                            .value(),
                        ..._.chain(anySubLocs)
                            .map(x => ({name: x, command: `!reply ${subLocRef}@${x}`}))
                            .groupBy((x, i) => Math.floor(i / 2))
                            .map(x => ({
                                type: "ButtonLine",
                                contents: x,
                                buttonStyles: {
                                    width: "49%",
                                    fontSize: "10px",
                                    color: C.COLORS.black,
                                    bgColor: C.COLORS.brightblue,
                                    buttonTransform: "none"
                                }
                            }))
                            .value()
                    ])
                ]
            };

        D.CommandMenu(
            {
                title: `SubLocations for ${siteName || "?"}`,
                rows: [
                    {
                        type: "Column",
                        contents: [subLocPanels.TopLeft, subLocPanels.TopRight],
                        style: {width: "47%", margin: "0px 1% 0% 1%"}
                    },
                    {type: "Column", contents: [subLocPanels.Left, subLocPanels.Right], style: {width: "47%", margin: "0px 1% 0% 1%"}},
                    {
                        type: "Column",
                        contents: [subLocPanels.BotLeft, subLocPanels.BotRight],
                        style: {width: "47%", margin: "0px 1% 0% 1%"}
                    },
                    ..._.chain({
                        ["FINISHED!"]: ["!reply done", {}],
                        ["RESET"]: ["!reply reset", {bgColor: C.COLORS.brightred, color: C.COLORS.white}]
                    })
                        .mapObject((v, k) => (v ? {name: k, command: v[0], styles: v[1]} : 0))
                        .values()
                        .groupBy((x, i) => Math.floor(i / 3))
                        .map(x => ({
                            type: "ButtonLine",
                            contents: x,
                            buttonStyles: {
                                width: "47%",
                                buttonHeight: "18px",
                                fontSize: "14px",
                                fontWeight: "bold",
                                color: C.COLORS.black,
                                bgColor: C.COLORS.puregreen
                            }
                        }))
                        .value()
                ]
            },
            commandString => {
                const params = D.ParseToObj(commandString, "|", "@");
                DB({params}, "subLocCommandMenu");
                if (commandString.includes("reset")) {
                    PENDINGLOCCOMMAND = D.Clone(BLANKPENDINGLOCCOMMAND);
                    Media.Notify("panel", "● Resetting pending location data.");
                    distCommandMenu();
                    return false;
                }
                PENDINGLOCCOMMAND.subLocs = PENDINGLOCCOMMAND.subLocs || {};
                if ("done" in params) {
                    processPendingLocCommand();
                    Media.Notify("panel", "● FINISHED! Setting Location Cards...");
                    return false;
                } else {
                    for (const [locRef, subLocRef] of Object.entries(params))
                        if (locRef in BLANKLOCRECORD.subLocs) {
                            PENDINGLOCCOMMAND.subLocs[locRef] = subLocRef;
                            Media.Notify(
                                "panel",
                                `● Sub-Location ${locRef} at ${PENDINGLOCCOMMAND.Sites[PENDINGLOCCOMMAND.workingIndex][0]} set: "${subLocRef}"`
                            );
                        }
                    return C.REPLY.KEEPOPEN;
                }
            }
        );
    };
    const processPendingLocCommand = () => {
        const locParams = {};
        switch (PENDINGLOCCOMMAND.workingIndex) {
            case 0: {
                [locParams.DistrictCenter] = PENDINGLOCCOMMAND.Districts;
                [locParams.SiteCenter] = PENDINGLOCCOMMAND.Sites;
                if ("subLocs" in PENDINGLOCCOMMAND) locParams.subLocs = D.Clone(PENDINGLOCCOMMAND.subLocs);
                break;
            }
            case 1: {
                [locParams.DistrictLeft, locParams.DistrictRight] = PENDINGLOCCOMMAND.Districts;
                [locParams.SiteLeft, locParams.SiteRight] = PENDINGLOCCOMMAND.Sites;
                break;
            }
            // no default
        }
        setLocation(locParams);
        PENDINGLOCCOMMAND = D.Clone(BLANKPENDINGLOCCOMMAND);
    };
    const sceneFocusCommandMenu = () => {
        D.CommandMenu(
            {
                rows: _.compact([
                    {type: "Header", contents: `Current Focus: ${{c: "Center", l: "Left", r: "Right"}[STATE.REF.sceneFocus]}`},
                    ..._.chain({
                        ["<<< Left"]: ["!reply focus@left", {bgColor: (STATE.REF.sceneFocus === "l" && C.COLORS.gold) || C.COLORS.grey}],
                        [">> Both <<"]: ["!reply focus@center", {bgColor: (STATE.REF.sceneFocus === "c" && C.COLORS.gold) || C.COLORS.grey}],
                        ["Right >>>"]: ["!reply focus@right", {bgColor: (STATE.REF.sceneFocus === "r" && C.COLORS.gold) || C.COLORS.grey}]
                    })
                        .mapObject((v, k) => (v ? {name: k, command: v[0], styles: v[1]} : 0))
                        .values()
                        .groupBy((x, i) => Math.floor(i / 3))
                        .map(x => ({
                            type: "ButtonLine",
                            contents: x,
                            buttonStyles: {
                                width: "30%",
                                fontSize: "12px",
                                bgColor: C.COLORS.palepurple,
                                color: C.COLORS.black,
                                fontWeight: "bold"
                            }
                        }))
                        .value()
                ])
            },
            commandString => {
                const params = D.ParseToObj(commandString, "|", "@");
                if ("focus" in params) setSceneFocus(params.focus);
            }
        );
    };
    const setModeLocations = (mode, isForcing = false) => {
        setLocation(STATE.REF.locationRecord[mode], STATE.REF.sceneFocusRecord[mode], isForcing);
    };
    const getCharsInLocation = locPos => {
        const charObjs = [];
        for (const loc of getActivePositions(locPos)) charObjs.push(...Media.GetContainedChars(loc, {padding: 50}));
        return _.uniq(charObjs);
    };
    const isInScene = charRef => {
        const activeLocs = getActivePositions();
        const [charToken] = Media.GetTokens(charRef);
        const dbObj = {activeLocs, charToken, checks: {}};
        for (const loc of activeLocs) {
            dbObj.checks[loc] = Media.IsInside(loc, charToken, 0);
            if (Media.IsInside(loc, charToken, 0)) {
                dbObj.returning = true;
                DB(dbObj, "isInScene");
                return true;
            }
        }
        dbObj.returning = false;
        DB(dbObj, "isInScene");
        return false;
    };
    const isInLocation = (charRef, locRef) => {
        const posRef = getPosOfLocation(locRef);
        const [charToken] = Media.GetTokens(charRef);
        if (VAL({string: posRef, token: charToken})) {
            if (Media.IsInside(posRef, charToken, 0)) return true;
            if (posRef.startsWith("Site")) return Media.IsInside(posRef.replace(/Site/gu, "District"), charToken, 0);
        }
        return false;
    };

    // subLocList = ["blank", ..._.uniq(Object.keys(Media.IMAGES.SubLocTopLeft_1.srcs)).map(x => `${`(${(x.match(/^[^_]*?([A-Z])[^_]*?([A-Z])[^_]*?_/u) || ["", ""]).slice(1).join("")}) `.replace("() ", "")}${x.replace(/.*?_/gu, "")}`)],
    // #endregion

    // #region Macros
    const setMacro = (playerRef, macroName, macroAction, isActivating = false) => {
        const playerID = D.GetPlayerID(playerRef);
        if (playerID) {
            getObj("player", playerID).set({showmacrobar: true});
            let [macroObj] = (findObjs({_type: "macro", _playerid: playerID}) || []).filter(x => D.LCase(x.get("name")) === D.LCase(macroName));
            if (macroObj) macroObj.set("action", macroAction);
            // D.Alert(`Macro Set: ${JSON.stringify(macroObj)}`)
            else macroObj = createObj("macro", {name: macroName, action: macroAction, visibleto: playerID, playerid: D.GMID()});
            // D.Alert(`Macro Created: ${JSON.stringify(macroObj)}`)
            if (isActivating) sendChat("Storyteller", `#${macroName}`);
        } else {
            D.Alert(`Invalid played ID (${D.JS(playerID)}) from playerRef '${D.JS(playerRef)}'`);
        }
    };
    // #endregion

    // #region Waking Up

    // #endregion

    // #region Automatic Remorse Rolls
    const remorseCheck = () => promptRemorseCheck(D.GetChars("registered").filter(x => D.GetStatVal(x, "stains")));
    const promptRemorseCheck = charObjs => {
        if (!charObjs || !charObjs.length) return true;
        const buttons = [];
        for (const charObj of charObjs) buttons.push({name: D.GetName(charObj, true), command: `!roll quick remorse ${charObj.id}`});
        D.CommandMenu({
            title: "Remorse Checks",
            rows: Object.values(_.groupBy(buttons, (v, i) => i % 2)).map(x => ({type: "ButtonLine", contents: x}))
        });
        return false;
    };
    // #endregion

    // #region Session Monologue Suggestion Logging & Assigning
    const submitSpotlightPrompt = (toCharRef, fromCharRef, promptText) => {
        const toCharInit = D.GetCharData(toCharRef).initial;
        STATE.REF.SpotlightPrompts[toCharInit] = _.shuffle([
            ...(STATE.REF.SpotlightPrompts[toCharInit] || []),
            {
                prompt: D.JS(promptText),
                author: D.GetCharData(fromCharRef).initial,
                id: D.RandomString(10)
            }
        ]);
        D.Chat(
            fromCharRef,
            C.HTML.Block(
                [
                    C.HTML.Header(`Prompt Submitted for ${D.GetName(toCharInit)}:`, C.STYLES.whiteMarble.header),
                    C.HTML.Body(`&quot;${D.JS(promptText)}&quot;`, C.STYLES.whiteMarble.paragraph),
                    C.HTML.Header("Thank You for Your Contribution!", C.STYLES.whiteMarble.header)
                ],
                C.STYLES.whiteMarble.block
            )
        );
        DB({toCharRef, toCharInit, fromCharRef, promptText, STATEREF: D.JS(STATE.REF.SpotlightPrompts[toCharInit])}, "submitSpotlightPrompt");
    };
    const reviewSpotlightPrompts = (charRef, subheaderTextOverride) => {
        const authorInit = D.GetCharData(charRef).initial;
        const promptData = STATE.REF.SpotlightPrompts;
        const chatCode = [];
        for (const [init, prompts] of Object.entries(promptData)) {
            const thesePrompts = prompts.filter(x => x.author === authorInit);
            if (thesePrompts.length) {
                chatCode.push(C.HTML.Header(`... ${D.GetName(init)}`, {textAlign: "left", padding: "0px 0px 0px 10px"}));
                for (const thisPrompt of thesePrompts)
                    chatCode.push(
                        C.HTML.SubBlock(
                            [
                                C.HTML.Column(
                                    C.HTML.Body(thisPrompt.prompt, {
                                        fontSize: "12px",
                                        fontFamily: "Voltaire",
                                        lineHeight: "14px",
                                        textAlign: "left",
                                        padding: "3px",
                                        margin: "0px"
                                    }),
                                    {width: "80%"}
                                ),
                                C.HTML.Column(
                                    C.HTML.Button("Delete", `!prompt delete ${init} ${authorInit} ${thisPrompt.id}`, {
                                        width: "100%",
                                        height: "20px",
                                        margin: "2px 2px 0px -5px",
                                        border: "1px outset rgba(100, 0, 0, 1)",
                                        fontSize: "14px",
                                        lineHeight: "20px",
                                        textShadow: "0px 0px 2px #000 , 0px 0px 2px #000, 0px 0px 2px #000 , 0px 0px 2px #000",
                                        boxShadow: "inset -1px -1px 2px #000 , -1px -1px 2px #000 , 1px 1px 2px #000 , 1px 1px 2px #000"
                                    }),
                                    {width: "20%", vertAlign: "initial"}
                                )
                            ],
                            {border: "none; border-bottom: 1px solid red;"}
                        )
                    );
            }
        }
        if (chatCode.length)
            D.Chat(
                D.GetPlayerID(charRef),
                C.HTML.Block([
                    C.HTML.Title("Session Monologues"),
                    C.HTML.SubHeader(subheaderTextOverride || "You Have Submitted Prompts for ...", {
                        textAlign: "left",
                        padding: "0px 0px 0px 2px",
                        lineHeight: "22px"
                    }),
                    ...chatCode
                ])
            );
        else
            D.Chat(
                D.GetPlayerID(charRef),
                C.HTML.Block([
                    C.HTML.Title("Session Monologues"),
                    C.HTML.SubHeader(subheaderTextOverride || "Your Spotlight Prompts Have All<br>Been Assigned to Their Players!", {
                        height: "40px",
                        lineHeight: "20px",
                        textAlign: "center"
                    }),
                    C.HTML.Body("(Why not submit some more?)", {
                        fontSize: "12px",
                        fontFamily: "Voltaire",
                        lineHeight: "14px",
                        textAlign: "center",
                        padding: "3px",
                        margin: "0px"
                    })
                ])
            );
    };
    const assignSpotlightPrompt = (charRef, isSilent = false) => {
        const {initial, quadrant, spotlightPrompt} = D.GetCharData(charRef);
        DB({initial, quadrant, spotlightPrompt}, "assignSpotlightPrompt");
        if (Session.IsSessionActive || TimeTracker.ArePromptsOpen()) {
            if (spotlightPrompt && (spotlightPrompt.author || isSilent)) {
                if (!isSilent)
                    D.Chat(
                        charRef,
                        C.HTML.Block([
                            C.HTML.Header(`Your Prompt for Session ${D.NumToText(STATE.REF.SessionNum, true)} Is:`),
                            C.HTML.Body(spotlightPrompt.prompt, {
                                fontSize: "12px",
                                fontFamily: "Voltaire",
                                lineHeight: "14px",
                                textAlign: "left",
                                padding: "3px",
                                margin: "0px"
                            })
                        ])
                    );
                DB({step: "Prompt Exists, Returning it", spotlightPrompt}, "assignSpotlightPrompt");
                return spotlightPrompt;
            } else {
                let promptData;
                if (STATE.REF.SpotlightPrompts[initial].length) {
                    if (_.any(STATE.REF.SpotlightPrompts[initial], v => v.author === initial)) {
                        promptData = D.PullOut(STATE.REF.SpotlightPrompts[initial], v => v.author === initial);
                        promptData.isAwardingXP = false;
                        delete promptData.author;
                        DB({step: "Assigning Self-Prompt", promptData}, "assignSpotlightPrompt");
                    } else {
                        promptData = D.PullOut(STATE.REF.SpotlightPrompts[initial], v => !STATE.REF.PromptAuthors.includes(v.author));
                        if (promptData) {
                            promptData.isAwardingXP = true;
                            STATE.REF.PromptAuthors.push(promptData.author);
                            DB(
                                {step: "Assigning XP-Valid Authored Prompt", promptData, promptAuthors: D.JS(STATE.REF.PromptAuthors)},
                                "assignSpotlightPrompt"
                            );
                        } else {
                            promptData = STATE.REF.SpotlightPrompts[initial].pop();
                            promptData.isAwardingXP = false;
                            DB(
                                {step: "Assigning NON-XP Authored Prompt", promptData, promptAuthors: D.JS(STATE.REF.PromptAuthors)},
                                "assignSpotlightPrompt"
                            );
                        }
                    }
                } else if (STATE.REF.isPromptingGeneric) {
                    promptData = {prompt: _.sample(C.SPOTLIGHTPROMPTS), author: false, isAwardingXP: false};
                    DB({step: "Assigning GENERIC Prompt (No Submitted Prompts)", promptData}, "assignSpotlightPrompt");
                    if (!isSilent)
                        D.Chat(
                            charRef,
                            C.HTML.Block([
                                C.HTML.Header(`Your Prompt for Session ${D.NumToText(STATE.REF.SessionNum, true)} Is:`),
                                C.HTML.Body(spotlightPrompt.prompt, {
                                    fontSize: "12px",
                                    fontFamily: "Voltaire",
                                    lineHeight: "14px",
                                    textAlign: "left",
                                    padding: "3px",
                                    margin: "0px"
                                })
                            ])
                        );
                    isSilent = true;
                }
                if (promptData) {
                    D.SetCharData(charRef, "spotlightPrompt", promptData);
                    DB({step: "Prompt Assigned. Recurring...", charData: D.JS(D.GetCharData(charRef))}, "assignSpotlightPrompt");
                    return assignSpotlightPrompt(charRef, isSilent);
                } else if (!isSilent) {
                    D.Chat(
                        charRef,
                        C.HTML.Block([
                            C.HTML.Header("No Prompts Available"),
                            C.HTML.Body(
                                "Sorry, there are no prompts logged to your character. Consider requesting one in Discord, and trying back later.",
                                {
                                    fontSize: "12px",
                                    fontFamily: "Voltaire",
                                    lineHeight: "14px",
                                    padding: "3px",
                                    margin: "0px"
                                }
                            )
                        ])
                    );
                }
            }
        } else if (!isSilent) {
            const promptsOpenData = TimeTracker.GetPromptsOpenDate();
            const timeElements = [];
            if (promptsOpenData.delta.days) timeElements.push(`${promptsOpenData.delta.days} days`);
            if (promptsOpenData.delta.hours) timeElements.push(`${promptsOpenData.delta.hours} hours`);
            if (promptsOpenData.delta.mins) timeElements.push(`${promptsOpenData.delta.mins} minutes`);
            if (timeElements.length >= 2) timeElements[timeElements.length - 1] = `and ${timeElements[timeElements.length - 1]}`;
            const timeString = timeElements.join(", ").replace(/, and/gu, " and");
            D.Chat(
                charRef,
                C.HTML.Block([
                    C.HTML.Header("Spotlight Assignments Closed"),
                    C.HTML.Body("To leave time for players to submit and update their Spotlight Prompts, prompt assignment is closed until:", {
                        fontSize: "12px",
                        fontFamily: "Voltaire",
                        lineHeight: "14px",
                        textAlign: "center",
                        padding: "3px",
                        margin: "0px"
                    }),
                    C.HTML.SubHeader(`${promptsOpenData.date} at ${promptsOpenData.time} EST`),
                    C.HTML.Body(`Please check back in ${timeString}.`, {
                        fontSize: "12px",
                        fontFamily: "Voltaire",
                        lineHeight: "14px",
                        padding: "3px",
                        margin: "0px"
                    })
                ])
            );
        }
        DB(
            {step: "Prompt Assignment FAILED", isSessionActive: Session.IsSessionActive, arePromptsAssignable: TimeTracker.ArePromptsOpen()},
            "assignSpotlightPrompt"
        );
        return false;
    };
    const deleteSpotlightPrompt = (toCharRef, fromCharRef, promptID) => {
        const toCharInit = D.GetCharData(toCharRef).initial;
        const removedPrompt = D.PullOut(Session.SpotlightPrompts[toCharInit], v => v.id === promptID);
        if (removedPrompt) reviewSpotlightPrompts(fromCharRef, "You Now Have Active Prompts for...");
        else
            D.Chat(
                D.GetPlayerID(fromCharRef),
                C.HTML.Block([
                    C.HTML.Title("Session Monologues"),
                    C.HTML.SubHeader("Something's Fucky...", {
                        lineHeight: "22px"
                    }),
                    C.HTML.Body(
                        "No such prompt found to delete!  Now, since I'm the one who programmed that button you just clicked, this is entirely my fault.  Please let me know, so I can unfuck things.",
                        {
                            fontSize: "12px",
                            fontFamily: "Voltaire",
                            lineHeight: "14px",
                            textAlign: "left",
                            padding: "3px",
                            margin: "0px"
                        }
                    )
                ])
            );
    };
    const startSessionMonologue = () => {
        if (STATE.REF.SessionMonologues.length) {
            const thisCharName = STATE.REF.SessionMonologues.pop();
            const spotlightPrompt = assignSpotlightPrompt(thisCharName, true);
            DB({step: "Starting Monologue...", spotlightChar: STATE.REF.spotlightChar, thisCharName, spotlightPrompt}, "startSessionMonologue");
            if (spotlightPrompt)
                setSpotlightChar(
                    thisCharName,
                    C.HTML.Block([
                        C.HTML.Title("VAMPIRE: TORONTO by NIGHT", {fontSize: "28px"}),
                        C.HTML.Title("Session Monologues", {fontSize: "28px", margin: "-10px 0px 0px 0px"}),
                        C.HTML.Header(thisCharName),
                        C.HTML.Body(`&quot;${spotlightPrompt.prompt}&quot;`, {
                            fontFamily: "Voltaire",
                            textAlign: "left",
                            lineHeight: "16px",
                            padding: "3px",
                            fontSize: "14px"
                        }),
                        C.HTML.Header("The Spotlight Is Yours!"),
                        C.HTML.Button("End Scene", `!endmonologue`, {
                            width: "50%",
                            height: "20px",
                            margin: "2px 2px 0px -5px",
                            border: "1px outset rgba(100, 0, 0, 1)",
                            fontSize: "14px",
                            lineHeight: "20px",
                            textShadow: "0px 0px 2px #000 , 0px 0px 2px #000, 0px 0px 2px #000 , 0px 0px 2px #000",
                            boxShadow: "inset -1px -1px 2px #000 , -1px -1px 2px #000 , 1px 1px 2px #000 , 1px 1px 2px #000"
                        })
                    ])
                );
            else
                setSpotlightChar(
                    thisCharName,
                    C.HTML.Block([
                        C.HTML.Title("VAMPIRE: TORONTO by NIGHT", {fontSize: "28px"}),
                        C.HTML.Title("Session Monologues", {fontSize: "28px", margin: "-10px 0px 0px 0px"}),
                        C.HTML.Header(thisCharName),
                        C.HTML.Body("The Spotlight Is Yours!"),
                        C.HTML.Button("End Scene", `!endmonologue`, {
                            width: "50%",
                            height: "20px",
                            margin: "2px 2px 0px -5px",
                            border: "1px outset rgba(100, 0, 0, 1)",
                            fontSize: "14px",
                            lineHeight: "20px",
                            textShadow: "0px 0px 2px #000 , 0px 0px 2px #000, 0px 0px 2px #000 , 0px 0px 2px #000",
                            boxShadow: "inset -1px -1px 2px #000 , -1px -1px 2px #000 , 1px 1px 2px #000 , 1px 1px 2px #000"
                        })
                    ])
                );
        } else {
            DB({step: "Monologues Done! Ending Session.", monologues: STATE.REF.SessionMonologues}, "startSessionMonologue");
            endSession(false);
        }
    };
    const endSessionMonologue = () => {
        const lastPrompt = D.GetCharData(STATE.REF.spotlightChar).spotlightPrompt;
        if (lastPrompt && "author" in lastPrompt && lastPrompt.isAwardingXP)
            if (STATE.REF.isTestingActive)
                D.Alert(`Would award 1 XP to ${D.GetName(lastPrompt.author)} if session active.`, "Full Test: Session.assignSpotlightPrompt()");
            else Char.AwardXP(lastPrompt.author, 1, `Spotlight Prompt for ${D.GetName(STATE.REF.spotlightChar, true)}`);

        const numStains = D.Int(D.GetStatVal(STATE.REF.spotlightChar, "stains"));
        if (numStains) {
            D.Chat(
                "all",
                C.HTML.Block([
                    C.HTML.Header(
                        `Rolling Remorse for ${D.GetName(STATE.REF.spotlightChar, true)}'s ${D.NumToText(numStains)} stain${
                            numStains > 1 ? "s" : ""
                        }...`
                    )
                ])
            );
            D.Call(`!roll quick remorse ${STATE.REF.spotlightChar}`);
        }
        DB(
            {step: "Ending Session Monologue, Proceeding to Next", lastPrompt, numStains, lastData: D.GetCharData(STATE.REF.spotlightChar)},
            "endSessionMonologue"
        );
        D.SetCharData(STATE.REF.spotlightChar, "spotlightPrompt", false);
        startSessionMonologue();
    };
    // #endregion

    // #region Starting & Ending Scenes, Logging Characters to Scene
    const setSceneFocus = locPos => {
        locPos =
            (isLocCentered() === true && "c") ||
            (VAL({string: locPos}) && D.LCase(locPos).charAt(0)) ||
            (isLocCentered() === false && ["r", "l", "c"].includes(STATE.REF.sceneFocus) && STATE.REF.sceneFocus) ||
            "c";
        STATE.REF.sceneFocus = locPos;
        STATE.REF.sceneFocusRecord[Session.Mode] = locPos;
        DB({locPos, ["state Scene Focus"]: STATE.REF.sceneFocus, activeLocs: getActivePositions()}, "setSceneFocus");
        const allLocations = getAllLocations();
        const activePositions = getActivePositions();
        const inactivePositions = Object.keys(getAllLocations(false)).filter(x => !activePositions.includes(x));
        const tokenObjs = Media.GetTokens();
        if (activePositions.includes("DistrictCenter") || locPos === "c") {
            Media.ToggleImg("DisableLocLeft", false);
            Media.ToggleImg("DisableLocRight", false);
            Media.ToggleImg("DisableSiteLeft", false);
            Media.ToggleImg("DisableSiteRight", false);
            for (const tokenObj of tokenObjs) {
                Media.ToggleToken(tokenObj, true);
                if (tokenObj.get("layer") !== "objects") tokenObj.set({layer: "objects"});
            }
        } else if (allLocations.DistrictLeft && allLocations.DistrictLeft === allLocations.DistrictRight) {
            Media.ToggleImg("DisableLocLeft", false);
            Media.ToggleImg("DisableLocRight", false);
            Media.ToggleImg("DisableSiteLeft", locPos === "r");
            Media.ToggleImg("DisableSiteRight", locPos === "l");
            for (const tokenObj of tokenObjs) {
                Media.ToggleToken(tokenObj, true);
                if (tokenObj.get("layer") !== "objects") tokenObj.set({layer: "objects"});
            }
        } else {
            Media.ToggleImg("DisableSiteLeft", false);
            Media.ToggleImg("DisableSiteRight", false);
            Media.ToggleImg("DisableLocLeft", locPos === "r");
            Media.ToggleImg("DisableLocRight", locPos === "l");
            for (const tokenObj of _.compact(
                _.flatten(activePositions.map(x => Media.GetContents(x, {padding: 25}, {layer: "walls", _subtype: "token"})))
            ))
                Media.ToggleToken(tokenObj, true);
            for (const tokenObj of _.compact(
                _.flatten(inactivePositions.map(x => Media.GetContents(x, {padding: 25}, {layer: "objects", _subtype: "token"})))
            ))
                Media.ToggleToken(tokenObj, false);
        }
        const [sitePos] = activePositions.filter(x => x.startsWith("Site"));
        const siteName = sitePos in STATE.REF.curLocation && STATE.REF.curLocation[sitePos][1];
        const pointerPos =
            (siteName && siteName in STATE.REF.customLocs && STATE.REF.customLocs[siteName].pointerPos) ||
            (Session.Site in STATE.REF.customLocs && STATE.REF.customLocs[Session.Site].pointerPos) ||
            (Session.Site in STATE.REF.locationPointer && STATE.REF.locationPointer[Session.Site].pointerPos) ||
            false;
        if (VAL({list: pointerPos})) {
            Media.ToggleImg("MapIndicator_Base_1", true);
            Media.ToggleAnim("MapIndicator", true);
            Media.SetImgData("MapIndicator_Base_1", {left: pointerPos.left, top: pointerPos.top}, true);
            Media.GetImg("MapIndicator").set({left: pointerPos.left, top: pointerPos.top});
        } else {
            Media.ToggleImg("MapIndicator_Base_1", false);
            Media.ToggleAnim("MapIndicator", false);
        }
        Soundscape.Sync();
    };
    const addSceneAlarm = alarm => {
        STATE.REF.SceneAlarms.push(alarm);
    };
    const endScene = () => {
        for (const charObj of Session.SceneChars) D.SetStat(charObj.id, "willpower_social_toggle", "go");
        for (const sceneAlarm of STATE.REF.SceneAlarms) TimeTracker.Fire(sceneAlarm);
        STATE.REF.SceneAlarms = [];
        D.Alert("Social Willpower Damage partially refunded.", "Scene Ended");
    };
    // #endregion

    return {
        CheckInstall: checkInstall,
        OnChatCall: onChatCall,
        OnPageChange: onPageChange,

        ToggleTesting: toggleTesting,
        Start: startSession,
        End: endSession,

        AddSceneAlarm: addSceneAlarm,
        ChangeMode: changeMode,
        CharsIn: getCharsInLocation,
        ResetLocations: setModeLocations,
        IsInScene: charRef => isInScene(charRef),
        IsInLocation: (charRef, locRef) => isInLocation(charRef, locRef),
        get SceneChars() {
            return getCharsInLocation(STATE.REF.sceneFocus);
        }, // ARRAY: [charObj, charObj, ...]
        get SceneFocus() {
            return STATE.REF.sceneFocus;
        }, // STRING: "r", "l", "c"

        get Locations() {
            return getAllLocations();
        }, // LIST: { DistrictCenter: "YongeStreet", SiteCenter: "SiteLotus", SubLocs: {TopRight: "Laboratory", TopLeft: "Security"} }
        get ActiveLocations() {
            return getActiveLocations();
        }, // LIST: { DistrictLeft: "YongeStreet", SiteLeft: "SiteLotus" }
        get ActivePositions() {
            return getActivePositions();
        }, // ARRAY: ["DistrictCenter", "SiteCenter"]
        get InactiveLocations() {
            return _.omit(getAllLocations(false), (v, k) => getActivePositions().includes(k));
        },

        get District() {
            return getActiveDistrict();
        },
        get Site() {
            return getActiveSite();
        },
        get IsOutside() {
            return isOutside();
        },
        get SessionNum() {
            return STATE.REF.SessionNum;
        },
        get IsSessionActive() {
            return isSessionActive();
        },
        get IsTesting() {
            return STATE.REF.isTestingActive;
        },
        get IsFullTest() {
            return STATE.REF.isFullTest;
        },

        get Mode() {
            return STATE.REF.Mode;
        },
        get LastMode() {
            return STATE.REF.LastMode;
        },

        get SpotlightPrompts() {
            return STATE.REF.SpotlightPrompts;
        },

        SetMacro: setMacro,
        SubmitPrompt: submitSpotlightPrompt,
        ReviewPrompts: reviewSpotlightPrompts,
        DeletePrompt: deleteSpotlightPrompt,
        GetPrompt: assignSpotlightPrompt,
        EndMonologue: endSessionMonologue
    };
})();

on("ready", () => {
    Session.CheckInstall();
    D.Log("Session Ready!");
});
void MarkStop("Session");
