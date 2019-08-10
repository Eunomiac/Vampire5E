void MarkStart("Media")
const Media = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Media",
        CHATCOMMAND = ["!img", "!text", "!anim"],
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
                if (msg.type === "api" && (!GMONLY || playerIsGM(msg.playerid) || msg.playerid === "API") && (!CHATCOMMAND || CHATCOMMAND.includes(args[0]))) {
                    const who = msg.who || "API",
                        call = [args.shift(), args.shift()]
                    handleInput(msg, who, call, args)
                }
            })
            on("add:graphic", handleAdd)
        },
        soundReady = () => { D.Log(`${SCRIPTNAME} Ready!`) }
    // #endregion

    // #region LOCAL INITIALIZATION
    const initialize = () => {
        STATEREF.imageregistry = STATEREF.imageregistry || {}
        STATEREF.textregistry = STATEREF.textregistry || {}
        STATEREF.idregistry = STATEREF.idregistry || {}
        STATEREF.areas = STATEREF.areas || {}
        STATEREF.imgResizeDims = STATEREF.imgResizeDims || { height: 100, width: 100 }
        STATEREF.activeAnimations = STATEREF.activeAnimations || []
        STATEREF.activeTimeouts = STATEREF.activeTimeouts || []
        STATEREF.curLocation = STATEREF.curLocation || "DistrictCenter:blank SiteCenter:blank"

        /*for (let i = 0; i < 10; i++) {
            STATEREF.imageregistry[`complicationEnhanced_${i+1}`].srcs = { base: "https://s3.amazonaws.com/files.d20.io/images/87914628/dgt1u4qF9byRIEo0YLkMKw/thumb.png?1564561010" }
            STATEREF.imageregistry[`complicationEnhanced_${i+1}`].activeSrc = "base"
            STATEREF.imageregistry[`complicationEnhanced_${i+1}`].activeLayer = "objects"
            STATEREF.imageregistry[`complicationEnhanced_${i+1}`].zIndex = 530
        }*/

    }
    // #endregion

    // #region EVENT HANDLERS: (HANDLEINPUT)
    const handleInput = (msg, who, call, args) => { 	// eslint-disable-line no-unused-vars
            let srcName, hostName, textObj, objLayer, objData, isStartActive, isShadow, justification, textParams,
                params = {}
            switch (call.shift().toLowerCase()) {
                case "!anim":
                    switch (call.shift().toLowerCase()) {
                        case "reg": case "register":
                            if (!args[0] || !D.GetSelected(msg)) 
                                D.Alert("Select an animation first!<br><br>Syntax: !anim reg &lt;animName&gt; &lt;activeLayer(objects/map/walls/gmlayer)&gt; &lt;timeout&gt;", "MEDIA: !anim reg")
                            else
                                regAnimation(msg, args.shift(), args.shift(), args.shift())
                            break
                        case "fire":
                            fireAnimation(args.shift())
                            break
                        // no default
                    }
                    break
                case "!img":
                    switch (call.shift().toLowerCase()) {
                        case "adjust":
                            textObj = getImageObj(msg)
                            textObj.set(args.shift(), parseInt(args.shift()))
                            break
                        case "reg": case "register":
                            if (!args[0])
                                D.Alert("Syntax: !img reg &lt;hostName&gt; &lt;currentSourceName&gt; &lt;activeLayer(objects/map/walls/gmlayer)&gt; &lt;isStartingActive&gt; [params (\"key:value, key:value\")]<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;!img reg text &lt;hostName&gt; &lt;activeLayer(objects/map/walls/gmlayer)&gt; &lt;isStartingActive&gt; &lt;isMakingShadow&gt; [params (\"key:value, key:value\")]", "MEDIA: !img reg")
                            else
                                switch (args[0].toLowerCase()) {
                                    case "area":
                                        args.shift()
                                        if (!args[0]) {
                                            D.Alert("Syntax: !img reg area &lt;areaName&gt;", "MEDIA: !img reg area")
                                        } else {
                                            hostName = args.shift()
                                            textObj = getImageObj(msg)
                                            if (!textObj) {
                                                D.Alert("Select an image first!", "MEDIA: !img reg area")
                                            } else {
                                                AREAS[hostName] = {
                                                    top: parseInt(textObj.get("top")),
                                                    left: parseInt(textObj.get("left")),
                                                    height: parseInt(textObj.get("height")),
                                                    width: parseInt(textObj.get("width"))
                                                }
                                                D.Alert(`Area Registered: ${hostName}<br><br><pre>${D.JS(AREAS[hostName])}</pre>`, "MEDIA: !img reg area")
                                            }
                                        }
                                        break
                                    default:
                                        if (!args[0]) {
                                            D.Alert("Syntax: !img reg &lt;hostName&gt; &lt;currentSourceName&gt; &lt;activeLayer&gt; &lt;isStartingActive&gt; [params (\"key:value, key:value\")]", "MEDIA: !img reg")
                                        } else {
                                            textObj = getImageObj(msg)
                                            DB(`Image Object: ${D.JS(getImageObj(msg))}<br><br><br>MSG:<br><br>${D.JS(msg)}`, "MEDIA: !img reg")
                                            if (!textObj) {
                                                D.Alert("Select an image object first!", "MEDIA: !img reg")
                                            } else {
                                                [hostName, srcName, objLayer, isStartActive] = [args.shift(), args.shift(), args.shift(), args.shift()]
                                                if (hostName && srcName && objLayer && isStartActive)
                                                    regImage(textObj, hostName, srcName, objLayer, !isStartActive || isStartActive !== "false", D.ParseToObj(args.join(" ")))
                                                else
                                                    D.Alert("Syntax: !img reg &lt;hostName&gt; &lt;currentSourceName&gt; &lt;activeLayer&gt; &lt;isStartingActive&gt; [params (\"key:value, key:value\")]", "MEDIA: !img reg")
                                            }
                                        }
                                        break
                                }
                            break
                        case "set":
                            switch (args.shift().toLowerCase()) {
                                case "pos": case "position":
                                    textObj = getImageObj(msg)
                                    if (!textObj) {
                                        D.Alert("Select an image first!", "MEDIA: !img set position")
                                    } else if (!isRegImg(msg)) {
                                        D.Alert(`Image not registered.  To register selected image:
                        
                            <pre>!img reg &lt;hostName&gt; &lt;currentSourceName&gt; &lt;activeLayer&gt; &lt;isStartingActive&gt; [params ("key:value, key:value")]</pre>`, "MEDIA: !img set position")
                                    } else {
                                        [textObj, hostName] = [getImageObj(msg), getImageKey(msg)]
                                        IMAGEREGISTRY[hostName] = IMAGEREGISTRY[hostName] || {}
                                        IMAGEREGISTRY[hostName].top = parseInt(textObj.get("top"))
                                        IMAGEREGISTRY[hostName].left = parseInt(textObj.get("left"))
                                        IMAGEREGISTRY[hostName].height = parseInt(textObj.get("height"))
                                        IMAGEREGISTRY[hostName].width = parseInt(textObj.get("width"))
                                        D.Alert(`Position Set for Image ${hostName}<br><br><pre>${D.JS(IMAGEREGISTRY[hostName])}</pre>`)
                                    }
                                    break
                                case "source": case "src":
                                    if (VAL({ token: (D.GetSelected(msg) || [])[0] })) {
                                        hostName = Media.GetData(D.GetSelected(msg)[0]).name
                                        srcName = args[0]
                                    } else {
                                        [hostName, srcName] = args
                                    }
                                    if (isRegImg(hostName))
                                        setImage(hostName, srcName)
                                    else
                                        D.Alert(`Image name ${D.JS(hostName)} is not registered.`, "MEDIA: !img set src")
                                    break
                                case "area":
                                    textObj = getImageObj(msg)
                                    if (!textObj)
                                        D.Alert("Select an image first!", "MEDIA: !img set area")
                                    else
                                        setImageArea(textObj, args.shift())
                                    break
                                case "layer":
                                    objLayer = args.pop()
                                    layerImages(args.length ? args : msg, objLayer)
                                    break
                                case "order":
                                    orderMedia()
                                    break
                                case "params":
                                    if (getImageData(args[0])) { textObj = getImageObj(args.shift()) }
                                    else if (getImageObj(msg)) { textObj = getImageObj(msg) }
                                    else {
                                        THROW("Bad image reference.", "!img set params")
                                        break
                                    }
                                    for (const param of args)
                                        params[param.split(":")[0]] = param.split(":")[1]

                                    setMediaParams(textObj, params)
                                    break
                                case "token":
                                    toggleToken(D.GetSelected(msg)[0] || args.shift(), args.shift())
                                    break
                                case "loc": case "location": {                                    
                                    DB(`SET LOCATION COMMAND RECEIVED.  MSG: ${D.JS(msg)}`, "!img set loc")         
                                    setLocation(args.join(" "))
                                    break
                                }
                            // no default
                            }
                            break
                        case "clean": case "cleanreg": case "cleanregistry":
                            cleanRegistry()
                            break
                        case "add":
                            switch (args.shift().toLowerCase()) {
                                case "src": case "source":
                                    [hostName, srcName] = args
                                    if (isRegImg(hostName)) {
                                        hostName = getImageKey(hostName)
                                        if (!_.isObject(IMAGEREGISTRY[hostName].srcs))
                                            IMAGEREGISTRY[hostName].srcs = {}
                                        if (srcName)
                                            addImgSrc(msg, hostName, srcName)
                                        else
                                            D.Alert(`Invalid image name '${D.JS(srcName)}'`, "MEDIA: !img add src")
                                    } else {
                                        D.Alert(`Host name '${D.JS(hostName)}' not registered.`, "MEDIA: !img add src")
                                    }
                                    break
                                default:
                                    D.Alert("<b>Syntax:<br><br><pre>!img add &lt;src/area&gt; &lt;hostName&gt; &lt;srcName&gt;</pre>", "MEDIA: !img add")
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
                    !img del <hostName></pre>`, "MEDIA: !img del")
                            }
                            break
                        case "unreg": case "unregister":
                        //D.Alert(`ARGS: ${D.JS(args)}<br><br>getImageObj('${D.JS(args.join(" "))}'):<br><br>${D.JS(getImageObj(args.join(" ")))}`)
                            if (args[0] && args[0].toLowerCase() === "all") {
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
                                        D.Alert("Logging image data as they are added to the sandbox.", "MEDIA, !img toggle log")
                                    else
                                        D.Alert("Image logging disabled.", "MEDIA, !img toggle log")
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
                                            D.Alert("Must supply either a valid C.IMAGES key (default) OR \"height:<height>, width:<width>\"", "MEDIA, !img toggle resize")
                                            imgResize = false
                                            break
                                        }
                                        D.Alert(`New images automatically resized to height: ${STATEREF.imgResizeDims.height}, width: ${STATEREF.imgResizeDims.width}.`, "MEDIA, !img toggle resize")
                                    } else {
                                        D.Alert("Image resizing disabled.", "MEDIA, !img toggle resize")
                                    }
                                    break
                                default:
                                    D.Alert("Must state either 'on', 'off', 'log' or 'resize'.  <b>Syntax:</b><br><br><pre>!img toggle &lt;on/off&gt; &lt;hostnames&gt;</pre><br><pre>!img toggle log/resize</pre>", "MEDIA: !img toggle")
                                    break
                            }
                            break
                        case "align":
                            if (D.GetSelected(msg))
                                alignImages(msg, ...args)
                            break
                        case "copy":
                            textObj = getImageObj(args.shift())
                            srcName = textObj.get("imgsrc")
                            textObj = getImageObj(args.shift())
                            textObj.set("imgsrc", srcName)
                            break
                        case "get":
                            switch (args.shift().toLowerCase()) {
                                case "weatherlayers": {
                                    const layerStatus = {}
                                    for (const weatherLayer of ["WeatherFrost", "WeatherFog", "WeatherMain", "WeatherGround", "WeatherClouds", "Horizon_1", "Horizon_2"]) {
                                        const imgObj = getImageObj(weatherLayer)
                                        if (!VAL({imgObj: imgObj}))
                                            layerStatus[weatherLayer] = "NOT FOUND!"
                                        else
                                            layerStatus[weatherLayer] = `TopLeft: ${parseInt(imgObj.get("left") - 0.5*imgObj.get("width"))} x ${parseInt(imgObj.get("top") - 0.5*imgObj.get("height"))}, BotRight: ${
                                                parseInt(imgObj.get("left") + 0.5*imgObj.get("width"))} x ${parseInt(imgObj.get("top") + 0.5*imgObj.get("height"))}<br>Layer: ${imgObj.get("layer")}<br>Source: ${imgObj.get("imgsrc")}`
                                    }
                                    D.Alert(D.JS(layerStatus,true))

                                    break
                                }
                                case "data":
                                    textObj = getImageObj(msg)
                                    if (textObj) {
                                        D.Alert(getImageData(textObj), "MEDIA, !img getData")
                                    } else {
                                        hostName = args.shift()
                                        if (hostName && IMAGEREGISTRY[hostName])
                                            D.Alert(D.JS(IMAGEREGISTRY[hostName]), `IMAGES: '${D.JS(hostName)}'`)
                                        else
                                            D.Alert("Syntax: !img get data [<category> <name>] (or select an image object)", "MEDIA, !img get data")
                                    }
                                    break
                                case "all":
                                    objData = _.map(IMAGEREGISTRY, v => `${v.name}: ${v.startActive ? v.activeLayer.toUpperCase() : v.activeLayer.toLowerCase()} ${_.isObject(v.srcs) ? _.keys(v.srcs) : v.srcs}`)
                                    D.Alert(D.JS(objData), "MEDIA, !img get all")
                                    break
                                case "names":
                                    D.Alert(`<b>IMAGE NAMES:</b><br><br>${D.JS(_.keys(IMAGEREGISTRY))}`)
                                    break
                            // no default
                            }
                            break
                        case "fix":
                            switch (args.shift().toLowerCase()) {
                                case "weatherlayers":
                                    for (const layerName of ["WeatherFrost_1", "WeatherFog_1", "WeatherMain_1", "WeatherGround_1", "WeatherClouds_1", "Horizon_1", "Horizon_2"]) {
                                        setImgData(layerName, {
                                            name: layerName,
                                            left: 1340,
                                            top: 832,
                                            height: 1664,
                                            width: 2680,
                                            activeLayer: "map",
                                            startActive: true
                                        })
                                        let imgObj = getImageObj(layerName)
                                        imgObj.set({
                                            name: layerName,
                                            left: 1340,
                                            top: 832,
                                            height: 1664,
                                            width: 2680,
                                            layer: "map"                                            
                                        })
                                    }
                                    for (const layerName of ["WeatherFrost_1", "WeatherFog_1", "WeatherMain_1", "WeatherGround_1", "TLShroud_1", "WeatherClouds_1", "AirLightLeft_1", "AirLightMid_1", "AirLightTop_1", "AirLightCN_4", "AirLightCN_5", "HungerTopLeft_1", "HungerTopRight_1", "HungerBotLeft_1", "HungerBotRight_1", "Horizon_1", "Horizon_2", "ComplicationMat_1"]) {
                                        let imgObj = getImageObj(layerName)
                                        imgObj.set({
                                            name: layerName,
                                            layer: "map"
                                        })
                                        toBack(imgObj)
                                    }
                                    break
                                // no default
                            }
                            break
                        case "test":
                            switch (args.shift().toLowerCase()) {
                                case "spread": {
                                    const maxWidth = parseInt(args.shift())
                                    spreadImages("NegFlagLeft", "NegFlagRight", "NegFlagMid", getTextWidth("posFlagTest", args.join(" ")) + 90, 40, maxWidth)
                                    setText("posFlagTest", args.join(" "))
                                    break
                                }
                                // no default
                            }
                    // no default
                    }
                    break
                case "!text":
                    switch (call.shift().toLowerCase()) {                                                
                        case "get":
                            switch (args.shift().toLowerCase()) {
                                case "data":
                                    textObj = VAL({selection: msg}) ? getTextObj(msg) : getTextObj(args.shift())
                                    if (textObj)
                                        D.Alert(getTextData(textObj), "!text get data")
                                    else
                                        D.Alert("Syntax: !text get data [<name>] (or select a text object object)", "!text get data")
                                    break
                                case "names":
                                    D.Alert(D.JS(_.keys(TEXTREGISTRY)), "!text get names")
                                    break
                                case "widths": {
                                    const dbStrings = []
                                    for (const textData of _.values(STATEREF.textregistry)) {
                                        textData.justification = "left"
                                        const textObj = getObj("text", textData.id)
                                        if (textObj) {
                                            let width = textObj.get("width"),
                                                text = textObj.get("text"),
                                                left = textObj.get("left"),
                                                textWidth = getTextWidth(textObj, text)
                                            if (width === 0) {
                                                textObj.set("left", left + 10)
                                                width = textObj.get("width")
                                                textObj.set("left", left)
                                            }
                                            dbStrings.push(`${textData.name}: width: ${width} --> ${textWidth}`)
                                        }
                                    }
                                    D.Alert(`${dbStrings.join("<br>")}`, "Text Width Check")
                                    break
                                }
                                // no default
                            }
                            break
                        case "set":
                            switch (args[0].toLowerCase()) {
                                case "pos": case "position":
                                    args.shift()
                                    textObj = getTextObj(msg)
                                    if (!textObj) {
                                        D.Alert("Select a text object first!", "MEDIA: !text set position")
                                    } else if (!IDREGISTRY[textObj.id]) {
                                        D.Alert("Text not registered.  To register selected text:<br><br><pre>!text reg &lt;hostName&gt; &lt;activeLayer(objects/map/walls/gmlayer)&gt; &lt;isStartingActive&gt; &lt;isMakingShadow&gt; [params (\"key:value, key:value\")]</pre>", "!text set position")
                                    } else {
                                        hostName = getTextKey(msg)
                                        setText(textObj, {top: parseInt(textObj.get("top")), left: getHorizBase(textObj), layer: textObj.get("layer")})
                                        D.Alert(`Position Set for Text ${hostName}<br><br><pre>${D.JS(TEXTREGISTRY[hostName])}</pre>`)
                                    }
                                    break
                                case "justify": case "justification": case "just": {
                                    args.shift()
                                    const justification = args.shift() || "center"
                                    if (VAL({selection: msg})) 
                                        for(const textObj of D.GetSelected(msg))
                                            justifyText(textObj, justification)
                                    else 
                                        for (const textKey of args)
                                            justifyText(textKey, justification)                            
                                    break
                                }
                                case "params":
                                    args.shift()
                                    textObj = getTextObj(args[0]) || getTextObj(msg)
                                    if (VAL({textObj: textObj}, "!text set params")) {
                                        for (const param of args)
                                            params[param.split(":")[0]] = param.split(":")[1]
                                        setText(textObj, params)
                                    }
                                    break                                
                                case "order":
                                    orderMedia()
                                    break
                                default:
                                    textObj = getTextObj(args[0], true)
                                    if (!textObj)
                                        textObj = D.GetSelected(msg)[0]
                                    else
                                        args.shift()
                                    if (VAL({textObj: textObj}, "!text set"))
                                        setText(textObj, {text: args.join(" ")})
                                    break
                            // no default                                    
                            }
                            break
                        case "clean": case "cleanreg": case "cleanregistry":
                            cleanTextRegistry()
                            break
                        case "reset": case "resetreg": case "resetregistry":
                            resetTextRegistry()
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
                                D.Alert(`Provide "all" (plus an optional host name substring), a registered host name, or select text objects. <b>Syntax:</b><br><br><pre>!text del all <hostSubstring>
                    !text del <hostName></pre>`, "!text del")
                            }
                            break
                        case "rereg": case "reregister":   
                            if (VAL({selection: msg})) {                         
                                const textData = getTextData(msg, true)
                                args[0] = args[0] || textData.name
                                args[1] = args[1] || textData.activeLayer
                                args[2] = args[2] || textData.startActive
                                args[3] = args[3] || hasShadowObj(msg)
                                args[4] = args[4] || textData.justification
                                textParams = args.slice(4).join(" ")
                                textParams = _.compact([
                                    textParams.includes("vertAlign") ? "" : `vertAlign:${textData.vertAlign || "top"}`,
                                    textParams.includes("maxWidth") ? "" : `maxWidth:${textData.maxWidth || 0}`,
                                    textParams.includes("zIndex") ? "" : `zIndex:${textData.zIndex || 300}`
                                ]).join(",") + textParams
                                removeText(msg, true, true)
                            }
                            /* falls through */
                        case "reg": case "register":
                            if (!args[0]) {
                                D.Alert("Syntax: !text reg &lt;hostName&gt; &lt;activeLayer(objects/map/walls/gmlayer)&gt; &lt;isStartingActive&gt; &lt;isMakingShadow&gt; &lt;justification&gt; [params (\"key:value, key:value\")]", "MEDIA: !text reg")
                            } else {
                                textObj = getTextObj(msg)
                                if (!textObj) {
                                    D.Alert("Select a text object first!", "MEDIA: !text reg")
                                } else {
                                    [hostName, objLayer, isStartActive, isShadow, justification] = [args.shift(), args.shift(), args.shift(), args.shift(), args.shift()]
                                    textParams = textParams || args.join(" ")
                                    if (hostName && objLayer)
                                        regText(textObj, hostName, objLayer, !isStartActive || isStartActive !== "false", !isShadow || isShadow !== "false", justification || "center", D.ParseToObj(textParams))
                                    else
                                        D.Alert("Syntax: !text reg &lt;hostName&gt; &lt;activeLayer&gt; &lt;isStartingActive&gt; &lt;isMakingShadow&gt; &lt;justification&gt; [params (\"key:value, key:value\")]", "MEDIA: !text reg")
                                }
                            }
                            break
                        case "unreg": case "unregister":
                            if (args[0] && args[0].toLowerCase() === "all") {
                                args.shift()
                                for (hostName of _.keys(TEXTREGISTRY))
                                    if (!args[0] || hostName.toLowerCase().includes(args.join(" ").toLowerCase()))
                                        removeText(hostName, true, true)
                            } else if (args[0]) {
                                removeText(args.join(" "), true, true)
                            } else if (_.compact(getTextObjs(msg)).length) {
                                for (const obj of getTextObjs(msg))
                                    removeText(obj, true, true)
                            } else {
                                D.Alert("Provide \"all\", a registered host name, or select text objects. <b>Syntax:</b><br><br><pre>!text unreg all/<<hostName>>")
                            }
                            break
                        case "check": {
                            checkTextRegistration(args)
                            break
                        }
                        case "toggle":
                            switch (args.shift().toLowerCase()) {
                                case "on":
                                    DB(`Toggling ON: ${D.JS(args)}`, "!text toggle")
                                    for (const param of args)
                                        toggleText(param, true)
                                    break
                                case "off":
                                    DB(`Toggling OFF: ${D.JS(args)}`, "!text toggle")
                                    for (const param of args)
                                        toggleText(param, false)
                                    break
                                default:
                                    D.Alert("Must state either 'on' or 'off'.  <b>Syntax:</b><br><br><pre>!text toggle &lt;on/off&gt; &lt;hostnames&gt;</pre>", "MEDIA: !text toggle")
                                    break
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
    const SHADOWFACTOR = 15, 
        IMAGEREGISTRY = STATEREF.imageregistry,
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

    // #region MEDIA OBJECT FOUNDATIONS: Basic data common to graphic and text objects.
    const getMediaObjs = medRefs => _.compact(_.map(_.flatten([medRefs]), v => getImageObj(v, true) || getTextObj(v, true) || null)),
        getMediaObj = medRef => (getMediaObjs(medRef) || [null])[0],
        getRegistry = medRef => getImageData(medRef, true) ? IMAGEREGISTRY : getTextData(medRef, true) ? TEXTREGISTRY : null,
        getMediaKey = medRef => getImageKey(medRef, true) || getTextKey(medRef, true) || null,
        getMediaData = medRef => getImageData(medRef, true) || getTextData(medRef, true) || null,
        setMediaParams = (medRefs, params) => {
            const medObjs = getMediaObjs(medRefs)
            if (VAL({imgObjORtextObj: medObjs}, "setMediaParams", true))
                for (const obj of medObjs)
                    obj.set(params)
        },
        setMediaData = (medRefs, params) => {
            for (const obj of getMediaObjs(medRefs)) {
                const REGISTRY = getRegistry(obj),
                    regKey = getMediaKey(obj)
                if (REGISTRY && REGISTRY[regKey]) {
                    _.each(params, (v, k) => { REGISTRY[regKey][k] = v })
                    obj.set(params)
                }               
            }
        },
        updateMediaData = (medRefs, blacklist = []) => {

        },
        toggleMedia = (medRefs, isActive) => {

        },
        unregMedia = (medRefs) => {

        },
        deleteMedia = (medRefs) => {

        },
        cleanReg = () => {

        },
        alignMedia = (medRefs, params) => {

        },
        layerMedia = (medRefs, layers) => {

        },
        linkMedia = (medRef1, medRef2, mode, options = {}) => {
            const medObjs = [getMediaObj(medRef1), getMediaObj(medRef2)],
                medKeys = [getMediaKey(medRef1), getMediaKey(medRef2)],
                REGISTRY = [getRegistry(medRef1), getRegistry(medRef2)],                
                medDatas = [REGISTRY[0][medKeys[0]], REGISTRY[1][medKeys[1]]]
            if (VAL({list: medDatas}, "linkMedia", true)) {                
                REGISTRY[medKeys[0]].links = REGISTRY[medKeys[0]].links || { children: [] }                
                REGISTRY[medKeys[1]].links = REGISTRY[medKeys[1]].links || { children: [] }
                switch(mode) {
                    case "left": {
                        const med1Params = { left: medDatas[1].leftEdge - 0.5 * medDatas[0].width }
                        REGISTRY[medKeys[0]].links.left = {
                            id: medObjs[1].id,
                            name: medKeys[1],
                            edge: medDatas[1].leftEdge,
                            xShift: options.xShift || 0,
                            yShift: options.yShift || 0
                        }
                        REGISTRY[medKeys[1]].links.children = REGISTRY[medKeys[1]].links.children || []
                        REGISTRY[medKeys[1]].links.children.push(medObjs[0].id)
                        break
                    }
                    // no default
                }            
            }
        }

    // #endregion

    // #region IMAGE OBJECT GETTERS: Image Object & Data Retrieval
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
            const imageRefs = VAL({ msg: imgRefs }) ? D.GetSelected(imgRefs) || [] : imgRefs || _.keys(IMAGEREGISTRY),
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
            let regData, imgObj
            try {
                if (getImageKey(imgRef)) {
                    regData = IMAGEREGISTRY[getImageKey(imgRef)]
                } else if ((imgObj = getImageObj(imgRef))) {
                    DB(`Retrieving data for UNREGISTERED Image Object ${D.JSL(imgRef)}`, "getImageData")
                    regData = {
                        id: imgObj.id,
                        name: imgObj.get("name"),
                        left: parseInt(imgObj.get("left")),
                        top: parseInt(imgObj.get("top")),
                        height: parseInt(imgObj.get("height")),
                        width: parseInt(imgObj.get("width")),
                        activeLayer: imgObj.get("activeLayer")
                    }
                }
                if (!regData)
                    return THROW(`Image reference '${imgRef}' does not refer to a registered image object.`, "GetData")
            } catch (errObj) {
                return THROW(`Cannot locate image with search value '${D.JS(imgRef)}'`, "getImageData", errObj)
            }
            regData.leftEdge = regData.left - 0.5*regData.width
            regData.rightEdge = regData.left + 0.5*regData.width
            regData.topEdge = regData.top - 0.5*regData.height
            regData.bottomEdge = regData.top + 0.5*regData.height
            return regData
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
            DB(`Image ${D.JS(imgRef)} Testing:<br>.... GetImgObj ? ${D.JS(getImageObj(imgRef))}<br>... Layer === ActiveLayer ? ${D.JS(getImageObj(imgRef).get("layer"))} =?= ${D.JS(getImageData(imgRef).activeLayer)}`, "isImageActive")
            if (getImageObj(imgRef) && getImageObj(imgRef).get("layer") === getImageData(imgRef).activeLayer) {
                DB("... Returning TRUE", "isImageActive")
                return true
            }
            DB("... Returning FALSE", "isImageActive")
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

    // #region IMAGE OBJECT SETTERS: Registering & Manipulating Image Objects
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
            // D.Alert(`Options for '${D.JS(imgName)}': ${D.JS(options)}`, "MEDIA: regImage")
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
                    zIndex: options.zIndex || (IMAGEREGISTRY[name] ? IMAGEREGISTRY[name].zIndex : 200),
                    srcs: {}
                }
                if (srcName !== "none") {
                    addImgSrc(imgObj.get("imgsrc").replace(/med/gu, "thumb"), name, srcName)
                    setImage(name, srcName)
                }
                if (!IMAGEREGISTRY[name].startActive) {
                    setImage(name, "blank")
                    layerImages([name], "gmlayer")
                } else {
                    layerImages([name], IMAGEREGISTRY[name].activeLayer)
                }
                orderMedia(["Pad$"], true)
                if (!isSilent)
                    D.Alert(`Host obj for '${D.JS(name)}' registered: ${D.JS(IMAGEREGISTRY[name])}`, "MEDIA: regImage")

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
            //D.Alert(`Getting ${D.JS(srcRef)} for ${D.JS(imgRef)} --> ${D.JS(REGISTRY[getImageData(imgRef).name].srcs[srcRef])}`, "MEDIA:SetImage")
            if (isRegImg(imgRef)) {
                const imgObj = getImageObj(imgRef),
                    imgName = getImageKey(imgRef)
                //D.Alert(`Image Name: ${D.JS(imgName)}`)
                let stateRef = IMAGEREGISTRY[imgName],
                    srcURL = srcRef
                //D.Alert(D.JS(REGISTRY[getImageData(imgRef).name]))
                if (imgObj && stateRef) {
                    //D.Alert(`Getting ${D.JS(stateRef.srcs)} --> ${D.JS(srcRef)} --> ${D.JS(stateRef.srcs[srcRef])}`, "MEDIA:SetImage")
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
                        imgObj.set("layer", "gmlayer")
                        if (IMAGEREGISTRY[getImageData(imgRef).name].curSrc !== "blank")
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
        setImgData = (imgRef, params) => {
            _.each(params, (v, k) => {
                IMAGEREGISTRY[getImageKey(imgRef)][k] = v
            })
            return IMAGEREGISTRY[getImageKey(imgRef)]
        },
        setLocation = (locRefs) => {
            const hosts = [],
                hostOverride = {},
                parsedParams = Object.assign({
                    DistrictCenter: "blank",
                    SiteCenter: "blank",
                    SiteNameCenter: " ",
                    DistrictRight: "blank",
                    SiteRight: "blank",
                    SiteNameRight: " ",
                    DistrictLeft: "blank",
                    SiteLeft: "blank",
                    SiteNameLeft: " "
                }, VAL({list: locRefs}) ? _.clone(locRefs) : {})
            let [customNames, params] = [[], []]
            if (VAL({string: locRefs})) {
                if (locRefs.includes(":name:"))
                    customNames = _.map(locRefs.match(new RegExp(":name:([^;]*)", "g")), v => v.replace(/:name:/gu, ""))
                params = locRefs.replace(/:name:.*?;\s*?/gu, "").split(" ")
                DB(`CustomNames: ${D.JS(customNames)}, Params: ${D.JS(params)}`, "setLocation")
                //D.Alert(`PARAMS: ${D.JS(params)}`) .match(/^(\w+):[^:]*:?[^:]*:?(.+$)/ui)
                for (const param of params) {
                    if (param.startsWith("Site")) hosts.push(param.split(":")[0])
                    if (param.includes(":same")) {
                        const targetHost = param.split(":")[0],
                            targetType = targetHost.includes("District") ? "District" : "Site"
                        let imgSrc = getImageSrc(targetHost)
                        DB(`TargetHost: ${D.JS(targetHost)}, Type: ${D.JS(targetType)}, Src: ${D.JS(imgSrc)}`, "setLocation")
                        switch (targetHost) {
                            case "SiteLeft":
                                hostOverride.SiteLeft = isImageActive("SiteBarCenter") ? getTextObj("SiteNameCenter").get("text") : isImageActive("SiteBarLeft") ? getTextObj("SiteNameLeft").get("text") : null
                            // falls through
                            case "SiteRight":
                                hostOverride.SiteRight = targetHost === "SiteRight" && (isImageActive("SiteBarCenter") ? getTextObj("SiteNameCenter").get("text") : isImageActive("SiteBarRight") ? getTextObj("SiteNameRight").get("text") : null)
                            // falls through
                            case "DistrictLeft":
                            case "DistrictRight":
                                imgSrc = isImageActive(targetType + "Center") ? getImageSrc(targetType + "Center") : getImageSrc(targetHost)
                                break
                            case "SiteCenter":
                                hostOverride.SiteCenter = isImageActive("SiteBarLeft") ? getTextObj("SiteNameLeft").get("text") : isImageActive("SiteBarCenter") ? getTextObj("SiteNameCenter").get("text") : null
                            // falls through
                            case "DistrictCenter":
                                imgSrc = isImageActive(targetType + "Left") ? getImageSrc(targetType + "Left") : getImageSrc(targetHost)
                                break
                        // no default
                        }
                        DB(`Final Host: ${D.JS(targetHost)}, Src: ${D.JS(imgSrc)}, HostOverrides: ${D.JS(hostOverride)}`, "setLocation")
                        parsedParams[targetHost] = imgSrc
                    } else {
                        const [targetHost, imgSrc] = param.split(":")
                        DB(`Final Host: ${D.JS(targetHost)}, Src: ${D.JS(imgSrc)}`, "setLocation")
                        parsedParams[targetHost] = imgSrc
                    }
                }
                if (parsedParams.DistrictLeft === parsedParams.DistrictRight && parsedParams.DistrictLeft !== "blank") {
                    parsedParams.DistrictCenter = parsedParams.DistrictLeft
                    parsedParams.DistrictLeft = "blank"
                    parsedParams.DistrictRight = "blank"
                }                    
                for (let i = 0; i < hosts.length; i++) {
                    customNames[i] = customNames[i] && customNames[i].trim().length > 0 && customNames[i] || hostOverride[hosts[i]]
                    if (!customNames[i])
                        break
                    parsedParams[hosts[i].replace(/Site/gu, "SiteName")] = customNames[i] === "x" ? " " : customNames[i]                                     
                }      
                DB(`Final Parsed Params: ${D.JS(parsedParams, true)}`, "setLocation")
            }
            _.each(_.omit(parsedParams, (v, k) => k.includes("Name")), (v,k) => { setImage(k, v) })
            setImage("SiteBarCenter", parsedParams.SiteNameCenter === " " ? "blank" : "base")
            setText("SiteNameCenter", parsedParams.SiteNameCenter)
            setImage("SiteBarLeft", parsedParams.SiteNameLeft === " " ? "blank" : "base")
            setText("SiteNameLeft", parsedParams.SiteNameLeft)
            setImage("SiteBarRight", parsedParams.SiteNameRight === " " ? "blank" : "base")
            setText("SiteNameRight", parsedParams.SiteNameRight)   
            STATEREF.curLocation = _.clone(parsedParams)
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
                            revSorted.unshift(setMediaParams(iData.id, { top: bounds[0] + counter * spacer }, true))
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
                            revSorted.unshift(setMediaParams(iData.id, { left: bounds[0] + counter * spacer }, true))
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
				setMediaParams(imgObj, attrList)
			}
		}, */
        toggleImage = (imgRef, isActive) => {
            const imgObj = getImageObj(imgRef),
                imgData = getImageData(imgRef)
            if (imgObj && isActive) {
                imgObj.set("layer", imgData.activeLayer)
                if (imgData.activeSrc)
                    setImage(imgRef, imgData.activeSrc)
                else if (imgData.srcs && imgData.srcs.base)
                    setImage(imgRef, "base")
            } else if (imgObj && !isActive) {
                imgObj.set("layer", "gmlayer")
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
        layerImages = (imgRefs, layer) => {
            const imgObjs = getImageObjs(imgRefs)
            //orderImages(IMAGELAYERS.objects)
            for (const imgObj of imgObjs)
                if (VAL({graphicObj: imgObj}))
                    imgObj.set({ layer: layer })
                else
                    D.Alert(`No image found for reference ${D.JS(imgObj)}`, "MEDIA: OrderImages")
        },
        setImageArea = (imgRef, areaRef) => {
            const imgObj = getImageObj(imgRef)
            if (!imgObj)
                D.Alert(`Invalid image reference: ${D.JS(imgRef)}`, "MEDIA: setImageArea")
            else if (!areaRef || !AREAS[areaRef])
                D.Alert(`No area registered as '${D.JS(areaRef)}'`, "MEDIA: setImageArea")
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
        spreadImages = (leftImgRef, rightImgRef, midImgRefOrRefs, width, minOverlap = 20, maxOverlap = 40) => {
            const leftData = getImageData(leftImgRef),
                rightData = getImageData(rightImgRef),
                midData = _.map(_.flatten([midImgRefOrRefs]), v => getImageData(v)),
                spread = parseFloat(width)
            let dbString = ""
            DB(`minOverlap: ${minOverlap}, maxOverlap: ${maxOverlap}`)
            if (VAL({list: [leftData, rightData, ...midData], number: [spread]}, "spreadImages", true)) {
                setMediaParams(leftData.id, {top: leftData.top, left: leftData.left})
                dbString += `Setting Left to {left: ${parseInt(leftData.left)}}<br>`
                // If one imgRef supplied, check to see if it is a reference to a group of consecutively-named images:
                if (midData.length === 1) {
                    const imgName = midData[0].name.replace(/_\d*$/gu, "")
                    do
                        midData.push(getImageData(`${imgName}_${midData.length + 1}`))
                    while (_.last(midData))
                    midData.pop()
                }
                // If the spread is smaller than the combined width of the bookends, then set the minimum possible spread and blank all mid images.
                if (spread <= leftData.width + rightData.width) {
                    dbString += `Spread ${parseInt(spread)} less than ${parseInt(leftData.width + rightData.width)} (${parseInt(leftData.width)} + ${parseInt(rightData.width)})<br>`
                    for (const imgData of midData)
                        setImage(imgData.id, "blank")
                    DB(dbString + `Setting Right to {left: ${parseInt(leftData.rightEdge)} + 0.5x${parseInt(rightData.width)} = ${parseInt(leftData.rightEdge + 0.5*rightData.width)}}`, "spreadImages")
                    return setMediaParams(rightData.id, {
                        top: leftData.top,
                        left: leftData.rightEdge + 0.5*rightData.width
                    })
                }
                // Otherwise, determine how much space will be in the middle.
                const totalMidWidth = spread - leftData.width - rightData.width
                dbString += `Total Mid Width = ${parseInt(totalMidWidth)} (spr:${parseInt(spread)} - L.w:${parseInt(leftData.width)} - R.w:${parseInt(rightData.width)})<br>`
                if (midData.length === 1) {
                    // If only one middle image, stretch it out... BUT have to stretch the minOverlap by the same ratio.
                    // So: need to determine percentage of width that is taken up by minOverlap
                    // Then, need to set overall width such that the remaining percentage is enough to cover the spread.
                    // HOWEVER: if the resulting stretchOverlap EXCEEDS maxOverlap, cap it there.
                    const overlapPercent = 2*minOverlap / midData[0].width,
                        coveragePercent = 1 - overlapPercent,
                        stretchFactor = Math.min(totalMidWidth / (coveragePercent * midData[0].width), maxOverlap / minOverlap),
                        stretchOverlap = minOverlap * stretchFactor,
                        stretchWidth = midData[0].width * stretchFactor
                    dbString += `overlapPercent = ${parseInt(overlapPercent * 100)/100} = (2×mO:${parseInt(minOverlap)} / M.w:${parseInt(midData[0].width)})<br>`
                    dbString += `coveragePercent = ${parseInt(coveragePercent * 100)/100} = (1 - O%:${parseInt(overlapPercent * 100)/100})<br>`
                    dbString += `stretchFactor = ${parseInt(stretchFactor * 100)/100} = MIN(TM.w:${parseInt(totalMidWidth)} / (C%:${parseInt(coveragePercent * 100)/100} × M.w:${parseInt(midData[0].width)}), xO:${parseInt(maxOverlap)}/mO:${parseInt(minOverlap)})<br>`
                    dbString += `stretchOverlap = ${parseInt(stretchOverlap)} = (mO:${parseInt(minOverlap)} × SF:${parseInt(stretchFactor * 100)/100})<br>`
                    dbString += `stretchWidth = ${parseInt(stretchWidth)}<br>`
                    // Now, set the left side of the mid image to account for the stretched overlap, and the stretched width
                    dbString += `Setting Mid Image to: {left: ${parseInt(leftData.rightEdge - stretchOverlap + 0.5*stretchWidth)} (L.re:${parseInt(leftData.rightEdge)} - sO:${parseInt(stretchOverlap)} + 0.5×sW:${parseInt(stretchWidth)})}<br>`
                    setImage(midData[0].id, "base")
                    setMediaParams(midData[0].id, {
                        top: leftData.top + 20,
                        left: leftData.rightEdge - stretchOverlap + 0.5*stretchWidth,
                        width: stretchWidth
                    })
                    dbString += `Setting Right Image to: {left: ${parseInt(leftData.rightEdge - 2*stretchOverlap + stretchWidth + 0.5*rightData.width)} (L.re:${parseInt(leftData.rightEdge)} - 2×sO:${parseInt(stretchOverlap)} + sW:${parseInt(stretchWidth)} + 0.5×R.w:${parseInt(rightData.width)})}<br>`
                    setMediaParams(rightData.id, {
                        top: leftData.top + 40,
                        left: leftData.rightEdge - 2*stretchOverlap + stretchWidth + 0.5*rightData.width
                    })
                    DB(dbString, "spreadImage")
                    return true
                } else {
                    // If multiple middle images were specified, first determine the minimum and maximum amount each can cover based on overlap.
                    // The "real" minOverlap is twice the given value, since offsetting an image by one minOverlap width will result in a minOverlap covering another minOverlap.
                    const midImgWidth = midData[0].width,
                        [minCover, maxCover] = [
                            Math.max(0, midImgWidth - 2*maxOverlap),
                            Math.max(0, midImgWidth - 1.5*minOverlap)
                        ],
                        midImgIDs = []
                    dbString += `midWidth: ${parseInt(midData[0].width)}, maxCover: ${parseInt(maxCover)}, minCover: ${parseInt(minCover)}<br>`
                    // Now add mid images one by one until their total MAX cover equals or exceeds the spread:
                    let coveredSpread = 0
                    while (midData.length) {
                        if (coveredSpread < totalMidWidth) {
                            setImage(_.last(midData).id, "base")
                            midImgIDs.push(midData.pop().id)
                            coveredSpread += maxCover
                        } else {
                            setImage(midData.pop().id, "blank")
                        }
                        dbString += `... adding ${_.last(midImgIDs)} (cover: ${parseInt(coveredSpread)}), ${midData.length} remaining<br>`
                    }
                    // Now divide up the spread among the images, and check that each image's cover is between min and max:
                    const spreadPerImg = totalMidWidth / midImgIDs.length
                    dbString += `SPI = ${parseInt(spreadPerImg)} = TMW:${parseInt(totalMidWidth)} / #Mids:${midImgIDs.length}<br>`
                    if (spreadPerImg < minCover || spreadPerImg > maxCover)
                        THROW(`Unable to spread given images over spread ${spread}: per-image spread of ${spreadPerImg} outside bounds of ${minCover} - ${maxCover}`, "spreadImages")
                    // Get the actual overlap between images, dividing by two to get the value for one side,
                    // and use this number to get the left position for the first middle image.
                    const sideOverlap = 0.5*(midImgWidth - spreadPerImg),
                        firstMidLeft = leftData.rightEdge - sideOverlap + 0.5*midImgWidth
                    dbString += `Side Overlap: ${parseInt(sideOverlap)} = 0.5x(M.w:${parseInt(midImgWidth)} - SPI:${parseInt(spreadPerImg)})<br>`
                    dbString += `L.l: ${parseInt(leftData.left)}, L.re: ${parseInt(leftData.rightEdge)}, firstMidLeft: ${parseInt(firstMidLeft)} (L.re - sO:${parseInt(sideOverlap)} + 0.5xM.w:${parseInt(midImgWidth)})<br>`
                    // Turn on each midImg being used and set the left positioning of each mid image by recursively adding the spreadPerImg:
                    let currentLeft = firstMidLeft,
                        testVertSpread = 0
                    for (const imgID of midImgIDs) {
                        setMediaParams(imgID, {
                            top: leftData.top + testVertSpread,
                            left: currentLeft
                        })
                        currentLeft += spreadPerImg
                        dbString += `... Spreading Mid to ${parseInt(currentLeft)}<br>`
                        //testVertSpread += 5
                    }
                    // Then, turn off all the unused middle images.
                    dbString += `Turning off ${midData.length} images.<br>`
                    
                    // Finally, set the position of the rightmost image to the far side of the total width:
                    setMediaParams(rightData.id, {
                        top: leftData.top + testVertSpread,
                        left: leftData.leftEdge + spread - 0.5*rightData.width
                    })
                    DB(dbString, "spreadImages")
                    //for (const imgData of midData)
                    //    setImage(imgData.id, "blank")
                    return true
                }
            }
            return false
        }
    // #endregion

    // #region ANIMATIONS: Creating, Timeouts, Controlling WEBM Animations
    const regAnimation = (selectionRef, animName, activeLayer, timeout) => {
            const [animRefObj] = D.GetSelected(selectionRef)
            if (VAL({imageObj: animRefObj}, "regAnimation")) {
                IMAGEREGISTRY[animName] = {
                    name: animName,
                    left: animRefObj.get("left"),
                    top: animRefObj.get("top"),
                    height: animRefObj.get("height"),
                    width: animRefObj.get("width"),
                    activeLayer: activeLayer,
                    imgsrc: animRefObj.get("imgsrc").replace(/med/gu, "thumb"),
                    timeOut: parseInt(1000 * (parseFloat(timeout) || 0))
                }
                IMAGEREGISTRY[animName].leftEdge = IMAGEREGISTRY[animName].left - 0.5 * IMAGEREGISTRY[animName].width
                IMAGEREGISTRY[animName].rightEdge = IMAGEREGISTRY[animName].left + 0.5 * IMAGEREGISTRY[animName].width
                IMAGEREGISTRY[animName].topEdge = IMAGEREGISTRY[animName].top - 0.5 * IMAGEREGISTRY[animName].height
                IMAGEREGISTRY[animName].bottomEdge = IMAGEREGISTRY[animName].top + 0.5 * IMAGEREGISTRY[animName].height
                animRefObj.remove()
            }
        },
        fireAnimation = animName => {
            const animData = IMAGEREGISTRY[animName]
            if (VAL({list: animData}, "fireAnimation")) {
                const animObj = createObj("graphic", {
                    imgsrc: animData.imgsrc,
                    left: animData.left,
                    top: animData.top,
                    height: animData.height,
                    width: animData.width,
                    layer: animData.activeLayer
                })
                STATEREF.activeAnimations.push(animObj.id)
                if (animData.timeOut) {
                    STATEREF.activeTimeouts.push(animObj.id)
                    setTimeout(() => killAnimation(animObj), animData.timeOut)
                }
            }
        },
        killAnimation = animObj => {
            if (VAL({graphicObj: animObj}, "killAnimation")) {
                STATEREF.activeAnimations = _.without(STATEREF.activeAnimations, animObj.id)
                STATEREF.activeTimeouts = _.without(STATEREF.activeTimeouts, animObj.id)
                animObj.remove()
            }
        },
        killAllTimeouts = () => {
            for (const animID of STATEREF.activeTimeouts)
                (getObj("graphic", animID) || { remove: () => false }).remove()
            STATEREF.activeTimeouts = []            
        },
        killAllAnimations = () => {
            for (const animID of STATEREF.activeAnimations)
                (getObj("graphic", animID) || { remove: () => false }).remove()
            STATEREF.activeAnimations = []
        }


    // #endregion

    // #region TEXT OBJECT GETTERS: Text Object, Width Measurements, Data Retrieval
    const getTextKey = (textRef, isSilent = false) => {
            try {
                let textObj
                if (VAL({string: textRef})) {
                    if (TEXTREGISTRY[textRef])
                        return textRef
                    /* if (TEXTREGISTRY[`${textRef}_1`])
                        return `${textRef}_1` */
                    if (IDREGISTRY[textRef])
                        return IDREGISTRY[textRef]
                }
                if (VAL({selected: textRef}))
                    textObj = D.GetSelected(textRef)[0]
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
            const tRefs = VAL({ msg: textRefs }) ? D.GetSelected(textRefs) || [] : textRefs,
                textObjs = []
            if (VAL({ array: tRefs })) {
                for (const tRef of tRefs)
                    textObjs.push(getTextObj(tRef))
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
        getTextVars = (textRef, text, maxWidth, isSilent = false) => {
            const textObj = getTextObj(textRef, isSilent),
                textData = getTextData(textObj, isSilent),
                maxW = maxWidth === 0 ? 0 : maxWidth || textData && textData.maxWidth || 0
            let textString = (text === "" ? "" : text || textData && textData.text || textObj && textObj.get && textObj.get("text") || "").toString()
            if (maxW > 0)
                textString = textString.replace(/\n/gu, " ").replace(/\s+/gu, " ")
            textString = textString.replace(/-\s/gu, "-")
            if (textString.trim().length > 0)
                textString = textString.trim()
            return [textObj, textData, textString, maxW]
        },
        getTextWidth = (textRef, text, maxWidth) => {
            const [textObj, textData, textString, maxW] = getTextVars(textRef, text, maxWidth, true)
            if (VAL({ textObj: textObj, list: textData }, "getTextWidth")) {
                const font = textObj.get("font_family").split(" ")[0].replace(/[^a-zA-Z]/gu, ""),
                    size = textObj.get("font_size"),
                    chars = textString.split(""),
                    fontRef = D.CHARWIDTH[font],
                    charRef = fontRef && fontRef[size]
                let width = 0
                if (!textString || textString === "" || textString.length === 0)
                    return 0
                if (!fontRef || !charRef) {
                    DB(`No font reference for '${font}' at size '${size}', attempting default`, "getTextWidth")
                    return textString.length * (parseInt(textObj.get("width")) / textObj.get("text").length)
                }
                let textLines = []
                if (maxWidth !== false && maxW) {
                    DB(`Splitting '${D.JS(textString)}' into lines of max width ${D.JS(maxW)}`, "getTextWidth")
                    textLines = _.compact(splitTextLines(textObj, textString, maxW, textData && textData.justification))
                } else if (maxWidth !== false && textString && textString.includes("\n")) {
                    DB(`No MaxW, Splitting '${D.JS(textString)}' according to line breaks.`, "getTextWidth")
                    textLines = _.compact(textString.split(/\s*\n+\s*/gu))
                }
                if (textLines.length) {
                    let maxLine = textLines[0]
                    DB(`TextLines = ${textLines}`, "getTextWidth")
                    for (const textLine of textLines) {
                        DB(`MAX {${getTextWidth(textObj, maxLine, false)}} = ${maxLine}<br>TEXT: {${getTextWidth(textObj, textLine, false)}} = ${textLine}`, "getTextWidth")
                        maxLine = getTextWidth(textObj, maxLine, false) < getTextWidth(textObj, textLine.trim(), false) ? textLine.trim() : maxLine
                    }                    
                    DB(`Max Line = ${D.JS(maxLine)}, ${getTextWidth(textObj, maxLine, false)}`, "getTextWidth")
                    DB(`GetTextWidth called. Text: ${textString} MaxLine: ${maxLine} with maxWidth ${D.JS(maxWidth)} and maxW ${D.JS(maxW)}<br>Width: ${getTextWidth(textObj, maxLine, false)}`, "getTextWidth")
                    return getTextWidth(textObj, maxLine, false)
                }
                _.each(chars, char => {
                    if (char !== "\n" && !charRef[char] && charRef[char] !== " " && charRef[char] !== 0)
                        DB(`... MISSING '${char}' in '${font}' at size '${size}'`, "getTextWidth")
                    else
                        width += charRef[char]
                })
                /*if (maxWidth !== false)
                    D.Alert(`GetTextWidth called on ${text} with maxWidth ${D.JS(maxWidth)} and maxW ${D.JS(maxW)}`)*/
                return width
            }
            return false
        },        
        getTextLineHeight = textRef => {
            const [textObj, textData] = getTextVars(textRef, true)
            return textData.lineHeight || D.CHARWIDTH[textObj.get("font_family")] && 
                D.CHARWIDTH[textObj.get("font_family")][textObj.get("font_size")] && 
                D.CHARWIDTH[textObj.get("font_family")][textObj.get("font_size")].lineHeight
        },
        getTextHeight = (textRef, text, maxWidth) => {
            const [textObj, textData, textString, maxW] = getTextVars(textRef, text, maxWidth, true)
            if (VAL({textObj: textObj, list: textData}, "getTextHeight")) {
                let splitLines
                if (maxW > 0) {
                    splitLines = _.compact(splitTextLines(textRef, textString, maxW, textData.justification || "left"))
                    D.Alert(`MaxWidth = ${maxW}<br><br>SplitLines: ${D.JS(splitLines)}, Length: ${splitLines.length}`, "getTextHeight")
                } else {
                    splitLines = _.compact(textString.split(/\n/gu))
                    D.Alert(`No MaxWidth.<br><br>SplitLines: ${D.JS(splitLines)}, Length: ${splitLines.length}`, "getTextHeight")
                }
                return splitLines.length * getTextLineHeight(textRef)
            }
            return false
        },
        getHorizBase = (textRef) => {
            const [textObj, textData] = getTextVars(textRef)
            if (VAL({textObj: textObj}, "getLeftEdge"))               
                //D.Alert(`getBlankLeft Called on ${textObj.get("text")} with maxWidth ${maxWidth} into getTextWidth -->`)
                return textObj.get("left") + (textData.justification === "left" ? -0.5 : textData.justification === "right" ? 0.5 : 0) * getTextWidth(textObj)
            return false
        },
        getRealLeft = (textRef) => {              
            const [textObj, textData] = getTextVars(textRef)
            if (VAL({textObj: textObj, list: textData}, "getRealLeft"))
                return textData.horizBase + (textData.justification === "left" ? 0.5 : textData.justification === "right" ? -0.5 : 0) * getTextWidth(textObj)
            return false    
        },
        getVertBase = (textRef) => {            
            const [textObj, textData] = getTextVars(textRef)
            if (VAL({textObj: textObj}, "getVertBase"))               
                //D.Alert(`getBlankLeft Called on ${textObj.get("text")} with maxWidth ${maxWidth} into getTextWidth -->`)
                return textObj.get("top") + (textData.vertAlign === "bottom" ? -0.5 : textData.vertAlign === "top" ? 0.5 : 0) * getTextHeight(textObj)
            return false
        },
        getRealTop = (textRef) => {
            const [textObj, textData] = getTextVars(textRef)
            if (VAL({textObj: textObj, list: textData}, "getRealTop"))
                return textData.vertBase + (textData.vertAlign === "top" ? 0.5 : textData.vertAlign === "bottom" ? -0.5 : 0) * getTextHeight(textObj)
            return false
        },
        checkTextRegistration = textRefs => {
            const textObjs = getTextObjs(textRefs),
                errorLines = []
            if (VAL({textObj: textObjs}, "checkTextRegistration", true)) {
                for (const textObj of textObjs) {
                    const [, textData, textString] = getTextVars(textObj, true)
                    if (VAL({list: textData}, "checkTextRegistration")) {
                        const errors = []
                        if (!textData.vertBase) {
                            textData.vertBase = textData.top
                            TEXTREGISTRY[textData.name].vertBase = textData.top
                        }
                        if (!textData.horizBase) {
                            textData.horizBase = textData.left
                            TEXTREGISTRY[textData.name].horizBase = textData.left
                        }
                        if (textData.text.trim() !== textString)
                            errors.push(`... [TEXT] '${textString}' (obj) should be '${textData.text.trim()}'`)
                        if (Math.abs(textData.width - getTextWidth(textObj)) >= 1)
                            errors.push(`... [WIDTH] '${textObj.get("width")}' (obj) should be '${getTextWidth(textObj)}' (delta: ${parseInt(getTextWidth(textObj)) - textObj.get("width")})`)
                        if (Math.abs(textData.height - getTextHeight(textObj)) >= 1)
                            errors.push(`... [HEIGHT] '${textObj.get("height")}' (obj) should be '${getTextHeight(textObj)}' (delta: ${parseInt(getTextHeight(textObj)) - textObj.get("height")})`)
                        if (Math.abs(textData.vertBase - getVertBase(textObj)) >= 1)
                            errors.push(`... [VERT_BASE]: '${textData.vertBase}' (reg) should be '${getVertBase(textObj)}'`)
                        if (Math.abs(textData.horizBase - getHorizBase(textObj)) >= 1)
                            errors.push(`... [HORZ_BASE]: '${textData.horizBase}' (reg) should be '${getHorizBase(textObj)}'`)
                        if (errors.length)
                            errorLines.push(`<b>${textData.name}:</b><br>${errors.join("<br>")}`)
                        errors.length = 0
                    }
                }
                if (errorLines.length)
                    D.Alert(errorLines.join("<br>"), "CHECK TEXT REGISTRATION")
                else
                    D.Alert("No anomalous entries found.", "CHECK TEXT REGISTRATION")
               /* newData = {
                            id: oldData.id,
                            name: textName,

                            justification: oldData.justification || "left",
                            maxWidth: oldData.maxWidth || 0,
                            left: getHorizBase(textObj, oldData.justification || "left", oldData.maxWidth || 0),
                            width: getTextWidth(textObj, textObj.get("text"), oldData.maxWidth || 0),
                            shiftleft: oldData.shiftleft || 0,

                            vertAlign: oldData.vertAlign || "top",
                            lineHeight: getTextLineHeight(textObj),
                            top: getVertBase(textObj, oldData.vertAlign || "top", oldData.maxWidth || 0),
                            height: getTextHeight(textObj, textObj.get("text"), oldData.maxWidth || 0),
                            shifttop: oldData.shifttop || 0,

                            color: oldData.color || "rgb(255,0,0)",
                            font_size: oldData.font_size || 20,
                            font_family: oldData.font_family || "Contrail One",

                            text: textObj.get("text"),
                            layer: textObj.get("layer"),
                            zIndex: oldData.zIndex || 900,
                            
                            activeLayer: oldData.activeLayer || "objects",
                            startActive: oldData.startActive !== false,
                            activeText: oldData.activeText || oldData.text || textObj.get("text"),

                            links: oldData.links || { children: [] }
                        }*/
            }
        }
    // #endregion
    
    // #region TEXT OBJECT MANIPULATORS: Buffering, Justifying, Splitting
    const buffer = (textRef, width) => {
            DB(`Buffering Ref ${D.JS(textRef)} to width ${D.JS(width)}<br>... getTextWidth: ${D.JS(getTextWidth(textRef, " ", false))}`, "buffer")
            return " ".repeat(Math.max(0, Math.round(width/getTextWidth(textRef, " ", false))))
        },
        splitTextLines = (textRef, text, maxWidth, justification = "left") => {
            const [textObj, , textString] = getTextVars(textRef, text, maxWidth)
            let textStartString = textString.replace(/\n/gu, " ").replace(/\s\s+/gu, " ").replace(/-\s/gu, "-"),
                textStrings = _.without(textStartString.split(/(\s+|-)/gu), " "),
                splitStrings = [],
                highWidth = 0
            //D.Alert(`${D.JS(textStartString)}<br><br>${D.JS(_.map(textStrings, v => `'${v}'`))}`)
            for (let i = 0; i < textStrings.length; i++)
                if (textStrings[i] === "-") {
                    textStrings[i-1] = textStrings[i-1] + "-"
                    textStrings = [...[...textStrings].splice(0,i), ...[...textStrings].splice(i+1)]
                }
            while (textStrings.length) {
                let thisString = ""
                while (getTextWidth(textObj, thisString, false) < maxWidth && textStrings.length)
                    if (textStrings[0].endsWith("-"))
                        thisString += `${textStrings.shift()}`
                    else
                        thisString += `${textStrings.shift()} `
                splitStrings.push(thisString)
                highWidth = Math.max(getTextWidth(textObj, thisString, false), highWidth)
            }
            if (justification === "center")
                splitStrings = _.map(splitStrings, v => `${buffer(textObj, 0.5 * (highWidth - getTextWidth(textObj, v, false)))}${v}${buffer(textObj, 0.5 * (highWidth - getTextWidth(textObj, v, false)))}`)
            else if (justification === "right")
            //D.Alert(`spaceWidth: ${spaceWidth}, repeating ${D.JS(Math.round((highWidth - getTextWidth(textObj, splitStrings[0], false))/spaceWidth))} Times.`)
                splitStrings = _.map(splitStrings, v => `${buffer(textObj, highWidth - getTextWidth(textObj, v, false))}${v}`)
       // D.Alert(`SplitTextLines Called.  Returning: ${D.JS(splitStrings)}`)
            return splitStrings
        },
        justifyText = (textRef, justification, maxWidth = 0) => {
            const textObj = getTextObj(textRef)
            D.Alert(`Justifying ${D.JS(getTextKey(textObj))}.  Reference: ${D.JS(textRef)}, Object: ${D.JS(textObj)}`, "justifyText")
            if (VAL({textObj: textObj})) {
                TEXTREGISTRY[getTextKey(textObj)].justification = justification || "center"
                TEXTREGISTRY[getTextKey(textObj)].left = getHorizBase(textObj, justification, maxWidth)
                TEXTREGISTRY[getTextKey(textObj)].width = getTextWidth(textObj, textObj.get("text"), maxWidth)
                if (hasShadowObj(textObj)) {
                    const shadowKey = getTextData(textObj).shadow,
                        shadowObj = getTextObj(shadowKey)
                    TEXTREGISTRY[shadowKey].justification = justification || "center"
                    TEXTREGISTRY[shadowKey].left = getHorizBase(shadowObj, justification, maxWidth)
                    TEXTREGISTRY[shadowKey].width = getTextWidth(shadowObj, shadowObj.get("text"), maxWidth)
                }
                D.Alert(`${getTextKey(textRef)} Updated: ${D.JS(TEXTREGISTRY[getTextKey(textObj)])}`, "justifyText")
            }
        }
    // #endregion

    // #region TEXT OBJECT SETTERS: Registering, Changing, Deleting
    const regText = (textRef, hostName, activeLayer, startActive, hasShadow, justification, options = {}, isSilent = false) => {
            const textObj = getTextObj(textRef)
            DB(`regText(textRef, ${D.JS(hostName)}, ${D.JS(activeLayer)}, ${D.JS(startActive)}, ${D.JS(hasShadow)}, ${D.JS(options)}`, "regText")
            if (VAL({ text: textObj })) {
                if (!(hostName && activeLayer))
                    return THROW("Must supply host name and active layer for regText.", "RegText")
                const name = options.name && !TEXTREGISTRY[options.name] ? options.name : !TEXTREGISTRY[hostName] ? hostName : `${hostName.replace(/(_|\d|#)+$/gu, "")}_${_.filter(_.keys(TEXTREGISTRY), k => k.includes(hostName.replace(/(_|\d|#)+$/gu, ""))).length + 1}`,
                    curTextParams = {
                        left: textObj.get("left"),
                        top: textObj.get("top"),
                        width: getTextWidth(textObj, textObj.get("text")),
                        font_size: textObj.get("font_size"),
                        color: textObj.get("color"),
                        font_family: textObj.get("font_family"),
                        text: textObj.get("text").trim(),
                        layer: !(startActive === "false" || startActive === false) ? activeLayer : "gmlayer"
                    }
                TEXTREGISTRY[name] = Object.assign(
                    Object.assign(curTextParams, {
                        id: textObj.id,
                        name: name,
                        activeLayer: activeLayer,
                        startActive: !(startActive === "false" || startActive === false),
                        activeText: curTextParams.text,
                        zIndex: parseInt(options.zIndex) || (TEXTREGISTRY[name] ? TEXTREGISTRY[name].zIndex : 300),
                        justification: justification || "center",
                        maxWidth: options.maxWidth || 0,
                        lineHeight: D.CHARWIDTH[curTextParams.font_family] && D.CHARWIDTH[curTextParams.font_family][curTextParams.font_size] && D.CHARWIDTH[curTextParams.font_family][curTextParams.font_size].lineHeight || textObj.get("height"),
                        vertAlign: options.vertAlign || "top"            
                    }), options)
                TEXTREGISTRY[name].horizBase = getHorizBase(textObj)
                TEXTREGISTRY[name].vertBase = getVertBase(textObj)
                curTextParams.top = getRealTop(textObj)
                curTextParams.left = getRealLeft(textObj)
                IDREGISTRY[textObj.id] = name
                setText(textObj, Object.assign(_.filter(_.pick(options, C.TEXTPROPS), (v, k) => curTextParams[k] !== v), {left: getHorizBase(textObj, justification || "center", options.maxWidth), layer: curTextParams.layer}))                
                if (hasShadow) {
                    const shadowOptions = Object.assign(_.omit(_.clone(TEXTREGISTRY[name]), "id"), {
                        name: `${name}Shadow`,
                        color: "rgb(0,0,0)",
                        left: TEXTREGISTRY[name].left + Math.round(TEXTREGISTRY[name].font_size/SHADOWFACTOR),
                        top: TEXTREGISTRY[name].top + Math.round(TEXTREGISTRY[name].font_size/SHADOWFACTOR),      
                        shadowMaster: name,
                        zIndex: TEXTREGISTRY[name].zIndex - 1
                    })
                    DB(`Shadow Options: ${D.JS(shadowOptions)}`, "regText")
                    const shadowObj = makeText(shadowOptions.name, TEXTREGISTRY[name].activeLayer, TEXTREGISTRY[name].startActive, false, justification, shadowOptions, isSilent)
                    shadowOptions.id = shadowObj.id
                    TEXTREGISTRY[name].shadow = shadowOptions.name
                }    
                D.Alert(`Host obj for '${D.JS(name)}' registered: ${D.JS(TEXTREGISTRY[name])}`, "regText")
                orderMedia(["Pad$"], true)
                return getTextData(name)
            }
            return !isSilent && THROW(`Invalid text reference '${D.JS(textRef)}'`, "regText")
        },
        makeText = (hostName, activeLayer, startActive, hasShadow, justification, options = {}, isSilent = false) => {
            DB(`makeText(${D.JS(hostName)}, ${D.JS(activeLayer)}, ${D.JS(startActive)}, ${D.JS(hasShadow)}, ${D.JS(options)}`, "makeText")
            const isStartingActive = startActive || !(options.startActive === "false" || options.startActive === false),
                actLayer = activeLayer || options.activeLayer || options.layer || "objects",
                objParams = Object.assign({
                    _pageid: D.PAGEID,
                    text: options.text || "",
                    left: 200,
                    top: options.top || 200,
                    font_size: options.size || options.fontSize || options.font_size || 24,
                    color: options.color || C.COLORS.brightred,
                    font_family: options.font || options.fontFamily || options.font_family || "Candal",
                    layer: isStartingActive ? actLayer : "gmlayer",
                    controlledby: ""
                }, _.pick(options, ...C.TEXTPROPS)),
                textObj = createObj("text", objParams)
            options.activeText = objParams.text             
            textObj.set("left", getRealLeft(textObj, {left: textObj.get("left"), justification: justification || "center", maxWidth: options.maxWidth || 0}))
            regText(textObj, hostName, actLayer, isStartingActive, hasShadow, justification, options, isSilent)
            return textObj
        },
        setText = (textRef, options = {}, isTemporary = false) => {
            const textObj = getTextObj(textRef),
                textData = getTextData(textRef) || {},
                textOptions = VAL({string: options}) ? {text: options} : options,
                textString = (textOptions.text || textData.text || textObj.get("text")).trim()
            let numLines = 1, 
                shadowObj, shadowObjParams
            if (VAL({textObj: textObj}, "setText")) {
                textOptions.left = textOptions.left || textData.left || getHorizBase(textObj, textObj.get("text"))
                textOptions.top = textOptions.top || textData.top || textObj.get("top")
                textOptions.text = textString
                textOptions.maxWidth = textOptions.maxWidth || textData.maxWidth || 0
                textOptions.justification = textOptions.justification || textData.justification || "center"
                textOptions.vertAlign = textOptions.vertAlign || textData.vertAlign || "top"
                textOptions.lineHeight = getTextLineHeight(textObj) || 0
                const objParams = Object.assign(_.pick(textOptions, C.TEXTPROPS))
                const curHeight = textOptions.lineHeight*textObj.get("text").split("\n").length,
                    curWidth = getTextWidth(textRef, textObj.get("text"), textOptions.maxWidth)
                if (textOptions.maxWidth > 0 && objParams.text) {
                    const splitLines = splitTextLines(textObj, objParams.text, textOptions.maxWidth, textData.justification)
                    objParams.text = splitLines.join("\n")
                    numLines = splitLines.length

                }
                switch (textOptions.vertAlign) {
                    case "top":
                        textOptions.shifttop = (textOptions.shifttop || 0) + 0.5*(numLines - 1)*textOptions.lineHeight
                        break
                    case "bottom":
                        textOptions.shifttop = (textOptions.shifttop || 0) - 0.5*(numLines - 1)*textOptions.lineHeight
                        break
                        /* no default */
                }

                for (const key of _.intersection(_.keys(textOptions), ["shiftleft", "shifttop"]))
                    objParams[key.slice(5)] = textData[key.slice(5)] + parseInt(textOptions[key])
                if (!isTemporary)
                    for (const key of _.intersection(_.keys(textOptions), _.keys(textData)))
                        TEXTREGISTRY[textData.name][key] = textOptions[key]
                objParams.left = getRealLeft(textObj, {left: objParams.left, text: textOptions.text, justification: textData.justification, maxWidth: textOptions.maxWidth})
                if (_.isEmpty(textString)) {
                    objParams.layer = "gmlayer"
                    TEXTREGISTRY[textData.name].activeText = textObj.get("text")
                } else {
                    objParams.layer = textData.activeLayer
                    TEXTREGISTRY[textData.name].activeText = textString
                }
                textObj.set(objParams)
                if (textData.shadow) {
                    shadowObj = getTextShadowObj(textRef)
                    shadowObjParams = _.omit(objParams, ["color"])
                    shadowObjParams.left += Math.round(textData.font_size/SHADOWFACTOR)
                    shadowObjParams.top += Math.round(textData.font_size/SHADOWFACTOR)
                    shadowObj.set(shadowObjParams)
                }
            }
        },
        setTextData = (textRef, params) => {
            _.each(params, (v, k) => {
                TEXTREGISTRY[getTextKey(textRef)][k] = v
            })
            return TEXTREGISTRY[getTextKey(textRef)]
        },
        toggleText = (textRef, isActive) => {
            const textObj = getTextObj(textRef),
                textData = getTextData(textRef)
            DB(`TextRef: ${D.JS(textRef)}, isActive: ${D.JS(isActive)}, Layer: ${D.JS(textObj && textObj.get("layer") || "<NO OBJ>")}`, "toggleText")
            if (textObj && isActive && textObj.get("layer") !== textData.activeLayer) {
                DB(`Toggling ON. ActiveLayer: ${D.JS(textData.activeLayer)}, activeText: ${D.JS(textData.activeText)}`, "toggleText")
                textObj.set("layer", textData.activeLayer)
                if (textData.activeText)
                    setText(textRef, {text: textData.activeText})
            } else if (textObj && !isActive && textObj.get("layer") !== "gmlayer") {
                DB("Toggling OFF.", "toggleText")
                textObj.set("layer", "gmlayer")
                setText(textRef, {text: " "})
            }
        },
        removeText = (textRef, isUnregOnly, isStillKillingShadow) => {
            const textObj = getTextObj(textRef),
                textData = getTextData(textRef)
            if (hasShadowObj(textObj))
                removeText(`${textData.name}Shadow`, isUnregOnly && !isStillKillingShadow)
            if (textObj && !isUnregOnly)
                textObj.remove()
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
            const textNames = _.filter(_.keys(TEXTREGISTRY), v => v.includes(textString))
            for (const textName of textNames)
                removeText(textName, isUnregOnly)
        },        
        cleanTextRegistry = () => {
            for (const textName of _.keys(TEXTREGISTRY)) {
                const textObj = getTextObj(textName)
                if (!textObj) {
                    removeText(textName)
                } else {
                    const oldData = _.clone(_.omit(TEXTREGISTRY[textName], "object")),
                        newData = {
                            id: oldData.id,
                            name: textName,

                            justification: oldData.justification || "left",
                            maxWidth: oldData.maxWidth || 0,
                            left: getHorizBase(textObj),
                            width: getTextWidth(textObj),
                            shiftleft: oldData.shiftleft || 0,

                            vertAlign: oldData.vertAlign || "top",
                            lineHeight: getTextLineHeight(textObj),
                            top: getVertBase(textObj, oldData.vertAlign || "top", oldData.maxWidth || 0),
                            height: getTextHeight(textObj, textObj.get("text"), oldData.maxWidth || 0),
                            shifttop: oldData.shifttop || 0,

                            color: oldData.color || "rgb(255,0,0)",
                            font_size: oldData.font_size || 20,
                            font_family: oldData.font_family || "Contrail One",

                            text: textObj.get("text"),
                            layer: textObj.get("layer"),
                            zIndex: oldData.zIndex || 900,
                            
                            activeLayer: oldData.activeLayer || "objects",
                            startActive: oldData.startActive !== false,
                            activeText: oldData.activeText || oldData.text || textObj.get("text"),

                            links: oldData.links || { children: [] }
                        }
                    TEXTREGISTRY[textName] = _.clone(newData)
                }
            }
        },
        resetTextRegistry = () => {
            STATEREF.textregistry = {}
            STATEREF.idregistry = {}
        },
        orderMedia = (exclusions = [], isSilent = false) => {
            let reportStrings = []
            const imageKeys = _.reject(_.keys(IMAGEREGISTRY), v => {
                    for (const excl of exclusions)
                        if (v.match(new RegExp(excl, "ui")))
                            return true
                    return false
                }),
                textKeys = _.reject(_.keys(TEXTREGISTRY), v => {
                    for (const excl of exclusions)
                        if (v.match(new RegExp(excl, "ui")))
                            return true
                    return false
                }),
                imageObjs = _.compact(getImageObjs(imageKeys)),
                textObjs = _.compact(getTextObjs(textKeys))
            reportStrings.push(`${D.JS(textObjs.length)} of ${D.JS(textKeys.length)} Text Objects found.<br>${D.JS(imageObjs.length)} of ${D.JS(imageKeys.length)} Image Objects found.<br>`)
            if (VAL({textObj: textObjs, graphicObj: imageObjs}, "orderMedia", true)) {
                const mediaDatas = []
                for (const imgObj of imageObjs)
                    mediaDatas.push(Object.assign(_.clone(getImageData(imgObj)), {object: imgObj}))
                for (const textObj of textObjs)
                    mediaDatas.push(Object.assign(_.clone(getTextData(textObj)), {object: textObj}))
                const sortedMediaDatas = _.mapObject(_.groupBy(mediaDatas, "activeLayer"), v => _.sortBy(v, vv => -1 * vv.zIndex))
                for (const layerData of _.values(sortedMediaDatas)) {
                    reportStrings.push(`<br><b>SORTING LAYER '${D.JS(layerData[0].activeLayer)}'`)
                    for (const data of layerData) {
                        toBack(data.object)
                        reportStrings.push(`... ${data.zIndex} ... ${data.name}`)
                    }
                }
                if (!isSilent)
                    D.Alert(`Media Ordering Complete!<br>${D.JS(reportStrings.join("<br>"))}`, "orderMedia")
            }
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
        CheckInstall: checkInstall,
        RegisterEventHandlers: regHandlers,
        SoundReady: soundReady,

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
        SetParams: setMediaParams,
        SetData: setImgData,
        SetArea: setImageArea,
        SetLocation: setLocation,
        Toggle: toggleImage,
        ToggleToken: toggleToken,
        Order: orderMedia,
        LayerImages: layerImages,
        IMAGELAYERS: IMAGELAYERS,
        get LOCATION() { return STATEREF.curLocation },
        IsRegistered: isRegImg,

        Animate: fireAnimation,

        GetTextObj: getTextObj,
        GetTextData: getTextData,
        GetTextWidth: getTextWidth,
        Buffer: buffer,
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
void MarkStop("Media")