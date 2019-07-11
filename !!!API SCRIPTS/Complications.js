void MarkStart("Complications")
const Complications = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Complications",
        CHATCOMMAND = "!comp",
        GMONLY = true

    // #region COMMON INITIALIZATION
    const STATEREF = C.ROOT[SCRIPTNAME]	// eslint-disable-line no-unused-vars
    const VAL = (varList, funcName, isArray = false) => D.Validate(varList, funcName, SCRIPTNAME, isArray), // eslint-disable-line no-unused-vars
        DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        LOG = (msg, funcName) => D.Log(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        THROW = (msg, funcName, errObj) => D.ThrowError(msg, funcName, SCRIPTNAME, errObj) // eslint-disable-line no-unused-vars

    const checkInstall = () => {
            C.ROOT[SCRIPTNAME] = C.ROOT[SCRIPTNAME] || {}
            initialize()
        },
        regHandlers = () => {
            on("chat:message", msg => {
                const args = msg.content.split(/\s+/u)
                if (msg.type === "api" && (!GMONLY || playerIsGM(msg.playerid)) && (!CHATCOMMAND || args.shift() === CHATCOMMAND)) {
                    const who = msg.who || "API",
                        call = args.shift()
                    handleInput(msg, who, call, args)
                }
            })
            on("add:graphic", handleAdd)
        }
    // #endregion

    // #region LOCAL INITIALIZATION
    const initialize = () => {
        STATEREF.deckID = STATEREF.deckID || ""
        STATEREF.targetVal = STATEREF.targetVal || { id: "", value: 0 }
        STATEREF.currentVal = STATEREF.currentVal || { id: "", value: 0 }
        STATEREF.remainingVal = STATEREF.remainingVal || { id: "", value: 0 }
        STATEREF.zeroes = STATEREF.zeroes || []
        STATEREF.cardsDrawn = STATEREF.cardsDrawn || []
    }
    // #endregion
    let isRunning = false

    // #region EVENT HANDLERS: (HANDLEINPUT)
    const handleInput = (msg, who, call, args) => { 	// eslint-disable-line no-unused-vars
            const targetTextObj = getObj("text", STATEREF.targetVal.id) || null,
                currentTextObj = getObj("text", STATEREF.currentVal.id) || null,
                remainingTextObj = getObj("text", STATEREF.remainingVal.id) || null
            let [textObj, imgObj, cardVal, cardIndex] = [null, null, null, null]
            switch (call) {
                case "reg": case "regtext":
                    textObj = D.GetSelected(msg)[0]
                    if (!textObj)
                        D.Alert("Select a text object first!", "COMPLICATIONS: !comp reg")
                    else
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
                                STATEREF.zeroes[parseInt(args.shift()) - 1] = textObj.id
                                textObj.set("text", "")
                                break
                        // no default
                        }
                    break
                case "target":
                    STATEREF.targetVal.value = parseInt(args.shift() || 0)
                    targetTextObj.set("text", `${STATEREF.targetVal.value}`)
                    STATEREF.remainingVal.value = Math.max(0, STATEREF.targetVal.value - STATEREF.currentVal.value)
                    remainingTextObj.set("text", `${STATEREF.remainingVal.value}`)
                    break
                case "add": case "addval": case "addvalue":
                    STATEREF.currentVal.value += parseInt(args.shift() || 0)
                    STATEREF.remainingVal.value = Math.max(0, STATEREF.targetVal.value - STATEREF.currentVal.value)
                    currentTextObj.set("text", `${STATEREF.currentVal.value}`)
                    remainingTextObj.set("text", `${STATEREF.remainingVal.value}`)
                    break
                case "start":
                    isRunning = true
                    Media.Toggle("ComplicationMat", true, "base")
                    imgObj = Media.GetObj("ComplicationMat")
                    imgObj.set("layer", "objects")
                    getObj("deck", STATEREF.deckID).set("shown", true)
                    toFront(imgObj)
                    cardVal = args[0] && parseInt(args[0]) ? parseInt(args[0]) : 0
                    targetTextObj.set({
                        layer: "objects",
                        text: `${cardVal}`
                    })
                    currentTextObj.set({
                        layer: "objects",
                        text: "0"
                    })
                    remainingTextObj.set({
                        layer: "objects",
                        text: `${cardVal}`
                    })
                    toFront(targetTextObj)
                    toFront(currentTextObj)
                    toFront(remainingTextObj)
				/*D.Alert(`TARGET: ${D.JS(targetTextObj)}
			CURRENT: ${D.JS(currentTextObj)}
			REMAINING: ${D.JS(remainingTextObj)}`)*/
                    for (let i = 0; i < 10; i++)
                        getObj("text", STATEREF.zeroes[i]).set("layer", "objects")

                //getObj("text", STATEREF.targetVal.id).set("text", cardVal)
                    STATEREF.targetVal.value = cardVal
                //getObj("text", STATEREF.remainingVal.id).set("text", `${cardVal}`)
                    STATEREF.remainingVal.value = cardVal
                //getObj("text", STATEREF.currentVal.id).set("text", "0")
                    STATEREF.currentVal.value = 0
                    break
                case "end": case "stop":
                    isRunning = false
                    Media.Toggle("ComplicationMat", false)
                    imgObj = Media.GetObj("ComplicationMat")
                    imgObj.set("layer", "map")
                    getObj("deck", STATEREF.deckID).set("shown", false)
                    toBack(imgObj)
                    for (const textRef of ["targetVal", "currentVal", "remainingVal"]) {
                        getObj("text", STATEREF[textRef].id).set("layer", "map")
                        toBack(getObj("text", STATEREF[textRef].id))
                    }
                    for (let i = 0; i < 10; i++) {
                        getObj("text", STATEREF.zeroes[i]).set("layer", "map")
                        toBack(getObj("text", STATEREF.zeroes[i]))
                    }
            /* falls through */
                case "reset":
                    for (const cardData of STATEREF.cardsDrawn)
                        Media.Remove(cardData.id)

                    STATEREF.cardsDrawn = []
                    STATEREF.cardsDiscarded = []
                    for (const numRef of ["targetVal", "currentVal", "remainingVal"]) {
                        STATEREF[numRef].value = 0
                        getObj("text", STATEREF[numRef].id).set("text", "")
                    }
                    for (let i = 0; i < 10; i++)
                        getObj("text", STATEREF.zeroes[i]).set("text", "")

                    break
                case "draw":
                    imgObj = getObj("graphic", STATEREF.cardsDrawn[STATEREF.cardsDrawn.length - 1].id)
                    if (!imgObj) {
                        D.Alert("No image object found in STATEREF.cardsDrawn.", "COMPLICATIONS: !comp draw")
                    } else {
                        let cardVal = parseInt(args.shift() || 0)
                        STATEREF.cardsDrawn[STATEREF.cardsDrawn.length - 1].value = cardVal
                        STATEREF.currentVal.value += cardVal
                        STATEREF.remainingVal.value = Math.max(0, STATEREF.targetVal.value - STATEREF.currentVal.value)
                        getObj("text", STATEREF.currentVal.id).set("text", `${STATEREF.currentVal.value}`)
                        getObj("text", STATEREF.remainingVal.id).set("text", `${STATEREF.remainingVal.value}`)
                    }
                    break
                case "discard":
                    cardIndex = parseInt(args.shift()) - 1
                    imgObj = getObj("graphic", STATEREF.cardsDrawn[cardIndex].id)
                    cardVal = STATEREF.cardsDrawn[cardIndex].value
                //D.Alert(`Card Value is ${D.JS(cardVal)}`)
                    STATEREF.currentVal.value = Math.max(0, STATEREF.currentVal.value - cardVal)
                    STATEREF.remainingVal.value = Math.max(0, STATEREF.targetVal.value - STATEREF.currentVal.value)
                    getObj("text", STATEREF.currentVal.id).set("text", `${STATEREF.currentVal.value}`)
                    getObj("text", STATEREF.remainingVal.id).set("text", `${STATEREF.remainingVal.value}`)
                    STATEREF.cardsDrawn = _.reject(STATEREF.cardsDrawn, v => v.id === imgObj.id)
                    Media.Remove(imgObj.id)
                    for (let i = 0; i < STATEREF.cardsDrawn.length; i++) {
                        Media.SetArea(STATEREF.cardsDrawn[i].id, `ComplicationDraw${i + 1}`)
                        textObj = getObj("text", STATEREF.zeroes[i])
                        if (STATEREF.cardsDrawn[i].isZeroed) {
                            textObj.set({ layer: "objects", text: "0" })
                            toFront(textObj)
                        } else {
                            textObj.set({ layer: "map", text: "" })
                            toBack(textObj)
                        }
                    }
                    textObj = getObj("text", STATEREF.zeroes[STATEREF.cardsDrawn.length])
                    if (textObj) {
                        textObj.set({ layer: "map", text: "" })
                        toBack(textObj)
                    }
                    break
                case "zero": case "devalue":
                    cardIndex = parseInt(args.shift()) - 1,
                    textObj = getObj("text", STATEREF.zeroes[cardIndex]),
                    cardVal = STATEREF.cardsDrawn[cardIndex].value
                    STATEREF.currentVal.value = Math.max(0, STATEREF.currentVal.value - cardVal)
                    STATEREF.remainingVal.value = Math.min(STATEREF.targetVal.value, STATEREF.remainingVal.value + cardVal)
                    getObj("text", STATEREF.currentVal.id).set("text", `${STATEREF.currentVal.value}`)
                    getObj("text", STATEREF.remainingVal.id).set("text", `${STATEREF.remainingVal.value}`)
                    textObj.set({ layer: "objects", text: "██" })
                    toFront(textObj)
                    STATEREF.cardsDrawn[cardIndex].value = 0
                    break
            // no default
            }
        },
        handleAdd = obj => {
            if (isRunning) {
                STATEREF.cardsDrawn.push({ id: obj.id, value: 0 })
                Media.SetArea(obj.id, `ComplicationDraw${STATEREF.cardsDrawn.length}`)
                sendChat("COMPLICATION", `/w Storyteller <br/><div style='display: block; background: url(https://i.imgur.com/kBl8aTO.jpg); text-align: center; border: 4px ${C.COLORS.crimson} outset;'><br/><span style='display: block; font-size: 16px; text-align: center; width: 100%'>[0](!comp draw 0) [1](!comp draw 1) [2](!comp draw 2) [3](!comp draw 3) [4](!comp draw 4)</span><br/></div>`)
            }
        }
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    // #region GETTERS: Retrieving Notes, Data

    // #endregion

    // #region SETTERS:

    // #endregion

    return {
        RegisterEventHandlers: regHandlers,
        CheckInstall: checkInstall
    }
})()

on("ready", () => {
    Complications.RegisterEventHandlers()
    Complications.CheckInstall()
    D.Log("Complications Ready!")
})
void MarkStop("Complications")