/* ChatFuncs.js, "ChatFuncs".  No exposure to other scripts in the API.
   >>> ChatFuncs is a library of commands that can be triggered from within roll20 chat.  You can view the properties
   of selected objects and the state variable; run text-sizing tests to be used in scripts like Roller;   is both a
   library of handy resources for other scripts to use, and a master configuration file for your game.  You can find
   a list of all of the available methods at the end of the script.  Configuration is a bit trickier, but is contained
   to the CONFIGURATION and DECLARATIONS #regions. Strictly a utility script: Doesn't set things or return information
   to other API objects --- use DATA and SET for that. */

const ChatFuncs = (() => {
	const HELPMESSAGE = {
			title: "<div style=\"display: block; width: auto; padding: 0px 5px; margin-left: -42px; margin-top: -30px;font-family: copperplate gothic; font-variant: small-caps; font-size: 16px; background-color: #333333; color: white;border: 2px solid black; position: relative; height: 20px; line-height: 23px;\">Chat Function Help</div>",
			message: "<div style=\"display: block;width: auto;padding: 5px 5px;margin-left: -42px; font-family: verdana;font-size: 12px;background-color: white;border: 2px solid black;line-height: 14px;position: relative;\"><p>Various commands to query information from the Roll20 tabletop and state variable. <b>If a command relies on a \"selected token\", make sure the token is associated with a character sheet (via the token's setting menu).</p><p><b>Commands</b><div style=\"padding-left:10px;\"><ul><li style=\"border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;\"><b><span style=\"font-family: serif;\">!get all</span></b> - Gets a JSON stringified list of all the object's properties</li><li style=\"border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;\"><b><span style=\"font-family: serif;\">!get char</span></b> - Gets the name, character ID, and player ID represented by the selected token.</li><li style=\"border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;\"><b><span style=\"font-family: serif;\">!get img</span></b> - Gets the graphic ID and img source of the selected graphic.</li><li style=\"border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;\"><b><span style=\"font-family: serif;\">!get pos</span></b> - Gets the position and dimensions of the selected object, in both grid and pixel units.</li><li style=\"border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;\"><b><span style=\"font-family: serif;\">!get attr[s]</span></b> - Gets all attribute objects attached to the selected character token.  Alternatively, \"<b>!get attr attr1 [attr2] [attr3]...</b>\" will let you filter for the attributes you want.</li><li style=\"border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;\"><b><span style=\"font-family: serif;\">!get prop [&lt;id&gt;] &lt;property&gt;</span></b> - Gets the contents of the specified property on the selected object, or the object ID.</li> <li style=\"border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;\"><b><span style=\"font-family: serif;\">!get state [&lt;namespace&gt;]</span></b> - Gets a stringified list of all items in the given state namespace.</li></ul></div></p></div><div style=\"display: block; width: auto; margin-left: -42px; background-color: none; position: relative; height: 25px;\"></div>"
		},
		sendHelpMsg = () => sendChat("", `/w Storyteller ${HELPMESSAGE.title}${HELPMESSAGE.message}`),

		// #region Get Data Functions
		getSelected = (obj, isGettingAll) => {
			if (!obj)
				return false
			D.Alert(isGettingAll ? D.JS(obj) : obj.id)

			return true
		},
		getImg = obj => {
			if (!obj || obj.get("_type") !== "graphic")
				return false
			D.Alert(`<b>ID:</b> ${obj.id}<br/><b>SRC:</b> ${obj.get("imgsrc").replace("max", "thumb")}`, "Image Data")

			return true
		},
		getAllChars = () => {
			const allCharObjs = findObjs( {
					_type: "character"
				} ),
				allCharIDs = allCharObjs.map(v => ( {
					name: v.get("name"),
					id: v.id
				} )),
				sortedAttrs = _.sortBy(allCharIDs, "id"),
				attrsLines = []
			_.each(sortedAttrs, attrInfo => {
				attrsLines.push(`${attrInfo.id}: ${attrInfo.name}`)
			} )
			D.Alert(attrsLines.join("<br/>"), "All Characters")

			return true
		},
		getChar = obj => {
			D.Log(obj, "OBJ")
			if (!obj || obj.get("_type") !== "graphic" || obj.get("_subtype") !== "token")
				return false
			try {
				const charObj = getObj("character", obj.get("represents")),
					name = charObj.get("name"),
					playerID = charObj.get("controlledby").replace("all,", "")
				D.Alert(`<b>Name:</b> ${name}<br/><b>CharID:</b> ${charObj.id}<br/><b>PlayerID:</b> ${playerID}`, "Character Data")
			} catch (errObj) {
				D.ThrowError("", "CHARS.getChar", errObj)

				return false
			}

			return true
		},
		getCharAttrs = (obj, filter = [] ) => {
			if (!obj)
				return false
			let sortedAttrs = []
			const allAttrObjs = _.uniq(findObjs( {
					_type: "attribute",
					_characterid: typeof obj === "string" ? obj : obj.get("represents")
				} )),
				allAttrs = allAttrObjs.map(v => ( {
					name: v.get("name").replace(/^repeating_/gu, "@@@").replace(/@@@([^_]+)_[^_]{15}([^_]{4})[^_]+_(.*)/gu, "®$1_$2_$3"),
					current: v.get("current"),
					id: v.id
				} )),
				attrsLines = []
			if (filter.length > 0)
				sortedAttrs = _.sortBy(_.pick(_.uniq(allAttrs), v => filter.includes(v.name)), "name")
			else
				sortedAttrs = _.sortBy(_.uniq(allAttrs), "name")
			_.each(sortedAttrs, attrInfo => {
				attrsLines.push(`${attrInfo.name} (${attrInfo.id.slice(10, 14)}): ${attrInfo.current}`)
			} )
			D.Alert(`${attrsLines.join("<br/>")}<br/><br/>Num Objs: ${allAttrObjs.length}, Attrs: ${allAttrs.length}, Sorted: ${sortedAttrs.length}, Lines: ${attrsLines.length}`, `Attributes For ${D.GetName(obj)}`)

			return true
		},
		getPos = obj => {
			if (!obj)
				return false
			const gridInfo = `<b>Center:</b> ${obj.get("left") / D.CELLSIZE()}, ${obj.get("top") / D.CELLSIZE()
				}<br/> <b>Left:</b> ${(obj.get("left") - (0.5 * obj.get("width"))) / D.CELLSIZE()
				}<br/> <b>Top:</b> ${(obj.get("top") - (0.5 * obj.get("height"))) / D.CELLSIZE()
				}<br/> <b>Dimensions:</b> ${obj.get("width") / D.CELLSIZE()} x ${obj.get("height") / D.CELLSIZE()}`,
				pixelInfo = ` Center:</b> ${obj.get("left")}, ${obj.get("top")
				}<br/> <b>Left:</b> ${obj.get("left") - (0.5 * obj.get("width"))
				}<br/> <b>Top:</b> ${obj.get("top") - (0.5 * obj.get("height"))
				}<br/> <b>Dimensions:</b> ${obj.get("width")} x ${obj.get("height")}`
			D.Alert(`<b><u>GRID</u>:</b><br/>${gridInfo}<br/><b><u>PIXELS</u>:</b><br/>${pixelInfo}`, "Position Data")

			return true
		},
		getProperty = (obj, property) => {
			if (!property || !obj)
				return false
			const propString = obj.get(property, function tellInfo (v) {
				D.Alert(v, `${obj.get("_type").toUpperCase()} '${obj.get("name")}' - ${property}`)

				return v
			} )
			if (propString)
				D.Alert(D.JS(propString), `${obj.get("_type").toUpperCase()} '${obj.get("name")}' - ${property}`)

			return true
		},
		getStateData = namespace => {
			let stateInfo = state
			const title = `state.${namespace.join(".")}`
			// eslint-disable-next-line no-unmodified-loop-condition
			while (namespace && namespace.length > 0)
				stateInfo = stateInfo[namespace.shift()]

			D.Alert(D.JS(stateInfo), title)

			return true
		},
		clearStateData = namespace => {
			let stateInfo = state
			const title = `Clearing state.${namespace.join(".")}`
			// eslint-disable-next-line no-unmodified-loop-condition
			while (namespace && namespace.length > 0)
				stateInfo = stateInfo[namespace.shift()]

			D.Alert(`DELETED ${D.JS(stateInfo)}`, title)
			stateInfo = ""

			return true
		},
		// #endregion

		// #region Text Length Testing
		prepText = (objIDs, string) => {
			for (let i = 0; i < objIDs.length; i++) {
				const char = string.charAt(i),
					[obj] = findObjs( {
						_id: objIDs[i]._id
					} )
				obj.set("text", char.repeat(20))
			}
		},
		resolveText = objIDs => {
			let stateRef = null
			for (const objID of objIDs) {
				const [obj] = findObjs( {
						_id: objID._id
					} ),
					width = obj.get("width"),
					char = obj.get("text").charAt(0),
					[font] = obj.get("font_family").split(" "),
					size = obj.get("font_size")
				state.DATA = state.DATA || {}
				state.DATA.CHARWIDTH = state.DATA.CHARWIDTH || {}
				state.DATA.CHARWIDTH[font] = state.DATA.CHARWIDTH[font] || {}
				state.DATA.CHARWIDTH[font][size] = state.DATA.CHARWIDTH[font][size] || {}
				state.DATA.CHARWIDTH[font][size][char] = width / 20
				stateRef = state.DATA.CHARWIDTH[font][size]
				// D.Alert("Total Width: " + width + ", Char Width: " + (width / 20), "Text Width of '" + character + "'");
			}
			D.Alert(`Current Widths:   ${D.JS(stateRef)}`)
		},
		caseText = (objs, textCase) => {
			objs.forEach(obj => {
				obj.set("text", textCase === "upper" ? obj.get("text").toUpperCase() : obj.get("text").toLowerCase())
			} )
		},
		// #endregion

		// #region Event Handlers (handleInput)
		handleInput = msg => {
			if (msg.type !== "api" || !playerIsGM(msg.playerid))
				return

			const args = msg.content.split(/\s+/u),
				params = {}
			let [obj, attrList] = [{}, {}],
				objsToKill = [],
				[width] = [0, 0, 0],
				[objType, objID, pattern] = ["", "", ""]
			switch (args.shift().toLowerCase()) {
			case "!get":
			{
				if (msg.selected && msg.selected[0] ) {
					[obj] = findObjs( {
						_id: msg.selected[0]._id
					} )
				} else {
					for (let i = 1; i < args.length; i++) {
						[obj] = findObjs( {
							_id: args[i]
						} )
						if (obj) {
							args.splice(i, 1)
							break
						}
					}
				}
				switch (args.shift().toLowerCase()) {
				case null:
					if (!getSelected(obj))
						sendHelpMsg()
					break
				case "all":
					if (!getSelected(obj, true))
						sendHelpMsg()
					break
				case "gm":
					D.Alert(`The player ID of the GM is ${D.GMID()}`, "!GET GM")
					break
				case "img":
					if (!getImg(obj))
						sendHelpMsg()
					break
				case "chars":
				case "allchars":
					if (!getAllChars())
						sendHelpMsg()
					break
				case "char":
					if (!getChar(obj))
						sendHelpMsg()
					break
				case "pos":
					if (!getPos(obj))
						sendHelpMsg()
					break
				case "attrs":
					if (!getCharAttrs(args.shift() || obj))
						sendHelpMsg()
					break
				case "attr":
					if (!getCharAttrs(obj, _.compact(args.join(" ").replace(/(\[|,)/gu, "").replace(/\s+/gu, "|")
						.split("|"))))
						sendHelpMsg()
					break
				case "prop":
				case "property":
					if (!getProperty(obj, args.shift()))
						sendHelpMsg()
					break
				case "state":
					if (!getStateData(args))
						sendHelpMsg()
					break
				case "page":
					D.Alert(D.JS(Campaign().get("playerpageid")), "Page ID")
					break
				case "debug":
					D.Alert(D.GetDebugInfo(), "DEBUG SETTINGS")
					break
				default:
					sendHelpMsg()
					break
				}
				break
			}
			case "!set":
			{
				switch (args.shift()) {
				case "dblvl":
					D.SetDebugLevel(...args)
					break
				case "dbfilter":
					D.AddDBFilter(args.shift())
					break
				case "size":
					if (msg.selected && msg.selected[0] ) {
						for (const objData of msg.selected) {
							obj = getObj(objData._type, objData._id)
							if (obj) {
								attrList = args.join(" ").split(",")
								_.each(attrList, v => {
									params[v.split(":")[0]] = parseInt(v.split(":")[1] ) || v.split(":")[1]
								} )
								obj.set(params)
							}
						}
					}
					break
				default: break
				}
				break
			}
			case "!clear":
				switch (args.shift()) {
				case "dbfilter":
					if (args.length > 0)
						D.RemoveDBFilter(args.join(" "))
					else
						D.ClearDBFilters()
					break
				case "obj":
					[objType, pattern] = [args.shift(), args.shift()]
					objsToKill = _.filter(findObjs( {
						_pageid: Campaign().get("playerpageid"),
						_type: objType
					} ), v => v && v.get("name").includes(pattern))
					for (obj of objsToKill)
						obj.remove()
					break
				case "state":
					if (!clearStateData(args))
						sendHelpMsg()
					break

				default: break
				}
				break
			case "!find":
				switch (args.shift()) {
				case "obj":
				case "object":
					[objType, objID] = [args.shift(), args.shift()]
					if (!objType || !objID) {
						sendHelpMsg()
						break
					}
					D.Alert(D.JS(getObj(objType, objID)), "Object(s) Found")
					break
				case "textWidth":
					if (!msg.selected || !msg.selected[0] )
						break
					width = D.GetTextWidth(findObjs( {
						_id: msg.selected[0]._id
					} )[0], args.join(" "))
					D.Alert(`The text you entered should be ${width} pixels wide.`)
					break
				default:
					sendHelpMsg()
					break
				}
				break
			case "!prepText":
				if (!msg.selected || !msg.selected[0] )
					break
				prepText(msg.selected, args.shift())
				D.Alert("Move the text object around, and type '!resText' when you have.")
				break
			case "!resText":
				if (!msg.selected || !msg.selected[0] )
					break
				resolveText(msg.selected)
				break
			case "!upperText":
				if (!msg.selected || !msg.selected[0] )
					break
				caseText(msg.selected, "upper")
				break
			case "!lowerText":
				if (!msg.selected || !msg.selected[0] )
					break
				caseText(msg.selected, "lower")
				break
			case "!checkText":
				if (!msg.selected || !msg.selected[0] )
					break;
				[obj] = findObjs( {
					_id: msg.selected[0]._id
				} );
				((font = obj.get("font_family").split(" "), size = obj.get("font_size")) => {
					D.Alert(`There are ${_.values(state.DATA.CHARWIDTH[font][size] ).length} entries.`, `${D.JS(font).toUpperCase()} ${D.JS(size)}`)
				} )()
				break
			default:
				break
			}
		},
		// #endregion

		// #region Public Functions: RegisterEventHandlers
		regHandlers = () => {
			on("chat:message", handleInput)
		}
	// #endregion

	return {
		RegisterEventHandlers: regHandlers
	}
} )()

on("ready", () => {
	ChatFuncs.RegisterEventHandlers()
	D.Log("Ready!", "ChatFuncs")
} )