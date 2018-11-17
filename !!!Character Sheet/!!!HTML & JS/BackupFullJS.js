//#region Constants Declarations
const ATTRIBUTES = {
    physical: ["Strength", "Dexterity", "Stamina"],
    social: ["Charisma", "Manipulation", "Composure"],
    mental: ["Intelligence", "Wits", "Resolve"]
};
const SKILLS = {
    physical: ["Athletics", "Brawl", "Craft", "Drive", "Firearms", "Melee", "Larceny", "Stealth", "Survival"],
    social: ["Animal_Ken", "Etiquette", "Insight", "Intimidation", "Leadership", "Performance", "Persuasion", "Streetwise", "Subterfuge"],
    mental: ["Academics", "Awareness", "Finance", "Investigation", "Medicine", "Occult", "Politics", "Science", "Technology"]
};
const DISCIPLINES = ["Animalism", "Auspex", "Celerity", "Dominate", "Fortitude", "Obfuscate", "Potence", "Presence", "Protean", "Blood Sorcery", "Alchemy", "Oblivion", "Vicissitude", "Chimerstry", "Oblivion"]
const TRACKERS = ["Health", "Willpower", "BloodPotency", "Humanity"];
const REFERENCESTATS = ["Hunger", "Stains", "resonance", "rollMod", "rollDiff", "applyDiscipline", "applyBloodSurge", "applySpecialty", "applyResonant", "incapacitation", "rollArray"];
const DISCIPLINEREFS = ["Disc1", "Disc2", "Disc3", "repeating_discLeft", "repeating_discMid", "repeating_discRight"];
const ENUMSTATS = ["Disc1", "Disc2", "Disc3"];
const REPSECTIONS = ["discLeft", "discMid", "discRight", "advantage", "negAdvantage"];
const ATTRBLACKLIST = ["powertoggle"];
const FLAGACTIONS = {  // If key is flagged, action to take depending on type of stat it would be paired with (i.e. newest, in prevArray[0], getting rid of prevArray[1]):
    attribute: { attribute: "add", skill: "add", discipline: "add", advantage: "add", tracker: "add" },
    skill: { attribute: "add", skill: "repThis", discipline: "skip", advantage: "add", tracker: "skip" },
    discipline: { attribute: "add", skill: "skip", discipline: "repThis", advantage: "skip", tracker: "skip" },
    advantage: { attribute: "add", skill: "add", discipline: "skip", advantage: "repThis", tracker: "skip" },
    tracker: { attribute: "add", skill: "skip", discipline: "skip", advantage: "skip", tracker: "repThis" }
}



const resDisciplines = {
    None: [""],
    Choleric: ["Celerity", "Potence"],
    Melancholic: ["Fortitude", "Obfuscate"],
    Phlegmatic: ["Auspex", "Dominate"],
    Sanguine: ["Blood Sorcery", "Presence"],
    Animal: ["Animalism", "Protean"]
}
const clanBanes = {
    "0": null,
    "Brujah": "Your Brujah Blood simmers with barely contained rage, exploding at the slightest provocation. Subtract dice equal to your Bane Severity from any roll to resist fury frenzy. This cannot take the pool below one die.",
    "Gangrel": "Your Gangrel Blood is closely tied to your Beast.  In frenzy, you gain a number of animal features equal to your Bane Severity: a physical trait, a smell, or a behavioural tic.  Each feature reduces one Attribute by 1 point, and lasts for one more night afterwards.  If your character Rides the Wave of their frenzy, you can choose only one feature to manifest, thus penalizing only one Attribute.",
    "Malkavian": "Your afflicted Malkavian lineage is cursed with one or more mental derangements:  You may experience delusions, visions of terrible clarity, or something entirely different. When you suffer a Bestial Failure or a Compulsion, your deranged nature manifests and you suffer a penalty equal to your Bane Severity to one category of dice pools (Physical, Social, or Mental) for the entire scene.",
    "Nosferatu": "Your cursed Nosferatu Blood afflicts you with physical ugliness:  You have the Repulsive (••) Flaw at all times, and can never purchase dots in the Looks Merit.  In addition, any attempt to disguise yourself as human suffers a dice pool penalty equal to your Bane Severity (this includes applicable uses of Obfuscate).",
    "Toreador": "Your Toreador Blood desires beauty so intensely that you suffer in its absence.  While you find yourself in less than beautiful surroundings, lose the equivalent of your Bane Severity in dice from dice pools to use Disciplines. The Storyteller decides specifically how the beauty or ugliness of your environment (including clothing, blood dolls, etc.) penalizes you, based on your aesthetics.",
    "Tremere": "Your Tremere Blood lacks the power to Blood Bond other Kindred (though you can still be Bound by Kindred from other clans).  You can still bind mortals and ghouls, though the corrupted vitae must be drunk an additional number of times equal to your Bane Severity for the bond to form.",
    "Ventrue": "Your dignified Ventrue Blood possesses you with a specific preference for whom you will feed from: genuine brunettes, students, sufferers of PTSD, methamphetamine users, etc.  You must spend Willpower equal to your Bane Severity to drink blood from anyone other than your preference, or the blood taken surges back up as scarlet vomit.  With a Resolve + Awareness test (Difficulty 4 or more), you can sense if a mortal possesses the blood you require.",
    "Caitiff": "Your Caitiff Blood is too dilute to carry the legacy of an Antediluvian in the form of a Clan Bane. Nevertheless, your clanless nature ensures other Kindred view you as an outsider:  You begin with the Suspect (•) Flaw, and cannot purchase positive Status during character creation.  Moreover, you suffer a dice penalty on Social tests against fellow Kindred who know you are Caitiff equal to one-half your Bane Severity, rounded down to a minimum of one.",
    "Thin-Blooded": "Your thin blood is weaker than that of other Kindred, but the ways in which that weakness manifests differs from one duskborn to another.  Refer to your Thin-Blood Merits & Flaws determine how you differ from the standard Thin-Blooded weaknesses described in VAMPIRE Core, pp. 111 - 113.",
    "Lasombra": "\n" +
        "Your Lasombra Blood is tainted by the same Abyss that gives you power over darkness.  You cast no reflection in mirrors or other reflective surfaces.",
    "Tzimisce": "Your Tzimisce Blood is inexhorably tied to the Old World.  You must sleep each day submerged in soil taken from Eastern Europe, or you suffer a penalty equal to your Bane Severity to all dice pools the following night.",
    "Banu Haqim": "Your Assamite Blood marks you as one of the Banu Haqim:  Instead of growing paler with age, you grow darker, with the eldest of your clan bearing complexions as dark as ebony.  Additionally, when an attempt is made to read your aura or divine details about you, roll dice equal to twice your Bane Severity.  On a critical success, your Blood shows traces of diablerie, whether you are guilty of the crime or not.",
    "Giovanni": "Your Giovanni Blood is tainted with death.  When feeding, you do not cause ecstasy in your prey, but rather excruciating pain.  Moreover, mortals subconsciously sense your blighted nature:  You suffer a penalty equal to your Bane Severity to all attempts to feed from mortals that do not rely on force.",
    "Setite Ministry": "Yours is the Blood of Set, and it shares His longing for darkness.  You suffer your Bane Severity in additional aggravated damage from sunlight and fire each turn, and an equivalent penalty to all dice pools when in extremely bright light (spotlights, daylight, etc.)",
    "Ravnos": "Your Ravnos Blood instills in you a weakness for a specific vice or crime: theft, deceit, con-artistry, etc.  When commiting your chosen vice would benefit you in some way, failure to act accordingly penalizes your Social and Mental dice pools by an amount equal to your Bane Severity for the remainder of the night."
};
const clanDisciplines = {
    Brujah: ["Celerity", "Potence", "Presence"],
    Gangrel: ["Animalism", "Fortitude", "Protean"],
    Malkavian: ["Auspex", "Dominate", "Obfuscate"],
    Nosferatu: ["Animalism", "Obfuscate", "Potence"],
    Toreador: ["Auspex", "Celerity", "Presence"],
    Tremere: ["Auspex", "Dominate", "Blood Sorcery"],
    Ventrue: ["Dominate", "Fortitude", "Presence"],
    Caitiff: ["", "", ""],
    "Thin-Blooded": ["Alchemy", "", ""],
    Lasombra: ["Dominate", "Oblivion", "Potence"],
    Tzimisce: ["Animalism", "Auspex", "Vicissitude"],
    "Banu Haqim": ["Celerity", "Obfuscate", "Blood Sorcery"],
    Giovanni: ["Dominate", "Oblivion", "Potence"],
    "Setite Ministry": ["Obfuscate", "Presence", "Protean"],
    Ravnos: ["Animalism", "Chimerstry", "Fortitude"]
};
const generationDependants = [
    null, null, null, null,
    { bloodPotencyDotMax: 10, BloodPotency: 5 },
    { bloodPotencyDotMax: 9, BloodPotency: 4 },
    { bloodPotencyDotMax: 8, BloodPotency: 3 },
    { bloodPotencyDotMax: 7, BloodPotency: 3 },
    { bloodPotencyDotMax: 6, BloodPotency: 2 },
    { bloodPotencyDotMax: 5, BloodPotency: 2 },
    { bloodPotencyDotMax: 4, BloodPotency: 1 },
    { bloodPotencyDotMax: 4, BloodPotency: 1 },
    { bloodPotencyDotMax: 3, BloodPotency: 1 },
    { bloodPotencyDotMax: 3, BloodPotency: 1 },
    { bloodPotencyDotMax: 0, BloodPotency: 0 },
    { bloodPotencyDotMax: 0, BloodPotency: 0 },
    { bloodPotencyDotMax: 0, BloodPotency: 0 },
];
const bpDependants = [
    { bloodSurge: 0, bloodMend: 1, bloodDiscBonus: 0, bloodRouseReroll: 0, bloodBaneSeverity: 0, animalSlakeMult: 1, humanSlakePenalty: 0, killSlakeThreshold: 1 },
    { bloodSurge: 1, bloodMend: 1, bloodDiscBonus: 1, bloodRouseReroll: 0, bloodBaneSeverity: 1, animalSlakeMult: 1, humanSlakePenalty: 0, killSlakeThreshold: 1 },
    { bloodSurge: 1, bloodMend: 2, bloodDiscBonus: 1, bloodRouseReroll: 1, bloodBaneSeverity: 1, animalSlakeMult: 0.5, humanSlakePenalty: 0, killSlakeThreshold: 1 },
    { bloodSurge: 2, bloodMend: 2, bloodDiscBonus: 1, bloodRouseReroll: 2, bloodBaneSeverity: 2, animalSlakeMult: 0, humanSlakePenalty: 0, killSlakeThreshold: 1 },
    { bloodSurge: 2, bloodMend: 3, bloodDiscBonus: 2, bloodRouseReroll: 2, bloodBaneSeverity: 2, animalSlakeMult: 0, humanSlakePenalty: -1, killSlakeThreshold: 1 },
    { bloodSurge: 3, bloodMend: 3, bloodDiscBonus: 2, bloodRouseReroll: 3, bloodBaneSeverity: 3, animalSlakeMult: 0, humanSlakePenalty: -1, killSlakeThreshold: 2 },
    { bloodSurge: 3, bloodMend: 3, bloodDiscBonus: 3, bloodRouseReroll: 3, bloodBaneSeverity: 3, animalSlakeMult: 0, humanSlakePenalty: -2, killSlakeThreshold: 2 },
    { bloodSurge: 4, bloodMend: 3, bloodDiscBonus: 3, bloodRouseReroll: 4, bloodBaneSeverity: 4, animalSlakeMult: 0, humanSlakePenalty: -2, killSlakeThreshold: 2 },
    { bloodSurge: 4, bloodMend: 4, bloodDiscBonus: 4, bloodRouseReroll: 4, bloodBaneSeverity: 4, animalSlakeMult: 0, humanSlakePenalty: -2, killSlakeThreshold: 3 },
    { bloodSurge: 5, bloodMend: 4, bloodDiscBonus: 4, bloodRouseReroll: 5, bloodBaneSeverity: 5, animalSlakeMult: 0, humanSlakePenalty: -2, killSlakeThreshold: 3 },
    { bloodSurge: 5, bloodMend: 5, bloodDiscBonus: 5, bloodRouseReroll: 5, bloodBaneSeverity: 5, animalSlakeMult: 0, humanSlakePenalty: -3, killSlakeThreshold: 3 }
];
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
        "A prince is a vampire who has claimed leadership over a city on behalf of the Camarilla.",
        "Only the prince possesses the authority of the Eldest, as described in the Six Traditions."],
    ["The Council of Primogen",
        "The primogen are Camarilla officials that, at least in theory, serve as the representatives of their respective clans",
        "to the prince of a city under Camarilla rule.  In general, the ruling vampires of the city value the primogen and their",
        "opinions; they are called in to consult on decisions; and their recommendations carry great weight."],
    ["The Baron",
        "A baron is the Anarch Movement's equivalent of a Camarilla prince: the highest Anarch authority in a city.",
        "As the Anarchs believe in a system that awards merit, barons tend to vary in age",
        "and experience far more than princes, who are generally elders."],
    ["The Camarilla",
        "The Camarilla is the largest of the vampiric sects, an organization which ostensibly represents and protects all vampires by",
        "enforcing and promulgating the Six Traditions. It is currently composed of five clans (Malkavian, Nosferatu, Toreador, Tremere",
        "and Ventrue), though officially it considers all Kindred under its purview and welcomes any that obey its laws."],
    ["The Anarchs",
        "The Anarchs are vampires who reject the status quo of Camarilla society.  They especially resent the privileged status held by",
        "elders, and champion the rights of younger Kindred against an establishment that concentrates power among the very old.  Unlike the",
        "Sabbat, the Anarchs loosely hold to the Traditions of the Camarilla, and are largely (if reluctantly) tolerated by the larger sect."],
    ["The Sabbat",
        "The Sabbat is a loose organization of Kindred who reject the Traditions and the assumed humanity of the Camarilla, their bitter enemies.",
        "Also known as the Sword of Caine, they believe they are the army Caine will use to destroy the Antediluvians once Gehenna arrives."],
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
        "their blood to your tastes.  With a Project, you can change a resonance entirely, and even confer a dyscrasias upon the blood."],
    ["The Blood Hunt",
        "If the prince calls a Blood Hunt (or, more traditionally, the \"Lexitalionis\") against a",
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
        "Iconoclasts and rebels, they boldly fight the establishment to forge a new world."],
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
        "Clan Lasombra of the Sabbat descends from Lasombra of the Third Generation, childe of Irad the Strong, childe of Caine the First.",
        "Predatory, elegant and inhuman manipulators of darkness and shadow, the leaders of the Sabbat",
        "are ruthless social Darwinists who believe in the worthy ruling, and the unworthy serving."],
    ["Clan Tzimisce: The Clan of Shapers",
        "Clan Tzimisce (\"zih-ME-see\") of the Sabbat descends from an Antediluvian known only as \"the Eldest\", childe of Enoch the Wise, childe",
        "of Caine the First.  Scholars, sorcerers and flesh-shapers, the Tzimisce are alien and inscrutable, proudly renouncing",
        "their humanity to focus on transcending the limitations of the vampiric state, by following their \"Path of Metamorphosis\"."],
    ["Clan Assamite: The Clan of the Hunt",
        "Clan Assamite of the mountain fortress Alamut in the Middle East, known as the Banu Haqim, descends from Haqim of the Third",
        "Generation, childe of Zillah the Beautiful, childe of Caine the First.  Traditionally seen as dangerous assassins and diablerists, in",
        "truth they are guardians, scholars and warriors who seek to distance themselves from the Jyhad."],
    ["Clan Giovanni: The Clan of Death",
        "Clan Giovanni of Venice descends from Augustus Giovanni, who diablerized and usurped Ashur, childe of Irad the Strong, childe",
        "of Caine the First.  Thus Clan Giovanni replaced Clan Cappadocian as one of the thirteen Great Clans, and hunted them to",
        "extinction. Incestuous necromancers with a penchant for organized crime, the Giovanni rarely Embrace outside of their own mortal family."],
    ["Clan Setite: The Snake Clan",
        "Clan Setite of Egypt, known as the Followers of Set and the Ministry, descends from Setekh of the Third Generation, childe",
        "of Zillah the Beautiful, childe of Caine the First.  Serpentine tempters, corruptors and purveyors of every vice, they",
        "are seen by many to embody the snake in the Garden of Eden."],
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
        "Dracula, the vampire made famous by the mortal author Bram Stoker, is indeed real.",
        "An elder of Clan Tzimisce, the powers described in Stoker's novel are manifestations of Dracula's command",
        "of myriad disciplines, including Protean, Vicissitude, Dominate, Presence and Animalism."],
    ["The Beckoning",
        "The Beckoning is a calling in the Blood, a cry for aid from the sleeping Antediluvians to guard their places of rest from from the",
        "Sabbat, who search for them relentlessly in the Middle East.  The stronger the Blood, the stronger the call:  Only vampires of the ninth",
        "generation and lower feel it at all.  Many continue to resist the summons; many others have found it impossible to ignore."],
    ["Of Cities: Elysium",
        "Elysium is any place declared as such by the prince, in which the safety of all Kindred is assured and violence is forbidden.",
        "As neutral ground for all, Elysiums become hubs of Kindred activity."],
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
        "You will know them by the Clanless, who will come to rule.\"", "                                                    — The Book of Nod"],
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
        "Clan Brujah, who rejected the Gift; Clan Cappadocian, who would be usurped by the Giovanni; Clan Lasombra; and Clan Ventrue."],
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
        "The Ventrue and the Lasombra are as alike as they are polar opposites: As the Ventrue rule the Camarilla, the Lasombra rule the",
        "Sabbat. Both Embrace the capable and the ambitious; both prize power above all else; and both consider themselves the true masters",
        "of Dominate. Their hatred for each other is matched only by their grudging respect for their rival kings among the Kindred."],
    ["Clan Rivalries: Brujah & Ventrue",
        "When Ventrue-controlled Rome sacked Carthage, the greatest of Clan Brujah's achievements, they sparked a rivalry whose age is",
        "only surpassed by the fued between Clan Ravnos and Clan Gangrel.  With Clan Ventrue embodying the status quo and Clan Brujah",
        "rebelling against the establishment, their mutual disdain has found no shortage of fuel over the centuries."],
    ["Clan Rivalries: Tremere & Tzimisce",
        "It wasn't Tremere who unlocked the secrets of vampiric immortality, but his disciple Goratrix.  His methods were barbaric: he",
        "experimented on hundreds of native Tzimisce, ultimately starting a war between Clan Tzimisce and the newly-formed Clan Tremere.",
        "Though the Omen War has long ended, the hatred between the two clans persists undimmed into the modern nights."],
    ["Clan Rivalries: Tremere & Assamite",
        "In 1493, at the signing of the Convention of Thorns that founded the Camarilla, the Assamites were widely feared for their",
        "wanton commission of diablerie.  So Clan Tremere placed a curse on the entire bloodline, preventing them from drinking Kindred",
        "Blood. Though the curse was recently broken, the Assamites (now the Banu Haqim) have yet to forgive Clan Tremere's interference."],
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

