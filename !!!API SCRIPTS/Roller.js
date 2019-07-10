void MarkStart("Roller")
const Roller = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Roller",
        CHATCOMMAND = null,
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
    }

    // #endregion	

    // #region EVENT HANDLERS: (HANDLEINPUT)
    const handleInput = (msg, who, call, args) => {
        let [rollType, charObj, diceNums, resonance, resDetails, resIntLine, params] = new Array(7),
            name = "",
            [isSilent, isHidingTraits] = [false, false]
        switch (call) { 		// !traitroll @{character_name}|Strength,Resolve|3|5|0|ICompulsion:3,IPhysical:2
            case "!frenzyinitroll":	// !projectroll @{character_name}|Politics:3,Resources:2|mod|diff|diffMod|rowID
                lockRoller(true)
                STATEREF.frenzyRoll = `${args.join(" ").split("|")[0]}|`
                sendChat("ROLLER", `/w Storyteller <br/><div style='display: block; background: url(https://i.imgur.com/kBl8aTO.jpg); text-align: center; border: 4px crimson outset;'><br/><span style='display: block; font-size: 16px; text-align: center; width: 100%'>[Set Frenzy Diff](!#Frenzy)</span><span style='display: block; text-align: center; font-size: 12px; font-weight: bolder; color: white; font-variant: small-caps; margin-top: 4px; width: 100%'>~ for ~</span><span style='display: block; font-size: 14px; color: red; text-align: center; font-weight: bolder; font-variant: small-caps; width: 100%'>${args.join(" ").split("|")[0]}</span><br/></div>`)
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
            case "!reg": case "!register":
                if (!msg.selected || !msg.selected[0])
                    THROW("Select a Graphic!", "!reg")
                else
                    switch (args.shift()) {
                        case "die":
                            registerDie(getObj("graphic", msg.selected[0]._id), args.shift())
                            break
                        case "text":
                            registerText(getObj("text", msg.selected[0]._id), args.shift())
                            break
                        case "shape":
                            name = args.shift()
                            registerShape(getObj("path", msg.selected[0]._id), name, args.shift())
                            break
                        case "image":
                        case "img":
                            name = args.shift()
                            registerImg(getObj("graphic", msg.selected[0]._id), name, args.join(","))
                            break
                        case "repo":
                        case "reposition":
                            reposition(msg.selected)
                            break
                        default:
                            THROW("Bad registration code.", "!reg repo")
                            break
                    }

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
                sendChat("Resonance Check", D.JSH(`<div style="display: block; margin-left: -40px; height: auto; background: url(https://i.imgur.com/kBl8aTO.jpg);text-align: center;border: 4px crimson outset; padding: 5px; width: 255px;"><span style="display: block; font-weight: bold; color: red; text-align: center; width: 100%; font-family: sexsmith; font-size: 32px; height: 45px; line-height: 45px;">${
                    _.map([resonance[0], resonance[1]], v => v.toUpperCase()).join(" ")
                }</span><span style="display: block; width: 100%; text-align: center; font-family: Voltaire; color: black; background-color: red; font-size: 16px; margin-bottom: 7px; border-top: 1px solid red; border-bottom: 1px solid red; height: 20px; line-height: 20px; font-weight: bold;">${
                    resDetails
                }</span><span style="display: block; color: red; font-size: 18px; text-align: center; width: 100%; font-family: sexsmith; font-weight: bold; text-shadow: 0px 0px 1px black, 0px 0px 1px black, 0px 0px 1px black, 0px 0px 1px black, 0px 0px 1px black; line-height: 22px;">${
                    resIntLine
                }</span></div>`)
                )
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
                blank: "https://s3.amazonaws.com/files.d20.io/images/63990142/MQ_uNU12WcYYmLUMQcbh0w/thumb.png?1538455511",
                selected: "https://s3.amazonaws.com/files.d20.io/images/64173198/T0qdnbmLUCnrs9WlxoGwww/thumb.png?1538710883",
                selectedFree: "https://s3.amazonaws.com/files.d20.io/images/64173198/T0qdnbmLUCnrs9WlxoGwww/thumb.png?1538710883",
                selectedDouble: "https://s3.amazonaws.com/files.d20.io/images/64173198/T0qdnbmLUCnrs9WlxoGwww/thumb.png?1538710883",
                Bf: "https://s3.amazonaws.com/files.d20.io/images/64173205/DOUwwGcobI4eyu1Wb8ZDxg/thumb.png?1538710883",
                Bs: "https://s3.amazonaws.com/files.d20.io/images/64173203/ZS04TJE6VRI8_Q-HaJ0r4g/thumb.png?1538710883",
                Bc: "https://s3.amazonaws.com/files.d20.io/images/64173206/Fbt_6j-k_1oRKPxTKdnIWQ/thumb.png?1538710883",
                BcL: "https://s3.amazonaws.com/files.d20.io/images/64173208/cIP4B1Y14gVdYrS3YPYNbQ/thumb.png?1538710883",
                BcR: "https://s3.amazonaws.com/files.d20.io/images/64173199/1thrJQz9Hmzv0tQ6awSOGw/thumb.png?1538710883",
                Hb: "https://s3.amazonaws.com/files.d20.io/images/64173201/mYkpkP6l9WX9BKt5fjTrtw/thumb.png?1538710883",
                Hf: "https://s3.amazonaws.com/files.d20.io/images/64173204/AacOfDpF2jMCn1pYPmqlUQ/thumb.png?1538710882",
                Hs: "https://s3.amazonaws.com/files.d20.io/images/64173209/D_4ljxj59UYXPNmgXaZbhA/thumb.png?1538710883",
                Hc: "https://s3.amazonaws.com/files.d20.io/images/64173202/xsEkLc9DcOslpQoUJwpHMQ/thumb.png?1538710883",
                HcL: "https://s3.amazonaws.com/files.d20.io/images/64173200/cBsoLkAu15XWexFSNUxoHA/thumb.png?1538710883",
                HcR: "https://s3.amazonaws.com/files.d20.io/images/64173207/Se7RHT2fJDg2qMGo_x5UhQ/thumb.png?1538710883",
                BXc: "", // Cancelled Critical Dice
                BXs: "", // Cancelled Success Dice
                HXc: "", // Cancelled Critical Hunger Dice
                HXs: "", // Cancelled Success Hunger Dice
                HXb: "", // Cancelled Botched Hunger Dice
                BFf: "", // Free Reroll Failed Dice
                BFc: "", // Free Reroll Critical Dice
                BFcL: "", // Free Reroll Left Critical Pair Dice
                BFcR: "", // Free Reroll Right Critical Pair Dice
                BDf: "", // Double-Cost Reroll Dice
                BDc: "", // Double-Cost Reroll Critical Dice
                BDcL: "", // Double-Cost Reroll Left Critical Pair Dice
                BDcR: "", // Double-Cost Reroll Right Critical Pair Dice
                HCb: "" // Cancelling Botched Hunger Dice
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
        COLORS = {
            white: "rgb(255, 255, 255)",
            black: "rgb(0, 0, 0)",
            brightgrey: "rgb(175, 175, 175)",
            grey: "rgb(130, 130, 130)",
            darkgrey: "rgb(80, 80, 80)",
            brightred: "rgb(255, 0, 0)",
            red: "rgb(200, 0, 0)",
            darkred: "rgb(150, 0, 0)",
            green: "rgb(0, 200, 0)",
            yellow: "rgb(200, 200, 0)",
            orange: "rgb(200, 100, 0)",
            brightpurple: "rgb(200, 0, 200)",
            purple: "rgb(150, 0, 150)",
            darkpurple: "rgb(100, 0, 100)",
            brightblue: "rgb(150, 150, 255)",
            blue: "rgb(100, 100, 255)",
            darkblue: "rgb(50, 50, 150)",
            cyan: "rgb(0, 255, 255)",
            gold: "#ffee66"
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
                color: COLORS.white,
                text: "rollerName"
            },
            rollerNameShadow: {
                font_family: "Candal",
                font_size: 32,
                top: 25,
                left: 50,
                color: COLORS.black,
                text: "rollerName"
            },
            mainRoll: {
                font_family: "Contrail One",
                font_size: 40,
                top: 73,
                left: 135,
                color: COLORS.white,
                text: "mainRoll"
            },
            mainRollShadow: {
                font_family: "Contrail One",
                font_size: 40,
                top: 78,
                left: 140,
                color: COLORS.black,
                text: "mainRoll"
            },
            posMods: {
                font_family: "Contrail One",
                font_size: 32,
                top: 115,
                left: 157,
                color: COLORS.white,
                text: "posMods"
            },
            negMods: {
                font_family: "Contrail One",
                font_size: 32,
                top: 115,
                left: 476,
                color: COLORS.red,
                text: "negMods"
            },
            redMods: {
                font_family: "Contrail One",
                font_size: 32,
                top: 115,
                left: 957,
                color: COLORS.red,
                text: "redMods"
            },
            goldMods: {
                font_family: "Contrail One",
                font_size: 32,
                top: 75,
                left: 957,
                color: COLORS.gold,
                text: "goldMods"
            },
            summary: {
                font_family: "Candal",
                font_size: 56,
                top: 91,
                left: 75,
                color: COLORS.white,
                text: "SS"
            },
            summaryShadow: {
                font_family: "Candal",
                font_size: 56,
                top: 96,
                left: 80,
                color: COLORS.black,
                text: "SS"
            },
            difficulty: {
                font_family: "Contrail One",
                font_size: 32,
                top: 253,
                left: 96,
                color: COLORS.white,
                text: "D"
            },
            resultCount: {
                font_family: "Candal",
                font_size: 56,
                top: 185,
                left: 75,
                color: COLORS.white,
                text: "RC"
            },
            resultCountShadow: {
                font_family: "Candal",
                font_size: 56,
                top: 190,
                left: 80,
                color: COLORS.black,
                text: "RC"
            },
            margin: {
                font_family: "Candal",
                font_size: 72,
                top: 294,
                left: 133,
                color: COLORS.white,
                text: "M"
            },
            outcome: {
                font_family: "Contrail One",
                font_size: 100,
                top: 297,
                left: 200,
                color: COLORS.white,
                text: "outcome"
            },
            subOutcome: {
                font_family: "Contrail One",
                font_size: 32,
                top: 341,
                left: 360,
                color: COLORS.white,
                text: "subOutcome"
            }
        },
        COLORSCHEMES = {
            project: {
                rollerName: COLORS.white,
                mainRoll: COLORS.white,
                posMods: COLORS.white,
                negMods: COLORS.brightred,
                summary: COLORS.white,
                difficulty: COLORS.white,
                resultCount: COLORS.white,
                margin: {
                    good: COLORS.white,
                    bad: COLORS.brightred
                },
                outcome: {
                    best: COLORS.white,
                    good: COLORS.white,
                    bad: COLORS.orange,
                    worst: COLORS.brightred
                },
                subOutcome: {
                    best: COLORS.white,
                    good: COLORS.white,
                    bad: COLORS.orange,
                    worst: COLORS.brightred
                }
            },
            trait: {
                rollerName: COLORS.white,
                mainRoll: COLORS.white,
                posMods: COLORS.white,
                negMods: COLORS.brightred,
                summary: COLORS.white,
                difficulty: COLORS.white,
                resultCount: COLORS.white,
                margin: {
                    good: COLORS.white,
                    bad: COLORS.brightred
                },
                outcome: {
                    best: COLORS.white,
                    good: COLORS.white,
                    bad: COLORS.orange,
                    worst: COLORS.brightred
                }
            },
            willpower: {
                rollerName: COLORS.white,
                mainRoll: COLORS.white,
                posMods: COLORS.white,
                negMods: COLORS.brightred,
                summary: COLORS.white,
                difficulty: COLORS.white,
                resultCount: COLORS.white,
                margin: {
                    good: COLORS.white,
                    bad: COLORS.brightred
                },
                outcome: {
                    best: COLORS.white,
                    good: COLORS.white,
                    bad: COLORS.orange,
                    worst: COLORS.brightred
                }
            },
            humanity: {
                rollerName: COLORS.white,
                mainRoll: COLORS.white,
                posMods: COLORS.white,
                negMods: COLORS.brightred,
                summary: COLORS.white,
                difficulty: COLORS.white,
                resultCount: COLORS.white,
                margin: {
                    good: COLORS.white,
                    bad: COLORS.brightred
                },
                outcome: {
                    best: COLORS.white,
                    good: COLORS.white,
                    bad: COLORS.orange,
                    worst: COLORS.brightred
                }
            },
            frenzy: {
                rollerName: COLORS.white,
                mainRoll: COLORS.white,
                posMods: COLORS.white,
                negMods: COLORS.brightred,
                summary: COLORS.white,
                difficulty: COLORS.white,
                resultCount: COLORS.white,
                outcome: {
                    best: COLORS.white,
                    good: COLORS.white,
                    bad: COLORS.orange,
                    worst: COLORS.brightred
                }
            },
            remorse: {
                rollerName: COLORS.white,
                mainRoll: COLORS.white,
                summary: COLORS.white,
                difficulty: COLORS.white,
                resultCount: COLORS.white,
                outcome: {
                    best: COLORS.white,
                    good: COLORS.white,
                    bad: COLORS.orange,
                    worst: COLORS.brightred
                }
            },
            rouse: {
                rollerName: COLORS.white,
                mainRoll: COLORS.white,
                outcome: {
                    best: COLORS.white,
                    good: COLORS.white,
                    bad: COLORS.brightred,
                    worst: COLORS.brightred
                }
            },
            rouse2: {
                rollerName: COLORS.white,
                mainRoll: COLORS.white,
                outcome: {
                    best: COLORS.white,
                    good: COLORS.white,
                    bad: COLORS.brightred,
                    worst: COLORS.brightred
                }
            },
            check: {
                rollerName: COLORS.white,
                mainRoll: COLORS.white,
                outcome: {
                    best: COLORS.white,
                    good: COLORS.white,
                    bad: COLORS.brightred,
                    worst: COLORS.brightred
                }
            }
        },
        CHATSTYLES = {
            fullBox: "<div style=\"display: block;width: 259px;padding: 5px 5px;margin-left: -42px;color: white;font-family: bodoni svtytwo itc tt;font-size: 16px;border: 3px outset darkred;background: url('http://imgsrv.roll20.net/?src=imgur.com/kBl8aTO.jpg') center no-repeat;position: relative;\">",
            space10: "<span style=\"display: inline-block; width: 10px;\"></span>",
            space30: "<span style=\"display: inline-block; width: 30px;\"></span>",
            space40: "<span style=\"display: inline-block; width: 40px;\"></span>",
            rollerName: "<div style=\"display: block; width: 100%; font-variant: small-caps; font-size: 16px; height: 15px; padding-bottom: 5px; border-bottom: 1px solid white; overflow: hidden;\">",
            mainRoll: "<div style=\"display: block; width: 100%; height: auto; padding: 3px 0px; border-bottom: 1px solid white;\"><span style=\"display: block; height: 16px; line-height: 16px; width: 100%; font-size: 14px; \">",
            mainRollSub: "<span style=\"display: block; height: 12px; line-height: 12px; width: 100%; margin-left: 24px; font-size: 10px; font-variant: italic;\">",
            check: "<div style=\"display: block; width: 100%; height: auto; padding: 3px 0px; border-bottom: 1px solid white;\"><span style=\"display: block; height: 20px;  line-height: 20px; width: 100%; margin-left: 10%;\">",
            summary: "<div style=\"display: block; width: 100%; padding: 3px 0px; height: auto; \"><span style=\"display: block; height: 16px; width: 100%; margin-left: 5%; line-height: 16px; font-size: 14px;\">",
            resultBlock: "<div style=\"display: block; width: 100%; height: auto; \">",
            resultCount: "<div style=\"display: inline-block; width: YYYpx; margin-top:ZZZpx; vertical-align: top; text-align: right; height: 100%; \"><span style=\"display: inline-block; font-weight: normal; font-family: Verdana; text-shadow: none; height: 24px; line-height: 24px; vertical-align: middle; width: 40px; text-align: right; margin-right: 10px; font-size: 12px;\">",
            margin: "<div style=\"display: inline-block; width: YYYpx; vertical-align: top; margin-top:ZZZpx; text-align: left; height: 100%; \"><span style=\"display: inline-block; font-weight: normal; font-family: Verdana; text-shadow: none; height: 24px; line-height: 24px; vertical-align: middle; width: 40px; text-align: left; margin-left: 10px; font-size: 12px;\">",
            outcomeRed: "<div style=\"display: block; width: 100%; height: 20px; line-height: 20px; text-align: center; font-weight: bold;\"><span style=\"color: red; display: block; width: 100%;  font-size: 22px; font-family: 'Bodoni SvtyTwo ITC TT';\">",
            outcomeRedSmall: "<div style=\"display: block; width: 100%; margin-top: 5px; height: 14px; line-height: 14px; text-align: center; font-weight: bold;\"><span style=\"color: red; display: block; width: 100%;  font-size: 14px; font-family: 'Bodoni SvtyTwo ITC TT';\">",
            outcomeOrange: "<div style=\"display: block; width: 100%; height: 20px; line-height: 20px; text-align: center; font-weight: bold;\"><span style=\"color: orange; display: block; width: 100%;  font-size: 22px; font-family: 'Bodoni SvtyTwo ITC TT';\">",
            outcomeWhite: "<div style=\"display: block; width: 100%; height: 20px; line-height: 20px; text-align: center; font-weight: bold;\"><span style=\"color: white; display: block; width: 100%;  font-size: 22px; font-family: 'Bodoni SvtyTwo ITC TT';\">",
            outcomeWhiteSmall: "<div style=\"display: block; margin-top: 5px; width: 100%; height: 14px; line-height: 14px; text-align: center; font-weight: bold;\"><span style=\"color: white; display: block; width: 100%;  font-size: 14px; font-family: 'Bodoni SvtyTwo ITC TT';\">",
            subOutcomeRed: "<div style=\"display: block; width: 100%; height: 10px; line-height: 10px; text-align: center; font-weight: bold;\"><span style=\"color: red; display: block; width: 100%;  font-size: 12px; font-family: 'Bodoni SvtyTwo ITC TT';\">",
            subOutcomeOrange: "<div style=\"display: block; width: 100%; height: 20px; line-height: 20px; text-align: center; font-weight: bold;\"><span style=\"color: orange; display: block; width: 100%;  font-size: 12px; font-family: 'Bodoni SvtyTwo ITC TT';\">",
            subOutcomeWhite: "<div style=\"display: block; width: 100%; height: 10px; line-height: 10px; text-align: center; font-weight: bold;\"><span style=\"color: white; display: block; width: 100%;  font-size: 12px; font-family: 'Bodoni SvtyTwo ITC TT';\">",
            resultDice: { // ♦◊
                colStart: "<div style=\"display: inline-block ; width: XXXpx ; height: auto; margin-bottom: 5px\">",
                lineStart: "<div style=\"display: block ; width: 100% ; height: 24px ; line-height: 20px ; text-align: center ; font-weight: bold ; text-shadow: 0px 0px 2px white , 0px 0px 2px white , 0px 0px 2px white , 0px 0px 2px white ; \">",
                lineBreak: "</div><div style=\"display: block ; width: 100% ; height: 24px ; margin-top: -10px; line-height: 20px ; text-align: center ; font-weight: bold ; text-shadow: 0px 0px 2px white , 0px 0px 2px white , 0px 0px 2px white , 0px 0px 2px white ; \">",
                BcL: "<span style=\"margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: white; display: inline-block; font-size: 18px; font-family: 'Arial';\">♦</span><span style=\"width: 10px; text-align: center; height: 20px; vertical-align: middle; color: white; display: inline-block; font-size: 16px; font-family: 'Arial'; margin-left: -5px; text-shadow: none; \">+</span>",
                BcR: "<span style=\"width: 10px; text-align: center; height: 20px; vertical-align: middle; color: white; display: inline-block; font-size: 16px; font-family: 'Arial'; margin-left: -5px; margin-right: -3px; text-shadow: none; \">+</span><span style=\"margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: white; display: inline-block; font-size: 18px; font-family: 'Arial';\">♦</span>",
                HcL: "<span style=\"margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: red; display: inline-block; font-size: 18px; font-family: 'Arial';\">♦</span><span style=\"width: 10px; text-align: center; height: 20px; vertical-align: middle; color: red; display: inline-block; font-size: 16px; font-family: 'Arial'; margin-left: -5px; text-shadow: none; \">+</span>",
                HcR: "<span style=\"width: 10px; text-align: center; height: 20px; vertical-align: middle; color: red; display: inline-block; font-size: 16px; font-family: 'Arial'; margin-left: -5px; margin-right: -3px; text-shadow: none; \">+</span><span style=\"margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: red; display: inline-block; font-size: 18px; font-family: 'Arial';\">♦</span>",
                Bc: "<span style=\"margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: white; display: inline-block; font-size: 18px; font-family: 'Arial';\">♦</span>",
                Hc: "<span style=\"margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: red; display: inline-block; font-size: 18px; font-family: 'Arial';\">♦</span>",
                Bs: "<span style=\"margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle; color: white; display: inline-block; font-size: 18px; font-family: 'Arial';\">■</span>",
                Hs: "<span style=\"margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: red; display: inline-block; font-size: 18px; font-family: 'Arial';\">■</span>",
                Bf: "<span style=\"margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: white; display: inline-block; font-size: 18px; font-family: 'Arial'; text-shadow: none;\">■</span><span style=\"margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: black; display: inline-block; margin-left: -12px; font-size: 18px; font-family: 'Arial'; margin-bottom: -4px; text-shadow: none;\">×</span>",
                Hf: "<span style=\"margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: red; display: inline-block; font-size: 18px; font-family: 'Arial'; text-shadow: none;\">■</span><span style=\"margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: black; display: inline-block; margin-left: -12px; font-size: 18px; font-family: 'Arial'; margin-bottom: -4px; text-shadow: none;\">×</span>",
                Hb: "<span style=\"margin-right: 2px; width: 10px; text-align: center; color: black; height: 24px; vertical-align: middle; display: inline-block; font-size: 18px; font-family: 'Arial'; text-shadow: 0px 0px 2px red, 0px 0px 2px red, 0px 0px 2px red, 0px 0px 2px red, 0px 0px 2px red, 0px 0px 2px red, 0px 0px 2px red, 0px 0px 2px red, 0px 0px 2px red, 0px 0px 2px red, 0px 0px 2px red, 0px 0px 2px red; line-height: 22px;\">♠</span>"
            },
            secret: {
                topLineStart: "<div style=\"display: block; width: 100%; font-size: 18px; height: 16px; padding: 3px 0px; border-bottom: 1px solid white;\">",
                traitLineStart: "<div style=\"width: 100%; height: 20px; line-height: 20px; display: block; text-align: center; color: white; font-variant: small-caps; border-bottom: 1px solid white;\">",
                diceStart: "<div style=\"display: block ; width: 100% ; margin-left: 0% ; height: auto; line-height: 20px ; text-align: center ; font-weight: bold ; text-shadow: 0px 0px 2px white , 0px 0px 2px white , 0px 0px 2px white , 0px 0px 2px white ; margin-bottom: 0px\">",
                blockStart: "<div style=\"width: 100%; display: block; text-align: center;\">",
                startBlock: "<div style=\"display: inline-block; width: 48%; margin: 0% 1%; text-align: center;\">",
                blockNameStart: "<div style=\"display: block; width: 100%; font-size: 13px; margin-bottom: -5px; margin-top: 10px;\">",
                lineStart: "<div style=\"display: block; width: 100%; font-size: 12px;\">",
                startPlayerBlock: "<div style=\"display: block; width: 280px; padding: 45px 5px; margin-left: -58px; margin-top: -22px; margin-bottom: -5px; color: white; font-family: Percolator; text-align: left; font-size: 16px; background: url('https://t4.ftcdn.net/jpg/00/78/66/11/240_F_78661103_aowhE8PWKrHRtoCUogPvkfWs22U54SuU.jpg') center no-repeat; background-size: 100% 100%; z-index: 100; position: relative;\">",
                playerTopLineStart: "<div style=\"display: block; margin-left: 28px;  width: 100%; font-size: 24px; font-family: Percolator; height: 12px; padding: 3px 0px; text-align: left;  margin-top: -16px;\">",
                playerBotLineStart: "<div style=\"width: 100%; margin-left: 48px; height: auto; line-height: 15px; display: block;  text-align: left; color: white; margin-top: 8px;\">",
                grey: "<span style=\"display:inline-block; color: #A0A0A0; font-size: 24px; font-weight: bold;\">",
                greyS: "<span style=\"display:inline-block; color: #A0A0A0; display: inline-block; line-height: 14px; font-family: Percolator; vertical-align: top; margin-right: 5px; margin-left: -5px;\">",
                white: "<span style=\"display:inline-block; color: white; font-size: 24px; font-weight: bold;\">",
                whiteB: "<span style=\"display:inline-block; color: white; font-size: 30px; font-weight: bold;\">",
                greyPlus: "<span style=\"color: #A0A0A0; font-weight: bold; display: inline-block; text-align: right; margin: 2px 5px 0px 20px; vertical-align: top; line-height: 14px;\"> + </span>",
                greyMinus: "<span style=\"color: #A0A0A0; font-weight: bold; display: inline-block; text-align: right; margin: 2px 5px 0px 20px; vertical-align: top; line-height: 14px;\"> - </span>"
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
                    _pageid: D.PAGEID(),
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

        },
        registerText = (obj, objName) => {
            STATEREF.textList = STATEREF.textList || {}
            if (obj) {
                obj.set({
                    layer: "objects",
                    name: `rollerText_${objName}`,
                    controlledby: ""
                })
                STATEREF.textList[objName] = {
                    id: obj.id,
                    top: obj.get("top"),
                    left: obj.get("left"),
                    height: obj.get("height"),
                    width: obj.get("width")
                }
                D.Alert(`Registered text box '${objName}: ${D.JS(_.values(STATEREF.textList).slice(-1))}`, "ROLLER: registerText()")

                return true
            }

            return THROW(`Invalid object: ${D.JS(obj)}`, "registerText()")
        },
        registerImg = (obj, objName, params = {}) => {
            if (VAL({ string: params })) {
                const kvpairs = params.split(","),
                    imgInfo = {
                        images: []
                    }
                _.each(kvpairs, kvp => {
                    if (kvp.includes("|")) {
                        const [k, v] = kvp.split("|")
                        imgInfo[k] = v
                    } else {
                        imgInfo.images.push(kvp)
                    }
                })
            }
            if (STATEREF.imgList[objName]) {
                const remObj = getObj("graphic", STATEREF.imgList[objName].id)
                if (remObj)
                    remObj.remove()
            }
            if (obj === null)
                return
            obj.set({
                layer: "objects",
                name: `rollerImage_${objName}`,
                controlledby: ""
            })
            STATEREF.imgList[objName] = {
                id: obj.id,
                top: obj.get("top"),
                left: obj.get("left"),
                height: obj.get("height"),
                width: obj.get("width"),
                imgsrc: params.images && params.images[0] || obj.get("imgsrc"),
                images: params.images || [obj.get("imgsrc")]
            }
            D.Alert(`Registered image '${objName}: ${D.JS(_.values(STATEREF.imgList).slice(-1))}`, "ROLLER: registerImg()")
        },
        registerShape = (obj, objName, params = {}) => {
            STATEREF.shapeList = params.isResetting ? {} : STATEREF.shapeList || {}
            if (obj === null)
                return
            obj.set({
                layer: "objects",
                name: `rollerShape_${objName}`,
                controlledby: ""
            })
            STATEREF.shapeList[objName] = {
                id: obj.id,
                type: obj.get("_type"),
                subType: params.subType || "line",
                top: obj.get("top"),
                left: obj.get("left"),
                height: obj.get("height"),
                width: obj.get("width")
            }
            D.Alert(`Registered shape '${objName}: ${D.JS(_.values(STATEREF.shapeList).slice(-1))}`, "ROLLER: registerShape()")
        }
    // #endregion

    // #region Graphic & Text Control
    const makeImg = (name, imgsrc, top, left, height, width, layer = "objects") => {
            const img = createObj("graphic", {
                _pageid: D.PAGEID(),
                imgsrc,
                top,
                left,
                width,
                height,
                layer,
                isdrawing: true,
                controlledby: ""
            })
            D.Alert(`Registering image '${name}'.`, "ROLLER: makeImg")
            registerImg(img, name)
            toFront(img)

            return img
        },
        setImg = (objName, image) => {
            const obj = getObj("graphic", STATEREF.imgList[objName].id)
            if (VAL({ graphic: obj }, "setImg")) {
                obj.set("imgsrc", IMAGES[image])
                return true
            }

            return false
        },
        clearImg = imgName => {
            if (!STATEREF.imgList[imgName])
                return THROW(`NO IMAGE REGISTERED AS ${imgName}`, "clearImg")
            const obj = getObj("graphic", STATEREF.imgList[imgName].id)
            if (VAL({ graphic: obj }, "clearImg")) {
                DragPads.DelPad(obj.id)
                obj.remove()
                STATEREF.imgList = _.omit(STATEREF.imgList, imgName)
                return true
            }

            return false
        },
        makeText = (name, font_family, font_size, top, left, color, text = "") => {
            const txt = createObj("text", {
                _pageid: D.PAGEID(),
                font_family,
                font_size,
                top,
                left,
                color,
                text,
                layer: "objects",
                controlledby: ""
            })
            D.Alert(`Registering text '${name}'.`, "ROLLER: makeText")
            registerText(txt, name)

            return txt
        },
        setText = (objName, params) => {
            if (!STATEREF.textList[objName])
                return THROW(`No text object registered with name '${D.JS(objName)}'.`, "setText()")
            const obj = getObj("text", STATEREF.textList[objName].id),
                {
                    width,
                    left,
                    top
                } = STATEREF.textList[objName]
            if (VAL({ text: obj }, "setText")) {
                params.top = top
                params.left = left
                if (params.justified && params.justified === "left") {
                    params.width = Media.GetTextWidth(obj, params.text)
                    params.left = left + params.width / 2 - width / 2
                }
                if (params.shift) {
                    if (params.shift.anchor) {
                        if (!STATEREF.textList[params.shift.anchor])
                            return THROW(`No anchored object registered with name '${D.JS(params.shift.anchor)}' in params set:<br><br>${D.JS(params)}.`, "setText()")
                        const anchorObj = getObj("text", STATEREF.textList[params.shift.anchor].id),
                            anchorWidth = parseInt(anchorObj.get("width")),
                            anchorLeft = parseInt(anchorObj.get("left"))
                        switch (params.shift.anchorSide) {
                            case "right":
                                params.left = anchorLeft +
                                    0.5 * anchorWidth +
                                    0.5 * params.width +
                                    parseInt(params.shift.amount)
                                break
                            default:
                                break
                        }
                    } else if (params.shift.imgAnchor) {
                        const imgObj = Media.GetObj(params.shift.imgAnchor)
                        if (VAL({ graphic: imgObj }))
                            switch (params.shift.anchorSide) {
                                case "right":
                                    params.left = parseInt(imgObj.get("left")) +
                                        0.5 * parseInt(imgObj.get("width")) +
                                        0.5 * params.width +
                                        parseInt(params.shift.amount)
                                    break
                                default:
                                    break
                            }
                    }
                    params.left += params.shift.left || 0
                    params.top += params.shift.top || 0
                }
                if (_.isNaN(params.left) || _.isNaN(params.top) || _.isNaN(params.width))
                    // if (!VAL({number: [params.left, params.top, params.width]}, null, true))
                    return THROW(`Bad top, left or width given for '${D.JS(objName)}': ${D.JS(params)}`, "setText()")
                obj.set(_.omit(params, ["justified", "shift"]))

                return params
            }

            return THROW(`Failure to recover object '${D.JS(objName)}': ${D.JS(STATEREF.textList)}`, "setText()")
        },
        clearText = txtName => {
            const obj = getObj("text", STATEREF.textList[txtName].id)
            if (VAL({ text: obj }, "clearText")) {
                obj.remove()
                STATEREF.textList = _.omit(STATEREF.textList, txtName)
                return true
            }

            return false
        },
        setColor = (line, type, params, level) => {
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
        reposition = (selObjs = []) => {
            // D.Alert(`Selected Objects: ${selObjs}`, "ROLLER: Reposition")
            for (const sel of selObjs) {
                const obj = getObj(sel._type, sel._id)
                _.find(_.pick(STATEREF, STATECATS[sel._type]),
                       (val, key) => _.find(val,
                                            (v, k) => {
                                                if (v.id === obj.id) {
                                                    STATEREF[key][k].left = obj.get("left")
                                                    STATEREF[key][k].top = obj.get("top")
                                                    STATEREF[key][k].height = obj.get("height")
                                                    STATEREF[key][k].width = obj.get("width")
                                                    D.Alert(`Repositioned '${obj.id}' at [${D.JS(key)}/${D.JS(k)}] to: ${D.JS(STATEREF[key][k])}`, "ROLLER: reposition()")

                                                    return true
                                                }

                                                return false
                                            }
                       )
                )
            }
        }
    // #endregion

    // #region Dice Frame
    const initFrame = () => {
            const textList = []
            let workingImg = null
            for (const name of _.keys(STATEREF.textList))
                clearText(name)
            for (const name of _.keys(STATEREF.imgList))
                clearImg(name)

            STATEREF.imgList = {}
            STATEREF.textList = {}
            DragPads.ClearAllPads("wpReroll")
            Media.Remove("wpRerollPlaceholder")
            Media.RemoveAll("rollerImage")
            DragPads.ClearAllPads("selectDie")
            for (const cat of STATECATS.dice)
                clearDice(cat)
            for (const textLine of _.keys(TEXTLINES))
                textList.push(makeText(
                    textLine,
                    TEXTLINES[textLine].font_family,
                    TEXTLINES[textLine].font_size,
                    TEXTLINES[textLine].top,
                    TEXTLINES[textLine].left,
                    TEXTLINES[textLine].color,
                    TEXTLINES[textLine].text
                ))

            Media.Register(makeImg(
                "frontFrame",
                IMAGES.frontFrame,
                POSITIONS.diceFrameFront.top(),
                POSITIONS.diceFrameFront.left(),
                POSITIONS.diceFrameFront.height(),
                POSITIONS.diceFrameFront.width()
            ), "rollerImage_frontFrame", "base", "map", true)
            for (let i = 0; i < 9; i++) {
                Media.Register(makeImg(
                    `topMid_${i}`,
                    IMAGES.topMids[i - 3 * Math.floor(i / 3)],
                    POSITIONS.diceFrameMidTop.top(),
                    POSITIONS.diceFrameMidTop.left() + i * POSITIONS.diceFrameMidTop.xShift(),
                    POSITIONS.diceFrameMidTop.height(),
                    POSITIONS.diceFrameMidTop.width()
                ), `rollerImage_topMid_${i}`, "base", "map", true)
                Media.Register(makeImg(
                    `bottomMid_${i}`,
                    IMAGES.bottomMids[i - 3 * Math.floor(i / 3)],
                    POSITIONS.diceFrameMidBottom.top(),
                    POSITIONS.diceFrameMidBottom.left() + i * POSITIONS.diceFrameMidBottom.xShift(),
                    POSITIONS.diceFrameMidBottom.height(),
                    POSITIONS.diceFrameMidBottom.width()
                ), `rollerImage_bottomMid_${i}`, "base", "map", true)
            }
            Media.Register(makeImg(
                "topEnd",
                IMAGES.topEnd,
                POSITIONS.diceFrameEndTop.top(),
                POSITIONS.diceFrameEndTop.left(),
                POSITIONS.diceFrameEndTop.height(),
                POSITIONS.diceFrameEndTop.width()
            ), "rollerImage_topEnd", "base", "map", true)
            Media.Register(makeImg(
                "bottomEnd",
                IMAGES.bottomEnd,
                POSITIONS.diceFrameEndBottom.top(),
                POSITIONS.diceFrameEndBottom.left(),
                POSITIONS.diceFrameEndBottom.height(),
                POSITIONS.diceFrameEndBottom.width()
            ), "rollerImage_bottomEnd", "base", "map", true)
            Media.Register(makeImg(
                "diffFrame",
                IMAGES.diffFrame,
                POSITIONS.diceFrameDiffFrame.top(),
                POSITIONS.diceFrameDiffFrame.left(),
                POSITIONS.diceFrameDiffFrame.height(),
                POSITIONS.diceFrameDiffFrame.width()
            ), "rollerImage_diffFrame", "base", "map", true)

        //WP REROLL BUTTON
            Media.Register(makeImg(
                "wpRerollPlaceholder",
                IMAGES.blank,
                POSITIONS.diceFrameRerollPad.top(),
                POSITIONS.diceFrameRerollPad.left(),
                POSITIONS.diceFrameRerollPad.height(),
                POSITIONS.diceFrameRerollPad.width(),
                "gmlayer"
            ), "wpRerollPlaceholder", "blank", "map", false)
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
            Media.OrderImages("map")
            textList.reverse()
            for (const txt of textList)
                if (_.isObject(txt))
                    toFront(txt)
                else
                    D.Alert("Not a text object.")

        },
        scaleFrame = (row, width) => {
            const stretchWidth = Math.max(width, 120),
                imgs = [getObj("graphic", STATEREF.imgList[`${row}End`].id)],
                blanks = [],
                dbLines = []
            let [midCount, endImg, stretchPer, left] = [0, null, 0, null]
            while (stretchWidth > 225 * (imgs.length - 1)) {
                imgs.push(getObj("graphic", STATEREF.imgList[`${row}Mid_${midCount}`].id))
                midCount++
                if (midCount >= IMAGES[`${row}Mids`].length * 3) {
                    dbLines.push(`Need ${midCount - imgs.length + 2} more mid sections for ${row}`)
                    break
                }
            }
            while (midCount < IMAGES[`${row}Mids`].length * 3) {
                blanks.push(getObj("graphic", STATEREF.imgList[`${row}Mid_${midCount}`].id))
                midCount++
            }
            stretchPer = stretchWidth / imgs.length
            dbLines.push(`${row} stretchWidth: ${stretchWidth}, imgs Length: ${imgs.length}, x225 ${imgs.length * 225}, stretch per: ${stretchPer}`)
            dbLines.push(`${row} midCount: ${midCount}, blanks length: ${blanks.length}`)
            endImg = imgs.shift()
            left = POSITIONS.diceFrameFront.left() + 120
            dbLines.push(`${row}Start at ${POSITIONS.diceFrameFront.left()}, + 120 to ${left}`)
            for (let i = 0; i < imgs.length; i++) {
                dbLines.push(`Setting ${row}Mid${i} to ${left}`)
                imgs[i].set({
                    left,
                    imgsrc: IMAGES[`${row}Mids`][i - 3 * Math.floor(i / 3)]
                })
                left += stretchPer
            }
            dbLines.push(`Setting ${row}End to ${left}`)
            endImg.set("left", left)
            for (let j = 0; j < blanks.length; j++)
                blanks[j].set("imgsrc", IMAGES.blank)

            //DB(dbLines.join("<br>"), "scaleFrame")
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
        // D.DBAlert(`Setting die ${D.JS(dieNum)} (dieVal: ${D.JS(dieVal)}, params: ${D.JS(params)})`, funcName, SCRIPTNAME)

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
        // D.DBAlert("Setting '" + D.JS(dieVal) + "' in " + D.JS(dieCat) + " to '" + D.JS(dieParams) + "'", , funcName, SCRIPTNAME)
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
            if (VAL({ string: rollEffectString, list: rollInput }, "applyRollEffects")) {
                rollInput.appliedRollEffects = rollInput.appliedRollEffects || []
                const rollEffects = _.compact(_.without(_.uniq([...rollEffectString.split("|"), ..._.keys(STATEREF.rollEffects), ...rollInput.rollEffectsToReapply || []]), ...rollInput.appliedRollEffects)),
                    [rollData, rollResults] = rollInput.rolls ? [null, rollInput] : [rollInput, null],
                    checkRestriction = (input, traits, flags, restr) => {
                    // TEST: If restriction is a clan, does character clan match?
                        if (D.IsIn(restr, C.CLANS)) {
                            if (!D.IsIn(getAttrByName(input.charID, "clan"), restr))
                                return true
                        // TEST: If restriction is "physical", "social" or "mental", does an appropriate trait match?
                        } else if (D.IsIn(restr, ["physical", "mental", "social"])) {
                            if (!_.intersection(_.map([...C.ATTRIBUTES[restr], ...C.SKILLS[restr]], v => v.toLowerCase()), _.keys(traits)).length) {
                                DB(`SKIPPING: Restriction ${D.JS(restr)} Doesn't Apply<br>... ATTRIBUTES/SKILLS MAPPED: ${D.JS(_.map([...C.ATTRIBUTES[restr], ...C.SKILLS[restr]], v => v.toLowerCase()))}<br><br>C.SKILLS[restriction] = ${D.JS(C.SKILLS[restr])}<br><br>INTERSECTION = ${D.JS(_.intersection(_.map([...C.ATTRIBUTES[restr], ...C.SKILLS[restr]], v => v.toLowerCase()), _.keys(traits)))}`, "applyRollEffects")
                                return true
                            }
                        // TEST: If none of the above, does restriction match a trait or a flag?
                        } else {
                            if (!D.IsIn(restr, [..._.keys(traits), ..._.keys(flags)]))
                                return true
                        }
                        return false
                    }
                DB(`Roll Effects: ${D.JS(rollEffects)}`, "applyRollEffects")
                for (const effectString of rollEffects) {
                // First, check if the global effect state variable holds an exclusion for this character ID AND effect isn't in rollEffectsToReapply.
                    if (STATEREF.rollEffects[effectString] && STATEREF.rollEffects[effectString].includes(rollInput.charID))
                        continue
                    let [rollRestrictions, rollMod, rollLabel, isOnceOnly] = effectString.split(";"),
                        [rollTarget, rollTraits, rollFlags] = ["", {}, {}],
                        isSkipping = false;
                    [rollMod, rollTarget] = _.map(rollMod.split(":"), v => parseInt(v) || v.toLowerCase())
                    rollRestrictions = _.map(rollRestrictions.split("/"), v => v.toLowerCase())
                    rollTraits = _.object(
                        _.map(_.keys(rollInput.traitData), v => v.toLowerCase()),
                        _.map(_.values(rollInput.traitData), v => parseInt(v.value) || 0)
                    )
                    rollFlags = _.object(
                        _.map([...rollInput.posFlagLines, ...rollInput.negFlagLines, ...rollInput.redFlagLines, ...rollInput.goldFlagLines], v => v[1].toLowerCase().replace(/\s*?\(●*?\)/gu, "")),
                        _.map([...rollInput.posFlagLines, ...rollInput.negFlagLines, ...rollInput.redFlagLines, ...rollInput.goldFlagLines], v => v[0])
                    )
                    DB(`Roll Traits: ${D.JS(rollTraits)}<br>Roll Flags: ${D.JSH(rollFlags)}`, "applyRollEffects")

                // THRESHOLD TEST OF ROLLTARGET: IF TARGET SPECIFIED BUT DOES NOT EXIST, SKIP PROCESSING THIS ROLL EFFECT.
                    if (VAL({ string: rollTarget }) && !D.IsIn(rollTarget, _.keys(rollTraits)) && !D.IsIn(rollTarget, _.keys(rollFlags)))
                        continue

                // THRESHOLD TESTS OF RESTRICTION: IF ANY FAIL, SKIP PROCESSING THIS ROLL EFFECT.
                    for (const restriction of rollRestrictions) {
                        if (isSkipping) break
                    // TEST: Is rollInput the appropriate kind for this effect?
                        if (D.IsIn(restriction, ["success", "failure", "basicfail", "critical", "basiccrit", "messycrit", "bestialfail", "totalfail"]) ||
                        D.IsIn(rollMod, ["nowpreroll", "doublewpreroll", "freewpreroll", "bestialcancel", "totalfailure"])) {
                            DB(`Detected RollResult Keyword: ${D.JS(restriction)}<br>... RollMod: ${D.JS(rollMod)}`, "applyRollEffects")
                            if (rollData) {
                                isSkipping = true
                            } else {
                            // TEST: If rollResults and rollInput specifies a result restriction, check if it applies.
                                let effectiveMargin = rollResults.total - (rollResults.diff || 0)
                                switch (restriction) {
                                    case "success":
                                        if (effectiveMargin <= 0)
                                            isSkipping = true
                                        break
                                    case "failure":
                                        if (effectiveMargin > 0)
                                            isSkipping = true
                                        break
                                    case "basicfail":
                                        if (effectiveMargin > 0 || rollResults.H.botches > 0 || rollResults.B.succs + rollResults.H.succs === 0)
                                            isSkipping = true
                                        break
                                    case "critical":
                                        if (effectiveMargin <= 0 || rollResults.critPairs.bb + rollResults.critPairs.hb + rollRestrictions.critPairs.hh === 0)
                                            isSkipping = true
                                        break
                                    case "basiccrit":
                                        if (effectiveMargin <= 0 || rollResults.critPairs.bb === 0 || rollResults.critPairs.hh + rollResults.critPairs.hb > 0)
                                            isSkipping = true
                                        break
                                    case "messycrit":
                                        DB(`Effective Margin: ${effectiveMargin}<br>... CritPairs: ${D.JS(rollResults.critPairs)} (${D.JS(rollResults.critPairs.hh + rollResults.critPairs.hb)})`, "applyRollEffects")
                                        if (effectiveMargin <= 0 || rollResults.critPairs.hh + rollResults.critPairs.hb === 0)
                                            isSkipping = true
                                        break
                                    case "bestialfail":
                                        if (effectiveMargin > 0 || rollResults.H.botches === 0)
                                            isSkipping = true
                                        break
                                    case "totalfail":
                                        if (rollResults.B.succs + rollResults.H.succs > 0)
                                            isSkipping = true
                                        break
                                    default:
                                    // If the restriction isn't any of the above, have to do the standard check to see if it applies.
                                        if (checkRestriction(rollResults, rollTraits, rollFlags, restriction))
                                            isSkipping = true
                                        break
                                }
                            // TEST: Also check the rollMod to see whether you're applying certain effects.
                                switch (rollMod) {
                                    case "doublewpreroll": case "freewpreroll":
                                        if (_.any(rollEffects, v => v.includes("nowpreroll")))
                                            isSkipping = true
                                // no default
                                }
                            }
                        } else {
                            if (rollResults)
                                isSkipping = true
                            else if (checkRestriction(rollData, rollTraits, rollFlags, restriction))
                                isSkipping = true
                        }
                    }
                    if (isSkipping) continue

                // THRESHOLD TESTS PASSED.  CHECK FOR 'ISONCEONLY' AND FIRE IT ACCORDINGLY
                // If "isOnceOnly" set, add an exclusion to the global state variable OR remove this effect from the character-specific attribute.
                    if (isOnceOnly === "true")
                        if (STATEREF.rollEffects[effectString])
                            STATEREF.rollEffects[effectString] = _.union(STATEREF.rollEffects[effectString], [rollInput.charID])
                        else
                            setAttrs(rollInput.charID, { rolleffects: _.compact(getAttrByName(rollInput.charID, "rolleffects").replace(effectString, "").replace(/\|\|/gu, "|").split("|")).join("|") })
                // FIRST ROLLMOD PASS: CONVERT TO NUMBER.
                // Check whether parsing RollData or RollResults
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

                        if (VAL({ number: rollMod }, "applyRollEffects")) {
                        // Adjust dice pool by rollMod (negative totals are okay; displayRoll deals with the one-die minimum)
                            rollData.dicePool += rollMod
                            if (rollData.basePool + rollMod < 0) {
                                rollData.hungerPool += rollData.basePool + rollMod
                                rollData.basePool = 0
                            } else {
                                rollData.basePool += rollMod
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
                        // FINISHED!  ADD EFFECT TO APPLIED ROLL EFFECTS.
                        rollData.appliedRollEffects = _.union(rollData.appliedRollEffects, [effectString])
                    } else if (VAL({ list: rollResults }, "applyRollEffects")) {
                    // RollResults rollMods all contain discrete flags/strings, plus digits; can wipe digits for static flag:
                        DB(`Roll Results applies!  Testing rollMod replace switch: ${rollMod.replace(/\d/gu, "")}`, "applyRollEffects")
                        switch (rollMod.replace(/\d/gu, "")) {
                            case "freewpreroll":
                                if (rollResults.isNoWPReroll)
                                    break
                                rollResults.wpCostAfterReroll = VAL({ number: rollResults.wpCost }) ? rollResults.wpCost : 1
                                rollResults.wpCost = 0
                                DB(`Setting Roll Results Costs:<br>... After Reroll: ${rollResults.wpCostAfterReroll}<br>... WP Cost: ${rollResults.wpCost}`, "applyRollEffects")
                                break
                            case "nowpreroll":
                                rollResults.isNoWPReroll = true
                                rollResults.wpCostAfterReroll = rollResults.wpCostAfterReroll || rollResults.wpCost
                                DB(`Setting Roll Results Costs:<br>... After Reroll: ${rollResults.wpCostAfterReroll}<br>... WP Cost: ${rollResults.wpCost}`, "applyRollEffects")
                                break
                            case "doublewpreroll":
                                if (rollResults.isNoWPReroll)
                                    break
                                if (VAL({ number: rollResults.wpCostAfterReroll }))
                                    rollResults.wpCostAfterReroll = 2
                                else
                                    rollResults.wpCost = 2
                                DB(`Setting Roll Results Costs:<br>... After Reroll: ${rollResults.wpCostAfterReroll}<br>... WP Cost: ${rollResults.wpCost}`, "applyRollEffects")
                                break
                            case "bestialcancel":
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
                            default: break
                        }
                        if (rollResults.diff && rollResults.diff !== 0)
                            rollResults.margin = rollResults.total - rollResults.diff

                        DB(`INTERIM Roll Results: ${D.JS(rollResults)}`, "applyRollEffects")

                        // Roll flags are PRE-PARSED for rollResults (they get parsed in between rollData and rollResults creation, in other functions)
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

                        // FINISHED!  ADD EFFECT TO APPLIED ROLL EFFECTS.
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

            /* D.Log(D.JS(getAttrByName(charObj.id, "incap")), "INCAPACITATION");
                   D.Log("PARAMS: " + D.JS(params), "PARAMS");
                   D.Log("PARAMS DATA: " + D.JS(params.args), "PARAMS DATA");
                   Return;
                   D.Log(D.JS(params.args[4]), "PARAMS DATA 4"); */
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
                        D.SendToPlayer(D.GetPlayerID(charObj), `Error determining NAME of trait '${D.JS(trt)}'.`, "ERROR: Dice Roller")
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
                D.SendToPlayer(D.GetPlayerID(D.GetChar(rollData.charID)), "You have no dice to roll!", "ERROR: Dice Roller")

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
			   D.SendToPlayer(D.GetPlayerID(charObj),
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
                isNPCRoll: isNPCRoll
            }

            if (rollData.rerollAmt)
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
                        text: "",
                        justified: "left"
                    },
                    rollerNameShadow: {
                        text: "",
                        justified: "left"
                    },
                    mainRoll: {
                        text: "",
                        justified: "left",
                        shift: {
                            top: 20
                        }
                    },
                    mainRollShadow: {
                        text: "",
                        justified: "left",
                        shift: {
                            top: 20
                        }
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
                    if (posFlagLines.length) {
                        rollLines.posMods = {
                            text: `+ ${posFlagLines.join(" + ")}          `,
                            justified: "left"
                        }
                        rollLines.mainRoll.shift.top = 0
                        rollLines.mainRollShadow.shift.top = 0
                    } else {
                        rollLines.posMods = {
                            text: "  ",
                            justified: "left"
                        }
                    }
                    if (negFlagLines.length) {
                        rollLines.negMods = {
                            text: `- ${negFlagLines.join(" - ")}`,
                            justified: "left",
                            shift: {
                                anchor: "posMods",
                                anchorSide: "right",
                                amount: 20
                            }
                        }
                        rollLines.mainRoll.shift.top = 0
                        rollLines.mainRollShadow.shift.top = 0
                    }
                    if (redFlagLines.length)
                        rollLines.redMods = {
                            text: redFlagLines.join(" "),
                            justified: "left",
                            shift: {
                                imgAnchor: "rollerImage_topEnd_1",
                                anchorSide: "right",
                                amount: 20
                            }
                        }
                    if (goldFlagLines.length)
                        rollLines.goldMods = {
                            text: goldFlagLines.join(" "),
                            justified: "left",
                            shift: {
                                imgAnchor: "rollerImage_topEnd_1",
                                anchorSide: "right",
                                amount: 20
                            }
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
                    rollLines.summary = {
                        text: ""
                    }
                    rollLines.summaryShadow = {
                        text: ""
                    }
                    rollLines.resultCount = {
                        text: ""
                    }
                    rollLines.resultCountShadow = {
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
                setImg("diffFrame", "blank")

            _.each(_.keys(rollLines), line => {
                if (_.isString(COLORSCHEMES[rollData.type][line]))
                    rollLines[line] = setColor(line, rollData.type, rollLines[line])
            })

            blankLines = _.keys(_.omit(STATEREF.textList, _.keys(rollLines)))

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
                        rollLines.rollerNameShadow.text = rollLines.rollerName.text
                        rollLines.mainRollShadow.text = rollLines.mainRoll.text
                        break
                    case "summary":
                        rollLines.summary.text = JSON.stringify(rollData.dicePool)
                        rollLines.summaryShadow.text = rollLines.summary.text
                        break
                    case "difficulty":
                        if (!rollResults.isNPCRoll) {
                            if (rollData.diff === 0 && rollData.diffMod === 0) {
                                // D.Alert("Difficulty Is BLANK!")
                                rollLines.difficulty.text = " "
                                setImg("diffFrame", "blank")
                                break
                            }
                            // D.Alert(`Setting Difficulty to ${rollData.diff}`)
                            setImg("diffFrame", "diffFrame")
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
                        rollLines.resultCountShadow.text = rollLines.resultCount.text
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
                                } else if (rollResults.critPairs.bb > 0) {
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
                                deltaAttrs.stains = 0
                                if (rollResults.total === 0) {
                                    rollLines.outcome.text = "YOUR HUMANITY FADES..."
                                    logLines.outcome = `${CHATSTYLES.outcomeRed}DEGENERATION</span></div>`
                                    deltaAttrs.humanity = parseInt(getAttrByName(rollData.charID, "humanity") || 1) - 1
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
                                    deltaAttrs.hunger = parseInt(getAttrByName(rollData.charID, "hunger")) + 1
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
                    const params = setText(name, args)
                    txtWidths[name] = params.width
                })
                spread = txtWidths.posMods || 0 + txtWidths.negMods || 0
                spread += txtWidths.posMods && txtWidths.negMods ? 100 : 0
                spread = Math.max(spread, txtWidths.mainRoll)
                scaleFrame("top", spread)

                D.RunFX("bloodBolt", POSITIONS.bloodBoltFX)
            }
            if (_.values(deltaAttrs).length) {
                DB(`CHANGING ATTRIBUTES:
				
					${D.JS(deltaAttrs)}`, "displayRoll")
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
            rollResults = rollDice({
                type: "trait",
                rerollAmt: parseInt(deltaDice) > 0 ? parseInt(deltaDice) : 0,
                diff: rollData.diff
            }, rollResults.diceVals, isNPCRoll)
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
                replace(/color: black; height: 24px/gu, "color: black; height: 18px").
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
        Reroll: wpReroll
    }
})()

on("ready", () => {
    Roller.RegisterEventHandlers()
    Roller.CheckInstall()
    D.Log("Roller Ready!")
})
void MarkStop("Roller")