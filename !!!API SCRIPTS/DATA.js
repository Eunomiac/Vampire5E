/* DATA.js, "DATA".  Exposed as "D" in the API sandbox.
   >>> DATA is both a library of handy resources for other scripts to use, and a master configuration file for your
   game.  You can find a list of all of the available methods at the end of the script.  Configuration is a bit
   trickier, but is contained in the CONFIGURATION and DECLARATIONS #regions. */

const D = (() => {
	// #region CONFIGURATION: Game Name, Character Registry
	const GAMENAME = "VAMPIRE",
		CHARREGISTRY = state[GAMENAME].Chars,
		// #endregion

		// #region DECLARATIONS: Reference Variables
		VALS = {
			PAGEID: () => Campaign().get("playerpageid"),
			CELLSIZE () {
				return 70 * getObj("page", Campaign().get("playerpageid")).get("snapping_increment")
			}
		},
		ATTRIBUTES = {
			physical: ["Strength", "Dexterity", "Stamina"],
			social: ["Charisma", "Manipulation", "Composure"],
			mental: ["Intelligence", "Wits", "Resolve"]
		},
		SKILLS = {
			physical: ["Athletics", "Brawl", "Craft", "Drive", "Firearms", "Melee", "Larceny", "Stealth", "Survival"],
			social: ["Animal Ken", "Animal_Ken", "Etiquette", "Insight", "Intimidation", "Leadership", "Performance", "Persuasion", "Streetwise", "Subterfuge"],
			mental: ["Academics", "Awareness", "Finance", "Investigation", "Medicine", "Occult", "Politics", "Science", "Technology"]
		},
		DISCIPLINES = ["Animalism", "Auspex", "Celerity", "Dominate", "Fortitude", "Obfuscate", "Potence", "Presence", "Protean", "Blood Sorcery", "Alchemy"],
		TRACKERS = ["Willpower", "Health", "Humanity", "Blood Potency"],
		BLOODPOTENCY = [
			{bloodSurge: 0, bloodDiscBonus: 0},
			{bloodSurge: 1, bloodDiscBonus: 1},
			{bloodSurge: 1, bloodDiscBonus: 1},
			{bloodSurge: 2, bloodDiscBonus: 1},
			{bloodSurge: 2, bloodDiscBonus: 2},
			{bloodSurge: 3, bloodDiscBonus: 2},
			{bloodSurge: 3, bloodDiscBonus: 3},
			{bloodSurge: 4, bloodDiscBonus: 3},
			{bloodSurge: 4, bloodDiscBonus: 4},
			{bloodSurge: 5, bloodDiscBonus: 4},
			{bloodSurge: 5, bloodDiscBonus: 5}
		],
		RESONANCEODDS = {
			norm: [{neg: 0.167, fleet: 0.1, intense: 0.053, acute: 0.013},
				{neg: 0.111, fleet: 0.067, intense: 0.036, acute: 0.009},
				{neg: 0.111, fleet: 0.067, intense: 0.036, acute: 0.009},
				{neg: 0.111, fleet: 0.067, intense: 0.036, acute: 0.009}],
			neg: [{neg: 0.136, fleet: 0.082, intense: 0.044, acute: 0.011},
				{neg: 0.136, fleet: 0.082, intense: 0.044, acute: 0.011},
				{neg: 0.136, fleet: 0.082, intense: 0.044, acute: 0.011},
				{neg: 0.091, fleet: 0.055, intense: 0.029, acute: 0.007}],
			posneg: [{neg: 0.167, fleet: 0.1, intense: 0.053, acute: 0.013},
				{neg: 0.121, fleet: 0.073, intense: 0.039, acute: 0.01},
				{neg: 0.121, fleet: 0.073, intense: 0.039, acute: 0.01},
				{neg: 0.091, fleet: 0.055, intense: 0.029, acute: 0.007}],
			pospos: [{neg: 0.124, fleet: 0.075, intense: 0.107, acute: 0.027},
				{neg: 0.111, fleet: 0.067, intense: 0.036, acute: 0.009},
				{neg: 0.111, fleet: 0.067, intense: 0.036, acute: 0.009},
				{neg: 0.111, fleet: 0.067, intense: 0.036, acute: 0.009}],
			negneg: [{neg: 0.15, fleet: 0.09, intense: 0.048, acute: 0.012},
				{neg: 0.15, fleet: 0.09, intense: 0.048, acute: 0.012},
				{neg: 0.15, fleet: 0.09, intense: 0.048, acute: 0.012},
				{neg: 0.05, fleet: 0.03, intense: 0.016, acute: 0.004}],
			pos2neg: [{neg: 0.124, fleet: 0.075, intense: 0.107, acute: 0.027},
				{neg: 0.144, fleet: 0.086, intense: 0.046, acute: 0.012},
				{neg: 0.144, fleet: 0.086, intense: 0.046, acute: 0.012},
				{neg: 0.091, fleet: 0.055, intense: 0.029, acute: 0.007}],
			neg2pos: [{neg: 0.196, fleet: 0.117, intense: 0.063, acute: 0.016},
				{neg: 0.13, fleet: 0.078, intense: 0.042, acute: 0.01},
				{neg: 0.13, fleet: 0.078, intense: 0.042, acute: 0.01},
				{neg: 0.043, fleet: 0.026, intense: 0.014, acute: 0.003}],
			posposneg: [{neg: 0.167, fleet: 0.1, intense: 0.053, acute: 0.013},
				{neg: 0.167, fleet: 0.1, intense: 0.053, acute: 0.013},
				{neg: 0.111, fleet: 0.067, intense: 0.036, acute: 0.009},
				{neg: 0.056, fleet: 0.033, intense: 0.018, acute: 0.004}],
			posnegneg: [{neg: 0.191, fleet: 0.115, intense: 0.061, acute: 0.015},
				{neg: 0.127, fleet: 0.076, intense: 0.041, acute: 0.01},
				{neg: 0.091, fleet: 0.055, intense: 0.029, acute: 0.007},
				{neg: 0.091, fleet: 0.055, intense: 0.029, acute: 0.007}]
		},
		// eslint-disable-next-line id-length
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
			bloodBolt: {
				angle: 0,
				angleRandom: 0.5,
				duration: 1,
				emissionRate: 5000,
				endColour: [50, 0, 0, 0],
				endColourRandom: [0, 0, 0, 0],
				gravity: {
					x: 0.01,
					y: 0.01
				},
				lifeSpan: 5,
				lifeSpanRandom: 1,
				maxParticles: 5000,
				size: 50,
				sizeRandom: 0,
				speed: 120,
				speedRandom: 121,
				startColour: [200, 0, 0, 1],
				startColourRandom: [12, 12, 12, 1]
			}
		},
		// #endregion

		// #region BASE FUNCTIONALITY: Fundamental Functions & String Manipulation to Declare First

		/* Finds the first player who is GM. */
		getGMID = () => {
			const playerObjs = findObjs( {_type: "player"} ),
			 gmObjs = playerObjs.filter(v => {
					log(`[getGMID() Iterator: Player Obj] ${JSON.stringify(v)}`)
					log(`[getGMID() Iterator: playerIsGM(id)] ${playerIsGM(v._id)}`)

					return playerIsGM(v._id)
				} )

			return gmObjs[0]
		},

		/* Whispers formatted chat message to player given: display name OR player ID.
     		Message can be an array of strings OR objects, of form: { message: <message>, title: <title> }. */
		sendToPlayer = function (who, message = "", title = "") {
			const player = getObj("player", who) ? getObj("player", who).get("_displayname") : who,
			  parseChatLine = msg => {
				  let str = ""
				  _.each(_.flatten( [msg] ), v => {
					  str += `<div style="display: block;"><span style="font-family:sans-serif; font-size: 10px; line-height: 10px;">${v}</span></div>`
					} )

					return str
				}
			let mString = null
			if (player && _.isArray(message)) {
				_.each(message.filter(v => _.isObject(v)), msg => sendToPlayer(who, msg, title))
			} else if (player && _.isObject(message)) {
				sendToPlayer(who, message.message || "", message.title || title)
			} else {
				mString = `<div style="border: 1px solid black; background-color: white; padding: 3px 3px;"><div style="display: block; font-weight: bold; border-bottom: 1px solid black;">${title}</div>${parseChatLine(message)}</div>`
				if (player === "all")
					sendChat("", mString)
				else
					sendChat("", `/w ${player} ${mString}`)
			}
		},

		/* Parses a value of any type via JSON.stringify, and then further styles it for display either
		in Roll20 chat, in the API console log, or both. */
		jStr = function (obj, isLogOnly) {
			try {
				if (_.isUndefined(obj)) {
					return isLogOnly ? "<UNDEFINED>" : "&gt;UNDEFINED&lt;"
				} else if (isLogOnly) {
					return JSON.stringify(obj)
						.replace(/[/"\n]/gu, "")
						.replace(/:/gu, ": ")
						.replace(/\[/gu, "[")
						.replace(/\]/gu, "]")
						.replace(/,/gu, ", ")
						.replace(/\{/gu, "{")
						.replace(/\}/gu, "}")
						.replace(/\s+/gu, " ")
				}

				return JSON.stringify(obj, null, "    ")
					.replace(/"/gu, "'")
					.replace(/ /gu, "&nbsp;")
					.replace(/\n/gu, "<br/>")
					.replace(/&nbsp;&nbsp;/gu, "&nbsp;")
			} catch (errObj) {
				sendToPlayer("Storyteller", JSON.stringify(errObj), "[ERROR: JSTRINGIFY()]")
				log(`[ERROR: JSTRINGIFY()] ${JSON.stringify(errObj)}`)

				return "&gt;ERR&lt;"
			}
		},

		/* A shortcut to call jStr for a log entry. */
		jLog = obj => jStr(obj, true),

		/* Styling and sending to the Storyteller via whisper (Alert) or to the API console (Log). */
		logEntry = (msg, title = "") => log(`[${jStr(title, true)}]: ${jStr(msg, true)}`),
		alertGM = (msg, title = "[ALERT]") => sendToPlayer("Storyteller", `${jStr(msg)}`, title),

		/* Converts any number by adding its appropriate ordinal ("2nd", "3rd", etc.) */
		ordinal = num => {
			const tNum = parseInt(num) - (100 * Math.floor(parseInt(num) / 100))
			if ( [11, 12, 13].includes(tNum))
				return `${num}th`

			return `${num}${["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][num % 10]}`
		},

		// capitalize = str => str.slice(0, 1).toUpperCase() + str.slice(1),
		capitalize = str => str,

		/* Converts string of form "key:val, key:val, key:val" into an object. */
		parseToObj = val => {
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

		isObject = v => v !== null && typeof v === "object",

		/* When given a message object, will return all selected objects, or false. */
		getSelected = (msg, types) => {
			const objs = []
			if (msg.selected && msg.selected[0] ) {
				if (types) {
					for (const typ of types) {
						objs.push(
							_.map(
								_.filter(msg.selected,
									sel => getObj(typ, sel._id)),
								sel => getObj(sel._type, sel._id)
							)
						)
					}
				} else {
					objs.push(
						_.map(
							_.filter(msg.selected,
								sel => getObj(sel._type, sel._id)),
							sel => getObj(sel._type, sel._id)
						)
					)
				}
			}

			return _.flatten(objs)
		},

		/* Looks for needle in haystack using fuzzy matching, then returns value as it appears in haystack. */
		isIn = function (needle, haystack) {
			let result = false
			try {
				const hay = haystack || _.flatten( [_.values(ATTRIBUTES), _.values(SKILLS), DISCIPLINES, TRACKERS] ),
				  ndl = `\\b${needle.replace(/^g[0-9]/u, "")}\\b`
				if (_.isArray(hay)) {
					const index = _.findIndex(_.flatten(hay), v => v.match(new RegExp(ndl, "iu")) !== null || v.match(new RegExp(ndl.replace(/_/gu), "iu")) !== null)
					result = index === -1 ? false : _.flatten(hay)[index]
				} else if (_.isObject(hay)) {
					const index = _.findIndex(_.keys(hay), v => v.match(new RegExp(ndl, "iu")) !== null ||
					v.match(new RegExp(ndl.replace(/_/gu), "iu"))) !== null
					result = index === -1 ? false : _.keys(hay)[index]
				} else {
					result = hay.match(new RegExp(ndl, "iu")) !== null
				}

				return result
			} catch (errObj) {
				return D.ThrowError(`Error locating stat '${D.JSL(needle)}' in ${D.JSL(haystack)}'`, "D.IsIn()")
			}
		},
		// #endregion

		// #region DEBUGGING & ERROR MANAGEMENT

		// Sets debug and alert thresholds.
		setDebugLvl = (lvl = 0, aLvl = 0) => { [state[GAMENAME].DEBUGLEVEL, state[GAMENAME].DEBUGALERT] = [lvl, aLvl] },

		// Returns a string of current Debug settings.
		getDebugInfo = () => `Debug Level: ${state[GAMENAME].DEBUGLEVEL || 0},
						Alert At: ${state[GAMENAME].DEBUGALERT || 0}
						Active Categories: ${state[GAMENAME].DEBUGCATS.split("|").join(", ")}`,


		// Sets categories for which debug alerts are allowed, or clears them if no parameters given.
		setDebugCats = (...cats) => {
			const catSet = new Set(state[GAMENAME].DEBUGCATS.split("|"), ...cats)
			state[GAMENAME].DEBUGCATS = cats.length === 0 ? "" : catSet.join("|")
		},

		/* Compares the priority level of the received bug report, and only logs it (or alerts it) if the
		debug levels and categories (see setDebugLvl) are appropriate. */
		formatDebug = (msg, title, level = state[GAMENAME].DEBUGLEVEL || 0, category = "") => {
			if (state[GAMENAME].DEBUGCATS === "ALL" || state[GAMENAME].DEBUGCATS.includes(category)) {
				if (state[GAMENAME].DEBUGLEVEL >= parseInt(level))
					logEntry(msg, title)
				if (state[GAMENAME].ALERTLEVEL >= parseInt(level))
					alertGM(msg, title)
			}
		},

		// Sends specified error message to the GM.
		throwError = (msg, title = "???") => {
			sendToPlayer("Storyteller", msg, `[ERROR: ${title}]`)
			log(`[ERROR: ${jStr(title, true)}] ${jStr(msg, true)}`)

			return false
		},
		// #endregion

		// #region GETTERS: Object, Character and Player Data

		// Returns the NAME of the Graphic, Character or Player (DISPLAYNAME) given: object or ID.
		getName = function (value, isShort) {
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

		/* Returns an ARRAY OF CHARACTERS given: "all", "registered", a character ID, a character Name,
			a token object, a message with selected tokens, OR an array of such parameters. */
		getChars = function (value) {
			const charObjs = new Set()
			let searchParams = []
			if (!value)
				return throwError("No Value Given!", "D.GETCHARS")
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
			_.each(searchParams, val => {
			// If parameter is a CHARACTER ID:
				if (_.isString(val) && getObj("character", val)) {
					charObjs.add(getObj("character", val))
				// If parameters is a TOKEN OBJECT:
				} else if (_.isObject(val) && val.id && val.get("_type") === "graphic" && val.get("_subtype") === "token") {
					const char = getObj("character", val.get("represents"))
					if (char)
						charObjs.add(char)
					else
						throwError(`Token '${jStr(val.id)}' Does Not Represent a Character.`, "D.GETCHARS")
				// If parameter is "all":
				} else if (val === "all") {
					_.each(findObjs( {_type: "character"} ), char => charObjs.add(char))
				// If parameter calls for REGISTERED CHARACTERS:
				} else if (val === "registered") {
					_.each(CHARREGISTRY, (v, charID) => {
						if (charID === v.id)
							charObjs.add(getObj("character", charID))
					} )
				// If parameter is a CHARACTER NAME:
				} else if (_.isString(val)) {
					_.each(findObjs( {_type: "character", name: val} ), char => charObjs.add(char))
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

		// Given a lower-case row ID (from sheetworker), converts it to proper case.
		getCaseRepID = function (lowCaseID, charRef) {
			const charObj = getChar(charRef),
				attrObjs = _.filter(
					findObjs(charObj ?
						{
							type: "attribute",
							characterid: charObj.id
						} :
						{
							type: "attribute"
						} ),
					v => v.get("name")
						.toLowerCase()
						.includes(lowCaseID)
				)
			if (!attrObjs || attrObjs.length === 0)
				return throwError(`No attributes found with id '${JSON.stringify(lowCaseID)}${charObj ? `' for char '${getName(charObj)}` : ""}'`)
			// logEntry(`AttrObjs: ${jLog(attrObjs)}`, "GETCASEREPID")

			return attrObjs[0].get("name").split("_")[2]
		},

		/* Returns an ARRAY of REPEATING ATTRIBUTE OBJECTS on <value> character.  Can specify a filter array
		containing strings that must appear in the attribute's name. */
		getRepStats = function (value, filterArray) {
			const charObj = getChar(value)
			if (!charObj)
				return throwError(`No character at '${jStr(value)}'`)
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
		getRepStat = (v, fArray) => getRepStats(v, fArray)[0],

		// Returns a PLAYER ID given: display name, token object, character object.
		getPlayerID = function (value) {
			if (_.isString(value)) {
				try {
					return findObjs( {
						_type: "player",
						_displayname: value
					} )[0].id
				} catch (errObj) {
					return throwError(`No player found at '${jStr(value)}'`, "D.GETPLAYERID")
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
				return throwError(`No player ID found at '${jStr(value)}': ${errObj}`, "D.GETPLAYERID")
			}
		},

		getTextWidth = function (obj, text) {
			const font = obj.get("font_family").split(" ")[0].replace(/[^a-zA-Z]/gu, ""),
				size = obj.get("font_size"),
			     chars = text.split(""),
			   fontRef = state.DATA.CHARWIDTH[font],
			   charRef = fontRef && fontRef[size]
			let width = 0
			if (!fontRef)
				return throwError(`No font reference for '${font}'`)
			if (!charRef)
				return throwError(`No character reference for '${font}' at size '${size}'`)
			_.each(chars, char => {
				if (!charRef[char] && charRef[char] !== " " && charRef[char] !== 0)
					logEntry(`... MISSING '${char}' in '${font}' at size '${size}'`)
				else
					width += parseInt(charRef[char] )
			} )

			return width
		},
		// #endregion

		// #region SETTERS:  New Repeating Section Rows
		makeRow = function (charID, secName, attrs) {
			const IDa = 0,
				IDb = [],
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
					  }
				  )(),
				makeRowID = () => generateUUID().replace(/_/gu, "Z"),
				rowID = makeRowID(),
				prefix = `repeating_${secName}_${rowID}_`

			_.each(attrs, (v, k) => createObj("attribute", {
				name: prefix + k,
				current: v,
				max: "",
				_characterid: charID
			} ))

			return rowID
		},
		// #endregion

		// Runs one of the special effects defined above.
		runFX = (name, pos) => spawnFxWithDefinition(pos.left, pos.top, FX[name] ),

		// #region INITIALIZATION
		checkInstall = () => {
			state[GAMENAME] = state[GAMENAME] || {}
			state[GAMENAME].DEBUGCATS = state[GAMENAME].DEBUGCATS || ""
		}
	// #endregion

	return {
		CheckInstall: checkInstall,

		GAMENAME,
		GMID: getGMID(),

		ATTRIBUTES,
		SKILLS,
		DISCIPLINES,
		TRACKERS,
		BLOODPOTENCY,
		RESONANCEODDS,

		PAGEID: VALS.PAGEID,
		CELLSIZE: VALS.CELLSIZE,

		JS: jStr, 						// D.JS(obj, isLog): Parses a string. If isLog, will not use HTML.
		JSL: jLog, 						// D.JSL(obj):  Parses a string, for output to the console log.
		Ordinal: ordinal, 				// D.Ordinal(num): Returns ordinalized number (e.g. 1 -> "1st")
		Capitalize: capitalize,			// D.Capitalize(str): Capitalizes the first character in the string.
		ParseToObj: parseToObj,			/* D.ParseToObj(string): Returns object with parameters given by
											a string of form 'key:val, key:val,' */
		GetSelected: getSelected,		// D.GetSelected(msg): Returns selected objects in message.
		Log: logEntry, 					// D.Log(msg, title): Formats log message, with title.
		IsIn: isIn, 					/* D.IsIn(needle, [haystack]): Returns formatted needle if found in
											haystack (= all traits by default) */
		IsObj: isObject,				// D.IsObj(val): Returns true if val is an object (not array)
		GetName: getName, 				/* D.GetName(id): Returns name of graphic, character or player's
											display name. If isShort, returns name without quoteparts
       										OR only last name if no quotes. */
		GetChars: getChars, 			/* D.GetChars(val): Returns array of matching characters, given
											"all", a chat message with selected token(s), character ID,
       										player ID, character name OR array of those params. */
		GetChar: getChar, 				/* D.GetChar(val): As above, but returns only the first character
		       								object found.*/
		GetStat: getStat, 				/* D.GetStat(char, name):  Given any valid character value, returns the
											attribute object described by name. */
		GetRepIDCase: getCaseRepID,
		GetRepStats: getRepStats,
		GetRepStat: getRepStat,
		GetPlayerID: getPlayerID, 		/* D.GetPlayerID(val):  Returns player ID given: display name, token
		       								object, character object.*/
		GetTextWidth: getTextWidth, 	/* D.GetTextWidth(obj, text):  Returns width of given text object if
			       							it held supplied text. */
		MakeRow: makeRow, 				/* D.MakeRow(charID/obj, secName, attrs):  Creates repeating fieldset
											row in secName with attrs for character given by object or ID.*/
		RunFX: runFX, 					/* D.RunFX(name, {top: y, left: x}):  Runs a special effect at
											the given location. */
		ThrowError: throwError, 		// D.ThrowError(errObj, title): Logs an error and messages GM.
		GetDebugInfo: getDebugInfo,		// D.GetDebugInfo(): Displays the debug level, alert level, and categories.
		SetDebugLevel: setDebugLvl, 	/* D.SetDebugLevel(lvl, alertLevel): Sets debug level to lvl. D.DB calls with
											levels lower than this will be muted; alertLevel is the same, but will
											publish the message to Roll20 chat. */
		SetDebugCats: setDebugCats,		/* D.SetDebugCats(cats): Adds given categories to debug list, or clears the list
											if no categories are given */
		DB: formatDebug, 				/* D.DB(msg, title, category, lvl): Logs debug if DEBUGLEVEL equal to lvl,
												and if category has been set via SetDebugCats(). */
		Alert: alertGM, 				// D.Alert(msg, title): Sends alert message to GM.
		SendToPlayer: sendToPlayer 		/* D.SendToPlayer(who, msg, title): Sends chat message as 'who' with
											message and title. Message can be an array of strings OR
       										objects, of form: { message: <message>, title: <title> } */
	}
} )()

on("ready", () => {
	D.CheckInstall()
	D.Log("Ready!", "DATA")
} )