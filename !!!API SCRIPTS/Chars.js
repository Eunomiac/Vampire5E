void MarkStart("Chars")
const Chars = (() => {
	// #region Constants and Declarations,
	const STATEREF = state[D.GAMENAME].Chars,
		REGISTRY = STATEREF.registry,
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
		[NPCSTATS] = [
			/* eslint-disable-next-line quotes */
			`{"-LNQHXkCj5qvPpMJRgaP": { "base": {"clan": "Tremere", "faction": "Camarilla", "generation": 8, "blood_potency": 6, "humanity": 3, "stains": 0 }, "attributes": { "strength": 3, "dexterity": 2, "stamina": 3, "charisma": 3, "manipulation": 3, "composure": 4, "intelligence": 6, "wits": 4, "resolve": 4 }, "skills": { "6": "OCC", "5": "AWA INT POL INS SUB", "4": "MEL ACA INV", "3": "BRA LED ETI", "2": "PER", "1": "SCI" }, "clandiscs": { "disc1": ["Auspex", 4], "disc2": ["Dominate", 5], "disc3": ["Blood Sorcery", 5] }, "otherdiscs": { "5": "", "4": "", "3": "PRE OBF", "2": "", "1": "" } },"-LNQFgr6-qOsG0YDON5o": { "base": {"clan": "Malkavian", "faction": "Anarch", "generation": 11, "blood_potency": 3, "humanity": 6, "stains": 0 }, "attributes": { "strength": 1, "dexterity": 2, "stamina": 2, "charisma": 3, "manipulation": 4, "composure": 2, "intelligence": 4, "wits": 5, "resolve": 2 }, "skills": { "6": "", "5": "INS AWA", "4": "SUB LED INV", "3": "LAR SUR POL", "2": "PER TEC ETI", "1": "ATH BRA MEL FIN" }, "clandiscs": { "disc1": ["Auspex", 4], "disc2": ["Dominate", 3], "disc3": ["Obfuscate", 4] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "CEL", "1": "" } },"-LNQFwYKATjHDhiO_SaO": { "base": {"clan": "Malkavian", "faction": "Anarch", "generation": 12, "blood_potency": 2, "humanity": 6, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 3, "stamina": 2, "charisma": 3, "manipulation": 4, "composure": 3, "intelligence": 2, "wits": 2, "resolve": 1 }, "skills": { "6": "", "5": "PER", "4": "SUB", "3": "INS ATH", "2": "INV AWA STR", "1": "BRA STL DRV" }, "clandiscs": { "disc1": ["Auspex", 0], "disc2": ["Dominate", 4], "disc3": ["Obfuscate", 2] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LNQFyJ-TyDfOrdNSi_o": { "base": {"clan": "Brujah", "faction": "Anarch", "generation": 11, "blood_potency": 2, "humanity": 7, "stains": 0 }, "attributes": { "strength": 4, "dexterity": 3, "stamina": 3, "charisma": 2, "manipulation": 3, "composure": 2, "intelligence": 2, "wits": 1, "resolve": 2 }, "skills": { "6": "", "5": "", "4": "", "3": "SUB INS", "2": "PRF STR ATH ETI LAR ACA POL PER", "1": "AWA MEL TEC FIN SUR FIR TEC MED INV" }, "clandiscs": { "disc1": ["Celerity", 1], "disc2": ["Presence", 3], "disc3": ["Potence", 2] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LNQFw2N0ga48U9Topv6": { "base": {"clan": "Malkavian", "faction": "Anarch", "generation": 9, "blood_potency": 5, "humanity": 8, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 4, "stamina": 2, "charisma": 1, "manipulation": 2, "composure": 2, "intelligence": 5, "wits": 4, "resolve": 2 }, "skills": { "6": "", "5": "", "4": "OCC INS", "3": "STL ACA POL STR", "2": "ATH SUB FIN MED SCI", "1": "BRA LAR MEL INT LED PER SUR DRV TEC ETI" }, "clandiscs": { "disc1": ["Auspex", 4], "disc2": ["Dominate", 1], "disc3": ["Obfuscate", 3] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "FOR" } },"-LNQHYdq6TiLMFGVmmW6": { "base": {"clan": "Nosferatu", "faction": "Camarilla", "generation": 10, "blood_potency": 3, "humanity": 8, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 2, "stamina": 4, "charisma": 1, "manipulation": 1, "composure": 3, "intelligence": 3, "wits": 3, "resolve": 5 }, "skills": { "6": "", "5": "INV", "4": "AWA BRA INS", "3": "MEL STR LED", "2": "STE TEC ANK INT POL", "1": "ATH FIR SUR SUB" }, "clandiscs": { "disc1": ["Animalism", 2], "disc2": ["Obfuscate", 4], "disc3": ["Potence", 3] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LNQG0wxWA3u5Ec_eYzq": { "base": {"clan": "Nosferatu", "faction": "Anarch", "generation": 9, "blood_potency": 4, "humanity": 6, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 1, "stamina": 2, "charisma": 3, "manipulation": 4, "composure": 5, "intelligence": 2, "wits": 4, "resolve": 2 }, "skills": { "6": "", "5": "INS PER POL", "4": "ANK LED", "3": "LED ACA", "2": "STL MEL", "1": "ATH INV" }, "clandiscs": { "disc1": ["Animalism", 4], "disc2": ["Obfuscate", 3], "disc3": ["Potence", 2] }, "otherdiscs": { "5": "", "4": "", "3": "PRE", "2": "", "1": "" } },"-LWe9buk5mborjCgeb95": { "base": {"clan": "Thin-Blooded", "faction": "Anarch", "generation": 14, "blood_potency": 0, "humanity": 9, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 2, "stamina": 3, "charisma": 2, "manipulation": 1, "composure": 2, "intelligence": 4, "wits": 3, "resolve": 3 }, "skills": { "6": "", "5": "", "4": "SCI", "3": "OCC ACA TEC", "2": "INV AWA MED", "1": "PER SUB STR" }, "clandiscs": { "disc1": ["Alchemy", 3], "disc2": [], "disc3": [] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LNQG0fyUU5WgN2IYaLo": { "base": {"clan": "Brujah", "faction": "Anarch", "generation": 12, "blood_potency": 1, "humanity": 7, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 2, "stamina": 3, "charisma": 4, "manipulation": 3, "composure": 3, "intelligence": 2, "wits": 1, "resolve": 2 }, "skills": { "6": "", "5": "", "4": "", "3": "PRF PER LED", "2": "INT AWA MEL POL SUB", "1": "ACA ETI INS STR BRA FIR INV" }, "clandiscs": { "disc1": ["Celerity", 1], "disc2": ["Presence", 2], "disc3": ["Potence", 1] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LNQG0N7ZGUK1zMpm6Zx": { "base": {"clan": "Malkavian", "faction": "Anarch", "generation": 13, "blood_potency": 1, "humanity": 7, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 2, "stamina": 1, "charisma": 1, "manipulation": 4, "composure": 2, "intelligence": 4, "wits": 2, "resolve": 4 }, "skills": { "6": "", "5": "", "4": "INS", "3": "ACA OCC POL", "2": "FIN MED INV", "1": "STR SUB PER" }, "clandiscs": { "disc1": ["Auspex", 1], "disc2": ["Dominate", 1], "disc3": ["Obfuscate", 0] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "SOR PRO" } },"-LNQG04sy2d4LNugi8xE": { "base": {"clan": "Toreador", "faction": "Anarch", "generation": 11, "blood_potency": 1, "humanity": 6, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 3, "stamina": 2, "charisma": 4, "manipulation": 4, "composure": 2, "intelligence": 2, "wits": 2, "resolve": 1 }, "clandiscs": { "disc1": ["Auspex", 1], "disc2": ["Celerity", 2], "disc3": ["Presence", 3] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LNQFzHYmcnDqQSytLhP": { "base": {"clan": "Brujah", "faction": "Anarch", "generation": 11, "blood_potency": 2, "humanity": 6, "stains": 0 }, "attributes": { "strength": 4, "dexterity": 3, "stamina": 3, "charisma": 2, "manipulation": 1, "composure": 2, "intelligence": 3, "wits": 2, "resolve": 2 }, "clandiscs": { "disc1": ["Celerity", 2], "disc2": ["Presence", 1], "disc3": ["Potence", 3] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LNQG-Q_Zvl0YZlCIzcQ": { "base": {"clan": "Gangrel", "faction": "Anarch", "generation": 11, "blood_potency": 2, "humanity": 5, "stains": 0 }, "attributes": { "strength": 3, "dexterity": 3, "stamina": 4, "charisma": 1, "manipulation": 2, "composure": 2, "intelligence": 2, "wits": 2, "resolve": 3 }, "clandiscs": { "disc1": ["Animalism", 1], "disc2": ["Fortitude", 0], "disc3": ["Protean", 0] }, "otherdiscs": { "5": "", "4": "", "3": "PRO", "2": "", "1": "" } },"-LNQG-8UJao43g8Hd2Fl": { "base": {"clan": "Gangrel", "faction": "Anarch", "generation": 11, "blood_potency": 3, "humanity": 5, "stains": 0 }, "attributes": { "strength": 3, "dexterity": 5, "stamina": 2, "charisma": 2, "manipulation": 1, "composure": 2, "intelligence": 2, "wits": 2, "resolve": 3 }, "clandiscs": { "disc1": ["Animalism", 2], "disc2": ["Fortitude", 0], "disc3": ["Protean", 0] }, "otherdiscs": { "5": "", "4": "PRO", "3": "", "2": "", "1": "" } },"-LNQFzrFI1aP3xdVYFVY": { "base": {"clan": "Gangrel", "faction": "Anarch", "generation": 11, "blood_potency": 2, "humanity": 6, "stains": 0 }, "attributes": { "strength": 3, "dexterity": 4, "stamina": 3, "charisma": 2, "manipulation": 3, "composure": 2, "intelligence": 2, "wits": 1, "resolve": 2 }, "clandiscs": { "disc1": ["Animalism", 2], "disc2": ["Fortitude", 1], "disc3": ["Protean", 0] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "PRO" } },"-LNQFz_V0ms41yrxwJ1x": { "base": {"clan": "Malkavian", "faction": "Anarch", "generation": 6, "blood_potency": 4, "humanity": 7, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 3, "stamina": 3, "charisma": 4, "manipulation": 6, "composure": 5, "intelligence": 3, "wits": 3, "resolve": 5 }, "skills": { "6": "SUB", "5": "", "4": "", "3": "", "2": "", "1": "" }, "clandiscs": { "disc1": ["Auspex", 4], "disc2": ["Dominate", 5], "disc3": ["Obfuscate", 5] }, "otherdiscs": { "5": "", "4": "PRO", "3": "FOR", "2": "CEL", "1": "ANI" } },"-LNQFtzeAa6FUgB4pO1R": { "base": {"clan": "Brujah", "faction": "Anarch", "generation": 11, "blood_potency": 2, "humanity": 5, "stains": 0 }, "attributes": { "strength": 3, "dexterity": 2, "stamina": 2, "charisma": 4, "manipulation": 2, "composure": 4, "intelligence": 2, "wits": 1, "resolve": 2 }, "clandiscs": { "disc1": ["Celerity", 2], "disc2": ["Presence", 2], "disc3": ["Potence", 4] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LNQFtYW-m47AqMuMI4X": { "base": {"clan": "Malkavian", "faction": "Anarch", "generation": 13, "blood_potency": 1, "humanity": 5, "stains": 0 }, "attributes": { "strength": 3, "dexterity": 3, "stamina": 2, "charisma": 1, "manipulation": 2, "composure": 2, "intelligence": 4, "wits": 3, "resolve": 2 }, "clandiscs": { "disc1": ["Auspex", 1], "disc2": ["Dominate", 0], "disc3": ["Obfuscate", 2] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "ANI", "1": "POT" } },"-LNQFt37ROBDaLQ3aZuT": { "base": {"clan": "Nosferatu", "faction": "Anarch", "generation": 13, "blood_potency": 1, "humanity": 3, "stains": 0 }, "attributes": { "strength": 4, "dexterity": 3, "stamina": 3, "charisma": 1, "manipulation": 2, "composure": 2, "intelligence": 3, "wits": 2, "resolve": 2 }, "clandiscs": { "disc1": ["Animalism", 1], "disc2": ["Obfuscate", 1], "disc3": ["Potence", 1] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "PRO" } },"-LNQFxShAsElf1Qy5xv_": { "base": {"clan": "Gangrel", "faction": "Anarch", "generation": 13, "blood_potency": 2, "humanity": 6, "stains": 0 }, "attributes": { "strength": 4, "dexterity": 3, "stamina": 3, "charisma": 2, "manipulation": 1, "composure": 2, "intelligence": 2, "wits": 2, "resolve": 3 }, "clandiscs": { "disc1": ["Animalism", 0], "disc2": ["Fortitude", 2], "disc3": ["Protean", 0] }, "otherdiscs": { "5": "", "4": "PRO", "3": "", "2": "POT", "1": "" } },"-LNQFxo7w4eJYFQYNeZd": { "base": {"clan": "Gangrel", "faction": "Anarch", "generation": 13, "blood_potency": 1, "humanity": 6, "stains": 0 }, "attributes": { "strength": 3, "dexterity": 4, "stamina": 3, "charisma": 2, "manipulation": 1, "composure": 2, "intelligence": 2, "wits": 2, "resolve": 3 }, "clandiscs": { "disc1": ["Animalism", 0], "disc2": ["Fortitude", 3], "disc3": ["Protean", 0] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "PRO" } },"-LWeAmvEEK2_kLoCN2w_": { "base": {"clan": "Thin-Blooded", "faction": "Anarch", "generation": 14, "blood_potency": 0, "humanity": 6, "stains": 0 }, "attributes": { "strength": 4, "dexterity": 3, "stamina": 3, "charisma": 2, "manipulation": 3, "composure": 2, "intelligence": 1, "wits": 2, "resolve": 2 }, "clandiscs": { "disc1": ["Alchemy", 1], "disc2": [], "disc3": [] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LWeAY-ePMjLtV6xSs6h": { "base": {"clan": "Thin-Blooded", "faction": "Anarch", "generation": 14, "blood_potency": 0, "humanity": 7, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 2, "stamina": 3, "charisma": 3, "manipulation": 3, "composure": 2, "intelligence": 2, "wits": 4, "resolve": 1 }, "clandiscs": { "disc1": ["Alchemy", 1], "disc2": [], "disc3": [] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LTJM_n4VcZzmFKjWG74": { "base": {"clan": "Ministry", "faction": "Anarch", "generation": 9, "blood_potency": 5, "humanity": 6, "stains": 0 }, "attributes": { "strength": 1, "dexterity": 3, "stamina": 2, "charisma": 5, "manipulation": 3, "composure": 4, "intelligence": 2, "wits": 4, "resolve": 2 }, "clandiscs": { "disc1": ["Obfuscate", 2], "disc2": ["Presence", 4], "disc3": ["Protean", 0] }, "otherdiscs": { "5": "AUS", "4": "", "3": "PRO", "2": "", "1": "CEL" } },"-LTJMSdW7fIoXAFfKcET": { "base": {"clan": "Ministry", "faction": "Anarch", "generation": 10, "blood_potency": 3, "humanity": 6, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 2, "stamina": 1, "charisma": 4, "manipulation": 3, "composure": 3, "intelligence": 3, "wits": 2, "resolve": 2 }, "clandiscs": { "disc1": ["Obfuscate", 1], "disc2": ["Presence", 3], "disc3": ["Protean", 0] }, "otherdiscs": { "5": "", "4": "PRO", "3": "", "2": "", "1": "" } },"-LTJMWxeANEe12WCfXtm": { "base": {"clan": "Ministry", "faction": "Anarch", "generation": 10, "blood_potency": 3, "humanity": 4, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 2, "stamina": 1, "charisma": 4, "manipulation": 5, "composure": 3, "intelligence": 4, "wits": 2, "resolve": 2 }, "clandiscs": { "disc1": ["Obfuscate", 1], "disc2": ["Presence", 4], "disc3": ["Protean", 0] }, "otherdiscs": { "5": "", "4": "", "3": "AUS PRO", "2": "", "1": "" } },"-LTJMKmVLVu5OazFXbUo": { "base": {"clan": "Ministry", "faction": "Anarch", "generation": 10, "blood_potency": 3, "humanity": 9, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 3, "stamina": 2, "charisma": 4, "manipulation": 3, "composure": 3, "intelligence": 2, "wits": 2, "resolve": 1 }, "clandiscs": { "disc1": ["Obfuscate", 0], "disc2": ["Presence", 4], "disc3": ["Protean", 0] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "PRO", "1": "" } },"-LU7pcmKytkmcej5SH9c": { "base": {"clan": "Brujah", "faction": "Anarch", "generation": 12, "humanity": 9, "stains": 0 }, "attributes": { "strength": 3, "dexterity": 3, "stamina": 3, "charisma": 2, "manipulation": 1, "composure": 2, "intelligence": 2, "wits": 2, "resolve": 4 } },"-LNQFvl-ktzpXfhkW8ZQ": { "base": {"clan": "Brujah", "faction": "Anarch", "generation": 12, "blood_potency": 2, "humanity": 7, "stains": 0 }, "attributes": { "strength": 3, "dexterity": 3, "stamina": 4, "charisma": 2, "manipulation": 1, "composure": 2, "intelligence": 2, "wits": 2, "resolve": 3 }, "clandiscs": { "disc1": ["Celerity", 2], "disc2": ["Presence", 1], "disc3": ["Potence", 1] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LNQFv8D4hqgpkRNVb8I": { "base": {"clan": "Nosferatu", "faction": "Anarch", "generation": 12, "blood_potency": 2, "humanity": 7, "stains": 0 }, "attributes": { "strength": 3, "dexterity": 4, "stamina": 3, "charisma": 1, "manipulation": 2, "composure": 2, "intelligence": 2, "wits": 3, "resolve": 2 }, "clandiscs": { "disc1": ["Animalism", 0], "disc2": ["Obfuscate", 3], "disc3": ["Potence", 0] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "CEL" } },"-LNQFvRGMoiNF54OL3wL": { "base": {"clan": "Gangrel", "faction": "Anarch", "generation": 12, "blood_potency": 2, "humanity": 6, "stains": 0 }, "attributes": { "strength": 3, "dexterity": 3, "stamina": 4, "charisma": 2, "manipulation": 2, "composure": 2, "intelligence": 3, "wits": 1, "resolve": 2 }, "clandiscs": { "disc1": ["Animalism", 1], "disc2": ["Fortitude", 1], "disc3": ["Protean", 0] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "PRO", "1": "" } },"-LWeQPMwOtwmjU_CY-uE": { "base": {"clan": "Nosferatu", "faction": "Camarilla", "generation": 8, "blood_potency": 4, "humanity": 5, "stains": 0 }, "attributes": { "strength": 4, "dexterity": 3, "stamina": 4, "charisma": 3, "manipulation": 2, "composure": 3, "intelligence": 6, "wits": 3, "resolve": 4 }, "clandiscs": { "disc1": ["Animalism", 4], "disc2": ["Obfuscate", 5], "disc3": ["Potence", 4] }, "otherdiscs": { "5": "", "4": "", "3": "CEL", "2": "DOM", "1": "FOR AUS" } },"-LYxow0RcEaAl2B-nZBK": { "base": {"clan": "Banu Haqim", "faction": "Camarilla", "generation": 7, "blood_potency": 6, "humanity": 5, "stains": 0 }, "attributes": { "strength": 3, "dexterity": 4, "stamina": 3, "charisma": 3, "manipulation": 3, "composure": 4, "intelligence": 6, "wits": 2, "resolve": 4 }, "clandiscs": { "disc1": ["Celerity", 5], "disc2": ["Obfuscate", 5], "disc3": ["Blood Sorcery", 4] }, "otherdiscs": { "5": "", "4": "", "3": "POT FOR", "2": "", "1": "" } },"-LYxov6gTCWlZO86Jlw2": { "base": {"clan": "Banu Haqim", "faction": "Camarilla", "generation": 8, "blood_potency": 5, "humanity": 5, "stains": 0 }, "attributes": { "strength": 4, "dexterity": 5, "stamina": 2, "charisma": 3, "manipulation": 2, "composure": 2, "intelligence": 4, "wits": 2, "resolve": 1 }, "skills": { "6": "", "5": "MEL", "4": "STL ACA OCC", "3": "ATH POL INV LAR", "2": "", "1": "" }, "clandiscs": { "disc1": ["Celerity", 4], "disc2": ["Obfuscate", 3], "disc3": ["Blood Sorcery", 2] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "POT FOR" } },"-LNQHYKTacAmhlW7G87N": { "base": {"clan": "Ventrue", "faction": "Camarilla", "generation": 9, "blood_potency": 4, "humanity": 6, "stains": 0 }, "attributes": { "strength": 2, "dexterity": 2, "stamina": 2, "charisma": 5, "manipulation": 3, "composure": 4, "intelligence": 3, "wits": 1, "resolve": 4 }, "clandiscs": { "disc1": ["Dominate", 4], "disc2": ["Fortitude", 3], "disc3": ["Presence", 5] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "AUS", "1": "CEL" } },"-LPNSsmxNeokaKtssoE1": { "base": {"clan": "Tremere", "faction": "Camarilla", "generation": 9, "blood_potency": 4, "humanity": 6, "stains": 0 }, "clandiscs": { "disc1": ["Auspex", 1], "disc2": ["Dominate", 4], "disc3": ["Blood Sorcery", 2] }, "otherdiscs": { "5": "", "4": "", "3": "CEL", "2": "", "1": "POT" } },"-LWeQO4py4GrquBo2Gck": { "base": {"clan": "Nosferatu", "faction": "Camarilla", "generation": 10, "blood_potency": 3, "humanity": 5, "stains": 0 }, "clandiscs": { "disc1": ["Animalism", 3], "disc2": ["Obfuscate", 4], "disc3": ["Potence", 3] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "CEL FOR PRO" } },"-LWeQNOKb98WrdeMY_OZ": { "base": {"clan": "Nosferatu", "faction": "Camarilla", "generation": 10, "blood_potency": 3, "humanity": 5, "stains": 0 }, "clandiscs": { "disc1": ["Animalism", 2], "disc2": ["Obfuscate", 3], "disc3": ["Potence", 1] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "PRE", "1": "DOM" } },"-LV_h7g8eC2VrHbM8iXi": { "base": {"clan": "Toreador", "faction": "Camarilla", "generation": 12, "blood_potency": 1, "humanity": 6, "stains": 0 }, "clandiscs": { "disc1": ["Auspex", 2], "disc2": ["Celerity", 1], "disc3": ["Presence", 3] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LV_h7H_YjGXLpmW0aiR": { "base": {"clan": "Ventrue", "faction": "Camarilla", "generation": 11, "blood_potency": 3, "humanity": 6, "stains": 0 }, "clandiscs": { "disc1": ["Dominate", 4], "disc2": ["Fortitude", 1], "disc3": ["Presence", 3] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LWeQOc-Gvu8OuQTIwqO": { "base": {"clan": "Nosferatu", "faction": "Camarilla", "generation": 12, "blood_potency": 2 } },"-LWeCAgTYMRyw0wkup2b": { "base": {"clan": "Nosferatu", "faction": "Camarilla", "generation": 12, "blood_potency": 2 } },"-LWeCA5hHOkeh4_2JwBa": { "base": {"clan": "Nosferatu", "faction": "Camarilla", "generation": 13, "blood_potency": 1 } },"-LWeC9aDbH63n7oD8e9z": { "base": {"clan": "Nosferatu", "faction": "Camarilla", "generation": 13, "blood_potency": 1 } },"-LWeRWzQ91Fp8DxQHuxU": { "base": {"clan": "Lasombra", "faction": "Sabbat", "generation": 10, "blood_potency": 4, "humanity": 5, "stains": 0 }, "clandiscs": { "disc1": ["Dominate", 0], "disc2": ["Oblivion", 4], "disc3": ["Potence", 0] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "OBF", "1": "" } },"-LWeRVv36yuBjWcAJ8Mh": { "base": {"clan": "Nosferatu", "faction": "Sabbat", "generation": 10, "blood_potency": 4, "humanity": 3, "stains": 0 }, "clandiscs": { "disc1": ["Animalism", 0], "disc2": ["Obfuscate", 4], "disc3": ["Potence", 2] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-LWeRLFK7B44jj-N079k": { "base": {"clan": "Banu Haqim", "faction": "Autarkis", "generation": 7, "blood_potency": 6, "humanity": 4, "stains": 0 }, "attributes": { "strength": 4, "dexterity": 6, "stamina": 5, "charisma": 2, "manipulation": 3, "composure": 3, "intelligence": 5, "wits": 3, "resolve": 3 }, "clandiscs": { "disc1": ["Celerity", 4], "disc2": ["Obfuscate", 5], "disc3": ["Blood Sorcery", 5] }, "otherdiscs": { "5": "", "4": "POT", "3": "FOR", "2": "AUS", "1": "PRO" } },"-LWeRKYQh6q3a09MGYug": { "base": {"clan": "Nosferatu", "faction": "Autarkis", "generation": 7, "blood_potency": 7, "humanity": 1, "stains": 0 }, "attributes": { "strength": 6, "dexterity": 5, "stamina": 5, "charisma": 3, "manipulation": 3, "composure": 3, "intelligence": 2, "wits": 3, "resolve": 4 }, "clandiscs": { "disc1": ["Animalism", 5], "disc2": ["Obfuscate", 5], "disc3": ["Potence", 5] }, "otherdiscs": { "5": "", "4": "PRO", "3": "FOR", "2": "CEL", "1": "" } },"-LW8juZsciktrgdbmAl1": { "base": {"clan": "Tremere", "faction": "Camarilla", "generation": 13, "blood_potency": 2, "humanity": 7, "stains": 0 }, "clandiscs": { "disc1": ["Auspex", 2], "disc2": ["Dominate", 0], "disc3": ["Blood Sorcery", 4] }, "otherdiscs": { "5": "", "4": "", "3": "", "2": "", "1": "" } },"-Lbu2c0GWai65y-zjZ7k": { "base": {"clan": "Tzimisce", "faction": "Sabbat", "generation": 6, "blood_potency": 8, "humanity": 3, "stains": 0 }, "attributes": { "strength": 4, "dexterity": 4, "stamina": 3, "charisma": 6, "manipulation": 5, "composure": 5, "intelligence": 5, "wits": 4, "resolve": 3 }, "skills": { "6": "MED ACA", "5": "MEL OCC POL AWA INT SUB", "4": "ETI INV", "3": "LED PER", "2": "STL ATH", "1": "ANI" }, "clandiscs": { "disc1": ["Animalism", 3], "disc2": ["Auspex", 5], "disc3": ["Vicissitude", 5] }, "otherdiscs": { "5": "DOM", "4": "PRE SOR", "3": "CEL", "2": "FOR", "1": "" } },"-Lbu3wurxt5lHXWMIC73": { "base": {"clan": "Lasombra", "faction": "Sabbat", "generation": 7, "blood_potency": 7, "humanity": 3, "stains": 0 }, "attributes": { "strength": 5, "dexterity": 4, "stamina": 5, "charisma": 4, "manipulation": 3, "composure": 4, "intelligence": 3, "wits": 5, "resolve": 4 }, "skills": { "6": "BRA STL", "5": "SUB OCC MEL LED POL ETI", "4": "ATH PER", "3": "SEC ACA", "2": "DRV LAR", "1": "INV" }, "clandiscs": { "disc1": ["Dominate", 5], "disc2": ["Oblivion", 5], "disc3": ["Potence", 5] }, "otherdiscs": { "5": "", "4": "FOR", "3": "CEL", "2": "PTN", "1": "" } }}`
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
		// #endregion
	
		// #region Register Characters & Token Image Alternates,
		registerChar = (msg, num) => {
			if (D.GetSelected(msg).length > 1)
				return D.ThrowError("Please select only one token.", "CHARS:RegisterChar")
			const char = D.GetChar(msg),
				 token = D.GetSelected(msg)[0],
			   charNum = num ? num : _.keys(REGISTRY).length + 1,
				charID = char.id,
			  charName = D.GetName(char),
			  playerID = D.GetPlayerID(char),
		    playerName = D.GetName(playerID)

			if (!char)
				return D.ThrowError("No character found!", "CHARS:RegisterChar")
			if (!token)
				return D.ThrowError("Please select a character token.", "CHARS:RegisterChar")

			REGISTRY[charNum] = {
				id: charID,
				name: charName,
				playerID: playerID,
				playerName: playerName,
				tokenName: charName.replace(/["'\s]*/gu, "") + "Token"
			}

			D.Alert(`Character #${D.JSL(charNum)} Registered:<br><br>${D.JS(REGISTRY[charNum])}`, "CHARS:RegisterChar")
			return
		},
		registerToken = (msg, hostName, srcName) => {
			if (!Images.GetKey(hostName)) 
				return D.ThrowError(`No image registered under ${hostName}`, "CHARS:RegisterToken")
	
			Images.AddSrc(msg, hostName, srcName)
			return true
		},
	
		// #endregion
	
		// #region Awarding XP,
		awardXP = (charRef, award, session, reason) => {
			if (!D.GetChar(charRef))
				return D.ThrowError(`No character found given reference ${D.JS(charRef)}`, "CHARS:AwardXP")
			const char = D.GetChar(charRef),
				 rowID = D.MakeRow(char.id, "earnedxp", {
					xp_award: award,
					xp_session: session,
					xp_reason: reason,
				})
			if (rowID) {
				D.SplitRepSec(char, "earnedxp", "earnedxpright", SORTFUNCS.earnedxp, "split")
	
				return true
			}
	
			return D.ThrowError(`Unable to make row for '${D.JSL(char)}'`, "AWARDXP")
		},
	
		// #endregion
	
		// #region Manipulating Stats on Sheet,
		adjustTrait = (charRef, trait, amount, min, max, defaultTraitVal) => {
			if (D.Validate({number: defaultTraitVal}, "", "", true)) {
				if (!D.Validate({char: [charRef], number: amount}, "Chars", "AdjustTrait"))
					return false
			} else {
				if (!D.Validate({char: [charRef], trait: [trait], number: amount}, "Chars", "AdjustTrait"))
					return false
			}
			D.Log(D.JS(Math.min(max || Infinity, Math.max(min || -Infinity, parseInt(D.GetStatVal(charRef, trait) || 0) + parseInt(amount)))))
			D.Log("STATVAL:" + D.GetStatVal(charRef, trait) + ", AMOUNT: " + amount)			
			D.Log("COMBINED:" + (parseInt(D.GetStatVal(charRef, trait) || 0) + parseInt(amount)))
			D.Log("ACTUAL: " + (Math.min(max || Infinity, Math.max(min || -Infinity, parseInt(D.GetStatVal(charRef, trait) || defaultTraitVal || 0) + parseInt(amount)))))
			setAttrs(
				D.GetChar(charRef).id, 
				{
					[trait.toLowerCase()]: Math.min(max || Infinity, Math.max(min || -Infinity, parseInt(D.GetStatVal(charRef, trait) || defaultTraitVal || 0) + parseInt(amount)))
				}
			)
			return true
		},
		adjustDamage = (charRef, trait, dtype, amount) => {
			if (!D.Validate({char: [charRef], number: [amount]}, "Chars", "AdjustDamage"))
				return false
			if (adjustTrait(charRef,
				trait.toLowerCase() + (["superficial", "superficial+", "spent"].includes(dtype) ? "_sdmg" : "_admg"),
				parseInt(amount) > 0 && dtype === "superficial" ? parseInt(Math.ceil(amount / 2)) : parseInt(amount),
				-Infinity,
				Infinity,
				0
			))
				return true
			return false
		},
		adjustHunger = (charRef, amount, isKilling = false) => {
			if (!D.Validate({char: [charRef], number: [amount], trait: ["bp_slakekill"]}, "Chars", "AdjustHunger"))
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
		adjustHumanity = (charRef, amount) => {
			if (!D.Validate({char: [charRef], number: [amount]}, "Chars", "AdjustHumanity"))
				return false
			if (adjustTrait(charRef,
				"humanity",
				parseInt(amount),
				0,
				10,
				7
			))
				return true
			return false
		},
		adjustStains = (charRef, amount) => {
			if (!D.Validate({char: [charRef], number: [amount]}, "Chars", "AdjustStains"))
				return false
			if (adjustTrait(charRef,
				"stains",
				parseInt(amount),
				0,
				10,
				0
			))
				return true
			return false
		},
	
		// #endregion
	
		// #region Starting/Ending Sessions & Waking Up,
		startSession = () => {
			for (const char of D.GetChars("registered")) {
				const healWP = Math.max(parseInt(getAttrByName(char.id, "composure")), parseInt(getAttrByName(char.id, "resolve")))
				adjustDamage(char, "willpower", "superficial+", -1 * healWP)
			}
			TimeTracker.StartClock()
			TimeTracker.StartLights()
		},
		endSession = (sessionNum) => {
			for (const char of D.GetChars("registered")) {
				awardXP(char, 2, sessionNum, "Session XP award.")
			}
			TimeTracker.StopClock()
		},
		wakePlayers = () => {		
			for (const char of D.GetChars("registered")) {
				for (const hBox of _.map([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], v => `health_${v}`)) {
					if (getAttrByName(char.id, hBox) === "2") {
					// HEAL
						break
					}
				}
			// ROUSE CHECK FOR WAKING
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
			const p = v => v.toLowerCase().replace(/\s+?/gu, "_")
			let testVals = {
				attributes: [],
				skills: [],
				trackers: [],
				misc: []
			}
			for (const attr of _.flatten(_.values(D.ATTRIBUTES))) {
				testVals.attributes.push(p(attr))
			}
			for (const skill of _.flatten(_.values(D.SKILLS))) {
				testVals.skills.push(p(skill))
			}
			for (const tracker of D.TRACKERS) {
				testVals.trackers.push(p(tracker))
			}
			D.Alert(D.JS(testVals))
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
				attrList = {},
				npcStats = JSON.parse(NPCSTATS)
			if (charRef) {
				charIDs.push(D.GetChar(charRef).id)
			} else {
				charIDs.push(..._.keys(npcStats))
			}
			for (const charID of charIDs) {
				const charData = npcStats[charID]
				if (charData.base) {
					for (const attr of _.keys(charData.base)) {
						attrList[attr] = charData.base[attr]
					}
				}
				if (charData.attributes) {
					for (const attribute of _.keys(charData.attributes)) {
						attrList[attribute] = charData.attributes[attribute]
					}
				}
				if (charData.skills) {
					for (const skillAbv of _.keys(SKILLABBVS)) {
						attrList[SKILLABBVS[skillAbv]] = parseInt(_.findKey(charData.skills, v => v.includes(skillAbv)) || 0)
					}
				}
				if (charData.clandiscs) {
					_.each(["disc1", "disc2", "disc3"], discnum => {
						if (charData.clandiscs[discnum].length > 0) {
							attrList[`${discnum}_name`] = charData.clandiscs[discnum][0]
							attrList[discnum] = charData.clandiscs[discnum][1]
						} else {
							attrList[`${discnum}_name`] = ""
							attrList[discnum] = 0
						}						
					})					
				}
				/* if (charData.otherdiscs) {

				} */
				setAttrs(charID, attrList)
				D.Alert(`ATTRLIST FOR ${D.GetName(charID)}:<br><br>${D.JS(attrList)}`)
			}
		},
		// #endregion

		// #region Generating MVCs,
		MVC = (params) => {
			const results = []
			for (const mvc of MVCVALS) {
				results.push(bHTML.div.title.start + mvc[0] + bHTML.div.title.stop)
				for (const [fType, ...mvcItems] of mvc.slice(1)) {
					try {
						results.push(bHTML.div[fType].start + _.shuffle(mvcItems)[0] + bHTML.div[fType].stop)
					} catch (errObj) {
						return D.ThrowError(`ERRORED returning '${D.JSL(fType)}' for '${D.JSL(mvcItems)}' of '${D.JSL(mvc)}'`, "CHARS.MVC", errObj)
					}
				}
			}
			D.SendToPlayer(params.name, HTML.start + results.join("") + HTML.stop, " ")
	
			return true
		},
	
		// #endregion
	
		// #region Event Handlers (handleInput, handleAttribute),
		handleAttr = (obj, prev) => {
			if (obj.get("name") === "hunger" && obj.get("current") !== prev.current)
				Images.Toggle(`Hunger${getAttrByName(obj.get("_characterid"), "sandboxquadrant")}_1`, true, obj.get("current"))
		},
		handleInput = (msg) => {
			if (msg.type !== "api") return
			const who = (getObj("player", msg.playerid) || {get: () => "API",}).get("displayname"),
				args = msg.content.split(/\s+/u)
			let [chars, params, attrList] = [[], [], []],
				[token, imgData] = [{}, {}],
				[amount, dmg] = [0, 0],
				[session, trait, dtype, attrString, charID] = new Array(5).fill(""),
				char = null,
				msgString = ""
			switch (args.shift().toLowerCase()) {
			case "!char":
				if (!playerIsGM(msg.playerid))
					return
				switch (args.shift().toLowerCase()) {
				case "reg":
				case "register":
					if (msg.selected && msg.selected[0])
						registerChar(msg)
					else
						D.ThrowError("Select character tokens first!", "CHARS:!char register")
					break
				case "token":
				case "regtoken":
				case "rtoken":
					if (msg.selected && msg.selected.length === 1 && args.length === 2)
						registerToken(msg, args.shift(), args.shift())
					else
						D.ThrowError("Select a graphic object. Syntax: !char token <hostName> <srcName>", "CHARS:!char token")
					break
				case "xp": // !char xp Cost Session Message, with some character tokens selected.
					chars = D.GetChars(msg) || D.GetChars("registered")
					if (chars) {
						amount = parseInt(args.shift()) || 0
						session = args.shift()
						_.each(chars, (char) => {
							if (awardXP(char, amount, session, args.join(" "))) {
								D.Alert(`${amount} XP awarded to ${D.GetName(char)}`, "CHARS:!char xp")
								D.SendToPlayer(D.GetPlayerID(char), `You have been awarded ${amount} XP for:<br><br>${D.JS(args.join(" "))}`)
							} else
								D.ThrowError(`FAILED to award ${JSON.stringify(amount)} XP to ${JSON.stringify(D.GetName(char))}`, "CHARS:!char xp")
						})
					} else {
						D.ThrowError("Select character tokens or register characters first!", "CHARS:!char xp")
					}
					break
				case "dmg":
				case "damage":
				case "heal":
				case "spend":
					chars = D.GetChars(msg)
					if (chars) {
						trait = args.shift()
						dtype = args.shift()
						dmg = parseInt(args.shift()) || 0
						_.each(chars, (char) => {
							if (adjustDamage(char, trait, dtype, dmg))
								D.Alert(`Dealt ${D.JS(dmg)} ${D.JS(dtype)} ${D.JS(trait)} damage to ${D.GetName(char)}`, "CHARS:!char dmg")
							else
								D.ThrowError(`FAILED to damage ${D.GetName(char)}`, "CHARS!char dmg")
						})
					} else {
						D.ThrowError("Select character tokens first!",  "CHARS!char dmg")
					}
					break
				case "hum":
				case "humanity":
					adjustHumanity(msg, parseInt(args.shift()))
					break
				case "stain":
				case "stains":
					adjustStains(msg, parseInt(args.shift()))
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
					case "incap":
						if (msg.selected && msg.selected[0])
							D.Alert(`Incapacitation String for '${D.GetName(D.GetChar(msg))}': <br/><br/>${D.GetStat(msg, "incap").get("current")}<br/><br/>e.g. !setIncap Compulsion (Arrogance):a:-2<br/><br/>OR<br/><br/>!setIncap Compulsion (Arrogance):Strength,Dexterity,Animal Ken,Dominate:-2`, "CHARS:!get incap")
						else 
							D.Alert("Select a character first!", "CHARS:!get incap")
						break
					case "proj":
					case "project":
						if (msg.selected && msg.selected[0]) {
							const attrs = _.map(D.GetStats(msg, "repeating_project_"),
								v => {
									const splitName = v.get("name").split("_").slice(2)
									return {
										name: splitName.slice(1).join("_"),
										rowID: splitName[0],
										value: v.get("current")
									}
								}
							)
							D.Alert(`Project Attributes List: ${D.JS(attrs)}`, "CHARS !getProj")
						}
						break
					case "charids":
						chars = findObjs( {
							_type: "character"
						} )
						msgString = ""
						for (const char of chars) {
							msgString += `${D.GetName(char)}<span style="color: red; font-weight:bold;">@T</span>${char.id}<br>`
						}
						D.Alert(D.JS(msgString))
						break
					default: break
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
						if (msg.selected && msg.selected[0]) {
							char = D.GetChar(msg)
						} else {
							char = D.GetChar(args.shift())
						}
						if (char) {
							for (const statpair of args.join(" ").replace(/[,|\s]\s*?/gu, "|").split("|"))
								attrList[statpair.split(":")[0]] = parseInt(statpair.split(":")[1])||0
							setAttrs(char.id, attrList)
						}
						break
					default: break
					}
					break
				case "clear":
					if (!playerIsGM(msg.playerid))
						return
					switch (args.shift().toLowerCase()) {
					case "proj":
					case "project":
					case "projects":
						if (msg.selected && msg.selected[0]) {
							_.each(D.GetStats(msg, ["project_false", "_[object"]), v => v.remove())
							D.Alert(`New Attributes List: ${D.JS(D.GetStats(msg, "repeating_project_"))}`, "CHARS:!clear projects")
						}
						break
					default: break
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
					default: break
					}
					break	
				case "defaults":
					if (!playerIsGM(msg.playerid))
						return
					populateDefaults(D.GetChar(msg))
					break
				case "setnpcs":
					if (!playerIsGM(msg.playerid))
						return
					setNPCStats(args.shift())
					break
				case "changeattr":
					changeAttrName(args.shift(), args.shift())
					break
				default: break
				}
				break					
			case "!mvc":
				MVC({name: who})
				break
			case "!sense":
				charID = REGISTRY[_.findKey(REGISTRY, v => v.playerID === msg.playerID)].id;
				[token] = findObjs( {
					_pageid: D.PAGEID(),
					_type: "graphic",
					_subtype: "token",
					represents: charID
				})
				imgData = Images.GetData(token)
				if (imgData.curSrc === "obf")
					Images.ToggleToken(token, "senseObf", "prev")
				else if (imgData.curSrc === "senseObf")				
					Images.ToggleToken(token, "obf", "prev")
				else
					Images.ToggleToken(token, "sense", "prev")
				break
			case "!hide":
				charID = REGISTRY[_.findKey(REGISTRY, v => v.playerID === msg.playerID)].id;
				[token] = findObjs( {
					_pageid: D.PAGEID(),
					_type: "graphic",
					_subtype: "token",
					represents: charID
				})	
				imgData = Images.GetData(token)
				if (imgData.curSrc === "sense")
					Images.ToggleToken(token, "senseObf", "prev")
				else if (imgData.curSrc === "senseObf")
					Images.ToggleToken(token, "sense", "prev")
				else
					Images.ToggleToken(token, "obf", "prev")
				break
			case "!mask":
				charID = REGISTRY[_.findKey(REGISTRY, v => v.playerID === "-LMGDQqIvyL87oIfrVDX")].id;	
				//charID = REGISTRY[_.findKey(REGISTRY, v => v.playerID === msg.playerID)].id;
				[token] = findObjs( {
					_pageid: D.PAGEID(),
					_type: "graphic",
					_subtype: "token",
					represents: charID
				})	
				Images.ToggleToken(token, "mask", "prev")
				break		
			case "!settoken":
				Images.ToggleToken(D.GetSelected(msg)[0], args.shift(), args.shift() || "prev")
				break
			case "!startsession":
				if (playerIsGM(msg.playerid)) startSession()
				break
			case "!wake":
				if (playerIsGM(msg.playerid)) wakePlayers()
				break
			case "!endsession":
				if (playerIsGM(msg.playerid)) endSession() 
				break
			default: break
			}
		},
	
		// #endregion
	
		// #region Public Functions: regHandlers,
		regHandlers = () => {
			on("chat:message", handleInput)
			on("change:attribute:current", handleAttr)
		},
		checkInstall = () => {
			state[D.GAMENAME] = state[D.GAMENAME] || {}
			state[D.GAMENAME].Chars = state[D.GAMENAME].Chars || {}
			state[D.GAMENAME].Chars.registry = state[D.GAMENAME].Chars.registry || {}
		}
	// #endregion
	
	return {
		RegisterEventHandlers: regHandlers,
		CheckInstall: checkInstall,
		REGISTRY: REGISTRY,
		Damage: adjustDamage,
		AdjustTrait: adjustTrait,
		AdjustHunger: adjustHunger,
		AdjustHumanity: adjustHumanity,
		AdjustStains: adjustStains
	}
})()
	
on("ready", () => {
	Chars.RegisterEventHandlers()
	Chars.CheckInstall()
	D.Log("Ready!", "Chars")
})
void MarkStop("Chars")