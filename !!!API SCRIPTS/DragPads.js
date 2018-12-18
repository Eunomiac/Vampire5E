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
				D.Log(`It's an OBJECT: ${D.JS(padRef)}`, "DRAGPADS: GET PAD")
				pads.push(getObj("graphic",
					state[D.GAMENAME].DragPads.byGraphic[padRef.id] ?
						state[D.GAMENAME].DragPads.byGraphic[padRef.id].id :
						state[D.GAMENAME].DragPads.byPad[padRef.id] ?
							padRef.id :
							null))
				D.Log(`PADS: ${D.JS(pads)}`)
			} else if (_.isString(padRef)) {
				if (FUNCTIONS[padRef] ) {
					D.Log(`It's a FUNCTION: ${D.JS(padRef)}`, "DRAGPADS: GET PAD")
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
					D.Log(`PADS: ${D.JS(pads)}`)
				} else {
					D.Log(`It's a STRING (ID): ${D.JS(padRef)}`, "DRAGPADS: GET PAD")
					pads.push(getObj("graphic", state[D.GAMENAME].DragPads.byGraphic[padRef] ?
						state[D.GAMENAME].DragPads.byGraphic[padRef].id :
						state[D.GAMENAME].DragPads.byPad[padRef] ?
							padRef :
							null))
					D.Log(`PADS: ${D.JS(pads)}`)
				}
			}
			//if (_.compact(pads).length > 1)
				//D.Alert(`Found ${_.compact(pads).length} pads with padRef ${D.JS(padRef)}.`, "DRAGPADS: GET PAD")

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
		makePad = (graphicObj, funcName, params = "height:0, width:0, left:0, top:0") => {
			/* D.Alert(`PARAMS: ${D.JS(params)}`, "WIGGLEPADS: makePad()")
					D.Alert(`GRAPHIC: ${D.JS(graphicObj)}`, "WIGGLEPADS: makePad()")
					D.Alert(`GRAPHIC: ${D.JS(graphicObj.id)}`, "WIGGLEPADS: makePad()") */
			const isGraphicObj = D.IsObj(graphicObj, "graphic"),
				imgName = {
					pad: `${funcName}_Pad_${
						_.filter(_.map(_.values(state[D.GAMENAME].DragPads.byPad), v => v.funcName), v => funcName === v.funcName).length + 1
					}`
				}
			imgName.partner = imgName.pad.replace("Pad", "PartnerPad")
			let [refObj, pad, partnerPad] = [null, null, null],
				options = {}
			if (_.isString(params)) {
				_.each(params.split(/,\s*?(?=\S)/gu),
					v => {
						[, options[v.split(/\s*?(?=\S):\s*?(?=\S)/gu)[0]]] = v.split(/\s*?(?=\S):\s*?(?=\S)/gu)
					} )
			} else {
				options = params
			}

			/* D.Alert(`DERIVED OPTIONS: ${JSON.stringify(options)}`, "WIGGLEPADS: makePad()")
					D.Alert(`HEIGHT: ${D.JSL(options.height)}, WIDTH: ${D.JSL(options.width)}, LEFT: ${D.JSL(options.left)}, TOP: ${D.JSL(options.top)}`) */
			if (isGraphicObj) {
				refObj = graphicObj
				options.gID = graphicObj.id
			} else {
				refObj = Images.MakeImage("DP_TempRef_#", {
					left: parseInt(options.left),
					top: parseInt(options.top),
					width: parseInt(options.width),
					height: parseInt(options.height),
					layer: "gmlayer"
				} )
				options.left = 0
				options.top = 0
				options.height = 0
				options.width = 0
				options.gID = 0
			}
			pad = Images.MakeImage(imgName.pad, {
				_pageid: refObj.get("_pageid"),
				left: refObj.get("left") + parseInt(options.left || 0),
				top: refObj.get("top") + parseInt(options.top || 0),
				width: refObj.get("width") + parseInt(options.width || 0),
				height: refObj.get("height") + parseInt(options.height || 0),
				controlledby: "all"
			} )
			partnerPad = Images.MakeImage(imgName.partner, {
				_pageid: refObj.get("_pageid"),
				left: refObj.get("left") + parseInt(options.left || 0),
				top: refObj.get("top") + parseInt(options.top || 0),
				width: refObj.get("width") + parseInt(options.width || 0),
				height: refObj.get("height") + parseInt(options.height || 0),
				layer: "map"
			} )
			D.DB(`CREATED PAD: ${D.JSL(pad)}`)
			state[D.GAMENAME].DragPads.byPad[pad.id] = {
				id: options.gID,
				funcName,
				name: imgName.pad,
				left: pad.get("left"),
				top: pad.get("top"),
				width: pad.get("width"),
				height: pad.get("height"),
				deltaLeft: parseInt(options.left || 0),
				deltaTop: parseInt(options.top || 0),
				deltaHeight: parseInt(options.height || 0),
				deltaWidth: parseInt(options.width || 0),
				partnerID: partnerPad.id,
				active: "on"
			}
			state[D.GAMENAME].DragPads.byPad[partnerPad.id] = {
				id: options.gID,
				funcName,
				name: imgName.partner,
				left: partnerPad.get("left"),
				top: partnerPad.get("top"),
				width: partnerPad.get("width"),
				height: partnerPad.get("height"),
				deltaLeft: parseInt(options.left || 0),
				deltaTop: parseInt(options.top || 0),
				deltaHeight: parseInt(options.height || 0),
				deltaWidth: parseInt(options.width || 0),
				partnerID: pad.id,
				active: "off"
			}
			D.DB(`STATE ENTRIES: [BYPAD] ${D.JSL(state[D.GAMENAME].DragPads.byPad[pad.id] )}`, "WIGGLEPADS: makePad()", 2)

			if (isGraphicObj) {
				state[D.GAMENAME].DragPads.byGraphic[refObj.id] = {
					id: pad.id,
					pad: state[D.GAMENAME].DragPads.byPad[pad.id],
					partnerPad: state[D.GAMENAME].DragPads.byPad[partnerPad.id]
				}
				D.DB(`.............: [BYGFX] ${D.JSL(state[D.GAMENAME].DragPads.byGraphic[refObj.id] )}`, "WIGGLEPADS: makePad()", 2)
			}

			return pad
		},
		removePad = padRef => {
			let [padData, partner] = [{}, {}]
			const pads = getPads(padRef)
			//if (_.isString(padRef) && _.keys(FUNCTIONS).includes(padRef.slice(0, padRef.indexOf("_"))))
				//D.Alert(`Removing ${D.JS(padRef)}.<br>${pads.length} Pads Received:<br> ${D.JS(_.map(pads, v => v.get("name")))} `, "DRAGPADS: REMOVEPAD")

			/* _.each(_.compact(pads), pad => {
						try {
							if (pad) {
								if (state[D.GAMENAME].DragPads.byPad[pad.id] ) {
									padData = state[D.GAMENAME].DragPads.byPad[pad.id]
									Images.Remove(padData.hostName)
									if (state[D.GAMENAME].DragPads.byGraphic[padData.id] )
										delete state[D.GAMENAME].DragPads.byGraphic[padData.id]
									if (padData.partnerID) {
										partner = getObj("graphic", padData.partnerID)
										Images.Remove(state[D.GAMENAME].DragPads.byPad[partner.id].hostName)
										delete state[D.GAMENAME].DragPads.byPad[partner.id]
										partner.remove()
									}
									delete state[D.GAMENAME].DragPads.byPad[pad.id]
								}
								pad.remove()
							}
						} catch (errObj) {
							D.ThrowError(`PadObj: ${D.JS(pad)}<br>PadData: ${D.JS(padData)}<br><br>`, "DRAGPADS.removePad", errObj)
						}
					} ) */
			_.each(pads, pad => {
				try {
					if (state[D.GAMENAME].DragPads.byPad[pad.id] ) {
						padData = state[D.GAMENAME].DragPads.byPad[pad.id]
						Images.Remove(padData.name)
						if (state[D.GAMENAME].DragPads.byGraphic[padData.id] )
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
			} )
			D.Alert(`${graphics.length} Blank Graphic Names:<br>${D.JS(_.map(graphics, v => v.get("name")))}`, "CLEARING PADS")
			const pads = _.filter(graphics, v => v.get("name").includes(funcName))
			D.Alert(`${pads.length} Graphics For ${funcName}:<br>${D.JS(_.map(pads, v => v.get("name")))}`, "CLEARING PADS")
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
		partnerPad = padID => {
			const pad = getObj("graphic", padID),
				padData = state[D.GAMENAME].DragPads.byPad[padID],
				graphicObj = getObj("graphic", padData.id)
			if (graphicObj) {
				const pPad = makePad(
					getObj("graphic", padData.id),
					padData.funcName, {
						left: padData.left,
						top: padData.top,
						width: padData.width,
						height: padData.height,
						layer: "gmlayer",
						controlledby: "",
						name: `DP_PartnerPad_${padData.funcName}_${padID}`
					}
				)
				pPad.set( {
					layer: "gmlayer",
					controlledby: ""
				} )
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
		setPad = (graphicId, params) => {
			if (!state[D.GAMENAME].DragPads.byGraphic[graphicId] )
				return D.ThrowError(`Bad graphic ID: '${D.JS(graphicId)}'; Can't set params: '${D.JS(params)}'`, "WIGGLEPADS: setPad()")
			const [pad] = findObjs( {
				_id: state[D.GAMENAME].DragPads.byGraphic[graphicId].id
			} )
			if (!pad)
				return D.ThrowError(`No pad found with ID: '${D.JS(graphicId)}'; Can't set params: '${D.JS(params)}'`, "WIGGLEPADS: setPad()")
			pad.set(params)

			return pad
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
			let obj = [null],
				funcName = null
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
				const arg = args.shift()
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
		Set: setPad,
		Toggle: togglePad,
		DelPad: removePad
	}
} )()

on("ready", () => {
	DragPads.RegisterEventHandlers()
	DragPads.CheckInstall()
	D.Log("Ready!", "DragPads")
} )