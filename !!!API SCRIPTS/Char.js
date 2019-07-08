void MarkStart("Char")
const Char = (() => {
	// #region INITIALIZATION
    const SCRIPTNAME = "Char",
		    STATEREF = C.ROOT[SCRIPTNAME]	// eslint-disable-line no-unused-vars
    const VAL = (varList, funcName) => D.Validate(varList, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
		   DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME) // eslint-disable-line no-unused-vars
	// #endregion

	// #region Constants and Declarations
    const REGISTRY = STATEREF.registry,
        MVCVALS = [
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
        ],
        HTML = {
            start: "<div style=\"display: block; width: 100%; padding: 5px 5px; margin-left: -10px; margin-top: -20px; margin-bottom: -5px; color: white; font-variant: small-caps; font-family: 'Bodoni SvtyTwo ITC TT'; text-align: left; font-size: 16px;  border: 3px outset darkred; background: url('https://imgur.com/kBl8aTO.jpg') top; bg-color: black; z-index: 100; position: relative;\">",
            stop: "</div>",
        },
        bHTML = {
            div: {
                title: {
                    start: "<div style=\"" +
							"display:block; " +
							"width: 120%; " +
							"margin: 10px -10%;" +
							"color: white; " +
							"text-align: center; " +
							"font: normal normal 22px/22px Effloresce; " +
							"border-bottom: 1px white solid;" +
							"\" >",
                    stop: "</div>",
                },
                header: {
                    start: "<div style=\"" +
							"display:block; " +
							"width: 120%; " +
							"margin: 0px -10% 0px -10%;" +
							"color: white; " +
							"text-align: center; " +
							"font: normal normal 16px / 20px 'Bodoni SvtyTwo ITC TT'; " +
							"\" >",
                    stop: "</div>",
                },
                headerL: {
                    start: "<div style=\"" +
							"display:inline-block; " +
							"width: 120%; " +
							"margin: 5% -10% 0px -10%;" +
							"color: white; " +
							"text-align: center; " +
							"font: normal normal 16px / 20px 'Bodoni SvtyTwo ITC TT';" +
							"\" >",
                    stop: "",
                },
                headerR: {
                    start: " ",
                    stop: "</div>",
                },
                para: {
                    start: "<div style=\"" +
							"display:block; " +
							"width: 103%; " +
							"margin: 5px 0px;" +
							"color: white; " +
							"text-align: left; " +
							"font: normal normal 12px/14px Rockwell; " +
							"\" >",
                    stop: "</div>",
                },
                paraStart: {
                    start: "<div style=\"" +
							"display:block; " +
							"width: 100%; " +
							"margin: 5px 0px;" +
							"color: white; " +
							"text-align: left; " +
							"font: normal normal 12px/14px Rockwell; " +
							"\" >",
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
        },
        SORTFUNCS = {
            earnedxp: (charRef, secName, idA, idB) => {
                const attrsA = D.GetStatData(charRef, [secName, idA]),
                    attrsB = D.GetStatData(charRef, [secName, idB]),
                    p = (v, id) => `repeating_${secName}_${id}_${v}`,
                    sessions = [
                        "Zero",
                        "One",
                        "Two",
                        "Three",
                        "Four",
                        "Five",
                        "Six",
                        "Seven",
                        "Eight",
                        "Nine",
                        "Ten",
                        "Eleven",
                        "Twelve",
                        "Thirteen",
                        "Fourteen",
                        "Fifteen",
                        "Sixteen",
                        "Seventeen",
                        "Eighteen",
                        "Nineteen",
                        "Twenty",
                    ],
                    sessA = sessions.indexOf(attrsA[p("xp_session", idA)]),
                    sessB = sessions.indexOf(attrsB[p("xp_session", idB)])
                if (sessA === sessB)
                    return parseInt(attrsB[p("xp_award", idB)]) - parseInt(attrsA[p("xp_award", idA)])
	
                return sessA - sessB
            }
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
        BPMINHUNGER = [ 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4 ]
	// #endregion
    
		// #region JSON Text Blocks
		/* eslint-disable-next-line quotes */
    const NPCSTATS = '{"-LNQHXkCj5qvPpMJRgaP": { "base": {"clan": "Tremere", "faction": "Camarilla", "generation": 8, "blood_potency": 6, "humanity": 3, "stains": 0 }, "attributes": { "strength": 3, "dexterity": 2, "stamina": 3, "charisma": 3, "manipulation": 3, "composure": 4, "intelligence": 6, "wits": 4, "resolve": 4 }, "skills": { "6": "OCC", "5": "AWA INT POL INS SUB", "4": "MEL ACA INV", "3": "BRA LED ETI", "2": "PER", "1": "SCI" }, "clandiscs": { "disc1": ["Auspex", 4], "disc2": ["Dominate", 5], "disc3": ["Blood Sorcery", 5] }, "otherdiscs": { "5": "", "4": "", "3": "PRE OBF", "2": "", "1": "" } },"-LNQFgr6-qOsG0YDON5o": { "base": {"clan": "Malkavian", "faction": "Anarch", "generation": 11, "blood_potency": 3, "humanity": 6, "stains": 0 }, "attributes": { "strength": 1, "dexterity": 2, "stamina": 2, "charisma": 3, "manipulation": 4, "composure": 2, "intelligence": 4, "wits": 5, "resolve": 2 }, "skills": { "6": "", "5": "INS AWA", "4": "SUB LED INV", "3": "LAR SUR POL", "2": "PER TEC ETI", "1": "ATH BRA MEL FIN" }, "clandiscs": { "disc1": ["Auspex", 4], "disc2": ["Dominate", 3], "disc3": ["Obfuscate", 4] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "CEL", "1": "" } },"-LNQFwYKATjHDhiO_SaO": { "base": {"clan": "Malkavian", "faction": "Anarch", "generation": 12, "blood_potency": 2, "humanity": 6, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 3, "stamina": 2, "charisma": 3, "manipulation": 4, "composure": 3, "intelligence": 2, "wits": 2, "resolve": 1 }, "skills": { "6": "", "5": "PER", "4": "SUB", "3": "INS ATH", "2": "INV AWA STR", "1": "BRA STL DRV" }, "clandiscs": { "disc1": ["Auspex", 0], "disc2": ["Dominate", 4], "disc3": ["Obfuscate", 2] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LNQFyJ-TyDfOrdNSi_o": { "base": {"clan": "Brujah", "faction": "Anarch", "generation": 11, "blood_potency": 2, "humanity": 7, "stains": 0 }, "attributes": { "strength": 4, "dexterity": 3, "stamina": 3, "charisma": 2, "manipulation": 3, "composure": 2, "intelligence": 2, "wits": 1, "resolve": 2 }, "skills": { "6": "", "5": "", "4": "", "3": "SUB INS", "2": "PRF STR ATH ETI LAR ACA POL PER", "1": "AWA MEL TEC FIN SUR FIR DRV MED INV" }, "clandiscs": { "disc1": ["Celerity", 1], "disc2": ["Presence", 3], "disc3": ["Potence", 2] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LNQFw2N0ga48U9Topv6": { "base": {"clan": "Malkavian", "faction": "Anarch", "generation": 9, "blood_potency": 5, "humanity": 8, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 4, "stamina": 2, "charisma": 1, "manipulation": 2, "composure": 2, "intelligence": 5, "wits": 4, "resolve": 2 }, "skills": { "6": "", "5": "", "4": "OCC INS", "3": "STL ACA POL STR", "2": "ATH SUB FIN MED SCI", "1": "BRA LAR MEL INT LED PER SUR DRV TEC ETI" }, "clandiscs": { "disc1": ["Auspex", 4], "disc2": ["Dominate", 1], "disc3": ["Obfuscate", 3] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "FOR" } },"-LNQHYdq6TiLMFGVmmW6": { "base": {"clan": "Nosferatu", "faction": "Camarilla", "generation": 10, "blood_potency": 3, "humanity": 8, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 2, "stamina": 4, "charisma": 1, "manipulation": 1, "composure": 3, "intelligence": 3, "wits": 3, "resolve": 5 }, "skills": { "6": "", "5": "INV", "4": "AWA BRA INS", "3": "MEL STR LED", "2": "STE TEC ANK INT POL", "1": "ATH FIR SUR SUB" }, "clandiscs": { "disc1": ["Animalism", 2], "disc2": ["Obfuscate", 4], "disc3": ["Potence", 3] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LNQG0wxWA3u5Ec_eYzq": { "base": {"clan": "Nosferatu", "faction": "Anarch", "generation": 9, "blood_potency": 4, "humanity": 6, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 1, "stamina": 2, "charisma": 3, "manipulation": 4, "composure": 5, "intelligence": 2, "wits": 4, "resolve": 2 }, "skills": { "6": "", "5": "INS PER POL", "4": "ANK SUB", "3": "LED ACA", "2": "STL MEL", "1": "ATH INV" }, "clandiscs": { "disc1": ["Animalism", 4], "disc2": ["Obfuscate", 3], "disc3": ["Potence", 2] }, "otherdiscs": { "5": "", "4": "", "3": "PRE", "2": "", "1": "" } },"-LWe9buk5mborjCgeb95": { "base": {"clan": "Thin-Blooded", "faction": "Anarch", "generation": 14, "blood_potency": 0, "humanity": 9, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 2, "stamina": 3, "charisma": 2, "manipulation": 1, "composure": 2, "intelligence": 4, "wits": 3, "resolve": 3 }, "skills": { "6": "", "5": "", "4": "SCI", "3": "OCC ACA TEC", "2": "INV AWA MED", "1": "PER SUB STR" }, "clandiscs": { "disc1": ["Alchemy", 3], "disc2": [], "disc3": [] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LNQG0fyUU5WgN2IYaLo": { "base": {"clan": "Brujah", "faction": "Anarch", "generation": 12, "blood_potency": 1, "humanity": 7, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 2, "stamina": 3, "charisma": 4, "manipulation": 3, "composure": 3, "intelligence": 2, "wits": 1, "resolve": 2 }, "skills": { "6": "", "5": "", "4": "", "3": "PRF PER LED", "2": "INT AWA MEL POL SUB", "1": "ACA ETI INS STR BRA FIR INV" }, "clandiscs": { "disc1": ["Celerity", 1], "disc2": ["Presence", 2], "disc3": ["Potence", 1] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LNQG0N7ZGUK1zMpm6Zx": { "base": {"clan": "Malkavian", "faction": "Anarch", "generation": 13, "blood_potency": 1, "humanity": 7, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 2, "stamina": 1, "charisma": 1, "manipulation": 4, "composure": 2, "intelligence": 4, "wits": 2, "resolve": 4 }, "skills": { "6": "", "5": "", "4": "INS", "3": "ACA OCC POL", "2": "FIN MED INV", "1": "STR SUB PER" }, "clandiscs": { "disc1": ["Auspex", 1], "disc2": ["Dominate", 1], "disc3": ["Obfuscate", 0] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "SOR PTN" } },"-LNQG04sy2d4LNugi8xE": { "base": {"clan": "Toreador", "faction": "Anarch", "generation": 11, "blood_potency": 1, "humanity": 6, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 3, "stamina": 2, "charisma": 4, "manipulation": 4, "composure": 2, "intelligence": 2, "wits": 2, "resolve": 1 }, "skills": { "6": "", "5": "", "4": "ETI", "3": "PER SUB POL", "2": "INS LED INV FIN", "1": "ATH BRA MEL LAR INT AWA TEC" }, "clandiscs": { "disc1": ["Auspex", 1], "disc2": ["Celerity", 2], "disc3": ["Presence", 3] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LNQFzHYmcnDqQSytLhP": { "base": {"clan": "Brujah", "faction": "Anarch", "generation": 11, "blood_potency": 2, "humanity": 6, "stains": 0 }, "attributes": { "strength": 4, "dexterity": 3, "stamina": 3, "charisma": 2, "manipulation": 1, "composure": 2, "intelligence": 3, "wits": 2, "resolve": 2 }, "skills": { "6": "", "5": "", "4": "BRA", "3": "ATH STR LED", "2": "AWA INV MEL STL", "1": "DRV FIR LAR POL INS INT SUR" }, "clandiscs": { "disc1": ["Celerity", 2], "disc2": ["Presence", 1], "disc3": ["Potence", 3] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LNQG-Q_Zvl0YZlCIzcQ": { "base": {"clan": "Gangrel", "faction": "Anarch", "generation": 11, "blood_potency": 2, "humanity": 5, "stains": 0 }, "attributes": { "strength": 3, "dexterity": 3, "stamina": 4, "charisma": 1, "manipulation": 2, "composure": 2, "intelligence": 2, "wits": 2, "resolve": 3 }, "skills": { "6": "", "5": "", "4": "ATH", "3": "BRA MEL STR", "2": "SUR STL ANI", "1": "AWA INV LAR" }, "clandiscs": { "disc1": ["Animalism", 1], "disc2": ["Fortitude", 0], "disc3": ["Protean", 3] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LNQG-8UJao43g8Hd2Fl": { "base": {"clan": "Gangrel", "faction": "Anarch", "generation": 11, "blood_potency": 3, "humanity": 5, "stains": 0 }, "attributes": { "strength": 3, "dexterity": 5, "stamina": 2, "charisma": 2, "manipulation": 1, "composure": 2, "intelligence": 2, "wits": 2, "resolve": 3 }, "skills": { "6": "", "5": "MEL", "4": "ATH", "3": "STR LAR", "2": "INS INT BRA", "1": "INV MED SUR" }, "clandiscs": { "disc1": ["Animalism", 2], "disc2": ["Fortitude", 0], "disc3": ["Protean", 4] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LNQFzrFI1aP3xdVYFVY": { "base": {"clan": "Gangrel", "faction": "Anarch", "generation": 11, "blood_potency": 2, "humanity": 6, "stains": 0 }, "attributes": { "strength": 3, "dexterity": 2, "stamina": 2, "charisma": 3, "manipulation": 4, "composure": 3, "intelligence": 2, "wits": 1, "resolve": 2 }, "skills": { "6": "", "5": "", "4": "", "3": "PRF SUB INS", "2": "ATH MEL ANI INT INV", "1": "AWA BRA LAR STL SUR ANK PER" }, "clandiscs": { "disc1": ["Animalism", 2], "disc2": ["Fortitude", 1], "disc3": ["Protean", 1] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LNQFz_V0ms41yrxwJ1x": { "base": {"clan": "Malkavian", "faction": "Anarch", "generation": 6, "blood_potency": 4, "humanity": 7, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 3, "stamina": 3, "charisma": 4, "manipulation": 6, "composure": 5, "intelligence": 3, "wits": 3, "resolve": 5 }, "skills": { "6": "SUB", "5": "INS STL", "4": "ETI STR ACA AWA OCC", "3": "BRA MEL ATH INV", "2": "FIN POL LAR SUR PER TEC", "1": "CRA MED LED SCI FIR DRV" }, "clandiscs": { "disc1": ["Auspex", 4], "disc2": ["Dominate", 5], "disc3": ["Obfuscate", 5] }, "otherdiscs": { "5": "", "4": "PTN", "3": "FOR", "2": "CEL", "1": "ANI" } },"-LNQFtzeAa6FUgB4pO1R": { "base": {"clan": "Brujah", "faction": "Anarch", "generation": 11, "blood_potency": 2, "humanity": 5, "stains": 0 }, "attributes": { "strength": 3, "dexterity": 2, "stamina": 2, "charisma": 4, "manipulation": 2, "composure": 4, "intelligence": 2, "wits": 1, "resolve": 2 }, "clandiscs": { "disc1": ["Celerity", 2], "disc2": ["Presence", 2], "disc3": ["Potence", 4] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LNQFtYW-m47AqMuMI4X": { "base": {"clan": "Malkavian", "faction": "Anarch", "generation": 13, "blood_potency": 1, "humanity": 5, "stains": 0 }, "attributes": { "strength": 3, "dexterity": 3, "stamina": 2, "charisma": 1, "manipulation": 2, "composure": 2, "intelligence": 4, "wits": 3, "resolve": 2 }, "clandiscs": { "disc1": ["Auspex", 1], "disc2": ["Dominate", 0], "disc3": ["Obfuscate", 2] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "ANI", "1": "POT" } },"-LNQFt37ROBDaLQ3aZuT": { "base": {"clan": "Nosferatu", "faction": "Anarch", "generation": 13, "blood_potency": 1, "humanity": 3, "stains": 0 }, "attributes": { "strength": 4, "dexterity": 3, "stamina": 3, "charisma": 1, "manipulation": 2, "composure": 2, "intelligence": 3, "wits": 2, "resolve": 2 }, "clandiscs": { "disc1": ["Animalism", 1], "disc2": ["Obfuscate", 1], "disc3": ["Potence", 1] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "PTN" } },"-LNQFxShAsElf1Qy5xv_": { "base": {"clan": "Gangrel", "faction": "Anarch", "generation": 13, "blood_potency": 2, "humanity": 6, "stains": 0 }, "attributes": { "strength": 4, "dexterity": 3, "stamina": 3, "charisma": 2, "manipulation": 1, "composure": 2, "intelligence": 2, "wits": 2, "resolve": 3 }, "clandiscs": { "disc1": ["Animalism", 0], "disc2": ["Fortitude", 2], "disc3": ["Protean", 4] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "POT", "1": "" } },"-LNQFxo7w4eJYFQYNeZd": { "base": {"clan": "Gangrel", "faction": "Anarch", "generation": 13, "blood_potency": 1, "humanity": 6, "stains": 0 }, "attributes": { "strength": 3, "dexterity": 4, "stamina": 3, "charisma": 2, "manipulation": 1, "composure": 2, "intelligence": 2, "wits": 2, "resolve": 3 }, "clandiscs": { "disc1": ["Animalism", 0], "disc2": ["Fortitude", 3], "disc3": ["Protean", 1] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LWeAmvEEK2_kLoCN2w_": { "base": {"clan": "Thin-Blooded", "faction": "Anarch", "generation": 14, "blood_potency": 0, "humanity": 6, "stains": 0 }, "attributes": { "strength": 4, "dexterity": 3, "stamina": 3, "charisma": 2, "manipulation": 3, "composure": 2, "intelligence": 1, "wits": 2, "resolve": 2 }, "clandiscs": { "disc1": ["Alchemy", 1], "disc2": [], "disc3": [] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LWeAY-ePMjLtV6xSs6h": { "base": {"clan": "Thin-Blooded", "faction": "Anarch", "generation": 14, "blood_potency": 0, "humanity": 7, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 2, "stamina": 3, "charisma": 3, "manipulation": 3, "composure": 2, "intelligence": 2, "wits": 4, "resolve": 1 }, "clandiscs": { "disc1": ["Alchemy", 1], "disc2": [], "disc3": [] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LTJM_n4VcZzmFKjWG74": { "base": {"clan": "Ministry", "faction": "Anarch", "generation": 9, "blood_potency": 5, "humanity": 6, "stains": 0 }, "attributes": { "strength": 1, "dexterity": 3, "stamina": 2, "charisma": 5, "manipulation": 3, "composure": 4, "intelligence": 2, "wits": 4, "resolve": 2 }, "skills": { "6": "", "5": "INS PER SUB STR", "4": "STL ETI LED", "3": "OCC", "2": "MEL", "1": "POL MED" }, "clandiscs": { "disc1": ["Obfuscate", 2], "disc2": ["Presence", 4], "disc3": ["Protean", 3] }, "otherdiscs": { "5": "AUS", "4": "", "3": "", "2": "", "1": "CEL" } },"-LTJMSdW7fIoXAFfKcET": { "base": {"clan": "Ministry", "faction": "Anarch", "generation": 10, "blood_potency": 3, "humanity": 6, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 2, "stamina": 1, "charisma": 4, "manipulation": 3, "composure": 3, "intelligence": 3, "wits": 2, "resolve": 2 }, "skills": { "6": "", "5": "INS", "4": "PER SUB", "3": "STL MEL", "2": "STR OCC", "1": "ATH BRA DRV" }, "clandiscs": { "disc1": ["Obfuscate", 1], "disc2": ["Presence", 3], "disc3": ["Protean", 4] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LTJMWxeANEe12WCfXtm": { "base": {"clan": "Ministry", "faction": "Anarch", "generation": 10, "blood_potency": 3, "humanity": 4, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 2, "stamina": 1, "charisma": 4, "manipulation": 5, "composure": 3, "intelligence": 4, "wits": 2, "resolve": 2 }, "skills": { "6": "", "5": "SUB ETI PER", "4": "INS STL", "3": "INT LAR", "2": "ATH STR", "1": "POL" }, "clandiscs": { "disc1": ["Obfuscate", 1], "disc2": ["Presence", 4], "disc3": ["Protean", 3] }, "otherdiscs": { "5": "", "4": "", "3": "AUS", "2": "", "1": "" } },"-LTJMKmVLVu5OazFXbUo": { "base": {"clan": "Ministry", "faction": "Anarch", "generation": 10, "blood_potency": 3, "humanity": 9, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 3, "stamina": 2, "charisma": 4, "manipulation": 3, "composure": 3, "intelligence": 2, "wits": 2, "resolve": 1 }, "skills": { "6": "", "5": "PER", "4": "PRF ", "3": "ETI INS", "2": "AWA SUB STL", "1": "BRA FIR DRV" }, "clandiscs": { "disc1": ["Obfuscate", 0], "disc2": ["Presence", 4], "disc3": ["Protean", 2] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LU7pcmKytkmcej5SH9c": { "base": {"clan": "Brujah", "faction": "Anarch", "generation": 12, "blood_potency": 1, "humanity": 9, "stains": 0 }, "attributes": { "strength": 3, "dexterity": 3, "stamina": 3, "charisma": 2, "manipulation": 1, "composure": 2, "intelligence": 2, "wits": 2, "resolve": 4 }, "skills": { "6": "", "5": "", "4": "MEL", "3": "INT ATH OCC", "2": "STR LED PER FIR", "1": "BRA ACA AWA ETI ANI TEC INV" }, "clandiscs": { "disc1": ["Celerity", 2], "disc2": ["Presence", 1], "disc3": ["Potence", 3] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LNQFvl-ktzpXfhkW8ZQ": { "base": {"clan": "Brujah", "faction": "Anarch", "generation": 12, "blood_potency": 2, "humanity": 7, "stains": 0 }, "attributes": { "strength": 3, "dexterity": 3, "stamina": 4, "charisma": 2, "manipulation": 1, "composure": 2, "intelligence": 2, "wits": 2, "resolve": 3 }, "clandiscs": { "disc1": ["Celerity", 2], "disc2": ["Presence", 1], "disc3": ["Potence", 1] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LNQFv8D4hqgpkRNVb8I": { "base": {"clan": "Nosferatu", "faction": "Anarch", "generation": 12, "blood_potency": 2, "humanity": 7, "stains": 0 }, "attributes": { "strength": 3, "dexterity": 4, "stamina": 3, "charisma": 1, "manipulation": 2, "composure": 2, "intelligence": 2, "wits": 3, "resolve": 2 }, "clandiscs": { "disc1": ["Animalism", 0], "disc2": ["Obfuscate", 3], "disc3": ["Potence", 0] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "CEL" } },"-LNQFvRGMoiNF54OL3wL": { "base": {"clan": "Gangrel", "faction": "Anarch", "generation": 12, "blood_potency": 2, "humanity": 6, "stains": 0 }, "attributes": { "strength": 3, "dexterity": 3, "stamina": 4, "charisma": 2, "manipulation": 2, "composure": 2, "intelligence": 3, "wits": 1, "resolve": 2 }, "clandiscs": { "disc1": ["Animalism", 1], "disc2": ["Fortitude", 1], "disc3": ["Protean", 2] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LWeQPMwOtwmjU_CY-uE": { "base": {"clan": "Nosferatu", "faction": "Camarilla", "generation": 8, "blood_potency": 4, "humanity": 5, "stains": 0 }, "attributes": { "strength": 4, "dexterity": 3, "stamina": 4, "charisma": 3, "manipulation": 2, "composure": 3, "intelligence": 6, "wits": 3, "resolve": 4 }, "clandiscs": { "disc1": ["Animalism", 4], "disc2": ["Obfuscate", 5], "disc3": ["Potence", 4] }, "otherdiscs": { "5": "", "4": "", "3": "CEL", "2": "DOM", "1": "FOR AUS" } },"-LYxow0RcEaAl2B-nZBK": { "base": {"clan": "Banu Haqim", "faction": "Camarilla", "generation": 7, "blood_potency": 6, "humanity": 5, "stains": 0 }, "attributes": { "strength": 3, "dexterity": 4, "stamina": 3, "charisma": 3, "manipulation": 3, "composure": 4, "intelligence": 6, "wits": 2, "resolve": 4 }, "clandiscs": { "disc1": ["Celerity", 5], "disc2": ["Obfuscate", 5], "disc3": ["Blood Sorcery", 4] }, "otherdiscs": { "5": "", "4": "", "3": "POT FOR", "2": "", "1": "" } },"-LYxov6gTCWlZO86Jlw2": { "base": {"clan": "Banu Haqim", "faction": "Camarilla", "generation": 8, "blood_potency": 5, "humanity": 5, "stains": 0 }, "attributes": { "strength": 4, "dexterity": 5, "stamina": 2, "charisma": 3, "manipulation": 2, "composure": 2, "intelligence": 4, "wits": 2, "resolve": 1 }, "skills": { "6": "", "5": "MEL", "4": "STL ACA OCC", "3": "ATH POL INV LAR", "2": "", "1": "" }, "clandiscs": { "disc1": ["Celerity", 4], "disc2": ["Obfuscate", 3], "disc3": ["Blood Sorcery", 2] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "POT FOR" } },"-LNQHYKTacAmhlW7G87N": { "base": {"clan": "Ventrue", "faction": "Camarilla", "generation": 9, "blood_potency": 4, "humanity": 6, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 2, "stamina": 2, "charisma": 5, "manipulation": 3, "composure": 4, "intelligence": 3, "wits": 1, "resolve": 4 }, "skills": { "6": "", "5": "LED POL SUB INS", "4": "PER ETI FIR", "3": "AWA", "2": "INT", "1": "MEL" }, "clandiscs": { "disc1": ["Dominate", 4], "disc2": ["Fortitude", 3], "disc3": ["Presence", 5] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "AUS", "1": "CEL" } },"-LPNSsmxNeokaKtssoE1": { "base": {"clan": "Tremere", "faction": "Camarilla", "generation": 9, "blood_potency": 4, "humanity": 6, "stains": 0 }, "attributes": { "strength": 5, "dexterity": 4, "stamina": 2, "charisma": 2, "manipulation": 2, "composure": 2, "intelligence": 3, "wits": 1, "resolve": 4 }, "skills": { "6": "", "5": "MEL", "4": "OCC INT STL", "3": "INS STR SUB INV", "2": "SUR ETI POL", "1": "ATH BRA LAR AWA" }, "clandiscs": { "disc1": ["Auspex", 1], "disc2": ["Dominate", 4], "disc3": ["Blood Sorcery", 2] }, "otherdiscs": { "5": "", "4": "", "3": "CEL", "2": "", "1": "POT" } },"-LWeQO4py4GrquBo2Gck": { "base": {"clan": "Nosferatu", "faction": "Camarilla", "generation": 10, "blood_potency": 3, "humanity": 5, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 5, "stamina": 3, "charisma": 1, "manipulation": 2, "composure": 2, "intelligence": 4, "wits": 4, "resolve": 2 }, "skills": { "6": "", "5": "MEL ATH STL", "4": "INS SUB AWA", "3": "INV STR", "2": "LAR", "1": "SUR BRA" }, "clandiscs": { "disc1": ["Animalism", 3], "disc2": ["Obfuscate", 4], "disc3": ["Potence", 3] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "CEL FOR PTN" } },"-LWeQNOKb98WrdeMY_OZ": { "base": {"clan": "Nosferatu", "faction": "Camarilla", "generation": 10, "blood_potency": 3, "humanity": 5, "stains": 0 }, "attributes": { "strength": 1, "dexterity": 3, "stamina": 2, "charisma": 5, "manipulation": 2, "composure": 3, "intelligence": 2, "wits": 4, "resolve": 2 }, "clandiscs": { "disc1": ["Animalism", 2], "disc2": ["Obfuscate", 3], "disc3": ["Potence", 1] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "PRE", "1": "DOM" } },"-LV_h7g8eC2VrHbM8iXi": { "base": {"clan": "Toreador", "faction": "Camarilla", "generation": 12, "blood_potency": 1, "humanity": 6, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 2, "stamina": 1, "charisma": 4, "manipulation": 3, "composure": 2, "intelligence": 3, "wits": 3, "resolve": 2 }, "clandiscs": { "disc1": ["Auspex", 2], "disc2": ["Celerity", 1], "disc3": ["Presence", 3] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LV_h7H_YjGXLpmW0aiR": { "base": {"clan": "Ventrue", "faction": "Camarilla", "generation": 11, "blood_potency": 3, "humanity": 6, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 2, "stamina": 2, "charisma": 3, "manipulation": 4, "composure": 3, "intelligence": 3, "wits": 2, "resolve": 1 }, "clandiscs": { "disc1": ["Dominate", 4], "disc2": ["Fortitude", 1], "disc3": ["Presence", 3] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LWeQOc-Gvu8OuQTIwqO": { "base": {"clan": "Nosferatu", "faction": "Camarilla", "generation": 12, "blood_potency": 2 } },"-LWeCAgTYMRyw0wkup2b": { "base": {"clan": "Nosferatu", "faction": "Camarilla", "generation": 12, "blood_potency": 2 } },"-LWeCA5hHOkeh4_2JwBa": { "base": {"clan": "Nosferatu", "faction": "Camarilla", "generation": 13, "blood_potency": 1 } },"-LWeC9aDbH63n7oD8e9z": { "base": {"clan": "Nosferatu", "faction": "Camarilla", "generation": 13, "blood_potency": 1 } },"-LWeRWzQ91Fp8DxQHuxU": { "base": {"clan": "Lasombra", "faction": "Sabbat", "generation": 10, "blood_potency": 4, "humanity": 5, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 3, "stamina": 2, "charisma": 2, "manipulation": 3, "composure": 1, "intelligence": 4, "wits": 3, "resolve": 2 }, "clandiscs": { "disc1": ["Dominate", 0], "disc2": ["Oblivion", 4], "disc3": ["Potence", 0] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "OBF", "1": "" } },"-LWeRVv36yuBjWcAJ8Mh": { "base": {"clan": "Nosferatu", "faction": "Sabbat", "generation": 10, "blood_potency": 4, "humanity": 3, "stains": 0 }, "attributes": { "strength": 3, "dexterity": 3, "stamina": 4, "charisma": 1, "manipulation": 2, "composure": 2, "intelligence": 2, "wits": 2, "resolve": 3 }, "clandiscs": { "disc1": ["Animalism", 0], "disc2": ["Obfuscate", 4], "disc3": ["Potence", 2] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LWeRLFK7B44jj-N079k": { "base": {"clan": "Banu Haqim", "faction": "Autarkis", "generation": 7, "blood_potency": 6, "humanity": 4, "stains": 0 }, "attributes": { "strength": 4, "dexterity": 6, "stamina": 5, "charisma": 2, "manipulation": 3, "composure": 3, "intelligence": 5, "wits": 3, "resolve": 3 }, "clandiscs": { "disc1": ["Celerity", 4], "disc2": ["Obfuscate", 5], "disc3": ["Blood Sorcery", 5] }, "otherdiscs": { "5": "", "4": "POT", "3": "FOR", "2": "AUS", "1": "PTN" } },"-LWeRKYQh6q3a09MGYug": { "base": {"clan": "Nosferatu", "faction": "Autarkis", "generation": 7, "blood_potency": 7, "humanity": 1, "stains": 0 }, "attributes": { "strength": 6, "dexterity": 5, "stamina": 5, "charisma": 3, "manipulation": 3, "composure": 3, "intelligence": 2, "wits": 3, "resolve": 4 }, "clandiscs": { "disc1": ["Animalism", 5], "disc2": ["Obfuscate", 5], "disc3": ["Potence", 5] }, "otherdiscs": { "5": "", "4": "PTN", "3": "FOR", "2": "CEL", "1": "" } },"-LW8juZsciktrgdbmAl1": { "base": {"clan": "Tremere", "faction": "Camarilla", "generation": 13, "blood_potency": 2, "humanity": 7, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 1, "stamina": 2, "charisma": 2, "manipulation": 3, "composure": 2, "intelligence": 4, "wits": 3, "resolve": 3 }, "skills": { "6": "", "5": "OCC", "4": "SUB", "3": "POL ETI", "2": "ATH INV PER", "1": "INS FIR STL" }, "clandiscs": { "disc1": ["Auspex", 2], "disc2": ["Dominate", 0], "disc3": ["Blood Sorcery", 4] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-Lc5WJzKsCsYxGqv4vvV": { "base": {"clan": "Tzimisce", "faction": "Sabbat", "generation": 6, "blood_potency": 8, "humanity": 3, "stains": 0 }, "attributes": { "strength": 4, "dexterity": 4, "stamina": 3, "charisma": 6, "manipulation": 5, "composure": 5, "intelligence": 5, "wits": 4, "resolve": 3 }, "skills": { "6": "MED ACA", "5": "MEL OCC POL AWA INT SUB", "4": "ETI INV", "3": "LED PER", "2": "STL ATH", "1": "ANI" }, "clandiscs": { "disc1": ["Animalism", 3], "disc2": ["Auspex", 5], "disc3": ["Vicissitude", 5] }, "otherdiscs": { "5": "DOM", "4": "PRE SOR", "3": "CEL", "2": "FOR", "1": "" } },"-Lbu3wurxt5lHXWMIC73": { "base": {"clan": "Lasombra", "faction": "Sabbat", "generation": 7, "blood_potency": 7, "humanity": 3, "stains": 0 }, "attributes": { "strength": 5, "dexterity": 4, "stamina": 5, "charisma": 4, "manipulation": 3, "composure": 4, "intelligence": 3, "wits": 5, "resolve": 4 }, "skills": { "6": "BRA STL", "5": "SUB OCC MEL LED POL ETI", "4": "ATH PER", "3": "SEC ACA", "2": "DRV LAR", "1": "INV" }, "clandiscs": { "disc1": ["Dominate", 5], "disc2": ["Oblivion", 5], "disc3": ["Potence", 5] }, "otherdiscs": { "5": "", "4": "FOR", "3": "CEL", "2": "PTN", "1": "" } }}',
		/* eslint-disable-next-line quotes */
        NPCDEFAULTS = '{"tab_core": 1, "tab_type": 1, "bonus_health": 0, "bonus_willpower": 0, "bonus_bp": 0, "marquee_title": "", "marquee_lines_toggle": 0, "marquee": "", "marquee_tracker": "", "character_name": "", "char_dobdoe": "", "bane_title": "", "bane_text": "", "clan": 0, "faction": 0, "generation": 0, "predator": 0, "hunger": 1, "resonance": 0, "res_discs": " ", "rollflagdisplay": "", "rollparams": "", "rollpooldisplay": "", "rollmod": 0, "rolldiff": 0, "applydisc": 0, "applybloodsurge": 0, "applyspecialty": 0, "applyresonance": 0, "incap": "", "rollarray": "", "dyscrasias_toggle": 0, "dyscrasias": "", "compulsion_toggle": 0, "compulsion": "", "groupdetails": "", "health": 0, "health_max": 10, "health_sdmg": 0, "health_admg": 0, "health_impair_toggle": 0, "health_1": 0, "health_2": 0, "health_3": 0, "health_4": 0, "health_5": 0, "health_6": 0, "health_7": 0, "health_8": 0, "health_9": 0, "health_10": 0, "health_11": 0, "health_12": 0, "health_13": 0, "health_14": 0, "health_15": 0, "willpower": 0, "willpower_max": 10, "willpower_sdmg": 0, "willpower_admg": 0, "willpower_impair_toggle": 0, "willpower_1": 0, "willpower_2": 0, "willpower_3": 0, "willpower_4": 0, "willpower_5": 0, "willpower_6": 0, "willpower_7": 0, "willpower_8": 0, "willpower_9": 0, "willpower_10": 0, "bp_surgetext": "", "bp_mendtext": "", "bp_discbonustext": "", "bp_baneseverity": 0, "bp_slaketext": "", "bp_mend": "", "bp_discbonus": 0, "bp_rousereroll": "", "bp_slakeanimal": "", "bp_slakebag": "", "bp_slakehuman": "", "bp_slakekill": "", "blood_potency": 1, "blood_potency_max": 1, "stains": 0, "humanity": 7, "humanity_max": 10, "humanity_impair_toggle": 0, "humanity_1": 2, "humanity_2": 2, "humanity_3": 2, "humanity_4": 2, "humanity_5": 2, "humanity_6": 2, "humanity_7": 2, "humanity_8": 1, "humanity_9": 1, "humanity_10": 1, "strength_flag": 0, "strength": 1, "dexterity_flag": 0, "dexterity": 1, "stamina_flag": 0, "stamina": 1, "charisma_flag": 0, "charisma": 1, "manipulation_flag": 0, "manipulation": 1, "composure_flag": 0, "composure": 1, "intelligence_flag": 0, "intelligence": 1, "wits_flag": 0, "wits": 1, "resolve_flag": 0, "resolve": 1, "athletics_flag": 0, "athletics_spec": "", "athletics": 0, "brawl_flag": 0, "brawl_spec": "", "brawl": 0, "craft_flag": 0, "craft_spec": "", "craft": 0, "drive_flag": 0, "drive_spec": "", "drive": 0, "firearms_flag": 0, "firearms_spec": "", "firearms": 0, "melee_flag": 0, "melee_spec": "", "melee": 0, "larceny_flag": 0, "larceny_spec": "", "larceny": 0, "stealth_flag": 0, "stealth_spec": "", "stealth": 0, "survival_flag": 0, "survival_spec": "", "survival": 0, "animal_ken_flag": 0, "animal_ken_spec": "", "animal_ken": 0, "etiquette_flag": 0, "etiquette_spec": "", "etiquette": 0, "insight_flag": 0, "insight_spec": "", "insight": 0, "intimidation_flag": 0, "intimidation_spec": "", "intimidation": 0, "leadership_flag": 0, "leadership_spec": "", "leadership": 0, "performance_flag": 0, "performance_spec": "", "performance": 0, "persuasion_flag": 0, "persuasion_spec": "", "persuasion": 0, "streetwise_flag": 0, "streetwise_spec": "", "streetwise": 0, "subterfuge_flag": 0, "subterfuge_spec": "", "subterfuge": 0, "academics_flag": 0, "academics_spec": "", "academics": 0, "awareness_flag": 0, "awareness_spec": "", "awareness": 0, "finance_flag": 0, "finance_spec": "", "finance": 0, "investigation_flag": 0, "investigation_spec": "", "investigation": 0, "medicine_flag": 0, "medicine_spec": "", "medicine": 0, "occult_flag": 0, "occult_spec": "", "occult": 0, "politics_flag": 0, "politics_spec": "", "politics": 0, "science_flag": 0, "science_spec": "", "science": 0, "technology_flag": 0, "technology_spec": "", "technology": 0, "disc1_toggle": 0, "disc1_flag": 0, "disc1_name": "", "disc1": 0, "disc1power_toggle": 0, "disc1_1": "", "disc1_2": "", "disc1_3": "", "disc1_4": "", "disc1_5": "", "repstats": "", "disc2_toggle": 0, "disc2_flag": 0, "disc2_name": "", "disc2": 0, "disc2power_toggle": 0, "disc2_1": "", "disc2_2": "", "disc2_3": "", "disc2_4": "", "disc2_5": "", "disc3_toggle": 0, "disc3_flag": 0, "disc3_name": "", "disc3": 0, "disc3power_toggle": 0, "disc3_1": "", "disc3_2": "", "disc3_3": "", "disc3_4": "", "disc3_5": "", "rituals_toggle": 0, "formulae_toggle": 0, "distillation": 0, "domain_personal": "", "domain_haven": "", "domain_coterie": "", "domain_hunt": "", "assets_carried": "", "assets_stashed": "", "assets_vehicles": "", "assets_other": "", "mask_name": "", "mask": "", "char_dob": "", "char_doe": "", "mortal_ambition": "", "mortal_history": "", "date_today": 0, "repeatingprojectslist": "", "ambition": "", "xp_summary": "", "xp_earnedtotal": 0}',

		// #endregion
		// #region Register Characters & Token Image Alternates,
        registerChar = (msg, num) => {
            if (D.GetSelected(msg).length > 1) {
                D.ThrowError("Please select only one token.", "CHARS:RegisterChar")
            } else {
                const char = D.GetChar(msg),
                    token = D.GetSelected(msg)[0],
                    charNum = num ? num : _.keys(REGISTRY).length + 1,
                    charID = char.id,
                    charName = D.GetName(char),
                    playerID = D.GetPlayerID(char),
                    playerName = D.GetName(playerID)

                if (!char) {
                    D.ThrowError("No character found!", "CHARS:RegisterChar")
                } else if (!token) {
                    D.ThrowError("Please select a character token.", "CHARS:RegisterChar")
                } else {
                    REGISTRY[charNum] = {
                        id: charID,
                        name: charName,
                        playerID: playerID,
                        playerName: playerName,
                        tokenName: charName.replace(/["'\s]*/gu, "") + "Token"
                    }
                    D.Alert(`Character #${D.JSL(charNum)} Registered:<br><br>${D.JS(REGISTRY[charNum])}`, "CHARS:RegisterChar")
                }
            }
        },
        registerToken = (msg, hostName, srcName) => {
            if (!Media.GetKey(hostName)) 
                D.ThrowError(`No image registered under ${hostName}`, "CHARS:RegisterToken")
            else
                Media.AddSrc(msg, hostName, srcName)
        },
	
		// #endregion
	
		// #region Awarding XP,
        awardXP = (charRef, award, reason) => {
            DB(`Award XP Parameters:<br><br>charRef: ${D.JS(charRef)}<br>award: ${D.JS(award)}<br>reason: ${D.JS(reason)}`, "awardXP")
            if (!D.GetChar(charRef))
                return D.ThrowError(`No character found given reference ${D.JS(charRef)}`, "CHARS:AwardXP")
            const char = D.GetChar(charRef)
            DB(`Award XP Variable Declations:<br><br>char: ${D.JS(char && char.get && char.get("name"))}<br>SessionNum: ${D.JS(STATEREF.SessionNum)}`, "awardXP")
            DB(`Making Row with Parameters:<br><br>${D.JS(char.id)}<br><br>Award: ${D.JS(award)}<br>Session: ${D.NumToText(STATEREF.SessionNum)}<br>Reason: ${D.JS(reason)}`, "awardXP")
            const rowID = D.MakeRow(char.id, "earnedxpright", {
                xp_award: award,
                xp_session: D.NumToText(STATEREF.SessionNum, true),
                xp_reason: reason
            })
            DB(`Award XP Variable Declations:<br><br>char: ${D.JS(char && char.get && char.get("name"))}<br><br>rowID: ${D.JS(rowID)}`, "awardXP")
            if (rowID) {
                let xpOrder = {
                    left: D.GetStatVal(char.id, "_reporder_repeating_earnedxp") ? D.GetStatVal(char.id, "_reporder_repeating_earnedxp").split(",") : [],
                    right: D.GetStatVal(char.id, "_reporder_repeating_earnedxpright") ? D.GetStatVal(char.id, "_reporder_repeating_earnedxpright").split(",") : []
                }
                DB(`Original xpOrder:<br><br>${D.JS(xpOrder)}`, "awardXP")
                if (xpOrder.left.length > D.GetRepIDs(char.id, "earnedxp").length) 
                    xpOrder.left = xpOrder.left.slice(0,D.GetRepIDs(char.id, "earnedxp").length)
                else if (xpOrder.left.length === 0) 
                    xpOrder.left = D.GetRepIDs(char.id, "earnedxp")
								
                if (xpOrder.right.length > D.GetRepIDs(char.id, "earnedxpright").length) 
                    xpOrder.right = xpOrder.right.slice(0,D.GetRepIDs(char.id, "earnedxpright").length)
                else if (xpOrder.right.length === 0) 
                    xpOrder.right = D.GetRepIDs(char.id, "earnedxpright")					
                DB(`New xpOrder:<br><br>${D.JS(xpOrder)}`, "awardXP")
                while (D.GetRepIDs(char.id, "earnedxpright").length > D.GetRepIDs(char.id, "earnedxp").length) {
                    let repID = D.GetRepIDs(char.id, "earnedxpright")[0]
                    xpOrder.left.push(repID)
                    xpOrder.right = _.without(xpOrder.right, repID)
                    D.CopyToSec(char.id, "earnedxpright", repID, "earnedxp")
                }
                setAttrs(char.id, {
                    "_reporder_repeating_earnedxp": xpOrder.left.join(","),
                    "_reporder_repeating_earnedxpright": xpOrder.right.join(",")
                })
                return true
            }	
            return D.ThrowError(`Unable to make row for '${D.JSL(char)}'`, "AWARDXP")
        },
	
		// #endregion
	
		// #region Manipulating Stats on Sheet,
        adjustTrait = (charRef, trait, amount, min, max, defaultTraitVal) => {
            if (VAL({number: defaultTraitVal})) {
                if (!VAL({char: [charRef], number: amount}, "AdjustTrait"))
                    return false
            } else {
                if (!VAL({char: [charRef], trait: [trait], number: amount}, "AdjustTrait"))
                    return false
            }
			
            D.Log(D.JS(Math.min(max || Infinity, Math.max(min || -Infinity, parseInt(D.GetStatVal(charRef, trait) || 0) + parseInt(amount)))))
            D.Log("STATVAL:" + D.GetStatVal(charRef, trait) + ", AMOUNT: " + amount)			
            D.Log("COMBINED:" + (parseInt(D.GetStatVal(charRef, trait) || 0) + parseInt(amount)))
            D.Log("ACTUAL: " + Math.min(max || Infinity, Math.max(min || -Infinity, parseInt(D.GetStatVal(charRef, trait) || defaultTraitVal || 0) + parseInt(amount))))
            setAttrs(
                D.GetChar(charRef).id, 
                {
                    [trait.toLowerCase()]: Math.min(max || Infinity, Math.max(min || -Infinity, parseInt(D.GetStatVal(charRef, trait) || defaultTraitVal || 0) + parseInt(amount)))
                }
            )
            return true
        },
        adjustDamage = (charRef, trait, dtype, amount) => {
            let [minVal, maxVal, targetVal, defaultVal, traitName] = [0, 5, parseInt(amount), 0, ""]
            if (!VAL({char: [charRef], number: [amount]}, "AdjustDamage"))
                return false
            switch (trait.toLowerCase()) {
                case "hum": case "humanity":
                    [minVal, maxVal, targetVal, defaultVal, traitName] = [0, 10, parseInt(amount), 7, "humanity"]
                    break
                case "stain": case "stains":
                    [minVal, maxVal, targetVal, defaultVal, traitName] = [0, 10, parseInt(amount), 0, "stains"]
                    break
                case "health": case "willpower": case "wp":
                    [minVal, maxVal, targetVal, defaultVal, traitName] = [
                        -Infinity,
                        Infinity,
                        parseInt(amount) > 0 && dtype === "superficial" ? parseInt(Math.ceil(amount / 2)) : parseInt(amount),
                        0, 
                        trait.toLowerCase() + (["superficial", "superficial+", "spent"].includes(dtype) ? "_sdmg" : "_admg")
                    ]
                    break
                // no default
            }
            if (adjustTrait(charRef, traitName, targetVal, minVal, maxVal, defaultVal))
                return true
            return false
        },
        adjustHunger = (charRef, amount, isKilling = false) => {
            if (!VAL({char: [charRef], number: [amount], trait: ["bp_slakekill"]}, "AdjustHunger"))
                return false
            if (adjustTrait(charRef,
                            "hunger",
                            parseInt(amount),
                            isKilling ? 0 : parseInt(D.GetStatVal(charRef, "bp_slakekill") || 1),
                            5,
                            1
            ))
                return true
            return false
        },
	
		// #endregion
	
		// #region Starting/Ending Sessions & Waking Up,
        startSession = () => {
            STATEREF.SessionNum++
            D.Alert(`Beginning Session ${D.NumToText(STATEREF.SessionNum)}`)
            TimeTracker.StartClock()
            TimeTracker.StartLights()

        },
        setSessionNum = sNum => {
            STATEREF.SessionNum = sNum
            D.Alert(`Session Number <b>${D.NumToText(STATEREF.SessionNum)}</b> SET.`)
        },
        endSession = () => {
            D.Alert(`Concluding Session ${D.NumToText(STATEREF.SessionNum)}`)
            for (const char of D.GetChars("registered")) 
                awardXP(char, 2, "Session XP award.")
			
            TimeTracker.StopClock()
            TimeTracker.StopLights()
        },
        daysleep = () => {			
            for (const char of D.GetChars("registered")) {
                const healWP = Math.max(parseInt(getAttrByName(char.id, "composure")), parseInt(getAttrByName(char.id, "resolve")))
                adjustDamage(char, "willpower", "superficial+", -1 * healWP)
            }

        },
	
		// #endregion
	
		// #region Populating Character Attributes
		/* ATTRIBUTES = {
			physical: ["Strength", "Dexterity", "Stamina"],
			social: ["Charisma", "Manipulation", "Composure"],
			mental: ["Intelligence", "Wits", "Resolve"]
		},
		SKILLS = {
			physical: ["Athletics", "Brawl", "Craft", "Drive", "Firearms", "Melee", "Larceny", "Stealth", "Survival"],
			social: ["Animal Ken", "Etiquette", "Insight", "Intimidation", "Leadership", "Performance", "Persuasion", "Streetwise", "Subterfuge"],
			mental: ["Academics", "Awareness", "Finance", "Investigation", "Medicine", "Occult", "Politics", "Science", "Technology"]
		},
		DISCIPLINES = ["Animalism", "Auspex", "Celerity", "Chimerstry", "Dominate", "Fortitude", "Obfuscate", "Oblivion", "Potence", "Presence", "Protean", "Blood Sorcery", "Alchemy"],
		TRACKERS = ["Willpower", "Health", "Humanity", "Blood Potency"], */
        populateDefaults = (charRef) => {
            const attrList = {},
                charIDs = [],
                npcStats = JSON.parse(NPCSTATS),
                npcDefaults = JSON.parse(NPCDEFAULTS)
            _.each(npcDefaults, (v, k) => {	attrList[k] = v	})
            if (_.isNaN(parseInt(charRef))) {
                charIDs.push(D.GetChar(charRef).id)
            } else {
                charIDs.push(..._.keys(npcStats).slice(parseInt(charRef), parseInt(charRef)+10))
                D.Alert(`Setting Defaults on characters ${parseInt(charRef)} - ${parseInt(charRef)+10} of ${_.keys(npcStats).length} ...`)
            }
            const reportLine = []
            for (const charID of charIDs) {
                setAttrs(charID, attrList)
                reportLine.push(`Set Defaults on ${D.GetName(charID)}`)	
                _.each(["discleft", "discmid", "discright"], v => {
                    _.each(D.GetRepIDs(charID, v), vv => {
                        D.DeleteRow(charID, v, vv)
                    })
                })
            }
            D.Alert(reportLine.join("<br>"), "CHARS: populateDefaults()")
        },
        changeAttrName = (oldName, newName) => {
            const allChars = findObjs( {
                    _type: "character"
                } ),
				  attrList = {}
            for (const char of allChars) {
                attrList[char.get("name")] = []
                const attr = findObjs( {
                    _type: "attribute",
                    _characterid: char.id,
                    name: oldName
                })[0]
                if (attr) {
                    attrList[char.get("name")].push({
                        [newName]: attr.get("current"),
                        [`${newName}_max`]: attr.get("max")
                    })
                    setAttrs(char.id, {
                        [newName]: attr.get("current"),
                        [`${newName}_max`]: attr.get("max")
                    })
                    attr.remove()
                }				
            }

            D.Alert(D.JS(attrList))
        },
        setNPCStats = (charRef) => {
            const charIDs = [],
                npcStats = JSON.parse(NPCSTATS)
            let errorLog = ""
            if (charRef) 
                charIDs.push(D.GetChar(charRef).id)
			 else 
                charIDs.push(..._.keys(npcStats))
			
            for (const charID of charIDs) {
                const attrList = {}, 
					  charData = npcStats[charID]
                if (charData.base) 
                    for (const attr of _.keys(charData.base)) {
                        if (attr === "blood_potency") 
                            attrList.hunger = BPMINHUNGER[charData.base[attr]]
						
                        attrList[attr] = charData.base[attr]
                    }
				
                if (charData.attributes) {
                    for (const attribute of _.flatten(_.values(C.ATTRIBUTES))) 
                        attrList[attribute.toLowerCase()] = 1
					
                    for (const attribute of _.keys(charData.attributes)) 
                        attrList[attribute] = charData.attributes[attribute]
					
                }
                if (charData.skills) {
                    let skillDupeCheck = _.compact(_.flatten(_.map(_.values(charData.skills), v => v.split(/\s+/gu))))
                    if (_.uniq(skillDupeCheck).length !== skillDupeCheck.length) 
                        errorLog += `<br>Duplicate Skill(s) on ${D.GetName(charID)}: ${_.sortBy(skillDupeCheck, v => v).join(" ")}`
					 else 
                        for (const skillAbv of _.keys(SKILLABBVS)) 
                            attrList[SKILLABBVS[skillAbv]] = parseInt(_.findKey(charData.skills, v => v.includes(skillAbv)) || 0)
						
					
                }
                if (charData.clandiscs) 
                    _.each(["disc1", "disc2", "disc3"], discnum => {
                        if (charData.clandiscs[discnum].length) {
                            attrList[`${discnum}_name`] = charData.clandiscs[discnum][0]
                            attrList[discnum] = charData.clandiscs[discnum][1]
                        } else {
                            attrList[`${discnum}_name`] = ""
                            attrList[discnum] = 0
                        }						
                    })					
				
                const [repDiscs, rowCount] = [{}, {}]
                _.each(["discleft", "discmid", "discright"], section => {
                    const sectionData = D.GetRepStats(charID, section, null, null, "rowID")
                    rowCount[section] = _.keys(sectionData).length
                    _.each(sectionData, (rowData, rowID) => {
                        const discData = _.find(rowData, stat => C.DISCIPLINES.includes(stat.name))
                        if (discData)
                            repDiscs[discData.name] = {							
                                sec: section,
                                rowID: rowID,
                                val: parseInt(discData.val) || 0
                            }
                        else
                            D.DeleteRow(charID, section, rowID)
                    })
                })
                if (charData.otherdiscs) {
                    const otherDiscs = [],
                        discDupeCheck = _.compact([
                            ..._.map(_.compact(_.values(charData.clandiscs)), v => v[0]),
                            ..._.flatten(_.map(_.compact(_.values(charData.otherdiscs)), v => _.map(v.split(/\s+/gu), vv => DISCABBVS[vv])))
                        ])
                    if (_.uniq(discDupeCheck).length !== discDupeCheck.length) {
                        errorLog += `<br>Duplicate Discipline(s) on ${D.GetName(charID)}: ${_.sortBy(discDupeCheck, v => v).join(" ")}`
                    } else {
                        for (const discAbv of _.keys(DISCABBVS)) {
                            const discName = DISCABBVS[discAbv]
                            if (_.keys(repDiscs).includes(discName)) 
                                if (_.findKey(charData.otherdiscs, v => v.includes(discAbv)))
                                    attrList[`repeating_${repDiscs[discName].sec}_${repDiscs[discName].rowID}_disc`] = parseInt(_.findKey(charData.otherdiscs, v => v.includes(discAbv)))
                                else {
                                    D.DeleteRow(charID, repDiscs[discName].sec, repDiscs[discName].rowID)
                                    rowCount[repDiscs[discName].sec]--
                                }
							 else if (_.findKey(charData.otherdiscs, v => v.includes(discAbv))) 
                                otherDiscs.push([discName, parseInt(_.findKey(charData.otherdiscs, v => v.includes(discAbv)))])
							
                        }
                        while (otherDiscs.length) {
                            const thisDisc = otherDiscs.pop(),
                                targetSec = _.min([{sec: "discleft", num: rowCount.discleft}, {sec: "discmid", num:rowCount.discmid}, {sec: "discright", num:rowCount.discright}], v => v.num).sec
							//D.Alert(`D.MakeRow(ID, ${targetSec}, {disc_name: ${thisDisc[0]}, disc: ${thisDisc[1]} })`)
                            rowCount[targetSec]++
                            D.MakeRow(charID, targetSec, {disc_name: thisDisc[0], disc: thisDisc[1] })
                        }
                    }
                }
                attrList.roll_array = ""
                attrList.rollpooldisplay = ""
                setAttrs(charID, attrList, {}, () => {
					//D.Alert("Callback Function Passed!")
                    setAttrs(charID, {hunger: Math.max(1, parseInt(getAttrByName("bp_slakekill")))})
                })
                D.Alert(`ATTRLIST FOR ${D.GetName(charID)}:<br><br>${D.JS(attrList)}`)
            }
            D.Alert(`Error Log:<br>${D.JS(errorLog)}`, "CHARS: setNPCStats()")
        },
		// #endregion

		// #region Generating MVCs,
        MVC = (params) => {
            const results = []
            for (const mvc of MVCVALS) {
                results.push(bHTML.div.title.start + mvc[0] + bHTML.div.title.stop)
                for (const [fType, ...mvcItems] of mvc.slice(1)) 
                    try {
                        results.push(bHTML.div[fType].start + _.shuffle(mvcItems)[0] + bHTML.div[fType].stop)
                    } catch (errObj) {
                        return D.ThrowError(`ERRORED returning '${D.JSL(fType)}' for '${D.JSL(mvcItems)}' of '${D.JSL(mvc)}'`, "CHARS.MVC", errObj)
                    }
				
            }
            D.SendToPlayer(params.name, HTML.start + results.join("") + HTML.stop, " ")
	
            return true
        },
	
		// #endregion
	
		// #region Event Handlers (handleInput, handleAttribute),
        handleChangeAttr = (obj, prev) => {
            if (obj.get("name").toLowerCase() === "hunger" && obj.get("current") !== prev.current)
                Media.Toggle(`Hunger${getAttrByName(obj.get("_characterid"), "sandboxquadrant")}_1`, true, obj.get("current"))
        },
        handleAddAttr = obj => {
            if (obj.get("name").toLowerCase().match(/repeating_timeline_.*?_tlenddate/gu))
                //D.SortRepSec(obj.get("_characterid"), "timeline", (charRef, secName, rowID1, rowID2) => TimeTracker.ParseDate(D.GetRepStat(charRef, secName, rowID1, "tlenddate").val).getTime() - TimeTracker.ParseDate(D.GetRepStat(charRef, secName, rowID2, "tlenddate").val).getTime())             
                D.Alert("Add Timeline Row TRIGGERED.")
        },
        handleInput = (msg) => {
			//D.Alert(`MSG RECEIVED: ${D.JS(msg)}`)
            if (msg.type !== "api") return
            const who = (getObj("player", msg.playerid) || {get: () => "API",}).get("displayname"),
				 args = msg.content.split(/\s+/u)
			//D.Alert(`WHO: ${D.JS(who)}`)
            let [chars, params, attrList] = [[], [], []],
                [token, famToken, charData, imgData] = [{}, {}, {}, {}],
                [amount, dmg] = [0, 0],
                [trait, dtype, attrString, playerObj, charID, msgString] = new Array(6).fill(""),
                char = null,
                isHealing = false
            switch (args.shift().toLowerCase()) {
                case "!char":
                    if (!playerIsGM(msg.playerid))
                        return
                    switch (args.shift().toLowerCase()) {
                        case "reg":
                            if (args.shift() === "token") 
                                if (msg.selected && msg.selected.length === 1 && args.length === 2)
                                    registerToken(msg, args.shift(), "base")
                                else
                                    D.ThrowError("Select a graphic object. Syntax: !char reg token <hostName> <srcName>", "CHARS:!char reg token")
					 else 
                            if (msg.selected && msg.selected[0])
                                registerChar(msg)
                            else
                                D.ThrowError("Select character tokens first!", "CHARS:!char register")
					
                            break					
                        case "xp": // !char xp Cost Session Message, with some character tokens selected.
                            chars = _.compact(D.GetChars(msg) || D.GetChars("registered"))
                            DB(`!char xp COMMAND RECEIVED<br><br>Characters: ${D.JS(_.map(chars, v => v.get("name")))}`, "awardXP")
                            if (chars) {
                                amount = parseInt(args.shift()) || 0
                                _.each(chars, (char) => {
                                    if (awardXP(char, amount, args.join(" "))) {
                                        D.Alert(`${amount} XP awarded to ${D.GetName(char)}`, "CHARS:!char xp")
                                        D.SendToPlayer(D.GetPlayerID(char), `You have been awarded ${amount} XP for:<br><br>${D.JS(args.join(" "))}`)
                                    } else
                                    {D.ThrowError(`FAILED to award ${JSON.stringify(amount)} XP to ${JSON.stringify(D.GetName(char))}`, "CHARS:!char xp")}
                                })
                            } else {
                                D.ThrowError("Select character tokens or register characters first!", "CHARS:!char xp")
                            }
                            break
                        case "heal":
                            isHealing = true
                            // falls through
                        case "dmg": case "damage":
                        case "spend":
                            chars = D.GetChars(msg)
                            if (chars) {
                                trait = args.shift().toLowerCase();
                                [dtype, dmg] = [
                                    ["hum", "humanity", "stain", "stains"].includes(trait) ? null : args.shift(),
                                    (isHealing ? -1 : 1) * parseInt(args.shift()) || 0
                                ]
                                _.each(chars, (char) => {
                                    if (adjustDamage(char, trait, dtype, dmg))
                                        D.Alert(`Dealt ${D.JS(dmg)} ${D.JS(dtype)} ${D.JS(trait)} damage to ${D.GetName(char)}`, "CHARS:!char dmg")
                                    else
                                        D.ThrowError(`FAILED to damage ${D.GetName(char)}`, "CHARS!char dmg")
                                })
                            } else {
                                D.ThrowError("Select character tokens first!", "CHARS!char dmg")
                            }
                            break
                        case "get":
                            if (!playerIsGM(msg.playerid))
                                return
                            switch (args.shift().toLowerCase()) {
                                case "stat":
                                    trait = args.shift()
                                    for (const char of D.GetChars("registered"))
                                        params.push(`${char.get("name")}: ${D.GetStat(char, trait, true) ? D.GetStat(char, trait, true).get("current") : "-"}`)
                                    attrString = params.join("<br>")
                                    D.Alert(attrString, `${D.Capitalize(trait)}:`)
                                    break
                                case "charids":
                                    chars = findObjs( {
                                        _type: "character"
                                    } )
                                    msgString = ""
                                    for (const char of chars) 
                                        msgString += `${D.GetName(char)}<span style="color: red; font-weight:bold;">@T</span>${char.id}<br>`						
                                    D.Alert(D.JS(msgString))
                                    break
                                case "player":
                                    charData = REGISTRY[args[0]]
                                    playerObj = getObj("player", charData.playerID)
                                    D.Alert(`<b>NAME:</b> ${charData.playerName} (${charData.playerID})<br><b>PLAYS:</b> ${charData.name} (${charData.id})<br><br><b>DATA:</b><br><br>${D.JS(playerObj)}`, `PLAYER #${args[0]} DATA`)
                                    break
					            // no default
                            }
                            break
                        case "set":
                            if (!playerIsGM(msg.playerid))
                                return
                            switch (args.shift().toLowerCase()) {
                                case "attr":
                                case "attrs":
                                case "stat":
                                case "stats":
                                    if (args[0].includes(":") && msg.selected && msg.selected[0]) {
                                        char = D.GetChar(msg)
                                    } else if (!args[0].includes(":")) {
                                        char = D.GetChar(args.shift())
                                    } else {
                                        D.Alert("Select a character or provide a character reference first!", "CHARS:!set attr")
                                        return
                                    }
                                    if (char) {
                                        D.Alert(`Setting the following stats on ${char.get("name")}:<br><br>${D.JS(args.join(" ").replace(/[,|\s]\s*?/gu, "|").split("|"))}`)
                                        for (const statpair of args.join(" ").replace(/[,|\s]\s*?/gu, "|").split("|"))
                                            attrList[statpair.split(":")[0]] = parseInt(statpair.split(":")[1])||0
                                        setAttrs(char.id, attrList)
                                    } else {
                                        D.Alert("Unable to find character.", "CHARS:!set attr")
                                    }
                                    break
					// no default
                            }
                            break
                        case "rep":
                        case "repeating":
                        case "repeat":
                            if (!playerIsGM(msg.playerid))
                                return
                            switch (args.shift().toLowerCase()) {
                                case "copy":
                                case "copyrow":
                                    if (msg.selected && msg.selected[0] && args.length === 3)
                                        D.CopyToSec(msg, ...args)
                                    break
                                case "sort":
                                case "sortrow":
                                    if (msg.selected && msg.selected[0] && args.length === 2)
                                        D.SortRepSec(msg, args.shift(), SORTFUNCS[args.shift()])
                                    break
                                case "split":
                                case "splitsecs":
                                    if (msg.selected && msg.selected[0] && args.length >= 3)
                                        D.SplitRepSec(msg, args.shift(), args.shift(), SORTFUNCS[args.shift()], args[0] || null)
                                    break
					// no default
                            }
                            break
                        case "defaults":
                            if (!playerIsGM(msg.playerid))
                                return
                            populateDefaults(args.shift())
					
                            break
                        case "setnpcs":
                            if (!playerIsGM(msg.playerid))
                                return
                            setNPCStats(args.shift())
                            break
                        case "changeattr":
                            changeAttrName(args.shift(), args.shift())
                            break
				// no default
                    }
                    break					
                case "!mvc":
                    MVC({name: who})
                    break
                case "!daylighters":
                    if (!playerIsGM(msg.playerid))
                        return
                    C.ROOT.Char.isDaylighterSession = !C.ROOT.Char.isDaylighterSession
                    D.Alert(`Daylighter Session Set To: ${C.ROOT.Char.isDaylighterSession}`)
                    DragPads.Toggle("signalLight", !C.ROOT.Char.isDaylighterSession)
                    TimeTracker.Fix()
                    for (const charData of _.values(REGISTRY).slice(0,4)) {
                        [token] = findObjs( {
                            _pageid: D.PAGEID(),
                            _type: "graphic",
                            _subtype: "token",
                            represents: charData.id
                        })
                        imgData = Media.GetData(token)
					
                        if (C.ROOT.Char.isDaylighterSession) {											
                            Media.SetData(token, {isDaylighter: true, unObfSrc: "base"})
                            Media.ToggleToken(token, "baseDL")
                            if (charData.famulusTokenID) {
                                famToken = Media.GetObj(charData.famulusTokenID)
                                Media.Toggle(famToken, false)
                            }
                        } else {
                            Media.SetData(token, {isDaylighter: false, unObfSrc: "base"})
                            Media.ToggleToken(token, "base")
                        }
                    }
                    break
                case "!sense":
                    charID = REGISTRY[_.findKey(REGISTRY, v => v.playerID === msg.playerid)].id;
                    [token] = findObjs( {
                        _pageid: D.PAGEID(),
                        _type: "graphic",
                        _subtype: "token",
                        represents: charID
                    })
                    imgData = Media.GetData(token)								
				//D.Alert(`ImgData: ${D.JS(token)}`)
                    if (imgData.unObfSrc !== "sense") {
                        Media.SetData(token, {unObfSrc: "sense"})
                        if (imgData.isObf) 
                            Media.ToggleToken(token, `senseObf${imgData.isDaylighter ? "DL" : ""}`)
					 else 
                            Media.ToggleToken(token, `sense${imgData.isDaylighter ? "DL" : ""}`)
								
                    } else {
                        Media.SetData(token, {unObfSrc: "base"})
                        if (imgData.isObf) 
                            Media.ToggleToken(token, `obf${imgData.isDaylighter ? "DL" : ""}`)
					 else 
                            Media.ToggleToken(token, `base${imgData.isDaylighter ? "DL" : ""}`)
								
                    }
                    break
                case "!hide":	
                    charID = REGISTRY[_.findKey(REGISTRY, v => v.playerID === msg.playerid)].id;			
				//D.Alert(`Char ID[${D.JS(_.findKey(REGISTRY, v => v.playerID === msg.playerid))}] = ${D.JS(charID)}`);
                    [token] = findObjs( {
                        _pageid: D.PAGEID(),
                        _type: "graphic",
                        _subtype: "token",
                        represents: charID
                    })					
				//D.Alert(`Token: ${D.JS(token)}`)
                    imgData = Media.GetData(token)								
				//D.Alert(`ImgData: ${D.JS(token)}`)
                    if (imgData.isObf) {
                        Media.ToggleToken(token, `${imgData.unObfSrc || "base"}${imgData.isDaylighter ? "DL" : ""}`)
                        Media.SetData(token, {isObf: false})
                    } else {
                        if (imgData.unObfSrc === "sense") {
                            Media.ToggleToken(token, `senseObf${imgData.isDaylighter ? "DL" : ""}`)
                            Media.SetData(token, {isObf: true})
                        } else {
                            Media.ToggleToken(token, `obf${imgData.isDaylighter ? "DL" : ""}`)
                            Media.SetData(token, {isObf: true})
                        }
                    }
                    break
                case "!mask":
                    charID = REGISTRY[_.findKey(REGISTRY, v => v.playerID === msg.playerid)].id;	
                    [token] = findObjs( {
                        _pageid: D.PAGEID(),
                        _type: "graphic",
                        _subtype: "token",
                        represents: charID
                    })
                    imgData = Media.GetData(token)
                    if (imgData.isDaylighter)
                        break							
				//D.Alert(`ImgData: ${D.JS(token)}`)
                    if (imgData.unObfSrc === "mask") {
                        Media.SetData(token, {unObfSrc: "base"})
                        if (!imgData.isObf)
                            Media.ToggleToken(token, "base")
                    } else {
                        Media.SetData(token, {unObfSrc: "mask"})
                        if (!imgData.isObf)
                            Media.ToggleToken(token, "mask")
                    }				
                    break	
                case "!famulus":
                    if (C.ROOT.Char.isDaylighterSession)
                        break
                    charData = REGISTRY[_.findKey(REGISTRY, v => v.playerID === msg.playerid)]
                    charID = charData.id;
                    [token] = findObjs( {
                        _pageid: D.PAGEID(),
                        _type: "graphic",
                        _subtype: "token",
                        represents: charID
                    })
                    if (!charData.famulusTokenID)
                        break
                    famToken = Media.GetObj(charData.famulusTokenID)
                    if (famToken.get("layer") !== "objects")
                        Media.SetParams(famToken, {
                            top: token.get("top") - 100,
                            left: token.get("left") + 100
                        })
                    toFront(famToken)
                    Media.Toggle(famToken, famToken.get("layer") !== "objects", "base")
                    break
                case "!settoken":
                    Media.ToggleToken(D.GetSelected(msg)[0] || args.shift(), args.shift())
                    break
                case "!startsession":
                    if (playerIsGM(msg.playerid)) startSession()
                    break
                case "!setsessionnum":
                    if (playerIsGM(msg.playerid)) setSessionNum(args.shift())
                    break
                case "!endsession":
                    if (playerIsGM(msg.playerid)) endSession() 
                    break
                case "!testxp":
                    charID = REGISTRY[args.shift()].id
                    switch(args.shift()) {
                        case "left":
                            D.Alert(`${D.JS(D.GetRepStats(charID, "earnedxp"))}<br><br>ORDER:<br>${D.GetStatVal(charID, "_reporder_repeating_earnedxp")}`)
                            break
                        case "right":
                            D.Alert(`${D.JS(D.GetRepStats(charID, "earnedxpright"))}<br><br>ORDER:<br>${D.GetStatVal(charID, "_reporder_repeating_earnedxpright")}`)
                            break
                        // no default
                    }
			// no default
            }
        },
	
		// #endregion
	
		// #region Public Functions: regHandlers,
        regHandlers = () => {
            on("chat:message", handleInput)
            on("change:attribute:current", handleChangeAttr)
            on("add:attribute", handleAddAttr)
        },
        checkInstall = () => {
            C.ROOT = C.ROOT || {}
            C.ROOT.Char = C.ROOT.Char || {}
            C.ROOT.Char.registry = C.ROOT.Char.registry || {}

			// Storyteller Override:
			//C.ROOT.Char.registry["1"].playerID = "-LLIBpH_GL5I-9lAOiw9"
			
			// Return Player Control:
            //C.ROOT.Char.registry["4"].playerID = "-LMGDbZCKw4bZk8ztfNf"
            //C.ROOT.Char.registry["3"].playerID = "-LN7lNnjuWmFuvVPW76H"
            //C.ROOT.Char.registry["2"].playerID = "-LN6n-fR8cSNR2E_N_3q"
            //C.ROOT.Char.registry["1"].playerID = "-LMGDQqIvyL87oIfrVDX"
	        //C.ROOT.Char.registry["1"].famulusTokenID = "-Li_TTDHnKYob56yfijy"
        }



		
	// #endregion
	
    return {
        RegisterEventHandlers: regHandlers,
        CheckInstall: checkInstall,
        REGISTRY: REGISTRY,
        Damage: adjustDamage,
        AdjustTrait: adjustTrait,
        AdjustHunger: adjustHunger,
        DaySleep: daysleep,
        IsDaylighterSession: () => C.ROOT.Char.isDaylighterSession
    }
})()
	
on("ready", () => {
    Char.RegisterEventHandlers()
    Char.CheckInstall()
    D.Log("Char Ready!")
})
void MarkStop("Char")