const XPSTATS = ["xp_remaining", "xp_summary"];
const XPREPSECTIONS = ["spentxp", "earnedxp"];
const XPREPFLAGS = ["xp_spenttoggle", "xp_category", "xp_trait", "xp_initial", "xp_new"];
const XPREPREFS = {
    earned: ["xp_session", "xp_award", "xp_reason"],
    spent: ["xp_traittoggle", "xp_initialtoggle", "xp_arrowtoggle", "xp_newtoggle", "xp_cost"]
};
const XPPARAMS = {
    Attribute: { colToggles: ["xp_traittoggle", "xp_initialtoggle", "xp_newtoggle"], cost: 5 },
    Skill: { colToggles: ["xp_traittoggle", "xp_initialtoggle", "xp_newtoggle"], cost: 3 },
    Specialty: { colToggles: ["xp_traittoggle"], cost: 3 },
    Clan_Discipline: { colToggles: ["xp_traittoggle", "xp_initialtoggle", "xp_newtoggle"], cost: 5 },
    Other_Discipline: { colToggles: ["xp_traittoggle", "xp_initialtoggle", "xp_newtoggle"], cost: 7 },
    Caitiff_Discipline: { colToggles: ["xp_traittoggle", "xp_initialtoggle", "xp_newtoggle"], cost: 6 },
    Ritual: { colToggles: ["xp_traittoggle", "xp_newtoggle"], cost: 3 },
    Formula: { colToggles: ["xp_traittoggle", "xp_newtoggle"], cost: 3 },
    Advantage: { colToggles: ["xp_traittoggle", "xp_initialtoggle", "xp_newtoggle"], cost: 3 },
    Blood_Potency: { colToggles: ["xp_initialtoggle", "xp_newtoggle"], cost: 10 }
};

const GROUPPREFIXES = ["g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8", "g9"];
const GROUPATTRS = ["charname", "Hunger"];
const GROUPREPSECTIONS = ["rolls"];
const GROUPREPREFS = ["rollType", "trait1name", "trait1value", "trait2name", "trait2value", "rolldiff", "rollmod", "posflags", "negflags", "roll_params"];

const PROJREPSECTIONS = ["project"];
const PROJDATEDEPS = ["projectstartdate", "projectincnum", "projectincunit", "projectenddate", "projectinccounter", "projectrushpool"];
const PROJREPFLAGS = ["projectstartdate", "projectincnum", "projectincunit", "projectscope", "projectlaunchtrait1_name", "projectlaunchtrait1", "projectlaunchtrait2_name", "projectlaunchtrait2", "projectlaunchmod", "projectstake1_name", "projectstake1", "projectstake2_name", "projectstake2", "projectstake3_name", "projectstake3", "projectstake4_name", "projectstake4", "projectstake5_name", "projectstake5", "projectstake6_name", "projectstake6", "projectlaunchresults", "projectlaunchresultsmargin", "projectlaunchdiffmod", "projectwasrushed"];
const PROJREPATTRS = ["projectenddate", "projectinccounter", "projectscope_name", "projectlaunchdiff", "projectlaunchrollToggle", "projectlaunchroll_params", "projecttotalstake", "projectrushpool", "projectstakesatrush", "projectrushstakelost", "projectrushstakelosttogo"];
//#endregion
//#region Derivative Stats
const basicStats = _.flatten([_.values(ATTRIBUTES), _.values(SKILLS), ENUMSTATS, TRACKERS]);
const statFlags = _.map(_.omit(basicStats, TRACKERS), function (stat) { return stat + "_flag"; });

var GROUPSTATS = {};
_.each(GROUPPREFIXES, function (prefix) {
    GROUPSTATS[prefix] = {
        attrList: _.map(GROUPATTRS, a => (prefix + a)),
        repSections: _.map(GROUPREPSECTIONS, s => (prefix + s)),
        repStats: _.map(GROUPREPREFS, r => (prefix + r))
    };
});

//#endregion
//#region Utility Functions: Logging, Asynchronous Function Queueing, Date & Time Manipulation
var logPrefix = "";
var logDepth = 0;
var isDebug = true;
var options = {};

var log = function (msg, isWarn, isLoud) {
    //if (isLoud) {
    //    console.log(logPrefix + " ".repeat(logDepth * 3) + msg);
    //    return;
    //}
    if (isDebug) {
        let prefix = logPrefix + " ".repeat(logDepth * 3);
        if (options && options.silent)
            prefix = "  ($" + prefix + "$)";
        if (options && options.silent && !isLoud)
            return;
        if (isWarn)
            console.warn(prefix + msg);
        else
            console.log(prefix + msg);
    }
    return;
};

var trimrep = function (attrs) {
    let newAttrs = {};
    _.each(attrs, function (v, k) {
        if (k.includes("repeating"))
            newAttrs[k.split("_").slice(3).join("_")] = v;
        else
            newAttrs[k] = v;
    });
    return newAttrs;
}

var asyncQueue = function (tasks, cb) {
    var current = 0

    function done(err, args, doneName) {
        doneName = doneName || "ASYNC" + "-" + current;
        //log("[AQ] Calling done(" + JSON.stringify(err) + ", " + JSON.stringify(args) + ") for " + doneName);
        function end(endName) {
            endName = endName || "ASYNC" + "-" + current;
            //log("[AQ] Calling end() for " + endName);
            args = args ? [].concat(err, args) : [err]
            if (cb)
                cb.apply(undefined, args)
        }
        end(doneName);
    }

    function each(err, eachName) {
        eachName = eachName || "ASYNC" + "-" + current;
        //log("[AQ] Calling each(" + JSON.stringify(err) + ") for " + eachName);
        var args = Array.prototype.slice.call(arguments, 1)
        //log("[AQ-EACH: " + eachName + "] args = '" + JSON.stringify(args));
        if (++current >= tasks.length || err) {
            done(err, args, eachName)
        } else {
            tasks[current].apply(undefined, [].concat(args, each))
        }
    }

    if (tasks.length) {
        tasks[0](each)
    } else {
        done(null, undefined, "FINAL");
    }
};

var groupify = function (attrArray, gN) {
    gN = gN || "";
    return _.map(attrArray, function (attr) { return gN + attr; });
};

var isLeapYear = function (year) {
    return year % 4 != 0 || year % 100 == 0 && year % 400 != 0;
};

var daysInMonth = function (month, year) {
    month = _.isNumber(parseInt(month)) ? month : ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].indexOf(month.toString().slice(0, 3).toLowerCase());
    return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
}

var parseDateString = function (str) { // Returns an object with {month: ##, day: ##, year: ####}.
    if (!str)
        return false;
    var strArray = _.compact(str.split(/[\s,]+?/g));
    var dateObj = {
        month: 0,
        day: 0,
        year: 0
    }
    log("DATE STRING '" + JSON.stringify(str) + "' SPLIT TO: " + JSON.stringify(strArray));
    if (strArray.length != 3) {
        log("PARSE DATE STRING ERROR: '" + JSON.stringify(strArray) + "' DOES NOT PARSE TO THREE ITEMS.")
        return false;
    }
    // Check Month
    //var month = _.isNumber(parseInt(strArray[0])) ? strArray[0] : ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].indexOf(strArray[0].toString().slice(0, 3).toLowerCase());
    var month = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].indexOf(strArray[0].toString().slice(0, 3).toLowerCase());
    if (month == -1) {
        log("PARSE DATE STRING ERROR: '" + JSON.stringify(strArray[0].toString().slice(0, 3).toLowerCase()) + "' IS NOT A MONTH.");
        return false
    } else
        dateObj.month = month;

    // Check Year
    var year = parseInt(strArray[2]);
    if (year < 0) {
        log("PARSE DATE STRING ERROR: '" + JSON.stringify(year) + "' IS NOT A VALID YEAR.");
        return false;
    } else
        dateObj.year = year;

    // Check Day
    var day = parseInt(strArray[1]);
    if (day <= 0 || day > daysInMonth(month, year)) {
        log("PARSE DATE STRING ERROR: '" + JSON.stringify(day) + "' IS NOT A VALID DAY.");
        return false;
    } else
        dateObj.day = day;

    log("... Date Obj: " + JSON.stringify(dateObj));

    return dateObj;
};

var getMonthString = function (num, isShort) {
    return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][num].slice(0, isShort ? 3 : undefined);
};

var formatDateString = function (dateObj, isShort) {
    if (!dateObj)
        return "";
    return getMonthString(dateObj.month, isShort) + " " + dateObj.day + ", " + dateObj.year;
};

