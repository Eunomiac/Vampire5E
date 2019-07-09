void MarkStart("DragPads")
const DragPads = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "DragPads",
        CHATCOMMAND = null,
        GMONLY = true

    // #region COMMON INITIALIZATION
    const STATEREF = C.ROOT[SCRIPTNAME]	// eslint-disable-line no-unused-vars
    const VAL = (varList, funcName) => D.Validate(varList, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
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
            on("change:graphic", handleMove)
        }
    // #endregion

    // #region LOCAL INITIALIZATION
    const initialize = () => {
        STATEREF.byPad = STATEREF.byPad || {}
        STATEREF.byGraphic = STATEREF.byGraphic || {}
    }
    // #endregion	

    // #region EVENT HANDLERS: (HANDLEINPUT)
    const handleInput = (msg, who, call, args) => { 	// eslint-disable-line no-unused-vars
            const padList = []
            let [obj, arg, padName, funcName] = [],
                contCheck = true
            switch (call) {
                case "!dpad": // !dpad <funcName> [top:100 left:100 height:100 width:100 deltaHeight:-50 deltaWidth:-50 deltaTop:-50 deltaLeft:-50 startActive:true]
                    if (!msg.selected || !msg.selected[0]) {
                        THROW("Select a graphic or text object first!", "!dpad")
                    } else {
                        [obj] = D.GetSelected(msg)
                        D.Alert(`Object Retrieved: ${D.JS(obj)}; using args ${D.JS(args.join(", "))}`)
                        makePad(obj, args.shift(), args.join(", ")) // deltaHeight:-28 width:-42 left:0 top:0
                    }
                    break
                case "!padson":
                    togglePad(args.shift(), true)
                    break
                case "!showpad":
                    padName = args.shift().toLowerCase()
                    _.each(STATEREF.byPad, (v, padID) => {
                        obj = getObj("graphic", padID)
                        if (obj && obj.get("name").toLowerCase().includes(padName)) {
                            obj.set("imgsrc", "https://s3.amazonaws.com/files.d20.io/images/64184544/CnzRwB8CwKGg-0jfjCkT6w/thumb.png?1538736404")
                            obj.set("layer", "gmlayer")
                        }
                    })
                    break
                case "!showpads":
                    _.each(STATEREF.byPad, (v, padID) => {
                        obj = getObj("graphic", padID)
                        if (obj) {
                            obj.set("imgsrc", "https://s3.amazonaws.com/files.d20.io/images/64184544/CnzRwB8CwKGg-0jfjCkT6w/thumb.png?1538736404")
                            obj.set("layer", "gmlayer")
                        } else {
                            THROW(`No pad with id '${D.JSL(padID)}'`, "!ShowPads")
                        }
                    })
                    break
                case "!hidepads":
                    _.each(STATEREF.byPad, (v, padID) => {
                        obj = getObj("graphic", padID)
                        if (obj) {
                            obj.set("imgsrc", IMAGES.blank)
                            if (
                                v.active === "on" &&
                            (Media.GetData(v.name).startActive === true || Media.GetData(STATEREF.byPad[v.partnerID].name).startActive === true)
                            )
                                obj.set("layer", "objects")
                        } else {
                            THROW(`No pad with id '${D.JSL(padID)}'`, "!ShowPads")
                        }
                    })
                    break
                case "!kill":
                    funcName = args.shift()
                    for (const padID of _.keys(STATEREF.byPad))
                        if (STATEREF.byPad[padID].funcName === funcName) {
                            obj = getObj("graphic", padID)
                            if (obj)
                                obj.remove()
                            delete STATEREF.byGraphic[STATEREF.byPad[padID].id]
                            delete STATEREF.byPad[padID]
                        }

                    break
                case "!resetpads":
                    _.each(STATEREF.byGraphic, (padData, hostID) => {
                        if (!contCheck)
                            return
                        const hostObj = getObj("graphic", hostID) || getObj("text", hostID),
                            padObj = getObj("graphic", padData.id),
                            partnerObj = getObj("graphic", padData.pad.partnerID)
                        if (padObj && !padObj.get("name").includes("Pad_") || partnerObj && !partnerObj.get("name").includes("PartnerPad_")) {
                            D.Alert(`ERROR FINDING PADS:<br><br>GRAPHIC ID: ${D.JSL(hostObj, true)}<br>PAD ID: ${D.JSL(padObj, true)}<br>PARTNER ID: ${D.JSL(partnerObj, true)}`)
                            contCheck = false
                            return
                        }
                        if (!hostObj) {
                            THROW(`No graphic with id '${D.JSL(hostID)}' for function '${D.JSL(padData.pad.funcName)}`, "!resetPads")
                            if (padObj)
                                Media.Remove(padObj)
                            if (partnerObj)
                                Media.Remove(partnerObj)
                            return
                        }
                        padList.push({
                            hostID: hostID,
                            funcName: padData.pad.funcName,
                            options: {
                                left: padData.left,
                                top: padData.top,
                                height: STATEREF.byPad[padData.id].height,
                                width: STATEREF.byPad[padData.id].width,
                                startActive: padData.pad.active === "on" || padData.partnerPad.active === "on"
                            }
                        })
                        if (padObj)
                            Media.Remove(padObj)
                        if (partnerObj)
                            Media.Remove(partnerObj)
                    })
                    D.Alert(`<b>IMAGE NAMES AFTER PAD SEARCH:</b><br><br>${D.JS(_.keys(C.ROOT.Media.imageregistry))}`)
                    delete C.ROOT.DragPads
                    C.ROOT.DragPads = {
                        byPad: {},
                        byGraphic: {}
                    }
                    _.each(C.ROOT.Media.imageregistry, (imgData, imgName) => {
                        if (imgName.includes("Pad_"))
                            Media.Remove(imgName)
                    })
                    D.Alert(`<b>IMAGE NAMES AFTER REGISTRY SCAN:</b><br><br>${D.JS(_.keys(C.ROOT.Media.imageregistry))}`)
                    _.each(padList, padData => {
                        const hostObj = getObj("graphic", padData.hostID) || getObj("text", padData.hostID)
                        makePad(hostObj, padData.funcName, padData.options)
                    })
                    D.Alert(`<b>IMAGE NAMES AFTER RESET:</b><br><br>${D.JS(_.keys(C.ROOT.Media.imageregistry))}`)
                    D.Alert("Pads Reset!", "!resetpads")
                    break
                case "!listPads":
                    _.each(STATEREF.byGraphic, v => {
                        padList.push(v.pad.name)
                    })
                    D.Alert(D.JS(padList))
                    break
                case "!wpCLEAR":
                    arg = args.shift() || "all"
                    if (arg.toLowerCase() === "all") {
                        _.each(STATEREF.byGraphic, v => {
                            obj = getObj("graphic", v.id)
                            if (obj)
                                obj.remove()
                        })
                        _.each(STATEREF.byPad, (v, padID) => {
                            obj = getObj("graphic", padID)
                            if (obj)
                                obj.remove()
                        })
                        C.ROOT.DragPads = {
                            byPad: {},
                            byGraphic: {}
                        }
                    } else {
                        clearAllPads(arg)
                    }
                    break
            // no default
            }
        },
        handleMove = obj => {
            if (obj.get("layer") === "map" || !STATEREF.byPad[obj.id])
                return false
            // toggle object
            obj.set({
                layer: "map",
                controlledby: ""
            })
            const objData = STATEREF.byPad[obj.id],
                partnerObj = getObj("graphic", objData.partnerID)
            obj.set({
                left: objData.left,
                top: objData.top
            })
            partnerObj.set({
                layer: "objects",
                controlledby: "all"
            })
            STATEREF.byPad[obj.id].active = "off"
            STATEREF.byPad[partnerObj.id].active = "on"
            // D.Alert(`Original Pad: ${D.JS(obj)}<br><br>Partner Pad: ${D.JS(partnerObj)}`)

            if (!FUNCTIONS[objData.funcName])
                return false
            FUNCTIONS[objData.funcName]({
                id: objData.id
            })
            // D.Alert(`Original Pad: ${D.JS(obj)}<br><br>Partner Pad: ${D.JS(partnerObj)}`)
            toFront(obj)
            toFront(partnerObj)

            return true
        }
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************
    // #region CONFIGURATION
    const IMAGES = {
            blank: "https://s3.amazonaws.com/files.d20.io/images/63990142/MQ_uNU12WcYYmLUMQcbh0w/thumb.png?1538455511",
            signalLight: "https://s3.amazonaws.com/files.d20.io/images/66320080/pUJEq-Vo-lx_-Nn16TvhYQ/thumb.png?1541372292" // 455 x 514
        },
        DICECATS = ["diceList", "bigDice"]
    // #endregion

    // #region PERSONAL FUNCTION SETTINGS
    /* CUSTOM PAD FUNCTIONS: Put functions linked by name to drag pads here.
   Each will be passed an object of form:
   {  id: <id of graphic object beneath> } */
    const FUNCTIONS = {
        selectDie(args) {
            const diceCats = [...DICECATS],
                idRef = args.id
            let dieCat = "",
                dieId = 0
            do {
                dieCat = diceCats.pop()
                dieId = C.ROOT.Roller[dieCat].findIndex(v => v.id === idRef)
            } while (dieId === -1)
            Roller.Select(dieId, dieCat) // (dieNum, dieCat, dieVal, params)
        },
        wpReroll() {
            const stateVar = C.ROOT.Roller.selected,
                diceCats = [...DICECATS]
            let dieCat = ""
            do {
                dieCat = diceCats.pop()
                dieCat = stateVar[dieCat] && stateVar[dieCat].length ? dieCat : 0
            } while (dieCat === 0)
            Roller.Reroll(dieCat)
        },
        signalLight(args) {
            const [light] = findObjs({
                _type: "graphic",
                _id: args.id
            })
            if (!light)
                THROW(`No signal light found with id ${JSON.stringify(args.id)}.`, "signalLight")
            else if (Media.GetSrc(light) === "off")
                Media.Set(light, "on")
            else
                Media.Set(light, "off")

        }
    }
    // #endregion

    // #region Pad Management
    const getPad = padRef => {
            const pads = []
            if (VAL({object: padRef}))
                pads.push(getObj("graphic",
                                 STATEREF.byGraphic[padRef.id] ?
                                     STATEREF.byGraphic[padRef.id].id :
                                     STATEREF.byPad[padRef.id] ?
                                         padRef.id :
                                         null))
            else if (_.isString(padRef))
                if (FUNCTIONS[padRef]) {
                    pads.push(
                        ..._.map(
                            _.keys(
                                _.omit(STATEREF.byPad, pData => {
                                    D.Log(`... pData: ${D.JS(pData)}`, "DRAGPADS: GET PAD")

                                    return pData.funcName !== padRef
                                })
                            ),
                            pID => getObj("graphic", pID)
                        )
                    )
                } else {
                    pads.push(getObj("graphic", STATEREF.byGraphic[padRef] ?
                        STATEREF.byGraphic[padRef].id :
                        STATEREF.byPad[padRef] ?
                            padRef :
                            null))
                }


        /* if (_.compact(pads).length > 1)
         D.Alert(`Found ${_.compact(pads).length} pads with padRef ${D.JS(padRef)}.`, "DRAGPADS: GET PAD") */

            return _.compact(pads)
        },
        getPads = padRef => {
            const pads = []
            if (_.isArray(padRef))
                for (const pRef of padRef)
                    pads.push(...getPad(pRef))
            else
                pads.push(...getPad(padRef))


            return pads
        },
        makePad = (graphicObj, funcName, params = "deltaTop:0, deltaLeft:0, deltaHeight:0, deltaWidth:0") => {
            const options = {
                controlledby: "all",
                layer: "gmlayer"
            }
            let [pad, partnerPad] = [null, null]
            if (_.isString(params))
                _.each(params.split(/,\s*?(?=\S)/gu),
                       v => {
                           let [key, value] = v.split(/\s*?(?=\S):\s*?(?=\S)/gu)
                           if (key.toLowerCase() === "startactive" && value !== "false")
                               options.startActive = true
                           else
                               options[key] = value
                       })
            else if (VAL({object: params}))
                Object.assign(options, params)
            else
                return THROW(`Bad parameters: ${D.JS(params)}`, "DRAGPADS:MakePad")

            // D.Alert(`makePad Options: ${D.JS(options)}`, "DRAGPADS.MakePad")
            if (VAL({graphicObj: graphicObj})) {
                options._pageid = graphicObj.get("_pageid")
                options.left = options.left || graphicObj.get("left")
                options.top = options.top || graphicObj.get("top")
                options.width = options.width || graphicObj.get("width")
                options.height = options.height || graphicObj.get("height")
                if (options.startActive)
                    options.layer = "objects"

            }
            if (!options.left || !options.top || !options.width || !options.height)
                return THROW(`Invalid Options: ${D.JS(options)}.<br><br>Must include reference object OR positions & dimensions to make pad.`, "DRAGPADS:MakePad")
            options._pageid = options._pageid || D.PAGEID()
            options.left += parseInt(options.deltaLeft || 0)
            options.top += parseInt(options.deltaTop || 0)
            options.width += parseInt(options.deltaWidth || 0)
            options.height += parseInt(options.deltaHeight || 0)
            delete options.deltaLeft
            delete options.deltaTop
            delete options.deltaWidth
            delete options.deltaHeight
            pad = Media.MakeImage(`${funcName}_Pad_#`, options, true)
            if (!graphicObj)
                graphicObj = pad

            partnerPad = Media.MakeImage(`${funcName}_PartnerPad_#`, _.omit(options, ["startActive", "layer"]), true)
            STATEREF.byPad[pad.id] = {
                funcName,
                name: pad.get("name"),
                left: pad.get("left"),
                top: pad.get("top"),
                height: pad.get("height"),
                width: pad.get("width"),
                partnerID: partnerPad.id,
                active: "on"
            }
            STATEREF.byPad[partnerPad.id] = {
                funcName,
                name: partnerPad.get("name"),
                left: partnerPad.get("left"),
                top: partnerPad.get("top"),
                height: partnerPad.get("height"),
                width: partnerPad.get("width"),
                partnerID: pad.id,
                active: "off"
            }
            if (VAL({graphicObj: graphicObj})) {
                STATEREF.byPad[pad.id].id = graphicObj.id
                STATEREF.byPad[partnerPad.id].id = graphicObj.id
                STATEREF.byGraphic[graphicObj.id] = {
                    id: pad.id,
                    pad: STATEREF.byPad[pad.id],
                    partnerPad: STATEREF.byPad[partnerPad.id]
                }
            }
            toFront(pad)

            return pad
        },
        removePad = padRef => {
            let padData = {}
            const pads = getPads(padRef)
            _.each(pads, pad => {
                try {
                    if (STATEREF.byPad[pad.id]) {
                        padData = STATEREF.byPad[pad.id]
                        Media.Remove(padData.name)
                        if (Media.GetData(pad.id))
                            Media.Remove(pad.id)
                        delete STATEREF.byGraphic[padData.id]
                        if (padData.partnerID) {
                            Media.Remove(padData.partnerID)
                            delete STATEREF.byPad[padData.partnerID]
                        }
                        delete STATEREF.byPad[pad.id]
                    }
                } catch (errObj) {
                    THROW(`PadObj: ${D.JS(pad)}<br>PadData: ${D.JS(padData)}<br><br>`, "removePad", errObj)
                }
            })
        },
        clearAllPads = funcName => {
            const graphics = findObjs({
                    _pageid: D.PAGEID(),
                    _type: "graphic",
                    imgsrc: IMAGES.blank
                }),
                pads = _.filter(graphics, v => v.get("name").includes(funcName))
            for (const pad of pads)
                if (STATEREF.byPad[pad.id])
                    removePad(pad.id)
                else
                    pad.remove()

            _.each(_.omit(STATEREF.byPad, v => v.funcName !== funcName), (val, key) => {
                delete STATEREF.byPad[key]
            })
        },
        togglePad = (padRef, isActive) => {
            DB(`PadRef: ${D.JS(padRef)}`, "togglePad")
            const padIDs = []
            if (STATEREF.byGraphic[padRef])
                padIDs.push(STATEREF.byGraphic[padRef].id)
            else if (FUNCTIONS[padRef])
                padIDs.push(..._.filter(_.keys(STATEREF.byPad), v => STATEREF.byPad[v].funcName === padRef))


            DB(`Pads Found: ${D.JS(_.map(padIDs, v => STATEREF.byPad[v].name))}`, "togglePad")
            if (padIDs.length === 0)
                return THROW(`No pad found with ID: '${D.JS(padRef)}'`, "DRAGPADS: togglePad()")

            for (const pID of padIDs) {
                const [pad, partner] = [
                    getObj("graphic", pID),
                    getObj("graphic", STATEREF.byPad[pID].partnerID)
                ]
                if (VAL({graphicObj: pad}) && VAL({graphicObj: partner})) {
                    pad.set({
                        layer: isActive && STATEREF.byPad[pad.id].active === "on" ? "objects" : "map"
                    })
                    partner.set({
                        layer: isActive && STATEREF.byPad[partner.id].active === "on" ? "objects" : "map"
                    })
                    toFront(pad)
                    toFront(partner)
                }
            }

            return true
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
})()

on("ready", () => {
    DragPads.RegisterEventHandlers()
    DragPads.CheckInstall()
    D.Log("DragPads Ready!")
})
void MarkStop("DragPads")