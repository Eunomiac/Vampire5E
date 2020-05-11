void MarkStart("Complications");
const Complications = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Complications";

    // #region COMMON INITIALIZATION
    const STATE = {get REF() { return C.RO.OT[SCRIPTNAME] }};
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
        STATE.REF.deckID = STATE.REF.deckID || "";
        STATE.REF.targetVal = STATE.REF.targetVal || 0;
        STATE.REF.currentVal = STATE.REF.currentVal || 0;
        STATE.REF.remainingVal = STATE.REF.remainingVal || 0;
        STATE.REF.cardsDrawn = STATE.REF.cardsDrawn || [];
        STATE.REF.isRunning = STATE.REF.isRunning || false;
        STATE.REF.lastDraw = STATE.REF.lastDraw || -1;
        STATE.REF.endMessageQueue = STATE.REF.endMessageQueue || [];
        STATE.REF.totalCards = STATE.REF.totalCards || [];

        STATE.REF.DECK = STATE.REF.DECK || [];
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
        ];
        STATE.REF.DISCARDS = STATE.REF.DISCARDS || [];
        STATE.REF.FXQUEUE = STATE.REF.FXQUEUE || [];

        setCardFuncs.length = 0;
    };
        // #endregion

    // #region EVENT HANDLERS: (HANDLEINPUT)
    const onChatCall = (call, args, objects, msg) => {
        const charObjs = Listener.GetObjects(objects, "character");
        switch (call) {
            case "deckcheck": {
                const doomReportStrings = [];
                for (const card of CARDS)
                    doomReportStrings.push(`<b>[${card.rarity}] ${card.displayName}</b> ${getCardQtyForDeck(card)} ${isCardValidForDeck(card) ? "IN" : "EXCLUDED" }`);
                D.Alert(doomReportStrings.join("<br>"), "Deck Report");
                break;
            }
            case "force": {
                const card = CARDS.find(x => D.LCase(x.name) === D.LCase(args[0]));
                const spot = D.Int(args[1]) - 1;
                STATE.REF.MAT[spot] = _.clone(card);                    
                STATE.REF.MAT[spot].spot = spot;
                setCard(spot, "faceDown", STATE.REF.MAT[spot].name);
                break;
            }
            case "getstats": {
                getCardStats();
                break;
            }
            case "make": {
                switch (D.LCase(call = args.shift())) {
                    case "dragpads": {
                        DragPads.ClearAllPads("flipComp");
                        for (let i = 1; i <= 10; i++)
                            DragPads.MakePad(`CompSpot_${i}`, "flipComp", {deltaWidth: -75, deltaHeight: -90});
                        break;
                    }
                        // no default
                }
                break;
            }
            case "panel": {
                sendGMPanel();
                break;
            }
            case "unlock": {
                STATE.REF.isRunning = true;
                D.Alert("Complication Drag Pads unlocked.", "COMPLICATIONS");
                break;
            }
            case "get": {
                if (args.length)
                    D.Alert([
                        Object.keys(STATE.REF.MAT[D.Int(args[0]-1)]).join(", "),
                        D.JS(STATE.REF.MAT[D.Int(args[0]-1)])
                    ].join("<br>"));
                else
                    D.Alert(D.JS(STATE.REF.MAT));
                break;
            }
            case "set": {
                setCard(D.Int(args.shift()) + 1, args.shift(), args.shift() || null);
                break;
            }
            case "flip": {
                flipCard(D.Int(args.shift()));
                break;
            }
            case "target": {
                setCompVals(call, D.Int(args.shift()));
                break;
            }
            case "start": {
                if (D.LCase(args[0]) === "project") {
                    STATE.REF.charRef = Roller.Char;
                    startComplication(Math.abs(D.Int(Roller.Margin)));
                } else {    
                    STATE.REF.charRef = ((charObjs || [{id: null}])[0] || {id: null}).id;                   
                    startComplication(D.Int(args.shift()));
                }
                    
                break;
            }
            case "stop": case "end":
                endComplication(args[0] === "true", args[1] === "true");
                STATE.REF.charRef = null;
                break;
            case "reset":
                resetComplication(true);
                if (args[0])
                    setCompVals("target", D.Int(args.shift()));
                break;
            case "discard": {
                switch (D.LCase(call = args.shift())) {
                    case "random": {
                        const randomSpot = getRandomSpot(["faceUp", "noLastDrawn"]);
                        if (VAL({number: randomSpot}))
                            setCard(randomSpot, "discard");
                        break;
                    }
                    case "last": {
                        if (VAL({number: STATE.REF.lastDraw}))
                            setCard(STATE.REF.lastDraw, "discard");
                        break;
                    }
                    default: {
                        setCard(D.Int(call) - 1, "discard");
                        break;
                    }
                }                        
                break;
            }
            case "enhance": {
                switch (D.LCase(call = args.shift())) {
                    case "random": {
                        const randomSpot = getRandomSpot(["faceUp", "noNegated", "noEnhanced", "noLastDrawn"]);
                        if (VAL({number: randomSpot}))
                            setCard(randomSpot, "enhanced");
                        break;
                    }
                    case "last": {
                        if (VAL({number: STATE.REF.lastDraw}))
                            if (STATE.REF.MAT[STATE.REF.lastDraw].isEnhanced)
                                setCard(STATE.REF.lastDraw, "!enhanced");
                            else
                                setCard(STATE.REF.lastDraw, "enhanced");
                        break;
                    }
                    default: {
                        if (STATE.REF.MAT[D.Int(call) - 1].isEnhanced)
                            setCard(D.Int(call) - 1, "!enhanced");
                        else                                
                            setCard(D.Int(call) - 1, "enhanced");
                        break;
                    }
                }                        
                break;
            }
            case "confirm": {
                switch (D.LCase(call = args.shift())) {
                    case "last": {
                        if (VAL({number: STATE.REF.lastDraw}))
                            setCard(STATE.REF.lastDraw, "confirm");
                        break;
                    }
                    default: {
                        setCard(D.Int(call) - 1, "confirm");
                        break;
                    }
                }
                break;
            }
            case "negate": {
                switch (D.LCase(call = args.shift())) {
                    case "random": {
                        const randomSpot = getRandomSpot(["isUndoable", "faceUp", "noEnhanced", "noNegated", "noLastDrawn"]);
                        if (VAL({number: randomSpot}))
                            setCard(randomSpot, "negated");
                        break;
                    }
                    case "last": {
                        if (VAL({number: STATE.REF.lastDraw}))
                            if (STATE.REF.MAT[STATE.REF.lastDraw].isNegated)
                                setCard(STATE.REF.lastDraw, "!negated");
                            else
                                setCard(STATE.REF.lastDraw, "negated");
                        break;
                    }
                    default: {
                        if (STATE.REF.MAT[D.Int(call) - 1].isNegated)
                            setCard(D.Int(call) - 1, "!negated");
                        else                                
                            setCard(D.Int(call) - 1, "negated");
                        break;
                    }
                }                        
                break;
            }
            case "duplicate": {
                switch (D.LCase(call = args.shift())) {
                    case "random": {
                        const randomSpot = getRandomSpot(["faceUp", "noNegated", "noDuplicated", "noLastDrawn"]);
                        if (VAL({number: randomSpot}))
                            dupeCard(randomSpot);
                        break;
                    }
                    case "last": {
                        if (VAL({number: STATE.REF.lastDraw}))
                            dupeCard(STATE.REF.lastDraw);
                        break;
                    }
                    default: {
                        dupeCard(D.Int(call) - 1);
                        break;
                    }
                }                        
                break;
            }
            case "revalue": {
                switch (D.LCase(call = args.shift())) {
                    case "random": {
                        const randomSpot = getRandomSpot(["faceUp", "noLastDrawn"]);
                        if (VAL({number: randomSpot}))
                            promptCardVal(randomSpot);
                        break;
                    }
                    case "last": {
                        if (VAL({number: STATE.REF.lastDraw}))
                            promptCardVal(STATE.REF.lastDraw);
                        break;
                    }
                    default: {
                        promptCardVal(D.Int(call) - 1);
                        break;
                    }
                }                        
                break;
            }
            case "setvalue": {
                revalueCard(D.Int(args.shift()) - 1, D.Int(args.shift()));
                break;
            }
            case "launchproject":
                Char.LaunchProject(STATE.REF.currentVal - STATE.REF.targetVal, "COMPLICATION");
                break;
        // no default
        }
    };
        // #endregion
        // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    // #region CONFIGURATION: Card Definitions

    /* eslint-disable no-unused-vars */    
    const ONNEXT = {
        confirm: [],
        activate: [],
        replace: [],
        faceDown: [],
        faceUp: [],
        discard: [],
        duplicate: [],
        ["!duplicate"]: [],
        negated: [],
        ["!negated"]: [],
        enhanced: [],
        ["!enhanced"]: [],
        revalue: [],
        ["!revalue"]: [],
        blank: []
    };
    const ONALL = {
        confirm: [],
        activate: [],
        replace: [],
        faceDown: [],
        faceUp: [],
        discard: [],
        duplicate: [],
        ["!duplicate"]: [],
        negated: [],
        ["!negated"]: [],
        enhanced: [],
        ["!enhanced"]: [],
        revalue: [],
        ["!revalue"]: [],
        blank: []
    };
    const CARDS = [             
        {name: "AMatterOfPride", displayName: "A Matter of Pride", category: null, value: 1, rarity: "C",
         afterAction: (charRef, spot, isEnhanced) => { 
             Char.Damage(charRef, "willpower", "superficial+", 2);
             if (isEnhanced) 
                 Char.Damage(charRef, "willpower", "aggravated", 1);
         }},
        {name: "AMomentOfDespair", displayName: "A Moment of Despair", category: null, value: 1, rarity: "C",
         afterAction: (charRef, spot, isEnhanced) => { 
             Char.Damage(charRef, "willpower", "superficial+", isEnhanced ? 3 : 1);
         }},
        {name: "AMomentOfInsight", displayName: "A Moment of Insight", category: "benefit", value: 1, rarity: "R", 
         afterAction: (charRef, spot, isEnhanced) => {
             Char.AwardXP(charRef, spot, isEnhanced ? 2 : 4, "A Moment of Insight");
         }},
        {name: "AMomentOfInspiration", displayName: "A Moment of Inspiration", category: "benefit", value: 1, rarity: "U",
         afterAction: (charRef, spot, isEnhanced) => {
             Char.Damage(charRef, "willpower", "superficial+", isEnhanced ? -1 : -100);
         }},
        {name: "Absolution", displayName: "Absolution", category: "benefit", value: 2, rarity: "R", 
         afterAction: (charRef, spot, isEnhanced) => {}},
        {name: "AtCrossPurposes", displayName: "At Cross Purposes", category: "project", value: 1, rarity: "U",
         afterAction: (charRef, spot, isEnhanced) => {
             STATE.REF.endMessageQueue.push(`Reduce a random Project Die by ${isEnhanced ? 4 : 2}.`);
         }},
        // {name: "Betrayal", displayName: "", category: null, value: -1, rarity: ""},
        {name: "BloodRush", displayName: "Blood Rush", category: "beast", value: 2, rarity: "U",
         afterAction: (charRef, spot, isEnhanced) => {
             STATE.REF.endMessageQueue.push("Trigger your Clan Compulsion.");
             if (isEnhanced) {
                 Roller.AddCharEffect(charRef, "messycrit;;!Blood Rush (Clan Compulsion)");
                 STATE.REF.endMessageQueue.push("Messy Criticals trigger your Clan Compulsion.");
             }
         }},
        {name: "Breakthrough", displayName: "Breakthrough", category: "benefit", value: 1, rarity: "R", 
         afterAction: (charRef, spot, isEnhanced) => {
             STATE.REF.endMessageQueue.push(isEnhanced ? "!Reduce an Increment Unit by one." : "!Reduce a Project Die by half.");
         }},
        {name: "Cathexis", displayName: "Cathexis", category: "attention", value: 2, rarity: "R",
         afterAction: (charRef, spot, isEnhanced) => {
             STATE.REF.endMessageQueue.push(isEnhanced ? "Confront an NPC of the Storyteller's choice!" : "Confront an NPC of your sect!");
         }},
        {name: "CognitiveDissonance", displayName: "Cognitive Dissonance", category: "debilitation", value: 3, rarity: "U",
         afterAction: (charRef, spot, isEnhanced) => {
             Roller.AddCharEffect(charRef, "all;restrictwpreroll2;!Cognitive Dissonance (Max Reroll: 2)");
             STATE.REF.endMessageQueue.push("Spending Willpower rerolls only two dice.");
         }},
        {name: "CollateralDamage", displayName: "Collateral Damage", category: "humanity", value: 2, rarity: "R",
         afterAction: (charRef, spot, isEnhanced) => {
             STATE.REF.endMessageQueue.push(isEnhanced ? "You endanger a Touchstone!" : "One of your Touchstones is endangered.");
         }},
        {name: "CostlyBlunder", displayName: "Costly Blunder", category: null, value: 1, rarity: "U",
         afterAction: (charRef, spot, isEnhanced) => {
             Char.Damage(charRef, "health", "aggravated", isEnhanced ? 2 : 1);
         }},
        {name: "CrisisManagement", displayName: "Crisis Management", category: "project", value: 3, rarity: "R",
         afterAction: (charRef, spot, isEnhanced) => {
             STATE.REF.endMessageQueue.push(isEnhanced ? "Rush a random Project!" : "Rush a random Project (halve Project Die).");
         }},
        {name: "Ennui", displayName: "Ennui", category: "humanity", value: 2, rarity: "R",
         afterAction: (charRef, spot, isEnhanced) => {
             Char.Damage(charRef, "humanity", null, isEnhanced ? 2 : 1);
         }},
        {name: "Espionage", displayName: "Espionage", category: "benefit", value: 1, rarity: "R",
         afterAction: (charRef, spot, isEnhanced) => {
             STATE.REF.endMessageQueue.push(isEnhanced ? "!Reduce Secrecy of a random NPC Project." : "!Discover a random NPC Project.");
         }},
        {name: "Exhausted", displayName: "Exhausted", category: "debilitation", value: 2, rarity: "U",
         afterAction: (charRef, spot, isEnhanced) => {
             (Char.SetWPRefresh || (() => {}))(charRef, spot, isEnhanced ? 1 : "LOW"); // Reduce Willpower Refresh
         }},
        {name: "Faith", displayName: "Faith", category: null, value: 0, rarity: "C",
         action: (charRef, spot) => {
             if (STATE.REF.MAT[spot].isEnhanced)
                 cardAlert(spot, "Draw. The Storyteller will decide if you keep it.", null, " (Enhanced)");
             else
                 cardAlert(spot, "Draw, then choose to keep it or discard it.");
             ONNEXT.faceUp.push("WAIT:confirm,discard:confirm");
         },
         isNotUndoable: true},
        {name: "FakeNews", displayName: "Fake News", category: null, value: 3, rarity: "R", 
         afterAction: (charRef, spot, isEnhanced) => {
             Char.AwardXP(charRef, spot, isEnhanced ? -4 : -2, "Fake News");
         }},
        {name: "FalseLead", displayName: "False Lead", category: "project", value: 2, rarity: "U",
         afterAction: (charRef, spot, isEnhanced) => {
             STATE.REF.endMessageQueue.push(isEnhanced ? "Triple your Project's Increment." : "Double your Project's Increment.");
         }},
        {name: "FanTheFlames", displayName: "Fan the Flames", category: "attention", value: 3, rarity: "R",
         afterAction: (charRef, spot, isEnhanced) => {
             STATE.REF.endMessageQueue.push(`Reduce all S.I. Project Dice by ${isEnhanced ? "three" : "one"}.`);
         }},
        {name: "Favors", displayName: "Favors", category: "prestation", value: 1, rarity: "U",
         afterAction: (charRef, spot, isEnhanced) => {
             STATE.REF.endMessageQueue.push(`Use up a ${isEnhanced ? "major" : "minor"} Boon.`);
         }},
        {name: "FieldWork", displayName: "Field Work", category: "blood", value: 1, rarity: "C",
         afterAction: (charRef, spot, isEnhanced) => {
             Char.AdjustHunger(charRef, isEnhanced ? 2 : 1, false);
         }},
        {name: "Friction", displayName: "Friction", category: "attention", value: 1, rarity: "U",
         afterAction: (charRef, spot, isEnhanced) => {
             STATE.REF.endMessageQueue.push(`Attract the ire of an ${isEnhanced ? "elder" : "ancilla"}-level adversary.`);
         }},
        {name: "GuiltByAssociation", displayName: "Guilt by Association", category: "advantage", value: 1, rarity: "C",
         afterAction: (charRef, spot, isEnhanced) => {
             STATE.REF.endMessageQueue.push(`Reduce your highest Status by ${isEnhanced ? "two" : "one"}.`);
         }},  
        {name: "HeavyLiesTheCrown", displayName: "Heavy Lies The Crown", category: "debilitation", value: 2, rarity: "R",
         afterAction: (charRef, spot, isEnhanced) => {
             STATE.REF.endMessageQueue.push(`Choose a player to spend Willpower with you${isEnhanced ? "..." : "."}`);
             if (isEnhanced)
                 STATE.REF.endMessageQueue.push("... then choose again!");
         }},                                                                                                                                     
        {name: "ImmortalClay", displayName: "Immortal Clay", category: "humanity", value: 2, rarity: "R",
         afterAction: (charRef, spot, isEnhanced) => {
             STATE.REF.endMessageQueue.push("Redesign one of your Convictions.");
             if (isEnhanced)
                 STATE.REF.endMessageQueue.push("Redesign a Chronicle Tenet.");
         }},             
        {name: "ImpendingDoom", displayName: "Impending Doom", category: null, value: 1, rarity: "R",
         action: (charRef, spot) => {
             CARDQTYS.overrides.push({
                 source: {name: "ImpendingDoom", isEnhanceEffect: false}, 
                 qty: 2, 
                 check: (card) => card.rarity === "R" && card.category !== "benefit"
             });
             cardAlert(spot, "Two copies of each non-Benefit Rare have been shuffled into the deck, and all face-down cards have been re-dealt.");    
             buildDeck();
             refreshDraws(false, true);
         },
         onEnhance: (charRef, spot) => {
             CARDQTYS.overrides.push({
                 source: {name: "ImpendingDoom", isEnhanceEffect: true}, 
                 qty: 2,
                 check: (card) => card.rarity === "R" && card.category !== "benefit"
             });
             cardAlert(spot, "<i>Another</i> two copies of each Rare have been shuffled into the deck.");    
             buildDeck();
             refreshDraws(false, true);
         },
         undoAction: (charRef, spot) => {
             D.PullOut(CARDQTYS.overrides, x => x.source.name === "ImpendingDoom" && !x.source.isEnhanceEffect);
             buildDeck();
             cardAlert(spot, "The number of rares in the deck have been reduced.", null, " (Enhanced)");  
             refreshDraws(false, true);
         },
         offEnhance: (charRef, spot) => {
             D.PullOut(CARDQTYS.overrides, x => x.source.name === "ImpendingDoom" && x.source.isEnhanceEffect);
             buildDeck();
             cardAlert(spot, "The number of rares in the deck have been reduced.", null, " (Enhanced)");    
             refreshDraws(false, true);
         }
        },
        {name: "InABind", displayName: "In a Bind", category: null, value: 1, rarity: "C",
         afterAction: (charRef, spot, isEnhanced) => {
             STATE.REF.endMessageQueue.push(`A coterie-mate must stake ${isEnhanced ? "two Advantages" : "one Advantage"}.`);
         }},
        {name: "InTheRed", displayName: "In the Red", category: null, value: 2, rarity: "C",
         afterAction: (charRef, spot, isEnhanced) => {
             STATE.REF.endMessageQueue.push(`Stake an additional ${isEnhanced ? "four Advantages" : "one Advantage"}.`);
         }},
        {name: "IrresistibleOpportunity", displayName: "Irresistible Opportunity", category: "attention", value: 2, rarity: "R",
         afterAction: (charRef, spot, isEnhanced) => {
             STATE.REF.endMessageQueue.push(`Hijack or Loot a random NPC Project${isEnhanced ? " (+2 Bonus)." : "."}`);
         }},
        {name: "LooseLips", displayName: "Loose Lips", category: "attention", value: 1, rarity: "U",
         afterAction: (charRef, spot, isEnhanced) => {
             STATE.REF.endMessageQueue.push(isEnhanced ? "Your Project becomes common knowledge." : "Reduce Project Secrecy by one.");
         }},
        {name: "MentalBlock", displayName: "Mental Block", category: "debilitation", value: 3, rarity: "R",
         afterAction: (charRef, spot, isEnhanced) => {
             STATE.REF.endMessageQueue.push(isEnhanced ? "Lose access to a chosen Discipline." : "Lose access to a chosen Discipline power.");
         }},
        {name: "Micromanagement", displayName: "Micromanagement", category: "blood", value: 2, rarity: "U",
         afterAction: (charRef, spot, isEnhanced) => {
             Char.AdjustHunger(charRef, isEnhanced ? 4 : 2, false);
         }},
        {name: "MilesToGo", displayName: "Miles to Go", category: null, value: -3, rarity: "U",
         action: (charRef, spot) => {
             ONALL.activate.push(() => {
                 if (STATE.REF.MAT[spot].name === "MilesToGo" && isCardActive(STATE.REF.MAT[spot]) && (!STATE.REF.MAT[spot].isEnhanced || STATE.REF.MAT[spot].value < 0))
                     revalueCard(spot, STATE.REF.MAT[spot].value + 1);
             });
         }
        },
        {name: "NecessaryEvils", displayName: "Necessary Evils", category: "humanity", value: 2, rarity: "R",
         afterAction: (charRef, spot, isEnhanced) => {
             Char.Damage(charRef, "stains", "", isEnhanced ? 2 : 1);
         }},
        {name: "Obsessed", displayName: "Obsessed", category: "debilitation", value: 2, rarity: "U",
         afterAction: (charRef, spot, isEnhanced) => {
             Roller.AddCharEffect(charRef, "social;-2;- Obsessed (<.>)");
             STATE.REF.endMessageQueue.push(`-2 to Social rolls ${isEnhanced ? "until Project completes" : "for one night"}.`);
         }},
        {name: "Options", displayName: "Options", category: null, value: 0, rarity: "C",
         action: (charRef, spot) => {
             ONNEXT.faceUp.push("WAIT:discard:confirm");
             ONNEXT.faceUp.push("WAIT:discard:confirm");
             if (STATE.REF.MAT[spot].isEnhanced) {
                 cardAlert(spot, "Draw twice, then discard one of them.<br>Reduce the value of the card you keep to zero.", null, " (Enhanced)");                    
                 ONNEXT.activate.push((keepSpot) => {
                     revalueCard(keepSpot, 0);
                     setCard(spot, "discard");
                 });
             } else {
                 cardAlert(spot, "Draw twice, then discard one of them.");                   
                 ONNEXT.activate.push((keepSpot) => {
                     setCard(spot, "discard");
                 });
             }
         },
         isNotUndoable: true
        },
        {name: "Overwhelmed", displayName: "Overwhelmed", category: "debilitation", value: 2, rarity: "U",
         afterAction: (charRef, spot, isEnhanced) => {                 
             Roller.AddCharEffect(charRef, "mental;-2;- Overwhelmed (<.>)");
             STATE.REF.endMessageQueue.push(`-2 to Mental rolls ${isEnhanced ? "until Project completes" : "for one night"}.`);
         }},
        {name: "Powderkeg", displayName: "Powderkeg", category: null, value: 1, rarity: "V",
         action: (charRef, spot) => {
             STATE.REF.MAT[spot].enhancedDraw = true;
             ONNEXT.activate.push((drawSpot) => {
                 setCard(drawSpot, "enhanced");
                 STATE.REF.MAT[spot].enhancedDraw = drawSpot; 
             });
             STATE.REF.MAT[spot].triggerIndex = ONNEXT.confirm.length - 1;
             cardAlert(spot, "Enhancing next draw.");
         },
         onEnhance: (charRef, spot) => {
             const randomSpot = getRandomSpot(["noEnhanced", "noNegated", "faceUp", spot]);
             if (VAL({number: randomSpot})) {
                 STATE.REF.MAT[spot].enhancedCard = randomSpot;
                 cardAlert(spot, [
                     "Randomly enhancing a drawn Complication:",
                     getCardName(randomSpot, true)
                 ].join("<br>"), null, " (Enhanced)");
                 setCard(randomSpot, "enhanced");
             }
         },
         undoAction: (charRef, spot) => {
             if (VAL({number: STATE.REF.MAT[spot].enhancedDraw})) {
                 const enhancedCard = STATE.REF.MAT[STATE.REF.MAT[spot].enhancedDraw];
                 if (enhancedCard && enhancedCard.isFaceUp && enhancedCard.isEnhanced && !enhancedCard.isNegated) {
                     setCard(STATE.REF.MAT[spot].enhancedDraw, "enhanced");
                     cardAlert(spot, `Unenhancing "${enhancedCard.displayName}".`, "Voiding ");
                 } 
             } else if (STATE.REF.MAT[spot].enhancedDraw === true) {
                 ONNEXT.activate[STATE.REF.MAT[spot].triggerIndex] = null;
                 cardAlert(spot, "No longer enhancing next draw.", "Voiding ");
             }       
             STATE.REF.MAT[spot].enhancedDraw = false;     
         },
         offEnhance: (charRef, spot) => {
             const enhancedSpot = STATE.REF.MAT[spot].enhancedCard;
             const enhancedCard = VAL({number: enhancedSpot}) && STATE.REF.MAT[enhancedSpot];
             if (enhancedCard && enhancedCard.isFaceUp && enhancedCard.isEnhanced && !enhancedCard.isNegated) {                        
                 cardAlert(spot, `Unenhancing "${enhancedCard.displayName}".`, "Unenhancing ");
                 setCard(enhancedSpot, "enhanced");
             }
             STATE.REF.MAT[spot].enhancedCard = false;
         }},
        {name: "Preoccupied", displayName: "Preoccupied", category: "debilitation", value: 1, rarity: "C",
         afterAction: (charRef, spot, isEnhanced) => {                 
             Roller.AddCharEffect(charRef, "social;-1;- Preoccupied (<.>)");
             STATE.REF.endMessageQueue.push(`-1 to Social rolls ${isEnhanced ? "until Project completes" : "for one night"}.`);
         }},
        {name: "ProlongedAbsence", displayName: "Prolonged Absence", category: null, value: 2, rarity: "U",
         afterAction: (charRef, spot, isEnhanced) => {
             STATE.REF.endMessageQueue.push(isEnhanced ? "Negate Domain Control until Project resolved." : "-1 Domain Control until Project resolved.");
         }},
        {name: "PyrrhicVictory", displayName: "Pyrrhic Victory", category: "project", value: 4, rarity: "R",
         afterAction: (charRef, spot, isEnhanced) => {
             STATE.REF.endMessageQueue.push(isEnhanced ? "Halve Project Scope and rewards." : "-1 to Project Scope and rewards.");
         }},
        {name: "RecklessGamble", displayName: "Reckless Gamble", category: "complication", value: 0, rarity: "U",
         action: (charRef, spot) => {
             cardAlert(spot, [
                 "Choose a Complication to negate.",
                 "Then, a random Complication will be enhanced."
             ].join("<br>"));
             ONNEXT.negated.push(() => {
                 const randomSpot = getRandomSpot(["noEnhanced", "noNegated", "faceUp", spot]);
                 if (VAL({number: randomSpot})) {
                     setCard(randomSpot, "enhanced");
                     cardAlert(spot, [
                         "Randomly enhancing a drawn Complication:",
                         getCardName(randomSpot, true)
                     ].join("<br>"));
                 }
             });
         },
         onEnhance: (charRef, spot) => {
             const randomSpot = getRandomSpot(["noEnhanced", "noNegated", "faceUp", spot]);
             if (VAL({number: randomSpot})) {
                 setCard(randomSpot, "enhanced");
                 cardAlert(spot, [
                     "Randomly enhancing a drawn Complication:",
                     getCardName(randomSpot, true)
                 ].join("<br>"), null, " (Enhanced)");
             }
             setCard(spot, "discard");
         }},
        {name: "RepeatMistakes", displayName: "Repeat Mistakes", category: null, value: 0, rarity: "R",
         action: (charRef, spot) => {
             STATE.REF.isRepeatMistakes = true;
             cardAlert(spot, "Duplicate categories allowed.");  
             buildDeck();
             refreshDraws(false, true);
         },
         onEnhance: (charRef, spot) => {
             ONALL.activate.push((checkSpot) => {
                 if (STATE.REF.MAT[checkSpot].category && getUsedCategories([checkSpot]).includes(STATE.REF.MAT[checkSpot].category))
                     revalueCard(STATE.REF.MAT[checkSpot].spot, 0);
             });
             STATE.REF.MAT[spot].triggerIndex = ONALL.activate.length - 1;              
             cardAlert(spot, "Devaluing duplicate categories.", null, " (Enhanced)");
         },
         undoAction: (charRef, spot) => {
             STATE.REF.isRepeatMistakes = false;
             cardAlert(spot, "Duplicate categories no longer allowed.");  
             buildDeck();
             refreshDraws(true);
         },
         offEnhance: (charRef, spot) => {
             ONALL.activate[STATE.REF.MAT[spot].triggerIndex] = null;
             cardAlert(spot, "No longer devaluing duplicate categories.");
         }},
        {name: "Reverie", displayName: "Reverie", category: null, value: 0, rarity: "R",
         action: (charRef, spot) => {
             cardAlert(spot, [
                 "Enter Memoriam at a difficulty of your choice.",
                 "If you succeed:",
                 "Set the value of \"Reverie\" to that difficulty."
             ].join("<br>"));
         },
         onEnhance: (charRef, spot) => {
             cardAlert(spot, [
                 "If the Memoriam triggered by \"Reverie\" failed:",
                 "Suffer a Total Failure."
             ].join("<br>"), null, " (Enhanced)");
         },
         isNotUndoable: true
        },
        {name: "RippleEffects", displayName: "Ripple Effects", category: "complication", value: 1, rarity: "U",
         action: (charRef, spot) => {
             ONNEXT.activate.push((zeroSpot) => {
                 revalueCard(zeroSpot, 0);
             });
             STATE.REF.MAT[spot].triggerIndex = ONNEXT.activate.length - 1;
             ONNEXT.activate.push((zeroSpot) => {
                 revalueCard(zeroSpot, 0);
             });
             cardAlert(spot, "Draw two Complications.");
         },
         onEnhance: (charRef, spot) => {
             ONNEXT.activate[STATE.REF.MAT[spot].triggerIndex] = (zeroSpot) => {
                 revalueCard(zeroSpot, 0);
                 setCard(zeroSpot, "enhanced");
             };
             cardAlert(spot, "Enhancing next draw.", null, "Enhanced");
         },
         isNotUndoable: true
        },
        {name: "RockyStart", displayName: "Rocky Start", category: null, value: -2, rarity: "U",
         action: (charRef, spot) => {
             if (STATE.REF.DISCARDS.length || _.filter(STATE.REF.MAT, x => !x.isFaceUp).length !== 9) {
                 D.Alert(D.JS({discard: STATE.REF.DISCARDS.length, MAT: _.filter(STATE.REF.MAT, x => !x.isFaceUp).length}));
                 cardAlert(spot, "Not your first Complication drawn: Discarding.");
                 setCard(spot, "discard");
             }
         },
         onEnhance: (charRef, spot) => {
             revalueCard(spot, -4);
         },
         offEnhance: (charRef, spot) => {
             revalueCard(spot, -2);
         }},
        {name: "SilentBeneficiary", displayName: "Silent Beneficiary", category: null, value: 1, rarity: "U",
         afterAction: (charRef, spot, isEnhanced) => {
             STATE.REF.endMessageQueue.push(isEnhanced ? "Reduce a random NPC Project Die to 1." : "Halve a random NPC Project Die.");
         }},
        // {name: "SimmeringResentment", displayName: "", category: null, value: -1, rarity: ""},
        {name: "SpreadThin", displayName: "Spread Thin", category: "debilitation", value: 1, rarity: "C",
         afterAction: (charRef, spot, isEnhanced) => {                 
             Roller.AddCharEffect(charRef, "mental;-1;- Spread Thin (<.>)");
             STATE.REF.endMessageQueue.push(`-1 to Mental rolls ${isEnhanced ? "until Project completes" : "for one night"}.`);
         }},
        {name: "TangledWebs", displayName: "Tangled Webs", category: "attention", value: 1, rarity: "R",
         afterAction: (charRef, spot, isEnhanced) => {
             STATE.REF.endMessageQueue.push(isEnhanced ? "Two NPCs form an alliance against you!" : "Two NPCs oppose your Project!");
         }},
        {name: "TheBeastAscendant", displayName: "The Beast Ascendant", category: "beast", value: 2, rarity: "U",
         afterAction: (charRef, spot, isEnhanced) => {
             Roller.AddCharEffect(charRef, "all;bestialcancelsucc;!The Beast Ascendant");
             STATE.REF.endMessageQueue.push("Bestial Dice cancel basic successes.");
             if (isEnhanced) {
                 Roller.AddCharEffect(charRef, "all;bestialcancelcrit;!The Beast Ascendant (Enhanced)");
                 STATE.REF.endMessageQueue.push("Bestial Dice cancel critical dice.");
             }
         }},
        {name: "TheBeastPerilous", displayName: "The Beast Perilous", category: "beast", value: 2, rarity: "U",
         afterAction: (charRef, spot, isEnhanced) => {
             // Roller.AddCharEffect(charRef, "all;bestialcancelsucc;!The Beast Ascendant")
             STATE.REF.endMessageQueue.push(`Must kill to reduce Hunger below ${isEnhanced ? 3 : 2}`);
         }},              
        {name: "TheBeastDespotic", displayName: "The Beast Despotic", category: "beast", value: 2, rarity: "R",
         afterAction: (charRef, spot, isEnhanced) => {
             STATE.REF.endMessageQueue.push(`Gain the 'Prey ${isEnhanced ? "RESTRICTION" : "Exclusion"}' Flaw.`);
         }},
        {name: "TheBeastInsatiable", displayName: "The Beast Insatiable", category: "beast", value: 1, rarity: "U",
         afterAction: (charRef, spot, isEnhanced) => {
             // Roller.AddCharEffect(charRef, "all;bestialcancelsucc;!The Beast Ascendant")
             STATE.REF.endMessageQueue.push("-1 Hunger slaked from mundane blood.");                 
         }},
        {name: "TheBeastInsensate", displayName: "The Beast Insensate", category: "beast", value: 2, rarity: "R",
         afterAction: (charRef, spot, isEnhanced) => {
             // Roller.AddCharEffect(charRef, "all;bestialcancelsucc;!The Beast Ascendant")
             STATE.REF.endMessageQueue.push("You do not benefit from resonance or dyscrasias.");                 
         }},
        {name: "TheBeastRampant", displayName: "The Beast Rampant", category: "beast", value: 2, rarity: "C",
         afterAction: (charRef, spot, isEnhanced) => {
             Roller.AddCharEffect(charRef, "messycrit;nowpreroll;!The Beast Rampant (No Reroll);once");
             STATE.REF.endMessageQueue.push("You cannot reroll your next Messy Critical.");
             if (isEnhanced) {
                 Roller.AddCharEffect(charRef, "messycrit;doublewpreroll;!The Beast Rampant (Costly Reroll)");
                 STATE.REF.endMessageQueue.push("Rerolling Messy Criticals costs 2 Willpower.");
             }
         }},
        {name: "TheBeastRavenous", displayName: "The Beast Ravenous", category: "beast", value: 2, rarity: "U",
         afterAction: (charRef, spot, isEnhanced) => {
             STATE.REF.endMessageQueue.push(`+ ${isEnhanced ? "2" : "1"} Hunger when testing for frenzy.`);
         }},
        {name: "TheBeastScorned", displayName: "The Beast Scorned", category: "beast", value: 2, rarity: "U",
         afterAction: (charRef, spot, isEnhanced) => {
             Roller.AddCharEffect(charRef, "all;nobloodsurge;!The Beast Scorned (No Blood Surge)");
             STATE.REF.endMessageQueue.push("You cannot use Blood Surge.");
             if (isEnhanced) {
                 Roller.AddCharEffect(charRef, "all;nodiscbonus;!The Beast Scorned (No Discipline Bonus)");                    
                 STATE.REF.endMessageQueue.push("You do not gain your Discipline Bonus.");
             }
         }},
        {name: "TheRuleOfThree", displayName: "The Rule of Three", category: "complication", value: 1, rarity: "U",
         action: (charRef, spot) => {
             if (STATE.REF.MAT[spot].isEnhanced) {
                 ONNEXT.faceUp.push("WAIT:discard:confirm");
                 ONNEXT.faceUp.push("WAIT:discard:confirm");
                 ONNEXT.faceUp.push("WAIT:discard:confirm");
                 cardAlert(spot, "Draw three. Discard one at random, then enhance the remaining two.", null, " (Enhanced)");      
                 ONNEXT.confirm.push(...[
                     (newSpot) => setCard(newSpot, "enhance"),
                     (newSpot) => setCard(newSpot, "enhance")
                 ]);
             } else { 
                 ONNEXT.faceUp.push("WAIT:discard:discard");
                 ONNEXT.faceUp.push("WAIT:discard:discard");
                 ONNEXT.faceUp.push("WAIT:discard:discard");
                 ONNEXT.discard.push("WAIT:discard:confirm");
                 cardAlert(spot, "Draw three, choose two to discard, then enhance the third.");  
                 ONNEXT.discard.push(() => {

                 });
             }

             /* ONNEXT.activate.push((keepSpot) => {
                        setCard(spot, "discard")
                    }) */
                
         },
         isNotUndoable: true},
        {name: "Tilted", displayName: "Tilted", category: "debilitation", value: 1, rarity: "C",
         afterAction: (charRef, spot, isEnhanced) => {                 
             Roller.AddCharEffect(charRef, "physical;-1;- Tilted (<.>)");
             STATE.REF.endMessageQueue.push(`-1 to Physical rolls ${isEnhanced ? "until Project completes" : "for one night"}.`);
         }},
        // {name: "Triage", displayName: "", category: null, value: -1, rarity: ""},
        {name: "TunnelVision", displayName: "Tunnel Vision", category: "complication", value: 1, rarity: "U",
         action: (charRef, spot) => {
             const randomSpot = getRandomSpot(["faceUp", "noValue0", spot]);                 
             if (VAL({number: randomSpot})) {
                 revalueCard(randomSpot, 0);
                 cardAlert(spot, [
                     "Devaluing a random drawn Complication:",
                     getCardName(randomSpot, true)
                 ].join("<br>"));
             }
         },
         onEnhance: (charRef, spot) => {                 
             const randomSpot = getRandomSpot(["faceUp", "noValue0", "maxValue", spot]);
             if (VAL({number: randomSpot})) {
                 revalueCard(randomSpot, 0);
                 cardAlert(spot, [
                     "Devaluing your most valuable Complication:",
                     getCardName(randomSpot, true)
                 ].join("<br>"));
             }
         }},
        {name: "UnderTheBus", displayName: "Under the Bus", category: null, value: 1, rarity: "U",
         action: (charRef, spot) => {
             ONNEXT.activate.push((zeroSpot) => {
                 revalueCard(zeroSpot, 0);
             });
             STATE.REF.MAT[spot].triggerIndex = ONNEXT.activate.length - 1;
             cardAlert(spot, [
                 "Choose another coterie member.",
                 "They must draw and resolve a Complication.",
                 "(Its value won't contribute to your total.)"
             ].join("<br>"));
         },
         onEnhance: (charRef, spot) => {
             ONNEXT.activate[STATE.REF.MAT[spot].triggerIndex] = (zeroSpot) => {
                 revalueCard(zeroSpot, 0);
                 setCard(zeroSpot, "enhanced");
             };
             cardAlert(spot, "Enhancing your coterie-mate's Complication.", null, " (Enhanced)");
         }},
        {name: "UnfinishedBusiness", displayName: "Unfinished Business", category: null, value: 0, rarity: "U",
         action: (charRef, spot) => {
             STATE.REF.MAT[spot].dupeList = STATE.REF.MAT.filter(x => x.isDuplicated).map((x, i) => i);
             cardAlert(spot, "Duplicate another Complication of your choice.");
             // HOLDUNTIL = ["duplicate"]
         },
         onEnhance: (charRef, spot) => {               
             ONNEXT.duplicate.push((dupeSpot) => {
                 setCard(dupeSpot, "enhanced");
             });
             cardAlert(spot, "Enhancing the chosen Complication.", null, " (Enhanced)");
         }},
        {name: "WeightOfTheWorld", displayName: "Weight of the World", category: "debilitation", value: 2, rarity: "U",
         afterAction: (charRef, spot, isEnhanced) => {                 
             Roller.AddCharEffect(charRef, "physical;-2;- Weight of the World (<.>)");
             STATE.REF.endMessageQueue.push(`-2 to Physical rolls ${isEnhanced ? "until Project completes" : "for one night"}.`);
         }},
    ];
        /* eslint-enable no-unused-vars */
    const CARDQTYS = {V: 12, C: 6, U: 3, R: 1, overrides: []};
    const CARDNAMES = _.values(CARDS).map(x => x.name);
    let DELAYQUEUE = [];
    // #endregion

    // #region GETTERS: Active card names
    const getCardQtyForDeck = card => CARDQTYS[card.rarity] + CARDQTYS.overrides.map(x => x.check(card) ? x.qty : 0).reduce((tot, x) => tot + x, 0);
    const getActiveCards = () => _.filter(STATE.REF.MAT, v => isCardActive(v));
    const getUsedCategories = (omitSpots = []) => _.uniq(_.compact(_.map(getActiveCards(), v => !omitSpots.includes(v.spot) && v.category)));
    const isCardValidForDeck = card => VAL({list: card}) && card.name && (STATE.REF.isRepeatMistakes || !getUsedCategories().includes(card.category)) && !_.map(getActiveCards(), v => v.name).includes(card.name);
    const isCardActive = card => VAL({list: card}) && card.isFaceUp && !card.isNegated;
    const getCardName = (spot, isReturningFullName = false) => isReturningFullName && STATE.REF.MAT[spot].displayName || STATE.REF.MAT[spot].name;
    const getRandomSpot = (modes) => {
        const validSpots = [];
        for (let i = 0; i < STATE.REF.MAT.length; i++) {
            const card = STATE.REF.MAT[i];
            let isThisCardValid = true;
            for (const mode of modes) {
                switch (mode) {
                    case "maxValue": 
                        if (card.value < Math.max(...STATE.REF.MAT.map(x => x.value)))
                            isThisCardValid = false;
                        break;
                    case "isUndoable":
                        if (card.isNotUndoable)
                            isThisCardValid = false;
                        break;
                    case "noEnhanced":
                        if (card.isEnhanced)
                            isThisCardValid = false;
                        break;
                    case "noNegated":
                        if (card.isNegated)
                            isThisCardValid = false;
                        break;                            
                    case "noLastDrawn":                            
                        if (i === STATE.REF.lastDraw)
                            isThisCardValid = false;
                        break;                            
                    case "noDuplicated":
                        if (card.isDuplicated)
                            isThisCardValid = false;
                        break;
                    case "faceUp":
                        if (!card.isFaceUp && !card.isDiscarded)
                            isThisCardValid = false;
                        break;
                    default:
                        if (i === mode)
                            isThisCardValid = false;
                        else if (VAL({string: mode}) && `${mode}`.startsWith("noValue") && card.value === D.Int(mode.replace(/\w/gu, "")))
                            isThisCardValid = false;
                        break;
                }
                if (!isThisCardValid)
                    break;
            }
            if (isThisCardValid)
                validSpots.push(i);
        }
        const returnSpot = validSpots.length && _.sample(validSpots);
        DB({validSpots, returnSpot}, "getRandomSpot");
        return returnSpot;
    };
    const cardAlert = (spot, message, preTitle, postTitle) => {
        const cardName = getCardName(spot, true);
        const title = `${preTitle || ""}${cardName}${postTitle || ""}`;
        D.Chat("all", C.HTML.Block([
            C.HTML.Header(title),
            C.HTML.Body(message)
        ].join("")), undefined, D.RandomString(3));
    };
    const getCardStats = () => {
        const cardData = {
            V: [],
            C: [],
            U: [],
            R: []
        };
        for (const card of CARDS)
            cardData[card.rarity].push(card.name);
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
        ].join("<br>"), "Complications Data");
    };
        // #endregion

    // #region CARD ACTIVATION: Turning Over & Activating Cards, Deactivating Cards
    const flipCard = spot => {
        if (STATE.REF.isRunning) {
            const card = STATE.REF.MAT[spot];
            if (card && card.isFaceUp) {
                setCard(spot, "faceDown");
            } else if (card) {
                setCard(spot, "faceUp");
                STATE.REF.lastDraw = spot;
            }
            refreshDraws();
        }
    };
        // #endregion

    // #region CARD CONTROL: Deck construction, sandbox manipulation
    const setCardFuncs = [];
    const dealRandomCard = (spot, isShowingFX = true) => {
        if (isShowingFX)
            blinkCard(spot);           
        STATE.REF.MAT[spot] = _.clone(_.sample(STATE.REF.DECK));
        STATE.REF.MAT[spot].spot = spot;
        setCard(spot, "faceDown");
    };
    const setCard = (spot, mode, isShowingFX = true) => {
        setCardFuncs.push(`${mode} ${getCardName(spot)}`);
        Media.ToggleImg(`CompSpot_${spot+1}`, true);
        Media.ToggleImg(`CompCard_Base_${spot+1}`, true);
        Media.ToggleImg(`CompCard_Text_${spot+1}`, false);
        const card = STATE.REF.MAT[spot];
        const onNextMode = mode.replace(/-?\d/gu, "");
        if (card && CARDNAMES.includes(card.name)) {
            Media.SetText(`CompCard_Name_${spot+1}`, card.name);
            Media.SetImg(`CompCard_Text_${spot+1}`, card.name); 
        }
        const waitCallIndex = ONNEXT[onNextMode].findIndex(x => VAL({string: x}) && x.includes("WAIT"));
        const delayedCardIndices = DELAYQUEUE.map((x, i) => [x, i]).filter(x => VAL({array: x[0]}) && x[0][0].includes(onNextMode) && x[0][2] !== spot).map(x => x[1]);
        const nextFuncIndex = ONNEXT[onNextMode].map((x, i) => [x, i]).filter(x => VAL({function: x[0]})).map(x => x[1]).shift();
        const allFuncs = ONALL[onNextMode].filter(x => VAL({function: x}));
        let nextMode = null;
        DB([
            `<b>[${mode}] <u>${getCardName(spot)}</u> @ ${spot}</b>`,
            "**********************************************************",
            `ONNEXT[${onNextMode}] (wait index: ${waitCallIndex}): ${D.JS(ONNEXT[onNextMode])}`,
            `ONNEXT Function Indices: ${D.JS(nextFuncIndex)}`,
            `DELAYQUEUE (ALL): ${D.JS(DELAYQUEUE)}`,
            `DELAYQUEUE (Filtered Indices): ${D.JS(delayedCardIndices)}`
        ].join("<br>"), `setCard${["replace", "faceDown"].includes(mode) ? mode : ""}`);

        if (mode === "discard")
            card.isDiscarded = true;

        while (delayedCardIndices.length) {
            // DB(`Setting delayed Card (${delayedCardIndices.length} left): ${D.JS(DELAYQUEUE[delayedCardIndices[0]])}`, "setCard")
            const delayedCardIndex = delayedCardIndices.shift();
            const delayedCard = _.clone(DELAYQUEUE[delayedCardIndex]);
            DELAYQUEUE[delayedCardIndex] = null;
                
            if (delayedCard[1] !== onNextMode) {
                DB([
                    ">>> ------------ ",
                    `>>> DELAYED CARDS: ${delayedCardIndices.length + 1}`,
                    `>>> >>> SETTING ${getCardName(delayedCard[2])} @ ${delayedCard[2]} (${D.JS(delayedCard)})`,
                    `>>> NEW DELAY QUEUE: ${D.JS(DELAYQUEUE)}`,
                    ">>> ============ "
                ].join("<br>"), "setCard");          
                setCard(delayedCard[2], delayedCard[1]);
            } else {                    
                DB([
                    ">>> ------------ ",
                    `>>> DELAYED CARDS: ${delayedCardIndices.length + 1}`,
                    `>>> >>> <u><b>SKIPPING</b></u> ${getCardName(delayedCard[2])} @ ${delayedCard[2]} (${D.JS(delayedCard)})`,
                    `>>> >>> >>> ... b/c ${delayedCard[2]} === ${onNextMode}`,
                    `>>> NEW DELAY QUEUE: ${D.JS(DELAYQUEUE)}`,
                    ">>> ============ "
                ].join("<br>"), "setCard");    
            }
        }

        /* if (setCardFuncs.length >= 100) {
                D.Alert(`Threshold Met! ${D.JS(setCardFuncs)}`)
                return
            } */  
        if (mode !== "discard" && card.isDiscarded)
            return;

        switch (mode) {
            case "discard": {
                if (card.isActivated) {
                    setCompVals("add", -card.value);
                    if (card.isEnhanced && card.offEnhance && card.enhanceTriggered) {
                        card.offEnhance(STATE.REF.charRef, spot);
                        card.enhanceTriggered = false;
                    }
                    if (card.undoAction && card.actionTriggered) {
                        card.undoAction(STATE.REF.charRef, spot);
                        card.actionTriggered = false;
                    }
                }
                card.isDiscarded = true;
                DELAYQUEUE = DELAYQUEUE.map(x => x && x[2] === spot ? null : x);
                STATE.REF.DISCARDS.push(STATE.REF.MAT[spot]);
                Media.SetText("CompCardsDiscarded", D.JSL(D.Int(STATE.REF.DISCARDS.length)));
            }
            /* falls through */
            case "replace": {
                DB(`Discarded or Replaced.<br>== <b>FINISHED [${mode}] <u>${getCardName(spot)}</u> @ ${spot}</b> ====`, "setCard");
                dealRandomCard(spot, isShowingFX);
                return; // Needto return, since this card no longer exists after dealRandomCard called.
            }
            case "faceDown": {
                Media.ToggleImg(`CompCard_Negated_${spot+1}`, false);
                Media.ToggleImg(`CompCard_Revalue_${spot+1}`, false);
                DragPads.Toggle(Media.GetImgData(`CompSpot_${spot+1}`).id, true);
                Media.SetImg(`CompCard_Base_${spot+1}`, "cardBack");  
                if (card.isFaceUp) {
                    setCompVals("add", -card.value);
                    if (card.isEnhanced && card.offEnhance && card.enhanceTriggered) {
                        card.offEnhance(STATE.REF.charRef, spot);
                        card.enhanceTriggered = false;
                    }
                    if (card.undoAction && card.actionTriggered) {
                        card.undoAction(STATE.REF.charRef, spot);
                        card.actionTriggered = false;
                    }
                    card.isActivated = false;
                }
                card.isFaceUp = false;                    
                card.isEnhanced = false;
                card.isNegated = false;
                if (waitCallIndex >= 0) {
                    DELAYQUEUE.push([...ONNEXT[onNextMode][waitCallIndex].split(":").slice(1), spot]);
                    ONNEXT[onNextMode][waitCallIndex] = null;
                    DB(`Waiting @ "FACEDOWN"<br>DELAYQUEUE: ${D.JS(DELAYQUEUE)}<br>ONNEXT[${onNextMode}]: ${D.JS(ONNEXT[onNextMode])}<br>== <b>FINISHED [${mode}] <u>${getCardName(spot)}</u> @ ${spot}</b> ====`, "setCard");
                    break;
                }
                break;
            }
            case "faceUp": {
                Media.ToggleImg(`CompCard_Text_${spot+1}`, true);
                Media.ToggleImg(`CompCard_Negated_${spot+1}`, false);
                Media.ToggleImg(`CompCard_Revalue_${spot+1}`, false);
                DragPads.Toggle(Media.GetImgData(`CompSpot_${spot+1}`).id, false);
                Media.SetImg(`CompCard_Base_${spot+1}`, "base");
                card.isFaceUp = true;
                card.isEnhanced = false;
                card.isNegated = false;
                if (waitCallIndex >= 0) {
                    DELAYQUEUE.push([...ONNEXT[onNextMode][waitCallIndex].split(":").slice(1), spot]);
                    ONNEXT[onNextMode][waitCallIndex] = null;
                    DB(`Waiting @ "FACEUP"<br>DELAYQUEUE: ${D.JS(DELAYQUEUE)}<br>ONNEXT[${onNextMode}]: ${D.JS(ONNEXT[onNextMode])}<br>== <b>FINISHED [${mode}] <u>${getCardName(spot)}</u> @ ${spot}</b> ====`, "setCard");
                    break;
                }
                nextMode = "activate";
                break;   
            }
            case "confirm": {
                if (waitCallIndex >= 0) {
                    DELAYQUEUE.push([...ONNEXT[onNextMode][waitCallIndex].split(":").slice(1), spot]);
                    ONNEXT[onNextMode][waitCallIndex] = null;
                    DB(`Waiting @ "CONFIRM"<br>DELAYQUEUE: ${D.JS(DELAYQUEUE)}<br>ONNEXT[${onNextMode}]: ${D.JS(ONNEXT[onNextMode])}<br>== <b>FINISHED [${mode}] <u>${getCardName(spot)}</u> @ ${spot}</b> ====`, "setCard");
                    break;
                }
                nextMode = "activate";
                break;
            }
            case "activate": {                      
                Media.ToggleImg(`CompCard_Text_${spot+1}`, true);
                setCompVals("add", card.value);
                card.isActivated = true;
                DB(`Activating ${card.name} ...`, "setCard");
                if (card.action) {
                    DB("... Action Detected, Triggering ...", "setCard");
                    card.action(STATE.REF.charRef, spot);
                    card.actionTriggered = true;
                }
                if (card.isEnhanced)
                    setCard(spot, "enhanced");                                        
                if (waitCallIndex >= 0) {
                    DELAYQUEUE.push([...ONNEXT[onNextMode][waitCallIndex].split(":").slice(1), spot]);
                    ONNEXT[onNextMode][waitCallIndex] = null;
                    DB(`Waiting @ "ACTIVATE"<br>DELAYQUEUE: ${D.JS(DELAYQUEUE)}<br>ONNEXT[${onNextMode}]: ${D.JS(ONNEXT[onNextMode])}<br>== <b>FINISHED [${mode}] <u>${getCardName(spot)}</u> @ ${spot}</b> ====`, "setCard");
                    break;
                }
                break;
            }
            case "enhanced": {
                Media.ToggleImg(`CompCard_Text_${spot+1}`, true);
                Media.SetImg(`CompCard_Base_${spot+1}`, "enhanced");
                DragPads.Toggle(Media.GetImgData(`CompSpot_${spot+1}`).id, false);
                card.isEnhanced = true;
                // DB(`Enhancing ${card.name}: ${D.JS(card)}`, "setCard")
                if (!card.enhanceTriggered && card.onEnhance) {
                    card.onEnhance(STATE.REF.charRef, spot);
                    card.enhanceTriggered = true;
                }
                if (waitCallIndex >= 0) {
                    DELAYQUEUE.push([...ONNEXT[onNextMode][waitCallIndex].split(":").slice(1), spot]);
                    ONNEXT[onNextMode][waitCallIndex] = null;
                    DB(`Waiting @ "ENHANCED"<br>DELAYQUEUE: ${D.JS(DELAYQUEUE)}<br>ONNEXT[${onNextMode}]: ${D.JS(ONNEXT[onNextMode])}<br>== <b>FINISHED [${mode}] <u>${getCardName(spot)}</u> @ ${spot}</b> ====`, "setCard");
                    break;
                }      
                break;
            }
            case "!enhanced": {
                Media.ToggleImg(`CompCard_Text_${spot+1}`, true);
                Media.SetImg(`CompCard_Base_${spot+1}`, "base");
                STATE.REF.MAT[spot].isEnhanced = false;
                if (card.offEnhance && card.enhanceTriggered) {
                    card.offEnhance(STATE.REF.charRef, spot);
                    card.enhanceTriggered = false;
                }
                break;
            }
            case "negated": {
                Media.ToggleImg(`CompCard_Text_${spot+1}`, true);
                Media.ToggleImg(`CompCard_Negated_${spot+1}`, true);
                STATE.REF.MAT[spot].isNegated = true;
                if (card.undoAction && card.actionTriggered) {
                    card.undoAction(STATE.REF.charRef, spot);
                    card.actionTriggered = false;
                }
                if (card.isEnhanced && card.offEnhance && card.enhanceTriggered) {
                    card.offEnhance(STATE.REF.charRef, spot);
                    card.enhanceTriggered = false;
                }
                if (waitCallIndex >= 0) {
                    DELAYQUEUE.push([...ONNEXT[onNextMode][waitCallIndex].split(":").slice(1), spot]);
                    ONNEXT[onNextMode][waitCallIndex] = null;
                    DB(`Waiting @ "NEGATED"<br>DELAYQUEUE: ${D.JS(DELAYQUEUE)}<br>ONNEXT[${onNextMode}]: ${D.JS(ONNEXT[onNextMode])}<br>== <b>FINISHED [${mode}] <u>${getCardName(spot)}</u> @ ${spot}</b> ====`, "setCard");
                    break;
                }      
                break;
            }
            case "!negated": {
                Media.ToggleImg(`CompCard_Text_${spot+1}`, true);
                Media.ToggleImg(`CompCard_Negated_${spot+1}`, false);
                STATE.REF.MAT[spot].isNegated = false;
                if (card.action && !card.actionTriggered) {
                    card.action(STATE.REF.charRef, spot);
                    card.actionTriggered = true;
                }
                if (card.isEnhanced && card.onEnhance && !card.enhanceTriggered) {
                    card.onEnhance(STATE.REF.charRef, spot);
                    card.enhanceTriggered = true;
                }
                break;
            }
            case "blank": {
                Media.ToggleImg(`CompCard_Base_${spot+1}`, false);
                Media.ToggleImg(`CompCard_Negated_${spot+1}`, false);
                Media.ToggleImg(`CompCard_Revalue_${spot+1}`, false);
                DragPads.Toggle(Media.GetImgData(`CompSpot_${spot+1}`).id, false);
                STATE.REF.MAT[spot].isEnhanced = false;
                STATE.REF.MAT[spot].isNegated = false;
                break;
            }
            default: {
                if (mode.includes("revalue")) {
                    Media.ToggleImg(`CompCard_Text_${spot+1}`, true);
                    if (mode.startsWith("!")) {
                        Media.ToggleImg(`CompCard_Revalue_${spot+1}`, false);
                        delete card.origValue;
                    } else {
                        const newValue = `${D.Int(mode.match(/-?\d+$/gu).pop())}`;
                        Media.ToggleImg(`CompCard_Revalue_${spot+1}`, true);
                        Media.SetImg(`CompCard_Revalue_${spot+1}`, newValue);
                    }
                }
                if (waitCallIndex >= 0) {
                    DELAYQUEUE.push([...ONNEXT[onNextMode][waitCallIndex].split(":").slice(1), spot]);
                    ONNEXT[onNextMode][waitCallIndex] = null;
                    DB(`Waiting @ "DEFAULT"<br>DELAYQUEUE: ${D.JS(DELAYQUEUE)}<br>ONNEXT[${onNextMode}]: ${D.JS(ONNEXT[onNextMode])}<br>== <b>FINISHED [${mode}] <u>${getCardName(spot)}</u> @ ${spot}</b> ====`, "setCard");
                    break;
                }      
                break;
            }
        }


        if (nextFuncIndex || nextFuncIndex === 0) {
            const nextFunc = [...ONNEXT[onNextMode]][nextFuncIndex];
            DB(`@@@@@@@@@@@@@@@@@@@@@@<br><b><u>NEXT FUNCTION for ${getCardName(spot)} at ${mode}...<br>`, "setCard");
            // DB({onNextMode, ONNEXT: ONNEXT[onNextMode], nextFuncIndex, nextFunc}, "setCard")
            ONNEXT[onNextMode][nextFuncIndex] = null;
            if (VAL({function: nextFunc}))
                nextFunc(spot);
            DB(`@@@@@@@@<br><b><u>FINISHED NEXT FUNCTION for ${getCardName(spot)} at ${mode} @@@@`, "setCard");
        }
        for (const allFunc of allFuncs)
            allFunc(spot);
                
        DB([
            `ONNEXT[${onNextMode}] (wait index: ${waitCallIndex}): ${D.JS(ONNEXT[onNextMode])}`,
            `ONNEXT Function Indices: ${D.JS(nextFuncIndex)}`,
            `DELAYQUEUE (ALL): ${D.JS(DELAYQUEUE)}`,
            `DELAYQUEUE (Filtered Indices): ${D.JS(delayedCardIndices)}`,
            `== <b>FINISHED [${mode}] <u>${getCardName(spot)}</u> @ ${spot}</b> ====`,
            nextMode && `>>> PROCEEDING TO ${D.JS(nextMode)} >>>>>>>>>>>>` || "======================"
        ].join("<br>"), `setCard${["replace", "faceDown"].includes(mode) ? mode : ""}`);

        if (nextMode)
            setCard(spot, nextMode);
             
    };    
    const buildDeck = () => {
        STATE.REF.DECK = [];
        STATE.REF.totalCards = CARDS.map(x => getCardQtyForDeck(x)).reduce((tot, x) => tot + x, 0);
        // STEP ONE: Filter master cardlist to contain only valid cards (i.e. no undefined cards, no duplicates and no duplicate categories)
        const validCards = _.filter(CARDS, v => isCardValidForDeck(v));
        // STEP TWO: Go through valid cards and add the proper number to the deck, subtracting discards.
        for (let i = 0; i < validCards.length; i++) {
            const qty = Math.max(0, getCardQtyForDeck(validCards[i]) - _.filter(STATE.REF.DISCARDS, v => v.name === validCards[i].name).length);
            for (let ii = 0; ii < qty; ii++)
                STATE.REF.DECK.push(validCards[i]);            
        }
        Media.SetText("CompCardsRemaining", `${STATE.REF.DECK.length}`);            
        Media.SetText("CompCardsExcluded", `${STATE.REF.totalCards - STATE.REF.DECK.length - STATE.REF.DISCARDS.length - STATE.REF.MAT.filter(x => x.isFaceUp).length }`);            
        Media.SetText("CompCardsDiscarded", `${STATE.REF.DISCARDS.length}`); 
    };
    const blinkCard = spot => {
        STATE.REF.FXQUEUE.push(Media.GetImgData(`CompCard_Base_${spot+1}`));
        const flashCard = () => { 
            const spotData = STATE.REF.FXQUEUE.pop();
            D.RunFX("compCardBlink", {left: spotData.left, top: spotData.top});
        };
        setTimeout(flashCard, 500 + 300 * STATE.REF.FXQUEUE.length);
    };
    const dupeCard = spot => {
        spot = spot === "LAST" ? STATE.REF.lastDraw : spot;
        if (VAL({number: spot}, "dupeCard")) {
            const card = STATE.REF.MAT[spot];
            if (card)
                if (card.isDuplicated) {
                    Media.SetImgTemp(`CompSpot_${spot+1}`, {tint_color: "transparent"});
                    card.isDuplicated = false;
                } else {
                    Media.SetImgTemp(`CompSpot_${spot+1}`, {tint_color:"#0000FF"});
                    card.isDuplicated = true;
                }
        }
        return spot;
    };     
    const revalueCard = (spot = 0, value = 0) => {
        spot = spot === "LAST" ? STATE.REF.lastDraw : spot;
        const card = STATE.REF.MAT[spot];
        if (card) {
            if (card.origValue === value) {
                setCard(spot, "!revalue");
                delete card.origValue;
            } else {
                setCard(spot, `revalue${value}`);
                card.origValue = card.value;
            }
            setCompVals("add", value - card.value);
            STATE.REF.MAT[spot].value = value;
        }
        return spot;
        sendGMPanel();
    };        
    const refreshDraws = (isShowingFX = true, isForcingRefresh = false) => {
        buildDeck();
        for (let i = 0; i < 10; i++) {
            const card = STATE.REF.MAT[i];
            if (card && card.isFaceUp)
                continue;
            else if (isForcingRefresh || !isCardValidForDeck(card))
                setCard(i, "replace", isShowingFX);
                // Media.SetImg(`CompSpot_${i+1}`, "cardBack")
        }
    };

    // #endregion
    // #region SETTERS: Setting card values, target numbers, activating Complication system
    const setCompVals = (mode, value) => {
        switch (mode) {
            case "target": {
                STATE.REF.targetVal = value;
                Media.SetText("CompTarget", `${STATE.REF.targetVal}`);
                break;
            }
            case "current": {
                STATE.REF.currentVal = 0;
            } /* falls through */
            case "add": case "addVal": case "addValue": {
                STATE.REF.currentVal += value;
                Media.SetText("CompCurrent", `${STATE.REF.currentVal}`);
                break;
            }
                // no default
        }
        STATE.REF.remainingVal = STATE.REF.targetVal - STATE.REF.currentVal;
        Media.SetText("CompRemaining", `${STATE.REF.remainingVal <= 0 ? "+" : "-"}${Math.abs(STATE.REF.remainingVal)}`, true);
        if (STATE.REF.remainingVal <= 0) {
            Media.SetTextData("CompCurrent", {color: C.COLORS.tan});
            Media.SetTextData("CompRemaining", {color: C.COLORS.tan});
        } else {
            Media.SetTextData("CompCurrent", {color: C.COLORS.crimson});
            Media.SetTextData("CompRemaining", {color: C.COLORS.crimson});
        }
    };
    const resetComplication = (isRefreshing = true, startVal = 0) => {
        STATE.REF.DECK = [];
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
        ];
        STATE.REF.DISCARDS = [];
        for (const [mode] of Object.entries(ONNEXT)) {
            ONNEXT[mode] = [];
            ONALL[mode] = [];
        }
        DELAYQUEUE = [];
        setCompVals("current", 0);
        setCompVals("target", startVal);
        if (isRefreshing)
            refreshDraws(false);
                
    };
    const startComplication = startVal => {   
        STATE.REF.endMessageQueue = [];
        STATE.REF.isRunning = false;
        Session.ChangeMode("Complications");
        D.Queue(resetComplication, [true, startVal], "Comp", 1);
        D.Queue(sendGMPanel, [], "Comp", 0.5);
        D.Run("Comp");
    };        
    const endComplication = (isLaunchingProject, isQueingActions = true) => {
        DB({isLaunchingProject, isQueingActions}, "endComplication");
        STATE.REF.isRunning = false;
        if (isQueingActions)
            for (const card of getActiveCards().filter(x => x.afterAction)) {
                D.Queue(card.afterAction, [STATE.REF.charRef, card.spot, card.isEnhanced], "Comp", 0.5);
                if (card.isDuplicated)
                    D.Queue(card.afterAction, [STATE.REF.charRef, card.spot, card.isEnhanced], "Comp", 0.5);
            }
        D.Queue(sendEndMsgQueue, [STATE.REF.charRef], "Comp", 3);
        if (isLaunchingProject) {
            const margin = STATE.REF.currentVal - STATE.REF.targetVal;
            const scope = Roller.Commit - 1 + Roller.Margin;
            D.Queue(Char.LaunchProject, [STATE.REF.currentVal - STATE.REF.targetVal, "COMPLICATION"], "Comp", 0.5);
            D.Queue(D.Chat, ["all", C.HTML.Block([
                C.HTML.Header("Launching Project"),
                C.HTML.Body([
                    `Launch Margin: ${margin >= 0 && "+" || "-"}${Math.abs(margin)}&nbsp;&nbsp;&nbsp;&nbsp;Project Scope: ${scope}`,
                    `Required Stake: ${Math.max(0, scope + 1 - margin)}`
                ].join("<br>"))
            ].join(""))], "Comp", 2);
        } 
        D.Queue(resetComplication, [false], "Comp", 0.5);   
        D.Queue(Session.ChangeMode, [Session.LastMode], "Comp", 0.5);
        D.Run("Comp");
    };
    const sendEndMsgQueue = (charRef) => {
        // D.Alert(`End Message Queue: ${D.JS(STATE.REF.endMessageQueue)}`)
        if (STATE.REF.endMessageQueue.length) {
            // D.Alert("Sending End Messages!")
            const messageLines = [];
            for (const message of STATE.REF.endMessageQueue) 
                if (message.charAt(0) === "!") 
                    messageLines.push(C.HTML.Body(message.slice(1), {color: C.COLORS.green}));
                else
                    messageLines.push(C.HTML.Body(message));
                
            D.Chat(charRef, C.HTML.Block([
                C.HTML.Title("COMPLICATION RESULTS", {fontSize: "28px"}),
                C.HTML.Header("Endure the Following:"),
                messageLines.join(""),
                C.HTML.Header("Thank you for playing!", {margin: "8px 0px 0px 0px"})
            ]));
        }
    };
    const sendGMPanel = () => {
        // if (D.IsMenuStored("ComplicationsControl")) {
        //     D.CommandMenu({}, null, "ComplicationsControl")
        // } else {
        const subPanels = [];
        const getColor = (action, spot) => {
            if (["LAST", "RANDOM"].includes(spot))
                return C.COLORS[{
                    discard: "brightred",
                    enhance: "brightpurple",
                    negate: "blue",
                    revalue: "darkgreen",
                    duplicate: "midgold"
                }[action]];
            const card = STATE.REF.MAT[spot];
            switch (action) {
                case "discard":
                    if (card.isFaceUp)
                        return C.COLORS.brightred;
                    break;
                case "enhance":
                    if (card.isFaceUp && !card.isEnhanced)
                        return C.COLORS.brightpurple;
                    else if (card.isEnhanced)
                        return C.COLORS.grey;
                    break;
                case "negate":
                    if (card.isFaceUp && !card.isNegated)
                        return C.COLORS.blue;
                    else if (card.isNegated)
                        return C.COLORS.brightgrey;
                    break;
                case "revalue":
                    if (card.isFaceUp)
                        return C.COLORS.darkgreen;
                    break;
                case "duplicate":
                    if (card.isFaceUp && !card.isDuplicated)
                        return C.COLORS.midgold;
                    else if (card.isDuplicated)
                        return C.COLORS.brightgrey;
                    break;
                            // no default
            }
            return C.COLORS.darkgrey;
        };
        for (const actionType of ["discard", "enhance", "negate", "revalue", "duplicate", "confirm"])
            subPanels.push({
                title: actionType,
                rows: [
                    {
                        type: "Header",
                        contents: D.Capitalize(actionType)
                    },
                    {
                        type: "ButtonLine",
                        contents: [1, 2, 3, 4, 5].map(x => ({name: x, command: `!comp ${actionType} ${x}`, styles: {width: "16%", bgColor: getColor(actionType, x-1)}})) // , fontSize: "10px", bgColor: C.COLORS.purple, buttonTransform: "none"}}))
                    },
                    {
                        type: "ButtonLine",
                        contents: [6, 7, 8, 9, 10].map(x => ({name: x, command: `!comp ${actionType} ${x}`, styles: {width: "16%", bgColor: getColor(actionType, x-1)}})) // , fontSize: "10px", bgColor: C.COLORS.purple, buttonTransform: "none"}}))
                    },
                    {
                        type: "ButtonLine",
                        contents: ["LAST", "RANDOM"].map(x => ({name: x, command: `!comp ${actionType} ${D.LCase(x)}`})) // , fontSize: "10px", bgColor: C.COLORS.purple, buttonTransform: "none"}}))
                    }
                ]
            });            
        D.CommandMenu({title: "Complications Control", rows: [
            {type: "ButtonLine", contents: [{name: "Unlock", command: "!comp unlock"}]},
            ..._.values(_.groupBy(subPanels, (x, i) => Math.floor(i / 2))).map(x => ({type: "Column", contents: x, style: {width: "47%", margin: "0px 1% 0% 1%"}})),
            {type: "ButtonLine", contents: [{name: "Finish", command: "!comp end false true"}, {name: "Launch!", command: "!comp end true true"}]}
        ]}, null, "ComplicationsControl");
        // }
    };
    const promptCardVal = (cardSpot) => {
        if (VAL({number: cardSpot})) 
        // if (D.IsMenuStored("PromptCardValue"))
        //     D.CommandMenu({}, null, "PromptCardValue")
        // else
            D.CommandMenu({title: "Set Card Value", rows: [
                {type: "ButtonLine", contents: [                        
                    {name: 0, command: `!comp setvalue ${cardSpot+1} 0`},
                    {name: 1, command: `!comp setvalue ${cardSpot+1} 1`},
                    {name: 2, command: `!comp setvalue ${cardSpot+1} 2`},
                    {name: 3, command: `!comp setvalue ${cardSpot+1} 3`},
                    {name: 4, command: `!comp setvalue ${cardSpot+1} 4`}
                ], buttonStyles: {width: "16%"}},                    
                {type: "ButtonLine", contents: [                        
                    {name: 5, command: `!comp setvalue ${cardSpot+1} 5`},
                    {name: 6, command: `!comp setvalue ${cardSpot+1} 6`},
                    {name: 7, command: `!comp setvalue ${cardSpot+1} 7`},
                    {name: 8, command: `!comp setvalue ${cardSpot+1} 8`},
                    {name: 9, command: `!comp setvalue ${cardSpot+1} 9`},
                    {name: 10, command: `!comp setvalue ${cardSpot+1} 10`}
                ], buttonStyles: {width: "16%"}},                 
                {type: "ButtonLine", contents: [                        
                    {name: -1, command: `!comp setvalue ${cardSpot+1} -1`},
                    {name: -2, command: `!comp setvalue ${cardSpot+1} -2`},
                    {name: -3, command: `!comp setvalue ${cardSpot+1} -3`},
                    {name: -4, command: `!comp setvalue ${cardSpot+1} -4`},
                    {name: -5, command: `!comp setvalue ${cardSpot+1} -5`}
                ], buttonStyles: {width: "16%"}}
            ]}, null, "PromptCardValue");            
    };
    // #endregion

    return {
        CheckInstall: checkInstall,
        OnChatCall: onChatCall,

        SetCard: setCard,
        Flip: flipCard,
        get Cards() { return CARDS }
    };
})();

on("ready", () => {
    Complications.CheckInstall();
    D.Log("Complications Ready!");
});
void MarkStop("Complications");