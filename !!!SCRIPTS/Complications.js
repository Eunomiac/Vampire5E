void MarkStart("Complications")
const Complications = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Complications",
        CHATCOMMAND = "!comp",
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
                if (msg.type === "api" && (!GMONLY || playerIsGM(msg.playerid) || msg.playerid === "API") && (!CHATCOMMAND || args.shift() === CHATCOMMAND)) {
                    const who = msg.who || "API",
                        call = args.shift()
                    handleInput(msg, who, call, args)
                }
            })
            on("add:graphic", handleAdd)
        }
    // #endregion

    // #region LOCAL INITIALIZATION
    const initialize = () => {
        STATEREF.deckID = STATEREF.deckID || ""
        STATEREF.targetVal = STATEREF.targetVal || 0
        STATEREF.currentVal = STATEREF.currentVal || 0
        STATEREF.remainingVal = STATEREF.remainingVal || 0
        STATEREF.cardsDrawn = STATEREF.cardsDrawn || []
        STATEREF.isRunning = STATEREF.isRunning || false

        delete STATEREF.zeroes

        

        

        //STATEREF.cardsDrawn = []
        //STATEREF.isRunning = false
    }
    // #endregion

    // #region EVENT HANDLERS: (HANDLEINPUT)
    const handleInput = (msg, who, call, args) => {
            switch (call) {
                case "target": case "add":
                    setCompVals(call, parseInt(args.shift() || 0))
                    break
                case "start":
                    startComplication(parseInt(args.shift() || 0))
                    break
                case "end": case "stop":
                    endComplication(args.shift() === "true")
                    break
            /* falls through */
                case "reset":
                    resetComplication()
                    break
                case "draw":
                    setCardValue(parseInt(args.shift()) || 0)
                    break
                case "discard": {
                    switch ((args[0] || "").toLowerCase()) {
                        case "1": case "2": case "3": case "4": case "5": case "6": case "7": case "8": case "9": case "10":
                            discardCard((parseInt(args.shift()) || 1) - 1)
                            break
                        case "last":
                            discardCard("last")
                            break
                        default:
                            promptST("discard")
                            break
                    }
                    break
                }
                case "enhance": {
                    switch ((args[0] || "").toLowerCase()) {
                        case "1": case "2": case "3": case "4": case "5": case "6": case "7": case "8": case "9": case "10":
                            enhanceCard((parseInt(args.shift()) || 1) - 1)
                            break
                        case "last":
                            enhanceCard("last")
                            break
                        default:
                            promptST("enhance")
                            break
                    }
                    break
                }
                case "zero": case "devalue": case "revalue":
                    switch ((args[0] || "").toLowerCase()) {
                        case "1": case "2": case "3": case "4": case "5": case "6": case "7": case "8": case "9": case "10":
                        case "last":
                            if (args.length > 1)
                                revalueCard(args[0] === "last" && "last" || (parseInt(args[0]) || 1) - 1, parseInt(args[1]) || 0)
                            else
                                promptST("setrevalue", args.shift())
                            break
                        default:
                            promptST("getrevalue")
                            break
                    }
                    break
                case "launchproject":
                    Char.LaunchProject(STATEREF.currentVal - STATEREF.targetVal, "COMPLICATION")
                    break
            // no default
            }
        },
        handleAdd = obj => {
            if (STATEREF.isRunning)
                drawCard(obj)
        }
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    // #region CONFIGURATION: Card Definitions (based on img src)
    const CARDS = {
        advantage: {
            "": { name: "GuiltByAssociation", imgsrc: "", value: 1, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} }
        },
        attention: {
            "": { name: "FanTheFlames", imgsrc: "", value: 3, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "Friction", imgsrc: "", value: 1, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "IrresistibleOpportunity", imgsrc: "", value: 2, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "LooseLips", imgsrc: "", value: 1, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "TangledWebs", imgsrc: "", value: 1, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} }
        },
        beast: {
            "": { name: "BloodRush", imgsrc: "", value: 2, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "TheBeast...", imgsrc: "", value: 1, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "TheBeastAscendant", imgsrc: "", value: 2, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "TheBeastRampant", imgsrc: "", value: 2, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "TheBeastRavenous", imgsrc: "", value: 2, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "TheBeastScorned", imgsrc: "", value: 2, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} }
        },
        benefit: {
            "": { name: "AMomentOfInsight", imgsrc: "", value: 1, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "AMomentOfInspiration", imgsrc: "", value: 1, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "Breakthrough", imgsrc: "", value: 1, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "Espionage", imgsrc: "", value: 1, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} }
        },
        blood: {
            "": { name: "FieldWork", imgsrc: "", value: 1, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "Micromanagement", imgsrc: "", value: 2, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} }
        },
        complication: {
            "": { name: "Powderkeg", imgsrc: "", value: 0, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "RippleEffects", imgsrc: "", value: 1, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "TunnelVision", imgsrc: "", value: 1, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} }
        },
        debilitation: {
            "": { name: "CognitiveDissonance", imgsrc: "", value: 3, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "Exhausted", imgsrc: "", value: 2, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "MentalBlock", imgsrc: "", value: 3, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "Obsessed", imgsrc: "", value: 2, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "Overwhelmed", imgsrc: "", value: 2, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "Preoccupied", imgsrc: "", value: 1, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "SpreadThin", imgsrc: "", value: 1, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "Tilted", imgsrc: "", value: 1, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "WeightOfTheWorld", imgsrc: "", value: 2, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} }
        },
        humanity: {
            "": { name: "CollateralDamage", imgsrc: "", value: 2, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "Ennui", imgsrc: "", value: 3, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "ImmortalClay", imgsrc: "", value: 2, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} }
        },
        prestation: {
            "": { name: "Favors", imgsrc: "", value: 1, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} }
        },
        project: {
            "": { name: "AtCrossPurposes", imgsrc: "", value: 1, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "CrisisManagement", imgsrc: "", value: 2, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "FalseLead", imgsrc: "", value: 1, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "FlawedExecution", imgsrc: "", value: 4, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} }
        },
        none: {
            "": { name: "AMatterOfPride", imgsrc: "", value: 1, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "AMomentOfDespair", imgsrc: "", value: 1, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "AlternativeFacts", imgsrc: "", value: 2, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "Betrayal", imgsrc: "", value: -1, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "Cathexis", imgsrc: "", value: -1, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "CostlyBlunder", imgsrc: "", value: 1, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "Faith", imgsrc: "", value: 0, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "InABind", imgsrc: "", value: 1, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "InTheRed", imgsrc: "", value: 1, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "Options", imgsrc: "", value: 0, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "ProlongedAbsence", imgsrc: "", value: 1, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "RepeatMistakes", imgsrc: "", value: 0, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "Reverie", imgsrc: "", value: 0, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "RockyStart", imgsrc: "", value: -1, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "SilentBeneficiary", imgsrc: "", value: 1, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "SimmeringResentment", imgsrc: "", value: -1, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "Triage", imgsrc: "", value: -1, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "UnderTheBus", imgsrc: "", value: 1, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} },
            "": { name: "UnfinishedBusiness", imgsrc: "", value: 0, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {} }
        }

    }

    // #endregion
    // #region SETTERS: Setting card values, target numbers, activating Complication system
    const setCompVals = (mode, value) => {
            switch (mode) {
                case "target": {
                    STATEREF.targetVal = value
                    Media.SetText("complicationTarget", `${STATEREF.targetVal}`)
                    break
                }
                case "current": {
                    STATEREF.currentVal = 0
                } /* falls through */
                case "add": case "addVal": case "addValue": {
                    STATEREF.currentVal += value
                    Media.SetText("complicationCurrent", `${STATEREF.currentVal}`)
                    break
                }
                // no default
            }
            STATEREF.remainingVal = STATEREF.targetVal - STATEREF.currentVal
            Media.SetText("complicationRemaining", `${STATEREF.remainingVal <= 0 ? "+" : "-"}${Math.abs(STATEREF.remainingVal)}`)
            if (STATEREF.remainingVal <= 0) {
                Media.SetText("complicationCurrent", { color: C.COLORS.green})
                Media.SetText("complicationRemaining", { color: C.COLORS.green})
            } else {
                Media.SetText("complicationCurrent", { color: C.COLORS.brightred})
                Media.SetText("complicationRemaining", { color: C.COLORS.brightred})
            }
        },
        resetComplication = () => {
            for (const cardData of STATEREF.cardsDrawn)
                Media.Remove(cardData.id)
            STATEREF.cardsDrawn = []
            STATEREF.cardsDiscarded = []
            setCompVals("current", 0)
            setCompVals("target", 0)
            for (let i = 0; i < 10; i++) {
                Media.Set(`complicationZero_${i+1}`, "zero")
                Media.Toggle(`complicationZero_${i+1}`, false)
                Media.Toggle(`complicationEnhanced_${i+1}`, false)
            }
        },
        startComplication = startVal => {            
            STATEREF.isRunning = true
            Media.Toggle("ComplicationMat", true)
            for (const textRef of ["complicationTarget", "complicationCurrent", "complicationRemaining"])
                Media.ToggleText(textRef, true)
            getObj("deck", STATEREF.deckID).set("shown", true)
            setCompVals("current", 0)
            setCompVals("target", startVal)
        },
        endComplication = (isLaunchingProject) => {
            STATEREF.isRunning = false             
            resetComplication()
            Media.Toggle("ComplicationMat", false)
            for (const textRef of ["complicationTarget", "complicationCurrent", "complicationRemaining"])
                Media.ToggleText(textRef, false)
            for (let i = 0; i < 10; i++)
                Media.Toggle(`complicationZero_${i+1}`, false)
            getObj("deck", STATEREF.deckID).set("shown", false)
            if (isLaunchingProject)
                Char.LaunchProject(STATEREF.currentVal - STATEREF.targetVal, "COMPLICATION")   
        },
        promptST = (mode, paramString = "") => {
            let chatString = `/w Storyteller <br/><div style='
                display: block;
                background: url(https://i.imgur.com/kBl8aTO.jpg);
                text-align: center;
                border: 4px ${C.COLORS.crimson} outset;
                box-sizing: border-box;
                margin-left: -42px;
                width: 275px;
            '><br/><span style='
                display: block;
                font-size: 25px;
                text-align: center;
                width: 100%;
                font-family: Voltaire;
                color: ${C.COLORS.brightred};
                font-weight: bold;
            '>`
            switch(mode) {
                case "setvalue":
                    chatString += `Set Card Value:</span><br><span style='                    
                        display: block;
                        font-size: 16px;
                        text-align: center;
                        width: 100%
                    '>[0](!comp draw 0) [1](!comp draw 1) [2](!comp draw 2) [3](!comp draw 3) [4](!comp draw 4)</span><br/><span style='
                        display: block;
                        font-size: 16px;
                        text-align: center;
                        width: 100%
                    '>[Discard Last](!comp discard last)[Discard](!comp discard)<br>[Revalue Last](!comp revalue last)[Revalue](!comp revalue)<br>[Enhance Last](!comp enhance last)[Enhance](!comp enhance)`
                    break
                case "discard":
                    chatString += `Discard Which Card:</span><br><span style='                    
                    display: block;
                    font-size: 16px;
                    text-align: center;
                    width: 100%
                '>[1](!comp discard 1) [2](!comp discard 2) [3](!comp discard 3) [4](!comp discard 4) [5](!comp discard 5)</span><br/><span style='
                    display: block;
                    font-size: 16px;
                    text-align: center;
                    width: 100%
                '>[6](!comp discard 6) [7](!comp discard 7) [8](!comp discard 8) [9](!comp discard 9) [10](!comp discard 10)`
                    break
                case "getrevalue":
                    chatString += `Revalue Which Card:</span><br><span style='                    
                        display: block;
                        font-size: 16px;
                        text-align: center;
                        width: 100%
                    '>[1](!comp revalue 1) [2](!comp revalue 2) [3](!comp revalue 3) [4](!comp revalue 4) [5](!comp revalue 5)</span><br/><span style='
                        display: block;
                        font-size: 16px;
                        text-align: center;
                        width: 100%
                    '>[6](!comp revalue 6) [7](!comp revalue 7) [8](!comp revalue 8) [9](!comp revalue 9) [10](!comp revalue 10)`
                    break
                case "setrevalue":
                    chatString += `Set Card Value:</span><br><span style='                    
                    display: block;
                    font-size: 16px;
                    text-align: center;
                    width: 100%
                '>[0](!comp revalue${paramString === "" ? "" : ` ${paramString}`} 0) [1](!comp revalue${paramString === "" ? "" : ` ${paramString}`} 1) [2](!comp revalue${paramString === "" ? "" : ` ${paramString}`} 2) [3](!comp revalue${paramString === "" ? "" : ` ${paramString}`} 3) [4](!comp revalue${paramString === "" ? "" : ` ${paramString}`} 4)`
                    break
                case "enhance":
                    chatString += `Enhance Which Card:</span><br><span style='                    
                        display: block;
                        font-size: 16px;
                        text-align: center;
                        width: 100%
                    '>[1](!comp enhance 1) [2](!comp enhance 2) [3](!comp enhance 3) [4](!comp enhance 4) [5](!comp enhance 5)</span><br/><span style='
                        display: block;
                        font-size: 16px;
                        text-align: center;
                        width: 100%
                    '>[6](!comp enhance 6) [7](!comp enhance 7) [8](!comp enhance 8) [9](!comp enhance 9) [10](!comp enhance 10)`
                    break
                // no default
            }
            chatString += "</span><br/></div>"
            sendChat("COMPLICATION", D.JSH(chatString))
        },
        drawCard = obj => {
            if (!Media.IsRegistered(obj)) {
                STATEREF.cardsDrawn.push({ id: obj.id, value: 0 })
                Media.SetArea(obj.id, `ComplicationDraw${STATEREF.cardsDrawn.length}`)
                promptST("setvalue")
            }
        },
        setCardValue = (value = 0) => {
            const imgObj = getObj("graphic", STATEREF.cardsDrawn[STATEREF.cardsDrawn.length - 1].id)
            if (!imgObj) {
                D.Alert("No image object found in STATEREF.cardsDrawn.", "COMPLICATIONS: !comp draw")
            } else {
                STATEREF.cardsDrawn[STATEREF.cardsDrawn.length - 1].value = value
                setCompVals("add", value)
            }
        },
        enhanceCard = (index = 0) => {          
            const i = index === "last" ? STATEREF.cardsDrawn.length - 1 : index
            Media.Toggle(`complicationEnhanced_${i + 1}`, true)
            toFront(Media.GetObj(`complicationEnhanced_${i + 1}`))
            STATEREF.cardsDrawn[i].isEnhanced = true
        },
        discardCard = (index = 0) => {            
            const i = index === "last" ? STATEREF.cardsDrawn.length - 1 : index
            if (i >= STATEREF.cardsDrawn.length)
                return THROW(`Index of ${D.JS(i)} exceeds number of cards drawn: ${D.JS(STATEREF.cardsDrawn, true)}`)
            const imgObj = getObj("graphic", STATEREF.cardsDrawn[i].id),
                cardVal = STATEREF.cardsDrawn[i].value
            setCompVals("add", -1 * cardVal)
            STATEREF.cardsDrawn = _.reject(STATEREF.cardsDrawn, v => v.id === imgObj.id)
            Media.Remove(imgObj.id)
            for (let i = 0; i < STATEREF.cardsDrawn.length; i++) {
                Media.SetArea(STATEREF.cardsDrawn[i].id, `ComplicationDraw${i + 1}`)
                if (STATEREF.cardsDrawn[i].isZeroed) {
                    Media.Toggle(`complicationZero_${i+1}`, true)
                    toFront(Media.GetObj(`complicationZero_${i+1}`))
                } else {
                    Media.Toggle(`complicationZero_${i+1}`, false)
                }
                if (STATEREF.cardsDrawn[i].isEnhanced) {
                    Media.Toggle(`complicationEnhanced_${i+1}`, true)
                    toFront(Media.GetObj(`complicationEnhanced_${i+1}`))
                } else {                    
                    Media.Toggle(`complicationEnhanced_${i+1}`, false)
                }
            }
            const endIndex = STATEREF.cardsDrawn.length
            Media.Toggle(`complicationZero_${endIndex + 1}`, false)
            Media.Toggle(`complicationEnhanced_${endIndex + 1}`, false)
            return true
        },
        revalueCard = (index = 0, value = 0) => {             
            const i = index === "last" ? STATEREF.cardsDrawn.length - 1 : index
            const cardVal = STATEREF.cardsDrawn[i].value
            setCompVals("add", value - cardVal)
            if (value === 0)
                Media.Toggle(`complicationZero_${i + 1}`, true)
            else
                Media.Toggle(`complicationZero_${i + 1}`, false)
            //Media.Set(`complicationZero_${index + 1}`, value)
            toFront(Media.GetObj(`complicationZero_${i + 1}`))
            toFront(Media.GetObj(`complicationEnhanced_${i + 1}`))
            STATEREF.cardsDrawn[i].value = value
            STATEREF.cardsDrawn[i].isZeroed = value === 0
        }
    

    // #endregion

    return {
        RegisterEventHandlers: regHandlers,
        CheckInstall: checkInstall
    }
})()

on("ready", () => {
    Complications.RegisterEventHandlers()
    Complications.CheckInstall()
    D.Log("Complications Ready!")
})
void MarkStop("Complications")