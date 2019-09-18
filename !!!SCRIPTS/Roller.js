void MarkStart("Roller")
const Roller = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Roller",
        CHATCOMMAND = null,
        GMONLY = false,

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
                    handleInput(msg, who, call, args)
                }
            })
        },
    // #endregion

    // #region LOCAL INITIALIZATION
        initialize = () => {
            STATEREF.rollRecord = STATEREF.rollRecord || []
            STATEREF.rollIndex = STATEREF.rollIndex || 0
            STATEREF.NPC = STATEREF.NPC || {}
            STATEREF.NPC.rollRecord = STATEREF.NPC.rollRecord || []
            STATEREF.NPC.rollIndex = STATEREF.NPC.rollIndex || 0
            STATEREF.selected = STATEREF.selected || {}
            STATEREF.rollEffects = STATEREF.rollEffects || {}
            STATEREF.lastProjectPrefix = STATEREF.lastProjectPrefix || ""
            STATEREF.lastProjectCharID = STATEREF.lastProjectCharID || ""
            STATEREF.nextRollFlags = STATEREF.nextRollFlags || {}

            _.each(_.uniq(_.flatten(STATECATS.dice)), v => {
                STATEREF.selected[v] = STATEREF.selected[v] || []
                STATEREF[v] = STATEREF[v] || []
            })
            _.each(_.without(_.uniq(_.flatten(_.values(STATECATS))), ...STATECATS.dice), v => {
                STATEREF[v] = STATEREF[v] || {}
            })
        },

    // #endregion	

    // #region EVENT HANDLERS: (HANDLEINPUT)
    // eslint-disable-next-line no-unused-vars
        newHandleInput = (msg, who, call, args) => {        
            let charObj, params, rollType,
                name = "",
                [isSilent, isMaskingTraits] = [false, false]
            switch (call) {
                case "frenzyinit": {	// !projectroll @{character_name}|Politics:3,Resources:2|mod|diff|diffMod|rowID
                    lockRoller(true)
                    STATEREF.frenzyRoll = `${args.join(" ").split("|")[0]}|`
                    sendChat("ROLLER", `/w Storyteller <br/><div style='display: block; background: url(https://i.imgur.com/kBl8aTO.jpg); text-align: center; border: 4px ${C.COLORS.crimson} outset;'><br/><span style='display: block; font-size: 16px; text-align: center; width: 100%'>[Set Frenzy Diff](!#Frenzy)</span><span style='display: block; text-align: center; font-size: 12px; font-weight: bolder; color: ${C.COLORS.white}; font-variant: small-caps; margin-top: 4px; width: 100%'>~ for ~</span><span style='display: block; font-size: 14px; color: ${C.COLORS.brightred}; text-align: center; font-weight: bolder; font-variant: small-caps; width: 100%'>${args.join(" ").split("|")[0]}</span><br/></div>`)
                    break
                }
                case "frenzy": { rollType = rollType || "frenzy"
                    lockRoller(false)
                    args = `${STATEREF.frenzyRoll} ${args[0]}`.split(" ")
                    DB(`Parsing Frenzy Args: ${D.JS(args)}`, "!frenzyroll")
                } /* falls through */
                case "disc": case "trait": rollType = rollType || "trait"
            /* falls through */
                case "rouse": case "rouseobv": rollType = rollType || "rouse"
            /* falls through */
                case "rouse2": case "rouse2obv": rollType = rollType || "rouse2"
            /* falls through */
                case "check": rollType = rollType || "check"
            /* falls through */
                case "willpower": rollType = rollType || "willpower"
            /* falls through */
                case "humanity": rollType = rollType || "humanity"
            /* falls through */
                case "remorse": rollType = rollType || "remorse"
            /* falls through */
                case "project": { rollType = rollType || "project"
                /* all continue below */
                    params = _.map(args.join(" ").split("|"), v => v.trim())
                    name = params.shift()
                    charObj = D.GetChar(name)
                    DB(`Received Roll: ${D.JS(call)} ${name}|${params.join("|")}
                            ... PARAMS: [${D.JS(params.join(", "))}]
                            ... CHAROBJ: ${D.JS(charObj)}`, "handleInput")
                    if (VAL({charobj: charObj}, "handleInput")) {
                        if (STATEREF.isNextRollNPC && playerIsGM(msg.playerid)) {
                            STATEREF.isNextRollNPC = false
                            makeNewRoll(charObj, rollType, params, Object.assign(_.clone(STATEREF.nextRollFlags), {isDiscRoll: call === "disc", isNPCRoll: true, isOblivionRoll: STATEREF.oblivionRouse === true || call.includes("obv")}))
                            STATEREF.oblivionRouse = false
                                // STATEREF.nextRollFlags = {}
                        } else if (isLocked) {
                            break
                        } else if (playerIsGM(msg.playerid)) {
                            makeNewRoll(charObj, rollType, params, Object.assign(_.clone(STATEREF.nextRollFlags), {isDiscRoll: call === "disc", isNPCRoll: false, isOblivionRoll: STATEREF.oblivionRouse === true || call.includes("obv")}))
                            STATEREF.oblivionRouse = false
                                // STATEREF.nextRollFlags = {}                
                        } else {
                            makeNewRoll(charObj, rollType, params, {isDiscRoll: call === "disc", isNPCRoll: false, isOblivionRoll: call.includes("obv")})
                        }
                        delete STATEREF.frenzyRoll
                    }
                    break
                }
                case "secret": {
                    rollType = "secret"
                    const flags = args.shift().toLowerCase()
                    params = args.join(" ").split("|")
                    isSilent = flags.includes("x")
                    isMaskingTraits = flags.includes("n")
                    let chars
                    if (!msg.selected || !msg.selected[0])
                        chars = D.GetChars("registered")
                    else
                        chars = D.GetChars(msg)
                    if (params.length >= 1 && params.length <= 3)
                        makeSecretRoll(chars, params, isSilent, isMaskingTraits)
                    break
                }
                case "add": case "set": {
                    switch (args.shift().toLowerCase()) {
                        case "sec": case "secret": case "secrecy": {
                            switch ((args[0] || "").toLowerCase()) {
                                case "name": case "identity":
                                    STATEREF.nextRollFlags = {
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
                                    STATEREF.nextRollFlags = {
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
                                    STATEREF.nextRollFlags = {
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
                                    STATEREF.nextRollFlags = {
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
                                    STATEREF.nextRollFlags = {
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
                                    STATEREF.nextRollFlags = {
                                        isHidingName: false,
                                        isHidingTraits: true,
                                        isHidingTraitVals: true,
                                        isHidingDicePool: true,
                                        isHidingDifficulty: false,
                                        isHidingResult: true,
                                        isHidingOutcome: true
                                    }
                                    break
                                default:
                                    for (const flag of ["Name", "Traits", "TraitVals", "DicePool", "Difficulty", "Result", "Outcome"])
                                        _.each(args, v => {
                                            const isNegating = v.startsWith("!")
                                            if (D.FuzzyMatch(flag, v.replace(/!/gu, "")))
                                                STATEREF.nextRollFlags[`isHiding${flag}`] = !isNegating
                                            if (D.FuzzyMatch("NPC", v.replace(/!/gu, "")))
                                                STATEREF.isNextRollNPC = !isNegating
                                        })
                                    break               
                            }
                            D.Alert(`Flag Status for Next Roll: ${D.JS(STATEREF.nextRollFlags, true)}`, "NEXT ROLL FLAGS")
                            break
                        }
                        case "charfx": case "chareffect": {
                            const chars = D.GetChars(msg)
                            for (const char of chars) {
                                const rollEffects = _.compact((getAttrByName(char.id, "rolleffects") || "").split("|"))
                                rollEffects.push(...args.join(" ").split("|"))
                                setAttrs(char.id, {rolleffects: _.uniq(rollEffects).join("|")})
                                D.Alert(`Roll Effects on ${D.GetName(char)} revised to:<br><br>${rollEffects.join("<br>")}`, "ROLLER: !addchareffect")
                            }
                            break
                        }
                        case "globalfx": case "globaleffect": {
                            for (const effect of _.compact(args.join(" ").split("|")))
                                STATEREF.rollEffects[effect] = []
                            const rollStrings = []
                            for (let i = 0; i < _.keys(STATEREF.rollEffects).length; i++)
                                rollStrings.push(`${i + 1}: ${_.keys(STATEREF.rollEffects)[i]}`)
                            D.Alert(`Global Roll Effects:<br><br>${rollStrings.join("<br>")}`, "ROLLER: !getglobaleffects")
                            break
                        }
                        case "globalexclude": case "globalex": case "globalexc": {
                            charObj = D.GetChar(msg) || D.GetChar(args.shift())
                            if (VAL({charObj}, "!addglobalexclude")) {
                                let effectString = args.join(" ")
                                if (VAL({number: effectString}))
                                    effectString = _.keys(STATEREF.rollEffects)[parseInt(effectString - 1)]
                                else
                                    effectString = _.find(_.keys(STATEREF.rollEffects, v => D.FuzzyMatch(effectString, v)))
                                if (STATEREF.rollEffects[effectString]) {
                                    STATEREF.rollEffects[effectString].push(charObj.id)
                                    D.Alert(`Exclusions for effect <b>${D.JS(effectString)}</b>: ${D.JS(STATEREF.rollEffects[effectString])}`, "!addglobalexclude")
                                } else {
                                    D.Alert(`No exclusion found for reference '${effectString}'`, "!addglobalexclude")
                                }
                            } else {
                                D.Alert("You must select a character token or supply a valid character reference (without spaces)!", "!addglobalexclude")
                            }
                            break
                        }
                    // no default                            
                    }
                    break
                }
                case "toggle": {
                    switch (args.shift().toLowerCase()) {
                        case "obliv":
                            if (playerIsGM(msg.playerid)) {
                                STATEREF.oblivionRouse = !STATEREF.oblivionRouse
                                D.Alert(`Next SPC Rouse Check ${STATEREF.oblivionRouse && "<b>IS</b>" || "<b>IS NOT</b>"} for Oblivion.`, "!oblivrouse")
                            }
                            break
                        case "npc":
                            if (playerIsGM(msg.playerid))
                                STATEREF.isNextRollNPC = true
                            break
                        case "dice":
                            _.each(STATEREF.diceList, (v, dNum) => {
                                const thisDie = setDie(dNum, "diceList", "Hs")
                                if (_.isObject(thisDie)) 
                                    thisDie.set("isdrawing", false)
                            
                            })
                            _.each(STATEREF.bigDice, (v, dNum) => {
                                const thisDie = setDie(dNum, "bigDice", "Bs")
                                if (_.isObject(thisDie)) 
                                    thisDie.set("isdrawing", false)
                            
                            })
                            break
                    // no default
        
                    }
                    break
                }
                case "init": {                
                    switch(args.shift().toLowerCase()) {
                        case "roller":
                            clearRoller()
                            break
                        case "frame":
                            initFrame()
                            break
                    // no default
                    }
                    break
                }
                case "get": {
                    switch (args.shift().toLowerCase()) {
                        case "roll":
                            changeRoll(parseInt(args.shift()))
                            break
                        case "npcroll":
                            changeRoll(parseInt(args.shift()), true)
                            break
                        case "prev": case "last": case "prevroll": case "lastroll":
                            loadPrevRoll()
                            break
                        case "next": case "nextroll":
                            loadNextRoll()
                            break
                        case "prevnpc": case "lastnpc": case "prevnpcroll": case "lastnpcroll":
                            loadPrevRoll(true)
                            break
                        case "nextnpc": case "nextnpcroll":
                            loadNextRoll(true)
                            break
                        case "res": case "resonance":
                            if (args[0] === "x")
                                args[0] = ""
                            if (args[1] === "x")
                                args[1] = ""
                            displayResonance(...args)
                            break
                        case "charfx": case "chareffects": {
                            const char = D.GetChar(msg)
                            if (!char) {
                                THROW("Select a character token first!", "!getchareffects")
                                break
                            }
                            const rollEffects = _.compact((getAttrByName(char.id, "rolleffects") || "").split("|")),
                                rollStrings = []
                            for (let i = 0; i < rollEffects.length; i++)
                                rollStrings.push(`${i + 1}: ${rollEffects[i]}`)
                            D.Alert(`Roll Effects on ${D.GetName(char)}:<br><br>${rollStrings.join("<br>")}`, "ROLLER: !getchareffects")
                            break
                        }
                        case "globalfx": case "globaleffects": {
                            const rollStrings = []
                            for (let i = 0; i < _.keys(STATEREF.rollEffects).length; i++)
                                rollStrings.push(`${i + 1}: ${_.keys(STATEREF.rollEffects)[i]}`)
                            D.Alert(`Global Roll Effects:<br><br>${rollStrings.join("<br>")}`, "ROLLER: !getglobaleffects")
                            break
                        }
                    // no default        
                    }
                    break
                }
                case "clear": case "del": case "rem": {
                    switch (args.shift().toLowerCase()) {
                        case "charfx": case "chareffect": {
                            const char = D.GetChar(msg)
                            if (!char) {
                                THROW("Select a character token first!", "!getchareffects")
                                break
                            }
                            const rollEffects = _.compact((getAttrByName(char.id, "rolleffects") || "").split("|"))
                            rollEffects.splice(Math.max(0, parseInt(args.shift()) - 1), 1)
                            setAttrs(char.id, {rolleffects: rollEffects.join("|")})
                            D.Alert(`Roll Effects on ${D.GetName(char)} revised to:<br><br>${rollEffects.join("<br>")}`, "ROLLER: !delchareffects")
                            break
                        }
                        case "globalfx": case "globaleffect": {
                            delete STATEREF.rollEffects[_.keys(STATEREF.rollEffects)[Math.max(0, parseInt(args.shift()) - 1)]]
                            D.Alert(`Global Roll Effects revised to:<br><br>${_.keys(STATEREF.rollEffects).join("<br>")}`, "ROLLER: !delglobaleffect")
                            break
                        }
                        case "globalexclude": case "globalex": case "globalexc": {
                            charObj = D.GetChar(msg) || D.GetChar(args.shift())
                            if (VAL({charObj}, "!delglobalexclude")) {
                                let effectString = args.join(" ")
                                if (VAL({number: effectString}))
                                    effectString = _.keys(STATEREF.rollEffects)[parseInt(effectString - 1)]
                                else
                                    effectString = _.find(_.keys(STATEREF.rollEffects, v => D.FuzzyMatch(effectString, v)))
                                if (!STATEREF.rollEffects[effectString]) {
                                    const checkEffects = _.filter(STATEREF.rollEffects, v => v.includes(charObj.id))
                                    if (checkEffects.length === 1)
                                        effectString = _.keys(checkEffects)[0]
                                    else if (checkEffects.length === 0)
                                        D.Alert(`Character ${D.JS(charObj.get("name"))} is not listed in any roll effect exclusions.`, "!delglobalexclude")
                                    else if (checkEffects.length > 1)
                                        D.Alert(`Character ${D.JS(charObj.get("name"))} is present in multiple exclusions, please be more specific: ${D.JS(checkEffects, true)}`, "!delglobalexclude")
                
                                }
                                if (STATEREF.rollEffects[effectString]) {
                                    STATEREF.rollEffects[effectString] = _.without(STATEREF.rollEffects[effectString], charObj.id)
                                    D.Alert(`Exclusions for effect <b>${D.JS(effectString)}</b>: ${D.JS(STATEREF.rollEffects[effectString])}`, "!delglobalexclude")
                                } else {
                                    D.Alert(`No exclusion found for reference '${effectString}'`, "!delglobalexclude")
                                }
                            } else {
                                D.Alert("You must select a character token or supply a valid character reference (without spaces)!", "!delglobalexclude")
                            }
                            break
                        // no default
                        }
                    // no default                          
                    }
                    break
                }
            // no default
            }
        },
        handleInput = (msg, who, call, args) => {
            let [rollType, char, diceNums, resonance, resDetails, resIntLine, params] = new Array(7),
                name = "",
                [isSilent, isMaskingTraits] = [false, false],            
                charObjs, charIDString
            if (call === "!roll" && args[0] && args[0].toLowerCase() !== "pcroll") 
            // D.Alert(`Calling D.ParseCharSelection(<br>CALL: ${D.JS(call)},<br>ARGS: [${D.JS(args.join(", "))}])`);
                [charObjs, charIDString, call, args] = D.ParseCharSelection(args[0], args.slice(1))
            // D.Alert(`AFTER:<br>CHAROBJS: ${D.JS((charObjs || []).map(x => D.GetName(x)).join("<br>"))}<br>IDSTRING: ${D.JS(charIDString)}<br>CALL: ${call}<br>ARGS: [${args.join(", ")}]`)
        
            switch (call) {
                case "nxsroll":
                case "xnsroll":
                case "xsroll":
                case "sxroll":
                case "snxroll":
                case "sxnroll":
                case "nsroll":
                case "snroll":
                case "sroll": {
                    rollType = "secret"
                    if (!args.length) {
                        Char.PromptTraitSelect(charIDString, "!roll @@CHARIDS@@ sroll selected")
                    } else {                    
                        params = args[0] === "selected" && Char.SelectedTraits.join(",") || args.join(" ").split("|")
                        isSilent = call.includes("x")
                        isMaskingTraits = call.includes("n")
                        charObjs = charObjs || D.GetChars(msg) || D.GetChars("registered")
                        makeSecretRoll(charObjs, params, isSilent, isMaskingTraits)
                    }
                    break
                }
                case "resonance": {
                    const location = _.omit(Media.LOCATION, (v, k) => k.includes("Name") || v === "blank"),
                        resArgs = [],
                        deltaAttrs = {}
                // D.Alert(D.JS(location))
                    if (location.DistrictCenter) {
                        resArgs.push(...C.DISTRICTS[location.DistrictCenter].resonance)
                        if (location.SiteCenter) {
                            resArgs[0] += C.SITES[location.SiteCenter].resonance[0] || ""
                            resArgs[1] += C.SITES[location.SiteCenter].resonance[1] || ""
                        }
                    } else if (args[0] && args[0].toLowerCase().slice(0,1) === "r" && location.DistrictRight ||
                        location.DistrictRight && !location.DistrictLeft) {
                        resArgs.push(...C.DISTRICTS[location.DistrictRight].resonance)
                        if (location.SiteRight) {
                            resArgs[0] += C.SITES[location.SiteRight].resonance[0] || ""
                            resArgs[1] += C.SITES[location.SiteRight].resonance[1] || ""
                        }
                    } else if (args[0] && args[0].toLowerCase().slice(0,1) === "l" && location.DistrictLeft ||
                        location.DistrictLeft) {
                        resArgs.push(...C.DISTRICTS[location.DistrictLeft].resonance)
                        if (location.SiteLeft) {
                            resArgs[0] += C.SITES[location.SiteLeft].resonance[0] || ""
                            resArgs[1] += C.SITES[location.SiteLeft].resonance[1] || ""
                        }
                    }
                // D.Alert(`Location-Based Resonance: ${D.JS(resArgs.join(", "))}`)
                    if (resArgs.join("").length > 1) {
                        resonance = getResonance(...resArgs)
                    } else {
                        if (args[0] === "x")
                            args[0] = ""
                        if (args[1] === "x")
                            args[1] = ""
                        resonance = getResonance(...args)
                    }
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
                            deltaAttrs.resonance = "None"
                            resonance[0] = "Negligibly"
                            resIntLine = `The blood carries only the smallest hint of ${resonance[1].toLowerCase()} resonance.  It is not strong enough to confer any benefits at all.`
                            break
                        case "fleeting":
                            deltaAttrs.resonance = "None"
                            resonance[0] = "Fleetingly"
                            resIntLine = `The blood's faint ${resonance[1].toLowerCase()} resonance can guide you in developing ${resonance[2]}, but lacks any real power.`
                            break
                        case "intense":
                            deltaAttrs.resonance = resonance[1]
                            resonance[0] = "Intensely"
                            resIntLine = `The blood's strong ${resonance[1].toLowerCase()} resonance spreads through you, infusing your own vitae and enhancing both your control and understanding of ${resonance[2]}.`
                            break
                        case "acute":
                            deltaAttrs.resonance = resonance[1]
                            resonance[0] = "Acutely"
                            resIntLine = `This blood is special.  In addition to enhancing ${resonance[2]}, its ${resonance[1].toLowerCase()} resonance is so powerful that the emotions within have crystallized into a dyscracias.`
                            break
                    // no default
                    }
                    D.SetStat(charObjs[0], "resonance", deltaAttrs.resonance)
                    sendChat("Resonance Check", C.CHATHTML.colorBlock([
                        C.CHATHTML.colorTitle(_.map([resonance[0], resonance[1]], v => v.toUpperCase()).join(" ")),
                        C.CHATHTML.colorHeader(resDetails),
                        C.CHATHTML.colorBody(resIntLine)
                    ]))
                    break
                }
                case "!roll": {
                    switch(args.shift().toLowerCase()) {
                        case "pcroll": {
                            switch(args.shift().toLowerCase()) {
                                case "remorse": {
                                    const charObj = D.GetChar(args.join(" "))
                                    if (VAL({charObj}, "!roll pcroll remorse"))
                                        makeNewRoll(charObj, "remorse")
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
                case "obliv": case "!oblivrouse":
                    if (playerIsGM(msg.playerid)) {
                        STATEREF.oblivionRouse = !STATEREF.oblivionRouse
                        D.Alert(`Next SPC Rouse Check ${STATEREF.oblivionRouse && "<b>IS</b>" || "<b>IS NOT</b>"} for Oblivion.`, "!oblivrouse")
                    }
                    break
                case "frenzyinit": case "!frenzyinitroll":	// !projectroll @{character_name}|Politics:3,Resources:2|mod|diff|diffMod|rowID
                    lockRoller(true)
                    STATEREF.frenzyRoll = `${args.join(" ").split("|")[0]}|`
                    sendChat("ROLLER", `/w Storyteller <br/><div style='display: block; background: url(https://i.imgur.com/kBl8aTO.jpg); text-align: center; border: 4px ${C.COLORS.crimson} outset;'><br/><span style='display: block; font-size: 16px; text-align: center; width: 100%'>[Set Frenzy Diff](!#Frenzy)</span><span style='display: block; text-align: center; font-size: 12px; font-weight: bolder; color: ${C.COLORS.white}; font-variant: small-caps; margin-top: 4px; width: 100%'>~ for ~</span><span style='display: block; font-size: 14px; color: ${C.COLORS.brightred}; text-align: center; font-weight: bolder; font-variant: small-caps; width: 100%'>${args.join(" ").split("|")[0]}</span><br/></div>`)
                    return
                case "frenzy": case "!frenzyroll": rollType = rollType || "frenzy"
                    lockRoller(false)
                    args = `${STATEREF.frenzyRoll} ${args[0]}`.split(" ")
                    DB(`Parsing Frenzy Args: ${D.JS(args)}`, "!frenzyroll")
            /* falls through */
                case "disc": case "!discroll": case "!traitroll": rollType = rollType || "trait"
            /* falls through */
                case "rouse": case "!rouseroll": case "!rouserollobv": rollType = rollType || "rouse"
            /* falls through */
                case "rouse2": case "!rouse2roll": case "!rouse2rollobv": rollType = rollType || "rouse2"
            /* falls through */
                case "check": case "!checkroll": rollType = rollType || "check"
            /* falls through */
                case "willpower": case "!willpowerroll": rollType = rollType || "willpower"
            /* falls through */
                case "humanity": case "!humanityroll": rollType = rollType || "humanity"
            /* falls through */
                case "remorse": case "!remorseroll": rollType = rollType || "remorse"
            /* falls through */
                case "project": case "!projectroll": { rollType = rollType || "project"
                /* all continue below */
                    params = _.map(args.join(" ").split("|"), v => v.trim())
                    if (STATEREF.rollNextAs) {
                        params.shift()
                        char = D.GetChar(STATEREF.rollNextAs)
                        name = D.GetName(char)
                        delete STATEREF.rollNextAs
                    } else {
                        name = params.shift()
                        char = D.GetChar(name)
                    }
                    let rollFlags = _.clone(STATEREF.nextRollFlags)
                    DB(`Received Roll: ${D.JS(call)} ${name}|${params.join("|")}
                    ... PARAMS: [${D.JS(params.join(", "))}]
                    ... CHAROBJ: ${D.JS(char)}`, "handleInput")
                    if (!VAL({charobj: char}, "handleInput")) return
                    if (
                        ["check", "rouse", "rouse2"].includes(rollType) ||
                    rollType === "frenzy" && STATEREF.frenzyRoll && D.IsIn(STATEREF.frenzyRoll.slice("|")[0], _.map(D.GetChars("registered"), v => v.get("name")), true)
                    )
                        rollFlags = {
                            isHidingName: false,
                            isHidingTraits: false,
                            isHidingTraitVals: false,
                            isHidingDicePool: false,
                            isHidingDifficulty: false,
                            isHidingResult: false,
                            isHidingOutcome: false
                        }
                    if (STATEREF.isNextRollNPC && playerIsGM(msg.playerid)) {
                        STATEREF.isNextRollNPC = false
                        makeNewRoll(char, rollType, params, Object.assign(rollFlags, {isDiscRoll: call === "!discroll", isNPCRoll: true, isOblivionRoll: STATEREF.oblivionRouse === true}))
                        STATEREF.oblivionRouse = false
                    } else if (isLocked) {
                        return
                    } else if (playerIsGM(msg.playerid)) {
                        makeNewRoll(char, rollType, params, Object.assign(rollFlags, {isDiscRoll: call === "!discroll", isNPCRoll: false, isOblivionRoll: STATEREF.oblivionRouse === true}))
                        STATEREF.oblivionRouse = false             
                    } else {
                        makeNewRoll(char, rollType, params, {isDiscRoll: call === "!discroll", isNPCRoll: false, isOblivionRoll: call.includes("obv")})
                    }
                    delete STATEREF.frenzyRoll
                    break
                }
                case "!pcroll": {
                // D.Alert("PC roll called.", "!pcroll")
                    if (!playerIsGM(msg.playerid)) return
                    char = charObjs && charObjs[0] || D.GetChar(msg) || D.GetChar(args.join(" "))
                    if (char) {
                        STATEREF.rollNextAs = char.id
                        D.Alert(`Rolling Next As ${D.GetName(char)}`, "Roller: !pcroll")
                    }
                    break
                }
                case "!npcroll": // Run this to lock the roller and declare the NEXT roll to be an NPC roll.
                    if (!playerIsGM(msg.playerid)) return
                    STATEREF.isNextRollNPC = true
                    break
                case "!cleanRoller":
                    clearRoller()
                    break
                case "!buildFrame":
                    initFrame()
                    break
                case "!buildPads": 
                    makeSelectionPads()
                    break
                case "!clearAllDice":
                    clearDice(STATECATS.dice[0])
                    clearDice(STATECATS.dice[1])
                    break
                case "!makeAllDice":
                    diceNums = [parseInt(args.shift() || 25), parseInt(args.shift() || 2)]
                    makeAllDice(STATECATS.dice[0], diceNums[0])
                    makeAllDice(STATECATS.dice[1], diceNums[1])
                    break
                case "!showDice":
                    _.each(STATEREF.diceList, (v, dNum) => {
                        const thisDie = setDie(dNum, "diceList", "Hs")
                        if (_.isObject(thisDie)) 
                            thisDie.set("isdrawing", false)
                    
                    })
                    _.each(STATEREF.bigDice, (v, dNum) => {
                        const thisDie = setDie(dNum, "bigDice", "Bs")
                        if (_.isObject(thisDie)) 
                            thisDie.set("isdrawing", false)
                    
                    })
                    break
                case "!changeRoll":
                    changeRoll(parseInt(args.shift()))
                    break
                case "!changeNPCRoll":
                    changeRoll(parseInt(args.shift()), true)
                    break
                case "!prevRoll":
                    loadPrevRoll()
                    break
                case "!nextRoll":
                    loadNextRoll()
                    break
                case "!prevNPCRoll":
                    loadPrevRoll(true)
                    break
                case "!nextNPCRoll":
                    loadNextRoll(true)
                    break
                case "!resTest":
                    if (args[0] === "x")
                        args[0] = ""
                    if (args[1] === "x")
                        args[1] = ""
                    resonance = getResonance(...args)
                    break
                case "!getchareffects": {
                    const char = D.GetChar(msg)
                    if (!char) {
                        THROW("Select a character token first!", "!getchareffects")
                        break
                    }
                    const rollEffects = _.compact((getAttrByName(char.id, "rolleffects") || "").split("|")),
                        rollStrings = []
                    for (let i = 0; i < rollEffects.length; i++)
                        rollStrings.push(`${i + 1}: ${rollEffects[i]}`)
                    D.Alert(`Roll Effects on ${D.GetName(char)}:<br><br>${rollStrings.join("<br>")}`, "ROLLER: !getchareffects")
                    break
                }
                case "!getalleffects": {
                    const charObjs = D.GetChars("all"),
                        returnStrings = ["<h3>GLOBAL EFFECTS:</h3><!br>"]
                    for (let i = 0; i < _.keys(STATEREF.rollEffects).length; i++)
                        returnStrings.push(`${i + 1}: ${_.keys(STATEREF.rollEffects)[i]}`)
                    returnStrings.push("")              
                    returnStrings.push("<h3>CHARACTER EFFECTS:</h3><!br>")
                    for (const charObj of charObjs) {
                        const rollEffects = _.compact((getAttrByName(charObj.id, "rolleffects") || "").split("|"))
                        if (rollEffects.length) {
                            returnStrings.push(`<b>${charObj.get("name").toUpperCase()}</b>`)
                            for (let i = 0; i < rollEffects.length; i++)
                                returnStrings.push(`${i + 1}: ${rollEffects[i]}`)
                            returnStrings.push("")
                        }
                    }
                    D.Alert(returnStrings.join("<br>").replace(/<!br><br>/gu, ""), "Active Roll Effects")
                    break
                }
                case "!delchareffect": {
                    const charObj = D.GetChar(msg) || D.GetChar(args.shift())
                    if (VAL({charObj}, "!delchareffect")) {
                        const rollEffects = _.compact((getAttrByName(charObj.id, "rolleffects") || "").split("|"))
                        rollEffects.splice(Math.max(0, parseInt(args.shift()) - 1), 1)
                        setAttrs(charObj.id, {rolleffects: rollEffects.join("|")})
                        D.Alert(`Roll Effects on ${D.GetName(charObj)} revised to:<br><br>${rollEffects.join("<br>")}`, "ROLLER: !delchareffects")
                    }
                    break
                }
                case "!addchareffect":
                {
                    const chars = D.GetChars(msg)
                    for (const char of chars) {
                        const rollEffects = _.compact((getAttrByName(char.id, "rolleffects") || "").split("|"))
                        rollEffects.push(...args.join(" ").split("|"))
                        setAttrs(char.id, {rolleffects: _.uniq(rollEffects).join("|")})
                        D.Alert(`Roll Effects on ${D.GetName(char)} revised to:<br><br>${rollEffects.join("<br>")}`, "ROLLER: !addchareffect")
                    }
                    break
                }
                case "!getglobaleffects":
                {
                    const rollStrings = []
                    for (let i = 0; i < _.keys(STATEREF.rollEffects).length; i++)
                        rollStrings.push(`${i + 1}: ${_.keys(STATEREF.rollEffects)[i]}`)
                    D.Alert(`Global Roll Effects:<br><br>${rollStrings.join("<br>")}`, "ROLLER: !getglobaleffects")
                    break
                }
                case "!addglobalexclude":
                {
                    const charObj = D.GetChar(msg) || D.GetChar(args.shift())
                    if (VAL({charObj}, "!addglobalexclude")) {
                        let effectString = args.join(" ")
                        if (VAL({number: effectString}))
                            effectString = _.keys(STATEREF.rollEffects)[parseInt(effectString - 1)]
                        else
                            effectString = _.find(_.keys(STATEREF.rollEffects, v => D.FuzzyMatch(effectString, v)))
                        if (STATEREF.rollEffects[effectString]) {
                            STATEREF.rollEffects[effectString].push(charObj.id)
                            D.Alert(`Exclusions for effect <b>${D.JS(effectString)}</b>: ${D.JS(STATEREF.rollEffects[effectString])}`, "!addglobalexclude")
                        } else {
                            D.Alert(`No exclusion found for reference '${effectString}'`, "!addglobalexclude")
                        }
                    } else {
                        D.Alert("You must select a character token or supply a valid character reference (without spaces)!", "!addglobalexclude")
                    }
                    break
                }
                case "!delglobalexclude":
                {
                    const charObj = D.GetChar(msg) || D.GetChar(args.shift())
                    if (VAL({charObj}, "!delglobalexclude")) {
                        let effectString = args.join(" ")
                        if (VAL({number: effectString}))
                            effectString = _.keys(STATEREF.rollEffects)[parseInt(effectString - 1)]
                        else
                            effectString = _.find(_.keys(STATEREF.rollEffects, v => D.FuzzyMatch(effectString, v)))
                        if (!STATEREF.rollEffects[effectString]) {
                            const checkEffects = _.filter(STATEREF.rollEffects, v => v.includes(charObj.id))
                            if (checkEffects.length === 1)
                                effectString = _.keys(checkEffects)[0]
                            else if (checkEffects.length === 0)
                                D.Alert(`Character ${D.JS(charObj.get("name"))} is not listed in any roll effect exclusions.`, "!delglobalexclude")
                            else if (checkEffects.length > 1)
                                D.Alert(`Character ${D.JS(charObj.get("name"))} is present in multiple exclusions, please be more specific: ${D.JS(checkEffects, true)}`, "!delglobalexclude")

                        }
                        if (STATEREF.rollEffects[effectString]) {
                            STATEREF.rollEffects[effectString] = _.without(STATEREF.rollEffects[effectString], charObj.id)
                            D.Alert(`Exclusions for effect <b>${D.JS(effectString)}</b>: ${D.JS(STATEREF.rollEffects[effectString])}`, "!delglobalexclude")
                        } else {
                            D.Alert(`No exclusion found for reference '${effectString}'`, "!delglobalexclude")
                        }
                    } else {
                        D.Alert("You must select a character token or supply a valid character reference (without spaces)!", "!delglobalexclude")
                    }
                    break
                }
                case "!delglobaleffect":
                {
                    delete STATEREF.rollEffects[_.keys(STATEREF.rollEffects)[Math.max(0, parseInt(args.shift()) - 1)]]
                    D.Alert(`Global Roll Effects revised to:<br><br>${_.keys(STATEREF.rollEffects).join("<br>")}`, "ROLLER: !delglobaleffect")
                    break
                }
                case "!addglobaleffect":
                {
                    for (const effect of _.compact(args.join(" ").split("|")))
                        STATEREF.rollEffects[effect] = []
                    const rollStrings = []
                    for (let i = 0; i < _.keys(STATEREF.rollEffects).length; i++)
                        rollStrings.push(`${i + 1}: ${_.keys(STATEREF.rollEffects)[i]}`)
                    D.Alert(`Global Roll Effects:<br><br>${rollStrings.join("<br>")}`, "ROLLER: !getglobaleffects")
                    break
                }
                case "!fixbigdice":
                    clearDice("bigDice")
                    makeDie("bigDice")
                    makeDie("bigDice")
                    break
                case "!s": case "!sec": case "!secret":
                    switch (args.shift().toLowerCase()) {
                        case "name": case "identity":
                            STATEREF.nextRollFlags = {
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
                            STATEREF.nextRollFlags = {
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
                            STATEREF.nextRollFlags = {
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
                            STATEREF.nextRollFlags = {
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
                            STATEREF.nextRollFlags = {
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
                            STATEREF.nextRollFlags = {
                                isHidingName: false,
                                isHidingTraits: true,
                                isHidingTraitVals: true,
                                isHidingDicePool: true,
                                isHidingDifficulty: false,
                                isHidingResult: true,
                                isHidingOutcome: true
                            }
                            break
                        // no default                        
                    }
                    D.Alert(`Flag Status for Next Roll: ${D.JS(STATEREF.nextRollFlags, true)}`, "NEXT ROLL FLAGS")
                    break
                case "!setrollflags":
                    for (const flag of ["Name", "Traits", "TraitVals", "DicePool", "Difficulty", "Result", "Outcome"])
                        _.each(args, v => {
                            const isNegating = v.startsWith("!")
                            if (D.FuzzyMatch(flag, v.replace(/!/gu, "")))
                                STATEREF.nextRollFlags[`isHiding${flag}`] = !isNegating
                            if (D.FuzzyMatch("NPC", v.replace(/!/gu, "")))
                                STATEREF.isNextRollNPC = !isNegating
                        })
                    D.Alert(`Flag Status for Next Roll: ${D.JS(STATEREF.nextRollFlags, true)}<br><br>Is NPC Roll? ${STATEREF.isNextRollNPC}`, "NEXT ROLL FLAGS")
                    break
            // no default
            }
        }
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    let [isRerollFXOn, rerollFX, isLocked] = [false, null, false]

    // #region CONFIGURATION: Image Links, Color Schemes */
    const SETTINGS = {
            dice: {
                diceList: 30,
                bigDice: 2
            }
        },
        POSITIONS = {
            diceFrameFront: {
                top: () => 207,
                left: () => 175,
                height: () => 333,
                width: () => 300
            },
            diceFrameMidTop: {
                yShift: () => -116.5,
                xShift: () => 75,
                top: () => POSITIONS.diceFrameFront.top() + POSITIONS.diceFrameMidTop.yShift(),
                left: () => POSITIONS.diceFrameFront.left() + POSITIONS.diceFrameMidTop.xShift(),
                height: () => 101,
                width: () => POSITIONS.diceFrameFront.width()
            },
            diceFrameMidBottom: {
                yShift: () => 45,
                xShift: () => POSITIONS.diceFrameMidTop.xShift(),
                top: () => POSITIONS.diceFrameFront.top() + POSITIONS.diceFrameMidBottom.yShift(),
                left: () => POSITIONS.diceFrameFront.left() + POSITIONS.diceFrameMidBottom.xShift(),
                height: () => POSITIONS.diceFrameFront.height() - POSITIONS.diceFrameMidTop.height(),
                width: () => POSITIONS.diceFrameFront.width()
            },
            diceFrameEndTop: {
                top: () => POSITIONS.diceFrameFront.top() + POSITIONS.diceFrameMidTop.yShift(),
                left: () => POSITIONS.diceFrameFront.left() + 10 * POSITIONS.diceFrameMidTop.xShift(),
                height: () => POSITIONS.diceFrameMidTop.height(),
                width: () => POSITIONS.diceFrameFront.width()
            },
            diceFrameEndBottom: {
                top: () => POSITIONS.diceFrameFront.top() + POSITIONS.diceFrameMidBottom.yShift(),
                left: () => POSITIONS.diceFrameFront.left() + 10 * POSITIONS.diceFrameMidBottom.xShift(),
                height: () => POSITIONS.diceFrameFront.height() - POSITIONS.diceFrameEndTop.height(),
                width: () => POSITIONS.diceFrameMidBottom.width()
            },
            diceFrameDiffFrame: {
                top: () => 249,
                left: () => 80,
                height: () => 49,
                width: () => 98
            },
            diceFrameRerollPad: {
                top: () => 186,
                left: () => 73,
                height: () => 64,
                width: () => 64
            },
            dice: {
                diceList: {
                    top: 186,
                    left: 171,
                    height: 91,
                    width: 91,
                    pad: {
                        dX: 0,
                        dY: 0,
                        dH: -33,
                        dW: -35
                    },
                    spread: 56
                },
                bigDice: {
                    top: 185,
                    left: 185,
                    height: 147,
                    width: 147,
                    pad: {
                        dX: 0,
                        dY: 0,
                        dH: -47,
                        dW: -53
                    },
                    spread: 75
                }
            },
            bloodCloudFX: {
                top: 185,
                left: 74.75
            },
            bloodBoltFX: {
                top: 185,
                left: 74.75
            },
            smokeBomb: {
                top: 301,
                left: 126
            }
        },
        IMAGES = {
            diceList: {
                blank: "https://s3.amazonaws.com/files.d20.io/images/63990142/MQ_uNU12WcYYmLUMQcbh0w/thumb.png?1538455511", // Simple Blank PNG
                selected: "https://s3.amazonaws.com/files.d20.io/images/87031339/qYj5D-gURif-qN4xSMuzsA/thumb.png?1563696190",
                selectedFree: "https://s3.amazonaws.com/files.d20.io/images/87031341/LcuQLLoPqrcsgBqYZfC5AQ/thumb.png?1563696193",
                selectedDouble: "https://s3.amazonaws.com/files.d20.io/images/87031344/GLCqnybOBoY1a0gKN3KeBQ/thumb.png?1563696197",
                Bf: "https://s3.amazonaws.com/files.d20.io/images/87031347/5KnJOyDS1EqlvPL-XSr_Zw/thumb.png?1563696202",
                Bs: "https://s3.amazonaws.com/files.d20.io/images/87031351/dFCCFy_4TGY0oAKPx_97tA/thumb.png?1563696206",
                Bc: "https://s3.amazonaws.com/files.d20.io/images/87031356/kk7JrIgxOxDjsB7-Tx1Hgg/thumb.png?1563696210",
                BcL: "https://s3.amazonaws.com/files.d20.io/images/87032655/4aaFfq5J3JARalsoj-FojQ/thumb.png?1563697877",
                BcR: "https://s3.amazonaws.com/files.d20.io/images/87032656/_5dWegpwW40iJnX1KZbrhg/thumb.png?1563697881",
                Hb: "https://s3.amazonaws.com/files.d20.io/images/87031371/oJ0DAobJYHsJ-yqKp1JROg/thumb.png?1563696227",
                Hf: "https://s3.amazonaws.com/files.d20.io/images/87031372/tuAwFgBv2InNa4f3dG0lYQ/thumb.png?1563696231",
                Hs: "https://s3.amazonaws.com/files.d20.io/images/87031378/v5vwY2PkvetYTGN_EHMAqw/thumb.png?1563696235",
                Hc: "https://s3.amazonaws.com/files.d20.io/images/87031383/gVLuEp2mP4jlPytjzeoFFw/thumb.png?1563696239",
                HcL: "https://s3.amazonaws.com/files.d20.io/images/87032695/FrEXcG2S4W2wp42b1QxaVQ/thumb.png?1563697900",
                HcR: "https://s3.amazonaws.com/files.d20.io/images/87032700/VudTzvmWVMynpxS-5focJw/thumb.png?1563697904",
                HcRb: "https://s3.amazonaws.com/files.d20.io/images/87032703/65M52wU1gqyULUWinCabww/thumb.png?1563697907",
                HcLb: "https://s3.amazonaws.com/files.d20.io/images/87032708/Ui_y4n4driMHJv0mdYAn7A/thumb.png?1563697910",
                BXc: "https://s3.amazonaws.com/files.d20.io/images/91336100/ESSgeEN2h4llmYgujVpJjQ/thumb.png?1567943808",
                BXs: "https://s3.amazonaws.com/files.d20.io/images/91336101/xsSpdIN3Lktcq0275avnmw/thumb.png?1567943808",
                HXc: "https://s3.amazonaws.com/files.d20.io/images/87031427/FuGfrl1aiw9HTsVy46-m1A/thumb.png?1563696289",
                HXs: "https://s3.amazonaws.com/files.d20.io/images/87031430/ucYeuAXpDbaIjkqbzoRqWQ/thumb.png?1563696294",
                HXb: "https://s3.amazonaws.com/files.d20.io/images/87031432/JoFhDPGehZCF2wnpCU652w/thumb.png?1563696299",
                HCb: "https://s3.amazonaws.com/files.d20.io/images/87031435/8qE4d1bTkLGhK01Tgg-OGQ/thumb.png?1563696304"
            },
            bigDice: {
                blank: "https://s3.amazonaws.com/files.d20.io/images/63990142/MQ_uNU12WcYYmLUMQcbh0w/thumb.png?1538455511", // Simple Blank PNG
                selected: "https://s3.amazonaws.com/files.d20.io/images/87031660/sUuDsKDSc5EWReOhOyRfFw/thumb.png?1563696663",
                selectedFree: "https://s3.amazonaws.com/files.d20.io/images/87031668/ZXnVqbO7nfQA5-BuTKJQXQ/thumb.png?1563696668",
                selectedDouble: "https://s3.amazonaws.com/files.d20.io/images/87031670/BoAzpEDrxSvndz-imHV5-Q/thumb.png?1563696671",
                Bf: "https://s3.amazonaws.com/files.d20.io/images/87031671/HYJelRirzViDAhJzBsZ51w/thumb.png?1563696674",
                Hf: "https://s3.amazonaws.com/files.d20.io/images/87031674/bvrFCzyt8m7iOFLqzXTW-A/thumb.png?1563696679",
                Bs: "https://s3.amazonaws.com/files.d20.io/images/87031676/xpWcXpa175_ushoG8Ozy7g/thumb.png?1563696683",
                Of: "https://s3.amazonaws.com/files.d20.io/images/87031681/vTU_pKd-LzYrfHAzxhQNlg/thumb.png?1563696687",
                Os: "https://s3.amazonaws.com/files.d20.io/images/87031687/lR5ndvbW1mm-lweHIoLQcA/thumb.png?1563696692",
                Hb: "https://s3.amazonaws.com/files.d20.io/images/87031371/oJ0DAobJYHsJ-yqKp1JROg/thumb.png?1563696227"
            },
            blank: "https://s3.amazonaws.com/files.d20.io/images/63990142/MQ_uNU12WcYYmLUMQcbh0w/thumb.png?1538455511",
            diffFrame: "https://s3.amazonaws.com/files.d20.io/images/64184544/CnzRwB8CwKGg-0jfjCkT6w/thumb.png?1538736404",
            frontFrame: "https://s3.amazonaws.com/files.d20.io/images/69207356/uVICjIErtJxB_pVJsrukcA/thumb.png?1544984070",
            topMids: ["https://s3.amazonaws.com/files.d20.io/images/64683716/nPNGOLxzJ8WU0BzLNisuwg/thumb.png?1539327926",
                      "https://s3.amazonaws.com/files.d20.io/images/64683714/VPzeYN8xpO_cPmqg1rgFRQ/thumb.png?1539327926",
                      "https://s3.amazonaws.com/files.d20.io/images/64683715/xUCVS7pOmfS3ravsS2Vzpw/thumb.png?1539327926"],
            bottomMids: ["https://s3.amazonaws.com/files.d20.io/images/64683769/yVNOcNMVgUjGybRBVq3rTQ/thumb.png?1539328057",
                         "https://s3.amazonaws.com/files.d20.io/images/64683709/8JFF_j804fT92-JBncWJyw/thumb.png?1539327927",
                         "https://s3.amazonaws.com/files.d20.io/images/64683711/upnHr36sBnFYuQpkxoVm_A/thumb.png?1539327926"],
            topEnd: "https://s3.amazonaws.com/files.d20.io/images/64683713/4IwPjcY7x5ZCLJ9ey2lICA/thumb.png?1539327926",
            bottomEnd: "https://s3.amazonaws.com/files.d20.io/images/64683710/rJDVNhm6wMNhmQx1uIp13w/thumb.png?1539327926"
        },
        STATECATS = {
            dice: ["diceList", "bigDice"],
            graphic: ["imgList", "diceList", "bigDice"],
            text: ["textList"],
            path: ["shapeList"]
        },
        TEXTLINES = {
            rollerName: {
                font_family: "Candal",
                font_size: 32,
                top: 20,
                left: 45,
                color: C.COLORS.white,
                text: "rollerName",
                justification: "left"
            },
            mainRoll: {
                font_family: "Contrail One",
                font_size: 40,
                top: 92,
                left: 135,
                color: C.COLORS.white,
                text: "mainRoll",
                justification: "left"
            },
            posMods: {
                font_family: "Contrail One",
                font_size: 32,
                top: 115,
                left: 205,
                color: C.COLORS.white,
                text: "posMods",
                justification: "left"
            },
            negMods: {
                font_family: "Contrail One",
                font_size: 32,
                top: 115,
                left: 205,
                color: C.COLORS.red,
                text: "negMods",
                justification: "left"
            },
            redMods: {
                font_family: "Contrail One",
                font_size: 32,
                top: 166,
                left: 595,
                color: C.COLORS.red,
                text: "redMods",
                justification: "left"
            },
            goldMods: {
                font_family: "Contrail One",
                font_size: 32,
                top: 166,
                left: 595,
                color: C.COLORS.gold,
                text: "goldMods",
                justification: "left"
            },
            dicePool: {
                font_family: "Candal",
                font_size: 56,
                top: 91,
                left: 75,
                color: C.COLORS.white,
                text: "SS",
                justification: "center"
            },
            difficulty: {
                font_family: "Contrail One",
                font_size: 32,
                top: 253,
                left: 96,
                color: C.COLORS.white,
                text: "D",
                justification: "center"
            },
            resultCount: {
                font_family: "Candal",
                font_size: 56,
                top: 185,
                left: 75,
                color: C.COLORS.white,
                text: "RC",
                justification: "center"
            },
            margin: {
                font_family: "Candal",
                font_size: 72,
                top: 294,
                left: 133,
                color: C.COLORS.white,
                text: "M",
                justification: "center"
            },
            outcome: {
                font_family: "Contrail One",
                font_size: 100,
                top: 297,
                left: 200,
                color: C.COLORS.white,
                text: "outcome",
                justification: "left"
            },
            subOutcome: {
                font_family: "Contrail One",
                font_size: 32,
                top: 341,
                left: 360,
                color: C.COLORS.white,
                text: "subOutcome",
                justification: "left"
            }
        },
        COLORSCHEMES = {
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
                    bad: C.COLORS.orange,
                    worst: C.COLORS.brightred
                },
                subOutcome: {
                    best: C.COLORS.white,
                    good: C.COLORS.white,
                    bad: C.COLORS.orange,
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
                    bad: C.COLORS.orange,
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
                    bad: C.COLORS.orange,
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
                    bad: C.COLORS.orange,
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
                    bad: C.COLORS.orange,
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
                    bad: C.COLORS.orange,
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
                    bad: C.COLORS.orange,
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
                    bad: C.COLORS.orange,
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
        CHATSTYLES = {
            fullBox: `<div style="display: block;width: 259px;padding: 5px 5px;margin-left: -42px;color: ${C.COLORS.white};font-family: bodoni svtytwo itc tt;font-size: 16px;border: 3px outset ${C.COLORS.darkred};background: url('http://imgsrv.roll20.net/?src=imgur.com/kBl8aTO.jpg') center no-repeat;position: relative;">`,
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
            outcomeOrange: "<div style=\"display: block; width: 100%; height: 20px; line-height: 20px; text-align: center; font-weight: bold;\"><span style=\"color: orange; display: block; width: 100%;  font-size: 22px; font-family: 'Bodoni SvtyTwo ITC TT';\">",
            outcomeWhite: `<div style="display: block; width: 100%; height: 20px; line-height: 20px; text-align: center; font-weight: bold;"><span style="color: ${C.COLORS.white}; display: block; width: 100%;  font-size: 22px; font-family: 'Bodoni SvtyTwo ITC TT';">`,
            outcomeWhiteSmall: `<div style="display: block; margin-top: 5px; width: 100%; height: 14px; line-height: 14px; text-align: center; font-weight: bold;"><span style="color: ${C.COLORS.white}; display: block; width: 100%;  font-size: 14px; font-family: 'Bodoni SvtyTwo ITC TT';">`,
            subOutcomeRed: `<div style="display: block; width: 100%; height: 10px; line-height: 10px; text-align: center; font-weight: bold;"><span style="color: ${C.COLORS.brightred}; display: block; width: 100%;  font-size: 12px; font-family: 'Bodoni SvtyTwo ITC TT';">`,
            subOutcomeOrange: "<div style=\"display: block; width: 100%; height: 20px; line-height: 20px; text-align: center; font-weight: bold;\"><span style=\"color: orange; display: block; width: 100%;  font-size: 12px; font-family: 'Bodoni SvtyTwo ITC TT';\">",
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
                startPlayerBlock: `<div style="display: block; width: 280px; padding: 45px 5px; margin-left: -58px; margin-top: -22px; margin-bottom: -5px; color: ${C.COLORS.white}; font-family: Percolator; text-align: left; font-size: 16px; background: url('https://t4.ftcdn.net/jpg/00/78/66/11/240_F_78661103_aowhE8PWKrHRtoCUogPvkfWs22U54SuU.jpg') center no-repeat; background-size: 100% 100%; z-index: 100; position: relative;">`,
                playerTopLineStart: "<div style=\"display: block; margin-left: 28px;  width: 100%; font-size: 24px; font-family: Percolator; height: 12px; padding: 3px 0px; text-align: left;  margin-top: -16px;\">",
                playerBotLineStart: `<div style="width: 100%; margin-left: 48px; height: auto; line-height: 15px; display: block;  text-align: left; color: ${C.COLORS.white}; margin-top: 8px;">`,
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
            rollMod: ["nowpreroll", "doublewpreroll", "freewpreroll", "bestialcancelcrit", "bestialcancelsucc", "bestialcancelall", "totalfailure", "nomessycrit"]
        },
    // #endregion

    // #region Object Creation & Registration
        registerDie = (obj, category) => {            
            STATEREF[category] = STATEREF[category] || []
            if (VAL({graphic: obj}, "registerDie")) {
                obj.set({
                    imgsrc: IMAGES[category].blank,
                    layer: "walls",
                    isdrawing: true,
                    name: `rollerDie_${category}_${STATEREF[category].length}`,
                    controlledby: ""
                })
                Media.RegImg(obj, `rollerDie_${category}_${STATEREF[category].length}`, "blank", "map", false)
                STATEREF[category].push({
                    id: obj.id,
                    top: obj.get("top"),
                    left: obj.get("left"),
                    width: obj.get("width"),
                    height: obj.get("height"),
                    value: "blank"
                })
                D.Alert(`Registered die #${STATEREF[category].length}: ${D.JS(_.values(STATEREF[category]).slice(-1))}`, "ROLLER: registerDie()")

            // D.Alert(`Returning Die Object: ${D.JS(obj)}`)

                return obj
            }

            return THROW(`Invalid object: ${D.JS(obj)}`, "registerDie()")
        },
        makeDie = (category) => {
            STATEREF[category] = STATEREF[category] || []
            const posRef = POSITIONS.dice[category],
                die = createObj("graphic", {
                    _pageid: D.PAGEID,
                    imgsrc: IMAGES[category].Bf,
                    left: posRef.left + posRef.spread * STATEREF[category].length,
                    top: posRef.top,
                    width: posRef.width,
                    height: posRef.height,
                    layer: "map",
                    isdrawing: true,
                    controlledby: ""
                })
            die.set({
                left: posRef.left + posRef.spread * STATEREF[category].length,
                top: posRef.top,
                width: posRef.width,
                height: posRef.height,
            })
            // D.Alert(`Created Die: ${D.JS(die)}`)
            registerDie(die, category)

            return die
        },
        clearDice = category => {
            const diceObjs = _.filter(findObjs({
                _pageid: Campaign().get("playerpageid"),
                _type: "graphic"
            }), obj => obj.get("name").includes("rollerDie") && obj.get("name").includes(category))
            for (const die of diceObjs) {
                DragPads.DelPad(die.id)
                Media.RemoveImg(die.id)
            }
            STATEREF[category] = []
        },
        makeAllDice = (category, amount) => {
            clearDice(category)
            for (let i = 0; i < amount; i++)
                makeDie(category, category === STATECATS.dice[0])

        },
    // #endregion

    // #region Graphic & Text Control
        setColor = (line, type, params, level) => {
            if (VAL({string: type}, "setColor")) {
                if (type && !COLORSCHEMES[type])
                    THROW(`No Color Scheme for type '${D.JS(type)}'`, "setColor()")
                else if (VAL({string: line}) && !COLORSCHEMES[type][line])
                    THROW(`No Color Scheme for line '${D.JS(line)}' in '${D.JS(type)}'`, "setColor()")
                else if (VAL({string: level}) && !COLORSCHEMES[type][line][level])
                    THROW(`No Level '${D.JS(level)}' for '${D.JS(line)}' in '${D.JS(type)}'`, "setColor()")
                else if (!VAL({string: level}) && !VAL({string: COLORSCHEMES[type][line]}))
                    THROW(`Must provide Level for '${D.JS(line)}' in '${D.JS(type)}'`, "setColor()")
                else
                    params.color = level ? COLORSCHEMES[type][line][level] : COLORSCHEMES[type][line]
                return params
            }

            return false
        },
        clearRoller = () => {
            for (const textLine of _.keys(TEXTLINES))
                Media.ToggleText(textLine, false)
            _.each(STATEREF.diceList, (v, dNum) => {
                setDie(dNum, "diceList", "blank")
            })
            _.each(STATEREF.bigDice, (v, dNum) => {
                setDie(dNum, "bigDice", "blank")
            })
            scaleFrame("top", -1)
        },
    // #endregion

    // #region Dice Frame
        initFrame = () => {
            for (const name of _.keys(TEXTLINES))
                Media.RemoveText(name)
            Media.RemoveImg("wpRerollPlaceholder")
            Media.RemoveAllImgs("rollerImage")
            for (const cat of STATECATS.dice)
                clearDice(cat)
            for (const textLine of _.keys(TEXTLINES)) {
                Media.MakeText(textLine, "map", false, true, null, TEXTLINES[textLine])
                Media.ToggleText(textLine, false, true)
            }
            Media.MakeImage("rollerImage_frontFrame", {
                imgsrc: IMAGES.frontFrame,
                top: POSITIONS.diceFrameFront.top(),
                left: POSITIONS.diceFrameFront.left(),
                height: POSITIONS.diceFrameFront.height(),
                width: POSITIONS.diceFrameFront.width(),
                activeLayer: "map",
                startActive: true
            })
            for (let i = 0; i < 9; i++) {
                Media.MakeImage(`rollerImage_topMid_${i}`, {
                    imgsrc: IMAGES.topMids[i - 3 * Math.floor(i / 3)],
                    top: POSITIONS.diceFrameMidTop.top(),
                    left: POSITIONS.diceFrameMidTop.left() + i * POSITIONS.diceFrameMidTop.xShift(),
                    height: POSITIONS.diceFrameMidTop.height(),
                    width: POSITIONS.diceFrameMidTop.width(),
                    activeLayer: "map",
                    startActive: false
                })
                Media.MakeImage(`rollerImage_bottomMid_${i}`, {
                    imgsrc: IMAGES.bottomMids[i - 3 * Math.floor(i / 3)],
                    top: POSITIONS.diceFrameMidBottom.top(),
                    left: POSITIONS.diceFrameMidBottom.left() + i * POSITIONS.diceFrameMidBottom.xShift(),
                    height: POSITIONS.diceFrameMidBottom.height(),
                    width: POSITIONS.diceFrameMidBottom.width(),
                    activeLayer: "map",
                    startActive: false
                })
            }
            Media.MakeImage("rollerImage_topEnd", {
                imgsrc: IMAGES.topEnd,
                top: POSITIONS.diceFrameEndTop.top(),
                left: POSITIONS.diceFrameEndTop.left(),
                height: POSITIONS.diceFrameEndTop.height(),
                width: POSITIONS.diceFrameEndTop.width(),
                activeLayer: "map",
                startActive: true
            })
            Media.MakeImage("rollerImage_bottomEnd", {
                imgsrc: IMAGES.bottomEnd,
                top: POSITIONS.diceFrameEndBottom.top(),
                left: POSITIONS.diceFrameEndBottom.left(),
                height: POSITIONS.diceFrameEndBottom.height(),
                width: POSITIONS.diceFrameEndBottom.width(),
                activeLayer: "map",
                startActive: true
            })
            Media.MakeImage("rollerImage_diffFrame", {
                imgsrc: IMAGES.diffFrame,
                top: POSITIONS.diceFrameDiffFrame.top(),
                left: POSITIONS.diceFrameDiffFrame.left(),
                height: POSITIONS.diceFrameDiffFrame.height(),
                width: POSITIONS.diceFrameDiffFrame.width(),
                activeLayer: "map",
                startActive: false
            })
            Media.ToggleImg("rollerImage_diffFrame", false)
        // WP REROLL BUTTON
            Media.MakeImage("wpRerollPlaceholder", {
                imgsrc: IMAGES.blank,
                top: POSITIONS.diceFrameRerollPad.top(),
                left: POSITIONS.diceFrameRerollPad.left(),
                height: POSITIONS.diceFrameRerollPad.height(),
                width: POSITIONS.diceFrameRerollPad.width(),
                activeLayer: "map",
                startActive: false
            })
            for (const diceCat of _.keys(SETTINGS.dice))
                makeAllDice(diceCat, SETTINGS.dice[diceCat])
            Media.Initialize()
        },
        makeSelectionPads = () => {            
            DragPads.ClearAllPads("wpReroll")
            DragPads.ClearAllPads("selectDie")
            const wpImgObj = Media.GetImg("wpRerollPlaceholder")
            if (VAL({graphic: wpImgObj}, "makeSelectionPads")) 
                DragPads.MakePad(wpImgObj, "wpReroll", {
                    top: POSITIONS.diceFrameRerollPad.top(),
                    left: POSITIONS.diceFrameRerollPad.left(),
                    height: POSITIONS.diceFrameRerollPad.height(),
                    width: POSITIONS.diceFrameRerollPad.width(),
                    startActive: false
                })
            for (const category of STATECATS.dice)
                for (const dieData of STATEREF[category]) {
                    const dieObj = getObj("graphic", dieData.id),
                        padRef = POSITIONS.dice[category].pad              
                    DragPads.MakePad(dieObj, "selectDie", {
                        deltaHeight: padRef.dH,
                        deltaWidth: padRef.dW,
                        deltaLeft: padRef.dX,
                        deltaTop: padRef.dY
                    })
                }            
        },        
        scaleFrame = (row, width, isChangingOffRow = true) => {
            if (width < 0) {
                if (row === "top") {
                    Media.SetImg("rollerImage_frontFrame_1", "base")
                    for (const thisRow of isChangingOffRow ? ["top", "bottom"] : ["top"]) {
                        Media.SetImg(`rollerImage_${thisRow}End_1`, "base")
                        Media.SetImgTemp(`rollerImage_${thisRow}End_1`, {left: 300})
                        for (let i = 0; i < 9; i++)
                            Media.ToggleImg(`rollerImage_${thisRow}Mid_${i + 1}`, false)
                        Media.ToggleImg("rollerImage_diffFrame_1", false)
                    }
                } else {
                    Media.SetImg("rollerImage_frontFrame_1", "topOnly")
                    // D.Alert("Setting Front Frame to TopOnly")
                    Media.ToggleImg("rollerImage_bottomEnd_1", false)
                    for (let i = 0; i < 9; i++)
                        Media.ToggleImg(`rollerImage_bottomMid_${i + 1}`, false)
                }                
            } else {
                if (row === "bottom" || isChangingOffRow) {
                    Media.SetImg("rollerImage_frontFrame_1", "base")
                    Media.SetImg("rollerImage_bottomEnd_1", "base")
                }
                const stretchWidth = Math.max(width, 120),
                    imgs = [Media.GetImg(`rollerImage_${row}End`)],
                    blanks = [],
                    dbLines = []
                let [midCount, endImg, stretchPer, left] = [0, null, 0, null]
                while (stretchWidth > 225 * (imgs.length - 1)) {
                    imgs.push(Media.GetImg(`rollerImage_${row}Mid_${midCount + 1}`))
                    midCount++
                    if (midCount >= IMAGES[`${row}Mids`].length * 3) {
                        dbLines.push(`Need ${midCount - imgs.length + 2} more mid sections for ${row}`)
                        break
                    }
                }
                while (midCount < IMAGES[`${row}Mids`].length * 3) {
                    blanks.push(Media.GetImg(`rollerImage_${row}Mid_${midCount + 1}`))
                    midCount++
                }
                stretchPer = stretchWidth / imgs.length
                dbLines.push(`${row} stretchWidth: ${stretchWidth}, imgs Length: ${imgs.length}, x225 ${imgs.length * 225}, stretch per: ${stretchPer}`)
                dbLines.push(`${row} midCount: ${midCount}, blanks length: ${blanks.length}`)
                endImg = imgs.shift()
                left = POSITIONS.diceFrameFront.left() + (row === "top" ? 30 : 100)
                dbLines.push(`${row}Start at ${POSITIONS.diceFrameFront.left()}, + 120 to ${left}`)
                for (let i = 0; i < imgs.length; i++) {
                    dbLines.push(`Setting ${row}Mid${i + 1} to ${left}`)
                    /* Media.SetImgTemp(`rollerImage_${row}Mid_${i+1}`, {left: left})
                    Media.SetImg(`rollerImage_${row}Mid_${i+1}`, "base") */
                    Media.SetImgTemp(imgs[i], {left})
                    Media.SetImg(imgs[i], "base")
                    left += stretchPer
                }
                dbLines.push(`Setting ${row}End to ${left}`)
                Media.SetImgTemp(endImg, {left})
                for (let j = 0; j < blanks.length; j++)
                    Media.ToggleImg(blanks[j], false)

                /* const frameEndObj = Media.GetImg("rollerImage_bottomEnd_1"),
                    frameRightSide = frameEndObj.get("left") + 0.5 * frameEndObj.get("width")
                if (row === "bottom") {
                    Media.SetText("redMods", {left: frameRightSide, shiftleft: 20 })
                    Media.SetText("goldMods", {left: frameRightSide, shiftleft: Media.GetTextWidth("redMods") + 40 })
                } */

                DB(dbLines.join("<br>"), "scaleFrame")
            }
        },
    // #endregion

    // #region Dice Graphic Control
        setDie = (dieNum, dieCat = "diceList", dieVal, params = {}, rollType = "") => {
            const funcName = "setDie",	// eslint-disable-line no-unused-vars
                dieRef = STATEREF[dieCat][dieNum],
                dieParams = {
                    id: dieRef.id
                },
                die = getObj("graphic", dieParams.id)
            if (!die)
                return THROW(`ROLLER: SETDIE(${dieNum}, ${dieCat}, ${dieVal}) >> No die registered.`, "setDie")

            if (dieVal !== "selected") {
                dieRef.value = dieVal
                STATEREF.selected[dieCat] = _.without(STATEREF.selected[dieCat], dieNum)
            }
            DragPads.Toggle(dieParams.id, !["humanity", "project", "secret", "remorse", "willpower"].includes(rollType) && dieVal !== "blank" && !dieVal.includes("H"))
            dieParams.imgsrc = IMAGES[dieCat][dieVal]
            _.each(["top", "left", "width"], dir => {
                if (die.get(dir) !== dieRef[dir] || params.shift && params.shift[dir])
                    dieParams[dir] = dieRef[dir] + (params.shift && params.shift[dir] ? params.shift[dir] : 0)
            })
            Media.ToggleImg(die.get("name"), dieVal !== "blank", false)
        // DB(`Die Params for ${D.JS(dieCat)}-${D.JS(dieVal)}: ${D.JS(dieParams)}`, "setDie")
            try {
                die.set(dieParams)
            } catch (errObj) {
                return THROW(`Failed to set die ${D.JS(dieCat)}:${D.JS(dieVal)} with params: ${D.JS(dieParams, true)}`, "setDie", errObj)
            }

            return die
        },
        selectDie = (dieNum, dieCat) => {
            const rollRecord = getCurrentRoll(false)
            STATEREF.selected[dieCat] = STATEREF.selected[dieCat] || []
            if (STATEREF.selected[dieCat].includes(dieNum)) {
                setDie(dieNum, dieCat, STATEREF[dieCat][dieNum].value)
                STATEREF.selected[dieCat] = _.without(STATEREF.selected[dieCat], dieNum)
            } else {
                const selectImg = rollRecord.rollResults.wpCost === 0 ? "selectedFree" :
                    rollRecord.rollResults.wpCost === 1 ? "selected" :
                        "selectedDouble"
                setDie(dieNum, dieCat, selectImg)
                STATEREF.selected[dieCat].push(dieNum)
                if (STATEREF.selected[dieCat].length > 3)
                    selectDie(STATEREF.selected[dieCat][0], dieCat)
            }
            if (STATEREF.selected[dieCat].length && !isRerollFXOn) {
                isRerollFXOn = true
                lockRoller(true)
                D.RunFX("bloodCloud1", POSITIONS.bloodCloudFX)
                rerollFX = setInterval(D.RunFX, 1800, "bloodCloud1", POSITIONS.bloodCloudFX)
                DragPads.Toggle("wpReroll", true)
            } else if (STATEREF.selected[dieCat].length === 0) {
                isRerollFXOn = false
                lockRoller(false)
                clearInterval(rerollFX)
                rerollFX = null
                DragPads.Toggle("wpReroll", false)
            }
        },
    // #endregion

    // #region Getting Information & Setting State Roll Record
        applyRollEffects = rollInput => {
            const rollEffectString = getAttrByName(rollInput.charID, "rolleffects") || ""
            let isReapplying = false
            DB(`<h3>APPLYING ROLL EFFECTS.</h3>... ${rollEffectString}<br><br>${D.JS(rollInput)}`, "applyRollEffects")
            if (VAL({string: rollEffectString, list: rollInput}, "applyRollEffects")) {
                rollInput.appliedRollEffects = rollInput.appliedRollEffects || []
                const rollEffects = _.compact(_.without(_.uniq([...rollEffectString.split("|"), ..._.keys(STATEREF.rollEffects), ...rollInput.rollEffectsToReapply || []]), ...rollInput.appliedRollEffects)),
                    [rollData, rollResults] = rollInput.rolls ? [null, rollInput] : [rollInput, null],
                    checkInput = (input, rollMod, restriction) => {
                        DB(`Checking Input. RollMod: ${rollMod}, Restriction: ${restriction}<br>... Boolean(input.rolls): ${Boolean(input.rolls)}<br>... D.IsIn: ${Boolean(D.IsIn(restriction, ROLLRESULTEFFECTS.restriction, true) || D.IsIn(rollMod, ROLLRESULTEFFECTS.rollMod, true))}`, "checkInput")
                        return Boolean(input.rolls) === Boolean(D.IsIn(restriction, ROLLRESULTEFFECTS.restriction, true) || D.IsIn(rollMod, ROLLRESULTEFFECTS.rollMod, true))
                    },
                    checkRestriction = (input, traits, flags, rollMod, restriction) => {
                        DB(`Checking Restriction '${D.JS(restriction)}'<br>...TRAITS: ${D.JS(traits)}<br>...FLAGS: ${D.JS(flags)}<br>...MOD: ${D.JS(rollMod)}`, "checkRestriction")
                        // FIRST, check whether this restriction applies to the given input (either rollData or rollResults):
                        if (!checkInput(input, rollMod, restriction)) {
                            DB("... checkInput returns FALSE: returning 'INAPPLICABLE'.", "checkRestriction")
                            return "INAPPLICABLE"
                        }
                        DB("... checkInput returns TRUE: continuing validation.", "checkRestriction")
                        if (restriction === "all") {
                            DB("Restriction = ALL:  RETURNING TRUE", "checkRestriction")
                            return true
                        }
                        if (rollResults) {
                        // Does rollMod specify a willpower cost, but it is superceded by a nowpreroll restriction somewhere in the effect?
                            switch (rollMod) {
                                case "doublewpreroll": case "freewpreroll":
                                    if (_.any(rollEffects, v => v.includes("nowpreroll"))) {
                                        DB(`Willpower cost ${rollMod} SUPERCEDED by 'nowpreroll': ${D.JS(rollEffects)}`, "checkRestriction")
                                        return "INAPPLICABLE"
                                    }
                                    break
                            // no default
                            }
                            // TEST: If rollResults and rollInput specifies a result restriction, check if it applies.
                            const effectiveMargin = input.total - (input.diff || 1) // All rolls have a base difficulty of one if difficulty isn't specified.
                            switch (restriction) {
                                case "success":
                                    DB(`Restriction = ${restriction}.  EffectiveMargin = ${effectiveMargin} SO Returning ${effectiveMargin >= 0}`, "checkRestriction")
                                    return effectiveMargin >= 0
                                case "failure":
                                    DB(`Restriction = ${restriction}.  EffectiveMargin = ${effectiveMargin} SO Returning ${effectiveMargin < 0}`, "checkRestriction")
                                    return effectiveMargin < 0
                                case "basicfail":
                                    DB(`Restriction = ${restriction}.  EffectiveMargin = ${effectiveMargin} SO Returning ${effectiveMargin < 0 && input.H.botches === 0 && input.B.succs + input.H.succs > 0}`, "checkRestriction")
                                    return effectiveMargin < 0 && input.H.botches === 0 && input.B.succs + input.H.succs > 0 // fail AND not bestial fail AND not total fail
                                case "critical":
                                    DB(`Restriction = ${restriction}.  EffectiveMargin = ${effectiveMargin} SO Returning ${effectiveMargin >= 0 && input.critPairs.bb + input.critPairs.hb + input.critPairs.hh > 0}`, "checkRestriction")
                                    return effectiveMargin >= 0 && input.critPairs.bb + input.critPairs.hb + input.critPairs.hh > 0
                                case "basiccrit":
                                    DB(`Restriction = ${restriction}.  EffectiveMargin = ${effectiveMargin} SO Returning ${effectiveMargin >= 0 && input.critPairs.bb > 0 && input.critPairs.hh + input.critPairs.hb === 0}`, "checkRestriction")
                                    return effectiveMargin >= 0 && input.critPairs.bb > 0 && input.critPairs.hh + input.critPairs.hb === 0
                                case "messycrit":
                                    DB(`Restriction = ${restriction}.  EffectiveMargin = ${effectiveMargin} SO Returning ${effectiveMargin >= 0 && input.critPairs.hh + input.critPairs.hb > 0}`, "checkRestriction")
                                    return effectiveMargin >= 0 && input.critPairs.hh + input.critPairs.hb > 0
                                case "bestialfail":
                                    DB(`Restriction = ${restriction}.  EffectiveMargin = ${effectiveMargin} SO Returning ${effectiveMargin < 0 && input.H.botches > 0}`, "checkRestriction")
                                    return effectiveMargin < 0 && input.H.botches > 0
                                case "totalfail":
                                    DB(`Restriction = ${restriction}.  EffectiveMargin = ${effectiveMargin} SO Returning ${input.B.succs + input.H.succs === 0}`, "checkRestriction")
                                    return input.B.succs + input.H.succs === 0
                            // no default
                            }
                        }
                        // After assessing rollData/rollResults-specific restrictions, check restrictions that apply to either:
                        DB("Initial Thresholds PASSED.  Moving on to general restrictions.", "checkRestriction")
                        if (D.IsIn(restriction, C.CLANS, true)) {
                            DB(`Restriction = CLAN.  Character Clan: ${getAttrByName(input.charID, "clan")}`, "checkRestriction")
                            if (!D.IsIn(getAttrByName(input.charID, "clan"), restriction, true)) {
                                DB("... Check FAILED.  Returning FALSE", "checkRestriction")
                                return false
                            }
                            DB("... Check PASSED. Moving on...", "checkRestriction")
                        } else if (D.IsIn(restriction, C.SECTS, true)) {
                            DB(`Restriction = SECT.  Character Sect: ${getAttrByName(input.charID, "sect")}`, "checkRestriction")
                            if (!D.IsIn(getAttrByName(input.charID, "sect"), restriction, true)) {
                                DB("... Check FAILED.  Returning FALSE", "checkRestriction")
                                return false
                            }
                            DB("... Check PASSED. Moving on...", "checkRestriction")
                        // TEST: If restriction is "physical", "social" or "mental", does an appropriate trait match?
                        } else if (D.IsIn(restriction, ["physical", "mental", "social"], true)) {
                            DB(`Restriction = ARENA.  Trait Keys: ${D.JS(_.keys(traits))}`, "checkRestriction")
                            if (!_.intersection(_.map([...C.ATTRIBUTES[restriction], ...C.SKILLS[restriction]], v => v.toLowerCase()), _.keys(traits)).length) {
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
                            DB(`... ${D.JS(loc)} vs. ${D.JS(locations)}`, "checkRestriction")
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
                        } else if (!D.IsIn(restriction, [..._.keys(traits), ..._.keys(flags)], true)) {
                            DB(`TRAIT/FLAG check FAILED for: ${D.JS(_.keys(traits))} and ${D.JS(_.keys(flags))}, returning FALSE`, "checkRestriction")
                            return false
                        }
                    // If effect passes all of the threshold tests, return true.
                        DB("All Threshold Checks Passed!  Returning TRUE", "checkRestriction")
                        return true
                    }

                DB(`Roll Effects: ${D.JS(rollEffects)}`, "applyRollEffects")
                for (const effectString of rollEffects) {
                // First, check if the global effect state variable holds an exclusion for this character ID AND effect isn't in rollEffectsToReapply.
                    if (STATEREF.rollEffects[effectString] && STATEREF.rollEffects[effectString].includes(rollInput.charID))
                        continue
                // Parse the effectString for all of the relevant parameters
                    let [rollRestrictions, rollMod, rollLabel, removeWhen] = effectString.split(";"),
                        [rollTarget, rollTraits, rollFlags] = ["", {}, {}];
                    [rollMod, rollTarget] = _.map(rollMod.split(":"), v => parseInt(v) || v.toLowerCase())
                    rollRestrictions = _.map(rollRestrictions.split("+"), v => v.toLowerCase())
                    rollTraits = _.object(
                        _.map(_.keys(rollInput.traitData), v => v.toLowerCase()),
                        _.map(_.values(rollInput.traitData), v => parseInt(v.value) || 0)
                    )
                // Before parsing rollFlags, filter out the ones that have already been converted into strings:
                    DB(`Checking Filtered Flag Error: ${D.JS([...rollInput.posFlagLines, ...rollInput.negFlagLines, ...rollInput.redFlagLines, ...rollInput.goldFlagLines])}`, "applyRollEffects")
                    const filteredFlags = _.reject([...rollInput.posFlagLines, ...rollInput.negFlagLines, ...rollInput.redFlagLines, ...rollInput.goldFlagLines], v => _.isString(v))
                    rollFlags = _.object(
                        _.map(filteredFlags, v => v[1].toLowerCase().replace(/\s*?\(●*?\)/gu, "")),
                        _.map(filteredFlags, v => v[0])
                    )
                    DB(`Roll Traits: ${D.JS(rollTraits)}<br>Roll Flags: ${D.JSH(rollFlags)}`, "applyRollEffects")

                // THRESHOLD TEST OF ROLLTARGET: IF TARGET SPECIFIED BUT DOES NOT EXIST, SKIP PROCESSING THIS ROLL EFFECT.
                    if (VAL({string: rollTarget}) && !D.IsIn(rollTarget, _.keys(rollTraits), true) && !D.IsIn(rollTarget, _.keys(rollFlags), true)) {
                        DB(`Roll Target ${rollTarget} NOT present, SKIPPING EFFECT.`, "applyRollEffects")
                        continue
                    }

                // THRESHOLD TESTS OF RESTRICTION: Parse each "AND" roll restriction into "OR" restrictions (/), and finally the "NOT" restriction (!)
                    let isEffectOK = true
                    DB(`BEGINNING TESTS OF RESTRICTION: "<b><u>${D.JS(effectString)}</u></b><br>... --- ${rollRestrictions.length} AND-RESTRICTIONS: ${D.JS(rollRestrictions)}`, "applyRollEffects")
                    for (const andRestriction of rollRestrictions) {
                        const orRestrictions = andRestriction.split("/")
                        DB(`... Checking AND-RESTRICTION <b>'${D.JS(andRestriction)}'</b>.  ${orRestrictions.length} OR-RESTRICTIONS: ${D.JS(orRestrictions)}`, "applyRollEffects")
                        let isEffectValid = false
                        for (const restriction of orRestrictions) {
                            if (restriction.charAt(0) === "!") {
                                DB(`... ... Checking <u>NEGATED</u> OR-RESTRICTION <b>'${D.JS(restriction)}'</b>...`, "applyRollEffects")
                                isEffectValid = checkRestriction(rollInput, rollTraits, rollFlags, rollMod, restriction.slice(1)) === false
                            } else {
                                DB(`... ... Checking OR-RESTRICTION <b>'${D.JS(restriction)}'</b>...`, "applyRollEffects")
                                isEffectValid = checkRestriction(rollInput, rollTraits, rollFlags, rollMod, restriction) === true
                            }
                            if (isEffectValid)
                                break
                        }
                        DB(`IsEffectValid = ${D.JS(isEffectValid)}`, "applyRollEffects")
                        if (!isEffectValid) {
                            isEffectOK = false
                            break
                        }
                    }
                    DB(`IsEffectOKAY = ${D.JS(isEffectOK)}`, "applyRollEffects")
                    if (!isEffectOK)
                        continue

                    DB("Threshold Tests Passed!", "applyRollEffects")
                // THRESHOLD TESTS PASSED.  CHECK FOR 'ISONCEONLY' AND FIRE IT ACCORDINGLY
                // If "isOnceOnly" set, add an exclusion to the global state variable OR remove this effect from the character-specific attribute.
                    switch (removeWhen || "never") {
                        case "never":
                            break
                        case "once":
                            if (STATEREF.rollEffects[effectString])
                                STATEREF.rollEffects[effectString] = _.union(STATEREF.rollEffects[effectString], [rollInput.charID])
                            else
                                setAttrs(rollInput.charID, {rolleffects: _.compact(getAttrByName(rollInput.charID, "rolleffects").replace(effectString, "").replace(/\|\|/gu, "|").split("|")).join("|")})
                            break
                        default:

                            break
                    }
                // FIRST ROLLMOD PASS: CONVERT TO NUMBER.
                // Check whether parsing RollData or RollResults
                    let isEffectMoot = false
                    if (VAL({list: rollData})) {
                        DB(`Validated RollData: ${D.JS(rollData)}`, "applyRollEffects")
                    // Is rollMod a number?
                        if (VAL({number: rollMod})) {
                        // If rollMod is a number, Is there a rollTarget?
                            if (VAL({string: rollTarget}))
                            // If so, is the rollTarget present in traits?
                                if (D.IsIn(rollTarget, _.keys(rollTraits), true))
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
                                rollMod = parseInt(getAttrByName(rollData.charID, rollMod.replace(/postrait/gu, ""))) || 0
                            else if (rollMod.includes("negtrait"))
                                rollMod = -1 * (parseInt(getAttrByName(rollData.charID, rollMod.replace(/negtrait/gu, ""))) || 0)
                        // If not postrait/negtrait, is it a multiplier?
                            else if (rollMod.startsWith("x") && VAL({number: rollMod.replace(/x/gu, "")}))
                            // If so, is there a rollTarget?
                                if (VAL({string: rollTarget})) {
                                // If so, is the rollTarget present in traits?
                                    if (D.IsIn(rollTarget, _.keys(rollTraits), true))
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
                                    DB(`RegExData: ${D.JS(regexData)}`, "applyRollEffects")
                                    let isContinuing = true
                                // Identify the target: either a trait or a flag. Start with traits (since flags will sometimes reference them,
                                // and if they do, you want to apply the effect to the trait).
                                    for (const trait of _.keys(rollData.traitData))
                                        if (D.FuzzyMatch(rollData.traitData[trait].display, regexData.traitString)) {
                                            DB(`... Trait Found: ${D.JS(rollData.traitData[trait])}`, "applyRollEffects")
                                            rollData.traitData[trait].display = rollData.traitData[trait].display.replace(new RegExp(regexData.regexString, "gu"), regexData.replaceString)
                                            rollData.traitData[trait].value = Math.max(0, rollData.traitData[trait].value + rollMod)
                                            DB(`... Changed To: ${D.JS(rollData.traitData[trait])}`, "applyRollEffects")
                                            isContinuing = false
                                            break
                                        }
                                // If none found, check the flags:
                                    for (const flagType of ["posFlagLines", "negFlagLines", "redFlagLines", "goldFlagLines"]) {
                                        if (!isContinuing) break
                                        for (let i = 0; i < rollData[flagType].length; i++)
                                            if (D.FuzzyMatch(rollData[flagType][i][1], regexData.traitString)) {
                                                DB(`... Flag Found: ${D.JS(rollData[flagType][i][1])}`, "applyRollEffects")
                                                isContinuing = false
                                                rollData[flagType][i] = [
                                                    rollData[flagType][i][0] + rollMod,
                                                    rollData[flagType][i][1].replace(new RegExp(regexData.regexString, "gu"), regexData.replaceString)
                                                ]
                                                DB(`... Changed To: ${D.JS(rollData[flagType][i][1])}`, "applyRollEffects")
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

                        DB(`INTERIM Roll Results: ${D.JS(rollResults)}`, "applyRollEffects")

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
                    DB(`ROLL DATA AFTER EFFECTS: ${D.JS(rollData)}`, "applyRollEffects")
                    return rollData
                } else {
                    DB(`ROLL RESULTS AFTER EFFECTS: ${D.JS(rollResults)}`, "applyRollEffects")
                    return rollResults
                }
            }
            return THROW(`Bad Roll Input!${D.JS(rollInput)}`, "applyRollEffects")
        },
        parseFlags = (charObj, rollType, params = {}, rollFlags) => {
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
                bloodPot = parseInt(getAttrByName(charObj.id, "blood_potency")) || 0
            if (["rouse", "rouse2", "remorse", "check", "project", "secret", "humanity"].includes(rollType))
                return flagData
            if (parseInt(getAttrByName(charObj.id, "applyspecialty")) > 0)
                flagData.posFlagLines.push([1, "Specialty (<.>)"])
            if (parseInt(getAttrByName(charObj.id, "applyresonance")) > 0)
                flagData.posFlagLines.push([1, "Resonance (<.>)"])
            if (parseInt(getAttrByName(charObj.id, "applybloodsurge")) > 0)
                flagData.posFlagLines.push([C.BLOODPOTENCY[bloodPot].bp_surge, "Blood Surge (<.>)"])
            if (rollFlags.isDiscRoll)
                flagData.posFlagLines.push([C.BLOODPOTENCY[bloodPot].bp_discbonus, "Discipline (<.>)"])

            _.each(_.compact(_.flatten([
                getAttrByName(charObj.id, "incap") ? getAttrByName(charObj.id, "incap").split(",") : [],
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
                DB(`Pos Flag Data: ${D.JS(flagData)}<br>... ZIPPED: ${D.JS(zippedPos)}<br>... UNZIPPED: ${D.JS(unzippedPos)}<br>... REDUCED: ${D.JS(reducedPos)}`, "parseFlags")
                const zippedNeg = _.compact([...flagData.negFlagLines, ...flagData.redFlagLines]),
                    unzippedNeg = _.unzip(zippedNeg),
                    reducedNeg = _.reduce(unzippedNeg[0], (sum, mod) => sum + mod, 0)
                DB(`Neg Flag Data: ${D.JS(flagData)}<br>... ZIPPED: ${D.JS(zippedNeg)}<br>... UNZIPPED: ${D.JS(unzippedNeg)}<br>... REDUCED: ${D.JS(reducedNeg)}`, "parseFlags")
                flagData.posFlagMod = reducedPos
                flagData.negFlagMod = reducedNeg
                flagData.flagDiceMod = reducedPos + reducedNeg
            }

            return flagData
        },
        parseTraits = (charObj, rollType, params = {}) => {
            let traits = _.compact((params && params.args && params.args[1] || _.isArray(params) && params[0] || _.isString(params) && params || "").split(","))
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
                        value: parseInt(tData[1])
                    }
                    if (rollType === "frenzy" && tData[0] === "humanity") {
                        tFull.traitData.humanity.display = "⅓ Humanity"
                        tFull.traitData.humanity.value = Math.floor(tFull.traitData.humanity.value / 3)
                    } else if (rollType === "remorse" && tData[0] === "stains") {
                        tFull.traitData.humanity.display = "Human Potential"
                        tFull.traitData.humanity.value = 10 - tFull.traitData.humanity.value - parseInt(tData[1])
                        tFull.traitList = _.without(tFull.traitList, "stains")
                        delete tFull.traitData[tData[0]]
                    }
                } else if (!_.isNaN(parseInt(trt))) {
                    tFull.mod = parseInt(trt)
                    tFull.traitList = _.without(tFull.traitList, trt)
                } else {
                    tFull.traitData[trt] = {
                        display: D.IsIn(trt) || D.IsIn(trt.replace(/_/gu, " ")) || getAttrByName(charObj.id, `${trt}_name`) || getAttrByName(charObj.id, `${trt.replace(/_/gu, " ")}_name`),
                        value: parseInt(getAttrByName(charObj.id, trt) || getAttrByName(charObj.id, trt.replace(/_/gu, " "))) || 0
                    }
                    if (rollType === "frenzy" && trt === "humanity") {
                        tFull.traitData.humanity.display = "⅓ Humanity"
                        tFull.traitData.humanity.value = Math.floor(tFull.traitData.humanity.value / 3)
                    } else if (rollType === "remorse" && trt === "humanity") {
                        tFull.traitData.humanity.display = "Human Potential"
                        tFull.traitData.humanity.value = 10 -
                            tFull.traitData.humanity.value -
                            (parseInt(getAttrByName(charObj.id, "stains")) || 0)
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
            const flagData = parseFlags(charObj, rollType, params, rollFlags = {}),
                traitData = parseTraits(charObj, rollType, params),
                rollData = {
                    charID: charObj.id,
                    type: rollType,
                    hunger: parseInt(getAttrByName(charObj.id, "hunger")),
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
                    rollFlags,                
                    isNPCRoll: rollFlags.isNPCRoll,
                    isOblivionRoll: rollFlags.isOblivionRoll,
                    isDiscRoll: rollFlags.isDiscRoll
                }
            rollData.charName = D.GetName(charObj)
            switch (rollType) {
                case "remorse":
                    rollData.diff = 0
                    rollData.mod = 0
                    break
                case "project":
                    rollData.diff = parseInt(params[1] || 0)
                    rollData.mod = parseInt(params[2] || 0)
                    rollData.diffMod = parseInt(params[3] || 0)
                    rollData.prefix = ["repeating", "project", D.GetRepStat(charObj, "project", params[4]).rowID, ""].join("_")
                    STATEREF.lastProjectPrefix = rollData.prefix
                    STATEREF.lastProjectCharID = rollData.charID
                    DB(`PROJECT PREFIX: ${D.JS(rollData.prefix)}`, "getRollData")
                    break
                case "secret":
                    rollData.diff = 0
                    rollData.mod = _.isNumber(traitData.mod) ? traitData.mod : 0
                    break
                case "frenzy":
                    rollData.diff = parseInt(params[0] || 0)
                    rollData.mod = parseInt(params[1] || 0)
                    break
                default:
                    rollData.diff = rollData.diff === null ? parseInt(getAttrByName(charObj.id, "rolldiff")) : rollData.diff
                    rollData.mod = rollData.mod === null ? parseInt(getAttrByName(charObj.id, "rollmod")) : rollData.mod
                    break
            }

            if (["remorse", "project", "humanity", "frenzy", "willpower", "check", "rouse", "rouse2"].includes(rollType))
                rollData.hunger = 0

            DB(`INITIAL ROLL DATA: ${D.JS(rollData)}`, "getRollData")

            return rollData
        },
        getCurrentRoll = (isNPCRoll) => (isNPCRoll ? STATEREF.NPC : STATEREF).rollRecord[(isNPCRoll ? STATEREF.NPC : STATEREF).rollIndex],
        setCurrentRoll = (rollIndex, isNPCRoll) => { (isNPCRoll ? STATEREF.NPC : STATEREF).rollIndex = rollIndex },
        replaceRoll = (rollData, rollResults, rollIndex) => {
            const recordRef = rollResults.isNPCRoll ? STATEREF.NPC : STATEREF
            recordRef.rollIndex = rollIndex || recordRef.rollIndex
            recordRef.rollRecord[recordRef.rollIndex] = {
                rollData: _.clone(rollData),
                rollResults: _.clone(rollResults)
            }
        },
        recordRoll = (rollData, rollResults) => {
            const recordRef = rollResults.isNPCRoll ? STATEREF.NPC : STATEREF
            // Make sure appliedRollEffects in both rollData and rollResults contains all of the applied effects:
            rollData.appliedRollEffects = _.uniq([...rollData.appliedRollEffects, ...rollResults.appliedRollEffects])
            rollResults.appliedRollEffects = [...rollData.appliedRollEffects]
            recordRef.rollRecord.unshift({
                rollData: _.clone(rollData),
                rollResults: _.clone(rollResults)
            })
            recordRef.rollIndex = 0
            DB(`FINAL ROLL DATA: ${D.JS(recordRef.rollRecord[0].rollData)}<br><br>FINAL ROLL RESULTS: ${D.JS(recordRef.rollRecord[0].rollResults)}`, "recordRoll")
            if (recordRef.rollRecord.length > 10)
                recordRef.rollRecord.pop()
        },
    // #endregion

    // #region Rolling Dice & Formatting Result
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
                        rollData.dicePool += parseInt(v.value) || 0
                    })
                    rollData.dicePool += parseInt(rollData.mod) || 0
                    break
            }
            if (rollData.traits.length === 0 && rollData.dicePool <= 0) {
                D.Chat(D.GetChar(rollData.charID), "You have no dice to roll!", "ERROR: Dice Roller")

                return false
            }
            rollData.hungerPool = Math.min(rollData.hunger, Math.max(1, rollData.dicePool))
            rollData.basePool = Math.max(1, rollData.dicePool) - rollData.hungerPool
            DB(`ROLL DATA: ${D.JS(rollData)}`, "buildDicePool")

            const rollDataEffects = applyRollEffects(rollData)

            return rollDataEffects

        /* Var specialties = [];
			   _.each(rollData.traits, (trt) => {
			   RollData.traitData[trt] = {
			   Display: D.IsIn(trt) || D.IsIn(getAttrByName(charObj.id, trt + "_name")),
			   Value: parseInt(getAttrByName(charObj.id, trt)) || 0
			   };
			   If (rollData.type === "frenzy" && trt === "Humanity") {
			   RollData.traitData.Humanity.display = "⅓ Humanity";
			   RollData.traitData.Humanity.value = Math.floor(rollData.traitData.Humanity.value / 3);
			   } else if (rollData.type === "remorse" && trt === "Humanity") {
			   RollData.traitData.Humanity.display = "Human Potential";
			   RollData.traitData.Humanity.value = 10 - rollData.traitData.Humanity.value
			   - (parseInt(getAttrByName(charObj.id, "Stains")) || 0);
			   } else {
			   If (rollData.flags.includes("S")) {
			   _.each(getSpecialty(charObj, trt), (spec) => {
			   Specialties.push(spec);
			   });
			   }
			   If (!rollData.traitData[trt].display) {
			   D.Chat(charObj,
			   "Error determining NAME of trait '" + D.JS(trt) + "'.", "ERROR: Dice Roller");
			   Return false;
			   };
			   };
			   RollData.dicePool += rollData.traitData[trt].value;
			   });
			   If (specialties.length) {
			   RollData.posFlagLines.push("Specialty: " + specialties.join(", ") + " (●)");
			   RollData.dicePool++;
			   }
			   _.each(rollData.flags, (flag) => {
			   Return;
			   });
			   RollData.dicePool = Math.max(0, rollData.dicePool); */
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
            DB(`ROLL DATA: ${D.JS(rollData)}`, "rollDice")
            if (addVals)
                DB(`ADDED VALS: ${D.JS(addVals)}`, "rollDice")
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
                    for (let i = 0; i < parseInt(v); i++)
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
                    if (rollData.isOblivionRoll) 
                        rollResults.diceVals = _.map(rollResults.rolls, rol =>
                            parseInt(rol.slice(1)) === 1 ? "Of" :
                                parseInt(rol.slice(1)) === 10 ? "Os" :
                                    parseInt(rol.slice(1)) < 6 ? "Hb" : "Bs")
                    else
                        rollResults.diceVals = _.map(rollResults.rolls, rol => parseInt(rol.slice(1)) < 6 ? "Hb" : "Bs")
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
                    rollResults.diceVals = _.map(rollResults.rolls, rol => parseInt(rol.slice(1)) < 6 ? "Hf" : "Bs")
                    break
                default:
                    break
            }
            if (!(rollResults.commit && rollResults.commit === 0)) {
                const scope = rollData.diff - rollData.diffMod - 2
                rollResults.commit = Math.max(1, scope + 1 - rollResults.margin)
            }
            DB(`ROLL RESULTS: ${D.JS(rollResults)}`, "rollDice")

            rollResults = applyRollEffects(Object.assign(rollResults, rollData))
            


            // Now run through again to find consecutive crits and apply them:

            


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
                [deltaAttrs, txtWidths] = [{}, {}],
                [mainRollParts, mainRollLog, stRollParts, stRollLog, diceObjs] = [[], [], [], [], []],
                [posFlagLines, negFlagLines, redFlagLines, goldFlagLines] = [
                    _.union(rollData.posFlagLines || [], rollResults.posFlagLines || []),
                    _.union(rollData.negFlagLines || [], rollResults.negFlagLines || []),
                    _.union(rollData.redFlagLines || [], rollResults.redFlagLines || []),
                    _.union(rollData.goldFlagLines || [], rollResults.goldFlagLines || [])
                ],
                yShift = 0,
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
                p = v => rollData.prefix + v,
                displayName = rollFlags.isHidingName ? "someone" : rollData.charName
            let [blankLines, introPhrase, logPhrase, logString, stString, stains, margin, total, bookends, spread] = new Array(10).fill(null),
                maxHumanity = 10,
                diceCats = _.clone(STATECATS.dice)
            DB(`Retrieved ROLL DATA: ${D.JS(rollData)}<br><br>ROLL RESULTS: ${D.JS(rollResults)}`, "displayRoll")
            switch (rollData.type) {
                case "project":
                    rollLines.subOutcome = {
                        text: ""
                    }
                /* falls through */
                case "trait":
                    /* if (Session.IsTesting) {
                        posFlagLines.push("TestPosFlag (●●)")
                        negFlagLines.push("TestNegFlag (●●●●)")
                        redFlagLines.push("TestRedFlag (●●●●●)")
                        goldFlagLines.push("TestGoldFlag (●)")
                    } */
                    // D.Alert(`posFlagLines.length: ${posFlagLines.length}<br>${D.JS(posFlagLines)}`)
                    if (posFlagLines.length && !rollFlags.isHidingDicePool && !rollFlags.isHidingTraits) {
                        rollLines.posMods = {
                            text: `+ ${posFlagLines.join(" + ")}`,
                        }
                        rollLines.mainRoll.shifttop = -20
                        if (rollFlags.isHidingTraitVals)
                            rollLines.posMods.text = rollLines.posMods.text.replace(/\(?[+-]*?[\d●~]+?\)?/gu, "")
                    }
                    if (negFlagLines.length && !(rollFlags.isHidingDicePool && rollFlags.isHidingTraits)) {
                        rollLines.negMods = {
                            text: `- ${negFlagLines.join(" - ")}`,
                            shiftleft: 20 + Media.GetTextWidth("posMods", rollLines.posMods ? rollLines.posMods.text : " ")
                        }
                        rollLines.mainRoll.shifttop = -20
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
                        if (redFlagLines.length)
                            rollLines.redMods.shifttop = 40
                    }
                /* falls through */
                case "willpower":
                case "humanity":
                    rollLines.margin = {
                        text: ""
                    }
                /* falls through */
                case "frenzy":
                    if (rollData.diff > 0)
                        rollLines.difficulty = {
                            text: ""
                        }

                /* falls through */
                case "remorse":
                case "rouse2":
                case "rouse":
                case "check":
                    rollLines.dicePool = {
                        text: ""
                    }
                    rollLines.resultCount = {
                        text: ""
                    }
                    rollLines.outcome = {
                        text: "",
                        justified: "left"
                    }
                    break
                default:
                    return THROW(`Unrecognized rollType: ${D.JS(rollData.rollType)}`, "APPLYROLL: START")
            }

            if (rollData.diff === 0)
                Media.SetImg("rollerImage_diffFrame", "blank")

            _.each(_.keys(rollLines), line => {
                if (_.isString(COLORSCHEMES[rollData.type][line]))
                    rollLines[line] = setColor(line, rollData.type, rollLines[line])
            })

            _.each(rollLines, (content, name) => {
                switch (name) {
                    case "mainRoll":
                        switch (rollData.type) {
                            case "remorse":
                                introPhrase = introPhrase || `Does ${displayName} feel remorse?`
                                logPhrase = logPhrase || " rolls remorse:"
                            /* falls through */
                            case "frenzy":
                                introPhrase = introPhrase || `${D.Capitalize(displayName)} and the Beast wrestle for control...`
                                logPhrase = logPhrase || " resists frenzy:"
                            /* falls through */
                            case "project":
                                introPhrase = introPhrase ||
                                    `${D.Capitalize(displayName)} launches a Project:`
                                logPhrase = logPhrase ||
                                    " launches a Project:"
                            /* falls through */
                            case "trait":
                            case "willpower":
                            case "humanity":
                                introPhrase = introPhrase || `${D.Capitalize(displayName)} rolls: `
                                logPhrase = logPhrase || " rolls:"
                                _.each(rollData.traits, trt => {
                                    let dotline = "●".repeat(rollData.traitData[trt].value)
                                    switch (trt) {
                                        case "stains":
                                            dotline = ""
                                        /* falls through */
                                        case "humanity":
                                            stains = Math.max(parseInt(getAttrByName(rollData.charID, "stains") || 0), 0)
                                            if (rollData.type === "frenzy") {
                                                stains = Math.max(stains === 0 ? 0 : 1, Math.floor(stains / 3))
                                                maxHumanity = 4
                                            }
                                            if (rollData.type === "remorse")
                                                dotline = "◌".repeat(Math.max(maxHumanity - dotline.length - stains, 0)) + dotline + "◌".repeat(stains)
                                            else
                                                dotline += "◌".repeat(Math.max(maxHumanity - dotline.length - (stains || 0)), 0) + "‡".repeat(stains || 0)
                                            break
                                        case "willpower": // Stains
                                            dotline += "◌".repeat(Math.max(0, parseInt(getAttrByName(rollData.charID, "willpower_max")) - parseInt(rollData.traitData[trt].value)))
                                            break
                                        default:
                                            if (rollData.traitData[trt].value === 0)
                                                dotline = "~"
                                            break
                                    }
                                    if (trt !== "stains") {
                                        if (rollFlags.isHidingTraitVals) {
                                            mainRollParts.push(
                                                `${rollData.traitData[trt].display}`
                                            )
                                            mainRollLog.push(
                                                `${rollData.traitData[trt].display}`
                                            )
                                        } else {
                                            mainRollParts.push(
                                                `${rollData.traitData[trt].display} (${dotline})`
                                            )
                                            mainRollLog.push(
                                                `${rollData.traitData[trt].display} (${rollData.traitData[trt].value})`
                                            )
                                        }
                                        stRollParts.push(`${rollData.traitData[trt].display} (${dotline})`)
                                        stRollLog.push(`${rollData.traitData[trt].display} (${rollData.traitData[trt].value})`)
                                    }

                                })    
                                // LogLines.rollerName += logPhrase;
                                rollLines.rollerName.text = introPhrase
                                if (rollFlags.isHidingTraits)
                                    rollLines.mainRoll.text = rollFlags.isHidingDicePool ? "Some Dice" : `${rollData.dicePool + -1 * (rollData.negFlagMod || 0)} Dice`
                                else
                                    rollLines.mainRoll.text = mainRollParts.join(" + ")
                                logLines.mainRoll = CHATSTYLES.mainRoll + (rollFlags.isHidingTraits ?
                                    rollFlags.isHidingDicePool ? "Some Dice" : `${rollData.dicePool + -1 * (rollData.negFlagMod || 0)} Dice` :
                                    mainRollLog.join(" + "))
                                stLines.mainRoll = CHATSTYLES.mainRoll + stRollLog.join(" + ")
                                if (rollData.mod && rollData.mod !== 0)
                                    if (rollData.traits.length === 0 && rollData.mod > 0) {
                                        rollLines.mainRoll.text = `${rollFlags.isHidingDicePool ? "Some" : rollData.mod} Dice`
                                        logLines.mainRoll = `${CHATSTYLES.mainRoll + (rollFlags.isHidingDicePool ? "Some" : rollData.mod)} Dice`
                                        stLines.mainRoll = `${CHATSTYLES.mainRoll + rollData.mod} Dice`
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
                                }
                                break
                            case "rouse2":
                                rollLines.mainRoll.text = " (Best of Two)"
                                logLines.mainRollSub = `${CHATSTYLES.mainRollSub}(Best of Two)</span>`
                                stLines.mainRollSub = logLines.mainRollSub
                            /* falls through */
                            case "rouse":
                                introPhrase = introPhrase || `${D.Capitalize(displayName)}:`
                                logPhrase = logPhrase || ":"
                                logLines.mainRoll = `${CHATSTYLES.check}${rollData.isOblivionRoll ? "Oblivion " : ""}Rouse Check`
                                stLines.mainRoll = logLines.mainRoll
                                rollLines.mainRoll.text = `${rollData.isOblivionRoll ? "Oblivion " : ""}Rouse Check${rollLines.mainRoll.text}`
                                break
                            case "check":
                                introPhrase = introPhrase || `${D.Capitalize(displayName)}:`
                                logPhrase = logPhrase || ":"
                                logLines.mainRoll = `${CHATSTYLES.check}Simple Check`
                                stLines.mainRoll = logLines.mainRoll
                                rollLines.mainRoll.text = "Simple Check"
                                break
                            default:
                                introPhrase = introPhrase || `${D.Capitalize(displayName)}:`
                                logPhrase = logPhrase || ":"
                        }
                        logLines.rollerName = logPhrase
                        stLines.rollerName = logPhrase.replace(new RegExp(displayName, "gu"), rollData.charName)
                        rollLines.rollerName.text = introPhrase || ""
                        break
                    case "dicePool":
                        rollLines.dicePool.text = JSON.stringify(rollData.dicePool)
                        break
                    case "difficulty":                  
                        if (!rollResults.isNPCRoll) {
                            if (rollData.diff === 0 && rollData.diffMod === 0) {
                                rollLines.difficulty.text = " "
                                Media.SetImg("rollerImage_diffFrame", "blank")
                                break
                            }
                            Media.SetImg("rollerImage_diffFrame", "base")
                            rollLines.difficulty = {
                                text: rollData.diff.toString()
                            }
                        }
                        logLines.difficulty = ` vs. ${rollData.diff}`
                        if (rollData.type === "project")
                            deltaAttrs[p("projectlaunchresultsummary")] += ` vs. Difficulty ${rollData.diff}`
                        stLines.difficulty = logLines.difficulty
                        if (rollFlags.isHidingDifficulty) {
                            delete rollLines.difficulty
                            logLines.difficulty = ""
                        }
                        break
                    case "resultCount":
                        rollLines.resultCount.text = JSON.stringify(rollResults.total)
                        break
                    case "margin":
                        ({margin} = rollResults)
                        if (!margin) {
                            rollLines.margin.text = " "
                            break
                        }
                        rollLines.margin.text = (margin > 0 ? "+" : margin === 0 ? "" : "-") + Math.abs(margin)
                        logLines.margin = ` (${margin > 0 ? "+" : margin === 0 ? "" : "-"}${Math.abs(margin)})${logLines.margin}`
                        rollLines.margin = setColor("margin", rollData.type, rollLines.margin, margin >= 0 ? "good" : "bad")
                        stLines.margin = logLines.margin
                        if (rollFlags.isHidingDifficulty || rollFlags.isHidingResult) {
                            delete rollLines.margin
                            logLines.margin = ""
                        }
                        break
                    case "outcome":
                        ({total, margin} = rollResults)
                        switch (rollData.type) {
                            case "project":
                                rollLines.outcome.shift = {top: -10}
                                if (total === 0) {
                                    logLines.outcome = `${CHATSTYLES.outcomeRed}TOTAL FAILURE!</span></div>`
                                    logLines.subOutcome = `${CHATSTYLES.subOutcomeRed}Enemies Close In</span></div>`
                                    rollLines.outcome.text = "TOTAL FAILURE!"
                                    rollLines.subOutcome.text = "Your Enemies Close In..."
                                    rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "worst")
                                    rollLines.subOutcome = setColor("subOutcome", rollData.type, rollLines.subOutcome, "worst")
                                    deltaAttrs[p("projectlaunchresultsummary")] += ":   TOTAL FAIL"
                                    deltaAttrs[p("projectlaunchresults")] = "TOTAL FAIL"
                                    deltaAttrs[p("projectlaunchresultsmargin")] = "You've Angered Someone..."
                                } else if (margin < 0) {
                                    logLines.outcome = `${CHATSTYLES.outcomeOrange}FAILURE!</span></div>`
                                    logLines.subOutcome = `${CHATSTYLES.subOutcomeOrange}+1 Difficulty to Try Again</span></div>`
                                    rollLines.outcome.text = "FAILURE!"
                                    rollLines.subOutcome.text = "+1 Difficulty to Try Again"
                                    rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "bad")
                                    rollLines.subOutcome = setColor("subOutcome", rollData.type, rollLines.subOutcome, "bad")
                                    delete deltaAttrs[p("projectlaunchresultsummary")]
                                    deltaAttrs[p("projectlaunchdiffmod")] = rollData.diffMod + 1
                                    deltaAttrs[p("projectlaunchdiff")] = rollData.diff + 1
                                } else if (rollResults.critPairs.bb > 0) {
                                    logLines.outcome = `${CHATSTYLES.outcomeWhite}CRITICAL WIN!</span></div>`
                                    logLines.subOutcome = `${CHATSTYLES.subOutcomeWhite}No Commit Needed!</span></div>`
                                    rollLines.outcome.text = "CRITICAL WIN!"
                                    rollLines.subOutcome.text = "No Commit Needed!"
                                    rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "best")
                                    rollLines.subOutcome = setColor("subOutcome", rollData.type, rollLines.subOutcome, "best")
                                    deltaAttrs[p("projectlaunchresultsummary")] += ":   CRITICAL WIN!"
                                    deltaAttrs[p("projectlaunchresults")] = "CRITICAL WIN!"
                                    deltaAttrs[p("projectlaunchresultsmargin")] = "No Stake Needed!"
                                } else {
                                    logLines.outcome = `${CHATSTYLES.outcomeWhite}SUCCESS!</span></div>`
                                    logLines.subOutcome = `${CHATSTYLES.subOutcomeWhite}Stake ${rollResults.commit} Dot${rollResults.commit > 1 ? "s" : ""}</span></div>`
                                    rollLines.outcome.text = "SUCCESS!"
                                    rollLines.subOutcome.text = `Stake ${rollResults.commit} Dot${rollResults.commit > 1 ? "s" : ""}`
                                    rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "best")
                                    rollLines.subOutcome = setColor("subOutcome", rollData.type, rollLines.subOutcome, "best")
                                    deltaAttrs[p("projecttotalstake")] = rollResults.commit
                                    deltaAttrs[p("projectlaunchresultsmargin")] = `(${rollResults.commit} Stake Required, ${rollResults.commit} to Go)`
                                    deltaAttrs[p("projectlaunchresultsummary")] += `:   ${total} SUCCESS${total > 1 ? "ES" : ""}!`
                                    deltaAttrs[p("projectlaunchresults")] = "SUCCESS!"
                                }
                                break
                            case "trait":
                                if ((total === 0 || margin && margin < 0) && rollResults.H.botches > 0) {
                                    rollLines.outcome.text = "BESTIAL FAILURE!"
                                    logLines.outcome = `${CHATSTYLES.outcomeRed}BESTIAL FAILURE!</span></div>`
                                    rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "worst")
                                    break
                                } else if (!rollResults.noMessyCrit && (!margin || margin >= 0) && rollResults.critPairs.hb + rollResults.critPairs.hh > 0) {
                                    rollLines.outcome.text = "MESSY CRITICAL!"
                                    logLines.outcome = `${CHATSTYLES.outcomeRed}MESSY CRITICAL!</span></div>`
                                    rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "worst")
                                    break
                                }
                            /* falls through */
                            case "willpower":
                            case "humanity":
                                if (total === 0) {
                                    rollLines.outcome.text = "TOTAL FAILURE!"
                                    logLines.outcome = `${CHATSTYLES.outcomeRed}TOTAL FAILURE!</span></div>`
                                    rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "worst")
                                } else if (margin < 0) {
                                    logLines.outcome = `${CHATSTYLES.outcomeOrange}COSTLY SUCCESS?</span></div>`
                                    rollLines.outcome.text = "COSTLY SUCCESS?"
                                    rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "bad")
                                } else if (rollResults.critPairs.hh + rollResults.critPairs.bb + rollResults.critPairs.hb > 0) {
                                    logLines.outcome = `${CHATSTYLES.outcomeWhite}CRITICAL WIN!</span></div>`
                                    rollLines.outcome.text = "CRITICAL WIN!"
                                    rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "best")
                                } else {
                                    logLines.outcome = `${CHATSTYLES.outcomeWhite}SUCCESS!</span></div>`
                                    rollLines.outcome.text = "SUCCESS!"
                                    rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "good")
                                }
                                break
                            case "frenzy":
                                if (total === 0 || margin < 0) {
                                    rollLines.outcome.text = "YOU FRENZY!"
                                    logLines.outcome = `${CHATSTYLES.outcomeRed}FRENZY!</span></div>`
                                    rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "worst")
                                } else if (rollResults.critPairs.bb > 0) {
                                    rollLines.outcome.text = "RESISTED!"
                                    logLines.outcome = `${CHATSTYLES.outcomeWhite}RESISTED!</span></div>`
                                    rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "best")
                                } else {
                                    rollLines.outcome.text = "RESTRAINED..."
                                    logLines.outcome = `${CHATSTYLES.outcomeWhite}RESTRAINED...</span></div>`
                                    rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "good")
                                }
                                break
                            case "remorse":
                                deltaAttrs.stains = -1 * parseInt(getAttrByName(rollData.charID, "stains") || 0)
                                if (rollResults.total === 0) {
                                    rollLines.outcome.text = "YOUR HUMANITY FADES..."
                                    logLines.outcome = `${CHATSTYLES.outcomeRed}DEGENERATION</span></div>`
                                    deltaAttrs.humanity = -1
                                    rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "bad")
                                } else {
                                    rollLines.outcome.text = "YOU FIND ABSOLUTION!"
                                    logLines.outcome = `${CHATSTYLES.outcomeWhite}ABSOLUTION</span></div>`
                                    rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "good")
                                }
                                break
                            case "rouse":
                            case "rouse2":
                                if (rollResults.diceVals.length === 2 && rollResults.total > 0 && _.any(rollResults.diceVals, v => v.includes("O")) && _.any(rollResults.diceVals, v => v.includes("H"))) {
                                    rollLines.outcome.text = "RESTRAINT AT A COST?"
                                    rollLines.subOutcome = {text: "Choose: Humanity or Hunger?"}
                                    logLines.outcome = `${CHATSTYLES.outcomePurple}HUMANITY or HUNGER?</span></div>`
                                    rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "tainted")
                                    rollLines.subOutcome = setColor("subOutcome", rollData.type, rollLines.subOutcome, "tainted")
                                } else if (_.all(rollResults.diceVals, v => v.includes("O"))) {
                                    if (rollResults.total > 0) {
                                        rollLines.outcome.text = "SMOTHERED..."
                                        rollLines.subOutcome = {text: "The Abyss drags you deeper..."}
                                        logLines.outcome = `${CHATSTYLES.outcomePurple}RESTRAINED but TAINTED</span></div>`
                                        rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "grey")
                                        rollLines.subOutcome = setColor("subOutcome", rollData.type, rollLines.subOutcome, "tainted")
                                        deltaAttrs.stains = 1
                                    } else {
                                        rollLines.outcome.text = "THE HUNGRY DARK"                                        
                                        rollLines.subOutcome = {text: "The Abyss drags you deeper..."}
                                        logLines.outcome = `${CHATSTYLES.outcomePurple}ROUSED and TAINTED!</span></div>`
                                        rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "worst")
                                        rollLines.subOutcome = setColor("subOutcome", rollData.type, rollLines.subOutcome, "tainted")
                                        deltaAttrs.stains = 1
                                        deltaAttrs.hunger = 1
                                    }
                                } else if (rollResults.total > 0) {
                                    rollLines.outcome.text = "RESTRAINED..."
                                    logLines.outcome = `${CHATSTYLES.outcomeWhite}RESTRAINED</span></div>`
                                    rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "good")
                                } else {
                                    rollLines.outcome.text = "HUNGER ROUSED!"
                                    logLines.outcome = `${CHATSTYLES.outcomeRed}ROUSED!</span></div>`
                                    rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "worst")
                                    deltaAttrs.hunger = 1
                                }
                                break
                            case "check":
                                if (rollResults.total > 0) {
                                    rollLines.outcome.text = "PASS"
                                    logLines.outcome = `${CHATSTYLES.outcomeWhite}PASS</span></div>`
                                    rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "good")
                                } else {
                                    rollLines.outcome.text = "FAIL"
                                    logLines.outcome = `${CHATSTYLES.outcomeRed}FAIL</span></div>`
                                    rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "worst")
                                }
                                break
                            default:
                                THROW(`Unrecognized rollType: ${D.JS(rollData.rollType)}`, "APPLYROLL: MID")
                                break
                        }
                        stLines.outcome = logLines.outcome
                        stLines.subOutcome = logLines.subOutcome
                        if (rollFlags.isHidingOutcome) {
                            delete rollLines.outcome
                            delete rollLines.subOutcome
                            logLines.outcome = ""
                            logLines.subOutcome = ""
                        }
                        break
                    default:
                        break
                }
            })

            if (rollFlags.isHidingDicePool)
                delete rollLines.dicePool
            if (rollFlags.isHidingResult)
                delete rollLines.resultCount                
            if (rollFlags.isHidingDifficulty)
                Media.SetImg("rollerImage_diffFrame", "blank")      

            if (_.isNumber(deltaAttrs.hunger))
                Media.SetImg(`Hunger${getAttrByName(rollData.charID, "sandboxquadrant")}_1`, Number(getAttrByName(rollData.charID, "hunger")) + deltaAttrs.hunger)

            logLines.rollerName = `${CHATSTYLES.rollerName + D.Capitalize(displayName) + logLines.rollerName}</div>`
            stLines.rollerName = `${CHATSTYLES.rollerName + rollData.charName + stLines.rollerName}</div>`
            if ((logLines.mainRoll + logLines.difficulty).replace(/<div.*?span.*?>/gu, "").length > 40)
                for (const abbv of _.keys(C.ATTRABBVS))
                    logLines.mainRoll = logLines.mainRoll.replace(new RegExp(C.ATTRABBVS[abbv], "gui"), abbv)
            if ((logLines.mainRoll + logLines.difficulty).replace(/<div.*?span.*?>/gu, "").length > 40)
                for (const abbv of _.keys(C.SKILLABBVS))
                    logLines.mainRoll = logLines.mainRoll.replace(new RegExp(C.SKILLABBVS[abbv], "gui"), abbv)
            if ((stLines.mainRoll + stLines.difficulty).replace(/<div.*?span.*?>/gu, "").length > 40)
                for (const abbv of _.keys(C.ATTRABBVS))
                    stLines.mainRoll = stLines.mainRoll.replace(new RegExp(C.ATTRABBVS[abbv], "gui"), abbv)
            if ((stLines.mainRoll + stLines.difficulty).replace(/<div.*?span.*?>/gu, "").length > 40)
                for (const abbv of _.keys(C.SKILLABBVS))
                    stLines.mainRoll = stLines.mainRoll.replace(new RegExp(C.SKILLABBVS[abbv], "gui"), abbv)
            logLines.mainRoll = `${logLines.mainRoll + logLines.difficulty}</span>${logLines.mainRollSub}</div>`
            stLines.mainRoll = `${stLines.mainRoll + stLines.difficulty}</span>${stLines.mainRollSub}</div>`
            logLines.resultDice = formatDiceLine(rollData, rollResults, 13, rollFlags)
            stLines.resultDice = formatDiceLine(rollData, rollResults, 13)
            logString = `${logLines.fullBox + logLines.rollerName + logLines.mainRoll + logLines.resultDice}`
            if (rollFlags.isHidingOutcome)
                logString += "</div>"
            else
                logString += `${logLines.outcome + logLines.subOutcome }</div>`
            stString = `${`${stLines.fullBox + stLines.rollerName + stLines.mainRoll + stLines.resultDice + stLines.outcome + stLines.subOutcome }</div>`}`

            DB(`Chat Frame (LogLine) HTML:<br>${D.JSC(logLines)}`, "displayRoll")

            blankLines = _.without(_.keys(TEXTLINES), ..._.keys(rollLines))

            DB(`ROLL LINES:<br>@T@${D.JS(_.keys(rollLines))}<br>BLANKING LINES:<br>@T@${D.JS(blankLines)}`, "displayRoll")
            _.each(blankLines, line => {
                rollLines[line] = {
                    text: " "
                }
                Media.ToggleText(line, false)
            })
            if (["rouse", "rouse2", "check"].includes(rollData.type))
                diceCats = diceCats.reverse()

            DB(`Is NPC Roll?  ${rollResults.isNPCRoll}`, "displayRoll")
            if (!rollResults.isNPCRoll) {
                DB(`Setting Category: '${D.JS(diceCats[0])}' (total dice: ${D.JS(STATEREF[diceCats[0]].length)})<br>Showing Dice: [${D.JS(_.reject(_.map(STATEREF[diceCats[0]], vv => vv.value), v => v === "blank").join(", "))}]`, "displayRoll")

                let filteredDice = rollResults.diceVals
                
                if (rollFlags.isHidingDicePool && rollFlags.isHidingResult)
                    filteredDice = []
                else if (rollFlags.isHidingDicePool)
                    filteredDice = _.map(_.reject(rollResults.diceVals, v => ["Bf", "Hb", "Hf", "BXc", "BXs", "HXc", "HXs", "HXb", "HCb"].includes(v)), v => v.replace(/H/gu, "B"))
                else if (rollFlags.isHidingResult)
                    filteredDice = _.map(rollResults.diceVals, () => "Bf")

                for (let i = 0; i < STATEREF[diceCats[0]].length; i++)
                    diceObjs.push(setDie(i, diceCats[0], filteredDice[i] || "blank", {
                        type: rollData.type,
                        shift: {
                            top: yShift
                        }
                    }, rollData.type))
                
                    
                bookends = [diceObjs[0], diceObjs[filteredDice.length - 1]]

                if (filteredDice.length && (!bookends || bookends.length < 2 || _.isUndefined(bookends[0]) || _.isUndefined(bookends[1])))
                    return THROW(`Bookends Not Found.  DiceObjs.length is ${diceObjs.length}, rollResults.diceVals is ${rollResults.diceVals.length}: ${D.JS(diceObjs)}`, "displayRoll")

                spread = !filteredDice.length ? -1 : bookends[1].get("left") - bookends[0].get("left")

                scaleFrame("bottom", spread)
                for (let i = 0; i < STATEREF[diceCats[1]].length; i++)
                    setDie(i, diceCats[1], "blank")
                if (["rouse", "rouse2", "check", "project", "secret", "humanity", "willpower", "remorse"].includes(rollData.type) || rollResults.isNoWPReroll)
                    DragPads.Toggle("selectDie", false)
                const outcomePos = {left: Media.GetTextData("outcome").left, width: Media.GetTextWidth("outcome", rollLines.outcome.text)},
                    bottomEndData = Media.GetImgData("rollerImage_bottomEnd")
                bottomEndData.left = Media.GetImg("rollerImage_bottomEnd").get("left")
                if (!filteredDice.length) {
                    rollLines.outcome.shifttop = rollLines.outcome.shifttop || 0 - 95
                    rollLines.subOutcome.shifttop = rollLines.subOutcome.shifttop || 0 - 95
                    rollLines.difficulty.shifttop = rollLines.difficulty.shifttop || 0 - 98
                    rollLines.margin.shifttop = rollLines.margin.shifttop || 0 - 95
                    rollLines.resultCount.shifttop = rollLines.resultCount.shifttop || 0 - 95
                    rollLines.goldMods.shifttop = rollLines.goldMods.shifttop || 0 - 95
                    rollLines.goldMods.shiftleft = (rollLines.outcome.shiftleft || 0) + outcomePos.width + 20
                    rollLines.redMods.shifttop = rollLines.redMods.shifttop || 0 - 95
                    rollLines.redMods.shiftleft = (rollLines.outcome.shiftleft || 0) + outcomePos.width + 20
                    Media.SetImgTemp("rollerImage_diffFrame", {top: 150})
                    // D.Alert("RollLines Set to No Bottom")
                } else if (bottomEndData.left + 0.5 * bottomEndData.width - 100 < outcomePos.left + outcomePos.width) {
                    rollLines.redMods.shifttop = (rollLines.redMods.shifttop || 0) - 95
                    rollLines.goldMods.shifttop = (rollLines.goldMods.shifttop || 0) - 95
                    rollLines.redMods.shiftleft = bottomEndData.left - outcomePos.left + 0.5 * bottomEndData.width + 20
                    rollLines.goldMods.shiftleft = bottomEndData.left - outcomePos.left + 0.5 * bottomEndData.width + 20
                    Media.SetImgTemp("rollerImage_diffFrame", {top: 250})
                } else {
                    rollLines.redMods.shiftleft = outcomePos.width + 20
                    rollLines.goldMods.shiftleft = outcomePos.width + 20
                    Media.SetImgTemp("rollerImage_diffFrame", {top: 250})
                }
                _.each(rollLines, (args, name) => {
                    Media.SetText(name, args)
                    txtWidths[name] = Media.GetTextWidth(name)
                })
                spread = Math.max((txtWidths.posMods || 0) + (txtWidths.negMods || 0) + 20, txtWidths.mainRoll)
                scaleFrame("top", spread, false)
                D.RunFX("bloodBolt", POSITIONS.bloodBoltFX)
            }
            if (_.values(deltaAttrs).length) {
                DB(`CHANGING ATTRIBUTES: ${D.JS(deltaAttrs)}`, "displayRoll")
                for (const attrName of _.keys(deltaAttrs))
                    if (attrName === "hunger") {
                        Char.AdjustHunger(rollData.charID, deltaAttrs.hunger)
                        delete deltaAttrs.hunger
                    } else if (attrName === "humanity" || attrName === "stains") {
                        Char.AdjustTrait(rollData.charID, attrName, deltaAttrs[attrName])
                        delete deltaAttrs[attrName]
                    }
                setAttrs(rollData.charID, deltaAttrs)
            }

            if (isLogging)
                sendChat("", logString)
            if (rollFlags.isHidingResult || rollFlags.isHidingOutcome || rollFlags.isHidingDicePool || rollFlags.isHidingDifficulty)
                D.Chat("Storyteller", stString)

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
            const rollData = buildDicePool(getRollData(charObj, rollType, params, rollFlags))
            recordRoll(rollData, rollDice(rollData, null, rollFlags))
            displayRoll(true, rollFlags.isNPCRoll)
        },
        wpReroll = (dieCat, isNPCRoll) => {
            clearInterval(rerollFX);
            [isRerollFXOn, rerollFX] = [false, null]
            const rollRecord = getCurrentRoll(isNPCRoll),
                rollData = _.clone(rollRecord.rollData),
                rolledDice = _.mapObject(
                    _.omit(
                        STATEREF[dieCat],
                        (v, dNum) => v.value === "blank" ||
                            STATEREF.selected[dieCat].includes(parseInt(dNum))
                    ), v => v.value
                ),
                charObj = getObj("character", rollData.charID)
            DB(`RETRIEVED ROLL RECORD: ${D.JS(rollRecord)}`, "wpReroll")
            rollData.rerollAmt = STATEREF.selected[dieCat].length
            const rollResults = rollDice(rollData, _.values(rolledDice))
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
        },
        changeRoll = (deltaDice, isNPCRoll) => {
            const rollRecord = getCurrentRoll(isNPCRoll),
                rollData = _.clone(rollRecord.rollData)
            let rollResults = _.clone(rollRecord.rollResults)
            if (parseInt(deltaDice) < 0) {
                _.shuffle(rollResults.diceVals)
                for (let i = 0; i > deltaDice; i--) {
                    const cutIndex = rollResults.diceVals.findIndex(v => v.startsWith("B"))
                    if (cutIndex === -1)
                        return THROW(`Not enough base dice to remove in: ${D.JS(rollResults.diceVals)}`, "changeRoll()")
                    rollResults.diceVals.splice(cutIndex, 1)
                }
            }
            rollResults = rollDice(Object.assign(rollData, {
                type: "trait",
                rerollAmt: parseInt(deltaDice) > 0 ? parseInt(deltaDice) : 0,
                diff: rollData.diff
            }), rollResults.diceVals)
            rollData.dicePool += parseInt(deltaDice)
            rollData.basePool = Math.max(1, rollData.dicePool) - rollData.hungerPool
            replaceRoll(rollData, rollResults)
            displayRoll(true, isNPCRoll)
            return true
        },
        lockRoller = lockToggle => { isLocked = lockToggle === true },
        loadRoll = (rollIndex, isNPCRoll) => {
            setCurrentRoll(rollIndex, isNPCRoll)
            displayRoll(false, isNPCRoll)
        },
        loadPrevRoll = (isNPCRoll) => {
            const recordRef = isNPCRoll ? STATEREF.NPC : STATEREF
            loadRoll(Math.min(recordRef.rollIndex + 1, Math.max(recordRef.rollRecord.length - 1, 0)), isNPCRoll)
        },
        loadNextRoll = (isNPCRoll) => {
            const recordRef = isNPCRoll ? STATEREF.NPC : STATEREF
            loadRoll(Math.max(recordRef.rollIndex - 1, 0), isNPCRoll)
        },
    // #endregion

    // #region Secret Rolls
        makeSecretRoll = (chars, params, isSilent, isHidingTraits) => {
        // D.Alert(`Received Parameters: ${params}`)
            let rollData = buildDicePool(getRollData(chars[0], "secret", params)),
                [traitLine, playerLine] = ["", ""],
                resultLine = null
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
            let confirmString = ""
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
                if (!rollData.isSilent) {
                    sendChat("Storyteller", `/w ${D.GetName(char).split(" ")[0]} ${CHATSTYLES.secret.startPlayerBlock}${CHATSTYLES.secret.playerTopLineStart}you are being tested ...</div>${CHATSTYLES.secret.playerBotLineStart}${playerLine}</div></div>`)
                    confirmString = `${CHATSTYLES.secret.startPlayerBlock}${CHATSTYLES.secret.playerTopLineStart}you are being tested ...</div>${CHATSTYLES.secret.playerBotLineStart}${playerLine}</div></div>`
                } else {
                    confirmString = `${CHATSTYLES.secret.startPlayerBlock}${CHATSTYLES.secret.playerTopLineStart}<span style="width: 100%; text-align: center; text-align-last: center;">(SECRET ROLL)</span></div></div>`
                }
            })
            resultLine = `${CHATSTYLES.fullBox + CHATSTYLES.secret.topLineStart + (rollData.isSilent ? "Silently Rolling" : "Secretly Rolling") + (rollData.isHidingTraits ? " (Traits Hidden)" : " ...")}</div>${CHATSTYLES.secret.traitLineStart}${traitLine}${rollData.diff > 0 ? ` vs. ${rollData.diff}` : ""}</div>${blocks.join("")}</div></div>`
            sendChat("Storyteller", `/w Storyteller ${confirmString}`)
            sendChat("Storyteller", `/w Storyteller ${resultLine}`)
        },
    // #endregion

    // #region Getting Random Resonance Based On District/Site Parameters
        getResonance = (posRes = "", negRes = "", isDoubleAcute, testCycles = 0) => {
            const resonances = {
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
                
            for(const resRef of _.keys(resonances))
                if (_.keys(resonances).findIndex(x => x === resRef) <= 3 ||
                        countRes(resRef, posResRefs) - countRes(resRef, negResRefs) > 0)
                    resBins[_.keys(resBins)[countRes(resRef, posResRefs) - countRes(resRef, negResRefs) + 3]].push(resRef)
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
                        
            if (parseInt(testCycles) > 0) {
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
                for (let i = 0; i < parseInt(testCycles); i++) {                    
                    const randNums = [randomInteger(1000), randomInteger(1000)]
                    let results = [
                        resonances[resBinsReversed[flavorOdds.findIndex(x => randNums[0] <= x)]],
                        ["Negligible", "Fleeting", "Intense", "Acute"][intOdds.findIndex(x => randNums[1] <= x)]
                    ]
                    dbString = `${i}: [${randNums.join(", ")}]: ${D.JS(results)}`
                    try {                        
                        results = results.map(x => ({Choleric: "Cho", Melancholic: "Mel", Phlegmatic: "Phl", Sanguine: "Sng", Primal: "Pri", Ischemic: "Isc", Mercurial: "Mrc"}[x] || x.slice(0,1)))
                    } catch (errObj) {
                        D.Alert(`Error: ${D.JS(dbString)}<br><br>Odds: ${D.JS(flavorOdds)}<br>${D.JS(intOdds)}`)
                        return false
                    }
                    record[results[1]][results[0]]++
                    record[results[0]][results[1]]++
                }
                let [flaTot, intTot] = [0,0]
                for (const intensity of _.keys(record).slice(0,4)) {
                    dbString += `Keys: ${_.keys(record).slice(0,4)}, Vals: [${_.values(record[intensity]).slice(0,7).join(",")}], Adding: ${_.values(record[intensity]).slice(0,7).reduce((tot, x) => tot + x, 0)}. `
                    record[intensity].TOT += _.values(record[intensity]).slice(0,7).reduce((tot, x) => tot + x, 0)
                    intTot += record[intensity].TOT
                }
                for (const flavor of _.keys(record).slice(4)) {
                    record[flavor].TOT += _.values(record[flavor]).slice(0,4).reduce((tot, x) => tot + x, 0)
                    flaTot += record[flavor].TOT
                }
                for (const intensity of _.keys(record).slice(0,4))
                    record[intensity].PER = `${Math.round(10000*record[intensity].TOT/intTot)/100}%`
                for (const flavor of _.keys(record).slice(4))
                    record[flavor].PER = `${Math.round(10000*record[flavor].TOT/flaTot)/100}%`
                    
                const returnRows = []
                for (const k of _.keys(record)) {
                    const thisRowLines = []
                    for (const kk of _.keys(record[k]))
                        thisRowLines.push(`${kk}: ${record[k][kk]}`)
                    returnRows.push(`<b>${k}</b>: { ${thisRowLines.join(", ")} }`)
                }     
                
                const intResults = _.values(record).slice(0,4).map(x => x.PER).join(", "),
                    flaResults = _.keys(record).slice(4).map(k => [k.slice(0,1), parseFloat(record[k].PER.slice(0,-1))]).sort((a,b) => b[1] - a[1]).map(x => `${x[0]}: ${x[1]}%`).join(", ")
                
                D.Alert(`${D.JS(_.keys(resBins).map(x => `      <b>${x}</b>: [${resBins[x].join(",")}]`).join(", "))}<br><br><pre>${D.JS(returnRows.join("<br>"))}</pre><br><pre>Flavor..: ${D.JS(resOdds.flavor.map(x => `_: ${parseInt(x*10000)/100}.${"0".repeat(4 - `${parseInt(x*10000)/100}`.length)}%`).join(", "))}]<br>Compared: ${flaResults}</pre><br><br>Int Odds: [${D.JS(resOdds.intensity.map(x => `${x*100}%`).join(", "))}]<br>Compared: ${intResults}`)
            }
            return [
                intChoice,
                resChoice,
                discLines[resChoice]
            ]
            // Return ["Acute", "Choleric"];
        },
        displayResonance = (posRes = "", negRes = "", isDoubleAcute, testCycles = 0) => {
            const resonance = getResonance(posRes, negRes, isDoubleAcute, testCycles)
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
                case "negligibly":
                    resIntLine = `The blood carries only the smallest hint of ${resonance[1].toLowerCase()} resonance.  It is not strong enough to confer any benefits at all.`
                    break
                case "fleetingly":
                    resIntLine = `The blood's faint ${resonance[1].toLowerCase()} resonance can guide you in developing ${resonance[2]}, but lacks any real power.`
                    break
                case "intensely":
                    resIntLine = `The blood's strong ${resonance[1].toLowerCase()} resonance spreads through you, infusing your own vitae and enhancing both your control and understanding of ${resonance[2]}.`
                    break
                case "acutely":
                    resIntLine = `This blood is special.  In addition to enhancing ${resonance[2]}, its ${resonance[1].toLowerCase()} resonance is so powerful that the emotions within have crystallized into a dyscracias.`
                    break
                // no default
            }
            sendChat("Resonance Check", C.CHATHTML.colorBlock([
                C.CHATHTML.colorTitle(_.map([resonance[0], resonance[1]], v => v.toUpperCase()).join(" ")),
                C.CHATHTML.colorHeader(resDetails),
                C.CHATHTML.colorBody(resIntLine)
            ]))
        }
    // #endregion

    return {
        RegisterEventHandlers: regHandlers,
        CheckInstall: checkInstall,

        get LastProjectPrefix() { return STATEREF.lastProjectPrefix },
        get LastProjectCharID() { return STATEREF.lastProjectCharID },

        ROLLERTEXT: TEXTLINES,
        Select: selectDie,
        Reroll: wpReroll,
        Clean: clearRoller
    }
})()

on("ready", () => {
    Roller.RegisterEventHandlers()
    Roller.CheckInstall()
    D.Log("Roller Ready!")
})
void MarkStop("Roller")