var dateToMinutes = function (dateObj) {
    if (!dateObj)
        return false;
    var year = dateObj.year;
    var yearsLeft = 0;
    var totalMins = 0;
    if (year >= 1950) {
        yearsLeft = year - 1950;
        totalMins += 1027046880;
    } else if (year >= 1500) {
        yearsLeft = year - 1500;
        totalMins += 790035840;
    } else if (year >= 1000) {
        yearsLeft = year - 1000;
        totalMins += 526690080;
    }
    for (var i = (year - yearsLeft); i < year; i++) {
        if (isLeapYear(i))
            totalMins += 366 * 24 * 60;
        else
            totalMins += 365 * 24 * 60;
    }
    //log("*** DATE-TO-MINS: YEAR " + JSON.stringify(dateObj.year) + " = " + JSON.stringify(totalMins));
    for (var i = 0; i < dateObj.month; i++) {
        totalMins += daysInMonth(i, year) * 24 * 60;
        //log("... ** ADDING MONTH '" + i + "' = " + daysInMonth(i, year) + " Days = " + (daysInMonth(i, year) * 24 * 60) + " MINS, TOTAL: " + JSON.stringify(totalMins));
    }
    totalMins += (dateObj.day) * 24 * 60;
    //log("... ** ADDING DATE " + dateObj.day + " = " + ((dateObj.day) * 24 * 60) + " MINS, TOTAL: " + JSON.stringify(totalMins));
    return totalMins;
};

var minutesToDate = function (mins, dateObj) {
    let year = 0;
    let month = 0;
    let day = 0;
    if (dateObj)
        mins += dateToMinutes(dateObj);
    let minsLeft = mins;
    if (mins > 1027046880) {
        year = 1950;
        minsLeft = mins - 1027046880;
    } else if (mins > 790035840) {
        year = 1500;
        minsLeft = mins - 790035840;
    } else if (mins > 526690080) {
        year = 1000;
        minsLeft = mins - 526690080;
    }
    let delta = 0;
    do {
        delta = (isLeapYear(year) ? 366 : 365) * 24 * 60;
        if (delta > minsLeft)
            break;
        minsLeft -= delta;
        year++;
    } while (true);
    let days = Math.floor(minsLeft / (24 * 60));
    let daysLeft = days;
    do {
        delta = daysInMonth(month, year);
        if (delta >= daysLeft)
            break;
        daysLeft -= delta;
        month++;
    } while (true);
    day = daysLeft;
    return {
        year: year,
        month: month,
        day: day
    };
};

var getProgressToDate = function (todaysdate, startDate, endDate) {
    log("GET PROGRESS TO DATE (" + JSON.stringify(todaysdate) + ", " + JSON.stringify(startDate) + ", " + JSON.stringify(endDate));
    todaysdate = dateToMinutes(_.isString(todaysdate) ? parseDateString(todaysdate) : todaysdate);
    startDate = dateToMinutes(_.isString(startDate) ? parseDateString(startDate) : startDate);
    endDate = dateToMinutes(_.isString(endDate) ? parseDateString(endDate) : endDate);
    log("... IN MINUTES: " + JSON.stringify(todaysdate) + ", " + JSON.stringify(startDate) + ", " + JSON.stringify(endDate));
    log("... RATIO: " + JSON.stringify((todaysdate - startDate) / (endDate - startDate)));
    return (todaysdate - startDate) / (endDate - startDate);
}
//#endregion

//#region Update Control When Switching Tabs
on("sheet:opened", function () {
    updateClans();
    updateResonance();
    updateTrackerMax("Health");
    updateTracker("Health");
    updateTrackerMax("Willpower");
    updateTracker("Willpower");
    updateTrackerMax("Blood Potency");
    updateBloodPotency();
    updateHumanity();
    updateProjectDates();
});

on("change:core-tab", function () {
    getAttrs(["core-tab"], function (v) {
        switch (parseInt(v["core-tab"])) {
            case 1:
                updateClans();
                updateResonance();
                updateTrackerMax("Health");
                updateTracker("Health");
                updateTrackerMax("Willpower");
                updateTracker("Willpower");
                updateTrackerMax("Blood Potency");
                updateBloodPotency();
                updateHumanity();
                break;
            case 4:
                updateProjectDates();
                break;
            case 6:
                updateXP();
                break;
            case 9:
                break;
        }
    });
});
//#region

//#region Update Misc Character Sheet Elements Dynamically
on("change:clan", function () {
    updateClans();
});
on("change:" + DISCIPLINEREFS.join(" change:"), function (eventInfo) {
    updateDiscs(eventInfo.sourceAttribute);
    checkForRituals();
});
on("change:resonance", function () {
    //updateRolls("RESETTING", { reset: true });
    updateResonance();
});
on("change:dob change:doe", function () {
    updateDOBDOE();
});

var updateClans = function (gN) {
    gN = gN || "";
    var asyncFuncs = [
        function (callback) {
            getAttrs(groupify(["clan", "BloodPotency"], gN), function (c) {
                let newAttrs = {
                    clanBanetitle: c[gN + "clan"] + " Clan Bane",
                    clanBane: clanBanes[c[gN + "clan"]].replace("Bane Severity", "Bane Severity (" + bpDependants[c[gN + "BloodPotency"]].bloodBaneSeverity + ")")
                };
                let clanDiscs = clanDisciplines[c[gN + "clan"]];
                for (var i = 1; i <= 3; i++) {
                    if (clanDiscs[i - 1] != "") {
                        newAttrs[gN + "clanDisc" + i + "Toggle"] = 1;
                        newAttrs[gN + "disc" + i + "_name"] = clanDiscs[i - 1];
                    } else {
                        newAttrs[gN + "clanDisc" + i + "Toggle"] = 0;
                        newAttrs[gN + "disc" + i + "_name"] = "";
                    }
                };
                setAttrs(newAttrs);
                callback(null);
            });
        },
        function (callback) {
            checkForRituals(gN);
            callback(null);
        }
    ];
    asyncQueue(asyncFuncs, function () { return; });
};

var updateDiscs = function (target) {
    getAttrs([target], function (v) {
        let attrList = {};
        attrList[target + "PowerToggle"] = v[target];
        setAttrs(attrList, { silent: true });
    });
};

var checkForRituals = function (gN) {
    gN = gN || "";
    var discNames = groupify(["Disc1_name", "Disc2_name", "Disc3_name"], gN);
    var asyncFuncs = [
        function (callback) {
            getSectionIDs(gN + "discLeft", function (ids) {
                for (var i = 0; i < ids.length; i++)
                    discNames.push("repeating_" + gN + "discLeft_" + ids[i] + "_" + gN + "discLeft_" + gN + "name");
                callback(null);
            });
        },
        function (callback) {
            getSectionIDs(gN + "discMid", function (ids) {
                for (var i = 0; i < ids.length; i++)
                    discNames.push("repeating_" + gN + "discMid_" + ids[i] + "_" + gN + "discMid_" + gN + "name");
                callback(null);
            });
        },
        function (callback) {
            getSectionIDs(gN + "discRight", function (ids) {
                for (var i = 0; i < ids.length; i++)
                    discNames.push("repeating_" + gN + "discRight_" + ids[i] + "_" + gN + "discRight_" + gN + "name");
                callback(null);
            });
        },
        function (callback) {
            getAttrs(discNames, function (vals) {
                let newAttrs = {};
                newAttrs[gN + "ritualsToggle"] = _.values(vals).includes("Blood Sorcery") ? 1 : 0;
                newAttrs[gN + "formulaeToggle"] = _.values(vals).includes("Alchemy") ? 1 : 0;
                setAttrs(newAttrs, { silent: true });
                callback(null);
            });
        }
    ];

    asyncQueue(asyncFuncs, function () { return; });
};

var updateResonance = function (gN) {
    gN = gN || "";
    getAttrs(groupify(["resonance"], gN), function (v) {
        let attrList = {};
        log("UPDATERESONANCE: " + JSON.stringify(trimrep(v)));
        attrList[gN + "resDisciplines"] = v[gN + "resonance"] == 0 ? "" : ("(" + resDisciplines[v[gN + "resonance"]].join(" & ") + ")");
        log("ATTRLIST: " + JSON.stringify(attrList));
        setAttrs(attrList);
    });
}

var updateDOBDOE = function (gN) {
    gN = gN || "";
    getAttrs(groupify(["dob", "doe"], gN), function (v) {
        let newAttrs = {}
        newAttrs[gN + "character_dobdoe"] = v[gN + "dob"] + " — " + v[gN + "doe"];
        setAttrs(newAttrs);
    });
}

//#endregion

//#region Update Tracker Lengths for Changes to Dependents
on("change:Stamina change:bonusHealth", function () {
    updateTrackerMax("Health");
});
on("change:Composure change:Resolve change:bonusWillpower", function () {
    updateTrackerMax("Willpower");
});
on("change:Generation change:bonusBloodPotency", function () {
    updateTrackerMax("Blood Potency");
    updateBloodPotency();
});

var updateTrackerMax = function (trackerName, gN) {
    gN = gN || "";
    log("Updating Tracker Max: " + trackerName);
    switch (trackerName) {
        case "Health":
            log("At Health");
            asyncFuncs = [
                function (callback) {
                    getAttrs(groupify(["Stamina", "bonusHealth"], gN), function (v) {
                        //log("New Health Score: " + JSON.stringify(Math.min(15, Math.max(1, parseInt(v.Stamina, 10) + 3 + parseInt(v.bonusHealth, 10)))));
                        let attrList = {};
                        if (gN == "")
                            attrList.health_max = Math.min(15, Math.max(1, parseInt(v.Stamina, 10) + 3 + parseInt(v.bonusHealth, 10)));
                        else
                            attrList[gN + "health_max"] = v[gN + "bonusHealth"];
                        setAttrs(attrList);
                        callback(null);
                    });
                }
            ];
            updateTracker("Health", asyncFuncs, gN);
            break;
        case "Willpower":
            log("At Willpower");
            asyncFuncs = [
                function (callback) {
                    getAttrs(groupify(["Composure", "Resolve", "bonusWillpower"], gN), function (v) {
                        //log("New Willpower Score: " + JSON.stringify(Math.min(10, Math.max(1, parseInt(v.Composure, 10) + parseInt(v.Resolve, 10) + parseInt(v.bonusWillpower, 10)))));
                        let attrList = {};
                        if (gN == "")
                            attrList.willpower_max = Math.min(10, Math.max(1, parseInt(v.Composure, 10) + parseInt(v.Resolve, 10) + parseInt(v.bonusWillpower, 10)));
                        else
                            attrList[gN + "willpower_max"] = v[gN + "bonusWillpower"];
                        setAttrs(attrList);
                        callback(null);
                    });
                }
            ];
            updateTracker("Willpower", asyncFuncs, gN);
            break;
        case "Blood Potency":
            getAttrs(groupify(["Generation", "bonusBloodPotency"], gN), function (v) {
                let attrList = {};
                attrList[gN + "bloodPotencyDotMax"] = Math.min(10, Math.max(0, generationDependants[parseInt(v[gN + "Generation"], 10)].bloodPotencyDotMax + (gN == "" ? parseInt(v[gN + "bonusBloodPotency"], 10) : 0)));
                attrList[gN + "BloodPotency"] = generationDependants[parseInt(v[gN + "Generation"], 10)].BloodPotency;
                setAttrs(attrList);
            });
            break;
    };
};
// #endregion
//#region Update Tracker Data for Tracker Changes
on("change:health_1 change:health_2 change:health_3 change:health_4 change:health_5 change:health_6 change:health_7 change:health_8 change:health_9 change:health_10 change:health_11 change:health_12 change:health_13 change:health_14 change:health_15 change:health_sDmg change:health_aDmg", function (eventInfo) {
    log(JSON.stringify(eventInfo));
    updateTracker("Health");
});
on("change:willpower_1 change:willpower_2 change:willpower_3 change:willpower_4 change:willpower_5 change:willpower_6 change:willpower_7 change:willpower_8 change:willpower_9 change:willpower_10 change:willpower_sDmg change:willpower_aDmg", function (eventInfo) {
    log(JSON.stringify(eventInfo));
    updateTracker("Willpower");
});
on("change:BloodPotency", function () {
    updateBloodPotency();
});
on("change:humanity_1 change:humanity_2 change:humanity_3 change:humanity_4 change:humanity_5 change:humanity_6 change:humanity_7 change:humanity_8 change:humanity_9 change:humanity_10 change:deltaHumanity change:deltaStains", function (eventInfo) {
    updateHumanity();
});

