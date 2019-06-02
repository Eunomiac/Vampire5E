void MarkStart("Complications")
const Complications = (() => {
	// #region Configuration
	const STATEREF = state[D.GAMENAME].Complications
	// #endregion

	// #region GETTERS: Retrieving Notes, Data
	
	// #endregion

	// #region SETTERS:
    
	// #endregion

	// #region Event Handlers (handleInput)
	const handleInput = msg => {
		if (msg.type !== "api" || !playerIsGM(msg.playerid) || !msg.content.startsWith("!comp"))
			return
		/* API chat command parameters can contain spaces, but multiple parameters must be comma-delimited.
                e.g. "!test subcommand1 subcommand2 param1 with spaces, param2,param3" */
		const [, command, ...args] = msg.content.split(/\s+/u)
		let [textObj, imgObj, cardVal, cardIndex] = [null, null, null, null]
		switch (command.toLowerCase()) {
		case "reg": case "regtext":				
			textObj = D.GetSelected(msg)
			if (!textObj) {
				D.Alert("Select a text object first!", "COMPLICATIONS: !comp reg")
			} else {
				switch (args.shift().toLowerCase()) {
				case "target": case "targetval":
					STATEREF.targetVal.id = textObj.id
					break
				case "current": case "currentval":
					STATEREF.currentVal.id = textObj.id
					break
				case "remaining": case "remainingval": case "remain":
					STATEREF.remainingVal.id = textObj.id
					break
				case "zero": case "devalue":
					STATEREF.zeroes[parseInt(args.shift())] = textObj.id
					textObj.set("text", "")
					break
				default: break
				}
			}
			break
		case "target":
			STATEREF.targetVal.value = parseInt(args.shift() || 0)
			getObj("text", STATEREF.targetVal.id).set("text", STATEREF.targetVal.value)
			break
		case "add": case "addval": case "addvalue":
			STATEREF.currentVal.value += parseInt(args.shift() || 0)
			STATEREF.remainingVal.value = Math.max(0, STATEREF.targetVal.value - STATEREF.currentVal.value)
			getObj("text", STATEREF.currentVal.id).set("text", STATEREF.targetVal.value)
			getObj("text", STATEREF.remainingVal.id).set("text", STATEREF.remainingVal.value)
			break
		case "start":
			Images.Toggle("ComplicationMat", "on")
			imgObj = Images.GetObj("ComplicationMat")
			imgObj.set("layer", "objects")
			toFront(imgObj)
			for (const textRef of ["targetVal", "currentVal", "remainingVal"]) {
				getObj("text", STATEREF[textRef].id).set("layer", "objects")
				toFront(getObj("text", STATEREF[textRef].id))
			}
			for (let i = 1; i <= 10; i++) {
				getObj("text", STATEREF.zeroes[i]).set("layer", "objects")
			}
			break
		case "end": case "stop":
			Images.Toggle("ComplicationMat", "off")
			imgObj = Images.GetObj("ComplicationMat")
			imgObj.set("layer", "map")
			toBack(imgObj)
			for (const textRef of ["targetVal", "currentVal", "remainingVal"]) {
				getObj("text", STATEREF[textRef].id).set("layer", "map")
				toBack(getObj("text", STATEREF[textRef].id))
			}
			for (let i = 1; i <= 10; i++) {
				getObj("text", STATEREF.zeroes[i]).set("layer", "map")
				toBack(getObj("text", STATEREF.zeroes[i]))
			}
			/* falls through */		
		case "reset":
			for (const cardData of [...STATEREF.cardsDrawn, ...STATEREF.cardsDiscarded]) {
				Images.Remove(cardData.id)
			}
			STATEREF.cardsDrawn = []
			STATEREF.cardsDiscarded = []
			for (const numRef of ["targetVal", "currentVal", "remainingVal"]) {
				STATEREF[numRef].value = 0
				getObj("text", STATEREF[numRef].id).set("text", "")
			}
			for (let i = 1; i <= 10; i++) {
				getObj("text", STATEREF.zeroes[i]).set("text", "")
			}
			break
		case "draw":
			imgObj = D.GetSelected(msg)
			if (!imgObj) {
				D.Alert("Select an image object first!", "COMPLICATIONS: !comp draw")
			} else {
				let cardVal = parseInt(args.shift() || 0)
				STATEREF.cardsDrawn.push({id: imgObj.id, value: cardVal})
				Images.SetArea(imgObj.id, `ComplicationDraw${STATEREF.cardsDrawn.length}`)
				STATEREF.currentVal.value += cardVal
				STATEREF.remainingVal.value = Math.max(0, STATEREF.targetVal.value - STATEREF.currentVal.value)
				getObj("text", STATEREF.currentVal.id).set("text", STATEREF.currentVal.value)
				getObj("text", STATEREF.remainingVal.id).set("text", STATEREF.remainingVal.value)
			}
			break
		case "discard":			
			cardIndex = parseInt(args.shift()) - 1
			imgObj = getObj("graphic", STATEREF.cardsDrawn[cardIndex].id)
			cardVal = STATEREF.cardsDrawn[cardIndex].value
			STATEREF.currentVal.value = Math.max(0, STATEREF.currentVal.value - cardVal)
			STATEREF.remainingVal.value = Math.min(STATEREF.targetVal.value, STATEREF.remainingVal.value + cardVal)
			getObj("text", STATEREF.currentVal.id).set("text", STATEREF.currentVal.value)
			getObj("text", STATEREF.remainingVal.id).set("text", STATEREF.remainingVal.value)
			STATEREF.cardsDrawn = _.reject(STATEREF.cardsDrawn, v => v.id === imgObj.id)
			Images.Remove(imgObj.id)
			for (let i = 0; i < STATEREF.cardsDrawn.length; i++) {
				Images.SetArea(STATEREF.cardsDrawn[i].id, `ComplicationDraw${i+1}`)
			}
			break
		case "zero": case "devalue":
			cardIndex = parseInt(args.shift()) - 1,
			textObj = getObj("text", STATEREF.zeroes[cardIndex]),
			cardVal = STATEREF.cardsDrawn[cardIndex].value
			STATEREF.currentVal.value = Math.max(0, STATEREF.currentVal.value - cardVal)
			STATEREF.remainingVal.value = Math.min(STATEREF.targetVal.value, STATEREF.remainingVal.value + cardVal)
			getObj("text", STATEREF.currentVal.id).set("text", STATEREF.currentVal.value)
			getObj("text", STATEREF.remainingVal.id).set("text", STATEREF.remainingVal.value)
			textObj.set({layer: "objects", text: "0"})
			toFront(textObj)
			break
		default: break
		}
	}
	// #endregion

	// #region Public Functions: regHandlers
	const regHandlers = () => {
			on("chat:message", handleInput)
		},
		checkInstall = () => {
			state[D.GAMENAME] = state[D.GAMENAME] || {}
			state[D.GAMENAME].Complications = state[D.GAMENAME].Complications || {}
			state[D.GAMENAME].Complications.targetVal = state[D.GAMENAME].Complications.targetVal || {}
			state[D.GAMENAME].Complications.currentVal = state[D.GAMENAME].Complications.currentVal || {}
			state[D.GAMENAME].Complications.remainingVal = state[D.GAMENAME].Complications.remainingVal || {}
			state[D.GAMENAME].Complications.zeroes = state[D.GAMENAME].Complications.zeroes || []
			state[D.GAMENAME].Complications.cardsDrawn = state[D.GAMENAME].Complications.cardsDrawn || []
		}
	// #endregion

	return {
		RegisterEventHandlers: regHandlers,
		CheckInstall: checkInstall
	}
} )()

on("ready", () => {
	Complications.RegisterEventHandlers()
	Complications.CheckInstall()
	D.Log("Ready!", "Complications")
} )
void MarkStop("Complications")