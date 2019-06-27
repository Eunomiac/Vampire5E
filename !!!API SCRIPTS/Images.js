void MarkStart("Media")
const Images = (() => {
// #region INITIALIZATION
    const SCRIPTNAME = "Images",
        STATEREF = C.ROOT[SCRIPTNAME]	// eslint-disable-line no-unused-vars
    const VAL = (varList, funcName) => D.Validate(varList, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME) // eslint-disable-line no-unused-vars
    // #endregion

    let imgRecord = false,
        imgResize = false
    const imgResizeDims = { height: 100, width: 100 },
        // #region CONFIGURATION
        REGISTRY = STATEREF.registry,
        AREAS = STATEREF.areas,
        SANDBOX = {
            height: 2680,
            width: 1664
        },
        IMGDATA = {
            blank: "https://s3.amazonaws.com/files.d20.io/images/63990142/MQ_uNU12WcYYmLUMQcbh0w/thumb.png?1538455511",
            default: {
                x: 100,
                y: 100,
                h: 400,
                w: 600
            },
            district: {
                x: 1367,
                y: 1000,
                h: 604,
                w: 896,
            },
            districtLeft: {
                x: 925,
                y: 983,
                h: 556,
                w: 805
            },
            districtRight: {
                x: 1742,
                y: 983,
                h: 556,
                w: 806
            },
            site: {
                x: 1374,
                y: 1382,
                h: 515,
                w: 701,
            },
            siteLeft: {
                x: 978,
                y: 1377,
                h: 515,
                w: 701,
            },
            siteRight: {
                x: 1690,
                y: 1377,
                h: 515,
                w: 701,
            },
            token: {
                h: 210,
                w: 165
            }
        },
        IMAGELAYERS = {
            map: [
                "SignalLightTopLeft", "SignalLightTopRight", "SignalLightBotLeft", "SignalLightBotRight",
                "rollerDie_bigDice_1",
                "rollerDie_bigDice_2",
                "rollerDie_diceList_1",
                "rollerDie_diceList_2",
                "rollerDie_diceList_3",
                "rollerDie_diceList_4",
                "rollerDie_diceList_5",
                "rollerDie_diceList_6",
                "rollerDie_diceList_7",
                "rollerDie_diceList_8",
                "rollerDie_diceList_9",
                "rollerDie_diceList_10",
                "rollerDie_diceList_11",
                "rollerDie_diceList_12",
                "rollerDie_diceList_13",
                "rollerDie_diceList_14",
                "rollerDie_diceList_15",
                "rollerDie_diceList_16",
                "rollerDie_diceList_17",
                "rollerDie_diceList_18",
                "rollerDie_diceList_19",
                "rollerDie_diceList_20",
                "rollerDie_diceList_21",
                "rollerDie_diceList_22",
                "rollerDie_diceList_23",
                "rollerDie_diceList_24",
                "rollerDie_diceList_25",
                "rollerDie_diceList_26",
                "rollerDie_diceList_27",
                "rollerDie_diceList_28",
                "rollerDie_diceList_29",
                "rollerDie_diceList_30",
                "rollerImage_diffFrame",
                "rollerImage_bottomEnd",
                "rollerImage_topEnd",
                "rollerImage_bottomMid_9",
                "rollerImage_bottomMid_8",
                "rollerImage_bottomMid_7",
                "rollerImage_bottomMid_6",
                "rollerImage_bottomMid_5",
                "rollerImage_bottomMid_4",
                "rollerImage_bottomMid_3",
                "rollerImage_bottomMid_2",
                "rollerImage_bottomMid_1",
                "rollerImage_topMid_9",
                "rollerImage_topMid_8",
                "rollerImage_topMid_7",
                "rollerImage_topMid_6",
                "rollerImage_topMid_5",
                "rollerImage_topMid_4",
                "rollerImage_topMid_3",
                "rollerImage_topMid_2",
                "rollerImage_topMid_1",
                "rollerImage_frontFrame",
                "SiteCenter",
                "SiteLeft",
                "SiteRight",
                "DistrictCenter",
                "DistrictLeft",
                "DistrictRight",
                "WeatherFrost",
                "WeatherFog",
                "WeatherMain",
                  //"WeatherLightning_1", //"WeatherLightning_2", "WeatherLightning_3", "WeatherLightning_4", "WeatherLightning_5",
                "WeatherGround",
                "WeatherClouds",
                "AirLightLeft", "AirLightMid", "AirLightTop", "AirLightCN_4", "AirLightCN_5",
                "HungerTopLeft", "HungerTopRight", "HungerBotLeft", "HungerBotRight",
                "Horizon_1",
                "Horizon_2",
                "ComplicationMat"
            ],
            objects: [
                "YusefShamsinToken",
                "AvaWongToken",
                "JohannesNapierToken",
                "Dr.ArthurRoyToken"
            ],
            daylighterMap: [
                "rollerDie_bigDice_1",
                "rollerDie_bigDice_2",
                "rollerDie_diceList_1",
                "rollerDie_diceList_2",
                "rollerDie_diceList_3",
                "rollerDie_diceList_4",
                "rollerDie_diceList_5",
                "rollerDie_diceList_6",
                "rollerDie_diceList_7",
                "rollerDie_diceList_8",
                "rollerDie_diceList_9",
                "rollerDie_diceList_10",
                "rollerDie_diceList_11",
                "rollerDie_diceList_12",
                "rollerDie_diceList_13",
                "rollerDie_diceList_14",
                "rollerDie_diceList_15",
                "rollerDie_diceList_16",
                "rollerDie_diceList_17",
                "rollerDie_diceList_18",
                "rollerDie_diceList_19",
                "rollerDie_diceList_20",
                "rollerDie_diceList_21",
                "rollerDie_diceList_22",
                "rollerDie_diceList_23",
                "rollerDie_diceList_24",
                "rollerDie_diceList_25",
                "rollerDie_diceList_26",
                "rollerDie_diceList_27",
                "rollerDie_diceList_28",
                "rollerDie_diceList_29",
                "rollerDie_diceList_30",
                "rollerImage_diffFrame",
                "rollerImage_bottomEnd",
                "rollerImage_topEnd",
                "rollerImage_bottomMid_9",
                "rollerImage_bottomMid_8",
                "rollerImage_bottomMid_7",
                "rollerImage_bottomMid_6",
                "rollerImage_bottomMid_5",
                "rollerImage_bottomMid_4",
                "rollerImage_bottomMid_3",
                "rollerImage_bottomMid_2",
                "rollerImage_bottomMid_1",
                "rollerImage_topMid_9",
                "rollerImage_topMid_8",
                "rollerImage_topMid_7",
                "rollerImage_topMid_6",
                "rollerImage_topMid_5",
                "rollerImage_topMid_4",
                "rollerImage_topMid_3",
                "rollerImage_topMid_2",
                "rollerImage_topMid_1",
                "rollerImage_frontFrame",
                "SiteCenter",
                "SiteLeft",
                "SiteRight",
                "DistrictCenter",
                "DistrictLeft",
                "DistrictRight",
                "Horizon_1",
                "WeatherFrost",
                "WeatherFog",
                "WeatherMain",
                  //"WeatherLightning_1", //"WeatherLightning_2", "WeatherLightning_3", "WeatherLightning_4", "WeatherLightning_5",
                "WeatherGround",
                "WeatherClouds",
                "AirLightLeft", "AirLightMid", "AirLightTop", "AirLightCN_4", "AirLightCN_5",
                "HungerTopLeft", "HungerTopRight", "HungerBotLeft", "HungerBotRight",
                "Horizon_2",
                "SignalLightTopLeft", "SignalLightTopRight", "SignalLightBotLeft", "SignalLightBotRight",
                "ComplicationMat"
            ]
        },
        // #endregion

        // #region GETTERS: Image Object & Data Retrieval
        isRegImg = imgRef => Boolean(getImageKey(imgRef)),
        getImageKey = (imgRef, isSilent = false) => {
            try {
                const imgName =
					D.IsObj(imgRef, "graphic") ?
					  imgRef.get("name") :
					  D.IsObj(getObj("graphic", imgRef)) ?
					    getObj("graphic", imgRef).get("name") :
					    _.isString(imgRef) ?
					      REGISTRY[D.JSL(imgRef) + "_1"] ? imgRef + "_1" : imgRef :
					      D.GetSelected(imgRef) ?
					        D.GetSelected(imgRef)[0].get("name") :
					        false
                  // D.Alert(`IsObj? ${D.IsObj(imgRef, "graphic")}
                  // Getting Name: ${imgRef.get("name")}`, "IMAGE NAME")
                  //D.Alert(`RETRIEVED NAME: ${D.JS(imgName)}`)
                if (!imgName) 
                    return !isSilent && D.ThrowError(`Cannot find name of image from reference '${D.JSL(imgRef, true)}'`, "IMAGES: GetImageKey")
                else if (_.find(_.keys(REGISTRY), v => v.toLowerCase().startsWith(imgName.toLowerCase()))) 
                  //D.Alert(`... returning: ${D.JS(_.keys(REGISTRY)[
                  //	_.findIndex(_.keys(REGISTRY), v => v.toLowerCase().startsWith(imgName.toLowerCase()))
                  //])}`)
                    return _.keys(REGISTRY)[
                        _.findIndex(_.keys(REGISTRY), v => v.toLowerCase().startsWith(imgName.toLowerCase()))
                    ]
                else 
                    return !isSilent && D.ThrowError(`Cannot find image with name '${D.JSL(imgName)}' from reference ${D.JSL(imgRef, true)}`, "IMAGES: GetImageKey")
            
            } catch (errObj) {
                return !isSilent && D.ThrowError(`Cannot locate image with search value '${D.JSL(imgRef, true)}'`, "IMAGES GetImageKey", errObj)
            }
        },
        /* getImageKeys = imgRefs => {
			const imageRefs = D.GetSelected(imgRefs) || imgRefs,
				imgKeys = []
			for (const imgRef of imageRefs) {
				imgKeys.push(getImageKey(imgRef))
			}
			return imgKeys
		}, */
        /* getImageName = imgRef => getImageKey(imgRef), */
        /* getImageNames = imgRefs => getImageKeys(imgRefs), */
        getImageObj = imgRef => {
            try {
                let imgObj = null
                D.Alert(`VALIDATIONS: GRAPHIC --> ${D.JS(VAL({ graphic: imgRef }))}
				VALIDATION STRING: ${VAL({ string: imgRef })}`)
                if (VAL({ graphic: imgRef }))
                    imgObj = imgRef
                else if (VAL({ string: imgRef })) 
                    if (getImageKey(imgRef))
                        imgObj = getObj("graphic", REGISTRY[getImageKey(imgRef)].id)
                    else
                        imgObj = getObj("graphic", imgRef) || null
                else if (D.GetSelected(imgRef) && D.GetSelected(imgRef)[0])
                    imgObj = D.GetSelected(imgRef)[0]
                return imgObj
            } catch (errObj) {
                return D.ThrowError(`IMGREF: ${D.JS(imgRef)}`, "IMAGES.getImageObj", errObj)
            }
        },
        getImageObjs = imgRefs => {
              //D.Alert(`GetSelected ImgRefs: ${D.JS(D.GetSelected(imgRefs))}`)
            const imageRefs = VAL({ msg: imgRefs }) ? D.GetSelected(imgRefs) || [] : imgRefs,
                imgObjs = []
            if (VAL({ array: imageRefs })) {
                for (const imgRef of imageRefs)
                    imgObjs.push(getImageObj(imgRef))
                  //D.Alert(`Image Objs: ${D.JS(imgObjs)}`)
                return imgObjs
            }
            return false
        },
        getImageData = imgRef => {
            const funcName = "getImageData"
            try {
                if (getImageKey(imgRef)) {
                    return REGISTRY[getImageKey(imgRef)]
                } else if (getImageObj(imgRef)) {
                    const imgObj = getImageObj(imgRef)
                    D.DBAlert(`Retrieving data for UNREGISTERED Image Object ${D.JSL(imgRef)}`, funcName, SCRIPTNAME)

                    return {
                        id: imgObj.id,
                        name: imgObj.get("name"),
                        left: parseInt(imgObj.get("left")),
                        top: parseInt(imgObj.get("top")),
                        height: parseInt(imgObj.get("height")),
                        width: parseInt(imgObj.get("width")),
                        activeLayer: imgObj.get("activeLayer")
                    }
                }

                return D.ThrowError(`Image reference '${imgRef}' does not refer to a registered image object.`, "IMAGES: GetData")
            } catch (errObj) {
                return D.ThrowError(`Cannot locate image with search value '${D.JS(imgRef)}'`, "IMAGES.getImageData", errObj)
            }
        },
        /* getImageDatas = imgRefs => {
			const imageRefs = D.GetSelected(imgRefs) || imgRefs,
				 imageDatas = []
			for (const imgRef of imageRefs) {
				imageDatas.push(getImageData(imgRef))
			}
			return imageDatas
		},	*/
        getImageBounds = (imgRef, params = {}) => {
            if (D.IsObj(getImageObj(imgRef))) {
                const imgData = Object.assign(getImageData(imgRef), params)
                return {
                    topY: imgData.top - 0.5 * imgData.height,
                    bottomY: imgData.top + 0.5 * imgData.height,
                    leftX: imgData.left - 0.5 * imgData.width,
                    rightX: imgData.left + 0.5 * imgData.width
                }
                  //D.Log(`[BOUNDS]: ${D.JSL(bounds)}`)
            }
            return D.ThrowError(`Image reference '${imgRef}' does not refer to a registered image object.`, "IMAGES: GetBounds")
        },
        getImageSrc = imgRef => getImageData(imgRef) ? getImageData(imgRef).curSrc : false,
        /* getImageSrcs = imgRef => getImageData(imgRef) ? getImageData(imgRef).srcs : false, */
        isImageActive = imgRef => {
            if (getImageObj(imgRef) && getImageObj(imgRef).get("layer") === getImageData(imgRef).activeLayer)
                return true
            return false
        },
        // #endregion

        // #region SETTERS: Registering & Manipulating Image Objects
        addImgSrc = (imgSrcRef, imgName, srcName) => {
            try {
                const imgSrc = (_.isString(imgSrcRef) && imgSrcRef.includes("http") ?
                    imgSrcRef :
                    getImageObj(imgSrcRef).get("imgsrc") || "").replace(/\w*?(?=\.\w+?\?)/u, "thumb")
                if (imgSrc !== "" && isRegImg(imgName)) {
                    REGISTRY[getImageKey(imgName)].srcs[srcName] = imgSrc
                    D.Alert(`Image '${D.JS(srcName)}' added to category '${D.JS(imgName)}'.<br><br>Source: ${D.JS(imgSrc)}`)
                }
            } catch (errObj) {
                D.ThrowError("", "IMAGES.addImgSrc", errObj)
            }
        },
        regImage = (imgRef, imgName, srcName, activeLayer, startActive, options = {}, isSilent = false) => {
              // D.Alert(`Options for '${D.JS(imgName)}': ${D.JS(options)}`, "IMAGES: regImage")
            const imgObj = getImageObj(imgRef)
            if (D.IsObj(imgObj, "graphic")) {
                if (!(imgRef && imgName && srcName && activeLayer && startActive !== null))
                    return D.ThrowError("Must supply all parameters for regImage.", "IMAGES: RegImage")
                const baseName = imgName.replace(/(_|\d|#)+$/gu, "").toLowerCase(),
                    name = `${imgName.replace(/(_|\d|#)+$/gu, "")}_${_.filter(_.keys(REGISTRY), k => k.includes(imgName.replace(/(_|\d|#)+$/gu, ""))).length + 1}`,
                    params = {
                        left: options.left || imgObj.get("left") || REGISTRY[name].left || IMGDATA[baseName] && IMGDATA[baseName].left,
                        top: options.top || imgObj.get("top") || REGISTRY[name].top || IMGDATA[baseName] && IMGDATA[baseName].top,
                        height: options.height || imgObj.get("height") || REGISTRY[name].height || IMGDATA[baseName] && IMGDATA[baseName].height,
                        width: options.width || imgObj.get("width") || REGISTRY[name].width || IMGDATA[baseName] && IMGDATA[baseName].width
                    }
                if (!params.left || !params.top || !params.height || !params.width)
                    return D.ThrowError("Must supply position & dimension to register image.", "IMAGES:RegImage")
                imgObj.set({ name, showname: false })
                REGISTRY[name] = {
                    id: imgObj.id,
                    name,
                    left: params.left,
                    top: params.top,
                    height: params.height,
                    width: params.width,
                    activeLayer: activeLayer,
                    startActive: Boolean(startActive),
                    srcs: {}
                }
                if (D.GetChar(imgObj)) {
                    REGISTRY[name].activeLayer = "objects"
                    REGISTRY[name].startActive = true
                    addImgSrc(imgObj.get("imgsrc").replace(/med/gu, "thumb"), name, "base")
                    setImage(name, "base")
                } else {
                    addImgSrc(imgObj.get("imgsrc").replace(/med/gu, "thumb"), name, srcName)
                    setImage(name, srcName)
                }
                if (!REGISTRY[name].startActive) {
                    setImage(name, "blank")
                    layerImages([name], "gmlayer")
                } else {
                    layerImages([name], REGISTRY[name].activeLayer)
                }
                if (!isSilent)
                    D.Alert(`Host obj for '${D.JS(name)}' registered: ${D.JS(REGISTRY[name])}`, "IMAGES: regImage")

                return getImageData(name)
            }

            return D.ThrowError(`Invalid img reference '${D.JSL(imgRef)}'`, "IMAGES: regImage")
        },
        makeImage = (imgName = "", params = {}, isSilent = false) => {
            const dataRef = IMGDATA[imgName] || IMGDATA["default"],
                imgObj = createObj("graphic", {
                    _pageid: params._pageID || D.PAGEID(),
                    imgsrc: params.imgsrc || IMGDATA.blank,
                    left: params.left || dataRef.left,
                    top: params.top || dataRef.top,
                    width: params.width || dataRef.width,
                    height: params.height || dataRef.height,
                    layer: params.layer || "objects",
                    isdrawing: params.isDrawing !== false,
                    controlledby: params.controlledby || "",
                    showname: params.showname === true
                }),
                activeLayer = params.activeLayer || "gmlayer",
                isStartingActive = Boolean(params.startActive) === false ? false : true,
                options = _.omit(params, ["activeLayer", "startActive"])
            regImage(imgObj, imgName, params.imgsrc ? "base" : "blank", activeLayer, isStartingActive, options, isSilent)

            return imgObj
        },
        setImage = (imgRef, srcRef, isSilent = false) => {
              //D.Alert(`Getting ${D.JS(srcRef)} for ${D.JS(imgRef)} --> ${D.JS(REGISTRY[getImageData(imgRef).name].srcs[srcRef])}`, "IMAGES:SetImage")
            if (isRegImg(imgRef)) {
                const imgObj = getImageObj(imgRef),
                    imgName = getImageKey(imgRef)
                  //D.Alert(`Image Name: ${D.JS(imgName)}`)
                let stateRef = REGISTRY[imgName],
                    srcURL = srcRef
                  //D.Alert(D.JS(REGISTRY[getImageData(imgRef).name]))
                if (imgObj && stateRef) {
                      //D.Alert(`Getting ${D.JS(stateRef.srcs)} --> ${D.JS(srcRef)} --> ${D.JS(stateRef.srcs[srcRef])}`, "IMAGES:SetImage")
                    if (_.isString(stateRef.srcs) && REGISTRY[getImageKey(stateRef.srcs)])
                        stateRef = REGISTRY[getImageKey(stateRef.srcs)]
                    if (stateRef.srcs[srcRef])
                        srcURL = stateRef.srcs[srcRef]
                    else if (_.values(stateRef.srcs).includes(srcRef) && srcRef.includes("http")) 
                        srcURL = srcRef
                    else if (_.isString(IMGDATA[srcRef]))
                        srcURL = IMGDATA[srcRef]
                    else
                        return isSilent ? D.ThrowError(`Image object '${D.JSL(imgRef)}' is unregistered or is missing 'srcs' property`, "Images: setImage()") : false

                    imgObj.set("imgsrc", srcURL)
                    if (srcRef === "blank")
                        imgObj.set("layer", "walls")
                    else
                        imgObj.set("layer", getImageData(imgRef).activeLayer)
                    REGISTRY[getImageData(imgRef).name].curSrc = srcRef
                    return imgObj
                }

                return D.ThrowError(`Invalid image object '${D.JSL(imgObj)}'`, "Images: setImage()")
            }

            return D.ThrowError(`Invalid category '${D.JSL(imgRef)}'`, "Images: setImage()")
        },
        setImgParams = (imgRef, params) => {
            const imgObj = getImageObj(imgRef)
            imgObj.set(params)
            return imgObj
        },
        setImgData = (imgRef, params) => {
            _.each(params, (v, k) => {
                REGISTRY[getImageKey(imgRef)][k] = v
            })
            return REGISTRY[getImageKey(imgRef)]
        },
        sortImages = (imgRefs, modes = "", anchors = []) => {
            const imgObjs = getImageObjs(imgRefs),
                sortModes = _.flatten([modes]),
                imgData = _.map(imgObjs, obj => {
                    const params = {
                        id: obj.id,
                        obj,
                        height: parseInt(obj.get("height")),
                        width: parseInt(obj.get("width")),
                        top: parseInt(obj.get("top")),
                        left: parseInt(obj.get("left"))
                    }
                    return Object.assign(params, getImageBounds(obj, params))
                }),
                [minX, maxX] = (v => [v[0].left, v.slice(-1)[0].left + v.slice(-1)[0].width])(
                    _.sortBy(imgData, v => v.left + v.width)
                ),
                [minY, maxY] = (v => [v[0].top, v.slice(-1)[0].top + v.slice(-1)[0].height])(
                    _.sortBy(imgData, v => v.top + v.height)
                ),
                [centerX, centerY] = [maxX - minX, maxY - minY]
            let [sortedArray, anchorArray, bounds] = [[], [], []],
                anchorRef = "best"
            for (var i = 0; i < sortModes.length; i++) {
                anchorRef = anchors[i] || anchorRef
                let [spacer, counter] = [0, 0],
                    [sorted, revSorted] = [[], []]
                switch (sortModes[i]) {
                    case "distvert":
                        sorted = _.sortBy(imgData, "top")
                        bounds = [sorted[0].top, sorted.slice(-1)[0].top]
                        spacer = (bounds[1] - bounds[0]) / (sorted.length - 1)
                        for (const iData of sorted) {
                            revSorted.unshift(setImgParams(iData.id, { top: bounds[0] + counter * spacer }, true))
                            counter++
                        }
                        for (const obj of revSorted)
                            toFront(obj)
                        break
                    case "disthoriz":
                        sorted = _.sortBy(imgData, "left")
                        bounds = [sorted[0].left, sorted.slice(-1)[0].left]
                        spacer = (bounds[1] - bounds[0]) / (sorted.length - 1)
                        for (const iData of sorted) {
                              //D.Alert(`Setting image ${D.JS(iData)}`)
                            revSorted.unshift(setImgParams(iData.id, { left: bounds[0] + counter * spacer }, true))
                            counter++
                        }
                        for (const obj of revSorted)
                            toFront(obj)
                          //D.Alert(`Bounds: ${D.JS(bounds)}, Spacer: ${D.JS(spacer)}`)
                        break
                    default:
                        switch (anchorRef.toLowerCase()) {
                            case "best":
                                switch (sortModes[i]) {
                                    case "centerX":
                                        sorted = _.sortBy(imgData, v => Math.pow(v.left - centerX, 2))
                                        break
                                    case "centerY":
                                        sorted = _.sortBy(imgData, v => Math.pow(v.top - centerY, 2))
                                        break
                                    case "resize":
                                        sorted = _.sortBy(imgData, v => -(v.height * v.width))
                                        break
                                    case "left":
                                    case "leftedge":
                                        sorted = _.sortBy(imgData, "leftX")
                                        break
                                    case "right":
                                    case "rightedge":
                                        sorted = _.sortBy(imgData, "rightX").reverse()
                                        break
                                    case "top":
                                    case "topedge":
                                        sorted = _.sortBy(imgData, "topY")
                                        break
                                    case "bottom":
                                    case "bottomedge":
                                        sorted = _.sortBy(imgData, "bottomY").reverse()
                                        break
                                    // no default
                                }
                                break
                            case "left":
                            case "leftmost":
                                sorted = _.sortBy(imgData, "leftX")
                                break
                            case "top":
                            case "topmost":
                                sorted = _.sortBy(imgData, "topY")
                                break
                            case "right":
                            case "rightmost":
                                sorted = _.sortBy(imgData, "rightX").reverse()
                                break
                            case "bottom":
                            case "bot":
                            case "botmost":
                            case "bottommost":
                                sorted = _.sortBy(imgData, "bottomY").reverse()
                                break
                            // no default
                        }
                }
                anchorArray.push(sorted.shift())
                sortedArray.push(sorted)
            }

            return [sortedArray, anchorArray]
        },
        alignImages = (imgRefs, alignModes = "center", anchorRefs = "best") => {
            const aModes = alignModes.split(","),
                aRefs = anchorRefs.split(","),
                [sortedArray, anchorArray] = sortImages(imgRefs, aModes, aRefs)
            for (let i = 0; i < sortedArray.length; i++) {
                const [sorted, anchor] = [sortedArray[i], anchorArray[i]]
                switch (aModes[i].toLowerCase()) {
                      // D.Alert(`ANCHOR: ${D.JS(anchor)}`)
                    case "farleft":
                        for (const iData of sorted) 
                            iData.obj.set({
                                left: 0.5 * iData.width
                            })
                
                        break
                    case "farright":
                        for (const iData of sorted) 
                            iData.obj.set({
                                left: SANDBOX.width - 0.5 * iData.width
                            })
                
                        break
                    case "fartop":
                        for (const iData of sorted) 
                            iData.obj.set({
                                top: 0.5 * iData.height
                            })
                
                        break
                    case "farbottom":
                        for (const iData of sorted) 
                            iData.obj.set({
                                top: SANDBOX.height - 0.5 * iData.height
                            })
                
                        break
                    case "resize":
                        for (const iData of sorted) 
                            iData.obj.set({
                                height: anchor.height,
                                width: anchor.width
                            })
                
                        break
                    case "centerX":
                        for (const iData of sorted)
                            iData.obj.set({ left: anchor.left })
                        break
                    case "centerY":
                        for (const iData of sorted)
                            iData.obj.set({ top: anchor.top })
                        break
                    case "left":
                    case "leftedge":
                        for (const iData of sorted)
                            iData.obj.set({ left: anchor.leftX + 0.5 * iData.width })
                        break
                    case "right":
                    case "rightedge":
                        for (const iData of sorted)
                            iData.obj.set({ left: anchor.rightX - 0.5 * iData.width })
                        break
                    case "top":
                    case "topedge":
                        for (const iData of sorted)
                            iData.obj.set({ top: anchor.topY + 0.5 * iData.height })
                        break
                    case "bottom":
                    case "bottomedge":
                        for (const iData of sorted)
                            iData.obj.set({ top: anchor.bottomY - 0.5 * iData.height })
                        break
                    // no default
                }
            }
        },
        /* posImages = (imgRefs, ...params) => {
			const imgObjs = getImageObjs(imgRefs)
			for (const imgObj of imgObjs) {
				const attrList = {}		
				for (const param of params)
					if (VAL({number: param.split(":")[1]}))
						attrList[param.split(":")[0]] = parseInt(param.split(":")[1])
				setImgParams(imgObj, attrList)
			}
		}, */
        toggleImage = (imgRef, isActive, srcRef) => {
            const imgObj = getImageObj(imgRef),
                imgData = getImageData(imgRef)
            if (imgObj && isActive) {
                imgObj.set("layer", imgData.activeLayer)
                if (srcRef)
                    setImage(imgRef, srcRef)
            } else if (imgObj && !isActive) {
                imgObj.set("layer", "walls")
                setImage(imgRef, "blank")
            }
        },
        toggleToken = (imgRef, newSrc) => {
            const imgKey = getImageKey(imgRef)/*,
				imgData = getImageData(imgKey),
				prevSrc = "" + imgData.prevSrc,
				curSrc = "" + imgData.curSrc */
            Images.Set(imgKey, newSrc)
            return
              /* D.Alert(`Registry Storing: <br>prevSrc: ${REGISTRY[imgKey].prevSrc}<br>curSrc: ${REGISTRY[imgKey].curSrc}<br><br>Instructions: <br>toggleRef: ${toggleRef}<br>prevSrc: ${REGISTRY[imgKey].prevSrc}<br>curSrc: ${curSrc}<br>newSrc: ${newSrc}`)
			REGISTRY[imgKey].prevSrc = REGISTRY[imgKey].curSrc
			D.Alert(`Registry Now Storing: <br>prevSrc: ${REGISTRY[imgKey].prevSrc}<br>curSrc: ${REGISTRY[imgKey].curSrc}`)
			if (newSrc === curSrc) {
				if (toggleRef === "prev" && prevSrc) {
					D.Alert(`toggleRef: ${toggleRef}<br>prevSrc: ${prevSrc}<br>curSrc: ${curSrc}<br>newSrc: ${newSrc}<br><br>... SO Setting To PrevSrc (${prevSrc})`)
					Images.Set(imgKey, prevSrc)
					REGISTRY[imgKey].curSrc = prevSrc
				} else if (_.keys(imgData.srcs).includes(toggleRef)) {
					Images.Set(imgKey, toggleRef)					
					D.Alert(`toggleRef: ${toggleRef}<br>prevSrc: ${prevSrc}<br>curSrc: ${curSrc}<br>newSrc: ${newSrc}<br><br>... SO Setting To Toggle Ref (${toggleRef})`)
					REGISTRY[imgKey].curSrc = toggleRef
				} else {				
					D.Alert(`toggleRef: ${toggleRef}<br>prevSrc: ${prevSrc}<br>curSrc: ${curSrc}<br>newSrc: ${newSrc}<br><br>... SO Setting To Base`)
					Images.Set(imgKey, "base")
					REGISTRY[imgKey].curSrc = "base"
				}
			} else {								
				D.Alert(`toggleRef: ${toggleRef}<br>prevSrc: ${prevSrc}<br>curSrc: ${curSrc}<br>newSrc: ${newSrc}<br><br>... SO Setting To NewSrc (${newSrc})`)
				
				REGISTRY[imgKey].curSrc = newSrc
			} */
        },
        removeImage = (imgRef, isUnregOnly) => {
            const imgObj = getImageObj(imgRef),
                imgData = getImageData(imgRef)
            if (imgObj && !isUnregOnly) {
                imgObj.remove()
                delete REGISTRY[imgData.name]
                return true
            } else if (imgData && REGISTRY[imgData.name]) {
                delete REGISTRY[imgData.name]
                return true
            } else if (_.isString(imgRef) && REGISTRY[imgRef]) {
                delete REGISTRY[imgRef]
                return true
            }
            return D.ThrowError(`Invalid image reference ${D.JSL(imgRef)}`, "IMAGES: removeImage")
        },
        removeImages = (imgString, isRegOnly) => {
            const imgNames = _.filter(_.keys(REGISTRY), v => v.includes(imgString))
            for (const imgName of imgNames) 
                removeImage(imgName, isRegOnly)
          
        },
        cleanRegistry = () => {
            for (const imgName of _.keys(REGISTRY)) 
                if (!getImageObj(imgName))
                    removeImage(imgName)
          
        },
        orderImages = (imgRefs, isToBack = false) => {
            let imgObjs
              //D.Alert(`Ordering Images: ${D.JS(imgRefs)}`)
            if (imgRefs === "map")
                imgObjs = getImageObjs(IMAGELAYERS[TimeTracker.IsDay() && C.ROOT.Chars.isDaylighterSession ? "daylighterMap" : "map"])
            else if (imgRefs === "objects")
                imgObjs = getImageObjs(IMAGELAYERS.objects)
            else
                imgObjs = getImageObjs(imgRefs)
              //D.Alert(`Retrieved Images: ${D.JS(imgObjs)}`)
              //D.Alert(`Retrieved Images: ${D.JS(getImageKeys(imgObjs))}`)
            if (!isToBack)
                imgObjs.reverse()
            for (const imgObj of imgObjs) 
                if (D.IsObj(imgObj, "graphic")) 
                    if (isToBack)
                        toBack(imgObj)
                    else
                        toFront(imgObj)
                else 
                    D.Alert(`Not an image object: ${D.JS(imgObj)}`, "IMAGES: OrderImages")
            
          
        },
        layerImages = (imgRefs, layer) => {
            const imgObjs = getImageObjs(imgRefs)
            orderImages(IMAGELAYERS.objects)
            for (const imgObj of imgObjs) 
                if (D.IsObj(imgObj, "graphic"))
                    imgObj.set({ layer: layer })
                else
                    D.Alert(`No image found for reference ${D.JS(imgObj)}`, "IMAGES: OrderImages")
          
        },
        setImageArea = (imgRef, areaRef) => {
            const imgObj = getImageObj(imgRef)
            if (!imgObj) 
                D.Alert(`Invalid image reference: ${D.JS(imgRef)}`, "IMAGES: setImageArea")
            else if (!areaRef || !AREAS[areaRef]) 
                D.Alert(`No area registered as '${D.JS(areaRef)}'`, "IMAGES: setImageArea")
            else 
              /*D.Alert(`Setting to: ${D.JS({
					top: AREAS[areaRef].top,
					left: AREAS[areaRef].left,
					height: AREAS[areaRef].height,
					width: AREAS[areaRef].width
				})}`)*/
                imgObj.set({
                    top: AREAS[areaRef].top,
                    left: AREAS[areaRef].left,
                    height: AREAS[areaRef].height,
                    width: AREAS[areaRef].width
                })
          
        },
        // #endregion

        // #region Event Handlers (handleAdd, handleInput)
        handleAdd = obj => {
            if (imgRecord)
                D.Log(obj.get("imgsrc"), "IMG")
            if (imgResize)
                obj.set(imgResizeDims)
        },
        handleInput = msg => {	// eslint-disable-line complexity
            const args = msg.content.split(/\s+/u)
            if (msg.type !== "api" || !playerIsGM(msg.playerid) || args.shift() !== "!img")
                return
            let [srcName, imgName, areaName, imgObj, imgLayer, imgData, isStartActive] = new Array(7),
                params = {}
            switch (args.shift().toLowerCase()) {
                case "reg": case "register":
                    imgObj = getImageObj(msg)
                    D.Alert(`Image Object: ${D.JS(getImageObj(msg))}<br><br><br>MSG:<br><br>${D.JS(msg)}`)
                    if (!args[0]) {
                        D.Alert("Syntax: !img reg &lt;hostName&gt; &lt;currentSourceName&gt; &lt;activeLayer&gt; &lt;isStartingActive&gt; [params (\"key:value, key:value\")]", "IMAGES: !img reg")
                    } else if (args[0].toLowerCase() === "area") {
                        args.shift()
                        areaName = args.shift()
                        if (!imgObj) {
                            D.Alert("Select an image first!", "IMAGES: !img reg area")
                        } else {
                            AREAS[areaName] = {
                                top: parseInt(imgObj.get("top")),
                                left: parseInt(imgObj.get("left")),
                                height: parseInt(imgObj.get("height")),
                                width: parseInt(imgObj.get("width"))
                            }
                            D.Alert(`Area Registered: ${areaName}<br><br><pre>${D.JS(AREAS[areaName])}</pre>`, "IMAGES: !img reg area")
                        }
                    } else {
                        if (!imgObj) {
                            D.Alert("Select an image object first!", "IMAGES: !img reg")
                        } else {
                            [imgName, srcName, imgLayer, isStartActive] = [args.shift(), args.shift(), args.shift(), args.shift()]
                            if (imgName && srcName && imgLayer && isStartActive)
                                regImage(imgObj, imgName, srcName, imgLayer, isStartActive, D.ParseToObj(args.join(" ")))
                            else
                                D.Alert("Syntax: !img reg &lt;hostName&gt; &lt;currentSourceName&gt; &lt;activeLayer&gt; &lt;isStartingActive&gt; [params (\"key:value, key:value\")]", "IMAGES: !img reg")
                        }
                    }
                    break
                case "set":
                    switch (args.shift().toLowerCase()) {
                        case "pos": case "position":
                            imgObj = getImageObj(msg)
                            if (!imgObj) {
                                D.Alert("Select an image first!", "IMAGES: !img set position")
                            } else if (!isRegImg(msg)) {
                                D.Alert(`Image not registered.  To register selected image:
						
							<pre>!img reg &lt;hostName&gt; &lt;currentSourceName&gt; &lt;activeLayer&gt; &lt;isStartingActive&gt; [params ("key:value, key:value")]</pre>`, "IMAGES: !img set position")
                            } else {
                                [imgObj, imgName] = [getImageObj(msg), getImageKey(msg)]
                                REGISTRY[imgName] = {
                                    top: parseInt(imgObj.get("top")),
                                    left: parseInt(imgObj.get("left")),
                                    height: parseInt(imgObj.get("height")),
                                    width: parseInt(imgObj.get("width"))
                                }
                                D.Alert(`Position Set for Image ${imgName}<br><br><pre>${D.JS(REGISTRY[imgName])}</pre>`)
                            }
                            break
                        case "source": case "src":
                            if (VAL({ token: D.GetSelected(msg)[0] })) {
                                imgName = Images.GetData(D.GetSelected(msg)[0]).name
                                srcName = args[0]
                            } else {
                                [imgName, srcName] = args
                            }
                            if (isRegImg(imgName))
                                setImage(imgName, srcName)
                            else
                                D.Alert(`Image name ${D.JS(imgName)} is not registered.`, "IMAGES: !img set src")
                            break
                        case "area":
                            imgObj = getImageObj(msg)
                            if (!imgObj)
                                D.Alert("Select an image first!", "IMAGES: !img set area")
                            else
                                setImageArea(imgObj, args.shift())
                            break
                        case "layer":
                            imgLayer = args.pop()
                            layerImages(args.length > 0 ? args : msg, imgLayer)
                            break
                        case "tofront":
                            orderImages(args.length > 0 ? args : msg)
                            break
                        case "toback":
                            orderImages(args.length > 0 ? args : msg, true)
                            break
                        case "params":
                            if (getImageData(args[0]))
                            {imgObj = getImageObj(args.shift())}
                            else if (getImageObj(msg))
                            {imgObj = getImageObj(msg)}
                            else {
                                D.ThrowError("Bad image reference.")
                                break
				  }
                            for (const param of args) 
                                params[param.split(":")[0]] = param.split(":")[1]
                  
                            setImgParams(imgObj, params)
                            break
                        case "loc": case "location":
                            for (const param of args) 
                                if (param.includes(":same")) {
                                    const targetHost = param.split(":")[0] + "_1",
                                        targetType = targetHost.includes("District") ? "District" : "Site"
                                    let imgSrc = getImageSrc(targetHost)
                                    if (!isImageActive(targetHost))
                                        switch (targetHost) {
                                            case "DistrictLeft_1":
                                            case "SiteLeft_1":
                                            case "DistrictRight_1":
                                            case "SiteRight_1":
                                                imgSrc = getImageSrc(targetType + "Center_1")
                                                break
                                            case "DistrictCenter_1":
                                            case "SiteCenter_1":
                                                imgSrc = getImageSrc(targetType + "Left_1")
                                                break
                                            // no default
                                        }
                                    setImage(targetHost, imgSrc)
                                } else {
                                    setImage(...param.split(":"))
                                }
                  
                            break
                        // no default
                    }
                    break
                case "clean": case "cleanreg": case "cleanregistry":
                    cleanRegistry()
                    break
                case "add":
                    switch (args.shift().toLowerCase) {
                        case "src": case "source":
                            [imgName, srcName] = args
                            if (isRegImg(imgName)) {
                                imgName = getImageKey(imgName)
                                if (!_.isObject(REGISTRY[imgName].srcs))
                                    REGISTRY[imgName].srcs = {}
                                if (srcName)
                                    addImgSrc(msg, imgName, srcName)
                                else
                                    D.Alert(`Invalid image name '${D.JS(srcName)}'`, "IMAGES: !img add src")
                            } else {
                                D.Alert(`Host name '${D.JS(imgName)}' not registered.`, "IMAGES: !img add src")
                            }
                            break
                        default:
                            D.Alert("<b>Syntax:<br><br><pre>!img add &lt;src/area&gt</pre>", "IMAGES: !img add")
                            break
                    }
                    break
                case "del": case "delete":
                    if (args[0].toLowerCase() === "all") {
                        args.shift()
                        for (imgName of _.keys(REGISTRY))
                            if (!args[0] || imgName.toLowerCase().includes(args.join(" ").toLowerCase()))
                                removeImage(imgName)
                    } else if (getImageObjs(msg).length > 0) {
                        for (const obj of getImageObjs(msg)) 
                            removeImage(obj)
                
                    } else if (args[0] && getImageObj(args.join(" "))) {
                        removeImage(args.join(" "))
                    } else {
                        D.Alert(`Provide "all" (plus an optional host name substring), a registered host name, or select image objects. <b>Syntax:</b><br><br><pre>!img del all <hostSubstring>
					!img del <hostName></pre>`, "IMAGES: !img del")
                    }
                    break
                case "unreg": case "unregister":
                      //D.Alert(`ARGS: ${D.JS(args)}<br><br>getImageObj('${D.JS(args.join(" "))}'):<br><br>${D.JS(getImageObj(args.join(" ")))}`)
                    if (args[0].toLowerCase() === "all") {
                        args.shift()
                        for (imgName of _.keys(REGISTRY))
                            if (!args[0] || imgName.toLowerCase().includes(args.join(" ").toLowerCase()))
                                removeImage(imgName, true)
                    } else if (_.compact(getImageObjs(msg)).length > 0) {
                        for (const obj of getImageObjs(msg)) 
                            removeImage(obj, true)
                
                    } else if (args[0] && getImageObj(args.join(" "))) {
                        removeImage(args.join(" "), true)
                    } else if (args[0] && REGISTRY[args.join(" ")]) {
                        delete REGISTRY[args.join(" ")]
                    } else {
                        D.Alert("Provide \"all\", a registered host name, or select image objects. <b>Syntax:</b><br><br><pre>!img unreg all/<<hostName>>")
                    }
                    break
                case "toggle":
                    switch (args.shift().toLowerCase()) {
                        case "on":
                            for (const param of args)
                                toggleImage(param, true, "base")
                            break
                        case "off":
                            for (const param of args)
                                toggleImage(param, false)
                            break
                        case "log":
                            imgRecord = !imgRecord
                            if (imgRecord)
                                D.Alert("Logging image data as they are added to the sandbox.", "IMAGES, !img toggle log")
                            else
                                D.Alert("Image logging disabled.", "IMAGES, !img toggle log")
                            break
                        case "resize":
                            imgResize = !imgResize
                            if (imgResize) {
                                params = args.join("").split(",")
                                if (params.length === 1 && IMGDATA[params[0]]) {
                                    imgResizeDims.height = IMGDATA[params[0]].h
                                    imgResizeDims.width = IMGDATA[params[0]].w
                                } else if (params.length === 2) {
                                    _.each(params, v => {
                                        if (!isNaN(parseInt(v.split(":")[1])))
                                            imgResizeDims[v.split(":")[0]] = parseInt(v.split(":")[1])
                                    })
                                } else {
                                    D.Alert("Must supply either a valid IMGDATA key (token, district, districtLeft, districtRight, site, siteLeft, siteRight) OR \"height:<height>, width:<width>\"", "IMAGES, !img toggle resize")
                                    imgResize = false
                                    break
                                }
                                D.Alert(`New images automatically resized to height: ${imgResizeDims.height}, width: ${imgResizeDims.width}.`, "IMAGES, !img toggle resize")
                            } else {
                                D.Alert("Image resizing disabled.", "IMAGES, !img toggle resize")
                            }
                            break
                        default:
                            D.Alert("Must state either 'on', 'off', 'log' or 'resize'.  <b>Syntax:</b><br><br><pre>!img toggle &lt;on/off&gt; &lt;hostnames&gt;</pre><br><pre>!img toggle log/resize</pre>", "IMAGES: !img toggle")
                            break
                    }
                    break
                case "align":
                    if (D.GetSelected(msg))
                        alignImages(msg, ...args)
                    break
                case "copy":
                    imgObj = getImageObj(args.shift())
                    srcName = imgObj.get("imgsrc")
                    imgObj = getImageObj(args.shift())
                    imgObj.set("imgsrc", srcName)
                    break
                case "get":
                    switch (args.shift().toLowerCase()) {
                        case "data":
                            imgObj = getImageObj(msg)
                            if (imgObj) {
                                D.Alert(getImageData(imgObj), "IMAGES, !img getData")
                            } else {
                                imgName = args.shift()
                                if (imgName && REGISTRY[imgName])
                                    D.Alert(D.JS(REGISTRY[imgName]), `IMAGES: '${D.JS(imgName)}'`)
                                else
                                    D.Alert("Syntax: !img get data [<category> <name>] (or select an image object)", "IMAGES, !img get data")
                            }
                            break
                        case "all":
                            imgData = _.map(REGISTRY, v => `${v.name}: ${v.startActive ? v.activeLayer.toUpperCase() : v.activeLayer.toLowerCase()} ${_.isObject(v.srcs) ? _.keys(v.srcs) : v.srcs}`)
                            D.Alert(D.JS(imgData), "IMAGES, !img get all")
                            break
                        case "names":
                            D.Alert(`<b>IMAGE NAMES:</b><br><br>${D.JS(_.keys(C.ROOT.Images.registry))}`)
                            break
                        // no default
                    }
                    break
                // no default
            }
        },
        // #endregion

        // #region Public Functions: RegisterEventHandlers
        regHandlers = () => {
            on("add:graphic", handleAdd)
            on("chat:message", handleInput)
        },

        checkInstall = () => {
            C.ROOT.Images = C.ROOT.Images || {}
            C.ROOT.Images.registry = C.ROOT.Images.registry || {}
            C.ROOT.Images.areas = C.ROOT.Images.areas || {}

              /*state.VAMPIRE.Images.registry.ComplicationMat_1.srcs = {
				base: "https://s3.amazonaws.com/files.d20.io/images/82977782/TiSFMIRN70aWyiyQvW55Zw/thumb.jpg?1559488461"
			}*/
        }
    // #endregion

    return {
        RegisterEventHandlers: regHandlers,
        CheckInstall: checkInstall,
        GetObj: getImageObj,
        GetKey: getImageKey,
        GetData: getImageData,
        GetSrc: getImageSrc,
        MakeImage: makeImage,
        Register: regImage,
        AddSrc: addImgSrc,
        Remove: removeImage,
        RemoveAll: removeImages,
        Set: setImage,
        SetParams: setImgParams,
        SetData: setImgData,
        SetArea: setImageArea,
        Toggle: toggleImage,
        ToggleToken: toggleToken,
        OrderImages: orderImages,
        LayerImages: layerImages,
        IMAGELAYERS: IMAGELAYERS
    }
})()

on("ready", () => {
    Images.RegisterEventHandlers()
    Images.CheckInstall()
    D.Log("Ready!", "Images")
})
void MarkStop("Media")