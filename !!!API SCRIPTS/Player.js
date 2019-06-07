void MarkStart("Player")
const Player = (() => {
	// ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
	const SCRIPTNAME = "Player",
		 CHATCOMMAND = null,
			  GMONLY = false
			  
	// #region COMMON INITIALIZATION
	const STATEREF = state[D.GAMENAME][SCRIPTNAME]	// eslint-disable-line no-unused-vars
	const VAL = (varList, funcName) => D.Validate(varList, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
		   DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
		  LOG = (msg, funcName) => D.Log(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
		  THROW = (msg, funcName, errObj) => D.ThrowError(msg, funcName, SCRIPTNAME, errObj) // eslint-disable-line no-unused-vars

	const checkInstall = () => {
			state[D.GAMENAME] = state[D.GAMENAME] || {}
			state[D.GAMENAME][SCRIPTNAME] = state[D.GAMENAME][SCRIPTNAME] || {}
			initialize()
		},
		regHandlers = () => {
			on("chat:message", msg => {
				if (msg.type !== "api" ||
					(GMONLY && !playerIsGM(msg.playerid)) ||
					(CHATCOMMAND && args.shift() !== CHATCOMMAND))
					return
				const who = D.GetPlayerName(msg) || "API",
					 args = msg.content.split(/\s+/u),
					 call = args.shift()
				handleInput(msg, who, call, args)
			})
		}
	// #endregion

	// #region LOCAL INITIALIZATION
	const initialize = () => {
	}
	// #endregion	
	
	// let / const
	// *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

	// #region CONFIGURATION 
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
		}
	// #endregion
    
	// #region Generating MVCs
	const MVC = (params) => {
		const results = []
		for (const mvc of MVCVALS) {
			results.push(bHTML.div.title.start + mvc[0] + bHTML.div.title.stop)
			for (const [fType, ...mvcItems] of mvc.slice(1)) {
				try {
					results.push(bHTML.div[fType].start + _.shuffle(mvcItems)[0] + bHTML.div[fType].stop)
				} catch (errObj) {
					return D.ThrowError(`ERRORED returning '${D.JSC(fType)}' for '${D.JSC(mvcItems)}' of '${D.JSC(mvc)}'`, "CHARS.MVC", errObj)
				}
			}
		}
		D.SendToPlayer(params.name, HTML.start + results.join("") + HTML.stop, " ")

		return true
	}

	// #endregion

	// #region EVENT HANDLERS: (HANDLEINPUT)
	const handleInput = (msg, who, call, args) => {	// eslint-disable-line no-unused-vars
		let [charID, token, imgData, charData, famToken] = new Array(5)
		switch (call) {
		case "!mvc":
			MVC({name: who})
			break
		case "!sense":
			charID = Char.REGISTRY[_.findKey(Char.REGISTRY, v => v.playerID === msg.playerid)].id;
			[token] = findObjs( {
				_pageid: D.PAGEID(),
				_type: "graphic",
				_subtype: "token",
				represents: charID
			})
			imgData = Images.GetData(token)
			if (imgData.unObfSrc !== "sense") {
				Images.SetData(token, {unObfSrc: "sense"})
				if (imgData.isObf) {
					Images.ToggleToken(token, `senseObf${imgData.isDaylighter ? "DL" : ""}`)
				} else {
					Images.ToggleToken(token, `sense${imgData.isDaylighter ? "DL" : ""}`)
				}			
			} else {
				Images.SetData(token, {unObfSrc: "base"})
				if (imgData.isObf) {
					Images.ToggleToken(token, `obf${imgData.isDaylighter ? "DL" : ""}`)
				} else {
					Images.ToggleToken(token, `base${imgData.isDaylighter ? "DL" : ""}`)
				}			
			}
			break
		case "!hide":	
			charID = Char.REGISTRY[_.findKey(Char.REGISTRY, v => v.playerID === msg.playerid)].id;			
			//D.Alert(`Char ID[${D.JS(_.findKey(Char.REGISTRY, v => v.playerID === msg.playerid))}] = ${D.JS(charID)}`);
			[token] = findObjs( {
				_pageid: D.PAGEID(),
				_type: "graphic",
				_subtype: "token",
				represents: charID
			})					
			//D.Alert(`Token: ${D.JS(token)}`)
			imgData = Images.GetData(token)								
			//D.Alert(`ImgData: ${D.JS(token)}`)
			if (imgData.isObf) {
				Images.ToggleToken(token, `${imgData.unObfSrc || "base"}${imgData.isDaylighter ? "DL" : ""}`)
				Images.SetData(token, {isObf: false})
			} else {
				if (imgData.unObfSrc === "sense") {
					Images.ToggleToken(token, `senseObf${imgData.isDaylighter ? "DL" : ""}`)
					Images.SetData(token, {isObf: true})
				} else {
					Images.ToggleToken(token, `obf${imgData.isDaylighter ? "DL" : ""}`)
					Images.SetData(token, {isObf: true})
				}
			}
			break
		case "!mask":
			charID = Char.REGISTRY[_.findKey(Char.REGISTRY, v => v.playerID === msg.playerid)].id;	
			[token] = findObjs( {
				_pageid: D.PAGEID(),
				_type: "graphic",
				_subtype: "token",
				represents: charID
			})
			imgData = Images.GetData(token)
			if (imgData.isDaylighter)
				break							
				//D.Alert(`ImgData: ${D.JS(token)}`)
			if (imgData.unObfSrc === "mask") {
				Images.SetData(token, {unObfSrc: "base"})
				if (!imgData.isObf)
					Images.ToggleToken(token, "base")
			} else {
				Images.SetData(token, {unObfSrc: "mask"})
				if (!imgData.isObf)
					Images.ToggleToken(token, "mask")
			}				
			break	
		case "!famulus":
			if (Session.IsDaylighterSession())
				break
			charData = Char.REGISTRY[_.findKey(Char.REGISTRY, v => v.playerID === msg.playerid)]
			charID = charData.id;
			[token] = findObjs( {
				_pageid: D.PAGEID(),
				_type: "graphic",
				_subtype: "token",
				represents: charID
			})
			if (!charData.famulusTokenID)
				break
			famToken = Images.GetObj(charData.famulusTokenID)
			if (famToken.get("layer") !== "objects")
				Images.SetParams(famToken, {
					top: token.get("top") - 100,
					left: token.get("left") + 100
				})
			toFront(famToken)
			Images.Toggle(famToken, famToken.get("layer") !== "objects", "base")
			break
		default: break
		}
	}

	return {
		RegisterEventHandlers: regHandlers,
		CheckInstall: checkInstall
	}
} )()

on("ready", () => {
	Player.RegisterEventHandlers()
	Player.CheckInstall()
	D.Log("Ready!", "Player")
} )
void MarkStop("Player")