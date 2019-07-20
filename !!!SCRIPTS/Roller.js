﻿void MarkStart("Roller")
const Roller = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Roller",
        CHATCOMMAND = null,
        GMONLY = false

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
        }
    // #endregion

    // #region LOCAL INITIALIZATION
    const initialize = () => {
        STATEREF.rollRecord = STATEREF.rollRecord || []
        STATEREF.rollIndex = STATEREF.rollIndex || 0
        STATEREF.NPC = STATEREF.NPC || {}
        STATEREF.NPC.rollRecord = STATEREF.NPC.rollRecord || []
        STATEREF.NPC.rollIndex = STATEREF.NPC.rollIndex || 0
        STATEREF.selected = STATEREF.selected || {}
        STATEREF.rollEffects = STATEREF.rollEffects || {}
        _.each(_.uniq(_.flatten(STATECATS.dice)), v => {
            STATEREF.selected[v] = STATEREF.selected[v] || []
            STATEREF[v] = STATEREF[v] || []
        })
        _.each(_.without(_.uniq(_.flatten(_.values(STATECATS))), ...STATECATS.dice), v => {
            STATEREF[v] = STATEREF[v] || {}
        })

        /* delete state.VAMPIRE.Roller.textList
        delete state.VAMPIRE.Roller.imgList
        delete state.VAMPIRE.Roller.shapeList
        delete state.VAMPIRE.Roller.charEffects
        delete state.VAMPIRE.TimeTracker.timeText
        delete state.VAMPIRE.TimeTracker.horizonImage
        delete state.VAMPIRE.TimeTracker.timeTextShadow
        delete state.VAMPIRE.TimeTracker.tempCText
        delete state.VAMPIRE.TimeTracker.tempFText
        delete state.VAMPIRE.TimeTracker.weatherText
        delete state.VAMPIRE.TimeTracker.tempCShadow
        delete state.VAMPIRE.TimeTracker.tempFShadow
        delete state.VAMPIRE.TimeTracker.weatherShadow
        delete state.VAMPIRE.TimeTracker.trackerObj

        delete state.VAMPIRE.DATA.jStrTest
        delete state.VAMPIRE.Chars */

        /*setText("negMods", {text: "Neg Mods"})
        setText("redMods", {text: "Red Mods"})
        setText("goldMods", {text: "Gold Mods"})
        setText("difficulty", {text: "DD"})
        setText("margin", {text: "MM"})
        setText("subOutcome", {text: "subOutcome"}) */
    }

    // #endregion	

    // #region EVENT HANDLERS: (HANDLEINPUT)
    const handleInput = (msg, who, call, args) => {
        let [rollType, charObj, diceNums, resonance, resDetails, resIntLine, params] = new Array(7),
            name = "",
            [isSilent, isHidingTraits] = [false, false]
        switch (call) { 		// !traitroll @{character_name}|Strength,Resolve|3|5|0|ICompulsion:3,IPhysical:2
            //case "!setrollertext":
                //setText(args.shift(), )
            case "!frenzyinitroll":	// !projectroll @{character_name}|Politics:3,Resources:2|mod|diff|diffMod|rowID
                lockRoller(true)
                STATEREF.frenzyRoll = `${args.join(" ").split("|")[0]}|`
                sendChat("ROLLER", `/w Storyteller <br/><div style='display: block; background: url(https://i.imgur.com/kBl8aTO.jpg); text-align: center; border: 4px ${C.COLORS.crimson} outset;'><br/><span style='display: block; font-size: 16px; text-align: center; width: 100%'>[Set Frenzy Diff](!#Frenzy)</span><span style='display: block; text-align: center; font-size: 12px; font-weight: bolder; color: ${C.COLORS.white}; font-variant: small-caps; margin-top: 4px; width: 100%'>~ for ~</span><span style='display: block; font-size: 14px; color: ${C.COLORS.brightred}; text-align: center; font-weight: bolder; font-variant: small-caps; width: 100%'>${args.join(" ").split("|")[0]}</span><br/></div>`)
                return
            case "!frenzyroll": rollType = rollType || "frenzy"
                lockRoller(false)
                args = `${STATEREF.frenzyRoll} ${args[0]}`.split(" ")
                DB(`Parsing Frenzy Args: ${D.JS(args)}`, "!frenzyroll")
            /* falls through */
            case "!discroll": case "!traitroll": rollType = rollType || "trait"
            /* falls through */
            case "!rouseroll": rollType = rollType || "rouse"
            /* falls through */
            case "!rouse2roll": rollType = rollType || "rouse2"
            /* falls through */
            case "!checkroll": rollType = rollType || "check"
            /* falls through */
            case "!willpowerroll": rollType = rollType || "willpower"
            /* falls through */
            case "!humanityroll": rollType = rollType || "humanity"
            /* falls through */
            case "!remorseroll": rollType = rollType || "remorse"
            /* falls through */
            case "!projectroll": rollType = rollType || "project"
                /* all continue below */
                params = _.map(args.join(" ").split("|"), v => v.trim())
                name = params.shift()
                charObj = D.GetChar(name)
                DB(`Received Roll: ${D.JS(call)} ${name}|${params.join("|")}
                    ... PARAMS: [${D.JS(params.join(", "))}]
                    ... CHAROBJ: ${D.JS(charObj)}`, "handleInput")
                if (!VAL({ charobj: charObj }, "handleInput")) return
                if (STATEREF.isNextRollNPC && playerIsGM(msg.playerid)) {
                    STATEREF.isNextRollNPC = false
                    makeNewRoll(charObj, rollType, params, call === "!discroll", true)
                } else if (isLocked) {
                    return
                } else {
                    makeNewRoll(charObj, rollType, params, call === "!discroll")
                }
                delete STATEREF.frenzyRoll
                break
            case "!npcroll": // Run this to lock the roller and declare the NEXT roll to be an NPC roll.
                if (!playerIsGM(msg.playerid)) return
                STATEREF.isNextRollNPC = true
                break
            case "!cleanRoller":
                cleanRoller()
                break
            case "!buildFrame":
                initFrame()
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
                    if (_.isObject(thisDie)) {
                        thisDie.set("layer", "objects")
                        thisDie.set("isdrawing", false)
                    }
                })
                _.each(STATEREF.bigDice, (v, dNum) => {
                    const thisDie = setDie(dNum, "bigDice", "Bs")
                    if (_.isObject(thisDie)) {
                        thisDie.set("layer", "objects")
                        thisDie.set("isdrawing", false)
                    }
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
            case "!resCheck":
                if (args[0] === "x")
                    args[0] = ""
                if (args[1] === "x")
                    args[1] = ""
                resonance = getResonance(...args)
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
                break
            case "!nxsroll":
            case "!xnsroll":
            case "!xsroll":
            case "!sxroll":
            case "!snxroll":
            case "!sxnroll":
            case "!nsroll":
            case "!snroll":
            case "!sroll":
            {
                rollType = "secret"
                const params = args.join(" ").split("|")
                isSilent = call.includes("x")
                isHidingTraits = call.includes("n")
                let chars = null
                if (!msg.selected || !msg.selected[0])
                    chars = D.GetChars("registered")
                else
                    chars = D.GetChars(msg)
                if (params.length < 1 || params.length > 3)
                    THROW(`Syntax Error: ![x][n]sroll: <trait1>[,<trait2>,<mod>] (${D.JS(params)})`, "!sroll")
                else
                    makeSecretRoll(chars, params, isSilent, isHidingTraits)
                break
            }
            case "!getchareffects":
            {
                let char = D.GetChar(msg)
                if (!char) {
                    THROW("Select a character token first!", "!getchareffects")
                    break
                }
                let rollEffects = _.compact((getAttrByName(char.id, "rolleffects") || "").split("|")),
                    rollStrings = []
                for (let i = 0; i < rollEffects.length; i++)
                    rollStrings.push(`${i + 1}: ${rollEffects[i]}`)
                D.Alert(`Roll Effects on ${D.GetName(char)}:<br><br>${rollStrings.join("<br>")}`, "ROLLER: !getchareffects")
                break
            }
            case "!delchareffect":
            {
                let char = D.GetChar(msg)
                if (!char) {
                    THROW("Select a character token first!", "!getchareffects")
                    break
                }
                let rollEffects = _.compact((getAttrByName(char.id, "rolleffects") || "").split("|"))
                rollEffects.splice(Math.max(0, parseInt(args.shift()) - 1), 1)
                setAttrs(char.id, { rolleffects: rollEffects.join("|") })
                D.Alert(`Roll Effects on ${D.GetName(char)} revised to:<br><br>${rollEffects.join("<br>")}`, "ROLLER: !delchareffects")
                break
            }
            case "!addchareffect":
            {
                let chars = D.GetChars(msg)
                for (const char of chars) {
                    let rollEffects = _.compact((getAttrByName(char.id, "rolleffects") || "").split("|"))
                    rollEffects.push(...args.join(" ").split("|"))
                    setAttrs(char.id, { rolleffects: _.uniq(rollEffects).join("|") })
                    D.Alert(`Roll Effects on ${D.GetName(char)} revised to:<br><br>${rollEffects.join("<br>")}`, "ROLLER: !addchareffect")
                }
                break
            }
            case "!getglobaleffects":
            {
                let rollStrings = []
                for (let i = 0; i < _.keys(STATEREF.rollEffects).length; i++)
                    rollStrings.push(`${i + 1}: ${_.keys(STATEREF.rollEffects)[i]}`)
                D.Alert(`Global Roll Effects:<br><br>${rollStrings.join("<br>")}`, "ROLLER: !getglobaleffects")
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
                let rollStrings = []
                for (let i = 0; i < _.keys(STATEREF.rollEffects).length; i++)
                    rollStrings.push(`${i + 1}: ${_.keys(STATEREF.rollEffects)[i]}`)
                D.Alert(`Global Roll Effects:<br><br>${rollStrings.join("<br>")}`, "ROLLER: !getglobaleffects")
                break
            }
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
            dice: {
                blank: "https://s3.amazonaws.com/files.d20.io/images/63990142/MQ_uNU12WcYYmLUMQcbh0w/thumb.png?1538455511", // Simple Blank PNG
                selected: "https://s3.amazonaws.com/files.d20.io/images/64173198/T0qdnbmLUCnrs9WlxoGwww/thumb.png?1538710883", // Selected for WP Reroll
                selectedFree: "https://s3.amazonaws.com/files.d20.io/images/86144163/tM6wdGvZhjSGnifQFikZGA/thumb.png?1562820747", // Selected for WP Reroll, Free
                selectedDouble: "https://s3.amazonaws.com/files.d20.io/images/86144159/08IX_BRm9MjEeZEerHhgWQ/thumb.png?1562820743", // Selected for WP Reroll, Costly
                Bf: "https://s3.amazonaws.com/files.d20.io/images/64173205/DOUwwGcobI4eyu1Wb8ZDxg/thumb.png?1538710883", // Base Fail
                Bs: "https://s3.amazonaws.com/files.d20.io/images/64173203/ZS04TJE6VRI8_Q-HaJ0r4g/thumb.png?1538710883", // Base Success
                Bc: "https://s3.amazonaws.com/files.d20.io/images/64173206/Fbt_6j-k_1oRKPxTKdnIWQ/thumb.png?1538710883", // Base Crit
                BcL: "https://s3.amazonaws.com/files.d20.io/images/64173208/cIP4B1Y14gVdYrS3YPYNbQ/thumb.png?1538710883", // Base Crit-Pair Left
                BcR: "https://s3.amazonaws.com/files.d20.io/images/64173199/1thrJQz9Hmzv0tQ6awSOGw/thumb.png?1538710883", // Base Crit-Pair Right
                Hb: "https://s3.amazonaws.com/files.d20.io/images/64173201/mYkpkP6l9WX9BKt5fjTrtw/thumb.png?1538710883", // Hunger Botch
                Hf: "https://s3.amazonaws.com/files.d20.io/images/64173204/AacOfDpF2jMCn1pYPmqlUQ/thumb.png?1538710882", // Hunger Fail
                Hs: "https://s3.amazonaws.com/files.d20.io/images/64173209/D_4ljxj59UYXPNmgXaZbhA/thumb.png?1538710883", // Hunger Success
                Hc: "https://s3.amazonaws.com/files.d20.io/images/64173202/xsEkLc9DcOslpQoUJwpHMQ/thumb.png?1538710883", // Hunger Crit
                HcL: "https://s3.amazonaws.com/files.d20.io/images/64173200/cBsoLkAu15XWexFSNUxoHA/thumb.png?1538710883", // Hunger Crit-Pair Left
                HcR: "https://s3.amazonaws.com/files.d20.io/images/64173207/Se7RHT2fJDg2qMGo_x5UhQ/thumb.png?1538710883", // Hunger Crit-Pair Right
                HcRb: "https://s3.amazonaws.com/files.d20.io/images/86144181/qkNvGzlfO3rvh0cJfpOUZg/thumb.png?1562820773", // Hunger Crit-Pair Right, No Messy Crit
                HcLb: "https://s3.amazonaws.com/files.d20.io/images/86144183/6vLwAqmASYunFKL8Ja5s7A/thumb.png?1562820778", // Hunger Crit-Pair Left, No Messy Crit
                BXc: "https://s3.amazonaws.com/files.d20.io/images/86144155/Qa5ujL7sNl6t3ivdrwwJgw/thumb.png?1562820732", // Cancelled Critical Dice
                BXs: "https://s3.amazonaws.com/files.d20.io/images/86144169/ZcOUNB-JbR-RipGUxZL4rQ/thumb.png?1562820751", // Cancelled Success Dice
                HXc: "https://s3.amazonaws.com/files.d20.io/images/86144188/FYm9ypaLBXudXND_ttLQng/thumb.png?1562820782", // Cancelled Critical Hunger Dice
                HXs: "https://s3.amazonaws.com/files.d20.io/images/86144189/69O5B4yRk-QuQC-plv6gCQ/thumb.png?1562820786", // Cancelled Success Hunger Dice
                HXb: "https://s3.amazonaws.com/files.d20.io/images/86144175/cXh5vEyXnHP-xPRGT73oVA/thumb.png?1562820759", // Cancelled Botched Hunger Dice
                HCb: "https://s3.amazonaws.com/files.d20.io/images/86144172/SMd96HHr3KveKr-sqoWLbQ/thumb.png?1562820756", // Cancelling Botched Hunger Dice
                Ob: "https://s3.amazonaws.com/files.d20.io/images/86144193/nnCZhpsceiWlkhofsQCzQw/thumb.png?1562820789" // Oblivion Botch
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
                text: "rollerName"
            },
            mainRoll: {
                font_family: "Contrail One",
                font_size: 40,
                top: 73,
                left: 135,
                color: C.COLORS.white,
                text: "mainRoll"
            },
            posMods: {
                font_family: "Contrail One",
                font_size: 32,
                top: 115,
                left: 205,
                color: C.COLORS.white,
                text: "posMods"
            },
            negMods: {
                font_family: "Contrail One",
                font_size: 32,
                top: 115,
                left: 205,
                color: C.COLORS.red,
                text: "negMods"
            },
            redMods: {
                font_family: "Contrail One",
                font_size: 32,
                top: 166,
                left: 595,
                color: C.COLORS.red,
                text: "redMods"
            },
            goldMods: {
                font_family: "Contrail One",
                font_size: 32,
                top: 166,
                left: 595,
                color: C.COLORS.gold,
                text: "goldMods"
            },
            dicePool: {
                font_family: "Candal",
                font_size: 56,
                top: 91,
                left: 75,
                color: C.COLORS.white,
                text: "SS"
            },
            difficulty: {
                font_family: "Contrail One",
                font_size: 32,
                top: 253,
                left: 96,
                color: C.COLORS.white,
                text: "D"
            },
            resultCount: {
                font_family: "Candal",
                font_size: 56,
                top: 185,
                left: 75,
                color: C.COLORS.white,
                text: "RC"
            },
            margin: {
                font_family: "Candal",
                font_size: 72,
                top: 294,
                left: 133,
                color: C.COLORS.white,
                text: "M"
            },
            outcome: {
                font_family: "Contrail One",
                font_size: 100,
                top: 297,
                left: 200,
                color: C.COLORS.white,
                text: "outcome"
            },
            subOutcome: {
                font_family: "Contrail One",
                font_size: 32,
                top: 341,
                left: 360,
                color: C.COLORS.white,
                text: "subOutcome"
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
                    worst: C.COLORS.brightred
                }
            },
            rouse2: {
                rollerName: C.COLORS.white,
                mainRoll: C.COLORS.white,
                outcome: {
                    best: C.COLORS.white,
                    good: C.COLORS.white,
                    bad: C.COLORS.brightred,
                    worst: C.COLORS.brightred
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
                Hb: `<span style="margin-right: 2px; width: 10px; text-align: center; color: ${C.COLORS.black}; height: 24px; vertical-align: middle; display: inline-block; font-size: 18px; font-family: 'Arial'; text-shadow: 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}; line-height: 22px;">♠</span>`
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
        }
    // #endregion

    // #region Object Creation & Registration
    const registerDie = (obj, category) => {
            const padRef = POSITIONS.dice[category].pad
            STATEREF[category] = STATEREF[category] || []
            if (VAL({ graphic: obj }, "registerDie")) {
                obj.set({
                    imgsrc: IMAGES.dice.Bf,
                    layer: "objects",
                    isdrawing: true,
                    name: `rollerDie_${category}_${STATEREF[category].length}`,
                    controlledby: ""
                })
                Media.Register(obj, `rollerDie_${category}_${STATEREF[category].length}`, "Bf", "map", false)
                STATEREF[category].push({
                    id: obj.id,
                    top: obj.get("top"),
                    left: obj.get("left"),
                    width: obj.get("width"),
                    height: obj.get("height"),
                    value: "blank"
                })
                DragPads.MakePad(obj, "selectDie", {
                    deltaHeight: padRef.dH,
                    deltaWidth: padRef.dW,
                    deltaLeft: padRef.dX,
                    deltaTop: padRef.dY
                })
                D.Alert(`Registered die #${STATEREF[category].length}: ${D.JS(_.values(STATEREF[category]).slice(-1))}, Added WigglePad #${_.values(C.ROOT.DragPads.byPad).length}`, "ROLLER: registerDie()")

            // D.Alert(`Returning Die Object: ${D.JS(obj)}`)

                return obj
            }

            return THROW(`Invalid object: ${D.JS(obj)}`, "registerDie()")
        },
        makeDie = (category, isActive = false) => {
            STATEREF[category] = STATEREF[category] || []
            const posRef = POSITIONS.dice[category],
                die = createObj("graphic", {
                    _pageid: D.PAGEID,
                    imgsrc: IMAGES.dice.Bf,
                    left: posRef.left + posRef.spread * STATEREF[category].length,
                    top: posRef.top,
                    width: posRef.width,
                    height: posRef.height,
                    layer: isActive ? "objects" : "map",
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
                Media.Remove(die.id)
            }
            STATEREF[category] = []
        },
        makeAllDice = (category, amount) => {
            clearDice(category)
            for (let i = 0; i < amount; i++)
                makeDie(category, category === STATECATS.dice[0])

        }
    // #endregion

    // #region Graphic & Text Control
    const setColor = (line, type, params, level) => {
            if (VAL({ string: type }, "setColor")) {
                if (type && !COLORSCHEMES[type])
                    THROW(`No Color Scheme for type '${D.JS(type)}'`, "setColor()")
                else if (VAL({ string: line }) && !COLORSCHEMES[type][line])
                    THROW(`No Color Scheme for line '${D.JS(line)}' in '${D.JS(type)}'`, "setColor()")
                else if (VAL({ string: level }) && !COLORSCHEMES[type][line][level])
                    THROW(`No Level '${D.JS(level)}' for '${D.JS(line)}' in '${D.JS(type)}'`, "setColor()")
                else if (!VAL({ string: level }) && !VAL({ string: COLORSCHEMES[type][line] }))
                    THROW(`Must provide Level for '${D.JS(line)}' in '${D.JS(type)}'`, "setColor()")
                else
                    params.color = level ? COLORSCHEMES[type][line][level] : COLORSCHEMES[type][line]
                return params
            }

            return false
        },
        cleanRoller = () => {
            for (const textLine of _.keys(TEXTLINES))            
                Media.SetText(textLine, " ")
            _.each(STATEREF.diceList, (v, dNum) => {
                setDie(dNum, "diceList", "blank")
            })  
            _.each(STATEREF.bigDice, (v, dNum) => {
                setDie(dNum, "bigDice", "blank")
            })                      
            scaleFrame("top", -1)
        }
    // #endregion

    // #region Dice Frame
    const initFrame = () => {
            let workingImg = null
            for (const name of _.keys(TEXTLINES))
                Media.RemoveText(name)
            DragPads.ClearAllPads("wpReroll")
            Media.Remove("wpRerollPlaceholder")
            Media.RemoveAll("rollerImage")
            DragPads.ClearAllPads("selectDie")
            for (const cat of STATECATS.dice)
                clearDice(cat)
            for (const textLine of _.keys(TEXTLINES))
                Media.MakeText(textLine, "objects", true, true, null, TEXTLINES[textLine])
            Media.MakeImg("rollerImage_frontFrame", {
                imgsrc: IMAGES.frontFrame,
                top: POSITIONS.diceFrameFront.top(),
                left: POSITIONS.diceFrameFront.left(),
                height: POSITIONS.diceFrameFront.height(),
                width: POSITIONS.diceFrameFront.width(),
                activeLayer: "map",
                startActive: true
            })
            for (let i = 0; i < 9; i++) {
                Media.MakeImg(`rollerImage_topMid_${i}`, {
                    imgsrc: IMAGES.topMids[i - 3 * Math.floor(i / 3)],
                    top: POSITIONS.diceFrameMidTop.top(),
                    left: POSITIONS.diceFrameMidTop.left() + i * POSITIONS.diceFrameMidTop.xShift(),
                    height: POSITIONS.diceFrameMidTop.height(),
                    width: POSITIONS.diceFrameMidTop.width(),
                    activeLayer: "map",
                    startActive: true
                })
                Media.MakeImg(`rollerImage_bottomMid_${i}`, {
                    imgsrc: IMAGES.bottomMids[i - 3 * Math.floor(i / 3)],
                    top: POSITIONS.diceFrameMidBottom.top(),
                    left: POSITIONS.diceFrameMidBottom.left() + i * POSITIONS.diceFrameMidBottom.xShift(),
                    height: POSITIONS.diceFrameMidBottom.height(),
                    width: POSITIONS.diceFrameMidBottom.width(),
                    activeLayer: "map",
                    startActive: true
                })
            }
            Media.MakeImg("rollerImage_topEnd", {
                imgsrc: IMAGES.topEnd,
                top: POSITIONS.diceFrameEndTop.top(),
                left: POSITIONS.diceFrameEndTop.left(),
                height: POSITIONS.diceFrameEndTop.height(),
                width: POSITIONS.diceFrameEndTop.width(),
                activeLayer: "map",
                startActive: true
            })
            Media.MakeImg("rollerImage_bottomEnd", {
                imgsrc: IMAGES.bottomEnd,
                top: POSITIONS.diceFrameEndBottom.top(),
                left: POSITIONS.diceFrameEndBottom.left(),
                height: POSITIONS.diceFrameEndBottom.height(),
                width: POSITIONS.diceFrameEndBottom.width(),
                activeLayer: "map",
                startActive: true
            })
            Media.MakeImg("rollerImage_diffFrame", {
                imgsrc: IMAGES.diffFrame,
                top: POSITIONS.diceFrameDiffFrame.top(),
                left: POSITIONS.diceFrameDiffFrame.left(),
                height: POSITIONS.diceFrameDiffFrame.height(),
                width: POSITIONS.diceFrameDiffFrame.width(),
                activeLayer: "map",
                startActive: false
            })
        //WP REROLL BUTTON
            Media.MakeImg("wpRerollPlaceholder", {
                imgsrc: IMAGES.blank,
                top: POSITIONS.diceFrameRerollPad.top(),
                left: POSITIONS.diceFrameRerollPad.left(),
                height: POSITIONS.diceFrameRerollPad.height(),
                width: POSITIONS.diceFrameRerollPad.width(),
                activeLayer: "map",
                startActive: false
            })
            DragPads.MakePad(workingImg, "wpReroll", {
                top: POSITIONS.diceFrameRerollPad.top(),
                left: POSITIONS.diceFrameRerollPad.left(),
                height: POSITIONS.diceFrameRerollPad.height(),
                width: POSITIONS.diceFrameRerollPad.width()
            })
            DragPads.Toggle("wpReroll", false)
            for (const diceCat of _.keys(SETTINGS.dice))
                makeAllDice(diceCat, SETTINGS.dice[diceCat])
            Media.LayerImages(Media.IMAGELAYERS.map, "map")
            Media.LayerImages(Media.IMAGELAYERS.objects, "objects")
            //Media.OrderImages("map")

        },
        scaleFrame = (row, width) => {
            if (width < 0) {
                for (let i = 0; i < 9; i++) {
                    Media.Set(`rollerImage_topMid_${i+1}`, "blank")
                    Media.Set(`rollerImage_bottomMid_${i+1}`, "blank")                    
                }
                Media.SetParams("rollerImage_topEnd_1", {left: 300})
                Media.SetParams("rollerImage_bottomEnd_1", {left: 300})
            } else {
                const stretchWidth = Math.max(width, 120),
                    imgs = [Media.GetObj(`rollerImage_${row}End`)],
                    blanks = [],
                    dbLines = []
                let [midCount, endImg, stretchPer, left] = [0, null, 0, null]
                while (stretchWidth > 225 * (imgs.length - 1)) {
                    imgs.push(Media.GetObj(`rollerImage_${row}Mid_${midCount+1}`))
                    midCount++
                    if (midCount >= IMAGES[`${row}Mids`].length * 3) {
                        dbLines.push(`Need ${midCount - imgs.length + 2} more mid sections for ${row}`)
                        break
                    }
                }
                while (midCount < IMAGES[`${row}Mids`].length * 3) {
                    blanks.push(Media.GetObj(`rollerImage_${row}Mid_${midCount+1}`))
                    midCount++
                }
                stretchPer = stretchWidth / imgs.length
                dbLines.push(`${row} stretchWidth: ${stretchWidth}, imgs Length: ${imgs.length}, x225 ${imgs.length * 225}, stretch per: ${stretchPer}`)
                dbLines.push(`${row} midCount: ${midCount}, blanks length: ${blanks.length}`)
                endImg = imgs.shift()
                left = POSITIONS.diceFrameFront.left() + (row === "top" ? 30 : 100)
                dbLines.push(`${row}Start at ${POSITIONS.diceFrameFront.left()}, + 120 to ${left}`)
                for (let i = 0; i < imgs.length; i++) {
                    dbLines.push(`Setting ${row}Mid${i+1} to ${left}`)
                    /* Media.SetParams(`rollerImage_${row}Mid_${i+1}`, {left: left})
                    Media.Set(`rollerImage_${row}Mid_${i+1}`, "base") */
                    Media.SetParams(imgs[i], {left: left})
                    Media.Set(imgs[i], "base")
                    left += stretchPer
                }
                dbLines.push(`Setting ${row}End to ${left}`)
                Media.SetParams(endImg, {left: left})
                for (let j = 0; j < blanks.length; j++)
                    Media.Set(blanks[j], "blank")

                /* const frameEndObj = Media.GetObj("rollerImage_bottomEnd_1"),
                    frameRightSide = frameEndObj.get("left") + 0.5 * frameEndObj.get("width")
                if (row === "bottom") {
                    Media.SetText("redMods", {left: frameRightSide, shiftleft: 20 })
                    Media.SetText("goldMods", {left: frameRightSide, shiftleft: Media.GetTextWidth("redMods") + 40 })
                } */

                DB(dbLines.join("<br>"), "scaleFrame")
            }
        }
    // #endregion

    // #region Dice Graphic Control
    const setDie = (dieNum, dieCat = "diceList", dieVal, params = {}, rollType = "") => {
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
            dieParams.imgsrc = IMAGES.dice[dieVal]
            dieParams.layer = dieVal === "blank" ? "map" : "objects"
            _.each(["top", "left", "width"], dir => {
                if (die.get(dir) !== dieRef[dir] || params.shift && params.shift[dir])
                    dieParams[dir] = dieRef[dir] + (params.shift && params.shift[dir] ? params.shift[dir] : 0)
            })
            die.set(dieParams)

            return die
        },
        selectDie = (dieNum, dieCat) => {
            STATEREF.selected[dieCat] = STATEREF.selected[dieCat] || []
            if (STATEREF.selected[dieCat].includes(dieNum)) {
                setDie(dieNum, dieCat, STATEREF[dieCat][dieNum].value)
                STATEREF.selected[dieCat] = _.without(STATEREF.selected[dieCat], dieNum)
            } else {
                setDie(dieNum, dieCat, "selected")
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
        }
    // #endregion

    // #region Getting Information & Setting State Roll Record
    const applyRollEffects = rollInput => {
            const rollEffectString = getAttrByName(rollInput.charID, "rolleffects") || ""
            let isReapplying = false
            DB(`APPLYING ROLL EFFECTS.<br>... ${rollEffectString}<br><br>${D.JS(rollInput)}`, "applyRollEffects")
            if (VAL({ string: rollEffectString, list: rollInput }, "applyRollEffects")) {
                rollInput.appliedRollEffects = rollInput.appliedRollEffects || []
                const rollEffects = _.compact(_.without(_.uniq([...rollEffectString.split("|"), ..._.keys(STATEREF.rollEffects), ...rollInput.rollEffectsToReapply || []]), ...rollInput.appliedRollEffects)),
                    [rollData, rollResults] = rollInput.rolls ? [null, rollInput] : [rollInput, null],
                    checkRestriction = (input, traits, flags, rollMod, restriction) => {
                        DB(`Checking Restriction '${D.JS(restriction)}'<br>...TRAITS: ${D.JS(traits)}<br>...FLAGS: ${D.JS(flags)}<br>...MOD: ${D.JS(rollMod)}`, "checkThreshold")
                        if (restriction === "all") {
                            DB("Restriction = ALL:  RETURNING TRUE", "checkThreshold")
                            return true
                        }
                        if (D.IsIn(restriction, ["success", "failure", "basicfail", "critical", "basiccrit", "messycrit", "bestialfail", "totalfail"]) ||
                        D.IsIn(rollMod, ["nowpreroll", "doublewpreroll", "freewpreroll", "bestialcancel", "totalfailure", "nomessycrit"])) {
                            DB("... ... Detected ROLLRESULT RELEVANT", "checkThreshold")
                            if (!input.rolls) {
                                DB("... ... ... but NO ROLLS PROPERTY: RETURNING 'INAPPLICABLE'", "checkThreshold")
                                return "INAPPLICABLE"
                            } else {
                                // Does rollMod specify a willpower cost, but it is superceded by a nowpreroll restriction somewhere in the effect?
                                switch (rollMod) {
                                    case "doublewpreroll": case "freewpreroll":
                                        if (_.any(rollEffects, v => v.includes("nowpreroll"))) {
                                            DB(`Willpower cost ${rollMod} SUPERCEDED by 'nowpreroll': ${D.JS(rollEffects)}`, "checkThreshold")
                                            return "INAPPLICABLE"
                                        }
                                        break
                                    // no default
                                }
                            // TEST: If rollResults and rollInput specifies a result restriction, check if it applies.
                                let effectiveMargin = input.total - (input.diff || 1) // All rolls have a base difficulty of one if difficulty isn't specified.
                                switch (restriction) {
                                    case "success":
                                        DB(`Restriction = ${restriction}.  EffectiveMargin = ${effectiveMargin} SO Returning ${effectiveMargin >= 0}`, "checkThreshold")
                                        return effectiveMargin >= 0
                                    case "failure":
                                        DB(`Restriction = ${restriction}.  EffectiveMargin = ${effectiveMargin} SO Returning ${effectiveMargin < 0}`, "checkThreshold")
                                        return effectiveMargin < 0
                                    case "basicfail":
                                        DB(`Restriction = ${restriction}.  EffectiveMargin = ${effectiveMargin} SO Returning ${effectiveMargin < 0 && input.H.botches === 0 && input.B.succs + input.H.succs > 0}`, "checkThreshold")
                                        return effectiveMargin < 0 && input.H.botches === 0 && input.B.succs + input.H.succs > 0 // fail AND not bestial fail AND not total fail
                                    case "critical":
                                        DB(`Restriction = ${restriction}.  EffectiveMargin = ${effectiveMargin} SO Returning ${effectiveMargin >= 0 && input.critPairs.bb + input.critPairs.hb + input.critPairs.hh > 0}`, "checkThreshold")
                                        return effectiveMargin >= 0 && input.critPairs.bb + input.critPairs.hb + input.critPairs.hh > 0
                                    case "basiccrit":
                                        DB(`Restriction = ${restriction}.  EffectiveMargin = ${effectiveMargin} SO Returning ${effectiveMargin >= 0 && input.critPairs.bb > 0 && input.critPairs.hh + input.critPairs.hb === 0}`, "checkThreshold")
                                        return effectiveMargin >= 0 && input.critPairs.bb > 0 && input.critPairs.hh + input.critPairs.hb === 0
                                    case "messycrit":
                                        DB(`Restriction = ${restriction}.  EffectiveMargin = ${effectiveMargin} SO Returning ${effectiveMargin >= 0 && input.critPairs.hh + input.critPairs.hb > 0}`, "checkThreshold")
                                        return effectiveMargin >= 0 && input.critPairs.hh + input.critPairs.hb > 0
                                    case "bestialfail":
                                        DB(`Restriction = ${restriction}.  EffectiveMargin = ${effectiveMargin} SO Returning ${effectiveMargin < 0 && input.H.botches > 0}`, "checkThreshold")
                                        return effectiveMargin < 0 && input.H.botches > 0
                                    case "totalfail":
                                        DB(`Restriction = ${restriction}.  EffectiveMargin = ${effectiveMargin} SO Returning ${input.B.succs + input.H.succs === 0}`, "checkThreshold")
                                        return input.B.succs + input.H.succs === 0
                                    // no default
                                }
                            }
                        } else if (input.rolls) {                            
                            DB("... ... Detected ROLLDATA RELEVANT with ROLLS PROPERTY: RETURNING 'INAPPLICABLE'", "checkThreshold")                        
                            return "INAPPLICABLE"
                        }
                        // After assessing rollData/rollResults-specific restrictions, check restrictions that apply to either:
                        DB("Initial Thresholds PASSED.  Moving on to general restrictions.", "checkThreshold")
                        if (D.IsIn(restriction, C.CLANS)) {
                            DB(`Restriction = CLAN.  Character Clan: ${getAttrByName(input.charID, "clan")}`, "checkThreshold")                            
                            if (!D.IsIn(getAttrByName(input.charID, "clan"), restriction)) {                                
                                DB("... Check FAILED.  Returning FALSE", "checkThreshold")        
                                return false
                            }
                        } else if (D.IsIn(restriction, C.SECTS)) {
                            DB(`Restriction = SECT.  Character Sect: ${getAttrByName(input.charID, "sect")}`, "checkThreshold")                                   
                            if (!D.IsIn(getAttrByName(input.charID, "sect"), restriction)){                                
                                DB("... Check FAILED.  Returning FALSE", "checkThreshold")        
                                return false
                            }                    
                        // TEST: If restriction is "physical", "social" or "mental", does an appropriate trait match?
                        } else if (D.IsIn(restriction, ["physical", "mental", "social"])) {
                            DB(`Restriction = ARENA.  Trait Keys: ${D.JS(_.keys(traits))}`, "checkThreshold")       
                            if (!_.intersection(_.map([...C.ATTRIBUTES[restriction], ...C.SKILLS[restriction]], v => v.toLowerCase()), _.keys(traits)).length) {                                
                                DB("... Check FAILED.  Returning FALSE", "checkThreshold")        
                                return false
                            }
                        // TEST: If restriction starts with "char:", is the named character rolling?
                        } else if (restriction.startsWith("char:")) {
                            DB(`Restriction = CHARACTER.  ID: ${(D.GetChar(restriction.replace(/char:/gu, "")) || {id: false}).id}`, "checkThreshold")      
                            if (input.charID !== (D.GetChar(restriction.replace(/char:/gu, "")) || {id: false}).id){                                
                                DB("... Check FAILED.  Returning FALSE", "checkThreshold")        
                                return false
                            }
                        } else if (restriction.startsWith("loc:")) { 
                            const loc = restriction.replace(/loc:/gu, ""),
                                locations = {
                                    center: _.without([
                                        Media.GetData("DistrictCenter").activeSrc,
                                        Media.GetData("SiteCenter").activeSrc
                                    ], "blank"),
                                    left: _.without([
                                        Media.GetData("DistrictLeft").activeSrc,
                                        Media.GetData("SiteLeft").activeSrc
                                    ], "blank"),
                                    right: _.without([
                                        Media.GetData("DistrictRight").activeSrc,
                                        Media.GetData("SiteRight").activeSrc
                                    ], "blank")
                                }
                            DB(`Restriction = LOCATION: ${D.JS(loc)} vs. ${D.JS(locations)}`, "checkThreshold")    
                            if (locations.center.length) {
                                if (!D.IsIn(loc, locations.center)){                                
                                    DB("... CENTER LOCATION Check FAILED.  Returning FALSE", "checkThreshold")        
                                    return false
                                }
                            } else if (Media.IsInside(Char.GetToken(input.charID), "sandboxLeft")) {
                                if (!D.IsIn(loc, locations.left)){                                
                                    DB("... LEFT LOCATION Check FAILED.  Returning FALSE", "checkThreshold")        
                                    return false
                                }
                            } else if (!D.IsIn(loc, locations.right)) {                                
                                DB("... RIGHT LOCATION Check FAILED.  Returning FALSE", "checkThreshold")        
                                return false
                            }
                        // TEST: If none of the above, does restriction match a trait or a flag?
                        } else if (!D.IsIn(restriction, [..._.keys(traits), ..._.keys(flags)])) {
                            DB(`TRAIT/FLAG check FAILED for: ${D.JS(_.keys(traits))} and ${D.JS(_.keys(flags))}, returning FALSE`, "checkThreshold")
                            return false
                        }
                        // If effect passes all of the threshold tests, return true.
                        DB("All Threshold Checks Passed!  Returning TRUE", "checkThreshold")
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
                    let filteredFlags = _.reject([...rollInput.posFlagLines, ...rollInput.negFlagLines, ...rollInput.redFlagLines, ...rollInput.goldFlagLines], v => _.isString(v))
                    rollFlags = _.object(
                        _.map(filteredFlags, v => v[1].toLowerCase().replace(/\s*?\(●*?\)/gu, "")),
                        _.map(filteredFlags, v => v[0])
                    )
                    DB(`Roll Traits: ${D.JS(rollTraits)}<br>Roll Flags: ${D.JSH(rollFlags)}`, "applyRollEffects")

                // THRESHOLD TEST OF ROLLTARGET: IF TARGET SPECIFIED BUT DOES NOT EXIST, SKIP PROCESSING THIS ROLL EFFECT.
                    if (VAL({ string: rollTarget }) && !D.IsIn(rollTarget, _.keys(rollTraits)) && !D.IsIn(rollTarget, _.keys(rollFlags))) {
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
                                setAttrs(rollInput.charID, { rolleffects: _.compact(getAttrByName(rollInput.charID, "rolleffects").replace(effectString, "").replace(/\|\|/gu, "|").split("|")).join("|") })
                            break
                        default:

                            break
                    }
                        // FIRST ROLLMOD PASS: CONVERT TO NUMBER.
                // Check whether parsing RollData or RollResults
                    let isEffectMoot = false
                    if (VAL({ list: rollData })) {
                        DB(`Validated RollData: ${D.JS(rollData)}`, "applyRollEffects")
                    // Is rollMod a number?
                        if (VAL({ number: rollMod })) {
                        // If rollMod is a number, Is there a rollTarget?
                            if (VAL({ string: rollTarget }))
                            // If so, is the rollTarget present in traits?
                                if (D.IsIn(rollTarget, _.keys(rollTraits)))
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
                            else if (rollMod.startsWith("x") && VAL({ number: rollMod.replace(/x/gu, "") }))
                            // If so, is there a rollTarget?
                                if (VAL({ string: rollTarget })) {
                                // If so, is the rollTarget present in traits?
                                    if (D.IsIn(rollTarget, _.keys(rollTraits)))
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
                            if (VAL({ number: rollMod }, "applyRollEffects")) {
                            // Adjust dice pool by rollMod, adding a gold flag if One Die Minimum applies.
                                let initialHungerPool = rollData.hungerPool
                                rollData.dicePool += rollMod
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
                    } else if (VAL({ list: rollResults }, "applyRollEffects")) {
                    // RollResults rollMods all contain discrete flags/strings, plus digits; can wipe digits for static flag:
                        DB(`Roll Results applies!  Testing rollMod replace switch: ${rollMod.toString().replace(/\d/gu, "")}`, "applyRollEffects")
                        switch (rollMod.toString().replace(/\d/gu, "")) {
                            case "freewpreroll":
                                if (rollResults.isNoWPReroll) {
                                    isEffectMoot = true
                                    break
                                }
                                rollResults.wpCostAfterReroll = VAL({ number: rollResults.wpCost }) ? rollResults.wpCost : 1
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
                                if (VAL({ number: rollResults.wpCostAfterReroll }))
                                    rollResults.wpCostAfterReroll = 2
                                else
                                    rollResults.wpCost = 2
                                DB(`Setting Roll Results Costs:<br>... After Reroll: ${rollResults.wpCostAfterReroll}<br>... WP Cost: ${rollResults.wpCost}`, "applyRollEffects")
                                break
                            case "bestialcancel":
                                if (rollResults.H.botches === 0 || rollResults.total <= 0) { // Moot if there are no bestial dice or no successes to cancel.
                                    isEffectMoot = true
                                    break
                                }
                                for (let i = 0; i < rollResults.H.botches; i++) {
                                    const diceValIndex = _.findIndex(rollResults.diceVals, v => v.includes("Bc") || v.includes("Bs")),
                                        diceVal = rollResults.diceVals[diceValIndex]
                                    if (diceValIndex < 0)
                                        break
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
        parseFlags = (charObj, rollType, params = {}, isDiscRoll = false) => {
            params.args = params.args || []
            const flagData = {
                    negFlagLines: [],
                    posFlagLines: [],
                    redFlagLines: [],
                    goldFlagLines: [],
                    flagDiceMod: 0
                },
                traitList = _.compact(
                    _.map((params.args[1] || params[0] || "").split(","), v => v.replace(/:\d+/gu, "").replace(/_/gu, " "))
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
            if (isDiscRoll)
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
                const zipped = _.compact([...flagData.posFlagLines, ...flagData.negFlagLines, ...flagData.redFlagLines, ...flagData.goldFlagLines]),
                    unzipped = _.unzip(zipped),
                    reduced = _.reduce(unzipped[0], (sum, mod) => sum + mod, 0)
                DB(`Flag Data: ${D.JS(flagData)}<br>... ZIPPED: ${D.JS(zipped)}<br>... UNZIPPED: ${D.JS(unzipped)}<br>... REDUCED: ${D.JS(reduced)}`, "parseFlags")
                flagData.flagDiceMod = reduced
            }           

            return flagData
        },
        parseTraits = (charObj, rollType, params) => {
            let traits = _.compact((params.args[1] || params[0] || "").split(","))
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
                        display: D.Capitalize(tData[0]),
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
                        display: D.IsIn(trt) || getAttrByName(charObj.id, `${trt}_name`),
                        value: parseInt(getAttrByName(charObj.id, trt)) || 0
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
            //D.Alert(D.JS(tFull))

            return tFull
        },
        getRollData = (charObj, rollType, params, isDiscRoll = false) => {
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
              }*/
            const flagData = parseFlags(charObj, rollType, params, isDiscRoll),
                traitData = parseTraits(charObj, rollType, params)
            let rollData = {
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
                diffMod: 0,
                prefix: "",
                diff: null,
                mod: null,
                appliedRollEffects: []
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
        getCurrentRoll = (isNPCRoll = false) => (isNPCRoll ? STATEREF.NPC : STATEREF).rollRecord[(isNPCRoll ? STATEREF.NPC : STATEREF).rollIndex],
        setCurrentRoll = (rollIndex, isNPCRoll = false) => { (isNPCRoll ? STATEREF.NPC : STATEREF).rollIndex = rollIndex },
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
        }
    // #endregion

    // #region Rolling Dice & Formatting Result
    const buildDicePool = rollData => {
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
        rollDice = (rollData, addVals, isNPCRoll = false) => {
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
              }*/
            DB(`ROLL DATA: ${D.JS(rollData)}`, "rollDice")
            if (addVals)
                DB(`ADDED VALS: ${D.JS(addVals)}`, "rollDice")
            const sortBins = [],
                roll = dType => {
                    const d10 = randomInteger(10)
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
                isNPCRoll: isNPCRoll,
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
                switch (val.slice(1, 2)) {
                    case "c":
                        rollResults[dType].crits++
                        rollResults.total++
                        break
                    case "s":
                        rollResults[dType].succs++
                        rollResults.total++
                        break
                    case "f":
                        rollResults[dType].fails++
                        break
                    case "b":
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
                    rollResults.diceVals = _.map(rollResults.rolls, rol => parseInt(rol.slice(1)) < 6 ? "Hb" : "Bs")
                    if (rollResults.diceVals[1] && rollResults.diceVals[0] !== rollResults.diceVals[1])
                        rollResults.diceVals = ["Hb", "Bs"]
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
            return rollResults
        },
        formatDiceLine = (rollData = {}, rollResults, split = 15, isSmall = false) => {
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
            let logLine = `${CHATSTYLES.resultBlock}${CHATSTYLES.resultCount}${rollResults.total}:</span></div>${
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
                _.each(rollResults.diceVals, v => {
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
                        typeof rollResults.margin === "number" ?
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
        displayRoll = (isLogging = true, isNPCRoll = false) => {
            /* MUST SUPPLY:
              [ALL]
                rollData = { type, charName, charID }
                rollResults = { total, diceVals: [] }
              [ALL Non-Checks]
                rollData = { mod, dicePool, traits: [], traitData: { value, display }, << diff >> }
                rollResults = { H: { botches }, critPairs: {hh, hb, bb}, << margin >> }
              [TRAIT ONLY]
                rollData = { posFlagLines, negFlagLines } */
            const { rollData, rollResults } = getCurrentRoll(isNPCRoll),
                [deltaAttrs, txtWidths] = [{}, {}],
                [mainRollParts, mainRollLog, diceObjs] = [[], [], []],
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
                p = v => rollData.prefix + v
            let [blankLines, introPhrase, logPhrase, logString, stains, margin, total, bookends, spread] = new Array(9).fill(null),
                maxHumanity = 10,
                diceCats = _.clone(STATECATS.dice)
            switch (rollData.type) {
                case "project":
                    rollLines.subOutcome = {
                        text: ""
                    }
                /* falls through */
                case "trait":
                    //D.Alert(`posFlagLines.length: ${posFlagLines.length}<br>${D.JS(posFlagLines)}`)
                    if (posFlagLines.length) {
                        rollLines.posMods = {
                            text: `+ ${posFlagLines.join(" + ")}`,
                        }
                        rollLines.mainRoll.shifttop = -20
                    }
                    if (negFlagLines.length) {
                        rollLines.negMods = {
                            text: `- ${negFlagLines.join(" - ")}`,
                            shiftleft: 20 + Media.GetTextWidth("posMods", rollLines.posMods ? rollLines.posMods.text : "")
                        }
                        rollLines.mainRoll.shifttop = -20
                    }
                    if (redFlagLines.length)
                        rollLines.redMods = {
                            text: redFlagLines.join(", ")
                        }
                    if (goldFlagLines.length) {
                        rollLines.goldMods = {
                            text: goldFlagLines.join(", ")
                        }
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
                Media.Set("rollerImage_diffFrame", "blank")

            _.each(_.keys(rollLines), line => {
                if (_.isString(COLORSCHEMES[rollData.type][line]))
                    rollLines[line] = setColor(line, rollData.type, rollLines[line])
            })

            blankLines = _.without(_.keys(TEXTLINES), ..._.keys(rollLines))

            DB(`ROLL LINES:<br>@T@${D.JS(_.keys(rollLines))}<br>BLANKING LINES:<br>@T@${D.JS(blankLines)}`, "displayRoll")

            _.each(rollLines, (content, name) => {
                switch (name) {
                    case "mainRoll":
                        switch (rollData.type) {
                            case "remorse":
                                introPhrase = introPhrase || `Does ${rollData.charName} feel remorse?`
                                logPhrase = logPhrase || " rolls remorse:"
                            /* falls through */
                            case "frenzy":
                                introPhrase = introPhrase || `${rollData.charName} and the Beast wrestle for control...`
                                logPhrase = logPhrase || " resists frenzy:"
                            /* falls through */
                            case "project":
                                introPhrase = introPhrase ||
                                    `${rollData.charName} launches a Project:`
                                logPhrase = logPhrase ||
                                    " launches a Project:"
                            /* falls through */
                            case "trait":
                            case "willpower":
                            case "humanity":
                                introPhrase = introPhrase || `${rollData.charName} rolls: `
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
                                        mainRollParts.push(
                                            `${rollData.traitData[trt].display} (${dotline})`
                                        )
                                        mainRollLog.push(
                                            `${rollData.traitData[trt].display} (${rollData.traitData[trt].value})`
                                        )
                                    }
                                })
                                // LogLines.rollerName += logPhrase;
                                rollLines.rollerName.text = introPhrase
                                rollLines.mainRoll.text = mainRollParts.join(" + ")
                                logLines.mainRoll = CHATSTYLES.mainRoll + mainRollLog.join(" + ")
                                if (rollData.mod && rollData.mod !== 0)
                                    if (rollData.traits.length === 0 && rollData.mod > 0) {
                                        rollLines.mainRoll.text = `${rollData.mod} Dice`
                                        logLines.mainRoll = `${CHATSTYLES.mainRoll + rollData.mod} Dice`
                                    } else {
                                        logLines.mainRoll += (rollData.mod < 0 ? " - " : " + ") + Math.abs(rollData.mod)
                                        rollLines.mainRoll.text += (rollData.mod < 0 ? " - " : " + ") + Math.abs(rollData.mod)
                                    }

                                if (rollData.type === "project")
                                    deltaAttrs[p("projectlaunchresultsummary")] = logLines.mainRoll
                                if (rollData.dicePool <= 0) {
                                    logLines.mainRollSub = `${CHATSTYLES.mainRollSub}(One Die Minimum)</span>`
                                    rollData.dicePool = 1
                                    rollLines.mainRoll.text += " (One Die Minimum)"
                                }
                                break
                            case "rouse2":
                                rollLines.mainRoll.text = " (Best of Two)"
                                logLines.mainRollSub = `${CHATSTYLES.mainRollSub}(Best of Two)</span>`
                            /* falls through */
                            case "rouse":
                                introPhrase = introPhrase || `${rollData.charName}:`
                                logPhrase = logPhrase || ":"
                                logLines.mainRoll = `${CHATSTYLES.check}Rouse Check`
                                rollLines.mainRoll.text = `Rouse Check${rollLines.mainRoll.text}`
                                break
                            case "check":
                                introPhrase = introPhrase || `${rollData.charName}:`
                                logPhrase = logPhrase || ":"
                                logLines.mainRoll = `${CHATSTYLES.check}Simple Check`
                                rollLines.mainRoll.text = "Simple Check"
                                break
                            default:
                                introPhrase = introPhrase || `${rollData.charName}:`
                                logPhrase = logPhrase || ":"
                        }
                        logLines.rollerName = logPhrase
                        rollLines.rollerName.text = introPhrase || ""
                        break
                    case "dicePool":
                        rollLines.dicePool.text = JSON.stringify(rollData.dicePool)
                        break
                    case "difficulty":
                        if (!rollResults.isNPCRoll) {
                            if (rollData.diff === 0 && rollData.diffMod === 0) {
                                // D.Alert("Difficulty Is BLANK!")
                                rollLines.difficulty.text = " "
                                Media.Set("rollerImage_diffFrame", "blank")
                                break
                            }
                            // D.Alert(`Setting Difficulty to ${rollData.diff}`)
                            Media.Set("rollerImage_diffFrame", "base")
                            rollLines.difficulty = {
                                text: rollData.diff.toString()
                            }
                        }
                        logLines.difficulty = ` vs. ${rollData.diff}`
                        if (rollData.type === "project")
                            deltaAttrs[p("projectlaunchresultsummary")] += ` vs. Difficulty ${rollData.diff}`

                        /* D.Alert(`RollLines: ${D.JS(rollLines)}`)
                                 D.Alert(`LogLines: ${D.JS(logLines)}`) */
                        break
                    case "resultCount":
                        rollLines.resultCount.text = JSON.stringify(rollResults.total)
                        break
                    case "margin":
                        ({
                            margin
                        } = rollResults)
                        if (!margin) {
                            rollLines.margin.text = " "
                            break
                        }
                        rollLines.margin.text = (margin > 0 ? "+" : margin === 0 ? "" : "-") + Math.abs(margin)
                        logLines.margin = ` (${margin > 0 ? "+" : margin === 0 ? "" : "-"}${Math.abs(margin)})${logLines.margin}`
                        rollLines.margin = setColor("margin", rollData.type, rollLines.margin, margin >= 0 ? "good" : "bad")
                        break
                    case "outcome":
                        ({
                            total,
                            margin
                        } = rollResults)
                        switch (rollData.type) {
                            case "project":
                                rollLines.outcome.shift = {
                                    top: -10
                                }
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
                                if (
                                    (total === 0 || margin && margin < 0) &&
                                    rollResults.H.botches > 0
                                ) {
                                    rollLines.outcome.text = "BESTIAL FAILURE!"
                                    logLines.outcome = `${CHATSTYLES.outcomeRed}BESTIAL FAILURE!</span></div>`
                                    rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "worst")
                                    break
                                } else if (
                                    !rollResults.noMessyCrit &&
                                    (!margin || margin >= 0) &&
                                    rollResults.critPairs.hb + rollResults.critPairs.hh > 0
                                ) {
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
                                if (rollResults.total > 0) {
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
                        }
                        break
                    default:
                        break
                }
            })

            if (_.isNumber(deltaAttrs.hunger))
                Media.Toggle(`Hunger${getAttrByName(rollData.charID, "sandboxquadrant")}_1`, true, deltaAttrs.hunger)

            logLines.rollerName = `${CHATSTYLES.rollerName + rollData.charName + logLines.rollerName}</div>`
            if ((logLines.mainRoll + logLines.difficulty).replace(/<div.*?span.*?>/gu, "").length > 40) 
                for(const abbv of _.keys(C.ATTRABBVS)) 
                    logLines.mainRoll = logLines.mainRoll.replace(new RegExp(C.ATTRABBVS[abbv], "gui"), abbv)
            if ((logLines.mainRoll + logLines.difficulty).replace(/<div.*?span.*?>/gu, "").length > 40) 
                for(const abbv of _.keys(C.SKILLABBVS)) 
                    logLines.mainRoll = logLines.mainRoll.replace(new RegExp(C.SKILLABBVS[abbv], "gui"), abbv)
            logLines.mainRoll = `${logLines.mainRoll + logLines.difficulty}</span>${logLines.mainRollSub}</div>`
            logLines.resultDice = formatDiceLine(rollData, rollResults, 13)
            logString = `${logLines.fullBox + logLines.rollerName + logLines.mainRoll + logLines.resultDice +
                logLines.outcome + logLines.subOutcome}</div>`

            DB(`Chat Frame (LogLine) HTML:<br>${D.JSC(logLines)}`, "displayRoll")

            _.each(blankLines, line => {
                rollLines[line] = {
                    text: " "
                }
            })
            if (["rouse", "rouse2", "check"].includes(rollData.type))
                diceCats = diceCats.reverse()
                
            if (!rollResults.isNPCRoll) {
                DB(`Setting Category: '${D.JS(diceCats[0])}' (total dice: ${D.JS(STATEREF[diceCats[0]].length)})<br>Showing Dice: [${D.JS(_.reject(_.map(STATEREF[diceCats[0]], vv => vv.value), v => v === "blank").join(", "))}]`, "displayRoll")

                for (let i = 0; i < STATEREF[diceCats[0]].length; i++)
                    diceObjs.push(setDie(i, diceCats[0], rollResults.diceVals[i] || "blank", {
                        type: rollData.type,
                        shift: {
                            top: yShift
                        }
                    }, rollData.type))


                bookends = [diceObjs[0], diceObjs[rollResults.diceVals.length - 1]]

                if (!bookends || bookends.length < 2 || _.isUndefined(bookends[0]) || _.isUndefined(bookends[1]))
                    return THROW(`Bookends Not Found.  DiceObjs.length is ${diceObjs.length}, rollResults.diceVals is ${rollResults.diceVals.length}: ${D.JS(diceObjs)}`, "displayRoll")

                spread = bookends[1].get("left") - bookends[0].get("left")

                scaleFrame("bottom", spread)
                for (let i = 0; i < STATEREF[diceCats[1]].length; i++)
                    setDie(i, diceCats[1], "blank")
                if (["rouse", "rouse2", "check", "project", "secret", "humanity", "willpower", "remorse"].includes(rollData.type) || rollResults.isNoWPReroll)
                    DragPads.Toggle("selectDie", false)
                _.each(rollLines, (args, name) => {
                    Media.SetText(name, args)
                    txtWidths[name] = Media.GetTextWidth(name)
                })
                spread = txtWidths.posMods || 0 + txtWidths.negMods || 0
                const [bottomEndData, outcomeData] = [Media.GetData("rollerImage_bottomEnd"), Media.GetTextData("outcome")],
                    redPosParams = {
                        shifttop: rollLines.redMods.shifttop || 0,
                        shiftleft: txtWidths.outcome + 20
                    },
                    goldPosParams = {
                        shifttop: rollLines.goldMods.shifttop || 0,
                        shiftleft: txtWidths.outcome + 20
                    }
                bottomEndData.left = Media.GetObj("rollerImage_bottomEnd").get("left")
                DB(`bottomEndData: ${D.JS(bottomEndData)}<br>outcomeData: ${D.JS(outcomeData)}<br><br>RedPosParams: ${D.JS(redPosParams)}<br>GoldPosParams: ${D.JS(goldPosParams)}`, "displayRoll")
                DB(`COMPARE: ${bottomEndData.left + 0.5 * bottomEndData.width - 100} <--> ${outcomeData.left + txtWidths.outcome}`, "displayRoll")
                if ((bottomEndData.left + 0.5 * bottomEndData.width - 100) < (outcomeData.left + txtWidths.outcome)) {
                    redPosParams.shifttop = (redPosParams.shifttop || 0) - 95
                    goldPosParams.shifttop = (goldPosParams.shifttop || 0) - 95
                    redPosParams.shiftleft = bottomEndData.left - outcomeData.left + 0.5 * bottomEndData.width + 20
                    goldPosParams.shiftleft = bottomEndData.left - outcomeData.left + 0.5 * bottomEndData.width + 20
                }      
                DB(`NEW redPosParams: ${D.JS(redPosParams)}<br>NEW goldPosParams: ${D.JS(goldPosParams)}`, "displayRoll")            
                Media.SetText("goldMods", Object.assign(_.omit(rollLines.goldMods, "text"), redPosParams))
                Media.SetText("redMods", Object.assign(_.omit(rollLines.redMods, "text"), goldPosParams))
                //spread += txtWidths.posMods && txtWidths.negMods ? 100 : 0
                spread = Math.max(spread, txtWidths.mainRoll)
                scaleFrame("top", spread)
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

            return deltaAttrs
        },
        makeNewRoll = (charObj, rollType, params, isDiscRoll = false, isNPCRoll = false) => {
            DB(`BEGINNING ROLL:
                CHAR: ${D.JS(charObj.get("name"))}
				ROLL TYPE: ${D.JS(rollType)}
                ... DISC ROLL? ${D.JS(isDiscRoll)}
                ... NPC ROLL? ${D.JS(isNPCRoll)}
				PARAMS: [${D.JS(params.join(", "))}] (length: ${params.length})`, "makeNewRoll")
            const rollData = buildDicePool(getRollData(charObj, rollType, params, isDiscRoll))
            recordRoll(rollData, rollDice(rollData, null, isNPCRoll))
            displayRoll(true, isNPCRoll)
        },
        wpReroll = (dieCat, isNPCRoll = false) => {
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
            const rollResults = rollDice(rollData, _.values(rolledDice), isNPCRoll)
            rollResults.wpCost = rollRecord.rollResults.wpCost
            rollResults.wpCostAfterReroll = rollRecord.rollResults.wpCostAfterReroll

            if (charObj) {
                Char.Damage(charObj, "willpower", "spent", rollResults.wpCost)
                if (VAL({ number: rollResults.wpCostAfterReroll })) {
                    rollResults.wpCost = rollRecord.rollResults.wpCostAfterReroll
                    delete rollResults.wpCostAfterReroll
                }
            }

            replaceRoll(rollData, rollResults)
            displayRoll(true, isNPCRoll)
            //Media.SetText("goldMods", Media.GetTextData("goldMods").text.replace(/District Bonus \(Free Reroll\)/gu, ""))
            lockRoller(false)
            DragPads.Toggle("wpReroll", false)
        },
        changeRoll = (deltaDice, isNPCRoll = false) => {
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
            }), rollResults.diceVals, isNPCRoll)
            rollData.dicePool += parseInt(deltaDice)
            rollData.basePool = Math.max(1, rollData.dicePool) - rollData.hungerPool
            replaceRoll(rollData, rollResults)
            displayRoll(true, isNPCRoll)
            return true
        },
        lockRoller = lockToggle => { isLocked = lockToggle === true },
        loadRoll = (rollIndex, isNPCRoll = false) => {
            setCurrentRoll(rollIndex, isNPCRoll)
            displayRoll(false, isNPCRoll)
        },
        loadPrevRoll = (isNPCRoll = false) => {
            const recordRef = isNPCRoll ? STATEREF.NPC : STATEREF
            loadRoll(Math.min(recordRef.rollIndex + 1, Math.max(recordRef.rollRecord.length - 1, 0)), isNPCRoll)
        },
        loadNextRoll = (isNPCRoll = false) => {
            const recordRef = isNPCRoll ? STATEREF.NPC : STATEREF
            loadRoll(Math.max(recordRef.rollIndex - 1, 0), isNPCRoll)
        }
    // #endregion

    // #region Secret Rolls
    const makeSecretRoll = (chars, params, isSilent, isHidingTraits) => {
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
            playerLine = `${CHATSTYLES.secret.greyS}rolling </span>${CHATSTYLES.secret.white}${_.map(_.keys(rollData.traitData), k => k.toLowerCase()).join(`</span><br>${CHATSTYLES.space30}${CHATSTYLES.secret.greyPlus}${CHATSTYLES.secret.white}`)}</span>`
            if (rollData.mod !== 0)
                playerLine += `${(rollData.mod > 0 ? CHATSTYLES.secret.greyPlus : "") + (rollData.mod < 0 ? CHATSTYLES.secret.greyMinus : "") + CHATSTYLES.secret.white + Math.abs(rollData.mod)}</span>`
        }

        if (rollData.traits.length) {
            traitLine = _.keys(rollData.traitData).join(" + ")
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
                CHATSTYLES.secret.diceStart}${formatDiceLine(rollData, rollResults, 9, true).replace(/text-align: center; height: 20px/gu, "text-align: center; height: 20px; line-height: 25px").
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
    }
    // #endregion

    // #region Getting Random Resonance Based On District/Site Parameters
    const getResonance = (posRes = "", negRes = "", isDoubleAcute, testCycles = 0) => {
        let resProbs = [],
            randNum = null,
            resonances = {
                "Choleric": "c",
                "Melancholic": "m",
                "Phlegmatic": "p",
                "Sanguine": "s",
                "Primal": "r",
                "Ischemic": "i",
                "Mercurial": "q"
            },
            discLines = {
                "Choleric": "the resonant disciplines of Celerity and Potence",
                "Melancholic": "the resonant disciplines of Fortitude and Obfuscate",
                "Phlegmatic": "the resonant disciplines of Auspex and Dominate",
                "Sanguine": "the resonant disciplines of Blood Sorcery and Presence",
                "Primal": "the resonant disciplines of Animalism and Protean",
                "Ischemic": "the resonant discipline of Oblivion",
                "Mercurial": "the resonant practice of Alchemy"
            },
            tracer = "",
            resList = _.keys(resonances)
        _.each(resonances, (v, k) => {
            if (posRes.includes(v)) {
                resList = _.without(resList, k)
                resList.unshift(k)
            }
            if (negRes.includes(v)) {
                resList = _.without(resList, k)
                resList.push(k)
            }
        })
        if (!(posRes + negRes).includes("r"))
            resList = _.without(resList, "Primal")
        if (!(posRes + negRes).includes("i"))
            resList = _.without(resList, "Ischemic")
        if (!(posRes + negRes).includes("q"))
            resList = _.without(resList, "Mercurial")
        resList = resList.slice(0, 4)
        switch (posRes.length + negRes.length) {
            case 3:
                tracer += "3 Args, "
                if (posRes.length === 2) {
                    tracer += "2 PosRes, "
                    if (posRes.charAt(0) === posRes.charAt(1)) {
                        tracer += "Equal: pos2neg"
                        resProbs = C.RESONANCEODDS.pos2neg
                    } else {
                        tracer += "UnEqual: posposneg"
                        resProbs = C.RESONANCEODDS.posposneg
                    }
                } else if (negRes.charAt(0) === negRes.charAt(1)) {
                    tracer += "2 NegRes + Equal: neg2pos"
                    resProbs = C.RESONANCEODDS.neg2pos
                } else {
                    tracer += "2 NegRes + UnEqual: posnegneg"
                    resProbs = C.RESONANCEODDS.posnegneg
                }
                break
            case 2:
                tracer += "2 Args, "
                if (posRes.length === 2) {
                    tracer += "2 PosRes, "
                    if (posRes.charAt(0) === posRes.charAt(1)) {
                        tracer += "Equal: pos2"
                        resProbs = C.RESONANCEODDS.pos2
                    } else {
                        tracer += "UnEqual: pospos"
                        resProbs = C.RESONANCEODDS.pospos
                    }
                } else if (negRes.length === 2) {
                    tracer += "2 NegRes, "
                    if (negRes.charAt(0) === negRes.charAt(1)) {
                        tracer += "Equal: neg2"
                        resProbs = C.RESONANCEODDS.neg2
                    } else {
                        tracer += "UnEqual: negneg"
                        resProbs = C.RESONANCEODDS.negneg
                    }
                } else {
                    tracer += "Neg & Pos: posneg"
                    resProbs = C.RESONANCEODDS.posneg
                }
                break
            case 1:
                tracer += "1 Arg, " + (posRes.length === 1 ? "Pos: pos" : "Neg: neg")
                resProbs = posRes.length === 1 ? C.RESONANCEODDS.pos : C.RESONANCEODDS.neg
                break
            case 0:
                tracer += "0 Args, norm"
                resProbs = C.RESONANCEODDS.norm
                break
            default:
                return THROW("Too many variables!", "getResonance")
        }
        let theseProbs = []
        _.each(resProbs, v => {
            theseProbs.push({
                neg: v.neg,
                fleet: v.fleet,
                intense: v.intense,
                acute: v.acute
            })
        })
        if (isDoubleAcute === "2")
            for (let i = 0; i < 4; i++) {
                theseProbs[i].acute = 3 * theseProbs[i].acute
                theseProbs[i].neg = 0.92 * theseProbs[i].neg
                theseProbs[i].intense = 0.92 * theseProbs[i].intense
                theseProbs[i].fleet = 0.92 * theseProbs[i].fleet
            }

        theseProbs = _.flatten(_.map(theseProbs, v => _.values(v)))
        //D.Alert(`theseProbs: ${D.JS(theseProbs)}`)
        if (parseInt(testCycles) > 0) {
            let record = {
                NG: { C: 0, M: 0, P: 0, S: 0, R: 0, I: 0, Q: 0, TOT: 0, PER: 0 },
                FL: { C: 0, M: 0, P: 0, S: 0, R: 0, I: 0, Q: 0, TOT: 0, PER: 0 },
                IN: { C: 0, M: 0, P: 0, S: 0, R: 0, I: 0, Q: 0, TOT: 0, PER: 0 },
                AC: { C: 0, M: 0, P: 0, S: 0, R: 0, I: 0, Q: 0, TOT: 0, PER: 0 },
                C: { NG: 0, FL: 0, IN: 0, AC: 0, TOT: 0, PER: 0 },
                M: { NG: 0, FL: 0, IN: 0, AC: 0, TOT: 0, PER: 0 },
                P: { NG: 0, FL: 0, IN: 0, AC: 0, TOT: 0, PER: 0 },
                S: { NG: 0, FL: 0, IN: 0, AC: 0, TOT: 0, PER: 0 },
                R: { NG: 0, FL: 0, IN: 0, AC: 0, TOT: 0, PER: 0 },
                I: { NG: 0, FL: 0, IN: 0, AC: 0, TOT: 0, PER: 0 },
                Q: { NG: 0, FL: 0, IN: 0, AC: 0, TOT: 0, PER: 0 }
            }
            for (let i = 0; i < parseInt(testCycles); i++) {
                randNum = Math.random()
                let testProbs = _.clone(theseProbs),
                    testResonances = _.clone(resList)
                do
                    randNum -= testProbs.shift()
                while (randNum > 0)
                record[["NG", "FL", "IN", "AC"][3 - testProbs.length % 4]][resonances[testResonances.reverse()[Math.floor(testProbs.length / 4)]].toUpperCase()]++
                record[["NG", "FL", "IN", "AC"][3 - testProbs.length % 4]].TOT++
                record[resonances[testResonances.reverse()[Math.floor(testProbs.length / 4)]].toUpperCase()][["NG", "FL", "IN", "AC"][3 - testProbs.length % 4]]++
                record[resonances[testResonances.reverse()[Math.floor(testProbs.length / 4)]].toUpperCase()].TOT++
            }
            _.each(record, (data, k) => {
                record[k].PER = `${Math.round(data.TOT / parseInt(testCycles) * 10000) / 100}%`
                record[k] = `${data.TOT} (${record[k].PER})`
            })
            D.Alert(`Trace: ${D.JS(tracer)}<br><br>testProbs: ${D.JS(theseProbs)}<br><br>Resonances: ${D.JS(resList)}<br><br>${D.JS(record)}`)
        }

        randNum = Math.random()
        do
            randNum -= theseProbs.shift()
        while (randNum > 0)

        let thisRes = resList.reverse()[Math.floor(theseProbs.length / 4)]

        return [
            ["Negligibly", "Fleetingly", "Intensely", "Acutely"][3 - theseProbs.length % 4],
            thisRes,
            discLines[thisRes]
        ]
        // Return ["Acute", "Choleric"];
    }
    // #endregion

    return {
        RegisterEventHandlers: regHandlers,
        CheckInstall: checkInstall,
        Select: selectDie,
        Reroll: wpReroll,
        Clean: cleanRoller
    }
})()

on("ready", () => {
    Roller.RegisterEventHandlers()
    Roller.CheckInstall()
    D.Log("Roller Ready!")
})
void MarkStop("Roller")