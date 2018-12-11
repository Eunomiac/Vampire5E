const DragPads = (() => {
	// #region CONFIGURATION
	const IMAGES = {
			blank: "https://s3.amazonaws.com/files.d20.io/images/63990142/MQ_uNU12WcYYmLUMQcbh0w/thumb.png?1538455511",
			signalLight: "https://s3.amazonaws.com/files.d20.io/images/66320080/pUJEq-Vo-lx_-Nn16TvhYQ/thumb.png?1541372292" // 455 x 514
		},
		DICECATS = ["diceList", "bigDice"]
	// #endregion

	// #region PERSONAL FUNCTION SETTINGS

	/* CUSTOM PAD FUNCTIONS: Put functions linked by name to wiggle pads here.
	   Each will be passed an object of form:
	   {  id: <id of graphic object beneath> } */
	const FUNCTIONS = {
		selectDie(args) {
			const diceCats = [...DICECATS]
			let dieCat = "",
				dieId = 0
			do {
				dieCat = diceCats.pop()
				dieId = state[D.GAMENAME].Roller[dieCat].findIndex(v => v.id === args.id)
			} while (dieId === -1)
			Roller.Select(dieId, dieCat) // (dieNum, dieCat, dieVal, params)
		},
		wpReroll() {
			const stateVar = state[D.GAMENAME].Roller.selected,
				diceCats = [...DICECATS]
			let dieCat = ""
			do {
				dieCat = diceCats.pop()
				dieCat = stateVar[dieCat] && stateVar[dieCat].length > 0 ? dieCat : 0
			} while (dieCat === 0)
			Roller.Reroll(dieCat)
		},
		signalLight(args) {
			const [light] = findObjs({
				_type: "graphic",
				_id: args.id
			})
			if (!light)
				D.ThrowError(`No signal light found with id ${JSON.stringify(args.id)}.`)
			else if (light.get("imgsrc") === IMAGES.blank)
				light.set("imgsrc", IMAGES.signalLight)
			else
				light.set("imgsrc", IMAGES.blank)
		}
	}
	// #endregion

	// #region Pad Management
	const makePad = function (graphicObj, funcName, params = "height:0, width:0, x:0, y:0") {
			/* D.Alert(`PARAMS: ${D.JS(params)}`, "WIGGLEPADS: makePad()")
			D.Alert(`GRAPHIC: ${D.JS(graphicObj)}`, "WIGGLEPADS: makePad()")
			D.Alert(`GRAPHIC: ${D.JS(graphicObj.id)}`, "WIGGLEPADS: makePad()") */
			const options = {}
			let [pad, partnerPad] = [null, null]
			_.each(params.split(/,\s*?(?=\S)/gu),
				v => {
					[, options[v.split(/\s*?(?=\S):\s*?(?=\S)/gu)[0]]] = v.split(/\s*?(?=\S):\s*?(?=\S)/gu)
				})

			/* D.Alert(`DERIVED OPTIONS: ${JSON.stringify(options)}`, "WIGGLEPADS: makePad()")
			D.Alert(`HEIGHT: ${D.JSL(options.height)}, WIDTH: ${D.JSL(options.width)}, X: ${D.JSL(options.x)}, Y: ${D.JSL(options.y)}`) */
			pad = createObj("graphic", {
				name: `WP_${funcName}_${graphicObj.id}_1`,
				_pageid: graphicObj.get("_pageid"),
				imgsrc: IMAGES.blank,
				left: graphicObj.get("left") + parseInt(options.x ? options.x : 0),
				top: graphicObj.get("top") + parseInt(options.y ? options.y : 0),
				width: graphicObj.get("width") + parseInt(options.width),
				height: graphicObj.get("height") + parseInt(options.height ? options.height : 0),
				layer: "objects",
				isdrawing: true,
				controlledby: "all",
				showname: false
			})
			partnerPad = createObj("graphic", {
				name: `WP_${funcName}_${graphicObj.id}_2`,
				_pageid: graphicObj.get("_pageid"),
				imgsrc: IMAGES.blank,
				left: graphicObj.get("left") + parseInt(options.x ? options.x : 0),
				top: graphicObj.get("top") + parseInt(options.y ? options.y : 0),
				width: graphicObj.get("width") + parseInt(options.width ? options.width : 0),
				height: graphicObj.get("height") + parseInt(options.height ? options.height : 0),
				layer: "map",
				isdrawing: true,
				controlledby: "",
				showname: false
			})
			D.DB(`CREATED PAD: ${D.JSL(pad)}`)
			state[D.GAMENAME].DragPads.byPad[pad.id] = {
				id: graphicObj.id,
				funcName,
				left: pad.get("left"),
				top: pad.get("top"),
				width: pad.get("width"),
				height: pad.get("height"),
				deltaLeft: parseInt(options.x ? options.x : 0),
				deltaTop: parseInt(options.y ? options.y : 0),
				deltaHeight: parseInt(options.height ? options.height : 0),
				deltaWidth: parseInt(options.width ? options.width : 0),
				partnerID: partnerPad.id,
				active: "on"
			}
			state[D.GAMENAME].DragPads.byPad[partnerPad.id] = {
				id: graphicObj.id,
				funcName,
				left: partnerPad.get("left"),
				top: partnerPad.get("top"),
				width: partnerPad.get("width"),
				height: partnerPad.get("height"),
				deltaLeft: parseInt(options.x ? options.x : 0),
				deltaTop: parseInt(options.y ? options.y : 0),
				deltaHeight: parseInt(options.height ? options.height : 0),
				deltaWidth: parseInt(options.width ? options.width : 0),
				partnerID: pad.id,
				active: "off"
			}
			D.DB(`STATE ENTRIES: [BYPAD] ${D.JSL(state[D.GAMENAME].DragPads.byPad[pad.id] )}`, "WIGGLEPADS: makePad()", 2)

			state[D.GAMENAME].DragPads.byGraphic[graphicObj.id] = {
				id: pad.id,
				pad: state[D.GAMENAME].DragPads.byPad[pad.id],
				partnerPad: state[D.GAMENAME].DragPads.byPad[partnerPad.id]
			}
			D.DB(`.............: [BYGFX] ${D.JSL(state[D.GAMENAME].DragPads.byGraphic[graphicObj.id] )}`, "WIGGLEPADS: makePad()", 2)
			D.Alert(`Created Pad #${D.JS(_.values(state[D.GAMENAME].DragPads.byPad).length)} for function ${D.JS(funcName)}()`, "WIGGLEPADS: makePad()")

			return pad
		},

		removePad = obj => {
			if (D.IsObj(obj, "graphic")) {
				const pad = state[D.GAMENAME].DragPads.byGraphic[obj.id] ?
					getObj("graphic", state[D.GAMENAME].DragPads.byGraphic[obj.id].id) :
					state[D.GAMENAME].DragPads.byPad[obj.id] ?
					getObj("graphic", state[D.GAMENAME].DragPads.byPad[obj.id].id) :
					null
				if (D.IsObj(pad, "graphic")) {
					const graphicID = state[D.GAMENAME].DragPads.byPad[pad.id].id,
						partnerPad = getObj("graphic", state[D.GAMENAME].DragPads.byPad[pad.id].partnerID)
					delete state[D.GAMENAME].DragPads.byGraphic[graphicID]
					delete state[D.GAMENAME].DragPads.byPad[partnerPad.id]
					delete state[D.GAMENAME].DragPads.byPad[pad.id]
					pad.remove()
					if (D.IsObj(partnerPad, "graphic"))
						partnerPad.remove()
					D.Alert("Pads Removed", "WIGGLEPADS: RemovePad")
				} else {
					D.Alert(`Failed to Remove Pad for object ${D.JS(obj)}`)
				}
			} else {
				D.Alert(`No pad to remove for object ${D.JS(obj)}`)
			}
		},

		partnerPad = padID => {
			D.DB(`... Received ${D.JSL(padID)}`)
			const pad = getObj("graphic", padID),
				padData = state[D.GAMENAME].DragPads.byPad[padID],
				graphicObj = getObj("graphic", padData.id)

			/* D.DB(`Found object? ${D.JSL(pad)}`)
			D.DB(`Found data? ${D.JSL(padData)} And ID? ${D.JS(padData.id)}`)
			D.DB(`Found graphic? ${D.JSL(graphicObj)}`)*/
			if (graphicObj) {
				const pPad = makePad(
					getObj("graphic", padData.id),
					padData.funcName,
					`x:${padData.left}, y:${padData.top}, width:${padData.width}, height:${padData.height}`
				)
				pPad.set({
					layer: "gmlayer",
					controlledby: ""
				})
				padData.partnerID = pPad.id
				state[D.GAMENAME].DragPads.byPad[pPad.id].partnerID = padID

				return [pad, pPad]
			}
			delete state[D.GAMENAME].DragPads.byGraphic[padData.id]
			delete state[D.GAMENAME].DragPads.byPad[padID]

			return false
		},

		partnerAllPads = () => {
			const padIDs = [],
				testData = []
			for (const padID of _.keys(state[D.GAMENAME].DragPads.byPad))
				testData.push(`Pad ID: ${D.JSL(padID)}`)
			D.DB(`Pad ID Iteration: ${D.JSL(testData)}`)
			for (const padID of _.keys(state[D.GAMENAME].DragPads.byPad)) {
				D.DB(`Testing PadID ${D.JSL(padID)}`)
				if (!state[D.GAMENAME].DragPads.byPad[padID].partnerID) {
					padIDs.push(padID)
					D.DB(`... PASSED. ID = ${D.JSL(padID)}. Pad IDs Length = ${padIDs.length}`)
				}
			}
			for (const padID of padIDs) {
				D.DB(`Sent ${D.JSL(padID)} to partnerPad()`)
				partnerPad(padID)
			}
		},

		togglePad = function (padRef, isActive) {
			const padIDs = []
			if (state[D.GAMENAME].DragPads.byGraphic[padRef]) {
				padIDs.push(state[D.GAMENAME].DragPads.byGraphic[padRef].id)
			} else if (FUNCTIONS[padRef]) {
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
					pad.set({
						layer: isActive && state[D.GAMENAME].DragPads.byPad[pad.id].active === "on" ? "objects" : "map"
					})
					partner.set({
						layer: isActive && state[D.GAMENAME].DragPads.byPad[partner.id].active === "on" ? "objects" : "map"
					})
				}
			}

			return true
		},

		setPad = function (graphicId, params) {
			if (!state[D.GAMENAME].DragPads.byGraphic[graphicId])
				return D.ThrowError(`Bad graphic ID: '${D.JS(graphicId)}'; Can't set params: '${D.JS(params)}'`, "WIGGLEPADS: setPad()")
			const [pad] = findObjs({
				_id: state[D.GAMENAME].DragPads.byGraphic[graphicId].id
			})
			if (!pad)
				return D.ThrowError(`No pad found with ID: '${D.JS(graphicId)}'; Can't set params: '${D.JS(params)}'`, "WIGGLEPADS: setPad()")
			pad.set(params)

			return pad
		}
	// #endregion

	// #region Event Handlers
	const handleMove = function (obj) {
			if (obj.get("layer") === "gmlayer" || !state[D.GAMENAME].DragPads.byPad[obj.id])
				return false
			// toggle object
			obj.set({
				layer: "gmlayer",
				controlledby: ""
			})
			const objData = state[D.GAMENAME].DragPads.byPad[obj.id],
				partnerObj = getObj("graphic", objData.partnerID)
			obj.set({
				left: objData.left,
				top: objData.top
			})
			partnerObj.set({
				layer: "objects",
				controlledby: "all"
			})
			state[D.GAMENAME].DragPads.byPad[obj.id].active = "off"
			state[D.GAMENAME].DragPads.byPad[partnerObj.id].active = "on"
			// D.Alert(`Original Pad: ${D.JS(obj)}<br><br>Partner Pad: ${D.JS(partnerObj)}`)

			if (!FUNCTIONS[objData.funcName])
				return false
			FUNCTIONS[objData.funcName]({
				id: objData.id
			})
			// D.Alert(`Original Pad: ${D.JS(obj)}<br><br>Partner Pad: ${D.JS(partnerObj)}`)

			return true
		},

		handleInput = function (msg) {
			if (msg.type !== "api" || !playerIsGM(msg.playerid))
				return
			const args = msg.content.split(/\s+/u)
			let obj = [null],
				funcName = null
			switch (args.shift()) {
				case "!wpad":
					if (!msg.selected || !msg.selected[0]) {
						D.ThrowError("Select a graphic or text object first!")
					} else {
						[obj] = D.GetSelected(msg)
						D.Alert(`Object Retrieved: ${D.JS(obj)}; using args ${D.JS(args.join(", "))}`)
						makePad(obj, args.shift(), args.join(", ")) // Height:-28 width:-42 x:0 y:0
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
					})
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
					})
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
				case "!partnerpads":
					partnerAllPads()
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
							params = `height:${v.pad.deltaHeight || 0}, width:${v.pad.deltaWidth || 0}, x:${v.pad.deltaLeft || 0}, y:${v.pad.deltaTop || 0}`
						if (pad)
							pad.remove()
						state[D.GAMENAME].DragPads.byPad = _.omit(state[D.GAMENAME].DragPads.byPad, v.id)
						state[D.GAMENAME].DragPads.byPad = _.omit(state[D.GAMENAME].DragPads.byGraphic, padID)
						makePad(obj, v.pad.funcName, params)
					})
					D.Alert("Pads Reset!", "!resetpads")
					break
				case "!wpCLEAR":
					_.each(state[D.GAMENAME].DragPads.byGraphic, v => {
						obj = getObj("graphic", v.id)
						if (obj)
							obj.remove()
					})
					_.each(state[D.GAMENAME].DragPads.byPad, (v, padID) => {
						obj = getObj("graphic", padID)
						if (obj)
							obj.remove()
					})
					state[D.GAMENAME].DragPads = {
						byPad: {},
						byGraphic: {}
					}
					break
				default:
					break
			}
		}
	// #endregion

	// #region Public Functions
	const regHandlers = () => {
			on("chat:message", handleInput)
			on("change:graphic", handleMove)
		},

		checkInstall = () => {
			state[D.GAMENAME] = state[D.GAMENAME] || {}
			state[D.GAMENAME].DragPads = state[D.GAMENAME].DragPads || {
				byPad: {},
				byGraphic: {}
			}
		}
	// #endregion

	return {
		RegisterEventHandlers: regHandlers,
		CheckInstall: checkInstall,
		MakePad: makePad,
		Set: setPad,
		Toggle: togglePad,
		DelPad: removePad
	}
})()

on("ready", () => {
	DragPads.RegisterEventHandlers()
	DragPads.CheckInstall()
	D.Log("Ready!", "DragPads")
})