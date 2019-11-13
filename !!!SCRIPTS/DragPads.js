void MarkStart("DragPads")
const DragPads = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "DragPads",

    // #region COMMON INITIALIZATION
        STATE = {get REF() { return C.RO.OT[SCRIPTNAME] }},	// eslint-disable-line no-unused-vars
        VAL = (varList, funcName, isArray = false) => D.Validate(varList, funcName, SCRIPTNAME, isArray), // eslint-disable-line no-unused-vars
        DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        LOG = (msg, funcName) => D.Log(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        THROW = (msg, funcName, errObj) => D.ThrowError(msg, funcName, SCRIPTNAME, errObj), // eslint-disable-line no-unused-vars

        checkInstall = () => {
            C.RO.OT[SCRIPTNAME] = C.RO.OT[SCRIPTNAME] || {}
            initialize()
        },
    // #endregion

    // #region LOCAL INITIALIZATION
        initialize = () => {
            STATE.REF.byPad = STATE.REF.byPad || {}
            STATE.REF.byGraphic = STATE.REF.byGraphic || {}

            for (const imgID of _.keys(STATE.REF.byGraphic)) {
                const imgObj = getObj("graphic", imgID),
                    imgKey = Media.GetImgKey(imgObj)
                if (VAL({string: imgKey}, "DP INIT")) {
                    Media.IMAGES[imgKey].padID = STATE.REF.byGraphic[imgID].id
                    Media.IMAGES[imgKey].partnerID = STATE.REF.byGraphic[imgID].pad.partnerID
                    STATE.REF.byGraphic[imgID].pad.name = STATE.REF.byGraphic[imgID].pad.name.replace(/(^\w*?)_Pad_\d*$/gu, `${imgKey}_$1_Pad`)
                    STATE.REF.byGraphic[imgID].partnerPad.name = STATE.REF.byGraphic[imgID].partnerPad.name.replace(/(^\w*?)_PartnerPad_\d*$/gu, `${imgKey}_$1_PartnerPad`)
                    STATE.REF.byPad[Media.IMAGES[imgKey].padID].name = STATE.REF.byGraphic[imgID].pad.name
                    STATE.REF.byPad[Media.IMAGES[imgKey].partnerID].name = STATE.REF.byGraphic[imgID].partnerPad.name
                }
            }
        },
    // #endregion	

    // #region EVENT HANDLERS: (HANDLEINPUT)
        onChatCall = (call, args, objects, msg) => { 	// eslint-disable-line no-unused-vars
            switch (call) {
                case "backup": {
                    STATE.REF.backup = {
                        byPad: JSON.parse(JSON.stringify(PADREGISTRY)),
                        byGraphic: JSON.parse(JSON.stringify(GRAPHICREGISTRY))
                    }
                    D.Alert("Drag Pad Backup Updated.", "!dpad backup")
                    break
                }
                case "restore": {
                    STATE.REF.byPad = JSON.parse(JSON.stringify(STATE.REF.backup.byPad))
                    STATE.REF.byGraphic = JSON.parse(JSON.stringify(STATE.REF.backup.byGraphic))
                    D.Alert("Drag Pad Backup Restored.", "!dpad restore")
                    break
                }
                case "find": {
                    const funcName = args.shift(),
                        padData = _.filter(_.values(PADREGISTRY), v => v.funcName === funcName),
                        padObjs = _.map(padData, v => getObj("graphic", v.partnerID)),
                        padLayer = _.map(padObjs, v => `${v.get("name")}: ${v.get("layer")}`)
                    D.Alert(`Pad Data:<br><br>${D.JS(padLayer)}`, "!dpad find")
                    break     
                }               
                case "make": { // !dpad <funcName> <imgKey OR select img> [top:100 left:100 height:100 width:100 deltaHeight:-50 deltaWidth:-50 deltaTop:-50 deltaLeft:-50 startActive:true]
                    const funcName = args.shift(),
                        hostObj = D.GetSelected(msg) && D.GetSelected(msg)[0] || Media.GetImg(args.shift())
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
                    _.each(PADREGISTRY, (v, padID) => {
                        const padObj = getObj("graphic", padID)
                        if (padFilter === "all" || padObj && D.LCase(padObj.get("name")).includes(padFilter)) {                            
                            padObj.set("imgsrc", "https://s3.amazonaws.com/files.d20.io/images/64184544/CnzRwB8CwKGg-0jfjCkT6w/thumb.png?1538736404")
                            padObj.set("layer", "gmlayer")
                        }
                    })
                    break
                }
                case "hide": {
                    _.each(PADREGISTRY, (v, padID) => {
                        const padObj = getObj("graphic", padID)
                        if (padObj) {
                            padObj.set("imgsrc", IMAGES.blank)
                            if (v.active === "on" &&
                                (Media.GetImgData(v.name).startActive === true || Media.GetImgData(PADREGISTRY[v.partnerID].name).startActive === true))
                                padObj.set("layer", "objects")
                        }
                    })
                    break
                }
                case "kill": {
                    const funcName = args.shift(),
                        imgKeys = []
                    for (const padID of _.keys(PADREGISTRY))
                        if (funcName === "allpads" || PADREGISTRY[padID].funcName === funcName) {
                            const padObj = getObj("graphic", padID)
                            imgKeys.push(PADREGISTRY[padID].name)
                            if (padObj)
                                padObj.remove()
                            delete GRAPHICREGISTRY[PADREGISTRY[padID].id]
                            delete PADREGISTRY[padID]
                        }
                    for (const imgKey of imgKeys)
                        Media.RemoveImg(imgKey)
                    break
                }
                case "reset": {
                    const [padObjs, padNames, padData, graphicList, reportStrings] = [[], [], [], [], []]
                    switch (D.LCase(call = args.shift())) {
                        case "confirm": {
                            STATE.REF.byPad = {}
                            STATE.REF.byGraphic = {}
                            _.each(_.flatten(padObjs), pad => {
                                if (Media.IsRegistered(pad))
                                    Media.RemoveImg(pad, true)
                                pad.remove()
                            })
                            _.each(graphicList, padName => {
                                Media.RemoveImg(padName, true)
                            })
                            _.each(padData, data => {
                                const hostObj = getObj("graphic", data.hostID) || getObj("text", data.hostID)
                                makePad(hostObj, data.funcName, data.options)
                            })
                            D.Alert([
                                "<h3>Current Image Registry</h3>",
                                ..._.keys(Media.IMAGES)
                            ].join("<br>"), "!dpad reset confirm")
                            break
                        }
                        default: {
                            for (const [hostID, data] of Object.entries(GRAPHICREGISTRY)) {
                                const hostObj = getObj("graphic", hostID) || getObj("text", hostID),
                                    padObjPair = [getObj("graphic", data.id), getObj("graphic", data.pad.partnerID)]
                                padObjs.push([padObjPair[0] || null, padObjPair[1] || null, data.pad.funcName])
                                padNames.push([`${data.pad.name}${padObjPair[0] && "" || " -> MISSING!"}`, `${data.partnerPad.name}${padObjPair[1] && "" || " -> MISSING!"}`])
                                if (hostObj)
                                    padData.push({
                                        hostID,
                                        funcName: data.pad.funcName,
                                        options: {
                                            left: data.left,
                                            top: data.top,
                                            height: PADREGISTRY[data.id].height,
                                            width: PADREGISTRY[data.id].width,
                                            startActive: data.pad.active === "on" || data.partnerPad.active === "on"
                                        }
                                    })
                                else
                                    reportStrings.push(`'${Media.GetImgKey(hostID) || "&lt;UNREGISTERED&gt;"}' (${hostID}) for <b>${D.JSL(data.pad.name)}</b>`)
                            }
                            if (reportStrings.length)
                                reportStrings.unshift("<h3>Missing Graphic Objects</h3>")
                            reportStrings.unshift(...[
                                "<h3>Initial Image Registry</h3>",
                                ..._.keys(GRAPHICREGISTRY).map(x => Media.GetImgKey(x) || Media.GetTextKey(x) || `MISSING: ${GRAPHICREGISTRY[x].pad.name}`)
                            ])
                            reportStrings.push(`<h3>${padObjs.length} Pad Objects Found</h3>`)
                            reportStrings.push(...padObjs.map(x => `${
                                x[0] && PADREGISTRY[x[0].id] && PADREGISTRY[x[0].id].name || 
                                    VAL({object: x[0]}) && `(${x[0].get("name")})` ||
                                    `(${D.JS(x[2])})`
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
                    }
                    break                    
                }
                case "list": {
                    const padNames = []
                    _.each(GRAPHICREGISTRY, v => {
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
        onGraphicChange = imgObj => {
            if (imgObj.get("layer") === "walls" || !PADREGISTRY[imgObj.id])
                return false
            // toggle object
            imgObj.set({
                layer: "walls",
                controlledby: ""
            })
            const objData = PADREGISTRY[imgObj.id],
                partnerObj = getObj("graphic", objData.partnerID)
            imgObj.set({
                left: objData.left,
                top: objData.top
            })
            partnerObj.set({
                layer: "objects",
                controlledby: "all"
            })
            PADREGISTRY[imgObj.id].active = "off"
            PADREGISTRY[partnerObj.id].active = "on"
            // D.Alert(`Original Pad: ${D.JS(obj)}<br><br>Partner Pad: ${D.JS(partnerObj)}`)

            if (!FUNCTIONS[objData.funcName])
                return false
            FUNCTIONS[objData.funcName]({
                id: objData.id
            })
            // D.Alert(`Original Pad: ${D.JS(obj)}<br><br>Partner Pad: ${D.JS(partnerObj)}`)
            toFront(imgObj)
            toFront(partnerObj)

            return true
        },
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************
    // #region CONFIGURATION
        IMAGES = {
            blank: "https://s3.amazonaws.com/files.d20.io/images/63990142/MQ_uNU12WcYYmLUMQcbh0w/thumb.png?1538455511",
            signalLight: "https://s3.amazonaws.com/files.d20.io/images/66320080/pUJEq-Vo-lx_-Nn16TvhYQ/thumb.png?1541372292" // 455 x 514
        },
        DICECATS = ["Main", "Big"],
        GRAPHICREGISTRY = STATE.REF.byGraphic,
        PADREGISTRY = STATE.REF.byPad,
    // #endregion

    // #region PERSONAL FUNCTION SETTINGS
    /* CUSTOM PAD FUNCTIONS: Put functions linked by name to drag pads here.
   Each will be passed an object of form:
   {  id: <id of graphic object beneath> } */
        FUNCTIONS = {
            selectDie(args) {
                const [, dieCat, dieNum] = Media.GetImgKey(args.id).split("_")
                Roller.Select(dieCat, D.Int(dieNum))
            },
            wpReroll() {
                const stateVar = C.RO.OT.Roller.selected,
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
                else if (Media.GetImgSrc(light) === "off")
                    Media.SetImg(light, "on")
                else
                    Media.SetImg(light, "off")
            },
            flipComp(card) {
                const slot = D.Int(Media.GetImgData(card.id).name.replace(/compCardSpot_/gu, "")) - 1
                Complications.Flip(slot)
            },
            toggleMapLayer(mapButton) { // mapButtonRoads --> TorontoMapRoadsOverlay
            // D.Alert(D.JS(mapButton))
            // D.Alert(D.JS(Media.GetImgKey(mapButton.id)))
                const buttonKey = Media.GetImgKey(mapButton.id),
                    buttonData = Media.GetImgData(buttonKey),
                    mapLayerKey = buttonKey.replace(/mapButton(.*?)_1/gu, "TorontoMap$1Overlay"),
                    mapLayerData = Media.GetImgData(mapLayerKey)
                let isActive
            // D.Alert(D.JS(buttonData))
            // D.Alert(D.JS(mapLayerKey))
            // D.Alert(D.JS(mapLayerData))
                if (mapLayerData.cycleSrcs && mapLayerData.cycleSrcs.length) {
                    isActive = Media.ToggleImg(mapLayerKey, true)
                    let srcIndex = Math.max(_.findIndex(mapLayerData.cycleSrcs, x => x === mapLayerData.curSrc), 0)
                // D.Alert(`Map Cycle Srcs: ${srcIndex}`)
                    if (srcIndex === mapLayerData.cycleSrcs.length - 1)
                        srcIndex = 0
                    else
                        srcIndex++
                    Media.SetImg(mapLayerKey, mapLayerData.cycleSrcs[srcIndex])
                } else {
                    isActive = Media.ToggleImg(mapLayerKey)
                }
                if (buttonData.cycleSrcs && buttonData.cycleSrcs.length) {
                    let srcIndex = Math.max(_.findIndex(buttonData.cycleSrcs, x => x === buttonData.curSrc), 0)
                // D.Alert(`Button Cycle Srcs: ${srcIndex}`)
                    if (srcIndex === buttonData.cycleSrcs.length - 1)
                        srcIndex = 0
                    else
                        srcIndex++
                    Media.SetImg(mapButton.id, buttonData.cycleSrcs[srcIndex])
                } else {
                    Media.SetImg(mapButton.id, isActive && "on" || "off")
                }
            }
        },
    // #endregion

    // #region Pad Management
        getPad = padRef => {
            const pads = [],
                imgObj = Media.GetImg(padRef)
            if (VAL({imgObj}) && Media.IsRegistered(imgObj)) {
                const imgData = Media.GetImgData(imgObj.id)
                if (imgData.padID)
                    pads.push(getObj("graphic", imgData.padID))
                if (imgData.partnerID)
                    pads.push(getObj("graphic", imgData.partnerID))
            } else if (VAL({object: padRef})) {
                pads.push(getObj("graphic",
                                 GRAPHICREGISTRY[padRef.id] && GRAPHICREGISTRY[padRef.id].id ||
                                    PADREGISTRY[padRef.id] && padRef.id ||
                                    null))
            } else if (VAL({string: padRef})) {
                if (FUNCTIONS[padRef])
                    pads.push(
                        ..._.map(
                            _.keys(
                                _.omit(PADREGISTRY, pData => {
                                    DB(`... pData: ${D.JSL(pData)}`, "getPad")

                                    return pData.funcName !== padRef
                                })
                            ),
                            pID => getObj("graphic", pID)
                        )
                    )
                else
                    pads.push(getObj("graphic", GRAPHICREGISTRY[padRef] && GRAPHICREGISTRY[padRef].id ||
                                                    PADREGISTRY[padRef] && padRef ||
                                                    null))
            }
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
        getPadPair = (imgRef, funcName = false) => {
            const imgData = Media.GetImgData(imgRef)
            if (VAL({list: imgData}, VAL({string: funcName}) ? `${D.JSL(funcName)} > getPadPair` : null))
                if (imgData.padID && imgData.partnerID) {
                    const [padObj, partnerObj] = [
                        getObj("graphic", imgData.padID),
                        getObj("graphic", imgData.partnerID)
                    ]
                    if (VAL({graphicObj: [padObj, partnerObj]}, "getPadPair", true)) {
                        if (partnerObj.get("layer") !== "walls")
                            return [partnerObj, padObj]
                        return [padObj, partnerObj]
                    }
                }
            return false
        },
        getGraphic = pad => Media.GetImg((PADREGISTRY[(VAL({object: pad}) && pad || {id: ""}).id] || {id: ""}).id),

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

        makePad = (imgRef, funcName, params = {deltaTop: 0, deltaLeft: 0, deltaHeight: 0, deltaWidth: 0}) => {
            // THROW(`Making Pad: ${graphicObj.get("name")}, ${funcName}, ${D.JSL(params)}`, "makePad")
            const imgData = Media.GetImgData(imgRef),
                imgObj = Media.GetImg(imgData.name)
            
            if (VAL({graphicObj: imgObj, list: imgData, string: funcName}, "makePad")) {
                let options = {
                    _pageid: imgObj.get("_pageid"),
                    left: imgData.left,
                    top: imgData.top,
                    width: imgData.width,
                    height: imgData.height,
                    name: `${imgData.name}_${funcName}_Pad`,
                    layer: imgData.isActive ? "objects" : "walls",
                    imgsrc: C.IMAGES.blank,
                    isdrawing: true,
                    controlledby: "all",
                    showname: false
                }
                if (VAL({string: params}))
                    _.each(params.split(/,\s*?(?=\S)/gu), v => {
                        const [key, value] = v.split(/\s*?(?=\S):\s*?(?=\S)/gu)
                        options[key] = value
                    })
                else if (VAL({list: params}))
                    options = Object.assign(options, params)
                options.left += D.Int(options.deltaLeft)
                options.top += D.Int(options.deltaTop)
                options.width += D.Int(options.deltaWidth)
                options.height += D.Int(options.deltaHeight)
                delete options.deltaLeft
                delete options.deltaTop
                delete options.deltaWidth
                delete options.deltaHeight
                const pad = createObj("graphic", options),
                    partnerPad = createObj("graphic", Object.assign(options, {name: `${imgData.name}_${funcName}_PartnerPad`, layer: "walls"}))
                Media.IMAGES[imgData.name].padID = pad.id
                Media.IMAGES[imgData.name].partnerID = partnerPad.id
                PADREGISTRY[pad.id] = {
                    funcName,
                    id: imgObj.id,
                    name: pad.get("name"),
                    left: pad.get("left"),
                    top: pad.get("top"),
                    height: pad.get("height"),
                    width: pad.get("width"),
                    partnerID: partnerPad.id,
                    active: imgData.isActive ? "on" : "off"
                }
                PADREGISTRY[partnerPad.id] = {
                    funcName,
                    id: imgObj.id,
                    name: partnerPad.get("name"),
                    left: partnerPad.get("left"),
                    top: partnerPad.get("top"),
                    height: partnerPad.get("height"),
                    width: partnerPad.get("width"),
                    partnerID: pad.id,
                    active: "off"
                }
                GRAPHICREGISTRY[imgObj.id] = {
                    id: pad.id,
                    pad: PADREGISTRY[pad.id],
                    partnerPad: PADREGISTRY[partnerPad.id]
                }
                toFront(pad)
            }            
        },
        removePad = padRef => {
            const pads = getPads(padRef)
            _.each(pads, pad => {
                const padData = PADREGISTRY[pad.id]
                if (VAL({list: padData})) {
                    const imgKey = Media.GetImgKey(padData.id)
                    if (VAL({string: imgKey}) && Media.IMAGES[imgKey].padID) {
                        delete Media.IMAGES[imgKey].padID
                        delete Media.IMAGES[imgKey].partnerID
                    }
                    if (GRAPHICREGISTRY[padData.id])
                        delete GRAPHICREGISTRY[padData.id]
                    if (PADREGISTRY[padData.partnerID])
                        delete PADREGISTRY[padData.partnerID]
                    delete PADREGISTRY[pad.id]
                }
                pad.remove()                
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
                removePad(pad.id)            
        },
        togglePad = (padRef, isActive, funcName = false) => {
            const padIDs = [],
                imgObj = Media.GetImg(padRef),
                dbStrings = [`PadRef: ${D.JS(padRef)} --> ${D.JS(imgObj ? imgObj.get("name") : "NO IMAGE")}`]
            if (VAL({graphicObj: imgObj}) && GRAPHICREGISTRY[imgObj.id])
                padIDs.push(GRAPHICREGISTRY[imgObj.id].id)
            else if (FUNCTIONS[padRef])
                padIDs.push(..._.filter(_.keys(PADREGISTRY), v => PADREGISTRY[v].funcName === padRef))
            dbStrings.push(`... Found: ${D.JSL(_.map(padIDs, v => PADREGISTRY[v].name))}`)
            if (padIDs.length === 0)
                return VAL({string: funcName}) && THROW(`No pad found with ID: '${D.JSL(padRef)}'`, `${D.JSL(funcName)} > togglePad`)

            for (const pID of padIDs) {
                const [pad, partner] = [
                    getObj("graphic", pID),
                    getObj("graphic", PADREGISTRY[pID].partnerID)
                ]
                dbStrings.push(`...PAD: ${pad ? pad.get("name") : "NONE"}<br>... PARTNER: ${partner ? partner.get("name") : "NONE"}<br>`)

                if (VAL({graphicObj: [pad, partner]}, undefined, true)) {
                    pad.set({
                        layer: isActive && PADREGISTRY[pad.id].active === "on" ? "objects" : "walls"
                    })
                    dbStrings.push(`... SETTING PAD to ${isActive && PADREGISTRY[pad.id].active === "on" ? "objects" : "walls"} --> ${pad.get("layer")}`)
                    dbStrings.push(`... ... ${D.JSL(isActive)}, ${D.JSL(PADREGISTRY[pad.id].active)}`)
                    partner.set({
                        layer: isActive && PADREGISTRY[partner.id].active === "on" ? "objects" : "walls"
                    })
                    dbStrings.push(`... SETTING PARTNER to ${isActive && PADREGISTRY[partner.id].active === "on" ? "objects" : "walls"} --> ${partner.get("layer")}`)
                    dbStrings.push(`... ... ${D.JSL(isActive)}, ${D.JSL(PADREGISTRY[partner.id].active)}`)
                    if (isActive && PADREGISTRY[pad.id].active === "off" && PADREGISTRY[partner.id].active === "off") {
                        PADREGISTRY[pad.id].active = "on"
                        pad.set({layer: "objects"})
                    }
                    toFront(pad)
                    toFront(partner)
                } else {
                    dbStrings.push("... INVALID PAD/PARTNER.")
                }
                dbStrings.push("")
            }
            DB(dbStrings.join("<br>"), "togglePad")

            return true
        }
    // #endregion

    return {
        CheckInstall: checkInstall,
        OnChatCall: onChatCall,
        OnGraphicChange: onGraphicChange,

        get PadsByGraphic() { return STATE.REF.byGraphic }, get PadsByID() { return STATE.REF.byPad },

        MakePad: makePad,
        ClearAllPads: clearAllPads,
        GetPad: getPad,
        GetPads: getPads,
        GetPadPair: getPadPair,
        GetGraphic: getGraphic,
        Toggle: togglePad,
        DelPad: removePad
    }
})()

on("ready", () => {
    DragPads.CheckInstall()
    D.Log("DragPads Ready!")
})
void MarkStop("DragPads")