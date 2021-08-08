// #region ▒░▒░▒░▒[FRONT] Boilerplate Namespacing & Initialization ▒░▒░▒░▒ ~
const SCRIPTNAME = "RollerNew";

// #region Spoofing Roll 20
const state = {
    VAMPIRE: {
        Roller: {
            rollRecord: [
                {
                    charID: "-LtDpAXpWtQEr7AmQwB6",
                    playerID: "-Lt3NSz8cKkFxCrZsEmr",
                    rollID: "KjsD9HtwWr1740pG5oPd",
                    playerCharID: false,
                    type: "trait",
                    hunger: 3,
                    diffMod: 0,
                    prefix: "",
                    diff: 3,
                    mod: 7,
                    appliedRollEffects: [],
                    isNPCRoll: false,
                    isOblivionRoll: false,
                    isDiscRoll: true,
                    rollFlags: {
                        isHidingName: false,
                        isHidingTraits: false,
                        isHidingTraitVals: false,
                        isHidingDicePool: false,
                        isHidingDifficulty: false,
                        isHidingResult: false,
                        isHidingOutcome: false,
                        oppRollStatus: false,
                        isNPCRoll: false,
                        isDiscRoll: true,
                        isOblivionRoll: false
                    },
                    flags: [
                        {component: "dicePool", display: "Blood Surge (.)", delta: 2},
                        {component: "Blood Surge (.)", display: "Blood Surge x2", delta: "2.0", round: "up"},
                        {component: "dicePool", display: "Specialty (.)", delta: 1},
                        {component: "dicePool", display: "Injured (.)", delta: -2}
                    ],
                    posFlagLines: ["Blood Surge (●●●●)", "Discipline (●●) "],
                    negFlagLines: [],
                    redFlagLines: [],
                    goldFlagLines: [],
                    dicePool: 16,
                    posFlagMod: 6,
                    negFlagMod: 0,
                    traits: ["charisma", "disc3"],
                    traitData: {
                        charisma: {display: "Charisma", value: 5},
                        disc3: {display: "Presence", value: 5}
                    },
                    charName: "Agnes Bellanger",
                    basePool: 15,
                    hungerPool: 1
                }
            ]
        }
    }
};
const C = {
    RO: {
        OT: {
            RollerNew: {
                rollRecord: [
                ]
            }
        }
    }
};
const D = {
    GetChar: () => ({id: "ID_LockeUlrich"}),
    GetStatVal: () => Math.round(Math.random() * 5),
    GetDisplayName: (charID, trait) => trait.split(/[_ ]/).map((x) => `${x.charAt(0).toUpperCase()}${x.slice(1)}`).join(" "),
    GMID: () => "Storyteller_ID",
    Validate: () => true,
    DBAlert: (msg) => console.warn(msg),
    Log: (msg) => console.log(msg),
    Int: (str) => parseInt(str) || 0,
    Float: (str) => parseFloat(str) || 0,
    ThrowError: (msg) => console.error(msg),
    Clone: (obj) => JSON.parse(JSON.stringify(obj))
};
const Char = {
    IsCharSheetSecret: () => true
};
const randomString = (numChars) => {
    const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0912345678*&%#-";
    let string = "";
    while (string.length < numChars)
        string += CHARS.substr(Math.round(numChars * Math.random()), 1);

    return string;
};
    // #endregion

// #region COMMON INITIALIZATION
const STATE = {get REF() { return C.RO.OT[SCRIPTNAME] }};
const VAL = (varList, funcName, isArray = false) => D.Validate(varList, funcName, SCRIPTNAME, isArray);
const DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME);
const LOG = (msg, funcName) => D.Log(msg, funcName, SCRIPTNAME);
const THROW = (msg, funcName, errObj) => console.error(msg); // D.ThrowError(msg, funcName, SCRIPTNAME, errObj);

const checkInstall = () => {
    C.RO.OT[SCRIPTNAME] = C.RO.OT[SCRIPTNAME] || {};
    initialize();
};
    // #endregion

// #region LOCAL INITIALIZATION
const initialize = () => {
    STATE.REF.RollerNew = STATE.REF.RollerNew || {};
    /* [ // List Keys
        ].forEach((listKey) => { STATE.REF.RollerNew[key] = STATE.REF.RollerNew[key] || {} }); */
    [ // Array Keys
        "rollRecord"
    ].forEach((key) => { STATE.REF.RollerNew[key] = STATE.REF.RollerNew[key] || [] });
    Roll.initRegistry();
};
    // #endregion

// #region EVENT HANDLERS: (HANDLEINPUT)
const onChatCall = (call, args, objects, msg) => {
    switch (call) {
        case "":
            break;
            // no default
    }
};
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************
const FLAGS = [
    {
        name: "Blood Surge",
        display: ["pos", "Blood Surge (.)"],
        delta: (rollInst) => D.Int(D.GetStatVal(rollInst.charID, "bp_bloodsurge")),
        check: (rollInst) => D.Int(D.GetStatVal(rollInst.playerCharID, "applybloodsurge")) === 1,
        apply: (rollInst) => {
            // rollInst.dicePool += this.delta(rollInst);
        }
    },
    {
        name: "Blood Surge Mult",
        delta: 1,
        check: (rollInst) => "Blood Surge (.)" in rollInst.flags,
        apply: (rollInst) => {
            rollInst.flags["Blood Surge (.)"].delta = (_rollInst) => this.delta * D.Int(D.GetStatVal(_rollInst.charID, "bp_bloodsurge"));
        }
    }
];
const TRANSPARENCY = {
    PC: {
        public: {
            name: true,
            traits: true,
            traitVals: true,
            dicePool: true,
            difficulty: true,
            result: true,
            outcome: true
        },
        limited: {
            name: true,
            traits: true,
            traitVals: true,
            dicePool: true,
            difficulty: true,
            result: true,
            outcome: true
        },
        private: {
            name: true,
            traits: true,
            traitVals: true,
            dicePool: true,
            difficulty: true,
            result: true,
            outcome: true
        }
    },
    UnknownNPC: {
        public: {
            name: false,
            traits: true,
            traitVals: false,
            dicePool: false,
            difficulty: false,
            result: false,
            outcome: false
        },
        toController: {
            name: true,
            difficulty: true,
            outcome: true
        }
    },
    StrangerNPC: {
        public: {
            name: true,
            traits: true,
            traitVals: false,
            dicePool: false,
            difficulty: true,
            result: false,
            outcome: true
        },
        toController: {
            get traitVals() { return Char.IsCharSheetSecret(this.charID) },
            get dicePool() { return Char.IsCharSheetSecret(this.charID) }
        }
    },
    KnownNPC: {
        public: {
            name: true,
            traits: true,
            traitVals: false,
            dicePool: false,
            difficulty: true,
            result: true,
            outcome: true
        },
        toController: {
            get traitVals() { return Char.IsCharSheetSecret(this.charID) },
            get dicePool() { return Char.IsCharSheetSecret(this.charID) }
        }
    }
};
class Roll {
    // #region ~ STATIC METHODS, GETTERS & SETTERS
    static get REGISTRY() {
        this._REGISTRY = this._REGISTRY || [];
        return this._REGISTRY;
    }
    static set REGISTRY(v) { this._REGISTRY = v }
    static get RECORD() {
        STATE.REF.rollRecord = STATE.REF.rollRecord || [];
        return STATE.REF.rollRecord;
    }
    static set RECORD(v) { STATE.REF.rollRecord = v }

