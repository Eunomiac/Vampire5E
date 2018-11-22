const WigglePads = (() => {
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
				Roller.Select(dieId, dieCat)   // (dieNum, dieCat, dieVal, params)
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
				const [light] = findObjs( {_type: "graphic", _id: args.id} )
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
		makePad = function (obj, name, params = "height:0 width:0 x:0 y:0") {
			D.DB(`PARAMS: ${D.JSL(params)}`, "WIGGLEPADS: makePad()", 2)
			const options = {}
			let pad = null
			_.each(params.split(" "), v => { [, options[v.split(":")[0]]] = v.split(":") } )
			D.DB(`DERIVED OPTIONS: ${D.JSL(options)}`, "WIGGLEPADS: makePad()", 2)
			pad = createObj("graphic", {
				name: `WP_${name}_${obj.id}`,
				_pageid: obj.get("_pageid"),
				imgsrc: IMAGES.blank,
				left: obj.get("left") + parseInt(options.x ? options.x : 0),
				top: obj.get("top") + parseInt(options.y ? options.y : 0),
				width: obj.get("width") + parseInt(options.width ? options.width : 0),
				height: obj.get("height") + parseInt(options.height ? options.height : 0),
				layer: "objects",
				isdrawing: true,
				controlledby: "all",
				showname: false
			} )
			state[D.GAMENAME].WigglePads.byPad[pad.id] = {
				id: obj.id,
				funcName: name,
				left: pad.get("left"),
				top: pad.get("top"),
				width: pad.get("width"),
				height: pad.get("height"),
				deltaLeft: parseInt(options.x ? options.x : 0),
				deltaTop: parseInt(options.y ? options.y : 0),
				deltaHeight: parseInt(options.height ? options.height : 0),
				deltaWidth: parseInt(options.width ? options.width : 0)
			}
			D.DB(`STATE ENTRIES: [BYPAD] ${D.JSL(state[D.GAMENAME].WigglePads.byPad[pad.id] )}`, "WIGGLEPADS: makePad()", 2)
			state[D.GAMENAME].WigglePads.byGraphic[obj.id] = {
				id: pad.id,
				pad: state[D.GAMENAME].WigglePads.byPad[pad.id]
			}
			D.DB(`.............: [BYGFX] ${D.JSL(state[D.GAMENAME].WigglePads.byGraphic[obj.id] )}`, "WIGGLEPADS: makePad()", 2)
			D.Alert(`Created Pad #${D.JS(_.values(state[D.GAMENAME].WigglePads.byPad).length)} for function ${D.JS(name)}()`, "WIGGLEPADS: makePad()")
		},

		setPad = function (graphicId, params) {
			if (!state[D.GAMENAME].WigglePads.byGraphic[graphicId] )
				return D.ThrowError(`Bad graphic ID: '${D.JS(graphicId)}'; Can't set params: '${D.JS(params)}'`, "WIGGLEPADS: setPad()")
			const [pad] = findObjs( {_id: state[D.GAMENAME].WigglePads.byGraphic[graphicId].id} )
			if (!pad)
				return D.ThrowError(`No pad found with ID: '${D.JS(graphicId)}'; Can't set params: '${D.JS(params)}'`, "WIGGLEPADS: setPad()")
			pad.set(params)

			return pad
		},
		// #endregion

		// #region Event Handlers
		handleMove = function (obj) {
			if (obj.get("layer") === "gmlayer" || !state[D.GAMENAME].WigglePads.byPad[obj.id] )
				return false
			obj.set( {layer: "gmlayer"} )
			const objData = state[D.GAMENAME].WigglePads.byPad[obj.id]
			obj.set( {left: objData.left, top: objData.top} )
			if (!FUNCTIONS[objData.funcName] )
				return false
			FUNCTIONS[objData.funcName]( {id: objData.id} )
			obj.set( {layer: "objects"} )

			return true
		},

		handleInput = function (msg) {
			if (msg.type !== "api" || !playerIsGM(msg.playerid))
				return
			const args = msg.content.split(/\s+/u)
			let obj = [null]
			switch (args.shift()) {
			case "!wpad":
				if (!msg.selected || !msg.selected[0] ) {
					D.ThrowError("Select a graphic or text object first!")
				} else {
					[obj] = findObjs( {_id: msg.selected[0]._id} )
					makePad(obj, args.shift(), args.join(" "))  // Height:-28 width:-42 x:0 y:0
				}
				break
			case "!showpads":
				_.each(state[D.GAMENAME].WigglePads.byPad, (v, padID) => {
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
				_.each(state[D.GAMENAME].WigglePads.byPad, (v, padID) => {
					obj = getObj("graphic", padID)
					if (obj) {
						obj.set("imgsrc", IMAGES.blank)
						obj.set("layer", "objects")
					} else {
						D.ThrowError(`No pad with id '${D.JSL(padID)}'`, "!ShowPads")
					}
				} )
				break
			case "!resetpads":
				_.each(state[D.GAMENAME].WigglePads.byGraphic, (v, padID) => {
					obj = getObj("graphic", padID) || getObj("text", padID)
					if (!obj) {
						D.ThrowError(`No graphic with id '${D.JSL(padID)}' for function '${D.JSL(v.pad.funcName)}`, "!resetPads")
						state[D.GAMENAME].WigglePads.byPad = _.omit(state[D.GAMENAME].WigglePads.byPad, v.id)
						state[D.GAMENAME].WigglePads.byPad = _.omit(state[D.GAMENAME].WigglePads.byGraphic, padID)

						return
					}
					const pad = getObj("graphic", v.id),
						params = `height:${v.pad.deltaHeight || 0} width:${v.pad.deltaWidth || 0} x:${v.pad.deltaLeft || 0} y:${v.pad.deltaTop || 0}`
					if (pad)
						pad.remove()
					state[D.GAMENAME].WigglePads.byPad = _.omit(state[D.GAMENAME].WigglePads.byPad, v.id)
					state[D.GAMENAME].WigglePads.byPad = _.omit(state[D.GAMENAME].WigglePads.byGraphic, padID)
					makePad(obj, v.pad.funcName, params)
				} )
				D.Alert("Pads Reset!", "!resetpads")
				break
			case "!wpCLEAR":
				_.each(state[D.GAMENAME].WigglePads.byGraphic, v => {
					obj = getObj("graphic", v.id)
					if (obj)
						obj.remove()
				} )
				_.each(state[D.GAMENAME].WigglePads.byPad, (v, padID) => {
					obj = getObj("graphic", padID)
					if (obj)
						obj.remove()
				} )
				state[D.GAMENAME].WigglePads = {byPad: {}, byGraphic: {} }
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
			state[D.GAMENAME].WigglePads = state[D.GAMENAME].WigglePads || {byPad: {}, byGraphic: {} }
		}
		// #endregion

	return {
		RegisterEventHandlers: regHandlers,
		CheckInstall: checkInstall,
		MakePad: makePad,
		Set: setPad
	}
} )()

on("ready", () => {
	WigglePads.RegisterEventHandlers()
	WigglePads.CheckInstall()
	D.Log("Ready!", "WigglePads")
} )