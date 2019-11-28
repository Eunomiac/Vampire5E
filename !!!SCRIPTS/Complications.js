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
            STATE.REF.totalCards = STATE.REF.totalCards || []

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
                case "getstats": {
                    getCardStats()
                    break
                }
                case "make": {
                    switch (D.LCase(call = args.shift())) {
                        case "dragpads": {
                            DragPads.ClearAllPads("flipComp")
                            for (let i = 1; i <= 10; i++)
                                DragPads.MakePad(`CompSpot_${i}`, "flipComp", {deltaWidth: -75, deltaHeight: -90})
                            break
                        }
                        // no default
                    }
                    break
                }
                case "panel": {
                    sendGMPanel()
                    break
                }
                case "set": {
                    setCard(D.Int(args.shift()) + 1, args.shift(), args.shift() || null)
                    break
                }
                case "flip": {
                    flipCard(D.Int(args.shift()))
                    break
                }
                case "target": {
                    setCompVals(call, D.Int(args.shift()))
                    break
                }
                case "start": {
                    if (D.LCase(args[0]) === "project") {
                        STATE.REF.charRef = Roller.Char
                        startComplication(Math.abs(D.Int(Roller.Margin)))
                    } else {    
                        STATE.REF.charRef = ((charObjs || [{id: null}])[0] || {id: null}).id                   
                        startComplication(D.Int(args.shift()))
                    }
                    
                    break
                }
                case "stop": case "end":
                    endComplication(args[0] === "true", args[1] === "true")
                    STATE.REF.charRef = null
                    break
                case "reset":
                    resetComplication(true)
                    break
                case "discard": {
                    switch (D.LCase(call = args.shift())) {
                        case "random": {
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
                        case "random": {
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
                        case "random": {
                            negateCard(getRandomSpot(["isUndoable", "faceUp", "noEnhanced", "noNegated", "noLastDrawn"]))
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
                        case "random": {
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
                        case "random": {
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

        /* eslint-disable no-unused-vars */
        CARDS = [             
            {name: "AMatterOfPride", displayName: "A Matter of Pride", category: null, value: 1, rarity: "C",
             afterAction: (charRef, spot, isEnhanced) => { 
                 Char.Damage(charRef, "willpower", "superficial+", 2)
                 if (isEnhanced) 
                     Char.Damage(charRef, "willpower", "aggravated", 1)
             }},
            {name: "AMomentOfDespair", displayName: "A Moment of Despair", category: null, value: 1, rarity: "C",
             afterAction: (charRef, spot, isEnhanced) => { 
                 Char.Damage(charRef, "willpower", "superficial+", isEnhanced ? 3 : 1)
             }},
            {name: "AMomentOfInsight", displayName: "A Moment of Insight", category: "benefit", value: 1, rarity: "R", 
             afterAction: (charRef, spot, isEnhanced) => {
                 Char.AwardXP(charRef, spot, isEnhanced ? 2 : 4, "A Moment of Insight")
             }},
            {name: "AMomentOfInspiration", displayName: "A Moment of Inspiration", category: "benefit", value: 1, rarity: "U",
             afterAction: (charRef, spot, isEnhanced) => {
                 Char.Damage(charRef, "willpower", "superficial+", isEnhanced ? -1 : -100)
             }},
            {name: "AtCrossPurposes", displayName: "At Cross Purposes", category: "project", value: 1, rarity: "U",
             afterAction: (charRef, spot, isEnhanced) => {
                 STATE.REF.endMessageQueue.push("Reset a random Project Die to 10")
                 if (isEnhanced)
                     STATE.REF.endMessageQueue.push("... and increase the Increment Unit by one!")
             }},
            // {name: "Betrayal", displayName: "", category: null, value: -1, rarity: ""},
            {name: "BloodRush", displayName: "Blood Rush", category: "beast", value: 2, rarity: "U",
             afterAction: (charRef, spot, isEnhanced) => {
                 STATE.REF.endMessageQueue.push("Trigger your Clan Compulsion.")
                 if (isEnhanced)
                     Roller.AddCharEffect(charRef, "messycrit;;!Blood Rush (Clan Compulsion)")
             }},
            {name: "Breakthrough", displayName: "Breakthrough", category: "benefit", value: 1, rarity: "R", 
             afterAction: (charRef, spot, isEnhanced) => {
                 STATE.REF.endMessageQueue.push(isEnhanced ? "!Reduce an Increment Unit by one." : "!Reduce a Project Die by half.")
             }},
            {name: "Cathexis", displayName: "Cathexis", category: "attention", value: 2, rarity: "R",
             afterAction: (charRef, spot, isEnhanced) => {
                 STATE.REF.endMessageQueue.push(isEnhanced ? "Confront an NPC of the Storyteller's choice!" : "Confront an NPC of your sect!")
             }},
            {name: "CognitiveDissonance", displayName: "Cognitive Dissonance", category: "debilitation", value: 3, rarity: "U",
             afterAction: (charRef, spot, isEnhanced) => {
                 Roller.AddCharEffect(charRef, "all;restrictwpreroll2;!Cognitive Dissonance (Max Reroll: 2)")
             }},
            {name: "CollateralDamage", displayName: "Collateral Damage", category: "humanity", value: 2, rarity: "R",
             afterAction: (charRef, spot, isEnhanced) => {
                 STATE.REF.endMessageQueue.push(isEnhanced ? "You endanger a Touchstone!" : "One of your Touchstones is endangered.")
             }},
            {name: "CostlyBlunder", displayName: "Costly Blunder", category: null, value: 1, rarity: "U",
             afterAction: (charRef, spot, isEnhanced) => {
                 Char.Damage(charRef, "health", "aggravated", isEnhanced ? 2 : 1)
             }},
            {name: "CrisisManagement", displayName: "Crisis Management", category: "project", value: 3, rarity: "R",
             afterAction: (charRef, spot, isEnhanced) => {
                 STATE.REF.endMessageQueue.push(isEnhanced ? "Rush a random Project!" : "Rush a random Project (halve Project Die).")
             }},
            {name: "Ennui", displayName: "Ennui", category: "humanity", value: 3, rarity: "R",
             afterAction: (charRef, spot, isEnhanced) => {
                 Char.Damage(charRef, "humanity", null, isEnhanced ? 2 : 1)
             }},
            {name: "Espionage", displayName: "Espionage", category: "benefit", value: 1, rarity: "R",
             afterAction: (charRef, spot, isEnhanced) => {
                 STATE.REF.endMessageQueue.push(isEnhanced ? "!Reduce Secrecy of a random NPC Project." : "!Discover a random NPC Project.")
             }},
            {name: "Exhausted", displayName: "Exhausted", category: "debilitation", value: 2, rarity: "U",
             afterAction: (charRef, spot, isEnhanced) => {
                 (Char.SetWPRefresh || (() => {}))(charRef, spot, isEnhanced ? 1 : "LOW") // Reduce Willpower Refresh
             }},
            {name: "Faith", displayName: "Faith", category: null, value: 0, rarity: "C",
             action: (charRef, spot) => {
                 if (STATE.REF.MAT[spot].isEnhanced)
                     cardAlert(spot, "Draw. The Storyteller will decide if you keep it.", null, " (Enhanced)")
                 else
                     cardAlert(spot, "Draw, then choose to keep it or discard it.")
             },
             isNotUndoable: true},
            // {name: "FakeNews", displayName: "", category: null, value: 2, rarity: "U"},
            {name: "FalseLead", displayName: "False Lead", category: "project", value: 1, rarity: "U",
             afterAction: (charRef, spot, isEnhanced) => {
                 STATE.REF.endMessageQueue.push(isEnhanced ? "Triple your Project's Increment." : "Double your Project's Increment.")
             }},
            {name: "FanTheFlames", displayName: "Fan the Flames", category: "attention", value: 3, rarity: "R",
             afterAction: (charRef, spot, isEnhanced) => {
                 STATE.REF.endMessageQueue.push(`Reduce all S.I. Project Dice by ${isEnhanced ? "three" : "one"}.`)
             }},
            {name: "Favors", displayName: "Favors", category: "prestation", value: 1, rarity: "U",
             afterAction: (charRef, spot, isEnhanced) => {
                 STATE.REF.endMessageQueue.push(`Use up a ${isEnhanced ? "major" : "minor"} Boon.`)
             }},
            {name: "FieldWork", displayName: "Field Work", category: "blood", value: 1, rarity: "C",
             afterAction: (charRef, spot, isEnhanced) => {
                 Char.AdjustHunger(charRef, spot, isEnhanced ? 2 : 1, false)
             }},
            {name: "Friction", displayName: "Friction", category: "attention", value: 1, rarity: "U",
             afterAction: (charRef, spot, isEnhanced) => {
                 STATE.REF.endMessageQueue.push(`Attract the ire of an ${isEnhanced ? "elder" : "ancilla"}-level adversary.`)
             }},
            {name: "GuiltByAssociation", displayName: "Guilt by Association", category: "advantage", value: 1, rarity: "C",
             afterAction: (charRef, spot, isEnhanced) => {
                 STATE.REF.endMessageQueue.push(`Reduce your highest Status by ${isEnhanced ? "two" : "one"}.`)
             }},                                                                                                                                       
            {name: "ImmortalClay", displayName: "Immortal Clay", category: "humanity", value: 2, rarity: "R",
             afterAction: (charRef, spot, isEnhanced) => {
                 STATE.REF.endMessageQueue.push("Redesign one of your Convictions.")
                 if (isEnhanced)
                     STATE.REF.endMessageQueue.push("Redesign a Chronicle Tenet.")
             }},
            {name: "InABind", displayName: "In a Bind", category: null, value: 1, rarity: "C",
             afterAction: (charRef, spot, isEnhanced) => {
                 STATE.REF.endMessageQueue.push(`A coterie-mate must stake ${isEnhanced ? "two Advantages" : "one Advantage"}.`)
             }},
            {name: "InTheRed", displayName: "In the Red", category: null, value: 1, rarity: "C",
             afterAction: (charRef, spot, isEnhanced) => {
                 STATE.REF.endMessageQueue.push(`Stake an additional ${isEnhanced ? "four Advantages" : "one Advantage"}.`)
             }},
            {name: "IrresistibleOpportunity", displayName: "Irresistible Opportunity", category: "attention", value: 2, rarity: "R",
             afterAction: (charRef, spot, isEnhanced) => {
                 STATE.REF.endMessageQueue.push(`Hijack or Loot a random NPC Project${isEnhanced ? " (+2 Bonus)." : "."}`)
             }},
            {name: "LooseLips", displayName: "Loose Lips", category: "attention", value: 1, rarity: "U",
             afterAction: (charRef, spot, isEnhanced) => {
                 STATE.REF.endMessageQueue.push(isEnhanced ? "Your Project becomes common knowledge." : "Reduce Project Secrecy by one.")
             }},
            {name: "MentalBlock", displayName: "Mental Block", category: "debilitation", value: 3, rarity: "R",
             afterAction: (charRef, spot, isEnhanced) => {
                 STATE.REF.endMessageQueue.push(isEnhanced ? "Lose access to a chosen Discipline." : "Lose access to a chosen Discipline power.")
             }},
            {name: "Micromanagement", displayName: "Micromanagement", category: "blood", value: 2, rarity: "U",
             afterAction: (charRef, spot, isEnhanced) => {
                 Char.AdjustHunger(charRef, spot, isEnhanced ? 4 : 2, false)
             }},
            {name: "NecessaryEvils", displayName: "Necessary Evils", category: "humanity", value: 2, rarity: "R",
             afterAction: (charRef, spot, isEnhanced) => {
                 Char.Damage(charRef, "stains", "", isEnhanced ? 2 : 1)
             }},
            {name: "Obsessed", displayName: "Obsessed", category: "debilitation", value: 2, rarity: "U",
             afterAction: (charRef, spot, isEnhanced) => {
                 Roller.AddCharEffect(charRef, "social;-2;- Obsessed (<.>)")
             }},
            {name: "Options", displayName: "Options", category: null, value: 0, rarity: "C",
             action: (charRef, spot) => {
                 DELAYEDUNTILDISCARD = [ null, null ]
                 if (STATE.REF.MAT[spot].isEnhanced) {
                     cardAlert(spot, "Draw twice, then discard one of them.<br>Reduce the value of the card you keep to zero.", null, " (Enhanced)")
                     ISDELAYEDCARDDEVALUED = true
                 } else {
                     cardAlert(spot, "Draw twice, then discard one of them.")
                 }
             },
             isNotUndoable: true
            },
            {name: "Overwhelmed", displayName: "Overwhelmed", category: "debilitation", value: 2, rarity: "U",
             afterAction: (charRef, spot, isEnhanced) => {                 
                 Roller.AddCharEffect(charRef, "mental;-2;- Overwhelmed (<.>)")
             }},
            {name: "Powderkeg", displayName: "Powderkeg", category: null, value: 0, rarity: "V",
             action: (charRef, spot) => {  
                 cardAlert(spot, "Enhancing next draw.")
                 ISNEXTDRAWENHANCED = spot
             },
             onEnhance: (charRef, spot) => {
                 const randomSpot = getRandomSpot(["noEnhanced", "noNegated", "faceUp", spot]),
                     card = STATE.REF.MAT[spot]
                 card.enhancedCard = randomSpot
                 cardAlert(spot, `Randomly enhancing a drawn Complication:<br>Enhancing "${getCardName(randomSpot, true)}"!`, null, " (Enhanced)")
                 enhanceCard(randomSpot)
             },
             undoAction: (charRef, spot) => {
                 const card = STATE.REF.MAT[spot]
                 if (VAL({number: card.nextDrawEnhance})) {
                     const enhancedCard = STATE.REF.MAT[card.nextDrawEnhance]
                     if (enhancedCard && enhancedCard.isFaceUp && enhancedCard.isEnhanced && !enhancedCard.isNegated) {
                         enhanceCard(card.nextDrawEnhance)
                         cardAlert(spot, `Unenhancing "${enhancedCard.displayName}".`, "Voiding ")
                     } 
                     card.nextDrawEnhance = false
                 } else if (ISNEXTDRAWENHANCED === spot) {
                     cardAlert(spot, "No longer enhancing next draw.", "Voiding ")
                     ISNEXTDRAWENHANCED = false
                 }            
             },
             offEnhance: (charRef, spot) => {
                 const card = STATE.REF.MAT[spot],
                     enhancedSpot = card.enhancedCard,
                     enhancedCard = VAL({number: enhancedSpot}) && STATE.REF.MAT[enhancedSpot]
                 if (enhancedCard && enhancedCard.isFaceUp && enhancedCard.isEnhanced && !enhancedCard.isNegated) {                        
                     cardAlert(spot, `Unenhancing "${enhancedCard.displayName}".`, "Unenhancing ")
                     enhanceCard(enhancedSpot)
                 }
                 card.enhancedCard = false
             }},
            {name: "Preoccupied", displayName: "Preoccupied", category: "debilitation", value: 1, rarity: "C",
             afterAction: (charRef, spot, isEnhanced) => {                 
                 Roller.AddCharEffect(charRef, "social;-1;- Preoccupied (<.>)")
             }},
            {name: "ProlongedAbsence", displayName: "Prolonged Absence", category: null, value: 1, rarity: "U",
             afterAction: (charRef, spot, isEnhanced) => {
                 STATE.REF.endMessageQueue.push(isEnhanced ? "Negate Domain Control until Project resolved." : "-1 Domain Control until Project resolved.")
             }},
            {name: "PyrrhicVictory", displayName: "Pyrrhic Victory", category: "project", value: 4, rarity: "R",
             afterAction: (charRef, spot, isEnhanced) => {
                 STATE.REF.endMessageQueue.push(isEnhanced ? "Halve Project Scope and rewards." : "-1 to Project Scope and rewards.")
             }},
            {name: "RecklessGamble", displayName: "Reckless Gamble", category: "complication", value: 0, rarity: "U",
             action: (charRef, spot) => {
                 cardAlert(spot, [
                     "Choose a Complication to negate.",
                     "Then, a random Complication will be enhanced."
                 ].join("<br>"))
             },
             onEnhance: (charRef, spot) => {
                 cardAlert(spot, "Enhance a Complication at random.", null, " (Enhanced)")
             }},
            {name: "RepeatMistakes", displayName: "Repeat Mistakes", category: null, value: 0, rarity: "R",
             action: () => {
                 STATE.REF.isRepeatMistakes = true
             },
             onEnhance: () => {
                 STATE.REF.isEnhancedRepeatMistakes = true
             },
             undoAction: () => {
                 STATE.REF.isRepeatMistakes = false
             },
             offEnhance: () => {
                 STATE.REF.isEnhancedRepeatMistakes = false
             }},
            {name: "Reverie", displayName: "Reverie", category: null, value: 0, rarity: "R",
             action: (charRef, spot) => {
                 cardAlert(spot, "Enter Memoriam at a difficulty of your choice.<br>If you succeed:<br>Set the value of \"Reverie\" to that difficulty.")
             },
             onEnhance: (charRef, spot) => {
                 cardAlert(spot, "If the Memoriam triggered by \"Reverie\" failed:<br>Suffer a Total Failure.", null, " (Enhanced)")
             },
             isNotUndoable: true
            },
            {name: "RippleEffects", displayName: "Ripple Effects", category: "complication", value: 1, rarity: "U"},
            // {name: "RockyStart", displayName: "", category: null, value: -1, rarity: ""},
            {name: "SilentBeneficiary", displayName: "Silent Beneficiary", category: null, value: 1, rarity: "U",
             afterAction: (charRef, spot, isEnhanced) => {
                 STATE.REF.endMessageQueue.push(`(${isEnhanced ? "Enhanced " : ""}Silent Beneficiary)`)
             }},
            // {name: "SimmeringResentment", displayName: "", category: null, value: -1, rarity: ""},
            {name: "SpreadThin", displayName: "Spread Thin", category: "debilitation", value: 1, rarity: "C",
             afterAction: (charRef, spot, isEnhanced) => {
                 STATE.REF.endMessageQueue.push(`(${isEnhanced ? "Enhanced " : ""}Spread Thin)`)
             }},
            {name: "TangledWebs", displayName: "Tangled Webs", category: "attention", value: 1, rarity: "R",
             afterAction: (charRef, spot, isEnhanced) => {
                 STATE.REF.endMessageQueue.push(`(${isEnhanced ? "Enhanced " : ""}Tangled Webs)`)
             }},
            {name: "TheBeastAscendant", displayName: "The Beast Ascendant", category: "beast", value: 2, rarity: "U",
             afterAction: (charRef, spot, isEnhanced) => {
                 STATE.REF.endMessageQueue.push(`(${isEnhanced ? "Enhanced " : ""}The Beast Ascendant)`)
             }},
            // {name: "TheBeastInsatiable", displayName: "", category: "beast", value: 1, rarity: "U"},
            {name: "TheBeastRampant", displayName: "The Beast Rampant", category: "beast", value: 2, rarity: "C",
             afterAction: (charRef, spot, isEnhanced) => {
                 STATE.REF.endMessageQueue.push(`(${isEnhanced ? "Enhanced " : ""}The Beast Rampant)`)
             }},
            {name: "TheBeastRavenous", displayName: "The Beast Ravenous", category: "beast", value: 2, rarity: "U",
             afterAction: (charRef, spot, isEnhanced) => {
                 STATE.REF.endMessageQueue.push(`(${isEnhanced ? "Enhanced " : ""}The Beast Ravenous)`)
             }},
            {name: "TheBeastScorned", displayName: "The Beast Scorned", category: "beast", value: 2, rarity: "U",
             afterAction: (charRef, spot, isEnhanced) => {
                 STATE.REF.endMessageQueue.push(`(${isEnhanced ? "Enhanced " : ""}The Beast Scorned)`)
             }},
            {name: "Tilted", displayName: "Tilted", category: "debilitation", value: 1, rarity: "C",
             afterAction: (charRef, spot, isEnhanced) => {
                 STATE.REF.endMessageQueue.push(`(${isEnhanced ? "Enhanced " : ""}Tilted)`)
             }},
            // {name: "Triage", displayName: "", category: null, value: -1, rarity: ""},
            {name: "TunnelVision", displayName: "Tunnel Vision", category: "complication", value: 1, rarity: "U"},
            {name: "UnderTheBus", displayName: "Under the Bus", category: null, value: 1, rarity: "U"},
            {name: "UnfinishedBusiness", displayName: "Unfinished Business", category: null, value: 0, rarity: "U"},
            {name: "WeightOfTheWorld", displayName: "Weight of the World", category: "debilitation", value: 2, rarity: "U",
             afterAction: (charRef, spot, isEnhanced) => {
                 STATE.REF.endMessageQueue.push(`(${isEnhanced ? "Enhanced " : ""}Weight of the World)`)
             }}
        ],
        /* eslint-enable no-unused-vars */
        CARDQTYS = {V: 12, C: 6, U: 3, R: 1},
        CARDNAMES = _.values(CARDS).map(x => x.name)
    let ISNEXTDRAWENHANCED = false, ISDELAYEDCARDDEVALUED = false, DELAYEDUNTILDISCARD = []
    // #endregion

    // #region GETTERS: Active card names
    const getActiveCards = () => _.filter(STATE.REF.MAT, v => isCardActive(v)),
        getUsedCategories = () => _.uniq(_.compact(_.map(getActiveCards(), v => v.category))),
        isCardInDeck = card => VAL({list: card}) && card.name && (STATE.REF.isRepeatMistakes || !getUsedCategories().includes(card.category)) && !_.map(getActiveCards(), v => v.name).includes(card.name),
        isCardActive = card => VAL({list: card}) && card.isFaceUp && !card.isNegated,
        getCardName = (spot, isReturningFullName = false) => isReturningFullName && STATE.REF.MAT[spot].displayName || STATE.REF.MAT[spot].name,
        getRandomSpot = (modes) => {
            const validSpots = []
            for (let i = 0; i < STATE.REF.MAT.length; i++) {
                const card = STATE.REF.MAT[i]
                let isThisCardValid = true
                for (const mode of modes) {
                    switch (mode) {
                        case "isUndoable":
                            if (card.isNotUndoable)
                                isThisCardValid = false
                            break
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
                        default:
                            if (i === mode)
                                isThisCardValid = false
                            break
                    }
                    if (!isThisCardValid)
                        break
                }
                if (isThisCardValid)
                    validSpots.push(i)
            }
            DB({validSpots}, "getRandomSpot")
            return _.sample(validSpots)
        },
        cardAlert = (spot, message, preTitle, postTitle) => {
            const cardName = getCardName(spot, true),
                title = `${preTitle || ""}${cardName}${postTitle || ""}`
            D.Chat("all", C.HTML.Block([
                C.HTML.Header(title),
                C.HTML.Body(message)
            ].join("")), undefined, D.RandomString(3))
        },
        getCardStats = () => {
            const cardData = {
                V: [],
                C: [],
                U: [],
                R: []
            }
            for (const card of CARDS)
                cardData[card.rarity].push(card.name)
            D.Alert([
                "<h4>Cards of Each Rarity</h4>",
                `- ${cardData.V.length}x Very Common (${cardData.V.length * CARDQTYS.V})`,
                `- ${cardData.C.length}x Common (${cardData.C.length * CARDQTYS.C})`,
                `- ${cardData.U.length}x Uncommon (${cardData.U.length * CARDQTYS.U})`,
                `- ${cardData.R.length}x Rare (${cardData.R.length * CARDQTYS.R})`,
                "",
                `Total in Deck: ${cardData.V.length * CARDQTYS.V + cardData.C.length * CARDQTYS.C + cardData.U.length * CARDQTYS.U + cardData.R.length * CARDQTYS.R}`,
                "<h4>Cards in Each Rarity</h4>",
                D.JS(cardData)
            ].join("<br>"), "Complications Data")
        },
    // #endregion

    // #region CARD ACTIVATION: Turning Over & Activating Cards, Deactivating Cards
        flipCard = spot => {
            const card = STATE.REF.MAT[spot]
            if (card && card.isFaceUp) {
                setCard(spot, "faceDown")
            } else if (card) {
                if (VAL({number: ISNEXTDRAWENHANCED})) {
                    setCard(spot, "faceUpEnhanced")
                    const enhancingCard = STATE.REF.MAT[ISNEXTDRAWENHANCED]
                    enhancingCard.nextDrawEnhance = spot
                    ISNEXTDRAWENHANCED = false
                } else {
                    setCard(spot, "faceUp")
                }
                STATE.REF.lastDraw = spot
            }
            refreshDraws()
        },
    // #endregion

    // #region CARD CONTROL: Deck construction, sandbox manipulation
        setCard = (spot, mode) => {
            DB({spot, mode}, "setCard")
            Media.ToggleImg(`CompSpot_${spot+1}`, true)
            Media.ToggleImg(`CompCard_Base_${spot+1}`, true)
            Media.ToggleImg(`CompCard_Text_${spot+1}`, false)
            const card = STATE.REF.MAT[spot]
            if (card && CARDNAMES.includes(card.name)) {
                Media.SetText(`CompCard_Name_${spot+1}`, card.name)
                Media.SetImg(`CompCard_Text_${spot+1}`, card.name) 
            }
            let isForcingEnhance = false
            switch (mode) {
                case "discard": {
                    DELAYEDUNTILDISCARD = DELAYEDUNTILDISCARD.filter(x => x !== null && x !== spot)
                    while (DELAYEDUNTILDISCARD.length) {
                        setCard(DELAYEDUNTILDISCARD.shift(), "activate")
                        ISDELAYEDCARDDEVALUED = false
                    }
                }
                // falls through
                case "faceDown": {
                    Media.ToggleImg(`CompCard_Negated_${spot+1}`, false)
                    Media.ToggleImg(`CompCard_Revalue_${spot+1}`, false)
                    DragPads.Toggle(Media.GetImgData(`CompSpot_${spot+1}`).id, true)
                    Media.SetImg(`CompCard_Base_${spot+1}`, "cardBack")
                    if (card.isFaceUp) {
                        setCompVals("add", -1 * card.value)
                        if (card.isEnhanced && card.offEnhance && card.enhanceTriggered) {
                            card.offEnhance(STATE.REF.charRef, spot)
                            card.enhanceTriggered = false
                        }
                        if (card.undoAction && card.actionTriggered) {
                            card.undoAction(STATE.REF.charRef, spot)
                            card.actionTriggered = false
                        }
                    }
                    card.isFaceUp = false                    
                    card.isEnhanced = false
                    card.isNegated = false
                    break
                }
                case "faceUpEnhanced": {
                    isForcingEnhance = true
                }
                // falls through
                case "faceUp": {
                    Media.ToggleImg(`CompCard_Text_${spot+1}`, true)
                    Media.ToggleImg(`CompCard_Negated_${spot+1}`, false)
                    Media.ToggleImg(`CompCard_Revalue_${spot+1}`, false)
                    DragPads.Toggle(Media.GetImgData(`CompSpot_${spot+1}`).id, false)
                    Media.SetImg(`CompCard_Base_${spot+1}`, "base")
                    card.isFaceUp = true
                    card.isEnhanced = isForcingEnhance
                    card.isNegated = false
                    if (DELAYEDUNTILDISCARD.filter(x => x === null).length) {
                        DB({DELAYEDUNTILDISCARD}, "setCard")
                        DELAYEDUNTILDISCARD[DELAYEDUNTILDISCARD.findIndex(x => x === null)] = spot
                        break
                    }
                }
                // falls through
                case "activate": {
                    if (!card.isEnhanced && ISNEXTDRAWENHANCED) {
                        ISNEXTDRAWENHANCED = false
                        card.isEnhanced = true
                    }
                    if (
                        card.category && STATE.REF.isEnhancedRepeatMistakes && getUsedCategories().includes(card.category) ||
                        ISDELAYEDCARDDEVALUED && mode === "activate"
                    )
                        revalueCard(spot, 0)                        
                    Media.ToggleImg(`CompCard_Text_${spot+1}`, true)
                    setCompVals("add", card.value)
                    DB(`Activating ${card.name} ...`, "setCard")
                    if (card.action) {
                        DB("... Action Detected, Triggering ...", "setCard")
                        card.action(STATE.REF.charRef, spot)
                        card.actionTriggered = true
                    }
                    if (!card.isEnhanced)
                        break
                }
                // falls through
                case "enhanced": {
                    Media.ToggleImg(`CompCard_Text_${spot+1}`, true)
                    Media.SetImg(`CompCard_Base_${spot+1}`, "enhanced")
                    DragPads.Toggle(Media.GetImgData(`CompSpot_${spot+1}`).id, false)
                    card.isEnhanced = true
                    if (card.onEnhance) {
                        card.onEnhance(STATE.REF.charRef, spot)
                        card.enhanceTriggered = true
                    }
                    break
                }
                case "!enhanced": {
                    Media.ToggleImg(`CompCard_Text_${spot+1}`, true)
                    Media.SetImg(`CompCard_Base_${spot+1}`, "base")
                    STATE.REF.MAT[spot].isEnhanced = false
                    if (card.offEnhance && card.enhanceTriggered) {
                        card.offEnhance(STATE.REF.charRef, spot)
                        card.enhanceTriggered = false
                    }
                    break
                }
                case "negated": {
                    Media.ToggleImg(`CompCard_Text_${spot+1}`, true)
                    Media.ToggleImg(`CompCard_Negated_${spot+1}`, true)
                    STATE.REF.MAT[spot].isNegated = true
                    if (card.undoAction && card.actionTriggered) {
                        card.undoAction(STATE.REF.charRef, spot)
                        card.actionTriggered = false
                    }
                    if (card.isEnhanced && card.offEnhance && card.enhanceTriggered) {
                        card.offEnhance(STATE.REF.charRef, spot)
                        card.enhanceTriggered = false
                    }
                    break
                }
                case "!negated": {
                    Media.ToggleImg(`CompCard_Text_${spot+1}`, true)
                    Media.ToggleImg(`CompCard_Negated_${spot+1}`, false)
                    STATE.REF.MAT[spot].isNegated = false
                    if (card.action && !card.actionTriggered) {
                        card.action(STATE.REF.charRef, spot)
                        card.actionTriggered = true
                    }
                    if (card.isEnhanced && card.onEnhance && !card.enhanceTriggered) {
                        card.onEnhance(STATE.REF.charRef, spot)
                        card.enhanceTriggered = true
                    }
                    break
                }
                case "blank": {
                    Media.ToggleImg(`CompCard_Base_${spot+1}`, false)
                    Media.ToggleImg(`CompCard_Negated_${spot+1}`, false)
                    Media.ToggleImg(`CompCard_Revalue_${spot+1}`, false)
                    DragPads.Toggle(Media.GetImgData(`CompSpot_${spot+1}`).id, false)
                    STATE.REF.MAT[spot].isFaceDown = false
                    STATE.REF.MAT[spot].isEnhanced = false
                    STATE.REF.MAT[spot].isNegated = false
                    break
                }
                default: {
                    if (mode.includes("revalue")) {
                        Media.ToggleImg(`CompCard_Text_${spot+1}`, true)
                        if (mode.startsWith("!")) {
                            Media.ToggleImg(`CompCard_Revalue_${spot+1}`, false)
                        } else {
                            const newValue = `${D.Int(mode.match(/\d+$/gu).pop())}`
                            Media.ToggleImg(`CompCard_Revalue_${spot+1}`, true)
                            Media.SetImg(`CompCard_Revalue_${spot+1}`, newValue)
                        }
                    }
                    break
                }
            }
        },    
        buildDeck = () => {
            STATE.REF.DECK = []
            STATE.REF.totalCards = CARDS.map(x => CARDQTYS[x.rarity]).reduce((tot, x) => tot + x, 0)
            // STEP ONE: Filter master cardlist to contain only valid cards (i.e. no undefined cards, no duplicates and no duplicate categories)
            const validCards = _.filter(CARDS, v => isCardInDeck(v))
            // STEP TWO: Go through valid cards and add the proper number to the deck, subtracting discards.
            for (let i = 0; i < validCards.length; i++) {
                const qty = Math.max(0, CARDQTYS[validCards[i].rarity] - _.filter(STATE.REF.DISCARDS, v => v.name === validCards[i].name).length)
                for (let ii = 0; ii < qty; ii++)
                    STATE.REF.DECK.push(validCards[i])            
            }
            Media.SetText("CompCardsRemaining", `${STATE.REF.DECK.length}`)            
            Media.SetText("CompCardsExcluded", `${STATE.REF.totalCards - STATE.REF.DECK.length}`)
        },
        dealCard = spot => {
            const card = STATE.REF.MAT[spot]
            if (card && card.isFaceUp)
                discardCard(spot)
            else if (card && card.imgsrc)
                blinkCard(spot)
            STATE.REF.MAT[spot] = _.clone(_.sample(STATE.REF.DECK))
            setCard(spot, "faceDown", STATE.REF.MAT[spot].name)
            // DragPads.Toggle(Media.GetImgData(`CompSpot_${spot+1}`).id, true)
        },
        blinkCard = spot => {
            STATE.REF.FXQUEUE.push(Media.GetImgData(`CompCard_Base_${spot+1}`))
            const flashCard = () => { 
                const spotData = STATE.REF.FXQUEUE.pop()
                D.RunFX("compCardBlink", {left: spotData.left, top: spotData.top})
            }
            setTimeout(flashCard, 500 + 300 * STATE.REF.FXQUEUE.length)
        },
        negateCard = spot => {
            if (VAL({number: spot}, "negateCard")) {
                const card = STATE.REF.MAT[spot]
                if (card)
                    if (card.isNegated) {
                        setCard(spot, "!negated")
                    } else {
                        setCard(spot, "negated")
                        if (card.undoAction)
                            card.undoAction(STATE.REF.charRef, card.isEnhanced)
                    }
            }
        },
        discardCard = spot => {
            if (VAL({number: spot}, "discardCard")) {
                const card = STATE.REF.MAT[spot]                
                if (card && card.isFaceUp)
                    setCard(spot, "discard")
                dealCard(spot)
            }
        },
        dupeCard = spot => {
            if (VAL({number: spot}, "dupeCard")) {
                const card = STATE.REF.MAT[spot]
                if (card && card.isDuplicated) {
                    Media.SetImgTemp(`CompSpot_${spot+1}`, {tint_color: "transparent"})
                    card.isDuplicated = false
                } else if (card) {
                    Media.SetImgTemp(`CompSpot_${spot+1}`, {tint_color:"#0000FF"})
                    card.isDuplicated = true
                }
            }
        },        
        enhanceCard = spot => {
            if (VAL({number: spot}, "enhanceCard")) {
                const card = STATE.REF.MAT[spot]
                if (card && card.isEnhanced) {
                    setCard(spot, "!enhanced")
                    if (card.offEnhance)
                        card.offEnhance(STATE.REF.charRef)
                } else if (card) {
                    if (card.onEnhance)
                        card.onEnhance(STATE.REF.charRef)
                    setCard(spot, "enhanced")
                }
            }
        },        
        revalueCard = (spot = 0, value = 0) => {
            const card = STATE.REF.MAT[spot]
            if (value === card.value)
                setCard(spot, "!revalue")
            else
                setCard(spot, `revalue${value}`)
            setCompVals("add", value - card.value)
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
                // Media.SetImg(`CompSpot_${i+1}`, "cardBack")
            }
        },

    // #endregion
    // #region SETTERS: Setting card values, target numbers, activating Complication system
        setCompVals = (mode, value) => {
            switch (mode) {
                case "target": {
                    STATE.REF.targetVal = value
                    Media.SetText("CompTarget", `${STATE.REF.targetVal}`)
                    break
                }
                case "current": {
                    STATE.REF.currentVal = 0
                } /* falls through */
                case "add": case "addVal": case "addValue": {
                    STATE.REF.currentVal += value
                    Media.SetText("CompCurrent", `${STATE.REF.currentVal}`)
                    break
                }
                // no default
            }
            STATE.REF.remainingVal = STATE.REF.targetVal - STATE.REF.currentVal
            Media.SetText("CompRemaining", `${STATE.REF.remainingVal <= 0 ? "+" : "-"}${Math.abs(STATE.REF.remainingVal)}`, true)
            if (STATE.REF.remainingVal <= 0) {
                Media.SetTextData("CompCurrent", {color: C.COLORS.tan})
                Media.SetTextData("CompRemaining", {color: C.COLORS.tan})
            } else {
                Media.SetTextData("CompCurrent", {color: C.COLORS.crimson})
                Media.SetTextData("CompRemaining", {color: C.COLORS.crimson})
            }
        },
        resetComplication = (isRefreshing = true, startVal = 0) => {
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
            setCompVals("target", startVal)
            if (isRefreshing)
                refreshDraws()
                
        },
        startComplication = startVal => {            
            STATE.REF.isRunning = true
            STATE.REF.lastMode = Session.Mode
            STATE.REF.endMessageQueue = []
            Session.ChangeMode("Complications")
            D.Queue(resetComplication, [true, startVal], "Comp", 1)
            D.Queue(sendGMPanel, [], "Comp", 0.5)
            D.Run("Comp")
        },        
        endComplication = (isLaunchingProject, isQueingActions = true) => {
            DB({isLaunchingProject, isQueingActions}, "endComplication")
            STATE.REF.isRunning = false
            if (isQueingActions)
                for (const card of getActiveCards().filter(x => x.afterAction)) {
                    D.Queue(card.afterAction, [STATE.REF.charRef, card.isEnhanced], "Comp", 0.5)
                    if (card.isDuplicated)
                        D.Queue(card.afterAction, [STATE.REF.charRef, card.isEnhanced], "Comp", 0.5)
                }
            D.Queue(sendEndMsgQueue, [STATE.REF.charRef], "Comp", 3)
            if (isLaunchingProject) {
                D.Queue(Char.LaunchProject, [STATE.REF.currentVal - STATE.REF.targetVal, "COMPLICATION"], "Comp", 0.5)
                D.Queue(D.Chat, ["all", C.HTML.Block([
                    C.HTML.Header("Launching Project"),
                    C.HTML.Body([
                        `Launch Margin: ${STATE.REF.currentVal - STATE.REF.targetVal}`,
                        `Required Stake: ${Math.max(0, Roller.Commit - (STATE.REF.currentVal - STATE.REF.targetVal))}`
                    ].join("<br>"))
                ].join(""))], "Comp", 2)
            } 
            D.Queue(resetComplication, [false], "Comp", 0.5)   
            D.Queue(Session.ChangeMode, [STATE.REF.lastMode], "Comp", 0.5)
            D.Run("Comp")   
        },
        sendEndMsgQueue = (charRef) => {
            // D.Alert(`End Message Queue: ${D.JS(STATE.REF.endMessageQueue)}`)
            if (STATE.REF.endMessageQueue.length) {
                // D.Alert("Sending End Messages!")
                const messageLines = []
                for (const message of STATE.REF.endMessageQueue) 
                    if (message.charAt(0) === "!") 
                        messageLines.push(C.HTML.Body(message.slice(1), {color: C.COLORS.green}))
                    else
                        messageLines.push(C.HTML.Body(message))
                
                D.Chat(charRef, C.HTML.Block([
                    C.HTML.Title("COMPLICATION RESULTS", {fontSize: "28px"}),
                    C.HTML.Header("Endure the Following:"),
                    messageLines.join(""),
                    C.HTML.Header("Thank you for playing!", {margin: "8px 0px 0px 0px"})
                ]))
            }
        },
        sendGMPanel = () => {
            const subPanels = [],
                getColor = (action, spot) => {
                    if (["LAST", "RANDOM"].includes(spot))
                        return C.COLORS[{
                            discard: "brightred",
                            enhance: "brightpurple",
                            negate: "blue",
                            revalue: "darkgreen",
                            duplicate: "orange"
                        }[action]]
                    const card = STATE.REF.MAT[spot]
                    switch (action) {
                        case "discard":
                            if (card.isFaceUp)
                                return C.COLORS.brightred
                            break
                        case "enhance":
                            if (card.isFaceUp && !card.isEnhanced)
                                return C.COLORS.brightpurple
                            else if (card.isEnhanced)
                                return C.COLORS.grey
                            break
                        case "negate":
                            if (card.isFaceUp && !card.isNegated)
                                return C.COLORS.blue
                            else if (card.isNegated)
                                return C.COLORS.brightgrey
                            break
                        case "revalue":
                            if (card.isFaceUp)
                                return C.COLORS.darkgreen
                            break
                        case "duplicate":
                            if (card.isFaceUp && !card.isDuplicated)
                                return C.COLORS.orange
                            else if (card.isDuplicated)
                                return C.COLORS.brightgrey
                            break
                        // no default
                    }
                    return C.COLORS.darkgrey
                }
            for (const actionType of ["discard", "enhance", "negate", "revalue", "duplicate"])
                subPanels.push({
                    title: actionType,
                    rows: [
                        {
                            type: "Header",
                            contents: D.Capitalize(actionType)
                        },
                        {
                            type: "ButtonLine",
                            contents: [1, 2, 3, 4, 5].map(x => ({name: x, command: `!comp ${actionType} ${x}`, styles: {width: "19%", buttonWidth: "60%", bgColor: getColor(actionType, x-1)}})) // , fontSize: "10px", bgColor: C.COLORS.purple, buttonTransform: "none"}}))
                        },
                        {
                            type: "ButtonLine",
                            contents: [6, 7, 8, 9, 10].map(x => ({name: x, command: `!comp ${actionType} ${x}`, styles: {width: "19%", buttonWidth: "60%", bgColor: getColor(actionType, x-1)}})) // , fontSize: "10px", bgColor: C.COLORS.purple, buttonTransform: "none"}}))
                        },
                        {
                            type: "ButtonLine",
                            contents: ["LAST", "RANDOM"].map(x => ({name: x, command: `!comp ${actionType} ${D.LCase(x)}`, styles: {width: "45%"}})) // , fontSize: "10px", bgColor: C.COLORS.purple, buttonTransform: "none"}}))
                        }
                    ]
                })            
            D.CommandMenu({title: "Complications Control", rows: [
                ..._.values(_.groupBy(subPanels, (x, i) => Math.floor(i / 2))).map(x => ({type: "Column", contents: x, style: {width: "47%", margin: "0px 1% 0% 1%"}})),
                {type: "ButtonLine", contents: [{name: "Finish", command: "!comp end false true"}, {name: "Launch!", command: "!comp end true true"}]}
            ]})
        },
        promptCardVal = (cardSpot) => {
            D.CommandMenu({title: "Set Card Value", rows: [
                {type: "ButtonLine", contents: [                        
                    {name: 0, command: `!comp setvalue ${cardSpot+1} 0`},
                    {name: 1, command: `!comp setvalue ${cardSpot+1} 1`},
                    {name: 2, command: `!comp setvalue ${cardSpot+1} 2`},
                    {name: 3, command: `!comp setvalue ${cardSpot+1} 3`},
                    {name: 4, command: `!comp setvalue ${cardSpot+1} 4`}
                ]}]})
        }
    // #endregion

    return {
        CheckInstall: checkInstall,
        OnChatCall: onChatCall,

        SetCard: setCard,
        Flip: flipCard,
        get Cards() { return CARDS }
    }
})()

on("ready", () => {
    Complications.CheckInstall()
    D.Log("Complications Ready!")
})
void MarkStop("Complications")