import {clone, merge, randBetween} from "./utility.js";

// #region SYSTEM DATA
const genDepts = [
    null,
    null,
    null,
    null,
    {blood_potency_max: 10, blood_potency: 5},
    {blood_potency_max: 9, blood_potency: 4},
    {blood_potency_max: 8, blood_potency: 3},
    {blood_potency_max: 7, blood_potency: 3},
    {blood_potency_max: 6, blood_potency: 2},
    {blood_potency_max: 5, blood_potency: 2},
    {blood_potency_max: 4, blood_potency: 1},
    {blood_potency_max: 4, blood_potency: 1},
    {blood_potency_max: 3, blood_potency: 1},
    {blood_potency_max: 3, blood_potency: 1},
    {blood_potency_max: 0, blood_potency: 0},
    {blood_potency_max: 0, blood_potency: 0},
    {blood_potency_max: 0, blood_potency: 0}
];
const bpDependants = [
    {bp_surge: 1, bp_mend: 1, bp_discbonus: 0, bp_rousereroll: 0, bp_baneseverity: 0, bp_slakeanimal: 1, bp_slakehuman: 0, bp_slakekill: 1},
    {bp_surge: 2, bp_mend: 1, bp_discbonus: 0, bp_rousereroll: 1, bp_baneseverity: 2, bp_slakeanimal: 1, bp_slakehuman: 0, bp_slakekill: 1},
    {bp_surge: 2, bp_mend: 2, bp_discbonus: 1, bp_rousereroll: 1, bp_baneseverity: 2, bp_slakeanimal: 0.5, bp_slakehuman: 0, bp_slakekill: 1},
    {bp_surge: 3, bp_mend: 2, bp_discbonus: 1, bp_rousereroll: 2, bp_baneseverity: 3, bp_slakeanimal: 0, bp_slakehuman: 0, bp_slakekill: 1},
    {bp_surge: 3, bp_mend: 3, bp_discbonus: 2, bp_rousereroll: 2, bp_baneseverity: 3, bp_slakeanimal: 0, bp_slakehuman: -1, bp_slakekill: 1},
    {bp_surge: 4, bp_mend: 3, bp_discbonus: 2, bp_rousereroll: 3, bp_baneseverity: 4, bp_slakeanimal: 0, bp_slakehuman: -1, bp_slakekill: 2},
    {bp_surge: 4, bp_mend: 4, bp_discbonus: 3, bp_rousereroll: 3, bp_baneseverity: 4, bp_slakeanimal: 0, bp_slakehuman: -2, bp_slakekill: 2},
    {bp_surge: 5, bp_mend: 4, bp_discbonus: 3, bp_rousereroll: 4, bp_baneseverity: 5, bp_slakeanimal: 0, bp_slakehuman: -2, bp_slakekill: 2},
    {bp_surge: 5, bp_mend: 5, bp_discbonus: 4, bp_rousereroll: 4, bp_baneseverity: 5, bp_slakeanimal: 0, bp_slakehuman: -2, bp_slakekill: 3},
    {bp_surge: 6, bp_mend: 5, bp_discbonus: 4, bp_rousereroll: 5, bp_baneseverity: 6, bp_slakeanimal: 0, bp_slakehuman: -2, bp_slakekill: 3},
    {bp_surge: 6, bp_mend: 10, bp_discbonus: 5, bp_rousereroll: 5, bp_baneseverity: 6, bp_slakeanimal: 0, bp_slakehuman: -3, bp_slakekill: 3}
];
// #endregion

export const getMinHunger = (bp) => bpDependants[bp].bp_slakekill;

const charDataDefault = {
    attrs: {STR: 1, DEX: 1, STA: 1, CHA: 1, MAN: 1, COM: 1, INT: 1, WIT: 1, RES: 1},
    skills: {
        ath: 0, bra: 0, cra: 0, dri: 0, fir: 0, lar: 0, mel: 0, ste: 0, sur: 0,
        ani: 0, eti: 0, ins: 0, int: 0, lea: 0, prf: 0, per: 0, str: 0, sub: 0,
        aca: 0, awa: 0, fin: 0, inv: 0, med: 0, occ: 0, pol: 0, sci: 0, tec: 0
    },
    specs: [],
    discs: {ANI: 0, AUS: 0, CEL: 0, DOM: 0, FOR: 0, OBF: 0, POT: 0, PRE: 0, PRO: 0, BLO: 0, ALC: 0, OBV: 0},
    bp: 1,
    hum: 7,
    stains: 0,
    overrides: {}
}
const makeRandomChar = (charName) => {
    const baseData = clone(charDataDefault);
    baseData.name = charName;
    const randomize = (value, minVal = 0, maxVal = 5) => {
        if (typeof value === "object") {
            const randValue = clone(value);
            Object.entries(value).forEach(([key, val]) => {
                randValue[key] = randomize(val, key === "attrs" ? 1 : minVal);
            });
            return randValue;
        } else if (value === minVal) {
            return randBetween(minVal, maxVal);
        } else {
            return value;
        }
    };
    return randomize(baseData);
};
export const buildChars = (charData, names) => {

    const CHARS = [];

    if (names) {
        charData = charData.filter((data) => [names].flat().includes(data.name)); 
    }

    charData.forEach((data) => {
        if (!data || typeof data !== "object" || !("attrs" in data)) {
            data = makeRandomChar(data?.name ?? `Char #${Object.values(CHARS).filter((cData) => /^Char #\d/u.test(cData.name)).length + 1}`);
        }
        if (data && typeof data === "object" && ("name" in data)) {
            CHARS.push({
                get health() { 
                    const total = this.attrs.STA + 3 + this._modHealth ?? 0;
                    const [sDmg, aDmg] = [this._supHealthDmg ?? 0, this._aggHealthDmg ?? 0];
                    const dmgTotal = sDmg + aDmg;
                    const setVal = (key, val) => (this[key] = val);
                    return {
                        total,
                        damage: {
                            total: dmgTotal,
                            get sup() { return sDmg },
                            set sup(value) { setVal("_supHealthDmg", value) },
                            get agg() { return aDmg },
                            set agg(value) { setVal("_aggHealthDmg", value) },
                        },
                        clear: total - dmgTotal
                    }
                },
                get wp() {
                    const total = this.attrs.RES + this.attrs.COM + this._modWP ?? 0;
                    const [sDmg, aDmg] = [this._supWPDmg ?? 0, this._aggWPDmg ?? 0];
                    const dmgTotal = sDmg + aDmg;
                    const setVal = (key, val) => (this[key] = val);
                    return {
                        total,
                        damage: {
                            total: dmgTotal,
                            get sup() { return sDmg },
                            set sup(value) { setVal("_supWPDmg", value) },
                            get agg() { return aDmg },
                            set agg(value) { setVal("_aggWPDmg", value) },
                        },
                        clear: total - dmgTotal
                    }
                },
                get hunger() { return this._hunger ?? getMinHunger(this.bp); },
                set hunger(val) { this._hunger = val; },
                ...merge(charDataDefault, data)
            });
        }
    });

    return CHARS;
};
