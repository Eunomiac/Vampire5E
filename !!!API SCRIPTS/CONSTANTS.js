void MarkStart("CONSTANTS")
const C = (() => {
    const GAMENAME = "VAMPIRE",
        ROOT = state[GAMENAME] 
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "CONSTANTS"

    // #region COMMON INITIALIZATION
    const STATEREF = ROOT[SCRIPTNAME]	// eslint-disable-line no-unused-vars
    const VAL = (varList, funcName, isArray = false) => D.Validate(varList, funcName, SCRIPTNAME, isArray), // eslint-disable-line no-unused-vars
        DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        LOG = (msg, funcName) => D.Log(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        THROW = (msg, funcName, errObj) => D.ThrowError(msg, funcName, SCRIPTNAME, errObj) // eslint-disable-line no-unused-vars

    const checkInstall = () => {
        ROOT[SCRIPTNAME] = ROOT[SCRIPTNAME] || {}
    }
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    // #region CORE CONFIGURATION & BASIC REFERENCES
    const PIXELSPERSQUARE = 70,
        NUMBERWORDS = {
            low: ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty"],
            tens: ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"],
            tiers: ["", "Thousand", "Million", "Billion", "Trillion", "Quadrillion", "Quintillion", "Sextillion", "Septillion", "Octillion", "Nonillion", "Decillion", "Undecillion", "Duodecillion", "Tredecillion", "Quattuordecillion", "Quindecillion", "Sexdecillion", "Septendecillion", "Octodecillion", "Novemdecillion", "Vigintillion", "Unvigintillion", "Duovigintillion", "Trevigintillion", "Quattuorvigintillion", "Quinvigintillion", "Sexvigintillion", "Septenvigintillion", "Octovigintillion", "Novemvigintillion", "Trigintillion", "Untrigintillion", "Duotrigintillion", "Tretrigintillion", "Quattuortrigintillion"]
        },
        ORDINALSUFFIX = {
            zero: "zeroeth",
            one: "first",
            two: "second",
            three: "third",
            four: "fourth",
            five: "fifth",
            eight: "eighth",
            nine: "ninth",
            twelve: "twelfth",
            twenty: "twentieth",
            thirty: "thirtieth",
            forty: "fortieth",
            fifty: "fiftieth",
            sixty: "sixtieth",
            seventy: "seventieth",
            eighty: "eightieth",
            ninety: "ninetieth"
        },
        COLORS = {
            white: "rgb(255, 255, 255)",
            black: "rgb(0, 0, 0)",
            brightgrey: "rgb(175, 175, 175)",
            grey: "rgb(130, 130, 130)",
            darkgrey: "rgb(80, 80, 80)",
            brightred: "rgb(255, 0, 0)",
            red: "rgb(200, 0, 0)",
            darkred: "rgb(150, 0, 0)",
            green: "rgb(0, 200, 0)",
            yellow: "rgb(200, 200, 0)",
            orange: "rgb(200, 100, 0)",
            brightpurple: "rgb(200, 0, 200)",
            purple: "rgb(150, 0, 150)",
            darkpurple: "rgb(100, 0, 100)",
            brightblue: "rgb(150, 150, 255)",
            blue: "rgb(100, 100, 255)",
            darkblue: "rgb(50, 50, 150)",
            cyan: "rgb(0, 255, 255)",
            gold: "#FFEE66",
            fadedblack: "rgba(0, 0, 0, 0.2)",
            fadedgrey: "rgba(0, 0, 0, 0.1)",
            crimson: "rgb(220, 20, 60)"
        }
    // #endregion

    // #region HTML FORMATS
    const CHATHTML = {
            header: content => `<div style="
                display: block;
                height: 20px;
                width: auto;
                line-height: 23px;
                padding: 0px 5px;
                margin: -30px 0px 0px -42px;
                font-family: 'copperplate gothic';
                font-variant: small-caps;
                font-size: 16px;
                background-color: ${COLORS.darkgrey};
                color: ${COLORS.white};
                border: 2px solid ${COLORS.black};
                position: relative;
            ">${content}</div>`,
            body: content => `<div style="
                display: block;
                width: auto;
                padding: 5px 5px;
                margin-left: -42px;
                font-family: input, verdana, sans-serif;
                font-size: 10px;
                background-color: ${COLORS.white};
                border: 2px solid ${COLORS.black};
                line-height: 14px;
                position: relative;
            ">${content}</div><div style="
                display: block;
                width: auto;
                margin-left: -42px;
                background-color: none;
                position: relative;
            "></div>`,
        },
        HANDOUTHTML = {
            main: content => `<div style="
                display: block;
                width: 600px;
            ">${content}</div>`,
            title: content => `<span style="
                display: block;
                width: 602px;
                height: 16px;
                line-height: 16px;
                background-color: ${COLORS.grey};
                font-family: 'Century Gothic';
                font-size: 14px;
                font-weight: bold;
                padding: 3px 3px;
                box-sizing: border-box;
                margin-top: 10px;
            ">${content}</span>`,
            subTitle: content => `<span style="
                display: block;
                width: 600px;
                height: 12px;
                line-height: 12px;
                margin: 5px 0px 5px -6px;
                font-weight: bold;
                border-bottom: 1px solid ${COLORS.black};
                font-family: 'Century Gothic';
                font-size: 12px;
                padding-bottom: 3px;
            ">${content}</span>`,
            bodyParagraph: (content, params = {}) => `<span style="
                display: block;
                width: 586px;
                font-family: 'Trebuchet MS';
                font-size: 12px;
                background-color: ${COLORS.brightgrey};
                ${params["border-top"] ? `border-top: ${params["border-top"]};` : ""}
                ${params["border-bottom"] ? `border-top: ${params["border-bottom"]};` : ""}
                border-left: 1px solid ${COLORS.grey};
                border-right: 1px solid ${COLORS.grey};
                padding: 3px 10px;
            ">${content}</span>`,
            smallNote: (content, color = COLORS.black) => `<span style="
                display:block; 
                width: 560px; 
                font-size: 10px;
                color: ${color};
                font-family: Goudy; 
                margin: 0px 20px;
                padding: 0px 3px;
                background-color: ${COLORS.fadedblack};
            ">${content}</span>`,
            projects: {
                charName: content => `<span style="
                    display: block; 
                    width: 600px;
                    font-size: 32px; 
                    color: ${COLORS.darkred}; 
                    font-family: Voltaire; 
                    font-variant: small-caps;
                ">${content}</span>`,
                goal: content => `<span style="
                    display: block; 
                    width: 600px; 
                    height: 24px; 
                    background-color: ${COLORS.brightgrey}; 
                    font-size: 16px; 
                    color: ${COLORS.black}; 
                    font-family: 'Alice Regular'; 
                    font-weight: bold; 
                    font-variant: small-caps; 
                    border-bottom: 1px solid ${COLORS.black}; 
                    border-top: 1px solid ${COLORS.black};
                ">${content}</span>`,
                tag: (content, color = COLORS.black) => `<span style="
                    display:inline-block; 
                    width: 60px; 
                    font-size: 14px; 
                    color: ${color}; 
                    font-family: Voltaire; 
                    font-variant: small-caps; 
                    font-weight: bold; 
                    text-align: right; 
                    margin-right: 10px;
                    height: 20px;
                    line-height: 20px;
                ">${content}</span>`,
                hook: content => `<span style="
                    display:inline-block; 
                    width: 530px; 
                    font-size: 12px; 
                    color: ${COLORS.black}; 
                    font-family: 'Alice Regular'; 
                    vertical-align: top; 
                    padding-top: 2px;
                ">${content}</span>`,
                critSucc: content => `<span style="
                    display: inline-block; 
                    width: 300px; 
                    font-size: 20px; 
                    color: ${COLORS.purple}; 
                    font-family: Voltaire; 
                    font-weight: bold;
                ">${content}</span>`,
                succ: content => `<span style="
                    display: inline-block; 
                    width: 300px; 
                    font-size: 20px; 
                    color: ${COLORS.black}; 
                    font-family: goodfish; 
                    font-weight: bold;
                ">${content}</span>`,
                endDate: content => `<span style="
                    display: inline-block; 
                    width: 300px; 
                    font-size: 20px; 
                    color: ${COLORS.black}; 
                    font-family: Voltaire; 
                    font-weight: bold; 
                    text-align: right;
                ">${content}</span>`,
                daysLeft: content => `<span style="
                    display: inline-block; 
                    width: 600px; 
                    font-size: 14px; 
                    color: ${COLORS.black}; 
                    font-family: 'Alice Regular'; 
                    font-style: italic; 
                    text-align: right;
                ">${content}</span>`,
                stake: content => `<span style="
                    display: inline-block; 
                    width: 410px; 
                    font-family: 'Alice Regular';
                    height: 20px;
                    line-height: 20px;
                ">${content}</span>`,
                teamwork: content => `<span style="
                    display: inline-block; 
                    width: 50px; 
                    font-family: 'Alice Regular'; 
                    color: ${COLORS.blue}; 
                    font-weight: bold;
                    height: 20px;
                    line-height: 20px;
                    font-size: 16px;
                ">${content}</span>`
            },
        },
        HTML = {
            start: `<div style="display: block; width: 100%; padding: 5px 5px; margin-left: -10px; margin-top: -20px; margin-bottom: -5px; color: ${COLORS.white}; font-variant: small-caps; font-family: 'Bodoni SvtyTwo ITC TT'; text-align: left; font-size: 16px;  border: 3px outset ${COLORS.darkred}; background: url('https://imgur.com/kBl8aTO.jpg') top; bg-color: ${COLORS.black}; z-index: 100; position: relative;">`,
            stop: "</div>",
        },
        bHTML = {
            div: {
                title: {
                    start: `<div style="
                        display:block;
                        width: 120%;
                        margin: 10px -10%;
                        color: ${COLORS.white};
                        text-align: center;
                        font: normal normal 22px/22px Effloresce;
                        border-bottom: 1px ${COLORS.white} solid;
                        ">`,
                    stop: "</div>",
                },
                header: {
                    start: `<div style="
                        display:block; 
                        width: 120%; 
                        margin: 0px -10% 0px -10%;
                        color: ${COLORS.white}; 
                        text-align: center; 
                        font: normal normal 16px / 20px 'Bodoni SvtyTwo ITC TT'; 
                        ">`,
                    stop: "</div>",
                },
                headerL: {
                    start: `<div style="
                        display:inline-block; 
                        width: 120%; 
                        margin: 5% -10% 0px -10%;
                        color: ${COLORS.white}; 
                        text-align: center; 
                        font: normal normal 16px / 20px 'Bodoni SvtyTwo ITC TT';
                        ">`,
                    stop: "",
                },
                headerR: {
                    start: " ",
                    stop: "</div>",
                },
                para: {
                    start: `<div style="
                        display:block; 
                        width: 103%; 
                        margin: 5px 0px;
                        color: ${COLORS.white}; 
                        text-align: left; 
                        font: normal normal 12px/14px Rockwell; 
                        ">`,
                    stop: "</div>",
                },
                paraStart: {
                    start: `<div style="
                        display:block; 
                        width: 100%; 
                        margin: 5px 0px;
                        color: ${COLORS.white}; 
                        text-align: left; 
                        font: normal normal 12px/14px Rockwell; 
                        ">`,
                    stop: "",
                },
                paraMid: {
                    start: " ",
                    stop: " ",
                },
                paraEnd: {
                    start: "",
                    stop: "</div>",
                },
            }
        }
    // #endregion

    // #region VAMPIRE ATTRIBUTES, STATS & TRAITS
    const ATTRIBUTES = {
            physical: ["Strength", "Dexterity", "Stamina"],
            social: ["Charisma", "Manipulation", "Composure"],
            mental: ["Intelligence", "Wits", "Resolve"]
        },
        SKILLS = {
            physical: ["Athletics", "Brawl", "Craft", "Drive", "Firearms", "Melee", "Larceny", "Stealth", "Survival"],
            social: ["Animal Ken", "Etiquette", "Insight", "Intimidation", "Leadership", "Performance", "Persuasion", "Streetwise", "Subterfuge"],
            mental: ["Academics", "Awareness", "Finance", "Investigation", "Medicine", "Occult", "Politics", "Science", "Technology"]
        },
        SKILLABBVS = {
            ATH: "athletics",
            BRA: "brawl",
            CRA: "craft",
            DRV: "drive",
            FIR: "firearms",
            MEL: "melee",
            LAR: "larceny",
            STL: "stealth",
            SUR: "survival",
            ANK: "animal_ken",
            ETI: "etiquette",
            INS: "insight",
            INT: "intimidation",
            LED: "leadership",
            PRF: "performance",
            PER: "persuasion",
            STR: "streetwise",
            SUB: "subterfuge",
            ACA: "academics",
            AWA: "awareness",
            FIN: "finance",
            INV: "investigation",
            MED: "medicine",
            OCC: "occult",
            POL: "politics",
            SCI: "science",
            TEC: "technology"
        },
        DISCIPLINES = ["Animalism", "Auspex", "Celerity", "Chimerstry", "Dominate", "Fortitude", "Obfuscate", "Oblivion", "Potence", "Presence", "Protean", "Blood Sorcery", "Alchemy"],
        DISCABBVS = {
            ANI: "Animalism",
            AUS: "Auspex",
            CEL: "Celerity",
            DOM: "Dominate",
            FOR: "Fortitude",
            OBF: "Obfuscate",
            PRE: "Presence",
            PTN: "Protean",
            POT: "Potence",
            SOR: "Blood Sorcery",
            ALC: "Alchemy",
            OBV: "Oblivion",
            VIC: "Vicissitude"
        },
        TRACKERS = ["Willpower", "Health", "Humanity", "Blood Potency"],
        CLANS = ["Brujah", "Gangrel", "Malkavian", "Nosferatu", "Toreador", "Tremere", "Ventrue", "Lasombra", "Tzimisce", "Banu Haqim", "Ministry", "Hecata", "Ravnos"],
        MISCATTRS = ["blood_potency_max"],
        BLOODPOTENCY = [
            { bp_surge: 0, bp_discbonus: 0, bp_minhunger: 1 },
            { bp_surge: 1, bp_discbonus: 1, bp_minhunger: 1 },
            { bp_surge: 1, bp_discbonus: 1, bp_minhunger: 1 },
            { bp_surge: 2, bp_discbonus: 1, bp_minhunger: 1 },
            { bp_surge: 2, bp_discbonus: 2, bp_minhunger: 2 },
            { bp_surge: 3, bp_discbonus: 2, bp_minhunger: 2 },
            { bp_surge: 3, bp_discbonus: 3, bp_minhunger: 2 },
            { bp_surge: 4, bp_discbonus: 3, bp_minhunger: 3 },
            { bp_surge: 4, bp_discbonus: 4, bp_minhunger: 3 },
            { bp_surge: 5, bp_discbonus: 4, bp_minhunger: 3 },
            { bp_surge: 5, bp_discbonus: 5, bp_minhunger: 4 }
        ],
        RESONANCEODDS = {
            norm: [
                { neg: 0.1245, fleet: 0.0753, intense: 0.0403, acute: 0.01 },
                { neg: 0.1245, fleet: 0.0753, intense: 0.0403, acute: 0.01 },
                { neg: 0.1245, fleet: 0.0753, intense: 0.0403, acute: 0.01 },
                { neg: 0.1245, fleet: 0.0753, intense: 0.0403, acute: 0.01 }
            ],
            pos: [
                { neg: 0.166, fleet: 0.1003, intense: 0.0537, acute: 0.0133 },
                { neg: 0.1107, fleet: 0.0669, intense: 0.0358, acute: 0.0089 },
                { neg: 0.1107, fleet: 0.0669, intense: 0.0358, acute: 0.0089 },
                { neg: 0.1107, fleet: 0.0669, intense: 0.0358, acute: 0.0089 }
            ],
            neg: [
                { neg: 0.1358, fleet: 0.0821, intense: 0.0439, acute: 0.0109 },
                { neg: 0.1358, fleet: 0.0821, intense: 0.0439, acute: 0.0109 },
                { neg: 0.1358, fleet: 0.0821, intense: 0.0439, acute: 0.0109 },
                { neg: 0.0905, fleet: 0.0547, intense: 0.0293, acute: 0.0073 }
            ],
            posneg: [
                { neg: 0.1793, fleet: 0.1084, intense: 0.058, acute: 0.0144 },
                { neg: 0.1195, fleet: 0.0722, intense: 0.0386, acute: 0.0096 },
                { neg: 0.1195, fleet: 0.0722, intense: 0.0386, acute: 0.0096 },
                { neg: 0.0797, fleet: 0.0482, intense: 0.0258, acute: 0.0064 }
            ],
            pos2: [
                { neg: 0.249, fleet: 0.1505, intense: 0.0805, acute: 0.02 },
                { neg: 0.083, fleet: 0.0502, intense: 0.0268, acute: 0.0067 },
                { neg: 0.083, fleet: 0.0502, intense: 0.0268, acute: 0.0067 },
                { neg: 0.083, fleet: 0.0502, intense: 0.0268, acute: 0.0067 }
            ],
            pospos: [
                { neg: 0.166, fleet: 0.1003, intense: 0.0537, acute: 0.0133 },
                { neg: 0.166, fleet: 0.1003, intense: 0.0537, acute: 0.0133 },
                { neg: 0.083, fleet: 0.0502, intense: 0.0268, acute: 0.0067 },
                { neg: 0.083, fleet: 0.0502, intense: 0.0268, acute: 0.0067 }
            ],
            neg2: [
                { neg: 0.1573, fleet: 0.0951, intense: 0.0508, acute: 0.0126 },
                { neg: 0.1573, fleet: 0.0951, intense: 0.0508, acute: 0.0126 },
                { neg: 0.1573, fleet: 0.0951, intense: 0.0508, acute: 0.0126 },
                { neg: 0.0262, fleet: 0.0158, intense: 0.0085, acute: 0.0021 }
            ],
            negneg: [
                { neg: 0.166, fleet: 0.1003, intense: 0.0537, acute: 0.0133 },
                { neg: 0.166, fleet: 0.1003, intense: 0.0537, acute: 0.0133 },
                { neg: 0.083, fleet: 0.0502, intense: 0.0268, acute: 0.0067 },
                { neg: 0.083, fleet: 0.0502, intense: 0.0268, acute: 0.0067 }
            ],
            pos2neg: [
                { neg: 0.249, fleet: 0.1505, intense: 0.0805, acute: 0.02 },
                { neg: 0.0996, fleet: 0.0602, intense: 0.0322, acute: 0.008 },
                { neg: 0.0996, fleet: 0.0602, intense: 0.0322, acute: 0.008 },
                { neg: 0.0498, fleet: 0.0301, intense: 0.0161, acute: 0.004 }
            ],
            neg2pos: [
                { neg: 0.2241, fleet: 0.1355, intense: 0.0725, acute: 0.018 },
                { neg: 0.1245, fleet: 0.0753, intense: 0.0403, acute: 0.01 },
                { neg: 0.1245, fleet: 0.0753, intense: 0.0403, acute: 0.01 },
                { neg: 0.0249, fleet: 0.0151, intense: 0.0081, acute: 0.002 }
            ],
            posposneg: [
                { neg: 0.1743, fleet: 0.1054, intense: 0.0564, acute: 0.014 },
                { neg: 0.1743, fleet: 0.1054, intense: 0.0564, acute: 0.014 },
                { neg: 0.0996, fleet: 0.0602, intense: 0.0322, acute: 0.008 },
                { neg: 0.0498, fleet: 0.0301, intense: 0.0161, acute: 0.004 }
            ],
            posnegneg: [
                { neg: 0.2241, fleet: 0.1355, intense: 0.0725, acute: 0.018 },
                { neg: 0.1245, fleet: 0.0753, intense: 0.0403, acute: 0.01 },
                { neg: 0.0747, fleet: 0.0452, intense: 0.0242, acute: 0.006 },
                { neg: 0.0747, fleet: 0.0452, intense: 0.0242, acute: 0.006 }
            ],
        }
    // #endregion

    // #region MVC: Minimally-Viable Character Design
    const MVCVALS = [
        [
            "<span style=\"display: block; width: 100%; margin-top: -10px;\">Concept</span></div><div style=\"display: block; width: 100%; margin-top: -10px;\">",
            ["headerL", "A depressed", "A surly", "A straightforward", "A timid", "A clever", "A bold", "An inquisitive", "A circumspect", "An outgoing", "An optimistic", "An agreeable", "A wise", "A misguided", "A gregarious", "A jaded", "An analytical"],
            ["headerR", "Cop/Detective", "Social Worker/Activist", "Doctor/Nurse/EMT", "Banker/Money Launderer", "Office Worker/Academic", "Soldier/Rebel", "Artist/Musician/Performer", "Con-Artist/Politician", "Hacker/Tech Specialist", "Stick-Up Kid/Armed Robber", "Lawyer/Fugitive", "Priest/True Believer", "Witness/Whistleblower", "Representative/Lobbyist", "Runaway/Wanderer"],
            ["header", "stands accused. (Wrongfully?)", "was disgraced and cast out.", "was seriously injured (body/mind/soul).", "is a failure at life.", "is hiding from someone.", "is stepping on the wrong toes.", "is pushing the envelope.", "is a rising star.", "is respected and admired.", "is at the height of their field.", "has a secret they're ashamed of.", "is burnt out but still going.", "is famous for a thing.", "is reluctantly breaking the law."],
        ],
        [
            "Pivotal Event",
            ["para",
             "<span style=\"font-size: 14px; margin-top: 10px;\"><b>In the past ...</b></span><br>... you fell in love with the wrong person, who dragged you into an exciting world you never knew existed. You freaked out and left them.",
             "<span style=\"font-size: 14px; margin-top: 10px;\"><b>In the past ...</b></span><br>... your best friend accused you of a crime you know you didn't commit, but they have photos that prove otherwise.",
             "<span style=\"font-size: 14px; margin-top: 10px;\"><b>In the past ...</b></span><br>... you ended up in a literal warzone, bullets flying all around you. If it weren't for a dangerous psychopath you befriended you'd be a corpse.",
             "<span style=\"font-size: 14px; margin-top: 10px;\"><b>In the past ...</b></span><br>... your parents were deranged on some basal level and you grew up in chaos. You escaped as soon as you could.",
             "<span style=\"font-size: 14px; margin-top: 10px;\"><b>In the past ...</b></span><br>... somehow, through no fault of your own, you ended up with money and status. You don't know what happened to it all.",
             "<span style=\"font-size: 14px; margin-top: 10px;\"><b>In the past ...</b></span><br>... someone once took you out into some isolated place and showed you something that gives you weird dreams to this day.",
             "<span style=\"font-size: 14px; margin-top: 10px;\"><b>In the past ...</b></span><br>... you had a talent that showed itself at an early age. Everyone told you you would be famous for it, but here you are.",
             "<span style=\"font-size: 14px; margin-top: 10px;\"><b>In the past ...</b></span><br>... you look a job with no experience that no one thought you could do. After a few years, you quit and didn't look back. You can't say why.",
             "<span style=\"font-size: 14px; margin-top: 10px;\"><b>In the past ...</b></span><br>... someone very close to you died. No one would tell you what happened, and the people around you refused to talk about it.",
             "<span style=\"font-size: 14px; margin-top: 10px;\"><b>In the past ...</b></span><br>... Work. Sleep. Work. Sleep. Forever. One day you'd had enough, and in the middle of the day exploded in a rage. You left that life behind and never talk about it."],
            ["para",
             "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You <i>still</i> feel <span style=\"font-size: 14px; margin-top: 10px;\"><u>Endless Regret</u>:</b></span><br>You didn't comport yourself with any dignity or honesty. You thought you were better than that.",
             "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You <i>still</i> feel <span style=\"font-size: 14px; margin-top: 10px;\"><u>Simmering Rage</u>:</b></span><br>They know what they did, and they did it knowing what would happen.",
             "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You <i>still</i> feel a <span style=\"font-size: 14px; margin-top: 10px;\"><u>Miasma of Confusion</u>:</b></span><br>You can't square this circle. Nothing about this makes any sense and the more you think about it the worse it is.",
             "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You <i>still</i> feel <span style=\"font-size: 14px; margin-top: 10px;\"><u>Arrogant Certainty</u>:</b></span><br>You were there for the whole thing and it didn't beat you. Nothing can stand in your way now.",
             "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You <i>still</i> feel <span style=\"font-size: 14px; margin-top: 10px;\"><u>Bleak Joy</u>:</b></span><br>It's funny when you think about it. We're all just stuck here on this planet and absurd things keep happening.",
             "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You <i>still</i> feel <span style=\"font-size: 14px; margin-top: 10px;\"><u>Numb Disbelief</u>:</b></span><br>Did that really happen? It can't have happened. It doesn't feel real.",
             "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You <i>still</i> feel <span style=\"font-size: 14px; margin-top: 10px;\"><u>Renewed Purpose</u>:</b></span><br>Everything is lined up for you. You know what you have to do with your life now.",
             "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You <i>still</i> feel <span style=\"font-size: 14px; margin-top: 10px;\"><u>Frail Hopelessness</u>:</b></span><br>Nothing matters, and the more you look at it the more you feel like the Universe is a great, crushing wave.",
             "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You're <i>still</i> driven to <span style=\"font-size: 14px; margin-top: 10px;\"><u>Hypervigilance</u>:</b></span><br>This could happen at any moment to anyone. You keep your head on a swivel for the next time it does.",
             "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You <i>still</i> feel <span style=\"font-size: 14px; margin-top: 10px;\"><u>Overwhelming Oneness</u>:</b></span><br>Have you laid in the grass and felt the Earth spinning around you? That's how you feel when you reflect on this memory."],
            ["para",
             "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You can't let go because ... </b></span><br> ... it never ended. You just move forward and try to put the past behind you. But when you can't help but look back, it's always there, right at your heels.",
             "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You can't let go because ... </b></span><br> ... the responsible parties died before they could be confronted about their part in it.",
             "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You can't let go because ... </b></span><br> ... things keep repeating, the same situations keep appearing in your periphery and reopening old wounds.",
             "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You can't let go because ... </b></span><br> ... some problems are too big.  Some problems are systemic things that won't budge to one person's will.",
             "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You can't let go because ... </b></span><br> ... forgiveness is earned, and the person or people responsible haven't earned it.",
             "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You can't let go because ... </b></span><br> ... you can't put it right, because what is done is done.",
             "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You can't let go because ... </b></span><br> ... the system stepped in, the state or family, and took it all out of your hands.",
             "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You can't let go because ... </b></span><br> ... you don't understand how it happened, and because you don't understand it, you can't resolve it.",
             "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You can't let go because ... </b></span><br> ... everything returned to normal on the outside, but just underneath that veneer of normalcy... it sits.",
             "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You can't let go because ... </b></span><br> ... other things took priority, so it remained an open loop, still in the back of your head."],
        ],
        [
            "Habits",
            ["paraStart",
             "You reinforce or establish your <b>Profession</b> ",
             "You reinforce or establish your <b>Regional Background</b> ",
             "You reinforce or establish your <b>Social Class</b> ",
             "You reinforce or establish your <b>Childhood</b> ",
             "You reinforce or establish your <b>Political Ideology</b> ",
             "You reinforce or establish your <b>Opinion on Authority</b> ",
             "You reinforce or establish your <b>Religious Faith</b> ",
             "You reinforce or establish your <b>Family Status</b> ",
             "You reinforce or establish your <b>Sexual Preference</b> ",
             "You reinforce or establish your <b>Gender Identity</b> "],
            ["paraMid",
             "with your <b>Speech and Accent</b>, but undermine, subvert or contradict it ",
             "with your <b>Clothing and Aesthetics</b>, but undermine, subvert or contradict it ",
             "through your <b>Hobbies and Interests</b>, but undermine, subvert or contradict it ",
             "with your <b>Critical Opinions</b>, but undermine, subvert or contradict it ",
             "with your <b>Taste in Art/Music</b>, but undermine, subvert or contradict it ",
             "with your <b>Positive Opinions</b>, but undermine, subvert or contradict it ",
             "through your <b>Nervous Nature</b>, but undermine, subvert or contradict it ",
             "with your <b>Indulgent Vices</b>, but undermine, subvert or contradict it ",
             "with your <b>Outward Ambitions</b>, but undermine, subvert or contradict it ",
             "through your <b>Confident Behavior</b>, but undermine, subvert or contradict it "],
            ["paraEnd",
             "with your <b>Speech and Accent</b>.",
             "with your <b>Clothing and Aesthetics</b>.",
             "through your <b>Hobbies and Interests</b>.",
             "with your <b>Critical Opinions</b>.",
             "with your <b>Taste in Art/Music</b>.",
             "with your <b>Positive Opinions</b>.",
             "through your <b>Nervous Nature</b>.",
             "with your <b>Indulgent Vices</b>.",
             "with your <b>Outward Ambitions</b>.",
             "through your <b>Confident Behavior</b>."],
        ],
        [
            "Signposts",
            ["paraStart",
             "When you see or commit an <b>Abuse of Power</b>, ",
             "When you see or show <b>Disrespect</b>, ",
             "When you see or commit <b>Violence</b>, ",
             "When you see or commit <b>Degradation</b>, ",
             "When you see or cause <b>Death</b>, ",
             "When you hear or conceive <b>Wisdom</b>, ",
             "When you see or create <b>Beauty</b>, ",
             "When you encounter <b>Intellectualism</b>, ",
             "When you see or show <b>Respect</b>, ",
             "When you see or bring about <b>Justice</b>, ",
             "When you see or show <b>Mercy</b>, "],
            ["paraEnd",
             "you react with <b>Hatred</b> (or) <b>Love:</b> You want to destroy them for existing, or to bask in their glory.",
             "you react with <b>Disgust</b> (or) <b>Appreciation:</b> The smell of sour milk, or the sweet smell of opportunity.",
             "you react with <b>Rage</b> (or) <b>Joy:</b> They cut in front of you and laugh about it, or fill you with elation.",
             "you react with <b>Vigilant Distrust</b> (or) <b>Conviction:</b> You think you're being lied to, or you're more certain than ever.",
             "you react with <b>Admiration</b> (or) <b>Judgment:</b> One day you'll do what they did, or one day they'll learn.",
             "you react with <b>Bravery</b> (or) <b>Cowardice:</b> You stood up to the bully, or ran like hell.",
             "you react with <b>Amazement</b> (or) <b>Criticism:</b> Someone has to see this thing!",
             "you react with <b>Acceptance</b> (or) <b>Denial:</b> All this is according to design, or a change must come, whatever the cost.",
             "you react with <b>Attraction</b> (or) <b>Repulsion:</b> If you can just get a little closer... or farther away...",
             "you react with <b>Zeal</b> (or) <b>Boredom:</b> You're reminded of what is good in the world, or you grow impatient to find something more interesting."],
            ["paraStart",
             "When you see or commit an <b>Abuse of Power</b>, ",
             "When you see or show <b>Disrespect</b>, ",
             "When you see or commit <b>Violence</b>, ",
             "When you see or commit <b>Degradation</b>, ",
             "When you see or cause <b>Death</b>, ",
             "When you hear or conceive <b>Wisdom</b>, ",
             "When you see or create <b>Beauty</b>, ",
             "When you encounter <b>Intellectualism</b>, ",
             "When you see or show <b>Respect</b>, ",
             "When you see or bring about <b>Justice</b>, ",
             "When you see or show <b>Mercy</b>, "],
            ["paraEnd",
             "you react with <b>Hatred</b> (or) <b>Love:</b> You want to destroy them for existing, or to bask in their glory.",
             "you react with <b>Disgust</b> (or) <b>Appreciation:</b> The smell of sour milk, or the sweet smell of opportunity.",
             "you react with <b>Rage</b> (or) <b>Joy:</b> They cut in front of you and laugh about it, or fill you with elation.",
             "you react with <b>Vigilant Distrust</b> (or) <b>Conviction:</b> You think you're being lied to, or you're more certain than ever.",
             "you react with <b>Admiration</b> (or) <b>Judgment:</b> One day you'll do what they did, or one day they'll learn.",
             "you react with <b>Bravery</b> (or) <b>Cowardice:</b> You stood up to the bully, or ran like hell.",
             "you react with <b>Amazement</b> (or) <b>Criticism:</b> Someone has to see this thing!",
             "you react with <b>Acceptance</b> (or) <b>Denial:</b> All this is according to design, or a change must come, whatever the cost.",
             "you react with <b>Attraction</b> (or) <b>Repulsion:</b> If you can just get a little closer... or farther away...",
             "you react with <b>Zeal</b> (or) <b>Boredom:</b> You're reminded of what is good in the world, or you grow impatient to find something more interesting."],
        ],
    ]
    // #endregion

    // #region SPECIAL EFFECTS DEFINITIONS
    const FX = {
        bloodCloud: {
            duration: 50,
            maxParticles: 350,
            size: 30,
            sizeRandom: 5,
            lifeSpan: 15,
            lifeSpanRandom: 7,
            emissionRate: 20,
            speed: 3,
            speedRandom: 1.5,
            angle: 0,
            angleRandom: 360,
            startColour: [218, 0, 0, 1],
            startColourRandom: [160, 0, 15, 0],
            endColour: [35, 0, 0, 0],
            endColourRandom: [160, 0, 15, 0]
        },
        bloodCloud1: {
            duration: 50,
            maxParticles: 1000,
            size: 40,
            sizeRandom: 5,
            lifeSpan: 25,
            lifeSpanRandom: 7,
            emissionRate: 40,
            speed: 3,
            speedRandom: 1.5,
            angle: 0,
            angleRandom: 360,
            startColour: [18, 0, 0, 0.5],
            startColourRandom: [20, 0, 0, 0],
            endColour: [6, 0, 0, 0],
            endColourRandom: [0, 0, 0, 0]
        },
        bloodCloud2: {
            duration: 50,
            maxParticles: 350,
            size: 20,
            sizeRandom: 5,
            lifeSpan: 10,
            lifeSpanRandom: 5,
            emissionRate: 15,
            speed: 2,
            speedRandom: 0.5,
            angle: 0,
            angleRandom: 360,
            startColour: [0, 0, 0, 1],
            startColourRandom: [0, 0, 0, 0.5],
            endColour: [15, 0, 0, 0],
            endColourRandom: [0, 0, 0, 0]
        },
        bloodBolt: {
            angle: 0,
            angleRandom: 0.5,
            duration: 5,
            emissionRate: 5000,
            endColour: [0, 0, 0, 0],
            endColourRandom: [0, 0, 0, 0],
            gravity: {
                x: 0.01,
                y: 0.01
            },
            lifeSpan: 5,
            lifeSpanRandom: 0,
            maxParticles: 5000,
            size: 50,
            sizeRandom: 0,
            speed: 120,
            speedRandom: 121,
            startColour: [1, 0, 0, 0.5],
            startColourRandom: [10, 0, 0, 1]
        }
    }
    // #endregion

    return {
        CheckInstall: checkInstall,

        GAMENAME,
        ROOT,
        PIXELSPERSQUARE,

        NUMBERWORDS,
        ORDINALSUFFIX,
        COLORS,

        CHATHTML,
        HANDOUTHTML,
        HTML, bHTML,

        ATTRIBUTES,
        SKILLS, SKILLABBVS,
        DISCIPLINES, DISCABBVS,
        TRACKERS,
        CLANS,
        MISCATTRS,
        BLOODPOTENCY,

        RESONANCEODDS,
        MVCVALS,
        FX
    }
})()

on("ready", () => {
    C.CheckInstall()
    D.Log("CONSTANTS Ready!")
})
void MarkStop("CONSTANTS")