var updateTracker = function (trackerName, aFuncs, gN) {
    gN = gN || "";
    var attrList = {};
    var asyncFuncs = aFuncs || [];
    var boxList = [];
    var trackerName;
    var dmgBins = [[], [], []];
    var supDmg, aggDmg;
    switch (trackerName) {
        case "Health":
            log("... Pushing " + trackerName + " Update");
            asyncFuncs.push(function (callback) {
                getAttrs(groupify(["health_1", "health_2", "health_3", "health_4", "health_5", "health_6", "health_7", "health_8", "health_9", "health_10", "health_11", "health_12", "health_13", "health_14", "health_15", "health_max", "health_sDmg", "health_aDmg", "incapacitation"], gN), function (v) {
                    log(">> START >> updateTracker(" + trackerName + ")");
                    trackerName = "Health";
                    supDmg = v[gN + "health_sDmg"];
                    //log("Received Sup Dmg: " + JSON.stringify(supDmg));
                    aggDmg = v[gN + "health_aDmg"];
                    attrList = Object.assign({}, v);
                    log("Early AttrList: " + JSON.stringify(attrList));
                    attrList[gN + "health_sDmg"] = 0;
                    attrList[gN + "health_aDmg"] = 0;
                    //attrList[gN + "incapacitation"]= ;
                    //attrList[gN + "incapacitation"]= "Health:"_.compact(_.difference(incapList, incapAttributes)).join(",");
                    boxList = _.pick(v, function (val, key) {
                        let num = parseInt(key.split("_")[1]);
                        return !_.isNaN(num) && num <= v[gN + "health_max"];
                    });
                    callback(null);
                });
            });
            break;
        case "Willpower":
            incapAttributes = ["social", "mental"];
            log("... Pushing " + trackerName + " Update");
            asyncFuncs.push(function (callback) {
                getAttrs(groupify(["willpower_1", "willpower_2", "willpower_3", "willpower_4", "willpower_5", "willpower_6", "willpower_7", "willpower_8", "willpower_9", "willpower_10", "willpower_max", "willpower_sDmg", "willpower_aDmg", "incapacitation"], gN), function (v) {
                    trackerName = "Willpower";
                    //log(">> START >> updateTracker(" + trackerName + ")");
                    supDmg = v[gN + "willpower_sDmg"];
                    aggDmg = v[gN + "willpower_aDmg"];
                    attrList = Object.assign({}, v);
                    attrList[gN + "willpower_sDmg"] = 0;
                    attrList[gN + "willpower_aDmg"] = 0;
                    //var incapList = (attrList[gN + "incapacitation"]|| "").split(",");
                    //attrList[gN + "incapacitation"]= _.compact(_.difference(incapList, incapAttributes)).join(",");
                    boxList = _.pick(v, function (val, key) {
                        let num = parseInt(key.split("_")[1]);
                        return !_.isNaN(num) && num <= v[gN + "willpower_max"];
                    });
                    callback(null);
                });
            });
            break;
        default:
            break;
    };

    asyncFuncs.push(function (callback) {
        //var incapList;
        // Sort each box into a bin based on the type of damage (blank, superficial or aggravated) it currently shows.

        log(".. boxList: " + JSON.stringify(boxList));
        _.each(boxList, function (dmg, box) { dmgBins[dmg].push(box); });

        log(".... dmgBins: " + JSON.stringify(dmgBins));

        // Apply Superficial Damage:
        log("-- APPLYING SUPERFICIAL DAMAGE: " + JSON.stringify(supDmg));
        while (supDmg > 0) {
            if (dmgBins[0].length > 0) { // There's enough blank boxes for the superficial hit.
                dmgBins[1].push(dmgBins[0].pop());
                supDmg--;
            } else if (dmgBins[1].length > 0) {      // The boxes are all filled, try to upgrade to aggravated.
                dmgBins[2].push(dmgBins[1].pop());
                supDmg--;
            } else                             // All boxes are filled with Aggravated: Death.
                break;
        };
        log("  ---- dmgBins: " + JSON.stringify(dmgBins));

        // Apply Superficial Healing:
        log("-- APPLYING SUPERFICIAL HEALING: " + JSON.stringify(supDmg));
        while (supDmg < 0) {
            if (dmgBins[1].length > 0) {      // Superficial damage present, so heal.
                dmgBins[0].push(dmgBins[1].pop());
                supDmg++;
            } else
                break;
        };
        log("  ---- dmgBins: " + JSON.stringify(dmgBins));

        // Apply Aggravated Damage:
        while (aggDmg > 0) {
            if (dmgBins[0].length > 0) {
                dmgBins[2].push(dmgBins[0].pop());
                aggDmg--;
            } else if (dmgBins[1].length > 0) {
                dmgBins[2].push(dmgBins[1].pop());
                aggDmg--;
            } else
                break;
        };
        // Apply Aggravated Healing:
        while (aggDmg < 0) {
            if (dmgBins[2].length > 0) {
                dmgBins[0].push(dmgBins[2].pop());
                aggDmg--;
            } else
                break;
        };
        if (dmgBins[0].length == 0) {
            attrList[gN + "incapacitation"] = _.compact(_.uniq(_.union((attrList[gN + "incapacitation"] || "").split(","), [trackerName]))).join(",");
            attrList[gN + "impairmentToggle" + trackerName] = 1;
        } else {
            attrList[gN + "incapacitation"] = _.compact(_.uniq(_.difference((attrList[gN + "incapacitation"] || "").split(","), [trackerName]))).join(",");
            attrList[gN + "impairmentToggle" + trackerName] = 0;
        }
        var binNum = 0;
        _.each(dmgBins, function (bin) {
            log("PROCESSING BIN #" + binNum + ": " + JSON.stringify(bin));
            _.each(bin, function (box) {
                attrList[box] = binNum;
            });
            binNum++;
        });
        log(".. ATTRLIST: " + JSON.stringify(attrList));
        attrList[gN + trackerName] = dmgBins[0].length;
        log("... adding length: " + JSON.stringify(attrList));
        setAttrs(attrList);
        callback(null);
    });

    asyncQueue(asyncFuncs, function () {
        log(">> END >> updateTracker");
        return;
    });
};

var updateBloodPotency = function (gN) {
    gN = gN || "";
    getAttrs(groupify(["clan", "BloodPotency"], gN), function (v) {
        log(">> START >> UPDATEBLOODPOTENCY()"); let attrList = {};
        _.each(bpDependants[v[gN + "BloodPotency"]], function (v, k) { attrList[gN + k] = v; });
        attrList[gN + "BloodPotency"] = v[gN + "BloodPotency"];
        log("Blood Potency at " + JSON.stringify(v[gN + "BloodPotency"]));
        log("Full Attrs: " + JSON.stringify(trimrep(v)));
        attrList[gN + "bloodSurgeText"] = attrList[gN + "bloodSurge"] == 0 ? "None" : ("+" + (attrList[gN + "bloodSurge"] == 1 ? attrList[gN + "bloodSurge"] + " Die" : (attrList[gN + "bloodSurge"] + " Dice")));
        attrList[gN + "bloodMendText"] = attrList[gN + "bloodMend"] == 0 ? "None" : (attrList[gN + "bloodMend"] + " Superficial");
        attrList[gN + "bloodDiscBonusText"] = attrList[gN + "bloodDiscBonus"] == 0 ? "None" : ("+" + (attrList[gN + "bloodDiscBonus"] == 1 ? attrList[gN + "bloodDiscBonus"] + " Die" : (attrList[gN + "bloodDiscBonus"] + " Dice")) +
            [";  Never Rouse x2.", ";  Rouse x2 for Level 1.", ";  Rouse x2 for Levels 1 & 2.", ";  Rouse x2 for Levels 1, 2, 3.", ";  Rouse x2 for Levels 1 - 4.", ";  Rouse x2 for All Levels."][attrList[gN + "bloodRouseReroll"]]);
        attrList[gN + "baggedSlakeMult"] = attrList[gN + "animalSlakeMult"];
        attrList[gN + "bloodFeedingPenalties"] = ("Animals & bagged blood slake " + { 0: "no", 0.5: "half", 1: "full" }[attrList[gN + "animalSlakeMult"]] + " Hunger.\n") +
            (attrList[gN + "humanSlakePenalty"] == 0 ? "Humans slake full Hunger.\n" : (attrList[gN + "humanSlakePenalty"] + " Hunger slaked from humans.\n")) +
            ("Must kill to reduce Hunger below " + attrList[gN + "killSlakeThreshold"] + ".");
        setAttrs(attrList);
        log(">> END >> UPDATEBLOODPOTENCY()");
    });
    return;
};

var updateHumanity = function (stat, gN) {
    gN = gN || "";
    getAttrs(groupify(["humanity_1", "humanity_2", "humanity_3", "humanity_4", "humanity_5", "humanity_6", "humanity_7", "humanity_8", "humanity_9", "humanity_10", "deltaHumanity", "deltaStains"], gN), function (v) {
        // 1) Determine Current Humanity & Stains
        //      EMPTY BOX CLICKED?  -->  Fill with Stains AND set "last changed dot" variable to that box
        //      STAIN CLICKED? ---> IF last changed dot, change to HUMANITY and fill empties to left with humanity.  OTHERWISE, change it to empty and empty all stains to left
        //      HUMANITY CLICKED? ---> Turn blank, and all humanity to the right.
        //      ... THEN set Humanity and Stains attributes.
        //
        // 2) DeltaHumanity/DeltaStains set?
        //      Change corresponding boxes.
        //          If +dHumanity hits a Stain, stop.
        //          If +dStain hits Humanity, trigger Degeneration impairment.
        //      Set deltaHumanity/deltaStains to zero.
        let attrList = {};
        attrList[gN + "Humanity"] = _.filter(_.values(_.omit(v, groupify(["deltaHumanity", "deltaStains"], gN))), function (attrVal) {
            return parseInt(attrVal) == 1;
        }).length + parseInt(v[gN + "deltaHumanity"]);
        attrList[gN + "Stains"] = _.filter(_.values(_.omit(v, groupify(["deltaHumanity", "deltaStains"], gN))), function (attrVal) {
            return parseInt(attrVal) == 2;
        }).length + parseInt(v[gN + "deltaStains"]);
        attrList[gN + "deltaStains"] = 0;
        attrList[gN + "deltaHumanity"] = 0;
        setAttrs(attrList);
    });
    return;
};
// #endregion

//#region TIME DEPENDENTS: Update Projects, Memoriam and Time
on("change:todaysdate", function () {
    updateProjectDates();
});

var updateProjectDates = function () {
    var attrList = ["todaysdate"];
    var idList = [];
    getSectionIDs("project", function (idarray) {
        _.each(idarray, function (id) {
            _.each(["projectstartdate", "projectenddate", "projectincnum", "projectinccounter", "projectincunit", "projectlaunchrollToggle", "projectlaunchresults"], function (stat) {
                attrList.push("repeating_project_" + id + "_" + stat);
            });
            idList.push(id);
        });
        getAttrs(attrList, function (v) {
            log("UPDATING DATES: V: " + JSON.stringify(trimrep(v)));
            var newAttrList = {};
            _.each(idList, function(id) {
                var prefix = "repeating_project_" + id + "_";
                let counterPos = 11;
                let currentPos = parseInt(v[prefix + "projectinccounter"]);
                if (parseInt(v[prefix + "projectlaunchrollToggle"]) == 2 && !v[prefix + "projectlaunchresults"].includes("TOTAL")) {
                    counterPos = 10 - Math.floor(10 * getProgressToDate(v.todaysdate, v[prefix + "projectstartdate"], v[prefix + "projectenddate"]));
                    log("... NEW COUNTER POS: " + JSON.stringify(counterPos));
                }
                if (counterPos != currentPos) {
                    log("... UPDATING INCCOUNTER");
                    newAttrList[prefix + "projectinccounter"] = counterPos;
                }
            });
            setAttrs(newAttrList);
        });
    });
}


on("change:repeating_" + PROJREPSECTIONS.join(" change:repeating_") + " remove:repeating_" + PROJREPSECTIONS.join(" remove:repeating_"), function (eventInfo) {
    log("ACTIVATION BY: " + JSON.stringify(eventInfo));
    updateProjects(eventInfo.sourceAttribute);
    return;
});

var checkLaunchToggle = function (source) {
    var attrList = [];
    var prefix = source.split("_").slice(0, 3).join("_") + "_";
    var stat = source.split("_").slice(3).join("_");
    _.each(["projectlaunchtrait1_name", "projectlaunchtrait1", "projectlaunchtrait2_name", "projectlaunchtrait2", "projectscope", "projectlaunchresults", "projectlaunchdiff", "projectlaunchdiffmod"], function (s) {
        attrList.push(prefix + s);
    });
    getAttrs(attrList, function (v) {
        log(JSON.stringify(stat) + ": CHECK LAUNCH TOGGLE: " + JSON.stringify(trimrep(v)));
        var newAttrs = {};
        let scope = parseInt(v[prefix + "projectscope"]);
        let launchDiffMod = parseInt(v[prefix + "projectlaunchdiffmod"]) || 0;
        let traits = [];
        _.each(["projectlaunchtrait1", "projectlaunchtrait2"], function (r) {
            traits.push({name: v[prefix + r + "_name"], value: parseInt(v[prefix + r])});
        });
        let results = v[prefix + "projectlaunchresults"];
        if (results.includes("SUCCESS") || results.includes("CRITICAL") || results.includes("TOTAL"))
            newAttrs[prefix + "projectlaunchrollToggle"] = 2;
        else if (!scope) {
            newAttrs[prefix + "projectlaunchrollToggle"] = 0;
            newAttrs[prefix + "projectlaunchdiff"] = "";
        } else {
            let launchTraitCheck = [];
            _.each(traits, function (trt) {
                if (!trt.value || trt.value == 0)
                    launchTraitCheck.push(trt.name == "" ? 0 : -1);
                else
                    launchTraitCheck.push(trt.name == "" ? -1 : 1);
            });
            newAttrs[prefix + "projectlaunchdiff"] = scope + 2 + launchDiffMod;
            if (launchTraitCheck.includes(-1) || !launchTraitCheck.includes(1)) {
                newAttrs[prefix + "projectlaunchrollToggle"] = 0;
                setAttrs(newAttrs);
            } else {
                setAttrs(newAttrs);
                prepLaunchButton(source);
            }
        }
        log("DONE CHECK LAUNCH TOGGLE!");
        return;
    });
    return;
}

var prepLaunchButton = function (source) {
    var attrList = [];
    var prefix = source.split("_").slice(0, 3).join("_") + "_";
    var stat = source.split("_").slice(3).join("_");
    _.each(["projectlaunchtrait1", "projectlaunchtrait2"], function (s) {
        attrList.push(prefix + s + "_name");
        attrList.push(prefix + s);
    });
    attrList.push(prefix + "projectlaunchmod");
    attrList.push(prefix + "projectscope");
    attrList.push(prefix + "projectlaunchdiffmod");
    getAttrs(attrList, function (v) {
        log(JSON.stringify(stat) + ": PREP LAUNCH BUTTON: " + JSON.stringify(trimrep(v)));
        var newAttrs = {};
        newAttrs[prefix + "projectlaunchrollToggle"] = 1;
        log("PREPLAUNCH V: " + JSON.stringify(trimrep(v)));
        let launchDiffMod = parseInt(v[prefix + "projectlaunchdiffmod"]) || 0;
        let launchDiff = parseInt(v[prefix + "projectscope"]) + 2 + launchDiffMod;
        let traits = [[v[prefix + "projectlaunchtrait1_name"], parseInt(v[prefix + "projectlaunchtrait1"])], [v[prefix + "projectlaunchtrait2_name"], parseInt(v[prefix + "projectlaunchtrait2"])]];
        log("TRAITS: " + JSON.stringify(traits));
        if (traits[0][0] != "" && traits[1][0] != "" && traits[0][1] && traits[0][1] > 0 && traits[1][1] && traits[1][1] > 0 && launchDiff) {
            let traitString = [traits[0].join(":"), traits[1].join(":")].join(",");
            newAttrs[prefix + "projectlaunchroll_params"] = "@{character_name}|" + traitString + "|" + launchDiff + "|" + parseInt(v[prefix + "projectlaunchmod"]) + "|" + launchDiffMod + "|" + prefix;
        }
        setAttrs(newAttrs);
        log("DONE PREP LAUNCH BUTTON!");
        return;
    });
    return;
}

