import {extract, getInt} from "./utility.js";

console.log("START!");

// #region Utility Functions

// #endregion

// #region Run Configuration & Data Storage
const CONFIG = {
    numCircles: 4,
    avgHunger: 2,
    rollDifficulty: 0,
    powerMult: 1,
    instabilityMult: 1,
    numRoundsByCircles: {
        2: 3,
        3: 3,
        4: 3
    }
};
const CHARS = [
    {dicePool: 9, WP: 5, hunger: CONFIG.avgHunger},
    {dicePool: 7, WP: 5, hunger: CONFIG.avgHunger},
    {dicePool: 9, WP: 5, hunger: CONFIG.avgHunger},
    {dicePool: 9, WP: 5, hunger: CONFIG.avgHunger}
];
// #endregion

// #region Basic Dice Rolling


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
        for (let j = 0; j < resultData.charsData.length; j++)
            roundData.charResults[j] = rollDicePool(resultData.charsData[j]);
        const maxMargin = roundData.charResults.reduce((max, rollData) => Math.max(max, rollData.margin), 0);
        const minMargin = roundData.charResults.reduce((min, rollData) => (min === false ? rollData.margin : Math.min(min, rollData.margin)), false);


        // While there are characters who haven't spent Willpower yet (and can --- no TotalFail) ...

        // Decide on goal: Increase Power, Reduce Instability
        // Sort characters by the dice pool that should be rerolled to accomplish goal
        // If top pool's character can't reroll OR they have a messy crit, see if a clean crit participant can spend WP --> Reroll.
        // Otherwise, if top pool's character can reroll --> Reroll.
        // Otherwise, stop.


        roundData.power = maxMargin * CONFIG.powerMult;
        roundData.instability = Math.abs(maxMargin - minMargin) * CONFIG.instabilityMult;
        resultData.rounds.push(roundData);
        resultData.power += roundData.power;
        resultData.instability += roundData.instability;
    }
    return resultData;
};
// #endregion

// #region Trials: Averaging Multiple Covenant Runs
const runCovenantTrial = (numTrials = 1000) => {
    const trialData = {};
    const trialResults = {};
    for (const numCircles of [2, 3, 4]) {
        CONFIG.numCircles = numCircles;
        CONFIG.rollDifficulty = (numCircles - 2);
        CONFIG.powerMult = numCircles - 1;
        trialData[numCircles] = {
            powerResults: [],
            instabilityResults: []
        };
        for (let i = 0; i < numTrials; i++) {
            const runResults = runCovenant();
            trialData[numCircles].powerResults.push(runResults.power);
            trialData[numCircles].instabilityResults.push(runResults.instability);
        }
        trialResults[numCircles] = {
            avgPower: Math.round(10 * trialData[numCircles].powerResults.reduce((tot, power) => power + tot, 0) / trialData[numCircles].powerResults.length) / 10,
            avgInstability: Math.round(10 * trialData[numCircles].instabilityResults.reduce((tot, instability) => instability + tot, 0) / trialData[numCircles].instabilityResults.length) / 10
        };
        trialResults[numCircles].ratio = Math.round(10000 * trialResults[numCircles].avgPower / trialResults[numCircles].avgInstability) / 100;
        trialResults[numCircles].difference = trialResults[numCircles].avgPower - trialResults[numCircles].avgInstability;
        trialResults[numCircles].diffRatio = Math.round(10000 * trialResults[numCircles].avgPower / trialResults[numCircles].difference) / 100;
    }
    return trialResults;
};
// #endregion

let rollResults = rollDicePool(CHARS[0], ["H10", "B10"]);
[true, false].forEach((canRerollMessy) => WPGoalReroll(CHARS[0], rollResults, "reduce", canRerollMessy));
rollResults = rollDicePool(CHARS[0], ["H10", "B10"]);
[true, false].forEach((canRerollMessy) => WPGoalReroll(CHARS[0], rollResults, "reduce", canRerollMessy));
const trialResults = runCovenantTrial(10000);

console.log("Finished!");

// console.debug(JSON.stringify(runCovenant(), null, 4));
