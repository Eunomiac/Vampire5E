/* DATA.js, "DATA".  Exposed as "D" in the API sandbox.
   >>> DATA is both a library of handy resources for other scripts to use, and a master configuration file for your
   game.  You can find a list of all of the available methods at the end of the script.  Configuration is a bit
   trickier, but is contained in the CONFIGURATION and DECLARATIONS #regions. */

const D = (() => {
	// #region CONFIGURATION: Game Name, Character Registry
	const GAMENAME = "VAMPIRE",
		CHARREGISTRY = state[GAMENAME] && state[GAMENAME].Chars || {},
		HTMLFORMATS = {
			titleStart: "<div style=\"display: block; width: auto; padding: 0px 5px; margin-left: -42px; margin-top: -30px;font-family: copperplate gothic; font-variant: small-caps; font-size: 16px; background-color: #333333; color: white;border: 2px solid black; position: relative; height: 20px; line-height: 23px;\">",
			titleEnd: "</div>",
			bodyStart: "<div style=\"display: block;width: auto;padding: 5px 5px;margin-left: -42px; font-family: input, verdana, sans-serif;font-size: 10px;background-color: white;border: 2px solid black;line-height: 14px;position: relative;\">",
			bodyEnd: "</div><div style=\"display: block; width: auto; margin-left: -42px; background-color: none; position: relative; height: 25px;\"></div>"
		},
		// #endregion

		// #region DECLARATIONS: Reference Variables
		VALS = {
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
				{neg: 0.167, fleet: 0.1, intense: 0.053, acute: 0.013},
				{neg: 0.111, fleet: 0.067, intense: 0.036, acute: 0.009},
				{neg: 0.111, fleet: 0.067, intense: 0.036, acute: 0.009},
				{neg: 0.111, fleet: 0.067, intense: 0.036, acute: 0.009}
			],
			neg: [
				{neg: 0.136, fleet: 0.082, intense: 0.044, acute: 0.011},
				{neg: 0.136, fleet: 0.082, intense: 0.044, acute: 0.011},
				{neg: 0.136, fleet: 0.082, intense: 0.044, acute: 0.011},
				{neg: 0.091, fleet: 0.055, intense: 0.029, acute: 0.007}
			],
			posneg: [
				{neg: 0.167, fleet: 0.1, intense: 0.053, acute: 0.013},
				{neg: 0.121, fleet: 0.073, intense: 0.039, acute: 0.01},
				{neg: 0.121, fleet: 0.073, intense: 0.039, acute: 0.01},
				{neg: 0.091, fleet: 0.055, intense: 0.029, acute: 0.007}
			],
			pospos: [
				{neg: 0.124, fleet: 0.075, intense: 0.107, acute: 0.027},
				{neg: 0.111, fleet: 0.067, intense: 0.036, acute: 0.009},
				{neg: 0.111, fleet: 0.067, intense: 0.036, acute: 0.009},
				{neg: 0.111, fleet: 0.067, intense: 0.036, acute: 0.009}
			],
			negneg: [
				{neg: 0.15, fleet: 0.09, intense: 0.048, acute: 0.012},
				{neg: 0.15, fleet: 0.09, intense: 0.048, acute: 0.012},
				{neg: 0.15, fleet: 0.09, intense: 0.048, acute: 0.012},
				{neg: 0.05, fleet: 0.03, intense: 0.016, acute: 0.004}
			],
			pos2neg: [
				{neg: 0.124, fleet: 0.075, intense: 0.107, acute: 0.027},
				{neg: 0.144, fleet: 0.086, intense: 0.046, acute: 0.012},
				{neg: 0.144, fleet: 0.086, intense: 0.046, acute: 0.012},
				{neg: 0.091, fleet: 0.055, intense: 0.029, acute: 0.007}
			],
			neg2pos: [
				{neg: 0.196, fleet: 0.117, intense: 0.063, acute: 0.016},
				{neg: 0.13, fleet: 0.078, intense: 0.042, acute: 0.01},
				{neg: 0.13, fleet: 0.078, intense: 0.042, acute: 0.01},
				{neg: 0.043, fleet: 0.026, intense: 0.014, acute: 0.003}
			],
			posposneg: [
				{neg: 0.167, fleet: 0.1, intense: 0.053, acute: 0.013},
				{neg: 0.167, fleet: 0.1, intense: 0.053, acute: 0.013},
				{neg: 0.111, fleet: 0.067, intense: 0.036, acute: 0.009},
				{neg: 0.056, fleet: 0.033, intense: 0.018, acute: 0.004}
			],
			posnegneg: [
				{neg: 0.191, fleet: 0.115, intense: 0.061, acute: 0.015},
				{neg: 0.127, fleet: 0.076, intense: 0.041, acute: 0.01},
				{neg: 0.091, fleet: 0.055, intense: 0.029, acute: 0.007},
				{neg: 0.091, fleet: 0.055, intense: 0.029, acute: 0.007}
			]
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
		// #endregion

		// #region DECLARATIONS: Dependent Variables
		ALLSTATS = [
			..._.flatten(_.values(ATTRIBUTES)),
			..._.flatten(_.values(SKILLS)),
			...DISCIPLINES,
			...TRACKERS
		],
		// #endregion

		// #region BASE FUNCTIONALITY: Fundamental Functions & String Manipulation to Declare First
		getGMID = () => {
			/* Finds the first player who is GM. */
			const gmObj = _.find(findObjs( {
				_type: "player"
			} ), v => playerIsGM(v.id))
			if (gmObj)
				return gmObj.id

			return D.ThrowError("No GM found.", "DATA GETGMID")
		},
		jStr = obj => {
			/* Parses a value of any type via JSON.stringify, and then further styles it for display either
			in Roll20 chat, in the API console log, or both. */
			try {
				if (_.isUndefined(obj))
					return "&gt;UNDEFINED&lt;"

				const replacer = (k, v) => typeof v === "string" ? v.replace(/\\/gu, "") : v

				return JSON.stringify(obj, replacer, 2)
					.replace(/(\s*?)"([^"]*?)"\s*?:/gu, "$1$2:")
					.replace(/\\n/gu, "<br/>")
					.replace(/\\t/gu, "")
					.replace(/ (?= )/gu, "&nbsp;")
					.replace(/\\"/gu, "\"")
					.slice(1, -1)

				/* return JSON.stringify(obj, null, 2)
					.replace(/"/gu, "'")
					.replace(/ /gu, "&nbsp;")
					.replace(/\\n/gu, "<br/>")
					.replace(/\\/gu, "")
					.replace(/&nbsp;&nbsp;/gu, "&nbsp;")
					.slice(1, -1) */
			} catch (errObj) {
				return D.ThrowError("", "DATA.jStr", errObj)
			}
		},
		jStrHTML = str => {
			if (_.isUndefined(str))
				return "&gt;UNDEFINED&lt;"
			if (_.isString(str))
				return str.replace(/\n/gu, "")

			return JSON.stringify(str).replace(/\\n/gu, "")
		},
		jLog = obj => {
			/* Parses a value in a way that is appropriate to the console log. */
			if (_.isUndefined(obj))
				return "<UNDEFINED>"

			return jStr(obj)
				.replace(/<br\/>/gu, "")
				.replace(/(&nbsp;)+/gu, " ")
				.replace(/\\"\\"/gu, "'")
				.replace(/"/gu, "")

			/* JSON.stringify(obj, null, 3)
				.replace(/[/"\n]/gu, "")
				.replace(/:/gu, ": ")
				.replace(/\[/gu, "[")
				.replace(/\]/gu, "]")
				.replace(/,/gu, ", ")
				.replace(/\{/gu, "{")
				.replace(/\}/gu, "}")
				.replace(/\s+/gu, " ") */
		},
		sendToPlayer = (who, message = "", title = "") => {
			/* Whispers formatted chat message to player given: display name OR player ID. */
			const player = getObj("player", who) ?
					getObj("player", who).get("_displayname") :
					who,
				html = [
					HTMLFORMATS.titleStart,
					jStr(title),
					HTMLFORMATS.titleEnd,
					HTMLFORMATS.bodyStart,
					jStr(message),
					HTMLFORMATS.bodyEnd
				].join("")
			if (player === "all" || player === "")
				sendChat("", html)
			else
				sendChat("", `/w ${player} ${html}`)
		},
		logEntry = (msg, title = "") => {
			/* Styling and sending to the Storyteller via whisper (Alert) or to the API console (Log). */
			log(`[${jLog(title)}]: ${jLog(msg)}`)
		},
		alertGM = (msg, title = "[ALERT]") => {
			sendToPlayer("Storyteller", msg, title)
		},
		ordinal = num => {
			/* Converts any number by adding its appropriate ordinal ("2nd", "3rd", etc.) */
			const tNum = parseInt(num) - (100 * Math.floor(parseInt(num) / 100))
			if ( [11, 12, 13].includes(tNum))
				return `${num}th`

			return `${num}${["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][num % 10]}`
		},
		capitalize = str => {
			if (_.isString(str))
				return str.slice(0, 1).toUpperCase() + str.slice(1)

			D.ThrowError(`Attempt to capitalize non-string '${jLog(str)}'`, "DATA: CAPITALIZE")

			return str
		},
		parseToObj = val => {
			/* Converts string of form "key:val, key:val, key:val" into an object. */
			const obj = {}
			let args = null
			if (_.isString(val))
				args = val.split(/,\s*/u)
			else if (_.isArray(val))
				args = [...val]
			else
				return D.ThrowError(`Cannot parse value '${D.JSL(val)}' to object.`, "DATA: ParseToObj")

			for (const keyVal of args) {
				const kvp = keyVal.split(/\s*:\s*(?!\/)/u)
				obj[kvp[0]] = parseInt(kvp[1] ) || kvp[1]
			}

			return obj
		},
		keyMapObject = (obj, kFunc, vFunc) => {
			const newObj = {}
			_.each(obj, (v, k) => {
				newObj[kFunc ? kFunc(k, v) : k] = vFunc ? vFunc(v, k) : v
			} )

			return newObj
		},
		isObject = (obj, type, subtype) => {
			if (
				obj &&
				obj !== null &&
				typeof obj === "object" &&
				obj.get &&
				(!type || obj.get("_type") === type) &&
				(!subtype || obj.get("_subtype") === subtype)
			)
				return true

			/* D.Alert(`Obj ? ${Boolean(obj)}<br>
				Obj !== Null ? ${obj !== null}<br>
				typeof val === "object" ? ${obj !== null && typeof obj === "object"}<br>
				val.get ? ${Boolean(obj !== null && typeof obj === "object" && obj.get)}<br>
				!type OR val.get("_type") === "${type}" ? ${Boolean(obj !== null && typeof obj === "object" && obj.get) && (!type || obj.get("_type") === type)}
				!subtype OR ... ? ${Boolean(obj !== null && typeof obj === "object" && obj.get) && (!type || obj.get("_type") === type) && (!subtype || obj.get("_subtype") === subtype)}<br>`)
 */
			return false
		},
		isIn = (needle, haystack = ALLSTATS) => {
			/* Looks for needle in haystack using fuzzy matching, then returns value as it appears in haystack. */
			try {
				const ndl = `\\b${needle.replace(/^g[0-9]/u, "")}\\b`
				if (_.isArray(haystack)) {
					const index = _.findIndex(_.flatten(haystack),
						v => v.match(new RegExp(ndl, "iu")) !== null ||
						v.match(new RegExp(ndl.replace(/_/gu), "iu")) !== null)

					return index === -1 ? false : _.flatten(haystack)[index]
				} else if (_.isObject(haystack)) {
					const index = _.findIndex(_.keys(haystack),
						v => v.match(new RegExp(ndl, "iu")) !== null ||
						v.match(new RegExp(ndl.replace(/_/gu), "iu"))) !== null

					return index === -1 ? false : _.keys(haystack)[index]
				}

				return haystack.search(new RegExp(needle, "iu")) > -1 && haystack
			} catch (errObj) {
				return D.ThrowError(`Error locating stat '${D.JSL(needle)}' in ${D.JSL(haystack)}'`, "DATA.isIn", errObj)
			}
		},
		// #endregion

		// #region DEBUGGING & ERROR MANAGEMENT
		setDebugLvl = (lvl, aLvl) => {
			// Sets debug and alert thresholds.
			[state[GAMENAME].DEBUGLEVEL, state[GAMENAME].DEBUGALERT] = [parseInt(lvl || 0), parseInt(aLvl || 0)]
			D.Alert(`Debug Level set to ${state[GAMENAME].DEBUGLEVEL}
			Alert Level set to ${state[GAMENAME].DEBUGALERT}`, "DATA: setDebugLvl()")
		},
		getDebugInfo = () => `Logging at level ${state[GAMENAME].DEBUGLEVEL || 0} and below.
		Alerting at level ${state[GAMENAME].DEBUGALERT || 0} and below.`,
		addDBFilter = text => {
			state[GAMENAME].DBFILTER.push(text)
			D.Alert(`Debug Filter '${text}' Added.  Current filter set:

			${jStr(state[GAMENAME].DBFILTER)}`, "DATA: addDBFilter()")
		},
		removeDBFilter = text => {
			state[GAMENAME].DBFILTER = _.without(state[GAMENAME].DBFILTER, text)
			D.Alert(`Debug Filter '${text}' Removed.  Current filter set:

			${jStr(state[GAMENAME].DBFILTER)}`, "DATA: removeDBFilter()")
		},
		clearDBFilters = () => {
			state[GAMENAME].DBFILTER = []
			D.Alert("Debug Filters Cleared.", "DATA: clearDBFilters()")
		},
		formatDebug = (msg, title, level = state[GAMENAME].DEBUGLEVEL || 0) => {
			/* Compares the priority level of the received bug report, and...
				LOGS it if its level is absent OR exceeded by DEBUGLEVEL
				ALERTS it if its level is exceeded by ALERTLEVEL. */
			if (state[GAMENAME].DEBUGLEVEL >= parseInt(level))
				logEntry(msg, title)
			if (state[GAMENAME].DEBUGALERT >= parseInt(level))
				alertGM(msg, title)
		},
		throwError = (msgText, title = "???", errObj) => {
			// Sends specified error message to the GM.
			let msg = msgText
			if (errObj)
				msg += `<br>${errObj.name}<br>${errObj.message}<br><br>${errObj.stack}`
			sendToPlayer(D.GMID(), jStr(msg), `[ERROR] ${title}`)
			log(`[ERROR: ${jLog(title)}] ${jLog(msg)}`)

			return false
		},
		// #endregion

		// #region GETTERS: Object, Character and Player Data
		getSelected = (msg, types) => {
			/* When given a message object, will return all selected objects, or false. */
			let selObjs = []
			if (_.isObject(msg) && msg.selected && msg.selected[0] ) {
				selObjs.push(..._.map(msg.selected, v => getObj(v._type, v._id)))
				if (types)
					selObjs = _.filter(selObjs, v => types.includes(v.get("_type")))
			} else {
				return false
			}
			// D.Alert(jStr(selObjs), "SELECTED OBJECTS")

			return selObjs
		},
		getName = (value, isShort) => {
			// Returns the NAME of the Graphic, Character or Player (DISPLAYNAME) given: object or ID.
			const objID = _.isString(value) ? value : value._id,
				obj = _.isString(value) ? getObj("graphic", objID) || getObj("character", objID) : value,
				name = (obj && obj.get("name")) ||
				(getObj("player", objID) && getObj("player", objID).get("_displayname")) ||
				null
			if (!name)
				return throwError(`No name found for character ID: ${objID}`, "D.GETNAME")
			if (!isShort)
				return name
			if (name.includes("\"")) {
				return name
					.replace(/.*?["]/iu, "")
					.replace(/["].*/iu, "")
					.replace(/_/gu, " ")
			}

			return name
				.replace(/.*\s/iu, "")
				.replace(/_/gu, " ")
		},
		getChars = value => {
			/* Returns an ARRAY OF CHARACTERS given: "all", "registered", a character ID, a character Name,
				a token object, a message with selected tokens, OR an array of such parameters. */
			const charObjs = new Set()
			let searchParams = []

			/* if (!value)
				return throwError(`No Value Given: ${D.JS(value)}!`, "D.GETCHARS") */
			try {
				if (value.who) {
					if (!value.selected || !value.selected[0] )
						return throwError("Must Select a Token!", "D.GETCHARS")
					const tokens = _.filter(value.selected,
						selection => getObj("graphic", selection._id) &&
							_.isString(getObj("graphic", selection._id).get("represents")) &&
							getObj("character", getObj("graphic", selection._id).get("represents")))
					if (!tokens)
						return throwError(`No Valid Token Selected: ${jStr(value.selected)}`, "D.GETCHARS")

					return _.map(tokens, v => getObj("character", getObj("graphic", v._id).get("represents")))
				} else if (_.isArray(value)) {
					searchParams = value
				} else if (_.isString(value) || _.isObject(value)) {
					searchParams.push(value)
				} else {
					return throwError(`Bad Value: '${jStr(value)}'`, "GETCHARS")
				}
			} catch (errObj) {
				D.Alert(`Error Getting Char:
				${errObj.name}
				${errObj.message}
				
				STACK:
				${D.JS(errObj.stack)}`, "ERR: D.GetChars")

				return false
			}
			// D.Alert(`Search Params: ${D.JS(searchParams)}`)
			_.each(searchParams, val => {
				/* D.Alert(`Obj !== Null ? ${val !== null}<br>
					typeof val === "object" ? ${val !== null && typeof val === "object"}<br>
					val.get ? ${Boolean(val !== null && typeof val === "object" && val.get)}<br>
					val.get(type) === "character" ? ${Boolean(val !== null && typeof val === "object" && val.get) && val.get("_type") === "character"}
					D.IsObj(val, "character") ? ${D.IsObj(val, "character")}`)
				// If parameter is a CHARACTER OBJECT already: */
				if (D.IsObj(val, "character")) {
					charObjs.add(getObj("character", val.id))

					/* D.Alert(`We have a character!  CharObjs = ${D.JS(charObjs)}`)
					   If parameter is a CHARACTER ID: */
				} else if (_.isString(val) && getObj("character", val)) {
					charObjs.add(getObj("character", val))
					// If parameters is a TOKEN OBJECT:
				} else if (D.IsObj(val, "graphic", "token")) {
					const char = getObj("character", val.get("represents"))
					if (char)
						charObjs.add(char)
					else
						throwError(`Token '${jStr(val.id)}' Does Not Represent a Character.`, "D.GETCHARS")
					// If parameter is "all":
				} else if (val === "all") {
					_.each(findObjs( {
						_type: "character"
					} ), char => charObjs.add(char))
					// If parameter calls for REGISTERED CHARACTERS:
				} else if (val === "registered") {
					_.each(CHARREGISTRY, (v, charID) => {
						if (charID === v.id && getObj("character", charID))
							charObjs.add(getObj("character", charID))
					} )
					// If parameter is a CHARACTER NAME:
				} else if (_.isString(val)) {
					_.each(findObjs( {
						_type: "character",
						name: val
					} ), char => charObjs.add(char))
				}
				if (charObjs.size === 0)
					throwError(`No Characters Found for Value '${jStr(val)}' in '${jStr(value)}'`, "D.GETCHARS")
			} )

			return [...charObjs]
		},
		getChar = v => getChars(v)[0],
		getStat = (v, name) => findObjs( {
			_type: "attribute",
			_characterid: getChar(v).id,
			_name: name
		} )[0],
		getPlayerID = value => {
			// Returns a PLAYER ID given: display name, token object, character object.
			if (_.isString(value)) {
				try {
					return findObjs( {
						_type: "player",
						_displayname: value
					} )[0].id
				} catch (errObj) {
					return throwError(`No player found at '${jStr(value)}'`, "DATA.getPlayerID", errObj)
				}
			}
			try {
				let playerID = null
				if (value.get("_type") === "graphic" && value.get("_subtype") === "token")
					playerID = value.get("represents")
				if (value.get("_type") === "character") {
					[playerID] = value.get("controlledby").replace("all,", "")
						.replace(",all", "")
						.split(",", 1)
				}
				if (!playerID)
					throw new Error(`No player ID found controlling ${value.get("_type")} with ID '${value.id}'`)

				return playerID
			} catch (errObj) {
				return throwError(`No player ID found at '${jStr(value)}'`, "DATA.getPlayerID", errObj)
			}
		},
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
		},
		// #endregion

		// #region Repeating Section Manipulation
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
			D.Alert(`${D.JS(attrObjs)}
			
			found!`)
			if (!attrObjs || attrObjs.length === 0)
				return throwError(`No attributes found with id '${JSON.stringify(lowCaseID)}${charObj ? `' for char '${getName(charObj)}` : ""}'`)

			return attrObjs[0].get("name").split("_")[2]
		},
		getRepStats = (charRef, filterArray) => {
			/* Returns an ARRAY of REPEATING ATTRIBUTE OBJECTS on <value> character.  Can specify a filter array
			containing strings that must appear in the attribute's name. */
			const charObj = getChar(charRef)
			if (!charObj)
				return throwError(`No character at '${jStr(charRef)}'`)
			let attrObjs = findObjs( {
				type: "attribute",
				characterid: charObj.id
			} )
			_.each(filterArray,
				val => {
					attrObjs = attrObjs.filter(
						v => v.get("name").toLowerCase()
							.includes(val.toLowerCase())
					)
					attrObjs = _.filter(attrObjs,
						v => v.get("name").toLowerCase()
							.includes(val.toLowerCase()))
				} )

			return attrObjs
		},
		// As getRepStats(), but only returns a single attribute object.
		getRepStat = (charRef, filterArray) => getRepStats(charRef, filterArray)[0],
		// As getRepStats(), but returns a list of attribute {name: value} pairs instead of attribute objects.
		getRepAttrs = (charRef, filterArray) => {
			const attrList = {}
			_.each(getRepStats(charRef, filterArray), v => {
				attrList[v.get("name")] = v.get("current")
			} )

			// D.Alert(`GETREPATTRS: ${D.JS(attrList)}`)

			return attrList
		},
		isRepRow = (charRef, rowID) => getRepStats(charRef, [rowID] ).length > 0,
		getRepRowIDs = (charRef, secName) => _.uniq(
			_.map(
				_.keys(
					_.pick(
						getRepAttrs(charRef, ["repeating", `${secName}_`] ), (v, k) => k.startsWith(`repeating_${secName}_`)
					)
				), k => k.replace(`repeating_${secName}_`, "").substr(0, 20)
			)
		),
		makeRow = (charRef, secName, attrs) => {
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
				createObj("attribute", {
					name: prefix + k,
					max: "",
					_characterid: charID
				} )
				attrList[prefix + k] = v
			} )
			setAttrs(charID, attrList)

			return rowID
		},
		deleteRepRow = (charRef, secName, rowID) => {
			if (!D.GetChar(charRef) || !_.isString(secName) || !_.isString(rowID))
				return D.ThrowError(`Need valid charRef (${D.JSL(charRef)}), secName (${D.JSL(secName)}) and rowID (${D.JSL(rowID)}) to delete a repeating row.`, "DATA.DeleteRepRow")
			const attrObjs = getRepStats(charRef, [secName, rowID] )
			if (attrObjs.length === 0)
				return D.ThrowError(`No row "repeating_${secName}_${rowID}" to delete for ${D.GetName(charRef)}.`, "DATA.DeleteRepRow")
			_.each(attrObjs, v => v.remove())

			return true
		},
		copyToRepSec = (charRef, sourceSec, sourceRowID, targetSec) => {
			const attrList = keyMapObject(getRepAttrs(charRef, [sourceSec, sourceRowID] ), k => k.replace(`repeating_${sourceSec}_${sourceRowID}_`, ""))
			makeRow(charRef, targetSec, attrList)
			deleteRepRow(charRef, sourceSec, sourceRowID)
		},
		sortRepSec = (charRef, secName, sortFunc) => {
			/* Sortfunc must have parameters (charRef, secName, rowID1, rowID2) and return
			POSITIVE INTEGER if row1 should be ABOVE row2. */
			// D.Log(`CharRef: ${D.JSL(charRef)}`)
			const rowIDs = getRepRowIDs(charRef, secName),
				sortTrigger = getRepAttrs(charRef, [`repeating_${secName}_${rowIDs[0]}_sorttrigger`] )
			// D.Alert(`RepOrder: ${D.JS(repOrderAttr)}<br><br>${rowIDs.length} Row IDs for ${secName}:<br><br>${D.JS(rowIDs)}`, "DATA.SortRepSec")
			rowIDs.sort((idA, idB) => sortFunc(charRef, secName, idA, idB))
			// D.Alert(`... SORTED?<br><br>${D.JS(rowIDs)}<br><br>TEST ATTR: ${D.JS(sortTrigger)}`, "DATA.SortRepSec")
			setAttrs(D.GetChar(charRef).id, {[`_reporder_repeating_${secName}`]: rowIDs.join(",")} )
			sortTrigger[`repeating_${secName}_${rowIDs[0]}_sorttrigger`] = sortTrigger[`repeating_${secName}_${rowIDs[0]}_sorttrigger`] === "false"
			setAttrs(D.GetChar(charRef).id, sortTrigger)

			return rowIDs
		},
		splitRepSec = (charRef, sourceSec, targetSec, sortFunc, mode = "split") => {
			/* Will combine values from both source and target sections, sort them, then evenly split
			them between the two sections.  Split modes include:
				"split" (default) --- the bottom half of results will be moved to targetSec
				"even" --- even-numbered rows will be moved to targetSec
			Sortfunc must have parameters (charRef, secName, rowID1, rowID2) and return
			POSITIVE INTEGER if row1 should be ABOVE row2.  */
			_.each(getRepRowIDs(charRef, targetSec), id => {
				copyToRepSec(charRef, targetSec, id, sourceSec)
			} )
			const sortedIDs = sortRepSec(charRef, sourceSec, sortFunc)
			switch (mode) {
			case "split":
				sortedIDs.splice(0, Math.ceil(sortedIDs.length / 2))
				while (sortedIDs.length > 0)
					copyToRepSec(charRef, sourceSec, sortedIDs.shift(), targetSec)
				break
			case "even":
				for (let i = 0; i < sortedIDs.length; i++) {
					if (i % 2)
						copyToRepSec(charRef, sourceSec, sortedIDs[i], targetSec)
				}
				break
			default: break
			}
		},
		// #endregion

		// #region SPECIAL FX
		runFX = (name, pos) => {
		// Runs one of the special effects defined above.
			spawnFxWithDefinition(pos.left, pos.top, FX[name] )
		},
		// #endregion

		// #region INITIALIZATION
		checkInstall = () => {
			delete state[GAMENAME].DEBUGCATS
			state[GAMENAME] = state[GAMENAME] || {}
			state[GAMENAME].DATA = state[GAMENAME].DATA || {}
			state[GAMENAME].DATA.CHARWIDTH = state[GAMENAME].DATA.CHARWIDTH || {}
			state[GAMENAME].DBFILTER = state[GAMENAME].DBFILTER || []
		}
	// #endregion

	return {
		CheckInstall: checkInstall,

		GAMENAME,
		GMID: getGMID,

		ATTRIBUTES,
		SKILLS,
		DISCIPLINES,
		TRACKERS,
		BLOODPOTENCY,
		RESONANCEODDS,

		PAGEID: VALS.PAGEID,
		CELLSIZE: VALS.CELLSIZE,

		JS: jStr,
		// D.JS(obj, isLog): Parses a string. If isLog, will not use HTML.
		JSL: jLog,
		// D.JSL(obj):  Parses a string, for output to the console log.
		JSH: jStrHTML,

		/* D.JSH(string):  Strips a multiline string of linebreaks, typically used for HTML
		code (so you can format your code) for easy reading without including the incidental
		linebreaks as <br> tags in a subsequent jStr call. */
		Ordinal: ordinal,
		// D.Ordinal(num): Returns ordinalized number (e.g. 1 -> "1st")
		Capitalize: capitalize,
		// D.Capitalize(str): Capitalizes the first character in the string.
		ParseToObj: parseToObj,

		KeyMapObj: keyMapObject,

		/* D.ParseToObj(string): Returns object with parameters given by
								  a string of form 'key:val, key:val,' */
		GetSelected: getSelected,
		// D.GetSelected(msg): Returns selected objects in message.
		Log: logEntry,
		// D.Log(msg, title): Formats log message, with title.
		IsIn: isIn,

		/* D.IsIn(needle, [haystack]): Returns formatted needle if found in
										haystack (= all traits by default) */
		IsObj: isObject,
		// D.IsObj(val): Returns true if val is an object (not array)
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
		GetStat: getStat,

		/* D.GetStat(char, name):  Given any valid character value, returns the
									attribute object described by name. */
		IsRepRow: isRepRow,
		GetRepIDCase: getCaseRepID,
		GetRepStats: getRepStats,
		GetRepStat: getRepStat,
		GetRepAttrs: getRepAttrs,
		CopyToSec: copyToRepSec,
		SortRepSec: sortRepSec,
		SplitRepSec: splitRepSec,

		GetPlayerID: getPlayerID,

		/* D.GetPlayerID(val):  Returns player ID given: display name, token
		       					 object, character object.*/
		GetTextWidth: getTextWidth,

		/* D.GetTextWidth(obj, text):  Returns width of given text object if
			       					    it held supplied text. */
		MakeRow: makeRow,

		/* D.MakeRow(charID/obj, secName, attrs):  Creates repeating fieldset row in
													secName with attrs for character
													given by object or ID.*/
		RunFX: runFX,

		/* D.RunFX(name, {top: y, left: x}):  Runs a special effect at
											   the given location. */
		ThrowError: throwError,
		// D.ThrowError(errObj, title, errObj): Logs an error and messages GM.
		GetDebugInfo: getDebugInfo,
		// D.GetDebugInfo(): Displays the debug level, alert level, and categories.
		SetDebugLevel: setDebugLvl,

		/* D.SetDebugLevel(lvl, alertLevel): Sets debug level to lvl. D.DB calls with
											  levels lower than this will be muted;
											  alertLevel is the same, but will
											  publish the message to Roll20 chat. */
		AddDBFilter: addDBFilter,
		ClearDBFilters: clearDBFilters,
		RemoveDBFilter: removeDBFilter,
		DB: formatDebug,

		/* D.DB(msg, title, category, lvl): Logs debug if DEBUGLEVEL equal to lvl,
											 and if category has been set via SetDebugCats(). */
		Alert: alertGM,
		// D.Alert(msg, title): Sends alert message to GM.
		SendToPlayer: sendToPlayer

		/* D.SendToPlayer(who, msg, title): Sends chat message as 'who' with
											message and title. Message can be an array of strings OR
       										objects, of form: { message: <message>, title: <title> } */
	}
} )()

on("ready", () => {
	D.CheckInstall()
	D.Log("Ready!", "DATA")
} )