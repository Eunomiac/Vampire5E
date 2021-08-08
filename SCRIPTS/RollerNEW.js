void MarkStart("RollerNew");
const RollerNew = (() => {
    // #region ▒░▒░▒░▒[FRONT] Boilerplate Namespacing & Initialization ▒░▒░▒░▒ ~
    const SCRIPTNAME = "RollerNew";
    // #region ░░░░░░░[NAMESPACING]░░░░ Namespacing, State Management, Function Mapping ░░░░░░░ ~
    const STATE = {get REF() { return C.RO.OT[SCRIPTNAME] }};
    const VAL = (varList, funcName, isArray = false) => D.Validate(varList, funcName, SCRIPTNAME, isArray);
    const DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME);
    const LOG = (msg, funcName) => D.Log(msg, funcName, SCRIPTNAME);
    const THROW = (msg, funcName, errObj) => console.error(msg); // D.ThrowError(msg, funcName, SCRIPTNAME, errObj);
    // #endregion ░░░░[NAMESPACING]░░░░
    // #region ░░░░░░░[INITIALIZATION]░░░░ Script Initialization ░░░░░░░ ~
    const checkInstall = () => {
        C.RO.OT[SCRIPTNAME] = C.RO.OT[SCRIPTNAME] || {};
        initialize();
    };
    const initialize = () => {
        [
            ["registry", []],
            ["isRerollingOnImport", false]
        ].forEach(([key, defaultVal]) => { STATE.REF[key] = key in STATE.REF ? STATE.REF[key] : defaultVal });
        Roll.importLegacyRegistry();
        Roll.initRegistry();
    };
    // #endregion ░░░░[INITIALIZATION]░░░░
    // #region ░░░░░░░[EVENTS]░░░░ Event Handlers ░░░░░░░ ~
    const onChatCall = (call, args, objects, msg) => {
        switch (call) {
            case "test": {
                switch (D.LCase(call = args.shift())) {
                    case "import": {
                        switch (D.LCase(call = args.shift())) {
                            case "reroll": {
                                if (args.includes("all")) {
                                    STATE.REF.isRerollingOnImport = true;
                                } else {
                                    STATE.REF.isRerollingOnImport = false;
                                }
                                D.Flag(`Rerolling On Import: ${STATE.REF.isRerollingOnImport}`);
                                break;
                            }
                            // no default
                        }
                        break;
                    }
                    // no default
                }
                break;
            }
            case "get": {
                switch (D.LCase(call = args.shift())) {
                    case "registry": D.Alert(Roll.REGISTRY.map((rollInst) => `<p>${D.JS(Roll.parseForDebug(rollInst))}</p>`).join(""), "Roll.REGISTRY"); break;
                    case "current": D.Show({"Current Roll": Roll.Current}); break;
                    case "ids": D.Show({"Roll.REGISTRY": Roll.REGISTRY.map((roll) => [roll.rollID, roll._rollID]),
                                        "STATE.REF.registry": STATE.REF.registry.map((rollData) => rollData.rollID)}); break;
                    default: {
                        args.unshift(call);
                        if (Roll.Current) {
                            const prop = args.shift();
                            if (Roll.Current[prop] !== undefined) {
                                if (VAL({func: Roll.Current[prop]})) {
                                    D.Show({
                                        PROPERTY: `${prop} (function)`,
                                        ARGS: args.join(", "),
                                        RETURN: Roll.Current[prop](...args),
                                        ROLL: Roll.Current
                                    });
                                } else {
                                    D.Show({
                                        PROPERTY: prop,
                                        RETURN: Roll.Current[prop]
                                    });
                                }
                            } else { D.Flag(`${prop} Undefined.`) }
                        } else {
                            D.Flag("Roll Not Found.");
                        }
                    }
                }
                break;
            }
            case "set": {
                switch (D.LCase(call = args.shift())) {
                    case "current": Roll.Current = args.shift(); break;
                    // no default
                }
                break;
            }
            case "reset": {
                if (args.includes("all")) {
                    state.VAMPIRE[SCRIPTNAME] = {isRerollingOnImport: STATE.REF.isRerollingOnImport};
                    initialize();
                }
            }
            // no default
        }
    };
    // #endregion ░░░░[EVENTS]░░░░
    // #endregion ▒▒▒▒[FRONT]▒▒▒▒

    // #region ░░░░░░░[SETTINGS]░░░░ Constants for Graphics & Hiding Roll Details ░░░░░░░ ~
    const GRAPHICROLLER = {
        frame: {
            imgObjs: {
                RollerFrame_Left: "top",
                RollerFrame_TopMid_: ["top", false, false, false, false, false],
                RollerFrame_BottomMid_: [false, false, false, false, false, false],
                RollerFrame_TopEnd: "base",
                RollerFrame_BottomEnd: false,
                RollerFrame_Diff: false,
                RollerFrame_WPReroller_Base_1: false,
                RollerFrame_WPReroller_Base_2: false,
                RollerFrame_OppCompVS: false,
                RollerFrame_OppDiceBoxLeft: false,
                RollerFrame_OppDiceBoxMid: false,
                RollerFrame_OppDiceBoxRight: false,
                RollerFrame_OppDicePool: false,
                RollerFrame_OppMainLeft: false,
                RollerFrame_OppMainMid: false,
                RollerFrame_OppMainRight: false,
                RollerFrame_OppMarginMain: false,
                RollerFrame_OppMarginOpp: false,
                RollerFrame_OppNameLeft: false,
                RollerFrame_OppNameMid: false,
                RollerFrame_OppNameRight: false,
                RollerFrame_OppOutcome: false
            },
            textObjs: {
                rollerName: false,
                mainRoll: false,
                posMods: false,
                negMods: false,
                goldMods: false,
                redMods: false,
                dicePool: false,
                difficulty: false,
                margin: false,
                resultCount: false,
                outcome: false,
                subOutcome: false,
                oppRollerName: false,
                oppDicePool: false,
                oppMainRoll: false,
                oppMarginOpp: false,
                oppMarginMai: false
            },
            animObjs: {
                Roller_WPReroller_1: false,
                Roller_WPReroller_2: false
            },
            spread: {min: 50, max: 125},
            minWidth: 250,
            leftBuffer: 100,
            flagBuffer: 10
        },
        dice: {
            Main: {
                imgObjs: {RollerDie_Main_: new Array(30).fill(false)},
                spread: 33,
                isSelectable: true
            },
            Big: {
                imgObjs: {RollerDie_Big_: new Array(2).fill(false)},
                spread: 50,
                isSelectable: false
            },
            Opp: {
                imgObjs: {RollerDie_Opp_: new Array(30).fill(false)},
                spread: 8,
                isSelectable: false
            }
        },
        initialState: {
            selected: {Main: []},
            diceVals: {
                Main: [null, ...new Array(30).fill(false)],
                Big: [null, ...new Array(2).fill(false)],
                Opp: [null, ...new Array(30).fill(false)]
            },
            oppRolls: {},
            curOppWaitID: false
        }
    };
    const SECRECY = {
        none: {
            public: ["name", "traits", "traitVals", "dicePool", "difficulty", "result", "outcome"],
            controller: ["name", "traits", "traitVals", "dicePool", "difficulty", "result", "outcome"]
        },
        unknown: {
            public: ["traits"],
            controller: ["name", "traits", "difficulty", "outcome"]
        },
        stranger: {
            public: ["name", "traits", "outcome"],
            get controller() {
                return Char.IsCharSheetSecret(this.charID)
                    ? ["name", "traits", "outcome"]
                    : ["name", "traits", "traitVals", "dicePool", "difficulty", "result", "outcome"];
            }
        },
        known: {
            public: ["name", "traits", "difficulty", "result", "outcome"],
            get controller() {
                return Char.IsCharSheetSecret(this.charID)
                    ? ["name", "traits", "difficulty", "result", "outcome"]
                    : ["name", "traits", "traitVals", "dicePool", "difficulty", "result", "outcome"];
            }
        }
    };
    // #endregion ░░░░[SETTINGS]░░░░

    // #region ████████ CLASS: "Roll" Class Definition ████████
    const MAXLOGGEDROLLS = {
        PC: 10,
        NPC: 10
    };
    const TRAITROLLTYPES = ["trait", "secret", "project"];
    const WPREROLLTYPES = ["trait"];
    const DIFFMODROLLTYPES = ["project"];
    class Roll {
        // #region ▒░▒░▒░▒[INITIALIZATION] Registry Initialization from State Storage (STATIC) ▒░▒░▒░▒ ~
        static get statePCRolls() { return STATE.REF.registry.filter((rollData) => !rollData.flags.isNPC) }
        static get stateNPCRolls() { return STATE.REF.registry.filter((rollData) => rollData.flags.isNPC) }
        static get PCRolls() { return Roll.REGISTRY.filter((rollInst) => !rollInst.isNPC) }
        static get NPCRolls() { return Roll.REGISTRY.filter((rollInst) => rollInst.isNPC) }
        static initRegistry() {
            let [pcCount, npcCount] = [0, 0];
            const stateData = [];
            /* 1)  Run through state indices in order (since 0-index is most recent roll and the one you want to keep)
               2)  For each index, push roll to new stateData array IF
                        (A) there's a next roll and (B) it's isFirstOpposed and (C) there's enough tally-room to add it --> Do NOT count against maximums
                    OR  (A) there is no "isFirstOpposed" next (or it will be excluded by tally) and (B) the pc/npc tally still has room --> Advance tally by one
               3)  Replace state registry with stateData
               4)  Reverse stateData array, then register rolls (with the oldest roll being registered first)
            */
            for (let i = 0; i < STATE.REF.registry.length; i++) {
                const rollData = STATE.REF.registry[i];
                const nextRollData = STATE.REF.registry[i + 1];
                if (nextRollData && nextRollData.flags.isFirstOpposed
                    && ((nextRollData.flags.isNPC && npcCount < MAXLOGGEDROLLS.NPC)
                        || (!nextRollData.flags.isNPC && pcCount < MAXLOGGEDROLLS.PC))
                ) {
                    stateData.push(rollData);
                } else if (rollData.flags.isNPC && npcCount < MAXLOGGEDROLLS.NPC) {
                    stateData.push(rollData);
                    npcCount++;
                } else if (!rollData.flags.isNPC && pcCount < MAXLOGGEDROLLS.PC) {
                    stateData.push(rollData);
                    pcCount++;
                }
                if (npcCount >= MAXLOGGEDROLLS.NPC && pcCount >= MAXLOGGEDROLLS.PC) { break }
            }
            // D.Show(stateData);
            STATE.REF.registry = [...stateData];
            for (const rollData of stateData.reverse()) { Roll.registerRoll(new Roll(rollData), false) }
        }
        static importLegacyRollData(lRollData, rolls) {
            if (!Roll.stateRollIDs.includes(lRollData.rollID)) {
                try {
                    const rollData = {
                        rollID: lRollData.rollID,
                        playerID: lRollData.playerID,
                        charID: lRollData.charID,
                        playerCharID: VAL({playerID: lRollData.playerID}) && D.GMID() !== lRollData.playerID && (D.GetChar(lRollData.playerID) || {id: false}).id,
                        type: lRollData.type,
                        flags: {
                            isNPC: Boolean(lRollData.isNPCRoll),
                            isFirstOpposed: Boolean(lRollData.rollFlags.isWaitingForOpposed),
                            isDiscipline: Boolean(lRollData.isDiscRoll),
                            isOblivionRouse: Boolean(lRollData.isObvlivionRoll),
                            isBloodSurge: lRollData.posFlagLines.some((posFlag) => /^Blood Surge/.test(posFlag)),
                            isSpecialty: lRollData.posFlagLines.some((posFlag) => /^Specialty/.test(posFlag)),
                            isResonant: lRollData.posFlagLines.some((posFlag) => /^Resonance/.test(posFlag))
                        },
                        modifier: lRollData.mod,
                        hunger: lRollData.hunger,
                        diffBase: lRollData.diff,
                        secrecy: lRollData.isNPCRoll
                            ? {...SECRECY.stranger}
                            : {...SECRECY.none}
                    };
                    if (TRAITROLLTYPES.includes(rollData.type)) {
                        rollData.traits = lRollData.traits;
                    }
                    if (DIFFMODROLLTYPES.includes(rollData.type)) {
                        rollData.diffMod = lRollData.diffMod || 0;
                    }
                    if (VAL({array: rolls}) && rolls.length) {
                        rollData.diceRolls = [...rolls];
                        rollData.diceRolls.sort((a, b) => {
                            const [aScore, bScore] = [a, b].map((dieVal) => {
                                let score = 0;
                                if (/^H1$/.test(dieVal)) { score -= -1000 }
                                if (/[6-9]$/.test(dieVal)) { score -= 100 }
                                if (/10$/.test(dieVal)) { score -= 1000 }
                                if (/^H/.test(dieVal)) { score -= 5 }
                                return score;
                            });
                            return aScore - bScore;
                        });
                    }
                    if (rollData.flags.isFirstOpposed && rollData.rollID in state.VAMPIRE.Roller.oppRolls) {
                        Roll.importLegacyRollData(state.VAMPIRE.Roller.oppRolls[rollData.rollID].oppData);
                    }
                    STATE.REF.registry.push({...rollData});
                } catch (err) {
                    D.Alert([
                        D.JS(lRollData),
                        " ",
                        err.message
                    ].join("<br>"), "ERROR: Failed to Import");
                }
            }
        }
        static importLegacyRegistry() {
            STATE.REF.registry = [];
            state.VAMPIRE.Roller.rollRecord.forEach(({rollData, rollResults: {rolls} = {}}) => Roll.importLegacyRollData(rollData, rolls));
        }
        // #endregion ▒▒▒▒[INITIALIZATION]▒▒▒▒
        // #region ▒░▒░▒░▒[REGISTRATION] Registering & Instantiating Rolls (STATIC) ▒░▒░▒░▒ ~
        static REGISTRY = [];
        static registerRoll(rollInst, isNewRoll = true) {
            if (rollInst instanceof Roll) {
                if (!rollInst.rollID) { rollInst.rollID = D.RandomString(20) } else if (Roll.REGISTRY.find((roll) => roll.rollID === rollInst.rollID)) { return false }
                Roll.REGISTRY.unshift(rollInst);
                Roll.LogToState(rollInst);
                if (rollInst.isResolved && isNewRoll) { Roll.currentRollIndex = 0 }
                return true;
            }
            return false;
        }
        // #endregion ▒▒▒▒[REGISTRATION]▒▒▒▒
        // #region ▒░▒░▒░▒[ROLL RECORD] Retrieving, Storing & Manipulating Recorded Rolls ▒░▒░▒░▒ ~
        static get stateRollIDs() { return STATE.REF.registry.map((rollData) => rollData.rollID) }
        static get classRollIDs() { return Roll.REGISTRY.map((rollInst) => rollInst.rollID) }

        static parseForDebug(rollInst) { return D.ClassToObj(rollInst, {omit: ["isRegistered", "rollIndex", "charID", "playerID", "playerCharID", "hungerDice", "Bc", "Hc", "Bs", "Hs", "Bf", "Hf", "Hb"]}) }

        static getRollIndex(rollID) { return Roll.REGISTRY.findIndex((roll) => D.LCase(roll.rollID) === D.LCase(rollID)) }
        static get currentRollIndex() { return STATE.REF.currentRollIndex || 0 }
        static set currentRollIndex(v) {
            switch (D.LCase(v).replace(/^(.)[^0-9]+$/, "$1")) {
                case "p": STATE.REF.currentRollIndex = Math.max(0, Roll.currentRollIndex - 1); break;
                case "n": STATE.REF.currentRollIndex = Math.min(Roll.REGISTRY.length - 1, Roll.currentRollIndex + 1); break;
                default: {
                    if (/^[0-9]+/.test(`${v}`)) { STATE.REF.currentRollIndex = Math.max(0, Math.min(Roll.REGISTRY.length - 1, D.Int(v))) } else { STATE.REF.currentRollIndex = 0 }
                    break;
                }
            }
        }

        static get Current() { return Roll.REGISTRY[Roll.currentRollIndex] }
        static set Current(rollRef = 0) {
            if (VAL({string: rollRef}) && !VAL({int: rollRef})) { Roll.currentRollIndex = Roll.getRollIndex(rollRef) } else if (/^[0-9]+$/.test(`${rollRef}`)) { Roll.currentRollIndex = D.Int(rollRef) } else { D.Flag(`Bad RollRef: '${rollRef}'`) }

            D.Flag(`Roll Index Set: ${Roll.currentRollIndex}`);
        }
        static LogToState(rollInst) {
            const stateIndex = STATE.REF.registry.findIndex((rollData) => rollData.rollID === rollInst.rollID);
            if (stateIndex >= 0) {
                STATE.REF.registry[stateIndex] = D.ClassToObj(rollInst, {pick: [
                    "rollID", "playerID", "charID", "playerCharID", "type", "flags", "traits", "modifier", "hunger", "diffBase", "diffMod", "secrecy", "WPRerolls", "diceRolls"
                ]});
            } else {
                STATE.REF.registry.unshift(D.ClassToObj(rollInst, {pick: [
                    "rollID", "playerID", "charID", "playerCharID", "type", "flags", "traits", "modifier", "hunger", "diffBase", "diffMod", "secrecy", "WPRerolls", "diceRolls"
                ]}));
            }
        }
        static Set(data = {}, rollID) {
            Object.assign(Roll.REGISTRY[
                rollID && rollID !== Roll.Current.rollID
                    ? Roll.getRollIndex(rollID)
                    : Roll.currentRollIndex
            ], data);
        }
        static getRoll(rollRef) {
            return VAL({string: rollRef}) && !VAL({int: rollRef})
                ? Roll.getRoll(Roll.getRollIndex(rollRef))
                : Roll.REGISTRY[D.Int((rollRef || rollRef === 0) ? rollRef : Roll.currentRollIndex)];
        }
        static get die() { return Math.ceil(Math.random() * 10) }
        static get H() { return `H${Roll.die}` }
        static get B() { return `B${Roll.die}` }
        // #endregion ▒▒▒▒[GLOBAL GETTERS]▒▒▒▒

        // #region ████████ CONSTRUCTOR ████████ ~
        constructor(rollData) {
            // Minimum (i.e. new Roll)
            /*
                const rollData = {
                    rollID,
                    playerID,
                    charID,
                    playerCharID,
                    type,                           (traits only needed if type in TRAITROLLTYPES)
                    flags,                          flags: {
                                                        isNPC: Boolean(rollData.isNPCRoll),
                                                        isFirstOpposed: rollData.rollFlags.isWaitingForOpposed,
                                                        isDiscipline: Boolean(rollData.isDiscRoll),
                                                        isOblivionRouse: Boolean(rollData.isObvlivionRoll),
                                                        isBloodSurge: rollData.posFlagLines.some((posFlag) => /^Blood Surge/.test(posFlag)),
                                                        isSpecialty: rollData.posFlagLines.some((posFlag) => /^Specialty/.test(posFlag)),
                                                        isResonant: rollData.posFlagLines.some((posFlag) => /^Resonance/.test(posFlag))
                                                    },
                    modifier,
                    hunger,
                    diffBase,
                    diffMod
                }
            */
            rollData = {...rollData};
            this._rollID = rollData.rollID;
            this._player = getObj("player", rollData.playerID);
            this._char = getObj("character", rollData.charID);
            this._playerChar = getObj("character", rollData.playerCharID);
            this._type = rollData.type;
            if (TRAITROLLTYPES.includes(rollData.type)) {
                if ("traits" in rollData) {
                    this._traits = [...rollData.traits];
                } else {
                    THROW(`Missing Traits in Roll Data '${rollData.rollID}'`);
                }
            }
            Object.assign(this._flags = {}, rollData.flags);
            this._modifier = D.Int(rollData.modifier);
            this._hunger = D.Int(rollData.hunger);
            this._diffBase = D.Int(rollData.diffBase);
            if (DIFFMODROLLTYPES.includes(rollData.type)) {
                this._diffMod = D.Int(rollData.diffMod);
            }
            Object.assign(this._secrecy = {}, rollData.secrecy);
            this._dicePoolComps = {
                traits: this.compileTraits(),
                modifier: this.modifier,
                flags: this.compileFlags(),
                effects: this.compileEffects()
            };
            this._WPRerolls = rollData.WPRerolls
                || WPREROLLTYPES.includes(rollData.type) && [{cost: 1, numDice: 3}]
                || [];

            if (STATE.REF.isRerollingOnImport && TRAITROLLTYPES.includes(rollData.type)) {
                this.rollPool();
            } else if (rollData.diceRolls) {
                this._diceRolls = rollData.diceRolls;
            }
        }
        // this._rollStage = ENUMERATOR:
        //     (nothing: how it starts)
        //     ROLLABLE: result hasn't been calculated, but dice pools are correct and it can be rolled
        //     RESOLVED: roll made, outcome determined
        //     WAITINGFOROPPOSED: first roll of an opposed roll: waiting to "catch" the second roll
        // #endregion ▄▄▄▄▄ CONSTRUCTOR ▄▄▄▄▄
        // #region ░░░░░░░[GETTERS: ROLL DATA]░░░░ Getters For Basic Data on Roll & Results ░░░░░░░ ~
        get rollID() { return this._rollID }
        get isRegistered() { return Roll.getRollIndex(this.rollID) >= 0 }
        get rollIndex() { return this.isRegistered ? Roll.getRollIndex(this.rollID) : false }

        get char() { return this._char }
        get charID() { return this["char"] ? this["char"].id : false }
        get player() { return this._player }
        get playerID() { return this.player ? this.player.id : false }
        get playerChar() { return this._playerChar }
        get playerCharID() { return this.playerChar ? this.playerChar.id : false }

        get type() { return this._type }
        get traits() { return this._traits }
        get traitData() { return this._traitData }
        get modifier() { return this._modifier }
        get hunger() { return this._hunger }
        get diffBase() { return this._diffBase }
        get diffMod() { return this._diffMod }
        get dicePool() { return Object.values(this._dicePoolComps).reduce((tot, val) => tot + D.Int(val), 0) }
        get isUsingHungerDice() { return ["trait", "secret"].includes(this.type) }
        get hungerDice() { return this.isUsingHungerDice ? Math.min(this.dicePool, this.hunger) : 0 }

        get WPRerolls() { return this._WPRerolls }
        get NextWPReroll() {
            if (this._WPRerolls.length) { return this._WPRerolls[0] }
            return {};
        }
        get hasWPReroll() { return Boolean(Object.keys(this.NextWPReroll).length) }

        get diceRolls() { return this._diceRolls }
        get isResolved() { return Boolean(this.diceRolls && VAL({int: this.diffBase})) }
        get difficulty() { return this.isResolved ? this.diffBase + (this.diffMod || 0) : THROW("Difficulty not set.") }

        get flags() { return this._flags }
        get isBloodSurge() { return this.flags.isBloodSurge }
        get isDiscipline() { return this.flags.isDiscipline }
        get isSpecialty() { return this.flags.isSpecialty }
        get isResonant() { return this.flags.isDiscipline }


        get isOpposed() { return Boolean(this._type.isFirstOpposed) }


        get H() { return this.isResolved ? this.diceRolls.filter((diceRoll) => /^H/.test(diceRoll)).length : THROW("Cannot read dice of unresolved dice roll.") }
        get B() { return this.isResolved ? this.diceRolls.filter((diceRoll) => /^B/.test(diceRoll)).length : THROW("Cannot read dice of unresolved dice roll.") }
        get Bc() { return this.isResolved ? this.diceRolls.filter((diceRoll) => /^B10$/.test(diceRoll)).length : THROW("Cannot read dice of unresolved dice roll.") }
        get Hc() { return this.isResolved ? this.diceRolls.filter((diceRoll) => /^H10$/.test(diceRoll)).length : THROW("Cannot read dice of unresolved dice roll.") }
        get Bs() { return this.isResolved ? this.diceRolls.filter((diceRoll) => /^B[6-9]$/.test(diceRoll)).length : THROW("Cannot read dice of unresolved dice roll.") }
        get Hs() { return this.isResolved ? this.diceRolls.filter((diceRoll) => /^H[6-9]$/.test(diceRoll)).length : THROW("Cannot read dice of unresolved dice roll.") }
        get Bf() { return this.isResolved ? this.diceRolls.filter((diceRoll) => /^B[1-5]$/.test(diceRoll)).length : THROW("Cannot read dice of unresolved dice roll.") }
        get Hf() { return this.isResolved ? this.diceRolls.filter((diceRoll) => /^H[2-5]$/.test(diceRoll)).length : THROW("Cannot read dice of unresolved dice roll.") }
        get Hb() { return this.isResolved ? this.diceRolls.filter((diceRoll) => /^H1$/.test(diceRoll)).length : THROW("Cannot read dice of unresolved dice roll.") }
        get c() { return this.isResolved ? this.Bc + this.Hc : THROW("Cannot read dice of unresolved dice roll") }
        get s() { return this.isResolved ? this.Bs + this.Hs : THROW("Cannot read dice of unresolved dice roll") }
        get f() { return this.isResolved ? this.Bf + this.Hf : THROW("Cannot read dice of unresolved dice roll") }
        get b() { return this.isResolved ? this.Hb : THROW("Cannot read dice of unresolved dice roll") }

        get total() { return this.isResolved ? this.s + this.c + 2 * Math.floor(this.c / 2) : THROW("Cannot read 'total' of unresolved dice roll.") }
        get margin() { return this.isResolved ? (this.total - this.difficulty) : THROW("Cannot read 'margin' of unresolved dice roll.") }

        get isWin() { return this.isResolved ? (this.total > 0 && this.margin >= 0) : THROW("Cannot read 'isWin' of unresolved dice roll.") }
        get isCrit() { return this.isResolved ? (this.isWin && this.c >= 2) : THROW("Cannot read 'isCrit' of unresolved dice roll.") }
        get isFail() { return this.isResolved ? (this.margin < 0) : THROW("Cannot read 'isFail' of unresolved dice roll.") }

        get isBasicWin() { return this.isResolved ? (this.isWin && !this.isCrit) : THROW("Cannot read 'isBasicWin' of unresolved dice roll.") }
        get isMessyCrit() { return this.isResolved ? (this.isCrit && this.Hc > 0) : THROW("Cannot read 'isMessyCrit' of unresolved dice roll.") }
        get isCleanCrit() { return this.isResolved ? (this.isCrit && this.Hc === 0) : THROW("Cannot read 'isCleanCrit' of unresolved dice roll.") }
        get isTotalFail() { return this.isResolved ? (this.total === 0) : THROW("Cannot read 'isTotalFail' of unresolved dice roll.") }
        get isBestialFail() { return this.isResolved ? (this.isFail && this.Hb > 0) : THROW("Cannot read 'isBestialFail' of unresolved dice roll.") }
        get isBasicFail() { return this.isResolved ? (this.isFail && !this.isTotalFail && !this.isBestialFail) : THROW("Cannot read 'isBasicFail' of unresolved dice roll.") }
        get isCostlyFail() { return this.isResolved ? (this.isFail && this.margin >= -2) : THROW("Cannot read 'isCostlyFail' of unresolved dice roll.") }
        // #endregion ░░░░[GETTERS: ROLL DATA]░░░░
        // #region ░░░░░░░[SETTERS: ROLL DATA]░░░░ Setters for Basic Roll Data ░░░░░░░ ~
        set rollID(v) { this._rollID = v }
        set diceRolls(v) { this._diceRolls = v }
        // #endregion ░░░░[SETTERS: ROLL DATA]░░░░

        // #region ████████ ROLL PROCESSING ████████ ~
        // #region ░░░░░░░[PARSING]░░░░ Parsing Initial Roll Request ░░░░░░░ ~
        compileTraits() {
            switch (this.type) {
                case "obvrouse": case "rouse": case "check": return 1;
                case "rouse2": return 2;
                case "willpower": return D.Int(D.GetStatVal(this.charID, "willpower"));
                case "humanity": return D.Int(D.GetStatVal(this.charID, "humanity"));
                case "frenzy": return D.Int(D.GetStatVal(this.charID, "resolve")) + D.Int(D.GetStatVal(this.charID, "composure"));
                case "remorse": return Math.ceil(D.Int(D.GetStatVal(this.charID, "humanity")) / 3);
                default: {
                    if (TRAITROLLTYPES.includes(this.type)) {
                        let totVal = 0;
                        this._traitData = this._traits.map((trait) => {
                            const val = D.Int(D.GetStatVal(this.charID, trait) || D.GetStatVal(this.charID, trait.replace(/_/g, " ")));
                            totVal += val;
                            return {
                                name: trait,
                                displayName: D.IsIn(trait, undefined, true)
                                || D.IsIn(trait.replace(/_/g, " "), undefined, true)
                                || D.GetStatVal(this.charID, `${trait}_name`)
                                || D.GetStatVal(this.charID, `${trait.replace(/_/gu, " ")}_name`)
                                || trait,
                                value: val
                            };
                        });
                        return totVal;
                    }
                }
            }
            return THROW(`Unrecognized Type: '${this.type}' (${this.rollID})`);
        }
        compileFlags() {
            return 0;
        }
        compileEffects() {
            return 0;
        }
        // #endregion ░░░░[PARSING]░░░░
        // #region ░░░░░░░[RESULTS]░░░░ Rolling Dice, Resolving Roll ░░░░░░░ ~
        rollPool() {
            const rollNums = new Array(this.dicePool).fill(null).map(() => Roll.die);
            const diceRolls = [
                ...rollNums.slice(0, this.hungerDice).map((die) => `H${die}`),
                ...rollNums.slice(this.hungerDice).map((die) => `B${die}`)
            ];
            diceRolls.sort((a, b) => {
                const [aScore, bScore] = [a, b].map((dieVal) => {
                    let score = 0;
                    if (/^H1$/.test(dieVal)) { score -= -1000 }
                    if (/[6-9]$/.test(dieVal)) { score -= 100 }
                    if (/10$/.test(dieVal)) { score -= 1000 }
                    if (/^H/.test(dieVal)) { score -= 5 }
                    return score;
                });
                return aScore - bScore;
            });
            this.diceRolls = [...diceRolls];
            if (this.isRegistered) { Roll.LogToState(this) }
        }
        // #endregion ░░░░[RESULTS]░░░░
        // #endregion ▄▄▄▄▄ ROLL PROCESSING ▄▄▄▄▄

        // #region ████████ ROLL EFFECTS ████████ ~
        // #region ░░░░░░░[CHECKS]░░░░ Check Functions ░░░░░░░ ~

        // Two types of getters are relevant here.
        //  GetFromCharacter --- retrieves from character. Used to set initial flags at roll outset (e.g. "is blood surge currently toggled on sheet?")
        //  GetFromState --- retrieves from stateref.flags. Used when processing rolls after construction (e.g. "was this roll blood surged?")
        // Basic getters should GET FROM STATE
        //  (Getting from Character should be a separate function, as it's only used when the roll is first made)


        /* get isBloodSurge() { return Boolean(D.LCase(D.GetStatVal(this._playerChar, "applybloodsurge"))) }
        get isDisciplineRoll() { return this._type.discipline }
        get isSpecialty() { return Boolean(D.LCase(D.GetStatVal(this._playerChar, "applyspecialty"))) }
        get isOpposed() { return Boolean(this._type.isFirstOpposed) }
        get isResonant() { return Boolean(D.LCase(D.GetStatVal(this._playerChar, "applyresonant"))) } */

        isChar(charRef) { return D.GetChar(charRef).id === this._char.id }
        isClan(clan) { return D.LCase(D.GetStatVal(this._char, "clan")) === D.LCase(clan) }
        hasTrait(traitRef) { return this._testFuncOnly || true }
        isInLocation(locRef) { return Session.IsInScene(this._char) && ([Session.District, Session.Site].includes(locRef)) }
        hasTokenAura(aura) { return Media.GetAuras(this._char).includes(aura) }
        hasMatchingDice(regexp) { return this.diceVals.filter((dVal) => regexp.test(dVal)).length > 0 }
        // #endregion ░░░░[CHECKS]░░░░
        // #region ░░░░░░░[MUTATORS]░░░░ Mutator Functions ░░░░░░░ ~
        addModifier(modifier, display) { }
        multiplyTrait(traitRef, multiplier, displayReplaceFunc, display = null) { }

        // This is how you handle rerolls!  An array of rerollDatas, and if there are any
        // in the array, player can reroll --- which shift()'s the 'used' reroll out.
        // Can then remove rerolls (for no reroll) or remove and then add (for changing params)
        // On construction of Roll inst, default reroll of 1/3 dice is added to trait rolls

        // Then, when parsing roll effect strings, you can create a "check" object where keys are funcs and vals are params
        // ... or wait no need to incorporate that OrReq/AndReq thing
        addWPReroll(cost = 1, numDice = 3, display = null) { }
        remWPReroll(index = 0) { }

        // ... whatever else you need; check handouts in Vampire for the specific parameters you made

        // #endregion ░░░░[MUTATORS]░░░░

        // #endregion ▄▄▄▄▄ ROLL EFFECTS ▄▄▄▄▄
    }
    // #endregion ▄▄▄▄▄ CLASS ▄▄▄▄▄

    // #region ░░░░░░░[GRAPHICS]░░░░ Graphical Dice Roller Control ░░░░░░░ ~
    //     #region ========== INITIALIZATION: Creation & Initialization =========== ~
    const makeDie = (dieCat, dieNum) => {};
    const makeAllDice = (diceCat) => {};
    const initDiceRoller = () => {
        // Filter GRAPHICROLLER.frame.images --> Arrays must be created from initial entry.
        Object.entries(GRAPHICROLLER.frame.images)
            .filter(([key, val]) => Array.isArray(val))
            .forEach(([imgPrefix, imgData]) => {
                const refData = Media.GetImgData(`${imgPrefix}1`);
                for (let i = 2; i <= imgData.length; i++) {
                    const imgKey = `${imgPrefix}${i}`;
                    Media.MakeImg(
                        imgKey,
                        {
                            imgsrc: refData.srcs.base,
                            top: refData.top,
                            left: refData.top + GRAPHICROLLER.frame.spread.min * (i - 1),
                            height: refData.height,
                            width: refData.width,
                            activeLayer: "map",
                            modes: refData.modes,
                            isActive: imgData[i - 1],
                            isDrawing: true
                        },
                        false,
                        true
                    );
                }
            });
        // Make Dice
        Object.keys(GRAPHICROLLER.dice).forEach((diceCat) => makeAllDice(diceCat));
        // Make Willpower Reroll Dragpad
        DragPads.MakePad("Roller_WPReroller_Base_1", "wpReroll");
        // Reset Frame to Initial State
        resetRoller();
    };
    //     #endregion _______ INITIALIZATIOn _______
    //     #region ========== CLEARING: Resetting & Clearing =========== ~
    const resetRoller = () => {
        const setImg = (imgKey, data) => {
            const setThisImg = (key, val) => {
                if (val === false) { Media.ToggleImg(key, false, true) } else { Media.SetImg(key, val, true) }
            };
            if (Array.isArray(data)) { data.forEach((thisData, i) => setThisImg(`${imgKey}${i + 1}`, thisData)) } else { setImg(imgKey, data) }
        };
        // Cycle through GRAPHICROLLER object entries, set and toggle accordingly
        Object.entries(GRAPHICROLLER.frame.imgObjs).forEach(([imgKey, data]) => setImg(imgKey, data));
        Object.entries(GRAPHICROLLER.dice).forEach((diceCat, catData) => {
            Object.entries(catData.imgObjs).forEach(([imgKey, data]) => setImg(imgKey, data));
        });
        Object.keys(GRAPHICROLLER.frame.textObjs).forEach((textKey) => Media.ToggleText(textKey, false, true));
        Object.keys(GRAPHICROLLER.frame.animObjs).forEach((animKey) => Media.ToggleAnim(animKey, false, true));
        // Reset image spread to default
        Media.Spread(
            "RollerFrame_Left",
            "RollerFrame_TopEnd",
            GRAPHICROLLER.frame.imgObjs.RollerFrame_Top_Mid_.map((__, i) => `RollerFrame_Top_Mid_${i + 1}`),
            1,
            GRAPHICROLLER.frame.spread.min,
            GRAPHICROLLER.frame.spread.max
        );
        // Toggle off DragPads
        DragPads.Toggle("selectDie", false);
        DragPads.Toggle("wpReroll", false);
        // Reset state records to initial values
        Object.entries(GRAPHICROLLER.initialState).forEach(([key, val]) => { STATE.REF[key] = D.Clone(val) });
    };
    const clearRoller = () => {
        // Delete DragPads
        DragPads.DelPad("selectDie");
        DragPads.DelPad("wpReroll");
        // Filter GRAPHICROLLER.frame.images --> Arrays indicate images to remove.
        Object.entries(GRAPHICROLLER.frame.images)
            .filter(([key, val]) => Array.isArray(val))
            .forEach(([imgPrefix, imgData]) => {
                for (let i = 2; i <= imgData.length; i++) { Media.RemoveImg(`${imgPrefix}${i}`) }
            });
        // Delete Dice
        Object.entries(GRAPHICROLLER.dice).forEach(([diceCat, catData]) => {
            for (let i = 2; i <= catData.qty; i++) { Media.RemoveImg(`RollerDie_${diceCat}_${i}`) }
        });
    };
    const fullDiceRollerReset = () => {
        if (D.IsFuncQueueClear("Roller")) {
            D.Queue(clearRoller, [], "Roller");
            D.Queue(initDiceRoller, [], "Roller", 5);
        }
    };
    //     #endregion _______ CLEARING _______
    // #endregion ░░░░[GRAPHICS]░░░░

    return {
        CheckInstall: checkInstall,
        OnChatCall: onChatCall,
        Roll
    };
})();

on("ready", () => {
    RollerNew.CheckInstall();
    D.Log("RollerNEW Ready!");
});
void MarkStop("RollerNEW");
