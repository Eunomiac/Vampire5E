const DragPads = (() => {
	// #region CONFIGURATION
	const IMAGES = {
			blank: "https://s3.amazonaws.com/files.d20.io/images/63990142/MQ_uNU12WcYYmLUMQcbh0w/thumb.png?1538455511",
			signalLight: "https://s3.amazonaws.com/files.d20.io/images/66320080/pUJEq-Vo-lx_-Nn16TvhYQ/thumb.png?1541372292" // 455 x 514
		},
		DICECATS = ["diceList", "bigDice"],
		// #endregion

		// #region PERSONAL FUNCTION SETTINGS
		/* CUSTOM PAD FUNCTIONS: Put functions linked by name to wiggle pads here.
	   Each will be passed an object of form:
	   {  id: <id of graphic object beneath> } */
		FUNCTIONS = {
			selectDie (args) {
				const diceCats = [...DICECATS]
				let dieCat = "",
					dieId = 0
				do {
					dieCat = diceCats.pop()
					dieId = state[D.GAMENAME].Roller[dieCat].findIndex(v => v.id === args.id)
				} while (dieId === -1)
				Roller.Select(dieId, dieCat) // (dieNum, dieCat, dieVal, params)
			},
			wpReroll () {
				const stateVar = state[D.GAMENAME].Roller.selected,
					diceCats = [...DICECATS]
				let dieCat = ""
				do {
					dieCat = diceCats.pop()
					dieCat = stateVar[dieCat] && stateVar[dieCat].length > 0 ? dieCat : 0
				} while (dieCat === 0)
				Roller.Reroll(dieCat)
			},
			signalLight (args) {
				const [light] = findObjs( {
					_type: "graphic",
					_id: args.id
				} )
				if (!light)
					D.ThrowError(`No signal light found with id ${JSON.stringify(args.id)}.`)
				else if (light.get("imgsrc") === IMAGES.blank)
					light.set("imgsrc", IMAGES.signalLight)
				else
					light.set("imgsrc", IMAGES.blank)
			}
		},
		// #endregion

		// #region Pad Management
		getPad = padRef => {
			const pads = []
			if (D.IsObj(padRef)) {
				pads.push(getObj("graphic",
					state[D.GAMENAME].DragPads.byGraphic[padRef.id] ?
						state[D.GAMENAME].DragPads.byGraphic[padRef.id].id :
						state[D.GAMENAME].DragPads.byPad[padRef.id] ?
							padRef.id :
							null))
			} else if (_.isString(padRef)) {
				if (FUNCTIONS[padRef] ) {
					pads.push(
						..._.map(
							_.keys(
								_.omit(state[D.GAMENAME].DragPads.byPad, pData => {
									D.Log(`... pData: ${D.JS(pData)}`, "DRAGPADS: GET PAD")

									return pData.funcName !== padRef
								} )
							),
							pID => getObj("graphic", pID)
						)
					)
				} else {
					pads.push(getObj("graphic", state[D.GAMENAME].DragPads.byGraphic[padRef] ?
						state[D.GAMENAME].DragPads.byGraphic[padRef].id :
						state[D.GAMENAME].DragPads.byPad[padRef] ?
							padRef :
							null))
				}
			}

			/* if (_.compact(pads).length > 1)
			   D.Alert(`Found ${_.compact(pads).length} pads with padRef ${D.JS(padRef)}.`, "DRAGPADS: GET PAD") */

			return _.compact(pads)
		},
		getPads = padRef => {
			const pads = []
			if (_.isArray(padRef)) {
				for (const pRef of padRef)
					pads.push(...getPad(pRef))
			} else {
				pads.push(...getPad(padRef))
			}

			return pads
		},
		makePad = (graphicObj, funcName, params = "deltaTop:0, deltaLeft:, deltaHeight:0, deltaWidth:0") => {
			const options = {
				controlledby: "all",
				layer: "map"
			}
			let [pad, partnerPad] = [null, null]
			if (_.isString(params)) {
				_.each(params.split(/,\s*?(?=\S)/gu),
					v => {
						[, options[v.split(/\s*?(?=\S):\s*?(?=\S)/gu)[0]]] = v.split(/\s*?(?=\S):\s*?(?=\S)/gu)
					} )
			} else if (D.IsObj(params)) {
				Object.assign(options, params)
			} else {
				return D.ThrowError(`Bad parameters: ${D.JS(params)}`, "DRAGPADS:MakePad")
			}
			// D.Alert(`makePad Options: ${D.JS(options)}`, "DRAGPADS.MakePad")
			if (D.IsObj(graphicObj, "graphic")) {
				options._pageid = graphicObj.get("_pageid")
				options.left = options.left || graphicObj.get("left")
				options.top = options.top || graphicObj.get("top")
				options.width = options.width || graphicObj.get("width")
				options.height = options.height || graphicObj.get("height")
			}
			if (!options.left || !options.top || !options.width || !options.height)
				return D.ThrowError("Must include reference object OR positions & dimensions to make pad.", "DRAGPADS:MakePad")
			options._pageid = options._pageid || D.PAGEID()
			options.left += parseInt(options.deltaLeft || 0)
			options.top += parseInt(options.deltaTop || 0)
			options.width += parseInt(options.deltaWidth || 0)
			options.height += parseInt(options.deltaHeight || 0)
			delete options.deltaLeft
			delete options.deltaTop
			delete options.deltaWidth
			delete options.deltaHeight
			pad = Images.MakeImage(`${funcName}_Pad_#`, options)
			partnerPad = Images.MakeImage(`${funcName}_PartnerPad_#`, options)
			state[D.GAMENAME].DragPads.byPad[pad.id] = {
				funcName,
				name: pad.get("name"),
				left: pad.get("left"),
				top: pad.get("top"),
				height: pad.get("height"),
				width: pad.get("width"),
				partnerID: partnerPad.id,
				active: "on"
			}
			state[D.GAMENAME].DragPads.byPad[partnerPad.id] = {
				funcName,
				name: partnerPad.get("name"),
				left: partnerPad.get("left"),
				top: partnerPad.get("top"),
				height: partnerPad.get("height"),
				width: partnerPad.get("width"),
				partnerID: pad.id,
				active: "off"
			}
			if (D.IsObj(graphicObj, "graphic")) {
				state[D.GAMENAME].DragPads.byPad[pad.id].id = graphicObj.id
				state[D.GAMENAME].DragPads.byPad[partnerPad.id].id = graphicObj.id
				state[D.GAMENAME].DragPads.byGraphic[graphicObj.id] = {
					id: pad.id,
					pad: state[D.GAMENAME].DragPads.byPad[pad.id],
					partnerPad: state[D.GAMENAME].DragPads.byPad[partnerPad.id]
				}
			}

			return pad
		},
		removePad = padRef => {
			let padData = {}
			const pads = getPads(padRef)
			_.each(pads, pad => {
				try {
					if (state[D.GAMENAME].DragPads.byPad[pad.id] ) {
						padData = state[D.GAMENAME].DragPads.byPad[pad.id]
						Images.Remove(padData.name)
						delete state[D.GAMENAME].DragPads.byGraphic[padData.id]
						if (padData.partnerID) {
							Images.Remove(padData.partnerID)
							delete state[D.GAMENAME].DragPads.byPad[padData.partnerID]
						}
						delete state[D.GAMENAME].DragPads.byPad[pad.id]
					}
				} catch (errObj) {
					D.ThrowError(`PadObj: ${D.JS(pad)}<br>PadData: ${D.JS(padData)}<br><br>`, "DRAGPADS.removePad", errObj)
				}
			} )
		},
		clearAllPads = funcName => {
			const graphics = findObjs( {
					_pageid: D.PAGEID(),
					_type: "graphic",
					imgsrc: IMAGES.blank
				} ),
				pads = _.filter(graphics, v => v.get("name").includes(funcName))
			for (const pad of pads) {
				if (state[D.GAMENAME].DragPads.byPad[pad.id] )
					removePad(pad.id)
				else
					pad.remove()
			}
			_.each(_.omit(state[D.GAMENAME].DragPads.byPad, v => v.funcName !== funcName), (val, key) => {
				delete state[D.GAMENAME].DragPads.byPad[key]
			} )
		},
		togglePad = (padRef, isActive) => {
			const padIDs = []
			if (state[D.GAMENAME].DragPads.byGraphic[padRef] ) {
				padIDs.push(state[D.GAMENAME].DragPads.byGraphic[padRef].id)
			} else if (FUNCTIONS[padRef] ) {
				for (const padID of _.keys(state[D.GAMENAME].DragPads.byPad)) {
					if (state[D.GAMENAME].DragPads.byPad[padID].funcName === padRef)
						padIDs.push(padID)
				}
			} else {
				return D.ThrowError(`No pad found with ID: '${D.JS(padRef)}'`, "WIGGLEPADS: togglePad()")
			}
			for (const pID of padIDs) {
				const [pad, partner] = [
					getObj("graphic", pID),
					getObj("graphic", state[D.GAMENAME].DragPads.byPad[pID].partnerID)
				]
				if (D.IsObj(pad, "graphic") && D.IsObj(partner, "graphic")) {
					pad.set( {
						layer: isActive && state[D.GAMENAME].DragPads.byPad[pad.id].active === "on" ? "objects" : "map"
					} )
					partner.set( {
						layer: isActive && state[D.GAMENAME].DragPads.byPad[partner.id].active === "on" ? "objects" : "map"
					} )
				}
			}

			return true
		},
		// #endregion

		// #region Event Handlers
		handleMove = obj => {
			if (obj.get("layer") === "gmlayer" || !state[D.GAMENAME].DragPads.byPad[obj.id] )
				return false
			// toggle object
			obj.set( {
				layer: "gmlayer",
				controlledby: ""
			} )
			const objData = state[D.GAMENAME].DragPads.byPad[obj.id],
				partnerObj = getObj("graphic", objData.partnerID)
			obj.set( {
				left: objData.left,
				top: objData.top
			} )
			partnerObj.set( {
				layer: "objects",
				controlledby: "all"
			} )
			state[D.GAMENAME].DragPads.byPad[obj.id].active = "off"
			state[D.GAMENAME].DragPads.byPad[partnerObj.id].active = "on"
			// D.Alert(`Original Pad: ${D.JS(obj)}<br><br>Partner Pad: ${D.JS(partnerObj)}`)

			if (!FUNCTIONS[objData.funcName] )
				return false
			FUNCTIONS[objData.funcName]( {
				id: objData.id
			} )
			// D.Alert(`Original Pad: ${D.JS(obj)}<br><br>Partner Pad: ${D.JS(partnerObj)}`)

			return true
		},
		handleInput = msg => {
			if (msg.type !== "api" || !playerIsGM(msg.playerid))
				return
			const args = msg.content.split(/\s+/u)
			let obj = {},
				[funcName, arg] = [null, null]
			switch (args.shift()) {
			case "!wpad":
				if (!msg.selected || !msg.selected[0] ) {
					D.ThrowError("Select a graphic or text object first!")
				} else {
					[obj] = D.GetSelected(msg)
					D.Alert(`Object Retrieved: ${D.JS(obj)}; using args ${D.JS(args.join(", "))}`)
					makePad(obj, args.shift(), args.join(", ")) // Height:-28 width:-42 left:0 top:0
				}
				break
			case "!showpads":
				_.each(state[D.GAMENAME].DragPads.byPad, (v, padID) => {
					obj = getObj("graphic", padID)
					if (obj) {
						obj.set("imgsrc", "https://s3.amazonaws.com/files.d20.io/images/64184544/CnzRwB8CwKGg-0jfjCkT6w/thumb.png?1538736404")
						obj.set("layer", "gmlayer")
					} else {
						D.ThrowError(`No pad with id '${D.JSL(padID)}'`, "!ShowPads")
					}
				} )
				break
			case "!hidepads":
				_.each(state[D.GAMENAME].DragPads.byPad, (v, padID) => {
					obj = getObj("graphic", padID)
					if (obj) {
						obj.set("imgsrc", IMAGES.blank)
						obj.set("layer", "objects")
					} else {
						D.ThrowError(`No pad with id '${D.JSL(padID)}'`, "!ShowPads")
					}
				} )
				break
			case "!kill":
				funcName = args.shift()
				for (const padID of _.keys(state[D.GAMENAME].DragPads.byPad)) {
					if (state[D.GAMENAME].DragPads.byPad[padID].funcName === funcName) {
						obj = getObj("graphic", padID)
						if (obj)
							obj.remove()
						delete state[D.GAMENAME].DragPads.byGraphic[state[D.GAMENAME].DragPads.byPad[padID].id]
						delete state[D.GAMENAME].DragPads.byPad[padID]
					}
				}
				break
			case "!resetpads":
				_.each(state[D.GAMENAME].DragPads.byGraphic, (v, padID) => {
					obj = getObj("graphic", padID) || getObj("text", padID)
					if (!obj) {
						D.ThrowError(`No graphic with id '${D.JSL(padID)}' for function '${D.JSL(v.pad.funcName)}`, "!resetPads")
						state[D.GAMENAME].DragPads.byPad = _.omit(state[D.GAMENAME].DragPads.byPad, v.id)
						state[D.GAMENAME].DragPads.byPad = _.omit(state[D.GAMENAME].DragPads.byGraphic, padID)

						return
					}
					const pad = getObj("graphic", v.id),
						params = {
							height: v.pad.deltaHeight || 0,
							width: v.pad.deltaWidth || 0,
							left: v.pad.deltaLeft || 0,
							top: v.pad.deltaTop || 0
						}
					if (pad)
						pad.remove()
					state[D.GAMENAME].DragPads.byPad = _.omit(state[D.GAMENAME].DragPads.byPad, v.id)
					state[D.GAMENAME].DragPads.byPad = _.omit(state[D.GAMENAME].DragPads.byGraphic, padID)
					makePad(obj, v.pad.funcName, params)
				} )
				D.Alert("Pads Reset!", "!resetpads")
				break
			case "!wpCLEAR":
				arg = args.shift() || "all"
				if (arg.toLowerCase() === "all") {
					_.each(state[D.GAMENAME].DragPads.byGraphic, v => {
						obj = getObj("graphic", v.id)
						if (obj)
							obj.remove()
					} )
					_.each(state[D.GAMENAME].DragPads.byPad, (v, padID) => {
						obj = getObj("graphic", padID)
						if (obj)
							obj.remove()
					} )
					state[D.GAMENAME].DragPads = {
						byPad: {},
						byGraphic: {}
					}
				} else {
					clearAllPads(arg)
				}
				break
			default:
				break
			}
		},
		// #endregion

		// #region Public Functions
		regHandlers = () => {
			on("chat:message", handleInput)
			on("change:graphic", handleMove)
		},
		checkInstall = () => {
			state[D.GAMENAME] = state[D.GAMENAME] || {}
			state[D.GAMENAME].DragPads = state[D.GAMENAME].DragPads || {}
			state[D.GAMENAME].DragPads.byPad = state[D.GAMENAME].DragPads.byPad || {}
			state[D.GAMENAME].DragPads.byGraphic = state[D.GAMENAME].DragPads.byGraphic || {}
		}
	// #endregion

	return {
		RegisterEventHandlers: regHandlers,
		CheckInstall: checkInstall,
		MakePad: makePad,
		ClearAllPads: clearAllPads,
		GetPad: getPad,
		GetPads: getPads,
		Toggle: togglePad,
		DelPad: removePad
	}
} )()

on("ready", () => {
	DragPads.RegisterEventHandlers()
	DragPads.CheckInstall()
	D.Log("Ready!", "DragPads")
} )