var updateProjects = function (source) {
    var attrList = [];
    var row = source.split("_").slice(0, 3).join("_");
    var stat = source.split("_").slice(3).join("_");
    var prefix = row + "_";
    var intMins = 0;
    if (["projectstartdate", "projectincnum", "projectincunit"].includes(stat)) {
        _.each(["projectstartdate", "projectincnum", "projectincunit"], function (s) {
            attrList.push(row + "_" + s);
        });
        attrList.push("todaysdate");
        attrList.push("repeatingprojectslist");
        getAttrs(attrList, function (v) {
            log(JSON.stringify(stat) + ": UPDATE PROJECTS V: " + JSON.stringify(trimrep(v)));
            var newAttrs = {};
            if (!v.repeatingprojectslist.includes(row)) {
                newAttrs.repeatingprojectslist = v.repeatingprojectslist + "," + row;
                newAttrs[prefix + "projectsrowid"] = row;
            }
            let sDate = parseDateString(v[prefix + "projectstartdate"]);
            let cDate = parseDateString(v.todaysdate);
            if (!sDate) {
                sDate = cDate;
                newAttrs[prefix + "projectstartdate"] = v.todaysdate;
            }
            let inc = parseInt(v[prefix + "projectincnum"]);
            let iUnit = v[prefix + "projectincunit"];
            if (!cDate || !inc || inc == 0 || !iUnit || parseInt(iUnit) == 0) {
                log("UPDATE PROJECTS GET ATTRS: MISSING TERM. SDATE: '" + JSON.stringify(sDate) + "', cDATE: '" + JSON.stringify(cDate) + "', INC: '" + JSON.stringify(inc) + "', iUNIT: '" + JSON.stringify(iUnit) + "'");
                newAttrs[prefix + "projectenddate"] = "";
                newAttrs[prefix + "projectinccounter"] = 11;
            } else {
                let year = sDate.year;
                switch (iUnit) {
                    case "hours":
                        intMins = 60 * inc * 10;
                        break;
                    case "days":
                        intMins = 24 * 60 * inc * 10;
                        break;
                    case "weeks":
                        intMins = 7 * 24 * 60 * inc * 10;
                        break;
                    case "months":
                        let month = sDate.month;
                        for (var i = 0; i < (inc * 10) ; i++) {
                            if (month > 11) {
                                month -= 12;
                                year++;
                            }
                            intMins += daysInMonth(month, year) * 24 * 60;
                            month++;
                        }
                        break;
                    case "years":
                        year = sDate.year;
                        for (var i = 0; i < (inc * 10) ; i++) {
                            intMins += (isLeapYear(year + i) ? 366 : 365) * 24 * 60;
                        }
                        break;
                }
                log("UPDATE PROJECT GET ATTRS: INTMINS = " + JSON.stringify(intMins));
                let eDate = minutesToDate(dateToMinutes(sDate) + intMins);
                log(">>> eDATE: " + JSON.stringify(eDate));
                newAttrs[prefix + "projectenddate"] = formatDateString(eDate);
                updateProjectDates();
            }
            setAttrs(newAttrs);
            log("DONE UPDATE PROJECTS (" + JSON.stringify(stat) + ")!");
            return;
        });
        return;
    } else if (["projectscope", "projectlaunchdiff", "projectlaunchdiffmod", "projectlaunchresults"].includes(stat)) {
        attrList.push(prefix + "projectscope");
        attrList.push(prefix + "projectlaunchdiffmod");
        getAttrs(attrList, function (v) {
            log(JSON.stringify(stat) + ": UPDATE PROJECTS V: " + JSON.stringify(trimrep(v)));
            var newAttrs = {};
            let scope = parseInt(v[prefix + "projectscope"]);
            if (!scope)
                newAttrs[prefix + "projectlaunchdiff"] = "";
            else
                newAttrs[prefix + "projectlaunchdiff"] = scope + 2 + (parseInt(v[prefix + "projectlaunchdiffmod"]) || 0);
            setAttrs(newAttrs);
            checkLaunchToggle(source);
            log("DONE UPDATE PROJECTS (" + JSON.stringify(stat) + ")!");
            return;
        });
        return;
    } else if (["projectlaunchtrait1_name", "projectlaunchtrait1", "projectlaunchtrait2_name", "projectlaunchtrait2", "projectlaunchmod"].includes(stat)) {
        checkLaunchToggle(source);
        return;
    } else if (["projectstake1", "projectstake2", "projectstake3", "projectstake4", "projectstake5", "projectstake6"].includes(stat)) {
        _.each(["projectstake1", "projectstake2", "projectstake3", "projectstake4", "projectstake5", "projectstake6"], function (v) {
            attrList.push(prefix + v);
        });
        attrList.push(prefix + "projectlaunchresults");
        //attrList.push(prefix + "projectlaunchresultsmargin");
        attrList.push(prefix + "projecttotalstake");
        attrList.push(prefix + "projectwasrushed");
        attrList.push(prefix + "projectrushstakelost");
        //attrList.push(prefix + "projectrushstakelosttogo");
        getAttrs(attrList, function (v) {
            log(JSON.stringify(stat) + ": UPDATE PROJECTS V: " + JSON.stringify(trimrep(v)));
            var newAttrs = {};
            if (v[prefix + "projectlaunchresults"].includes("CRITICAL") || v[prefix + "projectlaunchresults"].includes("FAIL"))
                return;
            if (v[prefix + "projectwasrushed"] == 0) {
                let stakeRemaining = Math.max(0, parseInt(v[prefix + "projecttotalstake"]) - (parseInt(v[prefix + "projectstake1"]) + parseInt(v[prefix + "projectstake2"]) + parseInt(v[prefix + "projectstake3"]) + parseInt(v[prefix + "projectstake4"]) + parseInt(v[prefix + "projectstake5"]) + parseInt(v[prefix + "projectstake6"])));
                if (stakeRemaining > 0)
                    newAttrs[prefix + "projectlaunchresultsmargin"] = "Stake " + v[prefix + "projecttotalstake"] + " Dots (" + stakeRemaining + " to go)";
                else
                    newAttrs[prefix + "projectlaunchresultsmargin"] = v[prefix + "projecttotalstake"] + " Dots Staked";
            } else {
                // Track the stakes the player still has to sacrifice.
            }
            setAttrs(newAttrs);
            log("DONE UPDATE PROJECTS (" + JSON.stringify(stat) + ")!");
            return;
        });
        return;
    } else if (["projectwasrushed"].includes(stat)) {
        attrList.concat(_.map(["projectstake1", "projectstake2", "projectstake3", "projectstake4", "projectstake5", "projectstake6"], function (v) { return prefix + v; }));
        attrList.push(prefix + "projectwasrushed");
        attrList.push(prefix + "projectrushstakelost");
        getAttrs(attrList, function (v) {
            log(JSON.stringify(stat) + ": UPDATE PROJECTS V: " + JSON.stringify(trimrep(v)));
            // If the rush was a failure, wipe all of the projectstake values AFTER summing and recording them in projectstakesatrush, and track which stakes the player is losing by them filling in the same boxes again.
            log("DONE UPDATE PROJECTS (" + JSON.stringify(stat) + ")!");
        });
    }
    return;
}
//#endregion

/* "projectstake1_name", "projectstake1", "projectstake2_name", "projectstake2", "projectstake3_name", "projectstake3", "projectstake4_name", "projectstake4", "projectstake5_name", "projectstake5", "projectstake6_name", "projectstake6", "projectlaunchresults", "projectlaunchresultsmargin", "projectlaunchdiffmod"];
const PROJREPATTRS = ["projectenddate", "projectinccounter", "projectscope_name", "projectlaunchdiff", "projectlaunchrollToggle", "projectlaunchroll_params", "projectrushpool", "projectrushstakelost", "projectrushstakelosttogo"];*/

//#region Update Experience Page with Costs & Expenditures
on("sheet:opened change:repeating_" + XPREPSECTIONS.join(" change:repeating_") + " remove:repeating_" + XPREPSECTIONS.join(" remove:repeating_"), function (eventInfo) {
    updateXP();
    return;
});

var updateXP = function () {
    getSectionIDs("spentxp", function (idarray) {
        var attrList = [];
        var idList = {
            spentxp: [],
            earnedxp: []
        };
        _.each(idarray, function (id) {
            _.each(XPREPREFS.spent.concat(XPREPFLAGS), function (stat) {
                attrList.push("repeating_spentxp_" + id + "_" + stat);
            });
            idList.spentxp.push(id);
        });
        getSectionIDs("earnedxp", function (idarray) {
            _.each(idarray, function (id) {
                _.each(XPREPREFS.earned, function (stat) {
                    attrList.push("repeating_earnedxp_" + id + "_" + stat);
                });
                idList.earnedxp.push(id);
            });
            getAttrs(attrList, function (v) {
                var newAttrList = {};
                var earnedTotal = 0;

                _.each(idList.earnedxp, function (rowId) {
                    //log("Calcing for " + rowId);
                    var prefix = "repeating_earnedxp_" + rowId + "_";
                    //log("XP Award = " + JSON.stringify(v[prefix + "xp_award"]));
                    earnedTotal += parseInt(v[prefix + "xp_award"] || 0);
                });

                var spentTotal = 0;
                //log("ID LIST: " + JSON.stringify(idList));
                //log("XP ARRAY: "  + JSON.stringify(trimrep(v)));
                //log("Earned Total: " + JSON.stringify(earnedTotal));
                //log("SPENT TOTAL A: " + JSON.stringify(spentTotal));
                //log("IDLIST.SPENT = " + JSON.stringify(idList.spent));
                _.each(idList.spentxp, function (rowId) {
                    var prefix = "repeating_spentxp_" + rowId + "_";
                    var cat = v[prefix + "xp_category"];
                    _.each(["xp_traittoggle", "xp_initialtoggle", "xp_newtoggle"], function (toggle) {
                        let thisToggle = prefix + toggle;
                        newAttrList[thisToggle] = XPPARAMS[cat].colToggles.includes(toggle) ? 1 : 0;
                    });
                    newAttrList[prefix + "xp_arrowtoggle"] = (XPPARAMS[cat].colToggles.includes("xp_initialtoggle") && XPPARAMS[cat].colToggles.includes("xp_newtoggle")) ? 1 : 0;
                    if (XPPARAMS[cat]) {
                        if (
                            (!XPPARAMS[cat].colToggles.includes("xp_traittoggle") || v[prefix + "xp_trait"] != "") &&
                            (!XPPARAMS[cat].colToggles.includes("xp_initialtoggle") || v[prefix + "xp_initial"] != "") &&
                            (!XPPARAMS[cat].colToggles.includes("xp_newtoggle") || v[prefix + "xp_new"] != "")) {
                            if (XPPARAMS[cat].colToggles.includes("xp_newtoggle")) {
                                var delta = 0;
                                if (XPPARAMS[cat].colToggles.includes("xp_initialtoggle")) {
                                    if (cat === "Advantage")
                                        delta = (parseInt(v[prefix + "xp_new"]) - parseInt(v[prefix + "xp_initial"])) * XPPARAMS[cat].cost;
                                    else
                                        for (var i = parseInt(v[prefix + "xp_initial"]) ; i < parseInt(v[prefix + "xp_new"]) ; i++)
                                            delta += (i + 1) * XPPARAMS[cat].cost;
                                } else
                                    delta = parseInt(v[prefix + "xp_new"]) * XPPARAMS[cat].cost;
                                newAttrList[prefix + "xp_cost"] = Math.max(0, delta);
                            } else
                                newAttrList[prefix + "xp_cost"] = Math.max(0, XPPARAMS[cat].cost);
                            if (v[prefix + "xp_spenttoggle"] == "on" && newAttrList[prefix + "xp_cost"] > 0) {
                                spentTotal += newAttrList[prefix + "xp_cost"] || 0;
                            }
                            if (newAttrList[prefix + "xp_cost"] == 0)
                                newAttrList[prefix + "xp_cost"] = "";
                        }
                    }
                });
                newAttrList.xp_summary = earnedTotal + " XP Earned";
                newAttrList.xp_summary += spentTotal > 0 ? (" - " + spentTotal + " XP Spent =  " + (earnedTotal - spentTotal) + " XP Remaining") : "";
                log("NEW ATTRS: " + JSON.stringify(newAttrList));
                setAttrs(newAttrList);
            });
        });
    });
};


        // ALL are in fieldsets, so figure out repStats first
        // Initial toggle must be set manually, since it can't be read from the sheet as it will change

        // FOR EACH EARNED LINE:
        // xp_earnedTotal += xp_earned
        // FOR EACH SPENT LINE:
        // xp_cost = ((NewValue - (OldValue || 0)) || 1) * Cost
        // IF xp_spenttoggle THEN var totalSpent += xp_cost
        // xp_remaining = xp_earnedTotal - totalSpent
        // xp_summary = xp_earnedTotal + " XP Earned — " + totalSpent + " XP Spent = " + xp_remaining + " XP"


//#endregion

//#region Update Dice Roller on Changes to Basic, Enumerated & Fieldset Stats or Flags

