// eslint-disable-next-line no-implicit-globals
// eslint-disable-next-line no-unused-vars
var VAMPWORKER = (function () {
	// #region Constants Declarations
	const ATTRIBUTES = {
		physical: ["Strength", "Dexterity", "Stamina"],
		social: ["Charisma", "Manipulation", "Composure"],
		mental: ["Intelligence", "Wits", "Resolve"]
	}
    const SKILLS = {
		physical: ["Athletics", "Brawl", "Craft", "Drive", "Firearms", "Melee", "Larceny", "Stealth", "Survival"],
		social: ["Animal_Ken", "Etiquette", "Insight", "Intimidation", "Leadership", "Performance", "Persuasion", "Streetwise", "Subterfuge"],
		mental: ["Academics", "Awareness", "Finance", "Investigation", "Medicine", "Occult", "Politics", "Science", "Technology"]
	}
    const DISCIPLINES = ["Animalism", "Auspex", "Celerity", "Dominate", "Fortitude", "Obfuscate", "Potence", "Presence", "Protean", "Blood Sorcery", "Alchemy", "Oblivion", "Vicissitude", "Chimerstry", "Oblivion"],
     TRACKERS = ["Health", "Willpower", "BloodPotency", "Humanity"]
    const REFERENCESTATS = ["Hunger", "Stains", "resonance", "rollMod", "rollDiff", "applyDiscipline", "applyBloodSurge", "applySpecialty", "applyResonant", "incapacitation", "rollArray"]
    const DISCIPLINEREFS = ["Disc1", "Disc2", "Disc3", "repeating_discLeft", "repeating_discMid", "repeating_discRight"]
    const ENUMSTATS = ["Disc1", "Disc2", "Disc3"]
    const REPSECTIONS = ["discLeft", "discMid", "discRight", "advantage", "negAdvantage"]
    const ATTRBLACKLIST = ["powertoggle"]
    const FLAGACTIONS = {  // If key is flagged, action to take depending on type of stat it would be paired with (i.e. newest, in prevArray[0], getting rid of prevArray[1]):
		attribute: {attribute: "add", skill: "add", discipline: "add", advantage: "add", tracker: "add"},
		skill: {attribute: "add", skill: "repThis", discipline: "skip", advantage: "add", tracker: "skip"},
		discipline: {attribute: "add", skill: "skip", discipline: "repThis", advantage: "skip", tracker: "skip"},
		advantage: {attribute: "add", skill: "add", discipline: "skip", advantage: "repThis", tracker: "skip"},
		tracker: {attribute: "add", skill: "skip", discipline: "skip", advantage: "skip", tracker: "repThis"}
	},

     resDisciplines = {
		None: [""],
		Choleric: ["Celerity", "Potence"],
		Melancholic: ["Fortitude", "Obfuscate"],
		Phlegmatic: ["Auspex", "Dominate"],
		Sanguine: ["Blood Sorcery", "Presence"],
		Animal: ["Animalism", "Protean"]
	},
     clanBanes = {
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
		"Banu Haqim": "Your Assamite Blood drives you to feed from those deserving of punishment: especially the Kindred.  Upon slaking Hunger with Cainite Blood, you must roll to resist Hunger Frenzy against a Difficulty of 2 plus your Bane Severity.",
		"Hecata": "Your Hecata Blood is tainted with death.  When feeding, you do not cause ecstasy in your prey, but rather excruciating pain.  Moreover, mortals subconsciously sense your blighted nature:  You suffer a penalty equal to your Bane Severity to all attempts to feed from mortals that do not rely on force.",
		"Ministry": "Yours is the Blood of Set, and it shares His longing for darkness.  You suffer your Bane Severity in additional aggravated damage from sunlight, and an equivalent penalty to all dice pools when bright light is directed straight at you.",
		"Ravnos": "Your Ravnos Blood instills in you a weakness for a specific vice or crime: theft, deceit, con-artistry, etc.  When commiting your chosen vice would benefit you in some way, failure to act accordingly penalizes your Social and Mental dice pools by an amount equal to your Bane Severity for the remainder of the night."
	}
    const clanDisciplines = {
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
		"Tzimisce": ["Animalism", "Auspex", "Vicissitude"],
		"Banu Haqim": ["Celerity", "Obfuscate", "Blood Sorcery"],
		"Hecata": ["Dominate", "Oblivion", "Potence"],
		"Ministry": ["Obfuscate", "Presence", "Protean"],
		"Ravnos": ["Animalism", "Chimerstry", "Fortitude"]
	}
    const generationDependants = [
		null,
null,
null,
null,
		{bloodPotencyDotMax: 10, BloodPotency: 5},
		{bloodPotencyDotMax: 9, BloodPotency: 4},
		{bloodPotencyDotMax: 8, BloodPotency: 3},
		{bloodPotencyDotMax: 7, BloodPotency: 3},
		{bloodPotencyDotMax: 6, BloodPotency: 2},
		{bloodPotencyDotMax: 5, BloodPotency: 2},
		{bloodPotencyDotMax: 4, BloodPotency: 1},
		{bloodPotencyDotMax: 4, BloodPotency: 1},
		{bloodPotencyDotMax: 3, BloodPotency: 1},
		{bloodPotencyDotMax: 3, BloodPotency: 1},
		{bloodPotencyDotMax: 0, BloodPotency: 0},
		{bloodPotencyDotMax: 0, BloodPotency: 0},
		{bloodPotencyDotMax: 0, BloodPotency: 0},
	]
    const bpDependants = [
		{bloodSurge: 0, bloodMend: 1, bloodDiscBonus: 0, bloodRouseReroll: 0, bloodBaneSeverity: 0, animalSlakeMult: 1, humanSlakePenalty: 0, killSlakeThreshold: 1},
		{bloodSurge: 1, bloodMend: 1, bloodDiscBonus: 1, bloodRouseReroll: 0, bloodBaneSeverity: 1, animalSlakeMult: 1, humanSlakePenalty: 0, killSlakeThreshold: 1},
		{bloodSurge: 1, bloodMend: 2, bloodDiscBonus: 1, bloodRouseReroll: 1, bloodBaneSeverity: 1, animalSlakeMult: 0.5, humanSlakePenalty: 0, killSlakeThreshold: 1},
		{bloodSurge: 2, bloodMend: 2, bloodDiscBonus: 1, bloodRouseReroll: 2, bloodBaneSeverity: 2, animalSlakeMult: 0, humanSlakePenalty: 0, killSlakeThreshold: 1},
		{bloodSurge: 2, bloodMend: 3, bloodDiscBonus: 2, bloodRouseReroll: 2, bloodBaneSeverity: 2, animalSlakeMult: 0, humanSlakePenalty: -1, killSlakeThreshold: 1},
		{bloodSurge: 3, bloodMend: 3, bloodDiscBonus: 2, bloodRouseReroll: 3, bloodBaneSeverity: 3, animalSlakeMult: 0, humanSlakePenalty: -1, killSlakeThreshold: 2},
		{bloodSurge: 3, bloodMend: 3, bloodDiscBonus: 3, bloodRouseReroll: 3, bloodBaneSeverity: 3, animalSlakeMult: 0, humanSlakePenalty: -2, killSlakeThreshold: 2},
		{bloodSurge: 4, bloodMend: 3, bloodDiscBonus: 3, bloodRouseReroll: 4, bloodBaneSeverity: 4, animalSlakeMult: 0, humanSlakePenalty: -2, killSlakeThreshold: 2},
		{bloodSurge: 4, bloodMend: 4, bloodDiscBonus: 4, bloodRouseReroll: 4, bloodBaneSeverity: 4, animalSlakeMult: 0, humanSlakePenalty: -2, killSlakeThreshold: 3},
		{bloodSurge: 5, bloodMend: 4, bloodDiscBonus: 4, bloodRouseReroll: 5, bloodBaneSeverity: 5, animalSlakeMult: 0, humanSlakePenalty: -2, killSlakeThreshold: 3},
		{bloodSurge: 5, bloodMend: 5, bloodDiscBonus: 5, bloodRouseReroll: 5, bloodBaneSeverity: 5, animalSlakeMult: 0, humanSlakePenalty: -3, killSlakeThreshold: 3}
	]
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
		["Clan Hecata: The Clan of Death",
			"Clan Hecata of Venice descends from Augustus Giovanni, who diablerized and usurped Ashur, childe of Irad the Strong, childe",
			"of Caine the First.  Thus Clan Hecata replaced Clan Cappadocian as one of the thirteen Great Clans, and hunted them to",
			"extinction. Incestuous necromancers with a penchant for organized crime, the Hecata rarely Embrace outside of their own mortal family."],
		["Clan Setite: The Snake Clan",
			"Clan Setite of the Anarchs, known tonight as the Ministry, descends from Setekh of the Third Generation, childe of Zillah the Beautiful,",
			"childe of Caine the First.  Serpentine tempters, corruptors and purveyors of every vice, they are seen by many to embody the snake in the",
			"Garden of Eden.  The Ministry only recently joined the Anarch Movement, after being shunned by the Camarilla."],
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
	]

    const XPSTATS = ["xp_remaining", "xp_summary"]
    const XPREPSECTIONS = ["spentxp", "earnedxp"]
    const XPREPREFS = {
		earned: ["xp_session", "xp_award", "xp_reason"],
		spent: ["xp_spenttoggle", "xp_category", "xp_trait", "xp_initial", "xp_new", "xp_traittoggle", "xp_initialtoggle", "xp_arrowtoggle", "xp_newtoggle", "xp_cost"]
	}
    const XPPARAMS = {
		Attribute: {colToggles: ["xp_traittoggle", "xp_initialtoggle", "xp_newtoggle"], cost: 5},
		Skill: {colToggles: ["xp_traittoggle", "xp_initialtoggle", "xp_newtoggle"], cost: 3},
		Specialty: {colToggles: ["xp_traittoggle"], cost: 3},
		Clan_Discipline: {colToggles: ["xp_traittoggle", "xp_initialtoggle", "xp_newtoggle"], cost: 5},
		Other_Discipline: {colToggles: ["xp_traittoggle", "xp_initialtoggle", "xp_newtoggle"], cost: 7},
		Caitiff_Discipline: {colToggles: ["xp_traittoggle", "xp_initialtoggle", "xp_newtoggle"], cost: 6},
		Ritual: {colToggles: ["xp_traittoggle", "xp_newtoggle"], cost: 3},
		Formula: {colToggles: ["xp_traittoggle", "xp_newtoggle"], cost: 3},
		Advantage: {colToggles: ["xp_traittoggle", "xp_initialtoggle", "xp_newtoggle"], cost: 3},
		Blood_Potency: {colToggles: ["xp_initialtoggle", "xp_newtoggle"], cost: 10}
	}

    const GROUPPREFIXES = ["g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8", "g9"]
    const GROUPATTRS = ["charname", "Hunger"]
    const GROUPREPSECTIONS = ["rolls"]
    const GROUPREPREFS = ["grollType", "gtrait1name", "gtrait1value", "gtrait2name", "gtrait2value", "grolldiff", "grollmod", "gposflags", "gnegflags", "groll_params"]

    const PROJREPSECTIONS = ["project"]
    const PROJFLAGS = ["projectstartdate", "projectincnum", "projectincunit", "projectscope", "projectlaunchtrait1_name", "projectlaunchtrait1", "projectlaunchtrait2_name", "projectlaunchtrait2", "projectlaunchmod", "projectstake1_name", "projectstake1", "projectstake2_name", "projectstake2", "projectstake3_name", "projectstake3", "projectstake4_name", "projectstake4", "projectstake5_name", "projectstake5", "projectstake6_name", "projectstake6", "projectlaunchresults", "projectlaunchresultsmargin", "projectlaunchdiffmod", "projectwasrushed"]
    const PROJDATEREFS = ["projectstartdate", "projectincnum", "projectincunit", "projectenddate", "projectinccounter", "projectrushpool", "projectlaunchrollToggle", "projectlaunchresults"]
    //#endregion
    //#region Derivative Stats
    const basicStats = _.flatten( [_.values(ATTRIBUTES), _.values(SKILLS), ENUMSTATS, TRACKERS] )
    const statFlags = _.map(_.omit(basicStats, TRACKERS), function (stat) { return `${stat  }_flag`; } )
    //#endregion

    //#region UTILITY: Logging, Checks & String Formatting
    var logPrefix = ""
    var logDepth = 0
    var isDebug = true
    var options = {}

    const isBlacklisted = function (attr) {
		let test = false
        _.each(ATTRBLACKLIST, function (a) {
			if (attr.toLowerCase().includes(a.toLowerCase()))
				test = true
        } )
        return test
    },

     log = function (msg, isWarn, isLoud) {
        if (isLoud)
            return console.log(logPrefix + " ".repeat(logDepth * 3) + msg);
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
        
    },

     trimrep = function (attrList) {
		const newAttrList = {}
        _.each(attrList, function (v, k) {
			if (k.includes("repeating"))
				newAttrList[k.split("_").slice(3)
.join("_")] = v
            else
				newAttrList[k] = v
        } )
        return newAttrList
    },

     parseTAttrs = function (tAttrs, tPrefix, altTrig) {
		return _.map(tAttrs, t => (altTrig || "change:") + (tPrefix || "") + t).join(" ")
    },

     getTriggers = function (tAttrs, tPrefix, gN, tSecs) {
		return _.compact( [
			tAttrs ? parseTAttrs(tAttrs, (gN || "") + (tPrefix || "")) : "",
			tSecs ? parseTAttrs(tSecs, `repeating_${  gN || ""  }${tPrefix || ""}`) : "",
			tSecs ? parseTAttrs(tSecs, `repeating_${  gN || ""  }${tPrefix || ""}`, "remove:") : ""
		] ).join(" ")
    },

     groupify = function (attrArray, gN) {
		gN = gN || ""
        return _.map(attrArray, a => gN + a)
    };
	/* #endregion
       #region UTILITY: Asynchronous Function Handling */
	let run$ = function (tasks, cb) {
		let current = 0

		function done (err, args) {
			function end () {
				args = args ? [].concat(err, args) : [err]
				if (cb)
					cb(...args)
			}
			end()
        }

		function each (err) {
			let args = Array.prototype.slice.call(arguments, 1)
			if (++current >= tasks.length || err) 
                done(err, args)
             else 
                tasks[current].apply(undefined, [].concat(args, each))
            
		}

		if (tasks.length) 
            tasks[0](each)
         else 
            done(null);
        
	}

    var $set = function (attrList, callback) {
		setAttrs(attrList, {}, function () {
			log(`>> ATTRS SET >> ${  JSON.stringify(trimrep(attrList))}`)
            callback(null)
        } )
    },

     $getRepAttrs = function (repInfo, gN) {
		gN = gN || ""
        return function (callback) {
			// var repVals = { attrs: [], ids: [] };
			let repVals = [[], []]
            var $funcs = []
            _.each(_.keys(repInfo), function (sec) {
				$funcs.push(function (cb) {
					getSectionIDs(sec, function (idarray) {
						_.each(idarray, function (id) {
							_.each(repInfo[sec], function (stat) {
								repVals[0].push(`repeating_${  gN  }${sec  }_${  id  }_${  stat}`)
                            } )
                            repVals[1].push(id)
                        } )
                        cb(null)
                    } )
                } )
            } )
            run$($funcs, function () { log(`$$$GRA$$$ REPVALS: ${  JSON.stringify(repVals)}`);

 return callback(null, repVals) } )
        };
	}
    //#endregion
    //#region UTILITY: Date & Time Handling
    var parseDateString = function (str) {
		if (parseInt(str))
			return new Date(parseInt(str))
        if (!_.isString(str))
			return str
        var strArray = _.compact(str.split(/[\s,]+?/g))
        return new Date(`${strArray[2]  }-${  ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].indexOf(strArray[0].slice(0, 3).toLowerCase()) + 1  }-${  strArray[1]}` )
    },

     formatDateString = function (date) {
		return `${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][date.getMonth()]  } ${  date.getUTCDate()  }, ${  date.getUTCFullYear()}`;
	},

     getProgressToDate = function (todaysDate, startDate, endDate) {
		const dates = {
			start: parseDateString(startDate),
			today: parseDateString(todaysDate),
			end: parseDateString(endDate)
		}
        //log("GETPROGRESS: DATES = " + JSON.stringify(dates));
        return (dates.today.getTime() - dates.start.getTime()) / (dates.end.getTime() - dates.start.getTime())
    }
	// #endregion

	// #region UPDATE: Clan, Discipline, Resonance, DOB/DOE, Marquee Rotating
	on("change:clan", () => updateClans())
    on(getTriggers(DISCIPLINEREFS), e => updateDiscs(e.sourceAttribute))
    on("change:resonance", () => updateResonance())
    on("change:dob change:doe", () => updateDOBDOE())
    on("change:core-tab", () => rotateMarquee())

    var updateClans = function (gN) {
		gN = gN || ""
        var attrList = {}
        var $funcs = [
			function (callback) {
				getAttrs(groupify( ["clan", "BloodPotency"], gN), function (c) {
					attrList = {
						clanBanetitle: `${c[gN + "clan"]  } Clan Bane`,
						clanBane: clanBanes[c[`${gN  }clan`]].replace("Bane Severity", `Bane Severity (${  bpDependants[c[gN + "BloodPotency"]].bloodBaneSeverity  })`)
					}
                    let clanDiscs = clanDisciplines[c[`${gN  }clan`]]
                    for (let i = 1; i <= 3; i++) {
						if (clanDiscs[i - 1] != "") {
							attrList[`${gN  }clanDisc${  i  }Toggle`] = 1
                            attrList[`${gN  }disc${  i  }_name`] = clanDiscs[i - 1]
                        } else {
							attrList[`${gN  }clanDisc${  i  }Toggle`] = 0
                            attrList[`${gN  }disc${  i  }_name`] = ""
                        }
					}
                    callback(null, attrList)
                } )
            },
			$set,
			$checkForRituals(gN)
		]
        run$($funcs)
    },

     updateDiscs = function (target, gN) {
		if (isBlacklisted(target))
			return
        gN = gN || ""
        var attrList = {}
        var $funcs = [
			function (callback) {
				getAttrs(groupify( [target], gN), function (v) {
					attrList[`${target  }PowerToggle`] = v[target]
                    callback(null, attrList)
                } )
            },
			$set,
			$checkForRituals(gN)
		]
        run$($funcs)
    },

     updateResonance = function (gN) {
		gN = gN || ""
        getAttrs(groupify( ["resonance"], gN), function (v) {
			const attrList = {}
            attrList[`${gN  }resDisciplines`] = v[`${gN  }resonance`] == 0 ? "" : "(" + resDisciplines[v[gN + "resonance"]].join(" & ") + ")";
			setAttrs(attrList)
        } )
    },

     updateDOBDOE = function (gN) {
		gN = gN || ""
        getAttrs(groupify( ["dob", "doe"], gN), function (v) {
			const attrList = {}
			attrList[`${gN  }character_dobdoe`] = `${v[gN + "dob"]  } — ${  v[gN + "doe"]}`;
			setAttrs(attrList)
        } )
    },

     $checkForRituals = function (gN) {
		gN = gN || ""
        return function (callback) {
			let attrList = {}
            var $funcs = [
				$getRepAttrs( {discLeft: ["discname"], discMid: ["discname"], discRight: ["discname"]}, gN),
				function (repVals, callback) {
					let [attrs, ids] = repVals
                    getAttrs(groupify( ["Disc1_name", "Disc2_name", "Disc3_name"], gN).concat(repVals.attrs), function (vals) {
						attrList[`${gN  }ritualsToggle`] = _.values(vals).includes("Blood Sorcery") ? 1 : 0
                        attrList[`${gN  }formulaeToggle`] = _.values(vals).includes("Alchemy") ? 1 : 0
                        callback(null, attrList)
                    } )
                },
				$set
			]
            run$($funcs, function () { return callback(null) } )
        }
	}
    //#endregion
    //#region UPDATE: Trackers (Health, Willpower, Blood Potency, Humanity)
    on("change:Stamina change:bonusHealth", () => updateTrackerMax("Health"))
    on("change:Composure change:Resolve change:bonusWillpower", () => updateTrackerMax("Willpower"))
    on("change:Generation change:bonusBloodPotency", (eventInfo) => {
		log(`[ONCHANGE:GENERATION or BONUSBLOODPOTENCY] ${JSON.stringify(eventInfo)}`)
		updateTrackerMax("Blood Potency Full")
	} )
    on(getTriggers( [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, "sDmg", "aDmg"], "health_"), e => e.sourceType != "api" || ["health_sDmg", "health_aDmg"].includes(e.sourceAttribute) ? updateTracker("Health") : null)
    on(getTriggers( [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "sDmg", "aDmg"], "willpower_"), function (eventInfo) {
		if (eventInfo.sourceType != "api" || ["willpower_sDmg", "willpower_aDmg"].includes(eventInfo.sourceAttribute))
			updateTracker("Willpower")
    } )
    on("change:BloodPotency", (eventInfo) => {
		log(`[ONCHANGE:BLOODPOTENCY] ${JSON.stringify(eventInfo)}`)
		updateTracker("Blood Potency")
	} )
    on(`${getTriggers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "humanity_")  } change:deltaHumanity change:deltaStains`, () => updateTracker("Humanity"))

    var updateTrackerMax = function (trackerName, gN) {
		gN = gN || ""
        var attrList = {}
        switch (trackerName) {
		case "Health":
			// log("At Health");
			var $funcs = [
				function (callback) {
					getAttrs(groupify( ["Stamina", "bonusHealth"], gN), function (v) {
						if (gN == "")
							attrList.health_max = Math.min(15, Math.max(1, parseInt(v.Stamina, 10) + 3 + parseInt(v.bonusHealth, 10)))
                            else
							attrList[`${gN  }health_max`] = v[`${gN  }bonusHealth`]
                            callback(attrList, null)
                        } )
                    },
				$set,
				$updateTracker("Health", gN)
			]
                break;
		case "Willpower":
			// log("At Willpower");
			var $funcs = [
				function (callback) {
					getAttrs(groupify( ["Composure", "Resolve", "bonusWillpower"], gN), function (v) {
						if (gN == "")
							attrList.willpower_max = Math.min(10, Math.max(1, parseInt(v.Composure, 10) + parseInt(v.Resolve, 10) + parseInt(v.bonusWillpower, 10)))
                            else
							attrList[`${gN  }willpower_max`] = v[`${gN  }bonusWillpower`]
                            callback(attrList, null)
                        } )
                    },
				$set,
				$updateTracker("Willpower", gN)
			]
                break;
		case "Blood Potency Full":
		case "Blood Potency":
			log("At Blood Potency");
			var $funcs = [
				function (callback) {
					getAttrs(groupify( ["Generation", "bonusBloodPotency"], gN), function (v) {
                        log(`Inside first callback.  v = ${JSON.stringify(v)}`)
						attrList[`${gN  }bloodPotencyDotMax`] = Math.min(10, Math.max(0, generationDependants[parseInt(v[`${gN  }Generation`], 10)].bloodPotencyDotMax + (gN == "" ? parseInt(v[`${gN  }bonusBloodPotency`], 10) : 0)))
                            if (trackerName == "Blood Potency Full")
							attrList[`${gN  }BloodPotency`] = generationDependants[parseInt(v[`${gN  }Generation`], 10)].BloodPotency
                            callback(attrList, null)
                        } )
                    },
				$set,
				$updateTracker("Blood Potency", gN)
			]
                break;
		}
        run$($funcs)
    },

     $updateTracker = function (trackerName, gN) {
		return function (callback) { updateTracker(trackerName, gN, callback) };
	}

    var updateTracker = function (trackerName, gN, cb) {
		let $funcs = []
        var attrList = {}

        switch (trackerName) {
		case "Health":
		case "Willpower":
			$funcs = [
				$binCheck(trackerName, gN),
				$set
			]
                break;
		case "Blood Potency":
			$funcs = [
				function (callback) {
					getAttrs(groupify( ["clan", "BloodPotency"], gN), function (v) {
						_.each(bpDependants[v[`${gN  }BloodPotency`]], function (v, k) { attrList[gN + k] = v } )

                            attrList[`${gN  }bloodSurgeText`] = attrList[`${gN  }bloodSurge`] == 0 ? "None" : "+" + (attrList[gN + "bloodSurge"] == 1 ? attrList[gN + "bloodSurge"] + " Die" : (attrList[gN + "bloodSurge"] + " Dice"));
						attrList[`${gN  }bloodMendText`] = attrList[`${gN  }bloodMend`] == 0 ? "None" : attrList[gN + "bloodMend"] + " Superficial";
						attrList[`${gN  }bloodDiscBonusText`] = attrList[`${gN  }bloodDiscBonus`] == 0 ? "None" : "+" + (attrList[gN + "bloodDiscBonus"] == 1 ? attrList[gN + "bloodDiscBonus"] + " Die" : (attrList[gN + "bloodDiscBonus"] + " Dice")) +
                                [";  Never Rouse x2.", ";  Rouse x2 for Level 1.", ";  Rouse x2 for Levels 1 & 2.", ";  Rouse x2 for Levels 1, 2, 3.", ";  Rouse x2 for Levels 1 - 4.", ";  Rouse x2 for All Levels."][attrList[gN + "bloodRouseReroll"]];
						attrList[`${gN  }baggedSlakeMult`] = attrList[`${gN  }animalSlakeMult`]
                            attrList[`${gN  }bloodFeedingPenalties`] = `Animals & bagged blood slake ${  { 0: "no", 0.5: "half", 1: "full" }[attrList[gN + "animalSlakeMult"]]  } Hunger.\n${ 
                                attrList[gN + "humanSlakePenalty"] == 0 ? "Humans slake full Hunger.\n" : (attrList[gN + "humanSlakePenalty"] + " Hunger slaked from humans.\n") 
                                }Must kill to reduce Hunger below ${  attrList[gN + "killSlakeThreshold"]  }.`;

						callback(attrList, null)
                        } )
                    },
				$set
			]
                break;
		case "Humanity":
			$funcs = [
				function (callback) {
					getAttrs(groupify(_.map( [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], v => "humanity_" + v).concat( ["deltaHumanity", "deltaStains"] ), gN), function (v) {
						/* 1) Determine Current Humanity & Stains
                               EMPTY BOX CLICKED?  -->  Fill with Stains AND set "last changed dot" variable to that box
                               STAIN CLICKED? ---> IF last changed dot, change to HUMANITY and fill empties to left with humanity.  OTHERWISE, change it to empty and empty all stains to left
                               HUMANITY CLICKED? ---> Turn blank, and all humanity to the right.
                               ... THEN set Humanity and Stains attributes.
                               2) DeltaHumanity/DeltaStains set?
                               Change corresponding boxes.
                               If +dHumanity hits a Stain, stop.
                               If +dStain hits Humanity, trigger Degeneration impairment.
                               Set deltaHumanity/deltaStains to zero. */
						if (parseInt(v[`${gN  }deltaHumanity`] ) && parseInt(v[`${gN  }deltaHumanity`] ) != 0) {
							attrList[`${gN  }Humanity`] = _.filter(_.values(_.omit(v, groupify( ["deltaHumanity", "deltaStains"], gN))), function (attrVal) {
								return parseInt(attrVal) == 1
                                } ).length + parseInt(v[`${gN  }deltaHumanity`] )
                                attrList[`${gN  }deltaHumanity`] = 0
                            }
						if (parseInt(v[`${gN  }deltaStains`] ) && parseInt(v[`${gN  }deltaStains`] ) != 0) {
							attrList[`${gN  }Stains`] = _.filter(_.values(_.omit(v, groupify( ["deltaHumanity", "deltaStains"], gN))), function (attrVal) {
								return parseInt(attrVal) == 2
                                } ).length + parseInt(v[`${gN  }deltaStains`] )
                                attrList[`${gN  }deltaStains`] = 0
                            }
						callback(attrList, null)
                        } )
                    },
				$set
			]
                break;
		}

        run$($funcs)
    },

     $binCheck = function (trackerName, gN) {
		gN = gN || ""
        let p = a => gN + trackerName.toLowerCase() + "_" + a,
         attrs = []
        let dmgBins = [[], [], []]
        var attrList = {}
        switch (trackerName) {
		case "Health":
			attrs = groupify(_.map( [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, "max", "sDmg", "aDmg"], v => "health_" + v).concat( ["incapacitation"] ), gN)
                break;
		case "Willpower":
			attrs = groupify(_.map( [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "max", "sDmg", "aDmg"], v => "willpower_" + v).concat( ["incapacitation"] ), gN)
                break;
		}
        return function (callback) {
			getAttrs(attrs, function (v) {
				const pV = a => v[p(a)]
                let pI = a => parseInt(pV(a) || 0)
                // Activate Boxes Based on Max Stats
                let boxList = _.pick(v, function (val, key) {
					const num = parseInt(key.split("_")[1] )
                    return !_.isNaN(num) && num <= pI("max")
                } )

                // Sort Boxes According to Damage
                _.each(boxList, function (dmg, box) { dmgBins[dmg].push(box) } )

                // Apply New Damage & Healing
                if (pI("sDmg") != 0) {
					attrList[p("sDmg")] = pI("sDmg")
                    while (attrList[p("sDmg")] > 0) {
						if (dmgBins[0].length > 0) { // There's enough blank boxes for the superficial hit.
							dmgBins[1].push(dmgBins[0].shift())
                            attrList[p("sDmg")]--
                        } else if (dmgBins[1].length > 0) {      // The boxes are all filled, try to upgrade to aggravated.
							dmgBins[2].push(dmgBins[1].shift())
                            attrList[p("sDmg")]--
                        } else                             // All boxes are filled with Aggravated: Death.
							{break;}
					}
                    while (attrList[p("sDmg")] < 0) {
						if (dmgBins[1].length > 0) {      // Superficial damage present, so heal.
							dmgBins[0].push(dmgBins[1].pop())
                            attrList[p("sDmg")]++
                        } else
							{break;}
					}
                }
				if (pI("aDmg") != 0) {
					attrList[p("aDmg")] = pI("aDmg")
                    while (attrList[p("aDmg")] > 0) {
						if (dmgBins[0].length > 0) {
							dmgBins[2].push(dmgBins[0].shift())
                            attrList[p("aDmg")]--
                        } else if (dmgBins[1].length > 0) {
							dmgBins[2].push(dmgBins[1].shift())
                            attrList[p("aDmg")]--
                        } else
							{break;}
					}
                    while (attrList[p("aDmg")] < 0) {
						if (dmgBins[2].length > 0) {
							dmgBins[0].push(dmgBins[2].pop())
                            attrList[p("aDmg")]--
                        } else
							{break;}
					}
                }

				// Check For Incapacitation
				if (dmgBins[0].length == 0) {
					attrList[`${gN  }incapacitation`] = _.compact(_.uniq(_.union((v[`${gN  }incapacitation`] || "").split(","), [trackerName] ))).join(",")
                    attrList[`${gN  }impairmentToggle${  trackerName}`] = 1
                } else {
					attrList[`${gN  }incapacitation`] = _.compact(_.uniq(_.difference((v[`${gN  }incapacitation`] || "").split(","), [trackerName] ))).join(",")
                    attrList[`${gN  }impairmentToggle${  trackerName}`] = 0
                }

				// Apply Tracker Damage to Boxes
				let binNum = 0
                _.each(dmgBins, function (bin) {
					_.each(bin, function (box) {
						if (parseInt(v[box] ) != binNum)
							attrList[box] = binNum
                    } )
                    binNum++
                } )
                attrList[gN + trackerName] = dmgBins[0].length

                log(`${trackerName  } FINAL ATTRS: ${  JSON.stringify(attrList)}`)
                callback(null, attrList)
            } )
        };
	}

    // #endregion
    //#region UPDATE: Projects, Memoriam, Time
    on("change:todaysdate", () => updateProjectDates())

    var updateProjectDates = function (gN, callback) {
		gN = gN || ""
        var attrList = {}
        var $funcs = [
			$getRepAttrs( {project: PROJDATEREFS}, gN),
			function (repVals, cb) {
				getAttrs(repVals.attrs.concat( ["todaysdate"] ), function (v) {
					_.each(repVals.ids, function (id) {
						const p = a => `repeating_${  gN  }project_${  id  }_${  a}`,
                         pV = a => v[p(a)]
                        let pI = a => parseInt(pV(a))
                        let counterPos = 11
                        let currentPos = pI("projectinccounter")
                        if (pI("projectlaunchrollToggle") == 2 && !pV("projectlaunchresults").includes("TOTAL"))
							counterPos = Math.min(10 - Math.floor(10 * getProgressToDate(formatDateString(new Date(parseInt(v.todaysdate))), pV("projectstartdate"), pV("projectenddate"))), 10)
                        if (counterPos != currentPos)
							attrList[p("projectinccounter")] = counterPos
                    } )
                    cb(null, attrList)
                } )
            },
			$set
		]

        run$($funcs, callback ? function () { return callback(null) } : undefined)
    };

	on(getTriggers(null, null, null, PROJREPSECTIONS), e => updateProjects(e.sourceAttribute))

    var $checkLaunchToggle = function (source, gN) {
		gN = gN || ""
        source = source.split("_")
        source.shift()
        var sec = source.shift()
        var rowID = source.shift()
        var stat = source.join("_")
        log(`CHECK LAUNCH REP VALS: ${  JSON.stringify(sec)  }; ${  JSON.stringify(rowID)  }; ${  JSON.stringify(stat)}`, "LAUNCHTOGGLE")
        return function (cb) {
			let p = s => ["repeating", sec, rowID, s].join("_")
            log(`TESTING STAT: ${  JSON.stringify(p("testStat"))}`)
            var attrs = []
            var attrList = {}
            _.each( ["projectlaunchtrait1_name", "projectlaunchmod", "projectlaunchtrait1", "projectlaunchtrait2_name", "projectlaunchtrait2", "projectscope", "projectlaunchresults", "projectlaunchdiff", "projectlaunchdiffmod"], function (s) {
				attrs.push(p(s))
            } )
            var $funcs = [
				function (callback) {
					getAttrs(attrs, function (v) {
						let pV = s => v[p(s)]
                        var pI = s => parseInt(v[p(s)] ) || 0
                        var attrList = {}
                        let scope = pI("projectscope")
                        let launchDiffMod = pI("projectlaunchdiffmod")
                        let traits = []
                        _.each( ["projectlaunchtrait1", "projectlaunchtrait2"], r => traits.push( {name: pV(`${r  }_name`), value: pI(r)} ))
                        let results = pV("projectlaunchresults")
                        if (results.includes("SUCCESS") || results.includes("CRITICAL") || results.includes("TOTAL"))
							{attrList[p("projectlaunchrollToggle")] = 2;}
						/* else if (!scope) {
                           attrList[p("projectlaunchrollToggle")] = 0;
                           attrList[p("projectlaunchdiff")] = "";
                           } else { */
						else {
							const launchTraitCheck = []
                            _.each(traits, function (trt) {
								if (!trt.value || trt.value == 0)
									launchTraitCheck.push(trt.name == "" ? 0 : -1)
                                else
									launchTraitCheck.push(trt.name == "" ? -1 : 1)
                            } )
                            attrList[p("projectlaunchdiff")] = scope + 2 + launchDiffMod
                            if (launchTraitCheck.includes(-1) || !launchTraitCheck.includes(1)) {
								attrList[p("projectlaunchrollToggle")] = 0
                            } else {
								attrList[p("projectlaunchrollToggle")] = 1
                                let launchDiffMod = pI("projectlaunchdiffmod")
                                let launchDiff = pI("projectscope") + 2 + launchDiffMod
                                let traits = [[pV("projectlaunchtrait1_name"), pI("projectlaunchtrait1")], [pV("projectlaunchtrait2_name"), pI("projectlaunchtrait2")]]
                                if (traits[0][0] != "" && traits[1][0] != "" && traits[0][1] > 0 && traits[1][1] > 0 && launchDiff) {
									const traitString = [traits[0].join(":"), traits[1].join(":")].join(",")
                                    attrList[p("projectlaunchroll_params")] = `@{character_name}|${  traitString  }|${  launchDiff  }|${  pI("projectlaunchmod")  }|${  launchDiffMod  }|${  rowID}`;
								}
							}
						}
						callback(null, attrList)
                    } )
                },
				$set
			]

            run$($funcs, function (callback) { cb(null) } )
        };
	}

    var updateProjects = function (source, gN) {
        gN = gN || "";
        var row = source.split("_").slice(0, 3).join("_");
        var stat = source.split("_").slice(3).join("_");
        log("ROW = " + JSON.stringify(row) + ", STAT = " + JSON.stringify(stat));
        var p = s => (row + "_" + s);
        var $funcs = [];
        var attrs = [];
        var attrList = {};
        if (["projectstartdate", "projectincnum", "projectincunit"].includes(stat)) {
            attrs.push("todaysdate");
            _.each(["projectstartdate", "projectincnum", "projectincunit"], (s) => attrs.push(p(s)));
            $funcs = [
                //function (callback) {
                //    getAttrs([p("projectsrowid")], function (v) {
                //        if (!v[p("projectsrowid")].includes(source.split("_")[2])) {
                //            attrList[p("projectsrowid")] = v[p("projectsrowid")] + source.split("_")[2];
                //            setAttrs(attrList, {}, function () { callback(null); });
                //        } else
                //            callback(null);
                //    });
                //},
                function (callback) {
                    getAttrs(attrs, function (v) {
                        let pV = a => v[p(a)];
                        let pI = a => parseInt(pV(a)) || 0;
                        let cDate = new Date(parseDateString(v.todaysdate));
                        log("CDATE: " + JSON.stringify(cDate));
                        log("ATTRS: " + JSON.stringify(v));
                        let sDate;
                        if (!pV("projectstartdate")) {
                            sDate = new Date(cDate);
                            log("SDATE: " + JSON.stringify(sDate));
                            attrList[p("projectstartdate")] = formatDateString(sDate);
                        } else
                            sDate = new Date(parseDateString(pV("projectstartdate")));
                        let inc = pI("projectincnum");
                        let iUnit = pV("projectincunit");
                        if (!cDate || inc == 0 || !iUnit || parseInt(iUnit) == 0) {
                            attrList[p("projectenddate")] = "";
                            attrList[p("projectinccounter")] = 11;
                        } else {
                            var eDate = new Date(sDate);
                            switch (iUnit) {
                                case "hours":
                                    eDate.setUTCHours(eDate.getUTCHours() + 10 * inc);
                                    break;
                                case "days":
                                    eDate.setUTCDate(eDate.getUTCDate() + 10 * inc);
                                    break;
                                case "weeks":
                                    eDate.setUTCDate(eDate.getUTCDate() + 10 * 7 * inc);
                                    break;
                                case "months":
                                    eDate.setUTCMonth(eDate.getMonth() + 10 * inc);
                                    break;
                                case "years":
                                    eDate.setUTCFullYear(eDate.getUTCFullYear() + 10 * inc);
                                    break;
                            }
                            attrList[p("projectenddate")] = formatDateString(eDate);
                        }
                        callback(null, attrList);
                    });
                },
                $set,
                function (callback) { updateProjectDates(gN, callback); }
            ];
        } else if (["projectscope", "projectlaunchdiff", "projectlaunchdiffmod", "projectlaunchresults"].includes(stat)) {
            attrs.push("todaysdate");
            _.each(["projectscope", "projectlaunchmod", "projectlaunchdiffmod"], (s) => attrs.push(p(s)));
            $funcs = [
                function (callback) {
                    getAttrs(attrs, function (v) {
                        let scope = parseInt(v[p("projectscope")]);
                        if (!scope)
                            attrList[p("projectlaunchdiff")] = "";
                        else
                            attrList[p("projectlaunchdiff")] = scope + 2 + (parseInt(v[p("projectlaunchdiffmod")]) || 0);
                        callback(null, attrList);
                    });
                },
                $set,
                $checkLaunchToggle(source, gN)
            ];
        } else if (["projectlaunchtrait1_name", "projectlaunchtrait1", "projectlaunchtrait2_name", "projectlaunchtrait2", "projectlaunchmod"].includes(stat)) {
            $funcs = [$checkLaunchToggle(source, gN)];
        } else if (["projectstake1", "projectstake2", "projectstake3", "projectstake4", "projectstake5", "projectstake6"].includes(stat)) {
            _.each(["projectstake1", "projectstake2", "projectstake3", "projectstake4", "projectstake5", "projectstake6", "projectlaunchresults", "projecttotalstake", "projectwasrushed", "projectrushstakelost"], a => attrs.push(p(a)));
            $funcs = [
                function (callback) {
                    getAttrs(attrs, function (v) {
                        if (v[p("projectlaunchresults")].includes("CRITICAL") || v[p("projectlaunchresults")].includes("FAIL"))
                            return;
                        if (v[p("projectwasrushed")] == 0) {
                            let stakeRemaining = Math.max(0, parseInt(v[p("projecttotalstake")]) - (parseInt(v[p("projectstake1")]) + parseInt(v[p("projectstake2")]) + parseInt(v[p("projectstake3")]) + parseInt(v[p("projectstake4")]) + parseInt(v[p("projectstake5")]) + parseInt(v[p("projectstake6")])));
                            if (stakeRemaining > 0)
                                attrList[p("projectlaunchresultsmargin")] = "Stake " + v[p("projecttotalstake")] + " Dots (" + stakeRemaining + " to go)";
                            else
                                attrList[p("projectlaunchresultsmargin")] = v[p("projecttotalstake")] + " Dots Staked";
                        } else {
                            // Track the stakes the player still has to sacrifice.
                        }
                        callback(null, attrList);
                    });
                },
                $set
            ];
        } else if (["projectwasrushed"].includes(stat)) {
            _.each(["projectstake1", "projectstake2", "projectstake3", "projectstake4", "projectstake5", "projectstake6", "projectwasrushed", "projectrushstakelost"], a => attrs.push(p(a)));
            $funcs = [
                function (callback) {
                    getAttrs(attrs, function () {
                        // If the rush was a failure, wipe all of the projectstake values AFTER summing and recording them in projectstakesatrush, and track which stakes the player is losing by them filling in the same boxes again.
                        callback(null, attrList);
                    });
                },
                $set
            ];
        }
        run$($funcs);
        
    }
	/* #endregion
       #region UPDATE: Experience */
	on(getTriggers(null, null, null, XPREPSECTIONS), e => updateXP())

    var updateXP = function (gN) {
		gN = gN || ""
        var attrList = {}
        var $funcs = [
			$getRepAttrs( {earnedxp: XPREPREFS.earned}, gN),
			function (repVals, callback) {
				getAttrs(_.filter(repVals.attrs, function (a) { return a.includes("xp_award") } ), function (v) {
					// log("Earned V: " + JSON.stringify(v));
					let earnedTotal = 0
                    //_.each(v, x => earnedTotal += parseInt(x));
                    _.each(v, function (v, k) {
						earnedTotal += parseInt(v) || 0
                    } )
					callback(null, {xp_earnedtotal: earnedTotal} )
                } )
            },
			$set,
			$getRepAttrs( {spentxp: XPREPREFS.spent}, gN),
			function (repVals, callback) {
				getAttrs(repVals.attrs.concat( ["xp_earnedtotal", "xp_category"] ), function (v) {
					let spentTotal = 0
                    _.each(repVals.ids, function (id) {
						let p = a => `repeating_spentxp_${  id  }_${  a}`,
                         pV = a => v[p(a)]
                        var pI = a => parseInt(pV(a)) || 0
                        var cat = pV("xp_category")
                        _.each( ["xp_traittoggle", "xp_initialtoggle", "xp_newtoggle"], t => attrList[p(t)] = XPPARAMS[cat].colToggles.includes(t) ? 1 : 0)
                        attrList[p("xp_arrowtoggle")] = XPPARAMS[cat].colToggles.includes("xp_initialtoggle") && XPPARAMS[cat].colToggles.includes("xp_newtoggle") ? 1 : 0
                        if (XPPARAMS[cat] ) {
							if (
								(!XPPARAMS[cat].colToggles.includes("xp_traittoggle") || pV("xp_trait") != "") &&
                                (!XPPARAMS[cat].colToggles.includes("xp_initialtoggle") || pV("xp_initial") != "") &&
                                (!XPPARAMS[cat].colToggles.includes("xp_newtoggle") || pV("xp_new") != "")
							) {
								if (XPPARAMS[cat].colToggles.includes("xp_newtoggle")) {
									let delta = 0
                                    if (XPPARAMS[cat].colToggles.includes("xp_initialtoggle")) {
										if (cat === "Advantage")
											{delta = (pI("xp_new") - pI("xp_initial")) * XPPARAMS[cat].cost;}
										else
											{for (var i = pI("xp_initial") ; i < pI("xp_new") ; i++)
                                                delta += (i + 1) * XPPARAMS[cat].cost;}
									} else
										{delta = pI("xp_new") * XPPARAMS[cat].cost;}
									attrList[p("xp_cost")] = Math.max(0, delta)
                                } else
									{attrList[p("xp_cost")] = Math.max(0, XPPARAMS[cat].cost);}
								if (pV("xp_spenttoggle") == "on" && attrList[p("xp_cost")] > 0)
									spentTotal += attrList[p("xp_cost")] || 0
                                if (attrList[p("xp_cost")] == 0)
									attrList[p("xp_cost")] = ""
                            }
						}
					} )
                    let earnedTotal = parseInt(v.xp_earnedtotal)
                    attrList.xp_summary = `${earnedTotal  } XP Earned${  spentTotal > 0 ? (" - " + spentTotal + " XP Spent =  " + (earnedTotal - spentTotal) + " XP Remaining") : ""}`;
					callback(null, attrList)
                } )
            },
			$set
		]
        run$($funcs)
    };
	/* #endregion
       #region UPDATE: Dice Roller */
	on(`sheet:opened change:repeating_${  REPSECTIONS.join(" change:repeating_")  } remove:repeating_${  REPSECTIONS.join(" remove:repeating_")}`, function (eventInfo) {
        if (eventInfo.sourceAttribute && _.filter(ATTRBLACKLIST, function (blackStat) { return eventInfo.sourceAttribute.includes(blackStat); }).length > 0)
            return;
        log("RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR");
        log(JSON.stringify(eventInfo));
        log("RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR");
        if (eventInfo.sourceType === "sheetworker")
            return;
        updateRepSections({ stat: eventInfo.sourceAttribute, source: eventInfo.sourceType.slice(0, 2), silent: false });
        
    } )
    var watchString = `change:${  statFlags.join(" change:")}`;
	// log(JSON.stringify(watchString));
	on(watchString, function (eventInfo) {
        log("@@@@@@@@@@@@@@@@@@@@@@@@@");
        log(JSON.stringify(eventInfo));
        log("@@@@@@@@@@@@@@@@@@@@@@@@@");
        if (_.filter(ATTRBLACKLIST, function (blackStat) { return eventInfo.sourceAttribute.includes(blackStat); }).length > 0)
            return;
        if (eventInfo.sourceType === "sheetworker")
            return;
        updateRolls(eventInfo.sourceAttribute.replace("_flag", "").replace("_name", "").replace("_type", ""), { source: eventInfo.sourceType.slice(0, 2), silent: true }); //, silent: eventInfo.sourceType === "sheetworker"
        
    } )
    on("change:rollDiff change:rollMod change:Hunger change:applyDiscipline change:applyBloodSurge change:applySpecialty change:applyResonant change:incapacitation", function (eventInfo) {
        log("@@@@@@@@@@@@@@@@@@@@@@@@@");
        log(JSON.stringify(eventInfo));
        log("@@@@@@@@@@@@@@@@@@@@@@@@@");
        updateRolls("rolltype", { source: eventInfo.sourceType.slice(0, 2), triggerAttr: eventInfo.sourceAttribute, silent: true }); //, silent: eventInfo.sourceType === "sheetworker"
        
    } )

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
        
    },

     updateRolls = function (stat, options, repString) {
		options = options || {}
        logPrefix = `[ UR(${  stat  }: ${  options.source  })${  options.triggerAttr ? (" (" + JSON.stringify(options.triggerAttr) + ")") : ""  } ] `;
		logDepth = 0

        getAttrs( ["repStats"], function (r) {
			repString = repString || r.repStats
            log(`@@@@ REPSTRING IN UPDATE ROLLS: ${  JSON.stringify(repString)}`)

            var type, stat_flag
            var rArray = []
            var newRArray = []
            var repStats = repString ? repString.split(",") : []
            var allStats = basicStats.concat(repStats)
            var attrArray = REFERENCESTATS.concat(basicStats).concat(_.map(basicStats, function (s) { return `${s  }_flag`; } ))
            _.each(ENUMSTATS, function (s) {
				attrArray.push(`${s  }_name`)
            } )
            var getRepKeys = function (repStats, suffix) {
                if (repStats.length == 0)
                    return null;
                if (!_.isString(suffix))
                    return getRepKeys(repStats, "_name").concat(getRepKeys(repStats, "_flag")).concat(getRepKeys(repStats, ""));
                return _.map(repStats, function (stat) { return ("repeating_" + stat).replace("repeating_repeating", "repeating") + suffix; });
            };
			_.each(getRepKeys(repStats), function (s) {
				attrArray.push(s)
            } )

            log(`@@@ FINAL ATTRARRAY = '${  JSON.stringify(attrArray)}`)


            getAttrs(attrArray, function (v) {
				if (!options.silent) {
					log(">>>>>>>>>>>")
                    log(`>>> START >>> UPDATEROLLS(${  stat  })${  options.triggerAttr ? (" (" + JSON.stringify(options.triggerAttr) + ")") : ""}`)
                    log(">>>>>>>>>>>")
                } else {
					log(`( silent start ) UPDATEROLLS(${  stat  })${  options.triggerAttr ? (" (" + JSON.stringify(options.triggerAttr) + ")") : ""}`)
                }

				let newAttrs = {}
                var isFlagChanged = false

                var isIn = function (ndl, hay) {
					hay = hay || v
                    ndl = `\\b${  ndl  }\\b`;
					let result
                    if (_.isArray(hay)) {
						const index = _.findIndex(_.flatten(hay), function (s) {
							return s.match(new RegExp(ndl, "i")) !== null || s.match(new RegExp(ndl.replace(/_/g), "i")) !== null
                        } )
                        result = index == -1 ? false : _.flatten(hay)[index]
                    } else if (_.isObject(hay)) {
						const index = _.findIndex(_.keys(hay), function (s) {
							return s.match(new RegExp(ndl, "i")) !== null || s.match(new RegExp(ndl.replace(/_/g), "i")) !== null || s.match(new RegExp(`${ndl  }_name`, "i"))
                        } )
                        result = index == -1 ? false : _.keys(hay)[index]
                    } else
						{result = hay.match(new RegExp(ndl, "i")) !== null;}

					return result || false
                },

                 realName = function (stat, statList, isHalting) {
                    statList = statList || v;
                    stat = stat.replace("_flag", "").replace("_name");
                    if (isHalting)
                        return statList[isIn(stat + "_name", statList)] || isIn(stat, statList);
                    return statList[isIn(stat + "_name", statList)] || isIn(stat, statList) || realName(stat, _.union(ATTRIBUTES, SKILLS, DISCIPLINES, TRACKERS), true);
                },

                 checkType = function (stat) {
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
                    
                        log("CkType(" + JSON.stringify(stat) + "): Can't Determine Type");
                        return false;
                    
                },

                 checkFlag = function (stat) {
					if (!_.isString(stat)) {
						log(`CHECKFLAG(${  JSON.stringify(stat)  }) is NOT A STRING.`)
                        return false
                    };
					const flag = isIn(`${stat.replace("_flag", "").replace("_name", "")  }_flag`)
                    var result
                    if (flag == false || parseInt(v[flag] ) == 0)
						result = false
                    else
						result = true
                    return result
                };

				if (stat !== "rolltype") {
					stat = isIn(stat)
                    _.each( ["rollDiff", "rollMod", "applyDiscipline", "applyBloodSurge", "applySpecialty", "applyResonant"], function (attr) {
						newAttrs[attr] = 0
                    } )
                };

				// First, all stats are searched, and flagged stats are added to rArray.
				log(">>> FINDING STATS CURRENTLY FLAGGED ON SHEET...")
                logDepth++
                allStats.forEach(function (x) {
					if (checkFlag(x)) {
						rArray.push(x)
                        log(`>>> FOUND: '${  JSON.stringify(x)  }'`)
                    }
				} )
                log(`>>> PREVIOUS R-ARRAY: '${  JSON.stringify(v.rollArray)  }'`)
                log(`>>> NEW R-ARRAY: '${  JSON.stringify(rArray)  }'`)

                // IF RESETTING, clear all selected flags and other related parameters:
                if (options.reset) {
					_.each( ["rollArray", "rollflagdisplay", "roll_params"], function (attr) {
						newAttrs[attr] = ""
                        v[attr] = ""
                    } )
                    _.each( ["rollDiff", "rollMod", "applyDiscipline", "applyBloodSurge", "applySpecialty", "applyResonant"].concat(_.map(rArray, function (attr) { return `${attr  }_flag`; } )), function (attr) {
						newAttrs[attr] = 0
                        v[attr] = 0
                    } )
                } else {
					// Next, the roll array settings (from the last time this function was called) are stored in prevRArray.
					let prevRArray = v.rollArray && v.rollArray != "" ? v.rollArray.split(",") : []
                    log(`>>> NEW PREV-R-ARRAY: ${  JSON.stringify(prevRArray)}`)
                    logDepth--

                    // If the stat being updated is anything OTHER than rolltype, flag the new traits, add them to rArray, and clean up the character sheet:
                    if (stat != "rolltype") {
						log(">>> NOT A ROLLTYPE: CHECKING FLAGS...")
						logDepth++
                        // If the stat has been UNflagGED ...
                        if (checkFlag(stat) == 0) {
							// ... REMOVE it from rArray.
							isFlagChanged = true
                            let prunedRArray = _.without(rArray, isIn(stat, rArray))
                            log(`>>> --UNFLAGGING-- '${  stat  }' from R-ARRAY (${  JSON.stringify(rArray)  }'`)
                            logDepth++
                            newRArray = _.without(rArray, isIn(stat, rArray))
                            log(`> NEW R-ARRAY = '${  JSON.stringify(newRArray)  }'`)
                            logDepth--
                        } else if (checkFlag(stat) != false) {
							// Otherwise, if the stat is being FLAGGED, determine its TYPE.
							isFlagChanged = true
                            log(`>>> ++FLAGGED++ into R-ARRAY '${  JSON.stringify(rArray)  }'`)
                            logDepth++
                            log(`> PREV-R-ARRAY '${  JSON.stringify(prevRArray)  }' [LENGTH: ${  prevRArray.length  }]`)
                            logDepth++
                            type = checkType(stat)
                            // Determine target rArray:
                            switch (prevRArray.length) {
							case 0:
								log(" ... FILLING EMPTY.")
                                    newRArray = [stat]
                                    break;
							case 1:
								// Look up FLAGACTIONS:  add = prepend; repThis = replace; skip = clear.
								const pType = checkType(prevRArray[0] )
                                    switch (FLAGACTIONS[type][checkType(prevRArray[0] )] ) {
								case "add":
									log(` ... ADDING (statType: ${  JSON.stringify(type)  }, prevType: ${  JSON.stringify(pType)  })`)
                                            newRArray = [prevRArray[0], stat]
                                            break;
								case "repThis":
								case "skip":
									log(` ... CLEARING (statType: ${  JSON.stringify(type)  }, prevType: ${  JSON.stringify(pType)  })`)
                                            newRArray = [stat]
                                            break;
								}
                                    break;
							default:
								/* Look up FLAGACTIONS re: NEWEST first:
                                       add = bump oldest, repThis = replace NEWEST, skip = check NEXT..
                                       If SKIP, check OLDEST in FLAGACTIONS:
                                       add = replace newest, repThis = replace oldest, skip = clear. */
								const checkAction = function (thisType, compType, isRerunning) {
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
                                        
                                    };
								checkAction(type, checkType(prevRArray[1] ))
                                    break;
							}

                            //Remove any duplicates from R-Array:
                            newRArray = _.uniq(newRArray)
                            logDepth--
                            log(`> NEW R-ARRAY = '${  JSON.stringify(newRArray)  }'`)
                            logDepth--
                        }
						logDepth--

                        // Now unflag any traits that were flagged, but aren't in the newRArray
                        log(">>> SETTING TRAITS IN R-ARRAY *NOT* IN NEW R-ARRAY TO BE CLEARED...")
                        logDepth++
                        log(`> R-ARRAY: ${  JSON.stringify(rArray)  }, NEW R-ARRAY: ${  JSON.stringify(newRArray)}`)
                        var diff = rArray.filter(function (x) { return !newRArray.includes(x) } )
                        log(`> TRAITS TO CLEAR: ${  JSON.stringify(diff)}`)
                        var clearAttrs = {}
                        diff.forEach(function (x) {
							clearAttrs[`${x  }_flag`] = 0
                        } )
                        setAttrs(clearAttrs, {silent: true} )
                        // Set new R-Array:
                        rArray = _.clone(newRArray)
                        log(`> ATTRS TO BE SET: ${  JSON.stringify(newAttrs)}`)
                        logDepth--
                    }

					// If we aren't flagging a new stat, final roll array equals prevRArray; otherwise, it equals rArray.
					newAttrs.rollArray = ""
                    log(">>> DETERMINE R-ARRAY TO STORE FOR NEXT ROLL...")
                    logDepth++
                    if (isFlagChanged) {
						newAttrs.rollArray = rArray.join(",")
                        log(`> FLAG CHANGED! 'rollArray' = ${  JSON.stringify(newAttrs.rollArray)}`)
                        rotateMarquee()
                    } else {
						newAttrs.rollArray = prevRArray.join(",")
                        log(`> NO FLAG CHANGES: 'rollArray' = ${  JSON.stringify(newAttrs.rollArray)}`)
                    }
					logDepth--

                    // Arrange rArray in order: ATTRIBUTES, SKILLS, then OTHERS.
                    var order = []
                    rArray.filter(function (x) { return checkType(x) === "attribute" } ).forEach(function (x) { order.push(x) } )
                    rArray.filter(function (x) { return checkType(x) === "skill" } ).forEach(function (x) { order.push(x) } )
                    rArray.filter(function (x) { return ["advantage", "discipline", "tracker"].includes(checkType(x)) } ).forEach(function (x) { order.push(x) } )

                    log(`>>> ORDERING R-ARRAY: ${  JSON.stringify(order)}`)
                }

				log(">>> SETTING STAT DISPLAY FOR ROLLER...")
                logDepth++

                newAttrs.rolldisplay = ""

                if (!order || order.length === 0) {
					if (v.rollMod == 0 && v.rollDiff == 0)
						newAttrs.rolldisplay = "Simple Roll or Check"
                    else
						newAttrs.rolldisplay = "Simple Roll"
                } else
					{newAttrs.rolldisplay = order.map(function (traitname) { return realName(traitname, v); }).join(" + ");}

				log(`> FIRST PASS: ${  JSON.stringify(newAttrs.rolldisplay)}`)
                var flags = []

                if (newAttrs.rolldisplay !== "Simple Roll or Check") {
					if (v.rollMod < 0)
						newAttrs.rolldisplay += (` ${  v.rollMod}`).replace("-", "- ")
                    else if (v.rollMod > 0)
						newAttrs.rolldisplay += ` + ${  v.rollMod}`;
					if (v.rollDiff != 0)
						newAttrs.rolldisplay += ` vs. ${  v.rollDiff}`;
				}

				// newAttrs.rolldisplay += ".";
				log(`> FINAL DISPLAY: ${  JSON.stringify(newAttrs.rolldisplay)}`)
                logDepth--

                if (!options.reset) {
					log(">>> DETERMINING ROLL PARAMETERS, ROLL FLAGS, AND API COMMAND...")
                    logDepth++

                    // Add all stats to the parameter list:
                    newAttrs.roll_params = `@{character_name}|${  order.join(",")}`; // + "|" + v.Hunger + "|" + v.rollDiff + "|" + v.rollMod + "|";
					log(`> FIRST PASS (PARAMS): ${  JSON.stringify(newAttrs.roll_params)}`)
                }

				log(`>>> FINAL ATTRIBUTES TO BE SET: ${  JSON.stringify(newAttrs)}`)

                // Set ATTRIBUTES so they can be used by the roll template (which will be automatically called by the button press.

                setAttrs(newAttrs, {silent: true} )
            } )
        } )
    };
	// #endregion

	// #region GROUP SHEET ACTIONS

	_.each(GROUPPREFIXES, function (gN) {
		on(getTriggers( ["charname"], "", gN), () => getAttrs( [`${gN  }charname`], v => setAttrs(_.object( [[`${gN  }name`, v[`${gN  }charname`]]] ))))

        on(getTriggers( ["clan"], "", gN), () => updateClans(gN))
        on(getTriggers(DISCIPLINEREFS, "", gN), e => updateDiscs(e.sourceAttribute, gN))

        on(getTriggers( ["bonusHealth"], "", gN), () => updateTrackerMax("Health", gN))
        on(getTriggers( ["bonusWillpower"], "", gN), () => updateTrackerMax("Willpower", gN))
        on(getTriggers( ["Generation", "bonusBloodPotency"], "", gN), () => updateTrackerMax("Blood Potency Full", gN))
        on(getTriggers( [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, "sDmg", "aDmg"], "health_", gN), () => updateTracker("Health", gN))
        on(getTriggers( [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "sDmg", "aDmg"], "willpower_", gN), () => updateTracker("Willpower", gN))
        on(getTriggers( ["BloodPotency"], "", gN), () => updateTracker("Blood Potency", gN))
        on(`${getTriggers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "humanity_", gN)  } ${  getTriggers(["deltaHumanity", "deltaStains"], "", gN)}`, () => updateTracker("Humanity", gN))

        on(getTriggers(GROUPATTRS, "", gN, GROUPREPSECTIONS), () => updateRoller(gN))
    } )

    ////Group Character #1
    //on("change:g1charname", function () { getAttrs(["g1charname"], function (v) { setAttrs({ g1name: v.g1charname }); }) });
    //
    //on("change:g1clan", function () { updateClans("g1"); });
    //on(getTriggers(DISCIPLINEREFS, "g1"), function (eventInfo) { updateDiscs(eventInfo.sourceAttribute); });
    //
    //on("change:g1bonusHealth", function () { updateTrackerMax("Health", "g1"); });
    //on("change:g1bonusWillpower", function () { updateTrackerMax("Willpower", "g1"); });
    //on(getTriggers(["Generation", "bonusBloodPotency"], "g1"), function () { updateTrackerMax("Blood Potency Full", "g1"); });
    //on(getTriggers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, "sDmg", "aDmg"], "g1health_"), function () { updateTracker("Health", "g1"); });
    //on(getTriggers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "sDmg", "aDmg"], "g1willpower_"), function () { updateTracker("Willpower", "g1"); });
    //on("change:g1BloodPotency", function () { updateTracker("Blood Potency", "g1"); });
    //on(getTriggers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "g1humanity_") + " change:g1deltaHumanity change:g1deltaStains", function () {
    //    updateTracker("Humanity", "g1");
    //});
    //
    //on(getTriggers(GROUPATTRS, "", "g1", GROUPREPSECTIONS), function () { updateRoller("g1"); });
    //
    //// Group Character #2
    //on("change:g2charname", function () { getAttrs(["g2charname"], function (v) { setAttrs({ g2name: v.g2charname }); }) });
    //
    //on("change:g2clan", function () { updateClans("g2"); });
    //on(getTriggers(DISCIPLINEREFS, "g2"), function (eventInfo) { updateDiscs(eventInfo.sourceAttribute); });
    //
    //on("change:g2bonusHealth", function () { updateTrackerMax("Health", "g2"); });
    //on("change:g2bonusWillpower", function () { updateTrackerMax("Willpower", "g2"); });
    //on(getTriggers(["Generation", "bonusBloodPotency"], "g2"), function () { updateTrackerMax("Blood Potency Full", "g2"); });
    //on(getTriggers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, "sDmg", "aDmg"], "g2health_"), function () { updateTracker("Health", "g2"); });
    //on(getTriggers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "sDmg", "aDmg"], "g2willpower_"), function () { updateTracker("Willpower", "g2"); });
    //on("change:g2BloodPotency", function () { updateTracker("Blood Potency", "g2"); });
    //on(getTriggers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "g2humanity_") + " change:g2deltaHumanity change:g2deltaStains", function () {
    //    updateTracker("Humanity", "g2");
    //});
    //
    //on(getTriggers(GROUPATTRS, "", "g2", GROUPREPSECTIONS), function () { updateRoller("g2"); });
    //
    //// Group Character #3
    //on("change:g3charname", function () { getAttrs(["g3charname"], function (v) { setAttrs({ g3name: v.g3charname }); }) });
    //
    //on("change:g3clan", function () { updateClans("g3"); });
    //on(getTriggers(DISCIPLINEREFS, "g3"), function (eventInfo) { updateDiscs(eventInfo.sourceAttribute); });
    //
    //on("change:g3bonusHealth", function () { updateTrackerMax("Health", "g3"); });
    //on("change:g3bonusWillpower", function () { updateTrackerMax("Willpower", "g3"); });
    //on(getTriggers(["Generation", "bonusBloodPotency"], "g3"), function () { updateTrackerMax("Blood Potency Full", "g3"); });
    //on(getTriggers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, "sDmg", "aDmg"], "g3health_"), function () { updateTracker("Health", "g3"); });
    //on(getTriggers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "sDmg", "aDmg"], "g3willpower_"), function () { updateTracker("Willpower", "g3"); });
    //on("change:g3BloodPotency", function () { updateTracker("Blood Potency", "g3"); });
    //on(getTriggers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "g3humanity_") + " change:g3deltaHumanity change:g3deltaStains", function () {
    //    updateTracker("Humanity", "g3");
    //});
    //
    //on(getTriggers(GROUPATTRS, "", "g3", GROUPREPSECTIONS), function () { updateRoller("g3"); });
    //
    //// Group Character #4
    //on("change:g4charname", function () { getAttrs(["g4charname"], function (v) { setAttrs({ g4name: v.g4charname }); }) });
    //
    //on("change:g4clan", function () { updateClans("g4"); });
    //on(getTriggers(DISCIPLINEREFS, "g4"), function (eventInfo) { updateDiscs(eventInfo.sourceAttribute); });
    //
    //on("change:g4bonusHealth", function () { updateTrackerMax("Health", "g4"); });
    //on("change:g4bonusWillpower", function () { updateTrackerMax("Willpower", "g4"); });
    //on(getTriggers(["Generation", "bonusBloodPotency"], "g4"), function () { updateTrackerMax("Blood Potency Full", "g4"); });
    //on(getTriggers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, "sDmg", "aDmg"], "g4health_"), function () { updateTracker("Health", "g4"); });
    //on(getTriggers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "sDmg", "aDmg"], "g4willpower_"), function () { updateTracker("Willpower", "g4"); });
    //on("change:g4BloodPotency", function () { updateTracker("Blood Potency", "g4"); });
    //on(getTriggers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "g4humanity_") + " change:g4deltaHumanity change:g4deltaStains", function () {
    //    updateTracker("Humanity", "g4");
    //});
    //
    //on(getTriggers(GROUPATTRS, "", "g4", GROUPREPSECTIONS), function () { updateRoller("g4"); });
    //
    //// Group Character #5
    //on("change:g5charname", function () { getAttrs(["g5charname"], function (v) { setAttrs({ g5name: v.g5charname }); }) });
    //
    //on("change:g5clan", function () { updateClans("g5"); });
    //on(getTriggers(DISCIPLINEREFS, "g5"), function (eventInfo) { updateDiscs(eventInfo.sourceAttribute); });
    //
    //on("change:g5bonusHealth", function () { updateTrackerMax("Health", "g5"); });
    //on("change:g5bonusWillpower", function () { updateTrackerMax("Willpower", "g5"); });
    //on(getTriggers(["Generation", "bonusBloodPotency"], "g5"), function () { updateTrackerMax("Blood Potency Full", "g5"); });
    //on(getTriggers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, "sDmg", "aDmg"], "g5health_"), function () { updateTracker("Health", "g5"); });
    //on(getTriggers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "sDmg", "aDmg"], "g5willpower_"), function () { updateTracker("Willpower", "g5"); });
    //on("change:g5BloodPotency", function () { updateTracker("Blood Potency", "g5"); });
    //on(getTriggers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "g5humanity_") + " change:g5deltaHumanity change:g5deltaStains", function () {
    //    updateTracker("Humanity", "g5");
    //});
    //
    //on(getTriggers(GROUPATTRS, "", "g5", GROUPREPSECTIONS), function () { updateRoller("g5"); });
    //
    //// Group Character #6
    //on("change:g6charname", function () { getAttrs(["g6charname"], function (v) { setAttrs({ g6name: v.g6charname }); }) });
    //
    //on("change:g6clan", function () { updateClans("g6"); });
    //on(getTriggers(DISCIPLINEREFS, "g6"), function (eventInfo) { updateDiscs(eventInfo.sourceAttribute); });
    //
    //on("change:g6bonusHealth", function () { updateTrackerMax("Health", "g6"); });
    //on("change:g6bonusWillpower", function () { updateTrackerMax("Willpower", "g6"); });
    //on(getTriggers(["Generation", "bonusBloodPotency"], "g6"), function () { updateTrackerMax("Blood Potency Full", "g6"); });
    //on(getTriggers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, "sDmg", "aDmg"], "g6health_"), function () { updateTracker("Health", "g6"); });
    //on(getTriggers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "sDmg", "aDmg"], "g6willpower_"), function () { updateTracker("Willpower", "g6"); });
    //on("change:g6BloodPotency", function () { updateTracker("Blood Potency", "g6"); });
    //on(getTriggers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "g6humanity_") + " change:g6deltaHumanity change:g6deltaStains", function () {
    //    updateTracker("Humanity", "g6");
    //});
    //
    //on(getTriggers(GROUPATTRS, "", "g6", GROUPREPSECTIONS), function () { updateRoller("g6"); });
    //
    //// Group Character #7
    //on("change:g7charname", function () { getAttrs(["g7charname"], function (v) { setAttrs({ g7name: v.g7charname }); }) });
    //
    //on("change:g7clan", function () { updateClans("g7"); });
    //on(getTriggers(DISCIPLINEREFS, "g7"), function (eventInfo) { updateDiscs(eventInfo.sourceAttribute); });
    //
    //on("change:g7bonusHealth", function () { updateTrackerMax("Health", "g7"); });
    //on("change:g7bonusWillpower", function () { updateTrackerMax("Willpower", "g7"); });
    //on(getTriggers(["Generation", "bonusBloodPotency"], "g7"), function () { updateTrackerMax("Blood Potency Full", "g7"); });
    //on(getTriggers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, "sDmg", "aDmg"], "g7health_"), function () { updateTracker("Health", "g7"); });
    //on(getTriggers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "sDmg", "aDmg"], "g7willpower_"), function () { updateTracker("Willpower", "g7"); });
    //on("change:g7BloodPotency", function () { updateTracker("Blood Potency", "g7"); });
    //on(getTriggers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "g7humanity_") + " change:g7deltaHumanity change:g7deltaStains", function () {
    //    updateTracker("Humanity", "g7");
    //});
    //
    //on(getTriggers(GROUPATTRS, "", "g7", GROUPREPSECTIONS), function () { updateRoller("g7"); });
    //
    //// Group Character #8
    //on("change:g8charname", function () { getAttrs(["g8charname"], function (v) { setAttrs({ g8name: v.g8charname }); }) });
    //
    //on("change:g8clan", function () { updateClans("g8"); });
    //on(getTriggers(DISCIPLINEREFS, "g8"), function (eventInfo) { updateDiscs(eventInfo.sourceAttribute); });
    //
    //on("change:g8bonusHealth", function () { updateTrackerMax("Health", "g8"); });
    //on("change:g8bonusWillpower", function () { updateTrackerMax("Willpower", "g8"); });
    //on(getTriggers(["Generation", "bonusBloodPotency"], "g8"), function () { updateTrackerMax("Blood Potency Full", "g8"); });
    //on(getTriggers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, "sDmg", "aDmg"], "g8health_"), function () { updateTracker("Health", "g8"); });
    //on(getTriggers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "sDmg", "aDmg"], "g8willpower_"), function () { updateTracker("Willpower", "g8"); });
    //on("change:g8BloodPotency", function () { updateTracker("Blood Potency", "g8"); });
    //on(getTriggers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "g8humanity_") + " change:g8deltaHumanity change:g8deltaStains", function () {
    //    updateTracker("Humanity", "g8");
    //});
    //
    //on(getTriggers(GROUPATTRS, "", "g8", GROUPREPSECTIONS), function () { updateRoller("g8"); });
    //
    //// Group Character #9
    //on("change:g9charname", function () { getAttrs(["g9charname"], function (v) { setAttrs({ g9name: v.g9charname }); }) });
    //
    //on("change:g9clan", function () { updateClans("g9"); });
    //on(getTriggers(DISCIPLINEREFS, "g9"), function (eventInfo) { updateDiscs(eventInfo.sourceAttribute); });
    //
    //on("change:g9bonusHealth", function () { updateTrackerMax("Health", "g9"); });
    //on("change:g9bonusWillpower", function () { updateTrackerMax("Willpower", "g9"); });
    //on(getTriggers(["Generation", "bonusBloodPotency"], "g9"), function () { updateTrackerMax("Blood Potency Full", "g9"); });
    //on(getTriggers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, "sDmg", "aDmg"], "g9health_"), function () { updateTracker("Health", "g9"); });
    //on(getTriggers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "sDmg", "aDmg"], "g9willpower_"), function () { updateTracker("Willpower", "g9"); });
    //on("change:g9BloodPotency", function () { updateTracker("Blood Potency", "g9"); });
    //on(getTriggers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "g9humanity_") + " change:g9deltaHumanity change:g9deltaStains", function () {
    //    updateTracker("Humanity", "g9");
    //});
    //
    //on(getTriggers(GROUPATTRS, "", "g9", GROUPREPSECTIONS), function () { updateRoller("g9"); });

    var updateRoller = function (gN) {
		let $funcs = [
			$getRepAttrs(GROUPREPSECTIONS, GROUPREPREFS, gN),
			function (repAttrs, callback) {
				log(`GROUP REP ATTRS RECEIVED: ${  JSON.stringify(repAttrs)}`)
                getAttrs( ["character_name", `${gN  }charname`, `${gN  }Hunger`].concat(repAttrs.attrs), function (v) {
					log(`FULL LIST: ${  JSON.stringify(v)}`)
                    let attrList = {}
                    _.each(repAttrs.ids, function (rowId) {
						const p = s => "repeating_" + gN + "rolls_" + rowId + "_" + s;
						attrList[p("groll_params")] =
                            `${v[p("grollType")]  }|${ 
                            v["character_name"]  }|${ 
                            gN  }|${ 
                            v[gN + "charname"]  }|${ 
                            v[p("gtrait1name")]  }:${  v[p("gtrait1value")]  },${ 
                            v[p("gtrait2name")]  }:${  v[p("gtrait2value")]  }|${ 
                            v[p("grolldiff")]  }|${ 
                            v[p("grollmod")]  }|${ 
                            v[p("gposflags")]  }|${ 
                            v[p("gnegflags")]}`;
						log(`... NEW ROLL PARAMS: ${  JSON.stringify(attrList)}`)
                    } )
                    callback(null, attrList)
                } )
            },
			$set
		]
        run$($funcs)
    };
	// #endregion

	// #region Sheetworker Actions (Above "on(changes)" ignore sheetworker.)
	on("change:Hunger", function (eventInfo) {
        updateRolls("rolltype");
        
    } )
    //#endregion

    var rotateMarquee = function () {
		getAttrs( ["marqueeTracker"], function (m) {
			let mTracker = (m.marqueeTracker || "").split(",")
            if (mTracker.length < 10) {
				const newShuffle = _.shuffle(_.difference(_.keys(marqueeTips), mTracker))
                mTracker = _.shuffle(mTracker.concat(newShuffle.slice(0, 10)))
                mTracker = mTracker.concat(newShuffle.slice(10))
            }
			let thisMarquee = marqueeTips[mTracker.shift()]
            var attrList = {
				marqueeTracker: mTracker.join(","),
				marqueeLinesToggle: thisMarquee.length - 1,
				marqueeTitle: thisMarquee[0],
				marquee: thisMarquee.slice(1).join("\n")
			}
            setAttrs(attrList)
        } )
    };
})();