void MarkStart("Roller")
const Roller = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Roller",
    
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
        initialize = () => {
            STATE.REF.rollRecord = STATE.REF.rollRecord || []
            STATE.REF.rollIndex = STATE.REF.rollIndex || 0
            STATE.REF.NPC = STATE.REF.NPC || {}
            STATE.REF.NPC.rollRecord = STATE.REF.NPC.rollRecord || []
            STATE.REF.NPC.rollIndex = STATE.REF.NPC.rollIndex || 0
            STATE.REF.selected = STATE.REF.selected || {}
            STATE.REF.diceVals = STATE.REF.diceVals || {}
            STATE.REF.rollEffects = STATE.REF.rollEffects || {}
            STATE.REF.lastProjectPrefix = STATE.REF.lastProjectPrefix || ""
            STATE.REF.lastProjectCharID = STATE.REF.lastProjectCharID || ""
            STATE.REF.nextRollFlags = STATE.REF.nextRollFlags || {}
            STATE.REF.forcedMods = STATE.REF.forcedMods || {
                posMods: [],
                negMods: [],
                redMods: [],
                goldMods: []
            }

    
            for (const dieCat of Object.keys(SETTINGS.dice)) {
                delete STATE.REF[dieCat]
                STATE.REF.selected[dieCat] = STATE.REF.selected[dieCat] || []
                STATE.REF.diceVals[dieCat] = STATE.REF.diceVals[dieCat] || []
            }

            if (_.compact(_.flatten(_.values(STATE.REF.forcedMods))).length)
                D.Alert("WARNING: Roll Mod Overrides Set for Roller<br><b>!roll force mods</b> to clear.")
        },

    // #endregion	

    // #region EVENT HANDLERS: (ONCHATCALL)
        onChatCall = (call, args, objects, msg) => {
            switch (call) {
                case "dice": {                     
                    const [charObj] = Listener.GetObjects(objects, "character")
                    let rollType
                    if (VAL({array: args}, "!roll dice"))
                        switch (D.LCase(call = args.shift())) {
                            case "frenzyinit": {	// !roll dice project @{character_name}|Politics:3,Resources:2|diff|mod|diffMod|rowID
                                lockRoller(true)
                                STATE.REF.frenzyRoll = `${args.join(" ").split("|")[0]}|`
                                D.CommandMenu({
                                    rows: [
                                        {type: "Header", contents: `Set Frenzy Diff for ${D.JSL(D.GetName(charObj, true))}`},
                                        {type: "ButtonLine", contents: [
                                            20,                                
                                            {name: "1", command: "!roll dice frenzy 1"},
                                            {name: "2", command: "!roll dice frenzy 2"},
                                            {name: "3", command: "!roll dice frenzy 3"},
                                            {name: "4", command: "!roll dice frenzy 4"},
                                            {name: "5", command: "!roll dice frenzy 5"},
                                            20
                                        ], styles: {bgColor: C.COLORS.darkred}}
                                    ]
                                })
                                break
                            }
                            case "frenzy": { rollType = rollType || "frenzy"
                                lockRoller(false)
                                args = `${STATE.REF.frenzyRoll} ${args[0] || ""}`.split(" ")
                                DB({"Parsing Frenzy Args": args}, "!roll dice frenzy")
                            }
                            /* falls through */
                            case "disc": case "trait": { rollType = rollType || "trait" }
                            /* falls through */
                            case "rouse": case "rouseobv": { rollType = rollType || "rouse" }
                            /* falls through */
                            case "rouse2": case "rouse2obv": { rollType = rollType || "rouse2" }
                            /* falls through */
                            case "check": { rollType = rollType || "check" }
                            /* falls through */
                            case "willpower": { rollType = rollType || "willpower" }
                            /* falls through */
                            case "humanity": { rollType = rollType || "humanity" }
                            /* falls through */
                            case "remorse": { rollType = rollType || "remorse" }
                            /* falls through */
                            case "project": { rollType = rollType || "project" /* all continue below */
                                const params = args.join(" ").split("|").map(x => x.trim()),
                                    [rollCharObj] = getRollChars(D.GetChars(STATE.REF.rollNextAs || params[0]))
                                DB({"Received Roll": `${D.JSL(call)} ${D.JSL(params.join("|"))}`, params, rollCharObj}, "onChatCall")
                                params.shift()
                                if (VAL({charobj: rollCharObj}, "onChatCall")) {
                                    const rollFlags = ["check", "rouse", "rouse2"].includes(rollType) ||
                                                        VAL({pc: rollCharObj}) && (!playerIsGM(msg.playerid) || rollType === "frenzy") ? {} : _.clone(STATE.REF.nextRollFlags)
                                    rollFlags.isNPCRoll = STATE.REF.isNextRollNPC && playerIsGM(msg.playerid)
                                    rollFlags.isDiscRoll = call === "disc"
                                    rollFlags.isOblivionRoll = call.includes("obv") || STATE.REF.oblivionRouse && (rollFlags.isNPCRoll || playerIsGM(msg.playerid) || VAL({npc: rollCharObj})) 
                                    if (isLocked && !rollFlags.isNPCRoll) {
                                        DB({"***": "BREAKING", isLocked, isNPCRoll: rollFlags.isNPCRoll}, "onChatCall")
                                        break
                                    }
                                    makeNewRoll(rollCharObj, rollType, params, rollFlags)
                                    delete STATE.REF.rollNextAs  
                                    delete STATE.REF.frenzyRoll
                                    delete STATE.REF.oblivionRouse
                                    delete STATE.REF.isNextRollNPC
                                }
                                break
                            }
                            // no default
                        }
                    break
                }
                case "secret": {
                    const charObjs = Listener.GetObjects(objects, "character")
                    if (args.length) {
                        const params = Char.SelectedTraits
                        makeSecretRoll(getRollChars(charObjs), params.join(","))
                    } else {
                        Char.PromptTraitSelect(charObjs.map(x => x.id), "!roll", "secret selected")
                    }
                    break
                }
                case "quick": {
                    const [charObj] = getRollChars(Listener.GetObjects(objects, "character")[0])
                    if(VAL({charObj}, "!roll quick"))
                        switch (D.LCase(call = args.shift())) {
                            case "rouse": {
                                const isObvRouse = args.shift() === "true",
                                    isDoubleRouse = args[0] === "true"
                                quickRouseCheck(charObj, isDoubleRouse, isObvRouse)
                                break
                            }
                            case "remorse": {
                                makeNewRoll(charObj, "remorse")
                                break
                            }
                            // no default
                        }
                    break
                }
                case "resonance": {
                    const [charObj] = Listener.GetObjects(objects, "character")
                    displayResonance(charObj)
                    break
                }
                case "set": {
                    DB({call, args, msg, isGM: playerIsGM(msg.playerid)}, "setRollFlags")
                    if (!playerIsGM(msg.playerid) && msg.playerid !== "API") break
                    switch(D.LCase(call = args.shift())) {
                        case "resbonus": {
                            STATE.REF.resMarginBonus = D.Int(args.shift())
                            D.Alert(`The next resonance roll will enjoy a +${STATE.REF.resMarginBonus}0% bonus.`, "Resonance")
                            break
                        }
                        case "pc": {
                            const [charObj] = getRollChars(Listener.GetObjects(objects, "character")[0])
                            if (VAL({charObj}, "!roll set pc")) {
                                STATE.REF.rollNextAs = charObj.id
                                D.Alert(`Rolling Next As ${D.GetName(charObj)}`, "!roll set pc")
                            }
                            break
                        }
                        case "npc": {
                            STATE.REF.isNextRollNPC = true
                            break
                        }
                        case "obvrouse": {
                            STATE.REF.oblivionRouse = !STATE.REF.oblivionRouse
                            D.Alert(`Next SPC Rouse Check ${STATE.REF.oblivionRouse && "<b>IS</b>" || "<b>IS NOT</b>"} for Oblivion.`, "!roll set obvrouse")
                            break
                        }  
                        case "secrecy": {
                            switch (D.LCase(call = args.shift())) {
                                case "menu": {
                                    secrecyMenu(args.join(" "))
                                    break
                                }
                                case "name": case "identity":
                                    STATE.REF.nextRollFlags = {
                                        isHidingName: true,
                                        isHidingTraits: false,
                                        isHidingTraitVals: false,
                                        isHidingDicePool: false,
                                        isHidingDifficulty: false,
                                        isHidingResult: false,
                                        isHidingOutcome: false
                                    }
                                    break
                                case "traitvals":
                                    STATE.REF.nextRollFlags = {
                                        isHidingName: false,
                                        isHidingTraits: false,
                                        isHidingTraitVals: true,
                                        isHidingDicePool: false,
                                        isHidingDifficulty: false,
                                        isHidingResult: false,
                                        isHidingOutcome: false
                                    }
                                    break
                                case "traits":
                                    STATE.REF.nextRollFlags = {
                                        isHidingName: false,
                                        isHidingTraits: true,
                                        isHidingTraitVals: true,
                                        isHidingDicePool: false,
                                        isHidingDifficulty: false,
                                        isHidingResult: false,
                                        isHidingOutcome: false
                                    }
                                    break
                                case "dice": case "dicepool": case "pool":
                                    STATE.REF.nextRollFlags = {
                                        isHidingName: false,
                                        isHidingTraits: true,
                                        isHidingTraitVals: true,
                                        isHidingDicePool: true,
                                        isHidingDifficulty: false,
                                        isHidingResult: false,
                                        isHidingOutcome: false
                                    }
                                    break
                                case "result":
                                    STATE.REF.nextRollFlags = {
                                        isHidingName: false,
                                        isHidingTraits: true,
                                        isHidingTraitVals: true,
                                        isHidingDicePool: true,
                                        isHidingDifficulty: false,
                                        isHidingResult: true,
                                        isHidingOutcome: false
                                    }
                                    break
                                case "outcome":
                                    STATE.REF.nextRollFlags = {
                                        isHidingName: false,
                                        isHidingTraits: true,
                                        isHidingTraitVals: true,
                                        isHidingDicePool: true,
                                        isHidingDifficulty: false,
                                        isHidingResult: true,
                                        isHidingOutcome: true
                                    }
                                    break
                                case "none":
                                    STATE.REF.nextRollFlags = {
                                        isHidingName: false,
                                        isHidingTraits: false,
                                        isHidingTraitVals: false,
                                        isHidingDicePool: false,
                                        isHidingDifficulty: false,
                                        isHidingResult: false,
                                        isHidingOutcome: false
                                    }
                                    break
                                    // no default                        
                            }
                            // D.Alert(`Flag Status for Next Roll: ${D.JS(STATE.REF.nextRollFlags, true)}`, "NEXT ROLL FLAGS")
                            break
                        }
                        case "flags": {
                            for (const flag of ["Name", "Traits", "TraitVals", "DicePool", "Difficulty", "Result", "Outcome"])
                                for (const arg of args) {
                                    const isNegating = arg.startsWith("!")
                                    if (D.FuzzyMatch(flag, arg.replace(/!/gu, "")))
                                        STATE.REF.nextRollFlags[`isHiding${flag}`] = !isNegating
                                    if (D.FuzzyMatch("NPC", arg.replace(/!/gu, "")))
                                        STATE.REF.isNextRollNPC = !isNegating
                                }
                            D.Alert(`Flag Status for Next Roll: ${D.JS(STATE.REF.nextRollFlags, true)}<br><br>Is NPC Roll? ${STATE.REF.isNextRollNPC}`, "NEXT ROLL FLAGS")
                            break
                        }
                        // no default
                    }
                    break
                }
                case "force": {
                    switch (D.LCase(call = args.shift())) {
                        case "mods": {
                            if (args.length) {
                                const type = _.findKey({
                                        posMods: ["p", "pos", "posmod", "posmods"],
                                        negMods: ["n", "neg", "negmod", "negmods"],
                                        goldMods: ["g", "gold", "goldmod", "goldmods"],
                                        redMods: ["r", "red", "redmod", "redmods"]
                                    }, v => v.includes(D.LCase(args[0]))),
                                    val = D.Int(args.pop()),
                                    flag = args.slice(1).join(" ")                                
                                STATE.REF.forcedMods[type].push([val, flag])
                                D.Alert(`Currently forcing mods:<br><br>${D.JS(STATE.REF.forcedMods)}`, "!roll force mods")
                            } else {
                                STATE.REF.forcedMods = {
                                    posMods: [],
                                    negMods: [],
                                    goldMods: [],
                                    redMods: []
                                }
                                D.Alert("Forced mods CLEARED.", "!roll force mods")
                            }
                            break
                        }
                        // no default
                    }
                    break
                }
                case "clean": {
                    clearRoller()
                    break
                }
                case "build": {
                    initFrame()
                    break
                }
                case "change": {
                    switch(D.LCase(call = args.shift())) {
                        case "roll": {
                            changeRoll(D.Int(args.shift()))
                            break
                        }
                        case "npcroll": {
                            changeRoll(D.Int(args.shift()), true)
                            break
                        }
                        case "prev": {
                            loadPrevRoll()
                            break
                        }
                        case "next": {
                            loadNextRoll()
                            break
                        }
                        case "prevnpc": {
                            loadPrevRoll(true)
                            break
                        }
                        case "nextnpc": {
                            loadNextRoll(true)
                            break
                        }
                        default: {
                            rollCommandMenu()
                            break
                        }
                    }
                    break
                }
                case "effects": case "effect": {
                    switch (D.LCase(call = args.shift())) {    
                        case "menu": {
                            const charObjs = Listener.GetObjects(objects, "character"),
                                charNameString = charObjs.length && charObjs.map(x => D.GetName(x, true)).join(", ") || "",
                                charIDString = charObjs.length && charObjs.map(x => x.id).join(" ") || "",
                                menuHTML = C.HTML.Block([
                                    C.HTML.Header("Effects & Exclusions"),
                                    C.HTML.ButtonLine([
                                        C.HTML.ButtonSubheader("GET ALL:"),
                                        C.HTML.Button("Effects", "!reply get effects"),
                                        C.HTML.Button("Exclusions", "!reply get exclusions"),
                                        C.HTML.ButtonSpacer("25%")
                                    ]),
                                    C.HTML.Header("Character Specific"),
                                    C.HTML.ClearBody(charNameString),
                                    C.HTML.ButtonLine([
                                        C.HTML.Button("Get Active Effects", `!reply get effects ${charIDString}`, {width: "40%"}),
                                        C.HTML.Button("Get Active Exclusions", `!reply get exclusions ${charIDString}`, {width: "40%"})
                                    ]),                                    
                                    C.HTML.ButtonLine([
                                        C.HTML.Button("Add Global Effect", "!reply add effect global ?{Global Effect:}", {width: "40%"}),
                                        C.HTML.Button("Add Char Effect", `!reply add effect char ${charIDString} ?{Character Effect: }`, {width: "40%"})
                                    ])
                                ]),
                                func = (replyString, objs) => {
                                    const chars = Listener.GetObjects(objs, "character"),
                                        argsSplit = replyString.split(/\s+?/gu)
                                    D.Alert(`ARGS: ${D.JS(argsSplit)}<br>CHARS: ${chars.map(x => D.GetName(x, true))}`, "Menu Reply Test")
                                }
                            D.Prompt(menuHTML, func)
                            break
                        }                    
                        case "get": {
                            switch (D.LCase(call = args.shift())) {
                                case "char": {
                                    const [charObj] = getRollChars(Listener.GetObjects(objects, "character")[0])
                                    if (VAL({charObj}, "!roll effects get char")) {
                                        const rollEffects = _.compact((D.GetStatVal(charObj.id, "rolleffects") || "").split("|")),
                                            rollStrings = []
                                        for (let i = 0; i < rollEffects.length; i++)
                                            rollStrings.push(`${i + 1}: ${rollEffects[i]}`)
                                        D.Alert(`Roll Effects on ${D.GetName(charObj)}:<br><br>${rollStrings.join("<br>")}`, "!roll effects get char")
                                    }
                                    break
                                }
                                case "global": {
                                    const rollStrings = []
                                    for (let i = 0; i < Object.keys(STATE.REF.rollEffects).length; i++)
                                        rollStrings.push(`${i + 1}: ${Object.keys(STATE.REF.rollEffects)[i]}`)
                                    D.Alert(`Global Roll Effects:<br><br>${rollStrings.join("<br>")}`, "!roll effects get global")
                                    break
                                }
                                case "exclude": {
                                    const excludeEffects = _.filter(STATE.REF.rollEffects, v => v.length)
                                    D.Alert(`<h3>Global Exclusions</h3>${D.JS(excludeEffects)}`, "!roll effects get exclude")
                                    break
                                }
                                default: {
                                    const charObjs = D.GetChars("all"),
                                        returnStrings = ["<h3>GLOBAL EFFECTS:</h3><!br>"]
                                    for (let i = 0; i < Object.keys(STATE.REF.rollEffects).length; i++)
                                        returnStrings.push(`${i + 1}: ${Object.keys(STATE.REF.rollEffects)[i]}`)
                                    returnStrings.push("")              
                                    returnStrings.push("<h3>CHARACTER EFFECTS:</h3><!br>")
                                    for (const char of charObjs) {
                                        const rollEffects = _.compact((D.GetStatVal(char.id, "rolleffects") || "").split("|"))
                                        if (rollEffects.length) {
                                            returnStrings.push(`<b>${char.get("name").toUpperCase()}</b>`)
                                            for (let i = 0; i < rollEffects.length; i++)
                                                returnStrings.push(`${i + 1}: ${rollEffects[i]}`)
                                            returnStrings.push("")
                                        }
                                    }
                                    D.Alert(returnStrings.join("<br>").replace(/<!br><br>/gu, ""), "Active Roll Effects")
                                    break
                                }
                            }
                            break
                        }                        
                        case "add": {
                            switch (D.LCase(call = args.shift())) {
                                case "char": {
                                    const charObjs = getRollChars(Listener.GetObjects(objects, "character")[0])
                                    if (VAL({charObj: charObjs}, "!roll effects add char", true)) 
                                        for (const char of charObjs)
                                            addCharRollEffect(char, args.join(" "))                      
                                    break
                                }
                                case "global": {
                                    addGlobalRollEffect(args.join(" "))
                                    break
                                }
                                case "exclude": {
                                    const [charObj] = getRollChars(Listener.GetObjects(objects, "character")[0])
                                    if (VAL({charObj}, "!roll effects add exclude"))
                                        addGlobalExclusion(charObj, args.join(" "))
                                    break
                                }
                                // no default
                            }
                            break
                        }                        
                        case "del": {
                            switch (D.LCase(call = args.shift())) {
                                case "char": {
                                    const [charObj] = getRollChars(Listener.GetObjects(objects, "character")[0])
                                    if (VAL({charObj}, "!roll effects del char"))
                                        delCharRollEffect(charObj, args.join(" "))
                                    break
                                }
                                case "global": {
                                    delGlobalRollEffect(args.join(" "))
                                    break
                                }
                                case "exclude": {
                                    const [charObj] = getRollChars(Listener.GetObjects(objects, "character")[0])
                                    if (VAL({charObj}, "!roll effects del exclude"))
                                        delGlobalExclusion(charObj, args.join(" "))
                                    break
                                }
                                // no default
                            }
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

    let isLocked = false

    // #region CONFIGURATION: Image Links, Color Schemes */
    const SETTINGS = {
            dice: {
                Main: {qty: 30, spread: 33},
                Big: {qty: 2, spread: 50}
            },
            frame: {
                mids: {qty: 6, minSpread: 50, maxSpread: 125},
                minWidth: 250,
                leftBuffer: 100,
                flagBuffer: 10
            },
            textKeys: [
                "rollerName",
                "mainRoll",
                "posMods",
                "negMods",
                "goldMods",
                "redMods",
                "dicePool",
                "difficulty",
                "margin",
                "resultCount",
                "outcome",
                "subOutcome"
            ],
            shifts: { // Must set TEXT and TOGGLE STATE of all roller objects before applying shifts.
                get modShiftData() {
                    const lineShifts = {
                        // rollerName: Media.GetTextData("rollerName").left + Media.GetTextWidth("rollerName") - Media.GetTextData("outcome").left + 45,
                            mainRoll: Media.GetImg("RollerFrame_TopEnd").get("left") + 0.5 * Media.GetImgData("RollerFrame_TopEnd").width - Media.GetTextData("outcome").left + 10,
                            diceLine: Media.IsActive("RollerFrame_BottomEnd") ? Media.GetImg("RollerFrame_BottomEnd").get("left") + 0.5 * Media.GetImgData("RollerFrame_BottomEnd").width - Media.GetTextData("outcome").left + 20 : Infinity,
                            outcome: Media.GetTextWidth("outcome") + 45
                        },
                        shifts = { // rollerNameLow, mainRollHigh, mainRollLow, diceLineHigh, diceLineLow, outcomeHigh
                        // rollerNameLow: {top: -1 * Media.GetImgData("RollerFrame_TopEnd").height + 4, left: lineShifts.rollerName, extendDir: -1},
                        // mainRollHigh: {top: -30, left: lineShifts.mainRoll, extendDir: 0},
                            mainRollLow: {top: 0, left: lineShifts.mainRoll, extending: "goldMods"},
                            diceLineHigh: {top: 25, left: lineShifts.diceLine, extending: "redMods"},
                            diceLineLow: {top: Media.GetImgData("RollerFrame_TopEnd").height, left: lineShifts.diceLine, extending: "goldMods"},
                            outcomeHigh: {top: Media.GetImgData("RollerFrame_TopEnd").height + 20, left: lineShifts.outcome, extending: "redMods"}
                        },
                        flagSpace = {
                        // rollerNameLow: lineShifts.mainRoll - lineShifts.rollerName,
                        // mainRollHigh: lineShifts.rollerName - lineShifts.mainRoll,
                            mainRollLow: (Media.IsActive("RollerFrame_BottomEnd") ? lineShifts.diceLine : lineShifts.outcome) - lineShifts.mainRoll,
                            diceLineHigh: Media.IsActive("RollerFrame_BottomEnd") ? lineShifts.mainRoll - lineShifts.diceLine : 0,
                            diceLineLow: (Media.IsActive("RollerFrame_BottomEnd") ? lineShifts.outcome - lineShifts.diceLine : 0) * 0.75,
                            outcomeHigh: (Media.IsActive("RollerFrame_BottomEnd") ? lineShifts.diceLine : lineShifts.mainRoll) - lineShifts.outcome,
                        }
                /* if (Math.max(Media.GetTextWidth("goldMods"), Media.IsActive("redMods") && Media.GetTextWidth("redMods") || 0) < 1.5 * flagSpace.mainRollHigh)
                    flagSpace.rollerNameLow = flagSpace.mainRollHigh - 1
                if (Math.max(Media.GetTextWidth("goldMods"), Media.IsActive("redMods") && Media.GetTextWidth("redMods") || 0) < 1.5 * flagSpace.mainRollLow)
                    flagSpace.rollerNameLow = Math.min(flagSpace.rollerNameLow, flagSpace.mainRollLow - 1) */
                    return shifts[_.findKey(flagSpace, v => v && v === Math.max(..._.values(flagSpace)))]
                },
                rollerName: {top: 0, left: 0},
                mainRoll: {
                    get top() { return (Media.IsActive("posMods") || Media.IsActive("negMods")) && -10 || 0 },
                    left: 0
                },
                dicePool: {top: 0, left: 0},
                resultCount: {
                    get top() { return Media.IsActive("RollerFrame_BottomEnd") ? 0 : -1 * Media.GetImgData("RollerFrame_BottomEnd").height },
                    get left() { return 0 }
                },
                difficulty: {
                    get top() { return SETTINGS.shifts.resultCount.top },
                    get left() { return SETTINGS.shifts.resultCount.left }
                },
                diffFrame: {
                    get top() { return Media.GetImgData("RollerFrame_Diff").top + SETTINGS.shifts.difficulty.top },
                    get left() { return Media.GetImgData("RollerFrame_Diff").left }
                },
                margin: {
                    get top() { return Session.Mode === "Spotlight" && -1 * Media.GetImgData("RollerFrame_BottomEnd").height - 40 || SETTINGS.shifts.resultCount.top },
                    get left() { return Session.Mode === "Spotlight" && C.SANDBOX.width - Media.GetTextWidth("outcome") - SETTINGS.frame.flagBuffer - Media.GetTextData("margin").left - Media.GetTextWidth("margin") - 40 || SETTINGS.shifts.resultCount.left /*
                                Media.GetImgData(Media.IsActive("RollerFrame_BottomEnd") ? "RollerFrame_BottomEnd" : "RollerFrame_TopEnd").rightEdge ||
                SETTINGS.shifts.resultCount.left */ }
                },
                outcome: {
                    get top() { return SETTINGS.shifts.margin.top },
                    get left() { return SETTINGS.shifts.margin.left + (Session.Mode === "Spotlight" && SETTINGS.frame.flagBuffer || 0) }
                },
                subOutcome: {
                    get top() { return SETTINGS.shifts.margin.top },
                    get left() { return SETTINGS.shifts.resultCount.left }
                },
                posMods: {
                    get top() { return 0 },
                    get left() { return 0 }
                },
                negMods: {
                    get top() { return SETTINGS.shifts.posMods.top },
                    get left() {
                        return SETTINGS.shifts.posMods.left +
                               Media.IsActive("posMods") && Media.GetTextWidth("posMods") + SETTINGS.frame.flagBuffer ||
                               0
                    }
                },
                goldMods: {
                    get top() {
                        const shiftData = Object.assign({}, SETTINGS.shifts.modShiftData)
                        return shiftData.top +
                               (Media.IsActive("redMods") && shiftData.extending === "goldMods" && -18 || 0)
                    },
                    get left() {
                        return SETTINGS.shifts.modShiftData.left
                    }
                },
                redMods: {
                    get top() {
                        const shiftData = Object.assign({}, SETTINGS.shifts.modShiftData)
                        return shiftData.top +
                               (Media.IsActive("goldMods") && shiftData.extending === "redMods" && 18 || 0)
                    },
                    get left() {
                        return SETTINGS.shifts.modShiftData.left
                    }
                }
            }
        },
        SECRECYDEFAULTS = {
            isHidingName: false,
            isHidingTraits: false,
            isHidingTraitVals: true,
            isHidingDicePool: true,
            isHidingDifficulty: false,
            isHidingResult: false,
            isHidingOutcome: false
        },
        COLORSCHEMES = {
            base: {
                rollerName: C.COLORS.white,
                mainRoll: C.COLORS.white,
                posMods: C.COLORS.white,
                negMods: C.COLORS.brightred,
                goldMods: C.COLORS.gold,
                redMods: C.COLORS.brightred,
                dicePool: C.COLORS.white,
                difficulty: C.COLORS.gold,
                margin: C.COLORS.gold,
                resultCount: C.COLORS.white,
                outcome: C.COLORS.white,
                subOutcome: C.COLORS.white,
            },
            project: {
                rollerName: C.COLORS.white,
                mainRoll: C.COLORS.white,
                posMods: C.COLORS.white,
                negMods: C.COLORS.brightred,
                dicePool: C.COLORS.white,
                difficulty: C.COLORS.white,
                resultCount: C.COLORS.white,
                margin: {
                    good: C.COLORS.white,
                    bad: C.COLORS.brightred
                },
                outcome: {
                    best: C.COLORS.white,
                    good: C.COLORS.white,
                    bad: C.COLORS.midgold,
                    worst: C.COLORS.brightred
                },
                subOutcome: {
                    best: C.COLORS.white,
                    good: C.COLORS.white,
                    bad: C.COLORS.midgold,
                    worst: C.COLORS.brightred
                }
            },
            trait: {
                rollerName: C.COLORS.white,
                mainRoll: C.COLORS.white,
                posMods: C.COLORS.white,
                negMods: C.COLORS.brightred,
                dicePool: C.COLORS.white,
                difficulty: C.COLORS.white,
                resultCount: C.COLORS.white,
                margin: {
                    good: C.COLORS.white,
                    bad: C.COLORS.brightred
                },
                outcome: {
                    best: C.COLORS.white,
                    good: C.COLORS.white,
                    bad: C.COLORS.midgold,
                    worst: C.COLORS.brightred
                }
            },
            willpower: {
                rollerName: C.COLORS.white,
                mainRoll: C.COLORS.white,
                posMods: C.COLORS.white,
                negMods: C.COLORS.brightred,
                dicePool: C.COLORS.white,
                difficulty: C.COLORS.white,
                resultCount: C.COLORS.white,
                margin: {
                    good: C.COLORS.white,
                    bad: C.COLORS.brightred
                },
                outcome: {
                    best: C.COLORS.white,
                    good: C.COLORS.white,
                    bad: C.COLORS.midgold,
                    worst: C.COLORS.brightred
                }
            },
            humanity: {
                rollerName: C.COLORS.white,
                mainRoll: C.COLORS.white,
                posMods: C.COLORS.white,
                negMods: C.COLORS.brightred,
                dicePool: C.COLORS.white,
                difficulty: C.COLORS.white,
                resultCount: C.COLORS.white,
                margin: {
                    good: C.COLORS.white,
                    bad: C.COLORS.brightred
                },
                outcome: {
                    best: C.COLORS.white,
                    good: C.COLORS.white,
                    bad: C.COLORS.midgold,
                    worst: C.COLORS.brightred
                }
            },
            frenzy: {
                rollerName: C.COLORS.white,
                mainRoll: C.COLORS.white,
                posMods: C.COLORS.white,
                negMods: C.COLORS.brightred,
                dicePool: C.COLORS.white,
                difficulty: C.COLORS.white,
                resultCount: C.COLORS.white,
                outcome: {
                    best: C.COLORS.white,
                    good: C.COLORS.white,
                    bad: C.COLORS.midgold,
                    worst: C.COLORS.brightred
                }
            },
            remorse: {
                rollerName: C.COLORS.white,
                mainRoll: C.COLORS.white,
                dicePool: C.COLORS.white,
                difficulty: C.COLORS.white,
                resultCount: C.COLORS.white,
                outcome: {
                    best: C.COLORS.white,
                    good: C.COLORS.white,
                    bad: C.COLORS.midgold,
                    worst: C.COLORS.brightred
                }
            },
            rouse: {
                rollerName: C.COLORS.white,
                mainRoll: C.COLORS.white,
                outcome: {
                    best: C.COLORS.white,
                    good: C.COLORS.white,
                    bad: C.COLORS.brightred,
                    worst: C.COLORS.brightred,
                    grey: C.COLORS.darkgrey
                },
                subOutcome: {
                    bad: C.COLORS.midgold,
                    tainted: C.COLORS.brightpurple
                }
            },
            rouse2: {
                rollerName: C.COLORS.white,
                mainRoll: C.COLORS.white,
                outcome: {
                    best: C.COLORS.white,
                    good: C.COLORS.white,
                    bad: C.COLORS.brightred,
                    worst: C.COLORS.brightred,
                    grey: C.COLORS.darkgrey
                },
                subOutcome: {
                    bad: C.COLORS.midgold,
                    tainted: C.COLORS.brightpurple
                }
            },
            check: {
                rollerName: C.COLORS.white,
                mainRoll: C.COLORS.white,
                outcome: {
                    best: C.COLORS.white,
                    good: C.COLORS.white,
                    bad: C.COLORS.brightred,
                    worst: C.COLORS.brightred
                }
            }
        },
        CHATSTYLES = { // "-26px 0px -7px -42px"
            fullBox: `<div style="display: block;width: 259px;padding: 5px 5px;margin: -26px 0px -7px -42px; color: ${C.COLORS.white};font-family: bodoni svtytwo itc tt;font-size: 16px;border: 3px outset ${C.COLORS.darkred};background: url('http://imgsrv.roll20.net/?src=imgur.com/kBl8aTO.jpg') center no-repeat;position: relative;">`,
            space10: "<span style=\"display: inline-block; width: 10px;\"></span>",
            space30: "<span style=\"display: inline-block; width: 30px;\"></span>",
            space40: "<span style=\"display: inline-block; width: 40px;\"></span>",
            rollerName: `<div style="display: block; width: 100%; font-variant: small-caps; font-size: 16px; height: 15px; padding-bottom: 5px; border-bottom: 1px solid ${C.COLORS.white}; overflow: hidden;">`,
            mainRoll: `<div style="display: block; width: 100%; height: auto; padding: 3px 0px; border-bottom: 1px solid ${C.COLORS.white};"><span style="display: block; height: 16px; line-height: 16px; width: 100%; font-size: 14px; ">`,
            mainRollSub: "<span style=\"display: block; height: 12px; line-height: 12px; width: 100%; margin-left: 24px; font-size: 10px; font-variant: italic;\">",
            check: `<div style="display: block; width: 100%; height: auto; padding: 3px 0px; border-bottom: 1px solid ${C.COLORS.white};"><span style="display: block; height: 20px;  line-height: 20px; width: 100%; margin-left: 10%;">`,
            dicePool: "<div style=\"display: block; width: 100%; padding: 3px 0px; height: auto; \"><span style=\"display: block; height: 16px; width: 100%; margin-left: 5%; line-height: 16px; font-size: 14px;\">",
            resultBlock: "<div style=\"display: block; width: 100%; height: auto; \">",
            resultCount: "<div style=\"display: inline-block; width: YYYpx; margin-top:ZZZpx; vertical-align: top; text-align: right; height: 100%; \"><span style=\"display: inline-block; font-weight: normal; font-family: Verdana; text-shadow: none; height: 24px; line-height: 24px; vertical-align: middle; width: 40px; text-align: right; margin-right: 10px; font-size: 12px;\">",
            margin: "<div style=\"display: inline-block; width: YYYpx; vertical-align: top; margin-top:ZZZpx; text-align: left; height: 100%; \"><span style=\"display: inline-block; font-weight: normal; font-family: Verdana; text-shadow: none; height: 24px; line-height: 24px; vertical-align: middle; width: 40px; text-align: left; margin-left: 10px; font-size: 12px;\">",
            outcomeRed: `<div style="display: block; width: 100%; height: 20px; line-height: 20px; text-align: center; font-weight: bold;"><span style="color: ${C.COLORS.brightred}; display: block; width: 100%;  font-size: 22px; font-family: 'Bodoni SvtyTwo ITC TT';">`,
            outcomeRedSmall: `<div style="display: block; width: 100%; margin-top: 5px; height: 14px; line-height: 14px; text-align: center; font-weight: bold;"><span style="color: ${C.COLORS.brightred}; display: block; width: 100%;  font-size: 14px; font-family: 'Bodoni SvtyTwo ITC TT';">`,
            outcomePurple: `<div style="display: block; width: 100%; height: 20px; line-height: 20px; text-align: center; font-weight: bold;"><span style="color: ${C.COLORS.black}; display: block; width: 100%;  font-size: 22px; font-family: Voltaire; text-shadow: 0px 0px 2px rgb(255,255,255), 0px 0px 2px rgb(255,255,255), 0px 0px 2px rgb(255,255,255), 0px 0px 2px rgb(255,255,255), 0px 0px 2px rgb(255,255,255), 0px 0px 4px rgb(255,255,255), 0px 0px 4px rgb(255,255,255), 0px 0px 6px rgb(255,255,255), 0px 0px 6px rgb(200,100,200), 0px 0px 8px rgb(200,100,200), 0px 0px 10px rgb(200,100,200), 0px 0px 15px rgb(200,100,200);">`,
            outcomeOrange: "<div style=\"display: block; width: 100%; height: 20px; line-height: 20px; text-align: center; font-weight: bold;\"><span style=\"color: midgold; display: block; width: 100%;  font-size: 22px; font-family: 'Bodoni SvtyTwo ITC TT';\">",
            outcomeWhite: `<div style="display: block; width: 100%; height: 20px; line-height: 20px; text-align: center; font-weight: bold;"><span style="color: ${C.COLORS.white}; display: block; width: 100%;  font-size: 22px; font-family: 'Bodoni SvtyTwo ITC TT';">`,
            outcomeWhiteSmall: `<div style="display: block; margin-top: 5px; width: 100%; height: 14px; line-height: 14px; text-align: center; font-weight: bold;"><span style="color: ${C.COLORS.white}; display: block; width: 100%;  font-size: 14px; font-family: 'Bodoni SvtyTwo ITC TT';">`,
            subOutcomeRed: `<div style="display: block; width: 100%; height: 10px; line-height: 10px; text-align: center; font-weight: bold;"><span style="color: ${C.COLORS.brightred}; display: block; width: 100%;  font-size: 12px; font-family: 'Bodoni SvtyTwo ITC TT';">`,
            subOutcomeOrange: "<div style=\"display: block; width: 100%; height: 20px; line-height: 20px; text-align: center; font-weight: bold;\"><span style=\"color: midgold; display: block; width: 100%;  font-size: 12px; font-family: 'Bodoni SvtyTwo ITC TT';\">",
            subOutcomeWhite: `<div style="display: block; width: 100%; height: 10px; line-height: 10px; text-align: center; font-weight: bold;"><span style="color: ${C.COLORS.white}; display: block; width: 100%;  font-size: 12px; font-family: 'Bodoni SvtyTwo ITC TT';">`,
            resultDice: { // ♦◊
                colStart: "<div style=\"display: inline-block ; width: XXXpx ; height: auto; margin-bottom: 5px\">",
                lineStart: `<div style="display: block ; width: 100% ; height: 24px ; line-height: 20px ; text-align: center ; font-weight: bold ; text-shadow: 0px 0px 2px ${C.COLORS.white} , 0px 0px 2px ${C.COLORS.white} , 0px 0px 2px ${C.COLORS.white} , 0px 0px 2px ${C.COLORS.white} ; ">`,
                lineBreak: `</div><div style="display: block ; width: 100% ; height: 24px ; margin-top: -10px; line-height: 20px ; text-align: center ; font-weight: bold ; text-shadow: 0px 0px 2px ${C.COLORS.white} , 0px 0px 2px ${C.COLORS.white} , 0px 0px 2px ${C.COLORS.white} , 0px 0px 2px ${C.COLORS.white} ; ">`,
                BcL: `<span style="margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: ${C.COLORS.white}; display: inline-block; font-size: 18px; font-family: 'Arial';">♦</span><span style="width: 10px; text-align: center; height: 20px; vertical-align: middle; color: ${C.COLORS.white}; display: inline-block; font-size: 16px; font-family: 'Arial'; margin-left: -5px; text-shadow: none; ">+</span>`,
                BcR: `<span style="width: 10px; text-align: center; height: 20px; vertical-align: middle; color: ${C.COLORS.white}; display: inline-block; font-size: 16px; font-family: 'Arial'; margin-left: -5px; margin-right: -3px; text-shadow: none; ">+</span><span style="margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: ${C.COLORS.white}; display: inline-block; font-size: 18px; font-family: 'Arial';">♦</span>`,
                HcL: `<span style="margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: ${C.COLORS.brightred}; display: inline-block; font-size: 18px; font-family: 'Arial';">♦</span><span style="width: 10px; text-align: center; height: 20px; vertical-align: middle; color: ${C.COLORS.brightred}; display: inline-block; font-size: 16px; font-family: 'Arial'; margin-left: -5px; text-shadow: none; ">+</span>`,
                HcR: `<span style="width: 10px; text-align: center; height: 20px; vertical-align: middle; color: ${C.COLORS.brightred}; display: inline-block; font-size: 16px; font-family: 'Arial'; margin-left: -5px; margin-right: -3px; text-shadow: none; ">+</span><span style="margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: ${C.COLORS.brightred}; display: inline-block; font-size: 18px; font-family: 'Arial';">♦</span>`,
                Bc: `<span style="margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: ${C.COLORS.white}; display: inline-block; font-size: 18px; font-family: 'Arial';">♦</span>`,
                Hc: `<span style="margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: ${C.COLORS.brightred}; display: inline-block; font-size: 18px; font-family: 'Arial';">♦</span>`,
                Bs: `<span style="margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle; color: ${C.COLORS.white}; display: inline-block; font-size: 18px; font-family: 'Arial';">■</span>`,
                Hs: `<span style="margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: ${C.COLORS.brightred}; display: inline-block; font-size: 18px; font-family: 'Arial';">■</span>`,
                Bf: `<span style="margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: ${C.COLORS.white}; display: inline-block; font-size: 18px; font-family: 'Arial'; text-shadow: none;">■</span><span style="margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: ${C.COLORS.black}; display: inline-block; margin-left: -12px; font-size: 18px; font-family: 'Arial'; margin-bottom: -4px; text-shadow: none;">×</span>`,
                Hf: `<span style="margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: ${C.COLORS.brightred}; display: inline-block; font-size: 18px; font-family: 'Arial'; text-shadow: none;">■</span><span style="margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: ${C.COLORS.black}; display: inline-block; margin-left: -12px; font-size: 18px; font-family: 'Arial'; margin-bottom: -4px; text-shadow: none;">×</span>`,
                Hb: `<span style="margin-right: 2px; width: 10px; text-align: center; color: ${C.COLORS.black}; height: 24px; vertical-align: middle; display: inline-block; font-size: 18px; font-family: 'Arial'; text-shadow: 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}; line-height: 22px;">♠</span>`,
                HcRb: `<span style="width: 10px; text-align: center; height: 20px; vertical-align: middle; color: ${C.COLORS.white}; display: inline-block; font-size: 16px; font-family: 'Arial'; margin-left: -5px; margin-right: -3px; text-shadow: none; ">+</span><span style="margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: ${C.COLORS.brightred}; display: inline-block; font-size: 18px; font-family: 'Arial';">♦</span>`,
                HcLb: `<span style="margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: ${C.COLORS.brightred}; display: inline-block; font-size: 18px; font-family: 'Arial';">♦</span><span style="width: 10px; text-align: center; height: 20px; vertical-align: middle; color: ${C.COLORS.white}; display: inline-block; font-size: 16px; font-family: 'Arial'; margin-left: -5px; text-shadow: none; ">+</span>`,
                BXc: `<span style="margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: ${C.COLORS.white}; display: inline-block; font-size: 18px; font-family: 'Arial';">♦</span>`,
                HXc: `<span style="margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: ${C.COLORS.brightred}; display: inline-block; font-size: 18px; font-family: 'Arial';">♦</span>`,
                BXs: `<span style="margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle; color: ${C.COLORS.white}; display: inline-block; font-size: 18px; font-family: 'Arial';">■</span>`,
                HXs: `<span style="margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: ${C.COLORS.brightred}; display: inline-block; font-size: 18px; font-family: 'Arial';">□</span>`,
                HXb: `<span style="margin-right: 2px; width: 10px; text-align: center; color: ${C.COLORS.black}; height: 24px; vertical-align: middle; display: inline-block; font-size: 18px; font-family: 'Arial'; text-shadow: 0px 0px 2px ${C.COLORS.darkred}, 0px 0px 2px ${C.COLORS.darkred}, 0px 0px 2px ${C.COLORS.darkred}, 0px 0px 2px ${C.COLORS.darkred}, 0px 0px 2px ${C.COLORS.darkred}, 0px 0px 2px ${C.COLORS.darkred}, 0px 0px 2px ${C.COLORS.darkred}, 0px 0px 2px ${C.COLORS.darkred}, 0px 0px 2px ${C.COLORS.darkred}, 0px 0px 2px ${C.COLORS.darkred}, 0px 0px 2px ${C.COLORS.darkred}, 0px 0px 2px ${C.COLORS.darkred}; line-height: 22px;">♠</span>`,
                HCb: `<span style="margin-right: 2px; width: 10px; text-align: center; color: ${C.COLORS.darkred}; height: 24px; vertical-align: middle; display: inline-block; font-size: 18px; font-family: 'Arial'; text-shadow: 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}; line-height: 22px;">♠</span>`,
                Of: `<span style="margin-right: 2px; width: 10px; text-align: center; color: ${C.COLORS.darkred}; height: 24px; vertical-align: middle; display: inline-block; font-size: 18px; font-family: 'Arial'; line-height: 22px; text-shadow: 0px 0px 2px rgb(255,255,255), 0px 0px 2px rgb(255,255,255), 0px 0px 2px rgb(255,255,255), 0px 0px 2px rgb(255,255,255), 0px 0px 2px rgb(255,255,255), 0px 0px 4px rgb(255,255,255), 0px 0px 4px rgb(255,255,255), 0px 0px 6px rgb(255,255,255), 0px 0px 6px rgb(200,100,200), 0px 0px 8px rgb(200,100,200), 0px 0px 10px rgb(200,100,200), 0px 0px 15px rgb(200,100,200);">●</span>`,
                Os: `<span style="margin-right: 2px; width: 10px; text-align: center; color: ${C.COLORS.black}; height: 24px; vertical-align: middle; display: inline-block; font-size: 18px; font-family: 'Arial'; text-shadow: 0px 0px 2px rgb(255,255,255), 0px 0px 2px rgb(255,255,255), 0px 0px 2px rgb(255,255,255), 0px 0px 2px rgb(255,255,255), 0px 0px 2px rgb(255,255,255), 0px 0px 4px rgb(255,255,255), 0px 0px 4px rgb(255,255,255), 0px 0px 6px rgb(255,255,255), 0px 0px 6px rgb(200,100,200), 0px 0px 8px rgb(200,100,200), 0px 0px 10px rgb(200,100,200), 0px 0px 15px rgb(200,100,200); line-height: 22px;">●</span>`,
                g: `<span style="margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle; color: ${C.COLORS.darkgrey}; display: inline-block; font-size: 18px; font-family: 'Arial';">♦</span>`
            },
            secret: {
                topLineStart: `<div style="display: block; width: 100%; font-size: 18px; height: 16px; padding: 3px 0px; border-bottom: 1px solid ${C.COLORS.white};">`,
                traitLineStart: `<div style="width: 100%; height: 20px; line-height: 20px; display: block; text-align: center; color: ${C.COLORS.white}; font-variant: small-caps; border-bottom: 1px solid ${C.COLORS.white};">`,
                diceStart: `<div style="display: block ; width: 100% ; margin-left: 0% ; height: auto; line-height: 20px ; text-align: center ; font-weight: bold ; text-shadow: 0px 0px 2px ${C.COLORS.white} , 0px 0px 2px ${C.COLORS.white} , 0px 0px 2px ${C.COLORS.white} , 0px 0px 2px ${C.COLORS.white} ; margin-bottom: 0px">`,
                blockStart: "<div style=\"width: 100%; display: block; text-align: center;\">",
                startBlock: "<div style=\"display: inline-block; width: 48%; margin: 0% 1%; text-align: center;\">",
                blockNameStart: "<div style=\"display: block; width: 100%; font-size: 13px; margin-bottom: -5px; margin-top: 10px;\">",
                lineStart: "<div style=\"display: block; width: 100%; font-size: 12px;\">",
                startPlayerBlock: `<div style="display: block; width: 280px; padding: 45px 5px; margin: -26px 0px -7px -42px; color: ${C.COLORS.white}; font-family: Percolator; text-align: left; font-size: 16px; background: url('https://t4.ftcdn.net/jpg/00/78/66/11/240_F_78661103_aowhE8PWKrHRtoCUogPvkfWs22U54SuU.jpg') center no-repeat; background-size: 100% 100%; z-index: 100; position: relative;">`,
                playerTopLineStart: "<div style=\"display: block; margin-left: 28px;  width: 100%; font-size: 24px; font-family: Percolator; height: 12px; padding: 3px 0px; text-align: left;  margin-top: -16px;\">",
                playerBotLineStart: `<div style="width: 100%; height: auto; line-height: 15px; display: block;  text-align: left; color: ${C.COLORS.white}; margin: 3px 0px 9px 48px;">`,
                grey: `<span style="display:inline-block; color: ${C.COLORS.brightgrey}; font-size: 24px; font-weight: bold;">`,
                greyS: `<span style="display:inline-block; color: ${C.COLORS.brightgrey}; display: inline-block; line-height: 14px; font-family: Percolator; vertical-align: top; margin-right: 5px; margin-left: -5px;">`,
                white: `<span style="display:inline-block; color: ${C.COLORS.white}; font-size: 24px; font-weight: bold;">`,
                whiteB: `<span style="display:inline-block; color: ${C.COLORS.white}; font-size: 30px; font-weight: bold;">`,
                greyPlus: `<span style="color: ${C.COLORS.brightgrey}; font-weight: bold; display: inline-block; text-align: right; margin: 2px 5px 0px 20px; vertical-align: top; line-height: 14px;"> + </span>`,
                greyMinus: `<span style="color: ${C.COLORS.brightgrey}; font-weight: bold; display: inline-block; text-align: right; margin: 2px 5px 0px 20px; vertical-align: top; line-height: 14px;"> - </span>`
            }
        },
        ROLLRESULTEFFECTS = {
            restriction: ["success", "failure", "basicfail", "critical", "basiccrit", "messycrit", "bestialfail", "totalfail"],
            rollMod: ["restrictwpreroll1", "restrictwpreroll2", "nowpreroll", "doublewpreroll", "freewpreroll", "bestialcancelcrit", "bestialcancelsucc", "bestialcancelall", "totalfailure", "nomessycrit"]
        },
    // #endregion

    // #region GRAPHICS: Creation, Removal, Registration, Setting Sources
        makeDie = (diceCat, dieNum) => {
            const rootData = Media.GetImgData(`RollerDie_${diceCat}_1`),
                dieKey = `RollerDie_${diceCat}_${dieNum}`,
                padShift = -0.5 * rootData.width
            Media.MakeImg(dieKey, {
                left: rootData.left + SETTINGS.dice[diceCat].spread * (dieNum - 1),
                top: rootData.top,
                width: rootData.width,
                height: rootData.height,
                layer: "map",
                isDrawing: true,
                controlledby: "",
                showname: false,
                activeLayer: "map",
                modes: rootData.modes,
                isActive: false
            }, false, true)
            Media.AddImgSrc(null, dieKey, `ref:${rootData.name}`, true)
            Media.SetImg(dieKey, "Bf", true)
            DragPads.MakePad(dieKey, "selectDie", {deltaHeight: padShift, deltaWidth: padShift})
            return true
        },
        clearDice = diceCat => {
            const returnLines = []
            DragPads.DelPad(`RollerDie_${diceCat}_1`)
            for (let i = 2; i <= SETTINGS.dice[diceCat].qty; i++) {
                const imgKey = `RollerDie_${diceCat}_${i}`,
                    imgData = Media.GetImgData(imgKey)
                if (VAL({list: imgData}))
                    returnLines.push(`[${i}] ${Media.RemoveImg(imgKey) ? "<span style='color: green;'><b>OK!</b></span>" : "<span style='color: red;'><b>ERROR!</b></span>"}`)
            }
            returnLines[0] = `<b>Removing <u>${diceCat}</u> Dice:</b> [1] <span style='color: green;'><b>OK!</b></span>, ${returnLines[0]}`
            return returnLines
        },
        makeAllDice = (diceCat) => {
            const returnLines = []
            if (Media.IsRegistered(`RollerDie_${diceCat}_2`))
                clearDice(diceCat)
            const padShift = -0.5 * Media.GetImgData(`RollerDie_${diceCat}_1`).width
            DragPads.MakePad(`RollerDie_${diceCat}_1`, "selectDie", {deltaHeight: padShift, deltaWidth: padShift})
            for (let i = 2; i <= SETTINGS.dice[diceCat].qty; i++)
                returnLines.push(`[${i}] ${makeDie(diceCat, i) ? "<span style='color: green;'><b>OK!</b></span>" : "<span style='color: red;'><b>ERROR!</b></span>"}`)
            returnLines[0] = `<b>Creating <u>${diceCat}</u> Dice:</b> [1] <span style='color: green;'><b>OK!</b></span>, ${returnLines[0]}`
            return returnLines            
        },
        getColor = (rollType, rollLine, colorRef) => {
            if (colorRef)
                return VAL({string: COLORSCHEMES[rollType][rollLine][colorRef]}) && COLORSCHEMES[rollType][rollLine][colorRef] || COLORSCHEMES.base[rollLine]
            return VAL({string: COLORSCHEMES[rollType][rollLine]}) && COLORSCHEMES[rollType][rollLine] || COLORSCHEMES.base[rollLine]          
        },
        clearRoller = () => {
            const topMidRefs = []
            for (const textKey of SETTINGS.textKeys)
                Media.ToggleText(textKey, false, true)
            for (const [diceCat, diceData] of Object.entries(SETTINGS.dice))
                for (let i = 1; i <= diceData.qty; i++)
                    Media.ToggleImg(`RollerDie_${diceCat}_${i}`, false, true)  
            for (let i = 1; i <= SETTINGS.frame.mids.qty; i++) {
                topMidRefs.push(`RollerFrame_TopMid_${i}`)
                Media.ToggleImg(`RollerFrame_BottomMid_${i}`, false, true)   
            }
            Media.ToggleImg("RollerFrame_Diff", false, true)
            Media.ToggleImg("RollerFrame_Left", true, true)
            Media.SetImg("RollerFrame_Left", "top")
            Media.ToggleImg("RollerFrame_BottomEnd", false, true)
            Media.Spread("RollerFrame_Left", "RollerFrame_TopEnd", topMidRefs, 1, SETTINGS.frame.mids.minSpread, SETTINGS.frame.mids.maxSpread)
            DragPads.Toggle("wpReroll", false)
            Media.ToggleAnim("Roller_WPReroller_1", false)
            Media.ToggleImg("Roller_WPReroller_Base_1", false)
            Media.ToggleAnim("Roller_WPReroller_2", false)
            Media.ToggleImg("Roller_WPReroller_Base_2", false)
            // Media.Fix()
        }, // "<h3><span style='color: green;'>Time, Weather & Horizon Data Updated!</span></h3>"
        killRoller = () => {
            const returnLines = [ 
                {header: "<h3>Clearing Dice Roller Frame...</h3>", entries: []},
                {header: "<h3>Clearing Drag Pads...</h3>", entries: []},
                {header: "<h3>Clearing Dice...</h3>", entries: []}
            ]
            for (let i = 2; i <= SETTINGS.frame.mids.qty; i++) {
                const topImgName = `RollerFrame_TopMid_${i}`,
                    bottomImgName = `RollerFrame_BottomMid_${i}`
                returnLines[0].entries.push(
                    `... Removing <b>${topImgName}</b>: ${Media.RemoveImg(topImgName) ? "<span style='color: green;'><b>OK!</b></span>" : "<span style='color: red;'><b>ERROR!</b></span>"}`,
                    `... Removing <b>${bottomImgName}</b>: ${Media.RemoveImg(bottomImgName) ? "<span style='color: green;'><b>OK!</b></span>" : "<span style='color: red;'><b>ERROR!</b></span>"}`
                )
            }
            DragPads.DelPad("selectDie")
            returnLines[1].entries.push("... Removing <b>Main Dice</b> Drag Pads (x30): <span style='color:green;'><b>OK!</b></span> (x30)", "... Removing <b>Big Dice</b> Drag Pads (x2): <span style='color:green;'><b>OK!</b></span> (x2)")
            DragPads.DelPad("wpReroll")
            returnLines[1].entries.push("... Removing <b>Willpower Reroll</b> Drag Pad: <span style='color:green;'><b>OK!</b></span>")
            for (const diceCat of Object.keys(SETTINGS.dice))
                returnLines[2].entries.push(clearDice(diceCat).join(", "))
        },
        initFrame = (isQueuing = true) => {
            const imgDataTop = Media.GetImgData("RollerFrame_TopMid_1"),
                imgDataBottom = Media.GetImgData("RollerFrame_BottomMid_1"),
                initFunc = () => {
                    const returnLines = [ 
                        {header: "<h3>Creating Dice Roller Frame...</h3>", entries: []},
                        {header: "<h3>Creating Drag Pads...</h3>", entries: []},
                        {header: "<h3>Creating Dice...</h3>", entries: []}
                    ]
                    for (let i = 2; i <= SETTINGS.frame.mids.qty; i++) {
                        const imgKeyTop = `RollerFrame_TopMid_${i}`,
                            imgKeyBottom = `RollerFrame_BottomMid_${i}`
                        Media.MakeImg(imgKeyTop, {
                            imgsrc: imgDataTop.srcs.base,
                            top: imgDataTop.top,
                            left: imgDataTop.top + SETTINGS.frame.mids.minSpread * (i - 1),
                            height: imgDataTop.height,
                            width: imgDataTop.width,
                            activeLayer: "map",
                            modes: imgDataTop.modes,
                            isActive: false,
                            isDrawing: true
                        }, false, true )
                        Media.MakeImg(imgKeyBottom, {
                            imgsrc: imgDataBottom.srcs.base,
                            top: imgDataBottom.top,
                            left: imgDataBottom.top + SETTINGS.frame.mids.minSpread * (i - 1),
                            height: imgDataBottom.height,
                            width: imgDataBottom.width,
                            activeLayer: "map",
                            modes: imgDataBottom.modes,
                            isActive: false,
                            isDrawing: true
                        }, false, true )
                        returnLines[0].entries.push(
                            `... Creating <b>${imgKeyTop}</b>: <span style='color: green;'><b>OK!</b></span>`,
                            `... Creating <b>${imgKeyBottom}</b>: <span style='color: green;'><b>OK!</b></span>`
                        )
                    }
                    returnLines[1].entries.push("... Creating <b>Main Dice</b> Drag Pads (x30): <span style='color:green;'><b>OK!</b></span> (x30)", "... Creating <b>Big Dice</b> Drag Pads (x2): <span style='color:green;'><b>OK!</b></span> (x2)")
                    returnLines[1].entries.push("... Creating <b>Willpower Reroll</b> Drag Pad: <span style='color:green;'><b>OK!</b></span>")
                    for (const diceCat of Object.keys(SETTINGS.dice))
                        returnLines[2].entries.push(makeAllDice(diceCat).join(", "))
                    DragPads.MakePad("Roller_WPReroller_Base_1", "wpReroll")
                    return [
                        `${returnLines[0].header}${returnLines[0].entries.join("<br>")}`,
                        `${returnLines[1].header}${returnLines[1].entries.join("<br>")}`,
                        `${returnLines[2].header}${returnLines[2].entries.join("<br>")}`
                    ]
                }
            if (isQueuing)
                if (D.IsFuncQueueClear("Roller")) {
                    D.Queue(clearRoller, [], "Roller")
                    D.Queue(killRoller, [], "Roller")
                    D.Queue(initFunc, [], "Roller", 5)
                    // D.Queue(DragPads.MakePad, ["RollerFrame_WPRerollPlaceholder_1", "wpReroll"], "Roller")
                    D.Queue(clearRoller, [], "Roller")
                    D.Queue(Media.Fix, [], "Roller")
                    D.Queue(D.Alert, ["Roller Rebuilt!", "Initialize Roller Frame"], "Roller")
                    D.Run("Roller")
                } else {
                    THROW("Attempt to queue functions into busy queue!", "initFrame")
                }
            else
                initFunc()           
        },
        setDie = (dieCat, dieNum, dieVal, rollType) => {
            const dieKey = `RollerDie_${dieCat}_${dieNum}`
            if (dieVal) {
                if (dieVal.includes("selected") && STATE.REF.selected[dieCat].includes(dieNum)) {
                    dieVal = STATE.REF.diceVals[dieCat][dieNum]
                    rollType = rollType || "trait"
                }
                Media.SetImg(dieKey, dieVal, true)
                if (!dieVal.includes("selected"))
                    STATE.REF.diceVals[dieCat][dieNum] = dieVal
            } else {
                Media.ToggleImg(dieKey, false)
                delete STATE.REF.diceVals[dieCat][dieNum]
            }
            if (dieVal && dieVal.includes("selected"))
                STATE.REF.selected[dieCat] = _.uniq([...STATE.REF.selected[dieCat], dieNum])
            else
                STATE.REF.selected[dieCat] = _.without(STATE.REF.selected[dieCat], dieNum)
            
            DB({dieVal, rollType, isHungerDie: dieVal && dieVal.includes("H"), isSelectedDie: dieVal && dieVal.includes("selected"), dragPadStatus: dieVal && !dieVal.includes("H") && (dieVal.includes("selected") || rollType === "trait")}, "setDie")
            if (dieVal && !dieVal.includes("H") && (dieVal.includes("selected") || rollType === "trait"))
                DragPads.Toggle(dieKey, true)
            else
                DragPads.Toggle(dieKey, false)
            if (_.flatten(_.values(STATE.REF.selected)).length) {          
                DragPads.Toggle("wpReroll", true)
                Media.ToggleAnim("Roller_WPReroller_1", true)
                Media.ToggleImg("Roller_WPReroller_Base_1", true)
                Media.ToggleAnim("Roller_WPReroller_2", true)
                Media.ToggleImg("Roller_WPReroller_Base_2", true)
            } else {
                DragPads.Toggle("wpReroll", false)
                Media.ToggleAnim("Roller_WPReroller_1", false)
                Media.ToggleImg("Roller_WPReroller_Base_1", false)
                Media.ToggleAnim("Roller_WPReroller_2", false)
                Media.ToggleImg("Roller_WPReroller_Base_2", false)
            }
        },
        selectDie = (dieCat, dieNum) => {
            const rollRecord = getCurrentRoll(false),
                selectType = rollRecord.rollResults.wpCost === 0 && "selectedFree" ||
                             rollRecord.rollResults.wpCost === 1 && "selected" ||
                             "selectedDouble"
            setDie(dieCat, dieNum, selectType)
            if (STATE.REF.selected[dieCat].length > (rollRecord.rollResults.maxRerollDice || 3))
                selectDie(dieCat, STATE.REF.selected[dieCat][0])
            if (STATE.REF.selected[dieCat].length) {
                lockRoller(true)
                DragPads.Toggle("wpReroll", true)
                Media.ToggleAnim("Roller_WPReroller_1", true)
                Media.ToggleImg("Roller_WPReroller_Base_1", true)
                Media.ToggleAnim("Roller_WPReroller_2", true)
                Media.ToggleImg("Roller_WPReroller_Base_2", true)
            } else if (STATE.REF.selected[dieCat].length === 0) {
                lockRoller(false)
                DragPads.Toggle("wpReroll", false)
                Media.ToggleAnim("Roller_WPReroller_1", false)
                Media.ToggleImg("Roller_WPReroller_Base_1", false)
                Media.ToggleAnim("Roller_WPReroller_2", false)
                Media.ToggleImg("Roller_WPReroller_Base_2", false)
            }
        },
        setDieCat = (dieCat, dieVals = [], rollType) => {
            for (let i = 1; i <= SETTINGS.dice[dieCat].qty; i++)
                setDie(dieCat, i, dieVals[i-1] || false, rollType)
        },
    // #endregion

    // #region ROLL EFFECTS: Applying, Creating, Removing
        applyRollEffects = rollInput => {
            const rollEffectString = D.GetStatVal(rollInput.charID, "rolleffects") || ""
            let isReapplying = false
            if (VAL({string: rollEffectString, list: rollInput}, "applyRollEffects")) {
                rollInput.appliedRollEffects = rollInput.appliedRollEffects || []
                const rollEffects = _.compact(_.without(_.uniq([...rollEffectString.split("|"), ...Object.keys(STATE.REF.rollEffects), ...rollInput.rollEffectsToReapply || []]), ...rollInput.appliedRollEffects)),
                    [rollData, rollResults] = rollInput.rolls ? [null, rollInput] : [rollInput, null],
                    checkInput = (input, rollMod, restriction) => {
                        DB({rollMod, restriction, "Boolean(input.rolls)": Boolean(input.rolls), "D.IsIn(restriction/rollMod, RREFFECTS.restriction/rollMod)": Boolean(D.IsIn(restriction, ROLLRESULTEFFECTS.restriction, true) || D.IsIn(rollMod, ROLLRESULTEFFECTS.rollMod, true))}, "checkInput")
                        return Boolean(input.rolls) === Boolean(D.IsIn(restriction, ROLLRESULTEFFECTS.restriction, true) || D.IsIn(rollMod, ROLLRESULTEFFECTS.rollMod, true))
                    },
                    checkRestriction = (input, traits, flags, rollMod, restriction) => {
                        DB({"Checking Restriction": restriction, traits, flags, rollMod}, "checkRestriction")
                        // FIRST, check whether this restriction applies to the given input (either rollData or rollResults):
                        if (!checkInput(input, rollMod, restriction)) {
                            DB("... checkInput returns FALSE: returning 'INAPPLICABLE'.", "checkRestriction")
                            return "INAPPLICABLE"
                        }
                        DB("CheckInput returns TRUE: continuing validation.", "checkRestriction")
                        if (restriction === "all") {
                            DB("... Restriction = ALL:  RETURNING TRUE", "checkRestriction")
                            return true
                        }
                        if (rollResults) {
                        // Does rollMod specify a willpower cost, but it is superceded by a nowpreroll restriction somewhere in the effect?
                            switch (rollMod) {
                                case "doublewpreroll": case "freewpreroll": case "restrictwpreroll1": case "restrictwpreroll2":
                                    if (_.any(rollEffects, v => v.includes("nowpreroll"))) {
                                        DB(`Willpower cost ${rollMod} SUPERCEDED by 'nowpreroll': ${D.JSL(rollEffects)}`, "checkRestriction")
                                        return "INAPPLICABLE"
                                    }
                                    break
                            // no default
                            }
                            // TEST: If rollResults and rollInput specifies a result restriction, check if it applies.
                            const effectiveMargin = input.total - (input.diff || 1) // All rolls have a base difficulty of one if difficulty isn't specified.
                            switch (restriction) {
                                case "success":
                                    DB({rollResultsRestriction: restriction, test: "effectiveMargin >= 0", effectiveMargin, "passesRestriction?": effectiveMargin >= 0}, "checkRestriction")
                                    return effectiveMargin >= 0
                                case "failure":
                                    DB({rollResultsRestriction: restriction, test: "effectiveMargin < 0", effectiveMargin, "passesRestriction?": effectiveMargin < 0}, "checkRestriction")
                                    return effectiveMargin < 0
                                case "basicfail":
                                    DB({rollResultsRestriction: restriction, test: "effectiveMargin < 0 && input.H.botches === 0 && input.B.succs + input.H.succs > 0", effectiveMargin, "input.H.botches": input.H.botches, "input.B.succs": input.B.succs, "input.H.succs": input.H.succs, "passesRestriction?": effectiveMargin < 0 && input.H.botches === 0 && input.B.succs + input.H.succs > 0}, "checkRestriction")
                                    return effectiveMargin < 0 && input.H.botches === 0 && input.B.succs + input.H.succs > 0 // fail AND not bestial fail AND not total fail
                                case "critical":
                                    DB({rollResultsRestriction: restriction, test: "effectiveMargin >= 0 && input.critPairs.bb + input.critPairs.hb + input.critPairs.hh > 0", effectiveMargin, "passesRestriction?": effectiveMargin >= 0 && input.critPairs.bb + input.critPairs.hb + input.critPairs.hh > 0}, "checkRestriction")
                                    return effectiveMargin >= 0 && input.critPairs.bb + input.critPairs.hb + input.critPairs.hh > 0
                                case "basiccrit":
                                    DB({rollResultsRestriction: restriction, test: "effectiveMargin >= 0 && input.critPairs.bb > 0 && input.critPairs.hh + input.critPairs.hb === 0", effectiveMargin, "passesRestriction?": effectiveMargin >= 0 && input.critPairs.bb > 0 && input.critPairs.hh + input.critPairs.hb === 0}, "checkRestriction")
                                    return effectiveMargin >= 0 && input.critPairs.bb > 0 && input.critPairs.hh + input.critPairs.hb === 0
                                case "messycrit":
                                    DB({rollResultsRestriction: restriction, test: "effectiveMargin >= 0 && input.critPairs.hh + input.critPairs.hb > 0", effectiveMargin, "passesRestriction?": effectiveMargin >= 0 && input.critPairs.hh + input.critPairs.hb > 0}, "checkRestriction")
                                    return effectiveMargin >= 0 && input.critPairs.hh + input.critPairs.hb > 0
                                case "bestialfail":
                                    DB({rollResultsRestriction: restriction, test: "effectiveMargin < 0 && input.H.botches > 0", effectiveMargin, "passesRestriction?": effectiveMargin < 0 && input.H.botches > 0}, "checkRestriction")
                                    return effectiveMargin < 0 && input.H.botches > 0
                                case "totalfail":
                                    DB({rollResultsRestriction: restriction, test: "input.B.succs + input.H.succs === 0", effectiveMargin, "passesRestriction?": input.B.succs + input.H.succs === 0}, "checkRestriction")
                                    return input.B.succs + input.H.succs === 0
                            // no default
                            }
                        }
                        // After assessing rollData/rollResults-specific restrictions, check restrictions that apply to either:
                        DB("Initial Thresholds PASSED.  Moving on to general restrictions.", "checkRestriction")
                        if (D.IsIn(restriction, C.CLANS, true)) {
                            DB(`Restriction = CLAN.  Character Clan: ${D.GetStatVal(input.charID, "clan")}`, "checkRestriction")
                            if (!D.IsIn(D.GetStatVal(input.charID, "clan"), restriction, true)) {
                                DB("... Check FAILED.  Returning FALSE", "checkRestriction")
                                return false
                            }
                            DB("... Check PASSED. Moving on...", "checkRestriction")
                        } else if (D.IsIn(restriction, C.SECTS, true)) {
                            DB(`Restriction = SECT.  Character Sect: ${D.GetStatVal(input.charID, "sect")}`, "checkRestriction")
                            if (!D.IsIn(D.GetStatVal(input.charID, "sect"), restriction, true)) {
                                DB("... Check FAILED.  Returning FALSE", "checkRestriction")
                                return false
                            }
                            DB("... Check PASSED. Moving on...", "checkRestriction")
                        // TEST: If restriction is "physical", "social" or "mental", does an appropriate trait match?
                        } else if (D.IsIn(restriction, ["physical", "mental", "social"], true)) {
                            DB(`Restriction = ARENA.  Trait Keys: ${D.JSL(Object.keys(traits))}`, "checkRestriction")
                            if (!_.intersection(_.map([...C.ATTRIBUTES[restriction], ...C.SKILLS[restriction]], v => v.toLowerCase()), Object.keys(traits)).length) {
                                DB("... Check FAILED.  Returning FALSE", "checkRestriction")
                                return false
                            }
                            DB("... Check PASSED. Moving on...", "checkRestriction")
                        // TEST: If restriction starts with "char:", is the named character rolling?
                        } else if (restriction.startsWith("char:")) {
                            DB(`Restriction = CHARACTER.  ID: ${(D.GetChar(restriction.replace(/char:/gu, "")) || {id: false}).id}`, "checkRestriction")
                            if (input.charID !== (D.GetChar(restriction.replace(/char:/gu, "")) || {id: false}).id) {
                                DB("... Check FAILED.  Returning FALSE", "checkRestriction")
                                return false
                            }
                            DB("... Check PASSED. Moving on...", "checkRestriction")
                        } else if (restriction.startsWith("loc:")) {
                            DB("Restriction = LOCATION", "checkRestriction")


                            const loc = restriction.replace(/loc:/gu, ""),
                                locations = {
                                    center: _.without([
                                        Media.GetImgData("DistrictCenter").activeSrc,
                                        Media.GetImgData("SiteCenter").activeSrc
                                    ], "blank"),
                                    left: _.without([
                                        Media.GetImgData("DistrictLeft").activeSrc,
                                        Media.GetImgData("SiteLeft").activeSrc
                                    ], "blank"),
                                    right: _.without([
                                        Media.GetImgData("DistrictRight").activeSrc,
                                        Media.GetImgData("SiteRight").activeSrc
                                    ], "blank")
                                }
                            DB(`... ${D.JSL(loc)} vs. ${D.JSL(locations)}`, "checkRestriction")
                            if (locations.center.length) {
                                if (!D.IsIn(loc, locations.center, true)) {
                                    DB("... CENTER LOCATION Check FAILED.  Returning FALSE", "checkRestriction")
                                    return false
                                }
                                DB("... Check PASSED. Moving on...", "checkRestriction")
                            } else if (Media.IsInside(Char.GetToken(input.charID), "sandboxLeft")) {
                                if (!D.IsIn(loc, locations.left, true)) {
                                    DB("... LEFT LOCATION Check FAILED.  Returning FALSE", "checkRestriction")
                                    return false
                                }
                                DB("... Check PASSED. Moving on...", "checkRestriction")
                            } else if (!D.IsIn(loc, locations.right, true)) {
                                DB("... RIGHT LOCATION Check FAILED.  Returning FALSE", "checkRestriction")
                                return false
                            }
                            DB("... Check PASSED. Moving on...", "checkRestriction")
                        // TEST: If none of the above, does restriction match a trait or a flag?
                        } else if (!D.IsIn(restriction, [...Object.keys(traits), ...Object.keys(flags)], true)) {
                            DB(`TRAIT/FLAG check FAILED for: ${D.JSL(Object.keys(traits))} and ${D.JSL(Object.keys(flags))}, returning FALSE`, "checkRestriction")
                            return false
                        }
                    // If effect passes all of the threshold tests, return true.
                        DB("All Threshold Checks Passed!  Returning TRUE", "checkRestriction")
                        return true
                    }
                DB({rollEffectString, "Parsed rollEffects": rollEffects, rollInput}, "applyRollEffects")
                for (const effectString of rollEffects) {
                // First, check if the global effect state variable holds an exclusion for this character ID AND effect isn't in rollEffectsToReapply.
                    if (STATE.REF.rollEffects[effectString] && STATE.REF.rollEffects[effectString].includes(rollInput.charID))
                        continue
                // Parse the effectString for all of the relevant parameters
                    let [rollRestrictions, rollMod, rollLabel, removeWhen, /* sheetMessage, gmNote */] = effectString.split(";"),
                        [rollTarget, rollTraits, rollFlags] = ["", {}, {}];
                    [rollMod, rollTarget] = _.map(rollMod.split(":"), v => D.Int(v) || v.toLowerCase())
                    rollRestrictions = _.map(rollRestrictions.split("/"), v => v.toLowerCase())
                    rollTraits = _.object(
                        _.map(Object.keys(rollInput.traitData), v => v.toLowerCase()),
                        _.map(_.values(rollInput.traitData), v => D.Int(v.value))
                    )
                    DB({effectString, rollRestrictions, rollMod, rollLabel, removeWhen, rollTarget, rollTraits, rollFlags}, "applyRollEffects")
                // Before parsing rollFlags, filter out the ones that have already been converted into strings:
                    DB(`Checking Filtered Flag Error: ${D.JSL([...rollInput.posFlagLines, ...rollInput.negFlagLines, ...rollInput.redFlagLines, ...rollInput.goldFlagLines])}`, "applyRollEffects")
                    const filteredFlags = _.reject([...rollInput.posFlagLines, ...rollInput.negFlagLines, ...rollInput.redFlagLines, ...rollInput.goldFlagLines], v => _.isString(v))
                    rollFlags = _.object(
                        _.map(filteredFlags, v => v[1].toLowerCase().replace(/\s*?\(●*?\)/gu, "")),
                        _.map(filteredFlags, v => v[0])
                    )
                    DB(`Roll Traits: ${D.JSL(rollTraits)}<br>Roll Flags: ${D.JSH(rollFlags)}`, "applyRollEffects")

                // THRESHOLD TEST OF ROLLTARGET: IF TARGET SPECIFIED BUT DOES NOT EXIST, SKIP PROCESSING THIS ROLL EFFECT.
                    if (VAL({string: rollTarget}) && !D.IsIn(rollTarget, Object.keys(rollTraits), true) && !D.IsIn(rollTarget, Object.keys(rollFlags), true)) {
                        DB(`Roll Target ${rollTarget} NOT present, SKIPPING EFFECT.`, "applyRollEffects")
                        continue
                    }

                // THRESHOLD TESTS OF RESTRICTION: Parse each "OR" roll restriction (/) into "AND" restrictions (+), and finally the "NOT" restriction (!)
                    let isORSatisfied = false
                    DB(`BEGINNING TESTS OF RESTRICTION: "<b><u>${D.JSL(effectString)}</u></b><br>... --- ${rollRestrictions.length} OR-RESTRICTIONS: ${D.JSL(rollRestrictions)}`, "applyRollEffects")
                    for (const orRestrict of rollRestrictions) {
                        const andRestrict = orRestrict.split("+")
                        DB(`... Checking OR-RESTRICTION <b>'${D.JSL(orRestrict)}'</b>.  ${andRestrict.length} AND-RESTRICTIONS: ${D.JSL(andRestrict)}`, "applyRollEffects")
                        let isANDSatisfied = true
                        for (const restriction of andRestrict) {
                            if (restriction.charAt(0) === "!") {
                                DB(`... ... Checking <u>NEGATED</u> AND-RESTRICTION <b>'${D.JSL(restriction)}'</b>...`, "applyRollEffects")
                                isANDSatisfied = checkRestriction(rollInput, rollTraits, rollFlags, rollMod, restriction.slice(1)) === false
                            } else {
                                DB(`... ... Checking AND-RESTRICTION <b>'${D.JSL(restriction)}'</b>...`, "applyRollEffects")
                                isANDSatisfied = checkRestriction(rollInput, rollTraits, rollFlags, rollMod, restriction) === true
                            }
                            if (!isANDSatisfied)
                                break
                        }
                        DB(`IsEffectValid = ${D.JSL(isANDSatisfied)}`, "applyRollEffects")
                        if (isANDSatisfied) {
                            isORSatisfied = true
                            break
                        }
                    }
                    DB(`IsEffectOKAY = ${D.JSL(isORSatisfied)}`, "applyRollEffects")
                    if (!isORSatisfied)
                        continue

                    DB("Threshold Tests Passed!", "applyRollEffects")
                // THRESHOLD TESTS PASSED.  CHECK FOR 'ISONCEONLY' AND FIRE IT ACCORDINGLY
                // If "isOnceOnly" set, add an exclusion to the global state variable OR remove this effect from the character-specific attribute.
                    switch (removeWhen || "never") {
                        case "never":
                            break
                        case "once":
                            if (STATE.REF.rollEffects[effectString])
                                STATE.REF.rollEffects[effectString] = _.union(STATE.REF.rollEffects[effectString], [rollInput.charID])
                            else
                                setAttrs(rollInput.charID, {rolleffects: _.compact(D.GetStatVal(rollInput.charID, "rolleffects").replace(effectString, "").replace(/\|\|/gu, "|").split("|")).join("|")})
                            break
                        default:
                            TimeTracker.SetAlarm(
                                removeWhen,
                                `RemEffect${effectString}`,
                                C.HTML.Block([
                                    C.HTML.Header(`Removed Roll Effect from ${D.GetName(rollInput.charID)}:`),
                                    C.HTML.Body(effectString)
                                ].join("")),
                                `!roll effect del char ${rollInput.charID} ${effectString}`,
                                [],
                                `!roll effect add char ${rollInput.charID} ${effectString}`,
                                false,
                                false
                            )
                            break
                    }
                // FIRST ROLLMOD PASS: CONVERT TO NUMBER.
                // Check whether parsing RollData or RollResults
                    let isEffectMoot = false
                    if (VAL({list: rollData})) {
                        DB(`Validated RollData: ${D.JSL(rollData)}`, "applyRollEffects")
                    // Is rollMod a number?
                        if (VAL({number: rollMod})) {
                        // If rollMod is a number, Is there a rollTarget?
                            if (VAL({string: rollTarget}))
                            // If so, is the rollTarget present in traits?
                                if (D.IsIn(rollTarget, Object.keys(rollTraits), true))
                                // If so, cap any negative modifier to the value of the target trait (i.e. no negative traits)
                                    rollMod = rollMod < 0 ? Math.max(-1 * rollTraits[rollTarget], rollMod) : rollMod
                            // If not in traits, rollTarget must be in flags (validation happened above)
                                else
                                // Cap any negative modifier to the value of the flag (i.e. no negative flags)
                                    rollMod = rollMod < 0 ? Math.max(-1 * _.find(rollFlags, (v, k) => k.includes(rollTarget)), rollMod) : rollMod
                        // (If no rollTarget, apply mod as a straight modifier --- i.e. unchanged until capping, below.)
                        } else {
                        // If rollMod isn't a number, is it adding or subtracting a trait value?
                            if (rollMod.includes("postrait"))
                                rollMod = D.Int(D.GetStatVal(rollData.charID, rollMod.replace(/postrait/gu, "")))
                            else if (rollMod.includes("negtrait"))
                                rollMod = -1 * D.Int(D.GetStatVal(rollData.charID, rollMod.replace(/negtrait/gu, "")))
                        // If not postrait/negtrait, is it a multiplier?
                            else if (rollMod.startsWith("x") && VAL({number: rollMod.replace(/x/gu, "")}))
                            // If so, is there a rollTarget?
                                if (VAL({string: rollTarget})) {
                                // If so, is the rollTarget present in traits?
                                    if (D.IsIn(rollTarget, Object.keys(rollTraits), true))
                                    // If so, multiply trait accordingly (rounding DOWN to a minimum of one) and set rollMod to the difference.
                                        rollMod = Math.max(1, Math.floor(rollTraits[rollTarget] * parseFloat(rollMod.replace(/x/gu, "")))) - rollTraits[rollTarget]
                                // If not in traits, rollTarget must be in flags (validation happened above)
                                    else
                                    // If so, multiply the flag accordingly (rounding DOWN to a minimum of one) and set rollMod to the difference.
                                        rollMod = Math.max(1, Math.floor(_.find(rollFlags, (v, k) => k.includes(rollTarget)) * parseFloat(rollMod.replace(/x/gu, "")))) - _.find(rollFlags, (v, k) => k.includes(rollTarget))
                                // Otherwise, multiply the whole dice pool by the multiplier, rounding DOWN to a minimum of one, and set rollMod to the difference.
                                } else {
                                    rollMod = Math.max(1, Math.floor(rollData.dicePool * parseFloat(rollMod.replace(/x/gu, "")))) - rollData.dicePool
                                }
                        }

                    // FIRST ROLLMOD PASS COMPLETE: ROLLMOD SHOULD BE AN INTEGER BY THIS POINT.
                        if (!isEffectMoot)
                            if (VAL({number: rollMod}, "applyRollEffects")) {
                            // Adjust dice pool by rollMod, adding a gold flag if One Die Minimum applies.
                                const initialHungerPool = rollData.hungerPool
                                rollData.dicePool += rollMod
                                if (rollMod > 0)
                                    rollData.posFlagMod += rollMod
                                else
                                    rollData.negFlagMod += rollMod
                                if (rollData.basePool + rollMod < 0) {
                                    rollData.hungerPool += rollData.basePool + rollMod
                                    rollData.basePool = 0
                                } else {
                                    rollData.basePool += rollMod
                                }

                                if (rollData.dicePool <= 0) {
                                    rollData.dicePool = 1
                                    if (initialHungerPool >= 1)
                                        rollData.hungerPool = 1
                                    else
                                        rollData.basePool = 1
                                    rollData.goldFlagLines.push([0, "One Die Minimum"])
                                }
                            // Check to see if rollLabel is calling for a RegEx replacement, and perform the calculations.
                                if (rollLabel.charAt(0) === "*") {
                                    const regexData = _.object(["traitString", "regexString", "replaceString"], rollLabel.split("~"))
                                    DB(`RegExData: ${D.JSL(regexData)}`, "applyRollEffects")
                                    let isContinuing = true
                                // Identify the target: either a trait or a flag. Start with traits (since flags will sometimes reference them,
                                // and if they do, you want to apply the effect to the trait).
                                    for (const trait of Object.keys(rollData.traitData))
                                        if (D.FuzzyMatch(rollData.traitData[trait].display, regexData.traitString)) {
                                            DB(`... Trait Found: ${D.JSL(rollData.traitData[trait])}`, "applyRollEffects")
                                            rollData.traitData[trait].display = rollData.traitData[trait].display.replace(new RegExp(regexData.regexString, "gu"), regexData.replaceString)
                                            rollData.traitData[trait].value = Math.max(0, rollData.traitData[trait].value + rollMod)
                                            DB(`... Changed To: ${D.JSL(rollData.traitData[trait])}`, "applyRollEffects")
                                            isContinuing = false
                                            break
                                        }
                                // If none found, check the flags:
                                    for (const flagType of ["posFlagLines", "negFlagLines", "redFlagLines", "goldFlagLines"]) {
                                        if (!isContinuing) break
                                        for (let i = 0; i < rollData[flagType].length; i++)
                                            if (D.FuzzyMatch(rollData[flagType][i][1], regexData.traitString)) {
                                                DB(`... Flag Found: ${D.JSL(rollData[flagType][i][1])}`, "applyRollEffects")
                                                isContinuing = false
                                                rollData[flagType][i] = [
                                                    rollData[flagType][i][0] + rollMod,
                                                    rollData[flagType][i][1].replace(new RegExp(regexData.regexString, "gu"), regexData.replaceString)
                                                ]
                                                DB(`... Changed To: ${D.JSL(rollData[flagType][i][1])}`, "applyRollEffects")
                                                break
                                            }
                                    }
                                } else {
                                // If not a regex replacement, add the rollLabel to the appropriate flag category.
                                    if (rollLabel.charAt(0) === "!")
                                        rollData.redFlagLines.push([rollMod, rollLabel.replace(/^!\s*/gu, "")])
                                    else if (rollMod > 0 || rollLabel.charAt(0) === "+")
                                        rollData.posFlagLines.push([rollMod, rollLabel.replace(/^[+-]\s*/gu, "")])
                                    else if (rollMod < 0 || rollLabel.charAt(0) === "-")
                                        rollData.negFlagLines.push([rollMod, rollLabel.replace(/^[+-]\s*/gu, "")])
                                    else
                                        rollData.goldFlagLines.push([rollMod, rollLabel])

                                }
                            }

                    // FINISHED!  ADD EFFECT TO APPLIED ROLL EFFECTS UNLESS EFFECT SAYS NOT TO.
                        if (!isReapplying)
                            rollData.appliedRollEffects = _.union(rollData.appliedRollEffects, [effectString])
                    } else if (VAL({list: rollResults}, "applyRollEffects")) {
                    // RollResults rollMods all contain discrete flags/strings, plus digits; can wipe digits for static flag:
                        DB(`Roll Results applies!  Testing rollMod replace switch: ${rollMod.toString().replace(/\d/gu, "")}`, "applyRollEffects")
                        switch (rollMod.toString().replace(/\d/gu, "")) {
                            case "restrictwpreroll": {
                                if (rollResults.isNoWPReroll) {
                                    isEffectMoot = true
                                    break
                                }
                                rollResults.maxRerollDice = D.Int(rollMod.replace(/\D*/gu, ""))
                                break
                            }
                            case "freewpreroll":
                                if (rollResults.isNoWPReroll) {
                                    isEffectMoot = true
                                    break
                                }
                                rollResults.wpCostAfterReroll = VAL({number: rollResults.wpCost}) ? rollResults.wpCost : 1
                                rollResults.wpCost = 0
                                DB(`Setting Roll Results Costs:<br>... After Reroll: ${rollResults.wpCostAfterReroll}<br>... WP Cost: ${rollResults.wpCost}`, "applyRollEffects")
                                break
                            case "nowpreroll":
                                if (rollResults.isNoWPReroll) {
                                    isEffectMoot = true
                                    break
                                }
                                rollResults.isNoWPReroll = true
                                rollResults.wpCostAfterReroll = rollResults.wpCostAfterReroll || rollResults.wpCost
                                DB(`Setting Roll Results Costs:<br>... After Reroll: ${rollResults.wpCostAfterReroll}<br>... WP Cost: ${rollResults.wpCost}`, "applyRollEffects")
                                break
                            case "doublewpreroll":
                                if (rollResults.isNoWPReroll) {
                                    isEffectMoot = true
                                    break
                                }
                                if (VAL({number: rollResults.wpCostAfterReroll}))
                                    rollResults.wpCostAfterReroll = 2
                                else
                                    rollResults.wpCost = 2
                                DB(`Setting Roll Results Costs:<br>... After Reroll: ${rollResults.wpCostAfterReroll}<br>... WP Cost: ${rollResults.wpCost}`, "applyRollEffects")
                                break
                            case "bestialcancelsucc": {
                                isReapplying = true
                                if (rollResults.diceVals.filter(x => x === "Hb").length === 0 || rollResults.total <= 0 || rollResults.B.succs === 0) {
                                    isEffectMoot = true
                                    break
                                }
                                const botchCount = rollResults.diceVals.filter(x => x === "Hb").length
                                for (let i = 0; i < botchCount; i++) {
                                    const diceValIndex = _.findIndex(rollResults.diceVals, v => v.includes("Bs")),
                                        botchIndex = _.findIndex(rollResults.diceVals, v => v === "Hb")
                                    DB(`diceValIndex: ${diceValIndex}, botchIndex: ${botchIndex}`, "applyRollEffects")
                                    if (diceValIndex < 0)
                                        continue
                                    rollResults.diceVals[botchIndex] = "HCb"
                                    rollResults.diceVals[diceValIndex] = "BXs"
                                    rollResults.B.succs--
                                    rollResults.B.fails++
                                    rollResults.total--
                                }
                                break
                            }
                            case "bestialcancelcrit": {
                                isReapplying = true
                                if (rollResults.diceVals.filter(x => x === "Hb").length === 0 || rollResults.total <= 0 || rollResults.diceVals.filter(x => x.includes("Bc")).length === 0) { // Moot if there are no bestial dice or no successes to cancel.
                                    isEffectMoot = true
                                    break
                                }
                                const botchCount = rollResults.diceVals.filter(x => x === "Hb").length
                                for (let i = 0; i < botchCount; i++) {
                                    const diceValIndex = _.findIndex(rollResults.diceVals, v => v.includes("Bc")),
                                        botchIndex = _.findIndex(rollResults.diceVals, v => v === "Hb"),
                                        diceVal = rollResults.diceVals[diceValIndex]
                                    if (diceValIndex < 0)
                                        continue
                                    rollResults.diceVals[botchIndex] = "HCb"
                                    switch (diceVal) {
                                        case "BcL": case "BcR":
                                            if (diceVal === "BcL") {
                                                rollResults.diceVals[diceValIndex + 1] = "Bc"
                                                rollResults.critPairs.bb--
                                                rollResults.B.crits++
                                            } else {
                                                rollResults.diceVals[diceValIndex - 1] = "Hc"
                                                rollResults.critPairs.hb--
                                                rollResults.H.crits++
                                            }
                                            rollResults.diceVals[diceValIndex] = "BXc"
                                            rollResults.B.fails++
                                            rollResults.total -= 3
                                            break
                                        case "Bc":
                                            rollResults.diceVals[diceValIndex] = "BXc"
                                            rollResults.B.crits--                                            
                                            rollResults.B.fails++
                                            rollResults.total--
                                            break
                                        default: break
                                    }
                                }
                                break   
                            }                         
                            case "bestialcancelall": {
                                isReapplying = true
                                if (rollResults.diceVals.filter(x => x === "Hb").length === 0 || rollResults.total <= 0 || rollResults.diceVals.filter(x => x.includes("Bc") || x.includes("Bs")).length === 0) { // Moot if there are no bestial dice or no successes to cancel.
                                    isEffectMoot = true
                                    break
                                }
                                const botchCount = rollResults.diceVals.filter(x => x === "Hb").length
                                for (let i = 0; i < botchCount; i++) {
                                    const diceValIndex = _.findIndex(rollResults.diceVals, v => rollResults.diceVals.filter(x => x.includes("Bc")).length > 0 ? v.includes("Bc") : v.includes("Bs")),
                                        botchIndex = _.findIndex(rollResults.diceVals, v => v === "Hb"),
                                        diceVal = rollResults.diceVals[diceValIndex]
                                    if (diceValIndex < 0)
                                        continue
                                    rollResults.diceVals[botchIndex] = "HCb"
                                    switch (diceVal) {
                                        case "BcL": case "BcR":
                                            if (diceVal === "BcL") {
                                                rollResults.diceVals[diceValIndex + 1] = "Bc"
                                                rollResults.critPairs.bb--
                                                rollResults.B.crits++
                                            } else {
                                                rollResults.diceVals[diceValIndex - 1] = "Hc"
                                                rollResults.critPairs.hb--
                                                rollResults.H.crits++
                                            }
                                            rollResults.diceVals[diceValIndex] = "BXc"
                                            rollResults.B.fails++
                                            rollResults.total -= 3
                                            break
                                        case "Bc": case "Bs":
                                            if (diceVal === "Bc") {
                                                rollResults.diceVals[diceValIndex] = "BXc"
                                                rollResults.B.crits--
                                            } else {
                                                rollResults.diceVals[diceValIndex] = "BXs"
                                                rollResults.B.succs--
                                            }
                                            rollResults.B.fails++
                                            rollResults.total--
                                            break
                                        default: break
                                    }
                                }
                                break
                            }
                            case "totalfailure":
                                if (rollResults.B.succs + rollResults.H.succs === 0) { // Moot if the roll result is already a Total Failure
                                    isEffectMoot = true
                                    break
                                }
                                for (let i = 0; i < rollResults.diceVals; i++) {
                                    rollResults.diceVals = _.map(rollResults.diceVals, v => {
                                        v.replace(/([BH])([csb])[LR]*?$/gu, "$1X$2")
                                    })
                                    rollResults.total = 0
                                    rollResults.B = {
                                        crits: 0,
                                        succs: 0,
                                        fails: _.reject(rollResults.rolls, v => v.includes("H")).length
                                    }
                                    rollResults.H = {
                                        crits: 0,
                                        succs: 0,
                                        fails: rollResults.total - rollResults.B.fails,
                                        botches: 0
                                    }
                                    rollResults.critPairs = {
                                        bb: 0,
                                        hb: 0,
                                        hh: 0
                                    }
                                }
                                break
                            case "nomessycrit":
                                rollResults.noMessyCrit = true
                                isReapplying = true
                                break
                            default: break
                        }
                        if (rollResults.diff && rollResults.diff !== 0)
                            rollResults.margin = rollResults.total - rollResults.diff

                        DB(`INTERIM Roll Results: ${D.JSL(rollResults)}`, "applyRollEffects")

                    // Roll flags are PRE-PARSED for rollResults (they get parsed in between rollData and rollResults creation, in other functions)
                        if (!isEffectMoot) {
                            rollLabel = rollLabel.
                                replace(/<\.>/gu, "●".repeat(Math.abs(rollMod))).
                                replace(/<#>/gu, rollMod === 0 ? "~" : rollMod).
                                replace(/<abs>/gu, rollMod === 0 ? "~" : Math.abs(rollMod)).
                                replace(/<\+>/gu, rollMod < 0 ? "-" : "+")
                            if (rollLabel.charAt(0) === "!")
                                rollResults.redFlagLines.push(rollLabel.replace(/^!\s*/gu, ""))
                            else if (rollMod > 0 || rollLabel.charAt(0) === "+")
                                rollResults.posFlagLines.push(rollLabel.replace(/^[+-]\s*/gu, ""))
                            else if (rollMod < 0 || rollLabel.charAt(0) === "-")
                                rollResults.negFlagLines.push(rollLabel.replace(/^[+-]\s*/gu, ""))
                            else
                                rollResults.goldFlagLines.push(rollLabel.trim())
                        }

                    // FINISHED!  ADD EFFECT TO APPLIED ROLL EFFECTS.
                        if (!isReapplying)
                            rollResults.appliedRollEffects = _.union(rollResults.appliedRollEffects, [effectString])
                    }
                }

            // FINISHED!  Return either rollData or rollResults, whichever you have.
            // Make sure to map the flagLines to Strings before returning.
                if (rollData) {
                    for (const flagType of ["posFlagLines", "negFlagLines", "redFlagLines", "goldFlagLines"])
                        rollData[flagType] = _.map(rollData[flagType], v => v[1].
                            replace(/<\.>/gu, "●".repeat(Math.abs(v[0]))).
                            replace(/<#>/gu, v[0] === 0 ? "~" : v[0]).
                            replace(/<abs>/gu, v[0] === 0 ? "~" : Math.abs(v[0])).
                            replace(/<\+>/gu, v[0] < 0 ? "-" : "+"))
                    DB({"ROLL DATA AFTER EFFECTS": rollData}, "applyRollEffects")
                    return rollData
                } else {
                    DB({"ROLL RESULTS AFTER EFFECTS": rollResults}, "applyRollEffects")
                    return rollResults
                }
            }
            return THROW(`Bad Roll Input!${D.JSL(rollInput)}`, "applyRollEffects")
        },
        addCharRollEffect = (charRef, effectString) => {
            const charObj = D.GetChar(charRef)
            if (VAL({charObj, string: effectString}, "addCharRollEffects")) {

                // Must extract three elements from the roll effect:
                    // RemoveWhen (to see if we need to set an alarm or tie it to an existing one)
                    // SheetMessage (to see if we need to show the player when it applies via a character sheet incapacitation note)
                    // GMNote (to include whenever the effect is displayed to the GM, as a reminder of what put it there)
                // Then, we have to create a simple label that can be used to remove it.
            //      const [,,, removeWhen, /* sheetMessage, GMNote */] = effectString.split(";")
            //      switch (D.LCase(removeWhen.replace(/:.*/gu, ""))) {
            //          case "nextfullnight": {
            //              
            //              break
            //          }
            //          case "scene": {
            //  
            //              break
            //          }
            //          case "fullweek": {
            //  
            //              break
            //          }
            //          case "endofweek": {
            //  
            //              break
            //          }
            //          case "projectresolves": {
            //  
            //              break
            //          }
            //          default: {
            //  
            //              break
            //          }
            //    }
                const rollEffects = _.compact((D.GetStatVal(charObj.id, "rolleffects") || "").split("|"))
                rollEffects.push(effectString)
                DB({charRef, effectString, rollEffects}, "addCharRollEffects")
                setAttrs(charObj.id, {rolleffects: _.uniq(rollEffects).join("|")})
                // D.Alert(`Roll Effects on ${D.GetName(charObj)} revised to:<br><br>${rollEffects.join("<br>")}`, "addCharRollEffects")
            }
        },
        delCharRollEffect = (charRef, effectString) => {
            const charObj = D.GetChar(charRef)
            let rollEffects = _.compact((D.GetStatVal(charObj.id, "rolleffects") || "").split("|"))    
            DB({charRef, effectString, rollEffects}, "delCharRollEffects")                                        
            if (VAL({charObj, string: effectString}, "delCharRollEffects")) {
                if (VAL({number: effectString}))
                    rollEffects.splice(Math.max(0, D.Int(effectString) - 1), 1)
                else if (rollEffects.includes(effectString))
                    rollEffects = _.without(rollEffects, effectString)
                else
                    return false
                setAttrs(charObj.id, {rolleffects: rollEffects.join("|")})
                return true
                // D.Alert(`Roll Effects on ${D.GetName(charObj)} revised to:<br><br>${rollEffects.join("<br>")}`, "delCharRollEffects")
            }
            return false
        },
        addGlobalRollEffect = effectString => {
            if (VAL({string: effectString}, "addGlobalRollEffects")) {
                STATE.REF.rollEffects[effectString] = []
                const rollStrings = []
                for (let i = 0; i < Object.keys(STATE.REF.rollEffects).length; i++)
                    rollStrings.push(`${i + 1}: ${Object.keys(STATE.REF.rollEffects)[i]}`)
                D.Alert(`Global Roll Effects:<br><br>${rollStrings.join("<br>")}`, "addGlobalRollEffects")
            }
        },
        delGlobalRollEffect = effectString => {
            if (VAL({number: effectString}))
                delete STATE.REF.rollEffects[Object.keys(STATE.REF.rollEffects)[Math.max(0, D.Int(effectString) - 1)]]
            else if (effectString in STATE.REF.rollEffects)
                STATE.REF.rollEffects = _.omit(STATE.REF.rollEffects, effectString)
            else
                return false
            D.Alert(`Global Roll Effects revised to:<br><br>${Object.keys(STATE.REF.rollEffects).join("<br>")}`, "delGlobalRollEffects")
            return true
        },
        addGlobalExclusion = (charRef, effectString) => {
            const charObj = D.GetChar(charRef)
            if (VAL({charObj}, "addGlobalExclusion")) {
                if (VAL({number: effectString}))
                    effectString = Object.keys(STATE.REF.rollEffects)[D.Int(effectString - 1)]      
                if (VAL({string: effectString}) && effectString in STATE.REF.rollEffects) {
                    STATE.REF.rollEffects[effectString].push(charObj.id)
                    D.Alert(`Exclusions for effect <b>${D.JS(effectString)}</b>: ${D.JS(STATE.REF.rollEffects[effectString])}`, "addGlobalExclusion")
                } else {
                    D.Alert(`No exclusion found for reference '${effectString}'`, "addGlobalExclusion")
                }
            }
        },
        delGlobalExclusion = (charRef, effectString) => {
            const charObj = D.GetChar(charRef)
            if (VAL({charObj}, "delGlobalExclusion")) {
                if (VAL({number: effectString}))
                    effectString = Object.keys(STATE.REF.rollEffects)[D.Int(effectString - 1)]    
                if (VAL({string: effectString}) && effectString in STATE.REF.rollEffects) {
                    STATE.REF.rollEffects[effectString] = _.without(STATE.REF.rollEffects[effectString], charObj.id)
                    D.Alert(`Exclusions for effect <b>${D.JS(effectString)}</b>: ${D.JS(STATE.REF.rollEffects[effectString])}`, "delGlobalExclusion")
                    return true
                } else {
                    D.Alert(`No exclusion found for reference '${effectString}'`, "delGlobalExclusion")
                }
            }        
            return false
        },     
    // #endregion

    // #region ROLL DATA: Getting, Parsing, Managing State Roll Record
        getRollChars = (charObjs) => {
            charObjs = _.flatten([charObjs])
            const playerCharObjs = charObjs.filter(x => VAL({pc: x})),
                npcCharObjs = charObjs.filter(x => VAL({npc: x})),
                dbStrings = {charObjs, playerCharObjs, npcCharObjs},
                rollCharObjs = []
            for (const charObj of playerCharObjs) {
                const charData = D.GetCharData(charObj.id) || {}
                dbStrings[`${D.GetName(charObj, true)} Data:`] = charData
                if (charData.isNPC)
                    rollCharObjs.push(D.GetChar(charData.isNPC))
                else
                    rollCharObjs.push(charObj)
            }
            dbStrings.newRollCharObjs = [...rollCharObjs]
            rollCharObjs.push(...npcCharObjs)
            dbStrings.finalRollCharObjs = [...rollCharObjs]
            DB(dbStrings, "getRollChars")
            return rollCharObjs
        },
        parseFlags = (charObj, playerCharID, rollType, params = {}, rollFlags) => {
            DB({charObj, playerCharID, rollType, params, rollFlags}, "parseFlags")
            params.args = params.args || []
            const flagData = {
                    negFlagLines: [],
                    posFlagLines: [],
                    redFlagLines: [],
                    goldFlagLines: [],
                    flagDiceMod: 0
                },
                traitList = _.compact(
                    _.map((params && params.args && params.args[1] || _.isArray(params) && params[0] || _.isString(params) && params || "").split(","), v => v.replace(/:\d+/gu, "").replace(/_/gu, " "))
                ),
                bloodPot = D.Int(D.GetStatVal(charObj.id, "blood_potency"))
            if (["rouse", "rouse2", "remorse", "check", "project", "secret", "humanity"].includes(rollType))
                return flagData
            if (D.Int(D.GetStatVal(playerCharID || charObj.id, "applyspecialty")) > 0)
                flagData.posFlagLines.push([1, "Specialty (<.>)"])
            if (D.Int(D.GetStatVal(playerCharID || charObj.id, "applyresonance")) > 0)
                flagData.posFlagLines.push([1, "Resonance (<.>)"])
            if (D.Int(D.GetStatVal(playerCharID || charObj.id, "applybloodsurge")) > 0)
                flagData.posFlagLines.push([C.BLOODPOTENCY[bloodPot].bp_surge, "Blood Surge (<.>)"])
            if (rollFlags.isDiscRoll)
                flagData.posFlagLines.push([C.BLOODPOTENCY[bloodPot].bp_discbonus, "Discipline (<.>)"])

            const flagDefs = {posMods: "posFlagLines", negMods: "negFlagLines", goldMods: "goldFlagLines", redMods: "redFlagLines"}
            for (const [type, data] of Object.entries(STATE.REF.forcedMods))
                if (data.length)
                    flagData[flagDefs[type]].push(...data)

            _.each(_.compact(_.flatten([
                D.GetStatVal(charObj.id, "incap") ? D.GetStatVal(charObj.id, "incap").split(",") : [],
                params.args.length > 3 ? params.args[4].split(",") : "",
                params.args.length > 4 ? params.args[5].split(",") : ""
            ])), flag => {
                if (flag === "Health" && _.intersection(traitList, _.map(_.flatten([C.ATTRIBUTES.physical, C.SKILLS.physical]), v => v.toLowerCase())).length)
                    flagData.negFlagLines.push([-2, "Injured (<.>)"])
                else if (flag === "Willpower" && _.intersection(traitList, _.map(_.flatten([C.ATTRIBUTES.mental, C.ATTRIBUTES.social, C.SKILLS.mental, C.SKILLS.social]), v => v.toLowerCase())).length)
                    flagData.negFlagLines.push([-2, "Exhausted (<.>)"])
                else if (flag === "Humanity")
                    flagData.negFlagLines.push([-2, "Inhuman (<.>)"])
            })

            if (flagData.posFlagLines.length || flagData.negFlagLines.length || flagData.redFlagLines.length || flagData.goldFlagLines.length) {
                const zippedPos = _.compact([...flagData.posFlagLines, ...flagData.goldFlagLines]),
                    unzippedPos = _.unzip(zippedPos),
                    reducedPos = _.reduce(unzippedPos[0], (sum, mod) => sum + mod, 0)
                DB(`Pos Flag Data: ${D.JSL(flagData)}<br>... ZIPPED: ${D.JSL(zippedPos)}<br>... UNZIPPED: ${D.JSL(unzippedPos)}<br>... REDUCED: ${D.JSL(reducedPos)}`, "parseFlags")
                const zippedNeg = _.compact([...flagData.negFlagLines, ...flagData.redFlagLines]),
                    unzippedNeg = _.unzip(zippedNeg),
                    reducedNeg = _.reduce(unzippedNeg[0], (sum, mod) => sum + mod, 0)
                DB(`Neg Flag Data: ${D.JSL(flagData)}<br>... ZIPPED: ${D.JSL(zippedNeg)}<br>... UNZIPPED: ${D.JSL(unzippedNeg)}<br>... REDUCED: ${D.JSL(reducedNeg)}`, "parseFlags")
                flagData.posFlagMod = reducedPos
                flagData.negFlagMod = reducedNeg
                flagData.flagDiceMod = reducedPos + reducedNeg
            }

            return flagData
        },
        parseTraits = (charObj, playerCharID, rollType, params = {}) => {
            playerCharID = playerCharID || charObj.id
            let traits = _.compact((params && params.args && params.args[1] || _.isArray(params) && params[0] || _.isString(params) && params || "").split(","))
            DB(`Traits: ${D.JSL(traits)}`, "parseTraits")
            const tFull = {
                traitList: [],
                traitData: {}
            }
            switch (rollType) {
                case "frenzy":
                    traits = ["willpower", "humanity"]
                    break
                case "humanity":
                case "remorse":
                    traits = ["humanity"]
                    break
                case "willpower":
                    traits = ["willpower"]
                    break
                default:
                    break
            }
            tFull.traitList = traits.map(v => v.replace(/:\d+/gu, ""))
            _.each(traits, trt => {
                if (trt.includes(":")) {
                    const tData = trt.split(":")
                    tFull.traitData[tData[0]] = {
                        display: D.Capitalize(tData[0].replace(/_/gu, " "), true),
                        value: D.Int(tData[1])
                    }
                    if (rollType === "frenzy" && tData[0] === "humanity") {
                        tFull.traitData.humanity.display = "⅓ Humanity"
                        tFull.traitData.humanity.value = Math.floor(tFull.traitData.humanity.value / 3)
                    } else if (rollType === "remorse" && tData[0] === "stains") {
                        tFull.traitData.humanity.display = "Human Potential"
                        tFull.traitData.humanity.value = Math.max(0, 10 - tFull.traitData.humanity.value - D.Int(tData[1]))
                        tFull.traitList = _.without(tFull.traitList, "stains")
                        delete tFull.traitData[tData[0]]
                    }
                } else if (D.Int(trt) || trt === "0") {
                    tFull.mod = D.Int(trt)
                    tFull.traitList = _.without(tFull.traitList, trt)
                } else {
                    tFull.traitData[trt] = {
                        display: D.IsIn(trt, undefined, true) || D.IsIn(trt.replace(/_/gu, " "), undefined, true) || D.GetStatVal(charObj.id, `${trt}_name`) || D.GetStatVal(charObj.id, `${trt.replace(/_/gu, " ")}_name`),
                        value: D.Int(D.GetStatVal(charObj.id, trt) || D.GetStatVal(charObj.id, trt.replace(/_/gu, " ")))
                    }
                    if (rollType === "frenzy" && trt === "humanity") {
                        tFull.traitData.humanity.display = "⅓ Humanity"
                        tFull.traitData.humanity.value = Math.floor(tFull.traitData.humanity.value / 3)
                    } else if (rollType === "remorse" && trt === "humanity") {
                        tFull.traitData.humanity.display = "Human Potential"
                        tFull.traitData.humanity.value = Math.max(0, 10 -
                            tFull.traitData.humanity.value -
                            D.Int(D.GetStatVal(charObj.id, "stains")))
                    } else if (!tFull.traitData[trt].display) {
                        D.Chat(charObj, `Error determining NAME of trait '${D.JS(trt)}'.`, "ERROR: Dice Roller")
                    }
                }
            })
            // D.Alert(D.JS(tFull))

            return tFull
        },
        getRollData = (charObj, rollType, params, rollFlags) => {
            /* EXAMPLE RESULTS:
              {
                charID: "-LN4P73XRfqCcI8U6c-t",
                type: "project",
                hunger: 0,
                posFlagLines: [],
                negFlagLines: [],
                redFlagLines: [],
                goldFlagLines: [],
                dicePool: 0,
                traits: ["Politics", "Resources"],
                traitData: {
                        Politics: {
                            display: "Politics",
                        value: 5
                    },
                    Resources: {
                        display: "Resources",
                        value: 5
                    }
                },
                diffMod: 1,
                prefix: "repeating_project_-LQSF9eezKZpUhKBodBR_",
                charName: "Kingston \"King\" Black",
                mod: 0,
                diff: 3
              } */
            DB({rollFlags}, "getRollData")
            const playerObj = D.GetPlayer(charObj),
                playerCharObj = playerObj && playerObj.id !== D.GMID() && D.GetChar(playerObj.id),
                flagData = parseFlags(charObj, playerCharObj && playerCharObj.id, rollType, params, rollFlags),
                traitData = parseTraits(charObj, playerCharObj && playerCharObj.id, rollType, params),                
                rollData = {
                    charID: charObj.id,
                    playerID: playerObj && playerObj.id || D.GMID(),
                    playerCharID: playerCharObj && playerCharObj.id,
                    type: rollType,
                    hunger: D.Int(D.GetStatVal(charObj.id, "hunger")),
                    posFlagLines: flagData.posFlagLines,
                    negFlagLines: flagData.negFlagLines,
                    redFlagLines: flagData.redFlagLines,
                    goldFlagLines: flagData.goldFlagLines,
                    dicePool: flagData.flagDiceMod,
                    traits: traitData.traitList,
                    traitData: traitData.traitData,
                    posFlagMod: flagData.posFlagMod || 0,
                    negFlagMod: flagData.negFlagMod || 0,
                    diffMod: 0,
                    prefix: "",
                    diff: null,
                    mod: null,
                    appliedRollEffects: [],                
                    isNPCRoll: rollFlags && rollFlags.isNPCRoll,
                    isOblivionRoll: rollFlags && rollFlags.isOblivionRoll,
                    isDiscRoll: rollFlags && rollFlags.isDiscRoll,
                    rollFlags
                }
            rollData.isOblivionRoll = rollFlags && rollFlags.isOblivionRoll
            DB({rollData}, "getRollData")
            rollData.charName = D.GetName(charObj)
            switch (rollType) {
                case "remorse":
                    rollData.diff = 0
                    rollData.mod = 0
                    break
                case "project":
                    [rollData.diff, rollData.mod, rollData.diffMod] = params.slice(1,4).map(x => D.Int(x))
                    rollData.prefix = ["repeating", "project", D.GetRepStat(charObj, "project", params[4]).rowID, ""].join("_")
                    STATE.REF.lastProjectPrefix = rollData.prefix
                    STATE.REF.lastProjectCharID = rollData.charID
                    DB(`PROJECT PREFIX: ${D.JSL(rollData.prefix)}`, "getRollData")
                    break
                case "secret":
                    rollData.diff = 0
                    rollData.mod = _.isNumber(traitData.mod) ? traitData.mod : 0
                    break
                case "frenzy":
                    [rollData.diff, rollData.mod] = params.slice(0,2).map(x => D.Int(x))
                    break
                default: {
                    rollData.diff = rollData.diff === null ? D.Int(D.GetStatVal(rollData.playerCharID || rollData.charID, "rolldiff")) : rollData.diff
                    rollData.mod = rollData.mod === null ? D.Int(D.GetStatVal(rollData.playerCharID || rollData.charID, "rollmod")) : rollData.mod
                    break
                }
            }

            if (["remorse", "project", "humanity", "frenzy", "willpower", "check", "rouse", "rouse2"].includes(rollType))
                rollData.hunger = 0

            DB({"INITIAL ROLL DATA": rollData}, "getRollData")

            return rollData
        },
        getCurrentRoll = (isNPCRoll = false) => (isNPCRoll ? STATE.REF.NPC : STATE.REF).rollRecord[(isNPCRoll ? STATE.REF.NPC : STATE.REF).rollIndex],
        setCurrentRoll = (rollIndex, isNPCRoll, isDisplayOnly = false) => {
            const rollRef = isNPCRoll ? STATE.REF.NPC : STATE.REF
            if (rollRef && rollRef.rollRecord && rollRef.rollRecord.length) {
                rollRef.rollIndex = rollIndex
                if (isDisplayOnly)
                    rollRef.rollRecord[rollIndex].rollData.notChangingStats = true
            }
        },
        replaceRoll = (rollData, rollResults, rollIndex) => {
            const recordRef = rollResults.isNPCRoll ? STATE.REF.NPC : STATE.REF
            recordRef.rollIndex = rollIndex || recordRef.rollIndex
            recordRef.rollRecord[recordRef.rollIndex] = {
                rollData: _.clone(rollData),
                rollResults: _.clone(rollResults)
            }
        },
        recordRoll = (rollData, rollResults) => {
            const recordRef = rollResults.isNPCRoll ? STATE.REF.NPC : STATE.REF
            // Make sure appliedRollEffects in both rollData and rollResults contains all of the applied effects:
            rollData.appliedRollEffects = _.uniq([...rollData.appliedRollEffects, ...rollResults.appliedRollEffects])
            rollResults.appliedRollEffects = [...rollData.appliedRollEffects]
            recordRef.rollRecord.unshift({
                rollData: _.clone(rollData),
                rollResults: _.clone(rollResults)
            })
            recordRef.rollIndex = 0
            DB({"FINAL ROLL DATA": recordRef.rollRecord[0].rollData, "FINAL ROLL RESULTS": recordRef.rollRecord[0].rollResults}, "recordRoll")
            if (recordRef.rollRecord.length > 10)
                recordRef.rollRecord.pop()
        },
    // #endregion

    // #region ROLL CONTROL: Rolling Dice & Formatting Result
        buildDicePool = rollData => {
        /* MUST SUPPLY:
				  For Rouse & Checks:    rollData = { type }
				  For All Others:        rollData = { type, mod, << traits: [],
																traitData: { value, display }, hunger >> } */
        /* EXAMPLE RESULTS:
				{
				  charID: "-LN4P73XRfqCcI8U6c-t",
				  type: "project",
				  hunger: 0,
				  posFlagLines: [],
				  negFlagLines: [],
				  dicePool: 10,
				  traits: ["Politics", "Resources"],
				  traitData: {
					  Politics: {
						  display: "Politics",
						  value: 5
				  	  },
					  Resources: {
						  display: "Resources",
						  value: 5
					  }
				  },
				  diffMod: 1,
				  prefix: "repeating_project_-LQSF9eezKZpUhKBodBR_",
				  charName: "Kingston \"King\" Black",
				  mod: 0,
				  diff: 3,
				  basePool: 10,
				  hungerPool: 0
				} */
            rollData.hunger = rollData.hunger || 0
            rollData.basePool = 0
            rollData.hungerPool = 0
            rollData.dicePool = rollData.dicePool || 0
            switch (rollData.type) {
                case "rouse2":
                    rollData.dicePool++
                    rollData.hungerPool++
            /* falls through */
                case "rouse":
                    rollData.hungerPool++
                    rollData.basePool--
            /* falls through */
                case "check":
                    rollData.dicePool++
                    rollData.basePool++

                    return rollData
                default:
                    _.each(_.values(rollData.traitData), v => {
                        rollData.dicePool += D.Int(v.value)
                    })
                    rollData.dicePool += D.Int(rollData.mod)
                    break
            }
            if (rollData.traits.length === 0 && rollData.dicePool <= 0) {
                D.Chat(D.GetChar(rollData.charID), "You have no dice to roll!", "ERROR: Dice Roller")

                return false
            }
            rollData.hungerPool = Math.min(rollData.hunger, Math.max(1, rollData.dicePool))
            rollData.basePool = Math.max(1, rollData.dicePool) - rollData.hungerPool
            DB({"ROLL DATA": rollData}, "buildDicePool")

            const rollDataEffects = applyRollEffects(rollData)

            return rollDataEffects
        },
        rollDice = (rollData, addVals) => {
            /* MUST SUPPLY:
                rollData = { type, diff, basePool, hungerPool, << diffmod >> }
                  OR
                rollData = { type, diff, rerollAmt }  */
            /* EXAMPLE RESULTS:
              {
                total: 10,
                critPairs: { bb: 1, hb: 0, hh: 0 },
                B: { crits: 0, succs: 6, fails: 2 },
                H: { crits: 0, succs: 0, fails: 0, botches: 0 },
                rolls: [ "B7", "B5", "B7", "B10", "B8", "B8", "B7", "B7", "B5", "B10" ],
                diceVals: [ "BcL", "BcR", "Bs", "Bs", "Bs", "Bs", "Bs", "Bs", "Bf", "Bf" ],
                margin: 5,
                commit: 0
              } */
            DB({"ROLL DATA": rollData}, "rollDice")
            if (addVals)
                DB({"ADDED VALS": addVals}, "rollDice")
            const forcedRolls = null, /* {
                B: [10, 10, 10, 8, 8, 8, 4, 4, 4, 4, 4, 4, 4],
                H: [1, 1, 1, 1]
            } */
                sortBins = [],
                roll = dType => {
                    const d10 = forcedRolls && forcedRolls[dType] && forcedRolls[dType].length ? forcedRolls[dType].shift() : randomInteger(10)
                    rollResults.rolls.push(dType + d10)
                    switch (d10) {
                        case 10:
                            rollResults[dType].crits++
                            rollResults.total++
                            break
                        case 9:
                        case 8:
                        case 7:
                        case 6:
                            rollResults[dType].succs++
                            rollResults.total++
                            break
                        case 5:
                        case 4:
                        case 3:
                        case 2:
                            rollResults[dType].fails++
                            break
                        case 1:
                            switch (dType) {
                                case "B":
                                    rollResults.B.fails++
                                    break
                                case "H":
                                    rollResults.H.botches++
                                    break
                                default:
                                    break
                            }
                            break
                        default:
                            break
                    }
                }
            let rollResults = {
                total: 0,
                critPairs: {
                    bb: 0,
                    hb: 0,
                    hh: 0
                },
                B: {
                    crits: 0,
                    succs: 0,
                    fails: 0
                },
                H: {
                    crits: 0,
                    succs: 0,
                    fails: 0,
                    botches: 0
                },
                rolls: [],
                diceVals: [],
                appliedRollEffects: [],
                wpCost: 1,
                isNoWPReroll: ["rouse", "rouse2", "check", "project", "secret", "humanity", "willpower", "remorse"].includes(rollData.type)
            }

            if (rollData.rerollAmt || rollData.rerollAmt === 0)
                for (let i = 0; i < rollData.rerollAmt; i++)
                    roll("B")
            else
                _.each({
                    B: rollData.basePool,
                    H: rollData.hungerPool
                }, (v, dType) => {
                    for (let i = 0; i < D.Int(v); i++)
                        roll(dType)
                })


            _.each(addVals, val => {
                const dType = val.slice(0, 1)
                switch (val.slice(1, 3)) {
                    case "cR": case "cL": case "c": case "Xc":
                        rollResults[dType].crits++
                        rollResults.total++
                        break
                    case "s": case "Xs":
                        rollResults[dType].succs++
                        rollResults.total++
                        break
                    case "f":
                        rollResults[dType].fails++
                        break
                    case "b": case "Cb": case "Xb":
                        rollResults[dType].botches++
                        break
                    default:
                        break
                }
            })

            switch (rollData.type) {
                case "secret":
                case "trait":
                case "frenzy":
                    sortBins.push("H")
                /* falls through */
                case "remorse":
                case "humanity":
                case "willpower":
                case "project":
                    sortBins.push("B")
                    while (rollResults.B.crits + rollResults.H.crits >= 2) {
                        rollResults.commit = 0
                        while (rollResults.H.crits >= 2) {
                            rollResults.H.crits -= 2
                            rollResults.critPairs.hh++
                            rollResults.total += 2
                            rollResults.diceVals.push("HcL")
                            rollResults.diceVals.push("HcR")
                        }
                        if (rollResults.B.crits > 0 && rollResults.H.crits > 0) {
                            rollResults.B.crits--
                            rollResults.H.crits--
                            rollResults.critPairs.hb++
                            rollResults.total += 2
                            rollResults.diceVals.push("HcL")
                            rollResults.diceVals.push("BcR")
                        }
                        while (rollResults.B.crits >= 2) {
                            rollResults.B.crits -= 2
                            rollResults.critPairs.bb++
                            rollResults.total += 2
                            rollResults.diceVals.push("BcL")
                            rollResults.diceVals.push("BcR")
                        }
                    }
                    _.each(["crits", "succs", "fails", "botches"], bin => {
                        _.each(sortBins, v => {
                            for (let i = 0; i < rollResults[v][bin]; i++)
                                rollResults.diceVals.push(v + bin.slice(0, 1))
                        })
                    })
                    if (rollData.diff && rollData.diff !== 0 || rollData.diffMod > 0)
                        rollResults.margin = rollResults.total - rollData.diff
                    break
                case "rouse2":
                case "rouse":
                    if (rollData.isOblivionRoll) {
                        D.Alert(`Oblivion Roll: ${D.JS(rollResults.rolls)}`)
                        rollResults.diceVals = _.map(rollResults.rolls, rol =>
                            D.Int(rol.slice(1)) === 1 && "Of" ||
                            D.Int(rol.slice(1)) === 10 && "Os" ||
                            D.Int(rol.slice(1)) < 6 && "Hb" ||
                            "Bs")                        
                        D.Alert(`Oblivion Vals: ${D.JS(rollResults.diceVals)}`)
                    } else {
                        rollResults.diceVals = _.map(rollResults.rolls, rol => D.Int(rol.slice(1)) < 6 ? "Hb" : "Bs")
                    }
                    if (rollResults.diceVals.length > 1) {
                        // let newDiceVals = []
                        // Of Hb Os Bs
                        // if rollResults.diceVals.includes("")
                        const [res1, res2] = rollResults.diceVals
                        if (res1 === "Bs" || res2 === "Of")
                            rollResults.diceVals = [res2, res1]
                    }
                    break
                case "check":
                    rollResults.diceVals = _.map(rollResults.rolls, rol => D.Int(rol.slice(1)) < 6 ? "Hf" : "Bs")
                    break
                default:
                    break
            }
            if (!(rollResults.commit && rollResults.commit === 0)) {
                const scope = rollData.diff - rollData.diffMod - 2
                rollResults.commit = Math.max(1, scope + 1 - rollResults.margin)
            }
            DB({rollResults}, "rollDice")

            rollResults = applyRollEffects(Object.assign(rollResults, rollData))
            


            // Now run through again to find consecutive crits and apply them UNLESS no crits:

            

            if (!["rouse", "rouse2", "check"].includes(rollData.type)) {
                // First, remove ALL valid crits from diceVals:
                const diceVals = rollResults.diceVals.filter(x => !x.includes("Hc") && !x.includes("Bc"))
                // Second, find new crit pairs and update the tallies appropriately:           
                while (rollResults.B.crits + rollResults.H.crits >= 2) {
                    while (rollResults.H.crits >= 2) {
                        rollResults.H.crits -= 2
                        rollResults.critPairs.hh++
                        rollResults.total += 2
                    }
                    if (rollResults.B.crits > 0 && rollResults.H.crits > 0) {
                        rollResults.B.crits--
                        rollResults.H.crits--
                        rollResults.critPairs.hb++
                        rollResults.total += 2
                    }
                    while (rollResults.B.crits >= 2) {
                        rollResults.B.crits -= 2
                        rollResults.critPairs.bb++
                        rollResults.total += 2
                    }
                }
                // Third, construct the new front end containing ALL crits:
                const critFrontEnd = []
                for (let i = 0; i < rollResults.critPairs.hh; i++)
                    critFrontEnd.push(...["HcL", "HcR"])
                for (let i = 0; i < rollResults.critPairs.hb; i++)
                    critFrontEnd.push(...["HcL", "BcR"])
                for (let i = 0; i < rollResults.critPairs.bb; i++)
                    critFrontEnd.push(...["BcL", "BcR"])
                for (let i = 0; i < rollResults.H.crits; i++)
                    critFrontEnd.push("Hc")
                for (let i = 0; i < rollResults.B.crits; i++)
                    critFrontEnd.push("Bc")
                // Finally, assemble the new diceVals after sorting them:
                rollResults.diceVals = [
                    ...critFrontEnd,
                    ...diceVals.filter(x => x === "Hs"),
                    ...diceVals.filter(x => x === "Bs"),
                    ...diceVals.filter(x => x === "HXc"),
                    ...diceVals.filter(x => x === "BXc"),
                    ...diceVals.filter(x => x === "HXs"),
                    ...diceVals.filter(x => x === "BXs"),
                    ...diceVals.filter(x => x === "Hf"),
                    ...diceVals.filter(x => x === "Bf"),
                    ...diceVals.filter(x => x === "HXb"),
                    ...diceVals.filter(x => x === "Hb"),
                    ...diceVals.filter(x => x === "HCb")
                ]
            }
            return rollResults
        },
        formatDiceLine = (rollData = {}, rollResults, split = 15, rollFlags = {}, isSmall = false) => {
            /* MUST SUPPLY:
                << rollData = { isReroll = true, isGMMod = true  } >>
                rollResults = { diceVals = [], total, << margin >> }

          resultBlock: "<div style=\"display: block; width: 120%; margin-left: -10%; height: auto; \">",
          resultCount: "<div style=\"display: inline-block; width: YYY; text-align: right; height: 100%; \">
              <span style=\"display: inline-block; font-weight: normal; font-family: Verdana; text-shadow: none;
                  height: 24px; line-height: 24px; vertical-align: middle; width: 40px; text-align: right;
                  margin-right: 10px; font-size: 12px;\">",
          margin: "<div style=\"display: inline-block; width: YYY; text-align: left; height: 100%; \">
              <span style=\"display: inline-block; font-weight: normal; font-family: Verdana; text-shadow: none;
                  height: 24px; line-height: 24px; vertical-align: middle; width: 40px; text-align: left;
                  margin-left: 10px; font-size: 12px;\">", */
            const dims = {
                    widthSide: 0,
                    widthMid: 0,
                    marginSide: 0
                },
                critCount = _.reduce(_.values(rollResults.critPairs), (tot, num) => tot + num, 0),
                splitAt = Math.ceil((rollResults.diceVals.length + critCount) /
                    Math.ceil((rollResults.diceVals.length + critCount) / split))
            let logLine = `${CHATSTYLES.resultBlock}${CHATSTYLES.resultCount}${rollFlags.isHidingResult ? "" : `${rollResults.total}:`}</span></div>${
                    CHATSTYLES.resultDice.colStart}${CHATSTYLES.resultDice.lineStart}`,
                counter = 0
            // let logLine = 
            if (isSmall)
                logLine = CHATSTYLES.resultDice.lineStart
            if (rollData.isReroll) {
                _.each(rollResults, roll => roll)
            } else if (rollData.isGMMod) {
                _.each(rollResults, roll => roll)
            } else {                
                let filteredDice = rollResults.diceVals
                if (rollFlags.isHidingDicePool && rollFlags.isHidingResult)
                    filteredDice = []
                else if (rollFlags.isHidingDicePool)
                    filteredDice = _.map(_.reject(rollResults.diceVals, v => ["Bf", "Hb", "Hf", "BXc", "BXs", "HXc", "HXs", "HXb", "HCb"].includes(v)), v => v.replace(/H/gu, "B"))
                else if (rollFlags.isHidingResult)
                    filteredDice = _.map(rollResults.diceVals, () => "g")
                _.each(filteredDice, v => {
                    if (counter >= splitAt) {
                        dims.widthMid = Math.max(dims.widthMid, counter)
                        counter = 0
                        logLine += CHATSTYLES.resultDice.lineBreak
                        dims.marginSide += 7
                    }
                    logLine += CHATSTYLES.resultDice[v]
                    counter += v.includes("L") || v.includes("R") ? 1.5 : 1
                })
                dims.widthMid = 12 * Math.max(dims.widthMid, counter)
                dims.widthSide = (250 - dims.widthMid) / 2
                if (isSmall)
                    logLine += "</div>"
                else
                    logLine = [
                        logLine,
                        "</div></div>",
                        CHATSTYLES.margin,
                        !rollFlags.isHidingDifficulty && !rollFlags.isHidingResult && typeof rollResults.margin === "number" ?
                            `(${rollResults.margin >= 0 ? "+" : "-"}${Math.abs(rollResults.margin)})` :
                            "",
                        "</span></div></div>"
                    ].join("").
                        replace(/XXX/gu, dims.widthMid).
                        replace(/YYY/gu, dims.widthSide).
                        replace(/ZZZ/gu, dims.marginSide)

            }

            return logLine
        },
        displayRoll = (isLogging = true, isNPCRoll) => {
            /* MUST SUPPLY:
              [ALL]
                rollData = { type, charName, charID }
                rollResults = { total, diceVals: [] }
              [ALL Non-Checks]
                rollData = { mod, dicePool, traits: [], traitData: { value, display }, << diff >> }
                rollResults = { H: { botches }, critPairs: {hh, hb, bb}, << margin >> }
              [TRAIT ONLY]
                rollData = { posFlagLines, negFlagLines } */
            const {rollData, rollResults} = getCurrentRoll(isNPCRoll),
                rollFlags = rollData.rollFlags || {},
                deltaAttrs = {},
                [mainRollParts, mainRollLog, stRollParts, stRollLog] = [[], [], [], []],
                [posFlagLines, negFlagLines, redFlagLines, goldFlagLines] = [
                    _.union(rollData.posFlagLines || [], rollResults.posFlagLines || []),
                    _.union(rollData.negFlagLines || [], rollResults.negFlagLines || []),
                    _.union(rollData.redFlagLines || [], rollResults.redFlagLines || []),
                    _.union(rollData.goldFlagLines || [], rollResults.goldFlagLines || [])
                ],
                rollLines = {
                    rollerName: {
                        text: ""
                    },
                    mainRoll: {
                        text: ""
                    }
                },
                logLines = {
                    fullBox: CHATSTYLES.fullBox,
                    rollerName: "",
                    mainRoll: "",
                    mainRollSub: "",
                    difficulty: "",
                    resultDice: "",
                    margin: "",
                    outcome: "",
                    subOutcome: ""
                },
                stLines = {
                    fullBox: CHATSTYLES.fullBox,
                    rollerName: "",
                    mainRoll: "",
                    mainRollSub: "",
                    difficulty: "",
                    resultDice: "",
                    margin: "",
                    outcome: "",
                    subOutcome: ""
                },
                playerNPCLines = {
                    fullBox: CHATSTYLES.fullBox,
                    rollerName: "",
                    mainRoll: "",
                    mainRollSub: "",
                    difficulty: "",
                    resultDice: "",
                    margin: "",
                    outcome: "",
                    subOutcome: ""                    
                },
                p = v => rollData.prefix + v
            DB({rollData, rollResults}, "displayRoll")
            switch (rollData.type) {
                case "project": {
                    rollLines.subOutcome = {
                        text: ""
                    }
                }
                /* falls through */
                case "trait": {
                    // D.Alert(`posFlagLines.length: ${posFlagLines.length}<br>${D.JS(posFlagLines)}`)
                    if (posFlagLines.length && !rollFlags.isHidingDicePool && !rollFlags.isHidingTraits) {
                        rollLines.posMods = {
                            text: `+ ${posFlagLines.join(" + ")}`
                        }
                        if (rollFlags.isHidingTraitVals)
                            rollLines.posMods.text = rollLines.posMods.text.replace(/\(?[+-]*?[\d●~]+?\)?/gu, "")
                    }
                    if (negFlagLines.length && !(rollFlags.isHidingDicePool && rollFlags.isHidingTraits))
                        rollLines.negMods = {
                            text: `- ${negFlagLines.join(" - ")}`
                        }
                    if (redFlagLines.length)
                        rollLines.redMods = {
                            text: redFlagLines.join(", ")
                        }
                    if (goldFlagLines.length && !rollFlags.isHidingDicePool && !rollFlags.isHidingTraits) {
                        rollLines.goldMods = {
                            text: goldFlagLines.join(", ")
                        }
                        if (rollFlags.isHidingTraitVals)
                            rollLines.goldMods.text = rollLines.goldMods.text.replace(/\(?[+-]*?[\d●~]+?\)?/gu, "")
                    }
                }
                /* falls through */
                case "willpower":
                case "humanity": {
                    rollLines.margin = {
                        text: ""
                    }
                }
                /* falls through */
                case "frenzy": {
                    if (rollData.diff > 0)
                        rollLines.difficulty = {
                            text: ""
                        }
                }
                /* falls through */
                case "remorse":
                case "rouse2":
                case "rouse":
                case "check": {
                    rollLines.dicePool = {
                        text: ""
                    }
                    rollLines.resultCount = {
                        text: ""
                    }
                    rollLines.outcome = {
                        text: ""
                    }
                    rollLines.subOutcome = {
                        text: ""
                    }
                    break
                }
                default: {
                    return THROW(`Unrecognized rollType: ${D.JSL(rollData.rollType)}`, "APPLYROLL: START")
                }
            }

            for (const line of Object.keys(rollLines))
                if (getColor(rollData.type, line))
                    rollLines[line].color = getColor(rollData.type, line)

            for (const name of Object.keys(rollLines))
                switch (name) {
                    case "rollerName": {
                        const displayName = rollFlags.isHidingName ? "Someone" : rollData.charName
                        switch (rollData.type) {
                            case "remorse": {
                                rollLines.rollerName.text = `Does ${displayName.replace(/Someone/gu, "someone")} feel remorse?`
                                stLines.rollerName = `${CHATSTYLES.rollerName}${rollData.charName} rolls remorse:</div>`
                                logLines.rollerName = `${CHATSTYLES.rollerName}${displayName} rolls remorse:</div>`
                                break
                            }
                            case "frenzy": {
                                rollLines.rollerName.text = `${displayName} and the Beast wrestle for control...`
                                stLines.rollerName = `${CHATSTYLES.rollerName}${rollData.charName} resists frenzy:</div>`
                                logLines.rollerName = `${CHATSTYLES.rollerName}${displayName} resists frenzy:</div>`
                                break
                            }
                            case "project": {                                
                                rollLines.rollerName.text = `${displayName} launches a Project:`
                                stLines.rollerName = `${CHATSTYLES.rollerName}${rollData.charName} launches a Project:</div>`
                                logLines.rollerName = `${CHATSTYLES.rollerName}${displayName} launches a Project:</div>`
                                break
                            }
                            case "trait":
                            case "willpower":
                            case "humanity": {
                                rollLines.rollerName.text = `${displayName} rolls:`
                                stLines.rollerName = `${CHATSTYLES.rollerName}${rollData.charName} rolls:</div>`
                                logLines.rollerName = `${CHATSTYLES.rollerName}${displayName} rolls:</div>`
                                break
                            }
                            default: {
                                rollLines.rollerName.text = `${displayName}:`
                                stLines.rollerName = `${CHATSTYLES.rollerName}${rollData.charName}:</div>`
                                logLines.rollerName = `${CHATSTYLES.rollerName}${displayName}:</div>`
                                break
                            }
                        }
                        playerNPCLines.rollerName = stLines.rollerName
                        break
                    }
                    case "mainRoll": {
                        switch (rollData.type) {
                            case "remorse": 
                            case "frenzy":
                            case "project":
                            case "trait":
                            case "willpower":
                            case "humanity": {
                                for (const trait of rollData.traits) {
                                    let dotline = "●".repeat(rollData.traitData[trait].value)
                                    switch (trait) {
                                        case "stains": {
                                            dotline = ""
                                        }
                                        /* falls through */
                                        case "humanity": {
                                            let stains = Math.max(D.Int(D.GetStatVal(rollData.charID, "stains")), 0),
                                                maxHumanity = 10
                                            if (rollData.type === "frenzy") {
                                                stains = Math.max(stains === 0 ? 0 : 1, Math.floor(stains / 3))
                                                maxHumanity = 4
                                            }
                                            if (rollData.type === "remorse")
                                                dotline = "◌".repeat(Math.max(maxHumanity - dotline.length - stains, 0)) + dotline + "◌".repeat(stains)
                                            else
                                                dotline += "◌".repeat(Math.max(maxHumanity - dotline.length - (stains || 0)), 0) + "‡".repeat(stains || 0)
                                            break
                                        }
                                        case "willpower": {
                                            dotline += "◌".repeat(Math.max(0, D.Int(D.GetStatVal(rollData.charID, "willpower_max")) - D.Int(rollData.traitData[trait].value)))
                                            break
                                        }
                                        default: {
                                            if (rollData.traitData[trait].value === 0)
                                                dotline = "~"
                                            break
                                        }
                                    }
                                    if (trait !== "stains") {
                                        if (rollFlags.isHidingTraitVals) {
                                            mainRollParts.push(`${rollData.traitData[trait].display}`)
                                            mainRollLog.push(`${rollData.traitData[trait].display.replace(/\s*?\(.*?\)\s*?$/gu, "")}`)
                                        } else {
                                            mainRollParts.push(`${rollData.traitData[trait].display} (${dotline})`)
                                            mainRollLog.push(`${rollData.traitData[trait].display.replace(/\s*?\(.*?\)\s*?$/gu, "")} (${rollData.traitData[trait].value})`)
                                        }
                                        stRollParts.push(`${rollData.traitData[trait].display} (${dotline})`)
                                        stRollLog.push(`${rollData.traitData[trait].display.replace(/\s*?\(.*?\)\s*?$/gu, "")} (${rollData.traitData[trait].value})`)
                                    }
                                }
                                if (rollFlags.isHidingTraits) {
                                    rollLines.mainRoll.text = rollFlags.isHidingDicePool ? "Some Dice" : `${rollData.dicePool + -1 * (rollData.negFlagMod || 0)} Dice`
                                    logLines.mainRoll = CHATSTYLES.mainRoll + (rollFlags.isHidingDicePool ? "Some Dice" : `${rollData.dicePool + -1 * (rollData.negFlagMod || 0)} Dice`)
                                } else {
                                    rollLines.mainRoll.text = mainRollParts.join(" + ")
                                    logLines.mainRoll = CHATSTYLES.mainRoll + mainRollLog.join(" + ")
                                }
                                stLines.mainRoll = CHATSTYLES.mainRoll + stRollLog.join(" + ")
                                playerNPCLines.mainRoll = CHATSTYLES.mainRoll + stRollLog.join(" + ").replace(/\s\(\d*\)/gu, "")
                                if (rollData.mod && rollData.mod !== 0)
                                    if (rollData.traits.length === 0 && rollData.mod > 0) {
                                        rollLines.mainRoll.text = `${rollFlags.isHidingDicePool ? "Some" : rollData.mod} Dice`
                                        logLines.mainRoll = `${CHATSTYLES.mainRoll + (rollFlags.isHidingDicePool ? "Some" : rollData.mod)} Dice`
                                        stLines.mainRoll = `${CHATSTYLES.mainRoll + rollData.mod} Dice`
                                        playerNPCLines.mainRoll = `${CHATSTYLES.mainRoll + (rollFlags.isHidingDicePool ? "Some" : rollData.mod)} Dice`
                                    } else {
                                        logLines.mainRoll += rollFlags.isHidingTraits || rollFlags.isHidingDicePool ? "" : (rollData.mod < 0 ? " - " : " + ") + Math.abs(rollData.mod)
                                        rollLines.mainRoll.text += rollFlags.isHidingTraits || rollFlags.isHidingDicePool ? "" : (rollData.mod < 0 ? " - " : " + ") + Math.abs(rollData.mod)
                                        stLines.mainRoll += rollData.mod < 0 ? " - " : ` + ${ Math.abs(rollData.mod)}`
                                    }
                                if (rollData.type === "project")
                                    deltaAttrs[p("projectlaunchresultsummary")] = logLines.mainRoll
                                if (rollData.dicePool <= 0) {
                                    rollData.dicePool = 1
                                    if (!rollFlags.isHidingTraits && !rollFlags.isHidingDicePool) {
                                        logLines.mainRollSub = `${CHATSTYLES.mainRollSub}(One Die Minimum)</span>`
                                        rollLines.mainRoll.text += " (One Die Minimum)"
                                    }
                                    stLines.mainRollSub = `${CHATSTYLES.mainRollSub}(One Die Minimum)</span>`
                                    playerNPCLines.mainRollSub = `${CHATSTYLES.mainRollSub}(One Die Minimum)</span>`
                                }
                                break
                            }
                            case "rouse2": {
                                rollLines.mainRoll.text = " (Best of Two)"
                                logLines.mainRollSub = `${CHATSTYLES.mainRollSub}(Best of Two)</span>`
                                stLines.mainRollSub = logLines.mainRollSub
                                playerNPCLines.mainRollSub = logLines.mainRollSub
                            }
                            /* falls through */
                            case "rouse": {
                                logLines.mainRoll = `${CHATSTYLES.check}${rollData.isOblivionRoll ? "Oblivion " : ""}Rouse Check`
                                stLines.mainRoll = logLines.mainRoll
                                playerNPCLines.mainRoll = logLines.mainRoll
                                rollLines.mainRoll.text = `${rollData.isOblivionRoll ? "Oblivion " : ""}Rouse Check${rollLines.mainRoll.text}`
                                break
                            }
                            case "check": {
                                logLines.mainRoll = `${CHATSTYLES.check}Simple Check`
                                stLines.mainRoll = logLines.mainRoll
                                playerNPCLines.mainRoll = logLines.mainRoll
                                rollLines.mainRoll.text = "Simple Check"
                                break
                            }
                            // no default
                        }
                        break
                    }
                    case "dicePool": {
                        if (rollFlags.isHidingDicePool)
                            delete rollLines.dicePool
                        else
                            rollLines.dicePool.text = JSON.stringify(rollData.dicePool)
                        break
                    }
                    case "difficulty": {
                        if (rollData.diff || rollData.diffMod) {
                            stLines.difficulty = ` vs. ${rollData.diff}`
                            playerNPCLines.difficulty = stLines.difficulty
                            if (rollData.type === "project")
                                deltaAttrs[p("projectlaunchresultsummary")] += ` vs. Difficulty ${rollData.diff}`
                            if (rollFlags.isNPCRoll || rollFlags.isHidingDifficulty) {
                                Media.ToggleImg("RollerFrame_Diff", false)
                                delete rollLines.difficulty                             
                            } else {
                                Media.ToggleImg("RollerFrame_Diff", true)
                                rollLines.difficulty = {
                                    text: rollData.diff.toString()
                                }
                                logLines.difficulty = stLines.difficulty
                            }
                        }
                        break
                    }
                    case "resultCount": {
                        if (rollFlags.isHidingResult)
                            delete rollLines.resultCount
                        else
                            rollLines.resultCount.text = JSON.stringify(rollResults.total)
                        break
                    }
                    case "margin": {
                        if (rollResults.margin || rollResults.margin === 0) {
                            stLines.margin = ` (${
                                rollResults.margin > 0 && "+" ||
                                    rollResults.margin === 0 && "" ||
                                    "-"}${
                                Math.abs(rollResults.margin)})${logLines.margin
                            }`
                            playerNPCLines.margin = logLines.margin
                            if (rollFlags.isHidingDifficulty || rollFlags.isHidingResult) {
                                delete rollLines.margin
                            } else {
                                rollLines.margin = {
                                    text: `${
                                        rollResults.margin >= 0 && "+" ||
                                        "-"
                                    }${Math.abs(rollResults.margin)}`,
                                    color: getColor(rollData.type, "margin", rollResults.margin >= 0 ? "good" : "bad")
                                }
                                logLines.margin = stLines.margin
                            }
                        }
                        break
                    }
                    case "outcome": {
                        switch (rollData.type) {
                            case "project": {
                                STATE.REF.LastProjectCommit = rollResults.commit 
                                if (rollResults.total === 0) {
                                    stLines.outcome = `${CHATSTYLES.outcomeRed}TOTAL FAILURE!</span></div>`
                                    stLines.subOutcome = `${CHATSTYLES.subOutcomeRed}Enemies Close In</span></div>`
                                    rollLines.outcome.text = "TOTAL FAILURE!"
                                    rollLines.subOutcome.text = "Your Enemies Close In..."
                                    rollLines.outcome.color = getColor(rollData.type, "outcome", "worst")
                                    rollLines.subOutcome.color = getColor(rollData.type, "subOutcome", "worst")
                                    deltaAttrs[p("projectlaunchresultsummary")] += ":   TOTAL FAIL"
                                    deltaAttrs[p("projectlaunchresults")] = "TOTAL FAIL"
                                    deltaAttrs[p("projectlaunchresultsmargin")] = "You've Angered Someone..."
                                } else if (rollResults.margin < 0) {
                                    stLines.outcome = `${CHATSTYLES.outcomeOrange}FAILURE!</span></div>`
                                    stLines.subOutcome = `${CHATSTYLES.subOutcomeOrange}+1 Difficulty to Try Again</span></div>`
                                    rollLines.outcome.text = "FAILURE!"
                                    rollLines.subOutcome.text = "+1 Difficulty to Try Again"
                                    rollLines.outcome.color = getColor(rollData.type, "outcome", "bad")
                                    rollLines.subOutcome.color = getColor(rollData.type, "subOutcome", "bad")
                                    delete deltaAttrs[p("projectlaunchresultsummary")]
                                    deltaAttrs[p("projectlaunchdiffmod")] = rollData.diffMod + 1
                                    deltaAttrs[p("projectlaunchdiff")] = rollData.diff + 1
                                } else if (rollResults.critPairs.bb > 0) {
                                    stLines.outcome = `${CHATSTYLES.outcomeWhite}CRITICAL WIN!</span></div>`
                                    stLines.subOutcome = `${CHATSTYLES.subOutcomeWhite}No Commit Needed!</span></div>`
                                    rollLines.outcome.text = "CRITICAL WIN!"
                                    rollLines.subOutcome.text = "No Commit Needed!"
                                    rollLines.outcome.color = getColor(rollData.type, "outcome", "best")
                                    rollLines.subOutcome.color = getColor(rollData.type, "subOutcome", "best")
                                    deltaAttrs[p("projectlaunchresultsummary")] += ":   CRITICAL WIN!"
                                    deltaAttrs[p("projectlaunchresults")] = "CRITICAL WIN!"
                                    deltaAttrs[p("projectlaunchresultsmargin")] = "No Stake Needed!"
                                } else {
                                    stLines.outcome = `${CHATSTYLES.outcomeWhite}SUCCESS!</span></div>`
                                    stLines.subOutcome = `${CHATSTYLES.subOutcomeWhite}Stake ${rollResults.commit} Dot${rollResults.commit > 1 ? "s" : ""}</span></div>`
                                    rollLines.outcome.text = "SUCCESS!"
                                    rollLines.subOutcome.text = `Stake ${rollResults.commit} Dot${rollResults.commit > 1 ? "s" : ""}`
                                    rollLines.outcome.color = getColor(rollData.type, "outcome", "best")
                                    rollLines.subOutcome.color = getColor(rollData.type, "subOutcome", "best")
                                    deltaAttrs[p("projecttotalstake")] = rollResults.commit
                                    deltaAttrs[p("projectlaunchresultsmargin")] = `(${rollResults.commit} Stake Required, ${rollResults.commit} to Go)`
                                    deltaAttrs[p("projectlaunchresultsummary")] += `:   ${rollResults.total} SUCCESS${rollResults.total > 1 ? "ES" : ""}!`
                                    deltaAttrs[p("projectlaunchresults")] = "SUCCESS!"
                                }
                                break
                            }
                            case "trait": {
                                if ((rollResults.total === 0 || D.Int(rollResults.margin) < 0) && rollResults.H.botches > 0) {
                                    stLines.outcome = `${CHATSTYLES.outcomeRed}BESTIAL FAILURE!</span></div>`
                                    rollLines.outcome.text = "BESTIAL FAILURE!"
                                    rollLines.outcome.color = getColor(rollData.type, "outcome", "worst")
                                    break
                                } else if (!rollResults.noMessyCrit && (!rollResults.margin || rollResults.margin >= 0) && rollResults.critPairs.hb + rollResults.critPairs.hh > 0) {
                                    rollLines.outcome.text = "MESSY CRITICAL!"
                                    stLines.outcome = `${CHATSTYLES.outcomeRed}MESSY CRITICAL!</span></div>`
                                    rollLines.outcome.color = getColor(rollData.type, "outcome", "worst")
                                    break
                                }
                            }
                            /* falls through */
                            case "willpower":
                            case "humanity": {
                                if (rollResults.total === 0) {
                                    stLines.outcome = `${CHATSTYLES.outcomeRed}TOTAL FAILURE!</span></div>`
                                    rollLines.outcome.text = "TOTAL FAILURE!"
                                    rollLines.outcome.color = getColor(rollData.type, "outcome", "worst")
                                } else if (rollResults.margin < 0) {
                                    stLines.outcome = `${CHATSTYLES.outcomeOrange}COSTLY SUCCESS?</span></div>`
                                    rollLines.outcome.text = "COSTLY SUCCESS?"
                                    rollLines.outcome.color = getColor(rollData.type, "outcome", "bad")
                                } else if (rollResults.critPairs.hh + rollResults.critPairs.bb + rollResults.critPairs.hb > 0) {
                                    stLines.outcome = `${CHATSTYLES.outcomeWhite}CRITICAL WIN!</span></div>`
                                    rollLines.outcome.text = "CRITICAL WIN!"
                                    rollLines.outcome.color = getColor(rollData.type, "outcome", "best")
                                } else {
                                    stLines.outcome = `${CHATSTYLES.outcomeWhite}SUCCESS!</span></div>`
                                    rollLines.outcome.text = "SUCCESS!"
                                    rollLines.outcome.color = getColor(rollData.type, "outcome", "good")
                                }
                                break
                            }
                            case "frenzy": {
                                if (rollResults.total === 0 || rollResults.margin < 0) {
                                    stLines.outcome = `${CHATSTYLES.outcomeRed}FRENZY!</span></div>`
                                    rollLines.outcome.text = "YOU FRENZY!"
                                    rollLines.outcome.color = getColor(rollData.type, "outcome", "worst")
                                } else if (rollResults.critPairs.bb > 0) {
                                    stLines.outcome = `${CHATSTYLES.outcomeWhite}RESISTED!</span></div>`
                                    rollLines.outcome.text = "RESISTED!"
                                    rollLines.outcome.color = getColor(rollData.type, "outcome", "best")
                                } else {
                                    stLines.outcome = `${CHATSTYLES.outcomeWhite}RESTRAINED...</span></div>`
                                    rollLines.outcome.text = "RESTRAINED..."
                                    rollLines.outcome.color = getColor(rollData.type, "outcome", "good")
                                }
                                break
                            }
                            case "remorse": {
                                deltaAttrs.stains = -1 * D.Int(D.GetStatVal(rollData.charID, "stains"))
                                if (rollResults.total === 0) {
                                    stLines.outcome = `${CHATSTYLES.outcomeRed}DEGENERATION</span></div>`
                                    rollLines.outcome.text = "YOUR HUMANITY FADES..."
                                    rollLines.outcome.color = getColor(rollData.type, "outcome", "bad")
                                    deltaAttrs.humanity = -1
                                } else {
                                    stLines.outcome = `${CHATSTYLES.outcomeWhite}ABSOLUTION</span></div>`
                                    rollLines.outcome.text = "YOU FIND ABSOLUTION!"
                                    rollLines.outcome.color = getColor(rollData.type, "outcome", "good")
                                }
                                break
                            }
                            case "rouse":
                            case "rouse2": {
                                if (rollResults.diceVals.length === 2 && rollResults.total > 0 && _.any(rollResults.diceVals, v => v.includes("O")) && _.any(rollResults.diceVals, v => v.includes("H"))) {
                                    stLines.outcome = `${CHATSTYLES.outcomePurple}HUMANITY or HUNGER?</span></div>`
                                    rollLines.outcome.text = "RESTRAINT AT A COST?"
                                    rollLines.subOutcome = {text: "Choose: Humanity or Hunger?"}
                                    rollLines.outcome.color = getColor(rollData.type, "outcome", "tainted")
                                    rollLines.subOutcome.color = getColor(rollData.type, "subOutcome", "tainted")
                                } else if (_.all(rollResults.diceVals, v => v.includes("O"))) {
                                    if (rollResults.total > 0) {
                                        stLines.outcome = `${CHATSTYLES.outcomePurple}RESTRAINED but TAINTED</span></div>`
                                        rollLines.outcome.text = "SMOTHERED..."
                                        rollLines.subOutcome = {text: "The Abyss drags you deeper..."}
                                        rollLines.outcome.color = getColor(rollData.type, "outcome", "grey")
                                        rollLines.subOutcome.color = getColor(rollData.type, "subOutcome", "tainted")
                                        deltaAttrs.stains = 1
                                    } else {
                                        stLines.outcome = `${CHATSTYLES.outcomePurple}ROUSED and TAINTED!</span></div>`
                                        rollLines.outcome.text = "THE HUNGRY DARK"                                        
                                        rollLines.subOutcome = {text: "The Abyss drags you deeper..."}
                                        rollLines.outcome.color = getColor(rollData.type, "outcome", "worst")
                                        rollLines.subOutcome.color = getColor(rollData.type, "subOutcome", "tainted")
                                        deltaAttrs.stains = 1
                                        Char.AdjustHunger(rollData.charID, 1)
                                    }
                                } else if (rollResults.total > 0) {
                                    stLines.outcome = `${CHATSTYLES.outcomeWhite}RESTRAINED</span></div>`
                                    rollLines.outcome.text = "RESTRAINED..."
                                    rollLines.outcome.color = getColor(rollData.type, "outcome", "good")
                                } else {
                                    stLines.outcome = `${CHATSTYLES.outcomeRed}ROUSED!</span></div>`
                                    rollLines.outcome.text = "HUNGER ROUSED!"
                                    rollLines.outcome.color = getColor(rollData.type, "outcome", "worst")
                                    Char.AdjustHunger(rollData.charID, 1)
                                }
                                break
                            }
                            case "check": {
                                if (rollResults.total > 0) {
                                    stLines.outcome = `${CHATSTYLES.outcomeWhite}PASS</span></div>`
                                    rollLines.outcome.text = "PASS"
                                    rollLines.outcome.color = getColor(rollData.type, "outcome", "good")
                                } else {
                                    stLines.outcome = `${CHATSTYLES.outcomeRed}FAIL</span></div>`
                                    rollLines.outcome.text = "FAIL"
                                    rollLines.outcome.color = getColor(rollData.type, "outcome", "worst")
                                }
                                break
                            }
                            default: {
                                THROW(`Unrecognized rollType: ${D.JSL(rollData.rollType)}`, "APPLYROLL: MID")
                                break
                            }
                        }
                        playerNPCLines.outcome = stLines.outcome
                        playerNPCLines.subOutcome = stLines.subOutcome
                        if (rollFlags.isHidingOutcome) {
                            delete rollLines.outcome
                            delete rollLines.subOutcome
                        } else {
                            logLines.outcome = stLines.outcome
                            logLines.subOutcome = stLines.subOutcome
                        }
                        break
                    }
                    // no default
                }

            if (!rollLines.difficulty || !rollData.diff && !rollData.diffMod)
                Media.ToggleImg("RollerFrame_Diff", false)
            if ((logLines.mainRoll + logLines.difficulty).replace(/<div.*?span.*?>/gu, "").length > 40)
                for (const abbv of Object.keys(C.ATTRABBVS))
                    logLines.mainRoll = logLines.mainRoll.replace(new RegExp(C.ATTRABBVS[abbv], "gui"), abbv)
            if ((logLines.mainRoll + logLines.difficulty).replace(/<div.*?span.*?>/gu, "").length > 40)
                for (const abbv of Object.keys(C.SKILLABBVS))
                    logLines.mainRoll = logLines.mainRoll.replace(new RegExp(C.SKILLABBVS[abbv], "gui"), abbv)
            if ((stLines.mainRoll + stLines.difficulty).replace(/<div.*?span.*?>/gu, "").length > 40)
                for (const abbv of Object.keys(C.ATTRABBVS)) {
                    stLines.mainRoll = stLines.mainRoll.replace(new RegExp(C.ATTRABBVS[abbv], "gui"), abbv)
                    playerNPCLines.mainRoll = playerNPCLines.mainRoll.replace(new RegExp(C.ATTRABBVS[abbv], "gui"), abbv)
                }
            if ((stLines.mainRoll + stLines.difficulty).replace(/<div.*?span.*?>/gu, "").length > 40)
                for (const abbv of Object.keys(C.SKILLABBVS)) {
                    stLines.mainRoll = stLines.mainRoll.replace(new RegExp(C.SKILLABBVS[abbv], "gui"), abbv)
                    playerNPCLines.mainRoll = playerNPCLines.mainRoll.replace(new RegExp(C.SKILLABBVS[abbv], "gui"), abbv)
                }
            logLines.mainRoll = `${logLines.mainRoll + logLines.difficulty}</span>${logLines.mainRollSub}</div>`
            stLines.mainRoll = `${stLines.mainRoll + stLines.difficulty}</span>${stLines.mainRollSub}</div>`
            playerNPCLines.mainRoll = `${playerNPCLines.mainRoll + playerNPCLines.difficulty}</span>${playerNPCLines.mainRollSub}</div>`

            logLines.resultDice = formatDiceLine(rollData, rollResults, 13, rollFlags)
            stLines.resultDice = formatDiceLine(rollData, rollResults, 13, {
                isHidingName: false,
                isHidingTraits: false,
                isHidingTraitVals: false,
                isHidingDicePool: false,
                isHidingDifficulty: false,
                isHidingResult: false,
                isHidingOutcome: false
            })
            playerNPCLines.resultDice = formatDiceLine(rollData, rollResults, 13, {
                isHidingName: false,
                isHidingTraits: false,
                isHidingTraitVals: true,
                isHidingDicePool: true,
                isHidingDifficulty: false,
                isHidingResult: false,
                isHidingOutcome: false
            })

            const logString = `${logLines.fullBox}${logLines.rollerName}${logLines.mainRoll}${logLines.resultDice}${
                    rollFlags.isHidingOutcome ? "" : logLines.outcome + logLines.subOutcome
                }</div>`,
                stString = `${stLines.fullBox}${stLines.rollerName}${stLines.mainRoll}${stLines.resultDice}${stLines.outcome}${stLines.subOutcome}</div>`,
                playerNPCString = `${playerNPCLines.fullBox}${playerNPCLines.rollerName}${playerNPCLines.mainRoll}${playerNPCLines.resultDice}${playerNPCLines.outcome}${playerNPCLines.subOutcome}</div>`
            
            for (const line of SETTINGS.textKeys)
                if (rollLines[line] && rollLines[line].text) {
                    Media.SetText(line, rollLines[line].text, true)
                    Media.SetTextData(line, {color: rollLines[line].color || COLORSCHEMES.base[line]})
                } else {
                    Media.ToggleText(line, false)
                }

            const [topMidRefs, botMidRefs] = [[],[]]
            for (let i = 1; i <= SETTINGS.frame.mids.qty; i++) {
                topMidRefs.push(`RollerFrame_TopMid_${i}`)
                botMidRefs.push(`RollerFrame_BottomMid_${i}`)   
            }

            Media.Spread(
                "RollerFrame_Left",
                "RollerFrame_TopEnd",
                topMidRefs,
                SETTINGS.frame.leftBuffer + Math.max(
                    Media.GetTextWidth("mainRoll"),
                    SETTINGS.shifts.negMods.left + (Media.IsActive("negMods") && Media.GetTextWidth("negMods")) || 0
                ),
                SETTINGS.frame.mids.minSpread,
                SETTINGS.frame.mids.maxSpread
            )
            
            if (!rollResults.isNPCRoll) {
                const diceCats = ["rouse", "rouse2", "check"].includes(rollData.type) ? ["Big", "Main"] : ["Main", "Big"]
                let filteredDice = [...rollResults.diceVals]
                if (rollFlags.isHidingDicePool && rollFlags.isHidingResult)
                    filteredDice = []
                else if (rollFlags.isHidingDicePool)
                    filteredDice = rollResults.diceVals.filter(x => !["Bf", "Hb", "Hf", "BXc", "BXs", "HXc", "HXs", "HXb", "HCb"].includes(x)).map(x => x.replace(/H/gu, "B"))
                else if (rollFlags.isHidingResult)
                    filteredDice = rollResults.diceVals.map(() => "Bf")
                setDieCat(diceCats[0], filteredDice, rollData.type)
                setDieCat(diceCats[1], [])
                
                if (filteredDice.length) {             
                    Media.SetImg("RollerFrame_Left", "topBottom")
                    Media.ToggleImg("RollerFrame_BottomEnd", true)
                    Media.Spread(
                        "RollerFrame_Left",
                        "RollerFrame_BottomEnd",
                        botMidRefs,
                        SETTINGS.frame.leftBuffer + filteredDice.length * SETTINGS.dice[diceCats[0]].spread,
                        SETTINGS.frame.mids.minSpread,
                        SETTINGS.frame.mids.maxSpread
                    )
                } else {
                    Media.SetImg("RollerFrame_Left", "top")
                    for (const midRef of botMidRefs)
                        Media.ToggleImg(midRef, false)
                    Media.ToggleImg("RollerFrame_BottomEnd", false)
                }
                
                D.RunFX("bloodBolt", Media.GetTextData("resultCount"))
            }            

            for (const line of SETTINGS.textKeys)
                if (rollLines[line] && rollLines[line].text)
                    Media.SetTextData(line, {shiftTop: SETTINGS.shifts[line].top, shiftLeft: SETTINGS.shifts[line].left})
            if (Media.IsActive("RollerFrame_Diff"))
                Media.SetImgTemp("RollerFrame_Diff", {top: SETTINGS.shifts.diffFrame.top})
            
            if (_.values(deltaAttrs).length && !rollData.notChangingStats) {
                DB(`CHANGING ATTRIBUTES: ${D.JSL(deltaAttrs)}`, "displayRoll")
                for (const attrName of Object.keys(deltaAttrs))
                    if (attrName === "humanity" || attrName === "stains") {
                        Char.AdjustTrait(rollData.charID, attrName, deltaAttrs[attrName], 0, 10)
                        delete deltaAttrs[attrName]
                    }
                D.Queue(setAttrs, [rollData.charID, deltaAttrs], "RollerAttrs")
                D.Queue(Char.RefreshDisplays, [], "RollerAttrs", 0.1)
                D.Run("RollerAttrs")
            }

            if (isLogging)
                D.Chat("all", logString, undefined, D.RandomString(3))
            if (rollFlags.isHidingResult || rollFlags.isHidingOutcome || rollFlags.isHidingDicePool || rollFlags.isHidingDifficulty) {
                D.Chat("Storyteller", stString, undefined, D.RandomString(3))
                if (rollData.playerID && rollData.playerID !== D.GMID())
                    D.Chat(rollData.playerID, playerNPCString, undefined, D.RandomString(3))
            }

            return deltaAttrs
        },
        makeNewRoll = (charObj, rollType, params = [], rollFlags = {}) => {
            DB(`BEGINNING ROLL:
                CHAR: ${D.JS(charObj.get("name"))} 
				ROLL TYPE: ${D.JS(rollType)}
                ... DISC ROLL? ${D.JS(rollFlags.isDiscRoll)}
                ... NPC ROLL? ${D.JS(rollFlags.isNPCRoll)}
                ... OBLIV ROLL? ${D.JS(rollFlags.isOblivionRoll)}
                PARAMS: [${D.JS(params.join(", "))}] (length: ${params.length})`, "makeNewRoll")
            if (D.Int(D.GetStatVal(charObj.id, "applybloodsurge")) > 0)                
                quickRouseCheck(charObj, false, false, true)
            const rollData = buildDicePool(getRollData(charObj, rollType, params, rollFlags))
            recordRoll(rollData, rollDice(rollData, null, rollFlags))
            displayRoll(true, rollFlags.isNPCRoll)
        },
        wpReroll = (dieCat, isNPCRoll) => {
            const rollRecord = getCurrentRoll(isNPCRoll),
                rollData = _.clone(rollRecord.rollData),
                rolledDice = D.KeyMapObj(STATE.REF.diceVals[dieCat], null, (v, k) => { return !STATE.REF.selected[dieCat].includes(D.Int(k)) && v || false }),
                charObj = getObj("character", rollData.charID)
            DB(`Rolled Dice: ${D.JS(rolledDice)}<br><br>RETRIEVED ROLL RECORD: ${D.JSL(rollRecord)}`, "wpReroll")
            rollData.rerollAmt = STATE.REF.selected[dieCat].length
            const rollResults = rollDice(rollData, _.compact(_.values(rolledDice)))
            rollResults.wpCost = rollRecord.rollResults.wpCost
            rollResults.wpCostAfterReroll = rollRecord.rollResults.wpCostAfterReroll

            if (charObj) {
                Char.Damage(charObj, "willpower", "spent", rollResults.wpCost)
                if (VAL({number: rollResults.wpCostAfterReroll})) {
                    if (rollResults.wpCost === 0 && rollResults.wpCostAfterReroll > 0)
                        rollResults.goldFlagLines = _.reject(rollResults.goldFlagLines, v => v.includes("Free Reroll"))
                    rollResults.wpCost = rollRecord.rollResults.wpCostAfterReroll
                    delete rollResults.wpCostAfterReroll
                }
            }

            replaceRoll(rollData, rollResults)
            displayRoll(true, isNPCRoll)
            // Media.SetText("goldMods", Media.GetTextData("goldMods").text.replace(/District Bonus \(Free Reroll\)/gu, ""))
            lockRoller(false)
            DragPads.Toggle("wpReroll", false)
            Media.ToggleAnim("Roller_WPReroller_1", false)
            Media.ToggleImg("Roller_WPReroller_Base_1", false)
            Media.ToggleAnim("Roller_WPReroller_2", false)
            Media.ToggleImg("Roller_WPReroller_Base_2", false)
        },
        rollCommandMenu = () => {
            D.CommandMenu(
                {
                    title: "Dice Roller Control",
                    rows: [
                        {
                            type: "ButtonLine",
                            contents: [
                                {name: "<< Prev", command: "!reply cycle@-1", styles: {bgColor: C.COLORS.darkpurple}}, /* height, lineHeight, width, fontFamily, margin, padding, fontSize, bgColor, color, border, fontWeight, textShadow, buttonHeight, buttonWidth, buttonPadding, buttonTransform */
                                9,
                                {name: "Clear Roller", command: "!reply clear", styles: {width: "36%"}}, /* height, lineHeight, width, fontFamily, margin, padding, fontSize, bgColor, color, border, fontWeight, textShadow, buttonHeight, buttonWidth, buttonPadding, buttonTransform */
                                9,
                                {name: "Next >>", command: "!reply cycle@1", styles: {bgColor: C.COLORS.darkpurple}}, /* height, lineHeight, width, fontFamily, margin, padding, fontSize, bgColor, color, border, fontWeight, textShadow, buttonHeight, buttonWidth, buttonPadding, buttonTransform */
                            ],
                            buttonStyles: {width: "18%"}, /* height, lineHeight, width, fontFamily, margin, padding, fontSize, bgColor, color, border, fontWeight, textShadow, buttonHeight, buttonWidth, buttonPadding, buttonTransform */
                            styles: {margin: "0px 0px 5px 0px"} /* height, width, margin, textAlign */
                        },
                        {
                            type: "ButtonLine",
                            contents: [
                                {text: "Add Dice:", styles: {width: "19%", textIndent: "0px", textAlign: "right"}}, /* height, width, fontFamily, fontSize, bgColor, color, margin, textAlign, textIndent, padding, lineHeight */
                                {name: "+1", command: "!reply change@1", styles: { }}, /* height, lineHeight, width, fontFamily, margin, padding, fontSize, bgColor, color, border, fontWeight, textShadow, buttonHeight, buttonWidth, buttonPadding, buttonTransform */
                                {name: "+2", command: "!reply change@2", styles: { }}, /* height, lineHeight, width, fontFamily, margin, padding, fontSize, bgColor, color, border, fontWeight, textShadow, buttonHeight, buttonWidth, buttonPadding, buttonTransform */
                                {name: "+3", command: "!reply change@3", styles: { }}, /* height, lineHeight, width, fontFamily, margin, padding, fontSize, bgColor, color, border, fontWeight, textShadow, buttonHeight, buttonWidth, buttonPadding, buttonTransform */
                                {name: "+4", command: "!reply change@4", styles: { }}, /* height, lineHeight, width, fontFamily, margin, padding, fontSize, bgColor, color, border, fontWeight, textShadow, buttonHeight, buttonWidth, buttonPadding, buttonTransform */
                                {name: "+5", command: "!reply change@5", styles: { }}, /* height, lineHeight, width, fontFamily, margin, padding, fontSize, bgColor, color, border, fontWeight, textShadow, buttonHeight, buttonWidth, buttonPadding, buttonTransform */
                                15
                            ],
                            buttonStyles: {color: C.COLORS.black, bgColor: C.COLORS.green}, /* height, lineHeight, width, fontFamily, margin, padding, fontSize, bgColor, color, border, fontWeight, textShadow, buttonHeight, buttonWidth, buttonPadding, buttonTransform */
                            styles: {margin: "0px 0px 5px 0px"} /* height, width, margin, textAlign */
                        },
                        {
                            type: "ButtonLine",
                            contents: [
                                {text: "Remove Dice:", styles: {width: "19%", textIndent: "0px", textAlign: "right"}}, /* height, width, fontFamily, fontSize, bgColor, color, margin, textAlign, textIndent, padding, lineHeight */
                                {name: "-1", command: "!reply change@-1", styles: { }}, /* height, lineHeight, width, fontFamily, margin, padding, fontSize, bgColor, color, border, fontWeight, textShadow, buttonHeight, buttonWidth, buttonPadding, buttonTransform */
                                {name: "-2", command: "!reply change@-2", styles: { }}, /* height, lineHeight, width, fontFamily, margin, padding, fontSize, bgColor, color, border, fontWeight, textShadow, buttonHeight, buttonWidth, buttonPadding, buttonTransform */
                                {name: "-3", command: "!reply change@-3", styles: { }}, /* height, lineHeight, width, fontFamily, margin, padding, fontSize, bgColor, color, border, fontWeight, textShadow, buttonHeight, buttonWidth, buttonPadding, buttonTransform */
                                {name: "-4", command: "!reply change@-4", styles: { }}, /* height, lineHeight, width, fontFamily, margin, padding, fontSize, bgColor, color, border, fontWeight, textShadow, buttonHeight, buttonWidth, buttonPadding, buttonTransform */
                                {name: "-5", command: "!reply change@-5", styles: { }}, /* height, lineHeight, width, fontFamily, margin, padding, fontSize, bgColor, color, border, fontWeight, textShadow, buttonHeight, buttonWidth, buttonPadding, buttonTransform */
                                15
                            ],
                            buttonStyles: {color: C.COLORS.black, bgColor: C.COLORS.lightred}, /* height, lineHeight, width, fontFamily, margin, padding, fontSize, bgColor, color, border, fontWeight, textShadow, buttonHeight, buttonWidth, buttonPadding, buttonTransform */
                            styles: {margin: "0px 0px 5px 0px"} /* height, width, margin, textAlign */
                        }
                    ],
                    blockStyles: { } /* color, bgGradient, bgColor, bgImage, border, margin, width, padding */
                },
                (commandString) => { // IMPORTANT: return 'true' if you want to hold this function open for more commands
                    const params = D.ParseToObj(commandString, ",", "@") // key:value pairs must be in key@pairs for this to work. Multiple commands comma-delimited.
                    if ("clear" in params)
                        clearRoller()
                    if ("cycle" in params)
                        if (params.cycle === -1)
                            loadPrevRoll()
                        else if (params.cycle === 1)
                            loadNextRoll()
                    if ("change" in params)
                        changeRoll(params.change)
                }
            )
        },
        secrecyMenu = (reportMessage) => {
            const buttonLines = Object.values(_.groupBy(
                Object.values(
                    D.KeyMapObj(STATE.REF.nextRollFlags, null,
                                (v, k) => ({
                                    name: `${k.replace(/isHiding/gu, "").replace(/([a-z])([A-Z])/gu, "$1 $2")}`,
                                    command: `!reply ${v ? "" : "!"}${k}`,
                                    styles: {bgColor: v && C.COLORS.darkgrey || C.COLORS.green, color: v && C.COLORS.white || C.COLORS.black}
                                }))
                ), (x, i) => Math.floor((i+2)/3))).map(x => ({type: "ButtonLine", contents: x.length === 1 ? [0, x[0], 0] : x, buttonStyles: {}, styles: {}}))
            buttonLines.unshift({
                type: "ButtonLine",
                contents: [
                    0,
                    {name: "Show All", command: "!reply all", styles: {bgColor: C.COLORS.puregreen, color: C.COLORS.black /* height, lineHeight, width, fontFamily, margin, padding, fontSize, bgColor, color, border, fontWeight, textShadow, buttonHeight, buttonWidth, buttonPadding, buttonTransform */}},
                    {name: "Default", command: "!reply default", styles: {bgColor: C.COLORS.midgold, color: C.COLORS.black /* height, lineHeight, width, fontFamily, margin, padding, fontSize, bgColor, color, border, fontWeight, textShadow, buttonHeight, buttonWidth, buttonPadding, buttonTransform */}},
                    {name: "Hide All", command: "!reply !all", styles: {bgColor: C.COLORS.darkgrey /* height, lineHeight, width, fontFamily, margin, padding, fontSize, bgColor, color, border, fontWeight, textShadow, buttonHeight, buttonWidth, buttonPadding, buttonTransform */}},
                    0
                ]
            })
            buttonLines.push({
                type: "ButtonLine",
                contents: [
                    0,
                    {name: "Finished", command: "!reply done", styles: {bgColor: C.COLORS.brightblue, color: C.COLORS.black /* height, lineHeight, width, fontFamily, margin, padding, fontSize, bgColor, color, border, fontWeight, textShadow, buttonHeight, buttonWidth, buttonPadding, buttonTransform */}},
                    0
                ]
            })
            D.CommandMenu(
                {
                    title: "Roll Secrecy",
                    rows: [
                        {type: "ClearBody", contents: reportMessage, styles: {textAlign: "center"}},
                        ...buttonLines,
                        {type: "Header", contents: "Roller Locked Until Finished"}
                    ]
                },
                (replyString) => {
                    const rollFlagKey = replyString.replace(/^!/gu, ""),
                        rollFlagName = rollFlagKey.replace(/isHiding/gu, "").replace(/([a-z])([A-Z])/gu, "$1 $2"),
                        toggle = replyString.startsWith("!")
                    DB({replyString, rollFlagKey, rollFlagName, toggle, STATEREF: D.JS(STATE.REF.nextRollFlags), inState: rollFlagKey in STATE.REF.nextRollFlags, isEqual: STATE.REF.nextRollFlags[rollFlagKey] !== toggle}, "setRollFlags")
                    if (D.LCase(rollFlagKey) === "all") {
                        for (const flagKey of Object.keys(STATE.REF.nextRollFlags))
                            STATE.REF.nextRollFlags[flagKey] = toggle
                        D.Call(`!roll set secrecy menu ${C.HTML.ClearBody(`Now <b><u>${toggle && "HIDING" || "SHOWING"}</u> ALL VALUES</b>`, {margin: "0px", textAlign: "center", color: toggle && C.COLORS.brightgrey || C.COLORS.puregreen})}`)                                             
                    } else if (D.LCase(rollFlagKey) === "done") {
                        D.Alert("Secrecy Set, Roller Unlocked!", "none")
                    } else if (D.LCase(rollFlagKey) === "default") {
                        STATE.REF.nextRollFlags = D.Clone(SECRECYDEFAULTS)
                        D.Call(`!roll set secrecy menu ${C.HTML.ClearBody("Default Secrecy Values Set:", {margin: "0px", textAlign: "center", color: C.COLORS.brightgold})}`) 
                    } else if (rollFlagKey in STATE.REF.nextRollFlags && STATE.REF.nextRollFlags[rollFlagKey] !== toggle) {
                        STATE.REF.nextRollFlags[rollFlagKey] = !STATE.REF.nextRollFlags[rollFlagKey]                                                
                        D.Call(`!roll set secrecy menu ${C.HTML.ClearBody(`Now <b><u>${toggle && "HIDING" || "SHOWING"}</u> &quot;${rollFlagName}&quot;</b>`, {margin: "0px", textAlign: "center", color: toggle && C.COLORS.brightgrey || C.COLORS.puregreen})}`) // <span style="font-family: 'color: ${toggle && C.COLORS.brightgrey || C.COLORS.bright};">Now <b><u>${toggle && "HIDING" || "SHOWING"}</u> &quot;${rollFlagName}&quot;</b>`)
                    }
                }
            )
        },
        changeRoll = (deltaDice, isNPCRoll) => {
            const rollRecord = getCurrentRoll(isNPCRoll),
                rollData = _.clone(rollRecord.rollData)
            let rollResults = _.clone(rollRecord.rollResults)
            if (D.Int(deltaDice) < 0) {
                _.shuffle(rollResults.diceVals)
                for (let i = 0; i > deltaDice; i--) {
                    const cutIndex = rollResults.diceVals.findIndex(v => v.startsWith("B"))
                    if (cutIndex === -1)
                        return THROW(`Not enough base dice to remove in: ${D.JSL(rollResults.diceVals)}`, "changeRoll()")
                    rollResults.diceVals.splice(cutIndex, 1)
                }
            }
            rollResults = rollDice(Object.assign(rollData, {
                type: "trait",
                rerollAmt: D.Int(deltaDice) > 0 ? D.Int(deltaDice) : 0,
                diff: rollData.diff
            }), rollResults.diceVals)
            rollData.dicePool += D.Int(deltaDice)
            rollData.basePool = Math.max(1, rollData.dicePool) - rollData.hungerPool
            replaceRoll(rollData, rollResults)
            displayRoll(true, isNPCRoll)
            return true
        },
        lockRoller = lockToggle => { isLocked = lockToggle === true },
        loadRoll = (rollIndex, isNPCRoll) => {
            setCurrentRoll(rollIndex, isNPCRoll, true)
            displayRoll(false, isNPCRoll)
        },
        loadPrevRoll = (isNPCRoll) => {
            const recordRef = isNPCRoll ? STATE.REF.NPC : STATE.REF            
            if (recordRef && recordRef.rollRecord && recordRef.rollRecord.length)
                loadRoll(Math.min(recordRef.rollIndex + 1, Math.max(recordRef.rollRecord.length - 1, 0)), isNPCRoll)
        },
        loadNextRoll = (isNPCRoll) => {
            const recordRef = isNPCRoll ? STATE.REF.NPC : STATE.REF
            if (recordRef && recordRef.rollRecord && recordRef.rollRecord.length)
                loadRoll(Math.max(recordRef.rollIndex - 1, 0), isNPCRoll)
        },
        quickRouseCheck = (charRef, isDoubleRouse = false, isOblivionRouse = false, isPublic = false) => {
            const results = isDoubleRouse ? _.sortBy([randomInteger(10), randomInteger(10)]).reverse() : [randomInteger(10)],
                deltaAttrs = {stain: undefined, hunger: false}
            let [header, body] = [
                `${isPublic ? `${D.GetName(charRef)}'s `: ""}${isDoubleRouse ? "Double " : ""}Rouse Check: ${results[0]}${isDoubleRouse ? `, ${results[1]}` : ""}`,
                ""
            ]
            if (isOblivionRouse)
                if (isDoubleRouse && (
                    results[0] === 10 && results[1] === 1 || results[0] === results[1] && [1,10].includes(results[0])
                ) || 
                    !isDoubleRouse && (
                        results[0] === 10 || results[0] === 1
                    ))
                    deltaAttrs.stain = true
                else if (isDoubleRouse && results[0] === 10 && results[1] <= 5)
                    deltaAttrs.stain = null
            if (results[0] <= 5)
                deltaAttrs.hunger = true
            if (deltaAttrs.hunger) {
                body = C.HTML.Body("Hunger Roused.")
                Char.AdjustHunger(charRef, 1, false, false)
            } else if (deltaAttrs.stain !== null) {
                body = C.HTML.Body("Restrained.", {color: C.COLORS.white})
            }
            if (deltaAttrs.stain === true) {
                body += C.HTML.Body("The Abyss drags you deeper.", {color: C.COLORS.darkpurple, textShadow: "0px 0px 2px white, 0px 0px 2px white, 0px 0px 2px white, 0px 0px 2px white"})
                Char.AdjustTrait(charRef, "stains", 1, 0, 10, 0, null, false)
            } else if (deltaAttrs.stain === null) {
                body += C.HTML.Body("Choose: Your Soul or your Beast?", {color: C.COLORS.darkpurple, textShadow: "0px 0px 2px white, 0px 0px 2px white, 0px 0px 2px white, 0px 0px 2px white"})
            } else if (isOblivionRouse) {
                body += C.HTML.Body("Your humanity remains.", {color: C.COLORS.white, textShadow: `0px 0px 2px ${C.COLORS.darkpurple}, 0px 0px 2px ${C.COLORS.darkpurple}, 0px 0px 2px ${C.COLORS.darkpurple}, 0px 0px 2px ${C.COLORS.darkpurple}`})
            }
            D.Chat(isPublic && "all" || charRef, C.HTML.Block([
                C.HTML.Header(header),
                body].join("")))
        },
    // #endregion

    // #region SECRET ROLLS
        makeSecretRoll = (chars, params, isSilent, isHidingTraits) => {
        // D.Alert(`Received Parameters: ${params}`)
            chars = _.flatten([chars])
            let rollData = buildDicePool(getRollData(chars[0], "secret", params)),
                [traitLine, playerLine] = ["", ""]
            const {
                    dicePool
                } = rollData,
                blocks = []

            if (isHidingTraits || rollData.traits.length === 0) {
                playerLine = `${CHATSTYLES.space30 + CHATSTYLES.secret.greyS}... rolling </span>${CHATSTYLES.secret.whiteB}${dicePool}</span>${CHATSTYLES.space10}${CHATSTYLES.secret.greyS}${dicePool === 1 ? " die " : " dice "}...</span>${CHATSTYLES.space40}`
            } else {
                playerLine = `${CHATSTYLES.secret.greyS}rolling </span>${CHATSTYLES.secret.white}${_.values(rollData.traitData).map(x => x.display.toLowerCase()).join(`</span><br>${CHATSTYLES.space30}${CHATSTYLES.secret.greyPlus}${CHATSTYLES.secret.white}`)}</span>`
                if (rollData.mod !== 0)
                    playerLine += `${(rollData.mod > 0 ? CHATSTYLES.secret.greyPlus : "") + (rollData.mod < 0 ? CHATSTYLES.secret.greyMinus : "") + CHATSTYLES.secret.white + Math.abs(rollData.mod)}</span>`
            }

            if (rollData.traits.length) {
                traitLine = _.values(rollData.traitData).map(x => x.display).join(" + ")
                if (rollData.mod !== 0)
                    traitLine += (dicePool > 0 ? " + " : "") + (dicePool < 0 ? " - " : "") + Math.abs(rollData.mod)
            } else {
                traitLine = rollData.mod + (rollData.mod === 1 ? " Die" : " Dice")
            }
            _.each(chars, char => {
                rollData = getRollData(char, "secret", params)
                rollData.isSilent = isSilent || false
                rollData.isHidingTraits = isHidingTraits || false
                rollData = buildDicePool(rollData)
                let outcomeLine = ""
                const rollResults = rollDice(rollData),
                    {
                        total,
                        margin
                    } = rollResults
                if ((total === 0 || margin < 0) && rollResults.H.botches > 0)
                    outcomeLine = `${CHATSTYLES.outcomeRedSmall}BESTIAL FAIL!`
                else if (margin >= 0 && rollResults.critPairs.hb + rollResults.critPairs.hh > 0)
                    outcomeLine = `${CHATSTYLES.outcomeWhiteSmall}MESSY CRIT! (${rollData.diff > 0 ? `+${margin}` : total})`
                else if (total === 0)
                    outcomeLine = `${CHATSTYLES.outcomeRedSmall}TOTAL FAILURE!`
                else if (margin < 0)
                    outcomeLine = `${CHATSTYLES.outcomeRedSmall}FAILURE${rollData.diff > 0 ? ` (${margin})` : ""}`
                else if (rollResults.critPairs.bb > 0)
                    outcomeLine = `${CHATSTYLES.outcomeWhiteSmall}CRITICAL! (${rollData.diff > 0 ? `+${margin}` : total})`
                else
                    outcomeLine = `${CHATSTYLES.outcomeWhiteSmall}SUCCESS! (${rollData.diff > 0 ? `+${margin}` : total})`
                blocks.push(`${CHATSTYLES.secret.startBlock + CHATSTYLES.secret.blockNameStart + rollData.charName}</div>${
                    CHATSTYLES.secret.diceStart}${formatDiceLine(rollData, rollResults, 9, undefined, true).replace(/text-align: center; height: 20px/gu, "text-align: center; height: 20px; line-height: 25px").
                    replace(/margin-bottom: 5px;/gu, "margin-bottom: 0px;").
                    replace(/(color: [^\s]*?; height:) 24px/gu, "$1 18px").
                    replace(/height: 24px/gu, "height: 20px").
                    replace(/height: 22px/gu, "height: 18px")}</div>${
                    CHATSTYLES.secret.lineStart}${outcomeLine}</div></div></div>`)
                if (rollData.isSilent)
                    D.Chat("Storyteller", `${CHATSTYLES.secret.startPlayerBlock}${CHATSTYLES.secret.playerTopLineStart}<span style="width: 100%; text-align: center; text-align-last: center;">(SECRET ROLL)</span></div></div>`, undefined, D.RandomString(3))
                else if (rollData.playerID)
                    D.Chat(rollData.playerID, `${CHATSTYLES.secret.startPlayerBlock}${CHATSTYLES.secret.playerTopLineStart}you are being tested ...</div>${CHATSTYLES.secret.playerBotLineStart}${playerLine}</div></div>`, null, D.RandomString(3))
            })
            D.Chat("Storyteller", `${CHATSTYLES.fullBox + CHATSTYLES.secret.topLineStart + (rollData.isSilent ? "Silently Rolling" : "Secretly Rolling") + (rollData.isHidingTraits ? " (Traits Hidden)" : " ...")}</div>${CHATSTYLES.secret.traitLineStart}${traitLine}${rollData.diff > 0 ? ` vs. ${rollData.diff}` : ""}</div>${blocks.join("")}</div></div>`, undefined, D.RandomString(3))
        },
    // #endregion

    // #region DISCIPLINE ROLLS
    /*
        checkPrerequisites = (charObj) => {
            // Scans character sheet for discipline powers missing prerequisites.
        },
        displayDiscPanel = (charObj, discName, discPower, options = {}) => {
            // Outputs to CHAT information about a discipline, calculating stat-based parameters (e.g. Soaring Leap's jump distance).  May include buttons for player to configure how they will use it.
        },
        parseDiscResult = (charObj, discName, discPower, rollResults, options = {}) => {
            // Outputs to CHAT the specific effects of a power. RollResults only needed if power requires a roll. If no result configured, calls displayDiscPanel instead.
        },
    */

    // #endregion

    // #region RESONANCE: Getting Random Resonance Based On District/Site Parameters
        getResonance = (charRef, posRes = "", negRes = "", /* marginBonus = 0, */ isDoubleAcute, testCycles = 0) => {
            DB(`Resonance Args: ${D.JSL(charRef)}, ${D.JSL(posRes)}, ${D.JSL(negRes)}`, "getResonance")
            const charObj = D.GetChar(charRef),
                resonances = {
                    c: "Choleric",
                    m: "Melancholic",
                    p: "Phlegmatic",
                    s: "Sanguine",
                    r: "Primal",
                    i: "Ischemic",
                    q: "Mercurial"
                },
                discLines = {
                    "Choleric": "the resonant disciplines of Celerity and Potence",
                    "Melancholic": "the resonant disciplines of Fortitude and Obfuscate",
                    "Phlegmatic": "the resonant disciplines of Auspex and Dominate",
                    "Sanguine": "the resonant disciplines of Blood Sorcery and Presence",
                    "Primal": "the resonant disciplines of Animalism and Protean",
                    "Ischemic": "the resonant discipline of Oblivion",
                    "Mercurial": "the resonant disciplines of Alchemy and Vicissitude"
                },
                posResRefs = posRes.toLowerCase().split(""),
                negResRefs = negRes.toLowerCase().split(""),
                resBins = {
                    "zero": [],
                    "2neg": [],
                    "neg": [],
                    "norm": [],
                    "pos": [],
                    "2pos": []
                },
                countRes = (resRef, resArray) => resArray.filter(x => x === resRef).length
            let oddsKey = ""
            // D.Alert(`charRef: ${D.JS(charRef)}, charObj: ${D.JS(charObj)}`)
                
            for(const resRef of Object.keys(resonances))
                if (Object.keys(resonances).findIndex(x => x === resRef) <= 3 ||
                        countRes(resRef, posResRefs) - countRes(resRef, negResRefs) > 0)
                    resBins[Object.keys(resBins)[countRes(resRef, posResRefs) - countRes(resRef, negResRefs) + 3]].push(resRef)
                else
                    resBins.zero.push(resRef)
            for (const bin of ["2neg", "neg", "pos", "2pos"])
                oddsKey += bin.repeat(resBins[bin].length)
            if (oddsKey === "")
                oddsKey = "norm"
            // D.Alert(`KEY: ${oddsKey}<br>Bins: ${D.JS(resBins)}`)
            const randInts = [randomInteger(1000), randomInteger(1000)],
                resOdds = {
                    flavor: C.RESONANCEODDS.flavor[oddsKey][["r", "i", "q"].reduce((tot, x) => tot + countRes(x, [...resBins.pos, ...resBins["2pos"]]), 0)],
                    intensity: C.RESONANCEODDS.intensity[isDoubleAcute === "2" && "doubleAcute" || "norm"]
                },
                flavorOdds = resOdds.flavor.map((x, i, a) => Math.round((i === 0 && x || x + a.slice(0, i).reduce((tot, xx) => tot + xx, 0))*1000)),
                intOdds = resOdds.intensity.map((x, i, a) => Math.round((i === 0 && x || x + a.slice(0, i).reduce((tot, xx) => tot + xx, 0))*1000)),
                resChoice = resonances[_.flatten(_.values(resBins)).reverse()[flavorOdds.findIndex(x => randInts[0] < x)]],
                intChoice = ["Negligible", "Fleeting", "Intense", "Acute"][intOdds.findIndex(x => randInts[1] < x)]
                
            // D.Alert(`RandInts: [${randInts.join(", ")}]<br><br>Bin Array: [${D.JS(_.flatten(_.values(resBins)).reverse().join(", "))}]: ${resChoice}<br><br>IntOdds: [${D.JS(intOdds.join(", "))}]: ${intChoice}`)
            
            // STEP ONE: COMPARE POSRES AND NEGRES FLAGS. CANCEL OUT RESONANCES. ELIMINATE PURE-NEG RARE RESONANCES. DETERMINE ODDS KEY.
                        
            if (D.Int(testCycles) > 0) {
                const record = {
                        N: {Cho: 0, Mel: 0, Phl: 0, Sng: 0, Pri: 0, Isc: 0, Mrc: 0, TOT: 0, PER: 0},
                        F: {Cho: 0, Mel: 0, Phl: 0, Sng: 0, Pri: 0, Isc: 0, Mrc: 0, TOT: 0, PER: 0},
                        I: {Cho: 0, Mel: 0, Phl: 0, Sng: 0, Pri: 0, Isc: 0, Mrc: 0, TOT: 0, PER: 0},
                        A: {Cho: 0, Mel: 0, Phl: 0, Sng: 0, Pri: 0, Isc: 0, Mrc: 0, TOT: 0, PER: 0},
                        Cho: {N: 0, F: 0, I: 0, A: 0, TOT: 0, PER: 0},
                        Mel: {N: 0, F: 0, I: 0, A: 0, TOT: 0, PER: 0},
                        Phl: {N: 0, F: 0, I: 0, A: 0, TOT: 0, PER: 0},
                        Sng: {N: 0, F: 0, I: 0, A: 0, TOT: 0, PER: 0},
                        Pri: {N: 0, F: 0, I: 0, A: 0, TOT: 0, PER: 0},
                        Isc: {N: 0, F: 0, I: 0, A: 0, TOT: 0, PER: 0},
                        Mrc: {N: 0, F: 0, I: 0, A: 0, TOT: 0, PER: 0}
                    },
                    resBinsReversed = _.flatten(_.values(resBins)).reverse()
                let dbString = ""                    
                for (let i = 0; i < D.Int(testCycles); i++) {                    
                    const randNums = [randomInteger(1000), randomInteger(1000)]
                    let results = [
                        resonances[resBinsReversed[flavorOdds.findIndex(x => randNums[0] <= x)]],
                        ["Negligible", "Fleeting", "Intense", "Acute"][intOdds.findIndex(x => randNums[1] <= x)]
                    ]
                    dbString = `${i}: [${randNums.join(", ")}]: ${D.JS(results)}`
                    try {                        
                        results = results.map(x => ({Choleric: "Cho", Melancholic: "Mel", Phlegmatic: "Phl", Sanguine: "Sng", Primal: "Pri", Ischemic: "Isc", Mercurial: "Mrc"}[x] || x.slice(0,1)))
                    } catch (errObj) {
                        return THROW(`Error: ${D.JSL(dbString)}<br><br>Odds: ${D.JS(flavorOdds)}<br>${D.JS(intOdds)}`, "getResonance", errObj)
                    }
                    record[results[1]][results[0]]++
                    record[results[0]][results[1]]++
                }
                let [flaTot, intTot] = [0,0]
                for (const intensity of Object.keys(record).slice(0,4)) {
                    dbString += `Keys: ${Object.keys(record).slice(0,4)}, Vals: [${_.values(record[intensity]).slice(0,7).join(",")}], Adding: ${_.values(record[intensity]).slice(0,7).reduce((tot, x) => tot + x, 0)}. `
                    record[intensity].TOT += _.values(record[intensity]).slice(0,7).reduce((tot, x) => tot + x, 0)
                    intTot += record[intensity].TOT
                }
                for (const flavor of Object.keys(record).slice(4)) {
                    record[flavor].TOT += _.values(record[flavor]).slice(0,4).reduce((tot, x) => tot + x, 0)
                    flaTot += record[flavor].TOT
                }
                for (const intensity of Object.keys(record).slice(0,4))
                    record[intensity].PER = `${Math.round(10000*record[intensity].TOT/intTot)/100}%`
                for (const flavor of Object.keys(record).slice(4))
                    record[flavor].PER = `${Math.round(10000*record[flavor].TOT/flaTot)/100}%`
                    
                const returnRows = []
                for (const k of Object.keys(record)) {
                    const thisRowLines = []
                    for (const kk of Object.keys(record[k]))
                        thisRowLines.push(`${kk}: ${record[k][kk]}`)
                    returnRows.push(`<b>${k}</b>: { ${thisRowLines.join(", ")} }`)
                }     
                
                const intResults = _.values(record).slice(0,4).map(x => x.PER).join(", "),
                    flaResults = Object.keys(record).slice(4).map(k => [k.slice(0,1), parseFloat(record[k].PER.slice(0,-1))]).sort((a,b) => b[1] - a[1]).map(x => `${x[0]}: ${x[1]}%`).join(", ")
                
                D.Alert(`${D.JS(Object.keys(resBins).map(x => `      <b>${x}</b>: [${resBins[x].join(",")}]`).join(", "))}<br><br><pre>${D.JS(returnRows.join("<br>"))}</pre><br><pre>Flavor..: ${D.JS(resOdds.flavor.map(x => `_: ${D.Int(x*10000)/100}.${"0".repeat(4 - `${D.Int(x*10000)/100}`.length)}%`).join(", "))}]<br>Compared: ${flaResults}</pre><br><br>Int Odds: [${D.JS(resOdds.intensity.map(x => `${x*100}%`).join(", "))}]<br>Compared: ${intResults}`)
            }
            if (VAL({charObj}) && ["Intense", "Acute"].includes(intChoice))
                setAttrs(charObj.id, {resonance: resChoice})
            else
                setAttrs(charObj.id, {resonance: "None"})
            return [
                intChoice,
                resChoice,
                discLines[resChoice]
            ]
            // Return ["Acute", "Choleric"];
        },
        displayResonance = (charRef, posRes, negRes, isDoubleAcute, testCycles = 0) => {
            const marginBonus = Number(STATE.REF.resMarginBonus)            
            STATE.REF.resMarginBonus = 0
            if (["l", "r", "c", "", undefined, null].includes(posRes)) {
                const locations = Session.ActiveLocations(posRes);
                [posRes, negRes] = ["", ""]
                for (const location of Object.keys(locations))
                    if (location.includes("District")) {
                        posRes += C.DISTRICTS[locations[location]].resonance[0] || ""
                        negRes += C.DISTRICTS[locations[location]].resonance[1] || ""
                    } else {                        
                        posRes += C.SITES[locations[location]].resonance[0] || ""
                        negRes += C.SITES[locations[location]].resonance[1] || ""
                    }
                DB({locations, posRes, negRes}, "displayResonance")
            }
            posRes = posRes === "x" ? "" : posRes
            negRes = negRes === "x" ? "" : negRes
            const resonance = getResonance(charRef, posRes, negRes, marginBonus, isDoubleAcute, testCycles)
            let resDetails, resIntLine
            switch (resonance[1].toLowerCase()) {
                case "choleric":
                    resDetails = "Angry ♦ Passionate ♦ Violent ♦ Envious"
                    break
                case "sanguine":
                    resDetails = "Happy ♦ Horny ♦ Addicted ♦ Enthusiastic"
                    break
                case "melancholic":
                    resDetails = "Sad ♦ Scared ♦ Intellectual ♦ Grounded"
                    break
                case "phlegmatic":
                    resDetails = "Calm ♦ Apathetic ♦ Lazy ♦ Controlling"
                    break
                case "primal":
                    resDetails = "Base ♦ Impulsive ♦ Irascible ♦ Insatiable"
                    break
                case "ischemic":
                    resDetails = "Cold ♦ Amoral ♦ Patient ♦ Nihilistic"
                    break
                case "mercurial":
                    resDetails = "Fluid ♦ Fatalistic ♦ Inscrutable ♦ Alien"
                    break
                // no default
            }
            switch (resonance[0].toLowerCase()) {
                case "negligible":
                    resonance[0] = "Negligibly"
                    resIntLine = `The blood carries only the smallest hint of ${resonance[1].toLowerCase()} resonance.  It is not strong enough to confer any benefits at all.`
                    break
                case "fleeting":
                    resonance[0] = "Fleetingly"
                    resIntLine = `The blood's faint ${resonance[1].toLowerCase()} resonance can guide you in developing ${resonance[2]}, but lacks any real power.`
                    break
                case "intense":
                    resonance[0] = "Intensely"
                    resIntLine = `The blood's strong ${resonance[1].toLowerCase()} resonance spreads through you, infusing your own vitae and enhancing both your control and understanding of ${resonance[2]}.`
                    break
                case "acute":
                    resonance[0] = "Acutely"
                    resIntLine = `This blood is special.  In addition to enhancing ${resonance[2]}, its ${resonance[1].toLowerCase()} resonance is so powerful that the emotions within have crystallized into a dyscracias.`
                    break
                // no default
            }
            let huntString = `${D.GetName(charRef, true)} hunts`
            if (Session.Site && C.SITES[Session.Site])
                huntString += ` at ${C.SITES[Session.Site].fullName} `
            else
                huntString += " "
            huntString += `in ${C.DISTRICTS[Session.District].fullName}.`
            if (marginBonus > 0)
                huntString += `<span style="display: block; text-align: right; text-align-last: right; margin-right: 5px; font-size: 10px; height: 11px; line-height: 11px; color: #AAAAAA; font-weight: normal; font-family: Voltaire;">(Resonance Bonus: +${marginBonus}0%)</span>`
            D.Chat("all", C.HTML.Block([
                C.HTML.Body(huntString, {lineHeight: "20px", margin: "2px 0px 4px 5px", fontSize: "16px", textAlign: "left"}),
                C.HTML.Header("The Blood tastes...", {padding: "0px 0px 0px 5px", fontWeight: "normal", textAlign: "left"} ),
                C.HTML.Title(_.map([resonance[0], resonance[1]], v => v.toUpperCase()).join(" ")),
                C.HTML.Header(resDetails),
                C.HTML.Body(resIntLine, {lineHeight: "20px"})
            ]))
        }
    // #endregion

    return {
        OnChatCall: onChatCall,        
        CheckInstall: checkInstall,

        get LastProjectPrefix() { return STATE.REF.lastProjectPrefix },
        get LastProjectCharID() { return STATE.REF.lastProjectCharID },

        ROLLERTEXT: SETTINGS.textKeys,
        Select: selectDie,
        Reroll: wpReroll,
        Clean: clearRoller,
        Kill: killRoller,
        Init: initFrame,
        Lock: lockRoller,
        QuickRouse: quickRouseCheck,
        get Margin() { return getCurrentRoll().rollResults.margin },
        get Commit() { return getCurrentRoll().rollResults.commit },
        get Char() { return D.GetChar(getCurrentRoll().rollData.charID) },

        AddCharEffect: addCharRollEffect,
        DelCharEffect: delCharRollEffect,
        AddGlobalEffect: addGlobalRollEffect,
        DelGlobalEffect: delGlobalRollEffect,
        AddGlobalExclude: addGlobalExclusion,
        DelGlobalExclude: delGlobalExclusion
    }
})()

on("ready", () => {
    Roller.CheckInstall()
    D.Log("Roller Ready!")
})
void MarkStop("Roller")