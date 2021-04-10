import {setRollParams, getTotal, getOutcome, getRollData, rollDicePool, parseRollOutcome, parseRollTable} from "./roller.js";

const doExtendedTest = (charData, dicePool, {finalDifficulty = 10, rollDifficulty = 0, maxRolls = 20} = {}) => {
    setRollParams({dicePool, difficulty: rollDifficulty, overrides: charData.overrides});
    let numRolls = 0,
        isMessy = false,
        isTotalFail = false,
        curSuccs = 0;
    const rollDetails = [];
    const resultSummary = [];
    while (curSuccs < finalDifficulty && numRolls < maxRolls) {
        numRolls++;
        const outcome = getOutcome(rollDicePool(charData));
        isMessy = isMessy || outcome.messy;
        isTotalFail = isTotalFail || outcome.totalFail;
        rollDetails.push(outcome);
        resultSummary.push(parseRollOutcome(charData, outcome));
        if (outcome.totalFail) {
            curSuccs = 0;
        } else if (outcome.margin > 0) {
            curSuccs += outcome.margin;
        }
    }

    return {
        numRolls,
        finalDifficulty,
        finalSuccs: curSuccs,
        isWin: curSuccs >= finalDifficulty,
        charData,
        isMessy,
        isTotalFail,
        rollDetails,
        tableData: parseRollTable(resultSummary)
    };

}


export const runStandardExtendedTest = (charData, dicePool, {finalDifficulty = 10, maxRolls = 20} = {}) => doExtendedTest(charData, dicePool, {finalDifficulty, maxRolls, rollDifficulty: 0});
export const runHardExtendedTest = (charData, dicePool, {finalDifficulty = 10, maxRolls = 20, rollDifficulty = 3} = {}) => doExtendedTest(charData, dicePool, {finalDifficulty, maxRolls, rollDifficulty: 0});
export const runCascadingTest = (charData, dicePool, rollDiffs = [], modifier = 0) => {
    let prevMargin = 0;
    setRollParams({dicePool, difficulty: rollDiffs[0], modifiers: [modifier], overrides: charData.overrides});
    const results = getRollData(charData);
    results.isWin = true;
    results.failStep = 0;
    results.rolls = [];
    results.outcomes = [];
    results.parsedOutcomes = [];
    for (let i = 0; i < rollDiffs.length; i++) {
        const diff = rollDiffs[i];
        setRollParams({dicePool, difficulty: diff, modifiers: [modifier + prevMargin], overrides: charData.overrides});
        const outcome = getOutcome(rollDicePool(charData));
        const parsedOutcome = parseRollOutcome(charData, outcome);
        const thisRoll = {...getRollData(charData), ...outcome};
        results.rolls.push(thisRoll);
        results.outcomes.push(outcome);
        results.parsedOutcomes.push(parsedOutcome);
        if (thisRoll.margin < 0) {
            results.isWin = false;
            results.failStep = i + 1;
            break;
        } else {
            prevMargin = thisRoll.margin;
        }
    }
    results.tableData = parseRollTable(results.parsedOutcomes);
    return results;
};
export const runExtendedContest = () => {


};