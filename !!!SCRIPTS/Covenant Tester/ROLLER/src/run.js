import {setRollParams, getTotal, getOutcome, rollDicePool, parseRollOutcome, parseRollTable} from "./roller.js";
import {buildChars} from "./chars.js";
import {randBetween, getPercent, getAverage} from "./utility.js";
import { runCascadingTest, runStandardExtendedTest } from "./extendedTests.js";

const TbNPlayerCharData = [
    {
        name: "Ava",
        attrs: {STR: 1, DEX: 3, STA: 2, CHA: 2, MAN: 4, COM: 3, INT: 2, WIT: 3, RES: 3},
        skills: {
            ath: 2, ste: 2, 
            eti: 2, ins: 3, prf: 1, per: 3, str: 2, sub: 4,
            awa: 2, inv: 3, pol: 2 
        },
        specs: ["prf", "str"],
        discs: {AUS: 2, DOM: 4, OBF: 1, OBV: 5},
        bp: 3,
        hum: 5
    },
    {
        name: "Bacchus",
        attrs: {STR: 1, DEX: 2, STA: 2, CHA: 2, MAN: 3, COM: 2, INT: 3, WIT: 3, RES: 4},
        skills: {            
            eti: 2, ins: 3, int: 3, per: 3, sub: 1,
            awa: 1, fin: 2, inv: 3, occ: 4, pol: 2, tec: 1
        },
        specs: ["per", "occ"],
        discs: {AUS: 1, DOM: 1, OBF: 5},
        bp: 3,
        hum: 7
    },
    {
        name: "Locke",
        attrs: {STR: 4, DEX: 2, STA: 2, CHA: 4, MAN: 2, COM: 3, INT: 4, WIT: 2, RES: 4},
        skills: {
            ath: 2, bra: 3, dri: 1, lar: 1, mel: 1, ste: 1, sur: 1,
            eti: 2, ins: 2, int: 3, lea: 2, per: 2, str: 2, sub: 2,
            aca: 1, awa: 1, fin: 2, inv: 1, occ: 1, pol: 2, sci: 1, tec: 1
        },
        specs: ["bra", "eti", "per", "aca", "pol", "sci"],
        discs: {CEL: 3, DOM: 2, FOR: 4, POT: 3, PRE: 4},
        bp: 3,
        hum: 5
    },
    {
        name: "Napier",
        attrs: {STR: 2, DEX: 3, STA: 2, CHA: 2, MAN: 2, COM: 4, INT: 4, WIT: 3, RES: 2},
        skills: {
            cra: 1, dri: 2, lar: 1, mel: 1, ste: 1, 
            eti: 2, ins: 1, int: 1, per: 2, str: 3, sub: 2,
            awa: 2, fin: 1, med: 3, pol: 2, sci: 4, tec: 2
        },
        specs: ["str", "med", "sci"],
        discs: {AUS: 2, DOM: 2, OBF: 3, ALC: 2},
        bp: 2,
        hum: 6
    },
    {
        name: "Roy",
        attrs: {STR: 1, DEX: 2, STA: 2, CHA: 3, MAN: 2, COM: 3, INT: 3, WIT: 2, RES: 5},
        skills: {
            mel: 1, ste: 2, 
            eti: 3, ins: 2, lea: 1, prf: 1, per: 4, sub: 1,
            aca: 4, awa: 3, occ: 5, pol: 3
        },
        specs: ["led", "aca"],
        discs: {DOM: 2, OBF: 2, BLO: 5},
        bp: 3,
        hum: 5
    }
];

const runExtended = (type = "standard", charData, dicePool, targetDiff, maxRolls = 20, numTrials = 1000) => {
    let trialResults, failStep, totalRolls, totalFails, messyCrits, wins, modifier = -1;
    do {
        modifier++;
        trialResults = {};
        totalRolls = 0;
        totalFails = 0;
        messyCrits = 0; 
        wins = 0;
        failStep = type === "cascading" ? targetDiff.map(() => 0) : [];
        failStep.push(0);
        for (let i = 0; i < numTrials; i++) {
            const outcome = {
                standard: runStandardExtendedTest(charData, dicePool, {finalDifficulty: targetDiff, maxRolls}),
                hard: "",
                series: "",
                cascading: runCascadingTest(charData, dicePool, targetDiff, modifier)
            }[type];
            if (type === "cascading") {
                if (outcome.isWin) {
                    wins++;
                } else {
                    failStep[outcome.failStep]++;
                }
            } else {
                totalRolls += outcome.isWin ? outcome.numRolls : 0;
                wins += outcome.isWin ? 1 : 0;
                totalFails += outcome.isTotalFail ? 1 : 0;
                messyCrits += outcome.isMessy ? 1 : 0;
            }
        }       
    } while (type === "cascading" && getPercent(wins, numTrials) < 70)
    if (type === "cascading") {
        trialResults["% Win"] = getPercent(wins, numTrials);
        trialResults["Modifier to 70%"] = modifier;
        const totFailPoints = numTrials - wins;
        trialResults["Fail Points"] = failStep;
        trialResults["% Fail Points"] = failStep.map((fails) => getPercent(fails, numTrials));
    } else {
        trialResults["T.Fails"] = totalFails;
        trialResults.Wins = wins;
        trialResults["Avg Rolls on Win"] = getAverage(totalRolls, wins);
        trialResults["% Win"] = getPercent(wins, numTrials);
        trialResults["% Messy"] = getPercent(messyCrits, numTrials);
    }
    console.table(trialResults);
};

const run = (numTrials = 30) => {
    const CHARS = buildChars(TbNPlayerCharData);
    const [ATTRS, SKILLS] = [Object.keys(Object.values(CHARS)[0].attrs), Object.keys(Object.values(CHARS)[0].skills)];
    const HUNGERWEIGHTS = [0, 1, 1, 2, 2, 2, 2, 3, 3, 4, 5];
    const ROLLPARAMS = new Array(numTrials).fill(null).map(() => ({
        dicePool: [ATTRS[randBetween(0, ATTRS.length - 1)], SKILLS[randBetween(0, SKILLS.length - 1)]],
        difficulty: randBetween(2, 7),
        overrides: {
            hunger: HUNGERWEIGHTS[randBetween(0, HUNGERWEIGHTS.length - 1)]
        }
    }));
    
    const parsedOutcomes = [];
    const rollOutcomes = ROLLPARAMS.map((rollParams) => {
        const charData = Object.values(CHARS)[randBetween(0, Object.values(CHARS).length - 1)];
        setRollParams(rollParams);
        const outcome = getOutcome(rollDicePool(charData));
        parsedOutcomes.push(parseRollOutcome(charData, outcome));
        return outcome;
    });

    console.table(parseRollTable(parsedOutcomes));
    return rollOutcomes;
};

// console.table(run(200));
const charData = buildChars(TbNPlayerCharData, "Locke").pop();
charData.overrides.hunger = 2;
// const result = runExtended("standard", charData, ["STR","occ"], 25, 10);
const oneOutcome = runCascadingTest(charData, ["INT", "fin"], [2,3,4,5]);
console.table(oneOutcome.tableData);
const result = runExtended("cascading", charData, ["INT","fin"], [2,3,4,5]);
// console.table(result.tableData);
debugger;
