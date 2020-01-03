void MarkStart("Media")
const Media = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Media",

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
            // delete STATE.REF.imgRegClean
            // delete STATE.REF.animregistry

            STATE.REF.imgregistry.WeatherFrost_1 = {
                id: "-Luq5BHI5Gqq2ap_WAPm",
                type: "image",
                name: "WeatherFrost_1",
                left: 795,
                top: 520,
                height: 1040,
                width: 1590,
                activeLayer: "map",
                zIndex: 139,
                srcs: {
                    frost1: "https://s3.amazonaws.com/files.d20.io/images/98105615/Afyl3Cyy4QbBfdoPPLKWKg/thumb.png?1575006917",
                    frost2: "https://s3.amazonaws.com/files.d20.io/images/98105619/Ij83cp7i76gzO0eZ8io7gw/thumb.png?1575006924",
                    frost3: "https://s3.amazonaws.com/files.d20.io/images/98105622/1x2L-YDYT8Hy3vmajGcBGA/thumb.png?1575006930",
                    redoverlay: "https://s3.amazonaws.com/files.d20.io/images/98108217/MiKx_cj5kN4jRg-GVv8rcw/thumb.png?1575012845"
                },
                modes: {
                    Active: {isForcedOn: "LAST", lastActive: true},
                    Inactive: {isForcedOn: true, isForcedState: "redoverlay", lastState: "redoverlay"},
                    Daylighter: {isForcedOn: "NEVER"},
                    Downtime: {isForcedOn: "NEVER"},
                    Complications: {isForcedOn: null},
                    Spotlight: {isForcedOn: "NEVER"}
                },
                leftEdge: 0,
                rightEdge: 1590,
                topEdge: 0,
                bottomEdge: 1040,
                curSrc: "redoverlay",
                curMode: "Active",
                activeSrc: "redoverlay",
                isActive: false,
                wasModeUpdated: true
            }
            STATE.REF.imgregistry = STATE.REF.imgregistry || {}
            STATE.REF.textregistry = STATE.REF.textregistry || {}
            STATE.REF.animregistry = STATE.REF.animregistry || {}
            STATE.REF.idregistry = STATE.REF.idregistry || {}
            STATE.REF.areas = STATE.REF.areas || {}
            STATE.REF.tokenregistry = STATE.REF.tokenregistry || {}
            STATE.REF.soundregistry = STATE.REF.soundregistry || {}
            STATE.REF.playlistregistry = STATE.REF.playlistregistry || {}
            STATE.REF.TokenSrcs = STATE.REF.TokenSrcs || {}
            STATE.REF.imgResizeDims = STATE.REF.imgResizeDims || {height: 100, width: 100}
            STATE.REF.activeAnimations = STATE.REF.activeAnimations || {}
            STATE.REF.activeSounds = STATE.REF.activeSounds || []
            STATE.REF.curLocation = STATE.REF.curLocation || "DistrictCenter:blank SiteCenter:blank"
            STATE.REF.loopingSounds = STATE.REF.loopingSounds || []
            STATE.REF.isRunningSilent = STATE.REF.isRunningSilent || false

            // Initialize IMGDICT Fuzzy Dictionary
            STATE.REF.IMGDICT = Fuzzy.Fix()
            for (const imgKey of _.keys(STATE.REF.imgregistry))
                STATE.REF.IMGDICT.add(imgKey)

            // Initialize TEXTDICT Fuzzy Dictionary
            STATE.REF.TEXTDICT = Fuzzy.Fix()
            for (const textKey of _.keys(STATE.REF.textregistry))
                STATE.REF.TEXTDICT.add(textKey)
        
            // Initialize AREADICT Fuzzy Dictionary
            STATE.REF.AREADICT = Fuzzy.Fix()
            for (const areaKey of _.keys(STATE.REF.areas))
                STATE.REF.AREADICT.add(areaKey)

            for (const [animKey] of Object.entries(STATE.REF.animregistry)) {
                STATE.REF.animregistry[animKey].isAnimation = true
                delete STATE.REF.animregistry[animKey].curSrc
            }
            // for (const [animKey, animData] of Object.entries(STATE.REF.animregistry))
            //    for (const mode of ["Active", "Inactive", "Daylighter", "Downtime", "Spotlight", "Complications"])
            //        delete STATE.REF.animregistry[animKey][mode]

            /* const srcsToAdd = {
                Horizon_1: {
                    night1: "https://s3.amazonaws.com/files.d20.io/images/96325997/MpxC9gfKRM1xtCCPjYT46g/thumb.jpg?1573105648"
                },
                WeatherClouds_1: {
                    night1clouds: "https://s3.amazonaws.com/files.d20.io/images/96326509/6xytUfwtm1-NarmVnpy0nw/thumb.png?1573106351"
                }
            }
            for (const [imgName, imgData] of Object.entries(STATE.REF.imgregistry))
                if (_.keys(srcsToAdd).includes(imgName)) {
                    const imgSrcs = Object.assign({}, imgData.srcs)
                    for (const srcName of _.keys(imgSrcs))
                        delete STATE.REF.imgregistry[imgName].srcs[srcName]
                    for (const [srcName, srcString] of Object.entries(srcsToAdd[imgName]))
                        STATE.REF.imgregistry[imgName].srcs[srcName] = srcString                    
                    for (const [srcName, srcString] of Object.entries(imgSrcs))
                        STATE.REF.imgregistry[imgName].srcs[srcName] = srcString
                } */
            // "SubSiteTopRight_1","SubSiteRight_1","SubSiteBotRight_1","SubSiteTopLeft_1","SubSiteLeft_1","SubSiteBotLeft_1"
            // STATE.REF.imgregistry.SubLocTopRight_1 = D.Clone(STATE.REF.imgregistry.SubSiteTopRight_1)
            // STATE.REF.imgregistry.SubLocRight_1 = D.Clone(STATE.REF.imgregistry.SubSiteRight_1)
            // STATE.REF.imgregistry.SubLocBotRight_1 = D.Clone(STATE.REF.imgregistry.SubSiteBotRight_1)
            // STATE.REF.imgregistry.SubLocTopLeft_1 = D.Clone(STATE.REF.imgregistry.SubSiteTopLeft_1)
            // STATE.REF.imgregistry.SubLocLeft_1 = D.Clone(STATE.REF.imgregistry.SubSiteLeft_1)
            // STATE.REF.imgregistry.SubLocBotLeft_1 = D.Clone(STATE.REF.imgregistry.SubSiteBotLeft_1)
            // delete STATE.REF.imgregistry.SubSiteTopRight_1
            // delete STATE.REF.imgregistry.SubSiteRight_1
            // delete STATE.REF.imgregistry.SubSiteBotRight_1
            // delete STATE.REF.imgregistry.SubSiteTopLeft_1
            // delete STATE.REF.imgregistry.SubSiteLeft_1
            // delete STATE.REF.imgregistry.SubSiteBotLeft_1

            /* "MapButton_Autarkis_1"
                "MapButton_Districts_1"
                "MapButton_Domain_1"
                "MapButton_Parks_1"
                "MapButton_Rack_1"
                "MapButton_Roads_1"
                "MapButton_SitesCulture_1"
                "MapButton_SitesEducation_1"
                "MapButton_SitesHavens_1"
                "MapButton_SitesHealth_1"
                "MapButton_SitesLandmarks_1"
                "MapButton_SitesNightlife_1"
                "MapButton_SitesShopping_1"
                "MapButton_SitesTransportation_1" */

            // "MapLayer_<Name>"
            
            // DOMAIN:  "anarch" --> "camarilla" --> "blank" 
            // DISTRICTS: "names" --> "fills" --> "both" --> "blank"
        },
            
        
    // #endregion

    // #region EVENT HANDLERS: (HANDLEINPUT)
        onChatCall = (call, args, objects, msg) => { // eslint-disable-line no-unused-vars
            let imgParams, imgModes
            switch (call) {
                case "!media": {
                    const mediaObjs = [...Listener.GetObjects(objects, "graphic"), ...Listener.GetObjects(objects, "text")]
                    switch (D.LCase(call = args.shift())) {
                        case "set": {
                            switch (D.LCase(call = args.shift())) {
                                case "anchor": {
                                    setAnchor((D.GetSelected(msg) || mediaObjs).shift())
                                    break
                                }
                                // no default
                            }
                            break
                        }
                        case "fix": {
                            switch (D.LCase(call = args.shift())) {
                                case "all": {
                                    fixAll(args[0] && args[0].includes("kill"))
                                    break
                                }
                                default: {
                                    const imgReport = fixImgObjs(),
                                        textReport = fixTextObjs()
                                    D.Alert(`${imgReport}<br>${textReport}`, "!media fix")
                                    break
                                }
                            }                            
                            break
                        }                        
                        case "align": {
                            alignObjs(D.GetSelected(msg) || mediaObjs, ...args)
                            break
                        }
                        case "resize": {
                            resizeImgs(D.GetSelected(msg) || mediaObjs)
                            break
                        }
                        case "dist": {
                            distObjs(D.GetSelected(msg) || mediaObjs, args.shift())
                            break
                        }                        
                        case "adjust": {
                            adjustObj(mediaObjs, ...args.map(x => D.Float(x)))
                            break
                        }
                        // no default
                    }
                    break
                }
                case "!area": {
                    const [imgObj] = D.GetSelected(msg) || Listener.GetObjects(objects, "graphic")
                    switch (D.LCase(call = args.shift())) {
                        case "reg": case "register": {
                            if (!args.length)
                                args.unshift(msg.content.split(/\s+/gu).pop())
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
                        case "makecomps": {
                            const hostName = args.shift(),
                                [imgObj] = imgObjs
                            D.Alert("Removing Objects...")
                            for (let i = 1; i <= 10; i++) {
                                removeImg(`${hostName}_${i}`, false)
                                removeImg(`CompCard_Enhanced_${i}`, false)
                            }
                            for (let i = 1; i <= 10; i++) {
                                const spotData = getImgData(`CompSpot_${i}`)
                                if (VAL({list: spotData})) {       
                                    D.Alert(`Making ${hostName}_${i} from ${spotData.name}`)                             
                                    const thisImg = makeImg(`${hostName}_${i}`, {
                                        width: spotData.width,
                                        height: spotData.height,
                                        left: spotData.left,
                                        top: spotData.top,
                                        imgsrc: imgObj.get("imgsrc"),
                                        layer: "map",
                                        isdrawing: false,
                                        controlledby: "",
                                        showname: false
                                    })
                                    toFront(thisImg)
                                }
                            }
                            const baseKey = `${hostName}_1`
                            for (let i = 2; i <= 10; i++) {
                                const imgKey = `${hostName}_${i}`
                                REGISTRY.IMG[imgKey].srcs = baseKey
                                REGISTRY.IMG[`CompSpot_${i}`].srcs = "CompSpot_1"
                            }
                            delete REGISTRY.IMG[baseKey].srcs.base
                            break
                        }
                        case "backup": {
                            STATE.REF.backup = {
                                arearegistry: JSON.parse(JSON.stringify(REGISTRY.AREA)),
                                imgregistry: JSON.parse(JSON.stringify(REGISTRY.IMG)),
                                textregistry: JSON.parse(JSON.stringify(REGISTRY.TEXT))
                            }
                            D.Alert("Media Registry Backup Updated.", "!img backup")
                            break
                        }
                        case "rereg": case "reregister": {
                            const [imgObj] = imgObjs
                            if (isRegImg(imgObj)) {                         
                                const imgData = getImgData(msg, true)
                                args[0] = args[0] || imgData.name
                                args[1] = args[1] || imgData.curSrc
                                args[2] = args[2] || imgData.activeLayer
                                imgParams = args.slice(2).join(" ")
                                imgModes = JSON.parse(JSON.stringify(imgData.modes))
                                removeImg(msg, true)
                            }
                        }
                        // falls through
                        case "reg": case "register": {
                            const [imgObj] = imgObjs
                            if (VAL({imgObj}, "!img register"))                                
                                switch (D.LCase(call = args.shift())) {
                                    case "token": {
                                        if (VAL({imgObj}))
                                            regToken(imgObj)
                                        break
                                    }
                                    case "random": case "randomizertoken": case "randtoken": {
                                        regRandomizerToken(imgObj)
                                        break
                                    }
                                    case "cyclesrc": case "cycle": {
                                        if (isRegImg(imgObj)) {
                                            const hostName = getImgKey(imgObj)
                                            REGISTRY.IMG[hostName].cycleSrcs = []
                                            REGISTRY.IMG[hostName].cycleSrcs.push(REGISTRY.IMG[hostName].curSrc)
                                            D.Alert(`${D.JS(hostName)} Registered as a Cycling Image.<br><br>Currently Displaying '${D.JS(REGISTRY.IMG[hostName].curSrc)}'.`, "!img reg cyclesrc")
                                        } else {
                                            D.Alert("Must register the image as normal first!<br><br>Syntax: !img reg <hostname> <srcName> <activeLayer>", "!img reg cyclesrc")
                                        }
                                        break
                                    }
                                    default: {
                                        if (call)
                                            args.unshift(call)
                                        const [hostName, srcName, objLayer, ...paramArgs] = args
                                        if (hostName && srcName && objLayer)
                                            regImg(imgObj, hostName, srcName, objLayer, D.ParseToObj(paramArgs.join(" ")))
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
                                case "tokensrc": {
                                    const [charObj] = Listener.GetObjects(objects, "characters")
                                    if (VAL({charObj}))
                                        combineTokenSrc(charObj, args.join(" "))
                                    break
                                }
                                case "activesource": case "activesrc": {
                                    const [imgObj] = imgObjs,
                                        [hostName, srcName] = [getImgKey(imgObj), args.shift()]
                                    if (isRegImg(hostName))
                                        setImgData(hostName, {activeSrc: srcName})
                                    else
                                        D.Alert(`Img name ${D.JS(hostName)} is not registered.`, "MEDIA: !img set activesrc")
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
                                case "front": {
                                    const [imgObj] = imgObjs
                                    if (VAL({imgObj}, "!img set front")) {
                                        const modeData = getModeData(imgObj)
                                        if (!modeData) {
                                            D.Alert(`No mode data for ${D.JS(imgObj)}!<br>Toggling & sending to front anyways!`, "!img set front")
                                            toggleImg(imgObj, true, true)
                                            toFront(imgObj)
                                        } else if (modeData.isForcedOn === "NEVER") {
                                            D.Alert(`Can't toggle ${D.JS(imgObj)} on: isForcedOn = "NEVER"`, "!img set front")
                                        } else {
                                            D.Alert(`Toggling ON and sending ${D.JS(imgObj)} to Front`, "MEDIA: !img set front")
                                            toggleImg(imgObj, true, true)
                                            toFront(imgObj)
                                        }
                                    }
                                    break
                                }
                                // no default
                            }
                            break
                        }
                        case "clean": case "cleanreg": case "cleanregistry": {
                            clearMissingRegImgs(args[0] && args[0].includes("kill"))
                            break
                        }
                        case "clearunreg": {
                            clearUnregImgs(args[0] && args[0].includes("kill"))
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
                                    if (srcName === "blank" || _.keys(REGISTRY.IMG[hostName].srcs).includes(srcName)) {
                                        D.Alert(`Existing image source '${srcName}' added to cycling queue.<br><br>Current Cycling Queue: ${REGISTRY.IMG[hostName].cycleSrcs}`, "!img add cyclesrc")
                                        break
                                    }
                                    D.Alert(`Adding '${srcName}' to cycling queue; proceeding to add image as source.`, "!img add cyclesrc")
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
                                case "random": case "randomsrc": case "tokensrc": case "tokensource": {
                                    const [charObj] = Listener.GetObjects(objects, "character"),
                                        tokenSrcObj = Listener.GetObjects(objects, "graphic").filter(x => !x.get("name")).pop()
                                    // srcName = args.join(" ")
                                    // D.Alert([charObj, tokenSrcObj, srcName].map(x => JSON.stringify(x)).join("<br>"))
                                    DB({char: charObj.get("name"), tokenSrcObj}, "addTokenSrc")
                                    if (VAL({charObj, imgObj: tokenSrcObj}))
                                        addTokenSrc(tokenSrcObj, charObj)
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
                                    resetModeData(true)
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
                                        STATE.REF.imgResizeDims.height = params.height
                                        STATE.REF.imgResizeDims.width = params.width
                                        D.Alert(`New imagess automatically resized to height: ${STATE.REF.imgResizeDims.height}, width: ${STATE.REF.imgResizeDims.width}.`, "!img toggle resize")
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
                                        if (isRegImg(hostName) /* && C[(keysSrc || "").toUpperCase()] */) {
                                            STATE.REF.autoRegSrcNames = Complications.Cards.map(x => x.name) // _.keys(C[keysSrc.toUpperCase()])
                                            imgSrcAutoReg = hostName
                                            D.Alert(`Automatic registration of image sources toggled ON for ${D.JS(hostName)}.<br><br>Upload image for <b>${STATE.REF.autoRegSrcNames[0]}</b>`, "Image Auto Registration")
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
                                            [skippedName] = STATE.REF.autoRegTokenNames
                                            STATE.REF.autoRegTokenNames.shift()
                                        }
                                        if (imgSrcAutoToken && skippedName && STATE.REF.autoRegTokenNames.length) {
                                            D.Alert(`Skipping <b>${skippedName}</b>...<br>Upload token image for <b>${STATE.REF.autoRegTokenNames[0]}`, "Token Auto Registration")
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
                                            STATE.REF.autoRegTokenNames = C.CHARACTERS
                                            if (VAL({number: args[0]}))
                                                STATE.REF.autoRegTokenNames = STATE.REF.autoRegTokenNames.slice(D.Int(args[0]))
                                            D.Alert(`Automatic registration of character tokens toggled ON.<br><br>Upload image for <b>${STATE.REF.autoRegTokenNames[0]}"</b><br>... OR "!img toggle autotoken skip" to skip.`, "Token Auto Registration")
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
                            alignObjs(imgObjs, ...args)
                            break
                        }
                        case "resize": {
                            resizeImgs(imgObjs, args)
                            break
                        }
                        case "dist": {
                            distObjs(imgObjs, args.shift())
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
                                case "realdata": {
                                    D.Alert(D.JS(getImgObj(imgObjs.shift()), true), "MEDIA, !img get realdata")
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
                                case "objects": {
                                    fixImgObjs()
                                    break
                                }
                                case "dragpads": {
                                    checkDragPads()
                                    break
                                }
                                case "layers": {
                                    setActiveLayers(args.shift() === "true")
                                    break
                                }
                                case "zlevels": {
                                    setZIndices()
                                    break
                                }
                                case "backgrounds": {
                                    resetBGImgs()
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
                                    for (const textData of _.values(STATE.REF.textregistry)) {
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
                                    if (!Session.Modes.includes(mode) || !["isForcedOn", "isForcedState", "lastActive", "lastState"].includes(key) || !["true", "false", "null", "LAST", "NEVER"].includes(val))
                                    {D.Alert("Mode Set Syntax:<br><br><b>!text set mode (hostName) (mode) (key) (val)</b>", "!text set mode")}
                                    else {
                                        REGISTRY.TEXT[textKey].modes = REGISTRY.TEXT[textKey].modes || {}
                                        REGISTRY.TEXT[textKey].modes[mode] = REGISTRY.TEXT[textKey].modes[mode] || {}
                                        REGISTRY.TEXT[textKey].modes[mode][key] = {true: true, false: false, null: null, LAST: "LAST", NEVER: "NEVER"}[val]
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
                        case "clearunreg": case "killunreg": {
                            clearUnregText(call === "killunreg")
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
                                const textData = getTextData(msg)
                                args[0] = args[0] || textData.name
                                args[1] = args[1] || textData.activeLayer
                                args[2] = args[2] || hasShadowObj(msg)
                                args[3] = args[3] || textData.justification
                                imgParams = args.slice(3).join(" ")
                                imgParams = _.compact([
                                    imgParams.includes("vertAlign") ? "" : `vertAlign:${textData.vertAlign || "top"}`,
                                    textData.maxWidth && !imgParams.includes("maxWidth") ? `maxWidth:${textData.maxWidth}` : "",
                                    imgParams.includes("zIndex") ? "" : `zIndex:${textData.zIndex || 300}`
                                ]).join(",") + imgParams
                                imgModes = JSON.parse(JSON.stringify(textData.modes))
                                removeText(msg, true, true)
                            }
                        }
                        // falls through
                        case "reg": case "register": {
                            if (args.length) {
                                const [textObj] = textObjs
                                if (textObj) {
                                    const [hostName, objLayer, isShadow, justification, ...paramArgs] = args
                                    imgParams = imgParams || paramArgs.join(" ")
                                    if (hostName && objLayer) {
                                        regText(textObj, hostName, objLayer, !isShadow || isShadow !== "false", justification || "center", D.ParseToObj(imgParams))
                                        if (imgModes)
                                            REGISTRY.TEXT[getTextKey(textObj)].modes = imgModes
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
                                D.Alert("Syntax: <b>!anim register &lt;animName&gt; &lt;timeOut [ms]&gt;</b>", "!anim register")
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
                                        setAnimTimerData(hostName, minTime, maxTime, soundName === "x" ? null : soundName, validModes)
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
                            playSound(args.shift(), undefined, undefined, true)
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
                            STATE.REF.isRunningSilent = true
                            Roll20AM.StopSound("all")
                            break
                        }
                        case "startall": {
                            STATE.REF.isRunningSilent = false
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
                imgObj.set(STATE.REF.imgResizeDims)
            if (imgSrcAutoReg && STATE.REF.autoRegSrcNames.length) {
                const hostName = imgSrcAutoReg,
                    srcName = STATE.REF.autoRegSrcNames.shift()
                addImgSrc(imgObj, hostName, srcName)
                if (STATE.REF.autoRegSrcNames.length) {
                    D.Alert(`Upload image for <b>${STATE.REF.autoRegSrcNames[0]}</b>`, "Image Auto Registration")
                } else {
                    delete STATE.REF.autoRegSrcNames
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
                    if (STATE.REF.autoRegTokenNames.length) {
                        D.Alert(`Upload token for <b>${STATE.REF.autoRegTokenNames[0]}</b>`, "Token Auto Registration")
                    } else {
                        delete STATE.REF.autoRegTokenNames
                        imgSrcAutoToken = false
                        D.Alert("Token auto registration complete!", "Token Auto Registration")
                    }
                    imgObj.remove()
                } else if (STATE.REF.autoRegTokenNames.length) {
                    const charName = STATE.REF.autoRegTokenNames.shift(),
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
    const [activeTimers, listTimers] = [{}, []],

    // #region CONFIGURATION
        REGISTRY = {
            get IMG() { return STATE.REF.imgregistry },
            get TEXT() { return STATE.REF.textregistry },
            get ANIM() { return STATE.REF.animregistry },
            get ID() { return STATE.REF.idregistry },
            get TOKEN() { return STATE.REF.tokenregistry },
            get AREA() { return STATE.REF.areas },
            get SOUND() { return STATE.REF.soundregistry },
            get PLAYLIST() { return STATE.REF.playlistregistry },
            get GRAPHIC() { return Object.assign({}, STATE.REF.animregistry, STATE.REF.imgregistry) },
            get ALL() { return Object.assign({}, STATE.REF.animregistry, STATE.REF.soundregistry, STATE.REF.textregistry, STATE.REF.imgregistry)}
        },
        STYLES = {
            Initialization: {
                Block: {
                    bgColor: C.COLORS.black,
                    border: "none"
                },
                Header: {                     
                    height: "auto",
                    width: "auto",
                    lineHeight: "25px",
                    padding: "0px 5px",
                    margin: "0px",
                    fontVariant: "small-caps",
                    fontWeight: "normal",
                    bgColor: "transparent",
                    color: C.COLORS.white,
                    border: "none",
                    textAlign: "left"
                }
            }
        },
        BGIMGS = {
            top: C.SANDBOX.top,
            left: C.SANDBOX.left,
            height: C.SANDBOX.height,
            width: C.SANDBOX.width,
            keys: [
                "Horizon",
                "Foreground",
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
                "MapLayer_Districts",
                "MapLayer_Districts_Fill",
                "MapLayer_Domain",
                "MapLayer_Parks",
                "MapLayer_Rack",
                "MapLayer_Roads",
                "MapLayer_SitesCulture",
                "MapLayer_SitesEducation",
                "MapLayer_SitesHavens",
                "MapLayer_SitesHealth",
                "MapLayer_SitesLandmarks",
                "MapLayer_SitesNightlife",
                "MapLayer_SitesShopping",
                "MapLayer_SitesTransportation"
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
                        SiteBarRight_1: 150,
                        SiteNameCenter: 151,
                        SiteNameLeft: 151,
                        SiteNameRight: 151 
                    },
                    SubSiteTopLeft: 152,
                    SubSiteTopRight: 152,
                    SubSiteLeft: 152,
                    SubSiteRight: 152,
                    SubSiteBotLeft: 152,
                    SubSiteBotRight: 152
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
                    Horizon_1: 1,
                    Foreground_1: 118
                },
                Weather: {
                    RisingMoon_1: 100,
                    WeatherFrost_1: 139,
                    WeatherFog_1: 125,
                    WeatherMain_1: 124, 
                    WeatherLightning_1: 110,
                    WeatherLightning_2: 110,
                    WeatherLightning_3: 110,
                    WeatherGround_1: 119,
                    tempC: 400,
                    tempF: 400,
                    weather: 400 
                },
                OtherOverlays: {
                    Spotlight_1: 117 
                },
                SandboxDisplays: {
                    downtimeBanner_1: 107,
                    stakedAdvantagesHeader_1: 140,
                    weeklyResourcesHeader_1: 140,
                    projectsHeader_1: 140,
                    Desires: {
                        AvaDesire: 400,
                        NapierDesire: 400,
                        RoyDesire: 400,
                        LockeDesire: 400
                    },
                    Projects: {
                        Projects_Col1: 400,
                        Projects_Col2: 400,
                        Projects_Col3: 400,
                    },
                    Stakes: {
                        Stakes_Coterie_Col1: 400,
                        Stakes_Coterie_Col2: 400,
                        Stakes_Coterie_Col3: 400,
                        Stakes_Coterie_Col4: 400,
                        Stakes_Char_Col1: 400,
                        Stakes_Char_Col2: 400,
                        Stakes_Char_Col3: 400,
                        Stakes_Char_Col4: 400
                    },
                    Resources: {
                        Weekly_Char_Col1: 400,
                        Weekly_Char_Col2: 400,
                        Weekly_Char_Col3: 400,
                    }
                },
                Timers: {
                    Countdown: 400,
                    TimeTracker: 400
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
                        Roller_WPReroller_1: 603,
                        Roller_WPReroller_Base_1: 602,
                        Roller_WPReroller_2: 601,
                        Roller_WPReroller_Base_2: 600
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
                    },
                    Text: {                    
                        dicePool: 400,
                        difficulty: 400,
                        goldMods: 400,
                        mainRoll: 400,
                        margin: 400,
                        negMods: 400,
                        outcome: 400,
                        posMods: 400,
                        redMods: 400,
                        resultCount: 400,
                        rollerName: 400,
                        subOutcome: 400
                    }
                },
                Map: {
                    MapLayer_Base_1: 401,
                    MapLayer_DistrictsFill_1: 402,
                    MapLayer_Rack_1: 403,
                    MapLayer_Parks_1: 403,
                    MapLayer_Domain_1: 404,
                    MapLayer_Autarkis_1: 404,
                    MapIndicator: 405,
                    MapIndicator_Base_1: 405,
                    MapLayer_Roads_1: 406,
                    MapLayer_Districts_1: 407,
                    MapLayer_SitesCulture_1: 408,
                    MapLayer_SitesNightlife_1: 408,
                    MapLayer_SitesLandmarks_1: 408,
                    MapLayer_SitesTransportation_1: 408,
                    MapLayer_SitesShopping_1: 408,
                    MapLayer_SitesEducation_1: 408,
                    MapLayer_SitesHealth_1: 408,
                    MapLayer_SitesHavens_1: 408,
                    MapButton_Panel_1: 500,
                    MapButton_Domain_1: 501,
                    MapButton_Districts_1: 501,
                    MapButton_Roads_1: 501,
                    MapButton_Parks_1: 501,
                    MapButton_Rack_1: 501,
                    MapButton_SitesCulture_1: 501,
                    MapButton_SitesEducation_1: 501,
                    MapButton_SitesHavens_1: 501,
                    MapButton_SitesHealth_1: 501,
                    MapButton_SitesLandmarks_1: 501,
                    MapButton_SitesNightlife_1: 501,
                    MapButton_SitesShopping_1: 501,
                    MapButton_SitesTransportation_1: 501,
                },
                Complications: {
                    Base: {
                        ComplicationMat_1: 700
                    },
                    CardSlots: {
                        CompSpot_1: 701,
                        CompSpot_2: 701,
                        CompSpot_3: 701,
                        CompSpot_4: 701,
                        CompSpot_5: 701,
                        CompSpot_6: 701,
                        CompSpot_7: 701,
                        CompSpot_8: 701,
                        CompSpot_9: 701,
                        CompSpot_10: 701
                    },
                    CardBases: {
                        CompCard_Base_1: 702,
                        CompCard_Base_2: 702,
                        CompCard_Base_3: 702,
                        CompCard_Base_4: 702,
                        CompCard_Base_5: 702,
                        CompCard_Base_6: 702,
                        CompCard_Base_7: 702,
                        CompCard_Base_8: 702,
                        CompCard_Base_9: 702,
                        CompCard_Base_10: 702
                    },
                    CardText: {
                        CompCard_Text_1: 703,
                        CompCard_Text_2: 703,
                        CompCard_Text_3: 703,
                        CompCard_Text_4: 703,
                        CompCard_Text_5: 703,
                        CompCard_Text_6: 703,
                        CompCard_Text_7: 703,
                        CompCard_Text_8: 703,
                        CompCard_Text_9: 703,
                        CompCard_Text_10: 703
                    },
                    RevalueOverlay: {
                        CompCard_Revalue_1: 704,
                        CompCard_Revalue_2: 704,
                        CompCard_Revalue_3: 704,
                        CompCard_Revalue_4: 704,
                        CompCard_Revalue_5: 704,
                        CompCard_Revalue_6: 704,
                        CompCard_Revalue_7: 704,
                        CompCard_Revalue_8: 704,
                        CompCard_Revalue_9: 704,
                        CompCard_Revalue_10: 704
                    },
                    NegateOverlay: {
                        CompCard_Negated_1: 705,
                        CompCard_Negated_2: 705,
                        CompCard_Negated_3: 705,
                        CompCard_Negated_4: 705,
                        CompCard_Negated_5: 705,
                        CompCard_Negated_6: 705,
                        CompCard_Negated_7: 705,
                        CompCard_Negated_8: 705,
                        CompCard_Negated_9: 705,
                        CompCard_Negated_10: 705
                    },
                    DuplicateOverlay: {
                        CompCard_DuplicatedLeft_1: 705,
                        CompCard_DuplicatedLeft_2: 705,
                        CompCard_DuplicatedLeft_3: 705,
                        CompCard_DuplicatedLeft_4: 705,
                        CompCard_DuplicatedLeft_5: 705,
                        CompCard_DuplicatedLeft_6: 705,
                        CompCard_DuplicatedLeft_7: 705,
                        CompCard_DuplicatedLeft_8: 705,
                        CompCard_DuplicatedLeft_9: 705,
                        CompCard_DuplicatedLeft_10: 705,
                        CompCard_DuplicatedRight_1: 705,
                        CompCard_DuplicatedRight_2: 705,
                        CompCard_DuplicatedRight_3: 705,
                        CompCard_DuplicatedRight_4: 705,
                        CompCard_DuplicatedRight_5: 705,
                        CompCard_DuplicatedRight_6: 705,
                        CompCard_DuplicatedRight_7: 705,
                        CompCard_DuplicatedRight_8: 705,
                        CompCard_DuplicatedRight_9: 705,
                        CompCard_DuplicatedRight_10: 705
                    },
                    CompCurrent: 706,
                    CompRemaining: 706,
                    CompTarget: 706,
                    CompCardsRemaining: 706,
                    CompCardsExcluded: 706 
                }
            },
            objects: {},
            dragpads: 900
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
        MODEDATA = [
            ["IMG", "CompCard_Base_1", "isActive", false],
            ["IMG", "CompCard_Base_1", "curSrc", "cardBack"],
            ["IMG", "CompCard_Base_1", "activeSrc", "cardBack"],
            ["IMG", "CompCard_Base_1", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_1", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_1", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_1", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_1", "modes", "Complications", {isForcedOn: true, isForcedState: "cardBack", lastState: "cardBack"}],
            ["IMG", "CompCard_Base_10", "isActive", false],
            ["IMG", "CompCard_Base_10", "curSrc", "cardBack"],
            ["IMG", "CompCard_Base_10", "activeSrc", "cardBack"],
            ["IMG", "CompCard_Base_10", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_10", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_10", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_10", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_10", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_10", "modes", "Complications", {isForcedOn: true, isForcedState: "cardBack", lastState: "cardBack"}],
            ["IMG", "CompCard_Base_2", "isActive", false],
            ["IMG", "CompCard_Base_2", "curSrc", "cardBack"],
            ["IMG", "CompCard_Base_2", "activeSrc", "cardBack"],
            ["IMG", "CompCard_Base_2", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_2", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_2", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_2", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_2", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_2", "modes", "Complications", {isForcedOn: true, isForcedState: "cardBack", lastState: "cardBack"}],
            ["IMG", "CompCard_Base_3", "isActive", false],
            ["IMG", "CompCard_Base_3", "curSrc", "cardBack"],
            ["IMG", "CompCard_Base_3", "activeSrc", "cardBack"],
            ["IMG", "CompCard_Base_3", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_3", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_3", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_3", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_3", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_3", "modes", "Complications", {isForcedOn: true, isForcedState: "cardBack", lastState: "cardBack"}],
            ["IMG", "CompCard_Base_4", "isActive", false],
            ["IMG", "CompCard_Base_4", "curSrc", "cardBack"],
            ["IMG", "CompCard_Base_4", "activeSrc", "cardBack"],
            ["IMG", "CompCard_Base_4", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_4", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_4", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_4", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_4", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_4", "modes", "Complications", {isForcedOn: true, isForcedState: "cardBack", lastState: "cardBack"}],
            ["IMG", "CompCard_Base_5", "isActive", false],
            ["IMG", "CompCard_Base_5", "curSrc", "cardBack"],
            ["IMG", "CompCard_Base_5", "activeSrc", "cardBack"],
            ["IMG", "CompCard_Base_5", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_5", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_5", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_5", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_5", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_5", "modes", "Complications", {isForcedOn: true, isForcedState: "cardBack", lastState: "cardBack"}],
            ["IMG", "CompCard_Base_6", "isActive", false],
            ["IMG", "CompCard_Base_6", "curSrc", "cardBack"],
            ["IMG", "CompCard_Base_6", "activeSrc", "cardBack"],
            ["IMG", "CompCard_Base_6", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_6", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_6", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_6", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_6", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_6", "modes", "Complications", {isForcedOn: true, isForcedState: "cardBack", lastState: "cardBack"}],
            ["IMG", "CompCard_Base_7", "isActive", false],
            ["IMG", "CompCard_Base_7", "curSrc", "cardBack"],
            ["IMG", "CompCard_Base_7", "activeSrc", "cardBack"],
            ["IMG", "CompCard_Base_7", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_7", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_7", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_7", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_7", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_7", "modes", "Complications", {isForcedOn: true, isForcedState: "cardBack", lastState: "cardBack"}],
            ["IMG", "CompCard_Base_8", "isActive", false],
            ["IMG", "CompCard_Base_8", "curSrc", "cardBack"],
            ["IMG", "CompCard_Base_8", "activeSrc", "cardBack"],
            ["IMG", "CompCard_Base_8", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_8", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_8", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_8", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_8", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_8", "modes", "Complications", {isForcedOn: true, isForcedState: "cardBack", lastState: "cardBack"}],
            ["IMG", "CompCard_Base_9", "isActive", false],
            ["IMG", "CompCard_Base_9", "curSrc", "cardBack"],
            ["IMG", "CompCard_Base_9", "activeSrc", "cardBack"],
            ["IMG", "CompCard_Base_9", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_9", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_9", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_9", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_9", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Base_9", "modes", "Complications", {isForcedOn: true, isForcedState: "cardBack", lastState: "cardBack"}],
            ["IMG", "CompCard_DuplicatedLeft_1", "isActive", false],
            ["IMG", "CompCard_DuplicatedLeft_1", "curSrc", "@@curSrc@@"],
            ["IMG", "CompCard_DuplicatedLeft_1", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_1", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_1", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_1", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_1", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_DuplicatedLeft_10", "isActive", false],
            ["IMG", "CompCard_DuplicatedLeft_10", "curSrc", "@@curSrc@@"],
            ["IMG", "CompCard_DuplicatedLeft_10", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_10", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_10", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_10", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_10", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_10", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_DuplicatedLeft_2", "isActive", false],
            ["IMG", "CompCard_DuplicatedLeft_2", "curSrc", "@@curSrc@@"],
            ["IMG", "CompCard_DuplicatedLeft_2", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_2", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_2", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_2", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_2", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_2", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_DuplicatedLeft_3", "isActive", false],
            ["IMG", "CompCard_DuplicatedLeft_3", "curSrc", "@@curSrc@@"],
            ["IMG", "CompCard_DuplicatedLeft_3", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_3", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_3", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_3", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_3", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_3", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_DuplicatedLeft_4", "isActive", false],
            ["IMG", "CompCard_DuplicatedLeft_4", "curSrc", "@@curSrc@@"],
            ["IMG", "CompCard_DuplicatedLeft_4", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_4", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_4", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_4", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_4", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_4", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_DuplicatedLeft_5", "isActive", false],
            ["IMG", "CompCard_DuplicatedLeft_5", "curSrc", "@@curSrc@@"],
            ["IMG", "CompCard_DuplicatedLeft_5", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_5", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_5", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_5", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_5", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_5", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_DuplicatedLeft_6", "isActive", false],
            ["IMG", "CompCard_DuplicatedLeft_6", "curSrc", "@@curSrc@@"],
            ["IMG", "CompCard_DuplicatedLeft_6", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_6", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_6", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_6", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_6", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_6", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_DuplicatedLeft_7", "isActive", false],
            ["IMG", "CompCard_DuplicatedLeft_7", "curSrc", "@@curSrc@@"],
            ["IMG", "CompCard_DuplicatedLeft_7", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_7", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_7", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_7", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_7", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_7", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_DuplicatedLeft_8", "isActive", false],
            ["IMG", "CompCard_DuplicatedLeft_8", "curSrc", "@@curSrc@@"],
            ["IMG", "CompCard_DuplicatedLeft_8", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_8", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_8", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_8", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_8", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_8", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_DuplicatedLeft_9", "isActive", false],
            ["IMG", "CompCard_DuplicatedLeft_9", "curSrc", "@@curSrc@@"],
            ["IMG", "CompCard_DuplicatedLeft_9", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_9", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_9", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_9", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_9", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedLeft_9", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_DuplicatedRight_1", "isActive", false],
            ["IMG", "CompCard_DuplicatedRight_1", "curSrc", "@@curSrc@@"],
            ["IMG", "CompCard_DuplicatedRight_1", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_1", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_1", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_1", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_1", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_DuplicatedRight_10", "isActive", false],
            ["IMG", "CompCard_DuplicatedRight_10", "curSrc", "@@curSrc@@"],
            ["IMG", "CompCard_DuplicatedRight_10", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_10", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_10", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_10", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_10", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_10", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_DuplicatedRight_2", "isActive", false],
            ["IMG", "CompCard_DuplicatedRight_2", "curSrc", "@@curSrc@@"],
            ["IMG", "CompCard_DuplicatedRight_2", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_2", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_2", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_2", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_2", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_2", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_DuplicatedRight_3", "isActive", false],
            ["IMG", "CompCard_DuplicatedRight_3", "curSrc", "@@curSrc@@"],
            ["IMG", "CompCard_DuplicatedRight_3", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_3", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_3", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_3", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_3", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_3", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_DuplicatedRight_4", "isActive", false],
            ["IMG", "CompCard_DuplicatedRight_4", "curSrc", "@@curSrc@@"],
            ["IMG", "CompCard_DuplicatedRight_4", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_4", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_4", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_4", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_4", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_4", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_DuplicatedRight_5", "isActive", false],
            ["IMG", "CompCard_DuplicatedRight_5", "curSrc", "@@curSrc@@"],
            ["IMG", "CompCard_DuplicatedRight_5", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_5", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_5", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_5", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_5", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_5", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_DuplicatedRight_6", "isActive", false],
            ["IMG", "CompCard_DuplicatedRight_6", "curSrc", "@@curSrc@@"],
            ["IMG", "CompCard_DuplicatedRight_6", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_6", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_6", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_6", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_6", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_6", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_DuplicatedRight_7", "isActive", false],
            ["IMG", "CompCard_DuplicatedRight_7", "curSrc", "@@curSrc@@"],
            ["IMG", "CompCard_DuplicatedRight_7", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_7", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_7", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_7", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_7", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_7", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_DuplicatedRight_8", "isActive", false],
            ["IMG", "CompCard_DuplicatedRight_8", "curSrc", "@@curSrc@@"],
            ["IMG", "CompCard_DuplicatedRight_8", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_8", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_8", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_8", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_8", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_8", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_DuplicatedRight_9", "isActive", false],
            ["IMG", "CompCard_DuplicatedRight_9", "curSrc", "@@curSrc@@"],
            ["IMG", "CompCard_DuplicatedRight_9", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_9", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_9", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_9", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_9", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_DuplicatedRight_9", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_Negated_1", "isActive", false],
            ["IMG", "CompCard_Negated_1", "curSrc", "base"],
            ["IMG", "CompCard_Negated_1", "activeSrc", "base"],
            ["IMG", "CompCard_Negated_1", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_1", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_1", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_1", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_1", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_Negated_10", "isActive", false],
            ["IMG", "CompCard_Negated_10", "curSrc", "base"],
            ["IMG", "CompCard_Negated_10", "activeSrc", "base"],
            ["IMG", "CompCard_Negated_10", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_10", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_10", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_10", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_10", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_10", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_Negated_2", "isActive", false],
            ["IMG", "CompCard_Negated_2", "curSrc", "base"],
            ["IMG", "CompCard_Negated_2", "activeSrc", "base"],
            ["IMG", "CompCard_Negated_2", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_2", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_2", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_2", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_2", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_2", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_Negated_3", "isActive", false],
            ["IMG", "CompCard_Negated_3", "curSrc", "base"],
            ["IMG", "CompCard_Negated_3", "activeSrc", "base"],
            ["IMG", "CompCard_Negated_3", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_3", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_3", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_3", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_3", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_3", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_Negated_4", "isActive", false],
            ["IMG", "CompCard_Negated_4", "curSrc", "base"],
            ["IMG", "CompCard_Negated_4", "activeSrc", "base"],
            ["IMG", "CompCard_Negated_4", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_4", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_4", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_4", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_4", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_4", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_Negated_5", "isActive", false],
            ["IMG", "CompCard_Negated_5", "curSrc", "base"],
            ["IMG", "CompCard_Negated_5", "activeSrc", "base"],
            ["IMG", "CompCard_Negated_5", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_5", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_5", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_5", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_5", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_5", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_Negated_6", "isActive", false],
            ["IMG", "CompCard_Negated_6", "curSrc", "base"],
            ["IMG", "CompCard_Negated_6", "activeSrc", "base"],
            ["IMG", "CompCard_Negated_6", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_6", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_6", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_6", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_6", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_6", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_Negated_7", "isActive", false],
            ["IMG", "CompCard_Negated_7", "curSrc", "base"],
            ["IMG", "CompCard_Negated_7", "activeSrc", "base"],
            ["IMG", "CompCard_Negated_7", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_7", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_7", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_7", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_7", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_7", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_Negated_8", "isActive", false],
            ["IMG", "CompCard_Negated_8", "curSrc", "base"],
            ["IMG", "CompCard_Negated_8", "activeSrc", "base"],
            ["IMG", "CompCard_Negated_8", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_8", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_8", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_8", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_8", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_8", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_Negated_9", "isActive", false],
            ["IMG", "CompCard_Negated_9", "curSrc", "base"],
            ["IMG", "CompCard_Negated_9", "activeSrc", "base"],
            ["IMG", "CompCard_Negated_9", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_9", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_9", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_9", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_9", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Negated_9", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_Revalue_1", "isActive", false],
            ["IMG", "CompCard_Revalue_1", "curSrc", "0"],
            ["IMG", "CompCard_Revalue_1", "activeSrc", "0"],
            ["IMG", "CompCard_Revalue_1", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_1", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_1", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_1", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_1", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_Revalue_10", "isActive", false],
            ["IMG", "CompCard_Revalue_10", "curSrc", "0"],
            ["IMG", "CompCard_Revalue_10", "activeSrc", "0"],
            ["IMG", "CompCard_Revalue_10", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_10", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_10", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_10", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_10", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_10", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_Revalue_2", "isActive", false],
            ["IMG", "CompCard_Revalue_2", "curSrc", "0"],
            ["IMG", "CompCard_Revalue_2", "activeSrc", "0"],
            ["IMG", "CompCard_Revalue_2", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_2", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_2", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_2", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_2", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_2", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_Revalue_3", "isActive", false],
            ["IMG", "CompCard_Revalue_3", "curSrc", "0"],
            ["IMG", "CompCard_Revalue_3", "activeSrc", "0"],
            ["IMG", "CompCard_Revalue_3", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_3", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_3", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_3", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_3", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_3", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_Revalue_4", "isActive", false],
            ["IMG", "CompCard_Revalue_4", "curSrc", "0"],
            ["IMG", "CompCard_Revalue_4", "activeSrc", "0"],
            ["IMG", "CompCard_Revalue_4", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_4", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_4", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_4", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_4", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_4", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_Revalue_5", "isActive", false],
            ["IMG", "CompCard_Revalue_5", "curSrc", "0"],
            ["IMG", "CompCard_Revalue_5", "activeSrc", "0"],
            ["IMG", "CompCard_Revalue_5", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_5", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_5", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_5", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_5", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_5", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_Revalue_6", "isActive", false],
            ["IMG", "CompCard_Revalue_6", "curSrc", "0"],
            ["IMG", "CompCard_Revalue_6", "activeSrc", "0"],
            ["IMG", "CompCard_Revalue_6", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_6", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_6", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_6", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_6", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_6", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_Revalue_7", "isActive", false],
            ["IMG", "CompCard_Revalue_7", "curSrc", "0"],
            ["IMG", "CompCard_Revalue_7", "activeSrc", "0"],
            ["IMG", "CompCard_Revalue_7", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_7", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_7", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_7", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_7", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_7", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_Revalue_8", "isActive", false],
            ["IMG", "CompCard_Revalue_8", "curSrc", "0"],
            ["IMG", "CompCard_Revalue_8", "activeSrc", "0"],
            ["IMG", "CompCard_Revalue_8", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_8", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_8", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_8", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_8", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_8", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_Revalue_9", "isActive", false],
            ["IMG", "CompCard_Revalue_9", "curSrc", "0"],
            ["IMG", "CompCard_Revalue_9", "activeSrc", "0"],
            ["IMG", "CompCard_Revalue_9", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_9", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_9", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_9", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_9", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Revalue_9", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_Text_1", "isActive", false],
            ["IMG", "CompCard_Text_1", "curSrc", "@@curSrc@@"],
            ["IMG", "CompCard_Text_1", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_1", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_1", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_1", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_1", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_Text_10", "isActive", false],
            ["IMG", "CompCard_Text_10", "curSrc", "@@curSrc@@"],
            ["IMG", "CompCard_Text_10", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_10", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_10", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_10", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_10", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_10", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_Text_2", "isActive", false],
            ["IMG", "CompCard_Text_2", "curSrc", "@@curSrc@@"],
            ["IMG", "CompCard_Text_2", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_2", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_2", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_2", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_2", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_2", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_Text_3", "isActive", false],
            ["IMG", "CompCard_Text_3", "curSrc", "@@curSrc@@"],
            ["IMG", "CompCard_Text_3", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_3", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_3", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_3", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_3", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_3", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_Text_4", "isActive", false],
            ["IMG", "CompCard_Text_4", "curSrc", "@@curSrc@@"],
            ["IMG", "CompCard_Text_4", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_4", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_4", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_4", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_4", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_4", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_Text_5", "isActive", false],
            ["IMG", "CompCard_Text_5", "curSrc", "@@curSrc@@"],
            ["IMG", "CompCard_Text_5", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_5", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_5", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_5", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_5", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_5", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_Text_6", "isActive", false],
            ["IMG", "CompCard_Text_6", "curSrc", "@@curSrc@@"],
            ["IMG", "CompCard_Text_6", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_6", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_6", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_6", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_6", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_6", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_Text_7", "isActive", false],
            ["IMG", "CompCard_Text_7", "curSrc", "@@curSrc@@"],
            ["IMG", "CompCard_Text_7", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_7", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_7", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_7", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_7", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_7", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_Text_8", "isActive", false],
            ["IMG", "CompCard_Text_8", "curSrc", "@@curSrc@@"],
            ["IMG", "CompCard_Text_8", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_8", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_8", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_8", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_8", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_8", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "CompCard_Text_9", "isActive", false],
            ["IMG", "CompCard_Text_9", "curSrc", "@@curSrc@@"],
            ["IMG", "CompCard_Text_9", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_9", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_9", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_9", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_9", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompCard_Text_9", "modes", "Complications", {isForcedOn: false}],
            ["IMG", "ComplicationMat_1", "isActive", false],
            ["IMG", "ComplicationMat_1", "curSrc", "base"],
            ["IMG", "ComplicationMat_1", "activeSrc", "base"],
            ["IMG", "ComplicationMat_1", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "ComplicationMat_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "ComplicationMat_1", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "ComplicationMat_1", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "ComplicationMat_1", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "ComplicationMat_1", "modes", "Complications", {isForcedOn: true, isForcedState: "base", lastState: "base"}],
            ["IMG", "CompSpot_1", "isActive", false],
            ["IMG", "CompSpot_1", "curSrc", "base"],
            ["IMG", "CompSpot_1", "activeSrc", "base"],
            ["IMG", "CompSpot_1", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_1", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_1", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_1", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_1", "modes", "Complications", {isForcedOn: true, isForcedState: "base", lastState: "base"}],
            ["IMG", "CompSpot_10", "isActive", false],
            ["IMG", "CompSpot_10", "curSrc", "base"],
            ["IMG", "CompSpot_10", "activeSrc", "base"],
            ["IMG", "CompSpot_10", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_10", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_10", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_10", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_10", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_10", "modes", "Complications", {isForcedOn: true, isForcedState: "base", lastState: "base"}],
            ["IMG", "CompSpot_2", "isActive", false],
            ["IMG", "CompSpot_2", "curSrc", "base"],
            ["IMG", "CompSpot_2", "activeSrc", "base"],
            ["IMG", "CompSpot_2", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_2", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_2", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_2", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_2", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_2", "modes", "Complications", {isForcedOn: true, isForcedState: "base", lastState: "base"}],
            ["IMG", "CompSpot_3", "isActive", false],
            ["IMG", "CompSpot_3", "curSrc", "base"],
            ["IMG", "CompSpot_3", "activeSrc", "base"],
            ["IMG", "CompSpot_3", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_3", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_3", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_3", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_3", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_3", "modes", "Complications", {isForcedOn: true, isForcedState: "base", lastState: "base"}],
            ["IMG", "CompSpot_4", "isActive", false],
            ["IMG", "CompSpot_4", "curSrc", "base"],
            ["IMG", "CompSpot_4", "activeSrc", "base"],
            ["IMG", "CompSpot_4", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_4", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_4", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_4", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_4", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_4", "modes", "Complications", {isForcedOn: true, isForcedState: "base", lastState: "base"}],
            ["IMG", "CompSpot_5", "isActive", false],
            ["IMG", "CompSpot_5", "curSrc", "base"],
            ["IMG", "CompSpot_5", "activeSrc", "base"],
            ["IMG", "CompSpot_5", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_5", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_5", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_5", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_5", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_5", "modes", "Complications", {isForcedOn: true, isForcedState: "base", lastState: "base"}],
            ["IMG", "CompSpot_6", "isActive", false],
            ["IMG", "CompSpot_6", "curSrc", "base"],
            ["IMG", "CompSpot_6", "activeSrc", "base"],
            ["IMG", "CompSpot_6", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_6", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_6", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_6", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_6", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_6", "modes", "Complications", {isForcedOn: true, isForcedState: "base", lastState: "base"}],
            ["IMG", "CompSpot_7", "isActive", false],
            ["IMG", "CompSpot_7", "curSrc", "base"],
            ["IMG", "CompSpot_7", "activeSrc", "base"],
            ["IMG", "CompSpot_7", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_7", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_7", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_7", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_7", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_7", "modes", "Complications", {isForcedOn: true, isForcedState: "base", lastState: "base"}],
            ["IMG", "CompSpot_8", "isActive", false],
            ["IMG", "CompSpot_8", "curSrc", "base"],
            ["IMG", "CompSpot_8", "activeSrc", "base"],
            ["IMG", "CompSpot_8", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_8", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_8", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_8", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_8", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_8", "modes", "Complications", {isForcedOn: true, isForcedState: "base", lastState: "base"}],
            ["IMG", "CompSpot_9", "isActive", false],
            ["IMG", "CompSpot_9", "curSrc", "base"],
            ["IMG", "CompSpot_9", "activeSrc", "base"],
            ["IMG", "CompSpot_9", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_9", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_9", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_9", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_9", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "CompSpot_9", "modes", "Complications", {isForcedOn: true, isForcedState: "base", lastState: "base"}],
            ["IMG", "Banner_Downtime_1", "isActive", false],
            ["IMG", "Banner_Downtime_1", "curSrc", "base"],
            ["IMG", "Banner_Downtime_1", "activeSrc", "base"],
            ["IMG", "Banner_Downtime_1", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "Banner_Downtime_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "Banner_Downtime_1", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "Banner_Downtime_1", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "Banner_Downtime_1", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "Banner_Downtime_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "projectsHeader_1", "isActive", true],
            ["IMG", "projectsHeader_1", "curSrc", "base"],
            ["IMG", "projectsHeader_1", "activeSrc", "base"],
            ["IMG", "projectsHeader_1", "modes", "Active", {isForcedOn: true, isForcedState: "base", lastState: "base"}],
            ["IMG", "projectsHeader_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "projectsHeader_1", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "projectsHeader_1", "modes", "Downtime", {isForcedOn: true, isForcedState: "base", lastState: "base"}],
            ["IMG", "projectsHeader_1", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "projectsHeader_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "stakedAdvantagesHeader_1", "isActive", true],
            ["IMG", "stakedAdvantagesHeader_1", "curSrc", "base"],
            ["IMG", "stakedAdvantagesHeader_1", "activeSrc", "base"],
            ["IMG", "stakedAdvantagesHeader_1", "modes", "Active", {isForcedOn: true, isForcedState: "base", lastState: "base"}],
            ["IMG", "stakedAdvantagesHeader_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "stakedAdvantagesHeader_1", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "stakedAdvantagesHeader_1", "modes", "Downtime", {isForcedOn: true, isForcedState: "base", lastState: "base"}],
            ["IMG", "stakedAdvantagesHeader_1", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "stakedAdvantagesHeader_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "weeklyResourcesHeader_1", "isActive", true],
            ["IMG", "weeklyResourcesHeader_1", "curSrc", "base"],
            ["IMG", "weeklyResourcesHeader_1", "activeSrc", "base"],
            ["IMG", "weeklyResourcesHeader_1", "modes", "Active", {isForcedOn: true, isForcedState: "base", lastState: "base"}],
            ["IMG", "weeklyResourcesHeader_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "weeklyResourcesHeader_1", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "weeklyResourcesHeader_1", "modes", "Downtime", {isForcedOn: true, isForcedState: "base", lastState: "base"}],
            ["IMG", "weeklyResourcesHeader_1", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "weeklyResourcesHeader_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "DistrictCenter_1", "isActive", false],
            ["IMG", "DistrictCenter_1", "curSrc", "@@curSrc@@"],
            ["IMG", "DistrictCenter_1", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["IMG", "DistrictCenter_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "DistrictCenter_1", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: true, lastState: "@@curSrc@@"}],
            ["IMG", "DistrictCenter_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: true, lastState: "@@curSrc@@"}],
            ["IMG", "DistrictCenter_1", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: true, lastState: "@@curSrc@@"}],
            ["IMG", "DistrictCenter_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "DistrictLeft_1", "isActive", false],
            ["IMG", "DistrictLeft_1", "curSrc", "@@curSrc@@"],
            ["IMG", "DistrictLeft_1", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["IMG", "DistrictLeft_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "DistrictLeft_1", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: true, lastState: "@@curSrc@@"}],
            ["IMG", "DistrictLeft_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: true, lastState: "@@curSrc@@"}],
            ["IMG", "DistrictLeft_1", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: true, lastState: "@@curSrc@@"}],
            ["IMG", "DistrictLeft_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "DistrictRight_1", "isActive", false],
            ["IMG", "DistrictRight_1", "curSrc", "@@curSrc@@"],
            ["IMG", "DistrictRight_1", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["IMG", "DistrictRight_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "DistrictRight_1", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: true, lastState: "@@curSrc@@"}],
            ["IMG", "DistrictRight_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: true, lastState: "@@curSrc@@"}],
            ["IMG", "DistrictRight_1", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: true, lastState: "@@curSrc@@"}],
            ["IMG", "DistrictRight_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "SiteBarCenter_1", "isActive", false],
            ["IMG", "SiteBarCenter_1", "curSrc", "base"],
            ["IMG", "SiteBarCenter_1", "activeSrc", "base"],
            ["IMG", "SiteBarCenter_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: "base", lastActive: true, lastState: "base"}],
            ["IMG", "SiteBarCenter_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "SiteBarCenter_1", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "base", lastActive: true, lastState: "base"}],
            ["IMG", "SiteBarCenter_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "base", lastActive: true, lastState: "base"}],
            ["IMG", "SiteBarCenter_1", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "base", lastActive: true, lastState: "base"}],
            ["IMG", "SiteBarCenter_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "SiteBarLeft_1", "isActive", false],
            ["IMG", "SiteBarLeft_1", "curSrc", "base"],
            ["IMG", "SiteBarLeft_1", "activeSrc", "base"],
            ["IMG", "SiteBarLeft_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: "base", lastActive: true, lastState: "base"}],
            ["IMG", "SiteBarLeft_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "SiteBarLeft_1", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "base", lastActive: true, lastState: "base"}],
            ["IMG", "SiteBarLeft_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "base", lastActive: true, lastState: "base"}],
            ["IMG", "SiteBarLeft_1", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "base", lastActive: true, lastState: "base"}],
            ["IMG", "SiteBarLeft_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "SiteBarRight_1", "isActive", false],
            ["IMG", "SiteBarRight_1", "curSrc", "base"],
            ["IMG", "SiteBarRight_1", "activeSrc", "base"],
            ["IMG", "SiteBarRight_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: "base", lastActive: true, lastState: "base"}],
            ["IMG", "SiteBarRight_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "SiteBarRight_1", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "base", lastActive: true, lastState: "base"}],
            ["IMG", "SiteBarRight_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "base", lastActive: true, lastState: "base"}],
            ["IMG", "SiteBarRight_1", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "base", lastActive: true, lastState: "base"}],
            ["IMG", "SiteBarRight_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "SiteCenter_1", "isActive", false],
            ["IMG", "SiteCenter_1", "curSrc", "@@curSrc@@"],
            ["IMG", "SiteCenter_1", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["IMG", "SiteCenter_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "SiteCenter_1", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: true, lastState: "@@curSrc@@"}],
            ["IMG", "SiteCenter_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: true, lastState: "@@curSrc@@"}],
            ["IMG", "SiteCenter_1", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: true, lastState: "@@curSrc@@"}],
            ["IMG", "SiteCenter_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "SiteLeft_1", "isActive", false],
            ["IMG", "SiteLeft_1", "curSrc", "@@curSrc@@"],
            ["IMG", "SiteLeft_1", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["IMG", "SiteLeft_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "SiteLeft_1", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: true, lastState: "@@curSrc@@"}],
            ["IMG", "SiteLeft_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: true, lastState: "@@curSrc@@"}],
            ["IMG", "SiteLeft_1", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: true, lastState: "@@curSrc@@"}],
            ["IMG", "SiteLeft_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "SiteRight_1", "isActive", false],
            ["IMG", "SiteRight_1", "curSrc", "@@curSrc@@"],
            ["IMG", "SiteRight_1", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["IMG", "SiteRight_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "SiteRight_1", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: true, lastState: "@@curSrc@@"}],
            ["IMG", "SiteRight_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: true, lastState: "@@curSrc@@"}],
            ["IMG", "SiteRight_1", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: true, lastState: "@@curSrc@@"}],
            ["IMG", "SiteRight_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "SubLocBotLeft_1", "isActive", false],
            ["IMG", "SubLocBotLeft_1", "curSrc", "@@curSrc@@"],
            ["IMG", "SubLocBotLeft_1", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["IMG", "SubLocBotLeft_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "SubLocBotLeft_1", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: true, lastState: "@@curSrc@@"}],
            ["IMG", "SubLocBotLeft_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: true, lastState: "@@curSrc@@"}],
            ["IMG", "SubLocBotLeft_1", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: true, lastState: "@@curSrc@@"}],
            ["IMG", "SubLocBotLeft_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "SubLocBotRight_1", "isActive", false],
            ["IMG", "SubLocBotRight_1", "curSrc", "@@curSrc@@"],
            ["IMG", "SubLocBotRight_1", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["IMG", "SubLocBotRight_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "SubLocBotRight_1", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: true, lastState: "@@curSrc@@"}],
            ["IMG", "SubLocBotRight_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: true, lastState: "@@curSrc@@"}],
            ["IMG", "SubLocBotRight_1", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: true, lastState: "@@curSrc@@"}],
            ["IMG", "SubLocBotRight_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "SubLocLeft_1", "isActive", false],
            ["IMG", "SubLocLeft_1", "curSrc", "@@curSrc@@"],
            ["IMG", "SubLocLeft_1", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["IMG", "SubLocLeft_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "SubLocLeft_1", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: true, lastState: "@@curSrc@@"}],
            ["IMG", "SubLocLeft_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: true, lastState: "@@curSrc@@"}],
            ["IMG", "SubLocLeft_1", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: true, lastState: "@@curSrc@@"}],
            ["IMG", "SubLocLeft_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "SubLocRight_1", "isActive", false],
            ["IMG", "SubLocRight_1", "curSrc", "@@curSrc@@"],
            ["IMG", "SubLocRight_1", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["IMG", "SubLocRight_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "SubLocRight_1", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: true, lastState: "@@curSrc@@"}],
            ["IMG", "SubLocRight_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: true, lastState: "@@curSrc@@"}],
            ["IMG", "SubLocRight_1", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: true, lastState: "@@curSrc@@"}],
            ["IMG", "SubLocRight_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "SubLocTopLeft_1", "isActive", false],
            ["IMG", "SubLocTopLeft_1", "curSrc", "@@curSrc@@"],
            ["IMG", "SubLocTopLeft_1", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["IMG", "SubLocTopLeft_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "SubLocTopLeft_1", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: true, lastState: "@@curSrc@@"}],
            ["IMG", "SubLocTopLeft_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: true, lastState: "@@curSrc@@"}],
            ["IMG", "SubLocTopLeft_1", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: true, lastState: "@@curSrc@@"}],
            ["IMG", "SubLocTopLeft_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "SubLocTopRight_1", "isActive", false],
            ["IMG", "SubLocTopRight_1", "curSrc", "@@curSrc@@"],
            ["IMG", "SubLocTopRight_1", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["IMG", "SubLocTopRight_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "SubLocTopRight_1", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: true, lastState: "@@curSrc@@"}],
            ["IMG", "SubLocTopRight_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: true, lastState: "@@curSrc@@"}],
            ["IMG", "SubLocTopRight_1", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: true, lastState: "@@curSrc@@"}],
            ["IMG", "SubLocTopRight_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "MapButton_Districts_1", "isActive", false],
            ["IMG", "MapButton_Districts_1", "curSrc", "both"],
            ["IMG", "MapButton_Districts_1", "activeSrc", "both"],
            ["IMG", "MapButton_Districts_1", "modes", "Active", {isForcedOn: null}],
            ["IMG", "MapButton_Districts_1", "modes", "Inactive", {isForcedOn: null}],
            ["IMG", "MapButton_Districts_1", "modes", "Daylighter", {isForcedOn: null}],
            ["IMG", "MapButton_Districts_1", "modes", "Downtime", {isForcedOn: null}],
            ["IMG", "MapButton_Districts_1", "modes", "Spotlight", {isForcedOn: null}],
            ["IMG", "MapButton_Districts_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "MapButton_Domain_1", "isActive", false],
            ["IMG", "MapButton_Domain_1", "curSrc", "anarch"],
            ["IMG", "MapButton_Domain_1", "activeSrc", "anarch"],
            ["IMG", "MapButton_Domain_1", "modes", "Active", {isForcedOn: null}],
            ["IMG", "MapButton_Domain_1", "modes", "Inactive", {isForcedOn: null}],
            ["IMG", "MapButton_Domain_1", "modes", "Daylighter", {isForcedOn: null}],
            ["IMG", "MapButton_Domain_1", "modes", "Downtime", {isForcedOn: null}],
            ["IMG", "MapButton_Domain_1", "modes", "Spotlight", {isForcedOn: null}],
            ["IMG", "MapButton_Domain_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "MapButton_Panel_1", "isActive", true],
            ["IMG", "MapButton_Panel_1", "curSrc", "closed"],
            ["IMG", "MapButton_Panel_1", "activeSrc", "closed"],
            ["IMG", "MapButton_Panel_1", "modes", "Active", {isForcedOn: null}],
            ["IMG", "MapButton_Panel_1", "modes", "Inactive", {isForcedOn: null}],
            ["IMG", "MapButton_Panel_1", "modes", "Daylighter", {isForcedOn: null}],
            ["IMG", "MapButton_Panel_1", "modes", "Downtime", {isForcedOn: null}],
            ["IMG", "MapButton_Panel_1", "modes", "Spotlight", {isForcedOn: null}],
            ["IMG", "MapButton_Panel_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "MapButton_Parks_1", "isActive", false],
            ["IMG", "MapButton_Parks_1", "curSrc", "on"],
            ["IMG", "MapButton_Parks_1", "activeSrc", "on"],
            ["IMG", "MapButton_Parks_1", "modes", "Active", {isForcedOn: null}],
            ["IMG", "MapButton_Parks_1", "modes", "Inactive", {isForcedOn: null}],
            ["IMG", "MapButton_Parks_1", "modes", "Daylighter", {isForcedOn: null}],
            ["IMG", "MapButton_Parks_1", "modes", "Downtime", {isForcedOn: null}],
            ["IMG", "MapButton_Parks_1", "modes", "Spotlight", {isForcedOn: null}],
            ["IMG", "MapButton_Parks_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "MapButton_Rack_1", "isActive", false],
            ["IMG", "MapButton_Rack_1", "curSrc", "on"],
            ["IMG", "MapButton_Rack_1", "activeSrc", "on"],
            ["IMG", "MapButton_Rack_1", "modes", "Active", {isForcedOn: null}],
            ["IMG", "MapButton_Rack_1", "modes", "Inactive", {isForcedOn: null}],
            ["IMG", "MapButton_Rack_1", "modes", "Daylighter", {isForcedOn: null}],
            ["IMG", "MapButton_Rack_1", "modes", "Downtime", {isForcedOn: null}],
            ["IMG", "MapButton_Rack_1", "modes", "Spotlight", {isForcedOn: null}],
            ["IMG", "MapButton_Rack_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "MapButton_Roads_1", "isActive", false],
            ["IMG", "MapButton_Roads_1", "curSrc", "on"],
            ["IMG", "MapButton_Roads_1", "activeSrc", "on"],
            ["IMG", "MapButton_Roads_1", "modes", "Active", {isForcedOn: null}],
            ["IMG", "MapButton_Roads_1", "modes", "Inactive", {isForcedOn: null}],
            ["IMG", "MapButton_Roads_1", "modes", "Daylighter", {isForcedOn: null}],
            ["IMG", "MapButton_Roads_1", "modes", "Downtime", {isForcedOn: null}],
            ["IMG", "MapButton_Roads_1", "modes", "Spotlight", {isForcedOn: null}],
            ["IMG", "MapButton_Roads_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "MapButton_SitesCulture_1", "isActive", false],
            ["IMG", "MapButton_SitesCulture_1", "curSrc", "on"],
            ["IMG", "MapButton_SitesCulture_1", "activeSrc", "on"],
            ["IMG", "MapButton_SitesCulture_1", "modes", "Active", {isForcedOn: null}],
            ["IMG", "MapButton_SitesCulture_1", "modes", "Inactive", {isForcedOn: null}],
            ["IMG", "MapButton_SitesCulture_1", "modes", "Daylighter", {isForcedOn: null}],
            ["IMG", "MapButton_SitesCulture_1", "modes", "Downtime", {isForcedOn: null}],
            ["IMG", "MapButton_SitesCulture_1", "modes", "Spotlight", {isForcedOn: null}],
            ["IMG", "MapButton_SitesCulture_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "MapButton_SitesEducation_1", "isActive", false],
            ["IMG", "MapButton_SitesEducation_1", "curSrc", "on"],
            ["IMG", "MapButton_SitesEducation_1", "activeSrc", "on"],
            ["IMG", "MapButton_SitesEducation_1", "modes", "Active", {isForcedOn: null}],
            ["IMG", "MapButton_SitesEducation_1", "modes", "Inactive", {isForcedOn: null}],
            ["IMG", "MapButton_SitesEducation_1", "modes", "Daylighter", {isForcedOn: null}],
            ["IMG", "MapButton_SitesEducation_1", "modes", "Downtime", {isForcedOn: null}],
            ["IMG", "MapButton_SitesEducation_1", "modes", "Spotlight", {isForcedOn: null}],
            ["IMG", "MapButton_SitesEducation_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "MapButton_SitesHavens_1", "isActive", false],
            ["IMG", "MapButton_SitesHavens_1", "curSrc", "on"],
            ["IMG", "MapButton_SitesHavens_1", "activeSrc", "on"],
            ["IMG", "MapButton_SitesHavens_1", "modes", "Active", {isForcedOn: null}],
            ["IMG", "MapButton_SitesHavens_1", "modes", "Inactive", {isForcedOn: null}],
            ["IMG", "MapButton_SitesHavens_1", "modes", "Daylighter", {isForcedOn: null}],
            ["IMG", "MapButton_SitesHavens_1", "modes", "Downtime", {isForcedOn: null}],
            ["IMG", "MapButton_SitesHavens_1", "modes", "Spotlight", {isForcedOn: null}],
            ["IMG", "MapButton_SitesHavens_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "MapButton_SitesHealth_1", "isActive", false],
            ["IMG", "MapButton_SitesHealth_1", "curSrc", "on"],
            ["IMG", "MapButton_SitesHealth_1", "activeSrc", "on"],
            ["IMG", "MapButton_SitesHealth_1", "modes", "Active", {isForcedOn: null}],
            ["IMG", "MapButton_SitesHealth_1", "modes", "Inactive", {isForcedOn: null}],
            ["IMG", "MapButton_SitesHealth_1", "modes", "Daylighter", {isForcedOn: null}],
            ["IMG", "MapButton_SitesHealth_1", "modes", "Downtime", {isForcedOn: null}],
            ["IMG", "MapButton_SitesHealth_1", "modes", "Spotlight", {isForcedOn: null}],
            ["IMG", "MapButton_SitesHealth_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "MapButton_SitesLandmarks_1", "isActive", false],
            ["IMG", "MapButton_SitesLandmarks_1", "curSrc", "on"],
            ["IMG", "MapButton_SitesLandmarks_1", "activeSrc", "on"],
            ["IMG", "MapButton_SitesLandmarks_1", "modes", "Active", {isForcedOn: null}],
            ["IMG", "MapButton_SitesLandmarks_1", "modes", "Inactive", {isForcedOn: null}],
            ["IMG", "MapButton_SitesLandmarks_1", "modes", "Daylighter", {isForcedOn: null}],
            ["IMG", "MapButton_SitesLandmarks_1", "modes", "Downtime", {isForcedOn: null}],
            ["IMG", "MapButton_SitesLandmarks_1", "modes", "Spotlight", {isForcedOn: null}],
            ["IMG", "MapButton_SitesLandmarks_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "MapButton_SitesNightlife_1", "isActive", false],
            ["IMG", "MapButton_SitesNightlife_1", "curSrc", "on"],
            ["IMG", "MapButton_SitesNightlife_1", "activeSrc", "on"],
            ["IMG", "MapButton_SitesNightlife_1", "modes", "Active", {isForcedOn: null}],
            ["IMG", "MapButton_SitesNightlife_1", "modes", "Inactive", {isForcedOn: null}],
            ["IMG", "MapButton_SitesNightlife_1", "modes", "Daylighter", {isForcedOn: null}],
            ["IMG", "MapButton_SitesNightlife_1", "modes", "Downtime", {isForcedOn: null}],
            ["IMG", "MapButton_SitesNightlife_1", "modes", "Spotlight", {isForcedOn: null}],
            ["IMG", "MapButton_SitesNightlife_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "MapButton_SitesShopping_1", "isActive", false],
            ["IMG", "MapButton_SitesShopping_1", "curSrc", "on"],
            ["IMG", "MapButton_SitesShopping_1", "activeSrc", "on"],
            ["IMG", "MapButton_SitesShopping_1", "modes", "Active", {isForcedOn: null}],
            ["IMG", "MapButton_SitesShopping_1", "modes", "Inactive", {isForcedOn: null}],
            ["IMG", "MapButton_SitesShopping_1", "modes", "Daylighter", {isForcedOn: null}],
            ["IMG", "MapButton_SitesShopping_1", "modes", "Downtime", {isForcedOn: null}],
            ["IMG", "MapButton_SitesShopping_1", "modes", "Spotlight", {isForcedOn: null}],
            ["IMG", "MapButton_SitesShopping_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "MapButton_SitesTransportation_1", "isActive", false],
            ["IMG", "MapButton_SitesTransportation_1", "curSrc", "on"],
            ["IMG", "MapButton_SitesTransportation_1", "activeSrc", "on"],
            ["IMG", "MapButton_SitesTransportation_1", "modes", "Active", {isForcedOn: null}],
            ["IMG", "MapButton_SitesTransportation_1", "modes", "Inactive", {isForcedOn: null}],
            ["IMG", "MapButton_SitesTransportation_1", "modes", "Daylighter", {isForcedOn: null}],
            ["IMG", "MapButton_SitesTransportation_1", "modes", "Downtime", {isForcedOn: null}],
            ["IMG", "MapButton_SitesTransportation_1", "modes", "Spotlight", {isForcedOn: null}],
            ["IMG", "MapButton_SitesTransportation_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "MapIndicator", "isActive", true],
            ["IMG", "MapIndicator", "curSrc", "ANIM"],
            ["IMG", "MapIndicator", "activeSrc", "ANIM"],
            ["IMG", "MapIndicator", "modes", "Active", {isForcedOn: true}],
            ["IMG", "MapIndicator", "modes", "Inactive", {isForcedOn: true}],
            ["IMG", "MapIndicator", "modes", "Daylighter", {isForcedOn: true}],
            ["IMG", "MapIndicator", "modes", "Downtime", {isForcedOn: true}],
            ["IMG", "MapIndicator", "modes", "Spotlight", {isForcedOn: true}],
            ["IMG", "MapIndicator", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "MapIndicator_Base_1", "isActive", true],
            ["IMG", "MapIndicator_Base_1", "curSrc", "base"],
            ["IMG", "MapIndicator_Base_1", "activeSrc", "base"],
            ["IMG", "MapIndicator_Base_1", "modes", "Active", {isForcedOn: true, isForcedState: "base", lastState: "base"}],
            ["IMG", "MapIndicator_Base_1", "modes", "Inactive", {isForcedOn: true, isForcedState: "base", lastState: "base"}],
            ["IMG", "MapIndicator_Base_1", "modes", "Daylighter", {isForcedOn: true, isForcedState: "base", lastState: "base"}],
            ["IMG", "MapIndicator_Base_1", "modes", "Downtime", {isForcedOn: true, isForcedState: "base", lastState: "base"}],
            ["IMG", "MapIndicator_Base_1", "modes", "Spotlight", {isForcedOn: true, isForcedState: "base", lastState: "base"}],
            ["IMG", "MapIndicator_Base_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "MapLayer_Base_1", "isActive", true],
            ["IMG", "MapLayer_Base_1", "curSrc", "base"],
            ["IMG", "MapLayer_Base_1", "activeSrc", "base"],
            ["IMG", "MapLayer_Base_1", "modes", "Active", {isForcedOn: true, isForcedState: "base", lastState: "base"}],
            ["IMG", "MapLayer_Base_1", "modes", "Inactive", {isForcedOn: true, isForcedState: "base", lastState: "base"}],
            ["IMG", "MapLayer_Base_1", "modes", "Daylighter", {isForcedOn: true, isForcedState: "base", lastState: "base"}],
            ["IMG", "MapLayer_Base_1", "modes", "Downtime", {isForcedOn: true, isForcedState: "base", lastState: "base"}],
            ["IMG", "MapLayer_Base_1", "modes", "Spotlight", {isForcedOn: true, isForcedState: "base", lastState: "base"}],
            ["IMG", "MapLayer_Base_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "MapLayer_Districts_1", "isActive", true],
            ["IMG", "MapLayer_Districts_1", "curSrc", "base"],
            ["IMG", "MapLayer_Districts_1", "activeSrc", "base"],
            ["IMG", "MapLayer_Districts_1", "modes", "Active", {isForcedOn: null}],
            ["IMG", "MapLayer_Districts_1", "modes", "Inactive", {isForcedOn: null}],
            ["IMG", "MapLayer_Districts_1", "modes", "Daylighter", {isForcedOn: null}],
            ["IMG", "MapLayer_Districts_1", "modes", "Downtime", {isForcedOn: null}],
            ["IMG", "MapLayer_Districts_1", "modes", "Spotlight", {isForcedOn: null}],
            ["IMG", "MapLayer_Districts_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "MapLayer_DistrictsFill_1", "isActive", true],
            ["IMG", "MapLayer_DistrictsFill_1", "curSrc", "base"],
            ["IMG", "MapLayer_DistrictsFill_1", "activeSrc", "base"],
            ["IMG", "MapLayer_DistrictsFill_1", "modes", "Active", {isForcedOn: null}],
            ["IMG", "MapLayer_DistrictsFill_1", "modes", "Inactive", {isForcedOn: null}],
            ["IMG", "MapLayer_DistrictsFill_1", "modes", "Daylighter", {isForcedOn: null}],
            ["IMG", "MapLayer_DistrictsFill_1", "modes", "Downtime", {isForcedOn: null}],
            ["IMG", "MapLayer_DistrictsFill_1", "modes", "Spotlight", {isForcedOn: null}],
            ["IMG", "MapLayer_DistrictsFill_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "MapLayer_Domain_1", "isActive", true],
            ["IMG", "MapLayer_Domain_1", "curSrc", "anarch"],
            ["IMG", "MapLayer_Domain_1", "activeSrc", "anarch"],
            ["IMG", "MapLayer_Domain_1", "modes", "Active", {isForcedOn: null}],
            ["IMG", "MapLayer_Domain_1", "modes", "Inactive", {isForcedOn: null}],
            ["IMG", "MapLayer_Domain_1", "modes", "Daylighter", {isForcedOn: null}],
            ["IMG", "MapLayer_Domain_1", "modes", "Downtime", {isForcedOn: null}],
            ["IMG", "MapLayer_Domain_1", "modes", "Spotlight", {isForcedOn: null}],
            ["IMG", "MapLayer_Domain_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "MapLayer_Parks_1", "isActive", true],
            ["IMG", "MapLayer_Parks_1", "curSrc", "base"],
            ["IMG", "MapLayer_Parks_1", "activeSrc", "base"],
            ["IMG", "MapLayer_Parks_1", "modes", "Active", {isForcedOn: null}],
            ["IMG", "MapLayer_Parks_1", "modes", "Inactive", {isForcedOn: null}],
            ["IMG", "MapLayer_Parks_1", "modes", "Daylighter", {isForcedOn: null}],
            ["IMG", "MapLayer_Parks_1", "modes", "Downtime", {isForcedOn: null}],
            ["IMG", "MapLayer_Parks_1", "modes", "Spotlight", {isForcedOn: null}],
            ["IMG", "MapLayer_Parks_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "MapLayer_Rack_1", "isActive", true],
            ["IMG", "MapLayer_Rack_1", "curSrc", "base"],
            ["IMG", "MapLayer_Rack_1", "activeSrc", "base"],
            ["IMG", "MapLayer_Rack_1", "modes", "Active", {isForcedOn: null}],
            ["IMG", "MapLayer_Rack_1", "modes", "Inactive", {isForcedOn: null}],
            ["IMG", "MapLayer_Rack_1", "modes", "Daylighter", {isForcedOn: null}],
            ["IMG", "MapLayer_Rack_1", "modes", "Downtime", {isForcedOn: null}],
            ["IMG", "MapLayer_Rack_1", "modes", "Spotlight", {isForcedOn: null}],
            ["IMG", "MapLayer_Rack_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "MapLayer_Roads_1", "isActive", true],
            ["IMG", "MapLayer_Roads_1", "curSrc", "base"],
            ["IMG", "MapLayer_Roads_1", "activeSrc", "base"],
            ["IMG", "MapLayer_Roads_1", "modes", "Active", {isForcedOn: null}],
            ["IMG", "MapLayer_Roads_1", "modes", "Inactive", {isForcedOn: null}],
            ["IMG", "MapLayer_Roads_1", "modes", "Daylighter", {isForcedOn: null}],
            ["IMG", "MapLayer_Roads_1", "modes", "Downtime", {isForcedOn: null}],
            ["IMG", "MapLayer_Roads_1", "modes", "Spotlight", {isForcedOn: null}],
            ["IMG", "MapLayer_Roads_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesCulture_1", "isActive", true],
            ["IMG", "MapLayer_SitesCulture_1", "curSrc", "base"],
            ["IMG", "MapLayer_SitesCulture_1", "activeSrc", "base"],
            ["IMG", "MapLayer_SitesCulture_1", "modes", "Active", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesCulture_1", "modes", "Inactive", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesCulture_1", "modes", "Daylighter", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesCulture_1", "modes", "Downtime", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesCulture_1", "modes", "Spotlight", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesCulture_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesEducation_1", "isActive", true],
            ["IMG", "MapLayer_SitesEducation_1", "curSrc", "base"],
            ["IMG", "MapLayer_SitesEducation_1", "activeSrc", "base"],
            ["IMG", "MapLayer_SitesEducation_1", "modes", "Active", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesEducation_1", "modes", "Inactive", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesEducation_1", "modes", "Daylighter", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesEducation_1", "modes", "Downtime", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesEducation_1", "modes", "Spotlight", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesEducation_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesHavens_1", "isActive", true],
            ["IMG", "MapLayer_SitesHavens_1", "curSrc", "base"],
            ["IMG", "MapLayer_SitesHavens_1", "activeSrc", "base"],
            ["IMG", "MapLayer_SitesHavens_1", "modes", "Active", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesHavens_1", "modes", "Inactive", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesHavens_1", "modes", "Daylighter", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesHavens_1", "modes", "Downtime", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesHavens_1", "modes", "Spotlight", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesHavens_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesHealth_1", "isActive", true],
            ["IMG", "MapLayer_SitesHealth_1", "curSrc", "base"],
            ["IMG", "MapLayer_SitesHealth_1", "activeSrc", "base"],
            ["IMG", "MapLayer_SitesHealth_1", "modes", "Active", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesHealth_1", "modes", "Inactive", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesHealth_1", "modes", "Daylighter", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesHealth_1", "modes", "Downtime", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesHealth_1", "modes", "Spotlight", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesHealth_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesLandmarks_1", "isActive", true],
            ["IMG", "MapLayer_SitesLandmarks_1", "curSrc", "base"],
            ["IMG", "MapLayer_SitesLandmarks_1", "activeSrc", "base"],
            ["IMG", "MapLayer_SitesLandmarks_1", "modes", "Active", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesLandmarks_1", "modes", "Inactive", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesLandmarks_1", "modes", "Daylighter", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesLandmarks_1", "modes", "Downtime", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesLandmarks_1", "modes", "Spotlight", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesLandmarks_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesNightlife_1", "isActive", true],
            ["IMG", "MapLayer_SitesNightlife_1", "curSrc", "base"],
            ["IMG", "MapLayer_SitesNightlife_1", "activeSrc", "base"],
            ["IMG", "MapLayer_SitesNightlife_1", "modes", "Active", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesNightlife_1", "modes", "Inactive", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesNightlife_1", "modes", "Daylighter", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesNightlife_1", "modes", "Downtime", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesNightlife_1", "modes", "Spotlight", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesNightlife_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesShopping_1", "isActive", true],
            ["IMG", "MapLayer_SitesShopping_1", "curSrc", "base"],
            ["IMG", "MapLayer_SitesShopping_1", "activeSrc", "base"],
            ["IMG", "MapLayer_SitesShopping_1", "modes", "Active", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesShopping_1", "modes", "Inactive", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesShopping_1", "modes", "Daylighter", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesShopping_1", "modes", "Downtime", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesShopping_1", "modes", "Spotlight", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesShopping_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesTransportation_1", "isActive", true],
            ["IMG", "MapLayer_SitesTransportation_1", "curSrc", "base"],
            ["IMG", "MapLayer_SitesTransportation_1", "activeSrc", "base"],
            ["IMG", "MapLayer_SitesTransportation_1", "modes", "Active", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesTransportation_1", "modes", "Inactive", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesTransportation_1", "modes", "Daylighter", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesTransportation_1", "modes", "Downtime", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesTransportation_1", "modes", "Spotlight", {isForcedOn: null}],
            ["IMG", "MapLayer_SitesTransportation_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RisingMoon_1", "isActive", false],
            ["IMG", "RisingMoon_1", "curSrc", "base"],
            ["IMG", "RisingMoon_1", "activeSrc", "base"],
            ["IMG", "RisingMoon_1", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "RisingMoon_1", "modes", "Inactive", {isForcedOn: true, isForcedState: "base", lastState: "base"}],
            ["IMG", "RisingMoon_1", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "RisingMoon_1", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "RisingMoon_1", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "RisingMoon_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "Spotlight_1", "isActive", false],
            ["IMG", "Spotlight_1", "curSrc", "@@curSrc@@"],
            ["IMG", "Spotlight_1", "modes", "Active", {isForcedOn: "NEVER"}],
            ["IMG", "Spotlight_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "Spotlight_1", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "Spotlight_1", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "Spotlight_1", "modes", "Spotlight", {isForcedOn: true, isForcedState: "LAST", lastState: "@@curSrc@@"}],
            ["IMG", "Spotlight_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "HungerBotLeft_1", "isActive", true],
            ["IMG", "HungerBotLeft_1", "curSrc", "@@curSrc@@"],
            ["IMG", "HungerBotLeft_1", "modes", "Active", {isForcedOn: true}],
            ["IMG", "HungerBotLeft_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "HungerBotLeft_1", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "HungerBotLeft_1", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "HungerBotLeft_1", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "HungerBotLeft_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "HungerBotRight_1", "isActive", true],
            ["IMG", "HungerBotRight_1", "curSrc", "@@curSrc@@"],
            ["IMG", "HungerBotRight_1", "modes", "Active", {isForcedOn: true}],
            ["IMG", "HungerBotRight_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "HungerBotRight_1", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "HungerBotRight_1", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "HungerBotRight_1", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "HungerBotRight_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "HungerTopLeft_1", "isActive", true],
            ["IMG", "HungerTopLeft_1", "curSrc", "@@curSrc@@"],
            ["IMG", "HungerTopLeft_1", "modes", "Active", {isForcedOn: true}],
            ["IMG", "HungerTopLeft_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "HungerTopLeft_1", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "HungerTopLeft_1", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "HungerTopLeft_1", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "HungerTopLeft_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "HungerTopRight_1", "isActive", true],
            ["IMG", "HungerTopRight_1", "curSrc", "@@curSrc@@"],
            ["IMG", "HungerTopRight_1", "modes", "Active", {isForcedOn: true}],
            ["IMG", "HungerTopRight_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "HungerTopRight_1", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "HungerTopRight_1", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "HungerTopRight_1", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "HungerTopRight_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "SignalLightBotLeft_1", "isActive", true],
            ["IMG", "SignalLightBotLeft_1", "curSrc", "off"],
            ["IMG", "SignalLightBotLeft_1", "activeSrc", "off"],
            ["IMG", "SignalLightBotLeft_1", "modes", "Active", {isForcedOn: true, isForcedState: "off", lastState: "off"}],
            ["IMG", "SignalLightBotLeft_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "SignalLightBotLeft_1", "modes", "Daylighter", {isForcedOn: true, isForcedState: "off", lastState: "off"}],
            ["IMG", "SignalLightBotLeft_1", "modes", "Downtime", {isForcedOn: true, isForcedState: "off", lastState: "off"}],
            ["IMG", "SignalLightBotLeft_1", "modes", "Spotlight", {isForcedOn: true, isForcedState: "off", lastState: "off"}],
            ["IMG", "SignalLightBotLeft_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "SignalLightBotRight_1", "isActive", true],
            ["IMG", "SignalLightBotRight_1", "curSrc", "off"],
            ["IMG", "SignalLightBotRight_1", "activeSrc", "off"],
            ["IMG", "SignalLightBotRight_1", "modes", "Active", {isForcedOn: true, isForcedState: "off", lastState: "off"}],
            ["IMG", "SignalLightBotRight_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "SignalLightBotRight_1", "modes", "Daylighter", {isForcedOn: true, isForcedState: "off", lastState: "off"}],
            ["IMG", "SignalLightBotRight_1", "modes", "Downtime", {isForcedOn: true, isForcedState: "off", lastState: "off"}],
            ["IMG", "SignalLightBotRight_1", "modes", "Spotlight", {isForcedOn: true, isForcedState: "off", lastState: "off"}],
            ["IMG", "SignalLightBotRight_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "SignalLightTopLeft_1", "isActive", true],
            ["IMG", "SignalLightTopLeft_1", "curSrc", "off"],
            ["IMG", "SignalLightTopLeft_1", "activeSrc", "off"],
            ["IMG", "SignalLightTopLeft_1", "modes", "Active", {isForcedOn: true, isForcedState: "off", lastState: "off"}],
            ["IMG", "SignalLightTopLeft_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "SignalLightTopLeft_1", "modes", "Daylighter", {isForcedOn: true, isForcedState: "off", lastState: "off"}],
            ["IMG", "SignalLightTopLeft_1", "modes", "Downtime", {isForcedOn: true, isForcedState: "off", lastState: "off"}],
            ["IMG", "SignalLightTopLeft_1", "modes", "Spotlight", {isForcedOn: true, isForcedState: "off", lastState: "off"}],
            ["IMG", "SignalLightTopLeft_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "SignalLightTopRight_1", "isActive", true],
            ["IMG", "SignalLightTopRight_1", "curSrc", "off"],
            ["IMG", "SignalLightTopRight_1", "activeSrc", "off"],
            ["IMG", "SignalLightTopRight_1", "modes", "Active", {isForcedOn: true, isForcedState: "off", lastState: "off"}],
            ["IMG", "SignalLightTopRight_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "SignalLightTopRight_1", "modes", "Daylighter", {isForcedOn: true, isForcedState: "off", lastState: "off"}],
            ["IMG", "SignalLightTopRight_1", "modes", "Downtime", {isForcedOn: true, isForcedState: "off", lastState: "off"}],
            ["IMG", "SignalLightTopRight_1", "modes", "Spotlight", {isForcedOn: true, isForcedState: "off", lastState: "off"}],
            ["IMG", "SignalLightTopRight_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "Roller_WPReroller_1", "isActive", false],
            ["IMG", "Roller_WPReroller_1", "curSrc", "ANIM"],
            ["IMG", "Roller_WPReroller_1", "activeSrc", "ANIM"],
            ["IMG", "Roller_WPReroller_1", "modes", "Active", {isForcedOn: "LAST", lastActive: false}],
            ["IMG", "Roller_WPReroller_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "Roller_WPReroller_1", "modes", "Daylighter", {isForcedOn: "LAST", lastActive: false}],
            ["IMG", "Roller_WPReroller_1", "modes", "Downtime", {isForcedOn: "LAST", lastActive: false}],
            ["IMG", "Roller_WPReroller_1", "modes", "Spotlight", {isForcedOn: "LAST", lastActive: false}],
            ["IMG", "Roller_WPReroller_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "Roller_WPReroller_2", "isActive", false],
            ["IMG", "Roller_WPReroller_2", "curSrc", "ANIM"],
            ["IMG", "Roller_WPReroller_2", "activeSrc", "ANIM"],
            ["IMG", "Roller_WPReroller_2", "modes", "Active", {isForcedOn: "LAST", lastActive: false}],
            ["IMG", "Roller_WPReroller_2", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "Roller_WPReroller_2", "modes", "Daylighter", {isForcedOn: "LAST", lastActive: false}],
            ["IMG", "Roller_WPReroller_2", "modes", "Downtime", {isForcedOn: "LAST", lastActive: false}],
            ["IMG", "Roller_WPReroller_2", "modes", "Spotlight", {isForcedOn: "LAST", lastActive: false}],
            ["IMG", "Roller_WPReroller_2", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "Roller_WPReroller_Base_1", "isActive", false],
            ["IMG", "Roller_WPReroller_Base_1", "curSrc", "base"],
            ["IMG", "Roller_WPReroller_Base_1", "activeSrc", "base"],
            ["IMG", "Roller_WPReroller_Base_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "Roller_WPReroller_Base_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "Roller_WPReroller_Base_1", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "Roller_WPReroller_Base_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "Roller_WPReroller_Base_1", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "Roller_WPReroller_Base_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "Roller_WPReroller_Base_2", "isActive", false],
            ["IMG", "Roller_WPReroller_Base_2", "curSrc", "base"],
            ["IMG", "Roller_WPReroller_Base_2", "activeSrc", "base"],
            ["IMG", "Roller_WPReroller_Base_2", "modes", "Active", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "Roller_WPReroller_Base_2", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "Roller_WPReroller_Base_2", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "Roller_WPReroller_Base_2", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "Roller_WPReroller_Base_2", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "Roller_WPReroller_Base_2", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerDie_Big_1", "isActive", false],
            ["IMG", "RollerDie_Big_1", "curSrc", "@@curSrc@@"],
            ["IMG", "RollerDie_Big_1", "modes", "Active", {isForcedOn: "LAST", lastActive: false}],
            ["IMG", "RollerDie_Big_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerDie_Big_1", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Big_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Big_1", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Big_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerDie_Big_2", "isActive", false],
            ["IMG", "RollerDie_Big_2", "curSrc", "@@curSrc@@"],
            ["IMG", "RollerDie_Big_2", "modes", "Active", {isForcedOn: "LAST", lastActive: false}],
            ["IMG", "RollerDie_Big_2", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerDie_Big_2", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Big_2", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Big_2", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Big_2", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerDie_Main_1", "isActive", false],
            ["IMG", "RollerDie_Main_1", "curSrc", "@@curSrc@@"],
            ["IMG", "RollerDie_Main_1", "modes", "Active", {isForcedOn: "LAST", lastActive: false}],
            ["IMG", "RollerDie_Main_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerDie_Main_1", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_1", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerDie_Main_10", "isActive", false],
            ["IMG", "RollerDie_Main_10", "curSrc", "@@curSrc@@"],
            ["IMG", "RollerDie_Main_10", "modes", "Active", {isForcedOn: "LAST", lastActive: false}],
            ["IMG", "RollerDie_Main_10", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerDie_Main_10", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_10", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_10", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_10", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerDie_Main_11", "isActive", false],
            ["IMG", "RollerDie_Main_11", "curSrc", "@@curSrc@@"],
            ["IMG", "RollerDie_Main_11", "modes", "Active", {isForcedOn: "LAST", lastActive: false}],
            ["IMG", "RollerDie_Main_11", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerDie_Main_11", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_11", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_11", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_11", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerDie_Main_12", "isActive", false],
            ["IMG", "RollerDie_Main_12", "curSrc", "@@curSrc@@"],
            ["IMG", "RollerDie_Main_12", "modes", "Active", {isForcedOn: "LAST", lastActive: false}],
            ["IMG", "RollerDie_Main_12", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerDie_Main_12", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_12", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_12", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_12", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerDie_Main_13", "isActive", false],
            ["IMG", "RollerDie_Main_13", "curSrc", "@@curSrc@@"],
            ["IMG", "RollerDie_Main_13", "modes", "Active", {isForcedOn: "LAST", lastActive: false}],
            ["IMG", "RollerDie_Main_13", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerDie_Main_13", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_13", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_13", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_13", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerDie_Main_14", "isActive", false],
            ["IMG", "RollerDie_Main_14", "curSrc", "@@curSrc@@"],
            ["IMG", "RollerDie_Main_14", "modes", "Active", {isForcedOn: "LAST", lastActive: false}],
            ["IMG", "RollerDie_Main_14", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerDie_Main_14", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_14", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_14", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_14", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerDie_Main_15", "isActive", false],
            ["IMG", "RollerDie_Main_15", "curSrc", "@@curSrc@@"],
            ["IMG", "RollerDie_Main_15", "modes", "Active", {isForcedOn: "LAST", lastActive: false}],
            ["IMG", "RollerDie_Main_15", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerDie_Main_15", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_15", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_15", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_15", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerDie_Main_16", "isActive", false],
            ["IMG", "RollerDie_Main_16", "curSrc", "@@curSrc@@"],
            ["IMG", "RollerDie_Main_16", "modes", "Active", {isForcedOn: "LAST", lastActive: false}],
            ["IMG", "RollerDie_Main_16", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerDie_Main_16", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_16", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_16", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_16", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerDie_Main_17", "isActive", false],
            ["IMG", "RollerDie_Main_17", "curSrc", "@@curSrc@@"],
            ["IMG", "RollerDie_Main_17", "modes", "Active", {isForcedOn: "LAST", lastActive: false}],
            ["IMG", "RollerDie_Main_17", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerDie_Main_17", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_17", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_17", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_17", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerDie_Main_18", "isActive", false],
            ["IMG", "RollerDie_Main_18", "curSrc", "@@curSrc@@"],
            ["IMG", "RollerDie_Main_18", "modes", "Active", {isForcedOn: "LAST", lastActive: false}],
            ["IMG", "RollerDie_Main_18", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerDie_Main_18", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_18", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_18", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_18", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerDie_Main_19", "isActive", false],
            ["IMG", "RollerDie_Main_19", "curSrc", "@@curSrc@@"],
            ["IMG", "RollerDie_Main_19", "modes", "Active", {isForcedOn: "LAST", lastActive: false}],
            ["IMG", "RollerDie_Main_19", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerDie_Main_19", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_19", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_19", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_19", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerDie_Main_2", "isActive", false],
            ["IMG", "RollerDie_Main_2", "curSrc", "@@curSrc@@"],
            ["IMG", "RollerDie_Main_2", "modes", "Active", {isForcedOn: "LAST", lastActive: false}],
            ["IMG", "RollerDie_Main_2", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerDie_Main_2", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_2", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_2", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_2", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerDie_Main_20", "isActive", false],
            ["IMG", "RollerDie_Main_20", "curSrc", "@@curSrc@@"],
            ["IMG", "RollerDie_Main_20", "modes", "Active", {isForcedOn: "LAST", lastActive: false}],
            ["IMG", "RollerDie_Main_20", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerDie_Main_20", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_20", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_20", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_20", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerDie_Main_21", "isActive", false],
            ["IMG", "RollerDie_Main_21", "curSrc", "@@curSrc@@"],
            ["IMG", "RollerDie_Main_21", "modes", "Active", {isForcedOn: "LAST", lastActive: false}],
            ["IMG", "RollerDie_Main_21", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerDie_Main_21", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_21", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_21", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_21", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerDie_Main_22", "isActive", false],
            ["IMG", "RollerDie_Main_22", "curSrc", "@@curSrc@@"],
            ["IMG", "RollerDie_Main_22", "modes", "Active", {isForcedOn: "LAST", lastActive: false}],
            ["IMG", "RollerDie_Main_22", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerDie_Main_22", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_22", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_22", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_22", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerDie_Main_23", "isActive", false],
            ["IMG", "RollerDie_Main_23", "curSrc", "@@curSrc@@"],
            ["IMG", "RollerDie_Main_23", "modes", "Active", {isForcedOn: "LAST", lastActive: false}],
            ["IMG", "RollerDie_Main_23", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerDie_Main_23", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_23", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_23", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_23", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerDie_Main_24", "isActive", false],
            ["IMG", "RollerDie_Main_24", "curSrc", "@@curSrc@@"],
            ["IMG", "RollerDie_Main_24", "modes", "Active", {isForcedOn: "LAST", lastActive: false}],
            ["IMG", "RollerDie_Main_24", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerDie_Main_24", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_24", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_24", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_24", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerDie_Main_25", "isActive", false],
            ["IMG", "RollerDie_Main_25", "curSrc", "@@curSrc@@"],
            ["IMG", "RollerDie_Main_25", "modes", "Active", {isForcedOn: "LAST", lastActive: false}],
            ["IMG", "RollerDie_Main_25", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerDie_Main_25", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_25", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_25", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_25", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerDie_Main_26", "isActive", false],
            ["IMG", "RollerDie_Main_26", "curSrc", "@@curSrc@@"],
            ["IMG", "RollerDie_Main_26", "modes", "Active", {isForcedOn: "LAST", lastActive: false}],
            ["IMG", "RollerDie_Main_26", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerDie_Main_26", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_26", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_26", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_26", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerDie_Main_27", "isActive", false],
            ["IMG", "RollerDie_Main_27", "curSrc", "@@curSrc@@"],
            ["IMG", "RollerDie_Main_27", "modes", "Active", {isForcedOn: "LAST", lastActive: false}],
            ["IMG", "RollerDie_Main_27", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerDie_Main_27", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_27", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_27", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_27", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerDie_Main_28", "isActive", false],
            ["IMG", "RollerDie_Main_28", "curSrc", "@@curSrc@@"],
            ["IMG", "RollerDie_Main_28", "modes", "Active", {isForcedOn: "LAST", lastActive: false}],
            ["IMG", "RollerDie_Main_28", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerDie_Main_28", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_28", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_28", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_28", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerDie_Main_29", "isActive", false],
            ["IMG", "RollerDie_Main_29", "curSrc", "@@curSrc@@"],
            ["IMG", "RollerDie_Main_29", "modes", "Active", {isForcedOn: "LAST", lastActive: false}],
            ["IMG", "RollerDie_Main_29", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerDie_Main_29", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_29", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_29", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_29", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerDie_Main_3", "isActive", false],
            ["IMG", "RollerDie_Main_3", "curSrc", "@@curSrc@@"],
            ["IMG", "RollerDie_Main_3", "modes", "Active", {isForcedOn: "LAST", lastActive: false}],
            ["IMG", "RollerDie_Main_3", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerDie_Main_3", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_3", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_3", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_3", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerDie_Main_30", "isActive", false],
            ["IMG", "RollerDie_Main_30", "curSrc", "@@curSrc@@"],
            ["IMG", "RollerDie_Main_30", "modes", "Active", {isForcedOn: "LAST", lastActive: false}],
            ["IMG", "RollerDie_Main_30", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerDie_Main_30", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_30", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_30", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_30", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerDie_Main_4", "isActive", false],
            ["IMG", "RollerDie_Main_4", "curSrc", "@@curSrc@@"],
            ["IMG", "RollerDie_Main_4", "modes", "Active", {isForcedOn: "LAST", lastActive: false}],
            ["IMG", "RollerDie_Main_4", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerDie_Main_4", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_4", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_4", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_4", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerDie_Main_5", "isActive", false],
            ["IMG", "RollerDie_Main_5", "curSrc", "@@curSrc@@"],
            ["IMG", "RollerDie_Main_5", "modes", "Active", {isForcedOn: "LAST", lastActive: false}],
            ["IMG", "RollerDie_Main_5", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerDie_Main_5", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_5", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_5", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_5", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerDie_Main_6", "isActive", false],
            ["IMG", "RollerDie_Main_6", "curSrc", "@@curSrc@@"],
            ["IMG", "RollerDie_Main_6", "modes", "Active", {isForcedOn: "LAST", lastActive: false}],
            ["IMG", "RollerDie_Main_6", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerDie_Main_6", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_6", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_6", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_6", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerDie_Main_7", "isActive", false],
            ["IMG", "RollerDie_Main_7", "curSrc", "@@curSrc@@"],
            ["IMG", "RollerDie_Main_7", "modes", "Active", {isForcedOn: "LAST", lastActive: false}],
            ["IMG", "RollerDie_Main_7", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerDie_Main_7", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_7", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_7", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_7", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerDie_Main_8", "isActive", false],
            ["IMG", "RollerDie_Main_8", "curSrc", "@@curSrc@@"],
            ["IMG", "RollerDie_Main_8", "modes", "Active", {isForcedOn: "LAST", lastActive: false}],
            ["IMG", "RollerDie_Main_8", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerDie_Main_8", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_8", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_8", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_8", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerDie_Main_9", "isActive", false],
            ["IMG", "RollerDie_Main_9", "curSrc", "@@curSrc@@"],
            ["IMG", "RollerDie_Main_9", "modes", "Active", {isForcedOn: "LAST", lastActive: false}],
            ["IMG", "RollerDie_Main_9", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerDie_Main_9", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_9", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_9", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "LAST", lastActive: false, lastState: "@@curSrc@@"}],
            ["IMG", "RollerDie_Main_9", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerFrame_BottomEnd_1", "isActive", false],
            ["IMG", "RollerFrame_BottomEnd_1", "curSrc", "base"],
            ["IMG", "RollerFrame_BottomEnd_1", "activeSrc", "base"],
            ["IMG", "RollerFrame_BottomEnd_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_BottomEnd_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerFrame_BottomEnd_1", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_BottomEnd_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_BottomEnd_1", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_BottomEnd_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerFrame_BottomMid_1", "isActive", false],
            ["IMG", "RollerFrame_BottomMid_1", "curSrc", "base"],
            ["IMG", "RollerFrame_BottomMid_1", "activeSrc", "base"],
            ["IMG", "RollerFrame_BottomMid_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_BottomMid_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerFrame_BottomMid_1", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_BottomMid_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_BottomMid_1", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_BottomMid_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerFrame_BottomMid_2", "isActive", false],
            ["IMG", "RollerFrame_BottomMid_2", "curSrc", "base"],
            ["IMG", "RollerFrame_BottomMid_2", "activeSrc", "base"],
            ["IMG", "RollerFrame_BottomMid_2", "modes", "Active", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_BottomMid_2", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerFrame_BottomMid_2", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_BottomMid_2", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_BottomMid_2", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_BottomMid_2", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerFrame_BottomMid_3", "isActive", false],
            ["IMG", "RollerFrame_BottomMid_3", "curSrc", "base"],
            ["IMG", "RollerFrame_BottomMid_3", "activeSrc", "base"],
            ["IMG", "RollerFrame_BottomMid_3", "modes", "Active", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_BottomMid_3", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerFrame_BottomMid_3", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_BottomMid_3", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_BottomMid_3", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_BottomMid_3", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerFrame_BottomMid_4", "isActive", false],
            ["IMG", "RollerFrame_BottomMid_4", "curSrc", "base"],
            ["IMG", "RollerFrame_BottomMid_4", "activeSrc", "base"],
            ["IMG", "RollerFrame_BottomMid_4", "modes", "Active", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_BottomMid_4", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerFrame_BottomMid_4", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_BottomMid_4", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_BottomMid_4", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_BottomMid_4", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerFrame_BottomMid_5", "isActive", false],
            ["IMG", "RollerFrame_BottomMid_5", "curSrc", "base"],
            ["IMG", "RollerFrame_BottomMid_5", "activeSrc", "base"],
            ["IMG", "RollerFrame_BottomMid_5", "modes", "Active", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_BottomMid_5", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerFrame_BottomMid_5", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_BottomMid_5", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_BottomMid_5", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_BottomMid_5", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerFrame_BottomMid_6", "isActive", false],
            ["IMG", "RollerFrame_BottomMid_6", "curSrc", "base"],
            ["IMG", "RollerFrame_BottomMid_6", "activeSrc", "base"],
            ["IMG", "RollerFrame_BottomMid_6", "modes", "Active", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_BottomMid_6", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerFrame_BottomMid_6", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_BottomMid_6", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_BottomMid_6", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_BottomMid_6", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerFrame_BottomMid_7", "isActive", false],
            ["IMG", "RollerFrame_BottomMid_7", "curSrc", "base"],
            ["IMG", "RollerFrame_BottomMid_7", "activeSrc", "base"],
            ["IMG", "RollerFrame_BottomMid_7", "modes", "Active", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_BottomMid_7", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerFrame_BottomMid_7", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_BottomMid_7", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_BottomMid_7", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_BottomMid_7", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerFrame_BottomMid_8", "isActive", false],
            ["IMG", "RollerFrame_BottomMid_8", "curSrc", "base"],
            ["IMG", "RollerFrame_BottomMid_8", "activeSrc", "base"],
            ["IMG", "RollerFrame_BottomMid_8", "modes", "Active", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_BottomMid_8", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerFrame_BottomMid_8", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_BottomMid_8", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_BottomMid_8", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_BottomMid_8", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerFrame_BottomMid_9", "isActive", false],
            ["IMG", "RollerFrame_BottomMid_9", "curSrc", "base"],
            ["IMG", "RollerFrame_BottomMid_9", "activeSrc", "base"],
            ["IMG", "RollerFrame_BottomMid_9", "modes", "Active", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_BottomMid_9", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerFrame_BottomMid_9", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_BottomMid_9", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_BottomMid_9", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_BottomMid_9", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerFrame_Diff_1", "isActive", false],
            ["IMG", "RollerFrame_Diff_1", "curSrc", "base"],
            ["IMG", "RollerFrame_Diff_1", "activeSrc", "base"],
            ["IMG", "RollerFrame_Diff_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_Diff_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerFrame_Diff_1", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_Diff_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_Diff_1", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_Diff_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerFrame_Left_1", "isActive", true],
            ["IMG", "RollerFrame_Left_1", "curSrc", "top"],
            ["IMG", "RollerFrame_Left_1", "activeSrc", "top"],
            ["IMG", "RollerFrame_Left_1", "modes", "Active", {isForcedOn: true, isForcedState: "LAST", lastState: "top"}],
            ["IMG", "RollerFrame_Left_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerFrame_Left_1", "modes", "Daylighter", {isForcedOn: true, isForcedState: "top", lastState: "top"}],
            ["IMG", "RollerFrame_Left_1", "modes", "Downtime", {isForcedOn: true, isForcedState: "top", lastState: "top"}],
            ["IMG", "RollerFrame_Left_1", "modes", "Spotlight", {isForcedOn: true, isForcedState: "top", lastState: "top"}],
            ["IMG", "RollerFrame_Left_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerFrame_TopEnd_1", "isActive", true],
            ["IMG", "RollerFrame_TopEnd_1", "curSrc", "base"],
            ["IMG", "RollerFrame_TopEnd_1", "activeSrc", "base"],
            ["IMG", "RollerFrame_TopEnd_1", "modes", "Active", {isForcedOn: true, isForcedState: "base", lastState: "base"}],
            ["IMG", "RollerFrame_TopEnd_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerFrame_TopEnd_1", "modes", "Daylighter", {isForcedOn: true, isForcedState: "base", lastState: "base"}],
            ["IMG", "RollerFrame_TopEnd_1", "modes", "Downtime", {isForcedOn: true, isForcedState: "base", lastState: "base"}],
            ["IMG", "RollerFrame_TopEnd_1", "modes", "Spotlight", {isForcedOn: true, isForcedState: "base", lastState: "base"}],
            ["IMG", "RollerFrame_TopEnd_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerFrame_TopMid_1", "isActive", false],
            ["IMG", "RollerFrame_TopMid_1", "curSrc", "base"],
            ["IMG", "RollerFrame_TopMid_1", "activeSrc", "base"],
            ["IMG", "RollerFrame_TopMid_1", "modes", "Active", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_TopMid_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerFrame_TopMid_1", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_TopMid_1", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_TopMid_1", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_TopMid_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerFrame_TopMid_2", "isActive", false],
            ["IMG", "RollerFrame_TopMid_2", "curSrc", "base"],
            ["IMG", "RollerFrame_TopMid_2", "activeSrc", "base"],
            ["IMG", "RollerFrame_TopMid_2", "modes", "Active", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_TopMid_2", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerFrame_TopMid_2", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_TopMid_2", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_TopMid_2", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_TopMid_2", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerFrame_TopMid_3", "isActive", false],
            ["IMG", "RollerFrame_TopMid_3", "curSrc", "base"],
            ["IMG", "RollerFrame_TopMid_3", "activeSrc", "base"],
            ["IMG", "RollerFrame_TopMid_3", "modes", "Active", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_TopMid_3", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerFrame_TopMid_3", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_TopMid_3", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_TopMid_3", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_TopMid_3", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerFrame_TopMid_4", "isActive", false],
            ["IMG", "RollerFrame_TopMid_4", "curSrc", "base"],
            ["IMG", "RollerFrame_TopMid_4", "activeSrc", "base"],
            ["IMG", "RollerFrame_TopMid_4", "modes", "Active", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_TopMid_4", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerFrame_TopMid_4", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_TopMid_4", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_TopMid_4", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_TopMid_4", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerFrame_TopMid_5", "isActive", false],
            ["IMG", "RollerFrame_TopMid_5", "curSrc", "base"],
            ["IMG", "RollerFrame_TopMid_5", "activeSrc", "base"],
            ["IMG", "RollerFrame_TopMid_5", "modes", "Active", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_TopMid_5", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerFrame_TopMid_5", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_TopMid_5", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_TopMid_5", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_TopMid_5", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerFrame_TopMid_6", "isActive", false],
            ["IMG", "RollerFrame_TopMid_6", "curSrc", "base"],
            ["IMG", "RollerFrame_TopMid_6", "activeSrc", "base"],
            ["IMG", "RollerFrame_TopMid_6", "modes", "Active", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_TopMid_6", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerFrame_TopMid_6", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_TopMid_6", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_TopMid_6", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_TopMid_6", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerFrame_TopMid_7", "isActive", false],
            ["IMG", "RollerFrame_TopMid_7", "curSrc", "base"],
            ["IMG", "RollerFrame_TopMid_7", "activeSrc", "base"],
            ["IMG", "RollerFrame_TopMid_7", "modes", "Active", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_TopMid_7", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerFrame_TopMid_7", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_TopMid_7", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_TopMid_7", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_TopMid_7", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerFrame_TopMid_8", "isActive", false],
            ["IMG", "RollerFrame_TopMid_8", "curSrc", "base"],
            ["IMG", "RollerFrame_TopMid_8", "activeSrc", "base"],
            ["IMG", "RollerFrame_TopMid_8", "modes", "Active", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_TopMid_8", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerFrame_TopMid_8", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_TopMid_8", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_TopMid_8", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_TopMid_8", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "RollerFrame_TopMid_9", "isActive", false],
            ["IMG", "RollerFrame_TopMid_9", "curSrc", "base"],
            ["IMG", "RollerFrame_TopMid_9", "activeSrc", "base"],
            ["IMG", "RollerFrame_TopMid_9", "modes", "Active", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_TopMid_9", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "RollerFrame_TopMid_9", "modes", "Daylighter", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_TopMid_9", "modes", "Downtime", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_TopMid_9", "modes", "Spotlight", {isForcedOn: "LAST", isForcedState: "base", lastActive: false, lastState: "base"}],
            ["IMG", "RollerFrame_TopMid_9", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "Horizon_1", "isActive", true],
            ["IMG", "Horizon_1", "curSrc", "@@curSrc@@"],
            ["IMG", "Horizon_1", "modes", "Active", {isForcedOn: true}],
            ["IMG", "Horizon_1", "modes", "Inactive", {isForcedOn: true, isForcedState: "night5", lastState: "night5"}],
            ["IMG", "Horizon_1", "modes", "Daylighter", {isForcedOn: true, isForcedState: "daylighters", lastState: "daylighters"}],
            ["IMG", "Horizon_1", "modes", "Downtime", {isForcedOn: true, isForcedState: "night5", lastState: "night5"}],
            ["IMG", "Horizon_1", "modes", "Spotlight", {isForcedOn: true, isForcedState: "night5", lastState: "night5"}],
            ["IMG", "Horizon_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "Foreground_1", "isActive", true],
            ["IMG", "Foreground_1", "curSrc", "@@curSrc@@"],
            ["IMG", "Foreground_1", "modes", "Active", {isForcedOn: true}],
            ["IMG", "Foreground_1", "modes", "Inactive", {isForcedOn: true, isForcedState: "dark", lastState: "dark"}],
            ["IMG", "Foreground_1", "modes", "Daylighter", {isForcedOn: true, isForcedState: "daylighters", lastState: "daylighters"}],
            ["IMG", "Foreground_1", "modes", "Downtime", {isForcedOn: true, isForcedState: "dark", lastState: "dark"}],
            ["IMG", "Foreground_1", "modes", "Spotlight", {isForcedOn: true, isForcedState: "dark", lastState: "dark"}],
            ["IMG", "Foreground_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "WeatherFog_1", "isActive", false],
            ["IMG", "WeatherFog_1", "curSrc", "@@curSrc@@"],
            ["IMG", "WeatherFog_1", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["IMG", "WeatherFog_1", "modes", "Inactive", {isForcedOn: true, isForcedState: "redoverlay", lastState: "redoverlay"}],
            ["IMG", "WeatherFog_1", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "WeatherFog_1", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "WeatherFog_1", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "WeatherFog_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "WeatherFrost_1", "isActive", false],
            ["IMG", "WeatherFrost_1", "curSrc", "@@curSrc@@"],
            ["IMG", "WeatherFrost_1", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["IMG", "WeatherFrost_1", "modes", "Inactive", {isForcedOn: true, isForcedState: "redoverlay", lastState: "redoverlay"}],
            ["IMG", "WeatherFrost_1", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "WeatherFrost_1", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "WeatherFrost_1", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "WeatherFrost_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "WeatherGround_1", "isActive", false],
            ["IMG", "WeatherGround_1", "curSrc", "@@curSrc@@"],
            ["IMG", "WeatherGround_1", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["IMG", "WeatherGround_1", "modes", "Inactive", {isForcedOn: true, isForcedState: "wet", lastState: "wet"}],
            ["IMG", "WeatherGround_1", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "WeatherGround_1", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "WeatherGround_1", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "WeatherGround_1", "modes", "Complications", {isForcedOn: null}],
            ["IMG", "WeatherMain_1", "isActive", false],
            ["IMG", "WeatherMain_1", "curSrc", "@@curSrc@@"],
            ["IMG", "WeatherMain_1", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["IMG", "WeatherMain_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["IMG", "WeatherMain_1", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["IMG", "WeatherMain_1", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["IMG", "WeatherMain_1", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["IMG", "WeatherMain_1", "modes", "Complications", {isForcedOn: null}],
            ["TEXT", "CompCard_Name_1", "isActive", false],
            ["TEXT", "CompCard_Name_1", "modes", "Active", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_1", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_1", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_1", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_1", "modes", "Complications", {isForcedOn: true}],
            ["TEXT", "CompCard_Name_10", "isActive", false],
            ["TEXT", "CompCard_Name_10", "modes", "Active", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_10", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_10", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_10", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_10", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_10", "modes", "Complications", {isForcedOn: true}],
            ["TEXT", "CompCard_Name_2", "isActive", false],
            ["TEXT", "CompCard_Name_2", "modes", "Active", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_2", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_2", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_2", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_2", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_2", "modes", "Complications", {isForcedOn: true}],
            ["TEXT", "CompCard_Name_3", "isActive", false],
            ["TEXT", "CompCard_Name_3", "modes", "Active", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_3", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_3", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_3", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_3", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_3", "modes", "Complications", {isForcedOn: true}],
            ["TEXT", "CompCard_Name_4", "isActive", false],
            ["TEXT", "CompCard_Name_4", "modes", "Active", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_4", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_4", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_4", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_4", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_4", "modes", "Complications", {isForcedOn: true}],
            ["TEXT", "CompCard_Name_5", "isActive", false],
            ["TEXT", "CompCard_Name_5", "modes", "Active", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_5", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_5", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_5", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_5", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_5", "modes", "Complications", {isForcedOn: true}],
            ["TEXT", "CompCard_Name_6", "isActive", false],
            ["TEXT", "CompCard_Name_6", "modes", "Active", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_6", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_6", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_6", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_6", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_6", "modes", "Complications", {isForcedOn: true}],
            ["TEXT", "CompCard_Name_7", "isActive", false],
            ["TEXT", "CompCard_Name_7", "modes", "Active", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_7", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_7", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_7", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_7", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_7", "modes", "Complications", {isForcedOn: true}],
            ["TEXT", "CompCard_Name_8", "isActive", false],
            ["TEXT", "CompCard_Name_8", "modes", "Active", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_8", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_8", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_8", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_8", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_8", "modes", "Complications", {isForcedOn: true}],
            ["TEXT", "CompCard_Name_9", "isActive", false],
            ["TEXT", "CompCard_Name_9", "modes", "Active", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_9", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_9", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_9", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_9", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCard_Name_9", "modes", "Complications", {isForcedOn: true}],
            ["TEXT", "CompCardsExcluded", "isActive", false],
            ["TEXT", "CompCardsExcluded", "modes", "Active", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCardsExcluded", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCardsExcluded", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCardsExcluded", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCardsExcluded", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCardsExcluded", "modes", "Complications", {isForcedOn: true}],
            ["TEXT", "CompCardsRemaining", "isActive", false],
            ["TEXT", "CompCardsRemaining", "modes", "Active", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCardsRemaining", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCardsRemaining", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCardsRemaining", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCardsRemaining", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCardsRemaining", "modes", "Complications", {isForcedOn: true}],
            ["TEXT", "CompCurrent", "isActive", false],
            ["TEXT", "CompCurrent", "modes", "Active", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCurrent", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCurrent", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCurrent", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCurrent", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCurrent", "modes", "Complications", {isForcedOn: true}],
            ["TEXT", "CompCardsDiscarded", "isActive", false],
            ["TEXT", "CompCardsDiscarded", "modes", "Active", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCardsDiscarded", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCardsDiscarded", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCardsDiscarded", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCardsDiscarded", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["TEXT", "CompCardsDiscarded", "modes", "Complications", {isForcedOn: true}],
            ["TEXT", "CompRemaining", "isActive", false],
            ["TEXT", "CompRemaining", "modes", "Active", {isForcedOn: "NEVER"}],
            ["TEXT", "CompRemaining", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "CompRemaining", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["TEXT", "CompRemaining", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["TEXT", "CompRemaining", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["TEXT", "CompRemaining", "modes", "Complications", {isForcedOn: true}],
            ["TEXT", "CompTarget", "isActive", false],
            ["TEXT", "CompTarget", "modes", "Active", {isForcedOn: "NEVER"}],
            ["TEXT", "CompTarget", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "CompTarget", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["TEXT", "CompTarget", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["TEXT", "CompTarget", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["TEXT", "CompTarget", "modes", "Complications", {isForcedOn: true}],
            ["TEXT", "Projects_Col1", "isActive", true],
            ["TEXT", "Projects_Col1", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "Projects_Col1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "Projects_Col1", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["TEXT", "Projects_Col1", "modes", "Downtime", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "Projects_Col1", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["TEXT", "Projects_Col1", "modes", "Complications", {isForcedOn: null}],
            ["TEXT", "Projects_Col2", "isActive", true],
            ["TEXT", "Projects_Col2", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "Projects_Col2", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "Projects_Col2", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["TEXT", "Projects_Col2", "modes", "Downtime", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "Projects_Col2", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["TEXT", "Projects_Col2", "modes", "Complications", {isForcedOn: null}],
            ["TEXT", "Projects_Col3", "isActive", true],
            ["TEXT", "Projects_Col3", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "Projects_Col3", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "Projects_Col3", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["TEXT", "Projects_Col3", "modes", "Downtime", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "Projects_Col3", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["TEXT", "Projects_Col3", "modes", "Complications", {isForcedOn: null}],
            ["TEXT", "Stakes_Char_Col1", "isActive", true],
            ["TEXT", "Stakes_Char_Col1", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "Stakes_Char_Col1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "Stakes_Char_Col1", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["TEXT", "Stakes_Char_Col1", "modes", "Downtime", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "Stakes_Char_Col1", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["TEXT", "Stakes_Char_Col1", "modes", "Complications", {isForcedOn: null}],
            ["TEXT", "Stakes_Char_Col2", "isActive", true],
            ["TEXT", "Stakes_Char_Col2", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "Stakes_Char_Col2", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "Stakes_Char_Col2", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["TEXT", "Stakes_Char_Col2", "modes", "Downtime", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "Stakes_Char_Col2", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["TEXT", "Stakes_Char_Col2", "modes", "Complications", {isForcedOn: null}],
            ["TEXT", "Stakes_Char_Col3", "isActive", true],
            ["TEXT", "Stakes_Char_Col3", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "Stakes_Char_Col3", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "Stakes_Char_Col3", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["TEXT", "Stakes_Char_Col3", "modes", "Downtime", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "Stakes_Char_Col3", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["TEXT", "Stakes_Char_Col3", "modes", "Complications", {isForcedOn: null}],
            ["TEXT", "Stakes_Char_Col4", "isActive", true],
            ["TEXT", "Stakes_Char_Col4", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "Stakes_Char_Col4", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "Stakes_Char_Col4", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["TEXT", "Stakes_Char_Col4", "modes", "Downtime", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "Stakes_Char_Col4", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["TEXT", "Stakes_Char_Col4", "modes", "Complications", {isForcedOn: null}],
            ["TEXT", "Stakes_Coterie_Col1", "isActive", true],
            ["TEXT", "Stakes_Coterie_Col1", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "Stakes_Coterie_Col1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "Stakes_Coterie_Col1", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["TEXT", "Stakes_Coterie_Col1", "modes", "Downtime", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "Stakes_Coterie_Col1", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["TEXT", "Stakes_Coterie_Col1", "modes", "Complications", {isForcedOn: null}],
            ["TEXT", "Stakes_Coterie_Col2", "isActive", true],
            ["TEXT", "Stakes_Coterie_Col2", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "Stakes_Coterie_Col2", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "Stakes_Coterie_Col2", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["TEXT", "Stakes_Coterie_Col2", "modes", "Downtime", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "Stakes_Coterie_Col2", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["TEXT", "Stakes_Coterie_Col2", "modes", "Complications", {isForcedOn: null}],
            ["TEXT", "Stakes_Coterie_Col3", "isActive", true],
            ["TEXT", "Stakes_Coterie_Col3", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "Stakes_Coterie_Col3", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "Stakes_Coterie_Col3", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["TEXT", "Stakes_Coterie_Col3", "modes", "Downtime", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "Stakes_Coterie_Col3", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["TEXT", "Stakes_Coterie_Col3", "modes", "Complications", {isForcedOn: null}],
            ["TEXT", "Stakes_Coterie_Col4", "isActive", true],
            ["TEXT", "Stakes_Coterie_Col4", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "Stakes_Coterie_Col4", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "Stakes_Coterie_Col4", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["TEXT", "Stakes_Coterie_Col4", "modes", "Downtime", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "Stakes_Coterie_Col4", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["TEXT", "Stakes_Coterie_Col4", "modes", "Complications", {isForcedOn: null}],
            ["TEXT", "Weekly_Char_Col1", "isActive", true],
            ["TEXT", "Weekly_Char_Col1", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "Weekly_Char_Col1", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "Weekly_Char_Col1", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["TEXT", "Weekly_Char_Col1", "modes", "Downtime", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "Weekly_Char_Col1", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["TEXT", "Weekly_Char_Col1", "modes", "Complications", {isForcedOn: null}],
            ["TEXT", "Weekly_Char_Col2", "isActive", true],
            ["TEXT", "Weekly_Char_Col2", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "Weekly_Char_Col2", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "Weekly_Char_Col2", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["TEXT", "Weekly_Char_Col2", "modes", "Downtime", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "Weekly_Char_Col2", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["TEXT", "Weekly_Char_Col2", "modes", "Complications", {isForcedOn: null}],
            ["TEXT", "Weekly_Char_Col3", "isActive", true],
            ["TEXT", "Weekly_Char_Col3", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "Weekly_Char_Col3", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "Weekly_Char_Col3", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["TEXT", "Weekly_Char_Col3", "modes", "Downtime", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "Weekly_Char_Col3", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["TEXT", "Weekly_Char_Col3", "modes", "Complications", {isForcedOn: null}],
            ["TEXT", "secretRollTraits", "isActive", true],
            ["TEXT", "secretRollTraits", "modes", "Active", {isForcedOn: null}],
            ["TEXT", "secretRollTraits", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "secretRollTraits", "modes", "Daylighter", {isForcedOn: null}],
            ["TEXT", "secretRollTraits", "modes", "Downtime", {isForcedOn: null}],
            ["TEXT", "secretRollTraits", "modes", "Spotlight", {isForcedOn: null}],
            ["TEXT", "secretRollTraits", "modes", "Complications", {isForcedOn: null}],
            ["TEXT", "testSessionNotice", "isActive", true],
            ["TEXT", "testSessionNotice", "modes", "Active", {isForcedOn: null}],
            ["TEXT", "testSessionNotice", "modes", "Inactive", {isForcedOn: null}],
            ["TEXT", "testSessionNotice", "modes", "Daylighter", {isForcedOn: null}],
            ["TEXT", "testSessionNotice", "modes", "Downtime", {isForcedOn: null}],
            ["TEXT", "testSessionNotice", "modes", "Spotlight", {isForcedOn: null}],
            ["TEXT", "testSessionNotice", "modes", "Complications", {isForcedOn: null}],
            ["TEXT", "SiteNameCenter", "isActive", true],
            ["TEXT", "SiteNameCenter", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "SiteNameCenter", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "SiteNameCenter", "modes", "Daylighter", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "SiteNameCenter", "modes", "Downtime", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "SiteNameCenter", "modes", "Spotlight", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "SiteNameCenter", "modes", "Complications", {isForcedOn: null}],
            ["TEXT", "SiteNameLeft", "isActive", true],
            ["TEXT", "SiteNameLeft", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "SiteNameLeft", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "SiteNameLeft", "modes", "Daylighter", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "SiteNameLeft", "modes", "Downtime", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "SiteNameLeft", "modes", "Spotlight", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "SiteNameLeft", "modes", "Complications", {isForcedOn: null}],
            ["TEXT", "SiteNameRight", "isActive", true],
            ["TEXT", "SiteNameRight", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "SiteNameRight", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "SiteNameRight", "modes", "Daylighter", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "SiteNameRight", "modes", "Downtime", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "SiteNameRight", "modes", "Spotlight", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "SiteNameRight", "modes", "Complications", {isForcedOn: null}],
            ["TEXT", "AvaDesire", "isActive", true],
            ["TEXT", "AvaDesire", "modes", "Active", {isForcedOn: true}],
            ["TEXT", "AvaDesire", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "AvaDesire", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["TEXT", "AvaDesire", "modes", "Downtime", {isForcedOn: true}],
            ["TEXT", "AvaDesire", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["TEXT", "AvaDesire", "modes", "Complications", {isForcedOn: null}],
            ["TEXT", "LockeDesire", "isActive", true],
            ["TEXT", "LockeDesire", "modes", "Active", {isForcedOn: true}],
            ["TEXT", "LockeDesire", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "LockeDesire", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["TEXT", "LockeDesire", "modes", "Downtime", {isForcedOn: true}],
            ["TEXT", "LockeDesire", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["TEXT", "LockeDesire", "modes", "Complications", {isForcedOn: null}],
            ["TEXT", "NapierDesire", "isActive", true],
            ["TEXT", "NapierDesire", "modes", "Active", {isForcedOn: true}],
            ["TEXT", "NapierDesire", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "NapierDesire", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["TEXT", "NapierDesire", "modes", "Downtime", {isForcedOn: true}],
            ["TEXT", "NapierDesire", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["TEXT", "NapierDesire", "modes", "Complications", {isForcedOn: null}],
            ["TEXT", "RoyDesire", "isActive", true],
            ["TEXT", "RoyDesire", "modes", "Active", {isForcedOn: true}],
            ["TEXT", "RoyDesire", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "RoyDesire", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["TEXT", "RoyDesire", "modes", "Downtime", {isForcedOn: true}],
            ["TEXT", "RoyDesire", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["TEXT", "RoyDesire", "modes", "Complications", {isForcedOn: null}],
            ["TEXT", "dicePool", "isActive", false],
            ["TEXT", "dicePool", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "dicePool", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "dicePool", "modes", "Daylighter", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "dicePool", "modes", "Downtime", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "dicePool", "modes", "Spotlight", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "dicePool", "modes", "Complications", {isForcedOn: null}],
            ["TEXT", "difficulty", "isActive", false],
            ["TEXT", "difficulty", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "difficulty", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "difficulty", "modes", "Daylighter", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "difficulty", "modes", "Downtime", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "difficulty", "modes", "Spotlight", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "difficulty", "modes", "Complications", {isForcedOn: null}],
            ["TEXT", "goldMods", "isActive", false],
            ["TEXT", "goldMods", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "goldMods", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "goldMods", "modes", "Daylighter", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "goldMods", "modes", "Downtime", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "goldMods", "modes", "Spotlight", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "goldMods", "modes", "Complications", {isForcedOn: null}],
            ["TEXT", "mainRoll", "isActive", false],
            ["TEXT", "mainRoll", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "mainRoll", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "mainRoll", "modes", "Daylighter", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "mainRoll", "modes", "Downtime", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "mainRoll", "modes", "Spotlight", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "mainRoll", "modes", "Complications", {isForcedOn: null}],
            ["TEXT", "margin", "isActive", false],
            ["TEXT", "margin", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "margin", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "margin", "modes", "Daylighter", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "margin", "modes", "Downtime", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "margin", "modes", "Spotlight", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "margin", "modes", "Complications", {isForcedOn: null}],
            ["TEXT", "negMods", "isActive", false],
            ["TEXT", "negMods", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "negMods", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "negMods", "modes", "Daylighter", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "negMods", "modes", "Downtime", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "negMods", "modes", "Spotlight", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "negMods", "modes", "Complications", {isForcedOn: null}],
            ["TEXT", "outcome", "isActive", false],
            ["TEXT", "outcome", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "outcome", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "outcome", "modes", "Daylighter", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "outcome", "modes", "Downtime", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "outcome", "modes", "Spotlight", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "outcome", "modes", "Complications", {isForcedOn: null}],
            ["TEXT", "posMods", "isActive", false],
            ["TEXT", "posMods", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "posMods", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "posMods", "modes", "Daylighter", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "posMods", "modes", "Downtime", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "posMods", "modes", "Spotlight", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "posMods", "modes", "Complications", {isForcedOn: null}],
            ["TEXT", "redMods", "isActive", false],
            ["TEXT", "redMods", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "redMods", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "redMods", "modes", "Daylighter", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "redMods", "modes", "Downtime", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "redMods", "modes", "Spotlight", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "redMods", "modes", "Complications", {isForcedOn: null}],
            ["TEXT", "resultCount", "isActive", false],
            ["TEXT", "resultCount", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "resultCount", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "resultCount", "modes", "Daylighter", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "resultCount", "modes", "Downtime", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "resultCount", "modes", "Spotlight", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "resultCount", "modes", "Complications", {isForcedOn: null}],
            ["TEXT", "rollerName", "isActive", false],
            ["TEXT", "rollerName", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "rollerName", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "rollerName", "modes", "Daylighter", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "rollerName", "modes", "Downtime", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "rollerName", "modes", "Spotlight", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "rollerName", "modes", "Complications", {isForcedOn: null}],
            ["TEXT", "subOutcome", "isActive", false],
            ["TEXT", "subOutcome", "modes", "Active", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "subOutcome", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "subOutcome", "modes", "Daylighter", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "subOutcome", "modes", "Downtime", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "subOutcome", "modes", "Spotlight", {isForcedOn: "LAST", lastActive: true}],
            ["TEXT", "subOutcome", "modes", "Complications", {isForcedOn: null}],
            ["TEXT", "Countdown", "isActive", false],
            ["TEXT", "Countdown", "modes", "Active", {isForcedOn: "NEVER"}],
            ["TEXT", "Countdown", "modes", "Inactive", {isForcedOn: true}],
            ["TEXT", "Countdown", "modes", "Daylighter", {isForcedOn: "NEVER"}],
            ["TEXT", "Countdown", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["TEXT", "Countdown", "modes", "Spotlight", {isForcedOn: "NEVER"}],
            ["TEXT", "Countdown", "modes", "Complications", {isForcedOn: "NEVER"}],
            ["TEXT", "tempC", "isActive", true],
            ["TEXT", "tempC", "modes", "Active", {isForcedOn: true}],
            ["TEXT", "tempC", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "tempC", "modes", "Daylighter", {isForcedOn: true}],
            ["TEXT", "tempC", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["TEXT", "tempC", "modes", "Spotlight", {isForcedOn: true}],
            ["TEXT", "tempC", "modes", "Complications", {isForcedOn: null}],
            ["TEXT", "tempF", "isActive", true],
            ["TEXT", "tempF", "modes", "Active", {isForcedOn: true}],
            ["TEXT", "tempF", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "tempF", "modes", "Daylighter", {isForcedOn: true}],
            ["TEXT", "tempF", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["TEXT", "tempF", "modes", "Spotlight", {isForcedOn: true}],
            ["TEXT", "tempF", "modes", "Complications", {isForcedOn: null}],
            ["TEXT", "TimeTracker", "isActive", true],
            ["TEXT", "TimeTracker", "modes", "Active", {isForcedOn: true}],
            ["TEXT", "TimeTracker", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "TimeTracker", "modes", "Daylighter", {isForcedOn: true}],
            ["TEXT", "TimeTracker", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["TEXT", "TimeTracker", "modes", "Spotlight", {isForcedOn: true}],
            ["TEXT", "TimeTracker", "modes", "Complications", {isForcedOn: null}],
            ["TEXT", "weather", "isActive", true],
            ["TEXT", "weather", "modes", "Active", {isForcedOn: true}],
            ["TEXT", "weather", "modes", "Inactive", {isForcedOn: "NEVER"}],
            ["TEXT", "weather", "modes", "Daylighter", {isForcedOn: true}],
            ["TEXT", "weather", "modes", "Downtime", {isForcedOn: "NEVER"}],
            ["TEXT", "weather", "modes", "Spotlight", {isForcedOn: true}],
            ["TEXT", "weather", "modes", "Complications", {isForcedOn: null}],
        ],
    // #endregion

    // #region GENERAL MEDIA OBJECT GETTERS:
        isRegistered = mediaRef => isRegText(mediaRef) || isRegImg(mediaRef) || isRegAnim(mediaRef),
        getMediaObj = mediaRef => {
            if (VAL({object: mediaRef}))
                return mediaRef
            if (isRegText(mediaRef)) {
                return getTextObj(mediaRef)
            } else if (isRegImg(mediaRef)) {
                return getImgObj(mediaRef)
            } else if (VAL({string: mediaRef})) {
                const imgObj = getObj("graphic", mediaRef)
                if (VAL({imgObj}))
                    return imgObj
                const textObj = getObj("text", mediaRef)
                if (VAL({textObj}))
                    return textObj                
            }
            return mediaRef
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
        getRegistryRef = mediaRef => {
            if (isRegText(mediaRef))
                return REGISTRY.TEXT
            if (isRegAnim(mediaRef))
                return REGISTRY.ANIM
            if (isRegToken(mediaRef))
                return REGISTRY.TOKEN
            if (isRegImg(mediaRef))
                return REGISTRY.IMG
            D.Alert(`Unable to find registry reference for ${D.JS(mediaRef)}!`, "getRegistryRef")
            return {}
        },
        getModeData = (mediaRef, mode) => {
            mode = mode || Session.Mode
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
                    mediaModes = _.clone(mediaData.modes[Session.Mode])
                if (VAL({list: mediaModes}, "getModeStatus")) {
                    if (mediaModes.isForcedOn === "LAST")
                        modeStatus.isActive = mediaModes.lastActive
                    else if (mediaModes.isForcedOn === "NEVER")
                        modeStatus.isActive = false
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
        fixAll = (isKilling = false) => {
            const [isTesting, currentMode] = [Session.IsTesting, Session.Mode]

            // Session.ToggleTesting(true)
            // Session.ChangeMode("Active")

            D.Chat("all", C.HTML.Block(C.HTML.Header("Initializing Media Assets", STYLES.Initialization.Header), STYLES.Initialization.Block))
            if (!isTesting)
                Session.ToggleTesting(true)
            if (currentMode !== "Active")
                Session.ChangeMode("Active")           
            
            STATE.REF.fixAllCommands = []
            D.Queue(resetModeData, [true], "Media", 15)
            D.Queue(D.Chat, ["all", C.HTML.Block(C.HTML.Header("[1 / 16] Mode Data Reset", STYLES.Initialization.Header), {border: "none", bgColor: D.Gradient(C.COLORS.darkgrey, C.COLORS.darkred, 1, 16)})], "Media", 0.1)
            D.Queue(Roller.Kill, [], "Media", 5)
            D.Queue(D.Chat, ["all", C.HTML.Block(C.HTML.Header("[2 / 16] Dice Roller Purged", STYLES.Initialization.Header), {border: "none", bgColor: D.Gradient(C.COLORS.darkgrey, C.COLORS.darkred, 2, 16)})], "Media", 0.1)
            D.Queue(Roller.Init, [false], "Media", 10)
            D.Queue(D.Chat, ["all", C.HTML.Block(C.HTML.Header("[3 / 16] Dice Roller Rebuilt", STYLES.Initialization.Header), {border: "none", bgColor: D.Gradient(C.COLORS.darkgrey, C.COLORS.darkred, 3, 16)})], "Media", 0.1)
            D.Queue(clearMissingRegImgs, [], "Media")
            D.Queue(D.Chat, ["all", C.HTML.Block(C.HTML.Header("[4 / 16] Image Registry Verified", STYLES.Initialization.Header), {border: "none", bgColor: D.Gradient(C.COLORS.darkgrey, C.COLORS.darkred, 4, 16)})], "Media", 0.1)
            D.Queue(clearMissingRegText, [], "Media")
            D.Queue(D.Chat, ["all", C.HTML.Block(C.HTML.Header("[5 / 16] Text Registry Verified", STYLES.Initialization.Header), {border: "none", bgColor: D.Gradient(C.COLORS.darkgrey, C.COLORS.darkred, 5, 16)})], "Media", 0.1)
            D.Queue(clearUnregImgs, [isKilling], "Media")
            D.Queue(D.Chat, ["all", C.HTML.Block(C.HTML.Header("[6 / 16] Image Objects Compiled", STYLES.Initialization.Header), {border: "none", bgColor: D.Gradient(C.COLORS.darkgrey, C.COLORS.darkred, 6, 16)})], "Media", 0.1)
            D.Queue(clearUnregText, [isKilling], "Media")
            D.Queue(D.Chat, ["all", C.HTML.Block(C.HTML.Header("[7 / 16] Text Objects Compiled", STYLES.Initialization.Header), {border: "none", bgColor: D.Gradient(C.COLORS.darkgrey, C.COLORS.darkred, 7, 16)})], "Media", 0.1)
            D.Queue(D.Chat, ["all", C.HTML.Block(C.HTML.Header("[8 / 16] Animation Objects Compiled", STYLES.Initialization.Header), {border: "none", bgColor: D.Gradient(C.COLORS.darkgrey, C.COLORS.darkred, 8, 16)})], "Media", 0.1)
            D.Queue(setZIndices, [], "Media")
            D.Queue(D.Chat, ["all", C.HTML.Block(C.HTML.Header("[9 / 16] Z-Indices Reset", STYLES.Initialization.Header), {border: "none", bgColor: D.Gradient(C.COLORS.darkgrey, C.COLORS.darkred, 9, 16)})], "Media", 0.1)
            D.Queue(resetBGImgs, [], "Media")

            
            D.Queue(D.Chat, ["all", C.HTML.Block(C.HTML.Header("[10 / 16] Background & Overlay Images Configured", STYLES.Initialization.Header), {border: "none", bgColor: D.Gradient(C.COLORS.darkgrey, C.COLORS.darkred, 10, 16)})], "Media", 0.1)
            D.Queue(() => {
                TimeTracker.Fix()
                D.Chat("all", C.HTML.Block(C.HTML.Header("[11 / 16] Time, Weather & Horizon Data Updated", STYLES.Initialization.Header), {border: "none", bgColor: D.Gradient(C.COLORS.darkgrey, C.COLORS.darkred, 11, 16)}))
            }, [], "Media")
            D.Queue(() => {
                Session.ResetLocations("Active", true)
                D.Chat("all", C.HTML.Block(C.HTML.Header("[12 / 16] Districts & Sites Restored", STYLES.Initialization.Header),{border: "none", bgColor: D.Gradient(C.COLORS.darkgrey, C.COLORS.darkred, 12, 16)}))
            }, [], "Media")
            D.Queue(fixImgObjs, [], "Media", 10)
            D.Queue(D.Chat, ["all", C.HTML.Block(C.HTML.Header("[13 / 16] Final Image Object Pass: Complete", STYLES.Initialization.Header), {border: "none", bgColor: D.Gradient(C.COLORS.darkgrey, C.COLORS.darkred, 13, 16)})], "Media", 0.1)
            D.Queue(fixTextObjs, [], "Media", 5)
            D.Queue(D.Chat, ["all", C.HTML.Block(C.HTML.Header("[14 / 16] Final Text Object Pass: Complete", STYLES.Initialization.Header), {border: "none", bgColor: D.Gradient(C.COLORS.darkgrey, C.COLORS.darkred, 14, 16)})], "Media", 0.1)
            D.Queue(Roller.Clean, [], "Media")
            D.Queue(D.Chat, ["all", C.HTML.Block(C.HTML.Header("[15 / 16] Dice Roller Cleaned", STYLES.Initialization.Header), {border: "none", bgColor: D.Gradient(C.COLORS.darkgrey, C.COLORS.darkred, 15, 16)})], "Media", 0.1)
            D.Queue(initSoundModes, [], "Media")    
            D.Queue(D.Chat, ["all", C.HTML.Block(C.HTML.Header("[16 / 16] Soundscape Initialized", STYLES.Initialization.Header), {border: "none", bgColor: D.Gradient(C.COLORS.darkgrey, C.COLORS.darkred, 16, 16)})], "Media", 0.1)        

            if (isTesting)
                D.Queue(Session.ToggleTesting, [isTesting], "Media", 0.1)
            if (currentMode !== "Active")
                D.Queue(Session.ChangeMode, [currentMode], "Media")
        
            D.Queue(D.Chat, ["all", C.HTML.Block(C.HTML.Header("Media Assets Initialized! Reload Sandbox to Re-Sync.", STYLES.Initialization.Header), STYLES.Initialization.Block)], "Media", 0.1)
            D.Queue(() => {
                D.Alert(STATE.REF.fixAllCommands.join("<br>"), "Media Initialization Report")
                STATE.REF.fixAllCommands = []
            }, [], "Media", 0.1)
            D.Run("Media")
        },
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
        setMediaTemp = (mediaRef, params = {}) => {
            const mediaObj = getMediaObj(mediaRef)
            if (VAL({object: mediaObj}))
                mediaObj.set(params)
        },
        toggle = (mediaRef, isActive, isForcing = false) => {
            if (isActive !== true && isActive !== false)
                return null
            if (isRegText(mediaRef))
                return toggleText(mediaRef, isActive, isForcing)
            return toggleImg(mediaRef, isActive, isForcing)
        },
        setAnchor = mediaRef => {
            const mediaObj = getMediaObj(mediaRef)
            if (VAL({object: mediaObj})) {
                STATE.REF.anchorObj = {
                    top: mediaObj.get("top"),
                    left: mediaObj.get("left"),
                    height: mediaObj.get("height"),
                    width: mediaObj.get("width"),
                    leftEdge: mediaObj.get("left") - 0.5 * mediaObj.get("width"),
                    rightEdge: mediaObj.get("left") + 0.5 * mediaObj.get("width"),
                    topEdge: mediaObj.get("top") - 0.5 * mediaObj.get("height"),
                    bottomEdge: mediaObj.get("top") + 0.5 * mediaObj.get("height")
                }
                D.Alert(`Anchor Set to: ${D.JS(STATE.REF.anchorObj)}`, "Setting Media Anchor")
            }
        },
        distObjs = (mediaRefs, distDir) => {
            const posRef = D.LCase(distDir).startsWith("h") ? "left" : "top",
                mediaObjs = mediaRefs.map(x => getMediaObj(x)).sort((a, b) => a.get(posRef) - b.get(posRef))
            spreadImgs(mediaObjs.shift(), mediaObjs.pop(), mediaObjs)
        },
        alignObjs = (mediaRefs, objAlignFrom = "center", anchorAlignTo) => {
            const mediaObjs = _.compact(mediaRefs.map(x => getMediaObj(x) || VAL({object: x}) && x || false)),
                alignGuides = {left: STATE.REF.anchorObj.left, top: STATE.REF.anchorObj.top}
            anchorAlignTo = anchorAlignTo || objAlignFrom
            switch (D.LCase(anchorAlignTo)) {
                case "cfhoriz": case "cfvert":
                case "horiz": case "vert": case "center": {
                    break
                }
                case "top": case "topedge": {
                    alignGuides.top = STATE.REF.anchorObj.topEdge
                    break
                }
                case "bottom": case "bottomedge": case "botedge": {
                    alignGuides.top = STATE.REF.anchorObj.bottomEdge
                    break
                }
                case "left": case "leftedge": {
                    alignGuides.left = STATE.REF.anchorObj.leftEdge
                    break
                }
                case "right": case "rightedge": {
                    alignGuides.left = STATE.REF.anchorObj.rightEdge
                    break
                }
                default: {
                    return THROW(`Unrecognized value for anchorAlignTo (${D.JSL(anchorAlignTo)})`, "alignObjs")
                }
            }
            for (const mediaObj of mediaObjs)
                switch (D.LCase(objAlignFrom)) {
                    case "cfhoriz": {                        
                        mediaObj.set("left", C.SANDBOX.width - mediaObj.get("left"))
                        break
                    }
                    case "cfvert": {
                        mediaObj.set("top", C.SANDBOX.height - mediaObj.get("top"))
                        break
                    }
                    case "horiz": {
                        mediaObj.set("left", alignGuides.left)
                        break
                    }
                    case "vert": {
                        mediaObj.set("top", alignGuides.top)
                        break
                    }
                    case "center": {
                        mediaObj.set({left: alignGuides.left, top: alignGuides.top})
                        break
                    }
                    case "top": case "topedge": {
                        mediaObj.set("top", alignGuides.top + 0.5 * mediaObj.get("height"))
                        break
                    }
                    case "bottom": case "bottomedge": case "botedge": {
                        mediaObj.set("top", alignGuides.top - 0.5 * mediaObj.get("height"))
                        break
                    }
                    case "left": case "leftedge": {
                        mediaObj.set("left", alignGuides.left + 0.5 * mediaObj.get("width"))
                        break
                    }
                    case "right": case "rightedge": {
                        mediaObj.set("left", alignGuides.left - 0.5 * mediaObj.get("width"))
                        break
                    }
                    default: {
                        return THROW(`Unrecognized value for objAlignFrom (${D.JSL(objAlignFrom)})`, "alignObjs")
                    }
                }
            return true
        },        
        adjustObj = (mediaRefs, deltaX, deltaY) => {
            for (const mediaObj of _.flatten([mediaRefs]).map(x => getMediaObj(x)))
                if (VAL({object: mediaObj}))
                    setMediaTemp({
                        left: D.Float(mediaObj.get("left")) + D.Float(deltaX),
                        top: D.Float(mediaObj.get("top")) + D.Float(deltaY)
                    })
        },
        modeUpdate = (mediaRefs = "all") => {
            mediaRefs = mediaRefs === "all" ? [..._.keys(REGISTRY.IMG), ..._.keys(REGISTRY.TEXT), ..._.keys(REGISTRY.ANIM)] : _.flatten([mediaRefs], true)
            for (const mediaRef of mediaRefs)
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
                    const graphicData = getImgData(mediaRef),
                        graphicKey = graphicData.name,
                        regRef = REGISTRY.IMG[graphicKey] && REGISTRY.IMG || REGISTRY.ANIM[graphicKey] && REGISTRY.ANIM || false,
                        modeStatus = getModeStatus(graphicKey)
                    DB(`Updating '${D.JSL(mediaRef)}'. ModeStatus: ${D.JSL(modeStatus)}`, "modeUpdate")
                    if(VAL({list: [regRef, modeStatus]}, "modeUpdate", true)) {
                        const lastMode = graphicData.curMode

                        if (lastMode) {
                            regRef[graphicKey].modes[lastMode].lastActive = graphicData.isActive
                            regRef[graphicKey].modes[lastMode].lastState = graphicData.isActive && graphicData.activeSrc || regRef[graphicKey].modes[lastMode].lastState
                        }
                        regRef[graphicKey].curMode = Session.Mode
                        if (!_.isUndefined(modeStatus.isActive)) {
                            DB(`... IsActive OK! toggleImg(${D.JSL(graphicKey)}, ${D.JSL(modeStatus.isActive)})`, "modeUpdate")
                            toggleImg(graphicKey, modeStatus.isActive)
                        }                    
                        if (!_.isUndefined(modeStatus.state) && REGISTRY.IMG[graphicKey]) {
                            DB(`... State OK! setImg(${D.JSL(graphicKey)}, ${D.JSL(modeStatus.state)})`, "modeUpdate")
                            setImg(graphicKey, modeStatus.state)
                        }                    
                    }
                }
        },
        setActiveLayers = (isOverridingStartActive = true) => {
            return false
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
            const allMediaDatas = [],
                sortedMediaObjs = []
            for (const category of ["map", "objects"]) {
                const mediaDatas = _.compact(getZLevels()[category].map(x => {
                    if (REGISTRY.IMG[x[1]]) {
                        [,,REGISTRY.IMG[x[1]].zIndex] = x
                        return REGISTRY.IMG[x[1]]
                    }
                    if (REGISTRY.ANIM[x[1]]) {
                        [,,REGISTRY.ANIM[x[1]].zIndex] = x
                        return REGISTRY.ANIM[x[1]]
                    }
                    if (REGISTRY.TEXT[x[1]]) {
                        [,,REGISTRY.TEXT[x[1]].zIndex] = x
                        if (REGISTRY.TEXT[x[1]].shadowID)
                            return [REGISTRY.TEXT[x[1]], {id: REGISTRY.TEXT[x[1]].shadowID, zIndex: REGISTRY.TEXT[x[1]].zIndex - 1}]
                        return REGISTRY.TEXT[x[1]]
                    }
                    return null
                }))
                allMediaDatas.push(..._.compact(_.flatten(mediaDatas)))
            }
            sortedMediaObjs.push(..._.compact(_.flatten(allMediaDatas.filter(x => x.padID).sort((a,b) => b.zIndex - a.zIndex).map(x => [getObj("graphic", x.padID), getObj("graphic", x.partnerID)]))))
            sortedMediaObjs.push(..._.compact(allMediaDatas.sort((a,b) => b.zIndex - a.zIndex).map(x => getMediaObj(x.id) || null)))
            for (let i = 0; i < sortedMediaObjs.length; i++)
                toBack(sortedMediaObjs[i])
        },
        resetModeData = (isResettingAll = false) => {
            // ^([^.]+)\.([^.\n=]+)\.([^.\n=]+)\.([^.\n=]+)\.([^.\n=]+) = (.*)
            // ["$1", "$2", "$3", "$4", "$5", $6],

            // isActive, curSrc, activeSrc, curText
            const [errorLines, returnMsg, updatedKeys] = [[], [], {IMG: [], TEXT: [], ANIM: []}]
            for (const data of MODEDATA) {
                let value = data.pop()
                const key = data.pop(),
                    objFlag = data.shift(),
                    objName = data.shift(),
                    objType = objName in REGISTRY.ANIM && "ANIM" || objFlag
                let ref
                try {
                    ref = REGISTRY[objType][objName]
                } catch (errObj) {
                    D.Alert(`Error getting REGISTRY[${D.JS(objType)}]`, "resetModes")
                    DB({objFlag, objName, data, key, value}, "resetModes")
                    continue
                }                
                if (objName === "MapIndicator")
                    DB({tag: "Starting Mode Reset", objFlag, objName, data, key, value, isActive: REGISTRY.ANIM.MapIndicator.isActive}, "resetModes")
                if (!ref || !isResettingAll && ref.wasModeUpdated)
                    continue        
                // errorLines.push(`${D.JSL(mediaName)}: [${data.join(" > ")}] = ${D.JSL(key)}:${D.JSL(value)}`)
                while (data.length) {
                    const newKey = data.shift()
                    if (newKey === "modes")
                        try {
                            updatedKeys[objType].push(objName)
                        } catch (errObj) {
                            D.Alert(THROW(`Key Error on ${D.JS(objName)}, ${D.JS(objType)}, ${D.JS(key)}`, "resetModes", errObj), "Error: Reset Modes")
                            continue
                        }  
                    if (!ref[newKey])
                        ref[newKey] = {}
                    ref = ref[newKey]
                }
                if (value === "@@curSrc@@") {
                    if (objType === "ANIM")
                        continue
                    const imgObj = getImgObj(objName),
                        imgData = getImgData(objName)
                    if (VAL({imgObj})) {
                        if (!`${imgObj.get("imgsrc")}`.includes("http"))
                            setImg(imgObj, "blank")
                        const srcRef = getSrcFromURL(imgObj.get("imgsrc"), getImgSrcs(imgObj))
                        if (srcRef) {
                            value = srcRef
                        } else {                            
                            errorLines.push(`Failure finding current source of ${objName}<br>URL: ${D.JS(imgObj.get("imgsrc"))}<br>SRCS: ${D.JS(imgData.srcs)}<br>SRCREF: ${D.JS(srcRef)}<br>GETSRCfromURL: ${D.JS(getSrcFromURL(imgObj.get("imgsrc"), imgData.srcs))}<br>`)
                            continue
                        }                        
                    } else {
                        errorLines.push(`Failure finding img obj ${objName}`)
                        continue
                    }                     
                }
                returnMsg.push(`ref[${D.JSL(key)}] set to ${D.JSL(value)}`)
                ref[key] = value                
                if (objName === "MapIndicator")
                    DB({tag: "Finished Mode Reset", objFlag, objName, data, key, value, isActive: REGISTRY.ANIM.MapIndicator.isActive}, "resetModes")
            }
            for (const imgKey of _.uniq(updatedKeys.IMG))
                REGISTRY.IMG[imgKey].wasModeUpdated = true
            for (const textKey of _.uniq(updatedKeys.TEXT))
                REGISTRY.TEXT[textKey].wasModeUpdated = true
            for (const animKey of _.uniq(updatedKeys.ANIM))
                REGISTRY.ANIM[animKey].wasModeUpdated = true
            // D.Alert(returnMsg.join("<br>"), "Mode Reset Complete!")
            if (errorLines.length)
                STATE.REF.fixAllCommands.push(...["<h3><u>Resetting Mode Data</u></h3>", ...errorLines])
        },
    // #endregion
    
    // #region IMG OBJECT & AREA GETTERS: Img Object & Data Retrieval
        isRegImg = imgRef => Boolean(getImgKey(imgRef, true)),        
        isCharToken = imgObj => VAL({imgObj}) && getObj("character", imgObj.get("represents")),
        isRegToken = imgObj => VAL({imgObj}) && Boolean(REGISTRY.TOKEN[D.GetName(imgObj.get("represents"))]),
        isRandomizerToken = tokenObj => isCharToken(tokenObj) && isRegToken(tokenObj) && (REGISTRY.TOKEN[D.GetName(tokenObj.get("represents"))].srcs.randomSrcs || []).length,
        isCyclingImg = imgObj => {
            const imgData = getImgData(imgObj)
            if (VAL({list: imgData}))
                return imgData.cycleSrcs && imgData.cycleSrcs.length
            return false 
        },
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
            let imgData = getImgData(imgRef)
            if (VAL({list: imgData})) {
                while (isRegImg(imgData.srcs))
                    imgData = getImgData(imgData.srcs)
                return Object.assign(C.IMAGES, imgData.srcs)
            }
            return false
        },
        getURLFromSrc = (srcRef, srcData) => {
            if (VAL({string: srcRef})) {
                if (`${srcRef}`.includes("http"))
                    return srcRef
                if (VAL({string: srcData}))
                    srcData = getImgSrcs(srcData)
                if (VAL({list: srcData}, "getURLFromSrc"))
                    return srcData[srcRef] || false
            }
            return false
        },
        getSrcFromURL = (URLRef, srcData) => {
            if (VAL({string: srcData}))
                srcData = getImgSrcs(srcData)
            if (VAL({string: URLRef, list: srcData}, "getSrcFromURL"))
                return _.findKey(srcData, v => v.toLowerCase() === URLRef.toLowerCase()) || false
            return false
        },
        getTokenObj = (charRef, funcName = false) => {
            const charObj = D.GetChar(charRef, funcName)
            if (charObj)
                return (findObjs({_pageid: D.PAGEID, _type: "graphic", _subtype: "token", represents: charObj.id}) || [false])[0]
            return VAL({string: funcName}) && THROW(`No character found for reference ${charRef}`, `${D.JSL(funcName)} > getTokenObj`)
        },
        getTokenObjs = (charRef) => {
            const charObjs = D.GetChars(charRef),
                tokenObjs = _.compact(charObjs).map(x => x && getTokenObj(x))
            return tokenObjs
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
            const allImgObjsFilter = {
                _pageid: D.PAGEID,
                _type: "graphic"
            }
            for (const key of _.intersection(_.keys(options), ["subtype", "_subtype", "layer", "name"]))
                allImgObjsFilter[key.replace(/^sub/gu, "_sub")] = options[key]            
            const contImgObjs = _.compact(findObjs(allImgObjsFilter).filter(v => {
                for (const key of _.intersection(_.keys(options), ["imgsrc", "represents", "left", "top", "width", "height", "controlledby"])) {
                    if (_.isEmpty(v.get(key)) || isRegImg(v) && !isObjActive(v))
                        return false
                    if (options[key] !== true && !v.get(key).toLowerCase().includes(options[key].toLowerCase()))
                        return false                    
                }
                if (checkBounds(locRef, v, options.padding || 0))
                    return true
                return false
            }))
            // D.Alert(`Checking ${D.JS(locRef)}, Returning ${D.JS(_.compact(contImgObjs.map(v => D.GetChar(v))))} (${_.compact(contImgObjs.map(v => D.GetChar(v))).length} chars)`)
            if (options.isCharsOnly)
                return _.compact(contImgObjs.map(v => D.GetChar(v)))
            return contImgObjs
        },
        getZLevels = () => {
            const zLevels = {
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
                    zLevels[cat].push(...getArray(ZLEVELS[cat][key], key))
            return zLevels
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
        addImgSrc = (imgSrcRef, imgName, srcName, isSilent = false) => {
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
                    if (!isSilent)
                        D.Alert(`Img '${D.JS(srcName)}' added to category '${D.JS(imgName)}'.<br><br>Source: ${D.JS(imgSrc)}`)
                }
            } catch (errObj) {
                THROW("", "addImgSrc", errObj)
            }
        },
        addTokenSrc = (tokenSrcRef, charRef, srcName = false) => {
            const charObj = D.GetChar(charRef),
                tokenSrc = (VAL({string: tokenSrcRef}) && tokenSrcRef.includes(".png") ? tokenSrcRef || "" : (getImgObj(tokenSrcRef) || {get: () => ""}).get("imgsrc")).replace(/[^/]*\.png/gu, "thumb.png")
            DB({charObj, tokenSrc}, "addTokenSrc")
            if (VAL({charObj, string: tokenSrc}) && tokenSrc.includes("png")) {
                const tokenKey = charObj.get("name"),
                    tokenObj = getTokenObj(tokenKey)
                DB({tokenKey, tokenObj, isRandomizer: isRandomizerToken(tokenObj), isChar: isCharToken(tokenObj)}, "addTokenSrc")
                // isCharToken(tokenObj) && isRegToken(tokenObj) && REGISTRY.TOKEN[tokenObj.get("name")].srcs.randomSrcs && REGISTRY.TOKEN[tokenObj.get("name")].srcs.randomSrcs.length
                if (!srcName && isRandomizerToken(tokenObj)) {
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
        setTokenSrc = (charRef, srcName = "base") => {
            srcName = srcName === "" ? "base" : srcName
            const tokenObj = getTokenObj(charRef)
            if (VAL({tokenObj}) && isRegToken(tokenObj)) {
                const tokenName = tokenObj.get("name"),
                    tokenSrcs = REGISTRY.TOKEN[tokenName].srcs,
                    tokenSrcURL = tokenSrcs[srcName] || tokenSrcs[srcName.toLowerCase()]
                if (VAL({string: tokenSrcURL})) {
                    REGISTRY.TOKEN[tokenName].curSrc = srcName
                    tokenObj.set("imgsrc", tokenSrcURL)
                }
            }
        },
        toggleToken = (tokenRef, isActive) => {
            // NON-PERMANENT.
            if (isActive === null) return null
            const tokenObj = getTokenObj(tokenRef)
            if (VAL({token: tokenObj})) {
                if (isActive === true && tokenObj.get("layer") !== "objects")
                    tokenObj.set("layer", "objects")
                else if (isActive === false && tokenObj.get("layer") !== "walls")
                    tokenObj.set("layer", "walls")
                else
                    return false
                return true
            }
            return false
        },
        toggleTokens = (charRef, isActive) => {
            const charObj = charRef ? D.GetChar(charRef) : null,
                tokenObjs = charRef ? findObjs({
                    _pageid: D.PAGEID,
                    _type: "graphic",
                    _subtype: "token",
                    represents: charObj.id
                }) : findObjs({
                    _pageid: D.PAGEID,
                    _type: "graphic",
                    _subtype: "token"
                }).filter(x => x.get("represents"))
            DB({tokenObjs}, "toggleTokens")
            for (const tokenObj of tokenObjs) {
                DB(`Setting ${tokenObj} to ${isActive}`, "toggleTokens")
                if (VAL({token: tokenObj})) {
                    DB(`${tokenObj} is valid!`, "toggleTokens")
                    if (isActive === true && tokenObj.get("layer") !== "objects")
                        tokenObj.set("layer", "objects")
                    else if (isActive === false && tokenObj.get("layer") !== "walls")
                        tokenObj.set("layer", "walls")
                }
            }
        },
        combineTokenSrc = (charRef, srcName = "base") => {            
            const tokenObj = getTokenObj(charRef)
            if (VAL({tokenObj, string: srcName}) && isRegToken(tokenObj)) {
                const tokenName = tokenObj.get("name"),
                    tokenSrc = REGISTRY.TOKEN[tokenName].curSrc || "base",
                    splitTokenSrcs = D.Capitalize(tokenSrc).match(/[A-Z][a-z]*/gu)
                let newTokenSrcs = []
                if (D.LCase(srcName) === "base")
                    newTokenSrcs = ["base"]
                else if (splitTokenSrcs.includes(D.Capitalize(srcName)))
                    newTokenSrcs = _.without(splitTokenSrcs, D.Capitalize(srcName))
                else
                    newTokenSrcs = [..._.without(splitTokenSrcs, "Base"), D.Capitalize(srcName)]
                newTokenSrcs.sort()
                setTokenSrc(charRef, newTokenSrcs.join(""))
            }
        },
        regImg = (imgRef, imgName, srcName, activeLayer, options = {}, funcName = false, isSilent = false) => {
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
                imgObj.set({name, showname: false, isdrawing: options.isDrawing !== false})
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
                    modes: options.modes || C.MODEDEFAULTS(imgObj, params.modes),
                    isActive: true,
                    isSetToken: imgObj.get("represents") || options.isDrawing === false
                }
                if (options.modes)
                    REGISTRY.IMG[name].wasModeUpdated = true
                DB(`Modes for ${name}: ${D.JSL(REGISTRY.IMG[name].modes)}`, "regImg")
                if (srcName !== "none") {
                    addImgSrc(imgObj.get("imgsrc").replace(/med/gu, "thumb"), name, srcName, isSilent)
                    setImg(name, srcName.includes("ref:") ? "base" : srcName)
                }
                layerImgs([name], REGISTRY.IMG[name].activeLayer)
                if (options.isActive === false)
                    toggleImg(name, false, true)
                if (VAL({string: funcName}) && !isSilent)
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
                    REGISTRY.TOKEN[tokenKey].srcs = {
                        base: tokenBaseSrc,
                        randomSrcs: [ tokenBaseSrc ]
                    }
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
        makeImg = (imgName = "", params = {}, funcName = false, isSilent = false) => {
            const dataRef = C.IMAGES.defaults,
                imgObj = createObj("graphic", {
                    _pageid: params._pageID || D.PAGEID,
                    imgsrc: (params.imgsrc || C.IMAGES.blank).replace(/\/med\./gu, "/thumb."),
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
            DB({imgObj, options}, "makeImg")
            regImg(imgObj, imgName, params.imgsrc && params.imgsrc !== C.IMAGES.blank ? "base" : "blank", params.activeLayer || params.layer || "gmlayer", options, funcName, isSilent)
            return imgObj
        },
        setImg = (imgRef, srcRef, isToggling, isForcing = false) => {
            // D.Alert(`Getting ${D.JS(srcRef)} for ${D.JS(imgRef)} --> ${D.JS(REGISTRY[getImgData(imgRef).name].srcs[srcRef])}`, "MEDIA:SetImg")
            if (isToggling === true || isToggling === false)
                toggleImg(imgRef, isToggling, isForcing)
            if (srcRef === null || REGISTRY.ANIM[getImgKey(imgRef)])
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
                        if (isObjActive(imgData.name) && srcRef !== "blank")
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
                const tokenKey = D.GetName(tokenObj.get("represents")),
                    tokenSrcs = REGISTRY.TOKEN[tokenKey].srcs.randomSrcs
                let tokenNum = REGISTRY.TOKEN[tokenKey].randomSrcCount
                tokenNum++
                if (tokenNum >= tokenSrcs.length)
                    tokenNum = 0
                const tokenSrc = tokenSrcs[tokenNum]
                tokenObj.set("imgsrc", tokenSrc)
                REGISTRY.TOKEN[tokenKey].randomSrcCount = tokenNum
            }
        },
        cycleImg = (imgRef, isLooping = true, isReversing = false) => {
            const imgData = getImgData(imgRef)
            if (imgData && isCyclingImg(imgData.id)) {
                const srcIndex = Math.max(_.findIndex(imgData.cycleSrcs, x => x === imgData.curSrc), 0)
                let newIndex = srcIndex + (isReversing ? -1 : 1)
                if (newIndex < 0)
                    if (isLooping)
                        newIndex = imgData.cycleSrcs.length - 1
                    else
                        return false
                else if (newIndex >= imgData.cycleSrcs.length)
                    if (isLooping)
                        newIndex = 0
                    else
                        return false
                toggleImg(imgData.name, true)
                setImg(imgData.name, imgData.cycleSrcs[newIndex])
                return newIndex
            }
            return false
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
        resizeImgs = (imgRefs, axes = []) => {
            const imgObjs = imgRefs.map(x => getImgObj(x))
            for (const imgObj of imgObjs) {
                const dims = {height: STATE.REF.anchorObj.height, width: STATE.REF.anchorObj.width}
                if (axes.length === 1)
                    if (axes.includes("horiz") || axes.includes("width")) 
                        dims.height = imgObj.get("height") * (dims.width / imgObj.get("width"))
                    else if (axes.includes("vert") || axes.includes("height"))
                        dims.width = imgObj.get("width") * (dims.height / imgObj.get("height"))
                imgObj.set(dims)
            }
        },
        toggleImg = (imgRef, isActive, isForcing = false) => {
            // NON-PERMANENT.  If turning off, set activeSrc to curSrc.
            // Also, verify img status is changing before doing anything.
            if (isActive === null) return null
            const regRef = getRegistryRef(imgRef),
                imgData = getImgData(imgRef) || VAL({object: imgRef}) && {isActive: imgRef.get("layer") === "walls"},
                modeData = getModeData(imgRef, Session.Mode)
            if (VAL({list: [imgData, modeData]}, "toggleImg", true)) {
                let activeCheck = null
                if ((isActive === true || isActive !== false && !imgData.isActive) && modeData.isForcedOn !== "NEVER")
                    activeCheck = true
                else if (isActive === false || isActive !== true && imgData.isActive || modeData.isForcedOn === "NEVER" && imgData.isActive)
                    activeCheck = false
                if (activeCheck === null || !isForcing && imgData.isActive === activeCheck)
                    return null
                const imgObj = getImgObj(imgData.name) || VAL({graphicObj: imgRef}) && imgRef
                DragPads.Toggle(imgData.name, activeCheck, true)
                if (activeCheck === false) {
                    // TURN OFF: Set layer to walls, toggle off associated drag pads, update activeState value
                    if (REGISTRY.IMG[imgData.name])
                        regRef[imgData.name].activeSrc = imgData.curSrc === "blank" && imgData.activeSrc || imgData.curSrc
                    regRef[imgData.name].isActive = false
                    setLayer(imgObj, "walls", isForcing)
                    return false                   
                } else if (activeCheck === true) {
                    // TURN ON: Set layer to active layer, toggle on associated drag pads, restore activeState value if it's different
                    regRef[imgData.name].isActive = true
                    // if (imgData.curSrc === "blank" && imgData.activeSrc !== "blank")
                    //    setImg(imgData.name, imgData.activeSrc)
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
        checkDragPads = () => {
            const reportLines = [],
                allImgObjs = findObjs({
                    _type: "graphic",
                    _pageid: D.PAGEID
                }),
                allPadObjs = allImgObjs.filter(x => x.get("name").endsWith("_Pad") || x.get("name").endsWith("_PartnerPad")),
                allPadIDs = allPadObjs.map(x => x.id),
                mediaDragPadIDs = D.KeyMapObj(_.omit(REGISTRY.IMG, (v) => !v.padID && !v.partnerID), (k, v) => v.id, (v) => [v.padID, v.partnerID]),
                dpadDragPadIDs = _.uniq(Object.keys(DragPads.PadsByID))
            // Step 1) Check DragPads. Make sure they are listed in REGISTRY.IMG **AND** DragPads stateref.
            if (_.isEqual(_.uniq(_.flatten(_.values(mediaDragPadIDs))).sort(), dpadDragPadIDs.sort()) && _.isEqual(dpadDragPadIDs.sort(), allPadIDs.sort())) {
                D.Alert("All Pads Equal!", "Drag Pad Check")
            } else {
                const missingDragPadIDs = _.without(dpadDragPadIDs, ..._.uniq(_.flatten(_.values(mediaDragPadIDs))))
                reportLines.push(...missingDragPadIDs.map(x => `<b>${DragPads.PadsByID[x].name}</b> (${x})`))
                D.Alert(`Pad List DOES NOT Equal.<br><br><b>Found ${allPadIDs.length} Pads.<br>${_.uniq(_.flatten(_.values(mediaDragPadIDs))).length} Pads in REGISTRY.<br>${dpadDragPadIDs.length} Pads in DRAGPADS.<br><br>${reportLines.join("<br>")}`, "Drag Pad Check")
            }
            return reportLines
            /* for (const [imgName, padIDs] of Object.entries(mediaDragPadIDs)) {
                if (padIDs.length === 2) {
                    const imgID = getImgData(imgName).id
                    // Step 1A) Check pads in IMG Registry against DragPads.PadsByID:
                    if (!DragPads.PadsByID[padIDs[0]])
                        reportLines.push(`[PAD.byID] ${imgName} Pad Missing: ${padIDs[0]}`)
                    if (!DragPads.PadsByID[padIDs[1]])
                        reportLines.push(`[PAD.byID] ${imgName} Partner Pad Missing: ${padIDs[1]}`)
                    if (DragPads.PadsByID[padIDs[0]].id !== imgID)
                        reportLines.push(`[PAD.byID] ${imgName} ID does not match Pad`)
                    if (DragPads.PadsByID[padIDs[1]].id !== imgID)
                        reportLines.push(`[PAD.byID] ${imgName} ID does not match Partner Pad`)
                    // Step 1B) Check pads in IMG Registry against DragPads.PadsByGraphic:
                    if (!DragPads.PadsByGraphic[imgID]) {
                        reportLines.push(`[PAD.byGPX] ${imgName} is not registered in DragPads.byGraphic.`)
                    } else {
                        if (DragPads.PadsByGraphic[imgID].id !== padIDs[0])
                            reportLines.push(`[PAD.byGPX] ${imgName} DP.byGPX[id].id doesn't match Pad.`)
                        if (DragPads.PadsByGraphic[imgID].pad.partnerID !== padIDs[1])
                            reportLines.push(`[PAD.byGPX] ${imgName} DP.byGPX[id].pad.partnerID doesn't match Partner Pad.`)
                    }
                    // Step 1C) Check IMG Registry values of padID and partnerID.
                    if (REGISTRY.IMG[imgName].padID !== padIDs[0])
                        reportLines.push(`[PAD-IMG] ${imgName}'s padID does not match pad.`)
                } else if (padIDs.length === 1) {
                    reportLines.push(`[PAD] ${imgName} has only one registered pad.`)
                } else if (padIDs.length === 0) {
                    continue
                } */
        },
        clearMissingRegImgs = () => {
            const returnLines = []
            for (const imgName of _.keys(REGISTRY.IMG))
                if (!getImgObj(imgName))
                    returnLines.push(`... ${imgName} Missing Object, Removing: ${removeImg(imgName) ? "<span style='color: green;'><b>OK!</b></span>" : "<span style='color: red;'><b>ERROR!</b></span>"}`)
            
            if (returnLines.length)
                STATE.REF.fixAllCommands.push(...["<h3><u>Removing Unlinked Image Registry Entries</u></h3>", ...returnLines])
        },
        resetBGImgs = () => {                                        
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
        },
        clearUnregImgs = (isKilling = false) => {
            const returnLines = [],
                allImgObjs = findObjs({
                    _pageid: D.PAGEID,
                    _type: "graphic",
                }),
                regPadIDs = Object.values(REGISTRY.IMG).filter(x => x.padID).map(x => x.padID),
                regPartnerIDs = Object.values(REGISTRY.IMG).filter(x => x.partnerID).map(x => x.partnerID),
                allRegIDs = [..._.values(REGISTRY.GRAPHIC).map(x => x.id), ...regPadIDs, ...regPartnerIDs],
                unregImgObjs = allImgObjs.filter(x => !isRegToken(x) && !allRegIDs.includes(x.id))
            
            // D.Alert(`RegPadIDs: ${D.JSL(regPadIDs)}<br><br>PartnerIDs: ${D.JSL(regPartnerIDs)}`)
            for (const imgObj of unregImgObjs) {
                returnLines.push(`<b>${imgObj.get("name") || "(UNNAMED)"}</b> <span style='color: red;'><b>REMOVED</b></span>`)
                if (isKilling)
                    imgObj.remove()
            }
            if (returnLines.length)
                STATE.REF.fixAllCommands.push(...["<h3><u>Clearing Unregistered Image Objects</u></h3>", ...returnLines])
        },

        /* 
[ "-LuoUwMHyI6ZViqrma_Z", "MapIndicator" ],
[ "-LuoOxRVO8zHo0P8KTUA", "Roller_WPReroller_1" ],
[ "-LuoPFV7RE1S9FnuwReL", "Roller_WPReroller_2" ],
[ "-LuRnZH1BWXIBnCjVtbB", "MapIndicator" ],
[ "-LuSj1IYVo8KkDG9-a7z", "Roller_WPReroller_2" ],
[ "-LuSkRA6ocG72823ydzY", "Roller_WPReroller_1" ] */

        fixImgObjs = () => {
            // D.Alert(`Starting FixImgObjects: ${D.JS(REGISTRY.ANIM.MapIndicator.isActive)}`)
            const imgKeys = [..._.keys(REGISTRY.IMG), ..._.keys(REGISTRY.ANIM)],
                imgPairs = _.zip(imgKeys.map(x => REGISTRY.IMG[x] || REGISTRY.ANIM[x]), imgKeys.map(x => getObj("graphic", (REGISTRY.IMG[x] || REGISTRY.ANIM[x]).id))),
                reportLines = []
            // D.Alert(`Beginning Checks: ${D.JS(REGISTRY.ANIM.MapIndicator.isActive)}`)
            for (const [imgData, imgObj] of imgPairs) {
                const reportStrings = [],
                    regRef = getRegistryRef(imgData.name)
                if (!isRegToken(imgObj) && !imgData.isSetToken && imgObj.get("isdrawing") !== true) {
                    reportStrings.push(`Non-token ${imgData.name} not set to drawing --> Updating <b><u>OBJECT</u></b>`)
                    reportStrings.push(`...${isRegToken(imgObj)}, ${D.JS(imgData.isSetToken)}, ${imgObj.get("isdrawing")}`)
                    imgObj.set("isdrawing", true)
                }                
                if ((isRegToken(imgObj) || imgData.isSetToken) && imgObj.get("isdrawing") === true) {
                    reportStrings.push(`Set-token ${imgData.name} set to drawing --> Updating <b><u>OBJECT</u></b>`)
                    reportStrings.push(`...${isRegToken(imgObj)}, ${D.JS(imgData.isSetToken)}, ${imgObj.get("isdrawing")}`)
                    imgObj.set("isdrawing", false)
                }
                if (imgData.isActive !== true && imgData.isActive !== false) {
                    reportStrings.push(`Invalid 'isActive' (${D.JS(imgData.isActive)}). On '${imgObj.get("layer")}' SO Setting ${imgObj.get("layer") === "walls" ? "FALSE" : "TRUE"}`)
                    regRef[imgData.name].isActive = imgObj.get("layer") !== "walls" 
                }
                if (imgData.isActive === true && imgObj.get("layer") === "walls") {
                    reportStrings.push(`Active object on 'walls' --> moving to '${D.JS(imgData.activeLayer)}'`)
                    imgObj.set("layer", imgData.activeLayer)
                }
                if (imgData.isActive === false && imgObj.get("layer") !== "walls") {
                    reportStrings.push(`Inactive object on '${imgObj.get("layer")}' --> moving to 'walls'`)
                    imgObj.set("layer", "walls")
                }  
                if (!isRegAnim(imgObj)) {
                    const srcURL = getURLFromSrc(imgData.curSrc, getImgSrcs(imgData.name))
                    if (srcURL !== imgObj.get("imgsrc")) {
                        reportStrings.push(`Image source URL doesn't match registry source (= ${D.JS(imgData.curSrc)}) --> Updating <b><u>OBJECT</u></b>`)
                        imgObj.set("imgsrc", srcURL)
                    }
                    const srcRef = getSrcFromURL(imgObj.get("imgsrc"), getImgSrcs(imgData.name))
                    if (srcRef !== imgData.curSrc) {
                        reportStrings.push(`Registry source (${D.JS(imgData.curSrc)}) doesn't match object source (${D.JS(srcRef)}) --> Updating <b><u>REGISTRY</u></b>`)
                        regRef[imgData.name].curSrc = srcRef
                    }
                    setImg(imgData.name, imgData.curSrc, null, true)
                }
                toggleImg(imgData.name, imgData.isActive, true)
                if (reportStrings.length)
                    reportLines.push(`<b>${imgData.name}</b>: ${reportStrings.join(", ")}`)
            }
            
            if (reportLines.length)
                STATE.REF.fixAllCommands.push(...["<h3><u>Final Image Object Pass</u></h3>", ...reportLines])
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
            if (!imgRef) return false
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
            DB({leftImgRef, rightImgRef, midImgRefOrRefs, width, minOverlap, maxOverlap}, "spreadImgs")
            midImgRefOrRefs = _.flatten([midImgRefOrRefs])
            const [leftObj, rightObj, ...midObjs] = [getImgObj(leftImgRef), getImgObj(rightImgRef), ...midImgRefOrRefs.map(x => getImgObj(x))],
                [leftData, rightData, ...midData] = [leftObj, rightObj, ...midObjs].map(x => isRegImg(x) && getImgData(x) || {id: x.id, name: x.get("name"), left: x.get("left"), width: x.get("width"), leftEdge: x.get("left") - 0.5*x.get("width"), rightEdge: x.get("left") + 0.5*x.get("width")})
            if (!VAL({number: width})) {
                const [startPos, endPos] = [leftData.left, rightData.left],
                    buffer = (endPos - startPos) / (midObjs.length + 1)
                for (let i = 0; i < midObjs.length; i++)
                    setImgTemp(midObjs[i], {left: startPos + (i+1)*buffer})
                return true
            }
            const spread = parseFloat(VAL({number: width}) ? width : rightData.left - leftData.left)
            let dbString = `Width: ${spread}, MinOverlap: ${parseFloat(minOverlap)}, MaxOverlap: ${parseFloat(maxOverlap)}<br><br>`
            DB(`minOverlap: ${minOverlap}, maxOverlap: ${maxOverlap}`)
            if (VAL({list: [leftData, rightData, ...midData], number: [spread]}, "spreadImgs", true)) {
                for (const imgRef of [leftData.name, rightData.name])
                    toggleImg(imgRef, true)
                setImgTemp(leftData.id, {left: leftData.left})
                dbString += `Setting Left to {left: ${D.Int(leftData.left)}}<br>`
                // If the spread is smaller than the combined width of the bookends, then set the minimum possible spread and blank all mid imgs.
                if (spread <= leftData.width + rightData.width - maxOverlap) {
                    dbString += `Spread ${D.Int(spread)} less than ${D.Int(leftData.width + rightData.width - 2*maxOverlap)} (${D.Int(leftData.width)} + ${D.Int(rightData.width)} - ${2*D.Int(maxOverlap)})<br>`
                    for (const imgData of midData)
                        toggleImg(imgData.id, false)
                    DB(`${dbString }Setting Right to {left: ${D.Int(leftData.rightEdge)} + 0.5x${D.Int(rightData.width)} - ${D.Int(maxOverlap)} = ${D.Int(leftData.rightEdge + 0.5*rightData.width) - D.Int(maxOverlap)}`, "spreadImgs")
                    return setImgTemp(rightData.id, {
                        left: leftData.rightEdge + 0.5*rightData.width - maxOverlap
                    })
                }
                // Otherwise, determine how much space will be in the middle.  Does NOT count overlap of left and right sides.
                let totalMidWidth = spread - leftData.width - rightData.width + 2*minOverlap
                dbString += `Total Mid Width = ${D.Int(totalMidWidth)} (spr:${D.Int(spread)} - L.w:${D.Int(leftData.width)} - R.w:${D.Int(rightData.width)})<br>`
                /* if (midData.length === 1) {
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
                } else { */

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
                while (coveredSpread < totalMidWidth)
                    if (midData.length) {
                        toggleImg(_.last(midData).id, true)                    
                        setImg(_.last(midData).id, "base", true, true)
                        midImgIDs.push(midData.pop().id)
                        coveredSpread += maxCover
                        dbString += `... adding ${getImgKey(_.last(midImgIDs))} (cover: ${D.Int(coveredSpread)}), ${midData.length} remaining<br>`
                    } else {
                        dbString += `Ran out of mid images! ${totalMidWidth - coveredSpread} to cover!`
                        totalMidWidth = coveredSpread
                        break
                    }
                
                // Now divide up the spread among the imgs, and check that each img's cover is between min and max:
                const spreadPerImg = totalMidWidth / midImgIDs.length

                // Toggle off unused mid sections
                while (midData.length) {
                    dbString += `... turning off ${_.last(midData).name}<br>`
                    toggleImg(midData.pop().id, false)                        
                }
                dbString += "<br>"

                dbString += `SPI = ${D.Int(spreadPerImg)} = TMW:${D.Int(totalMidWidth)} / #Mids:${midImgIDs.length}<br>`
                if (spreadPerImg < minCover || spreadPerImg > maxCover)
                    THROW(`Unable to spread given images over spread ${spread}: per-img spread of ${spreadPerImg} outside bounds of ${minCover} - ${maxCover}`, "spreadImgs")
                // Get the actual overlap between imgs, dividing by two to get the value for one side,
                // and use this number to get the left position for the first middle img.
                const sideOverlap = 0.5*(midImgWidth - spreadPerImg),
                    firstMidLeft = leftData.rightEdge - 2*sideOverlap + 0.5*midImgWidth
                dbString += `Side Overlap: ${D.Int(sideOverlap)} = 0.5x(M.w:${D.Int(midImgWidth)} - SPI:${D.Int(spreadPerImg)})<br>`
                dbString += `L.l: ${D.Int(leftData.left)}, L.re: ${D.Int(leftData.rightEdge)}, firstMidLeft: ${D.Int(firstMidLeft)} (L.re - sO:${D.Int(sideOverlap)} + 0.5xM.w:${D.Int(midImgWidth)})<br><br>`
                dbString += `LEFT: ${D.Int(leftData.left - 0.5 * leftData.width)} - ${D.Int(leftData.rightEdge)}<br>`
                // Turn on each midImg being used and set the left positioning of each mid img by recursively adding the spreadPerImg:
                let lastRightEdge = D.Int(leftData.rightEdge),
                    currentLeft = firstMidLeft
                for (const imgID of midImgIDs) {
                    setImgTemp(imgID, {
                        left: currentLeft
                    })
                    dbString += `... Spreading Mid ${getImgKey(imgID).replace(/^.*_(\d\d?)$/gu, "$1")} to ${D.Int(currentLeft - 0.5 * midImgWidth)} - ${D.Int(currentLeft + 0.5 * midImgWidth)} (-${lastRightEdge - D.Int(currentLeft - 0.5 * midImgWidth)})<br>`
                    lastRightEdge = D.Int(currentLeft + 0.5 * midImgWidth)
                    currentLeft += spreadPerImg
                    // testVertSpread += 5
                }
                
                // Finally, set the position of the rightmost img to the far side of the total width:
                setImgTemp(rightData.id, {
                    left: leftData.leftEdge + totalMidWidth + leftData.width + rightData.width - 2*minOverlap - 0.5*rightData.width
                })
                dbString += `RIGHT: ${D.Int(leftData.leftEdge + totalMidWidth + leftData.width + rightData.width - 2*minOverlap - 0.5*rightData.width - 0.5 * rightData.width)} - ${D.Int(leftData.leftEdge + totalMidWidth + leftData.width + rightData.width - 2*minOverlap - 0.5*rightData.width + 0.5 * rightData.width)} (${lastRightEdge - D.Int(leftData.leftEdge + totalMidWidth + leftData.width + rightData.width - 2*minOverlap - 0.5*rightData.width - 0.5 * rightData.width)})`
                DB(dbString, "spreadImgs")
                // for (const imgData of midData)
                //    setImg(imgData.id, "blank")
                return true
                // }
            }
            return false
        },
    // #endregion

    // #region ANIMATIONS: Creating, Timeouts, Controlling WEBM Animations
        isRegAnim = animRef => {
            const imgObj = getImgObj(animRef)
            return imgObj && imgObj.get("name") in REGISTRY.ANIM
        },
        regAnimation = (imgObj, animName, timeOut = 0, activeLayer = "map") => {
            if (VAL({imgObj}, "regAnimation")) {
                imgObj.set("name", animName)
                imgObj.set("layer", activeLayer)
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
                    isActive: true,
                    soundEffect: null,
                    isAnimation: true
                }
                REGISTRY.ANIM[animName].leftEdge = REGISTRY.ANIM[animName].left - 0.5 * REGISTRY.ANIM[animName].width
                REGISTRY.ANIM[animName].rightEdge = REGISTRY.ANIM[animName].left + 0.5 * REGISTRY.ANIM[animName].width
                REGISTRY.ANIM[animName].topEdge = REGISTRY.ANIM[animName].top - 0.5 * REGISTRY.ANIM[animName].height
                REGISTRY.ANIM[animName].bottomEdge = REGISTRY.ANIM[animName].top + 0.5 * REGISTRY.ANIM[animName].height
            }
        },
        setAnimData = (animRef, params) => {
            const imgKey = getImgKey(animRef)
            if (VAL({string: imgKey}, "setAnimData")) {
                _.each(params, (v, k) => {
                    REGISTRY.ANIM[imgKey][k] = v
                })
                getImgObj(imgKey).set(params)
                return REGISTRY.ANIM[imgKey]
            }
            return false
        },
        setAnimTimerData = (animName, minTimeBetween = 0, maxTimeBetween = 100, soundEffect = null, validModes = "Active") => {
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
                    playSound(animData.soundEffect, undefined, undefined, true)
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
        toggleAnimation = (animName, isActive) => {
            const animData = getImgData(animName),
                animObj = getImgObj(animName)
            DB({animData, animObj}, "toggleAnimation")
            if (isActive) {
                DB("Setting to MAP", "toggleAnimation")
                animObj.set("layer", "map")
                REGISTRY.ANIM[animData.name].isActive = true
            } else {
                DB("Setting to WALLS", "toggleAnimation")
                animObj.set("layer", "walls")
                REGISTRY.ANIM[animData.name].isActive = false
            }
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
        isRegText = textRef => Boolean(getTextKey(textRef, true)) || VAL({object: textRef}) && _.findKey(REGISTRY.TEXT, v => v.shadowID === textRef.id), 
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
        getTextWidth = (textRef, text, maxWidth = 0, isSilent = true) => {
            const textObj = getTextObj(textRef),
                dbLines = [
                    `<b>TEXTREF:</b> ${D.JSL(textRef)}`,
                    `<b>TEXT:</b> ${D.JSL(text).replace(/ /gu, "⸰")}`,
                    `<b>MAXWIDTH:</b> ${D.JSL(maxWidth)}`,
                    ""
                ]
            if (VAL({textObj}, "getTextWidth")) {
                const textData = getTextData(textObj),
                    maxW = textData && textData.maxWidth || maxWidth || 0,
                    textString = text === "" ? "" : text && `${text}` || textObj && textObj.get && `${textObj.get("text")}` || false,
                    font = textObj.get("font_family").split(" ")[0].replace(/[^a-zA-Z]/gu, ""),
                    size = textObj.get("font_size"),
                    chars = textString.split(""),
                    fontRef = D.CHARWIDTH[font],
                    charRef = fontRef && fontRef[size]
                let width = 0
                dbLines.push(chars.length === textString.length ? "TEXT OK!" : `TEXT LENGTH MISMATCH: ${chars.length} chars, ${textString.length} text length.<br>`)
                if (!textString || textString === "" || textString.length === 0) {
                    dbLines.push("Empty/Blank Text String: Returning '0'.")
                    DB(dbLines.join("<br>"), "getTextWidth")
                    return 0
                }
                if (!fontRef || !charRef) {
                    dbLines.push(`No font/character reference for '${font}' at size '${size}': Returning default`, "getTextWidth")
                    DB(dbLines.join("<br>"), "getTextWidth")
                    return textString.length * (D.Int(textObj.get("width")) / textObj.get("text").length)
                }
                let textLines = []
                if (maxWidth !== false && maxW)
                    textLines = _.compact(splitTextLines(textObj, textString, maxW, textData && textData.justification))
                else if (maxWidth !== false && textString && textString.includes("\n"))
                    textLines = textString.split(/\n/gu).filter(x => x || x === "" || x === 0).map(x => x.trim())
                if (textLines.length) {
                    dbLines.push(`Text split into text lines:<br>${textLines.map(x => `▐${x.replace(/ /gu, "⸰")}▌ ► ${x.length} Chars`).join("<br>")}`)
                    let maxLine = textLines[0]
                    dbLines.push("Iterating Max-Line...")
                    for (const textLine of textLines) {
                        dbLines.push(`... MAX: ${D.Round(getTextWidth(textObj, maxLine, false, true), 2)} vs. TEXT: ${D.Round(getTextWidth(textObj, textLine, false, true), 2)}`)
                        maxLine = getTextWidth(textObj, maxLine, false, true) < getTextWidth(textObj, textLine, false, true) ? textLine : maxLine
                    }
                    dbLines.push(`Max Line: ▐${maxLine}▌ ► Returning maxline width (${D.Round(getTextWidth(textObj, maxLine, false, true),2)})`)
                    if (!isSilent)
                        DB(dbLines.join("<br>"), "getTextWidth")
                    return getTextWidth(textObj, maxLine, false, true)
                }
                let charString = ""
                for (const char of chars) {
                    charString += char
                    if (char !== "\n" && !charRef[char])
                        DB(`... MISSING '${char}' in '${font}' at size '${size}'`, "getTextWidth")
                    else
                        width += charRef[char]                    
                }
                dbLines.push(`Chars measured: ▐${charString}▌ ► Returning width (${D.Round(width, 2)}`)
                if (!isSilent)
                    DB(dbLines.join("<br>"), "getTextWidth")
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
            if (VAL({textObj}, "splitTextLines")) {
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
            }
            return [text]
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
                                                     isActive: true}, _.omit(options, (v, k) => ["text", "layer", "_type", "obj", "object", "isActive", "modes"].includes(k) || v === undefined))
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
                if (options.isActive === false)
                    toggleText(name, false, true)    
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
                    REGISTRY.TEXT[textData.name].width = getTextWidth(textKey, textParams.text, textData.maxWidth)
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
            const textData = getTextData(textRef),
                modeData = getModeData(textRef, Session.Mode)
            if (VAL({list: [textData, modeData]}, "toggleText", true)) {
                let activeCheck = null
                if ((isActive === true || isActive !== false && !textData.isActive) && modeData.isForcedOn !== "NEVER")
                    activeCheck = true
                else if (isActive === false || isActive !== true && textData.isActive || modeData.isForcedOn === "NEVER" && textData.isActive)                    
                    activeCheck = false
                DB(`ToggleText(${D.JSL(textRef)}, ${D.JSL(isActive)}, ${D.JSL(isForcing)})<br>... Active Check: ${D.JSL(activeCheck)}, textData.isActive: ${D.JSL(textData.isActive)}`, "toggleText")
                if (activeCheck === null || !isForcing && textData.isActive === activeCheck)
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
                if (shadowObj && (!isUnregOnly || isStillKillingShadow))
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
        clearMissingRegText = () => {
            const returnLines = []
            for (const textName of _.keys(REGISTRY.TEXT))
                if (!getTextObj(textName))
                    returnLines.push(`... ${textName} Missing Object, Removing: ${removeText(textName) ? "<span style='color: green;'><b>OK!</b></span>" : "<span style='color: red;'><b>ERROR!</b></span>"}`)
            if (returnLines.length)
                STATE.REF.fixAllCommands.push(...["<h3><u>Removing Unlinked Text Registry Entries</u></h3>", ...returnLines])
        },
        clearUnregText = (isKilling = false) => {
            const returnLines = [],
                allTextObjs = findObjs({
                    _pageid: D.PAGEID,
                    _type: "text",
                }),
                unregTextObjs = allTextObjs.filter(x => !isRegText(x))
            for (const textObj of unregTextObjs) {
                returnLines.push(`"<span style='color: ${textObj.get("color")}; background-color: #AAAAAA;'> ${textObj.get("text").slice(0, 15)}... </span>" <span style='color: red;'><b>REMOVED</b></span>`)
                if (isKilling)
                    textObj.remove()
            }
            if (returnLines.length)
                STATE.REF.fixAllCommands.push(...["<h3><u>Clearing Unregistered Text Objects</u></h3>", ...returnLines])
        },
        resetTextRegistry = () => {
            STATE.REF.textregistry = {}
            STATE.REF.idregistry = {}
        },
        fixTextObjs = () => {
            const textKeys = _.keys(REGISTRY.TEXT),
                textPairs = _.zip(textKeys.map(x => REGISTRY.TEXT[x]), textKeys.map(x => getObj("text", REGISTRY.TEXT[x].id))),
                reportLines = []
            for (const [textData, textObj] of textPairs) {
                const reportStrings = []
                if (!textData.isActive && textData.isActive !== false) {
                    reportStrings.push(`Missing 'isActive' --> On '${textObj.get("layer")}' SO Setting ${textObj.get("layer") === "walls" ? "FALSE" : "TRUE"}`)
                    REGISTRY.TEXT[textData.name].isActive = textObj.get("layer") !== "walls" 
                }
                if (textData.isActive && textObj.get("layer") === "walls") {
                    reportStrings.push(`Active object on 'walls' --> Moving to '${D.JS(textData.activeLayer)}`)
                    textObj.set("layer", textData.activeLayer)
                }
                if (!textData.isActive && textObj.get("layer") !== "walls") {
                    reportStrings.push(`Inactive object on '${textObj.get("layer")}' --> Moving to 'walls'`)
                    textObj.set("layer", "walls")
                }
                if (textData.curText !== textObj.get("text"))
                    if (VAL({string: textData.curText})) {                        
                        reportStrings.push(`Object text (<span style='background-color: #AAAAAA;'> ${D.JS(textObj.get("text"))} </span>) doesn't match registry text (<span style='background-color: #AAAAAA;'> ${D.JS(textData.curText)} </span>) --> Updating <b><u>OBJECT</u></b>`)
                        textObj.set("text", textData.curText)
                    } else {
                        reportStrings.push(`Registry text (<span style='background-color: #AAAAAA;'> ${D.JS(textData.curText)} </span>) doesn't match object text (<span style='background-color: #AAAAAA;'> ${D.JS(textObj.get("text"))} </span>) --> Updating <b><u>REGISTRY</u></b>`)
                        REGISTRY.TEXT[textData.name].text = textObj.get("text")
                    }
                toggleText(textData.name, textData.isActive, true)
                setText(textData.name, textData.curText, null, true)                
                if (reportStrings.length)
                    reportLines.push(`<b>${textData.name}</b>: ${reportStrings.join("♦")}`)
            }
            if (reportLines.length)
                STATE.REF.fixAllCommands.push(...["<h3><u>Final Text Object Pass</u></h3>", ...reportLines])
        },
    // #endregion

    // #region SOUND OBJECT GETTERS: Track Object, Playlist Object, Data Retrieval
        isRegSound = (soundRef) => Boolean(REGISTRY.SOUND[getSoundKey(soundRef) || ""]),
        isRegPlaylist = (playlistRef) => Boolean(REGISTRY.PLAYLIST[getPlaylistKey(playlistRef) || ""]),
        isSoundPlaying = (soundRef) => {
            const soundObj = getSoundObj(soundRef)
            return VAL({object: soundObj}) && soundObj.get("playing")
        },
        isSoundLooping = (soundRef) => {
            const soundObj = getSoundObj(soundRef)
            return VAL({object: soundObj}) && soundObj.get("playing") && soundObj.get("loop")
        },

        getSoundKey = (soundRef) => {
            if (VAL({object: soundRef})) {
                const soundKey = _.keys(REGISTRY.SOUND).findIndex(x => x.id === soundRef.id)
                return soundKey || soundRef.get("name")
            }
            if (VAL({string: soundRef})) {
                if (REGISTRY.SOUND[soundRef])
                    return soundRef
                const soundObj = getObj("jukeboxtrack", soundRef)
                return soundObj || false
            }
            return false
        },
        getSoundObj = (soundRef) => {
            if (VAL({object: soundRef}) && soundRef.get("_type") === "jukeboxtrack")
                return soundRef
            const soundKey = getSoundKey(soundRef)
            if (REGISTRY.SOUND[soundKey || ""])
                return getObj("jukeboxtrack", REGISTRY.SOUND[soundKey].id)
            if (VAL({string: soundRef})) {
                const soundObj = getObj("jukeboxtrack", soundRef)
                return soundObj || false
            }
            return false
        },
        getSoundData = (soundRef) => {
            const soundKey = getSoundKey(soundRef)
            return REGISTRY.SOUND[soundKey || ""] || false
        },
        getPlaylistKey = (playlistRef) => VAL({string: playlistRef}) && REGISTRY.PLAYLIST[playlistRef],
        getPlaylistTracks = (playlistRef, isPlayingOnly = false) => {
            const playlistData = getPlaylistData(playlistRef)
            return VAL({list: playlistData}) && isPlayingOnly ? playlistData.tracks.filter(x => isSoundPlaying(x)) : playlistData.tracks
        },
        getPlaylistData = (playlistRef) => VAL({string: playlistRef}) && getPlaylistKey(playlistRef),
        getRandomSoundKey = (playlistRef, excludeSoundRef, isExcludingPlaying = true) => {
            const playlistData = getPlaylistData(playlistRef)
            if (VAL({list: playlistData})) {
                const randTrackName = _.sample(_.compact(playlistData.tracks.filter(x => (!excludeSoundRef || !getSoundKey(excludeSoundRef) !== x) && (!isExcludingPlaying || !isSoundPlaying(x)))))
                return VAL({string: randTrackName}) && randTrackName
            }
            return false
        },
        getPlayingSounds = () => Object.keys(REGISTRY.SOUND).filter(x => isSoundPlaying(x)),
        getLoopingSounds = () => Object.keys(REGISTRY.SOUND).filter(x => isSoundLooping(x)),
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
        regSound = (objRef, soundName, playlistRef = null, isLooping = true, volume = 100) => {
            const soundObj = getSoundObj(objRef)
            if (soundObj) {
                REGISTRY.SOUND[soundName] = {
                    id: soundObj.id,
                    name: soundName,
                    volume,
                    isLooping
                }
                if (isRegPlaylist(playlistRef))
                    addSoundToPlaylist(soundName, playlistRef)
                D.Alert(`Registered Sound: ${D.JS(REGISTRY.SOUND[soundName])}`, "Register Sound")
            }
        },
        regPlaylist = (playlistName, defaultVolume = 100, isPlaylistLooping = true, canPlaylistOverlap = false, isPlaylistRandom = true) => {
            if (VAL({string: playlistName}))
                REGISTRY.PLAYLIST[playlistName] = {
                    name: playlistName,
                    volume: defaultVolume,
                    isLooping: isPlaylistLooping,
                    canOverlap: canPlaylistOverlap,
                    isRandom: isPlaylistRandom,
                    tracks: [],
                    currentTrack: null
                }
        },
        addSoundToPlaylist = (soundRef, playlistRef) => {
            const soundKey = getSoundKey(soundRef),
                playlistKey = getPlaylistKey(playlistRef)
            if (VAL({string: [soundKey, playlistKey]}, null, true)) {
                REGISTRY.SOUND[soundKey].playlist = playlistKey
                REGISTRY.PLAYLIST[playlistKey].tracks = _.uniq([...REGISTRY.PLAYLIST[playlistKey].tracks, soundKey])
                D.Alert(`Added <b>${D.JS(soundKey)}</b> to playlist <b>${D.JS(playlistKey)}</b>`, "Add Track to Playlist")
            }
        },
        updateSounds = (isDoubleChecking = true) => {
            if (STATE.REF.isRunningSilent && STATE.REF.isRunningSilent !== "TOTALSILENCE")
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
                STATE.REF.isRunningSilent = "TOTALSILENCE"
                Roll20AM.StopSound("all")
            } else if (STATE.REF.isRunningSilent === "TOTALSILENCE") {
                STATE.REF.isRunningSilent = false
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
                        playSound(onSound, volume)
                }
                debugLines.push(`${D.JS(initialLoop)} --> ${D.JS(Media.LoopingSounds)}`)
                DB(`Update Sounds Test${isDoubleChecking ? " (1)" : " (2)"}<br>${debugLines.join("<br>")}`, "updateSounds")
                if (isDoubleChecking)
                    setTimeout(() => updateSounds(false), 5000)
            }
        },
        playSound = (soundRef, volume, fadeIn = null, isOverlapping = false) => {
            if (VAL({number: volume}))
                Roll20AM.ChangeVolume(soundRef, volume)
            if (!Roll20AM.IsPlaying(soundRef) || isOverlapping)
                Roll20AM.PlaySound(soundRef, undefined, fadeIn)
        },
        oldPlaySound = (soundRef, volume, isForcing = false) => { // For playing sounds WITHOUT engaging their playlists.
            const soundKey = getSoundKey(soundRef)
            if (soundKey && (isForcing || !isSoundPlaying(soundKey))) {
                const soundObj = getSoundObj(soundRef),
                    soundData = getSoundData(soundRef),
                    soundAttrs = {
                        playing: true,
                        softstop: false,
                        volume,
                        loop: soundData.isLooping
                    }
                if (soundData.playlist) {
                    const playlistData = getPlaylistData(soundData.playlist)
                    if (playlistData.currentTrack && !playlistData.canOverlap) {
                        stopSound(playlistData.currentTrack)
                        playlistData.currentTrack = soundKey
                        playlistData.isPlaying = false // False, because not engaging the playlist at all.
                        clearTimeout(listTimers[playlistData.name])
                        listTimers[playlistData.name] = null 
                    }
                }
            }
        },
        /* playTrack = (playlistRef, trackRef, volume, isForcing = false) => { // For playing sounds THROUGH their playlists.

        },
        playPlaylist = (playlistRef, volume) => {

        }, */
        stopSound = (soundRef, fadeOut = null) => {
            Roll20AM.StopSound(soundRef, fadeOut)
        }
    // #endregion

    return {
        CheckInstall: checkInstall,
        OnChatCall: onChatCall,
        OnGraphicAdd: onGraphicAdd,

        // REGISTRIES
        IMAGES: REGISTRY.IMG, TEXT: REGISTRY.TEXT, AREAS: REGISTRY.AREA, TOKENS: REGISTRY.TOKEN,

        // GENERAL MEDIA FUNCTIONS
        Get: getMediaObj,
        GetKey: getKey,
        GetData: getData,
        GetModeData: getModeData,
        IsRegistered: isRegistered,
        HasForcedState: hasForcedState,
        ModeUpdate: modeUpdate,
        IsActive: isObjActive,
        IsCyclingImg: isCyclingImg,
        Toggle: toggle,
        Adjust: adjustObj,
        
        // GETTERS
        GetImg: getImgObj, GetText: getTextObj,
        GetImgKey: getImgKey, GetTextKey: getTextKey,
        GetImgData: getImgData, GetTextData: getTextData,
        GetImgSrc: getImgSrc,
        GetToken: getTokenObj, GetTokens: getTokenObjs,
        GetLineHeight: getLineHeight, GetTextWidth: getTextWidth, GetTextHeight: getTextHeight,
        Buffer: buffer,

        // CONSTRUCTORS, REGISTERS & DESTROYERS
        MakeImg: makeImg, MakeText: makeText,
        RegImg: regImg, RegToken: regToken, RegText: regText,
        RemoveImg: removeImg, RemoveAllImgs: removeImgs, RemoveText: removeText, RemoveAllText: removeTexts,
        AddImgSrc: addImgSrc,

        // SETTERS
        SetImg: setImg, SetText: setText, SetToken: setTokenSrc, CombineTokenSrc: combineTokenSrc,
        ToggleImg: toggleImg, ToggleText: toggleText, ToggleToken: toggleToken, ToggleTokens: toggleTokens,
        CycleImg: cycleImg,
        SetImgData: setImgData, SetTextData: setTextData,
        SetImgTemp: setImgTemp, // SetTextTemp: setTextTemp,
        Spread: spreadImgs,

        // AREA FUNCTIONS
        GetBounds: getBounds, GetContents: getContainedImgObjs,
        GetContainedChars: (locRef, options) => getContainedImgObjs(locRef, Object.assign(options, {isCharsOnly: true})),
        SetArea: setImgArea,
        
        // ANIMATION FUNCTIONS
        ToggleAnim: toggleAnimation,
        Flash: flashAnimation,
        Pulse: activateAnimation,
        Kill: deactivateAnimation,
        SetAnimData: setAnimData,

        // SOUND FUNCTIONS
        ResetSoundModes: initSoundModes,
        UpdateSoundscape: updateSounds,
        get LoopingSounds() { return STATE.REF.loopingSounds },
        set LoopingSounds(soundRef) {
            if (soundRef)
                STATE.REF.loopingSounds = _.uniq([...STATE.REF.loopingSounds, soundRef])
            DB(`<b>Media.LoopingSounds = ${D.JSL(soundRef)}</b><br><br>Adding ${D.JS(soundRef)} to Looping Sounds: ${D.JS(STATE.REF.loopingSounds)}`, "updateSounds")
        },
        
        // REINITIALIZE MEDIA OBJECTS (i.e. on MODE CHANGE)
        Fix: () => {
            resetModeData(false)
            // setActiveLayers(false)
            setZIndices()
        }
    }
})()

on("ready", () => {
    Media.CheckInstall()
    D.Log("Media Ready!")
})
void MarkStop("Media")