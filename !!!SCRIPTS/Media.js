void MarkStart("Media")
const Media = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Media",

    // #region COMMON INITIALIZATION
        STATEREF = C.ROOT[SCRIPTNAME],	// eslint-disable-line no-unused-vars
        VAL = (varList, funcName, isArray = false) => D.Validate(varList, funcName, SCRIPTNAME, isArray), // eslint-disable-line no-unused-vars
        DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        LOG = (msg, funcName) => D.Log(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        THROW = (msg, funcName, errObj) => D.ThrowError(msg, funcName, SCRIPTNAME, errObj), // eslint-disable-line no-unused-vars

        checkInstall = () => {
            C.ROOT[SCRIPTNAME] = C.ROOT[SCRIPTNAME] || {}
            initialize()
        },
    // #endregion

    // #region LOCAL INITIALIZATION
        initialize = () => {
            STATEREF.imgregistry = STATEREF.imgregistry || {}
            STATEREF.textregistry = STATEREF.textregistry || {}
            STATEREF.animregistry = STATEREF.animregistry || {}
            STATEREF.idregistry = STATEREF.idregistry || {}
            STATEREF.areas = STATEREF.areas || {}
            STATEREF.tokenregistry = STATEREF.tokenregistry || {}
            STATEREF.activePlaylists = STATEREF.activePlaylists || []
            STATEREF.TokenSrcs = STATEREF.TokenSrcs || {}
            STATEREF.imgResizeDims = STATEREF.imgResizeDims || {height: 100, width: 100}
            STATEREF.activeAnimations = STATEREF.activeAnimations || {}
            STATEREF.curLocation = STATEREF.curLocation || "DistrictCenter:blank SiteCenter:blank"

            // STATEREF.imgregistry.mapButtonDomain_1.cycleSrcs = ["camarilla", "nodomain", "anarch"]
        // delete STATEREF.tokenregistry["85239212/An9D7-g4OmLdjhKm-NbKnA/1561848759"]
        // Initialize IMGDICT Fuzzy Dictionary
            STATEREF.IMGDICT = Fuzzy.Fix()
            for (const imgKey of _.keys(STATEREF.imgregistry))
                STATEREF.IMGDICT.add(imgKey)

        // Initialize TEXTDICT Fuzzy Dictionary
            STATEREF.TEXTDICT = Fuzzy.Fix()
            for (const textKey of _.keys(STATEREF.textregistry))
                STATEREF.TEXTDICT.add(textKey)
        
        // Initialize AREADICT Fuzzy Dictionary
            STATEREF.AREADICT = Fuzzy.Fix()
            for (const areaKey of _.keys(STATEREF.areas))
                STATEREF.AREADICT.add(areaKey)


            STATEREF.animregistry.WeatherLightning_1.name = "WeatherLightning_1"
            const animObj = getObj("graphic", STATEREF.animregistry.WeatherLightning_1.id)
            animObj.set("name", "WeatherLightning_1")
        },
            
        
    // #endregion

    // #region EVENT HANDLERS: (HANDLEINPUT)
        onChatCall = (call, args, objects, msg) => { // eslint-disable-line no-unused-vars
            let textParams, textModes
            switch (call) {
                case "!media": {
                    switch (D.LCase(call = args.shift())) {
                        case "fix": {
                            const imgReport = fixImgObjs(),
                                textReport = fixTextObjs()
                            D.Alert(`${imgReport}<br>${textReport}`, "!media fix")
                            break
                        }
                        // no default
                    }
                    break
                }
                case "!area": {
                    const [imgObj] = Listener.GetObjects(objects, "graphic")
                    switch (D.LCase(call = args.shift())) {
                        case "reg": case "register": {
                            if (args.length && VAL({imgObj}, "!area register"))
                                regArea(imgObj, args.shift())
                            else       
                                D.Alert("Syntax: !area reg &lt;areaName&gt;", "!area reg")
                            break
                        }
                        case "get": {
                            switch (D.LCase(call = args.shift())) {
                                case "names": {
                                    D.Alert(`Registered Areas:<br>${D.JS(_.keys(AREAREGISTRY))}`)
                                    break
                                }
                                // no default
                            }
                        }
                        // no default
                    }
                    break
                }
                case "!img": {
                    const imgObjs = Listener.GetObjects(objects, "graphic")
                    switch (D.LCase(call = args.shift())) {
                        case "backup": {
                            STATEREF.backup = {
                                arearegistry: JSON.parse(JSON.stringify(AREAREGISTRY)),
                                imgregistry: JSON.parse(JSON.stringify(IMGREGISTRY)),
                                textregistry: JSON.parse(JSON.stringify(TEXTREGISTRY))
                            }
                            D.Alert("Media Registry Backup Updated.", "!img backup")
                            break
                        }
                        case "reg": case "register": {
                            const [imgObj] = imgObjs
                            if (VAL({imgObj}, "!img register"))                                
                                switch (D.LCase(call = args.shift())) {
                                    case "token": {
                                        const tokenName = args.shift()
                                        if (VAL({string: tokenName}, "!img register token"))
                                            regRandomizerToken(imgObj, tokenName)
                                        break
                                    }
                                    default: {
                                        const [hostName, srcName, objLayer] = [call, args.shift(), args.shift()]
                                        if (hostName && srcName && objLayer)
                                            regImg(imgObj, hostName, srcName, objLayer, D.ParseToObj(args.join(" ")))
                                        else
                                            D.Alert("Syntax: !img reg &lt;hostName&gt; &lt;currentSourceName&gt; &lt;activeLayer&gt; [params (\"key:value, key:value\")]", "MEDIA: !img reg")    
                                        break
                                    }
                                }
                            else
                                D.Alert("Syntax: !img reg &lt;hostName&gt; &lt;currentSourceName&gt; &lt;activeLayer(objects/map/walls/gmlayer)&gt; &lt;isStartingActive&gt; [params (\"key:value, key:value\")]<br>!img reg token &lt;tokenName&rt;", "MEDIA: !img reg")
                            break
                        }
                        case "set": {
                            switch (D.LCase(call = args.shift())) {
                                case "mode": {
                                    const [hostName, mode, ...paramArgs] = args,
                                        imgKey = getImgKey(hostName),
                                        // D.Alert(`Sending to ParseParams: ${args.join(" ")} --> ${D.JS(D.ParseParams(args.join(" ")))}`)
                                        params = D.ParseParams(paramArgs.join(" "))
                                        // D.Alert(`Params: ${D.JS(params)}`)
                                    if (!Session.Modes.includes(mode)) {
                                        D.Alert("Mode Set Syntax:<br><br><b>!img set mode (hostName) (mode) (key:val, key:val...)</b><br><br>isForcedOn: true, false, null, \"LAST\"<br>isForcedState: true, null, (string)<br>lastState: null, (string)<br>lastActive: true, false", "!img set mode")
                                    }
                                    else {
                                        IMGREGISTRY[imgKey].modes = IMGREGISTRY[imgKey].modes || {}
                                        IMGREGISTRY[imgKey].modes[mode] = IMGREGISTRY[imgKey].modes[mode] || {}
                                        for (const key of _.keys(params)) {
                                            if (["true", "false", "null"].includes(D.LCase(params[key])))
                                                params[key] = {true: true, false: false, null: null}[D.LCase(params[key])]
                                            IMGREGISTRY[imgKey].modes[mode][key] = params[key]
                                        }                                                
                                        D.Alert(`${mode} mode for ${imgKey} set to ${D.JS(IMGREGISTRY[imgKey].modes[mode])}`, "!img set mode")
                                    }
                                    break
                                }
                                case "source": case "src": {
                                    const [imgObj] = imgObjs,
                                        [hostName, srcName] = [getImgKey(imgObj), args.shift()]
                                    if (isRegImg(hostName))
                                        setImg(hostName, srcName)
                                    else
                                        D.Alert(`Img name ${D.JS(hostName)} is not registered.`, "MEDIA: !img set src")
                                    break
                                }
                                case "area": {
                                    const [imgObj] = imgObjs
                                    if (VAL({imgObj}, "!img set area"))
                                        setImgArea(imgObj, args.shift(), args.shift().toLowerCase === "resize")
                                    break
                                }
                                case "params": {
                                    const [imgObj] = imgObjs,
                                        params = D.ParseParams(args)
                                    if (VAL({imgObj}, "!img set params"))
                                        setImgTemp(imgObj, params)
                                    break
                                }
                                // no default
                            }
                            break
                        }
                        case "clean": case "cleanreg": case "cleanregistry": {
                            switch (D.LCase(call = args.shift())) {
                                case "confirm": {
                                    cleanRegistryConfirm()
                                    break
                                }
                                default: {
                                    cleanRegistry()
                                    break
                                }
                            }
                            break
                        }
                        case "add": {
                            const hostName = getImgKey(imgObjs.shift())
                            let srcName
                            switch (D.LCase(call = args.shift())) {
                                case "cyclesrc": case "cycle": {
                                    srcName = args.shift()
                                    if (VAL({string: srcName}, "!img add cyclesrc") && isRegImg(hostName)) {
                                        IMGREGISTRY[hostName].cycleSrcs = IMGREGISTRY[hostName].cycleSrcs || []
                                        IMGREGISTRY[hostName].cycleSrcs.push(srcName)
                                    }
                                }
                                // falls through
                                case "src": case "source": {
                                    srcName = srcName || args.shift()
                                    if (VAL({string: srcName}, "!img add cyclesrc") && isRegImg(hostName)) {
                                        if (!_.isObject(IMGREGISTRY[hostName].srcs))
                                            IMGREGISTRY[hostName].srcs = {}
                                        if (srcName)
                                            addImgSrc(msg, hostName, srcName)
                                        else
                                            D.Alert(`Invalid image name '${D.JS(srcName)}'`, "MEDIA: !img add src")
                                    } else {
                                        D.Alert(`Host name '${D.JS(hostName)}' not registered.`, "MEDIA: !img add src")
                                    }
                                    break
                                }
                                case "tokensrc": case "tokensource": {
                                    const [tokenName] = args
                                    if (isRegImg(tokenName))
                                        addTokenSrc(hostName, tokenName)
                                    break
                                }
                                default: {
                                    D.Alert("<b>Syntax:<br><br><pre>!img add &lt;src/area&gt; &lt;hostName&gt; &lt;srcName&gt;</pre>", "MEDIA: !img add")
                                    break
                                }
                            }
                            break
                        }
                        case "del": case "delete": {
                            switch (D.LCase(call = args.shift())) {
                                case "all": {
                                    for (const hostName of _.keys(IMGREGISTRY))
                                        if (D.LCase(hostName).includes(D.LCase(args.join(" "))))
                                            removeImg(hostName)
                                    break
                                }
                                default: {
                                    for (const imgObj of imgObjs)
                                        removeImg(imgObj)
                                    break
                                }
                            }
                            break
                        }
                        case "unreg": case "unregister": {
                            switch (D.LCase(call = args.shift())) {
                                case "all": {
                                    for (const hostName of _.keys(IMGREGISTRY))
                                        if (D.LCase(hostName).includes(D.LCase(args.join(" "))))
                                            removeImg(hostName, true)
                                    break
                                }
                                default: {
                                    const imgKey = getImgKey(args.join(" "))
                                    args.unshift(call)
                                    if (imgObjs.length)
                                        for (const imgObj of imgObjs)
                                            removeImg(imgObj, true)
                                    else if (imgKey)
                                        delete IMGREGISTRY[imgKey]
                                    break
                                }
                            }
                            break
                        }
                        case "reset": {
                            switch (D.LCase(call = args.shift())) {
                                case "pos": case "position": {
                                    for (const imgObj of imgObjs)
                                        if (VAL({imgObj}, "!img set pos")) {
                                            const hostName = getImgKey(imgObj)
                                            IMGREGISTRY[hostName].top = D.Int(imgObj.get("top"))
                                            IMGREGISTRY[hostName].left = D.Int(imgObj.get("left"))
                                            IMGREGISTRY[hostName].height = D.Int(imgObj.get("height"))
                                            IMGREGISTRY[hostName].width = D.Int(imgObj.get("width"))
                                            D.Alert(`Position Set for Img ${hostName}<br><br><pre>${D.JS(IMGREGISTRY[hostName])}</pre>`)
                                        }
                                    break
                                }
                                case "cyclesrc": case "cyclesrcs": {
                                    const imgKey = getImgKey(imgObjs.shift())
                                    if (isRegImg(imgKey))
                                        delete IMGREGISTRY[imgKey].cycleSrcs
                                    break
                                }
                                // no default
                            }
                            break
                        }
                        case "toggle": {
                            switch (D.LCase(call = args.shift())) {
                                case "on": {
                                    for (const imgObj of imgObjs)
                                        toggleImg(imgObj, true)
                                    break
                                }
                                case "off": {
                                    for (const imgObj of imgObjs)
                                        toggleImg(imgObj, false)
                                    break
                                }
                                case "log": {
                                    imgRecord = !imgRecord
                                    if (imgRecord)
                                        D.Alert("Logging image data as they are added to the sandbox.", "MEDIA, !img toggle log")
                                    else
                                        D.Alert("Img logging disabled.", "MEDIA, !img toggle log")
                                    break
                                }
                                case "resize": {
                                    const params = D.ParseParams(args)
                                    if (!imgResize || params.length) {
                                        imgResize = true
                                        for (const param of params)
                                            [,STATEREF.imgResizeDims[param[0]]] = [param]
                                        D.Alert(`New imagess automatically resized to height: ${STATEREF.imgResizeDims.height}, width: ${STATEREF.imgResizeDims.width}.`, "!img toggle resize")
                                    } else {
                                        imgResize = false
                                        D.Alert("Img resizing disabled.", "MEDIA, !img toggle resize")
                                    }
                                    break
                                }
                                default: {
                                    D.Alert("Must state either 'on', 'off', 'log' or 'resize'.  <b>Syntax:</b><br><br><pre>!img toggle &lt;on/off&gt; &lt;hostnames&gt;</pre><br><pre>!img toggle log/resize</pre>", "MEDIA: !img toggle")
                                    break
                                }
                            }
                            break
                        }
                        case "align": {
                            alignImgs(imgObjs, ...args)
                            break
                        }
                        case "get": {
                            switch (D.LCase(call = args.shift())) {
                                case "zlevels": {
                                    const sortFunc = (a, b) => {
                                            let [aVal, bVal] = [1000*a[2], 1000*b[2]]
                                            if (a[2] === b[2]) {
                                                if (a[0] === b[0]) {
                                                    aVal += Number(a[1].match(/_(\d*)$/i)[1])
                                                    bVal += Number(b[1].match(/_(\d*)$/i)[1])
                                                } else {
                                                    aVal += a[0] > b[0] ? 1 : -1
                                                    bVal += b[0] > a[0] ? 1 : -1
                                                }
                                                return aVal - bVal
                                            }
                                            return bVal - aVal
                                        },
                                        reportTables = [
                                            getZLevels().map.sort(sortFunc).map(x => `<tr><td><b>${x[2]}</b></td><td>${x[0]}</td><td>${x[1]}</td></tr>`),
                                            getZLevels().objects.sort(sortFunc).map(x => `<tr><td><b>${x[2]}</b></td><td>${x[0]}</td><td>${x[1]}</td></tr>`)
                                        ]
                                    D.Alert(`<h2>MAP</h2><table><tr><td style="width: 60px;"></td><td style="width: 100px;"></td><td style="width: 100px;"></td></tr>${reportTables[0]}</table><h2>OBJECTS</h2><table><tr><td style="width: 60px;"></td><td style="width: 100px;"></td><td style="width: 100px;"></td></tr>${reportTables[1]}</table>`)
                                    break
                                }
                                case "data": {
                                    D.Alert(D.JS(getImgData(imgObjs.shift())), "MEDIA, !img get data")
                                    break
                                }
                                case "names": {
                                    D.Alert(`<b>IMAGE NAMES:</b><br><br>${D.JS(_.keys(IMGREGISTRY))}`)
                                    break
                                }
                                // no default
                            }
                            break
                        }
                        case "fix": {
                            switch (D.LCase(call = args.shift())) {
                                case "layers": {
                                    setActiveLayers(args.shift() === "true")
                                    break
                                }
                                case "zlevels": {
                                    setZIndices()
                                    break
                                }
                                case "backgrounds": {
                                    for (const imgObj of getImgObjs(BGIMGS.keys))
                                        setImgData(imgObj, {
                                            top: BGIMGS.top,
                                            left: BGIMGS.left,
                                            height: BGIMGS.height,
                                            width: BGIMGS.width
                                        }, true)
                                    for(const imgObj of getImgObjs(MAPIMGS.keys))                                    
                                        setImgData(imgObj, {
                                            top: MAPIMGS.top,
                                            left: MAPIMGS.left,
                                            height: MAPIMGS.height,
                                            width: MAPIMGS.width
                                        }, true)
                                    break
                                }
                                // no default
                            }
                            break
                        }
                        case "adjust": {
                            const [deltaX, deltaY] = args.map(x => D.Float(x))
                            for (const imgObj of imgObjs)
                                setImgTemp(imgObj, {
                                    left: D.Float(imgObj.get("left")) + deltaX,
                                    top: D.Float(imgObj.get("top")) + deltaY
                                })
                            break
                        }
                        // no default
                    }
                    break
                }
                case "!text": {
                    const textObjs = Listener.GetObjects(objects, "text")
                    switch (D.LCase(call = args.shift())) {                                                
                        case "get": {
                            switch (D.LCase(call = args.shift())) {
                                case "data": {
                                    const [textObj] = textObjs
                                    if (VAL({textObj}, "!text get data"))
                                        D.Alert(D.JS(getTextData(textObj)), "!text get data")
                                    break
                                }
                                case "width": {
                                    const [textObj] = textObjs,
                                        textString = msg.content.match(/@@(.*?)@@/ui)[1]
                                    D.Alert(`The width of @@${textString}@@ is ${getTextWidth(textObj, textString, false)}`)
                                    break
                                }
                                case "names": {
                                    D.Alert(D.JS(_.keys(TEXTREGISTRY)), "!text get names")
                                    break
                                }
                                case "widths": {
                                    const dbStrings = []
                                    for (const textData of _.values(STATEREF.textregistry)) {
                                        textData.justification = "left"
                                        const textObj = getObj("text", textData.id)
                                        if (textObj) {
                                            const text = textObj.get("text"),
                                                left = textObj.get("left"),
                                                textWidth = getTextWidth(textObj, text)
                                            let width = textObj.get("width")                                                
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
                        }
                        case "set": {
                            switch (D.LCase(call = args.shift())) {
                                case "mode": {
                                    const [hostName, mode, key, val] = args,
                                        textKey = getTextKey(hostName)
                                    if (!Session.Modes.includes(mode) || !["isForcedOn", "isForcedState", "lastActive", "lastState"].includes(key) || !["true", "false", "null", "LAST"].includes(val))
                                    {D.Alert("Mode Set Syntax:<br><br><b>!text set mode (hostName) (mode) (key) (val)</b>", "!text set mode")}
                                    else {
                                        TEXTREGISTRY[textKey].modes = TEXTREGISTRY[textKey].modes || {}
                                        TEXTREGISTRY[textKey].modes[mode] = TEXTREGISTRY[textKey].modes[mode] || {}
                                        TEXTREGISTRY[textKey].modes[mode][key] = {true: true, false: false, null: null, LAST: "LAST"}[val]
                                        D.Alert(`${mode} mode for ${textKey} set to ${D.JS(TEXTREGISTRY[textKey].modes[mode])}`, "!text set mode")
                                    }
                                    break
                                }
                                case "updateslave": {
                                    updateSlaveText(args.shift())
                                    break
                                }
                                case "slave": {
                                    try {
                                        const [textObj] = textObjs,
                                            [hostName, edgeDir, horizPad, vertPad] = args
                                        linkText(hostName, {[edgeDir]: [getTextKey(textObj)]}, D.Int(horizPad), D.Int(vertPad))
                                    } catch (errObj) {
                                        D.Alert(`Syntax: !text set slave (hostName) (edgeDirection) (horizPad) (vertPad)<br>${JSON.stringify(errObj)}`, "!text set slave")
                                    }
                                    break
                                }
                                case "justify": case "justification": case "just": {
                                    const justification = args.shift() || "center"
                                    for (const textObj of textObjs)
                                        justifyText(textObj, justification)
                                    break
                                }
                                case "params": {
                                    const [textObj] = textObjs,
                                        params = D.ParseParams(args)
                                    if (VAL({textObj}, "!text set params"))
                                        setTextData(textObj, params)
                                    break   
                                }
                                default: {
                                    const [textObj] = textObjs
                                    if (VAL({textObj}, "!text set"))
                                        setText(textObj, args.join(" ") || " ")
                                    break
                                }
                                // no default                                    
                            }
                            break
                        }
                        case "clean": case "cleanreg": case "cleanregistry": {
                            cleanTextRegistry()
                            break
                        }
                        case "reset": case "resetreg": case "resetregistry": {
                            switch (D.LCase(call = args.shift())) {
                                case "pos": case "position": {
                                    const [textObj] = textObjs
                                    if (isRegText(textObj)) {
                                        const hostName = getTextKey(textObj)
                                        setTextData(textObj, {top: D.Int(textObj.get("top")), left: getBlankLeft(textObj), layer: textObj.get("layer")})
                                        D.Alert(`Position Set for Text ${hostName}<br><br><pre>${D.JS(TEXTREGISTRY[hostName])}</pre>`)
                                    } else {
                                        D.Alert("Select a text object first!", "MEDIA: !text set position")
                                    }
                                    break
                                }
                                default: {
                                    resetTextRegistry()
                                    break
                                }
                            }
                            break
                        }
                        case "del": case "delete": {
                            switch (D.LCase(call = args.shift())) {
                                case "all": {
                                    for (const hostName of _.keys(TEXTREGISTRY))
                                        if (D.LCase(hostName).includes(D.LCase(args.join(" "))))
                                            removeText(hostName)
                                    break
                                }
                                default: {
                                    for (const textObj of textObjs)
                                        removeText(textObj)
                                    break
                                }
                            }
                            break
                        }
                        case "rereg": case "reregister": {
                            const [textObj] = textObjs
                            if (isRegText(textObj)) {                         
                                const textData = getTextData(msg, true)
                                args[0] = args[0] || textData.name
                                args[1] = args[1] || textData.activeLayer
                                args[2] = args[2] || hasShadowObj(msg)
                                args[3] = args[3] || textData.justification
                                textParams = args.slice(3).join(" ")
                                textParams = _.compact([
                                    textParams.includes("vertAlign") ? "" : `vertAlign:${textData.vertAlign || "top"}`,
                                    textData.maxWidth && !textParams.includes("maxWidth") ? `maxWidth:${textData.maxWidth}` : "",
                                    textParams.includes("zIndex") ? "" : `zIndex:${textData.zIndex || 300}`
                                ]).join(",") + textParams
                                textModes = JSON.parse(JSON.stringify(textData.modes))
                                removeText(msg, true, true)
                            }
                        }
                        // falls through
                        case "reg": case "register": {
                            if (args.length) {
                                const [textObj] = textObjs
                                if (textObj) {
                                    const [hostName, objLayer, isShadow, justification, ...paramArgs] = args
                                    textParams = textParams || paramArgs.join(" ")
                                    if (hostName && objLayer) {
                                        regText(textObj, hostName, objLayer, !isShadow || isShadow !== "false", justification || "center", D.ParseToObj(textParams))
                                        if (textModes)
                                            TEXTREGISTRY[getTextKey(textObj)].modes = textModes
                                    } else {
                                        D.Alert("Syntax: !text reg &lt;hostName&gt; &lt;activeLayer&gt; &lt;isMakingShadow&gt; &lt;justification&gt; [params (\"key:value, key:value\")]", "MEDIA: !text reg")
                                    }
                                } else {
                                    D.Alert("Select a text object first!", "MEDIA: !text reg")
                                }
                            } else {
                                D.Alert("Syntax: !text reg &lt;hostName&gt; &lt;activeLayer(objects/map/walls/gmlayer)&gt; &lt;isMakingShadow&gt; &lt;justification&gt; [params (\"key:value, key:value\")]", "MEDIA: !text reg")
                            }
                            break
                        }
                        case "unreg": case "unregister": {
                            switch (D.LCase(call = args.shift())) {
                                case "all": {
                                    for (const hostName of _.keys(TEXTREGISTRY))
                                        if (D.LCase(hostName).includes(D.LCase(args.join(" "))))
                                            removeText(hostName, true)
                                    break
                                }
                                default: {
                                    for (const textObj of textObjs)
                                        removeText(textObj, true)
                                    break
                                }
                            }
                            break
                        }
                        case "toggle": {
                            switch (D.LCase(call = args.shift())) {
                                case "on": {
                                    for (const textObj of textObjs)
                                        toggleText(textObj, true)
                                    break
                                }
                                case "off": {
                                    for (const textObj of textObjs)
                                        toggleText(textObj, false)
                                    break
                                }
                                default: {
                                    D.Alert("Must state either 'on' or 'off'.  <b>Syntax:</b><br><br><pre>!text toggle &lt;on/off&gt; &lt;hostnames&gt;</pre>", "MEDIA: !text toggle")
                                    break
                                }
                            }
                            break
                        }
                        // no default
                    }
                    break
                }
                case "!anim": {
                    const imgObjs = Listener.GetObjects(objects, "graphic")
                    switch(D.LCase(call = args.shift())) {
                        case "reg": case "register": {
                            const [imgObj] = imgObjs,
                                [animName, timeOut] = args
                            if (VAL({imgObj, string: animName, number: timeOut}, "!anim register"))
                                regAnimation(imgObj, animName, D.Float(timeOut))
                            else
                                D.Alert("Syntax: <b>!anim register <animName> <timeOut [ms]></b>", "!anim register")
                            break
                        }
                        case "set": {
                            switch (D.LCase(call = args.shift())) {
                                case "timeout": {
                                    const hostName = getImgKey(imgObjs.shift()),
                                        timeOut = args.shift()
                                    if (VAL({string: hostName, number: timeOut}, "!anim set timeout")) {
                                        ANIMREGISTRY[hostName].timeOut = D.Int(1000 * D.Float(timeOut))
                                        flashAnimation(hostName)
                                    }
                                    break
                                }
                                case "data": {
                                    const hostName = getImgKey(imgObjs.shift()),
                                        [minTime, maxTime, soundName] = args
                                    if (VAL({string: [hostName, soundName], number: [minTime, maxTime]}, "!anim set sound", true)) {
                                        setAnimData(hostName, minTime, maxTime, soundName)
                                        D.Alert(D.JS(ANIMREGISTRY[hostName]), "!anim set sound")
                                    }
                                    break
                                }
                                // no default
                            }
                            break
                        }
                        case "activate": {
                            activateAnimation(getImgKey(imgObjs.shift()) || args.shift(), args.shift(), args.shift())
                            break
                        }
                        case "deactivate": {
                            deactivateAnimation(getImgKey(imgObjs.shift()) || args.shift())
                            break
                        }
                        case "flash": {
                            flashAnimation(getImgKey(imgObjs.shift()) || args.shift())
                            break
                        }
                        case "kill": {
                            switch (D.LCase(call = args.shift())) {
                                case "all": {
                                    killAllAnims()
                                    break
                                }
                                default: {
                                    killAnimation(imgObjs.shift())
                                    break
                                }
                            }
                            break
                        }
                        // no default
                    }
                    break
                }
                case "!sound": {
                    switch (D.LCase(call = args.shift())) {
                        case "test": {
                            switch(D.LCase(call = args.shift())) {
                                case "objs": {
                                    const soundObjects = findObjs({_type: "jukeboxtrack"})
                                    D.Alert(D.JS(soundObjects.map(x => x.get("title"))))
                                    break
                                }
                                // no default
                            }
                            break
                        }
                        // no default
                    }
                    break
                }
                // no default
            }
        },
        onGraphicAdd = imgObj => {
            if (imgRecord)
                LOG(imgObj.get("imgsrc"))
            if (imgResize)
                imgObj.set(STATEREF.imgResizeDims)
            if (isRandomizerToken(imgObj))
                setRandomizerToken(imgObj)
        }
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    let [imgRecord, imgResize] = [false, false]
    const activeTimers = {},

    // #region CONFIGURATION
        IMGREGISTRY = STATEREF.imgregistry,
        IDREGISTRY = STATEREF.idregistry,
        TEXTREGISTRY = STATEREF.textregistry,
        ANIMREGISTRY = STATEREF.animregistry,
        GRAPHICREGISTRY = Object.assign({}, ANIMREGISTRY, IMGREGISTRY),
        AREAREGISTRY = STATEREF.areas,
        TOKENREGISTRY = STATEREF.tokenregistry,
        BGIMGS = {
            top: C.SANDBOX.top,
            left: C.SANDBOX.left,
            height: C.SANDBOX.height,
            width: C.SANDBOX.width,
            keys: [
                "Horizon",
                "WeatherGround",
                "WeatherMain",
                "WeatherFog",
                "WeatherClouds",
                "WeatherFrost",
                "Spotlight"       
            ]
        },
        MAPIMGS = {
            top: C.MAP.top,
            left: C.MAP.left,
            height: C.MAP.height,
            width: C.MAP.width,
            keys: [
                "TorontoMap",
                "TorontoMapDomainsOverlay",
                "TorontoMapAutarkisOverlay",
                "TorontoMapRackOverlay",
                "TorontoMapDistrictsOverlay",
                "TorontoMapParksOverlay"
            ]
        },
        ZLEVELS = {
            defaultZLevel: 500,
            map: {
                DistrictsAndSites: {
                    DistrictCenter_1: 140,
                    DistrictLeft_1: 140,
                    DistrictRight_1: 140,
                    SiteCenter_1: 145,
                    SiteLeft_1: 145,
                    SiteRight_1: 145,
                    SiteBars: { 
                        SiteBarCenter_1: 150,    
                        SiteBarLeft_1: 150,
                        SiteBarRight_1: 150
                    },
                    SubSiteTopLeft: 151,
                    SubSiteTopRight: 151,
                    SubSiteLeft: 151,
                    SubSiteRight: 151,
                    SubSiteBotLeft: 151,
                    SubSiteBotRight: 151
                },
                AirLights: {
                    AirLightLeft_1: 100,
                    AirLightMid_1: 100,
                    AirLightTop_1: 100,
                    AirLightCN_4: 100,
                    AirLightCN_5: 100
                },
                SignalLights: {
                    SignalLightTopRight_1: 120,
                    SignalLightBotRight_1: 120,
                    SignalLightBotLeft_1: 120,
                    SignalLightTopLeft_1: 120
                },
                Tombstones: {
                    TombstoneTopRight_1: 113,
                    TombstoneTopLeft_1: 113,
                    TombstoneBotRight_1: 115,
                    TombstoneBotLeft_1: 115,
                    TombstonePicTopRight_1: 112,
                    TombstonePicTopLeft_1: 112,
                    TombstonePicBotRight_1: 114,
                    TombstonePicBotLeft_1: 114,
                    HungerBotLeft_1: 118,
                    HungerTopLeft_1: 118,
                    HungerTopRight_1: 118,
                    HungerBotRight_1: 118
                    // ShroudTopLeft_1: 107
                },
                HorizonBGs: {
                    Horizon_1: 1
                },
                WeatherOverlays: {
                    WeatherFrost_1: 139,
                    WeatherFog_1: 125,
                    WeatherMain_1: 124, 
                    WeatherLightning_1: 110,
                    WeatherLightning_2: 110,
                    WeatherLightning_3: 110,
                    WeatherGround_1: 119,
                    WeatherClouds_1: 105
                },
                OtherOverlays: {
                    Spotlight_1: 117 
                },
                Banners: {
                    downtimeBanner_1: 106
                },
                DiceRoller: {
                    Frame: {
                        rollerImage_frontFrame_1: 151,
                        TopMids: {
                            rollerImage_topMid_1: 152,
                            rollerImage_topMid_2: 153,
                            rollerImage_topMid_3: 154,
                            rollerImage_topMid_4: 155,
                            rollerImage_topMid_5: 156,
                            rollerImage_topMid_6: 157,
                            rollerImage_topMid_7: 158,
                            rollerImage_topMid_8: 159,
                            rollerImage_topMid_9: 160
                        },
                        BottomMods: {                  
                            rollerImage_bottomMid_1: 152,
                            rollerImage_bottomMid_2: 153,
                            rollerImage_bottomMid_3: 154,
                            rollerImage_bottomMid_4: 155,
                            rollerImage_bottomMid_5: 156,
                            rollerImage_bottomMid_6: 157,
                            rollerImage_bottomMid_7: 158,
                            rollerImage_bottomMid_8: 159,
                            rollerImage_bottomMid_9: 160
                        },
                        rollerImage_topEnd_1: 160,
                        rollerImage_bottomEnd_1: 161,
                        rollerImage_diffFrame_1: 165
                    },
                    RerollTrigger: {
                        wpRerollPlaceholder_1: 0
                    },
                    DiceList: {                        
                        rollerDie_diceList_1: 199,
                        rollerDie_diceList_2: 198,
                        rollerDie_diceList_3: 197,
                        rollerDie_diceList_4: 196,
                        rollerDie_diceList_5: 195,
                        rollerDie_diceList_6: 194,
                        rollerDie_diceList_7: 193,
                        rollerDie_diceList_8: 192,
                        rollerDie_diceList_9: 191,
                        rollerDie_diceList_10: 190,
                        rollerDie_diceList_11: 189,
                        rollerDie_diceList_12: 188,
                        rollerDie_diceList_13: 187,
                        rollerDie_diceList_14: 186,
                        rollerDie_diceList_15: 185,
                        rollerDie_diceList_16: 184,
                        rollerDie_diceList_17: 183,
                        rollerDie_diceList_18: 182,
                        rollerDie_diceList_19: 181,
                        rollerDie_diceList_20: 180,
                        rollerDie_diceList_21: 179,
                        rollerDie_diceList_22: 178,
                        rollerDie_diceList_23: 177,
                        rollerDie_diceList_24: 176,
                        rollerDie_diceList_25: 175,
                        rollerDie_diceList_26: 174,
                        rollerDie_diceList_27: 173,
                        rollerDie_diceList_28: 172,
                        rollerDie_diceList_29: 171,
                        rollerDie_diceList_30: 170
                    },
                    BigDice: {
                        rollerDie_bigDice_1: 199,
                        rollerDie_bigDice_2: 198
                    }
                },
                Headers: {
                    stakedAdvantagesHeader_1: 140,
                    weeklyResourcesHeader_1: 140
                },
                Map: {
                    TorontoMap_1: 401,
                    TorontoMapDomainOverlay_1: 405,
                    TorontoMapAutarkisOverlay_1: 405,
                    TorontoMapRackOverlay_1: 404,
                    TorontoMapRoadsOverlay_1: 406,
                    TorontoMapDistrictsOverlay_1: 407,
                    TorontoMapParksOverlay_1: 404,
                    TorontoMapSitesCultureOverlay_1: 408,
                    TorontoMapSitesNightlifeOverlay_1: 408,
                    TorontoMapSitesLandmarksOverlay_1: 408,
                    TorontoMapSitesTransportationOverlay_1: 408,
                    TorontoMapSitesShoppingOverlay_1: 408,
                    TorontoMapSitesEducationOverlay_1: 408,
                    TorontoMapSitesHealthOverlay_1: 408,
                    TorontoMapSitesHavensOverlay_1: 408
                }
            },
            objects: {
                PlayerTokens: {
                    "Dr.ArthurRoyToken_1": 200,
                    JohannesNapierToken_1: 200,
                    AvaWongToken_1: 200,
                    LockeUlrichToken_1: 200
                },
                Complications: {
                    Base: {
                        ComplicationMat_1: 500
                    },
                    CardSlots: {
                        compCardSpot_1: 505,
                        compCardSpot_2: 505,
                        compCardSpot_3: 505,
                        compCardSpot_4: 505,
                        compCardSpot_5: 505,
                        compCardSpot_6: 505,
                        compCardSpot_7: 505,
                        compCardSpot_8: 505,
                        compCardSpot_9: 505,
                        compCardSpot_10: 505
                    },
                    ZeroedOverlays: {
                        complicationZero_1: 510,
                        complicationZero_2: 510,
                        complicationZero_3: 510,
                        complicationZero_4: 510,
                        complicationZero_5: 510,
                        complicationZero_6: 510,
                        complicationZero_7: 510,
                        complicationZero_8: 510,
                        complicationZero_9: 510,
                        complicationZero_10: 510
                    },
                    EnhancedOverlays: {
                        complicationEnhanced_1: 515,
                        complicationEnhanced_2: 515,
                        complicationEnhanced_3: 515,
                        complicationEnhanced_4: 515,
                        complicationEnhanced_5: 515,
                        complicationEnhanced_6: 515,
                        complicationEnhanced_7: 515,
                        complicationEnhanced_8: 515,
                        complicationEnhanced_9: 515,
                        complicationEnhanced_10: 515
                    }
                }
            },
            dragpads: 700
        },
        DEFAULTTOKENDATA = {
            activeLayer: "objects",
            zIndex: 200,
            modes: {
                Active: {isForcedOn: true, isForcedState: null},
                Inactive: {isForcedOn: false, isForcedState: null},
                Daylighter: {isForcedOn: true, isForcedState: null},
                Downtime: {isForcedOn: false, isForcedState: null},
                Complications: {isForcedOn: null, isForcedState: null},
                Spotlight: {isForcedOn: false, isForcedState: null}
            },
            curSrc: "base",
            isActive: true,
            activeSrc: "base"
        },
    // #endregion

    // #region GENERAL MEDIA OBJECT GETTERS:
        isRegistered = mediaRef => isRegText(mediaRef) || isRegImg(mediaRef),
        getMediaObj = mediaRef => {
            if (isRegText(mediaRef))
                return getTextObj(mediaRef)
            return getImgObj(mediaRef)
        },
        getKey = (mediaRef, isSilent = false) => {
            if (isRegText(mediaRef))
                return getTextKey(mediaRef, isSilent)
            return getImgKey(mediaRef, isSilent)
        },
        getData = mediaRef => {
            if (isRegText(mediaRef))
                return getTextData(mediaRef)
            return getImgData(mediaRef)
        },
        getModeData = (mediaRef, mode) => {
            const mediaData = getData(mediaRef)
            if (VAL({list: [mediaData, mediaData.modes]}, "getModeData", true))
                return mediaData.modes[mode]
            return THROW(`Invalid Media Reference: ${D.JS(mediaRef)}`, "getModeData")         
        },
        hasForcedState = (mediaRef) => {
            const mediaData = getModeData(mediaRef, Session.Mode)
            if (VAL({list: mediaData}, "hasForcedState"))
                return VAL({string: mediaData.isForcedState})
            return THROW(`Invalid Media Reference: ${D.JS(mediaRef)}`, "hasForcedState")                  
        },
        getModeStatus = mediaRef => {
            const modeStatus = {}
            if (isRegistered(mediaRef)) {
                const mediaData = getData(mediaRef),
                    mediaModes = mediaData.modes[Session.Mode]
                if (VAL({list: mediaModes}, "getModeStatus")) {
                    if (mediaModes.isForcedOn === "LAST")
                        modeStatus.isActive = mediaModes.lastActive
                    else if (mediaModes.isForcedOn === true || mediaModes.isForcedOn === false)
                        modeStatus.isActive = mediaModes.isForcedOn
                    else
                        modeStatus.isActive = mediaData.isActive
                    if (mediaModes.isForcedState === true)
                        modeStatus.state = mediaModes.lastState
                    else if (mediaModes.isForcedState === null)
                        modeStatus.state = undefined
                    else
                        modeStatus.state = mediaModes.isForcedState
                    return modeStatus
                }
            }
            return THROW(`Invalid Media Reference: ${D.JS(mediaRef)}`, "getModeStatus")      
        },
        getActiveLayer = mediaRef => {
            const mediaData = getData(mediaRef)
            if (VAL({list: mediaData}, "getActiveLayer"))
                return mediaData.activeLayer
            return THROW(`Invalid Media Reference: ${D.JS(mediaRef)}`, "getActiveLayer")
        },
        // #endregion

    // #region GENERAL MEDIA OBJECT SETTERS: 
        setLayer = (mediaRef, layer, isForcing = false) => {
            const mediaData = getData(mediaRef)
            if (VAL({list: mediaData}, "setLayer")) {
                const mediaObj = getMediaObj(mediaRef)
                layer = layer || getActiveLayer(mediaData.name)
                if (!isForcing && mediaData.layer === layer)
                    return null
                mediaObj.set("layer", layer)
                return true
            }
            return false
        },
        toggle = (mediaRef, isActive, isForcing = false) => {
            if (isActive !== true && isActive !== false)
                return null
            if (isRegText(mediaRef))
                return toggleText(mediaRef, isActive, isForcing)
            return toggleImg(mediaRef, isActive, isForcing)
        },
        modeUpdate = (mediaRef) => {
            if (isRegText(mediaRef)) {
                const textData = getTextData(mediaRef),
                    textKey = textData.name,
                    modeStatus = getModeStatus(textKey)
                // DB(`Updating '${D.JS(mediaRef)}'. ModeStatus: ${D.JS(modeStatus)}`, "modeUpdate")
                if(VAL({list: modeStatus}, "modeUpdate")) {
                    const lastMode = textData.curMode
                    if (lastMode) {
                        TEXTREGISTRY[textKey].modes[lastMode].lastActive = textData.isActive
                        TEXTREGISTRY[textKey].modes[lastMode].lastState = textData.isActive && (_.isString(textData.activeText) && textData.activeText || textData.curText) || TEXTREGISTRY[textKey].modes[lastMode].lastState
                    }
                    TEXTREGISTRY[textKey].curMode = Session.Mode
                    if (!_.isUndefined(modeStatus.isActive)) 
                        // DB(`... IsActive OK! toggleText(${D.JS(textKey)}, ${D.JS(modeStatus.isActive)})`, "modeUpdate")
                        toggleText(textKey, modeStatus.isActive)
                    
                    if (!_.isUndefined(modeStatus.state)) 
                        // DB(`... State OK! setText(${D.JS(textKey)}, ${D.JS(modeStatus.state)})`, "modeUpdate")
                        setText(textKey, modeStatus.state)
                    
                }
            } else {
                const imgData = getImgData(mediaRef),
                    imgKey = imgData.name,
                    modeStatus = getModeStatus(imgKey)
                // DB(`Updating '${D.JS(mediaRef)}'. ModeStatus: ${D.JS(modeStatus)}`, "modeUpdate")
                if(VAL({list: modeStatus}, "modeUpdate")) {
                    const lastMode = imgData.curMode
                    if (lastMode) {
                        IMGREGISTRY[imgKey].modes[lastMode].lastActive = imgData.isActive
                        IMGREGISTRY[imgKey].modes[lastMode].lastState = imgData.isActive && imgData.activeSrc || IMGREGISTRY[imgKey].modes[lastMode].lastState
                    }
                    IMGREGISTRY[imgKey].curMode = Session.Mode
                    if (!_.isUndefined(modeStatus.isActive)) 
                        // DB(`... IsActive OK! toggleImg(${D.JS(mediaKey)}, ${D.JS(modeStatus.isActive)})`, "modeUpdate")
                        toggleImg(imgKey, modeStatus.isActive)
                    
                    if (!_.isUndefined(modeStatus.state)) 
                        // DB(`... State OK! setImg(${D.JS(mediaKey)}, ${D.JS(modeStatus.state)})`, "modeUpdate")
                        setImg(imgKey, modeStatus.state)
                    
                }
            }
        },
        setActiveLayers = (isOverridingStartActive = true) => {
            // NEEDS TO HANDLE MODES IN HERE
            const returnStrings = []
            for (const imgData of _.values(IMGREGISTRY)) {
                const imgObj = getImgObj(imgData.id)
                if (imgObj) {
                    const targetLayer = isOverridingStartActive || imgData.startActive ? imgData.activeLayer : "walls"
                    if (targetLayer !== imgObj.get("layer"))
                        imgObj.set("layer", targetLayer)
                } else if (!imgData.name.includes("Token")) {
                    returnStrings.push(`No image Object Found for '${imgData.name}'`)
                }
            }
            for (const textData of _.values(TEXTREGISTRY)) {
                const textObj = getTextObj(textData.id)
                if (textObj) {
                    const targetLayer = isOverridingStartActive || textData.startActive ? textData.activeLayer : "walls"
                    if (targetLayer !== textObj.get("layer"))
                        textObj.set("layer", targetLayer)
                } else {
                    returnStrings.push(`No Text Object Found for '${textData.name}'`)
                }
            }
            if (returnStrings.length)
                D.Alert(returnStrings.join("<br>"), "Media: SetActiveLayers")
        },
        setZIndices = () => {
            const allImgDatas = [],
                sortedMediaObjs = []
            for (const category of ["map", "objects"]) {
                const imgDatas = _.compact(getZLevels()[category].map(x => {
                    if (IMGREGISTRY[x[1]]) 
                        [,,IMGREGISTRY[x[1]].zIndex] = x
                    else if (ANIMREGISTRY[x[1]])
                        [,,ANIMREGISTRY[x[1]].zIndex] = x
                    else
                        return false // THROW(`No image Registered for ZIndex Entry '${x[1]}'`, "setZIndices")
                    return IMGREGISTRY[x[1]] || ANIMREGISTRY[x[1]]
                }))
                allImgDatas.push(..._.compact(imgDatas))
            }
            sortedMediaObjs.push(..._.compact(_.keys(TEXTREGISTRY).map(x => getTextObj(x) || null)))
            sortedMediaObjs.push(..._.compact(_.keys(TEXTREGISTRY).filter(x => TEXTREGISTRY[x].shadowID).map(x => getObj("text", TEXTREGISTRY[x].shadowID) || null)))
            sortedMediaObjs.push(..._.compact(_.flatten(allImgDatas.filter(x => x.padID).sort((a,b) => b.zIndex - a.zIndex).map(x => [getObj("graphic", x.padID), getObj("graphic", x.partnerID)]))))
            sortedMediaObjs.push(..._.compact(allImgDatas.sort((a,b) => b.zIndex - a.zIndex).map(x => getImgObj(x.id) || null)))
            for (let i = 0; i < sortedMediaObjs.length; i++)
                toBack(sortedMediaObjs[i])
        },
        switchMode = () => {
            for (const mediaKey of [..._.keys(IMGREGISTRY), ..._.keys(TEXTREGISTRY)])
                modeUpdate(mediaKey)
        },
    // #endregion
    
    // #region IMG OBJECT & AREA GETTERS: Img Object & Data Retrieval
        isRegImg = imgRef => Boolean(getImgKey(imgRef, true)),
        isRandomizerToken = tokenObj => {
            const tokenBaseSrc = tokenObj && tokenObj.get && tokenObj.get("imgsrc"),
                tokenMatch = tokenBaseSrc && tokenBaseSrc.match(/.*?\/images\/(.*?)\/[^/]*?\.png\?(.*)/u),
                tokenBase = tokenMatch && tokenMatch.slice(1).join("/")
            if (tokenBase && TOKENREGISTRY[tokenBase] && isRegImg(TOKENREGISTRY[tokenBase].name))
                return tokenBase
            return false
        },
        getImgKey = (imgRef, isSilent = false) => {
            try {
                let imgKey, imgObj
                if (VAL({char: imgRef}))
                    return imgRef
                if (VAL({string: imgRef})) {
                    if (GRAPHICREGISTRY[imgRef])
                        return imgRef
                    if (GRAPHICREGISTRY[`${imgRef}_1`])
                        return `${imgRef}_1`
                    imgObj = getObj("graphic", imgRef)                    
                } else if (VAL({imgObj: imgRef})) {
                    imgObj = imgRef
                } else if (VAL({selection: imgRef})) {
                    [imgObj] = D.GetSelected(imgRef)
                }
                if (VAL({imgObj})) {
                    imgKey = getImgKey(imgObj.get("name"), true)
                    if (GRAPHICREGISTRY[imgKey])
                        return imgKey
                    imgKey = getImgKey(imgObj.get("name"), true)
                    if (GRAPHICREGISTRY[imgKey])
                        return imgKey
                    imgKey = getImgKey((_.find(_.values(Char.REGISTRY), x => x.id === imgObj.get("represents")) || {tokenName: false}).tokenName, true)
                    if (GRAPHICREGISTRY[imgKey])
                        return imgKey
                    imgKey = getImgKey(`${getObj("character", imgObj.get("represents")).get("name").replace(/\s+/gu, "")}Token`, true)
                    if (GRAPHICREGISTRY[imgKey])
                        return imgKey
                }
                return !isSilent && THROW(`Cannot find name of image from reference '${D.JSL(imgRef)}'`, "GetImgKey")
            } catch (errObj) {
                return !isSilent && THROW(`Cannot locate image with search value '${D.JSL(imgRef)}'`, "GetImgKey", errObj)
            }
        },
        getImgObj = (imgRef, isSilent = false) => {
            // D.Alert("GETTING IMG OBJECT")
            try {
                let imgObj
                if (VAL({char: imgRef}))
                    return (findObjs({_pageid: D.PAGEID, _type: "graphic", _subtype: "token", represents: D.GetChar(imgRef).id}) || [false])[0]
                if (VAL({imgObj: imgRef}))
                    return imgRef
                if (VAL({string: imgRef})) {
                    imgObj = getObj("graphic", imgRef)
                    if (VAL({imgObj}))
                        return imgObj
                }
                if (VAL({selection: imgRef})) {
                    [imgObj] = D.GetSelected(imgRef)
                    if (VAL({imgObj}))
                        return imgObj
                }
                const imgKey = getImgKey(imgRef)
                if (VAL({string: imgKey}))
                    imgObj = getObj("graphic", GRAPHICREGISTRY[imgKey].id)
                if (VAL({imgObj}))
                    return imgObj
                return false
            } catch (errObj) {
                return !isSilent && THROW(`IMGREF: ${D.JS(imgRef)}`, "getImgObj", errObj)
            }
        },
        getImgObjs = (imgRefs, isSilent = false) => {
            // D.Alert(`GetSelected ImgRefs: ${D.JS(D.GetSelected(imgRefs))}`)
            imgRefs = VAL({selection: imgRefs}) ? D.GetSelected(imgRefs) : imgRefs || _.keys(GRAPHICREGISTRY)
            const imgObjs = []
            if (VAL({array: imgRefs}))
                for (const imgRef of imgRefs)
                    imgObjs.push(getImgObj(imgRef, isSilent))
            return _.compact(imgObjs)
        },
        getImgData = (imgRef, isSilent = false) => {
            const imgData = (() => {
                let imgKey, imgObj
                try {
                    imgKey = getImgKey(imgRef, isSilent)
                    if (VAL({string: imgKey}) || VAL({imgObj: imgKey}) && GRAPHICREGISTRY[imgKey.get("name")])
                        return GRAPHICREGISTRY[imgKey] || GRAPHICREGISTRY[imgKey.get("name")]
                    imgObj = getImgObj(imgRef, isSilent)
                    if (VAL({imgObj}, "getImgData")) {
                        if (GRAPHICREGISTRY[imgObj.get("name")])
                            return GRAPHICREGISTRY[imgObj.get("name")]
                        if (VAL({char: imgKey}) && !GRAPHICREGISTRY[imgObj.get("name")])
                            return Object.assign({}, DEFAULTTOKENDATA, {
                                id: imgObj.id,
                                name: imgObj.get("name"),
                                left: imgObj.get("left"),
                                top: imgObj.get("top"),
                                height: imgObj.get("height"),
                                width: imgObj.get("width"),
                                srcs: {
                                    base: imgObj.get("imgsrc").replace(/(max\.png|med\.png)/gu, "thumb.png")
                                },
                                leftEdge: imgObj.get("left") - 0.5 * imgObj.get("width"),
                                rightEdge: imgObj.get("left") + 0.5 * imgObj.get("width"),
                                topEdge: imgObj.get("top") - 0.5 * imgObj.get("height"),
                                bottomEdge: imgObj.get("top") + 0.5 * imgObj.get("height"),
                                curMode: Session.Mode
                            })
                        return {
                            isUnregistered: true,
                            id: imgObj.id,
                            name: imgObj.get("name"),
                            left: D.Int(imgObj.get("left")),
                            top: D.Int(imgObj.get("top")),
                            height: D.Int(imgObj.get("height")),
                            width: D.Int(imgObj.get("width")),
                            activeLayer: imgObj.get("layer"),
                            srcs: {
                                base: imgObj.get("imgsrc").replace(/(max\.png|med\.png)/gu, "thumb.png")
                            },
                            leftEdge: imgObj.get("left") - 0.5 * imgObj.get("width"),
                            rightEdge: imgObj.get("left") + 0.5 * imgObj.get("width"),
                            topEdge: imgObj.get("top") - 0.5 * imgObj.get("height"),
                            bottomEdge: imgObj.get("top") + 0.5 * imgObj.get("height"),
                            curMode: Session.Mode
                        }
                    }
                    return false
                } catch (errObj) {
                    return !isSilent && THROW(`Cannot locate image with search value '${D.JS(imgRef)}'`, "getImgData", errObj)
                }
            })()
            if (VAL({list: imgData}, isSilent ? "getImgData" : undefined)) {
                imgData.leftEdge = imgData.left - 0.5*imgData.width
                imgData.rightEdge = imgData.left + 0.5*imgData.width
                imgData.topEdge = imgData.top - 0.5*imgData.height
                imgData.bottomEdge = imgData.top + 0.5*imgData.height
            }
            return imgData
        },
        getImgSrcs = (imgRef) => {
            const srcData = Object.assign(C.IMAGES, STATEREF.TokenSrcs)
            let imgData = getImgData(imgRef)
            if (imgData.srcs === "TOKEN")
                return srcData
            while (isRegImg(imgData.srcs))
                imgData = getImgData(imgData.srcs)
            return Object.assign(srcData, imgData.srcs)
        },
        getURLFromSrc = (srcRef, srcData) => Object.assign(Object.assign(C.IMAGES, STATEREF.TokenSrcs), srcData)[srcRef] || srcRef.includes("http") && srcRef,
        getSrcFromURL = (URLRef, srcData) => _.findKey(Object.assign(Object.assign(C.IMAGES, STATEREF.TokenSrcs), srcData), v => v.toLowerCase() === URLRef.toLowerCase()) || false,
        getTokenObj = (charRef, isSilent = false) => {
            const charObj = D.GetChar(charRef, isSilent)
            if (charObj)
                return (findObjs({_pageid: D.PAGEID, _type: "graphic", _subtype: "token", represents: charObj.id}) || [false])[0]
            return !isSilent && THROW(`No character found for reference ${charRef}`, "getTokenObj")
        },
        getAreaData = areaRef => AREAREGISTRY[areaRef],
        /* getImgDatas = imgRefs => {
			const imgRefs = D.GetSelected(imgRefs) || imgRefs,
				 imgDatas = []
			for (const imgRef of imgRefs) {
				imgDatas.push(getImgData(imgRef))
			}
			return imgDatas
		},	*/
        getBounds = (locRef) => {
            const boundaryData = {}
            if (VAL({string: locRef}) && AREAREGISTRY[locRef]) {
                boundaryData.top = AREAREGISTRY[locRef].top
                boundaryData.left = AREAREGISTRY[locRef].left
                boundaryData.height = AREAREGISTRY[locRef].height
                boundaryData.width = AREAREGISTRY[locRef].width
                // D.Alert(`BoundaryData:<br>${D.JS(boundaryData, true)}`, "getBounds")
            } else if (VAL({graphic: locRef})) {
                const imgObj = getImgObj(locRef)
                boundaryData.top = imgObj.get("top")
                boundaryData.left = imgObj.get("left")
                boundaryData.height = imgObj.get("height")
                boundaryData.width = imgObj.get("width")
            }
            if (VAL({list: boundaryData}, "getBounds"))
                return {
                    top: boundaryData.top - 0.5 * boundaryData.height,
                    bottom: boundaryData.top + 0.5 * boundaryData.height,
                    left: boundaryData.left - 0.5 * boundaryData.width,
                    right: boundaryData.left + 0.5 * boundaryData.width,
                    height: boundaryData.height,
                    width: boundaryData.width
                }
            return false
        },
        checkBounds = (locRef, imgRef, padding = 0) => {
            const locBounds = getBounds(locRef),
                imgBounds = getBounds(imgRef)
            return locBounds.top <= imgBounds.top + padding &&
                locBounds.bottom >= imgBounds.bottom - padding &&
                locBounds.left <= imgBounds.left + padding &&
                locBounds.right >= imgBounds.right - padding
        },
        getImgSrc = imgRef => (getImgData(imgRef) || {curSrc: false}).curSrc,
        /* getImgSrcs = imgRef => getImgData(imgRef) ? getImgData(imgRef).srcs : false, */
        isObjActive = mediaRef => (getData(mediaRef) || {isActive: null}).isActive,
        /* eslint-disable-next-line no-unused-vars */
        getContainedImgObjs = (locRef, options = {}) => {
            const findFilter = {
                _pageid: D.PAGEID,
                _type: "graphic"
            }
            for (const key of _.intersection(_.keys(options), ["subtype", "_subtype", "layer", "name"]))
                findFilter[key.replace(/^sub/gu, "_sub")] = options[key]            
            const contImgObjs = findObjs(findFilter).filter(v => {
                for (const key of _.intersection(_.keys(options), ["imgsrc", "represents", "left", "top", "width", "height", "controlledby"])) {
                    if (_.isEmpty(v.get(key)) || isRegImg(v) && !isObjActive(v))
                        return false
                    if (options[key] !== true && !v.get(key).toLowerCase().includes(options[key].toLowerCase()))
                        return false                    
                }
                if (checkBounds(locRef, v, options.padding || 0))
                    return true
                return false
            })
            // D.Alert(`Checking ${D.JS(locRef)}, Returning ${D.JS(_.compact(contImgObjs.map(v => D.GetChar(v))))} (${_.compact(contImgObjs.map(v => D.GetChar(v))).length} chars)`)
            if (options.isCharsOnly)
                return _.compact(contImgObjs.map(v => D.GetChar(v)))
            return contImgObjs
        },
        getZLevels = () => {
            const imgZLevels = {
                    map: [],
                    objects: []
                },
                getArray = (obj, topKey) => {
                    const returnArray = []
                    for (const key of _.keys(obj))
                        if (_.isNumber(obj[key]))
                            returnArray.push([topKey, key, obj[key]])
                        else
                            returnArray.push(...getArray(obj[key], topKey))
                    return returnArray
                }
            for (const cat of ["map", "objects"])
                for (const key of _.keys(ZLEVELS[cat]))
                    imgZLevels[cat].push(...getArray(ZLEVELS[cat][key], key))
            return imgZLevels
        },
        getZLevel = imgRef => {
            const imgKey = getImgKey(imgRef, true) || imgRef
            if (VAL({string: imgKey}, "getZLevel")) {
                const dredgeList = (list) => {
                    const results = []
                    for (const val of Object.entries(list))
                        if (VAL({list: val[1]}))
                            results.push(...dredgeList(val[1]))
                        else
                            results.push(val)
                    return results
                }
                return (dredgeList(ZLEVELS).filter(x => x[0] === imgKey)[0] || [null,ZLEVELS.defaultZLevel])[1]
            }
            return ZLEVELS.defaultZLevel
        },
    // #endregion

    // #region IMG OBJECT & AREA SETTERS: Registering & Manipulating Img Objects
        addImgSrc = (imgSrcRef, imgName, srcName) => {
            try {
                const imgSrc = (_.isString(imgSrcRef) && imgSrcRef.includes("http") ?
                    imgSrcRef :
                    getImgObj(imgSrcRef).get("imgsrc") || "").replace(/\w*?(?=\.\w+?\?)/u, "thumb")
                if (imgSrc !== "" && isRegImg(imgName)) {
                    IMGREGISTRY[getImgKey(imgName)].srcs[srcName] = imgSrc
                    D.Alert(`Img '${D.JS(srcName)}' added to category '${D.JS(imgName)}'.<br><br>Source: ${D.JS(imgSrc)}`)
                }
            } catch (errObj) {
                THROW("", "addImgSrc", errObj)
            }
        },
        addTokenSrc = (tokenSrcRef, tokenName) => {
            try {
                const tokenSrc = (_.isString(tokenSrcRef) && tokenSrcRef.includes("http") ?
                        tokenSrcRef :
                        getImgObj(tokenSrcRef).get("imgsrc") || "").replace(/\w*?(?=\.\w+?\?)/u, "thumb"),
                    tokenBase = isRandomizerToken(getImgObj(tokenName))
                if (tokenBase)
                    TOKENREGISTRY[tokenBase].srcs.push(tokenSrc)
                else
                    D.Alert(`Token base '${D.JS(tokenBase)} is not registered in the token registry.`, "addTokenSrc")
            } catch (errObj) {
                THROW("", "addImgSrc", errObj)
            }
        },
        regImg = (imgRef, imgName, srcName, activeLayer, options = {}, isSilent = false) => {
            // D.Alert(`Options for '${D.JS(imgName)}': ${D.JS(options)}`, "MEDIA: regImg")
            if (!(imgRef && imgName && srcName && activeLayer))
                return THROW("Must supply all parameters for regImg.", "RegImg")
            const imgObj = getImgObj(imgRef)
            if (VAL({graphicObj: imgObj}, "regImg")) {                
                const baseName = imgName.replace(/(_|\d|#)+$/gu, ""),
                    name = `${baseName}_${_.filter(_.keys(IMGREGISTRY), k => k.includes(baseName)).length + 1}`,
                    params = {
                        left: options.left || imgObj.get("left") || IMGREGISTRY[name].left || C.IMAGES[baseName.toLowerCase()] && C.IMAGES[baseName.toLowerCase()].left,
                        top: options.top || imgObj.get("top") || IMGREGISTRY[name].top || C.IMAGES[baseName.toLowerCase()] && C.IMAGES[baseName.toLowerCase()].top,
                        height: options.height || imgObj.get("height") || IMGREGISTRY[name].height || C.IMAGES[baseName.toLowerCase()] && C.IMAGES[baseName.toLowerCase()].height,
                        width: options.width || imgObj.get("width") || IMGREGISTRY[name].width || C.IMAGES[baseName.toLowerCase()] && C.IMAGES[baseName.toLowerCase()].width
                    }
                if (!params.left || !params.top || !params.height || !params.width)
                    return THROW("Must supply position & dimension to register image.", "RegImg")
                imgObj.set({name, showname: false})
                IMGREGISTRY[name] = {
                    id: imgObj.id,
                    type: imgObj.get("_type") === "text" && "text" || "image",
                    name,
                    left: params.left,
                    top: params.top,
                    height: params.height,
                    width: params.width,
                    activeLayer,
                    zIndex: options.zIndex || (IMGREGISTRY[name] ? IMGREGISTRY[name].zIndex : 200),
                    srcs: {},
                    modes: C.MODEDEFAULTS(imgObj, params.modes)
                }
                IMGREGISTRY[name].modes = C.MODEDEFAULTS(imgObj, params.modes)
                DB(`Modes for ${name}: ${D.JS(IMGREGISTRY[name].modes)}`, "regImg")
                if (srcName !== "none") {
                    addImgSrc(imgObj.get("imgsrc").replace(/med/gu, "thumb"), name, srcName)
                    setImg(name, srcName)
                }
                layerImgs([name], IMGREGISTRY[name].activeLayer)
                if (!isSilent)
                    D.Alert(`Host obj for '${D.JS(name)}' registered: ${D.JS(IMGREGISTRY[name])}`, "MEDIA: regImg")
                return getImgData(name)
            }
            return THROW(`Invalid image reference '${D.JSL(imgRef)}'`, "regImg")
        },
        regRandomizerToken = (imgRef, tokenName) => {
            if (!isRegImg(tokenName))
                regImg(imgRef, tokenName, "base", "objects", true)            
            const tokenBaseSrc = getImgData(tokenName).srcs.base,
                tokenKey = getImgKey(tokenName)
            if (tokenBaseSrc) {
                const tokenBase = tokenBaseSrc.match(/.*?\/images\/(.*?)\/[^/]*?\.png\?(.*)/u).slice(1).join("/")
                D.Alert(`Token Base Src: '${tokenBaseSrc}'<br>Token Base: '${tokenBase}'`, "regRandomizerToken")
                TOKENREGISTRY[tokenBase] = {
                    name: tokenKey,
                    srcs: [tokenBaseSrc]
                }
                IMGREGISTRY[tokenKey].tokenSrcCount = 0
            } else {
                D.Alert(`No 'base' source found for ${tokenName}`, "regRandomizerToken")
            }
        },
        regArea = (imgRef, areaName) => {
            const imgObj = getImgObj(imgRef)
            if (VAL({graphicObj: imgObj}, "regArea")) {
                AREAREGISTRY[areaName] = {
                    top: D.Int(imgObj.get("top")),
                    left: D.Int(imgObj.get("left")),
                    height: D.Int(imgObj.get("height")),
                    width: D.Int(imgObj.get("width"))
                }
                D.Alert(`Area Registered: ${areaName}<br><br><pre>${D.JS(AREAREGISTRY[areaName])}</pre>`, "Media: Register Area")
            }
        },
        makeImg = (imgName = "", params = {}, isSilent = false) => {
            const dataRef = C.IMAGES.defaults,
                imgObj = createObj("graphic", {
                    _pageid: params._pageID || D.PAGEID,
                    imgsrc: params.imgsrc || C.IMAGES.blank,
                    left: params.left || dataRef.left,
                    top: params.top || dataRef.top,
                    width: params.width || dataRef.width,
                    height: params.height || dataRef.height,
                    layer: params.layer || params.activeLayer || "gmlayer",
                    isdrawing: params.isDrawing !== false,
                    controlledby: params.controlledby || "",
                    showname: params.showname === true
                }),
                options = _.omit(params, "activeLayer")
            regImg(imgObj, imgName, params.imgsrc && params.imgsrc !== C.IMAGES.blank ? "base" : "blank", params.activeLayer || params.layer || "gmlayer", options, isSilent)
            return imgObj
        },
        setImg = (imgRef, srcRef, isToggling, isForcing = false) => {
            // D.Alert(`Getting ${D.JS(srcRef)} for ${D.JS(imgRef)} --> ${D.JS(REGISTRY[getImgData(imgRef).name].srcs[srcRef])}`, "MEDIA:SetImg")
            if (isToggling === true || isToggling === false)
                toggleImg(imgRef, isToggling, isForcing)
            if (srcRef === null)
                return null
            const imgData = getImgData(imgRef)
            if (VAL({list: imgData, string: srcRef}, "setImg")) {                
                if(!isForcing && imgData.curSrc === srcRef)
                    return null
                const srcData = getImgSrcs(imgData.name),
                    srcURL = getURLFromSrc(srcRef, srcData)
                if (VAL({string: srcURL}, "setImg")) { 
                    const imgObj = getImgObj(imgData.name)
                    if (VAL({imgObj}, ["setImg", `Key: ${D.JS(imgData.name)}`])) {
                        if (isObjActive(imgData.name))
                            IMGREGISTRY[imgData.name].activeSrc = srcRef
                        IMGREGISTRY[imgData.name].curSrc = srcRef
                        imgObj.set("imgsrc", srcURL)                  
                    }
                    return imgObj
                }
            }
            return false
        },
        setRandomizerToken = tokenObj => {
            const tokenBase = isRandomizerToken(tokenObj),
                tokenKey = tokenBase && TOKENREGISTRY[tokenBase].name
            if (tokenBase && tokenKey) {
                IMGREGISTRY[tokenKey].tokenSrcCount = _.isNumber(IMGREGISTRY[tokenKey].tokenSrcCount) && IMGREGISTRY[tokenKey].tokenSrcCount < TOKENREGISTRY[tokenBase].srcs.length - 1 ? IMGREGISTRY[tokenKey].tokenSrcCount + 1 : 0
                tokenObj.set("imgsrc", TOKENREGISTRY[tokenBase].srcs[IMGREGISTRY[tokenKey].tokenSrcCount])
            }
        },
        setImgTemp = (imgRef, params) => {
            const imgObj = getImgObj(imgRef)
            if (VAL({imgObj}, "setImgTemp")) {
                imgObj.set(params)
                return imgObj
            }
            return false
        },
        setImgData = (imgRef, params, isSettingObject = false) => {
            const imgKey = getImgKey(imgRef)
            if (VAL({string: imgKey}, "setImgData")) {
                _.each(params, (v, k) => {
                    IMGREGISTRY[imgKey][k] = v
                })
                if (isSettingObject)
                    setImgTemp(imgKey, params)
                return IMGREGISTRY[imgKey]
            }
            return false
        },
        sortImgs = (imgRefs, modes = "", anchors = []) => {
            const imgObjs = getImgObjs(imgRefs),
                sortModes = _.flatten([modes]),
                imgData = _.map(imgObjs, obj => {
                    const params = {
                        id: obj.id,
                        obj,
                        height: D.Int(obj.get("height")),
                        width: D.Int(obj.get("width")),
                        top: D.Int(obj.get("top")),
                        left: D.Int(obj.get("left"))
                    }
                    return Object.assign(params, getBounds(obj, params))
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
            for (let i = 0; i < sortModes.length; i++) {
                anchorRef = anchors[i] || anchorRef
                let [spacer, counter] = [0, 0],
                    [sorted, revSorted] = [[], []]
                switch (sortModes[i]) {
                    case "distvert":
                        sorted = _.sortBy(imgData, "top")
                        bounds = [sorted[0].top, sorted.slice(-1)[0].top]
                        spacer = (bounds[1] - bounds[0]) / (sorted.length - 1)
                        for (const iData of sorted) {
                            revSorted.unshift(setImgTemp(iData.id, {top: bounds[0] + counter * spacer}, true))
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
                            // D.Alert(`Setting img ${D.JS(iData)}`)
                            revSorted.unshift(setImgTemp(iData.id, {left: bounds[0] + counter * spacer}, true))
                            counter++
                        }
                        for (const obj of revSorted)
                            toFront(obj)
                        // D.Alert(`Bounds: ${D.JS(bounds)}, Spacer: ${D.JS(spacer)}`)
                        break
                    default:
                        switch (anchorRef.toLowerCase()) {
                            case "best":
                                switch (sortModes[i]) {
                                    case "centerX":
                                        sorted = _.sortBy(imgData, v => (v.left - centerX)**2)
                                        break
                                    case "centerY":
                                        sorted = _.sortBy(imgData, v => (v.top - centerY)**2)
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
        alignImgs = (imgRefs, alignModes = "center", anchorRefs = "best") => {
            const aModes = alignModes.split(","),
                aRefs = anchorRefs.split(","),
                [sortedArray, anchorArray] = sortImgs(imgRefs, aModes, aRefs)
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
                            iData.obj.set({left: anchor.left})
                        break
                    case "centerY":
                        for (const iData of sorted)
                            iData.obj.set({top: anchor.top})
                        break
                    case "left":
                    case "leftedge":
                        for (const iData of sorted)
                            iData.obj.set({left: anchor.leftX + 0.5 * iData.width})
                        break
                    case "right":
                    case "rightedge":
                        for (const iData of sorted)
                            iData.obj.set({left: anchor.rightX - 0.5 * iData.width})
                        break
                    case "top":
                    case "topedge":
                        for (const iData of sorted)
                            iData.obj.set({top: anchor.topY + 0.5 * iData.height})
                        break
                    case "bottom":
                    case "bottomedge":
                        for (const iData of sorted)
                            iData.obj.set({top: anchor.bottomY - 0.5 * iData.height})
                        break
                    // no default
                }
            }
        },
        /* posImgs = (imgRefs, ...params) => {
			const imgObjs = getImgObjs(imgRefs)
			for (const imgObj of imgObjs) {
				const attrList = {}		
				for (const param of params)
					if (VAL({number: param.split(":")[1]}))
						attrList[param.split(":")[0]] = D.Int(param.split(":")[1])
				setImgTemp(imgObj, attrList)
			}
		}, */
        toggleImg = (imgRef, isActive, isForcing = false) => {
            // NON-PERMANENT.  If turning off, set activeSrc to curSrc.
            // Also, verify img status is changing before doing anything.
            if (isActive === null)
                return null
            const imgData = getImgData(imgRef) || VAL({graphicObj: imgRef}) && {isActive: imgRef.get("layer") === "walls"}
            if (VAL({list: imgData}, "toggleImg")) {
                let activeCheck = null
                if (isActive === false || isActive !== true && imgData.isActive === true)
                    activeCheck = false
                else if (isActive === true || isActive !== false && imgData.isActive === false)
                    activeCheck = true
                if (!isForcing && (activeCheck === null || activeCheck === imgData.isActive))
                    return null
                const imgObj = getImgObj(imgData.name) || VAL({graphicObj: imgRef}) && imgRef
                DragPads.Toggle(imgData.name, activeCheck, true)
                if (activeCheck === false) {
                    // TURN OFF: Set layer to walls, toggle off associated drag pads, update activeState value
                    IMGREGISTRY[imgData.name].activeSrc = imgData.curSrc
                    IMGREGISTRY[imgData.name].isActive = false
                    setLayer(imgObj, "walls", isForcing)
                    return false                   
                } else if (activeCheck === true) {
                    // TURN ON: Set layer to active layer, toggle on associated drag pads, restore activeState value if it's different
                    IMGREGISTRY[imgData.name].isActive = true
                    // setImg(imgData.name, imgData.activeSrc)
                    setLayer(imgObj, imgData.activeLayer, isForcing)
                    return true                   
                }
            }
            return null
        },
        removeImg = (imgRef, isUnregOnly) => {
            const imgObj = getImgObj(imgRef),
                imgData = getImgData(imgRef)
            DragPads.DelPad(imgObj)
            if (imgObj && !isUnregOnly) {
                imgObj.remove()
                delete IMGREGISTRY[imgData.name]
                return true
            } else if (imgData && IMGREGISTRY[imgData.name]) {
                delete IMGREGISTRY[imgData.name]
                return true
            } else if (_.isString(imgRef) && IMGREGISTRY[imgRef]) {
                delete IMGREGISTRY[imgRef]
                return true
            }
            return THROW(`Invalid image reference ${D.JSL(imgRef)}`, "removeImg")
        },
        removeImgs = (imgString, isUnregOnly) => {
            const imgNames = _.filter(_.keys(IMGREGISTRY), v => v.includes(imgString))
            for (const imgName of imgNames)
                removeImg(imgName, isUnregOnly)

        },
        cleanRegistry = () => {
            STATEREF.regClean = []
            for (const imgName of _.keys(IMGREGISTRY))
                if (!getImgObj(imgName))
                    STATEREF.regClean.push(imgName)
            if (STATEREF.regClean.length)
                D.Alert(`The following registered images are missing:<br><br>${D.JS(STATEREF.regClean)}<br><br><b>!img clean confirm</b> to purge registry.`, "IMAGE REGISTRY CLEAN")
            else
                D.Alert("No missing image objects found!", "IMAGE REGISTRY CLEAN")
        },
        cleanRegistryConfirm = () => {
            for (const imgName of STATEREF.regClean)
                removeImg(imgName)
            D.Alert(`The following registry entries have been purged:<br><br>${D.JS(STATEREF.regClean)}`, "IMAGE REGISTRY CLEAN CONFIRMED")
            STATEREF.regClean = []
        },
        fixImgObjs = () => {
            const imgKeys = _.keys(IMGREGISTRY),
                imgPairs = _.zip(imgKeys.map(x => IMGREGISTRY[x]), imgKeys.map(x => getObj("graphic", IMGREGISTRY[x].id))),
                reportLines = []
            for (const [imgData, imgObj] of imgPairs) {
                const reportStrings = []
                if (imgData.isActive && imgObj.get("layer") === "walls")
                    reportStrings.push("[Active] layer: 'walls'")
                if (!imgData.isActive && imgObj.get("layer") !== "walls")
                    reportStrings.push(`[Inactive] layer: '${imgObj.get("layer")}'`)
                const srcURL = getURLFromSrc(imgData.curSrc, getImgSrcs(imgData.name))
                if (srcURL !== imgObj.get("imgsrc"))
                    reportStrings.push(`[URL] '${imgData.curSrc}' URL (${srcURL}) !== '${imgObj.get("imgsrc")}'`)
                const srcRef = getSrcFromURL(imgObj.get("imgsrc"), getImgSrcs(imgData.name))
                if (srcRef !== imgData.curSrc)
                    reportStrings.push(`[SRC] curSrc '${imgData.curSrc}' !== '${D.JS(srcRef)}'`)
                toggleImg(imgData.name, imgData.isActive, true)
                setImg(imgData.name, imgData.curSrc, null, true)
                if (reportStrings.length)
                    reportLines.push(`<b>${imgData.name}</b>: ${reportStrings.join(", ")}`)
            }
            if (reportLines.length)
                return [
                    "<h3>FIXED IMAGE OBJECTS:</h3>",
                    ...reportLines
                ].join("<br>")
            return "ALL IMAGE OBJECTS OK!"
        },
        layerImgs = (imgRefs, layer) => {
            const imgObjs = getImgObjs(imgRefs)
            // orderImgs(IMGLAYERS.objects)
            for (const imgObj of imgObjs)
                if (VAL({graphicObj: imgObj}))
                    imgObj.set({layer})
                else
                    D.Alert(`No image found for reference ${D.JS(imgObj)}`, "MEDIA: OrderImgs")
        },
        setImgArea = (imgRef, areaRef, isResizing = false) => {
            const imgObj = getImgObj(imgRef),
                areaData = getAreaData(areaRef)
            if (!imgObj)
                return D.Alert(`Invalid image reference: ${D.JS(imgRef)}`, "MEDIA: setImgArea")
            else if (!areaData)
                return D.Alert(`No area registered as '${D.JS(areaRef)}'`, "MEDIA: setImgArea")
            const imgParams = {
                top: areaData.top,
                left: areaData.left
            }
            if (isResizing) {
                imgParams.height = areaData.height
                imgParams.width = areaData.width
            }
            imgObj.set(imgParams)
            return true
        },        
        // eslint-disable-next-line no-unused-vars
        spreadImgs = (leftImgRef, rightImgRef, midImgRefOrRefs, width, minOverlap = 20, maxOverlap = 40) => {
            const leftData = getImgData(leftImgRef),
                rightData = getImgData(rightImgRef),
                midData = _.map(_.flatten([midImgRefOrRefs]), v => getImgData(v)),
                spread = parseFloat(width)
            let dbString = ""
            DB(`minOverlap: ${minOverlap}, maxOverlap: ${maxOverlap}`)
            if (VAL({list: [leftData, rightData, ...midData], number: [spread]}, "spreadImgs", true)) {
                setImgTemp(leftData.id, {top: leftData.top, left: leftData.left})
                dbString += `Setting Left to {left: ${D.Int(leftData.left)}}<br>`
                // If one imgRef supplied, check to see if it is a reference to a group of consecutively-named imgs:
                if (midData.length === 1) {
                    const imgName = midData[0].name.replace(/_\d*$/gu, "")
                    do
                        midData.push(getImgData(`${imgName}_${midData.length + 1}`))
                    while (_.last(midData))
                    midData.pop()
                }
                // If the spread is smaller than the combined width of the bookends, then set the minimum possible spread and blank all mid imgs.
                if (spread <= leftData.width + rightData.width) {
                    dbString += `Spread ${D.Int(spread)} less than ${D.Int(leftData.width + rightData.width)} (${D.Int(leftData.width)} + ${D.Int(rightData.width)})<br>`
                    for (const imgData of midData)
                        setImg(imgData.id, "blank")
                    DB(`${dbString }Setting Right to {left: ${D.Int(leftData.rightEdge)} + 0.5x${D.Int(rightData.width)} = ${D.Int(leftData.rightEdge + 0.5*rightData.width)}}`, "spreadImgs")
                    return setImgTemp(rightData.id, {
                        top: leftData.top,
                        left: leftData.rightEdge + 0.5*rightData.width
                    })
                }
                // Otherwise, determine how much space will be in the middle.
                const totalMidWidth = spread - leftData.width - rightData.width
                dbString += `Total Mid Width = ${D.Int(totalMidWidth)} (spr:${D.Int(spread)} - L.w:${D.Int(leftData.width)} - R.w:${D.Int(rightData.width)})<br>`
                if (midData.length === 1) {
                    // If only one middle img, stretch it out... BUT have to stretch the minOverlap by the same ratio.
                    // So: need to determine percentage of width that is taken up by minOverlap
                    // Then, need to set overall width such that the remaining percentage is enough to cover the spread.
                    // HOWEVER: if the resulting stretchOverlap EXCEEDS maxOverlap, cap it there.
                    const overlapPercent = 2*minOverlap / midData[0].width,
                        coveragePercent = 1 - overlapPercent,
                        stretchFactor = Math.min(totalMidWidth / (coveragePercent * midData[0].width), maxOverlap / minOverlap),
                        stretchOverlap = minOverlap * stretchFactor,
                        stretchWidth = midData[0].width * stretchFactor
                    dbString += `overlapPercent = ${D.Int(overlapPercent * 100)/100} = (2×mO:${D.Int(minOverlap)} / M.w:${D.Int(midData[0].width)})<br>`
                    dbString += `coveragePercent = ${D.Int(coveragePercent * 100)/100} = (1 - O%:${D.Int(overlapPercent * 100)/100})<br>`
                    dbString += `stretchFactor = ${D.Int(stretchFactor * 100)/100} = MIN(TM.w:${D.Int(totalMidWidth)} / (C%:${D.Int(coveragePercent * 100)/100} × M.w:${D.Int(midData[0].width)}), xO:${D.Int(maxOverlap)}/mO:${D.Int(minOverlap)})<br>`
                    dbString += `stretchOverlap = ${D.Int(stretchOverlap)} = (mO:${D.Int(minOverlap)} × SF:${D.Int(stretchFactor * 100)/100})<br>`
                    dbString += `stretchWidth = ${D.Int(stretchWidth)}<br>`
                    // Now, set the left side of the mid img to account for the stretched overlap, and the stretched width
                    dbString += `Setting Mid Img to: {left: ${D.Int(leftData.rightEdge - stretchOverlap + 0.5*stretchWidth)} (L.re:${D.Int(leftData.rightEdge)} - sO:${D.Int(stretchOverlap)} + 0.5×sW:${D.Int(stretchWidth)})}<br>`
                    setImg(midData[0].id, "base")
                    setImgTemp(midData[0].id, {
                        top: leftData.top + 20,
                        left: leftData.rightEdge - stretchOverlap + 0.5*stretchWidth,
                        width: stretchWidth
                    })
                    dbString += `Setting Right Img to: {left: ${D.Int(leftData.rightEdge - 2*stretchOverlap + stretchWidth + 0.5*rightData.width)} (L.re:${D.Int(leftData.rightEdge)} - 2×sO:${D.Int(stretchOverlap)} + sW:${D.Int(stretchWidth)} + 0.5×R.w:${D.Int(rightData.width)})}<br>`
                    setImgTemp(rightData.id, {
                        top: leftData.top + 40,
                        left: leftData.rightEdge - 2*stretchOverlap + stretchWidth + 0.5*rightData.width
                    })
                    DB(dbString, "spreadImg")
                    return true
                } else {
                    // If multiple middle imgs were specified, first determine the minimum and maximum amount each can cover based on overlap.
                    // The "real" minOverlap is twice the given value, since offsetting an image by one minOverlap width will result in a minOverlap covering another minOverlap.
                    const midImgWidth = midData[0].width,
                        [minCover, maxCover] = [
                            Math.max(0, midImgWidth - 2*maxOverlap),
                            Math.max(0, midImgWidth - 1.5*minOverlap)
                        ],
                        midImgIDs = []
                    dbString += `midWidth: ${D.Int(midData[0].width)}, maxCover: ${D.Int(maxCover)}, minCover: ${D.Int(minCover)}<br>`
                    // Now add mid imgs one by one until their total MAX cover equals or exceeds the spread:
                    let coveredSpread = 0
                    while (midData.length) {
                        if (coveredSpread < totalMidWidth) {
                            setImg(_.last(midData).id, "base")
                            midImgIDs.push(midData.pop().id)
                            coveredSpread += maxCover
                        } else {
                            setImg(midData.pop().id, "blank")
                        }
                        dbString += `... adding ${_.last(midImgIDs)} (cover: ${D.Int(coveredSpread)}), ${midData.length} remaining<br>`
                    }
                    // Now divide up the spread among the imgs, and check that each img's cover is between min and max:
                    const spreadPerImg = totalMidWidth / midImgIDs.length
                    dbString += `SPI = ${D.Int(spreadPerImg)} = TMW:${D.Int(totalMidWidth)} / #Mids:${midImgIDs.length}<br>`
                    if (spreadPerImg < minCover || spreadPerImg > maxCover)
                        THROW(`Unable to spread given images over spread ${spread}: per-img spread of ${spreadPerImg} outside bounds of ${minCover} - ${maxCover}`, "spreadImgs")
                    // Get the actual overlap between imgs, dividing by two to get the value for one side,
                    // and use this number to get the left position for the first middle img.
                    const sideOverlap = 0.5*(midImgWidth - spreadPerImg),
                        firstMidLeft = leftData.rightEdge - sideOverlap + 0.5*midImgWidth
                    dbString += `Side Overlap: ${D.Int(sideOverlap)} = 0.5x(M.w:${D.Int(midImgWidth)} - SPI:${D.Int(spreadPerImg)})<br>`
                    dbString += `L.l: ${D.Int(leftData.left)}, L.re: ${D.Int(leftData.rightEdge)}, firstMidLeft: ${D.Int(firstMidLeft)} (L.re - sO:${D.Int(sideOverlap)} + 0.5xM.w:${D.Int(midImgWidth)})<br>`
                    // Turn on each midImg being used and set the left positioning of each mid img by recursively adding the spreadPerImg:
                    let currentLeft = firstMidLeft
                    for (const imgID of midImgIDs) {
                        setImgTemp(imgID, {
                            top: leftData.top,
                            left: currentLeft
                        })
                        currentLeft += spreadPerImg
                        dbString += `... Spreading Mid to ${D.Int(currentLeft)}<br>`
                        // testVertSpread += 5
                    }
                    // Then, turn off all the unused middle imgs.
                    dbString += `Turning off ${midData.length} imgs.<br>`
                    
                    // Finally, set the position of the rightmost img to the far side of the total width:
                    setImgTemp(rightData.id, {
                        top: leftData.top,
                        left: leftData.leftEdge + spread - 0.5*rightData.width
                    })
                    DB(dbString, "spreadImgs")
                    // for (const imgData of midData)
                    //    setImg(imgData.id, "blank")
                    return true
                }
            }
            return false
        },
    // #endregion

    // #region ANIMATIONS: Creating, Timeouts, Controlling WEBM Animations
        regAnimation = (imgObj, animName, timeOut, activeLayer = "map") => {
            if (VAL({imgObj}, "regAnimation")) {
                imgObj.set("name", animName)
                imgObj.set("layer", "gmlayer")
                ANIMREGISTRY[animName] = {
                    name: animName,
                    id: imgObj.id,
                    left: imgObj.get("left"),
                    top: imgObj.get("top"),
                    height: imgObj.get("height"),
                    width: imgObj.get("width"),
                    activeLayer,
                    imgsrc: imgObj.get("imgsrc").replace(/med/gu, "thumb"),
                    timeOut: D.Int(1000 * D.Float(timeOut)),
                    minTimeBetween: 0,
                    maxTimeBetween: 100,
                    isActive: false,
                    soundEffect: null
                }
                ANIMREGISTRY[animName].leftEdge = ANIMREGISTRY[animName].left - 0.5 * ANIMREGISTRY[animName].width
                ANIMREGISTRY[animName].rightEdge = ANIMREGISTRY[animName].left + 0.5 * ANIMREGISTRY[animName].width
                ANIMREGISTRY[animName].topEdge = ANIMREGISTRY[animName].top - 0.5 * ANIMREGISTRY[animName].height
                ANIMREGISTRY[animName].bottomEdge = ANIMREGISTRY[animName].top + 0.5 * ANIMREGISTRY[animName].height
            }
        },
        setAnimData = (animName, minTimeBetween = 0, maxTimeBetween = 100, soundEffect = null) => {
            const animData = getImgData(animName)
            animData.minTimeBetween = D.Int(1000 * D.Float(minTimeBetween))
            animData.maxTimeBetween = D.Int(1000 * D.Float(maxTimeBetween))
            animData.soundEffect = soundEffect
        },
        flashAnimation = (animName) => {
            const animData = getImgData(animName)
            if (animData.isActive) {
                const animObj = getImgObj(animName)
                animObj.set("layer", animData.activeLayer)
                if (animData.soundEffect)
                    playSoundEffect(animData.soundEffect)
                if (animData.timeOut)
                    setTimeout(() => killAnimation(animObj), animData.timeOut)
            }
        },
        activateAnimation = (animName, minTime = 0, maxTime = 100) => {
            const animData = getImgData(animName)
            if (activeTimers[animName]) {
                clearTimeout(activeTimers[animName])
                delete activeTimers[animName]
            }
            animData.isActive = true
            animData.minTimeBetween = D.Int(1000 * D.Float(minTime))
            animData.maxTimeBetween = D.Int(1000 * D.Float(maxTime))
            setTimeout(() => { 
                pulseAnimation(animName)
            }, randomInteger(animData.maxTimeBetween - animData.minTimeBetween) + animData.minTimeBetween)
        },
        pulseAnimation = (animName) => {
            const animData = getImgData(animName)
            if (activeTimers[animName]) {
                clearTimeout(activeTimers[animName])
                delete activeTimers[animName]
            }
            if (animData.isActive) {
                const timeBetween = randomInteger(animData.maxTimeBetween - animData.minTimeBetween) + animData.minTimeBetween
                flashAnimation(animName)
                activeTimers[animName] = setTimeout(() => { pulseAnimation(animName) }, timeBetween)                
            }
            // D.Alert(JSON.stringify(activeTimers[animName]))
        },
        deactivateAnimation = (animName) => {
            const animData = getImgData(animName)
            if (activeTimers[animName]) {
                clearTimeout(activeTimers[animName])
                delete activeTimers[animName]
            }
            animData.isActive = false
        },
        killAnimation = animObj => {
            if (VAL({imgObj: animObj}, "killAnimation"))
                animObj.set("layer", "gmlayer")
        },
        killAllAnims = () => {
            for (const animData of _.values(ANIMREGISTRY))
                (getObj("graphic", animData.id) || {set: () => false}).set("layer", "gmlayer")
        },
    // #endregion

    // #region TEXT OBJECT GETTERS: Text Object, Width Measurements, Data Retrieval    
        isRegText = textRef => Boolean(getTextKey(textRef, true)), 
        getTextKey = (textRef, isSilent = false) => {
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
                    [textObj] = D.GetSelected(textRef)
                if (VAL({textObj: textRef}))
                    textObj = textRef
                if (VAL({textObj}))
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
                if (VAL({textObj: textRef}))
                    textObj = textRef
                else if (VAL({string: textRef}))
                    if (getTextKey(textRef, isSilent))
                        textObj = getObj("text", TEXTREGISTRY[getTextKey(textRef)].id)
                    else
                        textObj = getObj("text", textRef) || null
                else if (VAL({selected: textRef}))
                    [textObj] = D.GetSelected(textRef)
                return textObj || !isSilent && THROW(`Bad text reference: ${D.JS(textRef)}`, "getTextObj")
            } catch (errObj) {
                return !isSilent && THROW(`Bad text reference: ${D.JS(textRef)}`, "getTextObj", errObj)
            }
        },
        getTextObjs = textRefs => {
            const tRefs = VAL({msg: textRefs}) ? D.GetSelected(textRefs) || [] : textRefs,
                textObjs = []
            if (VAL({array: tRefs})) {
                for (const tRef of tRefs)
                    textObjs.push(getTextObj(tRef))
                return textObjs
            } else if (textRefs === "all") {
                for (const tRef of _.values(TEXTREGISTRY))
                    textObjs.push(getTextObj(tRef.id))
                return textObjs
            }
            return false
        },
        hasShadowObj = textRef => Boolean((getTextData(textRef) || {shadowID: false}).shadowID),
        getShadowShift = textRef => C.SHADOWOFFSETS[(getTextObj(textRef) || {get: () => 20}).get("font_size")],
        getTextData = (textRef, isSilent = false) => {
            try {
                if (getTextKey(textRef, isSilent)) {
                    return TEXTREGISTRY[getTextKey(textRef, isSilent)]
                } else if (getTextObj(textRef, isSilent)) {
                    const textObj = getTextObj(textRef, isSilent)
                    DB(`Retrieving data for UNREGISTERED Text Object ${D.JS(textRef)}`, "getTextData")
                    return {
                        id: textObj.id,
                        left: D.Int(textObj.get("left")),
                        top: D.Int(textObj.get("top")),
                        height: D.Int(textObj.get("height")),
                        width: D.Int(textObj.get("width")),
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
            if (VAL({textObj}, "getTextWidth")) {
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
                    return textString.length * (D.Int(textObj.get("width")) / textObj.get("text").length)
                }
                let textLines = []
                if (maxWidth !== false && maxW)
                    textLines = _.compact(splitTextLines(textObj, textString, maxW, textData && textData.justification))
                else if (maxWidth !== false && textString && textString.includes("\n"))
                    textLines = _.compact(textString.split(/\s*\n+\s*/gu))
                if (textLines.length) {
                    let maxLine = textLines[0]
                    // D.Alert(`TextLines = ${textLines}`)
                    for (const textLine of textLines)
                        // D.Alert(`MAX {${getTextWidth(textObj, maxLine)}} = ${maxLine}<br>TEXT: {${getTextWidth(textObj, textLine)}} = ${textLine}`)
                        maxLine = getTextWidth(textObj, maxLine, false) < getTextWidth(textObj, textLine.trim(), false) ? textLine.trim() : maxLine
                    
                    // D.Alert(`Max Line = ${D.JS(maxLine)}, ${getTextWidth(textObj, maxLine)}`)
                    // D.Alert(`GetTextWidth called. Text: ${text} MaxLine: ${maxLine} with maxWidth ${D.JS(maxWidth)} and maxW ${D.JS(maxW)}<br>Width: ${getTextWidth(textObj, maxLine, false)}`)
                    return getTextWidth(textObj, maxLine, false)
                }
                _.each(chars, char => {
                    if (char !== "\n" && !charRef[char] && charRef[char] !== " " && charRef[char] !== 0)
                        DB(`... MISSING '${char}' in '${font}' at size '${size}'`, "getTextWidth")
                    else
                        width += charRef[char]
                })
                /* if (maxWidth !== false)
                    D.Alert(`GetTextWidth called on ${text} with maxWidth ${D.JS(maxWidth)} and maxW ${D.JS(maxW)}`) */
                return width
            }
            return false
        },
        getMaxWidth = (textRef) => {
            const textObj = getTextObj(textRef),
                splitLines = textObj.get("text").split(/\n/gu)
            let max = 0
            for (const line of splitLines)
                max = Math.max(max, getTextWidth(textObj, line, false))
            return max
        },
        getTextHeight = (textRef, text, maxWidth) => {
            const textObj = getTextObj(textRef),
                textData = getTextData(textRef),
                textValue = text || textObj.get("text"),
                numLines = maxWidth ? splitTextLines(textObj, textValue, maxWidth, textData.justification).length : (textValue.match(/\n/gui) || []).length + 1
            return numLines * textData.lineHeight
        },
        getBlankLeft = (textRef, justification, maxWidth = 0, useCurrent = false) => {
            const textObj = getTextObj(textRef),
                justify = justification || getTextData(textRef).justification || "center"
            if (VAL({textObj}, "getBlankLeft")) {  
                // D.Alert(`GetBlankLeft(${D.JS(getTextKey(textRef))}, ${D.JS(justify)}, ${D.JS(maxWidth)}, ${D.JS(useCurrent)}) =<br>Left: ${D.JS(textObj.get("left"))}, Width: ${D.JS(useCurrent ? getTextWidth(textObj, textObj.get("text"), maxWidth) : getTextWidth(textObj))}, Final: ${D.JS(useCurrent && (textObj.get("left") + {left: -0.5, right: 0.5, center: 0}[justify] * getMaxWidth(textObj)) || (textObj.get("left") + {left: -0.5, right: 0.5, center: 0}[justify] * getTextWidth(textObj, textObj.get("text"), maxWidth)))}`) 
                // if (useCurrent)
                //    return textObj.get("left") + (justify === "left" ? -0.5 : justify === "right" ? 0.5 : 0) * getMaxWidth(textObj)
                // D.Alert(`getBlankLeft Called on ${textObj.get("text")} with maxWidth ${maxWidth} into getTextWidth -->`)
                // return textObj.get("left") + (justify === "left" ? -0.5 : justify === "right" ? 0.5 : 0) * getTextWidth(textObj, textObj.get("text"), maxWidth)
                if (useCurrent)
                    return textObj.get("left") + {left: -0.5, right: 0.5, center: 0}[justify] * getMaxWidth(textObj)
                return textObj.get("left") + {left: -0.5, right: 0.5, center: 0}[justify] * getTextWidth(textObj, textObj.get("text"), maxWidth)
            }
            return false
        },
        getRealLeft = (textRef, params = {}) => {
            const textObj = getTextObj(textRef),
                textData = getTextData(textRef)
            if (VAL({textObj}, "getRealLeft")) {
                params.left = params.left || textData.left
                params.text = params.text || textObj.get("text")
                params.justification = params.justification || textData.justification || "center"
                // D.Alert(`getRealLeft(${D.JS(textData.name)}, ${D.JS(params)}) =<br>Left: ${D.JS(textObj.get("left"))}, DataLeft: ${D.JS(textData.left)}, Final: ${params.left + {left: -0.5, right: 0.5, center: 0}[params.justification] * getTextWidth(textObj, params.text, params.maxWidth || 0)}`)
                return params.left + {left: 0.5, right: -0.5, center: 0}[params.justification] * getTextWidth(textObj, params.text, params.maxWidth || 0)
            }
            return false            
        },      
    // #endregion

    // #region TEXT OBJECT MANIPULATORS: Buffering, Justifying, Splitting
        buffer = (textRef, width) => " ".repeat(Math.max(0, Math.round(width/getTextWidth(textRef, " ", false)))),
        splitTextLines = (textRef, text, maxWidth, justification = "left") => {
            const textObj = getTextObj(textRef)
            let textStrings = text.split(/(\s|-)/gu).filter(x => x.match(/\S/gu)),
                splitStrings = [],
                highWidth = 0
            for (let i = 0; i < textStrings.length; i++)
                if (textStrings[i] === "-") {
                    textStrings[i-1] = `${textStrings[i-1] }-`
                    textStrings = [...[...textStrings].splice(0,i), ...[...textStrings].splice(i+1)]
                }
            // let [stringCount, lineCount] = [0, 0]
            while (textStrings.length) {
                let thisString = "",
                    nextWidth = getTextWidth(textObj, textStrings[0] + (textStrings[0].endsWith("-") ? "" : " "), false)
                // lineCount++
                // stringCount = 0
                // DB(`LINE ${lineCount}.  NextWidth: ${nextWidth}`, "splitTextLines")
                while (nextWidth < maxWidth && textStrings.length) {
                    thisString += textStrings[0].endsWith("-") ? `${textStrings.shift()}` : `${textStrings.shift()} `
                    nextWidth = textStrings.length ? getTextWidth(textObj, thisString + textStrings[0] + (textStrings[0].endsWith("-") ? "" : " "), false) : 0
                    // stringCount++
                    // DB(`... STRING ${stringCount}: ${thisString}  NextWidth: ${nextWidth}`, "splitTextLines")
                }
                // DB(`ADDING LINE: ${thisString} with width ${getTextWidth(textObj, thisString, false)}`, "splitTextLines")
                splitStrings.push(thisString)
                highWidth = Math.max(getTextWidth(textObj, thisString, false), highWidth)
            }
            if (justification === "center")
                splitStrings = _.map(splitStrings, v => `${buffer(textObj, 0.5 * (highWidth - getTextWidth(textObj, v, false)))}${v}${buffer(textObj, 0.5 * (highWidth - getTextWidth(textObj, v, false)))}`)
            else if (justification === "right")
            // D.Alert(`spaceWidth: ${spaceWidth}, repeating ${D.JS(Math.round((highWidth - getTextWidth(textObj, splitStrings[0], false))/spaceWidth))} Times.`)
                splitStrings = _.map(splitStrings, v => `${buffer(textObj, highWidth - getTextWidth(textObj, v, false))}${v}`)
       // D.Alert(`SplitTextLines Called.  Returning: ${D.JS(splitStrings)}`)
            return splitStrings
        },
        justifyText = (textRef, justification, maxWidth = 0) => {
            const textObj = getTextObj(textRef)
            // D.Alert(`Justifying ${D.JS(getTextKey(textObj))}.  Reference: ${D.JS(textRef)}, Object: ${D.JS(textObj)}`, "justifyText")
            if (VAL({textObj})) {
                TEXTREGISTRY[getTextKey(textObj)].justification = justification || "center"
                TEXTREGISTRY[getTextKey(textObj)].left = getBlankLeft(textObj, justification, maxWidth)
                TEXTREGISTRY[getTextKey(textObj)].width = getTextWidth(textObj, textObj.get("text"), maxWidth)
                // D.Alert(`${getTextKey(textRef)} Updated: ${D.JS(TEXTREGISTRY[getTextKey(textObj)])}`, "justifyText")
            }
        },
    // #endregion

    // #region TEXT OBJECT SETTERS: Registering, Changing, Deleting
        regText = (textRef, hostName, activeLayer, hasShadow, justification = "center", options = {}, isSilent = false) => {
            const textObj = getTextObj(textRef)
            DB(`regText(textRef, ${D.JS(hostName)}, ${D.JS(activeLayer)}, ${D.JS(hasShadow)}, ${D.JS(options)}`, "regText")
            if (VAL({text: textObj})) {
                if (!(hostName && activeLayer))
                    return THROW("Must supply host name and active layer for regText.", "RegText")
                let name
                if (options.name && !TEXTREGISTRY[options.name])
                    name = options.name
                else if (!TEXTREGISTRY[hostName])
                    name = hostName
                else
                    name = `${hostName.replace(/(_|\d|#)+$/gu, "")}_${_.filter(_.keys(TEXTREGISTRY), k => k.includes(hostName.replace(/(_|\d|#)+$/gu, ""))).length + 1}`
                const [font_family, font_size, curText, height] = [ /* eslint-disable-line camelcase */
                        textObj.get("font_family").toLowerCase().includes("contrail") ? "Contrail One" : textObj.get("font_family"),
                        textObj.get("font_size"),
                        textObj.get("text").trim(),
                        textObj.get("height")
                    ],
                    lineHeight = D.CHARWIDTH[font_family] && D.CHARWIDTH[font_family][font_size] && D.CHARWIDTH[font_family][font_size].lineHeight || height
                TEXTREGISTRY[name] = Object.assign({name, height, font_family, font_size, activeLayer, lineHeight, justification, curText,
                                                    id: textObj.id,
                                                    type: textObj.get("_type") === "text" && "text" || "image",
                                                    top: textObj.get("top") - 0.5 * (curText.split("\n").length - 1) * lineHeight,
                                                    color: textObj.get("color"),
                                                    maxWidth: 0,
                                                    activeText: curText,
                                                    vertAlign: "top",
                                                    curMode: Session.Mode,
                                                    isActive: true}, _.omit(options, ["text", "layer", "_type", "obj", "object"]))
                TEXTREGISTRY[name].left = getBlankLeft(textObj, options.justification, options.maxWidth, true)
                TEXTREGISTRY[name].width = getMaxWidth(textObj)
                TEXTREGISTRY[name].zIndex = getZLevel(name) || TEXTREGISTRY[name].zIndex || 300
                TEXTREGISTRY[name].modes = C.MODEDEFAULTS(textObj, options.modes)
                DB(`Modes for ${name}: ${D.JS(TEXTREGISTRY[name].modes)}`, "regText")  
                if (hasShadow) {
                    const shadowObj = createObj("text", {
                        _pageid: D.PAGEID,
                        text: TEXTREGISTRY[name].curText,
                        left: TEXTREGISTRY[name].left,
                        top: TEXTREGISTRY[name].top,
                        font_size: TEXTREGISTRY[name].font_size,
                        color: "rgb(0,0,0)",
                        font_family: TEXTREGISTRY[name].font_family,
                        layer: TEXTREGISTRY[name].activeLayer,
                        controlledby: ""
                    })
                    TEXTREGISTRY[name].shadowID = shadowObj.id
                }
                setText(textObj, TEXTREGISTRY[name].curText, true)
                setTextData(textObj, _.pick(TEXTREGISTRY[name], C.TEXTPROPS))
                setLayer(name, TEXTREGISTRY[name].activeLayer, true)
                updateTextShadow(name, true)       
                D.Alert(`Host obj for '${D.JS(name)}' registered: ${D.JS(TEXTREGISTRY[name])}`, "regText")
                // initMedia()
                return getTextData(name)
            }
            return !isSilent && THROW(`Invalid text reference '${D.JS(textRef)}'`, "regText")
        },
        makeText = (hostName, activeLayer, hasShadow, justification, options = {}, isSilent = false) => {
            DB(`makeText(${D.JS(hostName)}, ${D.JS(activeLayer)}, ${D.JS(hasShadow)}, ${D.JS(options)}`, "makeText")
            const actLayer = activeLayer || options.activeLayer || options.layer || "objects",
                objParams = Object.assign({_pageid: D.PAGEID,
                                           text: options.text || "",
                                           left: 200,
                                           top: options.top || 200,
                                           font_size: options.size || options.fontSize || options.font_size || 24,
                                           color: options.color || C.COLORS.brightred,
                                           font_family: options.font || options.fontFamily || options.font_family || "Candal",
                                           layer: actLayer,
                                           controlledby: ""
                }, _.pick(options, ...C.TEXTPROPS)),
                textObj = createObj("text", objParams)
            options.activeText = objParams.text             
            textObj.set("left", getRealLeft(textObj, {left: textObj.get("left"), justification: justification || options.justification || "center", maxWidth: options.maxWidth || 0}))
            regText(textObj, hostName, actLayer, hasShadow, justification, options, isSilent)
            return textObj
        },
        updateTextShadow = (textRef) => {
            const textData = getTextData(textRef)
            if (VAL({list: textData}, "updateTextShadow") && textData.shadowID) {
                const textObj = getTextObj(textData.name),
                    shadowObj = getObj("text", textData.shadowID)
                if (VAL({textObj: shadowObj}, "updateTextShadow")) {
                    const shadowShift = getShadowShift(textObj),
                        shadowParams = {
                            text: textObj.get("text"),
                            left: textObj.get("left") + shadowShift,
                            top: textObj.get("top") + shadowShift
                        }
                    shadowObj.set(shadowParams)
                    toFront(shadowObj)
                    toFront(textObj)
                }
            }
        },
        linkText = (masterRef, slaveData, horizPad = 0, vertPad = 0) => {
            // ON MASTER: list each slave object in terms of the edge it attaches to -- top, left, right or bottom
            // ON SLAVES: set "pushleft" and "pushtop" values in their registry data whenever master changes
            //      Register them with "horizPad" and "vertPad" to add extra distance.
            //      Slaves must be set to the exact same position as the master to shift properly.
            const masterObj = getTextObj(masterRef),
                masterKey = getTextKey(masterObj)
            D.Alert(`Slave Data: ${D.JS(slaveData)}`)
            TEXTREGISTRY[masterKey].linkedText = TEXTREGISTRY[masterKey].linkedText || {}
            for (const edgeDir of _.keys(slaveData)) {
                TEXTREGISTRY[masterKey].linkedText[edgeDir] = TEXTREGISTRY[masterKey].linkedText[edgeDir] || []
                for (const slaveRef of slaveData[edgeDir]) {
                    const slaveKey = getTextKey(slaveRef)
                    TEXTREGISTRY[masterKey].linkedText[edgeDir].push(slaveKey)
                    TEXTREGISTRY[slaveKey].horizPad = horizPad
                    TEXTREGISTRY[slaveKey].vertPad = vertPad
                }
            }
            updateSlaveText(masterKey)
        },
        updateSlaveText = (masterRef) => {
            const masterObj = getTextObj(masterRef),
                masterKey = getTextKey(masterObj),
                edgeDirs = TEXTREGISTRY[masterKey].linkedText || {}
            for (const edgeDir of _.keys(edgeDirs))
                for (const slaveKey of edgeDirs[edgeDir]) {
                    const slaveData = getTextData(slaveKey)
                    if (slaveData) {
                        switch (edgeDir) {
                            case "left":
                                TEXTREGISTRY[slaveKey].pushleft = masterObj.get("text").match(/\S/gui) ? -getMaxWidth(masterObj) - slaveData.horizPad : 0
                                break
                            case "right":
                                TEXTREGISTRY[slaveKey].pushleft = masterObj.get("text").match(/\S/gui) ? getMaxWidth(masterObj) + slaveData.horizPad : 0
                                break
                            case "top":
                                TEXTREGISTRY[slaveKey].pushtop = masterObj.get("text").match(/\S/gui) ? -getTextHeight(masterObj) - slaveData.vertPad : 0
                                break
                            case "bottom":
                                TEXTREGISTRY[slaveKey].pushtop = masterObj.get("text").match(/\S/gui) ? getTextHeight(masterObj) + slaveData.vertPad : 0
                            // no default
                        }
                        setText(slaveKey, slaveData.curText)
                    }
                }
        },
        setText = (textRef, text, isToggling, isForcing = false) => {
            if (isToggling === false || isToggling === true) 
                toggleText(textRef, isToggling, isForcing)
            if (!isForcing && (text === null || text === undefined))
                return null
            const textData = getTextData(textRef)
            if (VAL({list: textData}, "setText")) {                
                if (!isForcing && textData.curText === text)
                    return null                
                const textKey = textData.name,
                    textObj = getTextObj(textRef),
                    textParams = {text} 
                if (!VAL({string: textParams.text}))
                    textParams.text = _.isString(textData.curText) && textData.curText || textObj.get("text")
                let [totalTopShift, totalLeftShift] = [(textData.shiftTop || 0) + (textData.pushtop || 0), (textData.shiftLeft || 0) + (textData.pushleft || 0)]
                if (VAL({textObj}, ["setText", `textRef: ${D.JS(textRef)}, text: ${D.JS(text)}`])) {
                    if (textData.maxWidth && textParams.text.length) {
                        const splitLines = splitTextLines(textObj, textParams.text, textData.maxWidth, textData.justification)
                        textParams.text = splitLines.join("\n")           
                    }                
                    if (textParams.text.split("\n").length > 1)
                        switch (textData.vertAlign) {
                            case "top":
                                totalTopShift += 0.5*(textParams.text.split("\n").length - 1)*(
                                    textData.lineHeight || 
                                    D.CHARWIDTH[textObj.get("font_family")] && D.CHARWIDTH[textObj.get("font_family")][textObj.get("font_size")] && D.CHARWIDTH[textObj.get("font_family")][textObj.get("font_size")].lineHeight ||
                                    0)
                                break
                            case "bottom":
                                totalTopShift += 0.5*(textParams.text.split("\n").length - 1)*(
                                    textData.lineHeight || 
                                    D.CHARWIDTH[textObj.get("font_family")] && D.CHARWIDTH[textObj.get("font_family")][textObj.get("font_size")] && D.CHARWIDTH[textObj.get("font_family")][textObj.get("font_size")].lineHeight ||
                                    0)
                                break
                            // no default
                        }
                    textParams.left = getRealLeft(textObj, {
                        left: (textData.left || getBlankLeft(textObj, textObj.get("text"))) + totalLeftShift, 
                        text: textParams.text,
                        justification: textData.justification,
                        maxWidth: textData.maxWidth
                    })
                    textParams.top = (textData.top || textObj.get("top")) + totalTopShift
                    if (textData.isActive)
                        TEXTREGISTRY[textData.name].activeText = textParams.text
                    TEXTREGISTRY[textData.name].curText = textParams.text
                    if (textParams.left === textObj.get("left"))
                        delete textParams.left
                    if (textParams.top === textObj.get("top"))
                        delete textParams.top
                    textObj.set(textParams)
                    if (textData.shadowID)
                        updateTextShadow(textKey)
                    if (textData.linkedText)
                        updateSlaveText(textKey)
                    return textObj
                }
            }
            return false
        },
        setTextData = (textRef, params) => {
            const textKey = getTextKey(textRef)           
            if (VAL({string: textKey}, "setTextData")) {
                const textObj = getTextObj(textKey)
                if (VAL({textObj}, ["setTextData", `Registered object '${textKey}' not found!`])) {
                    const textParams = params, // Object.assign(params, {left: getBlankLeft(textObj)}),
                        objParams = _.omit(_.pick(textParams, C.TEXTPROPS), "text")
                    // D.Alert(`textParams: ${D.JS(textParams)}<br>objParams: ${D.JS(objParams)}`, `${textKey}`)
                    _.each(textParams, (v, k) => {
                        if (k === "text")
                            D.Alert("Attempt to set 'text' via setTextData: Use setText() to set text values!", "ERROR: setTextData")
                        else
                            TEXTREGISTRY[textKey][k] = v
                    })
                    textObj.set(objParams)
                    if (_.intersection(_.keys(textParams), ["shiftTop", "top", "shiftLeft", "left", "pushtop", "pushleft"]).length)
                        setText(textKey, null, undefined, true)
                    return getTextData(textKey)
                }
            }
            return false
        },
        toggleText = (textRef, isActive, isForcing = false) => {
            // NON-PERMANENT.  If turning off, set activeSrc to curSrc.
            // Also, verify img status is changing before doing anything.
            if (isActive === null) return null
            const textData = getTextData(textRef)
            if (VAL({list: textData}, "toggleText")) {
                let activeCheck = null
                if (isActive === true || isActive !== false && textData.isActive === false)
                    activeCheck = true
                else if (isActive === false || isActive !== true && textData.isActive === true)
                    activeCheck = false
                DB(`ToggleText(${D.JS(textRef)}, ${D.JS(isActive)}, ${D.JS(isForcing)})<br>... Active Check: ${D.JS(activeCheck)}, textData.isActive: ${D.JS(textData.isActive)}`, "toggleText")
                if (!isForcing && textData.isActive === activeCheck)
                    return null                
                const textKey = textData.name,
                    textObj = getTextObj(textKey)             
                if (activeCheck === false) {
                    DB("Turning Off.", "toggleText")
                    // TURN OFF: Set layer to walls, toggle off associated drag pads, update activeState value
                    TEXTREGISTRY[textKey].activeText = textData.curText
                    TEXTREGISTRY[textKey].isActive = false
                    // setLayer(textObj, "walls", isForcing)
                    textObj.set("layer", "walls")
                    if (textData.shadowID)
                        (getObj("text", textData.shadowID) || {set: () => false}).set("layer", "walls")
                    return false                   
                } else if (activeCheck === true) {
                    DB("Turning On.", "toggleText")
                    // TURN ON: Set layer to active layer, toggle on associated drag pads, restore activeState value if it's different
                    TEXTREGISTRY[textKey].isActive = true
                    setText(textKey, textData.activeText, null, isForcing)
                    textObj.set("layer", textData.activeLayer)
                    // setLayer(textObj, textData.activeLayer, isForcing)
                    if (textData.shadowID)
                        (getObj("text", textData.shadowID) || {set: () => false}).set("layer", textData.activeLayer)
                    return true                   
                }
            }
            return null
        },
        removeText = (textRef, isUnregOnly, isStillKillingShadow) => {
            const textObj = getTextObj(textRef),
                textData = getTextData(textRef)
            if (textData.shadowID) {
                const shadowObj = getObj("text", textData.shadowID)
                if (shadowObj && !isUnregOnly || isStillKillingShadow)
                    shadowObj.remove()
            }
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
        fixTextObjs = () => {
            const textKeys = _.keys(TEXTREGISTRY),
                textPairs = _.zip(textKeys.map(x => TEXTREGISTRY[x]), textKeys.map(x => getObj("text", TEXTREGISTRY[x].id))),
                reportLines = []
            for (const [textData, textObj] of textPairs) {
                const reportStrings = []
                if (textData.isActive && textObj.get("layer") === "walls")
                    reportStrings.push("[Active] layer: 'walls'")
                if (!textData.isActive && textObj.get("layer") !== "walls")
                    reportStrings.push(`[Inactive] layer: '${textObj.get("layer")}'`)
                if (textData.curText !== textObj.get("text")) 
                    reportStrings.push(`[TEXT] curText '${textData.curText}' !== '${textObj.get("text")}'`)
                toggleText(textData.name, textData.isActive, true)
                setText(textData.name, textData.curText, null, true)                
                if (reportStrings.length)
                    reportLines.push(`<b>${textData.name}</b>: ${reportStrings.join(", ")}`)
            }
            if (reportLines.length)
                return [
                    "<h3>FIXED TEXT OBJECTS:</h3>",
                    ...reportLines
                ].join("<br>")
            return "ALL TEXT OBJECTS OK!"
        },
    // #endregion

    // #region SOUND OBJECT GETTERS: Registering & Manipulating Music & Sound Effects 
        startPlaylist = playlist => {
            STATEREF.activePlaylists = _.uniq([...STATEREF.activePlaylists, playlist])
            sendChat("", `!roll20AM --audio,play,mode:shuffle|${playlist}`)
        },
        stopPlaylist = playlist => {
            STATEREF.activePlaylists = _.without(STATEREF.activePlaylists, playlist)
            sendChat("", `!roll20AM --audio,stop|${playlist}`)
        },
        playSoundEffect = soundEffect => {            
            sendChat("", `!roll20AM --audio,stop|${soundEffect}`)
            sendChat("", `!roll20AM --audio,play,mode:single|${soundEffect}`)
        }
    // #endregion

    return {
        CheckInstall: checkInstall,
        OnChatCall: onChatCall,
        OnGraphicAdd: onGraphicAdd,

        // REGISTRIES
        IMAGES: IMGREGISTRY, TEXT: TEXTREGISTRY, AREAS: AREAREGISTRY,

        // GENERAL MEDIA FUNCTIONS
        Get: getMediaObj,
        GetKey: getKey,
        GetData: getData,
        GetModeData: getModeData,
        IsRegistered: isRegistered,
        HasForcedState: hasForcedState,
        SwitchMode: switchMode,
        IsActive: isObjActive,
        Toggle: toggle,    
        
        // GETTERS
        GetImg: getImgObj, GetText: getTextObj,
        GetImgKey: getImgKey, GetTextKey: getTextKey,
        GetImgData: getImgData, GetTextData: getTextData,
        GetImgSrc: getImgSrc,
        GetToken: getTokenObj,
        GetTextWidth: getTextWidth,
        Buffer: buffer,

        // CONSTRUCTORS, REGISTERS & DESTROYERS
        MakeImg: makeImg, MakeText: makeText,
        RegImg: regImg, RegText: regText,
        RemoveImg: removeImg, RemoveAllImgs: removeImgs, RemoveText: removeText, RemoveAllText: removeTexts,

        // SETTERS
        SetImg: setImg, SetText: setText,        
        ToggleImg: toggleImg, ToggleText: toggleText,
        SetImgData: setImgData, SetTextData: setTextData,
        SetImgTemp: setImgTemp, // SetTextTemp: setTextTemp,

        // AREA FUNCTIONS
        GetBounds: getBounds, GetContents: getContainedImgObjs,
        GetContainedChars: (locRef, options) => getContainedImgObjs(locRef, Object.assign(options, {isCharsOnly: true})),
        SetArea: setImgArea,
        
        // ANIMATION FUNCTIONS
        Flash: flashAnimation,
        Pulse: activateAnimation,
        Kill: deactivateAnimation,

        // SOUND FUNCTIONS
        StartPlaylist: startPlaylist,
        StopPlaylist: stopPlaylist,
        get ActivePlaylists() { return STATEREF.activePlaylists },
        
        // REINITIALIZE MEDIA OBJECTS (i.e. on MODE CHANGE)
        Fix: () => {
            setActiveLayers(false)
            setZIndices()
        }
    }
})()

on("ready", () => {
    Media.CheckInstall()
    D.Log("Media Ready!")
})
void MarkStop("Media")