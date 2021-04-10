const {extract} = require("./utility.js");

// #region Parsing Dice Values
const countHungerDice = (diceVals) => diceVals.filter((roll) => /^H/.test(roll)).length;
const sortDice = (diceVals) => {
    const sortedDice = {
        B: {c: 0, s: 0, f: 0},
        H: {c: 0, s: 0, f: 0, b: 0}
    };
    diceVals.forEach((dieVal) => {
        const [dType, dNum] = dieVal.match(/(\w)(\d+)/).slice(1).map((x, i) => (i > 0 ? parseInt(x) : x));
        if (dNum === 10)
            sortedDice[dType].c++;
        else if (dNum === 1 && dType === "H")
            sortedDice.H.b++;
        else if (dNum >= 6)
            sortedDice[dType].s++;
        else
            sortedDice[dType].f++;
    });
    return sortedDice;
};
const pairCrits = (diceVals) => {
    const sortedDice = sortDice(diceVals);
    const critPairs = {
        hh: Math.floor(sortedDice.H.c / 2),
        hb: sortedDice.H.c % 2 === 1 && sortedDice.B.c > 0 ? 1 : 0
    };
    critPairs.bb = Math.floor((sortedDice.B.c - critPairs.hb) / 2);
    return critPairs;
};
const getTotal = (diceVals) => {
    const sortedDice = sortDice(diceVals);
    const critPairs = pairCrits(diceVals);
    const numCrits = Object.values(critPairs).reduce((tot, val) => tot + val, 0);
    const numSuccs = sortedDice.B.c + sortedDice.B.s + sortedDice.H.c + sortedDice.H.s;
    const total = 2 * numCrits + numSuccs;
    return total;
};
const getOutcome = (diceVals, difficulty = 0) => {
    const sortedDice = sortDice(diceVals);
    const critPairs = pairCrits(diceVals);
    const total = getTotal(diceVals);
    const margin = total - difficulty;
    const outcome = {
        sortedDice,
        critPairs,
        total,
        margin,
        messy: total > 0 && margin >= 0 && (critPairs.hh + critPairs.hb) > 0,
        crit: total > 0 && margin >= 0 && Object.values(critPairs).reduce((tot, val) => tot + val, 0) > 0,
        win: total > 0 && margin >= 0,
        totalFail: total === 0,
        bestialFail: margin < 0 && sortedDice.H.b > 0
    };
    return outcome;
};
// #endregion

// #region Basic Dice Rolling
const rollDie = () => Math.ceil(Math.random() * 10);
const rollDicePool = (charData = {dicePool: 9, WP: 5, hunger: 1}, modifiers = [], forcedRolls = []) => {
    let {dicePool, hunger} = charData;
    dicePool += modifiers.reduce((tot, mod) => tot + mod, 0);
    const diceVals = new Array(dicePool).fill(null).map((_, i, a) => (forcedRolls[i] || (countHungerDice(a) < hunger ? `H${rollDie()}` : `B${rollDie()}`)));
    return diceVals;
};
// #endregion

exports = {
    getTotal,
    getOutcome,
    rollDicePool
};


// #endregion

// #region Willpower Rerolling
/* export const WPReroll = (charData, rollResults, rerollTypes) => {
    // Dice Types: Bc, Hc, Bs, Hs, Bf, Hf/Hb --> "Hb" counts as "Hf"; citing "Hb" will prioritize it.
    const forcedRolls = [...rollResults.rolls];
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
    if (forcedRolls.length === rollResults.rolls.length)
        return false;
    return rollDicePool(charData, forcedRolls);
};
export const WPGoalReroll = (charData, rollResults, goal, canRerollMessy = false) => {
    const rerollTypes = [];
    switch (goal) {
        case "reduce": {
            // Check to see if crits are breakable
            const critDice = getCritDice(rollResults);
            const breakableCritPairs = rollResults.critPairs.bb + (canRerollMessy ? rollResults.critPairs.hb : 0);
            let numCritRerolls = (breakableCritPairs ? 2 * (Math.max(0, breakableCritPairs - 1)) + 1 : 0) + rollResults.B.c;
            while (numCritRerolls > 3)
                numCritRerolls -= 2;
            rerollTypes.push(...new Array(numCritRerolls).fill("Bc"));

            // Use remaining rerolls to reroll any remaining crit dice and basic successes
            const numLoneCritRerolls = Math.min(critDice.B - rerollTypes.length - (canRerollMessy ? 0 : rollResults.critPairs.hb), Math.max(0, 3 - rerollTypes.length));
            rerollTypes.push(...new Array(numLoneCritRerolls).fill("Bc"));
            const numSuccRerolls = Math.min(rollResults.B.s, Math.max(0, 3 - rerollTypes.length));
            rerollTypes.push(...new Array(numSuccRerolls).fill("Bs"));
            break;
        }
        case "increase": {
            // Reroll basic failures
            rerollTypes.push(...new Array(Math.min(3, rollResults.B.f)).fill("Bf"));
            break;
        }
        // no default
    }
    // console.log([
    //     `Goal: ${goal}`,
    //     `Roll: ${rollResults.diceVals.join(", ")}`,
    //     `Rerolling: ${rerollTypes.join(", ")}`
    // ]);
    return WPReroll(charData, rollResults, rerollTypes);
};
*/
// #endregion
