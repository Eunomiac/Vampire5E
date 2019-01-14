const Chars = (() => {
	// #region Constants and Declarations
	const MVCVALS = [
			[
				"<span style=\"display: block; width: 100%; margin-top: -10px;\">Concept</span></div><div style=\"display: block; width: 100%; margin-top: -10px;\">",
				["headerL", "A depressed", "A surly", "A straightforward", "A timid", "A clever", "A bold", "An inquisitive", "A circumspect", "An outgoing", "An optimistic", "An agreeable", "A wise", "A misguided", "A gregarious", "A jaded", "An analytical"],
				["headerR", "Cop/Detective", "Social Worker/Activist", "Doctor/Nurse/EMT", "Banker/Money Launderer", "Office Worker/Academic", "Soldier/Rebel", "Artist/Musician/Performer", "Con-Artist/Politician", "Hacker/Tech Specialist", "Stick-Up Kid/Armed Robber", "Lawyer/Fugitive", "Priest/True Believer", "Witness/Whistleblower", "Representative/Lobbyist", "Runaway/Wanderer"],
				["header", "stands accused. (Wrongfully?)", "was disgraced and cast out.", "was seriously injured (body/mind/soul).", "is a failure at life.", "is hiding from someone.", "is stepping on the wrong toes.", "is pushing the envelope.", "is a rising star.", "is respected and admired.", "is at the height of their field.", "has a secret they're ashamed of.", "is burnt out but still going.", "is famous for a thing.", "is reluctantly breaking the law."]
			],
			[
				"Pivotal Event",
				["para",
					"<span style=\"font-size: 14px; margin-top: 10px;\"><b>Before your Embrace ...</b></span><br>... you fell in love with the wrong person, who dragged you into an exciting world you never knew existed. You freaked out and left them.",
					"<span style=\"font-size: 14px; margin-top: 10px;\"><b>Before your Embrace ...</b></span><br>... your best friend accused you of a crime you know you didn't commit, but they have photos that prove otherwise.",
					"<span style=\"font-size: 14px; margin-top: 10px;\"><b>Before your Embrace ...</b></span><br>... you ended up in a literal warzone, bullets flying all around you. If it weren't for a dangerous psychopath you befriended you'd be a corpse.",
					"<span style=\"font-size: 14px; margin-top: 10px;\"><b>Before your Embrace ...</b></span><br>... your parents were deranged on some basal level and you grew up in chaos. You escaped as soon as you could.",
					"<span style=\"font-size: 14px; margin-top: 10px;\"><b>Before your Embrace ...</b></span><br>... somehow, through no fault of your own, you ended up with money and status. You don't know what happened to it all.",
					"<span style=\"font-size: 14px; margin-top: 10px;\"><b>Before your Embrace ...</b></span><br>... someone once took you out into some isolated place and showed you something that gives you weird dreams to this day.",
					"<span style=\"font-size: 14px; margin-top: 10px;\"><b>Before your Embrace ...</b></span><br>... you had a talent that showed itself at an early age. Everyone told you you would be famous for it, but here you are.",
					"<span style=\"font-size: 14px; margin-top: 10px;\"><b>Before your Embrace ...</b></span><br>... you look a job with no experience that no one thought you could do. After a few years, you quit and didn't look back. You can't say why.",
					"<span style=\"font-size: 14px; margin-top: 10px;\"><b>Before your Embrace ...</b></span><br>... someone very close to you died. No one would tell you what happened, and the people around you refused to talk about it.",
					"<span style=\"font-size: 14px; margin-top: 10px;\"><b>Before your Embrace ...</b></span><br>... Work. Sleep. Work. Sleep. Forever. One day you'd had enough, and in the middle of the day exploded in a rage. You left that life behind and never talk about it."],
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
					"<span style=\"font-size: 14px; margin-top: 10px;\"><b>You can't let go because ... </b></span><br> ... other things took priority, so it remained an open loop, still in the back of your head."]
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
					"through your <b>Confident Behavior</b>."]
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
					"you react with <b>Zeal</b> (or) <b>Boredom:</b> You're reminded of what is good in the world, or you grow impatient to find something more interesting."]
			]
		],
		HTML = {
			start: "<div style=\"display: block; width: 250px; padding: 5px 5px; color: white; font-variant: small-caps; font-family: 'Bodoni SvtyTwo ITC TT'; text-align: left; font-size: 16px;  border: 3px outset darkred; background: url('https://imgur.com/kBl8aTO.jpg') top; bg-color: black; z-index: 100; position: relative;\">",
			stop: "</div>"
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
					stop: "</div>"
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
					stop: "</div>"
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
					stop: ""
				},
				headerR: {
					start: " ",
					stop: "</div>"
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
					stop: "</div>"
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
					stop: ""
				},
				paraMid: {
					start: " ",
					stop: " "
				},
				paraEnd: {
					start: "",
					stop: "</div>"
				}
			}
		},
		SORTFUNCS = {
			earnedxp: (charRef, secName, idA, idB) => {
				const attrsA = D.GetRepAttrs(charRef, [secName, idA] ),
					  attrsB = D.GetRepAttrs(charRef, [secName, idB] ),
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
						"Twenty"
					],
					sessA = sessions.indexOf(attrsA[p("xp_session", idA)] ),
					sessB = sessions.indexOf(attrsB[p("xp_session", idB)] )
				if (sessA === sessB)
					return parseInt(attrsB[p("xp_award", idB)] ) - parseInt(attrsA[p("xp_award", idA)] )

				return sessA - sessB
			}
		},
		// #endregion

		// #region Register Characters
	 registerChars = chars => {
			_.each(chars, char => {
				state[D.GAMENAME].Chars[char.id] = {
					name: D.GetName(char),
					id: char.id,
					playerID: D.GetPlayerID(char)
				}
				state[D.GAMENAME].Chars[D.GetName(char)] = {
					name: D.GetName(char),
					id: char.id,
					playerID: D.GetPlayerID(char)
				}
				D.Alert(`Registered '${D.GetName(char)}'`)
			} )
		},
		unregisterChar = charString => {
			const stateRef = state[D.GAMENAME].Chars
			let [charName, altKey] = [null, null]
			if (stateRef[charString] ) {
				charName = stateRef[charString].name
				altKey = charString === charName ? stateRef[charString].id : charName
				delete state[D.GAMENAME].Chars[charString]
				delete state[D.GAMENAME].Chars[altKey]
				D.Alert(`Unregistered ${D.JSL(charName)}.`, "CHARS: UNREGISTERCHAR")
			} else {
				D.ThrowError(`No character found registered with search key '${D.JSL(charString)}'`)
			}
		},
		// #endregion

		// #region Awarding XP
	 awardXP = (char, award, session, reason) => {
			if (!state[D.GAMENAME].Chars[char.id] )
				return D.ThrowError("You must register the character first.", "AWARDXP")
			const rowID = D.MakeRow(char.id, "earnedxp", {
				xp_award: award,
				xp_session: session,
				xp_reason: reason
			} )
			if (rowID) {
				D.SplitRepSec(char, "earnedxp", "earnedxpright", SORTFUNCS.earnedxp, "split")

				return true
			}

			return D.ThrowError(`Unable to make row for '${D.JSL(char)}'`, "AWARDXP")
		},
		// #endregion

		// #region Manipulating Stats on Sheet
	 adjustDamage = (charObj, trt, dtype, amount) => {
			const attrList = {},
				trait = trt.slice(0, 1).toUpperCase() + trt.slice(1)
			attrList[trait.toLowerCase() + ( ["superficial", "superficial+", "spent"].includes(dtype) ? "_sdmg" : "_admg")] = parseInt(amount) > 0 && dtype === "superficial" ? parseInt(Math.ceil(amount / 2)) : parseInt(amount)
			setAttrs(charObj.id, attrList)

			return true
		},
		// #endregion

		// #region Generating MVCs
	 MVC = params => {
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

		// #region Event Handlers (handleInput, handleAttribute)
	 handleAttr = (obj, prev) => {
		 if (obj.get("name") === "hunger" && obj.get("current") !== prev.current)
				Images.Toggle(`Hunger${getAttrByName(obj.get("_characterid"), "sandboxquadrant")}_1`, true, obj.get("current"))
	 },
	 handleInput = msg => {
			if (msg.type !== "api")
				return
			const who = (getObj("player", msg.playerid) || {
					get: () => "API"
				} ).get("displayname"),
				args = msg.content.split(/\s+/u)
			let [chars, params] = [
					[],
					[]
				],
				[amount, session, trait, dtype, dmg, attrString, charData] = new Array(7).fill(null)
			switch (args.shift()) {
			case "!rChar":
				if (playerIsGM(msg.playerid) && msg.selected && msg.selected[0] )
					registerChars(D.GetChars(msg))
				else
					D.ThrowError("Select character tokens first!", "CHARS")
				break
			case "!dChar":
				charData = args.join(" ")
				if (playerIsGM(msg.playerid) && charData)
					unregisterChar(charData)
				else
					D.ThrowError("Input a valid search string to remove the character!", "CHARS")
				break

			case "!xp": // !xp Cost Session Message, with some character tokens selected.
				chars = D.GetChars(msg)
				if (playerIsGM(msg.playerid) && chars) {
					amount = args.shift()
					session = args.shift()
					_.each(chars, char => {
						if (awardXP(char, amount, session, args.join(" ")))
							D.Alert(`${amount} XP awarded to ${D.GetName(char)}`, "!XP")
						else
							D.ThrowError(`FAILED to award ${JSON.stringify(amount)} XP to ${JSON.stringify(D.GetName(char))}`, "!XP")
					} )
				} else {
					D.ThrowError("Select character tokens first!", "CHARS")
				}
				break
			case "!dmg":
				chars = D.GetChars(msg)
				if (playerIsGM(msg.playerid) && chars) {
					trait = args.shift()
					dtype = args.shift()
					dmg = parseInt(args.shift())
					_.each(chars, char => {
						if (adjustDamage(char, trait, dtype, dmg))
							D.Alert(`Dealt ${D.JS(dmg)} ${D.JS(dtype)} ${D.JS(trait)} damage to ${D.GetName(char)}`, "CHARS")
						else
							D.ThrowError(`FAILED to damage ${D.GetName(char)}`, "CHARS")
					} )
				} else {
					D.ThrowError("Select character tokens first!", "CHARS")
				}
				break
			case "!getStat":
				trait = args.shift()
				for (const char of D.GetChars("registered")) {
					// params.push(`${char.get("name")}: ${D.JS(D.GetStat(char, trait))}`)
					params.push(`${char.get("name")}: ${D.GetStat(char, trait, true) ? D.GetStat(char, trait, true).get("current") : "-"}`)
					// D.Alert(`${_.map(D.GetRepStats(char, ["advantage"] ), v => `${v.get("name")}: ${v.get("current")}`)}`)
				}
				attrString = params.join("<br>")
				D.Alert(attrString, `${D.Capitalize(trait)}:`)
				break
			case "!getIncap":
				if (playerIsGM(msg.playerid) && msg.selected && msg.selected[0] )
					D.Alert(`Incapacitation String for '${D.GetName(D.GetChar(msg))}': <br/><br/>${D.GetStat(msg, "incap").get("current")}<br/><br/>e.g. !setIncap Compulsion (Arrogance):a:-2<br/><br/>OR<br/><br/>!setIncap Compulsion (Arrogance):Strength,Dexterity,Animal Ken,Dominate:-2`, "CHARS")
				else
					D.Alert("Select a character first!", "CHARS")
				break
			case "!setIncap":
				if (playerIsGM(msg.playerid) && msg.selected && msg.selected[0] ) {
					attrString = args.join(" ")
					setAttrs(D.GetChar(msg).id, {
						incap: attrString
					} )
					D.Alert(`Incapacitation String for '${D.GetName(D.GetChar(msg))}' set to: <br/><br/>${D.JS(attrString)}`, "CHARS !setIncap")
				} else {
					D.Alert("Select a character first!", "CHARS")
				}
				break
			case "!setCompulsion":
			case "!setComp":
				if (playerIsGM(msg.playerid) && msg.selected && msg.selected[0] ) {
					params = args.join(" ").split("|")
					if (params.length === 2) {
						setAttrs(D.GetChar(msg).id, {
							compulsion_toggle: 1,
							compulsion: `${params[0].toUpperCase()} --- ${params[1]}`
						} )
						D.Alert(`Compulsion for '${D.GetName(D.GetChar(msg))}' set to: <br/><br/>${D.JS(`${params[0].toUpperCase()} --- ${params[1]}`)}`, "CHARS !setDys")
					} else {
						D.Alert("Must supply a title and a message separated by a pipe '|'", "CHARS !setComp")
					}
				} else {
					D.Alert("Select a character first!", "CHARS")
				}
				break
			case "!setDys":
			case "!setDyscrasias":

				/* Dyscrasiasdisplay toggle, dyscrasias
		   FRAGILE CONFIDENCE --- Add three dice to all rolls to intimidate or oppress others (including
			uses of Dominate), until someone successfully resists you.  After that point, subtract three
			dice from all Social rolls. */
				if (playerIsGM(msg.playerid) && msg.selected && msg.selected[0] ) {
					params = args.join(" ").split("|")
					if (params.length === 2) {
						setAttrs(D.GetChar(msg).id, {
							dyscrasias_toggle: 1,
							dyscrasias: `${params[0].toUpperCase()} --- ${params[1]}`
						} )
						D.Alert(`Dyscrasias for '${D.GetName(D.GetChar(msg))}' set to: <br/><br/>${D.JS(`${params[0].toUpperCase()} --- ${params[1]}`)}`, "CHARS !setDys")
					} else {
						D.Alert("Must supply a title and a message separated by a pipe '|'", "CHARS !setDys")
					}
				} else {
					D.Alert("Select a character first!", "CHARS")
				}
				break
			case "!clearCompulsion":
			case "!clearComp":
				if (playerIsGM(msg.playerid) && msg.selected && msg.selected[0] ) {
					setAttrs(D.GetChar(msg).id, {
						compulsion_toggle: 0
					} )
					D.Alert(`Compulsion disabled for '${D.GetName(D.GetChar(msg))}'`, "CHARS !clearComp")
				} else {
					D.Alert("Select a character first!", "CHARS")
				}
				break
			case "!clearDyscrasias":
			case "!clearDys":
				if (playerIsGM(msg.playerid) && msg.selected && msg.selected[0] ) {
					setAttrs(D.GetChar(msg).id, {
						dyscrasias_toggle: 0
					} )
					D.Alert(`Dyscrasias disabled for '${D.GetName(D.GetChar(msg))}'`, "CHARS !clearDys")
				} else {
					D.Alert("Select a character first!", "CHARS")
				}
				break
			case "!getProj":
				if (playerIsGM(msg.playerid) && msg.selected && msg.selected[0] ) {
					const attrs = _.filter(findObjs( {
						_type: "attribute",
						_characterid: D.GetChar(msg).id
					} ),
					v => v.get("name").toLowerCase()
						.includes("repeating_project_"))
					D.Alert(`Project Attributes List: ${D.JS(attrs)}`, "CHARS !getProj")
				}
				break
			case "!delProj":
				if (playerIsGM(msg.playerid) && msg.selected && msg.selected[0] ) {
					let attrs = []
					_.each( ["project_false", "_[object"], val => {
						attrs = attrs.concat(_.filter(findObjs( {
							_type: "attribute",
							_characterid: D.GetChar(msg).id
						} ),
						v => v.get("name").toLowerCase()
							.includes(val)))
					} )
					_.each(attrs, v => v.remove())
					attrs = _.filter(findObjs( {
						_type: "attribute",
						_characterid: D.GetChar(msg).id
					} ),
					v => v.get("name").toLowerCase()
						.includes("repeating_project_"))
					D.Alert(`New Attributes List: ${D.JS(attrs)}`, "CHARS !delProj")
				}
				break
			case "!setProj":
				if (playerIsGM(msg.playerid) && msg.selected && msg.selected[0] ) {
					const charObj = D.GetChar(msg),
						prop = args.shift(),
						value = args.shift()
					charObj.set(prop, value)
				}
				break
			case "!copyRepRow":
				if (playerIsGM(msg.playerid) && msg.selected && msg.selected[0] && args.length === 3)
					D.CopyToSec(msg, ...args)
				break
			case "!sortRepRow":
				if (playerIsGM(msg.playerid) && msg.selected && msg.selected[0] && args.length === 2)
					D.SortRepSec(msg, args.shift(), SORTFUNCS[args.shift()] )
				break
			case "!splitRepSecs":
				if (playerIsGM(msg.playerid) && msg.selected && msg.selected[0] && args.length >= 3)
					D.SplitRepSec(msg, args.shift(), args.shift(), SORTFUNCS[args.shift()], args[0] || null)
				break
			case "!setattr":
				if (playerIsGM(msg.playerid) && msg.selected && msg.selected[0] )
					setAttrs(D.GetChar(msg).id, {sandboxquadrant: args.shift()} )
				break
			case "!MVC":
				params = {
					name: who
				}
				MVC(params)
				break
			case "!startSession":
				break
			default:
				break
			}
		},
		// #endregion

		// #region Public Functions: regHandlers
	 regHandlers = () => {
		 on("chat:message", handleInput)
		 on("change:attribute:current", handleAttr)
		},
		checkInstall = () => {
		// Delete state[D.GAMENAME].Chars;
			state[D.GAMENAME] = state[D.GAMENAME] || {}
			state[D.GAMENAME].Chars = state[D.GAMENAME].Chars || {}
		}
	// #endregion

	return {
		RegisterEventHandlers: regHandlers,
		CheckInstall: checkInstall
	}
} )()

on("ready", () => {
	Chars.RegisterEventHandlers()
	Chars.CheckInstall()
	D.Log("Ready!", "Chars")
} )