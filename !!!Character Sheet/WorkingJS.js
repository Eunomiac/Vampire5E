/* eslint-disable max-len */
/* eslint-disable one-var */
(() => {
	// #region Variable Declarations
	let [LOGPREFIX, LOGDEPTH] = ["", 0],
		LASTEVENT = {}
	const isDebug = true,
		LOGOPTIONS = {},
		ATTRIBUTES = {
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
		TRACKERS = ["Health", "Willpower", "Blood Potency", "Humanity"],
		// HUMSEQUENCES = ["BSH", "HBHXS", "SBS", "XHB"],
		ATTRBLACKLIST = ["toggle", "inccounter"],
		ROLLFLAGS = {
			all: ["rolldiff", "rollmod", "hunger", "applydisc", "applybloodsurge", "applyspecialty", "applyresonance", "incap", "Stains", "resonance", "rollarray"],
			num: ["rolldiff", "rollmod", "applydisc", "applybloodsurge", "applyspecialty", "applyresonance"],
			str: ["rollarray", "rollflagdisplay", "rollparams"]
		},
		FLAGACTIONS = {

			/* If key is flagged, action to take depending on type of stat it would be paired with.
				"append": Add the stat to the end of the list, bumping the oldest stat if necessary.
				"replace": Replace the would-be pair with this stat, keeping the older stat.
				"pass": Delete the stat and repeat comparison with the next-newest. */
			attribute: {
				attribute: "append",
				skill: "append",
				discipline: "append",
				advantage: "append",
				tracker: "append"
			},
			skill: {
				attribute: "append",
				skill: "replace",
				discipline: "pass",
				advantage: "append",
				tracker: "pass"
			},
			discipline: {
				attribute: "append",
				skill: "pass",
				discipline: "replace",
				advantage: "pass",
				tracker: "pass"
			},
			advantage: {
				attribute: "append",
				skill: "append",
				discipline: "pass",
				advantage: "replace",
				tracker: "pass"
			},
			tracker: {
				attribute: "append",
				skill: "pass",
				discipline: "pass",
				advantage: "pass",
				tracker: "replace"
			}
		},
		res_discs = {
			None: [" "],
			Choleric: ["Celerity", "Potence"],
			Melancholic: ["Fortitude", "Obfuscate"],
			Ischemic: ["Oblivion", ""],
			Phlegmatic: ["Auspex", "Dominate"],
			Sanguine: ["Blood Sorcery", "Presence"],
			Primal: ["Animalism", "Protean"],
			Mercurial: ["Alchemy", ""]
		},
		baneText = {
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
			"Lasombra": "Your Lasombra Blood is tainted by the same Abyss that gives you power over darkness.  Your reflection, recorded image and recorded voice are distorted, but not enough to hide your identity: avoiding vampire detection systems suffers a penalty equal to your Bane Severity.  Moreover, you must succeed on a Technology roll against a Difficulty of 2 plus your Bane Severity to use modern communications devices.",
			"Old Clan": "Your storied Tzimisce Blood is inexhorably tied to the Old World.  You must sleep each day submerged in soil taken from Eastern Europe, or you suffer a penalty equal to your Bane Severity to all dice pools the following night.",
			"Banu Haqim": "Your Assamite Blood drives you to feed from those deserving of punishment: especially the Kindred.  Upon slaking Hunger with Cainite Blood, you must roll to resist Hunger Frenzy against a Difficulty of 2 plus your Bane Severity.",
			"Hecata": "Your Hecata Blood is tainted with death.  When feeding, you do not cause ecstasy in your prey, but rather excruciating pain.  Moreover, mortals subconsciously sense your blighted nature:  You suffer a penalty equal to your Bane Severity to all attempts to feed from mortals that do not rely on force.",
			"Ministry": "Yours is the Blood of Set, and it shares His longing for darkness.  You suffer your Bane Severity in additional aggravated damage from sunlight, and an equivalent penalty to all dice pools when bright light is directed straight at you.",
			"Ravnos": "Your Ravnos Blood instills in you a weakness for a specific vice or crime: theft, deceit, con-artistry, etc.  When commiting your chosen vice would benefit you in some way, failure to act accordingly penalizes your Social and Mental dice pools by an amount equal to your Bane Severity for the remainder of the night."
		},
		clanDiscs = {
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
			"Old Clan": ["Animalism", "Auspex", "Protean"],
			"Banu Haqim": ["Celerity", "Obfuscate", "Blood Sorcery"],
			"Hecata": ["Auspex", "Fortitude", "Oblivion"],
			"Ministry": ["Obfuscate", "Presence", "Protean"],
			"Ravnos": ["Animalism", "Fortitude", "Chimerstry"]
		},
		genDepts = [
			null,
			null,
			null,
			null,
			{
				bp_max: 10,
				bp: 5
			},
			{
				bp_max: 9,
				bp: 4
			},
			{
				bp_max: 8,
				bp: 3
			},
			{
				bp_max: 7,
				bp: 3
			},
			{
				bp_max: 6,
				bp: 2
			},
			{
				bp_max: 5,
				bp: 2
			},
			{
				bp_max: 4,
				bp: 1
			},
			{
				bp_max: 4,
				bp: 1
			},
			{
				bp_max: 3,
				bp: 1
			},
			{
				bp_max: 3,
				bp: 1
			},
			{
				bp_max: 0,
				bp: 0
			},
			{
				bp_max: 0,
				bp: 0
			},
			{
				bp_max: 0,
				bp: 0
			},
		],
		bpDependants = [{
			bp_surge: 0,
			bp_mend: 1,
			bp_discbonus: 0,
			bp_rousereroll: 0,
			bp_baneseverity: 0,
			bp_slakeanimal: 1,
			bp_slakehuman: 0,
			bp_slakekill: 1
		},
		{
			bp_surge: 1,
			bp_mend: 1,
			bp_discbonus: 1,
			bp_rousereroll: 0,
			bp_baneseverity: 1,
			bp_slakeanimal: 1,
			bp_slakehuman: 0,
			bp_slakekill: 1
		},
		{
			bp_surge: 1,
			bp_mend: 2,
			bp_discbonus: 1,
			bp_rousereroll: 1,
			bp_baneseverity: 1,
			bp_slakeanimal: 0.5,
			bp_slakehuman: 0,
			bp_slakekill: 1
		},
		{
			bp_surge: 2,
			bp_mend: 2,
			bp_discbonus: 1,
			bp_rousereroll: 2,
			bp_baneseverity: 2,
			bp_slakeanimal: 0,
			bp_slakehuman: 0,
			bp_slakekill: 1
		},
		{
			bp_surge: 2,
			bp_mend: 3,
			bp_discbonus: 2,
			bp_rousereroll: 2,
			bp_baneseverity: 2,
			bp_slakeanimal: 0,
			bp_slakehuman: -1,
			bp_slakekill: 1
		},
		{
			bp_surge: 3,
			bp_mend: 3,
			bp_discbonus: 2,
			bp_rousereroll: 3,
			bp_baneseverity: 3,
			bp_slakeanimal: 0,
			bp_slakehuman: -1,
			bp_slakekill: 2
		},
		{
			bp_surge: 3,
			bp_mend: 3,
			bp_discbonus: 3,
			bp_rousereroll: 3,
			bp_baneseverity: 3,
			bp_slakeanimal: 0,
			bp_slakehuman: -2,
			bp_slakekill: 2
		},
		{
			bp_surge: 4,
			bp_mend: 3,
			bp_discbonus: 3,
			bp_rousereroll: 4,
			bp_baneseverity: 4,
			bp_slakeanimal: 0,
			bp_slakehuman: -2,
			bp_slakekill: 2
		},
		{
			bp_surge: 4,
			bp_mend: 4,
			bp_discbonus: 4,
			bp_rousereroll: 4,
			bp_baneseverity: 4,
			bp_slakeanimal: 0,
			bp_slakehuman: -2,
			bp_slakekill: 3
		},
		{
			bp_surge: 5,
			bp_mend: 4,
			bp_discbonus: 4,
			bp_rousereroll: 5,
			bp_baneseverity: 5,
			bp_slakeanimal: 0,
			bp_slakehuman: -2,
			bp_slakekill: 3
		},
		{
			bp_surge: 5,
			bp_mend: 5,
			bp_discbonus: 5,
			bp_rousereroll: 5,
			bp_baneseverity: 5,
			bp_slakeanimal: 0,
			bp_slakehuman: -3,
			bp_slakekill: 3
		}],
		marqueeTips = [
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
				"stands for six clans: Malkavian, Nosferatu, Toreador, Tremere, Ventrue, and recent inductees the Banu Haqim."],
			["The Anarchs",
				"The Anarchs are vampires who reject the status quo of Camarilla society.  They especially resent the privileged status held by",
				"elders, and champion the rights of younger Kindred against an establishment that concentrates power among the very old.  Unlike the",
				"Sabbat, the Anarchs loosely hold to the Traditions of the Camarilla, and are largely (if reluctantly) tolerated by the larger sect."],
			["The Sabbat",
				"The Sabbat is a loose organization of Kindred who reject the Traditions and the assumed humanity of the Camarilla, their bitter enemies.",
				"Though antitribu of any clan are welcome, Clans Lasombra and Tzimisce are the traditional fists and faith of the Sabbat — though there are",
				"rumors coming out of Chicago that the Clan of Night is defecting to the Camarilla en masse, to rule side-by-side with Clan Ventrue."],
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
				"generation, childe of Zillah the Beautiful, childe of Caine the First.  Traditionally seen as dangerous assassins and diablerists, in",
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
				"The Ventrue and the Lasombra are as alike as they are polar opposites: As the Ventrue rule the Camarilla, the Lasombra rule the",
				"Sabbat. Both Embrace the capable and the ambitious; both prize power above all else; and both consider themselves the true masters",
				"of Dominate. Their hatred for each other is matched only by their grudging respect for their rival kings among the Kindred."],
			["Clan Rivalries: Brujah & Ventrue",
				"When Ventrue-controlled Rome sacked Carthage, the greatest of Clan Brujah's achievements, they sparked a rivalry whose age is",
				"only surpassed by the feud between Clan Ravnos and Clan Gangrel.  With Clan Ventrue embodying the status quo and Clan Brujah",
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
	// #endregion

	// #region Repeating Field Configuration
	const DISCENUMS = ["disc1", "disc2", "disc3"],
		DISCREPREFS = {
			discLeft: ["disc", "disc_name", "disc_flag", "discpower_toggle"],
			discMid: ["disc", "disc_name", "disc_flag", "discpower_toggle"],
			discRight: ["disc", "disc_name", "disc_flag", "discpower_toggle"]
		},
		ADVREPREFS = {
			advantage: ["advantage", "advantage_name", "advantage_flag", "advantage_type", "advantage_details"],
			negadvantage: ["negadvantage", "negadvantage_name", "negadvantage_flag", "negadvantage_type", "negadvantage_details"]
		},
		XPREPREFS = {
			spentxp: ["xp_spent_toggle", "xp_category", "xp_trait", "xp_initial", "xp_new", "xp_trait_toggle", "xp_initial_toggle", "xp_arrow_toggle", "xp_new_toggle", "xp_cost"],
			earnedxp: ["xp_session", "xp_award", "xp_reason"],
			earnedxpright: ["xp_session", "xp_award", "xp_reason"]
		},
		XPPARAMS = {
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
		},
		GROUPPREFIXES = ["g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8", "g9"],
		GROUPATTRS = ["charname", "hunger"],
		GROUPREPREFS = {
			rolls: ["grolltype", "gtrait1name", "gtrait1value", "gtrait2name", "gtrait2value", "grolldiff", "grollmod", "gposflags", "gnegflags", "grollparams"]
		},
		PROJREPREFS = {
			project: ["projectstartdate", "projectincnum", "projectincunit", "projectenddate", "projectinccounter", "projectscope", "projectlaunchtrait1_name", "projectlaunchtrait1", "projectlaunchtrait2_name", "projectlaunchtrait2", "projectlaunchmod", "projectstake1_name", "projectstake1", "projectstake2_name", "projectstake2", "projectstake3_name", "projectstake3", "projectstake4_name", "projectstake4", "projectstake5_name", "projectstake5", "projectstake6_name", "projectstake6", "projectlaunchresults", "projectlaunchresultsmargin", "projectlaunchdiffmod", "projectwasrushed"]
		},
		PROJDATEREFS = ["projectstartdate", "projectincnum", "projectincunit", "projectenddate", "projectinccounter", "projectrushpool", "projectlaunchroll_toggle", "projectlaunchresults"]
	// #endregion

	// #region Derivative Stats
	const BASICATTRS = _.map(_.flatten( [_.values(ATTRIBUTES), _.values(SKILLS), DISCENUMS, TRACKERS] ), v => v.toLowerCase()),
		BASICFLAGS = _.map(_.omit(BASICATTRS, TRACKERS), v => `${v}_flag`),
		ALLATTRS = _.map( [
			...ROLLFLAGS.all,
			...BASICATTRS,
			...BASICFLAGS,
			..._.map(DISCENUMS, v => `${v}_name`)
		], v => v.toLowerCase()),
		ATTRDISPNAMES = _.flatten( [_.values(ATTRIBUTES), _.values(SKILLS), DISCIPLINES, TRACKERS] )
	// #endregion

	// #region UTILITY: Logging, Checks & String Formatting
	const log = (msg, isWarn, isLoud, logPrefix = LOGPREFIX) => {
			const prefix = LOGOPTIONS.silent ? `  ($${logPrefix}$)` : logPrefix + " ".repeat(LOGDEPTH * 3)
			if (isDebug && (isLoud || !LOGOPTIONS.silent))
				// eslint-disable-next-line no-console
				console[isWarn ? "warn" : "log"](prefix + msg)
		},
		isBlacklisted = (attr = "") => _.filter(ATTRBLACKLIST, bannedAttr => attr.toLowerCase().includes(bannedAttr.toLowerCase())) > 0,
		trimAttr = attr => _.isString(attr) ? attr.replace(/(_flag|_type|_name)/gu, "") : JSON.stringify(attr),
		parseRepAttr = attr => {
			if (attr.includes("repeating")) {
				return {
					sec: attr.replace(/repeating_(.*?)_(-.*?)_(.*?)$/gu, "$1"),
					rowID: attr.replace(/repeating_(.*?)_(-.*?)_(.*?)$/gu, "$2"),
					attr: attr.replace(/repeating_(.*?)_(-.*?)_(.*?)$/gu, "$3")
				}
			}

			return {
				attr
			}
		},
		trimStat = attrList => _.object(_.map(_.keys(attrList), k => [parseRepAttr(k).attr, attrList[k]] )),
		isIn = (needle, haystack) => {
			if (!_.isString(needle))
				return false
			if (_.isString(haystack))
				return haystack.search(new RegExp(needle, "iu")) > -1 && haystack
			const [ndl, hay] = [`\\b${needle}\\b`, haystack],
				names = _.isArray(hay) ?
					_.flatten(hay) :
					_.isObject(hay) ? _.keys(hay) : [hay],
				index = _.findIndex(names,
					v => v.match(new RegExp(ndl, "iu")) !== null ||
					v.match(new RegExp(ndl.replace(/_/gu, " "), "iu")) !== null ||
					v.match(new RegExp(ndl.replace(/\s/gu, "_"), "iu")) !== null ||
					v.match(new RegExp(ndl.replace(/(\w)(?=[A-Z])/gu, "$1 "), "iu")) !== null ||
					v.match(new RegExp(ndl.replace(/_/gu), "iu")) !== null ||
					v.match(new RegExp(ndl.replace(/\s/gu), "iu")) !== null)

			return index >= 0 && names[index]
		},
		realName = (attr, ATTRS = {} ) => isIn(trimAttr(attr), ATTRDISPNAMES) ||
		isIn(ATTRS[`${trimAttr(attr)}_name`], ATTRDISPNAMES) ||
		ATTRS[`${trimAttr(attr)}_name`] ||
		trimAttr(attr),
		parseTAttrs = (tAttrs, tPrefix = "", trigger = "change:") => _.map(tAttrs, v => trigger + tPrefix + v).join(" "),
		getTriggers = (tAttrs, tPrefix = "", gN = "", tSecs) => _.compact( [
			tAttrs ? parseTAttrs(tAttrs, gN + tPrefix) : "",
			tSecs ? parseTAttrs(tSecs, `repeating_${gN}${tPrefix}`) : "",
			tSecs ? parseTAttrs(tSecs, `repeating_${gN}${tPrefix}`, "remove:") : ""
		] ).join(" "),
		groupify = (attrArray, gN = "") => _.map(attrArray, attr => gN + attr)
	// #endregion

	// #region UTILITY: Asynchronous Function Handling
	const run$ = (tasks, cback) => {
			let current = 0
			const done = (empty, ...args) => {
					const end = () => {
						const newArgs = args ? [].concat(empty, args) : [empty]
						if (cback)
							cback(...newArgs)
					}
					end()
				},
				each = (empty, ...args) => {
					if (++current >= tasks.length || empty)
						done(empty, args)
					else
						tasks[current].apply(undefined, [].concat(args, each))
				}

			if (tasks.length)
				tasks[0](each)
			else
				done(null)
		},
		$set = (attrList, cback) => {
			setAttrs(attrList, {}, () => {
				log(`>> ATTRS SET >> ${JSON.stringify(trimStat(attrList))}`)
				cback(null)
			} )
		},
		$getRepAttrs = (repInfo = {}, gN = "") => cback => {
			const repVals = [
					[],
					[]
				],
				$funcs = []
			if (_.isString(repInfo)) {
				_.each(_.compact(repInfo.split(",")), v => {
					if (v.includes("repeating")) {
						repVals[0].push(v)
						repVals[1] = _.uniq( [...repVals[1], v.split("_")[2]] )
					}
				} )
				cback(null, ...repVals)
			} else {
				_.each(_.keys(repInfo), sec => {
					$funcs.push(cbk => {
						getSectionIDs(sec, idArray => {
							_.each(idArray, repID => {
								_.each(repInfo[sec], stat => {
									repVals[0].push(`repeating_${gN}${sec}_${repID}_${stat}`)
								} )
								repVals[1].push(repID)
							} )
							cbk(null)
						} )
					} )
				} )
				run$($funcs, () => cback(null, ...repVals))
			}
		}
	// #endregion

	// #region UTILITY: Date & Time Handling
	const parseDString = str => {
			if (parseInt(str))
				return new Date(parseInt(str))
			if (_.isString(str) && str !== "") {
				const strArray = _.compact(str.split(/[\s,]+?/gu))

				return new Date(`${strArray[2]}-${["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].indexOf(strArray[0].slice(0, 3).toLowerCase()) + 1}-${strArray[1]}`)
			}

			return str
		},
		formatDString = date => `${
			["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][date.getMonth()]
		} ${
			date.getUTCDate()
		}, ${
			date.getUTCFullYear()
		}`,
		getProgress = (todaysDate, startDate, endDate) => {
			const dates = {
				start: parseDString(startDate),
				today: parseDString(todaysDate),
				end: parseDString(endDate)
			}

			if (dates.today.getTime() >= dates.end.getTime())
				return 1

			return (dates.today.getTime() - dates.start.getTime()) / (dates.end.getTime() - dates.start.getTime())
		}
	// #endregion

	// #region UPDATE: Clan, Discipline, Resonance, DOB/DOE, Marquee Rotating
	const $checkRituals = (gN = "") => cback => {
			const attrList = {},
				$funcs = [
					$getRepAttrs( {
						discLeft: ["disc_name"],
						discMid: ["disc_name"],
						discRight: ["disc_name"]
					}, gN),
					(attrs, ids, cBack) => {
						getAttrs( [...groupify( ["disc1_name", "disc2_name", "disc3_name"], gN), ...attrs], ATTRS => {
							attrList[`${gN}rituals_toggle`] = _.values(ATTRS).includes("Blood Sorcery") || _.values(ATTRS).includes("Oblivion") ? 1 : 0
							attrList[`${gN}formulae_toggle`] = _.values(ATTRS).includes("Alchemy") ? 1 : 0
							cBack(null, attrList)
						} )
					},
					$set
				]
			run$($funcs, () => cback(null))
		},
		doClans = (gN = "") => {
			const attrList = {},
				$funcs = [
					cBack => {
						getAttrs(groupify( ["clan", "bp"], gN), ATTRS => {
							attrList.bane_title = `${ATTRS[`${gN}clan`]} Clan Bane`
							attrList.bane_text = baneText[ATTRS[`${gN}clan`]].replace("Bane Severity", `Bane Severity (${
								bpDependants[ATTRS[`${gN}bp`]].bp_baneseverity
							})`)
							const cDiscs = clanDiscs[ATTRS[`${gN}clan`]]
							for (let i = 1; i <= 3; i++) {
								if (cDiscs[i - 1] === "") {
									attrList[`${gN}disc${i}_toggle`] = 0
									attrList[`${gN}disc${i}_name`] = ""
								} else {
									attrList[`${gN}disc${i}_toggle`] = 1
									attrList[`${gN}disc${i}_name`] = cDiscs[i - 1]
								}
							}
							cBack(null, attrList)
						} )
					},
					$set,
					$checkRituals(gN)
				]
			run$($funcs)
		},
		doDiscPowers = (stat, gN = "") => {
			if (isBlacklisted(stat))
				return
			const attrList = {},
				$funcs = [
					cback => {
						getAttrs( [stat], ATTRS => {
							log(`[DODISCS ATTRS = ${JSON.stringify(ATTRS)}]`)
							if (stat.endsWith("disc") || stat.startsWith("disc"))
								attrList[`${stat}power_toggle`] = ATTRS[stat]
							cback(null, attrList)
						} )
					},
					$set,
					$checkRituals(gN)
				]
			run$($funcs)
		},
		doResonance = (gN = "") => {
			const attrList = {},
				$funcs = [
					cback => {
						getAttrs(groupify( ["resonance"], gN), ATTRS => {
							attrList[`${gN}res_discs`] = ATTRS[`${gN}resonance`] === "None" ? " " : `(${_.compact(res_discs[ATTRS[`${gN}resonance`]] ).join(" & ")})`
							cback(null, attrList)
						} )
					},
					$set
				]
			run$($funcs)
		},
		doDOBDOE = (gN = "") => {
			const attrList = {},
				$funcs = [
					cback => {
						getAttrs(groupify( ["char_dob", "char_doe"], gN), ATTRS => {
							attrList[`${gN}char_dobdoe`] = `${ATTRS[`${gN}char_dob`]} — ${ATTRS[`${gN}char_doe`]}`
							cback(null, attrList)
						} )
					},
					$set
				]
			run$($funcs)
		},
		doMarquee = () => {
			const attrList = {},
				$funcs = [
					cback => {
						getAttrs( ["marquee_tracker"], ATTRS => {
							let mTracker = (ATTRS.marquee_tracker || "").split(","),
								[thisMarquee, tIndex] = [
									[], null
								]
							if (mTracker.length < 10) {
								const newShuffle = _.shuffle(
									_.difference(
										_.keys(marqueeTips), mTracker
									)
								)
								mTracker = _.compact( [
									..._.shuffle(mTracker.concat(newShuffle.slice(0, 10))),
									...mTracker.concat(newShuffle.slice(10))
								] )
							}
							do
								tIndex = parseInt(mTracker.shift())
							while (tIndex === null)
							thisMarquee = marqueeTips[tIndex]
							attrList.marquee_tracker = mTracker.join(",")
							attrList.marquee_lines_toggle = thisMarquee.length - 1;
							[attrList.marquee_title] = thisMarquee
							attrList.marquee = thisMarquee.slice(1).join("\n")
							cback(null, attrList)
						} )
					},
					$set
				]
			run$($funcs)
		}

	on("change:clan", eInfo => {
		[LOGPREFIX, LOGDEPTH] = [`[dCLAN(${trimAttr(eInfo.sourceAttribute)})]`, 0]
		doClans()
	} )
	on(getTriggers(DISCENUMS, "", "", _.keys(DISCREPREFS)), eInfo => {
		if (!isBlacklisted(eInfo.sourceAttribute)) {
			[LOGPREFIX, LOGDEPTH] = [`[dPOWERS(${trimAttr(eInfo.sourceAttribute)})]`, 0]
			doDiscPowers(eInfo.sourceAttribute)
		}
	} )
	on("change:resonance", eInfo => {
		[LOGPREFIX, LOGDEPTH] = [`[dRESONANCE(${trimAttr(eInfo.sourceAttribute)})]`, 0]
		doResonance()
	} )
	on("change:char_dob change:char_doe", eInfo => {
		[LOGPREFIX, LOGDEPTH] = [`[dDOB(${trimAttr(eInfo.sourceAttribute)})]`, 0]
		doDOBDOE()
	} )
	on("change:tab_core", eInfo => {
		[LOGPREFIX, LOGDEPTH] = [`[dMARQUEE(${trimAttr(eInfo.sourceAttribute)})]`, 0]
		doMarquee()
		setAttrs( {
			lastbox: "",
			lasthumanity: "",
			laststains: "",
			lastcollisions: ""
		} )
	} )
	// #endregion

	// #region UPDATE: Trackers (Health, Willpower, Blood Potency, Humanity)
	const $binCheck = (tracker, gN = "") => {
			const p = v => `${gN}${tracker.toLowerCase()}_${v}`,
				dmgBins = [
					[],
					[],
					[]
				],
				attrList = {}
			let attrs = []
			switch (tracker.toLowerCase()) {
			case "health":
				attrs = groupify( [..._.map( [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, "max", "sdmg", "admg"], v => `health_${v}`), "incap"], gN)
				break
			case "willpower":
				attrs = groupify( [..._.map( [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "max", "sdmg", "admg"], v => `willpower_${v}`), "incap"], gN)
				break
			default:
				log(`ERROR: Invalid tracker sumbitted to binCheck: ${tracker}`)

				return false
			}

			return cback => {
				getAttrs(attrs, ATTRS => {
					const pV = v => ATTRS[p(v)],
						pI = v => parseInt(pV(v)) || 0,
						// Activate Boxes Based on Max Stats
						boxList = _.pick(ATTRS, (v, k) => {
							const num = parseInt(k.split("_")[1] )

							return !_.isNaN(num) && num <= pI("max")
						} )

					// Sort Boxes According to Damage
					_.each(boxList, (dmg, box) => dmgBins[dmg].push(box))

					// Apply New Damage & Healing
					if (pI("sdmg") !== 0) {
						attrList[p("sdmg")] = pI("sdmg")
						while (attrList[p("sdmg")] > 0) {
							if (dmgBins[0].length > 0) { // There's enough blank boxes for the superficial hit.
								dmgBins[1].push(dmgBins[0].shift())
								attrList[p("sdmg")]--
							} else if (dmgBins[1].length > 0) { // Boxes are filled, try to upgrade to aggravated.
								dmgBins[2].push(dmgBins[1].shift())
								attrList[p("sdmg")]-- // All boxes are filled with Aggravated: Death.
							} else {
								break
							}
						}
						while (attrList[p("sdmg")] < 0) {
							if (dmgBins[1].length > 0) { // Superficial damage present, so heal.
								dmgBins[0].push(dmgBins[1].pop())
								attrList[p("sdmg")]++
							} else {
								break
							}
						}
					}
					if (pI("admg") !== 0) {
						attrList[p("admg")] = pI("admg")
						while (attrList[p("admg")] > 0) {
							if (dmgBins[0].length > 0) {
								dmgBins[2].push(dmgBins[0].shift())
								attrList[p("admg")]--
							} else if (dmgBins[1].length > 0) {
								dmgBins[2].push(dmgBins[1].shift())
								attrList[p("admg")]--
							} else {
								break
							}
						}
						while (attrList[p("admg")] < 0) {
							if (dmgBins[2].length > 0) {
								dmgBins[0].push(dmgBins[2].pop())
								attrList[p("admg")]--
							} else {
								break
							}
						}
					}

					// Check For Incapacitation
					if (dmgBins[0].length === 0) {
						attrList[`${gN}incap`] = _.compact(_.uniq(_.union((ATTRS[`${gN}incap`] || "").split(","), [tracker] ))).join(",")
						attrList[`${gN}${tracker.toLowerCase()}_impair_toggle`] = 1
					} else {
						attrList[`${gN}incap`] = _.compact(_.uniq(_.difference((ATTRS[`${gN}incap`] || "").split(","), [tracker] ))).join(",")
						attrList[`${gN}${tracker.toLowerCase()}_impair_toggle`] = 0
					}

					// Apply Tracker Damage to Boxes
					let binNum = 0
					_.each(dmgBins, bin => {
						_.each(bin, box => {
							if (parseInt(ATTRS[box] ) !== binNum)
								attrList[box] = binNum
						} )
						binNum++
					} )
					attrList[`${gN}${tracker}`] = dmgBins[0].length

					cback(null, attrList)
				} )
			}
		},
		doTracker = (tracker, eInfo = { sourceAttribute: "" }, gN = "", cback) => {
			const attrList = {},
				$funcs = []
			switch (tracker.toLowerCase()) {
			case "health":
			case "willpower":
				$funcs.push($binCheck(tracker, gN))
				break
			case "blood potency full":
			case "blood potency":
				$funcs.push(cbk => {
					getAttrs(groupify( ["clan", "bp"], gN), ATTRS => {
						_.each(bpDependants[ATTRS[`${gN}bp`]], (v, k) => {
							attrList[gN + k] = v
						} )
						attrList[`${gN}bp_surgetext`] =
								attrList[`${gN}bp_surge`] === 0 ?
									"None" :
									`+${attrList[`${gN}bp_surge`] === 1 ?
										`${attrList[`${gN}bp_surge`]} Die` :
										`${attrList[`${gN}bp_surge`]} Dice`}`
						attrList[`${gN}bp_mendtext`] =
								attrList[`${gN}bp_mend`] === 0 ?
									"None" :
									`${
										attrList[`${gN}bp_mend`]
									} Superficial`
						attrList[`${gN}bp_discbonustext`] =
								attrList[`${gN}bp_discbonus`] === 0 ?
									"None" :
									`+${
										attrList[`${gN}bp_discbonus`] === 1 ?
											`${
												attrList[`${gN}bp_discbonus`]
											} Die` :
											`${
												attrList[`${gN}bp_discbonus`]
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
											attrList[`${gN}bp_rousereroll`]
										]
									}`
						attrList[`${gN}bp_slakebag`] = attrList[`${gN}bp_slakeanimal`]
						attrList[`${gN}bp_slaketext`] = `Animals & bagged blood slake ${
							{0: "no", 0.5: "half", 1: "full"}[attrList[`${gN}bp_slakeanimal`]]
						} Hunger.\n${
							attrList[`${gN}bp_slakehuman`] === 0 ?
								"Humans slake full Hunger.\n" :
								`${attrList[`${gN}bp_slakehuman`]} Hunger slaked from humans.\n`
						}Must kill to reduce Hunger below ${attrList[`${gN}bp_slakekill`]}.`
						cbk(null, attrList)
					} )
				} )
				break
			case "humanity":
				$funcs.push(cbk => {
					if (eInfo.sourceType !== "sheetworker") {
						const attrArray = groupify( [..._.map( [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], v => `humanity_${v}`)]),
							   humArray = new Array(10)
						getAttrs(groupify(["stains", "humanity"]), ATTRS => {
							const humanity = Math.min(10, Math.max(0, parseInt(ATTRS[`${gN}humanity`]))),
								    stains = Math.min(10, Math.max(0, parseInt(ATTRS[`${gN}stains`])))
							attrList[`${gN}humanity_impair_toggle`] = 0		
							log(`... Humanity: ${JSON.stringify(humanity)}, Stains: ${JSON.stringify(stains)}, ATTRS: ${JSON.stringify(ATTRS)}`)
							humArray.fill(3, 10 - stains)
							humArray.fill(2, 0, Math.max(humanity, 0))
							humArray.fill(1, humanity, 10 - stains)
							log(`... humArray: ${JSON.stringify(humArray)}`)
							for (let i = 0; i < humArray.length; i++) {
								attrList[attrArray[i]] = humArray[i]
							}
							attrList[`${gN}stains`] = humArray.filter(v => v === 3).length				
							log(`... attrList: ${JSON.stringify(attrList)}`)
							cbk(null, attrList)
						})
					}
				})
				break
			case "stains":
				$funcs.push(cbk => {
					if (eInfo.sourceType !== "sheetworker") {
						const attrArray = groupify( [..._.map( [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], v => `humanity_${v}`)]),
							humArray = new Array(10)
						getAttrs(groupify(["humanity", "stains"]), ATTRS => {
							const humanity = Math.min(10, Math.max(0, parseInt(ATTRS[`${gN}humanity`]))),
								    stains = Math.min(10, Math.max(0, parseInt(ATTRS[`${gN}stains`])))
							attrList[`${gN}humanity_impair_toggle`] = 0
							log(`... Humanity: ${JSON.stringify(humanity)}, Stains: ${JSON.stringify(stains)}, ATTRS: ${JSON.stringify(ATTRS)}`)
							if (humanity + stains > 10) {
								attrList[`${gN}humanity_impair_toggle`] = 1
								humArray.fill(4)
								humArray.fill(3, humanity)
								humArray.fill(2, 0, 10 - stains)
							} else {
								humArray.fill(1)
								humArray.fill(2, 0, humanity)
								humArray.fill(3, 10 - stains)
							}
							log(`... humArray: ${JSON.stringify(humArray)}`)
							for (let i = 0; i < humArray.length; i++) {
								attrList[attrArray[i]] = humArray[i]
							}
							log(`... attrList: ${JSON.stringify(attrList)}`)
							cbk(null, attrList)
						})
					}
				})
				break
			default:
				log(`Error in doTracker(${tracker}, ${gN}): Unrecognized tracker.`)

				return
			}
			$funcs.push($set)
			run$($funcs, cback ? () => cback(null) : undefined)
		},
		$doTracker = (tracker, eInfo, gN = "") => cback => doTracker(tracker, eInfo, gN, cback),
		doTrackerMax = (tracker, eInfo, gN = "") => {
			const attrList = {},
				$funcs = []
			switch (tracker.toLowerCase()) {
			case "health":
				$funcs.push(cback => {
					getAttrs(groupify( ["stamina", "bonus_health"], gN), ATTRS => {
						if (gN === "") {
							attrList.health_max = Math.min(
								15,
								Math.max(
									1,
									_.reduce(_.values(ATTRS), (memo, num) => parseInt(memo) + parseInt(num)) + 3
								)
							)
						} else {
							attrList[`${gN}health_max`] = ATTRS[`${gN}bonus_health`]
						}
						cback(null, attrList)
					} )
				} )
				break
			case "willpower":
				$funcs.push(cback => {
					getAttrs(groupify( ["composure", "resolve", "bonus_willpower"], gN), ATTRS => {
						if (gN === "") {
							attrList.willpower_max =
									Math.min(
										10,
										Math.max(
											1,
											_.reduce(_.values(ATTRS), (memo, num) => parseInt(memo) + parseInt(num))
										)
									)
						} else {
							attrList[`${gN}willpower_max`] = ATTRS[`${gN}bonus_willpower`]
						}
						cback(null, attrList)
					} )
				} )
				break
			case "blood potency full":
			case "blood potency":
				$funcs.push(cback => {
					getAttrs(groupify( ["generation", "bonus_bp"], gN), ATTRS => {
						attrList[`${gN}bp_max`] = Math.min(10, Math.max(0, genDepts[parseInt(ATTRS[`${gN}generation`] )].bp_max + (gN === "" ? parseInt(ATTRS[`${gN}bonus_bp`] ) : 0)))
						if (tracker === "Blood Potency Full")
							attrList[`${gN}bp`] = genDepts[parseInt(ATTRS[`${gN}generation`] )].bp
						cback(null, attrList)
					} )
				} )
				break
			default:
				log(`ERROR: Unrecognized Tracker Type ${tracker}`)

				return
			}

			$funcs.push($set)
			$funcs.push($doTracker(tracker, eInfo, gN))

			run$($funcs)
		}

	on("change:stamina change:bonus_health", eInfo => {
		[LOGPREFIX, LOGDEPTH] = [`[dH.MAX(${trimAttr(eInfo.sourceAttribute)})]`, 0]
		doTrackerMax("Health")
	} )
	on("change:composure change:resolve change:bonus_willpower", eInfo => {
		[LOGPREFIX, LOGDEPTH] = [`[dWP.MAX(${trimAttr(eInfo.sourceAttribute)})]`, 0]
		doTrackerMax("Willpower")
	} )
	on("change:generation change:bonus_bp", eInfo => {
		[LOGPREFIX, LOGDEPTH] = [`[dBP.MAX(${trimAttr(eInfo.sourceAttribute)})]`, 0]
		doTrackerMax("Blood Potency Full")
	} )
	on(getTriggers( [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, "sdmg", "admg"], "health_"), eInfo => {
		if (eInfo.sourceType !== "api" || ["health_sdmg", "health_admg"].includes(eInfo.sourceAttribute)) {
			[LOGPREFIX, LOGDEPTH] = [`[dHEALTH(${trimAttr(eInfo.sourceAttribute)})]`, 0]
			doTracker("Health", eInfo)
		}
	} )
	on(getTriggers( [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "sdmg", "admg"], "willpower_"), eInfo => {
		if (eInfo.sourceType !== "api" || ["willpower_sdmg", "willpower_admg"].includes(eInfo.sourceAttribute)) {
			[LOGPREFIX, LOGDEPTH] = [`[dWILL(${trimAttr(eInfo.sourceAttribute)})]`, 0]
			doTracker("Willpower", eInfo)
		}
	} )
	on("change:bp", eInfo => {
		[LOGPREFIX, LOGDEPTH] = [`[dBP(${trimAttr(eInfo.sourceAttribute)})]`, 0]
		doTracker("Blood Potency", eInfo)
	} )
	on("change:humanity", eInfo => {
		[LOGPREFIX, LOGDEPTH] = [`[dHum(${trimAttr(eInfo.sourceAttribute)})]`, 0]
		log(`[${eInfo.sourceAttribute}, ${eInfo.sourceType}] @@@ HUMANITY TRIGGERED @@@ eInfo = ${JSON.stringify(eInfo)}`)
		doTracker("Humanity", eInfo)
	} )	
	on("change:stains", eInfo => {
		[LOGPREFIX, LOGDEPTH] = [`[dStn(${trimAttr(eInfo.sourceAttribute)})]`, 0]
		log(`[${eInfo.sourceAttribute}, ${eInfo.sourceType}] @@@ STAINS TRIGGERED @@@ eInfo = ${JSON.stringify(eInfo)}`)
		doTracker("Stains", eInfo)
	} )
	// #endregion

	// #region UPDATE: Projects, Memoriam, Time

	const doProjectDates = (gN = "", cback) => {
			const attrList = {},
				$funcs = [
					$getRepAttrs( {
						project: PROJDATEREFS
					}, gN),

					(attrs, ids, cbk) => {
						// log(`>>>> REP ATTRS: ${JSON.stringify(attrs)}`)
						getAttrs( [...attrs, "date_today"], ATTRS => {
							// log(`>>>> GETATTRS: ${JSON.stringify(ATTRS)}`)
							_.each(ids, rowID => {
								const p = v => `repeating_${gN}project_${rowID}_${v}`,
									pV = v => ATTRS[p(v)],
									pI = v => parseInt(pV(v)) || 0,
									currentPos = pI("projectinccounter")
								log(`DoProjDates: pV() = ${pV("date_today")}`)
								let counterPos = 11
								// log(`   >>>> LRT: ${JSON.stringify(pI("projectlaunchroll_toggle"))}`)
								if (pI("projectlaunchroll_toggle") === 2 && !pV("projectlaunchresults").includes("TOTAL")) {
									counterPos = Math.max(Math.min(
										10 - Math.floor(
											10 * getProgress(
												formatDString(new Date(parseInt(ATTRS.date_today))), pV("projectstartdate"), pV("projectenddate")
											)
										), 10
									), 0)
								}
								if (counterPos !== currentPos)
									attrList[p("projectinccounter")] = counterPos
							} )
							// log(`   >>>> ATTRLIST: ${JSON.stringify(attrList)}`)
							cbk(null, attrList)
						} )
					},

					$set
				]
			run$($funcs, cback ? () => cback(null) : undefined)
		},
		$checkLaunch = source => {
			const rowData = source.split("_")
			rowData.shift()
			const sec = rowData.shift(),
				rowID = rowData.shift(),
				stat = rowData.join("_")

			/* log(`CHECK LAUNCH REP VALS: ${JSON.stringify(sec)}; ${
			   JSON.stringify(rowID)}; ${JSON.stringify(source)}`, "LAUNCHTOGGLE") */

			return cback => {
				if (stat.includes("projectstake") || ["projecttotalstake", "projectrushstakelost", "projectwasrushed"].includes(stat)) {
					cback(null)
				} else {
					const p = v => `repeating_${sec}_${rowID}_${v}`,
						attrs = _.map( [
							"projectlaunchtrait1_name",
							"projectlaunchmod",
							"projectlaunchtrait1",
							"projectlaunchtrait2_name",
							"projectlaunchtrait2",
							"projectscope",
							"projectlaunchresults",
							"projectlaunchdiff",
							"projectlaunchdiffmod"
						], v => p(v)),
						$funcs = [
							cbk => {
								getAttrs(attrs, ATTRS => {
									const pV = v => ATTRS[p(v)],
										pI = v => parseInt(ATTRS[p(v)] ) || 0,
										attrList = {},
										scope = pI("projectscope"),
										launchDiffMod = pI("projectlaunchdiffmod"),
										launchDiff = pI("projectlaunchdiff"),
										traits = _.map( ["projectlaunchtrait1", "projectlaunchtrait2"],
											v => ( {
												name: pV(`${v}_name`),
												value: pI(v)
											} )),
										results = pV("projectlaunchresults"),
										launchTrtCheck = []
									let traitString = ""
									if (results.includes("SUCCESS") || results.includes("CRITICAL") || results.includes("TOTAL")) {
										attrList[p("projectlaunchroll_toggle")] = 2
									} else {
										_.each(traits, trt => trt.value ?
											launchTrtCheck.push(trt.name === "" ? -1 : 1) :
											launchTrtCheck.push(trt.name === "" ? 0 : -1))
										attrList[p("projectlaunchdiff")] = scope + 2 + launchDiffMod
										if (launchTrtCheck.includes(-1) || !launchTrtCheck.includes(1)) {
											attrList[p("projectlaunchroll_toggle")] = 0
										} else {
											attrList[p("projectlaunchroll_toggle")] = 1
											if (traits[0].name !== "" && traits[0].value > 0 ||
												traits[1].name !== "" && traits[1].value > 0) {
												traitString = [_.values(traits[0] ).join(":"), _.values(traits[1] ).join(":")].join(",")

												attrList[p("projectlaunchrollparams")] = `@{character_name}|${traitString}|${launchDiff}|${pI("projectlaunchmod")}|${launchDiffMod}|${rowID}`
											}
										}
									}
									cbk(null, attrList)
								} )
							},
							$set
						]

					run$($funcs, () => cback(null))
				}
			}
		},
		doProjects = (source, gN = "") => {
			log(`DOPROJECTS: SOURCE = ${JSON.stringify(source)}`)
			const row = source
					.split("_")
					.slice(0, 3)
					.join("_"),
				stat = source
					.split("_")
					.slice(3)
					.join("_")
			// log(`DOPROJECTS: ROW = ${JSON.stringify(row)}, STAT = ${JSON.stringify(stat)}`)
			const p = v => `${row}_${v}`,
				$funcs = [],
				attrs = [],
				attrList = {}

			// Updating project end date when date values are changed.
			if ( ["projectstartdate", "projectincnum", "projectincunit"].includes(stat)) {
				attrs.push(..._.map( ["projectstartdate", "projectincnum", "projectincunit"], v => p(v)), "date_today")
				$funcs.push(...[
					cback => {
						getAttrs(attrs, ATTRS => {
							const pV = v => ATTRS[p(v)],
								pI = v => parseInt(pV(v)) || 0,
								cDate = new Date(parseDString(ATTRS.date_today)),
								inc = pI("projectincnum"),
								iUnit = pV("projectincunit")
							let sDate = null

							/* log(`CDATE: ${JSON.stringify(cDate)}`)
								   log(`ATTRS: ${JSON.stringify(ATTRS)}`) */
							if (pV("projectstartdate")) {
								sDate = new Date(parseDString(pV("projectstartdate")))
							} else {
								sDate = new Date(cDate)
								// log(`SDATE: ${JSON.stringify(sDate)}`)
								attrList[p("projectstartdate")] = formatDString(sDate)
							}

							if (!cDate || inc === 0 || !["hours", "days", "weeks", "months", "years"].includes(iUnit)) {
								attrList[p("projectenddate")] = ""
								attrList[p("projectinccounter")] = 11
							} else {
								const eDate = new Date(sDate)
								switch (iUnit) {
								case "hours":
									eDate.setUTCHours(eDate.getUTCHours() + 10 * inc)
									break
								case "days":
									eDate.setUTCDate(eDate.getUTCDate() + 10 * inc)
									break
								case "weeks":
									eDate.setUTCDate(eDate.getUTCDate() + 10 * 7 * inc)
									break
								case "months":
									eDate.setUTCMonth(eDate.getMonth() + 10 * inc)
									break
								case "years":
									eDate.setUTCFullYear(eDate.getUTCFullYear() + 10 * inc)
									break
								default:
									log(`ERROR: Invalid time unit for project incrementor: ${JSON.stringify(iUnit)}`)

									return
								}
								attrList[p("projectenddate")] = formatDString(eDate)
							}
							cback(null, attrList)
						} )
					},
					$set,
					cback => doProjectDates(gN, cback)
				] )

				// Updating launch roll difficulty display upon change to scope or difficulty
			} else if ( ["projectscope", "projectscope_name", "projectlaunchdiff", "projectlaunchdiffmod"].includes(stat)) {
				attrs.push(..._.map( ["projectscope", "projectlaunchmod", "projectlaunchdiffmod"], v => p(v)), "date_today")
				$funcs.push(...[
					cback => {
						getAttrs(attrs, ATTRS => {
							const pV = v => ATTRS[p(v)],
								pI = v => parseInt(pV(v)) || 0,
								scope = pI("projectscope")
							attrList[p("projectlaunchdiff")] = scope + 2 + pI("projectlaunchdiffmod")
							cback(null, attrList)
						} )
					},
					$set,
					$checkLaunch(source, gN)
				] )

				// Updating launch roll when launch traits are changed.
			} else if ( ["projectlaunchtrait1_name", "projectlaunchtrait1", "projectlaunchtrait2_name", "projectlaunchtrait2", "projectlaunchmod"].includes(stat)) {
				$funcs.push($checkLaunch(source, gN))

				//
			} else if (stat.includes("projectstake") || ["projectlaunchresults", "projecttotalstake", "projectrushstakelost", "projectwasrushed"].includes(stat)) {
				attrs.push(..._.map( [..._.map( [1, 2, 3, 4, 5, 6], v => `projectstake${v}`), "projectlaunchresults", "projecttotalstake", "projectwasrushed", "projectrushstakelost"], v => p(v)))
				$funcs.push(...[
					cback => {
						getAttrs(attrs, ATTRS => {
							const pV = v => ATTRS[p(v)],
								pI = v => parseInt(pV(v)) || 0
							if (pV("projectlaunchresults").includes("SUCCESS")) {
								attrList[p("projectstakes_toggle")] = 1
								const stakeRemaining = Math.max(0, pI("projecttotalstake")) - _.reduce(_.map( [1, 2, 3, 4, 5, 6], v => pI(`projectstake${v}`)), (memo, num) => parseInt(memo) + parseInt(num))
								log(`STAKE REMAINING: ${JSON.stringify(stakeRemaining)}`)
								if (stakeRemaining > 0)
									attrList[p("projectlaunchresultsmargin")] = `Stake ${pV("projecttotalstake")} Dot${pI("projecttotalstake") > 1 ? "s" : ""} (${stakeRemaining} to go)`
								else
									attrList[p("projectlaunchresultsmargin")] = `${pV("projecttotalstake")} Dot${pI("projecttotalstake") > 1 ? "s" : ""} Staked`
							}
							cback(null, attrList)
						} )
					},
					$set,
					$checkLaunch(source, gN)
				] )
			} else if ( ["projectwasrushed"].includes(stat)) {
				attrs.push(_.map( [..._.map( [1, 2, 3, 4, 5, 6], v => `projectstake${v}`), "projectwasrushed", "projectrushstakelost"], v => p(v)))
				$funcs.push(...[
					cback => {
						getAttrs(attrs, ATTRS => {
							/* If the rush was a failure, wipe all of the projectstake values AFTER
								summing and recording them in projectstakesatrush, and track which
								stakes the player is losing by them filling in the same boxes again. */
							attrList.push(ATTRS[attrs[0]] )
							cback(null, attrList)
						} )
					},
					$set
				] )
			} else {
				log(`DOPROJECTS ERROR: Unrecognized stat: ${stat}`)
			}
			run$($funcs)
		}

	on("change:date_today", eInfo => {
		[LOGPREFIX, LOGDEPTH] = [`[dProjDATES(${trimAttr(eInfo.sourceAttribute)})]`, 0]
		doProjectDates()
	} )
	on(getTriggers(null, "", "", _.keys(PROJREPREFS)), eInfo => {
		log(`DOPROJECTS --> EINFO: ${JSON.stringify(eInfo)}`)
		if (eInfo.sourceType !== "sheetworker" && !isBlacklisted(eInfo.sourceAttribute))
			doProjects(eInfo.sourceAttribute)

		/* try {
			log(`DOPROJECTS --> EINFO: ${JSON.stringify(eInfo)}`)
		} catch (errObj) {
			log(`... ERROR IN DOPROJECTS WITH EINFO = ${JSON.stringify(eInfo)}
			<br/>${errObj.name}<br>${errObj.message}<br><br>${errObj.stack}`)
		} */
	} )
	// #endregion

	// #region UPDATE: Experience
	const doXP = (gN = "") => {
		const $funcs = [
			$getRepAttrs( {
				earnedxp: ["xp_award"],
				earnedxpright: ["xp_award"]
			}, gN),
			(attrs, ids, cback) => {
				const attrList = {}
				getAttrs(attrs, ATTRS => {
					attrList.xp_earnedtotal = _.reduce(
						_.values(ATTRS), (total, next) => parseInt(total) + parseInt(next) || 0
					)
					cback(null, attrList)
				} )
			},
			$set,
			$getRepAttrs( {
				spentxp: XPREPREFS.spentxp
			}, gN),
			(attrs, ids, cback) => {
				const attrList = {}
				getAttrs( [...attrs, "xp_earnedtotal"], ATTRS => {
					let spentTotal = 0
					ATTRS.xp_earnedtotal = ATTRS.xp_earnedtotal || 0
					_.each(ids, rowID => {
						const p = v => `repeating_spentxp_${rowID}_${v}`,
							pV = v => ATTRS[p(v)],
							pI = v => parseInt(pV(v)) || 0,
							cat = pV("xp_category"),
							colRef = XPPARAMS[cat] ? XPPARAMS[cat].colToggles : null
						if (colRef) {
							if (
								(!colRef.includes("xp_trait_toggle") || pV("xp_trait") !== "") &&
								(!colRef.includes("xp_initial_toggle") || pV("xp_initial") !== "") &&
								(!colRef.includes("xp_new_toggle") || pV("xp_new") !== "")
							) {
								if (colRef.includes("xp_new_toggle")) {
									let delta = 0
									if (colRef.includes("xp_initial_toggle")) {
										if (cat === "Advantage") {
											delta = (pI("xp_new") - pI("xp_initial")) * XPPARAMS[cat].cost
										} else {
											for (let i = pI("xp_initial"); i < pI("xp_new"); i++)
												delta += (i + 1) * XPPARAMS[cat].cost
										}
									} else {
										delta = pI("xp_new") * XPPARAMS[cat].cost
									}
									attrList[p("xp_cost")] = Math.max(0, delta)
								} else {
									attrList[p("xp_cost")] = Math.max(0, XPPARAMS[cat].cost)
								}
								if (pV("xp_spent_toggle") === "on" && attrList[p("xp_cost")] > 0)
									spentTotal += attrList[p("xp_cost")] || 0
								if (attrList[p("xp_cost")] === 0)
									attrList[p("xp_cost")] = ""
							}
						}
						_.each( ["xp_trait_toggle", "xp_initial_toggle", "xp_new_toggle"],
							v => {
								if (colRef && colRef.includes(v) && pI(v) === 0)
									attrList[p(v)] = 1
								else if (colRef && !colRef.includes(v) && pI(v) === 1)
									attrList[p(v)] = 0
							} )
						attrList[p("xp_arrow_toggle")] = Number(colRef && colRef.includes("xp_initial_toggle") && colRef.includes("xp_new_toggle"))
					} )
					attrList.xp_summary = `${ATTRS.xp_earnedtotal} XP Earned${spentTotal > 0 ? ` - ${spentTotal} XP Spent =  ${parseInt(ATTRS.xp_earnedtotal) - spentTotal} XP Remaining` : ""}`
					cback(null, attrList)
				} )
			},
			$set
		]
		run$($funcs)
	}
	on(getTriggers(null, "", "", _.keys(XPREPREFS)), eInfo => {
		[LOGPREFIX, LOGDEPTH] = [`[dXP(${trimAttr(eInfo.sourceAttribute)})]`, 0]
		doXP()
	} )
	// #endregion

	// #region UPDATE: Dice Roller
	const doRollRepRefs = (gN = "") => {
			const attrList = {},
				$funcs = [
					$getRepAttrs(Object.assign(DISCREPREFS, ADVREPREFS), gN),
					(attrs, ids, cBack) => {
						getAttrs( ["repstats"], ATTRS => {
							if (!_.isEqual(
								_.compact(ATTRS.repstats.split(",")),
								_.reject(attrs, v => v.includes("_details"))
							))
								attrList.repstats = _.reject(attrs, v => v.includes("_details")).join(",")
							cBack(null, attrList)
						} )
					},
					$set
				]
			run$($funcs)
		},
		$getRollAttrs = (gN = "") => cBack => {
			const repAttrs = [],
				$funcs = [
					cBack2 => {
						getAttrs( ["repstats"], ATTRS => {
							cBack2(null, ATTRS.repstats)
						} )
					},
					(repstats = [], cBack2) => {
						run$( [
							$getRepAttrs(repstats, gN),
							(attrs, ids, cBack3) => {
								repAttrs.push(..._.reject(attrs, v => v.includes("_details")))
								cBack3(null)
							}
						], () => {
							cBack2(null)
						} )
					}
				]
			run$($funcs, () => cBack(null, [...ALLATTRS, ...repAttrs] ))
		},
		doRolls = (targetAttr, opts = {}, gN = "") => {
			const attrList = {},
				$funcs = [
					$getRollAttrs(gN),
					(attrs, cBack) => {
						getAttrs(attrs, ATTRS => {
							log(`FULL ATTRS:
							
							${JSON.stringify(ATTRS)}`, true)
							const [rArray, prevRArray, clearAttrs] = [
									[],
									[],
									{}
								],
								stat = isIn(targetAttr, ROLLFLAGS.all) || trimAttr(isIn(targetAttr, ATTRS)),
								checkType = attr => {
									// Returns type of stat sent in as parameter.
									const name = realName(attr, ATTRS)
									if (isIn(name, _.values(ATTRIBUTES)))
										return "attribute"
									else if (isIn(name, _.values(SKILLS)))
										return "skill"
									else if (isIn("advantage", attr))
										return "advantage"
									else if (isIn(name, DISCIPLINES))
										return "discipline"
									else if (isIn(name, TRACKERS))
										return "tracker"

									log(`CkType(${JSON.stringify(attr)}): Can't Determine Type`)

									return false
								},
								checkFlag = attr => {
									const flagName = isIn(`${trimAttr(attr)}_flag`, ATTRS)
									if (flagName && parseInt(ATTRS[flagName] ) === 1)
										return parseInt(ATTRS[flagName] )

									return false
								},
								validateFlags = flagArray => {
									// Flags must be submitted in an ordered stack, with the oldest flag at the top.
									const checkAction = (oldFlag, newFlag) => {
										if (checkType(newFlag) && checkType(oldFlag))
											return FLAGACTIONS[checkType(newFlag)][checkType(oldFlag)]

										return false
									}
									switch (flagArray.length) {
									case 2:
										switch (checkAction(...flagArray)) {
										case "replace":
										case "pass":
											flagArray.shift()
											break
										default:
											break
										}
										break
									case 3:
										switch (checkAction(...flagArray.slice(1))) {
										case "append":
											flagArray.shift()
											break
										case "replace":
											flagArray.splice(1, 1)
											break
										case "pass":
											flagArray.splice(1, 1)
											switch (checkAction(...flagArray)) {
											case "replace":
											case "pass":
												flagArray.shift()
												break
											default:
												break
											}
											break
										default:
											break
										}
										break
									default:
										break
									}
								}
							prevRArray.push(..._.compact((ATTRS.rollarray || "").split(",")))
							log(`>>> PREVRARRAY INITIAL: ${JSON.stringify(prevRArray)}`)

							// IF RESETTING, clear all selected flags and other related parameters:
							if (opts.reset) {
								/* If this function was triggered when a flag was turned on, add it to
										prevRArray so it can be turned off, too: */
								if (targetAttr.includes("_flag") && checkFlag(stat) === 1)
									prevRArray.push(stat)
								_.each(ROLLFLAGS.str,
									v => {
										[attrList[v], ATTRS[v]] = ["", ""]
									} )
								_.each( [...ROLLFLAGS.num, ..._.map(prevRArray, v => `${v}_flag`)],
									v => {
										[attrList[v], ATTRS[v]] = [0, 0]
									} )
								attrList.rollpooldisplay = "Simple Roll or Check"
								attrList.rollparams = "@{character_name}|"
							} else if (targetAttr.includes("_flag")) {
								/* If this function was triggered when a flagged trait changed, create a new rArray
										by incorporating this change.
										First, remove the selected stat from prevRArray to avoid duplicates: */
								rArray.push(..._.without(prevRArray, stat))
								//     ... then add it back if the flag was toggled ON:
								if (checkFlag(stat) === 1)
									rArray.push(stat)
								// Next, reset the various roll parameters to default:
								for (const val of ROLLFLAGS.num) {
									if (parseInt(ATTRS[val] ) !== 0)
										[ATTRS[val], attrList[val]] = [0, 0]
								}
							} else {
								// Otherwise, just copy the previously selected traits over to the new rArray
								rArray.push(...prevRArray)
							}
							log(`>>> RARRAY INITIAL: ${JSON.stringify(rArray)} (${stat} Flag Toggled)`)

							// Remove duplicates from rArray, starting with the oldest:
							for (const [, val] of [...rArray].entries()) {
								if (rArray.filter(v => val === v).length > 1)
									rArray.splice(rArray.indexOf(val), 1)
							}

							// Now, validate the rArray, determining what traits to deselect (if any) based on player selection
							validateFlags(rArray)
							log(`>>> VALIDATED RARRAY: ${JSON.stringify(rArray)}`)

							// Now, store this rArray so it can be prevRArray for the next roll:
							attrList.rollarray = rArray.join(",")
							// Now unflag any traits that WERE flagged, but aren't anymore.
							log(`>>> PRUNING UNFLAGGED STATS: (PREVARRAY: ${JSON.stringify(prevRArray)} vs. RARRAY: ${JSON.stringify(rArray)})`)
							_.each(_.without(prevRArray, ...rArray), v => {
								if (checkFlag(v) === 1)
									clearAttrs[`${v}_flag`] = 0
							} )
							log(`... CLEARING: ${_.keys(clearAttrs)}`)
							setAttrs(clearAttrs, {
								silent: true
							} )

							// Order the rArray as ATTRIBUTES, SKILLS, then OTHERS.
							rArray.sort(
								(...args) => {
									const [v1, v2] = _.map(args, v => ["attribute", "skill", "discipline", "advantage", "tracker"]
										.indexOf(checkType(v)))

									return v1 - v2
								}
							)
							log(`>>> SORTED RARRAY: ${JSON.stringify(rArray)}`)

							if (rArray.length === 0) {
								attrList.rollpooldisplay = `Simple Roll${parseInt(ATTRS.rollmod) === 0 && parseInt(ATTRS.rolldiff) === 0 ? " or Check" : ` of ${Math.abs(parseInt(ATTRS.rollmod))} Dice`}`
							} else {
								attrList.rollpooldisplay = rArray.map(v => realName(v, ATTRS)).join(" + ")
								if (parseInt(ATTRS.rollmod) !== 0)
									attrList.rollpooldisplay += ` ${parseInt(ATTRS.rollmod) < 0 ? "-" : "+"} ${Math.abs(parseInt(ATTRS.rollmod))}`
							}
							if (parseInt(ATTRS.rolldiff) !== 0)
								attrList.rollpooldisplay += ` vs. ${parseInt(ATTRS.rolldiff)}`
							log(`>>> ROLL DISPLAY: ${JSON.stringify(attrList.rollpooldisplay)}`)

							// Set roll parameter string:
							attrList.rollparams = `@{character_name}|${rArray.join(",")}`
							log(`>>> ROLL PARAMETER: ${JSON.stringify(attrList.rollparams)}`)

							cBack(null, attrList)
						} )
					},
					$set
				]
			run$($funcs, () => {
				LASTEVENT = {}
			} )
		}

	on(`sheet:opened ${getTriggers(null, "", "", [..._.keys(DISCREPREFS), ..._.keys(ADVREPREFS)] )}`, eInfo => {
		if (eInfo.sourceType !== "sheetworker" && !isBlacklisted(eInfo.sourceAttribute)) {
			[LOGPREFIX, LOGDEPTH] = [`[dRollRepRefs(${trimAttr(eInfo.sourceAttribute)})]`, 0]
			doRollRepRefs()
		}
	} )
	on(getTriggers(ALLATTRS, "", "", [..._.keys(DISCREPREFS), ..._.keys(ADVREPREFS)] ), eInfo => {
		log(`[${eInfo.sourceAttribute}, ${eInfo.sourceType}] @@@ STAT ROLLER TRIGGERED @@@`)
		if (!_.isEqual(eInfo, LASTEVENT) && eInfo.sourceType !== "sheetworker" && !isBlacklisted(eInfo.sourceAttribute)) {
			[LOGPREFIX, LOGDEPTH, LASTEVENT] = [`[dRolls(${trimAttr(eInfo.sourceAttribute)})]`, 0, _.clone(eInfo)]
			doRolls(eInfo.sourceAttribute, {
				silent: true
			} )
		}
	} )
	// #endregion

	// #region GROUP SHEET ACTIONS
	const doRoller = gN => {
		const $funcs = [
			$getRepAttrs( {
				rolls: GROUPREPREFS
			}, gN),
			(attrs, ids, cback) => {
				getAttrs( ["character_name", `${gN}charname`, `${gN}hunger`].concat(attrs), ATTRS => {
					log(`FULL LIST: ${JSON.stringify(ATTRS)}`)
					const attrList = {}
					_.each(ids, rowId => {
						const p = v => `repeating_${gN}rolls_${rowId}_${v}`,
							pV = v => ATTRS[p(v)],
							pI = v => parseInt(pV(v)) || 0
						attrList[p("grollparams")] =
							`${pV("grolltype")}|${
								ATTRS.character_name}|${
								gN}|${
								ATTRS[`${gN}charname`]}|${
								pV("gtrait1name")}:${pI("gtrait1value")},${
								pV("gtrait2name")}:${pI("gtrait2value")}|${
								pI("grolldiff")}|${
								pI("grollmod")}|${
								pV("gposflags")}|${
								pV("gnegflags")}`
						log(`... NEW ROLL PARAMS: ${JSON.stringify(attrList)}`)
					} )
					cback(null, attrList)
				} )
			},
			$set
		]
		run$($funcs)
	}

	_.each(GROUPPREFIXES, gN => {
		on(getTriggers( ["charname"], "", gN), eInfo => {
			[LOGPREFIX, LOGDEPTH] = [`[${gN}-NAME(${trimAttr(eInfo.sourceAttribute)})]`, 0]
			getAttrs( [`${gN}charname`], v => setAttrs(_.object( [
				[`${gN}name`, v[`${gN}charname`]]
			] )))
		} )

		on(getTriggers( ["clan"], "", gN), eInfo => {
			[LOGPREFIX, LOGDEPTH] = [`[${gN}-dCLANS(${trimAttr(eInfo.sourceAttribute)})]`, 0]
			doClans(gN)
		} )
		on(getTriggers(DISCENUMS, "", gN), eInfo => {
			[LOGPREFIX, LOGDEPTH] = [`[${gN}-dPOWERS(${trimAttr(eInfo.sourceAttribute)})]`, 0]
			doDiscPowers(eInfo.sourceAttribute, gN)
		} )

		on(getTriggers( ["bonus_health"], "", gN), eInfo => {
			[LOGPREFIX, LOGDEPTH] = [`[${gN}-dH.MAX(${trimAttr(eInfo.sourceAttribute)})]`, 0]
			doTrackerMax("Health", gN)
		} )
		on(getTriggers( ["bonus_willpower"], "", gN), eInfo => {
			[LOGPREFIX, LOGDEPTH] = [`[${gN}-dWP.MAX(${trimAttr(eInfo.sourceAttribute)})]`, 0]
			doTrackerMax("Willpower", gN)
		} )
		on(getTriggers( ["generation", "bonus_bp"], "", gN), eInfo => {
			[LOGPREFIX, LOGDEPTH] = [`[${gN}-dBP-MAX(${trimAttr(eInfo.sourceAttribute)})]`, 0]
			doTrackerMax("Blood Potency Full", gN)
		} )
		on(getTriggers( [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, "sdmg", "admg"], "health_", gN), eInfo => {
			[LOGPREFIX, LOGDEPTH] = [`[${gN}-dHEALTH(${trimAttr(eInfo.sourceAttribute)})]`, 0]
			doTracker("Health", eInfo.sourceAttribute, gN)
		} )
		on(getTriggers( [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "sdmg", "admg"], "willpower_", gN), eInfo => {
			[LOGPREFIX, LOGDEPTH] = [`[${gN}-dWILL(${trimAttr(eInfo.sourceAttribute)})]`, 0]
			doTracker("Willpower", eInfo.sourceAttribute, gN)
		} )
		on(getTriggers( ["bp"], "", gN), eInfo => {
			[LOGPREFIX, LOGDEPTH] = [`[${gN}-dBP(${trimAttr(eInfo.sourceAttribute)})]`, 0]
			doTracker("Blood Potency", eInfo.sourceAttribute, gN)
		} )
		on(`${getTriggers( [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "dhum", "dstains"], "humanity_", gN)} ${getTriggers( ["humanity", "stains"], "", gN)}`, eInfo => {
			[LOGPREFIX, LOGDEPTH] = [`[${gN}-dHUM(${trimAttr(eInfo.sourceAttribute)})]`, 0]
			doTracker("Humanity", eInfo.sourceAttribute, gN)
		} )

		on(getTriggers(GROUPATTRS, "", gN, _.keys(GROUPREPREFS)), eInfo => {
			[LOGPREFIX, LOGDEPTH] = [`[${gN}-dROLLER(${trimAttr(eInfo.sourceAttribute)})]`, 0]
			doRoller(gN)
		} )
	} )

	/* //Group Character #1
		on("change:g1charname", function () { getAttrs(["g1charname"], function (v) { setAttrs({ g1name: v.g1charname }); }) });
		on("change:g1clan", function () { doClans("g1"); });
		on(getTriggers(DISCIPLINEREFS, "g1"), function (eInfo) { doDiscs(eInfo.sourceAttribute); });
		on("change:g1bonus_health", function () { doTrackerMax("Health", "g1"); });
		on("change:g1bonus_willpower", function () { doTrackerMax("Willpower", "g1"); });
		on(getTriggers(["generation", "bonus_bp"], "g1"), function () { doTrackerMax("Blood Potency Full", "g1"); });
		on(getTriggers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, "sdmg", "admg"], "g1health_"), function () { doTracker("Health", "g1"); });
		on(getTriggers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "sdmg", "admg"], "g1willpower_"), function () { doTracker("Willpower", "g1"); });
		on("change:g1bp", function () { doTracker("Blood Potency", "g1"); });
		on(getTriggers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "g1humanity_") + " change:g1humanity_dhum change:g1humanity_dstains", function () {
		doTracker("Humanity", "g1");
		});
		on(getTriggers(GROUPATTRS, "", "g1", GROUPREPSECTIONS), function () { doRoller("g1"); }); */
	// #endregion

	// #region Sheetworker Actions (Above "on(changes)" ignore sheetworker.)
	on("change:hunger", () => {
		[LOGPREFIX, LOGDEPTH] = ["[!SWORKER! dRoll(Hunger)]", 0]
		log("HUNGER CHANGED!")
		doRolls("GEN")
	} )
	// #endregion
} )()