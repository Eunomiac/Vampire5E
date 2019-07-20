void MarkStart("Char")
const Char = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Char",
        CHATCOMMAND = "!char",
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
                if (msg.type === "api" && (!GMONLY || playerIsGM(msg.playerid)) && (!CHATCOMMAND || args.shift() === CHATCOMMAND)) {
                    const who = msg.who || "API",
                        call = args.shift()
                    handleInput(msg, who, call, args)
                }
            })
            on("change:attribute:current", handleChangeAttr)
            on("add:attribute", handleAddAttr)
        }
    // #endregion

    // #region LOCAL INITIALIZATION
    const initialize = () => {
        STATEREF.registry = STATEREF.registry || {}
        STATEREF.weeklyResources = STATEREF.weeklyResources || {}

        // Storyteller Override:
        //C.ROOT.Char.registry["1"].playerID = "-LLIBpH_GL5I-9lAOiw9"

        // Return Player Control:
        //C.ROOT.Char.registry["4"].playerID = "-LMGDbZCKw4bZk8ztfNf"
        //C.ROOT.Char.registry["3"].playerID = "-LN7lNnjuWmFuvVPW76H"
        //C.ROOT.Char.registry["2"].playerID = "-LN6n-fR8cSNR2E_N_3q"
        //C.ROOT.Char.registry["1"].playerID = "-LMGDQqIvyL87oIfrVDX"
        //C.ROOT.Char.registry["1"].famulusTokenID = "-Li_TTDHnKYob56yfijy"
    }
    // #endregion
    const sortFunc = (charRef, secName, idA, idB) => {
        const rowA = D.TextToNum(D.GetRepStat(charRef, secName, idA, "xp_session").val),
            rowB = D.TextToNum(D.GetRepStat(charRef, secName, idB, "xp_session").val)
        if (rowA === rowB)
            return parseInt(D.GetRepStat(charRef, secName, idB, "xp_award").val) - parseInt(D.GetRepStat(charRef, secName, idA, "xp_award").val)
        return rowA - rowB
    }

    // #region EVENT HANDLERS: (HANDLEINPUT)
    const handleInput = (msg, who, call, args) => { // eslint-disable-line no-unused-vars
            let [chars, params, attrList] = [[], [], []],
                charData = {},
                [amount, dmg] = [0, 0],
                [trait, dtype, attrString, playerObj, msgString] = new Array(6).fill(""),
                char = null,
                isHealing = false
            switch (call) {
                case "reg":
                    switch(args.shift().toLowerCase()) {
                        case "token":
                            if (msg.selected && msg.selected.length === 1 && args.length === 2)
                                registerToken(msg, args.shift(), "base")
                            else
                                THROW("Select a graphic object. Syntax: !char reg token <hostName> <srcName>", "!char reg")
                            break
                        case "weekly": case "resource": case "weeklyresource": {
                            const resInitial = args.shift().toUpperCase(),
                                resAmount = parseInt(args.pop()),
                                resName = args.join(" ")
                            regResource(resInitial, resName, resAmount)
                            break
                        }
                        case "char":
                            if (msg.selected && msg.selected[0])
                                registerChar(msg, parseInt(args.shift()), args.shift(), args.shift())
                            else
                                THROW("Select character tokens first!", "!char reg")
                            break
                        /* no default */
                    }
                    break
                case "unreg":
                    switch(args[0].toLowerCase()) {                        
                        case "weekly": case "resource": case "weeklyresource":
                            args.shift()
                            unregResource(args.shift(), parseInt(args.shift()))
                            break
                        case "char":
                            unregisterChar(args.shift())
                            break
                        /* no default */
                    }
                    break
                case "get":
                    switch (args.shift().toLowerCase()) {
                        case "reg": case "registry": case "registered":
                            D.Alert(REGISTRY, "Registered Player Characters")
                            break
                        case "stat":
                            trait = args.shift()
                            for (const char of D.GetChars("registered")) {
                                const statData = D.GetStat(char, trait, true) || D.GetRepStat(char, "*", null, trait, true)
                                if (VAL({array: statData}))
                                    params.push(`<span style="display: inline-block; width: 15%; margin-right: 3%;">${D.GetCharData(char).shortName}</span><span style="display: inline-block; width: 60%; margin-right: 3%;">${D.Capitalize(statData[1].get("name"), true)}</span><span style="display: inline-block; width: 15%; margin-right: 3%;">${parseInt(statData[0]) ? "●".repeat(parseInt(statData[0])) : "~"}</span>`)
                                else if (VAL({list: statData}))
                                    params.push(`<span style="display: inline-block; width: 15%; margin-right: 3%;">${D.GetCharData(char).shortName}</span><span style="display: inline-block; width: 60%; margin-right: 3%;">${D.Capitalize(statData.name, true)}</span><span style="display: inline-block; width: 15%; margin-right: 3%;">${parseInt(statData.val) ? "●".repeat(parseInt(statData.val)) : "~"}</span>`)
                                else
                                    params.push(`<span style="display: inline-block; width: 15%; margin-right: 3%;">${D.GetCharData(char).shortName}</span><span style="display: inline-block; width: 60%; margin-right: 3%;">~</span><span style="display: inline-block; width: 15%; margin-right: 3%;">~</span>`)
                            }
                            attrString = params.join("<br>")
                            D.Alert(attrString, `${D.Capitalize(trait)}:`)
                            break
                        case "charids":
                            chars = findObjs({
                                _type: "character"
                            })
                            msgString = ""
                            for (const char of chars)
                                msgString += `${D.GetName(char)}<span style="color: ${C.COLORS.brightred}; font-weight:bold;">@T</span>${char.id}<br>`
                            D.Alert(D.JS(msgString))
                            break
                        case "player":
                            charData = REGISTRY[args[0]]
                            playerObj = getObj("player", charData.playerID)
                            D.Alert(`<b>NAME:</b> ${charData.playerName} (${charData.playerID})<br><b>PLAYS:</b> ${charData.name} (${charData.id})<br><br><b>DATA:</b><br><br>${D.JS(playerObj)}`, `PLAYER #${args[0]} DATA`)
                            break
                            // no default
                    }
                    break
                case "set":
                    switch (args.shift().toLowerCase()) {
                        case "stakes":
                            displayStakes()
                            break
                        case "desire":
                            displayDesires()
                            break
                        case "attr":
                        case "attrs":
                        case "stat":
                        case "stats":
                            if (args[0].includes(":") && msg.selected && msg.selected[0]) {
                                char = D.GetChar(msg)
                            } else if (!args[0].includes(":")) {
                                char = D.GetChar(args.shift())
                            } else {
                                D.Alert("Select a character or provide a character reference first!", "CHARS:!set attr")
                                return
                            }
                            if (char) {
                                D.Alert(`Setting the following stats on ${char.get("name")}:<br><br>${D.JS(args.join(" ").replace(/[,|\s]\s*?/gu, "|").split("|"))}`)
                                for (const statpair of args.join(" ").replace(/[,|\s]\s*?/gu, "|").split("|"))
                                    attrList[statpair.split(":")[0]] = parseInt(statpair.split(":")[1]) || 0
                                setAttrs(char.id, attrList)
                            } else {
                                D.Alert("Unable to find character.", "CHARS:!set attr")
                            }
                            break
                            // no default
                    }
                    break
                case "xp": // !char xp Cost Session Message, with some character tokens selected.
                    chars = _.compact(D.GetChars(msg) || D.GetChars("registered"))
                    DB(`!char xp COMMAND RECEIVED<br><br>Characters: ${D.JS(_.map(chars, v => v.get("name")))}`, "awardXP")
                    if (chars) {
                        amount = parseInt(args.shift()) || 0
                        _.each(chars, (char) => {
                            if (awardXP(char, amount, args.join(" ")))
                                D.Alert(`${amount} XP awarded to ${D.GetName(char)}`, "CHARS:!char xp")
                            else
                                THROW(`FAILED to award ${JSON.stringify(amount)} XP to ${JSON.stringify(D.GetName(char))}`, "!char xp")
                        })
                    } else {
                        THROW("Select character tokens or register characters first!", "!char xp")
                    }
                    break
                case "heal":
                    isHealing = true
            // falls through
                case "dmg": case "damage":
                case "spend":
                    chars = D.GetChars(msg)
                    if (chars) {
                        trait = args.shift().toLowerCase();
                        [dtype, dmg] = [
                            ["hum", "humanity", "stain", "stains"].includes(trait) ? null : args.shift(),
                            (isHealing ? -1 : 1) * parseInt(args.shift()) || 0
                        ]
                        _.each(chars, (char) => {
                            if (adjustDamage(char, trait, dtype, dmg))
                                D.Alert(`Dealt ${D.JS(dmg)}${dtype ? ` ${D.JS(dtype)}` : ""} ${D.JS(trait)} damage to ${D.GetName(char)}`, "CHARS:!char dmg")
                            else
                                THROW(`FAILED to damage ${D.GetName(char)}`, "!char dmg")
                        })
                    } else {
                        THROW("Select character tokens first!", "!char dmg")
                    }
                    break
                
                case "rep":
                case "repeating":
                case "repeat":
                    switch (args.shift().toLowerCase()) {
                        case "copy":
                        case "copyrow":
                            if (msg.selected && msg.selected[0] && args.length === 3)
                                D.CopyToSec(msg, ...args)
                            break
                        case "sort":
                        case "sortrow":
                            if (msg.selected && msg.selected[0] && args.length === 2)
                                D.SortRepSec(msg, args.shift(), sortFunc)
                            break
                        case "split":
                        case "splitsecs":
                            if (msg.selected && msg.selected[0] && args.length >= 3)
                                D.SplitRepSec(msg, args.shift(), args.shift(), sortFunc, args[0] || null)
                            break
                    // no default
                    }
                    break                                
                case "weekly": case "resource": case "weeklyresource":
                    if (args[0] && args[0].length > 2)
                        switch (args.shift().toLowerCase()) {
                            case "reset":
                                resetResources()
                                break
                            case "change": case "adjust": case "spend": case "restore": case "refund":
                                adjustResource(args.shift().toUpperCase(), parseInt(args.shift()), parseInt(args.shift()))
                                break
                            default:
                                break
                        }
                    displayResources()
                    break
                case "defaults":
                    populateDefaults(args.shift())
                    break
                case "setnpcs":
                    setNPCStats(args.shift())
                    break
                case "changeattr":
                    changeAttrName(args.shift(), args.shift())
                    break
            // no default
            }
        },
        handleChangeAttr = (obj, prev) => {
            if (obj.get("current") !== prev.current) {
                D.Alert(`Detected change to '${obj.get("name").toLowerCase().replace(/^repeating_.*?_.*?_/gu, "")}'`)
                switch (obj.get("name").toLowerCase().replace(/^repeating_.*?_.*?_/gu, "")) {
                    case "hunger":
                        Media.Toggle(`Hunger${getAttrByName(obj.get("_characterid"), "sandboxquadrant")}_1`, true, obj.get("current"))
                        break
                    case "desire": case "_reporder_repeating_desire":
                        displayDesires()
                        break
                    case "projectstake1": case "projectstake2": case "projectstake3": case "projectstake1_name": case "projectstake2_name": case "projectstake3_name":
                        displayStakes()
                        break
                    /* no default */
                }
            }
        },
        handleAddAttr = (obj) => {
            if (obj.get("name").includes("projectstake"))
                displayStakes()
            else if (obj.get("name").includes("timeline"))
                sortTimeline(obj.get("_characterid"))
        }
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************
    const REGISTRY = STATEREF.registry

    // #region JSON Text Blocks
    /* eslint-disable-next-line quotes */
    const NPCSTATS = '{"-LNQHXkCj5qvPpMJRgaP": { "base": {"clan": "Tremere", "faction": "Camarilla", "generation": 8, "blood_potency": 6, "humanity": 3, "stains": 0 }, "attributes": { "strength": 3, "dexterity": 2, "stamina": 3, "charisma": 3, "manipulation": 3, "composure": 4, "intelligence": 6, "wits": 4, "resolve": 4 }, "skills": { "6": "OCC", "5": "AWA INT POL INS SUB", "4": "MEL ACA INV", "3": "BRA LED ETI", "2": "PER", "1": "SCI" }, "clandiscs": { "disc1": ["Auspex", 4], "disc2": ["Dominate", 5], "disc3": ["Blood Sorcery", 5] }, "otherdiscs": { "5": "", "4": "", "3": "PRE OBF", "2": "", "1": "" } },"-LNQFgr6-qOsG0YDON5o": { "base": {"clan": "Malkavian", "faction": "Anarch", "generation": 11, "blood_potency": 3, "humanity": 6, "stains": 0 }, "attributes": { "strength": 1, "dexterity": 2, "stamina": 2, "charisma": 3, "manipulation": 4, "composure": 2, "intelligence": 4, "wits": 5, "resolve": 2 }, "skills": { "6": "", "5": "INS AWA", "4": "SUB LED INV", "3": "LAR SUR POL", "2": "PER TEC ETI", "1": "ATH BRA MEL FIN" }, "clandiscs": { "disc1": ["Auspex", 4], "disc2": ["Dominate", 3], "disc3": ["Obfuscate", 4] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "CEL", "1": "" } },"-LNQFwYKATjHDhiO_SaO": { "base": {"clan": "Malkavian", "faction": "Anarch", "generation": 12, "blood_potency": 2, "humanity": 6, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 3, "stamina": 2, "charisma": 3, "manipulation": 4, "composure": 3, "intelligence": 2, "wits": 2, "resolve": 1 }, "skills": { "6": "", "5": "PER", "4": "SUB", "3": "INS ATH", "2": "INV AWA STR", "1": "BRA STL DRV" }, "clandiscs": { "disc1": ["Auspex", 0], "disc2": ["Dominate", 4], "disc3": ["Obfuscate", 2] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LNQFyJ-TyDfOrdNSi_o": { "base": {"clan": "Brujah", "faction": "Anarch", "generation": 11, "blood_potency": 2, "humanity": 7, "stains": 0 }, "attributes": { "strength": 4, "dexterity": 3, "stamina": 3, "charisma": 2, "manipulation": 3, "composure": 2, "intelligence": 2, "wits": 1, "resolve": 2 }, "skills": { "6": "", "5": "", "4": "", "3": "SUB INS", "2": "PRF STR ATH ETI LAR ACA POL PER", "1": "AWA MEL TEC FIN SUR FIR DRV MED INV" }, "clandiscs": { "disc1": ["Celerity", 1], "disc2": ["Presence", 3], "disc3": ["Potence", 2] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LNQFw2N0ga48U9Topv6": { "base": {"clan": "Malkavian", "faction": "Anarch", "generation": 9, "blood_potency": 5, "humanity": 8, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 4, "stamina": 2, "charisma": 1, "manipulation": 2, "composure": 2, "intelligence": 5, "wits": 4, "resolve": 2 }, "skills": { "6": "", "5": "", "4": "OCC INS", "3": "STL ACA POL STR", "2": "ATH SUB FIN MED SCI", "1": "BRA LAR MEL INT LED PER SUR DRV TEC ETI" }, "clandiscs": { "disc1": ["Auspex", 4], "disc2": ["Dominate", 1], "disc3": ["Obfuscate", 3] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "FOR" } },"-LNQHYdq6TiLMFGVmmW6": { "base": {"clan": "Nosferatu", "faction": "Camarilla", "generation": 10, "blood_potency": 3, "humanity": 8, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 2, "stamina": 4, "charisma": 1, "manipulation": 1, "composure": 3, "intelligence": 3, "wits": 3, "resolve": 5 }, "skills": { "6": "", "5": "INV", "4": "AWA BRA INS", "3": "MEL STR LED", "2": "STE TEC ANK INT POL", "1": "ATH FIR SUR SUB" }, "clandiscs": { "disc1": ["Animalism", 2], "disc2": ["Obfuscate", 4], "disc3": ["Potence", 3] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LNQG0wxWA3u5Ec_eYzq": { "base": {"clan": "Nosferatu", "faction": "Anarch", "generation": 9, "blood_potency": 4, "humanity": 6, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 1, "stamina": 2, "charisma": 3, "manipulation": 4, "composure": 5, "intelligence": 2, "wits": 4, "resolve": 2 }, "skills": { "6": "", "5": "INS PER POL", "4": "ANK SUB", "3": "LED ACA", "2": "STL MEL", "1": "ATH INV" }, "clandiscs": { "disc1": ["Animalism", 4], "disc2": ["Obfuscate", 3], "disc3": ["Potence", 2] }, "otherdiscs": { "5": "", "4": "", "3": "PRE", "2": "", "1": "" } },"-LWe9buk5mborjCgeb95": { "base": {"clan": "Thin-Blooded", "faction": "Anarch", "generation": 14, "blood_potency": 0, "humanity": 9, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 2, "stamina": 3, "charisma": 2, "manipulation": 1, "composure": 2, "intelligence": 4, "wits": 3, "resolve": 3 }, "skills": { "6": "", "5": "", "4": "SCI", "3": "OCC ACA TEC", "2": "INV AWA MED", "1": "PER SUB STR" }, "clandiscs": { "disc1": ["Alchemy", 3], "disc2": [], "disc3": [] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LNQG0fyUU5WgN2IYaLo": { "base": {"clan": "Brujah", "faction": "Anarch", "generation": 12, "blood_potency": 1, "humanity": 7, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 2, "stamina": 3, "charisma": 4, "manipulation": 3, "composure": 3, "intelligence": 2, "wits": 1, "resolve": 2 }, "skills": { "6": "", "5": "", "4": "", "3": "PRF PER LED", "2": "INT AWA MEL POL SUB", "1": "ACA ETI INS STR BRA FIR INV" }, "clandiscs": { "disc1": ["Celerity", 1], "disc2": ["Presence", 2], "disc3": ["Potence", 1] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LNQG0N7ZGUK1zMpm6Zx": { "base": {"clan": "Malkavian", "faction": "Anarch", "generation": 13, "blood_potency": 1, "humanity": 7, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 2, "stamina": 1, "charisma": 1, "manipulation": 4, "composure": 2, "intelligence": 4, "wits": 2, "resolve": 4 }, "skills": { "6": "", "5": "", "4": "INS", "3": "ACA OCC POL", "2": "FIN MED INV", "1": "STR SUB PER" }, "clandiscs": { "disc1": ["Auspex", 1], "disc2": ["Dominate", 1], "disc3": ["Obfuscate", 0] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "SOR PTN" } },"-LNQG04sy2d4LNugi8xE": { "base": {"clan": "Toreador", "faction": "Anarch", "generation": 11, "blood_potency": 1, "humanity": 6, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 3, "stamina": 2, "charisma": 4, "manipulation": 4, "composure": 2, "intelligence": 2, "wits": 2, "resolve": 1 }, "skills": { "6": "", "5": "", "4": "ETI", "3": "PER SUB POL", "2": "INS LED INV FIN", "1": "ATH BRA MEL LAR INT AWA TEC" }, "clandiscs": { "disc1": ["Auspex", 1], "disc2": ["Celerity", 2], "disc3": ["Presence", 3] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LNQFzHYmcnDqQSytLhP": { "base": {"clan": "Brujah", "faction": "Anarch", "generation": 11, "blood_potency": 2, "humanity": 6, "stains": 0 }, "attributes": { "strength": 4, "dexterity": 3, "stamina": 3, "charisma": 2, "manipulation": 1, "composure": 2, "intelligence": 3, "wits": 2, "resolve": 2 }, "skills": { "6": "", "5": "", "4": "BRA", "3": "ATH STR LED", "2": "AWA INV MEL STL", "1": "DRV FIR LAR POL INS INT SUR" }, "clandiscs": { "disc1": ["Celerity", 2], "disc2": ["Presence", 1], "disc3": ["Potence", 3] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LNQG-Q_Zvl0YZlCIzcQ": { "base": {"clan": "Gangrel", "faction": "Anarch", "generation": 11, "blood_potency": 2, "humanity": 5, "stains": 0 }, "attributes": { "strength": 3, "dexterity": 3, "stamina": 4, "charisma": 1, "manipulation": 2, "composure": 2, "intelligence": 2, "wits": 2, "resolve": 3 }, "skills": { "6": "", "5": "", "4": "ATH", "3": "BRA MEL STR", "2": "SUR STL ANI", "1": "AWA INV LAR" }, "clandiscs": { "disc1": ["Animalism", 1], "disc2": ["Fortitude", 0], "disc3": ["Protean", 3] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LNQG-8UJao43g8Hd2Fl": { "base": {"clan": "Gangrel", "faction": "Anarch", "generation": 11, "blood_potency": 3, "humanity": 5, "stains": 0 }, "attributes": { "strength": 3, "dexterity": 5, "stamina": 2, "charisma": 2, "manipulation": 1, "composure": 2, "intelligence": 2, "wits": 2, "resolve": 3 }, "skills": { "6": "", "5": "MEL", "4": "ATH", "3": "STR LAR", "2": "INS INT BRA", "1": "INV MED SUR" }, "clandiscs": { "disc1": ["Animalism", 2], "disc2": ["Fortitude", 0], "disc3": ["Protean", 4] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LNQFzrFI1aP3xdVYFVY": { "base": {"clan": "Gangrel", "faction": "Anarch", "generation": 11, "blood_potency": 2, "humanity": 6, "stains": 0 }, "attributes": { "strength": 3, "dexterity": 2, "stamina": 2, "charisma": 3, "manipulation": 4, "composure": 3, "intelligence": 2, "wits": 1, "resolve": 2 }, "skills": { "6": "", "5": "", "4": "", "3": "PRF SUB INS", "2": "ATH MEL ANI INT INV", "1": "AWA BRA LAR STL SUR ANK PER" }, "clandiscs": { "disc1": ["Animalism", 2], "disc2": ["Fortitude", 1], "disc3": ["Protean", 1] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LNQFz_V0ms41yrxwJ1x": { "base": {"clan": "Malkavian", "faction": "Anarch", "generation": 6, "blood_potency": 4, "humanity": 7, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 3, "stamina": 3, "charisma": 4, "manipulation": 6, "composure": 5, "intelligence": 3, "wits": 3, "resolve": 5 }, "skills": { "6": "SUB", "5": "INS STL", "4": "ETI STR ACA AWA OCC", "3": "BRA MEL ATH INV", "2": "FIN POL LAR SUR PER TEC", "1": "CRA MED LED SCI FIR DRV" }, "clandiscs": { "disc1": ["Auspex", 4], "disc2": ["Dominate", 5], "disc3": ["Obfuscate", 5] }, "otherdiscs": { "5": "", "4": "PTN", "3": "FOR", "2": "CEL", "1": "ANI" } },"-LNQFtzeAa6FUgB4pO1R": { "base": {"clan": "Brujah", "faction": "Anarch", "generation": 11, "blood_potency": 2, "humanity": 5, "stains": 0 }, "attributes": { "strength": 3, "dexterity": 2, "stamina": 2, "charisma": 4, "manipulation": 2, "composure": 4, "intelligence": 2, "wits": 1, "resolve": 2 }, "clandiscs": { "disc1": ["Celerity", 2], "disc2": ["Presence", 2], "disc3": ["Potence", 4] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LNQFtYW-m47AqMuMI4X": { "base": {"clan": "Malkavian", "faction": "Anarch", "generation": 13, "blood_potency": 1, "humanity": 5, "stains": 0 }, "attributes": { "strength": 3, "dexterity": 3, "stamina": 2, "charisma": 1, "manipulation": 2, "composure": 2, "intelligence": 4, "wits": 3, "resolve": 2 }, "clandiscs": { "disc1": ["Auspex", 1], "disc2": ["Dominate", 0], "disc3": ["Obfuscate", 2] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "ANI", "1": "POT" } },"-LNQFt37ROBDaLQ3aZuT": { "base": {"clan": "Nosferatu", "faction": "Anarch", "generation": 13, "blood_potency": 1, "humanity": 3, "stains": 0 }, "attributes": { "strength": 4, "dexterity": 3, "stamina": 3, "charisma": 1, "manipulation": 2, "composure": 2, "intelligence": 3, "wits": 2, "resolve": 2 }, "clandiscs": { "disc1": ["Animalism", 1], "disc2": ["Obfuscate", 1], "disc3": ["Potence", 1] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "PTN" } },"-LNQFxShAsElf1Qy5xv_": { "base": {"clan": "Gangrel", "faction": "Anarch", "generation": 13, "blood_potency": 2, "humanity": 6, "stains": 0 }, "attributes": { "strength": 4, "dexterity": 3, "stamina": 3, "charisma": 2, "manipulation": 1, "composure": 2, "intelligence": 2, "wits": 2, "resolve": 3 }, "clandiscs": { "disc1": ["Animalism", 0], "disc2": ["Fortitude", 2], "disc3": ["Protean", 4] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "POT", "1": "" } },"-LNQFxo7w4eJYFQYNeZd": { "base": {"clan": "Gangrel", "faction": "Anarch", "generation": 13, "blood_potency": 1, "humanity": 6, "stains": 0 }, "attributes": { "strength": 3, "dexterity": 4, "stamina": 3, "charisma": 2, "manipulation": 1, "composure": 2, "intelligence": 2, "wits": 2, "resolve": 3 }, "clandiscs": { "disc1": ["Animalism", 0], "disc2": ["Fortitude", 3], "disc3": ["Protean", 1] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LWeAmvEEK2_kLoCN2w_": { "base": {"clan": "Thin-Blooded", "faction": "Anarch", "generation": 14, "blood_potency": 0, "humanity": 6, "stains": 0 }, "attributes": { "strength": 4, "dexterity": 3, "stamina": 3, "charisma": 2, "manipulation": 3, "composure": 2, "intelligence": 1, "wits": 2, "resolve": 2 }, "clandiscs": { "disc1": ["Alchemy", 1], "disc2": [], "disc3": [] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LWeAY-ePMjLtV6xSs6h": { "base": {"clan": "Thin-Blooded", "faction": "Anarch", "generation": 14, "blood_potency": 0, "humanity": 7, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 2, "stamina": 3, "charisma": 3, "manipulation": 3, "composure": 2, "intelligence": 2, "wits": 4, "resolve": 1 }, "clandiscs": { "disc1": ["Alchemy", 1], "disc2": [], "disc3": [] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LTJM_n4VcZzmFKjWG74": { "base": {"clan": "Ministry", "faction": "Anarch", "generation": 9, "blood_potency": 5, "humanity": 6, "stains": 0 }, "attributes": { "strength": 1, "dexterity": 3, "stamina": 2, "charisma": 5, "manipulation": 3, "composure": 4, "intelligence": 2, "wits": 4, "resolve": 2 }, "skills": { "6": "", "5": "INS PER SUB STR", "4": "STL ETI LED", "3": "OCC", "2": "MEL", "1": "POL MED" }, "clandiscs": { "disc1": ["Obfuscate", 2], "disc2": ["Presence", 4], "disc3": ["Protean", 3] }, "otherdiscs": { "5": "AUS", "4": "", "3": "", "2": "", "1": "CEL" } },"-LTJMSdW7fIoXAFfKcET": { "base": {"clan": "Ministry", "faction": "Anarch", "generation": 10, "blood_potency": 3, "humanity": 6, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 2, "stamina": 1, "charisma": 4, "manipulation": 3, "composure": 3, "intelligence": 3, "wits": 2, "resolve": 2 }, "skills": { "6": "", "5": "INS", "4": "PER SUB", "3": "STL MEL", "2": "STR OCC", "1": "ATH BRA DRV" }, "clandiscs": { "disc1": ["Obfuscate", 1], "disc2": ["Presence", 3], "disc3": ["Protean", 4] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LTJMWxeANEe12WCfXtm": { "base": {"clan": "Ministry", "faction": "Anarch", "generation": 10, "blood_potency": 3, "humanity": 4, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 2, "stamina": 1, "charisma": 4, "manipulation": 5, "composure": 3, "intelligence": 4, "wits": 2, "resolve": 2 }, "skills": { "6": "", "5": "SUB ETI PER", "4": "INS STL", "3": "INT LAR", "2": "ATH STR", "1": "POL" }, "clandiscs": { "disc1": ["Obfuscate", 1], "disc2": ["Presence", 4], "disc3": ["Protean", 3] }, "otherdiscs": { "5": "", "4": "", "3": "AUS", "2": "", "1": "" } },"-LTJMKmVLVu5OazFXbUo": { "base": {"clan": "Ministry", "faction": "Anarch", "generation": 10, "blood_potency": 3, "humanity": 9, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 3, "stamina": 2, "charisma": 4, "manipulation": 3, "composure": 3, "intelligence": 2, "wits": 2, "resolve": 1 }, "skills": { "6": "", "5": "PER", "4": "PRF ", "3": "ETI INS", "2": "AWA SUB STL", "1": "BRA FIR DRV" }, "clandiscs": { "disc1": ["Obfuscate", 0], "disc2": ["Presence", 4], "disc3": ["Protean", 2] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LU7pcmKytkmcej5SH9c": { "base": {"clan": "Brujah", "faction": "Anarch", "generation": 12, "blood_potency": 1, "humanity": 9, "stains": 0 }, "attributes": { "strength": 3, "dexterity": 3, "stamina": 3, "charisma": 2, "manipulation": 1, "composure": 2, "intelligence": 2, "wits": 2, "resolve": 4 }, "skills": { "6": "", "5": "", "4": "MEL", "3": "INT ATH OCC", "2": "STR LED PER FIR", "1": "BRA ACA AWA ETI ANI TEC INV" }, "clandiscs": { "disc1": ["Celerity", 2], "disc2": ["Presence", 1], "disc3": ["Potence", 3] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LNQFvl-ktzpXfhkW8ZQ": { "base": {"clan": "Brujah", "faction": "Anarch", "generation": 12, "blood_potency": 2, "humanity": 7, "stains": 0 }, "attributes": { "strength": 3, "dexterity": 3, "stamina": 4, "charisma": 2, "manipulation": 1, "composure": 2, "intelligence": 2, "wits": 2, "resolve": 3 }, "clandiscs": { "disc1": ["Celerity", 2], "disc2": ["Presence", 1], "disc3": ["Potence", 1] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LNQFv8D4hqgpkRNVb8I": { "base": {"clan": "Nosferatu", "faction": "Anarch", "generation": 12, "blood_potency": 2, "humanity": 7, "stains": 0 }, "attributes": { "strength": 3, "dexterity": 4, "stamina": 3, "charisma": 1, "manipulation": 2, "composure": 2, "intelligence": 2, "wits": 3, "resolve": 2 }, "clandiscs": { "disc1": ["Animalism", 0], "disc2": ["Obfuscate", 3], "disc3": ["Potence", 0] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "CEL" } },"-LNQFvRGMoiNF54OL3wL": { "base": {"clan": "Gangrel", "faction": "Anarch", "generation": 12, "blood_potency": 2, "humanity": 6, "stains": 0 }, "attributes": { "strength": 3, "dexterity": 3, "stamina": 4, "charisma": 2, "manipulation": 2, "composure": 2, "intelligence": 3, "wits": 1, "resolve": 2 }, "clandiscs": { "disc1": ["Animalism", 1], "disc2": ["Fortitude", 1], "disc3": ["Protean", 2] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LWeQPMwOtwmjU_CY-uE": { "base": {"clan": "Nosferatu", "faction": "Camarilla", "generation": 8, "blood_potency": 4, "humanity": 5, "stains": 0 }, "attributes": { "strength": 4, "dexterity": 3, "stamina": 4, "charisma": 3, "manipulation": 2, "composure": 3, "intelligence": 6, "wits": 3, "resolve": 4 }, "clandiscs": { "disc1": ["Animalism", 4], "disc2": ["Obfuscate", 5], "disc3": ["Potence", 4] }, "otherdiscs": { "5": "", "4": "", "3": "CEL", "2": "DOM", "1": "FOR AUS" } },"-LYxow0RcEaAl2B-nZBK": { "base": {"clan": "Banu Haqim", "faction": "Camarilla", "generation": 7, "blood_potency": 6, "humanity": 5, "stains": 0 }, "attributes": { "strength": 3, "dexterity": 4, "stamina": 3, "charisma": 3, "manipulation": 3, "composure": 4, "intelligence": 6, "wits": 2, "resolve": 4 }, "clandiscs": { "disc1": ["Celerity", 5], "disc2": ["Obfuscate", 5], "disc3": ["Blood Sorcery", 4] }, "otherdiscs": { "5": "", "4": "", "3": "POT FOR", "2": "", "1": "" } },"-LYxov6gTCWlZO86Jlw2": { "base": {"clan": "Banu Haqim", "faction": "Camarilla", "generation": 8, "blood_potency": 5, "humanity": 5, "stains": 0 }, "attributes": { "strength": 4, "dexterity": 5, "stamina": 2, "charisma": 3, "manipulation": 2, "composure": 2, "intelligence": 4, "wits": 2, "resolve": 1 }, "skills": { "6": "", "5": "MEL", "4": "STL ACA OCC", "3": "ATH POL INV LAR", "2": "", "1": "" }, "clandiscs": { "disc1": ["Celerity", 4], "disc2": ["Obfuscate", 3], "disc3": ["Blood Sorcery", 2] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "POT FOR" } },"-LNQHYKTacAmhlW7G87N": { "base": {"clan": "Ventrue", "faction": "Camarilla", "generation": 9, "blood_potency": 4, "humanity": 6, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 2, "stamina": 2, "charisma": 5, "manipulation": 3, "composure": 4, "intelligence": 3, "wits": 1, "resolve": 4 }, "skills": { "6": "", "5": "LED POL SUB INS", "4": "PER ETI FIR", "3": "AWA", "2": "INT", "1": "MEL" }, "clandiscs": { "disc1": ["Dominate", 4], "disc2": ["Fortitude", 3], "disc3": ["Presence", 5] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "AUS", "1": "CEL" } },"-LPNSsmxNeokaKtssoE1": { "base": {"clan": "Tremere", "faction": "Camarilla", "generation": 9, "blood_potency": 4, "humanity": 6, "stains": 0 }, "attributes": { "strength": 5, "dexterity": 4, "stamina": 2, "charisma": 2, "manipulation": 2, "composure": 2, "intelligence": 3, "wits": 1, "resolve": 4 }, "skills": { "6": "", "5": "MEL", "4": "OCC INT STL", "3": "INS STR SUB INV", "2": "SUR ETI POL", "1": "ATH BRA LAR AWA" }, "clandiscs": { "disc1": ["Auspex", 1], "disc2": ["Dominate", 4], "disc3": ["Blood Sorcery", 2] }, "otherdiscs": { "5": "", "4": "", "3": "CEL", "2": "", "1": "POT" } },"-LWeQO4py4GrquBo2Gck": { "base": {"clan": "Nosferatu", "faction": "Camarilla", "generation": 10, "blood_potency": 3, "humanity": 5, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 5, "stamina": 3, "charisma": 1, "manipulation": 2, "composure": 2, "intelligence": 4, "wits": 4, "resolve": 2 }, "skills": { "6": "", "5": "MEL ATH STL", "4": "INS SUB AWA", "3": "INV STR", "2": "LAR", "1": "SUR BRA" }, "clandiscs": { "disc1": ["Animalism", 3], "disc2": ["Obfuscate", 4], "disc3": ["Potence", 3] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "CEL FOR PTN" } },"-LWeQNOKb98WrdeMY_OZ": { "base": {"clan": "Nosferatu", "faction": "Camarilla", "generation": 10, "blood_potency": 3, "humanity": 5, "stains": 0 }, "attributes": { "strength": 1, "dexterity": 3, "stamina": 2, "charisma": 5, "manipulation": 2, "composure": 3, "intelligence": 2, "wits": 4, "resolve": 2 }, "clandiscs": { "disc1": ["Animalism", 2], "disc2": ["Obfuscate", 3], "disc3": ["Potence", 1] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "PRE", "1": "DOM" } },"-LV_h7g8eC2VrHbM8iXi": { "base": {"clan": "Toreador", "faction": "Camarilla", "generation": 12, "blood_potency": 1, "humanity": 6, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 2, "stamina": 1, "charisma": 4, "manipulation": 3, "composure": 2, "intelligence": 3, "wits": 3, "resolve": 2 }, "clandiscs": { "disc1": ["Auspex", 2], "disc2": ["Celerity", 1], "disc3": ["Presence", 3] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LV_h7H_YjGXLpmW0aiR": { "base": {"clan": "Ventrue", "faction": "Camarilla", "generation": 11, "blood_potency": 3, "humanity": 6, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 2, "stamina": 2, "charisma": 3, "manipulation": 4, "composure": 3, "intelligence": 3, "wits": 2, "resolve": 1 }, "clandiscs": { "disc1": ["Dominate", 4], "disc2": ["Fortitude", 1], "disc3": ["Presence", 3] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LWeQOc-Gvu8OuQTIwqO": { "base": {"clan": "Nosferatu", "faction": "Camarilla", "generation": 12, "blood_potency": 2 } },"-LWeCAgTYMRyw0wkup2b": { "base": {"clan": "Nosferatu", "faction": "Camarilla", "generation": 12, "blood_potency": 2 } },"-LWeCA5hHOkeh4_2JwBa": { "base": {"clan": "Nosferatu", "faction": "Camarilla", "generation": 13, "blood_potency": 1 } },"-LWeC9aDbH63n7oD8e9z": { "base": {"clan": "Nosferatu", "faction": "Camarilla", "generation": 13, "blood_potency": 1 } },"-LWeRWzQ91Fp8DxQHuxU": { "base": {"clan": "Lasombra", "faction": "Sabbat", "generation": 10, "blood_potency": 4, "humanity": 5, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 3, "stamina": 2, "charisma": 2, "manipulation": 3, "composure": 1, "intelligence": 4, "wits": 3, "resolve": 2 }, "clandiscs": { "disc1": ["Dominate", 0], "disc2": ["Oblivion", 4], "disc3": ["Potence", 0] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "OBF", "1": "" } },"-LWeRVv36yuBjWcAJ8Mh": { "base": {"clan": "Nosferatu", "faction": "Sabbat", "generation": 10, "blood_potency": 4, "humanity": 3, "stains": 0 }, "attributes": { "strength": 3, "dexterity": 3, "stamina": 4, "charisma": 1, "manipulation": 2, "composure": 2, "intelligence": 2, "wits": 2, "resolve": 3 }, "clandiscs": { "disc1": ["Animalism", 0], "disc2": ["Obfuscate", 4], "disc3": ["Potence", 2] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LWeRLFK7B44jj-N079k": { "base": {"clan": "Banu Haqim", "faction": "Autarkis", "generation": 7, "blood_potency": 6, "humanity": 4, "stains": 0 }, "attributes": { "strength": 4, "dexterity": 6, "stamina": 5, "charisma": 2, "manipulation": 3, "composure": 3, "intelligence": 5, "wits": 3, "resolve": 3 }, "clandiscs": { "disc1": ["Celerity", 4], "disc2": ["Obfuscate", 5], "disc3": ["Blood Sorcery", 5] }, "otherdiscs": { "5": "", "4": "POT", "3": "FOR", "2": "AUS", "1": "PTN" } },"-LWeRKYQh6q3a09MGYug": { "base": {"clan": "Nosferatu", "faction": "Autarkis", "generation": 7, "blood_potency": 7, "humanity": 1, "stains": 0 }, "attributes": { "strength": 6, "dexterity": 5, "stamina": 5, "charisma": 3, "manipulation": 3, "composure": 3, "intelligence": 2, "wits": 3, "resolve": 4 }, "clandiscs": { "disc1": ["Animalism", 5], "disc2": ["Obfuscate", 5], "disc3": ["Potence", 5] }, "otherdiscs": { "5": "", "4": "PTN", "3": "FOR", "2": "CEL", "1": "" } },"-LW8juZsciktrgdbmAl1": { "base": {"clan": "Tremere", "faction": "Camarilla", "generation": 13, "blood_potency": 2, "humanity": 7, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 1, "stamina": 2, "charisma": 2, "manipulation": 3, "composure": 2, "intelligence": 4, "wits": 3, "resolve": 3 }, "skills": { "6": "", "5": "OCC", "4": "SUB", "3": "POL ETI", "2": "ATH INV PER", "1": "INS FIR STL" }, "clandiscs": { "disc1": ["Auspex", 2], "disc2": ["Dominate", 0], "disc3": ["Blood Sorcery", 4] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-Lc5WJzKsCsYxGqv4vvV": { "base": {"clan": "Tzimisce", "faction": "Sabbat", "generation": 6, "blood_potency": 8, "humanity": 3, "stains": 0 }, "attributes": { "strength": 4, "dexterity": 4, "stamina": 3, "charisma": 6, "manipulation": 5, "composure": 5, "intelligence": 5, "wits": 4, "resolve": 3 }, "skills": { "6": "MED ACA", "5": "MEL OCC POL AWA INT SUB", "4": "ETI INV", "3": "LED PER", "2": "STL ATH", "1": "ANI" }, "clandiscs": { "disc1": ["Animalism", 3], "disc2": ["Auspex", 5], "disc3": ["Vicissitude", 5] }, "otherdiscs": { "5": "DOM", "4": "PRE SOR", "3": "CEL", "2": "FOR", "1": "" } },"-Lbu3wurxt5lHXWMIC73": { "base": {"clan": "Lasombra", "faction": "Sabbat", "generation": 7, "blood_potency": 7, "humanity": 3, "stains": 0 }, "attributes": { "strength": 5, "dexterity": 4, "stamina": 5, "charisma": 4, "manipulation": 3, "composure": 4, "intelligence": 3, "wits": 5, "resolve": 4 }, "skills": { "6": "BRA STL", "5": "SUB OCC MEL LED POL ETI", "4": "ATH PER", "3": "SEC ACA", "2": "DRV LAR", "1": "INV" }, "clandiscs": { "disc1": ["Dominate", 5], "disc2": ["Oblivion", 5], "disc3": ["Potence", 5] }, "otherdiscs": { "5": "", "4": "FOR", "3": "CEL", "2": "PTN", "1": "" } }}',
        /* eslint-disable-next-line quotes */
        NPCDEFAULTS = '{"tab_core": 1, "tab_type": 1, "bonus_health": 0, "bonus_willpower": 0, "bonus_bp": 0, "marquee_title": "", "marquee_lines_toggle": 0, "marquee": "", "marquee_tracker": "", "character_name": "", "char_dobdoe": "", "bane_title": "", "bane_text": "", "clan": 0, "faction": 0, "generation": 0, "predator": 0, "hunger": 1, "resonance": 0, "res_discs": " ", "rollflagdisplay": "", "rollparams": "", "rollpooldisplay": "", "rollmod": 0, "rolldiff": 0, "applydisc": 0, "applybloodsurge": 0, "applyspecialty": 0, "applyresonance": 0, "incap": "", "rollarray": "", "dyscrasias_toggle": 0, "dyscrasias": "", "compulsion_toggle": 0, "compulsion": "", "groupdetails": "", "health": 0, "health_max": 10, "health_sdmg": 0, "health_admg": 0, "health_impair_toggle": 0, "health_1": 0, "health_2": 0, "health_3": 0, "health_4": 0, "health_5": 0, "health_6": 0, "health_7": 0, "health_8": 0, "health_9": 0, "health_10": 0, "health_11": 0, "health_12": 0, "health_13": 0, "health_14": 0, "health_15": 0, "willpower": 0, "willpower_max": 10, "willpower_sdmg": 0, "willpower_admg": 0, "willpower_impair_toggle": 0, "willpower_1": 0, "willpower_2": 0, "willpower_3": 0, "willpower_4": 0, "willpower_5": 0, "willpower_6": 0, "willpower_7": 0, "willpower_8": 0, "willpower_9": 0, "willpower_10": 0, "bp_surgetext": "", "bp_mendtext": "", "bp_discbonustext": "", "bp_baneseverity": 0, "bp_slaketext": "", "bp_mend": "", "bp_discbonus": 0, "bp_rousereroll": "", "bp_slakeanimal": "", "bp_slakebag": "", "bp_slakehuman": "", "bp_slakekill": "", "blood_potency": 1, "blood_potency_max": 1, "stains": 0, "humanity": 7, "humanity_max": 10, "humanity_impair_toggle": 0, "humanity_1": 2, "humanity_2": 2, "humanity_3": 2, "humanity_4": 2, "humanity_5": 2, "humanity_6": 2, "humanity_7": 2, "humanity_8": 1, "humanity_9": 1, "humanity_10": 1, "strength_flag": 0, "strength": 1, "dexterity_flag": 0, "dexterity": 1, "stamina_flag": 0, "stamina": 1, "charisma_flag": 0, "charisma": 1, "manipulation_flag": 0, "manipulation": 1, "composure_flag": 0, "composure": 1, "intelligence_flag": 0, "intelligence": 1, "wits_flag": 0, "wits": 1, "resolve_flag": 0, "resolve": 1, "athletics_flag": 0, "athletics_spec": "", "athletics": 0, "brawl_flag": 0, "brawl_spec": "", "brawl": 0, "craft_flag": 0, "craft_spec": "", "craft": 0, "drive_flag": 0, "drive_spec": "", "drive": 0, "firearms_flag": 0, "firearms_spec": "", "firearms": 0, "melee_flag": 0, "melee_spec": "", "melee": 0, "larceny_flag": 0, "larceny_spec": "", "larceny": 0, "stealth_flag": 0, "stealth_spec": "", "stealth": 0, "survival_flag": 0, "survival_spec": "", "survival": 0, "animal_ken_flag": 0, "animal_ken_spec": "", "animal_ken": 0, "etiquette_flag": 0, "etiquette_spec": "", "etiquette": 0, "insight_flag": 0, "insight_spec": "", "insight": 0, "intimidation_flag": 0, "intimidation_spec": "", "intimidation": 0, "leadership_flag": 0, "leadership_spec": "", "leadership": 0, "performance_flag": 0, "performance_spec": "", "performance": 0, "persuasion_flag": 0, "persuasion_spec": "", "persuasion": 0, "streetwise_flag": 0, "streetwise_spec": "", "streetwise": 0, "subterfuge_flag": 0, "subterfuge_spec": "", "subterfuge": 0, "academics_flag": 0, "academics_spec": "", "academics": 0, "awareness_flag": 0, "awareness_spec": "", "awareness": 0, "finance_flag": 0, "finance_spec": "", "finance": 0, "investigation_flag": 0, "investigation_spec": "", "investigation": 0, "medicine_flag": 0, "medicine_spec": "", "medicine": 0, "occult_flag": 0, "occult_spec": "", "occult": 0, "politics_flag": 0, "politics_spec": "", "politics": 0, "science_flag": 0, "science_spec": "", "science": 0, "technology_flag": 0, "technology_spec": "", "technology": 0, "disc1_toggle": 0, "disc1_flag": 0, "disc1_name": "", "disc1": 0, "disc1power_toggle": 0, "disc1_1": "", "disc1_2": "", "disc1_3": "", "disc1_4": "", "disc1_5": "", "repstats": "", "disc2_toggle": 0, "disc2_flag": 0, "disc2_name": "", "disc2": 0, "disc2power_toggle": 0, "disc2_1": "", "disc2_2": "", "disc2_3": "", "disc2_4": "", "disc2_5": "", "disc3_toggle": 0, "disc3_flag": 0, "disc3_name": "", "disc3": 0, "disc3power_toggle": 0, "disc3_1": "", "disc3_2": "", "disc3_3": "", "disc3_4": "", "disc3_5": "", "rituals_toggle": 0, "formulae_toggle": 0, "distillation": 0, "domain_personal": "", "domain_haven": "", "domain_coterie": "", "domain_hunt": "", "assets_carried": "", "assets_stashed": "", "assets_vehicles": "", "assets_other": "", "mask_name": "", "mask": "", "char_dob": "", "char_doe": "", "mortal_ambition": "", "mortal_history": "", "date_today": 0, "repeatingprojectslist": "", "ambition": "", "xp_summary": "", "xp_earnedtotal": 0}'
    // #endregion

    // #region Register Characters & Token Image Alternates,
    const registerChar = (msg, num, shortName, initial) => {
            if (D.GetSelected(msg).length > 1) {
                THROW("Please select only one token.", "RegisterChar")
            } else {
                const char = D.GetChar(msg),
                    token = D.GetSelected(msg)[0],
                    charNum = num ? num : _.keys(REGISTRY).length + 1,
                    charID = char.id,
                    charName = D.GetName(char),
                    playerID = D.GetPlayerID(char),
                    playerName = D.GetName(D.GetPlayer(playerID))

                if (!char) {
                    THROW("No character found!", "RegisterChar")
                } else if (!token) {
                    THROW("Please select a character token.", "RegisterChar")
                } else {
                    REGISTRY[charNum] = {
                        id: charID,
                        name: charName,
                        playerID: playerID,
                        playerName: playerName,
                        tokenName: charName.replace(/["'\s]*/gu, "") + "Token",
                        shortName: shortName,
                        initial: initial
                    }
                    D.Alert(`Character #${D.JSL(charNum)} Registered:<br><br>${D.JS(REGISTRY[charNum])}`, "CHARS:RegisterChar")
                }
            }
        },
        registerToken = (msg, hostName, srcName) => {
            if (!Media.GetKey(hostName))
                THROW(`No image registered under ${hostName}`, "RegisterToken")
            else
                Media.AddSrc(msg, hostName, srcName)
        },
        unregisterChar = (nameRef) => {
            if (VAL({string: nameRef}, "unregisterChar")) {
                const regKey = _.findKey(REGISTRY, v => D.FuzzyMatch(v.name, nameRef))
                D.Alert(`nameRef: ${nameRef}<br>regKey: ${D.JS(regKey)}`, "unregisterChar")
                if (regKey >= 0 && REGISTRY[regKey])
                    delete REGISTRY[regKey]
            }
        }
    // #endregion

    // #region Awarding XP,
    const awardXP = (charRef, award, reason) => {
        DB(`Award XP Parameters: charRef: ${D.JS(charRef)}, Award: ${D.JS(award)}<br>Reason: ${D.JS(reason)}`, "awardXP")
        const charObj = D.GetChar(charRef)
        if (VAL({charObj: charObj}, "awardXP")) {
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
                D.Chat(charObj, C.CHATHTML.colorBlock([                    
                    C.CHATHTML.colorBody(`<b>FOR:</b> ${reason}`, C.STYLES.whiteMarble.body),
                    C.CHATHTML.colorHeader(`You Have Been Awarded ${D.NumToText(award, true)} XP.`, C.STYLES.whiteMarble.header),
                ], C.STYLES.whiteMarble.block))
                return true
            }
        }
        return false
    }
    // #endregion

    // #region Sandbox Displays: Desires, Advantages & Weekly Resources
    const displayDesires = () => {        
            for (const charData of _.values(Char.REGISTRY)) {
                const desireObj = Media.GetTextObj(`${charData.shortName}Desire`)
                if (VAL({textObj: desireObj}))
                    Media.SetText(desireObj, (D.GetRepStat(charData.id, "desire", null, "desire") || {val: ""}).val)
            }
        },
        regResource = (initial, name, amount) => {
            STATEREF.weeklyResources[initial.toUpperCase()] = STATEREF.weeklyResources[initial.toUpperCase()] || []
            STATEREF.weeklyResources[initial.toUpperCase()].push([name, 0, amount])
            displayResources()
        },
        unregResource = (initial, rowNum) => {
            if (STATEREF.weeklyResources[initial.toUpperCase()].length <= 1 && rowNum === 1)
                delete STATEREF.weeklyResources[initial.toUpperCase()]
            else
                STATEREF.weeklyResources[initial.toUpperCase()] = [..._.first(STATEREF.weeklyResources[initial.toUpperCase()], rowNum - 1), ..._.rest(STATEREF.weeklyResources[initial.toUpperCase()], rowNum)]
            displayResources()
        },
        adjustResource = (initial, rowNum, amount) => {
            const entry = STATEREF.weeklyResources[initial.toUpperCase()] && STATEREF.weeklyResources[initial.toUpperCase()][rowNum - 1]
            if (entry)
                entry[1] = Math.max(0, Math.min(entry[2], entry[1] + amount))
            D.Chat(D.GetChar(initial), C.CHATHTML.colorBlock([
                C.CHATHTML.colorHeader("Weekly Resource Updated", C.STYLES.whiteMarble.header),
                C.CHATHTML.colorBody(amount > 0 ? `${entry[0]} restored by ${amount} to ${entry[1]}/${entry[2]}` : `${Math.abs(amount)} ${entry[0]} spent, ${entry[2]-entry[1]} remaining.`, C.STYLES.whiteMarble.body)
            ]))
            displayResources()
        },
        resetResources = () => {
            _.each(STATEREF.weeklyResources, (data, init) => {
                STATEREF.weeklyResources[init] = _.map(STATEREF.weeklyResources[init], v => v[1] = 0)
                D.Chat(D.GetChar(init), C.CHATHTML.colorBlock([
                    C.CHATHTML.colorBody("Your weekly resources have been refreshed.", C.STYLES.whiteMarble.body)
                ], C.STYLES.whiteMarble.block))
            })
            displayResources()
        },
        displayResources = () => {
            const [col1Width, col2Width] = [35, 250],
                textObj = Media.GetTextObj("weeklyResources")
            let resStrings = []
            if (_.flatten(_.values(STATEREF.weeklyResources)).length === 0) {
                Media.SetText("weeklyResources", {text: " "})
            } else {
                _.each(STATEREF.weeklyResources, (data, init) => {
                    let thisString = `[${init}]`
                    _.each(data, v => {
                        DB(`thisString: ${D.JS(thisString)}, col1width: ${Media.GetTextWidth(textObj, thisString, false)}, col2width: ${Media.GetTextWidth(textObj, v[0], false)}`, "displayResources")
                        resStrings.push(`${thisString}${Media.Buffer(textObj, col1Width - Media.GetTextWidth(textObj, thisString, false))}${
                            v[0]}${Media.Buffer(textObj, col2Width - Media.GetTextWidth(textObj, v[0], false))}${
                            "●".repeat(v[2]-v[1])}${"○".repeat(v[1])}`)
                        thisString = " "
                    })
                })            
                Media.SetText("weeklyResources", resStrings.join("\n"))
            }
        },
        displayStakes = () => {
            const [col1Width, col2Width, col3Width] = [35, 250, 190],
                textObj = Media.GetTextObj("stakedAdvantages"),
                stakeData = [],
                stakeStrings = []
            for (const charObj of D.GetChars("registered")) {
                const projectStakes = []
                for (const attrName of ["projectstake1", "projectstake2", "projectstake3"])
                    projectStakes.push(...D.GetRepStats(charObj, "project", {projectstakes_toggle: "1"}, attrName))
                for (const stake of projectStakes) {
                    const advMax = (D.GetRepStat(charObj, "advantage", null, stake.name) || {val: null}).val,
                        endDate = (D.GetRepStat(charObj, "project", stake.rowID, "projectenddate") || {val: null}).val
                    if (advMax && parseInt(stake.val) > 0)
                        stakeData.push([_.values(D.GetCharVals(charObj, "initial"))[0], stake.name, Math.min(parseInt(stake.val), advMax), parseInt(advMax), endDate])
                }
            }
            if (_.flatten(_.values(STATEREF.weeklyResources)).length === 0) {
                Media.SetText("stakedAdvantages", {text: " "})
            } else {
                let lastInit = ""
                for (const data of stakeData) {
                    const [init, name, staked, max, endDate] = data
                    let thisString = " "
                    if (init !== lastInit) {
                        thisString = `[${init}]`
                        lastInit = init
                    }
                    stakeStrings.push(`${thisString}${Media.Buffer(textObj, col1Width - Media.GetTextWidth(textObj, thisString, false))}${
                        name}${Media.Buffer(textObj, col2Width - Media.GetTextWidth(textObj, name, false))}${
                        "○".repeat(staked)}${"●".repeat(max - staked)}${Media.Buffer(textObj, col3Width - Media.GetTextWidth(textObj, `${
                        "○".repeat(staked)}${"●".repeat(max - staked)}`, false))}${endDate}`)
                }        
                Media.SetText("stakedAdvantages", stakeStrings.join("\n"))
            }
        }
    // #endregion
    
    // #region Manipulating Stats on Sheet,
    const parseDmgTypes = (max, bashing = 0, aggravated = 0, deltaBash = 0, deltaAgg = 0) => {
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
        adjustTrait = (charRef, trait, amount, min, max, defaultTraitVal, deltaType) => {
            const charObj = D.GetChar(charRef)
            if (VAL({charObj: [charObj], trait: [trait], number: [amount]}, "adjustTrait", true)) {
                const chatStyles = {
                        block: trait === "humanity" && amount > 0 || trait !== "humanity" && amount < 0 ? Object.assign(C.STYLES.whiteMarble.block, {}) : {},
                        body: trait === "humanity" && amount > 0 || trait !== "humanity" && amount < 0 ? Object.assign(C.STYLES.whiteMarble.body, {fontSize: 12}) : {},
                        banner: trait === "humanity" && amount > 0 || trait !== "humanity" && amount < 0 ? Object.assign(C.STYLES.whiteMarble.header, {margin: "0px", fontSize: 12}) : {margin: "0px", fontSize: 12},
                        alert: trait === "humanity" && amount > 0 || trait !== "humanity" && amount < 0 ? Object.assign(C.STYLES.whiteMarble.header, {}) : {}
                    },
                    initTraitVal = parseInt((D.GetStat(charObj, trait) || [0])[0] || defaultTraitVal || 0),
                    finalTraitVal = Math.min(max || Infinity, Math.max(min || -Infinity, initTraitVal + parseInt(amount)))
                let [bannerString, bodyString, alertString] = ["", "", null]
                DB(`Adjusting Trait: (${D.JS(trait)}, ${D.JS(amount)}, ${D.JS(min)}, ${D.JS(max)}, ${D.JS(defaultTraitVal)}, ${D.JS(deltaType)})
                    ... Initial (${D.JS(initTraitVal)}) + Amount (${D.JS(amount)}) = Final (${D.JS(finalTraitVal)}))`, "adjustTrait")
                switch (trait.toLowerCase()) {
                    case "hunger":
                        chatStyles.block = {}
                        chatStyles.header = {margin: "0px"}
                        if (amount > 0) 
                            bannerString = `Your hunger increases by ${D.NumToText(amount).toLowerCase()}`
                        else if (amount < 0)
                            bannerString = `You sate your hunger by ${D.NumToText(amount).toLowerCase()}`
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
                            bannerString = `${D.NumToText(Math.abs(amount))} stain${Math.abs(amount) > 1 ? "s" : ""} cleared from your Humanity.`
                        break
                    case "willpower_sdmg":
                        if (amount > 0) {
                            const [maxWP, curBashing, curAggravated] = [
                                    parseInt(D.GetStat(charObj, "willpower_max")[0]),
                                    parseInt(D.GetStat(charObj, "willpower_bashing")[0]),
                                    parseInt(D.GetStat(charObj, "willpower_aggravated")[0])
                                ],
                                [newBashing, newAggravated, isOverLimit] = parseDmgTypes(maxWP, curBashing, curAggravated, amount, 0)
                            DB(`MaxWP: ${maxWP}, CurBash: ${curBashing}, CurAggr: ${curAggravated}<br>... Dealing ${amount} --> newBash: ${newBashing}, newAggr: ${newAggravated}`, "adjustTrait")
                            switch(deltaType) {
                                case "superficial":
                                    bannerString = `You suffer ${D.NumToText(Math.abs(amount)).toLowerCase()} (halved) superficial Willpower damage.`
                                    break
                                case "superficial+":
                                    bannerString = `You suffer ${D.NumToText(Math.abs(amount)).toLowerCase()} <i>unhalved</i> superficial Willpower damage.`
                                    break
                                case "spent":
                                    bannerString = `You spend ${D.NumToText(Math.abs(amount)).toLowerCase()} Willpower.`
                                    break
                                // no default
                            }
                            if (isOverLimit || newAggravated === maxWP)
                                alertString = "You have suffered more damage than you can stand!"
                            else if (curBashing + curAggravated === maxWP)
                                bodyString = `Exhausted, you are taking <i>aggravated</i> damage!<br>${maxWP - newAggravated} Willpower remaining...`
                            else
                                bodyString += `${maxWP - newAggravated - newBashing} Willpower remaining...`
                        } else if (amount < 0) {
                            bannerString = `You regain ${D.NumToText(Math.abs(amount)).toLowerCase()} Willpower.`                            
                        }
                        break
                    case "willpower_admg": 
                        if (amount > 0) {
                            const [maxWP, curBashing, curAggravated] = [
                                    parseInt(D.GetStat(charObj, "willpower_max")[0]),
                                    parseInt(D.GetStat(charObj, "willpower_bashing")[0]),
                                    parseInt(D.GetStat(charObj, "willpower_aggravated")[0])
                                ],
                                [newBashing, newAggravated, isOverLimit] = parseDmgTypes(maxWP, curBashing, curAggravated, 0, amount)
                            DB(`MaxWP: ${maxWP}, CurBash: ${curBashing}, CurAggr: ${curAggravated}<br>... Dealing ${amount} --> newBash: ${newBashing}, newAggr: ${newAggravated}`, "adjustTrait")
                            bannerString = `You suffer ${D.NumToText(Math.abs(amount)).toLowerCase()} AGGRAVATED Willpower damage!`                        
                            if (isOverLimit || newAggravated === maxWP)
                                alertString = "You have suffered more damage than you can stand!"
                            else
                                bodyString = `${maxWP - newAggravated - newBashing} Willpower remaining...`                            
                        } else if (amount < 0) {
                            bannerString = `${D.NumToText(Math.abs(amount))} aggravated Willpower damage has become superficial.`
                            
                        }
                        break
                    case "health_sdmg":
                        if (amount > 0) {
                            const [maxHealth, curBashing, curAggravated] = [
                                    parseInt(D.GetStat(charObj, "health_max")[0]),
                                    parseInt(D.GetStat(charObj, "health_bashing")[0]),
                                    parseInt(D.GetStat(charObj, "health_aggravated")[0])
                                ],
                                [newBashing, newAggravated, isOverLimit] = parseDmgTypes(maxHealth, curBashing, curAggravated, amount, 0)
                            DB(`MaxHealth: ${maxHealth}, CurBash: ${curBashing}, CurAggr: ${curAggravated}<br>... Dealing ${amount} --> newBash: ${newBashing}, newAggr: ${newAggravated}`, "adjustTrait")
                            switch (deltaType) {
                                case "superficial":
                                    bannerString = `You suffer ${D.NumToText(Math.abs(amount)).toLowerCase()} (halved) superficial Health damage.`
                                    break
                                case "superficial+":
                                    bannerString = `You suffer ${D.NumToText(Math.abs(amount)).toLowerCase()} <i>unhalved</i> superficial Health damage.`
                                    break
                                // no default
                            }
                            if (isOverLimit || newAggravated === maxHealth)
                                alertString = "DARKNESS FALLS: YOU SINK INTO TORPOR"
                            else if (curBashing + curAggravated === maxHealth)
                                bodyString = `Wounded, you are taking <i>aggravated</i> damage!<br>${maxHealth - newAggravated} Health remaining...`
                            else
                                bodyString = `${maxHealth - newAggravated - newBashing} Health remaining...`                    
                        } else if (amount < 0) {
                            bannerString = `You heal ${D.NumToText(Math.abs(amount)).toLowerCase()} superficial Health damage.` 
                        }
                        break
                    case "health_admg":
                        if (amount > 0) {
                            const [maxHealth, curBashing, curAggravated] = [
                                    parseInt(D.GetStat(charObj, "health_max")[0]),
                                    parseInt(D.GetStat(charObj, "health_bashing")[0]),
                                    parseInt(D.GetStat(charObj, "health_aggravated")[0])
                                ],
                                [newBashing, newAggravated, isOverLimit] = parseDmgTypes(maxHealth, curBashing, curAggravated, 0, amount)
                            DB(`MaxHealth: ${maxHealth}, CurBash: ${curBashing}, CurAggr: ${curAggravated}<br>... Dealing ${amount} --> newBash: ${newBashing}, newAggr: ${newAggravated}<br>... IsOverLimit? ${D.JS(isOverLimit)}`, "adjustTrait")
                            bannerString = `You suffer ${D.NumToText(Math.abs(amount)).toLowerCase()} AGGRAVATED Health damage!`                        
                            if (isOverLimit || newAggravated === maxHealth)
                                alertString = "DARKNESS FALLS: YOU SINK INTO TORPOR"
                            else
                                bodyString = `${maxHealth - newAggravated - newBashing} Health remaining...`
                        } else if (amount < 0) {
                            bannerString = `${D.NumToText(Math.abs(amount))} aggravated Health damage has become superficial.`                  
                        }
                        break
                    // no default
                }
                D.Chat(charObj, C.CHATHTML.colorBlock(_.compact([
                    C.CHATHTML.colorHeader(bannerString, chatStyles.banner),
                    bodyString ? C.CHATHTML.colorBody(bodyString, chatStyles.body) : null,
                    alertString ? C.CHATHTML.colorHeader(alertString, chatStyles.alert) : null
                ]), chatStyles.block))
                setAttrs(D.GetChar(charObj).id, {[trait.toLowerCase()]: finalTraitVal })
                return true
            }
            return false
        },
        adjustDamage = (charRef, trait, dtype, delta) => {
            const amount = parseInt(delta),
                charObj = D.GetChar(charRef)
            let [minVal, maxVal, targetVal, defaultVal, traitName, deltaType] = [0, 5, parseInt(amount), 0, "", ""]
            if (VAL({ charObj: [charObj], number: [amount] }, "AdjustDamage", true)) {
                switch (trait.toLowerCase()) {
                    case "hum": case "humanity":
                        [minVal, maxVal, targetVal, defaultVal, traitName] = [0, 10, parseInt(amount), 7, "humanity"]
                        break
                    case "stain": case "stains":
                        [minVal, maxVal, targetVal, defaultVal, traitName] = [0, 10, parseInt(amount), 0, "stains"]
                        break
                    case "health": case "willpower": case "wp": {
                        [minVal, maxVal, targetVal, defaultVal, traitName, deltaType] = [
                            -Infinity,
                            Infinity,
                            parseInt(amount) >= 0 && dtype === "superficial" ? parseInt(Math.ceil(amount / 2)) : parseInt(amount),
                            0,
                            trait.toLowerCase() + (["superficial", "superficial+", "spent"].includes(dtype) ? "_sdmg" : "_admg"),
                            dtype
                        ]
                        break
                    }
                    // no default
                }
                LOG(`Adjusting Damage: (${D.JS(trait)}, ${D.JS(dtype)}, ${D.JS(amount)})`, "adjustDamage")
                return adjustTrait(charRef, traitName, targetVal, minVal, maxVal, defaultVal, deltaType)
            }
            return false
        },
        adjustHunger = (charRef, amount, isKilling = false) => {
            if (!VAL({ char: [charRef], number: [amount], trait: ["bp_slakekill"] }, "AdjustHunger", true))
                return false
            if (adjustTrait(charRef, "hunger", parseInt(amount), isKilling ? 0 : parseInt(D.GetStat(charRef, "bp_slakekill") && D.GetStat(charRef, "bp_slakekill")[0] || 1), 5, 1))
                return true
            return false
        },
        sortTimeline = (charRef) => {
            D.SortRepSec(charRef, "timeline", "tlenddate", true, function(val) {return val ? (new Date(val.replace(/— /gu, ""))).getTime() : -200})
        }
    // #endregion

    // #region Daysleep & Waking Up,
    const daysleep = () => {
        for (const char of D.GetChars("registered")) {
            const healWP = Math.max(parseInt(getAttrByName(char.id, "composure")), parseInt(getAttrByName(char.id, "resolve")))
            adjustDamage(char, "willpower", "superficial+", -1 * healWP)
        }
    }
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
    DISCIPLINES = ["Animalism", "Auspex", "Celerity", "Chimerstry", "Dominate", "Fortitude", "Obfuscate", "Oblivion", "Potence", "Presence", "Protean", "Blood Sorcery", "Alchemy"],
    TRACKERS = ["Willpower", "Health", "Humanity", "Blood Potency"], */
    const populateDefaults = (charRef) => {
            const attrList = {},
                charIDs = [],
                npcStats = JSON.parse(NPCSTATS),
                npcDefaults = JSON.parse(NPCDEFAULTS)
            _.each(npcDefaults, (v, k) => { attrList[k] = v })
            if (_.isNaN(parseInt(charRef))) {
                charIDs.push(D.GetChar(charRef).id)
            } else {
                charIDs.push(..._.keys(npcStats).slice(parseInt(charRef), parseInt(charRef) + 10))
                D.Alert(`Setting Defaults on characters ${parseInt(charRef)} - ${parseInt(charRef) + 10} of ${_.keys(npcStats).length} ...`)
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
                    let skillDupeCheck = _.compact(_.flatten(_.map(_.values(charData.skills), v => v.split(/\s+/gu))))
                    if (_.uniq(skillDupeCheck).length !== skillDupeCheck.length)
                        errorLog += `<br>Duplicate Skill(s) on ${D.GetName(charID)}: ${_.sortBy(skillDupeCheck, v => v).join(" ")}`
                    else
                        for (const skillAbv of _.keys(C.SKILLABBVS))
                            attrList[C.SKILLABBVS[skillAbv]] = parseInt(_.findKey(charData.skills, v => v.includes(skillAbv)) || 0)


                }
                if (charData.clandiscs)
                    _.each(["disc1", "disc2", "disc3"], discnum => {
                        if (charData.clandiscs[discnum].length) {
                            attrList[`${discnum}_name`] = charData.clandiscs[discnum][0]
                            attrList[discnum] = charData.clandiscs[discnum][1]
                        } else {
                            attrList[`${discnum}_name`] = ""
                            attrList[discnum] = 0
                        }
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
                                rowID: rowID,
                                val: parseInt(discData.val) || 0
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
                                    attrList[`repeating_${repDiscs[discName].sec}_${repDiscs[discName].rowID}_disc`] = parseInt(_.findKey(charData.otherdiscs, v => v.includes(discAbv)))
                                else {
                                    D.DeleteRow(charID, repDiscs[discName].sec, repDiscs[discName].rowID)
                                    rowCount[repDiscs[discName].sec]--
                                }
                            else if (_.findKey(charData.otherdiscs, v => v.includes(discAbv)))
                                otherDiscs.push([discName, parseInt(_.findKey(charData.otherdiscs, v => v.includes(discAbv)))])

                        }
                        while (otherDiscs.length) {
                            const thisDisc = otherDiscs.pop(),
                                targetSec = _.min([{ sec: "discleft", num: rowCount.discleft }, { sec: "discmid", num: rowCount.discmid }, { sec: "discright", num: rowCount.discright }], v => v.num).sec
                            //D.Alert(`D.MakeRow(ID, ${targetSec}, {disc_name: ${thisDisc[0]}, disc: ${thisDisc[1]} })`)
                            rowCount[targetSec]++
                            D.MakeRow(charID, targetSec, { disc_name: thisDisc[0], disc: thisDisc[1] })
                        }
                    }
                }
                attrList.roll_array = ""
                attrList.rollpooldisplay = ""
                setAttrs(charID, attrList, {}, () => {
                    //D.Alert("Callback Function Passed!")
                    setAttrs(charID, { hunger: Math.max(1, parseInt(getAttrByName("bp_slakekill"))) })
                })
                D.Alert(`ATTRLIST FOR ${D.GetName(charID)}:<br><br>${D.JS(attrList)}`)
            }
            D.Alert(`Error Log:<br>${D.JS(errorLog)}`, "CHARS: setNPCStats()")
        }
    // #endregion

    return {
        RegisterEventHandlers: regHandlers,
        CheckInstall: checkInstall,
        REGISTRY: REGISTRY,
        Damage: adjustDamage,
        AdjustTrait: adjustTrait,
        AdjustHunger: adjustHunger,
        DaySleep: daysleep,
        AwardXP: awardXP,
        RefreshDisplays: () => { displayDesires(); displayResources(); displayStakes() }
    }
})()

on("ready", () => {
    Char.RegisterEventHandlers()
    Char.CheckInstall()
    D.Log("Char Ready!")
})
void MarkStop("Char")