    static importLegacyRollData(lRollData) {
        if (!this.RECORD.map((rollData) => rollData.rollID).includes(lRollData.rollID))
            this.RECORD = [...this.RECORD, {
                rollID: lRollData.rollID,
                playerID: lRollData.playerID,
                charID: lRollData.charID,
                playerCharID: VAL({playerID: lRollData.playerID}) && D.GMID() !== lRollData.playerID && D.GetChar(lRollData.playerID).id || lRollData.charID,
                type: {
                    [lRollData.type]: true,
                    npc: Boolean(lRollData.isNPCRoll),
                    discipline: Boolean(lRollData.isDiscRoll),
                    oblivionRouse: Boolean(lRollData.isObvlivionRoll)
                },
                traits: lRollData.traits,
                flags: lRollData.flags,
                flagText: {
                    pos: [],
                    neg: [],
                    red: [],
                    gold: []
                },
                modifier: lRollData.mod,
                hunger: lRollData.hunger,
                difficulty: lRollData.diff,
                difficultyMod: lRollData.diffMod
            }];
    }
    static importLegacyRegistry() {
        state.VAMPIRE.Roller.rollRecord.forEach((lRollData) => this.importLegacyRollData(lRollData));
    }
    static initRegistry() {
        this.REGISTRY = [];
        for (const rollData of this.RECORD)
            this.registerRoll(new Roll(rollData));
    }
    static getCurrentRoll() { return this.REGISTRY[this.rollIndex ?? 0] }
    static getRollAtIndex(index) { return this.REGISTRY[index] }
    static registerRoll(rollInst) {
        console.log(`Registering ${JSON.stringify(rollInst)}`);
        if (rollInst instanceof Roll) {
            if (!rollInst.rollID)
                rollInst.rollID = randomString(20);
            else if (this.REGISTRY.find((rollData) => rollData.rollID === rollInst.rollID))
                throw new Error(`Attempt to register pre-existing roll: ${rollInst.rollID}\n\n${JSON.stringify(rollInst)}`);

            this.REGISTRY = [rollInst, ...this.REGISTRY];
            console.log(this.REGISTRY);
        }
    }
    static die() { return Math.ceil(Math.random() * 10) }
    static H() { return `H${Roll.die()}` }
    static B() { return `B${Roll.die()}` }

    // #endregion

    // #region ~ BASIC GETTERS & SETTERS

    // #endregion

    // #region ~ CONSTRUCTOR
    constructor(rollData) {
        // Minimum (i.e. new Roll)
        /*
                const rollData = {
                    rollID,
                    playerID,
                    charID,
                    playerCharID,
                    type,                          type: {
                                                        [lRollData.type]: true,
                                                        npc: Boolean(rollData.isNPCRoll),
                                                        discipline: Boolean(rollData.isDiscRoll),
                                                        oblivionRouse: Boolean(rollData.isObvlivionRoll)
                                                        },
                    traits,                        traits: [ "disc3", "charisma"] or ["repeating_ada2...", "animal_ken"] or ["Animal Ken", "Dominate"]
                    modifier,
                    hunger,
                    difficulty,
                    difficultyMod
                }
            */
        this._rollID = rollData.rollID;
        this._playerID = rollData.playerID;
        this._charID = rollData.charID;
        this._playerCharID = rollData.playerID === D.GMID() ? rollData.charID : rollData.playerCharID;
        Object.assign(this._type = {}, rollData.type);
        Object.assign(this._traits = [], rollData.traits || []);
        this._modifier = rollData.modifier;
        this._hunger = rollData.hunger;
        this._difficulty = rollData.difficulty;
        this._difficultyMod = rollData.difficultyMod;
        Object.assign(this._flags = [], rollData.flags || []);
        // Object.assign(this._transparency = {}, TRANSPARENCY, rollData.transparency);
        this.isResolved = false;
    }

    // this._rollStage = ENUMERATOR:
    //     (nothing: how it starts)
    //     ROLLABLE: result hasn't been calculated, but dice pools are correct and it can be rolled
    //     RESOLVED: roll made, outcome determined
    //     WAITINGFOROPPOSED: first roll of an opposed roll: waiting to "catch" the second roll

    // #endregion

    // #region ~ READ-ONLY GETTERS
    get modifier() { return this._modifier }
    get dicePoolComps() {
        this._dicePoolComps = this._dicePoolComps || {
            traits: this.compileTraits(),
            modifier: this._modifier,
            flags: this.applyFlags("dicePool"),
            effects: this.applyEffects("dicePool")
        };
        return this._dicePoolComps;
    }
    get dicePool() { return Object.values(this.dicePoolComps).reduce((tot, val) => tot + D.Int(val), 0) }
    get difficulty() { return this._difficulty + this._difficultyMod }


    get isUsingHungerDice() { return ("trait" in this._type) || ("secret" in this._type) }
    get hungerDice() { return this.isUsingHungerDice ? this._hunger : 0 }

    get H() { return this.diceRolls.filter((diceRoll) => /^H/.test(diceRoll)).length }
    get B() { return this.diceRolls.filter((diceRoll) => /^B/.test(diceRoll)).length }
    get Bc() { return this.diceRolls.filter((diceRoll) => /^B10$/.test(diceRoll)).length }
    get Hc() { return this.diceRolls.filter((diceRoll) => /^H10$/.test(diceRoll)).length }
    get Bs() { return this.diceRolls.filter((diceRoll) => /^B[6-9]$/.test(diceRoll)).length }
    get Hs() { return this.diceRolls.filter((diceRoll) => /^H[6-9]$/.test(diceRoll)).length }
    get Bf() { return this.diceRolls.filter((diceRoll) => /^B[1-5]$/.test(diceRoll)).length }
    get Hf() { return this.diceRolls.filter((diceRoll) => /^H[2-5]$/.test(diceRoll)).length }
    get Hb() { return this.diceRolls.filter((diceRoll) => /^H1$/.test(diceRoll)).length }
    get c() { return this.Bc + this.Hc }
    get s() { return this.Bs + this.Hs }
    get f() { return this.Bf + this.Hf }
    get b() { return this.Hb }

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

    // #endregion

    // #region ~ GENERAL GETTERS & SETTERS
    get diceRolls() { return this._diceRolls }
    set diceRolls(v) { this._diceRolls = v }
    get isResolved() { return this._isResolved }
    set isResolved(v) { this._isResolved = v }
    // #endregion

