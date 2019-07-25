void MarkStart("Media")
const Media = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Media",
        CHATCOMMAND = ["!img", "!text"],
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
        STATEREF.imageregistry = STATEREF.imageregistry || {}
        STATEREF.textregistry = STATEREF.textregistry || {}
        STATEREF.idregistry = STATEREF.idregistry || {}
        STATEREF.areas = STATEREF.areas || {}
        STATEREF.imgResizeDims = STATEREF.imgResizeDims || { height: 100, width: 100 }

        delete STATEREF.imageregistry.TLShroud_1
    }
    // #endregion

    // #region EVENT HANDLERS: (HANDLEINPUT)
    const handleInput = (msg, who, call, args) => { 	// eslint-disable-line no-unused-vars
            let [srcName, hostName, textObj, objLayer, objData, isStartActive, isShadow, justification] = new Array(9),
                params = {}
            switch (call.shift().toLowerCase()) {
                case "!img":
                    switch (call.shift().toLowerCase()) {
                        case "adjust":
                            textObj = getImageObj(msg)
                            textObj.set(args.shift(), parseInt(args.shift()))
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
                                            textObj = getImageObj(msg)
                                            if (!textObj) {
                                                D.Alert("Select an image first!", "IMAGES: !img reg area")
                                            } else {
                                                AREAS[hostName] = {
                                                    top: parseInt(textObj.get("top")),
                                                    left: parseInt(textObj.get("left")),
                                                    height: parseInt(textObj.get("height")),
                                                    width: parseInt(textObj.get("width"))
                                                }
                                                D.Alert(`Area Registered: ${hostName}<br><br><pre>${D.JS(AREAS[hostName])}</pre>`, "IMAGES: !img reg area")
                                            }
                                        }
                                        break
                                    default:
                                        if (!args[0]) {
                                            D.Alert("Syntax: !img reg &lt;hostName&gt; &lt;currentSourceName&gt; &lt;activeLayer&gt; &lt;isStartingActive&gt; [params (\"key:value, key:value\")]", "IMAGES: !img reg")
                                        } else {
                                            textObj = getImageObj(msg)
                                            DB(`Image Object: ${D.JS(getImageObj(msg))}<br><br><br>MSG:<br><br>${D.JS(msg)}`, "IMAGES: !img reg")
                                            if (!textObj) {
                                                D.Alert("Select an image object first!", "IMAGES: !img reg")
                                            } else {
                                                [hostName, srcName, objLayer, isStartActive] = [args.shift(), args.shift(), args.shift(), args.shift()]
                                                if (hostName && srcName && objLayer && isStartActive)
                                                    regImage(textObj, hostName, srcName, objLayer, !isStartActive || isStartActive !== "false", D.ParseToObj(args.join(" ")))
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
                                    textObj = getImageObj(msg)
                                    if (!textObj) {
                                        D.Alert("Select an image first!", "IMAGES: !img set position")
                                    } else if (!isRegImg(msg)) {
                                        D.Alert(`Image not registered.  To register selected image:
                        
                            <pre>!img reg &lt;hostName&gt; &lt;currentSourceName&gt; &lt;activeLayer&gt; &lt;isStartingActive&gt; [params ("key:value, key:value")]</pre>`, "IMAGES: !img set position")
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
                                    textObj = getImageObj(msg)
                                    if (!textObj)
                                        D.Alert("Select an image first!", "IMAGES: !img set area")
                                    else
                                        setImageArea(textObj, args.shift())
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
                                    if (getImageData(args[0])) { textObj = getImageObj(args.shift()) }
                                    else if (getImageObj(msg)) { textObj = getImageObj(msg) }
                                    else {
                                        THROW("Bad image reference.", "!img set params")
                                        break
                                    }
                                    for (const param of args)
                                        params[param.split(":")[0]] = param.split(":")[1]

                                    setImgParams(textObj, params)
                                    break
                                case "token":
                                    toggleToken(D.GetSelected(msg)[0] || args.shift(), args.shift())
                                    break
                                case "loc": case "location": {                                    
                                    //D.Alert(`ARGS: ${D.JS(args)}`)
                                    const fullArgs = args.join(" "),
                                        hosts = [],
                                        hostOverride = {}
                                    let [customNames, params] = [[], []]
                                    if (fullArgs.includes(":name:")) {
                                        customNames = _.map(fullArgs.match(new RegExp(":name:([^;]*)", "g")), v => v.replace(/:name:/gu, ""))
                                        params = fullArgs.replace(/:name:.*?;\s*?/gu, "").split(" ")
                                    } else {
                                        params = args
                                    }                                    
                                    setImage("SiteBarCenter", "blank")
                                    setText("SiteNameCenter", " ")
                                    setImage("SiteBarLeft", "blank")
                                    setText("SiteNameLeft", " ")
                                    setImage("SiteBarRight", "blank")
                                    setText("SiteNameRight", " ")
                                    //D.Alert(`PARAMS: ${D.JS(params)}`)
                                    for (const param of params) {
                                        if (param.startsWith("Site")) hosts.push(param.split(":")[0])
                                        if (param.includes(":same")) {
                                            const targetHost = param.split(":")[0] + "_1",
                                                targetType = targetHost.includes("District") ? "District" : "Site"
                                            let imgSrc = getImageSrc(targetHost)
                                            if (!isImageActive(targetHost))
                                                switch (targetHost) {
                                                    case "SiteLeft_1":
                                                        hostOverride.SiteCenter = isImageActive("SiteBarLeft") ? getTextObj("SiteNameLeft").get("text") : null
                                                    // falls through
                                                    case "SiteRight_1":
                                                        hostOverride.SiteCenter = hostOverride.SiteCenter || isImageActive("SiteBarRight") ? getTextObj("SiteNameRight").get("text") : null
                                                    // falls through
                                                    case "DistrictLeft_1":
                                                    case "DistrictRight_1":
                                                        imgSrc = getImageSrc(targetType + "Center_1")
                                                        break
                                                    case "SiteCenter_1":
                                                        hostOverride.SiteLeft = isImageActive("SiteBar") ? getTextObj("SiteName").get("text") : null
                                                    // falls through
                                                    case "DistrictCenter_1":
                                                        imgSrc = getImageSrc(targetType + "Left_1")
                                                        break
                                                // no default
                                                }
                                            setImage(targetHost, imgSrc)
                                        } else {
                                            setImage(...param.split(":"))
                                        }
                                    }                            
                                    setImage("SiteBarCenter", "blank")
                                    setText("SiteNameCenter", " ")
                                    setImage("SiteBarLeft", "blank")
                                    setText("SiteNameLeft", " ")
                                    setImage("SiteBarRight", "blank")
                                    setText("SiteNameRight", " ")
                                    //D.Alert(`Hosts: ${D.JS(hosts)}, Names: ${D.JS(customNames)}`)
                                    for (let i = 0; i < hosts.length; i++) {
                                        customNames[i] = customNames[i] || hostOverride[hosts[i]]
                                        if (!customNames[i])
                                            break
                                        switch(hosts[i]) {
                                            case "SiteCenter":
                                                setImage("SiteBarCenter", customNames[i] === "x" ? "blank" : "base")
                                                setText("SiteNameCenter", customNames[i] === "x" ? " " : customNames[i])
                                                break
                                            case "SiteLeft":
                                                setImage("SiteBarLeft", customNames[i] === "x" ? "blank" : "base")
                                                setText("SiteNameLeft", customNames[i] === "x" ? " " : customNames[i])
                                                break
                                            case "SiteRight":
                                                setImage("SiteBarRight", customNames[i] === "x" ? "blank" : "base")
                                                setText("SiteNameRight", customNames[i] === "x" ? " " : customNames[i])
                                            // no default
                                        }                                        
                                    }
                                    break
                                }
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
                                        D.Alert(getImageData(textObj), "IMAGES, !img getData")
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
                                        setText(textObj, {top: parseInt(textObj.get("top")), left: getBlankLeft(textObj), layer: textObj.get("layer")})
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
                                args[5] = args[5] ? 
                                    args[5].includes("vertAlign") ? args[5] : `vertAlign:${textData.vertAlign}, ${args[5]}` :
                                    `vertAlign:${textData.vertAlign || "top"}`
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
                                    if (hostName && objLayer)
                                        regText(textObj, hostName, objLayer, !isStartActive || isStartActive !== "false", !isShadow || isShadow !== "false", justification || "center", D.ParseToObj(args.join(" ")))
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
               /* if (D.GetChar(imgObj)) {
                    IMAGEREGISTRY[name].activeLayer = "objects"
                    IMAGEREGISTRY[name].startActive = true
                    addImgSrc(imgObj.get("imgsrc").replace(/med/gu, "thumb"), name, "base")
                    setImage(name, "base")
                } else { */
                addImgSrc(imgObj.get("imgsrc").replace(/med/gu, "thumb"), name, srcName)
                setImage(name, srcName)
               // }
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
                        imgObj.set("layer", "gmlayer")
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
            if (VAL({imgObj: imgObj}, "setImgParams")) {
                imgObj.set(params)
                return imgObj
            }
            return false
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
        orderImages = (imgRefs, isToBack = false) => {
            let imgObjs
            if (VAL({graphic: imgRefs}, "orderImages", true)) {
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
            }
        },
        layerImages = (imgRefs, layer) => {
            const imgObjs = getImageObjs(imgRefs)
            //orderImages(IMAGELAYERS.objects)
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

        },
        spreadImages = (leftImgRef, rightImgRef, midImgRefOrRefs, width, minOverlap = 20, maxOverlap = 40) => {
            const leftData = getImageData(leftImgRef),
                rightData = getImageData(rightImgRef),
                midData = _.map(_.flatten([midImgRefOrRefs]), v => getImageData(v)),
                spread = parseFloat(width)
            let dbString = ""
            D.Alert(`minOverlap: ${minOverlap}, maxOverlap: ${maxOverlap}`)
            if (VAL({list: [leftData, rightData, ...midData], number: [spread]}, "spreadImages", true)) {
                setImgParams(leftData.id, {top: leftData.top, left: leftData.left})
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
                    D.Alert(dbString + `Setting Right to {left: ${parseInt(leftData.rightEdge)} + 0.5x${parseInt(rightData.width)} = ${parseInt(leftData.rightEdge + 0.5*rightData.width)}}`, "spreadImages")
                    return setImgParams(rightData.id, {
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
                    setImgParams(midData[0].id, {
                        top: leftData.top + 20,
                        left: leftData.rightEdge - stretchOverlap + 0.5*stretchWidth,
                        width: stretchWidth
                    })
                    dbString += `Setting Right Image to: {left: ${parseInt(leftData.rightEdge - 2*stretchOverlap + stretchWidth + 0.5*rightData.width)} (L.re:${parseInt(leftData.rightEdge)} - 2×sO:${parseInt(stretchOverlap)} + sW:${parseInt(stretchWidth)} + 0.5×R.w:${parseInt(rightData.width)})}<br>`
                    setImgParams(rightData.id, {
                        top: leftData.top + 40,
                        left: leftData.rightEdge - 2*stretchOverlap + stretchWidth + 0.5*rightData.width
                    })
                    D.Alert(dbString, "spreadImage")
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
                        setImgParams(imgID, {
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
                    setImgParams(rightData.id, {
                        top: leftData.top + testVertSpread,
                        left: leftData.leftEdge + spread - 0.5*rightData.width
                    })
                    D.Alert(dbString, "spreadImages")
                    //for (const imgData of midData)
                    //    setImage(imgData.id, "blank")
                    return true
                }
            }
            return false
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
        getTextWidth = (textRef, text, maxWidth = 0) => {
            const textObj = getTextObj(textRef),
                textData = getTextData(textObj),
                maxW = textData && textData.maxWidth || maxWidth || 0
            if (VAL({ textObj: textObj }, "getTextWidth")) {
                const font = textObj.get("font_family").split(" ")[0].replace(/[^a-zA-Z]/gu, ""),
                    size = textObj.get("font_size"),
                    textString = text === "" ? "" : text || textObj.get("text") || "",
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
                if (maxWidth !== false && maxW)
                    textLines = _.compact(splitTextLines(textObj, text, maxW, textData && textData.justification))
                else if (maxWidth !== false && text && text.includes("\n"))
                    textLines = _.compact(text.split(/\s*\n+\s*/gu))
                if (textLines.length) {
                    let maxLine = textLines[0]
                    //D.Alert(`TextLines = ${textLines}`)
                    for (const textLine of textLines)
                        //D.Alert(`MAX {${getTextWidth(textObj, maxLine)}} = ${maxLine}<br>TEXT: {${getTextWidth(textObj, textLine)}} = ${textLine}`)
                        maxLine = getTextWidth(textObj, maxLine, false) < getTextWidth(textObj, textLine.trim(), false) ? textLine.trim() : maxLine
                    
                    //D.Alert(`Max Line = ${D.JS(maxLine)}, ${getTextWidth(textObj, maxLine)}`)
                    //D.Alert(`GetTextWidth called. Text: ${text} MaxLine: ${maxLine} with maxWidth ${D.JS(maxWidth)} and maxW ${D.JS(maxW)}<br>Width: ${getTextWidth(textObj, maxLine, false)}`)
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
        getBlankLeft = (textRef, justification, maxWidth = 0) => {
            const textObj = getTextObj(textRef),
                justify = justification || getTextData(textRef).justification
            if (VAL({textObj: textObj}, "getBaseLeft"))               
                //D.Alert(`getBlankLeft Called on ${textObj.get("text")} with maxWidth ${maxWidth} into getTextWidth -->`)
                return textObj.get("left") + (justify === "left" ? -0.5 : justify === "right" ? 0.5 : 0) * getTextWidth(textObj, textObj.get("text"), maxWidth)
            return false
        },
        getRealLeft = (textRef, params = {}) => {
            const textObj = getTextObj(textRef),
                textData = getTextData(textRef)
            if (VAL({textObj: textObj}, "getRealLeft")) {
                params.left = params.left || textData.left
                params.text = params.text || textObj.get("text")
                params.justification = params.justification || textData.justification
                //D.Alert(`getRealLeft Called on ${params.text} with maxWidth ${params.maxWidth} into getTextWidth -->`)
                return params.left + (params.justification === "left" ? 0.5 : params.justification === "right" ? -0.5 : 0) * getTextWidth(textObj, params.text, params.maxWidth || 0)
            }
            return false            
        }        
    // #endregion

    // #region TEXT OBJECT MANIPULATORS: Buffering, Justifying, Splitting
    const buffer = (textRef, width) => " ".repeat(Math.max(0, Math.round(width/getTextWidth(textRef, " ", false)))),
        splitTextLines = (textRef, text, maxWidth, justification = "left") => {
            const textObj = getTextObj(textRef)
            let textStrings = _.without(text.split(/(\s|-)/gu), " "),
                splitStrings = [],
                highWidth = 0
            for (let i = 0; i < textStrings.length; i++)
                if (textStrings[i] === "-") {
                    textStrings[i-1] = textStrings[i-1] + "-"
                    textStrings = [...[...textStrings].splice(0,i), ...[...textStrings].splice(i+1)]
                }
            while (textStrings.length) {
                let thisString = ""
                while (thisString.length < maxWidth && textStrings.length)
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
                TEXTREGISTRY[getTextKey(textObj)].left = getBlankLeft(textObj, justification, maxWidth)
                TEXTREGISTRY[getTextKey(textObj)].width = getTextWidth(textObj, textObj.get("text"), maxWidth)
                if (hasShadowObj(textObj)) {
                    const shadowKey = getTextData(textObj).shadow,
                        shadowObj = getTextObj(shadowKey)
                    TEXTREGISTRY[shadowKey].justification = justification || "center"
                    TEXTREGISTRY[shadowKey].left = getBlankLeft(shadowObj, justification, maxWidth)
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
                        justification: justification || "center",
                        maxWidth: options.maxWidth || 0,
                        lineHeight: textObj.get("height"),
                        vertAlign: options.vertAlign || "top"             
                    }), options)
                TEXTREGISTRY[name].left = getBlankLeft(textObj)
                IDREGISTRY[textObj.id] = name
                setText(textObj, Object.assign(_.filter(_.pick(options, C.TEXTPROPS), (v, k) => curTextParams[k] !== v), {left: getBlankLeft(textObj, justification || "center", options.maxWidth), layer: curTextParams.layer}))                
                if (hasShadow) {
                    const shadowOptions = Object.assign(_.omit(_.clone(TEXTREGISTRY[name]), "id"), {
                        name: `${name}Shadow`,
                        color: "rgb(0,0,0)",
                        left: TEXTREGISTRY[name].left + Math.round(TEXTREGISTRY[name].font_size/10),
                        top: TEXTREGISTRY[name].top + Math.round(TEXTREGISTRY[name].font_size/10),      
                        shadowMaster: name
                    })
                    DB(`Shadow Options: ${D.JS(shadowOptions)}`, "regText")
                    const shadowObj = makeText(shadowOptions.name, TEXTREGISTRY[name].activeLayer, TEXTREGISTRY[name].startActive, false, justification, shadowOptions, isSilent)
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
        makeText = (hostName, activeLayer, startActive, hasShadow, justification, options = {}, isSilent = false) => {
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
            textObj.set("left", getRealLeft(textObj, {left: textObj.get("left"), justification: justification || "center", maxWidth: options.maxWidth || 0}))
            regText(textObj, hostName, actLayer, isStartingActive, hasShadow, justification, options, isSilent)
            return textObj
        },
        setText = (textRef, options = {}, isTemporary = false) => {
            const textObj = getTextObj(textRef),
                textData = getTextData(textRef),
                textOptions = VAL({string: options}) ? {text: options} : options
            if (VAL({textObj: textObj}, "setText")) {
                textOptions.left = textOptions && textOptions.left || textData && textData.left || getBlankLeft(textObj, textObj.get("text"))
                textOptions.top = textOptions && textOptions.top || textData && textData.top || textObj.get("top")
                textOptions.text = (textOptions && textOptions.text || textData && textData.text || textObj.get("text")).trim()
                textOptions.maxWidth = textOptions && textOptions.maxWidth || textData && textData.maxWidth
                const objParams = Object.assign(_.pick(textOptions, C.TEXTPROPS))
                if (textOptions.maxWidth > 0 && objParams.text) {
                    const splitLines = splitTextLines(textObj, objParams.text, textOptions.maxWidth, textData.justification)
                    objParams.text = splitLines.join("\n")           
                }                
                if (objParams.text.split("\n").length > 1) 
                    switch (textData.vertAlign || textOptions.vertAlign || "top") {
                        case "top":
                            textOptions.shifttop = (textOptions.shifttop || 0) + 0.5*(objParams.text.split("\n").length - 1)*(textData && textData.lineHeight || 0)
                            break
                        case "bottom":
                            textOptions.shifttop = (textOptions.shifttop || 0) - 0.5*(objParams.text.split("\n").length - 1)*(textData && textData.lineHeight || 0)
                            break
            /* no default */
                    }         
                for (const key of _.intersection(_.keys(textOptions), ["shiftleft", "shifttop"]))
                    objParams[key.slice(5)] = textData[key.slice(5)] + parseInt(textOptions[key])
                if (!isTemporary)
                    for (const key of _.intersection(_.keys(textOptions), _.keys(textData)))
                        TEXTREGISTRY[textData.name][key] = textOptions[key]
                objParams.left = getRealLeft(textObj, {left: objParams.left, text: textOptions.text, justification: textData.justification, maxWidth: textOptions.maxWidth})
                textObj.set(objParams)
                if (textData.shadow) {
                    const shadowObj = getTextShadowObj(textRef),
                        shadowObjParams = _.omit(objParams, ["color"])
                    shadowObjParams.left += Math.round(textData.font_size/10)
                    shadowObjParams.top += Math.round(textData.font_size/10)
                    shadowObj.set(shadowObjParams)
                    toFront(shadowObj)
                }
                toFront(textObj)
            }
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
            for (const textName of _.keys(TEXTREGISTRY))
                if (!getTextObj(textName))
                    removeText(textName)
        },
        resetTextRegistry = () => {
            STATEREF.textregistry = {}
            STATEREF.idregistry = {}
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

on("ready", () => {
    Media.RegisterEventHandlers()
    Media.CheckInstall()
    D.Log("Media Ready!")
})
void MarkStop("Media")