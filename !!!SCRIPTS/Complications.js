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
                if (msg.type === "api" && (!GMONLY || playerIsGM(msg.playerid) || msg.playerid === "API") && (!CHATCOMMAND || args.shift() === CHATCOMMAND)) {
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
        STATEREF.cardsDrawn = STATEREF.cardsDrawn || []
        STATEREF.isRunning = STATEREF.isRunning || false

        delete STATEREF.zeroes

        

        

        //STATEREF.cardsDrawn = []
        //STATEREF.isRunning = false
    }
    // #endregion

    // #region EVENT HANDLERS: (HANDLEINPUT)
    const handleInput = (msg, who, call, args) => {
            switch (call) {
                case "target": case "add":
                    setCompVals(call, parseInt(args.shift() || 0))
                    break
                case "start":
                    startComplication(parseInt(args.shift() || 0))
                    break
                case "end": case "stop":
                    endComplication(args.shift() === "true")
                    break
            /* falls through */
                case "reset":
                    resetComplication()
                    break
                case "draw":
                    setCardValue(parseInt(args.shift()) || 0)
                    break
                case "discard": {
                    switch ((args[0] || "").toLowerCase()) {
                        case "1": case "2": case "3": case "4": case "5": case "6": case "7": case "8": case "9": case "10":
                            discardCard((parseInt(args.shift()) || 1) - 1)
                            break
                        default:
                            promptST("discard")
                            break
                    }
                    break
                }
                case "enhance": {
                    switch ((args[0] || "").toLowerCase()) {
                        case "1": case "2": case "3": case "4": case "5": case "6": case "7": case "8": case "9": case "10":
                            enhanceCard((parseInt(args.shift()) || 1) - 1)
                            break
                        default:
                            promptST("enhance")
                            break
                    }
                    break
                }
                case "zero": case "devalue": case "revalue":
                    switch ((args[0] || "").toLowerCase()) {
                        case "1": case "2": case "3": case "4": case "5": case "6": case "7": case "8": case "9": case "10":
                            if (args.length > 1)
                                revalueCard((parseInt(args.shift()) || 1) - 1, parseInt(args.shift()) || 0)
                            else
                                promptST("setrevalue", args[0])
                            break
                        default:
                            promptST("getrevalue")
                            break
                    }
                    break
                case "launchproject":
                    Char.LaunchProject(STATEREF.currentVal.value - STATEREF.targetVal.value, "COMPLICATION")
                    break
            // no default
            }
        },
        handleAdd = obj => {
            if (STATEREF.isRunning)
                drawCard(obj)
        }
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    // #region SETTERS: Setting card values, target numbers, activating Complication system
    const setCompVals = (mode, value) => {
            switch (mode) {
                case "target": {
                    STATEREF.targetVal.value = value
                    Media.SetText("complicationTarget", `${STATEREF.targetVal.value}`)
                    break
                }
                case "current": {
                    STATEREF.currentVal.value = 0
                } /* falls through */
                case "add": case "addVal": case "addValue": {
                    STATEREF.currentVal.value += value
                    Media.SetText("complicationCurrent", `${STATEREF.currentVal.value}`)
                    break
                }
                // no default
            }
            STATEREF.remainingVal.value = STATEREF.targetVal.value - STATEREF.currentVal.value
            Media.SetText("complicationRemaining", `${STATEREF.remainingVal.value <= 0 ? "+" : "-"}${Math.abs(STATEREF.remainingVal.value)}`)
            if (STATEREF.remainingVal.value <= 0) {
                Media.SetText("complicationCurrent", { color: C.COLORS.green})
                Media.SetText("complicationRemaining", { color: C.COLORS.green})
            } else {
                Media.SetText("complicationCurrent", { color: C.COLORS.brightred})
                Media.SetText("complicationRemaining", { color: C.COLORS.brightred})
            }
        },
        resetComplication = () => {
            for (const cardData of STATEREF.cardsDrawn)
                Media.Remove(cardData.id)
            STATEREF.cardsDrawn = []
            STATEREF.cardsDiscarded = []
            setCompVals("current", 0)
            setCompVals("target", 0)
            for (let i = 0; i < 10; i++) {
                Media.Set(`complicationZero_${i+1}`, "zero")
                Media.Toggle(`complicationZero_${i+1}`, false)
                Media.Toggle(`complicationEnhanced_${i+1}`, false)
            }
        },
        startComplication = startVal => {            
            STATEREF.isRunning = true
            Media.Toggle("ComplicationMat", true)
            for (const textRef of ["complicationTarget", "complicationCurrent", "complicationRemaining"])
                Media.ToggleText(textRef, true)
            getObj("deck", STATEREF.deckID).set("shown", true)
            setCompVals("current", 0)
            setCompVals("target", startVal)
        },
        endComplication = (isLaunchingProject) => {
            STATEREF.isRunning = false             
            resetComplication()
            Media.Toggle("ComplicationMat", false)
            for (const textRef of ["complicationTarget", "complicationCurrent", "complicationRemaining"])
                Media.ToggleText(textRef, false)
            for (let i = 0; i < 10; i++)
                Media.Toggle(`complicationZero_${i+1}`, false)
            getObj("deck", STATEREF.deckID).set("shown", false)
            if (isLaunchingProject)
                Char.LaunchProject(STATEREF.currentVal.value - STATEREF.targetVal.value, "COMPLICATION")   
        },
        promptST = (mode, paramString = "") => {
            let chatString = `/w Storyteller <br/><div style='
                display: block;
                background: url(https://i.imgur.com/kBl8aTO.jpg);
                text-align: center;
                border: 4px ${C.COLORS.crimson} outset;
                box-sizing: border-box;
                margin-left: -42px;
                width: 275px;
            '><br/><span style='
                display: block;
                font-size: 25px;
                text-align: center;
                width: 100%;
                font-family: Voltaire;
                color: ${C.COLORS.brightred};
                font-weight: bold;
            '>`
            switch(mode) {
                case "setvalue":
                    chatString += `Set Card Value:</span><br><span style='                    
                        display: block;
                        font-size: 16px;
                        text-align: center;
                        width: 100%
                    '>[0](!comp draw 0) [1](!comp draw 1) [2](!comp draw 2) [3](!comp draw 3) [4](!comp draw 4)</span><br/><span style='
                        display: block;
                        font-size: 16px;
                        text-align: center;
                        width: 100%
                    '>[Discard Last](!comp discard ${STATEREF.cardsDrawn.length})[Discard](!comp discard)<br>[Revalue Last](!comp revalue ${STATEREF.cardsDrawn.length})[Revalue](!comp revalue)<br>[Enhance Last](!comp enhance ${STATEREF.cardsDrawn.length})[Enhance](!comp enhance)`
                    break
                case "discard":
                    chatString += `Which Card:</span><br><span style='                    
                    display: block;
                    font-size: 16px;
                    text-align: center;
                    width: 100%
                '>[1](!comp discard 1) [2](!comp discard 2) [3](!comp discard 3) [4](!comp discard 4) [5](!comp discard 5)</span><br/><span style='
                    display: block;
                    font-size: 16px;
                    text-align: center;
                    width: 100%
                '>[6](!comp discard 6) [7](!comp discard 7) [8](!comp discard 8) [9](!comp discard 9) [10](!comp discard 10)`
                    break
                case "getrevalue":
                    chatString += `Which Card:</span><br><span style='                    
                        display: block;
                        font-size: 16px;
                        text-align: center;
                        width: 100%
                    '>[1](!comp revalue 1) [2](!comp revalue 2) [3](!comp revalue 3) [4](!comp revalue 4) [5](!comp revalue 5)</span><br/><span style='
                        display: block;
                        font-size: 16px;
                        text-align: center;
                        width: 100%
                    '>[6](!comp revalue 6) [7](!comp revalue 7) [8](!comp revalue 8) [9](!comp revalue 9) [10](!comp revalue 10)`
                    break
                case "setrevalue":
                    chatString += `Set Card Value:</span><br><span style='                    
                    display: block;
                    font-size: 16px;
                    text-align: center;
                    width: 100%
                '>[0](!comp revalue${paramString === "" ? "" : ` ${paramString}`} 0) [1](!comp revalue${paramString === "" ? "" : ` ${paramString}`} 1) [2](!comp revalue${paramString === "" ? "" : ` ${paramString}`} 2) [3](!comp revalue${paramString === "" ? "" : ` ${paramString}`} 3) [4](!comp revalue${paramString === "" ? "" : ` ${paramString}`} 4)`
                    break
                case "enhance":
                    chatString += `Which Card:</span><br><span style='                    
                        display: block;
                        font-size: 16px;
                        text-align: center;
                        width: 100%
                    '>[1](!comp enhance 1) [2](!comp enhance 2) [3](!comp enhance 3) [4](!comp enhance 4) [5](!comp enhance 5)</span><br/><span style='
                        display: block;
                        font-size: 16px;
                        text-align: center;
                        width: 100%
                    '>[6](!comp enhance 6) [7](!comp enhance 7) [8](!comp enhance 8) [9](!comp enhance 9) [10](!comp enhance 10)`
                    break

                // no default
            }
            chatString += "</span><br/></div>"
            sendChat("COMPLICATION", D.JSH(chatString))
        },
        drawCard = obj => {
            if (!Media.IsRegistered(obj)) {
                STATEREF.cardsDrawn.push({ id: obj.id, value: 0 })
                Media.SetArea(obj.id, `ComplicationDraw${STATEREF.cardsDrawn.length}`)
                promptST("setvalue")
            }
        },
        setCardValue = (value = 0) => {
            const imgObj = getObj("graphic", STATEREF.cardsDrawn[STATEREF.cardsDrawn.length - 1].id)
            if (!imgObj) {
                D.Alert("No image object found in STATEREF.cardsDrawn.", "COMPLICATIONS: !comp draw")
            } else {
                STATEREF.cardsDrawn[STATEREF.cardsDrawn.length - 1].value = value
                setCompVals("add", value)
            }
        },
        enhanceCard = (index = 0) => {
            Media.Toggle(`complicationEnhanced_${index + 1}`, true)
            toFront(Media.GetObj(`complicationEnhanced_${index + 1}`))
            STATEREF.cardsDrawn[index].isEnhanced = true
        },
        discardCard = (index = 0) => {
            if (index >= STATEREF.cardsDrawn.length)
                return THROW(`Index of ${D.JS(index)} exceeds number of cards drawn: ${D.JS(STATEREF.cardsDrawn, true)}`)
            const imgObj = getObj("graphic", STATEREF.cardsDrawn[index].id),
                cardVal = STATEREF.cardsDrawn[index].value
            setCompVals("add", -1 * cardVal)
            STATEREF.cardsDrawn = _.reject(STATEREF.cardsDrawn, v => v.id === imgObj.id)
            Media.Remove(imgObj.id)
            for (let i = 0; i < STATEREF.cardsDrawn.length; i++) {
                Media.SetArea(STATEREF.cardsDrawn[i].id, `ComplicationDraw${i + 1}`)
                if (STATEREF.cardsDrawn[i].isZeroed) {
                    Media.Toggle(`complicationZero_${i+1}`, true)
                    toFront(Media.GetObj(`complicationZero_${i+1}`))
                } else {
                    Media.Toggle(`complicationZero_${i+1}`, false)
                }
                if (STATEREF.cardsDrawn[i].isEnhanced) {
                    Media.Toggle(`complicationEnhanced_${i+1}`, true)
                    toFront(Media.GetObj(`complicationEnhanced_${i+1}`))
                } else {                    
                    Media.Toggle(`complicationEnhanced_${i+1}`, false)
                }
            }
            const endIndex = STATEREF.cardsDrawn.length
            Media.Toggle(`complicationZero_${endIndex + 1}`, false)
            Media.Toggle(`complicationEnhanced_${endIndex + 1}`, false)
            return true
        },
        revalueCard = (index = 0, value = 0) => {
            const cardVal = STATEREF.cardsDrawn[index].value
            setCompVals("add", value - cardVal)
            if (value === 0)
                Media.Toggle(`complicationZero_${index + 1}`, true)
            else
                Media.Toggle(`complicationZero_${index + 1}`, false)
            //Media.Set(`complicationZero_${index + 1}`, value)
            toFront(Media.GetObj(`complicationZero_${index + 1}`))
            toFront(Media.GetObj(`complicationEnhanced_${index + 1}`))
            STATEREF.cardsDrawn[index].value = value
            STATEREF.cardsDrawn[index].isZeroed = value === 0
        }
    

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