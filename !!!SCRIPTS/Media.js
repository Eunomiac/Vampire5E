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
            STATEREF.soundregistry = STATEREF.soundregistry || {}
            STATEREF.TokenSrcs = STATEREF.TokenSrcs || {}
            STATEREF.imgResizeDims = STATEREF.imgResizeDims || {height: 100, width: 100}
            STATEREF.activeAnimations = STATEREF.activeAnimations || {}
            STATEREF.activeSounds = STATEREF.activeSounds || []
            STATEREF.curLocation = STATEREF.curLocation || "DistrictCenter:blank SiteCenter:blank"

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
            return

            const srcsToAdd = {
                Horizon_1: {
                    night1: "https://s3.amazonaws.com/files.d20.io/images/96325997/MpxC9gfKRM1xtCCPjYT46g/thumb.jpg?1573105648"
                },
                WeatherClouds_1: {
                    night1clouds: "https://s3.amazonaws.com/files.d20.io/images/96326509/6xytUfwtm1-NarmVnpy0nw/thumb.png?1573106351"
                }
            }
            for (const [imgName, imgData] of Object.entries(STATEREF.imgregistry))
                if (_.keys(srcsToAdd).includes(imgName)) {
                    const imgSrcs = Object.assign({}, imgData.srcs)
                    for (const srcName of _.keys(imgSrcs))
                        delete STATEREF.imgregistry[imgName].srcs[srcName]
                    for (const [srcName, srcString] of Object.entries(srcsToAdd[imgName]))
                        STATEREF.imgregistry[imgName].srcs[srcName] = srcString                    
                    for (const [srcName, srcString] of Object.entries(imgSrcs))
                        STATEREF.imgregistry[imgName].srcs[srcName] = srcString
                }
            // "SubSiteTopRight_1","SubSiteRight_1","SubSiteBotRight_1","SubSiteTopLeft_1","SubSiteLeft_1","SubSiteBotLeft_1"
            // STATEREF.imgregistry.SubLocTopRight_1 = D.Clone(STATEREF.imgregistry.SubSiteTopRight_1)
            // STATEREF.imgregistry.SubLocRight_1 = D.Clone(STATEREF.imgregistry.SubSiteRight_1)
            // STATEREF.imgregistry.SubLocBotRight_1 = D.Clone(STATEREF.imgregistry.SubSiteBotRight_1)
            // STATEREF.imgregistry.SubLocTopLeft_1 = D.Clone(STATEREF.imgregistry.SubSiteTopLeft_1)
            // STATEREF.imgregistry.SubLocLeft_1 = D.Clone(STATEREF.imgregistry.SubSiteLeft_1)
            // STATEREF.imgregistry.SubLocBotLeft_1 = D.Clone(STATEREF.imgregistry.SubSiteBotLeft_1)
            // delete STATEREF.imgregistry.SubSiteTopRight_1
            // delete STATEREF.imgregistry.SubSiteRight_1
            // delete STATEREF.imgregistry.SubSiteBotRight_1
            // delete STATEREF.imgregistry.SubSiteTopLeft_1
            // delete STATEREF.imgregistry.SubSiteLeft_1
            // delete STATEREF.imgregistry.SubSiteBotLeft_1
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
                                    D.Alert(`Registered Areas:<br>${D.JS(_.keys(REGISTRY.AREA))}`)
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
                                arearegistry: JSON.parse(JSON.stringify(REGISTRY.AREA)),
                                imgregistry: JSON.parse(JSON.stringify(REGISTRY.IMG)),
                                textregistry: JSON.parse(JSON.stringify(REGISTRY.TEXT))
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
                                            D.Alert("Syntax: !img reg &lt;hostName&gt; &lt;(ref:)currentSourceName&gt; &lt;activeLayer&gt; [params (\"key:value, key:value\")]", "MEDIA: !img reg")    
                                        break
                                    }
                                }
                            else
                                D.Alert("Syntax: !img reg &lt;hostName&gt; &lt;(ref:)currentSourceName&gt; &lt;activeLayer(objects/map/walls/gmlayer)&gt; &lt;isStartingActive&gt; [params (\"key:value, key:value\")]<br>!img reg token &lt;tokenName&rt;", "MEDIA: !img reg")
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
                                        REGISTRY.IMG[imgKey].modes = REGISTRY.IMG[imgKey].modes || {}
                                        REGISTRY.IMG[imgKey].modes[mode] = REGISTRY.IMG[imgKey].modes[mode] || {}
                                        for (const key of _.keys(params)) {
                                            if (["true", "false", "null"].includes(D.LCase(params[key])))
                                                params[key] = {true: true, false: false, null: null}[D.LCase(params[key])]
                                            REGISTRY.IMG[imgKey].modes[mode][key] = params[key]
                                        }                                                
                                        D.Alert(`${mode} mode for ${imgKey} set to ${D.JS(REGISTRY.IMG[imgKey].modes[mode])}`, "!img set mode")
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
                                        REGISTRY.IMG[hostName].cycleSrcs = REGISTRY.IMG[hostName].cycleSrcs || []
                                        REGISTRY.IMG[hostName].cycleSrcs.push(srcName)
                                    }
                                }
                                // falls through
                                case "src": case "source": {
                                    srcName = srcName || args.shift()
                                    if (VAL({string: srcName}, "!img add cyclesrc") && isRegImg(hostName)) {
                                        if (!_.isObject(REGISTRY.IMG[hostName].srcs))
                                            REGISTRY.IMG[hostName].srcs = {}
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
                                    for (const hostName of _.keys(REGISTRY.IMG))
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
                                case "allimg": case "allimages": {
                                    for (const hostName of _.keys(REGISTRY.IMG))
                                        if (D.LCase(hostName).includes(D.LCase(args.join(" "))))
                                            removeImg(hostName, true)
                                    break
                                }
                                default: {
                                    const imgRefs = [...imgObjs, ...args]
                                    if (call)
                                        imgRefs.push(call)                             
                                    for (const imgRef of imgRefs) {
                                        const imgKeys = _.compact(_.flatten([getImgKey(imgRef) || VAL({string: imgRef}) && Object.keys(REGISTRY.IMG).map(x => x.match(new RegExp(`^${imgRef}_?\\d*$`, "gu"))) || null]))
                                        for (const imgKey of imgKeys) {
                                            removeImg(imgKey)
                                            if (REGISTRY.IMG[imgKey])
                                                delete REGISTRY.IMG[imgKey]
                                        }
                                    }
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
                                            REGISTRY.IMG[hostName].top = D.Int(imgObj.get("top"))
                                            REGISTRY.IMG[hostName].left = D.Int(imgObj.get("left"))
                                            REGISTRY.IMG[hostName].height = D.Int(imgObj.get("height"))
                                            REGISTRY.IMG[hostName].width = D.Int(imgObj.get("width"))
                                            D.Alert(`Position Set for Img ${hostName}<br><br><pre>${D.JS(REGISTRY.IMG[hostName])}</pre>`)
                                        }
                                    break
                                }
                                case "cyclesrc": case "cyclesrcs": {
                                    const imgKey = getImgKey(imgObjs.shift())
                                    if (isRegImg(imgKey))
                                        delete REGISTRY.IMG[imgKey].cycleSrcs
                                    break
                                }
                                case "modes": {
                                    resetModes()
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
                                    if ((!imgResize || params.length) && params.height && params.width) {
                                        imgResize = true
                                        STATEREF.imgResizeDims.height = params.height
                                        STATEREF.imgResizeDims.width = params.width
                                        D.Alert(`New imagess automatically resized to height: ${STATEREF.imgResizeDims.height}, width: ${STATEREF.imgResizeDims.width}.`, "!img toggle resize")
                                    } else {
                                        imgResize = false
                                        D.Alert("Img resizing disabled.", "MEDIA, !img toggle resize")
                                    }
                                    break
                                }
                                case "autosrc": {                                    
                                    const [imgObj] = Listener.GetObjects(objects, "graphic")
                                    if (imgSrcAutoReg) {
                                        imgSrcAutoReg = false
                                        D.Alert("Automatic registration of image sources toggled OFF.", "!img toggle autosrc")
                                    } else {
                                        const hostName = getImgKey(imgObj),
                                            keysSrc = args.shift()
                                        if (isRegImg(hostName) && C[(keysSrc || "").toUpperCase()]) {
                                            STATEREF.autoRegSrcNames = _.keys(C[keysSrc.toUpperCase()])
                                            imgSrcAutoReg = hostName
                                            D.Alert(`Automatic registration of image sources toggled ON for ${D.JS(hostName)}.<br><br>Upload image for <b>${STATEREF.autoRegSrcNames[0]}</b>`, "Image Auto Registration")
                                        } else {
                                            D.Alert(`No '${keysSrc}' keys found for image host name '${D.JS(hostName)}'`, "!img toggle autosrc")
                                        }
                                    }
                                    break
                                }
                                case "autotoken": {
                                    if (args[0] === "skip") {
                                        let skippedName
                                        if (imgSrcAddingProfilePic) {
                                            skippedName = imgSrcAddingProfilePic.get("name")
                                            imgSrcAddingProfilePic = false
                                        } else {
                                            [skippedName] = STATEREF.autoRegTokenNames
                                            STATEREF.autoRegTokenNames.shift()
                                        }
                                        if (imgSrcAutoToken && skippedName && STATEREF.autoRegTokenNames.length) {
                                            D.Alert(`Skipping <b>${skippedName}</b>...<br>Upload token image for <b>${STATEREF.autoRegTokenNames[0]}`, "Token Auto Registration")
                                        } else if (imgSrcAutoToken) {
                                            imgSrcAutoToken = false
                                            D.Alert("Automatic registration of character tokens toggled OFF.", "!img toggle autotoken")
                                        }
                                    } else {
                                        if (imgSrcAutoToken) {
                                            imgSrcAutoToken = false
                                            D.Alert("Automatic registration of character tokens toggled OFF.", "!img toggle autotoken")
                                        } else {
                                            imgSrcAutoToken = true
                                            STATEREF.autoRegTokenNames = C.CHARACTERS
                                            if (VAL({number: args[0]}))
                                                STATEREF.autoRegTokenNames = STATEREF.autoRegTokenNames.slice(D.Int(args[0]))
                                            D.Alert(`Automatic registration of character tokens toggled ON.<br><br>Upload image for <b>${STATEREF.autoRegTokenNames[0]}"</b><br>... OR "!img toggle autotoken skip" to skip.`, "Token Auto Registration")
                                        }
                                    }
                                    break
                                }
                                default: {
                                    D.Alert("Must state either 'on', 'off', 'log', 'autosrc' or 'resize'.  <b>Syntax:</b><br><br><pre>!img toggle &lt;on/off&gt; &lt;hostnames&gt;</pre><br><pre>!img toggle log/resize</pre>", "MEDIA: !img toggle")
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
                                    D.Alert(`<b>IMAGE NAMES:</b><br><br>${D.JS(_.keys(REGISTRY.IMG))}`)
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
                                    D.Alert(D.JS(_.keys(REGISTRY.TEXT)), "!text get names")
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
                                        REGISTRY.TEXT[textKey].modes = REGISTRY.TEXT[textKey].modes || {}
                                        REGISTRY.TEXT[textKey].modes[mode] = REGISTRY.TEXT[textKey].modes[mode] || {}
                                        REGISTRY.TEXT[textKey].modes[mode][key] = {true: true, false: false, null: null, LAST: "LAST"}[val]
                                        D.Alert(`${mode} mode for ${textKey} set to ${D.JS(REGISTRY.TEXT[textKey].modes[mode])}`, "!text set mode")
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
                                        D.Alert(`Position Set for Text ${hostName}<br><br><pre>${D.JS(REGISTRY.TEXT[hostName])}</pre>`)
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
                                    for (const hostName of _.keys(REGISTRY.TEXT))
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
                                            REGISTRY.TEXT[getTextKey(textObj)].modes = textModes
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
                                case "alltext": {
                                    for (const hostName of _.keys(REGISTRY.TEXT))
                                        if (D.LCase(hostName).includes(D.LCase(args.join(" "))))
                                            removeText(hostName, true)
                                    break
                                }
                                default: {
                                    for (const textObj of textObjs) {
                                        const textData = getTextData(textObj)
                                        if (textData.shadowID) {
                                            const shadowObj = getObj("text", textData.shadowID)
                                            if (shadowObj)
                                                shadowObj.remove()
                                        }
                                        removeText(textObj, true)
                                    }
                                    args = msg.content.split(/\s+/u).slice(2)
                                    for (const arg of args)
                                        if (REGISTRY.TEXT[arg])
                                            delete REGISTRY.TEXT[arg]
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
                        case "get": {
                            D.Alert(D.JS(REGISTRY.ANIM[args.shift()]), "!anim get")
                            break
                        }
                        case "set": {
                            switch (D.LCase(call = args.shift())) {
                                case "timeout": {
                                    const hostName = getImgKey(imgObjs.shift()),
                                        timeOut = args.shift()
                                    if (VAL({string: hostName, number: timeOut}, "!anim set timeout")) {
                                        REGISTRY.ANIM[hostName].timeOut = D.Int(1000 * D.Float(timeOut))
                                        flashAnimation(hostName)
                                    }
                                    break
                                }
                                case "data": {
                                    const hostName = getImgKey(imgObjs.shift()),
                                        [minTime, maxTime, soundName, validModes] = args
                                    if (VAL({string: [hostName, soundName], number: [minTime, maxTime]}, "!anim set sound", true)) {
                                        setAnimData(hostName, minTime, maxTime, soundName === "x" ? null : soundName, validModes)
                                        D.Alert(D.JS(REGISTRY.ANIM[hostName]), "!anim set sound")
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
                        case "reg": case "register": {
                            const [soundName, volume, soundType, soundTags] = args
                            if (VAL({string: [soundName, volume, soundType]}, "!sound register", true)) 
                                regSound(soundName, D.Int(volume), soundType, (soundTags || "").split("|"))
                            else
                                D.Alert("<b>Syntax:</b><br>!sound reg (name) (volume) (type) (tag|tag)", "!sound register")
                            break
                        }
                        case "get": {
                            switch (D.LCase(call = args.shift())) {
                                case "playing": {
                                    Roll20AM.GetPlayingSounds()
                                    break
                                }
                                case "looping": {
                                    Roll20AM.GetLoopingSounds()
                                    break
                                }
                                // no default
                            }
                            break
                        }
                        case "set": {
                            switch (D.LCase(call = args.shift())) {
                                case "volume": case "vol": {
                                    const [soundName, volume] = args
                                    if (VAL({string: soundName, number: volume}, "!sound set volume"))
                                        Roll20AM.ChangeVolume(soundName, volume)
                                    break
                                }
                                case "trackmodes": {
                                    Roll20AM.SetPlaylistTrackModes(args.shift(), args.shift())
                                    break
                                }
                                // no default
                            }
                            break
                        }
                        case "play": {
                            startSound(args.shift(), undefined, undefined, true)
                            break
                        }
                        case "stop": {
                            stopSound(args.shift())
                            break
                        }
                        case "reset": {
                            switch (D.LCase(call = args.shift())) {
                                case "modes": {
                                    initSoundModes()
                                    break
                                }
                                // no default
                            }
                            break
                        }
                        case "fix": {
                            updateSounds()
                            break
                        }
                        case "stopall": {
                            STATEREF.isRunningSilent = true
                            Roll20AM.StopSound("all")
                            break
                        }
                        case "startall": {
                            STATEREF.isRunningSilent = false
                            Media.UpdateSoundscape()
                            break
                        }
                        case "test": {
                            switch(D.LCase(call = args.shift())) {
                                case "update": {
                                    updateSounds()
                                    break
                                }
                                case "playlist": {
                                    Roll20AM.GetPlaylist("MainScore")
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
            if (imgSrcAutoReg && STATEREF.autoRegSrcNames.length) {
                const hostName = imgSrcAutoReg,
                    srcName = STATEREF.autoRegSrcNames.shift()
                addImgSrc(imgObj, hostName, srcName)
                if (STATEREF.autoRegSrcNames.length) {
                    D.Alert(`Upload image for <b>${STATEREF.autoRegSrcNames[0]}</b>`, "Image Auto Registration")
                } else {
                    delete STATEREF.autoRegSrcNames
                    imgSrcAutoReg = false
                    D.Alert("Image auto registration complete!", "Image Auto Registration")
                }
                return true
            }
            if (imgSrcAutoToken) {
                if (imgSrcAddingProfilePic) {
                    const charObj = imgSrcAddingProfilePic
                    charObj.set("avatar", imgObj.get("imgsrc"))
                    imgSrcAddingProfilePic = false
                    if (STATEREF.autoRegTokenNames.length) {
                        D.Alert(`Upload token for <b>${STATEREF.autoRegTokenNames[0]}</b>`, "Token Auto Registration")
                    } else {
                        delete STATEREF.autoRegTokenNames
                        imgSrcAutoToken = false
                        D.Alert("Token auto registration complete!", "Token Auto Registration")
                    }
                    imgObj.remove()
                } else if (STATEREF.autoRegTokenNames.length) {
                    const charName = STATEREF.autoRegTokenNames.shift(),
                        charObj = D.GetChar(charName) || createObj("character", {
                            name: charName,
                            inplayerjournals: "all",
                            controlledby: D.GMID()
                        })
                    if (VAL({charObj})) {
                        imgObj.set({
                            height: 100,
                            width: 90,
                            represents: charObj.id,
                            name: charName
                        })
                        regToken(imgObj)
                        imgSrcAddingProfilePic = charObj
                        D.Alert(`Upload profile image for <b>${imgSrcAddingProfilePic.get("name")}</b>`, "Token Auto Registration")
                    } else {
                        imgSrcAddingProfilePic = false
                        D.Alert("Error uploading token image.", "Token Auto Registration")
                    }
                }
                return true
            }
            if (isRandomizerToken(imgObj))
                setRandomizerToken(imgObj)
            return true
        }
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    let [imgRecord, imgResize, imgSrcAutoReg, imgSrcAutoToken, imgSrcAddingProfilePic] = [false, false, false, false, false]
    const activeTimers = {},

    // #region CONFIGURATION
        REGISTRY = {
            get IMG() { return STATEREF.imgregistry }, set IMG(v) { STATEREF.imgregistry = v },
            get TEXT() { return STATEREF.textregistry }, set TEXT(v) { STATEREF.textregistry = v },
            get ANIM() { return STATEREF.animregistry }, set ANIM(v) { STATEREF.animregistry = v },
            get ID() { return STATEREF.idregistry }, set ID(v) { STATEREF.idregistry = v },
            get TOKEN() { return STATEREF.tokenregistry }, set TOKEN(v) { STATEREF.tokenregistry = v },
            get AREA() { return STATEREF.areas }, set AREA(v) { STATEREF.areas = v },
            get SOUND() { return STATEREF.soundregistry }, set SOUND(v) { STATEREF.soundregistry = v },
            get GRAPHIC() { return Object.assign({}, REGISTRY.ANIM, REGISTRY.IMG) }
        },
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
                "WeatherGlow",
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
                    WeatherClouds_1: 105,
                    WeatherGlow_1: 106
                },
                OtherOverlays: {
                    Spotlight_1: 117 
                },
                Banners: {
                    downtimeBanner_1: 107
                },
                DiceRoller: {
                    Frame: {
                        RollerFrame_Left_1: 151,
                        TopMids: {
                            RollerFrame_TopMid_1: 152,
                            RollerFrame_TopMid_2: 153,
                            RollerFrame_TopMid_3: 154,
                            RollerFrame_TopMid_4: 155,
                            RollerFrame_TopMid_5: 156,
                            RollerFrame_TopMid_6: 157,
                            RollerFrame_TopMid_7: 158,
                            RollerFrame_TopMid_8: 159,
                            RollerFrame_TopMid_9: 160
                        },
                        BottomMods: {                  
                            RollerFrame_BottomMid_1: 152,
                            RollerFrame_BottomMid_2: 153,
                            RollerFrame_BottomMid_3: 154,
                            RollerFrame_BottomMid_4: 155,
                            RollerFrame_BottomMid_5: 156,
                            RollerFrame_BottomMid_6: 157,
                            RollerFrame_BottomMid_7: 158,
                            RollerFrame_BottomMid_8: 159,
                            RollerFrame_BottomMid_9: 160
                        },
                        RollerFrame_TopEnd_1: 160,
                        RollerFrame_BottomEnd_1: 161,
                        RollerFrame_Diff_1: 165
                    },
                    RerollTrigger: {
                        wpRerollPlaceholder_1: 0
                    },
                    DiceList: {                        
                        RollerDie_Main_1: 199,
                        RollerDie_Main_2: 198,
                        RollerDie_Main_3: 197,
                        RollerDie_Main_4: 196,
                        RollerDie_Main_5: 195,
                        RollerDie_Main_6: 194,
                        RollerDie_Main_7: 193,
                        RollerDie_Main_8: 192,
                        RollerDie_Main_9: 191,
                        RollerDie_Main_10: 190,
                        RollerDie_Main_11: 189,
                        RollerDie_Main_12: 188,
                        RollerDie_Main_13: 187,
                        RollerDie_Main_14: 186,
                        RollerDie_Main_15: 185,
                        RollerDie_Main_16: 184,
                        RollerDie_Main_17: 183,
                        RollerDie_Main_18: 182,
                        RollerDie_Main_19: 181,
                        RollerDie_Main_20: 180,
                        RollerDie_Main_21: 179,
                        RollerDie_Main_22: 178,
                        RollerDie_Main_23: 177,
                        RollerDie_Main_24: 176,
                        RollerDie_Main_25: 175,
                        RollerDie_Main_26: 174,
                        RollerDie_Main_27: 173,
                        RollerDie_Main_28: 172,
                        RollerDie_Main_29: 171,
                        RollerDie_Main_30: 170
                    },
                    BigDice: {
                        RollerDie_Big_1: 199,
                        RollerDie_Big_2: 198
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
        getKey = (mediaRef, funcName = false) => {
            if (isRegText(mediaRef))
                return getTextKey(mediaRef, funcName)
            return getImgKey(mediaRef, funcName)
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
            return THROW(`Invalid Media Reference: ${D.JSL(mediaRef)}`, "getModeData")         
        },
        hasForcedState = (mediaRef) => {
            const mediaData = getModeData(mediaRef, Session.Mode)
            if (VAL({list: mediaData}, "hasForcedState"))
                return VAL({string: mediaData.isForcedState})
            return THROW(`Invalid Media Reference: ${D.JSL(mediaRef)}`, "hasForcedState")                  
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
            return THROW(`Invalid Media Reference: ${D.JSL(mediaRef)}`, "getModeStatus")      
        },
        getActiveLayer = mediaRef => {
            const mediaData = getData(mediaRef)
            if (VAL({list: mediaData}, "getActiveLayer"))
                return mediaData.activeLayer
            return THROW(`Invalid Media Reference: ${D.JSL(mediaRef)}`, "getActiveLayer")
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
                DB(`Updating '${D.JSL(mediaRef)}'. ModeStatus: ${D.JSL(modeStatus)}`, "modeUpdate")
                if(VAL({list: modeStatus}, "modeUpdate")) {
                    const lastMode = textData.curMode
                    if (lastMode) {
                        REGISTRY.TEXT[textKey].modes[lastMode].lastActive = textData.isActive
                        REGISTRY.TEXT[textKey].modes[lastMode].lastState = textData.isActive && (_.isString(textData.activeText) && textData.activeText || textData.curText) || REGISTRY.TEXT[textKey].modes[lastMode].lastState
                    }
                    REGISTRY.TEXT[textKey].curMode = Session.Mode
                    if (!_.isUndefined(modeStatus.isActive)) {
                        DB(`... IsActive OK! toggleText(${D.JSL(textKey)}, ${D.JSL(modeStatus.isActive)})`, "modeUpdate")
                        toggleText(textKey, modeStatus.isActive)
                    }                    
                    if (!_.isUndefined(modeStatus.state)) {
                        DB(`... State OK! setText(${D.JSL(textKey)}, ${D.JSL(modeStatus.state)})`, "modeUpdate")
                        setText(textKey, modeStatus.state)
                    }                    
                }
            } else {
                const imgData = getImgData(mediaRef),
                    mediaKey = imgData.name,
                    modeStatus = getModeStatus(mediaKey)
                DB(`Updating '${D.JSL(mediaRef)}'. ModeStatus: ${D.JSL(modeStatus)}`, "modeUpdate")
                if(VAL({list: modeStatus}, "modeUpdate")) {
                    const lastMode = imgData.curMode
                    if (lastMode) {
                        REGISTRY.IMG[mediaKey].modes[lastMode].lastActive = imgData.isActive
                        REGISTRY.IMG[mediaKey].modes[lastMode].lastState = imgData.isActive && imgData.activeSrc || REGISTRY.IMG[mediaKey].modes[lastMode].lastState
                    }
                    REGISTRY.IMG[mediaKey].curMode = Session.Mode
                    if (!_.isUndefined(modeStatus.isActive)) {
                        DB(`... IsActive OK! toggleImg(${D.JSL(mediaKey)}, ${D.JSL(modeStatus.isActive)})`, "modeUpdate")
                        toggleImg(mediaKey, modeStatus.isActive)
                    }                    
                    if (!_.isUndefined(modeStatus.state)) {
                        DB(`... State OK! setImg(${D.JSL(mediaKey)}, ${D.JSL(modeStatus.state)})`, "modeUpdate")
                        setImg(mediaKey, modeStatus.state)
                    }                    
                }
            }
        },
        setActiveLayers = (isOverridingStartActive = true) => {
            // NEEDS TO HANDLE MODES IN HERE
            const returnStrings = []
            for (const imgData of _.values(REGISTRY.IMG)) {
                const imgObj = getImgObj(imgData.id)
                if (imgObj) {
                    const targetLayer = isOverridingStartActive || imgData.startActive ? imgData.activeLayer : "walls"
                    if (targetLayer !== imgObj.get("layer"))
                        imgObj.set("layer", targetLayer)
                } else if (!imgData.name.includes("Token")) {
                    returnStrings.push(`No image Object Found for '${imgData.name}'`)
                }
            }
            for (const textData of _.values(REGISTRY.TEXT)) {
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
                    if (REGISTRY.IMG[x[1]]) 
                        [,,REGISTRY.IMG[x[1]].zIndex] = x
                    else if (REGISTRY.ANIM[x[1]])
                        [,,REGISTRY.ANIM[x[1]].zIndex] = x
                    else
                        return false // THROW(`No image Registered for ZIndex Entry '${x[1]}'`, "setZIndices")
                    return REGISTRY.IMG[x[1]] || REGISTRY.ANIM[x[1]]
                }))
                allImgDatas.push(..._.compact(imgDatas))
            }
            sortedMediaObjs.push(..._.compact(_.keys(REGISTRY.TEXT).map(x => getTextObj(x) || null)))
            sortedMediaObjs.push(..._.compact(_.keys(REGISTRY.TEXT).filter(x => REGISTRY.TEXT[x].shadowID).map(x => getObj("text", REGISTRY.TEXT[x].shadowID) || null)))
            sortedMediaObjs.push(..._.compact(_.flatten(allImgDatas.filter(x => x.padID).sort((a,b) => b.zIndex - a.zIndex).map(x => [getObj("graphic", x.padID), getObj("graphic", x.partnerID)]))))
            sortedMediaObjs.push(..._.compact(allImgDatas.sort((a,b) => b.zIndex - a.zIndex).map(x => getImgObj(x.id) || null)))
            for (let i = 0; i < sortedMediaObjs.length; i++)
                toBack(sortedMediaObjs[i])
        },
        switchMode = () => {
            for (const mediaKey of [..._.keys(REGISTRY.IMG), ..._.keys(REGISTRY.TEXT)])
                modeUpdate(mediaKey)
        },
        resetModes = () => {
            // ^([^.]+)\.([^.\n=]+)\.([^.\n=]+)\.([^.\n=]+)\.([^.\n=]+) = (.*)
            // ["$1", "$2", "$3", "$4", "$5", $6],

            // isActive, curSrc, activeSrc, curText
            const modeData = [
                ["IMG", "AirLightCN_4", "isActive", true],
                ["IMG", "AirLightCN_5", "isActive", true],
                ["IMG", "AirLightLeft_1", "isActive", true],
                ["IMG", "AirLightMid_1", "isActive", true],
                ["IMG", "AirLightTop_1", "isActive", true],
                ["IMG", "AvaWongToken_1", "isActive", true],
                ["IMG", "compCardSpot_1", "isActive", false],
                ["IMG", "compCardSpot_10", "isActive", false],
                ["IMG", "compCardSpot_2", "isActive", false],
                ["IMG", "compCardSpot_3", "isActive", false],
                ["IMG", "compCardSpot_4", "isActive", false],
                ["IMG", "compCardSpot_5", "isActive", false],
                ["IMG", "compCardSpot_6", "isActive", false],
                ["IMG", "compCardSpot_7", "isActive", false],
                ["IMG", "compCardSpot_8", "isActive", false],
                ["IMG", "compCardSpot_9", "isActive", false],
                ["IMG", "complicationEnhanced_1", "isActive", false],
                ["IMG", "complicationEnhanced_10", "isActive", false],
                ["IMG", "complicationEnhanced_2", "isActive", false],
                ["IMG", "complicationEnhanced_3", "isActive", false],
                ["IMG", "complicationEnhanced_4", "isActive", false],
                ["IMG", "complicationEnhanced_5", "isActive", false],
                ["IMG", "complicationEnhanced_6", "isActive", false],
                ["IMG", "complicationEnhanced_7", "isActive", false],
                ["IMG", "complicationEnhanced_8", "isActive", false],
                ["IMG", "complicationEnhanced_9", "isActive", false],
                ["IMG", "ComplicationMat_1", "isActive", false],
                ["IMG", "complicationZero_1", "isActive", false],
                ["IMG", "complicationZero_10", "isActive", false],
                ["IMG", "complicationZero_2", "isActive", false],
                ["IMG", "complicationZero_3", "isActive", false],
                ["IMG", "complicationZero_4", "isActive", false],
                ["IMG", "complicationZero_5", "isActive", false],
                ["IMG", "complicationZero_6", "isActive", false],
                ["IMG", "complicationZero_7", "isActive", false],
                ["IMG", "complicationZero_8", "isActive", false],
                ["IMG", "complicationZero_9", "isActive", false],
                ["IMG", "DistrictCenter_1", "isActive", false],
                ["IMG", "DistrictLeft_1", "isActive", false],
                ["IMG", "DistrictRight_1", "isActive", false],
                ["IMG", "downtimeBanner_1", "isActive", false],
                ["IMG", ["Dr.ArthurRoyToken_1"], "isActive", true],
                ["IMG", "Horizon_1", "isActive", true],
                ["IMG", "HungerBotLeft_1", "isActive", true],
                ["IMG", "HungerBotRight_1", "isActive", true],
                ["IMG", "HungerTopLeft_1", "isActive", true],
                ["IMG", "HungerTopRight_1", "isActive", true],
                ["IMG", "JohannesNapierToken_1", "isActive", true],
                ["IMG", "LockeUlrichToken_1", "isActive", true],
                ["IMG", "mapButtonAutarkis_1", "isActive", true],
                ["IMG", "mapButtonDistricts_1", "isActive", true],
                ["IMG", "mapButtonDomain_1", "isActive", true],
                ["IMG", "mapButtonParks_1", "isActive", true],
                ["IMG", "mapButtonRack_1", "isActive", true],
                ["IMG", "mapButtonRoads_1", "isActive", true],
                ["IMG", "mapButtonSitesCulture_1", "isActive", true],
                ["IMG", "mapButtonSitesEducation_1", "isActive", true],
                ["IMG", "mapButtonSitesHavens_1", "isActive", true],
                ["IMG", "mapButtonSitesHealth_1", "isActive", true],
                ["IMG", "mapButtonSitesLandmarks_1", "isActive", true],
                ["IMG", "mapButtonSitesNightlife_1", "isActive", true],
                ["IMG", "mapButtonSitesShopping_1", "isActive", true],
                ["IMG", "mapButtonSitesTransportation_1", "isActive", true],
                ["IMG", "RollerDie_Big_1", "isActive", false],
                ["IMG", "RollerDie_Big_2", "isActive", false],
                ["IMG", "RollerDie_Main_1", "isActive", false],
                ["IMG", "RollerDie_Main_10", "isActive", false],
                ["IMG", "RollerDie_Main_11", "isActive", false],
                ["IMG", "RollerDie_Main_12", "isActive", false],
                ["IMG", "RollerDie_Main_13", "isActive", false],
                ["IMG", "RollerDie_Main_14", "isActive", false],
                ["IMG", "RollerDie_Main_15", "isActive", false],
                ["IMG", "RollerDie_Main_16", "isActive", false],
                ["IMG", "RollerDie_Main_17", "isActive", false],
                ["IMG", "RollerDie_Main_18", "isActive", false],
                ["IMG", "RollerDie_Main_19", "isActive", false],
                ["IMG", "RollerDie_Main_2", "isActive", false],
                ["IMG", "RollerDie_Main_20", "isActive", false],
                ["IMG", "RollerDie_Main_21", "isActive", false],
                ["IMG", "RollerDie_Main_22", "isActive", false],
                ["IMG", "RollerDie_Main_23", "isActive", false],
                ["IMG", "RollerDie_Main_24", "isActive", false],
                ["IMG", "RollerDie_Main_25", "isActive", false],
                ["IMG", "RollerDie_Main_26", "isActive", false],
                ["IMG", "RollerDie_Main_27", "isActive", false],
                ["IMG", "RollerDie_Main_28", "isActive", false],
                ["IMG", "RollerDie_Main_29", "isActive", false],
                ["IMG", "RollerDie_Main_3", "isActive", false],
                ["IMG", "RollerDie_Main_30", "isActive", false],
                ["IMG", "RollerDie_Main_4", "isActive", false],
                ["IMG", "RollerDie_Main_5", "isActive", false],
                ["IMG", "RollerDie_Main_6", "isActive", false],
                ["IMG", "RollerDie_Main_7", "isActive", false],
                ["IMG", "RollerDie_Main_8", "isActive", false],
                ["IMG", "RollerDie_Main_9", "isActive", false],
                ["IMG", "RollerFrame_BottomEnd_1", "isActive", true],
                ["IMG", "RollerFrame_BottomMid_1", "isActive", false],
                ["IMG", "RollerFrame_BottomMid_2", "isActive", false],
                ["IMG", "RollerFrame_BottomMid_3", "isActive", false],
                ["IMG", "RollerFrame_BottomMid_4", "isActive", false],
                ["IMG", "RollerFrame_BottomMid_5", "isActive", false],
                ["IMG", "RollerFrame_BottomMid_6", "isActive", false],
                ["IMG", "RollerFrame_BottomMid_7", "isActive", false],
                ["IMG", "RollerFrame_BottomMid_8", "isActive", false],
                ["IMG", "RollerFrame_BottomMid_9", "isActive", false],
                ["IMG", "RollerFrame_Diff_1", "isActive", false],
                ["IMG", "RollerFrame_Left_1", "isActive", true],
                ["IMG", "RollerFrame_TopEnd_1", "isActive", true],
                ["IMG", "RollerFrame_TopMid_1", "isActive", false],
                ["IMG", "RollerFrame_TopMid_2", "isActive", false],
                ["IMG", "RollerFrame_TopMid_3", "isActive", false],
                ["IMG", "RollerFrame_TopMid_4", "isActive", false],
                ["IMG", "RollerFrame_TopMid_5", "isActive", false],
                ["IMG", "RollerFrame_TopMid_6", "isActive", false],
                ["IMG", "RollerFrame_TopMid_7", "isActive", false],
                ["IMG", "RollerFrame_TopMid_8", "isActive", false],
                ["IMG", "RollerFrame_TopMid_9", "isActive", false],
                ["IMG", "SignalLightBotLeft_1", "isActive", true],
                ["IMG", "SignalLightBotRight_1", "isActive", true],
                ["IMG", "SignalLightTopLeft_1", "isActive", true],
                ["IMG", "SignalLightTopRight_1", "isActive", true],
                ["IMG", "SiteBarCenter_1", "isActive", false],
                ["IMG", "SiteBarLeft_1", "isActive", false],
                ["IMG", "SiteBarRight_1", "isActive", false],
                ["IMG", "SiteCenter_1", "isActive", false],
                ["IMG", "SiteLeft_1", "isActive", false],
                ["IMG", "SiteRight_1", "isActive", false],
                ["IMG", "stakedAdvantagesHeader_1", "isActive", true],
                ["IMG", "TorontoMap_1", "isActive", true],
                ["IMG", "SubLocLeft", "isActive", false],
                ["IMG", "SubLocTopLeft", "isActive", false],
                ["IMG", "SubLocBotLeft", "isActive", false],
                ["IMG", "SubLocRight", "isActive", false],
                ["IMG", "SubLocTopRight", "isActive", false],
                ["IMG", "SubLocBotRight", "isActive", false],
                ["IMG", "TorontoMapAutarkisOverlay_1", "isActive", true],
                ["IMG", "TorontoMapDistrictsOverlay_1", "isActive", true],
                ["IMG", "TorontoMapDomainOverlay_1", "isActive", true],
                ["IMG", "TorontoMapParksOverlay_1", "isActive", true],
                ["IMG", "TorontoMapRackOverlay_1", "isActive", true],
                ["IMG", "TorontoMapRoadsOverlay_1", "isActive", true],
                ["IMG", "TorontoMapSitesCultureOverlay_1", "isActive", true],
                ["IMG", "TorontoMapSitesEducationOverlay_1", "isActive", true],
                ["IMG", "TorontoMapSitesHavensOverlay_1", "isActive", true],
                ["IMG", "TorontoMapSitesHealthOverlay_1", "isActive", true],
                ["IMG", "TorontoMapSitesLandmarksOverlay_1", "isActive", true],
                ["IMG", "TorontoMapSitesNightlifeOverlay_1", "isActive", true],
                ["IMG", "TorontoMapSitesShoppingOverlay_1", "isActive", true],
                ["IMG", "TorontoMapSitesTransportationOverlay_1", "isActive", true],
                ["IMG", "WeatherClouds_1", "isActive", false],
                ["IMG", "WeatherGlow_1", "isActive", false],
                ["IMG", "WeatherFog_1", "isActive", false],
                ["IMG", "WeatherFrost_1", "isActive", false],
                ["IMG", "WeatherGround_1", "isActive", false],
                ["IMG", "WeatherMain_1", "isActive", false],
                ["IMG", "weeklyResourcesHeader_1", "isActive", true],
                ["IMG", "wpRerollPlaceholder_1", "isActive", true],
                ["IMG", "AirLightCN_4", "modes", "Active", "lastActive", true],
                ["IMG", "AirLightCN_5", "modes", "Active", "lastActive", true],
                ["IMG", "AirLightLeft_1", "modes", "Active", "lastActive", true],
                ["IMG", "AirLightMid_1", "modes", "Active", "lastActive", true],
                ["IMG", "AirLightTop_1", "modes", "Active", "lastActive", true],
                ["IMG", "AvaWongToken_1", "modes", "Active", "lastActive", true],
                ["IMG", "compCardSpot_1", "modes", "Active", "lastActive", false],
                ["IMG", "compCardSpot_10", "modes", "Active", "lastActive", false],
                ["IMG", "compCardSpot_2", "modes", "Active", "lastActive", false],
                ["IMG", "compCardSpot_3", "modes", "Active", "lastActive", false],
                ["IMG", "compCardSpot_4", "modes", "Active", "lastActive", false],
                ["IMG", "compCardSpot_5", "modes", "Active", "lastActive", false],
                ["IMG", "compCardSpot_6", "modes", "Active", "lastActive", false],
                ["IMG", "compCardSpot_7", "modes", "Active", "lastActive", false],
                ["IMG", "compCardSpot_8", "modes", "Active", "lastActive", false],
                ["IMG", "compCardSpot_9", "modes", "Active", "lastActive", false],
                ["IMG", "complicationEnhanced_1", "modes", "Active", "lastActive", false],
                ["IMG", "complicationEnhanced_10", "modes", "Active", "lastActive", false],
                ["IMG", "complicationEnhanced_2", "modes", "Active", "lastActive", false],
                ["IMG", "complicationEnhanced_3", "modes", "Active", "lastActive", false],
                ["IMG", "complicationEnhanced_4", "modes", "Active", "lastActive", false],
                ["IMG", "complicationEnhanced_5", "modes", "Active", "lastActive", false],
                ["IMG", "complicationEnhanced_6", "modes", "Active", "lastActive", false],
                ["IMG", "complicationEnhanced_7", "modes", "Active", "lastActive", false],
                ["IMG", "complicationEnhanced_8", "modes", "Active", "lastActive", false],
                ["IMG", "complicationEnhanced_9", "modes", "Active", "lastActive", false],
                ["IMG", "ComplicationMat_1", "modes", "Active", "lastActive", false],
                ["IMG", "complicationZero_1", "modes", "Active", "lastActive", false],
                ["IMG", "complicationZero_10", "modes", "Active", "lastActive", false],
                ["IMG", "complicationZero_2", "modes", "Active", "lastActive", false],
                ["IMG", "complicationZero_3", "modes", "Active", "lastActive", false],
                ["IMG", "complicationZero_4", "modes", "Active", "lastActive", false],
                ["IMG", "complicationZero_5", "modes", "Active", "lastActive", false],
                ["IMG", "complicationZero_6", "modes", "Active", "lastActive", false],
                ["IMG", "complicationZero_7", "modes", "Active", "lastActive", false],
                ["IMG", "complicationZero_8", "modes", "Active", "lastActive", false],
                ["IMG", "complicationZero_9", "modes", "Active", "lastActive", false],
                ["IMG", "DistrictCenter_1", "modes", "Active", "lastActive", false],
                ["IMG", "DistrictLeft_1", "modes", "Active", "lastActive", false],
                ["IMG", "DistrictRight_1", "modes", "Active", "lastActive", false],
                ["IMG", "downtimeBanner_1", "modes", "Active", "lastActive", false],
                ["IMG", ["Dr.ArthurRoyToken_1"], "modes", "Active", "lastActive", true],
                ["IMG", "Horizon_1", "modes", "Active", "lastActive", true],
                ["IMG", "HungerBotLeft_1", "modes", "Active", "lastActive", true],
                ["IMG", "HungerBotRight_1", "modes", "Active", "lastActive", true],
                ["IMG", "HungerTopLeft_1", "modes", "Active", "lastActive", true],
                ["IMG", "HungerTopRight_1", "modes", "Active", "lastActive", true],
                ["IMG", "JohannesNapierToken_1", "modes", "Active", "lastActive", true],
                ["IMG", "LockeUlrichToken_1", "modes", "Active", "lastActive", true],
                ["IMG", "mapButtonAutarkis_1", "modes", "Active", "lastActive", true],
                ["IMG", "mapButtonDistricts_1", "modes", "Active", "lastActive", true],
                ["IMG", "mapButtonDomain_1", "modes", "Active", "lastActive", true],
                ["IMG", "mapButtonParks_1", "modes", "Active", "lastActive", true],
                ["IMG", "mapButtonRack_1", "modes", "Active", "lastActive", true],
                ["IMG", "mapButtonRoads_1", "modes", "Active", "lastActive", true],
                ["IMG", "mapButtonSitesCulture_1", "modes", "Active", "lastActive", true],
                ["IMG", "mapButtonSitesEducation_1", "modes", "Active", "lastActive", true],
                ["IMG", "mapButtonSitesHavens_1", "modes", "Active", "lastActive", true],
                ["IMG", "mapButtonSitesHealth_1", "modes", "Active", "lastActive", true],
                ["IMG", "mapButtonSitesLandmarks_1", "modes", "Active", "lastActive", true],
                ["IMG", "mapButtonSitesNightlife_1", "modes", "Active", "lastActive", true],
                ["IMG", "mapButtonSitesShopping_1", "modes", "Active", "lastActive", true],
                ["IMG", "mapButtonSitesTransportation_1", "modes", "Active", "lastActive", true],
                ["IMG", "RollerDie_Big_1", "modes", "Active", "lastActive", false],
                ["IMG", "RollerDie_Big_2", "modes", "Active", "lastActive", false],
                ["IMG", "RollerDie_Main_1", "modes", "Active", "lastActive", false],
                ["IMG", "RollerDie_Main_10", "modes", "Active", "lastActive", false],
                ["IMG", "RollerDie_Main_11", "modes", "Active", "lastActive", false],
                ["IMG", "RollerDie_Main_12", "modes", "Active", "lastActive", false],
                ["IMG", "RollerDie_Main_13", "modes", "Active", "lastActive", false],
                ["IMG", "RollerDie_Main_14", "modes", "Active", "lastActive", false],
                ["IMG", "RollerDie_Main_15", "modes", "Active", "lastActive", false],
                ["IMG", "RollerDie_Main_16", "modes", "Active", "lastActive", false],
                ["IMG", "RollerDie_Main_17", "modes", "Active", "lastActive", false],
                ["IMG", "RollerDie_Main_18", "modes", "Active", "lastActive", false],
                ["IMG", "RollerDie_Main_19", "modes", "Active", "lastActive", false],
                ["IMG", "RollerDie_Main_2", "modes", "Active", "lastActive", false],
                ["IMG", "RollerDie_Main_20", "modes", "Active", "lastActive", false],
                ["IMG", "RollerDie_Main_21", "modes", "Active", "lastActive", false],
                ["IMG", "RollerDie_Main_22", "modes", "Active", "lastActive", false],
                ["IMG", "RollerDie_Main_23", "modes", "Active", "lastActive", false],
                ["IMG", "RollerDie_Main_24", "modes", "Active", "lastActive", false],
                ["IMG", "RollerDie_Main_25", "modes", "Active", "lastActive", false],
                ["IMG", "RollerDie_Main_26", "modes", "Active", "lastActive", false],
                ["IMG", "RollerDie_Main_27", "modes", "Active", "lastActive", false],
                ["IMG", "RollerDie_Main_28", "modes", "Active", "lastActive", false],
                ["IMG", "RollerDie_Main_29", "modes", "Active", "lastActive", false],
                ["IMG", "RollerDie_Main_3", "modes", "Active", "lastActive", false],
                ["IMG", "RollerDie_Main_30", "modes", "Active", "lastActive", false],
                ["IMG", "RollerDie_Main_4", "modes", "Active", "lastActive", false],
                ["IMG", "RollerDie_Main_5", "modes", "Active", "lastActive", false],
                ["IMG", "RollerDie_Main_6", "modes", "Active", "lastActive", false],
                ["IMG", "RollerDie_Main_7", "modes", "Active", "lastActive", false],
                ["IMG", "RollerDie_Main_8", "modes", "Active", "lastActive", false],
                ["IMG", "RollerDie_Main_9", "modes", "Active", "lastActive", false],
                ["IMG", "RollerFrame_BottomEnd_1", "modes", "Active", "lastActive", true],
                ["IMG", "RollerFrame_BottomMid_1", "modes", "Active", "lastActive", false],
                ["IMG", "RollerFrame_BottomMid_2", "modes", "Active", "lastActive", false],
                ["IMG", "RollerFrame_BottomMid_3", "modes", "Active", "lastActive", false],
                ["IMG", "RollerFrame_BottomMid_4", "modes", "Active", "lastActive", false],
                ["IMG", "RollerFrame_BottomMid_5", "modes", "Active", "lastActive", false],
                ["IMG", "RollerFrame_BottomMid_6", "modes", "Active", "lastActive", false],
                ["IMG", "RollerFrame_BottomMid_7", "modes", "Active", "lastActive", false],
                ["IMG", "RollerFrame_BottomMid_8", "modes", "Active", "lastActive", false],
                ["IMG", "RollerFrame_BottomMid_9", "modes", "Active", "lastActive", false],
                ["IMG", "RollerFrame_Diff_1", "modes", "Active", "lastActive", false],
                ["IMG", "RollerFrame_Left_1", "modes", "Active", "lastActive", true],
                ["IMG", "RollerFrame_TopEnd_1", "modes", "Active", "lastActive", true],
                ["IMG", "RollerFrame_TopMid_1", "modes", "Active", "lastActive", false],
                ["IMG", "RollerFrame_TopMid_2", "modes", "Active", "lastActive", false],
                ["IMG", "RollerFrame_TopMid_3", "modes", "Active", "lastActive", false],
                ["IMG", "RollerFrame_TopMid_4", "modes", "Active", "lastActive", false],
                ["IMG", "RollerFrame_TopMid_5", "modes", "Active", "lastActive", false],
                ["IMG", "RollerFrame_TopMid_6", "modes", "Active", "lastActive", false],
                ["IMG", "RollerFrame_TopMid_7", "modes", "Active", "lastActive", false],
                ["IMG", "RollerFrame_TopMid_8", "modes", "Active", "lastActive", false],
                ["IMG", "RollerFrame_TopMid_9", "modes", "Active", "lastActive", false],
                ["IMG", "SignalLightBotLeft_1", "modes", "Active", "lastActive", true],
                ["IMG", "SignalLightBotRight_1", "modes", "Active", "lastActive", true],
                ["IMG", "SignalLightTopLeft_1", "modes", "Active", "lastActive", true],
                ["IMG", "SignalLightTopRight_1", "modes", "Active", "lastActive", true],
                ["IMG", "SiteBarCenter_1", "modes", "Active", "lastActive", false],
                ["IMG", "SiteBarLeft_1", "modes", "Active", "lastActive", false],
                ["IMG", "SiteBarRight_1", "modes", "Active", "lastActive", false],
                ["IMG", "SiteCenter_1", "modes", "Active", "lastActive", false],
                ["IMG", "SiteLeft_1", "modes", "Active", "lastActive", false],
                ["IMG", "SiteRight_1", "modes", "Active", "lastActive", false],
                ["IMG", "stakedAdvantagesHeader_1", "modes", "Active", "lastActive", true],
                ["IMG", "TorontoMap_1", "modes", "Active", "lastActive", true],
                ["IMG", "SubLocLeft", "modes", "Active", "lastActive", false],
                ["IMG", "SubLocTopLeft", "modes", "Active", "lastActive", false],
                ["IMG", "SubLocBotLeft", "modes", "Active", "lastActive", false],
                ["IMG", "SubLocRight", "modes", "Active", "lastActive", false],
                ["IMG", "SubLocTopRight", "modes", "Active", "lastActive", false],
                ["IMG", "SubLocBotRight", "modes", "Active", "lastActive", false],
                ["IMG", "TorontoMapAutarkisOverlay_1", "modes", "Active", "lastActive", true],
                ["IMG", "TorontoMapDistrictsOverlay_1", "modes", "Active", "lastActive", true],
                ["IMG", "TorontoMapDomainOverlay_1", "modes", "Active", "lastActive", true],
                ["IMG", "TorontoMapParksOverlay_1", "modes", "Active", "lastActive", true],
                ["IMG", "TorontoMapRackOverlay_1", "modes", "Active", "lastActive", true],
                ["IMG", "TorontoMapRoadsOverlay_1", "modes", "Active", "lastActive", true],
                ["IMG", "TorontoMapSitesCultureOverlay_1", "modes", "Active", "lastActive", true],
                ["IMG", "TorontoMapSitesEducationOverlay_1", "modes", "Active", "lastActive", true],
                ["IMG", "TorontoMapSitesHavensOverlay_1", "modes", "Active", "lastActive", true],
                ["IMG", "TorontoMapSitesHealthOverlay_1", "modes", "Active", "lastActive", true],
                ["IMG", "TorontoMapSitesLandmarksOverlay_1", "modes", "Active", "lastActive", true],
                ["IMG", "TorontoMapSitesNightlifeOverlay_1", "modes", "Active", "lastActive", true],
                ["IMG", "TorontoMapSitesShoppingOverlay_1", "modes", "Active", "lastActive", true],
                ["IMG", "TorontoMapSitesTransportationOverlay_1", "modes", "Active", "lastActive", true],
                ["IMG", "WeatherClouds_1", "modes", "Active", "lastActive", false],
                ["IMG", "WeatherGlow_1", "modes", "Active", "lastActive", false],
                ["IMG", "WeatherFog_1", "modes", "Active", "lastActive", false],
                ["IMG", "WeatherFrost_1", "modes", "Active", "lastActive", false],
                ["IMG", "WeatherGround_1", "modes", "Active", "lastActive", false],
                ["IMG", "WeatherMain_1", "modes", "Active", "lastActive", false],
                ["IMG", "weeklyResourcesHeader_1", "modes", "Active", "lastActive", true],
                ["IMG", "wpRerollPlaceholder_1", "modes", "Active", "lastActive", true],
                ["IMG", "AirLightCN_4", "modes", "Active", "lastState", true],
                ["IMG", "AirLightCN_5", "modes", "Active", "lastState", true],
                ["IMG", "AirLightLeft_1", "modes", "Active", "lastState", true],
                ["IMG", "AirLightMid_1", "modes", "Active", "lastState", true],
                ["IMG", "AirLightTop_1", "modes", "Active", "lastState", true],
                ["IMG", "AvaWongToken_1", "modes", "Active", "lastState", true],
                ["IMG", "compCardSpot_1", "modes", "Active", "lastState", false],
                ["IMG", "compCardSpot_10", "modes", "Active", "lastState", false],
                ["IMG", "compCardSpot_2", "modes", "Active", "lastState", false],
                ["IMG", "compCardSpot_3", "modes", "Active", "lastState", false],
                ["IMG", "compCardSpot_4", "modes", "Active", "lastState", false],
                ["IMG", "compCardSpot_5", "modes", "Active", "lastState", false],
                ["IMG", "compCardSpot_6", "modes", "Active", "lastState", false],
                ["IMG", "compCardSpot_7", "modes", "Active", "lastState", false],
                ["IMG", "compCardSpot_8", "modes", "Active", "lastState", false],
                ["IMG", "compCardSpot_9", "modes", "Active", "lastState", false],
                ["IMG", "complicationEnhanced_1", "modes", "Active", "lastState", false],
                ["IMG", "complicationEnhanced_10", "modes", "Active", "lastState", false],
                ["IMG", "complicationEnhanced_2", "modes", "Active", "lastState", false],
                ["IMG", "complicationEnhanced_3", "modes", "Active", "lastState", false],
                ["IMG", "complicationEnhanced_4", "modes", "Active", "lastState", false],
                ["IMG", "complicationEnhanced_5", "modes", "Active", "lastState", false],
                ["IMG", "complicationEnhanced_6", "modes", "Active", "lastState", false],
                ["IMG", "complicationEnhanced_7", "modes", "Active", "lastState", false],
                ["IMG", "complicationEnhanced_8", "modes", "Active", "lastState", false],
                ["IMG", "complicationEnhanced_9", "modes", "Active", "lastState", false],
                ["IMG", "ComplicationMat_1", "modes", "Active", "lastState", false],
                ["IMG", "complicationZero_1", "modes", "Active", "lastState", false],
                ["IMG", "complicationZero_10", "modes", "Active", "lastState", false],
                ["IMG", "complicationZero_2", "modes", "Active", "lastState", false],
                ["IMG", "complicationZero_3", "modes", "Active", "lastState", false],
                ["IMG", "complicationZero_4", "modes", "Active", "lastState", false],
                ["IMG", "complicationZero_5", "modes", "Active", "lastState", false],
                ["IMG", "complicationZero_6", "modes", "Active", "lastState", false],
                ["IMG", "complicationZero_7", "modes", "Active", "lastState", false],
                ["IMG", "complicationZero_8", "modes", "Active", "lastState", false],
                ["IMG", "complicationZero_9", "modes", "Active", "lastState", false],
                ["IMG", "DistrictCenter_1", "modes", "Active", "lastState", false],
                ["IMG", "DistrictLeft_1", "modes", "Active", "lastState", false],
                ["IMG", "DistrictRight_1", "modes", "Active", "lastState", false],
                ["IMG", "downtimeBanner_1", "modes", "Active", "lastState", false],
                ["IMG", ["Dr.ArthurRoyToken_1"], "modes", "Active", "lastState", true],
                ["IMG", "Horizon_1", "modes", "Active", "lastState", true],
                ["IMG", "HungerBotLeft_1", "modes", "Active", "lastState", true],
                ["IMG", "HungerBotRight_1", "modes", "Active", "lastState", true],
                ["IMG", "HungerTopLeft_1", "modes", "Active", "lastState", true],
                ["IMG", "HungerTopRight_1", "modes", "Active", "lastState", true],
                ["IMG", "JohannesNapierToken_1", "modes", "Active", "lastState", true],
                ["IMG", "LockeUlrichToken_1", "modes", "Active", "lastState", true],
                ["IMG", "mapButtonAutarkis_1", "modes", "Active", "lastState", true],
                ["IMG", "mapButtonDistricts_1", "modes", "Active", "lastState", true],
                ["IMG", "mapButtonDomain_1", "modes", "Active", "lastState", true],
                ["IMG", "mapButtonParks_1", "modes", "Active", "lastState", true],
                ["IMG", "mapButtonRack_1", "modes", "Active", "lastState", true],
                ["IMG", "mapButtonRoads_1", "modes", "Active", "lastState", true],
                ["IMG", "mapButtonSitesCulture_1", "modes", "Active", "lastState", true],
                ["IMG", "mapButtonSitesEducation_1", "modes", "Active", "lastState", true],
                ["IMG", "mapButtonSitesHavens_1", "modes", "Active", "lastState", true],
                ["IMG", "mapButtonSitesHealth_1", "modes", "Active", "lastState", true],
                ["IMG", "mapButtonSitesLandmarks_1", "modes", "Active", "lastState", true],
                ["IMG", "mapButtonSitesNightlife_1", "modes", "Active", "lastState", true],
                ["IMG", "mapButtonSitesShopping_1", "modes", "Active", "lastState", true],
                ["IMG", "mapButtonSitesTransportation_1", "modes", "Active", "lastState", true],
                ["IMG", "RollerDie_Big_1", "modes", "Active", "lastState", false],
                ["IMG", "RollerDie_Big_2", "modes", "Active", "lastState", false],
                ["IMG", "RollerDie_Main_1", "modes", "Active", "lastState", false],
                ["IMG", "RollerDie_Main_10", "modes", "Active", "lastState", false],
                ["IMG", "RollerDie_Main_11", "modes", "Active", "lastState", false],
                ["IMG", "RollerDie_Main_12", "modes", "Active", "lastState", false],
                ["IMG", "RollerDie_Main_13", "modes", "Active", "lastState", false],
                ["IMG", "RollerDie_Main_14", "modes", "Active", "lastState", false],
                ["IMG", "RollerDie_Main_15", "modes", "Active", "lastState", false],
                ["IMG", "RollerDie_Main_16", "modes", "Active", "lastState", false],
                ["IMG", "RollerDie_Main_17", "modes", "Active", "lastState", false],
                ["IMG", "RollerDie_Main_18", "modes", "Active", "lastState", false],
                ["IMG", "RollerDie_Main_19", "modes", "Active", "lastState", false],
                ["IMG", "RollerDie_Main_2", "modes", "Active", "lastState", false],
                ["IMG", "RollerDie_Main_20", "modes", "Active", "lastState", false],
                ["IMG", "RollerDie_Main_21", "modes", "Active", "lastState", false],
                ["IMG", "RollerDie_Main_22", "modes", "Active", "lastState", false],
                ["IMG", "RollerDie_Main_23", "modes", "Active", "lastState", false],
                ["IMG", "RollerDie_Main_24", "modes", "Active", "lastState", false],
                ["IMG", "RollerDie_Main_25", "modes", "Active", "lastState", false],
                ["IMG", "RollerDie_Main_26", "modes", "Active", "lastState", false],
                ["IMG", "RollerDie_Main_27", "modes", "Active", "lastState", false],
                ["IMG", "RollerDie_Main_28", "modes", "Active", "lastState", false],
                ["IMG", "RollerDie_Main_29", "modes", "Active", "lastState", false],
                ["IMG", "RollerDie_Main_3", "modes", "Active", "lastState", false],
                ["IMG", "RollerDie_Main_30", "modes", "Active", "lastState", false],
                ["IMG", "RollerDie_Main_4", "modes", "Active", "lastState", false],
                ["IMG", "RollerDie_Main_5", "modes", "Active", "lastState", false],
                ["IMG", "RollerDie_Main_6", "modes", "Active", "lastState", false],
                ["IMG", "RollerDie_Main_7", "modes", "Active", "lastState", false],
                ["IMG", "RollerDie_Main_8", "modes", "Active", "lastState", false],
                ["IMG", "RollerDie_Main_9", "modes", "Active", "lastState", false],
                ["IMG", "RollerFrame_BottomEnd_1", "modes", "Active", "lastState", true],
                ["IMG", "RollerFrame_BottomMid_1", "modes", "Active", "lastState", false],
                ["IMG", "RollerFrame_BottomMid_2", "modes", "Active", "lastState", false],
                ["IMG", "RollerFrame_BottomMid_3", "modes", "Active", "lastState", false],
                ["IMG", "RollerFrame_BottomMid_4", "modes", "Active", "lastState", false],
                ["IMG", "RollerFrame_BottomMid_5", "modes", "Active", "lastState", false],
                ["IMG", "RollerFrame_BottomMid_6", "modes", "Active", "lastState", false],
                ["IMG", "RollerFrame_BottomMid_7", "modes", "Active", "lastState", false],
                ["IMG", "RollerFrame_BottomMid_8", "modes", "Active", "lastState", false],
                ["IMG", "RollerFrame_BottomMid_9", "modes", "Active", "lastState", false],
                ["IMG", "RollerFrame_Diff_1", "modes", "Active", "lastState", false],
                ["IMG", "RollerFrame_Left_1", "modes", "Active", "lastState", true],
                ["IMG", "RollerFrame_TopEnd_1", "modes", "Active", "lastState", true],
                ["IMG", "RollerFrame_TopMid_1", "modes", "Active", "lastState", false],
                ["IMG", "RollerFrame_TopMid_2", "modes", "Active", "lastState", false],
                ["IMG", "RollerFrame_TopMid_3", "modes", "Active", "lastState", false],
                ["IMG", "RollerFrame_TopMid_4", "modes", "Active", "lastState", false],
                ["IMG", "RollerFrame_TopMid_5", "modes", "Active", "lastState", false],
                ["IMG", "RollerFrame_TopMid_6", "modes", "Active", "lastState", false],
                ["IMG", "RollerFrame_TopMid_7", "modes", "Active", "lastState", false],
                ["IMG", "RollerFrame_TopMid_8", "modes", "Active", "lastState", false],
                ["IMG", "RollerFrame_TopMid_9", "modes", "Active", "lastState", false],
                ["IMG", "SignalLightBotLeft_1", "modes", "Active", "lastState", true],
                ["IMG", "SignalLightBotRight_1", "modes", "Active", "lastState", true],
                ["IMG", "SignalLightTopLeft_1", "modes", "Active", "lastState", true],
                ["IMG", "SignalLightTopRight_1", "modes", "Active", "lastState", true],
                ["IMG", "SiteBarCenter_1", "modes", "Active", "lastState", false],
                ["IMG", "SiteBarLeft_1", "modes", "Active", "lastState", false],
                ["IMG", "SiteBarRight_1", "modes", "Active", "lastState", false],
                ["IMG", "SiteCenter_1", "modes", "Active", "lastState", false],
                ["IMG", "SiteLeft_1", "modes", "Active", "lastState", false],
                ["IMG", "SiteRight_1", "modes", "Active", "lastState", false],
                ["IMG", "stakedAdvantagesHeader_1", "modes", "Active", "lastState", true],
                ["IMG", "TorontoMap_1", "modes", "Active", "lastState", true],
                ["IMG", "SubLocLeft", "modes", "Active", "lastState", false],
                ["IMG", "SubLocTopLeft", "modes", "Active", "lastState", false],
                ["IMG", "SubLocBotLeft", "modes", "Active", "lastState", false],
                ["IMG", "SubLocRight", "modes", "Active", "lastState", false],
                ["IMG", "SubLocTopRight", "modes", "Active", "lastState", false],
                ["IMG", "SubLocBotRight", "modes", "Active", "lastState", false],
                ["IMG", "TorontoMapAutarkisOverlay_1", "modes", "Active", "lastState", true],
                ["IMG", "TorontoMapDistrictsOverlay_1", "modes", "Active", "lastState", true],
                ["IMG", "TorontoMapDomainOverlay_1", "modes", "Active", "lastState", true],
                ["IMG", "TorontoMapParksOverlay_1", "modes", "Active", "lastState", true],
                ["IMG", "TorontoMapRackOverlay_1", "modes", "Active", "lastState", true],
                ["IMG", "TorontoMapRoadsOverlay_1", "modes", "Active", "lastState", true],
                ["IMG", "TorontoMapSitesCultureOverlay_1", "modes", "Active", "lastState", true],
                ["IMG", "TorontoMapSitesEducationOverlay_1", "modes", "Active", "lastState", true],
                ["IMG", "TorontoMapSitesHavensOverlay_1", "modes", "Active", "lastState", true],
                ["IMG", "TorontoMapSitesHealthOverlay_1", "modes", "Active", "lastState", true],
                ["IMG", "TorontoMapSitesLandmarksOverlay_1", "modes", "Active", "lastState", true],
                ["IMG", "TorontoMapSitesNightlifeOverlay_1", "modes", "Active", "lastState", true],
                ["IMG", "TorontoMapSitesShoppingOverlay_1", "modes", "Active", "lastState", true],
                ["IMG", "TorontoMapSitesTransportationOverlay_1", "modes", "Active", "lastState", true],
                ["IMG", "WeatherClouds_1", "modes", "Active", "lastState", false],
                ["IMG", "WeatherGlow_1", "modes", "Active", "lastState", false],
                ["IMG", "WeatherFog_1", "modes", "Active", "lastState", false],
                ["IMG", "WeatherFrost_1", "modes", "Active", "lastState", false],
                ["IMG", "WeatherGround_1", "modes", "Active", "lastState", false],
                ["IMG", "WeatherMain_1", "modes", "Active", "lastState", false],
                ["IMG", "weeklyResourcesHeader_1", "modes", "Active", "lastState", true],
                ["IMG", "wpRerollPlaceholder_1", "modes", "Active", "lastState", true],
                ["IMG", "AirLightCN_4", "curSrc", true],
                ["IMG", "AirLightCN_5", "curSrc", true],
                ["IMG", "AirLightLeft_1", "curSrc", true],
                ["IMG", "AirLightMid_1", "curSrc", true],
                ["IMG", "AirLightTop_1", "curSrc", true],
                ["IMG", "AvaWongToken_1", "curSrc", true],
                ["IMG", "compCardSpot_1", "curSrc", false],
                ["IMG", "compCardSpot_10", "curSrc", false],
                ["IMG", "compCardSpot_2", "curSrc", false],
                ["IMG", "compCardSpot_3", "curSrc", false],
                ["IMG", "compCardSpot_4", "curSrc", false],
                ["IMG", "compCardSpot_5", "curSrc", false],
                ["IMG", "compCardSpot_6", "curSrc", false],
                ["IMG", "compCardSpot_7", "curSrc", false],
                ["IMG", "compCardSpot_8", "curSrc", false],
                ["IMG", "compCardSpot_9", "curSrc", false],
                ["IMG", "complicationEnhanced_1", "curSrc", false],
                ["IMG", "complicationEnhanced_10", "curSrc", false],
                ["IMG", "complicationEnhanced_2", "curSrc", false],
                ["IMG", "complicationEnhanced_3", "curSrc", false],
                ["IMG", "complicationEnhanced_4", "curSrc", false],
                ["IMG", "complicationEnhanced_5", "curSrc", false],
                ["IMG", "complicationEnhanced_6", "curSrc", false],
                ["IMG", "complicationEnhanced_7", "curSrc", false],
                ["IMG", "complicationEnhanced_8", "curSrc", false],
                ["IMG", "complicationEnhanced_9", "curSrc", false],
                ["IMG", "ComplicationMat_1", "curSrc", false],
                ["IMG", "complicationZero_1", "curSrc", false],
                ["IMG", "complicationZero_10", "curSrc", false],
                ["IMG", "complicationZero_2", "curSrc", false],
                ["IMG", "complicationZero_3", "curSrc", false],
                ["IMG", "complicationZero_4", "curSrc", false],
                ["IMG", "complicationZero_5", "curSrc", false],
                ["IMG", "complicationZero_6", "curSrc", false],
                ["IMG", "complicationZero_7", "curSrc", false],
                ["IMG", "complicationZero_8", "curSrc", false],
                ["IMG", "complicationZero_9", "curSrc", false],
                ["IMG", "DistrictCenter_1", "curSrc", false],
                ["IMG", "DistrictLeft_1", "curSrc", false],
                ["IMG", "DistrictRight_1", "curSrc", false],
                ["IMG", "downtimeBanner_1", "curSrc", false],
                ["IMG", ["Dr.ArthurRoyToken_1"], "curSrc", true],
                ["IMG", "Horizon_1", "curSrc", true],
                ["IMG", "HungerBotLeft_1", "curSrc", true],
                ["IMG", "HungerBotRight_1", "curSrc", true],
                ["IMG", "HungerTopLeft_1", "curSrc", true],
                ["IMG", "HungerTopRight_1", "curSrc", true],
                ["IMG", "JohannesNapierToken_1", "curSrc", true],
                ["IMG", "LockeUlrichToken_1", "curSrc", true],
                ["IMG", "mapButtonAutarkis_1", "curSrc", true],
                ["IMG", "mapButtonDistricts_1", "curSrc", true],
                ["IMG", "mapButtonDomain_1", "curSrc", true],
                ["IMG", "mapButtonParks_1", "curSrc", true],
                ["IMG", "mapButtonRack_1", "curSrc", true],
                ["IMG", "mapButtonRoads_1", "curSrc", true],
                ["IMG", "mapButtonSitesCulture_1", "curSrc", true],
                ["IMG", "mapButtonSitesEducation_1", "curSrc", true],
                ["IMG", "mapButtonSitesHavens_1", "curSrc", true],
                ["IMG", "mapButtonSitesHealth_1", "curSrc", true],
                ["IMG", "mapButtonSitesLandmarks_1", "curSrc", true],
                ["IMG", "mapButtonSitesNightlife_1", "curSrc", true],
                ["IMG", "mapButtonSitesShopping_1", "curSrc", true],
                ["IMG", "mapButtonSitesTransportation_1", "curSrc", true],
                ["IMG", "RollerDie_Big_1", "curSrc", false],
                ["IMG", "RollerDie_Big_2", "curSrc", false],
                ["IMG", "RollerDie_Main_1", "curSrc", false],
                ["IMG", "RollerDie_Main_10", "curSrc", false],
                ["IMG", "RollerDie_Main_11", "curSrc", false],
                ["IMG", "RollerDie_Main_12", "curSrc", false],
                ["IMG", "RollerDie_Main_13", "curSrc", false],
                ["IMG", "RollerDie_Main_14", "curSrc", false],
                ["IMG", "RollerDie_Main_15", "curSrc", false],
                ["IMG", "RollerDie_Main_16", "curSrc", false],
                ["IMG", "RollerDie_Main_17", "curSrc", false],
                ["IMG", "RollerDie_Main_18", "curSrc", false],
                ["IMG", "RollerDie_Main_19", "curSrc", false],
                ["IMG", "RollerDie_Main_2", "curSrc", false],
                ["IMG", "RollerDie_Main_20", "curSrc", false],
                ["IMG", "RollerDie_Main_21", "curSrc", false],
                ["IMG", "RollerDie_Main_22", "curSrc", false],
                ["IMG", "RollerDie_Main_23", "curSrc", false],
                ["IMG", "RollerDie_Main_24", "curSrc", false],
                ["IMG", "RollerDie_Main_25", "curSrc", false],
                ["IMG", "RollerDie_Main_26", "curSrc", false],
                ["IMG", "RollerDie_Main_27", "curSrc", false],
                ["IMG", "RollerDie_Main_28", "curSrc", false],
                ["IMG", "RollerDie_Main_29", "curSrc", false],
                ["IMG", "RollerDie_Main_3", "curSrc", false],
                ["IMG", "RollerDie_Main_30", "curSrc", false],
                ["IMG", "RollerDie_Main_4", "curSrc", false],
                ["IMG", "RollerDie_Main_5", "curSrc", false],
                ["IMG", "RollerDie_Main_6", "curSrc", false],
                ["IMG", "RollerDie_Main_7", "curSrc", false],
                ["IMG", "RollerDie_Main_8", "curSrc", false],
                ["IMG", "RollerDie_Main_9", "curSrc", false],
                ["IMG", "RollerFrame_BottomEnd_1", "curSrc", true],
                ["IMG", "RollerFrame_BottomMid_1", "curSrc", false],
                ["IMG", "RollerFrame_BottomMid_2", "curSrc", false],
                ["IMG", "RollerFrame_BottomMid_3", "curSrc", false],
                ["IMG", "RollerFrame_BottomMid_4", "curSrc", false],
                ["IMG", "RollerFrame_BottomMid_5", "curSrc", false],
                ["IMG", "RollerFrame_BottomMid_6", "curSrc", false],
                ["IMG", "RollerFrame_BottomMid_7", "curSrc", false],
                ["IMG", "RollerFrame_BottomMid_8", "curSrc", false],
                ["IMG", "RollerFrame_BottomMid_9", "curSrc", false],
                ["IMG", "RollerFrame_Diff_1", "curSrc", false],
                ["IMG", "RollerFrame_Left_1", "curSrc", true],
                ["IMG", "RollerFrame_TopEnd_1", "curSrc", true],
                ["IMG", "RollerFrame_TopMid_1", "curSrc", false],
                ["IMG", "RollerFrame_TopMid_2", "curSrc", false],
                ["IMG", "RollerFrame_TopMid_3", "curSrc", false],
                ["IMG", "RollerFrame_TopMid_4", "curSrc", false],
                ["IMG", "RollerFrame_TopMid_5", "curSrc", false],
                ["IMG", "RollerFrame_TopMid_6", "curSrc", false],
                ["IMG", "RollerFrame_TopMid_7", "curSrc", false],
                ["IMG", "RollerFrame_TopMid_8", "curSrc", false],
                ["IMG", "RollerFrame_TopMid_9", "curSrc", false],
                ["IMG", "SignalLightBotLeft_1", "curSrc", true],
                ["IMG", "SignalLightBotRight_1", "curSrc", true],
                ["IMG", "SignalLightTopLeft_1", "curSrc", true],
                ["IMG", "SignalLightTopRight_1", "curSrc", true],
                ["IMG", "SiteBarCenter_1", "curSrc", false],
                ["IMG", "SiteBarLeft_1", "curSrc", false],
                ["IMG", "SiteBarRight_1", "curSrc", false],
                ["IMG", "SiteCenter_1", "curSrc", false],
                ["IMG", "SiteLeft_1", "curSrc", false],
                ["IMG", "SiteRight_1", "curSrc", false],
                ["IMG", "stakedAdvantagesHeader_1", "curSrc", true],
                ["IMG", "TorontoMap_1", "curSrc", true],
                ["IMG", "SubLocLeft", "curSrc", false],
                ["IMG", "SubLocTopLeft", "curSrc", false],
                ["IMG", "SubLocBotLeft", "curSrc", false],
                ["IMG", "SubLocRight", "curSrc", false],
                ["IMG", "SubLocTopRight", "curSrc", false],
                ["IMG", "SubLocBotRight", "curSrc", false],
                ["IMG", "TorontoMapAutarkisOverlay_1", "curSrc", true],
                ["IMG", "TorontoMapDistrictsOverlay_1", "curSrc", true],
                ["IMG", "TorontoMapDomainOverlay_1", "curSrc", true],
                ["IMG", "TorontoMapParksOverlay_1", "curSrc", true],
                ["IMG", "TorontoMapRackOverlay_1", "curSrc", true],
                ["IMG", "TorontoMapRoadsOverlay_1", "curSrc", true],
                ["IMG", "TorontoMapSitesCultureOverlay_1", "curSrc", true],
                ["IMG", "TorontoMapSitesEducationOverlay_1", "curSrc", true],
                ["IMG", "TorontoMapSitesHavensOverlay_1", "curSrc", true],
                ["IMG", "TorontoMapSitesHealthOverlay_1", "curSrc", true],
                ["IMG", "TorontoMapSitesLandmarksOverlay_1", "curSrc", true],
                ["IMG", "TorontoMapSitesNightlifeOverlay_1", "curSrc", true],
                ["IMG", "TorontoMapSitesShoppingOverlay_1", "curSrc", true],
                ["IMG", "TorontoMapSitesTransportationOverlay_1", "curSrc", true],
                ["IMG", "WeatherClouds_1", "curSrc", false],
                ["IMG", "WeatherGlow_1", "curSrc", false],
                ["IMG", "WeatherFog_1", "curSrc", false],
                ["IMG", "WeatherFrost_1", "curSrc", false],
                ["IMG", "WeatherGround_1", "curSrc", false],
                ["IMG", "WeatherMain_1", "curSrc", false],
                ["IMG", "weeklyResourcesHeader_1", "curSrc", true],
                ["IMG", "wpRerollPlaceholder_1", "curSrc", true],
                ["IMG", "AirLightCN_4", "activeSrc", true],
                ["IMG", "AirLightCN_5", "activeSrc", true],
                ["IMG", "AirLightLeft_1", "activeSrc", true],
                ["IMG", "AirLightMid_1", "activeSrc", true],
                ["IMG", "AirLightTop_1", "activeSrc", true],
                ["IMG", "AvaWongToken_1", "activeSrc", true],
                ["IMG", "compCardSpot_1", "activeSrc", false],
                ["IMG", "compCardSpot_10", "activeSrc", false],
                ["IMG", "compCardSpot_2", "activeSrc", false],
                ["IMG", "compCardSpot_3", "activeSrc", false],
                ["IMG", "compCardSpot_4", "activeSrc", false],
                ["IMG", "compCardSpot_5", "activeSrc", false],
                ["IMG", "compCardSpot_6", "activeSrc", false],
                ["IMG", "compCardSpot_7", "activeSrc", false],
                ["IMG", "compCardSpot_8", "activeSrc", false],
                ["IMG", "compCardSpot_9", "activeSrc", false],
                ["IMG", "complicationEnhanced_1", "activeSrc", false],
                ["IMG", "complicationEnhanced_10", "activeSrc", false],
                ["IMG", "complicationEnhanced_2", "activeSrc", false],
                ["IMG", "complicationEnhanced_3", "activeSrc", false],
                ["IMG", "complicationEnhanced_4", "activeSrc", false],
                ["IMG", "complicationEnhanced_5", "activeSrc", false],
                ["IMG", "complicationEnhanced_6", "activeSrc", false],
                ["IMG", "complicationEnhanced_7", "activeSrc", false],
                ["IMG", "complicationEnhanced_8", "activeSrc", false],
                ["IMG", "complicationEnhanced_9", "activeSrc", false],
                ["IMG", "ComplicationMat_1", "activeSrc", false],
                ["IMG", "complicationZero_1", "activeSrc", false],
                ["IMG", "complicationZero_10", "activeSrc", false],
                ["IMG", "complicationZero_2", "activeSrc", false],
                ["IMG", "complicationZero_3", "activeSrc", false],
                ["IMG", "complicationZero_4", "activeSrc", false],
                ["IMG", "complicationZero_5", "activeSrc", false],
                ["IMG", "complicationZero_6", "activeSrc", false],
                ["IMG", "complicationZero_7", "activeSrc", false],
                ["IMG", "complicationZero_8", "activeSrc", false],
                ["IMG", "complicationZero_9", "activeSrc", false],
                ["IMG", "DistrictCenter_1", "activeSrc", false],
                ["IMG", "DistrictLeft_1", "activeSrc", false],
                ["IMG", "DistrictRight_1", "activeSrc", false],
                ["IMG", "downtimeBanner_1", "activeSrc", false],
                ["IMG", ["Dr.ArthurRoyToken_1"], "activeSrc", true],
                ["IMG", "Horizon_1", "activeSrc", true],
                ["IMG", "HungerBotLeft_1", "activeSrc", true],
                ["IMG", "HungerBotRight_1", "activeSrc", true],
                ["IMG", "HungerTopLeft_1", "activeSrc", true],
                ["IMG", "HungerTopRight_1", "activeSrc", true],
                ["IMG", "JohannesNapierToken_1", "activeSrc", true],
                ["IMG", "LockeUlrichToken_1", "activeSrc", true],
                ["IMG", "mapButtonAutarkis_1", "activeSrc", true],
                ["IMG", "mapButtonDistricts_1", "activeSrc", true],
                ["IMG", "mapButtonDomain_1", "activeSrc", true],
                ["IMG", "mapButtonParks_1", "activeSrc", true],
                ["IMG", "mapButtonRack_1", "activeSrc", true],
                ["IMG", "mapButtonRoads_1", "activeSrc", true],
                ["IMG", "mapButtonSitesCulture_1", "activeSrc", true],
                ["IMG", "mapButtonSitesEducation_1", "activeSrc", true],
                ["IMG", "mapButtonSitesHavens_1", "activeSrc", true],
                ["IMG", "mapButtonSitesHealth_1", "activeSrc", true],
                ["IMG", "mapButtonSitesLandmarks_1", "activeSrc", true],
                ["IMG", "mapButtonSitesNightlife_1", "activeSrc", true],
                ["IMG", "mapButtonSitesShopping_1", "activeSrc", true],
                ["IMG", "mapButtonSitesTransportation_1", "activeSrc", true],
                ["IMG", "RollerDie_Big_1", "activeSrc", false],
                ["IMG", "RollerDie_Big_2", "activeSrc", false],
                ["IMG", "RollerDie_Main_1", "activeSrc", false],
                ["IMG", "RollerDie_Main_10", "activeSrc", false],
                ["IMG", "RollerDie_Main_11", "activeSrc", false],
                ["IMG", "RollerDie_Main_12", "activeSrc", false],
                ["IMG", "RollerDie_Main_13", "activeSrc", false],
                ["IMG", "RollerDie_Main_14", "activeSrc", false],
                ["IMG", "RollerDie_Main_15", "activeSrc", false],
                ["IMG", "RollerDie_Main_16", "activeSrc", false],
                ["IMG", "RollerDie_Main_17", "activeSrc", false],
                ["IMG", "RollerDie_Main_18", "activeSrc", false],
                ["IMG", "RollerDie_Main_19", "activeSrc", false],
                ["IMG", "RollerDie_Main_2", "activeSrc", false],
                ["IMG", "RollerDie_Main_20", "activeSrc", false],
                ["IMG", "RollerDie_Main_21", "activeSrc", false],
                ["IMG", "RollerDie_Main_22", "activeSrc", false],
                ["IMG", "RollerDie_Main_23", "activeSrc", false],
                ["IMG", "RollerDie_Main_24", "activeSrc", false],
                ["IMG", "RollerDie_Main_25", "activeSrc", false],
                ["IMG", "RollerDie_Main_26", "activeSrc", false],
                ["IMG", "RollerDie_Main_27", "activeSrc", false],
                ["IMG", "RollerDie_Main_28", "activeSrc", false],
                ["IMG", "RollerDie_Main_29", "activeSrc", false],
                ["IMG", "RollerDie_Main_3", "activeSrc", false],
                ["IMG", "RollerDie_Main_30", "activeSrc", false],
                ["IMG", "RollerDie_Main_4", "activeSrc", false],
                ["IMG", "RollerDie_Main_5", "activeSrc", false],
                ["IMG", "RollerDie_Main_6", "activeSrc", false],
                ["IMG", "RollerDie_Main_7", "activeSrc", false],
                ["IMG", "RollerDie_Main_8", "activeSrc", false],
                ["IMG", "RollerDie_Main_9", "activeSrc", false],
                ["IMG", "RollerFrame_BottomEnd_1", "activeSrc", true],
                ["IMG", "RollerFrame_BottomMid_1", "activeSrc", false],
                ["IMG", "RollerFrame_BottomMid_2", "activeSrc", false],
                ["IMG", "RollerFrame_BottomMid_3", "activeSrc", false],
                ["IMG", "RollerFrame_BottomMid_4", "activeSrc", false],
                ["IMG", "RollerFrame_BottomMid_5", "activeSrc", false],
                ["IMG", "RollerFrame_BottomMid_6", "activeSrc", false],
                ["IMG", "RollerFrame_BottomMid_7", "activeSrc", false],
                ["IMG", "RollerFrame_BottomMid_8", "activeSrc", false],
                ["IMG", "RollerFrame_BottomMid_9", "activeSrc", false],
                ["IMG", "RollerFrame_Diff_1", "activeSrc", false],
                ["IMG", "RollerFrame_Left_1", "activeSrc", true],
                ["IMG", "RollerFrame_TopEnd_1", "activeSrc", true],
                ["IMG", "RollerFrame_TopMid_1", "activeSrc", false],
                ["IMG", "RollerFrame_TopMid_2", "activeSrc", false],
                ["IMG", "RollerFrame_TopMid_3", "activeSrc", false],
                ["IMG", "RollerFrame_TopMid_4", "activeSrc", false],
                ["IMG", "RollerFrame_TopMid_5", "activeSrc", false],
                ["IMG", "RollerFrame_TopMid_6", "activeSrc", false],
                ["IMG", "RollerFrame_TopMid_7", "activeSrc", false],
                ["IMG", "RollerFrame_TopMid_8", "activeSrc", false],
                ["IMG", "RollerFrame_TopMid_9", "activeSrc", false],
                ["IMG", "SignalLightBotLeft_1", "activeSrc", true],
                ["IMG", "SignalLightBotRight_1", "activeSrc", true],
                ["IMG", "SignalLightTopLeft_1", "activeSrc", true],
                ["IMG", "SignalLightTopRight_1", "activeSrc", true],
                ["IMG", "SiteBarCenter_1", "activeSrc", false],
                ["IMG", "SiteBarLeft_1", "activeSrc", false],
                ["IMG", "SiteBarRight_1", "activeSrc", false],
                ["IMG", "SiteCenter_1", "activeSrc", false],
                ["IMG", "SiteLeft_1", "activeSrc", false],
                ["IMG", "SiteRight_1", "activeSrc", false],
                ["IMG", "stakedAdvantagesHeader_1", "activeSrc", true],
                ["IMG", "TorontoMap_1", "activeSrc", true],
                ["IMG", "SubLocLeft", "activeSrc", false],
                ["IMG", "SubLocTopLeft", "activeSrc", false],
                ["IMG", "SubLocBotLeft", "activeSrc", false],
                ["IMG", "SubLocRight", "activeSrc", false],
                ["IMG", "SubLocTopRight", "activeSrc", false],
                ["IMG", "SubLocBotRight", "activeSrc", false],
                ["IMG", "TorontoMapAutarkisOverlay_1", "activeSrc", true],
                ["IMG", "TorontoMapDistrictsOverlay_1", "activeSrc", true],
                ["IMG", "TorontoMapDomainOverlay_1", "activeSrc", true],
                ["IMG", "TorontoMapParksOverlay_1", "activeSrc", true],
                ["IMG", "TorontoMapRackOverlay_1", "activeSrc", true],
                ["IMG", "TorontoMapRoadsOverlay_1", "activeSrc", true],
                ["IMG", "TorontoMapSitesCultureOverlay_1", "activeSrc", true],
                ["IMG", "TorontoMapSitesEducationOverlay_1", "activeSrc", true],
                ["IMG", "TorontoMapSitesHavensOverlay_1", "activeSrc", true],
                ["IMG", "TorontoMapSitesHealthOverlay_1", "activeSrc", true],
                ["IMG", "TorontoMapSitesLandmarksOverlay_1", "activeSrc", true],
                ["IMG", "TorontoMapSitesNightlifeOverlay_1", "activeSrc", true],
                ["IMG", "TorontoMapSitesShoppingOverlay_1", "activeSrc", true],
                ["IMG", "TorontoMapSitesTransportationOverlay_1", "activeSrc", true],
                ["IMG", "WeatherClouds_1", "activeSrc", false],
                ["IMG", "WeatherGlow_1", "activeSrc", false],
                ["IMG", "WeatherFog_1", "activeSrc", false],
                ["IMG", "WeatherFrost_1", "activeSrc", false],
                ["IMG", "WeatherGround_1", "activeSrc", false],
                ["IMG", "WeatherMain_1", "activeSrc", false],
                ["IMG", "weeklyResourcesHeader_1", "activeSrc", true],
                ["IMG", "wpRerollPlaceholder_1", "activeSrc", true],
                ["IMG", "AirLightCN_4", "modes", "Inactive", "lastActive", true],
                ["IMG", "AirLightCN_5", "modes", "Inactive", "lastActive", true],
                ["IMG", "AirLightLeft_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "AirLightMid_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "AirLightTop_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "AvaWongToken_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "compCardSpot_1", "modes", "Inactive", "lastActive", false],
                ["IMG", "compCardSpot_10", "modes", "Inactive", "lastActive", false],
                ["IMG", "compCardSpot_2", "modes", "Inactive", "lastActive", false],
                ["IMG", "compCardSpot_3", "modes", "Inactive", "lastActive", false],
                ["IMG", "compCardSpot_4", "modes", "Inactive", "lastActive", false],
                ["IMG", "compCardSpot_5", "modes", "Inactive", "lastActive", false],
                ["IMG", "compCardSpot_6", "modes", "Inactive", "lastActive", false],
                ["IMG", "compCardSpot_7", "modes", "Inactive", "lastActive", false],
                ["IMG", "compCardSpot_8", "modes", "Inactive", "lastActive", false],
                ["IMG", "compCardSpot_9", "modes", "Inactive", "lastActive", false],
                ["IMG", "complicationEnhanced_1", "modes", "Inactive", "lastActive", false],
                ["IMG", "complicationEnhanced_10", "modes", "Inactive", "lastActive", false],
                ["IMG", "complicationEnhanced_2", "modes", "Inactive", "lastActive", false],
                ["IMG", "complicationEnhanced_3", "modes", "Inactive", "lastActive", false],
                ["IMG", "complicationEnhanced_4", "modes", "Inactive", "lastActive", false],
                ["IMG", "complicationEnhanced_5", "modes", "Inactive", "lastActive", false],
                ["IMG", "complicationEnhanced_6", "modes", "Inactive", "lastActive", false],
                ["IMG", "complicationEnhanced_7", "modes", "Inactive", "lastActive", false],
                ["IMG", "complicationEnhanced_8", "modes", "Inactive", "lastActive", false],
                ["IMG", "complicationEnhanced_9", "modes", "Inactive", "lastActive", false],
                ["IMG", "ComplicationMat_1", "modes", "Inactive", "lastActive", false],
                ["IMG", "complicationZero_1", "modes", "Inactive", "lastActive", false],
                ["IMG", "complicationZero_10", "modes", "Inactive", "lastActive", false],
                ["IMG", "complicationZero_2", "modes", "Inactive", "lastActive", false],
                ["IMG", "complicationZero_3", "modes", "Inactive", "lastActive", false],
                ["IMG", "complicationZero_4", "modes", "Inactive", "lastActive", false],
                ["IMG", "complicationZero_5", "modes", "Inactive", "lastActive", false],
                ["IMG", "complicationZero_6", "modes", "Inactive", "lastActive", false],
                ["IMG", "complicationZero_7", "modes", "Inactive", "lastActive", false],
                ["IMG", "complicationZero_8", "modes", "Inactive", "lastActive", false],
                ["IMG", "complicationZero_9", "modes", "Inactive", "lastActive", false],
                ["IMG", "DistrictCenter_1", "modes", "Inactive", "lastActive", false],
                ["IMG", "DistrictLeft_1", "modes", "Inactive", "lastActive", false],
                ["IMG", "DistrictRight_1", "modes", "Inactive", "lastActive", false],
                ["IMG", "downtimeBanner_1", "modes", "Inactive", "lastActive", false],
                ["IMG", ["Dr.ArthurRoyToken_1"], "modes", "Inactive", "lastActive", true],
                ["IMG", "Horizon_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "HungerBotLeft_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "HungerBotRight_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "HungerTopLeft_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "HungerTopRight_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "JohannesNapierToken_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "LockeUlrichToken_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "mapButtonAutarkis_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "mapButtonDistricts_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "mapButtonDomain_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "mapButtonParks_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "mapButtonRack_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "mapButtonRoads_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "mapButtonSitesCulture_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "mapButtonSitesEducation_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "mapButtonSitesHavens_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "mapButtonSitesHealth_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "mapButtonSitesLandmarks_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "mapButtonSitesNightlife_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "mapButtonSitesShopping_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "mapButtonSitesTransportation_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "RollerDie_Big_1", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerDie_Big_2", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerDie_Main_1", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerDie_Main_10", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerDie_Main_11", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerDie_Main_12", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerDie_Main_13", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerDie_Main_14", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerDie_Main_15", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerDie_Main_16", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerDie_Main_17", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerDie_Main_18", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerDie_Main_19", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerDie_Main_2", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerDie_Main_20", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerDie_Main_21", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerDie_Main_22", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerDie_Main_23", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerDie_Main_24", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerDie_Main_25", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerDie_Main_26", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerDie_Main_27", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerDie_Main_28", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerDie_Main_29", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerDie_Main_3", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerDie_Main_30", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerDie_Main_4", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerDie_Main_5", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerDie_Main_6", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerDie_Main_7", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerDie_Main_8", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerDie_Main_9", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerFrame_BottomEnd_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "RollerFrame_BottomMid_1", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerFrame_BottomMid_2", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerFrame_BottomMid_3", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerFrame_BottomMid_4", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerFrame_BottomMid_5", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerFrame_BottomMid_6", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerFrame_BottomMid_7", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerFrame_BottomMid_8", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerFrame_BottomMid_9", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerFrame_Diff_1", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerFrame_Left_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "RollerFrame_TopEnd_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "RollerFrame_TopMid_1", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerFrame_TopMid_2", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerFrame_TopMid_3", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerFrame_TopMid_4", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerFrame_TopMid_5", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerFrame_TopMid_6", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerFrame_TopMid_7", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerFrame_TopMid_8", "modes", "Inactive", "lastActive", false],
                ["IMG", "RollerFrame_TopMid_9", "modes", "Inactive", "lastActive", false],
                ["IMG", "SignalLightBotLeft_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "SignalLightBotRight_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "SignalLightTopLeft_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "SignalLightTopRight_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "SiteBarCenter_1", "modes", "Inactive", "lastActive", false],
                ["IMG", "SiteBarLeft_1", "modes", "Inactive", "lastActive", false],
                ["IMG", "SiteBarRight_1", "modes", "Inactive", "lastActive", false],
                ["IMG", "SiteCenter_1", "modes", "Inactive", "lastActive", false],
                ["IMG", "SiteLeft_1", "modes", "Inactive", "lastActive", false],
                ["IMG", "SiteRight_1", "modes", "Inactive", "lastActive", false],
                ["IMG", "stakedAdvantagesHeader_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "TorontoMap_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "SubLocLeft", "modes", "Inactive", "lastActive", false],
                ["IMG", "SubLocTopLeft", "modes", "Inactive", "lastActive", false],
                ["IMG", "SubLocBotLeft", "modes", "Inactive", "lastActive", false],
                ["IMG", "SubLocRight", "modes", "Inactive", "lastActive", false],
                ["IMG", "SubLocTopRight", "modes", "Inactive", "lastActive", false],
                ["IMG", "SubLocBotRight", "modes", "Inactive", "lastActive", false],
                ["IMG", "TorontoMapAutarkisOverlay_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "TorontoMapDistrictsOverlay_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "TorontoMapDomainOverlay_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "TorontoMapParksOverlay_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "TorontoMapRackOverlay_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "TorontoMapRoadsOverlay_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "TorontoMapSitesCultureOverlay_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "TorontoMapSitesEducationOverlay_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "TorontoMapSitesHavensOverlay_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "TorontoMapSitesHealthOverlay_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "TorontoMapSitesLandmarksOverlay_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "TorontoMapSitesNightlifeOverlay_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "TorontoMapSitesShoppingOverlay_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "TorontoMapSitesTransportationOverlay_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "WeatherClouds_1", "modes", "Inactive", "lastActive", false],
                ["IMG", "WeatherGlow_1", "modes", "Inactive", "lastActive", false],
                ["IMG", "WeatherFog_1", "modes", "Inactive", "lastActive", false],
                ["IMG", "WeatherFrost_1", "modes", "Inactive", "lastActive", false],
                ["IMG", "WeatherGround_1", "modes", "Inactive", "lastActive", false],
                ["IMG", "WeatherMain_1", "modes", "Inactive", "lastActive", false],
                ["IMG", "weeklyResourcesHeader_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "wpRerollPlaceholder_1", "modes", "Inactive", "lastActive", true],
                ["IMG", "AirLightCN_4", "modes", "Inactive", "lastState", true],
                ["IMG", "AirLightCN_5", "modes", "Inactive", "lastState", true],
                ["IMG", "AirLightLeft_1", "modes", "Inactive", "lastState", true],
                ["IMG", "AirLightMid_1", "modes", "Inactive", "lastState", true],
                ["IMG", "AirLightTop_1", "modes", "Inactive", "lastState", true],
                ["IMG", "AvaWongToken_1", "modes", "Inactive", "lastState", true],
                ["IMG", "compCardSpot_1", "modes", "Inactive", "lastState", false],
                ["IMG", "compCardSpot_10", "modes", "Inactive", "lastState", false],
                ["IMG", "compCardSpot_2", "modes", "Inactive", "lastState", false],
                ["IMG", "compCardSpot_3", "modes", "Inactive", "lastState", false],
                ["IMG", "compCardSpot_4", "modes", "Inactive", "lastState", false],
                ["IMG", "compCardSpot_5", "modes", "Inactive", "lastState", false],
                ["IMG", "compCardSpot_6", "modes", "Inactive", "lastState", false],
                ["IMG", "compCardSpot_7", "modes", "Inactive", "lastState", false],
                ["IMG", "compCardSpot_8", "modes", "Inactive", "lastState", false],
                ["IMG", "compCardSpot_9", "modes", "Inactive", "lastState", false],
                ["IMG", "complicationEnhanced_1", "modes", "Inactive", "lastState", false],
                ["IMG", "complicationEnhanced_10", "modes", "Inactive", "lastState", false],
                ["IMG", "complicationEnhanced_2", "modes", "Inactive", "lastState", false],
                ["IMG", "complicationEnhanced_3", "modes", "Inactive", "lastState", false],
                ["IMG", "complicationEnhanced_4", "modes", "Inactive", "lastState", false],
                ["IMG", "complicationEnhanced_5", "modes", "Inactive", "lastState", false],
                ["IMG", "complicationEnhanced_6", "modes", "Inactive", "lastState", false],
                ["IMG", "complicationEnhanced_7", "modes", "Inactive", "lastState", false],
                ["IMG", "complicationEnhanced_8", "modes", "Inactive", "lastState", false],
                ["IMG", "complicationEnhanced_9", "modes", "Inactive", "lastState", false],
                ["IMG", "ComplicationMat_1", "modes", "Inactive", "lastState", false],
                ["IMG", "complicationZero_1", "modes", "Inactive", "lastState", false],
                ["IMG", "complicationZero_10", "modes", "Inactive", "lastState", false],
                ["IMG", "complicationZero_2", "modes", "Inactive", "lastState", false],
                ["IMG", "complicationZero_3", "modes", "Inactive", "lastState", false],
                ["IMG", "complicationZero_4", "modes", "Inactive", "lastState", false],
                ["IMG", "complicationZero_5", "modes", "Inactive", "lastState", false],
                ["IMG", "complicationZero_6", "modes", "Inactive", "lastState", false],
                ["IMG", "complicationZero_7", "modes", "Inactive", "lastState", false],
                ["IMG", "complicationZero_8", "modes", "Inactive", "lastState", false],
                ["IMG", "complicationZero_9", "modes", "Inactive", "lastState", false],
                ["IMG", "DistrictCenter_1", "modes", "Inactive", "lastState", false],
                ["IMG", "DistrictLeft_1", "modes", "Inactive", "lastState", false],
                ["IMG", "DistrictRight_1", "modes", "Inactive", "lastState", false],
                ["IMG", "downtimeBanner_1", "modes", "Inactive", "lastState", false],
                ["IMG", ["Dr.ArthurRoyToken_1"], "modes", "Inactive", "lastState", true],
                ["IMG", "Horizon_1", "modes", "Inactive", "lastState", true],
                ["IMG", "HungerBotLeft_1", "modes", "Inactive", "lastState", true],
                ["IMG", "HungerBotRight_1", "modes", "Inactive", "lastState", true],
                ["IMG", "HungerTopLeft_1", "modes", "Inactive", "lastState", true],
                ["IMG", "HungerTopRight_1", "modes", "Inactive", "lastState", true],
                ["IMG", "JohannesNapierToken_1", "modes", "Inactive", "lastState", true],
                ["IMG", "LockeUlrichToken_1", "modes", "Inactive", "lastState", true],
                ["IMG", "mapButtonAutarkis_1", "modes", "Inactive", "lastState", true],
                ["IMG", "mapButtonDistricts_1", "modes", "Inactive", "lastState", true],
                ["IMG", "mapButtonDomain_1", "modes", "Inactive", "lastState", true],
                ["IMG", "mapButtonParks_1", "modes", "Inactive", "lastState", true],
                ["IMG", "mapButtonRack_1", "modes", "Inactive", "lastState", true],
                ["IMG", "mapButtonRoads_1", "modes", "Inactive", "lastState", true],
                ["IMG", "mapButtonSitesCulture_1", "modes", "Inactive", "lastState", true],
                ["IMG", "mapButtonSitesEducation_1", "modes", "Inactive", "lastState", true],
                ["IMG", "mapButtonSitesHavens_1", "modes", "Inactive", "lastState", true],
                ["IMG", "mapButtonSitesHealth_1", "modes", "Inactive", "lastState", true],
                ["IMG", "mapButtonSitesLandmarks_1", "modes", "Inactive", "lastState", true],
                ["IMG", "mapButtonSitesNightlife_1", "modes", "Inactive", "lastState", true],
                ["IMG", "mapButtonSitesShopping_1", "modes", "Inactive", "lastState", true],
                ["IMG", "mapButtonSitesTransportation_1", "modes", "Inactive", "lastState", true],
                ["IMG", "RollerDie_Big_1", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerDie_Big_2", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerDie_Main_1", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerDie_Main_10", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerDie_Main_11", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerDie_Main_12", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerDie_Main_13", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerDie_Main_14", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerDie_Main_15", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerDie_Main_16", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerDie_Main_17", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerDie_Main_18", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerDie_Main_19", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerDie_Main_2", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerDie_Main_20", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerDie_Main_21", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerDie_Main_22", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerDie_Main_23", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerDie_Main_24", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerDie_Main_25", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerDie_Main_26", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerDie_Main_27", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerDie_Main_28", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerDie_Main_29", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerDie_Main_3", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerDie_Main_30", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerDie_Main_4", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerDie_Main_5", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerDie_Main_6", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerDie_Main_7", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerDie_Main_8", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerDie_Main_9", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerFrame_BottomEnd_1", "modes", "Inactive", "lastState", true],
                ["IMG", "RollerFrame_BottomMid_1", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerFrame_BottomMid_2", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerFrame_BottomMid_3", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerFrame_BottomMid_4", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerFrame_BottomMid_5", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerFrame_BottomMid_6", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerFrame_BottomMid_7", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerFrame_BottomMid_8", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerFrame_BottomMid_9", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerFrame_Diff_1", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerFrame_Left_1", "modes", "Inactive", "lastState", true],
                ["IMG", "RollerFrame_TopEnd_1", "modes", "Inactive", "lastState", true],
                ["IMG", "RollerFrame_TopMid_1", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerFrame_TopMid_2", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerFrame_TopMid_3", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerFrame_TopMid_4", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerFrame_TopMid_5", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerFrame_TopMid_6", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerFrame_TopMid_7", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerFrame_TopMid_8", "modes", "Inactive", "lastState", false],
                ["IMG", "RollerFrame_TopMid_9", "modes", "Inactive", "lastState", false],
                ["IMG", "SignalLightBotLeft_1", "modes", "Inactive", "lastState", true],
                ["IMG", "SignalLightBotRight_1", "modes", "Inactive", "lastState", true],
                ["IMG", "SignalLightTopLeft_1", "modes", "Inactive", "lastState", true],
                ["IMG", "SignalLightTopRight_1", "modes", "Inactive", "lastState", true],
                ["IMG", "SiteBarCenter_1", "modes", "Inactive", "lastState", false],
                ["IMG", "SiteBarLeft_1", "modes", "Inactive", "lastState", false],
                ["IMG", "SiteBarRight_1", "modes", "Inactive", "lastState", false],
                ["IMG", "SiteCenter_1", "modes", "Inactive", "lastState", false],
                ["IMG", "SiteLeft_1", "modes", "Inactive", "lastState", false],
                ["IMG", "SiteRight_1", "modes", "Inactive", "lastState", false],
                ["IMG", "stakedAdvantagesHeader_1", "modes", "Inactive", "lastState", true],
                ["IMG", "TorontoMap_1", "modes", "Inactive", "lastState", true],
                ["IMG", "SubLocLeft", "modes", "Inactive", "lastState", false],
                ["IMG", "SubLocTopLeft", "modes", "Inactive", "lastState", false],
                ["IMG", "SubLocBotLeft", "modes", "Inactive", "lastState", false],
                ["IMG", "SubLocRight", "modes", "Inactive", "lastState", false],
                ["IMG", "SubLocTopRight", "modes", "Inactive", "lastState", false],
                ["IMG", "SubLocBotRight", "modes", "Inactive", "lastState", false],
                ["IMG", "TorontoMapAutarkisOverlay_1", "modes", "Inactive", "lastState", true],
                ["IMG", "TorontoMapDistrictsOverlay_1", "modes", "Inactive", "lastState", true],
                ["IMG", "TorontoMapDomainOverlay_1", "modes", "Inactive", "lastState", true],
                ["IMG", "TorontoMapParksOverlay_1", "modes", "Inactive", "lastState", true],
                ["IMG", "TorontoMapRackOverlay_1", "modes", "Inactive", "lastState", true],
                ["IMG", "TorontoMapRoadsOverlay_1", "modes", "Inactive", "lastState", true],
                ["IMG", "TorontoMapSitesCultureOverlay_1", "modes", "Inactive", "lastState", true],
                ["IMG", "TorontoMapSitesEducationOverlay_1", "modes", "Inactive", "lastState", true],
                ["IMG", "TorontoMapSitesHavensOverlay_1", "modes", "Inactive", "lastState", true],
                ["IMG", "TorontoMapSitesHealthOverlay_1", "modes", "Inactive", "lastState", true],
                ["IMG", "TorontoMapSitesLandmarksOverlay_1", "modes", "Inactive", "lastState", true],
                ["IMG", "TorontoMapSitesNightlifeOverlay_1", "modes", "Inactive", "lastState", true],
                ["IMG", "TorontoMapSitesShoppingOverlay_1", "modes", "Inactive", "lastState", true],
                ["IMG", "TorontoMapSitesTransportationOverlay_1", "modes", "Inactive", "lastState", true],
                ["IMG", "WeatherClouds_1", "modes", "Inactive", "lastState", false],
                ["IMG", "WeatherGlow_1", "modes", "Inactive", "lastState", false],
                ["IMG", "WeatherFog_1", "modes", "Inactive", "lastState", false],
                ["IMG", "WeatherFrost_1", "modes", "Inactive", "lastState", false],
                ["IMG", "WeatherGround_1", "modes", "Inactive", "lastState", false],
                ["IMG", "WeatherMain_1", "modes", "Inactive", "lastState", false],
                ["IMG", "weeklyResourcesHeader_1", "modes", "Inactive", "lastState", true],
                ["IMG", "wpRerollPlaceholder_1", "modes", "Inactive", "lastState", true],
                ["IMG", "AirLightCN_4", "modes", "Daylighter", "lastActive", true],
                ["IMG", "AirLightCN_5", "modes", "Daylighter", "lastActive", true],
                ["IMG", "AirLightLeft_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "AirLightMid_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "AirLightTop_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "AvaWongToken_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "compCardSpot_1", "modes", "Daylighter", "lastActive", false],
                ["IMG", "compCardSpot_10", "modes", "Daylighter", "lastActive", false],
                ["IMG", "compCardSpot_2", "modes", "Daylighter", "lastActive", false],
                ["IMG", "compCardSpot_3", "modes", "Daylighter", "lastActive", false],
                ["IMG", "compCardSpot_4", "modes", "Daylighter", "lastActive", false],
                ["IMG", "compCardSpot_5", "modes", "Daylighter", "lastActive", false],
                ["IMG", "compCardSpot_6", "modes", "Daylighter", "lastActive", false],
                ["IMG", "compCardSpot_7", "modes", "Daylighter", "lastActive", false],
                ["IMG", "compCardSpot_8", "modes", "Daylighter", "lastActive", false],
                ["IMG", "compCardSpot_9", "modes", "Daylighter", "lastActive", false],
                ["IMG", "complicationEnhanced_1", "modes", "Daylighter", "lastActive", false],
                ["IMG", "complicationEnhanced_10", "modes", "Daylighter", "lastActive", false],
                ["IMG", "complicationEnhanced_2", "modes", "Daylighter", "lastActive", false],
                ["IMG", "complicationEnhanced_3", "modes", "Daylighter", "lastActive", false],
                ["IMG", "complicationEnhanced_4", "modes", "Daylighter", "lastActive", false],
                ["IMG", "complicationEnhanced_5", "modes", "Daylighter", "lastActive", false],
                ["IMG", "complicationEnhanced_6", "modes", "Daylighter", "lastActive", false],
                ["IMG", "complicationEnhanced_7", "modes", "Daylighter", "lastActive", false],
                ["IMG", "complicationEnhanced_8", "modes", "Daylighter", "lastActive", false],
                ["IMG", "complicationEnhanced_9", "modes", "Daylighter", "lastActive", false],
                ["IMG", "ComplicationMat_1", "modes", "Daylighter", "lastActive", false],
                ["IMG", "complicationZero_1", "modes", "Daylighter", "lastActive", false],
                ["IMG", "complicationZero_10", "modes", "Daylighter", "lastActive", false],
                ["IMG", "complicationZero_2", "modes", "Daylighter", "lastActive", false],
                ["IMG", "complicationZero_3", "modes", "Daylighter", "lastActive", false],
                ["IMG", "complicationZero_4", "modes", "Daylighter", "lastActive", false],
                ["IMG", "complicationZero_5", "modes", "Daylighter", "lastActive", false],
                ["IMG", "complicationZero_6", "modes", "Daylighter", "lastActive", false],
                ["IMG", "complicationZero_7", "modes", "Daylighter", "lastActive", false],
                ["IMG", "complicationZero_8", "modes", "Daylighter", "lastActive", false],
                ["IMG", "complicationZero_9", "modes", "Daylighter", "lastActive", false],
                ["IMG", "DistrictCenter_1", "modes", "Daylighter", "lastActive", false],
                ["IMG", "DistrictLeft_1", "modes", "Daylighter", "lastActive", false],
                ["IMG", "DistrictRight_1", "modes", "Daylighter", "lastActive", false],
                ["IMG", "downtimeBanner_1", "modes", "Daylighter", "lastActive", false],
                ["IMG", ["Dr.ArthurRoyToken_1"], "modes", "Daylighter", "lastActive", true],
                ["IMG", "Horizon_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "HungerBotLeft_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "HungerBotRight_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "HungerTopLeft_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "HungerTopRight_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "JohannesNapierToken_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "LockeUlrichToken_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "mapButtonAutarkis_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "mapButtonDistricts_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "mapButtonDomain_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "mapButtonParks_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "mapButtonRack_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "mapButtonRoads_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "mapButtonSitesCulture_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "mapButtonSitesEducation_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "mapButtonSitesHavens_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "mapButtonSitesHealth_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "mapButtonSitesLandmarks_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "mapButtonSitesNightlife_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "mapButtonSitesShopping_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "mapButtonSitesTransportation_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "RollerDie_Big_1", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerDie_Big_2", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerDie_Main_1", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerDie_Main_10", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerDie_Main_11", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerDie_Main_12", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerDie_Main_13", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerDie_Main_14", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerDie_Main_15", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerDie_Main_16", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerDie_Main_17", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerDie_Main_18", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerDie_Main_19", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerDie_Main_2", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerDie_Main_20", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerDie_Main_21", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerDie_Main_22", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerDie_Main_23", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerDie_Main_24", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerDie_Main_25", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerDie_Main_26", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerDie_Main_27", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerDie_Main_28", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerDie_Main_29", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerDie_Main_3", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerDie_Main_30", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerDie_Main_4", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerDie_Main_5", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerDie_Main_6", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerDie_Main_7", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerDie_Main_8", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerDie_Main_9", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerFrame_BottomEnd_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "RollerFrame_BottomMid_1", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerFrame_BottomMid_2", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerFrame_BottomMid_3", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerFrame_BottomMid_4", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerFrame_BottomMid_5", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerFrame_BottomMid_6", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerFrame_BottomMid_7", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerFrame_BottomMid_8", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerFrame_BottomMid_9", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerFrame_Diff_1", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerFrame_Left_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "RollerFrame_TopEnd_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "RollerFrame_TopMid_1", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerFrame_TopMid_2", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerFrame_TopMid_3", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerFrame_TopMid_4", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerFrame_TopMid_5", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerFrame_TopMid_6", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerFrame_TopMid_7", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerFrame_TopMid_8", "modes", "Daylighter", "lastActive", false],
                ["IMG", "RollerFrame_TopMid_9", "modes", "Daylighter", "lastActive", false],
                ["IMG", "SignalLightBotLeft_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "SignalLightBotRight_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "SignalLightTopLeft_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "SignalLightTopRight_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "SiteBarCenter_1", "modes", "Daylighter", "lastActive", false],
                ["IMG", "SiteBarLeft_1", "modes", "Daylighter", "lastActive", false],
                ["IMG", "SiteBarRight_1", "modes", "Daylighter", "lastActive", false],
                ["IMG", "SiteCenter_1", "modes", "Daylighter", "lastActive", false],
                ["IMG", "SiteLeft_1", "modes", "Daylighter", "lastActive", false],
                ["IMG", "SiteRight_1", "modes", "Daylighter", "lastActive", false],
                ["IMG", "stakedAdvantagesHeader_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "TorontoMap_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "SubLocLeft", "modes", "Daylighter", "lastActive", false],
                ["IMG", "SubLocTopLeft", "modes", "Daylighter", "lastActive", false],
                ["IMG", "SubLocBotLeft", "modes", "Daylighter", "lastActive", false],
                ["IMG", "SubLocRight", "modes", "Daylighter", "lastActive", false],
                ["IMG", "SubLocTopRight", "modes", "Daylighter", "lastActive", false],
                ["IMG", "SubLocBotRight", "modes", "Daylighter", "lastActive", false],
                ["IMG", "TorontoMapAutarkisOverlay_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "TorontoMapDistrictsOverlay_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "TorontoMapDomainOverlay_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "TorontoMapParksOverlay_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "TorontoMapRackOverlay_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "TorontoMapRoadsOverlay_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "TorontoMapSitesCultureOverlay_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "TorontoMapSitesEducationOverlay_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "TorontoMapSitesHavensOverlay_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "TorontoMapSitesHealthOverlay_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "TorontoMapSitesLandmarksOverlay_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "TorontoMapSitesNightlifeOverlay_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "TorontoMapSitesShoppingOverlay_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "TorontoMapSitesTransportationOverlay_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "WeatherClouds_1", "modes", "Daylighter", "lastActive", false],
                ["IMG", "WeatherGlow_1", "modes", "Daylighter", "lastActive", false],
                ["IMG", "WeatherFog_1", "modes", "Daylighter", "lastActive", false],
                ["IMG", "WeatherFrost_1", "modes", "Daylighter", "lastActive", false],
                ["IMG", "WeatherGround_1", "modes", "Daylighter", "lastActive", false],
                ["IMG", "WeatherMain_1", "modes", "Daylighter", "lastActive", false],
                ["IMG", "weeklyResourcesHeader_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "wpRerollPlaceholder_1", "modes", "Daylighter", "lastActive", true],
                ["IMG", "AirLightCN_4", "modes", "Daylighter", "lastState", true],
                ["IMG", "AirLightCN_5", "modes", "Daylighter", "lastState", true],
                ["IMG", "AirLightLeft_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "AirLightMid_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "AirLightTop_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "AvaWongToken_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "compCardSpot_1", "modes", "Daylighter", "lastState", false],
                ["IMG", "compCardSpot_10", "modes", "Daylighter", "lastState", false],
                ["IMG", "compCardSpot_2", "modes", "Daylighter", "lastState", false],
                ["IMG", "compCardSpot_3", "modes", "Daylighter", "lastState", false],
                ["IMG", "compCardSpot_4", "modes", "Daylighter", "lastState", false],
                ["IMG", "compCardSpot_5", "modes", "Daylighter", "lastState", false],
                ["IMG", "compCardSpot_6", "modes", "Daylighter", "lastState", false],
                ["IMG", "compCardSpot_7", "modes", "Daylighter", "lastState", false],
                ["IMG", "compCardSpot_8", "modes", "Daylighter", "lastState", false],
                ["IMG", "compCardSpot_9", "modes", "Daylighter", "lastState", false],
                ["IMG", "complicationEnhanced_1", "modes", "Daylighter", "lastState", false],
                ["IMG", "complicationEnhanced_10", "modes", "Daylighter", "lastState", false],
                ["IMG", "complicationEnhanced_2", "modes", "Daylighter", "lastState", false],
                ["IMG", "complicationEnhanced_3", "modes", "Daylighter", "lastState", false],
                ["IMG", "complicationEnhanced_4", "modes", "Daylighter", "lastState", false],
                ["IMG", "complicationEnhanced_5", "modes", "Daylighter", "lastState", false],
                ["IMG", "complicationEnhanced_6", "modes", "Daylighter", "lastState", false],
                ["IMG", "complicationEnhanced_7", "modes", "Daylighter", "lastState", false],
                ["IMG", "complicationEnhanced_8", "modes", "Daylighter", "lastState", false],
                ["IMG", "complicationEnhanced_9", "modes", "Daylighter", "lastState", false],
                ["IMG", "ComplicationMat_1", "modes", "Daylighter", "lastState", false],
                ["IMG", "complicationZero_1", "modes", "Daylighter", "lastState", false],
                ["IMG", "complicationZero_10", "modes", "Daylighter", "lastState", false],
                ["IMG", "complicationZero_2", "modes", "Daylighter", "lastState", false],
                ["IMG", "complicationZero_3", "modes", "Daylighter", "lastState", false],
                ["IMG", "complicationZero_4", "modes", "Daylighter", "lastState", false],
                ["IMG", "complicationZero_5", "modes", "Daylighter", "lastState", false],
                ["IMG", "complicationZero_6", "modes", "Daylighter", "lastState", false],
                ["IMG", "complicationZero_7", "modes", "Daylighter", "lastState", false],
                ["IMG", "complicationZero_8", "modes", "Daylighter", "lastState", false],
                ["IMG", "complicationZero_9", "modes", "Daylighter", "lastState", false],
                ["IMG", "DistrictCenter_1", "modes", "Daylighter", "lastState", false],
                ["IMG", "DistrictLeft_1", "modes", "Daylighter", "lastState", false],
                ["IMG", "DistrictRight_1", "modes", "Daylighter", "lastState", false],
                ["IMG", "downtimeBanner_1", "modes", "Daylighter", "lastState", false],
                ["IMG", ["Dr.ArthurRoyToken_1"], "modes", "Daylighter", "lastState", true],
                ["IMG", "Horizon_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "HungerBotLeft_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "HungerBotRight_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "HungerTopLeft_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "HungerTopRight_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "JohannesNapierToken_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "LockeUlrichToken_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "mapButtonAutarkis_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "mapButtonDistricts_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "mapButtonDomain_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "mapButtonParks_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "mapButtonRack_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "mapButtonRoads_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "mapButtonSitesCulture_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "mapButtonSitesEducation_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "mapButtonSitesHavens_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "mapButtonSitesHealth_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "mapButtonSitesLandmarks_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "mapButtonSitesNightlife_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "mapButtonSitesShopping_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "mapButtonSitesTransportation_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "RollerDie_Big_1", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerDie_Big_2", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerDie_Main_1", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerDie_Main_10", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerDie_Main_11", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerDie_Main_12", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerDie_Main_13", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerDie_Main_14", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerDie_Main_15", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerDie_Main_16", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerDie_Main_17", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerDie_Main_18", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerDie_Main_19", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerDie_Main_2", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerDie_Main_20", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerDie_Main_21", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerDie_Main_22", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerDie_Main_23", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerDie_Main_24", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerDie_Main_25", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerDie_Main_26", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerDie_Main_27", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerDie_Main_28", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerDie_Main_29", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerDie_Main_3", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerDie_Main_30", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerDie_Main_4", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerDie_Main_5", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerDie_Main_6", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerDie_Main_7", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerDie_Main_8", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerDie_Main_9", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerFrame_BottomEnd_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "RollerFrame_BottomMid_1", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerFrame_BottomMid_2", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerFrame_BottomMid_3", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerFrame_BottomMid_4", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerFrame_BottomMid_5", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerFrame_BottomMid_6", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerFrame_BottomMid_7", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerFrame_BottomMid_8", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerFrame_BottomMid_9", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerFrame_Diff_1", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerFrame_Left_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "RollerFrame_TopEnd_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "RollerFrame_TopMid_1", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerFrame_TopMid_2", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerFrame_TopMid_3", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerFrame_TopMid_4", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerFrame_TopMid_5", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerFrame_TopMid_6", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerFrame_TopMid_7", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerFrame_TopMid_8", "modes", "Daylighter", "lastState", false],
                ["IMG", "RollerFrame_TopMid_9", "modes", "Daylighter", "lastState", false],
                ["IMG", "SignalLightBotLeft_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "SignalLightBotRight_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "SignalLightTopLeft_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "SignalLightTopRight_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "SiteBarCenter_1", "modes", "Daylighter", "lastState", false],
                ["IMG", "SiteBarLeft_1", "modes", "Daylighter", "lastState", false],
                ["IMG", "SiteBarRight_1", "modes", "Daylighter", "lastState", false],
                ["IMG", "SiteCenter_1", "modes", "Daylighter", "lastState", false],
                ["IMG", "SiteLeft_1", "modes", "Daylighter", "lastState", false],
                ["IMG", "SiteRight_1", "modes", "Daylighter", "lastState", false],
                ["IMG", "stakedAdvantagesHeader_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "TorontoMap_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "SubLocLeft", "modes", "Daylighter", "lastState", false],
                ["IMG", "SubLocTopLeft", "modes", "Daylighter", "lastState", false],
                ["IMG", "SubLocBotLeft", "modes", "Daylighter", "lastState", false],
                ["IMG", "SubLocRight", "modes", "Daylighter", "lastState", false],
                ["IMG", "SubLocTopRight", "modes", "Daylighter", "lastState", false],
                ["IMG", "SubLocBotRight", "modes", "Daylighter", "lastState", false],
                ["IMG", "TorontoMapAutarkisOverlay_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "TorontoMapDistrictsOverlay_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "TorontoMapDomainOverlay_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "TorontoMapParksOverlay_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "TorontoMapRackOverlay_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "TorontoMapRoadsOverlay_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "TorontoMapSitesCultureOverlay_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "TorontoMapSitesEducationOverlay_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "TorontoMapSitesHavensOverlay_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "TorontoMapSitesHealthOverlay_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "TorontoMapSitesLandmarksOverlay_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "TorontoMapSitesNightlifeOverlay_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "TorontoMapSitesShoppingOverlay_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "TorontoMapSitesTransportationOverlay_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "WeatherClouds_1", "modes", "Daylighter", "lastState", false],
                ["IMG", "WeatherGlow_1", "modes", "Daylighter", "lastState", false],
                ["IMG", "WeatherFog_1", "modes", "Daylighter", "lastState", false],
                ["IMG", "WeatherFrost_1", "modes", "Daylighter", "lastState", false],
                ["IMG", "WeatherGround_1", "modes", "Daylighter", "lastState", false],
                ["IMG", "WeatherMain_1", "modes", "Daylighter", "lastState", false],
                ["IMG", "weeklyResourcesHeader_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "wpRerollPlaceholder_1", "modes", "Daylighter", "lastState", true],
                ["IMG", "AirLightCN_4", "modes", "Downtime", "lastActive", true],
                ["IMG", "AirLightCN_5", "modes", "Downtime", "lastActive", true],
                ["IMG", "AirLightLeft_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "AirLightMid_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "AirLightTop_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "AvaWongToken_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "compCardSpot_1", "modes", "Downtime", "lastActive", false],
                ["IMG", "compCardSpot_10", "modes", "Downtime", "lastActive", false],
                ["IMG", "compCardSpot_2", "modes", "Downtime", "lastActive", false],
                ["IMG", "compCardSpot_3", "modes", "Downtime", "lastActive", false],
                ["IMG", "compCardSpot_4", "modes", "Downtime", "lastActive", false],
                ["IMG", "compCardSpot_5", "modes", "Downtime", "lastActive", false],
                ["IMG", "compCardSpot_6", "modes", "Downtime", "lastActive", false],
                ["IMG", "compCardSpot_7", "modes", "Downtime", "lastActive", false],
                ["IMG", "compCardSpot_8", "modes", "Downtime", "lastActive", false],
                ["IMG", "compCardSpot_9", "modes", "Downtime", "lastActive", false],
                ["IMG", "complicationEnhanced_1", "modes", "Downtime", "lastActive", false],
                ["IMG", "complicationEnhanced_10", "modes", "Downtime", "lastActive", false],
                ["IMG", "complicationEnhanced_2", "modes", "Downtime", "lastActive", false],
                ["IMG", "complicationEnhanced_3", "modes", "Downtime", "lastActive", false],
                ["IMG", "complicationEnhanced_4", "modes", "Downtime", "lastActive", false],
                ["IMG", "complicationEnhanced_5", "modes", "Downtime", "lastActive", false],
                ["IMG", "complicationEnhanced_6", "modes", "Downtime", "lastActive", false],
                ["IMG", "complicationEnhanced_7", "modes", "Downtime", "lastActive", false],
                ["IMG", "complicationEnhanced_8", "modes", "Downtime", "lastActive", false],
                ["IMG", "complicationEnhanced_9", "modes", "Downtime", "lastActive", false],
                ["IMG", "ComplicationMat_1", "modes", "Downtime", "lastActive", false],
                ["IMG", "complicationZero_1", "modes", "Downtime", "lastActive", false],
                ["IMG", "complicationZero_10", "modes", "Downtime", "lastActive", false],
                ["IMG", "complicationZero_2", "modes", "Downtime", "lastActive", false],
                ["IMG", "complicationZero_3", "modes", "Downtime", "lastActive", false],
                ["IMG", "complicationZero_4", "modes", "Downtime", "lastActive", false],
                ["IMG", "complicationZero_5", "modes", "Downtime", "lastActive", false],
                ["IMG", "complicationZero_6", "modes", "Downtime", "lastActive", false],
                ["IMG", "complicationZero_7", "modes", "Downtime", "lastActive", false],
                ["IMG", "complicationZero_8", "modes", "Downtime", "lastActive", false],
                ["IMG", "complicationZero_9", "modes", "Downtime", "lastActive", false],
                ["IMG", "DistrictCenter_1", "modes", "Downtime", "lastActive", false],
                ["IMG", "DistrictLeft_1", "modes", "Downtime", "lastActive", false],
                ["IMG", "DistrictRight_1", "modes", "Downtime", "lastActive", false],
                ["IMG", "downtimeBanner_1", "modes", "Downtime", "lastActive", false],
                ["IMG", ["Dr.ArthurRoyToken_1"], "modes", "Downtime", "lastActive", true],
                ["IMG", "Horizon_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "HungerBotLeft_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "HungerBotRight_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "HungerTopLeft_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "HungerTopRight_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "JohannesNapierToken_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "LockeUlrichToken_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "mapButtonAutarkis_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "mapButtonDistricts_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "mapButtonDomain_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "mapButtonParks_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "mapButtonRack_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "mapButtonRoads_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "mapButtonSitesCulture_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "mapButtonSitesEducation_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "mapButtonSitesHavens_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "mapButtonSitesHealth_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "mapButtonSitesLandmarks_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "mapButtonSitesNightlife_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "mapButtonSitesShopping_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "mapButtonSitesTransportation_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "RollerDie_Big_1", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerDie_Big_2", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerDie_Main_1", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerDie_Main_10", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerDie_Main_11", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerDie_Main_12", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerDie_Main_13", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerDie_Main_14", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerDie_Main_15", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerDie_Main_16", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerDie_Main_17", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerDie_Main_18", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerDie_Main_19", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerDie_Main_2", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerDie_Main_20", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerDie_Main_21", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerDie_Main_22", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerDie_Main_23", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerDie_Main_24", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerDie_Main_25", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerDie_Main_26", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerDie_Main_27", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerDie_Main_28", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerDie_Main_29", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerDie_Main_3", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerDie_Main_30", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerDie_Main_4", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerDie_Main_5", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerDie_Main_6", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerDie_Main_7", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerDie_Main_8", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerDie_Main_9", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerFrame_BottomEnd_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "RollerFrame_BottomMid_1", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerFrame_BottomMid_2", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerFrame_BottomMid_3", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerFrame_BottomMid_4", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerFrame_BottomMid_5", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerFrame_BottomMid_6", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerFrame_BottomMid_7", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerFrame_BottomMid_8", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerFrame_BottomMid_9", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerFrame_Diff_1", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerFrame_Left_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "RollerFrame_TopEnd_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "RollerFrame_TopMid_1", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerFrame_TopMid_2", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerFrame_TopMid_3", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerFrame_TopMid_4", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerFrame_TopMid_5", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerFrame_TopMid_6", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerFrame_TopMid_7", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerFrame_TopMid_8", "modes", "Downtime", "lastActive", false],
                ["IMG", "RollerFrame_TopMid_9", "modes", "Downtime", "lastActive", false],
                ["IMG", "SignalLightBotLeft_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "SignalLightBotRight_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "SignalLightTopLeft_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "SignalLightTopRight_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "SiteBarCenter_1", "modes", "Downtime", "lastActive", false],
                ["IMG", "SiteBarLeft_1", "modes", "Downtime", "lastActive", false],
                ["IMG", "SiteBarRight_1", "modes", "Downtime", "lastActive", false],
                ["IMG", "SiteCenter_1", "modes", "Downtime", "lastActive", false],
                ["IMG", "SiteLeft_1", "modes", "Downtime", "lastActive", false],
                ["IMG", "SiteRight_1", "modes", "Downtime", "lastActive", false],
                ["IMG", "stakedAdvantagesHeader_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "TorontoMap_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "SubLocLeft", "modes", "Downtime", "lastActive", false],
                ["IMG", "SubLocTopLeft", "modes", "Downtime", "lastActive", false],
                ["IMG", "SubLocBotLeft", "modes", "Downtime", "lastActive", false],
                ["IMG", "SubLocRight", "modes", "Downtime", "lastActive", false],
                ["IMG", "SubLocTopRight", "modes", "Downtime", "lastActive", false],
                ["IMG", "SubLocBotRight", "modes", "Downtime", "lastActive", false],
                ["IMG", "TorontoMapAutarkisOverlay_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "TorontoMapDistrictsOverlay_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "TorontoMapDomainOverlay_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "TorontoMapParksOverlay_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "TorontoMapRackOverlay_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "TorontoMapRoadsOverlay_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "TorontoMapSitesCultureOverlay_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "TorontoMapSitesEducationOverlay_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "TorontoMapSitesHavensOverlay_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "TorontoMapSitesHealthOverlay_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "TorontoMapSitesLandmarksOverlay_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "TorontoMapSitesNightlifeOverlay_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "TorontoMapSitesShoppingOverlay_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "TorontoMapSitesTransportationOverlay_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "WeatherClouds_1", "modes", "Downtime", "lastActive", false],
                ["IMG", "WeatherGlow_1", "modes", "Downtime", "lastActive", false],
                ["IMG", "WeatherFog_1", "modes", "Downtime", "lastActive", false],
                ["IMG", "WeatherFrost_1", "modes", "Downtime", "lastActive", false],
                ["IMG", "WeatherGround_1", "modes", "Downtime", "lastActive", false],
                ["IMG", "WeatherMain_1", "modes", "Downtime", "lastActive", false],
                ["IMG", "weeklyResourcesHeader_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "wpRerollPlaceholder_1", "modes", "Downtime", "lastActive", true],
                ["IMG", "AirLightCN_4", "modes", "Downtime", "lastState", true],
                ["IMG", "AirLightCN_5", "modes", "Downtime", "lastState", true],
                ["IMG", "AirLightLeft_1", "modes", "Downtime", "lastState", true],
                ["IMG", "AirLightMid_1", "modes", "Downtime", "lastState", true],
                ["IMG", "AirLightTop_1", "modes", "Downtime", "lastState", true],
                ["IMG", "AvaWongToken_1", "modes", "Downtime", "lastState", true],
                ["IMG", "compCardSpot_1", "modes", "Downtime", "lastState", false],
                ["IMG", "compCardSpot_10", "modes", "Downtime", "lastState", false],
                ["IMG", "compCardSpot_2", "modes", "Downtime", "lastState", false],
                ["IMG", "compCardSpot_3", "modes", "Downtime", "lastState", false],
                ["IMG", "compCardSpot_4", "modes", "Downtime", "lastState", false],
                ["IMG", "compCardSpot_5", "modes", "Downtime", "lastState", false],
                ["IMG", "compCardSpot_6", "modes", "Downtime", "lastState", false],
                ["IMG", "compCardSpot_7", "modes", "Downtime", "lastState", false],
                ["IMG", "compCardSpot_8", "modes", "Downtime", "lastState", false],
                ["IMG", "compCardSpot_9", "modes", "Downtime", "lastState", false],
                ["IMG", "complicationEnhanced_1", "modes", "Downtime", "lastState", false],
                ["IMG", "complicationEnhanced_10", "modes", "Downtime", "lastState", false],
                ["IMG", "complicationEnhanced_2", "modes", "Downtime", "lastState", false],
                ["IMG", "complicationEnhanced_3", "modes", "Downtime", "lastState", false],
                ["IMG", "complicationEnhanced_4", "modes", "Downtime", "lastState", false],
                ["IMG", "complicationEnhanced_5", "modes", "Downtime", "lastState", false],
                ["IMG", "complicationEnhanced_6", "modes", "Downtime", "lastState", false],
                ["IMG", "complicationEnhanced_7", "modes", "Downtime", "lastState", false],
                ["IMG", "complicationEnhanced_8", "modes", "Downtime", "lastState", false],
                ["IMG", "complicationEnhanced_9", "modes", "Downtime", "lastState", false],
                ["IMG", "ComplicationMat_1", "modes", "Downtime", "lastState", false],
                ["IMG", "complicationZero_1", "modes", "Downtime", "lastState", false],
                ["IMG", "complicationZero_10", "modes", "Downtime", "lastState", false],
                ["IMG", "complicationZero_2", "modes", "Downtime", "lastState", false],
                ["IMG", "complicationZero_3", "modes", "Downtime", "lastState", false],
                ["IMG", "complicationZero_4", "modes", "Downtime", "lastState", false],
                ["IMG", "complicationZero_5", "modes", "Downtime", "lastState", false],
                ["IMG", "complicationZero_6", "modes", "Downtime", "lastState", false],
                ["IMG", "complicationZero_7", "modes", "Downtime", "lastState", false],
                ["IMG", "complicationZero_8", "modes", "Downtime", "lastState", false],
                ["IMG", "complicationZero_9", "modes", "Downtime", "lastState", false],
                ["IMG", "DistrictCenter_1", "modes", "Downtime", "lastState", false],
                ["IMG", "DistrictLeft_1", "modes", "Downtime", "lastState", false],
                ["IMG", "DistrictRight_1", "modes", "Downtime", "lastState", false],
                ["IMG", "downtimeBanner_1", "modes", "Downtime", "lastState", false],
                ["IMG", ["Dr.ArthurRoyToken_1"], "modes", "Downtime", "lastState", true],
                ["IMG", "Horizon_1", "modes", "Downtime", "lastState", true],
                ["IMG", "HungerBotLeft_1", "modes", "Downtime", "lastState", true],
                ["IMG", "HungerBotRight_1", "modes", "Downtime", "lastState", true],
                ["IMG", "HungerTopLeft_1", "modes", "Downtime", "lastState", true],
                ["IMG", "HungerTopRight_1", "modes", "Downtime", "lastState", true],
                ["IMG", "JohannesNapierToken_1", "modes", "Downtime", "lastState", true],
                ["IMG", "LockeUlrichToken_1", "modes", "Downtime", "lastState", true],
                ["IMG", "mapButtonAutarkis_1", "modes", "Downtime", "lastState", true],
                ["IMG", "mapButtonDistricts_1", "modes", "Downtime", "lastState", true],
                ["IMG", "mapButtonDomain_1", "modes", "Downtime", "lastState", true],
                ["IMG", "mapButtonParks_1", "modes", "Downtime", "lastState", true],
                ["IMG", "mapButtonRack_1", "modes", "Downtime", "lastState", true],
                ["IMG", "mapButtonRoads_1", "modes", "Downtime", "lastState", true],
                ["IMG", "mapButtonSitesCulture_1", "modes", "Downtime", "lastState", true],
                ["IMG", "mapButtonSitesEducation_1", "modes", "Downtime", "lastState", true],
                ["IMG", "mapButtonSitesHavens_1", "modes", "Downtime", "lastState", true],
                ["IMG", "mapButtonSitesHealth_1", "modes", "Downtime", "lastState", true],
                ["IMG", "mapButtonSitesLandmarks_1", "modes", "Downtime", "lastState", true],
                ["IMG", "mapButtonSitesNightlife_1", "modes", "Downtime", "lastState", true],
                ["IMG", "mapButtonSitesShopping_1", "modes", "Downtime", "lastState", true],
                ["IMG", "mapButtonSitesTransportation_1", "modes", "Downtime", "lastState", true],
                ["IMG", "RollerDie_Big_1", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerDie_Big_2", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerDie_Main_1", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerDie_Main_10", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerDie_Main_11", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerDie_Main_12", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerDie_Main_13", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerDie_Main_14", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerDie_Main_15", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerDie_Main_16", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerDie_Main_17", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerDie_Main_18", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerDie_Main_19", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerDie_Main_2", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerDie_Main_20", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerDie_Main_21", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerDie_Main_22", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerDie_Main_23", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerDie_Main_24", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerDie_Main_25", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerDie_Main_26", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerDie_Main_27", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerDie_Main_28", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerDie_Main_29", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerDie_Main_3", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerDie_Main_30", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerDie_Main_4", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerDie_Main_5", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerDie_Main_6", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerDie_Main_7", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerDie_Main_8", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerDie_Main_9", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerFrame_BottomEnd_1", "modes", "Downtime", "lastState", true],
                ["IMG", "RollerFrame_BottomMid_1", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerFrame_BottomMid_2", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerFrame_BottomMid_3", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerFrame_BottomMid_4", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerFrame_BottomMid_5", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerFrame_BottomMid_6", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerFrame_BottomMid_7", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerFrame_BottomMid_8", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerFrame_BottomMid_9", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerFrame_Diff_1", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerFrame_Left_1", "modes", "Downtime", "lastState", true],
                ["IMG", "RollerFrame_TopEnd_1", "modes", "Downtime", "lastState", true],
                ["IMG", "RollerFrame_TopMid_1", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerFrame_TopMid_2", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerFrame_TopMid_3", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerFrame_TopMid_4", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerFrame_TopMid_5", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerFrame_TopMid_6", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerFrame_TopMid_7", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerFrame_TopMid_8", "modes", "Downtime", "lastState", false],
                ["IMG", "RollerFrame_TopMid_9", "modes", "Downtime", "lastState", false],
                ["IMG", "SignalLightBotLeft_1", "modes", "Downtime", "lastState", true],
                ["IMG", "SignalLightBotRight_1", "modes", "Downtime", "lastState", true],
                ["IMG", "SignalLightTopLeft_1", "modes", "Downtime", "lastState", true],
                ["IMG", "SignalLightTopRight_1", "modes", "Downtime", "lastState", true],
                ["IMG", "SiteBarCenter_1", "modes", "Downtime", "lastState", false],
                ["IMG", "SiteBarLeft_1", "modes", "Downtime", "lastState", false],
                ["IMG", "SiteBarRight_1", "modes", "Downtime", "lastState", false],
                ["IMG", "SiteCenter_1", "modes", "Downtime", "lastState", false],
                ["IMG", "SiteLeft_1", "modes", "Downtime", "lastState", false],
                ["IMG", "SiteRight_1", "modes", "Downtime", "lastState", false],
                ["IMG", "stakedAdvantagesHeader_1", "modes", "Downtime", "lastState", true],
                ["IMG", "TorontoMap_1", "modes", "Downtime", "lastState", true],
                ["IMG", "SubLocLeft", "modes", "Downtime", "lastState", false],
                ["IMG", "SubLocTopLeft", "modes", "Downtime", "lastState", false],
                ["IMG", "SubLocBotLeft", "modes", "Downtime", "lastState", false],
                ["IMG", "SubLocRight", "modes", "Downtime", "lastState", false],
                ["IMG", "SubLocTopRight", "modes", "Downtime", "lastState", false],
                ["IMG", "SubLocBotRight", "modes", "Downtime", "lastState", false],
                ["IMG", "TorontoMapAutarkisOverlay_1", "modes", "Downtime", "lastState", true],
                ["IMG", "TorontoMapDistrictsOverlay_1", "modes", "Downtime", "lastState", true],
                ["IMG", "TorontoMapDomainOverlay_1", "modes", "Downtime", "lastState", true],
                ["IMG", "TorontoMapParksOverlay_1", "modes", "Downtime", "lastState", true],
                ["IMG", "TorontoMapRackOverlay_1", "modes", "Downtime", "lastState", true],
                ["IMG", "TorontoMapRoadsOverlay_1", "modes", "Downtime", "lastState", true],
                ["IMG", "TorontoMapSitesCultureOverlay_1", "modes", "Downtime", "lastState", true],
                ["IMG", "TorontoMapSitesEducationOverlay_1", "modes", "Downtime", "lastState", true],
                ["IMG", "TorontoMapSitesHavensOverlay_1", "modes", "Downtime", "lastState", true],
                ["IMG", "TorontoMapSitesHealthOverlay_1", "modes", "Downtime", "lastState", true],
                ["IMG", "TorontoMapSitesLandmarksOverlay_1", "modes", "Downtime", "lastState", true],
                ["IMG", "TorontoMapSitesNightlifeOverlay_1", "modes", "Downtime", "lastState", true],
                ["IMG", "TorontoMapSitesShoppingOverlay_1", "modes", "Downtime", "lastState", true],
                ["IMG", "TorontoMapSitesTransportationOverlay_1", "modes", "Downtime", "lastState", true],
                ["IMG", "WeatherClouds_1", "modes", "Downtime", "lastState", false],
                ["IMG", "WeatherGlow_1", "modes", "Downtime", "lastState", false],
                ["IMG", "WeatherFog_1", "modes", "Downtime", "lastState", false],
                ["IMG", "WeatherFrost_1", "modes", "Downtime", "lastState", false],
                ["IMG", "WeatherGround_1", "modes", "Downtime", "lastState", false],
                ["IMG", "WeatherMain_1", "modes", "Downtime", "lastState", false],
                ["IMG", "weeklyResourcesHeader_1", "modes", "Downtime", "lastState", true],
                ["IMG", "wpRerollPlaceholder_1", "modes", "Downtime", "lastState", true],
                ["IMG", "AirLightCN_4", "modes", "Complications", "lastActive", true],
                ["IMG", "AirLightCN_5", "modes", "Complications", "lastActive", true],
                ["IMG", "AirLightLeft_1", "modes", "Complications", "lastActive", true],
                ["IMG", "AirLightMid_1", "modes", "Complications", "lastActive", true],
                ["IMG", "AirLightTop_1", "modes", "Complications", "lastActive", true],
                ["IMG", "AvaWongToken_1", "modes", "Complications", "lastActive", true],
                ["IMG", "compCardSpot_1", "modes", "Complications", "lastActive", false],
                ["IMG", "compCardSpot_10", "modes", "Complications", "lastActive", false],
                ["IMG", "compCardSpot_2", "modes", "Complications", "lastActive", false],
                ["IMG", "compCardSpot_3", "modes", "Complications", "lastActive", false],
                ["IMG", "compCardSpot_4", "modes", "Complications", "lastActive", false],
                ["IMG", "compCardSpot_5", "modes", "Complications", "lastActive", false],
                ["IMG", "compCardSpot_6", "modes", "Complications", "lastActive", false],
                ["IMG", "compCardSpot_7", "modes", "Complications", "lastActive", false],
                ["IMG", "compCardSpot_8", "modes", "Complications", "lastActive", false],
                ["IMG", "compCardSpot_9", "modes", "Complications", "lastActive", false],
                ["IMG", "complicationEnhanced_1", "modes", "Complications", "lastActive", false],
                ["IMG", "complicationEnhanced_10", "modes", "Complications", "lastActive", false],
                ["IMG", "complicationEnhanced_2", "modes", "Complications", "lastActive", false],
                ["IMG", "complicationEnhanced_3", "modes", "Complications", "lastActive", false],
                ["IMG", "complicationEnhanced_4", "modes", "Complications", "lastActive", false],
                ["IMG", "complicationEnhanced_5", "modes", "Complications", "lastActive", false],
                ["IMG", "complicationEnhanced_6", "modes", "Complications", "lastActive", false],
                ["IMG", "complicationEnhanced_7", "modes", "Complications", "lastActive", false],
                ["IMG", "complicationEnhanced_8", "modes", "Complications", "lastActive", false],
                ["IMG", "complicationEnhanced_9", "modes", "Complications", "lastActive", false],
                ["IMG", "ComplicationMat_1", "modes", "Complications", "lastActive", false],
                ["IMG", "complicationZero_1", "modes", "Complications", "lastActive", false],
                ["IMG", "complicationZero_10", "modes", "Complications", "lastActive", false],
                ["IMG", "complicationZero_2", "modes", "Complications", "lastActive", false],
                ["IMG", "complicationZero_3", "modes", "Complications", "lastActive", false],
                ["IMG", "complicationZero_4", "modes", "Complications", "lastActive", false],
                ["IMG", "complicationZero_5", "modes", "Complications", "lastActive", false],
                ["IMG", "complicationZero_6", "modes", "Complications", "lastActive", false],
                ["IMG", "complicationZero_7", "modes", "Complications", "lastActive", false],
                ["IMG", "complicationZero_8", "modes", "Complications", "lastActive", false],
                ["IMG", "complicationZero_9", "modes", "Complications", "lastActive", false],
                ["IMG", "DistrictCenter_1", "modes", "Complications", "lastActive", false],
                ["IMG", "DistrictLeft_1", "modes", "Complications", "lastActive", false],
                ["IMG", "DistrictRight_1", "modes", "Complications", "lastActive", false],
                ["IMG", "downtimeBanner_1", "modes", "Complications", "lastActive", false],
                ["IMG", ["Dr.ArthurRoyToken_1"], "modes", "Complications", "lastActive", true],
                ["IMG", "Horizon_1", "modes", "Complications", "lastActive", true],
                ["IMG", "HungerBotLeft_1", "modes", "Complications", "lastActive", true],
                ["IMG", "HungerBotRight_1", "modes", "Complications", "lastActive", true],
                ["IMG", "HungerTopLeft_1", "modes", "Complications", "lastActive", true],
                ["IMG", "HungerTopRight_1", "modes", "Complications", "lastActive", true],
                ["IMG", "JohannesNapierToken_1", "modes", "Complications", "lastActive", true],
                ["IMG", "LockeUlrichToken_1", "modes", "Complications", "lastActive", true],
                ["IMG", "mapButtonAutarkis_1", "modes", "Complications", "lastActive", true],
                ["IMG", "mapButtonDistricts_1", "modes", "Complications", "lastActive", true],
                ["IMG", "mapButtonDomain_1", "modes", "Complications", "lastActive", true],
                ["IMG", "mapButtonParks_1", "modes", "Complications", "lastActive", true],
                ["IMG", "mapButtonRack_1", "modes", "Complications", "lastActive", true],
                ["IMG", "mapButtonRoads_1", "modes", "Complications", "lastActive", true],
                ["IMG", "mapButtonSitesCulture_1", "modes", "Complications", "lastActive", true],
                ["IMG", "mapButtonSitesEducation_1", "modes", "Complications", "lastActive", true],
                ["IMG", "mapButtonSitesHavens_1", "modes", "Complications", "lastActive", true],
                ["IMG", "mapButtonSitesHealth_1", "modes", "Complications", "lastActive", true],
                ["IMG", "mapButtonSitesLandmarks_1", "modes", "Complications", "lastActive", true],
                ["IMG", "mapButtonSitesNightlife_1", "modes", "Complications", "lastActive", true],
                ["IMG", "mapButtonSitesShopping_1", "modes", "Complications", "lastActive", true],
                ["IMG", "mapButtonSitesTransportation_1", "modes", "Complications", "lastActive", true],
                ["IMG", "RollerDie_Big_1", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerDie_Big_2", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerDie_Main_1", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerDie_Main_10", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerDie_Main_11", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerDie_Main_12", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerDie_Main_13", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerDie_Main_14", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerDie_Main_15", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerDie_Main_16", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerDie_Main_17", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerDie_Main_18", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerDie_Main_19", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerDie_Main_2", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerDie_Main_20", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerDie_Main_21", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerDie_Main_22", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerDie_Main_23", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerDie_Main_24", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerDie_Main_25", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerDie_Main_26", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerDie_Main_27", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerDie_Main_28", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerDie_Main_29", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerDie_Main_3", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerDie_Main_30", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerDie_Main_4", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerDie_Main_5", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerDie_Main_6", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerDie_Main_7", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerDie_Main_8", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerDie_Main_9", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerFrame_BottomEnd_1", "modes", "Complications", "lastActive", true],
                ["IMG", "RollerFrame_BottomMid_1", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerFrame_BottomMid_2", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerFrame_BottomMid_3", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerFrame_BottomMid_4", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerFrame_BottomMid_5", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerFrame_BottomMid_6", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerFrame_BottomMid_7", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerFrame_BottomMid_8", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerFrame_BottomMid_9", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerFrame_Diff_1", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerFrame_Left_1", "modes", "Complications", "lastActive", true],
                ["IMG", "RollerFrame_TopEnd_1", "modes", "Complications", "lastActive", true],
                ["IMG", "RollerFrame_TopMid_1", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerFrame_TopMid_2", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerFrame_TopMid_3", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerFrame_TopMid_4", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerFrame_TopMid_5", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerFrame_TopMid_6", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerFrame_TopMid_7", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerFrame_TopMid_8", "modes", "Complications", "lastActive", false],
                ["IMG", "RollerFrame_TopMid_9", "modes", "Complications", "lastActive", false],
                ["IMG", "SignalLightBotLeft_1", "modes", "Complications", "lastActive", true],
                ["IMG", "SignalLightBotRight_1", "modes", "Complications", "lastActive", true],
                ["IMG", "SignalLightTopLeft_1", "modes", "Complications", "lastActive", true],
                ["IMG", "SignalLightTopRight_1", "modes", "Complications", "lastActive", true],
                ["IMG", "SiteBarCenter_1", "modes", "Complications", "lastActive", false],
                ["IMG", "SiteBarLeft_1", "modes", "Complications", "lastActive", false],
                ["IMG", "SiteBarRight_1", "modes", "Complications", "lastActive", false],
                ["IMG", "SiteCenter_1", "modes", "Complications", "lastActive", false],
                ["IMG", "SiteLeft_1", "modes", "Complications", "lastActive", false],
                ["IMG", "SiteRight_1", "modes", "Complications", "lastActive", false],
                ["IMG", "stakedAdvantagesHeader_1", "modes", "Complications", "lastActive", true],
                ["IMG", "TorontoMap_1", "modes", "Complications", "lastActive", true],
                ["IMG", "SubLocLeft", "modes", "Complications", "lastActive", false],
                ["IMG", "SubLocTopLeft", "modes", "Complications", "lastActive", false],
                ["IMG", "SubLocBotLeft", "modes", "Complications", "lastActive", false],
                ["IMG", "SubLocRight", "modes", "Complications", "lastActive", false],
                ["IMG", "SubLocTopRight", "modes", "Complications", "lastActive", false],
                ["IMG", "SubLocBotRight", "modes", "Complications", "lastActive", false],
                ["IMG", "TorontoMapAutarkisOverlay_1", "modes", "Complications", "lastActive", true],
                ["IMG", "TorontoMapDistrictsOverlay_1", "modes", "Complications", "lastActive", true],
                ["IMG", "TorontoMapDomainOverlay_1", "modes", "Complications", "lastActive", true],
                ["IMG", "TorontoMapParksOverlay_1", "modes", "Complications", "lastActive", true],
                ["IMG", "TorontoMapRackOverlay_1", "modes", "Complications", "lastActive", true],
                ["IMG", "TorontoMapRoadsOverlay_1", "modes", "Complications", "lastActive", true],
                ["IMG", "TorontoMapSitesCultureOverlay_1", "modes", "Complications", "lastActive", true],
                ["IMG", "TorontoMapSitesEducationOverlay_1", "modes", "Complications", "lastActive", true],
                ["IMG", "TorontoMapSitesHavensOverlay_1", "modes", "Complications", "lastActive", true],
                ["IMG", "TorontoMapSitesHealthOverlay_1", "modes", "Complications", "lastActive", true],
                ["IMG", "TorontoMapSitesLandmarksOverlay_1", "modes", "Complications", "lastActive", true],
                ["IMG", "TorontoMapSitesNightlifeOverlay_1", "modes", "Complications", "lastActive", true],
                ["IMG", "TorontoMapSitesShoppingOverlay_1", "modes", "Complications", "lastActive", true],
                ["IMG", "TorontoMapSitesTransportationOverlay_1", "modes", "Complications", "lastActive", true],
                ["IMG", "WeatherClouds_1", "modes", "Complications", "lastActive", false],
                ["IMG", "WeatherGlow_1", "modes", "Complications", "lastActive", false],
                ["IMG", "WeatherFog_1", "modes", "Complications", "lastActive", false],
                ["IMG", "WeatherFrost_1", "modes", "Complications", "lastActive", false],
                ["IMG", "WeatherGround_1", "modes", "Complications", "lastActive", false],
                ["IMG", "WeatherMain_1", "modes", "Complications", "lastActive", false],
                ["IMG", "weeklyResourcesHeader_1", "modes", "Complications", "lastActive", true],
                ["IMG", "wpRerollPlaceholder_1", "modes", "Complications", "lastActive", true],
                ["IMG", "AirLightCN_4", "modes", "Complications", "lastState", true],
                ["IMG", "AirLightCN_5", "modes", "Complications", "lastState", true],
                ["IMG", "AirLightLeft_1", "modes", "Complications", "lastState", true],
                ["IMG", "AirLightMid_1", "modes", "Complications", "lastState", true],
                ["IMG", "AirLightTop_1", "modes", "Complications", "lastState", true],
                ["IMG", "AvaWongToken_1", "modes", "Complications", "lastState", true],
                ["IMG", "compCardSpot_1", "modes", "Complications", "lastState", false],
                ["IMG", "compCardSpot_10", "modes", "Complications", "lastState", false],
                ["IMG", "compCardSpot_2", "modes", "Complications", "lastState", false],
                ["IMG", "compCardSpot_3", "modes", "Complications", "lastState", false],
                ["IMG", "compCardSpot_4", "modes", "Complications", "lastState", false],
                ["IMG", "compCardSpot_5", "modes", "Complications", "lastState", false],
                ["IMG", "compCardSpot_6", "modes", "Complications", "lastState", false],
                ["IMG", "compCardSpot_7", "modes", "Complications", "lastState", false],
                ["IMG", "compCardSpot_8", "modes", "Complications", "lastState", false],
                ["IMG", "compCardSpot_9", "modes", "Complications", "lastState", false],
                ["IMG", "complicationEnhanced_1", "modes", "Complications", "lastState", false],
                ["IMG", "complicationEnhanced_10", "modes", "Complications", "lastState", false],
                ["IMG", "complicationEnhanced_2", "modes", "Complications", "lastState", false],
                ["IMG", "complicationEnhanced_3", "modes", "Complications", "lastState", false],
                ["IMG", "complicationEnhanced_4", "modes", "Complications", "lastState", false],
                ["IMG", "complicationEnhanced_5", "modes", "Complications", "lastState", false],
                ["IMG", "complicationEnhanced_6", "modes", "Complications", "lastState", false],
                ["IMG", "complicationEnhanced_7", "modes", "Complications", "lastState", false],
                ["IMG", "complicationEnhanced_8", "modes", "Complications", "lastState", false],
                ["IMG", "complicationEnhanced_9", "modes", "Complications", "lastState", false],
                ["IMG", "ComplicationMat_1", "modes", "Complications", "lastState", false],
                ["IMG", "complicationZero_1", "modes", "Complications", "lastState", false],
                ["IMG", "complicationZero_10", "modes", "Complications", "lastState", false],
                ["IMG", "complicationZero_2", "modes", "Complications", "lastState", false],
                ["IMG", "complicationZero_3", "modes", "Complications", "lastState", false],
                ["IMG", "complicationZero_4", "modes", "Complications", "lastState", false],
                ["IMG", "complicationZero_5", "modes", "Complications", "lastState", false],
                ["IMG", "complicationZero_6", "modes", "Complications", "lastState", false],
                ["IMG", "complicationZero_7", "modes", "Complications", "lastState", false],
                ["IMG", "complicationZero_8", "modes", "Complications", "lastState", false],
                ["IMG", "complicationZero_9", "modes", "Complications", "lastState", false],
                ["IMG", "DistrictCenter_1", "modes", "Complications", "lastState", false],
                ["IMG", "DistrictLeft_1", "modes", "Complications", "lastState", false],
                ["IMG", "DistrictRight_1", "modes", "Complications", "lastState", false],
                ["IMG", "downtimeBanner_1", "modes", "Complications", "lastState", false],
                ["IMG", ["Dr.ArthurRoyToken_1"], "modes", "Complications", "lastState", true],
                ["IMG", "Horizon_1", "modes", "Complications", "lastState", true],
                ["IMG", "HungerBotLeft_1", "modes", "Complications", "lastState", true],
                ["IMG", "HungerBotRight_1", "modes", "Complications", "lastState", true],
                ["IMG", "HungerTopLeft_1", "modes", "Complications", "lastState", true],
                ["IMG", "HungerTopRight_1", "modes", "Complications", "lastState", true],
                ["IMG", "JohannesNapierToken_1", "modes", "Complications", "lastState", true],
                ["IMG", "LockeUlrichToken_1", "modes", "Complications", "lastState", true],
                ["IMG", "mapButtonAutarkis_1", "modes", "Complications", "lastState", true],
                ["IMG", "mapButtonDistricts_1", "modes", "Complications", "lastState", true],
                ["IMG", "mapButtonDomain_1", "modes", "Complications", "lastState", true],
                ["IMG", "mapButtonParks_1", "modes", "Complications", "lastState", true],
                ["IMG", "mapButtonRack_1", "modes", "Complications", "lastState", true],
                ["IMG", "mapButtonRoads_1", "modes", "Complications", "lastState", true],
                ["IMG", "mapButtonSitesCulture_1", "modes", "Complications", "lastState", true],
                ["IMG", "mapButtonSitesEducation_1", "modes", "Complications", "lastState", true],
                ["IMG", "mapButtonSitesHavens_1", "modes", "Complications", "lastState", true],
                ["IMG", "mapButtonSitesHealth_1", "modes", "Complications", "lastState", true],
                ["IMG", "mapButtonSitesLandmarks_1", "modes", "Complications", "lastState", true],
                ["IMG", "mapButtonSitesNightlife_1", "modes", "Complications", "lastState", true],
                ["IMG", "mapButtonSitesShopping_1", "modes", "Complications", "lastState", true],
                ["IMG", "mapButtonSitesTransportation_1", "modes", "Complications", "lastState", true],
                ["IMG", "RollerDie_Big_1", "modes", "Complications", "lastState", false],
                ["IMG", "RollerDie_Big_2", "modes", "Complications", "lastState", false],
                ["IMG", "RollerDie_Main_1", "modes", "Complications", "lastState", false],
                ["IMG", "RollerDie_Main_10", "modes", "Complications", "lastState", false],
                ["IMG", "RollerDie_Main_11", "modes", "Complications", "lastState", false],
                ["IMG", "RollerDie_Main_12", "modes", "Complications", "lastState", false],
                ["IMG", "RollerDie_Main_13", "modes", "Complications", "lastState", false],
                ["IMG", "RollerDie_Main_14", "modes", "Complications", "lastState", false],
                ["IMG", "RollerDie_Main_15", "modes", "Complications", "lastState", false],
                ["IMG", "RollerDie_Main_16", "modes", "Complications", "lastState", false],
                ["IMG", "RollerDie_Main_17", "modes", "Complications", "lastState", false],
                ["IMG", "RollerDie_Main_18", "modes", "Complications", "lastState", false],
                ["IMG", "RollerDie_Main_19", "modes", "Complications", "lastState", false],
                ["IMG", "RollerDie_Main_2", "modes", "Complications", "lastState", false],
                ["IMG", "RollerDie_Main_20", "modes", "Complications", "lastState", false],
                ["IMG", "RollerDie_Main_21", "modes", "Complications", "lastState", false],
                ["IMG", "RollerDie_Main_22", "modes", "Complications", "lastState", false],
                ["IMG", "RollerDie_Main_23", "modes", "Complications", "lastState", false],
                ["IMG", "RollerDie_Main_24", "modes", "Complications", "lastState", false],
                ["IMG", "RollerDie_Main_25", "modes", "Complications", "lastState", false],
                ["IMG", "RollerDie_Main_26", "modes", "Complications", "lastState", false],
                ["IMG", "RollerDie_Main_27", "modes", "Complications", "lastState", false],
                ["IMG", "RollerDie_Main_28", "modes", "Complications", "lastState", false],
                ["IMG", "RollerDie_Main_29", "modes", "Complications", "lastState", false],
                ["IMG", "RollerDie_Main_3", "modes", "Complications", "lastState", false],
                ["IMG", "RollerDie_Main_30", "modes", "Complications", "lastState", false],
                ["IMG", "RollerDie_Main_4", "modes", "Complications", "lastState", false],
                ["IMG", "RollerDie_Main_5", "modes", "Complications", "lastState", false],
                ["IMG", "RollerDie_Main_6", "modes", "Complications", "lastState", false],
                ["IMG", "RollerDie_Main_7", "modes", "Complications", "lastState", false],
                ["IMG", "RollerDie_Main_8", "modes", "Complications", "lastState", false],
                ["IMG", "RollerDie_Main_9", "modes", "Complications", "lastState", false],
                ["IMG", "RollerFrame_BottomEnd_1", "modes", "Complications", "lastState", true],
                ["IMG", "RollerFrame_BottomMid_1", "modes", "Complications", "lastState", false],
                ["IMG", "RollerFrame_BottomMid_2", "modes", "Complications", "lastState", false],
                ["IMG", "RollerFrame_BottomMid_3", "modes", "Complications", "lastState", false],
                ["IMG", "RollerFrame_BottomMid_4", "modes", "Complications", "lastState", false],
                ["IMG", "RollerFrame_BottomMid_5", "modes", "Complications", "lastState", false],
                ["IMG", "RollerFrame_BottomMid_6", "modes", "Complications", "lastState", false],
                ["IMG", "RollerFrame_BottomMid_7", "modes", "Complications", "lastState", false],
                ["IMG", "RollerFrame_BottomMid_8", "modes", "Complications", "lastState", false],
                ["IMG", "RollerFrame_BottomMid_9", "modes", "Complications", "lastState", false],
                ["IMG", "RollerFrame_Diff_1", "modes", "Complications", "lastState", false],
                ["IMG", "RollerFrame_Left_1", "modes", "Complications", "lastState", true],
                ["IMG", "RollerFrame_TopEnd_1", "modes", "Complications", "lastState", true],
                ["IMG", "RollerFrame_TopMid_1", "modes", "Complications", "lastState", false],
                ["IMG", "RollerFrame_TopMid_2", "modes", "Complications", "lastState", false],
                ["IMG", "RollerFrame_TopMid_3", "modes", "Complications", "lastState", false],
                ["IMG", "RollerFrame_TopMid_4", "modes", "Complications", "lastState", false],
                ["IMG", "RollerFrame_TopMid_5", "modes", "Complications", "lastState", false],
                ["IMG", "RollerFrame_TopMid_6", "modes", "Complications", "lastState", false],
                ["IMG", "RollerFrame_TopMid_7", "modes", "Complications", "lastState", false],
                ["IMG", "RollerFrame_TopMid_8", "modes", "Complications", "lastState", false],
                ["IMG", "RollerFrame_TopMid_9", "modes", "Complications", "lastState", false],
                ["IMG", "SignalLightBotLeft_1", "modes", "Complications", "lastState", true],
                ["IMG", "SignalLightBotRight_1", "modes", "Complications", "lastState", true],
                ["IMG", "SignalLightTopLeft_1", "modes", "Complications", "lastState", true],
                ["IMG", "SignalLightTopRight_1", "modes", "Complications", "lastState", true],
                ["IMG", "SiteBarCenter_1", "modes", "Complications", "lastState", false],
                ["IMG", "SiteBarLeft_1", "modes", "Complications", "lastState", false],
                ["IMG", "SiteBarRight_1", "modes", "Complications", "lastState", false],
                ["IMG", "SiteCenter_1", "modes", "Complications", "lastState", false],
                ["IMG", "SiteLeft_1", "modes", "Complications", "lastState", false],
                ["IMG", "SiteRight_1", "modes", "Complications", "lastState", false],
                ["IMG", "stakedAdvantagesHeader_1", "modes", "Complications", "lastState", true],
                ["IMG", "TorontoMap_1", "modes", "Complications", "lastState", true],
                ["IMG", "SubLocLeft", "modes", "Complications", "lastState", false],
                ["IMG", "SubLocTopLeft", "modes", "Complications", "lastState", false],
                ["IMG", "SubLocBotLeft", "modes", "Complications", "lastState", false],
                ["IMG", "SubLocRight", "modes", "Complications", "lastState", false],
                ["IMG", "SubLocTopRight", "modes", "Complications", "lastState", false],
                ["IMG", "SubLocBotRight", "modes", "Complications", "lastState", false],
                ["IMG", "TorontoMapAutarkisOverlay_1", "modes", "Complications", "lastState", true],
                ["IMG", "TorontoMapDistrictsOverlay_1", "modes", "Complications", "lastState", true],
                ["IMG", "TorontoMapDomainOverlay_1", "modes", "Complications", "lastState", true],
                ["IMG", "TorontoMapParksOverlay_1", "modes", "Complications", "lastState", true],
                ["IMG", "TorontoMapRackOverlay_1", "modes", "Complications", "lastState", true],
                ["IMG", "TorontoMapRoadsOverlay_1", "modes", "Complications", "lastState", true],
                ["IMG", "TorontoMapSitesCultureOverlay_1", "modes", "Complications", "lastState", true],
                ["IMG", "TorontoMapSitesEducationOverlay_1", "modes", "Complications", "lastState", true],
                ["IMG", "TorontoMapSitesHavensOverlay_1", "modes", "Complications", "lastState", true],
                ["IMG", "TorontoMapSitesHealthOverlay_1", "modes", "Complications", "lastState", true],
                ["IMG", "TorontoMapSitesLandmarksOverlay_1", "modes", "Complications", "lastState", true],
                ["IMG", "TorontoMapSitesNightlifeOverlay_1", "modes", "Complications", "lastState", true],
                ["IMG", "TorontoMapSitesShoppingOverlay_1", "modes", "Complications", "lastState", true],
                ["IMG", "TorontoMapSitesTransportationOverlay_1", "modes", "Complications", "lastState", true],
                ["IMG", "WeatherClouds_1", "modes", "Complications", "lastState", false],
                ["IMG", "WeatherGlow_1", "modes", "Complications", "lastState", false],
                ["IMG", "WeatherFog_1", "modes", "Complications", "lastState", false],
                ["IMG", "WeatherFrost_1", "modes", "Complications", "lastState", false],
                ["IMG", "WeatherGround_1", "modes", "Complications", "lastState", false],
                ["IMG", "WeatherMain_1", "modes", "Complications", "lastState", false],
                ["IMG", "weeklyResourcesHeader_1", "modes", "Complications", "lastState", true],
                ["IMG", "wpRerollPlaceholder_1", "modes", "Complications", "lastState", true],
                ["TEXT", "AvaDesire", "isActive", true],
                ["TEXT", "compCardName_1", "isActive", false],
                ["TEXT", "compCardName_10", "isActive", false],
                ["TEXT", "compCardName_2", "isActive", false],
                ["TEXT", "compCardName_3", "isActive", false],
                ["TEXT", "compCardName_4", "isActive", false],
                ["TEXT", "compCardName_5", "isActive", false],
                ["TEXT", "compCardName_6", "isActive", false],
                ["TEXT", "compCardName_7", "isActive", false],
                ["TEXT", "compCardName_8", "isActive", false],
                ["TEXT", "compCardName_9", "isActive", false],
                ["TEXT", "complicationCurrent", "isActive", false],
                ["TEXT", "complicationRemaining", "isActive", false],
                ["TEXT", "complicationTarget", "isActive", false],
                ["TEXT", "Countdown", "isActive", false],
                ["TEXT", "dicePool", "isActive", false],
                ["TEXT", "difficulty", "isActive", false],
                ["TEXT", "goldMods", "isActive", false],
                ["TEXT", "LockeDesire", "isActive", true],
                ["TEXT", "mainRoll", "isActive", false],
                ["TEXT", "margin", "isActive", false],
                ["TEXT", "NapierDesire", "isActive", true],
                ["TEXT", "negMods", "isActive", false],
                ["TEXT", "outcome", "isActive", false],
                ["TEXT", "posMods", "isActive", false],
                ["TEXT", "redMods", "isActive", false],
                ["TEXT", "resultCount", "isActive", false],
                ["TEXT", "rollerName", "isActive", false],
                ["TEXT", "RoyDesire", "isActive", true],
                ["TEXT", "secretRollTraits", "isActive", false],
                ["TEXT", "SiteNameCenter", "isActive", false],
                ["TEXT", "SiteNameLeft", "isActive", false],
                ["TEXT", "SiteNameRight", "isActive", false],
                ["TEXT", "stakedAdvantages", "isActive", true],
                ["TEXT", "stakedCoterieAdvantages", "isActive", true],
                ["TEXT", "subOutcome", "isActive", false],
                ["TEXT", "tempC", "isActive", true],
                ["TEXT", "tempF", "isActive", true],
                ["TEXT", "testSessionNotice", "isActive", true],
                ["TEXT", "TimeTracker", "isActive", true],
                ["TEXT", "weather", "isActive", true],
                ["TEXT", "weeklyResources", "isActive", true],
                ["TEXT", "AvaDesire", "modes", "Active", "lastActive", true],
                ["TEXT", "compCardName_1", "modes", "Active", "lastActive", false],
                ["TEXT", "compCardName_10", "modes", "Active", "lastActive", false],
                ["TEXT", "compCardName_2", "modes", "Active", "lastActive", false],
                ["TEXT", "compCardName_3", "modes", "Active", "lastActive", false],
                ["TEXT", "compCardName_4", "modes", "Active", "lastActive", false],
                ["TEXT", "compCardName_5", "modes", "Active", "lastActive", false],
                ["TEXT", "compCardName_6", "modes", "Active", "lastActive", false],
                ["TEXT", "compCardName_7", "modes", "Active", "lastActive", false],
                ["TEXT", "compCardName_8", "modes", "Active", "lastActive", false],
                ["TEXT", "compCardName_9", "modes", "Active", "lastActive", false],
                ["TEXT", "complicationCurrent", "modes", "Active", "lastActive", false],
                ["TEXT", "complicationRemaining", "modes", "Active", "lastActive", false],
                ["TEXT", "complicationTarget", "modes", "Active", "lastActive", false],
                ["TEXT", "Countdown", "modes", "Active", "lastActive", false],
                ["TEXT", "dicePool", "modes", "Active", "lastActive", false],
                ["TEXT", "difficulty", "modes", "Active", "lastActive", false],
                ["TEXT", "goldMods", "modes", "Active", "lastActive", false],
                ["TEXT", "LockeDesire", "modes", "Active", "lastActive", true],
                ["TEXT", "mainRoll", "modes", "Active", "lastActive", false],
                ["TEXT", "margin", "modes", "Active", "lastActive", false],
                ["TEXT", "NapierDesire", "modes", "Active", "lastActive", true],
                ["TEXT", "negMods", "modes", "Active", "lastActive", false],
                ["TEXT", "outcome", "modes", "Active", "lastActive", false],
                ["TEXT", "posMods", "modes", "Active", "lastActive", false],
                ["TEXT", "redMods", "modes", "Active", "lastActive", false],
                ["TEXT", "resultCount", "modes", "Active", "lastActive", false],
                ["TEXT", "rollerName", "modes", "Active", "lastActive", false],
                ["TEXT", "RoyDesire", "modes", "Active", "lastActive", true],
                ["TEXT", "secretRollTraits", "modes", "Active", "lastActive", false],
                ["TEXT", "SiteNameCenter", "modes", "Active", "lastActive", false],
                ["TEXT", "SiteNameLeft", "modes", "Active", "lastActive", false],
                ["TEXT", "SiteNameRight", "modes", "Active", "lastActive", false],
                ["TEXT", "stakedAdvantages", "modes", "Active", "lastActive", true],
                ["TEXT", "stakedCoterieAdvantages", "modes", "Active", "lastActive", true],
                ["TEXT", "subOutcome", "modes", "Active", "lastActive", false],
                ["TEXT", "tempC", "modes", "Active", "lastActive", true],
                ["TEXT", "tempF", "modes", "Active", "lastActive", true],
                ["TEXT", "testSessionNotice", "modes", "Active", "lastActive", true],
                ["TEXT", "TimeTracker", "modes", "Active", "lastActive", true],
                ["TEXT", "weather", "modes", "Active", "lastActive", true],
                ["TEXT", "weeklyResources", "modes", "Active", "lastActive", true],
                ["TEXT", "AvaDesire", "modes", "Active", "lastState", true],
                ["TEXT", "compCardName_1", "modes", "Active", "lastState", false],
                ["TEXT", "compCardName_10", "modes", "Active", "lastState", false],
                ["TEXT", "compCardName_2", "modes", "Active", "lastState", false],
                ["TEXT", "compCardName_3", "modes", "Active", "lastState", false],
                ["TEXT", "compCardName_4", "modes", "Active", "lastState", false],
                ["TEXT", "compCardName_5", "modes", "Active", "lastState", false],
                ["TEXT", "compCardName_6", "modes", "Active", "lastState", false],
                ["TEXT", "compCardName_7", "modes", "Active", "lastState", false],
                ["TEXT", "compCardName_8", "modes", "Active", "lastState", false],
                ["TEXT", "compCardName_9", "modes", "Active", "lastState", false],
                ["TEXT", "complicationCurrent", "modes", "Active", "lastState", false],
                ["TEXT", "complicationRemaining", "modes", "Active", "lastState", false],
                ["TEXT", "complicationTarget", "modes", "Active", "lastState", false],
                ["TEXT", "Countdown", "modes", "Active", "lastState", false],
                ["TEXT", "dicePool", "modes", "Active", "lastState", false],
                ["TEXT", "difficulty", "modes", "Active", "lastState", false],
                ["TEXT", "goldMods", "modes", "Active", "lastState", false],
                ["TEXT", "LockeDesire", "modes", "Active", "lastState", true],
                ["TEXT", "mainRoll", "modes", "Active", "lastState", false],
                ["TEXT", "margin", "modes", "Active", "lastState", false],
                ["TEXT", "NapierDesire", "modes", "Active", "lastState", true],
                ["TEXT", "negMods", "modes", "Active", "lastState", false],
                ["TEXT", "outcome", "modes", "Active", "lastState", false],
                ["TEXT", "posMods", "modes", "Active", "lastState", false],
                ["TEXT", "redMods", "modes", "Active", "lastState", false],
                ["TEXT", "resultCount", "modes", "Active", "lastState", false],
                ["TEXT", "rollerName", "modes", "Active", "lastState", false],
                ["TEXT", "RoyDesire", "modes", "Active", "lastState", true],
                ["TEXT", "secretRollTraits", "modes", "Active", "lastState", false],
                ["TEXT", "SiteNameCenter", "modes", "Active", "lastState", false],
                ["TEXT", "SiteNameLeft", "modes", "Active", "lastState", false],
                ["TEXT", "SiteNameRight", "modes", "Active", "lastState", false],
                ["TEXT", "stakedAdvantages", "modes", "Active", "lastState", true],
                ["TEXT", "stakedCoterieAdvantages", "modes", "Active", "lastState", true],
                ["TEXT", "subOutcome", "modes", "Active", "lastState", false],
                ["TEXT", "tempC", "modes", "Active", "lastState", true],
                ["TEXT", "tempF", "modes", "Active", "lastState", true],
                ["TEXT", "testSessionNotice", "modes", "Active", "lastState", true],
                ["TEXT", "TimeTracker", "modes", "Active", "lastState", true],
                ["TEXT", "weather", "modes", "Active", "lastState", true],
                ["TEXT", "weeklyResources", "modes", "Active", "lastState", true],
                ["TEXT", "AvaDesire", "curText", true],
                ["TEXT", "compCardName_1", "curText", false],
                ["TEXT", "compCardName_10", "curText", false],
                ["TEXT", "compCardName_2", "curText", false],
                ["TEXT", "compCardName_3", "curText", false],
                ["TEXT", "compCardName_4", "curText", false],
                ["TEXT", "compCardName_5", "curText", false],
                ["TEXT", "compCardName_6", "curText", false],
                ["TEXT", "compCardName_7", "curText", false],
                ["TEXT", "compCardName_8", "curText", false],
                ["TEXT", "compCardName_9", "curText", false],
                ["TEXT", "complicationCurrent", "curText", false],
                ["TEXT", "complicationRemaining", "curText", false],
                ["TEXT", "complicationTarget", "curText", false],
                ["TEXT", "Countdown", "curText", false],
                ["TEXT", "dicePool", "curText", false],
                ["TEXT", "difficulty", "curText", false],
                ["TEXT", "goldMods", "curText", false],
                ["TEXT", "LockeDesire", "curText", true],
                ["TEXT", "mainRoll", "curText", false],
                ["TEXT", "margin", "curText", false],
                ["TEXT", "NapierDesire", "curText", true],
                ["TEXT", "negMods", "curText", false],
                ["TEXT", "outcome", "curText", false],
                ["TEXT", "posMods", "curText", false],
                ["TEXT", "redMods", "curText", false],
                ["TEXT", "resultCount", "curText", false],
                ["TEXT", "rollerName", "curText", false],
                ["TEXT", "RoyDesire", "curText", true],
                ["TEXT", "secretRollTraits", "curText", false],
                ["TEXT", "SiteNameCenter", "curText", false],
                ["TEXT", "SiteNameLeft", "curText", false],
                ["TEXT", "SiteNameRight", "curText", false],
                ["TEXT", "stakedAdvantages", "curText", true],
                ["TEXT", "stakedCoterieAdvantages", "curText", true],
                ["TEXT", "subOutcome", "curText", false],
                ["TEXT", "tempC", "curText", true],
                ["TEXT", "tempF", "curText", true],
                ["TEXT", "testSessionNotice", "curText", true],
                ["TEXT", "TimeTracker", "curText", true],
                ["TEXT", "weather", "curText", true],
                ["TEXT", "weeklyResources", "curText", true],
                ["TEXT", "AvaDesire", "activeText", true],
                ["TEXT", "compCardName_1", "activeText", false],
                ["TEXT", "compCardName_10", "activeText", false],
                ["TEXT", "compCardName_2", "activeText", false],
                ["TEXT", "compCardName_3", "activeText", false],
                ["TEXT", "compCardName_4", "activeText", false],
                ["TEXT", "compCardName_5", "activeText", false],
                ["TEXT", "compCardName_6", "activeText", false],
                ["TEXT", "compCardName_7", "activeText", false],
                ["TEXT", "compCardName_8", "activeText", false],
                ["TEXT", "compCardName_9", "activeText", false],
                ["TEXT", "complicationCurrent", "activeText", false],
                ["TEXT", "complicationRemaining", "activeText", false],
                ["TEXT", "complicationTarget", "activeText", false],
                ["TEXT", "Countdown", "activeText", false],
                ["TEXT", "dicePool", "activeText", false],
                ["TEXT", "difficulty", "activeText", false],
                ["TEXT", "goldMods", "activeText", false],
                ["TEXT", "LockeDesire", "activeText", true],
                ["TEXT", "mainRoll", "activeText", false],
                ["TEXT", "margin", "activeText", false],
                ["TEXT", "NapierDesire", "activeText", true],
                ["TEXT", "negMods", "activeText", false],
                ["TEXT", "outcome", "activeText", false],
                ["TEXT", "posMods", "activeText", false],
                ["TEXT", "redMods", "activeText", false],
                ["TEXT", "resultCount", "activeText", false],
                ["TEXT", "rollerName", "activeText", false],
                ["TEXT", "RoyDesire", "activeText", true],
                ["TEXT", "secretRollTraits", "activeText", false],
                ["TEXT", "SiteNameCenter", "activeText", false],
                ["TEXT", "SiteNameLeft", "activeText", false],
                ["TEXT", "SiteNameRight", "activeText", false],
                ["TEXT", "stakedAdvantages", "activeText", true],
                ["TEXT", "stakedCoterieAdvantages", "activeText", true],
                ["TEXT", "subOutcome", "activeText", false],
                ["TEXT", "tempC", "activeText", true],
                ["TEXT", "tempF", "activeText", true],
                ["TEXT", "testSessionNotice", "activeText", true],
                ["TEXT", "TimeTracker", "activeText", true],
                ["TEXT", "weather", "activeText", true],
                ["TEXT", "weeklyResources", "activeText", true],
                ["TEXT", "AvaDesire", "modes", "Inactive", "lastActive", true],
                ["TEXT", "compCardName_1", "modes", "Inactive", "lastActive", false],
                ["TEXT", "compCardName_10", "modes", "Inactive", "lastActive", false],
                ["TEXT", "compCardName_2", "modes", "Inactive", "lastActive", false],
                ["TEXT", "compCardName_3", "modes", "Inactive", "lastActive", false],
                ["TEXT", "compCardName_4", "modes", "Inactive", "lastActive", false],
                ["TEXT", "compCardName_5", "modes", "Inactive", "lastActive", false],
                ["TEXT", "compCardName_6", "modes", "Inactive", "lastActive", false],
                ["TEXT", "compCardName_7", "modes", "Inactive", "lastActive", false],
                ["TEXT", "compCardName_8", "modes", "Inactive", "lastActive", false],
                ["TEXT", "compCardName_9", "modes", "Inactive", "lastActive", false],
                ["TEXT", "complicationCurrent", "modes", "Inactive", "lastActive", false],
                ["TEXT", "complicationRemaining", "modes", "Inactive", "lastActive", false],
                ["TEXT", "complicationTarget", "modes", "Inactive", "lastActive", false],
                ["TEXT", "Countdown", "modes", "Inactive", "lastActive", false],
                ["TEXT", "dicePool", "modes", "Inactive", "lastActive", false],
                ["TEXT", "difficulty", "modes", "Inactive", "lastActive", false],
                ["TEXT", "goldMods", "modes", "Inactive", "lastActive", false],
                ["TEXT", "LockeDesire", "modes", "Inactive", "lastActive", true],
                ["TEXT", "mainRoll", "modes", "Inactive", "lastActive", false],
                ["TEXT", "margin", "modes", "Inactive", "lastActive", false],
                ["TEXT", "NapierDesire", "modes", "Inactive", "lastActive", true],
                ["TEXT", "negMods", "modes", "Inactive", "lastActive", false],
                ["TEXT", "outcome", "modes", "Inactive", "lastActive", false],
                ["TEXT", "posMods", "modes", "Inactive", "lastActive", false],
                ["TEXT", "redMods", "modes", "Inactive", "lastActive", false],
                ["TEXT", "resultCount", "modes", "Inactive", "lastActive", false],
                ["TEXT", "rollerName", "modes", "Inactive", "lastActive", false],
                ["TEXT", "RoyDesire", "modes", "Inactive", "lastActive", true],
                ["TEXT", "secretRollTraits", "modes", "Inactive", "lastActive", false],
                ["TEXT", "SiteNameCenter", "modes", "Inactive", "lastActive", false],
                ["TEXT", "SiteNameLeft", "modes", "Inactive", "lastActive", false],
                ["TEXT", "SiteNameRight", "modes", "Inactive", "lastActive", false],
                ["TEXT", "stakedAdvantages", "modes", "Inactive", "lastActive", true],
                ["TEXT", "stakedCoterieAdvantages", "modes", "Inactive", "lastActive", true],
                ["TEXT", "subOutcome", "modes", "Inactive", "lastActive", false],
                ["TEXT", "tempC", "modes", "Inactive", "lastActive", true],
                ["TEXT", "tempF", "modes", "Inactive", "lastActive", true],
                ["TEXT", "testSessionNotice", "modes", "Inactive", "lastActive", true],
                ["TEXT", "TimeTracker", "modes", "Inactive", "lastActive", true],
                ["TEXT", "weather", "modes", "Inactive", "lastActive", true],
                ["TEXT", "weeklyResources", "modes", "Inactive", "lastActive", true],
                ["TEXT", "AvaDesire", "modes", "Inactive", "lastState", true],
                ["TEXT", "compCardName_1", "modes", "Inactive", "lastState", false],
                ["TEXT", "compCardName_10", "modes", "Inactive", "lastState", false],
                ["TEXT", "compCardName_2", "modes", "Inactive", "lastState", false],
                ["TEXT", "compCardName_3", "modes", "Inactive", "lastState", false],
                ["TEXT", "compCardName_4", "modes", "Inactive", "lastState", false],
                ["TEXT", "compCardName_5", "modes", "Inactive", "lastState", false],
                ["TEXT", "compCardName_6", "modes", "Inactive", "lastState", false],
                ["TEXT", "compCardName_7", "modes", "Inactive", "lastState", false],
                ["TEXT", "compCardName_8", "modes", "Inactive", "lastState", false],
                ["TEXT", "compCardName_9", "modes", "Inactive", "lastState", false],
                ["TEXT", "complicationCurrent", "modes", "Inactive", "lastState", false],
                ["TEXT", "complicationRemaining", "modes", "Inactive", "lastState", false],
                ["TEXT", "complicationTarget", "modes", "Inactive", "lastState", false],
                ["TEXT", "Countdown", "modes", "Inactive", "lastState", false],
                ["TEXT", "dicePool", "modes", "Inactive", "lastState", false],
                ["TEXT", "difficulty", "modes", "Inactive", "lastState", false],
                ["TEXT", "goldMods", "modes", "Inactive", "lastState", false],
                ["TEXT", "LockeDesire", "modes", "Inactive", "lastState", true],
                ["TEXT", "mainRoll", "modes", "Inactive", "lastState", false],
                ["TEXT", "margin", "modes", "Inactive", "lastState", false],
                ["TEXT", "NapierDesire", "modes", "Inactive", "lastState", true],
                ["TEXT", "negMods", "modes", "Inactive", "lastState", false],
                ["TEXT", "outcome", "modes", "Inactive", "lastState", false],
                ["TEXT", "posMods", "modes", "Inactive", "lastState", false],
                ["TEXT", "redMods", "modes", "Inactive", "lastState", false],
                ["TEXT", "resultCount", "modes", "Inactive", "lastState", false],
                ["TEXT", "rollerName", "modes", "Inactive", "lastState", false],
                ["TEXT", "RoyDesire", "modes", "Inactive", "lastState", true],
                ["TEXT", "secretRollTraits", "modes", "Inactive", "lastState", false],
                ["TEXT", "SiteNameCenter", "modes", "Inactive", "lastState", false],
                ["TEXT", "SiteNameLeft", "modes", "Inactive", "lastState", false],
                ["TEXT", "SiteNameRight", "modes", "Inactive", "lastState", false],
                ["TEXT", "stakedAdvantages", "modes", "Inactive", "lastState", true],
                ["TEXT", "stakedCoterieAdvantages", "modes", "Inactive", "lastState", true],
                ["TEXT", "subOutcome", "modes", "Inactive", "lastState", false],
                ["TEXT", "tempC", "modes", "Inactive", "lastState", true],
                ["TEXT", "tempF", "modes", "Inactive", "lastState", true],
                ["TEXT", "testSessionNotice", "modes", "Inactive", "lastState", true],
                ["TEXT", "TimeTracker", "modes", "Inactive", "lastState", true],
                ["TEXT", "weather", "modes", "Inactive", "lastState", true],
                ["TEXT", "weeklyResources", "modes", "Inactive", "lastState", true],
                ["TEXT", "AvaDesire", "modes", "Daylighter", "lastActive", true],
                ["TEXT", "compCardName_1", "modes", "Daylighter", "lastActive", false],
                ["TEXT", "compCardName_10", "modes", "Daylighter", "lastActive", false],
                ["TEXT", "compCardName_2", "modes", "Daylighter", "lastActive", false],
                ["TEXT", "compCardName_3", "modes", "Daylighter", "lastActive", false],
                ["TEXT", "compCardName_4", "modes", "Daylighter", "lastActive", false],
                ["TEXT", "compCardName_5", "modes", "Daylighter", "lastActive", false],
                ["TEXT", "compCardName_6", "modes", "Daylighter", "lastActive", false],
                ["TEXT", "compCardName_7", "modes", "Daylighter", "lastActive", false],
                ["TEXT", "compCardName_8", "modes", "Daylighter", "lastActive", false],
                ["TEXT", "compCardName_9", "modes", "Daylighter", "lastActive", false],
                ["TEXT", "complicationCurrent", "modes", "Daylighter", "lastActive", false],
                ["TEXT", "complicationRemaining", "modes", "Daylighter", "lastActive", false],
                ["TEXT", "complicationTarget", "modes", "Daylighter", "lastActive", false],
                ["TEXT", "Countdown", "modes", "Daylighter", "lastActive", false],
                ["TEXT", "dicePool", "modes", "Daylighter", "lastActive", false],
                ["TEXT", "difficulty", "modes", "Daylighter", "lastActive", false],
                ["TEXT", "goldMods", "modes", "Daylighter", "lastActive", false],
                ["TEXT", "LockeDesire", "modes", "Daylighter", "lastActive", true],
                ["TEXT", "mainRoll", "modes", "Daylighter", "lastActive", false],
                ["TEXT", "margin", "modes", "Daylighter", "lastActive", false],
                ["TEXT", "NapierDesire", "modes", "Daylighter", "lastActive", true],
                ["TEXT", "negMods", "modes", "Daylighter", "lastActive", false],
                ["TEXT", "outcome", "modes", "Daylighter", "lastActive", false],
                ["TEXT", "posMods", "modes", "Daylighter", "lastActive", false],
                ["TEXT", "redMods", "modes", "Daylighter", "lastActive", false],
                ["TEXT", "resultCount", "modes", "Daylighter", "lastActive", false],
                ["TEXT", "rollerName", "modes", "Daylighter", "lastActive", false],
                ["TEXT", "RoyDesire", "modes", "Daylighter", "lastActive", true],
                ["TEXT", "secretRollTraits", "modes", "Daylighter", "lastActive", false],
                ["TEXT", "SiteNameCenter", "modes", "Daylighter", "lastActive", false],
                ["TEXT", "SiteNameLeft", "modes", "Daylighter", "lastActive", false],
                ["TEXT", "SiteNameRight", "modes", "Daylighter", "lastActive", false],
                ["TEXT", "stakedAdvantages", "modes", "Daylighter", "lastActive", true],
                ["TEXT", "stakedCoterieAdvantages", "modes", "Daylighter", "lastActive", true],
                ["TEXT", "subOutcome", "modes", "Daylighter", "lastActive", false],
                ["TEXT", "tempC", "modes", "Daylighter", "lastActive", true],
                ["TEXT", "tempF", "modes", "Daylighter", "lastActive", true],
                ["TEXT", "testSessionNotice", "modes", "Daylighter", "lastActive", true],
                ["TEXT", "TimeTracker", "modes", "Daylighter", "lastActive", true],
                ["TEXT", "weather", "modes", "Daylighter", "lastActive", true],
                ["TEXT", "weeklyResources", "modes", "Daylighter", "lastActive", true],
                ["TEXT", "AvaDesire", "modes", "Daylighter", "lastState", true],
                ["TEXT", "compCardName_1", "modes", "Daylighter", "lastState", false],
                ["TEXT", "compCardName_10", "modes", "Daylighter", "lastState", false],
                ["TEXT", "compCardName_2", "modes", "Daylighter", "lastState", false],
                ["TEXT", "compCardName_3", "modes", "Daylighter", "lastState", false],
                ["TEXT", "compCardName_4", "modes", "Daylighter", "lastState", false],
                ["TEXT", "compCardName_5", "modes", "Daylighter", "lastState", false],
                ["TEXT", "compCardName_6", "modes", "Daylighter", "lastState", false],
                ["TEXT", "compCardName_7", "modes", "Daylighter", "lastState", false],
                ["TEXT", "compCardName_8", "modes", "Daylighter", "lastState", false],
                ["TEXT", "compCardName_9", "modes", "Daylighter", "lastState", false],
                ["TEXT", "complicationCurrent", "modes", "Daylighter", "lastState", false],
                ["TEXT", "complicationRemaining", "modes", "Daylighter", "lastState", false],
                ["TEXT", "complicationTarget", "modes", "Daylighter", "lastState", false],
                ["TEXT", "Countdown", "modes", "Daylighter", "lastState", false],
                ["TEXT", "dicePool", "modes", "Daylighter", "lastState", false],
                ["TEXT", "difficulty", "modes", "Daylighter", "lastState", false],
                ["TEXT", "goldMods", "modes", "Daylighter", "lastState", false],
                ["TEXT", "LockeDesire", "modes", "Daylighter", "lastState", true],
                ["TEXT", "mainRoll", "modes", "Daylighter", "lastState", false],
                ["TEXT", "margin", "modes", "Daylighter", "lastState", false],
                ["TEXT", "NapierDesire", "modes", "Daylighter", "lastState", true],
                ["TEXT", "negMods", "modes", "Daylighter", "lastState", false],
                ["TEXT", "outcome", "modes", "Daylighter", "lastState", false],
                ["TEXT", "posMods", "modes", "Daylighter", "lastState", false],
                ["TEXT", "redMods", "modes", "Daylighter", "lastState", false],
                ["TEXT", "resultCount", "modes", "Daylighter", "lastState", false],
                ["TEXT", "rollerName", "modes", "Daylighter", "lastState", false],
                ["TEXT", "RoyDesire", "modes", "Daylighter", "lastState", true],
                ["TEXT", "secretRollTraits", "modes", "Daylighter", "lastState", false],
                ["TEXT", "SiteNameCenter", "modes", "Daylighter", "lastState", false],
                ["TEXT", "SiteNameLeft", "modes", "Daylighter", "lastState", false],
                ["TEXT", "SiteNameRight", "modes", "Daylighter", "lastState", false],
                ["TEXT", "stakedAdvantages", "modes", "Daylighter", "lastState", true],
                ["TEXT", "stakedCoterieAdvantages", "modes", "Daylighter", "lastState", true],
                ["TEXT", "subOutcome", "modes", "Daylighter", "lastState", false],
                ["TEXT", "tempC", "modes", "Daylighter", "lastState", true],
                ["TEXT", "tempF", "modes", "Daylighter", "lastState", true],
                ["TEXT", "testSessionNotice", "modes", "Daylighter", "lastState", true],
                ["TEXT", "TimeTracker", "modes", "Daylighter", "lastState", true],
                ["TEXT", "weather", "modes", "Daylighter", "lastState", true],
                ["TEXT", "weeklyResources", "modes", "Daylighter", "lastState", true],
                ["TEXT", "AvaDesire", "modes", "Downtime", "lastActive", true],
                ["TEXT", "compCardName_1", "modes", "Downtime", "lastActive", false],
                ["TEXT", "compCardName_10", "modes", "Downtime", "lastActive", false],
                ["TEXT", "compCardName_2", "modes", "Downtime", "lastActive", false],
                ["TEXT", "compCardName_3", "modes", "Downtime", "lastActive", false],
                ["TEXT", "compCardName_4", "modes", "Downtime", "lastActive", false],
                ["TEXT", "compCardName_5", "modes", "Downtime", "lastActive", false],
                ["TEXT", "compCardName_6", "modes", "Downtime", "lastActive", false],
                ["TEXT", "compCardName_7", "modes", "Downtime", "lastActive", false],
                ["TEXT", "compCardName_8", "modes", "Downtime", "lastActive", false],
                ["TEXT", "compCardName_9", "modes", "Downtime", "lastActive", false],
                ["TEXT", "complicationCurrent", "modes", "Downtime", "lastActive", false],
                ["TEXT", "complicationRemaining", "modes", "Downtime", "lastActive", false],
                ["TEXT", "complicationTarget", "modes", "Downtime", "lastActive", false],
                ["TEXT", "Countdown", "modes", "Downtime", "lastActive", false],
                ["TEXT", "dicePool", "modes", "Downtime", "lastActive", false],
                ["TEXT", "difficulty", "modes", "Downtime", "lastActive", false],
                ["TEXT", "goldMods", "modes", "Downtime", "lastActive", false],
                ["TEXT", "LockeDesire", "modes", "Downtime", "lastActive", true],
                ["TEXT", "mainRoll", "modes", "Downtime", "lastActive", false],
                ["TEXT", "margin", "modes", "Downtime", "lastActive", false],
                ["TEXT", "NapierDesire", "modes", "Downtime", "lastActive", true],
                ["TEXT", "negMods", "modes", "Downtime", "lastActive", false],
                ["TEXT", "outcome", "modes", "Downtime", "lastActive", false],
                ["TEXT", "posMods", "modes", "Downtime", "lastActive", false],
                ["TEXT", "redMods", "modes", "Downtime", "lastActive", false],
                ["TEXT", "resultCount", "modes", "Downtime", "lastActive", false],
                ["TEXT", "rollerName", "modes", "Downtime", "lastActive", false],
                ["TEXT", "RoyDesire", "modes", "Downtime", "lastActive", true],
                ["TEXT", "secretRollTraits", "modes", "Downtime", "lastActive", false],
                ["TEXT", "SiteNameCenter", "modes", "Downtime", "lastActive", false],
                ["TEXT", "SiteNameLeft", "modes", "Downtime", "lastActive", false],
                ["TEXT", "SiteNameRight", "modes", "Downtime", "lastActive", false],
                ["TEXT", "stakedAdvantages", "modes", "Downtime", "lastActive", true],
                ["TEXT", "stakedCoterieAdvantages", "modes", "Downtime", "lastActive", true],
                ["TEXT", "subOutcome", "modes", "Downtime", "lastActive", false],
                ["TEXT", "tempC", "modes", "Downtime", "lastActive", true],
                ["TEXT", "tempF", "modes", "Downtime", "lastActive", true],
                ["TEXT", "testSessionNotice", "modes", "Downtime", "lastActive", true],
                ["TEXT", "TimeTracker", "modes", "Downtime", "lastActive", true],
                ["TEXT", "weather", "modes", "Downtime", "lastActive", true],
                ["TEXT", "weeklyResources", "modes", "Downtime", "lastActive", true],
                ["TEXT", "AvaDesire", "modes", "Downtime", "lastState", true],
                ["TEXT", "compCardName_1", "modes", "Downtime", "lastState", false],
                ["TEXT", "compCardName_10", "modes", "Downtime", "lastState", false],
                ["TEXT", "compCardName_2", "modes", "Downtime", "lastState", false],
                ["TEXT", "compCardName_3", "modes", "Downtime", "lastState", false],
                ["TEXT", "compCardName_4", "modes", "Downtime", "lastState", false],
                ["TEXT", "compCardName_5", "modes", "Downtime", "lastState", false],
                ["TEXT", "compCardName_6", "modes", "Downtime", "lastState", false],
                ["TEXT", "compCardName_7", "modes", "Downtime", "lastState", false],
                ["TEXT", "compCardName_8", "modes", "Downtime", "lastState", false],
                ["TEXT", "compCardName_9", "modes", "Downtime", "lastState", false],
                ["TEXT", "complicationCurrent", "modes", "Downtime", "lastState", false],
                ["TEXT", "complicationRemaining", "modes", "Downtime", "lastState", false],
                ["TEXT", "complicationTarget", "modes", "Downtime", "lastState", false],
                ["TEXT", "Countdown", "modes", "Downtime", "lastState", false],
                ["TEXT", "dicePool", "modes", "Downtime", "lastState", false],
                ["TEXT", "difficulty", "modes", "Downtime", "lastState", false],
                ["TEXT", "goldMods", "modes", "Downtime", "lastState", false],
                ["TEXT", "LockeDesire", "modes", "Downtime", "lastState", true],
                ["TEXT", "mainRoll", "modes", "Downtime", "lastState", false],
                ["TEXT", "margin", "modes", "Downtime", "lastState", false],
                ["TEXT", "NapierDesire", "modes", "Downtime", "lastState", true],
                ["TEXT", "negMods", "modes", "Downtime", "lastState", false],
                ["TEXT", "outcome", "modes", "Downtime", "lastState", false],
                ["TEXT", "posMods", "modes", "Downtime", "lastState", false],
                ["TEXT", "redMods", "modes", "Downtime", "lastState", false],
                ["TEXT", "resultCount", "modes", "Downtime", "lastState", false],
                ["TEXT", "rollerName", "modes", "Downtime", "lastState", false],
                ["TEXT", "RoyDesire", "modes", "Downtime", "lastState", true],
                ["TEXT", "secretRollTraits", "modes", "Downtime", "lastState", false],
                ["TEXT", "SiteNameCenter", "modes", "Downtime", "lastState", false],
                ["TEXT", "SiteNameLeft", "modes", "Downtime", "lastState", false],
                ["TEXT", "SiteNameRight", "modes", "Downtime", "lastState", false],
                ["TEXT", "stakedAdvantages", "modes", "Downtime", "lastState", true],
                ["TEXT", "stakedCoterieAdvantages", "modes", "Downtime", "lastState", true],
                ["TEXT", "subOutcome", "modes", "Downtime", "lastState", false],
                ["TEXT", "tempC", "modes", "Downtime", "lastState", true],
                ["TEXT", "tempF", "modes", "Downtime", "lastState", true],
                ["TEXT", "testSessionNotice", "modes", "Downtime", "lastState", true],
                ["TEXT", "TimeTracker", "modes", "Downtime", "lastState", true],
                ["TEXT", "weather", "modes", "Downtime", "lastState", true],
                ["TEXT", "weeklyResources", "modes", "Downtime", "lastState", true],
                ["TEXT", "AvaDesire", "modes", "Complications", "lastActive", true],
                ["TEXT", "compCardName_1", "modes", "Complications", "lastActive", false],
                ["TEXT", "compCardName_10", "modes", "Complications", "lastActive", false],
                ["TEXT", "compCardName_2", "modes", "Complications", "lastActive", false],
                ["TEXT", "compCardName_3", "modes", "Complications", "lastActive", false],
                ["TEXT", "compCardName_4", "modes", "Complications", "lastActive", false],
                ["TEXT", "compCardName_5", "modes", "Complications", "lastActive", false],
                ["TEXT", "compCardName_6", "modes", "Complications", "lastActive", false],
                ["TEXT", "compCardName_7", "modes", "Complications", "lastActive", false],
                ["TEXT", "compCardName_8", "modes", "Complications", "lastActive", false],
                ["TEXT", "compCardName_9", "modes", "Complications", "lastActive", false],
                ["TEXT", "complicationCurrent", "modes", "Complications", "lastActive", false],
                ["TEXT", "complicationRemaining", "modes", "Complications", "lastActive", false],
                ["TEXT", "complicationTarget", "modes", "Complications", "lastActive", false],
                ["TEXT", "Countdown", "modes", "Complications", "lastActive", false],
                ["TEXT", "dicePool", "modes", "Complications", "lastActive", false],
                ["TEXT", "difficulty", "modes", "Complications", "lastActive", false],
                ["TEXT", "goldMods", "modes", "Complications", "lastActive", false],
                ["TEXT", "LockeDesire", "modes", "Complications", "lastActive", true],
                ["TEXT", "mainRoll", "modes", "Complications", "lastActive", false],
                ["TEXT", "margin", "modes", "Complications", "lastActive", false],
                ["TEXT", "NapierDesire", "modes", "Complications", "lastActive", true],
                ["TEXT", "negMods", "modes", "Complications", "lastActive", false],
                ["TEXT", "outcome", "modes", "Complications", "lastActive", false],
                ["TEXT", "posMods", "modes", "Complications", "lastActive", false],
                ["TEXT", "redMods", "modes", "Complications", "lastActive", false],
                ["TEXT", "resultCount", "modes", "Complications", "lastActive", false],
                ["TEXT", "rollerName", "modes", "Complications", "lastActive", false],
                ["TEXT", "RoyDesire", "modes", "Complications", "lastActive", true],
                ["TEXT", "secretRollTraits", "modes", "Complications", "lastActive", false],
                ["TEXT", "SiteNameCenter", "modes", "Complications", "lastActive", false],
                ["TEXT", "SiteNameLeft", "modes", "Complications", "lastActive", false],
                ["TEXT", "SiteNameRight", "modes", "Complications", "lastActive", false],
                ["TEXT", "stakedAdvantages", "modes", "Complications", "lastActive", true],
                ["TEXT", "stakedCoterieAdvantages", "modes", "Complications", "lastActive", true],
                ["TEXT", "subOutcome", "modes", "Complications", "lastActive", false],
                ["TEXT", "tempC", "modes", "Complications", "lastActive", true],
                ["TEXT", "tempF", "modes", "Complications", "lastActive", true],
                ["TEXT", "testSessionNotice", "modes", "Complications", "lastActive", true],
                ["TEXT", "TimeTracker", "modes", "Complications", "lastActive", true],
                ["TEXT", "weather", "modes", "Complications", "lastActive", true],
                ["TEXT", "weeklyResources", "modes", "Complications", "lastActive", true],
                ["TEXT", "AvaDesire", "modes", "Complications", "lastState", true],
                ["TEXT", "compCardName_1", "modes", "Complications", "lastState", false],
                ["TEXT", "compCardName_10", "modes", "Complications", "lastState", false],
                ["TEXT", "compCardName_2", "modes", "Complications", "lastState", false],
                ["TEXT", "compCardName_3", "modes", "Complications", "lastState", false],
                ["TEXT", "compCardName_4", "modes", "Complications", "lastState", false],
                ["TEXT", "compCardName_5", "modes", "Complications", "lastState", false],
                ["TEXT", "compCardName_6", "modes", "Complications", "lastState", false],
                ["TEXT", "compCardName_7", "modes", "Complications", "lastState", false],
                ["TEXT", "compCardName_8", "modes", "Complications", "lastState", false],
                ["TEXT", "compCardName_9", "modes", "Complications", "lastState", false],
                ["TEXT", "complicationCurrent", "modes", "Complications", "lastState", false],
                ["TEXT", "complicationRemaining", "modes", "Complications", "lastState", false],
                ["TEXT", "complicationTarget", "modes", "Complications", "lastState", false],
                ["TEXT", "Countdown", "modes", "Complications", "lastState", false],
                ["TEXT", "dicePool", "modes", "Complications", "lastState", false],
                ["TEXT", "difficulty", "modes", "Complications", "lastState", false],
                ["TEXT", "goldMods", "modes", "Complications", "lastState", false],
                ["TEXT", "LockeDesire", "modes", "Complications", "lastState", true],
                ["TEXT", "mainRoll", "modes", "Complications", "lastState", false],
                ["TEXT", "margin", "modes", "Complications", "lastState", false],
                ["TEXT", "NapierDesire", "modes", "Complications", "lastState", true],
                ["TEXT", "negMods", "modes", "Complications", "lastState", false],
                ["TEXT", "outcome", "modes", "Complications", "lastState", false],
                ["TEXT", "posMods", "modes", "Complications", "lastState", false],
                ["TEXT", "redMods", "modes", "Complications", "lastState", false],
                ["TEXT", "resultCount", "modes", "Complications", "lastState", false],
                ["TEXT", "rollerName", "modes", "Complications", "lastState", false],
                ["TEXT", "RoyDesire", "modes", "Complications", "lastState", true],
                ["TEXT", "secretRollTraits", "modes", "Complications", "lastState", false],
                ["TEXT", "SiteNameCenter", "modes", "Complications", "lastState", false],
                ["TEXT", "SiteNameLeft", "modes", "Complications", "lastState", false],
                ["TEXT", "SiteNameRight", "modes", "Complications", "lastState", false],
                ["TEXT", "stakedAdvantages", "modes", "Complications", "lastState", true],
                ["TEXT", "stakedCoterieAdvantages", "modes", "Complications", "lastState", true],
                ["TEXT", "subOutcome", "modes", "Complications", "lastState", false],
                ["TEXT", "tempC", "modes", "Complications", "lastState", true],
                ["TEXT", "tempF", "modes", "Complications", "lastState", true],
                ["TEXT", "testSessionNotice", "modes", "Complications", "lastState", true],
                ["TEXT", "TimeTracker", "modes", "Complications", "lastState", true],
                ["TEXT", "weather", "modes", "Complications", "lastState", true],
                ["TEXT", "weeklyResources", "modes", "Complications", "lastState", true],
                ["IMG", "AirLightCN_4", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["IMG", "AirLightCN_4", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "AirLightCN_4", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "AirLightCN_4", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "AirLightCN_4", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "AirLightCN_5", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["IMG", "AirLightCN_5", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "AirLightCN_5", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "AirLightCN_5", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "AirLightCN_5", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "AirLightLeft_1", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["IMG", "AirLightLeft_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "AirLightLeft_1", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "AirLightLeft_1", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "AirLightLeft_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "AirLightMid_1", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["IMG", "AirLightMid_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "AirLightMid_1", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "AirLightMid_1", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "AirLightMid_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "AirLightTop_1", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["IMG", "AirLightTop_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "AirLightTop_1", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "AirLightTop_1", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "AirLightTop_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "AvaWongToken_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "AvaWongToken_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "AvaWongToken_1", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "AvaWongToken_1", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "AvaWongToken_1", "modes", "Complications", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_1", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_1", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_1", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_1", "modes", "Complications", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "compCardSpot_10", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_10", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_10", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_10", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_10", "modes", "Complications", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "compCardSpot_2", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_2", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_2", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_2", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_2", "modes", "Complications", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "compCardSpot_3", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_3", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_3", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_3", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_3", "modes", "Complications", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "compCardSpot_4", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_4", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_4", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_4", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_4", "modes", "Complications", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "compCardSpot_5", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_5", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_5", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_5", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_5", "modes", "Complications", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "compCardSpot_6", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_6", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_6", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_6", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_6", "modes", "Complications", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "compCardSpot_7", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_7", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_7", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_7", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_7", "modes", "Complications", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "compCardSpot_8", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_8", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_8", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_8", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_8", "modes", "Complications", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "compCardSpot_9", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_9", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_9", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_9", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "compCardSpot_9", "modes", "Complications", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "complicationEnhanced_1", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationEnhanced_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationEnhanced_1", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationEnhanced_1", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationEnhanced_1", "modes", "Complications", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "complicationEnhanced_10", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationEnhanced_10", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationEnhanced_10", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationEnhanced_10", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationEnhanced_10", "modes", "Complications", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "complicationEnhanced_2", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationEnhanced_2", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationEnhanced_2", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationEnhanced_2", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationEnhanced_2", "modes", "Complications", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "complicationEnhanced_3", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationEnhanced_3", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationEnhanced_3", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationEnhanced_3", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationEnhanced_3", "modes", "Complications", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "complicationEnhanced_4", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationEnhanced_4", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationEnhanced_4", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationEnhanced_4", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationEnhanced_4", "modes", "Complications", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "complicationEnhanced_5", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationEnhanced_5", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationEnhanced_5", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationEnhanced_5", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationEnhanced_5", "modes", "Complications", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "complicationEnhanced_6", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationEnhanced_6", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationEnhanced_6", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationEnhanced_6", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationEnhanced_6", "modes", "Complications", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "complicationEnhanced_7", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationEnhanced_7", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationEnhanced_7", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationEnhanced_7", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationEnhanced_7", "modes", "Complications", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "complicationEnhanced_8", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationEnhanced_8", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationEnhanced_8", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationEnhanced_8", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationEnhanced_8", "modes", "Complications", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "complicationEnhanced_9", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationEnhanced_9", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationEnhanced_9", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationEnhanced_9", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationEnhanced_9", "modes", "Complications", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "ComplicationMat_1", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["IMG", "ComplicationMat_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "ComplicationMat_1", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "ComplicationMat_1", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "ComplicationMat_1", "modes", "Complications", {isForcedOn: true, isForcedState: null}],
                ["IMG", "complicationZero_1", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationZero_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationZero_1", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationZero_1", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationZero_1", "modes", "Complications", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "complicationZero_10", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationZero_10", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationZero_10", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationZero_10", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationZero_10", "modes", "Complications", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "complicationZero_2", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationZero_2", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationZero_2", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationZero_2", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationZero_2", "modes", "Complications", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "complicationZero_3", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationZero_3", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationZero_3", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationZero_3", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationZero_3", "modes", "Complications", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "complicationZero_4", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationZero_4", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationZero_4", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationZero_4", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationZero_4", "modes", "Complications", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "complicationZero_5", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationZero_5", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationZero_5", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationZero_5", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationZero_5", "modes", "Complications", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "complicationZero_6", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationZero_6", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationZero_6", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationZero_6", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationZero_6", "modes", "Complications", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "complicationZero_7", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationZero_7", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationZero_7", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationZero_7", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationZero_7", "modes", "Complications", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "complicationZero_8", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationZero_8", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationZero_8", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationZero_8", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationZero_8", "modes", "Complications", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "complicationZero_9", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationZero_9", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationZero_9", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationZero_9", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "complicationZero_9", "modes", "Complications", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "DistrictCenter_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "DistrictCenter_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "DistrictCenter_1", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "DistrictCenter_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "DistrictCenter_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "DistrictLeft_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "DistrictLeft_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "DistrictLeft_1", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "DistrictLeft_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "DistrictLeft_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "DistrictRight_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "DistrictRight_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "DistrictRight_1", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "DistrictRight_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "DistrictRight_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "downtimeBanner_1", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["IMG", "downtimeBanner_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "downtimeBanner_1", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "downtimeBanner_1", "modes", "Downtime", {isForcedOn: true, isForcedState: null}],
                ["IMG", "downtimeBanner_1", "modes", "Complications", {isForcedOn: false, isForcedState: null}],
                ["IMG", ["Dr.ArthurRoyToken_1"], "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", ["Dr.ArthurRoyToken_1"], "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", ["Dr.ArthurRoyToken_1"], "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", ["Dr.ArthurRoyToken_1"], "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", ["Dr.ArthurRoyToken_1"], "modes", "Complications", {isForcedOn: false, isForcedState: null}],
                ["IMG", "Horizon_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "Horizon_1", "modes", "Inactive", {isForcedOn: true, isForcedState: "night5"}],
                ["IMG", "Horizon_1", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "daylighters"}],
                ["IMG", "Horizon_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "night5"}],
                ["IMG", "Horizon_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "HungerBotLeft_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "HungerBotLeft_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "HungerBotLeft_1", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "HungerBotLeft_1", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "HungerBotLeft_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "HungerBotRight_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "HungerBotRight_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "HungerBotRight_1", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "HungerBotRight_1", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "HungerBotRight_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "HungerTopLeft_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "HungerTopLeft_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "HungerTopLeft_1", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "HungerTopLeft_1", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "HungerTopLeft_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "HungerTopRight_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "HungerTopRight_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "HungerTopRight_1", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "HungerTopRight_1", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "HungerTopRight_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "JohannesNapierToken_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "JohannesNapierToken_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "JohannesNapierToken_1", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "JohannesNapierToken_1", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "JohannesNapierToken_1", "modes", "Complications", {isForcedOn: false, isForcedState: null}],
                ["IMG", "LockeUlrichToken_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "LockeUlrichToken_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "LockeUlrichToken_1", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "LockeUlrichToken_1", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "LockeUlrichToken_1", "modes", "Complications", {isForcedOn: false, isForcedState: null}],
                ["IMG", "mapButtonAutarkis_1", "modes", "Active", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonAutarkis_1", "modes", "Inactive", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonAutarkis_1", "modes", "Daylighter", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonAutarkis_1", "modes", "Downtime", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonAutarkis_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonDistricts_1", "modes", "Active", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonDistricts_1", "modes", "Inactive", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonDistricts_1", "modes", "Daylighter", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonDistricts_1", "modes", "Downtime", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonDistricts_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonDomain_1", "modes", "Active", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonDomain_1", "modes", "Inactive", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonDomain_1", "modes", "Daylighter", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonDomain_1", "modes", "Downtime", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonDomain_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonParks_1", "modes", "Active", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonParks_1", "modes", "Inactive", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonParks_1", "modes", "Daylighter", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonParks_1", "modes", "Downtime", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonParks_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonRack_1", "modes", "Active", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonRack_1", "modes", "Inactive", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonRack_1", "modes", "Daylighter", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonRack_1", "modes", "Downtime", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonRack_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonRoads_1", "modes", "Active", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonRoads_1", "modes", "Inactive", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonRoads_1", "modes", "Daylighter", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonRoads_1", "modes", "Downtime", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonRoads_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonSitesCulture_1", "modes", "Active", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonSitesCulture_1", "modes", "Inactive", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonSitesCulture_1", "modes", "Daylighter", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonSitesCulture_1", "modes", "Downtime", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonSitesCulture_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonSitesEducation_1", "modes", "Active", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonSitesEducation_1", "modes", "Inactive", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonSitesEducation_1", "modes", "Daylighter", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonSitesEducation_1", "modes", "Downtime", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonSitesEducation_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonSitesHavens_1", "modes", "Active", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonSitesHavens_1", "modes", "Inactive", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonSitesHavens_1", "modes", "Daylighter", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonSitesHavens_1", "modes", "Downtime", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonSitesHavens_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonSitesHealth_1", "modes", "Active", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonSitesHealth_1", "modes", "Inactive", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonSitesHealth_1", "modes", "Daylighter", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonSitesHealth_1", "modes", "Downtime", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonSitesHealth_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonSitesLandmarks_1", "modes", "Active", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonSitesLandmarks_1", "modes", "Inactive", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonSitesLandmarks_1", "modes", "Daylighter", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonSitesLandmarks_1", "modes", "Downtime", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonSitesLandmarks_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonSitesNightlife_1", "modes", "Active", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonSitesNightlife_1", "modes", "Inactive", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonSitesNightlife_1", "modes", "Daylighter", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonSitesNightlife_1", "modes", "Downtime", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonSitesNightlife_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonSitesShopping_1", "modes", "Active", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonSitesShopping_1", "modes", "Inactive", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonSitesShopping_1", "modes", "Daylighter", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonSitesShopping_1", "modes", "Downtime", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonSitesShopping_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonSitesTransportation_1", "modes", "Active", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonSitesTransportation_1", "modes", "Inactive", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonSitesTransportation_1", "modes", "Daylighter", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonSitesTransportation_1", "modes", "Downtime", {isForcedOn: null, isForcedState: null}],
                ["IMG", "mapButtonSitesTransportation_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerDie_Big_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Big_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerDie_Big_1", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Big_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Big_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerDie_Big_2", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Big_2", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerDie_Big_2", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Big_2", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Big_2", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerDie_Main_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerDie_Main_1", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerDie_Main_10", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_10", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerDie_Main_10", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_10", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_10", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerDie_Main_11", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_11", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerDie_Main_11", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_11", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_11", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerDie_Main_12", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_12", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerDie_Main_12", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_12", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_12", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerDie_Main_13", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_13", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerDie_Main_13", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_13", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_13", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerDie_Main_14", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_14", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerDie_Main_14", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_14", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_14", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerDie_Main_15", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_15", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerDie_Main_15", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_15", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_15", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerDie_Main_16", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_16", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerDie_Main_16", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_16", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_16", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerDie_Main_17", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_17", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerDie_Main_17", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_17", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_17", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerDie_Main_18", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_18", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerDie_Main_18", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_18", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_18", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerDie_Main_19", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_19", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerDie_Main_19", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_19", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_19", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerDie_Main_2", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_2", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerDie_Main_2", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_2", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_2", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerDie_Main_20", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_20", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerDie_Main_20", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_20", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_20", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerDie_Main_21", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_21", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerDie_Main_21", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_21", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_21", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerDie_Main_22", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_22", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerDie_Main_22", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_22", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_22", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerDie_Main_23", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_23", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerDie_Main_23", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_23", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_23", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerDie_Main_24", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_24", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerDie_Main_24", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_24", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_24", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerDie_Main_25", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_25", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerDie_Main_25", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_25", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_25", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerDie_Main_26", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_26", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerDie_Main_26", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_26", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_26", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerDie_Main_27", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_27", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerDie_Main_27", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_27", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_27", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerDie_Main_28", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_28", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerDie_Main_28", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_28", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_28", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerDie_Main_29", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_29", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerDie_Main_29", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_29", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_29", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerDie_Main_3", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_3", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerDie_Main_3", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_3", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_3", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerDie_Main_30", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_30", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerDie_Main_30", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_30", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_30", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerDie_Main_4", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_4", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerDie_Main_4", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_4", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_4", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerDie_Main_5", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_5", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerDie_Main_5", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_5", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_5", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerDie_Main_6", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_6", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerDie_Main_6", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_6", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_6", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerDie_Main_7", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_7", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerDie_Main_7", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_7", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_7", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerDie_Main_8", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_8", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerDie_Main_8", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_8", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_8", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerDie_Main_9", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_9", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerDie_Main_9", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_9", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "RollerDie_Main_9", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerFrame_BottomEnd_1", "modes", "Active", {isForcedOn: true, isForcedState: null}],
                ["IMG", "RollerFrame_BottomEnd_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerFrame_BottomEnd_1", "modes", "Daylighter", {isForcedOn: true, isForcedState: null}],
                ["IMG", "RollerFrame_BottomEnd_1", "modes", "Downtime", {isForcedOn: true, isForcedState: null}],
                ["IMG", "RollerFrame_BottomEnd_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_1", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_2", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_2", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_2", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_2", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_2", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_3", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_3", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_3", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_3", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_3", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_4", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_4", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_4", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_4", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_4", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_5", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_5", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_5", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_5", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_5", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_6", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_6", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_6", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_6", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_6", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_7", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_7", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_7", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_7", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_7", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_8", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_8", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_8", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_8", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_8", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_9", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_9", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_9", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_9", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_BottomMid_9", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerFrame_Diff_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_Diff_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerFrame_Diff_1", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_Diff_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_Diff_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerFrame_Left_1", "modes", "Active", {isForcedOn: true, isForcedState: null}],
                ["IMG", "RollerFrame_Left_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerFrame_Left_1", "modes", "Daylighter", {isForcedOn: true, isForcedState: null}],
                ["IMG", "RollerFrame_Left_1", "modes", "Downtime", {isForcedOn: true, isForcedState: null}],
                ["IMG", "RollerFrame_Left_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerFrame_TopEnd_1", "modes", "Active", {isForcedOn: true, isForcedState: null}],
                ["IMG", "RollerFrame_TopEnd_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerFrame_TopEnd_1", "modes", "Daylighter", {isForcedOn: true, isForcedState: null}],
                ["IMG", "RollerFrame_TopEnd_1", "modes", "Downtime", {isForcedOn: true, isForcedState: null}],
                ["IMG", "RollerFrame_TopEnd_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_1", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_2", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_2", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_2", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_2", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_2", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_3", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_3", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_3", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_3", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_3", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_4", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_4", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_4", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_4", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_4", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_5", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_5", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_5", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_5", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_5", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_6", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_6", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_6", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_6", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_6", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_7", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_7", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_7", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_7", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_7", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_8", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_8", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_8", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_8", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_8", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_9", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_9", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_9", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_9", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "RollerFrame_TopMid_9", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "SignalLightBotLeft_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: "off"}],
                ["IMG", "SignalLightBotLeft_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "SignalLightBotLeft_1", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "SignalLightBotLeft_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "off"}],
                ["IMG", "SignalLightBotLeft_1", "modes", "Complications", {isForcedOn: "LAST", isForcedState: "off"}],
                ["IMG", "SignalLightBotRight_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: "off"}],
                ["IMG", "SignalLightBotRight_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "SignalLightBotRight_1", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "SignalLightBotRight_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "off"}],
                ["IMG", "SignalLightBotRight_1", "modes", "Complications", {isForcedOn: "LAST", isForcedState: "off"}],
                ["IMG", "SignalLightTopLeft_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: "off"}],
                ["IMG", "SignalLightTopLeft_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "SignalLightTopLeft_1", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "SignalLightTopLeft_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "off"}],
                ["IMG", "SignalLightTopLeft_1", "modes", "Complications", {isForcedOn: "LAST", isForcedState: "off"}],
                ["IMG", "SignalLightTopRight_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: "off"}],
                ["IMG", "SignalLightTopRight_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "SignalLightTopRight_1", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "SignalLightTopRight_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "off"}],
                ["IMG", "SignalLightTopRight_1", "modes", "Complications", {isForcedOn: "LAST", isForcedState: "off"}],
                ["IMG", "SiteBarCenter_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "SiteBarCenter_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "SiteBarCenter_1", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "SiteBarCenter_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "SiteBarCenter_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "SiteBarLeft_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "SiteBarLeft_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "SiteBarLeft_1", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "SiteBarLeft_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "SiteBarLeft_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "SiteBarRight_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "SiteBarRight_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "SiteBarRight_1", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "SiteBarRight_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "SiteBarRight_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "SiteCenter_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "SiteCenter_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "SiteCenter_1", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "SiteCenter_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "SiteCenter_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "SiteLeft_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "SiteLeft_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "SiteLeft_1", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "SiteLeft_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "SiteLeft_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "SiteRight_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "SiteRight_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "SiteRight_1", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "SiteRight_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "SiteRight_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "stakedAdvantagesHeader_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "stakedAdvantagesHeader_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "stakedAdvantagesHeader_1", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "stakedAdvantagesHeader_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "stakedAdvantagesHeader_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMap_1", "modes", "Active", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMap_1", "modes", "Inactive", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMap_1", "modes", "Daylighter", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMap_1", "modes", "Downtime", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMap_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "SubLocLeft", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "SubLocLeft", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "SubLocLeft", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "SubLocLeft", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "SubLocLeft", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "SubLocTopLeft", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "SubLocTopLeft", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "SubLocTopLeft", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "SubLocTopLeft", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "SubLocTopLeft", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "SubLocBotLeft", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "SubLocBotLeft", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "SubLocBotLeft", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "SubLocBotLeft", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "SubLocBotLeft", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "SubLocRight", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "SubLocRight", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "SubLocRight", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "SubLocRight", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "SubLocRight", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "SubLocTopRight", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "SubLocTopRight", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "SubLocTopRight", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "SubLocTopRight", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "SubLocTopRight", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "SubLocBotRight", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "SubLocBotRight", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "SubLocBotRight", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "SubLocBotRight", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["IMG", "SubLocBotRight", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapAutarkisOverlay_1", "modes", "Active", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapAutarkisOverlay_1", "modes", "Inactive", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapAutarkisOverlay_1", "modes", "Daylighter", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapAutarkisOverlay_1", "modes", "Downtime", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapAutarkisOverlay_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapDistrictsOverlay_1", "modes", "Active", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapDistrictsOverlay_1", "modes", "Inactive", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapDistrictsOverlay_1", "modes", "Daylighter", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapDistrictsOverlay_1", "modes", "Downtime", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapDistrictsOverlay_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapDomainOverlay_1", "modes", "Active", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapDomainOverlay_1", "modes", "Inactive", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapDomainOverlay_1", "modes", "Daylighter", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapDomainOverlay_1", "modes", "Downtime", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapDomainOverlay_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapParksOverlay_1", "modes", "Active", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapParksOverlay_1", "modes", "Inactive", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapParksOverlay_1", "modes", "Daylighter", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapParksOverlay_1", "modes", "Downtime", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapParksOverlay_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapRackOverlay_1", "modes", "Active", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapRackOverlay_1", "modes", "Inactive", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapRackOverlay_1", "modes", "Daylighter", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapRackOverlay_1", "modes", "Downtime", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapRackOverlay_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapRoadsOverlay_1", "modes", "Active", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapRoadsOverlay_1", "modes", "Inactive", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapRoadsOverlay_1", "modes", "Daylighter", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapRoadsOverlay_1", "modes", "Downtime", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapRoadsOverlay_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapSitesCultureOverlay_1", "modes", "Active", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapSitesCultureOverlay_1", "modes", "Inactive", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapSitesCultureOverlay_1", "modes", "Daylighter", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapSitesCultureOverlay_1", "modes", "Downtime", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapSitesCultureOverlay_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapSitesEducationOverlay_1", "modes", "Active", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapSitesEducationOverlay_1", "modes", "Inactive", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapSitesEducationOverlay_1", "modes", "Daylighter", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapSitesEducationOverlay_1", "modes", "Downtime", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapSitesEducationOverlay_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapSitesHavensOverlay_1", "modes", "Active", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapSitesHavensOverlay_1", "modes", "Inactive", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapSitesHavensOverlay_1", "modes", "Daylighter", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapSitesHavensOverlay_1", "modes", "Downtime", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapSitesHavensOverlay_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapSitesHealthOverlay_1", "modes", "Active", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapSitesHealthOverlay_1", "modes", "Inactive", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapSitesHealthOverlay_1", "modes", "Daylighter", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapSitesHealthOverlay_1", "modes", "Downtime", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapSitesHealthOverlay_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapSitesLandmarksOverlay_1", "modes", "Active", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapSitesLandmarksOverlay_1", "modes", "Inactive", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapSitesLandmarksOverlay_1", "modes", "Daylighter", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapSitesLandmarksOverlay_1", "modes", "Downtime", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapSitesLandmarksOverlay_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapSitesNightlifeOverlay_1", "modes", "Active", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapSitesNightlifeOverlay_1", "modes", "Inactive", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapSitesNightlifeOverlay_1", "modes", "Daylighter", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapSitesNightlifeOverlay_1", "modes", "Downtime", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapSitesNightlifeOverlay_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapSitesShoppingOverlay_1", "modes", "Active", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapSitesShoppingOverlay_1", "modes", "Inactive", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapSitesShoppingOverlay_1", "modes", "Daylighter", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapSitesShoppingOverlay_1", "modes", "Downtime", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapSitesShoppingOverlay_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapSitesTransportationOverlay_1", "modes", "Active", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapSitesTransportationOverlay_1", "modes", "Inactive", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapSitesTransportationOverlay_1", "modes", "Daylighter", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapSitesTransportationOverlay_1", "modes", "Downtime", {isForcedOn: null, isForcedState: null}],
                ["IMG", "TorontoMapSitesTransportationOverlay_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "WeatherClouds_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "WeatherClouds_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "WeatherClouds_1", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "WeatherClouds_1", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "WeatherClouds_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "WeatherGlow_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "WeatherGlow_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "WeatherGlow_1", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "WeatherGlow_1", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "WeatherGlow_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "WeatherFog_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "WeatherFog_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "WeatherFog_1", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "WeatherFog_1", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "WeatherFog_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "WeatherFrost_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "WeatherFrost_1", "modes", "Inactive", {isForcedOn: true, isForcedState: "redoverlay"}],
                ["IMG", "WeatherFrost_1", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "WeatherFrost_1", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "WeatherFrost_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "WeatherGround_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "WeatherGround_1", "modes", "Inactive", {isForcedOn: true, isForcedState: "wet"}],
                ["IMG", "WeatherGround_1", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "WeatherGround_1", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "WeatherGround_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "WeatherMain_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "WeatherMain_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "WeatherMain_1", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "WeatherMain_1", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "WeatherMain_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "weeklyResourcesHeader_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "weeklyResourcesHeader_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "weeklyResourcesHeader_1", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["IMG", "weeklyResourcesHeader_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: null}],
                ["IMG", "weeklyResourcesHeader_1", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["IMG", "wpRerollPlaceholder_1", "modes", "Active", {isForcedOn: true, isForcedState: null}],
                ["IMG", "wpRerollPlaceholder_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["IMG", "wpRerollPlaceholder_1", "modes", "Daylighter", {isForcedOn: true, isForcedState: null}],
                ["IMG", "wpRerollPlaceholder_1", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["IMG", "wpRerollPlaceholder_1", "modes", "Complications", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "AvaDesire", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["TEXT", "AvaDesire", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "AvaDesire", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: null}],
                ["TEXT", "AvaDesire", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: null}],
                ["TEXT", "AvaDesire", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["TEXT", "compCardName_1", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "compCardName_1", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "compCardName_1", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "compCardName_1", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "compCardName_1", "modes", "Complications", {isForcedOn: true, isForcedState: null}],
                ["TEXT", "compCardName_10", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "compCardName_10", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "compCardName_10", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "compCardName_10", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "compCardName_10", "modes", "Complications", {isForcedOn: true, isForcedState: null}],
                ["TEXT", "compCardName_2", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "compCardName_2", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "compCardName_2", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "compCardName_2", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "compCardName_2", "modes", "Complications", {isForcedOn: true, isForcedState: null}],
                ["TEXT", "compCardName_3", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "compCardName_3", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "compCardName_3", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "compCardName_3", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "compCardName_3", "modes", "Complications", {isForcedOn: true, isForcedState: null}],
                ["TEXT", "compCardName_4", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "compCardName_4", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "compCardName_4", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "compCardName_4", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "compCardName_4", "modes", "Complications", {isForcedOn: true, isForcedState: null}],
                ["TEXT", "compCardName_5", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "compCardName_5", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "compCardName_5", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "compCardName_5", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "compCardName_5", "modes", "Complications", {isForcedOn: true, isForcedState: null}],
                ["TEXT", "compCardName_6", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "compCardName_6", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "compCardName_6", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "compCardName_6", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "compCardName_6", "modes", "Complications", {isForcedOn: true, isForcedState: null}],
                ["TEXT", "compCardName_7", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "compCardName_7", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "compCardName_7", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "compCardName_7", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "compCardName_7", "modes", "Complications", {isForcedOn: true, isForcedState: null}],
                ["TEXT", "compCardName_8", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "compCardName_8", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "compCardName_8", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "compCardName_8", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "compCardName_8", "modes", "Complications", {isForcedOn: true, isForcedState: null}],
                ["TEXT", "compCardName_9", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "compCardName_9", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "compCardName_9", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "compCardName_9", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "compCardName_9", "modes", "Complications", {isForcedOn: true, isForcedState: null}],
                ["TEXT", "complicationCurrent", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "complicationCurrent", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "complicationCurrent", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "complicationCurrent", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "complicationCurrent", "modes", "Complications", {isForcedOn: true, isForcedState: null}],
                ["TEXT", "complicationRemaining", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "complicationRemaining", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "complicationRemaining", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "complicationRemaining", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "complicationRemaining", "modes", "Complications", {isForcedOn: true, isForcedState: null}],
                ["TEXT", "complicationTarget", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "complicationTarget", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "complicationTarget", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "complicationTarget", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "complicationTarget", "modes", "Complications", {isForcedOn: true, isForcedState: null}],
                ["TEXT", "Countdown", "modes", "Active", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "Countdown", "modes", "Inactive", {isForcedOn: true, isForcedState: null}],
                ["TEXT", "Countdown", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "Countdown", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "Countdown", "modes", "Complications", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "dicePool", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "dicePool", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "dicePool", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "dicePool", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "dicePool", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["TEXT", "difficulty", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "difficulty", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "difficulty", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "difficulty", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "difficulty", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["TEXT", "goldMods", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "goldMods", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "goldMods", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "goldMods", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "goldMods", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["TEXT", "LockeDesire", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["TEXT", "LockeDesire", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "LockeDesire", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: null}],
                ["TEXT", "LockeDesire", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: null}],
                ["TEXT", "LockeDesire", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["TEXT", "mainRoll", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "mainRoll", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "mainRoll", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "mainRoll", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "mainRoll", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["TEXT", "margin", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "margin", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "margin", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "margin", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "margin", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["TEXT", "NapierDesire", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["TEXT", "NapierDesire", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "NapierDesire", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: null}],
                ["TEXT", "NapierDesire", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: null}],
                ["TEXT", "NapierDesire", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["TEXT", "negMods", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "negMods", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "negMods", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "negMods", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "negMods", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["TEXT", "outcome", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "outcome", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "outcome", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "outcome", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "outcome", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["TEXT", "posMods", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "posMods", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "posMods", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "posMods", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "posMods", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["TEXT", "redMods", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "redMods", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "redMods", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "redMods", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "redMods", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["TEXT", "resultCount", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "resultCount", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "resultCount", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "resultCount", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "resultCount", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["TEXT", "rollerName", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "rollerName", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "rollerName", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "rollerName", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "rollerName", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["TEXT", "RoyDesire", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["TEXT", "RoyDesire", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "RoyDesire", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: null}],
                ["TEXT", "RoyDesire", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: null}],
                ["TEXT", "RoyDesire", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["TEXT", "secretRollTraits", "modes", "Active", {isForcedOn: null, isForcedState: null}],
                ["TEXT", "secretRollTraits", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "secretRollTraits", "modes", "Daylighter", {isForcedOn: null, isForcedState: null}],
                ["TEXT", "secretRollTraits", "modes", "Downtime", {isForcedOn: null, isForcedState: null}],
                ["TEXT", "secretRollTraits", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["TEXT", "SiteNameCenter", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "SiteNameCenter", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "SiteNameCenter", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "SiteNameCenter", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "SiteNameCenter", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["TEXT", "SiteNameLeft", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "SiteNameLeft", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "SiteNameLeft", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "SiteNameLeft", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "SiteNameLeft", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["TEXT", "SiteNameRight", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "SiteNameRight", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "SiteNameRight", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "SiteNameRight", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "SiteNameRight", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["TEXT", "stakedAdvantages", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["TEXT", "stakedAdvantages", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "stakedAdvantages", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "stakedAdvantages", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: null}],
                ["TEXT", "stakedAdvantages", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["TEXT", "stakedCoterieAdvantages", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["TEXT", "stakedCoterieAdvantages", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "stakedCoterieAdvantages", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "stakedCoterieAdvantages", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: null}],
                ["TEXT", "stakedCoterieAdvantages", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["TEXT", "subOutcome", "modes", "Active", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "subOutcome", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "subOutcome", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "subOutcome", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: true}],
                ["TEXT", "subOutcome", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["TEXT", "tempC", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["TEXT", "tempC", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "tempC", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: null}],
                ["TEXT", "tempC", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "tempC", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["TEXT", "tempF", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["TEXT", "tempF", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "tempF", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: null}],
                ["TEXT", "tempF", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "tempF", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["TEXT", "testSessionNotice", "modes", "Active", {isForcedOn: null, isForcedState: null}],
                ["TEXT", "testSessionNotice", "modes", "Inactive", {isForcedOn: null, isForcedState: null}],
                ["TEXT", "testSessionNotice", "modes", "Daylighter", {isForcedOn: null, isForcedState: null}],
                ["TEXT", "testSessionNotice", "modes", "Downtime", {isForcedOn: null, isForcedState: null}],
                ["TEXT", "testSessionNotice", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["TEXT", "TimeTracker", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["TEXT", "TimeTracker", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "TimeTracker", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: null}],
                ["TEXT", "TimeTracker", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: null}],
                ["TEXT", "TimeTracker", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["TEXT", "weather", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["TEXT", "weather", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "weather", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: null}],
                ["TEXT", "weather", "modes", "Downtime", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "weather", "modes", "Complications", {isForcedOn: null, isForcedState: null}],
                ["TEXT", "weeklyResources", "modes", "Active", {isForcedOn: "LAST", isForcedState: null}],
                ["TEXT", "weeklyResources", "modes", "Inactive", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "weeklyResources", "modes", "Daylighter", {isForcedOn: false, isForcedState: null}],
                ["TEXT", "weeklyResources", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: null}],
                ["TEXT", "weeklyResources", "modes", "Complications", {isForcedOn: null, isForcedState: null}]
            ]
            for (const data of modeData) {
                let value = data.pop(),
                    ref = REGISTRY[data.shift()][data[0]]
                if (!ref)
                    continue
                const mediaName = data.shift(),
                    key = data.pop()
                while (data.length) {
                    const newKey = data.shift()
                    if (!ref[newKey])
                        ref[newKey] = {}
                    ref = ref[newKey]
                }
                if (value === "@@curText@@") {
                    const textObj = getTextObj(mediaName)
                    if (VAL({textObj}))
                        value = textObj.get("text")
                }
                ref[key] = value
            }
        },
    // #endregion
    
    // #region IMG OBJECT & AREA GETTERS: Img Object & Data Retrieval
        isRegImg = imgRef => Boolean(getImgKey(imgRef, true)),        
        isCharToken = imgObj => VAL({imgObj}) && D.GetName(imgObj.get("represents")) === imgObj.get("name"),
        isRegToken = imgObj => VAL({imgObj}) && REGISTRY.TOKEN[imgObj.get("name")],
        isRandomizerToken = tokenObj => isCharToken(tokenObj) && isRegToken(tokenObj) && REGISTRY.TOKEN[tokenObj.get("name")].randomSrcs && REGISTRY.TOKEN[tokenObj.get("name")].randomSrcs.base,
        getImgKey = (imgRef, funcName = false) => {
            try {
                let imgKey, imgObj
                if (VAL({char: imgRef}))
                    return imgRef
                if (VAL({string: imgRef})) {
                    if (REGISTRY.GRAPHIC[imgRef])
                        return imgRef
                    if (REGISTRY.GRAPHIC[`${imgRef}_1`])
                        return `${imgRef}_1`
                    imgObj = getObj("graphic", imgRef)                    
                } else if (VAL({imgObj: imgRef})) {
                    imgObj = imgRef
                } else if (VAL({selection: imgRef})) {
                    [imgObj] = D.GetSelected(imgRef)
                }
                if (VAL({imgObj})) {
                    imgKey = getImgKey(imgObj.get("name"), true)
                    if (REGISTRY.GRAPHIC[imgKey])
                        return imgKey
                    imgKey = getImgKey(imgObj.get("name"), true)
                    if (REGISTRY.GRAPHIC[imgKey])
                        return imgKey
                    imgKey = getImgKey((_.find(_.values(Char.REGISTRY), x => x.id === imgObj.get("represents")) || {tokenName: false}).tokenName, true)
                    if (REGISTRY.GRAPHIC[imgKey])
                        return imgKey
                    imgKey = getImgKey(`${getObj("character", imgObj.get("represents")).get("name").replace(/\s+/gu, "")}Token`, true)
                    if (REGISTRY.GRAPHIC[imgKey])
                        return imgKey
                }
                return VAL({string: funcName}) && THROW(`Cannot find name of image from reference '${D.JSL(imgRef)}'`, `${D.JSL(funcName)} > GetImgKey`)
            } catch (errObj) {
                return VAL({string: funcName}) && THROW(`Cannot locate image with search value '${D.JSL(imgRef)}'`, `${D.JSL(funcName)} > GetImgKey`, errObj)
            }
        },
        getImgObj = (imgRef, funcName = false) => {
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
                    imgObj = getObj("graphic", REGISTRY.GRAPHIC[imgKey].id)
                if (VAL({imgObj}))
                    return imgObj
                return false
            } catch (errObj) {
                return VAL({string: funcName}) && THROW(`IMGREF: ${D.JSL(imgRef)}`, `${D.JSL(funcName)} > getImgObj`, errObj)
            }
        },
        getImgObjs = (imgRefs, funcName = false) => {
            // D.Alert(`GetSelected ImgRefs: ${D.JS(D.GetSelected(imgRefs))}`)
            imgRefs = VAL({selection: imgRefs}) ? D.GetSelected(imgRefs) : imgRefs || _.keys(REGISTRY.GRAPHIC)
            const imgObjs = []
            if (VAL({array: imgRefs}))
                for (const imgRef of imgRefs)
                    imgObjs.push(getImgObj(imgRef, funcName))
            return _.compact(imgObjs)
        },
        getImgData = (imgRef, funcName = false) => {
            const imgData = (() => {
                let imgKey, imgObj
                try {
                    imgKey = getImgKey(imgRef, funcName)
                    if (VAL({string: imgKey}) || VAL({imgObj: imgKey}) && REGISTRY.GRAPHIC[imgKey.get("name")])
                        return REGISTRY.GRAPHIC[imgKey] || REGISTRY.GRAPHIC[imgKey.get("name")]
                    imgObj = getImgObj(imgRef, funcName)
                    if (VAL({imgObj}, "getImgData")) {
                        if (REGISTRY.GRAPHIC[imgObj.get("name")])
                            return REGISTRY.GRAPHIC[imgObj.get("name")]
                        if (VAL({char: imgKey}) && !REGISTRY.GRAPHIC[imgObj.get("name")])
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
                    return VAL({string: funcName}) && THROW(`Cannot locate image with search value '${D.JSL(imgRef)}'`, `${D.JSL(funcName)} > getImgData`, errObj)
                }
            })()
            if (VAL({list: imgData}, VAL({string: funcName}) ? `${D.JSL(funcName)} > getImgData` : null)) {
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
        getTokenObj = (charRef, funcName = false) => {
            const charObj = D.GetChar(charRef, funcName)
            if (charObj)
                return (findObjs({_pageid: D.PAGEID, _type: "graphic", _subtype: "token", represents: charObj.id}) || [false])[0]
            return VAL({string: funcName}) && THROW(`No character found for reference ${charRef}`, `${D.JSL(funcName)} > getTokenObj`)
        },
        getAreaData = areaRef => REGISTRY.AREA[areaRef],
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
            if (VAL({string: locRef}) && REGISTRY.AREA[locRef]) {
                boundaryData.top = REGISTRY.AREA[locRef].top
                boundaryData.left = REGISTRY.AREA[locRef].left
                boundaryData.height = REGISTRY.AREA[locRef].height
                boundaryData.width = REGISTRY.AREA[locRef].width
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
                const imgSrc = !srcName.startsWith("ref:") && (
                    _.isString(imgSrcRef) && imgSrcRef.includes("http") ?
                        imgSrcRef :
                        (getImgObj(imgSrcRef) || {get: () => ""}).get("imgsrc").replace(/\w*?(?=\.\w+?\?)/u, "thumb")
                )
                if (imgSrc !== "" && isRegImg(imgName)) {
                    if (srcName.startsWith("ref:"))
                        REGISTRY.IMG[getImgKey(imgName)].srcs = srcName.replace(/ref:/gu, "")
                    else 
                        REGISTRY.IMG[getImgKey(imgName)].srcs[srcName] = imgSrc
                    D.Alert(`Img '${D.JS(srcName)}' added to category '${D.JS(imgName)}'.<br><br>Source: ${D.JS(imgSrc)}`)
                }
            } catch (errObj) {
                THROW("", "addImgSrc", errObj)
            }
        },
        addTokenSrc = (tokenSrcRef, charRef, srcName = false) => {
            const charObj = D.GetChar(charRef),
                tokenSrc = (VAL({string: tokenSrcRef}) && tokenSrcRef.includes(".png") ? tokenSrcRef || "" : (getImgObj(tokenSrcRef) || {get: () => ""}).get("imgsrc")).replace(/[^/]*\.png/gu, "thumb.png")
            if (VAL({charObj, string: tokenSrc}) && tokenSrc.includes("png")) {
                const tokenKey = charObj.get("name")
                if (!srcName && isRandomizerToken(tokenKey)) {
                    REGISTRY.TOKEN[tokenKey].srcs.randomSrcs.push(tokenSrc)
                    D.Alert(`Random token image added:<br><br>${D.JS(REGISTRY.TOKEN[tokenKey])}`, "addTokenSrc")
                    return true
                } else if (VAL({string: srcName})) {
                    REGISTRY.TOKEN[tokenKey].srcs[srcName] = tokenSrc
                    D.Alert(`Token image source '${D.JS(srcName)}' added:<br><br>${D.JS(REGISTRY.TOKEN[tokenKey])}`, "addTokenSrc")
                    return true
                }
                D.Alert("Not a randomizer token!  Must include a valid source name.", "addTokenSrc")
                return false
            }
            D.Alert("Invalid character or token image source.", "addTokenSrc")
            return false
        },
        toggleTokenSrc = (charRef, srcName) => {
            const tokenObj = getTokenObj(charRef)
            if (VAL({tokenObj}) && isRegToken(tokenObj)) {
                const tokenName = tokenObj.get("name"),
                    curSrcs = D.Capitalize(REGISTRY.TOKEN[tokenName].curSrc || "base").match(/[A-Z][a-z]*/gu),
                    tokenSrcs = REGISTRY.TOKEN[tokenName].srcs
                let newTokenSrcNames = []
                if (D.LCase(srcName) === "base")
                    newTokenSrcNames = ["base"]
                else if (curSrcs.includes(D.Capitalize(srcName)))
                    newTokenSrcNames = _.without(curSrcs, D.Capitalize(srcName))
                else
                    newTokenSrcNames = [..._.without(curSrcs, "Base"), D.Capitalize(srcName)]
                newTokenSrcNames.sort()
                const tokenSrc = tokenSrcs[newTokenSrcNames.join("")]
                REGISTRY.TOKEN[tokenName].curSrc = newTokenSrcNames.join("")
                tokenObj.set("imgsrc", tokenSrc)
            }
        },
        regImg = (imgRef, imgName, srcName, activeLayer, options = {}, funcName = false) => {
            // D.Alert(`Options for '${D.JS(imgName)}': ${D.JS(options)}`, "MEDIA: regImg")
            if (!(imgRef && imgName && srcName && activeLayer))
                return THROW("Must supply all parameters for regImg.", "RegImg")
            const imgObj = getImgObj(imgRef)
            if (VAL({graphicObj: imgObj}, "regImg")) {                
                const baseName = imgName.replace(/(_|\d|#)+$/gu, ""),
                    name = `${baseName}_${_.filter(_.keys(REGISTRY.IMG), k => k.includes(baseName)).length + 1}`,
                    params = {
                        left: options.left || imgObj.get("left") || REGISTRY.IMG[name].left || C.IMAGES[baseName.toLowerCase()] && C.IMAGES[baseName.toLowerCase()].left,
                        top: options.top || imgObj.get("top") || REGISTRY.IMG[name].top || C.IMAGES[baseName.toLowerCase()] && C.IMAGES[baseName.toLowerCase()].top,
                        height: options.height || imgObj.get("height") || REGISTRY.IMG[name].height || C.IMAGES[baseName.toLowerCase()] && C.IMAGES[baseName.toLowerCase()].height,
                        width: options.width || imgObj.get("width") || REGISTRY.IMG[name].width || C.IMAGES[baseName.toLowerCase()] && C.IMAGES[baseName.toLowerCase()].width
                    }
                if (!params.left || !params.top || !params.height || !params.width)
                    return THROW("Must supply position & dimension to register image.", "RegImg")
                imgObj.set({name, showname: false})
                REGISTRY.IMG[name] = {
                    id: imgObj.id,
                    type: imgObj.get("_type") === "text" && "text" || "image",
                    name,
                    left: params.left,
                    top: params.top,
                    height: params.height,
                    width: params.width,
                    activeLayer,
                    zIndex: options.zIndex || (REGISTRY.IMG[name] ? REGISTRY.IMG[name].zIndex : 200),
                    srcs: {},
                    modes: C.MODEDEFAULTS(imgObj, params.modes)
                }
                REGISTRY.IMG[name].modes = C.MODEDEFAULTS(imgObj, params.modes)
                DB(`Modes for ${name}: ${D.JSL(REGISTRY.IMG[name].modes)}`, "regImg")
                if (srcName !== "none") {
                    addImgSrc(imgObj.get("imgsrc").replace(/med/gu, "thumb"), name, srcName)
                    setImg(name, srcName.includes("ref:") ? "base" : srcName)
                }
                layerImgs([name], REGISTRY.IMG[name].activeLayer)
                if (VAL({string: funcName}))
                    D.Alert(`Host obj for '${D.JS(name)}' registered: ${D.JS(REGISTRY.IMG[name])}`, "MEDIA: regImg")
                return getImgData(name)
            }
            return THROW(`Invalid image reference '${D.JSL(imgRef)}'`, "regImg")
        },
        regToken = (tokenRef) => {
            const tokenObj = tokenRef && tokenRef.get && tokenRef || getImgObj(tokenRef)
            // D.Alert(`tokenRef: ${D.JS(tokenRef, true)}<br><br>tokenObj: ${D.JS(tokenObj, true)}`)
            if (VAL({tokenObj}, "regToken")) {
                const tokenSrc = tokenObj.get("imgsrc").replace(/[^/]*\.png/gu, "thumb.png"),
                    tokenName = tokenObj.get("name")
                REGISTRY.TOKEN[tokenName] = {}
                Object.assign(REGISTRY.TOKEN[tokenName], {
                    name: tokenObj.get("name"),
                    id: tokenObj.id,
                    charID: tokenObj.get("represents"),
                    srcs: {
                        base: tokenSrc
                    }
                })
                D.Alert(`Token registered:<br><br>${D.JS(REGISTRY.TOKEN[tokenName])}`, "regToken")
                return true
            }
            D.Alert("Token registration failed.", "regToken")
            return false
        },
        regRandomizerToken = (imgRef, tokenName) => {
            if (isRegToken(imgRef) || regToken(imgRef)) {
                const tokenObj = getImgObj(imgRef),
                    tokenKey = tokenObj.get("name"),
                    tokenBaseSrc = REGISTRY.TOKEN[tokenKey].srcs.base
                if (VAL({string: tokenBaseSrc})) {
                    REGISTRY.TOKEN[tokenKey].srcs.randomSrcs = [ tokenBaseSrc ]
                    REGISTRY.TOKEN[tokenKey].randomSrcCount = 0
                    D.Alert(`Randomizer Token Registered:<br><br>${D.JS(REGISTRY.TOKEN[tokenKey])}`, "regRandomizerToken")
                    return true
                }
            }
            D.Alert(`No 'base' source found for ${tokenName}`, "regRandomizerToken")
            return false
        },
        regArea = (imgRef, areaName) => {
            const imgObj = getImgObj(imgRef)
            if (VAL({graphicObj: imgObj}, "regArea")) {
                REGISTRY.AREA[areaName] = {
                    top: D.Int(imgObj.get("top")),
                    left: D.Int(imgObj.get("left")),
                    height: D.Int(imgObj.get("height")),
                    width: D.Int(imgObj.get("width"))
                }
                D.Alert(`Area Registered: ${areaName}<br><br><pre>${D.JS(REGISTRY.AREA[areaName])}</pre>`, "Media: Register Area")
            }
        },
        makeImg = (imgName = "", params = {}, funcName = false) => {
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
            regImg(imgObj, imgName, params.imgsrc && params.imgsrc !== C.IMAGES.blank ? "base" : "blank", params.activeLayer || params.layer || "gmlayer", options, funcName)
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
                            REGISTRY.IMG[imgData.name].activeSrc = srcRef
                        REGISTRY.IMG[imgData.name].curSrc = srcRef
                        imgObj.set("imgsrc", srcURL)                  
                    }
                    return imgObj
                }
            }
            return false
        },
        setRandomizerToken = tokenObj => {
            if (isRandomizerToken(tokenObj)) {
                const tokenKey = tokenObj.get("name"),
                    tokenSrcs = REGISTRY.TOKEN[tokenKey].srcs.randomSrcs
                let tokenNum = REGISTRY.TOKEN[tokenKey].randomSrcCount
                if (tokenNum >= tokenSrcs.length)
                    tokenNum = 0
                else
                    tokenNum++
                const tokenSrc = tokenSrcs[tokenNum]
                tokenObj.set("imgsrc", tokenSrc)
                REGISTRY.TOKEN[tokenKey].randomSrcCount = tokenNum
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
                    REGISTRY.IMG[imgKey][k] = v
                })
                if (isSettingObject)
                    setImgTemp(imgKey, params)
                return REGISTRY.IMG[imgKey]
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
                    REGISTRY.IMG[imgData.name].activeSrc = imgData.curSrc
                    REGISTRY.IMG[imgData.name].isActive = false
                    setLayer(imgObj, "walls", isForcing)
                    return false                   
                } else if (activeCheck === true) {
                    // TURN ON: Set layer to active layer, toggle on associated drag pads, restore activeState value if it's different
                    REGISTRY.IMG[imgData.name].isActive = true
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
                delete REGISTRY.IMG[imgData.name]
                return true
            } else if (imgData && REGISTRY.IMG[imgData.name]) {
                delete REGISTRY.IMG[imgData.name]
                return true
            } else if (_.isString(imgRef) && REGISTRY.IMG[imgRef]) {
                delete REGISTRY.IMG[imgRef]
                return true
            }
            return THROW(`Invalid image reference ${D.JSL(imgRef)}`, "removeImg")
        },
        removeImgs = (imgString, isUnregOnly) => {
            const imgNames = _.filter(_.keys(REGISTRY.IMG), v => v.includes(imgString))
            for (const imgName of imgNames)
                removeImg(imgName, isUnregOnly)

        },
        cleanRegistry = () => {
            STATEREF.regClean = []
            for (const imgName of _.keys(REGISTRY.IMG))
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
            const imgKeys = _.keys(REGISTRY.IMG),
                imgPairs = _.zip(imgKeys.map(x => REGISTRY.IMG[x]), imgKeys.map(x => getObj("graphic", REGISTRY.IMG[x].id))),
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
        initAnimations = () => {
            for (const [animName, animData] of Object.entries(REGISTRY.ANIM))
                if (animData.startActive)
                    activateAnimation(animName)
                else
                    deactivateAnimation(animName)
        },
        regAnimation = (imgObj, animName, timeOut, activeLayer = "map", startActive = false) => {
            if (VAL({imgObj}, "regAnimation")) {
                imgObj.set("name", animName)
                imgObj.set("layer", "gmlayer")
                REGISTRY.ANIM[animName] = {
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
                    maxTimeBetween: 100000,
                    startActive: startActive !== false && startActive !== "false",
                    isActive: startActive !== false && startActive !== "false",                    
                    validModes: ["Active"],
                    soundEffect: null
                }
                REGISTRY.ANIM[animName].leftEdge = REGISTRY.ANIM[animName].left - 0.5 * REGISTRY.ANIM[animName].width
                REGISTRY.ANIM[animName].rightEdge = REGISTRY.ANIM[animName].left + 0.5 * REGISTRY.ANIM[animName].width
                REGISTRY.ANIM[animName].topEdge = REGISTRY.ANIM[animName].top - 0.5 * REGISTRY.ANIM[animName].height
                REGISTRY.ANIM[animName].bottomEdge = REGISTRY.ANIM[animName].top + 0.5 * REGISTRY.ANIM[animName].height
            }
        },
        setAnimData = (animName, minTimeBetween = 0, maxTimeBetween = 100, soundEffect = null, validModes = "Active") => {
            const animData = getImgData(animName)
            animData.minTimeBetween = D.Int(1000 * D.Float(minTimeBetween))
            animData.maxTimeBetween = D.Int(1000 * D.Float(maxTimeBetween))
            animData.soundEffect = soundEffect
            animData.validModes = validModes.split("|")
        },
        flashAnimation = (animName) => {
            const animData = getImgData(animName)
            if (!animData.validModes.includes(Session.Mode)) {
                deactivateAnimation(animName)
            } else if (animData.isActive) {
                const animObj = getImgObj(animName)
                animObj.set("layer", animData.activeLayer)
                if (animData.soundEffect && animData.validModes.includes(Session.Mode))
                    startSound(animData.soundEffect, undefined, undefined, true)
                if (animData.timeOut)
                    setTimeout(() => killAnimation(animObj), animData.timeOut)
            }
        },
        activateAnimation = (animName, minTime, maxTime) => {
            const animData = getImgData(animName);
            [minTime, maxTime] = [minTime || animData.minTimeBetween, maxTime || animData.maxTimeBetween]
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
                animObj.set("layer", "walls")
        },
        killAllAnims = () => {
            for (const animData of _.values(REGISTRY.ANIM))
                (getObj("graphic", animData.id) || {set: () => false}).set("layer", "walls")
        },
    // #endregion

    // #region TEXT OBJECT GETTERS: Text Object, Width Measurements, Data Retrieval    
        isRegText = textRef => Boolean(getTextKey(textRef, true)), 
        getTextKey = (textRef, funcName = false) => {
            try {
                let textObj
                if (VAL({string: textRef})) {
                    if (REGISTRY.TEXT[textRef])
                        return textRef
                    /* if (REGISTRY.TEXT[`${textRef}_1`])
                        return `${textRef}_1` */
                    if (REGISTRY.ID[textRef])
                        return REGISTRY.ID[textRef]
                }
                if (VAL({selected: textRef}))
                    [textObj] = D.GetSelected(textRef)
                if (VAL({textObj: textRef}))
                    textObj = textRef
                if (VAL({textObj}))
                    if (REGISTRY.ID[textObj.id])
                        return REGISTRY.ID[textObj.id]
                return VAL({string: funcName}) && THROW(`Cannot locate text key with search value '${D.JSL(textRef)}'`, `${D.JSL(funcName)} > getTextKey`)
            } catch (errObj) {
                return VAL({string: funcName}) && THROW(`Cannot locate text key with search value '${D.JSL(textRef)}'`, `${D.JSL(funcName)} > getTextKey`, errObj)
            }
        },
        getTextObj = (textRef, funcName = false) => {
            try {
                let textObj
                if (VAL({textObj: textRef}))
                    textObj = textRef
                else if (VAL({string: textRef}))
                    if (getTextKey(textRef, funcName))
                        textObj = getObj("text", REGISTRY.TEXT[getTextKey(textRef)].id)
                    else
                        textObj = getObj("text", textRef) || null
                else if (VAL({selected: textRef}))
                    [textObj] = D.GetSelected(textRef)
                return textObj || VAL({string: funcName}) && THROW(`Bad text reference: ${D.JSL(textRef)}`, `${D.JSL(funcName)} > getTextObj`)
            } catch (errObj) {
                return VAL({string: funcName}) && THROW(`Bad text reference: ${D.JSL(textRef)}`, `${D.JSL(funcName)} > getTextObj`, errObj)
            }
        },
        hasShadowObj = textRef => Boolean((getTextData(textRef) || {shadowID: false}).shadowID),
        getShadowShift = textRef => C.SHADOWOFFSETS[(getTextObj(textRef) || {get: () => 20}).get("font_size")],
        getTextData = (textRef, funcName = false) => {
            try {
                if (getTextKey(textRef, funcName)) {
                    return REGISTRY.TEXT[getTextKey(textRef, funcName)]
                } else if (getTextObj(textRef, funcName)) {
                    const textObj = getTextObj(textRef, funcName)
                    DB(`Retrieving data for UNREGISTERED Text Object ${D.JSL(textRef)}`, "getTextData")
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
                return VAL({string: funcName}) && THROW(`Text reference '${textRef}' does not refer to a registered text object.`, `${D.JSL(funcName)} > getTextData`)
            } catch (errObj) {
                return VAL({string: funcName}) && THROW(`Text reference '${textRef}' does not refer to a registered text object.`, `${D.JSL(funcName)} > getTextData`, errObj)
            }
        },
        getLineHeight = textRef => {
            const textObj = getTextObj(textRef)
            if (VAL({textObj})) {
                const [fontFamily, fontSize, height] = [
                    textObj.get("font_family").toLowerCase().includes("contrail") ? "Contrail One" : textObj.get("font_family"),
                    textObj.get("font_size"),
                    textObj.get("height")
                ]
                // D.Alert([font_family, font_size, height, D.CHARWIDTH[font_family][font_size].lineHeight].join("<br>"))
                return D.CHARWIDTH[fontFamily] && D.CHARWIDTH[fontFamily][fontSize] && D.CHARWIDTH[fontFamily][fontSize].lineHeight || height
            }
            return false
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
            for (let i = 0; true; i++) { // eslint-disable-line no-constant-condition
                if (getTextWidth(textObj, textStrings[i], false) > maxWidth) {
                    let [prevLine, curLine, nextLine] = [
                        i > 0 ? textStrings[i-1] : false,
                        textStrings[i],
                        i < textStrings.length - 1 ? textStrings[i+1] : false
                    ]
                    if (prevLine !== false && prevLine.charAt(prevLine.length - 1) === " ")
                        prevLine = prevLine.slice(0, -1)
                    if (nextLine !== false && nextLine.charAt(0) === " ")
                        nextLine = nextLine.slice(1)
                    if (curLine.charAt(curLine.length - 1) === " ")
                        curLine = curLine.slice(0, -1)
                    if (curLine.charAt(0) === " ")
                        curLine = curLine.slice(1)
                    const [prevLineSpace, nextLineSpace] = [
                            prevLine === false ? maxWidth : maxWidth - getTextWidth(textObj, prevLine, false),
                            nextLine === false ? maxWidth : maxWidth - getTextWidth(textObj, nextLine, false)
                        ], // Set PERCENTAGE of maxWidth that free space must take up in previous line to prefer it.
                        PREVLINEPERCENT = 0.75
                    if (prevLineSpace >= maxWidth * PREVLINEPERCENT || prevLineSpace >= nextLineSpace) {
                        let shiftString = curLine.charAt(0)
                        curLine = curLine.slice(1)
                        for (let j = 0; j < curLine.length; j++) {
                            if (getTextWidth(textObj, ` ${shiftString}${curLine.charAt(0)}-`, false) > prevLineSpace)
                                break
                            shiftString += curLine.charAt(0)
                            curLine = curLine.slice(1)
                        }
                        prevLine = `${(prevLine && `${prevLine} ` || "").replace(/-$/gu, "")}${shiftString}-`
                    }
                    if (getTextWidth(textObj, `${curLine}-`, false) > maxWidth) {
                        let shiftString = curLine.charAt(curLine.length - 1)
                        curLine = curLine.slice(0, -1)
                        for (let j = 0; j < curLine.length; j++) {
                            if (getTextWidth(textObj, `${curLine}-`, false) <= maxWidth)
                                break                            
                            shiftString = curLine.charAt(curLine.length - 1)
                            curLine = curLine.slice(0, -1)
                        }     
                        curLine = `${curLine}-`                   
                        nextLine = `${shiftString}${(nextLine && ` ${nextLine}` || "").replace(/^-/gu, "")}`
                    }
                    if (i === 0 && prevLine) {
                        if (nextLine)
                            textStrings = [prevLine, curLine, nextLine, ...textStrings.slice(2)]
                        else
                            textStrings = [prevLine, curLine]
                        i++
                    } else {
                        textStrings[i-1] = prevLine || textStrings[i-1]
                        textStrings[i] = curLine
                        if (nextLine)
                            textStrings[i+1] = nextLine
                    }
                }
                if (i >= textStrings.length - 1)
                    break
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
                REGISTRY.TEXT[getTextKey(textObj)].justification = justification || "center"
                REGISTRY.TEXT[getTextKey(textObj)].left = getBlankLeft(textObj, justification, maxWidth)
                REGISTRY.TEXT[getTextKey(textObj)].width = getTextWidth(textObj, textObj.get("text"), maxWidth)
                // D.Alert(`${getTextKey(textRef)} Updated: ${D.JS(REGISTRY.TEXT[getTextKey(textObj)])}`, "justifyText")
            }
        },
    // #endregion

    // #region TEXT OBJECT SETTERS: Registering, Changing, Deleting
        regText = (textRef, hostName, activeLayer, hasShadow, justification = "center", options = {}, funcName = false) => {
            const textObj = getTextObj(textRef)
            DB(`regText(textRef, ${D.JSL(hostName)}, ${D.JSL(activeLayer)}, ${D.JSL(hasShadow)}, ${D.JSL(options)}`, "regText")
            if (VAL({text: textObj})) {
                if (!(hostName && activeLayer))
                    return THROW("Must supply host name and active layer for regText.", "RegText")
                let name
                if (options.name && !REGISTRY.TEXT[options.name])
                    name = options.name
                else if (!REGISTRY.TEXT[hostName])
                    name = hostName
                else
                    name = `${hostName.replace(/(_|\d|#)+$/gu, "")}_${_.filter(_.keys(REGISTRY.TEXT), k => k.includes(hostName.replace(/(_|\d|#)+$/gu, ""))).length + 1}`
                const [font_family, font_size, curText, height] = [ /* eslint-disable-line camelcase */
                        textObj.get("font_family").toLowerCase().includes("contrail") ? "Contrail One" : textObj.get("font_family"),
                        textObj.get("font_size"),
                        textObj.get("text").trim(),
                        textObj.get("height")
                    ],
                    lineHeight = getLineHeight(textObj)                    
                REGISTRY.TEXT[name] = Object.assign({name, height, font_family, font_size, activeLayer, lineHeight, justification, curText,
                                                     id: textObj.id,
                                                     type: textObj.get("_type") === "text" && "text" || "image",
                                                     top: textObj.get("top") - 0.5 * (curText.split("\n").length - 1) * lineHeight,
                                                     color: textObj.get("color"),
                                                     maxWidth: 0,
                                                     activeText: curText,
                                                     vertAlign: "top",
                                                     curMode: Session.Mode,
                                                     isActive: true}, _.omit(options, (v, k) => ["text", "layer", "_type", "obj", "object"].includes(k) || v === undefined))
                REGISTRY.TEXT[name].left = getBlankLeft(textObj, options.justification || justification, options.maxWidth, true)
                REGISTRY.TEXT[name].width = getMaxWidth(textObj)
                REGISTRY.TEXT[name].zIndex = getZLevel(name) || REGISTRY.TEXT[name].zIndex || 300
                REGISTRY.TEXT[name].modes = C.MODEDEFAULTS(textObj, options.modes)
                DB(`Modes for ${name}: ${D.JSL(REGISTRY.TEXT[name].modes)}`, "regText")
                REGISTRY.ID[textObj.id] = name
                if (hasShadow) {
                    const shadowObj = createObj("text", {
                        _pageid: D.PAGEID,
                        text: REGISTRY.TEXT[name].curText,
                        left: REGISTRY.TEXT[name].left,
                        top: REGISTRY.TEXT[name].top,
                        font_size: REGISTRY.TEXT[name].font_size,
                        color: "rgb(0,0,0)",
                        font_family: REGISTRY.TEXT[name].font_family,
                        layer: REGISTRY.TEXT[name].activeLayer,
                        controlledby: ""
                    })
                    REGISTRY.TEXT[name].shadowID = shadowObj.id
                }
                setTextData(textObj, _.pick(REGISTRY.TEXT[name], C.TEXTPROPS))
                setText(textObj, REGISTRY.TEXT[name].curText)
                setLayer(name, REGISTRY.TEXT[name].activeLayer, true)
                updateTextShadow(name, true)       
                D.Alert(`Host obj for '${D.JS(name)}' registered: ${D.JS(REGISTRY.TEXT[name])}`, "regText")
                // initMedia()
                return getTextData(name)
            }
            return VAL({string: funcName}) && THROW(`Invalid text reference '${D.JSL(textRef)}'`, `${D.JSL(funcName)} > regText`)
        },
        makeText = (hostName, activeLayer, hasShadow, justification, options = {}, funcName = false) => {
            DB(`makeText(${D.JSL(hostName)}, ${D.JSL(activeLayer)}, ${D.JSL(hasShadow)}, ${D.JSL(options)}`, "makeText")
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
            regText(textObj, hostName, actLayer, hasShadow, justification, options, funcName)
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
            REGISTRY.TEXT[masterKey].linkedText = REGISTRY.TEXT[masterKey].linkedText || {}
            for (const edgeDir of _.keys(slaveData)) {
                REGISTRY.TEXT[masterKey].linkedText[edgeDir] = REGISTRY.TEXT[masterKey].linkedText[edgeDir] || []
                for (const slaveRef of slaveData[edgeDir]) {
                    const slaveKey = getTextKey(slaveRef)
                    REGISTRY.TEXT[masterKey].linkedText[edgeDir].push(slaveKey)
                    REGISTRY.TEXT[slaveKey].horizPad = horizPad
                    REGISTRY.TEXT[slaveKey].vertPad = vertPad
                }
            }
            updateSlaveText(masterKey)
        },
        updateSlaveText = (masterRef) => {
            const masterObj = getTextObj(masterRef),
                masterKey = getTextKey(masterObj),
                edgeDirs = REGISTRY.TEXT[masterKey].linkedText || {}
            for (const edgeDir of _.keys(edgeDirs))
                for (const slaveKey of edgeDirs[edgeDir]) {
                    const slaveData = getTextData(slaveKey)
                    if (slaveData) {
                        switch (edgeDir) {
                            case "left":
                                REGISTRY.TEXT[slaveKey].pushleft = masterObj.get("text").match(/\S/gui) ? -getMaxWidth(masterObj) - slaveData.horizPad : 0
                                break
                            case "right":
                                REGISTRY.TEXT[slaveKey].pushleft = masterObj.get("text").match(/\S/gui) ? getMaxWidth(masterObj) + slaveData.horizPad : 0
                                break
                            case "top":
                                REGISTRY.TEXT[slaveKey].pushtop = masterObj.get("text").match(/\S/gui) ? -getTextHeight(masterObj) - slaveData.vertPad : 0
                                break
                            case "bottom":
                                REGISTRY.TEXT[slaveKey].pushtop = masterObj.get("text").match(/\S/gui) ? getTextHeight(masterObj) + slaveData.vertPad : 0
                            // no default
                        }
                        setText(slaveKey, slaveData.curText)
                    }
                }
        },
        setText = (textRef, text, isToggling, isForcing = false) => {
            // D.Alert(`setText(${D.JS(textRef, true)}, ${D.JS(text)}, ${D.JS(isToggling)}, ${D.JS(isForcing)})`)
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
                        REGISTRY.TEXT[textData.name].activeText = textParams.text
                    // D.Alert(`Setting CurText on ${D.JS(textData.name)}`)
                    REGISTRY.TEXT[textData.name].curText = textParams.text
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
                            REGISTRY.TEXT[textKey][k] = v
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
                DB(`ToggleText(${D.JSL(textRef)}, ${D.JSL(isActive)}, ${D.JSL(isForcing)})<br>... Active Check: ${D.JSL(activeCheck)}, textData.isActive: ${D.JSL(textData.isActive)}`, "toggleText")
                if (!isForcing && textData.isActive === activeCheck)
                    return null                
                const textKey = textData.name,
                    textObj = getTextObj(textKey)             
                if (activeCheck === false) {
                    DB("Turning Off.", "toggleText")
                    // TURN OFF: Set layer to walls, toggle off associated drag pads, update activeState value
                    REGISTRY.TEXT[textKey].activeText = textData.curText
                    REGISTRY.TEXT[textKey].isActive = false
                    // setLayer(textObj, "walls", isForcing)
                    textObj.set("layer", "walls")
                    if (textData.shadowID)
                        (getObj("text", textData.shadowID) || {set: () => false}).set("layer", "walls")
                    return false                   
                } else if (activeCheck === true) {
                    DB("Turning On.", "toggleText")
                    // TURN ON: Set layer to active layer, toggle on associated drag pads, restore activeState value if it's different
                    REGISTRY.TEXT[textKey].isActive = true
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
                if (REGISTRY.ID[textData.id])
                    delete REGISTRY.ID[textData.id]
                if (REGISTRY.TEXT[textData.name])
                    delete REGISTRY.TEXT[textData.name]
                return true
            }
            return THROW(`Invalid text reference ${D.JSL(textRef)}`, "removeText")
        },
        removeTexts = (textString, isUnregOnly) => {
            const textNames = _.filter(_.keys(REGISTRY.TEXT), v => v.includes(textString))
            for (const textName of textNames)
                removeText(textName, isUnregOnly)
        },        
        cleanTextRegistry = () => {
            for (const textName of _.keys(REGISTRY.TEXT))
                if (!getTextObj(textName))
                    removeText(textName)
        },
        resetTextRegistry = () => {
            STATEREF.textregistry = {}
            STATEREF.idregistry = {}
        },
        fixTextObjs = () => {
            const textKeys = _.keys(REGISTRY.TEXT),
                textPairs = _.zip(textKeys.map(x => REGISTRY.TEXT[x]), textKeys.map(x => getObj("text", REGISTRY.TEXT[x].id))),
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

    // #region SOUND OBJECT GETTERS: Track Object, Playlist Object, Data Retrieval
        getScore = (mode) => {
            // D.Poke(`Score Ref: ${Object.keys(C.SOUNDSCORES).find(x => C.SOUNDSCORES[x].includes(mode))}`)
            const scoreRef = Object.keys(C.SOUNDSCORES).find(x => C.SOUNDSCORES[x].includes(mode)),
                volume = C.SOUNDVOLUME[scoreRef] || C.SOUNDVOLUME.defaults.score
            return {[scoreRef]: volume}
        },
        getWeatherSounds = (weatherCode) => {
            // 0: x: "Clear", b: "Blizzard", c: "Overcast", f: "Foggy", p: "Downpour", s: "Snowing", t: "Thunderstorm", w: "Drizzle"
            // 4: {x: ["Still", "Still"], s: ["Soft Breeze", "Cutting Breeze"], b: ["Breezy", "Biting Wind"], w: ["Blustery", "High Winds"], g: ["High Winds", "Driving Winds"], h: ["Howling Winds", "Howling Winds"], v: ["Roaring Winds", "Roaring Winds"]}
            
            const weatherSounds = {}
            if (["p", "t"].includes(weatherCode.charAt(0)))
                weatherSounds.Rain = C.SOUNDVOLUME.Rain || C.SOUNDVOLUME.defaults.weather || C.SOUNDVOLUME.defaults.base
            const windPrefix = `Wind${TimeTracker.TempC <= 0 ? "Winter" : ""}`
            switch (weatherCode.charAt(4)) {            
            // const [weatherSounds, windPrefix, windChar] = [{Rain: C.SOUNDVOLUME.Rain}, "Wind", "s"]
            // const [weatherSounds, windPrefix, windChar] = [{}, "Wind", "s"]
            // const [weatherSounds, windPrefix, windChar] = [{}, "Winter", "s"]
            // 
            // const [weatherSounds, windPrefix, windChar] = [{Rain: C.SOUNDVOLUME.Rain}, "Wind", "b"]
            // const [weatherSounds, windPrefix, windChar] = [{}, "Wind", "b"]
            // const [weatherSounds, windPrefix, windChar] = [{}, "WindWinter", "b"]
            // 
            // const [weatherSounds, windPrefix, windChar] = [{Rain: C.SOUNDVOLUME.Rain}, "Wind", "w"]
            // const [weatherSounds, windPrefix, windChar] = [{}, "Wind", "w"]
            // const [weatherSounds, windPrefix, windChar] = [{}, "WindWinter", "w"]
            // 
            // const [weatherSounds, windPrefix, windChar] = [{Rain: C.SOUNDVOLUME.Rain}, "Wind", "g"]
            // const [weatherSounds, windPrefix, windChar] = [{}, "Wind", "g"]
            // const [weatherSounds, windPrefix, windChar] = [{}, "WindWinter", "g"]
            // 
            // const [weatherSounds, windPrefix, windChar] = [{Rain: C.SOUNDVOLUME.Rain}, "Wind", "h"]
            // const [weatherSounds, windPrefix, windChar] = [{}, "Wind", "h"]
            // const [weatherSounds, windPrefix, windChar] = [{}, "WindWinter", "h"]
            // 
            // const [weatherSounds, windPrefix, windChar] = [{Rain: C.SOUNDVOLUME.Rain}, "Wind", "v"]
            // const [weatherSounds, windPrefix, windChar] = [{}, "Wind", "v"]
            // const [weatherSounds, windPrefix, windChar] = [{}, "WindWinter", "v"]
            // 
            // switch (windChar) {
                case "b":
                    weatherSounds[`${windPrefix}Low`] = (C.SOUNDVOLUME[`${windPrefix}Low`] || C.SOUNDVOLUME.defaults.weather || C.SOUNDVOLUME.defaults.base).map(x => x * 0.75)
                    break
                case "w":
                    weatherSounds[`${windPrefix}Low`] = C.SOUNDVOLUME[`${windPrefix}Low`] || C.SOUNDVOLUME.defaults.weather || C.SOUNDVOLUME.defaults.base
                    break
                case "g":
                    weatherSounds[`${windPrefix}Med`] = (C.SOUNDVOLUME[`${windPrefix}Med`] || C.SOUNDVOLUME.defaults.weather || C.SOUNDVOLUME.defaults.base).map(x => x * 0.75)
                    break
                case "h":
                    weatherSounds[`${windPrefix}Med`] = C.SOUNDVOLUME[`${windPrefix}Med`] || C.SOUNDVOLUME.defaults.weather || C.SOUNDVOLUME.defaults.base
                    break
                case "v":
                    weatherSounds[`${windPrefix}Max`] = C.SOUNDVOLUME[`${windPrefix}Max`] || C.SOUNDVOLUME.defaults.weather || C.SOUNDVOLUME.defaults.base
                    break
                // no default
            }
            // D.Alert(D.JS(weatherSounds), "Weather Sounds")
            return weatherSounds
        },
        getLocationSounds = () => {
            const locRefs = {
                District: Session.District,
                Site: Session.Site
            }
            let locSound = {}
            for (const [loc, locName] of Object.entries(locRefs)) {
                if (!locName) continue
                const [thisSound] = C.LOCATIONS[locName].soundScape
                if (thisSound === "(TOTALSILENCE)")
                    return {TOTALSILENCE: [0]}
                if (thisSound)
                    if (loc === "District" || thisSound !== "(NONE)" || !Session.IsOutside)
                        locSound = {[thisSound]: C.SOUNDVOLUME[thisSound] || C.SOUNDVOLUME.defaults.location || C.SOUNDVOLUME.defaults.base}                
                // D.Alert(D.JS(locSound), `${locRef} Sound`)
            }
            return locSound
        },
    // #endregion

    // #region SOUND OBJECT SETTERS: Registering & Manipulating Music & Sound Effects 
        initSoundModes = () => {            
            const [listsRef, tracksRef] = [
                state.Roll20AM.playLists,
                state.Roll20AM.trackDetails
            ]
            for (const listName of Object.keys(listsRef))
                Roll20AM.SetSoundMode(listName)
            for (const trackName of _.intersection(_.keys(C.SOUNDMODES), _.keys(tracksRef)))
                Roll20AM.SetSoundMode(trackName)
        },
        regSound = (soundName, volume, soundType, soundTags = []) => {
            REGISTRY.SOUND[soundName] = {
                name: soundName,
                type: soundType,
                tags: soundTags,
                volume,
                isActive: false
            }
            Roll20AM.ChangeVolume(soundName, volume)
            switch (soundType) {
                case "score": {
                    Roll20AM.SetSoundMode(soundName, "randomloop")
                    REGISTRY.SOUND[soundName].isLooping = true
                    break
                }
                case "weather":
                case "location": {
                    Roll20AM.SetSoundMode(soundName, "loop")
                    REGISTRY.SOUND[soundName].isLooping = true
                    break
                }
                case "effect": {
                    Roll20AM.SetSoundMode(soundName, "randomsingle")
                    REGISTRY.SOUND[soundName].isLooping = false
                    break
                }
                // no default
            }
            Roll20AM.SetSoundMode(soundName)
        },
        updateSounds = (isDoubleChecking = true) => {

            return 


            if (STATEREF.isRunningSilent && STATEREF.isRunningSilent !== "TOTALSILENCE")
                return
            const soundsToPlay = {}
            switch (Session.Mode) {
                case "Active":
                    Object.assign(soundsToPlay, _.omit(D.KeyMapObj(getWeatherSounds(TimeTracker.WeatherCode), null, (v, k) => {
                        let volume = v[0]
                        if (!Session.IsOutside)
                            if (VAL({number: v[1]}))
                                [,volume] = v
                            else if (VAL({number: C.SOUNDVOLUME.indoorMult[k]}))
                                volume *= C.SOUNDVOLUME.indoorMult[k]
                            else if (VAL({number: C.SOUNDVOLUME.indoorMult.defaults.weather}))
                                volume *= C.SOUNDVOLUME.indoorMult.defaults.weather
                            else
                                volume *= C.SOUNDVOLUME.indoorMult.defaults.base
                        else if (getWeatherSounds(TimeTracker.WeatherCode).Rain)
                            if (VAL({number: C.SOUNDVOLUME.rainMult[k]}))
                                volume *= C.SOUNDVOLUME.rainMult[k]
                            else if (VAL({number: C.SOUNDVOLUME.rainMult.defaults.weather}))
                                volume *= C.SOUNDVOLUME.rainMult.defaults.weather
                            else
                                volume *= C.SOUNDVOLUME.rainMult.defaults.base
                        return volume
                    }), "(NONE)"))
                    // falls through
                case "Downtime":
                case "Spotlight":
                case "Daylighter":
                    Object.assign(soundsToPlay, _.omit(D.KeyMapObj(getLocationSounds(), null, (v, k) => {
                        let volume = v[0]
                        if (!Session.IsOutside)
                            volume = v[1] || v[0] * (C.SOUNDVOLUME.indoorMult[k] || C.SOUNDVOLUME.indoorMult.defaults.location || C.SOUNDVOLUME.indoorMult.defaults.base)
                        else if (Session.Mode === "Active" && getWeatherSounds(TimeTracker.WeatherCode).Rain)
                            volume *= C.SOUNDVOLUME.rainMult[k] || C.SOUNDVOLUME.rainMult.defaults.location || C.SOUNDVOLUME.rainMult.defaults.base
                        return volume
                    }), "(NONE)"))
                    // falls through
                default:
                    Object.assign(soundsToPlay, _.omit(D.KeyMapObj(getScore(Session.Mode), null, (v, k) => {
                        let volume = v[0]
                        if (!Session.IsOutside)
                            volume = v[1] || v[0] * (C.SOUNDVOLUME.indoorMult[k] || C.SOUNDVOLUME.indoorMult.defaults.score || C.SOUNDVOLUME.indoorMult.defaults.base)
                        else if (Session.Mode === "Active" && getWeatherSounds(TimeTracker.WeatherCode).Rain)
                            volume *= C.SOUNDVOLUME.rainMult[k] || C.SOUNDVOLUME.rainMult.defaults.score || C.SOUNDVOLUME.rainMult.defaults.base
                        return volume
                    }), "(NONE)"))
                    break
            }

            if (_.keys(soundsToPlay).includes("TOTALSILENCE")) {
                STATEREF.isRunningSilent = "TOTALSILENCE"
                Roll20AM.StopSound("all")
            } else if (STATEREF.isRunningSilent === "TOTALSILENCE") {
                STATEREF.isRunningSilent = false
                updateSounds()
            } else {
                const thunderVolumeData = {}
                for (const thunderSoundRef of ["Thunder", ..._.intersection(Roll20AM.GetPlaylistTrackNames("Thunder"), Object.keys(C.SOUNDVOLUME))]) {
                    let thunderVol = C.SOUNDVOLUME[thunderSoundRef] || thunderSoundRef === "Thunder" && (C.SOUNDVOLUME.defaults.effect || C.SOUNDVOLUME.defaults.base)
                    if (thunderVol) {
                        if (Session.IsOutside)
                            thunderVol = VAL({number: thunderVol[0]}) ? thunderVol[0] : thunderVol
                        else
                            thunderVol = VAL({number: thunderVol[1]}) ? thunderVol[1] : thunderVol[0] * (C.SOUNDVOLUME.indoorMult[thunderSoundRef] || C.SOUNDVOLUME.indoorMult.defaults.effect || C.SOUNDVOLUME.indoorMult.defaults.base)
                        if (thunderSoundRef === "Thunder")
                            Roll20AM.ChangeVolume(thunderSoundRef, thunderVol)
                        else
                            thunderVolumeData[thunderSoundRef] = thunderVol
                    }
                }
                for (const thunderSoundRef of Object.keys(thunderVolumeData))
                    Roll20AM.ChangeVolume(thunderSoundRef, thunderVolumeData[thunderSoundRef])

                const debugLines = [Session.IsOutside ? "Outdoors" : "Indoors"],
                    initialLoop = _.clone(Media.LoopingSounds)
                for (const offSound of Media.LoopingSounds.filter(x => !_.keys(soundsToPlay).includes(x))) {
                    debugLines.push(`... turning OFF ${D.JS(offSound)}`)
                    stopSound(offSound)
                }
                for (const [onSound, volume] of Object.entries(soundsToPlay)) {
                    debugLines.push(`... turning ON ${D.JS(onSound)} at ${D.JS(volume)}`)
                    if (volume === 0)
                        stopSound(onSound)
                    else
                        startSound(onSound, volume)
                }
                debugLines.push(`${D.JS(initialLoop)} --> ${D.JS(Media.LoopingSounds)}`)
                // D.Alert(debugLines.join("<br>"), `Update Sounds Test${isDoubleChecking ? " (1)" : " (2)"}`, 1000)
                if (isDoubleChecking)
                    setTimeout(() => updateSounds(false), 5000)
            }
        },
        startSound = (soundRef, volume, fadeIn = null, isOverlapping = false) => {
            if (VAL({number: volume}))
                Roll20AM.ChangeVolume(soundRef, volume)
            if (!Roll20AM.IsPlaying(soundRef) || isOverlapping)
                Roll20AM.PlaySound(soundRef, undefined, fadeIn)
        },
        stopSound = (soundRef, fadeOut = null) => {
            Roll20AM.StopSound(soundRef, fadeOut)
        }
    // #endregion

    return {
        CheckInstall: checkInstall,
        OnChatCall: onChatCall,
        OnGraphicAdd: onGraphicAdd,

        // REGISTRIES
        IMAGES: REGISTRY.IMG, TEXT: REGISTRY.TEXT, AREAS: REGISTRY.AREA,

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
        GetLineHeight: getLineHeight, GetTextWidth: getTextWidth,
        Buffer: buffer,

        // CONSTRUCTORS, REGISTERS & DESTROYERS
        MakeImg: makeImg, MakeText: makeText,
        RegImg: regImg, RegToken: regToken, RegText: regText,
        RemoveImg: removeImg, RemoveAllImgs: removeImgs, RemoveText: removeText, RemoveAllText: removeTexts,
        AddImgSrc: addImgSrc,

        // SETTERS
        SetImg: setImg, SetText: setText,        
        ToggleImg: toggleImg, ToggleText: toggleText, ToggleToken: toggleTokenSrc,
        SetImgData: setImgData, SetTextData: setTextData,
        SetImgTemp: setImgTemp, // SetTextTemp: setTextTemp,
        Spread: spreadImgs,

        // AREA FUNCTIONS
        GetBounds: getBounds, GetContents: getContainedImgObjs,
        GetContainedChars: (locRef, options) => getContainedImgObjs(locRef, Object.assign(options, {isCharsOnly: true})),
        SetArea: setImgArea,
        
        // ANIMATION FUNCTIONS
        InitAnims: initAnimations,
        Flash: flashAnimation,
        Pulse: activateAnimation,
        Kill: deactivateAnimation,

        // SOUND FUNCTIONS
        ResetSoundModes: initSoundModes,
        UpdateSoundscape: updateSounds,
        get LoopingSounds() { return STATEREF.loopingSounds },
        set LoopingSounds(soundRef) {
            if (soundRef)
                STATEREF.loopingSounds = _.uniq([...STATEREF.loopingSounds, soundRef])
            // D.Alert(`Adding ${D.JS(soundRef)} to Looping Sounds: ${D.JS(STATEREF.loopingSounds)}`, `Media.LoopingSounds = ${D.JSL(soundRef)}`, 1000)
        },
        
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