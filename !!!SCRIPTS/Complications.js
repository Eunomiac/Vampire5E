void MarkStart("Complications")
const Complications = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Complications",

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
            STATE.REF.deckID = STATE.REF.deckID || ""
            STATE.REF.targetVal = STATE.REF.targetVal || 0
            STATE.REF.currentVal = STATE.REF.currentVal || 0
            STATE.REF.remainingVal = STATE.REF.remainingVal || 0
            STATE.REF.cardsDrawn = STATE.REF.cardsDrawn || []
            STATE.REF.isRunning = STATE.REF.isRunning || false
            STATE.REF.lastDraw = STATE.REF.lastDraw || -1
            STATE.REF.endMessageQueue = STATE.REF.endMessageQueue || []

            STATE.REF.DECK = STATE.REF.DECK || []
            STATE.REF.MAT = STATE.REF.MAT || [
                {imgsrc: null, isFaceUp: false, value: 0, isNegated: false, isDuplicated: false, isEnhanced: false},
                {imgsrc: null, isFaceUp: false, value: 0, isNegated: false, isDuplicated: false, isEnhanced: false},
                {imgsrc: null, isFaceUp: false, value: 0, isNegated: false, isDuplicated: false, isEnhanced: false},
                {imgsrc: null, isFaceUp: false, value: 0, isNegated: false, isDuplicated: false, isEnhanced: false},
                {imgsrc: null, isFaceUp: false, value: 0, isNegated: false, isDuplicated: false, isEnhanced: false},
                {imgsrc: null, isFaceUp: false, value: 0, isNegated: false, isDuplicated: false, isEnhanced: false},
                {imgsrc: null, isFaceUp: false, value: 0, isNegated: false, isDuplicated: false, isEnhanced: false},
                {imgsrc: null, isFaceUp: false, value: 0, isNegated: false, isDuplicated: false, isEnhanced: false},
                {imgsrc: null, isFaceUp: false, value: 0, isNegated: false, isDuplicated: false, isEnhanced: false},
                {imgsrc: null, isFaceUp: false, value: 0, isNegated: false, isDuplicated: false, isEnhanced: false}
            ]
            STATE.REF.DISCARDS = STATE.REF.DISCARDS || []
            STATE.REF.FXQUEUE = STATE.REF.FXQUEUE || []
        },
    // #endregion

    // #region EVENT HANDLERS: (HANDLEINPUT)
        onChatCall = (call, args, objects, msg) => { // eslint-disable-line no-unused-vars
            const charObjs = Listener.GetObjects(objects, "character")
            switch (call) {
                case "target": {
                    setCompVals(call, D.Int(args.shift()))
                    break
                }
                case "start": {
                    STATE.REF.charRef = ((charObjs || [{id: null}])[0] || {id: null}).id
                    startComplication(D.Int(args.shift()))
                    break
                }
                case "stop": case "end":
                    endComplication(args.shift() === "true")
                    STATE.REF.charRef = null
                    break
                case "reset":
                    resetComplication(true)
                    break
                case "discard": {
                    switch (D.LCase(call = args.shift())) {
                        case "rand": {
                            discardCard(getRandomSpot(["faceUp", "noLastDrawn"]))
                            break
                        }
                        case "last": {
                            discardCard(STATE.REF.lastDraw)
                            break
                        }
                        default: {
                            discardCard(D.Int(call) - 1)
                            break
                        }
                    }                        
                    break
                }
                case "enhance": {
                    switch (D.LCase(call = args.shift())) {
                        case "rand": {
                            enhanceCard(getRandomSpot(["faceUp", "noNegated", "noEnhanced", "noLastDrawn"]))
                            break
                        }
                        case "last": {
                            enhanceCard(STATE.REF.lastDraw)
                            break
                        }
                        default: {
                            enhanceCard(D.Int(call) - 1)
                            break
                        }
                    }                        
                    break
                }
                case "negate": {
                    switch (D.LCase(call = args.shift())) {
                        case "rand": {
                            negateCard(getRandomSpot(["faceUp", "noEnhanced", "noNegated", "noLastDrawn"]))
                            break
                        }
                        case "last": {
                            negateCard(STATE.REF.lastDraw)
                            break
                        }
                        default: {
                            negateCard(D.Int(call) - 1)
                            break
                        }
                    }                        
                    break
                }
                case "duplicate": {
                    switch (D.LCase(call = args.shift())) {
                        case "rand": {
                            dupeCard(getRandomSpot(["faceUp", "noNegated", "noDuplicated", "noLastDrawn"]))
                            break
                        }
                        case "last": {
                            dupeCard(STATE.REF.lastDraw)
                            break
                        }
                        default: {
                            dupeCard(D.Int(call) - 1)
                            break
                        }
                    }                        
                    break
                }
                case "revalue": {
                    switch (D.LCase(call = args.shift())) {
                        case "rand": {
                            promptCardVal(getRandomSpot(["faceUp", "noLastDrawn"]))
                            break
                        }
                        case "last": {
                            promptCardVal(STATE.REF.lastDraw)
                            break
                        }
                        default: {
                            promptCardVal(D.Int(call) - 1)
                            break
                        }
                    }                        
                    break
                }
                case "setvalue": {
                    revalueCard(D.Int(args.shift()) - 1, D.Int(args.shift()))
                    break
                }
                case "launchproject":
                    Char.LaunchProject(STATE.REF.currentVal - STATE.REF.targetVal, "COMPLICATION")
                    break
        // no default
            }
        },
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    // #region CONFIGURATION: Card Definitions

        CARDS = [             
            {name: "AMatterOfPride", category: null, value: 1, rarity: "C", afterAction: (charRef, isEnhanced) => { 
                Char.Damage(charRef, "willpower", "superficial+", 2)
                if (isEnhanced) 
                    Char.Damage(charRef, "willpower", "aggravated", 1)
            }},
            {name: "AMomentOfDespair", category: null, value: 1, rarity: "C", afterAction: (charRef, isEnhanced) => { 
                Char.Damage(charRef, "willpower", "superficial+", isEnhanced ? 3 : 1)
            }},
            {name: "AMomentOfInsight", category: "benefit", value: 1, rarity: "R", afterAction: (charRef, isEnhanced) => {
                Char.AwardXP(charRef, isEnhanced ? 2 : 4, "A Moment of Insight")
            }},
            {name: "AMomentOfInspiration", category: "benefit", value: 1, rarity: "U", afterAction: (charRef, isEnhanced) => {
                Char.Damage(charRef, "willpower", "superficial+", isEnhanced ? -1 : -100)
            }},
            {name: "AtCrossPurposes", category: "project", value: 1, rarity: "U", afterAction: (charRef, isEnhanced) => {
                STATE.REF.endMessageQueue.push("Reset a random Project Die to 10")
                if (isEnhanced)
                    STATE.REF.endMessageQueue.push("... and increase the Increment Unit by one!")
            }},
            // {name: "Betrayal", category: null, value: -1, rarity: ""},
            {name: "BloodRush", category: "beast", value: 2, rarity: "U", afterAction: (charRef, isEnhanced) => {
                STATE.REF.endMessageQueue.push("Trigger your Clan Compulsion.")
                if (isEnhanced)
                    Roller.AddCharEffect(charRef, "messycrit;;!Blood Rush (Clan Compulsion)")
            }},
            {name: "Breakthrough", category: "benefit", value: 1, rarity: "R", afterAction: (charRef, isEnhanced) => {
                STATE.REF.endMessageQueue.push(isEnhanced ? "!Reduce an Increment Unit by one." : "!Reduce a Project Die by half.")
            }},
            {name: "Cathexis", category: "attention", value: 2, rarity: "R"},
            {name: "CognitiveDissonance", category: "debilitation", value: 3, rarity: "U", afterAction: (charRef) => {
                Roller.AddCharEffect(charRef, "all;restrictwpreroll2;!Cognitive Dissonance (Max Reroll: 2)")
            }},
            {name: "CollateralDamage", category: "humanity", value: 2, rarity: "R", afterAction: (charRef, isEnhanced) => {
                STATE.REF.endMessageQueue.push(isEnhanced ? "You endanger a Touchstone!" : "One of your Touchstones is endangered.")
            }},
            {name: "CostlyBlunder", category: null, value: 1, rarity: "U", afterAction: (charRef, isEnhanced) => {
                Char.Damage(charRef, "health", "aggravated", isEnhanced ? 2 : 1)
            }},
            {name: "CrisisManagement", category: "project", value: 3, rarity: "R", afterAction: (charRef, isEnhanced) => {
                STATE.REF.endMessageQueue.push(isEnhanced ? "Rush a random Project!" : "Rush a random Project (halve Project Die).")
            }},
            {name: "Ennui", category: "humanity", value: 3, rarity: "R", afterAction: (charRef, isEnhanced) => {
                Char.Damage(charRef, "humanity", null, isEnhanced ? 2 : 1)
            }},
            {name: "Espionage", category: "benefit", value: 1, rarity: "R", afterAction: (charRef, isEnhanced) => {
                STATE.REF.endMessageQueue.push(isEnhanced ? "!Reduce Secrecy of a random NPC Project." : "!Discover a random NPC Project.")
            }},
            {name: "Exhausted", category: "debilitation", value: 2, rarity: "U", afterAction: (charRef, isEnhanced) => {
                (Char.SetWPRefresh || (() => {}))(charRef, isEnhanced ? 1 : "LOW") // Reduce Willpower Refresh
            }},
            {name: "Faith", category: null, value: 0, rarity: "C"},
            // {name: "FakeNews", category: null, value: 2, rarity: "U"},
            {name: "FalseLead", category: "project", value: 1, rarity: "U", afterAction: (charRef, isEnhanced) => {
                STATE.REF.endMessageQueue.push(isEnhanced ? "Triple your Project's Increment." : "Double your Project's Increment.")
            }},
            {name: "FanTheFlames", category: "attention", value: 3, rarity: "R", afterAction: (charRef, isEnhanced) => {
                STATE.REF.endMessageQueue.push(`Reduce all S.I. Project Dice by ${isEnhanced ? "three" : "one"}.`)
            }},
            {name: "Favors", category: "prestation", value: 1, rarity: "U", afterAction: (charRef, isEnhanced) => {
                STATE.REF.endMessageQueue.push(`Use up a ${isEnhanced ? "major" : "minor"} Boon.`)
            }},
            {name: "FieldWork", category: "blood", value: 1, rarity: "C", afterAction: (charRef, isEnhanced) => {
                Char.AdjustHunger(charRef, isEnhanced ? 2 : 1, false)
            }},
            {name: "Friction", category: "attention", value: 1, rarity: "U", afterAction: (charRef, isEnhanced) => {
                STATE.REF.endMessageQueue.push(`Attract the ire of an ${isEnhanced ? "elder" : "ancilla"}-level adversary.`)
            }},
            {name: "GuiltByAssociation", category: "advantage", value: 1, rarity: "C", afterAction: (charRef, isEnhanced) => {
                STATE.REF.endMessageQueue.push(`Reduce your highest Status by ${isEnhanced ? "two" : "one"}.`)
            }},                                                                                                                                       
            {name: "ImmortalClay", category: "humanity", value: 2, rarity: "R", afterAction: (charRef, isEnhanced) => {
                STATE.REF.endMessageQueue.push("Redesign one of your Convictions.")
                if (isEnhanced)
                    STATE.REF.endMessageQueue.push("Redesign a Chronicle Tenet.")
            }},
            {name: "InABind", category: null, value: 1, rarity: "C", afterAction: (charRef, isEnhanced) => {
                STATE.REF.endMessageQueue.push(`A coterie-mate must stake ${isEnhanced ? "two Advantages" : "one Advantage"}.`)
            }},
            {name: "InTheRed", category: null, value: 1, rarity: "C", afterAction: (charRef, isEnhanced) => {
                STATE.REF.endMessageQueue.push(`Stake an additional ${isEnhanced ? "four Advantages" : "one Advantage"}.`)
            }},
            {name: "IrresistibleOpportunity", category: "attention", value: 2, rarity: "R", afterAction: (charRef, isEnhanced) => {
                STATE.REF.endMessageQueue.push(`Hijack or Loot a random NPC Project${isEnhanced ? " (+2 Bonus)." : "."}`)
            }},
            {name: "LooseLips", category: "attention", value: 1, rarity: "U", afterAction: (charRef, isEnhanced) => {
                STATE.REF.endMessageQueue.push(isEnhanced ? "Your Project becomes common knowledge." : "Reduce Project Secrecy by one.")
            }},
            {name: "MentalBlock", category: "debilitation", value: 3, rarity: "R", afterAction: (charRef, isEnhanced) => {
                STATE.REF.endMessageQueue.push(isEnhanced ? "Lose access to a chosen Discipline." : "Lose access to a chosen Discipline power.")
            }},
            {name: "Micromanagement", category: "blood", value: 2, rarity: "U", afterAction: (charRef, isEnhanced) => {
                Char.AdjustHunger(charRef, isEnhanced ? 4 : 2, false)
            }},
            {name: "NecessaryEvils", category: "humanity", value: 2, rarity: "R", afterAction: (charRef, isEnhanced) => {
                Char.Damage(charRef, "stains", "", isEnhanced ? 2 : 1)
            }},
            {name: "Obsessed", category: "debilitation", value: 2, rarity: "U", afterAction: (charRef, isEnhanced) => {
                STATE.REF.endMessageQueue.push(`(${isEnhanced ? "Enhanced " : ""}Obsessed)`)
            }},
            {name: "Options", category: null, value: 0, rarity: "C"},
            {name: "Overwhelmed", category: "debilitation", value: 2, rarity: "U", afterAction: (charRef, isEnhanced) => {
                STATE.REF.endMessageQueue.push(`(${isEnhanced ? "Enhanced " : ""}Overwhelmed)`)
            }},
            {name: "Powderkeg", category: null, value: 0, rarity: "V"},
            {name: "Preoccupied", category: "debilitation", value: 1, rarity: "C", afterAction: (charRef, isEnhanced) => {
                STATE.REF.endMessageQueue.push(`(${isEnhanced ? "Enhanced " : ""}Preoccupied)`)
            }},
            {name: "ProlongedAbsence", category: null, value: 1, rarity: "U", afterAction: (charRef, isEnhanced) => {
                STATE.REF.endMessageQueue.push(`(${isEnhanced ? "Enhanced " : ""}Prolonged Absence)`)
            }},
            {name: "PyrrhicVictory", category: "project", value: 4, rarity: "R"},
            {name: "RecklessGamble", category: "complication", value: 0, rarity: "U"},
            {name: "RepeatMistakes", category: null, value: 0, rarity: "R", action: () => {
                STATE.REF.isRepeatMistakes = true
            }, undoAction: () => {
                STATE.REF.isRepeatMistakes = false
            }},
            {name: "Reverie", category: null, value: 0, rarity: "R"},
            {name: "RippleEffects", category: "complication", value: 1, rarity: "U"},
            // {name: "RockyStart", category: null, value: -1, rarity: ""},
            {name: "SilentBeneficiary", category: null, value: 1, rarity: "U", afterAction: (charRef, isEnhanced) => {
                STATE.REF.endMessageQueue.push(`(${isEnhanced ? "Enhanced " : ""}Silent Beneficiary)`)
            }},
            // {name: "SimmeringResentment", category: null, value: -1, rarity: ""},
            {name: "SpreadThin", category: "debilitation", value: 1, rarity: "C", afterAction: (charRef, isEnhanced) => {
                STATE.REF.endMessageQueue.push(`(${isEnhanced ? "Enhanced " : ""}Spread Thin)`)
            }},
            {name: "TangledWebs", category: "attention", value: 1, rarity: "R", afterAction: (charRef, isEnhanced) => {
                STATE.REF.endMessageQueue.push(`(${isEnhanced ? "Enhanced " : ""}Tangled Webs)`)
            }},
            {name: "TheBeastAscendant", category: "beast", value: 2, rarity: "U", afterAction: (charRef, isEnhanced) => {
                STATE.REF.endMessageQueue.push(`(${isEnhanced ? "Enhanced " : ""}The Beast Ascendant)`)
            }},
            // {name: "TheBeastInsatiable", category: "beast", value: 1, rarity: "U"},
            {name: "TheBeastRampant", category: "beast", value: 2, rarity: "C", afterAction: (charRef, isEnhanced) => {
                STATE.REF.endMessageQueue.push(`(${isEnhanced ? "Enhanced " : ""}The Beast Rampant)`)
            }},
            {name: "TheBeastRavenous", category: "beast", value: 2, rarity: "U", afterAction: (charRef, isEnhanced) => {
                STATE.REF.endMessageQueue.push(`(${isEnhanced ? "Enhanced " : ""}The Beast Ravenous)`)
            }},
            {name: "TheBeastScorned", category: "beast", value: 2, rarity: "U", afterAction: (charRef, isEnhanced) => {
                STATE.REF.endMessageQueue.push(`(${isEnhanced ? "Enhanced " : ""}The Beast Scorned)`)
            }},
            {name: "Tilted", category: "debilitation", value: 1, rarity: "C", afterAction: (charRef, isEnhanced) => {
                STATE.REF.endMessageQueue.push(`(${isEnhanced ? "Enhanced " : ""}Tilted)`)
            }},
            // {name: "Triage", category: null, value: -1, rarity: ""},
            {name: "TunnelVision", category: "complication", value: 1, rarity: "U"},
            {name: "UnderTheBus", category: null, value: 1, rarity: "U"},
            {name: "UnfinishedBusiness", category: null, value: 0, rarity: "U"},
            {name: "WeightOfTheWorld", category: "debilitation", value: 2, rarity: "U", afterAction: (charRef, isEnhanced) => {
                STATE.REF.endMessageQueue.push(`(${isEnhanced ? "Enhanced " : ""}Weight of the World)`)
            }}
        ],
        CARDQTYS = {V: 12, C: 6, U: 3, R: 1},
    // #endregion

    // #region GETTERS: Active card names
        getActiveCards = () => _.filter(STATE.REF.MAT, v => isCardActive(v)),
        getUsedCategories = () => _.uniq(_.compact(_.map(getActiveCards(), v => v.category))),
        isCardInDeck = card => VAL({list: card}) && card.name && (STATE.REF.isRepeatMistakes || !getUsedCategories().includes(card.category)) && !_.map(getActiveCards(), v => v.name).includes(card.name),
        isCardActive = card => VAL({list: card}) && card.isFaceUp && !card.isNegated,
        getRandomSpot = (modes) => {
            const validSpots = []
            for (let i = 0; i < STATE.REF.MAT.length; i++) {
                const card = STATE.REF.MAT[i]
                let isThisCardValid = true
                for (const mode of modes) {
                    switch (mode) {
                        case "noEnhanced":
                            if (card.isEnhanced)
                                isThisCardValid = false
                            break
                        case "noNegated":
                            if (card.isNegated)
                                isThisCardValid = false
                            break                            
                        case "noLastDrawn":                            
                            if (i === STATE.REF.lastDraw)
                                isThisCardValid = false
                            break                            
                        case "noDuplicated":
                            if (card.isDuplicated)
                                isThisCardValid = false
                            break
                        case "faceUp":
                            if (!card.isFaceUp)
                                isThisCardValid = false
                            break
                        // no default
                    }
                    if (!isThisCardValid)
                        break
                }
                if (isThisCardValid)
                    validSpots.push(i)
            }
            return _.sample(validSpots)
        },
    // #endregion

    // #region CARD ACTIVATION: Turning Over & Activating Cards, Deactivating Cards
        doCard = card => {
            setCompVals("add", card.value)
            if (card.action)
                card.action(STATE.REF.charRef, Boolean(card.isEnhanced))
        },
        undoCard = card => {
            setCompVals("add", -1 * card.value)
            if (card.undoAction)
                card.undoAction(STATE.REF.charRef, Boolean(card.isEnhanced))
        },
        flipCard = spot => {
            const card = STATE.REF.MAT[spot]
            if (card && card.isFaceUp) {
                card.isFaceUp = false
                undoCard(card)       
                Media.SetImg(`compCardSpot_${spot+1}`, "cardBack")
                DragPads.Toggle(Media.GetImgData(`compCardSpot_${spot+1}`).id, true)
            } else if (card) {
                card.isFaceUp = true
                doCard(card)
                Media.SetImg(`compCardSpot_${spot+1}`, card.name)
                DragPads.Toggle(Media.GetImgData(`compCardSpot_${spot+1}`).id, false)
                STATE.REF.lastDraw = spot
            }
            refreshDraws()
        },
    // #endregion

    // #region CARD CONTROL: Deck construction, sandbox manipulation
        buildDeck = () => {
            STATE.REF.DECK = []
            // STEP ONE: Filter master cardlist to contain only valid cards (i.e. no undefined cards, no duplicates and no duplicate categories)
            const validCards = _.filter(CARDS, v => isCardInDeck(v))
            // STEP TWO: Go through valid cards and add the proper number to the deck, subtracting discards.
            for (let i = 0; i < validCards.length; i++) {
                const qty = Math.max(0, CARDQTYS[validCards[i].rarity] - _.filter(STATE.REF.DISCARDS, v => v.name === validCards[i].name).length)
                for (let ii = 0; ii < qty; ii++)
                    STATE.REF.DECK.push(validCards[i])            
            }
            Media.SetText("complicationDeckSize", `DECK: ${STATE.REF.DECK.length} Cards`)
        },
        dealCard = spot => {
            const card = STATE.REF.MAT[spot]
            if (card && card.isFaceUp)
                discardCard(spot)
            else if (card && card.imgsrc)
                blinkCard(spot)
            STATE.REF.MAT[spot] = _.clone(_.sample(STATE.REF.DECK))
            Media.SetText(`compCardName_${spot+1}`, STATE.REF.MAT[spot].name)
            Media.SetImg(`compCardSpot_${spot+1}`, "cardBack")
            // DragPads.Toggle(Media.GetImgData(`compCardSpot_${spot+1}`).id, true)
        },
        blinkCard = spot => {
            STATE.REF.FXQUEUE.push(Media.GetImgData(`compCardSpot_${spot+1}`))
            const flashCard = () => { 
                const spotData = STATE.REF.FXQUEUE.pop()
                D.RunFX("compCardBlink", {left: spotData.left, top: spotData.top})
            }
            setTimeout(flashCard, 500 + 300 * STATE.REF.FXQUEUE.length)
        },
        negateCard = spot => {
            if (VAL({number: spot}, "negateCard")) {
                const card = STATE.REF.MAT[spot]
                if (card && card.isNegated) {
                    Media.SetImgTemp(`compCardSpot_${spot+1}`, {tint_color: "transparent"})
                    card.isNegated = false
                    if (card.action)
                        card.action(STATE.REF.charRef, card.isEnhanced)
                } else if (card) {
                    Media.ToggleImg(`complicationEnhanced_${spot+1}`, false)
                    Media.SetImgTemp(`compCardSpot_${spot+1}`, {tint_color:"#000000"})
                    card.isNegated = true
                    if (card.undoAction)
                        card.undoAction(STATE.REF.charRef, card.isEnhanced)
                }
            }
        },
        discardCard = spot => {
            if (VAL({number: spot}, "discardCard")) {
                const card = STATE.REF.MAT[spot]
                Media.ToggleImg(`complicationEnhanced_${spot+1}`, false)
                Media.ToggleImg(`complicationZero_${spot+1}`, false)
                Media.SetImgTemp(`compCardSpot_${spot+1}`, {tint_color: "transparent"})
                if (card && card.isFaceUp)
                    flipCard(spot)
                dealCard(spot)
            }
        },
        dupeCard = spot => {
            if (VAL({number: spot}, "dupeCard")) {
                const card = STATE.REF.MAT[spot]
                if (card && card.isDuplicated) {
                    Media.SetImgTemp(`compCardSpot_${spot+1}`, {tint_color: "transparent"})
                    card.isDuplicated = false
                } else if (card) {
                    Media.SetImgTemp(`compCardSpot_${spot+1}`, {tint_color:"#0000FF"})
                    card.isDuplicated = true
                }
            }
        },        
        enhanceCard = spot => {
            if (VAL({number: spot}, "enhanceCard")) {
                const card = STATE.REF.MAT[spot]
                if (card) {
                    Media.ToggleImg(`complicationEnhanced_${spot+1}`, card.isEnhanced !== true)
                    card.isEnhanced = card.isEnhanced !== true
                }
            }
        },        
        revalueCard = (spot = 0, value = 0) => {
            const card = STATE.REF.MAT[spot]
            setCompVals("add", value - card.value)
            if (value === 0)
                Media.ToggleImg(`complicationZero_${spot + 1}`, true)
            else
                Media.ToggleImg(`complicationZero_${spot + 1}`, false)
            // Media.SetImg(`complicationZero_${index + 1}`, value)
            toFront(Media.GetImg(`complicationZero_${spot + 1}`))
            toFront(Media.GetImg(`complicationEnhanced_${spot + 1}`))
            STATE.REF.MAT[spot].value = value
            sendGMPanel()
        },        
        refreshDraws = () => {
            buildDeck()
            for (let i = 0; i < 10; i++) {
                const card = STATE.REF.MAT[i]
                if (card && card.isFaceUp)
                    continue
                else if (!isCardInDeck(card))
                    dealCard(i)
                Media.SetImg(`compCardSpot_${i+1}`, "cardBack")
                // D.Alert(`Setting compCardName_${i+1} to "${card.name}"`)
                Media.SetText(`compCardName_${i+1}`, STATE.REF.MAT[i].name)
            }
        },

    // #endregion
    // #region SETTERS: Setting card values, target numbers, activating Complication system
        setCompVals = (mode, value) => {
            switch (mode) {
                case "target": {
                    STATE.REF.targetVal = value
                    Media.SetText("complicationTarget", `${STATE.REF.targetVal}`)
                    break
                }
                case "current": {
                    STATE.REF.currentVal = 0
                } /* falls through */
                case "add": case "addVal": case "addValue": {
                    STATE.REF.currentVal += value
                    Media.SetText("complicationCurrent", `${STATE.REF.currentVal}`)
                    break
                }
                // no default
            }
            STATE.REF.remainingVal = STATE.REF.targetVal - STATE.REF.currentVal
            Media.SetText("complicationRemaining", `${STATE.REF.remainingVal <= 0 ? "+" : "-"}${Math.abs(STATE.REF.remainingVal)}`, true)
            if (STATE.REF.remainingVal <= 0) {
                Media.SetTextData("complicationCurrent", {color: C.COLORS.green})
                Media.SetTextData("complicationRemaining", {color: STATE.REF.remainingVal === 0 ? C.COLORS.gold : C.COLORS.green})
            } else {
                Media.SetTextData("complicationCurrent", {color: C.COLORS.brightred})
                Media.SetTextData("complicationRemaining", {color: C.COLORS.brightred})
            }
        },
        resetComplication = (isRefreshing = true) => {
            STATE.REF.DECK = []
            STATE.REF.MAT = [
                {name: null, isFaceUp: false, value: 0},
                {name: null, isFaceUp: false, value: 0},
                {name: null, isFaceUp: false, value: 0},
                {name: null, isFaceUp: false, value: 0},
                {name: null, isFaceUp: false, value: 0},
                {name: null, isFaceUp: false, value: 0},
                {name: null, isFaceUp: false, value: 0},
                {name: null, isFaceUp: false, value: 0},
                {name: null, isFaceUp: false, value: 0},
                {name: null, isFaceUp: false, value: 0}
            ]
            STATE.REF.DISCARDS = []
            setCompVals("current", 0)
            setCompVals("target", 0)
            for (let i = 0; i < 10; i++) {
                Media.ToggleImg(`complicationZero_${i+1}`, false)
                Media.ToggleImg(`complicationEnhanced_${i+1}`, false)
                Media.SetImg(`compCardSpot_${i+1}`, "cardBack", true)
                Media.SetImgTemp(`compCardSpot_${i+1}`, {tint_color: "transparent"})
            }
            if (isRefreshing)
                refreshDraws()
                
        },
        startComplication = startVal => {            
            STATE.REF.isRunning = true
            STATE.REF.lastMode = Session.Mode
            STATE.REF.endMessageQueue = []
            Session.ChangeMode("Complications")
            TimeTracker.StopClock()
            resetComplication(true)
            setCompVals("current", 0)
            setCompVals("target", startVal)
            refreshDraws()
            sendGMPanel()
        },
        endComplication = (isLaunchingProject, isQueingActions = true) => {
            STATE.REF.isRunning = false
            if (isQueingActions)
                for (const card of getActiveCards().filter(x => x.afterAction)) {
                    D.Queue(card.afterAction, [STATE.REF.charRef, card.isEnhanced], "Comp", 0.5)
                    if (card.isDuplicated)
                        D.Queue(card.afterAction, [STATE.REF.charRef, card.isEnhanced], "Comp", 0.5)
                }
            D.Queue(sendEndMsgQueue, [STATE.REF.charRef], "Comp", 0.5)
            D.Queue(resetComplication, [false], "Comp", 0.5)            
            if (Session.IsSessionActive)
                D.Queue(TimeTracker.StartClock, [], "Comp", 0.5)
            D.Queue(Session.ChangeMode, [STATE.REF.lastMode], "Comp", 0.5)
            if (isLaunchingProject)
                D.Queue(Char.LaunchProject, [STATE.REF.currentVal - STATE.REF.targetVal, "COMPLICATION"], "Comp", 0.5)
            D.Run("Comp")   
        },
        sendEndMsgQueue = (charRef) => {
            // D.Alert(`End Message Queue: ${D.JS(STATE.REF.endMessageQueue)}`)
            if (STATE.REF.endMessageQueue.length) {
                // D.Alert("Sending End Messages!")
                const messageLines = []
                for (const message of STATE.REF.endMessageQueue) 
                    if (message.charAt(0) === "!") 
                        messageLines.push(C.CHATHTML.Body(message.slice(1), {color: C.COLORS.green}))
                    else
                        messageLines.push(C.CHATHTML.Body(message))
                
                D.Chat(charRef, C.CHATHTML.Block([
                    C.CHATHTML.Title("COMPLICATION RESULTS", {fontSize: "28px"}),
                    C.CHATHTML.Header("Endure the Following:"),
                    messageLines.join(""),
                    C.CHATHTML.Header("Thank you for playing!", {margin: "8px 0px 0px 0px"})
                ]))
            }
        },
        sendGMPanel = () => {
            sendChat("COMPLICATION", D.JSH(`/w Storyteller ${
                C.HTML.COMP.promptFullBox([
                    C.HTML.COMP.column([
                        C.HTML.COMP.header("DISCARD"),
                        C.HTML.COMP.commandLine({
                            1: "!comp discard 1",
                            2: "!comp discard 2",
                            3: "!comp discard 3",
                            4: "!comp discard 4",
                            5: "!comp discard 5"
                        }),
                        C.HTML.COMP.commandLine({
                            6: "!comp discard 6",
                            7: "!comp discard 7",
                            8: "!comp discard 8",
                            9: "!comp discard 9",
                            10: "!comp discard 10"
                        }),
                        C.HTML.COMP.commandLine({
                            LAST: "!comp discard last",
                            RANDOM: "!comp discard random"
                        }),
                        C.HTML.COMP.header("ENHANCE"),
                        C.HTML.COMP.commandLine({
                            1: "!comp enhance 1",
                            2: "!comp enhance 2",
                            3: "!comp enhance 3",
                            4: "!comp enhance 4",
                            5: "!comp enhance 5"
                        }),
                        C.HTML.COMP.commandLine({
                            6: "!comp enhance 6",
                            7: "!comp enhance 7",
                            8: "!comp enhance 8",
                            9: "!comp enhance 9",
                            10: "!comp enhance 10"
                        }),
                        C.HTML.COMP.commandLine({
                            LAST: "!comp enhance last",
                            RANDOM: "!comp enhance random"
                        })
                    ].join("<br>")),
                    C.HTML.COMP.column([
                        C.HTML.COMP.header("NEGATE"),
                        C.HTML.COMP.commandLine({
                            1: "!comp negate 1",
                            2: "!comp negate 2",
                            3: "!comp negate 3",
                            4: "!comp negate 4",
                            5: "!comp negate 5"
                        }),
                        C.HTML.COMP.commandLine({
                            6: "!comp negate 6",
                            7: "!comp negate 7",
                            8: "!comp negate 8",
                            9: "!comp negate 9",
                            10: "!comp negate 10"
                        }),
                        C.HTML.COMP.commandLine({
                            LAST: "!comp negate last",
                            RANDOM: "!comp negate random"
                        }),
                        C.HTML.COMP.header("REVALUE"),
                        C.HTML.COMP.commandLine({
                            1: "!comp revalue 1",
                            2: "!comp revalue 2",
                            3: "!comp revalue 3",
                            4: "!comp revalue 4",
                            5: "!comp revalue 5"
                        }),
                        C.HTML.COMP.commandLine({
                            6: "!comp revalue 6",
                            7: "!comp revalue 7",
                            8: "!comp revalue 8",
                            9: "!comp revalue 9",
                            10: "!comp revalue 10"
                        }),
                        C.HTML.COMP.commandLine({
                            LAST: "!comp revalue last",
                            RANDOM: "!comp revalue random"
                        })
                    ].join("<br>")),
                    C.HTML.COMP.header("DUPLICATE"),
                    C.HTML.COMP.commandLine({
                        1: "!comp duplicate 1",
                        2: "!comp duplicate 2",
                        3: "!comp duplicate 3",
                        4: "!comp duplicate 4",
                        5: "!comp duplicate 5"
                    }),
                    C.HTML.COMP.commandLine({
                        6: "!comp duplicate 6",
                        7: "!comp duplicate 7",
                        8: "!comp duplicate 8",
                        9: "!comp duplicate 9",
                        10: "!comp duplicate 10"
                    }),
                    C.HTML.COMP.commandLine({
                        LAST: "!comp duplicate last",
                        RANDOM: "!comp duplicate random"
                    }),
                ].join(""))
            }`))
        },
        promptCardVal = (cardSpot) => {
            sendChat("COMPLICATION", D.JSH(`/w Storyteller ${
                C.HTML.COMP.prompt("Set Card Value:", {
                    0: `!comp setvalue ${cardSpot+1} 0`,
                    1: `!comp setvalue ${cardSpot+1} 1`,
                    2: `!comp setvalue ${cardSpot+1} 2`,
                    3: `!comp setvalue ${cardSpot+1} 3`,
                    4: `!comp setvalue ${cardSpot+1} 4`
                })
            }`))
        }
    // #endregion

    return {
        CheckInstall: checkInstall,
        OnChatCall: onChatCall,

        Flip: flipCard
    }
})()

on("ready", () => {
    Complications.CheckInstall()
    D.Log("Complications Ready!")
})
void MarkStop("Complications")