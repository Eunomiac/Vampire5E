/* ChatFuncs.js, "ChatFuncs".  No exposure to other scripts in the API.
   >>> ChatFuncs is a library of commands that can be triggered from within roll20 chat.  You can view the properties
   of selected objects and the state variable; run text-sizing tests to be used in scripts like Roller;   is both a
   library of handy resources for other scripts to use, and a master configuration file for your game.  You can find
   a list of all of the available methods at the end of the script.  Configuration is a bit trickier, but is contained
   to the CONFIGURATION and DECLARATIONS #regions. Strictly a utility script: Doesn't set things or return information
   to other API objects --- use DATA and SET for that. */

const ChatFuncs = (() => {
	const HELPMESSAGE = [{
			title: "Get Data",
			message: "<p>" +
					"Various commands to query information from the Roll20 tabletop and state variable.  <b>If a command relies on a &quot;selected token&quot;, make sure the token is associated with a character sheet (via the token's setting menu)." +
					"</p>" +
					"<p>" +
					"<b>Commands</b>" +
					"<div style=&quot;padding-left:10px;&quot;>" +
					"<ul>" +
					"<li style=&quot;border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;&quot;>" +
					"<b><span style=&quot;font-family: serif;&quot;>!get all</span></b> - Gets a JSON stringified list of all the object's properties" +
					"</li>" +
					"<li style=&quot;border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;&quot;>" +
					"<b><span style=&quot;font-family: serif;&quot;>!get char</span></b> - Gets the name, character ID, and player ID represented by the selected token." +
					"</li>" +
					"<li style=&quot;border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;&quot;>" +
					"<b><span style=&quot;font-family: serif;&quot;>!get img</span></b> - Gets the graphic ID and img source of the selected graphic." +
					"</li>" +
					"<li style=&quot;border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;&quot;>" +
					"<b><span style=&quot;font-family: serif;&quot;>!get pos</span></b> - Gets the position and dimensions of the selected object, in both grid and pixel units." +
					"</li>" +
					"<li style=&quot;border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;&quot;>" +
					"<b><span style=&quot;font-family: serif;&quot;>!get attrs</span></b> - Gets all attribute objects attached to the selected character token." +
					"</li>" +
					"<li style=&quot;border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;&quot;>" +
					"<b><span style=&quot;font-family: serif;&quot;>!get prop [<id>] <property> </span></b> - Gets the contents of the specified property on the selected object, or the object ID." +
					"</li> " +
					"<li style=&quot;border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;&quot;>" +
					"<b><span style=&quot;font-family: serif;&quot;>!get state [<namespace>]</span></b> - Gets a stringified list of all items in the given state namespace." +
					"</li> " +
					"</ul>" +
					"</div>" +
					"</p>"
		},
		{
			title: "Find Objects",
			message: "<p>" +
					"Commands to search the game board for objects meeting certain characteristics." +
					"</p>" +
					"<p>" +
					"<b>Commands</b>" +
					"<div style=&quot;padding-left:10px;&quot;>" +
					"<ul>" +
					"<li style=&quot;border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;&quot;>" +
					"<b><span style=&quot;font-family: serif;&quot;>!find obj <type> <id></span></b> - Searches for a single object of the given type and with the given ID, and returns its characteristics." +
					"</li> " +
					"</ul>" +
					"</div>" +
					"</p>"
		}],

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
			D.Alert( [`<b>ID:</b> ${obj.id}`, `<b>SRC:</b> ${obj.get("imgsrc").replace("max", "thumb")}`], "Image Data")

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
				D.Log(charObj, "CHAROBJ")
				D.Alert( [`<b>Name:</b> ${name}`, `<b>CharID:</b> ${charObj.id}`, `<b>PlayerID:</b> ${playerID}`], "Character Data")
			} catch (errObj) {
				D.ThrowError("", "CHARS.getChar", errObj)

				return false
			}

			return true
		},
		getCharAttrs = obj => {
			if (!obj)
				return false
			const allAttrObjs = findObjs( {
					_type: "attribute",
					_characterid: obj.get("represents")
				} ),
				allAttrs = allAttrObjs.map(v => ( {
					name: D.JS(v.get("name")),
					current: D.JS(v.get("current"))
						.replace(/\[/gu, "\\[")
						.replace(/\{/gu, "\\{")
				} )),
				sortedAttrs = _.sortBy(allAttrs, "name"),
				attrsLines = []

			/* _.each(allAttrObjs, function screenAttrs (attrObj) {
				allAttrs.push( {
					name: D.JS(attrObj.get("name")),
					current: D.JS(attrObj.get("current")).replace(/\[/gu, "\\[")
						.replace(/\{/gu, "\\{")
				} )
			} ) */
			_.each(sortedAttrs, function parseAttrs (attrInfo) {
				attrsLines.push(`<b>${D.JS(attrInfo.name)
					.replace(/''/gu, "")}:</b> ${D.JS(attrInfo.current)
					.replace(/\\\\/gu, "\\")
					.replace(/''/gu, "")}`)
			} )
			D.Alert(attrsLines, `Attribute Data for ${D.GetName(obj.get("represents"))}`)

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
			D.Alert( [`<b><u>GRID</u>:</b><br/>${gridInfo}`, `<b><u>PIXELS</u>:</b><br/>${pixelInfo}`], "Position Data")

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

			const args = msg.content.split(/\s+/u)
			let [obj, params, attrList] = [{}, {}, {}],
				objsToKill = [],
				[width, initX, initY] = [0, 0, 0],
				[objType, objID, pattern, deltaX, deltaY] = ["", "", "", "", ""]
			switch (args.shift()) {
			case "!get":
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
				switch (args.shift()) {
				case null:
					if (!getSelected(obj))
						D.Alert(HELPMESSAGE)
					break
				case "all":
					if (!getSelected(obj, true))
						D.Alert(HELPMESSAGE)
					break
				case "gm":
					D.Alert(`The player ID of the GM is ${D.GMID()}`, "!GET GM")
					break
				case "img":
					if (!getImg(obj))
						D.Alert(HELPMESSAGE)
					break
				case "char":
					if (!getChar(obj))
						D.Alert(HELPMESSAGE)
					break
				case "pos":
					if (!getPos(obj))
						D.Alert(HELPMESSAGE)
					break
				case "attrs":
					if (!getCharAttrs(obj))
						D.Alert(HELPMESSAGE)
					break
				case "prop":
				case "property":
					if (!getProperty(obj, args.shift()))
						D.Alert(HELPMESSAGE)
					break
				case "state":
					if (!getStateData(args))
						D.Alert(HELPMESSAGE)
					break
				case "page":
					D.Alert(D.JS(Campaign().get("playerpageid")), "Page ID")
					break
				default:
					D.Alert(HELPMESSAGE)
					break
				}
				break
			case "!set":
				switch (args.shift()) {
				case "size":
					if (msg.selected && msg.selected[0] ) {
						obj = getObj(msg.selected[0]._type, msg.selected[0]._id)
						if (obj) {
							attrList = args.join(" ").split(",")
							_.each(attrList, v => {
								params[v.split(":")[0]] = parseInt(v.split(":")[1] ) || v.split(":")[1]
							})
							obj.set(params)
						}
					}
					break
				default:
					break
				}
				break
			case "!db":
				switch (args.shift()) {
				case "add":
					D.AddDBFilter(args.shift())
					break
				case "clear":
					if (args.length > 0)
						D.RemoveDBFilter(args.join(" "))
					else
						D.ClearDBFilters()
					break
				default:
					break
				}

				break
			case "!clear":
				[objType, pattern] = [args.shift(), args.shift()]
				objsToKill = _.filter(findObjs( {
					_pageid: Campaign().get("playerpageid"),
					_type: objType
				} ), v => v && v.get("name").includes(pattern))
				for (obj of objsToKill)
					obj.remove()
				break
			case "!find":
				switch (args.shift()) {
				case "obj":
				case "object":
					[objType, objID] = [args.shift(), args.shift()]
					if (!objType || !objID) {
						D.Alert(HELPMESSAGE)
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
					D.Alert(HELPMESSAGE)
					break
				}
				break
			case "!clearState":
				if (!clearStateData(args))
					D.Alert(HELPMESSAGE)
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
					break
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