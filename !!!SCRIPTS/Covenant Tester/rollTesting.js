const {getTotal, getOutcome, rollDicePool} = require("./roller.js");

const run = () => {
    const CHARS = [
        {dicePool: 9, WP: 5, hunger: 1},
        {dicePool: 19, WP: 5, hunger: 3},
        {dicePool: 9, WP: 5, hunger: 5},
        {dicePool: 9, WP: 5, hunger: 4}
    ];

    const rollOutcomes = [];

    CHARS.forEach((charData) => {
        const diceVals = rollDicePool(charData);
        rollOutcomes.push(getOutcome(diceVals, 3));
    });

    console.debug(rollOutcomes);
    console.dir(rollOutcomes);
    console.dirxml(rollOutcomes);
    console.table(rollOutcomes);

    return rollOutcomes;
};

exports = {run};
