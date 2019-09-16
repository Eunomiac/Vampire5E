void MarkStart("Media")
const Media = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Media",
        CHATCOMMAND = ["!area", "!img", "!text", "!anim"],
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
        }
    // #endregion

    // #region LOCAL INITIALIZATION
    const initialize = () => {
        STATEREF.imageregistry = STATEREF.imageregistry || {}
        STATEREF.textregistry = STATEREF.textregistry || {}
        STATEREF.idregistry = STATEREF.idregistry || {}
        STATEREF.areas = STATEREF.areas || {}
        STATEREF.tokenregistry = STATEREF.tokenregistry || {}
        STATEREF.imgResizeDims = STATEREF.imgResizeDims || { height: 100, width: 100 }
        STATEREF.activeAnimations = STATEREF.activeAnimations || []
        STATEREF.activeTimeouts = STATEREF.activeTimeouts || []
        STATEREF.curLocation = STATEREF.curLocation || "DistrictCenter:blank SiteCenter:blank"

        delete STATEREF.tokenregistry["85239212/An9D7-g4OmLdjhKm-NbKnA/1561848759"]
        // Initialize IMAGEDICT Fuzzy Dictionary
        STATEREF.IMAGEDICT = Fuzzy.Fix()
        for (const imgKey of _.keys(STATEREF.imageregistry))
            STATEREF.IMAGEDICT.add(imgKey)

        // Initialize TEXTDICT Fuzzy Dictionary
        STATEREF.TEXTDICT = Fuzzy.Fix()
        for (const textKey of _.keys(STATEREF.textregistry))
            STATEREF.TEXTDICT.add(textKey)
        
        // Initialize AREADICT Fuzzy Dictionary
        STATEREF.AREADICT = Fuzzy.Fix()
        for (const areaKey of _.keys(STATEREF.areas))
            STATEREF.AREADICT.add(areaKey)

        STATEREF.imageregistry.mapButtonDomain_1.cycleSrcs = ["anarch", "camarilla", "nodomain"]
    }
    // #endregion

    // #region EVENT HANDLERS: (HANDLEINPUT)
    const handleInput = (msg, who, call, args) => { 	// eslint-disable-line no-unused-vars
            let textParams
            switch (call.shift().toLowerCase()) {
                case "!area": {
                    switch (call.shift().toLowerCase()) {
                        case "reg": case "register": {
                            if (!args[0])
                                D.Alert("Syntax: !area reg &lt;areaName&gt;", "!area reg")                                
                            else if (VAL({graphicObj: getImageObj(msg)}, "!area reg"))
                                regArea(getImageObj(msg), args.shift())                                        
                            break
                        }
                        case "get": {
                            switch (args.shift().toLowerCase()) {
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
                    switch (call.shift().toLowerCase()) {
                        case "reg": case "register": {
                            const imgObj = getImageObj(msg)
                            if (args[0] && VAL({graphicObj: imgObj}, "!img reg"))                                
                                switch (args[0]) {
                                    case "token": {
                                        args.shift()
                                        const tokenName = args.shift()
                                        if (VAL({string: tokenName}, "!img reg token"))
                                            regRandomizerToken(imgObj, tokenName)
                                        break
                                    }
                                    default: {
                                        const [hostName, srcName, objLayer, isStartActive] = [args.shift(), args.shift(), args.shift(), args.shift()]
                                        if (hostName && srcName && objLayer && isStartActive)
                                            regImage(imgObj, hostName, srcName, objLayer, !isStartActive || isStartActive !== "false", D.ParseToObj(args.join(" ")))
                                        else
                                            D.Alert("Syntax: !img reg &lt;hostName&gt; &lt;currentSourceName&gt; &lt;activeLayer&gt; &lt;isStartingActive&gt; [params (\"key:value, key:value\")]", "MEDIA: !img reg")    
                                        break
                                    }
                                }
                            else
                                D.Alert("Syntax: !img reg &lt;hostName&gt; &lt;currentSourceName&gt; &lt;activeLayer(objects/map/walls/gmlayer)&gt; &lt;isStartingActive&gt; [params (\"key:value, key:value\")]<br>!img reg token &lt;tokenName&rt;", "MEDIA: !img reg")
                            break
                        }
                        case "set": {
                            switch (args.shift().toLowerCase()) {
                                case "source": case "src": {
                                    let [hostName, srcName] = ["", ""]
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
                                }
                                case "area": {
                                    const imgObj = getImageObj(msg)
                                    if (!imgObj)
                                        D.Alert("Select an image first!", "MEDIA: !img set area")
                                    else
                                        setImageArea(imgObj, args.shift(), args.shift().toLowerCase === "resize")
                                    break
                                }
                                case "params": {
                                    const imgObj = getImageObj(args[0]) || getImageObj(msg),
                                        params = D.ParseParams(args)
                                    if (VAL({graphicObj: imgObj}, "!img set params"))
                                        setImgParams(imgObj, params)
                                    break
                                }
                                case "loc": case "location": {                                    
                                    DB(`SET LOCATION COMMAND RECEIVED.  MSG: ${D.JS(msg)}`, "!img set loc")         
                                    setLocation(args.join(" "))
                                    break
                                }
                            // no default
                            }
                            break
                        }
                        case "clean": case "cleanreg": case "cleanregistry": {
                            cleanRegistry()
                            break
                        }
                        case "add": {
                            let hostName, srcName
                            switch (args.shift().toLowerCase()) {
                                case "cyclesrc": case "cycle": {
                                    [hostName, srcName] = args
                                    if (isRegImg(hostName)) {
                                        IMAGEREGISTRY[hostName].cycleSrcs = IMAGEREGISTRY[hostName].cycleSrcs || []
                                        IMAGEREGISTRY[hostName].cycleSrcs.push(srcName)
                                    }
                                }
                                // falls through
                                case "src": case "source": {
                                    hostName = hostName || args[0]
                                    srcName = srcName || args[1]
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
                                }
                                case "tokensrc": case "tokensource": {
                                    const tokenName = args.shift()
                                    if (isRegImg(tokenName))
                                        addTokenSrc(getImageObj(msg), tokenName)
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
                            if ((args[0] || "").toLowerCase() === "all") {
                                args.shift()
                                for (const hostName of _.keys(IMAGEREGISTRY))
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
                        }
                        case "unreg": case "unregister": {
                        //D.Alert(`ARGS: ${D.JS(args)}<br><br>getImageObj('${D.JS(args.join(" "))}'):<br><br>${D.JS(getImageObj(args.join(" ")))}`)
                            if ((args[0] || "").toLowerCase() === "all") {
                                args.shift()
                                for (const hostName of _.keys(IMAGEREGISTRY))
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
                        }
                        case "reset": {
                            switch (args.shift().toLowerCase()) {
                                case "pos": case "position": {
                                    const imgObj = isRegImg(msg) && getImageObj(msg)
                                    if (VAL({graphicObj: imgObj}, "!img set pos")) {
                                        const hostName = getImageKey(imgObj)
                                        IMAGEREGISTRY[hostName].top = parseInt(imgObj.get("top"))
                                        IMAGEREGISTRY[hostName].left = parseInt(imgObj.get("left"))
                                        IMAGEREGISTRY[hostName].height = parseInt(imgObj.get("height"))
                                        IMAGEREGISTRY[hostName].width = parseInt(imgObj.get("width"))
                                        D.Alert(`Position Set for Image ${hostName}<br><br><pre>${D.JS(IMAGEREGISTRY[hostName])}</pre>`)
                                    }
                                    break
                                }
                                // no default
                            }
                            break
                        }
                        case "toggle": {
                            DB(`TOGGLE COMMAND RECEIVED.  MESSAGE IS AS FOLLOWS:<br><br>${D.JS(msg)}`, "!img toggle")
                            switch (args.shift().toLowerCase()) {
                                case "on": {
                                    DB(`Toggling ON: ${D.JS(args)}`, "!img toggle")
                                    for (const param of args)
                                        toggleImage(param, true)
                                    break
                                }
                                case "off": {
                                    DB(`Toggling OFF: ${D.JS(args)}`, "!img toggle")
                                    for (const param of args)
                                        toggleImage(param, false)
                                    break
                                }
                                case "log": {
                                    imgRecord = !imgRecord
                                    if (imgRecord)
                                        D.Alert("Logging image data as they are added to the sandbox.", "MEDIA, !img toggle log")
                                    else
                                        D.Alert("Image logging disabled.", "MEDIA, !img toggle log")
                                    break
                                }
                                case "resize": {
                                    const params = D.ParseParams(args)
                                    if (!imgResize || params.length) {
                                        imgResize = true
                                        for (const param of params)
                                            STATEREF.imgResizeDims[param[0]] = param[1]
                                        D.Alert(`New images automatically resized to height: ${STATEREF.imgResizeDims.height}, width: ${STATEREF.imgResizeDims.width}.`, "!img toggle resize")
                                    } else {
                                        imgResize = false
                                        D.Alert("Image resizing disabled.", "MEDIA, !img toggle resize")
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
                            if (D.GetSelected(msg))
                                alignImages(msg, ...args)
                            break
                        }
                        case "get": {
                            switch (args.shift().toLowerCase()) {
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
                                case "active": {
                                    const startActiveNames = {
                                            objects: [..._.values(IMAGEREGISTRY), ..._.values(TEXTREGISTRY)].filter(x => x.activeLayer === "objects" && x.startActive).map(x => `${x.srcs ? "I" : "T"}: ${x.name}`),
                                            map: [..._.values(IMAGEREGISTRY), ..._.values(TEXTREGISTRY)].filter(x => x.activeLayer === "map" && x.startActive).map(x => `${x.srcs ? "I" : "T"}: ${x.name}`),
                                            other: [..._.values(IMAGEREGISTRY), ..._.values(TEXTREGISTRY)].filter(x => x.activeLayer !== "objects" && x.activeLayer !== "map" && x.startActive).map(x => `${x.srcs ? "I" : "T"}: ${x.name}`)
                                        },
                                        startInactiveNames = {
                                            objects: [..._.values(IMAGEREGISTRY), ..._.values(TEXTREGISTRY)].filter(x => x.activeLayer === "objects" && !x.startActive).map(x => `${x.srcs ? "I" : "T"}: ${x.name}`),
                                            map: [..._.values(IMAGEREGISTRY), ..._.values(TEXTREGISTRY)].filter(x => x.activeLayer === "map" && !x.startActive).map(x => `${x.srcs ? "I" : "T"}: ${x.name}`),
                                            other: [..._.values(IMAGEREGISTRY), ..._.values(TEXTREGISTRY)].filter(x => x.activeLayer !== "objects" && x.activeLayer !== "map" && !x.startActive).map(x => `${x.srcs ? "I" : "T"}: ${x.name}`)
                                        }
                                    D.Alert([
                                        "<h2>ACTIVE OBJECTS</h2>",
                                        ...startActiveNames.objects,
                                        "<h2>ACTIVE MAP</h2>",
                                        ...startActiveNames.map,
                                        "<h2>ACTIVE OTHER</h2>",
                                        ...startActiveNames.other,
                                        "<h2>INACTIVE OBJECTS</h2>",
                                        ...startInactiveNames.objects,
                                        "<h2>INACTIVE MAP</h2>",
                                        ...startInactiveNames.map,
                                        "<h2>INACTIVE OTHER</h2>",
                                        ...startInactiveNames.other
                                    ].join("<br>"))
                                    break
                                }
                                case "data": {
                                    const imgData = getImageData(msg) || getImageData(args.shift())
                                    if (VAL({list: imgData}, "!img get data"))
                                        D.Alert(args[0] && imgData[args[0]] || imgData, "MEDIA, !img get data")
                                    break
                                }
                                case "names": {
                                    D.Alert(`<b>IMAGE NAMES:</b><br><br>${D.JS(_.keys(IMAGEREGISTRY))}`)
                                    break
                                }
                            // no default
                            }
                            break
                        }
                        case "fix": {
                            switch (args.shift().toLowerCase()) {
                                case "layers": {
                                    initMedia()
                                    break
                                }
                                case "backgrounds": {
                                    for (const imgObj of getImageObjs(BGIMAGES.keys))
                                        setImgData(imgObj, {
                                            top: BGIMAGES.top,
                                            left: BGIMAGES.left,
                                            height: BGIMAGES.height,
                                            width: BGIMAGES.width
                                        }, true)
                                    for(const imgObj of getImageObjs(MAPIMAGES.keys))                                    
                                        setImgData(imgObj, {
                                            top: MAPIMAGES.top,
                                            left: MAPIMAGES.left,
                                            height: MAPIMAGES.height,
                                            width: MAPIMAGES.width
                                        }, true)
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
                case "!text": {
                    switch (call.shift().toLowerCase()) {                                                
                        case "get":
                            switch (args.shift().toLowerCase()) {
                                case "data": {
                                    const textObj = VAL({selection: msg}) ? getTextObj(msg) : getTextObj(args.shift())
                                    if (textObj)
                                        D.Alert(getTextData(textObj), "!text get data")
                                    else
                                        D.Alert("Syntax: !text get data [<name>] (or select a text object object)", "!text get data")
                                    break
                                }
                                case "width": {
                                    const textObj = getTextObj(msg),
                                        textString = msg.content.match(/@@(.*?)@@/ui)[1]
                                    D.Alert(`The width of @@${textString}@@ is ${getTextWidth(textObj, textString, false)}`)
                                    break
                                }
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
                                case "active": {
                                    const startActiveNames = {
                                            objects: _.values(TEXTREGISTRY).filter(x => x.activeLayer === "objects" && x.startActive).map(x => x.name),
                                            map: _.values(TEXTREGISTRY).filter(x => x.activeLayer === "map" && x.startActive).map(x => x.name),
                                            other: _.values(TEXTREGISTRY).filter(x => x.activeLayer !== "objects" && x.activeLayer !== "map" && x.startActive).map(x => x.name)
                                        },
                                        startInactiveNames = {
                                            objects: _.values(TEXTREGISTRY).filter(x => x.activeLayer === "objects" && !x.startActive).map(x => x.name),
                                            map: _.values(TEXTREGISTRY).filter(x => x.activeLayer === "map" && !x.startActive).map(x => x.name),
                                            other: _.values(TEXTREGISTRY).filter(x => x.activeLayer !== "objects" && x.activeLayer !== "map" && !x.startActive).map(x => x.name)
                                        }
                                    D.Alert([
                                        "<h2>ACTIVE OBJECTS</h2>",
                                        ...startActiveNames.objects,
                                        "<h2>ACTIVE MAP</h2>",
                                        ...startActiveNames.map,
                                        "<h2>ACTIVE OTHER</h2>",
                                        ...startActiveNames.other,
                                        "<h2>INACTIVE OBJECTS</h2>",
                                        ...startInactiveNames.objects,
                                        "<h2>INACTIVE MAP</h2>",
                                        ...startInactiveNames.map,
                                        "<h2>INACTIVE OTHER</h2>",
                                        ...startInactiveNames.other
                                    ].join("<br>"))
                                    break
                                }
                                // no default
                            }
                            break
                        case "set":
                            switch ((args[0] || "").toLowerCase()) {
                                case "updateslave": {
                                    updateSlaveText(args[1])
                                    break
                                }
                                case "slave": {
                                    args.shift()
                                    try {
                                        const textObj = getTextObj(msg),
                                            [hostName, edgeDir] = [args.shift(), args.shift()],
                                            horizPad = parseInt(args[0] ? args.shift() : 0),
                                            vertPad = parseInt(args[0] ? args.shift() : 0)
                                        linkText(hostName, {[edgeDir]: [getTextKey(textObj)]}, horizPad, vertPad)
                                    } catch (errObj) {
                                        D.Alert(`Syntax: !text set slave (hostName) (edgeDirection) (horizPad) (vertPad)<br>${JSON.stringify(errObj)}`, "!text set slave")
                                    }
                                    break
                                }
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
                                case "params": {
                                    args.shift()
                                    const textObj = getTextObj(args[0]) || getTextObj(msg),
                                        params = D.ParseParams(args)
                                    if (VAL({textObj: textObj}, "!text set params"))
                                        setText(textObj, params)
                                    break   
                                }
                                default: {
                                    const textObj = getTextObj(args[0], true) || D.GetSelected(msg)[0]
                                    if (getTextObj(args[0], true))
                                        args.shift()
                                    if (VAL({textObj: textObj}, "!text set"))
                                        setText(textObj, {text: args[0] && args.join(" ") || " "})
                                    break
                                }
                            // no default                                    
                            }
                            break
                        case "clean": case "cleanreg": case "cleanregistry":
                            cleanTextRegistry()
                            break
                        case "reset": case "resetreg": case "resetregistry": {
                            switch((args[0] || "").toLowerCase()) {
                                case "pos": case "position": {
                                    args.shift()
                                    const textObj = getTextObj(msg)
                                    if (!textObj) {
                                        D.Alert("Select a text object first!", "MEDIA: !text set position")
                                    } else if (!IDREGISTRY[textObj.id]) {
                                        D.Alert("Text not registered.  To register selected text:<br><br><pre>!text reg &lt;hostName&gt; &lt;activeLayer(objects/map/walls/gmlayer)&gt; &lt;isStartingActive&gt; &lt;isMakingShadow&gt; [params (\"key:value, key:value\")]</pre>", "!text set position")
                                    } else {
                                        const hostName = getTextKey(msg)
                                        setText(textObj, {top: parseInt(textObj.get("top")), left: getBlankLeft(textObj), layer: textObj.get("layer")})
                                        D.Alert(`Position Set for Text ${hostName}<br><br><pre>${D.JS(TEXTREGISTRY[hostName])}</pre>`)
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
                            if ((args[0] || "").toLowerCase() === "all") {
                                args.shift()
                                for (const hostName of _.keys(TEXTREGISTRY))
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
                        }
                        case "rereg": case "reregister": {
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
                                    textData.maxWidth && !textParams.includes("maxWidth") ? `maxWidth:${textData.maxWidth}` : "",
                                    textParams.includes("zIndex") ? "" : `zIndex:${textData.zIndex || 300}`
                                ]).join(",") + textParams
                                removeText(msg, true, true)
                            }
                        }
                        /* falls through */
                        case "reg": case "register": {
                            if (!args[0]) {
                                D.Alert("Syntax: !text reg &lt;hostName&gt; &lt;activeLayer(objects/map/walls/gmlayer)&gt; &lt;isStartingActive&gt; &lt;isMakingShadow&gt; &lt;justification&gt; [params (\"key:value, key:value\")]", "MEDIA: !text reg")
                            } else {
                                const textObj = getTextObj(msg)
                                if (!textObj) {
                                    D.Alert("Select a text object first!", "MEDIA: !text reg")
                                } else {
                                    const [hostName, objLayer, isStartActive, isShadow, justification] = [args.shift(), args.shift(), args.shift(), args.shift(), args.shift()]
                                    textParams = textParams || args.join(" ")
                                    if (hostName && objLayer)
                                        regText(textObj, hostName, objLayer, !isStartActive || isStartActive !== "false", !isShadow || isShadow !== "false", justification || "center", D.ParseToObj(textParams))
                                    else
                                        D.Alert("Syntax: !text reg &lt;hostName&gt; &lt;activeLayer&gt; &lt;isStartingActive&gt; &lt;isMakingShadow&gt; &lt;justification&gt; [params (\"key:value, key:value\")]", "MEDIA: !text reg")
                                }
                            }
                            break
                        }
                        case "unreg": case "unregister": {
                            if ((args[0] || "").toLowerCase() === "all") {
                                args.shift()
                                for (const hostName of _.keys(TEXTREGISTRY))
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
                }
                case "!anim": {
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
                        case "kill": {
                            switch (args.shift().toLowerCase()) {
                                case "all": {
                                    killAllAnimations()
                                    D.Alert("All animations cleared.", "!anim kill all")
                                    break
                                }
                                case "time": case "timers": case "timeouts": {
                                    killAllTimeouts()
                                    D.Alert("All timeouts cleared.", "!anim kill timeouts")
                                    break
                                }
                                // no default
                            }
                        }
                        // no default
                    }
                    break
                }
                // no default
            }
        },
        handleAdd = obj => {
            if (imgRecord)
                LOG(obj.get("imgsrc"))
            if (imgResize)
                obj.set(STATEREF.imgResizeDims)
            if (isRandomizerToken(obj))
                setRandomizerToken(obj)
        }
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    let [imgRecord, imgResize] = [false, false]

    // #region CONFIGURATION
    const IMAGEREGISTRY = STATEREF.imageregistry,
        IDREGISTRY = STATEREF.idregistry,
        TEXTREGISTRY = STATEREF.textregistry,
        AREAREGISTRY = STATEREF.areas,
        TOKENREGISTRY = STATEREF.tokenregistry,
        BGIMAGES = {
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
                "WeatherFrost"            
            ]
        },
        MAPIMAGES = {
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
                    }
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
                HungerOverlays: {
                    HungerBotLeft_1: 100,
                    HungerTopLeft_1: 100,
                    HungerTopRight_1: 100,
                    HungerBotRight_1: 100
                },
                TombstoneShrouds: {
                    //ShroudTopLeft_1: 107
                },
                HorizonBGs: {
                    Horizon_1: 1
                },
                WeatherOverlays: {
                    WeatherFrost_1: 139,
                    WeatherFog_1: 125,
                    WeatherMain_1: 124, 
                    //WeatherLightning: 110,
                    WeatherGround_1: 110,
                    WeatherClouds_1: 105
                },
                Banners: {
                    downtimeBanner_1: 200
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
                    stakedAdvantagesHeader_1: 130,
                    weeklyResourcesHeader_1: 130
                },
                Map: {
                    TorontoMap_1: 1,
                    TorontoMapDomainOverlay_1: 5,
                    TorontoMapAutarkisOverlay_1: 5,
                    TorontoMapRackOverlay_1: 5,
                    TorontoMapRoadsOverlay_1: 6,
                    TorontoMapDistrictsOverlay_1: 7,
                    TorontoMapParksOverlay_1: 4
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
            dragpads: { // ALL DragPads should have Z-Level = 700.          
                SignalLights: { 
                    signalLight_Pad_1: 700,
                    signalLight_PartnerPad_1: 700,
                    signalLight_Pad_2: 700,
                    signalLight_PartnerPad_2: 700,
                    signalLight_Pad_3: 700,
                    signalLight_PartnerPad_3: 700,
                    signalLight_Pad_4: 700,
                    signalLight_PartnerPad_4: 700
                },
                DiceRoller: {
                    RerollTrigger: {
                        wpReroll_Pad_2: 700,
                        wpReroll_PartnerPad_2: 700
                    },
                    DiceList: {
                        selectDie_Pad_33: 700,
                        selectDie_PartnerPad_33: 700,
                        selectDie_Pad_34: 700,
                        selectDie_PartnerPad_34: 700,
                        selectDie_Pad_35: 700,
                        selectDie_PartnerPad_35: 700,
                        selectDie_Pad_36: 700,
                        selectDie_PartnerPad_36: 700,
                        selectDie_Pad_37: 700,
                        selectDie_PartnerPad_37: 700,
                        selectDie_Pad_38: 700,
                        selectDie_PartnerPad_38: 700,
                        selectDie_Pad_39: 700,
                        selectDie_PartnerPad_39: 700,
                        selectDie_Pad_40: 700,
                        selectDie_PartnerPad_40: 700,
                        selectDie_Pad_41: 700,
                        selectDie_PartnerPad_41: 700,
                        selectDie_Pad_42: 700,
                        selectDie_PartnerPad_42: 700,
                        selectDie_Pad_43: 700,
                        selectDie_PartnerPad_43: 700,
                        selectDie_Pad_44: 700,
                        selectDie_PartnerPad_44: 700,
                        selectDie_Pad_45: 700,
                        selectDie_PartnerPad_45: 700,
                        selectDie_Pad_46: 700,
                        selectDie_PartnerPad_46: 700,
                        selectDie_Pad_47: 700,
                        selectDie_PartnerPad_47: 700,
                        selectDie_Pad_48: 700,
                        selectDie_PartnerPad_48: 700,
                        selectDie_Pad_49: 700,
                        selectDie_PartnerPad_49: 700,
                        selectDie_Pad_50: 700,
                        selectDie_PartnerPad_50: 700,
                        selectDie_Pad_51: 700,
                        selectDie_PartnerPad_51: 700,
                        selectDie_Pad_52: 700,
                        selectDie_PartnerPad_52: 700,
                        selectDie_Pad_53: 700,
                        selectDie_PartnerPad_53: 700,
                        selectDie_Pad_54: 700,
                        selectDie_PartnerPad_54: 700,
                        selectDie_Pad_55: 700,
                        selectDie_PartnerPad_55: 700,
                        selectDie_Pad_56: 700,
                        selectDie_PartnerPad_56: 700,
                        selectDie_Pad_57: 700,
                        selectDie_PartnerPad_57: 700,
                        selectDie_Pad_58: 700,
                        selectDie_PartnerPad_58: 700,
                        selectDie_Pad_59: 700,
                        selectDie_PartnerPad_59: 700,
                        selectDie_Pad_60: 700,
                        selectDie_PartnerPad_60: 700,
                        selectDie_Pad_61: 700,
                        selectDie_PartnerPad_61: 700,
                        selectDie_Pad_62: 700,
                        selectDie_PartnerPad_62: 700
                    }
                },
                Complications: { 
                    flipComp_Pad_1: 700,
                    flipComp_PartnerPad_1: 700,
                    flipComp_Pad_2: 700,
                    flipComp_PartnerPad_2: 700,
                    flipComp_Pad_3: 700,
                    flipComp_PartnerPad_3: 700,
                    flipComp_Pad_4: 700,
                    flipComp_PartnerPad_4: 700,
                    flipComp_Pad_5: 700,
                    flipComp_PartnerPad_5: 700,
                    flipComp_Pad_6: 700,
                    flipComp_PartnerPad_6: 700,
                    flipComp_Pad_7: 700,
                    flipComp_PartnerPad_7: 700,
                    flipComp_Pad_8: 700,
                    flipComp_PartnerPad_8: 700,
                    flipComp_Pad_9: 700,
                    flipComp_PartnerPad_9: 700,
                    flipComp_Pad_10: 700,
                    flipComp_PartnerPad_10: 700
                }
            }
        }
    // #endregion

    // #region IMAGE OBJECT & AREA GETTERS: Image Object & Data Retrieval
    const isRegImg = imgRef => Boolean(getImageKey(imgRef)),
        isRandomizerToken = tokenObj => {
            const tokenBaseSrc = tokenObj && tokenObj.get && tokenObj.get("imgsrc"),
                tokenMatch = tokenBaseSrc && tokenBaseSrc.match(/.*?\/images\/(.*?)\/[^/]*?\.png\?(.*)/u),
                tokenBase = tokenMatch && tokenMatch.slice(1).join("/")
            if (tokenBase && TOKENREGISTRY[tokenBase] && isRegImg(TOKENREGISTRY[tokenBase].name))
                return tokenBase
            return false
        },
        getImageKey = (imgRef, isSilent = false) => {
            try {
                const dictTerm =
                    VAL({graphicObj: imgRef}) ?
                        imgRef.get("name") :
                        _.isString(imgRef) && VAL({graphicObj: getObj("graphic", imgRef)}) ?
                            getObj("graphic", imgRef).get("name") :
                            VAL({selection: imgRef}) ?
                                D.GetSelected(imgRef)[0].get("name") :
                                _.isString(imgRef) ?
                                    imgRef :
                                    false,
                    imgName = _.isString(dictTerm) ? 
                        IMAGEREGISTRY[dictTerm] && dictTerm ||
                        IMAGEREGISTRY[`${dictTerm}_1`] && `${dictTerm}_1` ||
                        D.IsIn(dictTerm, STATEREF.IMAGEDICT) :
                        false
                if (!imgName)
                    return !isSilent && THROW(`Cannot find name of image from reference '${D.JSL(imgRef)}'`, "GetImageKey")
                return imgName
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
        getTokenObj = charRef => {
            const charObj = D.GetChar(charRef)
            if (charObj)
                return (findObjs({_pageid: D.PAGEID, _type: "graphic", _subtype: "token", represents: charObj.id}) || [null])[0]
            return THROW(`No character found for reference ${charRef}`, "getTokenObj")
        },
        getAreaData = areaRef => AREAREGISTRY[areaRef],
        /* getImageDatas = imgRefs => {
			const imageRefs = D.GetSelected(imgRefs) || imgRefs,
				 imageDatas = []
			for (const imgRef of imageRefs) {
				imageDatas.push(getImageData(imgRef))
			}
			return imageDatas
		},	*/
        getBounds = (locRef) => {
            const boundaryData = {}
            if (VAL({string: locRef}) && AREAREGISTRY[locRef]) {
                boundaryData.top = AREAREGISTRY[locRef].top
                boundaryData.left = AREAREGISTRY[locRef].left
                boundaryData.height = AREAREGISTRY[locRef].height
                boundaryData.width = AREAREGISTRY[locRef].width
                //D.Alert(`BoundaryData:<br>${D.JS(boundaryData, true)}`, "getBounds")
            } else if (VAL({graphic: locRef})) {
                const imgObj = getImageObj(locRef)
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
        getContainedImgObjs = (locRef, options = {}) => {
            const findFilter = {
                _pageid: D.PAGEID,
                _type: "graphic"
            }
            for (const key of _.intersection(_.keys(options), ["subtype", "_subtype", "layer", "name"]))
                findFilter[key.replace(/^sub/gu, "_sub")] = options[key]            
            const contImgObjs = findObjs(findFilter).filter(v => {
                for (const key of _.intersection(_.keys(options), ["imgsrc", "represents", "left", "top", "width", "height", "controlledby"])) {
                    if (_.isEmpty(v.get(key)) || isRegImg(v) && !isImageActive(v))
                        return false
                    if (options[key] !== true && !v.get(key).toLowerCase().includes(options[key].toLowerCase()))
                        return false                    
                }
                if (checkBounds(locRef, v, options.padding || 0))
                    return true
                return false
            })
            if (options.isCharsOnly)
                return _.compact(contImgObjs.map(v => D.GetChar(v)))
            return contImgObjs
        },
        getZLevels = () => {
            const imgZLevels = {
                map: [],
                objects: [],
                dragpads: []
            }
            const getArray = (obj, topKey) => {
                const returnArray = []
                for (const key of _.keys(obj))
                    if (_.isNumber(obj[key]))
                        returnArray.push([topKey, key, obj[key]])
                    else
                        returnArray.push(...getArray(obj[key], topKey))
                return returnArray
            }
            for (const cat of ["map", "objects", "dragpads"])
                for (const key of _.keys(ZLEVELS[cat]))
                    imgZLevels[cat].push(...getArray(ZLEVELS[cat][key], key))
            return imgZLevels
        }
    // #endregion

    // #region IMAGE OBJECT & AREA SETTERS: Registering & Manipulating Image Objects
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
        addTokenSrc = (tokenSrcRef, tokenName) => {
            try {
                const tokenSrc = (_.isString(tokenSrcRef) && tokenSrcRef.includes("http") ?
                        tokenSrcRef :
                        getImageObj(tokenSrcRef).get("imgsrc") || "").replace(/\w*?(?=\.\w+?\?)/u, "thumb"),
                    tokenBase = isRandomizerToken(getImageObj(tokenName))
                if (tokenBase)
                    TOKENREGISTRY[tokenBase].srcs.push(tokenSrc)
                else
                    D.Alert(`Token base '${D.JS(tokenBase)} is not registered in the token registry.`, "addTokenSrc")
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
                initMedia()
                if (!isSilent)
                    D.Alert(`Host obj for '${D.JS(name)}' registered: ${D.JS(IMAGEREGISTRY[name])}`, "MEDIA: regImage")

                return getImageData(name)
            }

            return THROW(`Invalid img reference '${D.JSL(imgRef)}'`, "regImage")
        },
        regRandomizerToken = (imgRef, tokenName) => {
            if (!isRegImg(tokenName))
                regImage(imgRef, tokenName, "base", "objects", true)            
            const tokenBaseSrc = getImageData(tokenName).srcs.base,
                tokenKey = getImageKey(tokenName)
            if (tokenBaseSrc) {
                const tokenBase = tokenBaseSrc.match(/.*?\/images\/(.*?)\/[^/]*?\.png\?(.*)/u).slice(1).join("/")
                D.Alert(`Token Base Src: '${tokenBaseSrc}'<br>Token Base: '${tokenBase}'`, "regRandomizerToken")
                TOKENREGISTRY[tokenBase] = {
                    name: tokenKey,
                    srcs: [tokenBaseSrc]
                }
                IMAGEREGISTRY[tokenKey].tokenSrcCount = 0
            } else {
                D.Alert(`No 'base' source found for ${tokenName}`, "regRandomizerToken")
            }
        },
        regArea = (imgRef, areaName) => {
            const imgObj = getImageObj(imgRef)
            if (VAL({graphicObj: imgObj}, "regArea")) {
                AREAREGISTRY[areaName] = {
                    top: parseInt(imgObj.get("top")),
                    left: parseInt(imgObj.get("left")),
                    height: parseInt(imgObj.get("height")),
                    width: parseInt(imgObj.get("width"))
                }
                D.Alert(`Area Registered: ${areaName}<br><br><pre>${D.JS(AREAREGISTRY[areaName])}</pre>`, "Media: Register Area")
            }
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
            const imgObj = getImageObj(imgRef)
            let imgName
            if (imgObj && findObjs({_type: "character", _id: imgObj.get("represents")}).length) {
                const regCheck = _.find(_.values(Char.REGISTRY), x => x.id === imgObj.get("represents"))
                imgName = regCheck ? regCheck.tokenName : `${getObj("character", imgObj.get("represents")).get("name").replace(/\s+/gu, "")}Token`
            } else if (isRegImg(imgObj)) {
                imgName = getImageKey(imgObj)
            } else {
                return THROW(`No registered image or character token found for reference '${D.JSL(imgRef)}'`, "setImage()")
            }
            imgName = (/_\d+/gu).test(imgName) ? imgName : `${imgName}_1`
            if (isRegImg(imgName)) {
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
                    if (srcRef !== "blank" && !getImageData(imgRef).isActive)
                        toggleImagePermanent(imgRef, true)
                    if (srcRef !== "blank" && getImageData(imgRef).isActive)
                        IMAGEREGISTRY[getImageData(imgRef).name].activeSrc = srcRef
                    IMAGEREGISTRY[getImageData(imgRef).name].curSrc = srcRef
                    return imgObj
                }

                return THROW(`Invalid image object '${D.JSL(imgObj)}'`, "setImage()")
            }            
            return THROW(`No registered image found with key '${D.JSL(imgName)}'`, "setImage()")
        },
        setRandomizerToken = tokenObj => {
            const tokenBase = isRandomizerToken(tokenObj),
                tokenKey = tokenBase && TOKENREGISTRY[tokenBase].name
            if (tokenBase && tokenKey) {
                IMAGEREGISTRY[tokenKey].tokenSrcCount = _.isNumber(IMAGEREGISTRY[tokenKey].tokenSrcCount) && IMAGEREGISTRY[tokenKey].tokenSrcCount < TOKENREGISTRY[tokenBase].srcs.length - 1 ? IMAGEREGISTRY[tokenKey].tokenSrcCount + 1 : 0
                tokenObj.set("imgsrc", TOKENREGISTRY[tokenBase].srcs[IMAGEREGISTRY[tokenKey].tokenSrcCount])
            }
        },
        setImgParams = (imgRef, params) => {
            const imgObj = getImageObj(imgRef)
            if (VAL({imgObj: imgObj}, "setImgParams")) {
                imgObj.set(params)
                return imgObj
            }
            return false
        },
        setImgData = (imgRef, params, isSettingObject = false) => {
            const imgObj = getImageObj(imgRef),
                imgKey = getImageKey(imgRef)
            if (imgObj && imgKey) {
                _.each(params, (v, k) => {
                    IMAGEREGISTRY[imgKey][k] = v
                })
                if (isSettingObject)
                    setImgParams(imgRef, params)
                return IMAGEREGISTRY[getImageKey(imgRef)]
            }
            return false
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
            if (parsedParams.SiteNameCenter !== " ")
                toggleText("SiteNameCenter", true)
            setText("SiteNameCenter", parsedParams.SiteNameCenter)
            setImage("SiteBarLeft", parsedParams.SiteNameLeft === " " ? "blank" : "base")
            if (parsedParams.SiteNameLeft !== " ")
                toggleText("SiteNameLeft", true)
            setText("SiteNameLeft", parsedParams.SiteNameLeft)
            setImage("SiteBarRight", parsedParams.SiteNameRight === " " ? "blank" : "base")
            if (parsedParams.SiteNameRight !== " ")
                toggleText("SiteNameRight", true)
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
        toggleImage = (imgRef, isActive, isPermanent = false) => {
            const imgKey = getImageKey(imgRef),
                imgObj = getImageObj(imgRef),
                imgData = getImageData(imgRef)
            if (imgObj) {
                const activeCheck = isActive === false || isActive === true ? isActive : IMAGEREGISTRY[imgKey].isActive === false || IMAGEREGISTRY[imgKey].isActive === true ? !IMAGEREGISTRY[imgKey].isActive : IMAGEREGISTRY[imgKey].startActive
                //D.Alert(`activeCheck: ${activeCheck}`)
                if (activeCheck) {
                    IMAGEREGISTRY[imgKey].isActive = true
                    imgObj.set("layer", imgData.activeLayer || "objects")
                    if (imgData.activeSrc && imgData.activeSrc !== "blank")
                        setImage(imgRef, imgData.activeSrc)
                    else if (imgData.srcs && imgData.srcs.base)
                        setImage(imgRef, "base")
                } else {
                    IMAGEREGISTRY[imgKey].isActive = false
                    imgObj.set("layer", "gmlayer")
                    if (IMAGEREGISTRY[imgKey].curSrc !== "blank")
                        IMAGEREGISTRY[imgKey].activeSrc = IMAGEREGISTRY[imgKey].curSrc
                    setImage(imgRef, "blank")
                }
                if (isPermanent)
                    IMAGEREGISTRY[imgKey].startActive = IMAGEREGISTRY[imgKey].isActive
                return IMAGEREGISTRY[imgKey].isActive
            }
            return null
        },
        toggleImagePermanent = (imgRef, isActive) => toggleImage(imgRef, isActive, true),
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
        setImageArea = (imgRef, areaRef, isResizing = false) => {
            const imgObj = getImageObj(imgRef),
                areaData = getAreaData(areaRef)
            if (!imgObj)
                return D.Alert(`Invalid image reference: ${D.JS(imgRef)}`, "MEDIA: setImageArea")
            else if (!areaData)
                return D.Alert(`No area registered as '${D.JS(areaRef)}'`, "MEDIA: setImageArea")
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
        spreadImages = (leftImgRef, rightImgRef, midImgRefOrRefs, width, minOverlap = 20, maxOverlap = 40) => {
            const leftData = getImageData(leftImgRef),
                rightData = getImageData(rightImgRef),
                midData = _.map(_.flatten([midImgRefOrRefs]), v => getImageData(v)),
                spread = parseFloat(width)
            let dbString = ""
            DB(`minOverlap: ${minOverlap}, maxOverlap: ${maxOverlap}`)
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
                    DB(dbString + `Setting Right to {left: ${parseInt(leftData.rightEdge)} + 0.5x${parseInt(rightData.width)} = ${parseInt(leftData.rightEdge + 0.5*rightData.width)}}`, "spreadImages")
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
            } else if (textRefs === "all") {
                for (const tRef of _.values(TEXTREGISTRY))
                    textObjs.push(getTextObj(tRef.id))
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
                justify = justification || getTextData(textRef).justification
            if (VAL({textObj: textObj}, "getBlankLeft")) {   
                if (useCurrent)
                    return textObj.get("left") + (justify === "left" ? -0.5 : justify === "right" ? 0.5 : 0) * getMaxWidth(textObj)
                //D.Alert(`getBlankLeft Called on ${textObj.get("text")} with maxWidth ${maxWidth} into getTextWidth -->`)
                return textObj.get("left") + (justify === "left" ? -0.5 : justify === "right" ? 0.5 : 0) * getTextWidth(textObj, textObj.get("text"), maxWidth)
            }
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
            let textStrings = text.split(/(\s|-)/gu).filter(x => x.match(/\S/gu)),
                splitStrings = [],
                highWidth = 0
            for (let i = 0; i < textStrings.length; i++)
                if (textStrings[i] === "-") {
                    textStrings[i-1] = textStrings[i-1] + "-"
                    textStrings = [...[...textStrings].splice(0,i), ...[...textStrings].splice(i+1)]
                }
            //let [stringCount, lineCount] = [0, 0]
            while (textStrings.length) {
                let thisString = "",
                    nextWidth = getTextWidth(textObj, textStrings[0] + (textStrings[0].endsWith("-") ? "" : " "), false)
                //lineCount++
                //stringCount = 0
                //DB(`LINE ${lineCount}.  NextWidth: ${nextWidth}`, "splitTextLines")
                while (nextWidth < maxWidth && textStrings.length) {
                    thisString += textStrings[0].endsWith("-") ? `${textStrings.shift()}` : `${textStrings.shift()} `
                    nextWidth = textStrings.length ? getTextWidth(textObj, thisString + textStrings[0] + (textStrings[0].endsWith("-") ? "" : " "), false) : 0
                    //stringCount++
                    //DB(`... STRING ${stringCount}: ${thisString}  NextWidth: ${nextWidth}`, "splitTextLines")
                }
                //DB(`ADDING LINE: ${thisString} with width ${getTextWidth(textObj, thisString, false)}`, "splitTextLines")
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
            //D.Alert(`Justifying ${D.JS(getTextKey(textObj))}.  Reference: ${D.JS(textRef)}, Object: ${D.JS(textObj)}`, "justifyText")
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
                //D.Alert(`${getTextKey(textRef)} Updated: ${D.JS(TEXTREGISTRY[getTextKey(textObj)])}`, "justifyText")
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
                        width: getMaxWidth(textObj),
                        font_size: textObj.get("font_size"),
                        color: textObj.get("color"),
                        font_family: textObj.get("font_family").toLowerCase().includes("contrail") ? "Contrail One" : textObj.get("font_family"),
                        text: textObj.get("text").trim(),
                        layer: !(startActive === "false" || startActive === false) ? activeLayer : "gmlayer"
                    }
                options.justification = justification || options.justification || "center"
                options.maxWidth = options.maxWidth || 0
                options.lineHeight = D.CHARWIDTH[curTextParams.font_family] && D.CHARWIDTH[curTextParams.font_family][curTextParams.font_size] && D.CHARWIDTH[curTextParams.font_family][curTextParams.font_size].lineHeight || textObj.get("height")
                D.Alert(`CurTextParams: ${D.JS(curTextParams)}<br>NumLineBreaks: ${D.JS((curTextParams.text.match(/\n/gui) || []).length)}`)
                TEXTREGISTRY[name] = Object.assign(
                    Object.assign(
                        curTextParams,
                        {
                            id: textObj.id,
                            name: name,
                            top: curTextParams.top - 0.5 * (curTextParams.text.split("\n").length - 1) * options.lineHeight,
                            activeLayer: activeLayer,
                            startActive: !(startActive === "false" || startActive === false),
                            activeText: curTextParams.text,
                            zIndex: parseInt(options.zIndex) || (TEXTREGISTRY[name] ? TEXTREGISTRY[name].zIndex : 300),
                            justification: justification || "center",
                            maxWidth: options.maxWidth || 0,
                            lineHeight: D.CHARWIDTH[curTextParams.font_family] && D.CHARWIDTH[curTextParams.font_family][curTextParams.font_size] && D.CHARWIDTH[curTextParams.font_family][curTextParams.font_size].lineHeight || textObj.get("height"),
                            vertAlign: options.vertAlign || "top"             
                        }
                    ),
                    options
                )
                TEXTREGISTRY[name].left = getBlankLeft(textObj, TEXTREGISTRY[name].justification, TEXTREGISTRY[name].maxWidth, true)
                IDREGISTRY[textObj.id] = name
                setText(textObj, Object.assign(_.filter(_.pick(options, C.TEXTPROPS), (v, k) => curTextParams[k] !== v), {left: TEXTREGISTRY[name].left, layer: curTextParams.layer}))                
                if (hasShadow) {
                    const shadowOptions = Object.assign(_.omit(_.clone(TEXTREGISTRY[name]), "id"), {
                        name: `${name}Shadow`,
                        color: "rgb(0,0,0)",
                        shadowMaster: name,
                        zIndex: TEXTREGISTRY[name].zIndex - 1
                    })
                    DB(`Shadow Options: ${D.JS(shadowOptions)}`, "regText")
                    const shadowObj = makeText(shadowOptions.name, TEXTREGISTRY[name].activeLayer, TEXTREGISTRY[name].startActive, false, justification, shadowOptions, isSilent)
                    shadowOptions.id = shadowObj.id
                    TEXTREGISTRY[name].shadow = shadowOptions.name
                    TEXTREGISTRY[shadowOptions.name].left = TEXTREGISTRY[name].left + getShadowShift(textObj)
                    TEXTREGISTRY[shadowOptions.name].top = TEXTREGISTRY[name].top + getShadowShift(textObj)
                    setText(shadowOptions.name)
                    /*
                    left: TEXTREGISTRY[name].left + Math.round(TEXTREGISTRY[name].font_size/SHADOWFACTOR),
                    top: TEXTREGISTRY[name].top + Math.round(TEXTREGISTRY[name].font_size/SHADOWFACTOR),    
                    */  
                }    
                D.Alert(`Host obj for '${D.JS(name)}' registered: ${D.JS(TEXTREGISTRY[name])}`, "regText")
                initMedia()
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
                        setText(slaveKey)
                    }
                }
        },
        setText = (textRef, options = {}, isTemporary = false) => {
            const textObj = getTextObj(textRef),
                textData = getTextData(textRef),
                textOptions = VAL({string: options}) ? {text: options} : options === {} ? {text: textObj.get("text")} : options,
                textString = (textOptions && textOptions.text || textData && textData.text || textObj && textObj.get("text") || "").trim()
            let shadowObj, shadowObjParams
            if (VAL({textObj: textObj}, "setText")) {
                textOptions.left = textOptions && textOptions.left || textData && textData.left || getBlankLeft(textObj, textObj.get("text"))
                textOptions.top = textOptions && textOptions.top || textData && textData.top || textObj.get("top")
                textOptions.text = textString
                textOptions.maxWidth = textOptions && textOptions.maxWidth || textData && textData.maxWidth || 0
                const objParams = Object.assign(_.pick(textOptions, C.TEXTPROPS))
                //DB(`Options: ${D.JS(textOptions)}<br><br>Params: ${D.JS(objParams)}`, "setText")
                if (textOptions.maxWidth > 0 && objParams.text) {
                    const splitLines = splitTextLines(textObj, objParams.text, textOptions.maxWidth, textData.justification)
                    //DB(`Splitting Text: ${D.JS(splitLines)}`, "setText")
                    objParams.text = splitLines.join("\n")           
                }                
                if (objParams.text.split("\n").length > 1)
                    switch (textData.vertAlign || textOptions.vertAlign || "top") {
                        case "top":
                            textOptions.shifttop = (textOptions.shifttop || 0) + 0.5*(objParams.text.split("\n").length - 1)*(textData && textData.lineHeight || 
                                D.CHARWIDTH[textObj.get("font_family")] && D.CHARWIDTH[textObj.get("font_family")][textObj.get("font_size")] && D.CHARWIDTH[textObj.get("font_family")][textObj.get("font_size")].lineHeight ||
                                0)
                            break
                        case "bottom":
                            textOptions.shifttop = (textOptions.shifttop || 0) - 0.5*(objParams.text.split("\n").length - 1)*(textData && textData.lineHeight || 
                                D.CHARWIDTH[textObj.get("font_family")] && D.CHARWIDTH[textObj.get("font_family")][textObj.get("font_size")] && D.CHARWIDTH[textObj.get("font_family")][textObj.get("font_size")].lineHeight ||
                                0)
                            break
                        // no default
                    }
                objParams.left += (textData && textData.pushleft || 0) + (textOptions.shiftleft || 0)
                objParams.top += (textData && textData.pushtop || 0) + (textOptions.shifttop || 0)                    
                if (!isTemporary)
                    for (const key of _.intersection(_.keys(textOptions), _.keys(textData)))
                        TEXTREGISTRY[textData.name][key] = textOptions[key]
                objParams.left = getRealLeft(textObj, {left: objParams.left, text: textOptions.text, justification: textData.justification, maxWidth: textOptions.maxWidth})
                if (!_.isEmpty(textString)) {
                    objParams.layer = textData.activeLayer
                    TEXTREGISTRY[textData.name].activeText = textString
                }
                textObj.set(objParams)
                if (textData.shadow) {
                    shadowObj = getTextShadowObj(textRef)
                    shadowObjParams = _.omit(objParams, ["color"])
                    shadowObjParams.left += getShadowShift(textRef)
                    shadowObjParams.top += getShadowShift(textRef)
                    shadowObj.set(shadowObjParams)
                }
                if (textData && textData.linkedText)
                    updateSlaveText(textObj)
            }
        },
        setTextData = (textRef, params) => {
            _.each(params, (v, k) => {
                TEXTREGISTRY[getTextKey(textRef)][k] = v
            })
            return TEXTREGISTRY[getTextKey(textRef)]
        },
        toggleText = (textRef, isActive, isPermanent = false) => {
            const textKey = getTextKey(textRef),
                textObj = getTextObj(textRef),
                textData = getTextData(textRef)
            if (textObj) {
                const activeCheck = isActive === false || isActive === true ? isActive : TEXTREGISTRY[textKey].isActive === false || TEXTREGISTRY[textKey].isActive === true ? !TEXTREGISTRY[textKey].isActive : TEXTREGISTRY[textKey].startActive
                //D.Alert(`activeCheck: ${activeCheck}`)
                if (activeCheck) {
                    TEXTREGISTRY[textKey].isActive = true
                    textObj.set("layer", textData.activeLayer || "objects")
                    if (textData.activeText)
                        setText(textRef, {text: textData.activeText})
                } else {
                    TEXTREGISTRY[textKey].isActive = false
                    textObj.set("layer", "gmlayer")
                    setText(textRef, {text: " "})
                }
                if (isPermanent)
                    TEXTREGISTRY[textKey].startActive = TEXTREGISTRY[textKey].isActive                
                return TEXTREGISTRY[textKey].isActive  
            }
            return null
        },
        toggleTextPermanent = (textRef, isActive) => toggleText(textRef, isActive, true),
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
        }
    // #endregion

    // #region MEDIA SETTERS: Image, Animation & Text
    const setActiveLayers = () => {
            const returnStrings = []
            for (const imgData of _.values(IMAGEREGISTRY)) {
                const imgObj = getImageObj(imgData.id)
                if (imgObj)
                    imgObj.set("layer", imgData.activeLayer)
                else if (!imgData.name.includes("Token"))
                    returnStrings.push(`No Image Object Found for '${imgData.name}'`)
            }
            for (const textData of _.values(TEXTREGISTRY)) {
                const textObj = getTextObj(textData.id)
                if (textObj)
                    textObj.set("layer", textData.activeLayer)
                else
                    returnStrings.push(`No Text Object Found for '${textData.name}'`)
            }
            if (returnStrings.length)
                D.Alert(returnStrings.join("<br>"), "Media: SetActiveLayers")
        },
        setZIndices = () => {
            const allImageDatas = [],
                sortedMediaObjs = []
            for (const category of ["map", "objects", "dragpads"]) {
                const imgDatas = _.compact(getZLevels()[category].map(x => {
                    if (!IMAGEREGISTRY[x[1]])
                        return THROW(`No Image Registered for ZIndex Entry '${x[1]}'`, "setZIndices")
                    IMAGEREGISTRY[x[1]].zIndex = x[2]
                    return IMAGEREGISTRY[x[1]]
                }))
                allImageDatas.push(..._.compact(imgDatas))
            }
            sortedMediaObjs.push(..._.compact(_.keys(TEXTREGISTRY).filter(x => !x.includes("Shadow")).map(x => getTextObj(x) || null)))
            sortedMediaObjs.push(..._.compact(_.keys(TEXTREGISTRY).filter(x => x.includes("Shadow")).map(x => getTextObj(x) || null)))
            sortedMediaObjs.push(..._.compact(allImageDatas.sort((a,b) => b.zIndex - a.zIndex).map(x => getImageObj(x.id) || null)))
            for (let i = 0; i < sortedMediaObjs.length; i++)
                toBack(sortedMediaObjs[i])
        },
        initMedia = () => {
            setActiveLayers()
            setZIndices()
            for (const imgKey of _.keys(IMAGEREGISTRY))
                toggleImage(imgKey, IMAGEREGISTRY[imgKey].startActive)
            for (const textKey of _.keys(TEXTREGISTRY))
                toggleText(textKey, TEXTREGISTRY[textKey].startActive)
        }
    // #endregion

    return {
        RegisterEventHandlers: regHandlers,
        CheckInstall: checkInstall,
        IMAGES: IMAGEREGISTRY,
        TEXT: TEXTREGISTRY,
        GetObj: getImageObj,
        GetToken: getTokenObj,
        GetKey: getImageKey,
        GetData: getImageData,
        GetSrc: getImageSrc,
        GetBounds: getBounds,
        GetContents: getContainedImgObjs,
        GetContainedChars: (locRef, options) => getContainedImgObjs(locRef, Object.assign(options, {isCharsOnly: true})),
        MakeImage: makeImage,
        Register: regImage,
        AddSrc: addImgSrc,
        Remove: removeImage,
        RemoveAll: removeImages,
        Set: setImage,
        SetParams: setImgParams,
        SetData: setImgData,
        SetArea: setImageArea,
        SetLocation: setLocation,
        Toggle: toggleImagePermanent,
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
        ToggleText: toggleTextPermanent,

        Initialize: initMedia
    }
})()

on("ready", () => {
    Media.RegisterEventHandlers()
    Media.CheckInstall()
    D.Log("Media Ready!")
})
void MarkStop("Media")