void MarkStart("Media")
const Media = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    state.VAMPIRE.Media = Object.assign({}, state.VAMPIRE.Images)
    const SCRIPTNAME = "Media",
        CHATCOMMAND = "!img",
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
            on("add:graphic", handleAdd)
        }
    // #endregion

    // #region LOCAL INITIALIZATION
    const initialize = () => {
        STATEREF.imageregistry = STATEREF.imageregistry || {}
        STATEREF.textregistry = STATEREF.textregistry || {}
        STATEREF.areas = STATEREF.areas || {}
    }
    // #endregion	

    // #region EVENT HANDLERS: (HANDLEINPUT)
    const handleInput = (msg, who, call, args) => { 	// eslint-disable-line no-unused-vars
            let [srcName, hostName, imgObj, textObj, objLayer, objData, isStartActive, isShadow] = new Array(8),
                params = {}
            switch (call.toLowerCase()) {
                case "adjust":
                    imgObj = getImageObj(msg)
                    imgObj.set(args.shift(), parseInt(args.shift()))
                    break
                case "reg": case "register":
                    if (!args[0])
                        D.Alert("Syntax: !img reg &lt;hostName&gt; &lt;currentSourceName&gt; &lt;activeLayer(objects/map/walls/gmlayer)&gt; &lt;isStartingActive&gt; [params (\"key:value, key:value\")]<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;!img reg text &lt;hostName&gt; &lt;activeLayer(objects/map/walls/gmlayer)&gt; &lt;isStartingActive&gt; &lt;isMakingShadow&gt; [params (\"key:value, key:value\")]", "IMAGES: !img reg")
                    else
                        switch (args[0].toLowerCase()) {
                            case "text":
                                args.shift()
                                if (!args[0]) {
                                    D.Alert("Syntax: !img reg text &lt;hostName&gt; &lt;activeLayer(objects/map/walls/gmlayer)&gt; &lt;isStartingActive&gt; &lt;isMakingShadow&gt; [params (\"key:value, key:value\")]", "IMAGES: !img reg text")
                                } else {
                                    hostName = args.shift()
                                    textObj = getTextObj(msg)
                                    if (!textObj) {
                                        D.Alert("Select a text object first!", "IMAGES: !img reg text")
                                    } else {
                                        [hostName, objLayer, isStartActive, isShadow] = [args.shift(), args.shift(), args.shift(), args.shift()]
                                        if (hostName && objLayer)
                                            regText(textObj, hostName, objLayer, !isStartActive || isStartActive !== "false", !isShadow || isShadow !== "false", D.ParseToObj(args.join(" ")))
                                        else
                                            D.Alert("Syntax: !img reg text &lt;hostName&gt; &lt;activeLayer&gt; &lt;isStartingActive&gt; &lt;isMakingShadow&gt; [params (\"key:value, key:value\")]", "IMAGES: !img reg text")
                                    }
                                }
                                break
                            case "area":
                                args.shift()
                                if (!args[0]) {
                                    D.Alert("Syntax: !img reg area &lt;areaName&gt;", "IMAGES: !img reg area")
                                } else {
                                    hostName = args.shift()
                                    imgObj = getImageObj(msg)
                                    if (!imgObj) {
                                        D.Alert("Select an image first!", "IMAGES: !img reg area")
                                    } else {
                                        AREAS[hostName] = {
                                            top: parseInt(imgObj.get("top")),
                                            left: parseInt(imgObj.get("left")),
                                            height: parseInt(imgObj.get("height")),
                                            width: parseInt(imgObj.get("width"))
                                        }
                                        D.Alert(`Area Registered: ${hostName}<br><br><pre>${D.JS(AREAS[hostName])}</pre>`, "IMAGES: !img reg area")
                                    }
                                }
                                break
                            default:
                                if (!args[0]) {
                                    D.Alert("Syntax: !img reg &lt;hostName&gt; &lt;currentSourceName&gt; &lt;activeLayer&gt; &lt;isStartingActive&gt; [params (\"key:value, key:value\")]", "IMAGES: !img reg")
                                } else {
                                    imgObj = getImageObj(msg)
                                    DB(`Image Object: ${D.JS(getImageObj(msg))}<br><br><br>MSG:<br><br>${D.JS(msg)}`, "IMAGES: !img reg")
                                    if (!imgObj) {
                                        D.Alert("Select an image object first!", "IMAGES: !img reg")
                                    } else {
                                        [hostName, srcName, objLayer, isStartActive] = [args.shift(), args.shift(), args.shift(), args.shift()]
                                        if (hostName && srcName && objLayer && isStartActive)
                                            regImage(imgObj, hostName, srcName, objLayer, !isStartActive || isStartActive !== "false", D.ParseToObj(args.join(" ")))
                                        else
                                            D.Alert("Syntax: !img reg &lt;hostName&gt; &lt;currentSourceName&gt; &lt;activeLayer&gt; &lt;isStartingActive&gt; [params (\"key:value, key:value\")]", "IMAGES: !img reg")
                                    }
                                }
                                break
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
                                [imgObj, hostName] = [getImageObj(msg), getImageKey(msg)]
                                IMAGEREGISTRY[hostName] = IMAGEREGISTRY[hostName] || {}
                                IMAGEREGISTRY[hostName].top = parseInt(imgObj.get("top"))
                                IMAGEREGISTRY[hostName].left = parseInt(imgObj.get("left"))
                                IMAGEREGISTRY[hostName].height = parseInt(imgObj.get("height"))
                                IMAGEREGISTRY[hostName].width = parseInt(imgObj.get("width"))
                                D.Alert(`Position Set for Image ${hostName}<br><br><pre>${D.JS(IMAGEREGISTRY[hostName])}</pre>`)
                            }
                            break
                        case "source": case "src":
                            if (VAL({ token: D.GetSelected(msg)[0] })) {
                                hostName = Media.GetData(D.GetSelected(msg)[0]).name
                                srcName = args[0]
                            } else {
                                [hostName, srcName] = args
                            }
                            if (isRegImg(hostName))
                                setImage(hostName, srcName)
                            else
                                D.Alert(`Image name ${D.JS(hostName)} is not registered.`, "IMAGES: !img set src")
                            break
                        case "area":
                            imgObj = getImageObj(msg)
                            if (!imgObj)
                                D.Alert("Select an image first!", "IMAGES: !img set area")
                            else
                                setImageArea(imgObj, args.shift())
                            break
                        case "layer":
                            objLayer = args.pop()
                            layerImages(args.length ? args : msg, objLayer)
                            break
                        case "tofront":
                            orderImages(args.length ? args : msg)
                            break
                        case "toback":
                            orderImages(args.length ? args : msg, true)
                            break
                        case "params":
                            if (getImageData(args[0])) { imgObj = getImageObj(args.shift()) }
                            else if (getImageObj(msg)) { imgObj = getImageObj(msg) }
                            else {
                                THROW("Bad image reference.", "!img set params")
                                break
                            }
                            for (const param of args)
                                params[param.split(":")[0]] = param.split(":")[1]

                            setImgParams(imgObj, params)
                            break
                        case "token":
                            toggleToken(D.GetSelected(msg)[0] || args.shift(), args.shift())
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
                            [hostName, srcName] = args
                            if (isRegImg(hostName)) {
                                hostName = getImageKey(hostName)
                                if (!_.isObject(IMAGEREGISTRY[hostName].srcs))
                                    IMAGEREGISTRY[hostName].srcs = {}
                                if (srcName)
                                    addImgSrc(msg, hostName, srcName)
                                else
                                    D.Alert(`Invalid image name '${D.JS(srcName)}'`, "IMAGES: !img add src")
                            } else {
                                D.Alert(`Host name '${D.JS(hostName)}' not registered.`, "IMAGES: !img add src")
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
                        for (hostName of _.keys(IMAGEREGISTRY))
                            if (!args[0] || hostName.toLowerCase().includes(args.join(" ").toLowerCase()))
                                removeImage(hostName)
                    } else if (getImageObjs(msg).length) {
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
                        for (hostName of _.keys(IMAGEREGISTRY))
                            if (!args[0] || hostName.toLowerCase().includes(args.join(" ").toLowerCase()))
                                removeImage(hostName, true)
                    } else if (_.compact(getImageObjs(msg)).length) {
                        for (const obj of getImageObjs(msg))
                            removeImage(obj, true)

                    } else if (args[0] && getImageObj(args.join(" "))) {
                        removeImage(args.join(" "), true)
                    } else if (args[0] && IMAGEREGISTRY[args.join(" ")]) {
                        delete IMAGEREGISTRY[args.join(" ")]
                    } else {
                        D.Alert("Provide \"all\", a registered host name, or select image objects. <b>Syntax:</b><br><br><pre>!img unreg all/<<hostName>>")
                    }
                    break
                case "toggle":
                    DB(`TOGGLE COMMAND RECEIVED.  MESSAGE IS AS FOLLOWS:<br><br>${D.JS(msg)}`, "getContainedImages")
                    switch (args.shift().toLowerCase()) {
                        case "on":
                            DB(`Toggling ON: ${D.JS(args)}`, "getContainedImages")
                            for (const param of args)
                                toggleImage(param, true)
                            break
                        case "off":
                            DB(`Toggling OFF: ${D.JS(args)}`, "getContainedImages")
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
                                hostName = args.shift()
                                if (hostName && IMAGEREGISTRY[hostName])
                                    D.Alert(D.JS(IMAGEREGISTRY[hostName]), `IMAGES: '${D.JS(hostName)}'`)
                                else
                                    D.Alert("Syntax: !img get data [<category> <name>] (or select an image object)", "IMAGES, !img get data")
                            }
                            break
                        case "all":
                            objData = _.map(IMAGEREGISTRY, v => `${v.name}: ${v.startActive ? v.activeLayer.toUpperCase() : v.activeLayer.toLowerCase()} ${_.isObject(v.srcs) ? _.keys(v.srcs) : v.srcs}`)
                            D.Alert(D.JS(objData), "IMAGES, !img get all")
                            break
                        case "names":
                            D.Alert(`<b>IMAGE NAMES:</b><br><br>${D.JS(_.keys(IMAGEREGISTRY))}`)
                            break
                    // no default
                    }
                    break
            // no default
            }
        },
        handleAdd = obj => {
            if (imgRecord)
                D.Log(obj.get("imgsrc"), "IMG")
            if (imgResize)
                obj.set(imgResizeDims)
        }
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    const imgResizeDims = { height: 100, width: 100 }
    let [imgRecord, imgResize] = [false, false]

    // #region CONFIGURATION
    const IMAGEREGISTRY = STATEREF.imageregistry,
        TEXTREGISTRY = STATEREF.textregistry,
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
        }
    // #endregion

    // #region GETTERS: Image Object & Data Retrieval
    const isRegImg = imgRef => Boolean(getImageKey(imgRef)),
        getImageKey = (imgRef, isSilent = false) => {
            try {
                const imgName =
                    VAL({graphicObj: imgRef}) ?
                        imgRef.get("name") :
                        VAL({graphicObj: getObj("graphic", imgRef)}) ?
                            getObj("graphic", imgRef).get("name") :
                            _.isString(imgRef) ?
                                IMAGEREGISTRY[D.JSL(imgRef) + "_1"] ? imgRef + "_1" : imgRef :
                                D.GetSelected(imgRef) ?
                                    D.GetSelected(imgRef)[0].get("name") :
                                    false
                // D.Alert(`IsObj? ${VAL({graphicObj: imgRef})}
                // Getting Name: ${imgRef.get("name")}`, "IMAGE NAME")
                //D.Alert(`RETRIEVED NAME: ${D.JS(imgName)}`)
                if (!imgName)
                    return !isSilent && THROW(`Cannot find name of image from reference '${D.JSL(imgRef, true)}'`, "GetImageKey")
                else if (_.find(_.keys(IMAGEREGISTRY), v => v.toLowerCase().startsWith(imgName.toLowerCase())))
                    //D.Alert(`... returning: ${D.JS(_.keys(REGISTRY)[
                    //	_.findIndex(_.keys(REGISTRY), v => v.toLowerCase().startsWith(imgName.toLowerCase()))
                    //])}`)
                    return _.keys(IMAGEREGISTRY)[
                        _.findIndex(_.keys(IMAGEREGISTRY), v => v.toLowerCase().startsWith(imgName.toLowerCase()))
                    ]
                else
                    return !isSilent && THROW(`Cannot find image with name '${D.JSL(imgName)}' from reference ${D.JSL(imgRef, true)}`, "GetImageKey")

            } catch (errObj) {
                return !isSilent && THROW(`Cannot locate image with search value '${D.JSL(imgRef, true)}'`, "GetImageKey", errObj)
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
            //D.Alert("GETTING IMAGE OBJECT")
            try {
                let imgObj = null
                //D.Alert(`VALIDATIONS: GRAPHIC --> ${D.JS(VAL({ graphic: imgRef }))}
                //VALIDATION STRING: ${VAL({ string: imgRef })}`)
                if (VAL({ graphicObj: imgRef }))
                    imgObj = imgRef
                else if (VAL({ string: imgRef }))
                    if (getImageKey(imgRef))
                        imgObj = getObj("graphic", IMAGEREGISTRY[getImageKey(imgRef)].id)
                    else
                        imgObj = getObj("graphic", imgRef) || null
                else if (D.GetSelected(imgRef) && D.GetSelected(imgRef)[0])
                    imgObj = D.GetSelected(imgRef)[0]
                return imgObj
            } catch (errObj) {
                return THROW(`IMGREF: ${D.JS(imgRef)}`, "getImageObj", errObj)
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
                    return IMAGEREGISTRY[getImageKey(imgRef)]
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

                return THROW(`Image reference '${imgRef}' does not refer to a registered image object.`, "GetData")
            } catch (errObj) {
                return THROW(`Cannot locate image with search value '${D.JS(imgRef)}'`, "getImageData", errObj)
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
            if (VAL({graphicObj: getImageObj(imgRef)})) {
                const imgData = Object.assign(getImageData(imgRef), params)
                return {
                    topY: imgData.top - 0.5 * imgData.height,
                    bottomY: imgData.top + 0.5 * imgData.height,
                    leftX: imgData.left - 0.5 * imgData.width,
                    rightX: imgData.left + 0.5 * imgData.width
                }
                //D.Log(`[BOUNDS]: ${D.JSL(bounds)}`)
            }
            return THROW(`Image reference '${imgRef}' does not refer to a registered image object.`, "GetBounds")
        },
        getImageSrc = imgRef => getImageData(imgRef) ? getImageData(imgRef).curSrc : false,
        /* getImageSrcs = imgRef => getImageData(imgRef) ? getImageData(imgRef).srcs : false, */
        isImageActive = imgRef => {
            if (getImageObj(imgRef) && getImageObj(imgRef).get("layer") === getImageData(imgRef).activeLayer)
                return true
            return false
        },
        getContainedImages = (imgRef) => {
            const imgObj = getImageObj(imgRef),
                boundaries = {
                    horiz: [parseInt(imgObj.get("left")) - parseInt(imgObj.get("width")) / 2, parseInt(imgObj.get("left")) + parseInt(imgObj.get("width")) / 2],
                    vert: [parseInt(imgObj.get("top")) - parseInt(imgObj.get("height")) / 2, parseInt(imgObj.get("top")) + parseInt(imgObj.get("height")) / 2]
                }
            DB(`boundaries: ${D.JS(boundaries)}`, "getContainedImages")
            const contImages = _.filter(findObjs({ _type: "graphic", _pageid: D.PAGEID() }), v =>
                parseInt(v.get("left")) >= boundaries.horiz[0] &&
                parseInt(v.get("left")) <= boundaries.horiz[1] &&
                parseInt(v.get("top")) >= boundaries.vert[0] &&
                parseInt(v.get("top")) <= boundaries.vert[1] &&
                v.get("layer") === "objects" &&
                v.get("represents").length > 2 &&
                parseInt(v.get("height")) <= parseInt(imgObj.get("height")) &&
                parseInt(v.get("width")) <= parseInt(imgObj.get("width"))
            )
            DB(`contained images:<br><br>${D.JS(_.map(contImages, v => v.get("name")))}`, "getContainedImages")
            return contImages
        }
    // #endregion

    // #region SETTERS: Registering & Manipulating Image Objects
    const addImgSrc = (imgSrcRef, imgName, srcName) => {
            try {
                const imgSrc = (_.isString(imgSrcRef) && imgSrcRef.includes("http") ?
                    imgSrcRef :
                    getImageObj(imgSrcRef).get("imgsrc") || "").replace(/\w*?(?=\.\w+?\?)/u, "thumb")
                if (imgSrc !== "" && isRegImg(imgName)) {
                    IMAGEREGISTRY[getImageKey(imgName)].srcs[srcName] = imgSrc
                    D.Alert(`Image '${D.JS(srcName)}' added to category '${D.JS(imgName)}'.<br><br>Source: ${D.JS(imgSrc)}`)
                }
            } catch (errObj) {
                THROW("", "addImgSrc", errObj)
            }
        },
        regImage = (imgRef, imgName, srcName, activeLayer, startActive, options = {}, isSilent = false) => {
            // D.Alert(`Options for '${D.JS(imgName)}': ${D.JS(options)}`, "IMAGES: regImage")
            const imgObj = getImageObj(imgRef)
            if (VAL({graphicObj: imgObj})) {
                if (!(imgRef && imgName && srcName && activeLayer && startActive !== null))
                    return THROW("Must supply all parameters for regImage.", "RegImage")
                const baseName = imgName.replace(/(_|\d|#)+$/gu, "").toLowerCase(),
                    name = `${imgName.replace(/(_|\d|#)+$/gu, "")}_${_.filter(_.keys(IMAGEREGISTRY), k => k.includes(imgName.replace(/(_|\d|#)+$/gu, ""))).length + 1}`,
                    params = {
                        left: options.left || imgObj.get("left") || IMAGEREGISTRY[name].left || IMGDATA[baseName] && IMGDATA[baseName].left,
                        top: options.top || imgObj.get("top") || IMAGEREGISTRY[name].top || IMGDATA[baseName] && IMGDATA[baseName].top,
                        height: options.height || imgObj.get("height") || IMAGEREGISTRY[name].height || IMGDATA[baseName] && IMGDATA[baseName].height,
                        width: options.width || imgObj.get("width") || IMAGEREGISTRY[name].width || IMGDATA[baseName] && IMGDATA[baseName].width
                    }
                if (!params.left || !params.top || !params.height || !params.width)
                    return THROW("Must supply position & dimension to register image.", "RegImage")
                imgObj.set({ name, showname: false })
                IMAGEREGISTRY[name] = {
                    id: imgObj.id,
                    name,
                    left: params.left,
                    top: params.top,
                    height: params.height,
                    width: params.width,
                    activeLayer: activeLayer,
                    startActive: !(startActive === "false" || startActive === false),
                    srcs: {}
                }
                if (D.GetChar(imgObj)) {
                    IMAGEREGISTRY[name].activeLayer = "objects"
                    IMAGEREGISTRY[name].startActive = true
                    addImgSrc(imgObj.get("imgsrc").replace(/med/gu, "thumb"), name, "base")
                    setImage(name, "base")
                } else {
                    addImgSrc(imgObj.get("imgsrc").replace(/med/gu, "thumb"), name, srcName)
                    setImage(name, srcName)
                }
                if (!IMAGEREGISTRY[name].startActive) {
                    setImage(name, "blank")
                    layerImages([name], "gmlayer")
                } else {
                    layerImages([name], IMAGEREGISTRY[name].activeLayer)
                }
                if (!isSilent)
                    D.Alert(`Host obj for '${D.JS(name)}' registered: ${D.JS(IMAGEREGISTRY[name])}`, "IMAGES: regImage")

                return getImageData(name)
            }

            return THROW(`Invalid img reference '${D.JSL(imgRef)}'`, "regImage")
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
                isStartingActive = !(params.startActive === "false" || params.startActive === false),
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
                let stateRef = IMAGEREGISTRY[imgName],
                    srcURL = srcRef
                //D.Alert(D.JS(REGISTRY[getImageData(imgRef).name]))
                if (imgObj && stateRef) {
                    //D.Alert(`Getting ${D.JS(stateRef.srcs)} --> ${D.JS(srcRef)} --> ${D.JS(stateRef.srcs[srcRef])}`, "IMAGES:SetImage")
                    if (_.isString(stateRef.srcs) && IMAGEREGISTRY[getImageKey(stateRef.srcs)])
                        stateRef = IMAGEREGISTRY[getImageKey(stateRef.srcs)]
                    if (stateRef.srcs[srcRef])
                        srcURL = stateRef.srcs[srcRef]
                    else if (_.values(stateRef.srcs).includes(srcRef) && srcRef.includes("http"))
                        srcURL = srcRef
                    else if (_.isString(IMGDATA[srcRef]))
                        srcURL = IMGDATA[srcRef]
                    else
                        return isSilent ? THROW(`Image object '${D.JSL(imgRef)}' is unregistered or is missing 'srcs' property`, "setImage()") : false

                    imgObj.set("imgsrc", srcURL)
                    if (srcRef === "blank") {
                        imgObj.set("layer", "walls")
                        IMAGEREGISTRY[getImageData(imgRef).name].activeSrc = IMAGEREGISTRY[getImageData(imgRef).name].curSrc
                    } else {
                        imgObj.set("layer", getImageData(imgRef).activeLayer)
                        IMAGEREGISTRY[getImageData(imgRef).name].activeSrc = srcRef
                    }
                    IMAGEREGISTRY[getImageData(imgRef).name].curSrc = srcRef
                    return imgObj
                }

                return THROW(`Invalid image object '${D.JSL(imgObj)}'`, "setImage()")
            }

            return THROW(`Invalid category '${D.JSL(imgRef)}'`, "setImage()")
        },
        setImgParams = (imgRef, params) => {
            const imgObj = getImageObj(imgRef)
            imgObj.set(params)
            return imgObj
        },
        setImgData = (imgRef, params) => {
            _.each(params, (v, k) => {
                IMAGEREGISTRY[getImageKey(imgRef)][k] = v
            })
            return IMAGEREGISTRY[getImageKey(imgRef)]
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
                else if (imgData.activeSrc)
                    setImage(imgData.activeSrc)
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
            Media.Set(imgKey, newSrc)
            return
            /* D.Alert(`Registry Storing: <br>prevSrc: ${REGISTRY[imgKey].prevSrc}<br>curSrc: ${REGISTRY[imgKey].curSrc}<br><br>Instructions: <br>toggleRef: ${toggleRef}<br>prevSrc: ${REGISTRY[imgKey].prevSrc}<br>curSrc: ${curSrc}<br>newSrc: ${newSrc}`)
          REGISTRY[imgKey].prevSrc = REGISTRY[imgKey].curSrc
          D.Alert(`Registry Now Storing: <br>prevSrc: ${REGISTRY[imgKey].prevSrc}<br>curSrc: ${REGISTRY[imgKey].curSrc}`)
          if (newSrc === curSrc) {
              if (toggleRef === "prev" && prevSrc) {
                  D.Alert(`toggleRef: ${toggleRef}<br>prevSrc: ${prevSrc}<br>curSrc: ${curSrc}<br>newSrc: ${newSrc}<br><br>... SO Setting To PrevSrc (${prevSrc})`)
                  Media.Set(imgKey, prevSrc)
                  REGISTRY[imgKey].curSrc = prevSrc
              } else if (_.keys(imgData.srcs).includes(toggleRef)) {
                  Media.Set(imgKey, toggleRef)					
                  D.Alert(`toggleRef: ${toggleRef}<br>prevSrc: ${prevSrc}<br>curSrc: ${curSrc}<br>newSrc: ${newSrc}<br><br>... SO Setting To Toggle Ref (${toggleRef})`)
                  REGISTRY[imgKey].curSrc = toggleRef
              } else {				
                  D.Alert(`toggleRef: ${toggleRef}<br>prevSrc: ${prevSrc}<br>curSrc: ${curSrc}<br>newSrc: ${newSrc}<br><br>... SO Setting To Base`)
                  Media.Set(imgKey, "base")
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
                delete IMAGEREGISTRY[imgData.name]
                return true
            } else if (imgData && IMAGEREGISTRY[imgData.name]) {
                delete IMAGEREGISTRY[imgData.name]
                return true
            } else if (_.isString(imgRef) && IMAGEREGISTRY[imgRef]) {
                delete IMAGEREGISTRY[imgRef]
                return true
            }
            return THROW(`Invalid image reference ${D.JSL(imgRef)}`, "removeImage")
        },
        removeImages = (imgString, isRegOnly) => {
            const imgNames = _.filter(_.keys(IMAGEREGISTRY), v => v.includes(imgString))
            for (const imgName of imgNames)
                removeImage(imgName, isRegOnly)

        },
        cleanRegistry = () => {
            for (const imgName of _.keys(IMAGEREGISTRY))
                if (!getImageObj(imgName))
                    removeImage(imgName)

        },
        orderImages = (imgRefs, isToBack = false) => {
            let imgObjs
            //D.Alert(`Ordering Media: ${D.JS(imgRefs)}`)
            if (imgRefs === "map")
                imgObjs = getImageObjs(IMAGELAYERS[TimeTracker.IsDay() && C.ROOT.Chars.isDaylighterSession ? "daylighterMap" : "map"])
            else if (imgRefs === "objects")
                imgObjs = getImageObjs(IMAGELAYERS.objects)
            else
                imgObjs = getImageObjs(imgRefs)
            //D.Alert(`Retrieved Media: ${D.JS(imgObjs)}`)
            //D.Alert(`Retrieved Media: ${D.JS(getImageKeys(imgObjs))}`)
            if (!isToBack)
                imgObjs.reverse()
            for (const imgObj of imgObjs)
                if (VAL({graphicObj: imgObj}))
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
                if (VAL({graphicObj: imgObj}))
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

        }
    // #endregion

    // #region TEXT OBJECTS: Registering & Manipulating Text Objects //(textObj, hostName, objLayer, !isStartActive || isStartActive !== "false", !isShadow || isShadow !== "false", D.ParseToObj(args.join(" ")))
    const getTextObj = (textRef) => {
            return textRef
        },
        getTextData = (textRef) => {

        },
        getTextWidth = (textRef, text) => {
            const textObj = getTextObj(textRef)
            if (VAL({ text: textObj }, "getTextWidth")) {
                const font = textObj.get("font_family").split(" ")[0].replace(/[^a-zA-Z]/gu, ""),
                    size = textObj.get("font_size"),
                    chars = text.split(""),
                    fontRef = state.DATA.CHARWIDTH[font],
                    charRef = fontRef && fontRef[size]
                let width = 0
                if (!fontRef || !charRef) {
                    DB(`No font reference for '${font}' at size '${size}', attempting default`, "getTextWidth")

                    return text.length * (parseInt(textObj.get("width")) / textObj.get("text").length)
                }
                _.each(chars, char => {
                    if (!charRef[char] && charRef[char] !== " " && charRef[char] !== 0)
                        DB(`... MISSING '${char}' in '${font}' at size '${size}'`, "getTextWidth")
                    else
                        width += parseInt(charRef[char])
                })
                return width
            }
            return false
        },
        regText = (textRef, hostName, activeLayer, startActive, isNeedingShadow, options = {}, isSilent = false) => {
            // D.Alert(`Options for '${D.JS(imgName)}': ${D.JS(options)}`, "IMAGES: regImage")
            const textObj = getTextObj(textRef)
            if (VAL({ text: textObj })) {
                if (!(hostName && activeLayer))
                    return THROW("Must supply host name and active layer for regText.", "RegText")
                const name = `${hostName.replace(/(_|\d|#)+$/gu, "")}_${_.filter(_.keys(TEXTREGISTRY), k => k.includes(hostName.replace(/(_|\d|#)+$/gu, ""))).length + 1}`,
                    params = {
                        left: options.left || textObj.get("left") || TEXTREGISTRY[name].left,
                        top: options.top || textObj.get("top") || TEXTREGISTRY[name].top,
                        height: options.height || textObj.get("height") || TEXTREGISTRY[name].height,
                        width: options.width || textObj.get("width") || TEXTREGISTRY[name].width,
                        font_size: options.fontsize || textObj.get("font_size") || TEXTREGISTRY[name].font_size,
                        color: options.color || textObj.get("color") || TEXTREGISTRY[name].color,
                        font_family: options.fontfamily || textObj.get("font_family") || TEXTREGISTRY[name].font_family,
                        text: options.text || textObj.get("text") || ""
                    }
                TEXTREGISTRY[name] = {
                    id: textObj.id,
                    name,
                    left: params.left,
                    top: params.top,
                    height: params.height,
                    width: params.width,
                    font_size: params.font_size,
                    color: params.color,
                    font_family: params.font_family,
                    text: params.text,
                    activeLayer: activeLayer,
                    startActive: !(startActive === "false" || startActive === false)
                }
                if (isNeedingShadow) {
                    const shadowParams = Object.assign({}, params)
                    shadowParams.left += 5
                    shadowParams.top += 5
                    shadowParams.color = "rgb(0, 0, 0, 0)"
                    shadowParams.shadowMaster = textObj.id
                    shadowParams.shadow = undefined
                    const shadowObj = makeText(hostName + "Shadow", false, shadowParams, isSilent)
                    TEXTREGISTRY[name].shadow = shadowObj.id
                }
                if (!TEXTREGISTRY[name].startActive) {
                    setText(name, "")
                    layerText([name], "gmlayer")
                } else {
                    setText(name, TEXTREGISTRY[name].text)
                    layerText([name], TEXTREGISTRY[name].activeLayer)
                }
                if (!isSilent)
                    D.Alert(`Host obj for '${D.JS(name)}' registered: ${D.JS(TEXTREGISTRY[name])}`, "IMAGES: regText")

                return getTextData(name)
            }

            return THROW(`Invalid text reference '${D.JSL(textRef)}'`, "regText")
        },
        makeText = (hostName, isNeedingShadow, options = {}, isSilent = false) => {
            const textObj = createObj("text", {
                    _pageid: options._pageID || D.PAGEID(),
                    text: options.text || "",
                    left: options.left || 200,
                    top: options.top || 200,
                    font_size: options.font_size || 24,
                    color: options.color || "rgb(255,0,0)",
                    font_family: options.font_family || "Candal",
                    layer: options.layer || options.activeLayer || "objects",
                    controlledby: options.controlledby || ""
                }),
                activeLayer = options.activeLayer || "gmlayer",
                isStartingActive = !(options.startActive === "false" || options.startActive === false),
                params = _.omit(options, ["activeLayer", "startActive"])
            regText(textObj, hostName, activeLayer, isStartingActive, isNeedingShadow, params, isSilent)

            return textObj
        },
        setText = (textRef, text, params = {}) => {
            const textObj = getTextObj(textRef),
                textData = getTextData(textRef)
            params.text = text
            textObj.set(params)
            for (const key of _.intersection(_.keys(params), _.keys(TEXTREGISTRY[name])))
                TEXTREGISTRY[name][key] = params[key]
            if (textData.shadow) {
                const shadowObj = getTextObj(textData.shadow),
                    shadowParams = _.omit(params, ["height", "width", "color"])
                for (const key of _.intersection(_.keys(params), ["left", "top"]))
                    shadowParams[key] = params[key] + 5
                shadowObj.set(shadowParams)
                //toFront(shadowObj)
            }
            //toFront(textObj)
        },
        setTextData = (textRef, params = {}) => {

        },
        toggleText = (textRef, isActive, text) => {
            const textObj = getTextObj(textRef),
                textData = getTextData(textRef)
            if (textObj && isActive) {
                textObj.set("layer", textData.activeLayer)
                if (text)
                    setText(textRef, text)
            } else if (textObj && !isActive) {
                textObj.set("layer", "walls")
                setText(textRef, "")
            }
        },
        removeText = (textRef, isUnregOnly = true) => {

        },
        removeTexts = (textRefs, isUnregOnly = true) => {

        },
        layerText = (textRefs, layer) => {

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
        IMAGELAYERS: IMAGELAYERS,

        GetTextObj: getTextObj,
        GetTextData: getTextData,
        GetTextWidth: getTextWidth,
        MakeText: makeText,
        RegText: regText,
        RemoveText: removeText,
        RemoveAllText: removeTexts,
        SetText: setText,
        SetTextData: setTextData,
        ToggleText: toggleText,
        LayerText: layerText
    }
})()

on("ready", () => {
    Media.RegisterEventHandlers()
    Media.CheckInstall()
    D.Log("Media Ready!")
})
void MarkStop("Media")