void MarkStart("Media")
const Media = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Media",
        CHATCOMMAND = ["!img", "!txt"],
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
                if (msg.type === "api" && (!GMONLY || playerIsGM(msg.playerid)) && (!CHATCOMMAND || CHATCOMMAND.includes(args[0]))) {
                    const who = msg.who || "API",
                        call = [args.shift(), args.shift()]
                    handleInput(msg, who, call, args)
                }
            })
            on("add:graphic", handleAdd)
        }
    // #endregion

    // #region LOCAL INITIALIZATION
    const initialize = () => {
        //D.Alert(`Initial STATEREF: ${D.JS(_.keys(STATEREF))}`)
        STATEREF.imageregistry = STATEREF.imageregistry || {}
        STATEREF.textregistry = STATEREF.textregistry || {}
        STATEREF.idregistry = STATEREF.idregistry || {}
        STATEREF.areas = STATEREF.areas || {}
        STATEREF.imgResizeDims = STATEREF.imgResizeDims || { height: 100, width: 100 }
        //D.Alert(`Initial STATEREF.textregistry: ${D.JS(_.keys(STATEREF.textregistry))}`)
    }
    // #endregion

    // #region EVENT HANDLERS: (HANDLEINPUT)
    const handleInput = (msg, who, call, args) => { 	// eslint-disable-line no-unused-vars
            let [srcName, hostName, txtObj, textObj, objLayer, objData, isStartActive, isShadow] = new Array(8),
                params = {}
            switch (call.shift().toLowerCase()) {
                case "!img":
                    switch (call.shift().toLowerCase()) {
                        case "adjust":
                            txtObj = getImageObj(msg)
                            txtObj.set(args.shift(), parseInt(args.shift()))
                            break
                        case "reg": case "register":
                            if (!args[0])
                                D.Alert("Syntax: !img reg &lt;hostName&gt; &lt;currentSourceName&gt; &lt;activeLayer(objects/map/walls/gmlayer)&gt; &lt;isStartingActive&gt; [params (\"key:value, key:value\")]<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;!img reg text &lt;hostName&gt; &lt;activeLayer(objects/map/walls/gmlayer)&gt; &lt;isStartingActive&gt; &lt;isMakingShadow&gt; [params (\"key:value, key:value\")]", "IMAGES: !img reg")
                            else
                                switch (args[0].toLowerCase()) {
                                    case "area":
                                        args.shift()
                                        if (!args[0]) {
                                            D.Alert("Syntax: !img reg area &lt;areaName&gt;", "IMAGES: !img reg area")
                                        } else {
                                            hostName = args.shift()
                                            txtObj = getImageObj(msg)
                                            if (!txtObj) {
                                                D.Alert("Select an image first!", "IMAGES: !img reg area")
                                            } else {
                                                AREAS[hostName] = {
                                                    top: parseInt(txtObj.get("top")),
                                                    left: parseInt(txtObj.get("left")),
                                                    height: parseInt(txtObj.get("height")),
                                                    width: parseInt(txtObj.get("width"))
                                                }
                                                D.Alert(`Area Registered: ${hostName}<br><br><pre>${D.JS(AREAS[hostName])}</pre>`, "IMAGES: !img reg area")
                                            }
                                        }
                                        break
                                    default:
                                        if (!args[0]) {
                                            D.Alert("Syntax: !img reg &lt;hostName&gt; &lt;currentSourceName&gt; &lt;activeLayer&gt; &lt;isStartingActive&gt; [params (\"key:value, key:value\")]", "IMAGES: !img reg")
                                        } else {
                                            txtObj = getImageObj(msg)
                                            DB(`Image Object: ${D.JS(getImageObj(msg))}<br><br><br>MSG:<br><br>${D.JS(msg)}`, "IMAGES: !img reg")
                                            if (!txtObj) {
                                                D.Alert("Select an image object first!", "IMAGES: !img reg")
                                            } else {
                                                [hostName, srcName, objLayer, isStartActive] = [args.shift(), args.shift(), args.shift(), args.shift()]
                                                if (hostName && srcName && objLayer && isStartActive)
                                                    regImage(txtObj, hostName, srcName, objLayer, !isStartActive || isStartActive !== "false", D.ParseToObj(args.join(" ")))
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
                                    txtObj = getImageObj(msg)
                                    if (!txtObj) {
                                        D.Alert("Select an image first!", "IMAGES: !img set position")
                                    } else if (!isRegImg(msg)) {
                                        D.Alert(`Image not registered.  To register selected image:
                        
                            <pre>!img reg &lt;hostName&gt; &lt;currentSourceName&gt; &lt;activeLayer&gt; &lt;isStartingActive&gt; [params ("key:value, key:value")]</pre>`, "IMAGES: !img set position")
                                    } else {
                                        [txtObj, hostName] = [getImageObj(msg), getImageKey(msg)]
                                        IMAGEREGISTRY[hostName] = IMAGEREGISTRY[hostName] || {}
                                        IMAGEREGISTRY[hostName].top = parseInt(txtObj.get("top"))
                                        IMAGEREGISTRY[hostName].left = parseInt(txtObj.get("left"))
                                        IMAGEREGISTRY[hostName].height = parseInt(txtObj.get("height"))
                                        IMAGEREGISTRY[hostName].width = parseInt(txtObj.get("width"))
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
                                    txtObj = getImageObj(msg)
                                    if (!txtObj)
                                        D.Alert("Select an image first!", "IMAGES: !img set area")
                                    else
                                        setImageArea(txtObj, args.shift())
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
                                    if (getImageData(args[0])) { txtObj = getImageObj(args.shift()) }
                                    else if (getImageObj(msg)) { txtObj = getImageObj(msg) }
                                    else {
                                        THROW("Bad image reference.", "!img set params")
                                        break
                                    }
                                    for (const param of args)
                                        params[param.split(":")[0]] = param.split(":")[1]

                                    setImgParams(txtObj, params)
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
                                        if (params.length === 2 && VAL({number: _.map(params, v => v.split(":")[1])}, null, true)) {
                                            _.each(params, v => {
                                                STATEREF.imgResizeDims[v.split(":")[0]] = parseInt(v.split(":")[1])
                                            })
                                        } else {
                                            D.Alert("Must supply either a valid C.IMAGES key (default) OR \"height:<height>, width:<width>\"", "IMAGES, !img toggle resize")
                                            imgResize = false
                                            break
                                        }
                                        D.Alert(`New images automatically resized to height: ${STATEREF.imgResizeDims.height}, width: ${STATEREF.imgResizeDims.width}.`, "IMAGES, !img toggle resize")
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
                            txtObj = getImageObj(args.shift())
                            srcName = txtObj.get("imgsrc")
                            txtObj = getImageObj(args.shift())
                            txtObj.set("imgsrc", srcName)
                            break
                        case "get":
                            switch (args.shift().toLowerCase()) {
                                case "data":
                                    txtObj = getImageObj(msg)
                                    if (txtObj) {
                                        D.Alert(getImageData(txtObj), "IMAGES, !img getData")
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
                    break
                case "!txt":
                    switch (call.shift().toLowerCase()) {
                        case "clearregistry":
                            STATEREF.textregistry = {}
                            STATEREF.idregistry = {}
                            break
                        case "reg": case "register":
                            if (!args[0]) {
                                D.Alert("Syntax: !txt reg &lt;hostName&gt; &lt;activeLayer(objects/map/walls/gmlayer)&gt; &lt;isStartingActive&gt; &lt;isMakingShadow&gt; [params (\"key:value, key:value\")]", "MEDIA: !txt reg")
                            } else {
                                textObj = getTextObj(msg)
                                if (!textObj) {
                                    D.Alert("Select a text object first!", "MEDIA: !txt reg")
                                } else {
                                    [hostName, objLayer, isStartActive, isShadow] = [args.shift(), args.shift(), args.shift(), args.shift()]
                                    if (hostName && objLayer)
                                        regText(textObj, hostName, objLayer, !isStartActive || isStartActive !== "false", !isShadow || isShadow !== "false", D.ParseToObj(args.join(" ")))
                                    else
                                        D.Alert("Syntax: !txt reg &lt;hostName&gt; &lt;activeLayer&gt; &lt;isStartingActive&gt; &lt;isMakingShadow&gt; [params (\"key:value, key:value\")]", "MEDIA: !txt reg")
                                }
                            }
                            break
                        case "set":
                            switch (args[0].toLowerCase()) {
                                case "pos": case "position":
                                    args.shift()
                                    txtObj = getTextObj(msg)
                                    if (!txtObj) {
                                        D.Alert("Select a text object first!", "MEDIA: !txt set position")
                                    } else if (!IDREGISTRY[txtObj.id]) {
                                        D.Alert(`Text not registered.  To register selected text:
                        
                            <pre>!txt reg &lt;hostName&gt; &lt;activeLayer(objects/map/walls/gmlayer)&gt; &lt;isStartingActive&gt; &lt;isMakingShadow&gt; [params ("key:value, key:value")]"</pre>`, "MEDIA: !txt set position")
                                    } else {
                                        [txtObj, hostName] = [getTextObj(msg), getTextKey(msg)]
                                        setText(textObj, {top: parseInt(txtObj.get("top")), left: parseInt(txtObj.get("left")), layer: textObj.get("layer")})
                                        D.Alert(`Position Set for Text ${hostName}<br><br><pre>${D.JS(TEXTREGISTRY[hostName])}</pre>`)
                                    }
                                    break
                                case "params":
                                    args.shift()
                                    txtObj = getTextObj(args[0]) || getTextObj(msg)
                                    if (VAL({textObj: txtObj}, "!txt set params")) {
                                        for (const param of args)
                                            params[param.split(":")[0]] = param.split(":")[1]
                                        setText(txtObj, params)
                                    }
                                    break
                                default:
                                    txtObj = getTextObj(args[0], true)
                                    if (!txtObj)
                                        txtObj = D.GetSelected(msg)[0]
                                    else
                                        args.shift()
                                    if (VAL({textObj: txtObj}, "!txt set"))
                                        setText(txtObj, {text: args.join(" ")})
                                    break
                            // no default                                    
                            }
                            break
                        case "clean": case "cleanreg": case "cleanregistry":
                            cleanTextRegistry()
                            break
                        case "del": case "delete":
                            if (args[0].toLowerCase() === "all") {
                                args.shift()
                                for (hostName of _.keys(TEXTREGISTRY))
                                    if (!args[0] || hostName.toLowerCase().includes(args.join(" ").toLowerCase()))
                                        removeText(hostName)
                            } else if (getTextObjs(msg).length) {
                                for (const obj of getTextObjs(msg))
                                    removeText(obj)
                            } else if (args[0] && getTextObj(args.join(" "))) {
                                removeText(args.join(" "))
                            } else {
                                D.Alert(`Provide "all" (plus an optional host name substring), a registered host name, or select text objects. <b>Syntax:</b><br><br><pre>!txt del all <hostSubstring>
                    !txt del <hostName></pre>`, "MEDIA: !txt del")
                            }
                            break
                        case "unreg": case "unregister":
                            if (args[0].toLowerCase() === "all") {
                                args.shift()
                                for (hostName of _.keys(TEXTREGISTRY))
                                    if (!args[0] || hostName.toLowerCase().includes(args.join(" ").toLowerCase()))
                                        removeText(hostName, true)
                            } else if (_.compact(getTextObjs(msg)).length) {
                                for (const obj of getTextObjs(msg))
                                    removeText(obj, true)
                            } else if (args[0]) {
                                removeText(args.join(" "), true)
                            } else {
                                D.Alert("Provide \"all\", a registered host name, or select text objects. <b>Syntax:</b><br><br><pre>!txt unreg all/<<hostName>>")
                            }
                            break
                        case "toggle":
                            switch (args.shift().toLowerCase()) {
                                case "on":
                                    DB(`Toggling ON: ${D.JS(args)}`, "!txt toggle")
                                    for (const param of args)
                                        toggleText(param, true)
                                    break
                                case "off":
                                    DB(`Toggling OFF: ${D.JS(args)}`, "!txt toggle")
                                    for (const param of args)
                                        toggleText(param, false)
                                    break
                                default:
                                    D.Alert("Must state either 'on' or 'off'.  <b>Syntax:</b><br><br><pre>!txt toggle &lt;on/off&gt; &lt;hostnames&gt;</pre>", "MEDIA: !txt toggle")
                                    break
                            }
                            break
                        case "align":
                            if (D.GetSelected(msg))
                                //alignTexts(msg, ...args)
                                break
                            break
                        case "get":
                            switch (args.shift().toLowerCase()) {
                                case "data":
                                    txtObj = getTextObj(msg)
                                    if (txtObj) {
                                        D.Alert(getTextData(txtObj), "!txt get data")
                                    } else {
                                        hostName = args.shift()
                                        if (hostName && TEXTREGISTRY[hostName])
                                            D.Alert(D.JS(TEXTREGISTRY[hostName]), `MEDIA: '${D.JS(hostName)}'`)
                                        else
                                            D.Alert("Syntax: !txt get data [<category> <name>] (or select a text object object)", "!txt get data")
                                    }
                                    break
                            // no default
                            }
                            break
                    // no default
                    }
                    break
                /* no default */
            }
        },
        handleAdd = obj => {
            if (imgRecord)
                LOG(obj.get("imgsrc"))
            if (imgResize)
                obj.set(STATEREF.imgResizeDims)
        }
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    let [imgRecord, imgResize] = [false, false]

    // #region CONFIGURATION
    const IMAGEREGISTRY = STATEREF.imageregistry,
        IDREGISTRY = STATEREF.idregistry,
        TEXTREGISTRY = STATEREF.textregistry,
        AREAS = STATEREF.areas,
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
                    return !isSilent && THROW(`Cannot find name of image from reference '${D.JSL(imgRef)}'`, "GetImageKey")
                else if (_.find(_.keys(IMAGEREGISTRY), v => v.toLowerCase().startsWith(imgName.toLowerCase())))
                    //D.Alert(`... returning: ${D.JS(_.keys(REGISTRY)[
                    //	_.findIndex(_.keys(REGISTRY), v => v.toLowerCase().startsWith(imgName.toLowerCase()))
                    //])}`)
                    return _.keys(IMAGEREGISTRY)[
                        _.findIndex(_.keys(IMAGEREGISTRY), v => v.toLowerCase().startsWith(imgName.toLowerCase()))
                    ]
                else
                    return !isSilent && THROW(`Cannot find image with name '${D.JSL(imgName)}' from reference ${D.JSL(imgRef)}`, "GetImageKey")

            } catch (errObj) {
                return !isSilent && THROW(`Cannot locate image with search value '${D.JSL(imgRef)}'`, "GetImageKey", errObj)
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
            try {
                if (getImageKey(imgRef)) {
                    return IMAGEREGISTRY[getImageKey(imgRef)]
                } else if (getImageObj(imgRef)) {
                    const imgObj = getImageObj(imgRef)
                    DB(`Retrieving data for UNREGISTERED Image Object ${D.JSL(imgRef)}`, "getImageData")

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
        /* eslint-disable-next-line no-unused-vars */
        getContainedImages = (imgRef) => {
            const imgObj = getImageObj(imgRef),
                boundaries = {
                    horiz: [parseInt(imgObj.get("left")) - parseInt(imgObj.get("width")) / 2, parseInt(imgObj.get("left")) + parseInt(imgObj.get("width")) / 2],
                    vert: [parseInt(imgObj.get("top")) - parseInt(imgObj.get("height")) / 2, parseInt(imgObj.get("top")) + parseInt(imgObj.get("height")) / 2]
                }
            DB(`boundaries: ${D.JS(boundaries)}`, "getContainedImages")
            const contImages = _.filter(findObjs({ _type: "graphic", _pageid: D.PAGEID }), v =>
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
                        left: options.left || imgObj.get("left") || IMAGEREGISTRY[name].left || C.IMAGES[baseName] && C.IMAGES[baseName].left,
                        top: options.top || imgObj.get("top") || IMAGEREGISTRY[name].top || C.IMAGES[baseName] && C.IMAGES[baseName].top,
                        height: options.height || imgObj.get("height") || IMAGEREGISTRY[name].height || C.IMAGES[baseName] && C.IMAGES[baseName].height,
                        width: options.width || imgObj.get("width") || IMAGEREGISTRY[name].width || C.IMAGES[baseName] && C.IMAGES[baseName].width
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
            const dataRef = C.IMAGES.defaults,
                imgObj = createObj("graphic", {
                    _pageid: params._pageID || D.PAGEID,
                    imgsrc: params.imgsrc || C.IMAGES.blank,
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
                    else if (_.isString(C.IMAGES[srcRef]))
                        srcURL = C.IMAGES[srcRef]
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
                                left: C.SANDBOX.width - 0.5 * iData.width
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
                                top: C.SANDBOX.height - 0.5 * iData.height
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
        removeImages = (imgString, isUnregOnly) => {
            const imgNames = _.filter(_.keys(IMAGEREGISTRY), v => v.includes(imgString))
            for (const imgName of imgNames)
                removeImage(imgName, isUnregOnly)

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
    const getTextKey = (textRef, isSilent = false) => {
            try {
                let textObj
                if (VAL({string: textRef})) {
                    if (TEXTREGISTRY[textRef])
                        return textRef
                    if (TEXTREGISTRY[`${textRef}_1`])
                        return `${textRef}_1`
                    if (IDREGISTRY[textRef])
                        return IDREGISTRY[textRef]
                }
                if (VAL({selected: textRef}))
                    textObj = D.GetSelected(textRef)
                if (VAL({textObj: textRef}))
                    textObj = textRef
                if (VAL({textObj: textObj}, "getTextKey"))
                    if (IDREGISTRY[textObj.id])
                        return IDREGISTRY[textObj.id]
                return !isSilent && THROW(`Cannot locate text key with search value '${D.JS(textRef)}'`, "getTextKey")
            } catch (errObj) {
                return !isSilent && THROW(`Cannot locate text key with search value '${D.JS(textRef)}'`, "getTextKey", errObj)
            }
        },
        getTextObj = (textRef, isSilent = false) => {
            try {
                let textObj
                if (VAL({ textObj: textRef }))
                    textObj = textRef
                else if (VAL({ string: textRef }))
                    if (getTextKey(textRef, isSilent))
                        textObj = getObj("text", TEXTREGISTRY[getTextKey(textRef)].id)
                    else
                        textObj = getObj("text", textRef) || null
                else if (VAL({ selected: textRef}))
                    textObj = D.GetSelected(textRef)[0]
                return textObj || !isSilent && THROW(`Bad text reference: ${D.JS(textRef)}`, "getTextObj")
            } catch (errObj) {
                return !isSilent && THROW(`Bad text reference: ${D.JS(textRef)}`, "getTextObj", errObj)
            }
        },
        getTextObjs = textRefs => {
            const txtRefs = VAL({ msg: textRefs }) ? D.GetSelected(textRefs) || [] : textRefs,
                textObjs = []
            if (VAL({ array: txtRefs })) {
                for (const txtRef of txtRefs)
                    textObjs.push(getTextObj(txtRef))
                return textObjs
            }
            return false
        },
        hasShadowObj = textRef => Boolean((getTextData(textRef) || {shadow: false}).shadow),
        getTextShadowObj = (textRef, isSilent = false) => {
            const textKey = getTextKey(textRef, isSilent)
            if (textKey)
                return getTextObj(TEXTREGISTRY[textKey].shadow, true) || !isSilent && THROW(`No shadow text object registered for ${D.JS(textKey)}`, "getTextShadowObj")
            return !isSilent && THROW(`Text reference '${textRef}' does not refer to a registered text object.`, "getTextShadowObj")
        },
        getTextData = (textRef, isSilent = false) => {
            try {
                if (getTextKey(textRef, isSilent)) {
                    return TEXTREGISTRY[getTextKey(textRef, isSilent)]
                } else if (getTextObj(textRef, isSilent)) {
                    const textObj = getTextObj(textRef, isSilent)
                    DB(`Retrieving data for UNREGISTERED Text Object ${D.JS(textRef)}`, "getTextData")
                    return {
                        id: textObj.id,
                        left: parseInt(textObj.get("left")),
                        top: parseInt(textObj.get("top")),
                        height: parseInt(textObj.get("height")),
                        width: parseInt(textObj.get("width")),
                        font: textObj.get("font_family"),
                        fontSize: textObj.get("font_size"),
                        color: textObj.get("color"),
                        text: textObj.get("text")
                    }
                }
                return !isSilent && THROW(`Text reference '${textRef}' does not refer to a registered text object.`, "getTextData")
            } catch (errObj) {
                return !isSilent && THROW(`Text reference '${textRef}' does not refer to a registered text object.`, "getTextData", errObj)
            }
        },
        getTextWidth = (textRef, text) => {
            const textObj = getTextObj(textRef)
            if (VAL({ textObj: textObj }, "getTextWidth")) {
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
        regText = (textRef, hostName, activeLayer, startActive, hasShadow, options = {}, isSilent = false) => {
            const textObj = getTextObj(textRef)
            DB(`regText(textRef, ${D.JS(hostName)}, ${D.JS(activeLayer)}, ${D.JS(startActive)}, ${D.JS(hasShadow)}, ${D.JS(options)}`, "regText")
            if (VAL({ text: textObj })) {
                if (!(hostName && activeLayer))
                    return THROW("Must supply host name and active layer for regText.", "RegText")
                const name = options.name && !TEXTREGISTRY[options.name] ? options.name : `${hostName.replace(/(_|\d|#)+$/gu, "")}_${_.filter(_.keys(TEXTREGISTRY), k => k.includes(hostName.replace(/(_|\d|#)+$/gu, ""))).length + 1}`,
                    curTextParams = {
                        left: textObj.get("left"),
                        top: textObj.get("top"),
                        font_size: textObj.get("font_size"),
                        color: textObj.get("color"),
                        font_family: textObj.get("font_family"),
                        text: textObj.get("text"),
                        layer: !(startActive === "false" || startActive === false) ? activeLayer : "gmlayer"
                    }
                setText(textObj, Object.assign(_.filter(_.pick(options, C.TEXTPROPS), (v, k) => curTextParams[k] !== v), {layer: curTextParams.layer}))
                TEXTREGISTRY[name] = Object.assign(
                    Object.assign(curTextParams, {
                        id: textObj.id,
                        name: name,
                        activeLayer: activeLayer,
                        startActive: !(startActive === "false" || startActive === false)                    
                    }), options)
                IDREGISTRY[textObj.id] = name
                if (hasShadow) {
                    const shadowOptions = Object.assign(_.omit(_.clone(TEXTREGISTRY[name]), "id"), {
                        name: `${name}Shadow`,
                        color: "rgb(0,0,0)",
                        left: TEXTREGISTRY[name].left + Math.round(TEXTREGISTRY[name].font_size/10),
                        top: TEXTREGISTRY[name].top + Math.round(TEXTREGISTRY[name].font_size/10),
                        shadowMaster: name
                    })
                    DB(`Shadow Options: ${D.JS(shadowOptions)}`, "regText")
                    const shadowObj = makeText(shadowOptions.name, TEXTREGISTRY[name].activeLayer, TEXTREGISTRY[name].startActive, false, shadowOptions, isSilent)
                    shadowOptions.id = shadowObj.id
                    toFront(shadowObj)
                    TEXTREGISTRY[name].shadow = shadowOptions.name
                }                
                toFront(textObj)       
                D.Alert(`Host obj for '${D.JS(name)}' registered: ${D.JS(TEXTREGISTRY[name])}`, "regText")
                return getTextData(name)
            }
            return !isSilent && THROW(`Invalid text reference '${D.JS(textRef)}'`, "regText")
        },
        makeText = (hostName, activeLayer, startActive, hasShadow, options = {}, isSilent = false) => {
            DB(`makeText(${D.JS(hostName)}, ${D.JS(activeLayer)}, ${D.JS(startActive)}, ${D.JS(hasShadow)}, ${D.JS(options)}`, "makeText")
            const isStartingActive = startActive || !(options.startActive === "false" || options.startActive === false),
                actLayer = activeLayer || options.activeLayer || options.layer || "objects",
                objParams = Object.assign({
                    _pageid: D.PAGEID,
                    text: "",
                    left: 200,
                    top: 200,
                    font_size: 24,
                    color: C.COLORS.brightred,
                    font_family: "Candal",
                    layer: isStartingActive ? actLayer : "gmlayer",
                    controlledby: ""
                }, _.pick(options, ...C.TEXTPROPS)),     
                textObj = createObj("text", objParams)
            regText(textObj, hostName, actLayer, isStartingActive, hasShadow, options, isSilent)
            return textObj
        },
        setText = (textRef, options = {}) => {
            const textObj = getTextObj(textRef),
                textData = getTextData(textRef),
                objParams = Object.assign(_.pick(options, C.TEXTPROPS))
            for (const key of _.intersection(_.keys(options), ["shiftleft", "shifttop"]))
                objParams[key.slice(5)] = textData[key.slice(5)] + parseInt(options[key])
            for (const key of _.intersection(_.keys(options), _.keys(textData)))
                TEXTREGISTRY[textData.name][key] = options[key]            
            textObj.set(objParams)
            if (textData.shadow) {
                const shadowObj = getTextShadowObj(textRef),
                    shadowOptions = _.omit(options, ["color", "shadow"]),
                    shadowData = getTextData(textData.shadow),
                    shadowObjParams = Object.assign(_.pick(shadowOptions, C.TEXTPROPS))
                for (const key of _.intersection(_.keys(shadowObjParams), ["left", "top"]))
                    shadowOptions[key] = TEXTREGISTRY[textData.name][key] + Math.round(shadowData.font_size/10)
                for (const key of _.intersection(_.keys(shadowOptions), _.keys(shadowData)))
                    TEXTREGISTRY[shadowData.name][key] = shadowOptions[key]
                for (const key of _.intersection(_.keys(shadowOptions), ["shiftleft", "shifttop"]))
                    shadowObjParams[key.slice(5)] = TEXTREGISTRY[shadowData.name][key.slice(5)] + parseInt(shadowOptions[key])
                shadowObj.set(shadowObjParams)
                toFront(shadowObj)
            }
            toFront(textObj)
        },
        setTextData = (textRef, params) => {
            _.each(params, (v, k) => {
                TEXTREGISTRY[getTextKey(textRef)][k] = v
            })
            return TEXTREGISTRY[getTextKey(textRef)]
        },
        toggleText = (textRef, isActive, text) => {
            const textObj = getTextObj(textRef),
                textData = getTextData(textRef),
                textParams = { layer: isActive ? textData.activeLayer : "gmlayer" }
            if (text)
                textParams.text = text
            setText(textObj, textParams)
        },
        removeText = (textRef, isUnregOnly) => {
            const txtObj = getTextObj(textRef),
                textData = getTextData(textRef)
            if (hasShadowObj(txtObj))
                removeText(`${textData.name}Shadow`, isUnregOnly)
            if (txtObj && !isUnregOnly)
                txtObj.remove()
            if (textData) {
                if (IDREGISTRY[textData.id])
                    delete IDREGISTRY[textData.id]
                if (TEXTREGISTRY[textData.name])
                    delete TEXTREGISTRY[textData.name]
                return true
            }
            return THROW(`Invalid text reference ${D.JSL(textRef)}`, "removeText")
        },
        removeTexts = (textString, isUnregOnly) => {
            const txtNames = _.filter(_.keys(TEXTREGISTRY), v => v.includes(textString))
            for (const txtName of txtNames)
                removeText(txtName, isUnregOnly)
        },        
        cleanTextRegistry = () => {
            for (const txtName of _.keys(TEXTREGISTRY))
                if (!getTextObj(txtName))
                    removeText(txtName)
        },
        layerText = (textRefs, layer) => {
            const textObjs = getTextObjs(textRefs, true)
            for (const textObj of textObjs) {
                textObj.set({layer: layer})
                if (hasShadowObj(textObj))
                    getTextShadowObj(textObj, true).set({layer: layer})
            }
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