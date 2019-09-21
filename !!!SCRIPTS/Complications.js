void MarkStart("Complications")
const Complications = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Complications",
        CHATCOMMAND = "!comp",
        GMONLY = true,

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
            STATEREF.deckID = STATEREF.deckID || ""
            STATEREF.targetVal = STATEREF.targetVal || 0
            STATEREF.currentVal = STATEREF.currentVal || 0
            STATEREF.remainingVal = STATEREF.remainingVal || 0
            STATEREF.cardsDrawn = STATEREF.cardsDrawn || []
            STATEREF.isRunning = STATEREF.isRunning || false
            STATEREF.lastDraw = STATEREF.lastDraw || -1

            STATEREF.DECK = STATEREF.DECK || []
            STATEREF.MAT = STATEREF.MAT || [
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
            STATEREF.DISCARDS = STATEREF.DISCARDS || []
            STATEREF.FXQUEUE = STATEREF.FXQUEUE || []
            
           /* Media.IMAGES.compCardSpot_1.srcs = {
                cardBack: "https://s3.amazonaws.com/files.d20.io/images/88065314/frlnhSBmBUgfAXMaC8f0cQ/thumb.png?1564720670",
                "AMatterOfPride": "https://s3.amazonaws.com/files.d20.io/images/88065307/Fc0lL3TQqzh5xGsX-KW0KA/thumb.png?1564720656",
                "AMomentOfDespair": "https://s3.amazonaws.com/files.d20.io/images/88065308/sv4eABfbP3o649To0Xuinw/thumb.png?1564720665",
                "AMomentOfInsight": "https://s3.amazonaws.com/files.d20.io/images/88065133/Vx08z7z8Xtc-mI1fwfjEYw/thumb.png?1564720473",
                "AMomentOfInspiration": "https://s3.amazonaws.com/files.d20.io/images/88074416/ECko9TjMssHDWV3MeFf8Wg/thumb.png?1564736656",
                "AtCrossPurposes": "https://s3.amazonaws.com/files.d20.io/images/88065284/wzwTfvSnGfW2mGUBWsn3Xw/thumb.png?1564720634",
                "Betrayal": "https://s3.amazonaws.com/files.d20.io/images/63990142/MQ_uNU12WcYYmLUMQcbh0w/thumb.png?1538455511",
                "BloodRush": "https://s3.amazonaws.com/files.d20.io/images/88065105/T3JzVUOfKBva_jnL_kBLxA/thumb.png?1564720439",
                "Breakthrough": "https://s3.amazonaws.com/files.d20.io/images/88065139/Z0brQfXsdwNmRGeRry50Jw/thumb.png?1564720483",
                "Cathexis": "https://s3.amazonaws.com/files.d20.io/images/88074421/HLVgRvBxXCuyMrOCdCmH9A/thumb.png?1564736661",
                "CognitiveDissonance": "https://s3.amazonaws.com/files.d20.io/images/88074424/Tvi0GuaXStxTBwiSPO3zXQ/thumb.png?1564736667",
                "CollateralDamage": "https://s3.amazonaws.com/files.d20.io/images/88065238/pbmou_JBuuGmHyy2Ej1Z8Q/thumb.png?1564720574",
                "CostlyBlunder": "https://s3.amazonaws.com/files.d20.io/images/88074428/W6Ls7fT1837xwsLL74NEOg/thumb.png?1564736673",
                "CrisisManagement": "https://s3.amazonaws.com/files.d20.io/images/88065289/y-rScSE5Bw1mbOdYLZTxpQ/thumb.png?1564720639",
                "Ennui": "https://s3.amazonaws.com/files.d20.io/images/88074431/PmMeF0TL2g6cNf1iy4uJYA/thumb.png?1564736678",
                "Espionage": "https://s3.amazonaws.com/files.d20.io/images/88065142/GfgKGSQ46Dhls_CHbLcazA/thumb.png?1564720488",
                "Exhausted": "https://s3.amazonaws.com/files.d20.io/images/88065184/CJPnr84KpG8hzv28U7NZtQ/thumb.png?1564720525",
                "Faith": "https://s3.amazonaws.com/files.d20.io/images/88065331/HoWW87KVyQlUBD8OcUzRBQ/thumb.png?1564720691",
                "FakeNews": "https://s3.amazonaws.com/files.d20.io/images/88074435/yX9p5a0H2wxWUhccIqimLw/thumb.png?1564736683",
                "FalseLead": "https://s3.amazonaws.com/files.d20.io/images/88065295/3um-Lw2bBc9zYmHkyfgMhg/thumb.png?1564720644",
                "FanTheFlames": "https://s3.amazonaws.com/files.d20.io/images/88074439/yUBMCaKQEEu4WkDK39jJEw/thumb.png?1564736689",
                "Favors": "https://s3.amazonaws.com/files.d20.io/images/88065281/UB4DbryuJB3UP4P1sv2TnQ/thumb.png?1564720629",
                "FieldWork": "https://s3.amazonaws.com/files.d20.io/images/88065149/JR8yVja7GtQ3ZFbQddpXsw/thumb.png?1564720493",
                "Friction": "https://s3.amazonaws.com/files.d20.io/images/88065087/TL1dQyLwgIQMXD6YOvgF3g/thumb.png?1564720417",
                "GuiltByAssociation": "https://s3.amazonaws.com/files.d20.io/images/88065063/4Omu-OdEwkdsZSUlpVp0XA/thumb.png?1564720387",
                "ImmortalClay": "https://s3.amazonaws.com/files.d20.io/images/88074442/DTqriPA9XQINl8vEbZs3DA/thumb.png?1564736694",
                "InABind": "https://s3.amazonaws.com/files.d20.io/images/88065336/r1-GAWcmD9uRKs5qHLutGw/thumb.png?1564720697",
                "InTheRed": "https://s3.amazonaws.com/files.d20.io/images/88065340/kMZnduR1l7YNS-pcqZ5fqw/thumb.png?1564720701",
                "IrresistibleOpportunity": "https://s3.amazonaws.com/files.d20.io/images/88074450/ALTfXNwA7wViT4YKke2y0Q/thumb.png?1564736701",
                "LooseLips": "https://s3.amazonaws.com/files.d20.io/images/88065093/37Q2vLlJXj46jwRCQSvtcg/thumb.png?1564720428",
                "MentalBlock": "https://s3.amazonaws.com/files.d20.io/images/88065193/gJcPomViedw24Xa_4IliAg/thumb.png?1564720531",
                "Micromanagement": "https://s3.amazonaws.com/files.d20.io/images/88065155/RfV9kLvVjIQBnPxuB8H1ag/thumb.png?1564720499",
                "NecessaryEvils": "https://s3.amazonaws.com/files.d20.io/images/88065279/TiVeVqY1LwFDC7Skv6eRPg/thumb.png?1564720624",
                "Obsessed": "https://s3.amazonaws.com/files.d20.io/images/88065198/nIsWPeCmYYBufE_Q3lwdtQ/thumb.png?1564720539",
                "Options": "https://s3.amazonaws.com/files.d20.io/images/88065350/yAtFeDfnrn3hm6hWc2aDCg/thumb.png?1564720711",
                "Overwhelmed": "https://s3.amazonaws.com/files.d20.io/images/88065206/mv5yKwFSZilYZwvoiPt19Q/thumb.png?1564720545",
                "Powderkeg": "https://s3.amazonaws.com/files.d20.io/images/88074453/mfNFo2KPnk7LtSvEWs_12g/thumb.png?1564736707",
                "Preoccupied": "https://s3.amazonaws.com/files.d20.io/images/88065217/OdaDhMXIV06Ury9XGlEtMA/thumb.png?1564720552",
                "ProlongedAbsence": "https://s3.amazonaws.com/files.d20.io/images/88065355/RE6delb8vhrszgvIAyHTaQ/thumb.png?1564720717",
                "PyrrhicVictory": "https://s3.amazonaws.com/files.d20.io/images/88074457/WtyKP4tRrsAPT1u74sXhUA/thumb.png?1564736712",
                "RepeatMistakes": "https://s3.amazonaws.com/files.d20.io/images/88065357/cri9JfyPMJ8hAxOd8nDgQA/thumb.png?1564720722",
                "RecklessGamble": "https://s3.amazonaws.com/files.d20.io/images/88074461/aqzut3f3Qbix_figMyOY8g/thumb.png?1564736718",
                "Reverie": "https://s3.amazonaws.com/files.d20.io/images/88074463/aJs_JS4xWVCnG-jweBjkVw/thumb.png?1564736724",
                "RippleEffects": "https://s3.amazonaws.com/files.d20.io/images/88065164/KjErmcGO47imlAR9mMmjWQ/thumb.png?1564720509",
                "RockyStart": "https://s3.amazonaws.com/files.d20.io/images/63990142/MQ_uNU12WcYYmLUMQcbh0w/thumb.png?1538455511",
                "SilentBeneficiary": "https://s3.amazonaws.com/files.d20.io/images/88065369/7OvPo5NX-Q0noA0Ch2u6OQ/thumb.png?1564720739",
                "SimmeringResentment": "https://s3.amazonaws.com/files.d20.io/images/63990142/MQ_uNU12WcYYmLUMQcbh0w/thumb.png?1538455511",
                "SpreadThin": "https://s3.amazonaws.com/files.d20.io/images/88065223/loWJjAtIGbNpZDTU8SDtJA/thumb.png?1564720557",
                "TangledWebs": "https://s3.amazonaws.com/files.d20.io/images/88074469/QRLj2J_cxIoKMxti5q7N6g/thumb.png?1564736730",
                "TheBeast...": "https://s3.amazonaws.com/files.d20.io/images/63990142/MQ_uNU12WcYYmLUMQcbh0w/thumb.png?1538455511",
                "TheBeastAscendant": "https://s3.amazonaws.com/files.d20.io/images/88065112/g4E52d9zhlpph-HVQRAcWA/thumb.png?1564720450",
                "TheBeastRampant": "https://s3.amazonaws.com/files.d20.io/images/88065118/76VUHu1UgmrAo7FikuWjoQ/thumb.png?1564720457",
                "TheBeastRavenous": "https://s3.amazonaws.com/files.d20.io/images/88074472/0HsnQ8kTvQ57Ey5GwuTrkQ/thumb.png?1564736735",
                "TheBeastScorned": "https://s3.amazonaws.com/files.d20.io/images/88065127/SF3HnDCSowKCl93IoY8UcA/thumb.png?1564720467",
                "Tilted": "https://s3.amazonaws.com/files.d20.io/images/88065229/IlqTurlRczzNSVFBg4o_dw/thumb.png?1564720562",
                "Triage": "https://s3.amazonaws.com/files.d20.io/images/63990142/MQ_uNU12WcYYmLUMQcbh0w/thumb.png?1538455511",
                "TunnelVision": "https://s3.amazonaws.com/files.d20.io/images/88065170/Fsg8q7oyYNdTCTNTiXn8qg/thumb.png?1564720515",
                "UnderTheBus": "https://s3.amazonaws.com/files.d20.io/images/88074476/ouv0wcAakOtEFsvGkKHWNw/thumb.png?1564736741",
                "UnfinishedBusiness": "https://s3.amazonaws.com/files.d20.io/images/88065379/_A0OoKzz8rXL9JUVJdGSUw/thumb.png?1564720760",
                "WeightOfTheWorld": "https://s3.amazonaws.com/files.d20.io/images/88065231/L2T1utZx997A5XemGbXWxQ/thumb.png?1564720567"
            }
            for (let i = 2; i <= 10; i++)
                Media.IMAGES[`compCardSpot_${i}`].srcs = "compCardSpot_1"
                */
            for (let i = 1; i <= 10; i++) {
               Media.IMAGES[`flipComp_Pad_${i}`].modes = {
                Active: {
                    isForcedOn: false,
                    isForcedState: null,
                    lastActive: false
                },
                Inactive: {
                    isForcedOn: false,
                    isForcedState: null,
                    lastActive: false
                },
                Daylighter: {
                    isForcedOn: false,
                    isForcedState: null,
                    lastActive: false
                },
                Downtime: {
                    isForcedOn: false,
                    isForcedState: null,
                    lastActive: false
                },
                Complications: {
                    isForcedOn: true,
                    isForcedState: "blank",
                    lastActive: true
                }
            }
            Media.IMAGES[`flipComp_PartnerPad_${i}`].modes = {
                Active: {
                    isForcedOn: false,
                    isForcedState: null,
                    lastActive: false
                },
                Inactive: {
                    isForcedOn: false,
                    isForcedState: null,
                    lastActive: false
                },
                Daylighter: {
                    isForcedOn: false,
                    isForcedState: null,
                    lastActive: false
                },
                Downtime: {
                    isForcedOn: false,
                    isForcedState: null,
                    lastActive: false
                },
                Complications: {
                    isForcedOn: false,
                    isForcedState: null,
                    lastActive: false
                }
            }
        }
            
        },
    // #endregion

    // #region EVENT HANDLERS: (HANDLEINPUT)
        handleInput = (msg, who, call, args) => {
            let charObjs, charIDString
            [charObjs, charIDString, call, args] = D.ParseCharSelection(call, args)
            switch (call) {
                case "target":
                    setCompVals(call, parseInt(args.shift() || 0))
                    break
                case "start":
                    STATEREF.charRef = ((charObjs || [{id: null}])[0] || {id: null}).id
                    startComplication(parseInt(args.shift() || 0))
                    break
                case "stop": case "end":
                    endComplication(args.shift() === "true")
                    STATEREF.charRef = null
                    break
                case "reset":
                    resetComplication(true)
                    break
                case "discard": {
                    if (args[0] && args[0] === "rand")
                        discardCard(getRandomSpot(["faceUp", "noLastDrawn"]))
                    else if (args[0] && args[0] === "last")
                        discardCard(STATEREF.lastDraw)
                    else
                        discardCard(parseInt(args.shift()) - 1)
                    break
                }
                case "enhance": {
                    if (args[0] && args[0] === "rand")
                        enhanceCard(getRandomSpot(["faceUp", "noNegated", "noEnhanced", "noLastDrawn"]))
                    else if (args[0] && args[0] === "last")
                        enhanceCard(STATEREF.lastDraw)
                    else
                        enhanceCard(parseInt(args.shift()) - 1)
                    break
                }
                case "negate": {
                    if (args[0] && args[0] === "rand")
                        negateCard(getRandomSpot(["faceUp", "noEnhanced", "noNegated", "noLastDrawn"]))
                    else if (args[0] && args[0] === "last")
                        negateCard(STATEREF.lastDraw)
                    else
                        negateCard(parseInt(args.shift()) - 1)
                    break
                }
                case "duplicate": {
                    if (args[0] && args[0] === "rand")
                        dupeCard(getRandomSpot(["faceUp", "noNegated", "noDuplicated", "noLastDrawn"]))
                    else if (args[0] && args[0] === "last")
                        dupeCard(STATEREF.lastDraw)
                    else
                        dupeCard(parseInt(args.shift()) - 1)
                    break
                }
                case "revalue": {
                    if (args[0] && args[0] === "rand") 
                        promptCardVal(getRandomSpot(["faceUp", "noLastDrawn"]))
                    else if (args[0] && args[0] === "last")
                        promptCardVal(STATEREF.lastDraw)
                    else
                        promptCardVal(parseInt(args.shift()) - 1)
                    break
                }
                case "setvalue": {
                    revalueCard(parseInt(args.shift()) - 1, parseInt(args.shift()))
                    break
                }
                case "launchproject":
                    Char.LaunchProject(STATEREF.currentVal - STATEREF.targetVal, "COMPLICATION")
                    break
        // no default
            }
        },
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    // #region CONFIGURATION: Card Definitions
    /* eslint-disable no-unused-vars, no-empty-function */

        CARDS = [             
            {name: "AMatterOfPride", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88065307/Fc0lL3TQqzh5xGsX-KW0KA/thumb.png?1564720656", category: null, value: 1, rarity: "C", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => { Char.Damage(charRef, "willpower", "superficial+", 2); if (isEnhanced) Char.Damage(charRef, "willpower", "aggravated", 1) }},
            {name: "AMomentOfDespair", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88065308/sv4eABfbP3o649To0Xuinw/thumb.png?1564720665", category: null, value: 1, rarity: "C", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "AMomentOfInsight", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88065133/Vx08z7z8Xtc-mI1fwfjEYw/thumb.png?1564720473", category: "benefit", value: 1, rarity: "R", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "AMomentOfInspiration", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88074416/ECko9TjMssHDWV3MeFf8Wg/thumb.png?1564736656", category: "benefit", value: 1, rarity: "U", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "AtCrossPurposes", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88065284/wzwTfvSnGfW2mGUBWsn3Xw/thumb.png?1564720634", category: "project", value: 1, rarity: "U", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "Betrayal", imgsrc: null, category: null, value: -1, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "BloodRush", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88065105/T3JzVUOfKBva_jnL_kBLxA/thumb.png?1564720439", category: "beast", value: 2, rarity: "U", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "Breakthrough", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88065139/Z0brQfXsdwNmRGeRry50Jw/thumb.png?1564720483", category: "benefit", value: 1, rarity: "R", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "Cathexis", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88074421/HLVgRvBxXCuyMrOCdCmH9A/thumb.png?1564736661", category: "attention", value: 2, rarity: "R", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "CognitiveDissonance", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88074424/Tvi0GuaXStxTBwiSPO3zXQ/thumb.png?1564736667", category: "debilitation", value: 3, rarity: "U", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "CollateralDamage", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88065238/pbmou_JBuuGmHyy2Ej1Z8Q/thumb.png?1564720574", category: "humanity", value: 2, rarity: "R", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "CostlyBlunder", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88074428/W6Ls7fT1837xwsLL74NEOg/thumb.png?1564736673", category: null, value: 1, rarity: "U", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "CrisisManagement", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88065289/y-rScSE5Bw1mbOdYLZTxpQ/thumb.png?1564720639", category: "project", value: 3, rarity: "R", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "Ennui", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88074431/PmMeF0TL2g6cNf1iy4uJYA/thumb.png?1564736678", category: "humanity", value: 3, rarity: "R", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "Espionage", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88065142/GfgKGSQ46Dhls_CHbLcazA/thumb.png?1564720488", category: "benefit", value: 1, rarity: "R", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "Exhausted", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88065184/CJPnr84KpG8hzv28U7NZtQ/thumb.png?1564720525", category: "debilitation", value: 2, rarity: "U", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "Faith", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88065331/HoWW87KVyQlUBD8OcUzRBQ/thumb.png?1564720691", category: null, value: 0, rarity: "C", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "FakeNews", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88074435/yX9p5a0H2wxWUhccIqimLw/thumb.png?1564736683", category: null, value: 2, rarity: "U", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "FalseLead", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88065295/3um-Lw2bBc9zYmHkyfgMhg/thumb.png?1564720644", category: "project", value: 1, rarity: "U", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "FanTheFlames", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88074439/yUBMCaKQEEu4WkDK39jJEw/thumb.png?1564736689", category: "attention", value: 3, rarity: "R", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "Favors", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88065281/UB4DbryuJB3UP4P1sv2TnQ/thumb.png?1564720629", category: "prestation", value: 1, rarity: "U", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "FieldWork", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88065149/JR8yVja7GtQ3ZFbQddpXsw/thumb.png?1564720493", category: "blood", value: 1, rarity: "C", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "Friction", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88065087/TL1dQyLwgIQMXD6YOvgF3g/thumb.png?1564720417", category: "attention", value: 1, rarity: "U", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "GuiltByAssociation", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88065063/4Omu-OdEwkdsZSUlpVp0XA/thumb.png?1564720387", category: "advantage", value: 1, rarity: "C", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},                                                                                                                                       
            {name: "ImmortalClay", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88074442/DTqriPA9XQINl8vEbZs3DA/thumb.png?1564736694", category: "humanity", value: 2, rarity: "R", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "InABind", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88065336/r1-GAWcmD9uRKs5qHLutGw/thumb.png?1564720697", category: null, value: 1, rarity: "C", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "InTheRed", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88065340/kMZnduR1l7YNS-pcqZ5fqw/thumb.png?1564720701", category: null, value: 1, rarity: "C", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "IrresistibleOpportunity", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88074450/ALTfXNwA7wViT4YKke2y0Q/thumb.png?1564736701", category: "attention", value: 2, rarity: "R", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "LooseLips", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88065093/37Q2vLlJXj46jwRCQSvtcg/thumb.png?1564720428", category: "attention", value: 1, rarity: "U", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "MentalBlock", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88065193/gJcPomViedw24Xa_4IliAg/thumb.png?1564720531", category: "debilitation", value: 3, rarity: "R", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "Micromanagement", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88065155/RfV9kLvVjIQBnPxuB8H1ag/thumb.png?1564720499", category: "blood", value: 2, rarity: "U", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "NecessaryEvils", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88065279/TiVeVqY1LwFDC7Skv6eRPg/thumb.png?1564720624", category: "humanity", value: 2, rarity: "R", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => { Char.Damage(charRef, "stains", "", isEnhanced ? 2 : 1) }},
            {name: "Obsessed", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88065198/nIsWPeCmYYBufE_Q3lwdtQ/thumb.png?1564720539", category: "debilitation", value: 2, rarity: "U", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "Options", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88065350/yAtFeDfnrn3hm6hWc2aDCg/thumb.png?1564720711", category: null, value: 0, rarity: "C", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "Overwhelmed", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88065206/mv5yKwFSZilYZwvoiPt19Q/thumb.png?1564720545", category: "debilitation", value: 2, rarity: "U", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "Powderkeg", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88074453/mfNFo2KPnk7LtSvEWs_12g/thumb.png?1564736707", category: null, value: 0, rarity: "V", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "Preoccupied", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88065217/OdaDhMXIV06Ury9XGlEtMA/thumb.png?1564720552", category: "debilitation", value: 1, rarity: "C", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "ProlongedAbsence", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88065355/RE6delb8vhrszgvIAyHTaQ/thumb.png?1564720717", category: null, value: 1, rarity: "U", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "PyrrhicVictory", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88074457/WtyKP4tRrsAPT1u74sXhUA/thumb.png?1564736712", category: "project", value: 4, rarity: "R", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "RepeatMistakes", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88065357/cri9JfyPMJ8hAxOd8nDgQA/thumb.png?1564720722", category: null, value: 0, rarity: "R", rollEffect: "", enhancedRollEffect: "", action: charRef => { STATEREF.isRepeatMistakes = () => _.any(STATEREF.MAT, v => v.name === "RepeatMistakes" && v.isFaceUp && !v.isNegated) }, afterAction: (charRef, isEnhanced) => {}},
            {name: "RecklessGamble", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88074461/aqzut3f3Qbix_figMyOY8g/thumb.png?1564736718", category: "complication", value: 0, rarity: "U", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "Reverie", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88074463/aJs_JS4xWVCnG-jweBjkVw/thumb.png?1564736724", category: null, value: 0, rarity: "R", rollEffect: "R", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "RippleEffects", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88065164/KjErmcGO47imlAR9mMmjWQ/thumb.png?1564720509", category: "complication", value: 1, rarity: "U", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "RockyStart", imgsrc: null, category: null, value: -1, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "SilentBeneficiary", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88065369/7OvPo5NX-Q0noA0Ch2u6OQ/thumb.png?1564720739", category: null, value: 1, rarity: "U", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "SimmeringResentment", imgsrc: null, category: null, value: -1, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "SpreadThin", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88065223/loWJjAtIGbNpZDTU8SDtJA/thumb.png?1564720557", category: "debilitation", value: 1, rarity: "C", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "TangledWebs", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88074469/QRLj2J_cxIoKMxti5q7N6g/thumb.png?1564736730", category: "attention", value: 1, rarity: "R", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "TheBeast...", imgsrc: null, category: "beast", value: 1, rarity: "U", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "TheBeastAscendant", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88065112/g4E52d9zhlpph-HVQRAcWA/thumb.png?1564720450", category: "beast", value: 2, rarity: "U", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "TheBeastRampant", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88065118/76VUHu1UgmrAo7FikuWjoQ/thumb.png?1564720457", category: "beast", value: 2, rarity: "C", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "TheBeastRavenous", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88074472/0HsnQ8kTvQ57Ey5GwuTrkQ/thumb.png?1564736735", category: "beast", value: 2, rarity: "U", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "TheBeastScorned", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88065127/SF3HnDCSowKCl93IoY8UcA/thumb.png?1564720467", category: "beast", value: 2, rarity: "U", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "Tilted", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88065229/IlqTurlRczzNSVFBg4o_dw/thumb.png?1564720562", category: "debilitation", value: 1, rarity: "C", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "Triage", imgsrc: null, category: null, value: -1, rarity: "", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "TunnelVision", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88065170/Fsg8q7oyYNdTCTNTiXn8qg/thumb.png?1564720515", category: "complication", value: 1, rarity: "U", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "UnderTheBus", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88074476/ouv0wcAakOtEFsvGkKHWNw/thumb.png?1564736741", category: null, value: 1, rarity: "U", rollEffect: "U", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "UnfinishedBusiness", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88065379/_A0OoKzz8rXL9JUVJdGSUw/thumb.png?1564720760", category: null, value: 0, rarity: "U", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}},
            {name: "WeightOfTheWorld", imgsrc: "https://s3.amazonaws.com/files.d20.io/images/88065231/L2T1utZx997A5XemGbXWxQ/thumb.png?1564720567", category: "debilitation", value: 2, rarity: "U", rollEffect: "", enhancedRollEffect: "", action: charRef => {}, afterAction: (charRef, isEnhanced) => {}}
        ],        
    /* eslint-enable no-unused-vars, no-empty-function */
        CARDBACK = "https://s3.amazonaws.com/files.d20.io/images/88065314/frlnhSBmBUgfAXMaC8f0cQ/thumb.png?1564720670",
        CARDQTYS = {V: 12, C: 6, U: 3, R: 1},
    // #endregion

    // #region GETTERS: Active card names
        getActiveCards = () => _.filter(STATEREF.MAT, v => v.isFaceUp),
        getUsedCategories = () => _.uniq(_.compact(_.map(getActiveCards(), v => v.category))),
        isCardValid = card => VAL({list: card}) && card.imgsrc && (STATEREF.isRepeatMistakes && STATEREF.isRepeatMistakes() || !getUsedCategories().includes(card.category)) && !_.map(getActiveCards(), v => v.name).includes(card.name),
        getRandomSpot = (modes) => {
            const validSpots = []
            for (let i = 0; i < STATEREF.MAT.length; i++) {
                const card = STATEREF.MAT[i]
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
                            if (i === STATEREF.lastDraw)
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
            // D.Alert(`Valid Spots: ${D.JS(validSpots)}`, "getRandomSpot")
            return _.sample(validSpots)
        },
    // #endregion

    // #region CARD CONTROL: Deck construction, sandbox manipulation
        buildDeck = () => {
            STATEREF.DECK = []
            // STEP ONE: Filter master cardlist to contain only valid cards (i.e. no undefined cards, no duplicates and no duplicate categories)
            const validCards = _.filter(CARDS, v => isCardValid(v))
            // STEP TWO: Go through valid cards and add the proper number to the deck, subtracting discards.
            for (let i = 0; i < validCards.length; i++) {
                const qty = Math.max(0, CARDQTYS[validCards[i].rarity] - _.filter(STATEREF.DISCARDS, v => v.name === validCards[i].name).length)
                for (let ii = 0; ii < qty; ii++)
                    STATEREF.DECK.push(validCards[i])            
            }
            Media.SetText("complicationDeckSize", `DECK: ${STATEREF.DECK.length} Cards`)
        },
        dealCard = spot => {
            const card = STATEREF.MAT[spot]
            if (card && card.isFaceUp)
                discardCard(spot)
            else if (card && card.imgsrc)
                blinkCard(spot)
            STATEREF.MAT[spot] = _.clone(_.sample(STATEREF.DECK))
            Media.SetText(`compCardName_${spot+1}`, STATEREF.MAT[spot].name)
            Media.SetImg(`compCardSpot_${spot+1}`, "cardBack")
            // DragPads.Toggle(Media.GetImgData(`compCardSpot_${spot+1}`).id, true)
        },
        blinkCard = spot => {
            STATEREF.FXQUEUE.push(Media.GetImgData(`compCardSpot_${spot+1}`))
            const flashCard = () => { 
                const spotData = STATEREF.FXQUEUE.pop()
                D.RunFX("compCardBlink", {left: spotData.left, top: spotData.top})
            }
            setTimeout(flashCard, 500 + 300 * STATEREF.FXQUEUE.length)
        },
        negateCard = spot => {
            if (VAL({number: spot}, "negateCard")) {
                const card = STATEREF.MAT[spot]
                if (card && card.isNegated) {
                    Media.SetImgTemp(`compCardSpot_${spot+1}`, {tint_color: "transparent"})
                    card.isNegated = false
                } else if (card) {
                    Media.ToggleImg(`complicationEnhanced_${spot+1}`, false)
                    Media.SetImgTemp(`compCardSpot_${spot+1}`, {tint_color:"#000000"})
                    card.isNegated = true
                }
            }
        },
        discardCard = spot => {
            if (VAL({number: spot}, "discardCard")) {
                const card = STATEREF.MAT[spot]
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
                const card = STATEREF.MAT[spot]
                if (card && card.isDuplicated) {
                    Media.SetImgTemp(`compCardSpot_${spot+1}`, {tint_color: "transparent"})
                    card.isDuplicated = false
                } else if (card) {
                    Media.SetImgTemp(`compCardSpot_${spot+1}`, {tint_color:"#0000FF"})
                    card.isDuplicated = true
                }
            }
        },
        doCard = card => {
            setCompVals("add", card.value)
            card.action(STATEREF.charRef)
        },
        undoCard = card => {
            setCompVals("add", -1 * card.value)
        },
        enhanceCard = spot => {
            if (VAL({number: spot}, "enhanceCard")) {
                const card = STATEREF.MAT[spot]
                if (card) {
                    Media.ToggleImg(`complicationEnhanced_${spot+1}`, card.isEnhanced !== true)
                    card.isEnhanced = card.isEnhanced !== true
                }
            }
        },        
        revalueCard = (spot = 0, value = 0) => {
            const card = STATEREF.MAT[spot]
            setCompVals("add", value - card.value)
            if (value === 0)
                Media.ToggleImg(`complicationZero_${spot + 1}`, true)
            else
                Media.ToggleImg(`complicationZero_${spot + 1}`, false)
            // Media.SetImg(`complicationZero_${index + 1}`, value)
            toFront(Media.GetImg(`complicationZero_${spot + 1}`))
            toFront(Media.GetImg(`complicationEnhanced_${spot + 1}`))
            STATEREF.MAT[spot].value = value
            sendGMPanel()
        },
        flipCard = spot => {
            const card = STATEREF.MAT[spot]
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
                STATEREF.lastDraw = spot
            }
            refreshDraws()
        },
        refreshDraws = () => {
            buildDeck()
            for (let i = 0; i < 10; i++) {
                const card = STATEREF.MAT[i]
                if (card && card.isFaceUp)
                    continue
                else if (!isCardValid(card))
                    dealCard(i)
                Media.SetImg(`compCardSpot_${i+1}`, "cardBack")
                //D.Alert(`Setting compCardName_${i+1} to "${card.name}"`)
                Media.SetText(`compCardName_${i+1}`, STATEREF.MAT[i].name)
            }
        },

    // #endregion
    // #region SETTERS: Setting card values, target numbers, activating Complication system
        setCompVals = (mode, value) => {
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
            Media.SetText("complicationRemaining", `${STATEREF.remainingVal <= 0 ? "+" : "-"}${Math.abs(STATEREF.remainingVal)}`, true)
            if (STATEREF.remainingVal <= 0) {
                Media.SetTextData("complicationCurrent", {color: C.COLORS.green})
                Media.SetTextData("complicationRemaining", {color: STATEREF.remainingVal === 0 ? C.COLORS.gold : C.COLORS.green})
            } else {
                Media.SetTextData("complicationCurrent", {color: C.COLORS.brightred})
                Media.SetTextData("complicationRemaining", {color: C.COLORS.brightred})
            }
        },
        resetComplication = (isRefreshing = true) => {
            STATEREF.DECK = []
            STATEREF.MAT = [
                {imgsrc: null, isFaceUp: false, value: 0},
                {imgsrc: null, isFaceUp: false, value: 0},
                {imgsrc: null, isFaceUp: false, value: 0},
                {imgsrc: null, isFaceUp: false, value: 0},
                {imgsrc: null, isFaceUp: false, value: 0},
                {imgsrc: null, isFaceUp: false, value: 0},
                {imgsrc: null, isFaceUp: false, value: 0},
                {imgsrc: null, isFaceUp: false, value: 0},
                {imgsrc: null, isFaceUp: false, value: 0},
                {imgsrc: null, isFaceUp: false, value: 0}
            ]
            STATEREF.DISCARDS = []
            setCompVals("current", 0)
            setCompVals("target", 0)
            for (let i = 0; i < 10; i++) {
                Media.ToggleImg(`complicationZero_${i+1}`, false)
                Media.ToggleImg(`complicationEnhanced_${i+1}`, false)
                Media.ToggleImg(`compCardSpot_${i+1}`, true)
                Media.SetImgTemp(`compCardSpot_${i+1}`, {tint_color: "transparent"})
            }
            if (isRefreshing)
                refreshDraws()
                
        },
        startComplication = startVal => {            
            STATEREF.isRunning = true
            STATEREF.lastMode = Session.Mode
            Session.ChangeMode("Complications")
            TimeTracker.StopClock()
            setCompVals("current", 0)
            setCompVals("target", startVal)
            refreshDraws()
            sendGMPanel()
        },
        endComplication = (isLaunchingProject) => {
            STATEREF.isRunning = false      
            resetComplication(false)            
            if (Session.IsSessionActive)
                TimeTracker.StartClock()   
            Session.ChangeMode(STATEREF.lastMode)
            if (isLaunchingProject)
                Char.LaunchProject(STATEREF.currentVal - STATEREF.targetVal, "COMPLICATION")   
        },
        sendGMPanel = () => {
            sendChat("COMPLICATION", D.JSH(`/w Storyteller <div style='
                display: block;
                background: url(https://i.imgur.com/kBl8aTO.jpg);
                text-align: center;
                border: 4px ${C.COLORS.crimson} outset;
                box-sizing: border-box;
                margin-left: -42px;
                width: 275px;
            '><div style="display: inline-block; width: 49%; font-size: 0px;"><br><span style='
                    display: block;
                    font-size: 16px;
                    text-align: center;
                    width: 100%;
                    font-family: Voltaire;
                    color: ${C.COLORS.brightred};
                    font-weight: bold;
                '>DISCARD</span><span style='                    
                    display: block;
                    font-size: 10px;
                    text-align: center;
                    width: 100%
                '>[1](!comp discard 1) [2](!comp discard 2) [3](!comp discard 3) [4](!comp discard 4) [5](!comp discard 5)</span><span style='
                    display: block;
                    font-size: 10px;
                    text-align: center;
                    width: 100%
                '>[6](!comp discard 6) [7](!comp discard 7) [8](!comp discard 8) [9](!comp discard 9) [0](!comp discard 10)</span><span style='
                    display: block;
                    font-size: 10px;
                    text-align: center;
                    width: 100%
                '>[LAST](!comp discard last) [RANDOM](!comp discard rand)</span><br><span style='
                    display: block;
                    font-size: 16px;
                    text-align: center;
                    width: 100%;
                    font-family: Voltaire;
                    color: ${C.COLORS.brightred};
                    font-weight: bold;
                '>ENHANCE</span><span style='                    
                    display: block;
                    font-size: 10px;
                    text-align: center;
                    width: 100%
                '>[1](!comp enhance 1) [2](!comp enhance 2) [3](!comp enhance 3) [4](!comp enhance 4) [5](!comp enhance 5)</span><span style='
                    display: block;
                    font-size: 10px;
                    text-align: center;
                    width: 100%
                '>[6](!comp enhance 6) [7](!comp enhance 7) [8](!comp enhance 8) [9](!comp enhance 9) [0](!comp enhance 10)</span><span style='
                    display: block;
                    font-size: 10px;
                    text-align: center;
                    width: 100%
                '>[LAST](!comp enhance last) [RANDOM](!comp enhance rand)</span></div><div style="display: inline-block; width: 49%; font-size: 0px;"><br><span style='
                    display: block;
                    font-size: 16px;
                    text-align: center;
                    width: 100%;
                    font-family: Voltaire;
                    color: ${C.COLORS.brightred};
                    font-weight: bold;
                '>NEGATE</span><span style='                    
                    display: block;
                    font-size: 10px;
                    text-align: center;
                    width: 100%
                '>[1](!comp negate 1) [2](!comp negate 2) [3](!comp negate 3) [4](!comp negate 4) [5](!comp negate 5)</span><span style='
                    display: block;
                    font-size: 10px;
                    text-align: center;
                    width: 100%
                '>[6](!comp negate 6) [7](!comp negate 7) [8](!comp negate 8) [9](!comp negate 9) [0](!comp negate 10)</span><span style='
                    display: block;
                    font-size: 10px;
                    text-align: center;
                    width: 100%
                '>[LAST](!comp negate last) [RANDOM](!comp negate rand)</span><br><span style='
                    display: block;
                    font-size: 16px;
                    text-align: center;
                    width: 100%;
                    font-family: Voltaire;
                    color: ${C.COLORS.brightred};
                    font-weight: bold;
                '>REVALUE</span><span style='                    
                    display: block;
                    font-size: 10px;
                    text-align: center;
                    width: 100%
                '>[1](!comp revalue 1) [2](!comp revalue 2) [3](!comp revalue 3) [4](!comp revalue 4) [5](!comp revalue 5)</span><span style='
                    display: block;
                    font-size: 10px;
                    text-align: center;
                    width: 100%
                '>[6](!comp revalue 6) [7](!comp revalue 7) [8](!comp revalue 8) [9](!comp revalue 9) [0](!comp revalue 10)</span><span style='
                    display: block;
                    font-size: 10px;
                    text-align: center;
                    width: 100%
                '>[LAST](!comp revalue last) [RANDOM](!comp revalue rand)</span></div><span style='
                display: block;
                font-size: 16px;
                text-align: center;
                width: 100%;
                font-family: Voltaire;
                color: ${C.COLORS.brightred};
                font-weight: bold;
            '><br>DUPLICATE</span><span style='                    
                display: block;
                font-size: 10px;
                text-align: center;
                width: 100%
            '>[1](!comp duplicate 1) [2](!comp duplicate 2) [3](!comp duplicate 3) [4](!comp duplicate 4) [5](!comp duplicate 5)</span><span style='
                display: block;
                font-size: 10px;
                text-align: center;
                width: 100%
            '>[6](!comp duplicate 6) [7](!comp duplicate 7) [8](!comp duplicate 8) [9](!comp duplicate 9) [0](!comp duplicate 10)</span><span style='
                display: block;
                font-size: 10px;
                text-align: center;
                width: 100%
            '>[LAST](!comp duplicate last) [RANDOM](!comp duplicate rand)</span><br></div>`))
        },  
        promptCardVal = (cardSpot) => {
            sendChat("COMPLICATION", D.JSH(`/w Storyteller <div style='
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
            '>Set Card Value:</span><span style='                    
                display: block;
                font-size: 10px;
                text-align: center;
                width: 100%
            '>[0](!comp setvalue ${cardSpot+1} 0) [1](!comp setvalue ${cardSpot+1} 1) [2](!comp setvalue ${cardSpot+1} 2) [3](!comp setvalue ${cardSpot+1} 3) [4](!comp setvalue ${cardSpot+1} 4)</span></div>`))
        }
    // #endregion

    return {
        RegisterEventHandlers: regHandlers,
        CheckInstall: checkInstall,

        Flip: flipCard
    }
})()

on("ready", () => {
    Complications.RegisterEventHandlers()
    Complications.CheckInstall()
    D.Log("Complications Ready!")
})
void MarkStop("Complications")