void MarkStart("CONSTANTS")
const C = {
    // #region CORE CONFIGURATION & BASIC REFERENCES
    GAMENAME: "VAMPIRE",
    ROOT: state[C.GAMENAME],
    PIXELSPERSQUARE: 70,
    NUMBERWORDS: {
        low: ["Zero","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen","Twenty"],
        tens: ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"],
        tiers: ["", "Thousand", "Million", "Billion", "Trillion", "Quadrillion", "Quintillion", "Sextillion", "Septillion", "Octillion", "Nonillion", "Decillion", "Undecillion", "Duodecillion", "Tredecillion", "Quattuordecillion", "Quindecillion", "Sexdecillion", "Septendecillion", "Octodecillion", "Novemdecillion", "Vigintillion", "Unvigintillion", "Duovigintillion", "Trevigintillion", "Quattuorvigintillion", "Quinvigintillion", "Sexvigintillion", "Septenvigintillion", "Octovigintillion", "Novemvigintillion", "Trigintillion", "Untrigintillion", "Duotrigintillion", "Tretrigintillion", "Quattuortrigintillion"] 
    },
    ORDINALSUFFIX: {
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
    // #endregion

    // #region HTML FORMATS
    CHATHTML: {        
        header: content => 
            `<div style="
                display: block;
                height: 20px;
                width: auto;
                line-height: 23px;
                padding: 0px 5px;
                margin: -30px 0px 0px -42px;
                font-family: 'copperplate gothic';
                font-variant: small-caps;
                font-size: 16px;
                background-color: #333;
                color: white;
                border: 2px solid black;
                position: relative;
            ">${content}</div>`,
        body: content => 
            `<div style="
                display: block;
                width: auto;
                padding: 5px 5px;
                margin-left: -42px;
                font-family: input, verdana, sans-serif;
                font-size: 10px;
                background-color: white;
                border: 2px solid black;
                line-height: 14px;
                position: relative;
            ">${content}</div>
            <div style="
                display: block;
                width: auto;
                margin-left: -42px;
                background-color: none;
                position: relative;
                height: 25px;
            "></div>`,        
    },
    // #endregion

    // #region VAMPIRE ATTRIBUTES, STATS & TRAITS
    ATTRIBUTES: {
        physical: ["Strength", "Dexterity", "Stamina"],
        social: ["Charisma", "Manipulation", "Composure"],
        mental: ["Intelligence", "Wits", "Resolve"]
    },
    SKILLS: {
        physical: ["Athletics", "Brawl", "Craft", "Drive", "Firearms", "Melee", "Larceny", "Stealth", "Survival"],
        social: ["Animal Ken", "Etiquette", "Insight", "Intimidation", "Leadership", "Performance", "Persuasion", "Streetwise", "Subterfuge"],
        mental: ["Academics", "Awareness", "Finance", "Investigation", "Medicine", "Occult", "Politics", "Science", "Technology"]
    },
    DISCIPLINES: ["Animalism", "Auspex", "Celerity", "Chimerstry", "Dominate", "Fortitude", "Obfuscate", "Oblivion", "Potence", "Presence", "Protean", "Blood Sorcery", "Alchemy"],
    TRACKERS: ["Willpower", "Health", "Humanity", "Blood Potency"],
    CLANS: ["Brujah", "Gangrel", "Malkavian", "Nosferatu", "Toreador", "Tremere", "Ventrue", "Lasombra", "Tzimisce", "Banu Haqim", "Ministry", "Hecata", "Ravnos"],
    MISCATTRS: ["blood_potency_max"],
    BLOODPOTENCY: [
        {bp_surge: 0, bp_discbonus: 0},
        {bp_surge: 1, bp_discbonus: 1},
        {bp_surge: 1, bp_discbonus: 1},
        {bp_surge: 2, bp_discbonus: 1},
        {bp_surge: 2, bp_discbonus: 2},
        {bp_surge: 3, bp_discbonus: 2},
        {bp_surge: 3, bp_discbonus: 3},
        {bp_surge: 4, bp_discbonus: 3},
        {bp_surge: 4, bp_discbonus: 4},
        {bp_surge: 5, bp_discbonus: 4},
        {bp_surge: 5, bp_discbonus: 5}
    ],
    RESONANCEODDS: {
        norm: [						
            {neg: 0.1245, fleet: 0.0753, intense: 0.0403, acute: 0.01},
            {neg: 0.1245, fleet: 0.0753, intense: 0.0403, acute: 0.01},
            {neg: 0.1245, fleet: 0.0753, intense: 0.0403, acute: 0.01},
            {neg: 0.1245, fleet: 0.0753, intense: 0.0403, acute: 0.01}
        ], 					
        pos: [						
            {neg: 0.166, fleet: 0.1003, intense: 0.0537, acute: 0.0133},
            {neg: 0.1107, fleet: 0.0669, intense: 0.0358, acute: 0.0089},
            {neg: 0.1107, fleet: 0.0669, intense: 0.0358, acute: 0.0089},
            {neg: 0.1107, fleet: 0.0669, intense: 0.0358, acute: 0.0089}
        ], 					
        neg: [						
            {neg: 0.1358, fleet: 0.0821, intense: 0.0439, acute: 0.0109},
            {neg: 0.1358, fleet: 0.0821, intense: 0.0439, acute: 0.0109},
            {neg: 0.1358, fleet: 0.0821, intense: 0.0439, acute: 0.0109},
            {neg: 0.0905, fleet: 0.0547, intense: 0.0293, acute: 0.0073}
        ], 					
        posneg: [						
            {neg: 0.1793, fleet: 0.1084, intense: 0.058, acute: 0.0144},
            {neg: 0.1195, fleet: 0.0722, intense: 0.0386, acute: 0.0096},
            {neg: 0.1195, fleet: 0.0722, intense: 0.0386, acute: 0.0096},
            {neg: 0.0797, fleet: 0.0482, intense: 0.0258, acute: 0.0064}
        ], 					
        pos2: [						
            {neg: 0.249, fleet: 0.1505, intense: 0.0805, acute: 0.02},
            {neg: 0.083, fleet: 0.0502, intense: 0.0268, acute: 0.0067},
            {neg: 0.083, fleet: 0.0502, intense: 0.0268, acute: 0.0067},
            {neg: 0.083, fleet: 0.0502, intense: 0.0268, acute: 0.0067}
        ], 					
        pospos: [						
            {neg: 0.166, fleet: 0.1003, intense: 0.0537, acute: 0.0133},
            {neg: 0.166, fleet: 0.1003, intense: 0.0537, acute: 0.0133},
            {neg: 0.083, fleet: 0.0502, intense: 0.0268, acute: 0.0067},
            {neg: 0.083, fleet: 0.0502, intense: 0.0268, acute: 0.0067}
        ], 					
        neg2: [						
            {neg: 0.1573, fleet: 0.0951, intense: 0.0508, acute: 0.0126},
            {neg: 0.1573, fleet: 0.0951, intense: 0.0508, acute: 0.0126},
            {neg: 0.1573, fleet: 0.0951, intense: 0.0508, acute: 0.0126},
            {neg: 0.0262, fleet: 0.0158, intense: 0.0085, acute: 0.0021}
        ], 					
        negneg: [						
            {neg: 0.166, fleet: 0.1003, intense: 0.0537, acute: 0.0133},
            {neg: 0.166, fleet: 0.1003, intense: 0.0537, acute: 0.0133},
            {neg: 0.083, fleet: 0.0502, intense: 0.0268, acute: 0.0067},
            {neg: 0.083, fleet: 0.0502, intense: 0.0268, acute: 0.0067}
        ], 					
        pos2neg: [						
            {neg: 0.249, fleet: 0.1505, intense: 0.0805, acute: 0.02},
            {neg: 0.0996, fleet: 0.0602, intense: 0.0322, acute: 0.008},
            {neg: 0.0996, fleet: 0.0602, intense: 0.0322, acute: 0.008},
            {neg: 0.0498, fleet: 0.0301, intense: 0.0161, acute: 0.004}
        ], 					
        neg2pos: [						
            {neg: 0.2241, fleet: 0.1355, intense: 0.0725, acute: 0.018},
            {neg: 0.1245, fleet: 0.0753, intense: 0.0403, acute: 0.01},
            {neg: 0.1245, fleet: 0.0753, intense: 0.0403, acute: 0.01},
            {neg: 0.0249, fleet: 0.0151, intense: 0.0081, acute: 0.002}
        ], 					
        posposneg: [						
            {neg: 0.1743, fleet: 0.1054, intense: 0.0564, acute: 0.014},
            {neg: 0.1743, fleet: 0.1054, intense: 0.0564, acute: 0.014},
            {neg: 0.0996, fleet: 0.0602, intense: 0.0322, acute: 0.008},
            {neg: 0.0498, fleet: 0.0301, intense: 0.0161, acute: 0.004}
        ], 					
        posnegneg: [						
            {neg: 0.2241, fleet: 0.1355, intense: 0.0725, acute: 0.018},
            {neg: 0.1245, fleet: 0.0753, intense: 0.0403, acute: 0.01},
            {neg: 0.0747, fleet: 0.0452, intense: 0.0242, acute: 0.006},
            {neg: 0.0747, fleet: 0.0452, intense: 0.0242, acute: 0.006}
        ], 					
    },
    // #endregion

    // #region SPECIAL EFFECTS DEFINITIONS
    FX: {
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
    },
    // #endregion
}

void MarkStop("CONSTANTS")