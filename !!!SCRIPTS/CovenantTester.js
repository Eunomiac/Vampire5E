console.log("START!");

// #region Utility Functions
const extract = (array, item, searchVal = "") => {
    //   removes the first element found that matches the string or passes the check function
    //   mutates the array
    //   returns 'true' if array changed
    if (typeof item === "string") {
        searchVal = item;
        item = (elem) => elem === searchVal;
    }

    const index = array.findIndex(item);
    if (index === -1) {
        console.log(`[${array.length}] ${searchVal} Not Found: [${array.length}]`);
        return false;
    }
    for (let i = 0; i < array.length; i++) {
        if (i === index)
            array.shift();
        array.push(array.shift());
    }
    // console.log(`${searchVal} Found at ${index}: [${array.length}]`);
    return true;
};
const getInt = (str) => parseInt(str.replace(/\D/, ""));
// #endregion

// #region Run Configuration & Data Storage
const CONFIG = {
    numCircles: 2,
    avgHunger: 2,
    rollDifficulty: 0,
    numRoundsByCircles: {
        2: 3,
        3: 3,
        4: 3
    }
};
const CHARS = [
    {dicePool: 9, WP: 5, hunger: CONFIG.avgHunger},
    {dicePool: 9, WP: 5, hunger: CONFIG.avgHunger},
    {dicePool: 7, WP: 5, hunger: CONFIG.avgHunger},
    {dicePool: 10, WP: 0, hunger: CONFIG.avgHunger}
];
// #endregion

