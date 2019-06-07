void MarkStart("DATA")
/* DATA.js, "DATA".  Exposed as "D" in the API sandbox.
   >>> DATA is both a library of handy resources for other scripts to use, and a master configuration file for your
   game.  You can find a list of all of the available methods at the end of the script.  Configuration is a bit
   trickier, but is contained in the CONFIGURATION and DECLARATIONS #regions. */

const D = (() => {
	const GAMENAME = "VAMPIRE"
	// ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
	const SCRIPTNAME = "DATA",
		 CHATCOMMAND = "!do",
		      GMONLY = true

	// #region COMMON INITIALIZATION
	const STATEREF = state[GAMENAME][SCRIPTNAME]	// eslint-disable-line no-unused-vars
	const VAL = (varList, funcName) => D.Validate(varList, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
		   DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
		  LOG = (msg, funcName) => D.Log(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
		THROW = (msg, funcName, errObj) => D.ThrowError(msg, funcName, SCRIPTNAME, errObj) // eslint-disable-line no-unused-vars

	const checkInstall = () => {
			state[GAMENAME] = state[GAMENAME] || {}
			state[GAMENAME][SCRIPTNAME] = state[GAMENAME][SCRIPTNAME] || {}
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
		/*
		// #region EVENT HANDLERS: (HANDLEINPUT)
		const handleInput = (msg, who, call, args) => { 	// eslint-disable-line no-unused-vars
			// const 
			switch (call) {
			case "":

				break
			default: break
			}
		}
		// #endregion
		*/
	// #endregion

	// #region LOCAL INITIALIZATION
	const initialize = () => {
		STATEREF.WATCHLIST = STATEREF.WATCHLIST || []
		STATEREF.CHARWIDTH = STATEREF.CHARWIDTH || {}
		STATEREF.DEBUGLOG = STATEREF.DEBUGLOG || []
	}	
	// #endregion
	// *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

	// #region CONFIGURATION
	const HTMLFORMATS = {
		titleStart: "<div style=\"display: block; width: auto; padding: 0px 5px; margin-left: -42px; margin-top: -30px;font-family: copperplate gothic; font-variant: small-caps; font-size: 16px; background-color: #333333; color: white;border: 2px solid black; position: relative; height: 20px; line-height: 23px;\">",
		titleEnd: "</div>",
		bodyStart: "<div style=\"display: block;width: auto;padding: 5px 5px;margin-left: -42px; font-family: input, verdana, sans-serif;font-size: 10px;background-color: white;border: 2px solid black;line-height: 14px;position: relative;\">",
		bodyEnd: "</div><div style=\"display: block; width: auto; margin-left: -42px; background-color: none; position: relative; height: 25px;\"></div>"
	}
	// #endregion

	// **** DEPRECATED: STRIP FROM OTHER SCRIPTS ****

	// #region DECLARATIONS: Reference Variables
	const VALS = {
			PAGEID: () => Campaign().get("playerpageid"),
			CELLSIZE: () => 70 * getObj("page", Campaign().get("playerpageid")).get("snapping_increment")
		},
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
		TRACKERS = ["Willpower", "Health", "Humanity", "Blood Potency"],
		MISCATTRS = ["blood_potency_max"],
		BLOODPOTENCY = [
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
		RESONANCEODDS = {
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
		FX = {
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
		SESSIONNUMS = ["Zero","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen","Twenty","Twenty-One","Twenty-Two","Twenty-Three","Twenty-Four","Twenty-Five","Twenty-Six","Twenty-Seven","Twenty-Eight","Twenty-Nine","Thirty","Thirty-One","Thirty-Two",]
	// #endregion

	// #region DECLARATIONS: Dependent Variables
	const ALLSTATS = [
		..._.flatten(_.values(ATTRIBUTES)),
		..._.flatten(_.values(SKILLS)),
		...DISCIPLINES,
		...TRACKERS
	]
	// #endregion

	// #region BASE FUNCTIONALITY: Fundamental Functions & String Manipulation to Declare First
	const getGMID = () => {
			/* Finds the first player who is GM. */
			const gmObj = _.find(findObjs( { _type: "player"} ), v => playerIsGM(v.id))
			return gmObj ? gmObj.id : throwError("No GM found.", "getGMID", SCRIPTNAME)
		},
		jStr = (data, isShortForm = false) => {
			/* Parses data via JSON.stringify, and then further styles it for display in Chat, styled with
				HTML and retaining natural line breaks in the code as <br>. */
			try {
				let returnObj
				if (_.isUndefined(data))
					return "&gt;UNDEFINED&lt;"

				if (isShortForm)
					if (VAL({object: data})) {
						if (data.get("name"))
							returnObj = { name: data.get("name") }
						else if (data.id)
							returnObj = { id: data.id }
					} else if (data.name) {
						returnObj = { name: data.name }
					} else if (data.id) {
						returnObj = { id: data.id }
					} else {
						returnObj = data
					}
				else
					returnObj = data

				const replacer = (k, v) => typeof v === "string" ? v.replace(/\\/gu, "") : v

				return JSON.stringify(returnObj, replacer, 2)		// Replacer function strips all backslashes from message.
					.replace(/(\s*?)"([^"]*?)"\s*?:/gu, "$1$2:")	// Removes quotes from keys of a list or object.
					.replace(/\\n/gu, "<br/>")						// Converts line break code into '<br/>'
					.replace(/\\t/gu, "")							// Strips tab code
					.replace(/ (?= )/gu, "&nbsp;")					// Replaces any length of whitespace with one '&nbsp;'
					.replace(/\\"/gu, "\"")							// Escapes quote marks
					.replace(/(^"|"$)/gu, "")						// Removes quote marks from the beginning and end of the string
			} catch (errObj) {
				return throwError("", "jStr", SCRIPTNAME, errObj)
			}
		},
		jStrH = (data, isShortForm = false) => {
			/* Parses data as above, but removes raw line breaks instead of converting them to <br>.
				Line breaks must be specified in the code with '<br>' to be parsed as such.  */
			if (_.isUndefined(data))
				return "&gt;UNDEFINED&lt;"

			return jStr(data.replace(/<br\/>/gu, "<br>"), isShortForm)
				.replace(/<br\/>/gu, "")
				.replace(/<br>/gu, "<br/>")
		},
		jStrL = (data, isShortForm = false) => {
			/* Parses data in a way that is appropriate to the console log, removing line breaks and redundant characters. */
			if (_.isUndefined(data))
				return "<UNDEFINED>"

			return jStr(data, isShortForm)
				.replace(/<br\/>/gu, "")							// Removes all line breaks
				.replace(/(&nbsp;)+/gu, " ")						// Converts &nbsp; back to whitespace
				.replace(/\\"\\"/gu, "'")							// Converts escaped double-quotes to single-quotes
				.replace(/"/gu, "")									// Removes all remaining double-quotes
		},
		jStrC = (data, isShortForm = false) => {
			/* Parses data to show all HTML code raw, rather than parsing it for formatting.
				Can override this for specific tags by double-bracketing them (e.g. "<<b>>") */
			if (_.isUndefined(data))
				return "&lt;UNDEFINED&gt;"

			return jStr(data, isShortForm)
				.replace(/>/gu, "&gt;")
				.replace(/</gu, "&lt;")
				.replace(/&gt;&gt;/gu, ">")
				.replace(/&lt;&lt;/gu, "<")
		},
		sendToPlayer = (who, message = "", title = "") => {
		/* Whispers formatted chat message to player given: display name OR player ID. */
			const playerObj = getPlayer(who),
				html = [
					HTMLFORMATS.titleStart,
					jStr(title),
					HTMLFORMATS.titleEnd,
					HTMLFORMATS.bodyStart,
					jStr(message),
					HTMLFORMATS.bodyEnd
				].join("")
			if (who === "all" || who === "") {
				sendChat("", html)
				return true
			} else if (VAL({player: playerObj}, "sendToPlayer")) {
				sendChat("", `/w ${playerObj.get("name")} ${html}`)
				return true
			}

			return false
		},
		sendToGM = (msg, title) => sendToPlayer("Storyteller", msg, title || "[GM ALERT]"),
		ordinal = num => {
		/* Converts any number by adding its appropriate ordinal ("2nd", "3rd", etc.) */
			if (VAL({number: num}, "ordinal")) {
				const tNum = parseInt(num) - (100 * Math.floor(parseInt(num) / 100))
				if ( [11, 12, 13].includes(tNum))
					return `${num}th`

				return `${num}${["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][num % 10]}`
			}
			return "NaN"
		},
		capitalize = str => {
			if (VAL({string: str}, "capitalize"))
				return str.slice(0, 1).toUpperCase() + str.slice(1)

			return str
		},
		parseToObj = val => {
		/* Converts an array or comma-delimited string of parameters ("key:val, key:val, key:val") into an object. */
			const obj = {},
				args = []
			if (VAL({string: val}))
				args.push(...val.split(/,\s*?/ug))
			else if (VAL({array: val}))
				args.push(...val)
			else
				return throwError(`Cannot parse value '${D.JSC(val)}' to object.`, "parseToObj", SCRIPTNAME)

			for (const kvp of _.map(args, v => v.split(/\s*:\s*(?!\/)/u)))
				obj[kvp[0]] = parseInt(kvp[1] ) || kvp[1]

			return obj
		},
		kvpMap = (obj, kFunc, vFunc) => {
			const newObj = {}
			_.each(obj, (v, k) => {
				newObj[kFunc ? kFunc(k, v) : k] = vFunc ? vFunc(v, k) : v
			} )

			return newObj
		},
		isIn = (needle, haystack = ALLSTATS) => {
		/* Looks for needle in haystack using fuzzy matching, then returns value as it appears in haystack. */
			try {
				const ndl = `\\b${needle.replace(/^g[0-9]/u, "")}\\b`
				if (VAL({array: haystack})) {
					const index = _.findIndex(_.flatten(haystack),
						v => v.match(new RegExp(ndl, "iu")) !== null ||
						v.match(new RegExp(ndl.replace(/_/gu), "iu")) !== null)

					return index === -1 ? false : _.flatten(haystack)[index]
				} else if (VAL({list: haystack})) {
					const index = _.findIndex(_.keys(haystack),
						v => v.match(new RegExp(ndl, "iu")) !== null ||
							 v.match(new RegExp(ndl.replace(/_/gu), "iu"))) !== null

					return index === -1 ? false : _.keys(haystack)[index]
				}

				return haystack.search(new RegExp(needle, "iu")) > -1 && haystack
			} catch (errObj) {
				return throwError(`Error locating stat '${D.JSC(needle)}' in ${D.JSC(haystack)}'`, "isIn", SCRIPTNAME, errObj)
			}
		}
	// #endregion

	// #region DEBUGGING & ERROR MANAGEMENT
	const setWatchList = (keywords) => {
			if (keywords === "clear") {
				STATEREF.WATCHLIST = []
			} else {
				const watchwords = _.flatten([keywords])
				_.each(watchwords, v => {
					if (v.startsWith("!"))
						STATEREF.WATCHLIST = _.without(STATEREF.WATCHLIST, v.slice(1))
					else
						STATEREF.WATCHLIST = _.uniq([...STATEREF.WATCHLIST, v])
				})
			}
			sendToGM(`Currently displaying debug information tagged with:<br><br>${jStr(STATEREF.WATCHLIST.join("<br>"))}`, formatAlertTitle("setWatchList", SCRIPTNAME))
		},
		formatAlertTitle = (funcName, scriptName, prefix = "") => `[${prefix}${funcName || scriptName ? " " : ""}${scriptName ? `${scriptName.toUpperCase()}` : ""}${(scriptName && funcName) ? ": " : ""}${funcName || ""}]`,
		formatLogLine = (msg, funcName, scriptName, prefix = "", isShortForm = false) => `${formatAlertTitle(funcName, scriptName, prefix)} ${jStrL(msg, isShortForm)}`,
		sendDebugAlert = (msg, funcName, scriptName, prefix = "DB") => {
			recordDebugAlert(msg, formatAlertTitle(funcName, scriptName, prefix))
			if ((funcName && STATEREF.WATCHLIST.includes(funcName)) || (scriptName && STATEREF.WATCHLIST.includes(scriptName)) || (!funcName && !scriptName))
				sendToGM(msg, formatAlertTitle(funcName, scriptName, prefix))
			return false			
		},
		recordDebugAlert = (msg, funcName, scriptName, prefix = "DB") => {
			STATEREF.DebugLog.push(formatLogLine(msg, funcName, scriptName, prefix))
		},
		throwError = (msg, funcName, scriptName, errObj) => sendDebugAlert(`${msg}${errObj ? `${errObj.name}<br>${errObj.message}<br><br>${errObj.stack}` : ""}`, funcName, scriptName, "ERROR"),
		getDebugRecord = () => {
			sendToGM(jStr(STATEREF.DebugDump.join("<br>")), "DEBUG LOG")
			STATEREF.DebugLog.length = 0
		}
	// #endregion

	// #region VARIABLE VALIDATION
	const validate = (varList, funcName, scriptName) => {
		// NOTE: To avoid accidental recursion, DO NOT use validate to confirm a type within the getter of that type.
		//		(E.g do not use VAL{char} inside any of the getChar() functions.)
		const [errorLines, valArray] = [[], []]
		_.each(_.keys(varList), cat => {
			valArray.length = 0
			valArray.push(...(cat === "array" ? [varList[cat]] : _.flatten([varList[cat]])))
			_.each(valArray, v => {
				let errorCheck = null
				switch(cat.toLowerCase()) {
				case "char":
					if (!getChar(v))
						errorLines.push(`Invalid character reference: ${jStr(v.get && v.get("name") || v.id || v, true)}`)
					break
				case "object":
					if (!(v.get && v.id))
						errorLines.push(`Invalid object: ${jStr(v.get && v.get("name") || v.id || v, true)}`)
					break
				case "player":
					if (!getPlayer(v))
						errorLines.push(`Invalid player reference: ${jStr(v.get && v.get("name") || v.id || v)}`)
					break
				case "trait":
					if (validate({char: varList.char})) {
						errorCheck = []
						_.each(_.flatten([varList.char]), charRef => {
							if (!getAttr(charRef, v, true))
								errorCheck.push(getChar(charRef).get("name"))
						})
						if (errorCheck.length > 0)
							errorLines.push(`Invalid trait: ${jStr(v.get && v.get("name") || v.id || v)} ON ${errorCheck.length}/${varList.char.length} character references:<br>${jStr(errorCheck)}`)
					} else {
						errorLines.push(`Unable to validate trait(s) ${jStr(varList[cat])} without a character reference.`)
					}
					break
				case "number":					
					if (_.isNaN(parseInt(v)))
						errorLines.push(`Invalid number: ${jStr(v)}`)
					break
				case "string":
					if (!_.isString(v))
						errorLines.push(`Invalid string: ${jStr(v)}`)
					break
				case "function":
					if (!_.isFunction(v))
						errorLines.push("Invalid function.")
					break
				case "array":					
					if (!_.isArray(v))
						errorLines.push(`Invalid array: ${jStr(v)}`)
					break
				case "list":					
					if (!_.isObject(v) || _.isFunction(v) || _.isArray(v) || v.get && v.get("_type"))
						errorLines.push(`Invalid list object: ${jStr(v.get && v.get("name") || v.id || v)}`)
					break
				case "text":					
					if (v === null || !v.get || v.get("_type") !== "text")
						errorLines.push(`Invalid text object: ${jStr(v.get && v.get("name") || v.id || v)}`)
					break
				case "graphic":					
					if (v === null || !v.get || v.get("_type") !== "graphic")
						errorLines.push(`Invalid graphic object: ${jStr(v.get && v.get("name") || v.id || v)}`)
					break
				case "attribute":
					if (v === null || !v.get || v.get("_type") !== "attribute")	
						errorLines.push(`Invalid attribute object: ${jStr(v.get && v.get("name") || v.id || v)}`)
					break			
				case "token":
					if (v === null || !v.get || v.get("_subtype") !== "token" || v.get("represents") === "")
						errorLines.push(`Invalid token object (not a token, or doesn't represent a character): ${jStr(v.get && v.get("name") || v.id || v)}`)
					break
				case "reprow":			
					if (validate({char: varList.char})) {
						errorCheck = true
						_.each(_.flatten([varList.char]), charRef => {
							if (getAttrs(getChar(charRef), v, false, true).length > 0)
								errorCheck = false
						})
						if (errorCheck)
							errorLines.push(`Invalid repeating row reference: ${jStr(v)}`)
					} else {
						errorLines.push(`Unable to validate trait(s) ${jStr(varList[cat])} without a valid character reference.`)
					}
					break
				case "selection":
					if (!v.selected || !v.selected[0])
						errorLines.push("Invalid selection: Select objects first!")
					break
				default: break
				}
			})
		})
		if (errorLines.length > 0) {
			if (!funcName || !scriptName)
				return false
			return throwError(`[From ${jStr(scriptName).toUpperCase()}:${jStr(funcName)}]
										
										${errorLines.join("<br>")}`, "validate", SCRIPTNAME)
		}
		return true
	}
	// #endregion

	// #region GETTERS: Object, Character and Player Data
	const getSelected = (msg, typeFilter = []) => {
			/* When given a message object, will return selected objects or false.
				Can set one or more types.  In addition to standard types, can include "token" and "character"
					"token" --> Will only return selected graphic objects that represent a character.
					"character" --> Will return character objects associated with selected tokens. */
			const selObjs = new Set(),
				    types = _.flatten([typeFilter])
			if (VAL({selection: msg}, "getSelected")) {
				_.each(msg.selected, v => {
					if (types.length === 0 || types.includes(v.get("_type")))
						selObjs.add(getObj(v._type, v._id))
					else if (v._type === "graphic" && VAL({token: getObj("graphic", v._id)})) {
						if (types.includes("token"))
							selObjs.add(getObj("graphic", v.id))
						else if ((types.includes("char") || types.includes("character")) && VAL({char: getObj("graphic", v._id)}))
							selObjs.add(getObj("character", getObj("graphic", v._id).get("represents")))
					}
				})

				return selObjs.size > 0 ? [...selObjs] : throwError(`None of the selected objects are of type(s) '${jStrL(types)}'`, "getSelected", SCRIPTNAME)
			}

			return false
		},
		getName = (value, isShort) => {
			// Returns the NAME of the Graphic, Character or Player (DISPLAYNAME) given: object or ID.
			const obj = VAL({object: value}) && value ||
					    VAL({char: value}) && getChar(value) ||
					    VAL({player: value}) && getPlayer(value) ||
						VAL({string: value}) && getObj("graphic", value)
			let name = VAL({player: obj}) && obj.get("_displayname") ||
					   VAL({object: obj}, "getName") && obj.get("name")

			if (!name) return false
			if (isShort)						// SHORTENING NAME:
				if (name.includes("\""))		// If name contains quotes, remove everything except the quoted portion of the name.
					name = name.replace(/.*?["]/iu, "").replace(/["].*/iu, "")
				else							// Otherwise, remove the first word.				
					name = name.replace(/.*\s/iu, "")
			
			return name.replace(/_/gu, " ")			
		},
		getChars = (charRef, isSilent = false) => {
			/* Returns an ARRAY OF CHARACTERS given: "all", "registered", a character ID, a character Name,
				a token object, a message with selected tokens, OR an array of such parameters. */
			const charObjs = new Set()
			let searchParams = []

			try {
				if (charRef.who) {
					_.each(getSelected(charRef, "character"), charObj => { charObjs.add(charObj) })
					return charObjs.size > 0 ? charObjs : isSilent ? false : throwError("Must Select a Token!", "getChars", SCRIPTNAME)
				} else if (VAL({array: charRef})) {
					searchParams = charRef
				} else if (VAL({string: charRef}) || VAL({object: charRef}) || VAL({number: charRef})) {
					searchParams.push(charRef)
				} else {
					return isSilent ? false : throwError(`Invalid character reference: ${jStr(charRef)}`, "getChars", SCRIPTNAME)
				}
			} catch (errObj) {
				return isSilent ? false : throwError("", "getChars", SCRIPTNAME, errObj)
			}
			_.each(searchParams, v => {
				// If parameter is a digit corresponding to a REGISTERED CHARACTER:
				if (VAL({number: v}) && Char.REGISTRY[parseInt(v)]) {
					charObjs.add(getObj("character", Char.REGISTRY[parseInt(v)].id))
				// If parameter is a CHARACTER OBJECT already: */
				} else if (VAL({object: v}) && v.get("type") === "character") {
					charObjs.add(v)
				// If parameter is a CHARACTER ID:
				} else if (VAL({string: v}) && getObj("character", v)) {
					charObjs.add(getObj("character", v))
				// If parameters is a TOKEN OBJECT:
				} else if (VAL({token: v}) && getObj("character", v.get("represents"))) {
					charObjs.add(getObj("character", v.get("represents")))
				// If parameter is "all":
				} else if (v === "all") {
					_.each(findObjs( { _type: "character"} ), char => charObjs.add(char))
				// If parameter calls for REGISTERED CHARACTERS:
				} else if (v === "registered") {
					_.each(Char.REGISTRY, v => { charObjs.add(getObj("character", v.id)) })
				// If parameter is a CHARACTER NAME:
				} else if (VAL({string: v})) {
					_.each(findObjs( { _type: "character" } ), char => {
						if (char.get("name").toLowerCase().includes(v.toLowerCase()))
							charObjs.add(char)
					} )
				}
				if (charObjs.size === 0)
					return isSilent ? false : throwError(`No Characters Found for Value '${jStr(v)}' in '${jStr(charRef)}'`, "getChars", SCRIPTNAME)
			} )

			return _.reject([...charObjs], v => {v.get("name").includes("Jesse,")})		// Filtering out my test character, "Jesse, Good Lad That He Is" 
		},
		getChar = (charRef, isSilent = false) => getChars(charRef, isSilent)[0],
		getAttrs = (charRef, searchPattern, isSilent = false) => {
			const charObj = getChar(charRef, isSilent),
				   charID = charObj && charObj.id,
				charAttrs = charID && findObjs({_type: "attribute", _characterid: charID}),
				 attrObjs = new Set()
			if (!charObj || !charID || !charAttrs)
				return isSilent ? false : throwError(`Invalid character reference, or character has no attributes: ${jStr(charRef)}`, "getAttrs", SCRIPTNAME)
			if (VAL({array: searchPattern})) {
				_.each([...searchPattern], v => {
					_.each([...getAttrs(charRef, v, isSilent)], vv => { attrObjs.add(vv) })
				})				
			} else if (VAL({string: searchPattern}, "getAttrs")) {
				// First, check for an exact match.
				attrObjs.add(_.find(charAttrs, v => v.get("name").toLowerCase() === searchPattern.toLowerCase())); attrObjs.delete(undefined)
				if (attrObjs.size === 0)	// ... then a fuzzy match.
					_.each(_.filter(charAttrs, v => v.get("name").toLowerCase().includes(searchPattern.toLowerCase())), v => { attrObjs.add(v) })
				if (attrObjs.size === 0) {
				// If nothing found, check to see if searchPattern refers to the value of a repeating row's "..._name" attribute.
					const nameAttrObjs = new Set()
					// First check for an exact match.
					nameAttrObjs.add(_.find(charAttrs, v => v.get("name").includes("_name") && v.get("current").toLowerCase() === searchPattern.toLowerCase())); nameAttrObjs.delete(undefined)
					if (nameAttrObjs.size === 0)  // ... then a fuzzy match.
						_.each(_.filter(charAttrs, v => v.get("name").includes("_name") && v.get("current").toLowerCase().includes(searchPattern.toLowerCase())), v => { nameAttrObjs.add(v) })
					// Then grab the corresponding attribute(s) that carry the value:
					_.each([...nameAttrObjs], v => { attrObjs.add(_.find(charAttrs, vv => vv.get("name") === v.get("name").replace(/_name/gu, ""))); attrObjs.delete(undefined) }) 	
				}
			}
			
			return attrObjs.size > 0 ? [...attrObjs] : isSilent ? false : throwError(`No attributes matched all search patterns: ${jStr(searchPattern)}`, "getAttrs", SCRIPTNAME)
		},
		getAttr = (charRef, searchPattern, isSilent = false) => getAttrs(charRef, searchPattern, isSilent)[0],
		getAttrNameFromObj = (attrObj) => {
			if (VAL({attribute: attrObj})) {
				if (attrObj.get("name").includes("repeating_")) {
					if (getAttr(attrObj.get("_characterid"), `${attrObj.get("name")}_name`, true))
						return
				}
			}
		},  // USE THIS in other scripts when getting name, so "_name" is always taken into account?
		getAttrList = (charRef, filterArray, isSilent = false) => {
			const attrList = {}
			_.each(getAttrs(charRef, filterArray, isSilent), v => {
				attrList[v.get("name")] = v.get("current")			// WAIT SOMETHING IS WRONG HERE RE: GETTING REP ROW "_name" ATTRIBUTES & VALUES
			} )
			return attrList
		},
		getAttrVal = (charRef, trait) => {
			if (VAL({char: [charRef], trait: [trait]}, "getAttrVal"))
				return getAttrList(charRef, [trait])[trait]
		},
		getPlayerID = (value, isSilent = false) => {
			// Returns a PLAYER ID given: display name, token object, character reference, player object, msg object, or player ID.
			let playerID = null
			try {
				if (value.who)
					return getPlayerID(value.who, isSilent)
				if (VAL({player: value}))
					return value.id
				if (VAL({string: value})) {
					if (VAL({player: getObj("player", value)}))
						return getObj("player", value).id
					try {
						return findObjs( {
							_type: "player",
							_displayname: value
						} )[0].id
					} catch (errObj) {
						return isSilent ? false : throwError(`Unable to find player connected to player reference '${jStr(value)}'`, "getPlayerID", SCRIPTNAME, errObj)
					}
				}
				if (VAL({char: D.GetChar(value)})) {
					playerID = _.filter(value.get("controlledby").split(","), v => v !== "all")
					if (playerID.length > 1 && !isSilent)
						throwError(`WARNING: Finding MULTIPLE player IDs connected to character reference '${jStr(value)}':<br><br>${jStr(playerID)}`, "getPlayerID", SCRIPTNAME)
					
					return playerID[0]
				}				
				if (VAL({token: value}))
					return getPlayerID(value.get("represents")) || (isSilent ? false : throwError(`Unable to find player connected to character token '${jStr(value)}'`, "getPlayerID", SCRIPTNAME))
			} catch (errObj) {
				return isSilent ? false : throwError(`Unable to find player connected to reference '${jStr(value)}'`, "getPlayerID", SCRIPTNAME, errObj)
			}
		},
		getPlayer = (value, isSilent = false) => getObj("player", getPlayerID(value, isSilent)),
		getTextWidth = (obj, text) => {
			const font = obj.get("font_family").split(" ")[0].replace(/[^a-zA-Z]/gu, ""),
				size = obj.get("font_size"),
				chars = text.split(""),
				fontRef = state.DATA.CHARWIDTH[font],
				charRef = fontRef && fontRef[size]
			let width = 0
			if (!fontRef || !charRef) {
				logEntry(`No font reference for '${font}' at size '${size}', attempting default`, "D.GETTEXTWIDTH")

				return text.length * (parseInt(obj.get("width")) / obj.get("text").length)
			}
			_.each(chars, char => {
				if (!charRef[char] && charRef[char] !== " " && charRef[char] !== 0)
					logEntry(`... MISSING '${char}' in '${font}' at size '${size}'`)
				else
					width += parseInt(charRef[char] )
			} )

			return width
		}
		// #endregion

	// #region Repeating Section Manipulation
	const isRepRow = (charRef, rowID) => getAttrs(charRef, [rowID] ).length > 0,
		getRepRowIDs = (charRef, secName, isSilent = false) => {
			return _.uniq(
				_.map(
					_.keys(
						_.pick(
							getAttrList(charRef, ["repeating", `${secName}_`], isSilent), (v, k) => k.startsWith(`repeating_${secName}_`)
						)
					), k => k.replace(`repeating_${secName}_`, "").substr(0, 20)
				)
			)
		},
		getRepAttrObjs = (charRef, secName, isSilent = false) => _.pick(getAttrs(charRef, ["repeating", `${secName}_`], isSilent), v => v.get("name").startsWith(`repeating_${secName}`)),
		getRepAttrData = (charRef, secName, isSilent = false) => _.pick(getAttrList(charRef, ["repeating", `${secName}_`], isSilent), (v, k) => k.startsWith(`repeating_${secName}_`)),
		parseRepAttr = (attrRef) => {
			let nameParts = (VAL({attribute: attrRef}) ? attrRef.get("name") : attrRef).split("_")
			if (nameParts.length > 2) {
				return {
					section: nameParts[1],
					rowID: nameParts[2],
					stat: nameParts.slice(3).join("_")
				}
			}
		},
		makeRepRow = (charRef, secName, attrs) => {
			const attrList = {},
				IDa = 0,
				IDb = [],
				charID = D.GetChar(charRef).id,
				characters = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz",
				generateUUID = (() => () => {
					let IDc = (new Date()).getTime() + 0,
						IDf = 7
					const IDd = IDc === IDa,
						IDe = new Array(8)
					for (IDf; IDf >= 0; IDf--) {
						IDe[IDf] = characters.charAt(IDc % 64)
						IDc = Math.floor(IDc / 64)
					}
					IDc = IDe.join("")
					if (IDd) {
						for (IDf = 11; IDf >= 0 && IDb[IDf] === 63; IDf--)
							IDb[IDf] = 0
						IDb[IDf]++
					} else {
						for (IDf = 0; IDf < 12; IDf++)
							IDb[IDf] = Math.floor(64 * Math.random())
					}
					for (IDf = 0; IDf < 12; IDf++)
						IDc += characters.charAt(IDb[IDf] )

					return IDc
				} )(),
				makeRowID = () => generateUUID().replace(/_/gu, "Z"),
				rowID = makeRowID(),
				prefix = `repeating_${secName}_${rowID}_`

			_.each(attrs, (v, k) => {
				if (_.isString(prefix + k) && (prefix + k).length > 12) {
					createObj("attribute", {
						name: prefix + k,
						max: "",
						_characterid: charID
					} )
					attrList[prefix + k] = v
				} else {
					return throwError(`Failure at makeRepRow(charRef, ${D.JSC(secName)}, ${D.JSC(attrs)})<br><br>Prefix (${D.JSC(prefix)}) + K (${D.JSC(k)}) is NOT A STRING asd})`, "makeRepRow", SCRIPTNAME)
				}
			} )
			setAttrs(charID, attrList)

			return rowID
		},
		deleteRepRow = (charRef, secName, rowID) => {
			if (!D.GetChar(charRef) || !_.isString(secName) || !_.isString(rowID))
				return throwError(`Need valid charRef (${D.JSC(charRef)}), secName (${D.JSC(secName)}) and rowID (${D.JSC(rowID)}) to delete a repeating row.`, "deleteRepRow", SCRIPTNAME)
			const attrObjs = getAttrs(charRef, [secName, rowID] )
			// alertGM(`deleteRepRow(charRef, ${jStr(secName)}, ${jStr(rowID)})<br><br><b>AttrObjs:</b><br>${jStr(_.map(attrObjs, v => v.get("name")))}`, "DATA:DeleteRepRow")
			if (attrObjs.length === 0)
				return throwError(`No row "repeating_${secName}_${rowID}" to delete for ${D.GetName(charRef)}.`, "deleteRepRow", SCRIPTNAME)
			_.each(attrObjs, v => v.remove())

			return true
		},
		copyToRepSec = (charRef, sourceSec, sourceRowID, targetSec) => {
			const attrList = kvpMap(getAttrList(charRef, [sourceSec, sourceRowID] ), k => k.replace(`repeating_${sourceSec}_${sourceRowID}_`, ""))
			// alertGM(`copyToRepSec(charRef, ${jStr(sourceSec)}, ${jStr(sourceRowID)}, ${jStr(targetSec)})<br><br><b>AttrList:</b><br>${jStr(attrList)}`, "DATA:CopyToRepSec")
			makeRepRow(charRef, targetSec, attrList)
			deleteRepRow(charRef, sourceSec, sourceRowID)
		},
		sortRepSec = (charRef, secName, sortFunc) => {
			/* Sortfunc must have parameters (charRef, secName, rowID1, rowID2) and return
			POSITIVE INTEGER if row1 should be ABOVE row2. */
			// D.Log(`CharRef: ${D.JSC(charRef)}`)
			const rowIDs = getRepRowIDs(charRef, secName),
				sortTrigger = getAttrList(charRef, [`repeating_${secName}_${rowIDs[0]}_sorttrigger`] )
			// alertGM(`RepOrder: ${jStr(repOrderAttr)}<br><br>${rowIDs.length} Row IDs for ${secName}:<br><br>${jStr(rowIDs)}`, "DATA.SortRepSec")
			rowIDs.sort((idA, idB) => sortFunc(charRef, secName, idA, idB))
			// alertGM(`... SORTED?<br><br>${jStr(rowIDs)}<br><br>TEST ATTR: ${jStr(sortTrigger)}`, "DATA.SortRepSec")
			setAttrs(D.GetChar(charRef).id, {[`_reporder_repeating_${secName}`]: rowIDs.join(",")} )
			sortTrigger[`repeating_${secName}_${rowIDs[0]}_sorttrigger`] = sortTrigger[`repeating_${secName}_${rowIDs[0]}_sorttrigger`] === "false"
			// alertGM(`sortRepSec(charRef, ${jStr(secName)}, sortFunc)<br><br><b>RowIDs:</b><br>${jStr(rowIDs)}<br><br><b>sortTrigger:</b><br>${jStr(sortTrigger)}`, "DATA:SortRepSec")
			setAttrs(D.GetChar(charRef).id, sortTrigger)

			return rowIDs
		},
		splitRepSec = (charRef, sourceSec, targetSec, sortFunc, mode = "split") => {
			/* Will combine values from both source and target sections, sort them, then evenly split
			them between the two sections.  Split modes include:
				"split" (default) — the bottom half of results will be moved to targetSec
				"even" — even-numbered rows will be moved to targetSec
			Sortfunc must have parameters (charRef, secName, rowID1, rowID2) and return
			POSITIVE INTEGER if row1 should be ABOVE row2.  */
			// alertGM(`splitRepSec(charRef, ${jStr(sourceSec)}, ${jStr(targetSec)}, sortFunc, ${jStr(mode)})`, "DATA:SplitRepSec")
			
			// alertGM("@@@ STARTING _.EACH COPYTOREPSEC @@@", "DATA:SplitRepSec")
			_.each(getRepRowIDs(charRef, targetSec), id => {
				copyToRepSec(charRef, targetSec, id, sourceSec)
			} )
			const sortedIDs = sortRepSec(charRef, sourceSec, sortFunc)
			// alertGM(`@@@ FINISHED _.EACH COPYTOREPSEC @@@<br><br><b>sortedIDs:</b><br>${jStr(sortedIDs)}`, "DATA:SplitRepSec")
			switch (mode) {
			case "split":
				sortedIDs.splice(0, Math.ceil(sortedIDs.length / 2))
				// alertGM(`@@@ SPLIT: STARTING SPLIT. @@@<br><br><b>sortedIDs (NEW):</b><br>${jStr(sortedIDs)}`, "DATA:SplitRepSec")
				while (sortedIDs.length > 0)
					copyToRepSec(charRef, sourceSec, sortedIDs.shift(), targetSec)
				// alertGM("@@@ SPLIT: FINISHED SPLIT.", "DATA:SplitRepSec")
				break
			case "even":
				// alertGM("@@@ EVEN: STARTING EVEN.", "DATA:SplitRepSec")
				for (let i = 0; i < sortedIDs.length; i++) {
					if (i % 2)
						copyToRepSec(charRef, sourceSec, sortedIDs[i], targetSec)
				}
				// alertGM("@@@ EVEN: FINISHED EVEN.", "DATA:SplitRepSec")
				break
			default: break
			}
			return
		},
		getCaseRepID = (lowCaseID, charRef) => {
			// Given a lower-case row ID (from sheetworker), converts it to proper case.
			const charObj = getChar(charRef),
				attrObjs = _.filter(
					findObjs(charObj ?
						{type: "attribute", characterid: charObj.id} :
						{type: "attribute"} ),
					v => v.get("name")
						.toLowerCase()
						.includes(lowCaseID.toLowerCase())
				)
			if (!attrObjs || attrObjs.length === 0)
				return throwError(`No attributes found with id '${JSON.stringify(lowCaseID)}${charObj ? `' for char '${getName(charObj)}` : ""}'`, "getCaseRepID", SCRIPTNAME)

			return attrObjs[0].get("name").split("_")[2]
		}
		// #endregion

	// #region SPECIAL FX
	const runFX = (name, pos) => {
		// Runs one of the special effects defined above.
		spawnFxWithDefinition(pos.left, pos.top, FX[name] )
	}
	// #endregion

	// #region EVENT HANDLERS: (HANDLEINPUT)
	const handleInput = (msg, who, call, args) => { 	// eslint-disable-line no-unused-vars
		// const 
		switch (call) {
		case "":

			break
		default: break
		}
	}
	// #endregion

	return {
		RegisterEventHandlers: regHandlers,
		CheckInstall: checkInstall,

		GAMENAME,
		GMID: getGMID,

		ATTRIBUTES,
		SKILLS,
		DISCIPLINES,
		TRACKERS,
		MISCATTRS,
		BLOODPOTENCY,
		RESONANCEODDS,
		SESSIONNUMS,

		PAGEID: VALS.PAGEID,
		CELLSIZE: VALS.CELLSIZE,

		JS: jStr,
		JSL: jStrH,
		JSC: jStrL,
		JSR: jStrC,
		Ordinalize: ordinal, 								// D.Ordinalize(num): Returns ordinalized number (e.g. 1 -> "1st")
		Capitalize: capitalize,								// D.Capitalize(str): Capitalizes the first character in the string.

		ParseToObj: parseToObj,								// D.ParseToObj(string): Returns object with parameters given by a string of form 'key:val, key:val, ...'
		KeyMapObj: kvpMap,
		
		GetSelected: getSelected,							// D.GetSelected(msg): Returns selected objects in message.
		Validate: validate,
		Log: (msg, title = "") => log(`${jStrL(title)}: ${jStrL(msg)}`),
		IsIn: isIn,											// D.IsIn(needle, [haystack]): Returns formatted needle if found in haystack (= all traits by default)
		GetName: getName,

		/* D.GetName(id): Returns name of graphic, character or player's
							display name. If isShort, returns name without quoteparts
       						OR only last name if no quotes. */
		GetChars: getChars,

		/* D.GetChars(val): Returns array of matching characters, given
							"all", a chat message with selected token(s), character ID,
       						player ID, character name OR array of those params. */
		GetChar: getChar,

		/* D.GetChar(val): As above, but returns only the first character
		       				object found.*/
		GetStats: getAttrs,
		GetStat: getAttr,
		GetStatData: getAttrList,
		GetStatVal: getAttrVal,

		/* D.GetStat(char, name):  Given any valid character value, returns the
									attribute object described by name. */
		IsRepRow: isRepRow,
		GetRepAttrObjs: getRepAttrObjs,
		GetRepAttrs: getRepAttrData,
		GetRepIDs: getRepRowIDs,
		ParseRepAttr: parseRepAttr,
		GetRepIDCase: getCaseRepID,
		CopyToSec: copyToRepSec,
		SortRepSec: sortRepSec,
		SplitRepSec: splitRepSec,

		GetPlayerID: getPlayerID,

		/* D.GetPlayerID(val):  Returns player ID given: display name, token
		       					 object, character object.*/
		GetTextWidth: getTextWidth,

		/* D.GetTextWidth(obj, text):  Returns width of given text object if
			       					    it held supplied text. */
		MakeRow: makeRepRow,
		DeleteRow: deleteRepRow,

		/* D.MakeRow(charID/obj, secName, attrs):  Creates repeating fieldset row in
													secName with attrs for character
													given by object or ID.*/
		RunFX: runFX,

		/* D.RunFX(name, {top: y, left: x}):  Runs a special effect at
											   the given location. */
		ThrowError: throwError,
		// throwError(errObj, title, errObj): Logs an error and messages GM.
		GetDebugInfo: getDebugInfo,
		// D.GetDebugInfo(): Displays the debug level, alert level, and categories.
		SetDebugWatchList: setWatchList,

		DB: (msg, title) => {logEntry(msg, title); sendToGM(msg, title)},
		DBAlert: sendDebugAlert,

		Alert: sendToGM,
		// alertGM(msg, title): Sends alert message to GM.
		SendToPlayer: sendToPlayer

		/* D.SendToPlayer(who, msg, title): Sends chat message as 'who' with
											message and title. Message can be an array of strings OR
       										objects, of form: { message: <message>, title: <title> } */
	}
} )()

on("ready", () => {
	D.RegisterEventHandlers()
	D.CheckInstall()
	D.Log("Ready!", "DATA")
} )
void MarkStop("DATA")