on("sheet:opened change:repeating_" + REPSECTIONS.join(" change:repeating_") + " remove:repeating_" + REPSECTIONS.join(" remove:repeating_"), function (eventInfo) {
    if (eventInfo.sourceAttribute && _.filter(ATTRBLACKLIST, function (blackStat) { return eventInfo.sourceAttribute.includes(blackStat); }).length > 0)
        return;
    log("RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR");
    log(JSON.stringify(eventInfo));
    log("RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR");
    if (eventInfo.sourceType === "sheetworker")
        return;
    updateRepSections({ stat: eventInfo.sourceAttribute, source: eventInfo.sourceType.slice(0, 2), silent: false });
    return;
});
var watchString = "change:" + statFlags.join(" change:");
//log(JSON.stringify(watchString));
on(watchString, function (eventInfo) {
    log("@@@@@@@@@@@@@@@@@@@@@@@@@");
    log(JSON.stringify(eventInfo));
    log("@@@@@@@@@@@@@@@@@@@@@@@@@");
    if (_.filter(ATTRBLACKLIST, function (blackStat) { return eventInfo.sourceAttribute.includes(blackStat); }).length > 0)
        return;
    if (eventInfo.sourceType === "sheetworker")
        return;
    updateRolls(eventInfo.sourceAttribute.replace("_flag", "").replace("_name", "").replace("_type", ""), { source: eventInfo.sourceType.slice(0, 2), silent: true }); //, silent: eventInfo.sourceType === "sheetworker"
    return;
});
on("change:rollDiff change:rollMod change:Hunger change:applyDiscipline change:applyBloodSurge change:applySpecialty change:applyResonant change:incapacitation", function (eventInfo) {
    log("@@@@@@@@@@@@@@@@@@@@@@@@@");
    log(JSON.stringify(eventInfo));
    log("@@@@@@@@@@@@@@@@@@@@@@@@@");
    updateRolls("rolltype", { source: eventInfo.sourceType.slice(0, 2), triggerAttr: eventInfo.sourceAttribute, silent: true }); //, silent: eventInfo.sourceType === "sheetworker"
    return;
});

var updateRepSections = function (options) {
    var repStats = [];

    _.each(REPSECTIONS, function (sec) {
        getSectionIDs(sec, function (idArray) {
            _.each(idArray, function (id) {
                repStats.push("repeating_" + sec + "_" + id + "_" + sec);
            });
            log("@@@@: SETTING REPATTRS: " + JSON.stringify({ repStats: repStats.join(",") }));
            setAttrs({ repStats: repStats.join(",") });
            if (sec == REPSECTIONS[REPSECTIONS.length - 1] && options.stat && options.stat.includes("_flag")) {
                updateRolls(options.stat.replace("_flag", ""), options, repStats.join(","));
            }
        });
    });
    return;
};

var updateRolls = function (stat, options, repString) {
    options = options || {};
    logPrefix = "[ UR(" + stat + ": " + options.source + ")" + (options.triggerAttr ? (" (" + JSON.stringify(options.triggerAttr) + ")") : "") + " ] ";
    logDepth = 0;

    getAttrs(["repStats"], function (r) {
        repString = repString || r.repStats;
        log("@@@@ REPSTRING IN UPDATE ROLLS: " + JSON.stringify(repString));

        var type, stat_flag;
        var rArray = [];
        var newRArray = [];
        var repStats = repString ? repString.split(",") : [];
        var allStats = basicStats.concat(repStats);
        var attrArray = REFERENCESTATS.concat(basicStats).concat(_.map(basicStats, function (s) { return s + "_flag"; }));
        _.each(ENUMSTATS, function (s) {
            attrArray.push(s + "_name");
        });
        var getRepKeys = function (repStats, suffix) {
            if (repStats.length == 0)
                return null;
            if (!_.isString(suffix))
                return getRepKeys(repStats, "_name").concat(getRepKeys(repStats, "_flag")).concat(getRepKeys(repStats, ""));
            else
                return _.map(repStats, function (stat) { return ("repeating_" + stat).replace("repeating_repeating", "repeating") + suffix; });
        };
        _.each(getRepKeys(repStats), function (s) {
            attrArray.push(s);
        });

        log("@@@ FINAL ATTRARRAY = '" + JSON.stringify(attrArray));


        getAttrs(attrArray, function (v) {
            log("attrArray = "  + JSON.stringify(trimrep(v)), true);
            if (!options.silent) {
                log(">>>>>>>>>>>");
                log(">>> START >>> UPDATEROLLS(" + stat + ")" + (options.triggerAttr ? (" (" + JSON.stringify(options.triggerAttr) + ")") : ""));
                log(">>>>>>>>>>>");
            } else {
                log("( silent start ) UPDATEROLLS(" + stat + ")" + (options.triggerAttr ? (" (" + JSON.stringify(options.triggerAttr) + ")") : ""));
            }

            var newAttrs = {};
            var isFlagChanged = false;

            var isIn = function (ndl, hay) {
                hay = hay || v;
                ndl = "\\b" + ndl + "\\b";
                var result;
                if (_.isArray(hay)) {
                    let index = _.findIndex(_.flatten(hay), function (s) {
                        return s.match(new RegExp(ndl, "i")) !== null || s.match(new RegExp(ndl.replace(/_/g), "i")) !== null;
                    });
                    result = index == -1 ? false : _.flatten(hay)[index];
                } else if (_.isObject(hay)) {
                    let index = _.findIndex(_.keys(hay), function (s) {
                        return s.match(new RegExp(ndl, "i")) !== null || s.match(new RegExp(ndl.replace(/_/g), "i")) !== null || s.match(new RegExp(ndl + "_name", "i"));
                    });
                    result = index == -1 ? false : _.keys(hay)[index];
                } else
                    result = hay.match(new RegExp(ndl, "i")) !== null;
                return result || false;
            };

            var realName = function (stat, statList, isHalting) {
                statList = statList || v;
                stat = stat.replace("_flag", "").replace("_name");
                if (isHalting)
                    return statList[isIn(stat + "_name", statList)] || isIn(stat, statList);
                else
                    return statList[isIn(stat + "_name", statList)] || isIn(stat, statList) || realName(stat, _.union(ATTRIBUTES, SKILLS, DISCIPLINES, TRACKERS), true);
            };

            var checkType = function (stat) {
                // Returns type of stat sent in as parameter.
                var name = realName(stat);
                if (isIn(name, _.values(ATTRIBUTES)))
                    return "attribute";
                else if (isIn(name, _.values(SKILLS)))
                    return "skill";
                else if (isIn(stat, "repeating_advantage"))
                    return "advantage";
                else if (isIn(name, DISCIPLINES))
                    return "discipline";
                else if (isIn(name, TRACKERS))
                    return "tracker";
                else {
                    log("CkType(" + JSON.stringify(stat) + "): Can't Determine Type");
                    return false;
                }
            };

            var checkFlag = function (stat) {
                if (!_.isString(stat)) {
                    log("CHECKFLAG(" + JSON.stringify(stat) + ") is NOT A STRING.");
                    return false;
                };
                let flag = isIn(stat.replace("_flag", "").replace("_name", "") + "_flag");
                var result;
                if (flag == false || parseInt(v[flag]) == 0)
                    result = false;
                else
                    result = true;
                return result;
            };

            if (stat !== "rolltype") {
                stat = isIn(stat);
                _.each(["rollDiff", "rollMod", "applyDiscipline", "applyBloodSurge", "applySpecialty", "applyResonant"], function (attr) {
                    newAttrs[attr] = 0;
                });
            };

            // First, all stats are searched, and flagged stats are added to rArray.
            log(">>> FINDING STATS CURRENTLY FLAGGED ON SHEET...");
            logDepth++;
            allStats.forEach(function (x) {
                if (checkFlag(x)) {
                    rArray.push(x);
                    log(">>> FOUND: '" + JSON.stringify(x) + "'");
                }
            });
            log(">>> PREVIOUS R-ARRAY: '" + JSON.stringify(v.rollArray) + "'");
            log(">>> NEW R-ARRAY: '" + JSON.stringify(rArray) + "'");

            // IF RESETTING, clear all selected flags and other related parameters:
            if (options.reset) {
                _.each(["rollArray", "rollflagdisplay", "roll_params"], function (attr) {
                    newAttrs[attr] = "";
                    v[attr] = "";
                });
                _.each(["rollDiff", "rollMod", "applyDiscipline", "applyBloodSurge", "applySpecialty", "applyResonant"].concat(_.map(rArray, function (attr) { return attr + "_flag"; })), function (attr) {
                    newAttrs[attr] = 0;
                    v[attr] = 0;
                });
            } else {

                // Next, the roll array settings (from the last time this function was called) are stored in prevRArray.
                var prevRArray = v.rollArray && v.rollArray != "" ? v.rollArray.split(",") : [];
                log(">>> NEW PREV-R-ARRAY: " + JSON.stringify(prevRArray));
                logDepth--;

                // If the stat being updated is anything OTHER than rolltype, flag the new traits, add them to rArray, and clean up the character sheet:
                if (stat != "rolltype") {
                    log(">>> NOT A ROLLTYPE: CHECKING FLAGS...")
                    logDepth++;
                    // If the stat has been UNflagGED ...
                    if (checkFlag(stat) == 0) {
                        // ... REMOVE it from rArray.
                        isFlagChanged = true;
                        let prunedRArray = _.without(rArray, isIn(stat, rArray));
                        log(">>> --UNFLAGGING-- '" + stat + "' from R-ARRAY (" + JSON.stringify(rArray) + "'");
                        logDepth++;
                        newRArray = _.without(rArray, isIn(stat, rArray));
                        log("> NEW R-ARRAY = '" + JSON.stringify(newRArray) + "'");
                        logDepth--;
                    } else if (checkFlag(stat) != false) {
                        // Otherwise, if the stat is being FLAGGED, determine its TYPE.
                        isFlagChanged = true;
                        log(">>> ++FLAGGED++ into R-ARRAY '" + JSON.stringify(rArray) + "'");
                        logDepth++;
                        log("> PREV-R-ARRAY '" + JSON.stringify(prevRArray) + "' [LENGTH: " + prevRArray.length + "]");
                        logDepth++;
                        type = checkType(stat);
                        // Determine target rArray:
                        switch (prevRArray.length) {
                            case 0:
                                log(" ... FILLING EMPTY.");
                                newRArray = [stat];
                                break;
                            case 1:
                                // Look up FLAGACTIONS:  add = prepend; repThis = replace; skip = clear.
                                let pType = checkType(prevRArray[0]);
                                switch (FLAGACTIONS[type][checkType(prevRArray[0])]) {
                                    case "add":
                                        log(" ... ADDING (statType: " + JSON.stringify(type) + ", prevType: " + JSON.stringify(pType) + ")");
                                        newRArray = [prevRArray[0], stat];
                                        break;
                                    case "repThis":
                                    case "skip":
                                        log(" ... CLEARING (statType: " + JSON.stringify(type) + ", prevType: " + JSON.stringify(pType) + ")");
                                        newRArray = [stat];
                                        break;
                                };
                                break;
                            default:
                                // Look up FLAGACTIONS re: NEWEST first:
                                //      add = bump oldest, repThis = replace NEWEST, skip = check NEXT..
                                // If SKIP, check OLDEST in FLAGACTIONS:
                                //      add = replace newest, repThis = replace oldest, skip = clear.
                                let checkAction = function (thisType, compType, isRerunning) {
                                    switch (FLAGACTIONS[thisType][compType]) {
                                        case "add":
                                            log(" ... " + (isRerunning ? "SECOND " : "FIRST ") + "ADD: " + JSON.stringify(prevRArray) + " -> " + JSON.stringify([prevRArray[isRerunning ? 0 : 1], stat]));
                                            newRArray = [prevRArray[isRerunning ? 0 : 1], stat];
                                            break;
                                        case "repThis":
                                            log(" ... " + (isRerunning ? "SECOND " : "FIRST ") + "REPLACE: " + JSON.stringify(prevRArray) + " -> " + JSON.stringify([prevRArray[isRerunning ? 1 : 0], stat]));
                                            newRArray = [prevRArray[isRerunning ? 1 : 0], stat];
                                            break;
                                        case "skip":
                                            log(" ... " + (isRerunning ? "CLEARING " : "SKIPPING ") + JSON.stringify(prevRArray) + (isRerunning ? (" -> " + JSON.stringify([stat])) : ""));
                                            if (isRerunning)
                                                newRArray = [stat];
                                            else
                                                checkAction(thisType, checkType(prevRArray[0]), true);
                                            break;
                                    };
                                    return;
                                };
                                checkAction(type, checkType(prevRArray[1]));
                                break;
                        };

                        //Remove any duplicates from R-Array:
                        newRArray = _.uniq(newRArray);
                        logDepth--;
                        log("> NEW R-ARRAY = '" + JSON.stringify(newRArray) + "'");
                        logDepth--;
                    }
                    logDepth--;

                    // Now unflag any traits that were flagged, but aren't in the newRArray
                    log(">>> SETTING TRAITS IN R-ARRAY *NOT* IN NEW R-ARRAY TO BE CLEARED...");
                    logDepth++;
                    log("> R-ARRAY: " + JSON.stringify(rArray) + ", NEW R-ARRAY: " + JSON.stringify(newRArray));
                    var diff = rArray.filter(function (x) { return !newRArray.includes(x) });
                    log("> TRAITS TO CLEAR: " + JSON.stringify(diff));
                    var clearAttrs = {};
                    diff.forEach(function (x) {
                        clearAttrs[x + "_flag"] = 0;
                    });
                    setAttrs(clearAttrs, { silent: true });
                    // Set new R-Array:
                    rArray = _.clone(newRArray);
                    log("> ATTRS TO BE SET: " + JSON.stringify(newAttrs));
                    logDepth--;
                }

                // If we aren't flagging a new stat, final roll array equals prevRArray; otherwise, it equals rArray.
                newAttrs.rollArray = "";
                log(">>> DETERMINE R-ARRAY TO STORE FOR NEXT ROLL...");
                logDepth++;
                if (isFlagChanged) {
                    newAttrs.rollArray = rArray.join(",");
                    log("> FLAG CHANGED! 'rollArray' = " + JSON.stringify(newAttrs.rollArray));
                    rotateMarquee();
                } else {
                    newAttrs.rollArray = prevRArray.join(",");
                    log("> NO FLAG CHANGES: 'rollArray' = " + JSON.stringify(newAttrs.rollArray));
                }
                logDepth--;

                // Arrange rArray in order: ATTRIBUTES, SKILLS, then OTHERS.
                var order = [];
                rArray.filter(function (x) { return checkType(x) === "attribute"; }).forEach(function (x) { order.push(x); });
                rArray.filter(function (x) { return checkType(x) === "skill"; }).forEach(function (x) { order.push(x); });
                rArray.filter(function (x) { return ["advantage", "discipline", "tracker"].includes(checkType(x)); }).forEach(function (x) { order.push(x); });

                log(">>> ORDERING R-ARRAY: " + JSON.stringify(order));
            }

            log(">>> SETTING STAT DISPLAY FOR ROLLER...");
            logDepth++;

            newAttrs.rolldisplay = "";

            if (!order || order.length === 0) {
                if (v.rollMod == 0 && v.rollDiff == 0)
                    newAttrs.rolldisplay = "Simple Roll or Check";
                else
                    newAttrs.rolldisplay = "Simple Roll";
            } else
                newAttrs.rolldisplay = order.map(function (traitname) { return realName(traitname, v); }).join(" + ");

            log("> FIRST PASS: " + JSON.stringify(newAttrs.rolldisplay));
            var flags = [];

            if (newAttrs.rolldisplay !== "Simple Roll or Check") {
                if (v.rollMod < 0)
                    newAttrs.rolldisplay += (" " + v.rollMod).replace("-", "- ");
                else if (v.rollMod > 0)
                    newAttrs.rolldisplay += " + " + v.rollMod;
                if (v.rollDiff != 0)
                    newAttrs.rolldisplay += " vs. " + v.rollDiff;
            }

            //newAttrs.rolldisplay += ".";
            log("> FINAL DISPLAY: " + JSON.stringify(newAttrs.rolldisplay));
            logDepth--;

            if (!options.reset) {
                log(">>> DETERMINING ROLL PARAMETERS, ROLL FLAGS, AND API COMMAND...");
                logDepth++;

                // Add all stats to the parameter list:
                newAttrs.roll_params = "@{character_name}|" + order.join(","); //+ "|" + v.Hunger + "|" + v.rollDiff + "|" + v.rollMod + "|";
                log("> FIRST PASS (PARAMS): " + JSON.stringify(newAttrs.roll_params));

                // Determine Flags:
                //var flagList = [];
                //if (v.applySpecialty > 0)
                //    flagList.push("S");
                //if (v.applyBloodSurge > 0)
                //    flagList.push("B" + bpDependants[v.BloodPotency || 0].bloodSurge);
                //if (v.applyDiscipline > 0)
                //    flagList.push("D" + bpDependants[v.BloodPotency || 0].bloodDiscBonus);
                //if (v.applyResonant > 0)
                //    flagList.push("R");

                //log("> FIRST PASS (FLAGS): " + JSON.stringify(flagList));
                //logDepth++;

                //log("... INCAPACITATION: " + JSON.stringify(v.incapacitation));
                //logDepth++;

                //_.each(_.compact(v.incapacitation.split(",")), function (cat) {
                //    log("... INCAP: " + JSON.stringify(cat));
                //    logDepth++;
                //    _.each(ATTRIBUTES[cat].concat(SKILLS[cat]), function (attr) {
                //        if (order.includes(attr)) {
                //            flagList.push("I" + cat.slice(0, 1) + ":" + attr);
                //            log("... FLAG: " + JSON.stringify("I" + cat.slice(0, 1) + ":" + attr));
                //            if (!flags.includes("Impaired."))
                //                flags.push("Impaired.");
                //        }
                //    });
                //    logDepth--;
                //});
                //logDepth--;
                //logDepth--;

                //log("> FINAL (FLAGS): " + JSON.stringify(flagList));

                //newAttrs.roll_params += flagList.join(",");
                //log("> FINAL (PARAMS): " + JSON.stringify(newAttrs.roll_params));
                //logDepth--;
                //newAttrs.rollflagdisplay = flags.join("   ");
            }

            log(">>> FINAL ATTRIBUTES TO BE SET: " + JSON.stringify(newAttrs));

            // Set ATTRIBUTES so they can be used by the roll template (which will be automatically called by the button press.

            setAttrs(newAttrs, { silent: true });
        });
    });
};
//#endregion

