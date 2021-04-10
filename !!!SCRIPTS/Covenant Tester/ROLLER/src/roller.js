import {extract} from "./utility.js";
import {getMinHunger} from "./chars.js";

const CONFIG = {};

// #region Formatting Outcomes for console.table()
export const parseRollTable = (parsedOutcomes) => {
    let maxDiceValWidth;
    parsedOutcomes.forEach((parsedOutcome) => {
        maxDiceValWidth = Math.max(maxDiceValWidth ?? 0, parsedOutcome["Dice Values"]?.length ?? 0);
    });
    parsedOutcomes.forEach((parsedOutcome) => {
        if ((parsedOutcome["Dice Values"]?.length ?? 0) < maxDiceValWidth) {
            parsedOutcome["Dice Values"] += " ".repeat(maxDiceValWidth - parsedOutcome["Dice Values"].length);
        }
    });
    return parsedOutcomes;
};
export const parseRollOutcome = (charData, rollOutcome) => {
    const {name, dicePool, numDice, modifier, hunger, difficulty} = getRollData(charData);
    const {diceVals, sortedDice, critPairs, total, margin, messy, crit, win, totalFail, bestialFail} = rollOutcome;
    return {
        Char: name,
        Roll: `${hunger}H: ${dicePool.join(" + ")} (=${numDice-modifier}${modifier > 0 ? `+${modifier}` : (modifier < 0 ? modifier : "")}) vs. ${difficulty}`,
        "Dice Values": diceVals?.join(" ").replace(/10/gu, "X").replace(/H1/gu, "H.").replace(/, {2}/g, "   ").replace(/B/g, " "),
        "Hunger Dice": `${sortedDice?.H.c}c, ${sortedDice?.H.s}s, ${sortedDice?.H.f}f, ${sortedDice?.H.b}b`.replace(/\b0./g, "  ").replace(/ ,/g, "  ").replace(/, {2}/g, "   "),
        "Basic Dice": `${sortedDice?.B.c}c, ${sortedDice?.B.s}s, ${sortedDice?.B.f}f`.replace(/\b0./g, "  ").replace(/ ,/g, "  ").replace(/, {2}/g, "   "),
        "Crit Pairs": `HH: ${critPairs?.hh}, Hb: ${critPairs?.hb}, bb: ${critPairs?.bb}`.replace(/..: 0/g, "     ").replace(/ ,/g, "  ").replace(/, {2}/g, "   "),
        Total: total,
        Margin: margin,
        Win: win ? "WIN" : "FAIL",
        Messy: messy ? "M" : "",
        Crit: crit ? "C" : "",
        "T.Fail": totalFail ? "TF" : "",
        "B.Fail": bestialFail ? "BF" : ""
    };
};
// #endregion

// #region Setup & Data Retrieval
export const setRollParams = (rollParams = {dicePool: ["STR","bra"], difficulty: 3, modifiers: [], overrides: {}}) => { CONFIG.ROLLPARAMS = rollParams; }
export const getRollData = (charData) => {
    const {overrides = {}} = CONFIG.ROLLPARAMS;
    const rollData = {
        name: charData.name,
        dicePool: overrides.dicePool ?? CONFIG.ROLLPARAMS.dicePool ?? [],
        difficulty: overrides.difficulty ?? CONFIG.ROLLPARAMS.difficulty ?? 0,
        modifiers: overrides.modifiers ?? CONFIG.ROLLPARAMS.modifiers ?? [],
        hunger: overrides.hunger ?? charData.hunger ?? getMinHunger(charData.bp),
        numDice: 0
    };
    rollData.modifier = rollData.modifiers.reduce((tot, mod) => tot + mod, 0);
    rollData.numDice += rollData.modifier;
    if (Array.isArray(rollData.dicePool)) {
        rollData.dicePool.forEach((trait) => { rollData.numDice += charData.attrs[trait] ?? charData.skills[trait] ?? charData.discs[trait] ?? charData[trait] ?? 0; });
    } else if (typeof rollData.dicePool === "number") {
        rollData.numDice += rollData.dicePool;
    }
    return rollData;
}
// #endregion

// #region Data Retrieva

// #region Parsing Dice Values
const countHungerDice = (diceVals) => diceVals.filter((roll) => /^H/.test(roll)).length;
const orderDice = (diceVals) => diceVals.sort((a, b) => {
    const [aType, aNum] = a.match(/(\w)(\d+)/).slice(1).map((x, i) => (i > 0 ? parseInt(x) : x));
    const [bType, bNum] = b.match(/(\w)(\d+)/).slice(1).map((x, i) => (i > 0 ? parseInt(x) : x));
    const hCats = ["", "b", "f", "f", "f", "f", "f", "s", "s", "s", "c"];
    const bCats = ["", "f", ...hCats.slice(2)];
    const [aCat, bCat] = [[aType, aNum], [bType, bNum]].map(([type, num]) => (type === "H" ? hCats : bCats)[num]);
    const [aVal, bVal] = [[aCat, aNum], [bCat, bNum]].map(([cat, num]) => ({c: -1000, s: -800, f: -600, b: -400}[cat] - num));
    return aVal - bVal;
});
const sortDice = (diceVals) => {
    const sortedDice = {
        B: {c: 0, s: 0, f: 0},
        H: {c: 0, s: 0, f: 0, b: 0}
    };
    diceVals.forEach((dieVal) => {
        const [dType, dNum] = dieVal.match(/(\w)(\d+)/).slice(1).map((x, i) => (i > 0 ? parseInt(x) : x));
        if (dNum === 10)
            {sortedDice[dType].c++;}
        else if (dNum === 1 && dType === "H")
            {sortedDice.H.b++;}
        else if (dNum >= 6)
            {sortedDice[dType].s++;}
        else
            {sortedDice[dType].f++;}
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
export const getTotal = (diceVals) => {
    const sortedDice = sortDice(diceVals);
    const critPairs = pairCrits(diceVals);
    const numCrits = Object.values(critPairs).reduce((tot, val) => tot + val, 0);
    const numSuccs = sortedDice.B.c + sortedDice.B.s + sortedDice.H.c + sortedDice.H.s;
    const total = 2 * numCrits + numSuccs;
    return total;
};
export const getOutcome = (diceVals) => {
    const {difficulty = 0} = CONFIG.ROLLPARAMS;
    const sortedDice = sortDice(diceVals);
    const critPairs = pairCrits(diceVals);
    const total = getTotal(diceVals);
    const margin = total - difficulty;
    const outcome = {
        diceVals: orderDice(diceVals),
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
export const rollDicePool = (charData, forcedRolls = []) => {
    const {numDice, hunger} = getRollData(charData);
    const diceVals = new Array(numDice).fill(null);
    for (let i = 0; i < diceVals.length; i++) {
        diceVals[i] = forcedRolls[i] || (countHungerDice(diceVals) < hunger ? `H${rollDie()}` : `B${rollDie()}`);
    }
    return diceVals;
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