// #region Basic Dice Rolling
const rollDie = () => Math.ceil(Math.random() * 10);
const rollDicePool = (charData, diff = CONFIG.rollDifficulty, forcedRolls = []) => {
    const {dicePool, WP, hunger} = charData;
    const hungerPool = Math.min(dicePool, hunger);
    const basePool = dicePool - hungerPool;
    const rollResults = {
        critPairs: {bb: 0, hb: 0, hh: 0},
        B: {c: 0, s: 0, f: 0},
        H: {c: 0, s: 0, f: 0, b: 0},
        rolls: [],
        diceVals: [],
        total: 0,
        margin: null,
        outcome: null
    };
    const logRoll = (dRoll, dType) => {
        dRoll = parseInt(dRoll);
        rollResults.rolls.push(dType + dRoll);

        if (dRoll === 10) {
            rollResults[dType].crits++;
            rollResults.total++;
        } else if (dRoll === 1 && dType === "H") {
            rollResults.H.botches++;
        } else if (dRoll >= 6) {
            rollResults[dType].succs++;
            rollResults.total++;
        } else {
            rollResults[dType].fails++;
        }
    };
    const countHungerDice = () => rollResults.rolls.filter((roll) => /^H/.test(roll)).length;
    const pairCrits = () => {
        const pairs = rollResults.critPairs;
        // First check if results have already been paired; if so, unpair them
        if (Object.values(pairs).reduce((tot, val) => tot + val, 0)) {
            for (let i = 0; i < pairs.hh; i++) {
                rollResults.total -= 2;
                rollResults.H.c += 2;
            }
            for (let i = 0; i < pairs.hb; i++) {
                rollResults.total -= 2;
                rollResults.H.c += 1;
                rollResults.B.c += 1;
            }
            for (let i = 0; i < pairs.bb; i++) {
                rollResults.total -= 2;
                rollResults.B.c += 2;
            }
            pairs.hh = 0;
            pairs.hb = 0;
            pairs.bb = 0;
        }
        // Pair crits
        while (rollResults.B.c + rollResults.H.c >= 2) {
            while (rollResults.H.c >= 2) {
                rollResults.H.c -= 2;
                pairs.hh++;
                rollResults.total += 2;
                rollResults.diceVals.push("Hc"); // rollResults.diceVals.push("HcL");
                rollResults.diceVals.push("Hc"); // rollResults.diceVals.push("HcR");
            }
            if (rollResults.B.c > 0 && rollResults.H.c > 0) {
                rollResults.B.c--;
                rollResults.H.c--;
                pairs.hb++;
                rollResults.total += 2;
                rollResults.diceVals.push("Hc"); // rollResults.diceVals.push("HcL");
                rollResults.diceVals.push("Bc"); // rollResults.diceVals.push("BcR");
            }
            while (rollResults.B.c >= 2) {
                rollResults.B.c -= 2;
                pairs.bb++;
                rollResults.total += 2;
                rollResults.diceVals.push("Bc"); // rollResults.diceVals.push("BcL");
                rollResults.diceVals.push("Bc"); // rollResults.diceVals.push("BcR");
            }
        }
    };
    const getOutcome = () => {
        if (rollResults.total > 0 && rollResults.margin >= 0)
            if (rollResults.critPairs.hh || rollResults.critPairs.hb)
                rollResults.outcome = "messyCrit";
            else if (rollResults.critPairs.bb)
                rollResults.outcome = "cleanCrit";
            else
                rollResults.outcome = "succ";
        else if (rollResults.H.b && rollResults.total === 0)
            rollResults.outcome = "bestialFail+totalFail";
        else if (rollResults.H.b)
            rollResults.outcome = "bestialFail";
        else if (rollResults.total === 0)
            rollResults.outcome = "totalFail";
        else
            rollResults.outcome = "fail";
    };

    while (rollResults.rolls.length < dicePool) {
        let dType, dRoll;
        if (forcedRolls.length)
            [dType, dRoll] = forcedRolls.shift().match(/(\w)(\d+)/).slice(1);
        else
            [dType, dRoll] = [
                countHungerDice() >= hungerPool ? "B" : "H",
                rollDie()
            ];
        logRoll(dRoll, dType);
    }

    for (const bin of ["c", "s", "f", "b"])
        for (const type of ["H", "B"])
            for (let i = 0; i < rollResults[type][bin]; i++)
                rollResults.diceVals.push(type + bin.slice(0, 1));

    rollResults.margin = rollResults.total - diff;

    return rollResults;
};
const WPReroll = (charRef, rollResults, rerollTypes, hunger = CONFIG.avgHunger, diff = CONFIG.rollDifficulty) => {
    // Dice Types: Bc, Hc, Bs, Hs, Bf, Hf/Hb --> "Hb" counts as "Hf"; citing "Hb" will prioritize it.
    const forcedRolls = rollResults.rolls;
    while (rerollTypes.length) {
        // console.log(`Looping for ${rerollTypes[0]}`);
        const [dType, dResult] = rerollTypes.shift().split("");
        const testFuncs = {
            c: (dRoll) => new RegExp(`(${dType}|X})10`).test(dRoll),
            s: (dRoll) => new RegExp(`(${dType}|X})[6-9]`).test(dRoll),
            f: (dRoll) => new RegExp(`(${dType}|X})[2-5]`).test(dRoll),
            b: (dRoll) => new RegExp(`(${dType}|X})1`).test(dRoll)
        };
        if (dResult === "b" && !extract(forcedRolls, testFuncs[dResult], `${dType}${dResult}`))
            extract(forcedRolls, testFuncs.f, `${dType}f`);
        else if (dResult === "f" && !extract(forcedRolls, testFuncs[dResult], `${dType}${dResult}`))
            extract(forcedRolls, testFuncs.b, `${dType}b`);
        else if (!["b", "f"].includes(dResult))
            extract(forcedRolls, testFuncs[dResult], `${dType}${dResult}`);
    }
    return rollDicePool(charRef, hunger, diff, forcedRolls);
};


// #region Covenant Runs
const runCovenant = () => {
    const resultLines = [];
    const {numCircles, numRoundsByCircles} = CONFIG;
    const resultData = {
        charsData: CHARS.slice(0, numCircles),
        rounds: [],
        power: 0,
        instability: 0
    };
    for (let i = 0; i < numRoundsByCircles[numCircles]; i++) {
        const roundData = {
            charResults: [],
            power: null,
            instability: null
        };
        for (let j = 0; j < resultData.charsData.length; i++)
            roundData.charResults[j] = rollDicePool(resultData.charsData[j]);
        const maxMargin = roundData.charResults.reduce((max, rollData) => Math.max(max, rollData.margin), 0);
        const minMargin = roundData.charResults.reduce((min, rollData) => (min === false ? rollData.margin : Math.min(min, rollData.margin)), false);
        roundData.power = maxMargin;
        roundData.instability = Math.abs(maxMargin - minMargin);
        resultData.rounds.push(roundData);
        resultData.power += roundData.power;
        resultData.instability += roundData.instability;
    }
    return resultData;
};
// #endregion

console.log(runCovenant());
