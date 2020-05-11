(() => {
    // #region Variable Declarations
    let APIROWID = null,
        ISOFFLINE = false;
    const isDebug = true;
    const LOGOPTIONS = {
        isMuted: true
    };
    const ATTRIBUTES = {
        physical: ["Strength", "Dexterity", "Stamina"],
        social: ["Charisma", "Manipulation", "Composure"],
        mental: ["Intelligence", "Wits", "Resolve"]
    };
    const SKILLS = {
        physical: ["Athletics", "Brawl", "Craft", "Drive", "Firearms", "Melee", "Larceny", "Stealth", "Survival"],
        social: ["Animal Ken", "Etiquette", "Insight", "Intimidation", "Leadership", "Performance", "Persuasion", "Streetwise", "Subterfuge"],
        mental: ["Academics", "Awareness", "Finance", "Investigation", "Medicine", "Occult", "Politics", "Science", "Technology"]
    };
    const DISCIPLINES = ["Animalism", "Auspex", "Celerity", "Chimerstry", "Dominate", "Fortitude", "Obfuscate", "Oblivion", "Potence", "Presence", "Protean", "Blood Sorcery", "Alchemy", "True Faith"];
    const TRACKERS = ["Health", "Willpower", "Blood Potency", "Humanity"];
    // HUMSEQUENCES = ["BSH", "HBHXS", "SBS", "XHB"],
    const ATTRBLACKLIST = ["toggle", "inccounter"];
    const ROLLFLAGS = {
        all: ["rolldiff", "rollmod", "hunger", "applybloodsurge", "applyspecialty", "applyresonance", "incap", "Stains", "resonance", "rollarray", "topdisplay", "bottomdisplay", "effectchecks"],
        num: ["rolldiff", "rollmod", "applybloodsurge", "applyspecialty", "applyresonance"],
        str: ["rollarray", "rollflagdisplay", "rollparams", "topdisplay", "bottomdisplay", "effectchecks"]
    };
    const THREEROLLTRAITS = ["Auspex", "Fortitude", "Celerity", "Potence", "Presence"];
    const FLAGACTIONS = {
        /* If key is flagged, action to take depending on type of stat it would be paired with.
				"append": Add the stat to the end of the list, bumping the oldest stat if necessary.
				"replace": Replace the would-be pair with this stat, keeping the older stat.
				"pass": Delete the stat and repeat comparison with the next-newest. */
        attribute: {attribute: "append", skill: "append", discipline: "append", advantage: "append", tracker: "append"},
        skill: {attribute: "append", skill: "replace", discipline: "append", advantage: "append", tracker: "pass"},
        discipline: {attribute: "append", skill: "pass", discipline: "replace", advantage: "pass", tracker: "pass"},
        advantage: {attribute: "append", skill: "append", discipline: "pass", advantage: "replace", tracker: "pass"},
        tracker: {attribute: "append", skill: "pass", discipline: "pass", advantage: "pass", tracker: "replace"}
    };
    const RESDISCS = {
        None: [" "],
        Choleric: ["Celerity", "Potence"],
        Melancholic: ["Fortitude", "Obfuscate"],
        Ischemic: ["Oblivion", ""],
        Phlegmatic: ["Auspex", "Dominate"],
        Sanguine: ["Blood Sorcery", "Presence"],
        Primal: ["Animalism", "Protean"],
        Mercurial: ["Alchemy", "Protean"]
    };
    const baneText = {
        "0": null,
        "Ghoul": "While your master's Blood courses through your veins, you do not age, and you heal wounds twice as quickly as mortals (unless caused by fire).  You do not have a Beast and do not suffer Hunger: when required to make a Rouse Check, you instead suffer one point of Aggravated Health damage.",
        "Brujah": "Your Brujah Blood simmers with barely contained rage, exploding at the slightest provocation. Subtract dice equal to your Bane Severity from any roll to resist fury frenzy. This cannot take the pool below one die.",
        "Gangrel": "Your Gangrel Blood is closely tied to your Beast.  In frenzy, you gain a number of animal features equal to your Bane Severity: a physical trait, a smell, or a behavioural tic.  Each feature reduces one Attribute by 1 point, and lasts for one more night afterwards.  If your character Rides the Wave of their frenzy, you can choose only one feature to manifest, thus penalizing only one Attribute.",
        "Malkavian": "Your afflicted Malkavian lineage is cursed with one or more mental derangements:  You may experience delusions, visions of terrible clarity, or something entirely different. When you suffer a Bestial Failure or a Compulsion, your deranged nature manifests and you suffer a penalty equal to your Bane Severity to one category of dice pools (Physical, Social, or Mental) for the entire scene.",
        "Nosferatu": "Your cursed Nosferatu Blood afflicts you with physical ugliness:  You have the Repulsive (••) Flaw at all times, and can never purchase dots in the Looks Merit.  In addition, any attempt to disguise yourself as human suffers a dice pool penalty equal to your Bane Severity (this includes applicable uses of Obfuscate).",
        "Toreador": "Your Toreador Blood desires beauty so intensely that you suffer in its absence.  While you find yourself in less than beautiful surroundings, lose the equivalent of your Bane Severity in dice from dice pools to use Disciplines. The Storyteller decides specifically how the beauty or ugliness of your environment (including clothing, blood dolls, etc.) penalizes you, based on your aesthetics.",
        "Tremere": "Your Tremere Blood lacks the power to Blood Bond other Kindred (though you can still be Bound by Kindred from other clans).  You can still bind mortals and ghouls, though the corrupted vitae must be drunk an additional number of times equal to your Bane Severity for the bond to form.",
        "Ventrue": "Your dignified Ventrue Blood possesses you with a specific preference for whom you will feed from: genuine brunettes, students, sufferers of PTSD, methamphetamine users, etc.  You must spend Willpower equal to your Bane Severity to drink blood from anyone other than your preference, or the blood taken surges back up as scarlet vomit.  With a Resolve + Awareness test (Difficulty 4 or more), you can sense if a mortal possesses the blood you require.",
        "Caitiff": "Your Caitiff Blood is too dilute to carry the legacy of an Antediluvian in the form of a Clan Bane. Nevertheless, your clanless nature ensures other Kindred view you as an outsider:  You begin with the Suspect (•) Flaw, and cannot purchase positive Status during character creation.  Moreover, you suffer a dice penalty on Social tests against fellow Kindred who know you are Caitiff equal to one-half your Bane Severity, rounded down to a minimum of one.",
        "Thin-Blooded": "Your thin blood is weaker than that of other Kindred, but the ways in which that weakness manifests differs from one duskborn to another.  Refer to your Thin-Blood Merits & Flaws determine how you differ from the standard Thin-Blooded weaknesses described in VAMPIRE Core, pp. 111 - 113.",
        "Lasombra": "Your Lasombra Blood is tainted by the same Abyss that gives you power over darkness.  Your reflection, recorded image and recorded voice are distorted, but not enough to hide your identity: avoiding vampire detection systems suffers a penalty equal to your Bane Severity.  Moreover, you must succeed on a Technology roll against a Difficulty of 2 plus your Bane Severity to use modern communications devices.",
        "Tzimisce": "Your storied Tzimisce Blood is inexhorably tied to the Old World.  You must sleep each day submerged in soil taken from Eastern Europe, or you suffer a penalty equal to your Bane Severity to all dice pools the following night.",
        "Banu Haqim": "Your Assamite Blood drives you to feed from those deserving of punishment: especially the Kindred.  Upon slaking Hunger with Cainite Blood, you must roll to resist Hunger Frenzy against a Difficulty of 2 plus your Bane Severity.",
        "Hecata": {
            Giovanni: "Steeped in death, the fangs of the Giovanni bring not bliss, but agony. You cause additional Superficial Health damage equal to your Bane Severity for each level of Hunger slaked. Unwilling mortals not restrained will try to escape, and even the willing or coerced must succeed at a test of Stamina + Resolve vs. 3 to submit voluntarily. Vampires bitten by Giovanni fangs face a Frenzy test vs. 3 to avoid a terror frenzy.",
            Samedi: "Your return to unlife came with little regard for preserving your body against the ravages of the grave. Your skin has a ghastly pallor, and your flesh continues to rot, if slowly. You count as having the Repulsive Flaw (-2) and cannot increase your rating in the Looks Merit. In addition, any attempt to disguise yourself as human incurs a penalty to your dice pool equal to your Bane Severity (including the Obfuscate powers Mask of a Thousand Faces and Impostor’s Guise).",
            Nagaraja: "The storied hunger of the Nagaraja cannot be denied for long. You can consume raw flesh and slake Hunger from it as if it were blood, but you subtract your Bane Severity from the amount of Hunger slaked by drinking blood alone.",
            Lamiae: "Steeped in death, the fangs of the Lamiae spread disease. A mortal victim must succeed at a Stamina roll against a difficulty equal to your Bane Severity. Upon failure, the mortal is afflicted with a disease chosen by the Storyteller. On a total failure, this disease is terminal within one week.",
            Harbinger: "Your time in the Shadowlands (or, more likely, your tutelage under a sire who was among those who escaped across the Shroud) has bound your identity and sense of self into masks you feel compelled to wear. Whenever you are not wearing one of your masks, you suffer penalties to all Resolve and Composure rolls equal to your Bane Severity.",
            base: "Steeped in death, the fangs of the Hecata bring not bliss, but agony.  You cause additional Superficial Health damage equal to your Bane Severity for each level of Hunger slaked.  Unwilling mortals not restrained will try to escape, and even the willing or coerced must succeed at a test of Stamina + Resolve vs. 3 to submit voluntarily.  Vampires bitten by Hecata fangs face a Frenzy test vs. 3 to avoid a terror frenzy."
        },
        "Ministry": "Yours is the Blood of Set, and it shares His longing for darkness.  You suffer your Bane Severity in additional aggravated damage from sunlight, and an equivalent penalty to all dice pools when bright light is directed straight at you.",
        "Ravnos": "Your Ravnos Blood instills in you a weakness for a specific vice or crime: theft, deceit, con-artistry, etc.  When commiting your chosen vice would benefit you in some way, failure to act accordingly penalizes your Social and Mental dice pools by an amount equal to your Bane Severity for the remainder of the night.",
        "Mortal": "",
        "Werewolf": "",
        "Wraith": "",
        "Spectre": "",
        "Other": ""
    };
    const clanDiscs = {
        "Brujah": ["Celerity", "Potence", "Presence"],
        "Gangrel": ["Animalism", "Fortitude", "Protean"],
        "Malkavian": ["Auspex", "Dominate", "Obfuscate"],
        "Nosferatu": ["Animalism", "Obfuscate", "Potence"],
        "Toreador": ["Auspex", "Celerity", "Presence"],
        "Tremere": ["Auspex", "Dominate", "Blood Sorcery"],
        "Ventrue": ["Dominate", "Fortitude", "Presence"],
        "Caitiff": ["", "", ""],
        "Thin-Blooded": ["Alchemy", "", ""],
        "Lasombra": ["Dominate", "Oblivion", "Potence"],
        "Tzimisce": ["Animalism", "Auspex", "Protean"],
        "Banu Haqim": ["Celerity", "Obfuscate", "Blood Sorcery"],
        "Hecata": {
            Giovanni: ["Dominate", "Fortitude", "Oblivion"],
            Samedi: ["Fortitude", "Oblivion", "Obfuscate"],
            Nagaraja: ["Auspex", "Dominate", "Oblivion"],
            Lamiae: ["Auspex", "Oblivion", "Potence"],
            Harbinger: ["Auspex", "Fortitude", "Oblivion"],
            base: ["Auspex", "Fortitude", "Oblivion"],
        },
        "Ministry": ["Obfuscate", "Presence", "Protean"],
        "Ravnos": ["Animalism", "Fortitude", "Chimerstry"],
        "Mortal": ["True Faith", "", ""],
        "Ghoul": ["Celerity", "Fortitude", "Potence"],
        "Werewolf": ["Celerity", "Fortitude", "Potence"],
        "Wraith": ["Auspex", "Dominate", "Obfuscate"],
        "Spectre": ["Auspex", "Dominate", "Obfuscate"],
        "Other": ["", "", ""]
    };
    const compulsions = {
        "Hunger": {
            title: "Hunger",
            text: "",
            rollEffect: "",
            endsWithScene: null
        },
        "Dominance": {
            title: "Dominance",
            text: "",
            rollEffect: "",
            endsWithScene: null
        },
        "Harm": {
            title: "Harm",
            text: "",
            rollEffect: "",
            endsWithScene: null
        },
        "Paranoia": {
            title: "Paranoia",
            text: "",
            rollEffect: "",
            endsWithScene: null
        },
        clanCompulsions: {
            "Banu Haqim": {
                title: "Judgment",
                text: "",
                rollEffect: "",
                endsWithScene: null
            },
            "Brujah": {
                title: "Rebellion",
                text: "",
                rollEffect: "",
                endsWithScene: null
            },
            "Gangrel": {
                title: "Feral Impulses",
                text: "",
                rollEffect: "",
                endsWithScene: null
            },
            "Hecata": {
                title: "Morbidity",
                text: "",
                rollEffect: "",
                endsWithScene: null
            },
            "Lasombra": {
                title: "Ruthlessness",
                text: "",
                rollEffect: "",
                endsWithScene: null
            },
            "Malkavian": {
                title: "Delusion",
                text: "",
                rollEffect: "",
                endsWithScene: null
            },
            "Ministry": {
                title: "Transgression",
                text: "",
                rollEffect: "",
                endsWithScene: null
            },
            "Nosferatu": {
                title: "Cryptophilia",
                text: "",
                rollEffect: "",
                endsWithScene: null
            },
            "Toreador": {
                title: "Fixation",
                text: "",
                rollEffect: "",
                endsWithScene: null
            },
            "Tremere": {
                title: "Perfectionism",
                text: "",
                rollEffect: "",
                endsWithScene: null
            },
            "Ventrue": {
                title: "Arrogance",
                text: "",
                rollEffect: "",
                endsWithScene: null
            },
        }
    };
    const frenzyEffects = {
        fury: {
            title: "Frenzy",
            text: "",
            rollEffect: ""
        },
        hunger: {
            title: "Wassail",
            text: "",
            rollEffect: ""
        },
        terror: {
            title: "Rötschreck",
            text: "",
            rollEffect: ""
        },
        ridingTheWave: {
            text: ""
        }
    };
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
        {bp_surge: 0, bp_mend: 1, bp_discbonus: 0, bp_rousereroll: 0, bp_baneseverity: 0, bp_slakeanimal: 1, bp_slakehuman: 0, bp_slakekill: 1},
        {bp_surge: 1, bp_mend: 1, bp_discbonus: 0, bp_rousereroll: 1, bp_baneseverity: 1, bp_slakeanimal: 1, bp_slakehuman: 0, bp_slakekill: 1},
        {bp_surge: 1, bp_mend: 2, bp_discbonus: 1, bp_rousereroll: 1, bp_baneseverity: 1, bp_slakeanimal: 0.5, bp_slakehuman: 0, bp_slakekill: 1},
        {bp_surge: 2, bp_mend: 2, bp_discbonus: 1, bp_rousereroll: 2, bp_baneseverity: 2, bp_slakeanimal: 0, bp_slakehuman: 0, bp_slakekill: 1},
        {bp_surge: 2, bp_mend: 3, bp_discbonus: 2, bp_rousereroll: 2, bp_baneseverity: 2, bp_slakeanimal: 0, bp_slakehuman: -1, bp_slakekill: 1},
        {bp_surge: 3, bp_mend: 3, bp_discbonus: 2, bp_rousereroll: 3, bp_baneseverity: 3, bp_slakeanimal: 0, bp_slakehuman: -1, bp_slakekill: 2},
        {bp_surge: 3, bp_mend: 4, bp_discbonus: 3, bp_rousereroll: 3, bp_baneseverity: 3, bp_slakeanimal: 0, bp_slakehuman: -2, bp_slakekill: 2},
        {bp_surge: 4, bp_mend: 4, bp_discbonus: 3, bp_rousereroll: 4, bp_baneseverity: 4, bp_slakeanimal: 0, bp_slakehuman: -2, bp_slakekill: 2},
        {bp_surge: 4, bp_mend: 5, bp_discbonus: 4, bp_rousereroll: 4, bp_baneseverity: 4, bp_slakeanimal: 0, bp_slakehuman: -2, bp_slakekill: 3},
        {bp_surge: 5, bp_mend: 5, bp_discbonus: 4, bp_rousereroll: 5, bp_baneseverity: 5, bp_slakeanimal: 0, bp_slakehuman: -2, bp_slakekill: 3},
        {bp_surge: 5, bp_mend: 10, bp_discbonus: 5, bp_rousereroll: 5, bp_baneseverity: 5, bp_slakeanimal: 0, bp_slakehuman: -3, bp_slakekill: 3}
    ];
    const humanityText = {
        mainText: [
            "\tYou have become the Beast. Your last urges express themselves in a final Rötschreck called the wassail (see Losing the Last Drop, p. 241). A puppet of the Blood, you are a wight, under Storyteller control forever.",
            "\tYou are only nominally sentient, a hair's breadth from giving into the Beast entirely, teetering precariously on the edge of oblivion.  Very little matters at all to you anymore, even your own desires beyond sustenance and rest. You might do anything at all, or nothing. Only a few tattered shreds of ego stand between you and complete devolution. You need no speech, no art, nothing but gibbers and splatters of dried gore.",
            "\tNobody counts but you. Idiots try your patience; worms vie for your attention; mortal meat sacks get in your way and delay your feeding. Only servants and feeding stock exist, and everyone needs to decide which one they are before you decide for them. You fill your nights with twisted pleasures, decadent whims, perverse atrocities and callous murder. By now, every human and most Kindred recoil from your presence.",
            "\tAt this level, cynical and jaded describes you on a good day. You callously step over anyone and anything, stopping only to indulge a new hobby for cruelty. You're a survivor who always take the safe route, the pragmatic route: kill witnesses and don’t risk trusting anyone you haven’t got your talons into somehow. Your mortal life is all but forgotten, and you genuinely look monstrous --- even under the most flattering light.",
            "\tHey, some people gotta die. You have finally begun, even accepted, your inevitable slide into moral sloth and self-indulgence. Killing is more than fine:  Ask the elders, they’ve been around long enough to see whole genocides ignored. Destruction, theft, injury – these are all tools, not taboos. Physical changes become quite evident as “ashen pallor” shades more firmly into “corpse-like.”",
            "\tYou’ve been around the block, and are as humane as a typical ancilla.  You’ve accepted pain and anguish, and are adapting to it as part of existence. You don’t care about most mortals one way or the other; after all, you’re never going to be mortal again, so why bother? You’re selfish, and you lie like its second nature. You may manifest some minor physical eeriness or malformation, such as an unnatural hue to the eyes.",
            "\tHey, shit happens.  People die, stuff breaks, backs get stabbed. You have little difficulty with the fact that you need blood to survive and that you do what needs to be done to get it. Virtues are starting to feel like anchors: You might not go out of your way to wreck things or kill people, but you don’t cry bloody tears over it either. You're not automatically horrid, but you're not about to win any prizes for congeniality either.",
            "\tYou can usually manage to pass for a human, as your moral code is on par with that of the average mortal.  You subscribe to typical social mores - sure, sin is wrong, but dodging taxes and speed limits are not sins. You feel some connection to other beings, even human beings, though more than a little selfishness shines through – just like everyone else in the world, whether they're mortal or not.",
            "\tYou still feel pain for the hurts you and your kind inflict. Your human guise remains passable: either your memories remain fresh, or new instincts for community spring up like green shoots from your long-dead soul.  Something inside you still pines for the sunlight and for the mortal life you knew: only by losing them both did you come to realize just how much you took for granted.",
            "\tYou act more humanely than most humans, and fit in naturally among the kine.  You think and act much as they do: Killing feels horrible, almost as gut-wrenchingly so as the Hunger in full cry.  You likely hold to codes more rigorous than you ever held in life, as a defense against becoming a predator.  Elder kindred scoff at your lofty behavior, either out of callous disdain or to muffle their own regrets.",
            "\tRare even among the living, this degree of humanity is all but unheard of among vampires.  You lead a saintly, veritably ascetic life, one that you must tightly control with principles and codes of ethics painstakingly assembled and rigidly adhered to: The merest selfish deed or thought is enough to topple you from this state of grace.  You didn't get here by accident, and may even be in pursuit of the mythical state of Golconda."
        ],
        bulletText: {
            neg: [
                [],
                [" ",
                 "●  -8 penalty to Social rolls to interact with mortals.",
                 "\t(Does not apply to fear, predation, or seduction.)",
                 "●  -8 penalty to rolls relating to art and the humanities.",
                 "\tWith Blush of Life, both of these penalties are reduced to -5.",
                 "●  You cannot keep mortal food and drink down.",
                 "●  Even faking sexual activity is impossible."],
                [" ",
                 "●  -6 penalty to Social rolls to interact with mortals.",
                 "\t(Does not apply to fear, predation, or seduction.)",
                 "●  -6 penalty to rolls relating to art and the humanities.",
                 "\tWith Blush of Life, both of these penalties are reduced to -4.",
                 "●  You cannot keep mortal food and drink down.",
                 "●  Even faking sexual activity is impossible."],
                [" ",
                 "●  -4 penalty to Social rolls to interact with mortals.",
                 "\t(Does not apply to fear, predation, or seduction.)",
                 "●  -4 penalty to rolls relating to art and the humanities.",
                 "●  You cannot keep mortal food and drink down.",
                 "●  Even faking sexual activity is impossible."],
                [" ",
                 "●  -2 penalty to Social rolls to interact with mortals.",
                 "\t(Does not apply to fear, predation, or seduction.)",
                 "●  -2 penalty to rolls relating to art and the humanities.",
                 "●  You cannot keep mortal food and drink down.",
                 "●  You don't enjoy sex, but you can roll to fake it with a -2 penalty."],
                [" ",
                 "●  -1 penalty to Social rolls to interact with mortals.",
                 "\t(Does not apply to fear, predation, or seduction.)",
                 "●  -1 penalty to rolls relating to art and the humanities.",
                 "●  You don't enjoy sex, but you can roll to fake it with a -2 penalty."],
                [" ",
                 "●  You don't enjoy sex, but you can roll to fake it with a -1 penalty."],
                [],
                [],
                [],
                []
            ],
            neutral: [
                [],
                [],
                [],
                [],
                [],
                [" ",
                 "●  You cannot keep mortal food and drink down.",
                 "\tWith Blush of Life, you can roll to resist vomiting."],
                [" ",
                 "●  You cannot keep mortal food and drink down.",
                 "\tWith Blush of Life, you can roll to resist vomiting."],
                [" ",
                 "●  You must roll to keep mortal food and drink down.",
                 "\tWith Blush of Life, you can digest (but not enjoy) mortal food/drink.",
                 "●  You don't enjoy sex, but you can roll to fake it."],
                [],
                [],
                []
            ],
            pos: [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [" ",
                 "●  You roll twice on Rouse Checks to activate Blush of Life.",
                 "●  You must roll to keep mortal food and drink down.",
                 "\tWith Blush of Life, you can digest mortal food, and even enjoy wine.",
                 "●  With Blush of Life, you can enjoy sex as if you were mortal.",
                 "●  You awaken one hour before sunset."],
                [" ",
                 "●  Blush of Life is unnecessary: You always appear alive and human.",
                 "●  You can enjoy liquids as if you were mortal.",
                 "●  You can enjoy raw (or very rare) meat as if you were mortal.",
                 "●  You can enjoy sexual intercourse as if you were mortal.",
                 "●  You heal naturally as if you were mortal.",
                 "●  You awaken one hour before sunset.",
                 "●  You can remain awake for up to one hour after sunrise."],
                [" ",
                 "●  You take half damage from sunlight.",
                 "●  Blush of Life is unnecessary: You always appear alive and human.",
                 "●  You can enjoy all food and drink as if you were mortal.",
                 "●  You can enjoy sexual intercourse as if you were mortal.",
                 "●  You heal naturally as if you were mortal.",
                 "●  You can remain awake during the day as if you were mortal."]
            ]
        },
        torporText: [
            [],
            ["Minimum Torpor Length: Five Hundred Years"],
            ["Minimum Torpor Length: One Hundred Years"],
            ["Minimum Torpor Length: Fifty Years"],
            ["Minimum Torpor Length: Ten Years"],
            ["Minimum Torpor Length: One Year"],
            ["Minimum Torpor Length: One Month"],
            ["Minimum Torpor Length: Two Weeks"],
            ["Minimum Torpor Length: One Week"],
            ["Minimum Torpor Length: Three Days"],
            []
        ]
    };
    const marqueeTips = [
        ["Caine the First",
         "Caine, son of Adam, was the First vampire.",
         "He sired the Second Generation, of which there were three: Enoch the Wise, Irad the Strong, and Zillah the Beautiful.",
         "All are said to have perished in the time before the Great Flood at the hands of their childer, the Antediluvians of the Third Generation."],
        ["Masquerade",
         "~ THE FIRST TRADITION ~",
         "\"Thou shall not reveal thy true nature to those not of the Blood.",
         "Doing so forfeits your claim to the Blood.\""],
        ["Domain",
         "~ THE SECOND TRADITION ~",
         "\"All others owe thee respect while in thy domain.",
         "None may challenge thy word while in it.\""],
        ["Progeny",
         "~ THE THIRD TRADITION ~",
         "\"Thou shall only Sire another with the permission of thine Eldest.\""],
        ["Accounting",
         "~ THE FOURTH TRADITION ~",
         "\"Those thou create are thine own children.",
         "Until thy Progeny shall be Released, their sins are thine to endure.\""],
        ["Hospitality",
         "~ THE FIFTH TRADITION ~",
         "\"When thou comest to a foreign city, thou shall present thyself to the Eldest who ruleth there.",
         "Without the word of acceptance, thou art nothing.\""],
        ["Destruction",
         "~ THE SIXTH TRADITION ~",
         "\"The right to destroy another of thy kind belongeth only to thine Eldest.",
         "Only the Eldest among thee shall call the Blood Hunt.\""],
        ["The Prince",
         "The prince is the vampire who has claimed leadership over a city on behalf of the Camarilla. Only the",
         "prince possesses the authority of the Eldest, the right to Embrace, and ultimate dominion over the city.",
         "The Prince of Toronto is Osborne Lowell of Clan Ventrue, served by his seneschal Frederick Scheer, of Clan Tremere."],
        ["The Council of Primogen",
         "The primogen are Camarilla officials that, at least in theory, serve as the representatives of their respective clans",
         "to the prince of a city under Camarilla rule.  In general, the ruling vampires of the city value the primogen and their",
         "opinions; they are called in to consult on decisions; and their recommendations carry great weight."],
        ["The Baron",
         "A baron is the Anarch Movement's equivalent to a Camarilla prince: the highest Anarch authority in a city. As the Anarchs believe",
         "in a system that awards merit, barons tend to vary in age and experience far more than princes, who are generally elders.",
         "The Baroness of Toronto is Monika Eulenberg of Clan Malkavian, marshalling over a half-dozen associated coteries. "],
        ["The Camarilla",
         "The Camarilla is the largest of the vampiric sects.  The Ivory Tower once presumed to represent and protect all vampires by",
         "enforcing and promulgating the Six Traditions, but it has shut its doors against outsiders in recent nights. Now, the Camarilla",
         "stands for seven clans: Banu Haqim, Malkavian, Nosferatu, Toreador, Tremere, Ventrue, and recent inductees Clan Lasombra."],
        ["The Anarchs",
         "The Anarchs are vampires who reject the status quo of Camarilla society.  They especially resent the privileged status held by",
         "elders, and champion the rights of younger Kindred against an establishment that concentrates power among the very old.  Unlike the",
         "Sabbat, the Anarchs loosely hold to the Traditions of the Camarilla, and are largely (if reluctantly) tolerated by the larger sect."],
        ["The Sabbat",
         "The Sabbat is a loose organization of Kindred who reject the Traditions and the assumed humanity of the Camarilla, their bitter enemies.",
         "Though antitribu of any clan are welcome, Clans Lasombra and Tzimisce are the traditional fists and faith of the Sabbat — though a recent",
         "shift in the status quo saw the dramatic defection of Clan lasombra to the Camarilla, to rule side-by-side with Clan Ventrue."],
        ["The Convention of Thorns",
         "The Convention of Thorns is the founding document of the Camarilla. Signed",
         "in 1493 between Camarilla leaders, Anarchs, and Clan Assamite, the three-way",
         "peace agreement marked the end of the first Anarch Revolt."],
        ["The Convention of Prague",
         "In 2012, at the Convention of Prague, several Camarilla leaders were killed by Brujah rebels during the clan's violent exit from the sect.",
         "Tonight, Clan Brujah is associated with the Anarchs, along with many of Clan Gangrel (another clan that recently left the Camarilla)."],
        ["High Clans",
         "Before the Second Inquisition destroyed Clan Tremere's Prime Chantry in Vienna, the warlocks",
         "were one of the High Clans of the Camarilla, along with Clan Toreador and Clan Ventrue."],
        ["Low Clans",
         "Clan Brujah and Clan Gangrel recently left the Camarilla to join the Anarch",
         "Movement, leaving Clan Malkavian and Clan Nosferatu as the two Low Clans of the Camarilla."],
        ["Autarkis",
         "An autarkis is a vampire who remains outside and apart from the larger vampire society of a given",
         "city, one who refuses to acknowledge the claim of a prince, baron, sect, clan, or other such",
         "entity. Autarkes tend to be old and powerful, to successfully flout the authority of the ruling sect."],
        ["The Inconnu",
         "The Inconnu are an ancient and secretive sect of vampires, about whom virtually nothing is known.",
         "The only visible facet of the sect seems to be the Monitors, who watch vampiric events while avoiding direct interference."],
        ["Resonance & Dyscrasias",
         "Strong emotions can give a mortal's blood \"resonance\". Drinking strongly-resonant blood empowers the use of associated disciplines; the",
         "strongest resonances (called \"dyscrasias\") confer even greater rewards. It is possible to influence resonances in mortals, cultivating",
         "their blood to your tastes.  With a Project, you can change a resonance entirely, and even confer a dyscrasia upon the blood."],
        ["The Blood Hunt",
         "If the prince calls a Blood Hunt (or the more-formal \"Lexitalionis\") against a",
         "vampire, all Kindred in the city are given permission to kill and even diablerize the convicted.",
         "It is one of the few times diablerie is sanctioned by the Camarilla."],
        ["The Blood Bond",
         "Drinking another vampire's blood on three consecutive nights will forge a blood",
         "bond, a hollow mockery of subservient love that enslaves you to their will."],
        ["Diablerie",
         "Diablerie is the act of draining another vampire's blood and soul to gain a measure of their power.",
         "It is the only way to lower one's generation, but it is anathema to the Camarilla:",
         "Diablerists risk final death if their crimes are discovered."],
        ["Ghouls",
         "Feeding a mortal your blood transforms them into a ghoul.  They will gain a measure of your vampiric",
         "power while retaining their humanity, and their addiction to your blood secures their loyalty."],
        ["Clan Brujah: The Learned Clan",
         "Clan Brujah of the Anarchs descends from Troile of the Third Generation, childe of Irad the Strong, childe of Caine the First.",
         "Iconoclasts and rebels, they boldly fight the establishment to forge a new world. Their recent and violent defection from the",
         "Camarilla sent shockwaves through the Ivory Tower."],
        ["Clan Gangrel: The Clan of the Beast",
         "Clan Gangrel descends from Ennoia of the Third Generation, whose sire is unknown.",
         "Outcasts and wanderers, the Gangrel are closely tied to the animal aspect of the Beast",
         "— whether as a wolf in back alleys, or as a shark in the boardroom."],
        ["Clan Malkavian: The Moon Clan",
         "Clan Malkavian of the Camarilla descends from Malkav of the Third Generation, childe of Enoch the Wise, childe of Caine the First.",
         "Cursed with vision and madness, the Malkavians are seers for whom prophecy and delusion are often indistinguishable."],
        ["Clan Nosferatu: The Clan of the Hidden",
         "Clan Nosferatu of the Camarilla descends from Absimiliard of the Third Generation, childe of Zillah the Beautiful, childe of",
         "Caine the First. Cursed with deformity and ugliness, they watch and listen from the shadows and the sewers, building an ever-",
         "growing treasure-trove of secrets.  This knowledge is highly prized, and comprises the largest part of their political capital."],
        ["Clan Toreador: The Clan of the Rose",
         "Clan Toreador of the Camarilla descends from Arikel of the Third Generation, childe of Enoch the Wise, childe of Caine the First.",
         "Famous and infamous as a clan of artists and innovators, they are one of the bastions of the Camarilla, for",
         "their very survival depends on the facades of civility and grace on which the sect prides itself."],
        ["Clan Tremere: The Usurpers",
         "Clan Tremere of the Camarilla descends from Tremere of the Third Generation, who diablerized and usurped Saulot, childe of Enoch",
         "the Wise, childe of Caine the First.  Thus Clan Tremere replaced Clan Salubri as one of the thirteen Great Clans, and hunted them to",
         "extinction. Warlocks and blood sorcerers, the once-mighty Tremere recently suffered a devastating blow from the Second Inquisition."],
        ["Clan Ventrue: The Kingship Clan",
         "Clan Ventrue of the Camarilla descends from Ventru of the Third Generation, childe of Irad the Strong, childe of Caine the First.",
         "Aristocrats and rulers, Clan Ventrue represents the establishment.  They see themselves as the leaders of the Camarilla, and",
         "hold more positions of influence and power (among both mortals and Kindred) than any other clan."],
        ["Clan Lasombra: The Night Clan",
         "Clan Lasombra of the Camarilla descends from Lasombra of the Third Generation, childe of Irad the Strong, childe of Caine the First.",
         "Predatory, elegant and inhuman manipulators of darkness, these once-leaders of the Sabbat are ruthless social Darwinists who believe in",
         "the worthy ruling and the unworthy serving. After defecting en masse to the Camarilla, they now compete directly with their Ventrue rivals."],
        ["Clan Tzimisce: The Clan of Shapers",
         "Clan Tzimisce (\"zih-ME-see\") of the Sabbat descends from an Antediluvian known only as \"the Eldest\", childe of Enoch the Wise, childe",
         "of Caine the First.  Scholars, sorcerers and flesh-shapers, the Tzimisce are alien and inscrutable, proudly renouncing",
         "their humanity to focus on transcending the limitations of the vampiric state, by following their \"Path of Metamorphosis\"."],
        ["The Banu Haqim: The Clan of the Hunt",
         "The Banu Haqim of the Camarilla, once known as Clan Assamite, descends from Haqim of the Third Generation, childe of Zillah the Beautiful,",
         "childe of Caine the First.  Once seen as dangerous assassins and diablerists, the clan now operates under new leadership. Freed from",
         "devotion to the blood god Ur-Shulgi, they are now a clan of scholars and guardians who seek to distance themselves from the Jyhad."],
        ["Clan Hecata: The Clan of Death",
         "Clan Hecata grew from the ashes of Clan Giovanni, descended from Augustus Giovanni, who diablerized and usurped Ashur, childe of Irad",
         "the Strong, childe of Caine the First. A grand Family Reunion brought many bloodlines into the Hecata fold, each bringing their unique",
         "affinities with death magic: This consolidation of power has enabled Clan Hecata to exist as the only remaining independent Great Clan."],
        ["The Ministry: The Snake Clan",
         "The Ministry of the Anarchs, once known as Clan Setite, descends from Setekh of the Third Generation, childe of Zillah the Beautiful,",
         "childe of Caine the First.  They have cast off their identity as serpentine tempters, corruptors and purveyors of every vice, claiming now",
         "to serve a higher purpose for its own sake. The Ministry only recently joined the Anarch Movement, after being shunned by the Camarilla."],
        ["Gehenna",
         "Foretold in the Book of Nod, a sacred text to many Kindred, Gehenna is the vampire Armageddon:",
         "It is prophesied to be the time when the Antediluvians will rise from their slumbers and devour their descendants."],
        ["Jyhad",
         "The Jyhad is said to be the \"eternal struggle\" for dominance between ancient methuselahs and the surviving Antediluvians.",
         "Believers claim it is a subtle and insidious conflict, one that is fought in the everynight interactions of",
         "younger vampires, most of whom are entirely unaware they are being controlled and used as pawns."],
        ["Golconda",
         "Golconda is a mystical state of enlightenment where a vampire is no longer subject to the",
         "Beast, or, alternatively, where the Beast and human aspects of a vampire are in balance.",
         "The secrets of achieving Golconda are known by very few; many more consider Golconda to be a myth."],
        ["Frenzy",
         "A frenzy occurs when the Beast seizes control of your body to act out your (its?) most primal instincts, regardless of the consequences.",
         "Frenzies are most-often the result of being overwhelmed by anger, by fear, or by hunger."],
        ["Of Cities: The Barrens",
         "The Barrens are places in the city with a dearth of mortal prey, making them unsuitable for the Kindred.",
         "The Barrens often include industrial areas, abandoned districts, and the city outskirts."],
        ["Of Cities: The Rack",
         "The Rack consists of the most favourable hunting grounds in the city, and thus the most valuable domains.",
         "Clubs, bars and other areas with a vibrant night life generally comprise the Rack."],
        ["Dracula",
         "Dracula, the vampire made famous by the mortal author Bram Stoker, is indeed real. An elder of",
         "Clan Tzimisce, the powers described in Stoker's novel are manifestations of Dracula's command",
         "of myriad disciplines, including Protean, Dominate, Presence and Animalism."],
        ["The Beckoning",
         "The Beckoning is a calling in the Blood, a cry for aid from the sleeping Antediluvians to guard their places of rest from the",
         "Sabbat, who search for them relentlessly in the Middle East.  The stronger the Blood, the stronger the call:  Only vampires of the ninth",
         "generation and lower feel it at all.  Many continue to resist the summons; many others have found it impossible to ignore."],
        ["Of Cities: Elysium",
         "Elysium is any place declared as such by the prince, wherein the safety of all guests is guaranteed and violence is forbidden.",
         "Until very recently, Elysiums served as neutral ground for all Kindred.  Tonight, however, the Camarilla has made it clear that only",
         "those loyal to the Ivory Tower should expect the protection of its laws."],
        ["Torpor",
         "Torpor is a long state of dreamless slumber, during which a Kindred quite literally sleeps like the dead.",
         "Serious injury or hunger can force a vampire into torpor, as can a stake that punctures the heart.",
         "The oldest vampires enter torpor voluntarily, sleeping away the centuries for reasons unknown."],
        ["The Blush of Life",
         "With effort, Kindred can force their hearts to beat and their cheeks to flush for a time, assuming the appearance of a living mortal.",
         "Called \"the Blush of Life\", it is an imperfect disguise that grows ever more difficult to achieve as one loses touch with humanity."],
        ["Mechanic: Memoriam",
         "If you want to assert that you did something in the past, you can call for a \"Memoriam\".",
         "During Memoriam, we play out a quick flashback scene to see how things really turned out.",
         "If you are successful, you retroactively gain the benefits of your past efforts in the present."],
        ["The Prophecy of Gehenna",
         "\"You will know these last times by the Time of Thin Blood, which will mark vampires that cannot beget.",
         "You will know them by the Clanless, who will come to rule.\"",
         "                                                    — The Book of Nod"],
        ["The Second Inquisition",
         "The Second Inquisition is the name given to the current mortal pogrom against the Kindred: a global effort by covert government",
         "agencies aided by a secret militant wing of the Vatican to erase vampires from existence. It began when a Camarilla plot to turn mortal",
         "authorities against their enemies backfired, revealing the existence of the Kindred to governments around the world."],
        ["The Week of Nightmares",
         "The Week of Nightmares occurred in the summer of 1999, when the Ravnos Antediluvian Zapathasura awakened from torpor and, after",
         "a long and bloody conflict, was defeated by a powerful alliance of vampires, werewolves and mages.  At the moment of his",
         "death, Zapathasura unleashed a psychic scream that drove every Ravnos into a cannibalistic frenzy, nearly destroying the entire clan."],
        ["Clan Ravnos: The Wanderer Clan",
         "Clan Ravnos of India descends from Zapathasura of the Third Generation, whose sire is unknown.",
         "Nomads, tricksters and performers, they have long been villified as con-artists and deceivers.  Armed",
         "with unparalleled powers of illusion, the very senses turn traitor in the presence of a Ravnos."],
        ["Enoch the Wise",
         "Enoch the Wise was Caine's first childe, and the eldest member of the Second Generation.",
         "Brilliant and insightful, the Antediluvians he sired inherited the gift of Auspex, as did the clans they founded:",
         "Clan Malkavian; Clan Salubri, who would be usurped by the Tremere; Clan Toreador; and Clan Tzimisce."],
        ["Zillah the Beautiful",
         "Zillah the Beautiful was Caine's second childe, and the middle sibling of the Second Generation.",
         "A master of perception and disguise, the Antediluvians she sired inherited the gift of Obfuscate, as did the clans they founded:",
         "Clan Nosferatu; Clan Assamite, known tonight as the Banu Haqim; and Clan Setite, known tonight as the Ministry."],
        ["Irad the Strong",
         "Irad the Strong was Caine's third childe, and the youngest member of the Second Generation.",
         "A man of strong will and great ambition, the Antediluvians he sired inherited the gift of Dominate, as did the clans they founded:",
         "Clan Brujah, who rejected the Gift; Clan Cappadocian, who would be usurped by the Hecata; Clan Lasombra; and Clan Ventrue."],
        ["The Pyramid Falls",
         "Until recently, Clan Tremere was the most rigidly organized of the thirteen Great Clans: every warlock was bound by Blood to the strict",
         "hierarchy of the Pyramid.  But in recent nights, the Blood of Clan Tremere has lost its power to command obedience.  The Pyramid",
         "has shattered, dividing the clan into three factions: House Tremere, House Goratrix, and House Carna."],
        ["Shovelheads",
         "When the Sabbat assault a city, no strategy is more threatening to the Masquerade than their penchant for",
         "mass-Embracing mortals, knocking them unconscious with a shovel before they frenzy, and throwing them into",
         "an open grave from which they must dig themselves out — a process that invariably drives them insane."],
        ["The Book of Nod",
         "An ancient text hailed as scripture by some and as fraudulent nonsense by others, the Book of Nod is the oldest text",
         "that mentions vampires as they exist tonight.  It begins with the Testament of Caine, tells of his relationship with the blood-",
         "witch Lillith, describes the First City and the creation of the thirteen Great Clans, and ends with the doomsday Prophecy of Gehenna."],
        ["The Sacking of Carthage",
         "The ancient city of Carthage was Clan Brujah's greatest achievement: strong, prosperous, idealistic, and entirely theirs...",
         "until the armies of Ventrue-held Rome destroyed it utterly, salting the earth so Carthage could never rise again.  Clan Brujah",
         "has never forgotten the blood on Clan Ventrue's hands: The two clans have despised each other ever since."],
        ["Clan Rivalries: Ventrue & Lasombra",
         "The Ventrue and the Lasombra are as alike as they are polar opposites: As the Ventrue rule the Camarilla, the Lasombra ruled the",
         "Sabbat, until recently. Both Embrace the capable and the ambitious; both prize power above all else; and both consider themselves the",
         "true masters of Dominate. Their hatred for each other is matched only by their grudging respect for their rival kings among the Kindred."],
        ["Clan Rivalries: Brujah & Ventrue",
         "When Ventrue-controlled Rome sacked Carthage, the greatest of Clan Brujah's achievements, they sparked a rivalry whose age is",
         "only surpassed by the feud between Clan Ravnos and Clan Gangrel.  With Clan Ventrue embodying the status quo and Clan Brujah",
         "rebelling against the establishment, their mutual disdain has found no shortage of fuel over the centuries."],
        ["Clan Rivalries: Tremere & Tzimisce",
         "It wasn't Tremere who unlocked the secrets of vampiric immortality, but his disciple Goratrix.  His methods were barbaric: he",
         "experimented on hundreds of native Tzimisce, ultimately starting a war between Clan Tzimisce and the newly-formed Clan Tremere.",
         "Though the Omen War has long ended, the hatred between the two clans persists undimmed into the modern nights."],
        ["Clan Rivalries: Tremere & Banu Haqim",
         "In 1493, at the signing of the Convention of Thorns that founded the Camarilla, the Banu Haqim (then Clan Assamite) were widely feared",
         "for their wanton commission of diablerie.  So Clan Tremere placed a curse on the entire bloodline, preventing them from drinking Kindred",
         "Blood. Though the curse was recently broken, the Banu Haqim have yet to truly forgive Clan Tremere's interference."],
        ["Clan Rivalries: Gangrel & Ravnos",
         "When the Gangrel Antediluvian Ennoia murdered a favored childe of the Ravnos Antediluvian Zapathasura, Zapathasura cursed Ennoia",
         "as a beast, placing upon her what would become the clan bane of all Gangrel.  Thus began the oldest rivalry between clans, a feud",
         "known to every Gangrel and to every Ravnos, which continues to rage unchecked in modern nights."],
        ["Clan Rivalries: Nosferatu & Toreador",
         "Throughout history, Clan Toreador has been behind a cavalcade of subtle machinations against Clan Nosferatu, ostracizing them from",
         "\"polite\" Kindred society and resigning them to the slums and sewers. For most clans, these acts would be unforgivable, but the",
         "Nosferatu are subtle and indisposed to grudges. Nevertheless, the Toreador know to expect a very steep price to secure Nosferatu services."],
        ["The First Inquisition: The Burning Times",
         "During the 14th, 15th and 16th centuries, the Inquisition raged throughout Europe.  Many Kindred were destroyed, and many more",
         "were forced to abandon their holdings and go into hiding.  To most Kindred, this was the first time they learned to fear mortals as",
         "a threat.  A cultural shift took hold, leading to the Tradition of the Masquerade and the formation of the Camarilla."],
        ["Prestation",
         "Prestation describes the system of exchanging favors among the Kindred.  Since debts do not expire and eternity is a very long",
         "time, prestation carries great weight among immortals of all sects.  Though favors (or \"boons\" as they are known) are usually tracked",
         "informally, a Kindred who renegs on such a debt is quickly identified, and risks social ostracism — or worse."],
        ["Mechanic: Projects",
         "Any long-term goal that you have for your character should be tracked as a \"Project\".  To start a Project, describe the goal you ",
         "wish to accomplish, and we'll go from there.  Be warned: Your adversaries are running their own Projects, and may interfere with yours.",
         "There are systems for discovering Projects, interfering with Projects, and even stealing a Project and reaping its benefits."],
        ["The Seneschal",
         "A seneschal is an influential vampire who is empowered by the prince to act on their behalf on most matters.  At any time, they may be",
         "asked to step into the prince's place if they leave town on business, abdicate, or are slain.  However powerful the position of",
         "seneschal, all actions taken by the city's second-highest authority remain subject to revocation by the prince."],
        ["Justicars",
         "The justicars are the most powerful visible component of the Camarilla's worldwide presence, charged with adjudicating matters of the",
         "Traditions on a global scale. There is one justicar for each Camarilla clan: Juliet, the Malkavian Justicar; Molly MacDonald, the",
         "Nosferatu Justicar; Diana Iadanza, the Toreador Justicar; Ian Carfax, the Tremere Justicar; and Lucinde, the Ventrue Justicar."],
        ["Archons",
         "Archons are the trusted, hand-picked servants of the justicars: if the justicars are the Camarilla's hands, the archons are its fingers.",
         "A justicar can appoint any number of archons, and each acts with the justicar's full authority in all matters.  The appearance of an",
         "archon in a city is a time of great uncertainty, for even princes must defer to a justicar's mandate."],
        ["The Sheriff",
         "The sheriff is a vampire selected by the prince and primogen who enforces the Blood Hunt within the prince's domain, as",
         "well as any other edicts of the prince.  Ultimately, they are charged with maintaining order and harmony within a city, and",
         "investigating the commission of any crimes against the prince's laws or the Traditions themselves."],
        ["Scourges",
         "A scourge is directly subordinate to the prince, and is responsible for the destruction of the thin-blooded as well",
         "as any other vampires who have been Embraced in violation of the Third Tradition.  Unlike the sheriff, a scourge operates",
         "under no pretense of due process or investigation: those they hunt are already guilty by their very nature."],
        ["Antitribu",
         "An antitribu is a vampire who is aligned with a sect that opposes the one their clan traditionally associates with.  Most antitribu",
         "are defectors to the Sabbat, but there do exist Lasombra antitribu in the Camarilla.  Tzimisce antitribu are virtually unheard of, both",
         "because the Tremere hunt them mercilessly, and because of the ease with which the Clan of Shapers can disguise their heritage."]
    ];
    // #endregion

    // #region Repeating Field Configuration
    const DISCENUMS = ["disc1", "disc2", "disc3"];
    const DISCREPREFS = {
        discLeft: ["disc", "disc_name", "disc_flag", "discpower_toggle"],
        discMid: ["disc", "disc_name", "disc_flag", "discpower_toggle"],
        discRight: ["disc", "disc_name", "disc_flag", "discpower_toggle"]
    };
    const ADVREPREFS = {
        advantage: ["advantage", "advantage_name", "advantage_flag", "advantage_type", "advantage_details"],
        negadvantage: ["negadvantage", "negadvantage_name", "negadvantage_flag", "negadvantage_type", "negadvantage_details"]
    };
    const DOMCONREPREFS = {
        domaincontrol: ["district", "level", "summary", "details"]
    };
    const DOMAINCONTROL = {
        "Annex": ["+1 to Remorse Rolls", "+2 to Remorse Rolls", "+2 to Remorse Rolls & Free Reroll"],
        "BayStFinancial": ["+1 Resources", "+2 Resources", "+4 Resources"],
        "Bennington": ["+1 Willpower", "+2 Willpower", "+3 Willpower"],
        "Cabbagetown": ["-1 Humanity", "-2 Humanity", "-3 Humanity"],
        "CentreIsland": ["+2 Haven", "+4 Haven", "+6 Haven"],
        "Chinatown": ["Language ●", "Language ●, ●", "Language ●, ●, ●, ●"],
        "CityStreets": ["+1 to Travel Rolls", "+2 to Travel Rolls", "+2 to Travel Rolls & Free Reroll"],
        "Corktown": ["+1 Influence (Crime)", "+2 Influence (Crime)", "+4 Influence (Crime)"],
        "Danforth": ["+1 to Insight Rolls", "+2 to Insight Rolls", "+2 to Insight Rolls & Free Reroll"],
        "DeerPark": ["Retainer (Animal) ●●", "Retainer (Animal) ●●, ●●", "Retainer (Animal) ●●, ●●, ●●●●"],
        "Discovery": ["+1 to Research Rolls", "+2 to Research Rolls", "+4 to Research Rolls"],
        "DistilleryDist": ["+1 to Acquisition Rolls", "+3 to Acquisition Rolls", "+5 to Acquisition Rolls"],
        "DupontByTheCastle": ["+1 to Etiquette Rolls", "+3 to Etiquette Rolls", "+3 to Etiquette Rolls & Free Reroll"],
        "GayVillage": ["+1 Herd", "+2 Herd", "+4 Herd"],
        "HarbordVillage": ["+1 Lien", "+2 Lien", "+4 Lien"],
        "Humewood": ["Phys. Attributes: -1 XP", "Phys. Attributes: -2 XP", "Phys. Attributes: -4 XP"],
        "LakeOntario": ["+1 to Survival Rolls", "+2 to Survival Rolls", "+2 to Survival Rolls & Free Reroll"],
        "LibertyVillage": ["+1 to Resolve Rolls", "+2 to Resolve Rolls", "+3 to Resolve Rolls"],
        "LittleItaly": ["+1 to Hunting Rolls", "+2 to Hunting Rolls", "+1 Hunger Slaked"],
        "LittlePortugal": ["+1 Blood Potency", "+2 Blood Potency", "+3 Blood Potency"],
        "PATH": ["+1 to Streetwise Rolls", "+2 to Streetwise Rolls", "+4 to Streetwise Rolls"],
        "RegentPark": ["Social Attributes: -1 XP", "Social Attributes: -2 XP", "Social Attributes: -4 XP"],
        "Riverdale": ["Formula ●", "Formula ●, ●●", "Formula ●, ●●, ●●●"],
        "Rosedale": ["+1 Portillion", "+2 Portillion", "+4 Portillion"],
        "Sewers": ["+1 to Stealth Rolls", "+2 to Remorse Rolls", "+2 to Remorse Rolls & Free Reroll"],
        "StJamesTown": ["+1 to Remorse Rolls", "+2 to Remorse Rolls", "+2 to Remorse Rolls & Free Reroll"],
        "Summerhill": ["Contacts (Street) ●", "Contacts (Street) ●, ●", "Contacts (Street) ●, ●, ●●"],
        "Waterfront": ["+1 Influence (Nightlife)", "+2 Influence (Nightlife)", "+4 Influence (Nightlife)"],
        "WestQueenWest": ["+1 to Remorse Rolls", "+2 to Remorse Rolls", "+2 to Remorse Rolls & Free Reroll"],
        "Wychwood": ["Ritual ●", "Ritual ●, ●●", "Ritual ●, ●●, ●●●"],
        "YongeMuseum": ["Mental Attributes: -1 XP", "Mental Attributes: -2 XP", "Mental Attributes: -4 XP"],
        "YongeHospital": ["+1 Health", "+2 Health", "+3 Health"],
        "YongeStreet": ["+1 Status", "+2 Status", "+4 Status"],
        "Yorkville": ["+1 to Remorse Rolls", "+2 to Remorse Rolls", "+2 to Remorse Rolls & Free Reroll"],
    };
    const XPREPREFS = {
        spentxp: ["xp_spent_toggle", "xp_category", "xp_trait", "xp_initial", "xp_new", "xp_trait_toggle", "xp_initial_toggle", "xp_arrow_toggle", "xp_new_toggle", "xp_cost"],
        earnedxp: ["xp_session", "xp_award", "xp_reason"],
        earnedxpright: ["xp_session", "xp_award", "xp_reason"]
    };
    const XPPARAMS = {
        "Attribute": {
            colToggles: ["xp_trait_toggle", "xp_initial_toggle", "xp_new_toggle"],
            cost: 5
        },
        "Skill": {
            colToggles: ["xp_trait_toggle", "xp_initial_toggle", "xp_new_toggle"],
            cost: 3
        },
        "Specialty": {
            colToggles: ["xp_trait_toggle"],
            cost: 3
        },
        "Clan Discipline": {
            colToggles: ["xp_trait_toggle", "xp_initial_toggle", "xp_new_toggle"],
            cost: 5
        },
        "Other Discipline": {
            colToggles: ["xp_trait_toggle", "xp_initial_toggle", "xp_new_toggle"],
            cost: 7
        },
        "Caitiff Discipline": {
            colToggles: ["xp_trait_toggle", "xp_initial_toggle", "xp_new_toggle"],
            cost: 6
        },
        "Ceremony": {
            colToggles: ["xp_trait_toggle", "xp_new_toggle"],
            cost: 3
        },
        "Ritual": {
            colToggles: ["xp_trait_toggle", "xp_new_toggle"],
            cost: 3
        },
        "Formula": {
            colToggles: ["xp_trait_toggle", "xp_new_toggle"],
            cost: 3
        },
        "Advantage": {
            colToggles: ["xp_trait_toggle", "xp_initial_toggle", "xp_new_toggle"],
            cost: 3
        },
        "Blood Potency": {
            colToggles: ["xp_initial_toggle", "xp_new_toggle"],
            cost: 10
        }
    };
    // #endregion

    // #region Derivative Stats
    const BASICATTRS = _.map(_.flatten([_.values(ATTRIBUTES), _.values(SKILLS), DISCENUMS, TRACKERS]), v => v.toLowerCase());
    const BASICFLAGS = _.map(_.omit(BASICATTRS, TRACKERS), v => `${v}_flag`);
    const ALLATTRS = _.map([
        ...ROLLFLAGS.all,
        ...BASICATTRS,
        ...BASICFLAGS,
        ..._.map(DISCENUMS, v => `${v}_name`)
    ], v => v.replace(/\s/gu, "_").toLowerCase());
    const ATTRDISPNAMES = _.flatten([_.values(ATTRIBUTES), _.values(SKILLS), DISCIPLINES, TRACKERS]);
    // #endregion

    const isDebugging = true;

    // #region UTILITY: Debugging Decorator, Logging, Checks & String Formatting

    const log = (msg, titles, isWarn, isLoud) => {
        if (isDebugging && !LOGOPTIONS.isMuted) {
            const logTitle = LOGOPTIONS.silent ? `  ([${_.compact([titles]).join(":")}])` : `[${_.compact([titles]).join(":")}]`;
            if (isDebug && (isLoud || !LOGOPTIONS.silent))
                console[isWarn ? "warn" : "log"]([logTitle, msg].join(" "));
        }
    };
    const isBlacklisted = (attr = "") => _.filter(ATTRBLACKLIST, bannedAttr => attr.toLowerCase().includes(bannedAttr.toLowerCase())) > 0;
    // trimAttr(attr):  Removes "_flag", "_type" or "_name" suffix from a given attribute.  Returns trimmed attribute.
    const trimAttr = attr => _.isString(attr) ? attr.replace(/(_flag|_type|_name)/gu, "") : JSON.stringify(attr);
    const isIn = (needle, haystack) => {
        if (!_.isString(needle))
            return false;
        if (_.isString(haystack))
            return haystack.search(new RegExp(needle, "iu")) > -1 && haystack;
        const [ndl, hay] = [`\\b${needle}\\b`, haystack];
        const hayArray = _.isArray(hay) && _.flatten(hay) ||
                           _.isObject(hay) && _.keys(hay) ||
                           [hay];
        const index = _.findIndex(hayArray,
                                  v => v.match(new RegExp(ndl, "iu")) !== null ||
                                         v.match(new RegExp(ndl.replace(/_/gu, " "), "iu")) !== null ||
                                         v.match(new RegExp(ndl.replace(/\s/gu, "_"), "iu")) !== null ||
                                         v.match(new RegExp(ndl.replace(/(\w)(?=[A-Z])/gu, "$1 "), "iu")) !== null ||
                                         v.match(new RegExp(ndl.replace(/_/gu), "iu")) !== null ||
                                         v.match(new RegExp(ndl.replace(/\s/gu), "iu")) !== null);
        return index >= 0 && hayArray[index];
    };
    const realName = (attr, ATTRS = {}) => isIn(trimAttr(attr), ATTRDISPNAMES) ||
            isIn(ATTRS[`${trimAttr(attr)}_name`], ATTRDISPNAMES) ||
            ATTRS[`${trimAttr(attr)}_name`] ||
            trimAttr(attr);
        // getTriggers (attrs, prefix, gN, sections	): Returns "on:..." event listener string for simple attributes (in attrs) or repeating sections (in sections). RETURNS string
    const getTriggers = (attrs, prefix = "", repSecs) => {
        const triggerStrings = [];
        if (attrs)
            triggerStrings.push(_.map(attrs, v => `change:${prefix}${v}`).join(" "));
        if (repSecs && _.isArray(repSecs))
            triggerStrings.push(_.map(repSecs, v => `change:_reporder_repeating_${prefix}${v} change:repeating_${prefix}${v} remove:repeating_${prefix}${v}`).join(" "));
        else if (repSecs && _.isObject(repSecs))
            _.each(_.keys(repSecs), k => {
                triggerStrings.push(`change:_reporder_repeating_${prefix}${k} remove:repeating_${prefix}${k}`);
                _.each(repSecs[k], v => {
                    triggerStrings.push(`change:repeating_${prefix}${k}:${v}`);
                });
            });

        return _.compact(triggerStrings).join(" ");
    };
        // parseRepAttr: Given repeating attr, returns array: [sectionName, rowID, statName]
    const parseRepAttr = repAttr => [repAttr.split("_")[1], repAttr.split("_")[2], repAttr.split("_").slice(3).join("_")];
    // nFuncs(ATTRS): Provides lookup & conversion functions (pV, pI, pF) for standard ATTRS object.
    const nFuncs = (attrs) => {
        return [
            v => attrs[v],
            v => parseInt(attrs[v]),
            v => parseFloat(attrs[v])
        ];
    };
        // pFuncs(repStatName, ATTRS): Provides prefix and repeating row parsing functions (p, pV, pI).  RETURNS [prefix, p, pV, pI] OR [prefix, p] if no ATTRS value given.
    const pFuncs = (repStat, attrs) => {
        const repRowSplit = repStat.split("_").slice(0, 3);
        if (attrs)
            return [
                repRowSplit.join("_"),
                v => `${repRowSplit.join("_")}_${v || ""}`,
                v => attrs[`${repRowSplit.join("_")}_${v}`],
                v => parseInt(attrs[`${repRowSplit.join("_")}_${v}`] || 0)
            ];
        else
            return [
                repRowSplit.join("_"),
                v => `${repRowSplit.join("_")}_${v}`
            ];
    };
    const sFuncs = (sec, attrs) => {
        if (attrs)
            return [
                `repeating_${sec}`,
                v => `repeating_${sec}_${v}`,
                v => attrs[`repeating_${sec}_${v}`],
                v => parseInt(attrs[`repeating_${sec}_${v}`] || 0)
            ];
        else
            return [
                `repeating_${sec}`,
                v => `repeating_${sec}_${v}`
            ];
    };
    const simpleRepAttrs = ATTRS => {
        const newAttrs = {};
        if (_.isString(ATTRS)) {
            if (ATTRS.includes("repeating"))
                if (parseRepAttr(ATTRS)[2] && parseRepAttr(ATTRS)[2].length > 1)
                    return `♦${getRowID(ATTRS).slice(5, 10)}_${parseRepAttr(ATTRS)[2]}♦`;
                else
                    return `♦${parseRepAttr(ATTRS)[1]}♦`;
            else
                return ATTRS;
        } else {
            for (const attr of _.keys(ATTRS))
                if (attr.includes("repeating"))
                    if (parseRepAttr(attr)[2] && parseRepAttr(attr)[2].length > 1)
                        newAttrs[`♦${getRowID(attr).slice(5, 10)}_${parseRepAttr(attr)[2]}♦`] = ATTRS[attr];
                    else
                        newAttrs[`♦${parseRepAttr(attr)[1]}♦`] = ATTRS[attr];
                else
                    newAttrs[attr] = ATTRS[attr];

            return newAttrs;
        }
    };
    const getRowID = stat => parseRepAttr(stat)[1];
    const parseEInfo = eInfo => {
        if (eInfo.sourceType.toUpperCase() === "API") {
            APIROWID = getRowID(eInfo.sourceAttribute);
            return `API: ${simpleRepAttrs(eInfo.sourceAttribute)} (Row ID: ${APIROWID})`;
        } else {
            APIROWID = null;
            return `${eInfo.sourceType.toUpperCase()}: ${simpleRepAttrs(eInfo.sourceAttribute)}: ${eInfo.previousValue} >>> ${eInfo.newValue}`;
        }
    };
    // #endregion

    // #region UTILITY: Asynchronous Function Handling
    const run$ = (tasks, cback) => {
        let current = 0;
        const done = (empty, ...args) => {
            const end = () => {
                const newArgs = args ? [].concat(empty, args) : [empty];
                if (cback)
                    cback(...newArgs);
            };
            end();
        };
        const each = (empty, ...args) => {
            if (++current >= tasks.length || empty)
                done(empty, args);
            else
                tasks[current].apply(undefined, [].concat(args, each));
        };

        if (tasks.length)
            tasks[0](each);
        else
            done(null);
    };
    const $set = (attrList, cback) => {
        setAttrs(attrList, {}, () => {
            log(`>> ATTRS SET >> ${JSON.stringify(attrList)}`);
            cback(null);
        });
    };
    const $getRepAttrs = (repInfo = {}) => cback => {
        const [attrArray, $funcs] = [[], []];
        if (_.isString(repInfo)) {
            _.each(_.compact(repInfo.split(",")), v => {
                if (v.includes("repeating"))
                    attrArray.push(v);
            });
            cback(null, attrArray);
        } else {
            _.each(_.keys(repInfo), sec => {
                $funcs.push(cbk => {
                    getSectionIDs(sec, idArray => {
                        _.each(idArray, repID => {
                            _.each(repInfo[sec], stat => {
                                attrArray.push(`repeating_${sec}_${repID}_${stat}`);
                            });
                        });
                        cbk(null);
                    });
                });
            });
            run$($funcs, () => cback(null, attrArray));
        }
    };
    // #endregion

    // #region UTILITY: Date & Time Handling
    const parseDString = str => {
        if (!str || !str.match)
            return str;
        if (!str.match(/\D/gu))
            return new Date(parseInt(str));
        if (_.isString(str) && str !== "") {
            let [month, day, year] = _.compact(str.match(/([\d]+)[^\w\d]*?([\d]+)[^\w\d]*?([\d]+)|(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*[^\w\d]*?([\d]+){1,2}\w*?[^\w\d]*?(\d+)/imuy)).slice(1);                
            if (!month || !day || !year)
                return str;
            if (!["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].includes(month.toLowerCase()) && month > 12)
                [day, month] = [month, day];
            if (!["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].includes(month.toLowerCase()))
                month = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"][month - 1];
            if (`${year}`.length < 3)
                year = parseInt(year) + 2000;
            day = parseInt(day);
            return new Date([year, ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].indexOf(month.toLowerCase())+1, day]);
        }
        return str;
    };
    const isValidDString = str => {
        const dateTest = parseDString(str);
        return Boolean(str && dateTest && Object.prototype.toString.call(dateTest) === "[object Date]" && !isNaN(dateTest));
    };   
    const formatDString = date => `${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][date.getMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
    const getProgress = (todaysDate, startDate, endDate) => Math.min(1, Math.max(0,
                                                                                 (parseDString(todaysDate).getTime() - parseDString(startDate).getTime()) / (parseDString(endDate).getTime() - parseDString(startDate).getTime())
    ));

    // #endregion

    // #region ACTIVATION: Sheetworker Toggle 
    on("change:sheetworkertoggle", eInfo => {
        log("Toggling Sheetworker...");
        if (eInfo.sourceType !== "sheetworker") {
            ISOFFLINE = !ISOFFLINE;
            log(`Sheetworker: ${JSON.stringify(ISOFFLINE)}`);
            if (ISOFFLINE)
                setAttrs({sheetworkertoggle: "1"});
            else
                setAttrs({sheetworkertoggle: "0"});
        }
    });
    // #endregion

    // #region UPDATE: Clan, Discipline, Resonance, DOB/DOE, Marquee Rotating, Desires
    const $checkRituals = () => cback => {
        const attrList = {};
        const $funcs = [
            $getRepAttrs({
                discLeft: ["disc_name"],
                discMid: ["disc_name"],
                discRight: ["disc_name"]
            }),
            (attrArray, cBack) => {
                getAttrs([...["disc1_name", "disc2_name", "disc3_name"], ...attrArray], ATTRS => {
                    attrList.ceremonies_toggle = _.values(ATTRS).includes("Oblivion") ? 1 : 0;
                    attrList.rituals_toggle = _.values(ATTRS).includes("Blood Sorcery") ? 1 : 0;
                    attrList.formulae_toggle = _.values(ATTRS).includes("Alchemy") ? 1 : 0;
                    cBack(null, attrList);
                });
            },
            $set
        ];
        run$($funcs, () => cback(null));
    };
    const doClans = () => {
        const attrList = {};
        const $funcs = [
            cBack => {
                getAttrs(["clan", "bloodline", "blood_potency", "bloodline_toggle"], ATTRS => {
                    const bloodlineActive = typeof baneText[ATTRS.clan] !== "string";
                    attrList.bloodline_toggle = bloodlineActive ? 1 : 0;
                    const bText = bloodlineActive && baneText[ATTRS.clan] && (baneText[ATTRS.clan][ATTRS.bloodline] || baneText[ATTRS.clan].base) || baneText[ATTRS.clan];
                    if (bText) {
                        attrList.bane_title = bloodlineActive && `${ATTRS.bloodline} Bloodline Bane` || `${ATTRS.clan} Clan Bane`;
                        attrList.bane_text = bText.replace("Bane Severity", `Bane Severity (${
                            bpDependants[ATTRS.blood_potency].bp_baneseverity
                        })`);

                    }
                    const cDiscs = bloodlineActive && clanDiscs[ATTRS.clan] && (clanDiscs[ATTRS.clan][ATTRS.bloodline] || clanDiscs[ATTRS.clan].base) || clanDiscs[ATTRS.clan];
                    if (cDiscs)
                        for (let i = 1; i <= 3; i++)
                            if (cDiscs[i - 1] === "") {
                                attrList[`disc${i}_toggle`] = 0;
                                attrList[`disc${i}_name`] = "";
                            } else {
                                attrList[`disc${i}_toggle`] = 1;
                                attrList[`disc${i}_name`] = cDiscs[i - 1];
                            }
                                

                    cBack(null, attrList);
                });
            },
            $set,
            $checkRituals()
        ];
        run$($funcs);
    };
    const doDiscPowers = (stat) => {
        if (isBlacklisted(stat))
            return;
        const attrList = {};
        const $funcs = [
            cback => {
                getAttrs([stat], ATTRS => {
                    log(`[DODISCS ATTRS = ${JSON.stringify(ATTRS)}]`);
                    if (stat.endsWith("disc") || stat.startsWith("disc"))
                        attrList[`${stat}power_toggle`] = ATTRS[stat];
                    cback(null, attrList);
                });
            },
            $set,
            $checkRituals()
        ];
        run$($funcs);
    };
    const doResonance = () => {
        const attrList = {};
        const $funcs = [
            cback => {
                getAttrs(["resonance"], ATTRS => {
                    log(`Resonance Attrs: ${JSON.stringify(ATTRS)}`);
                    attrList.res_discs = ATTRS.resonance === "None" ? " " : `(${_.compact(RESDISCS[ATTRS.resonance]).join(", ")})`;
                    cback(null, attrList);
                });
            },
            $set
        ];
        run$($funcs);
    };
    const doDOBDOE = () => {
        const attrList = {};
        const $funcs = [
            cback => {
                getAttrs(["char_dob", "char_doe"], ATTRS => {
                    attrList.char_dobdoe = `${ATTRS.char_dob} — ${ATTRS.char_doe}`;
                    cback(null, attrList);
                });
            },
            $set
        ];
        run$($funcs);
    };
    const doMarquee = () => {
        const attrList = {};
        const $funcs = [
            cback => {
                getAttrs(["marquee_tracker"], ATTRS => {
                    let mTracker = (ATTRS.marquee_tracker || "").split(","),
                        [thisMarquee, tIndex] = [
                            [], null
                        ];
                    if (mTracker.length < 10) {
                        const newShuffle = _.shuffle(
                            _.difference(
                                _.keys(marqueeTips), mTracker
                            )
                        );
                        mTracker = _.compact([
                            ..._.shuffle(mTracker.concat(newShuffle.slice(0, 10))),
                            ...mTracker.concat(newShuffle.slice(10))
                        ]);
                    }
                    do
                        tIndex = parseInt(mTracker.shift());
                    while (tIndex === null);
                    thisMarquee = marqueeTips[tIndex];
                    attrList.marquee_tracker = mTracker.join(",");
                    attrList.marquee_lines_toggle = thisMarquee.length - 1;
                    [attrList.marquee_title] = thisMarquee;
                    attrList.marquee = thisMarquee.slice(1).join("\n");
                    cback(null, attrList);
                });
            },
            $set
        ];
        run$($funcs);
    };

    on("change:clan change:bloodline", doClans);
    on(getTriggers(DISCENUMS, "", _.keys(DISCREPREFS)), eInfo => {
        if (!isBlacklisted(eInfo.sourceAttribute))
            doDiscPowers(eInfo.sourceAttribute);
    });
    on("change:resonance", doResonance);
    on("change:char_dob change:char_doe", doDOBDOE);
    on("change:tab_core", doMarquee);
    // #endregion

    // #region UPDATE: Trackers (Health, Willpower, Blood Potency, Humanity)
    const $binCheck = (tracker) => {
        const p = v => `${tracker.toLowerCase()}_${v}`;
        const dmgBins = [
            [],
            [],
            []
        ];
        const attrList = {};
        let attrs = [];
        switch (tracker.toLowerCase()) {
            case "health":
                attrs = [..._.map([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, "max", "sdmg", "admg"], v => `health_${v}`), "incap"];
                break;
            case "willpower":
                attrs = [..._.map([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "max", "sdmg", "admg", "sdmg_social", "admg_social", "sdmg_socialtotal", "admg_socialtotal"], v => `willpower_${v}`), "incap"];
                break;
            default:
                log(`ERROR: Invalid tracker sumbitted to binCheck: ${tracker}`);

                return false;
        }

        return cback => {
            getAttrs(attrs, ATTRS => {
                const pV = v => ATTRS[p(v)];
                const pI = v => parseInt(pV(v)) || 0;
                // Activate Boxes Based on Max Stats
                const boxList = _.pick(ATTRS, (v, k) => {
                    const num = parseInt(k.split("_")[1]);

                    return !_.isNaN(num) && num <= pI("max");
                });

                // Sort Boxes According to Damage
                _.each(boxList, (dmg, box) => dmgBins[dmg].push(box));

                // Apply New Damage & Healing
                if (pI("sdmg") + pI("sdmg_social") !== 0) {
                    attrList[p("sdmg")] = pI("sdmg") + pI("sdmg_social");
                    log(`>>@@>> attrList[${p("sdmg")}] = ${attrList[p("sdmg")]}`);
                    while (attrList[p("sdmg")] > 0)
                        if (dmgBins[0].length) { // There's enough blank boxes for the superficial hit.
                            dmgBins[1].push(dmgBins[0].shift());
                            attrList[p("sdmg")]--;
                        } else if (dmgBins[1].length) { // Boxes are filled, try to upgrade to aggravated.
                            dmgBins[2].push(dmgBins[1].shift());
                            attrList[p("sdmg")]--; // All boxes are filled with Aggravated: Death.
                        } else {
                            break;
                        }

                    while (attrList[p("sdmg")] < 0) {
                        log(`>>@@>> attrList[${p("sdmg")}] = ${attrList[p("sdmg")]}`);
                        if (dmgBins[1].length) { // Superficial damage present, so heal.
                            dmgBins[0].push(dmgBins[1].pop());
                            attrList[p("sdmg")]++;
                        } else {
                            break;
                        }
                    }

                }
                if (pI("admg") + pI("admg_social") !== 0) {
                    attrList[p("admg")] = pI("admg") + pI("admg_social");
                    log(`>>@@>> attrList[${p("admg")}] = ${attrList[p("admg")]}`);
                    while (attrList[p("admg")] > 0)
                        if (dmgBins[0].length) {
                            dmgBins[2].push(dmgBins[0].shift());
                            attrList[p("admg")]--;
                        } else if (dmgBins[1].length) {
                            dmgBins[2].push(dmgBins[1].shift());
                            attrList[p("admg")]--;
                        } else {
                            break;
                        }

                    while (attrList[p("admg")] < 0) {                            
                        log(`>>@@>> attrList[${p("admg")}] = ${attrList[p("admg")]}`);
                        if (dmgBins[2].length) {
                            dmgBins[1].push(dmgBins[2].pop());
                            attrList[p("admg")]++;
                        } else {
                            break;
                        }
                    }

                }

                // Check For Incapacitation
                if (dmgBins[0].length === 0) {
                    attrList.incap = _.compact(_.uniq(_.union((ATTRS.incap || "").split(","), [tracker]))).join(",");
                    attrList[`${tracker.toLowerCase()}_impair_toggle`] = 1;
                } else {
                    attrList.incap = _.compact(_.uniq(_.difference((ATTRS.incap || "").split(","), [tracker]))).join(",");
                    attrList[`${tracker.toLowerCase()}_impair_toggle`] = 0;
                }

                // Apply Tracker Damage to Boxes
                let binNum = 0;
                _.each(dmgBins, bin => {
                    _.each(bin, box => {
                        if (parseInt(ATTRS[box]) !== binNum)
                            attrList[box] = binNum;
                    });
                    binNum++;
                });
                attrList[`${tracker.toLowerCase()}`] = dmgBins[0].length;
                attrList[`${tracker.toLowerCase()}_bashing`] = dmgBins[1].length;
                attrList[`${tracker.toLowerCase()}_aggravated`] = dmgBins[2].length;

                    
                // Set sdmg/admg scores to zero.
                attrList[p("sdmg")] = 0;
                attrList[p("admg")] = 0;

                // IF Willpower, add/subtract social damage to totals, and set socials to zero:
                if (tracker.toLowerCase() === "willpower") {
                    attrList[p("sdmg_socialtotal")] = pI("sdmg_socialtotal") + pI("sdmg_social");
                    attrList[p("admg_socialtotal")] = pI("admg_socialtotal") + pI("admg_social");
                    attrList[p("sdmg_social")] = 0;
                    attrList[p("admg_social")] = 0;
                }
                    
                log(JSON.stringify(attrList));

                cback(null, attrList);
            });
        };
    };
    const doTracker = (tracker, eInfo = {sourceAttribute: ""}, cback) => {
        const attrList = {};
        const $funcs = [];
        switch (tracker.toLowerCase()) {
            case "health":
            case "willpower":
                $funcs.push($binCheck(tracker));
                break;
            case "blood potency full":
            case "blood potency": {
                $funcs.push(cbk => {
                    getAttrs(["clan", "blood_potency"], ATTRS => {
                        _.each(bpDependants[ATTRS.blood_potency], (v, k) => {
                            attrList[k] = v;
                        });
                        attrList.bp_surgetext =
                                attrList.bp_surge === 0 ?
                                    "None" :
                                    `+${attrList.bp_surge === 1 ?
                                        `${attrList.bp_surge} Die` :
                                        `${attrList.bp_surge} Dice`}`;
                        attrList.bp_mendtext =
                                attrList.bp_mend === 0 ?
                                    "None" :
                                    `${
                                        attrList.bp_mend
                                    } Superficial`;
                        attrList.bp_discbonustext =
                                attrList.bp_discbonus === 0 ?
                                    "None" :
                                    `+${
                                        attrList.bp_discbonus === 1 ?
                                            `${
                                                attrList.bp_discbonus
                                            } Die` :
                                            `${
                                                attrList.bp_discbonus
                                            } Dice`
                                    }${
                                        [
                                            ";  Never Rouse x2.",
                                            ";  Rouse x2 for Level 1.",
                                            ";  Rouse x2 for Levels 1 & 2.",
                                            ";  Rouse x2 for Levels 1, 2, 3.",
                                            ";  Rouse x2 for Levels 1 - 4.",
                                            ";  Rouse x2 for All Levels."
                                        ][
                                            attrList.bp_rousereroll
                                        ]
                                    }`;
                        attrList.bp_slakebag = attrList.bp_slakeanimal;
                        attrList.bp_slaketext = `Animals & bagged blood slake ${
                            {0: "no", 0.5: "half", 1: "full"}[attrList.bp_slakeanimal]
                        } Hunger.\n${
                            attrList.bp_slakehuman === 0 ?
                                "Humans slake full Hunger.\n" :
                                `${attrList.bp_slakehuman} Hunger slaked from humans.\n`
                        }Must kill to reduce Hunger below ${attrList.bp_slakekill}.`;
                        cbk(null, attrList);
                    });
                });
                break;
            }
            case "humanity":
                $funcs.push(cbk => {
                    if (eInfo.sourceType !== "sheetworker") {
                        const attrArray = _.map([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], v => `humanity_${v}`);
                        const humArray = new Array(10);
                        getAttrs(["stains", "humanity", "incap"], ATTRS => {
                            const humanity = Math.min(10, Math.max(0, parseInt(ATTRS.humanity)));
                            const stains = Math.min(10, Math.max(0, parseInt(ATTRS.stains)));
                            attrList.humanity_impair_toggle = 0;
                            log(`... Humanity: ${JSON.stringify(humanity)}, Stains: ${JSON.stringify(stains)}, ATTRS: ${JSON.stringify(ATTRS)}`);
                            humArray.fill(3, 10 - stains);
                            humArray.fill(2, 0, Math.max(humanity, 0));
                            humArray.fill(1, humanity, 10 - stains);
                            log(`... humArray: ${JSON.stringify(humArray)}`);
                            log(`... attrArray: ${JSON.stringify(attrArray)}`);
                            log(`... attrArray[4]: ${JSON.stringify(attrArray[4])}`);
                            for (let i = 0; i < humArray.length; i++)
                                attrList[attrArray[i]] = humArray[i];
                                
                            attrList.stains = humArray.filter(v => v === 3).length;
                            log(`... attrList: ${JSON.stringify(attrList)}`);
                            // humanity, hum_details, hum_posbullets_toggle, hum_posbullets, neutralbullets, negbullets
                            log(`... humText: ${JSON.stringify(humanityText.mainText)}`);
                            log(`... humDetails (humText[${JSON.stringify(humanity)}]): ${JSON.stringify(humanityText.mainText[humanity])}`);
                            attrList.hum_details = humanityText.mainText[humanity];
                            for (const bulletType of ["pos", "neutral", "neg"]) {
                                log(`... ${bulletType}: : ${JSON.stringify(humanityText.bulletText[bulletType][humanity])}`);
                                attrList[`hum_${bulletType}bullets`] = humanityText.bulletText[bulletType][humanity].join("\n");
                                attrList[`hum_${bulletType}bullets_toggle`] = humanityText.bulletText[bulletType][humanity].length;
                            }
                            attrList.hum_torportext = humanityText.torporText[humanity].join("\n");
                            attrList.hum_torportext_toggle = humanityText.torporText[humanity].length;

                            if (attrList.humanity_impair_toggle === 1)
                                attrList.incap = _.compact(_.uniq(_.union((ATTRS.incap || "").split(","), ["Humanity"]))).join(",");
                            else
                                attrList.incap = _.compact(_.uniq(_.difference((ATTRS.incap || "").split(","), ["Humanity"]))).join(",");


                            log(`... attrList: ${JSON.stringify(attrList)}`);

                            cbk(null, attrList);
                        });
                    }
                });
                break;
            case "stains":
                $funcs.push(cbk => {
                    if (eInfo.sourceType !== "sheetworker") {
                        const attrArray = _.map([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], v => `humanity_${v}`);
                        const humArray = new Array(10);
                        getAttrs(["humanity", "stains", "incap"], ATTRS => {
                            const humanity = Math.min(10, Math.max(0, parseInt(ATTRS.humanity)));
                            const stains = Math.min(10, Math.max(0, parseInt(ATTRS.stains)));
                            attrList.humanity_impair_toggle = 0;
                            log(`... Humanity: ${JSON.stringify(humanity)}, Stains: ${JSON.stringify(stains)}, ATTRS: ${JSON.stringify(ATTRS)}`);
                            if (humanity + stains > 10) {
                                attrList.humanity_impair_toggle = 1;
                                humArray.fill(4);
                                humArray.fill(3, humanity);
                                humArray.fill(2, 0, 10 - stains);
                            } else {
                                humArray.fill(1);
                                humArray.fill(2, 0, humanity);
                                humArray.fill(3, 10 - stains);
                            }
                            log(`... humArray: ${JSON.stringify(humArray)}`);
                            for (let i = 0; i < humArray.length; i++)
                                attrList[attrArray[i]] = humArray[i];

                            log(`... attrList: ${JSON.stringify(attrList)}`);
                            if (attrList.humanity_impair_toggle === 1)
                                attrList.incap = _.compact(_.uniq(_.union((ATTRS.incap || "").split(","), ["Humanity"]))).join(",");
                            else
                                attrList.incap = _.compact(_.uniq(_.difference((ATTRS.incap || "").split(","), ["Humanity"]))).join(",");
                            cbk(null, attrList);
                        });
                    }
                });
                break;
            default:
                log(`Error in doTracker(${tracker}, ): Unrecognized tracker.`);
                return;
        }
        $funcs.push($set);
        $funcs.push($doRolls(eInfo.sourceAttribute));
        run$($funcs, cback ? () => cback(null) : undefined);
    };
    const $doTracker = (tracker, eInfo) => cback => doTracker(tracker, eInfo, cback);
    const doTrackerMax = (tracker, eInfo) => {
        const attrList = {};
        const $funcs = [];
        switch (tracker.toLowerCase()) {
            case "health":
                $funcs.push(cback => {
                    getAttrs(["stamina", "bonus_health"], ATTRS => {
                        attrList.health_max = Math.min(
                            15,
                            Math.max(
                                1,
                                _.reduce(_.values(ATTRS), (memo, num) => parseInt(memo) + parseInt(num)) + 3
                            )
                        );
                        cback(null, attrList);
                    });
                });
                break;
            case "willpower":
                $funcs.push(cback => {
                    getAttrs(["composure", "resolve", "bonus_willpower"], ATTRS => {
                        attrList.willpower_max =
                                Math.min(
                                    10,
                                    Math.max(
                                        1,
                                        _.reduce(_.values(ATTRS), (memo, num) => parseInt(memo) + parseInt(num))
                                    )
                                );
                        cback(null, attrList);
                    });
                });
                break;                        
            case "blood potency full":
            case "blood potency":
                $funcs.push(cback => {
                    getAttrs(["generation", "bonus_bp", "blood_potency"], ATTRS => {
                        const genData = _.isNaN(parseInt(ATTRS.generation)) && {blood_potency_max: 0, blood_potency: 0} || genDepts[parseInt(ATTRS.generation)];
                        attrList.blood_potency_max = Math.min(10, Math.max(0, genData.blood_potency_max + parseInt(ATTRS.bonus_bp)));
                        const bp = parseInt(ATTRS.blood_potency);
                        if (tracker === "Blood Potency Full" && (bp < genData.blood_potency || bp > genData.blood_potency_max))
                            attrList.blood_potency = bp < genData.blood_potency && genData.blood_potency || genData.blood_potency_max;    
                        cback(null, attrList);
                    });
                });
                break;
            default:
                log(`ERROR: Unrecognized Tracker Type ${tracker}`);

                return;
        }

        $funcs.push($set);
        $funcs.push($doTracker(tracker, eInfo));

        run$($funcs);
    };
    const healSocialWP = (cback) => {
        const attrList = {};
        const $funcs = [
            cbk => {
                getAttrs(["willpower_sdmg_socialtotal", "willpower_admg_socialtotal", "willpower_social_toggle"], ATTRS => {
                    attrList.willpower_sdmg = -1 * Math.floor(0.5 * parseInt(ATTRS.willpower_sdmg_socialtotal) || 0);
                    attrList.willpower_admg = -1 * Math.floor(0.5 * parseInt(ATTRS.willpower_admg_socialtotal) || 0);
                    attrList.willpower_sdmg_socialtotal = 0;
                    attrList.willpower_admg_socialtotal = 0;
                    attrList.willpower_social_toggle = "off";                            
                    cbk(null, attrList);
                });
            },
            $set,
            $doTracker("willpower")
        ];
        run$($funcs, cback ? () => cback(null) : undefined);            
    };

    on("change:stamina change:bonus_health", () => {
        doTrackerMax("Health");
    });
    on("change:composure change:resolve change:bonus_willpower", () => {
        doTrackerMax("Willpower");
    });
    on("change:generation change:bonus_bp", () => {
        doTrackerMax("Blood Potency Full");
    });
    on(getTriggers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, "sdmg", "admg"], "health_"), eInfo => {
        if (eInfo.sourceType !== "api" || ["health_sdmg", "health_admg"].includes(eInfo.sourceAttribute))
            doTracker("Health", eInfo);
    });
    on(getTriggers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "sdmg", "admg", "sdmg_social", "admg_social"], "willpower_"), eInfo => {
        if (eInfo.sourceType !== "api" || ["willpower_sdmg", "willpower_admg", "willpower_sdmg_social", "willpower_admg_social"].includes(eInfo.sourceAttribute))
            doTracker("Willpower", eInfo);
    });
    on("change:blood_potency", eInfo => {
        doTracker("Blood Potency", eInfo);
        doClans();
    });
    on("change:humanity", eInfo => {
        if (!ISOFFLINE && eInfo.sourceType !== "sheetworker")
            doTracker("Humanity", eInfo);
    });
    on("change:stains", eInfo => {
        if (!ISOFFLINE && eInfo.sourceType !== "sheetworker")
            doTracker("Stains", eInfo);
    });
    on("change:willpower_social_toggle", eInfo => {
        if (!ISOFFLINE && eInfo.sourceType !== "sheetworker")
            healSocialWP();
    });
    // #endregion

    // #region UPDATE: Projects

    // Updating project end date when date values are changed.
    const doProjectDates = callback => {
        const attrList = {};
        const attrArray = _.map([
            "projectstartdate", "projectincnum", "projectincunit"
        ], v => `repeating_project_${v}`);
        const funcName = "doProjectDates";
        const getEndDate = (start, incUnit, incNum) => {
            const end = new Date(start);
            // log(`EndDate: ${JSON.stringify(end)}`, "DoProjectDates >>> GetEndDate")
            switch (incUnit) {
                case "hours":
                    return new Date(end.setUTCHours(start.getUTCHours() + 10 * incNum));
                case "days":
                    return new Date(end.setUTCDate(start.getUTCDate() + 10 * incNum));
                case "weeks":
                    return new Date(end.setUTCDate(start.getUTCDate() + 10 * 7 * incNum));
                case "months":
                    return new Date(end.setUTCMonth(start.getMonth() + 10 * incNum));
                case "years":
                    return new Date(end.setUTCFullYear(start.getUTCFullYear() + 10 * incNum));
                default:
                    log(`ERROR: Invalid time unit for project incrementor: ${JSON.stringify(incUnit)}`);
                    return false;
            }
        };
        log("", `████ ${funcName.toUpperCase()} CALLED ████`);
        getAttrs([...attrArray, "date_today"], ATTRS => {
            // const [, p, pV, pI] = pFuncs(_.keys(ATTRS)[0], ATTRS),
            const [, p, pV, pI] = sFuncs("project", ATTRS);
            const curDate = new Date(parseDString(ATTRS.date_today));
            log(`Retrieved Attributes: ${JSON.stringify(simpleRepAttrs(ATTRS))}`, funcName);
            let startDate = null;
            if (pV("projectstartdate")) {
                startDate = new Date(parseDString(pV("projectstartdate")));
                // log(`Parsing Start Date "${pV("projectstartdate")}": ${JSON.stringify(startDate)}`, funcName)
            } else {
                startDate = new Date(curDate);
                attrList[p("projectstartdate")] = formatDString(startDate);
            }
            if (!curDate || pI("projectincnum") === 0 || !["hours", "days", "weeks", "months", "years"].includes(pV("projectincunit")))
                attrList[p("projectenddate")] = "";
            else
                attrList[p("projectenddate")] = formatDString(getEndDate(startDate, pV("projectincunit"), pI("projectincnum")));
            setAttrs(attrList, {}, () => {
                log(`Setting Attributes: ${JSON.stringify(simpleRepAttrs(attrList))}`, funcName);
                if (callback)
                    callback(null);
            });
        });
    };
        // Updating launch roll difficulty display upon change to scope or difficulty.
    const doProjectDiff = callback => {
        const attrList = {};
        const attrArray = _.map([
            "projectscope", "projectlaunchmod", "projectlaunchdiffmod", ..._.flatten(_.map([1, 2, 3], v => [`projectteamwork${v}`]))
        ], v => `repeating_project_${v}`);
        const funcName = "DoProjectDiff";
        log("", `████ ${funcName.toUpperCase()} CALLED ████`);
        getAttrs(attrArray, ATTRS => {
            const [, p, , pI] = sFuncs("project", ATTRS);
            let teamwork = [0, 0];
            log(`Retrieved Attributes: ${JSON.stringify(simpleRepAttrs(ATTRS))}`, funcName);
            _.each(_.map([1, 2, 3], v => `projectteamwork${v}`), stat => {
                teamwork += pI(stat);
            });
            attrList[p("projectforcedstakemod")] = teamwork;
            if (attrList[p("projectforcedstakemod")] > 0)
                attrList[p("projectforcedstakemodline")] = `+${attrList[p("projectforcedstakemod")]}`;
            else
                attrList[p("projectforcedstakemodline")] = "";
            attrList[p("projectlaunchdiff")] = pI("projectscope") + 2 + pI("projectlaunchdiffmod");
            setAttrs(attrList, {}, () => {
                log(`Setting Attributes: ${JSON.stringify(simpleRepAttrs(attrList))}`, funcName);
                if (callback)
                    callback(null);
            });
        });
    };
        // Check whether to display Launch Project button.
    const doProjectLaunchCheck = callback => {
        const attrList = {};
        const attrArray = _.map([
            "projectlaunchmod", "projectlaunchtrait1_name", "projectlaunchtrait1", "projectlaunchtrait2_name", "projectlaunchtrait2", "projectlaunchresults", "projectenddate"
        ], v => `repeating_project_${v}`);
        const funcName = "DoProjectLaunchCheck";
        log("", `████ ${funcName.toUpperCase()} CALLED ████`);
        getAttrs(attrArray, ATTRS => {
            const [, p, pV, pI] = sFuncs("project", ATTRS);
            const traits = _.map(["projectlaunchtrait1", "projectlaunchtrait2"], v => ({name: pV(`${v}_name`), value: pI(v)}));
            const launchTrtCheck = [];
            log(`Retrieved Attributes: ${JSON.stringify(simpleRepAttrs(ATTRS))}`, funcName);
            if (pV("projectenddate") === "") {
                attrList[p("projectlaunchroll_toggle")] = 0;
            } else if (pV("projectlaunchresults") && (pV("projectlaunchresults").includes("SUCCESS") || pV("projectlaunchresults").includes("COMPLICATION") || pV("projectlaunchresults").includes("CRITICAL") || pV("projectlaunchresults").includes("TOTAL"))) {
                attrList[p("projectlaunchroll_toggle")] = 2;
            } else {
                _.each(traits, trt => {
                    if (trt.name && trt.name !== "")
                        launchTrtCheck.push(trt.value > 0);
                    else if (trt.value > 0)
                        launchTrtCheck.push(false);
                });
                if (launchTrtCheck.includes(true) && !launchTrtCheck.includes(false))
                    attrList[p("projectlaunchroll_toggle")] = 1;
                else
                    attrList[p("projectlaunchroll_toggle")] = 0;
            }
            setAttrs(attrList, {}, () => {
                log(`Setting Attributes: ${JSON.stringify(simpleRepAttrs(attrList))}`, funcName);
                if (callback)
                    callback(null);
            });
        });
    };
        // Updates the project counter when the time changes.
    const doProjectCounter = callback => {
        const [attrList, attrArray] = [{}, []];
        const funcName = "DoProjectCounter";
        log("", `████ ${funcName.toUpperCase()} CALLED ████`);
        getSectionIDs("project", idArray => {
            _.each(idArray, repID => {
                _.each(["projectlaunchroll_toggle", "projecttotalstake", "projectstake1", "projectstake2", "projectstake3", "projectstartdate", "projectenddate", "projectinccounter", "projectlaunchroll_toggle", "projectlaunchresults"], stat => {
                    attrArray.push(`repeating_project_${repID}_${stat}`);
                });
            }); // const 
            getAttrs([...attrArray, "date_today"], ATTRS => {
                const ids = _.uniq(_.map(attrArray, v => parseRepAttr(v)[1]));
                // log(`Retrieved Attributes: ${JSON.stringify(simpleRepAttrs(ATTRS))}`, funcName)
                // log(`Retrieved IDs: ${JSON.stringify(simpleRepAttrs(ids))}`, funcName)
                _.each(ids, rowID => {
                    const [, p, pV, pI] = pFuncs(`repeating_project_${rowID}`, ATTRS);
                    let counterPos = 11;
                    // log(`p-Test: p("projectinccounter) = ${JSON.stringify(p("projectinccounter"))}`, funcName)
                    const stakeRemaining = Math.max(0, pI("projecttotalstake")) - _.reduce(_.map([1, 2, 3], v => pI(`projectstake${v}`)), (memo, num) => parseInt(memo) + parseInt(num));
                    if (stakeRemaining === 0 && pV("projectlaunchresults") && (pV("projectlaunchresults").includes("SUCCESS") || pV("projectlaunchresults").includes("COMPLICATION") || pV("projectlaunchresults").includes("CRITICAL")))
                        counterPos = 10 - Math.floor(10 * getProgress(
                            new Date(parseInt(ATTRS.date_today)), pV("projectstartdate"), pV("projectenddate")
                        ));
                    if (counterPos === 0 && pI("projectlaunchroll_toggle") !== 3)
                        attrList[p("projectlaunchroll_toggle")] = 3;
                    else if (counterPos !== 0 && pI("projectlaunchroll_toggle") === 3)
                        attrList[p("projectlaunchroll_toggle")] = 2;
                    if (counterPos !== pI("projectinccounter"))
                        attrList[p("projectinccounter")] = counterPos;

                });
                setAttrs(attrList, {}, () => {
                    log(`Setting Attributes: ${JSON.stringify(simpleRepAttrs(attrList))}`, funcName);
                    if (_.isFunction(callback))
                        callback(null);
                });
            });
        });
    };
    const doProjectStake = callback => {
        const attrList = {};
        const attrArray = _.map([
            "projectlaunchresults", ..._.map([1, 2, 3, 4, 5, 6], v => `projectstake${v}`), "projecttotalstake"
        ], v => `repeating_project_${v}`);
        const funcName = "DoProjectStake";
        log("", `████ ${funcName.toUpperCase()} CALLED ████`);
        getAttrs(attrArray, ATTRS => {
            const [, p, pV, pI] = sFuncs("project", ATTRS);
            log(`Retrieved Attributes: ${JSON.stringify(simpleRepAttrs(ATTRS))}`, funcName);
            let stakeRemaining = 0;
            if (pV("projectlaunchresults") && (pV("projectlaunchresults").includes("SUCCESS") || pV("projectlaunchresults").includes("COMPLICATION"))) {
                attrList[p("projectstakes_toggle")] = 1;
                stakeRemaining = Math.max(0, pI("projecttotalstake")) - _.reduce(_.map([1, 2, 3, 4, 5, 6], v => pI(`projectstake${v}`)), (memo, num) => parseInt(memo) + parseInt(num));
                if (stakeRemaining > 0)
                    attrList[p("projectlaunchresultsmargin")] = `Stake ${pV("projecttotalstake")} Dot${pI("projecttotalstake") > 1 ? "s" : ""} (${stakeRemaining} to go)`;
                else
                    attrList[p("projectlaunchresultsmargin")] = `${pV("projecttotalstake")} Dot${pI("projecttotalstake") > 1 ? "s" : ""} Staked`;
            }
                
            setAttrs(attrList, {}, () => {
                log(`Setting Attributes: ${JSON.stringify(simpleRepAttrs(attrList))}`, funcName);
                doProjectCounter(callback);
            });
        });
    };
    const doProjectLaunchParams = eInfo => {
        return callback => {
            const attrList = {};
            const attrArray = _.map([
                "projectlaunchdiff", "projectforcedstakemod", ..._.map([1, 2, 3], v => `projectteamwork${v}`), "projectlaunchmod", "projectlaunchdiffmod", "projectlaunchtrait1_name", "projectlaunchtrait1", "projectlaunchtrait2_name", "projectlaunchtrait2"
            ], v => `repeating_project_${v}`);
            const funcName = "DoProjectLaunchParams";
            log("", `████ ${funcName.toUpperCase()} CALLED ████`);
            log(`Attr Array: ${JSON.stringify(attrArray)}`, funcName);
            getAttrs(attrArray, ATTRS => {
                const [, p, pV, pI] = sFuncs("project", ATTRS);
                const traits = _.map(["projectlaunchtrait1", "projectlaunchtrait2"], v => ({name: pV(`${v}_name`), value: pI(v)}));
                let traitString = "";
                log(`Retrieved Attributes: ${JSON.stringify(simpleRepAttrs(ATTRS))}`, funcName);
                if (traits[0].name !== "" && traits[0].value > 0 ||
                        traits[1].name !== "" && traits[1].value > 0) {
                    traitString = [_.values(traits[0]).join(":"), _.values(traits[1]).join(":")].join(",");
                    attrList[p("projectlaunchrollparams")] = `@{character_name}|${traitString}|${pI("projectlaunchdiff")}|${pI("projectlaunchmod") + pI("projectforcedstakemod")}|${pI("projectlaunchdiffmod")}|${getRowID(eInfo.sourceAttribute)}`;
                }
                setAttrs(attrList, {}, () => {
                    log(`Setting Attributes: ${JSON.stringify(simpleRepAttrs(attrList))}`, funcName);
                    if (callback)
                        callback(null);
                });
            });
        };
    };
    const doObjectiveRecord = rowID => {
        return callback => {
            const attrList = {};
            const attrArray = ["triggertimelinesort", ..._.map([
                "objectivedate", "projectgoal", "projectdetails", "projectscope_name"
            ], v => `repeating_project_${rowID}_${v}`)];
            const newRowID = generateRowID();
            const funcName = "doObjectiveRecord";
            log("", `████ ${funcName.toUpperCase()} CALLED ████`);
            getAttrs(attrArray, ATTRS => {
                const [, p, pV] = pFuncs(_.keys(ATTRS)[1], ATTRS);
                const [, np] = pFuncs(`repeating_timeline_${newRowID}_stat`);
                log(`Retrieved Attributes: ${JSON.stringify(simpleRepAttrs(ATTRS))}`, funcName);
                log(`pV("objectivedate") = ${JSON.stringify(pV("objectivedate"))}`);
                log(`p("objectivedate") = ${JSON.stringify(p("objectivedate"))}`);
                log(`All Attrs: ${JSON.stringify(ATTRS)}`);
                attrList[np("tlstartdate")] = pV("objectivedate");
                attrList[np("tlenddate")] = "";
                attrList[np("tldetails")] = pV("projectdetails");
                attrList[np("tlcategory")] = "OBJECTIVE";
                attrList[np("tldotdisplay")] = "";
                attrList[np("tltitle")] = pV("projectscope_name");
                attrList[np("tlsummary")] = pV("projectgoal");
                attrList[np("tlsortby")] = parseDString(pV("objectivedate")).getTime();
                attrList.triggertimelinesort = ATTRS.triggertimelinesort === "yes" ? "go" : "yes";
                setAttrs(attrList, {}, () => {
                    log(`Setting Attributes: ${JSON.stringify(simpleRepAttrs(attrList))}`, funcName);
                    if (callback)
                        callback(null);
                });
            });
        };
    };
    const doProjectRecord = rowID => {
        return callback => {
            const attrList = {};
            const attrArray = ["triggertimelinesort", ..._.map([
                "projectstartdate", "projectenddate", "projectgoal", "projectscope", "projectdetails", "projectlaunchresults", "projectscope_name", "projectlaunchtrait1_name", "projectlaunchtrait1", "projectlaunchtrait2_name", "projectlaunchtrait2"
            ], v => `repeating_project_${rowID}_${v}`)];
            const newRowID = generateRowID();
            const funcName = "doProjectRecord";
            log("", `████ ${funcName.toUpperCase()} CALLED ████`);
            getAttrs(attrArray, ATTRS => {
                const [, , pV, pI] = pFuncs(_.keys(ATTRS)[1], ATTRS);
                const [, np] = pFuncs(`repeating_timeline_${newRowID}_stat`);
                log(`Retrieved Attributes: ${JSON.stringify(simpleRepAttrs(ATTRS))}`, funcName);
                attrList[np("tlstartdate")] = pV("projectstartdate");
                attrList[np("tlenddate")] = `— ${pV("projectenddate")}`;
                attrList[np("tldetails")] = pV("projectdetails");
                attrList[np("tlcategory")] = "PROJECT";
                attrList[np("tldotdisplay")] = pI("projectscope") > 0 ? "●".repeat(pI("projectscope")) : "Ꝋ";
                attrList[np("tltitle")] = pV("projectscope_name");
                attrList[np("tlsummary")] = pV("projectgoal");
                attrList[np("tlsortby")] = parseDString(pV("projectenddate")).getTime();
                attrList.triggertimelinesort = ATTRS.triggertimelinesort === "yes" ? "go" : "yes";
                setAttrs(attrList, {}, () => {
                    log(`Setting Attributes: ${JSON.stringify(simpleRepAttrs(attrList))}`, funcName);
                    if (callback)
                        callback(null);
                });
            });
        };
    };
    const doMemoriamRecord = rowID => {
        return callback => {
            const attrList = {};
            const attrArray = ["triggertimelinesort", ..._.map([
                "memoriamdate", "projectgoal", "projectdetails", "projectscope_name", "memoriamdiff", "memoriamresult"
            ], v => `repeating_project_${rowID}_${v}`)];
            const newRowID = generateRowID();
            const funcName = "doMemoriamRecord";
            log("", `████ ${funcName.toUpperCase()} CALLED ████`);
            getAttrs(attrArray, ATTRS => {
                const [, , pV, pI] = pFuncs(_.keys(ATTRS)[1], ATTRS);
                const [, np] = pFuncs(`repeating_timeline_${newRowID}_stat`);
                log(`Retrieved Attributes: ${JSON.stringify(simpleRepAttrs(ATTRS))}`, funcName);
                attrList[np("tlstartdate")] = pV("memoriamdate");
                attrList[np("tlenddate")] = "";
                attrList[np("tldetails")] = pV("projectdetails");
                attrList[np("tlcategory")] = "MEMORIAM";
                attrList[np("tldotdisplay")] = pI("memoriamdiff") > 0 ? "●".repeat(pI("memoriamdiff")) : "Ꝋ";
                attrList[np("tltitle")] = pV("projectscope_name");
                attrList[np("tlsummary")] = pV("projectgoal");
                attrList[np("tlsortby")] = parseDString(pV("memoriamdate")).getTime();
                attrList[np("tlthirdline")] = pV("memoriamresult");
                attrList[np("tlthirdline_toggle")] = 1;
                attrList.triggertimelinesort = ATTRS.triggertimelinesort === "yes" ? "go" : "yes";
                setAttrs(attrList, {}, () => {
                    log(`Setting Attributes: ${JSON.stringify(simpleRepAttrs(attrList))}`, funcName);
                    if (callback)
                        callback(null);
                });
            });
        };
    };               
    const doEventRecord = rowID => {
        return callback => {
            const attrList = {};
            const attrArray = ["triggertimelinesort", ..._.map([
                "eventdate", "projectgoal", "projectdetails", "projectscope_name"
            ], v => `repeating_project_${rowID}_${v}`)];
            const newRowID = generateRowID();
            const funcName = "doEventRecord";
            log("", `████ ${funcName.toUpperCase()} CALLED ████`);
            getAttrs(attrArray, ATTRS => {
                const [, , pV] = pFuncs(_.keys(ATTRS)[1], ATTRS);
                const [, np] = pFuncs(`repeating_timeline_${newRowID}_stat`);
                log(`Retrieved Attributes: ${JSON.stringify(simpleRepAttrs(ATTRS))}`, funcName);
                attrList[np("tlstartdate")] = pV("eventdate");
                attrList[np("tlenddate")] = "";
                attrList[np("tldetails")] = pV("projectdetails");
                attrList[np("tlcategory")] = "EVENT";
                attrList[np("tldotdisplay")] = "";
                attrList[np("tltitle")] = pV("projectscope_name");
                attrList[np("tlsummary")] = pV("projectgoal");
                attrList[np("tlsortby")] = parseDString(pV("eventdate")).getTime();
                attrList.triggertimelinesort = ATTRS.triggertimelinesort === "yes" ? "go" : "yes";
                setAttrs(attrList, {}, () => {
                    log(`Setting Attributes: ${JSON.stringify(simpleRepAttrs(attrList))}`, funcName);
                    if (callback)
                        callback(null);
                });
            });
        };
    };

    on("change:date_today", doProjectCounter);
    on(getTriggers(null, "", {project: ["projectstartdate", "projectincnum", "projectincunit"]}), eInfo => {
        if (eInfo.sourceType !== "sheetworker") {
            console.log("[‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗]");
            log(`(Dates, LCheck, LParams) ${parseEInfo(eInfo)}`, "DO PROJECT EVENT");
            run$([doProjectDates, doProjectLaunchCheck, doProjectLaunchParams(eInfo)], () => {
                console.log("[‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾]");
            });
        }
    });
    on(getTriggers(null, "", {project: ["projectscope", "projectlaunchmod", "projectlaunchdiffmod", ..._.flatten(_.map([1, 2, 3], v => [`projectteamwork${v}`]))]}), eInfo => {
        if (eInfo.sourceType !== "sheetworker") {
            console.log("[‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗]");
            log(`(Diff, LCheck, LParams) ${parseEInfo(eInfo)}`, "DO PROJECT EVENT");
            run$([doProjectDiff, doProjectLaunchCheck, doProjectLaunchParams(eInfo)], () => {
                console.log("[‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾]");
            });
        }
    });
    on(getTriggers(null, "", {project: ["projectlaunchtrait1", "projectlaunchtrait1_name", "projectlaunchtrait2", "projectlaunchtrait2_name"]}), eInfo => {
        if (eInfo.sourceType !== "sheetworker") {
            console.log("[‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗]");
            log(`(LCheck, LParams) ${parseEInfo(eInfo)}`, "DO PROJECT EVENT");
            run$([doProjectLaunchCheck, doProjectLaunchParams(eInfo)], () => {
                console.log("[‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾]");
            });
        }
    });
    on(getTriggers(null, "", {project: ["projectlaunchresults"]}), eInfo => {
        if (eInfo.sourceType !== "sheetworker") {
            console.log("[‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗]");
            log(`(Diff, LCheck, LParams, Stake, Counter) ${parseEInfo(eInfo)}`, "DO PROJECT EVENT");
            run$([doProjectDiff, doProjectLaunchCheck, doProjectLaunchParams(eInfo), doProjectStake, doProjectCounter], () => {
                console.log("[‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾]");
            });
        }
    });
    on(getTriggers(null, "", {project: _.flatten(_.map([1, 2, 3, 4, 5, 6], v => [`projectstake${v}`, `projectstake${v}_name`]))}), eInfo => {
        if (eInfo.sourceType !== "sheetworker") {
            console.log("[‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗]");
            log(`(Stake) ${parseEInfo(eInfo)}`, "DO PROJECT EVENT");
            run$([doProjectStake], () => {
                console.log("[‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾]");
            });
        }
    });
    on("change:repeating_project:schemetypeobj_toggle change:repeating_project:schemetypeproj_toggle change:repeating_project:schemetypemem_toggle change:repeating_project:schemetypeevent_toggle", (eInfo) =>{
        log("", `████ CHANGE DETECTED: SCHEMETYPE_TOGGLE ████<br>${JSON.stringify(eInfo)}`);
        setAttrs({
            repeating_project_schemetype: eInfo.newValue,
            repeating_project_schemetypeobj_toggle: eInfo.newValue,
            repeating_project_schemetypeproj_toggle: eInfo.newValue,
            repeating_project_schemetypemem_toggle: eInfo.newValue,
            repeating_project_schemetypeevent_toggle: eInfo.newValue
        });
        // doSchemeSelection()
    });

    on("change:repeating_project:objectivedate", (eInfo) => {
        if (eInfo.sourceType !== "sheetworker") {
            log("", `████ CHANGE DETECTED: OBJECTIVEDATE ████<br>${JSON.stringify(eInfo)}`);
            if (isValidDString(eInfo.newValue)) {
                log("", `Valid DString: ${eInfo.newValue}`);
                setAttrs({"repeating_project_archiveobjective_toggle": 1});
            } else {
                log("", `Invalid DString: ${JSON.stringify(eInfo)}`);
                setAttrs({"repeating_project_archiveobjective_toggle": 0});
            }
        }
    }); 

    on("change:repeating_project:memoriamdate change:repeating_project:memoriamresult", (eInfo) => {
        if (eInfo.sourceType !== "sheetworker") {
            log("", "████ CHANGE DETECTED: MEMORIAMDATE/RESULT ████");
            getAttrs(["repeating_project_memoriamresult", "repeating_project_memoriamdate"], ATTRS => {
                log(`Retrieved Attributes: ${JSON.stringify(simpleRepAttrs(ATTRS))}`);
                if (isValidDString(ATTRS.repeating_project_memoriamdate) && !_.isEmpty((ATTRS.repeating_project_memoriamresult && ATTRS.repeating_project_memoriamresult || "").toString().trim())) {
                    log("", `Valid DString: ${ATTRS.repeating_project_memoriamdate} and Results: ${ATTRS.repeating_project_memoriamresult}`);
                    setAttrs({"repeating_project_archivememoriam_toggle": 1});
                } else {
                    log("", `Invalid DString: ${ATTRS.repeating_project_memoriamdate} OR Results: ${ATTRS.repeating_project_memoriamresult}`);
                    setAttrs({"repeating_project_archivememoriam_toggle": 0});
                }
            });
        }
    });

    on("change:repeating_project:memoriamdiff", (eInfo) => {
        if (eInfo.sourceType !== "sheetworker") {
            log("", "████ CHANGE DETECTED: MEMORIAMDIFF ████");
            getAttrs(["repeating_project_memoriamdiff"], ATTRS => {
                log(`Retrieved Attributes: ${JSON.stringify(ATTRS)}`);
                const attrList = {
                    repeating_project_memoriamrewards:
                    parseInt(ATTRS.repeating_project_memoriamdiff) === 0 && "(Set the difficulty to see which rewards you can choose from.)" ||
                    parseInt(ATTRS.repeating_project_memoriamdiff) === 1 && "Answer One Minor Question   ♦   Gain One Expendable Background Dot   ♦   Gain a +2 Bonus to One Roll" ||
                    parseInt(ATTRS.repeating_project_memoriamdiff) === 2 && "Answer One Major Question   ♦   Gain Two Expendable Background Dots   ♦   Gain a +4 Bonus to One Roll" ||
                    parseInt(ATTRS.repeating_project_memoriamdiff) === 3 && "Answer One Epic Question   ♦   Gain Three Expendable Background Dot   ♦   Gain a Major Boon"
                };
                log(`Setting Attrs: ${JSON.stringify(attrList)}`);
                setAttrs(attrList);
            });
        }
    });

    on("change:repeating_project:eventdate", (eInfo) => {
        if (eInfo.sourceType !== "sheetworker") {
            log("", "████ CHANGE DETECTED: EVENTDATE ████");
            if (isValidDString(eInfo.newValue)) {
                log("", `Valid DString: ${eInfo.newValue}`);
                setAttrs({"repeating_project_archiveevent_toggle": 1});
            } else {
                log("", `Invalid DString: ${JSON.stringify(eInfo)}`);
                setAttrs({"repeating_project_archiveevent_toggle": 0});
            }
        }
    }); 
    // #endregion

    // #region UPDATE: Timeline
    
    on("change:repeating_project:archiveproject", (eInfo) => {
        if (eInfo.sourceType !== "sheetworker")
            doProjectRecord(getRowID(eInfo.sourceAttribute))(() => {
                removeRepeatingRow(`repeating_project_${getRowID(eInfo.sourceAttribute)}`);
            });
    });    
    on("change:repeating_project:archiveobjective", (eInfo) => {
        if (eInfo.sourceType !== "sheetworker")
            doObjectiveRecord(getRowID(eInfo.sourceAttribute))(() => {
                removeRepeatingRow(`repeating_project_${getRowID(eInfo.sourceAttribute)}`);
            });

    });  
    on("change:repeating_project:archivememoriam", (eInfo) => {
        if (eInfo.sourceType !== "sheetworker")
            doMemoriamRecord(getRowID(eInfo.sourceAttribute))(() => {
                removeRepeatingRow(`repeating_project_${getRowID(eInfo.sourceAttribute)}`);
            });

    });  
    on("change:repeating_project:archiveevent", (eInfo) => {
        if (eInfo.sourceType !== "sheetworker")
            doEventRecord(getRowID(eInfo.sourceAttribute))(() => {
                removeRepeatingRow(`repeating_project_${getRowID(eInfo.sourceAttribute)}`);
            });

    });
    
    // #endregion

    // #region UPDATE: Experience
    const doEXP = callback => {
        const attrList = {};
        const attrArray = {"earnedxp": [], "earnedxpright": [], "spentxp": []};
        const funcName = "doEXP";
        log("", `████ ${funcName.toUpperCase()} CALLED ████`);
        getSectionIDs("earnedxp", idArray => {
            _.each(idArray, repID => {
                _.each(["xp_award"], stat => {
                    attrArray.earnedxp.push(`repeating_earnedxp_${repID}_${stat}`);
                });
            });
            getSectionIDs("earnedxpright", rightIDs => {
                _.each(rightIDs, repID => {
                    _.each(["xp_award"], stat => {
                        attrArray.earnedxpright.push(`repeating_earnedxpright_${repID}_${stat}`);
                    });
                });
                getSectionIDs("spentxp", spentIDs => {
                    _.each(spentIDs, repID => {
                        _.each(XPREPREFS.spentxp, stat => {
                            attrArray.spentxp.push(`repeating_spentxp_${repID}_${stat}`);
                        });
                    });
                    getAttrs([..._.flatten(_.values(attrArray)), "xp_earnedtotal"], ATTRS => {
                        const ids = {
                            earnedxp: _.uniq(_.map(attrArray.earnedxp, v => parseRepAttr(v)[1])),
                            earnedxpright: _.uniq(_.map(attrArray.earnedxpright, v => parseRepAttr(v)[1])),
                            spentxp: _.uniq(_.map(attrArray.spentxp, v => parseRepAttr(v)[1]))
                        };
                        log(`Retrieved Attributes: ${JSON.stringify(simpleRepAttrs(ATTRS))}`, funcName);
                        log(`Retrieved IDs (earnedxp): ${JSON.stringify(simpleRepAttrs(ids.earnedxp))}`, funcName);
                        log(`Retrieved IDs (earnedxpright): ${JSON.stringify(simpleRepAttrs(ids.earnedxpright))}`, funcName);
                        log(`Retrieved IDs (spentxp): ${JSON.stringify(simpleRepAttrs(ids.spentxp))}`, funcName);
                        attrList.xp_earnedtotal = _.reduce(
                            _.values(_.filter(ATTRS, (v, k) => k.includes("xp_award"))), (total, next) => parseInt(total) + parseInt(next) || 0
                        );
                        ATTRS.xp_earnedtotal = attrList.xp_earnedtotal;
                        log(`Earned Total: ${JSON.stringify(attrList.xp_earnedtotal)}`, funcName);
                        let spentTotal = 0;
                        _.each(ids.spentxp, rowID => {
                            const [, p, pV, pI] = pFuncs(`repeating_spentxp_${rowID}_dummyStat`, ATTRS);
                            const cat = pV("xp_category");
                            const colRef = XPPARAMS[cat] ? XPPARAMS[cat].colToggles : null;
                            if (colRef)
                                if (
                                    (!colRef.includes("xp_trait_toggle") || pV("xp_trait") !== "") &&
                                    (!colRef.includes("xp_initial_toggle") || pV("xp_initial") !== "") &&
                                    (!colRef.includes("xp_new_toggle") || pV("xp_new") !== "")
                                ) {
                                    if (colRef.includes("xp_new_toggle")) {
                                        let delta = 0;
                                        if (colRef.includes("xp_initial_toggle"))
                                            if (cat === "Advantage") {
                                                delta = (pI("xp_new") - pI("xp_initial")) * XPPARAMS[cat].cost;
                                            } else {
                                                for (let i = pI("xp_initial"); i < pI("xp_new"); i++)
                                                    delta += (i + 1) * XPPARAMS[cat].cost;
                                            }
                                        else
                                            delta = pI("xp_new") * XPPARAMS[cat].cost;

                                        attrList[p("xp_cost")] = Math.max(0, delta);
                                    } else {
                                        attrList[p("xp_cost")] = Math.max(0, XPPARAMS[cat].cost);
                                    }
                                    if (pV("xp_spent_toggle") === "on" && attrList[p("xp_cost")] > 0)
                                        spentTotal += attrList[p("xp_cost")] || 0;
                                    if (attrList[p("xp_cost")] === 0)
                                        attrList[p("xp_cost")] = "";
                                }

                            _.each(["xp_trait_toggle", "xp_initial_toggle", "xp_new_toggle"],
                                   v => {
                                       if (colRef && colRef.includes(v) && pI(v) === 0)
                                           attrList[p(v)] = 1;
                                       else if (colRef && !colRef.includes(v) && pI(v) === 1)
                                           attrList[p(v)] = 0;
                                   });
                            attrList[p("xp_arrow_toggle")] = Number(colRef && colRef.includes("xp_initial_toggle") && colRef.includes("xp_new_toggle"));
                        });
                        attrList.xp_summary = `${ATTRS.xp_earnedtotal} XP Earned${spentTotal > 0 ? ` - ${spentTotal} XP Spent =  ${parseInt(ATTRS.xp_earnedtotal) - spentTotal} XP Remaining` : ""}`;
                        setAttrs(attrList, {}, () => {
                            log(`Setting Attributes: ${JSON.stringify(attrList)}`, funcName);
                            if (_.isFunction(callback))
                                callback(null);
                        });
                    });
                });
            });
        });
    };

    // change:xpsorttrigger change:_reporder_repeating_spentxp change:repeating_spentxp remove:repeating_spentxp ... plus earnedxp and earnedxpright
    on(getTriggers(["xpsorttrigger"], "", _.keys(XPREPREFS)), eInfo => {
        log("", "████ doEXP Triggered ████");
        log(`TRIGGER STRING: '${getTriggers(null, "", _.keys(XPREPREFS))}'`, "doEXP");
        log(`EINFO: '${JSON.stringify(eInfo)}'`, "doEXP");
        doEXP();
    });
    // #endregion

    // #region UPDATE: Dice Roller
    const doRollRepRefs = () => {
        const attrList = {};
        const $funcs = [
            $getRepAttrs(Object.assign(DISCREPREFS, ADVREPREFS)),
            (attrs, cBack) => {
                getAttrs(["repstats"], ATTRS => {
                    if (!_.isEqual(
                        _.compact(ATTRS.repstats.split(",")),
                        _.reject(attrs, v => v.includes("_details"))
                    ))
                        attrList.repstats = _.reject(attrs, v => v.includes("_details")).join(",");
                    cBack(null, attrList);
                });
            },
            $set
        ];
        run$($funcs);
    };

    const $doRolls = (targetAttr, opts = {}) => cback => doRolls(targetAttr, opts, cback);
    const doRolls = (targetAttr, opts = {}) => {
        const [repAttrs, attrList] = [[], {}];
        const repStatData = Object.assign({}, DISCREPREFS, ADVREPREFS);
        const repSecs = Object.keys(repStatData);
        const getRepAttrs = (repSec) => {
            if (repSec) 
                getSectionIDs(repSec, rowIDs => {
                    repAttrs.push(...rowIDs.map(rowID => _.flatten(repStatData[repSec].filter(repStat => !repStat.endsWith("_details")).map(repStat => `repeating_${repSec}_${rowID}_${repStat}`))));
                    log(`... ${repSec} ROWIDs: ${JSON.stringify(rowIDs)}
                            
                            ... mapped to: ${JSON.stringify(repAttrs)}`);
                    getRepAttrs(repSecs.shift());
                });
            else 
                getAttrs([...ALLATTRS, ..._.flatten(repAttrs)], ATTRS => {
                    log(`FULL ATTRS: ${JSON.stringify(ATTRS)}`, true);
                    const [rArray, prevRArray, clearAttrs] = [
                        [],
                        [],
                        {}
                    ];
                    const stat = isIn(targetAttr, ROLLFLAGS.all) || trimAttr(isIn(targetAttr, ATTRS));
                    const checkType = attr => {
                        // Returns type of stat sent in as parameter.
                        const name = realName(attr, ATTRS);
                        if (isIn(name, _.values(ATTRIBUTES)))
                            return "attribute";
                        else if (isIn(name, _.values(SKILLS)))
                            return "skill";
                        else if (isIn("advantage", attr))
                            return "advantage";
                        else if (isIn(name, DISCIPLINES))
                            return "discipline";
                        else if (isIn(name, TRACKERS))
                            return "tracker";

                        log(`CkType(${JSON.stringify(attr)}): Can't Determine Type`);

                        return false;
                    };
                    const checkFlag = attr => {
                        const flagName = isIn(`${trimAttr(attr)}_flag`, ATTRS);
                        if (flagName && parseInt(ATTRS[flagName]) === 1)
                            return parseInt(ATTRS[flagName]);

                        return false;
                    };
                    const validateFlags = flagArray => {
                        // Flags must be submitted in an ordered stack, with the oldest flag at the top.
                        const checkAction = (oldFlag, newFlag) => {
                            if (checkType(newFlag) && checkType(oldFlag))
                                return FLAGACTIONS[checkType(newFlag)][checkType(oldFlag)];

                            return false;
                        };

                        /* First, check for the specific case where...
                                        1) There are THREE traits in the flagArray
                                            AND
                                        2) The NEWEST trait is listed in THREEROLLTRAITS
                                    In this case, three traits are permitted. */
                        switch (flagArray.length) {
                            case 2:
                                switch (checkAction(...flagArray)) {
                                    case "replace":
                                    case "pass":
                                        flagArray.shift();
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            case 4:
                                flagArray.shift();
                                /* falls through */
                            case 3:
                                if (_.map(THREEROLLTRAITS, v => v.toLowerCase()).includes(realName(flagArray[2], ATTRS).toLowerCase()))
                                    break;
                                switch (checkAction(...flagArray.slice(1))) {
                                    case "append":
                                        flagArray.shift();
                                        break;
                                    case "replace":
                                        flagArray.splice(1, 1);
                                        break;
                                    case "pass":
                                        flagArray.splice(1, 1);
                                        switch (checkAction(...flagArray)) {
                                            case "replace":
                                            case "pass":
                                                flagArray.shift();
                                                break;
                                            default:
                                                break;
                                        }
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            default:
                                break;
                        }
                    };
                    const checkEffects = rollArray => {
                        const topDisplayStrings = [];
                        const lastTopDisplayStrings = [];
                        const effectChecks = _.compact((ATTRS.effectchecks || "").split("|"));
                        if (parseInt(ATTRS.applybloodsurge) > 0 && "blood_potency" in ATTRS) {
                            topDisplayStrings.push(`Blood Surge (+${bpDependants[parseInt(ATTRS.blood_potency)].bp_surge})`);
                            lastTopDisplayStrings.push("Rouse Check Is Automatic");
                        }
                        if (parseInt(ATTRS.applyspecialty) === 1)
                            topDisplayStrings.push("Specialty (+1)");
                        if (parseInt(ATTRS.applyresonance) === 1)
                            topDisplayStrings.push("Resonant (+1)");
                        if (parseInt(ATTRS.humanity) + parseInt(ATTRS.stains) > 10)
                            topDisplayStrings.push("Inhuman (-2)");
                        if (parseInt(ATTRS.health) === 0 && _.any(rollArray, v => isIn(v, [...ATTRIBUTES.physical, ...SKILLS.physical])))
                            topDisplayStrings.push("Injured (-2)");
                        if (parseInt(ATTRS.willpower) === 0 && _.any(rollArray, v => isIn(v, [...ATTRIBUTES.social, ...SKILLS.social, ...ATTRIBUTES.mental, ...SKILLS.mental])))
                            topDisplayStrings.push("Exhausted (-2)");
                        for (const effectCheck of effectChecks) {
                            const [traitString, displayString] = effectCheck.split(":");
                            let isDisplaying = true;
                            if (!_.isEmpty(traitString))
                                for (const andTrait of _.compact(traitString.split("+")))
                                    if (!isIn(andTrait, rollArray.map(v => realName(v, ATTRS)))) {
                                        isDisplaying = false;
                                        break;
                                    }
                            if (isDisplaying)
                                topDisplayStrings.push(displayString);
                        }
                        if (lastTopDisplayStrings.length)
                            topDisplayStrings.push(...lastTopDisplayStrings);
                        return `${_.uniq(topDisplayStrings).join(", ")}.`;
                    };                                        
                    prevRArray.push(..._.compact((ATTRS.rollarray || "").split(",")));
                    log(`>>> PREVRARRAY INITIAL: ${JSON.stringify(prevRArray)}`);

                    // IF RESETTING, clear all selected flags and other related parameters:
                    if (opts.reset) {
                        /* If this function was triggered when a flag was turned on, add it to
										prevRArray so it can be turned off, too: */
                        if (targetAttr.includes("_flag") && checkFlag(stat) === 1)
                            prevRArray.push(stat);
                        _.each(ROLLFLAGS.str, v => { [attrList[v], ATTRS[v]] = ["", ""] });
                        _.each([...ROLLFLAGS.num, ..._.map(prevRArray, v => `${v}_flag`)], v => { [attrList[v], ATTRS[v]] = [0, 0] });
                        attrList.rollpooldisplay = "Simple Roll or Check";
                        attrList.rollparams = "@{character_name}|";
                    } else if (targetAttr && targetAttr.includes("_flag")) {
                        /* If this function was triggered when a flagged trait changed, create a new rArray
										by incorporating this change.
										First, remove the selected stat from prevRArray to avoid duplicates: */
                        rArray.push(..._.without(prevRArray, stat));
                        //     ... then add it back if the flag was toggled ON:
                        if (checkFlag(stat) === 1)
                            rArray.push(stat);
                        // Next, reset the various roll parameters to default, which is zero EXCEPT for difficulty, which is 3:
                        for (const val of ROLLFLAGS.num) {
                            const defaultVal = val === "rolldiff" ? 3 : 0;
                            if (parseInt(ATTRS[val]) !== defaultVal)
                                [ATTRS[val], attrList[val]] = [defaultVal, defaultVal];
                        }

                    } else {
                        // Otherwise, just copy the previously selected traits over to the new rArray
                        rArray.push(...prevRArray);
                    }
                    log(`>>> RARRAY INITIAL: ${JSON.stringify(rArray)} (${stat} Flag Toggled)`);

                    // Remove duplicates from rArray, starting with the oldest:
                    for (const [, val] of [...rArray].entries())
                        if (rArray.filter(v => val === v).length > 1)
                            rArray.splice(rArray.indexOf(val), 1);

                    // Now, validate the rArray, determining what traits to deselect (if any) based on player selection
                    validateFlags(rArray);
                    log(`>>> VALIDATED RARRAY: ${JSON.stringify(rArray)}`);

                    // Now, store this rArray so it can be prevRArray for the next roll:
                    attrList.rollarray = rArray.join(",");
                    // Now unflag any traits that WERE flagged, but aren't anymore.
                    log(`>>> PRUNING UNFLAGGED STATS: (PREVARRAY: ${JSON.stringify(prevRArray)} vs. RARRAY: ${JSON.stringify(rArray)})`);
                    _.each(_.without(prevRArray, ...rArray), v => {
                        if (checkFlag(v) === 1)
                            clearAttrs[`${v}_flag`] = 0;
                    });
                    log(`... CLEARING: ${_.keys(clearAttrs)}`);
                    setAttrs(clearAttrs, {
                        silent: true
                    });

                    // Order the rArray as ATTRIBUTES, SKILLS, then OTHERS.
                    rArray.sort(
                        (...args) => {
                            const [v1, v2] = _.map(args, v => ["attribute", "skill", "discipline", "advantage", "tracker"].
                                indexOf(checkType(v)));

                            return v1 - v2;
                        }
                    );
                    log(`>>> SORTED RARRAY: ${JSON.stringify(rArray)}`);

                    if (rArray.length === 0) {
                        attrList.rollpooldisplay = `Simple Roll${parseInt(ATTRS.rollmod) === 0 && parseInt(ATTRS.rolldiff) === 0 && " or Check" || parseInt(ATTRS.rollmod) > 0 && ` of ${Math.abs(parseInt(ATTRS.rollmod))} Dice` || ""}`;
                    } else {
                        attrList.rollpooldisplay = rArray.map(v => realName(v, ATTRS)).join(" + ");
                        if (parseInt(ATTRS.rollmod) !== 0)
                            attrList.rollpooldisplay += ` ${parseInt(ATTRS.rollmod) < 0 ? "-" : "+"} ${Math.abs(parseInt(ATTRS.rollmod))}`;
                    }
                    if (parseInt(ATTRS.rolldiff) !== 0)
                        attrList.rollpooldisplay += ` vs. ${parseInt(ATTRS.rolldiff)}`;
                    log(`>>> ROLL DISPLAY: ${JSON.stringify(attrList.rollpooldisplay)}`);
                            
                    // Clear any result messages from the bottom display:
                    attrList.bottomdisplay = "";

                    // Create the top display string based on existing roll flags:
                    attrList.topdisplay = checkEffects(rArray);

                    // Set roll parameter string:
                    attrList.rollparams = `@{character_name}|${rArray.join(",")}`;
                    log(`>>> ROLL PARAMETER: ${JSON.stringify(attrList.rollparams)}`);

                    setAttrs(attrList);
                });
        };
        getRepAttrs(repSecs.shift());
    };

    on(`sheet:opened ${getTriggers(null, "", [..._.keys(DISCREPREFS), ..._.keys(ADVREPREFS)])}`, eInfo => {
        if (eInfo.sourceType !== "sheetworker" && !isBlacklisted(eInfo.sourceAttribute))
            doRollRepRefs();

    });
    on(getTriggers(ALLATTRS, "", [..._.keys(DISCREPREFS), ..._.keys(ADVREPREFS)]), eInfo => {
        if (!ISOFFLINE) {
            log(`[${eInfo.sourceAttribute}, ${eInfo.sourceType}] @@@ STAT ROLLER TRIGGERED @@@`);
            if (eInfo.sourceType !== "sheetworker" && !isBlacklisted(eInfo.sourceAttribute))
                doRolls(eInfo.sourceAttribute, {
                    silent: true
                });

        }
    });
    // #endregion

    // #region UPDATE: Temporary Stat Effects
    const doDomainControl = () => {
        const [repAttrs, attrList] = [[], {}];
        const repStatData = Object.assign({}, DOMCONREPREFS);
        const repSecs = Object.keys(repStatData);
        const getRepAttrs = (repSec) => {
            if (repSec) 
                getSectionIDs(repSec, rowIDs => {
                    repAttrs.push(...rowIDs.map(rowID => _.flatten(repStatData[repSec].filter(repStat => !repStat.endsWith("_details")).map(repStat => `repeating_${repSec}_${rowID}_${repStat}`))));
                    log(`... ${repSec} ROWIDs: ${JSON.stringify(rowIDs)}
                    
                    ... mapped to: ${JSON.stringify(repAttrs)}`);
                    getRepAttrs(repSecs.shift());
                });
            else 
                getAttrs(_.flatten(repAttrs), ATTRS => {
                    log(`FULL ATTRS: ${JSON.stringify(ATTRS)}`, true);
                    const filteredAttrs = _.pick(ATTRS, (v, k) => k.includes("level"));
                    for (const levelTrait of Object.keys(filteredAttrs)) {
                        const [, p, pV, pI] = pFuncs(levelTrait, ATTRS);
                        const district = pV("district");
                        const level = pI("level") - 1;
                        if (district)
                            attrList[p("summary")] = DOMAINCONTROL[district][level] || " ";
                    }
                    setAttrs(attrList);
                });
        };
        getRepAttrs(repSecs.shift());
    };
    const doStatEffects = () => {
        const [repAttrs, attrList] = [[], {}];
        const repStatData = Object.assign({}, DISCREPREFS, ADVREPREFS, DOMCONREPREFS);
        const repSecs = Object.keys(repStatData);
        const getRepAttrs = (repSec) => {
            if (repSec) 
                getSectionIDs(repSec, rowIDs => {
                    repAttrs.push(...rowIDs.map(rowID => _.flatten(repStatData[repSec].filter(repStat => !repStat.endsWith("_details")).map(repStat => `repeating_${repSec}_${rowID}_${repStat}`))));
                    log(`... ${repSec} ROWIDs: ${JSON.stringify(rowIDs)}
                            
                            ... mapped to: ${JSON.stringify(repAttrs)}`);
                    getRepAttrs(repSecs.shift());
                });
            else 
                getAttrs(["stateffects", "prevstateffects", ...ALLATTRS, ..._.flatten(repAttrs)], ATTRS => {
                    log(`FULL ATTRS: ${JSON.stringify(ATTRS)}`, true);
                    if (ATTRS.stateffects === ATTRS.prevstateffects)
                        return;
                    const [pV, pI, pF] = nFuncs(ATTRS);
                    const statEffects = pV("stateffects").split("|");
                    const prevStatEffects = pV("prevstateffects").split("|");
                    const newStatEffects = _.without(statEffects, prevStatEffects);
                    const clearedStatEffects = _.without(prevStatEffects, statEffects);
                    const traitMultipliers = [];
                    const traitAdditions = [];
                    const reportLines = [];
                    const messageLines = {
                        health_stateffect: [],
                        willpower_stateffect: [],
                        humanity_stateffect: [],
                        bloodpot_stateffect: [],
                        roller_stateffect: [],
                        attributes_stateffect: [],
                        skills_stateffect: [],
                        advantages_stateffect: [],
                        negadvantages_stateffect: [],
                        disciplines_stateffect: []
                    };
                    reportLines.push(" ");
                    reportLines.push("-----------------------------------------");
                    for (const effect of clearedStatEffects) {
                        reportLines.push(`Stat Effect: '${effect}'`);
                        const [trait, delta, msgLoc, message] = effect.split(":");
                        reportLines.push(`... Split: ${[trait, delta, msgLoc, message].join(" --- ")}`);
                        if (trait in ATTRS)
                            if (`${delta}`.startsWith("x")) {
                                traitMultipliers.push({[trait]: 1 / parseFloat(delta.replace(/x/gu, ""))});
                                reportLines.push(`... traitMultipliers: ${JSON.stringify(traitMultipliers)}`);
                            } else {
                                attrList[trait] = pI(trait) - parseInt(delta);
                                ATTRS[trait] = attrList[trait];
                                reportLines.push(`... Undid ${trait}: ${attrList[trait]}`);
                            }
                        reportLines.push(" ");
                    }
                    reportLines.push("       xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx       ");
                    for (const multData of traitMultipliers) {
                        const [trait, mult] = Object.entries(multData);
                        attrList[trait] = pI(trait) * mult;
                        ATTRS[trait] = attrList[trait];
                        reportLines.push(`... Multiplied ${trait}: ${attrList[trait]}`);
                    }
                    for (const [trait, newVal] of Object.entries(attrList)) {
                        attrList[trait] = Math.round(newVal);
                        ATTRS[trait] = attrList[trait];
                        reportLines.push(`... Applied ${trait}: ${ATTRS[trait]}`);
                    }
                    reportLines.push(" ");
                    reportLines.push("+++++++++++++++++++++++++++++++++++++++++");
                    for (const effect of newStatEffects) {
                        reportLines.push(`Stat Effect: '${effect}'`);
                        const [trait, delta, msgLoc, message] = effect.split(":");
                        reportLines.push(`... Split: ${[trait, delta, msgLoc, message].join(" --- ")}`);
                        if (trait in ATTRS) {
                            if (`${delta}`.startsWith("x")) {
                                attrList[trait] = pI(trait) * parseFloat(delta.replace(/x/gu, ""));
                                ATTRS[trait] = attrList[trait];
                                reportLines.push(`... Multiplied ${trait}: ${ATTRS.trait}`);
                            } else {
                                traitAdditions.push({[trait]: parseInt(delta)});
                                reportLines.push(`... traitAdditions: ${JSON.stringify(traitAdditions)}`);
                            }
                            const msgLocKey = `${msgLoc}_stateffect`;
                            if (msgLocKey in messageLines)
                                messageLines[msgLocKey].push(message);
                        }
                        reportLines.push(`... Message Lines: ${JSON.stringify(messageLines, null, 4)}`);
                        reportLines.push(" ");
                    }
                    for (const [trait, newVal] of Object.entries(attrList)) {
                        attrList[trait] = Math.round(newVal);
                        ATTRS[trait] = attrList[trait];
                        reportLines.push(`... Applied ${trait}: ${ATTRS[trait]}`);
                    }
                    reportLines.push("       xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx       ");
                    for (const addData of traitAdditions) {
                        const [trait, delta] = Object.entries(addData);
                        attrList[trait] = pI(trait) + delta;
                        ATTRS[trait] = attrList[trait];
                        reportLines.push(`... Added ${trait}: ${attrList[trait]}`);
                    }
                    for (const [loc, lines] of Object.entries(messageLines))
                        attrList[loc] = lines.join(", ");
                    attrList.prevstateffects = ATTRS.stateffects;
                    reportLines.push(" ");
                    reportLines.push("********** ALL DONE! ***************");
                    reportLines.push(`DELTAATTRS: ${JSON.stringify(attrList, null, 4)}`);
                    log(reportLines.join("\n"), "[DSE] ");
                    setAttrs(attrList);
                });
        };
        getRepAttrs(repSecs.shift());
    };
    on("sheet:opened change:stateffects", eInfo => {
        doStatEffects();
    });
    on(getTriggers(["stateffects"], "", [..._.keys(DOMCONREPREFS)]), eInfo => {
        doDomainControl();
    });
    // #endregion

    // #region Sheetworker Actions (Above "on(changes)" ignore sheetworker.)
    on("change:hunger", () => {
        log("HUNGER CHANGED!");
        doRolls("GEN");
    });
    // #endregion

    // #region On-Sheet-Opened Triggers (To Be Done Every Time Sheet Is Opened)
    on("sheet:opened", eInfo => {
        doTracker("Health", eInfo);
        doTracker("Willpower", eInfo);
        log(`TRIGGER STRING: '${getTriggers(null, "", _.keys(XPREPREFS))}'`, "doEXP");
    });
    // #endregion
})();