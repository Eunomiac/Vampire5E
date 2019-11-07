void MarkStart("Char")
const Char = (() => {
    // ************************************** CLEAN DISABLE (UNCOMMENT TO DISABLE SCRIPT) *******************************************
    /* return {
        RegisterEventHandlers: () => false,
        CheckInstall:  () => false,
        REGISTRY: () => false,
        Damage:  () => false,
        AdjustTrait:  () => false,
        AdjustHunger:  () => false,
        DaySleep:  () => false,
        AwardXP:  () => false,
        LaunchProject:  () => false,
        SendHome:  () => false,
        SendBack:  () => false,
        PromptTraitSelect:  () => false,
        RefreshDisplays:  () => false,
        get SelectedChar() { return false },
        get SelectedTraits() { return false }
    } */
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Char",

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
        initialize = () => {
            STATEREF.registry = STATEREF.registry || {}
            STATEREF.weeklyResources = STATEREF.weeklyResources || {}
            STATEREF.customStakes = STATEREF.customStakes || {}
            STATEREF.customStakes.coterie = STATEREF.customStakes.coterie || []
            STATEREF.customStakes.personal = STATEREF.customStakes.personal || {A: [], L: [], N: [], R: []}
            STATEREF.tokenRecord = STATEREF.tokenRecord || []
            STATEREF.traitSelection = STATEREF.traitSelection || []

        /* STATEREF.registry = {
            TopLeft: {
                id: "-LluFXX9vtlTeb_D7t4y",
                name: "Locke Ulrich",
                playerID: "LMGDQqIvyL87oIfrVDX",
                playerName: "PixelPuzzler",
                tokenName: "LockeUlrichToken",
                shortName: "Locke",
                initial: "L",
                quadrant: "TopLeft"
            },
            BotLeft: {
                id: "-LU7pYIreUSrtqZ3UL46",
                name: "Dr. Arthur Roy",
                playerID: "-LN6n-fR8cSNR2E_N_3q",
                playerName: "banzai",
                tokenName: "Dr.ArthurRoyToken",
                shortName: "Roy",
                initial: "R",
                quadrant: "BotLeft"
            },
            TopRight: {
                id: "-LU7packiBP3Zg5H4Ao_",
                name: "Johannes Napier",
                playerID: "-LN7lNnjuWmFuvVPW76H",
                playerName: "Thaumaterge",
                tokenName: "JohannesNapierToken",
                shortName: "Napier",
                initial: "N",
                quadrant: "TopRight"
            },
            BotRight: {
                id: "-LU7p_BZ3yaOqjWCoOUh",
                name: "Ava Wong",
                playerID: "-LMGDbZCKw4bZk8ztfNf",
                playerName: "Ava Wong",
                tokenName: "AvaWongToken",
                shortName: "Ava",
                initial: "A",
                quadrant: "BotRight"
            }
        } */

        // Storyteller Override:
        // STATEREF.registry.TopLeft.playerID = "-LLIBpH_GL5I-9lAOiw9"

        // Return Player Control:
        // STATEREF.registry.TopLeft.playerID = "-LMGDQqIvyL87oIfrVDX"
        // STATEREF.registry.BotLeft.playerID = "-LN6n-fR8cSNR2E_N_3q"
        // STATEREF.registry.TopRight.playerID = "-LN7lNnjuWmFuvVPW76H"
        // STATEREF.registry.BotRight.playerID = "-LMGDbZCKw4bZk8ztfNf"
        },
    // #endregion

    // #region EVENT HANDLERS: (HANDLEINPUT)
        onChatCall = (call, args, objects, msg) => { // eslint-disable-line no-unused-vars
            let charObjs = Listener.GetObjects(objects, "character")
            switch (call) {
                case "reg": {
                    switch(D.LCase(call = args.shift())) {                        
                        case "char":
                            if (VAL({selection: msg}, "!char reg char"))
                                registerChar(msg, D.Int(args.shift()), args.shift(), args.shift(), args.shift())
                            else
                                D.Alert("Select character tokens first!  Syntax: !char reg char <shortName> <initial> <quadrant>", "!char reg char")
                            break
                        case "weekly": case "resource": case "weeklyresource": {
                            const resInitial = args.shift().toUpperCase(),
                                resAmount = D.Int(args.pop()),
                                resName = args.join(" ")
                            regResource(resInitial, resName, resAmount)
                            break
                        }
                        case "stake": {
                            switch (D.LCase(call = args.shift())) {
                                case "coterie": {                                  
                                    const [name, value, max, date] = args.join(" ").split("|")
                                    STATEREF.customStakes.coterie.push([name, D.Int(value), D.Int(max), date])
                                    break
                                }
                                default: {
                                    const initial = call,
                                        [name, value, max, date] = args.join(" ").split("|")
                                    STATEREF.customStakes.personal[initial].push([name, D.Int(value), D.Int(max), date])
                                    break
                                }
                            }
                            displayStakes()
                            break
                        }
                        // no default
                    }
                    break
                }
                case "unreg": {
                    switch(D.LCase(call = args.shift())) {  
                        case "char":
                            unregisterChar(args.shift())
                            break                      
                        case "weekly": case "resource": case "weeklyresource":
                            unregResource(args.shift(), D.Int(args.shift()))
                            break
                        case "stake": {
                            switch (D.LCase(call = args.shift())) {
                                case "coterie": {
                                    STATEREF.customStakes.coterie = STATEREF.customStakes.coterie.filter(x => x[0].toLowerCase() !== args.join(" ").toLowerCase())
                                    break
                                }
                                default: {
                                    const initial = call,
                                        name = args.join(" ")
                                    STATEREF.customStakes.personal[initial] = STATEREF.customStakes.personal[initial].filter(x => x[0].toLowerCase() !== name.toLowerCase())
                                    break
                                }
                            }
                            displayStakes()
                        }
                        // no default
                    }
                    break
                }
                case "get": {
                    switch (D.LCase(call = args.shift())) {
                        case "stat": {
                            if (args.length) {
                                const traitName = args[0].toLowerCase() === "selected" && STATEREF.traitSelection.shift() || args.shift(),
                                    returnLines = []                                
                                if (!charObjs.length)
                                    charObjs = D.GetChars("registered")
                                while (charObjs.length) {
                                    const charLines = []
                                    let name, traitVal
                                    for (let i = 0; i < 2; i++) {
                                        if (charObjs.length) {
                                            const thisCharObj = charObjs.shift();
                                            [name, traitVal] = ["", "", ""]
                                            if (VAL({thisCharObj})) {
                                                const statData = D.GetStat(thisCharObj, traitName, true) || D.GetRepStat(thisCharObj, "*", null, traitName, true);
                                                [name, traitVal] = [
                                                    VAL({pc: thisCharObj}) ? `<b>${D.GetName(thisCharObj, true).toUpperCase()}</b>` : D.GetName(thisCharObj, true),
                                                    D.Int(statData && (statData[0] || statData.val)) ? "●".repeat(D.Int(statData && (statData[0] || statData.val))) : "~"
                                                ]
                                            }
                                        } else {
                                            [name, traitVal] = ["", ""]
                                        }
                                        charLines.push(`<div style="
                                            display: inline-block;
                                            width: 48%;
                                            overflow: hidden;
                                            margin-right: 2%;
                                        "><span style="
                                            display: inline-block;
                                            width: 60%;
                                            margin-right: 3%;
                                            color: ${traitVal === "~" && C.COLORS.grey || C.COLORS.white};
                                        ">${name}</span><span style="
                                            display: inline-block;
                                            width: 34%;
                                            margin-right: 3%;
                                            color: ${traitVal === "~" && C.COLORS.grey || C.COLORS.white};
                                        ">${traitVal}</span></div>`)
                                    }
                                    returnLines.push(charLines.join(""))
                                }  
                                sendChat(D.Capitalize(traitName, true), D.JSH(`/w Storyteller ${
                                    C.CHATHTML.Block([
                                        C.CHATHTML.Header(D.Capitalize(traitName, true)),
                                        C.CHATHTML.Body(returnLines.join("<br>"), {color: C.COLORS.white, fontWeight: "normal", fontFamily: "Voltaire", fontSize: "12px", textAlign: "left"})
                                    ].join(""))}`))
                            } else {
                                promptTraitSelect(charObjs.map(x => x.id).join(","), null, "!char @@CHARIDS@@ get stat @@TRAITNAME@@")
                            }
                            break
                        }
                        // no default
                    }
                    break
                }
                case "lock": case "unlock": {
                    const isLocking = call === "lock"
                    switch(D.LCase(call = args.shift())) {
                        case "weekly": case "resource": case "weeklyresource": {
                            if (args.length === 2) {
                                const init = D.GetCharData(charObjs[0]).initial, 
                                    [rowNum, amount] = args.map(x => D.Int(x)),
                                    [curTot, curLock] = [STATEREF.weeklyResources[init][rowNum - 1][2], STATEREF.weeklyResources[init][rowNum - 1][3]],
                                    newLock = Math.max(0, Math.min(curTot, curLock + (isLocking ? amount : -amount)))
                                STATEREF.weeklyResources[init][rowNum - 1][3] = newLock
                            } else {
                                D.Alert("Syntax:<br><br><b>!char reg (initial) (name) (total)<br>!char unreg/set/lock/unlock (initial) (rowNum) [amount]<br>!char set weekly reset</b>")
                            }
                            displayResources()
                            break
                        }
                        // no default
                    }
                    break
                }
                case "set": {
                    switch (D.LCase(call = args.shift())) {
                        case "daysleep": {
                            setDaysleepAlarm()
                            break
                        }
                        case "npc": {
                            const [charObj] = charObjs.shift(),
                                [npcObj] = charObjs.filter(x => VAL({npc: x}))
                            setCharNPC(charObj, npcObj)                      
                            break
                        }
                        case "stat": case "stats": case "attr": case "attrs": {
                            const [charObj] = charObjs
                            if (VAL({charObj}, "!char set stat"))
                                D.SetStats(charObj.id, Listener.ParseParams(args, "|"))
                            else
                                D.Alert("Select a character or provide a character reference first!", "!char set stat")
                            break
                        }
                        case "xp": {
                            DB(`!char xp COMMAND RECEIVED<br><br>Characters: ${D.JS(_.map(charObjs, v => v.get("name")))}`, "!char set xp")
                            if (VAL({charObj: charObjs}, "!char set xp", true)) {
                                const amount = D.Int(args.shift())
                                for (const charObj of charObjs)
                                    if (awardXP(charObj, amount, args.join(" ")))
                                        D.Alert(`${amount} XP awarded to ${D.GetName(charObj)}`, "!char set xp")
                                    else
                                        D.Alert(`FAILED to award ${JSON.stringify(amount)} XP to ${JSON.stringify(D.GetName(charObj))}`, "!char set xp")
                            }
                            break
                        }                                               
                        case "weekly": case "resource": case "weeklyresource": {
                            switch (D.LCase(call = args.shift())) {
                                case "reset": {
                                    resetResources()
                                    break
                                } 
                                default: {
                                    args.unshift(call)
                                    if (args.length === 2)
                                        adjustResource(charObjs[0], D.Int(args.shift()), D.Int(args.shift()))
                                    else                           
                                        D.Alert("Syntax:<br><br><b>!char reg (initial) (name) (total)<br>!char unreg/set/lock/unlock (initial) (rowNum) [amount]<br>!char set weekly reset</b>")
                                    break
                                }
                            }
                            displayResources()
                            break
                        }
                        case "desire": {
                            for (const charObj of charObjs)
                                resolveDesire(charObj)
                            break
                        }
                        // no default
                    }
                    break
                }
                case "clear": {
                    switch (D.LCase(call = args.shift())) {
                        case "npc": {
                            for (const charObj of charObjs)
                                setCharNPC(charObj, "base")                                  
                            break
                        }
                        // no default
                    }
                    break
                }
                case "list": {
                    switch (D.LCase(call = args.shift())) {
                        case "reg": case "registry": case "registered": {
                            D.Alert(REGISTRY, "Registered Player Characters")
                            break
                        }                                          
                        case "ids": case "charids": {
                            const msgStrings = []
                            for (const charObj of findObjs({_type: "character"}))
                                msgStrings.push(`${D.GetName(charObj)}<span style="color: ${C.COLORS.brightred}; font-weight:bold;">@T</span>${charObj.id}`)
                            D.Alert(D.JS(msgStrings.join("<br>")))
                            break
                        }
                        // no default
                    }
                    break
                }
                case "refresh": {
                    displayStakes()
                    displayDesires()
                    displayResources()
                    break
                }
                case "change": {
                    const fullCommand = `!char ${charObjs.length && charObjs.map(x => x.id).join(",") || ""} ${call} ${args.join(" ")}`
                    if (VAL({char: charObjs}, "!char change", true)) {
                        let isKilling = false
                        switch (args.shift().toLowerCase()) {
                            case "hungerkill": {
                                isKilling = true                              
                            }
                            // falls through
                            case "hunger": {
                                if (args.length) 
                                    for (const charObj of charObjs)
                                        adjustHunger(charObj, D.Int(args[0]), isKilling)
                                else 
                                    promptNumber(`${fullCommand} @@AMOUNT@@`)                                
                                break
                            }
                            // no default
                        }
                    }
                    break
                }
                case "dmg": case "damage": case "spend": case "heal": {
                    if (VAL({char: charObjs}, "!char dmg", true)) {
                        const fullCommand = `!char ${charObjs.length && charObjs.map(x => x.id).join(",") || ""} ${call} ${args.join(" ")}`,
                            trait = args.shift().toLowerCase(),
                            dtype = ["hum", "humanity", "stain", "stains"].includes(trait) ? null : args.shift()
                        if (args.length) {
                            const dmg = (call === "heal" ? -1 : 1) * D.Int(args.shift())
                            for (const charObj of charObjs)
                                if (!adjustDamage(charObj, trait, dtype, dmg))
                                    THROW(`FAILED to damage ${D.GetName(charObj)}`, "!char dmg")
                        } else {
                            promptNumber(`${fullCommand} @@AMOUNT@@`)
                        }
                    }
                    break
                }
                case "process": {
                    switch (D.LCase(call = args.shift())) {
                        case "defaults": {
                            populateDefaults(args.shift())
                            break
                        }
                        case "npcstats": {
                            setNPCStats(args.shift())
                            break
                        }
                        case "npchunger": {
                            const npcChars = D.GetChars("all").filter(x => VAL({npc: x})).map(x => [x.get("name"), x.id]),
                                npcVamps = npcChars.filter(x => getAttrByName(x[1], "clan").length > 2 && getAttrByName(x[1], "clan") !== "Ghoul"),
                                npcHungers = npcVamps.map(x => [
                                    x[1],
                                    x[0],
                                    Math.max(D.Int(getAttrByName(x[1], "bp_slakekill")) + randomInteger(5 - D.Int(getAttrByName(x[1], "bp_slakekill"))) - 2, D.Int(getAttrByName(x[1], "bp_slakekill")))                                    
                                ])
                            for (const hungerData of npcHungers)
                                setAttrs(hungerData[0], {hunger: hungerData[2]})
                            break
                        }
                        case "changestat": {
                            changeAttrName(args.shift(), args.shift())
                            break
                        }
                        // no default
                    }
                    break
                }
                case "send": {
                    switch (D.LCase(call = args.shift())) {
                        case "home": {
                            sendCharsHome()
                            break
                        }
                        case "district": {
                            const tokenObjs = D.GetSelected(msg, "token") || _.values(REGISTRY).map(x => Media.GetImg(x.tokenName))
                            for (const tokenObj of tokenObjs)
                                Media.SetArea(tokenObj, `District${D.Capitalize(args[0])}`)
                            break
                        }
                        case "site": {

                            break
                        }
                        // no default
                    }
                    break
                }
                case "select": {
                    switch(D.LCase(call = args.shift())) {
                        case "trait": {
                            if (args.length) {
                                const thisTrait = args.shift().toLowerCase()
                                if (STATEREF.traitSelection.includes(thisTrait))
                                    STATEREF.traitSelection = _.without(STATEREF.traitSelection, thisTrait)
                                else
                                    STATEREF.traitSelection.push(thisTrait)
                                Media.SetText("secretRollTraits", STATEREF.traitSelection.length === 0 ? " " : STATEREF.traitSelection.join("\n"), true)
                            } else {
                                promptTraitSelect()
                            }
                            break
                        }
                        case "registered":
                        case "npcs":
                        case "pcs":
                        case "sandbox": {
                            promptActionMenu(call)                            
                            break
                        }
                        default: {
                            // D.Alert(`Args: ${D.JS(args.join(","))}`)
                            if (charObjs.length)
                                promptActionMenu(charObjs)
                            else
                                promptCharSelect()                                
                            break
                        }
                    }
                    break
                }
            // no default
            }
        },
        onAttrChange = (call, attrObj) => {
            switch (call) {
                case "hunger": {
                    const hungerLevel = attrObj.get("current")
                    Media.SetImg(`Hunger${getAttrByName(attrObj.get("_characterid"), "sandboxquadrant")}_1`, hungerLevel === "0" ? "blank" : hungerLevel)
                    break
                }
                case "desire": case "_reporder_repeating_desire": {
                    displayDesires()
                    break
                }
                case "projectstake1": case "projectstake2": case "projectstake3": case "projectstake1_name": case "projectstake2_name": case "projectstake3_name": {
                    displayStakes()
                    break
                }
                case "triggertimelinesort": {
                    sortTimeline(attrObj.get("_characterid"))
                    break
                }
                // no default
            }
        },
        onAttrAdd = (call, attrObj) => {
            switch (call) {
                case "desire": case "_reporder_repeating_desire": {
                    displayDesires({charID: attrObj.get("_characterid"), val: attrObj.get("current")})
                    break
                }
                case "projectstake1": case "projectstake2": case "projectstake3": case "projectstake1_name": case "projectstake2_name": case "projectstake3_name": {
                    displayStakes()
                    break
                }
                case "triggertimelinesort": {
                    sortTimeline(attrObj.get("_characterid"))
                    break
                }
                // no default
            }
        },
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************
        REGISTRY = STATEREF.registry,
        ATTRNAMES = _.values(C.ATTRIBUTES).map(x => x.map(xx => xx.replace(/\s/gu, "_"))),
        SKILLNAMES = _.values(C.SKILLS).map(x => x.map(xx => xx.replace(/\s/gu, "_"))),
        DISCNAMES = C.DISCIPLINES.map(x => x.replace(/\s/gu, "_")),

    // #region JSON Text Blocks
    /* eslint-disable-next-line quotes */
        NPCSTATS = "{\"-LNQHXkCj5qvPpMJRgaP\": { \"base\": {\"clan\": \"Tremere\", \"faction\": \"Camarilla\", \"generation\": 8, \"blood_potency\": 6, \"humanity\": 3, \"stains\": 0 }, \"attributes\": { \"strength\": 3, \"dexterity\": 2, \"stamina\": 3, \"charisma\": 3, \"manipulation\": 3, \"composure\": 4, \"intelligence\": 6, \"wits\": 4, \"resolve\": 4 }, \"skills\": { \"6\": \"OCC\", \"5\": \"AWA INT POL INS SUB\", \"4\": \"MEL ACA INV\", \"3\": \"BRA LED ETI\", \"2\": \"PER\", \"1\": \"SCI\" }, \"clandiscs\": { \"disc1\": [\"Auspex\", 4], \"disc2\": [\"Dominate\", 5], \"disc3\": [\"Blood Sorcery\", 5] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"PRE OBF\", \"2\": \"\", \"1\": \"\" } },\"-LNQFgr6-qOsG0YDON5o\": { \"base\": {\"clan\": \"Malkavian\", \"faction\": \"Anarch\", \"generation\": 11, \"blood_potency\": 3, \"humanity\": 6, \"stains\": 0 }, \"attributes\": { \"strength\": 1, \"dexterity\": 2, \"stamina\": 2, \"charisma\": 3, \"manipulation\": 4, \"composure\": 2, \"intelligence\": 4, \"wits\": 5, \"resolve\": 2 }, \"skills\": { \"6\": \"\", \"5\": \"INS AWA\", \"4\": \"SUB LED INV\", \"3\": \"LAR SUR POL\", \"2\": \"PER TEC ETI\", \"1\": \"ATH BRA MEL FIN\" }, \"clandiscs\": { \"disc1\": [\"Auspex\", 4], \"disc2\": [\"Dominate\", 3], \"disc3\": [\"Obfuscate\", 4] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"CEL\", \"1\": \"\" } },\"-LNQFwYKATjHDhiO_SaO\": { \"base\": {\"clan\": \"Malkavian\", \"faction\": \"Anarch\", \"generation\": 12, \"blood_potency\": 2, \"humanity\": 6, \"stains\": 0 }, \"attributes\": { \"strength\": 2, \"dexterity\": 3, \"stamina\": 2, \"charisma\": 3, \"manipulation\": 4, \"composure\": 3, \"intelligence\": 2, \"wits\": 2, \"resolve\": 1 }, \"skills\": { \"6\": \"\", \"5\": \"PER\", \"4\": \"SUB\", \"3\": \"INS ATH\", \"2\": \"INV AWA STR\", \"1\": \"BRA STL DRV\" }, \"clandiscs\": { \"disc1\": [\"Auspex\", 0], \"disc2\": [\"Dominate\", 4], \"disc3\": [\"Obfuscate\", 2] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"-LNQFyJ-TyDfOrdNSi_o\": { \"base\": {\"clan\": \"Brujah\", \"faction\": \"Anarch\", \"generation\": 11, \"blood_potency\": 2, \"humanity\": 7, \"stains\": 0 }, \"attributes\": { \"strength\": 4, \"dexterity\": 3, \"stamina\": 3, \"charisma\": 2, \"manipulation\": 3, \"composure\": 2, \"intelligence\": 2, \"wits\": 1, \"resolve\": 2 }, \"skills\": { \"6\": \"\", \"5\": \"\", \"4\": \"\", \"3\": \"SUB INS\", \"2\": \"PRF STR ATH ETI LAR ACA POL PER\", \"1\": \"AWA MEL TEC FIN SUR FIR DRV MED INV\" }, \"clandiscs\": { \"disc1\": [\"Celerity\", 1], \"disc2\": [\"Presence\", 3], \"disc3\": [\"Potence\", 2] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"-LNQFw2N0ga48U9Topv6\": { \"base\": {\"clan\": \"Malkavian\", \"faction\": \"Anarch\", \"generation\": 9, \"blood_potency\": 5, \"humanity\": 8, \"stains\": 0 }, \"attributes\": { \"strength\": 2, \"dexterity\": 4, \"stamina\": 2, \"charisma\": 1, \"manipulation\": 2, \"composure\": 2, \"intelligence\": 5, \"wits\": 4, \"resolve\": 2 }, \"skills\": { \"6\": \"\", \"5\": \"\", \"4\": \"OCC INS\", \"3\": \"STL ACA POL STR\", \"2\": \"ATH SUB FIN MED SCI\", \"1\": \"BRA LAR MEL INT LED PER SUR DRV TEC ETI\" }, \"clandiscs\": { \"disc1\": [\"Auspex\", 4], \"disc2\": [\"Dominate\", 1], \"disc3\": [\"Obfuscate\", 3] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"FOR\" } },\"-LNQHYdq6TiLMFGVmmW6\": { \"base\": {\"clan\": \"Nosferatu\", \"faction\": \"Camarilla\", \"generation\": 10, \"blood_potency\": 3, \"humanity\": 8, \"stains\": 0 }, \"attributes\": { \"strength\": 2, \"dexterity\": 2, \"stamina\": 4, \"charisma\": 1, \"manipulation\": 1, \"composure\": 3, \"intelligence\": 3, \"wits\": 3, \"resolve\": 5 }, \"skills\": { \"6\": \"\", \"5\": \"INV\", \"4\": \"AWA BRA INS\", \"3\": \"MEL STR LED\", \"2\": \"STE TEC ANK INT POL\", \"1\": \"ATH FIR SUR SUB\" }, \"clandiscs\": { \"disc1\": [\"Animalism\", 2], \"disc2\": [\"Obfuscate\", 4], \"disc3\": [\"Potence\", 3] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"-LNQG0wxWA3u5Ec_eYzq\": { \"base\": {\"clan\": \"Nosferatu\", \"faction\": \"Anarch\", \"generation\": 9, \"blood_potency\": 4, \"humanity\": 6, \"stains\": 0 }, \"attributes\": { \"strength\": 2, \"dexterity\": 1, \"stamina\": 2, \"charisma\": 3, \"manipulation\": 4, \"composure\": 5, \"intelligence\": 2, \"wits\": 4, \"resolve\": 2 }, \"skills\": { \"6\": \"\", \"5\": \"INS PER POL\", \"4\": \"ANK SUB\", \"3\": \"LED ACA\", \"2\": \"STL MEL\", \"1\": \"ATH INV\" }, \"clandiscs\": { \"disc1\": [\"Animalism\", 4], \"disc2\": [\"Obfuscate\", 3], \"disc3\": [\"Potence\", 2] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"PRE\", \"2\": \"\", \"1\": \"\" } },\"-LWe9buk5mborjCgeb95\": { \"base\": {\"clan\": \"Thin-Blooded\", \"faction\": \"Anarch\", \"generation\": 14, \"blood_potency\": 0, \"humanity\": 9, \"stains\": 0 }, \"attributes\": { \"strength\": 2, \"dexterity\": 2, \"stamina\": 3, \"charisma\": 2, \"manipulation\": 1, \"composure\": 2, \"intelligence\": 4, \"wits\": 3, \"resolve\": 3 }, \"skills\": { \"6\": \"\", \"5\": \"\", \"4\": \"SCI\", \"3\": \"OCC ACA TEC\", \"2\": \"INV AWA MED\", \"1\": \"PER SUB STR\" }, \"clandiscs\": { \"disc1\": [\"Alchemy\", 3], \"disc2\": [], \"disc3\": [] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"-LNQG0fyUU5WgN2IYaLo\": { \"base\": {\"clan\": \"Brujah\", \"faction\": \"Anarch\", \"generation\": 12, \"blood_potency\": 1, \"humanity\": 7, \"stains\": 0 }, \"attributes\": { \"strength\": 2, \"dexterity\": 2, \"stamina\": 3, \"charisma\": 4, \"manipulation\": 3, \"composure\": 3, \"intelligence\": 2, \"wits\": 1, \"resolve\": 2 }, \"skills\": { \"6\": \"\", \"5\": \"\", \"4\": \"\", \"3\": \"PRF PER LED\", \"2\": \"INT AWA MEL POL SUB\", \"1\": \"ACA ETI INS STR BRA FIR INV\" }, \"clandiscs\": { \"disc1\": [\"Celerity\", 1], \"disc2\": [\"Presence\", 2], \"disc3\": [\"Potence\", 1] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"-LNQG0N7ZGUK1zMpm6Zx\": { \"base\": {\"clan\": \"Malkavian\", \"faction\": \"Anarch\", \"generation\": 13, \"blood_potency\": 1, \"humanity\": 7, \"stains\": 0 }, \"attributes\": { \"strength\": 2, \"dexterity\": 2, \"stamina\": 1, \"charisma\": 1, \"manipulation\": 4, \"composure\": 2, \"intelligence\": 4, \"wits\": 2, \"resolve\": 4 }, \"skills\": { \"6\": \"\", \"5\": \"\", \"4\": \"INS\", \"3\": \"ACA OCC POL\", \"2\": \"FIN MED INV\", \"1\": \"STR SUB PER\" }, \"clandiscs\": { \"disc1\": [\"Auspex\", 1], \"disc2\": [\"Dominate\", 1], \"disc3\": [\"Obfuscate\", 0] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"SOR PTN\" } },\"-LNQG04sy2d4LNugi8xE\": { \"base\": {\"clan\": \"Toreador\", \"faction\": \"Anarch\", \"generation\": 11, \"blood_potency\": 1, \"humanity\": 6, \"stains\": 0 }, \"attributes\": { \"strength\": 2, \"dexterity\": 3, \"stamina\": 2, \"charisma\": 4, \"manipulation\": 4, \"composure\": 2, \"intelligence\": 2, \"wits\": 2, \"resolve\": 1 }, \"skills\": { \"6\": \"\", \"5\": \"\", \"4\": \"ETI\", \"3\": \"PER SUB POL\", \"2\": \"INS LED INV FIN\", \"1\": \"ATH BRA MEL LAR INT AWA TEC\" }, \"clandiscs\": { \"disc1\": [\"Auspex\", 1], \"disc2\": [\"Celerity\", 2], \"disc3\": [\"Presence\", 3] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"-LNQFzHYmcnDqQSytLhP\": { \"base\": {\"clan\": \"Brujah\", \"faction\": \"Anarch\", \"generation\": 11, \"blood_potency\": 2, \"humanity\": 6, \"stains\": 0 }, \"attributes\": { \"strength\": 4, \"dexterity\": 3, \"stamina\": 3, \"charisma\": 2, \"manipulation\": 1, \"composure\": 2, \"intelligence\": 3, \"wits\": 2, \"resolve\": 2 }, \"skills\": { \"6\": \"\", \"5\": \"\", \"4\": \"BRA\", \"3\": \"ATH STR LED\", \"2\": \"AWA INV MEL STL\", \"1\": \"DRV FIR LAR POL INS INT SUR\" }, \"clandiscs\": { \"disc1\": [\"Celerity\", 2], \"disc2\": [\"Presence\", 1], \"disc3\": [\"Potence\", 3] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"-LNQG-Q_Zvl0YZlCIzcQ\": { \"base\": {\"clan\": \"Gangrel\", \"faction\": \"Anarch\", \"generation\": 11, \"blood_potency\": 2, \"humanity\": 5, \"stains\": 0 }, \"attributes\": { \"strength\": 3, \"dexterity\": 3, \"stamina\": 4, \"charisma\": 1, \"manipulation\": 2, \"composure\": 2, \"intelligence\": 2, \"wits\": 2, \"resolve\": 3 }, \"skills\": { \"6\": \"\", \"5\": \"\", \"4\": \"ATH\", \"3\": \"BRA MEL STR\", \"2\": \"SUR STL ANI\", \"1\": \"AWA INV LAR\" }, \"clandiscs\": { \"disc1\": [\"Animalism\", 1], \"disc2\": [\"Fortitude\", 0], \"disc3\": [\"Protean\", 3] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"-LNQG-8UJao43g8Hd2Fl\": { \"base\": {\"clan\": \"Gangrel\", \"faction\": \"Anarch\", \"generation\": 11, \"blood_potency\": 3, \"humanity\": 5, \"stains\": 0 }, \"attributes\": { \"strength\": 3, \"dexterity\": 5, \"stamina\": 2, \"charisma\": 2, \"manipulation\": 1, \"composure\": 2, \"intelligence\": 2, \"wits\": 2, \"resolve\": 3 }, \"skills\": { \"6\": \"\", \"5\": \"MEL\", \"4\": \"ATH\", \"3\": \"STR LAR\", \"2\": \"INS INT BRA\", \"1\": \"INV MED SUR\" }, \"clandiscs\": { \"disc1\": [\"Animalism\", 2], \"disc2\": [\"Fortitude\", 0], \"disc3\": [\"Protean\", 4] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"-LNQFzrFI1aP3xdVYFVY\": { \"base\": {\"clan\": \"Gangrel\", \"faction\": \"Anarch\", \"generation\": 11, \"blood_potency\": 2, \"humanity\": 6, \"stains\": 0 }, \"attributes\": { \"strength\": 3, \"dexterity\": 2, \"stamina\": 2, \"charisma\": 3, \"manipulation\": 4, \"composure\": 3, \"intelligence\": 2, \"wits\": 1, \"resolve\": 2 }, \"skills\": { \"6\": \"\", \"5\": \"\", \"4\": \"\", \"3\": \"PRF SUB INS\", \"2\": \"ATH MEL ANI INT INV\", \"1\": \"AWA BRA LAR STL SUR ANK PER\" }, \"clandiscs\": { \"disc1\": [\"Animalism\", 2], \"disc2\": [\"Fortitude\", 1], \"disc3\": [\"Protean\", 1] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"-LNQFz_V0ms41yrxwJ1x\": { \"base\": {\"clan\": \"Malkavian\", \"faction\": \"Anarch\", \"generation\": 6, \"blood_potency\": 4, \"humanity\": 7, \"stains\": 0 }, \"attributes\": { \"strength\": 2, \"dexterity\": 3, \"stamina\": 3, \"charisma\": 4, \"manipulation\": 6, \"composure\": 5, \"intelligence\": 3, \"wits\": 3, \"resolve\": 5 }, \"skills\": { \"6\": \"SUB\", \"5\": \"INS STL\", \"4\": \"ETI STR ACA AWA OCC\", \"3\": \"BRA MEL ATH INV\", \"2\": \"FIN POL LAR SUR PER TEC\", \"1\": \"CRA MED LED SCI FIR DRV\" }, \"clandiscs\": { \"disc1\": [\"Auspex\", 4], \"disc2\": [\"Dominate\", 5], \"disc3\": [\"Obfuscate\", 5] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"PTN\", \"3\": \"FOR\", \"2\": \"CEL\", \"1\": \"ANI\" } },\"-LNQFtzeAa6FUgB4pO1R\": { \"base\": {\"clan\": \"Brujah\", \"faction\": \"Anarch\", \"generation\": 11, \"blood_potency\": 2, \"humanity\": 5, \"stains\": 0 }, \"attributes\": { \"strength\": 3, \"dexterity\": 2, \"stamina\": 2, \"charisma\": 4, \"manipulation\": 2, \"composure\": 4, \"intelligence\": 2, \"wits\": 1, \"resolve\": 2 }, \"clandiscs\": { \"disc1\": [\"Celerity\", 2], \"disc2\": [\"Presence\", 2], \"disc3\": [\"Potence\", 4] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"-LNQFtYW-m47AqMuMI4X\": { \"base\": {\"clan\": \"Malkavian\", \"faction\": \"Anarch\", \"generation\": 13, \"blood_potency\": 1, \"humanity\": 5, \"stains\": 0 }, \"attributes\": { \"strength\": 3, \"dexterity\": 3, \"stamina\": 2, \"charisma\": 1, \"manipulation\": 2, \"composure\": 2, \"intelligence\": 4, \"wits\": 3, \"resolve\": 2 }, \"clandiscs\": { \"disc1\": [\"Auspex\", 1], \"disc2\": [\"Dominate\", 0], \"disc3\": [\"Obfuscate\", 2] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"ANI\", \"1\": \"POT\" } },\"-LNQFt37ROBDaLQ3aZuT\": { \"base\": {\"clan\": \"Nosferatu\", \"faction\": \"Anarch\", \"generation\": 13, \"blood_potency\": 1, \"humanity\": 3, \"stains\": 0 }, \"attributes\": { \"strength\": 4, \"dexterity\": 3, \"stamina\": 3, \"charisma\": 1, \"manipulation\": 2, \"composure\": 2, \"intelligence\": 3, \"wits\": 2, \"resolve\": 2 }, \"clandiscs\": { \"disc1\": [\"Animalism\", 1], \"disc2\": [\"Obfuscate\", 1], \"disc3\": [\"Potence\", 1] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"PTN\" } },\"-LNQFxShAsElf1Qy5xv_\": { \"base\": {\"clan\": \"Gangrel\", \"faction\": \"Anarch\", \"generation\": 13, \"blood_potency\": 2, \"humanity\": 6, \"stains\": 0 }, \"attributes\": { \"strength\": 4, \"dexterity\": 3, \"stamina\": 3, \"charisma\": 2, \"manipulation\": 1, \"composure\": 2, \"intelligence\": 2, \"wits\": 2, \"resolve\": 3 }, \"clandiscs\": { \"disc1\": [\"Animalism\", 0], \"disc2\": [\"Fortitude\", 2], \"disc3\": [\"Protean\", 4] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"POT\", \"1\": \"\" } },\"-LNQFxo7w4eJYFQYNeZd\": { \"base\": {\"clan\": \"Gangrel\", \"faction\": \"Anarch\", \"generation\": 13, \"blood_potency\": 1, \"humanity\": 6, \"stains\": 0 }, \"attributes\": { \"strength\": 3, \"dexterity\": 4, \"stamina\": 3, \"charisma\": 2, \"manipulation\": 1, \"composure\": 2, \"intelligence\": 2, \"wits\": 2, \"resolve\": 3 }, \"clandiscs\": { \"disc1\": [\"Animalism\", 0], \"disc2\": [\"Fortitude\", 3], \"disc3\": [\"Protean\", 1] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"-LWeAmvEEK2_kLoCN2w_\": { \"base\": {\"clan\": \"Thin-Blooded\", \"faction\": \"Anarch\", \"generation\": 14, \"blood_potency\": 0, \"humanity\": 6, \"stains\": 0 }, \"attributes\": { \"strength\": 4, \"dexterity\": 3, \"stamina\": 3, \"charisma\": 2, \"manipulation\": 3, \"composure\": 2, \"intelligence\": 1, \"wits\": 2, \"resolve\": 2 }, \"clandiscs\": { \"disc1\": [\"Alchemy\", 1], \"disc2\": [], \"disc3\": [] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"-LWeAY-ePMjLtV6xSs6h\": { \"base\": {\"clan\": \"Thin-Blooded\", \"faction\": \"Anarch\", \"generation\": 14, \"blood_potency\": 0, \"humanity\": 7, \"stains\": 0 }, \"attributes\": { \"strength\": 2, \"dexterity\": 2, \"stamina\": 3, \"charisma\": 3, \"manipulation\": 3, \"composure\": 2, \"intelligence\": 2, \"wits\": 4, \"resolve\": 1 }, \"clandiscs\": { \"disc1\": [\"Alchemy\", 1], \"disc2\": [], \"disc3\": [] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"-LTJM_n4VcZzmFKjWG74\": { \"base\": {\"clan\": \"Ministry\", \"faction\": \"Anarch\", \"generation\": 9, \"blood_potency\": 5, \"humanity\": 6, \"stains\": 0 }, \"attributes\": { \"strength\": 1, \"dexterity\": 3, \"stamina\": 2, \"charisma\": 5, \"manipulation\": 3, \"composure\": 4, \"intelligence\": 2, \"wits\": 4, \"resolve\": 2 }, \"skills\": { \"6\": \"\", \"5\": \"INS PER SUB STR\", \"4\": \"STL ETI LED\", \"3\": \"OCC\", \"2\": \"MEL\", \"1\": \"POL MED\" }, \"clandiscs\": { \"disc1\": [\"Obfuscate\", 2], \"disc2\": [\"Presence\", 4], \"disc3\": [\"Protean\", 3] }, \"otherdiscs\": { \"5\": \"AUS\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"CEL\" } },\"-LTJMSdW7fIoXAFfKcET\": { \"base\": {\"clan\": \"Ministry\", \"faction\": \"Anarch\", \"generation\": 10, \"blood_potency\": 3, \"humanity\": 6, \"stains\": 0 }, \"attributes\": { \"strength\": 2, \"dexterity\": 2, \"stamina\": 1, \"charisma\": 4, \"manipulation\": 3, \"composure\": 3, \"intelligence\": 3, \"wits\": 2, \"resolve\": 2 }, \"skills\": { \"6\": \"\", \"5\": \"INS\", \"4\": \"PER SUB\", \"3\": \"STL MEL\", \"2\": \"STR OCC\", \"1\": \"ATH BRA DRV\" }, \"clandiscs\": { \"disc1\": [\"Obfuscate\", 1], \"disc2\": [\"Presence\", 3], \"disc3\": [\"Protean\", 4] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"-LTJMWxeANEe12WCfXtm\": { \"base\": {\"clan\": \"Ministry\", \"faction\": \"Anarch\", \"generation\": 10, \"blood_potency\": 3, \"humanity\": 4, \"stains\": 0 }, \"attributes\": { \"strength\": 2, \"dexterity\": 2, \"stamina\": 1, \"charisma\": 4, \"manipulation\": 5, \"composure\": 3, \"intelligence\": 4, \"wits\": 2, \"resolve\": 2 }, \"skills\": { \"6\": \"\", \"5\": \"SUB ETI PER\", \"4\": \"INS STL\", \"3\": \"INT LAR\", \"2\": \"ATH STR\", \"1\": \"POL\" }, \"clandiscs\": { \"disc1\": [\"Obfuscate\", 1], \"disc2\": [\"Presence\", 4], \"disc3\": [\"Protean\", 3] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"AUS\", \"2\": \"\", \"1\": \"\" } },\"-LTJMKmVLVu5OazFXbUo\": { \"base\": {\"clan\": \"Ministry\", \"faction\": \"Anarch\", \"generation\": 10, \"blood_potency\": 3, \"humanity\": 9, \"stains\": 0 }, \"attributes\": { \"strength\": 2, \"dexterity\": 3, \"stamina\": 2, \"charisma\": 4, \"manipulation\": 3, \"composure\": 3, \"intelligence\": 2, \"wits\": 2, \"resolve\": 1 }, \"skills\": { \"6\": \"\", \"5\": \"PER\", \"4\": \"PRF \", \"3\": \"ETI INS\", \"2\": \"AWA SUB STL\", \"1\": \"BRA FIR DRV\" }, \"clandiscs\": { \"disc1\": [\"Obfuscate\", 0], \"disc2\": [\"Presence\", 4], \"disc3\": [\"Protean\", 2] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"-LU7pcmKytkmcej5SH9c\": { \"base\": {\"clan\": \"Brujah\", \"faction\": \"Anarch\", \"generation\": 12, \"blood_potency\": 1, \"humanity\": 9, \"stains\": 0 }, \"attributes\": { \"strength\": 3, \"dexterity\": 3, \"stamina\": 3, \"charisma\": 2, \"manipulation\": 1, \"composure\": 2, \"intelligence\": 2, \"wits\": 2, \"resolve\": 4 }, \"skills\": { \"6\": \"\", \"5\": \"\", \"4\": \"MEL\", \"3\": \"INT ATH OCC\", \"2\": \"STR LED PER FIR\", \"1\": \"BRA ACA AWA ETI ANI TEC INV\" }, \"clandiscs\": { \"disc1\": [\"Celerity\", 2], \"disc2\": [\"Presence\", 1], \"disc3\": [\"Potence\", 3] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"-LNQFvl-ktzpXfhkW8ZQ\": { \"base\": {\"clan\": \"Brujah\", \"faction\": \"Anarch\", \"generation\": 12, \"blood_potency\": 2, \"humanity\": 7, \"stains\": 0 }, \"attributes\": { \"strength\": 3, \"dexterity\": 3, \"stamina\": 4, \"charisma\": 2, \"manipulation\": 1, \"composure\": 2, \"intelligence\": 2, \"wits\": 2, \"resolve\": 3 }, \"clandiscs\": { \"disc1\": [\"Celerity\", 2], \"disc2\": [\"Presence\", 1], \"disc3\": [\"Potence\", 1] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"-LNQFv8D4hqgpkRNVb8I\": { \"base\": {\"clan\": \"Nosferatu\", \"faction\": \"Anarch\", \"generation\": 12, \"blood_potency\": 2, \"humanity\": 7, \"stains\": 0 }, \"attributes\": { \"strength\": 3, \"dexterity\": 4, \"stamina\": 3, \"charisma\": 1, \"manipulation\": 2, \"composure\": 2, \"intelligence\": 2, \"wits\": 3, \"resolve\": 2 }, \"clandiscs\": { \"disc1\": [\"Animalism\", 0], \"disc2\": [\"Obfuscate\", 3], \"disc3\": [\"Potence\", 0] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"CEL\" } },\"-LNQFvRGMoiNF54OL3wL\": { \"base\": {\"clan\": \"Gangrel\", \"faction\": \"Anarch\", \"generation\": 12, \"blood_potency\": 2, \"humanity\": 6, \"stains\": 0 }, \"attributes\": { \"strength\": 3, \"dexterity\": 3, \"stamina\": 4, \"charisma\": 2, \"manipulation\": 2, \"composure\": 2, \"intelligence\": 3, \"wits\": 1, \"resolve\": 2 }, \"clandiscs\": { \"disc1\": [\"Animalism\", 1], \"disc2\": [\"Fortitude\", 1], \"disc3\": [\"Protean\", 2] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"-LWeQPMwOtwmjU_CY-uE\": { \"base\": {\"clan\": \"Nosferatu\", \"faction\": \"Camarilla\", \"generation\": 8, \"blood_potency\": 4, \"humanity\": 5, \"stains\": 0 }, \"attributes\": { \"strength\": 4, \"dexterity\": 3, \"stamina\": 4, \"charisma\": 3, \"manipulation\": 2, \"composure\": 3, \"intelligence\": 6, \"wits\": 3, \"resolve\": 4 }, \"clandiscs\": { \"disc1\": [\"Animalism\", 4], \"disc2\": [\"Obfuscate\", 5], \"disc3\": [\"Potence\", 4] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"CEL\", \"2\": \"DOM\", \"1\": \"FOR AUS\" } },\"-LYxow0RcEaAl2B-nZBK\": { \"base\": {\"clan\": \"Banu Haqim\", \"faction\": \"Camarilla\", \"generation\": 7, \"blood_potency\": 6, \"humanity\": 5, \"stains\": 0 }, \"attributes\": { \"strength\": 3, \"dexterity\": 4, \"stamina\": 3, \"charisma\": 3, \"manipulation\": 3, \"composure\": 4, \"intelligence\": 6, \"wits\": 2, \"resolve\": 4 }, \"clandiscs\": { \"disc1\": [\"Celerity\", 5], \"disc2\": [\"Obfuscate\", 5], \"disc3\": [\"Blood Sorcery\", 4] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"POT FOR\", \"2\": \"\", \"1\": \"\" } },\"-LYxov6gTCWlZO86Jlw2\": { \"base\": {\"clan\": \"Banu Haqim\", \"faction\": \"Camarilla\", \"generation\": 8, \"blood_potency\": 5, \"humanity\": 5, \"stains\": 0 }, \"attributes\": { \"strength\": 4, \"dexterity\": 5, \"stamina\": 2, \"charisma\": 3, \"manipulation\": 2, \"composure\": 2, \"intelligence\": 4, \"wits\": 2, \"resolve\": 1 }, \"skills\": { \"6\": \"\", \"5\": \"MEL\", \"4\": \"STL ACA OCC\", \"3\": \"ATH POL INV LAR\", \"2\": \"\", \"1\": \"\" }, \"clandiscs\": { \"disc1\": [\"Celerity\", 4], \"disc2\": [\"Obfuscate\", 3], \"disc3\": [\"Blood Sorcery\", 2] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"POT FOR\" } },\"-LNQHYKTacAmhlW7G87N\": { \"base\": {\"clan\": \"Ventrue\", \"faction\": \"Camarilla\", \"generation\": 9, \"blood_potency\": 4, \"humanity\": 6, \"stains\": 0 }, \"attributes\": { \"strength\": 2, \"dexterity\": 2, \"stamina\": 2, \"charisma\": 5, \"manipulation\": 3, \"composure\": 4, \"intelligence\": 3, \"wits\": 1, \"resolve\": 4 }, \"skills\": { \"6\": \"\", \"5\": \"LED POL SUB INS\", \"4\": \"PER ETI FIR\", \"3\": \"AWA\", \"2\": \"INT\", \"1\": \"MEL\" }, \"clandiscs\": { \"disc1\": [\"Dominate\", 4], \"disc2\": [\"Fortitude\", 3], \"disc3\": [\"Presence\", 5] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"AUS\", \"1\": \"CEL\" } },\"-LPNSsmxNeokaKtssoE1\": { \"base\": {\"clan\": \"Tremere\", \"faction\": \"Camarilla\", \"generation\": 9, \"blood_potency\": 4, \"humanity\": 6, \"stains\": 0 }, \"attributes\": { \"strength\": 5, \"dexterity\": 4, \"stamina\": 2, \"charisma\": 2, \"manipulation\": 2, \"composure\": 2, \"intelligence\": 3, \"wits\": 1, \"resolve\": 4 }, \"skills\": { \"6\": \"\", \"5\": \"MEL\", \"4\": \"OCC INT STL\", \"3\": \"INS STR SUB INV\", \"2\": \"SUR ETI POL\", \"1\": \"ATH BRA LAR AWA\" }, \"clandiscs\": { \"disc1\": [\"Auspex\", 1], \"disc2\": [\"Dominate\", 4], \"disc3\": [\"Blood Sorcery\", 2] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"CEL\", \"2\": \"\", \"1\": \"POT\" } },\"-LWeQO4py4GrquBo2Gck\": { \"base\": {\"clan\": \"Nosferatu\", \"faction\": \"Camarilla\", \"generation\": 10, \"blood_potency\": 3, \"humanity\": 5, \"stains\": 0 }, \"attributes\": { \"strength\": 2, \"dexterity\": 5, \"stamina\": 3, \"charisma\": 1, \"manipulation\": 2, \"composure\": 2, \"intelligence\": 4, \"wits\": 4, \"resolve\": 2 }, \"skills\": { \"6\": \"\", \"5\": \"MEL ATH STL\", \"4\": \"INS SUB AWA\", \"3\": \"INV STR\", \"2\": \"LAR\", \"1\": \"SUR BRA\" }, \"clandiscs\": { \"disc1\": [\"Animalism\", 3], \"disc2\": [\"Obfuscate\", 4], \"disc3\": [\"Potence\", 3] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"CEL FOR PTN\" } },\"-LWeQNOKb98WrdeMY_OZ\": { \"base\": {\"clan\": \"Nosferatu\", \"faction\": \"Camarilla\", \"generation\": 10, \"blood_potency\": 3, \"humanity\": 5, \"stains\": 0 }, \"attributes\": { \"strength\": 1, \"dexterity\": 3, \"stamina\": 2, \"charisma\": 5, \"manipulation\": 2, \"composure\": 3, \"intelligence\": 2, \"wits\": 4, \"resolve\": 2 }, \"clandiscs\": { \"disc1\": [\"Animalism\", 2], \"disc2\": [\"Obfuscate\", 3], \"disc3\": [\"Potence\", 1] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"PRE\", \"1\": \"DOM\" } },\"-LV_h7g8eC2VrHbM8iXi\": { \"base\": {\"clan\": \"Toreador\", \"faction\": \"Camarilla\", \"generation\": 12, \"blood_potency\": 1, \"humanity\": 6, \"stains\": 0 }, \"attributes\": { \"strength\": 2, \"dexterity\": 2, \"stamina\": 1, \"charisma\": 4, \"manipulation\": 3, \"composure\": 2, \"intelligence\": 3, \"wits\": 3, \"resolve\": 2 }, \"clandiscs\": { \"disc1\": [\"Auspex\", 2], \"disc2\": [\"Celerity\", 1], \"disc3\": [\"Presence\", 3] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"-LV_h7H_YjGXLpmW0aiR\": { \"base\": {\"clan\": \"Ventrue\", \"faction\": \"Camarilla\", \"generation\": 11, \"blood_potency\": 3, \"humanity\": 6, \"stains\": 0 }, \"attributes\": { \"strength\": 2, \"dexterity\": 2, \"stamina\": 2, \"charisma\": 3, \"manipulation\": 4, \"composure\": 3, \"intelligence\": 3, \"wits\": 2, \"resolve\": 1 }, \"clandiscs\": { \"disc1\": [\"Dominate\", 4], \"disc2\": [\"Fortitude\", 1], \"disc3\": [\"Presence\", 3] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"-LWeQOc-Gvu8OuQTIwqO\": { \"base\": {\"clan\": \"Nosferatu\", \"faction\": \"Camarilla\", \"generation\": 12, \"blood_potency\": 2 } },\"-LWeCAgTYMRyw0wkup2b\": { \"base\": {\"clan\": \"Nosferatu\", \"faction\": \"Camarilla\", \"generation\": 12, \"blood_potency\": 2 } },\"-LWeCA5hHOkeh4_2JwBa\": { \"base\": {\"clan\": \"Nosferatu\", \"faction\": \"Camarilla\", \"generation\": 13, \"blood_potency\": 1 } },\"-LWeC9aDbH63n7oD8e9z\": { \"base\": {\"clan\": \"Nosferatu\", \"faction\": \"Camarilla\", \"generation\": 13, \"blood_potency\": 1 } },\"-LWeRWzQ91Fp8DxQHuxU\": { \"base\": {\"clan\": \"Lasombra\", \"faction\": \"Sabbat\", \"generation\": 10, \"blood_potency\": 4, \"humanity\": 5, \"stains\": 0 }, \"attributes\": { \"strength\": 2, \"dexterity\": 3, \"stamina\": 2, \"charisma\": 2, \"manipulation\": 3, \"composure\": 1, \"intelligence\": 4, \"wits\": 3, \"resolve\": 2 }, \"clandiscs\": { \"disc1\": [\"Dominate\", 0], \"disc2\": [\"Oblivion\", 4], \"disc3\": [\"Potence\", 0] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"OBF\", \"1\": \"\" } },\"-LWeRVv36yuBjWcAJ8Mh\": { \"base\": {\"clan\": \"Nosferatu\", \"faction\": \"Sabbat\", \"generation\": 10, \"blood_potency\": 4, \"humanity\": 3, \"stains\": 0 }, \"attributes\": { \"strength\": 3, \"dexterity\": 3, \"stamina\": 4, \"charisma\": 1, \"manipulation\": 2, \"composure\": 2, \"intelligence\": 2, \"wits\": 2, \"resolve\": 3 }, \"clandiscs\": { \"disc1\": [\"Animalism\", 0], \"disc2\": [\"Obfuscate\", 4], \"disc3\": [\"Potence\", 2] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"-LWeRLFK7B44jj-N079k\": { \"base\": {\"clan\": \"Banu Haqim\", \"faction\": \"Autarkis\", \"generation\": 7, \"blood_potency\": 6, \"humanity\": 4, \"stains\": 0 }, \"attributes\": { \"strength\": 4, \"dexterity\": 6, \"stamina\": 5, \"charisma\": 2, \"manipulation\": 3, \"composure\": 3, \"intelligence\": 5, \"wits\": 3, \"resolve\": 3 }, \"clandiscs\": { \"disc1\": [\"Celerity\", 4], \"disc2\": [\"Obfuscate\", 5], \"disc3\": [\"Blood Sorcery\", 5] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"POT\", \"3\": \"FOR\", \"2\": \"AUS\", \"1\": \"PTN\" } },\"-LWeRKYQh6q3a09MGYug\": { \"base\": {\"clan\": \"Nosferatu\", \"faction\": \"Autarkis\", \"generation\": 7, \"blood_potency\": 7, \"humanity\": 1, \"stains\": 0 }, \"attributes\": { \"strength\": 6, \"dexterity\": 5, \"stamina\": 5, \"charisma\": 3, \"manipulation\": 3, \"composure\": 3, \"intelligence\": 2, \"wits\": 3, \"resolve\": 4 }, \"clandiscs\": { \"disc1\": [\"Animalism\", 5], \"disc2\": [\"Obfuscate\", 5], \"disc3\": [\"Potence\", 5] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"PTN\", \"3\": \"FOR\", \"2\": \"CEL\", \"1\": \"\" } },\"-LW8juZsciktrgdbmAl1\": { \"base\": {\"clan\": \"Tremere\", \"faction\": \"Camarilla\", \"generation\": 13, \"blood_potency\": 2, \"humanity\": 7, \"stains\": 0 }, \"attributes\": { \"strength\": 2, \"dexterity\": 1, \"stamina\": 2, \"charisma\": 2, \"manipulation\": 3, \"composure\": 2, \"intelligence\": 4, \"wits\": 3, \"resolve\": 3 }, \"skills\": { \"6\": \"\", \"5\": \"OCC\", \"4\": \"SUB\", \"3\": \"POL ETI\", \"2\": \"ATH INV PER\", \"1\": \"INS FIR STL\" }, \"clandiscs\": { \"disc1\": [\"Auspex\", 2], \"disc2\": [\"Dominate\", 0], \"disc3\": [\"Blood Sorcery\", 4] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"-Lc5WJzKsCsYxGqv4vvV\": { \"base\": {\"clan\": \"Tzimisce\", \"faction\": \"Sabbat\", \"generation\": 6, \"blood_potency\": 8, \"humanity\": 3, \"stains\": 0 }, \"attributes\": { \"strength\": 4, \"dexterity\": 4, \"stamina\": 3, \"charisma\": 6, \"manipulation\": 5, \"composure\": 5, \"intelligence\": 5, \"wits\": 4, \"resolve\": 3 }, \"skills\": { \"6\": \"MED ACA\", \"5\": \"MEL OCC POL AWA INT SUB\", \"4\": \"ETI INV\", \"3\": \"LED PER\", \"2\": \"STL ATH\", \"1\": \"ANI\" }, \"clandiscs\": { \"disc1\": [\"Animalism\", 3], \"disc2\": [\"Auspex\", 5], \"disc3\": [\"Vicissitude\", 5] }, \"otherdiscs\": { \"5\": \"DOM\", \"4\": \"PRE SOR\", \"3\": \"CEL\", \"2\": \"FOR\", \"1\": \"\" } },\"-Lbu3wurxt5lHXWMIC73\": { \"base\": {\"clan\": \"Lasombra\", \"faction\": \"Sabbat\", \"generation\": 7, \"blood_potency\": 7, \"humanity\": 3, \"stains\": 0 }, \"attributes\": { \"strength\": 5, \"dexterity\": 4, \"stamina\": 5, \"charisma\": 4, \"manipulation\": 3, \"composure\": 4, \"intelligence\": 3, \"wits\": 5, \"resolve\": 4 }, \"skills\": { \"6\": \"BRA STL\", \"5\": \"SUB OCC MEL LED POL ETI\", \"4\": \"ATH PER\", \"3\": \"SEC ACA\", \"2\": \"DRV LAR\", \"1\": \"INV\" }, \"clandiscs\": { \"disc1\": [\"Dominate\", 5], \"disc2\": [\"Oblivion\", 5], \"disc3\": [\"Potence\", 5] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"FOR\", \"3\": \"CEL\", \"2\": \"PTN\", \"1\": \"\" } }}",
        /* eslint-disable-next-line quotes */
        NPCDEFAULTS = "{\"tab_core\": 1, \"tab_type\": 1, \"bonus_health\": 0, \"bonus_willpower\": 0, \"bonus_bp\": 0, \"marquee_title\": \"\", \"marquee_lines_toggle\": 0, \"marquee\": \"\", \"marquee_tracker\": \"\", \"character_name\": \"\", \"char_dobdoe\": \"\", \"bane_title\": \"\", \"bane_text\": \"\", \"clan\": 0, \"faction\": 0, \"generation\": 0, \"predator\": 0, \"hunger\": 1, \"resonance\": 0, \"res_discs\": \" \", \"rollflagdisplay\": \"\", \"rollparams\": \"\", \"rollpooldisplay\": \"\", \"rollmod\": 0, \"rolldiff\": 0, \"applydisc\": 0, \"applybloodsurge\": 0, \"applyspecialty\": 0, \"applyresonance\": 0, \"incap\": \"\", \"rollarray\": \"\", \"dyscrasias_toggle\": 0, \"dyscrasias\": \"\", \"compulsion_toggle\": 0, \"compulsion\": \"\", \"groupdetails\": \"\", \"health\": 0, \"health_max\": 10, \"health_sdmg\": 0, \"health_admg\": 0, \"health_impair_toggle\": 0, \"health_1\": 0, \"health_2\": 0, \"health_3\": 0, \"health_4\": 0, \"health_5\": 0, \"health_6\": 0, \"health_7\": 0, \"health_8\": 0, \"health_9\": 0, \"health_10\": 0, \"health_11\": 0, \"health_12\": 0, \"health_13\": 0, \"health_14\": 0, \"health_15\": 0, \"willpower\": 0, \"willpower_max\": 10, \"willpower_sdmg\": 0, \"willpower_admg\": 0, \"willpower_impair_toggle\": 0, \"willpower_1\": 0, \"willpower_2\": 0, \"willpower_3\": 0, \"willpower_4\": 0, \"willpower_5\": 0, \"willpower_6\": 0, \"willpower_7\": 0, \"willpower_8\": 0, \"willpower_9\": 0, \"willpower_10\": 0, \"bp_surgetext\": \"\", \"bp_mendtext\": \"\", \"bp_discbonustext\": \"\", \"bp_baneseverity\": 0, \"bp_slaketext\": \"\", \"bp_mend\": \"\", \"bp_discbonus\": 0, \"bp_rousereroll\": \"\", \"bp_slakeanimal\": \"\", \"bp_slakebag\": \"\", \"bp_slakehuman\": \"\", \"bp_slakekill\": \"\", \"blood_potency\": 1, \"blood_potency_max\": 1, \"stains\": 0, \"humanity\": 7, \"humanity_max\": 10, \"humanity_impair_toggle\": 0, \"humanity_1\": 2, \"humanity_2\": 2, \"humanity_3\": 2, \"humanity_4\": 2, \"humanity_5\": 2, \"humanity_6\": 2, \"humanity_7\": 2, \"humanity_8\": 1, \"humanity_9\": 1, \"humanity_10\": 1, \"strength_flag\": 0, \"strength\": 1, \"dexterity_flag\": 0, \"dexterity\": 1, \"stamina_flag\": 0, \"stamina\": 1, \"charisma_flag\": 0, \"charisma\": 1, \"manipulation_flag\": 0, \"manipulation\": 1, \"composure_flag\": 0, \"composure\": 1, \"intelligence_flag\": 0, \"intelligence\": 1, \"wits_flag\": 0, \"wits\": 1, \"resolve_flag\": 0, \"resolve\": 1, \"athletics_flag\": 0, \"athletics_spec\": \"\", \"athletics\": 0, \"brawl_flag\": 0, \"brawl_spec\": \"\", \"brawl\": 0, \"craft_flag\": 0, \"craft_spec\": \"\", \"craft\": 0, \"drive_flag\": 0, \"drive_spec\": \"\", \"drive\": 0, \"firearms_flag\": 0, \"firearms_spec\": \"\", \"firearms\": 0, \"melee_flag\": 0, \"melee_spec\": \"\", \"melee\": 0, \"larceny_flag\": 0, \"larceny_spec\": \"\", \"larceny\": 0, \"stealth_flag\": 0, \"stealth_spec\": \"\", \"stealth\": 0, \"survival_flag\": 0, \"survival_spec\": \"\", \"survival\": 0, \"animal_ken_flag\": 0, \"animal_ken_spec\": \"\", \"animal_ken\": 0, \"etiquette_flag\": 0, \"etiquette_spec\": \"\", \"etiquette\": 0, \"insight_flag\": 0, \"insight_spec\": \"\", \"insight\": 0, \"intimidation_flag\": 0, \"intimidation_spec\": \"\", \"intimidation\": 0, \"leadership_flag\": 0, \"leadership_spec\": \"\", \"leadership\": 0, \"performance_flag\": 0, \"performance_spec\": \"\", \"performance\": 0, \"persuasion_flag\": 0, \"persuasion_spec\": \"\", \"persuasion\": 0, \"streetwise_flag\": 0, \"streetwise_spec\": \"\", \"streetwise\": 0, \"subterfuge_flag\": 0, \"subterfuge_spec\": \"\", \"subterfuge\": 0, \"academics_flag\": 0, \"academics_spec\": \"\", \"academics\": 0, \"awareness_flag\": 0, \"awareness_spec\": \"\", \"awareness\": 0, \"finance_flag\": 0, \"finance_spec\": \"\", \"finance\": 0, \"investigation_flag\": 0, \"investigation_spec\": \"\", \"investigation\": 0, \"medicine_flag\": 0, \"medicine_spec\": \"\", \"medicine\": 0, \"occult_flag\": 0, \"occult_spec\": \"\", \"occult\": 0, \"politics_flag\": 0, \"politics_spec\": \"\", \"politics\": 0, \"science_flag\": 0, \"science_spec\": \"\", \"science\": 0, \"technology_flag\": 0, \"technology_spec\": \"\", \"technology\": 0, \"disc1_toggle\": 0, \"disc1_flag\": 0, \"disc1_name\": \"\", \"disc1\": 0, \"disc1power_toggle\": 0, \"disc1_1\": \"\", \"disc1_2\": \"\", \"disc1_3\": \"\", \"disc1_4\": \"\", \"disc1_5\": \"\", \"repstats\": \"\", \"disc2_toggle\": 0, \"disc2_flag\": 0, \"disc2_name\": \"\", \"disc2\": 0, \"disc2power_toggle\": 0, \"disc2_1\": \"\", \"disc2_2\": \"\", \"disc2_3\": \"\", \"disc2_4\": \"\", \"disc2_5\": \"\", \"disc3_toggle\": 0, \"disc3_flag\": 0, \"disc3_name\": \"\", \"disc3\": 0, \"disc3power_toggle\": 0, \"disc3_1\": \"\", \"disc3_2\": \"\", \"disc3_3\": \"\", \"disc3_4\": \"\", \"disc3_5\": \"\", \"rituals_toggle\": 0, \"formulae_toggle\": 0, \"distillation\": 0, \"domain_personal\": \"\", \"domain_haven\": \"\", \"domain_coterie\": \"\", \"domain_hunt\": \"\", \"assets_carried\": \"\", \"assets_stashed\": \"\", \"assets_vehicles\": \"\", \"assets_other\": \"\", \"mask_name\": \"\", \"mask\": \"\", \"char_dob\": \"\", \"char_doe\": \"\", \"mortal_ambition\": \"\", \"mortal_history\": \"\", \"date_today\": 0, \"repeatingprojectslist\": \"\", \"ambition\": \"\", \"xp_summary\": \"\", \"xp_earnedtotal\": 0}",
    // #endregion

    // #region Register Characters & Token Image Alternates,
        registerChar = (msg, shortName, initial, quadrant) => {
            if (D.GetSelected(msg).length > 1) {
                THROW("Please select only one token.", "registerChar")
            } else {
                const charObj = D.GetChar(msg),
                    tokenObj = D.GetSelected(msg)[0],
                    charID = charObj.id,
                    charName = D.GetName(charObj),
                    playerID = D.GetPlayerID(charObj),
                    playerName = D.GetName(D.GetPlayer(playerID))
                if (!charObj) {
                    THROW("No character found!", "registerChar")
                } else if (!tokenObj) {
                    THROW("Please select a character token.", "registerChar")
                } else if (!D.IsIn(quadrant, _.keys(C.QUADRANTS), true)) {
                    THROW("Quadrant must be one of: TopLeft, BotLeft, TopRight, BotRight.", "registerChar")
                    REGISTRY[quadrant] = {
                        id: charID,
                        name: charName,
                        playerID,
                        playerName,
                        tokenName: `${charName.replace(/["'\s]*/gu, "") }Token`,
                        shortName,
                        initial,
                        quadrant
                    }
                    D.Alert(`${D.JSL(charName)} Registered to ${quadrant} quadrant:<br><br>${D.JS(REGISTRY[quadrant])}`, "registerChar")
                }
            }
        },
        unregisterChar = (nameRef) => {
            if (VAL({string: nameRef}, "unregisterChar")) {
                const regKey = _.findKey(REGISTRY, v => D.FuzzyMatch(v.name, nameRef))
                // D.Alert(`nameRef: ${nameRef}<br>regKey: ${D.JS(regKey)}`, "unregisterChar")
                if (REGISTRY[regKey])
                    delete REGISTRY[regKey]
            }
        },
    // #endregion

    // #region SETTERS: Moving Tokens, Toggling Characters
        sendCharsHome = () => {
            const charObjs = D.GetChars("sandbox"),
                charTokens = findObjs({_pageid: D.PAGEID, _type: "graphic", _subtype: "token"}).filter(x => x.get("layer") !== "walls" && _.any(charObjs, xx => xx.id === x.get("represents"))),
                pcTokens = charTokens.filter(x => VAL({pc: x.get("represents")})),
                npcTokens = charTokens.filter(x => VAL({npc: x.get("represents")}))
            // D.Alert(`PCs: ${D.JS(pcTokens.map(x => getObj("character", x.get("represents")).get("name")))}<br><br>NPCs: ${D.JS(npcTokens.map(x => getObj("character", x.get("represents")).get("name")))}`)
            
            STATEREF.tokenRecord = charTokens && charTokens.map(x => ({id: x.id, left: x.get("left"), top: x.get("top")}))
            for (const token of pcTokens) {
                const quad = D.GetCharData(token).quadrant
                Media.SetArea(token, `${quad}Token`)
            }
            for (const token of npcTokens)
                token.set("layer", "walls")
        },
        restoreCharsPos = () => {
            for (const tokenData of STATEREF.tokenRecord)
                (getObj("graphic", tokenData.id) || {set: () => false}).set({left: tokenData.left, top: tokenData.top, layer: "objects"})
            STATEREF.tokenRecord = []            
        },
        togglePlayerChar = (charRef, isActive) => {
            if (isActive === true || isActive === false) {
                const charData = D.GetCharData(charRef),
                    [tokenObj] = findObjs({_type: "graphic", _subtype: "token", name: `${charData.tokenName}_1`})
                DB(`Ref: ${D.JS(charRef)}, Data: ${D.JS(charData)}, Token: ${D.JS(tokenObj)}`, "togglePlayerChar")
                REGISTRY[charData.quadrant].isActive = isActive
                Media.ToggleImg(tokenObj, isActive, true)
                Media.SetImg(tokenObj, "base")
                Media.ToggleImg(`SignalLight${charData.quadrant}`, isActive)
                Media.ToggleImg(`Hunger${charData.quadrant}`, isActive)
                // Media.ToggleImg(`TombstoneShroud${charData.quad}`, !isActive)
            }
        },
    // #endregion

    // #region GETTERS: Checking Character Status, Character Chat Prompt
        isCharActive = (charRef) => (D.GetCharData(charRef) || {isActive: null}).isActive,    
        getCharIDString = (charsRef) => {
            const charIDs = []
            // D.Alert(`CharsRef: ${D.JS(charsRef)}<br><br>CharIDs: ${D.JS(charsRef.map(x => x.id || "Huh?"))}<br><br>CharID Final: ${D.JS(charIDs)}`)
            if (!charsRef || !charsRef.length)
                return ""
            if (VAL({charObj: charsRef}, "getCharIDString", true))
                charIDs.push(...charsRef.map(x => x.id))
            else
                switch(charsRef.toLowerCase()) {
                    case "registered": {
                        charIDs.push(...D.GetChars("registered").map(x => x.id))
                        break
                    }
                    case "npcs": {
                        charIDs.push(...D.GetChars("sandbox").filter(x => VAL({npc: x})).map(x => x.id))
                        break
                    }
                    case "pcs": {
                        charIDs.push(...D.GetChars("sandbox").filter(x => VAL({pc: x})).map(x => x.id))
                        break
                    }
                    case "sandbox": {
                        charIDs.push(...D.GetChars("sandbox").map(x => x.id))
                        break
                    }
                    default: {
                        for (const id of charsRef.split(",").map(x => x.trim()))
                            if (getObj("character", id))
                                charIDs.push(id)
                        break
                    }
                }
            return charIDs.join(",")
        },
        promptCharSelect = () => {
            const charObjs = Session.SceneChars,
                pcCharObjs = D.GetChars("registered"),
                npcCharObjs = charObjs.filter(x => VAL({npc: x})),
                chatLines = [
                    C.MENUHTML.Header("Character Selection", {margin: "0px 0px 5px 0px"}),
                    C.MENUHTML.ButtonLine([
                        ["All PCs", "!char select registered", {width: "24%", height: "16px", buttonHeight: "6px", lineHeight: "8px", fontSize: "12px", margin: "0px 0.5% 0px 0px", bgColor: C.COLORS.blue, color: C.COLORS.black}],
                        ["Active PCs", "!char select pcs", {width: "24%", height: "16px", buttonHeight: "6px", lineHeight: "8px", fontSize: "12px", margin: "0px 0.5% 0px 0px", bgColor: C.COLORS.blue, color: C.COLORS.black}],
                        ["Active NPCs", "!char select npcs", {width: "24%", height: "16px", buttonHeight: "6px", lineHeight: "8px", fontSize: "10px", margin: "0px 0.5% 0px 0px", bgColor: C.COLORS.blue, color: C.COLORS.black}],
                        ["All Active", "!char select sandbox", {width: "24%", height: "16px", buttonHeight: "6px", lineHeight: "8px", fontSize: "12px", margin: "0px 0.5% 0px 0px", bgColor: C.COLORS.blue, color: C.COLORS.black}]
                    ].map(x => C.MENUHTML.Button(...x)), {margin: "0px 0px 5px 0px"})
                ]
            while (pcCharObjs.length)
                chatLines.push(C.MENUHTML.ButtonLine(
                    _.compact([pcCharObjs.shift(), pcCharObjs.shift(), pcCharObjs.shift(), pcCharObjs.shift()]).map(x => C.MENUHTML.Button(
                        D.GetName(x, true),
                        `!char select ${x.id}`,
                        {width: "24%", height: "16px", lineHeight: "10px", margin: "0px 0.5% 0px 0px", bgColor: charObjs.map(xx => xx.id).includes(x.id) ? C.COLORS.brightred : C.COLORS.black}
                    )).join(""),
                    {margin: "0px 0px 10px 0px"}
                ))        
            while (npcCharObjs.length)
                chatLines.push(C.MENUHTML.ButtonLine(
                    _.compact([npcCharObjs.shift(), npcCharObjs.shift(), npcCharObjs.shift(), npcCharObjs.shift()]).map(x => C.MENUHTML.Button(
                        D.GetName(x, true),
                        `!char select ${x.id}`,
                        {width: "24%", height: "16px", lineHeight: "10px", margin: "0px 0.5% 0px 0px", bgColor: C.COLORS.crimson}
                    )).join("")
                ))
            sendChat("Select a Character", D.JSH(`/w Storyteller ${C.MENUHTML.Block(chatLines.join(""))}`))
        },
        promptActionMenu = (charsRef) => {
            const chatLines = [],
                charIDString = getCharIDString(charsRef),
                charIDs = charIDString.split(",").map(x => x.trim())
            let title = ""             
            const CHARACTIONS = _.mapObject({
                "_TopButtons": [
                    ["Add to Scene", "!sess @@CHARIDS@@ add scene", {width: "24%", height: "16px", lineHeight: "10px", margin: "0px 0.5% 0px 0px", bgColor: C.COLORS.palegreen, color: C.COLORS.black}],
                    ["Pop Desire", "!char @@CHARIDS@@ set desire", {width: "24%", height: "16px", lineHeight: "10px", margin: "0px 0.5% 0px 0px", bgColor: C.COLORS.gold, color: C.COLORS.black}],
                    ["@@SINGLEONLY@@Resonance", "!roll @@CHARIDS@@ resonance", {width: "24%", height: "16px", lineHeight: "10px", margin: "0px 0.5% 0px 0px", bgColor: C.COLORS.black, color: C.COLORS.brightred, fontWeight: "bold", textShadow: "1px 0px red"}],
                    ["@@SINGLEONLY@@Roll As", "!roll @@CHARIDS@@ set pc", {width: "24%", height: "16px", lineHeight: "10px", margin: "0px 0.5% 0px 0px", bgColor: C.COLORS.purple, color: C.COLORS.white}]
                ],
                "_LastButtons": [
                    ["Secret Roll", "!roll @@CHARIDS@@ secret", {width: "24%", height: "16px", lineHeight: "10px", margin: "0px 0.5% 15px 0px", bgColor: C.COLORS.purple, color: C.COLORS.white}],
                    ["Get Trait", "!char @@CHARIDS@@ get stat", {width: "24%", height: "16px", lineHeight: "10px", margin: "0px 0.5% 15px 0px", bgColor: C.COLORS.grey, color: C.COLORS.black}],
                    ["@@SINGLEONLY@@Complic's", "!comp @@CHARIDS@@ start ?{Shortfall?}", {width: "24%", height: "16px", lineHeight: "10px", margin: "0px 0.5% 15px 0px", bgColor: C.COLORS.orange, color: C.COLORS.black, fontWeight: "bold", textShadow: "1px 0px red"}],
                    ["@@SINGLEONLY@@Spotlight", "!sess @@CHARIDS@@ spotlight", {width: "24%", height: "16px", lineHeight: "10px", margin: "0px 0.5% 15px 0px", bgColor: C.COLORS.brightred, color: C.COLORS.black}]
                ],
                "Health": [
                    [ "S", "!char @@CHARIDS@@ dmg health superficial", {width: "11%", fontFamily: "Verdana", margin: "0px 0.5% 0px 0px", bgColor: C.COLORS.brightred}],
                    [ "S+", "!char @@CHARIDS@@ dmg health superficial+", {width: "11%", fontFamily: "Verdana", margin: "0px 0.5% 0px 0px", bgColor: C.COLORS.brightredmid}],
                    [ "A", "!char @@CHARIDS@@ dmg health aggravated", {width: "11%", fontFamily: "Verdana", margin: "0px 0.5% 0px 0px", bgColor: C.COLORS.red}]
                ],
                "Willpower": [
                    [ "S", "!char @@CHARIDS@@ dmg willpower superficial", {width: "11%", fontFamily: "Verdana", margin: "0px 0.5% 0px 0px", bgColor: C.COLORS.brightblue}],
                    [ "S+", "!char @@CHARIDS@@ dmg willpower superficial+", {width: "11%", fontFamily: "Verdana", margin: "0px 0.5% 0px 0px", bgColor: C.COLORS.blue}],
                    [ "A", "!char @@CHARIDS@@ dmg willpower aggravated", {width: "11%", fontFamily: "Verdana", margin: "0px 0.5% 0px 0px", bgColor: C.COLORS.darkblue}],
                    ["3%"],
                    [ "S", "!char @@CHARIDS@@ dmg willpower social_superficial", {width: "11%", fontFamily: "Verdana", margin: "0px 0.5% 0px 0px", bgColor: C.COLORS.brightpurple}],
                    [ "S+", "!char @@CHARIDS@@ dmg willpower social_superficial+", {width: "11%", fontFamily: "Verdana", margin: "0px 0.5% 0px 0px", bgColor: C.COLORS.purple}],
                    [ "A", "!char @@CHARIDS@@ dmg willpower social_aggravated", {width: "11%", fontFamily: "Verdana", margin: "0px 0.5% 0px 0px", bgColor: C.COLORS.darkpurple}]
                ],
                "Hunger": [
                    [ "+1", "!char @@CHARIDS@@ change hunger 1", {width: "11%", fontFamily: "Verdana", margin: "0px 0.5% 0px 0px", bgColor: C.COLORS.darkredmid} ],
                    [ "-1", "!char @@CHARIDS@@ change hunger -1", {width: "11%", fontFamily: "Verdana", margin: "0px 0.5% 0px 0px", bgColor: C.COLORS.darkred} ],
                    [ "Δ", "!char @@CHARIDS@@ change hunger", {width: "11%", fontFamily: "Verdana", margin: "0px 0.5% 0px 0px", bgColor: C.COLORS.red} ],
                    ["Kill Slake", "17%"],
                    [ "-1", "!char @@CHARIDS@@ change hungerkill -1", {width: "11%", fontFamily: "Verdana", margin: "0px 0.5% 0px 0px", bgColor: C.COLORS.brightredmid} ],
                    [ "Δ", "!char @@CHARIDS@@ change hungerkill", {width: "11%", fontFamily: "Verdana", margin: "0px 0.5% 0px 0px", bgColor: C.COLORS.brightred} ]
                ],
                "XP": [
                    [ "1", "!char @@CHARIDS@@ set xp 1 ?{Reason for Award?}", {width: "11%", fontFamily: "Verdana", margin: "0px 0.5% 0px 0px", bgColor: C.COLORS.orange} ],
                    [ "2", "!char @@CHARIDS@@ set xp 2 ?{Reason for Award?}", {width: "11%", fontFamily: "Verdana", margin: "0px 0.5% 0px 0px", bgColor: C.COLORS.orange} ],
                    [ "Δ", "!char @@CHARIDS@@ set xp ?{How Much XP?|3|4|5|6|7|8|9|10} ?{Reason for Award?}", {width: "11%", fontFamily: "Verdana", margin: "0px 0.5% 0px 0px", bgColor: C.COLORS.orange} ],
                    ["Humanity", "17%"],
                    [ "Stn", "!char @@CHARIDS@@ dmg stains", {width: "11%", fontFamily: "Verdana", margin: "0px 0.5% 0px 0px", bgColor: C.COLORS.black, color: C.COLORS.white}],
                    [ "Hum", "!char @@CHARIDS@@ dmg humanity", {width: "11%", fontFamily: "Verdana", margin: "0px 0.5% 0px 0px", bgColor: C.COLORS.black, color: C.COLORS.white}]
                ]
            }, v => v.map(x => x.map(xx => VAL({string: xx}) && xx.replace(/@@CHARIDS@@/gu, charIDString).replace(/\(/gu, "&#40;").replace(/\)/gu, "&#41;") || xx)))                
            for (const subHeader of _.keys(CHARACTIONS)) {
                const theseCols = [C.MENUHTML.ButtonSubheader(
                    subHeader.startsWith("_") ? "" : subHeader,
                    subHeader.startsWith("_") ? {margin: "1px 0px 0px 3px", height: "18px", width: "0%"} : {margin: "1px 0.5px 0px 3px", height: "18px", width: "17%"}
                )]
                for(const button of CHARACTIONS[subHeader])
                    if (button.length === 1)
                        theseCols.push(C.MENUHTML.ButtonSpacer(button[0]))
                    else if (button.length === 2)
                        theseCols.push(C.MENUHTML.ButtonSubheader(button[0], {margin: "1px 0.5px 0px 0px", height: "18px", width: button[1], textAlign: "right", padding: "0px 3px 0px 0px"}))
                    else if (button[0].includes("@@SINGLEONLY@@") && charIDs.length !== 1)
                        continue
                    else
                        theseCols.push(C.MENUHTML.Button(...button.map(x => VAL({string: x}) && x.replace(/@@SINGLEONLY@@/gu, "") || x)))                
                chatLines.push(C.MENUHTML.ButtonLine(theseCols.join(""), {textAlign: "left"}))
            }
            switch (charsRef) {
                case "registered": {
                    title = "Actions: All PCs"
                    break
                }
                case "pcs": {
                    title = "Actions: Active PCs"
                    break
                }
                case "npcs": {
                    title = "Actions: Active NPCs"
                    break
                }
                case "sandbox": {
                    title = "Actions: ALL Active"
                    break
                }
                default: {
                    if (charIDs.length === 1)
                        title = `Actions: ${D.GetName(charIDs[0])}`
                    else
                        title = `Actions: ${charIDs.length} Characters`
                    break
                }
            }
            sendChat(title, D.JSH(`/w Storyteller ${
                C.MENUHTML.Block([
                    C.MENUHTML.Header(title),
                    ...chatLines
                ])}`))
        },
        promptNumber = (fullCommand) => {
            if (VAL({string: fullCommand}, "promptNumber") && fullCommand.includes("@@AMOUNT@@"))
                sendChat("Amount", D.JSH(`/w Storyteller <div style='
                    display: block;
                    background: url(https://i.imgur.com/kBl8aTO.jpg);
                    text-align: center;
                    border: 4px ${C.COLORS.crimson} outset;
                    box-sizing: border-box;
                    margin-left: -42px;
                    width: 275px;
                '><br/><span style='
                    display: block;
                    font-size: 16px;
                    text-align: center;
                    width: 100%;
                    font-family: Voltaire;
                    color: ${C.COLORS.brightred};
                    font-weight: bold;
                '>Choose Amount:</span><span style='                    
                    display: block;
                    font-size: 10px;
                    text-align: center;
                    width: 100%
                '>[1](${fullCommand.replace(/@@AMOUNT@@/gu, "1")}) [2](${fullCommand.replace(/@@AMOUNT@@/gu, "2")}) [3](${fullCommand.replace(/@@AMOUNT@@/gu, "3")}) [4](${fullCommand.replace(/@@AMOUNT@@/gu, "4")}) [5](${fullCommand.replace(/@@AMOUNT@@/gu, "5")})</span><span style='                    
                    display: block;
                    font-size: 10px;
                    text-align: center;
                    width: 100%
                '>[6](${fullCommand.replace(/@@AMOUNT@@/gu, "6")}) [7](${fullCommand.replace(/@@AMOUNT@@/gu, "7")}) [8](${fullCommand.replace(/@@AMOUNT@@/gu, "8")}) [9](${fullCommand.replace(/@@AMOUNT@@/gu, "9")}) [10](${fullCommand.replace(/@@AMOUNT@@/gu, "10")})</span><span style='                    
                    display: block;
                    font-size: 10px;
                    text-align: center;
                    width: 100%
                '>[0](${fullCommand.replace(/@@AMOUNT@@/gu, "0")})</span><span style='                    
                    display: block;
                    font-size: 10px;
                    text-align: center;
                    width: 100%
                '>[-1](${fullCommand.replace(/@@AMOUNT@@/gu, "-1")}) [-2](${fullCommand.replace(/@@AMOUNT@@/gu, "-2")}) [-3](${fullCommand.replace(/@@AMOUNT@@/gu, "-3")}) [-4](${fullCommand.replace(/@@AMOUNT@@/gu, "-4")}) [-5](${fullCommand.replace(/@@AMOUNT@@/gu, "-5")})</span><span style='                    
                    display: block;
                    font-size: 10px;
                    text-align: center;
                    width: 100%
                '>[-6](${fullCommand.replace(/@@AMOUNT@@/gu, "-6")}) [-7](${fullCommand.replace(/@@AMOUNT@@/gu, "-7")}) [-8](${fullCommand.replace(/@@AMOUNT@@/gu, "-8")}) [-9](${fullCommand.replace(/@@AMOUNT@@/gu, "-9")}) [-10](${fullCommand.replace(/@@AMOUNT@@/gu, "-10")})</span><span style='                    
                    display: block;
                    font-size: 10px;
                    text-align: center;
                    width: 100%
                '></span></div>`))
        },
        promptTraitSelect = (charIDString, fullCommand, buttonOverride) => {
            const TRAITLIST = {},
                chatLines = []
            let rowCount = 0
            for (let i = 0; i < ATTRNAMES[0].length; i++) {
                TRAITLIST[`_AttrNames${i}`] = []
                for (let j = 0; j < ATTRNAMES.length; j++)
                    TRAITLIST[`_AttrNames${i}`].push([
                        ATTRNAMES[j][i].replace(/_/gu, " "),
                        buttonOverride && buttonOverride.replace(/@@CHARIDS@@/gu, charIDString).replace(/@@TRAITNAME@@/gu, ATTRNAMES[j][i].toLowerCase()) || `!char select trait ${ATTRNAMES[j][i].toLowerCase()}`,
                        {width: "30%", height: "16px", lineHeight: "10px", margin: "0px 0.5% 0px 0px", bgColor: C.COLORS.yellow, color: C.COLORS.black}
                    ].map(x => VAL({string: x}) && x.replace(/\(/gu, "&#40;").replace(/\)/gu, "&#41;") || x))                
            }
            TRAITLIST._SpacerRow1 = [["80%"]]
            for (let i = 0; i < SKILLNAMES[0].length; i++) {
                TRAITLIST[`_SkillNames${i}`] = []
                for (let j = 0; j < SKILLNAMES.length; j++)
                    TRAITLIST[`_SkillNames${i}`].push([
                        SKILLNAMES[j][i].replace(/_/gu, " "),
                        buttonOverride && buttonOverride.replace(/@@CHARIDS@@/gu, charIDString).replace(/@@TRAITNAME@@/gu, SKILLNAMES[j][i].toLowerCase()) || `!char select trait ${SKILLNAMES[j][i].toLowerCase()}`,
                        {width: "30%", height: "16px", lineHeight: "10px", margin: "0px 0.5% 0px 0px", bgColor: C.COLORS.gold, color: C.COLORS.black}
                    ].map(x => VAL({string: x}) && x.replace(/\(/gu, "&#40;").replace(/\)/gu, "&#41;") || x))
            }
            TRAITLIST._SpacerRow2 = [["80%"]]
            const DISCS = [...DISCNAMES]
            while (DISCS.length) {
                rowCount++
                TRAITLIST[`_DiscRow${rowCount}`] = _.compact([DISCS.shift(), DISCS.shift(), DISCS.shift()]).map(
                    x => [
                        x.replace(/_/gu, " "),
                        buttonOverride && buttonOverride.replace(/@@CHARIDS@@/gu, charIDString).replace(/@@TRAITNAME@@/gu, x.toLowerCase()) || `!char select trait ${x.toLowerCase()}`,
                        {width: "30%", height: "16px", lineHeight: "10px", margin: "0px 0.5% 0px 0px", bgColor: C.COLORS.brightred, color: C.COLORS.black}
                    ]
                )
            }
            TRAITLIST._SpacerRow3 = [["80%"]]
            TRAITLIST._BottomButtons1 = [
                ["Disciplines", "!char select trait disciplines", {width: "24%", height: "16px", lineHeight: "10px", margin: "0px 0.5% 0px 0px", bgColor: C.COLORS.gold, color: C.COLORS.black}],
                ["Blood Pot.", buttonOverride && buttonOverride.replace(/@@CHARIDS@@/gu, charIDString).replace(/@@TRAITNAME@@/gu, "blood_potency") || "!char select trait blood_potency", {width: "24%", height: "16px", lineHeight: "10px", margin: "0px 0.5% 0px 0px", bgColor: C.COLORS.gold, color: C.COLORS.black}],
                ["Health", buttonOverride && buttonOverride.replace(/@@CHARIDS@@/gu, charIDString).replace(/@@TRAITNAME@@/gu, "health") || "!char select trait health", {width: "24%", height: "16px", lineHeight: "10px", margin: "0px 0.5% 0px 0px", bgColor: C.COLORS.gold, color: C.COLORS.black}],
                ["Willpower", buttonOverride && buttonOverride.replace(/@@CHARIDS@@/gu, charIDString).replace(/@@TRAITNAME@@/gu, "willpower") || "!char select trait willpower", {width: "24%", height: "16px", lineHeight: "10px", margin: "0px 0.5% 0px 0px", bgColor: C.COLORS.gold, color: C.COLORS.black}]
            ]  
            TRAITLIST._BottomButtons2 = [
                ["Humanity", buttonOverride && buttonOverride.replace(/@@CHARIDS@@/gu, charIDString).replace(/@@TRAITNAME@@/gu, "humanity") || "!char select trait humanity", {width: "24%", height: "16px", lineHeight: "10px", margin: "0px 0.5% 0px 0px", bgColor: C.COLORS.gold, color: C.COLORS.black}],
                ["Hunger", buttonOverride && buttonOverride.replace(/@@CHARIDS@@/gu, charIDString).replace(/@@TRAITNAME@@/gu, "hunger") || "!char select trait hunger", {width: "24%", height: "16px", lineHeight: "10px", margin: "0px 0.5% 0px 0px", bgColor: C.COLORS.gold, color: C.COLORS.black}],
                ["Blood", "!char select trait disciplines", {width: "24%", height: "16px", lineHeight: "10px", margin: "0px 0.5% 0px 0px", bgColor: C.COLORS.gold, color: C.COLORS.black}],
                ["Resonance", buttonOverride && buttonOverride.replace(/@@CHARIDS@@/gu, charIDString).replace(/@@TRAITNAME@@/gu, "resonance") || "!char select trait resonance", {width: "24%", height: "16px", lineHeight: "10px", margin: "0px 0.5% 0px 0px", bgColor: C.COLORS.gold, color: C.COLORS.black}]
            ]   
            TRAITLIST._SpacerRow4 = [["80%"]]     
            if (fullCommand)      
                TRAITLIST._BottomButtons3 = [
                    ["3%"],
                    ["Finished", fullCommand.replace(/@@CHARIDS@@/gu, charIDString), {width: "24%", height: "16px", lineHeight: "10px", margin: "0px 0.5% 0px 0px", bgColor: C.COLORS.gold, color: C.COLORS.black}],
                    ["3%"]
                ]  
            for (const subHeader of _.keys(TRAITLIST)) {
                const theseCols = [C.MENUHTML.ButtonSubheader(
                    subHeader.startsWith("_") ? "" : subHeader,
                    subHeader.startsWith("_") ? {margin: "1px 0px 0px 3px", height: "18px", width: "0%"} : {margin: "1px 0.5px 0px 3px", height: "18px", width: "17%"}
                )]
                for(const button of TRAITLIST[subHeader])
                    if (button.length === 1)
                        theseCols.push(C.MENUHTML.ButtonSpacer(button[0]))
                    else if (button.length === 2)
                        theseCols.push(C.MENUHTML.ButtonSubheader(button[0], {margin: "1px 0.5px 0px 0px", height: "18px", width: button[1], textAlign: "right", padding: "0px 3px 0px 0px"}))
                    else
                        theseCols.push(C.MENUHTML.Button(...button))                
                chatLines.push(C.MENUHTML.ButtonLine(theseCols.join("")))
            }
            sendChat("Trait Select", D.JSH(`/w Storyteller ${
                C.MENUHTML.Block([
                    C.MENUHTML.Header("Trait Select"),
                    ...chatLines
                ].join(""))}`))
        },
    // #endregion

    // #region Character-As-NPC Control
        setCharNPC = (charRef, npcRef) => {
            const charObj = D.GetChar(charRef),
                npcObj = npcRef === "base" && "base" || D.GetChar(npcRef),
                npcName = npcRef === "base" && "base" || D.GetName(npcObj, true)
            if (VAL({string: npcName, pc: charObj}, "setCharNPC")) {
                const [quad] = _.values(D.GetCharVals(charObj, "quadrant")),
                    closestQuad = _.find(["TopLeft", "TopRight", "BotLeft", "BotRight"], x => x !== quad && x.slice(-4) === quad.slice(-4)),
                    [tokenObj] = findObjs({_type: "graphic", _subtype: "token", name: `${_.values(D.GetCharVals(charObj, "tokenName"))[0]}_1`})                   
                if (npcName === "base") {
                    delete Char.REGISTRY[quad].isNPC
                    Media.ToggleImg(`TombstonePic${quad}`, false)
                    Media.ToggleText(`TombstoneName${quad}`, false)
                    Media.SetArea(tokenObj, `${quad}Token`)
                    if (Media.IsActive(`Tombstone${closestQuad}`))
                        if (["base", "blank"].includes(Media.GetImgSrc(`Tombstone${closestQuad}`))) {
                            Media.SetImg(`Tombstone${closestQuad}`, "blank")
                            Media.SetImg(`Tombstone${quad}`, "blank")
                        } else {
                            Media.SetImg(`Tombstone${quad}`, "base", true)
                        }
                    else
                        Media.SetImg(`Tombstone${quad}`, "blank")
                    if (!isCharActive(tokenObj))
                        Media.ToggleImg(tokenObj, false)
                    Media.SetImg(tokenObj, "base")
                } else if (VAL({npc: npcObj}, "!char set npc")) {
                    let nameString = D.GetName(npcObj)
                    Char.REGISTRY[quad].isNPC = npcObj.id
                    if (Media.GetTextWidth(`TombstoneName${quad}`, nameString) > 240)
                        nameString = npcName
                    Media.SetText(`TombstoneName${quad}`, nameString, true)
                    Media.SetImg(`Tombstone${quad}`, "npc", true)
                    Media.SetImg(`TombstonePic${quad}`, D.GetName(npcObj, true), true)
                    Media.ToggleImg(tokenObj, true)
                    Media.SetImg(tokenObj, npcName, true)
                    Media.SetArea(tokenObj, `npcToken${quad}`)
                    if (!Media.IsActive(`Tombstone${closestQuad}`) || Media.GetImgSrc(`Tombstone${closestQuad}`) === "blank")
                        Media.SetImg(`Tombstone${closestQuad}`, "base", true)
                }
            }
        },
    // #endregion
    
    // #region Awarding XP
        awardXP = (charRef, award, reason) => {
            DB(`Award XP Parameters: charRef: ${D.JS(charRef)}, Award: ${D.JS(award)}<br>Reason: ${D.JS(reason)}`, "awardXP")
            const charObj = D.GetChar(charRef)
            if (VAL({charObj}, "awardXP")) {
                DB(`Award XP Variable Declations: char: ${D.JS(charObj.get("name"))}, SessionNum: ${D.JS(Session.SessionNum)}`, "awardXP")
                DB(`Making Row with Parameters: ${D.JS(charObj.id)}, Award: ${D.JS(award)}, Session: ${D.NumToText(Session.SessionNum)}<br>Reason: ${D.JS(reason)}`, "awardXP")
                const rowID = D.MakeRow(charObj.id, "earnedxpright", {
                    xp_award: award,
                    xp_session: D.NumToText(Session.SessionNum, true),
                    xp_reason: reason
                })
                DB(`Award XP Variable Declations: char: ${D.JS(charObj.get("name"))}, rowID: ${D.JS(rowID)}`, "awardXP")
                if (rowID) {
                    const [leftRowIDs, rightRowIDs] = [D.GetRepIDs(charObj.id, "earnedxp"), D.GetRepIDs(charObj.id, "earnedxpright")]
                    while (rightRowIDs.length > leftRowIDs.length) {
                        D.CopyToSec(charObj.id, "earnedxpright", rightRowIDs[0], "earnedxp")
                        leftRowIDs.push(rightRowIDs.shift())
                    }
                    D.Chat(charObj, C.CHATHTML.Block([                    
                        C.CHATHTML.Body(`<b>FOR:</b> ${reason}`, C.STYLES.whiteMarble.body),
                        C.CHATHTML.Header(`You Have Been Awarded ${D.NumToText(award, true)} XP.`, C.STYLES.whiteMarble.header),
                    ], C.STYLES.whiteMarble.block))                
                // D.Alert(`Sort Trigger Value: ${D.GetStatVal(charObj, "xpsorttrigger")}`)
                    D.SetStat(charObj, "xpsorttrigger", D.GetStatVal(charObj, "xpsorttrigger") === "1" ? "2" : "1")
                // D.Alert(`New Value: ${D.GetStatVal(charObj, "xpsorttrigger")}`)
                    return true
                }
            }
            return false
        },
    // #endregion

    // #region Sandbox Displays: Desires, Advantages, Hunger & Weekly Resources
        displayDesires = (addAttrData) => {     
            for (const charData of _.values(Char.REGISTRY)) {
                const desireObj = Media.GetText(`${charData.shortName}Desire`)
                if (VAL({textObj: desireObj})) {
                    let desireVal = (D.GetRepStat(charData.id, "desire", "top", "desire") || {val: ""}).val
                    // D.Poke(`Desire Val for ${charData.name}: '${D.JS(desireVal)}'`)
                    if ((!desireVal || desireVal === "") && addAttrData && addAttrData.charID === charData.id)
                        desireVal = addAttrData.val
                    if (!desireVal || desireVal === "")
                        desireVal = " "                    
                    DB(`<b>${charData.name}</b>: Getting Desire Value = ${desireVal}`, "displayDesires")
                    Media.SetText(desireObj, desireVal)
                }
            }
        },
        resolveDesire = charRef => {
            const desireObj = (D.GetRepStat(charRef, "desire", "top", "desire") || {obj: null}).obj
            if (desireObj) {
                desireObj.remove()
                adjustDamage(charRef, "willpower", "superficial+", -1, false)
                displayDesires()
                D.Chat(D.GetChar(charRef), C.CHATHTML.Block([
                    C.CHATHTML.Header("You have resolved your Desire!<br>One superficial Willpower restored.<br>What do you Desire next?", Object.assign({height: "auto"}, C.STYLES.whiteMarble.header))
                ], C.STYLES.whiteMarble.block))
            }            
        },
        regResource = (charRef, name, amount) => {
            const initial = D.UCase((D.GetCharData(charRef) || {initial: false}).initial)
            if (initial !== "") {
                STATEREF.weeklyResources[initial] = STATEREF.weeklyResources[initial] || []
                STATEREF.weeklyResources[initial].push([name, 0, amount])
            }
            displayResources()
        },
        unregResource = (charRef, rowNum) => {
            const initial = D.UCase((D.GetCharData(charRef) || {initial: false}).initial)
            if (initial !== "")
                if (STATEREF.weeklyResources[initial].length <= 1 && rowNum === 1)
                    delete STATEREF.weeklyResources[initial]
                else
                    STATEREF.weeklyResources[initial] = [..._.first(STATEREF.weeklyResources[initial], rowNum - 1), ..._.rest(STATEREF.weeklyResources[initial], rowNum)]
            displayResources()
        },
        adjustResource = (charRef, rowNum, amount) => {
            const initial = D.UCase((D.GetCharData(charRef) || {initial: false}).initial)
            if (initial !== "") {
                D.Alert(`Adjusting: ${initial}, ${rowNum}, ${amount}`)
                const entry = STATEREF.weeklyResources[initial] && STATEREF.weeklyResources[initial][rowNum - 1]
                if (entry)
                    entry[1] = Math.max(0, Math.min(entry[2], entry[1] + amount))
                D.Chat(D.GetChar(initial), C.CHATHTML.Block([
                    C.CHATHTML.Header("Weekly Resource Updated", C.STYLES.whiteMarble.header),
                    C.CHATHTML.Body(amount < 0 ? `${entry[0]} restored by ${-1*amount} to ${entry[2]-entry[1]}/${entry[2]}` : `${Math.abs(amount)} ${entry[0]} spent, ${entry[2]-entry[1]} remaining.`, C.STYLES.whiteMarble.body)
                ], C.STYLES.whiteMarble.block))
            }
            displayResources()
        },
        resetResources = () => {
            _.each(STATEREF.weeklyResources, (data, init) => {
                // D.Alert(`Init: ${D.JS(init)}, Data: ${D.JS(data, true)}<br>Map: ${D.JS(_.map(data, v => [v[0], 0, v[2]]))}`)
                STATEREF.weeklyResources[init] = _.map(data, v => [v[0], 0, v[2], v[3] || 0])
                D.Chat(D.GetChar(init), C.CHATHTML.Block([
                    C.CHATHTML.Body("Your weekly resources have been refreshed.", C.STYLES.whiteMarble.body)
                ], C.STYLES.whiteMarble.block))
            })
            displayResources()
        },
        displayResources = () => {
            const [col1Width, col2Width] = [35, 250],
                textObj = Media.GetText("weeklyResources"),
                resStrings = []
            if (_.flatten(_.values(STATEREF.weeklyResources)).length === 0) {
                Media.SetText("weeklyResources", {text: " "})
            } else {
                const sortedInits = _.sortBy(_.keys(STATEREF.weeklyResources))
                for(const init of sortedInits) {
                    const data = STATEREF.weeklyResources[init]
                    let thisString = `[${init}]`
                    _.each(data, v => {
                        DB(`thisString: ${D.JS(thisString)}, col1width: ${Media.GetTextWidth(textObj, thisString, false)}, col2width: ${Media.GetTextWidth(textObj, v[0], false)}`, "displayResources")
                        resStrings.push(`${thisString}${Media.Buffer(textObj, col1Width - Media.GetTextWidth(textObj, thisString, false))}${
                            v[0]}${Media.Buffer(textObj, col2Width - Media.GetTextWidth(textObj, v[0], false))}${
                            `${"●".repeat(v[2]-v[1]-(v[3] || 0))}${"○".repeat(v[1])}${"◊".repeat(v[3] || 0)}`.replace(/^(\S\S\S\S\S)/gu, "$1  ")
                        }`)
                        thisString = " "
                    })
                }            
                Media.SetText("weeklyResources", resStrings.join("\n"))
            }
            displayStakes()
        },
        sortCoterieStakes = (charRef) => {
            const charObj = D.GetChar(charRef),
                coterieRows = _.keys(_.omit(D.GetRepStats(charObj, "advantage", null, "advantage_type", "rowID", "val"), v => v[0] !== "Coterie")),
                advData = D.GetRepStats(charObj, "advantage", null, null, "rowID"),
                charAdvData = _.object(_.map(_.flatten(_.map(_.values(_.omit(advData, ...coterieRows)), v => _.filter(v, vv => vv.attrName === "advantage" && vv.name !== "advantage"))), v => [v.name, v.val])),
                coterieAdvData = _.object(_.map(_.flatten(_.map(_.values(_.pick(advData, ...coterieRows)), v => _.filter(v, vv => vv.attrName === "advantage" && vv.name !== "advantage"))), v => [v.name, v.val]))
            DB(`<b>CHARACTER STAKES</b>: ${D.JS(charAdvData,true)}<br><br><b>COTERIE STAKES:</b> ${D.JS(coterieAdvData, true)}`, "sortCoterieStakes")
            return [charAdvData, coterieAdvData]
        },
        displayStakes = () => {
            const [col1Width, col2Width, col3Width] = [35, 310, 150],
                [coterieObj, personalObj] = [
                    Media.GetText("stakedCoterieAdvantages"),
                    Media.GetText("stakedAdvantages")
                ],
                [stakeData, coterieStakes] = [[],{}],
                [stakeStrings, coterieStakeStrings] = [[], []],
                sortedCharData = _.sortBy(_.values(D.KeyMapObj(_.values(REGISTRY), null, v => ({initial: v.initial, charObj: D.GetChar(v.id)}))), "initial")
            // D.Alert(`Initials Sort: ${D.JS(initials)}`)
            for (const charData of sortedCharData) {
                const {initial, charObj} = charData,
                    projectStakes = [],
                    [, coterieAdvs] = sortCoterieStakes(charObj)
                for (const attrName of ["projectstake1", "projectstake2", "projectstake3"])
                    projectStakes.push(...D.GetRepStats(charObj, "project", {projectstakes_toggle: "1"}, attrName))
                DB(`Project Stakes: ${D.JS(projectStakes, true)}`, "displayStakes")
                for (const stake of projectStakes) {
                    const advMax = (D.GetRepStat(charObj, "advantage", null, stake.name) || {val: null}).val,
                        endDate = (D.GetRepStat(charObj, "project", stake.rowID, "projectenddate") || {val: null}).val
                    DB(`... AdvMax: ${advMax}, EndDate: ${endDate
                    }<br>... RepStats (Coterie): ${D.JS(_.keys(coterieAdvs), true)
                    }<br>... Parsed End Date (${D.JS(TimeTracker.GetDate(endDate).getTime())}) vs. Current Date (${TimeTracker.CurrentDate.getTime()
                    }<br>... Comparing: ${TimeTracker.CurrentDate.getTime() < TimeTracker.GetDate(endDate).getTime()}`, "displayStakes")
                    if (advMax && D.Int(stake.val) > 0 && TimeTracker.CurrentDate.getTime() < TimeTracker.GetDate(endDate).getTime())
                        if (_.keys(coterieAdvs).includes(stake.name))
                            coterieStakes[stake.name] = {
                                name: stake.name,
                                total: (coterieStakes[stake.name] && coterieStakes[stake.name].total || 0) + D.Int(stake.val),
                                inits: _.uniq([...(coterieStakes[stake.name] || {inits: []}).inits, initial]),
                                dates: _.uniq([...(coterieStakes[stake.name] || {dates: []}).dates, endDate]),
                                dateStamp: [...(coterieStakes[stake.name] || {dateStamp: []}).dateStamp, TimeTracker.GetDate(endDate).getTime()],
                                max: D.Int(advMax)
                            }
                        else
                            stakeData.push([initial, stake.name, Math.min(D.Int(stake.val), advMax), D.Int(advMax), endDate])
                }
                for (const stake of STATEREF.customStakes.personal[initial]) {
                    const [name, val, max, dateStamp] = [stake[0], stake[1], stake[2], TimeTracker.GetDate(stake[3])]
                    if (max && val > 0 && TimeTracker.CurrentDate.getTime() < dateStamp.getTime())
                        stakeData.push([initial, name, val, max, TimeTracker.FormatDate(dateStamp)])
                }
                    
            }
            for (const stake of STATEREF.customStakes.coterie) {
                const [name, val, max, dateStamp] = [stake[0], stake[1], stake[2], TimeTracker.GetDate(stake[3])]
                if (max && val > 0 && TimeTracker.CurrentDate.getTime() < dateStamp.getTime())
                    if (coterieStakes[name]) {
                        coterieStakes[name].total += val
                        coterieStakes[name].dateStamp.push(dateStamp.getTime())
                        coterieStakes[name].max = max || coterieStakes[name].max
                    } else {
                        coterieStakes[name] = {
                            name,
                            total: val,
                            dateStamp: [dateStamp.getTime()],
                            max
                        }
                    }
            }
                
            DB(`Coterie Stakes: ${D.JS(_.keys(coterieStakes), true)}`, "displayStakes")
            // PERSONAL STAKES
            if (_.keys(stakeData).length === 0)
                Media.SetText("stakedAdvantages", " ")
            let lastInit = ""
            for (const data of stakeData) {
                const [init, name, staked, max, endDate] = data
                let thisString = " "
                if (init !== lastInit) {
                    thisString = `[${init}]`
                    lastInit = init
                }
                let col1String = thisString,
                    col2String = name,
                    col3String = "○".repeat(staked) + "●".repeat(max - staked)
                col1String += Media.Buffer(personalObj, col1Width - Media.GetTextWidth(personalObj, col1String, false))
                col2String += Media.Buffer(personalObj, col1Width + col2Width - Media.GetTextWidth(personalObj, col1String + col2String, false))
                col3String += Media.Buffer(personalObj, col1Width + col2Width + col3Width - Media.GetTextWidth(personalObj, col1String + col2String + col3String, false))
                stakeStrings.push(col1String + col2String + col3String + endDate)
            }        
            Media.SetText("stakedAdvantages", stakeStrings.join("\n"))

            // COTERIE STAKES
            if (_.keys(coterieStakes).length === 0) {
                Media.SetText("stakedCoterieAdvantages", " ")
            } else {
                for (const coterieData of _.values(coterieStakes)) {
                    const thisDate = TimeTracker.FormatDate(new Date(_.sortBy(coterieData.dateStamp, v => v)[0]))
                    let col12String = coterieData.name.toUpperCase(),
                        col3String = "○".repeat(coterieData.total) + "●".repeat(coterieData.max - coterieData.total)
                    col12String += Media.Buffer(coterieObj, col1Width + col2Width - Media.GetTextWidth(coterieObj, col12String, false))
                    col3String += Media.Buffer(coterieObj, col1Width + col2Width + col3Width - Media.GetTextWidth(coterieObj, col12String + col3String, false))
                    coterieStakeStrings.push(col12String + col3String + thisDate)
                }                     
                Media.SetText("stakedCoterieAdvantages", coterieStakeStrings.join("\n"))
            }
        },
        updateHunger = () => {
            for(const char of D.GetChars("registered")) {
                const charData = D.GetCharData(char),
                    quad = charData.quadrant,
                    hunger = `${D.GetStatVal(char, "hunger")}`
                Media.SetImg(`Hunger${quad}`, hunger)
            }
        },
    // #endregion
    
    // #region Manipulating Stats on Sheet,
        parseDmgTypes = (max, bashing = 0, aggravated = 0, deltaBash = 0, deltaAgg = 0) => {
            if (VAL({number: [max, bashing, aggravated, deltaBash, deltaAgg]}, "parseDmgTypes", true)) {
                let [newBash, newAgg, deltaBashToGo, deltaAggToGo] = [bashing, aggravated, deltaBash, deltaAgg]
                if (deltaBash + deltaAgg > 0) {
                    while (deltaAggToGo && newAgg < max) {
                        deltaAggToGo--
                        newAgg++
                        if (newAgg + newBash > max)
                            newBash--
                    }
                    if (deltaAggToGo)
                        return [newBash, newAgg, true]
                    while (deltaBashToGo && newAgg < max) {
                        deltaBashToGo--
                        newBash++
                        if (newBash + newAgg > max) {
                            newBash--
                            newBash--
                            newAgg++
                        }
                    }
                } else if (deltaBash + deltaAgg < 0) {
                    while (deltaAggToGo < 0 && newAgg > 0) {
                        deltaAggToGo++
                        newAgg--
                        newBash++
                    }
                    while (deltaBashToGo < 0 && newBash > 0) {
                        deltaBashToGo++
                        newBash--
                    }
                }
                return [newBash, newAgg, deltaAggToGo + deltaBashToGo > 0]
            }
            return false
        },
        adjustTrait = (charRef, trait, amount, min = 0, max = Infinity, defaultTraitVal, deltaType, isChatting = true) => {
            // D.Alert(`Adjusting Trait: ${[charRef, trait, amount, min, max, defaultTraitVal, deltaType, isChatting].map(x => D.JS(x)).join(", ")}`)
            const charObj = D.GetChar(charRef)
            if (VAL({charObj: [charObj], trait: [trait], number: [amount]}, "adjustTrait", true)) {
                switch (trait.toLowerCase()) {
                    case "stain": case "stains":
                    case "humanity": case "hum":
                        min = 0
                        max = 10
                        break
                    // no default                        
                }
                const chatStyles = {
                        block: trait === "humanity" && amount > 0 || trait !== "humanity" && amount < 0 ? Object.assign(C.STYLES.whiteMarble.block, {}) : {width: "275px", margin: "0px 0px 0px -50px"},
                        body: trait === "humanity" && amount > 0 || trait !== "humanity" && amount < 0 ? Object.assign(C.STYLES.whiteMarble.body, {fontSize: "12px"}) : {fontFamily: "Voltaire", fontSize: "14px", color: "rgb(255,50,50)"},
                        banner: trait === "humanity" && amount > 0 || trait !== "humanity" && amount < 0 ? Object.assign(C.STYLES.whiteMarble.header, {margin: "0px", fontSize: "12px"}) : {margin: "0px", fontSize: "12px"},
                        alert: trait === "humanity" && amount > 0 || trait !== "humanity" && amount < 0 ? Object.assign(C.STYLES.whiteMarble.header, {}) : {}
                    },
                    initTraitVal = VAL({number: D.Int(D.GetStatVal(charObj, trait))}) ? D.Int(D.GetStatVal(charObj, trait)) : defaultTraitVal || 0,
                    finalTraitVal = Math.min(max, Math.max(min, initTraitVal + D.Int(amount)))
                amount = finalTraitVal - initTraitVal
                let [bannerString, bodyString, alertString, trackerString] = ["", "", null, ""]
                DB(`Adjusting Trait: (${D.JS(trait)}, ${D.JS(amount)}, ${D.JS(min)}, ${D.JS(max)}, ${D.JS(defaultTraitVal)}, ${D.JS(deltaType)})
                    ... Initial (${D.JS(initTraitVal)}) + Amount (${D.JS(amount)}) = Final (${D.JS(finalTraitVal)}))`, "adjustTrait")
                switch (trait.toLowerCase()) {
                    case "hunger":
                        chatStyles.header = {margin: "0px"}
                        if (amount > 0) 
                            bannerString = `Your hunger increases by ${D.NumToText(amount).toLowerCase()}`
                        else if (amount < 0)
                            bannerString = `You sate your hunger by ${D.NumToText(Math.abs(amount)).toLowerCase()}`
                        Media.SetImg(`Hunger${getAttrByName(charObj.id, "sandboxquadrant")}_1`, D.Int(finalTraitVal) === "0" ? "blank" : `${finalTraitVal}`)
                        break
                    case "hum": case "humanity":
                        if (amount > 0)
                            bannerString = `Your Humanity increases by ${D.NumToText(amount).toLowerCase()} to ${D.NumToText(finalTraitVal).toLowerCase()}.`
                        else if (amount < 0)
                            bannerString = `Your Humanity falls by ${D.NumToText(Math.abs(amount)).toLowerCase()} to ${D.NumToText(finalTraitVal).toLowerCase()}.`
                        break
                    case "stain": case "stains":
                        if (amount > 0)
                            bannerString = `You suffer ${D.NumToText(amount).toLowerCase()} stain${amount > 1 ? "s" : ""} to your Humanity.`
                        else if (amount < 0)
                            bannerString = `${D.NumToText(Math.abs(finalTraitVal - initTraitVal))} stain${Math.abs(amount) > 1 ? "s" : ""} cleared from your Humanity.`
                        break
                    case "willpower_sdmg": case "willpower_sdmg_social":
                        if (amount > 0) {
                            const [maxWP, curBashing, curAggravated] = [
                                    D.Int(D.GetStat(charObj, "willpower_max")[0]),
                                    D.Int(D.GetStat(charObj, "willpower_bashing")[0]),
                                    D.Int(D.GetStat(charObj, "willpower_aggravated")[0])
                                ],
                                [newBashing, newAggravated, isOverLimit] = parseDmgTypes(maxWP, curBashing, curAggravated, amount, 0)
                            DB(`MaxWP: ${maxWP}, CurBash: ${curBashing}, CurAggr: ${curAggravated}<br>... Dealing ${amount} --> newBash: ${newBashing}, newAggr: ${newAggravated}`, "adjustTrait")
                            switch(deltaType) {
                                case "superficial":
                                    bannerString = `You suffer ${D.NumToText(Math.abs(amount)).toLowerCase()} (halved) superficial Willpower damage.`
                                    break
                                case "superficial+":
                                    bannerString = `You suffer ${D.NumToText(Math.abs(amount)).toLowerCase()} superficial Willpower damage.`
                                    break
                                case "spent":
                                    bannerString = `You spend ${D.NumToText(Math.abs(amount)).toLowerCase()} Willpower.`
                                    break
                                // no default
                            }
                            if (isOverLimit || newAggravated === maxWP) {
                                bodyString = "YOU ARE COMPLETELY EXHAUSTED!"
                                alertString = "EXHAUSTED: -2 to Social & Mental rolls.<br>You cannot spend Willpower."
                            } else if (newBashing + newAggravated === maxWP) {
                                bodyString = "Further strain will cause AGGRAVATED damage!"
                                alertString = "EXHAUSTED: -2 to Social & Mental rolls."
                            }
                            trackerString = C.CHATHTML.TrackerLine(maxWP - newBashing - newAggravated, newBashing, newAggravated, {margin: alertString ? undefined : "-8px 0px 0px 0px"})
                        } else if (Math.min(D.Int(D.GetStat(charObj, "willpower_bashing")[0]), Math.abs(amount))) {
                            bannerString = `You regain ${D.NumToText(Math.min(D.Int(D.GetStat(charObj, "willpower_bashing")[0]), Math.abs(amount))).toLowerCase()} Willpower.`                            
                        }                        
                        break
                    case "willpower_admg": case "willpower_admg_social":
                        if (amount > 0) {
                            const [maxWP, curBashing, curAggravated] = [
                                    D.Int(D.GetStat(charObj, "willpower_max")[0]),
                                    D.Int(D.GetStat(charObj, "willpower_bashing")[0]),
                                    D.Int(D.GetStat(charObj, "willpower_aggravated")[0])
                                ],
                                [newBashing, newAggravated, isOverLimit] = parseDmgTypes(maxWP, curBashing, curAggravated, 0, amount)
                            DB(`MaxWP: ${maxWP}, CurBash: ${curBashing}, CurAggr: ${curAggravated}<br>... Dealing ${amount} --> newBash: ${newBashing}, newAggr: ${newAggravated}`, "adjustTrait")
                            bannerString = `You suffer ${D.NumToText(Math.abs(amount)).toLowerCase()} AGGRAVATED Willpower damage!`     
                            if (isOverLimit || newAggravated === maxWP) {
                                bodyString = "YOU ARE COMPLETELY EXHAUSTED!"
                                alertString = "EXHAUSTED: -2 to Social & Mental rolls.<br>You cannot spend Willpower."
                            } else if (newBashing + newAggravated === maxWP) {
                                bodyString = "Further strain will cause AGGRAVATED damage!"
                                alertString = "EXHAUSTED: -2 to Social & Mental rolls."            
                            }
                            trackerString = C.CHATHTML.TrackerLine(maxWP - newBashing - newAggravated, newBashing, newAggravated, {margin: alertString ? undefined : "-8px 0px 0px 0px"}) 
                        } else if (Math.min(D.Int(D.GetStat(charObj, "willpower_aggravated")[0]), Math.abs(amount))) {
                            bannerString = `${D.NumToText(Math.min(D.Int(D.GetStat(charObj, "willpower_aggravated")[0]), Math.abs(amount)))} aggravated Willpower damage downgraded.`                            
                        }
                        
                        break
                    case "health_sdmg":
                        if (amount > 0) {
                            const [maxHealth, curBashing, curAggravated] = [
                                    D.Int(D.GetStat(charObj, "health_max")[0]),
                                    D.Int(D.GetStat(charObj, "health_bashing")[0]),
                                    D.Int(D.GetStat(charObj, "health_aggravated")[0])
                                ],
                                [newBashing, newAggravated, isOverLimit] = parseDmgTypes(maxHealth, curBashing, curAggravated, amount, 0)
                            DB(`MaxHealth: ${maxHealth}, CurBash: ${curBashing}, CurAggr: ${curAggravated}<br>... Dealing ${amount} --> newBash: ${newBashing}, newAggr: ${newAggravated}`, "adjustTrait")
                            switch (deltaType) {
                                case "superficial":
                                    bannerString = `You suffer ${D.NumToText(Math.abs(amount)).toLowerCase()} (halved) superficial Health damage.`
                                    break
                                case "superficial+":
                                    bannerString = `You suffer ${D.NumToText(Math.abs(amount)).toLowerCase()} superficial Health damage.`
                                    break
                                // no default
                            }                            
                            if (isOverLimit || newAggravated === maxHealth) {
                                alertString = "DARKNESS FALLS<br>You sink into torpor..."
                            } else if (newBashing + newAggravated === maxHealth) {
                                bodyString = "Further harm will cause AGGRAVATED damage!"
                                alertString = "WOUNDED: -2 to Physical rolls."
                            }
                            trackerString = C.CHATHTML.TrackerLine(maxHealth - newAggravated - newBashing, newBashing, newAggravated, {margin: alertString ? undefined : "-8px 0px 0px 0px"})                 
                        } else if (Math.min(D.Int(D.GetStat(charObj, "health_bashing")[0]), Math.abs(amount))) {
                            bannerString = `You heal ${D.NumToText(Math.min(D.Int(D.GetStat(charObj, "health_bashing")[0]), Math.abs(amount))).toLowerCase()} superficial Health damage.` 
                        }
                        break
                    case "health_admg":
                        if (amount > 0) {
                            const [maxHealth, curBashing, curAggravated] = [
                                    D.Int(D.GetStat(charObj, "health_max")[0]),
                                    D.Int(D.GetStat(charObj, "health_bashing")[0]),
                                    D.Int(D.GetStat(charObj, "health_aggravated")[0])
                                ],
                                [newBashing, newAggravated, isOverLimit] = parseDmgTypes(maxHealth, curBashing, curAggravated, 0, amount)
                            DB(`MaxHealth: ${maxHealth}, CurBash: ${curBashing}, CurAggr: ${curAggravated}<br>... Dealing ${amount} --> newBash: ${newBashing}, newAggr: ${newAggravated}<br>... IsOverLimit? ${D.JS(isOverLimit)}`, "adjustTrait")
                            bannerString = `You suffer ${D.NumToText(Math.abs(amount)).toLowerCase()} AGGRAVATED Health damage!`                                          
                            if (isOverLimit || newAggravated === maxHealth) {
                                alertString = "DARKNESS FALLS<br>You sink into torpor..."
                            } else if (newBashing + newAggravated === maxHealth) {
                                bodyString = "Further harm will cause AGGRAVATED damage!"
                                alertString = "WOUNDED: -2 to Physical rolls."
                            }                       
                            trackerString = C.CHATHTML.TrackerLine(maxHealth - newAggravated - newBashing, newBashing, newAggravated, {margin: alertString ? undefined : "-8px 0px 0px 0px"})
                        } else if (Math.min(D.Int(D.GetStat(charObj, "health_aggravated")[0]), Math.abs(amount))) {
                            bannerString = `${D.NumToText(Math.min(D.Int(D.GetStat(charObj, "health_aggravated")[0]), Math.abs(amount)))} aggravated Health damage downgraded.`                  
                        }
                        break
                    // no default
                }
                if (bannerString && isChatting)
                    D.Chat(charObj, C.CHATHTML.Block(_.compact([
                        C.CHATHTML.Header(bannerString, chatStyles.banner),
                        bodyString ? C.CHATHTML.Body(bodyString, chatStyles.body) : null,
                        trackerString || null,
                        alertString ? C.CHATHTML.Header(alertString, Object.assign(chatStyles.alert, alertString.includes("<br>") ? {height: "40px"} : {})) : null
                    ]), chatStyles.block))
                setAttrs(D.GetChar(charObj).id, {[trait.toLowerCase()]: finalTraitVal})
                return true
            }
            return false
        },
        adjustDamage = (charRef, trait, dType, delta, isChatting = true) => {
            const amount = D.Int(delta),
                charObj = D.GetChar(charRef),
                dmgType = dType
            let [minVal, maxVal, targetVal, defaultVal, traitName, deltaType] = [0, 5, D.Int(amount), 0, "", ""]
            if (VAL({charObj: [charObj], number: [amount]}, "AdjustDamage", true)) {
                switch (trait.toLowerCase()) {
                    case "hum": case "humanity":
                        [minVal, maxVal, targetVal, defaultVal, traitName] = [0, 10, D.Int(amount), 7, "humanity"]
                        break
                    case "stain": case "stains":
                        [minVal, maxVal, targetVal, defaultVal, traitName] = [0, 10, D.Int(amount), 0, "stains"]
                        break
                    case "health": case "willpower": case "wp": {
                        [minVal, maxVal, targetVal, defaultVal, traitName, deltaType] = [
                            -Infinity,
                            Infinity,
                            D.Int(amount) >= 0 && dmgType.endsWith("superficial") ? D.Int(Math.ceil(amount / 2)) : D.Int(amount),
                            0,
                            trait.toLowerCase() + (["superficial", "superficial+", "spent"].includes(dmgType.replace(/social_/gu, "")) ? "_sdmg" : "_admg") + (dmgType.includes("social") ? "_social" : ""),
                            dmgType.replace(/social_/gu, "")
                        ]
                        if (dmgType.includes("social"))
                            Session.AddSceneChar(charRef)
                        break
                    }
                    // no default
                }
                // D.Alert(`Adjusting Damage: (${D.JS(trait)}, ${D.JS(dmgType)}, ${D.JS(amount)})`, "adjustDamage")
                const returnVal = adjustTrait(charRef, traitName, targetVal, minVal, maxVal, defaultVal, deltaType, isChatting)
                // if (amount < 0 && deltaType === "aggravated")
                    // adjustTrait(charRef, traitName.replace(/_admg/gu, "_sdmg"), -1 * targetVal, minVal, maxVal, defaultVal, "superficial", false)
                return returnVal
            }
            return false
        },
        adjustHunger = (charRef, amount, isKilling = false, isChatting = true) => {
            if (VAL({char: [charRef], number: [amount], trait: ["bp_slakekill"]}, "AdjustHunger", true))
                return adjustTrait(
                    charRef, 
                    "hunger", 
                    D.Int(amount), 
                    isKilling || D.Int(amount) > 0 ? 0 : D.Int(D.GetStat(charRef, "bp_slakekill") && D.GetStat(charRef, "bp_slakekill")[0] || 1),
                    5,
                    1,
                    null,
                    isChatting
                )
            return false            
        },
        sortTimeline = (charRef) => {
            D.SortRepSec(charRef, "timeline", "tlsortby", true, val => val || -200)
        },
        launchProject = (margin = 0, resultString = "SUCCESS") => {
            const charObj = D.GetChar(Roller.LastProjectCharID),
                p = v => Roller.LastProjectPrefix + v,
                rowID = Roller.LastProjectPrefix.split("_")[2],
                attrList = {},
                [trait1name, trait1val, trait2name, trait2val, diff, scope] = [
                    D.GetRepStat(charObj, "project", rowID, "projectlaunchtrait1_name").val,
                    D.GetRepStat(charObj, "project", rowID, "projectlaunchtrait1").val,
                    D.GetRepStat(charObj, "project", rowID, "projectlaunchtrait2_name").val,
                    D.GetRepStat(charObj, "project", rowID, "projectlaunchtrait2").val,
                    D.GetRepStat(charObj, "project", rowID, "projectlaunchdiff").val,
                    D.GetRepStat(charObj, "project", rowID, "projectscope").val
                ]
            attrList[p("projectlaunchresultsummary")] = `${trait1name} (${trait1val}) + ${trait2name} (${trait2val}) vs. ${diff}: ${resultString}`
            DB(`${attrList[p("projectlaunchresultsummary")]}`, "launchProject")
            attrList[p("projectlaunchroll_toggle")] = 2
            attrList[p("projectlaunchresults")] = resultString
            attrList[p("projectstakes_toggle")] = 1
            attrList[p("projecttotalstake")] = D.Int(scope) + 1 - margin
            attrList[p("projectlaunchresultsmargin")] = `${D.Int(scope) + 1 - margin} Stake Required, (${D.Int(scope) + 1 - margin} to Go)`
            setAttrs(charObj.id, attrList)
        },
    // #endregion

    // #region Daysleep & Waking Up,
        setDaysleepAlarm = () => {
            TimeTracker.SetAlarm("dusk", "Dusk Wake-Up", C.CHATHTML.Block([
                C.CHATHTML.Header("You Awaken at Dusk:"),
                C.CHATHTML.Body([
                    "You rouse your Hunger to wake,",
                    "and to heal aggravated Health damage.",
                    "You refresh your Willpower."
                ].join("<br>"))
            ].join("")), ["daysleep"], ["all"], [], false, true)
        },
        refreshWillpower = (charRef) => {
            // Need to alter refreshAmount based on card effects that change willpower refresh.
            const refreshAmount = Math.max(D.GetStatVal(charRef, "composure"), D.GetStatVal(charRef, "resolve"))
            adjustDamage(charRef, "willpower", "superficial", -refreshAmount)
        },
        daysleep = () => {
            for (const char of D.GetChars("registered")) {
                const healWP = Math.max(D.Int(getAttrByName(char.id, "composure")), D.Int(getAttrByName(char.id, "resolve")))
                adjustDamage(char, "willpower", "superficial+", -1 * healWP)
            }
        },
    // #endregion

    // #region Populating Character Attributes
    /* ATTRIBUTES = {
        physical: ["Strength", "Dexterity", "Stamina"],
        social: ["Charisma", "Manipulation", "Composure"],
        mental: ["Intelligence", "Wits", "Resolve"]
    },
    SKILLS = {
        physical: ["Athletics", "Brawl", "Craft", "Drive", "Firearms", "Melee", "Larceny", "Stealth", "Survival"],
        social: ["Animal Ken", "Etiquette", "Insight", "Intimidation", "Leadership", "Performance", "Persuasion", "Streetwise", "Subterfuge"],
        mental: ["Academics", "Awareness", "Finance", "Investigation", "Medicine", "Occult", "Politics", "Science", "Technology"]
    },
    DISCIPLINES = ["Animalism", "Auspex", "Celerity", ...],
    TRACKERS = ["Willpower", "Health", "Humanity", "Blood Potency"], */
        populateDefaults = (charRef) => {
        // Initializes (or resets) a given character with default values for all stats.
        // Can provide a number for charRef, in which case it will reset values of 10 characters starting from that index position in the keys of NPCSTATS.
            const attrList = {},
                charIDs = [],
                npcStats = JSON.parse(NPCSTATS),
                npcDefaults = JSON.parse(NPCDEFAULTS)
            _.each(npcDefaults, (v, k) => { attrList[k] = v })
            if (_.isNaN(D.Int(charRef))) {
                charIDs.push(D.GetChar(charRef).id)
            } else {
                charIDs.push(..._.keys(npcStats).slice(D.Int(charRef), D.Int(charRef) + 10))
                D.Alert(`Setting Defaults on characters ${D.Int(charRef)} - ${D.Int(charRef) + 10} of ${_.keys(npcStats).length} ...`)
            }
            const reportLine = []
            for (const charID of charIDs) {
                setAttrs(charID, attrList)
                reportLine.push(`Set Defaults on ${D.GetName(charID)}`)
                _.each(["discleft", "discmid", "discright"], v => {
                    _.each(D.GetRepIDs(charID, v), vv => {
                        D.DeleteRow(charID, v, vv)
                    })
                })
            }
            D.Alert(reportLine.join("<br>"), "CHARS: populateDefaults()")
        },
        changeAttrName = (oldName, newName) => {
            const allChars = findObjs({
                    _type: "character"
                }),
                attrList = {}
            for (const char of allChars) {
                attrList[char.get("name")] = []
                const attr = findObjs({
                    _type: "attribute",
                    _characterid: char.id,
                    name: oldName
                })[0]
                if (attr) {
                    attrList[char.get("name")].push({
                        [newName]: attr.get("current"),
                        [`${newName}_max`]: attr.get("max")
                    })
                    setAttrs(char.id, {
                        [newName]: attr.get("current"),
                        [`${newName}_max`]: attr.get("max")
                    })
                    attr.remove()
                }
            }

            D.Alert(D.JS(attrList))
        },
        setNPCStats = (charRef) => {
            // Applies NPCSTATS (output from the NPC Stats Google Sheet) to the given character reference, OR all characters in NPC stats. 
            const charIDs = [],
                npcStats = JSON.parse(NPCSTATS)
            let errorLog = ""
            if (charRef)
                charIDs.push(D.GetChar(charRef).id)
            else
                charIDs.push(..._.keys(npcStats))

            for (const charID of charIDs) {
                const attrList = {},
                    charData = npcStats[charID]
                if (charData.base)
                    for (const attr of _.keys(charData.base)) {
                        if (attr === "blood_potency")
                            attrList.hunger = C.BLOODPOTENCY[charData.base[attr]].bp_minhunger

                        attrList[attr] = charData.base[attr]
                    }

                if (charData.attributes) {
                    for (const attribute of _.flatten(_.values(C.ATTRIBUTES)))
                        attrList[attribute.toLowerCase()] = 1

                    for (const attribute of _.keys(charData.attributes))
                        attrList[attribute] = charData.attributes[attribute]

                }
                if (charData.skills) {
                    const skillDupeCheck = _.compact(_.flatten(_.map(_.values(charData.skills), v => v.split(/\s+/gu))))
                    if (_.uniq(skillDupeCheck).length !== skillDupeCheck.length)
                        errorLog += `<br>Duplicate Skill(s) on ${D.GetName(charID)}: ${_.sortBy(skillDupeCheck, v => v).join(" ")}`
                    else
                        for (const skillAbv of _.keys(C.SKILLABBVS))
                            attrList[C.SKILLABBVS[skillAbv]] = D.Int(_.findKey(charData.skills, v => v.includes(skillAbv)))


                }
                if (charData.clandiscs)
                    _.each(["disc1", "disc2", "disc3"], discnum => {
                        if (charData.clandiscs[discnum].length)
                            [attrList[`${discnum}_name`], attrList[discnum]] = charData.clandiscs[discnum]
                        else
                            [attrList[`${discnum}_name`], attrList[discnum]] = ["", 0]
                    })

                const [repDiscs, rowCount] = [{}, {}]
                _.each(["discleft", "discmid", "discright"], section => {
                    const sectionData = D.GetRepStats(charID, section, null, null, "rowID")
                    rowCount[section] = _.keys(sectionData).length
                    _.each(sectionData, (rowData, rowID) => {
                        const discData = _.find(rowData, stat => C.DISCIPLINES.includes(stat.name))
                        if (discData)
                            repDiscs[discData.name] = {
                                sec: section,
                                rowID,
                                val: D.Int(discData.val)
                            }
                        else
                            D.DeleteRow(charID, section, rowID)
                    })
                })
                if (charData.otherdiscs) {
                    const otherDiscs = [],
                        discDupeCheck = _.compact([
                            ..._.map(_.compact(_.values(charData.clandiscs)), v => v[0]),
                            ..._.flatten(_.map(_.compact(_.values(charData.otherdiscs)), v => _.map(v.split(/\s+/gu), vv => C.DISCABBVS[vv])))
                        ])
                    if (_.uniq(discDupeCheck).length !== discDupeCheck.length) {
                        errorLog += `<br>Duplicate Discipline(s) on ${D.GetName(charID)}: ${_.sortBy(discDupeCheck, v => v).join(" ")}`
                    } else {
                        for (const discAbv of _.keys(C.DISCABBVS)) {
                            const discName = C.DISCABBVS[discAbv]
                            if (_.keys(repDiscs).includes(discName))
                                if (_.findKey(charData.otherdiscs, v => v.includes(discAbv)))
                                    attrList[`repeating_${repDiscs[discName].sec}_${repDiscs[discName].rowID}_disc`] = D.Int(_.findKey(charData.otherdiscs, v => v.includes(discAbv)))
                                else {
                                    D.DeleteRow(charID, repDiscs[discName].sec, repDiscs[discName].rowID)
                                    rowCount[repDiscs[discName].sec]--
                                }
                            else if (_.findKey(charData.otherdiscs, v => v.includes(discAbv)))
                                otherDiscs.push([discName, D.Int(_.findKey(charData.otherdiscs, v => v.includes(discAbv)))])

                        }
                        while (otherDiscs.length) {
                            const thisDisc = otherDiscs.pop(),
                                targetSec = _.min([{sec: "discleft", num: rowCount.discleft}, {sec: "discmid", num: rowCount.discmid}, {sec: "discright", num: rowCount.discright}], v => v.num).sec
                            // D.Alert(`D.MakeRow(ID, ${targetSec}, {disc_name: ${thisDisc[0]}, disc: ${thisDisc[1]} })`)
                            rowCount[targetSec]++
                            D.MakeRow(charID, targetSec, {disc_name: thisDisc[0], disc: thisDisc[1]})
                        }
                    }
                }
                attrList.roll_array = ""
                attrList.rollpooldisplay = ""
                setAttrs(charID, attrList, {}, () => {
                    // D.Alert("Callback Function Passed!")
                    setAttrs(charID, {hunger: Math.max(1, D.Int(getAttrByName("bp_slakekill")))})
                })
                D.Alert(`ATTRLIST FOR ${D.GetName(charID)}:<br><br>${D.JS(attrList)}`)
            }
            D.Alert(`Error Log:<br>${D.JS(errorLog)}`, "CHARS: setNPCStats()")
        }
    // #endregion

    return {
        CheckInstall: checkInstall,
        OnChatCall: onChatCall,
        OnAttrChange: onAttrChange,
        OnAttrAdd: onAttrAdd,        

        REGISTRY,
        TogglePC: togglePlayerChar,
        SetNPC: setCharNPC,
        Damage: adjustDamage,
        AdjustTrait: adjustTrait,
        AdjustHunger: adjustHunger,
        RefreshWillpower: refreshWillpower,
        DaySleep: daysleep,
        AwardXP: awardXP,
        LaunchProject: launchProject,
        SendHome: sendCharsHome,
        SendBack: restoreCharsPos,
        PromptTraitSelect: promptTraitSelect,
        RefreshDisplays: () => { displayDesires(); displayResources(); displayStakes(); updateHunger() },
        get SelectedChar() { 
            if (STATEREF.charSelection) {
                const charObj = getObj("character", STATEREF.charSelection)
                delete STATEREF.charSelection
                return charObj
            } else {
                return false
            }
        },
        get SelectedTraits() {
            const selTraits = [...STATEREF.traitSelection]
            STATEREF.traitSelection = []
            Media.SetText("secretRollTraits", " ")
            return selTraits.length && selTraits || false
        }
    }
})()

on("ready", () => {
    Char.CheckInstall()
    D.Log("Char Ready!")
})
void MarkStop("Char")