//#region Group Sheet Actions
on("change:g1charname", function () { getAttrs(["g1charname"], function (v) { setAttrs({ g1name: v.g1charname }); }) });
on("change:g2charname", function () { getAttrs(["g2charname"], function (v) { setAttrs({ g2name: v.g2charname }); }) });
on("change:g3charname", function () { getAttrs(["g3charname"], function (v) { setAttrs({ g3name: v.g3charname }); }) });
on("change:g4charname", function () { getAttrs(["g4charname"], function (v) { setAttrs({ g4name: v.g4charname }); }) });
on("change:g5charname", function () { getAttrs(["g5charname"], function (v) { setAttrs({ g5name: v.g5charname }); }) });
on("change:g6charname", function () { getAttrs(["g6charname"], function (v) { setAttrs({ g6name: v.g6charname }); }) });
on("change:g7charname", function () { getAttrs(["g7charname"], function (v) { setAttrs({ g7name: v.g7charname }); }) });
on("change:g8charname", function () { getAttrs(["g8charname"], function (v) { setAttrs({ g8name: v.g8charname }); }) });
on("change:g9charname", function () { getAttrs(["g9charname"], function (v) { setAttrs({ g9name: v.g9charname }); }) });
on("change:g1clan", function () { updateClans("g1"); });
on("change:g1" + DISCIPLINEREFS.join(" change:g1"), function (eventInfo) {
    updateDiscs(eventInfo.sourceAttribute);
    checkForRituals("g1");
});
on("change:g1bonusHealth", function () { updateTrackerMax("Health", "g1"); });
on("change:g1bonusWillpower", function () { updateTrackerMax("Willpower", "g1"); });
on("change:g1Generation change:g1bonusBloodPotency", function () {
    updateTrackerMax("Blood Potency", "g1");
    updateBloodPotency("g1");
});
on("change:g1health_1 change:g1health_2 change:g1health_3 change:g1health_4 change:g1health_5 change:g1health_6 change:g1health_7 change:g1health_8 change:g1health_9 change:g1health_10 change:g1health_11 change:g1health_12 change:g1health_13 change:g1health_14 change:g1health_15 change:g1health_sDmg change:g1health_aDmg", function (eventInfo) {
    log(JSON.stringify(eventInfo));
    updateTracker("Health", "g1");
});
on("change:g1willpower_1 change:g1willpower_2 change:g1willpower_3 change:g1willpower_4 change:g1willpower_5 change:g1willpower_6 change:g1willpower_7 change:g1willpower_8 change:g1willpower_9 change:g1willpower_10 change:g1willpower_sDmg change:g1willpower_aDmg", function (eventInfo) {
    log(JSON.stringify(eventInfo));
    updateTracker("Willpower", null, "g1");
});
on("change:g1BloodPotency", function () {
    updateBloodPotency("g1");
});
on("change:g1humanity_1 change:g1humanity_2 change:g1humanity_3 change:g1humanity_4 change:g1humanity_5 change:g1humanity_6 change:g1humanity_7 change:g1humanity_8 change:g1humanity_9 change:g1humanity_10 change:g1deltaHumanity change:g1deltaStains", function (eventInfo) {
    updateHumanity(eventInfo.sourceAttribute, "g1");
});


on("change:g2clan", function () { updateClans("g2"); });
on("change:g2" + DISCIPLINEREFS.join(" change:g2"), function (eventInfo) {
    updateDiscs(eventInfo.sourceAttribute);
    checkForRituals("g2");
});
on("change:g2bonusHealth", function () { updateTrackerMax("Health", "g2"); });
on("change:g2bonusWillpower", function () { updateTrackerMax("Willpower", "g2"); });
on("change:g2Generation change:g2bonusBloodPotency", function () {
    updateTrackerMax("Blood Potency", "g2");
    updateBloodPotency("g2");
});
on("change:g2health_1 change:g2health_2 change:g2health_3 change:g2health_4 change:g2health_5 change:g2health_6 change:g2health_7 change:g2health_8 change:g2health_9 change:g2health_10 change:g2health_11 change:g2health_12 change:g2health_13 change:g2health_14 change:g2health_15 change:g2health_sDmg change:g2health_aDmg", function (eventInfo) {
    log(JSON.stringify(eventInfo));
    updateTracker("Health", "g2");
});
on("change:g2willpower_1 change:g2willpower_2 change:g2willpower_3 change:g2willpower_4 change:g2willpower_5 change:g2willpower_6 change:g2willpower_7 change:g2willpower_8 change:g2willpower_9 change:g2willpower_10 change:g2willpower_sDmg change:g2willpower_aDmg", function (eventInfo) {
    log(JSON.stringify(eventInfo));
    updateTracker("Willpower", null, "g2");
});
on("change:g2BloodPotency", function () {
    updateBloodPotency("g2");
});
on("change:g2humanity_1 change:g2humanity_2 change:g2humanity_3 change:g2humanity_4 change:g2humanity_5 change:g2humanity_6 change:g2humanity_7 change:g2humanity_8 change:g2humanity_9 change:g2humanity_10 change:g2deltaHumanity change:g2deltaStains", function (eventInfo) {
    updateHumanity(eventInfo.sourceAttribute, "g2");
});


on("change:g3clan", function () { updateClans("g3"); });
on("change:g3" + DISCIPLINEREFS.join(" change:g3"), function (eventInfo) {
    updateDiscs(eventInfo.sourceAttribute);
    checkForRituals("g3");
});
on("change:g3bonusHealth", function () { updateTrackerMax("Health", "g3"); });
on("change:g3bonusWillpower", function () { updateTrackerMax("Willpower", "g3"); });
on("change:g3Generation change:g3bonusBloodPotency", function () {
    updateTrackerMax("Blood Potency", "g3");
    updateBloodPotency("g3");
});
on("change:g3health_1 change:g3health_2 change:g3health_3 change:g3health_4 change:g3health_5 change:g3health_6 change:g3health_7 change:g3health_8 change:g3health_9 change:g3health_10 change:g3health_11 change:g3health_12 change:g3health_13 change:g3health_14 change:g3health_15 change:g3health_sDmg change:g3health_aDmg", function (eventInfo) {
    log(JSON.stringify(eventInfo));
    updateTracker("Health", "g3");
});
on("change:g3willpower_1 change:g3willpower_2 change:g3willpower_3 change:g3willpower_4 change:g3willpower_5 change:g3willpower_6 change:g3willpower_7 change:g3willpower_8 change:g3willpower_9 change:g3willpower_10 change:g3willpower_sDmg change:g3willpower_aDmg", function (eventInfo) {
    log(JSON.stringify(eventInfo));
    updateTracker("Willpower", null, "g3");
});
on("change:g3BloodPotency", function () {
    updateBloodPotency("g3");
});
on("change:g3humanity_1 change:g3humanity_2 change:g3humanity_3 change:g3humanity_4 change:g3humanity_5 change:g3humanity_6 change:g3humanity_7 change:g3humanity_8 change:g3humanity_9 change:g3humanity_10 change:g3deltaHumanity change:g3deltaStains", function (eventInfo) {
    updateHumanity(eventInfo.sourceAttribute, "g3");
});


on("change:g4clan", function () { updateClans("g4"); });
on("change:g4" + DISCIPLINEREFS.join(" change:g4"), function (eventInfo) {
    updateDiscs(eventInfo.sourceAttribute);
    checkForRituals("g4");
});
on("change:g4bonusHealth", function () { updateTrackerMax("Health", "g4"); });
on("change:g4bonusWillpower", function () { updateTrackerMax("Willpower", "g4"); });
on("change:g4Generation change:g4bonusBloodPotency", function () {
    updateTrackerMax("Blood Potency", "g4");
    updateBloodPotency("g4");
});
on("change:g4health_1 change:g4health_2 change:g4health_3 change:g4health_4 change:g4health_5 change:g4health_6 change:g4health_7 change:g4health_8 change:g4health_9 change:g4health_10 change:g4health_11 change:g4health_12 change:g4health_13 change:g4health_14 change:g4health_15 change:g4health_sDmg change:g4health_aDmg", function (eventInfo) {
    log(JSON.stringify(eventInfo));
    updateTracker("Health", "g4");
});
on("change:g4willpower_1 change:g4willpower_2 change:g4willpower_3 change:g4willpower_4 change:g4willpower_5 change:g4willpower_6 change:g4willpower_7 change:g4willpower_8 change:g4willpower_9 change:g4willpower_10 change:g4willpower_sDmg change:g4willpower_aDmg", function (eventInfo) {
    log(JSON.stringify(eventInfo));
    updateTracker("Willpower", null, "g4");
});
on("change:g4BloodPotency", function () {
    updateBloodPotency("g4");
});
on("change:g4humanity_1 change:g4humanity_2 change:g4humanity_3 change:g4humanity_4 change:g4humanity_5 change:g4humanity_6 change:g4humanity_7 change:g4humanity_8 change:g4humanity_9 change:g4humanity_10 change:g4deltaHumanity change:g4deltaStains", function (eventInfo) {
    updateHumanity(eventInfo.sourceAttribute, "g4");
});


on("change:g5clan", function () { updateClans("g5"); });
on("change:g5" + DISCIPLINEREFS.join(" change:g5"), function (eventInfo) {
    updateDiscs(eventInfo.sourceAttribute);
    checkForRituals("g5");
});
on("change:g5bonusHealth", function () { updateTrackerMax("Health", "g5"); });
on("change:g5bonusWillpower", function () { updateTrackerMax("Willpower", "g5"); });
on("change:g5Generation change:g5bonusBloodPotency", function () {
    updateTrackerMax("Blood Potency", "g5");
    updateBloodPotency("g5");
});
on("change:g5health_1 change:g5health_2 change:g5health_3 change:g5health_4 change:g5health_5 change:g5health_6 change:g5health_7 change:g5health_8 change:g5health_9 change:g5health_10 change:g5health_11 change:g5health_12 change:g5health_13 change:g5health_14 change:g5health_15 change:g5health_sDmg change:g5health_aDmg", function (eventInfo) {
    log(JSON.stringify(eventInfo));
    updateTracker("Health", "g5");
});
on("change:g5willpower_1 change:g5willpower_2 change:g5willpower_3 change:g5willpower_4 change:g5willpower_5 change:g5willpower_6 change:g5willpower_7 change:g5willpower_8 change:g5willpower_9 change:g5willpower_10 change:g5willpower_sDmg change:g5willpower_aDmg", function (eventInfo) {
    log(JSON.stringify(eventInfo));
    updateTracker("Willpower", null, "g5");
});
on("change:g5BloodPotency", function () {
    updateBloodPotency("g5");
});
on("change:g5humanity_1 change:g5humanity_2 change:g5humanity_3 change:g5humanity_4 change:g5humanity_5 change:g5humanity_6 change:g5humanity_7 change:g5humanity_8 change:g5humanity_9 change:g5humanity_10 change:g5deltaHumanity change:g5deltaStains", function (eventInfo) {
    updateHumanity(eventInfo.sourceAttribute, "g5");
});


