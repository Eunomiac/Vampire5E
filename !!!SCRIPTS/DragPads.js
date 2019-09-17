void MarkStart("DragPads")
const DragPads = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "DragPads",
        CHATCOMMAND = "!dpad",
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
            switch (call) {
                case "backup": {
                    STATEREF.backup = {
                        byPad: JSON.parse(JSON.stringify(STATEREF.byPad)),
                        byGraphic: JSON.parse(JSON.stringify(STATEREF.byGraphic))
                    }
                    D.Alert("Drag Pad Backup Updated.", "!dpad backup")
                    break
                }
                case "restore": {
                    STATEREF.byPad = JSON.parse(JSON.stringify(STATEREF.backup.byPad))
                    STATEREF.byGraphic = JSON.parse(JSON.stringify(STATEREF.backup.byGraphic))
                    D.Alert("Drag Pad Backup Restored.", "!dpad restore")
                    break
                }
                case "find": {
                    const funcName = args.shift(),
                        padData = _.filter(_.values(STATEREF.byPad), v => v.funcName === funcName),
                        padObjs = _.map(padData, v => getObj("graphic", v.partnerID)),
                        padLayer = _.map(padObjs, v => `${v.get("name")}: ${v.get("layer")}`)
                    D.Alert(`Pad Data:<br><br>${D.JS(padLayer)}`, "!dpad find")
                    break     
                }               
                case "make": { // !dpad <funcName> [top:100 left:100 height:100 width:100 deltaHeight:-50 deltaWidth:-50 deltaTop:-50 deltaLeft:-50 startActive:true]
                    const funcName = args.shift(),
                        hostObj = D.GetSelected(msg) && D.GetSelected(msg)[0] || Media.GetObj(args.shift())
                    if (VAL({graphicObj: hostObj}, "!dpad make")) {
                        D.Alert(`Host Object Retrieved: ${D.JS(hostObj.get("name"))}<br>Making Drag Pads...`, "!dpad make")
                        makePad(hostObj, funcName, args.join(", ")) // deltaHeight:-28 width:-42 left:0 top:0
                    }
                    break
                }
                case "on": case "off": {
                    togglePad(args.shift(), call === "on")
                    break
                }
                case "show": {
                    const padFilter = args.shift().toLowerCase()
                    _.each(STATEREF.byPad, (v, padID) => {
                        const padObj = getObj("graphic", padID)
                        if (padFilter === "all" || padObj && padObj.get("name").toLowerCase().includes(padFilter)) {                            
                            padObj.set("imgsrc", "https://s3.amazonaws.com/files.d20.io/images/64184544/CnzRwB8CwKGg-0jfjCkT6w/thumb.png?1538736404")
                            padObj.set("layer", "gmlayer")
                        }
                    })
                    break
                }
                case "hide": {
                    _.each(STATEREF.byPad, (v, padID) => {
                        const padObj = getObj("graphic", padID)
                        if (padObj) {
                            padObj.set("imgsrc", IMAGES.blank)
                            if (v.active === "on" &&
                                (Media.GetData(v.name).startActive === true || Media.GetData(STATEREF.byPad[v.partnerID].name).startActive === true))
                                padObj.set("layer", "objects")
                        }
                    })
                    break
                }
                case "kill": {
                    const funcName = args.shift(),
                        imgKeys = []
                    for (const padID of _.keys(STATEREF.byPad))
                        if (funcName === "all" || STATEREF.byPad[padID].funcName === funcName) {
                            const padObj = getObj("graphic", padID)
                            imgKeys.push(STATEREF.byPad[padID].name)
                            if (padObj)
                                padObj.remove()
                            delete STATEREF.byGraphic[STATEREF.byPad[padID].id]
                            delete STATEREF.byPad[padID]
                        }
                    for (const imgKey of imgKeys)
                        Media.Remove(imgKey)
                    break
                }
                case "reset": {
                    const [padObjs, padNames, padData, graphicList, reportStrings] = [[], [], [], [], []]
                    switch ((args[0] || "").toLowerCase()) {
                        default: {
                            _.each(STATEREF.byGraphic, (data, hostID) => {
                                const hostObj = getObj("graphic", hostID) || getObj("text", hostID),
                                    padObjPair = [getObj("graphic", data.id), getObj("graphic", data.pad.partnerID)]
                                padObjs.push([padObjPair[0] || null, padObjPair[1] || null, data.pad.funcName])
                                padNames.push([`${data.pad.name}${padObjPair[0] && "" || " -> MISSING!"}`, `${data.partnerPad.name}${padObjPair[1] && "" || " -> MISSING!"}`])
                                if (hostObj)
                                    padData.push({
                                        hostID: hostID,
                                        funcName: data.pad.funcName,
                                        options: {
                                            left: data.left,
                                            top: data.top,
                                            height: STATEREF.byPad[data.id].height,
                                            width: STATEREF.byPad[data.id].width,
                                            startActive: data.pad.active === "on" || data.partnerPad.active === "on"
                                        }
                                    })
                                else
                                    reportStrings.push(`'${Media.GetKey(hostID) || "&lt;UNREGISTERED&gt;"}' (${hostID}) for <b>${D.JSL(data.pad.name)}</b>`)
                            })
                            if (reportStrings.length)
                                reportStrings.unshift("<h3>Missing Graphic Objects</h3>")
                            reportStrings.unshift(...[
                                "<h3>Initial Image Registry</h3>",
                                ..._.keys(STATEREF.byGraphic).map(x => Media.GetKey(x) || Media.GetTextKey(x) || `MISSING: ${STATEREF.byGraphic[x].pad.name}`)
                            ])
                            reportStrings.push(`<h3>${padObjs.length} Pad Objects Found</h3>`)
                            reportStrings.push(...padObjs.map(x => `${
                                x[0] && STATEREF.byPad[x[0].id] && STATEREF.byPad[x[0].id].name ? 
                                    STATEREF.byPad[x[0].id].name :
                                    x[0] ? `(${x[0].get("name")})` : `(${D.JS(x[2])})`
                            }${
                                x[0] ? "" : ` <b>&lt;NO PAD</b> (${D.JS(x[0])})<b>&gt;</b>`
                            }${
                                x[1] ? "" : ` --> <b>&lt;NO PARTNER</b> (${D.JS(x[1])})<b>&gt;</b>`
                            }`))
                            _.each(Media.IMAGES, (imgData, imgName) => {
                                if (imgName.includes("Pad_") && !_.any(_.flatten(padNames), x => x.includes(imgName)))
                                    graphicList.push(imgName)
                            })
                            if (graphicList.length)
                                reportStrings.push(...[
                                    `<h3>${graphicList.length} Unconnected Pad Objects</h3>`,
                                    ...graphicList
                                ])
                            reportStrings.push("<b>!dpad reset confirm</b> to prune registries.")
                            D.Alert(reportStrings.join("<br>"), "!dpad reset")
                            break
                        }
                        case "confirm": {
                            STATEREF.byPad = {}
                            STATEREF.byGraphic = {}
                            _.each(_.flatten(padObjs), pad => {
                                if (Media.IsRegistered(pad))
                                    Media.Remove(pad, true)
                                pad.remove()
                            })
                            _.each(graphicList, padName => {
                                Media.Remove(padName, true)
                            })
                            _.each(padData, padData => {
                                const hostObj = getObj("graphic", padData.hostID) || getObj("text", padData.hostID)
                                makePad(hostObj, padData.funcName, padData.options)
                            })
                            D.Alert([
                                "<h3>Current Image Registry</h3>",
                                ..._.keys(Media.IMAGES)
                            ].join("<br>"), "!dpad reset confirm")
                            break
                        }
                    }
                    break                    
                }
                case "list": {
                    const padNames = []
                    _.each(STATEREF.byGraphic, v => {
                        padNames.push(v.pad.name)
                    })
                    D.Alert([
                        "<h3>Registered Drag Pads</h3>",
                        ...padNames
                    ].join("<br>"))
                    break
                }
            // no default
            }
        },
        handleMove = obj => {
            if (obj.get("layer") === "walls" || !STATEREF.byPad[obj.id])
                return false
            // toggle object
            obj.set({
                layer: "walls",
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
        },
        flipComp(card) {
            const slot = parseInt(Media.GetData(card.id).name.replace(/compCardSpot_/gu, "") || 0) - 1
            Complications.Flip(slot)
        },
        toggleMapLayer(mapButton) { // mapButtonRoads --> TorontoMapRoadsOverlay
            //D.Alert(D.JS(mapButton))
            //D.Alert(D.JS(Media.GetKey(mapButton.id)))
            const buttonKey = Media.GetKey(mapButton.id),
                buttonData = Media.GetData(buttonKey),
                mapLayerKey = buttonKey.replace(/mapButton(.*?)_1/gu, "TorontoMap$1Overlay"),
                mapLayerData = Media.GetData(mapLayerKey)
            let isActive
            //D.Alert(D.JS(buttonData))
            //D.Alert(D.JS(mapLayerKey))
            //D.Alert(D.JS(mapLayerData))
            if (mapLayerData.cycleSrcs && mapLayerData.cycleSrcs.length) {
                isActive = Media.Toggle(mapLayerKey, true)
                let srcIndex = Math.max(_.findIndex(mapLayerData.cycleSrcs, x => x === mapLayerData.curSrc), 0)
                //D.Alert(`Map Cycle Srcs: ${srcIndex}`)
                if (srcIndex === mapLayerData.cycleSrcs.length - 1)
                    srcIndex = 0
                else
                    srcIndex++
                Media.Set(mapLayerKey, mapLayerData.cycleSrcs[srcIndex])
            } else {
                isActive = Media.Toggle(mapLayerKey)
            }
            if (buttonData.cycleSrcs && buttonData.cycleSrcs.length) {
                let srcIndex = Math.max(_.findIndex(buttonData.cycleSrcs, x => x === buttonData.curSrc), 0)
                //D.Alert(`Button Cycle Srcs: ${srcIndex}`)
                if (srcIndex === buttonData.cycleSrcs.length - 1)
                    srcIndex = 0
                else
                    srcIndex++
                Media.Set(mapButton.id, buttonData.cycleSrcs[srcIndex])
            } else {
                Media.Set(mapButton.id, isActive && "on" || "off")
            }
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
                                    DB(`... pData: ${D.JS(pData)}`, "getPad")

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

/*
        mapButtonSitesCulture_1",
        "mapButtonSitesEducation_1",
        "mapButtonSitesHavens_1",
        "mapButtonSitesHealth_1",
        "mapButtonSitesLandmarks_1",
        "mapButtonSitesNightlife_1",
        "mapButtonSitesShopping_1",
        "mapButtonSitesTransportation_1",
*/

        makePad = (graphicObj, funcName, params = "deltaTop:0, deltaLeft:0, deltaHeight:0, deltaWidth:0") => {
            THROW(`Making Pad: ${graphicObj.get("name")}, ${funcName}, ${D.JSL(params)}`, "makePad")
            let options = {
                controlledby: "all",
                startActive: true
            }
            let [pad, partnerPad] = [null, null]
            if (_.isString(params))
                _.each(params.split(/,\s*?(?=\S)/gu),
                       v => {
                           let [key, value] = v.split(/\s*?(?=\S):\s*?(?=\S)/gu)
                           if (key.toLowerCase() === "startactive" && value === "false")
                               options.startActive = false
                           else
                               options[key] = value
                       })
            else 
                try {
                    options = Object.assign(options, params)
                } catch (errObj) {
                    return THROW(`Bad parameters: ${D.JS(params)}`, "makePad")
                }                

            // D.Alert(`makePad Options: ${D.JS(options)}`, "DRAGPADS.MakePad")
            if (VAL({graphicObj: graphicObj})) {
                options._pageid = graphicObj.get("_pageid")
                options.left = options.left || graphicObj.get("left")
                options.top = options.top || graphicObj.get("top")
                options.width = options.width || graphicObj.get("width")
                options.height = options.height || graphicObj.get("height")
                options.activeLayer = "objects"
                options.layer = options.startActive && "objects" || "walls"
            }
            if (!options.left || !options.top || !options.width || !options.height)
                return THROW(`Invalid Options: ${D.JS(options)}.<br><br>Must include reference object OR positions & dimensions to make pad.`, "makePad")
            options._pageid = options._pageid || D.PAGEID
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
            options.startActive = false
            options.layer = "walls"
            partnerPad = Media.MakeImage(`${funcName}_PartnerPad_#`, options, true)
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
                    _pageid: D.PAGEID,
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
            const padIDs = []
            //let dbString = `PadRef: ${D.JS(padRef)}`
            if (STATEREF.byGraphic[padRef])
                padIDs.push(STATEREF.byGraphic[padRef].id)
            else if (FUNCTIONS[padRef])
                padIDs.push(..._.filter(_.keys(STATEREF.byPad), v => STATEREF.byPad[v].funcName === padRef))
            //DB(`${dbString} ... Found: ${D.JSL(_.map(padIDs, v => STATEREF.byPad[v].name))}`)
            if (padIDs.length === 0)
                return THROW(`No pad found with ID: '${D.JS(padRef)}'`, "togglePad")

            for (const pID of padIDs) {
                const [pad, partner] = [
                    getObj("graphic", pID),
                    getObj("graphic", STATEREF.byPad[pID].partnerID)
                ]
                if (VAL({graphicObj: pad}) && VAL({graphicObj: partner})) {
                    pad.set({
                        layer: isActive && STATEREF.byPad[pad.id].active === "on" ? "objects" : "walls"
                    })
                    partner.set({
                        layer: isActive && STATEREF.byPad[partner.id].active === "on" ? "objects" : "walls"
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