    // #region ░░░░░░░[Roll Effects]░░░░ Roll Effects ░░░░░░░ ~
    //     #region ========== Checks: Check Functions =========== ~
    isInLocation(locRef) {

    }
    const ROLLREQUIREMENTS = {
        clan: (rollInput, details, isInverting) => !rollInput.rolls
                                                && (isInverting ? D.LCase(D.GetStatVal(rollInput.charID, "clan")) !== D.LCase(details)
                                                : D.LCase(D.GetStatVal(rollInput.charID, "clan")) === D.LCase(details)),
        trait: (rollInput, details, isInverting) => {
            if (!rollInput.rolls)
                return false;
            if (["social", "mental", "physical"].includes(D.LCase(details)))
                details = [...C.ATTRIBUTES[D.LCase(details)], ...C.SKILLS[D.LCase(details)]];
            else
                details = [details];
            return isInverting ? _.intersection(rollInput.traits, details).length === 0 : _.intersection(rollInput.traits, details).length > 0;
        },
        aura: (rollInput, details, isInverting) => /* !rollInput.rolls && Media.GetAuras(rollInput.charID).includes(details), */ {
            const auras = Media.GetTokenModes(rollInput.charID);
            DB({charID: rollInput.charID, char: D.GetName(rollInput.charID), details, auras}, "ROLLREQUIREMENTS");
            return !rollInput.rolls
                && (isInverting ? !Media.GetTokenModes(rollInput.charID).includes(details)
                : Media.GetTokenModes(rollInput.charID).includes(details));
        },
        flag: (rollInput, details, isInverting) => {
            if (rollInput.rolls)
                return false;
            switch (details) {
                case "bloodsurge": return isInverting ? !_.any(rollInput.posFlagLines, (flagLine) => /Blood Surge/.test(flagLine))
                    : _.any(rollInput.posFlagLines, (flagLine) => /Blood Surge/.test(flagLine));
                case "specialty": return isInverting ? !_.any(rollInput.posFlagLines, (flagLine) => /Specialty/.test(flagLine))
                    : _.any(rollInput.posFlagLines, (flagLine) => /Specialty/.test(flagLine));
                case "resonant": return isInverting ? !_.any(rollInput.posFlagLines, (flagLine) => /Resonance/.test(flagLine))
                    : _.any(rollInput.posFlagLines, (flagLine) => /Resonance/.test(flagLine));
                case "discipline": return isInverting ? !rollInput.isDiscRoll
                    : rollInput.isDiscRoll;
                case "opposed": return isInverting ? !rollInput.rollFlags.isWaitingForOpposed
                    : rollInput.rollFlags.isWaitingForOpposed;
                // no default
            }
        },
        dice: (rollInput, details, isInverting) => rollInput.rolls
                                                && (isInverting ? !_.any(rollInput.diceVals || [], (dieVal) => new RegExp(details).test(dieVal))
                                                : _.any(rollInput.diceVals || [], (dieVal) => new RegExp(details).test(dieVal))),
        outcome: (rollInput, details, isInverting) => {
            if (!rollInput.rolls)
                return false;
            const rollOutcome = getRollOutcome(rollInput, rollInput);
            switch (details) {
                case "any": return !isInverting;
                case "crit": return isInverting ? !/crit/.test(rollOutcome) : /crit/.test(rollOutcome);
                case "fail": return isInverting ? !/fail/.test(rollOutcome) : /fail/.test(rollOutcome);
                case "succ": return isInverting ? !/crit|succ/.test(rollOutcome) : /crit|succ/.test(rollOutcome);
                case "basiccrit": return isInverting ? rollOutcome !== "crit" : rollOutcome === "crit";
                case "basicsucc": return isInverting ? rollOutcome !== "succ" : rollOutcome === "succ";
                case "basicfail": return isInverting ? rollOutcome !== "fail" : rollOutcome === "fail";
                default: return isInverting ? rollOutcome !== details : rollOutcome === details;
            }
        }
    };
    const ROLLEFFECTS = {
        integer: (rollInput, details) => {},
        postrait: (rollInput, details) => {},
        negtrait: (rollInput, details) => {},
        multtrait: (rollInput, details) => {},
        wpreroll: (rollInput, details) => {},
        cancel: (rollInput, details) => {},
        convert: (rollInput, details) => {}
    };
    const applyRollEffectsTEST = (rollInput) => {
        const checkScope = (rollCharID, rollEffectData) => !rollEffectData.scope
                                                        || rollEffectData.scope.length === 0
                                                        || rollEffectData.scope.includes("all")
                                                        || rollEffectData.scope.includes(rollCharID);
        const checkLocation = (rollEffectData) => !rollEffectData.location
                                               || [Session.District, Session.Site].includes(rollEffectData.location);
        const checkApplied = (rollEffectData) => !(rollInput.appliedRollEffects || []).includes(rollEffectData.flag)
                                               || (rollInput.rollEffectsToReapply || []).includes(rollEffectData.flag);
        const checkRequirements = (rollEffectData) => {
            let ORreqOK = false;
            for (const ORreq of rollEffectData.requirements.split("/")) {
                let ANDreqOK = true;
                for (const ANDreq of ORreq.split("+")) {
                    const [type, details] = ANDreq.replace(/^!/u, "").split(":");
                    ANDreqOK = ANDreqOK && ROLLREQUIREMENTS[type](rollInput, details, ANDreq.charAt(0) === "!");
                    if (!ANDreqOK)
                        break;
                }
                ORreqOK = ORreqOK || ANDreqOK;
                if (ORreqOK)
                    break;
            }
            return ORreqOK;
        };
        const applyEffect = (rollEffectData) => { /* mutates rollInput by applying specified effect */ };
        // const rollEffectString = D.GetStatVal(rollInput.charID, "rolleffects") || "";
        // let isReapplying = false;
        const validRollEffects = [];
        if (VAL({list: rollInput}, "applyRollEffects")) {
            // STEP ONE: FILTER ROLL EFFECTS USING FILTER FUNCTIONS (ABOVE)
            validRollEffects.push(
                ...STATE.REF.newRollEffects.general.filter((effect) => checkScope(rollInput.charID, effect)
                                                                    && checkApplied(effect)
                                                                    && checkRequirements(effect)),
                ...STATE.REF.newRollEffects.location.filter((effect) => checkScope(rollInput.charID, effect)
                                                                     && checkLocation(effect)
                                                                     && checkApplied(effect)
                                                                     && checkRequirements(effect))
            );

            D.Show(validRollEffects);
            return;

            /* rollInput.appliedRollEffects = rollInput.appliedRollEffects || [];
            const rollEffects = _.compact(
                _.without(
                    _.uniq([...rollEffectString.split("|"), ...Object.keys(STATE.REF.rollEffects), ...(rollInput.rollEffectsToReapply || [])]),
                    ...rollInput.appliedRollEffects
                )
            ); */
            const [rollData, rollResults] = rollInput.rolls ? [null, rollInput] : [rollInput, null];
            const checkInput = (input, rollMod, restriction) => {
                const innerTraceID = TRACEON("checkInput", [input, rollMod, restriction]);
                DB(
                    {
                        rollMod,
                        restriction,
                        "Boolean(input.rolls)": Boolean(input.rolls),
                        "D.IsIn(restriction/rollMod, RREFFECTS.restriction/rollMod)": Boolean(
                            D.IsIn(restriction, ROLLRESULTEFFECTS.restriction, true) || D.IsIn(rollMod, ROLLRESULTEFFECTS.rollMod, true)
                        )
                    },
                    "checkInput"
                );
                return TRACEOFF(
                    innerTraceID,
                    Boolean(input.rolls)
                        === Boolean(D.IsIn(restriction, ROLLRESULTEFFECTS.restriction, true) || D.IsIn(rollMod, ROLLRESULTEFFECTS.rollMod, true))
                );
            };
            const checkRestriction = (input, traits, flags, rollMod, restriction) => {
                const innerTraceID = TRACEON("checkRestriction", [input, traits, flags, rollMod, restriction]);
                DB({"Checking Restriction": restriction, traits, flags, rollMod}, "checkRestriction");
                // FIRST, check whether this restriction applies to the given input (either rollData or rollResults):
                if (!checkInput(input, rollMod, restriction)) {
                    DB("... checkInput returns FALSE: returning 'INAPPLICABLE'.", "checkRestriction");
                    return TRACEOFF(innerTraceID, "INAPPLICABLE");
                }
                DB("CheckInput returns TRUE: continuing validation.", "checkRestriction");
                if (restriction === "all") {
                    DB("... Restriction = ALL:  RETURNING TRUE", "checkRestriction");
                    return TRACEOFF(innerTraceID, true);
                }
                if (rollResults) {
                    // Does rollMod specify a willpower cost, but it is superceded by a nowpreroll restriction somewhere in the effect?
                    switch (rollMod) {
                        case "doublewpreroll":
                        case "freewpreroll":
                        case "restrictwpreroll1":
                        case "restrictwpreroll2":
                            // if (_.any(rollEffects, (v) => v.includes("nowpreroll"))) {
                            //     DB(`Willpower cost ${rollMod} SUPERCEDED by 'nowpreroll': ${D.JSL(rollEffects)}`, "checkRestriction");
                            //     return TRACEOFF(innerTraceID, "INAPPLICABLE");
                            // }
                            break;
                        // no default
                    }
                    // TEST: If rollResults and rollInput specifies a result restriction, check if it applies.
                    const effectiveMargin = input.total - (input.diff || 1); // All rolls have a base difficulty of one if difficulty isn't specified.
                    switch (restriction) {
                        case "success":
                            DB(
                                {
                                    rollResultsRestriction: restriction,
                                    test: "effectiveMargin >= 0",
                                    effectiveMargin,
                                    "passesRestriction?": effectiveMargin >= 0
                                },
                                "checkRestriction"
                            );
                            return TRACEOFF(innerTraceID, effectiveMargin >= 0);
                        case "failure":
                            DB(
                                {
                                    rollResultsRestriction: restriction,
                                    test: "effectiveMargin < 0",
                                    effectiveMargin,
                                    "passesRestriction?": effectiveMargin < 0
                                },
                                "checkRestriction"
                            );
                            return TRACEOFF(innerTraceID, effectiveMargin < 0);
                        case "basicfail":
                            DB(
                                {
                                    rollResultsRestriction: restriction,
                                    test: "effectiveMargin < 0 && input.H.botches === 0 && input.B.succs + input.H.succs > 0",
                                    effectiveMargin,
                                    "input.H.botches": input.H.botches,
                                    "input.B.succs": input.B.succs,
                                    "input.H.succs": input.H.succs,
                                    "passesRestriction?": effectiveMargin < 0 && input.H.botches === 0 && input.B.succs + input.H.succs > 0
                                },
                                "checkRestriction"
                            );
                            return TRACEOFF(innerTraceID, effectiveMargin < 0 && input.H.botches === 0 && input.B.succs + input.H.succs > 0); // fail AND not bestial fail AND not total fail
                        case "critical":
                            DB(
                                {
                                    rollResultsRestriction: restriction,
                                    test: "effectiveMargin >= 0 && input.critPairs.bb + input.critPairs.hb + input.critPairs.hh > 0",
                                    effectiveMargin,
                                    "passesRestriction?": effectiveMargin >= 0 && input.critPairs.bb + input.critPairs.hb + input.critPairs.hh > 0
                                },
                                "checkRestriction"
                            );
                            return TRACEOFF(innerTraceID, effectiveMargin >= 0 && input.critPairs.bb + input.critPairs.hb + input.critPairs.hh > 0);
                        case "basiccrit":
                            DB(
                                {
                                    rollResultsRestriction: restriction,
                                    test: "effectiveMargin >= 0 && input.critPairs.bb > 0 && input.critPairs.hh + input.critPairs.hb === 0",
                                    effectiveMargin,
                                    "passesRestriction?":
                                        effectiveMargin >= 0 && input.critPairs.bb > 0 && input.critPairs.hh + input.critPairs.hb === 0
                                },
                                "checkRestriction"
                            );
                            return TRACEOFF(
                                innerTraceID,
                                effectiveMargin >= 0 && input.critPairs.bb > 0 && input.critPairs.hh + input.critPairs.hb === 0
                            );
                        case "messycrit":
                            DB(
                                {
                                    rollResultsRestriction: restriction,
                                    test: "effectiveMargin >= 0 && input.critPairs.hh + input.critPairs.hb > 0",
                                    effectiveMargin,
                                    "passesRestriction?": effectiveMargin >= 0 && input.critPairs.hh + input.critPairs.hb > 0
                                },
                                "checkRestriction"
                            );
                            return TRACEOFF(innerTraceID, effectiveMargin >= 0 && input.critPairs.hh + input.critPairs.hb > 0);
                        case "bestialfail":
                            DB(
                                {
                                    rollResultsRestriction: restriction,
                                    test: "effectiveMargin < 0 && input.H.botches > 0",
                                    effectiveMargin,
                                    "passesRestriction?": effectiveMargin < 0 && input.H.botches > 0
                                },
                                "checkRestriction"
                            );
                            return TRACEOFF(innerTraceID, effectiveMargin < 0 && input.H.botches > 0);
                        case "totalfail":
                            DB(
                                {
                                    rollResultsRestriction: restriction,
                                    test: "input.B.succs + input.H.succs === 0",
                                    effectiveMargin,
                                    "passesRestriction?": input.B.succs + input.H.succs === 0
                                },
                                "checkRestriction"
                            );
                            return TRACEOFF(innerTraceID, input.B.succs + input.H.succs === 0);
                        case "costlyfail": {
                            // DB({
                            //     effectiveMargin,
                            //     HBotches: input.H.botches,

                            // })
                            return TRACEOFF(innerTraceID, effectiveMargin < 0 && effectiveMargin >= -2 && input.H.botches === 0 && input.total !== 0);
                        }
                        // no default
                    }
                }
                // After assessing rollData/rollResults-specific restrictions, check restrictions that apply to either:
                DB("Initial Thresholds PASSED.  Moving on to general restrictions.", "checkRestriction");
                if (D.IsIn(restriction, C.CLANS, true)) {
                    DB(`Restriction = CLAN.  Character Clan: ${D.GetStatVal(input.charID, "clan")}`, "checkRestriction");
                    if (!D.IsIn(D.GetStatVal(input.charID, "clan"), restriction, true)) {
                        DB("... Check FAILED.  Returning FALSE", "checkRestriction");
                        return TRACEOFF(innerTraceID, false);
                    }
                    DB("... Check PASSED. Moving on...", "checkRestriction");
                } else if (D.IsIn(restriction, C.SECTS, true)) {
                    DB(`Restriction = SECT.  Character Sect: ${D.GetStatVal(input.charID, "sect")}`, "checkRestriction");
                    if (!D.IsIn(D.GetStatVal(input.charID, "sect"), restriction, true)) {
                        DB("... Check FAILED.  Returning FALSE", "checkRestriction");
                        return TRACEOFF(innerTraceID, false);
                    }
                    DB("... Check PASSED. Moving on...", "checkRestriction");
                    // TEST: If restriction is "physical", "social" or "mental", does an appropriate trait match?
                } else if (D.IsIn(restriction, ["physical", "mental", "social"], true)) {
                    DB(`Restriction = ARENA.  Trait Keys: ${D.JSL(Object.keys(traits))}`, "checkRestriction");
                    if (
                        !_.intersection(
                            _.map([...C.ATTRIBUTES[restriction], ...C.SKILLS[restriction]], (v) => v.toLowerCase()),
                            Object.keys(traits)
                        ).length
                    ) {
                        DB("... Check FAILED.  Returning FALSE", "checkRestriction");
                        return TRACEOFF(innerTraceID, false);
                    }
                    DB("... Check PASSED. Moving on...", "checkRestriction");
                    // TEST: If restriction starts with "char:", is the named character rolling?
                } else if (restriction.startsWith("char:")) {
                    DB(`Restriction = CHARACTER.  ID: ${(D.GetChar(restriction.replace(/char:/gu, "")) || {id: false}).id}`, "checkRestriction");
                    if (input.charID !== (D.GetChar(restriction.replace(/char:/gu, "")) || {id: false}).id) {
                        DB("... Check FAILED.  Returning FALSE", "checkRestriction");
                        return TRACEOFF(innerTraceID, false);
                    }
                    DB("... Check PASSED. Moving on...", "checkRestriction");
                } else if (restriction.startsWith("loc:")) {
                    DB("Restriction = LOCATION", "checkRestriction");
                    const loc = restriction.replace(/loc:/gu, "");
                    const locations = {center: [], left: [], right: []};
                    if (Media.IsActive("DistrictCenter")) {
                        locations.center.push(Media.GetImgData("DistrictCenter").activeSrc);
                        if (!Media.IsActive("DiscableLocLeft"))
                            locations.left.push(Media.GetImgData("DistrictCenter").activeSrc);
                        if (!Media.IsActive("DiscableLocRight"))
                            locations.right.push(Media.GetImgData("DistrictCenter").activeSrc);
                    } else if (Media.IsActive("DistrictLeft")) {
                        delete locations.center;
                        if (!Media.IsActive("DiscableLocLeft"))
                            locations.left.push(Media.GetImgData("DistrictLeft").activeSrc);
                        if (!Media.IsActive("DiscableLocRight"))
                            locations.right.push(Media.GetImgData("DistrictRight").activeSrc);
                    }
                    for (const locPos of Object.keys(locations))
                        switch (locPos) {
                            case "center": {
                                if (Media.IsActive("SiteCenter")) {
                                    locations.center.push(Media.GetImgData("SiteCenter").activeSrc);
                                    delete locations.left;
                                    delete locations.right;
                                } else {
                                    if (Media.IsActive("SiteLeft") && !Media.IsActive("DiscableLocLeft") && !Media.IsActive("DisableSiteLeft") && !Media.IsActive("DisableSiteBottomAll")) {
                                        delete locations.center;
                                        locations.left.push(Media.GetImgData("SiteLeft").activeSrc);
                                    }
                                    if (Media.IsActive("SiteRight") && !Media.IsActive("DiscableLocRight") && !Media.IsActive("DisableSiteRight") && !Media.IsActive("DisableSiteBottomAll")) {
                                        delete locations.center;
                                        locations.right.push(Media.GetImgData("SiteRight").activeSrc);
                                    }
                                }
                                break;
                            }
                            case "left": {
                                if (Media.IsActive("SiteLeft") && !Media.IsActive("DiscableLocLeft") && !Media.IsActive("DisableSiteLeft") && !Media.IsActive("DisableSiteBottomAll"))
                                    locations.left.push(Media.GetImgData("SiteLeft").activeSrc);
                                break;
                            }
                            case "right": {
                                if (Media.IsActive("SiteRight") && !Media.IsActive("DiscableLocRight") && !Media.IsActive("DisableSiteRight") && !Media.IsActive("DisableSiteBottomAll"))
                                    locations.right.push(Media.GetImgData("SiteRight").activeSrc);
                                break;
                            }
                            // no default
                        }
                    locations.center = locations.center || [];
                    locations.left = locations.left || [];
                    locations.right = locations.right || [];
                    DB(`... ${D.JSL(loc)} vs. ${D.JSL(locations)}`, "checkRestriction");
                    const [charToken] = Media.GetTokens(input.charID);
                    if (locations.center.length) {
                        if (!D.IsIn(loc, locations.center, true)) {
                            DB("... CENTER LOCATION Check FAILED.  Returning FALSE", "checkRestriction");
                            return TRACEOFF(innerTraceID, false);
                        }
                        DB("... Check PASSED. Moving on...", "checkRestriction");
                    } else if (Media.IsInside(charToken, "sandboxLeft")) {
                        if (!D.IsIn(loc, locations.left, true)) {
                            DB("... LEFT LOCATION Check FAILED.  Returning FALSE", "checkRestriction");
                            return TRACEOFF(innerTraceID, false);
                        }
                        DB("... Check PASSED. Moving on...", "checkRestriction");
                    } else if (!D.IsIn(loc, locations.right, true)) {
                        DB("... RIGHT LOCATION Check FAILED.  Returning FALSE", "checkRestriction");
                        return TRACEOFF(innerTraceID, false);
                    }
                    DB("... Check PASSED. Moving on...", "checkRestriction");
                    // TEST: If none of the above, does restriction match a trait or a flag?
                } else if (!D.IsIn(restriction, [...Object.keys(traits), ...Object.keys(flags)], true)) {
                    DB(
                        `TRAIT/FLAG check FAILED for: ${D.JSL(Object.keys(traits))} and ${D.JSL(Object.keys(flags))}, returning FALSE`,
                        "checkRestriction"
                    );
                    return TRACEOFF(innerTraceID, false);
                }
                // If effect passes all of the threshold tests, return true.
                DB("All Threshold Checks Passed!  Returning TRUE", "checkRestriction");
                return TRACEOFF(innerTraceID, true);
            };
            // for (const effectString of rollEffects) {
            //     // First, check if the global effect state variable holds an exclusion for this character ID AND effect isn't in rollEffectsToReapply.
            //     if (STATE.REF.rollEffects[effectString] && STATE.REF.rollEffects[effectString].includes(rollInput.charID))
            //         continue;
            //     // Parse the effectString for all of the relevant parameters
            //     let [rollRestrictions, rollMod, rollLabel, removeWhen] = effectString.split(";"),
            //         [rollTarget, rollTraits, rollFlags] = ["", {}, {}];
            //     [rollMod, rollTarget] = _.map(rollMod.split(":"), (v) => D.Int(v) || v.toLowerCase());
            //     rollRestrictions = _.map(rollRestrictions.split("/"), (v) => v.toLowerCase());
            //     rollTraits = _.object(
            //         _.map(Object.keys(rollInput.traitData), (v) => v.toLowerCase()),
            //         _.map(_.values(rollInput.traitData), (v) => D.Int(v.value))
            //     );
            //     DB({effectString, rollRestrictions, rollMod, rollLabel, removeWhen, rollTarget, rollTraits, rollFlags}, "applyRollEffects");
            //     // Before parsing rollFlags, filter out the ones that have already been converted into strings:
            //     DB(
            //         `Checking Filtered Flag Error: ${D.JSL([
            //             ...rollInput.posFlagLines,
            //             ...rollInput.negFlagLines,
            //             ...rollInput.redFlagLines,
            //             ...rollInput.goldFlagLines
            //         ])}`,
            //         "applyRollEffects"
            //     );
            //     const filteredFlags = _.reject(
            //         [...rollInput.posFlagLines, ...rollInput.negFlagLines, ...rollInput.redFlagLines, ...rollInput.goldFlagLines],
            //         (v) => _.isString(v)
            //     );
            //     rollFlags = _.object(
            //         _.map(filteredFlags, (v) => v[1].toLowerCase().replace(/\s*?\(●*?\)/gu, "")),
            //         _.map(filteredFlags, (v) => v[0])
            //     );
            //     DB(`Roll Traits: ${D.JSL(rollTraits)}<br>Roll Flags: ${D.JSH(rollFlags)}`, "applyRollEffects");

            //     // THRESHOLD TEST OF ROLLTARGET: IF TARGET SPECIFIED BUT DOES NOT EXIST, SKIP PROCESSING THIS ROLL EFFECT.
            //     if (
            //         VAL({string: rollTarget})
            //         && !D.IsIn(rollTarget, Object.keys(rollTraits), true)
            //         && !D.IsIn(rollTarget, Object.keys(rollFlags), true)
            //     ) {
            //         DB(`Roll Target ${rollTarget} NOT present, SKIPPING EFFECT.`, "applyRollEffects");
            //         continue;
            //     }

            //     // THRESHOLD TESTS OF RESTRICTION: Parse each "OR" roll restriction (/) into "AND" restrictions (+), and finally the "NOT" restriction (!)
            //     let isORSatisfied = false;
            //     DB(
            //         `BEGINNING TESTS OF RESTRICTION: "<b><u>${D.JSL(effectString)}</u></b><br>... --- ${
            //             rollRestrictions.length
            //         } OR-RESTRICTIONS: ${D.JSL(rollRestrictions)}`,
            //         "applyRollEffects"
            //     );
            //     for (const orRestrict of rollRestrictions) {
            //         const andRestrict = orRestrict.split("+");
            //         DB(
            //             `... Checking OR-RESTRICTION <b>'${D.JSL(orRestrict)}'</b>.  ${andRestrict.length} AND-RESTRICTIONS: ${D.JSL(andRestrict)}`,
            //             "applyRollEffects"
            //         );
            //         let isANDSatisfied = true;
            //         for (const restriction of andRestrict) {
            //             if (restriction.charAt(0) === "!") {
            //                 DB(`... ... Checking <u>NEGATED</u> AND-RESTRICTION <b>'${D.JSL(restriction)}'</b>...`, "applyRollEffects");
            //                 isANDSatisfied = checkRestriction(rollInput, rollTraits, rollFlags, rollMod, restriction.slice(1)) === false;
            //             } else {
            //                 DB(`... ... Checking AND-RESTRICTION <b>'${D.JSL(restriction)}'</b>...`, "applyRollEffects");
            //                 isANDSatisfied = checkRestriction(rollInput, rollTraits, rollFlags, rollMod, restriction) === true;
            //             }
            //             if (!isANDSatisfied)
            //                 break;
            //         }
            //         DB(`IsEffectValid = ${D.JSL(isANDSatisfied)}`, "applyRollEffects");
            //         if (isANDSatisfied) {
            //             isORSatisfied = true;
            //             break;
            //         }
            //     }
            //     DB(`IsEffectOKAY = ${D.JSL(isORSatisfied)}`, "applyRollEffects");
            //     if (!isORSatisfied)
            //         continue;

            //     DB("Threshold Tests Passed!", "applyRollEffects");
            //     // THRESHOLD TESTS PASSED.  CHECK FOR 'ISONCEONLY' AND FIRE IT ACCORDINGLY
            //     // If "isOnceOnly" set, add an exclusion to the global state variable OR remove this effect from the character-specific attribute.
            //     switch (removeWhen || "never") {
            //         case "never":
            //             break;
            //         case "once":
            //             if (STATE.REF.rollEffects[effectString])
            //                 STATE.REF.rollEffects[effectString] = _.union(STATE.REF.rollEffects[effectString], [rollInput.charID]);
            //             else
            //                 setAttrs(rollInput.charID, {
            //                     rolleffects: _.compact(
            //                         D.GetStatVal(rollInput.charID, "rolleffects")
            //                             .replace(effectString, "")
            //                             .replace(/\|\|/gu, "|")
            //                             .split("|")
            //                     ).join("|")
            //                 });
            //             break;
            //         default:
            //             TimeTracker.SetAlarm(
            //                 removeWhen,
            //                 "deleffects",
            //                 `Remove Effect from ${D.GetName(rollInput.charID)}:`,
            //                 "delrolleffect",
            //                 [rollInput.charID, effectString],
            //                 false
            //             );
            //             break;
            //     }
            //     // FIRST ROLLMOD PASS: CONVERT TO NUMBER.
            //     // Check whether parsing RollData or RollResults
            //     let isEffectMoot = false;
            //     if (VAL({list: rollData})) {
            //         DB(`Validated RollData: ${D.JSL(rollData)}`, "applyRollEffects");
            //         // Is rollMod a number?
            //         if (VAL({number: rollMod})) {
            //             // If rollMod is a number, Is there a rollTarget?
            //             if (VAL({string: rollTarget}))
            //                 if (D.IsIn(rollTarget, Object.keys(rollTraits), true))
            //                     // If so, is the rollTarget present in traits?
            //                     // If so, cap any negative modifier to the value of the target trait (i.e. no negative traits)
            //                     rollMod = rollMod < 0 ? Math.max(-1 * rollTraits[rollTarget], rollMod) : rollMod;
            //                 // If not in traits, rollTarget must be in flags (validation happened above)
            //                 // Cap any negative modifier to the value of the flag (i.e. no negative flags)
            //                 else
            //                     rollMod = rollMod < 0 ? Math.max(-1 * _.find(rollFlags, (v, k) => k.includes(rollTarget)), rollMod) : rollMod;
            //             // (If no rollTarget, apply mod as a straight modifier --- i.e. unchanged until capping, below.)
            //         } else {
            //             // If rollMod isn't a number, is it adding or subtracting a trait value?
            //             if (rollMod.includes("postrait")) {
            //                 rollMod = D.Int(D.GetStatVal(rollData.charID, rollMod.replace(/postrait/gu, "")));
            //             } else if (rollMod.includes("negtrait")) {
            //                 rollMod = -1 * D.Int(D.GetStatVal(rollData.charID, rollMod.replace(/negtrait/gu, "")));
            //             // If not postrait/negtrait, is it a multiplier?
            //             } else if (rollMod.startsWith("x") && VAL({number: rollMod.replace(/x/gu, "")})) {
            //                 if (VAL({string: rollTarget}))
            //                     // If so, is there a rollTarget?
            //                     // If so, is the rollTarget present in traits?
            //                     if (D.IsIn(rollTarget, Object.keys(rollTraits), true))
            //                         // If so, multiply trait accordingly (rounding DOWN to a minimum of one) and set rollMod to the difference.
            //                         rollMod
            //                             = Math.max(1, Math.floor(rollTraits[rollTarget] * parseFloat(rollMod.replace(/x/gu, ""))))
            //                             - rollTraits[rollTarget];
            //                     // If not in traits, rollTarget must be in flags (validation happened above)
            //                     // If so, multiply the flag accordingly (rounding DOWN to a minimum of one) and set rollMod to the difference.
            //                     else
            //                         rollMod
            //                             = Math.max(
            //                                 1,
            //                                 Math.floor(_.find(rollFlags, (v, k) => k.includes(rollTarget)) * parseFloat(rollMod.replace(/x/gu, "")))
            //                             ) - _.find(rollFlags, (v, k) => k.includes(rollTarget));
            //                 // Otherwise, multiply the whole dice pool by the multiplier, rounding DOWN to a minimum of one, and set rollMod to the difference.
            //                 else
            //                     rollMod = Math.max(1, Math.floor(rollData.dicePool * parseFloat(rollMod.replace(/x/gu, "")))) - rollData.dicePool;

            //             // If not a multiplier, is it a dice changer?
            //             } else if (rollMod === "nohungerdice") {
            //                 rollMod = 0;
            //                 rollData.hunger = 0;
            //                 rollData.basePool += rollData.hungerPool;
            //                 rollData.hungerPool = 0;
            //             }
            //         }

            //         // FIRST ROLLMOD PASS COMPLETE: ROLLMOD SHOULD BE AN INTEGER BY THIS POINT.
            //         if (!isEffectMoot)
            //             if (VAL({number: rollMod}, "applyRollEffects")) {
            //                 // Adjust dice pool by rollMod.
            //                 rollData.dicePool += rollMod;
            //                 if (rollMod > 0)
            //                     rollData.posFlagMod += rollMod;
            //                 else
            //                     rollData.negFlagMod += rollMod;
            //                 if (rollData.basePool + rollMod < 0) {
            //                     rollData.hungerPool += rollData.basePool + rollMod;
            //                     rollData.basePool = 0;
            //                 } else {
            //                     rollData.basePool += rollMod;
            //                 }

            //                 // Check to see if rollLabel is calling for a RegEx replacement, and perform the calculations.
            //                 if (rollLabel.charAt(0) === "*") {
            //                     const regexData = _.object(["traitString", "regexString", "replaceString"], rollLabel.split("~"));
            //                     DB(`RegExData: ${D.JSL(regexData)}`, "applyRollEffects");
            //                     let isContinuing = true;
            //                     // Identify the target: either a trait or a flag. Start with traits (since flags will sometimes reference them,
            //                     // and if they do, you want to apply the effect to the trait).
            //                     for (const trait of Object.keys(rollData.traitData))
            //                         if (D.FuzzyMatch(rollData.traitData[trait].display, regexData.traitString)) {
            //                             DB(`... Trait Found: ${D.JSL(rollData.traitData[trait])}`, "applyRollEffects");
            //                             rollData.traitData[trait].display = rollData.traitData[trait].display.replace(
            //                                 new RegExp(regexData.regexString, "gu"),
            //                                 regexData.replaceString
            //                             );
            //                             rollData.traitData[trait].value = Math.max(0, rollData.traitData[trait].value + rollMod);
            //                             DB(`... Changed To: ${D.JSL(rollData.traitData[trait])}`, "applyRollEffects");
            //                             isContinuing = false;
            //                             break;
            //                         }
            //                     // If none found, check the flags:
            //                     for (const flagType of ["posFlagLines", "negFlagLines", "redFlagLines", "goldFlagLines"]) {
            //                         if (!isContinuing)
            //                             break;
            //                         for (let i = 0; i < rollData[flagType].length; i++)
            //                             if (D.FuzzyMatch(rollData[flagType][i][1], regexData.traitString)) {
            //                                 DB(`... Flag Found: ${D.JSL(rollData[flagType][i][1])}`, "applyRollEffects");
            //                                 isContinuing = false;
            //                                 rollData[flagType][i] = [
            //                                     rollData[flagType][i][0] + rollMod,
            //                                     rollData[flagType][i][1].replace(new RegExp(regexData.regexString, "gu"), regexData.replaceString)
            //                                 ];
            //                                 DB(`... Changed To: ${D.JSL(rollData[flagType][i][1])}`, "applyRollEffects");
            //                                 break;
            //                             }
            //                     }
            //                 } else {
            //                     // If not a regex replacement, add the rollLabel to the appropriate flag category.
            //                     if (rollLabel.charAt(0) === "!")
            //                         rollData.redFlagLines.push([rollMod, rollLabel.replace(/^!\s*/gu, "")]);
            //                     else if (rollMod > 0 || rollLabel.charAt(0) === "+")
            //                         rollData.posFlagLines.push([rollMod, rollLabel.replace(/^[+-]\s*/gu, "")]);
            //                     else if (rollMod < 0 || rollLabel.charAt(0) === "-")
            //                         rollData.negFlagLines.push([rollMod, rollLabel.replace(/^[+-]\s*/gu, "")]);
            //                     else
            //                         rollData.goldFlagLines.push([rollMod, rollLabel]);
            //                 }
            //             }

            //         // FINISHED!  ADD EFFECT TO APPLIED ROLL EFFECTS UNLESS EFFECT SAYS NOT TO.
            //         if (!isReapplying)
            //             rollData.appliedRollEffects = _.union(rollData.appliedRollEffects, [effectString]);
            //     } else if (VAL({list: rollResults}, "applyRollEffects")) {
            //         // RollResults rollMods all contain discrete flags/strings, plus digits; can wipe digits for static flag:
            //         DB(`Roll Results applies!  Testing rollMod replace switch: ${rollMod.toString().replace(/\d/gu, "")}`, "applyRollEffects");
            //         switch (rollMod.toString().replace(/\d/gu, "")) {
            //             case "restrictwpreroll": {
            //                 if (rollResults.isNoWPReroll) {
            //                     isEffectMoot = true;
            //                     break;
            //                 }
            //                 rollResults.maxRerollDice = D.Int(rollMod.replace(/\D*/gu, ""));
            //                 break;
            //             }
            //             case "freewpreroll":
            //                 if (rollResults.isNoWPReroll) {
            //                     isEffectMoot = true;
            //                     break;
            //                 }
            //                 rollResults.wpCostAfterReroll = VAL({number: rollResults.wpCost}) ? rollResults.wpCost : 1;
            //                 rollResults.wpCost = 0;
            //                 DB(
            //                     `Setting Roll Results Costs:<br>... After Reroll: ${rollResults.wpCostAfterReroll}<br>... WP Cost: ${rollResults.wpCost}`,
            //                     "applyRollEffects"
            //                 );
            //                 break;
            //             case "nowpreroll":
            //                 if (rollResults.isNoWPReroll) {
            //                     isEffectMoot = true;
            //                     break;
            //                 }
            //                 rollResults.isNoWPReroll = true;
            //                 rollResults.wpCostAfterReroll = rollResults.wpCostAfterReroll || rollResults.wpCost;
            //                 DB(
            //                     `Setting Roll Results Costs:<br>... After Reroll: ${rollResults.wpCostAfterReroll}<br>... WP Cost: ${rollResults.wpCost}`,
            //                     "applyRollEffects"
            //                 );
            //                 break;
            //             case "doublewpreroll":
            //                 if (rollResults.isNoWPReroll) {
            //                     isEffectMoot = true;
            //                     break;
            //                 }
            //                 if (VAL({number: rollResults.wpCostAfterReroll}))
            //                     rollResults.wpCostAfterReroll = 2;
            //                 else
            //                     rollResults.wpCost = 2;
            //                 DB(
            //                     `Setting Roll Results Costs:<br>... After Reroll: ${rollResults.wpCostAfterReroll}<br>... WP Cost: ${rollResults.wpCost}`,
            //                     "applyRollEffects"
            //                 );
            //                 break;
            //             case "bestialcancelsucc": {
            //                 isReapplying = true;
            //                 if (rollResults.diceVals.filter((x) => x === "Hb").length === 0 || rollResults.total <= 0 || rollResults.B.succs === 0) {
            //                     isEffectMoot = true;
            //                     break;
            //                 }
            //                 const botchCount = rollResults.diceVals.filter((x) => x === "Hb").length;
            //                 for (let i = 0; i < botchCount; i++) {
            //                     const diceValIndex = _.findIndex(rollResults.diceVals, (v) => v.includes("Bs"));
            //                     const botchIndex = _.findIndex(rollResults.diceVals, (v) => v === "Hb");
            //                     DB(`diceValIndex: ${diceValIndex}, botchIndex: ${botchIndex}`, "applyRollEffects");
            //                     if (diceValIndex < 0)
            //                         continue;
            //                     rollResults.diceVals[botchIndex] = "HCb";
            //                     rollResults.diceVals[diceValIndex] = "BXs";
            //                     rollResults.B.succs--;
            //                     rollResults.B.fails++;
            //                     rollResults.total--;
            //                 }
            //                 break;
            //             }
            //             case "bestialcancelcrit": {
            //                 isReapplying = true;
            //                 if (
            //                     rollResults.diceVals.filter((x) => x === "Hb").length === 0
            //                     || rollResults.total <= 0
            //                     || rollResults.diceVals.filter((x) => x.includes("Bc")).length === 0
            //                 ) {
            //                     // Moot if there are no bestial dice or no successes to cancel.
            //                     isEffectMoot = true;
            //                     break;
            //                 }
            //                 const botchCount = rollResults.diceVals.filter((x) => x === "Hb").length;
            //                 for (let i = 0; i < botchCount; i++) {
            //                     const diceValIndex = _.findIndex(rollResults.diceVals, (v) => v.includes("Bc"));
            //                     const botchIndex = _.findIndex(rollResults.diceVals, (v) => v === "Hb");
            //                     const diceVal = rollResults.diceVals[diceValIndex];
            //                     if (diceValIndex < 0)
            //                         continue;
            //                     rollResults.diceVals[botchIndex] = "HCb";
            //                     switch (diceVal) {
            //                         case "BcL":
            //                         case "BcR":
            //                             if (diceVal === "BcL") {
            //                                 rollResults.diceVals[diceValIndex + 1] = "Bc";
            //                                 rollResults.critPairs.bb--;
            //                                 rollResults.B.crits++;
            //                             } else {
            //                                 rollResults.diceVals[diceValIndex - 1] = "Hc";
            //                                 rollResults.critPairs.hb--;
            //                                 rollResults.H.crits++;
            //                             }
            //                             rollResults.diceVals[diceValIndex] = "BXc";
            //                             rollResults.B.fails++;
            //                             rollResults.total -= 3;
            //                             break;
            //                         case "Bc":
            //                             rollResults.diceVals[diceValIndex] = "BXc";
            //                             rollResults.B.crits--;
            //                             rollResults.B.fails++;
            //                             rollResults.total--;
            //                             break;
            //                         default:
            //                             break;
            //                     }
            //                 }
            //                 break;
            //             }
            //             case "bestialcancelall": {
            //                 isReapplying = true;
            //                 if (
            //                     rollResults.diceVals.filter((x) => x === "Hb").length === 0
            //                     || rollResults.total <= 0
            //                     || rollResults.diceVals.filter((x) => x.includes("Bc") || x.includes("Bs")).length === 0
            //                 ) {
            //                     // Moot if there are no bestial dice or no successes to cancel.
            //                     isEffectMoot = true;
            //                     break;
            //                 }
            //                 const botchCount = rollResults.diceVals.filter((x) => x === "Hb").length;
            //                 for (let i = 0; i < botchCount; i++) {
            //                     const diceValIndex = _.findIndex(rollResults.diceVals, (v) => (rollResults.diceVals.filter((x) => x.includes("Bc")).length > 0 ? v.includes("Bc") : v.includes("Bs")));
            //                     const botchIndex = _.findIndex(rollResults.diceVals, (v) => v === "Hb");
            //                     const diceVal = rollResults.diceVals[diceValIndex];
            //                     if (diceValIndex < 0)
            //                         continue;
            //                     rollResults.diceVals[botchIndex] = "HCb";
            //                     switch (diceVal) {
            //                         case "BcL":
            //                         case "BcR":
            //                             if (diceVal === "BcL") {
            //                                 rollResults.diceVals[diceValIndex + 1] = "Bc";
            //                                 rollResults.critPairs.bb--;
            //                                 rollResults.B.crits++;
            //                             } else {
            //                                 rollResults.diceVals[diceValIndex - 1] = "Hc";
            //                                 rollResults.critPairs.hb--;
            //                                 rollResults.H.crits++;
            //                             }
            //                             rollResults.diceVals[diceValIndex] = "BXc";
            //                             rollResults.B.fails++;
            //                             rollResults.total -= 3;
            //                             break;
            //                         case "Bc":
            //                         case "Bs":
            //                             if (diceVal === "Bc") {
            //                                 rollResults.diceVals[diceValIndex] = "BXc";
            //                                 rollResults.B.crits--;
            //                             } else {
            //                                 rollResults.diceVals[diceValIndex] = "BXs";
            //                                 rollResults.B.succs--;
            //                             }
            //                             rollResults.B.fails++;
            //                             rollResults.total--;
            //                             break;
            //                         default:
            //                             break;
            //                     }
            //                 }
            //                 break;
            //             }
            //             case "totalfailure":
            //                 if (rollResults.B.succs + rollResults.H.succs === 0) {
            //                     // Moot if the roll result is already a Total Failure
            //                     isEffectMoot = true;
            //                     break;
            //                 }
            //                 for (let i = 0; i < rollResults.diceVals; i++) {
            //                     rollResults.diceVals = _.map(rollResults.diceVals, (v) => {
            //                         v.replace(/([BH])([csb])[LR]*?$/gu, "$1X$2");
            //                     });
            //                     rollResults.total = 0;
            //                     rollResults.B = {
            //                         crits: 0,
            //                         succs: 0,
            //                         fails: _.reject(rollResults.rolls, (v) => v.includes("H")).length
            //                     };
            //                     rollResults.H = {
            //                         crits: 0,
            //                         succs: 0,
            //                         fails: rollResults.total - rollResults.B.fails,
            //                         botches: 0
            //                     };
            //                     rollResults.critPairs = {
            //                         bb: 0,
            //                         hb: 0,
            //                         hh: 0
            //                     };
            //                 }
            //                 break;
            //             case "nomessycrit":
            //                 rollResults.noMessyCrit = true;
            //                 isReapplying = true;
            //                 break;
            //             case "nobestialfail":
            //                 rollResults.noBestialFail = true;
            //                 isReapplying = true;
            //                 break;
            //             case "nocrit": {
            //                 rollResults.diceVals = rollResults.diceVals.map((x) => x.replace(/(.*?)c.*/u, "$1s"));
            //                 rollResults.total -= Object.values(rollResults.critPairs).reduce((tot, x) => x + tot, 0) * 2;
            //                 if (VAL({number: rollResults.margin}))
            //                     rollResults.margin -= Object.values(rollResults.critPairs).reduce((tot, x) => x + tot, 0) * 2;
            //                 rollResults.B.succs += rollResults.B.crits + 2 * rollResults.critPairs.bb + rollResults.critPairs.hb;
            //                 rollResults.H.succs += rollResults.H.crits + 2 * rollResults.critPairs.hh + rollResults.critPairs.hb;
            //                 rollResults.critPairs = {bb: 0, hb: 0, hh: 0};
            //                 rollResults.B.crits = 0;
            //                 rollResults.H.crits = 0;
            //                 rollResults.noCrit = true;
            //                 isReapplying = true;
            //                 break;
            //             }
            //             case "mustcostlyfail": {
            //                 rollResults.isCostlyMandatory = true;
            //                 isReapplying = true;
            //                 break;
            //             }
            //             default:
            //                 break;
            //         }
            //         if (rollResults.diff && rollResults.diff !== 0)
            //             rollResults.margin = rollResults.total - rollResults.diff;

            //         DB(`INTERIM Roll Results: ${D.JSL(rollResults)}`, "applyRollEffects");

            //         // Roll flags are PRE-PARSED for rollResults (they get parsed in between rollData and rollResults creation, in other functions)
            //         if (!isEffectMoot) {
            //             rollLabel = rollLabel
            //                 .replace(/<\.>/gu, "●".repeat(Math.abs(rollMod)))
            //                 .replace(/<#>/gu, rollMod === 0 ? "~" : rollMod)
            //                 .replace(/<abs>/gu, rollMod === 0 ? "~" : Math.abs(rollMod))
            //                 .replace(/<\+>/gu, rollMod < 0 ? "-" : "+");
            //             if (rollLabel.charAt(0) === "!")
            //                 rollResults.redFlagLines.push(rollLabel.replace(/^!\s*/gu, ""));
            //             else if (rollMod > 0 || rollLabel.charAt(0) === "+")
            //                 rollResults.posFlagLines.push(rollLabel.replace(/^[+-]\s*/gu, ""));
            //             else if (rollMod < 0 || rollLabel.charAt(0) === "-")
            //                 rollResults.negFlagLines.push(rollLabel.replace(/^[+-]\s*/gu, ""));
            //             else
            //                 rollResults.goldFlagLines.push(rollLabel.trim());
            //         }

            //         // FINISHED!  ADD EFFECT TO APPLIED ROLL EFFECTS.
            //         if (!isReapplying)
            //             rollResults.appliedRollEffects = _.union(rollResults.appliedRollEffects, [effectString]);
            //     }
            // }

            // FINISHED!  Return either rollData or rollResults, whichever you have.
            // Make sure to map the flagLines to Strings before returning.
            if (rollData) {
                for (const flagType of ["posFlagLines", "negFlagLines", "redFlagLines", "goldFlagLines"])
                    rollData[flagType] = _.map(rollData[flagType], (v) => v[1]
                        .replace(/<\.>/gu, "●".repeat(Math.abs(v[0])))
                        .replace(/<#>/gu, v[0] === 0 ? "~" : v[0])
                        .replace(/<abs>/gu, v[0] === 0 ? "~" : Math.abs(v[0]))
                        .replace(/<\+>/gu, v[0] < 0 ? "-" : "+"));
                DB({"ROLL DATA AFTER EFFECTS": rollData}, "applyRollEffects");
                return TRACEOFF(traceID, rollData);
            } else {
                DB({"ROLL RESULTS AFTER EFFECTS": rollResults}, "applyRollEffects");
                return TRACEOFF(traceID, rollResults);
            }
        }
        return TRACEOFF(traceID, THROW(`Bad Roll Input!${D.JSL(rollInput)}`, "applyRollEffects"));
    };
    //     #endregion _______ Checks _______
    applyFlags() { }

        applyEffects() {
            const {
                isBloodSurgeOK = true,
                isWPRerollOK = true,
                wpRerollQty = 3,
                wpRerollCost = 1,
                numFreeRerolls = 0
            } = this.effectFlags;
            /*
            this.effectFlags = {
                wpRerollQty: 2,
                traitMultipliers: {
                    bloodSurge: 2
                }
            }
            this.effectDisplays = {
                wpRerollQty: {display: "red", rollStage: "result", text: "WP Rerolls 2 Dice (Riverdale Aspect)"},
                traitMultipliers: {
                    bloodSurge: {display: "gold", text: "Blood Surge Doubled"}
                }
            }



            */


         }

    // #endregion ░░░░[Roll Effects]░░░░
    // #region ~ PRIVATE METHODS
    rollPool() {
        this.diceRolls = [];
        for (let i = 0; i < this.dicePool; i++)
            this.diceRolls.push(this.H < this.hungerDice ? Roll.H() : Roll.B());
        this.isResolved = true;
    }
    compileTraits() {
        let totVal = 0;
        this._traitData = this._traits.map((trait) => {
            const val = D.GetStatVal(this.charID, trait);
            totVal += val;
            return {
                name: trait,
                displayName: D.GetDisplayName(this.charID, trait),
                value: val
            };
        });
        return totVal;
    }


    /*  NO: Far better to include all mutator functions (and check functions) as roll methods,
        then handle ALL necessary steps to apply the flag to the roll instance inside that function.
        Another method --- "applyEffects" --- collects all roll effects from all sources, parses them
        for their check conditions and their applied effects, then simply does an
            "if checkFunc --> mutatorFunc"
        for each
    */
    applyFlags(targetComponent = "dicePool") {

        /* const flags = D.Clone(this._flags);


        // Flag can be an int for addition/subtraction
        // or a string float (e.g. "2.0") for multiplication
        // and can have 'u' or 'd' to represent rounding up or down
        const extract = (matchFunc, haystack) => {
            // Runs (v) => matchFunc, extracts first matching entry, deleting it from object.
            if (haystack) {
                // console.log(`Extracting from ${haystack}`);
                const matchIndex = haystack.findIndex((v) => matchFunc(v));
                if (matchIndex >= 0) {
                    const matchVal = haystack[matchIndex];
                    haystack = [...haystack.slice(0, matchIndex - 1), ...haystack.slice(matchIndex)];
                    return matchVal;
                }
            }
            return null;
        };
        const operate = (targetDelta, operator) => {
            if (/\./.test(`${operator.delta}`))
                return Math[operator.round === "up" ? "ceil" : "floor"](targetDelta * D.Float(operator.delta));
            else if (D.Int(operator.delta))
                return targetDelta + D.Int(operator.delta);
            return targetDelta;
        };
        const setDelta = (targetFlag, operator) => {
            const targetIndex = flags.findIndex((v) => v.display === targetFlag);
            flags.delta = operate(flags.delta, operator);
        };

        // First, apply all flag-on-flag mods (e.g. Blood Surge multipliers)
        let flag = extract((v) => flags.map((f) => f.display).includes(v.component), flags);
        while (flag) {
            setDelta(flag.component, flag);
            flag = extract((v) => flags.map((f) => f.display).includes(v.component), flags);
        }
        // Second, combine mods for target component
        let targetDelta = 0;
        flag = extract((v) => Object.values(flags).component === targetComponent, flags);
        while (flag) {
            targetDelta = operate(targetDelta, flag);
            flag = extract((v) => Object.values(flags).component === targetComponent, flags);
        }


        return targetDelta; */
    }

    applyEffects(targetComponent = "dicePool") { return 0 }


    // #endregion

    // #region ~ PUBLIC METHODS

    // #endregion
}

Roll.importLegacyRegistry();
Roll.initRegistry();
// console.dir(Roll);
// console.dir(Roll.REGISTRY);
const thisRoll = Roll.getCurrentRoll();
console.log(JSON.parse(JSON.stringify(thisRoll)));
thisRoll.rollPool();
console.log(JSON.parse(JSON.stringify(thisRoll)));
console.log("Tabling...");
console.table({
    diceRolls: thisRoll.diceRolls.join(" "),
    numDiceRolled: thisRoll.diceRolls.length,
    traitsTotal: thisRoll.dicePoolComps,
    dicePool: thisRoll.dicePool,
    hungerDice: thisRoll.hungerDice,
    total: thisRoll.total,
    difficulty: thisRoll.difficulty,
    margin: thisRoll.margin,
    isWin: thisRoll.isWin,
    isCrit: thisRoll.isCrit,
    isMessyCrit: thisRoll.isMessyCrit,
    isFail: thisRoll.isFail
});
