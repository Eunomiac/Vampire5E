void MarkStart("DragPads")
const DragPads = (() => {
// #region INITIALIZATION
    const SCRIPTNAME = "DragPads",
		    STATEREF = C.ROOT[SCRIPTNAME]	// eslint-disable-line no-unused-vars
    const VAL = (varList, funcName) => D.Validate(varList, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
		   DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME) // eslint-disable-line no-unused-vars
    // #endregion

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
            wpReroll () {
                const stateVar = C.ROOT.Roller.selected,
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
                else if (Images.GetSrc(light) === "off") 
                    Images.Set(light, "on")
                else 
                    Images.Set(light, "off")
            
            }
        },
        // #endregion

        // #region Pad Management
        getPad = padRef => {
            const pads = []
            if (D.IsObj(padRef)) 
                pads.push(getObj("graphic",
                                 C.ROOT.DragPads.byGraphic[padRef.id] ?
                                     C.ROOT.DragPads.byGraphic[padRef.id].id :
                                     C.ROOT.DragPads.byPad[padRef.id] ?
                                         padRef.id :
                                         null))
            else if (_.isString(padRef)) 
                if (FUNCTIONS[padRef] ) {
                    pads.push(
                        ..._.map(
                            _.keys(
                                _.omit(C.ROOT.DragPads.byPad, pData => {
                                    D.Log(`... pData: ${D.JS(pData)}`, "DRAGPADS: GET PAD")

                                    return pData.funcName !== padRef
                                } )
                            ),
                            pID => getObj("graphic", pID)
                        )
                    )
                } else {
                    pads.push(getObj("graphic", C.ROOT.DragPads.byGraphic[padRef] ?
                        C.ROOT.DragPads.byGraphic[padRef].id :
                        C.ROOT.DragPads.byPad[padRef] ?
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
                       } )
            else if (D.IsObj(params)) 
                Object.assign(options, params)
            else 
                return D.ThrowError(`Bad parameters: ${D.JS(params)}`, "DRAGPADS:MakePad")
          
              // D.Alert(`makePad Options: ${D.JS(options)}`, "DRAGPADS.MakePad")
            if (D.IsObj(graphicObj, "graphic")) {
                options._pageid = graphicObj.get("_pageid")
                options.left = options.left || graphicObj.get("left")
                options.top = options.top || graphicObj.get("top")
                options.width = options.width || graphicObj.get("width")
                options.height = options.height || graphicObj.get("height")
                if (options.startActive) 
                    options.layer = "objects"
            
            }
            if (!options.left || !options.top || !options.width || !options.height)
                return D.ThrowError(`Invalid Options: ${D.JS(options)}.<br><br>Must include reference object OR positions & dimensions to make pad.`, "DRAGPADS:MakePad")
            options._pageid = options._pageid || D.PAGEID()
            options.left += parseInt(options.deltaLeft || 0)
            options.top += parseInt(options.deltaTop || 0)
            options.width += parseInt(options.deltaWidth || 0)
            options.height += parseInt(options.deltaHeight || 0)
            delete options.deltaLeft
            delete options.deltaTop
            delete options.deltaWidth
            delete options.deltaHeight
            pad = Images.MakeImage(`${funcName}_Pad_#`, options, true)
            if (!graphicObj) 
                graphicObj = pad
          
            partnerPad = Images.MakeImage(`${funcName}_PartnerPad_#`, _.omit(options, ["startActive", "layer"]), true)
            C.ROOT.DragPads.byPad[pad.id] = {
                funcName,
                name: pad.get("name"),
                left: pad.get("left"),
                top: pad.get("top"),
                height: pad.get("height"),
                width: pad.get("width"),
                partnerID: partnerPad.id,
                active: "on"
            }
            C.ROOT.DragPads.byPad[partnerPad.id] = {
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
                C.ROOT.DragPads.byPad[pad.id].id = graphicObj.id
                C.ROOT.DragPads.byPad[partnerPad.id].id = graphicObj.id
                C.ROOT.DragPads.byGraphic[graphicObj.id] = {
                    id: pad.id,
                    pad: C.ROOT.DragPads.byPad[pad.id],
                    partnerPad: C.ROOT.DragPads.byPad[partnerPad.id]
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
                    if (C.ROOT.DragPads.byPad[pad.id] ) {
                        padData = C.ROOT.DragPads.byPad[pad.id]
                        Images.Remove(padData.name)
                        if (Images.GetData(pad.id))
                            Images.Remove(pad.id)
                        delete C.ROOT.DragPads.byGraphic[padData.id]
                        if (padData.partnerID) {
                            Images.Remove(padData.partnerID)
                            delete C.ROOT.DragPads.byPad[padData.partnerID]
                        }
                        delete C.ROOT.DragPads.byPad[pad.id]
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
            for (const pad of pads) 
                if (C.ROOT.DragPads.byPad[pad.id] )
                    removePad(pad.id)
                else
                    pad.remove()
          
            _.each(_.omit(C.ROOT.DragPads.byPad, v => v.funcName !== funcName), (val, key) => {
                delete C.ROOT.DragPads.byPad[key]
            } )
        },
        togglePad = (padRef, isActive) => {
            const padIDs = []
            if (C.ROOT.DragPads.byGraphic[padRef] ) 
                padIDs.push(C.ROOT.DragPads.byGraphic[padRef].id)
            else if (FUNCTIONS[padRef] ) 
                for (const padID of _.keys(C.ROOT.DragPads.byPad)) 
                    if (C.ROOT.DragPads.byPad[padID].funcName === padRef)
                        padIDs.push(padID)
            
                    else 
                        return D.ThrowError(`No pad found with ID: '${D.JS(padRef)}'`, "WIGGLEPADS: togglePad()")
          
            for (const pID of padIDs) {
                const [pad, partner] = [
                    getObj("graphic", pID),
                    getObj("graphic", C.ROOT.DragPads.byPad[pID].partnerID)
                ]
                if (D.IsObj(pad, "graphic") && D.IsObj(partner, "graphic")) {
                    pad.set( {
                        layer: isActive && C.ROOT.DragPads.byPad[pad.id].active === "on" ? "objects" : "map"
                    } )
                    partner.set( {
                        layer: isActive && C.ROOT.DragPads.byPad[partner.id].active === "on" ? "objects" : "map"
                    } )
                    toFront(pad)
                    toFront(partner)
                }
            }

            return true
        },
        // #endregion

        // #region Event Handlers
        handleMove = obj => {
            if (obj.get("layer") === "map" || !C.ROOT.DragPads.byPad[obj.id] )
                return false
              // toggle object
            obj.set( {
                layer: "map",
                controlledby: ""
            } )
            const objData = C.ROOT.DragPads.byPad[obj.id],
                partnerObj = getObj("graphic", objData.partnerID)
            obj.set( {
                left: objData.left,
                top: objData.top
            } )
            partnerObj.set( {
                layer: "objects",
                controlledby: "all"
            } )
            C.ROOT.DragPads.byPad[obj.id].active = "off"
            C.ROOT.DragPads.byPad[partnerObj.id].active = "on"
              // D.Alert(`Original Pad: ${D.JS(obj)}<br><br>Partner Pad: ${D.JS(partnerObj)}`)

            if (!FUNCTIONS[objData.funcName] )
                return false
            FUNCTIONS[objData.funcName]( {
                id: objData.id
            } )
              // D.Alert(`Original Pad: ${D.JS(obj)}<br><br>Partner Pad: ${D.JS(partnerObj)}`)
            toFront(obj)
            toFront(partnerObj)

            return true
        },
        handleInput = msg => {
            if (msg.type !== "api" || !playerIsGM(msg.playerid))
                return
            const args = msg.content.split(/\s+/u),
                padList = []
            let obj = {},
                [funcName, arg, contCheck, padName] = [null, null, true, ""]
            switch (args.shift()) {
                case "!dpad": // !dpad <funcName> [top:100 left:100 height:100 width:100 deltaHeight:-50 deltaWidth:-50 deltaTop:-50 deltaLeft:-50 startActive:true]
                    if (!msg.selected || !msg.selected[0] ) {
                        D.ThrowError("Select a graphic or text object first!")
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
                    _.each(C.ROOT.DragPads.byPad, (v, padID) => {
                        obj = getObj("graphic", padID)
                        if (obj && obj.get("name").toLowerCase().includes(padName)) {
                            obj.set("imgsrc", "https://s3.amazonaws.com/files.d20.io/images/64184544/CnzRwB8CwKGg-0jfjCkT6w/thumb.png?1538736404")
                            obj.set("layer", "gmlayer")
                        }
                    } )
                    break
                case "!showpads":
                    _.each(C.ROOT.DragPads.byPad, (v, padID) => {
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
                    _.each(C.ROOT.DragPads.byPad, (v, padID) => {
                        obj = getObj("graphic", padID)
                        if (obj) {
                            obj.set("imgsrc", IMAGES.blank)
                            if(
                                v.active === "on" &&
							(Images.GetData(v.name).startActive === true || Images.GetData(C.ROOT.DragPads.byPad[v.partnerID].name).startActive === true)
                            )
                                obj.set("layer", "objects")
                        } else {
                            D.ThrowError(`No pad with id '${D.JSL(padID)}'`, "!ShowPads")
                        }
                    } )
                    break
                case "!kill":
                    funcName = args.shift()
                    for (const padID of _.keys(C.ROOT.DragPads.byPad)) 
                        if (C.ROOT.DragPads.byPad[padID].funcName === funcName) {
                            obj = getObj("graphic", padID)
                            if (obj)
                                obj.remove()
                            delete C.ROOT.DragPads.byGraphic[C.ROOT.DragPads.byPad[padID].id]
                            delete C.ROOT.DragPads.byPad[padID]
                        }
              
                    break
                case "!resetpads":
                    _.each(C.ROOT.DragPads.byGraphic, (padData, hostID) => {
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
                            D.ThrowError(`No graphic with id '${D.JSL(hostID)}' for function '${D.JSL(padData.pad.funcName)}`, "!resetPads")
                            if (padObj)
                                Images.Remove(padObj)
                            if (partnerObj)
                                Images.Remove(partnerObj)
                            return
                        }
                        padList.push({
                            hostID: hostID,
                            funcName: padData.pad.funcName,
                            options: {
                                left: padData.left,
                                top: padData.top,
                                height: C.ROOT.DragPads.byPad[padData.id].height,
                                width: C.ROOT.DragPads.byPad[padData.id].width,
                                startActive: padData.pad.active === "on" || padData.partnerPad.active === "on"
                            }
                        })
                        if (padObj)
                            Images.Remove(padObj)
                        if (partnerObj)
                            Images.Remove(partnerObj)
                    } )
                    D.Alert(`<b>IMAGE NAMES AFTER PAD SEARCH:</b><br><br>${D.JS(_.keys(C.ROOT.Images.registry))}`)
                    delete C.ROOT.DragPads
                    C.ROOT.DragPads = {
                        byPad: {},
                        byGraphic: {}
                    }
                    _.each(C.ROOT.Images.registry, (imgData, imgName) => {
                        if (imgName.includes("Pad_"))
                            Images.Remove(imgName)
                    })
                    D.Alert(`<b>IMAGE NAMES AFTER REGISTRY SCAN:</b><br><br>${D.JS(_.keys(C.ROOT.Images.registry))}`)
                    _.each(padList, padData => {
                        const hostObj = getObj("graphic", padData.hostID) || getObj("text", padData.hostID)
                        makePad(hostObj, padData.funcName, padData.options)
                    })
                    D.Alert(`<b>IMAGE NAMES AFTER RESET:</b><br><br>${D.JS(_.keys(C.ROOT.Images.registry))}`)
                    D.Alert("Pads Reset!", "!resetpads")
                    break
                case "!listPads":
                    _.each(C.ROOT.DragPads.byGraphic, v => {
                        padList.push(v.pad.name)
                    })
                    D.Alert(D.JS(padList))
                    break
                case "!wpCLEAR":
                    arg = args.shift() || "all"
                    if (arg.toLowerCase() === "all") {
                        _.each(C.ROOT.DragPads.byGraphic, v => {
                            obj = getObj("graphic", v.id)
                            if (obj)
                                obj.remove()
                        } )
                        _.each(C.ROOT.DragPads.byPad, (v, padID) => {
                            obj = getObj("graphic", padID)
                            if (obj)
                                obj.remove()
                        } )
                        C.ROOT.DragPads = {
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
            C.ROOT = C.ROOT || {}
            C.ROOT.DragPads = C.ROOT.DragPads || {}
            C.ROOT.DragPads.byPad = C.ROOT.DragPads.byPad || {}
            C.ROOT.DragPads.byGraphic = C.ROOT.DragPads.byGraphic || {}
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
void MarkStop("DragPads")