on("change:g6clan", function () { updateClans("g6"); });
on("change:g6" + DISCIPLINEREFS.join(" change:g6"), function (eventInfo) {
    updateDiscs(eventInfo.sourceAttribute);
    checkForRituals("g6");
});
on("change:g6bonusHealth", function () { updateTrackerMax("Health", "g6"); });
on("change:g6bonusWillpower", function () { updateTrackerMax("Willpower", "g6"); });
on("change:g6Generation change:g6bonusBloodPotency", function () {
    updateTrackerMax("Blood Potency", "g6");
    updateBloodPotency("g6");
});
on("change:g6health_1 change:g6health_2 change:g6health_3 change:g6health_4 change:g6health_5 change:g6health_6 change:g6health_7 change:g6health_8 change:g6health_9 change:g6health_10 change:g6health_11 change:g6health_12 change:g6health_13 change:g6health_14 change:g6health_15 change:g6health_sDmg change:g6health_aDmg", function (eventInfo) {
    log(JSON.stringify(eventInfo));
    updateTracker("Health", "g6");
});
on("change:g6willpower_1 change:g6willpower_2 change:g6willpower_3 change:g6willpower_4 change:g6willpower_5 change:g6willpower_6 change:g6willpower_7 change:g6willpower_8 change:g6willpower_9 change:g6willpower_10 change:g6willpower_sDmg change:g6willpower_aDmg", function (eventInfo) {
    log(JSON.stringify(eventInfo));
    updateTracker("Willpower", null, "g6");
});
on("change:g6BloodPotency", function () {
    updateBloodPotency("g6");
});
on("change:g6humanity_1 change:g6humanity_2 change:g6humanity_3 change:g6humanity_4 change:g6humanity_5 change:g6humanity_6 change:g6humanity_7 change:g6humanity_8 change:g6humanity_9 change:g6humanity_10 change:g6deltaHumanity change:g6deltaStains", function (eventInfo) {
    updateHumanity(eventInfo.sourceAttribute, "g6");
});


on("change:g7clan", function () { updateClans("g7"); });
on("change:g7" + DISCIPLINEREFS.join(" change:g7"), function (eventInfo) {
    updateDiscs(eventInfo.sourceAttribute);
    checkForRituals("g7");
});
on("change:g7bonusHealth", function () { updateTrackerMax("Health", "g7"); });
on("change:g7bonusWillpower", function () { updateTrackerMax("Willpower", "g7"); });
on("change:g7Generation change:g7bonusBloodPotency", function () {
    updateTrackerMax("Blood Potency", "g7");
    updateBloodPotency("g7");
});
on("change:g7health_1 change:g7health_2 change:g7health_3 change:g7health_4 change:g7health_5 change:g7health_6 change:g7health_7 change:g7health_8 change:g7health_9 change:g7health_10 change:g7health_11 change:g7health_12 change:g7health_13 change:g7health_14 change:g7health_15 change:g7health_sDmg change:g7health_aDmg", function (eventInfo) {
    log(JSON.stringify(eventInfo));
    updateTracker("Health", "g7");
});
on("change:g7willpower_1 change:g7willpower_2 change:g7willpower_3 change:g7willpower_4 change:g7willpower_5 change:g7willpower_6 change:g7willpower_7 change:g7willpower_8 change:g7willpower_9 change:g7willpower_10 change:g7willpower_sDmg change:g7willpower_aDmg", function (eventInfo) {
    log(JSON.stringify(eventInfo));
    updateTracker("Willpower", null, "g7");
});
on("change:g7BloodPotency", function () {
    updateBloodPotency("g7");
});
on("change:g7humanity_1 change:g7humanity_2 change:g7humanity_3 change:g7humanity_4 change:g7humanity_5 change:g7humanity_6 change:g7humanity_7 change:g7humanity_8 change:g7humanity_9 change:g7humanity_10 change:g7deltaHumanity change:g7deltaStains", function (eventInfo) {
    updateHumanity(eventInfo.sourceAttribute, "g7");
});


on("change:g8clan", function () { updateClans("g8"); });
on("change:g8" + DISCIPLINEREFS.join(" change:g8"), function (eventInfo) {
    updateDiscs(eventInfo.sourceAttribute);
    checkForRituals("g8");
});
on("change:g8bonusHealth", function () { updateTrackerMax("Health", "g8"); });
on("change:g8bonusWillpower", function () { updateTrackerMax("Willpower", "g8"); });
on("change:g8Generation change:g8bonusBloodPotency", function () {
    updateTrackerMax("Blood Potency", "g8");
    updateBloodPotency("g8");
});
on("change:g8health_1 change:g8health_2 change:g8health_3 change:g8health_4 change:g8health_5 change:g8health_6 change:g8health_7 change:g8health_8 change:g8health_9 change:g8health_10 change:g8health_11 change:g8health_12 change:g8health_13 change:g8health_14 change:g8health_15 change:g8health_sDmg change:g8health_aDmg", function (eventInfo) {
    log(JSON.stringify(eventInfo));
    updateTracker("Health", "g8");
});
on("change:g8willpower_1 change:g8willpower_2 change:g8willpower_3 change:g8willpower_4 change:g8willpower_5 change:g8willpower_6 change:g8willpower_7 change:g8willpower_8 change:g8willpower_9 change:g8willpower_10 change:g8willpower_sDmg change:g8willpower_aDmg", function (eventInfo) {
    log(JSON.stringify(eventInfo));
    updateTracker("Willpower", null, "g8");
});
on("change:g8BloodPotency", function () {
    updateBloodPotency("g8");
});
on("change:g8humanity_1 change:g8humanity_2 change:g8humanity_3 change:g8humanity_4 change:g8humanity_5 change:g8humanity_6 change:g8humanity_7 change:g8humanity_8 change:g8humanity_9 change:g8humanity_10 change:g8deltaHumanity change:g8deltaStains", function (eventInfo) {
    updateHumanity(eventInfo.sourceAttribute, "g8");
});


on("change:g9clan", function () { updateClans("g9"); });
on("change:g9" + DISCIPLINEREFS.join(" change:g9"), function (eventInfo) {
    updateDiscs(eventInfo.sourceAttribute);
    checkForRituals("g9");
});
on("change:g9bonusHealth", function () { updateTrackerMax("Health", "g9"); });
on("change:g9bonusWillpower", function () { updateTrackerMax("Willpower", "g9"); });
on("change:g9Generation change:g9bonusBloodPotency", function () {
    updateTrackerMax("Blood Potency", "g9");
    updateBloodPotency("g9");
});
on("change:g9health_1 change:g9health_2 change:g9health_3 change:g9health_4 change:g9health_5 change:g9health_6 change:g9health_7 change:g9health_8 change:g9health_9 change:g9health_10 change:g9health_11 change:g9health_12 change:g9health_13 change:g9health_14 change:g9health_15 change:g9health_sDmg change:g9health_aDmg", function (eventInfo) {
    log(JSON.stringify(eventInfo));
    updateTracker("Health", "g9");
});
on("change:g9willpower_1 change:g9willpower_2 change:g9willpower_3 change:g9willpower_4 change:g9willpower_5 change:g9willpower_6 change:g9willpower_7 change:g9willpower_8 change:g9willpower_9 change:g9willpower_10 change:g9willpower_sDmg change:g9willpower_aDmg", function (eventInfo) {
    log(JSON.stringify(eventInfo));
    updateTracker("Willpower", null, "g9");
});
on("change:g9BloodPotency", function () {
    updateBloodPotency("g9");
});
on("change:g9humanity_1 change:g9humanity_2 change:g9humanity_3 change:g9humanity_4 change:g9humanity_5 change:g9humanity_6 change:g9humanity_7 change:g9humanity_8 change:g9humanity_9 change:g9humanity_10 change:g9deltaHumanity change:g9deltaStains", function (eventInfo) {
    updateHumanity(eventInfo.sourceAttribute, "g9");
});
on("change:" + GROUPSTATS.g1.attrList.join(" change:") + " change:repeating_" + GROUPSTATS.g1.repSections.join(" change:repeating_") + " remove:repeating_" + GROUPSTATS.g1.repSections.join(" remove:repeating_"), function (eventInfo) {
    updateRoller("g1");
});
on("change:" + GROUPSTATS.g2.attrList.join(" change:") + " change:repeating_" + GROUPSTATS.g2.repSections.join(" change:repeating_") + " remove:repeating_" + GROUPSTATS.g2.repSections.join(" remove:repeating_"), function (eventInfo) {
    updateRoller("g2");
});
on("change:" + GROUPSTATS.g3.attrList.join(" change:") + " change:repeating_" + GROUPSTATS.g3.repSections.join(" change:repeating_") + " remove:repeating_" + GROUPSTATS.g3.repSections.join(" remove:repeating_"), function (eventInfo) {
    updateRoller("g3");
});
on("change:" + GROUPSTATS.g4.attrList.join(" change:") + " change:repeating_" + GROUPSTATS.g4.repSections.join(" change:repeating_") + " remove:repeating_" + GROUPSTATS.g4.repSections.join(" remove:repeating_"), function (eventInfo) {
    updateRoller("g4");
});
on("change:" + GROUPSTATS.g5.attrList.join(" change:") + " change:repeating_" + GROUPSTATS.g5.repSections.join(" change:repeating_") + " remove:repeating_" + GROUPSTATS.g5.repSections.join(" remove:repeating_"), function (eventInfo) {
    updateRoller("g5");
});
on("change:" + GROUPSTATS.g6.attrList.join(" change:") + " change:repeating_" + GROUPSTATS.g6.repSections.join(" change:repeating_") + " remove:repeating_" + GROUPSTATS.g6.repSections.join(" remove:repeating_"), function (eventInfo) {
    updateRoller("g6");
});
on("change:" + GROUPSTATS.g7.attrList.join(" change:") + " change:repeating_" + GROUPSTATS.g7.repSections.join(" change:repeating_") + " remove:repeating_" + GROUPSTATS.g7.repSections.join(" remove:repeating_"), function (eventInfo) {
    updateRoller("g7");
});
on("change:" + GROUPSTATS.g8.attrList.join(" change:") + " change:repeating_" + GROUPSTATS.g8.repSections.join(" change:repeating_") + " remove:repeating_" + GROUPSTATS.g8.repSections.join(" remove:repeating_"), function (eventInfo) {
    updateRoller("g8");
});
on("change:" + GROUPSTATS.g9.attrList.join(" change:") + " change:repeating_" + GROUPSTATS.g9.repSections.join(" change:repeating_") + " remove:repeating_" + GROUPSTATS.g9.repSections.join(" remove:repeating_"), function (eventInfo) {
    updateRoller("g9");
});

var updateRoller = function (gNum) {
    getSectionIDs(gNum + "rolls", function (idarray) {
        var attrList = GROUPSTATS[gNum].attrList;
        attrList.push("character_name");
        var idList = { rolls: [] };
        _.each(idarray, function (id) {
            _.each(GROUPSTATS[gNum].repStats, function (stat) {
                attrList.push("repeating_" + gNum + "rolls_" + id + "_" + stat);
            });
            log("ATTRLIST: " + JSON.stringify(attrList));
            idList.rolls.push(id);
        });
        getAttrs(attrList, function (v) {
            log("FULL LIST: " + JSON.stringify(trimrep(v)));
            var newAttrList = {};
            _.each(idList.rolls, function (rowId) {
                //repeating_g2rolls_-loj8bvf-dzuohy7ghal_g2rollType
                var prefix = "repeating_" + gNum + "rolls_" + rowId + "_" + gNum;
                newAttrList[prefix + "roll_params"] = v[prefix + "rollType"] + "|" +
                    v["character_name"] + "|" +
                    gNum + "|" +
                    v[gNum + "charname"] + "|" +
                    v[prefix + "trait1name"] + ":" + v[prefix + "trait1value"] + "," +
                    v[prefix + "trait2name"] + ":" + v[prefix + "trait2value"] + "|" +
                    v[prefix + "rolldiff"] + "|" +
                    v[prefix + "rollmod"] + "|" +
                    v[prefix + "posflags"] + "|" +
                    v[prefix + "negflags"];
                log("... NEW ROLL PARAMS: " + JSON.stringify(newAttrList[prefix + "roll_params"]));
            });
            setAttrs(newAttrList);
        });
    });
};
//#endregion

//#region Sheetworker Actions (Above "on(changes)" ignore sheetworker.)
on("change:Hunger", function (eventInfo) {
    updateRolls("rolltype");
    return;
});
//#endregion

var rotateMarquee = function () {
    getAttrs(["marqueeTracker"], function (m) {
        var mTracker = (m.marqueeTracker || "").split(",");
        if (mTracker.length < 10) {
            let newShuffle = _.shuffle(_.difference(_.keys(marqueeTips), mTracker));
            mTracker = _.shuffle(mTracker.concat(newShuffle.slice(0, 10)));
            mTracker = mTracker.concat(newShuffle.slice(10));
        }
        var thisMarquee = marqueeTips[mTracker.shift()];
        var attrList = {
            marqueeTracker: mTracker.join(","),
            marqueeLinesToggle: thisMarquee.length - 1,
            marqueeTitle: thisMarquee[0],
            marquee: thisMarquee.slice(1).join("\n")
        };
        //log("mTracker Attr List: " + JSON.stringify(attrList), false, true);
        setAttrs(attrList);
    });
};